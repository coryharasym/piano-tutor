// Sheet music rendering with VexFlow (loaded globally as window.Vex).

import { beatsOf } from './theory.js';

const KEY_SIG_ACCIDENTALS = {
  C: {}, G: { F: '#' }, D: { F: '#', C: '#' }, F: { B: 'b' }, Am: {}, Em: { F: '#' }, Dm: { B: 'b' },
};

const VF_DUR = { w: 'w', 'h.': 'h', h: 'h', 'q.': 'q', q: 'q', '8.': '8', 8: '8', 16: '16' };

function vfKey(name) {
  const m = /^([A-G])([#b]?)(-?\d)$/.exec(name);
  return `${m[1].toLowerCase()}${m[2]}/${m[3]}`;
}

// Split events into measures of `perBar` beats. Events keep their index.
// `pickup` is the length of an incomplete first bar (an upbeat), if any.
// Repeat signs are kept on the bars as bars.repeatStart / bars.repeatEnd (sets of bar numbers).
export function toMeasures(events, perBar, pickup = 0) {
  const bars = [[]];
  bars.repeatStart = new Set();
  bars.repeatEnd = new Set();
  let beats = 0;
  let cap = pickup || perBar;
  events.forEach((ev, i) => {
    if (ev.bar) {
      if (ev.repeat === 'end') bars.repeatEnd.add(bars.length - 1);
      if (ev.repeat === 'start') bars.repeatStart.add(beats >= cap - 1e-6 ? bars.length : bars.length - 1);
      return;
    }
    if (beats >= cap - 1e-6) { bars.push([]); beats = 0; cap = perBar; }
    bars[bars.length - 1].push({ ...ev, index: i });
    beats += beatsOf(ev.dur);
  });
  return bars;
}

/*
 * opts: {
 *   staves: [{ clef: 'treble'|'bass', events }], // one or two (grand staff)
 *   time: '4/4', key: 'C', current: {staff, index} | index, done: Set of "staff:index",
 *   showNames: bool, maxBars
 * }
 */
export function renderStaff(el, opts) {
  const VF = window.Vex?.Flow;
  el.innerHTML = '';
  if (!VF) { el.textContent = 'Sheet music is loading…'; return; }

  const { staves, time = '4/4', key = 'C', showNames = false } = opts;
  const [num, den] = time.split('/').map(Number);
  const perBar = num * (4 / den);
  const measures = staves.map((s) => toMeasures(s.events, perBar, opts.pickup));
  const barCount = Math.max(...measures.map((m) => m.length));

  const width = opts.width || Math.max(260, el.clientWidth || 600);
  const grand = staves.length > 1;
  const lineH = grand ? 215 : 135;
  const firstExtra = 70 + (KEY_SIG_ACCIDENTALS[key] ? Object.keys(KEY_SIG_ACCIDENTALS[key]).length * 12 : 0);
  const maxBars = opts.maxBars || Math.max(1, Math.min(4, Math.floor((width - firstExtra) / 170)));

  // Which bar holds the current note? Show the page of bars around it.
  const cur = typeof opts.current === 'object' && opts.current ? opts.current : { staff: 0, index: opts.current ?? -1 };
  let curBar = 0;
  measures[cur.staff]?.forEach((bar, bi) => { if (bar.some((e) => e.index === cur.index)) curBar = bi; });
  const page = Math.floor(curBar / maxBars);
  // opts.bars = [from, to] draws a fixed slice instead (used for printing).
  const [from, to] = opts.bars ? [opts.bars[0], Math.min(barCount, opts.bars[1])] : [page * maxBars, Math.min(barCount, page * maxBars + maxBars)];
  const shown = to - from;

  const renderer = new VF.Renderer(el, VF.Renderer.Backends.SVG);
  const hasMarks = staves.some((s, si) => s.events.some((e) => e.marks || (si > 0 && e.slurStart)));
  const height = lineH + (showNames ? 20 : 0) + (opts.showFingers ? 12 : 0) + (hasMarks ? 28 : 0);
  renderer.resize(width, height);
  const ctx = renderer.getContext();
  ctx.setFont('Inter', 10);
  // Share the width by how much music each bar holds (a short pickup bar gets less).
  const usable = width - 10 - firstExtra;
  const barBeats = (b) => Math.max(...measures.map((m) => (m[b] || []).reduce((n, e) => n + beatsOf(e.dur), 0)));
  const weights = [];
  for (let b = from; b < to; b++) weights.push(Math.max(0.55, Math.min(1, barBeats(b) / perBar)));
  const weightSum = weights.reduce((a, c) => a + c, 0);

  const accInKey = KEY_SIG_ACCIDENTALS[key] || {};
  const done = opts.done || new Set();

  const drawn = staves.map(() => new Map()); // event index -> StaveNote, for ties and slurs
  let x = 5;
  for (let b = from; b < to; b++) {
    const w = (usable * weights[b - from]) / weightSum + (b === from ? firstExtra : 0);
    const staveObjs = staves.map((s, si) => {
      const st = new VF.Stave(x, 18 + (opts.showFingers ? 12 : 0) + si * 100, w);
      if (b === from) {
        st.addClef(s.clef);
        if (key !== 'C' && key !== 'Am') st.addKeySignature(key);
        if (from === 0) st.addTimeSignature(time);
      }
      if (measures[si].repeatStart.has(b)) st.setBegBarType(VF.Barline.type.REPEAT_BEGIN);
      if (measures[si].repeatEnd.has(b)) st.setEndBarType(VF.Barline.type.REPEAT_END);
      else if (b === barCount - 1) st.setEndBarType(VF.Barline.type.END);
      st.setContext(ctx).draw();
      return st;
    });
    if (grand && b === from) {
      new VF.StaveConnector(staveObjs[0], staveObjs[1]).setType('brace').setContext(ctx).draw();
      new VF.StaveConnector(staveObjs[0], staveObjs[1]).setType('singleLeft').setContext(ctx).draw();
    }
    if (grand) new VF.StaveConnector(staveObjs[0], staveObjs[1]).setType('singleRight').setContext(ctx).draw();

    const voices = staves.map((s, si) => {
      const bar = measures[si][b] || [];
      const notes = bar.map((ev) => {
        const restKey = s.clef === 'bass' ? 'd/3' : 'b/4';
        const keys = ev.rest ? [restKey] : ev.notes.map(vfKey);
        const n = new VF.StaveNote({
          clef: s.clef, keys, duration: VF_DUR[ev.dur] + (ev.rest ? 'r' : ''),
          auto_stem: true,
        });
        if (ev.dur.endsWith('.')) VF.Dot.buildAndAttach([n], { all: true });
        if (!ev.rest) {
          ev.notes.forEach((name, ki) => {
            const acc = name.length === 3 ? name[1] : '';
            const inKey = accInKey[name[0]] || '';
            if (acc !== inKey) n.addModifier(new VF.Accidental(acc || 'n'), ki);
          });
          if (opts.showFingers && ev.fingers.length) {
            // Fingering above the right hand, below the left.
            const pos = si === 0 ? VF.Annotation.VerticalJustify.TOP : VF.Annotation.VerticalJustify.BOTTOM;
            n.addModifier(new VF.Annotation(ev.fingers.join(' ')).setVerticalJustification(pos).setFont('Inter', 10, 'bold'), 0);
          }
          // The dot sits by the note head, on the side away from the stem.
          if (ev.staccato) n.addModifier(new VF.Articulation('a.').setPosition(n.getStemDirection() === 1 ? VF.Modifier.Position.BELOW : VF.Modifier.Position.ABOVE), 0);
          (ev.marks || []).forEach((mark) => {
            const text = { cresc: 'cresc.', dim: 'dim.', ped: 'Ped.', lift: '*' }[mark] || mark;
            const style = mark === 'ped' || mark === 'lift' ? 'normal' : 'italic';
            n.addModifier(new VF.Annotation(text).setVerticalJustification(VF.Annotation.VerticalJustify.BOTTOM)
              .setFont('Georgia', mark.length <= 2 ? 15 : 12, 'bold', style), 0);
          });
          if (showNames) {
            const label = ev.notes.map((nm) => nm.replace(/-?\d$/, '').replace('#', '♯').replace('b', '♭')).join('');
            n.addModifier(new VF.Annotation(label).setVerticalJustification(VF.Annotation.VerticalJustify.BOTTOM).setFont('Inter', 11), 0);
          }
        }
        const isCur = cur.staff === si && cur.index === ev.index;
        const isDone = done.has(`${si}:${ev.index}`);
        drawn[si].set(ev.index, n);
        if (isCur) n.setStyle({ fillStyle: '#0e8f7e', strokeStyle: '#0e8f7e' });
        else if (isDone) n.setStyle({ fillStyle: '#9aa7a5', strokeStyle: '#9aa7a5' });
        return n;
      });
      const voice = new VF.Voice({ num_beats: num, beat_value: den }).setMode(VF.Voice.Mode.SOFT);
      voice.addTickables(notes.length ? notes : [new VF.GhostNote({ duration: 'w' })]);
      return voice;
    });

    const fmt = new VF.Formatter();
    voices.forEach((v) => fmt.joinVoices([v]));
    const startX = Math.max(...staveObjs.map((s) => s.getNoteStartX()));
    staveObjs.forEach((s) => s.setNoteStartX(startX));
    fmt.format(voices, Math.max(40, x + w - startX - 14));
    voices.forEach((v, i) => {
      const beams = VF.Beam.generateBeams(v.getTickables().filter((t) => t instanceof VF.StaveNote));
      v.draw(ctx, staveObjs[i]);
      beams.forEach((bm) => bm.setContext(ctx).draw());
    });
    x += w;
  }

  // Ties join a note to the same note just before it; slurs arch over a phrase.
  staves.forEach((s, si) => {
    let slurFrom = null;
    s.events.forEach((ev, i) => {
      if (ev.tie) {
        let prev = i - 1;
        while (prev >= 0 && s.events[prev].bar) prev--;
        const a = drawn[si].get(prev), b = drawn[si].get(i);
        if (a || b) {
          const keys = ev.notes.map((_, k) => k);
          new VF.StaveTie({ first_note: a || null, last_note: b || null, first_indices: keys, last_indices: keys }).setContext(ctx).draw();
        }
      }
      if (ev.slurStart) slurFrom = i;
      if (ev.slurEnd && slurFrom != null) {
        // A slur that runs off this page is drawn to (or from) the page edge.
        const shown = [...drawn[si].keys()];
        const a = drawn[si].get(slurFrom) || (slurFrom < shown[0] && i >= shown[0] ? drawn[si].get(shown[0]) : null);
        const b = drawn[si].get(i) || (i > shown[shown.length - 1] && slurFrom <= shown[shown.length - 1] ? drawn[si].get(shown[shown.length - 1]) : null);
        if (a && b && a !== b) {
          const inside = [...drawn[si].entries()].filter(([k]) => k >= slurFrom && k <= i).map(([, n]) => n);
          drawSlur(ctx, a, b, inside, si > 0, opts.showFingers ? 14 : 0);
        }
        slurFrom = null;
      }
    });
  });

  const svg = el.querySelector('svg');
  if (svg) {
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.style.width = '100%';
    svg.style.height = 'auto';
  }
  return { pages: Math.ceil(barCount / maxBars), page, barCount };
}

// A slur as a thin crescent arching clear of every note under it:
// above the right hand, below the left.
function drawSlur(ctx, a, b, inside, below, clear = 0) {
  const boxes = inside.map((n) => n.getBoundingBox()).filter(Boolean);
  if (!boxes.length) return;
  // `clear` keeps it outside the finger numbers.
  const edge = (bb) => (below ? bb.getY() + bb.getH() + 5 + clear : bb.getY() - 5 - clear);
  const ba = a.getBoundingBox(), bb = b.getBoundingBox();
  const x1 = ba.getX() + ba.getW() / 2, x2 = bb.getX() + bb.getW() / 2;
  const dir = below ? 1 : -1;
  const outer = below ? Math.max(...boxes.map(edge)) : Math.min(...boxes.map(edge));
  // Ends start near the outermost note, so a long slur doesn't cut through the middle ones.
  const near = (y) => (below ? Math.max(y, outer - 8) : Math.min(y, outer + 8));
  const y1 = near(edge(ba)), y2 = near(edge(bb));
  const lift = Math.min(18, 6 + (x2 - x1) / 30);
  const cy = below ? Math.max(outer, (y1 + y2) / 2) + lift : Math.min(outer, (y1 + y2) / 2) - lift;
  const dx = (x2 - x1) / 4;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.bezierCurveTo(x1 + dx, cy, x2 - dx, cy, x2, y2);
  ctx.bezierCurveTo(x2 - dx, cy - 2.5 * dir, x1 + dx, cy - 2.5 * dir, x1, y1);
  ctx.closePath();
  ctx.fill();
}
