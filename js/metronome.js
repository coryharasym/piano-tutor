// A standalone metronome: steady clicks, an accent on beat 1, and tap tempo.

import { piano } from './audio.js';
import { store } from './store.js';
import { icons } from './icons.js';

const WORDS = [[60, 'Adagio'], [76, 'Adagio'], [108, 'Andante'], [120, 'Moderato'], [168, 'Allegro'], [999, 'Presto']];
const tempoWord = (bpm) => WORDS.find(([max]) => bpm < max)[1];
const clamp = (n) => Math.max(40, Math.min(208, Math.round(n)));

export function mountMetronome(root, { onBack }) {
  let bpm = store.setting('metroBpm') || 80;
  let beats = store.setting('metroBeats') || 4;
  let timer = null, nextAt = 0, beat = 0, taps = [];

  const el = document.createElement('main');
  el.className = 'lesson metronome-page';
  el.innerHTML = `
    <header class="topbar">
      <button class="icon-btn" data-home aria-label="Home">${icons.home}</button>
      <div class="top-title"><span class="eyebrow">Practice tools</span><span>Metronome</span></div>
    </header>
    <section class="metro">
      <div class="metro-dots"></div>
      <div class="metro-tempo">
        <button class="icon-btn" data-down aria-label="Slower">−</button>
        <div class="metro-bpm"><b></b><span class="muted"></span></div>
        <button class="icon-btn" data-up aria-label="Faster">+</button>
      </div>
      <input type="range" min="40" max="208" step="1" aria-label="Beats per minute" data-slider>
      <div class="metro-row">
        <div class="seg" role="group" aria-label="Beats in a bar">${[2, 3, 4, 6].map((n) => `<button data-beats="${n}">${n}</button>`).join('')}</div>
        <button class="pill" data-tap>Tap tempo</button>
        <button class="btn primary" data-go>${icons.play} Start</button>
      </div>
    </section>`;
  root.replaceChildren(el);
  const $ = (sel) => el.querySelector(sel);

  function paint() {
    $('.metro-bpm b').textContent = bpm;
    $('.metro-bpm span').textContent = `beats per minute · ${tempoWord(bpm)}`;
    $('[data-slider]').value = bpm;
    el.querySelectorAll('[data-beats]').forEach((b) => b.classList.toggle('on', +b.dataset.beats === beats));
    $('.metro-dots').innerHTML = Array.from({ length: beats }, (_, i) => `<i class="${i === 0 ? 'one' : ''}"></i>`).join('');
    $('[data-go]').innerHTML = timer ? `${icons.stop} Stop` : `${icons.play} Start`;
  }
  const setBpm = (n) => { bpm = clamp(n); store.setting('metroBpm', bpm); paint(); };

  // Clicks are scheduled a little ahead on the audio clock, so they stay steady.
  function schedule() {
    const ctx = piano.ctx;
    while (nextAt < ctx.currentTime + 0.12) {
      const b = beat;
      piano.click(nextAt, b === 0);
      setTimeout(() => {
        el.querySelectorAll('.metro-dots i').forEach((d, i) => d.classList.toggle('lit', i === b));
      }, Math.max(0, (nextAt - ctx.currentTime) * 1000));
      nextAt += 60 / bpm;
      beat = (beat + 1) % beats;
    }
  }
  async function start() {
    await piano.unlock();
    beat = 0;
    nextAt = piano.ctx.currentTime + 0.08;
    timer = setInterval(schedule, 25);
    schedule();
    paint();
  }
  function stop() {
    clearInterval(timer);
    timer = null;
    el.querySelectorAll('.metro-dots i').forEach((d) => d.classList.remove('lit'));
    paint();
  }

  $('[data-home]').addEventListener('click', onBack);
  $('[data-down]').addEventListener('click', () => setBpm(bpm - 1));
  $('[data-up]').addEventListener('click', () => setBpm(bpm + 1));
  $('[data-slider]').addEventListener('input', (e) => setBpm(+e.target.value));
  el.querySelectorAll('[data-beats]').forEach((b) => b.addEventListener('click', () => {
    beats = +b.dataset.beats;
    beat = 0;
    store.setting('metroBeats', beats);
    paint();
  }));
  // Tap tempo: the average gap between the last few taps.
  $('[data-tap]').addEventListener('click', () => {
    const now = performance.now();
    taps = taps.filter((t) => now - t < 2500).concat(now).slice(-6);
    if (taps.length >= 2) setBpm(60000 / ((taps[taps.length - 1] - taps[0]) / (taps.length - 1)));
  });
  $('[data-go]').addEventListener('click', () => (timer ? stop() : start()));
  paint();
  return stop;
}
