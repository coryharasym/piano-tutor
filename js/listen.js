// Microphone listening: turns what the phone hears into "note played" events.

import { detectPianoPitch, rms, spectrumNoteEvidence, NoteTracker } from './pitch.js';
import { piano } from './audio.js';
import { buildChordModel, profileCompatible } from './chord-profile.js';
import { ChordTracker } from './chord-tracker.js';

export class Listener {
  constructor() {
    this.active = false;
    this.stream = null;
    this.analyser = null;
    this.tracker = new NoteTracker();
    this.onNote = new Set();
    this.onLevel = new Set();
    this.muteUntil = 0;
    this.chords = new ChordTracker();
    this.chordStatus = { detected: [], audible: false };
    this.timer = null;
    this.tuning = 0; // semitones the player's piano (or this phone) sounds sharp
    this.onRaw = new Set(); // unrounded, untuned pitch readings, for tuning
    this.onSpectrum = new Set();
    this.calibration = null;
    this.calibrating = false;
    this.history = []; // [{t, level}] for the last few seconds, for loudness and length


    // Ignore the mic briefly while the app itself is making sound,
    // so the demo playback isn't mistaken for the player.
    piano.listeners.add((midi, when) => {
      const ctx = piano.ctx;
      const startsIn = Math.max(0, when - ctx.currentTime) * 1000;
      this.muteUntil = Math.max(this.muteUntil, performance.now() + startsIn + 700);
    });
  }

  async start() {
    if (this.active) return true;
    await piano.unlock();
    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
    });
    // The mic gets its own audio context, made after the mic is on. iPhones
    // switch the hardware sample rate when recording starts; a context made
    // earlier keeps the old rate and hears every note about a semitone off.
    const Ctx = window.AudioContext || window.webkitAudioContext;
    const ctx = new Ctx();
    if (ctx.state === 'suspended') await ctx.resume();
    this.ctx = ctx;
    const src = ctx.createMediaStreamSource(this.stream);
    this.analyser = ctx.createAnalyser();
    this.analyser.fftSize = 8192;
    this.analyser.smoothingTimeConstant = 0;
    src.connect(this.analyser);
    this.time = new Float32Array(4096);
    this.freq = new Float32Array(this.analyser.frequencyBinCount);
    this.clearRecent();
    this.tracker = new NoteTracker();
    this.consumedChord = null;
    this.active = true;
    this.timer = setInterval(() => this.tick(), 23);
    return true;
  }

  stop() {
    this.active = false;
    this.clearRecent();
    clearInterval(this.timer);
    this.stream?.getTracks().forEach((t) => t.stop());
    this.stream = null;
    this.ctx?.close();
    this.ctx = null;
  }

  // The sample rate, nudged so the player's tuning reads as concert pitch.
  get rate() { return this.analyser.context.sampleRate * 2 ** (-this.tuning / 12); }

  tick() {
    const a = this.analyser;
    const now = performance.now();
    // A longer window steadies low-note calibration. Run it at ~20 Hz so
    // the extra work does not overload a phone while learning each key.
    if (this.calibrating && now - (this.lastCalibrationTick || 0) < 45) return;
    if (this.calibrating) this.lastCalibrationTick = now;
    const time = this.time; // The same long window serves normal lessons and calibration.
    a.getFloatTimeDomainData(time);
    const level = rms(time);
    this.history.push({ t: now, level });
    while (this.history.length && now - this.history[0].t > 3000) this.history.shift();
    const gate = Math.max(0.003, this.tracker.noiseFloor * 3.5);
    if (level < gate || (now - (this.chordConsumedAt ?? -Infinity) > 180 &&
        level > this.tracker.prevLevel * 1.35 && level - this.tracker.prevLevel > gate * 0.5)) this.consumedChord = null;
    this.onLevel.forEach((fn) => fn(level));
    if (performance.now() < this.muteUntil) {
      this.tracker.push({ level: 0, pitch: null });
      return;
    }
    const raw = level > 0.003 ? detectPianoPitch(time, a.context.sampleRate, { maxFreq: 2400 }) : null;
    if (raw && raw.clarity > 0.9) this.onRaw.forEach((fn) => fn(69 + 12 * Math.log2(raw.freq / 440), level));
    const pitch = raw && { ...raw, freq: raw.freq * 2 ** (-this.tuning / 12) };
    if (this.onSpectrum.size) {
      a.getFloatFrequencyData(this.freq);
      const midi = pitch ? 69 + 12 * Math.log2(pitch.freq / 440) : null;
      this.onSpectrum.forEach(fn => fn({ db: this.freq, midi, clarity: pitch?.clarity || 0, level, now }));
    }
    const midi = this.tracker.push({ level, pitch });
    if (midi != null && !this.calibrating) {
      this.onNote.forEach((fn) => fn(midi, 'mic'));
    }
  }

  // Track each expected key independently. Wait practice tolerates a brief
  // masked partial; timed Flow still requires two complete current frames.
  chordHeard(midis, { strict = false } = {}) {
    const now = performance.now();
    if (!this.active || this.calibrating || now < this.muteUntil) {
      this.chordFrames = 0;
      this.chords.reset();
      this.chordStatus = { detected: [], audible: false };
      return false;
    }
    const key = [...new Set(midis)].sort((a, b) => a - b).join(',');
    if (key === this.consumedChord) {
      this.chordStatus = { detected: [], audible: true, needsAttack: true };
      return false;
    }
    if (key !== this.chordKey) { this.chordKey = key; this.chordFrames = 0; }
    const calibrated = profileCompatible(this.calibration, this.analyser.context.sampleRate, this.tuning);
    const modelKey = `${key}:${calibrated}`;
    if (this.modelProfile !== this.calibration || this.modelKey !== modelKey) {
      this.modelProfile = this.calibration;
      this.modelKey = modelKey;
      this.chordModel = calibrated ? buildChordModel(this.calibration, midis) : null;
    }
    const octavePair = this.hasOctavePair(midis);
    this.analyser.getFloatFrequencyData(this.freq);
    const audible = rms(this.time) > Math.max(0.003, this.tracker.noiseFloor * 3.5);
    const evidence = audible ? spectrumNoteEvidence(this.freq, this.rate, this.analyser.fftSize, midis) : [];
    const modelHeard = audible && this.chordModel?.(this.freq);
    // A complete calibration remains the authority when available, and
    // octaves always need it. Per-note partials still explain what is audible
    // when the stricter model cannot confirm every played key.
    const detected = modelHeard ? [...new Set(midis)] : evidence;
    const complete = !!modelHeard || (!this.chordModel && !octavePair && detected.length === new Set(midis).size && midis.length > 0);
    const heard = this.chords.push(midis, detected, { now, audible, complete, strict, requireComplete: octavePair || !!this.chordModel });
    this.chordStatus = { detected: this.chords.detected, audible };
    this.chordFrames = heard ? 2 : 0;
    return heard;
  }

  // A single microphone spectrum cannot reliably distinguish an upper note
  // from the identical overtone of a lower note. For octave chords, recorded
  // single-key fingerprints are needed to avoid false positives.
  hasOctavePair(midis) {
    return midis.some((m, i) => midis.some((n, j) => j !== i && n !== m && (n - m) % 12 === 0));
  }

  needsChordCalibration(midis) {
    if (!this.hasOctavePair(midis) || !this.analyser) return this.hasOctavePair(midis);
    if (!profileCompatible(this.calibration, this.analyser.context.sampleRate, this.tuning)) return true;
    return midis.some(m => typeof this.calibration.notes?.[m] !== 'string' || this.calibration.notes[m].length !== 5464);
  }

  clearRecent() {
    if (this.chordFrames >= 2) {
      this.consumedChord = this.chordKey;
      this.chordConsumedAt = performance.now();
    }
    this.chordFrames = 0; this.chordKey = '';
    this.chords.reset();
    this.chordStatus = { detected: [], audible: false };
  }

  // How loud a note heard at time t was at its start, and how much of that
  // was still sounding 300 ms later (short for staccato, long for legato).
  // Call it at least 400 ms after t.
  noteShape(t) {
    const near = (a, b) => this.history.filter((x) => x.t >= t + a && x.t <= t + b).map((x) => x.level);
    const peak = Math.max(0, ...near(-250, 120));
    const later = near(300, 400);
    const tail = later.length ? later.reduce((a, b) => a + b, 0) / later.length : 0;
    return { peak, sustain: peak ? tail / peak : 0 };
  }
}

export const listener = new Listener();
