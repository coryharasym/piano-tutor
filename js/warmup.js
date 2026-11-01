// Original, self-paced warm-ups. They never award lesson progress or daily streaks.
import { COURSES, validCourse } from './courses.js';
import { parseSeq, midiToName } from './theory.js';
const read=(title,body)=>({t:'read',title,body});
const repeat=(seq,n=2)=>Array(n).fill(seq).join(' ');
function fingerPattern(notes,fingers,dur='q') { return notes.map((n,i)=>`${n}/${dur}/${fingers[i]}`).join(' '); }
function rangeFor(step) {
 const ns=[step.rh,step.lh].filter(Boolean).flatMap(s=>parseSeq(s).flatMap(e=>e.midis||[]));
 return [midiToName(Math.min(...ns)),midiToName(Math.max(...ns))];
}
function exercise(title,say,rh,lh,options) {
 const step={t:'play',title,say,...(rh&&{rh}),...(lh&&{lh}),tempo:60,time:'4/4',reps:2,hint:true,names:true,keyLabels:'all',showFingers:true,...options};
 step.range=rangeFor(step);return step;
}
const KEYS={
 C:{rh:['C4','D4','E4','F4','G4','A4','B4','C5'],lh:['C3','D3','E3','F3','G3','A3','B3','C4'],rf:[1,2,3,1,2,3,4,5]},
 G:{rh:['G4','A4','B4','C5','D5','E5','F#5','G5'],lh:['G3','A3','B3','C4','D4','E4','F#4','G4'],rf:[1,2,3,1,2,3,4,5]},
 F:{rh:['F4','G4','A4','Bb4','C5','D5','E5','F5'],lh:['F3','G3','A3','Bb3','C4','D4','E4','F4'],rf:[1,2,3,4,1,2,3,5]},
};
function scale(notes,fingers) {
 const up=notes.slice(0,-1).map((n,i)=>`${n}/q/${fingers[i]}`);
 const down=notes.slice(0,-1).reverse().map((n,i)=>`${n}/q/${fingers[notes.length-2-i]}`);
 // 7 ascending + top + 7 descending + rest = 16 quarter-note beats.
 return [...up,`${notes.at(-1)}/q/${fingers.at(-1)}`,...down,'r/q'].join(' ');
}
function twoOctave(hand) {
 const start=hand==='R'?60:48;
 const offsets=[0,2,4,5,7,9,11,12,14,16,17,19,21,23,24];
 const fingers=hand==='R'?[1,2,3,1,2,3,4,1,2,3,1,2,3,4,5]:[5,4,3,2,1,3,2,1,4,3,2,1,3,2,1];
 const up=offsets.map((n,i)=>`${midiToName(start+n)}/8/${fingers[i]}`);
 const down=offsets.slice(0,-1).reverse().map((n,i)=>`${midiToName(start+n)}/8/${fingers[offsets.length-2-i]}`);
 return [...up,...down,'r/q.'].join(' ');
}
export function buildWarmup(done={},course='beginner',date='') {
 course=validCourse(course);
 const rhReady=course!=='beginner'||!!done['rh-c-position'];
 const lhReady=course!=='beginner'||!!done['lh-c-position'];
 const together=!!(done['hands-together']||done['int-unequal']||done['adv-readiness']);
 const familiarScales=!!(done['c-scale']||done['int-major-scales']||done['adv-major-keys']);
 const widerScales=course==='advanced'&&!!(done['int-major-scales']||done['adv-major-keys']);
 const otherKeys=!!(done['g-f-scales']||done['int-major-scales']||done['adv-major-keys']);
 const choices=otherKeys&&rhReady&&lhReady&&!widerScales?['C','G','F']:['C'];
 const index=[...date].reduce((n,c)=>n+c.charCodeAt(0),0)%choices.length;
 const key=choices[index],k=KEYS[key];
 const pattern=[0,1,2,3,4,3,2,1,0,1,2,3,2,1,0,0];
 let rh=rhReady?fingerPattern(pattern.map(i=>k.rh[i]),pattern.map(i=>i+1)):repeat('C4/q/2 r/q',8);
 let lh=lhReady?fingerPattern(pattern.map(i=>k.lh[i]),pattern.map(i=>5-i)):repeat('C4/q/2 r/q',8);
 let description=rhReady&&lhReady?'Use familiar five-finger patterns. Let the arm and hand stay comfortable; keep the sound quiet and even.':'Start with a gentle Middle C in each hand. A hand that has learned C position can use its familiar five-finger pattern; the other stays on Middle C.';
 if(familiarScales&&rhReady&&lhReady){
  rh=widerScales?twoOctave('R'):scale(k.rh,k.rf);
  lh=widerScales?twoOctave('L'):scale(k.lh,[5,4,3,2,1,3,2,1]);
  description=widerScales?'Use your familiar two-octave C-major scale at an easy pace. Keep the crossings small and unhurried.':'Use your familiar '+key+'-major scale at an easy pace. Prepare the thumb crossing without twisting or reaching.';
 }
 const staff=course!=='beginner'||!!done['treble-reading'];
 const options={key,staff};
 const rhTitle=rhReady?'Right hand: quiet, even notes':'Right hand: an easy Middle C';
 const lhTitle=lhReady?'Left hand: quiet, even notes':'Left hand: an easy Middle C';
 const easy='Find Middle C just to the left of the middle group of two black keys. Use finger 2 (index finger), play gently, then release during each rest. No stretch is needed.';
 const plays=[exercise(rhTitle,rhReady?description:easy,rh,null,options),exercise(lhTitle,lhReady?description:easy,null,lh,options)];
 // Coordination stays inside the known five-finger position, even after scale work.
 let crh,clh;
 if(together&&rhReady&&lhReady){
  crh=fingerPattern(pattern.map(i=>k.rh[i]),pattern.map(i=>i+1));
  clh=fingerPattern(pattern.map(i=>k.lh[i]),pattern.map(i=>5-i));
 } else {
  crh=repeat(`${rhReady?k.rh[0]:'C4'}/q/${rhReady?1:2} r/q`,8);
  clh=repeat(`r/q ${lhReady?k.lh[0]:'C4'}/q/${lhReady?5:2}`,8);
 }
 plays.push(exercise(together&&rhReady&&lhReady?'Hands together: an easy shared pulse':'Take turns between the hands',
  together&&rhReady&&lhReady?'Use the same quiet five-note pattern in both hands. The fingering is different in each hand. Separate the hands again whenever that feels easier.':'Let the right hand play, release, then let the left hand answer. Keep the rests spacious. If both use Middle C, move one hand away before the other plays.',crh,clh,options));
 const skips=!!(done['steps-skips']||done['int-arpeggios']||done['adv-arpeggio-travel']);
 const finishRh=rhReady?skips?repeat(`${k.rh[0]}/q/1 ${k.rh[2]}/q/3 ${k.rh[4]}/h/5 ${k.rh[2]}/q/3 ${k.rh[1]}/q/2 ${k.rh[0]}/h/1`):fingerPattern(pattern.map(i=>k.rh[i]),pattern.map(i=>i+1)):repeat('C4/h/2',8);
 plays.push(exercise('Finish with a small musical phrase',rhReady?'Keep this familiar pattern soft. Give it a gentle direction and a calm ending. Listen for evenness and release unnecessary pressure.':'Use finger 2 on Middle C. Let each note ring gently for two beats, then release it before playing again. Pause whenever needed.',finishRh,null,options));
 return {
  id:'warmup',warmup:true,daily:true,course,title:COURSES[course].label+' warm-up',summary:'About three minutes of gentle, familiar playing.',
  steps:[read('Settle in before playing',`<p>Take about 20 seconds to settle at your piano. Sit comfortably with your feet supported and let your shoulders relax. Keep your wrists comfortable and your fingers close to the keys.</p><p>This is a self-paced warm-up of about three minutes, including brief pauses. Start gently, listen for an even sound and use familiar movements. Stop if anything hurts; avoid forcing a stretch or chasing speed.</p><p>${description}</p><p>Each exercise has two short rounds. Use Listen and its slower speed if helpful. You can repeat, shorten or leave the warm-up at any time. The microphone is optional; on-screen keys work too.</p>`),
   ...plays,read('Ready for practice',`<p>Let your hands rest briefly. Did the notes feel easy, and did the pulse stay calm? Repeat any comfortable pattern with Previous step if you would like more time.</p><p>Use Finish warm-up to continue. Warm-ups stay separate from lesson completion, personal-best times and your Daily Practice streak.</p>`)],
 };
}
