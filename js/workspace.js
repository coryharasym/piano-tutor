import { store } from './store.js';
import { findLesson } from './lessons/index.js';
import { validCourse } from './courses.js';
import { TECHNIQUE } from './technique.js';
import { escapeHTML as esc, STAGES, SESSION_MINUTES, pieceOptions, savePiece, updatePiece, removePiece, focusPiece, playable, startSession, changeStage, finishSession } from './personal.js';

const node = html => { const t=document.createElement('template');t.innerHTML=html;return t.content.firstElementChild; };
function shell(root,title,onBack) {
  const el=node(`<main class="workspace"><header class="workspace-head"><button class="pill" data-back>Back</button><h1>${title}</h1></header><div class="workspace-content"></div></main>`);
  el.querySelector('[data-back]').onclick=onBack;root.replaceChildren(el);return el.querySelector('.workspace-content');
}
const targetLabel = target => {
  const f=target&&findLesson(target.lesson);return f ? `${f.lesson.title} · ${f.lesson.steps[target.step]?.title || 'Continue'}` : target?.lesson==='warmup'?'Gentle, familiar patterns':'';
};
export function mountSession(root,{go,onBack}) {
  const course=validCourse(store.setting('course'));
  const session=store.data.sessions?.[course];
  const focus=store.data.repertoire?.[store.data.focusPieces?.[course]];
  if(session && focus && playable(focus) && session.opened!==3 && session.stages[3].status==='pending') {
    session.stages[3].target={lesson:focus.lesson,step:focus.step};store.save();
  }
  const main=shell(root,'Your practice',onBack);
  const redraw=()=>mountSession(root,{go,onBack});
  if(!session){
    main.innerHTML=`<section class="workspace-card"><span class="eyebrow">Make time for music</span><h2>How much time do you have?</h2><p>Suggested pacing, with no countdown. Repeat a section or finish early whenever you like.</p><div class="session-lengths">${Object.keys(SESSION_MINUTES).map(m=>`<button class="btn ${m==='15'?'primary':''}" data-minutes="${m}">${m} minutes</button>`).join('')}</div></section>
    <p class="muted">Warm-up → Review → Current learning → A familiar piece</p>
    ${store.data.nextPractice?.[course]?.note?`<section class="workspace-card"><h2>For next time</h2><p class="personal-note">${esc(store.data.nextPractice[course].note)}</p></section>`:''}`;
    main.querySelectorAll('[data-minutes]').forEach(b=>b.onclick=()=>{startSession(course,b.dataset.minutes);redraw();});return;
  }
  const completed=session.stages.filter(s=>s.status==='done').length;
  main.innerHTML=`<p>${session.minutes}-minute plan · ${completed} of 4 sections practised</p><p class="muted">The times are suggestions. Opening a section does not mark it complete.</p>
  ${store.data.nextPractice?.[course]?.note?`<p class="personal-note"><b>Remember:</b> ${esc(store.data.nextPractice[course].note)}</p>`:''}
  <div class="session-stages">${session.stages.map((s,i)=>`<section class="workspace-card session-stage" data-stage="${i}"><div><span class="eyebrow">${s.minutes} ${s.minutes===1?'minute':'minutes'} suggested · ${s.status==='done'?'Done':s.status==='skipped'?'Skipped':'Ready'}</span><h2>${i+1}. ${s.title}</h2><p class="muted">${esc(s.target?targetLabel(s.target):s.empty)}</p></div><div class="workspace-actions">${s.target?`<button class="btn primary" data-open="${i}">${session.opened===i?'Return to section':'Open section'}</button>`:i===3?'<button class="pill" data-pieces>Choose a piece</button>':'<button class="pill" data-lessons>Browse lessons</button>'}<button class="pill" data-done="${i}" ${s.target?'':'disabled'}>${s.status==='done'?'Repeat section':'Mark done'}</button><button class="text-btn" data-skip="${i}">${s.status==='skipped'?'Include again':'Skip'}</button></div></section>`).join('')}</div>
  <section class="workspace-card"><h2>What should you return to next time?</h2><label class="field">A small goal or reminder<textarea data-reflection maxlength="1000" rows="3" placeholder="For example: keep the left hand steady in bars 5–8"></textarea></label><label class="field">Lesson or passage to revisit<select data-revisit><option value="">Continue my current lesson</option>${session.stages.filter(s=>playable(s.target)).map(s=>`<option value="${esc(JSON.stringify(s.target))}">${esc(targetLabel(s.target))}</option>`).join('')}</select></label><p class="muted small">Saved passage loops stay with pieces in My Pieces. Finishing a session does not award lesson or recital completion.</p><button class="btn primary" data-finish>${completed===4?'Finish practice':'Finish for today'}</button></section>`;
  const reflection=main.querySelector('[data-reflection]');reflection.value=session.reflection||'';
  reflection.oninput=()=>{session.reflection=reflection.value;store.save();};
  const revisit=main.querySelector('[data-revisit]');revisit.value=session.revisit||'';
  revisit.onchange=()=>{session.revisit=revisit.value;store.save();};
  main.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>{
    const i=+b.dataset.open;session.opened=i;store.save();
    const target=session.stages[i].target;
    // A revisit uses the saved loop and hand settings when the target is a saved piece.
    const piece=store.data.repertoire?.[`${target.lesson}:${target.step}`];
    go(`#/${piece?.settings?.loop?'play':'lesson'}/${target.lesson}/${target.step}`);
  });
  main.querySelectorAll('[data-done]').forEach(b=>b.onclick=()=>{const i=+b.dataset.done;changeStage(course,i,session.stages[i].status==='done'?'pending':'done');redraw();});
  main.querySelectorAll('[data-skip]').forEach(b=>b.onclick=()=>{const i=+b.dataset.skip;changeStage(course,i,session.stages[i].status==='skipped'?'pending':'skipped');redraw();});
  main.querySelectorAll('[data-pieces]').forEach(b=>b.onclick=()=>go('#/pieces'));
  main.querySelectorAll('[data-lessons]').forEach(b=>b.onclick=()=>go('#/'));
  main.querySelector('[data-finish]').onclick=()=>{finishSession(course,reflection.value,revisit.value?JSON.parse(revisit.value):null);redraw();};
}
export function sessionDock(root,{go,onDispose,lessonId}) {
  const course=validCourse(store.setting('course')),session=store.data.sessions?.[course];
  if(!session||session.opened==null)return;
  const stage=session.stages[session.opened];
  if(stage.target?.lesson!==lessonId)return;
  const dock=node(`<aside class="session-dock" aria-label="Practice session"><span>${esc(stage.title)} · ${stage.minutes} min suggested</span><button class="pill">Back to practice</button></aside>`);
  dock.querySelector('button').onclick=()=>go('#/session');root.classList.add('with-session');document.body.appendChild(dock);
  const measure=()=>root.style.setProperty('--session-dock-height',`${dock.getBoundingClientRect().height}px`);
  const observer=new ResizeObserver(measure);observer.observe(dock);measure();
  onDispose(()=>{observer.disconnect();dock.remove();root.classList.remove('with-session');root.style.removeProperty('--session-dock-height');});
}
export function mountPieces(root,{go,onBack}) {
  const main=shell(root,'My Pieces',onBack);
  const redraw=()=>mountPieces(root,{go,onBack});
  const all=pieceOptions();
  const pieces=Object.entries(store.data.repertoire||{}).filter(([,p])=>playable(p));
  main.innerHTML=`<p>Keep songs from any level here. Choose one current focus per course for your practice routine.</p><section class="workspace-card"><h2>Add a piece</h2><label class="field">Song from your courses<select data-add-choice>${all.map(p=>`<option value="${esc(JSON.stringify({lesson:p.lesson,step:p.step}))}">${esc(findLesson(p.lesson)?.unit.course||findLesson(p.lesson)?.lesson.course||'beginner')} · ${esc(p.title)}</option>`).join('')}</select></label><button class="btn primary" data-add>Add to My Pieces</button></section><div class="piece-list"></div>`;
  main.querySelector('[data-add]').onclick=()=>{const p=JSON.parse(main.querySelector('[data-add-choice]').value);savePiece(p.lesson,p.step);redraw();};
  const list=main.querySelector('.piece-list');
  if(!pieces.length)list.innerHTML='<p class="muted">Your shelf is ready. Add a song above or use “Save piece” while practising.</p>';
  for(const [key,p] of pieces){
    const focus=store.data.focusPieces?.[p.course]===key;
    const card=node(`<section class="workspace-card piece-card"><span class="eyebrow">${esc(p.course)}${focus?' · Current focus':''}</span><h2>${esc(p.title)}</h2><p class="muted">${p.lastPractised?'Last opened for practice: '+esc(new Date(p.lastPractised).toLocaleDateString()):'Ready for your first practice'}${p.settings?.hand?' · '+({both:'Both hands',R:'Right hand',L:'Left hand'}[p.settings.hand]||''):''}${p.settings?.speed?' · '+Math.round(p.settings.speed*100)+'% tempo':''}${p.settings?.loop?` · Bars ${p.settings.from}–${p.settings.to}`:''}</p><label class="field">My stage<select data-stage>${STAGES.map(s=>`<option ${p.stage===s?'selected':''}>${s}</option>`).join('')}</select></label><label class="field">Practice note<textarea data-note maxlength="1000" rows="2" placeholder="Something to listen for next time"></textarea></label><div class="workspace-actions"><button class="btn primary" data-play>Practise</button><button class="pill" data-focus ${focus?'disabled':''}>${focus?'Current focus':'Set as current focus'}</button><button class="text-btn danger" data-remove>Remove</button></div></section>`);
    card.querySelector('[data-note]').value=p.note||'';
    card.querySelector('[data-note]').oninput=e=>updatePiece(key,{note:e.target.value});
    card.querySelector('[data-stage]').onchange=e=>updatePiece(key,{stage:e.target.value});
    card.querySelector('[data-focus]').onclick=()=>{focusPiece(key);redraw();};
    card.querySelector('[data-remove]').onclick=()=>{removePiece(key);redraw();};
    card.querySelector('[data-play]').onclick=()=>{store.setting('course',p.course);go(`#/play/${p.lesson}/${p.step}`);};
    list.appendChild(card);
  }
}
export function mountTechnique(root,{onBack}) {
  const main=shell(root,'Technique videos',onBack);
  main.innerHTML='<p>Optional demonstrations from piano teachers. These links open the teacher’s full lesson in a new tab; lengths vary and internet is required.</p><div class="technique-list"></div>';
  for(const v of TECHNIQUE){const card=node(`<article class="workspace-card"><span class="eyebrow">${esc(v.teacher)}</span><h2>${esc(v.title)}</h2><p>${esc(v.note)}</p><a class="pill" href="${esc(v.url)}" target="_blank" rel="noopener noreferrer">Watch teacher lesson ↗</a></article>`);main.querySelector('.technique-list').appendChild(card);}
}
