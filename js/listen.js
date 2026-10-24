// Microphone listening: turns what the phone hears into "note played" events.

import { detectPitch, rms, chroma, NoteTracker } from './pitch.js';
import { piano } from './audio.js';

class Listener {
  constructor() {
    this.active = false;
    this.stream = null;
    this.analyser = null;
    this.tracker = new NoteTracker();
    this.onNote = new Set();
    this.onLevel = new Set();
    this.muteUntil = 0;
    this.recent = []; // [{midi, t}] for arpeggiated chord checks
    this.timer = null;
    this.tuning = 0; // semitones the player's piano (or this phone) sounds sharp
    this.onRaw = new Set(); // unrounded, untuned pitch readings, for tuning
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
    this.analyser.fftSize = 4096;
    this.analyser.smoothingTimeConstant = 0.2;
    src.connect(this.analyser);
    this.time = new Float32Array(2048);
    this.freq = new Float32Array(this.analyser.frequencyBinCount);
    this.active = true;
    this.timer = setInterval(() => this.tick(), 23);
    return true;
  }

  stop() {
    this.active = false;
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
    a.getFloatTimeDomainData(this.time);
    const level = rms(this.time);
    const now = performance.now();
    this.history.push({ t: now, level });
    while (this.history.length && now - this.history[0].t > 3000) this.history.shift();
    this.onLevel.forEach((fn) => fn(level));
    if (performance.now() < this.muteUntil) {
      this.tracker.push({ level: 0, pitch: null });
      return;
    }
    const raw = level > 0.003 ? detectPitch(this.time, a.context.sampleRate, { maxFreq: 2400 }) : null;
    if (raw && raw.clarity > 0.9) this.onRaw.forEach((fn) => fn(69 + 12 * Math.log2(raw.freq / 440), level));
    const pitch = raw && { ...raw, freq: raw.freq * 2 ** (-this.tuning / 12) };
    const midi = this.tracker.push({ level, pitch });
    if (midi != null) {
      const now = performance.now();
      this.recent = this.recent.filter((r) => now - r.t < 2500);
      this.recent.push({ midi, t: now });
      this.onNote.forEach((fn) => fn(midi, 'mic'));
    }
  }

  // Do the required pitch classes sound together right now, or were they
  // all heard one after another in the last couple of seconds?
  chordHeard(pcs) {
    if (!this.active) return false;
    const now = performance.now();
    const seen = new Set(this.recent.filter((r) => now - r.t < 2500).map((r) => r.midi % 12));
    if (pcs.every((pc) => seen.has(pc))) return true;
    if (performance.now() < this.muteUntil) return false;
    this.analyser.getFloatFrequencyData(this.freq);
    const c = chroma(this.freq, this.rate, this.analyser.fftSize);
    const sorted = [...c].sort((x, y) => y - x);
    const cutoff = Math.max(0.18, sorted[pcs.length + 1] ?? 0);
    return rms(this.time) > 0.01 && pcs.every((pc) => c[pc] >= cutoff);
  }

  clearRecent() { this.recent = []; }

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
