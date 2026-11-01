import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { UNITS } from '../js/lessons/index.js';
import { chapterHTML, chapterLessons } from '../js/notes.js';
export async function notesFingerprint() {
  const hash = createHash('sha256');
  hash.update(UNITS.map(chapterHTML).join(''));
  hash.update(JSON.stringify(UNITS.map(u=>({id:u.id,lessons:chapterLessons(u).map(l=>({id:l.id,title:l.title,summary:l.summary,steps:l.steps}))}))));
  for (const file of ['js/notes.js', 'js/figures.js', 'js/staff.js', 'js/theory.js', 'js/practice.js', 'css/notes.css', 'css/app.css', 'scripts/build-notes.mjs', 'scripts/notes-source.mjs', 'vendor/vexflow-bravura.js']) hash.update(await readFile(new URL(`../${file}`, import.meta.url)));
  return hash.digest('hex');
}
