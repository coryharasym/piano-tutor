// The Doxology (OLD HUNDREDTH, Geneva 1551) grows through the course: a
// little more of it in each unit, until the whole hymn with both hands.
// Melody and rhythm checked against hymnary.org's MusicXML (Bourgeois).
// Unit 1's recital is the first line, so these start in unit 2.

// The four lines in C, as the first recital plays them.
const C1 = 'C4/h/4 C4/q/4 B3/q/3 A3/q/2 G3/q/1 C4/h/1 D4/h/2 E4/h/3';
const C2 = 'E4/h/3 E4/q/3 E4/q/3 D4/q/2 C4/q/1 F4/h/4 E4/h/3 D4/h/2';
const C3 = 'C4/h/2 D4/q/3 E4/q/4 D4/q/3 C4/q/2 A3/h/1 B3/h/2 C4/h/3';
const C4 = 'G4/h/5 E4/q/3 C4/q/1 D4/q/2 F4/q/4 E4/h/3 D4/h/2 C4/h/1';

// And in G major, the key it's usually sung in.
const G1 = 'G4/h/4 G4/q/4 F#4/q/3 E4/q/2 D4/q/1 G4/h/1 A4/h/2 B4/h/3';
const G2 = 'B4/h/3 B4/q/3 B4/q/3 A4/q/2 G4/q/1 C5/h/4 B4/h/3 A4/h/2';
const G3 = 'G4/h/2 A4/q/3 B4/q/4 A4/q/3 G4/q/2 E4/h/1 F#4/h/2 G4/h/3';
const G4 = 'D5/h/5 B4/q/3 G4/q/1 A4/q/2 C5/q/4 B4/h/3 A4/h/2 G4/h/1';

const W1 = 'Praise God, from whom all bless- ings flow;';
const W2 = 'Praise Him, all crea- tures here be- low;';
const W3 = 'Praise Him a- bove, ye heav\'n- ly host;';
const W4 = 'Praise Fa- ther, Son, and Ho- ly Ghost.';
const words = (...lines) => lines.join(' / ');
const ALL_WORDS = words(W1, W2, W3, W4);

// Shaped like a singer would: each line one phrase, the third one quieter,
// growing into a strong last line.
const shaped = (l1, l2, l3, l4) => {
  const [head, tail] = [l3.split(' ').slice(0, 5).join(' '), l3.split(' ').slice(5).join(' ')];
  return `!mf (${l1}) (${l2}) !p (${head} !cresc ${tail}) !f (${l4})`;
};

// Left-hand chords, half a bar each: I, IV and V of the key.
const chordsIn = ({ I, IV, V }) => {
  const plan = {
    1: [I, V, IV, I, V, I],
    2: [I, I, V, IV, I, V],
    3: [I, I, V, IV, V, I],
    4: [I, I, V, I, V, I],
  };
  return (line) => plan[line].join(' ');
};
const inC = chordsIn({ I: '[C3 E3 G3]/h/5-3-1', IV: '[C3 F3 A3]/h/5-2-1', V: '[B2 D3 G3]/h/5-3-1' });
const inG = chordsIn({ I: '[G2 B2 D3]/h/5-3-1', IV: '[G2 C3 E3]/h/5-2-1', V: '[F#2 A2 D3]/h/5-3-1' });
const up = (seq) => seq.replace(/([A-G][#b]?)(\d)/g, (_, n, o) => `${n}${+o + 1}`);

const AMEN_RH = 'G4/h/1 G4/h/1';
const AMEN_LH = '[G2 C3 E3]/h/5-2-1 [G2 B2 D3]/h/5-3-1';

// Each lesson goes into its unit right after the lesson named by `after`.
export const DOXOLOGY_LESSONS = [
  {
    unit: 'u2', after: 'mary',
    lesson: {
      id: 'doxology-2', doxology: true,
      title: 'Doxology: the second line',
      summary: 'Add "Praise Him, all creatures here below" to the line you know.',
      steps: [
        {
          t: 'read', title: 'The Doxology grows',
          body: `<p>Your first recital was the opening line of the <b>Doxology</b>. In every unit from now on you'll add a little more, until you can play the whole hymn with both hands.</p>
          <p>Line two, <b>"Praise Him, all creatures here below"</b>, starts on E with three in a row, steps down to C, then jumps up to F and steps back down.</p>`,
        },
        {
          t: 'play', title: 'Line 2',
          say: 'Thumb on Middle C, so finger 3 is on E. Three Es, then D, C, a little jump to F, and back down E, D.',
          rh: C2, lyrics: W2, range: ['E3', 'G4'], keyLabels: 'all', names: true, tempo: 76, reps: 2,
        },
        {
          t: 'play', title: 'Lines 1 and 2', song: true,
          say: 'Start with finger 4 on Middle C as before. After "flow", move your hand so your thumb is on C again for line two.',
          rh: `${C1} ${C2}`, lyrics: words(W1, W2), range: ['E3', 'G4'], keyLabels: 'all', names: true, tempo: 76,
        },
      ],
    },
  },
  {
    unit: 'u3', after: 'counting',
    lesson: {
      id: 'doxology-3', doxology: true,
      title: 'Doxology: the whole melody',
      summary: 'All four lines, read from the staff and counted in 4.',
      steps: [
        {
          t: 'read', title: 'Four lines, twelve bars',
          staffFig: { staves: [{ clef: 'treble', seq: C3 }], names: true },
          body: `<p>Now you can read the staff and count bars, so here is the <b>whole Doxology melody</b>. Every line is three bars long, and every line has the same rhythm: a half note, four quarters, then three half notes.</p>
          <p>Count it: <b>1-2 3 4 | 1 2 3-4 | 1-2 3-4</b>.</p>`,
        },
        {
          t: 'play', title: 'Line 3',
          say: '"Praise Him above": start with finger 2 on Middle C. When the tune dips to the low A, play it with your thumb, then walk back up B, C.',
          rh: C3, lyrics: W3, staff: true, names: true, range: ['E3', 'A4'], keyLabels: 'c', tempo: 76, reps: 2,
        },
        {
          t: 'play', title: 'Line 4',
          say: 'The last line starts high: thumb on Middle C and finger 5 on G. It skips down G, E, C, then climbs back and walks home to C.',
          rh: C4, lyrics: W4, staff: true, names: true, range: ['E3', 'A4'], keyLabels: 'c', tempo: 76, reps: 2,
        },
        {
          t: 'play', title: 'The whole melody', song: true,
          say: 'All four lines, reading from the staff. Count steadily, and hold each half note for its full two beats.',
          rh: `${C1} ${C2} ${C3} ${C4}`, lyrics: ALL_WORDS, staff: true, names: false, range: ['E3', 'A4'], keyLabels: 'c', tempo: 80,
        },
      ],
    },
  },
  {
    unit: 'u4', after: 'sharps-flats',
    lesson: {
      id: 'doxology-4', doxology: true,
      title: 'Doxology in G major',
      summary: 'The key it\'s sung in, with its one sharp.',
      steps: [
        {
          t: 'read', title: 'The hymnal key',
          body: `<p>Hymnals print the Doxology in <b>G major</b>, so a congregation can sing it comfortably. G major has one sharp, <b>F♯</b>, shown at the start of every line.</p>
          <p>The melody is exactly the same shape as before, just starting on G instead of C. Only one note is sharp: the F♯ in lines one and three.</p>`,
        },
        {
          t: 'play', title: 'Lines 1 and 2',
          say: 'Finger 4 on G above Middle C. Walk down G, F♯, E, D, then thumb back to G and up.',
          rh: `${G1} ${G2}`, lyrics: words(W1, W2), staff: true, names: true, key: 'G', range: ['C4', 'E5'], keyLabels: 'c', tempo: 80, reps: 2,
        },
        {
          t: 'play', title: 'Lines 3 and 4',
          say: 'Line three dips to E and climbs F♯, G. Line four starts on the high D.',
          rh: `${G3} ${G4}`, lyrics: words(W3, W4), staff: true, names: true, key: 'G', range: ['C4', 'E5'], keyLabels: 'c', tempo: 80, reps: 2,
        },
        {
          t: 'play', title: 'The whole Doxology in G', song: true,
          say: 'From the top, in the hymnal key.',
          rh: `${G1} ${G2} ${G3} ${G4}`, lyrics: ALL_WORDS, staff: true, names: false, key: 'G', range: ['C4', 'E5'], keyLabels: 'c', tempo: 84,
        },
      ],
    },
  },
  {
    unit: 'ux', after: 'phrases',
    lesson: {
      id: 'doxology-x', doxology: true,
      title: 'Doxology with expression',
      summary: 'Phrases, a quiet third line, and a strong ending.',
      steps: [
        {
          t: 'read', title: 'Singing it on the piano',
          body: `<p>Each line of the Doxology is one <b>phrase</b>, one breath for a singer. Shape each one with a slur, and lift gently between them.</p>
          <p>Play the first two lines <b>mezzo-forte</b>. Make the third line <b>piano</b>, growing louder at its end, so the last line, "Praise Father, Son, and Holy Ghost", can ring out <b>forte</b>.</p>`,
        },
        {
          t: 'play', title: 'The Doxology, shaped', song: true,
          say: 'Mezzo-forte, mezzo-forte, piano getting louder, then forte. Breathe between the lines.',
          rh: shaped(G1, G2, G3, G4), lyrics: ALL_WORDS, staff: true, names: false, key: 'G', range: ['C4', 'E5'], keyLabels: 'c', tempo: 84,
        },
      ],
    },
  },
  {
    unit: 'u5', after: 'progression',
    lesson: {
      id: 'doxology-5', doxology: true,
      title: 'Doxology with chords',
      summary: 'The melody over left-hand C, F and G chords.',
      steps: [
        {
          t: 'read', title: 'Adding harmony',
          staffFig: { staves: [{ clef: 'treble', seq: up(C1) }, { clef: 'bass', seq: inC(1) }], names: false },
          body: `<p>Now the left hand can play <b>chords</b> under the melody, two to a bar, using the three you know: <b>C, F and G</b>.</p>
          <p>The right hand moves up an octave, to the C above Middle C, so the hands don't bump into each other.</p>`,
        },
        {
          t: 'play', title: 'Left hand chords alone',
          say: 'Line one\'s chords: C, G, F, C, G, C. Keep them soft and even.',
          lh: inC(1), staff: true, names: true, range: ['G2', 'C4'], keyLabels: 'c', tempo: 72, reps: 2,
        },
        {
          t: 'play', title: 'Lines 1 and 2, hands together',
          say: 'Melody a little louder than the chords. Change chord on beats 1 and 3.',
          rh: `${up(C1)} ${up(C2)}`, lh: `${inC(1)} ${inC(2)}`, lyrics: words(W1, W2), staff: true, names: false, range: ['G2', 'A5'], keyLabels: 'c', tempo: 72, reps: 2,
        },
        {
          t: 'play', title: 'Lines 3 and 4, hands together',
          say: 'The same idea for the second half.',
          rh: `${up(C3)} ${up(C4)}`, lh: `${inC(3)} ${inC(4)}`, lyrics: words(W3, W4), staff: true, names: false, range: ['G2', 'A5'], keyLabels: 'c', tempo: 72, reps: 2,
        },
        {
          t: 'play', title: 'The whole hymn with chords', song: true,
          say: 'All four lines, melody over chords.',
          rh: [C1, C2, C3, C4].map(up).join(' '), lh: [1, 2, 3, 4].map(inC).join(' '), lyrics: ALL_WORDS,
          staff: true, names: false, range: ['G2', 'A5'], keyLabels: 'c', tempo: 76,
        },
      ],
    },
  },
  {
    unit: 'u6', after: 'clementi',
    lesson: {
      id: 'doxology-6', doxology: true,
      title: 'The complete Doxology',
      summary: 'The whole hymn in G, hands together, with its Amen.',
      steps: [
        {
          t: 'read', title: 'The whole hymn',
          staffFig: { staves: [{ clef: 'treble', seq: G1 }, { clef: 'bass', seq: inG(1) }], names: false },
          body: `<p>This is where the Doxology has been heading: the <b>complete hymn</b>, in the hymnal key of G major, with both hands, phrasing and dynamics, and the <b>Amen</b> at the end.</p>
          <p>The left-hand chords are G, C and D, played as inversions so your hand hardly moves. The Amen is the "church" ending: a C chord resolving to G.</p>`,
        },
        {
          t: 'play', title: 'Left hand alone',
          say: 'All four lines of chords and the Amen. Let your hand stay in one place: G stays under finger 5 except for the D chord.',
          lh: `${[1, 2, 3, 4].map(inG).join(' ')} ${AMEN_LH}`, staff: true, names: true, range: ['E2', 'G3'], keyLabels: 'c', tempo: 76,
        },
        {
          t: 'play', title: 'Lines 1 and 2, hands together',
          say: 'Melody on top, chords soft underneath.',
          rh: `${G1} ${G2}`, lh: `${inG(1)} ${inG(2)}`, lyrics: words(W1, W2), staff: true, names: false, key: 'G', range: ['E2', 'E5'], keyLabels: 'c', tempo: 76, reps: 2,
        },
        {
          t: 'play', title: 'Lines 3 and 4, and Amen',
          say: 'Quiet third line, growing into the last. Then a slow, gentle Amen.',
          rh: `${G3} ${G4} ${AMEN_RH}`, lh: `${inG(3)} ${inG(4)} ${AMEN_LH}`, lyrics: `${words(W3, W4)} / A- men.`, staff: true, names: false, key: 'G', range: ['E2', 'E5'], keyLabels: 'c', tempo: 76, reps: 2,
        },
        {
          t: 'play', title: 'The complete Doxology', song: true, final: true, hint: false,
          say: 'The whole hymn, both hands, no keyboard hints. Play it like you\'re leading a congregation.',
          rh: `${shaped(G1, G2, G3, G4)} ${AMEN_RH}`, lh: `${[1, 2, 3, 4].map(inG).join(' ')} ${AMEN_LH}`, lyrics: `${ALL_WORDS} / A- men.`,
          staff: true, names: false, key: 'G', range: ['E2', 'E5'], keyLabels: 'none', tempo: 80,
        },
      ],
    },
  },
];
