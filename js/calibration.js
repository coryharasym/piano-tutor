import { listener } from './listen.js';
import { store } from './store.js';
import { midiToName, prettyName } from './theory.js';
import { mountSheet } from './sheet.js';
import { profileCompatible, PROFILE_VERSION, PROFILE_FFT } from './chord-profile.js';
import { KeyCapture } from './key-capture.js';
import { UNITS, HYMNS } from './lessons/index.js';
import { buildPractice } from './practice.js';

// Begin on the familiar Middle C, then teach the lower octave.
export const C_POSITION = [60, 62, 64, 65, 67, 48, 50, 52, 53, 55];
const courseKeys = [...new Set([...UNITS.flatMap(u => u.lessons), ...HYMNS]
  .flatMap(l => l.steps.filter(s => s.t === 'play' && !s.anyOrder)
    .flatMap(s => buildPractice(s).moments.filter(m => m.items.length > 1)
      .flatMap(m => m.items.map(it => it.midi)))))].sort((a, b) => a - b);
export const COURSE_KEYS = [...C_POSITION, ...courseKeys.filter(m => !C_POSITION.includes(m))];

export function calibrationCount() {
  const p = listener.calibration;
  if (!profileCompatible(p, p?.sampleRate, listener.tuning)) return 0;
  return Object.values(p.notes || {}).filter(s => typeof s === 'string' && s.length === 5464).length;
}

// Settings owns setup. Each completed key is saved immediately; later visits
// continue with missing keys, and re-recording is an explicit action.
export function showCalibration(midis = C_POSITION, onDone = () => {}) {
  if (listener.calibrating) return;
  const targeted = midis !== C_POSITION && midis.length <= 6;
  const wasActive = listener.active;
  listener.calibrating = true;
  listener.clearRecent();
  const backdrop = document.createElement('div');
  backdrop.className = 'sheet-backdrop';
  backdrop.innerHTML = `<div class="sheet calibration" role="dialog" aria-label="Calibrate keyboard">
    <div class="sheet-head"><h2>Calibrate keyboard</h2><button class="icon-btn" data-close aria-label="Close">✕</button></div>
    <div data-intro><p>This setup is saved on this device and reused in every lesson.</p>
    <p>Keep your phone in its usual place. Use your usual piano sound with the sustain pedal off. When you start, leave the keys released while we measure room noise.</p>
    <label class="row"><span>Keys to learn</span><select data-range><option value="basic" ${targeted || store.setting('calibrationRange') !== 'course' ? 'selected' : ''}>${targeted ? 'Only these notes (' + midis.length + ' keys)' : 'First steps (10 keys)'}</option><option value="course" ${!targeted && store.setting('calibrationRange') === 'course' ? 'selected' : ''}>All course chord keys (${COURSE_KEYS.length} keys)</option></select></label></div>
    <p class="calibration-note" data-note></p>
    <p data-status role="status">${calibrationCount() ? `${calibrationCount()} keys already saved. Continue adds missing keys.` : 'Tap Start, then follow the note prompts.'}</p>
    <progress data-progress max="12" value="0" aria-label="Key sample captured"></progress>
    <p class="muted small">Completed keys are saved as you go. Re-record only if recognition worsens after changing the piano sound or moving the phone.</p>
    <div class="sheet-actions"><button class="pill" data-retry hidden>Retry this key</button><button class="pill" data-redo>Re-record selected keys</button><button class="btn primary" data-start>${calibrationCount() ? 'Continue' : 'Start'}</button></div>
  </div>`;
  const $ = s => backdrop.querySelector(s);
  const status = $('[data-status]'), label = $('[data-note]'), progress = $('[data-progress]');
  let closed = false, index = 0, notes = [], draft = null, complete = false, key = null;
  let measuringAt = null, noiseReadings = [], noise = 0.002, storageOK = true;
  const close = mountSheet(backdrop, () => {
    closed = true;
    listener.onSpectrum.delete(capture);
    listener.calibrating = false;
    listener.clearRecent();
    if (!wasActive) listener.stop();
    onDone(complete);
  });
  const finish = () => {
    complete = true;
    listener.onSpectrum.delete(capture);
    label.textContent = 'Calibration saved';
    status.textContent = `Your saved keys will be used automatically in every lesson.${storageOK ? '' : ' Browser storage is unavailable: these keys will last only until you close or reload the page.'}`;
    $('[data-retry]').hidden = true;
    const start = $('[data-start]'); start.hidden = false; start.disabled = false; start.textContent = 'Done';
  };
  const paint = (requireRelease = true) => {
    const midi = notes[index];
    label.textContent = midi === 60 ? 'Middle C (C4)' : `${prettyName(midiToName(midi))} (${midiToName(midi)})`;
    const position = midi === 60 ? 'Play Middle C alone' : `Play ${midiToName(midi)} alone, ${midi < 60 ? 'below' : 'above'} Middle C`;
    status.textContent = `${position}. Key ${index + 1} of ${notes.length}. Hold until the bar fills, then release.`;
    key = new KeyCapture(midi, noise, requireRelease);
    $('[data-retry]').hidden = false;
    progress.value = 0;
  };
  function capture(frame) {
    if (closed || complete) return;
    if (!key) {
      if (measuringAt == null) measuringAt = frame.now;
      // Exclude an early press of the requested first key from room noise.
      if (frame.midi == null || frame.clarity < 0.8 || Math.abs(frame.midi - notes[0]) > 0.45) noiseReadings.push(frame.level);
      if (frame.now - measuringAt < 650) return;
      noiseReadings.sort((a, b) => a - b);
      noise = noiseReadings[Math.floor(noiseReadings.length / 4)] || 0.002;
      paint(false); // No absolute-silence prerequisite for the first key.
    }
    const result = key.push(frame);
    progress.value = result.count;
    if (result.state === 'release') status.textContent = 'Release the previous key, then play the requested key alone.';
    if (result.state === 'quiet') status.textContent = 'Ready. Play the requested key a little louder, or move the phone closer.';
    if (result.state === 'pitch') status.textContent = result.heard != null
      ? `Hearing ${midiToName(Math.round(result.heard))}; looking for ${midiToName(notes[index])}. Check the octave and play this key alone.`
      : 'Sound is reaching the mic, but the pitch is unclear. Play this key alone and hold it.';
    if (result.state === 'settling' || result.state === 'holding') status.textContent = 'Hearing the right key. Keep holding…';
    if (result.state !== 'done') return;
    draft = { ...draft, notes: { ...draft.notes, [notes[index]]: result.sample } };
    store.data.keyboardCalibration = draft;
    storageOK = store.save();
    listener.calibration = draft;
    if (++index < notes.length) paint();
    else finish();
  }
  $('[data-close]').addEventListener('click', close);
  backdrop.addEventListener('click', e => { if (e.target === backdrop) close(); });
  $('[data-retry]').addEventListener('click', () => paint(false));
  async function begin(redo = false) {
    if (complete) { close(); return; }
    const button = $('[data-start]'); button.disabled = true; $('[data-redo]').disabled = true;
    status.textContent = 'Starting microphone…';
    try {
      await listener.start();
      if (closed) { if (!wasActive) listener.stop(); return; }
      const old = listener.calibration, rate = listener.analyser.context.sampleRate;
      draft = { version: PROFILE_VERSION, fftSize: PROFILE_FFT, sampleRate: rate, tuning: listener.tuning,
        notes: profileCompatible(old, rate, listener.tuning) ? { ...old.notes } : {} };
      const range = $('[data-range]').value === 'course' ? 'course' : 'basic';
      if (!targeted) store.setting('calibrationRange', range);
      const selected = range === 'course' ? COURSE_KEYS : midis;
      notes = [...new Set(selected)].filter(m => redo || typeof draft.notes[m] !== 'string' || draft.notes[m].length !== 5464);
      button.hidden = true; $('[data-redo]').hidden = true; $('[data-intro]').hidden = true;
      if (!notes.length) { finish(); return; }
      label.textContent = 'Measuring room noise';
      status.textContent = 'Keep all keys released for a moment…';
      listener.onSpectrum.add(capture);
    } catch {
      if (closed) return;
      status.textContent = 'Could not start the microphone. Allow access in your browser, then try again.';
      button.disabled = false; $('[data-redo]').disabled = false;
    }
  }
  $('[data-start]').addEventListener('click', () => begin());
  $('[data-redo]').addEventListener('click', () => begin(true));
}
