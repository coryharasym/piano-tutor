import u1 from './unit1.js';
import u2 from './unit2.js';
import u3 from './unit3.js';
import u4 from './unit4.js';
import u5 from './unit5.js';
import u6 from './unit6.js';
import { RECITALS } from './recitals.js';

// Each unit ends with its recital.
export const UNITS = [u1, u2, u3, u4, u5, u6].map((u) => ({ ...u, lessons: [...u.lessons, RECITALS[u.id]] }));
const ALL = UNITS.flatMap((unit) => unit.lessons.map((lesson) => ({ unit, lesson })));

export const HYMNS = ALL.filter((x) => x.lesson.hymn).map((x) => x.lesson);

export const findLesson = (id) => ALL.find((x) => x.lesson.id === id) || null;

// The first unfinished lesson (after `afterId`, if given).
export function nextLesson(done, afterId) {
  const start = afterId ? ALL.findIndex((x) => x.lesson.id === afterId) + 1 : 0;
  const rest = ALL.slice(start).find((x) => !done[x.lesson.id]);
  return (rest || (afterId ? ALL[start] : null))?.lesson || null;
}
