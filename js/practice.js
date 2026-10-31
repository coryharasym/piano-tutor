// Turns a lesson's play step into "moments": the notes that must be played
// together at each point in time. Pure functions, testable in Node.

import { parseSeq, beatsOf, toMidi, parseLyrics } from './theory.js';

// Returns { staves, moments, totalBeats }
//   staves:  [{ clef, hand, events }] for sheet music (right hand first)
//   moments: [{ beat, items: [{ midi, name, finger, hand, staff, index, beats }] }]
export function buildPractice(step) {
  const hands = [];
  if (step.rh) hands.push({ hand: 'R', clef: step.rhClef || clefFor(step.rh, 'treble'), events: parseSeq(step.rh, { hand: 'R' }) });
  if (step.lh) hands.push({ hand: 'L', clef: step.lhClef || clefFor(step.lh, 'bass'), events: parseSeq(step.lh, { hand: 'L' }) });

  // Lyrics belong to the melody (the right hand, or the only hand), one
  // syllable per note as played, so a repeat can have new words.
  const lyrics = step.lyrics ? parseLyrics(step.lyrics) : null;
  let sung = 0;

  const byBeat = new Map();
  let totalBeats = 0;
  hands.forEach((h, staff) => {
    let beat = 0;
    let last = []; // items of the previous note, for ties
    playOrder(h.events).forEach((index) => {
      const ev = h.events[index];
      const len = beatsOf(ev.dur);
      if (ev.tie) {
        // A tied note isn't played again: the previous note just lasts longer.
        last.forEach((it) => { it.beats += len; });
      } else if (!ev.rest) {
        const key = Math.round(beat * 1000) / 1000;
        if (!byBeat.has(key)) byBeat.set(key, []);
        last = ev.midis.map((midi, k) => ({
          midi, name: ev.notes[k], finger: ev.fingers[k] || null, hand: h.hand, staff, index, beats: len,
          ...(ev.staccato && { staccato: true }), ...(ev.marks && { marks: ev.marks }),
          ...(lyrics && staff === 0 && k === 0 && { lyric: sung }),
        }));
        byBeat.get(key).push(...last);
        if (lyrics && staff === 0) sung++;
      } else {
        last = [];
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
  return { staves: hands.map(({ hand, clef, events }) => ({ hand, clef, events })), moments, totalBeats, lyrics, syllables: sung };
}

// The lyric line to show at a moment: its syllables, and which one is sung now.
export function lyricLine(lyrics, moments, at) {
  if (!lyrics?.length) return null;
  let idx = -1;
  for (let i = Math.min(at, moments.length - 1); i >= 0 && idx < 0; i--) {
    const it = moments[i].items.find((x) => x.lyric != null);
    if (it) idx = it.lyric;
  }
  if (idx < 0) idx = 0;
  idx = Math.min(idx, lyrics.length - 1);
  while (idx > 0 && lyrics[idx].hold) idx--;
  const line = lyrics[idx].line;
  return { words: lyrics.map((l, i) => ({ ...l, i })).filter((l) => l.line === line && !l.hold), now: idx };
}

// The line as HTML: sung syllables dim, the current one highlighted.
export function lyricHTML(line) {
  if (!line) return '';
  return line.words.map((w) => {
    const joined = w.text.endsWith('-');
    const cls = w.i === line.now ? 'now' : w.i < line.now ? 'sung' : '';
    return `<span class="${cls}">${w.text.replace(/-$/, '').replace(/[<>&]/g, '')}</span>${joined ? '' : ' '}`;
  }).join('').trim();
}

// Event indexes in the order they're played: music between repeat signs
// (or from the start, when there's no |:) is played twice.
export function playOrder(events) {
  const order = [];
  let from = 0;
  events.forEach((ev, i) => {
    if (ev.repeat === 'start') from = order.length;
    else if (ev.repeat === 'end') order.push(...order.slice(from));
    else if (!ev.bar) order.push(i);
  });
  return order;
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

// Words as plain lines of text, for printing a verse.
export function lyricText(str) {
  const lines = [];
  parseLyrics(str).forEach(({ text, hold, line }) => {
    if (hold) return;
    const prev = lines[line] ?? '';
    lines[line] = prev && !prev.endsWith('-') ? `${prev} ${text}` : `${prev.slice(0, -1)}${text}`;
  });
  return lines.filter(Boolean);
}

// Loop written measures once per pass; the loop replaces printed repeats.
// Clip held/tied notes at both boundaries and re-strike carry-in notes.
export function loopBars(step) {
  const straight = buildPractice({ ...step, lyrics: null,
    rh: step.rh?.replace(/\|:|:\|/g, ''), lh: step.lh?.replace(/\|:|:\|/g, '') });
  const [num, den] = (step.time || '4/4').split('/').map(Number);
  const size = num * 4 / den;
  const bars = [];
  for (let start = 0; start < straight.totalBeats - 1e-6;) {
    const end = Math.min(straight.totalBeats, start + (start === 0 && step.pickup ? step.pickup : size));
    bars.push({ start, end }); start = end;
  }
  return { straight, bars };
}

export function buildBarLoop(step, first, last) {
  const { straight, bars } = loopBars(step);
  if (!Number.isInteger(first) || !Number.isInteger(last) || first < 1 || last < first || last > bars.length) throw new Error('Invalid bar range');
  const start = bars[first - 1].start, end = bars[last - 1].end;
  const byBeat = new Map();
  for (const m of straight.moments) for (const item of m.items) {
    const stop = Math.min(end, m.beat + item.beats);
    const onset = Math.max(start, m.beat);
    if (stop <= onset) continue;
    const beat = onset - start;
    if (!byBeat.has(beat)) byBeat.set(beat, []);
    byBeat.get(beat).push({ ...item, beats: stop - onset });
  }
  return { ...straight, lyrics: null, totalBeats: end - start,
    moments: [...byBeat].sort((a,b) => a[0]-b[0]).map(([beat,items]) => ({beat,items})) };
}
