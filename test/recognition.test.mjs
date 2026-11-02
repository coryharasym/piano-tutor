import assert from 'node:assert/strict';
import { detectPianoPitch, NoteTracker, rms } from '../js/pitch.js';
import { Listener } from '../js/listen.js';
import { packSpectrum, PROFILE_VERSION, PROFILE_FFT } from '../js/chord-profile.js';

const hz = midi => 440 * 2 ** ((midi - 69) / 12);
// Realistic multi-partial piano tones, with slight string inharmonicity.
// Exercise C3 (lower C), C4 (Middle C), their neighbours and higher keys.
function tone(midi, rate, start = 0.065) {
  return Float32Array.from({length:4096}, (_, i) => {
    const t = start + i / rate;
    let sample = 0;
    for (let h = 1; h <= 6; h++)
      sample += 0.4 / h ** 1.2 *
        Math.sin(2 * Math.PI * hz(midi) * h * Math.sqrt(1 + 0.0001 * h * h) * t);
    return sample;
  });
}

let checks = 0;
for (const rate of [44100,48000]) {
  for (const midi of [48,50,55,60,62,64,67,72,79,84]) {
    const sample = tone(midi, rate);
    const detected = detectPianoPitch(sample, rate, {maxFreq:2400});
    const got = detected && Math.round(69 + 12 * Math.log2(detected.freq / 440));
    assert.equal(got, midi, `long-window key ${midi} at ${rate}Hz`);
    assert.ok(detected.clarity >= 0.8, `clarity for ${midi} at ${rate}Hz`);
    checks++;
  }
  // Repeated low notes should register after release rather than staying
  // locked to their earlier attack.
  const tracker = new NoteTracker();
  const heard = [];
  for (const midi of [48,48,55,60]) {
    for (let i=0; i<5; i++) tracker.push({level:0,pitch:null});
    for (let i=0; i<8; i++) {
      const sample=tone(midi,rate,0.05 + i*0.023);
      const detected=detectPianoPitch(sample,rate,{maxFreq:2400});
      const result=tracker.push({level:rms(sample)*0.3,pitch:detected});
      if (result != null) heard.push(result);
    }
  }
  assert.deepEqual(heard,[48,48,55,60],`low-note repeat tracking at ${rate}Hz`);
  checks++;
}

// Every course shares Listener.chordHeard(). An uncalibrated microphone
// must explicitly ask to learn both Cs, not pretend a bass C harmonic proves
// that the player also pressed Middle C.
const listener = new Listener();
listener.analyser={context:{sampleRate:48000},fftSize:8192,getFloatFrequencyData(){}};
assert.equal(listener.needsChordCalibration([48]),false);
assert.equal(listener.needsChordCalibration([48,52]),false);
assert.equal(listener.needsChordCalibration([48,60]),true);
assert.equal(listener.needsChordCalibration([48,60,64]),true);
const profile={version:PROFILE_VERSION,fftSize:PROFILE_FFT,sampleRate:48000,tuning:0,notes:{}};
const spectrum=new Float32Array(PROFILE_FFT/2).fill(-70);
spectrum[30]=-25;
profile.notes[48]=packSpectrum(spectrum);
listener.calibration=profile;
assert.equal(listener.needsChordCalibration([48,60]),true,'learn both Cs');
profile.notes[60]=packSpectrum(spectrum);
assert.equal(listener.needsChordCalibration([48,60]),false,'both octave keys learned');
assert.equal(listener.needsChordCalibration([48,60,64]),true,'all notes in a calibrated octave chord must be learned');
profile.notes[64]=packSpectrum(spectrum);
assert.equal(listener.needsChordCalibration([48,60,64]),false,'three-note chord keys learned');
listener.tuning=0.2;
assert.equal(listener.needsChordCalibration([48,60]),true,'tuning change invalidates templates');
console.log(`${checks} single-note and octave-calibration checks passed`);
