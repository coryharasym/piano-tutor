import assert from 'node:assert/strict';
import {buildLab,buildHymn,rhythmPattern,scoreRhythm} from '../js/musicianship-model.js';
import {UNITS,findLesson} from '../js/lessons/index.js';
import {parseSeq,beatsOf} from '../js/theory.js';
import {buildPractice} from '../js/practice.js';
import {recordAttempt,ratePractice,duePractice} from '../js/learning.js';
import {store} from '../js/store.js';
for(const course of ['beginner','intermediate','advanced'])for(let variant=0;variant<50;variant++)for(const kind of ['ear','sight']) {
 const lesson=buildLab(kind,{},course,variant),step=lesson.steps[1],practice=buildPractice(step);
 assert.deepEqual(lesson,buildLab(kind,{},course,variant));assert.ok(lesson.daily);
 assert.equal(practice.totalBeats,kind==='sight'?16:course==='beginner'?4:6);
 assert.ok(practice.moments.every(m=>m.items.every(i=>i.midi>=48&&i.midi<=72)));
 assert.equal(step.hint,false);assert.equal(step.noDemo,kind!=='ear');
 const rhythm=rhythmPattern({},course,variant);assert.ok(rhythm.beats.every((b,i)=>b>=0&&b<16&&(!i||b>rhythm.beats[i-1])));
 assert.equal(scoreRhythm(rhythm.beats,rhythm.beats).matched,rhythm.beats.length);
 assert.equal(scoreRhythm(rhythm.beats,rhythm.beats.map(n=>n+100)).matched,0);
}
assert.notDeepEqual(buildLab('sight',{},'beginner',1),buildLab('sight',{},'beginner',2));
for(let stage=0;stage<6;stage++) {
 const l=buildHymn(stage);for(const s of l.steps.filter(s=>s.t==='play')){const p=buildPractice(s);assert.equal(p.totalBeats,stage===4?32:24);if(s.lh&&s.rh)assert.equal(parseSeq(s.rh).filter(e=>!e.bar).reduce((n,e)=>n+beatsOf(e.dur),0),parseSeq(s.lh).filter(e=>!e.bar).reduce((n,e)=>n+beatsOf(e.dur),0));}
 const full=l.steps.find(s=>s.song);assert.equal(!!full.lh,stage>0);assert.ok(full.chordPlan.includes('C | C | F'));
}
const u2=UNITS.find(u=>u.id==='u2').lessons;assert.equal(u2[u2.findIndex(l=>l.id==='hands-together')-1].id,'held-bass-bridge');
const u3=UNITS.find(u=>u.id==='u3').lessons;assert.ok(u3.findIndex(l=>l.id==='hand-position-shifts')<u3.findIndex(l=>l.id==='counting'));
const twinkle=findLesson('counting').lesson.steps.find(s=>s.song);assert.ok(twinkle.rh.includes('G4/q/5 G4/q/5 A4/q/5'));
store.reset();recordAttempt('beginner','counting',4,true,100);recordAttempt('beginner','counting',4,false,200);ratePractice('beginner','counting',4,false,300);
assert.equal(duePractice('beginner',300+86400000).length,1);assert.equal(duePractice('intermediate',300+86400000).length,0);
const backup=store.backup();store.reset();store.restore(backup);const item=Object.values(store.data.learning)[0];assert.equal(item.assisted,1);assert.equal(item.independent,1);assert.equal(item.comfortable,false);
assert.deepEqual(store.data.done,{});console.log('300 fresh ear/reading examples, rhythms, six hymn stages, prerequisite order, confidence/review timing and backup isolation passed');
