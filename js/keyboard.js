// On-screen piano keyboard: plays when tapped, highlights what to press.

import { isBlack, midiToName, prettyName } from './theory.js';
import { piano } from './audio.js';

// Black keys sit between whites; this offset (in white-key widths) nudges
// them the way a real keyboard does.
const BLACK_OFFSET = { 1: -0.08, 3: 0.08, 6: -0.1, 8: 0, 10: 0.1 };

export class Keyboard {
  constructor(el, { lo = 48, hi = 72, labels = 'c', onPress } = {}) {
    this.el = el;
    this.onPress = onPress;
    this.labels = labels; // 'none' | 'c' (only Cs) | 'all'
    this.keys = new Map();
    this.targets = new Map();
    el.classList.add('kb');
    el.innerHTML = '<div class="kb-scroll"><div class="kb-keys"></div></div>';
    this.scroller = el.firstChild;
    this.inner = this.scroller.firstChild;
    this.bindInput();
    this.setRange(lo, hi);
    new ResizeObserver(() => this.layout()).observe(el);
  }

  setRange(lo, hi) {
    // Always start and end on a white key.
    while (isBlack(lo)) lo--;
    while (isBlack(hi)) hi++;
    if (lo === this.lo && hi === this.hi) return;
    this.lo = lo; this.hi = hi;
    this.inner.innerHTML = '';
    this.keys.clear();
    let white = 0;
    for (let m = lo; m <= hi; m++) {
      const k = document.createElement('div');
      const black = isBlack(m);
      k.className = black ? 'key black' : 'key white';
      k.dataset.midi = m;
      if (black) {
        k.style.setProperty('--x', white + BLACK_OFFSET[m % 12]);
      } else {
        k.style.setProperty('--x', white);
        white++;
      }
      k.innerHTML = '<span class="key-finger"></span><span class="key-label"></span>';
      this.inner.appendChild(k);
      this.keys.set(m, k);
    }
    this.whiteCount = white;
    this.refreshLabels();
    this.layout();
  }

  layout() {
    const w = this.el.clientWidth || 600;
    const keyW = Math.max(30, Math.min(64, w / this.whiteCount));
    const narrow = keyW < 46;
    if (narrow !== this.narrow) { this.narrow = narrow; this.refreshLabels(); }
    this.inner.style.setProperty('--kw', keyW + 'px');
    this.inner.style.width = keyW * this.whiteCount + 'px';
    this.scrollToTargets(false);
  }

  setLabels(mode) {
    this.labels = mode;
    this.refreshLabels();
  }

  refreshLabels() {
    for (const [m, k] of this.keys) {
      const name = midiToName(m);
      let text = '';
      if (this.labels === 'all' && !isBlack(m)) text = prettyName(name);
      if (this.labels === 'c' && m % 12 === 0) text = prettyName(name, true);
      if (m === 60 && this.labels !== 'none') text = this.narrow ? 'C4' : 'Middle C';
      k.querySelector('.key-label').textContent = text;
      k.classList.toggle('middle-c', m === 60);
    }
  }

  // targets: [{midi, finger, hand: 'L'|'R'}]; style 'next' | 'soft'
  setTargets(targets = [], style = 'next') {
    for (const k of this.keys.values()) {
      k.classList.remove('target', 'soft', 'hand-L', 'hand-R');
      k.querySelector('.key-finger').textContent = '';
    }
    this.targets.clear();
    for (const t of targets) {
      const k = this.keys.get(t.midi);
      if (!k) continue;
      this.targets.set(t.midi, t);
      k.classList.add(style === 'soft' ? 'soft' : 'target');
      if (t.hand) k.classList.add('hand-' + t.hand);
      k.querySelector('.key-finger').textContent = t.finger || '';
    }
    this.scrollToTargets(true);
  }

  scrollToTargets(smooth) {
    if (!this.targets.size) return;
    const ms = [...this.targets.keys()];
    const a = this.keys.get(Math.min(...ms));
    const b = this.keys.get(Math.max(...ms));
    if (!a || !b) return;
    const left = a.offsetLeft, right = b.offsetLeft + b.offsetWidth;
    const view = this.scroller.clientWidth;
    const cur = this.scroller.scrollLeft;
    if (left >= cur + 8 && right <= cur + view - 8) return;
    const to = Math.max(0, (left + right) / 2 - view / 2);
    this.scroller.scrollTo({ left: to, behavior: smooth ? 'smooth' : 'auto' });
  }

  // Visual feedback for a note that was played (by tap, mic or demo).
  flash(midi, kind = 'press') {
    const k = this.keys.get(midi);
    if (!k) return;
    k.classList.remove('press', 'good', 'miss');
    void k.offsetWidth; // restart the animation
    k.classList.add(kind);
    clearTimeout(k._t);
    k._t = setTimeout(() => k.classList.remove(kind), 450);
  }

  bindInput() {
    const active = new Map(); // pointerId -> {midi, handle}
    const keyAt = (x, y) => {
      const el = document.elementFromPoint(x, y)?.closest('.key');
      return el && this.inner.contains(el) ? Number(el.dataset.midi) : null;
    };
    const down = (id, midi) => {
      const handle = piano.play(midi, { duration: 4 });
      active.set(id, { midi, handle });
      this.keys.get(midi)?.classList.add('down');
      this.onPress && this.onPress(midi, 'tap');
    };
    const up = (id) => {
      const a = active.get(id);
      if (!a) return;
      a.handle.stop();
      this.keys.get(a.midi)?.classList.remove('down');
      active.delete(id);
    };
    this.inner.addEventListener('pointerdown', async (e) => {
      const midi = keyAt(e.clientX, e.clientY);
      if (midi == null) return;
      e.preventDefault();
      await piano.unlock();
      down(e.pointerId, midi);
    });
    this.inner.addEventListener('pointermove', (e) => {
      const a = active.get(e.pointerId);
      if (!a || e.pointerType === 'mouse' && !e.buttons) return;
      const midi = keyAt(e.clientX, e.clientY);
      if (midi != null && midi !== a.midi) { up(e.pointerId); down(e.pointerId, midi); }
    });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach((t) =>
      this.inner.addEventListener(t, (e) => up(e.pointerId)));
  }
}
