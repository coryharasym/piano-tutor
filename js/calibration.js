import { listener } from './listen.js';
import { store } from './store.js';
import { midiToName, prettyName } from './theory.js';
import { mountSheet } from './sheet.js';
import { packSpectrum, profileCompatible, PROFILE_VERSION, PROFILE_FFT } from './chord-profile.js';

export const C_POSITION = [48, 50, 52, 53, 55, 60, 62, 64, 65, 67];

// Train just the keys used by this exercise. Existing keys are preserved.
export function showCalibration(midis = C_POSITION, onDone = () => {}) {
  const notes = [...new Set(midis)].sort((a, b) => a - b);
  if (!notes.length || listener.calibrating) return;
  const wasActive = listener.active;
  listener.calibrating = true;
  listener.clearRecent();
  const backdrop = document.createElement('div');
  backdrop.className = 'sheet-backdrop';
  backdrop.innerHTML = `<div class="sheet calibration" role="dialog" aria-label="Calibrate keyboard">
    <div class="sheet-head"><h2>Calibrate keyboard</h2><button class="icon-btn" data-close aria-label="Close">✕</button></div>
    <div data-intro><p>Keep your phone in its usual place and use your usual piano sound. Turn off the sustain pedal.</p>
    <p>Play each requested key <b>alone</b>, at your normal volume. Hold it until the bar fills, then release it.</p></div>
    <p class="calibration-note" data-note></p>
    <p data-status role="status">Tap Start to allow microphone access.</p>
    <progress data-progress max="16" value="0" aria-label="Key sample captured"></progress>
    <p class="muted small">Sound fingerprints stay on this device. Recalibrate after moving the phone or changing the keyboard sound. This improves recognition; some sounds and rooms may still be difficult.</p>
    <div class="sheet-actions"><button class="pill" data-retry hidden>Retry this key</button><button class="btn primary" data-start>Start</button></div>
  </div>`;
  const $ = s => backdrop.querySelector(s);
  const status = $('[data-status]'), label = $('[data-note]'), progress = $('[data-progress]');
  let closed = false, index = 0, released = false, stableAt = null, frames = [], draft = null, complete = false;
  const close = mountSheet(backdrop, () => {
    closed = true;
    listener.onSpectrum.delete(capture);
    listener.calibrating = false;
    listener.clearRecent();
    if (!wasActive) listener.stop();
    onDone(complete);
  });
  const paint = () => {
    const midi = notes[index];
    label.textContent = `${prettyName(midiToName(midi))} (${midiToName(midi)}) · Key ${index + 1} of ${notes.length}`;
    const position = midi === 60 ? 'Middle C' : midi < 60 ? 'Below Middle C' : 'Above Middle C';
    status.textContent = `${position}. Release all keys and wait for quiet, then play this key alone.`;
    released = false; stableAt = null; frames = []; progress.value = 0;
  };
  function capture({ db, midi, clarity, level, now }) {
    if (closed || complete) return;
    const gate = Math.max(0.003, listener.tracker.noiseFloor * 3.5);
    if (level < gate) { released = true; stableAt = null; frames = []; progress.value = 0; return; }
    if (!released) return;
    if (midi == null || clarity < 0.9 || Math.abs(midi - notes[index]) > 0.45) {
      stableAt = null; frames = []; progress.value = 0;
      status.textContent = 'Play only the requested key. Hold it steadily.';
      return;
    }
    if (stableAt == null) stableAt = now;
    // Let the FFT window and the attack settle before learning the timbre.
    if (now - stableAt < 220) return;
    const packed = packSpectrum(db);
    if (!packed) return;
    frames.push(Array.from(atob(packed), v => v.charCodeAt(0)));
    progress.value = frames.length;
    status.textContent = 'Hearing this key. Keep holding…';
    if (frames.length < 16) return;
    // Median suppresses occasional room noises and attack fluctuations.
    const median = frames[0].map((_, i) => frames.map(f => f[i]).sort((a, b) => a - b)[8]);
    draft.notes[notes[index]] = btoa(String.fromCharCode(...median));
    if (++index < notes.length) { paint(); return; }
    // Save only a finished calibration; cancelling leaves the old one intact.
    store.data.keyboardCalibration = draft;
    const saved = store.save();
    listener.calibration = draft;
    complete = true;
    listener.onSpectrum.delete(capture);
    label.textContent = 'Calibration complete';
    status.textContent = `${notes.length} keys learned. Try both hands together now. You can add other keys from each exercise’s Calibrate button.${saved ? '' : ' Browser storage is unavailable: this calibration will last only until you close or reload the page.'}`;
    $('[data-retry]').hidden = true;
    const start = $('[data-start]'); start.hidden = false; start.disabled = false; start.textContent = 'Done';
  }
  $('[data-close]').addEventListener('click', close);
  backdrop.addEventListener('click', e => { if (e.target === backdrop) close(); });
  $('[data-retry]').addEventListener('click', paint);
  $('[data-start]').addEventListener('click', async () => {
    if (complete) { close(); return; }
    const button = $('[data-start]'); button.disabled = true;
    status.textContent = 'Starting microphone…';
    try {
      await listener.start();
      if (closed) { if (!wasActive) listener.stop(); return; }
      const old = listener.calibration;
      const rate = listener.analyser.context.sampleRate;
      draft = { version: PROFILE_VERSION, fftSize: PROFILE_FFT, sampleRate: rate, tuning: listener.tuning,
        notes: profileCompatible(old, rate, listener.tuning) ? { ...old.notes } : {} };
      button.hidden = true; $('[data-retry]').hidden = false;
      $('[data-intro]').hidden = true;
      paint(); listener.onSpectrum.add(capture);
    } catch {
      if (closed) return;
      status.textContent = 'Could not start the microphone. Allow access in your browser, then try again.';
      button.disabled = false;
    }
  });
}
