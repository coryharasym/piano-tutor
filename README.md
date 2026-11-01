# Piano Tutor

A mobile-friendly web app that teaches classical piano from the very beginning. Stand your phone on the music stand (landscape works best), open a lesson, and play on your real piano. The app listens through the microphone and waits until it hears the right note before moving on.

## What's inside

- **Beginner and Intermediate courses:** seven beginner chapters and eight intermediate chapters, with 64 new intermediate lessons focused on hymn playing.
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

GitHub Pages serves the site straight from `main`; the Tests workflow runs on every push and pull request.

```sh
npm test
```

Checks that every lesson's notes parse and add up bar by bar, that both hands line up, and that the pitch detector picks out the right notes from the real piano recordings (needs `ffmpeg`).

## Publishing

GitHub Pages serves the site straight from the `main` branch. The Tests workflow runs on every push and pull request.

## Writing lessons

Lessons live in `js/lessons/unit*.js`. Notes use a compact format: `note/duration/finger`, for example `C4/q/1 D4/q/2 E4/h/3`. Chords go in brackets: `[C4 E4 G4]/h/1-3-5`. Rests are `r/q`. Durations: `w h h. q q. 8 8. 16 8t`.

## Credits

- Piano samples: [Salamander Grand Piano](https://archive.org/details/SalamanderGrandPianoV3) by Alexander Holm (CC BY 3.0), via [`@audio-samples/piano-mp3-velocity8`](https://www.npmjs.com/package/@audio-samples/piano-mp3-velocity8), trimmed for size.
- Sheet music rendering: [VexFlow](https://www.vexflow.com) 4.2.3 (MIT).

### Chapter notes

Each unit has a **Chapter notes & PDF** link. The home header opens all chapters,
with downloads for each chapter and the complete course. Lesson headers also link
to their chapter. Notes are available at any stage; downloads are real PDF files
and can be printed or saved with the iPhone share menu.

The notes use the lesson explanations, diagrams, review answers and practice tasks
from the curriculum, plus an opening notation example per lesson and chapter
self-assessment checklists. All recital choices are included, independent of a
learner's saved selection. Full scores remain in the Songbook.

After changing lessons, illustrations, notation, or notes styling, regenerate and
commit the eight PDFs and `notes/source.sha256`:

```sh
npm install --no-save playwright
npx playwright install chromium
npm run build:notes
npm test
```

The normal test suite checks PDF signatures, chapter coverage and a source
fingerprint so curriculum changes cannot silently leave the downloads out of date.
PDF generation uses local assets and a temporary local server; the app needs no
runtime PDF service or additional browser dependency.

## Intermediate course

Use the Beginner / Intermediate buttons at the top of the home page. The
intermediate course has eight chapters and 64 new lessons: five skill lessons,
two guided hymn studies and a recital in each chapter. It starts with a
transition from the beginner course and ends with a two-hymn programme.

Existing lesson IDs and beginner progress are unchanged. Both courses use the
same local progress object and backup file, with separate resume locations,
course-filtered progress totals, songbooks, hymn shelves and daily practice.
The selected course is remembered. Intermediate progress IDs start with `int-`.
A lesson completion records practice; it is not a certified grade.

Intermediate notation adds eighth-note triplets (`8t`, three in one quarter),
B-flat key-signature support, and count-ins in the large beats of compound
metres. Existing Wait/Flow, one-hand practice, microphone setup, speed, bar
loops, printing and progress backup remain shared. Source-score links appear
on the new-source study screens. See `sources/intermediate/README.md` for
rights, source editions and teaching adaptations.

Chapter notes have eight new chapter PDFs and a complete intermediate PDF.
`npm run build:notes` rebuilds both courses' PDFs and their source fingerprint.
For browser checks, install Playwright and Chromium and run `npm run test:browser`;
set `CHROMIUM_EXECUTABLE_PATH` when using a system Chromium. It starts its own
local server and checks the courses at a phone-landscape viewport. `npm test`
includes course isolation, source integrity, triplet timing and backup checks.
