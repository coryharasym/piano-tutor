import * as F from '../figures.js';

const pos = (notes, hand, caption, from, to) => F.kbFigure({
  from, to, names: 'marked', caption,
  marks: notes.map((n, i) => ({ note: n, hand, label: String(hand === 'R' ? i + 1 : 5 - i), name: n.includes('#') || n.includes('b') ? n.replace(/\d/, '').replace('#', '♯').replace('b', '♭') : '' })),
});

// A one-note "what is this note?" quiz.
const nameQuiz = (clef, note, options, answer, explain) => ({
  t: 'quiz', q: 'What is this note?', staffFig: { staves: [{ clef, seq: `${note}/w` }] },
  options, answer, explain,
});

export default {
  id: 'u4',
  title: 'Moving around',
  blurb: 'New positions, sharps and flats, thumb-under, and your first scales.',
  lessons: [
    {
      id: 'landmarks',
      title: 'Landmark notes and ledger lines',
      summary: 'Signposts on the staff, and notes above and below it.',
      steps: [
        {
          t: 'read', title: 'Landmark notes',
          staffFig: { staves: [{ clef: 'treble', seq: 'C4/h G4/h C5/h r/h' }, { clef: 'bass', seq: 'r/h F3/h C3/h C4/h' }], names: true },
          body: `<p>Instead of counting up from the bottom line every time, good readers learn a few <b>landmark notes</b> and read from the nearest one.</p>
          <p>Treble <b>G</b> sits on the line the treble clef curls around. Bass <b>F</b> sits on the line between the bass clef's two dots. <b>Middle C</b> sits on a short line between the staves. Two more Cs make easy signposts: treble C in the <b>third space</b>, and bass C in the <b>second space</b>.</p>`,
        },
        {
          t: 'play', title: 'Landmark hops',
          say: 'Hop between the landmarks: Middle C, treble G, treble C. Use whatever fingers feel comfortable.',
          rh: 'C4/q G4/q C5/q G4/q C4/q G4/q C5/h G4/q C5/q G4/q C4/q C4/w',
          staff: true, names: false, range: ['C4', 'C5'], keyLabels: 'c', tempo: 80,
        },
        {
          t: 'play', title: 'Bass landmarks',
          say: 'Now your left hand: bass C, bass F, and up to Middle C.',
          lh: 'C3/q F3/q C4/q F3/q C3/q F3/q C4/h F3/q C4/q F3/q C3/q C3/w',
          staff: true, names: false, range: ['C3', 'C5'], keyLabels: 'c', tempo: 80,
        },
        {
          t: 'read', title: 'Ledger lines',
          staffFig: { staves: [{ clef: 'treble', seq: 'F5/h G5/h A5/h C6/h' }], names: true },
          body: `<p>Music can go higher or lower than the five lines. Short extra lines called <b>ledger lines</b> extend the staff. Middle C is the one you already know.</p>
          <p>Keep the pattern going: above the top line of the treble staff (F) comes G in the space just above, then <b>A on the first ledger line</b>, and C on the second. Below the bass staff it's the mirror: F hangs just under the bottom line, and <b>E sits on the first ledger line</b>.</p>`,
        },
        nameQuiz('treble', 'A5', ['F', 'A', 'C'], 1, 'One ledger line above the treble staff is A: top line F, space G, ledger line A.'),
        nameQuiz('treble', 'C5', ['C', 'A', 'E'], 0, 'The third space of the treble staff is treble C, one of the landmarks. (It\'s the C in F-A-C-E.)'),
        nameQuiz('bass', 'F3', ['G', 'D', 'F'], 2, 'The line between the bass clef\'s dots is F. That\'s why it\'s also called the F clef.'),
        nameQuiz('bass', 'E2', ['E', 'G', 'C'], 0, 'One ledger line below the bass staff is E: bottom line G, space F, ledger line E.'),
      ],
    },
    {
      id: 'g-position',
      title: 'G position',
      summary: 'Moving your hands to a new home.',
      steps: [
        {
          t: 'read', title: 'A new home', fig: pos(['G4', 'A4', 'B4', 'C5', 'D5'], 'R', 'Right hand G position: thumb on G', 'C4', 'E5'),
          body: `<p>Your hands don't have to stay on C. Move the right hand up so the thumb sits on the <b>G</b> just above Middle C. Now your fingers cover <b>G A B C D</b>.</p>
          <p>The pattern of fingers is exactly the same as before. Only the starting note changed.</p>`,
        },
        {
          t: 'play', title: 'Right hand G position',
          say: 'Thumb on G. Play up and down: G A B C D C B A G.',
          rh: 'G4/q/1 A4/q/2 B4/q/3 C5/q/4 D5/q/5 C5/q/4 B4/q/3 A4/q/2 G4/w/1', staff: true, names: true, range: ['C4', 'E5'], keyLabels: 'c',
        },
        {
          t: 'play', title: 'Left hand G position',
          say: 'Left pinky on the G below Middle C. Play up and down.',
          lh: 'G2/q/5 A2/q/4 B2/q/3 C3/q/2 D3/q/1 C3/q/2 B2/q/3 A2/q/4 G2/w/5', staff: true, names: true, range: ['C2', 'C4'], keyLabels: 'c',
        },
        {
          t: 'play', title: 'Ode to Joy in G', song: true,
          say: 'The same tune, moved to G position. Same fingers as before!',
          rh: 'B4/q/3 B4/q/3 C5/q/4 D5/q/5 D5/q/5 C5/q/4 B4/q/3 A4/q/2 G4/q/1 G4/q/1 A4/q/2 B4/q/3 B4/q./3 A4/8/2 A4/h/2 B4/q/3 B4/q/3 C5/q/4 D5/q/5 D5/q/5 C5/q/4 B4/q/3 A4/q/2 G4/q/1 G4/q/1 A4/q/2 B4/q/3 A4/q./2 G4/8/1 G4/h/1',
          staff: true, names: false, range: ['C4', 'E5'], keyLabels: 'c', tempo: 100,
        },
      ],
    },
    {
      id: 'sharps-flats',
      title: 'Sharps and flats',
      summary: 'Naming the black keys.',
      steps: [
        {
          t: 'read', title: 'Up a little, down a little',
          fig: F.kbFigure({
            from: 'C4', to: 'B4', names: 'all',
            marks: [{ note: 'F#4', hand: 'R', name: 'F♯' }, { note: 'Bb4', hand: 'L', name: 'B♭' }],
            arrows: [{ from: 'F4', to: 'F#4', label: 'sharp ♯' }, { from: 'B4', to: 'Bb4', label: 'flat ♭' }],
          }),
          body: `<p>The black keys are named after their white neighbours. A <b>sharp ♯</b> means "one key higher" and a <b>flat ♭</b> means "one key lower".</p>
          <p>So the black key just right of F is <b>F♯</b> (F sharp). The black key just left of B is <b>B♭</b> (B flat). Every black key has two names: F♯ is the same key as G♭.</p>
          <p>The distance from any key to its very nearest neighbour is called a <b>half step</b>.</p>`,
        },
        {
          t: 'play', title: 'Find the sharps',
          say: 'Play F, then F sharp. Then C, then C sharp.',
          rh: 'F4/q F#4/q C4/q C#4/q', staff: true, names: true, range: ['C4', 'C5'], keyLabels: 'all',
        },
        {
          t: 'play', title: 'Find the flats',
          say: 'Play B, then B flat. Then E, then E flat.',
          rh: 'B4/q Bb4/q E4/q Eb4/q', staff: true, names: true, range: ['C4', 'C5'], keyLabels: 'all',
        },
        {
          t: 'quiz', q: 'F♯ is the black key…', options: ['Just right of F', 'Just left of F', 'Just right of G'], answer: 0,
          explain: 'Sharp means one key higher, so F♯ is just to the right of F.',
        },
        {
          t: 'quiz', q: 'What is another name for the black key between C and D?', options: ['D♯', 'D♭', 'C♭'], answer: 1,
          explain: "It's both C♯ (C raised) and D♭ (D lowered).",
        },
        {
          t: 'read', title: 'Natural signs and key signatures',
          body: `<p>A <b>natural ♮</b> cancels a sharp or flat: play the white key.</p>
          <p>Sometimes the sharps or flats are written once at the start of every line. That's a <b>key signature</b>. A sharp on the F line means <b>every F is F♯</b> unless you see a natural. You'll meet this in the next lessons.</p>`,
        },
      ],
    },
    {
      id: 'd-position',
      title: 'D position and F sharp',
      summary: 'A five-finger position with a black key.',
      steps: [
        {
          t: 'read', title: 'Major five-finger pattern', fig: pos(['D4', 'E4', 'F#4', 'G4', 'A4'], 'R', 'D position: finger 3 on the black key F♯', 'C4', 'B4'),
          body: `<p>Listen to C D E F G: it sounds bright and happy. That sound is called <b>major</b>. To get the same sound starting on D, you need one black key: <b>D E F♯ G A</b>.</p>
          <p>Your third finger reaches forward onto F♯. Keep the hand relaxed and let the finger move in, rather than twisting the wrist.</p>`,
        },
        {
          t: 'play', title: 'D position',
          say: 'Thumb on D. Play up and down, with finger 3 on F sharp.',
          rh: 'D4/q/1 E4/q/2 F#4/q/3 G4/q/4 A4/q/5 G4/q/4 F#4/q/3 E4/q/2 D4/w/1', staff: true, names: true, key: 'D', range: ['C4', 'C5'], keyLabels: 'c',
        },
        {
          t: 'play', title: 'Mary in D', song: true,
          say: 'The key signature has two sharps, but in this tune only F♯ appears.',
          rh: 'F#4/q/3 E4/q/2 D4/q/1 E4/q/2 F#4/q/3 F#4/q/3 F#4/h/3 E4/q/2 E4/q/2 E4/h/2 F#4/q/3 A4/q/5 A4/h/5 F#4/q/3 E4/q/2 D4/q/1 E4/q/2 F#4/q/3 F#4/q/3 F#4/q/3 F#4/q/3 E4/q/2 E4/q/2 F#4/q/3 E4/q/2 D4/w/1',
          staff: true, names: false, key: 'D', range: ['C4', 'C5'], keyLabels: 'c', tempo: 100,
        },
      ],
    },
    {
      id: 'f-position',
      title: 'F position and B flat',
      summary: 'A five-finger position with a flat.',
      steps: [
        {
          t: 'read', title: 'F major position', fig: pos(['F4', 'G4', 'A4', 'Bb4', 'C5'], 'R', 'F position: finger 4 on B♭', 'C4', 'D5'),
          body: `<p>Starting on F, the major pattern needs a <b>B♭</b>: <b>F G A B♭ C</b>. The key signature of F major has one flat on the B line.</p>`,
        },
        {
          t: 'play', title: 'F position',
          say: 'Thumb on F. Finger 4 plays B flat.',
          rh: 'F4/q/1 G4/q/2 A4/q/3 Bb4/q/4 C5/q/5 Bb4/q/4 A4/q/3 G4/q/2 F4/w/1', staff: true, names: true, key: 'F', range: ['C4', 'D5'], keyLabels: 'c',
        },
        {
          t: 'play', title: 'Hot Cross Buns in F', song: true,
          say: 'Hand in F position: A G F with fingers 3 2 1.',
          rh: 'A4/q/3 G4/q/2 F4/h/1 A4/q/3 G4/q/2 F4/h/1 F4/8/1 F4/8/1 F4/8/1 F4/8/1 G4/8/2 G4/8/2 G4/8/2 G4/8/2 A4/q/3 G4/q/2 F4/h/1',
          staff: true, names: false, key: 'F', range: ['C4', 'D5'], keyLabels: 'c', tempo: 100,
        },
      ],
    },
    {
      id: 'thumb-under',
      title: 'Thumb under',
      summary: 'The trick for playing more than five notes.',
      steps: [
        {
          t: 'read', title: 'Crossing the thumb',
          fig: F.kbFigure({
            from: 'C4', to: 'C5', names: 'all',
            marks: [['C4', 1], ['D4', 2], ['E4', 3], ['F4', 1], ['G4', 2], ['A4', 3], ['B4', 4], ['C5', 5]].map(([n, f]) => ({ note: n, hand: 'R', label: String(f) })),
            arrows: [{ from: 'E4', to: 'F4', label: 'thumb under' }],
          }),
          body: `<p>Five fingers, but eight notes in C to C. The solution: after finger 3 plays E, <b>tuck your thumb under</b> your hand to play F. Then fingers 2 3 4 5 continue.</p>
          <p>Keep your wrist level and smooth. The thumb should start moving under while finger 3 is still playing, so there's no bump.</p>`,
        },
        {
          t: 'play', title: 'Thumb-under warm-up',
          say: 'Play C D E, then pass the thumb under to F. Back and forth.',
          rh: 'C4/q/1 D4/q/2 E4/q/3 F4/q/1 E4/q/3 D4/q/2 C4/h/1 C4/q/1 D4/q/2 E4/q/3 F4/q/1 G4/q/2 F4/q/1 E4/h/3', staff: true, names: true, range: ['C4', 'C5'], keyLabels: 'c', reps: 2,
        },
        {
          t: 'read', title: 'Finger 3 over',
          body: `<p>Coming back down, it's the reverse: after the thumb plays F, finger <b>3 crosses over</b> the thumb to play E.</p>`,
        },
        {
          t: 'play', title: 'Crossing over',
          say: 'Play G F with 2 1, then cross 3 over to E. Then D C.',
          rh: 'G4/q/2 F4/q/1 E4/q/3 D4/q/2 C4/h/1 r/h E4/q/3 F4/q/1 G4/q/2 F4/q/1 E4/q/3 D4/q/2 C4/h/1', staff: true, names: true, range: ['C4', 'C5'], keyLabels: 'c', reps: 2,
        },
      ],
    },
    {
      id: 'c-scale',
      title: 'The C major scale',
      summary: 'Eight notes, one octave, both hands.',
      steps: [
        {
          t: 'read', title: 'What is a scale?',
          body: `<p>A <b>scale</b> is a ladder of notes, going up or down by step. The <b>C major scale</b> uses all the white keys from C to C: eight notes, called an <b>octave</b>.</p>
          <p>Scales are the push-ups of piano playing. Pianists practice them every day to build even, smooth fingers.</p>
          <p>Right hand fingering: <b>1 2 3, thumb under, 1 2 3 4 5</b>.</p>`,
        },
        {
          t: 'play', title: 'Right hand, up and down',
          say: 'Play the C major scale up and back down. Thumb under on the way up, 3 over on the way down.',
          rh: 'C4/q/1 D4/q/2 E4/q/3 F4/q/1 G4/q/2 A4/q/3 B4/q/4 C5/q/5 B4/q/4 A4/q/3 G4/q/2 F4/q/1 E4/q/3 D4/q/2 C4/h/1', staff: true, names: false, range: ['C4', 'C5'], keyLabels: 'c', tempo: 80, reps: 2,
        },
        {
          t: 'read', title: 'The left hand scale',
          fig: F.kbFigure({
            from: 'C3', to: 'C4', names: 'all',
            marks: [['C3', 5], ['D3', 4], ['E3', 3], ['F3', 2], ['G3', 1], ['A3', 3], ['B3', 2], ['C4', 1]].map(([n, f]) => ({ note: n, hand: 'L', label: String(f) })),
            arrows: [{ from: 'G3', to: 'A3', label: '3 over' }],
          }),
          body: `<p>The left hand goes <b>5 4 3 2 1</b>, then finger <b>3 crosses over</b> the thumb to A, then <b>2 1</b>.</p>
          <p>Coming back down it's the mirror: <b>1 2 3</b> for C B A, then the <b>thumb tucks under</b> to G, and <b>2 3 4 5</b> finish the scale.</p>`,
        },
        {
          t: 'play', title: 'Left hand, up and down',
          say: 'Left hand: 5 4 3 2 1, cross 3 over, 2 1. Then back down.',
          lh: 'C3/q/5 D3/q/4 E3/q/3 F3/q/2 G3/q/1 A3/q/3 B3/q/2 C4/q/1 B3/q/2 A3/q/3 G3/q/1 F3/q/2 E3/q/3 D3/q/4 C3/h/5', staff: true, names: false, range: ['C3', 'C4'], keyLabels: 'c', tempo: 80, reps: 2,
        },
        {
          t: 'play', title: 'Hands together (challenge)',
          say: 'Both hands, very slowly. The fingers cross at different moments, so think about each one.',
          rh: 'C4/q/1 D4/q/2 E4/q/3 F4/q/1 G4/q/2 A4/q/3 B4/q/4 C5/q/5', lh: 'C3/q/5 D3/q/4 E3/q/3 F3/q/2 G3/q/1 A3/q/3 B3/q/2 C4/q/1',
          staff: true, names: false, range: ['C3', 'C5'], keyLabels: 'c', tempo: 60,
        },
      ],
    },
    {
      id: 'g-f-scales',
      title: 'G and F major scales',
      summary: 'Scales with one sharp and one flat.',
      steps: [
        {
          t: 'read', title: 'G major has F♯',
          body: `<p>The <b>G major scale</b> is G A B C D E <b>F♯</b> G. It uses the same fingering as C major: 1 2 3, thumb under, 1 2 3 4 5. Finger 4 lands on F♯.</p>`,
        },
        {
          t: 'play', title: 'G major, right hand',
          say: 'Thumb on G. Remember the F sharp near the top.',
          rh: 'G4/q/1 A4/q/2 B4/q/3 C5/q/1 D5/q/2 E5/q/3 F#5/q/4 G5/q/5 F#5/q/4 E5/q/3 D5/q/2 C5/q/1 B4/q/3 A4/q/2 G4/h/1', staff: true, names: false, key: 'G', range: ['G4', 'G5'], keyLabels: 'c', tempo: 80,
        },
        {
          t: 'read', title: 'F major has B♭',
          body: `<p>The <b>F major scale</b> is F G A <b>B♭</b> C D E F. Its right hand fingering is different, because a thumb on a black key is awkward: <b>1 2 3 4</b>, thumb under to C, then <b>1 2 3 4</b>.</p>`,
        },
        {
          t: 'play', title: 'F major, right hand',
          say: 'Fingers 1 2 3 4 for F G A B flat, thumb under to C, then 1 2 3 4.',
          rh: 'F4/q/1 G4/q/2 A4/q/3 Bb4/q/4 C5/q/1 D5/q/2 E5/q/3 F5/q/4 E5/q/3 D5/q/2 C5/q/1 Bb4/q/4 A4/q/3 G4/q/2 F4/h/1', staff: true, names: false, key: 'F', range: ['F4', 'F5'], keyLabels: 'c', tempo: 80,
        },
      ],
    },
    {
      id: 'minor',
      title: 'Major and minor',
      summary: 'Happy and sad sounds, and A minor.',
      steps: [
        {
          t: 'read', title: 'A minor position', fig: pos(['A3', 'B3', 'C4', 'D4', 'E4'], 'R', 'A minor position: thumb on A', 'F3', 'G4'),
          body: `<p>Music in a <b>minor</b> key often sounds sad, mysterious or serious. Compare C D E (major) with A B C (minor). The middle note is closer to the bottom.</p>
          <p>Put your right thumb on the A just below Middle C. Your fingers now cover <b>A B C D E</b>, all white keys.</p>`,
        },
        {
          t: 'play', title: 'A minor five-finger',
          say: 'Up and down in A minor. Listen to the darker colour.',
          rh: 'A3/q/1 B3/q/2 C4/q/3 D4/q/4 E4/q/5 D4/q/4 C4/q/3 B3/q/2 A3/w/1', staff: true, names: true, range: ['F3', 'G4'], keyLabels: 'c',
        },
        {
          t: 'quiz', q: 'Listen. Major or minor?', listen: 'C4/q D4/q E4/q F4/q G4/h [C4 E4 G4]/h',
          options: ['Major', 'Minor'], answer: 0, explain: 'That was C major: bright and open.',
        },
        {
          t: 'quiz', q: 'And this one?', listen: 'A3/q B3/q C4/q D4/q E4/h [A3 C4 E4]/h',
          options: ['Major', 'Minor'], answer: 1, explain: 'That was A minor: a darker, more wistful colour.',
        },
        {
          t: 'play', title: 'A sad little song', song: true,
          say: 'A melody in A minor. Play it gently.',
          rh: 'E4/q/5 D4/q/4 C4/q/3 B3/q/2 C4/h/3 A3/h/1 B3/q/2 C4/q/3 D4/q/4 B3/q/2 C4/h/3 E4/h/5 E4/q/5 D4/q/4 C4/q/3 B3/q/2 C4/q/3 B3/q/2 A3/h/1',
          staff: true, names: false, key: 'Am', range: ['F3', 'G4'], keyLabels: 'c', tempo: 80,
        },
      ],
    },
  ],
};
