import { advancedSkills } from './advanced-curriculum.js';
import { arrange, study, recital, rangeOf } from './advanced-tools.js';
const chorale=(id,extra={})=>arrange(id,'chorale',extra);
const flowing=(id,extra={})=>arrange(id,'flowing',extra);
const lyrical=(id,extra={})=>arrange(id,'lyrical',extra);
const abide=chorale('eventide');
const agnes=chorale('st_agnes');
const holy=chorale('nicaea');
const fount=flowing('nettleton',{tempo:66});
const crown=arrange('Diademata','octaves',{tempo:56});
const melita=flowing('melita',{tempo:60});
const melitaF=chorale('melita',{shift:5,key:'F',tempo:60});
const assurance=flowing('blessed_assurance',{tempo:78});
const just=lyrical('woodworth',{tempo:60});
const well=lyrical('villeduh',{tempo:60});
const abideLyrical=lyrical('eventide',{tempo:56});
const melitaFinal=flowing('melita',{shift:5,key:'F',tempo:60});
// Titles name the actual teaching texture; these are new arrangements, not reused lessons.
const chapters=[
 ['Stepping into Advanced Playing','Secure reading, efficient movement and purposeful practice.',
 ['abide-balance','Abide with Me: three listening layers',abide,'Keep a clear melody above light inner support and a directed bass. Start dry, then add only enough pedal to connect the phrase.','Record a phrase. Identify the melody, inner support and bass separately, then make one balance change.'],
 ['agnes-reading','Jesus, the Very Thought of Thee: read ahead',agnes,'Preview each phrase in G major. Read the top line and bass first, then prepare the paired supporting notes without stopping the pulse.','Choose three phrase entries and begin directly from each without a run-up.'],
 'Holy, Holy, Holy: a clear chorale',[holy],'Show a continuous pulse, a clear upper voice, planned movement and a calm final release.'],
 ['Advanced Keyboard Technique','More keys, broad arpeggios, comfortable octaves and bass-to-chord travel.',
 ['fount-travel','Come Thou Fount: travelling accompaniment',fount,'Learn the D-major melody first. Keep the flowing eighths below it and let the arm move between the left-hand destinations.','Loop one crossing at a soft dynamic, then join the approach and following bar.'],
 ['crown-octaves','Crown Him with Many Crowns: octave colour',crown,'Use the octave melody only if the span is comfortable. Rehearse it slowly with clear releases. The original source is adapted to half note values and regular 4/4 here.','Try a single-note melody offline as a lighter alternative. Decide where an octave actually improves the phrase; use the printed octave model for the pitch check.'],
 'Eternal Father, Strong to Save: flowing piano',[melita],'Keep the chromatic melody secure above light moving accompaniment. Move rather than hold a wide left-hand stretch.'],
 ['Reading Hymns in Four Parts','Understand each voice, sustain deliberately and make practical reductions.',
 ['holy-voices','Holy, Holy, Holy: hear the inner lines',holy,'Sing the alto and tenor from the linked source before playing this melody-led reduction. Keep each line audible in your imagination while balancing the paired notes.','Compare a source phrase with the reduction. Identify one inner rhythm that was aligned with the melody, then play the original voice alone offline.'],
 ['abide-voices','Abide with Me: outer voices and support',abide,'Trace the bass direction and the soprano destination. Restore the supporting tones lightly and choose comfortable hand movements.','Make a two-voice version offline, then restore one defining inner tone. Explain what you kept and why.'],
 'Jesus, the Very Thought of Thee: chorale reading',[agnes],'Present the complete hymn with a singing melody, a directed bass and quiet supporting notes. Understand the source voices as well as the piano reduction.'],
 ['Richer Hymn Harmony','Hear secondary dominants, guide chromatic notes and plan changes of key.',
 ['melita-harmony','Eternal Father: chromatic destinations',chorale('melita'),'Read every accidental deliberately. Follow the bass and hear where each chromatic harmony leads before giving it extra weight.','Find a secondary-dominant motion in the linked source. Play its guiding tones alone and sing the resolution.'],
 ['just-harmony','Just As I Am: harmony and arrival',just,'Read the retained 6/4 meter calmly. Protect the cadence and hear the change of harmony underneath each longer melody note.','Try one substitute preparation chord offline. Sing the tune over it and decide whether it supports the arrival.'],
 'Eternal Father in F: harmonic fluency',[melitaF],'Carry the complete tune and chromatic harmony into F major. Prepare the new key, preserve the melodic contour and resolve the guiding tones clearly.'],
 ['Advanced Rhythm and Coordination','Changing subdivisions, two against three, syncopation and compound pulse.',
 ['assurance-pulse','Blessed Assurance: three large beats',assurance,'Feel three dotted-quarter pulses in 9/8, each containing three eighths. Keep the pickup light and the accompaniment even.','Conduct the large beats while listening. Then play one phrase without the demonstration and check that dotted notes did not compress.'],
 ['fount-pulse','Come Thou Fount: motion without rushing',fount,'Keep the three-quarter bar steady as the left hand moves in eighths. Listen for an even subdivision across every position change.','Practise one phrase strictly, then try a restrained planned broadening offline. Return to the strict reference for a Flow timing check.'],
 'Blessed Assurance: confident compound time',[assurance],'Keep the large 9/8 pulse through the verse and refrain, with a clear melody above a soft, even moving accompaniment.'],
 ['Interpretation and Tone','Voicing, long phrases, pedal clarity, articulation and critical listening.',
 ['abide-tone','Abide with Me: a long musical sentence',abideLyrical,'Sing the phrase before playing. Choose one destination, lighten supporting tones and let the cadence settle without losing the line.','Record a dry version and a pedalled version. Keep the one in which the phrase is connected and the harmony remains clear.'],
 ['just-pedal','Just As I Am: listening through pedal changes',just,'Learn this 6/4 setting without pedal. Add changes after new harmonies sound, listening for a clean bass and an unbroken tune.','If your pedal supports continuous depth, compare shallow and deeper use offline. With an on/off pedal, prefer shorter clean changes.'],
 'It Is Well with My Soul: lyrical piano',[well],'Sustain a clear melodic sentence, balance the paired right-hand notes and clear the pedal as the harmony changes. Let the ending sound prepared.'],
 ['Independent Hymn Musicianship','Realize chord symbols, transpose, introduce hymns and accompany singers.',
 ['holy-transpose','Holy, Holy, Holy in F: choose the key',chorale('nicaea',{shift:3,key:'F'}),'Prepare the melody in F and compare its highest and lowest notes with the D-major version. Use scale degrees and functions to understand the move.','Sing the opening in both keys. Decide which is more comfortable for your intended singer, without assuming the higher key is better.'],
 ['fount-service','Come Thou Fount in F: a service-ready texture',flowing('nettleton',{shift:3,key:'F',tempo:66}),'Prepare the F-major accompaniment, agree on a tempo and imagine a singer entering after a short recognizable introduction.','Create a two- or four-bar introduction from the ending offline. Rehearse the pickup, one breath and a shared final release with a singer if possible.'],
 'Come Thou Fount: accompany with confidence',[fount],'Before the written reference run, play your own introduction offline and sing one phrase while accompanying. In the app, keep the printed D-major model clear, steady and supportive.'],
 ['Building a Recital Programme','Contrasting repertoire, multiple entry points, recovery and an independent next plan.',
 ['agnes-dress','Dress rehearsal: a broad chorale',agnes,'Play the entire hymn without stopping. Make the top line sing and keep the inner support light.','Name the start, middle and final-cadence landmarks. Begin from each in a different order, then make one complete run.'],
 ['melita-dress','Dress rehearsal: flowing movement in F',melitaFinal,'Keep the eighth-note accompaniment even beneath a clear chromatic tune. Prepare the new key before the first note.','Record the whole performance. Choose one movement repair and one musical change, then test both in the complete phrase.'],
 'Final programme: chorale, lyrical hymn and flowing hymn',[agnes,abideLyrical,melitaFinal],'Perform three complete contrasting hymns with a short silence between them. Show a clear melody, reliable pulse, comfortable movement, clean pedal, planned interpretation and calm recovery. Practise a personal interpretation offline before playing these written reference arrangements.'],
];
export const ADVANCED_HYMNS=[];
export const ADVANCED_UNITS=chapters.map(([title,blurb,a,b,recitalTitle,pieces,criteria],i)=>{
 const id='a'+(i+1),rec=recital(id,recitalTitle,pieces,criteria);ADVANCED_HYMNS.push(rec.piece);
 return {id,number:i+1,title,blurb,course:'advanced',checklist:[...advancedSkills[i].map(l=>l.summary),criteria],lessons:[...advancedSkills[i],study(...a),study(...b),rec.lesson]};
});
for(const unit of ADVANCED_UNITS)for(const lesson of unit.lessons)for(const step of lesson.steps)if(step.t==='play')step.range=rangeOf(step);
