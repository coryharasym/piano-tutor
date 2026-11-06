import assert from 'node:assert/strict';
import {store} from '../js/store.js';
import {Listener} from '../js/listen.js';
import {piano} from '../js/audio.js';
import {addLesson,findLesson,UNITS,chooseRecital} from '../js/lessons/index.js';
import {buildLab,rhythmPattern} from '../js/musicianship-model.js';
import {recordAttempt,ratePractice,reviewTarget,restoreReview} from '../js/learning.js';
import {sessionPlan} from '../js/personal.js';
const memory=new Map();globalThis.localStorage={setItem:(k,v)=>memory.set(k,v),getItem:k=>memory.get(k)};
store.reset();store.markDone('welcome');
const saved=store.backup();
for(const corrupt of [{learning:null},{settings:{metroBpm:999}},{recitalRuns:{'adv-recital-a1':{}}},{lastByCourse:{beginner:{step:1}}},{settings:[]},{sessions:{beginner:{stages:null}}},{musicianship:{'beginner:ear':-2}},{last:{lesson:2,step:1}}]){
 const data={done:{welcome:true},...corrupt};assert.throws(()=>store.restore(JSON.stringify({app:'piano-tutor',data})));assert.equal(store.backup().split('"data"')[1],saved.split('"data"')[1],'Rejected backup must not replace live progress');
}
store.data.learning['intermediate:int-lab-sight:1']={course:'intermediate',lesson:'int-lab-sight',step:1,assisted:2};
ratePractice('intermediate','int-lab-sight',1,true,0,'intermediate:int-lab-sight:1');assert.equal(store.data.learning['intermediate:int-lab-sight:1'].comfortable,true);delete store.data.learning['intermediate:int-lab-sight:1'];
const first=buildLab('sight',{},'intermediate',1);addLesson({id:'practice'},first);const item=recordAttempt('intermediate',first.id,1,false,0);
const rh=first.steps[1].rh;addLesson({id:'practice'},buildLab('sight',{},'intermediate',9));
const target=reviewTarget(item);assert.equal(findLesson(target.lesson).lesson.steps[0].rh,rh);assert.equal(findLesson(target.lesson).lesson.daily,true);
const again=recordAttempt('intermediate',target.lesson,0,false,1);assert.equal(again.independent,2);assert.equal(again.course,'intermediate');assert.equal(again.lesson,first.id);
ratePractice('intermediate',first.id,1,true,2,item.key);assert.equal(store.data.learning[item.key].comfortable,true);
const plan=sessionPlan('intermediate',15);store.data.learning[item.key].nextReview=0;assert.equal(sessionPlan('intermediate',15)[1].target.lesson,target.lesson);
const backup=store.backup();store.reset();store.restore(backup);restoreReview(target.lesson);assert.equal(findLesson(target.lesson).lesson.steps[0].rh,rh);
const recital=UNITS.find(u=>u.course==='intermediate').lessons.find(l=>l.recital),unit=UNITS.find(u=>u.lessons.includes(recital));
chooseRecital(unit.id,recital.choices[0].id);let index=recital.steps.findIndex(s=>s.final);const one=recordAttempt('intermediate',recital.id,index,false,3);
chooseRecital(unit.id,recital.choices[1].id);index=recital.steps.findIndex(s=>s.final);const two=recordAttempt('intermediate',recital.id,index,false,4);
assert.notEqual(one.key,two.key);assert.notEqual(one.snapshot.title,two.snapshot.title);assert.equal(findLesson(reviewTarget(one).lesson).lesson.steps[0].rh,one.snapshot.step.rh);
for(const unit of UNITS)for(const lesson of unit.lessons.filter(x=>x.recital)) {
 const choices=lesson.choices||[null];
 for(const choice of choices){if(choice)chooseRecital(unit.id,choice.id);for(const [i,step]of lesson.steps.entries())if(step.t==='play')assert.ok(reviewTarget(recordAttempt(unit.course,lesson.id,i)),lesson.id+':'+i);}
}
const injected={...one,snapshot:{title:'<img src=x onerror=alert(1)>',step:{rh:'C4/q',title:'<script>alert(1)</script>'}}};const safe=findLesson(reviewTarget(injected).lesson).lesson;assert.ok(!safe.title.includes('<'));assert.ok(!safe.steps[0].title.includes('<'));
// Concurrent microphone starts share one request. Stop invalidates pending permission/resume.
let resolveMic,requests=0,stops=0,closed=0;
Object.defineProperty(globalThis,'navigator',{configurable:true,value:{mediaDevices:{getUserMedia:()=>{requests++;return new Promise(r=>resolveMic=r);}}}});
globalThis.window={AudioContext:class {constructor(){this.state='running';}createMediaStreamSource(){return {connect(){}};}createAnalyser(){return {frequencyBinCount:4096};}close(){closed++;return Promise.resolve();}}};
piano.unlock=async()=>{};const l=new Listener();const a=l.start(),b=l.start();await Promise.resolve();assert.equal(requests,1);l.stop();resolveMic({getTracks:()=>[{stop(){stops++;}}]});assert.equal(await a,false);assert.equal(await b,false);assert.equal(stops,1);assert.equal(l.active,false);
const c=l.start();await Promise.resolve();resolveMic({getTracks:()=>[{stop(){stops++;}}]});assert.equal(await c,true);l.stop();assert.equal(stops,2);assert.equal(closed,1);assert.equal(l.analyser,null);
// Device initialization failure releases the acquired stream.
window.AudioContext=class {constructor(){throw new Error('Device unavailable');}};
const d=l.start();await Promise.resolve();resolveMic({getTracks:()=>[{stop(){stops++;}}]});await assert.rejects(d,/Device unavailable/);assert.equal(stops,3);assert.equal(l.active,false);
console.log('Atomic backup rejection, exact generated/recital reviews, course-correct review updates, restored references, safe snapshot text and microphone race/resource cleanup passed');
