import { UNITS, findLesson, nextLesson } from './lessons/index.js';
import { piano } from './audio.js';
import { listener } from './listen.js';
import { Keyboard } from './keyboard.js';
import { renderStaff } from './staff.js';
import { buildPractice, matches } from './practice.js';
import { parseSeq, beatsOf, toMidi, midiToName, prettyName } from './theory.js';
import { store } from './store.js';
import { icons } from './icons.js';

const $ = (sel, root = document) => root.querySelector(sel);
const app = $('#app');
const h = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };

piano.setVolume(store.setting('volume'));

// ---------------------------------------------------------------- routing
window.addEventListener('hashchange', route);
function route() {
  cleanup();
  const [, view, id, step] = location.hash.split('/');
  if (view === 'lesson' && findLesson(id)) return showLesson(id, Number(step) || 0);
  if (view === 'free') return showFreePlay();
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
    <span class="eyebrow">${doneCount ? (resume ? 'Pick up where you left off' : 'Up next') : 'Start here'}</span>
    <span class="title">${contLesson.title}</span>
    <span class="muted">${contLesson.summary}</span>
    <span class="go">${icons.play}</span>
  </button>`));
  cont.firstChild.addEventListener('click', () => go(`#/lesson/${contLesson.id}/${resume ? resume.step : 0}`));

  const units = $('.units', el);
  UNITS.forEach((u, ui) => {
    const done = u.lessons.filter((l) => store.isDone(l.id)).length;
    const sec = h(`<div class="unit">
      <div class="unit-head"><span class="unit-num">${ui + 1}</span><div><h2>${u.title}</h2><p class="muted">${u.blurb}</p></div>
      <span class="unit-progress">${done}/${u.lessons.length}</span></div>
      <div class="lesson-row"></div></div>`);
    const row = $('.lesson-row', sec);
    u.lessons.forEach((l, li) => {
      const isDone = store.isDone(l.id);
      const card = h(`<button class="lesson-card ${isDone ? 'done' : ''} ${l === target ? 'next' : ''}">
        <span class="num">${isDone ? icons.check : li + 1}</span>
        <span class="title">${l.title}</span>
        <span class="muted">${l.summary}</span></button>`);
      card.addEventListener('click', () => go(`#/lesson/${l.id}/0`));
      row.appendChild(card);
    });
    units.appendChild(sec);
  });

  $('[data-free]', el).addEventListener('click', () => go('#/free'));
  $('[data-settings]', el).addEventListener('click', showSettings);
  app.replaceChildren(el);
  // Bring the next lesson into view in its row.
  requestAnimationFrame(() => {
    const card = $('.lesson-card.next', el);
    if (card) card.parentElement.scrollLeft = card.offsetLeft - card.parentElement.offsetLeft - 16;
  });
}

// ---------------------------------------------------------------- settings
function showSettings() {
  const s = store.data.settings;
  const dlg = h(`<div class="sheet-backdrop"><div class="sheet" role="dialog" aria-label="Settings">
    <div class="sheet-head"><h2>Settings</h2><button class="icon-btn" data-close aria-label="Close">${icons.x}</button></div>
    <label class="row"><span>Piano volume</span><input type="range" min="0" max="1" step="0.05" value="${s.volume}" data-vol></label>
    <label class="row"><span>Show note names on keys<small>When a lesson allows it</small></span><input type="checkbox" ${s.keyNames ? 'checked' : ''} data-names></label>
    <label class="row"><span>Accept any octave<small>Forgives the mic mishearing a note an octave off</small></span><input type="checkbox" ${s.anyOctave ? 'checked' : ''} data-oct></label>
    <button class="text-btn danger" data-reset>Reset all progress</button>
    <p class="muted small">Progress is saved on this device. Piano sound: Salamander Grand Piano by Alexander Holm (CC BY 3.0).</p>
  </div></div>`);
  const close = () => dlg.remove();
  dlg.addEventListener('click', (e) => { if (e.target === dlg) close(); });
  $('[data-close]', dlg).addEventListener('click', close);
  $('[data-vol]', dlg).addEventListener('input', (e) => { store.setting('volume', +e.target.value); piano.setVolume(+e.target.value); });
  $('[data-names]', dlg).addEventListener('change', (e) => { store.setting('keyNames', e.target.checked); route(); });
  $('[data-oct]', dlg).addEventListener('change', (e) => store.setting('anyOctave', e.target.checked));
  $('[data-reset]', dlg).addEventListener('click', () => {
    if (confirm('Clear all lesson progress on this device?')) { store.reset(); close(); route(); }
  });
  document.body.appendChild(dlg);
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

// ---------------------------------------------------------------- lesson
function showLesson(id, stepIndex) {
  keepAwake(true);
  const { lesson, unit } = findLesson(id);
  stepIndex = Math.max(0, Math.min(stepIndex, lesson.steps.length - 1));
  store.setLast(id, stepIndex);
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
  const finish = () => {
    store.markDone(id);
    const nxt = nextLesson(store.data.done, id);
    celebrate(lesson, nxt);
  };
  $('[data-home]', el).addEventListener('click', () => go('#/'));
  $('[data-prev]', el).addEventListener('click', () => goStep(stepIndex - 1));
  $('[data-next]', el).addEventListener('click', () => (isLast ? finish() : goStep(stepIndex + 1)));

  const ctx = {
    el, stage: $('.stage', el),
    complete: () => {
      const btn = $('[data-next]', el);
      btn.classList.add('ready');
    },
    next: () => (isLast ? finish() : goStep(stepIndex + 1)),
  };
  app.replaceChildren(el);
  if (step.t === 'read') renderRead(step, ctx);
  else if (step.t === 'quiz') renderQuiz(step, ctx);
  else if (step.t === 'play') renderPlay(step, ctx);
}

function celebrate(lesson, nxt) {
  const dlg = h(`<div class="sheet-backdrop celebrate"><div class="sheet">
    <div class="confetti">${Array.from({ length: 14 }, (_, i) => `<i style="--i:${i}"></i>`).join('')}</div>
    <h2>Lesson complete</h2>
    <p class="muted">${lesson.title}</p>
    <div class="sheet-actions">
      <button class="text-btn" data-home>All lessons</button>
      ${nxt ? `<button class="btn primary" data-next>Next: ${nxt.title}</button>` : ''}
    </div>
  </div></div>`);
  $('[data-home]', dlg).addEventListener('click', () => { dlg.remove(); go('#/'); });
  $('[data-next]', dlg)?.addEventListener('click', () => { dlg.remove(); go(`#/lesson/${nxt.id}/0`); });
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
      key: step.staffFig.key || 'C', time: step.staffFig.time || '4/4', showNames: step.staffFig.names, maxBars: 2,
    });
    requestAnimationFrame(draw);
    return f;
  }
  return null;
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
    const evs = parseSeq(seq).filter((e) => !e.bar).map((e) => ({ midis: e.midis || [], beats: beatsOf(e.dur) }));
    btn.classList.add('active');
    playing = piano.playSequence(evs, { bpm: tempo });
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
function renderPlay(step, ctx) {
  const practice = buildPractice(step);
  const { moments, staves } = practice;
  const reps = step.reps || 1;
  const labelsAllowed = step.keyLabels || 'c';
  const labels = store.setting('keyNames') ? labelsAllowed : (labelsAllowed === 'none' ? 'none' : 'c');

  const el = h(`<div class="play">
    <div class="play-head">
      <p class="say">${step.say}</p>
      <div class="play-tools">
        <span class="reps"></span>
        ${step.anyNote ? '' : `<button class="pill" data-demo>${icons.ear}<span>Listen</span></button>`}
        ${step.hint === false ? `<button class="pill" data-hint>${icons.bulb}<span>Show me</span></button>` : ''}
        ${step.anyNote ? '' : `<button class="icon-btn" data-restart aria-label="Start again">${icons.restart}</button>`}
      </div>
    </div>
    <div class="music"></div>
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
    if (step.staff) {
      const cur = moments[mi]?.items[0];
      const done = new Set();
      moments.slice(0, mi).forEach((m) => m.items.forEach((it) => done.add(`${it.staff}:${it.index}`)));
      renderStaff(music, {
        staves: staves.map((s) => ({ clef: s.clef, events: s.events })),
        key: step.key || 'C', time: step.time || '4/4', pickup: step.pickup,
        current: cur && !finished ? { staff: cur.staff, index: cur.index } : null, done, showNames: step.names,
      });
      return;
    }
    // Note strip: one chip per moment, width by length.
    if (!music.firstChild) {
      music.innerHTML = `<div class="strip">${moments.map((m, i) => {
        const beats = Math.max(...m.items.map((it) => it.beats));
        const label = m.items.map((it) => (step.names === false ? '' : prettyName(it.name))).join(' ');
        const fingers = m.items.map((it) => it.finger || '').filter(Boolean).join(' ');
        return `<div class="chip hand-${m.items[0].hand}" data-i="${i}" style="--w:${Math.min(4, Math.max(1, beats))}">
          <b>${label || '?'}</b>${fingers ? `<small>${fingers}</small>` : ''}</div>`;
      }).join('')}</div>`;
    }
    music.querySelectorAll('.chip').forEach((c, i) => {
      c.classList.toggle('done', i < mi || finished);
      c.classList.toggle('now', i === mi && !finished);
      if (step.anyOrder) c.classList.toggle('done', finished);
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
    mi = 0; satisfied = new Set(); finished = false;
    listener.clearRecent();
    feedback.textContent = '';
    music.innerHTML = '';
    drawMusic(); paintTargets(); paintReps();
  }

  // ---- input
  let pause = false;
  function input(midi, source) {
    if (finished || pause) { kb.flash(midi, 'press'); return; }
    if (step.anyNote) {
      kb.flash(midi, 'good');
      feedback.innerHTML = `<span class="ok">I heard <b>${prettyName(midiToName(midi))}</b>${midi === 60 ? ' (Middle C)' : ''}.</span>`;
      return complete();
    }
    const m = moments[mi];
    const anyOctave = store.setting('anyOctave');
    // Chords confuse pitch detection about octaves, so the mic only needs the letter there.
    const loose = source === 'mic' && m.items.length > 1;
    const ok = (it) => (loose ? (midi - it.midi) % 12 === 0 : matches(midi, it.midi, { anyOctave, source }));
    const k = m.items.findIndex((it, idx) => !satisfied.has(idx) && ok(it));
    if (k === -1) {
      // Already-satisfied notes ringing on are fine; anything else is a gentle miss.
      if (m.items.some(ok)) return;
      kb.flash(midi, 'miss');
      const want = m.items.filter((_, idx) => !satisfied.has(idx)).map((it) => prettyName(it.name)).join(' + ');
      feedback.innerHTML = `Heard <b>${prettyName(midiToName(midi))}</b>${step.hint === false && !showTargets ? '. Try again.' : `, looking for <b>${want}</b>.`}`;
      return;
    }
    satisfied.add(k);
    kb.flash(m.items[k].midi, 'good');
    feedback.textContent = '';
    if (satisfied.size >= m.items.length) advance();
    else { paintTargets(); drawMusic(); }
  }

  function advance() {
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
    if (!step.anyNote) feedback.innerHTML = `<span class="ok"><b>Well played!</b> Tap ${icons.next} to continue, or play it again.</span>`;
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
    if (!m || m.items.length < 2 || m.anyOrder) return;
    const pcs = m.items.map((it) => it.midi % 12);
    if (listener.chordHeard(pcs)) {
      m.items.forEach((it) => kb.flash(it.midi, 'good'));
      listener.clearRecent();
      advance();
    }
  }, 80);
  disposers.push(() => { listener.onNote.delete(onNote); clearInterval(chordTimer); });

  // ---- demo playback
  let demo = null;
  const demoBtn = $('[data-demo]', el);
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
    demo = playDemo(practice, step.tempo || 80, step.metronome || step.song, (i) => {
      const chips = music.querySelectorAll('.chip');
      chips.forEach((c, k) => c.classList.toggle('playing', k === i));
      if (i >= 0) moments[i].items.forEach((it) => kb.flash(it.midi, 'press'));
    }, step.time);
    demo.done.then(() => { if (demo) stopDemo(); });
  });
  disposers.push(stopDemo);

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
function playDemo(practice, bpm, clicks, onMoment, time = '4/4') {
  const ctx = piano.ctx;
  const spb = 60 / bpm;
  const [num, den] = time.split('/').map(Number);
  const beatUnit = 4 / den;
  const start = ctx.currentTime + (clicks ? num * beatUnit * spb : 0) + 0.15;
  if (clicks) for (let b = 0; b < num; b++) piano.click(ctx.currentTime + 0.15 + b * beatUnit * spb, b === 0);
  const handles = [];
  const timers = [];
  practice.moments.forEach((m, i) => {
    const t = start + m.beat * spb;
    m.items.forEach((it) => handles.push(piano.play(it.midi, { when: t, duration: Math.max(0.2, it.beats * spb * 0.95) })));
    timers.push(setTimeout(() => onMoment(i), (t - ctx.currentTime) * 1000));
  });
  const end = start + practice.totalBeats * spb;
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
