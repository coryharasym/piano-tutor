import * as F from '../figures.js';

export default {
  id: 'u1',
  title: 'Foundations',
  blurb: 'How to sit, shape your hands, and find your way around the keys.',
  lessons: [
    {
      id: 'welcome',
      title: 'Welcome to the piano',
      summary: 'How this app works, and your very first note.',
      steps: [
        {
          t: 'read', title: 'Hello, pianist',
          body: `<p>Every great pianist started exactly where you are now. These lessons go one small step at a time, from how to sit all the way to real classical pieces.</p>
          <p>Each lesson mixes three things: a short read, a picture, and practice on your piano. When it's time to play, this app <b>listens through your phone's microphone</b> and waits until it hears the right note. There's no timer and no rush.</p>
          <p>Stand your phone on the music stand, sideways, and turn the volume up a little so you can hear the examples.</p>`,
        },
        {
          t: 'read', title: 'Turning on listening',
          body: `<p>Tap the <b>microphone button</b> at the top right. Your phone will ask for permission the first time. Allow it.</p>
          <p>When listening is on, the little meter next to it moves when you play. If you don't have a piano handy, you can always tap the keys on screen instead.</p>
          <p>Tip: practice in a quiet room. A TV or conversation in the background can confuse the listening.</p>`,
        },
        {
          t: 'play', title: 'Play any white key',
          say: 'Press any white key on your piano, firmly and clearly. Watch the screen light up when it hears you.',
          anyNote: true, keyLabels: 'c', range: ['C3', 'C6'],
        },
      ],
    },
    {
      id: 'posture',
      title: 'Sitting at the piano',
      summary: 'Bench height, distance, and a relaxed body.',
      steps: [
        {
          t: 'read', title: 'Your seat', fig: F.posture(),
          body: `<p>Good posture makes everything easier and prevents aches.</p>
          <ul><li>Sit on the <b>front half</b> of the bench, facing the middle of the keyboard.</li>
          <li>Your <b>elbows</b> should be about level with the keys. Raise or lower the bench, or use a cushion.</li>
          <li>Sit far enough back that your elbows are slightly in front of your body when your hands are on the keys.</li>
          <li><b>Feet flat</b> on the floor (or on a box if they don't reach).</li></ul>`,
        },
        {
          t: 'read', title: 'Stay loose',
          body: `<p>Tension is the enemy of good playing. Before every practice session, try this:</p>
          <ol><li>Roll your shoulders back and let them drop.</li>
          <li>Let your arms hang by your sides and shake out your hands.</li>
          <li>Take one slow breath, then lift your hands to the keys.</li></ol>
          <p>If anything starts to hurt while you play, stop and shake out again. Short, relaxed practice beats long, tense practice.</p>`,
        },
        {
          t: 'quiz', q: 'Where should you sit on the bench?',
          options: ['On the front half', 'All the way back', 'On the very edge'], answer: 0,
          explain: 'The front half lets your feet stay grounded and your arms move freely.',
        },
        {
          t: 'quiz', q: 'Your elbows should be…',
          options: ['Much lower than the keys', 'About level with the keys', 'Above your shoulders'], answer: 1,
          explain: 'Level elbows let your forearms rest naturally, with no reaching up or down.',
        },
      ],
    },
    {
      id: 'hands',
      title: 'Hand shape and finger numbers',
      summary: 'The "bubble" hand, and naming fingers 1 to 5.',
      steps: [
        {
          t: 'read', title: 'The bubble hand', fig: F.handShape(),
          body: `<p>Let your hand hang by your side. Notice how the fingers curve naturally? That's the shape you want at the piano.</p>
          <p>Imagine holding a <b>bubble</b> under your palm. Fingers are curved, you play on the <b>tips</b> (not the flat pads), and your wrist stays level, neither drooping nor high.</p>`,
        },
        {
          t: 'read', title: 'Finger numbers', fig: F.fingerNumbers(),
          body: `<p>Piano music numbers your fingers so it can tell you which one to use. On <b>both hands</b>, the thumb is <b>1</b> and the pinky is <b>5</b>.</p>
          <p>Try it now: hold up both hands and wiggle finger 3 (middle) on each. Then 1, then 5, then 2, then 4.</p>`,
        },
        {
          t: 'quiz', q: 'Which finger is number 1?', fig: F.fingerNumbers(),
          options: ['Pinky', 'Thumb', 'Index finger'], answer: 1,
          explain: 'The thumb is always 1, on both hands.',
        },
        {
          t: 'quiz', q: 'Which finger is number 4?',
          options: ['Ring finger', 'Middle finger', 'Pinky'], answer: 0,
          explain: 'Count from the thumb: 1 thumb, 2 index, 3 middle, 4 ring, 5 pinky.',
        },
        {
          t: 'read', title: 'Finger warm-up',
          body: `<p>Rest your right hand on a table in the bubble shape. Tap each finger in turn: <b>1 2 3 4 5</b>, then back <b>5 4 3 2 1</b>. Keep the other fingers relaxed and touching the table.</p>
          <p>Now do the same with your left hand. Fingers 4 and 5 feel weak at first. That's normal and gets better quickly.</p>`,
        },
      ],
    },
    {
      id: 'black-keys',
      title: 'The map of the keyboard',
      summary: 'Black keys come in groups of two and three.',
      steps: [
        {
          t: 'read', title: 'Twos and threes',
          fig: F.kbFigure({ from: 'C3', to: 'B4', groups: true, names: 'none', caption: 'Black keys repeat: a group of 2, then a group of 3' }),
          body: `<p>A piano can look like a sea of identical keys, but there's a simple pattern. The <b>black keys</b> come in groups of <b>two</b> and <b>three</b>, over and over, all the way up.</p>
          <p>These groups are your map. You'll find every note by looking at where it sits next to them.</p>`,
        },
        {
          t: 'play', title: 'A group of two',
          say: 'Find a group of TWO black keys near the middle of your piano and play both, one after the other.',
          rh: 'C#4/q/2 D#4/q/3', range: ['C3', 'C5'], keyLabels: 'none', names: false,
        },
        {
          t: 'play', title: 'A group of three',
          say: 'Now find the group of THREE black keys just to the right, and play all three, left to right.',
          rh: 'F#4/q/2 G#4/q/3 A#4/q/4', range: ['C3', 'C5'], keyLabels: 'none', names: false,
        },
        {
          t: 'read', title: 'Low and high',
          body: `<p>Play a few keys at the far left of your piano, then the far right. Left is <b>low</b> (deep, rumbly sounds). Right is <b>high</b> (bright, tinkly sounds).</p>
          <p>Moving right is called moving <b>up</b>. Moving left is moving <b>down</b>.</p>`,
        },
        {
          t: 'quiz', q: 'Listen. Which note is higher, the first or the second?',
          listen: 'C3/h G4/h', options: ['The first', 'The second'], answer: 1,
          explain: 'The second note was further to the right, so it sounds higher.',
        },
        {
          t: 'quiz', q: 'Listen again. Which is higher this time?',
          listen: 'A4/h D3/h', options: ['The first', 'The second'], answer: 0,
          explain: 'The first note was higher. Training your ear like this helps you catch your own mistakes.',
        },
      ],
    },
    {
      id: 'find-c',
      title: 'Finding C and Middle C',
      summary: 'Your home base on the keyboard.',
      steps: [
        {
          t: 'read', title: 'C lives left of the two',
          fig: F.kbFigure({ from: 'C3', to: 'B4', groups: true, names: 'marked', marks: [{ note: 'C3', hand: 'A' }, { note: 'C4', hand: 'A' }], caption: 'Every C sits just left of a group of two black keys' }),
          body: `<p>The white key just <b>to the left of every group of two black keys</b> is called <b>C</b>.</p>
          <p>There are several Cs on your piano, one for every group of two.</p>`,
        },
        {
          t: 'play', title: 'Play some Cs',
          say: 'Play three Cs: one low, one in the middle, one higher. Any order is fine.',
          rh: 'C3 C4 C5', anyOrder: true, range: ['C3', 'C6'], keyLabels: 'none', names: false, hint: false,
        },
        {
          t: 'read', title: 'Middle C',
          fig: F.kbFigure({ from: 'F3', to: 'G4', names: 'marked', marks: [{ note: 'C4', hand: 'A', label: '★' }], caption: 'Middle C is the C nearest the center of the piano' }),
          body: `<p>The C closest to the middle of your piano (usually right in front of you, often under the brand name) is called <b>Middle C</b>. Musicians also call it <b>C4</b>.</p>
          <p>Middle C is home base. Almost every beginner piece starts near it.</p>`,
        },
        {
          t: 'play', title: 'Play Middle C',
          say: 'Play Middle C with your right thumb (finger 1), four times.',
          rh: 'C4/q/1 C4/q/1 C4/q/1 C4/q/1', range: ['C3', 'C5'], keyLabels: 'c', names: false,
        },
      ],
    },
    {
      id: 'alphabet',
      title: 'The musical alphabet',
      summary: 'Seven letters, A to G, then repeat.',
      steps: [
        {
          t: 'read', title: 'Only seven letters',
          fig: F.kbFigure({ from: 'C4', to: 'C5', names: 'all', caption: 'C D E F G A B, then C again' }),
          body: `<p>Music uses just seven letters: <b>A B C D E F G</b>. After G, it starts again at A.</p>
          <p>Starting from C, the white keys go <b>C D E F G A B</b>, then the next C. The black keys get their names later.</p>
          <p>Tip: <b>D</b> sits in the middle of the two black keys, and <b>F</b> is just left of the three.</p>`,
        },
        {
          t: 'play', title: 'Walk up from Middle C',
          say: 'Starting on Middle C, play every white key going up until you reach the next C. Say each letter out loud as you play.',
          rh: 'C4 D4 E4 F4 G4 A4 B4 C5', range: ['C4', 'C5'], keyLabels: 'all', names: true,
        },
        {
          t: 'play', title: 'And back down',
          say: 'Now walk back down from C to Middle C, naming each note.',
          rh: 'C5 B4 A4 G4 F4 E4 D4 C4', range: ['C4', 'C5'], keyLabels: 'all', names: true,
        },
        {
          t: 'quiz', q: 'What letter comes after G?',
          options: ['H', 'A', 'C'], answer: 1, explain: 'After G the alphabet starts again at A.',
        },
        {
          t: 'quiz', q: 'Which white key sits between the two black keys?',
          fig: F.kbFigure({ from: 'C4', to: 'E4', names: 'none', marks: [{ note: 'D4', hand: 'A', label: '?' }] }),
          options: ['C', 'D', 'E'], answer: 1, explain: 'D is "in the doghouse" between the two black keys.',
        },
        {
          t: 'play', title: 'Find the notes',
          say: "Labels are off now. Find these notes near Middle C: D, then F, then A. Use the black keys as your map.",
          rh: 'D4 F4 A4', range: ['C4', 'C5'], keyLabels: 'c', names: true, hint: false,
        },
      ],
    },
  ],
};
