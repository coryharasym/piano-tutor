import assert from 'node:assert/strict';
import { KeyCapture } from '../js/key-capture.js';
import { execFileSync } from 'node:child_process';
import { detectPitch, rms } from '../js/pitch.js';

const db = new Float32Array(4096).fill(-100);
db[45] = -25; db[90] = -35;
const frame = (now, overrides = {}) => ({ db, midi: 60, clarity: 0.84, level: 0.04, now, ...overrides });

// Reproduce the old deadlock: room noise never drops below its 0.003 gate.
// The first key needs no silent frame after measuring this room floor.
let key = new KeyCapture(60, 0.008);
let result;
for (let i = 0; i < 30; i++) {
  result = key.push(frame(i * 50, i % 5 === 0 ? {midi:null,clarity:0.5} : {}));
  if (result.state === 'done') break;
}
assert.equal(result.state, 'done', 'ambient noise and brief pitch gaps must not stall the first key');
assert.equal(atob(result.sample).length,4096);

key = new KeyCapture(60,0.008);
for (let i=0;i<30;i++) assert.notEqual(key.push(frame(i*50,{midi:72})).state,'done','wrong octave cannot train');
for (let i=0;i<30;i++) assert.notEqual(key.push(frame(i*50,{level:0.008})).state,'done','room noise cannot train');

key = new KeyCapture(48,0.008,true);
assert.equal(key.push(frame(0,{midi:48})).state,'release');
key.push(frame(50,{level:0.008,midi:null}));
key.push(frame(150,{level:0.008,midi:null}));
assert.equal(key.armed,true,'release uses this room floor, not absolute silence');
for (let i=0;i<30;i++) {
  result=key.push(frame(200+i*50,{midi:48}));
  if(result.state==='done') break;
}
assert.equal(result.state,'done');

key = new KeyCapture(60,0.008);
for(let i=0;i<9;i++) key.push(frame(i*50));
const count=key.frames.length;
key.push(frame(500,{midi:null}));
assert.equal(key.frames.length,count,'short uncertainty preserves collected frames');
key.push(frame(900,{midi:62}));
assert.equal(key.frames.length,0,'a sustained wrong key resets the sample');

// Exercise the longer calibration pitch window on recorded low keys as
// well as Middle C, at both microphone rates used by the chord tests.
for (const rate of [44100,48000]) for (const [name,midi] of [['C2',36],['C3',48],['C4',60]]) {
  const raw=execFileSync('ffmpeg',['-loglevel','error','-i',`audio/piano/${name}.mp3`,'-f','f32le','-ac','1','-ar',String(rate),'-']);
  const pcm=new Float32Array(raw.buffer,raw.byteOffset,raw.length/4);
  const capture=new KeyCapture(midi,0.002);
  let accepted=false;
  for(let ms=220;ms<1700;ms+=50) {
    const offset=Math.floor(ms*rate/1000), buf=pcm.subarray(offset,offset+4096);
    const pitch=detectPitch(buf,rate,{maxFreq:2400});
    const heard=pitch?69+12*Math.log2(pitch.freq/440):null;
    const result=capture.push({db,midi:heard,clarity:pitch?.clarity||0,level:rms(buf),now:ms});
    if(result.state==='done'){accepted=true;break;}
  }
  assert.ok(accepted,`${name} calibration progresses using recorded audio at ${rate}`);
}
console.log('Calibration first-key, ambient-noise, dropout, octave and release regressions passed');
