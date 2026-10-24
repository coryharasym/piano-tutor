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
    const ctx = await piano.unlock();
    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
    });
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
  }

  tick() {
    const a = this.analyser;
    a.getFloatTimeDomainData(this.time);
    const level = rms(this.time);
    this.onLevel.forEach((fn) => fn(level));
    if (performance.now() < this.muteUntil) {
      this.tracker.push({ level: 0, pitch: null });
      return;
    }
    const pitch = level > 0.003 ? detectPitch(this.time, a.context.sampleRate, { maxFreq: 2400 }) : null;
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
    const c = chroma(this.freq, this.analyser.context.sampleRate, this.analyser.fftSize);
    const sorted = [...c].sort((x, y) => y - x);
    const cutoff = Math.max(0.18, sorted[pcs.length + 1] ?? 0);
    return rms(this.time) > 0.01 && pcs.every((pc) => c[pc] >= cutoff);
  }

  clearRecent() { this.recent = []; }
}

export const listener = new Listener();
