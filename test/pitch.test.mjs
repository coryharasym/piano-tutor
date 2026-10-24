import { detectPitch, NoteTracker, rms } from '../js/pitch.js';
import assert from 'node:assert';

const SR = 48000, N = 2048;
const f = (m) => 440 * 2 ** ((m - 69) / 12);
// Piano-ish tone: harmonics with slight inharmonicity, decaying envelope, a bit of noise.
function tone(midis, t0, amp = 0.4) {
  const buf = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    const t = t0 + i / SR;
    let v = 0;
    for (const m of midis) for (let h = 1; h <= 6; h++) {
      const fh = f(m) * h * Math.sqrt(1 + 0.0004 * h * h);
      v += (amp / h ** 1.2) * Math.exp(-t * (1.5 + h * 0.5)) * Math.sin(2 * Math.PI * fh * t);
    }
    buf[i] = v + (Math.random() - 0.5) * 0.002;
  }
  return buf;
}

let fails = 0;
for (let m = 36; m <= 96; m++) {
  const r = detectPitch(tone([m], 0.05), SR);
  const got = r ? Math.round(69 + 12 * Math.log2(r.freq / 440)) : null;
  if (got !== m) { fails++; console.log('miss', m, got, r && r.clarity.toFixed(2)); }
}
console.log('single-note misses:', fails);
assert.ok(fails <= 2);

// Repeated notes E E F G with a tracker, ~23 frames per note at 43 fps.
const tr = new NoteTracker();
const seq = [64, 64, 65, 67];
const heard = [];
for (const m of seq) {
  for (let k = 0; k < 20; k++) {
    const b = tone([m], k * 0.023);
    const r = tracker(b);
    if (r != null) heard.push(r);
  }
}
function tracker(b) { return tr.push({ level: rms(b), pitch: detectPitch(b, SR) }); }
console.log('heard', heard);
assert.deepStrictEqual(heard, seq);
console.log('ok');
