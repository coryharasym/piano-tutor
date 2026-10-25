// Practice songs: four per unit, each placed right after the lesson whose
// skill it uses. Every tune is checked against a published source:
//   hymnary.org MusicXML for the hymns and spirituals, and the Essen folk
//   song collection and Ryan's Mammoth Collection (music21 corpus) for the
//   folk songs. Some are moved to an easier key. Where a source has a
//   dotted-eighth and sixteenth, it is written as two even eighths.

const noFingers = (seq) => seq.replace(/(\S+\/[^/\s]+)\/[\d-]+/g, '$1');
const ped = (bars) => bars.map((b) => `!lift !ped ${b}`).join(' ').replace(/^!lift /, '');

// ---------------------------------------------------------------- Unit 2
// Lightly Row ("Hänschen klein"), Essen collection, moved from G to C.
const ROW_A1 = 'G4/q/5 E4/q/3 E4/h/3 F4/q/4 D4/q/2 D4/h/2 C4/q/1 D4/q/2 E4/q/3 F4/q/4 G4/q/5 G4/q/5 G4/h/5';
const ROW_A2 = 'G4/q/5 E4/q/3 E4/h/3 F4/q/4 D4/q/2 D4/h/2 C4/q/1 E4/q/3 G4/q/5 G4/q/5 C4/h/1 r/h';
const ROW_B = 'D4/q/2 D4/q/2 D4/q/2 D4/q/2 D4/q/2 E4/q/3 F4/h/4 E4/q/3 E4/q/3 E4/q/3 E4/q/3 E4/q/3 F4/q/4 G4/h/5';
const ROW_W1 = 'Light- ly row, light- ly row, / o\'er the glass- y waves we go; / smooth- ly glide, smooth- ly glide / on the si- lent tide.';
const ROW_W2 = 'Let the winds and wa- ters be / min- gled with our mel- o- dy; / sing and float, sing and float / in our lit- tle boat.';

// Sleep, Baby, Sleep ("Schlaf, Kindlein, schlaf"), Essen collection, moved
// from F to C and written in 4/4 with every note twice as long.
const SLEEP = 'E4/h/3 D4/q/2 D4/q/2 C4/h/1 r/q C4/8/1 E4/8/3 G4/q/5 G4/q/5 F4/q/4 F4/q/4 E4/h/3 r/q E4/q/3 '
  + 'F4/q/4 F4/q/4 D4/q/2 D4/q/2 G4/q/5 G4/q/5 E4/q/3 E4/q/3 F4/q/4 F4/q/4 D4/q/2 D4/q/2 G4/q/5 G4/q/5 E4/h/3 '
  + 'F4/h/4 D4/q/2 D4/q/2 C4/h/1 r/h';

// All My Little Ducklings ("Alle meine Entchen"), Essen collection, in 4/4
// with every note twice as long.
const DUCKS = 'C4/q D4/q E4/q F4/q G4/h G4/h A4/q A4/q A4/q A4/q G4/h r/h A4/q A4/q A4/q A4/q G4/h r/h '
  + 'F4/q F4/q F4/q F4/q E4/h E4/h D4/q D4/q D4/q D4/q C4/h r/h';
const DUCKS_W = 'Al- le mei- ne Ent- chen / schwim- men auf dem See, / schwim- men auf dem See, / Köpf- chen in das Was- ser, / Schwänz- chen in die Höh\'.';

// Au Clair de la Lune: the tune from the left-hand lesson, now in the right
// hand, with the left hand holding C and G underneath.
const CLAIR_RH = 'C4/q/1 C4/q/1 C4/q/1 D4/q/2 E4/h/3 D4/h/2 C4/q/1 E4/q/3 D4/q/2 D4/q/2 C4/w/1';
const CLAIR_LH = 'C3/w/5 C3/h/5 G3/h/1 C3/h/5 G3/h/1 C3/w/5';
const CLAIR_W = 'Au clair de la lu- ne, / mon a- mi Pier- rot, / prê- te- moi ta plu- me / pour é- crire un mot.';

// ---------------------------------------------------------------- Unit 3
// When I Survey the Wondrous Cross (HAMBURG, Lowell Mason 1824),
// hymnary.org MusicXML, moved from F to C.
const SURVEY = 'C4/h/1 C4/q/1 D4/q/2 E4/h/3 D4/q/2 E4/q/3 F4/h/4 E4/q/3 D4/q/2 E4/w/3 '
  + 'E4/h/3 E4/q/3 E4/q/3 F4/h/4 E4/q/3 D4/q/2 C4/h/2 B3/q/1 C4/q/2 D4/w/3 '
  + 'C4/h/1 C4/q/1 D4/q/2 E4/h/3 D4/q/2 E4/q/3 F4/h/4 E4/q/3 D4/q/2 E4/w/3 '
  + 'E4/h/3 E4/q/3 E4/q/3 D4/h/2 C4/h/1 D4/h/2 E4/q/3 D4/q/2 C4/w/1';
const SURVEY_W = 'When I sur- vey the _ won- drous _ cross / on which the Prince of _ glo- ry _ died, / '
  + 'my rich- est gain I _ count but _ loss, / and pour con- tempt on all my _ pride.';

// Kum Ba Yah, hymnary.org MusicXML (Worship and Rejoice), in C.
const KUM = 'C4/8 E4/8 G4/8 G4/8 G4/q A4/8 A4/8 G4/h C4/8 E4/8 G4/8 G4/8 G4/q F4/8 E4/8 D4/h C4/8 E4/8 '
  + 'G4/8 G4/8 G4/q A4/8 A4/8 G4/h F4/q E4/8 C4/q. D4/8 D4/8 C4/h.';
const KUM_W = 'Kum ba yah, my Lord, kum ba yah! / Kum ba yah, my Lord, kum ba yah! / '
  + 'Kum ba yah, my Lord, kum ba yah! / O Lord, _ kum ba yah.';

// Muss i denn, Essen collection, moved from F to C and written in 4/4 with
// every note twice as long.
const MUSS_A = 'C4/8 D4/8 E4/q E4/8 G4/8 F4/q F4/8 A4/8 G4/q G4/8 F4/8 E4/h G4/q G4/8 F4/8 E4/q E4/8 G4/8 F4/q F4/q D4/q G4/q';
const MUSS = `${MUSS_A} E4/h r/q ${MUSS_A} E4/h r/q C4/8 E4/8 `
  + 'D4/q. E4/8 F4/q D4/q E4/q. F4/8 G4/q G4/8 G4/8 A4/q A4/q C5/q B4/8 A4/8 G4/h r/q C4/8 E4/8 '
  + 'G4/q G4/8 A4/8 G4/q G4/8 C5/8 G4/q G4/8 F4/8 E4/h G4/q G4/8 F4/8 E4/q E4/8 G4/8 F4/q F4/q D4/q G4/q E4/h r/h';

// Fox, You Stole the Goose ("Fuchs, du hast die Gans gestohlen"), Essen
// collection, moved from F to C.
const FOX = 'C4/8/1 D4/8/2 E4/8/3 F4/8/4 G4/8/5 G4/8/5 G4/8/5 G4/8/5 |: A4/8 F4/8 C5/8 A4/8 G4/q r/q :| '
  + 'G4/8 F4/8 F4/8 F4/8 F4/8 E4/8 E4/8 E4/8 E4/8 D4/8 D4/8 G3/8 E4/q r/q '
  + 'G4/8 F4/8 F4/8 F4/8 F4/8 E4/8 E4/8 E4/8 E4/8 D4/8 D4/8 E4/8 C4/q r/q';
const FOX_W = 'Fuchs, du hast die Gans ge- stoh- len, / gib sie wie- der her, / gib sie wie- der her! / '
  + 'Sonst wird dich der Jä- ger ho- len / mit dem Schieß- ge- wehr, / sonst wird dich der Jä- ger ho- len / mit dem Schieß- ge- wehr.';

// ---------------------------------------------------------------- Unit 4
// O Christmas Tree ("O Tannenbaum"), Essen collection, in G.
const TREE_A = 'D4/q G4/8 G4/8 G4/q A4/q B4/8 B4/8 B4/q. G4/8 A4/8 B4/8 C5/q F#4/q';
const TREE = `${TREE_A} A4/q G4/q r/8 B4/8 D5/8 B4/8 E5/q. D5/8 D5/8 C5/8 C5/q. C5/8 C5/8 A4/8 D5/q. C5/8 C5/8 B4/8 B4/q `
  + `${TREE_A} A4/q G4/h`;
const TREE_W = 'O Tan- nen- baum, o Tan- nen- baum, / wie treu sind dei- ne Blät- ter! / '
  + 'Du grünst nicht nur zur Som- mer- zeit, / nein, auch im Win- ter, wenn es schneit. / '
  + 'O Tan- nen- baum, o Tan- nen- baum, / wie treu sind dei- ne Blät- ter!';

// Shall We Gather at the River (HANSON PLACE, Robert Lowry 1864),
// hymnary.org MusicXML, in D.
const GATHER_V = 'F#4/q F#4/q F#4/8 E4/8 F#4/8 G4/8 A4/h F#4/h G4/q G4/q G4/8 A4/8 G4/8 F#4/8 E4/h A4/h '
  + 'F#4/q F#4/q F#4/8 E4/8 F#4/8 G4/8 A4/h F#4/q F#4/8 G4/8 E4/q E4/8 F#4/8 G4/q F#4/8 E4/8 D4/w';
const GATHER_R = 'B4/q B4/q D5/8 C#5/8 D5/8 B4/8 A4/h F#4/q r/8 F#4/8 G4/8 F#4/8 G4/8 F#4/8 G4/8 F#4/8 G4/8 E4/8 F#4/h A4/h '
  + 'B4/8 B4/8 B4/8 B4/8 D5/8 C#5/8 D5/8 B4/8 A4/h F#4/q F#4/q E4/q E4/8 F#4/8 G4/q F#4/8 E4/8 D4/w';

// What a Friend We Have in Jesus (CONVERSE, Charles Converse 1868),
// hymnary.org MusicXML, in F.
const FRIEND_A = 'C5/q. C5/8 D5/8 C5/8 A4/8 F4/8 F4/h D4/h';
const FRIEND_END = 'C4/q. F4/8 A4/8 G4/8 F4/8 E4/8 F4/h. r/q';
const FRIEND = `${FRIEND_A} C4/q. F4/8 A4/8 F4/8 C5/8 A4/8 G4/h. r/q ${FRIEND_A} ${FRIEND_END} `
  + `G4/q. F#4/8 G4/8 A4/8 Bb4/8 G4/8 A4/h C5/h D5/q. D5/8 C5/8 A4/8 Bb4/8 A4/8 G4/h. r/q ${FRIEND_A} ${FRIEND_END}`;
const FRIEND_W = 'What a friend we have in Je- sus, / all our sins and griefs to bear! / '
  + 'What a priv- i- lege to car- ry / ev- ery- thing to God in prayer! / '
  + 'O what peace we of- ten for- feit, / O what need- less pain we bear, / '
  + 'all be- cause we do not car- ry / ev- ery- thing to God in prayer!';

// Go Down, Moses: the verse, from hymnary.org MusicXML (The Cyber Hymnal),
// moved from G minor to A minor.
const MOSES_LINE = 'C5/q C5/q B4/q B4/q C5/q C5/q';
const MOSES = `E4/q ${MOSES_LINE} A4/h E4/q E4/q G#4/8 G#4/q. A4/h. E4/q ${MOSES_LINE} E4/q D4/q E4/q E4/q G#4/8 G#4/q. A4/w`;

// ---------------------------------------------------------------- Expression
// Go, Tell It on the Mountain: the refrain, from hymnary.org MusicXML
// (Psalter Hymnal), in F.
const TELL = "!f A4/h A4/8 G4/8 F4/8 D4/8 C4/h F4/h G4'/8 G4'/q G4'/8 F4'/q G4'/q A4/8 G4/8 A4/8 G4/8 F4/h "
  + "A4/h A4/8 G4/8 F4/8 D4/8 C4/h F4/q F4/q G4'/q G4'/q A4/8 F4/8 G4/q F4/h. r/q";
const TELL_W = 'Go, tell it on the moun- tain, / o- ver the hills and ev- _ ery- _ where; / '
  + 'go, tell it on the moun- tain / that Je- sus Christ _ is born.';

// We Are Climbing Jacob's Ladder, hymnary.org MusicXML (The Cyber Hymnal),
// in D, getting louder as it climbs.
const LADDER = '!p F#4/q F#4/h. F#4/q F#4/h. A4/q A4/h. A4/q F#4/h. '
  + '!cresc E4/q E4/h. E4/q E4/h. G4/q B4/h. B4/q A4/h. '
  + '!f D5/q D5/h. D5/q D5/h. D5/q D5/h. B4/q A4/h. '
  + '!dim A4/q F#4/h. G4/q E4/h. !p D4/w';
const LADDER_W = 'We are climb- ing Ja- cob\'s lad- der, / we are climb- ing Ja- cob\'s lad- der, / '
  + 'we are climb- ing Ja- cob\'s lad- der, / sol- diers of the cross.';

// All Through the Night (AR HYD Y NOS, Welsh), hymnary.org MusicXML
// (The Cyber Hymnal), in G, with the pedal changing every bar.
const NIGHT_A = ['G4/q. F#4/8 E4/q G4/q', 'A4/q. G4/8 F#4/q D4/q', 'E4/h F#4/q. F#4/8', 'G4/w'];
const NIGHT_B = ['C5/q B4/q C5/q D5/q', 'E5/q D5/q C5/q B4/q', 'C5/q. B4/8 A4/q G4/q', 'B4/q A4/q G4/q F#4/q'];
const NIGHT = `!mp ${ped([...NIGHT_A, ...NIGHT_A, ...NIGHT_B, ...NIGHT_A])}`;
const NIGHT_W = 'Sleep, my child, and peace at- tend thee / all through the night; / '
  + 'guard- ian an- gels God will send thee / all through the night. / '
  + 'Soft the drow- sy hours are creep- ing, / hill and vale in slum- ber sleep- ing, / '
  + 'I my lov- ing vig- il keep- ing / all through the night.';

// Fairest Lord Jesus (ST. ELIZABETH, Silesian folk tune), hymnary.org
// MusicXML, moved from E flat to C. One slur for each line of the hymn.
const FAIREST = '!mp (C4/h C4/q C4/q D4/q B3/q C4/h) (E4/h E4/q E4/q F4/q D4/q E4/h) '
  + '!cresc (G4/h C5/q A4/q G4/h F4/q E4/q F4/h E4/h D4/w) '
  + '!mp (G4/h A4/q G4/q G4/q E4/q F4/h) (F4/h G4/q F4/q F4/q D4/q E4/h) '
  + '!mf (E4/h E4/q E4/q G4/h. F4/q !dim E4/h D4/h C4/w)';

// ---------------------------------------------------------------- Unit 5
// Rock of Ages (TOPLADY, Thomas Hastings 1830), hymnary.org MusicXML
// (Worship and Rejoice), moved from B flat to C, over C, F and G chords.
const ROCK = 'G4/8 A4/8 G4/q E4/q C5/8 A4/8 G4/h C5/8 D5/8 E5/q. D5/8 C5/8 B4/8 C5/h B4/8 C5/8 '
  + 'D5/q. D5/8 B4/8 G4/8 C5/h B4/8 C5/8 D5/q. D5/8 B4/8 G4/8 C5/h G4/8 A4/8 '
  + 'G4/q E4/q C5/8 A4/8 G4/h C5/8 D5/8 E5/q. D5/8 C5/8 B4/8 C5/h.';
const [C3, F3, G3] = ['[C3 E3 G3]', '[C3 F3 A3]', '[B2 D3 G3]'];
const ROCK_LH = [
  'r/q', `${C3}/h/5-3-1 ${F3}/q/5-2-1`, `${C3}/h./5-3-1`, `${C3}/h/5-3-1 ${G3}/q/5-3-1`, `${C3}/h/5-3-1 ${G3}/q/5-3-1`,
  `${G3}/h./5-3-1`, `${C3}/h/5-3-1 ${G3}/q/5-3-1`, `${G3}/h./5-3-1`, `${C3}/h./5-3-1`,
  `${C3}/h/5-3-1 ${F3}/q/5-2-1`, `${C3}/h./5-3-1`, `${C3}/h/5-3-1 ${G3}/q/5-3-1`, `${C3}/h./5-3-1`,
].join(' ');
const ROCK_W = 'Rock of A- ges, cleft for me, / let me hide my- self in thee; / '
  + 'let the wa- ter and the blood, / from thy wound- ed side which flowed, / '
  + 'be of sin the dou- ble cure; / save from wrath and make me pure.';

// 'Tis So Sweet to Trust in Jesus (TRUST IN JESUS, William Kirkpatrick
// 1882), hymnary.org MusicXML, in G, over G, C and D chords.
const SWEET_1 = 'B4/q A4/q G4/q. F#4/8 E4/q G4/q E4/q D4/q';
const SWEET = `${SWEET_1} G4/q B4/q D5/q. B4/8 A4/q G4/q A4/h ${SWEET_1} G4/q B4/q E4/q. A4/8 G4/q F#4/q G4/h `
  + 'B4/q D5/q D5/q B4/q A4/q G4/q B4/q A4/q B4/q D5/q D5/q. B4/8 A4/q G4/q A4/h '
  + 'B4/q A4/q G4/q D4/q C5/q. E4/8 E4/q D4/q G4/q B4/q E4/q. A4/8 G4/q F#4/q G4/h';
const [G2, C2, D2] = ['[G2 B2 D3]', '[G2 C3 E3]', '[F#2 A2 D3]'];
const g = (d) => `${G2}/${d}/5-3-1`, c = (d) => `${C2}/${d}/5-2-1`, d = (dur) => `${D2}/${dur}/5-3-1`;
const SWEET_LH = [
  g('w'), `${c('h')} ${g('h')}`, g('w'), d('w'), g('w'), `${c('h')} ${g('h')}`, `${g('h')} ${c('h')}`, `${d('h')} ${g('h')}`,
  g('w'), d('w'), g('w'), d('w'), g('w'), `${c('h')} ${g('h')}`, `${g('h')} ${c('h')}`, `${d('h')} ${g('h')}`,
].join(' ');
const SWEET_W = '\'Tis so sweet to trust in Je- sus, / just to take Him at His word; / '
  + 'just to rest up- on His prom- ise, / just to know, "Thus saith the Lord." / '
  + 'Je- sus, Je- sus, how I trust Him! / How I\'ve proved Him o\'er and o\'er! / '
  + 'Je- sus, Je- sus, pre- cious Je- sus! / O for grace to trust Him more!';

// Greensleeves, as sung to "What Child Is This", hymnary.org MusicXML
// (Baptist Hymnal 2008, melody), in E minor.
const SLEEVES_A = 'G4/q A4/8 B4/8 C5/8 B4/8 A4/q F#4/8 D4/8 E4/8 F#4/8';
const SLEEVES_B = 'D5/q. D5/8 C#5/8 B4/8 A4/q F#4/8 D4/8 E4/8 F#4/8';
const SLEEVES_END = 'G4/8 F#4/8 E4/8 D#4/8 C#4/8 D#4/8';
const SLEEVES = `E4/8 ${SLEEVES_A} G4/q E4/8 E4/8 D#4/8 E4/8 F#4/q. B3/q E4/8 ${SLEEVES_A} ${SLEEVES_END} E4/q. E4/q. `
  + `${SLEEVES_B} G4/q E4/8 E4/8 D#4/8 E4/8 F#4/q D#4/8 B3/q. ${SLEEVES_B} ${SLEEVES_END} E4/q. E4/q.`;

// Pop Goes the Weasel, Ryan's Mammoth Collection (1883), moved from G to C.
const WEASEL = "|: C4/q/1 C4/8/1 D4/q/2 D4/8/2 E4/8/3 G4/8/5 E4/8/3 C4/q/1 r/8 C4/q/1 C4/8/1 D4/q/2 F4/8/4 E4/q./3 C4/q/1 r/8 "
  + "C4/q/1 C4/8/1 D4/q/2 D4/8/2 E4/8/3 G4/8/5 E4/8/3 C4/q/1 r/8 !f A4'/q./5 D4/q/1 F4/8/3 E4/q./2 C4/q/1 r/8 :|";

// Each lesson goes into its unit right after the lesson named by `after`.
const lesson = (unit, after, id, title, summary, steps) => ({ unit, after, lesson: { id: `song-${id}`, practiceSong: true, title, summary, steps } });
const read = (title, body) => ({ t: 'read', title, body });
const play = (title, say, rest) => ({ t: 'play', title, say, ...rest });

export const PRACTICE_SONGS = [
  // Unit 2: C position.
  lesson('u2', 'hot-cross-buns', 'lightly-row', 'Lightly Row', 'A rowing song that walks up and down C position.', [
    read('Lightly Row', `<p>This German children's song is called <b>Hänschen klein</b> at home, and <b>Lightly Row</b> in English. It fits your C position exactly: thumb on Middle C, finger 5 on G.</p>
    <p>Each line starts with a skip down from G to E, then a step down to D and C. Listen for the pattern and it will play itself.</p>`),
    play('First verse', 'Thumb on Middle C. G, E, E; F, D, D; then walk up C D E F G.', { rh: `${ROW_A1} ${ROW_A2}`, lyrics: ROW_W1, range: ['C4', 'C5'], keyLabels: 'all', names: true, tempo: 96, reps: 2 }),
    play('Lightly Row', 'The whole song. The middle part repeats D, then E, then climbs to G.', { rh: `${ROW_A1} ${ROW_A2} ${ROW_B} ${ROW_A2}`, lyrics: `${ROW_W1} / ${ROW_W2}`, song: true, range: ['C4', 'C5'], keyLabels: 'all', names: true, tempo: 100 }),
  ]),
  lesson('u2', 'mary', 'sleep-baby-sleep', 'Sleep, Baby, Sleep', 'A gentle German lullaby in C position.', [
    read('A lullaby', `<p><b>Schlaf, Kindlein, schlaf</b> ("Sleep, baby, sleep") is a German lullaby that has been sung for over 200 years. Play it softly and slowly, as if someone is falling asleep.</p>
    <p>Look out for the <b>two quick notes</b> after the first rest: C and E, twice as fast as a quarter note, leading into the high G.</p>`),
    play('Sleep, Baby, Sleep', 'Thumb on Middle C. Softly. Count the rests: they are part of the music.', { rh: SLEEP, song: true, range: ['C4', 'C5'], keyLabels: 'all', names: true, tempo: 88 }),
  ]),
  lesson('u2', 'ode-rh', 'ducklings', 'All My Little Ducklings', 'A German children\'s song that stretches up to A.', [
    read('Alle meine Entchen', `<p>Every German child learns <b>Alle meine Entchen</b>: "All my little ducklings swimming on the lake, heads down in the water, tails up in the air."</p>
    <p>It walks up C D E F G, then needs one note beyond C position: <b>A</b>. Let your hand spread a little so finger 5 reaches A. Then it walks back down to Middle C.</p>`),
    play('All My Little Ducklings', 'Up C D E F G G, then the As, then step down: F, E, D, C.', { rh: DUCKS, lyrics: DUCKS_W, song: true, range: ['C4', 'C5'], keyLabels: 'all', names: true, tempo: 104 }),
  ]),
  lesson('u2', 'hands-together', 'au-clair-hands', 'Au Clair de la Lune, hands together', 'The French tune in your right hand, with a left-hand bass.', [
    read('Melody and bass', `<p>You played <b>Au Clair de la Lune</b> with your left hand. Now the right hand takes the tune, and the left hand plays long low notes underneath: <b>C</b> with finger 5 and <b>G</b> with your thumb.</p>
    <p>The left hand only moves on beats 1 and 3. Play the tune twice: the second time, the words are "prête-moi ta plume".</p>`),
    play('Left hand alone', 'Pinky on the C below Middle C. C, then C and G, C and G, and C.', { lh: CLAIR_LH, range: ['C3', 'C5'], keyLabels: 'all', names: true, tempo: 88, reps: 2 }),
    play('Au Clair de la Lune, hands together', 'Both hands. The left hand holds its notes while the right hand sings.', { rh: `${CLAIR_RH} ${CLAIR_RH}`, lh: `${CLAIR_LH} ${CLAIR_LH}`, lyrics: CLAIR_W, song: true, range: ['C3', 'C5'], keyLabels: 'all', names: true, tempo: 88 }),
  ]),

  // Unit 3: reading and rhythm.
  lesson('u3', 'counting', 'survey', 'When I Survey the Wondrous Cross', 'Isaac Watts\'s hymn, counted in 4.', [
    read('A hymn to count', `<p>Isaac Watts wrote these words in 1707, and Lowell Mason's tune <b>Hamburg</b> (1824) is how most churches sing them. It's slow and steady: perfect for counting.</p>
    <p>Most bars are a half note and two quarters, or a whole note at the end of a line: count <b>1-2 3 4</b>, or <b>1-2-3-4</b>. Line two dips to the <b>B</b> below Middle C: reach your thumb down for it, then come back.</p>`),
    play('Lines 1 and 2', 'Thumb on Middle C. Count out loud: 1-2, 3, 4.', { rh: SURVEY.split(' ').slice(0, 20).join(' '), staff: true, names: true, range: ['A3', 'C5'], keyLabels: 'c', tempo: 72, reps: 2 }),
    play('When I Survey the Wondrous Cross', 'All four lines. Hold every whole note for its full four beats.', { rh: SURVEY, lyrics: SURVEY_W, song: true, staff: true, names: false, range: ['A3', 'C5'], keyLabels: 'c', tempo: 76 }),
  ]),
  lesson('u3', 'rests-three', 'kum-ba-yah', 'Kum Ba Yah', 'A spiritual in 3/4, starting with two pickup notes.', [
    read('Three beats in a bar', `<p><b>Kum Ba Yah</b> is a spiritual, first written down in the 1920s. It's in <b>3/4</b>: count "<b>1</b> 2 3" in every bar.</p>
    <p>It starts with two <b>pickup</b> eighth notes, C and E, on beat 3. Each line climbs to G and holds it, and the last line comes home to C.</p>`),
    play('Kum Ba Yah', 'Count "3 and" for the pickup, then "1 2 3". Smooth and gentle.', { rh: KUM, lyrics: KUM_W, song: true, staff: true, names: true, time: '3/4', pickup: 1, range: ['A3', 'C5'], keyLabels: 'c', tempo: 80 }),
  ]),
  lesson('u3', 'largo', 'muss-i-denn', 'Muss i denn', 'A German farewell song with dotted quarters.', [
    read('A farewell song', `<p><b>Muss i denn</b> ("Must I, then, leave the little town?") is a German folk song from the 1820s. Elvis Presley sang it in English as "Wooden Heart".</p>
    <p>It starts with two pickup eighths, C and D. In the middle section, look for the <b>dotted quarter notes</b> you just learned: "<b>1</b>-2 and", long then short.</p>`),
    play('Muss i denn', 'Bouncy, at a walking pace. Feel the long-short of each dotted quarter.', { rh: MUSS, song: true, staff: true, names: true, pickup: 1, range: ['A3', 'C5'], keyLabels: 'c', tempo: 96 }),
  ]),
  lesson('u3', 'repeats', 'fox', 'Fox, You Stole the Goose', 'A German children\'s song in 2/4, with a repeat.', [
    read('Two beats in a bar', `<p><b>Fuchs, du hast die Gans gestohlen</b> ("Fox, you've stolen the goose, give it back!") is a German children's song. It's in <b>2/4</b>: just two beats per bar, mostly running eighth notes.</p>
    <p>"Gib sie wieder her" ("give it back") comes twice, so it's written once between <b>repeat signs</b>.</p>`),
    play('Fox, You Stole the Goose', 'Run up C D E F G. Play the bars inside the repeat signs twice.', { rh: FOX, lyrics: FOX_W, song: true, staff: true, names: true, time: '2/4', range: ['G3', 'C5'], keyLabels: 'c', tempo: 100 }),
  ]),

  // Unit 4: positions and keys.
  lesson('u4', 'sharps-flats', 'christmas-tree', 'O Christmas Tree', 'The German carol in G major, with an F sharp.', [
    read('O Tannenbaum', `<p><b>O Tannenbaum</b> is the German carol known in English as "O Christmas Tree". It's in <b>G major</b>, so watch for the one <b>F♯</b> near the end of the first line.</p>
    <p>It's in 3/4 with a one-beat pickup on D. The middle part climbs higher, up to E.</p>`),
    play('O Christmas Tree', 'Count "3" for the pickup D, then "1 2 3".', { rh: noFingers(TREE), lyrics: TREE_W, song: true, staff: true, names: false, key: 'G', time: '3/4', pickup: 1, range: ['C4', 'F5'], keyLabels: 'c', tempo: 88 }),
  ]),
  lesson('u4', 'd-position', 'gather', 'Shall We Gather at the River', 'Robert Lowry\'s hymn in D major.', [
    read('A hymn in D', `<p>Robert Lowry wrote <b>Shall We Gather at the River</b>, words and tune, in 1864. It sits in your new <b>D position</b>, with F♯ under finger 3, and reaches up to the high D in the refrain.</p>
    <p>The refrain has a <b>C♯</b> just below the high D.</p>`),
    play('Verse', 'Thumb on D. The verse stays close to home.', { rh: GATHER_V, staff: true, names: false, key: 'D', range: ['C4', 'E5'], keyLabels: 'c', tempo: 84, reps: 2 }),
    play('Shall We Gather at the River', 'Verse and refrain.', { rh: `${GATHER_V} ${GATHER_R}`, song: true, staff: true, names: false, key: 'D', range: ['C4', 'E5'], keyLabels: 'c', tempo: 88 }),
  ]),
  lesson('u4', 'f-position', 'friend', 'What a Friend We Have in Jesus', 'A much-loved hymn in F major, with B flat.', [
    read('A hymn in F', `<p>Joseph Scriven wrote these words in 1855 for his mother, and Charles Converse's tune came in 1868. It's in <b>F major</b>, so every B is <b>B♭</b>.</p>
    <p>Each line starts with a <b>dotted quarter</b> and then runs in eighth notes. Line five has one F♯, just before the climb up to the high D.</p>`),
    play('Lines 1 and 2', '"What a friend we have in Jesus, all our sins and griefs to bear."', { rh: FRIEND.split(' ').slice(0, 16).join(' '), staff: true, names: false, key: 'F', range: ['C4', 'E5'], keyLabels: 'c', tempo: 80, reps: 2 }),
    play('What a Friend We Have in Jesus', 'All eight lines. Lines 1, 3 and 7 are the same tune.', { rh: FRIEND, lyrics: FRIEND_W, song: true, staff: true, names: false, key: 'F', range: ['C4', 'E5'], keyLabels: 'c', tempo: 84 }),
  ]),
  lesson('u4', 'minor', 'go-down-moses', 'Go Down, Moses', 'A spiritual in A minor.', [
    read('A minor spiritual', `<p><b>Go Down, Moses</b> is an African American spiritual about the escape from Egypt. It's in a <b>minor</b> key, which gives it its serious, longing sound. Here it's in A minor.</p>
    <p>Listen for the <b>G♯</b> in "let my people go": it pulls up strongly to A.</p>`),
    play('Go Down, Moses', 'Start on E, then up to C. Give the long notes their full value.', { rh: MOSES, song: true, staff: true, names: false, key: 'Am', pickup: 1, range: ['C4', 'D5'], keyLabels: 'c', tempo: 76 }),
  ]),

  // Expression.
  lesson('ux', 'touch', 'go-tell-it', 'Go, Tell It on the Mountain', 'A joyful spiritual with some detached notes.', [
    read('Legato and staccato together', `<p><b>Go, Tell It on the Mountain</b> is a Christmas spiritual. Play it <b>forte</b> and joyful. Most of it is smooth, but "over the hills" and "Jesus" have <b>staccato</b> dots: make them short and bouncy.</p>`),
    play('Go, Tell It on the Mountain', 'Loud and happy. Bounce the staccato notes.', { rh: TELL, lyrics: TELL_W, song: true, staff: true, names: false, key: 'F', range: ['C4', 'C5'], keyLabels: 'c', tempo: 96 }),
  ]),
  lesson('ux', 'cresc-dim', 'jacobs-ladder', 'Jacob\'s Ladder', 'A spiritual that grows louder as it climbs.', [
    read('Climbing the ladder', `<p><b>We Are Climbing Jacob's Ladder</b> is a spiritual whose tune climbs like its words: F♯ to A, E to B, then up to the high D.</p>
    <p>Start <b>piano</b>, make a <b>crescendo</b> as it climbs, reach <b>forte</b> at the top, then <b>diminuendo</b> on the way down.</p>`),
    play('Jacob\'s Ladder', 'Soft, growing, loud, then fading away.', { rh: LADDER, lyrics: LADDER_W, song: true, staff: true, names: false, key: 'D', range: ['C4', 'E5'], keyLabels: 'c', tempo: 88 }),
  ]),
  lesson('ux', 'pedal', 'all-through-the-night', 'All Through the Night', 'A Welsh lullaby with the sustain pedal.', [
    read('Pedal in every bar', `<p><b>Ar Hyd y Nos</b> ("All Through the Night") is a Welsh folk melody, first printed in 1784. Play it gently with the <b>sustain pedal</b>.</p>
    <p>Change the pedal at the start of every bar: lift, then press again straight away. That keeps the sound warm without blurring.</p>`),
    play('All Through the Night', 'Softly. Lift and press the pedal at every bar line.', { rh: NIGHT, lyrics: NIGHT_W, song: true, staff: true, names: false, key: 'G', range: ['C4', 'F5'], keyLabels: 'c', tempo: 80 }),
  ]),
  lesson('ux', 'phrases', 'fairest-lord-jesus', 'Fairest Lord Jesus', 'A hymn tune shaped in six phrases.', [
    read('Six phrases', `<p><b>Fairest Lord Jesus</b> is sung to a Silesian folk tune first printed in 1842. Each slur is one line of the hymn: play it smoothly, then lift gently before the next.</p>
    <p>The third phrase climbs to the high C and grows a little louder. The last phrase starts mezzo-forte and fades away.</p>`),
    play('Fairest Lord Jesus', 'One breath per slur. Lift between them.', { rh: FAIREST, song: true, staff: true, names: false, range: ['A3', 'D5'], keyLabels: 'c', tempo: 80 }),
  ]),

  // Unit 5: harmony.
  lesson('u5', 'major-chords', 'rock-of-ages', 'Rock of Ages', 'A hymn in 3/4 over C, F and G chords.', [
    read('Melody over chords', `<p>Augustus Toplady wrote <b>Rock of Ages</b> in 1776, and Thomas Hastings's tune followed in 1830. The melody goes in your right hand. The left hand plays the <b>C, F and G chords</b> you just learned.</p>
    <p>It's in 3/4 with a short pickup, two eighth notes on beat 3.</p>`),
    play('Left hand chords', 'Mostly C, with G and F where the melody needs them.', { lh: ROCK_LH, staff: true, names: true, time: '3/4', pickup: 1, range: ['G2', 'F5'], keyLabels: 'c', tempo: 72, reps: 2 }),
    play('Rock of Ages, hands together', 'Melody a little louder than the chords.', { rh: ROCK, lh: ROCK_LH, lyrics: ROCK_W, song: true, staff: true, names: false, time: '3/4', pickup: 1, range: ['G2', 'F5'], keyLabels: 'c', tempo: 76 }),
  ]),
  lesson('u5', 'progression', 'tis-so-sweet', '\'Tis So Sweet to Trust in Jesus', 'A hymn in G over G, C and D chords.', [
    read('Chords in G', `<p>Louisa Stead's words (1882) and William Kirkpatrick's tune make one of the best-loved gospel hymns. It's in <b>G major</b>, and the left hand plays <b>G, C and D</b> chords: the same I, IV, V journey you just learned, in a new key.</p>
    <p>The chords hold for a whole bar or half a bar, so your left hand has time to move.</p>`),
    play('Left hand chords', 'G stays under finger 5 except for the D chord.', { lh: SWEET_LH, staff: true, names: true, key: 'G', range: ['E2', 'E5'], keyLabels: 'c', tempo: 76, reps: 2 }),
    play('\'Tis So Sweet, hands together', 'Verse and refrain.', { rh: SWEET, lh: SWEET_LH, lyrics: SWEET_W, song: true, staff: true, names: false, key: 'G', range: ['E2', 'E5'], keyLabels: 'c', tempo: 80 }),
  ]),
  lesson('u5', 'six-eight', 'greensleeves', 'Greensleeves', 'An English tune from the 1500s, in 6/8 and E minor.', [
    read('Greensleeves', `<p><b>Greensleeves</b> is an English tune from the 16th century. Churches sing it at Christmas as "What Child Is This". It's in <b>6/8</b> and <b>E minor</b>.</p>
    <p>It starts with a one-eighth pickup on E. Look for the sharps: F♯ from the key, and D♯ and C♯ near the end of each line.</p>`),
    play('Greensleeves', 'Two big beats per bar, each split into three.', { rh: SLEEVES, song: true, staff: true, names: false, key: 'Em', time: '6/8', pickup: 0.5, range: ['A3', 'E5'], keyLabels: 'c', tempo: 72 }),
  ]),
  lesson('u5', 'six-eight', 'pop-goes-the-weasel', 'Pop Goes the Weasel', 'A bouncy 6/8 dance tune, with a repeat.', [
    read('A jig', `<p><b>Pop Goes the Weasel</b> was a popular dance tune in the 1850s. It's a <b>jig</b>, in 6/8, with a long-short bounce: quarter note, eighth note.</p>
    <p>The "Pop!" is the high A. Play the whole tune twice: it's inside repeat signs.</p>`),
    play('Pop Goes the Weasel', 'Bouncy. Make the "Pop!" loud and short.', { rh: WEASEL, song: true, staff: true, names: false, time: '6/8', range: ['C4', 'C5'], keyLabels: 'c', tempo: 72 }),
  ]),
];
