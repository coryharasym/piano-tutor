// Traditional tune; source transcription and adaptation notes are retained in
// sources/give-me-jesus/. The bass and teaching arrangement are newly authored.
const pickup = 'A4/8/4 G4/8/3';
const bars = [
 'G4/q/3 E4/q/1 G4/8/3 A4/q./4',
 'C4/h./1 E4/8/3 D4/8/2',
 'D4/q/2 C4/q/1 E4/8/3 G4/q./5',
 'G4/h./3 A4/8/4 G4/8/3',
 'G4/q/3 E4/q/1 G4/8/3 A4/q./4',
 'C4/h/1 G4/q/5 F4/q/4',
 'C4/h/1 C4/h/1',
 '~C4/h E4/q/3 G4/q/5',
 'G4/h/1 A4/h/2',
 'B4/h/3 A4/q/2 G4/q/1',
 'C5/h/3 D5/h/4',
 'E5/h/5 E5/q/5 D5/q/4',
 'C5/q/3 A4/h/1 C5/q/3',
 'G4/h/5 E4/q/3 D4/q/2',
 'C4/h/1 C4/h/1',
 '~C4/h. r/q',
];
export const GIVE_ME_JESUS_MELODY = [pickup,...bars].join(' ');
const bass = ['C3','C3','G3','C3','C3','F3','C3','C3','C3','G3','F3','C3','F3','G3','C3'];
export const GIVE_ME_JESUS_BASS = 'r/q '+bass.map(n=>`${n}/w/${n==='C3'?5:n==='F3'?2:1}`).join(' ')+' ~C3/w';
export const GIVE_ME_JESUS_WORDS = 'In the morn- ing when I rise, / in the morn- ing when I rise, / in the morn- ing when I rise, / give me Je- sus. / Give me Je- _ sus, / give me Je- _ sus. / You may have all this world, / give me Je- sus.';
const source='https://hymnary.org/tune/give_me_jesus_spiritual';
const shared={key:'C',time:'4/4',pickup:1,staff:true,names:false,keyLabels:'c',showFingers:true,tempo:64,range:['C3','E5'],source};
const starts=new Set([0,7,14,21,26,31,36,42]);
const ends=new Set([6,13,20,25,30,35,41,46]);
const shaped=GIVE_ME_JESUS_MELODY.split(' ').map((token,i)=>
 `${i===0?'!mp ':i===26?'!mf ':i===42?'!p ':''}${starts.has(i)?'(':''}${token}${ends.has(i)?')':''}`
).join(' ');
export const GIVE_ME_JESUS = {
 id:'hymn-give-me-jesus',hymn:true,unit:'ux',unitNumber:5,course:'beginner',
 title:'Give Me Jesus',summary:'A gentle spiritual: shape the melody over a quiet bass.',
 steps:[
  {t:'read',title:'Let the melody sing',body:`<p><b>Give Me Jesus</b> is the traditional African American spiritual beginning “In the morning when I rise”. This optional late-beginner arrangement is in C major. It uses the traditional tune with a new, simple bass part.</p><p>Begin with two eighth notes on <b>beat 4</b>: A, then G. Keep counting through the long notes. Three short pickup figures are written as even eighths here, so you can concentrate on a calm pulse and a singing line.</p><p>The melody moves between small hand positions. Start with finger 4 on A and 3 on G. Move your hand during long or repeated notes; do not stretch your thumb from C to A. At the refrain, the repeated G lets you prepare your thumb for the climb to the high E.</p><p>Practise the melody, then the bass, then both together. Keep the bass quieter than the tune. No pedal is needed. The written dynamics suggest an expressive direction; after playing, listen for a clear melody and choose one phrase to improve.</p>`},
  {t:'play',title:'Find the melody',say:'Count 1, 2, 3, then play the two pickup eighths on beat 4. Let the hand move between positions. Sing the words as you follow the melody.',...shared,rh:shaped,lyrics:GIVE_ME_JESUS_WORDS,range:['C4','E5']},
  {t:'play',title:'Keep the bass gentle',say:'Rest for the one-beat pickup, then hold each bass note for four counts. Use fingers 5 on C, 2 on F and 1 on G. The final tied C lasts eight counts.',...shared,lh:'!p '+GIVE_ME_JESUS_BASS,range:['C3','G3']},
  {t:'play',title:'Give Me Jesus',song:true,say:'Let the melody carry the words above a quiet bass. Keep the pulse calm, give tied notes their full length, and finish with a gentle release. For extra practice, use one hand or loop a phrase in Play along.',...shared,rh:shaped,lh:GIVE_ME_JESUS_BASS,lyrics:GIVE_ME_JESUS_WORDS,hint:false},
 ],
};
