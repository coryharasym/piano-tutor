# Piano Tutor bug review — November 6, 2026

Reviewed against main after PR #36 (`861dc24993b153fc870d46100ecbf1e55e580921`).

## Confirmed bugs fixed

| Area | Trigger and previous behavior | Corrected behavior |
| --- | --- | --- |
| Flow replay | Clicking Play again passed a click event into the loop-restart flag, skipping the ten-second preparation. | A manual replay starts a fresh ten-second countdown. |
| Fresh reading | Exercises recommended Flow but `noDemo` also removed Play along. | Flow is available while the Listen demonstration remains hidden. |
| Ear practice | Six-note exercises offered Play along, exposing the hidden answer. | Ear exercises retain audio listening and optional Show me without the answer-revealing passage shortcut. |
| Learning review | A generated exercise reused the same lesson/step ID; later generation or a recital selection changed the music opened by an older record. | New records retain the practiced notes and distinguish recital choices. Reviews reload their recorded exercise and update the original course record. Historical rhythm reviews retain their tap pattern. |
| Audio navigation | A slow sound-unlock request could finish after leaving a lesson/quiz and start its demonstration. | Leaving or cancelling invalidates pending playback; an old completion cannot cancel a newer run. |
| Microphone startup | Concurrent starts could acquire duplicate streams; stopping during permission/resume or failing device initialization could leave resources behind. Closing tuning during startup could install an abandoned callback. | Starts share a request; cancelled/failed requests release their streams/contexts; closed tuning does not install callbacks. |
| Screen keyboard | Releasing a key during audio startup could produce a late press; leaving a screen retained keyboard observers and held sounds. | Released/cancelled inputs are discarded and keyboards disconnect observers and release held sounds on exit. |
| Backup restore | Structurally invalid maps, settings or practice records could be accepted and break later screens. | Restore validates data before replacing live progress; rejected files leave progress intact. Older backups with omitted fields retain defaults. |

## Coverage

- Full model/unit suite, including 274 course/shelf lesson definitions, 680 practice steps, all three courses, calibration, recorded-piano recognition, loops, recital choices, backups, personal practice and PDF freshness.
- Browser sweep of 668 beginner/intermediate screens, 294 advanced screens and 54 alternate recital screens, plus home/menu, warm-up, guided practice, saved pieces, technique links, recording mocks, printing and landscape checks.
- Targeted regressions for the failures above, every recital option's review snapshot, generated-review reloads, safe imported snapshot text, rhythm history and preserved course completion.
- Exhaustive chord catalog expanded to include the new hymn pathway and generated reading: 578 unique voicings across 11,932 chord moments; 6,934 Easy-mode/silence checks passed.
- Single-song/full-book print regression and chapter/course PDF links checked separately.

## Remaining limits

The uncalibrated strict-mode diagnostic missed 713 of 1,156 full-chord trials within three short recorded frames. Of those, 520 contained octave pairs, which intentionally require per-key calibration. The other 193 demonstrate that uncalibrated strict detection is still not reliable across all voicings. This review does not loosen recognition thresholds or claim that limitation is solved. Easy mode passed the exhaustive catalog; the existing calibration suite also passed its recorded-piano cases.

Browser audio and permission tests use controlled inputs, not a physical keyboard played into an iPhone microphone. Real iPhone Safari recording, room acoustics and keyboard timbre still require a device tryout.

Exact historical notes cannot be reconstructed for practice records created before snapshots existed; those existing records and course ribbons are preserved. The snapshot fix applies to newly recorded exercises.
