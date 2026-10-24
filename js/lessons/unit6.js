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
