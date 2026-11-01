import assert from 'node:assert/strict';
import {buildWarmup} from '../js/warmup.js';
import {buildPractice,buildBarLoop,loopBars} from '../js/practice.js';
import {parseSeq,beatsOf,toMidi} from '../js/theory.js';
import {UNITS} from '../js/lessons/index.js';
const cases=[
 ['beginner',{}],['beginner',{'rh-c-position':true}],['beginner',{'lh-c-position':true}],
 ['beginner',{'rh-c-position':true,'lh-c-position':true}],
 ['beginner',{'rh-c-position':true,'lh-c-position':true,'hands-together':true,'steps-skips':true,'c-scale':true,'g-f-scales':true}],
 ['intermediate',{}],['intermediate',{'int-unequal':true}],
 ['intermediate',{'int-major-scales':true,'int-unequal':true,'int-arpeggios':true}],
 ['advanced',{}],['advanced',{'adv-readiness':true,'adv-major-keys':true,'adv-arpeggio-travel':true}],
 ['advanced',{'int-major-scales':true,'int-arpeggios':true,'hands-together':true}],
];
let checked=0;
for(const [course,done]of cases)for(const date of ['2026-11-01','2026-11-02','2026-11-03']){
 const before=JSON.stringify(done),w=buildWarmup(done,course,date);
 assert.equal(w.id,'warmup');assert.ok(w.warmup&&w.daily);assert.equal(w.course,course);assert.equal(w.steps.length,6);
 assert.equal(JSON.stringify(done),before,'Builder changed progress');assert.deepEqual(w,buildWarmup(done,course,date));
 for(const s of w.steps.filter(s=>s.t==='play')){
  assert.equal(s.reps,2);assert.equal(s.tempo,60);assert.ok(s.showFingers);assert.ok(!s.timed&&!s.song&&!s.final&&!s.noDemo);
  const p=buildPractice(s);assert.equal(p.totalBeats,16);assert.ok(p.moments.length>=6);
  const lengths=[];
  for(const hand of ['rh','lh'])if(s[hand]){
   let beat=0,total=0;const evs=parseSeq(s[hand]);for(const e of evs){if(e.bar)continue;const b=beatsOf(e.dur);beat+=b;total+=b;assert.ok(beat<=4+1e-6,'Note crosses a bar');if(Math.abs(beat-4)<1e-6)beat=0;
    assert.ok((e.fingers||[]).every(f=>f>=1&&f<=5));assert.equal((e.fingers||[]).length,e.midis?.length||0);
    for(const n of e.midis||[]){assert.ok(n>=48&&n<=84,'Unnecessary register extremes');assert.ok(n>=toMidi(s.range[0])&&n<=toMidi(s.range[1]));}
   }assert.equal(beat,0);lengths.push(total);
  }
  assert.ok(lengths.every(n=>n===16));
  for(const m of p.moments){const r=m.items.filter(i=>i.hand==='R').map(i=>i.midi),l=m.items.filter(i=>i.hand==='L').map(i=>i.midi);assert.ok(!r.some(n=>l.includes(n)));assert.ok(m.items.length<=2,'Warm-up chord too large');}
  for(let b=1;b<=loopBars(s).bars.length;b++)assert.equal(buildBarLoop(s,b,b).totalBeats,4);
  checked++;
 }
}
const first=buildWarmup({},'beginner');assert.ok(first.steps.filter(s=>s.t==='play').every(s=>buildPractice(s).moments.flatMap(m=>m.items).every(i=>i.midi===60)));assert.ok(first.steps.filter(s=>s.t==='play').every(s=>!s.staff));
const onlyR=buildWarmup({'rh-c-position':true},'beginner');assert.ok(buildPractice(onlyR.steps[1]).moments.some(m=>m.items.some(i=>i.midi===67)));const rightNotes=buildPractice(onlyR.steps[1]).moments.flatMap(m=>m.items.map(i=>i.midi));assert.ok(rightNotes.slice(1).every((n,i)=>Math.abs(n-rightNotes[i])<=2),'First five-finger warm-up introduces skips');assert.ok(buildPractice(onlyR.steps[2]).moments.every(m=>m.items.every(i=>i.midi===60)));
const noTogether=buildWarmup({},'intermediate');assert.ok(buildPractice(noTogether.steps[3]).moments.every(m=>m.items.length===1));
const scales=buildWarmup({'int-major-scales':true},'advanced');assert.ok(buildPractice(scales.steps[1]).moments.some(m=>m.items.some(i=>i.midi===84)));
const beginnerWarm=buildWarmup({'c-scale':true,'rh-c-position':true,'lh-c-position':true},'beginner');assert.ok(!buildPractice(beginnerWarm.steps[1]).moments.some(m=>m.items.some(i=>i.midi>72)));
assert.equal(buildWarmup({},'invalid').course,'beginner');assert.ok(!UNITS.flatMap(u=>u.lessons).some(l=>l.id==='warmup'));
console.log(checked+' warm-up exercises across 33 level/progress/date combinations: notation, fingers, rhythm, loops and progression passed');
