// Personal practice records stay in the same device-local store and progress backup.
import { store } from './store.js';
import { UNITS, findLesson, nextLesson } from './lessons/index.js';
import { songbook, songTitle } from './print.js';
import { validCourse } from './courses.js';

export const STAGES = ['Learning', 'Polishing', 'Maintaining'];
export const SESSION_MINUTES = { 5: [1, 1, 2, 1], 15: [3, 3, 6, 3], 30: [3, 5, 15, 7] };
export const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const pieceKey = (lesson, step) => `${lesson}:${step}`;
export function courseOf(id) { const f = findLesson(id); return validCourse(f?.unit.course || f?.lesson.course); }
export function playable(ref) {
  const f = ref && findLesson(ref.lesson);
  return f && f.lesson.steps[ref.step]?.t === 'play' ? f : null;
}
export function savedPiece(lesson, step) { return store.data.repertoire?.[pieceKey(lesson, step)]; }
export function savePiece(lesson, step) {
  const f = playable({lesson, step});
  if (!f || f.lesson.daily || f.lesson.warmup || f.lesson.recital) return null;
  const key = pieceKey(lesson, step);
  store.data.repertoire = { ...store.data.repertoire, [key]: {
    stage: 'Learning', note: '', settings: {}, addedAt: new Date().toISOString(),
    ...store.data.repertoire?.[key], lesson, step, course: courseOf(lesson),
    title: songTitle(f.lesson, f.lesson.steps[step]),
  }};
  store.save();
  return key;
}
export function updatePiece(key, changes) {
  if (!store.data.repertoire?.[key]) return;
  store.data.repertoire[key] = { ...store.data.repertoire[key], ...changes };
  store.save();
}
export function removePiece(key) {
  delete store.data.repertoire[key];
  for (const [course, focus] of Object.entries(store.data.focusPieces || {})) if (focus === key) delete store.data.focusPieces[course];
  store.save();
}
export function focusPiece(key) {
  const piece = store.data.repertoire?.[key];
  if (piece) { store.data.focusPieces = { ...store.data.focusPieces, [piece.course]: key }; store.save(); }
}
export function rememberSettings(lesson, step, changes) {
  const piece = savedPiece(lesson, step);
  if (piece) updatePiece(pieceKey(lesson, step), { settings: { ...piece.settings, ...changes } });
}
export function visitPiece(lesson, step) {
  const piece = savedPiece(lesson, step);
  if (piece) updatePiece(pieceKey(lesson, step), { lastPractised: new Date().toISOString() });
}
export function pieceOptions(course) {
  return songbook(course).map(({lesson, stepIndex}) => ({lesson:lesson.id, step:stepIndex, title:songTitle(lesson, lesson.steps[stepIndex])}));
}
export function sessionPlan(course, minutes) {
  course = validCourse(course);
  const allocations = SESSION_MINUTES[minutes] || SESSION_MINUTES[15];
  const done = store.data.done;
  const saved = store.data.lastByCourse?.[course];
  const next = nextLesson(done, null, course);
  const current = saved && findLesson(saved.lesson) && !findLesson(saved.lesson).lesson.hymn && !done[saved.lesson] && courseOf(saved.lesson) === course
    ? {lesson:saved.lesson, step:Math.min(saved.step || 0, findLesson(saved.lesson).lesson.steps.length-1)}
    : next ? {lesson:next.id, step:0} : null;
  const learned = UNITS.filter(u=>u.course===course).flatMap(u=>u.lessons).filter(l=>done[l.id]&&!l.recital);
  const reviewLesson = [...learned].reverse().find(l=>l.steps.some(s=>s.t==='play'&&!s.song&&!s.anyNote));
  const review = reviewLesson ? {lesson:reviewLesson.id, step:reviewLesson.steps.findIndex(s=>s.t==='play'&&!s.song&&!s.anyNote)} : null;
  const focus = store.data.repertoire?.[store.data.focusPieces?.[course]];
  const familiar = focus && playable(focus) ? {lesson:focus.lesson, step:focus.step} : pieceOptions(course).find(p=>done[p.lesson]) || null;
  const revisit = store.data.nextPractice?.[course]?.target;
  const target = playable(revisit) && courseOf(revisit.lesson) === course ? revisit : current;
  return [
    {title:'Warm-up', target:{lesson:'warmup',step:0}},
    {title:'Review', target:review, empty:'Complete a skill lesson to add it here.'},
    {title:'Current learning', target, empty:'Choose a lesson from your course.'},
    {title:'A familiar piece', target:familiar, empty:'Add a song to My Pieces and set it as your current focus.'},
  ].map((stage,i)=>({...stage,minutes:allocations[i],status:'pending'}));
}
export function startSession(course, minutes) {
  course = validCourse(course); minutes = Number(minutes);
  if (!SESSION_MINUTES[minutes]) minutes = 15;
  const session = { course, minutes, startedAt:new Date().toISOString(), stages:sessionPlan(course,minutes), opened:null };
  store.data.sessions = {...store.data.sessions,[course]:session};
  store.save(); return session;
}
export function changeStage(course, index, status) {
  const session = store.data.sessions?.[validCourse(course)];
  if (session?.stages[index] && ['done','skipped','pending'].includes(status)) { session.stages[index].status=status; store.save(); }
}
export function finishSession(course, note, target) {
  course = validCourse(course);
  const session = store.data.sessions?.[course];
  if (!session) return;
  store.data.nextPractice = {...store.data.nextPractice,[course]:{note:String(note).slice(0,1000),target:playable(target)?{lesson:target.lesson,step:target.step}:null}};
  store.data.sessionHistory = [...(store.data.sessionHistory || []),{
    course, plannedMinutes:session.minutes, startedAt:session.startedAt, finishedAt:new Date().toISOString(),
    completed:session.stages.filter(s=>s.status==='done').length, skipped:session.stages.filter(s=>s.status==='skipped').length,
  }].slice(-100);
  delete store.data.sessions[course]; store.save();
}
