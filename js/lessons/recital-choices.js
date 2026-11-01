// Selection state for the Intermediate and Advanced recital groups.
// The app persists IDs in store.recitals; invalid or retired IDs are ignored.
const groups = new Map();
export function chooseCourseRecital(unit, pieceId) {
  const group = groups.get(unit);
  if (group?.choices.some(p => p.id === pieceId)) group.selected = pieceId;
}
export function selectableRecital(lesson, choices) {
  const unit = choices[0].unit;
  const group = { choices, selected: choices[0].id };
  groups.set(unit, group);
  return {
    id: lesson.id, course: lesson.course, recital: true, choices,
    get piece() { return choices.find(p => p.id === group.selected) || choices[0]; },
    get title() { return 'Recital: ' + this.piece.title; },
    get summary() { return 'Choose your recital: ' + choices.map(p => p.title).join(' or ') + '.'; },
    get steps() { return [{ t:'choose', title: choices.some(p => p.recitalSteps.filter(s=>s.final).length>1) ? 'Choose your recital programme' : 'Choose your recital piece', unit }, ...this.piece.recitalSteps]; },
  };
}
// Performance records belong to a specific choice, never to another option's step numbers.
export const recitalRunKey = lesson => lesson.id + ':' + lesson.piece.id;
