import { skillLessons } from './intermediate-curriculum.js';
import { fromExisting, accompany, scoreStep, hymnStudy, recital, play, read, transpose } from './intermediate-tools.js';

const jesus=accompany(fromExisting('jesus-loves-me'),['C','C','F','C','C','C',['F','G'],['G','C'],'C','F','C','G','C','F',['C','G'],'C']);
const doxology=accompany(fromExisting('doxology-complete'),['G','G','D','G','C',['G','D'],'G','C',['D','G'],'G',['D','G'],['D','G'],['C','G']]);
const grace=accompany(fromExisting('amazing-grace'),['C','C','C','F','C','C','C','G','G','C','C','F','C','G','C','G','C']);
const holy=accompany(fromExisting('holy-holy-holy'),['D','D','G','D','D',['D','A'],['A','D'],'A','D','D','G','D','D',['G','D'],['G','A'],'D'],'broken');
const friendChart=['F','Bb','F','C','F','Bb',['F','C'],'F','C','F','Bb','C','F','Bb',['F','C'],'F'];
const friend=accompany(fromExisting('friend'),friendChart,'broken');
const joyBase=fromExisting('joyful');
const joyful=accompany({...joyBase,rh:transpose(joyBase.rh,7),lyrics:joyBase.lyrics,verses:joyBase.verses,key:'G'},['G','D','G','D','G','D','G',['D','G'],'D','G','D',['G','D'],'G','D','G',['D','G']],'broken');
const rock=accompany(fromExisting('rock-of-ages'),['C','C','C','C','C','G','C','G','C','C','C','G','C'],'chords');
const survey=accompany(fromExisting('survey'),['C','C','F','C','C','F','C','G','C','C','F','C','C','F','G','C'],'chords');
// Melody transcribed from the published Mobile Hymns HENDON score (key G).
const hendon=accompany(play('Take My Life and Let It Be','Keep the melody above the smoothly connected left-hand chords.',
 'G4/q G4/q G4/8 E4/8 G4/8 B4/8 D5/q C5/q B4/h B4/q B4/q B4/8 A4/8 C5/8 A4/8 G4/q F#4/8 A4/8 G4/h B4/q B4/q A4/q A4/8 B4/8 C5/q D5/q C5/q B4/q B4/q B4/q C5/q B4/q B4/8 A4/8 A4/8 G4/8 G4/q F#4/q G4/q A4/q B4/q C5/8 A4/8 G4/q F#4/q G4/h',null,
 {key:'G',song:true,source:'https://mobilehymns.org/english/Take_My_Life_And_Let_It_Be_Consecrated.html',lyrics:'Take my life _ and _ let it be / con- se- crat- _ ed, _ Lord, to _ Thee. / Take my hands and _ let them move, _ / at the im- pulse of _ Thy _ love, _ / at the im- pulse _ of Thy love.'}),
 ['G',['D','G'],'G',['D','G'],'G','C','G',['G','D'],'G',['D','G']],'chords');
const night={...fromExisting('silent-night'),tempo:72};
const assurance={...scoreStep('blessed_assurance','bass'),lyrics:'Bless- ed as- sur- ance, Je- sus is mine! / Oh, what a fore- taste of glo- ry di- vine! / Heir of sal- va- tion, pur- chase of God, / born of His Spir- it, washed in His blood. / This is my sto- ry, this is my song, / prais- ing my Sav- iour all the day long; / this is my sto- ry, this is my song, / prais- ing my Sav- iour all the day long.'};
const abide={...scoreStep('eventide','bass'),lyrics:'A- bide with me: fast falls the e- ven- tide; / the dark- ness deep- ens; Lord, with me a- bide. / When oth- er help- ers fail and com- forts flee, / Help of the help- less, O a- bide with me.'};
const just=scoreStep('woodworth','bass');
const well=scoreStep('villeduh','chords');
const crown=scoreStep('Diademata','chords');
// A deliberately short source-checked opening, with original moving-bass study.
const coronation=play("All Hail the Power of Jesus' Name: opening study",'Prepare the pickup and let the bass move under the repeated melody notes.',
 'D4/q G4/q G4/q B4/q B4/q A4/q G4/q A4/q B4/q',
 'D3/q G2/q A2/q B2/q G2/q D3/q E3/q F#3/q G3/q',
 {key:'G',pickup:1,song:true,source:'https://mobilehymns.org/english/All_Hail_The_Power_Of_Jesus_Name.html',lyrics:'All hail the pow- er of Je- sus\' name!'});
const vision=accompany(fromExisting('be-thou-my-vision'),['C','Am','C','C','G','G','Am','G','Am','C','C','Am','C','F','G','C'],'broken');
const fount=scoreStep('nettleton','broken');
const lyrical={...well,title:'It Is Well with My Soul - final recital',tempo:60};
const confident={...fount,title:'Come Thou Fount - final recital',tempo:76};
const chapters=[
 ['From Beginner to Intermediate','Relaxed movement, secure reading and a shared pulse.',
  ['jesus-study','Jesus Loves Me: coordinated hands',jesus,'Let the melody move above a quiet held bass. Release each bass only at its written change.','Can you sing the tune and hear a continuous bass beneath it?'],
  ['doxology-study','The Doxology: a shared pulse',doxology,'Use the complete familiar tune to coordinate changes without rushing the melody.','Count through the final Amen and release both hands together.'],
  'Amazing Grace',[{...grace,title:'Amazing Grace',tempo:68}],'Keep the waltz pulse, hold the bass notes fully and shape each phrase.'],
 ['Moving Freely Around the Keyboard','Scales, arpeggios and planned movement in familiar major and minor keys.',
  ['holy-study','Holy, Holy, Holy: D-major movement',holy,'Find the D-major shapes before playing. Keep the running left hand soft and the repeated melody notes calm.','Loop one position change, then join it to the preceding bar.'],
  ['friend-study','What a Friend: F-major patterns',friend,'Prepare B-flat and identify scale fragments before adding the broken-chord accompaniment.','Did your arm travel with the hand without stretching for the next group?'],
  'Joyful, Joyful in G',[{...joyful,title:'Joyful, Joyful in G',tempo:72}],'Keep scale-like melody patterns even above a soft arpeggiated accompaniment.'],
 ['Understanding Hymn Harmony','Triads, inversions, dominant sevenths and convincing cadences.',
  ['rock-study','Rock of Ages: connected chord shapes',rock,'Read each left-hand chord as a whole shape. Keep common tones and count the three-beat bars.','Name the chord roots and listen for the final return to C.'],
  ['survey-study','When I Survey: harmonic punctuation',survey,'Listen for the phrases that end at home and those that invite another phrase.','Play only the last two chords of each phrase and describe their effect.'],
  'Take My Life and Let It Be',[{...hendon,title:'Take My Life and Let It Be',tempo:68}],'Keep the melody clear above compact chord inversions. Show the cadence without an unplanned pause.'],
 ['Rhythm That Keeps Moving','Subdivision, dotted rhythms, compound time, triplets and syncopation.',
  ['night-study','Silent Night: two large beats',night,'Count six eighths first, then feel two groups of three. Keep the accompaniment under the melody.','Can you tap only the two large beats without losing the shorter notes?'],
  ['holy-rhythm','Holy, Holy, Holy: dotted precision',{...holy,lh:accompany(fromExisting('holy-holy-holy'),['D','D','G','D','D',['D','A'],['A','D'],'A','D','D','G','D','D',['G','D'],['G','A'],'D']).lh},'Count the subdivisions through each dotted rhythm. Do not let the short note arrive early.','Compare the first and second dotted phrases at the same tempo.'],
  'Blessed Assurance',[{...assurance,title:'Blessed Assurance',tempo:84}],'Feel three large dotted-quarter beats in each 9/8 bar and place the pickup calmly.'],
 ['Making the Melody Sing','Balance, phrase direction, articulation, pedal and deliberate expressive timing.',
  ['abide-study','Abide with Me: a singing line',abide,'Sing each phrase first. Choose one destination and keep the left hand below the melody in volume.','Can a listener hum the melody without concentrating on it?'],
  ['just-study','Just As I Am: clear pedalling',just,'Learn the notes without pedal. Add small, clean changes only after the new harmony sounds. This source uses 6/4.','Listen for old harmonies blurring across the changes; reduce pedal if needed.'],
  'It Is Well with My Soul',[{...well,title:'It Is Well with My Soul',tempo:60}],'Keep the melody prominent, connect phrases and clear the pedal when the harmony changes.'],
 ['Independent Hands and Musical Voices','Held notes, different touches, moving bass and compact hymn textures.',
  ['doxology-voices','The Doxology: supporting voices',{...fromExisting('doxology-complete'),title:'The Doxology: supporting voices'},'Read the outer lines first, then add the left-hand chord tones softly.','Identify which tones belong to the melody and which support its harmony.'],
  ['coronation-study',coronation.title,coronation,'Play the source-checked opening with a clear pickup. Let the bass travel under repeated melody notes.','Play the bass alone and listen to its direction, then restore the melody.'],
  'Crown Him with Many Crowns',[{...crown,title:'Crown Him with Many Crowns',tempo:68}],'Keep the melody above the compact supporting chords. This teaching edition halves the source note values and re-bars the changing source metres in 4/4 without changing note-length proportions.'],
 ['Playing Hymns Beyond the Written Notes','Lead sheets, accompaniment styles, transposition, introductions and learning by ear.',
  ['vision-study','Be Thou My Vision: choose a texture',vision,'Use this broken-chord model, then try a simpler bass-and-chord version offline. Keep the phrase length unchanged.','Explain which accompaniment leaves the most space for a singer.'],
  ['friend-transpose','What a Friend: introduction and transposition',friend,'Learn the written F-major model, then transpose one phrase offline using scale degrees and chord functions.','Prepare an introduction from a familiar ending and count an imaginary singer in.'],
  'Come Thou Fount',[{...fount,title:'Come Thou Fount',tempo:72}],'Use the written arrangement as a model. Before the recital, create and play your own short introduction offline; the app checks the reference score only.'],
 ['Preparing a Complete Performance','Interpretation, diagnosis, restart points, recovery and a sustained two-piece programme.',
  ['lyrical-rehearsal','Dress rehearsal: It Is Well',lyrical,'Rehearse without stopping. Decide the phrase destinations and pedal changes before the first note.','Afterwards name one successful musical choice and one passage needing repair.'],
  ['confident-rehearsal','Dress rehearsal: Come Thou Fount',confident,'Maintain a confident pulse through the whole hymn. Use planned phrase landmarks to recover calmly.','Can you restart from three phrase beginnings without running in from the start?'],
  'A lyrical hymn and a confident hymn',[lyrical,confident],'Perform both complete hymns, with a short quiet pause between them. Keep the pulse, a clear melody, relaxed movement and a deliberate ending.'],
];
export const INTERMEDIATE_HYMNS=[];
export const INTERMEDIATE_UNITS=chapters.map(([title,blurb,a,b,recitalTitle,pieces,criteria],i)=>{
 const id='i'+(i+1);const rec=recital(id,recitalTitle,pieces,criteria);INTERMEDIATE_HYMNS.push(rec.piece);
 return {id,number:i+1,title,blurb,course:'intermediate',checklist:[...skillLessons[i].map(l=>l.summary),criteria],lessons:[...skillLessons[i],hymnStudy(...a),hymnStudy(...b),rec.lesson]};
});

// Keep the keyboard window focused on the notes actually used in each step.
import { parseSeq, midiToName } from '../theory.js';
for(const unit of INTERMEDIATE_UNITS)for(const lesson of unit.lessons)for(const step of lesson.steps)if(step.t==='play') {
 const midis=[step.rh,step.lh].filter(Boolean).flatMap(seq=>parseSeq(seq).flatMap(e=>e.midis||[]));
 if(midis.length)step.range=[midiToName(Math.min(...midis)),midiToName(Math.max(...midis))];
}
