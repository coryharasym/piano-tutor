import {store} from './store.js';
import {validCourse} from './courses.js';
import {findLesson,addLesson} from './lessons/index.js';
import {buildPractice} from './practice.js';
export const learningKey=(course,lesson,step)=>`${validCourse(course)}:${lesson}:${step}`;
const hash=text=>{let h=2166136261;for(const c of text)h=Math.imul(h^c.charCodeAt(0),16777619);return (h>>>0).toString(36);};
function context(lesson,step,course) {
 const found=findLesson(lesson)?.lesson;
 if(found?.reviewKey&&store.data.learning?.[found.reviewKey])return {key:found.reviewKey};
 const base=learningKey(course,lesson,step),exercise=found?.steps[step];
 if(!exercise||!(found.daily||found.warmup||found.recital))return {key:base};
 const fields=['title','say','rh','lh','time','key','range','tempo','hint','ear','staff','names','showFingers','noDemo','reps'];
 const snapshot={title:found.title,step:Object.fromEntries(fields.filter(k=>exercise[k]!==undefined).map(k=>[k,exercise[k]]))};
 return {key:base+':'+hash(JSON.stringify(snapshot)),snapshot};
}
export function recordAttempt(course,lesson,step,assisted=false,now=Date.now()) {
 const info=context(lesson,step,course),key=info.key,old=store.data.learning?.[key]||{};
 if(findLesson(lesson)?.lesson.reviewKey&&old.lesson){lesson=old.lesson;step=old.step;}

 const item={...old,...(info.snapshot?{snapshot:info.snapshot}:{}),key,course:validCourse(course),lesson,step,lastPractised:now,assisted:(Number.isFinite(old.assisted)?old.assisted:0)+(assisted?1:0),independent:(Number.isFinite(old.independent)?old.independent:0)+(assisted?0:1),nextReview:now+86400000};
 store.data.learning={...store.data.learning,[key]:item};store.save();return item;
}
export function ratePractice(course,lesson,step,comfortable,now=Date.now(),recordKey) {
 const key=recordKey||context(lesson,step,course).key,old=store.data.learning?.[key];if(!old||old.course!==validCourse(course))return;
 store.data.learning[key]={...old,comfortable:!!comfortable,ratedAt:now,nextReview:now+(comfortable?7:1)*86400000};store.save();
}
export function duePractice(course,now=Date.now()) {
 return Object.values(store.data.learning||{}).filter(x=>x&&x.course===validCourse(course)&&Number.isFinite(x.nextReview)&&x.nextReview<=now).sort((a,b)=>a.nextReview-b.nextReview);
}

// Reopen the recorded exercise rather than today's regenerated notes or another recital choice.
export function reviewTarget(item) {
 if(!item?.snapshot)return {lesson:item.lesson,step:item.step};
 const source=item.snapshot.step;
 if(!source||![source.rh,source.lh].some(x=>typeof x==='string'&&x.length)||[source.rh,source.lh].some(x=>x!=null&&(typeof x!=='string'||x.length>50000||!/^[A-Za-z#0-9\s\[\]\/.,:|_+()~!'-]*$/.test(x))))return null;
 // Musical snapshots are data from backups too. Never render imported markup or links.
 const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const step={t:'play',rh:source.rh,lh:source.lh,title:esc(source.title),say:esc(source.say),staff:true,hint:source.hint!==false,names:!!source.names,ear:!!source.ear,noDemo:!!source.noDemo,showFingers:!!source.showFingers,tempo:Number.isFinite(source.tempo)?Math.max(20,Math.min(240,source.tempo)):60,reps:Number.isInteger(source.reps)?Math.max(1,Math.min(10,source.reps)):1};
 if(typeof source.time==='string'&&/^\d{1,2}\/(2|4|8|16)$/.test(source.time))step.time=source.time;
 if(typeof source.key==='string'&&/^[A-G][b#]?m?$/.test(source.key))step.key=source.key;
 if(Array.isArray(source.range)&&source.range.length===2&&source.range.every(n=>typeof n==='string'&&/^[A-G][b#]?[0-8]$/.test(n)))step.range=source.range;
 try { const practice=buildPractice(step); if(!practice.moments.length||practice.totalBeats>10000||practice.moments.some(m=>m.items.some(i=>!Number.isFinite(i.midi)||i.midi<0||i.midi>127)))return null; } catch { return null; }
 const key=item.key||learningKey(item.course,item.lesson,item.step),id='review-'+validCourse(item.course)+'-'+hash(key);
 addLesson({id:'practice',title:'Learning review',course:item.course},{id,course:item.course,daily:true,reviewKey:key,title:esc(item.snapshot.title),steps:[step]});
 return {lesson:id,step:0};
}
export function restoreReview(id) {
 const item=Object.entries(store.data.learning||{}).find(([key,x])=>x&&id==='review-'+validCourse(x.course)+'-'+hash(x.key||key));
 if(item)reviewTarget({...item[1],key:item[0]});
}
