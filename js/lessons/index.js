import { ADVANCED_UNITS, ADVANCED_HYMNS } from './advanced.js';
export { ADVANCED_UNITS } from './advanced.js';
import { INTERMEDIATE_UNITS, INTERMEDIATE_HYMNS } from './intermediate.js';
export { INTERMEDIATE_UNITS } from './intermediate.js';
import u1 from './unit1.js';
import u2 from './unit2.js';
import u3 from './unit3.js';
import u4 from './unit4.js';
import u5 from './unit5.js';
import u6 from './unit6.js';
import ux from './unitx.js';
import { RECITALS, PIECES } from './recitals.js';
import { DOXOLOGY_LESSONS } from './doxology.js';
import { PRACTICE_SONGS } from './songs.js';

import { chooseRecital as chooseBeginnerRecital } from './recitals.js';
import { chooseCourseRecital } from './recital-choices.js';
export function chooseRecital(unit, piece) {
  chooseBeginnerRecital(unit, piece);
  chooseCourseRecital(unit, piece);
}

// Each unit ends with its recital. Unit ids stay put when units are added,
// so saved progress still matches; the number shown is the position here.
// The Doxology lessons and practice songs slot in after the lesson each one builds on.
const EXTRAS = [...DOXOLOGY_LESSONS, ...PRACTICE_SONGS];
const withExtras = (u) => u.lessons.flatMap((l) => [l, ...EXTRAS.filter((d) => d.unit === u.id && d.after === l.id).map((d) => d.lesson)]);
export const BEGINNER_UNITS = [u1, u2, u3, u4, ux, u5, u6].map((u, i) => ({ ...u, course: 'beginner', number: i + 1, lessons: [...withExtras(u), RECITALS[u.id]] }));
export const UNITS = [...BEGINNER_UNITS, ...INTERMEDIATE_UNITS, ...ADVANCED_UNITS];
export const courseUnits = (course = 'beginner') => course === 'advanced' ? ADVANCED_UNITS : course === 'intermediate' ? INTERMEDIATE_UNITS : BEGINNER_UNITS;
const ALL = UNITS.flatMap((unit) => unit.lessons.map((lesson) => ({ unit, lesson })));

// Every hymn and recital piece, playable any time from the Hymns shelf.
export const HYMN_SHELF = { id: 'hymns', title: 'Hymns' };
// In course order, each labelled with its unit's number.
const BEGINNER_HYMNS = PIECES.map((p) => ({ ...p, unitNumber: UNITS.find((u) => u.id === p.unit).number }))
  .sort((a, b) => a.unitNumber - b.unitNumber);
export const HYMNS = [...BEGINNER_HYMNS.map(p=>({...p,course:'beginner'})),...INTERMEDIATE_HYMNS,...ADVANCED_HYMNS];
const SHELF = HYMNS.map((lesson) => ({ unit: HYMN_SHELF, lesson }));

// Lessons made on the fly (daily practice, drills) are added here.
const EXTRA = new Map();
export const addLesson = (unit, lesson) => EXTRA.set(lesson.id, { unit, lesson });

export const findLesson = (id) => ALL.find((x) => x.lesson.id === id) || SHELF.find((x) => x.lesson.id === id) || EXTRA.get(id) || null;

// The first unfinished lesson (after `afterId`, if given).
export function nextLesson(done, afterId, course = 'beginner') {
  if(afterId) course = findLesson(afterId)?.unit.course || findLesson(afterId)?.lesson.course || course;
  const items = ALL.filter(x=>x.unit.course===course);
  const start = afterId ? items.findIndex((x) => x.lesson.id === afterId) + 1 : 0;
  const rest = items.slice(start).find((x) => !done[x.lesson.id]);
  return (rest || (afterId ? items[start] : null))?.lesson || null;
}
