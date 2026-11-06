# Chord and feature audit — 6 November 2026

Baseline: merged PR #28 (6caa595).

## Audio coverage

The catalog audit extracts distinct simultaneous pitch sets from all course lessons, hymn shelves, every selectable recital arrangement, and two weeks of generated warm-ups at initial and completed progress. It found 576 unique voicings across 11,617 enumerated moments (including repeated arrangements and warm-up scenarios).

Recorded Salamander piano samples are resampled per key and mixed before an 8192-point FFT, at 44.1 and 48 kHz. Easy mode is checked with each complete chord and every individual expected key. Silence must never pass. This is controlled audio coverage, not a recording of a physical keyboard through an iPhone microphone.

Before the fix, 822 Easy-mode cases failed: full-target harmonic exclusion could suppress an upper expected note even when the presumed lower key was absent. Easy mode now evaluates each candidate independently while retaining the detector's unexpected-lower-root rejection. All 6,910 catalog checks pass. Existing focused wrong-note, held-chord, calibration, and strict Flow regressions also pass.

The same audit reports 711 misses in 1,152 uncalibrated strict-mode cases over samples at 160, 240 and 320 ms. This is a limitation, not a passing strict-mode certification. Octave pairs intentionally require calibration; dense voicings can also need saved keyboard fingerprints. These results do not show whether a longer passage or calibration resolves each missed voicing. Physical-device verification is still needed.

Run `npm run test:chords:all` to repeat the catalog audit.

## Other fixes

- Metronome startup now cancels if Stop is pressed or the page is disposed while audio unlock is pending. This prevents delayed background playback and duplicate startup.
- The personal-practice pause browser check now compares score content after the pause has settled and excludes generated SVG IDs. A resize-driven redraw could previously fail the check without advancing a note.

## Feature coverage

Automated checks cover lesson notation and structure, all three courses, selectable recitals, both hands and passage loops, ordinary and assisted chord input, calibration/persistence, Flow countdown and pause/restart, guided sessions and reflection, My Pieces and notes/focus, backup/restore, course/menu routes, PDF links, songbook and isolated single-song printing, verse switching, and phone-sized layouts including 874×402 and 874×320.

This audit combines automated tests and targeted source review. It cannot establish that all possible bugs are absent. Browser checks use Chromium emulation; Safari permissions, physical microphone acoustics, and subjective piano teaching/music quality remain outside that coverage.
