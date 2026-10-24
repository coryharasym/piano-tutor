// Printable sheet music: one song, or every song in the course as a songbook.
// Laid out for US Letter paper; the browser's print dialog does the rest.

import { UNITS, HYMNS, HYMN_SHELF, findLesson } from './lessons/index.js';
import { buildPractice } from './practice.js';
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
  return perBar <= 1.5 ? 6 : 4;
}

function songPage(unit, lesson, step) {
  const { staves } = buildPractice(step);
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
    <footer class="paper-foot"><span>${fingerNote}</span><span>Piano Tutor · ${unit.title}</span></footer>`;

  const systems = page.querySelector('.systems');
  const per = barsPerLine(step);
  const opts = {
    staves: staves.map((s) => ({ clef: s.clef, events: s.events })),
    key: step.key || 'C', time: step.time || '4/4', pickup: step.pickup,
    showFingers: true, showNames: !!step.names, width: RENDER_WIDTH, current: null,
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
      <button class="pill accent" data-print>${icons.print}<span>Print</span></button>
    </header>
    <div class="papers"></div>`;
  root.replaceChildren(el);
  const papers = el.querySelector('.papers');
  songs.forEach(({ unit, lesson, stepIndex }) => papers.appendChild(songPage(unit, lesson, lesson.steps[stepIndex])));
  el.querySelector('[data-back]').addEventListener('click', onBack);
  el.querySelector('[data-print]').addEventListener('click', () => window.print());
  const prevTitle = document.title;
  document.title = songs.length === 1 ? `${songTitle(songs[0].lesson, songs[0].lesson.steps[songs[0].stepIndex])} · Piano Tutor` : 'Piano Tutor songbook';
  window.scrollTo(0, 0);
  return () => { document.title = prevTitle; };
}

export function printOne(id, stepIndex) {
  const found = findLesson(id);
  return found && found.lesson.steps[stepIndex] ? [{ unit: found.unit, lesson: found.lesson, stepIndex }] : null;
}
