import * as F from '../figures.js';

// A one-note "what is this note?" quiz.
const nameQuiz = (clef, note, options, answer, explain) => ({
  t: 'quiz', q: 'What is this note?', staffFig: { staves: [{ clef, seq: `${note}/w` }] },
  options, answer, explain,
});

export default {
  id: 'u3',
  title: 'Reading music',
  blurb: 'The staff, both clefs, note lengths, rests and time signatures.',
  lessons: [
    {
      id: 'treble-clef',
      title: 'The staff and the treble clef',
      summary: 'Five lines that show how high a note is.',
      steps: [
        {
          t: 'read', title: 'Five lines', fig: F.staffLines('treble'),
          body: `<p>Written music sits on a <b>staff</b>: five lines with four spaces between them. Notes are written <b>on</b> a line or <b>in</b> a space. The higher on the staff, the higher the note.</p>
          <p>The curly sign at the start of the staff is the <b>treble clef</b> (you'll see it on the next page). It's used for higher notes, usually the right hand. A handy saying for the lines, bottom to top: <b>E</b>very <b>G</b>ood <b>B</b>oy <b>D</b>oes <b>F</b>ine. The spaces spell <b>F A C E</b>.</p>`,
        },
        {
          t: 'read', title: 'Middle C on the staff',
          staffFig: { staves: [{ clef: 'treble', seq: 'C4/q D4/q E4/q F4/q G4/q' }], names: true },
          body: `<p>Middle C sits <b>below</b> the treble staff on its own short line, called a <b>ledger line</b>. Then D hangs just under the staff, E sits on the bottom line, F in the first space, G on the second line.</p>
          <p>Notice how each note moves up one notch: line, space, line, space. Steps on the keyboard are steps on the staff.</p>`,
        },
        {
          t: 'play', title: 'Play what you see',
          say: 'Read the notes on the staff and play them. The names are shown underneath to help.',
          rh: 'C4/q/1 D4/q/2 E4/q/3 F4/q/4 G4/q/5 F4/q/4 E4/q/3 D4/q/2 C4/w/1', staff: true, names: true, range: ['C4', 'C5'], keyLabels: 'c',
        },
        nameQuiz('treble', 'E4', ['C', 'E', 'G'], 1, 'The bottom line of the treble staff is E: "Every".'),
        nameQuiz('treble', 'G4', ['F', 'G', 'A'], 1, 'The second line is G: "Good". The treble clef curls around this line, which is why it\'s also called the G clef.'),
        nameQuiz('treble', 'C4', ['Middle C', 'D', 'B'], 0, 'A note on its own little line just below the staff is Middle C.'),
      ],
    },
    {
      id: 'treble-reading',
      title: 'Reading without names',
      summary: 'Train your eyes to read C to G.',
      steps: [
        {
          t: 'read', title: 'Read by shape',
          body: `<p>Good readers don't name every note. They look at the <b>direction</b> and the <b>distance</b>: up or down, a step or a skip.</p>
          <p>Line to the next space is a step. Line to the next line is a skip. Watch for these shapes as you play.</p>`,
        },
        {
          t: 'play', title: 'Reading drill 1',
          say: 'No names this time. Read from the staff. The keyboard still shows where to go if you get stuck.',
          rh: 'C4/q/1 E4/q/3 D4/q/2 F4/q/4 E4/q/3 G4/q/5 F4/q/4 D4/q/2 C4/w/1', staff: true, names: false, range: ['C4', 'C5'], keyLabels: 'c',
        },
        {
          t: 'play', title: 'Reading drill 2',
          say: 'This time the keyboard won\'t show you. Read the staff. Tap "Show me" if you need a hint.',
          rh: 'G4/q/5 E4/q/3 C4/q/1 E4/q/3 F4/q/4 D4/q/2 G4/h/5 E4/q/3 F4/q/4 D4/q/2 E4/q/3 C4/w/1', staff: true, names: false, hint: false, range: ['C4', 'C5'], keyLabels: 'c',
        },
        nameQuiz('treble', 'F4', ['E', 'F', 'G'], 1, 'F is in the first space: the F of "FACE".'),
        nameQuiz('treble', 'D4', ['D', 'C', 'E'], 0, 'D hangs just below the bottom line.'),
      ],
    },
    {
      id: 'bass-clef',
      title: 'The bass clef',
      summary: 'Low notes, usually for the left hand.',
      steps: [
        {
          t: 'read', title: 'The bass clef', fig: F.staffLines('bass'),
          body: `<p>Low notes use the <b>bass clef</b>, which looks like a backwards C with two dots (shown on the next page). Its two dots surround the line for <b>F</b>, so it's also called the F clef.</p>
          <p>Lines, bottom to top: <b>G</b>ood <b>B</b>oys <b>D</b>o <b>F</b>ine <b>A</b>lways. Spaces: <b>A</b>ll <b>C</b>ows <b>E</b>at <b>G</b>rass.</p>`,
        },
        {
          t: 'read', title: 'Left hand C position on the staff',
          staffFig: { staves: [{ clef: 'bass', seq: 'C3/q D3/q E3/q F3/q G3/q' }], names: true },
          body: `<p>The C your left pinky sits on is in the <b>second space</b> of the bass staff. From there, D is on the middle line, E in the next space, F on the fourth line and G in the top space.</p>`,
        },
        {
          t: 'play', title: 'Read with your left hand',
          say: 'Left hand in C position. Read the bass staff.',
          lh: 'C3/q/5 D3/q/4 E3/q/3 F3/q/2 G3/q/1 F3/q/2 E3/q/3 D3/q/4 C3/w/5', staff: true, names: true, range: ['C3', 'C4'], keyLabels: 'c',
        },
        {
          t: 'play', title: 'Bass reading drill',
          say: 'No names now. Up or down? Step or skip?',
          lh: 'C3/q/5 E3/q/3 G3/q/1 E3/q/3 D3/q/4 F3/q/2 E3/h/3 G3/q/1 F3/q/2 E3/q/3 D3/q/4 C3/w/5', staff: true, names: false, range: ['C3', 'C4'], keyLabels: 'c',
        },
        nameQuiz('bass', 'C3', ['A', 'C', 'E'], 1, 'C is the second space of the bass staff: "All Cows".'),
        nameQuiz('bass', 'F3', ['F', 'D', 'G'], 0, 'F is the fourth line, right between the two dots of the bass clef.'),
      ],
    },
    {
      id: 'grand-staff',
      title: 'The grand staff',
      summary: 'Both clefs joined, with Middle C in between.',
      steps: [
        {
          t: 'read', title: 'Two staves together',
          staffFig: { staves: [{ clef: 'treble', seq: 'C4/h E4/h' }, { clef: 'bass', seq: 'C3/h C4/h' }], names: true },
          body: `<p>Piano music joins a treble staff and a bass staff with a brace. This is the <b>grand staff</b>. The top is usually your right hand, the bottom your left.</p>
          <p><b>Middle C</b> sits right between them. It can be written just below the treble staff or just above the bass staff. Same key, same sound.</p>`,
        },
        {
          t: 'quiz', q: 'On the grand staff, which hand usually reads the bottom staff?',
          options: ['Right hand', 'Left hand'], answer: 1, explain: 'The bass (bottom) staff is usually for the left hand.',
        },
        {
          t: 'play', title: 'Taking turns',
          say: 'The hands take turns: left hand first, then right. Read each staff.',
          lh: 'C3/q/5 E3/q/3 G3/h/1 r/w C3/w/5', rh: 'r/w C4/q/1 E4/q/3 G4/h/5 C4/w/1',
          staff: true, names: true, range: ['C3', 'C5'], keyLabels: 'c',
        },
      ],
    },
    {
      id: 'counting',
      title: 'Counting and bar lines',
      summary: 'Measures, time signatures, and Twinkle Twinkle.',
      steps: [
        {
          t: 'read', title: 'Bars and time signatures', fig: F.beatBars(),
          body: `<p>Music is divided into small boxes called <b>bars</b> (or measures) by vertical <b>bar lines</b>.</p>
          <p>The two numbers at the start are the <b>time signature</b>. The top number tells you how many beats are in each bar. <b>4/4</b> means four beats per bar: count "1 2 3 4, 1 2 3 4".</p>`,
        },
        {
          t: 'quiz', q: 'In 4/4 time, how many beats are in each bar?', options: ['2', '3', '4'], answer: 2,
          explain: 'The top number of the time signature is the number of beats per bar.',
        },
        {
          t: 'quiz', q: 'How many quarter notes fit into one half note?', options: ['1', '2', '4'], answer: 1,
          explain: 'A half note is 2 beats, a quarter note is 1 beat.',
        },
        {
          t: 'read', title: 'Twinkle, Twinkle',
          body: `<p>Mozart wrote a famous set of variations on this melody. It needs one note beyond C position: <b>A</b>. Here's the trick: put your thumb on C, then let your fingers spread so that <b>4 lands on G and 5 on A</b>.</p>
          <p>Later in the song your thumb moves to D. Read the finger numbers on the keyboard.</p>`,
        },
        {
          t: 'play', title: 'Twinkle, Twinkle, Little Star', song: true,
          say: 'Count 1 2 3 4 in every bar. Hold the half notes for two beats.',
          rh: 'C4/q/1 C4/q/1 G4/q/4 G4/q/4 A4/q/5 A4/q/5 G4/h/4 F4/q/3 F4/q/3 E4/q/2 E4/q/2 D4/q/1 D4/q/1 C4/h/1 G4/q/4 G4/q/4 F4/q/3 F4/q/3 E4/q/2 E4/q/2 D4/h/1 G4/q/4 G4/q/4 F4/q/3 F4/q/3 E4/q/2 E4/q/2 D4/h/1 C4/q/1 C4/q/1 G4/q/4 G4/q/4 A4/q/5 A4/q/5 G4/h/4 F4/q/3 F4/q/3 E4/q/2 E4/q/2 D4/q/1 D4/q/1 C4/h/1',
          lyrics: 'Twin- kle, twin- kle, lit- tle star, / how I won- der what you are! / Up a- bove the world so high, / like a dia- mond in the sky. / Twin- kle, twin- kle, lit- tle star, / how I won- der what you are!',
          staff: true, names: false, range: ['C4', 'C5'], keyLabels: 'c', tempo: 100,
        },
      ],
    },
    {
      id: 'eighth-notes',
      title: 'Eighth notes: "1 and 2 and"',
      summary: 'Two quick notes in one beat.',
      steps: [
        {
          t: 'read', title: 'Half a beat',
          staffFig: { staves: [{ clef: 'treble', seq: 'C4/8 D4/8 E4/8 F4/8 G4/q G4/q' }], names: true },
          body: `<p>An <b>eighth note</b> lasts half a beat, so two of them fit into one beat. On their own they have a little flag. In pairs they're joined by a thick line called a <b>beam</b>.</p>
          <p>To count them, put the word "and" between the beats: "<b>1</b> and <b>2</b> and <b>3</b> and <b>4</b> and". The numbers land on the beat and the "ands" land halfway between.</p>`,
        },
        {
          t: 'quiz', q: 'Listen. Which half has the quicker notes?', listen: 'C4/q C4/q C4/q C4/q C4/8 C4/8 C4/8 C4/8 C4/8 C4/8 C4/8 C4/8', tempo: 80,
          options: ['The first half', 'The second half'], answer: 1,
          explain: 'The second half has eighth notes: two notes in every beat, so they move twice as fast.',
        },
        {
          t: 'play', title: 'Running eighths',
          say: 'Count out loud: "1 and 2 and". The eighth notes go up and down the C position.',
          rh: 'C4/8/1 D4/8/2 E4/8/3 F4/8/4 G4/q/5 G4/q/5 G4/8/5 F4/8/4 E4/8/3 D4/8/2 C4/h/1',
          staff: true, names: false, range: ['C4', 'C5'], keyLabels: 'c', tempo: 72, metronome: true,
        },
        {
          t: 'play', title: 'Hot Cross Buns, with eighths', song: true,
          say: '"One a penny, two a penny" is all eighth notes. Keep them even.',
          rh: 'E4/q/3 D4/q/2 C4/h/1 E4/q/3 D4/q/2 C4/h/1 C4/8/1 C4/8/1 C4/8/1 C4/8/1 D4/8/2 D4/8/2 D4/8/2 D4/8/2 E4/q/3 D4/q/2 C4/h/1',
          lyrics: 'Hot cross buns, / hot cross buns, / one a pen- ny, two a pen- ny, / hot cross buns!',
          staff: true, names: false, range: ['C4', 'C5'], keyLabels: 'c', tempo: 84,
        },
      ],
    },
    {
      id: 'pickups-ties',
      title: 'Ties and pickup notes',
      summary: 'Holding across a bar line, and songs that start early.',
      steps: [
        {
          t: 'read', title: 'The tie',
          staffFig: { staves: [{ clef: 'treble', seq: 'E4/h G4/h ~G4/h F4/h' }], names: true },
          body: `<p>A <b>tie</b> is a curved line joining two notes of the <b>same pitch</b>. Play the first note and keep holding it through the second. Don't play it again.</p>
          <p>Ties let a note last across a bar line, like the G above: two beats in the first bar plus two more in the next.</p>`,
        },
        {
          t: 'play', title: 'Hold through the tie',
          say: 'Play each tied note once and keep it held while you count. The app moves on by itself.',
          rh: 'C4/q/1 E4/q/3 G4/h/5 ~G4/h F4/q/4 E4/q/3 D4/w/2 ~D4/h C4/h/1',
          staff: true, names: false, range: ['C4', 'C5'], keyLabels: 'c', tempo: 88, metronome: true,
        },
        {
          t: 'read', title: 'Pickup notes',
          staffFig: { staves: [{ clef: 'treble', seq: 'C4/8 C4/8 D4/q C4/q F4/q' }], time: '3/4', pickup: 1, names: true },
          body: `<p>Some songs start <b>before</b> beat 1. Those first few notes are called a <b>pickup</b>, and they sit in a short bar of their own at the very start.</p>
          <p>"Happy Birthday" is a perfect example. You sing "Hap-py" first, and the strong beat lands on "<b>birth</b>". It's in 3/4 time, so count "3 | <b>1</b> 2 3".</p>`,
        },
        {
          t: 'play', title: 'Happy Birthday', song: true,
          say: 'Start on the pickup ("Hap-py"), then lean into beat 1 on "birth". Thumb on Middle C.',
          time: '3/4', pickup: 1,
          rh: 'C4/8/1 C4/8/1 D4/q/2 C4/q/1 F4/q/4 E4/h/3 C4/8/1 C4/8/1 D4/q/2 C4/q/1 G4/q/5 F4/h./4',
          lyrics: 'Hap- py birth- day to you, / hap- py birth- day to you!',
          staff: true, names: false, range: ['C4', 'C5'], keyLabels: 'c', tempo: 100,
        },
      ],
    },
    {
      id: 'rests-three',
      title: 'Rests and 3/4 time',
      summary: 'Silence counts too, and the waltz feel.',
      steps: [
        {
          t: 'read', title: 'Rests',
          staffFig: { staves: [{ clef: 'treble', seq: 'C4/q r/q E4/q r/q G4/h r/h' }], names: true },
          body: `<p>A <b>rest</b> is a written silence. It lasts just as long as the note it matches: a quarter rest is one beat of silence, a half rest is two.</p>
          <p>Keep counting through rests! Lift your finger, but keep your hand ready. When the app reaches a rest, it simply moves on.</p>`,
        },
        {
          t: 'read', title: 'Three beats: the waltz',
          body: `<p>In <b>3/4</b> time each bar has <b>three beats</b>: "<b>1</b> 2 3, <b>1</b> 2 3". The first beat is a little stronger. This is the rhythm of a waltz.</p>
          <p>A <b>dotted half note</b> fills a whole bar of 3/4. The dot adds half the note's length: 2 + 1 = 3 beats.</p>`,
        },
        {
          t: 'quiz', q: 'Listen. Is this in 3 or in 4?', listen: 'C4/q E4/q G4/q C4/q E4/q G4/q C4/q E4/q G4/q C4/h.', tempo: 120,
          options: ['3 (waltz)', '4'], answer: 0, explain: 'You can hear the pattern repeat every three beats: ONE two three.',
        },
        {
          t: 'play', title: 'A little waltz', song: true,
          say: 'Count "1 2 3" in every bar. Rests are skipped automatically, but count them anyway.',
          time: '3/4',
          rh: 'C4/h/1 E4/q/3 G4/h/5 E4/q/3 F4/q/4 E4/q/3 D4/q/2 C4/h./1 E4/q/3 r/q G4/q/5 F4/q/4 r/q D4/q/2 E4/q/3 D4/q/2 F4/q/4 C4/h./1',
          staff: true, names: false, range: ['C4', 'C5'], keyLabels: 'c', tempo: 112,
        },
      ],
    },
    {
      id: 'largo',
      title: 'Dotted rhythms: Largo',
      summary: "Dvořák's 'Goin' Home' melody.",
      steps: [
        {
          t: 'read', title: 'The dotted quarter',
          staffFig: { staves: [{ clef: 'treble', seq: 'E4/q. G4/8 G4/h' }], names: true },
          body: `<p>A <b>dotted quarter note</b> lasts a beat and a half. It's usually followed by a short eighth note to fill the beat: "long… short".</p>
          <p>This rhythm opens the slow movement (Largo) of Dvořák's <b>New World Symphony</b> (1893). Listen before you play.</p>`,
        },
        {
          t: 'play', title: 'Largo, New World Symphony', song: true,
          say: 'Right hand in C position. Play it slowly and sweetly, holding the long notes.',
          rh: 'E4/q./3 G4/8/5 G4/h/5 E4/q./3 D4/8/2 C4/h/1 D4/q/2 E4/q/3 G4/q/5 E4/q/3 D4/w/2 E4/q./3 G4/8/5 G4/h/5 E4/q./3 D4/8/2 C4/h/1 D4/q/2 E4/q/3 D4/q/2 C4/q/1 C4/w/1',
          staff: true, names: false, range: ['C4', 'C5'], keyLabels: 'c', tempo: 66, reps: 2,
        },
      ],
    },
    {
      id: 'repeats',
      title: 'Repeat signs',
      summary: 'Two dots that tell you to play it again.',
      steps: [
        {
          t: 'read', title: 'Play it again',
          staffFig: { staves: [{ clef: 'treble', seq: '|: C4/q E4/q G4/q E4/q D4/q F4/q E4/h :|' }] },
          body: `<p>A thick bar line with <b>two dots</b> is a <b>repeat sign</b>. When you reach the dots facing backwards, go back to the matching sign facing forwards (or to the very start, if there isn't one) and play that part again.</p>
          <p>Composers use repeats to save paper. Sometimes the second time through has a different ending, marked with brackets numbered <b>1.</b> and <b>2.</b>: skip the first bracket on the way through again.</p>`,
        },
        {
          t: 'play', title: 'Repeat drill',
          say: 'When you reach the repeat sign, jump back and play those two bars again.',
          rh: '|: C4/q/1 E4/q/3 G4/q/5 E4/q/3 D4/q/2 F4/q/4 E4/h/3 :| F4/q/4 E4/q/3 D4/q/2 E4/q/3 C4/w/1',
          staff: true, names: false, range: ['C4', 'C5'], keyLabels: 'c', tempo: 92,
        },
        {
          t: 'play', title: 'Twinkle, with a repeat', song: true,
          say: '"Up above the world so high, like a diamond in the sky" is the same music twice, so it\'s written once with repeat signs.',
          rh: 'C4/q/1 C4/q/1 G4/q/4 G4/q/4 A4/q/5 A4/q/5 G4/h/4 F4/q/3 F4/q/3 E4/q/2 E4/q/2 D4/q/1 D4/q/1 C4/h/1 |: G4/q/4 G4/q/4 F4/q/3 F4/q/3 E4/q/2 E4/q/2 D4/h/1 :| C4/q/1 C4/q/1 G4/q/4 G4/q/4 A4/q/5 A4/q/5 G4/h/4 F4/q/3 F4/q/3 E4/q/2 E4/q/2 D4/q/1 D4/q/1 C4/h/1',
          lyrics: 'Twin- kle, twin- kle, lit- tle star, / how I won- der what you are! / Up a- bove the world so high, / like a dia- mond in the sky. / Twin- kle, twin- kle, lit- tle star, / how I won- der what you are!',
          staff: true, names: false, range: ['C4', 'C5'], keyLabels: 'c', tempo: 100,
        },
      ],
    },
    {
      id: 'grand-reading',
      title: 'Reading hands together',
      summary: 'Ode to Joy from the grand staff.',
      steps: [
        {
          t: 'read', title: 'Reading two staves',
          body: `<p>Reading both staves at once is a skill that grows slowly. A good habit: before you play, look at the <b>bottom staff</b> for each bar. The left hand changes less often, so it's easier to plan ahead.</p>
          <p>You already know this piece. Now read it from real sheet music.</p>`,
        },
        {
          t: 'play', title: 'Ode to Joy on the grand staff', song: true,
          say: 'Read both staves. The app waits for both hands where they play together.',
          rh: 'E4/q/3 E4/q/3 F4/q/4 G4/q/5 G4/q/5 F4/q/4 E4/q/3 D4/q/2 C4/q/1 C4/q/1 D4/q/2 E4/q/3 E4/q./3 D4/8/2 D4/h/2 E4/q/3 E4/q/3 F4/q/4 G4/q/5 G4/q/5 F4/q/4 E4/q/3 D4/q/2 C4/q/1 C4/q/1 D4/q/2 E4/q/3 D4/q./2 C4/8/1 C4/h/1',
          lyrics: 'Joy- ful, joy- ful, we a- dore Thee, / God of glo- ry, Lord of love; / Hearts un- fold like flow\'rs be- fore Thee, / op\'n- ing to the sun a- bove.',
          lh: 'C3/w/5 G3/w/1 C3/w/5 G3/w/1 C3/w/5 G3/w/1 C3/w/5 G3/h/1 C3/h/5',
          staff: true, names: false, range: ['C3', 'C5'], keyLabels: 'c', tempo: 96,
        },
      ],
    },
    {
      id: 'intervals',
      title: 'Intervals: 2nds to 5ths',
      summary: 'Measuring the distance between two notes.',
      steps: [
        {
          t: 'read', title: 'Counting the distance',
          staffFig: { staves: [{ clef: 'treble', seq: 'C4/h D4/h C4/h E4/h C4/h F4/h C4/h G4/h' }], names: true, bars: 4 },
          body: `<p>The distance between two notes is called an <b>interval</b>. To name one, count the letters from the first note to the second, <b>counting both</b>. C to D is a <b>2nd</b> (C, D). C to E is a <b>3rd</b> (C, D, E). C to F is a <b>4th</b>, and C to G is a <b>5th</b>.</p>
          <p>On the staff: a 2nd goes line to space, a 3rd goes line to line, and a 5th goes line to line with one line skipped. In C position, the interval matches the gap in finger numbers plus one: thumb to finger 3 is a 3rd.</p>`,
        },
        {
          t: 'play', title: 'Growing intervals',
          say: 'Keep your thumb on C and stretch a little further each time: 2nd, 3rd, 4th, 5th.',
          rh: 'C4/q/1 D4/q/2 C4/q/1 E4/q/3 C4/q/1 F4/q/4 C4/q/1 G4/q/5 [C4 D4]/h/1-2 [C4 E4]/h/1-3 [C4 F4]/h/1-4 [C4 G4]/h/1-5',
          staff: true, names: false, range: ['C4', 'C5'], keyLabels: 'c', tempo: 80,
        },
        {
          t: 'quiz', q: 'What interval is this?', staffFig: { staves: [{ clef: 'treble', seq: '[E4 G4]/w' }] },
          options: ['A 2nd', 'A 3rd', 'A 5th'], answer: 1, explain: 'E to G: count E, F, G. Three letters, so it\'s a 3rd (line to line).',
        },
        {
          t: 'quiz', q: 'What interval is this?', staffFig: { staves: [{ clef: 'treble', seq: '[D4 A4]/w' }] },
          options: ['A 4th', 'A 5th', 'A 3rd'], answer: 1, explain: 'D, E, F, G, A: five letters, so it\'s a 5th.',
        },
        {
          t: 'quiz', q: 'Listen. Is this a 2nd or a 5th?', listen: 'C4/h G4/h [C4 G4]/w', tempo: 80,
          options: ['A 2nd', 'A 5th'], answer: 1, explain: 'A 5th sounds open and wide. A 2nd is right next door and sounds crunchy when played together.',
        },
        {
          t: 'quiz', q: 'And this one?', listen: 'E4/h F4/h [E4 F4]/w', tempo: 80,
          options: ['A 2nd', 'A 5th'], answer: 0, explain: 'E and F are neighbours: a 2nd.',
        },
      ],
    },
  ],
};
