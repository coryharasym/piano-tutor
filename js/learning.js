import {store} from './store.js';
import {validCourse} from './courses.js';
export const learningKey=(course,lesson,step)=>`${validCourse(course)}:${lesson}:${step}`;
export function recordAttempt(course,lesson,step,assisted=false,now=Date.now()) {
 const key=learningKey(course,lesson,step),old=store.data.learning?.[key]||{};
 const item={...old,course:validCourse(course),lesson,step,lastPractised:now,assisted:(Number.isFinite(old.assisted)?old.assisted:0)+(assisted?1:0),independent:(Number.isFinite(old.independent)?old.independent:0)+(assisted?0:1),nextReview:now+86400000};
 store.data.learning={...store.data.learning,[key]:item};store.save();return item;
}
export function ratePractice(course,lesson,step,comfortable,now=Date.now()) {
 const key=learningKey(course,lesson,step),old=store.data.learning?.[key];if(!old)return;
 store.data.learning[key]={...old,comfortable:!!comfortable,ratedAt:now,nextReview:now+(comfortable?7:1)*86400000};store.save();
}
export function duePractice(course,now=Date.now()) {
 return Object.values(store.data.learning||{}).filter(x=>x&&x.course===validCourse(course)&&Number.isFinite(x.nextReview)&&x.nextReview<=now).sort((a,b)=>a.nextReview-b.nextReview);
}
