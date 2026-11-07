import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readdirSync,readFileSync } from 'node:fs';
import { spectrum, N } from './piano-spectrum.mjs';
import { spectrumNoteEvidence } from '../js/pitch.js';
import { ChordTracker } from '../js/chord-tracker.js';
import { ChordCoach } from '../js/chord-coach.js';
import { Listener } from '../js/listen.js';
import { packSpectrum, PROFILE_VERSION } from '../js/chord-profile.js';
import { toMidi } from '../js/theory.js';

let clock = 0;
globalThis.performance = { now: () => clock };
import {UNITS,HYMNS,chooseRecital} from '../js/lessons/index.js';
import {buildPractice} from '../js/practice.js';
import {buildWarmup} from '../js/warmup.js';
import {buildLab,buildHymn} from '../js/musicianship-model.js';
const catalog=new Map();let occurrences=0;
const collect=lesson=>{for(const step of lesson.steps.filter(s=>s.t==='play'&&!s.anyOrder))for(const m of buildPractice(step).moments){const notes=[...new Set(m.items.map(i=>i.midi))].sort((a,b)=>a-b);if(notes.length>1){occurrences++;catalog.set(notes.join(','),notes);}}};
for(const unit of UNITS){for(const l of unit.lessons)collect(l);const rec=unit.lessons.at(-1);for(const p of rec.choices||[]){chooseRecital(unit.id,p.id);collect(rec);}}
for(const l of HYMNS)collect(l);
const done=Object.fromEntries(UNITS.flatMap(u=>u.lessons.map(l=>[l.id,true])));
for(const course of ['beginner','intermediate','advanced'])for(let day=1;day<=14;day++){collect(buildWarmup({},course,'2026-11-'+day));collect(buildWarmup(done,course,'2026-11-'+day));}
for(const course of ['beginner','intermediate','advanced']){for(let stage=0;stage<6;stage++)collect(buildHymn(stage,course));for(let variant=0;variant<10;variant++)collect(buildLab('sight',done,course,variant));}
console.log(`${catalog.size} unique chord voicings across ${occurrences} moments`);
let checks=0;const failures=[];const strictMisses=[];
const baseline=JSON.parse(readFileSync(new URL('./fixtures/uncalibrated-baseline.json',import.meta.url)));
const priorWait=new Set(baseline.acceptedWait),priorFlow=new Set(baseline.acceptedFlow),priorWrong=new Set(baseline.acceptedWrongOctaves);
let fullWait=0,fullFlow=0,negativeChecks=0,octaveControls=0,remainingOctaveErrors=0;
const newOctaveErrors=[];

for (const rate of [44100, 48000]) {
  const files = readdirSync('audio/piano').map(file => ({ file, midi: toMidi(file.replace('.mp3','').replace('s','#')) }));
  const decoded = new Map();
  const key = midi => {
    const nearest = [...files].sort((a,b) => Math.abs(a.midi-midi)-Math.abs(b.midi-midi))[0];
    if (!decoded.has(nearest.file)) {
      const raw = execFileSync('ffmpeg',['-loglevel','error','-i',`audio/piano/${nearest.file}`,'-f','f32le','-ac','1','-ar',String(rate),'-']);
      decoded.set(nearest.file, new Float32Array(raw.buffer,raw.byteOffset,raw.length/4));
    }
    const pcm = decoded.get(nearest.file), ratio = 2 ** ((midi-nearest.midi)/12);
    return Float32Array.from({length:Math.floor(pcm.length/ratio)-1},(_,i) => {
      const at=i*ratio, j=Math.floor(at); return pcm[j]*(1-(at-j))+pcm[j+1]*(at-j);
    });
  };
  const allNotes=[...new Set([...catalog.values()].flatMap(want=>want.flatMap(m=>[m,m-12,m+12,m-1,m+1])))].filter(m=>m>=24&&m<=96);
  const pcm=Object.fromEntries(allNotes.map(m=>[m,key(m)]));
  const spectra=new Map();
  const mix=(notes,t)=>{
    const key=[...notes].sort((a,b)=>a-b).join(',')+':'+t;
    if(!spectra.has(key))spectra.set(key,spectrum(Float32Array.from({length:N},(_,i)=>notes.reduce((sum,m)=>sum+(pcm[m][Math.floor(rate*t)+i]||0),0))));
    return spectra.get(key);
  };
  const make=()=>{const l=new Listener();l.active=true;l.time=new Float32Array(4096).fill(.03);l.analyser={context:{sampleRate:rate},fftSize:N,getFloatFrequencyData(){}};return l;};
  for(const want of catalog.values()) {
    for(const played of [want,...want.map(m=>[m])]) {
      const l=make();let accepted=false;
      for(const t of [.16,.24,.32]){clock+=80;l.freq=mix(played,t);accepted ||= l.chordHeard(want,{easy:true});}
      if(!accepted)failures.push({rate,want,played});checks++;
    }
    const trial=(played,strict=false)=>{
      const l=make();let accepted=false;
      for(const t of [.16,.24,.32]){clock+=80;l.freq=mix(played,t);accepted ||= l.chordHeard(want,{strict});}
      return accepted;
    };
    const accepted=trial(want),flow=trial(want,true),identity=rate+':'+want.join(',');
    fullWait+=accepted;fullFlow+=flow;
    if(!accepted)strictMisses.push({rate,want});
    if(priorWait.has(identity))assert.ok(accepted,'Preserve learned recognition: '+identity);
    if(priorFlow.has(identity))assert.ok(flow,'Preserve Flow recognition: '+identity);
    if(!make().hasOctavePair(want)) {
      const negatives=want.map((_,i)=>want.filter((_,j)=>j!==i));
      for(const shift of [-1,1]){const wrong=[...want];wrong[wrong.length-1]+=shift;if(!want.includes(wrong.at(-1)))negatives.push(wrong);}
      for(const played of negatives){assert.equal(trial(played),false,'Missing/wrong note: '+identity+'>'+played);assert.equal(trial(played,true),false,'Missing/wrong Flow note: '+identity+'>'+played);negativeChecks+=2;}
      for(let i=0;i<want.length;i++)for(const shift of [-12,12]){
        const played=[...want];played[i]+=shift;if(played[i]<24||played[i]>96||new Set(played).size!==want.length)continue;
        const wrong=trial(played),name=identity+'>'+played.join(',');octaveControls++;
        if(wrong){remainingOctaveErrors++;if(!priorWrong.has(name))newOctaveErrors.push(name);}
      }
    }
    const silent=make();silent.time.fill(0);
    for(const t of [.16,.24]){clock+=80;silent.freq=mix(want,t);assert.equal(silent.chordHeard(want,{easy:true}),false,'silence cannot pass');checks++;}
  }
}
console.log(JSON.stringify({checks,easyFailures:failures.length,strictMisses:strictMisses.length,strictOctaveMisses:strictMisses.filter(({want})=>want.some((m,i)=>want.some((n,j)=>i!==j&&n!==m&&(n-m)%12===0))).length,examples:failures.slice(0,15),strictExamples:strictMisses.slice(0,10)}));
assert.equal(failures.length,0,'Every catalog chord and each expected key must be accepted by Easy mode');
assert.deepEqual(newOctaveErrors,[],'No new wrong-octave passes');
console.log(JSON.stringify({fullWait,fullFlow,negativeChecks,octaveControls,remainingOctaveErrors,newOctaveErrors:newOctaveErrors.length}));
