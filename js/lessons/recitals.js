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

export const RECITALS = {
  u1: {
    id: 'recital-1', recital: true, hymn: true,
    title: 'Recital: the Doxology',
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

  u2: {
    id: 'recital-2', recital: true, hymn: true,
    title: 'Recital: Joyful, Joyful, We Adore Thee',
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

  u3: {
    id: 'recital-3', recital: true, hymn: true,
    title: 'Recital: Amazing Grace',
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

  u4: {
    id: 'recital-4', recital: true, hymn: true,
    title: 'Recital: Hark! The Herald Angels Sing',
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

  u5: {
    id: 'recital-5', recital: true, hymn: true,
    title: 'Recital: Silent Night',
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

  u6: {
    id: 'recital-6', recital: true, hymn: true,
    title: 'Final recital: Joyful, Joyful',
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
};
