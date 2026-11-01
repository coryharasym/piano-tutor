import { parseSeq, beatsOf, midiToName, toMidi } from '../theory.js';
import { buildPractice, playOrder } from '../practice.js';
import { SCORES } from './intermediate-scores.js';
import { PIECES } from './recitals.js';
import { PRACTICE_SONGS } from './songs.js';

const durations = [[4,'w'],[3,'h.'],[2,'h'],[1.5,'q.'],[1,'q'],[.75,'8.'],[.5,'8'],[.25,'16']];
export const read = (title,body) => ({t:'read',title,body});
export const review = (q,options,answer,explain,listen) => ({t:'quiz',q,options,answer,explain,...(listen && {listen})});
export const play = (title,say,rh,lh,extra={}) => ({t:'play',title,say,rh,...(lh&&{lh}),staff:true,names:false,keyLabels:'c',range:['C2','C6'],tempo:64,...extra});

// Serialize actual timed events, splitting notes at measure boundaries with ties.
export function sequence(events, time='4/4', pickup=0, preferFlat=false) {
  const [n,d]=time.split('/').map(Number), size=n*4/d;
  let beat=0, cap=pickup||size; const out=[];
  for(const event of events) {
    let left=event.beats, continuation=false;
    while(left>1e-7) {
      if(beat>=cap-1e-7) {beat=0;cap=size;}
      const room=Math.min(left,cap-beat);
      const pair=durations.find(([b])=>b<=room+1e-7);
      if(!pair) throw Error('Unrepresentable duration '+room);
      const [len,dur]=pair;
      const midis=event.midis|| (event.midi==null?[]:[event.midi]);
      const head=midis.length>1?'['+midis.map((m,i)=>event.notes?.[i]||midiToName(m,preferFlat)).join(' ')+']':midis.length?(event.notes?.[0]||midiToName(midis[0],preferFlat)):'r';
      out.push((continuation&&midis.length?'~':'')+head+'/'+dur);
      left-=len;beat+=len;continuation=true;
    }
  }
  return out.join(' ');
}
export function timed(seq) {
  const events=parseSeq(seq); let beat=0;
  return playOrder(events).map(i=>{const ev=events[i];const at=beat;beat+=beatsOf(ev.dur);return {...ev,beat:at,beats:beatsOf(ev.dur)};});
}
function flatten(seq) { const out=[]; for(const e of timed(seq)) { if(e.tie&&out.length)out.at(-1).beats+=e.beats;else out.push({midis:e.midis||[],notes:e.notes,beats:e.beats}); } return out; }
export function transpose(seq,semitones) {
  return seq.replace(/([A-G][#b]?\d)/g,n=>midiToName(toMidi(n)+semitones));
}
export function crop(step,start,end) {
  const out={...step,lyrics:undefined,verses:undefined,pickup:start===0?step.pickup:undefined};
  for(const hand of ['rh','lh']) if(step[hand]) {
    out[hand]=sequence(timed(step[hand]).filter(e=>e.beat<end&&e.beat+e.beats>start)
      .map(e=>({midis:e.midis||[],notes:e.notes,beats:Math.min(end,e.beat+e.beats)-Math.max(start,e.beat)})),step.time||'4/4',out.pickup||0);
  }
  return out;
}
export function fromExisting(id) {
 const p=PIECES.find(p=>p.id==='hymn-'+id)||PRACTICE_SONGS.find(p=>p.lesson.id==='song-'+id)?.lesson;
 if(!p)throw Error('Unknown tune '+id);
 const step=p.steps.filter(s=>s.t==='play'&&s.rh).at(-1);
 const base={...step,final:false,hint:true,reps:1,staff:true,names:false,keyLabels:'c',range:['C2','C6']};
 // Expand repeats to keep lyric order and permit timed slicing without hidden jumps.
 base.rh=sequence(flatten(step.rh),step.time||'4/4',step.pickup||0);
 if(step.lh)base.lh=sequence(flatten(step.lh),step.time||'4/4',step.pickup||0);
 return base;
}
const allNotesAt=(voice,at)=>{let t=0;for(const ev of voice){if(at>=t-1e-6&&at<t+ev.beats-1e-6)return ev.midi;t+=ev.beats;}return null;};
export function scoreStep(id,texture='bass') {
 const score=SCORES[id]; const [n,d]=score.time.split('/').map(Number); const size=n*4/d;
 const total=score.voices.Soprano.reduce((a,e)=>a+e.beats,0);
 const rh=sequence(score.voices.Soprano,score.time,score.pickup);
 const lh=[];
 for(let at=0;at<total-1e-6;) {
   const len=Math.min(at===0&&score.pickup?score.pickup:size,total-at);
   const bass=allNotesAt(score.voices.Bass,at); const upper=['Tenor','Alto'].map(v=>allNotesAt(score.voices[v],at)).filter(m=>m!=null);
   let low=bass;
   if(low!=null){while(low<43)low+=12;while(low>55)low-=12;}
   const chord=[...new Set([low,...upper.map(m=>{let v=low+(m-low+120)%12;return v;})].filter(m=>m!=null))].sort((a,b)=>a-b);
   // Keep the left hand within a seventh. Drop a wide upper tone rather than stretching.
   const compact=chord.filter(m=>m-chord[0]<=10).slice(0,3);
   if(low==null)lh.push({midis:[],beats:len});
   else if(texture==='broken' && len>=3) {
     const pattern=[compact[0],compact.at(-1),compact[Math.min(1,compact.length-1)],compact.at(-1)];
     const unit=score.time.endsWith('/8')?.5:1;
     for(let k=0;k<len-1e-6;k+=unit)lh.push({midi:pattern[Math.round(k/unit)%4],beats:Math.min(unit,len-k)});
   } else lh.push({midis:texture==='chords'?compact:[low],beats:len});
   at+=len;
 }
 return play(score.title,'Read the melody first, then bring in the accompaniment softly.',rh,sequence(lh,score.time,score.pickup),{key:score.key,time:score.time,pickup:score.pickup||undefined,song:true,tempo:score.time==='9/8'?84:64,source:score.source});
}
// New accompaniments for familiar beginner melodies, using explicit teaching harmonies.
const CHORDS={C:[48,52,55],F:[48,53,57],G:[47,50,55],D:[50,54,57],A:[49,52,57],Am:[48,52,57],Dm:[50,53,57],Em:[47,52,55],G7:[47,53,55],D7:[48,54,57],Bb:[50,53,58]};
export function accompany(base,chart,texture='bass') {
 const {totalBeats}=buildPractice(base);const [n,d]=(base.time||'4/4').split('/').map(Number),size=n*4/d;
 const out=[];let at=0,bar=0;
 while(at<totalBeats-1e-6) {
   const len=Math.min(at===0&&base.pickup?base.pickup:size,totalBeats-at);
   const symbols=[].concat(chart[Math.min(bar,chart.length-1)]);
   for(const symbol of symbols) {
     const chord=CHORDS[symbol];if(!chord)throw Error('Unknown harmony '+symbol);
     const segment=len/symbols.length;
     if(texture==='broken'&&segment>=2)for(let k=0;k<segment-1e-6;k+=.5)out.push({midi:chord[[0,2,1,2][Math.round(k*2)%4]],beats:Math.min(.5,segment-k)});
     else out.push({midis:texture==='chords'?chord:[chord[0]],beats:segment});
   }
   at+=len;bar++;
 }
 return {...base,lh:sequence(out,base.time||'4/4',base.pickup||0,['F','Bb','Eb','Dm'].includes(base.key)),reps:1};
}
export function lesson(id,title,summary,body,exercises,check,ear) {
 return {id:'int-'+id,title,summary,course:'intermediate',steps:[read(title,body),...exercises,
 ...(ear?[review(...ear)]:[]),read('Listen and check',`<p>${check}</p><p>The app checks pitches. Use Flow for note-start timing; judge held notes, physical ease, balance and pedal by listening. Repeat a short passage before increasing speed.</p>`)]};
}
export function hymnStudy(id,title,step,focus,check) {
 const total=buildPractice(step).totalBeats;const [n,d]=(step.time||'4/4').split('/').map(Number);const size=n*4/d;
 const cut=Math.min(total, (step.pickup||0)+size*4);
 const opening=crop(step,0,cut);
 const hands=[play('Melody alone',focus,opening.rh,null,{...opening,lh:undefined,song:false,title:'Melody alone',say:focus}),play('Accompaniment alone','Play the left hand softly. Count through the held notes and rests.',undefined,opening.lh,{...opening,rh:undefined,song:false,title:'Accompaniment alone',say:'Play the left hand softly. Count through the held notes and rests.'})];
 return {id:'int-'+id,title,summary:focus,course:'intermediate',steps:[read('What to listen for',`<p>${focus}</p><p>Prepare the opening with separate hands. Then use Play along, choose the hand you want to practise, and loop the troublesome bars. Count the pickup as bar 1 in the loop selector.</p>`),...hands,play('Opening together',focus,opening.rh,opening.lh,{...opening,song:false,title:'Opening together',say:focus}),{...step,t:'play',title,titleKey:id,song:true,say:focus,hint:false},read('Your musical check',`<p>${check}</p><p>Play again without the demonstration. Explain what you changed and whether it sounded better.</p>`)]};
}
export function recital(unit,title,steps,criteria) {
 const id='int-recital-'+unit;
 const performances=steps.map((s,i)=>({...s,t:'play',title:steps.length>1?`Performance ${i+1}: ${s.title}`:'Your recital',song:true,final:true,hint:false,say:'Take a breath, prepare the starting notes, and play through. Keep going after a small mistake. '+criteria}));
 const recitalSteps=[read('Prepare your recital',`<p>${criteria}</p><p>Choose a comfortable tempo. Practise difficult bars separately, then reconnect them. Make one uninterrupted run before marking your recital complete. Completion records a play-through, not a certified grade.</p>`),...steps.map(s=>({...s,title:'Dress rehearsal: '+s.title,final:false,hint:true,song:true,say:criteria})),...performances];
 const piece={id:'int-hymn-'+unit,title,summary:criteria,course:'intermediate',hymn:true,unit,unitNumber:+unit.slice(1),steps:recitalSteps,recitalSteps};
 return {lesson:{id,title:'Recital: '+title,summary:criteria,recital:true,course:'intermediate',choices:[piece],piece,steps:recitalSteps},piece};
}
