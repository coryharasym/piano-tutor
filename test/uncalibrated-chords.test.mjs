import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readdirSync} from 'node:fs';
import {spectrum,N} from './piano-spectrum.mjs';
import {toMidi} from '../js/theory.js';
import {Listener} from '../js/listen.js';
let clock=0;globalThis.performance={now:()=>clock};let checks=0;
for(const rate of [44100,48000]) {
 const files=readdirSync('audio/piano').map(file=>({file,midi:toMidi(file.replace('.mp3','').replace('s','#'))})),decoded=new Map(),notes=new Map();
 const key=midi=>{if(notes.has(midi))return notes.get(midi);const nearest=[...files].sort((a,b)=>Math.abs(a.midi-midi)-Math.abs(b.midi-midi))[0];if(!decoded.has(nearest.file)){const raw=execFileSync('ffmpeg',['-loglevel','error','-i',`audio/piano/${nearest.file}`,'-f','f32le','-ac','1','-ar',String(rate),'-']);decoded.set(nearest.file,new Float32Array(raw.buffer,raw.byteOffset,raw.length/4));}const a=decoded.get(nearest.file),ratio=2**((midi-nearest.midi)/12);const out=Float32Array.from({length:Math.floor(a.length/ratio)-1},(_,i)=>{const at=i*ratio,j=Math.floor(at);return a[j]*(1-(at-j))+a[j+1]*(at-j);});notes.set(midi,out);return out;};
 const mix=(played,t)=>{const arrays=played.map(key);return spectrum(Float32Array.from({length:N},(_,i)=>arrays.reduce((sum,a)=>sum+(a[Math.floor(rate*t)+i]||0),0)));};
 const run=(want,played,strict=false)=>{const l=new Listener();l.active=true;l.time=new Float32Array(4096).fill(.03);l.analyser={context:{sampleRate:rate},fftSize:N,getFloatFrequencyData(){}};let accepted=false;for(const t of [.16,.24,.32]){clock+=80;l.freq=mix(played,t);accepted ||= l.chordHeard(want,{strict});}checks++;return accepted;};
 const recovered=rate===44100?[[53,57,60],[48,53,57],[47,50,55],[53,60,69]]:[[47,50,55],[55,62,71],[53,59,62],[55,62,65,71]];
 for(const want of recovered){assert.ok(run(want,want),`recover quiet keys in ${want} / ${rate}`);for(let omit=0;omit<want.length;omit++)assert.equal(run(want,want.filter((_,i)=>i!==omit)),false,'missing key must not pass');}
 for(const [want,played] of [[[48,52,55],[48,40,55]],[[50,55,59],[50,55,47]],[[50,55,61,64],[50,55,49,64]],[[48,60],[48]],[[48,60],[60]],[[55,62],[55]]])for(const strict of [false,true])assert.equal(run(want,played,strict),false,`wrong octave/incomplete ${played} vs ${want}, ${rate}`);
}
console.log(`${checks} uncalibrated quiet-key, missing-note, wrong-octave and Flow regressions passed`);
