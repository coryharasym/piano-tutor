// Per-note evidence for the CURRENT chord, with a short sustain/dropout grace.
// This never combines seconds-old monophonic guesses into a chord.
export class ChordTracker {
  reset() { this.key = ''; this.frames = []; this.detected = []; }

  constructor() { this.reset(); }

  push(midis, detected, { now, audible, complete, strict = false, requireComplete = false }) {
    const key = [...new Set(midis)].sort((a, b) => a - b).join(',');
    if (this.key !== key) { this.reset(); this.key = key; }
    if (!audible) { this.reset(); this.key = key; return false; }
    this.frames = this.frames.filter(f => now - f.t <= 240).slice(-2);
    this.frames.push({ t: now, notes: new Set(detected), complete });
    // Two observations per key, with at most 140ms since the most recent.
    // A brief masked partial need not reset all the other sustained notes.
    this.detected = [...new Set(midis)].filter(m => {
      const seen = this.frames.filter(f => f.notes.has(m));
      return seen.length >= 2 && now - seen.at(-1).t <= 140;
    });
    if (strict) return complete && this.frames.at(-2)?.complete === true;
    if (requireComplete) return complete && this.frames.filter(f => f.complete).length >= 2;
    return this.detected.length === new Set(midis).size && detected.length > 0;
  }
}
