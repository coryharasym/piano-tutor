// Piano sound: Salamander Grand Piano samples, pitch-shifted to fill the gaps.
// Falls back to a soft synthesized tone if the samples can't load.

import { toMidi, midiToFreq } from './theory.js';

const SAMPLE_NAMES = [
  'A1', 'C2', 'Ds2', 'Fs2', 'A2', 'C3', 'Ds3', 'Fs3', 'A3', 'C4', 'Ds4', 'Fs4',
  'A4', 'C5', 'Ds5', 'Fs5', 'A5', 'C6', 'Ds6', 'Fs6', 'A6', 'C7',
];

class Piano {
  constructor() {
    this.ctx = null;
    this.buffers = new Map(); // midi -> AudioBuffer
    this.loading = null;
    this.master = null;
    this.volume = 0.8;
    this.listeners = new Set();
  }

  // Must be called from a user gesture on iOS.
  async unlock() {
    if (!this.ctx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new Ctx({ latencyHint: 'interactive' });
      this.master = this.ctx.createGain();
      this.master.gain.value = this.volume;
      const comp = this.ctx.createDynamicsCompressor();
      comp.threshold.value = -14;
      comp.ratio.value = 3;
      this.master.connect(comp).connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') await this.ctx.resume();
    if (!this.loading) this.loading = this.load();
    return this.ctx;
  }

  async load() {
    const base = new URL('../audio/piano/', import.meta.url);
    await Promise.all(SAMPLE_NAMES.map(async (n) => {
      try {
        const res = await fetch(new URL(`${n}.mp3`, base));
        const data = await res.arrayBuffer();
        const buf = await new Promise((ok, fail) => this.ctx.decodeAudioData(data, ok, fail));
        this.buffers.set(toMidi(n.replace('s', '#')), buf);
      } catch (e) {
        console.warn('Sample failed', n, e);
      }
    }));
  }

  setVolume(v) {
    this.volume = v;
    if (this.master) this.master.gain.value = v;
  }

  nearest(midi) {
    let best = null, bestDist = Infinity;
    for (const m of this.buffers.keys()) {
      const d = Math.abs(m - midi);
      if (d < bestDist) { best = m; bestDist = d; }
    }
    return best;
  }

  // Play a note now or at a scheduled time. Returns a handle with stop().
  play(midi, { when = 0, duration = 1.6, velocity = 0.8 } = {}) {
    if (!this.ctx) return { stop() {} };
    const t = Math.max(this.ctx.currentTime, when || this.ctx.currentTime);
    const out = this.ctx.createGain();
    out.connect(this.master);
    const sampleMidi = this.nearest(midi);
    let src;
    const peak = 0.25 + velocity * 0.75;

    if (sampleMidi != null) {
      src = this.ctx.createBufferSource();
      src.buffer = this.buffers.get(sampleMidi);
      src.playbackRate.value = Math.pow(2, (midi - sampleMidi) / 12);
      out.gain.setValueAtTime(peak, t);
      src.connect(out);
      src.start(t);
    } else {
      // Synth fallback: a few decaying harmonics, roughly piano-like.
      src = this.ctx.createGain();
      const f = midiToFreq(midi);
      [1, 2, 3, 4].forEach((h, i) => {
        const o = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        o.frequency.value = f * h;
        o.type = 'sine';
        g.gain.setValueAtTime(0.5 / (i + 1) ** 1.6, t);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 2.5 / (i + 1));
        o.connect(g).connect(src);
        o.start(t);
        o.stop(t + 3);
      });
      src.connect(out);
      out.gain.setValueAtTime(0, t);
      out.gain.linearRampToValueAtTime(peak * 0.6, t + 0.005);
    }

    const end = t + duration;
    out.gain.setTargetAtTime(0, end, 0.12);
    if (src.stop) src.stop(end + 1);
    this.listeners.forEach((fn) => fn(midi, t));

    return {
      stop: () => {
        const now = this.ctx.currentTime;
        out.gain.cancelScheduledValues(now);
        out.gain.setTargetAtTime(0, now, 0.08);
      },
    };
  }

  // Play a list of {midis, beats} at a tempo. Returns {cancel, done}.
  playSequence(events, { bpm = 80, onStep } = {}) {
    if (!this.ctx) return { cancel() {}, done: Promise.resolve() };
    const spb = 60 / bpm;
    let t = this.ctx.currentTime + 0.1;
    const timers = [];
    const handles = [];
    const start = performance.now() + 100;
    let elapsed = 0;
    events.forEach((ev, i) => {
      const dur = ev.beats * spb;
      ev.midis.forEach((m) => handles.push(this.play(m, { when: t, duration: Math.max(0.25, dur * 0.95) })));
      if (onStep) timers.push(setTimeout(() => onStep(i, ev), start - performance.now() + elapsed * 1000));
      t += dur;
      elapsed += dur;
    });
    let resolve;
    const done = new Promise((r) => { resolve = r; });
    timers.push(setTimeout(() => { onStep && onStep(-1); resolve(); }, elapsed * 1000 + 200));
    return {
      done,
      cancel: () => {
        timers.forEach(clearTimeout);
        handles.forEach((h) => h.stop());
        onStep && onStep(-1);
        resolve();
      },
    };
  }

  // A soft metronome click.
  click(when, accent = false) {
    if (!this.ctx) return;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.frequency.value = accent ? 1600 : 1100;
    g.gain.setValueAtTime(0.0001, when);
    g.gain.exponentialRampToValueAtTime(0.25, when + 0.002);
    g.gain.exponentialRampToValueAtTime(0.0001, when + 0.06);
    o.connect(g).connect(this.master);
    o.start(when);
    o.stop(when + 0.08);
  }

  // Soft "correct" chime, quiet enough not to confuse the mic.
  chime() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    [0, 0.07].forEach((d, i) => {
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = 'sine';
      o.frequency.value = i ? 1760 : 1318.5;
      g.gain.setValueAtTime(0.0001, t + d);
      g.gain.exponentialRampToValueAtTime(0.05, t + d + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + d + 0.35);
      o.connect(g).connect(this.master);
      o.start(t + d);
      o.stop(t + d + 0.4);
    });
  }
}

export const piano = new Piano();
