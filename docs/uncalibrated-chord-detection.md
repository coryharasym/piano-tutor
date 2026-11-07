# Uncalibrated chord detection: bounded quiet-note recovery

This change adds a fallback for a complete chord whose quiet fundamental is masked by another note. It retains the existing detector and its successful matches. The fallback must confirm every expected note before its evidence is used; partial fallback results cannot be mixed into the normal chord history.

A broader quiet fundamental needs two independent upper partials. Additional checks cover strong low bass roots, masked bass neighbours, and octave overtones. Easy mode and personal calibration keep their existing behavior. No reference model, download, external service, or automatic calibration is introduced.

## Recorded-piano results

At 44.1 and 48 kHz, using three separate windows at 160, 240 and 320 ms:

- Full chord trials without octave pairs: Wait recognition improves from 443/636 to 459/636; Flow improves from 440/636 to 454/636. Every previously accepted complete trial remains accepted.
- 2,902 missing-note/semitone substitutions remain rejected in Wait and Flow.
- 3,258 octave substitutions introduce no new false passes. The existing 217 incorrect accepts remain unresolved; the test explicitly tracks them rather than claiming all octave substitutions are rejected.
- The wider catalog includes 578 voicings from lessons, alternate recitals, warm-ups, the hymn pathway and generated reading. Easy-mode and silence checks remain in the exhaustive suite.

The baseline fixture freezes the previous recognition results from main after PR #36. It is a compatibility and known-limitation record, not a list of desired wrong-note behavior. `npm run test:chords:all` checks the frozen positives, rejects missing/semitone controls and forbids new wrong-octave passes. `npm test` includes focused quiet-note and wrong-octave regressions.

## What remains

This is a limited improvement, not a complete solution to calibration-free polyphonic recognition. Octave pairs and other overlapping harmonic combinations still need personal calibration or explicit Easy-chord assistance when the microphone cannot distinguish the keys. A broader built-in reference-model experiment was rejected because it confused some octave substitutions.

Bundled acoustic-piano samples cannot confirm performance on a particular digital keyboard through an iPhone microphone. To investigate a remaining G3 + D4 failure, record about 20 seconds with no pedal: G3 alone, D4 alone, then both together, each held for two seconds, repeated. Menu → Musicianship → Record and listen can make a downloadable take. Include the keyboard's piano sound and the phone placement when reporting it.
