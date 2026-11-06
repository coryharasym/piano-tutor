import {midiToName} from './theory.js';
const generator=seed=>{let n=seed+1;return()=>{n=(Math.imul(n,1664525)+1013904223)>>>0;return n/4294967296;};};
export function labId(kind,course){return `${course==='intermediate'?'int-':course==='advanced'?'adv-':''}lab-${kind}`;}
export function labSettings(done={},course='beginner') {
 const mature=course!=='beginner';return {eighths:mature||!!done['eighth-notes'],rests:mature||!!done['rests-34'],wide:mature||!!done.landmarks,hands:mature||!!done['held-bass-bridge']};
}
export function rhythmPattern(done={},course='beginner',variant=0) {
 const settings=labSettings(done,course),rand=generator(variant+17),beats=[];let at=0;
 for(let bar=0;bar<4;bar++)for(let beat=0;beat<4;beat++){
  if(settings.rests&&bar>0&&beat===2&&rand()<.35){at++;continue;}
  beats.push(at);if(settings.eighths&&rand()<.35)beats.push(at+.5);at++;
 }
 return {beats,total:16,bpm:60,description:settings.eighths?'Quarter notes, paired eighths and learned rests':'Quarter notes: four steady beats per bar'};
}
export function scoreRhythm(expected,taps,tolerance=.22) {
 const remaining=[...taps];let matched=0;
 for(const t of expected){let best=-1,d=Infinity;remaining.forEach((tap,i)=>{if(Math.abs(tap-t)<d){best=i;d=Math.abs(tap-t);}});if(d<=tolerance){matched++;remaining.splice(best,1);}}
 return {matched,total:expected.length,extra:remaining.length,missed:expected.length-matched};
}
export function buildLab(kind,done={},course='beginner',variant=0) {
 const settings=labSettings(done,course),rand=generator(variant+101),pick=n=>Math.floor(rand()*n);
 const isEar=kind==='ear',pool=isEar||!settings.wide?[60,62,64,65,67]:[60,62,64,65,67,69,71,72];
 const count=isEar?(course==='beginner'?4:6):12;let pos=pick(pool.length),notes=[];
 for(let i=0;i<count;i++){pos=Math.max(0,Math.min(pool.length-1,pos+[-1,0,1][pick(3)]));notes.push(pool[pos]);}
 const rh=notes.map((n,i)=>`${midiToName(n)}/${isEar?'q':i%3===2?'h':'q'}`).join(' ');
 return {id:labId(kind,course),course,daily:true,title:isEar?'Listen and Copy':'Fresh musical reading',summary:'Short practice, separate from course completion.',steps:[
 {t:'read',title:isEar?'Use your ears first':'Preview, then make one musical attempt',body:isEar?'<p>Tap Listen, hum the short phrase, then find it on the piano. The notes and key targets stay hidden unless you choose Show me. Begin by hearing whether the tune rises, falls or repeats. Listen again as often as you need; this is ear practice, not a memory exam.</p>':'<p>Spend about 30 seconds finding the clef, time signature, starting notes and repeated shapes. Tap the rhythm before playing. Choose a slow pulse and keep moving after a small mistake. Ordinary practice waits for pitches; use Flow for a continuous attempt. A new example is deliberately easier than your main pieces.</p>'},
 {t:'play',title:isEar?'Copy the hidden phrase':'A new four-bar phrase',rh,...(!isEar&&settings.hands?{lh:'C3/w/5 F3/w/2 G3/w/1 C3/w/5'}:{}),ear:isEar,staff:true,names:false,hint:false,noDemo:!isEar,keyLabels:'all',tempo:60,time:'4/4',range:[settings.hands&&!isEar?'C3':'C4','C5'],reps:1},
 ...(isEar&&(course!=='beginner'||done['minor-chords'])?[{t:'quiz',q:'Listen to the chord. Is it major or minor?',listen:variant%2?'[C4 Eb4 G4]/w':'[C4 E4 G4]/w',options:['Major','Minor'],answer:variant%2,explain:'The root and fifth stay the same. The third changes the chord quality.'}]:[]),
 {t:'read',title:'Notice one thing to improve',body:isEar?'<p>Was the direction right? Which note was difficult to find? Sing that small part and try again. Then invent your own four-beat answer on C, D and E, ending on C; there is more than one valid reply. The screen may help you check, but come back later and try without it.</p>':'<p>Did you keep counting? Did long notes last their full length? Could you prepare the next group? Note one repair, then move to another fresh example instead of memorising this one as a reading test.</p>'}
 ]};
}
const MELODY='G4/q E4/q E4/q D4/q E4/q G4/q G4/h A4/q A4/q C5/q A4/q A4/q G4/q G4/h F4/h D4/h C4/w';
const PLAN=['C','C','F','C','G7','C'];
const CHORDS={C:'[C3 E3 G3]/w/5-3-1',F:'[C3 F3 A3]/w/5-2-1',G7:'[B2 F3 G3]/w/5-2-1'};
export const HYMN_STAGES=['Melody alone','Add a bass line','Add quiet chords','Choose broken chords','An introduction and ending','Play from chord symbols'];
export function buildHymn(stage=0,course='beginner') {
 stage=Math.max(0,Math.min(5,stage));
 const bass='C3/w/5 C3/w/5 F3/w/2 C3/w/5 G2/w/5 C3/w/5';
 const blocked=PLAN.map(c=>CHORDS[c]).join(' ');
 const broken=PLAN.map(c=>c==='C'?'C3/q/5 G3/q/1 E3/q/3 G3/q/1':c==='F'?'C3/q/5 A3/q/1 F3/q/2 A3/q/1':'B2/q/5 G3/q/1 F3/q/2 G3/q/1').join(' ');
 const intro=stage===4;const rh=(intro?'F4/h D4/h C4/w ':'')+MELODY;
 const lh=stage===0?undefined:stage===1?bass:stage===3?broken:(intro?CHORDS.G7+' '+CHORDS.C+' ':'')+blocked;
 return {id:labId('hymn-'+stage,course),course,daily:true,title:'Hymn pathway: '+HYMN_STAGES[stage],summary:'Jesus Loves Me: opening with a teaching cadence.',steps:[
 {t:'read',title:HYMN_STAGES[stage],body:`<p>This short study uses the opening of <b>Jesus Loves Me</b>, followed by a teaching cadence. Keep this familiar melody as you change one accompaniment skill.</p><p>The six-bar chord plan is <b>C | C | F | C | G7 | C</b>. ${stage===0?'Play only the melody; plan its hand movements before starting.':stage===1?'Practise the bass alone first. Then keep it quiet and hold each bass for the full bar.':stage===2?'Name each chord and prepare its compact shape without stretching. Keep the melody louder.':stage===3?'Move through the chord tones evenly and keep every accompaniment note soft.':stage===4?'Two added bars, G7 then C, form a short introduction. Keep the intended tempo and leave a clear breath before the tune. The final G7–C is the ending.':'Read the chord names and choose bass notes, blocked chords, or a broken pattern. The printed bass is one reference version; other comfortable voicings are valid independent practice.'}</p><p>${stage===5?'Cover the written bass and try two different textures. Use the recorder to judge clarity; the pitch checker accepts only the written reference.':'Begin hands separately, then join one bar at a time. Use no pedal until the voices are clear.'}</p>`},
 ...(lh?[{t:'play',title:'Accompaniment alone',lh,staff:true,names:true,showFingers:true,tempo:60,range:['G2','C5']}]:[]),
 {t:'play',title:'Jesus Loves Me: '+HYMN_STAGES[stage],rh,lh,song:true,staff:true,names:true,tempo:60,range:['G2','C5'],chordPlan:(intro?['G7','C',...PLAN]:PLAN).join(' | ')},
 {t:'read',title:'One listening question',body:'<p>Could a singer follow the pulse and find the entry? Was the melody clear above the bass? Mark one thing to practise before choosing the next texture. A recognized pitch is not a judgement of balance or interpretation.</p>'}
 ]};
}
