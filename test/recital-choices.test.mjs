import assert from 'node:assert/strict';
import {INTERMEDIATE_UNITS,ADVANCED_UNITS,HYMNS,chooseRecital,findLesson} from '../js/lessons/index.js';
import {chapterHTML} from '../js/notes.js';
import {songbook} from '../js/print.js';
import {buildPractice} from '../js/practice.js';
import {recitalRunKey} from '../js/lessons/recital-choices.js';
let choices=0;
for(const u of [...INTERMEDIATE_UNITS,...ADVANCED_UNITS]){
 const l=u.lessons.at(-1);assert.equal(l.choices.length,2);assert.equal(u.lessons.length,8);
 const original=l.choices[0];assert.equal(original.id,(u.course==='advanced'?'adv':'int')+'-hymn-'+u.id);
 const html=chapterHTML(u),keys=[];
 for(const p of l.choices){
  chooseRecital(u.id,p.id);assert.equal(l.piece,p);assert.match(l.title,new RegExp(p.title.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
  assert.equal(l.steps[0].t,'choose');assert.equal(l.steps[0].unit,u.id);assert.equal(l.steps.length,p.recitalSteps.length+1);
  assert.equal(findLesson(p.id).lesson,p);assert.ok(HYMNS.includes(p));
  assert.equal(chapterHTML(u),html,'PDFs must include both choices independently of selection');
  const finals=l.steps.filter(s=>s.final);assert.equal(finals.length,u.number===8?(u.course==='advanced'?3:2):1);
  assert.ok(finals.every(s=>buildPractice(s).moments.length>0));keys.push(recitalRunKey(l));choices++;
 }
 assert.notEqual(keys[0],keys[1]);chooseRecital(u.id,'invalid-id');assert.equal(l.piece,l.choices[1]);
 chooseRecital(u.id,original.id);assert.equal(l.piece,original);
}
assert.equal(songbook('intermediate').length,34);assert.equal(songbook('advanced').length,36);
globalThis.localStorage={getItem:()=>null,setItem(){}};
const {store}=await import('../js/store.js');store.data.recitals={i1:'int-hymn-i1-alternative',a8:'adv-hymn-a8-alternative'};store.data.recitalRuns={'adv-recital-a8:adv-hymn-a8':[5,6,7]};store.markDone('int-recital-i1');
const backup=store.backup();store.reset();store.restore(backup);
store.restore(JSON.stringify({app:'piano-tutor',data:{...store.data,recitalRuns:{'adv-recital-a8':[4,5,6]}}}));
assert.deepEqual(store.data.recitalRuns['adv-recital-a8:adv-hymn-a8'],[5,6,7]);
assert.equal(store.data.recitalRuns['adv-recital-a8:adv-hymn-a8-alternative'],undefined);
for(const [u,p]of Object.entries(store.data.recitals))chooseRecital(u,p);
assert.equal(INTERMEDIATE_UNITS[0].lessons.at(-1).piece.id,'int-hymn-i1-alternative');assert.equal(ADVANCED_UNITS[7].lessons.at(-1).piece.id,'adv-hymn-a8-alternative');assert.ok(store.isDone('int-recital-i1'));
for(const u of [...INTERMEDIATE_UNITS,...ADVANCED_UNITS])chooseRecital(u.id,u.lessons.at(-1).choices[0].id);
console.log(choices+' selectable recital options, choice-specific records, complete programmes, backups and stable PDF coverage passed');
