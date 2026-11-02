// Runs the detector over the real piano recordings (decoded with ffmpeg).
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { detectPitch, detectPianoPitch, NoteTracker, rms } from '../js/pitch.js';
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

\n// Exercise the actual 4096-sample listening path on supplied real piano\n// recordings, not only on synthetic sine waves.\nfor (const name of ['C3','A3','C4','C5']) {\n  const raw = execFileSync('ffmpeg', ['-loglevel','error','-i',`audio/piano/${name}.mp3`,'-f','f32le','-ac','1','-ar',String(SR),'-']);\n  const pcm = new Float32Array(raw.buffer, raw.byteOffset, raw.length / 4);\n  const tr = new NoteTracker();\n  const events = [];\n  for (let i=0; i+4096<Math.min(pcm.length,SR*1.2); i+=HOP) {\n    const window = pcm.subarray(i,i+4096);\n    const midi = tr.push({level:rms(window)*0.3,pitch:detectPianoPitch(window,SR,{maxFreq:2400})});\n    if (midi!=null) events.push(midi);\n  }\n  assert.equal(events[0],toMidi(name),`4096-sample real piano recording ${name}: ${events}`);\n}\nconsole.log('Long-window C3, A3, C4 and C5 recorded piano tests passed');\n