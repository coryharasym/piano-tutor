import * as F from '../figures.js';

const RH_C = F.kbFigure({
  from: 'C4', to: 'B4', names: 'marked',
  marks: ['C4', 'D4', 'E4', 'F4', 'G4'].map((n, i) => ({ note: n, hand: 'R', label: String(i + 1) })),
  caption: 'Right hand C position: thumb on Middle C',
});
const LH_C = F.kbFigure({
  from: 'C3', to: 'B3', names: 'marked',
  marks: ['C3', 'D3', 'E3', 'F3', 'G3'].map((n, i) => ({ note: n, hand: 'L', label: String(5 - i) })),
  caption: 'Left hand C position: pinky on the C below Middle C',
});

export default {
  id: 'u2',
  title: 'First steps',
  blurb: 'Five-finger positions, steady beats, and your first real tunes.',
  lessons: [
    {
      id: 'rh-c-position',
      title: 'Right hand C position',
      summary: 'One finger per key, thumb on Middle C.',
      steps: [
        {
          t: 'read', title: 'Five fingers, five keys', fig: RH_C,
          body: `<p>Put your right thumb (1) on <b>Middle C</b>. Let the other fingers rest on the next white keys: 2 on D, 3 on E, 4 on F, 5 on G.</p>
          <p>This is the <b>C position</b>. Each finger has its own key, so you never have to look for notes. Keep that bubble shape!</p>`,
        },
        {
          t: 'play', title: 'Up the C position',
          say: 'Play C D E F G with fingers 1 2 3 4 5. Slow and even, like footsteps.',
          rh: 'C4/q/1 D4/q/2 E4/q/3 F4/q/4 G4/q/5', range: ['C4', 'C5'], keyLabels: 'all', names: true,
        },
        {
          t: 'play', title: 'And back down',
          say: 'Now come back down: G F E D C, fingers 5 4 3 2 1.',
          rh: 'G4/q/5 F4/q/4 E4/q/3 D4/q/2 C4/q/1', range: ['C4', 'C5'], keyLabels: 'all', names: true,
        },
        {
          t: 'play', title: 'Up and down together',
          say: 'Put it together without stopping. Listen for every note sounding equally loud.',
          rh: 'C4/q/1 D4/q/2 E4/q/3 F4/q/4 G4/q/5 F4/q/4 E4/q/3 D4/q/2 C4/h/1', range: ['C4', 'C5'], keyLabels: 'all', names: true, reps: 2,
        },
      ],
    },
    {
      id: 'lh-c-position',
      title: 'Left hand C position',
      summary: 'The mirror image: pinky on C.',
      steps: [
        {
          t: 'read', title: 'The left hand', fig: LH_C,
          body: `<p>Your left hand is a mirror image. Place your <b>left pinky (5)</b> on the C <b>below</b> Middle C. Then 4 on D, 3 on E, 2 on F and thumb (1) on G.</p>
          <p>So going up the keys, the left hand counts <b>5 4 3 2 1</b>. That feels strange at first. Go slowly.</p>`,
        },
        {
          t: 'play', title: 'Left hand up',
          say: 'Play C D E F G with left-hand fingers 5 4 3 2 1.',
          lh: 'C3/q/5 D3/q/4 E3/q/3 F3/q/2 G3/q/1', range: ['C3', 'C4'], keyLabels: 'all', names: true,
        },
        {
          t: 'play', title: 'Left hand down',
          say: 'And back down, fingers 1 2 3 4 5.',
          lh: 'G3/q/1 F3/q/2 E3/q/3 D3/q/4 C3/q/5', range: ['C3', 'C4'], keyLabels: 'all', names: true,
        },
        {
          t: 'play', title: 'Pinky and thumb',
          say: 'Bounce between your outside fingers: C and G, then the middle, E.',
          lh: 'C3/q/5 G3/q/1 C3/q/5 G3/q/1 E3/q/3 E3/q/3 C3/h/5', range: ['C3', 'C4'], keyLabels: 'all', names: true, reps: 2,
        },
      ],
    },
    {
      id: 'steady-beat',
      title: 'Steady beats',
      summary: 'Quarter, half and whole notes.',
      steps: [
        {
          t: 'read', title: 'Music has a pulse', fig: F.beatBars(),
          body: `<p>Under all music there's a steady <b>beat</b>, like a heartbeat or a clock ticking. Notes last for a number of beats:</p>
          <ul><li><b>Quarter note</b>: 1 beat</li><li><b>Half note</b>: 2 beats</li><li><b>Whole note</b>: 4 beats</li></ul>
          <p>In this app, longer notes show as wider boxes. Count out loud: "one, two, three, four".</p>`,
        },
        {
          t: 'quiz', q: 'Listen. How many beats does each note last?', listen: 'C4/h C4/h', tempo: 80,
          options: ['1 beat', '2 beats', '4 beats'], answer: 1, explain: 'Those were half notes: two beats each.',
        },
        {
          t: 'play', title: 'Counting while you play',
          say: 'Tap "Listen" first to hear the rhythm, then play it on Middle C, counting out loud.',
          rh: 'C4/q/1 C4/q/1 C4/q/1 C4/q/1 C4/h/1 C4/h/1 C4/w/1', range: ['C4', 'C5'], keyLabels: 'all', names: true, metronome: true,
        },
        {
          t: 'play', title: 'Mixing lengths',
          say: 'Hold the wide notes longer. Count "1 2 3 4" in every group.',
          rh: 'C4/q/1 D4/q/2 E4/h/3 E4/q/3 D4/q/2 C4/h/1 G4/w/5', range: ['C4', 'C5'], keyLabels: 'all', names: true, metronome: true, reps: 2,
        },
      ],
    },
    {
      id: 'steps-skips',
      title: 'Steps and skips',
      summary: 'How notes move: next door, or jumping over one.',
      steps: [
        {
          t: 'read', title: 'Moving by step or skip', fig: F.stepsSkips(),
          body: `<p>When a melody moves to the very next key, that's a <b>step</b> (like C to D). When it jumps over one key, that's a <b>skip</b> (like C to E).</p>
          <p>In C position, a step uses the next finger, and a skip skips a finger.</p>`,
        },
        {
          t: 'play', title: 'Skipping up',
          say: 'Play C, E, G with fingers 1, 3, 5, then back down.',
          rh: 'C4/q/1 E4/q/3 G4/q/5 E4/q/3 C4/h/1', range: ['C4', 'C5'], keyLabels: 'all', names: true, reps: 2,
        },
        {
          t: 'quiz', q: 'Listen. Did the melody move by steps or by skips?', listen: 'C4/q D4/q E4/q F4/q',
          options: ['Steps', 'Skips'], answer: 0, explain: 'C, D, E, F: each note is next door to the last.',
        },
        {
          t: 'quiz', q: 'And this one?', listen: 'C4/q E4/q G4/q E4/q',
          options: ['Steps', 'Skips'], answer: 1, explain: 'C, E, G: every note skipped over one.',
        },
        {
          t: 'play', title: 'Steps and skips mixed',
          say: 'Watch the fingers: some steps, some skips.',
          rh: 'C4/q/1 D4/q/2 E4/q/3 C4/q/1 E4/q/3 F4/q/4 G4/h/5 G4/q/5 E4/q/3 D4/q/2 F4/q/4 E4/q/3 C4/q/1 C4/h/1', range: ['C4', 'C5'], keyLabels: 'all', names: true,
        },
      ],
    },
    {
      id: 'hot-cross-buns',
      title: 'First tune: Hot Cross Buns',
      summary: 'Three notes, one happy song.',
      steps: [
        {
          t: 'read', title: 'Your first song',
          fig: F.kbFigure({ from: 'C4', to: 'G4', names: 'marked', marks: [{ note: 'C4', hand: 'R', label: '1' }, { note: 'D4', hand: 'R', label: '2' }, { note: 'E4', hand: 'R', label: '3' }] }),
          body: `<p>This old street-seller's song uses just three notes: <b>E D C</b>, played with fingers 3 2 1. The fast notes in the middle are <b>eighth notes</b>, two per beat.</p>
          <p>Tap <b>Listen</b> to hear it first. Then play along at your own speed.</p>`,
        },
        {
          t: 'play', title: 'Hot Cross Buns', song: true,
          say: 'Right hand in C position. Go slowly. The app waits for you.',
          rh: 'E4/q/3 D4/q/2 C4/h/1 E4/q/3 D4/q/2 C4/h/1 C4/8/1 C4/8/1 C4/8/1 C4/8/1 D4/8/2 D4/8/2 D4/8/2 D4/8/2 E4/q/3 D4/q/2 C4/h/1',
          lyrics: 'Hot cross buns, / hot cross buns, / one a pen- ny, two a pen- ny, / hot cross buns!',
          range: ['C4', 'C5'], keyLabels: 'all', names: true, tempo: 96, reps: 2,
        },
      ],
    },
    {
      id: 'mary',
      title: 'Mary Had a Little Lamb',
      summary: 'Four fingers and a skip up to G.',
      steps: [
        {
          t: 'read', title: 'A longer tune',
          body: `<p>This melody uses <b>C D E</b> plus a skip up to <b>G</b> with your pinky. Keep your hand in C position the whole time and the notes are always under your fingers.</p>`,
        },
        {
          t: 'play', title: 'Mary Had a Little Lamb', song: true,
          say: 'Play the whole tune. Notice the long note at the end: hold it for four beats.',
          rh: 'E4/q/3 D4/q/2 C4/q/1 D4/q/2 E4/q/3 E4/q/3 E4/h/3 D4/q/2 D4/q/2 D4/h/2 E4/q/3 G4/q/5 G4/h/5 E4/q/3 D4/q/2 C4/q/1 D4/q/2 E4/q/3 E4/q/3 E4/q/3 E4/q/3 D4/q/2 D4/q/2 E4/q/3 D4/q/2 C4/w/1',
          lyrics: 'Ma- ry had a lit- tle lamb, / lit- tle lamb, lit- tle lamb, / Ma- ry had a lit- tle lamb, its / fleece was white as snow.',
          range: ['C4', 'C5'], keyLabels: 'all', names: true, tempo: 100, reps: 2,
        },
      ],
    },
    {
      id: 'au-clair',
      title: 'Left hand tune: Au Clair de la Lune',
      summary: 'A French folk song for your left hand.',
      steps: [
        {
          t: 'read', title: 'Left hand leads', fig: LH_C,
          body: `<p>Melodies aren't only for the right hand. Place your left hand in C position (pinky on the C below Middle C) and play this gentle French song.</p>
          <p>Remember: on the left hand, C is finger <b>5</b>, D is <b>4</b>, E is <b>3</b>.</p>`,
        },
        {
          t: 'play', title: 'Au Clair de la Lune', song: true,
          say: 'Left hand only. Let it sing, softly and smoothly.',
          lh: 'C3/q/5 C3/q/5 C3/q/5 D3/q/4 E3/h/3 D3/h/4 C3/q/5 E3/q/3 D3/q/4 D3/q/4 C3/w/5',
          range: ['C3', 'C4'], keyLabels: 'all', names: true, tempo: 92, reps: 2,
        },
      ],
    },
    {
      id: 'ode-rh',
      title: 'Ode to Joy (right hand)',
      summary: "Beethoven's famous melody, in C position.",
      steps: [
        {
          t: 'read', title: 'Beethoven!', fig: RH_C,
          body: `<p>This melody is from Beethoven's <b>Ninth Symphony</b> (1824), one of the most famous pieces ever written. And it fits perfectly in your right-hand C position.</p>
          <p>It has two halves that are almost the same. Only the ending is different. Watch for the <b>dotted</b> note near the end of each half: it lasts a beat and a half.</p>`,
        },
        {
          t: 'play', title: 'First half',
          say: 'Play the first half. Fingers on C D E F G.',
          rh: 'E4/q/3 E4/q/3 F4/q/4 G4/q/5 G4/q/5 F4/q/4 E4/q/3 D4/q/2 C4/q/1 C4/q/1 D4/q/2 E4/q/3 E4/q./3 D4/8/2 D4/h/2',
          lyrics: 'Joy- ful, joy- ful, we a- dore Thee, / God of glo- ry, Lord of love;',
          range: ['C4', 'C5'], keyLabels: 'all', names: true, tempo: 100,
        },
        {
          t: 'play', title: 'Second half',
          say: 'Same start, but this time it ends on C, home.',
          rh: 'E4/q/3 E4/q/3 F4/q/4 G4/q/5 G4/q/5 F4/q/4 E4/q/3 D4/q/2 C4/q/1 C4/q/1 D4/q/2 E4/q/3 D4/q./2 C4/8/1 C4/h/1',
          lyrics: 'Hearts un- fold like flow\'rs be- fore Thee, / op\'n- ing to the sun a- bove.',
          range: ['C4', 'C5'], keyLabels: 'all', names: true, tempo: 100,
        },
        {
          t: 'play', title: 'The whole melody', song: true,
          say: 'Both halves without stopping. You are playing Beethoven!',
          rh: 'E4/q/3 E4/q/3 F4/q/4 G4/q/5 G4/q/5 F4/q/4 E4/q/3 D4/q/2 C4/q/1 C4/q/1 D4/q/2 E4/q/3 E4/q./3 D4/8/2 D4/h/2 E4/q/3 E4/q/3 F4/q/4 G4/q/5 G4/q/5 F4/q/4 E4/q/3 D4/q/2 C4/q/1 C4/q/1 D4/q/2 E4/q/3 D4/q./2 C4/8/1 C4/h/1',
          lyrics: 'Joy- ful, joy- ful, we a- dore Thee, / God of glo- ry, Lord of love; / Hearts un- fold like flow\'rs be- fore Thee, / op\'n- ing to the sun a- bove.',
          range: ['C4', 'C5'], keyLabels: 'all', names: true, tempo: 100, reps: 2,
        },
      ],
    },
    {
      id: 'hands-together',
      title: 'Hands together',
      summary: 'Both hands at once, starting simple.',
      steps: [
        {
          t: 'read', title: 'Two hands, one brain',
          fig: F.kbFigure({
            from: 'C3', to: 'B4', names: 'marked',
            marks: [...['C3', 'D3', 'E3', 'F3', 'G3'].map((n, i) => ({ note: n, hand: 'L', label: String(5 - i) })),
              ...['C4', 'D4', 'E4', 'F4', 'G4'].map((n, i) => ({ note: n, hand: 'R', label: String(i + 1) }))],
            caption: 'Both hands in C position',
          }),
          body: `<p>Playing with both hands is the big step that makes the piano sound like a piano. Start with both hands in C position, an octave (eight notes) apart.</p>
          <p>When both hands play the <b>same letters</b> together, your left hand uses 5 4 3 2 1 while your right uses 1 2 3 4 5. Go very slowly; the app waits until it hears both notes.</p>`,
        },
        {
          t: 'play', title: 'Both hands up',
          say: 'Play C with both hands together (left 5, right 1), then D, E, F, G.',
          rh: 'C4/q/1 D4/q/2 E4/q/3 F4/q/4 G4/q/5', lh: 'C3/q/5 D3/q/4 E3/q/3 F3/q/2 G3/q/1',
          range: ['C3', 'C5'], keyLabels: 'all', names: true,
        },
        {
          t: 'play', title: 'Both hands down',
          say: 'And back down together.',
          rh: 'G4/q/5 F4/q/4 E4/q/3 D4/q/2 C4/q/1', lh: 'G3/q/1 F3/q/2 E3/q/3 D3/q/4 C3/q/5',
          range: ['C3', 'C5'], keyLabels: 'all', names: true,
        },
        {
          t: 'read', title: 'Melody and bass',
          body: `<p>Usually the right hand plays the <b>melody</b> while the left hand plays slower, lower <b>bass</b> notes underneath.</p>
          <p>Next you'll play Ode to Joy with a single left-hand note at the start of each group of four beats: just C or G. Hold the left note while the right hand keeps going.</p>`,
        },
        {
          t: 'play', title: 'Ode to Joy, hands together', song: true,
          say: 'Left hand plays C (finger 5) or G (finger 1) and holds it. Right hand plays the melody.',
          rh: 'E4/q/3 E4/q/3 F4/q/4 G4/q/5 G4/q/5 F4/q/4 E4/q/3 D4/q/2 C4/q/1 C4/q/1 D4/q/2 E4/q/3 E4/q./3 D4/8/2 D4/h/2 E4/q/3 E4/q/3 F4/q/4 G4/q/5 G4/q/5 F4/q/4 E4/q/3 D4/q/2 C4/q/1 C4/q/1 D4/q/2 E4/q/3 D4/q./2 C4/8/1 C4/h/1',
          lyrics: 'Joy- ful, joy- ful, we a- dore Thee, / God of glo- ry, Lord of love; / Hearts un- fold like flow\'rs be- fore Thee, / op\'n- ing to the sun a- bove.',
          lh: 'C3/w/5 G3/w/1 C3/w/5 G3/w/1 C3/w/5 G3/w/1 C3/w/5 G3/h/1 C3/h/5',
          range: ['C3', 'C5'], keyLabels: 'all', names: true, tempo: 96,
        },
      ],
    },
  ],
};
