// Checks every lesson: notes parse, bars add up, hands line up, fingers match.
import assert from 'node:assert';
import { UNITS, HYMNS, HYMN_SHELF, chooseRecital } from '../js/lessons/index.js';
import { parseSeq, beatsOf, toMidi } from '../js/theory.js';
import { buildPractice } from '../js/practice.js';

const ids = new Set();
let lessons = 0, plays = 0, problems = [];
const fail = (where, msg) => problems.push(`${where}: ${msg}`);

// Every lesson, every hymn on the shelf, and each recital with each of its pieces.
const checks = [];
for (const unit of UNITS) for (const lesson of unit.lessons) checks.push(lesson);
for (const lesson of HYMNS) checks.push(lesson);

for (const lesson of checks) {
  {
    lessons++;
    assert.ok(!ids.has(lesson.id), `duplicate id ${lesson.id}`);
    ids.add(lesson.id);
    assert.ok(lesson.steps.length, `${lesson.id} has no steps`);
    lesson.steps.forEach((step, si) => {
      const where = `${lesson.id}#${si} (${step.title || step.q})`;
      if (step.t === 'quiz') {
        if (!(step.answer >= 0 && step.answer < step.options.length)) fail(where, 'answer out of range');
        if (step.listen) parseSeq(step.listen);
        if (step.staffFig) step.staffFig.staves.forEach((s) => parseSeq(s.seq));
        return;
      }
      if (step.t === 'read') {
        if (!step.body) fail(where, 'empty read step');
        if (step.staffFig) step.staffFig.staves.forEach((s) => parseSeq(s.seq));
        return;
      }
      if (step.t === 'choose') {
        if (!(lesson.choices?.length > 1)) fail(where, 'choose step without choices');
        return;
      }
      if (step.t !== 'play') return fail(where, `unknown step type ${step.t}`);
      plays++;
      if (step.anyNote) return;
      const [num, den] = (step.time || '4/4').split('/').map(Number);
      const perBar = num * (4 / den);
      const totals = [];
      for (const hand of ['rh', 'lh']) {
        if (!step[hand]) continue;
        const evs = parseSeq(step[hand]);
        let beat = 0, barBeat = 0, cap = step.pickup || perBar;
        let prev = null;
        for (const ev of evs) {
          if (ev.bar) {
            if (ev.repeat && Math.abs(barBeat) > 1e-6) fail(where, `${hand} repeat sign in the middle of a bar`);
            continue;
          }
          if (ev.tie && (!prev || prev.rest || prev.midis.join() !== ev.midis.join())) fail(where, `${hand} tie to ${ev.notes} doesn't follow the same note`);
          prev = ev;
          if (!ev.rest) {
            ev.midis.forEach((m) => {
              const [lo, hi] = (step.range || ['C3', 'C5']).map(toMidi);
              if (m < lo || m > hi) fail(where, `${hand} note ${ev.notes} outside range ${step.range}`);
            });
            if (ev.fingers.length && ev.fingers.length !== ev.notes.length) fail(where, `${hand} fingers ${ev.fingers} don't match ${ev.notes}`);
            if (ev.fingers.some((f) => f < 1 || f > 5)) fail(where, `${hand} bad finger ${ev.fingers}`);
          }
          const len = beatsOf(ev.dur);
          if (!(ev.dur in { w: 1, 'h.': 1, h: 1, 'q.': 1, q: 1, '8.': 1, 8: 1, 16: 1 })) fail(where, `bad duration ${ev.dur}`);
          barBeat += len; beat += len;
          if (barBeat > cap + 1e-6) fail(where, `${hand} note ${ev.notes || 'rest'} crosses a bar line at beat ${beat}`);
          if (Math.abs(barBeat - cap) < 1e-6) { barBeat = 0; cap = perBar; }
        }
        if (step.song && Math.abs(barBeat) > 1e-6) fail(where, `${hand} last bar incomplete (${barBeat} of ${perBar})`);
        totals.push(beat);
      }
      if (totals.length === 2 && Math.abs(totals[0] - totals[1]) > 1e-6) fail(where, `hands differ in length: rh ${totals[0]} vs lh ${totals[1]}`);
      const { moments, lyrics, syllables } = buildPractice(step);
      if (!moments.length) fail(where, 'nothing to play');
      if (lyrics && lyrics.length !== syllables) fail(where, `${lyrics.length} syllables of lyrics for ${syllables} melody notes`);
      (step.verses || []).forEach((words, v) => {
        const n = buildPractice({ ...step, lyrics: words }).lyrics.length;
        if (n !== syllables) fail(where, `verse ${v + 2}: ${n} syllables for ${syllables} melody notes`);
      });
    });
  }
}
// Picking each recital piece swaps in that piece's steps.
for (const unit of UNITS) {
  const rec = unit.lessons.find((l) => l.recital);
  assert.ok(rec, `${unit.id} has no recital`);
  for (const piece of rec.choices) {
    chooseRecital(unit.id, piece.id);
    assert.equal(rec.piece, piece);
    assert.ok(rec.steps.some((s) => s.final), `${rec.id} with ${piece.id} has no performance`);
  }
  chooseRecital(unit.id, rec.choices[0].id);
}

console.log(`${UNITS.length} units, ${lessons} lessons, ${plays} practice steps`);
if (problems.length) { console.log(problems.join('\n')); process.exit(1); }
console.log('lessons ok');
