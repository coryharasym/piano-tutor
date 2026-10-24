// Repeats, ties, and the daily practice builder.
import assert from 'node:assert';
import { buildPractice } from '../js/practice.js';
import { UNITS } from '../js/lessons/index.js';
import { buildDaily, buildDrill, dailyReady } from '../js/daily.js';

// Music between repeat signs is played twice; a tie lengthens the note before it.
const { moments, totalBeats } = buildPractice({ rh: "C4/q |: D4/h ~D4/q E4'/q :| F4/w" });
assert.deepEqual(moments.map((m) => m.beat), [0, 1, 4, 5, 8, 9]);
assert.equal(moments[1].items[0].beats, 3);
assert.ok(moments[2].items[0].staccato);
assert.equal(totalBeats, 13);

// Daily practice: same session all day, and every step builds.
const all = Object.fromEntries(UNITS.flatMap((u) => u.lessons.map((l) => [l.id, true])));
assert.ok(!dailyReady({}));
for (const done of [{ 'rh-c-position': true }, all]) {
  for (let d = 1; d <= 28; d++) {
    const date = `2026-02-${String(d).padStart(2, '0')}`;
    const a = buildDaily(done, date);
    assert.deepEqual(a.steps.map((s) => s.title), buildDaily(done, date).steps.map((s) => s.title));
    a.steps.filter((s) => s.t === 'play').forEach((s) => assert.ok(buildPractice(s).moments.length, `${date} ${s.title}`));
  }
}
const drill = buildDrill(all);
assert.equal(drill.steps.length, 2);
drill.steps.forEach((s) => assert.equal(buildPractice(s).moments.length, 10));
console.log('practice ok');
