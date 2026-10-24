// One recital per unit: practice the piece in sections, then perform it with
// the keyboard hints switched off. Hymns are public domain (pre-1900 tunes).

// Drop suggested fingerings where the hand moves around too much for them to help.
const noFingers = (seq) => seq.replace(/(\S+\/[^/\s]+)\/[\d-]+/g, '$1');
const alberti = (a, b, c, times = 2) => Array(times).fill(`${a}/8/5 ${c}/8/1 ${b}/8/3 ${c}/8/1`).join(' ');

// The final run-through: no keyboard hints, and no note names once you can read music.
const performance = (step) => ({
  t: 'play', title: 'Your recital', final: true, hint: false, song: true,
  say: 'This is your performance: no keyboard hints this time. Take a breath, sit tall, and play it from start to finish. Tap "Show me" only if you get stuck.',
  ...step,
});

// ---------------------------------------------------------------- Unit 1
const DOXOLOGY = 'C4/h/4 C4/q/4 B3/q/3 A3/q/2 G3/q/1 C4/q/1 D4/q/2 E4/w/3';

// ---------------------------------------------------------------- Unit 2
const JOY_A = 'E4/q/3 E4/q/3 F4/q/4 G4/q/5 G4/q/5 F4/q/4 E4/q/3 D4/q/2 C4/q/1 C4/q/1 D4/q/2 E4/q/3 E4/q./3 D4/8/2 D4/h/2';
const JOY_A2 = 'E4/q/3 E4/q/3 F4/q/4 G4/q/5 G4/q/5 F4/q/4 E4/q/3 D4/q/2 C4/q/1 C4/q/1 D4/q/2 E4/q/3 D4/q./2 C4/8/1 C4/h/1';
// In the middle section the left-hand thumb plays the low G of the melody.
const JOY_B = 'D4/q/2 D4/q/2 E4/q/3 C4/q/1 D4/q/2 E4/8/3 F4/8/4 E4/q/3 C4/q/1 D4/q/2 E4/8/3 F4/8/4 E4/q/3 D4/q/2 C4/q/1 D4/q/2 r/h';
const JOY_LH_A = 'C3/w/5 G3/w/1 C3/w/5 G3/w/1';
const JOY_LH_A2 = 'C3/w/5 G3/w/1 C3/w/5 G3/h/1 C3/h/5';
const JOY_LH_B = 'G3/h/1 C3/h/5 G3/h/1 C3/h/5 G3/w/1 C3/h/5 G3/h/1';

// ---------------------------------------------------------------- Unit 3
// Amazing Grace in C major, 3/4, starting with a one-beat pickup.
const GRACE_1 = 'G3/q/1 C4/h/3 E4/8/5 C4/8/3 E4/h/5 D4/q/4 C4/h/3 A3/q/2 G3/h/1 G3/q/1';
const GRACE_2 = 'C4/h/1 E4/8/3 C4/8/1 E4/h/3 D4/q/2 G4/h./5';
const GRACE_3 = 'r/h E4/q/3 G4/h/5 E4/8/3 G4/8/5 E4/h/3 C4/q/1 G3/h/1 A3/q/2 C4/h/3 A3/q/2 G3/h/1 G3/q/1';
const GRACE_4 = 'C4/h/3 E4/8/5 C4/8/3 E4/h/5 D4/q/4 C4/h./3';

// ---------------------------------------------------------------- Unit 4
// Hark! The Herald Angels Sing (Mendelssohn, 1840), in F major.
const HARK_1 = noFingers('C4/q/1 F4/q/1 F4/q./1 E4/8/1 F4/q/2 A4/q/3 A4/q/3 G4/q/2 C5/q/5 C5/q/5 C5/q./5 Bb4/8/4 A4/q/3 G4/q/2 A4/h/3');
const HARK_2 = noFingers('C4/q/1 F4/q/1 F4/q./1 E4/8/1 F4/q/2 A4/q/3 A4/q/3 G4/q/2 C5/q/5 G4/q/2 G4/q./2 E4/8/1 E4/q/2 D4/q/1 C4/h/1');
const HARK_3 = noFingers('C5/q/5 C5/q/5 C5/q/5 F4/q/1 Bb4/q/4 A4/q/3 A4/q/3 G4/q/2 C5/q/5 C5/q/5 C5/q/5 F4/q/1 Bb4/q/4 A4/q/3 A4/q/3 G4/q/2');
const HARK_4 = noFingers('D5/q/5 D5/q/5 D5/q/5 C5/q/4 Bb4/q/3 A4/q/2 Bb4/h/3 G4/q/1 A4/8/2 Bb4/8/3 C5/q./4 F4/8/1 F4/q/1 G4/q/2 A4/h/3');
const HARK_5 = noFingers('D5/q./5 D5/8/5 D5/q/5 C5/q/4 Bb4/q/3 A4/q/2 Bb4/h/3 G4/q/1 A4/8/2 Bb4/8/3 C5/q./4 F4/8/1 F4/q/1 G4/q/2 F4/h/1');

// ---------------------------------------------------------------- Unit 5
// Silent Night (Gruber, 1818), in C major, 6/8, with left-hand chords.
const NIGHT_RH = [
  'G4/q./2 A4/8/3 G4/q/2 E4/h./1 G4/q./2 A4/8/3 G4/q/2 E4/h./1',
  'D5/h/5 D5/q/5 B4/h./3 C5/h/4 C5/q/4 G4/h./1',
  'A4/h/2 A4/q/2 C5/q./4 B4/8/3 A4/q/2 G4/q./1 A4/8/2 G4/q/1 E4/h./1',
  'A4/h/2 A4/q/2 C5/q./4 B4/8/3 A4/q/2 G4/q./1 A4/8/2 G4/q/1 E4/h./1',
  'D5/h/4 D5/q/4 F5/q./5 D5/8/4 B4/q/2 C5/h./3 E5/h./5',
  'C5/q./5 G4/8/2 E4/q/1 G4/q./3 F4/8/2 D4/q/1 C4/h./1',
].map(noFingers);
const C = '[C3 E3 G3]/h./5-3-1', G = '[B2 D3 G3]/h./5-3-1', F = '[C3 F3 A3]/h./5-2-1';
const NIGHT_LH = [
  [C, C, C, C], [G, G, C, C], [F, F, C, C], [F, F, C, C], [G, G, C, C], [C, G, C],
].map((line) => line.join(' '));

// ---------------------------------------------------------------- Unit 6
// Joyful, Joyful: the melody an octave higher over an Alberti bass.
const up = (seq) => seq.replace(/([A-G][#b]?)(\d)/g, (_, n, o) => `${n}${+o + 1}`);
const Cb = (t = 2) => alberti('C3', 'E3', 'G3', t);
const Gb = (t = 2) => alberti('B2', 'D3', 'G3', t);
const FIN_A = up(JOY_A), FIN_A2 = up(JOY_A2);
const FIN_B = 'D5/q/2 D5/q/2 E5/q/3 C5/q/1 D5/q/2 E5/8/3 F5/8/4 E5/q/3 C5/q/1 D5/q/2 E5/8/3 F5/8/4 E5/q/3 D5/q/2 C5/q/1 D5/q/2 G4/h/1';
const FIN_LH_A = [Cb(), Gb(), Cb(), Gb()].join(' ');
const FIN_LH_A2 = [Cb(), Gb(), Cb(), Gb(1), Cb(1)].join(' ');
const FIN_LH_B = [Gb(1), Cb(1), Gb(1), Cb(1), Gb(), Cb(1), Gb(1)].join(' ');

const CLASSIC = [
  {
    id: 'doxology', level: 1,
    title: 'The Doxology',
    summary: 'Your first piece: the opening of a 450-year-old hymn tune.',
    steps: [
      {
        t: 'read', title: 'Your first recital',
        body: `<p>Every unit ends with a <b>recital</b>: a piece to practice and then perform from start to finish, with no hints from the keyboard.</p>
        <p>Your first piece is the opening line of the <b>Doxology</b> ("Praise God, from whom all blessings flow"). Its tune, called <b>Old Hundredth</b>, was published in Geneva in 1551 and has been sung ever since.</p>
        <p>The first half walks <b>down</b> the white keys from Middle C: C C B A G. Then your thumb hops back to Middle C and walks <b>up</b>: C D E.</p>`,
      },
      {
        t: 'play', title: 'Walking down',
        say: 'Put finger 4 on Middle C. Walk down: C C B A G, ending on your thumb.',
        rh: 'C4/h/4 C4/q/4 B3/q/3 A3/q/2 G3/q/1', range: ['E3', 'G4'], keyLabels: 'all', names: true, reps: 2,
      },
      {
        t: 'play', title: 'Walking up',
        say: 'Move your thumb to Middle C and walk up: C D E. Hold the last note.',
        rh: 'C4/q/1 D4/q/2 E4/h/3', range: ['E3', 'G4'], keyLabels: 'all', names: true, reps: 2,
      },
      {
        t: 'play', title: 'Dress rehearsal',
        say: 'The whole line, with hints. Tap Listen to hear how it should sound.',
        rh: DOXOLOGY, range: ['E3', 'G4'], keyLabels: 'all', names: true, tempo: 76,
      },
      performance({ rh: DOXOLOGY, range: ['E3', 'G4'], keyLabels: 'c', names: true, tempo: 76 }),
    ],
  },

  {
    id: 'joyful', level: 2,
    title: 'Joyful, Joyful, We Adore Thee',
    summary: 'The hymn set to Beethoven\'s Ode to Joy, with both hands.',
    steps: [
      {
        t: 'read', title: 'A hymn from Beethoven',
        body: `<p>In 1907 Henry van Dyke wrote the words <b>"Joyful, Joyful, We Adore Thee"</b> to fit Beethoven's Ode to Joy melody. It's now one of the best-loved hymns in the world.</p>
        <p>The hymn has four lines. You already know three of them! The new one is the <b>third line</b>, which bounces between D and E and has quick eighth notes.</p>
        <p>At the end of that line the melody dips to a low G. Your <b>left-hand thumb</b> plays it, since it's sitting right there.</p>`,
      },
      {
        t: 'play', title: 'The new middle line',
        say: 'Right hand. Watch the quick F between the Es. The left thumb plays the final low G.',
        rh: JOY_B, lh: JOY_LH_B, range: ['C3', 'C5'], keyLabels: 'all', names: true, tempo: 92, reps: 2,
      },
      {
        t: 'play', title: 'Dress rehearsal',
        say: 'All four lines, both hands, with hints.',
        rh: `${JOY_A} ${JOY_A2} ${JOY_B} ${JOY_A2}`, lh: `${JOY_LH_A} ${JOY_LH_A2} ${JOY_LH_B} ${JOY_LH_A2}`,
        range: ['C3', 'C5'], keyLabels: 'all', names: true, tempo: 96, song: true,
      },
      performance({
        rh: `${JOY_A} ${JOY_A2} ${JOY_B} ${JOY_A2}`, lh: `${JOY_LH_A} ${JOY_LH_A2} ${JOY_LH_B} ${JOY_LH_A2}`,
        range: ['C3', 'C5'], keyLabels: 'c', names: true, tempo: 96,
      }),
    ],
  },

  {
    id: 'amazing-grace', level: 3,
    title: 'Amazing Grace',
    summary: 'A gentle waltz-time hymn, read from the staff.',
    steps: [
      {
        t: 'read', title: 'Amazing Grace',
        staffFig: { staves: [{ clef: 'treble', seq: 'G3/q C4/h E4/8 C4/8 E4/h D4/q' }], names: true, time: '3/4' },
        body: `<p>John Newton wrote the words in 1772. The tune everyone knows, <b>"New Britain"</b>, was joined to them in 1835.</p>
        <p>It's in <b>3/4</b> and starts with a <b>pickup</b>: a single beat before the first full bar. Count "3" for the pickup, then "<b>1</b> 2 3" in every bar.</p>
        <p>Hand position: thumb on the <b>G below Middle C</b>. In the second line your hand moves up so the thumb sits on Middle C, and then comes back.</p>`,
      },
      {
        t: 'play', title: 'Line 1',
        say: 'Thumb on low G. Read the staff; the little curls are eighth notes.',
        rh: GRACE_1, staff: true, names: true, time: '3/4', pickup: 1, range: ['E3', 'C5'], keyLabels: 'c', tempo: 84, reps: 2,
      },
      {
        t: 'play', title: 'Line 2',
        say: 'Thumb moves to Middle C. Hold the high G for three beats.',
        rh: GRACE_2, staff: true, names: true, time: '3/4', range: ['E3', 'C5'], keyLabels: 'c', tempo: 84, reps: 2,
      },
      {
        t: 'play', title: 'Lines 3 and 4',
        say: 'Two silent beats, then up high again. Then back to low G for the ending.',
        rh: `${GRACE_3} ${GRACE_4}`, staff: true, names: true, time: '3/4', range: ['E3', 'C5'], keyLabels: 'c', tempo: 84,
      },
      {
        t: 'play', title: 'Dress rehearsal',
        say: 'The whole hymn, with hints.',
        rh: `${GRACE_1} ${GRACE_2} ${GRACE_3} ${GRACE_4}`, staff: true, names: false, time: '3/4', pickup: 1, range: ['E3', 'C5'], keyLabels: 'c', tempo: 84, song: true,
      },
      performance({
        rh: `${GRACE_1} ${GRACE_2} ${GRACE_3} ${GRACE_4}`, staff: true, names: false, time: '3/4', pickup: 1, range: ['E3', 'C5'], keyLabels: 'none', tempo: 84,
      }),
    ],
  },

  {
    id: 'hark', level: 4,
    title: 'Hark! The Herald Angels Sing',
    summary: "Mendelssohn's carol, in F major with B♭.",
    steps: [
      {
        t: 'read', title: 'Hark! The Herald Angels Sing',
        body: `<p>Charles Wesley wrote the words in 1739. The tune comes from a piece Felix <b>Mendelssohn</b> composed in 1840, and the two were joined in 1855.</p>
        <p>We'll play it in <b>F major</b>, so every B is <b>B♭</b>. Most of it sits in F position (thumb on F), with a few reaches: down to the C below for the opening note, and up to C and D at the top.</p>
        <p>Look for the <b>dotted rhythm</b> ("long-short") on "her-ald" and "glo-ry".</p>`,
      },
      {
        t: 'play', title: 'Lines 1 and 2',
        say: '"Hark! the herald angels sing, Glory to the newborn King…" Then the second line ends low.',
        rh: `${HARK_1} ${HARK_2}`, staff: true, names: true, key: 'F', range: ['C4', 'E5'], keyLabels: 'c', tempo: 92, reps: 2,
      },
      {
        t: 'play', title: 'Line 3',
        say: '"Joyful, all ye nations, rise…" Repeated high Cs, then a jump down to F.',
        rh: HARK_3, staff: true, names: true, key: 'F', range: ['C4', 'E5'], keyLabels: 'c', tempo: 92, reps: 2,
      },
      {
        t: 'play', title: 'Lines 4 and 5',
        say: '"With angelic host proclaim…" and the famous ending, "Hark! the herald angels sing, Glory to the newborn King!"',
        rh: `${HARK_4} ${HARK_5}`, staff: true, names: true, key: 'F', range: ['C4', 'E5'], keyLabels: 'c', tempo: 92, reps: 2,
      },
      {
        t: 'play', title: 'Dress rehearsal',
        say: 'The whole carol, with hints.',
        rh: `${HARK_1} ${HARK_2} ${HARK_3} ${HARK_4} ${HARK_5}`, staff: true, names: false, key: 'F', range: ['C4', 'E5'], keyLabels: 'c', tempo: 96, song: true,
      },
      performance({
        rh: `${HARK_1} ${HARK_2} ${HARK_3} ${HARK_4} ${HARK_5}`, staff: true, names: false, key: 'F', range: ['C4', 'E5'], keyLabels: 'none', tempo: 96,
      }),
    ],
  },

  {
    id: 'silent-night', level: 5,
    title: 'Silent Night',
    summary: 'Melody with left-hand chords, in gentle 6/8 time.',
    steps: [
      {
        t: 'read', title: 'Silent Night',
        body: `<p>Franz Xaver <b>Gruber</b> wrote this melody for a Christmas Eve service in Oberndorf, Austria, in <b>1818</b>, with words by Joseph Mohr.</p>
        <p>It's in <b>6/8</b>: six eighth notes per bar, felt as two slow, swaying beats. Count "<b>1</b> 2 3 <b>4</b> 5 6".</p>
        <p>The left hand plays just <b>three chords</b> you already know: <b>C</b> (C E G), <b>F</b> (C F A) and <b>G</b> (B D G), one chord per bar, held long.</p>`,
      },
      {
        t: 'play', title: 'Melody, first half',
        say: '"Silent night, holy night, all is calm, all is bright…"',
        rh: `${NIGHT_RH[0]} ${NIGHT_RH[1]}`, staff: true, names: true, time: '6/8', range: ['A2', 'G5'], keyLabels: 'c', tempo: 72, reps: 2,
      },
      {
        t: 'play', title: 'Melody, second half',
        say: '"Round yon virgin… Holy infant… Sleep in heavenly peace."',
        rh: NIGHT_RH.slice(2).join(' '), staff: true, names: true, time: '6/8', range: ['A2', 'G5'], keyLabels: 'c', tempo: 72,
      },
      {
        t: 'play', title: 'Left-hand chords',
        say: 'Left hand alone: C, G and F chords. Move as little as you can between them.',
        lh: NIGHT_LH.join(' '), staff: true, names: true, time: '6/8', range: ['A2', 'C4'], keyLabels: 'c', tempo: 72,
      },
      {
        t: 'play', title: 'Dress rehearsal',
        say: 'Hands together, with hints. Each chord lands with the first melody note of its bar.',
        rh: NIGHT_RH.join(' '), lh: NIGHT_LH.join(' '), staff: true, names: false, time: '6/8', range: ['A2', 'G5'], keyLabels: 'c', tempo: 72, song: true,
      },
      performance({
        rh: NIGHT_RH.join(' '), lh: NIGHT_LH.join(' '), staff: true, names: false, time: '6/8', range: ['A2', 'G5'], keyLabels: 'none', tempo: 72,
      }),
    ],
  },

  {
    id: 'joyful-finale', level: 6,
    title: 'Joyful, Joyful (grand finale)',
    summary: 'The hymn you learned in unit 2, now with a full classical accompaniment.',
    steps: [
      {
        t: 'read', title: 'Your graduation piece',
        body: `<p>For your final recital, you'll return to <b>"Joyful, Joyful, We Adore Thee"</b>, but played the way a pianist would play it in church or a concert.</p>
        <ul><li>The right hand plays the melody <b>an octave higher</b>, so it rings out brightly.</li>
        <li>The left hand plays a flowing <b>Alberti bass</b> (bottom, top, middle, top), switching between <b>C</b> and <b>G</b> chords.</li></ul>
        <p>Compare where you started in unit 2 with this. That's how far you've come.</p>`,
      },
      {
        t: 'play', title: 'Left hand alone',
        say: 'The Alberti pattern for the first line: C chord, G chord, C chord, G chord.',
        lh: FIN_LH_A, staff: true, names: true, range: ['G2', 'C4'], keyLabels: 'c', tempo: 80, reps: 2,
      },
      {
        t: 'play', title: 'Line 1, hands together',
        say: 'Right hand starts on the E above the C an octave over Middle C.',
        rh: FIN_A, lh: FIN_LH_A, staff: true, names: false, range: ['G2', 'A5'], keyLabels: 'c', tempo: 80, reps: 2,
      },
      {
        t: 'play', title: 'The middle line, hands together',
        say: 'Chords change every two beats here. Go slowly.',
        rh: FIN_B, lh: FIN_LH_B, staff: true, names: false, range: ['G2', 'A5'], keyLabels: 'c', tempo: 76, reps: 2,
      },
      {
        t: 'play', title: 'Dress rehearsal',
        say: 'The whole hymn, both hands, with hints.',
        rh: `${FIN_A} ${FIN_A2} ${FIN_B} ${FIN_A2}`, lh: `${FIN_LH_A} ${FIN_LH_A2} ${FIN_LH_B} ${FIN_LH_A2}`,
        staff: true, names: false, range: ['G2', 'A5'], keyLabels: 'c', tempo: 84, song: true,
      },
      performance({
        title: 'Your final recital',
        say: 'Your graduation performance. No hints, steady and proud. Enjoy it!',
        rh: `${FIN_A} ${FIN_A2} ${FIN_B} ${FIN_A2}`, lh: `${FIN_LH_A} ${FIN_LH_A2} ${FIN_LH_B} ${FIN_LH_A2}`,
        staff: true, names: false, range: ['G2', 'A5'], keyLabels: 'none', tempo: 84,
      }),
    ],
  },
];

// ---------------------------------------------------------------- More hymns
// Jesus Loves Me (William Bradbury, 1862), verse and chorus.
const JLM_V12 = 'G4/q E4/q E4/q D4/q E4/q G4/q G4/h A4/q A4/q C5/q A4/q A4/q G4/q G4/h';
const JLM_V34 = 'G4/q E4/q E4/q D4/q E4/q G4/q G4/h A4/q A4/q G4/q C4/q E4/q D4/q C4/h';
const JLM_CH = 'G4/h E4/q G4/q A4/q C5/h. G4/h E4/q C4/q E4/q D4/h. G4/h E4/q G4/q A4/q C5/h A4/q G4/q C4/q E4/q D4/q C4/w';
const JLM = `${JLM_V12} ${JLM_V34} ${JLM_CH}`;

// When the Saints Go Marching In, all in C position.
const SAINTS_1 = 'r/q C4/q/1 E4/q/3 F4/q/4 G4/w/5 r/q C4/q/1 E4/q/3 F4/q/4 G4/w/5 r/q C4/q/1 E4/q/3 F4/q/4 G4/h/5 E4/h/3 C4/h/1 E4/h/3 D4/w/2';
const SAINTS_2 = 'r/q E4/q/3 E4/q/3 D4/q/2 C4/h./1 C4/q/1 E4/h/3 G4/h/5 G4/q/5 F4/h./4 r/q E4/q/3 F4/q/4 G4/q/5 E4/h/3 C4/h/1 D4/w/2 C4/w/1';

// Simple Gifts (Joseph Brackett, 1848), in C with a one-beat pickup.
const GIFTS_1 = 'G3/q C4/q C4/8 C4/8 E4/8 D4/8 E4/8 F4/8 G4/q G4/8 G4/8 E4/q E4/8 E4/8 D4/q D4/q D4/q D4/8 E4/8 F4/8 E4/8 D4/8 C4/8 B3/q G3/8 G3/8';
const GIFTS_2 = 'C4/q C4/8 C4/8 E4/8 D4/8 E4/8 F4/8 G4/q G4/8 G4/8 E4/q E4/8 E4/8 D4/q D4/q E4/q E4/8 D4/8 C4/q C4/q C4/h';
const GIFTS_3 = 'G4/h E4/q. D4/8 E4/8 F4/8 E4/8 D4/8 C4/h E4/q E4/8 F4/8 G4/q F4/8 E4/8 D4/q D4/q D4/q G3/8 G3/8';
const GIFTS_4 = 'C4/q C4/q C4/q. D4/8 E4/8 D4/8 E4/8 F4/8 G4/q F4/8 E4/8 D4/q D4/q E4/q E4/8 D4/8 C4/q C4/q C4/h';
const GIFTS = `${GIFTS_1} ${GIFTS_2} ${GIFTS_3} ${GIFTS_4}`;

// Joy to the World (tune "Antioch", Lowell Mason, 1839), in C.
const WORLD_1 = 'C5/h B4/q. A4/8 G4/h. F4/q E4/h D4/h C4/h. G4/q';
const WORLD_2 = 'A4/h. A4/q B4/h. B4/q C5/h. C5/q C5/q B4/q A4/q G4/q G4/q. F4/8 E4/q C5/q C5/q B4/q A4/q G4/q G4/q. F4/8 E4/q E4/q';
const WORLD_3 = 'E4/q E4/q E4/q E4/8 F4/8 G4/h. F4/8 E4/8 D4/q D4/q D4/q D4/8 E4/8 F4/h. E4/8 D4/8 C4/q C5/h A4/q G4/q. F4/8 E4/q F4/q E4/h D4/h C4/w';
const WORLD = `${WORLD_1} ${WORLD_2} ${WORLD_3}`;

// Away in a Manger (tune "Mueller", James R. Murray, 1887), in C, 3/4.
const MANGER_1 = 'G4/q G4/q. F4/8 E4/q E4/q D4/q C4/q C4/q B3/q A3/q G3/h G3/q G3/q. A3/8 G3/q G3/q D4/q B3/q A3/q G3/q C4/q E4/h';
const MANGER_2 = 'G4/q G4/q. F4/8 E4/q E4/q D4/q C4/q C4/q B3/q A3/q G3/h G3/q F4/q. E4/8 D4/q E4/q D4/q C4/q D4/q A3/q B3/q C4/h.';
const MANGER = `${MANGER_1} ${MANGER_2}`;

// O Come, All Ye Faithful (tune "Adeste Fideles", John Francis Wade, about 1745), in G.
const FAITHFUL_V = 'G4/q G4/h D4/q G4/q A4/h D4/h B4/q A4/q B4/q C5/q B4/h A4/q G4/q G4/h F#4/q E4/q F#4/q G4/q A4/q B4/q F#4/h E4/q. D4/8 D4/h. r/q';
const FAITHFUL_M = 'D5/h C5/q B4/q C5/h B4/h A4/q B4/q G4/q A4/q F#4/q. E4/8 D4/q G4/q';
const FAITHFUL_R = 'G4/q F#4/q G4/q A4/q G4/h D4/q B4/q B4/q A4/q B4/q C5/q B4/h A4/q B4/q C5/q B4/q A4/q G4/q F#4/h G4/q C5/q B4/h A4/q. G4/8 G4/w';
const FAITHFUL = `${FAITHFUL_V} ${FAITHFUL_M} ${FAITHFUL_R}`;

// O Come, O Come, Emmanuel (tune "Veni Emmanuel", 15th century), in E minor.
const EMM_1 = 'E4/q G4/q B4/q B4/q B4/q A4/q C5/q B4/q A4/q G4/h. A4/q B4/q G4/q E4/q G4/q A4/q F#4/q E4/q D4/q E4/h.';
const EMM_2 = 'A4/q A4/q E4/q E4/q F#4/q G4/h F#4/q E4/q D4/h. G4/q A4/q B4/q B4/q B4/q A4/q C5/q B4/q A4/q G4/h.';
const EMM_R = 'D5/q D5/h. B4/q B4/h. B4/q A4/q C5/q B4/q A4/q G4/h. A4/q B4/q G4/q E4/q G4/q A4/q F#4/q E4/q D4/q E4/w';
const EMM = `${EMM_1} ${EMM_2} ${EMM_R}`;

const MORE = [
  {
    id: 'jesus-loves-me', level: 1,
    title: 'Jesus Loves Me',
    summary: 'A gentle children\'s hymn that climbs a little higher.',
    steps: [
      {
        t: 'read', title: 'Jesus Loves Me',
        body: `<p>Anna Bartlett Warner wrote these words in 1860, and William <b>Bradbury</b> gave them their tune two years later. It has been sung by children all over the world ever since.</p>
        <p>The verse starts on <b>G</b> and leans down to E: "G E E D E G G". Then it reaches up to <b>A</b> and the high <b>C</b>.</p>
        <p>Your hand will need to move a little. Follow the note names on the keys, and don't worry about which finger plays which note yet.</p>`,
      },
      {
        t: 'play', title: 'Verse, first half',
        say: '"Jesus loves me, this I know, for the Bible tells me so."',
        rh: JLM_V12, range: ['A3', 'E5'], keyLabels: 'all', names: true, tempo: 88, reps: 2,
      },
      {
        t: 'play', title: 'Verse, second half',
        say: '"Little ones to Him belong; they are weak, but He is strong." It ends back on Middle C.',
        rh: JLM_V34, range: ['A3', 'E5'], keyLabels: 'all', names: true, tempo: 88, reps: 2,
      },
      {
        t: 'play', title: 'The chorus',
        say: '"Yes, Jesus loves me…" Hold the long notes for their full count.',
        rh: JLM_CH, range: ['A3', 'E5'], keyLabels: 'all', names: true, tempo: 88, reps: 2,
      },
      {
        t: 'play', title: 'Dress rehearsal',
        say: 'Verse and chorus together, with hints.',
        rh: JLM, range: ['A3', 'E5'], keyLabels: 'all', names: true, tempo: 88, song: true,
      },
      performance({ rh: JLM, range: ['A3', 'E5'], keyLabels: 'c', names: true, tempo: 88 }),
    ],
  },
  {
    id: 'saints', level: 2,
    title: 'When the Saints Go Marching In',
    summary: 'A lively spiritual in C position, with rests to count.',
    steps: [
      {
        t: 'read', title: 'When the Saints Go Marching In',
        body: `<p>This African-American spiritual became the anthem of <b>New Orleans</b> jazz bands. It's bright, bouncy and fun to play.</p>
        <p>It sits entirely in <b>C position</b>: thumb on Middle C, one finger per key up to G.</p>
        <p>Most lines start with a <b>rest</b>: a silent beat. Count "1" in your head, then play on "2 3 4". The long notes are <b>whole notes</b>: hold them for four beats.</p>`,
      },
      {
        t: 'play', title: 'Lines 1 and 2',
        say: '"Oh when the saints go marching in…" Rest on beat 1, then C E F and a long G.',
        rh: SAINTS_1, range: ['A3', 'C5'], keyLabels: 'all', names: true, tempo: 104, reps: 2,
      },
      {
        t: 'play', title: 'Lines 3 and 4',
        say: '"Oh Lord, I want to be in that number…" and home to C.',
        rh: SAINTS_2, range: ['A3', 'C5'], keyLabels: 'all', names: true, tempo: 104, reps: 2,
      },
      {
        t: 'play', title: 'Dress rehearsal',
        say: 'The whole song, with hints. Keep the beat steady through the rests.',
        rh: `${SAINTS_1} ${SAINTS_2}`, range: ['A3', 'C5'], keyLabels: 'all', names: true, tempo: 108, song: true,
      },
      performance({ rh: `${SAINTS_1} ${SAINTS_2}`, range: ['A3', 'C5'], keyLabels: 'c', names: true, tempo: 108 }),
    ],
  },
  {
    id: 'simple-gifts', level: 3,
    title: 'Simple Gifts',
    summary: 'A Shaker song full of skipping eighth notes, read from the staff.',
    steps: [
      {
        t: 'read', title: 'Simple Gifts',
        staffFig: { staves: [{ clef: 'treble', seq: 'G3/q C4/q C4/8 C4/8 E4/8 D4/8 E4/8 F4/8' }], names: true },
        body: `<p>Joseph <b>Brackett</b>, a Shaker elder in Maine, wrote "Simple Gifts" in 1848. A century later Aaron <b>Copland</b> made it famous in his ballet <i>Appalachian Spring</i>.</p>
        <p>It starts with a one-beat <b>pickup</b> on the G below Middle C. After that, look for pairs of <b>eighth notes</b>: two notes in the time of one beat. Say "1 and 2 and" as you play them.</p>`,
      },
      {
        t: 'play', title: 'Line 1',
        say: '"\'Tis the gift to be simple, \'tis the gift to be free…"',
        rh: GIFTS_1, staff: true, names: true, pickup: 1, range: ['E3', 'C5'], keyLabels: 'c', tempo: 88, reps: 2,
      },
      {
        t: 'play', title: 'Line 2',
        say: '"\'Tis the gift to come down where we ought to be." It ends on Middle C.',
        rh: GIFTS_2, staff: true, names: true, range: ['E3', 'C5'], keyLabels: 'c', tempo: 88, reps: 2,
      },
      {
        t: 'play', title: 'Lines 3 and 4',
        say: 'The second half starts high on G, then dances back down.',
        rh: `${GIFTS_3} ${GIFTS_4}`, staff: true, names: true, range: ['E3', 'C5'], keyLabels: 'c', tempo: 88,
      },
      {
        t: 'play', title: 'Dress rehearsal',
        say: 'The whole song, with hints.',
        rh: GIFTS, staff: true, names: false, pickup: 1, range: ['E3', 'C5'], keyLabels: 'c', tempo: 92, song: true,
      },
      performance({ rh: GIFTS, staff: true, names: false, pickup: 1, range: ['E3', 'C5'], keyLabels: 'none', tempo: 92 }),
    ],
  },
  {
    id: 'joy-to-the-world', level: 4,
    title: 'Joy to the World',
    summary: 'A carol that opens with a whole scale, walking down from high C.',
    steps: [
      {
        t: 'read', title: 'Joy to the World',
        staffFig: { staves: [{ clef: 'treble', seq: 'C5/h B4/q. A4/8 G4/h. F4/q E4/h D4/h C4/w' }], names: true, maxBars: 2 },
        body: `<p>Isaac <b>Watts</b> wrote the words in 1719. The tune, called "Antioch", was arranged by Lowell <b>Mason</b> in 1839.</p>
        <p>The first line is simply the <b>C major scale</b>, walking down from high C to Middle C. Use your scale fingering: start with finger 5 on high C, and cross finger 3 over your thumb after G.</p>
        <p>Watch for the <b>dotted</b> notes: "long-short".</p>`,
      },
      {
        t: 'play', title: 'Line 1',
        say: '"Joy to the world! The Lord is come." Walk all the way down the scale.',
        rh: WORLD_1, staff: true, names: true, range: ['A3', 'E5'], keyLabels: 'c', tempo: 96, reps: 2,
      },
      {
        t: 'play', title: 'Lines 2 and 3',
        say: '"Let earth receive her King…" Climb back up to high C, then two little falling phrases.',
        rh: WORLD_2, staff: true, names: true, range: ['A3', 'E5'], keyLabels: 'c', tempo: 96, reps: 2,
      },
      {
        t: 'play', title: 'The ending',
        say: '"And heaven and nature sing…" Repeated notes, then a leap to high C and home.',
        rh: WORLD_3, staff: true, names: true, range: ['A3', 'E5'], keyLabels: 'c', tempo: 96, reps: 2,
      },
      {
        t: 'play', title: 'Dress rehearsal',
        say: 'The whole carol, with hints.',
        rh: WORLD, staff: true, names: false, range: ['A3', 'E5'], keyLabels: 'c', tempo: 100, song: true,
      },
      performance({ rh: WORLD, staff: true, names: false, range: ['A3', 'E5'], keyLabels: 'none', tempo: 100 }),
    ],
  },
  {
    id: 'away-in-a-manger', level: 3,
    title: 'Away in a Manger',
    summary: 'A lullaby carol in 3/4 that floats gently downward.',
    steps: [
      {
        t: 'read', title: 'Away in a Manger',
        staffFig: { staves: [{ clef: 'treble', seq: 'G4/q G4/q. F4/8 E4/q E4/q D4/q C4/q' }], names: true, time: '3/4' },
        body: `<p>This American tune by James R. <b>Murray</b> was published in 1887 and is sung at Christmas all over North America.</p>
        <p>It's a lullaby in <b>3/4</b>, like Amazing Grace, and starts with a one-beat <b>pickup</b>. Each line begins high on G and drifts down, step by step, below Middle C.</p>
        <p>Watch for the <b>dotted quarter</b> followed by an eighth: a gentle "lo-ong, short".</p>`,
      },
      {
        t: 'play', title: 'First half',
        say: '"Away in a manger, no crib for a bed…" Let it rock gently, 1 2 3.',
        rh: MANGER_1, staff: true, names: true, time: '3/4', pickup: 1, range: ['E3', 'C5'], keyLabels: 'c', tempo: 88, reps: 2,
      },
      {
        t: 'play', title: 'Second half',
        say: '"The stars in the sky…" Same start, then a new ending that settles on Middle C.',
        rh: MANGER_2, staff: true, names: true, time: '3/4', pickup: 1, range: ['E3', 'C5'], keyLabels: 'c', tempo: 88, reps: 2,
      },
      {
        t: 'play', title: 'Dress rehearsal',
        say: 'The whole carol, with hints.',
        rh: MANGER, staff: true, names: false, time: '3/4', pickup: 1, range: ['E3', 'C5'], keyLabels: 'c', tempo: 92, song: true,
      },
      performance({ rh: MANGER, staff: true, names: false, time: '3/4', pickup: 1, range: ['E3', 'C5'], keyLabels: 'none', tempo: 92 }),
    ],
  },
  {
    id: 'o-come-all-ye-faithful', level: 4,
    title: 'O Come, All Ye Faithful',
    summary: 'A grand Christmas hymn in G major, with F sharp.',
    steps: [
      {
        t: 'read', title: 'O Come, All Ye Faithful',
        body: `<p>This hymn began in Latin as <b>"Adeste Fideles"</b>. The tune is usually credited to John Francis <b>Wade</b>, around 1745.</p>
        <p>We'll play it in <b>G major</b>, so every F is <b>F♯</b>. It starts with a one-beat <b>pickup</b> on G.</p>
        <p>It has three parts: the verse, a middle line that starts on high D ("Come and behold Him"), and the famous refrain, "O come, let us adore Him", which climbs a little higher each time.</p>`,
      },
      {
        t: 'play', title: 'The verse',
        say: '"O come, all ye faithful, joyful and triumphant…" Remember F sharp.',
        rh: FAITHFUL_V, staff: true, names: true, key: 'G', pickup: 1, range: ['B3', 'E5'], keyLabels: 'c', tempo: 96, reps: 2,
      },
      {
        t: 'play', title: 'The middle line',
        say: '"Come and behold Him, born the King of angels…" Start high on D.',
        rh: FAITHFUL_M, staff: true, names: true, key: 'G', range: ['B3', 'E5'], keyLabels: 'c', tempo: 96, reps: 2,
      },
      {
        t: 'play', title: 'The refrain',
        say: '"O come, let us adore Him…" three times, each a step higher, then "Christ the Lord".',
        rh: FAITHFUL_R, staff: true, names: true, key: 'G', range: ['B3', 'E5'], keyLabels: 'c', tempo: 96, reps: 2,
      },
      {
        t: 'play', title: 'Dress rehearsal',
        say: 'The whole hymn, with hints.',
        rh: FAITHFUL, staff: true, names: false, key: 'G', pickup: 1, range: ['B3', 'E5'], keyLabels: 'c', tempo: 100, song: true,
      },
      performance({ rh: FAITHFUL, staff: true, names: false, key: 'G', pickup: 1, range: ['B3', 'E5'], keyLabels: 'none', tempo: 100 }),
    ],
  },
  {
    id: 'emmanuel', level: 5,
    title: 'O Come, O Come, Emmanuel',
    summary: 'An ancient, haunting hymn in E minor.',
    steps: [
      {
        t: 'read', title: 'O Come, O Come, Emmanuel',
        body: `<p>This melody comes from a <b>15th-century</b> French chant book. John Mason Neale's English words were joined to it in 1851.</p>
        <p>It's in <b>E minor</b>, which gives it its dark, longing sound. E minor shares its key signature with G major: one sharp, <b>F♯</b>.</p>
        <p>Play it smoothly (<b>legato</b>), like singing. Every line but the first starts with a one-beat pickup, and the refrain begins high on D: "Rejoice! Rejoice!"</p>`,
      },
      {
        t: 'play', title: 'Lines 1 and 2',
        say: '"O come, O come, Emmanuel, and ransom captive Israel…"',
        rh: EMM_1, staff: true, names: true, key: 'Em', pickup: 1, range: ['B3', 'E5'], keyLabels: 'c', tempo: 80, reps: 2,
      },
      {
        t: 'play', title: 'Lines 3 and 4',
        say: '"That mourns in lonely exile here, until the Son of God appear."',
        rh: EMM_2, staff: true, names: true, key: 'Em', pickup: 1, range: ['B3', 'E5'], keyLabels: 'c', tempo: 80, reps: 2,
      },
      {
        t: 'play', title: 'The refrain',
        say: '"Rejoice! Rejoice! Emmanuel shall come to thee, O Israel."',
        rh: EMM_R, staff: true, names: true, key: 'Em', pickup: 1, range: ['B3', 'E5'], keyLabels: 'c', tempo: 80, reps: 2,
      },
      {
        t: 'play', title: 'Dress rehearsal',
        say: 'The whole hymn, with hints. Keep it smooth and unhurried.',
        rh: EMM, staff: true, names: false, key: 'Em', pickup: 1, range: ['B3', 'E5'], keyLabels: 'c', tempo: 84, song: true,
      },
      performance({ rh: EMM, staff: true, names: false, key: 'Em', pickup: 1, range: ['B3', 'E5'], keyLabels: 'none', tempo: 84 }),
    ],
  },
];

// ---------------------------------------------------------------- Pieces and recitals
// Every piece is also a lesson of its own on the Hymns shelf.
export const PIECES = [...CLASSIC, ...MORE].sort((a, b) => a.level - b.level).map((p) => ({
  ...p, id: `hymn-${p.id}`, hymn: true,
  summary: p.summary,
  steps: p.steps.map((s) => (s.final ? { ...s, title: 'Play it through', say: 'Play the whole piece from start to finish, with no keyboard hints. Tap "Show me" if you get stuck.' } : s)),
  recitalSteps: p.steps,
}));

const pieceById = (id) => PIECES.find((p) => p.id === id);
const chosen = {}; // unit id -> piece id

// The app restores saved choices with this. Unknown ids are ignored.
export function chooseRecital(unitId, pieceId) {
  if (RECITALS[unitId]?.choices.some((p) => p.id === pieceId)) chosen[unitId] = pieceId;
}

function recital(unitId, n, final = false) {
  const choices = PIECES.filter((p) => p.level === n);
  const lesson = {
    id: `recital-${n}`, recital: true, choices,
    get piece() { return pieceById(chosen[unitId]) || choices[0]; },
    get title() { return `${final ? 'Final recital' : 'Recital'}: ${this.piece.title}`; },
    get summary() { return choices.length > 1 ? `Choose your piece: ${choices.map((p) => p.title).join(' or ')}.` : this.piece.summary; },
    get steps() {
      const pick = { t: 'choose', title: 'Choose your recital piece', unit: unitId };
      return [...(choices.length > 1 ? [pick] : []), ...this.piece.recitalSteps];
    },
  };
  return lesson;
}

export const RECITALS = {
  u1: recital('u1', 1), u2: recital('u2', 2), u3: recital('u3', 3),
  u4: recital('u4', 4), u5: recital('u5', 5), u6: recital('u6', 6, true),
};
