// Runs the detector over the real piano recordings (decoded with ffmpeg).
import { execFileSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { detectPitch, NoteTracker, rms } from '../js/pitch.js';
import { toMidi } from '../js/theory.js';
const SR = 48000, N = 2048, HOP = 1116; // ~43 frames/s like requestAnimationFrame-ish
let bad = 0;
for (const file of readdirSync('audio/piano')) {
  const name = file.replace('.mp3', '').replace('s', '#');
  const want = toMidi(name);
  if (want > toMidi('C6')) continue; // lessons stay below this
  const raw = execFileSync('ffmpeg', ['-loglevel', 'error', '-i', `audio/piano/${file}`, '-f', 'f32le', '-ac', '1', '-ar', String(SR), '-']);
  const pcm = new Float32Array(raw.buffer, raw.byteOffset, raw.length / 4);
  const tr = new NoteTracker();
  const ev = [];
  for (let i = 0; i + N < pcm.length; i += HOP) {
    const b = pcm.subarray(i, i + N);
    const m = tr.push({ level: rms(b) * 0.3, pitch: detectPitch(b, SR, { maxFreq: 2400 }) });
    if (m != null) ev.push([m, (i / SR).toFixed(2)]);
  }
  const ok = ev.length >= 1 && ev[0][0] === want;
  if (!ok || ev.length > 1) { bad += ok ? 0 : 1; console.log(name, want, JSON.stringify(ev)); }
}
console.log('wrong first detections:', bad);
if (bad) process.exit(1);
