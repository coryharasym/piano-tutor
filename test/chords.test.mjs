import assert from 'node:assert/strict';
import { spectrumHasNotes } from '../js/pitch.js';
import { Listener } from '../js/listen.js';
// Blackman-window DFT at the bins around each synthetic piano partial.
// Deterministic spectra include leakage, inharmonicity and unequal hands.
function spectrum(notes, rate, tuning = 0) {
  const n = 8192, db = new Float32Array(n / 2).fill(-100);
  const tones = notes.flatMap(([m, amp]) => Array.from({length: 6}, (_, k) => {
    const h = k + 1;
    return { f: 440 * 2 ** ((m - 69 + tuning) / 12) * h * Math.sqrt(1 + 0.0001 * h * h), a: amp / h ** 1.2 };
  }));
  const bins = new Set();
  for (const t of tones) for (let j = -4; j <= 4; j++) bins.add(Math.round(t.f * n / rate) + j);
  for (const bin of bins) {
    if (bin < 1 || bin >= db.length) continue;
    let re = 0, im = 0;
    for (let i = 0; i < n; i++) {
      const w = 0.42 - 0.5 * Math.cos(2 * Math.PI * i / n) + 0.08 * Math.cos(4 * Math.PI * i / n);
      const v = tones.reduce((s, t) => s + t.a * Math.sin(2 * Math.PI * t.f * i / rate), 0) * w;
      re += v * Math.cos(2 * Math.PI * bin * i / n);
      im -= v * Math.sin(2 * Math.PI * bin * i / n);
    }
    db[bin] = 20 * Math.log10(Math.hypot(re, im) / n);
  }
  return db;
}
for (const rate of [44100, 48000]) {
  for (const notes of [[48, 64], [60, 64], [60, 67], [48, 52, 55], [60, 61]]) {
    const db = spectrum(notes.map((m, i) => [m, i ? 0.035 : 0.3]), rate);
    assert.ok(spectrumHasNotes(db, rate, 8192, notes), `unequal chord ${notes} at ${rate}`);
  }
  const solo = spectrum([[60, 0.3]], rate);
  assert.equal(spectrumHasNotes(solo, rate, 8192, [60, 64]), false, 'missing third');
  assert.equal(spectrumHasNotes(solo, rate, 8192, [60, 67]), false, 'overtone is not a fifth');
  assert.equal(spectrumHasNotes(solo, rate, 8192, [60, 72]), false, 'overtone is not an octave');
  assert.equal(spectrumHasNotes(solo, rate, 8192, [60, 61]), false, 'leakage is not a semitone');
  const tuned = spectrum([[60, 0.3], [64, 0.05]], rate, 0.4);
  assert.ok(spectrumHasNotes(tuned, rate * 2 ** (-0.4 / 12), 8192, [60, 64]));
}
assert.equal(spectrumHasNotes(new Float32Array(4096).fill(-Infinity), 48000, 8192, [60,64]), false);
const l = new Listener();
l.active = true;
l.time = new Float32Array(2048).fill(0.03);
l.freq = spectrum([[60, 0.3], [64, 0.05]], 48000);
l.analyser = { context: {sampleRate: 48000}, fftSize: 8192, getFloatFrequencyData() {} };
assert.equal(l.chordHeard([60,64]), false);
assert.equal(l.chordHeard([60,64]), true);
l.clearRecent();
assert.equal(l.chordHeard([60,64]), false, 'held chord does not repeat');
l.analyser.getFloatTimeDomainData = buf => buf.fill(0);
l.tick();
assert.equal(l.consumedChord, null, 'release rearms repeated chord');
l.recent = [60,64].map(midi => ({midi,t:performance.now()}));
l.muteUntil = performance.now() + 1000;
assert.equal(l.chordHeard([60,64]), false, 'mute precedes history');
l.muteUntil = 0;
l.freq.fill(-Infinity);
assert.equal(l.chordHeard([60,64], {allowRecent:false}), false, 'Flow ignores history');
assert.equal(l.chordHeard([60,64]), true, 'rolled fallback still works');
l.clearRecent();
assert.equal(l.chordHeard([60,64]), false, 'history cleared at next moment');
console.log('chord regression tests ok');
