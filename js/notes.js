// Notes read the same curriculum as the lessons. Rebuild PDFs after curriculum edits.
import { UNITS } from './lessons/index.js';
import { buildPractice } from './practice.js';
import { renderStaff } from './staff.js';

export const NOTES_VERSION = '2026-10-31';
export const pdfPath = (id = 'all') => `notes/${id === 'all' ? 'piano-tutor-course-notes' : `piano-tutor-${id}-notes`}.pdf`;
export const escapeHTML = (value = '') => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const CHECKS = {
  u1: ['Set up the bench and relax my shoulders, wrists, and hands.', 'Name fingers 1 to 5 on both hands.', 'Use groups of two and three black keys to find C and Middle C.', 'Name the white keys and recognize whether notes move higher or lower.'],
  u2: ['Find C position with either hand without labelled keys.', 'Keep a steady beat while playing steps and skips.', 'Play a familiar melody with the suggested fingers.', 'Practise each hand separately, then bring both hands together slowly.'],
  u3: ['Find treble and bass notes using the staff and landmark notes.', 'Count the note values, rests, ties, and pickups introduced here.', 'Follow repeat signs and read both staves together.', 'Read a short unfamiliar passage before turning on hints.'],
  u4: ['Use landmark notes to move to a new position.', 'Recognize sharps, flats, and the key signatures introduced here.', 'Play the taught scales with their suggested fingering and relaxed thumb crossings.', 'Hear and describe the difference between major and minor.'],
  ux: ['Show a clear difference between soft and loud playing.', 'Shape a crescendo, diminuendo, and musical phrase.', 'Make legato and staccato sound different.', 'Choose an appropriate tempo and change the pedal cleanly where taught.'],
  u5: ['Build and recognize the major and minor triads introduced here.', 'Move between root-position chords and inversions.', 'Play the chord progression and accompaniment patterns slowly and evenly.', 'Count 6/8 in two groups of three and keep the melody clear above the accompaniment.'],
  u6: ['Read the key, time signature, and patterns before starting a piece.', 'Count sixteenth notes slowly before increasing speed.', 'Practise a difficult passage with separate hands, then together.', 'Perform a chosen piece with steady rhythm, phrasing, and a clear melody, then describe what to improve.'],
};

export function chapterLessons(unit) {
  // All recital choices belong in a fixed reference; a saved choice must not change the PDF.
  return unit.lessons.flatMap(l => l.recital ? l.choices.map(p => ({ ...p, recital: true, steps: p.recitalSteps })) : [l]);
}

export function chapterHTML(unit) {
  let figureNumber = 0;
  return `<article class="notes-chapter" data-chapter="${unit.id}">
    <header class="notes-chapter-head"><p class="eyebrow">Piano Tutor · Chapter ${unit.number}</p><h1>${escapeHTML(unit.title)}</h1><p>${escapeHTML(unit.blurb)}</p></header>
    <div class="notes-intro"><h2>How to use these notes</h2><p>Read alongside the lessons or keep beside your piano. Review the explanations, try the practice tasks, then use the checklist without on-screen hints. Listening and demonstrations are available in the app. Notation examples show the opening two bars; full songs are in the Songbook.</p></div>
    <nav class="notes-lesson-list" aria-label="Chapter lessons"><h2>In this chapter</h2><ol>${chapterLessons(unit).map(l => `<li>${escapeHTML(l.title)}</li>`).join('')}</ol></nav>
    ${chapterLessons(unit).map((lesson, li) => {
      const figures = new Set();
      const exampleIndex = lesson.steps.findIndex(s => s.t === 'play' && (s.rh || s.lh) && !s.anyNote);
      return `<section class="notes-lesson"><h2>${li + 1}. ${escapeHTML(lesson.title)}</h2><p class="notes-summary">${escapeHTML(lesson.summary || '')}</p>
        ${lesson.steps.map((step, si) => {
          let figure = '';
          if (step.fig && !figures.has(step.fig)) {
            figures.add(step.fig);
            figure = `<figure class="notes-figure">${step.fig}<figcaption>Figure ${unit.number}.${++figureNumber} · ${escapeHTML(step.title || 'Lesson illustration')}</figcaption></figure>`;
          }
          if (step.t === 'read') return `<div class="notes-block"><h3>${escapeHTML(step.title || 'Remember')}</h3>${step.body || ''}${figure}</div>`;
          if (step.t === 'quiz') return `<div class="notes-block notes-review"><h3>Review${step.listen ? ' · ear training' : ''}</h3><p>${escapeHTML(step.q)}</p>${step.listen ? '<p>Listen to the example in the app before checking the answer.</p>' : ''}<p><b>Answer:</b> ${escapeHTML(step.options?.[step.answer] || '')} ${escapeHTML(step.explain || '')}</p>${figure}</div>`;
          if (step.t === 'play') return `<div class="notes-block notes-task"><h3>Practise · ${escapeHTML(step.title || 'At the piano')}</h3><p>${escapeHTML(step.say || 'Play the passage from the lesson slowly and evenly.')}</p>${si === exampleIndex ? `<div class="notes-example" data-example-lesson="${lesson.id}" data-example-step="${si}"></div><p class="notes-caption">Opening example · ${escapeHTML(step.time || '4/4')} · ${escapeHTML(step.key || 'C')} · finger 1 = thumb</p>` : ''}</div>`;
          return '';
        }).join('')}</section>`;
    }).join('')}
    <section class="notes-checklist"><h2>Can I do this independently?</h2><p>Try these at your piano with hints and note labels turned off. Tick a box when you can do it comfortably; return to the matching lesson when you need a reminder.</p><ul>${CHECKS[unit.id].map(t => `<li><span class="notes-box" aria-hidden="true"></span>${escapeHTML(t)}</li>`).join('')}</ul><h3>My next practice goal</h3><div class="notes-writing"></div><h3>What sounded better? What still needs work?</h3><div class="notes-writing"></div></section>
  </article>`;
}

export function mountNotes(root, { id = 'all', onBack }) {
  const units = id === 'all' ? UNITS : UNITS.filter(u => u.id === id);
  if (!units.length) throw new Error('Unknown chapter');
  const heading = id === 'all' ? 'Complete course notes' : `${units[0].number}. ${units[0].title}`;
  const el = document.createElement('main');
  el.className = 'notes-view';
  el.innerHTML = `<header class="notes-bar"><button class="icon-btn" data-back aria-label="All lessons">←</button><div><span class="eyebrow">Chapter notes</span><h1>${escapeHTML(heading)}</h1></div><a class="pill accent" href="${pdfPath(id)}" download>Download PDF</a><button class="pill" data-print>Print notes</button></header>
    <p class="notes-help">PDFs include the explanations, diagrams, practice tasks, and review checklists for ${id === 'all' ? 'all seven chapters' : 'this chapter'}. On iPhone, open the PDF and use Share → Save to Files if needed. Full sheet music is in the Songbook.</p>
    ${id === 'all' ? `<nav class="notes-index" aria-label="Download chapters"><h2>Individual chapters</h2>${UNITS.map(u => `<a class="pill" href="${pdfPath(u.id)}" download>${u.number}. ${escapeHTML(u.title)} · PDF</a>`).join('')}</nav>` : ''}
    <div class="notes-pages">${units.map(chapterHTML).join('')}</div>`;
  root.replaceChildren(el);
  el.querySelector('[data-back]').addEventListener('click', onBack);
  el.querySelector('[data-print]').addEventListener('click', () => window.print());
  for (const target of el.querySelectorAll('[data-example-lesson]')) {
    const lesson = units.flatMap(chapterLessons).find(l => l.id === target.dataset.exampleLesson);
    const step = lesson.steps[Number(target.dataset.exampleStep)];
    const practice = buildPractice(step);
    renderStaff(target, { staves: practice.staves.map(s => ({ clef: s.clef, events: s.events })), key: step.key || 'C', time: step.time || '4/4', pickup: step.pickup, width: 740, bars: [0, 2], showFingers: true, showNames: !!step.names });
  }
}
