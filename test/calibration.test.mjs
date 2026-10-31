import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { packSpectrum, buildChordModel, profileCompatible, PROFILE_VERSION, PROFILE_FFT as N } from '../js/chord-profile.js';
import { toMidi } from '../js/theory.js';
import { Listener } from '../js/listen.js';

// Real recorded piano keys, mixed as PCM BEFORE the FFT. No idealized
// spectra or arithmetic addition of templates in these regression checks.
function spectrum(pcm, offset = 0) {
  const re = new Float64Array(N), im = new Float64Array(N);
  for (let i = 0; i < N; i++) re[i] = (pcm[offset + i] || 0) *
    (0.42 - 0.5 * Math.cos(2 * Math.PI * i / N) + 0.08 * Math.cos(4 * Math.PI * i / N));
  for (let i = 1, j = 0; i < N; i++) {
    let bit = N >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) [re[i], re[j]] = [re[j], re[i]];
  }
  for (let size = 2; size <= N; size *= 2) {
    const half = size / 2;
    for (let start = 0; start < N; start += size) for (let k = 0; k < half; k++) {
      const a = start + k, b = a + half, angle = -2 * Math.PI * k / size;
      const r = re[b] * Math.cos(angle) - im[b] * Math.sin(angle);
      const v = re[b] * Math.sin(angle) + im[b] * Math.cos(angle);
      re[b] = re[a] - r; im[b] = im[a] - v; re[a] += r; im[a] += v;
    }
  }
  return Float32Array.from({length:N / 2}, (_, i) => 20 * Math.log10(Math.max(1e-7, Math.hypot(re[i], im[i]) / N)));
}

let checks = 0;
for (const rate of [44100, 48000]) {
  const samples = readdirSync('audio/piano').map(file => {
    const midi = toMidi(file.replace('.mp3', '').replace('s', '#'));
    return { file, midi };
  });
  const decoded = new Map();
  function key(midi) {
    const nearest = [...samples].sort((a, b) => Math.abs(a.midi - midi) - Math.abs(b.midi - midi))[0];
    if (!decoded.has(nearest.file)) {
      const raw = execFileSync('ffmpeg', ['-loglevel', 'error', '-i', `audio/piano/${nearest.file}`, '-f', 'f32le', '-ac', '1', '-ar', String(rate), '-']);
      decoded.set(nearest.file, new Float32Array(raw.buffer, raw.byteOffset, raw.length / 4));
    }
    const pcm = decoded.get(nearest.file), ratio = 2 ** ((midi - nearest.midi) / 12);
    return Float32Array.from({length: Math.floor(pcm.length / ratio) - 1}, (_, i) => {
      const at = i * ratio, a = Math.floor(at), frac = at - a;
      return pcm[a] * (1 - frac) + pcm[a + 1] * frac;
    });
  }
  const midis = [48,50,52,53,55,60,62,64,65,67];
  const pcm = Object.fromEntries(midis.map(m => [m,key(m)]));
  const profile = {version:PROFILE_VERSION,fftSize:N,sampleRate:rate,tuning:0,notes:{}};
  for (const m of midis) {
    const frames = Array.from({length:16}, (_, i) => atob(packSpectrum(spectrum(pcm[m], Math.floor(rate * (0.22 + i * 0.023))))));
    profile.notes[m] = btoa(String.fromCharCode(...Array.from({length:N/2}, (_, bin) =>
      frames.map(f => f.charCodeAt(bin)).sort((a,b) => a-b)[8])));
  }
  assert.ok(profileCompatible(profile,rate,0));
  assert.equal(profileCompatible(profile,rate+1,0),false);
  assert.equal(profileCompatible(profile,rate,0.2),false);
  assert.equal(buildChordModel(profile,[48,61]),null,'missing key needs calibration');
  assert.equal(buildChordModel({notes:{48:'broken',60:'bad'}},[48,60]),null);
  const mix = (notes, time, gains) => spectrum(Float32Array.from({length:N}, (_, i) =>
    notes.reduce((s,m,j) => s + (pcm[m][Math.floor(rate*time)+i] || 0) * (gains?.[j] ?? 1),0)));
  for (const want of [[48,60],[50,62],[52,64],[53,65],[55,67],[48,52,55],[60,64,67],[48,60,64]]) {
    const model = buildChordModel(profile,want);
    assert.ok(model);
    for (const time of [0.28,0.43,0.65]) {
      assert.ok(model(mix(want,time)), `full ${want} at ${time}s / ${rate}`); checks++;
      // Exhaust all proper nonempty subsets, not just individual notes.
      for (let mask=1; mask<(1<<want.length)-1; mask++) {
        const subset=want.filter((_,i)=>mask&(1<<i));
        assert.equal(model(mix(subset,time)),false, `incomplete ${subset} vs ${want} at ${time}s / ${rate}`); checks++;
      }
    }
    for (let quiet = 0; quiet < want.length; quiet++) {
      const gains = want.map((m,i) => {
        const b=pcm[m].subarray(Math.floor(rate*0.4),Math.floor(rate*0.6));
        const rms=Math.sqrt(b.reduce((s,v)=>s+v*v,0)/b.length);
        return (i===quiet?0.5:1)*0.03/rms;
      });
      // Match the listener's two consecutive 80ms checks, not a single
      // arbitrarily selected FFT frame (overlapping partials can beat).
      let stable=0, accepted=false;
      for (let t=0.24;t<=0.88;t+=0.08) {
        stable=model(mix(want,t,gains))?stable+1:0;
        if (stable>=2) accepted=true;
      }
      assert.ok(accepted, `quieter hand ${quiet} in ${want} / ${rate}`);
      checks++;
    }
    const wrong = midis.find(m => !want.includes(m));
    for (let replace = 0; replace < want.length; replace++) {
      const played = want.map((m,i) => i === replace ? wrong : m);
      assert.equal(model(mix(played,0.43)),false, `wrong key ${played} vs ${want} / ${rate}`);
      checks++;
    }
    assert.equal(model(new Float32Array(N/2).fill(-Infinity)),false,'silence');
    // Test Listener's actual model path, including its two-frame gate.
    const l = new Listener(); l.active=true; l.calibration=profile;
    l.time=new Float32Array(2048).fill(0.03); l.freq=mix(want,0.43);
    l.analyser={context:{sampleRate:rate},fftSize:N,getFloatFrequencyData(){}};
    assert.equal(l.chordHeard(want),false); assert.equal(l.chordHeard(want),true);
    l.clearRecent(); assert.equal(l.chordHeard(want),false,'held chord cannot repeat');
    l.consumedChord=null; l.freq=mix([want[0]],0.43);
    l.recent=want.map(midi=>({midi,t:performance.now()}));
    assert.equal(l.chordHeard(want),false,'history must not bypass a calibrated rejection');
    l.calibrating=true; l.freq=mix(want,0.43);
    assert.equal(l.chordHeard(want),false,'calibration cannot score the lesson');
    l.calibrating=false; l.muteUntil=performance.now()+1000;
    assert.equal(l.chordHeard(want),false,'app playback stays muted with calibration');
  }
}
console.log(`${checks} recorded-piano calibration and incomplete-chord checks passed`);

// Calibration persists locally but never travels with a progress backup.
const saved = new Map();
globalThis.localStorage = {getItem:k=>saved.get(k)||null,setItem:(k,v)=>saved.set(k,v)};
const { store } = await import('../js/store.js');
store.data.keyboardCalibration = {local:true}; store.markDone('hands-together');
assert.ok(JSON.parse(saved.get('piano-tutor:v1')).keyboardCalibration.local);
const backup = JSON.parse(store.backup());
assert.equal(backup.data.keyboardCalibration,undefined);
backup.data.keyboardCalibration = {foreign:true};
store.restore(JSON.stringify(backup));
assert.deepEqual(store.data.keyboardCalibration,{local:true});
assert.equal(store.isDone('hands-together'),true);
store.reset(); assert.equal(store.data.keyboardCalibration,undefined);
globalThis.localStorage.setItem=()=>{throw Error('quota exceeded');};
assert.equal(store.save(),false,'report session-only calibration if storage fails');
console.log('Calibration persistence, backup, restore and reset checks passed');
