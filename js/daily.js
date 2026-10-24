// Daily practice: a short session built from the lessons already finished,
// plus a note-reading drill that's new every time.

import { UNITS, findLesson } from './lessons/index.js';
import { midiToName, toMidi } from './theory.js';

export const PRACTICE_SHELF = { id: 'practice', title: 'Practice' };

// The same day always gives the same session; tomorrow brings a new one.
export const today = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

function seeded(text) {
  let a = [...text].reduce((h, c) => Math.imul(h ^ c.charCodeAt(0), 2654435761) >>> 0, 1779033703);
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const pick = (rand, list) => list[Math.floor(rand() * list.length)];

// Five-finger warm-ups, unlocked by the lesson that teaches each position.
const POSITIONS = [
  { lesson: 'rh-c-position', name: 'C', notes: ['C4', 'D4', 'E4', 'F4', 'G4'] },
  { lesson: 'g-position', name: 'G', notes: ['G4', 'A4', 'B4', 'C5', 'D5'] },
  { lesson: 'd-position', name: 'D', notes: ['D4', 'E4', 'F#4', 'G4', 'A4'], key: 'D' },
  { lesson: 'f-position', name: 'F', notes: ['F4', 'G4', 'A4', 'Bb4', 'C5'], key: 'F' },
  { lesson: 'minor', name: 'A minor', notes: ['A4', 'B4', 'C5', 'D5', 'E5'], key: 'Am' },
];

function warmUp(rand, done) {
  const pos = pick(rand, POSITIONS.filter((p) => done[p.lesson]));
  const dur = done['eighth-notes'] ? '8' : 'q';
  const up = pos.notes.map((n, i) => `${n}/${dur}/${i + 1}`);
  const down = up.slice(1, 4).reverse();
  const rh = [...up, ...down, `${pos.notes[0]}/h/1`].join(' ');
  // With hands together learned, the left hand mirrors an octave lower.
  const low = (n) => n.replace(/\d$/, (o) => o - 1);
  const lh = done['hands-together'] && pos.name !== 'A minor'
    ? [...pos.notes.map((n, i) => `${low(n)}/${dur}/${5 - i}`), ...pos.notes.slice(1, 4).reverse().map((n, i) => `${low(n)}/${dur}/${2 + i}`), `${low(pos.notes[0])}/h/5`].join(' ')
    : null;
  const lo = lh ? low(pos.notes[0]) : pos.notes[0];
  return {
    t: 'play', title: `Warm-up: ${pos.name} position`,
    say: `Fingers loose, wrists level. Up and down the ${pos.name} position${lh ? ', hands together' : ''}, evenly.`,
    rh, ...(lh && { lh }), key: pos.key, staff: true, names: false,
    range: [lo, toMidi(pos.notes[4]) > toMidi('C5') ? pos.notes[4] : 'C5'], keyLabels: 'c', tempo: 84, reps: 2, metronome: true,
  };
}

// Play steps from finished lessons, sorted into songs and skill drills.
function finishedSteps(done) {
  const steps = [];
  UNITS.forEach((u) => u.lessons.forEach((l) => {
    if (!done[l.id] || l.recital) return;
    l.steps.forEach((s) => { if (s.t === 'play' && !s.anyNote && !s.anyOrder) steps.push({ ...s, from: l.title }); });
  }));
  return steps;
}

// A fresh string of notes to read, in the range the player has learned so far.
export function readingNotes(rand, clef, done, count = 10) {
  const span = clef === 'treble'
    ? (done.landmarks ? ['C4', 'C5'] : ['C4', 'G4'])
    : (done.landmarks ? ['C3', 'C4'] : ['C3', 'G3']);
  const whites = [];
  for (let m = toMidi(span[0]); m <= toMidi(span[1]); m++) if (!midiToName(m).includes('#')) whites.push(midiToName(m));
  const notes = [];
  while (notes.length < count) {
    const n = pick(rand, whites);
    if (n !== notes[notes.length - 1]) notes.push(n);
  }
  return { notes, range: clef === 'treble' ? ['C4', 'C5'] : ['C3', 'C4'] };
}

function readingStep(rand, clef, done, extra = {}) {
  const { notes, range } = readingNotes(rand, clef, done);
  return {
    t: 'play', title: clef === 'treble' ? 'Reading: treble notes' : 'Reading: bass notes',
    say: 'Read each note and play it. No hints: tap "Show me" if you\'re stuck.',
    [clef === 'treble' ? 'rh' : 'lh']: notes.map((n) => `${n}/q`).join(' '),
    staff: true, names: false, hint: false, noDemo: true, range, keyLabels: 'c', tempo: 80, ...extra,
  };
}

// Is there enough to build a session yet?
export const dailyReady = (done) => !!done['rh-c-position'];

export function buildDaily(done, date = today()) {
  const rand = seeded(date);
  const steps = [{
    t: 'read', title: 'Today\'s practice',
    body: `<p>About ten minutes, built from what you've already learned: a warm-up, ${done['c-scale'] ? 'a scale, ' : ''}some sight-reading, a skill to polish and a song to enjoy.</p>
    <p>Little and often beats long and rare. A few minutes every day is how fingers learn.</p>`,
  }];
  steps.push(warmUp(rand, done));

  if (done['c-scale']) {
    const scales = ['c-scale', 'g-f-scales'].filter((id) => done[id])
      .flatMap((id) => findLesson(id).lesson.steps.filter((s) => s.t === 'play' && !/together/i.test(s.title)));
    const scale = pick(rand, scales);
    steps.push({ ...scale, title: `Scale: ${scale.title}`, reps: 2 });
  }

  if (done['treble-reading']) {
    const clef = done['bass-clef'] && rand() < 0.5 ? 'bass' : 'treble';
    steps.push(readingStep(rand, clef, done));
  }

  const finished = finishedSteps(done);
  const drills = finished.filter((s) => !s.song && (s.staff || s.rh || s.lh));
  const songs = finished.filter((s) => s.song && !s.final);
  if (drills.length) {
    const d = pick(rand, drills);
    steps.push({ ...d, title: `Review: ${d.title}`, say: `From "${d.from}". ${d.say}` });
  }
  if (songs.length) {
    const s = pick(rand, songs);
    steps.push({ ...s, title: `Song: ${s.title}`, say: `From "${s.from}". Play it musically, just for the joy of it.` });
  }
  return {
    id: 'daily', daily: true, title: 'Today\'s practice',
    summary: 'About ten minutes: warm-up, reading, review and a song.', steps,
  };
}

// A reading drill: new notes every time, timed so you can watch yourself speed up.
export function buildDrill(done) {
  const rand = Math.random;
  const steps = [readingStep(rand, 'treble', done, { timed: 'treble', title: 'Treble notes' })];
  if (done['bass-clef']) steps.push(readingStep(rand, 'bass', done, { timed: 'bass', title: 'Bass notes' }));
  steps.forEach((s) => { s.say = 'Read and play each note as quickly as you can. The clock starts on your first note.'; });
  return {
    id: 'drill', daily: true, title: 'Note-reading drill',
    summary: 'Ten notes at a time, against the clock.', steps,
  };
}
