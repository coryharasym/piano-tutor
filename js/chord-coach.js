import { midiToName } from './theory.js';

// Shared lesson/Wait-mode assistance. Sequential practice is an explicit
// choice, never silently scored as simultaneous chord detection.
export class ChordCoach {
  constructor(root, { onChange = () => {}, clock = () => performance.now(), levelSource } = {}) {
    this.root = root;
    this.clock = clock;
    this.onChange = onChange;
    this.levelSource = levelSource;
    this.onLevel = level => this.observeLevel(level, Math.max(0.003, (levelSource?.tracker?.noiseFloor || 0.002) * 3.5));
    levelSource?.onLevel?.add(this.onLevel);
    root.innerHTML = '<span class="chord-readout" role="status" aria-live="polite"></span><button class="pill" data-chord-assist hidden>Play notes separately</button>';
    this.readout = root.querySelector('.chord-readout');
    this.button = root.querySelector('[data-chord-assist]');
    this.button.addEventListener('click', () => {
      this.assisted = !this.assisted;
      this.index = 0;
      this.needsRelease = false; this.quietSince = null;
      this.onChange();
      this.paint();
    });
    this.reset();
  }

  reset() {
    this.key = ''; this.notes = []; this.assisted = false; this.index = 0;
    this.started = this.clock(); this.detected = []; this.lastText = '';
    this.needsRelease = false; this.quietSince = null;
    this.root.hidden = true;
  }

  update(midis, status = {}, { active = true, canAssist = true, revealTargets = true } = {}) {
    const notes = [...new Set(midis)].sort((a, b) => a - b);
    if (!active || notes.length < 2) { this.reset(); return; }
    const key = notes.join(',');
    if (key !== this.key) {
      this.reset(); this.key = key; this.notes = notes;
    }
    this.canAssist = canAssist;
    this.revealTargets = revealTargets;
    // Flow must not inherit a Wait-mode assistance state.
    if (!canAssist) { this.assisted = false; this.index = 0; }
    this.detected = status.detected || [];
    this.needsAttack = status.needsAttack;
    this.root.hidden = false;
    this.paint();
  }

  paint() {
    const name = m => midiToName(m).replace('#', '♯');
    let text;
    if (this.assisted) {
      text = this.needsRelease ? `Release the key, then play ${name(this.notes[this.index])}.`
        : `Separate-note practice: ${this.notes.slice(0, this.index).map(name).join(' + ')}${this.index ? ' heard. ' : ''}Play ${name(this.notes[this.index])} next; release each key.`;
    } else if (this.needsAttack) {
      text = 'Release and play the chord again.';
    } else {
      const heard = this.notes.filter(m => this.detected.includes(m));
      const missing = this.notes.filter(m => !this.detected.includes(m));
      const waiting = this.revealTargets ? missing.map(name).join(' + ') : `the other ${missing.length === 1 ? 'note' : 'notes'}`;
      text = heard.length ? `Hearing ${heard.map(name).join(' + ')}${missing.length ? `; waiting for ${waiting}` : '; checking chord…'}`
        : this.revealTargets ? `Listening for ${this.notes.map(name).join(' + ')}` : `Listening for ${this.notes.length} notes together`;
    }
    // Do not re-announce unchanged text every 80ms to screen readers.
    if (text !== this.lastText) { this.readout.textContent = text; this.lastText = text; }
    this.button.hidden = !this.canAssist || (!this.assisted && this.clock() - this.started < 5000);
    this.button.textContent = this.assisted ? 'Try together' : 'Play notes separately';
    this.button.setAttribute('aria-pressed', String(this.assisted));
  }

  takeNote(midi) {
    if (!this.assisted || this.needsRelease || midi !== this.notes[this.index]) return false;
    this.index++;
    if (this.index === this.notes.length) return true;
    this.needsRelease = true; this.quietSince = null;
    this.paint();
    return false;
  }

  observeLevel(level, gate = 0.007) {
    if (!this.assisted || !this.needsRelease) return;
    if (level >= gate) { this.quietSince = null; return; }
    if (this.quietSince == null) this.quietSince = this.clock();
    if (this.clock() - this.quietSince >= 80) {
      this.needsRelease = false; this.quietSince = null; this.paint();
    }
  }

  dispose() { this.levelSource?.onLevel?.delete(this.onLevel); this.reset(); }
}
