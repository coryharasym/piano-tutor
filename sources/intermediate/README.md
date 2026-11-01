# Intermediate hymn sources

The six retained LilyPond scores declare **Public Domain** in their headers,
including the typeset editions. Their source URLs and SHA-256 fingerprints are
retained in `js/lessons/intermediate-scores.js`. Rebuild that module with
`python3 scripts/convert-intermediate-scores.py`. The parser reads explicit
absolute pitches and inherited note values, including breve values; source
transposition commands are replaced by the documented teaching transpositions.

| Hymn | Source edition | Teaching adaptation |
| --- | --- | --- |
| Abide with Me (EVENTIDE) | Mutopia, MonkWH/eventide, 1241; Steve Dunlop | Original E-flat material transposed to C; melody plus sparse bass |
| Blessed Assurance (ASSURANCE) | Mutopia, KnappPP/blessed_assurance, 1225; Steve Dunlop | D to C; original 9/8 and dotted-eighth/sixteenth preserved |
| Just As I Am (WOODWORTH) | Mutopia, BradburyWB/woodworth, 1305; Steve Dunlop | D to C; source 6/4 retained |
| Come Thou Fount (NETTLETON) | Mutopia, WyethJ/nettleton; Steve Dunlop | Original E-flat material to D; source pickup, sixteenths and melody preserved |
| It Is Well (VILLE DU HAVRE) | Mutopia, BlissPP/villeduh, 1301; Steve Dunlop | Original D-flat material to C; compact accompaniment drawn from the source's lower voices |
| Crown Him with Many Crowns (DIADEMATA) | Mutopia, ElveyGJ/Diademata, 524; Peter Chubb, Book of Common Praise (1908), no. 367 | E-flat to C; source note values halved; changing source metres re-barred in 4/4; relative note lengths preserved |

The accompanying piano textures are new teaching reductions, not reproductions
of commercial piano arrangements. Lower-voice pitches at each bar opening
supply the harmony for the new sparse/chord/broken-chord textures. Internal
source voice movement is deliberately reduced. Lyrics appear only where their
syllables have been aligned to the teaching melody; no placeholder syllables
are inserted merely to make a count pass.

## Two visually checked teaching transcriptions

- **Take My Life and Let It Be (HENDON):**
  https://mobilehymns.org/english/Take_My_Life_And_Let_It_Be_Consecrated.html
  Henri A. C. Malan (1787-1864), harmony credited to Lowell Mason (1792-1872).
  The publisher labels the hymn Public Domain. The melody was read from the
  displayed G-major score, including its short melismas. The app adds a new
  compact chord accompaniment. Independent corroborating public-domain score:
  https://www.hymnary.org/media/fetch/97663 (Hymnary.org).
- **All Hail the Power of Jesus' Name (CORONATION):**
  https://mobilehymns.org/english/All_Hail_The_Power_Of_Jesus_Name.html
  Oliver Holden (1765-1844), 1793. The publisher labels it Public Domain.
  This is explicitly an **opening study**, not the full hymn: pickup D4,
  G4 G4 B4 B4 | A4 G4 A4 B4, all quarters, key G. The moving bass is a new
  teaching exercise. Independent source listing:
  https://www.hymnary.org/tune/coronation_holden.

First-verse lyric sources for new source editions:
- Abide with Me, Henry Francis Lyte (1847):
  https://hymnary.org/text/abide_with_me_fast_falls_the_eventide
- Blessed Assurance, Fanny Crosby (1873):
  https://hymnary.org/text/blessed_assurance_jesus_is_mine

Other study and recital melodies reuse the existing course's checked melody
strings and retain their existing words/verses. Their new intermediate bass,
chord and arpeggiated parts are original teaching arrangements. New melodies
are not described as full commercial arrangements or examination editions.

## Verification

`test/intermediate.test.mjs` checks retained-score hashes, first/last pitches,
full melody-note identity and duration against the generated practice steps.
The standard lesson checks cover ranges, finger counts, bar lengths, aligned
hands and syllable counts; browser checks exercise the shared VexFlow renderer,
including triplets. These checks do not certify fingering, physical technique,
real-device microphone accuracy, or the artistic quality of a performance.
