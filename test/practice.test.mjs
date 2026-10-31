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


const { loopBars, buildBarLoop } = await import('../js/practice.js');
assert.equal(loopBars({rh:'C4/q D4/w',pickup:1}).bars.length,2);
assert.equal(buildBarLoop({rh:'C4/q D4/w',pickup:1},2,2).moments[0].items[0].midi,62);
assert.equal(buildBarLoop({rh:'C4/h. D4/h.',time:'6/8'},2,2).totalBeats,3);
const tiedLoop=buildBarLoop({rh:'C4/w ~C4/h D4/h'},2,2);
assert.equal(tiedLoop.moments[0].beat,0);
assert.equal(tiedLoop.moments[0].items[0].beats,2);
assert.equal(buildBarLoop({rh:'C4/w ~C4/w'},1,1).moments[0].items[0].beats,4);
assert.equal(buildBarLoop({rh:'|: C4/w D4/w :| E4/w'},1,3).moments.length,3);
assert.equal(buildBarLoop({rh:'r/w C4/w'},1,1).moments.length,0);
assert.equal(buildBarLoop({rh:'C4/w r/w'},1,2).totalBeats,8);
assert.throws(()=>buildBarLoop({rh:'C4/w'},2,1));
const { HYMNS } = await import('../js/lessons/index.js');
let selections=0;
for(const lesson of [...UNITS.flatMap(u=>u.lessons),...HYMNS]) for(const step of lesson.steps) {
 if(step.t!=='play'||step.anyNote||step.anyOrder) continue;
 const {bars}=loopBars(step);
 for(let i=1;i<=bars.length;i++) {
  const p=buildBarLoop(step,i,i); selections++;
  for(const m of p.moments) for(const it of m.items) {
   assert.ok(m.beat>=0 && m.beat+it.beats<=p.totalBeats+1e-6);
  }
 }
}
console.log(`${selections} course bar selections and loop boundaries passed`);
