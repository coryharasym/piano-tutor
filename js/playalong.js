// "Play along": notes fall toward the keyboard and you play them as they land.
//   Wait mode: the music pauses at each note until you play it.
//   Flow mode: the music keeps moving; you get a score for notes played on time.

import { Keyboard } from './keyboard.js';
import { buildPractice, matches } from './practice.js';
import { listener } from './listen.js';
import { piano } from './audio.js';
import { toMidi, isBlack } from './theory.js';
import { store } from './store.js';
import { icons } from './icons.js';

const LOOKAHEAD = 4;        // beats visible above the keyboard
const WINDOW = 0.38;        // seconds either side of a note that still count as "on time"
const MIC_LATENCY = 0.12;   // the mic hears a note a little after it's played
const COUNT_IN = 4;         // beats before the first note

export function mountPlayAlong(root, step, { micButton, onExit }) {
  const { moments } = buildPractice(step);
  const items = moments.flatMap((m, mi) => m.items.map((it) => ({ ...it, beat: m.beat, moment: mi, state: 'pending' })));
  const total = items.length;
  const lastBeat = Math.max(...items.map((it) => it.beat + it.beats));
  const prefs = {
    mode: store.setting('playMode') || 'wait',
    speed: store.setting('playSpeed') || 0.75,
  };

  const el = document.createElement('main');
  el.className = 'lesson playalong';
  el.innerHTML = `
    <header class="topbar">
      <button class="icon-btn" data-exit aria-label="Back to lesson">${icons.back}</button>
      <div class="top-title"><span class="eyebrow">Play along</span><span>${step.title}</span></div>
      <div class="seg" data-mode role="group" aria-label="Mode">
        <button data-v="wait">Wait</button><button data-v="flow">Flow</button>
      </div>
      <div class="seg" data-speed role="group" aria-label="Speed">
        <button data-v="0.5">½×</button><button data-v="0.75">¾×</button><button data-v="1">1×</button>
      </div>
      <div class="top-actions"></div>
      <button class="icon-btn" data-restart aria-label="Start again">${icons.restart}</button>
    </header>
    <section class="fall-wrap">
      <canvas class="fall"></canvas>
      <div class="fall-hud"><span class="count"></span><span class="score"></span></div>
      <div class="fall-msg"></div>
    </section>
    <div class="kb-wrap"></div>`;
  root.replaceChildren(el);
  el.querySelector('.top-actions').appendChild(micButton());

  const canvas = el.querySelector('canvas');
  const ctx2d = canvas.getContext('2d');
  const msg = el.querySelector('.fall-msg');
  const hudCount = el.querySelector('.count');
  const hudScore = el.querySelector('.score');
  const range = step.range ? step.range.map(toMidi) : [toMidi('C3'), toMidi('C5')];
  const kb = new Keyboard(el.querySelector('.kb-wrap'), { lo: range[0], hi: range[1], labels: 'c', onPress: (m) => input(m, 'tap') });

  // ---- state
  let beat, running, finished, wrong, lastFrame, raf, nextMoment;
  const bps = () => ((step.tempo || 80) * prefs.speed) / 60;

  function reset() {
    items.forEach((it) => { it.state = 'pending'; });
    beat = -COUNT_IN;
    nextMoment = 0;
    wrong = 0;
    finished = false;
    running = true;
    lastFrame = performance.now();
    msg.className = 'fall-msg';
    msg.innerHTML = '';
    listener.clearRecent();
    paintSeg();
  }

  function paintSeg() {
    el.querySelectorAll('[data-mode] button').forEach((b) => b.classList.toggle('on', b.dataset.v === prefs.mode));
    el.querySelectorAll('[data-speed] button').forEach((b) => b.classList.toggle('on', +b.dataset.v === prefs.speed));
  }

  // ---- input
  function input(midi, source) {
    if (!running || finished || beat < -0.5) { kb.flash(midi, 'press'); return; }
    const anyOctave = store.setting('anyOctave');
    const now = beat - (source === 'mic' ? MIC_LATENCY * bps() : 0);
    let hit = null;
    if (prefs.mode === 'wait') {
      const m = moments[nextMoment];
      // Playing a little early is fine: the music simply catches up.
      if (m) hit = items.find((it) => it.moment === nextMoment && it.state === 'pending' && matches(midi, it.midi, { anyOctave, source }));
    } else {
      const win = WINDOW * bps();
      hit = items
        .filter((it) => it.state === 'pending' && Math.abs(it.beat - now) <= win && matches(midi, it.midi, { anyOctave, source }))
        .sort((a, b) => Math.abs(a.beat - now) - Math.abs(b.beat - now))[0];
    }
    if (hit) {
      hit.state = 'hit';
      kb.flash(hit.midi, 'good');
      if (prefs.mode === 'wait' && items.every((it) => it.moment !== nextMoment || it.state === 'hit')) nextMoment++;
    } else {
      // A note still ringing from a hit isn't a mistake.
      const ringing = items.some((it) => it.state === 'hit' && matches(midi, it.midi, { anyOctave, source }) && now - it.beat < it.beats + 0.5);
      if (!ringing) { wrong++; kb.flash(midi, 'miss'); }
    }
  }
  const onNote = (m) => input(m, 'mic');
  listener.onNote.add(onNote);

  // Chords by ear: accept when the mic hears all the letters together.
  const chordTimer = setInterval(() => {
    if (!running || finished || !listener.active) return;
    const m = moments[nextMoment];
    if (prefs.mode !== 'wait' || !m || m.items.length < 2) return;
    if (listener.chordHeard(m.items.map((it) => it.midi % 12))) {
      items.filter((it) => it.moment === nextMoment).forEach((it) => { it.state = 'hit'; kb.flash(it.midi, 'good'); });
      nextMoment++;
      listener.clearRecent();
    }
  }, 80);

  // ---- timing
  function tick(now) {
    const dt = Math.min(0.1, (now - lastFrame) / 1000);
    lastFrame = now;
    if (running && !finished) {
      let next = beat + dt * bps();
      if (prefs.mode === 'wait') {
        while (nextMoment < moments.length && items.every((it) => it.moment !== nextMoment || it.state === 'hit')) nextMoment++;
        const m = moments[nextMoment];
        if (m && next > m.beat) next = m.beat; // hold here until it's played
      } else {
        const late = WINDOW * bps();
        items.forEach((it) => { if (it.state === 'pending' && next - it.beat > late) it.state = 'missed'; });
      }
      beat = next;
      if (beat > lastBeat + 0.5 || (prefs.mode === 'wait' && nextMoment >= moments.length && beat >= moments[moments.length - 1].beat)) finish();
    }
    updateTargets();
    draw();
    raf = requestAnimationFrame(tick);
  }

  let targetKey = '';
  function updateTargets() {
    const soon = items.filter((it) => it.state === 'pending' && it.beat - beat < 0.75 && it.beat - beat > -0.5);
    const key = soon.map((it) => it.midi).join(',');
    if (key === targetKey) return;
    targetKey = key;
    kb.setTargets(soon.map((it) => ({ midi: it.midi, finger: it.finger, hand: it.hand })));
  }

  function finish() {
    finished = true;
    const hits = items.filter((it) => it.state === 'hit').length;
    piano.chime();
    const pct = Math.round((hits / total) * 100);
    const line = prefs.mode === 'flow'
      ? `<b>${hits} of ${total}</b> notes on time (${pct}%)`
      : `<b>All ${total} notes</b> played${wrong ? `, with ${wrong} wrong note${wrong > 1 ? 's' : ''} along the way` : ' with no wrong notes'}`;
    const praise = prefs.mode === 'flow'
      ? (pct >= 90 ? 'Superb!' : pct >= 70 ? 'Nice playing!' : 'Good start!')
      : (wrong === 0 ? 'Perfect!' : 'Well done!');
    msg.className = 'fall-msg show';
    msg.innerHTML = `<div class="card"><h2>${praise}</h2><p>${line}.</p>
      ${prefs.mode === 'wait' ? '<p class="muted small">Ready for more? Try Flow mode, where the music keeps moving.</p>' : pct >= 90 && prefs.speed < 1 ? '<p class="muted small">Try it a little faster next time.</p>' : ''}
      <div class="sheet-actions"><button class="text-btn" data-back>Back to lesson</button><button class="btn primary" data-again>Play again</button></div></div>`;
    msg.querySelector('[data-again]').addEventListener('click', reset);
    msg.querySelector('[data-back]').addEventListener('click', onExit);
  }

  // ---- drawing
  function keyGeometry() {
    const c = canvas.getBoundingClientRect();
    const geo = new Map();
    for (const [m, k] of kb.keys) {
      const r = k.getBoundingClientRect();
      geo.set(m, { x: r.left - c.left, w: r.width });
    }
    return geo;
  }

  function draw() {
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.clientWidth, H = canvas.clientHeight;
    if (canvas.width !== Math.round(W * dpr) || canvas.height !== Math.round(H * dpr)) {
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
    }
    const g = ctx2d;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, W, H);
    const geo = keyGeometry();
    const hitY = H - 6;
    const ppb = (H - 10) / LOOKAHEAD;
    const css = getComputedStyle(el);
    const col = { R: css.getPropertyValue('--right').trim(), L: css.getPropertyValue('--left').trim(), good: css.getPropertyValue('--good').trim(), miss: css.getPropertyValue('--miss').trim(), line: css.getPropertyValue('--line').trim() };

    // Beat lines, with stronger bar lines.
    const [num, den] = (step.time || '4/4').split('/').map(Number);
    const perBar = num * (4 / den);
    const pickup = step.pickup || 0;
    for (let b = Math.ceil(beat); b < beat + LOOKAHEAD + 1; b++) {
      const y = hitY - (b - beat) * ppb;
      const isBar = ((b - pickup) % perBar + perBar) % perBar === 0;
      g.fillStyle = col.line;
      g.globalAlpha = isBar ? 0.9 : 0.35;
      g.fillRect(0, y, W, isBar ? 1.5 : 1);
    }
    g.globalAlpha = 1;

    // Lane guides for black keys, so bars line up with the keyboard.
    for (const [m, k] of geo) {
      if (!isBlack(m)) continue;
      g.fillStyle = 'rgba(29,42,44,0.035)';
      g.fillRect(k.x, 0, k.w, hitY);
    }

    // Notes
    for (const it of items) {
      const k = geo.get(it.midi);
      if (!k) continue;
      const yBottom = hitY - (it.beat - beat) * ppb;
      const h = Math.max(10, it.beats * ppb - 3);
      const yTop = yBottom - h;
      if (yTop > H || yBottom < -10) continue;
      const pad = isBlack(it.midi) ? 1 : 3;
      let fill = col[it.hand] || col.R;
      let alpha = 1;
      if (it.state === 'hit') { fill = col.good; alpha = 0.55; }
      if (it.state === 'missed') { fill = col.miss; alpha = 0.35; }
      g.globalAlpha = alpha;
      g.fillStyle = fill;
      roundRect(g, k.x + pad, yTop, k.w - pad * 2, h, 7);
      g.fill();
      if (it.finger && it.state === 'pending' && k.w > 22) {
        g.globalAlpha = 1;
        g.fillStyle = '#fff';
        g.font = '700 13px -apple-system, BlinkMacSystemFont, sans-serif';
        g.textAlign = 'center';
        const hand = store.setting('handLabels') && k.w > 30 ? it.hand : '';
        g.fillText(`${hand}${it.finger}`, k.x + k.w / 2, yBottom - 7);
      }
    }
    g.globalAlpha = 1;

    // The line where notes should be played.
    g.fillStyle = col.R;
    g.globalAlpha = 0.8;
    g.fillRect(0, hitY, W, 3);
    g.globalAlpha = 1;

    // HUD
    if (beat < 0 && running) hudCount.textContent = String(Math.ceil(-beat));
    else hudCount.textContent = '';
    const hits = items.filter((it) => it.state === 'hit').length;
    hudScore.textContent = prefs.mode === 'flow' ? `${hits} / ${total}` : `${hits} of ${total}`;
  }

  // ---- controls
  el.querySelector('[data-exit]').addEventListener('click', onExit);
  el.querySelector('[data-restart]').addEventListener('click', reset);
  el.querySelectorAll('[data-mode] button').forEach((b) => b.addEventListener('click', () => {
    prefs.mode = b.dataset.v; store.setting('playMode', prefs.mode); reset();
  }));
  el.querySelectorAll('[data-speed] button').forEach((b) => b.addEventListener('click', () => {
    prefs.speed = +b.dataset.v; store.setting('playSpeed', prefs.speed); paintSeg();
  }));

  reset();
  raf = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(raf);
    clearInterval(chordTimer);
    listener.onNote.delete(onNote);
  };
}

function roundRect(g, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}
