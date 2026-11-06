import assert from 'node:assert/strict';
import {findLesson,courseUnits,nextLesson} from '../js/lessons/index.js';
import {buildPractice} from '../js/practice.js';
import {parseSeq} from '../js/theory.js';
const lessons=courseUnits().find(u=>u.id==='u3').lessons;
const at=lessons.findIndex(l=>l.id==='hand-position-shifts');
assert.equal(lessons[at-1].id,'counting');assert.equal(lessons[at+1].id,'doxology-3');
assert.equal(nextLesson({},'counting').id,'hand-position-shifts');
const lesson=lessons[at];assert.equal(lesson.steps.length,5);
assert.match(lesson.steps[0].body,/Do not anchor/);assert.match(lesson.steps[0].fig,/fingers 1 2 3 4 5/);
for(const step of lesson.steps.filter(s=>s.t==='play')) {
 assert.equal(step.tempo,60);assert.equal(step.showFingers,true);
 const practice=buildPractice(step);assert.ok(practice.moments.every(m=>m.items.length===1));
 assert.ok(practice.moments.flatMap(m=>m.items).every(i=>i.midi>=57&&i.midi<=67));
}
const phrase=parseSeq(lesson.steps[3].rh).filter(e=>!e.bar);
assert.deepEqual(phrase.map(e=>e.midis[0]),[60,62,64,62,60,57,59,60]);
assert.deepEqual(phrase.map(e=>e.fingers[0]),[3,4,5,4,3,1,2,3]);
const dox=findLesson('doxology-3').lesson;
assert.equal(dox.steps[1].rh,lesson.steps[3].rh);assert.equal(dox.steps[1].showFingers,true);
assert.match(dox.steps[3].say,/Between lines 2 and 3/);
console.log('Position lesson order, safe single-hand range, phrase notes/fingers, Doxology linkage and next-lesson navigation passed');
