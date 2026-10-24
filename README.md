# Piano Tutor

A mobile-friendly web app that teaches classical piano from the very beginning. Stand your phone on the music stand (landscape works best), open a lesson, and play on your real piano. The app listens through the microphone and waits until it hears the right note before moving on.

## What's inside

- **45 lessons in 6 units:** Foundations, First steps, Reading music, Moving around, Harmony, and Classical repertoire (Beethoven, Bach/Petzold, Mozart, Dvořák, Pachelbel).
- **Read, look, play:** each lesson mixes short explanations, illustrations, quizzes and practice.
- **Listens to you play:** pitch detection on the phone's microphone, tuned for piano. Repeated notes and chords work too. You can always tap the on-screen keys instead.
- **Real piano sound:** sampled grand piano for every key, demo playback ("Listen") and a count-in for rhythm.
- **Sheet music:** treble, bass and grand staff, drawn with VexFlow, with the current note highlighted.
- **Progress saved on your device,** keeps the screen awake during lessons, and works offline after the first visit.

## Running it locally

No build step. Serve the folder with any static server:

```sh
npm start   # python3 -m http.server 8080
```

Then open http://localhost:8080. The microphone only works on `https://` or `localhost`.

## Tests

```sh
npm test
```

Checks that every lesson's notes parse and add up bar by bar, that both hands line up, and that the pitch detector picks out the right notes from the real piano recordings (needs `ffmpeg`).

## Writing lessons

Lessons live in `js/lessons/unit*.js`. Notes use a compact format: `note/duration/finger`, for example `C4/q/1 D4/q/2 E4/h/3`. Chords go in brackets: `[C4 E4 G4]/h/1-3-5`. Rests are `r/q`. Durations: `w h h. q q. 8 8. 16`.

## Credits

- Piano samples: [Salamander Grand Piano](https://archive.org/details/SalamanderGrandPianoV3) by Alexander Holm (CC BY 3.0), via [`@audio-samples/piano-mp3-velocity8`](https://www.npmjs.com/package/@audio-samples/piano-mp3-velocity8), trimmed for size.
- Sheet music rendering: [VexFlow](https://www.vexflow.com) 4.2.3 (MIT).
