import * as F from '../figures.js';

const chordFig = (notes, hand, caption, from = 'C4', to = 'B4', labels) => F.kbFigure({
  from, to, names: 'marked', caption,
  marks: notes.map((n, i) => ({ note: n, hand, label: labels ? String(labels[i]) : '' })),
});

const alberti = (a, b, c, times = 2) => Array(times).fill(`${a}/8/5 ${c}/8/1 ${b}/8/3 ${c}/8/1`).join(' ');

export default {
  id: 'u5',
  title: 'Harmony',
  blurb: 'Chords, inversions, and accompanying a melody.',
  lessons: [
    {
      id: 'triads',
      title: 'Your first chord',
      summary: 'Three notes at once: the C major triad.',
      steps: [
        {
          t: 'read', title: 'Stacking skips', fig: chordFig(['C4', 'E4', 'G4'], 'R', 'C major chord: C E G, fingers 1 3 5', 'C4', 'B4', [1, 3, 5]),
          body: `<p>A <b>chord</b> is several notes played together. The most common chord is a <b>triad</b>: three notes, each a skip apart. Start on C, skip to E, skip to G: that's the <b>C major chord</b>.</p>
          <p>The bottom note, C, is the <b>root</b> and gives the chord its name.</p>`,
        },
        {
          t: 'play', title: 'Broken chord first',
          say: 'Play the three notes one at a time: C, E, G. Then back down.',
          rh: 'C4/q/1 E4/q/3 G4/q/5 E4/q/3 C4/h/1', staff: true, names: true, range: ['C4', 'C5'], keyLabels: 'c',
        },
        {
          t: 'play', title: 'All together',
          say: 'Now press C, E and G at exactly the same time, fingers 1 3 5. Land like a soft cat, all three together.',
          rh: '[C4 E4 G4]/h/1-3-5 [C4 E4 G4]/h/1-3-5 [C4 E4 G4]/w/1-3-5', staff: true, names: true, range: ['C4', 'C5'], keyLabels: 'c',
        },
        {
          t: 'read', title: 'About listening for chords',
          body: `<p>Chords are much harder for a phone to hear than single notes. If the app is slow to accept a chord, try playing the notes quickly one after another (a "rolled" chord), or tap the keys on screen.</p>`,
        },
        {
          t: 'play', title: 'Left hand chord',
          say: 'Left hand: C E G below Middle C, fingers 5 3 1.',
          lh: '[C3 E3 G3]/h/5-3-1 [C3 E3 G3]/h/5-3-1 [C3 E3 G3]/w/5-3-1', staff: true, names: true, range: ['C3', 'C4'], keyLabels: 'c',
        },
      ],
    },
    {
      id: 'major-chords',
      title: 'C, F and G chords',
      summary: 'The three chords behind thousands of songs.',
      steps: [
        {
          t: 'read', title: 'Three families',
          fig: F.kbFigure({
            from: 'C4', to: 'D5', names: 'marked',
            marks: [{ note: 'C4', hand: 'R' }, { note: 'E4', hand: 'R' }, { note: 'G4', hand: 'R' }, { note: 'F4', hand: 'L' }, { note: 'A4', hand: 'L' }, { note: 'C5', hand: 'L' }],
            caption: 'C chord (C E G) and F chord (F A C)',
          }),
          body: `<p>Build the same skip-skip shape on <b>F</b> and you get F A C, the <b>F major chord</b>. Build it on <b>G</b>: G B D, the <b>G major chord</b>.</p>
          <p>C, F and G are the most important chords in the key of C. Musicians call them <b>I</b>, <b>IV</b> and <b>V</b> (one, four and five), because C, F and G are the 1st, 4th and 5th notes of the C scale.</p>`,
        },
        {
          t: 'play', title: 'Moving the chord shape',
          say: 'Play C chord, F chord, G chord, then C chord. Keep the hand shape and slide it along.',
          rh: '[C4 E4 G4]/h/1-3-5 [F4 A4 C5]/h/1-3-5 [G4 B4 D5]/h/1-3-5 [C4 E4 G4]/h/1-3-5', staff: true, names: true, range: ['C4', 'E5'], keyLabels: 'c',
        },
        {
          t: 'play', title: 'Left hand chord shapes',
          say: 'Same thing with the left hand, fingers 5 3 1.',
          lh: '[C3 E3 G3]/h/5-3-1 [F3 A3 C4]/h/5-3-1 [G3 B3 D4]/h/5-3-1 [C3 E3 G3]/h/5-3-1', staff: true, names: true, range: ['C3', 'E4'], keyLabels: 'c',
        },
      ],
    },
    {
      id: 'minor-chords',
      title: 'Minor chords',
      summary: 'A minor, D minor and E minor.',
      steps: [
        {
          t: 'read', title: 'Same shape, different colour', fig: chordFig(['A3', 'C4', 'E4'], 'L', 'A minor chord: A C E', 'F3', 'G4', [1, 3, 5]),
          body: `<p>The white-key chord built on <b>A</b> is A C E. It has the same skip-skip shape, but it sounds <b>minor</b>, darker than C major.</p>
          <p>The white-key chords on <b>D</b> (D F A) and <b>E</b> (E G B) are minor too. Major or minor depends on where the middle note sits.</p>`,
        },
        {
          t: 'play', title: 'Minor chords',
          say: 'Play A minor, D minor, E minor, then A minor again. Listen to the mood.',
          rh: '[A3 C4 E4]/h/1-3-5 [D4 F4 A4]/h/1-3-5 [E4 G4 B4]/h/1-3-5 [A3 C4 E4]/h/1-3-5', staff: true, names: true, range: ['F3', 'C5'], keyLabels: 'c',
        },
        {
          t: 'quiz', q: 'Listen. Major chord or minor chord?', listen: '[D4 F4 A4]/w',
          options: ['Major', 'Minor'], answer: 1, explain: 'D F A is D minor.',
        },
        {
          t: 'quiz', q: 'And this one?', listen: '[F4 A4 C5]/w',
          options: ['Major', 'Minor'], answer: 0, explain: 'F A C is F major.',
        },
        {
          t: 'quiz', q: 'One more.', listen: '[E4 G4 B4]/w',
          options: ['Major', 'Minor'], answer: 1, explain: 'E G B is E minor.',
        },
      ],
    },
    {
      id: 'inversions',
      title: 'Inversions',
      summary: 'Rearranging a chord so it moves smoothly.',
      steps: [
        {
          t: 'read', title: 'Same notes, new order',
          staffFig: { staves: [{ clef: 'treble', seq: '[C4 E4 G4]/h [E4 G4 C5]/h [G4 C5 E5]/w' }], names: true },
          body: `<p>A chord doesn't have to have its root on the bottom. Move the bottom C up an octave and you get <b>E G C</b>: still a C chord, called <b>first inversion</b>. Move E up too and you get <b>G C E</b>, <b>second inversion</b>.</p>
          <p>Inversions let your hand stay in one place while the chords change. That sounds smoother and is much easier.</p>`,
        },
        {
          t: 'play', title: 'C chord inversions',
          say: 'Root position, first inversion, second inversion, and back.',
          rh: '[C4 E4 G4]/h/1-3-5 [E4 G4 C5]/h/1-2-5 [G4 C5 E5]/h/1-3-5 [E4 G4 C5]/h/1-2-5 [C4 E4 G4]/w/1-3-5', staff: true, names: true, range: ['C4', 'F5'], keyLabels: 'c',
        },
      ],
    },
    {
      id: 'progression',
      title: 'Chord progressions',
      summary: 'I, IV, V, I with smooth voicing.',
      steps: [
        {
          t: 'read', title: 'A chord journey',
          staffFig: { staves: [{ clef: 'treble', seq: '[C4 E4 G4]/h [C4 F4 A4]/h [B3 D4 G4]/h [C4 E4 G4]/h' }, { clef: 'bass', seq: 'C3/h F3/h G3/h C3/h' }], names: false },
          body: `<p>A <b>progression</b> is a series of chords. <b>C, F, G, C</b> (I IV V I) is the backbone of countless pieces.</p>
          <p>Using inversions, the right hand barely moves: <b>C E G → C F A → B D G → C E G</b>. The left hand plays just the root of each chord.</p>`,
        },
        {
          t: 'play', title: 'Right hand only',
          say: 'Watch how one or two fingers move each time, and the rest stay still.',
          rh: '[C4 E4 G4]/h/1-3-5 [C4 F4 A4]/h/1-4-5 [B3 D4 G4]/h/1-2-5 [C4 E4 G4]/h/1-3-5', staff: true, names: true, range: ['A3', 'B4'], keyLabels: 'c', reps: 2,
        },
        {
          t: 'play', title: 'Hands together', song: true,
          say: 'Add the left-hand roots: C, F, G, C.',
          rh: '[C4 E4 G4]/h/1-3-5 [C4 F4 A4]/h/1-4-5 [B3 D4 G4]/h/1-2-5 [C4 E4 G4]/h/1-3-5', lh: 'C3/h/5 F3/h/2 G3/h/1 C3/h/5',
          staff: true, names: false, range: ['C3', 'B4'], keyLabels: 'c', reps: 2,
        },
      ],
    },
    {
      id: 'alberti',
      title: 'Broken chords and Alberti bass',
      summary: 'The classical way to accompany a melody.',
      steps: [
        {
          t: 'read', title: 'Alberti bass',
          body: `<p>Classical composers like Mozart and Haydn often break the left-hand chord into a rocking pattern: <b>bottom, top, middle, top</b>. It's called <b>Alberti bass</b>, after Domenico Alberti.</p>
          <p>For a C chord: <b>C G E G</b>, fingers <b>5 1 3 1</b>. Keep it light and even, with the thumb barely touching its key.</p>`,
        },
        {
          t: 'play', title: 'Alberti on C',
          say: 'Left hand: C G E G, over and over. Smooth and soft.',
          lh: alberti('C3', 'E3', 'G3', 2), staff: true, names: true, range: ['C3', 'C4'], keyLabels: 'c', tempo: 72, reps: 2,
        },
        {
          t: 'play', title: 'Changing chords',
          say: 'Now move through C, F (C A F A), G (B G D G) and back to C.',
          lh: `${alberti('C3', 'E3', 'G3', 1)} ${alberti('C3', 'F3', 'A3', 1)} ${alberti('B2', 'D3', 'G3', 1)} ${alberti('C3', 'E3', 'G3', 1)}`,
          staff: true, names: true, range: ['A2', 'C4'], keyLabels: 'c', tempo: 72, reps: 2,
        },
        {
          t: 'play', title: 'Melody over Alberti', song: true,
          say: 'Right hand holds long notes while the left hand rocks underneath.',
          rh: 'E4/w/3 F4/w/4 D4/w/2 C4/w/1',
          lh: `${alberti('C3', 'E3', 'G3', 2)} ${alberti('C3', 'F3', 'A3', 2)} ${alberti('B2', 'D3', 'G3', 2)} ${alberti('C3', 'E3', 'G3', 2)}`,
          staff: true, names: false, range: ['A2', 'B4'], keyLabels: 'c', tempo: 72,
        },
      ],
    },
    {
      id: 'canon-chords',
      title: "Pachelbel's Canon chords",
      summary: 'The most famous chord progression in classical music.',
      steps: [
        {
          t: 'read', title: 'Eight chords on repeat',
          body: `<p>Johann Pachelbel's <b>Canon</b> (around 1700) repeats the same eight chords again and again while melodies weave over the top. Here it is moved to C major:</p>
          <p><b>C – G – Am – Em – F – C – F – G</b></p>
          <p>Right hand plays close inversions so it barely moves. The left hand plays the roots, mostly downward.</p>`,
        },
        {
          t: 'play', title: 'Right hand chords',
          say: 'Each chord lasts two beats. Move as few fingers as you can.',
          rh: '[C4 E4 G4]/h/1-3-5 [B3 D4 G4]/h/1-2-5 [C4 E4 A4]/h/1-2-5 [B3 E4 G4]/h/1-3-5 [C4 F4 A4]/h/1-3-5 [C4 E4 G4]/h/1-3-5 [C4 F4 A4]/h/1-3-5 [B3 D4 G4]/h/1-2-5',
          staff: true, names: true, range: ['A3', 'B4'], keyLabels: 'c',
        },
        {
          t: 'play', title: 'Left hand roots',
          say: 'Left hand: C G A E F C F G.',
          lh: 'C3/h/1 G2/h/4 A2/h/3 E2/h/5 F2/h/4 C2/h/5 F2/h/2 G2/h/1', staff: true, names: true, range: ['C2', 'C4'], keyLabels: 'c',
        },
        {
          t: 'play', title: 'The Canon progression', song: true,
          say: 'Hands together. Take your time between chords; the app waits.',
          rh: '[C4 E4 G4]/h/1-3-5 [B3 D4 G4]/h/1-2-5 [C4 E4 A4]/h/1-2-5 [B3 E4 G4]/h/1-3-5 [C4 F4 A4]/h/1-3-5 [C4 E4 G4]/h/1-3-5 [C4 F4 A4]/h/1-3-5 [B3 D4 G4]/h/1-2-5',
          lh: 'C3/h/1 G2/h/4 A2/h/3 E2/h/5 F2/h/4 C2/h/5 F2/h/2 G2/h/1',
          staff: true, names: false, range: ['C2', 'B4'], keyLabels: 'c', tempo: 70,
        },
      ],
    },
    {
      id: 'six-eight',
      title: '6/8 time',
      summary: 'Six quick beats, felt as two big ones.',
      steps: [
        {
          t: 'read', title: 'Two big beats',
          staffFig: { staves: [{ clef: 'treble', seq: 'C4/8 D4/8 E4/8 F4/8 E4/8 D4/8 C4/q. r/q.' }], time: '6/8', names: true },
          body: `<p>In <b>6/8</b> time there are six eighth notes in each bar, grouped in threes: "<b>1</b> 2 3 <b>4</b> 5 6". It feels like <b>two big beats</b>, each split into three. That gives it a gentle rocking or rolling feel.</p>
          <p>A <b>dotted quarter note</b> fills one big beat (three eighths), and a <b>dotted half note</b> fills the whole bar. Silent Night, coming up in your recital, is in 6/8.</p>`,
        },
        {
          t: 'quiz', q: 'Listen. Does this rock in twos (6/8) or march in fours (4/4)?', listen: 'C4/q. E4/q. G4/q. E4/q. C4/8 D4/8 E4/8 F4/8 E4/8 D4/8 C4/h.', tempo: 100,
          options: ['Rocks in two (6/8)', 'Marches in four (4/4)'], answer: 0,
          explain: 'You can hear the long-short groups of three. That lilt is 6/8.',
        },
        {
          t: 'play', title: 'Row, Row, Row Your Boat', song: true, time: '6/8',
          say: 'Count "1 2 3 4 5 6" in each bar. In "merrily, merrily", move your hand freely to reach the high C.',
          rh: 'C4/q./1 C4/q./1 C4/q/1 D4/8/2 E4/q./3 E4/q/3 D4/8/2 E4/q/3 F4/8/4 G4/h./5 C5/8 C5/8 C5/8 G4/8 G4/8 G4/8 E4/8 E4/8 E4/8 C4/8 C4/8 C4/8 G4/q/5 F4/8/4 E4/q/3 D4/8/2 C4/h./1',
          lyrics: 'Row, row, row your boat, / gent- ly down the stream; / mer- ri- ly, mer- ri- ly, mer- ri- ly, mer- ri- ly, / life is but a dream.',
          staff: true, names: false, range: ['C4', 'C5'], keyLabels: 'c', tempo: 120,
        },
      ],
    },
  ],
};
