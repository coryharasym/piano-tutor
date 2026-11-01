# Advanced hymn course: sources and adaptations

This course develops independent solo hymn playing and accompanying singers on an
88-key piano with a sustain pedal. It is not a conservatory grade or a certification.
The forty skill lessons and their exercises are newly authored. Sixteen guided
hymn studies and eight recitals complete the 64-lesson course.

## Retained new editions

These unmodified LilyPond files come from `MutopiaProject/MutopiaProject`, `master`.
The Git blob hashes below pin the reviewed bytes. Each file identifies both the
music and the typeset edition as Public Domain. No modern commercial arrangement,
recording, backing track or protected translation is copied.

| File | Tune / hymn | Composer | Git blob SHA | Mutopia metadata |
| --- | --- | --- | --- | --- |
| melita.ly | MELITA / Eternal Father, Strong to Save | J. B. Dykes, 1861 | 09728abc6b1874bb0051cf1eff6fae6aea5f3284 | https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=1260 |
| nicaea.ly | NICAEA / Holy, Holy, Holy | J. B. Dykes, 1861 | a41a2d58a09ac64e849f1de18fc5fddf935e919b | https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=1284 |
| st_agnes.ly | ST. AGNES / Jesus, the Very Thought of Thee | J. B. Dykes, 1866 | 8eaff2eb3b6f8f55c850e32612111d2305159e64 | https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=1289 |

Repository paths are `ftp/DykesJB/<file stem>/<filename>`. Source URLs and SHA-256
checksums accompany the generated voice data in `js/lessons/advanced-scores.js`.
Rebuild with `python3 scripts/convert-advanced-scores.py`. Tests check raw Git blob
hashes, SHA-256 checksums, all generated soprano pitches and complete durations.
The parser is scoped to these absolute-pitch files, not arbitrary LilyPond input.

## Existing retained editions

The course also uses Abide with Me (EVENTIDE), Blessed Assurance, Just As I Am
(WOODWORTH), Come Thou Fount (NETTLETON), It Is Well (VILLE DU HAVRE) and Crown Him
with Many Crowns (DIADEMATA) from `../intermediate/`. Their rights, original files,
transpositions and adaptations are documented there. The advanced lessons and
piano arrangements are new; these are deliberate revisits of familiar melodies.

## Arrangement policy

- The complete source soprano melody, note-length proportions, meter and pickup
  are retained, apart from a documented transposition. Source padding rests remain.
- Chorale and lyrical versions are **melody-led piano reductions**, not literal
  four-voice transcriptions. Supporting tones are sampled at melody onsets and
  rearticulated with it. Inner notes may move by octaves; left-hand groups move
  lower when necessary to keep hands from sharing a key. The lyrical texture adds
  a supporting right-hand voice primarily on longer notes.
- Flowing versions use an original eighth-note left-hand pattern, sampling the
  retained bass/inner harmonies at each eighth. These are original teaching
  accompaniments, not a claim to reproduce the source SATB rhythm. Register is
  adjusted to keep the accompaniment below the melody.
- Octave work in Crown Him doubles the melody below, with the left hand moved
  lower as needed. A comfortable single-note or broken-octave alternative is
  taught for independent practice. The app checks the written octave reference.
- DIADEMATA inherits the intermediate teaching adaptation: source values halved
  and changing source meters re-barred in 4/4. WOODWORTH retains source 6/4.
- Melita is presented in C and F, Nicaea in D and F, Nettleton in D and F.
  Transposition preserves pitches by a constant semitone shift. Flat-key spellings
  are used in transposed versions. Original LilyPond pitches are available in the
  retained source; some generated enharmonic spellings are simplified.
- Four-part lessons include individually playable source soprano, alto, tenor and
  bass openings. Independent original voice rhythms are studied using the linked
  full source score; the combined app score is explicitly labelled as a reduction.

## Texts and lyrics

Checked public-domain texts are included where syllable alignment is verified:

- Jesus, the Very Thought of Thee, first stanza and 'O hope of every contrite heart':
  https://hymnary.org/text/jesus_the_very_thought_of_thee (Edward Caswall, 1849).
- Holy, Holy, Holy, first stanza:
  https://hymnary.org/text/holy_holy_holy_lord_god_almighty_early (Reginald Heber, 1823).
  The extra repeated source note at the end of 'thee' uses an underscore continuation.
- Abide with Me and Blessed Assurance reuse the checked syllable alignment recorded
  in the intermediate source notes. New arrangements have the same melody onsets.

Other settings are instrumental. Lyrics are not guessed to fit an uncertain
melisma. Verse selection remains available on the new St. Agnes settings.

## Assessment and independence

Note-by-note lessons check reference pitch attacks, not held durations, pedal,
physical comfort or tone quality. Flow adds reference note-start timing. Listening
checklists, recording tasks and optional teacher/singer feedback address musical
judgment. Creative introductions, alternative voicings, by-ear tasks, reharmonizing,
rubato and improvised arrangements are practised outside the reference-score
checker. The app does not claim to grade arbitrary creative alternatives.
