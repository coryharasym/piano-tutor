import assert from 'node:assert/strict';
import {store} from '../js/store.js';
import {songbook} from '../js/print.js';
import {findLesson} from '../js/lessons/index.js';
import {savePiece,updatePiece,removePiece,focusPiece,rememberSettings,sessionPlan,startSession,changeStage,finishSession,pieceKey} from '../js/personal.js';
const memory=new Map();globalThis.localStorage={setItem:(k,v)=>memory.set(k,v),getItem:k=>memory.get(k)};
store.reset();
const entry=songbook('beginner')[0],id=entry.lesson.id,step=entry.stepIndex;
const key=savePiece(id,step);assert.equal(key,pieceKey(id,step));
updatePiece(key,{note:'Keep the bass soft',stage:'Polishing'});focusPiece(key);
rememberSettings(id,step,{speed:0.5,hand:'L',loop:true,from:2,to:3});
savePiece(id,step);assert.equal(store.data.repertoire[key].note,'Keep the bass soft');
assert.equal(store.data.repertoire[key].settings.from,2);
assert.equal(savePiece(id,999),null);
const before=structuredClone({done:store.data.done,practice:store.data.practice,best:store.data.best});
for(const minutes of [5,15,30]){
 const plan=sessionPlan('beginner',minutes);assert.equal(plan.reduce((n,s)=>n+s.minutes,0),minutes);
 assert.deepEqual(plan[3].target,{lesson:id,step});
 startSession('beginner',minutes);changeStage('beginner',0,'done');changeStage('beginner',1,'skipped');
 finishSession('beginner','Review bars 2–3',{lesson:id,step});
 assert.equal(store.data.sessionHistory.at(-1).completed,1);
 assert.equal(store.data.sessionHistory.at(-1).skipped,1);
}
assert.deepEqual({done:store.data.done,practice:store.data.practice,best:store.data.best},before);
startSession('intermediate',15);assert.ok(store.data.sessions.intermediate);assert.equal(store.data.sessions.beginner,undefined);
const backup=store.backup(),records=structuredClone(store.data);
store.reset();store.restore(backup);assert.deepEqual(store.data,records);
// Old backups gain defaults and keep existing completion/resume data.
store.restore(JSON.stringify({app:'piano-tutor',data:{done:{welcome:true},last:{lesson:'welcome',step:1}}}));
assert.ok(store.isDone('welcome'));assert.deepEqual(store.data.repertoire,{});assert.deepEqual(store.data.sessions,{});
store.restore(backup);removePiece(key);assert.equal(store.data.focusPieces.beginner,undefined);assert.equal(store.data.repertoire[key],undefined);
assert.ok(findLesson(id));console.log('Personal pieces, preserved settings, session allocation, course isolation, progress isolation and old/new backups passed');
