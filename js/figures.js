// Illustrations for the lessons, drawn as inline SVG so they stay crisp.

import { isBlack, midiToName, prettyName, toMidi } from './theory.js';

const INK = 'var(--ink)';
const SOFT = 'var(--ink-soft)';
const R = 'var(--right)';
const L = 'var(--left)';
const ACC = 'var(--accent)';

const svg = (w, h, body, label = '') =>
  `<svg class="fig" viewBox="0 0 ${w} ${h}" role="img" aria-label="${label}" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;

const text = (x, y, s, { size = 13, fill = INK, anchor = 'middle', weight = 500 } = {}) =>
  `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" text-anchor="${anchor}" font-weight="${weight}">${s}</text>`;

// ---------- Sitting at the piano ----------
export function posture() {
  return svg(420, 250, `
    <rect x="300" y="40" width="110" height="170" rx="6" fill="var(--panel-2)" stroke="${SOFT}" />
    <rect x="270" y="112" width="140" height="14" rx="3" fill="#fff" stroke="${SOFT}" />
    <rect x="270" y="112" width="140" height="6" rx="2" fill="${INK}" opacity=".85"/>
    <rect x="110" y="150" width="120" height="14" rx="4" fill="var(--wood)" />
    <rect x="118" y="164" width="8" height="58" fill="var(--wood)" />
    <rect x="214" y="164" width="8" height="58" fill="var(--wood)" />
    <circle cx="178" cy="44" r="18" fill="var(--skin)" />
    <path d="M176 64 L170 146" stroke="${R}" stroke-width="16" stroke-linecap="round" />
    <path d="M172 146 L238 146 L242 222" stroke="${INK}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <path d="M242 222 L262 222" stroke="${INK}" stroke-width="8" stroke-linecap="round"/>
    <path d="M176 78 L204 112 L268 110" stroke="var(--skin)" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <path d="M266 110 q8 -6 12 2" stroke="var(--skin)" stroke-width="7" stroke-linecap="round" fill="none"/>
    <line x1="150" y1="146" x2="150" y2="146" />
    <path d="M196 112 L278 112" stroke="${ACC}" stroke-width="1.5" stroke-dasharray="4 4"/>
    ${text(64, 104, 'Elbows level', { size: 12, anchor: 'middle', fill: ACC })}
    ${text(64, 119, 'with the keys', { size: 12, anchor: 'middle', fill: ACC })}
    <path d="M100 110 L188 112" stroke="${ACC}" stroke-width="1" opacity=".5"/>
    ${text(64, 52, 'Sit tall,', { size: 12 })}
    ${text(64, 67, 'shoulders relaxed', { size: 12 })}
    ${text(170, 190, 'Front half', { size: 12, fill: SOFT })}
    ${text(170, 204, 'of the bench', { size: 12, fill: SOFT })}
    ${text(300, 240, 'Feet flat on the floor', { size: 12, fill: SOFT })}
  `, 'Side view of a person sitting at the piano');
}

// ---------- Finger numbers ----------
function hand(x, y, mirror, color) {
  // Finger lengths for thumb..pinky, drawn from the palm upward.
  const fingers = [
    { dx: -2, len: 46, w: 22, tilt: -38, dy: 40 },
    { dx: 22, len: 72, w: 19, tilt: -8, dy: 0 },
    { dx: 44, len: 80, w: 19, tilt: 0, dy: 0 },
    { dx: 66, len: 74, w: 19, tilt: 6, dy: 0 },
    { dx: 86, len: 58, w: 17, tilt: 14, dy: 10 },
  ];
  const s = mirror ? -1 : 1;
  let out = `<g transform="translate(${x} ${y}) scale(${s} 1)">`;
  out += `<rect x="12" y="0" width="94" height="92" rx="34" fill="var(--skin)" />`;
  fingers.forEach((f, i) => {
    const cx = f.dx + f.w / 2;
    out += `<g transform="rotate(${f.tilt} ${cx} ${f.dy + 10})">
      <rect x="${f.dx}" y="${f.dy - f.len + 20}" width="${f.w}" height="${f.len}" rx="${f.w / 2}" fill="var(--skin)" />
      <circle cx="${cx}" cy="${f.dy - f.len + 32}" r="11" fill="${color}" />
      <text x="${cx}" y="${f.dy - f.len + 37}" font-size="13" font-weight="700" fill="#fff" text-anchor="middle"
        transform="translate(${cx} ${f.dy - f.len + 32}) rotate(${-f.tilt}) scale(${s} 1) translate(${-cx} ${-(f.dy - f.len + 32)})">${i + 1}</text>
    </g>`;
  });
  return out + '</g>';
}

export function fingerNumbers() {
  return svg(420, 230, `
    ${hand(250, 110, false, R)}
    ${hand(170, 110, true, L)}
    ${text(110, 222, 'Left hand', { fill: L, weight: 700 })}
    ${text(310, 222, 'Right hand', { fill: R, weight: 700 })}
  `, 'Both hands, palms down, fingers numbered 1 to 5 starting from each thumb');
}

// ---------- Hand shape ----------
export function handShape() {
  return svg(420, 200, `
    <rect x="20" y="150" width="380" height="18" rx="3" fill="#fff" stroke="${SOFT}"/>
    <path d="M60 92 C 110 52, 200 48, 250 70 C 290 88, 300 120, 302 150" fill="none" stroke="var(--skin)" stroke-width="26" stroke-linecap="round"/>
    <path d="M70 100 C 70 100, 120 98, 160 112" fill="none" stroke="var(--skin)" stroke-width="20" stroke-linecap="round"/>
    <ellipse cx="200" cy="105" rx="44" ry="26" fill="none" stroke="${ACC}" stroke-width="2" stroke-dasharray="5 5"/>
    ${text(200, 40, 'Curved fingers, like holding a bubble', { fill: ACC })}
    ${text(330, 140, 'Play on the', { size: 12, anchor: 'start', fill: SOFT })}
    ${text(330, 154, 'fingertip', { size: 12, anchor: 'start', fill: SOFT })}
    ${text(70, 140, 'Wrist level,', { size: 12, fill: SOFT })}
    ${text(70, 154, 'not drooping', { size: 12, fill: SOFT })}
  `, 'Side view of a relaxed curved hand resting on a key');
}

// ---------- Keyboard diagrams ----------
/*
 * kbFigure({ from: 'C3', to: 'C5', marks: [{ note: 'C4', label: '1', hand: 'R' }],
 *            names: 'all'|'marked'|'none', groups: bool, caption })
 */
export function kbFigure({ from = 'C4', to = 'B4', marks = [], names = 'marked', groups = false, caption = '', arrows = [] } = {}) {
  const lo = toMidi(from), hi = toMidi(to);
  const whites = [];
  for (let m = lo; m <= hi; m++) if (!isBlack(m)) whites.push(m);
  const kw = Math.min(40, 400 / whites.length);
  const kh = kw * 3.6;
  const w = whites.length * kw + 20, top = 34;
  const h = top + kh + (caption ? 44 : 22);
  const xOf = {};
  let body = '';
  whites.forEach((m, i) => { xOf[m] = 10 + i * kw; });
  const markOf = Object.fromEntries(marks.map((mk) => [toMidi(mk.note), mk]));
  const color = (mk) => (mk.hand === 'L' ? L : mk.hand === 'R' ? R : ACC);

  whites.forEach((m) => {
    const mk = markOf[m];
    body += `<rect x="${xOf[m]}" y="${top}" width="${kw}" height="${kh}" rx="3" fill="${mk ? 'var(--hi-' + (mk.hand || 'A') + ')' : '#fff'}" stroke="${SOFT}" stroke-width="1"/>`;
    const show = names === 'all' || (names === 'marked' && mk);
    if (show) body += text(xOf[m] + kw / 2, top + kh - 8, prettyName(midiToName(m)), { size: Math.min(13, kw * 0.42), fill: INK });
  });
  for (let m = lo; m <= hi; m++) {
    if (!isBlack(m)) continue;
    const x = xOf[m - 1] + kw * 0.68;
    const mk = markOf[m];
    body += `<rect x="${x}" y="${top}" width="${kw * 0.64}" height="${kh * 0.6}" rx="2" fill="${mk ? color(mk) : INK}"/>`;
    if (mk && mk.name) body += text(x + kw * 0.32, top - 4, mk.name, { size: 11, fill: color(mk) });
  }
  if (groups) {
    for (let m = lo; m <= hi; m++) {
      const pc = m % 12;
      if (pc === 1 && m + 2 <= hi) {
        const x1 = xOf[m - 1] + kw * 0.6, x2 = xOf[m + 1] + kw * 1.32;
        body += `<path d="M${x1} ${top - 6} h${x2 - x1}" stroke="${ACC}" stroke-width="3" stroke-linecap="round"/>` + text((x1 + x2) / 2, top - 12, '2', { size: 12, fill: ACC, weight: 700 });
      }
      if (pc === 6 && m + 4 <= hi) {
        const x1 = xOf[m - 1] + kw * 0.6, x2 = xOf[m + 3] + kw * 1.32;
        body += `<path d="M${x1} ${top - 6} h${x2 - x1}" stroke="${L}" stroke-width="3" stroke-linecap="round"/>` + text((x1 + x2) / 2, top - 12, '3', { size: 12, fill: L, weight: 700 });
      }
    }
  }
  // Finger numbers / labels in circles on marked keys
  for (const mk of marks) {
    if (!mk.label) continue;
    const m = toMidi(mk.note);
    const black = isBlack(m);
    const x = black ? xOf[m - 1] + kw : xOf[m] + kw / 2;
    const y = black ? top + kh * 0.6 - 14 : top + kh - 30;
    body += `<circle cx="${x}" cy="${y}" r="${Math.min(11, kw * 0.32)}" fill="${color(mk)}"/>` + text(x, y + 4.5, mk.label, { size: Math.min(12, kw * 0.34), fill: '#fff', weight: 700 });
  }
  for (const a of arrows) {
    const m1 = toMidi(a.from), m2 = toMidi(a.to);
    const x1 = (isBlack(m1) ? xOf[m1 - 1] + kw : xOf[m1] + kw / 2);
    const x2 = (isBlack(m2) ? xOf[m2 - 1] + kw : xOf[m2] + kw / 2);
    const y = top + kh + 10;
    body += `<path d="M${x1} ${y} Q ${(x1 + x2) / 2} ${y + 14} ${x2} ${y}" fill="none" stroke="${ACC}" stroke-width="2" marker-end="url(#arr)"/>`;
    if (a.label) body += text((x1 + x2) / 2, y + 22, a.label, { size: 11, fill: ACC });
  }
  if (caption) body += text(w / 2, h - 8, caption, { size: 13, fill: SOFT });
  const defs = `<defs><marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="${ACC}"/></marker></defs>`;
  return svg(w, h, defs + body, caption || 'Keyboard diagram');
}

// ---------- Note lengths ----------
export function beatBars() {
  const rows = [
    { name: 'Whole note', beats: 4, glyph: 'w' },
    { name: 'Half note', beats: 2, glyph: 'h' },
    { name: 'Quarter note', beats: 1, glyph: 'q' },
    { name: 'Eighth note', beats: 0.5, glyph: '8' },
  ];
  const unit = 64, x0 = 140;
  let body = '';
  rows.forEach((r, i) => {
    const y = 20 + i * 44;
    body += noteGlyph(30, y + 16, r.glyph);
    body += text(56, y + 20, r.name, { anchor: 'start', size: 13 });
    const count = 4 / r.beats;
    for (let k = 0; k < count; k++) {
      body += `<rect x="${x0 + k * r.beats * unit + 2}" y="${y + 4}" width="${r.beats * unit - 4}" height="22" rx="6" fill="${i % 2 ? R : ACC}" opacity="${0.35 + 0.15 * (k % 2)}"/>`;
    }
    body += text(x0 + 4 * unit + 12, y + 20, r.beats === 0.5 ? '½ beat' : `${r.beats} beat${r.beats > 1 ? 's' : ''}`, { anchor: 'start', size: 12, fill: SOFT });
  });
  for (let b = 0; b <= 4; b++) body += `<line x1="${x0 + b * unit}" y1="12" x2="${x0 + b * unit}" y2="190" stroke="${SOFT}" stroke-dasharray="2 4"/>`;
  [1, 2, 3, 4].forEach((b) => { body += text(x0 + (b - 0.5) * unit, 196, b, { size: 11, fill: SOFT }); });
  return svg(480, 205, body, 'How long each note lasts, in beats');
}

function noteGlyph(x, y, kind) {
  const filled = kind === 'q' || kind === '8';
  let s = `<ellipse cx="${x}" cy="${y}" rx="8" ry="6" transform="rotate(-20 ${x} ${y})" fill="${filled ? INK : 'none'}" stroke="${INK}" stroke-width="2"/>`;
  if (kind !== 'w') s += `<line x1="${x + 7}" y1="${y - 2}" x2="${x + 7}" y2="${y - 30}" stroke="${INK}" stroke-width="2"/>`;
  if (kind === '8') s += `<path d="M${x + 7} ${y - 30} q 10 8 8 20" fill="none" stroke="${INK}" stroke-width="2"/>`;
  return s;
}

// ---------- Steps and skips ----------
export function stepsSkips() {
  return kbFigure({
    from: 'C4', to: 'B4', names: 'all',
    marks: [{ note: 'C4', hand: 'R' }, { note: 'D4', hand: 'R' }, { note: 'E4', hand: 'L' }, { note: 'G4', hand: 'L' }],
    arrows: [{ from: 'C4', to: 'D4', label: 'step' }, { from: 'E4', to: 'G4', label: 'skip' }],
    caption: 'A step moves to the next key. A skip jumps over one.',
  });
}

// ---------- Staff basics (lines and spaces) ----------
export function staffLines(clef = 'treble') {
  const lines = clef === 'treble' ? ['E', 'G', 'B', 'D', 'F'] : ['G', 'B', 'D', 'F', 'A'];
  const spaces = clef === 'treble' ? ['F', 'A', 'C', 'E'] : ['A', 'C', 'E', 'G'];
  const gap = 16, top = 30, left = 30, w = 400;
  let body = '';
  for (let i = 0; i < 5; i++) {
    const y = top + i * gap;
    body += `<line x1="${left}" y1="${y}" x2="${left + w - 90}" y2="${y}" stroke="${INK}" stroke-width="1.3"/>`;
  }
  // bottom to top
  lines.forEach((n, i) => {
    const y = top + (4 - i) * gap;
    const x = left + 40 + i * 60;
    body += `<ellipse cx="${x}" cy="${y}" rx="8" ry="6" transform="rotate(-20 ${x} ${y})" fill="${R}"/>` + text(x, top + 5 * gap + 18, n, { fill: R, weight: 700 });
  });
  spaces.forEach((n, i) => {
    const y = top + (3.5 - i) * gap;
    const x = left + 70 + i * 60;
    body += `<ellipse cx="${x}" cy="${y}" rx="8" ry="6" transform="rotate(-20 ${x} ${y})" fill="${L}"/>` + text(x, top - 10, n, { fill: L, weight: 700 });
  });
  const tip = clef === 'treble'
    ? ['Lines: Every Good Boy Does Fine', 'Spaces: F A C E']
    : ['Lines: Good Boys Do Fine Always', 'Spaces: All Cows Eat Grass'];
  body += text(200, top + 5 * gap + 42, tip[0], { size: 12, fill: R });
  body += text(200, top + 5 * gap + 58, tip[1], { size: 12, fill: L });
  return svg(400, 180, body, `${clef} clef lines and spaces`);
}

export const FIGURES = { posture, fingerNumbers, handShape, beatBars, stepsSkips, staffLines };
