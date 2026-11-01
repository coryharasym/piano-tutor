// Original piano teaching arrangements of retained public-domain hymn editions.
import { SCORES as OLD } from './intermediate-scores.js';
import { SCORES as NEW } from './advanced-scores.js';
import { sequence, timed, crop, play, read, review } from './intermediate-tools.js';
import { buildPractice } from '../practice.js';
import { midiToName, toMidi } from '../theory.js';
export { play, read, review, crop };
export const SCORES = {...OLD,...NEW};
// Checked public-domain texts; underscores are intentional melisma continuations.
const WORDS={
 st_agnes:{lyrics:'Je- sus, the ve- ry thought of thee / with sweet- ness fills the breast; / but sweet- er far thy face to see, / and in thy pre- sence rest.',verses:['O hope of eve- ry con- trite heart, / O joy of all the meek, / to those who fall, how kind thou art! / How good to those who seek!']},
 nicaea:{lyrics:'Ho- ly, ho- ly, ho- ly! / Lord God Al- might- y! / Ear- ly in the morn- ing / our song shall rise to thee. _ / Ho- ly, ho- ly, ho- ly! / Mer- ci- ful and might- y! / God in three Per- sons, / bless- ed Trin- i- ty!'},
 eventide:{lyrics:'A- bide with me: fast falls the e- ven- tide; / the dark- ness deep- ens; Lord, with me a- bide. / When oth- er help- ers fail and com- forts flee, / Help of the help- less, O a- bide with me.'},
 blessed_assurance:{lyrics:'Bless- ed as- sur- ance, Je- sus is mine! / Oh, what a fore- taste of glo- ry di- vine! / Heir of sal- va- tion, pur- chase of God, / born of His Spir- it, washed in His blood. / This is my sto- ry, this is my song, / prais- ing my Sav- iour all the day long; / this is my sto- ry, this is my song, / prais- ing my Sav- iour all the day long.'},
};
const FLAT_KEYS = ['F','Bb','Eb','Ab','Dm','Gm','Cm','Fm'];
export const spelling = (m,key) => midiToName(m,FLAT_KEYS.includes(key));
export function transposeStep(step,shift,key) {
 const out={...step,key};
 for(const hand of ['rh','lh']) if(step[hand]) out[hand]=step[hand].replace(/([A-G][#b]?\d)/g,n=>spelling(toMidi(n)+shift,key));
 return out;
}
export function voiceAt(events,at) {
 let beat=0;
 for(const event of events) {if(at>=beat-1e-7&&at<beat+event.beats-1e-7)return event.midi;beat+=event.beats;}
 return null;
}
function compact(m,below) {while(m>below)m-=12;while(m<below-12)m+=12;return m;}
export function singleVoice(id,voice) {
 const s=SCORES[id];return play(s.title+': '+voice,'Sing this voice, then play it alone. Notice its direction and its place in the harmony.',
 voice==='Bass'||voice==='Tenor'?undefined:sequence(s.voices[voice],s.time,s.pickup),
 voice==='Bass'||voice==='Tenor'?sequence(s.voices[voice],s.time,s.pickup):undefined,
 {key:s.key,time:s.time,pickup:s.pickup||undefined,source:s.source,song:false});
}
// A melody-led reduction, not a claim to reproduce independent SATB durations.
// Soprano onsets/lengths stay intact; supporting tones rearticulate with the melody.
export function arrange(id,texture='chorale',opts={}) {
 const s=SCORES[id], total=s.voices.Soprano.reduce((a,e)=>a+e.beats,0);
 const rh=[],lh=[];let at=0;
 for(const e of s.voices.Soprano) {
   const upper=e.midi==null?[]:[e.midi];
   if(upper.length&&texture==='octaves')upper.unshift(e.midi-12);
   if(upper.length&&(texture==='chorale'||texture==='lyrical')) {
     const alto=voiceAt(s.voices.Alto,at);
     if(alto!=null&&(texture==='chorale'||e.beats>=1.5)) {const a=compact(alto,e.midi);if(a!==e.midi)upper.unshift(a);}
   }
   rh.push({midis:upper,notes:upper.map(m=>spelling(m,s.key)),beats:e.beats});
   at+=e.beats;
 }
 if(['chorale','lyrical','octaves'].includes(texture)) {
   at=0;
   for(const e of s.voices.Soprano) {
     const bass=voiceAt(s.voices.Bass,at),tenor=voiceAt(s.voices.Tenor,at);
     const notes=bass==null?[]:[bass];
     if(bass!=null&&tenor!=null) {let t=tenor;while(t<bass)t+=12;while(t>bass+12)t-=12;if(t!==bass)notes.push(t);}
     // Keep hand assignments disjoint: the same physical key cannot belong to both hands.
     const upper=rh[lh.length].midis;
     if(upper.length)while(notes.length&&Math.max(...notes)>=Math.min(...upper))for(let k=0;k<notes.length;k++)notes[k]-=12;
     notes.sort((a,b)=>a-b);
     lh.push({midis:notes,notes:notes.map(m=>spelling(m,s.key)),beats:e.beats});at+=e.beats;
   }
 } else {
   // Source harmonies sampled each eighth; broad patterns retain the current bass.
   for(let beat=0,index=0;beat<total-1e-7;beat+=.5,index++) {
     let bass=voiceAt(s.voices.Bass,beat);
     if(bass==null){lh.push({midis:[],beats:Math.min(.5,total-beat)});continue;}
     while(bass<36)bass+=12;while(bass>48)bass-=12;
     const tones=[voiceAt(s.voices.Tenor,beat),voiceAt(s.voices.Alto,beat)].filter(m=>m!=null).map(m=>{while(m<bass+7)m+=12;while(m>bass+19)m-=12;return m;}).sort((a,b)=>a-b);
     const pattern=[bass,tones[0]??bass+7,bass+12,tones.at(-1)??bass+12];
     let midi=pattern[index%4];
     const melody=voiceAt(s.voices.Soprano,beat);
     if(melody!=null)while(midi>=melody)midi-=12;
     lh.push({midi,notes:[spelling(midi,s.key)],beats:Math.min(.5,total-beat)});
   }
 }
 let step=play(s.title,'Learn the melody and bass separately. Keep the melody above the supporting notes.',sequence(rh,s.time,s.pickup),sequence(lh,s.time,s.pickup),
 {key:s.key,time:s.time,pickup:s.pickup||undefined,song:true,source:s.source,tempo:60,arrangement:texture,...WORDS[id],...opts});
 if(opts.shift)step=transposeStep(step,opts.shift,opts.key||s.key);
 return step;
}
export function rangeOf(step) {
 const notes=buildPractice(step).moments.flatMap(m=>m.items.map(i=>i.midi));
 return notes.length?[midiToName(Math.min(...notes)),midiToName(Math.max(...notes))]:['C3','C6'];
}
export function skill(id,title,summary,body,exercises,check,quiz) {
 return {id:'adv-'+id,title,summary,course:'advanced',steps:[read(title,`<p>${body}</p>`),...exercises,
 ...(quiz?[review(...quiz)]:[]),read('Practise independently',`<p>${check}</p><p>Use a short bar loop to repair a passage, then reconnect it to the phrase. The app checks the written pitches; Flow checks note-start timing. Listen for duration, tone, balance and pedal, and check physical ease yourself. Creative alternatives are practised away from the reference-score check.</p>`)]};
}
export function study(id,title,step,focus,task) {
 const p=buildPractice(step),size=step.time.split('/').map(Number).reduce((n,d)=>n*4/d);
 const opening=crop(step,0,Math.min(p.totalBeats,(step.pickup||0)+size*4));
 const instructions=step.arrangement==='flowing'?'The left-hand pattern samples the retained source harmonies at each eighth note. It is an original piano accompaniment.':'This is a melody-led piano reduction: supporting tones change with the melody. Source inner voices may be moved by octaves or rearticulated; study their original rhythms using the source score.';
 return {id:'adv-'+id,title,summary:focus,course:'advanced',steps:[read('Prepare the score',`<p>${focus}</p><p>${instructions}</p><p>Preview the key, meter, pickup and ending. Prepare a stable fingering before adding speed.</p>`),
 {...opening,rh:opening.rh,lh:undefined,song:false,title:'Right hand: voice the melody',say:'Read the upper line first. Where there are two notes, keep the top voice clearer. Release unnecessary pressure.'},
 {...opening,rh:undefined,lh:opening.lh,song:false,title:'Left hand: shape the support',say:'Count aloud and play softly. Move the arm between positions; do not hold a wide stretch.'},
 {...opening,song:false,title:'Join the opening',say:focus},
 {...step,title,say:focus,hint:false},read('Make your own musical decision',`<p>${task}</p><p>Practise the alternative at your piano, then return to the written reference if using the app’s pitch check. Record yourself if possible and describe one audible improvement.</p>`)]};
}
export function recital(unit,title,pieces,criteria) {
 const instructions=read('Prepare a complete performance',`<p>${criteria}</p><p>Choose a tempo at which you can finish comfortably. Mark three restart points, rehearse the opening and ending, then play without stopping. Afterwards assess pulse, clarity, phrasing, balance and recovery. Completion records a reference play-through, not a graded qualification or approval of an improvised arrangement.</p>`);
 const steps=[instructions,...pieces.map(s=>({...s,title:'Dress rehearsal: '+s.title,say:criteria,hint:true,final:false})),...pieces.map((s,i)=>({...s,title:pieces.length>1?`Performance ${i+1}: ${s.title}`:'Your recital',say:criteria,hint:false,final:true}))];
 const piece={id:'adv-hymn-'+unit,title,summary:criteria,course:'advanced',hymn:true,unit,unitNumber:+unit.slice(1),steps,recitalSteps:steps};
 return {piece,lesson:{id:'adv-recital-'+unit,title:'Recital: '+title,summary:criteria,course:'advanced',recital:true,choices:[piece],piece,steps}};
}
