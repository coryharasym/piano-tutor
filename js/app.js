import { UNITS, HYMNS, findLesson, nextLesson, chooseRecital, addLesson } from './lessons/index.js';
import { PRACTICE_SHELF, buildDaily, buildDrill, dailyReady, today } from './daily.js';
import { mountMetronome } from './metronome.js';
import { piano } from './audio.js';
import { listener } from './listen.js';
import { Keyboard } from './keyboard.js';
import { renderStaff } from './staff.js';
import { buildPractice, matches, lyricLine, lyricHTML } from './practice.js';
import { parseSeq, toMidi, midiToName, prettyName } from './theory.js';
import { store } from './store.js';
import { icons } from './icons.js';
import { mountPlayAlong, SPEEDS } from './playalong.js';
import { mountPrint, printOne, songbook } from './print.js';
import { mountSheet } from './sheet.js';
import { showCalibration, calibrationCount } from './calibration.js';

const $ = (sel, root = document) => root.querySelector(sel);
const app = $('#app');
const h = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };

piano.setVolume(store.setting('volume'));
Object.entries(store.data.recitals || {}).forEach(([unit, piece]) => chooseRecital(unit, piece));
listener.tuning = store.setting('tuning') || 0;
listener.calibration = store.data.keyboardCalibration || null;

// ---------------------------------------------------------------- routing
window.addEventListener('hashchange', route);
function route() {
  cleanup();
  const [, view, id, step] = location.hash.split('/');
  // Daily practice is built for today; the drill gets fresh notes on each visit.
  if (id === 'daily' && dailyReady(store.data.done)) addLesson(PRACTICE_SHELF, buildDaily(store.data.done));
  if (id === 'drill' && (view !== 'lesson' || !findLesson('drill') || Number(step) === 0)) addLesson(PRACTICE_SHELF, buildDrill(store.data.done));
  if (view === 'lesson' && findLesson(id)) return showLesson(id, Number(step) || 0);
  if (view === 'metronome') return showMetronome();
  if (view === 'free') return showFreePlay();
  if (view === 'play' && findLesson(id)) return showPlayAlong(id, Number(step) || 0);
  if (view === 'print' && printOne(id, Number(step) || 0)) return showPrint(id, Number(step) || 0);
  if (view === 'songbook') return showSongbook();
  showHome();
}
const go = (hash) => { if (location.hash === hash) route(); else location.hash = hash; };

let disposers = [];
function cleanup() {
  disposers.forEach((fn) => fn());
  disposers = [];
}

// ---------------------------------------------------------------- wake lock
let wakeLock = null;
async function keepAwake(on) {
  try {
    if (on && 'wakeLock' in navigator && !wakeLock) {
      wakeLock = await navigator.wakeLock.request('screen');
      wakeLock.addEventListener('release', () => { wakeLock = null; });
    } else if (!on && wakeLock) {
      await wakeLock.release();
      wakeLock = null;
    }
  } catch { /* not supported or denied */ }
}
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && location.hash.startsWith('#/lesson')) keepAwake(true);
});

// ---------------------------------------------------------------- mic control (shared)
function micButton() {
  const btn = h(`<button class="icon-btn mic-btn" aria-label="Listening">${icons.micOff}<span class="meter"><i></i></span></button>`);
  const meter = btn.querySelector('.meter i');
  const paint = () => {
    btn.classList.toggle('on', listener.active);
    btn.querySelector('svg').outerHTML = listener.active ? icons.mic : icons.micOff;
  };
  const onLevel = (lvl) => { meter.style.transform = `scaleY(${Math.min(1, lvl * 18)})`; };
  listener.onLevel.add(onLevel);
  disposers.push(() => listener.onLevel.delete(onLevel));
  btn.addEventListener('click', async () => {
    if (listener.active) { listener.stop(); paint(); toast('Listening off. Tap keys on screen instead.'); return; }
    try {
      await listener.start();
      paint();
      toast('Listening. Play a note!');
    } catch (e) {
      console.warn(e);
      toast("Couldn't use the microphone. Check your browser's permission settings.");
    }
  });
  paint();
  return btn;
}

function toast(msg) {
  let t = $('.toast');
  if (!t) { t = h('<div class="toast" role="status"></div>'); document.body.appendChild(t); }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._h);
  t._h = setTimeout(() => t.classList.remove('show'), 2600);
}

// ---------------------------------------------------------------- home
function showHome() {
  keepAwake(false);
  const last = store.data.last && findLesson(store.data.last.lesson) ? store.data.last : null;
  const upNext = nextLesson(store.data.done);
  const total = UNITS.reduce((n, u) => n + u.lessons.length, 0);
  const doneCount = Object.keys(store.data.done).filter((id) => findLesson(id)).length;

  const el = h(`<main class="home">
    <header class="home-head">
      <div>
        <h1>Piano Tutor</h1>
        <p class="muted">${doneCount ? `${doneCount} of ${total} lessons complete` : 'Classical piano, one small step at a time'}</p>
      </div>
      <div class="head-actions">
        <button class="pill" data-free>${icons.piano}<span>Free play</span></button>
        <button class="pill" data-songbook>${icons.book}<span>Songbook</span></button>
        <button class="icon-btn" data-settings aria-label="Settings">${icons.gear}</button>
      </div>
    </header>
    <section class="continue"></section>
    <section class="units"></section>
  </main>`);

  const cont = $('.continue', el);
  const target = upNext || UNITS[0].lessons[0];
  const resume = last && !store.isDone(last.lesson) ? last : null;
  const contLesson = resume ? findLesson(resume.lesson).lesson : target;
  cont.appendChild(h(`<button class="continue-card">
    <span class="eyebrow">${resume ? 'Pick up where you left off' : doneCount ? 'Up next' : 'Start here'}</span>
    <span class="title">${contLesson.title}</span>
    <span class="muted">${contLesson.summary}</span>
    <span class="go">${icons.play}</span>
  </button>`));
  cont.firstChild.addEventListener('click', () => go(`#/lesson/${contLesson.id}/${resume ? resume.step : 0}`));

  // Daily practice, and tools for practising on your own.
  const ready = dailyReady(store.data.done);
  const doneToday = store.data.practice?.[today()];
  const daily = h(`<div class="practice-col">
    <button class="daily-card ${doneToday ? 'done' : ''}" ${ready ? '' : 'disabled'}>
      <span class="eyebrow">${doneToday ? `${icons.check} Done today` : 'Daily practice'}</span>
      <span class="title">Today's practice</span>
      <span class="muted">${ready ? (doneToday ? streakText() : 'About ten minutes, from what you\'ve learned') : 'Unlocks after "Right hand C position"'}</span>
    </button>
    <div class="tool-row">
      <button class="pill" data-metronome>${icons.metronome}<span>Metronome</span></button>
      <button class="pill" data-drill ${store.isDone('treble-reading') ? '' : 'disabled'}>${icons.note}<span>Reading drill</span></button>
    </div>
  </div>`);
  cont.appendChild(daily);
  $('.daily-card', daily).addEventListener('click', () => go('#/lesson/daily/0'));
  $('[data-metronome]', daily).addEventListener('click', () => go('#/metronome'));
  $('[data-drill]', daily).addEventListener('click', () => go('#/lesson/drill/0'));

  const units = $('.units', el);
  UNITS.forEach((u, ui) => {
    const done = u.lessons.filter((l) => store.isDone(l.id)).length;
    const ribbon = u.lessons.some((l) => l.recital && store.isDone(l.id));
    const sec = h(`<div class="unit">
      <div class="unit-head"><span class="unit-num ${ribbon ? 'ribbon' : ''}">${ribbon ? icons.ribbon : ui + 1}</span><div><h2>${u.title}</h2><p class="muted">${u.blurb}</p></div>
      <span class="unit-progress">${done}/${u.lessons.length}</span></div>
      <div class="lesson-row"></div></div>`);
    const row = $('.lesson-row', sec);
    u.lessons.forEach((l, li) => {
      const isDone = store.isDone(l.id);
      row.appendChild(lessonCard(l, li, l === target));
    });
    units.appendChild(sec);
  });

  // Hymns shelf: every hymn in the course, in one place.
  const hymns = h(`<div class="unit hymns">
    <div class="unit-head"><span class="unit-num">${icons.note}</span><div><h2>Hymns</h2><p class="muted">Every recital piece, ready to practice any time, marked with the unit it belongs to.</p></div>
    <button class="text-btn" data-songbook>${icons.print} Print the songbook</button></div>
    <div class="lesson-row"></div></div>`);
  HYMNS.forEach((l, i) => $('.lesson-row', hymns).appendChild(lessonCard(l, i, false, l.title, `Unit ${l.unitNumber}`)));
  units.appendChild(hymns);

  $('[data-free]', el).addEventListener('click', () => go('#/free'));
  el.querySelectorAll('[data-songbook]').forEach((b) => b.addEventListener('click', () => go('#/songbook')));
  $('[data-settings]', el).addEventListener('click', showSettings);
  app.replaceChildren(el);
  // Bring the next lesson into view in its row.
  requestAnimationFrame(() => {
    const card = $('.lesson-card.next', el);
    if (card) card.parentElement.scrollLeft = card.offsetLeft - card.parentElement.offsetLeft - 16;
  });
}

function lessonCard(l, index, isNext, title = l.title, eyebrow = '') {
  const isDone = store.isDone(l.id);
  const badge = l.recital ? (isDone ? icons.ribbon : icons.note) : (isDone ? icons.check : index + 1);
  const card = h(`<button class="lesson-card ${isDone ? 'done' : ''} ${isNext ? 'next' : ''} ${l.recital ? 'recital' : ''}">
    <span class="num">${badge}</span>
    ${l.recital ? `<span class="eyebrow">${isDone ? 'Recital passed' : 'Recital'}</span>` : eyebrow ? `<span class="eyebrow">${eyebrow}</span>` : ''}
    <span class="title">${title}</span>
    <span class="muted">${l.summary}</span></button>`);
  card.addEventListener('click', () => go(`#/lesson/${l.id}/0`));
  return card;
}

// ---------------------------------------------------------------- settings
function showSettings() {
  const s = store.data.settings;
  const dlg = h(`<div class="sheet-backdrop"><div class="sheet" role="dialog" aria-label="Settings">
    <div class="sheet-head"><h2>Settings</h2><button class="icon-btn" data-close aria-label="Close">${icons.x}</button></div>
    <label class="row"><span>Piano volume</span><input type="range" min="0" max="1" step="0.05" value="${s.volume}" data-vol></label>
    <label class="row"><span>Show note names on keys<small>When a lesson allows it</small></span><input type="checkbox" ${s.keyNames ? 'checked' : ''} data-names></label>
    <label class="row"><span>Show R and L with finger numbers<small>Which hand plays each note, beside its finger number</small></span><input type="checkbox" ${s.handLabels ? 'checked' : ''} data-hands></label>
    <label class="row"><span>Show song words<small>The lyrics of hymns and songs, as you play</small></span><input type="checkbox" ${s.lyrics ? 'checked' : ''} data-lyrics></label>
    <label class="row"><span>Accept any octave<small>Forgives the mic mishearing a note an octave off</small></span><input type="checkbox" ${s.anyOctave ? 'checked' : ''} data-oct></label>
    <div class="row"><span>Tune to my piano<small>${tuningText()}</small></span><button class="pill" data-tune>${icons.mic}<span>Tune</span></button></div>
    <div class="row"><span>Keyboard calibration<small>${calibrationCount() ? `${calibrationCount()} keys saved on this device. Used automatically in every lesson.` : 'Set up once here for octave pairs and chords. Your learned keys are saved.'}</small></span><button class="pill" data-calibrate>${calibrationCount() ? 'Manage setup' : 'Set up keyboard'}</button></div>
    <div class="row"><span>Back up progress<small>Save your progress to a file, or load it on another device</small></span><span class="row-btns"><button class="pill" data-backup>Back up</button><button class="pill" data-restore>Restore</button></span></div>
    <input type="file" accept=".json,application/json" data-file hidden>
    <button class="text-btn danger" data-reset>Reset all progress</button>
    <p class="muted small">Progress is saved on this device. Piano sound: Salamander Grand Piano by Alexander Holm (CC BY 3.0).</p>
  </div></div>`);
  const close = mountSheet(dlg);
  dlg.addEventListener('click', (e) => { if (e.target === dlg) close(); });
  $('[data-close]', dlg).addEventListener('click', close);
  $('[data-vol]', dlg).addEventListener('input', (e) => { store.setting('volume', +e.target.value); piano.setVolume(+e.target.value); });
  $('[data-names]', dlg).addEventListener('change', (e) => { store.setting('keyNames', e.target.checked); route(); });
  $('[data-hands]', dlg).addEventListener('change', (e) => { store.setting('handLabels', e.target.checked); route(); });
  $('[data-lyrics]', dlg).addEventListener('change', (e) => { store.setting('lyrics', e.target.checked); route(); });
  $('[data-oct]', dlg).addEventListener('change', (e) => store.setting('anyOctave', e.target.checked));
  $('[data-tune]', dlg).addEventListener('click', () => { close(); showTuner(); });
  $('[data-calibrate]', dlg).addEventListener('click', () => { close(); showCalibration(); });
  $('[data-backup]', dlg).addEventListener('click', () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([store.backup()], { type: 'application/json' }));
    a.download = `piano-tutor-backup-${today()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });
  $('[data-restore]', dlg).addEventListener('click', () => $('[data-file]', dlg).click());
  $('[data-file]', dlg).addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const text = await file.text();
      if (!confirm('Replace the progress on this device with the backup?')) return;
      store.restore(text);
      piano.setVolume(store.setting('volume'));
      listener.tuning = store.setting('tuning') || 0;
      listener.calibration = store.data.keyboardCalibration || null;
      close();
      route();
    } catch {
      alert('That file isn\'t a Piano Tutor backup.');
    }
  });
  $('[data-reset]', dlg).addEventListener('click', () => {
    if (confirm('Clear all lesson progress on this device?')) {
      store.reset(); listener.calibration = null; listener.tuning = 0;
      close(); route();
    }
  });
}

function tuningText(t = listener.tuning) {
  const cents = Math.round(t * 100);
  if (Math.abs(cents) < 10) return 'The mic expects a standard-tuned piano';
  return `Adjusted for a piano ${Math.abs(cents)} cents ${cents < 0 ? 'flat' : 'sharp'} (100 cents = 1 note)`;
}

// Listen to the player's Middle C and learn how far off it reads, so notes
// are named correctly on a piano that's out of tune (or a phone that hears
// everything shifted).
async function showTuner() {
  const dlg = h(`<div class="sheet-backdrop"><div class="sheet tuner" role="dialog" aria-label="Tune to my piano">
    <div class="sheet-head"><h2>Tune to my piano</h2><button class="icon-btn" data-close aria-label="Close">${icons.x}</button></div>
    <p data-msg>Play <b>Middle C</b> on your piano, firmly, a few times. Let each note ring.</p>
    <div class="tune-bar"><i></i></div>
    <div class="sheet-actions">
      <button class="text-btn" data-zero>Reset to standard</button>
      <button class="btn primary" data-done>Done</button>
    </div>
  </div></div>`);
  const msg = $('[data-msg]', dlg), bar = $('.tune-bar i', dlg);
  const readings = [];
  const NEED = 30;
  const onRaw = (raw) => {
    if (readings.length >= NEED) return;
    let d = raw - 60;
    d -= 12 * Math.round(d / 12); // any octave of C counts
    readings.push(d);
    bar.style.transform = `scaleX(${readings.length / NEED})`;
    if (readings.length < NEED) return;
    const sorted = [...readings].sort((a, b) => a - b);
    const offset = sorted[Math.floor(sorted.length / 2)];
    listener.tuning = offset;
    store.setting('tuning', offset);
    const cents = Math.round(offset * 100);
    msg.innerHTML = Math.abs(cents) < 10
      ? '<b>All set.</b> Your Middle C reads correctly, so no change was needed.'
      : `<b>All set.</b> Your Middle C read ${Math.abs(cents)} cents ${cents < 0 ? 'low' : 'high'} (100 cents is one note). The app now adjusts for it, so play a C to check it shows as C.`;
    piano.chime();
  };
  const close = mountSheet(dlg, () => listener.onRaw.delete(onRaw));
  $('[data-close]', dlg).addEventListener('click', close);
  $('[data-done]', dlg).addEventListener('click', close);
  $('[data-zero]', dlg).addEventListener('click', () => {
    listener.tuning = 0; store.setting('tuning', 0);
    msg.innerHTML = 'Back to standard tuning.';
  });
  disposers.push(close);
  try {
    await listener.start();
    listener.onRaw.add(onRaw);
  } catch {
    msg.textContent = 'The microphone is off. Allow microphone access for this site, then try again.';
  }
}

// ---------------------------------------------------------------- free play
function showFreePlay() {
  keepAwake(true);
  const el = h(`<main class="lesson free">
    <header class="topbar">
      <button class="icon-btn" data-home aria-label="Home">${icons.home}</button>
      <div class="top-title"><span class="eyebrow">Free play</span><span>Play anything</span></div>
      <div class="top-actions"></div>
    </header>
    <section class="stage free-stage">
      <div class="heard"><span class="heard-note">–</span><span class="muted heard-sub">Turn on listening and play, or tap the keys</span></div>
    </section>
    <div class="kb-wrap"></div>
  </main>`);
  $('.top-actions', el).appendChild(micButton());
  $('[data-home]', el).addEventListener('click', () => go('#/'));
  const show = (midi) => {
    const name = midiToName(midi);
    $('.heard-note', el).textContent = prettyName(name);
    $('.heard-sub', el).textContent = `${name.replace('#', '♯')}${midi === 60 ? ' (Middle C)' : ''}`;
    kb.flash(midi, 'good');
  };
  const kb = new Keyboard($('.kb-wrap', el), { lo: toMidi('C3'), hi: toMidi('C6'), labels: store.setting('keyNames') ? 'all' : 'c', onPress: show });
  const onNote = (m) => show(m);
  listener.onNote.add(onNote);
  disposers.push(() => listener.onNote.delete(onNote));
  app.replaceChildren(el);
}

// ---------------------------------------------------------------- play along
function showPlayAlong(id, stepIndex) {
  keepAwake(true);
  const step = findLesson(id).lesson.steps[stepIndex];
  if (!step || step.t !== 'play') return go(`#/lesson/${id}/${stepIndex}`);
  disposers.push(mountPlayAlong(app, sung(step), { micButton, onExit: () => go(`#/lesson/${id}/${stepIndex}`) }));
}

// ---------------------------------------------------------------- printing
function showPrint(id, stepIndex) {
  keepAwake(false);
  const songs = printOne(id, stepIndex);
  disposers.push(mountPrint(app, { songs, heading: songs[0].lesson.title, onBack: () => go(`#/lesson/${id}/${stepIndex}`) }));
}

function showSongbook() {
  keepAwake(false);
  disposers.push(mountPrint(app, { songs: songbook(), heading: 'The Piano Tutor songbook', onBack: () => go('#/') }));
}

// ---------------------------------------------------------------- lesson
function showLesson(id, stepIndex) {
  keepAwake(true);
  const { lesson, unit } = findLesson(id);
  stepIndex = Math.max(0, Math.min(stepIndex, lesson.steps.length - 1));
  if (!lesson.daily) store.setLast(id, stepIndex);
  const step = lesson.steps[stepIndex];
  const isLast = stepIndex === lesson.steps.length - 1;

  const el = h(`<main class="lesson step-${step.t}">
    <header class="topbar">
      <button class="icon-btn" data-home aria-label="All lessons">${icons.home}</button>
      <div class="top-title"><span class="eyebrow">${unit.title}</span><span>${lesson.title}</span></div>
      <div class="dots">${lesson.steps.map((s, i) => `<i class="${i < stepIndex ? 'past' : i === stepIndex ? 'now' : ''}"></i>`).join('')}</div>
      <div class="top-actions"></div>
      <button class="icon-btn" data-prev aria-label="Previous step" ${stepIndex === 0 ? 'disabled' : ''}>${icons.back}</button>
      <button class="icon-btn primary" data-next aria-label="${isLast ? 'Finish lesson' : 'Next step'}">${isLast ? icons.check : icons.next}</button>
    </header>
    <section class="stage"></section>
  </main>`);
  $('.top-actions', el).appendChild(micButton());

  const goStep = (i) => go(`#/lesson/${id}/${i}`);
  let stepDone = false;
  const finish = () => {
    // A recital's ribbon is earned by playing the performance all the way through.
    if (lesson.recital && step.final && !stepDone) {
      toast('Play your recital all the way through to earn the ribbon.');
      return;
    }
    if (lesson.daily) {
      if (id === 'daily') store.practised(today());
      return celebrate(lesson, null, id === 'drill' ? () => go('#/lesson/drill/0') : step.t === 'play' ? () => route() : null);
    }
    store.markDone(id);
    // From the Hymns shelf, the next hymn; otherwise the next lesson in the course.
    const nxt = lesson.hymn
      ? HYMNS.slice(HYMNS.indexOf(lesson) + 1).find((l) => !store.isDone(l.id)) || null
      : nextLesson(store.data.done, id);
    celebrate(lesson, nxt, step.t === 'play' ? () => route() : null);
  };
  $('[data-home]', el).addEventListener('click', () => go('#/'));
  $('[data-prev]', el).addEventListener('click', () => goStep(stepIndex - 1));
  $('[data-next]', el).addEventListener('click', () => (isLast ? finish() : goStep(stepIndex + 1)));

  const ctx = {
    el, stage: $('.stage', el),
    playAlong: `#/play/${id}/${stepIndex}`,
    complete: () => {
      stepDone = true;
      const btn = $('[data-next]', el);
      btn.classList.add('ready');
    },
    next: () => (isLast ? finish() : goStep(stepIndex + 1)),
  };
  app.replaceChildren(el);
  if (step.t === 'read') renderRead(step, ctx);
  else if (step.t === 'quiz') renderQuiz(step, ctx);
  else if (step.t === 'play') renderPlay(sung(step), ctx);
  else if (step.t === 'choose') renderChoose(step, lesson, ctx);
}

// "3 days in a row", counting back from today (or yesterday, if not yet today).
function streakText() {
  const days = store.data.practice || {};
  const d = new Date();
  if (!days[today(d)]) d.setDate(d.getDate() - 1);
  let n = 0;
  while (days[today(d)]) { n++; d.setDate(d.getDate() - 1); }
  return n > 1 ? `${n} days in a row. Keep it going!` : n === 1 ? 'Practised today. See you tomorrow!' : 'About ten minutes, from what you\'ve learned';
}

function showMetronome() {
  keepAwake(true);
  disposers.push(mountMetronome(app, { onBack: () => go('#/') }));
}

function celebrate(lesson, nxt, again) {
  const dlg = h(`<div class="sheet-backdrop celebrate"><div class="sheet">
    <div class="confetti">${Array.from({ length: 14 }, (_, i) => `<i style="--i:${i}"></i>`).join('')}</div>
    ${lesson.recital ? `<div class="medal">${icons.ribbon}</div><h2>Recital passed!</h2>` : lesson.daily ? '<h2>Practice done</h2>' : '<h2>Lesson complete</h2>'}
    <p class="muted">${lesson.id === 'daily' ? streakText() : lesson.title}</p>
    <div class="sheet-actions">
      <button class="text-btn" data-home>All lessons</button>
      ${again ? `<button class="btn" data-again>${icons.restart} ${lesson.id === 'drill' ? 'New notes' : 'Play again'}</button>` : ''}
      ${nxt ? `<button class="btn primary" data-next>Next: ${nxt.title}</button>` : ''}
    </div>
  </div></div>`);
  $('[data-home]', dlg).addEventListener('click', () => { dlg.remove(); go('#/'); });
  $('[data-next]', dlg)?.addEventListener('click', () => { dlg.remove(); go(`#/lesson/${nxt.id}/0`); });
  $('[data-again]', dlg)?.addEventListener('click', () => { dlg.remove(); again(); });
  document.body.appendChild(dlg);
  disposers.push(() => dlg.remove());
}

// A figure is either ready-made SVG markup or sheet music to draw.
function figureEl(step) {
  if (step.fig) return h(`<figure class="figure">${step.fig}</figure>`);
  if (step.staffFig) {
    const f = h('<figure class="figure staff-fig"><div class="staff-host"></div></figure>');
    const draw = () => renderStaff($('.staff-host', f), {
      staves: step.staffFig.staves.map((s) => ({ clef: s.clef, events: parseSeq(s.seq) })),
      key: step.staffFig.key || 'C', time: step.staffFig.time || '4/4', pickup: step.staffFig.pickup, showNames: step.staffFig.names, maxBars: step.staffFig.bars || 2,
    });
    requestAnimationFrame(draw);
    return f;
  }
  return null;
}

// A recital lets you pick your piece from the ones that suit this level.
function renderChoose(step, lesson, ctx) {
  const el = h(`<div class="read choose">
    <div class="read-text"><h2>${step.title}</h2>
      <p>Pick the piece you'd like to perform. Each one suits what you've learned so far. You can come back and switch any time, and every piece is always waiting on the Hymns shelf.</p></div>
    <div class="choices"></div>
  </div>`);
  lesson.choices.forEach((p) => {
    const on = p === lesson.piece;
    const card = h(`<button class="choice ${on ? 'on' : ''}">
      <span class="choice-mark">${on ? icons.check : icons.note}</span>
      <span class="title">${p.title}</span><span class="muted">${p.summary}</span>
      <span class="eyebrow">${on ? 'Chosen' : 'Choose this one'}</span></button>`);
    card.addEventListener('click', () => {
      store.data.recitals = { ...store.data.recitals, [step.unit]: p.id };
      store.save();
      chooseRecital(step.unit, p.id);
      ctx.next();
    });
    $('.choices', el).appendChild(card);
  });
  ctx.stage.appendChild(el);
  ctx.complete();
}

function renderRead(step, ctx) {
  const fig = figureEl(step);
  const el = h(`<div class="read ${fig ? 'with-fig' : ''}">
    <div class="read-text"><h2>${step.title}</h2>${step.body}</div>
  </div>`);
  if (fig) el.appendChild(fig);
  ctx.stage.appendChild(el);
  ctx.complete();
}

function listenButton(seq, tempo = 90) {
  const btn = h(`<button class="pill">${icons.ear}<span>Listen</span></button>`);
  let playing = null;
  btn.addEventListener('click', async () => {
    await piano.unlock();
    if (playing) { playing.cancel(); playing = null; return; }
    btn.classList.add('active');
    // Played like a demo, so dynamics, staccato and the pedal can be heard.
    playing = playDemo(buildPractice({ rh: seq }), tempo, false, () => {});
    await playing.done;
    playing = null;
    btn.classList.remove('active');
  });
  disposers.push(() => playing?.cancel());
  return btn;
}

function renderQuiz(step, ctx) {
  const fig = figureEl(step);
  const el = h(`<div class="quiz ${fig ? 'with-fig' : ''}">
    <div class="quiz-main">
      <h2>${step.q}</h2>
      <div class="quiz-listen"></div>
      <div class="options">${step.options.map((o, i) => `<button class="option" data-i="${i}">${o}</button>`).join('')}</div>
      <p class="explain" aria-live="polite"></p>
    </div>
  </div>`);
  if (fig) el.appendChild(fig);
  if (step.listen) $('.quiz-listen', el).appendChild(listenButton(step.listen, step.tempo || 90));
  el.querySelectorAll('.option').forEach((b) => b.addEventListener('click', () => {
    const i = +b.dataset.i;
    if (i === step.answer) {
      b.classList.add('right');
      el.querySelectorAll('.option').forEach((o) => { o.disabled = true; });
      $('.explain', el).innerHTML = `<b>Yes!</b> ${step.explain || ''}`;
      piano.unlock().then(() => piano.chime());
      ctx.complete();
    } else {
      b.classList.add('wrong');
      b.disabled = true;
      $('.explain', el).textContent = 'Not quite. Try another answer.';
    }
  }));
  ctx.stage.appendChild(el);
}

// ---------------------------------------------------------------- play steps
// Hymns with several verses: which one is sung (the choice holds across hymns).
const verseCount = (step) => (step.verses ? step.verses.length + 1 : 1);
const verseOf = (step) => Math.min(store.setting('verse') || 1, verseCount(step));
const sung = (step) => (verseOf(step) > 1 ? { ...step, lyrics: step.verses[verseOf(step) - 2] } : step);

function renderPlay(step, ctx) {
  const practice = buildPractice(step);
  const { moments, staves } = practice;
  const reps = step.reps || 1;
  const labelsAllowed = step.keyLabels || 'c';
  const canPlayAlong = !step.anyNote && !step.anyOrder && !step.noDemo && (step.song || moments.length >= 6);
  const labels = store.setting('keyNames') ? labelsAllowed : (labelsAllowed === 'none' ? 'none' : 'c');

  const el = h(`<div class="play">
    <div class="play-head">
      <p class="say">${step.say}</p>
      <div class="play-tools">
        <span class="reps"></span>
        ${step.anyNote || step.noDemo ? '' : `<span class="listen-group"><button class="pill" data-demo>${icons.ear}<span>Listen</span></button><button class="pill speed" data-speed aria-label="Listening speed"></button></span>`}
        ${step.verses && store.setting('lyrics') ? `<button class="pill" data-verse aria-label="Change verse">Verse ${verseOf(step)}</button>` : ''}
        ${canPlayAlong ? `<button class="pill accent" data-along>${icons.play}<span>Play along</span></button>` : ''}
        ${step.song ? `<button class="icon-btn" data-print aria-label="Print sheet music">${icons.print}</button>` : ''}
        ${step.hint === false ? `<button class="pill" data-hint>${icons.bulb}<span>Show me</span></button>` : ''}
        ${step.anyNote ? '' : `<button class="icon-btn" data-restart aria-label="Start again">${icons.restart}</button>`}
      </div>
    </div>
    <div class="music"></div>
    ${practice.lyrics && store.setting('lyrics') ? '<p class="lyric-line"></p>' : ''}
    <div class="feedback" aria-live="polite"></div>
  </div>`);
  ctx.stage.appendChild(el);
  const kbWrap = h('<div class="kb-wrap"></div>');
  ctx.el.appendChild(kbWrap);

  const range = step.range ? step.range.map(toMidi) : [toMidi('C3'), toMidi('C5')];
  const music = $('.music', el);
  const feedback = $('.feedback', el);

  let rep = 0, mi = 0;
  let satisfied = new Set(); // indexes into moment.items
  // Steps with dynamics or staccato: what the mic heard of each note's loudness and length.
  const dynAt = dynamicsByMoment(moments);
  const expressive = moments.some((m) => m.items.some((it) => it.staccato)) || new Set(dynAt.filter(Boolean)).size > 1;
  let heard = [];
  let demoAt = null; // the moment the Listen demo is playing
  let startedAt = null; // timed drills: when the first note was played
  let showTargets = step.hint !== false;
  let finished = false;

  const kb = new Keyboard(kbWrap, { lo: range[0], hi: range[1], labels, onPress: (m) => input(m, 'tap') });

  // ---- display
  const strip = !step.staff && !step.anyNote;
  function drawMusic() {
    if (step.anyNote) {
      music.innerHTML = `<div class="big-prompt">${finished ? 'Heard you!' : 'Play any key'}</div>`;
      return;
    }
    // While the demo plays, the music follows it instead of the player.
    const at = demoAt ?? mi;
    const fin = demoAt == null && finished;
    const lyricEl = $('.lyric-line', el);
    if (lyricEl) lyricEl.innerHTML = lyricHTML(lyricLine(practice.lyrics, moments, fin ? moments.length - 1 : at));
    if (step.staff) {
      const cur = moments[at]?.items[0];
      const done = new Set();
      moments.slice(0, at).forEach((m) => m.items.forEach((it) => done.add(`${it.staff}:${it.index}`)));
      renderStaff(music, {
        staves: staves.map((s) => ({ clef: s.clef, events: s.events })),
        key: step.key || 'C', time: step.time || '4/4', pickup: step.pickup,
        current: cur && !fin ? { staff: cur.staff, index: cur.index } : null, done, showNames: step.names,
      });
      return;
    }
    // Note strip: one chip per moment, width by length.
    if (!music.firstChild) {
      music.innerHTML = `<div class="strip">${moments.map((m, i) => {
        const beats = Math.max(...m.items.map((it) => it.beats));
        const label = m.items.map((it) => (step.names === false ? '' : prettyName(it.name))).join(' ');
        const hands = store.setting('handLabels');
        const fingers = m.items.filter((it) => it.finger).map((it) => (hands ? `${it.hand}${it.finger}` : it.finger)).join(' ');
        return `<div class="chip hand-${m.items[0].hand}" data-i="${i}" style="--w:${Math.min(4, Math.max(1, beats))}">
          <b>${label || '?'}</b>${fingers ? `<small>${fingers}</small>` : ''}</div>`;
      }).join('')}</div>`;
    }
    music.querySelectorAll('.chip').forEach((c, i) => {
      c.classList.toggle('done', i < at || fin);
      c.classList.toggle('now', i === at && !fin);
      if (step.anyOrder) c.classList.toggle('done', fin);
    });
    if (step.anyOrder) {
      // In "any order" steps, mark each satisfied note's chip.
      const chips = music.querySelectorAll('.chip');
      if (chips.length === 1) {
        chips[0].innerHTML = moments[0].items.map((it, k) => `<span class="sub ${satisfied.has(k) ? 'ok' : ''}">${step.names === false ? (satisfied.has(k) ? prettyName(it.name, true) : '?') : prettyName(it.name, true)}</span>`).join('');
      }
    }
    const now = music.querySelector('.chip.now');
    if (now) now.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }

  function paintTargets() {
    if (finished || step.anyNote) { kb.setTargets([]); return; }
    const m = moments[mi];
    if (!m || !showTargets) { kb.setTargets([]); return; }
    kb.setTargets(m.items.filter((_, k) => !satisfied.has(k)).map((it) => ({ midi: it.midi, finger: it.finger, hand: it.hand })));
  }

  function paintReps() {
    const r = $('.reps', el);
    r.textContent = reps > 1 ? `Round ${Math.min(rep + 1, reps)} of ${reps}` : '';
  }

  function reset() {
    mi = 0; satisfied = new Set(); finished = false; heard = []; startedAt = null;
    listener.clearRecent();
    feedback.textContent = '';
    music.innerHTML = '';
    drawMusic(); paintTargets(); paintReps();
  }

  // ---- input
  let pause = false;
  function input(midi, source) {
    if (listener.calibrating && source === 'mic') return;
    if (finished || pause) { kb.flash(midi, 'press'); return; }
    if (step.anyNote) {
      kb.flash(midi, 'good');
      feedback.innerHTML = `<span class="ok">I heard <b>${prettyName(midiToName(midi))}</b>${midi === 60 ? ' (Middle C)' : ''}.</span>`;
      return complete();
    }
    const m = moments[mi];
    // A monophonic pitch reading cannot prove an octave pair or chord.
    // Score microphone chords atomically through chordHeard instead.
    if (source === 'mic' && m.items.length > 1 && !step.anyOrder) {
      kb.flash(midi, 'press');
      return;
    }
    const anyOctave = store.setting('anyOctave');
    const ok = (it) => matches(midi, it.midi, { anyOctave, source });
    const exact = m.items.findIndex((it, idx) => !satisfied.has(idx) && it.midi === midi);
    const k = exact !== -1 ? exact : m.items.findIndex((it, idx) => !satisfied.has(idx) && ok(it));
    if (k === -1) {
      // Already-satisfied notes ringing on are fine; anything else is a gentle miss.
      if (m.items.some(ok)) return;
      kb.flash(midi, 'miss');
      const want = m.items.filter((_, idx) => !satisfied.has(idx)).map((it) => prettyName(it.name)).join(' + ');
      feedback.innerHTML = `Heard <b>${prettyName(midiToName(midi))}</b>${step.hint === false && !showTargets ? '. Try again.' : `, looking for <b>${want}</b>.`}`;
      return;
    }
    satisfied.add(k);
    if (step.timed && startedAt == null) startedAt = performance.now();
    if (source === 'mic' && expressive) heard.push({ t: performance.now(), item: m.items[k], dyn: dynAt[mi] });
    kb.flash(m.items[k].midi, 'good');
    feedback.textContent = '';
    if (satisfied.size >= m.items.length) advance();
    else { paintTargets(); drawMusic(); }
  }

  function advance() {
    listener.clearRecent();
    mi++;
    satisfied = new Set();
    if (step.hint === false) showTargets = false;
    if (mi < moments.length) { drawMusic(); paintTargets(); return; }
    rep++;
    if (rep >= reps) return complete();
    // Another round: pause briefly so the last note can ring out.
    pause = true;
    feedback.innerHTML = '<span class="ok">Nice! Once more.</span>';
    piano.chime();
    drawMusic(); paintTargets();
    setTimeout(() => {
      pause = false;
      mi = 0;
      listener.clearRecent();
      music.innerHTML = '';
      feedback.textContent = '';
      drawMusic(); paintTargets(); paintReps();
    }, 1100);
  }

  function complete() {
    finished = true;
    piano.chime();
    if (step.final) feedback.innerHTML = `<span class="ok"><b>Bravo!</b> What a performance. Tap ${icons.check} to take your bow.</span>`;
    else if (!step.anyNote) feedback.innerHTML = `<span class="ok"><b>Well played!</b> Tap ${icons.next} to continue.</span>`;
    if (step.timed && startedAt != null) {
      const secs = Math.round((performance.now() - startedAt) / 100) / 10;
      const best = store.data.best?.[step.timed];
      const record = !best || secs < best;
      if (record) store.data.best = { ...store.data.best, [step.timed]: secs };
      store.save();
      feedback.prepend(h(`<p class="expr-tip"><b>${secs} seconds</b> for ${moments.length} notes. ${record ? (best ? 'A new personal best!' : 'That\'s your first time to beat.') : `Your best is ${best} s.`}</p>`));
    }
    if (expressive && heard.length >= 4) {
      const notes = heard;
      setTimeout(() => {
        const tip = expressionTip(notes.map((n) => ({ ...n, ...listener.noteShape(n.t) })));
        if (tip && finished) feedback.prepend(h(`<p class="expr-tip">${icons.ear} ${tip}</p>`));
      }, 500);
    }
    if (!step.anyNote) {
      const again = h(`<button class="pill again">${icons.restart}<span>Play again</span></button>`);
      again.addEventListener('click', () => { rep = 0; showTargets = step.hint !== false; reset(); });
      feedback.append(' ', again);
    }
    drawMusic(); paintTargets(); paintReps();
    ctx.complete();
    el.classList.add('success');
    setTimeout(() => el.classList.remove('success'), 1200);
  }

  // ---- mic
  const onNote = (midi) => input(midi, 'mic');
  listener.onNote.add(onNote);
  // Chords: the mic can rarely pick out every note, so also check the spectrum.
  const chordTimer = setInterval(() => {
    if (finished || pause || !listener.active) return;
    const m = moments[mi];
    if (!m || m.items.length < 2 || step.anyOrder) return;
    const midis = m.items.map((it) => it.midi);
    if (listener.chordHeard(midis)) {
      if (step.timed && startedAt == null) startedAt = performance.now();
      if (expressive) m.items.forEach(item => heard.push({ t: performance.now(), item, dyn: dynAt[mi] }));
      m.items.forEach((it) => kb.flash(it.midi, 'good'));
      listener.clearRecent();
      advance();
    }
  }, 80);
  disposers.push(() => { listener.onNote.delete(onNote); clearInterval(chordTimer); });

  // ---- demo playback
  let demo = null;
  const demoBtn = $('[data-demo]', el);
  // Listen can be slowed down or sped up too.
  let listenSpeed = store.setting('listenSpeed') || 1;
  const speedBtn = $('[data-speed]', el);
  const paintSpeed = () => { if (speedBtn) speedBtn.textContent = SPEEDS.find(([v]) => v === listenSpeed)?.[1] || '1×'; };
  speedBtn?.addEventListener('click', () => {
    const i = SPEEDS.findIndex(([v]) => v === listenSpeed);
    listenSpeed = SPEEDS[(i + 1) % SPEEDS.length][0];
    store.setting('listenSpeed', listenSpeed);
    paintSpeed();
    if (demo) { stopDemo(); demoBtn.click(); }
  });
  paintSpeed();
  const stopDemo = () => {
    demo?.cancel(); demo = null;
    demoBtn?.classList.remove('active');
    if (demoBtn) demoBtn.querySelector('span').textContent = 'Listen';
  };
  demoBtn?.addEventListener('click', async () => {
    await piano.unlock();
    if (demo) return stopDemo();
    demoBtn.classList.add('active');
    demoBtn.querySelector('span').textContent = 'Stop';
    demo = playDemo(practice, (step.tempo || 80) * listenSpeed, step.metronome || step.song, (i) => {
      demoAt = i >= 0 ? i : null;
      drawMusic();
      if (i >= 0) moments[i].items.forEach((it) => kb.flash(it.midi, 'press'));
    }, step.time);
    demo.done.then(() => { if (demo) stopDemo(); });
  });
  disposers.push(stopDemo);

  $('[data-along]', el)?.addEventListener('click', () => { piano.unlock(); go(ctx.playAlong); });
  $('[data-verse]', el)?.addEventListener('click', () => { store.setting('verse', (verseOf(step) % verseCount(step)) + 1); route(); });
  $('[data-print]', el)?.addEventListener('click', () => go(ctx.playAlong.replace('#/play/', '#/print/')));
  $('[data-restart]', el)?.addEventListener('click', () => { rep = 0; showTargets = step.hint !== false; reset(); });
  $('[data-hint]', el)?.addEventListener('click', () => { showTargets = true; paintTargets(); });

  // Redraw sheet music when the size changes (e.g. rotating the phone).
  if (step.staff) {
    const ro = new ResizeObserver(() => drawMusic());
    ro.observe(music);
    disposers.push(() => ro.disconnect());
  }
  reset();
}

// Plays every note at its own time and length, with optional count-in clicks.
// How hard the demo plays each dynamic.
const LEVELS = { pp: 0.12, p: 0.25, mp: 0.45, mf: 0.62, f: 0.85, ff: 1 };

// The dynamic (p, mf, f…) in force at each moment, or null before any is marked.
function dynamicsByMoment(moments) {
  let cur = null;
  return moments.map((m) => {
    const mark = m.items.flatMap((it) => it.marks || []).find((k) => k in LEVELS);
    if (mark) cur = mark;
    return cur;
  });
}

const median = (xs) => { const s = [...xs].sort((a, b) => a - b); return s.length ? s[Math.floor(s.length / 2)] : 0; };

// A friendly word on loud versus soft and short versus long, from what the mic heard.
// Phones and rooms differ a lot, so this only compares the player with themselves.
function expressionTip(notes) {
  const tips = [];
  const soft = notes.filter((n) => ['pp', 'p', 'mp'].includes(n.dyn)).map((n) => n.peak);
  const loud = notes.filter((n) => ['f', 'ff'].includes(n.dyn)).map((n) => n.peak);
  if (soft.length >= 2 && loud.length >= 2) {
    const ratio = median(loud) / Math.max(1e-6, median(soft));
    tips.push(ratio >= 1.4 ? 'I could hear your loud and soft clearly. Lovely contrast!'
      : ratio >= 1.1 ? 'I heard some difference between loud and soft. Try making it even bigger.'
      : 'Your loud and soft sounded about the same to me. Try a much lighter touch on the soft notes.');
  }
  const short = notes.filter((n) => n.item.staccato).map((n) => n.sustain);
  const long = notes.filter((n) => !n.item.staccato).map((n) => n.sustain);
  if (short.length >= 2) {
    const crisp = long.length >= 2 ? median(short) < median(long) * 0.7 : median(short) < 0.3;
    tips.push(crisp ? 'Your staccato notes were nice and crisp.' : 'Try bouncing off the staccato notes a little quicker.');
  }
  return tips.join(' ');
}

function playDemo(practice, bpm, clicks, onMoment, time = '4/4') {
  const ctx = piano.ctx;
  const spb = 60 / bpm;
  const [num, den] = time.split('/').map(Number);
  const beatUnit = 4 / den;
  const start = ctx.currentTime + (clicks ? num * beatUnit * spb : 0) + 0.15;
  if (clicks) for (let b = 0; b < num; b++) piano.click(ctx.currentTime + 0.15 + b * beatUnit * spb, b === 0);
  const handles = [];
  const timers = [];
  // Loudness follows the dynamics marks; the pedal holds notes until it lifts.
  let velocity = 0.7, ramp = 0, pedalFrom = null;
  const pedalled = [];
  practice.moments.forEach((m, i) => {
    const t = start + m.beat * spb;
    const marks = m.items.flatMap((it) => it.marks || []);
    if (marks.includes('lift') && pedalFrom != null) {
      pedalled.splice(0).forEach((n) => n.release(t));
      pedalFrom = null;
    }
    if (marks.includes('ped')) pedalFrom = t;
    // A dynamic sets the level; cresc. and dim. keep nudging it until the next one.
    const level = marks.find((k) => k in LEVELS);
    if (level) velocity = LEVELS[level];
    else velocity = Math.min(1, Math.max(0.1, velocity + ramp));
    ramp = marks.includes('cresc') ? 0.06 : marks.includes('dim') ? -0.06 : level ? 0 : ramp;
    m.items.forEach((it) => {
      const len = it.staccato ? Math.min(0.22, it.beats * spb * 0.4) : Math.max(0.2, it.beats * spb * 0.95);
      const held = pedalFrom != null;
      const note = piano.play(it.midi, { when: t, duration: held ? 8 : len, velocity });
      handles.push(note);
      if (held) pedalled.push({ release: (at) => note.stop(at) });
    });
    timers.push(setTimeout(() => onMoment(i), (t - ctx.currentTime) * 1000));
  });
  const end = start + practice.totalBeats * spb;
  pedalled.forEach((n) => n.release(end + 0.4));
  let resolve;
  const done = new Promise((r) => { resolve = r; });
  timers.push(setTimeout(() => { onMoment(-1); resolve(); }, (end - ctx.currentTime) * 1000 + 300));
  return {
    done,
    cancel() { timers.forEach(clearTimeout); handles.forEach((hd) => hd.stop()); onMoment(-1); resolve(); },
  };
}

// ---------------------------------------------------------------- boot
document.addEventListener('pointerdown', () => piano.unlock(), { once: true });
route();

if ('serviceWorker' in navigator && location.protocol === 'https:') {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}
