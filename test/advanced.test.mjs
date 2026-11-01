import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {ADVANCED_UNITS,BEGINNER_UNITS,INTERMEDIATE_UNITS,UNITS,HYMNS,courseUnits,nextLesson} from '../js/lessons/index.js';
import {SCORES,arrange,transposeStep,singleVoice} from '../js/lessons/advanced-tools.js';
import {buildPractice,buildBarLoop,loopBars} from '../js/practice.js';
import {parseSeq,beatsOf} from '../js/theory.js';
import {buildDaily,buildDrill,dailyReady} from '../js/daily.js';
import {songbook} from '../js/print.js';
import {COURSES,practiceKey,validCourse} from '../js/courses.js';
assert.equal(ADVANCED_UNITS.length,8);assert.equal(ADVANCED_UNITS.flatMap(u=>u.lessons).length,64);
assert.equal(courseUnits('advanced'),ADVANCED_UNITS);assert.equal(validCourse('bad'),'beginner');assert.equal(Object.keys(COURSES).length,3);
assert.equal(nextLesson({},null,'advanced').id,'adv-readiness');assert.equal(nextLesson({},'adv-readiness').course,'advanced');assert.equal(nextLesson({},ADVANCED_UNITS.at(-1).lessons.at(-1).id),null);
assert.equal(BEGINNER_UNITS.length,7);assert.equal(INTERMEDIATE_UNITS.length,8);
assert.equal(new Set(UNITS.flatMap(u=>u.lessons.map(l=>l.id))).size,UNITS.flatMap(u=>u.lessons).length);
const rawHashes={melita:'09728abc6b1874bb0051cf1eff6fae6aea5f3284',nicaea:'a41a2d58a09ac64e849f1de18fc5fddf935e919b',st_agnes:'8eaff2eb3b6f8f55c850e32612111d2305159e64'};
const endpoints={melita:[60,60,49],nicaea:[62,62,64],st_agnes:[71,67,42]};
for(const [id,sha] of Object.entries(rawHashes)) {
 const raw=await readFile(new URL('../sources/advanced/'+id+'.ly',import.meta.url));const s=SCORES[id];
 assert.equal(createHash('sha1').update(Buffer.concat([Buffer.from('blob '+raw.length+'\0'),raw])).digest('hex'),sha);
 assert.equal(createHash('sha256').update(raw).digest('hex'),s.sha256);assert.match(raw.toString(),/Public Domain/);
 const expected=s.voices.Soprano.filter(e=>e.midi!=null);assert.deepEqual([expected[0].midi,expected.at(-1).midi,s.voices.Soprano.reduce((a,e)=>a+e.beats,0)],endpoints[id]);
 for(const texture of ['chorale','lyrical','flowing','octaves']) {
   const p=buildPractice(arrange(id,texture));const top=p.moments.map(m=>m.items.filter(i=>i.hand==='R')).filter(a=>a.length).map(a=>Math.max(...a.map(i=>i.midi)));
   assert.deepEqual(top,expected.map(e=>e.midi),'Source melody changed: '+id+' '+texture);
   for(const hand of ['R','L'])assert.equal(p.staves.filter(s=>s.hand===hand).length,1);
   assert.equal(p.totalBeats,endpoints[id][2]);
 }
 for(const voice of ['Soprano','Alto','Tenor','Bass'])assert.deepEqual(buildPractice(singleVoice(id,voice)).moments.flatMap(m=>m.items.map(i=>i.midi)),s.voices[voice].filter(e=>e.midi!=null).map(e=>e.midi));
}
const f=transposeStep(arrange('melita','chorale'),5,'F');assert.equal(f.key,'F');assert.match(f.rh,/Bb/);assert.doesNotMatch(f.rh,/A#/);
let loops=0;
for(const u of ADVANCED_UNITS){assert.equal(u.lessons.length,8);assert.equal(u.lessons.filter(l=>l.recital).length,1);assert.ok(u.checklist.length>=6);
 for(const l of u.lessons){assert.equal(l.course,'advanced');assert.ok(l.id.startsWith('adv-'));assert.ok(l.steps.some(s=>s.t==='read'));assert.ok(l.steps.some(s=>s.t==='play'));
 for(const s of l.steps.filter(s=>s.t==='play')){
 const p=buildPractice(s);for(const m of p.moments){
   for(const i of m.items)assert.ok(i.midi>=21&&i.midi<=108,'Outside 88-key piano');
   const r=m.items.filter(i=>i.hand==='R').map(i=>i.midi),l=m.items.filter(i=>i.hand==='L').map(i=>i.midi);
   assert.ok(!r.some(n=>l.includes(n)),'A physical key assigned to both hands: '+s.title);
 }
 for(const st of p.staves)for(const e of st.events)if(e.triplet)assert.equal(beatsOf(e.dur),1/3);
 const {bars}=loopBars(s);for(let n=1;n<=bars.length;n++){const loop=buildBarLoop(s,n,n);assert.ok(loop.totalBeats>0);assert.ok(loop.moments.every(m=>m.beat>=0&&m.beat<loop.totalBeats));loops++;}
 }
 }}
const final=ADVANCED_UNITS.at(-1).lessons.at(-1);assert.equal(final.steps.filter(s=>s.final).length,3);
const book=songbook('advanced');assert.equal(book.length,36);assert.ok(book.every(x=>x.lesson.course==='advanced'));
assert.equal(book.filter(x=>x.lesson.id==='adv-hymn-a8').length,3);
for(const course of ['beginner','intermediate'])assert.ok(songbook(course).every(x=>x.lesson.course!=='advanced'));
assert.ok(dailyReady({'adv-readiness':true},'advanced'));assert.ok(!dailyReady({'int-readiness':true},'advanced'));assert.ok(!dailyReady({'adv-readiness':true},'beginner'));
const d=buildDaily({'adv-readiness':true,'adv-abide-balance':true},'2026-11-01','advanced');assert.equal(d.course,'advanced');assert.ok(d.steps.some(s=>s.song));assert.ok(d.steps.some(s=>s.key==='A'||s.key==='Eb'));
assert.ok(buildDrill({},'advanced').steps.every(s=>s.timed==='advanced-reading'));assert.equal(practiceKey('advanced','2026-11-01'),'advanced:2026-11-01');assert.equal(practiceKey('beginner','2026-11-01'),'2026-11-01');
globalThis.localStorage={getItem:()=>null,setItem(){}};const {store}=await import('../js/store.js');
store.setLast('mary',1);store.setLast('int-triplets',2);store.setLast('adv-two-against-three',1);store.markDone('adv-readiness');store.practised(practiceKey('advanced','2026-11-01'));const backup=store.backup();store.reset();store.restore(backup);
assert.equal(store.data.settings.course,'advanced');assert.equal(store.data.lastByCourse.beginner.lesson,'mary');assert.equal(store.data.lastByCourse.intermediate.lesson,'int-triplets');assert.equal(store.data.lastByCourse.advanced.lesson,'adv-two-against-three');assert.ok(store.isDone('adv-readiness'));assert.ok(store.data.practice['advanced:2026-11-01']);
console.log('64 advanced lessons, 3 retained source editions, source melodies, 36 songbook arrangements, '+loops+' loops, daily practice and three-course backup passed');
