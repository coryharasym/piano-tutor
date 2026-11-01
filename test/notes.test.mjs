import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { UNITS, chooseRecital } from '../js/lessons/index.js';
import { chapterHTML, chapterLessons, pdfPath, escapeHTML } from '../js/notes.js';
import { notesFingerprint } from '../scripts/notes-source.mjs';

assert.equal(UNITS.length, 15);
for (const unit of UNITS) {
  const html = chapterHTML(unit);
  const lessons = chapterLessons(unit);
  assert(html.includes('Can I do this independently?'));
  for (const lesson of lessons) {
    assert(html.includes(escapeHTML(lesson.title)), `${lesson.id} missing`);
    for (const step of lesson.steps) {
      if (step.t === 'read') assert(html.includes(step.body), `${lesson.id}: explanation missing`);
      if (step.t === 'play' && step.say) assert(html.includes(escapeHTML(step.say)), `${lesson.id}: practice missing`);
      if (step.fig) assert(html.includes(step.fig), `${lesson.id}: diagram missing`);
      if (step.t === 'quiz') assert(html.includes(escapeHTML(step.explain || '')), `${lesson.id}: review missing`);
    }
  }
  const recital = unit.lessons.find(l => l.recital);
  chooseRecital(unit.id, recital.choices.at(-1).id);
  assert.equal(chapterHTML(unit), html, 'Saved recital choices must not alter the notes');
  chooseRecital(unit.id, recital.choices[0].id);
}
assert.equal(escapeHTML('<a "x">&'), '&lt;a &quot;x&quot;&gt;&amp;');
const fingerprint = (await readFile(new URL('../notes/source.sha256', import.meta.url), 'utf8')).trim();
assert.equal(await notesFingerprint(), fingerprint, 'Curriculum or layout changed: run npm run build:notes and commit the regenerated PDFs');
for (const id of [...UNITS.map(u => u.id), 'all', 'intermediate']) {
  const pdf = await readFile(new URL(`../${pdfPath(id)}`, import.meta.url));
  assert(pdf.subarray(0, 5).equals(Buffer.from('%PDF-')));
  assert(pdf.length > 10000, `${id}: unexpectedly small PDF`);
}
console.log('Fifteen complete chapters, all recital choices, seventeen PDFs and source freshness passed');
