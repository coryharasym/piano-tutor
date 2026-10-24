import u1 from './unit1.js';
import u2 from './unit2.js';
import u3 from './unit3.js';
import u4 from './unit4.js';
import u5 from './unit5.js';
import u6 from './unit6.js';
import ux from './unitx.js';
import { RECITALS, PIECES } from './recitals.js';
import { DOXOLOGY_LESSONS } from './doxology.js';

export { chooseRecital } from './recitals.js';

// Each unit ends with its recital. Unit ids stay put when units are added,
// so saved progress still matches; the number shown is the position here.
// The Doxology lessons slot in after the lesson each one builds on.
const withDoxology = (u) => u.lessons.flatMap((l) => [l, ...DOXOLOGY_LESSONS.filter((d) => d.unit === u.id && d.after === l.id).map((d) => d.lesson)]);
export const UNITS = [u1, u2, u3, u4, ux, u5, u6].map((u, i) => ({ ...u, number: i + 1, lessons: [...withDoxology(u), RECITALS[u.id]] }));
const ALL = UNITS.flatMap((unit) => unit.lessons.map((lesson) => ({ unit, lesson })));

// Every hymn and recital piece, playable any time from the Hymns shelf.
export const HYMN_SHELF = { id: 'hymns', title: 'Hymns' };
// In course order, each labelled with its unit's number.
export const HYMNS = PIECES.map((p) => ({ ...p, unitNumber: UNITS.find((u) => u.id === p.unit).number }))
  .sort((a, b) => a.unitNumber - b.unitNumber);
const SHELF = HYMNS.map((lesson) => ({ unit: HYMN_SHELF, lesson }));

// Lessons made on the fly (daily practice, drills) are added here.
const EXTRA = new Map();
export const addLesson = (unit, lesson) => EXTRA.set(lesson.id, { unit, lesson });

export const findLesson = (id) => ALL.find((x) => x.lesson.id === id) || SHELF.find((x) => x.lesson.id === id) || EXTRA.get(id) || null;

// The first unfinished lesson (after `afterId`, if given).
export function nextLesson(done, afterId) {
  const start = afterId ? ALL.findIndex((x) => x.lesson.id === afterId) + 1 : 0;
  const rest = ALL.slice(start).find((x) => !done[x.lesson.id]);
  return (rest || (afterId ? ALL[start] : null))?.lesson || null;
}
