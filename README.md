# Piano Tutor

A mobile-friendly web app that teaches classical piano from the very beginning. Stand your phone on the music stand (landscape works best), open a lesson, and play on your real piano. The app listens through the microphone and waits until it hears the right note before moving on.

## What's inside

- **Three courses:** seven beginner chapters, eight intermediate chapters and eight advanced chapters. Intermediate and Advanced each add 64 hymn-focused lessons.
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
commit the chapter and course PDFs and `notes/source.sha256`:

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

Use the Beginner / Intermediate / Advanced buttons at the top of the home page. The
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

## Advanced course

Eight chapters and 64 new lessons balance solo hymn playing and accompanying
singers on an 88-key piano with sustain pedal. Each chapter has five original
skill lessons, two guided hymn studies and a recital. The final recital includes
three contrasting complete pieces. New source-checked repertoire includes
Eternal Father, Strong to Save and Jesus, the Very Thought of Thee, alongside
new arrangements of familiar hymns. See `sources/advanced/README.md` for retained
editions, rights, lyric references, transpositions and reductions.

The course teaches purposeful practice, more major/minor keys, broad arpeggios,
comfortable octave alternatives, four-part reading, secondary dominants,
modulation, two against three, voicing, pedal, transposition, introductions,
by-ear learning, singer accompaniment and performance. Creative work is evaluated
through listening and reflection, away from the fixed reference-score check.
Combined chorale scores are explicitly melody-led reductions; separate source
voice exercises and linked source scores support independent four-part reading.

Progress, resume points, songbooks, daily practice and reading records are
separate for all three courses. Backup/restore preserves them together. Advanced
recital suites track each completed reference performance before awarding the
ribbon. This does not certify physical technique, expression or a musical grade.

The Advanced Chapter notes button opens eight chapter PDFs and a complete
advanced-course PDF. All 23 chapters and three course collections are built from
the same curriculum. Run `npm run build:notes` after changes and `npm test` for
source freshness and all core regressions. `npm run test:browser` additionally
requires Playwright with Chromium; use `CHROMIUM_EXECUTABLE_PATH` for a custom
browser executable. Real iPhone/keyboard microphone and pedal behaviour still
requires physical device review; the existing automatic-accompaniment microphone
suppression is unchanged by the advanced course.

## Two recital choices per chapter

Intermediate and Advanced chapters each offer two recital choices, using the same
selection screen as Beginner. Original recital and hymn IDs remain valid. Each
alternative is a different complete hymn matched to the chapter skills, drawn
from the already verified public-domain repertoire. The final Intermediate
chapter offers two two-hymn programmes; Advanced offers two three-hymn programmes.
You perform one chosen programme, not both.

Selection persists by chapter and is included in progress backups. Completion of
one option cannot satisfy another option's performance checks: performance records
are keyed by lesson and piece ID. Existing completed lesson ribbons remain intact.
Both choices are always available on the hymn shelf, in the course songbook and
in the chapter/course PDF notes, irrespective of the currently selected recital.
The Intermediate songbook contains 34 entries and Advanced contains 36 entries,
including every piece in both final programmes.

## Warm-up

The home page has a Start warm-up card beside Daily Practice. This optional,
self-paced routine takes about three minutes, including setup and brief pauses:
settle in, right hand, left hand, hand coordination, a small musical phrase and
a closing check. Each playing pattern has two short rounds at a comfortable
reference tempo. Listen, slower demonstration speed, microphone/on-screen input,
finger guidance, Start again, Play again and Play along remain available.

A new beginner starts with gentle Middle C notes. Each hand moves to a five-finger
pattern after its C-position lesson. Hands play together after a corresponding
coordination lesson. Scale and broken-chord variants use completed skills, with
small deterministic variations among learned keys. Advanced two-octave C-major
work requires the relevant scale lesson. No wide blocked chords, octave grips,
speed targets, countdown or personal-best awards are introduced.

Warm-ups use the dynamic practice shelf, never the course curriculum. They leave
lesson completion, resume points, daily streaks and best times unchanged. At the
end, learners can repeat the warm-up, return to lessons or continue into Daily
Practice when it is unlocked. An active warm-up keeps its patterns while moving
between steps and Play along; a new start refreshes for the current course and
learned skills. The home-only stylesheet does not change printed chapter notes.

The routine is newly authored. Healthy-practice references informing the approach:
https://www.ism.org/advice/how-to-become-a-healthy-instrumentalist/
and https://www.bapam.org.uk/dont-cramp-your-style/ . The app cannot assess
physical technique or certify a warm-up as injury prevention. Prompts encourage
comfortable movement and stopping when anything hurts.
