// Printable sheet music: one song, or every song in the course as a songbook.
// Laid out for US Letter paper; the browser's print dialog does the rest.

import { UNITS, HYMNS, HYMN_SHELF, findLesson } from './lessons/index.js';
import { buildPractice, lyricText } from './practice.js';
import { renderStaff } from './staff.js';
import { icons } from './icons.js';

const RENDER_WIDTH = 820; // drawn at this width, then scaled to the page

// Some step titles only make sense inside their lesson.
const TITLES = {
  'ode-rh': 'Ode to Joy (right hand)',
  progression: 'Chord progression in C',
  'minuet-a': 'Minuet in G, part 1',
  mozart: 'Eine kleine Nachtmusik',
};

const KEY_NAMES = { C: 'C major', G: 'G major', D: 'D major', F: 'F major', Am: 'A minor', Em: 'E minor', Dm: 'D minor' };

export function songTitle(lesson, step) {
  if (lesson.recital) return lesson.piece.title;
  if (lesson.hymn) return lesson.title;
  return TITLES[lesson.id] || step.title || lesson.title;
}

// The last song step of each lesson (the full performance, not the rehearsal):
// the course's songs in order, then every hymn. Recitals are covered by the hymns.
export function songbook() {
  const songs = [];
  const add = (unit, lesson) => {
    let last = -1;
    lesson.steps.forEach((s, i) => { if (s.t === 'play' && s.song) last = i; });
    if (last >= 0) songs.push({ unit, lesson, stepIndex: last });
  };
  UNITS.forEach((unit) => unit.lessons.forEach((lesson) => { if (!lesson.recital) add(unit, lesson); }));
  HYMNS.forEach((lesson) => add(HYMN_SHELF, lesson));
  return songs;
}

function barsPerLine(step) {
  const [num, den] = (step.time || '4/4').split('/').map(Number);
  const perBar = num * (4 / den);
  // Words need room: four-beat bars with lyrics go three to a line.
  return perBar <= 1.5 ? 6 : step.lyrics && perBar >= 4 ? 3 : 4;
}

// The first verse goes under the notes: syllables by event index on the melody staff.
function wordsUnderNotes({ moments, lyrics }) {
  if (!lyrics) return null;
  const under = new Map();
  moments.forEach((m) => m.items.forEach((it) => {
    if (it.lyric == null) return;
    const syl = lyrics[it.lyric];
    under.set(it.index, [...(under.get(it.index) || []), syl && !syl.hold ? syl.text : '']);
  }));
  return under;
}

const esc = (t) => t.replace(/[<>&]/g, '');

function songPage(unit, lesson, step) {
  const practice = buildPractice(step);
  const { staves } = practice;
  const page = document.createElement('article');
  page.className = 'paper';
  const hands = staves.map((s) => (s.hand === 'R' ? 'Right hand' : 'Left hand')).join(' and ');
  const facts = [hands, `${step.time || '4/4'} time`];
  if (step.key && step.key !== 'C') facts.push(`Key of ${KEY_NAMES[step.key] || step.key}`);
  const hasFingers = staves.some((s) => s.events.some((e) => e.fingers?.length));
  const fingerNote = !hasFingers ? '' : staves.length > 1
    ? 'Finger numbers sit above the right hand and below the left. 1 is the thumb.'
    : 'Small numbers are fingers. 1 is the thumb.';
  page.innerHTML = `<header class="paper-head">
      <p class="paper-eyebrow">${lesson.hymn ? `Hymn · Unit ${lesson.unitNumber}` : lesson.recital ? 'Recital' : unit.title}</p>
      <h1>${songTitle(lesson, step)}</h1>
      <p class="paper-sub">${facts.join(' · ')}</p>
    </header>
    <div class="systems"></div>
    ${step.verses ? `<div class="stanzas">${step.verses.map((v, i) => `<p><b>${i + 2}</b>${lyricText(v).map(esc).join('<br>')}</p>`).join('')}</div>` : ''}
    <footer class="paper-foot"><span>${fingerNote}</span><span>Piano Tutor · ${unit.title}</span></footer>`;

  const systems = page.querySelector('.systems');
  const per = barsPerLine(step);
  const opts = {
    staves: staves.map((s) => ({ clef: s.clef, events: s.events })),
    key: step.key || 'C', time: step.time || '4/4', pickup: step.pickup,
    showFingers: true, showNames: !!step.names, width: RENDER_WIDTH, current: null, lyrics: wordsUnderNotes(practice),
  };
  // Draw the first line to learn how many bars there are, then the rest.
  let line = document.createElement('div');
  line.className = 'system';
  systems.appendChild(line);
  const { barCount } = renderStaff(line, { ...opts, bars: [0, per] }) || { barCount: 0 };
  for (let from = per; from < barCount; from += per) {
    line = document.createElement('div');
    line.className = 'system';
    systems.appendChild(line);
    // A short last line keeps the same bar width instead of stretching.
    const bars = Math.min(per, barCount - from);
    const share = bars === per ? 1 : Math.max(0.45, (bars + 0.6) / (per + 0.6));
    line.style.width = `${share * 100}%`;
    renderStaff(line, { ...opts, width: Math.round(RENDER_WIDTH * share), bars: [from, from + per] });
  }
  return page;
}

// songs: [{ unit, lesson, stepIndex }]
export function mountPrint(root, { songs, heading, onBack }) {
  const el = document.createElement('main');
  el.className = 'print-view';
  el.innerHTML = `<header class="print-bar">
      <button class="icon-btn" data-back aria-label="Back">${icons.back}</button>
      <div class="top-title"><span class="eyebrow">Sheet music</span><span>${heading}</span></div>
      <span class="muted print-tip">Letter size · ${songs.length === 1 ? 'one song' : `${songs.length} songs, one per page`}</span>
      <button class="pill accent" data-print>${icons.print}<span>${songs.length === 1 ? 'Print' : 'Print all'}</span></button>
    </header>
    ${songs.length > 1 ? `<nav class="contents" aria-label="Songs"><h2>Songs</h2><ol>${songs.map(({ lesson, stepIndex }, i) => `<li>
      <a href="#" data-goto="${i}">${songTitle(lesson, lesson.steps[stepIndex])}</a>
      <button class="pill" data-one="${i}" aria-label="Print this song">${icons.print}<span>Print</span></button></li>`).join('')}</ol></nav>` : ''}
    <div class="papers"></div>`;
  root.replaceChildren(el);
  const papers = el.querySelector('.papers');
  songs.forEach(({ unit, lesson, stepIndex }) => papers.appendChild(songPage(unit, lesson, lesson.steps[stepIndex])));
  el.querySelector('[data-back]').addEventListener('click', onBack);
  el.querySelector('[data-print]').addEventListener('click', () => { clearOnly(); window.print(); });
  // Printing one song from the songbook: hide the other pages while the dialog is open.
  const pages = [...papers.children];
  const clearOnly = () => { delete el.dataset.only; pages.forEach((p) => p.classList.remove('only')); };
  el.querySelectorAll('[data-one]').forEach((b) => b.addEventListener('click', () => {
    clearOnly();
    el.dataset.only = '';
    pages[+b.dataset.one].classList.add('only');
    window.print();
  }));
  el.querySelectorAll('[data-goto]').forEach((a) => a.addEventListener('click', (e) => {
    e.preventDefault();
    pages[+a.dataset.goto].scrollIntoView({ behavior: 'smooth', block: 'start' });
  }));
  window.addEventListener('afterprint', clearOnly);
  const prevTitle = document.title;
  document.title = songs.length === 1 ? `${songTitle(songs[0].lesson, songs[0].lesson.steps[songs[0].stepIndex])} · Piano Tutor` : 'Piano Tutor songbook';
  window.scrollTo(0, 0);
  return () => { document.title = prevTitle; window.removeEventListener('afterprint', clearOnly); };
}

export function printOne(id, stepIndex) {
  const found = findLesson(id);
  return found && found.lesson.steps[stepIndex] ? [{ unit: found.unit, lesson: found.lesson, stepIndex }] : null;
}
