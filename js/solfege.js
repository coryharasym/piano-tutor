// French fixed-do note names for user-visible labels. Keep the English pitch
// letters in the lesson data and MIDI model; convert only when rendering text.
const NAMES = { C: 'Do', D: 'Ré', E: 'Mi', F: 'Fa', G: 'Sol', A: 'La', B: 'Si' };

// Convert a pitch label such as C#4 or Bb to its French solfège spelling.
export function solfegeName(name, withOctave = true) {
  const match = /^([A-G])([#b♯♭]?)(-?\d)?$/.exec(String(name));
  if (!match) return String(name);
  const accidental = match[2] === '#' || match[2] === '♯' ? '♯'
    : match[2] === 'b' || match[2] === '♭' ? '♭' : '';
  return `${NAMES[match[1]]}${accidental}${withOctave ? (match[3] || '') : ''}`;
}
