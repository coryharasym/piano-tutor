// Turns a lesson's play step into "moments": the notes that must be played
// together at each point in time. Pure functions, testable in Node.

import { parseSeq, beatsOf, toMidi } from './theory.js';

// Returns { staves, moments, totalBeats }
//   staves:  [{ clef, hand, events }] for sheet music (right hand first)
//   moments: [{ beat, items: [{ midi, name, finger, hand, staff, index, beats }] }]
export function buildPractice(step) {
  const hands = [];
  if (step.rh) hands.push({ hand: 'R', clef: step.rhClef || clefFor(step.rh, 'treble'), events: parseSeq(step.rh, { hand: 'R' }) });
  if (step.lh) hands.push({ hand: 'L', clef: step.lhClef || clefFor(step.lh, 'bass'), events: parseSeq(step.lh, { hand: 'L' }) });

  const byBeat = new Map();
  let totalBeats = 0;
  hands.forEach((h, staff) => {
    let beat = 0;
    h.events.forEach((ev, index) => {
      if (ev.bar) return;
      const len = beatsOf(ev.dur);
      if (!ev.rest) {
        const key = Math.round(beat * 1000) / 1000;
        if (!byBeat.has(key)) byBeat.set(key, []);
        ev.midis.forEach((midi, k) => byBeat.get(key).push({
          midi, name: ev.notes[k], finger: ev.fingers[k] || null, hand: h.hand, staff, index, beats: len,
        }));
      }
      beat += len;
    });
    totalBeats = Math.max(totalBeats, beat);
  });

  let moments = [...byBeat.entries()].sort((a, b) => a[0] - b[0]).map(([beat, items]) => ({ beat, items }));

  if (step.anyOrder) {
    // One moment containing every note; they can be played in any order.
    moments = [{ beat: 0, items: moments.flatMap((m) => m.items), anyOrder: true }];
  }
  return { staves: hands.map(({ hand, clef, events }) => ({ hand, clef, events })), moments, totalBeats };
}

// A single hand's part can still sit on the "other" clef (e.g. right hand
// playing below Middle C). Pick by average pitch.
function clefFor(seq, fallback) {
  const midis = parseSeq(seq).flatMap((e) => e.midis || []);
  if (!midis.length) return fallback;
  const avg = midis.reduce((a, b) => a + b, 0) / midis.length;
  if (fallback === 'treble' && avg < toMidi('A3')) return 'bass';
  if (fallback === 'bass' && avg > toMidi('E4')) return 'treble';
  return fallback;
}

// Does a heard note satisfy a wanted note?
export function matches(heard, wanted, { anyOctave = true, source = 'mic' } = {}) {
  if (heard === wanted) return true;
  if (source !== 'mic' || !anyOctave) return false;
  return (heard - wanted) % 12 === 0 && Math.abs(heard - wanted) <= 12;
}
