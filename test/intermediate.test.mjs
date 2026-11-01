import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {UNITS,BEGINNER_UNITS,INTERMEDIATE_UNITS,HYMNS,courseUnits,findLesson,nextLesson} from '../js/lessons/index.js';
import {buildPractice,meterPulse} from '../js/practice.js';
import {parseSeq,beatsOf} from '../js/theory.js';
import {SCORES} from '../js/lessons/intermediate-scores.js';
import {scoreStep} from '../js/lessons/intermediate-tools.js';
import {buildDaily,buildDrill,dailyReady} from '../js/daily.js';
import {songbook} from '../js/print.js';
assert.equal(BEGINNER_UNITS.length,7);assert.equal(INTERMEDIATE_UNITS.length,8);
assert.equal(INTERMEDIATE_UNITS.flatMap(u=>u.lessons).length,64);
assert.equal(courseUnits('beginner'),BEGINNER_UNITS);assert.equal(courseUnits('intermediate'),INTERMEDIATE_UNITS);
assert.equal(nextLesson({},null,'beginner').id,'welcome');assert.equal(nextLesson({},null,'intermediate').id,'int-readiness');
assert.equal(nextLesson({},'int-readiness').course,'intermediate');
assert.equal(nextLesson({},INTERMEDIATE_UNITS.at(-1).lessons.at(-1).id),null);
assert.equal(new Set(UNITS.flatMap(u=>u.lessons.map(l=>l.id))).size,UNITS.flatMap(u=>u.lessons).length);
for(const u of INTERMEDIATE_UNITS){assert.equal(u.lessons.length,8);assert.equal(u.lessons.filter(l=>l.recital).length,1);assert.ok(u.checklist.length>=6);for(const l of u.lessons){assert.equal(findLesson(l.id).lesson,l);assert.ok(l.steps.some(s=>s.t==='read'));assert.ok(l.steps.some(s=>s.t==='play'));}}
for(const step of INTERMEDIATE_UNITS.flatMap(u=>u.lessons.flatMap(l=>l.steps)).filter(s=>s.t==='play')){
 const p=buildPractice(step);assert.ok(p.moments.length);
 for(const s of p.staves) {const events=s.events.filter(e=>!e.bar);for(let i=0;i<events.length;i++)if(events[i].triplet){assert.ok(events[i+1]?.triplet&&events[i+2]?.triplet);assert.ok(Math.abs(events.slice(i,i+3).reduce((a,e)=>a+beatsOf(e.dur),0)-1)<1e-8);i+=2;}}
}
assert.deepEqual(meterPulse('9/8'),{bar:4.5,unit:1.5,count:3});assert.deepEqual(meterPulse('6/8'),{bar:3,unit:1.5,count:2});assert.deepEqual(meterPulse('4/4'),{bar:4,unit:1,count:4});
const triplets=buildPractice({rh:'C4/8t D4/8t E4/8t C4/q'});assert.equal(triplets.totalBeats,2);assert.equal(triplets.moments.length,4);
const expected={eventide:[64,60],blessed_assurance:[64,60],woodworth:[60,64],nettleton:[66,62],villeduh:[67,72],Diademata:[60,60]};
for(const [id,score]of Object.entries(SCORES)){
 const raw=await readFile(new URL('../sources/intermediate/'+id+'.ly',import.meta.url));assert.equal(createHash('sha256').update(raw).digest('hex'),score.sha256);assert.match(raw.toString(),/Public Domain/);
 const melody=score.voices.Soprano.filter(e=>e.midi!=null);assert.deepEqual([melody[0].midi,melody.at(-1).midi],expected[id]);
 // The teaching melody must preserve the checked score's pitches and total time.
 const practice=buildPractice(scoreStep(id));const notes=practice.moments.flatMap(m=>m.items.filter(it=>it.hand==='R').map(it=>it.midi));assert.deepEqual(notes,melody.map(e=>e.midi));
 assert.ok(Math.abs(practice.totalBeats-score.voices.Soprano.reduce((a,e)=>a+e.beats,0))<1e-6);
}
assert.ok(songbook('beginner').every(s=>s.unit.course!=='intermediate'&&s.lesson.course!=='intermediate'));
assert.ok(songbook('intermediate').length>=24);assert.ok(songbook('intermediate').some(s=>s.lesson.steps[s.stepIndex].title.includes('It Is Well')));
assert.ok(dailyReady({'int-readiness':true},'intermediate'));assert.ok(!dailyReady({'int-readiness':true},'beginner'));
const daily=buildDaily({'int-readiness':true,'int-jesus-study':true},'2026-11-01','intermediate');assert.ok(daily.steps.some(s=>s.song));assert.match(buildDrill({},'intermediate').title,/Intermediate/);
globalThis.localStorage={getItem:()=>null,setItem(){}};
const {store}=await import('../js/store.js');store.markDone('welcome');store.setLast('mary',1);store.setLast('int-triplets',2);store.markDone('int-readiness');const backup=store.backup();store.reset();store.restore(backup);
assert.equal(store.isDone('welcome'),true);assert.equal(store.isDone('int-readiness'),true);assert.equal(store.data.lastByCourse.beginner.lesson,'mary');assert.equal(store.data.lastByCourse.intermediate.lesson,'int-triplets');assert.throws(()=>store.restore('{"app":"piano-tutor","data":{"done":null}}'));
console.log('64 intermediate lessons, source integrity, triplets, course isolation, daily practice and backup passed');
