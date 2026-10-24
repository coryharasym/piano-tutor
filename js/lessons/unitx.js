// Playing with expression: loud and soft, smooth and detached, tempo and the pedal.

export default {
  id: 'ux',
  title: 'Playing with expression',
  blurb: 'Loud and soft, smooth and short, tempo words and the sustain pedal.',
  lessons: [
    {
      id: 'loud-soft',
      title: 'Loud and soft',
      summary: 'Piano, forte, and everything in between.',
      steps: [
        {
          t: 'read', title: 'Soft-loud',
          staffFig: { staves: [{ clef: 'treble', seq: '!f C4/q D4/q E4/h !p C4/q D4/q E4/h' }] },
          body: `<p>The piano's full name is the <b>pianoforte</b>, Italian for "soft-loud". It was the first keyboard that could play both, depending on how firmly you press the keys.</p>
          <p>Music marks loudness with Italian letters called <b>dynamics</b>: <b><i>p</i></b> (piano) means soft and <b><i>f</i></b> (forte) means loud. A mark stays in force until the next one.</p>
          <p>Loud doesn't mean banging. Let the weight of your arm sink into the key. For soft, use less weight but still press all the way down.</p>`,
        },
        {
          t: 'read', title: 'The whole family',
          body: `<p>From softest to loudest:</p>
          <p><b><i>pp</i></b> pianissimo, very soft · <b><i>p</i></b> piano, soft · <b><i>mp</i></b> mezzo-piano, medium soft · <b><i>mf</i></b> mezzo-forte, medium loud · <b><i>f</i></b> forte, loud · <b><i>ff</i></b> fortissimo, very loud</p>
          <p>"Mezzo" means "half". If a piece has no dynamics at all, play it about <b><i>mf</i></b>.</p>`,
        },
        {
          t: 'quiz', q: 'Listen. Is the second half louder or softer than the first?', listen: '!f C4/q E4/q G4/q E4/q C4/h r/h !p C4/q E4/q G4/q E4/q C4/h', tempo: 100,
          options: ['Louder', 'Softer'], answer: 1, explain: 'It starts forte and the answer comes back piano, like an echo.',
        },
        {
          t: 'quiz', q: 'What does mf mean?', options: ['Very loud', 'Medium loud', 'Medium soft'], answer: 1,
          explain: '<i>mf</i> is mezzo-forte: half loud, or medium loud.',
        },
        {
          t: 'play', title: 'Echo game',
          say: 'Play each phrase forte, then echo it piano. With listening on, I\'ll tell you whether I could hear the difference.',
          rh: '!f C4/q/1 D4/q/2 E4/h/3 !p C4/q/1 D4/q/2 E4/h/3 !f E4/q/3 F4/q/4 G4/h/5 !p E4/q/3 F4/q/4 G4/h/5 !f G4/q/5 F4/q/4 E4/q/3 D4/q/2 !p C4/w/1',
          staff: true, names: false, range: ['C4', 'C5'], keyLabels: 'c', tempo: 84,
        },
      ],
    },
    {
      id: 'cresc-dim',
      title: 'Getting louder and softer',
      summary: 'Crescendo and diminuendo: shaping a line.',
      steps: [
        {
          t: 'read', title: 'Little by little',
          staffFig: { staves: [{ clef: 'treble', seq: '!p !cresc C4/q D4/q E4/q F4/q !f G4/w' }] },
          body: `<p><b>Crescendo</b> (<i>cresc.</i>) means get louder little by little. <b>Diminuendo</b> (<i>dim.</i>) means get softer little by little. Sometimes they're drawn as long thin wedges called hairpins: opening for louder, closing for softer.</p>
          <p>The secret is to <b>plan the journey</b>. Start a crescendo soft enough that you have somewhere to go.</p>`,
        },
        {
          t: 'quiz', q: 'Listen. Does this get louder or softer?', listen: '!p !cresc C4/q D4/q E4/q F4/q G4/q A4/q B4/q !ff C5/w', tempo: 100,
          options: ['Louder (crescendo)', 'Softer (diminuendo)'], answer: 0, explain: 'It starts piano and grows to fortissimo: a crescendo.',
        },
        {
          t: 'quiz', q: 'And this one?', listen: '!ff !dim C5/q B4/q A4/q G4/q F4/q E4/q D4/q !pp C4/w', tempo: 100,
          options: ['Louder (crescendo)', 'Softer (diminuendo)'], answer: 1, explain: 'It fades from very loud to very soft: a diminuendo.',
        },
        {
          t: 'play', title: 'Up the hill and down again',
          say: 'Grow louder as you climb to G, then fade away as you come back down.',
          rh: '!p !cresc C4/q/1 D4/q/2 E4/q/3 F4/q/4 !f G4/w/5 !dim G4/q/5 F4/q/4 E4/q/3 D4/q/2 !p C4/w/1',
          staff: true, names: false, range: ['C4', 'C5'], keyLabels: 'c', tempo: 80,
        },
      ],
    },
    {
      id: 'touch',
      title: 'Smooth and detached',
      summary: 'Legato and staccato: two kinds of touch.',
      steps: [
        {
          t: 'read', title: 'Legato and staccato',
          staffFig: { staves: [{ clef: 'treble', seq: "(C4/q D4/q E4/q F4/q) G4'/q F4'/q E4'/q D4'/q" }] },
          body: `<p><b>Legato</b> means smooth and connected: hold each note until the very moment the next one sounds, so there's no gap. A curved line over several notes, called a <b>slur</b>, asks for legato.</p>
          <p><b>Staccato</b> means short and detached. A <b>dot</b> above or below the note head tells you to let go quickly, as if the key were hot. The note still gets its full beat; the rest of the beat is silence.</p>`,
        },
        {
          t: 'quiz', q: 'Listen. Smooth (legato) or detached (staccato)?', listen: "C4'/q D4'/q E4'/q F4'/q G4'/q F4'/q E4'/q D4'/q C4'/q", tempo: 100,
          options: ['Legato', 'Staccato'], answer: 1, explain: 'Each note is short, with a little silence after it: staccato.',
        },
        {
          t: 'play', title: 'Legato',
          say: 'Make it smooth: don\'t lift one finger until the next one goes down.',
          rh: '(C4/q/1 D4/q/2 E4/q/3 F4/q/4 G4/q/5 F4/q/4 E4/q/3 D4/q/2) C4/w/1',
          staff: true, names: false, range: ['C4', 'C5'], keyLabels: 'c', tempo: 80,
        },
        {
          t: 'play', title: 'Staccato',
          say: 'Bounce off each key. Small, light movements from the wrist.',
          rh: "C4'/q/1 D4'/q/2 E4'/q/3 F4'/q/4 G4'/q/5 F4'/q/4 E4'/q/3 D4'/q/2 C4/w/1",
          staff: true, names: false, range: ['C4', 'C5'], keyLabels: 'c', tempo: 80,
        },
        {
          t: 'play', title: 'Both touches',
          say: 'Smooth, then short. With listening on, I\'ll tell you if your staccato notes sounded crisp.',
          rh: "(C4/q/1 D4/q/2 E4/q/3 F4/q/4) G4'/q/5 G4'/q/5 G4/h/5 (F4/q/4 E4/q/3 D4/q/2 E4/q/3) C4'/q/1 C4'/q/1 C4/h/1",
          staff: true, names: false, range: ['C4', 'C5'], keyLabels: 'c', tempo: 84,
        },
      ],
    },
    {
      id: 'phrases',
      title: 'Slurs and phrases',
      summary: 'Playing a melody like a singer breathes.',
      steps: [
        {
          t: 'read', title: 'Musical sentences',
          body: `<p>Melodies are made of <b>phrases</b>, like sentences in speech. A phrase is usually two or four bars long, and a long slur often shows where it begins and ends.</p>
          <p>Shape each phrase: lean a little towards its high point, then relax at the end. Between phrases, lift your hand gently, like a singer taking a breath.</p>`,
        },
        {
          t: 'play', title: 'Ode to Joy, with phrasing', song: true,
          say: 'Two phrases: the first mezzo-forte, the second piano like an answer. Breathe between them.',
          rh: '!mf (E4/q/3 E4/q/3 F4/q/4 G4/q/5 G4/q/5 F4/q/4 E4/q/3 D4/q/2 C4/q/1 C4/q/1 D4/q/2 E4/q/3 E4/q./3 D4/8/2 D4/h/2) !p (E4/q/3 E4/q/3 F4/q/4 G4/q/5 G4/q/5 F4/q/4 E4/q/3 D4/q/2 C4/q/1 C4/q/1 D4/q/2 E4/q/3 D4/q./2 C4/8/1 C4/h/1)',
          staff: true, names: false, range: ['C4', 'C5'], keyLabels: 'c', tempo: 96,
        },
      ],
    },
    {
      id: 'tempo-words',
      title: 'Tempo words',
      summary: 'Adagio, Andante, Moderato, Allegro.',
      steps: [
        {
          t: 'read', title: 'How fast?',
          body: `<p>At the top of a piece you'll often find an Italian word for the <b>tempo</b>, the speed of the beat:</p>
          <p><b>Adagio</b>: slow and calm · <b>Andante</b>: at a walking pace · <b>Moderato</b>: moderate · <b>Allegro</b>: quick and cheerful</p>
          <p>Some music also gives a number, like ♩ = 80, which means 80 beats per minute. You can set that on the metronome in Daily practice.</p>`,
        },
        {
          t: 'quiz', q: 'Listen. Which tempo is this?', listen: 'C4/q C4/q G4/q G4/q A4/q A4/q G4/h F4/q F4/q E4/q E4/q D4/q D4/q C4/h', tempo: 54,
          options: ['Adagio (slow)', 'Allegro (quick)'], answer: 0, explain: 'Slow and calm: Adagio.',
        },
        {
          t: 'quiz', q: 'And this one?', listen: 'C4/q C4/q G4/q G4/q A4/q A4/q G4/h F4/q F4/q E4/q E4/q D4/q D4/q C4/h', tempo: 156,
          options: ['Adagio (slow)', 'Allegro (quick)'], answer: 1, explain: 'Quick and bright: Allegro.',
        },
        {
          t: 'quiz', q: 'Andante means…', options: ['At a walking pace', 'Very fast', 'Getting slower'], answer: 0,
          explain: 'Andante comes from the Italian for "walking".',
        },
      ],
    },
    {
      id: 'pedal',
      title: 'The sustain pedal',
      summary: 'What the right pedal does, and how it\'s written.',
      steps: [
        {
          t: 'read', title: 'The right pedal',
          staffFig: { staves: [{ clef: 'treble', seq: 'C4/q E4/q G4/q C5/q B4/q G4/q D4/q G4/q' }, { clef: 'bass', seq: '!ped C3/w !lift !ped G2/w' }] },
          body: `<p>The pedal on the right is the <b>sustain pedal</b>. While it's down, notes keep ringing after you let go of the keys. It makes the sound warm and full.</p>
          <p>Music shows it with <b>Ped.</b> where you press down and <b>*</b> where you lift. Too much pedal blurs everything together, so lift whenever the harmony changes.</p>
          <p>Press it with your right heel resting on the floor. If you're playing on a keyboard, a plug-in sustain pedal is worth having later on.</p>`,
        },
        {
          t: 'quiz', q: 'Listen. Is the pedal down?', listen: '!ped C4/q E4/q G4/q C5/q E5/q C5/q G4/q E4/q C4/w', tempo: 100,
          options: ['Yes, the notes blend and ring on', 'No, each note stops when released'], answer: 0,
          explain: 'The notes keep ringing and blend together: that\'s the sustain pedal.',
        },
        {
          t: 'quiz', q: 'And this time?', listen: 'C4/q E4/q G4/q C5/q E5/q C5/q G4/q E4/q C4/w', tempo: 100,
          options: ['Yes, the notes blend and ring on', 'No, each note stops when released'], answer: 1,
          explain: 'Each note stops cleanly: no pedal.',
        },
        {
          t: 'quiz', q: 'What does * mean under the music?', options: ['Press the pedal', 'Lift the pedal', 'Play loudly'], answer: 1,
          explain: '<b>Ped.</b> means press down; <b>*</b> means lift.',
        },
      ],
    },
  ],
};
