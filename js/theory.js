// Note names, MIDI numbers and small music helpers shared by the whole app.

const LETTERS = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const SHARP_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// "C4" -> 60, "F#3" -> 54, "Bb4" -> 70
export function toMidi(name) {
  const m = /^([A-G])([#b]?)(-?\d)$/.exec(name);
  if (!m) throw new Error(`Bad note name: ${name}`);
  let n = LETTERS[m[1]] + (m[3] * 1 + 1) * 12;
  if (m[2] === '#') n += 1;
  if (m[2] === 'b') n -= 1;
  return n;
}

export function midiToName(midi, preferFlat = false) {
  const pc = ((midi % 12) + 12) % 12;
  const octave = Math.floor(midi / 12) - 1;
  let name = SHARP_NAMES[pc];
  if (preferFlat && name.includes('#')) {
    const flats = { 'C#': 'Db', 'D#': 'Eb', 'F#': 'Gb', 'G#': 'Ab', 'A#': 'Bb' };
    name = flats[name];
  }
  return name + octave;
}

// Display form: "C#4" -> "C♯", with octave optional
export function prettyName(name, withOctave = false) {
  const m = /^([A-G])([#b]?)(-?\d)$/.exec(name);
  if (!m) return name;
  const acc = m[2] === '#' ? '♯' : m[2] === 'b' ? '♭' : '';
  return m[1] + acc + (withOctave ? m[3] : '');
}

export const isBlack = (midi) => [1, 3, 6, 8, 10].includes(((midi % 12) + 12) % 12);
export const pitchClass = (midi) => ((midi % 12) + 12) % 12;
export const midiToFreq = (midi) => 440 * Math.pow(2, (midi - 69) / 12);
export const freqToMidiFloat = (f) => 69 + 12 * Math.log2(f / 440);

// Durations in beats (quarter note = 1)
export const DUR_BEATS = { w: 4, 'h.': 3, h: 2, 'q.': 1.5, q: 1, '8.': 0.75, 8: 0.5, 16: 0.25 };

/*
 * Parse the compact note format used by the lesson files.
 *
 *   "C4/q/1 D4/q/2 E4/h/3 r/q"   -> note / duration / finger
 *   "[C4 E4 G4]/h/1-3-5"         -> chord (several notes at once)
 *
 * Duration and finger are optional. "r" is a rest.
 */
export function parseSeq(str, defaults = {}) {
  const out = [];
  const tokens = str.match(/\[[^\]]+\][^\s]*|\S+/g) || [];
  for (const tok of tokens) {
    if (tok === '|') { out.push({ bar: true }); continue; }
    let head = tok, rest = '';
    if (tok.startsWith('[')) {
      const close = tok.indexOf(']');
      head = tok.slice(1, close);
      rest = tok.slice(close + 1);
    } else {
      const slash = tok.indexOf('/');
      head = slash === -1 ? tok : tok.slice(0, slash);
      rest = slash === -1 ? '' : tok.slice(slash);
    }
    const parts = rest.split('/').filter(Boolean);
    const dur = parts[0] || defaults.dur || 'q';
    const fingerStr = parts[1] || '';
    if (head === 'r') { out.push({ rest: true, dur, notes: [] }); continue; }
    const names = head.split(/\s+/).filter(Boolean);
    const fingers = fingerStr ? fingerStr.split('-').map(Number) : [];
    out.push({
      notes: names,
      midis: names.map(toMidi),
      dur,
      fingers,
      hand: defaults.hand,
    });
  }
  return out;
}

export const beatsOf = (dur) => DUR_BEATS[dur] ?? 1;
