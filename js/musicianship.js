import {store} from './store.js';
import {validCourse} from './courses.js';
import {addLesson,findLesson} from './lessons/index.js';
import {piano} from './audio.js';
import {buildLab,buildHymn,HYMN_STAGES,rhythmPattern,scoreRhythm} from './musicianship-model.js';
import {recordAttempt,ratePractice,duePractice,reviewTarget,learningKey} from './learning.js';
import {mountRecorder} from './recorder.js';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function restoreLab(id) {
 const match=/^(?:(int|adv)-)?lab-(ear|sight|hymn-[0-5])$/.exec(id||'');if(!match)return;
 const course=match[1]==='int'?'intermediate':match[1]==='adv'?'advanced':'beginner',kind=match[2];
 const variant=store.data.musicianship?.[course+':'+kind]||0;
 const lesson=kind.startsWith('hymn-')?buildHymn(+kind.at(-1),course):buildLab(kind,store.data.done,course,variant);
 addLesson({id:'practice',title:'Musicianship',course},lesson);return lesson;
}
export function mountMusicianship(root,{go,onBack,kind,variant}) {
 const course=validCourse(store.setting('course'));let dispose=()=>{};
 root.innerHTML='<main class="workspace musicianship"><header class="workspace-head"><button class="pill" data-back>Back</button><h1>Musicianship</h1></header><div class="workspace-content"></div></main>';
 const main=root.querySelector('.workspace-content');root.querySelector('[data-back]').onclick=kind?()=>go('#/musicianship'):onBack;
 const startLab=topic=>{const key=course+':'+topic;store.data.musicianship={...store.data.musicianship,[key]:(store.data.musicianship?.[key]||0)+1};store.save();const id=(course==='beginner'?'':course==='intermediate'?'int-':'adv-')+'lab-'+topic;restoreLab(id);go('#/lesson/'+id+'/0');};
 if(['ear','sight'].includes(kind)){startLab(kind);return dispose;}
 if(kind==='record'){dispose=mountRecorder(main);const last=store.data.lastByCourse?.[course]||store.data.last;if(last&&findLesson(last.lesson)){const back=document.createElement('button');back.className='pill';back.textContent='Return to '+findLesson(last.lesson).lesson.title;back.onclick=()=>go(`#/lesson/${last.lesson}/${last.step||0}`);main.appendChild(back);}return dispose;}
 if(kind==='rhythm'){dispose=mountRhythm(main,course,variant===undefined?undefined:Number(variant));return dispose;}
 if(kind==='hymn') {
  const unlocked=course!=='beginner'||store.data.done['major-chords'];
  main.innerHTML=`<p>Use a familiar melody to learn one accompaniment skill at a time. Learn C, F and G chords first. Alternative arrangements are judged by listening, not by an exact-note checker.</p>${!unlocked?'<p>First complete C, F and G chords in Harmony. You can explore these explanations whenever you like.</p>':''}<div class="lab-grid">${HYMN_STAGES.map((title,i)=>`<button class="workspace-card" data-hymn="${i}"><b>${i+1}. ${title}</b><small>${unlocked?'Jesus Loves Me, one manageable texture at a time':'Explore this stage'}</small></button>`).join('')}</div>`;
  main.querySelectorAll('[data-hymn]').forEach(b=>b.onclick=()=>startLab('hymn-'+b.dataset.hymn));return dispose;
 }
 if(kind==='review') {
  Object.values(store.data.learning||{}).forEach(x=>{if(x?.lesson)restoreLab(x.lesson);});
  const rows=Object.entries(store.data.learning||{}).map(([key,item])=>item&&({...item,key:item.key||key})).filter(x=>x?.course===course&&(x.snapshot||findLesson(x.lesson)||x.lesson==='rhythm-lab'));
  main.innerHTML='<p>Lesson ribbons record completion. These entries describe practice attempts and your own confidence. Assisted practice includes lesson hints, chord help or a played-for-you hand. Independent practice still does not certify tone, rhythm or held notes.</p><div class="lab-reviews"></div>';
  const list=main.querySelector('.lab-reviews');
  if(!rows.length)list.textContent='Complete a play exercise to begin your practice record.';
  rows.sort((a,b)=>b.lastPractised-a.lastPractised).slice(0,40).forEach(item=>{
   const found=findLesson(item.lesson),card=document.createElement('section');card.className='workspace-card';
   card.innerHTML=`<h2>${esc(item.snapshot?.title||found?.lesson.title||'Rhythm practice')}</h2><p>${esc(item.snapshot?.step?.title||found?.lesson.steps[item.step]?.title||'Four-bar tapping exercise')}</p><p>${esc(item.assisted||0)} assisted · ${esc(item.independent||0)} without assistance · ${item.comfortable?'Comfortable':item.comfortable===false?'Needs work':'Not yet rated'}</p><div class="lab-actions"><button class="pill" data-open>Practise</button><button class="pill" data-rate="no">Needs work</button><button class="pill" data-rate="yes">Comfortable</button></div>`;
   card.querySelector('[data-open]').onclick=()=>{if(item.lesson==='rhythm-lab'){go('#/musicianship/rhythm/'+item.step);return;}const target=reviewTarget(item);if(target)go(`#/lesson/${target.lesson}/${target.step}`);};
   card.querySelectorAll('[data-rate]').forEach(b=>b.onclick=()=>{ratePractice(course,item.lesson,item.step,b.dataset.rate==='yes',Date.now(),item.key);mountMusicianship(root,{go,onBack,kind});});list.append(card);
  });return dispose;
 }
 const due=duePractice(course).filter(x=>findLesson(x.lesson));
 main.innerHTML=`<p>Small doses of listening, rhythm and fresh reading help you play independently. These activities do not add course ribbons. Your selected course controls the level.</p>${due.length?`<p>${due.length} practice item${due.length===1?'':'s'} ready to review.</p>`:''}<div class="lab-grid"><button class="workspace-card" data-lab="rhythm"><b>Count, tap, then play</b><small>Rhythm without finding pitches</small></button><button class="workspace-card" data-lab="ear"><b>Listen and Copy</b><small>A hidden short phrase to find by ear</small></button><button class="workspace-card" data-lab="sight"><b>Fresh musical reading</b><small>A new short phrase, easier than repertoire</small></button><button class="workspace-card" data-lab="hymn"><b>Hymn accompaniment pathway</b><small>Melody → bass → chords → your own version</small></button><button class="workspace-card" data-lab="record"><b>Record and listen</b><small>One take, one listening question</small></button><button class="workspace-card" data-lab="review"><b>My learning and review</b><small>Assistance, personal confidence and next practice</small></button></div><section class="workspace-card"><h2>A creative minute</h2><p>Choose C, D and E. Play a four-beat question, then a four-beat answer ending on C. Repeat your favourite idea with a new rhythm. There is more than one good answer: listen for a clear pulse and ending. Try it after Listen and Copy, then record it if you wish.</p></section>`;
 main.querySelectorAll('[data-lab]').forEach(b=>b.onclick=()=>['ear','sight'].includes(b.dataset.lab)?startLab(b.dataset.lab):go('#/musicianship/'+b.dataset.lab));return dispose;
}
function mountRhythm(main,course,requestedVariant) {
 let variant=store.data.musicianship?.[course+':rhythm']||0;
 if(Number.isSafeInteger(requestedVariant)&&requestedVariant>=0)variant=requestedVariant;
 const saved=Number.isSafeInteger(requestedVariant)?store.data.learning?.[learningKey(course,'rhythm-lab',variant)]?.rhythm:null;
 const validSaved=saved&&Array.isArray(saved.beats)&&saved.beats.length>0&&saved.beats.length<=32&&saved.beats.every((n,i)=>Number.isFinite(n)&&n>=0&&n<16&&(!i||n>saved.beats[i-1]));
 let pattern=validSaved?{beats:saved.beats,total:16,bpm:60,description:String(saved.description||'Saved rhythm')}:rhythmPattern(store.data.done,course,variant),timer,frame,handles=[],disposed=false,generation=0,active=false,startAt,taps=[];
 main.innerHTML='<h2>Count, tap, then play</h2><p>Listen to four bars on one note, then tap their starts after a four-beat count-in. Use the Tap button or the space bar. A tap checks an onset, not a held-note duration.</p><p data-pattern></p><div class="rhythm-cells" aria-label="Four-bar rhythm"></div><div class="lab-actions"><button class="pill" data-demo>Listen to rhythm</button><button class="btn" data-start>Start tapping</button><button class="pill" data-cancel>Stop</button><button class="pill" data-fresh>New rhythm</button></div><button class="rhythm-tap" data-tap>Tap</button><p role="status" data-status>Ready</p><p>Then play the same rhythm on Middle C. Count through silent beats and listen for full-length notes.</p>';
 const status=main.querySelector('[data-status]');
 const paint=()=>{main.querySelector('[data-pattern]').textContent=pattern.description+' · 60 BPM';main.querySelector('.rhythm-cells').innerHTML=Array.from({length:16},(_,i)=>`<span class="${pattern.beats.includes(i)?'on':''}">${i%4+1}${pattern.beats.includes(i+.5)?' &':''}</span>`).join('');};paint();
 const stop=()=>{generation++;active=false;clearTimeout(timer);cancelAnimationFrame(frame);handles.forEach(h=>h.stop());handles=[];};
 const tap=()=>{if(active){const t=(performance.now()-startAt)/1000;if(t>=-.22&&t<=pattern.total+.22)taps.push(t);}};
 const key=e=>{if(e.code==='Space'&&!e.repeat&&e.target.tagName!=='INPUT'&&e.target.tagName!=='SELECT'){e.preventDefault();tap();}};window.addEventListener('keydown',key);
 main.querySelector('[data-tap]').onclick=tap;
 const prepare=async()=>{stop();const token=generation;try{await piano.unlock();return !disposed&&token===generation;}catch{if(!disposed)status.textContent='Audio could not start. Try again after enabling sound.';return false;}};
 main.querySelector('[data-demo]').onclick=async()=>{if(!await prepare())return;status.textContent='Listen: one bar of count-in, then the rhythm.';const at=piano.ctx.currentTime+.1;for(let i=0;i<4;i++)handles.push(piano.play(72,{when:at+i,duration:.09,velocity:.4}));for(const beat of pattern.beats)handles.push(piano.play(60,{when:at+4+beat,duration:.18,velocity:.6}));timer=setTimeout(()=>status.textContent='Ready to tap the same pattern.',20100);};
 main.querySelector('[data-start]').onclick=async()=>{
  if(!await prepare())return;taps=[];startAt=performance.now()+4100;active=true;
  const at=piano.ctx.currentTime+.1;for(let i=0;i<4;i++)handles.push(piano.play(72,{when:at+i,duration:.09,velocity:.4}));
  const draw=()=>{const sec=(performance.now()-startAt)/1000;status.textContent=sec<0?'Count in: '+Math.min(4,Math.ceil(-sec)):'Tap bar '+Math.min(4,Math.floor(sec/4)+1);frame=requestAnimationFrame(draw);};draw();
  timer=setTimeout(()=>{active=false;cancelAnimationFrame(frame);const result=scoreRhythm(pattern.beats,taps);const item=recordAttempt(course,'rhythm-lab',variant,false);store.data.learning[item.key].rhythm={beats:[...pattern.beats],description:pattern.description};store.save();status.textContent=`${result.matched} of ${result.total} starts matched; ${result.missed} missed, ${result.extra} extra. Try once on a piano key, then choose one rhythm to repair.`;},20350);
 };
 main.querySelector('[data-cancel]').onclick=()=>{stop();status.textContent='Stopped';};
 main.querySelector('[data-fresh]').onclick=()=>{stop();variant=Math.max(variant,store.data.musicianship?.[course+':rhythm']||0)+1;store.data.musicianship={...store.data.musicianship,[course+':rhythm']:variant};store.save();pattern=rhythmPattern(store.data.done,course,variant);paint();status.textContent='New rhythm ready';};
 return()=>{disposed=true;stop();window.removeEventListener('keydown',key);};
}
