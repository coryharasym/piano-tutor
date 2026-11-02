import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { spectrum, N } from './piano-spectrum.mjs';
import { spectrumNoteEvidence } from '../js/pitch.js';
import { ChordTracker } from '../js/chord-tracker.js';
import { ChordCoach } from '../js/chord-coach.js';
import { Listener } from '../js/listen.js';
import { packSpectrum, PROFILE_VERSION } from '../js/chord-profile.js';
import { toMidi } from '../js/theory.js';

let clock = 0;
globalThis.performance = { now: () => clock };
let checks = 0;
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
  const pcm=Object.fromEntries([40,48,49,50,52,55,59,60,62,64,65,67].map(m=>[m,key(m)]));
  // Mix BEFORE the FFT, with independent attack times and real decay tails.
  const mix=(notes,t,gains=[],delays=[])=>spectrum(Float32Array.from({length:N},(_,i)=>notes.reduce((sum,m,j)=>{
    const at=Math.floor(rate*(t-(delays[j]||0)))+i;
    return sum+(at<0?0:(pcm[m][at]||0))*(gains[j]??1);
  },0)));
  const makeListener=()=>{
    const l=new Listener(); l.active=true; l.time=new Float32Array(4096).fill(.03);
    l.analyser={context:{sampleRate:rate},fftSize:N,getFloatFrequencyData(){}};
    return l;
  };
  for(const want of [[48,64],[55,62],[60,64],[48,52,55]]) {
    for(let quiet=0;quiet<want.length;quiet++) for(const delay of [0,.12]) {
      const l=makeListener(); let accepted=false;
      if (want.length > 2) {
        l.calibration={version:PROFILE_VERSION,fftSize:N,sampleRate:rate,tuning:0,notes:{}};
        for(const m of want)l.calibration.notes[m]=packSpectrum(mix([m],.3));
      }
      // Exercise both a softer hand and a bass held 650ms before the melody.
      const gains=want.map((m,i)=>{
        if (want.length === 2) return i===quiet?.1:1;
        const b=pcm[m].subarray(Math.floor(rate*.2),Math.floor(rate*.6));
        const level=Math.sqrt(b.reduce((s,v)=>s+v*v,0)/b.length);
        return .03/level*(i===quiet?.5:1);
      });
      for(let t=.08;t<=.88;t+=.08) {
        clock+=80; l.freq=mix(want,t,gains,want.map((_,i)=>i?delay:0));
        accepted ||= l.chordHeard(want);
      }
      assert.ok(accepted,`quiet ${quiet}, delay ${delay}, chord ${want}, ${rate}`); checks++;
    }
    for(let mask=1;mask<(1<<want.length)-1;mask++) {
      const l=makeListener(), subset=want.filter((_,i)=>mask&(1<<i));
      for(let t=.08;t<=.88;t+=.08) {
        clock+=80;l.freq=mix(subset,t);
        assert.equal(l.chordHeard(want),false,`missing notes ${subset} vs ${want}, ${rate}`);checks++;
      }
    }
    for(let replace=0;replace<want.length;replace++) {
      const played=want.map((m,i)=>i===replace?59:m),l=makeListener();
      for(let t=.08;t<=.88;t+=.08) {
        clock+=80;l.freq=mix(played,t);
        assert.equal(l.chordHeard(want),false,`wrong notes ${played} vs ${want}, ${rate}`);checks++;
      }
    }
  }
  for(const quiet of [0,1]) {
    const l=makeListener();let accepted=false;
    for(let t=.2;t<=.9;t+=.08){clock+=80;l.freq=mix([48,64],t,quiet?[1,.05]:[.05,1]);accepted ||= l.chordHeard([48,64]);}
    assert.ok(accepted,`C3+E4 at 20:1 sample gain, quiet ${quiet}, ${rate}`);checks++;
  }
  const held=makeListener();let accepted=false;
  for(let t=.8;t<=1.2;t+=.08){clock+=80;held.freq=mix([48,64],t,[.25,1],[0,.65]);accepted ||= held.chordHeard([48,64]);}
  assert.ok(accepted,`sustained C3 beneath fresh E4, ${rate}`);checks++;
  for(const [want,played] of [[[48,52,55],[48,40,55]],[[48,64],[48,49]],[[60,64],[48,64]]]) {
    const l=makeListener();
    for(let t=.16;t<=.8;t+=.08){clock+=80;l.freq=mix(played,t);assert.equal(l.chordHeard(want),false,`wrong octave/adjacent bass ${played} vs ${want}, ${rate}`);checks++;}
  }

  const l=makeListener();
  l.calibration={version:PROFILE_VERSION,fftSize:N,sampleRate:rate,tuning:0,notes:{}};
  for(const m of [48,64])l.calibration.notes[m]=packSpectrum(mix([m],.3));
  accepted=false;
  for(let t=.2;t<=.9;t+=.08){clock+=80;l.freq=mix([48,64],t,[1,.5]);accepted ||= l.chordHeard([48,64]);}
  assert.ok(accepted,`saved calibration still recognizes C3+E4, ${rate}`);checks++;
  for(let t=.2;t<=.9;t+=.08){
    clock+=80;l.clearRecent();l.freq=mix([48],t);
    assert.deepEqual(spectrumNoteEvidence(l.freq,rate,N,[48,60]),[48],'upper C harmonic is not a played key');
    assert.equal(l.chordHeard([48,60]),false,'uncalibrated octave cannot pass');checks++;
  }
}

const tracker=new ChordTracker(), want=[48,64];
const push=(t,notes,options={})=>tracker.push(want,notes,{now:t,audible:true,complete:notes.length===2,...options});
assert.equal(push(0,want),false);
assert.equal(push(80,[48]),false);
assert.equal(push(160,want),true,'masked partial gets brief sustain grace');
assert.deepEqual(tracker.detected,want);
assert.equal(push(400,[48]),false,'stale upper note expires');
tracker.reset();
assert.equal(push(0,want,{strict:true}),false);
assert.equal(push(80,[48],{strict:true}),false);
assert.equal(push(160,want,{strict:true}),false,'Flow requires consecutive complete spectra');
assert.equal(push(240,want,{strict:true}),true);
tracker.reset();
push(0,[48]);push(80,[48]);push(320,[64]);
assert.equal(push(400,[64]),false,'non-overlapping notes do not silently become a chord');
tracker.reset();push(0,want);
assert.equal(tracker.push(want,[],{now:80,audible:false,complete:false}),false);
assert.deepEqual(tracker.detected,[],'silence clears sustained evidence');
tracker.reset();push(0,want);
assert.equal(tracker.push([55,62],[55,62],{now:80,audible:true,complete:true}),false,'new target has no stale evidence');

const nodes={};
const root={querySelector:s=>nodes[s]??=( {textContent:'',hidden:true,setAttribute(){},addEventListener(_,fn){this.click=fn;}} )};
const coach=new ChordCoach(root,{clock:()=>clock});
coach.update(want,{detected:[48]});
assert.match(nodes['.chord-readout'].textContent,/Hearing C3; waiting for E4/);
coach.update(want,{detected:[48]},{revealTargets:false});
assert.match(nodes['.chord-readout'].textContent,/waiting for the other note/,'hidden learning hints remain hidden');
coach.update(want,{detected:[48]});
assert.equal(coach.button.hidden,true);
clock+=5100;coach.update(want,{detected:[48]});assert.equal(coach.button.hidden,false);
coach.button.click();assert.equal(coach.assisted,true);
assert.equal(coach.takeNote(64),false,'assist requires the requested note order');
assert.equal(coach.takeNote(48),false);assert.equal(coach.takeNote(64),false,'release is required between assisted notes');
coach.observeLevel(0);clock+=100;coach.observeLevel(0);assert.equal(coach.takeNote(64),true);
coach.reset();coach.update(want);clock+=5100;coach.update(want);coach.button.click();
coach.update(want,{}, {canAssist:false});
assert.equal(coach.assisted,false,'Flow cannot inherit assistance');assert.equal(coach.button.hidden,true);
coach.update([],{}, {active:false});assert.equal(root.hidden,true,'inactive microphone hides diagnostics');
console.log(`${checks} real-piano chord checks plus sustain, masking, Flow, expiry and explicit-assistance regressions passed`);
