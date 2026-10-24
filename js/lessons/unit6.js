// Simplified arrangements of public-domain classical pieces.

const MINUET_A = 'D5/q/5 G4/8/1 A4/8/2 B4/8/3 C5/8/4 D5/q/5 G4/q/1 G4/q/1 E5/q/3 C5/8/1 D5/8/2 E5/8/3 F#5/8/4 G5/q/5 G4/q/1 G4/q/1 C5/q/4 D5/8/5 C5/8/4 B4/8/3 A4/8/2 B4/q/3 C5/8/4 B4/8/3 A4/8/2 G4/8/1';
const MINUET_END1 = 'F#4/q/1 G4/8/2 A4/8/3 B4/8/4 G4/8/2 A4/h./3';
const MINUET_END2 = 'A4/q/3 B4/8/4 A4/8/3 G4/8/2 F#4/8/1 G4/h./2';
const MINUET_LH1 = 'G3/h./1 B3/h./1 C4/h./1 B3/h./1 A3/h./2 G3/h./3 D3/h./5 D3/h./5';
const MINUET_LH2 = 'G3/h./1 B3/h./1 C4/h./1 B3/h./1 A3/h./2 G3/h./3 D3/h./5 G2/h./5';

const ELISE_TURN = 'E5/16/5 D#5/16/4 E5/16/5 D#5/16/4 E5/16/5 B4/16/2 D5/16/4 C5/16/3';
// The first two sixteenths (E D#) are a pickup before bar 1.
const ELISE_RH = `${ELISE_TURN} A4/8/1 r/16 C4/16/1 E4/16/2 A4/16/3 B4/8/4 r/16 E4/16/1 G#4/16/3 B4/16/4 C5/8/5 r/16 E4/16/1 ${ELISE_TURN} A4/8/1 r/16 C4/16/1 E4/16/2 A4/16/3 B4/8/4 r/16 E4/16/1 C5/16/3 B4/16/2 A4/q./1`;
const ELISE_LH = 'r/8 r/q. A2/16/5 E3/16/2 A3/16/1 r/8. E2/16/5 E3/16/1 G#3/16/2 r/8. A2/16/5 E3/16/2 A3/16/1 r/8. r/q. A2/16/5 E3/16/2 A3/16/1 r/8. E2/16/5 E3/16/1 G#3/16/2 r/8. A2/q./5';

const PRELUDE_BARS = [
  ['C4', 'E4', 'G4', 'C5', 'E5'], ['C4', 'D4', 'A4', 'D5', 'F5'], ['B3', 'D4', 'G4', 'D5', 'F5'], ['C4', 'E4', 'G4', 'C5', 'E5'],
  ['C4', 'E4', 'A4', 'E5', 'A5'], ['C4', 'D4', 'F#4', 'A4', 'D5'], ['B3', 'D4', 'G4', 'D5', 'G5'], ['B3', 'C4', 'E4', 'G4', 'C5'],
];
const PRELUDE_RH = PRELUDE_BARS.map(([, , a, b, c]) => `r/q ${a}/8/1 ${b}/8/3 ${c}/8/5 ${a}/8/1 ${b}/8/3 ${c}/8/5`).join(' ');
const PRELUDE_LH = PRELUDE_BARS.map(([a, b]) => `${a}/8/5 ${b}/8/2 r/q r/h`).join(' ');

// Schumann, Melody, Op. 68 No. 1: the right-hand tune (top voice), bars 1 to 12.
// Checked against the Mutopia Project engraving.
const MELODY = "!p |: (E5/q D5/q C5/q B4/q A4/8 C5/8 B4/8 D5/8 C5/q G4/q G5/q F5/q E5/q C5/q B4/q A4/q) G4/q r/q :| (D5/q C5/q B4/q) r/q (F5/q E5/q D5/q) r/q !cresc (A5/q G5/q F5/q E5/q D5/8 F5/8 E5/8 G5/8 F5/q. D5/8) !p (E5/q D5/q C5/q B4/q A4/8 C5/8 B4/8 D5/8 C5/q G4/q A5/q G5/q F5/q E5/q D5/8 F5/8 B4/8 D5/8) C5/q r/q";

// Mozart, Minuet in F, K. 2 (written at age 5). Melody and the lowest bass note;
// the triplet in bar 7 is simplified to two eighths. Checked against the Mutopia Project.
const K2_A = '|: F5/8 A5/8 C5/q C5/q D5/8 F5/8 Bb4/q Bb4/q A4/8 C5/8 F4/q E4/q E4/h F4/q C4/8 E4/8 G4/q G4/q C4/8 F4/8 A4/q A4/q E4/8 G4/8 Bb4/q A4/q A4/h G4/q :|';
const K2_B = 'C5/8 Eb5/8 A4/q A4/q Bb4/8 D5/8 G4/q G4/q A4/8 C5/8 F#4/q F#4/q F#4/h G4/q Bb4/8 D5/8 G4/q G4/q A4/8 C5/8 F4/q F4/q G4/8 Bb4/8 E4/q E4/q E4/h F4/q F5/8 A5/8 C5/q C5/q D5/8 F5/8 Bb4/q Bb4/q A4/8 C5/8 F4/q E4/q E4/h F4/q F5/8 A5/8 C5/q C5/q D5/8 F5/8 Bb4/q Bb4/q A4/8 C5/8 F4/q E4/q E4/h F4/q';
const K2_LH_A = '|: F3/h A3/q Bb3/h Bb3/q C4/h C3/q F3/q C3/q F2/q C3/h. C3/h. C3/q E3/q F3/q C4/q G3/q C3/q :|';
const K2_LH_B = 'F#3/h. G3/h. C4/q D4/q D3/q G3/q D3/q G2/q E3/h. F3/h. Bb3/q C4/q C3/q F3/q C3/q F2/q A3/h. Bb3/h. C4/h C3/q D3/h. A3/h. Bb3/h. C4/h C3/q F3/q C3/q F2/q';

// Clementi, Sonatina in C, Op. 36 No. 1, first movement, bars 1 to 8.
// Checked against the Mutopia Project.
const CLEM_RH = "C5/q E5/8 C5/8 G4/q G4/q C5/q E5/8 C5/8 G4/q G5/q (F5/8 E5/8 D5/8 C5/8 B4/8 C5/8 B4/8 C5/8 D5/8 C5/8 B4/8 A4/8) G4/q r/q C5/q E5/8 C5/8 G4/q G4/q E5/q G5/8 E5/8 C5/q E5/8 C5/8 (D5/8 B4/8 C5/8 A4/8 B4/8 G4/8 A4/8 F#4/8) (G4/8 A4/8 B4/8 C5/8 D5/8 E5/8 F#5/8 G5/8)";
const CLEM_LH = 'C3/q r/q r/h C3/q r/q r/h C3/q r/q C3/q r/q G2/q r/q G3/8 F3/8 E3/8 D3/8 C3/q r/q r/h C4/q r/q r/q F#3/q G3/q C3/q D3/q D2/q G2/q r/q r/h';

export default {
  id: 'u6',
  title: 'Classical repertoire',
  blurb: 'Real pieces by Bach, Mozart, Beethoven and Pachelbel, simplified for you.',
  lessons: [
    {
      id: 'minuet-a',
      title: 'Minuet in G, part 1',
      summary: 'The famous minuet from the Anna Magdalena Notebook.',
      steps: [
        {
          t: 'read', title: 'A dance from 1725',
          body: `<p>This minuet appears in a notebook Johann Sebastian Bach gave his wife, Anna Magdalena. It was long credited to Bach, but was most likely written by <b>Christian Petzold</b>. Either way, almost every piano student plays it.</p>
          <p>A minuet is a graceful dance in <b>3/4</b>. The key is <b>G major</b>, so every F is F♯. The fingering shown is a suggestion. Your hand will shift position a few times, so watch the numbers.</p>`,
        },
        {
          t: 'play', title: 'Bars 1 to 4',
          say: 'Right hand. The eighth notes are twice as fast as the quarter notes.',
          rh: MINUET_A.split(' ').slice(0, 16).join(' '), staff: true, names: false, key: 'G', time: '3/4', range: ['F4', 'A5'], keyLabels: 'c', tempo: 84, reps: 2,
        },
        {
          t: 'play', title: 'Bars 5 to 8',
          say: 'Now the second phrase, ending on a long A.',
          rh: `${MINUET_A.split(' ').slice(16).join(' ')} ${MINUET_END1}`, staff: true, names: false, key: 'G', time: '3/4', range: ['F4', 'A5'], keyLabels: 'c', tempo: 84, reps: 2,
        },
        {
          t: 'play', title: 'Part 1 complete', song: true,
          say: 'All eight bars, right hand.',
          rh: `${MINUET_A} ${MINUET_END1}`, staff: true, names: false, key: 'G', time: '3/4', range: ['F4', 'A5'], keyLabels: 'c', tempo: 84,
        },
      ],
    },
    {
      id: 'minuet-b',
      title: 'Minuet in G, part 2',
      summary: 'The second half, then hands together.',
      steps: [
        {
          t: 'play', title: 'Second ending',
          say: 'The music repeats, but this time it ends on G: home.',
          rh: `${MINUET_A} ${MINUET_END2}`, staff: true, names: false, key: 'G', time: '3/4', range: ['F4', 'A5'], keyLabels: 'c', tempo: 84,
        },
        {
          t: 'read', title: 'A simple left hand',
          body: `<p>Here's a simplified left hand: one long note per bar (a dotted half note, three beats). It traces the harmony underneath the melody.</p>
          <p>Practice the left hand alone first, then put them together very slowly.</p>`,
        },
        {
          t: 'play', title: 'Left hand alone',
          say: 'One note per bar. Hold each for three beats.',
          lh: MINUET_LH1, staff: true, names: true, key: 'G', time: '3/4', range: ['C2', 'D4'], keyLabels: 'c', tempo: 84,
        },
        {
          t: 'play', title: 'Minuet in G, hands together', song: true,
          say: 'Both hands. The app waits on every beat where both hands play.',
          rh: `${MINUET_A} ${MINUET_END1} ${MINUET_A} ${MINUET_END2}`, lh: `${MINUET_LH1} ${MINUET_LH2}`,
          staff: true, names: false, key: 'G', time: '3/4', range: ['G2', 'A5'], keyLabels: 'c', tempo: 84,
        },
      ],
    },
    {
      id: 'mozart',
      title: 'Eine kleine Nachtmusik',
      summary: "Mozart's famous opening, in G major.",
      steps: [
        {
          t: 'read', title: 'A little night music',
          body: `<p>Mozart wrote <b>Eine kleine Nachtmusik</b> ("A Little Night Music") in 1787 for strings. Its opening is one of the most recognizable bits of music ever.</p>
          <p>It's built entirely from the <b>G major chord</b> (G B D) and then a <b>D major chord</b> (D F♯ A). Notice the short rests: they give it its crisp, cheeky feel.</p>`,
        },
        {
          t: 'play', title: 'The opening', song: true,
          say: 'Play crisply. Short notes, clean rests.',
          rh: 'G4/q D4/8 r/8 G4/q D4/8 r/8 G4/8 D4/8 G4/8 B4/8 D5/q r/q C5/q A4/8 r/8 C5/q A4/8 r/8 C5/8 A4/8 F#4/8 A4/8 D4/q r/q',
          staff: true, names: false, key: 'G', range: ['C4', 'E5'], keyLabels: 'c', tempo: 100, reps: 2,
        },
      ],
    },
    {
      id: 'sixteenths',
      title: 'Sixteenth notes and 3/8',
      summary: 'Four notes in a beat, and the time signature of Für Elise.',
      steps: [
        {
          t: 'read', title: 'Four to a beat',
          staffFig: { staves: [{ clef: 'treble', seq: 'C4/16 D4/16 E4/16 F4/16 G4/q G4/8 F4/8 E4/q' }], names: true },
          body: `<p>A <b>sixteenth note</b> has two flags, or two beams when they're grouped. Four of them fit into one beat. Count them "<b>1</b> e and a, <b>2</b> e and a".</p>
          <p>Practise them slowly and evenly. Speed comes later, by itself.</p>`,
        },
        {
          t: 'play', title: 'Even sixteenths',
          say: 'Say "1 e and a" for the quick notes, and keep them all the same length.',
          rh: 'C4/16/1 D4/16/2 E4/16/3 F4/16/4 G4/q/5 G4/16/5 F4/16/4 E4/16/3 D4/16/2 C4/q/1 E4/8/3 G4/8/5 E4/16/3 F4/16/4 E4/16/3 D4/16/2 C4/h/1',
          staff: true, names: false, range: ['C4', 'C5'], keyLabels: 'c', tempo: 60, metronome: true,
        },
        {
          t: 'read', title: '3/8 time',
          staffFig: { staves: [{ clef: 'treble', seq: 'C4/8 E4/8 G4/8 G4/16 F4/16 E4/16 D4/16 C4/8' }], time: '3/8', names: true },
          body: `<p><b>3/8</b> means three eighth notes per bar. It goes by quickly, so it's usually felt as <b>one beat per bar</b>, with a little lilt.</p>
          <p>Beethoven wrote <b>Für Elise</b> in 3/8, and its famous opening is all sixteenth notes. This warm-up gets your fingers ready.</p>`,
        },
        {
          t: 'play', title: 'A 3/8 warm-up', song: true, time: '3/8',
          say: 'Three eighths in each bar. The sixteenths come in fours, filling two eighths.',
          rh: 'C4/8/1 E4/8/3 G4/8/5 G4/16/5 F4/16/4 E4/16/3 D4/16/2 C4/8/1 E4/16/3 F4/16/4 G4/16/5 F4/16/4 E4/8/3 D4/q./2 C4/8/1 E4/8/3 G4/8/5 G4/16/5 F4/16/4 E4/16/3 D4/16/2 E4/8/3 D4/16/2 E4/16/3 D4/16/2 C4/16/1 D4/8/2 C4/q./1',
          staff: true, names: false, range: ['C4', 'C5'], keyLabels: 'c', tempo: 72,
        },
      ],
    },
    {
      id: 'fur-elise',
      title: 'Für Elise',
      summary: "Beethoven's most famous piano piece: the opening theme.",
      steps: [
        {
          t: 'read', title: 'For Elise',
          body: `<p>Beethoven wrote <b>Für Elise</b> around 1810. Nobody is quite sure who Elise was! It's in <b>A minor</b> and in <b>3/8</b> time: three eighth-note beats per bar.</p>
          <p>The famous opening rocks between <b>E</b> and <b>D♯</b> (the black key just below E). Then the melody falls down to A, and the hands share a rising broken chord.</p>`,
        },
        {
          t: 'play', title: 'The E–D♯ turn',
          say: 'Just the opening: E D♯ E D♯ E B D C, then A. Fingers 5 4 5 4 5 2 4 3, then 1.',
          rh: `${ELISE_TURN} A4/q./1`, staff: true, names: true, key: 'Am', time: '3/8', pickup: 0.5, range: ['A3', 'G5'], keyLabels: 'c', tempo: 60, reps: 3,
        },
        {
          t: 'play', title: 'Opening theme, right hand', song: true,
          say: 'The whole opening theme, right hand. The keyboard shows you where each note is.',
          rh: ELISE_RH, staff: true, names: false, key: 'Am', time: '3/8', pickup: 0.5, range: ['A3', 'G5'], keyLabels: 'c', tempo: 60,
        },
        {
          t: 'read', title: 'Adding the left hand',
          body: `<p>In the gaps, the left hand plays three quick notes: <b>A E A</b> under the A bars and <b>E E G♯</b> under the B bar. The right hand then continues the rising line.</p>
          <p>Notice how the two hands take turns, like a conversation.</p>`,
        },
        {
          t: 'play', title: 'Für Elise, hands together', song: true,
          say: 'Hands take turns. Go slowly and let each note ring.',
          rh: ELISE_RH, lh: ELISE_LH, staff: true, names: false, key: 'Am', time: '3/8', pickup: 0.5, range: ['A1', 'G5'], keyLabels: 'c', tempo: 54,
        },
      ],
    },
    {
      id: 'prelude-c',
      title: 'Prelude in C',
      summary: "Bach's flowing broken chords, simplified.",
      steps: [
        {
          t: 'read', title: 'The Well-Tempered Clavier',
          body: `<p>This prelude opens Bach's <b>Well-Tempered Clavier</b> (1722). The whole piece is one pattern: each bar is a chord, broken into flowing notes.</p>
          <p>In this simplified version the left hand plays the first two notes of each bar, and the right hand plays the top three notes twice. Let the notes ring into each other.</p>`,
        },
        {
          t: 'play', title: 'Bars 1 to 4',
          say: 'Left hand starts each bar with two notes, then the right hand takes over.',
          rh: PRELUDE_RH.split(' r/q ').slice(0, 4).join(' r/q '), lh: PRELUDE_LH.split(' ').slice(0, 16).join(' '),
          staff: true, names: false, range: ['A3', 'A5'], keyLabels: 'c', tempo: 72,
        },
        {
          t: 'play', title: 'Prelude in C, bars 1 to 8', song: true,
          say: 'All eight bars. Smooth and even, like water.',
          rh: PRELUDE_RH, lh: PRELUDE_LH, staff: true, names: false, range: ['A3', 'A5'], keyLabels: 'c', tempo: 72,
        },
      ],
    },
    {
      id: 'canon',
      title: "Pachelbel's Canon",
      summary: 'The famous melody over the chords you learned.',
      steps: [
        {
          t: 'read', title: 'Melody meets harmony',
          body: `<p>You learned the Canon's chords in the Harmony unit. Its most famous line is a slow, falling melody: <b>E D C B A G A B</b>, one note per chord.</p>
          <p>Here the right hand plays that melody while the left hand plays the roots. Listen to how each melody note fits its chord.</p>`,
        },
        {
          t: 'play', title: 'The melody alone',
          say: 'Slow half notes. Sing it as you play.',
          rh: 'E5/h/5 D5/h/4 C5/h/3 B4/h/2 A4/h/2 G4/h/1 A4/h/2 B4/h/3', staff: true, names: true, range: ['F4', 'G5'], keyLabels: 'c', tempo: 66,
        },
        {
          t: 'play', title: "Pachelbel's Canon", song: true,
          say: 'Hands together. Play it twice: once as written, once even more gently.',
          rh: 'E5/h/5 D5/h/4 C5/h/3 B4/h/2 A4/h/2 G4/h/1 A4/h/2 B4/h/3',
          lh: 'C3/h/1 G2/h/4 A2/h/3 E2/h/5 F2/h/4 C2/h/5 F2/h/2 G2/h/1',
          staff: true, names: false, range: ['C2', 'G5'], keyLabels: 'c', tempo: 66, reps: 2,
        },
      ],
    },
    {
      id: 'schumann-melody',
      title: 'Schumann: Melody',
      summary: 'The first piece in his Album for the Young.',
      steps: [
        {
          t: 'read', title: 'Album for the Young',
          body: `<p>Robert Schumann wrote his <b>Album for the Young</b> (1848) for his daughters to play. "Melody" is the very first piece: a gentle tune over a flowing left hand.</p>
          <p>Here you'll play the tune. Keep it <b>legato</b> under each slur, and lift gently at the end of each phrase like a singer breathing. The first four bars repeat. The music moves around the keyboard, so choose comfortable fingers and let your hand travel.</p>`,
        },
        {
          t: 'play', title: 'Melody, right hand', song: true,
          say: 'Soft and singing. The first line plays twice, then the music climbs and comes home.',
          rh: MELODY, staff: true, names: false, range: ['G4', 'A5'], keyLabels: 'c', tempo: 84,
        },
      ],
    },
    {
      id: 'mozart-minuet',
      title: 'Mozart: Minuet in F',
      summary: 'Written by Mozart when he was five years old.',
      steps: [
        {
          t: 'read', title: 'A five-year-old composer',
          body: `<p>Mozart wrote this <b>Minuet in F</b> (K. 2) in 1762, when he was just five. His father wrote it down in his sister Nannerl's music book.</p>
          <p>It's in <b>F major</b> (B♭ in the key signature) and 3/4. The first half repeats. Each little phrase starts with two quick notes that skip up, then two quarter notes: <b>short-short long long</b>. This version keeps Mozart's melody and the lowest note of his bass.</p>`,
        },
        {
          t: 'play', title: 'First half, right hand [F]', song: true, time: '3/4', key: 'F',
          say: 'Eight bars, played twice. Feel the dance: ONE two three.',
          rh: K2_A, staff: true, names: false, range: ['C4', 'A5'], keyLabels: 'c', tempo: 96,
        },
        {
          t: 'play', title: 'Second half, right hand [F]', song: true, time: '3/4', key: 'F',
          say: 'A darker turn with E♭ and F♯, then the opening returns twice to finish.',
          rh: K2_B, staff: true, names: false, range: ['C4', 'A5'], keyLabels: 'c', tempo: 96,
        },
        {
          t: 'play', title: 'The bass line [F]', song: true, time: '3/4', key: 'F',
          say: 'Left hand alone. Mostly long notes, with a few walking quarter notes at the cadences.',
          lh: `${K2_LH_A} ${K2_LH_B}`, staff: true, names: false, range: ['F2', 'D4'], keyLabels: 'c', tempo: 96,
        },
        {
          t: 'play', title: 'Minuet in F, hands together [F]', song: true, time: '3/4', key: 'F',
          say: 'Both hands, slowly. The app waits for you.',
          rh: `${K2_A} ${K2_B}`, lh: `${K2_LH_A} ${K2_LH_B}`, staff: true, names: false, range: ['F2', 'A5'], keyLabels: 'c', tempo: 84,
        },
      ],
    },
    {
      id: 'clementi',
      title: 'Clementi: Sonatina in C',
      summary: 'The bright opening of every piano student\'s favourite sonatina.',
      steps: [
        {
          t: 'read', title: 'The sonatina',
          body: `<p>A <b>sonatina</b> is a "little sonata". Muzio Clementi's Op. 36 sonatinas (1797) have been played by piano students for over two hundred years, and No. 1 in C is the first of them.</p>
          <p>It opens with a cheerful broken chord, answered by quick running notes. It's in <b>cut time</b> (2/2): two half-note beats in a bar, so it moves along briskly once you know it. Try it bright and confident, with the running eighths smooth and even.</p>`,
        },
        {
          t: 'play', title: 'Right hand, bars 1 to 8', song: true, time: '2/2',
          say: 'Start slowly. Bright on the broken chords, smooth on the running eighths.',
          rh: CLEM_RH, staff: true, names: false, range: ['F#4', 'G5'], keyLabels: 'c', tempo: 88,
        },
        {
          t: 'play', title: 'Left hand, bars 1 to 8', song: true, time: '2/2',
          say: 'The left hand mostly marks the start of each bar. Count the rests.',
          lh: CLEM_LH, staff: true, names: false, range: ['D2', 'C4'], keyLabels: 'c', tempo: 88,
        },
        {
          t: 'play', title: 'Hands together', song: true, time: '2/2',
          say: 'Both hands, as slowly as you need.',
          rh: CLEM_RH, lh: CLEM_LH, staff: true, names: false, range: ['D2', 'G5'], keyLabels: 'c', tempo: 80,
        },
      ],
    },
    {
      id: 'graduation',
      title: 'What comes next',
      summary: 'How to keep improving.',
      steps: [
        {
          t: 'read', title: 'You did it',
          body: `<p>You've gone from finding Middle C to playing Bach, Mozart and Beethoven. That's a real achievement.</p>
          <p>Some habits that keep you improving:</p>
          <ul><li><b>Little and often.</b> 15 minutes every day beats two hours on Sunday.</li>
          <li><b>Warm up with scales</b> (C, G and F major, and A minor) before your pieces.</li>
          <li><b>Practice slowly.</b> Speed comes by itself once the notes are secure.</li>
          <li><b>Hands separately first</b>, then together.</li>
          <li><b>Replay old lessons.</b> Try them with the keyboard hints off and the names hidden.</li></ul>`,
        },
        {
          t: 'read', title: 'Going further',
          body: `<p>When you're ready, look for these classic beginner books and pieces. They're all public domain and freely available online:</p>
          <ul><li>Bach: more pieces from the <b>Anna Magdalena Notebook</b> (Minuet in G minor, Musette in D)</li>
          <li>Clementi: <b>Sonatina in C, Op. 36 No. 1</b></li>
          <li>Schumann: <b>Album for the Young</b> ("Melody", "Soldier's March")</li>
          <li>Burgmüller: <b>25 Easy Studies, Op. 100</b></li></ul>
          <p>A teacher, even for a few lessons, is the best way to check your posture and technique. Enjoy the journey!</p>`,
        },
      ],
    },
  ],
};
