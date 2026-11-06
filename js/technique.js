// Official teacher pages; videos remain with their creators. No third-party embeds load automatically.
export const TECHNIQUE = [
  {title:'Seating and posture', teacher:'Hoffman Academy', topic:'posture', url:'https://www.hoffmanacademy.com/lessons/piano/video/piano-posture-d-journey', note:'Watch the bench setup and posture demonstration.'},
  {title:'Hand position and first movements', teacher:'Pianote', topic:'hand', url:'https://www.pianote.com/blog/getting-started-on-piano/', note:'Watch how the teacher positions and moves the hands.'},
  {title:'Thumb crossings in scales', teacher:'Pianote', topic:'scale', url:'https://www.pianote.com/blog/two-octave-scales/', note:'Focus on the scale fingering and thumb crossing demonstration.'},
  {title:'Changing chords', teacher:'Pianote', topic:'chord', url:'https://www.pianote.com/blog/quick-chord-changes/', note:'Watch which notes stay and which fingers move between chords.'},
  {title:'Legato and staccato', teacher:'Pianist', topic:'touch', url:'https://www.pianistmagazine.com/blogs/watch-our-piano-lesson-on-staccato-and-legato-from-steinway-hall/', note:'Compare the connected and detached demonstrations.'},
  {title:'Sustain pedal coordination', teacher:'Pianote', topic:'pedal', url:'https://www.pianote.com/blog/?p=223', note:'Focus on coordinating the key press and pedal change.'},
];
export function relatedTechnique(title) {
  if (/pedal/i.test(title)) return TECHNIQUE[5];
  if (/chord|triad|inversion|harmony/i.test(title)) return TECHNIQUE[3];
  if (/scale|arpeggio|thumb/i.test(title)) return TECHNIQUE[2];
  if (/touch|legato|staccato|detached|smooth|phrase/i.test(title)) return TECHNIQUE[4];
  if (/welcome|posture|sit/i.test(title)) return TECHNIQUE[0];
  return TECHNIQUE[1];
}
