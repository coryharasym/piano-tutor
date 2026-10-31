import { packSpectrum } from './chord-profile.js';

// Calibration uses its own measured room floor, not the note tracker's
// quiet-room gate. Short pitch dropouts must not erase a good sample.
export class KeyCapture {
  constructor(midi, noise, requireRelease = false) {
    this.midi = midi;
    this.noise = noise;
    this.armed = !requireRelease;
    this.frames = [];
    this.first = null;
    this.lastGood = null;
    this.quietSince = null;
  }

  push({ db, midi, clarity, level, now }) {
    const gate = Math.max(0.003, this.noise * 1.8);
    if (!this.armed) {
      if (level < gate) {
        if (this.quietSince == null) this.quietSince = now;
        if (now - this.quietSince >= 100) this.armed = true;
      } else this.quietSince = null;
      if (!this.armed) return { state: 'release', count: 0 };
    }
    const correct = midi != null && Math.abs(midi - this.midi) <= 0.45 && clarity >= 0.8;
    if (level < gate || !correct) {
      if (this.lastGood != null && now - this.lastGood > 350) {
        this.frames = []; this.first = null; this.lastGood = null;
      }
      return { state: level < gate ? 'quiet' : 'pitch', count: this.frames.length, heard: midi };
    }
    if (this.first == null) this.first = now;
    this.lastGood = now;
    if (now - this.first < 180) return { state: 'settling', count: 0 };
    const packed = packSpectrum(db);
    if (!packed) return { state: 'quiet', count: this.frames.length };
    this.frames.push(Array.from(atob(packed), v => v.charCodeAt(0)));
    if (this.frames.length < 12) return { state: 'holding', count: this.frames.length };
    const values = this.frames[0].map((_, bin) => {
      const column = this.frames.map(f => f[bin]).sort((a, b) => a - b);
      return column[Math.floor(column.length / 2)];
    });
    return { state: 'done', count: 12, sample: btoa(String.fromCharCode(...values)) };
  }
}
