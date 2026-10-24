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
          lh: 'C3/w/5 G3/w/1 C3/w/5 G3/w/1 C3/w/5 G3/w/1 C3/w/5 G3/h/1 C3/h/5',
          staff: true, names: false, range: ['C3', 'C5'], keyLabels: 'c', tempo: 96,
        },
      ],
    },
  ],
};
