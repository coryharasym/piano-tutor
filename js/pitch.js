// Pure pitch-analysis functions (no browser APIs), so they can be tested in Node.

// McLeod Pitch Method: normalized square difference function + peak picking.
// Returns { freq, clarity } or null when no clear pitch is present.
export function detectPitch(buf, sampleRate, { minFreq = 55, maxFreq = 2100 } = {}) {
  const n = buf.length;
  const maxLag = Math.min(n - 1, Math.floor(sampleRate / minFreq));
  const minLag = Math.max(2, Math.floor(sampleRate / maxFreq));
  const nsdf = new Float32Array(maxLag + 1);

  for (let tau = 0; tau <= maxLag; tau++) {
    let acf = 0, m = 0;
    for (let i = 0; i < n - tau; i++) {
      const a = buf[i], b = buf[i + tau];
      acf += a * b;
      m += a * a + b * b;
    }
    nsdf[tau] = m > 0 ? (2 * acf) / m : 0;
  }

  // Collect the highest peak between each pair of positive zero crossings.
  const peaks = [];
  let tau = 1;
  while (tau < maxLag && nsdf[tau] > 0) tau++; // skip the lag-0 lobe
  while (tau < maxLag) {
    while (tau < maxLag && nsdf[tau] <= 0) tau++;
    let best = -1, bestVal = -Infinity;
    while (tau < maxLag && nsdf[tau] > 0) {
      if (nsdf[tau] > bestVal && nsdf[tau] >= nsdf[tau - 1] && nsdf[tau] >= nsdf[tau + 1]) {
        bestVal = nsdf[tau];
        best = tau;
      }
      tau++;
    }
    if (best > 0) peaks.push(best);
  }
  if (!peaks.length) return null;

  const highest = Math.max(...peaks.map((p) => nsdf[p]));
  const threshold = 0.9 * highest;
  const chosen = peaks.find((p) => p >= minLag && nsdf[p] >= threshold);
  if (!chosen) return null;

  // Parabolic interpolation for sub-sample accuracy.
  const a = nsdf[chosen - 1], b = nsdf[chosen], c = nsdf[chosen + 1] ?? b;
  const shift = (a - c) / (2 * (a - 2 * b + c) || 1);
  const period = chosen + (Number.isFinite(shift) ? shift : 0);
  const freq = sampleRate / period;
  if (freq < minFreq || freq > maxFreq) return null;
  return { freq, clarity: b };
}

// A longer 85-93 ms recording makes low piano notes easier to identify.
// Downsample by averaging groups of four before the expensive pitch search:
// this retains the piano's fundamentals while keeping iPhone CPU use low.
export function detectPianoPitch(buf, sampleRate, options = {}) {
  const factor = 4;
  const count = Math.floor(buf.length / factor);
  const reduced = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const j = i * factor;
    reduced[i] = (buf[j] + buf[j + 1] + buf[j + 2] + buf[j + 3]) * 0.25;
  }
  return detectPitch(reduced, sampleRate / factor, options);
}

export function rms(buf) {
  let s = 0;
  for (let i = 0; i < buf.length; i++) s += buf[i] * buf[i];
  return Math.sqrt(s / buf.length);
}

// 12-bin chroma (C..B) from an analyser's dB spectrum.
export function chroma(dbSpectrum, sampleRate, fftSize, { lo = 60, hi = 2000 } = {}) {
  const bins = new Float32Array(12);
  const hz = sampleRate / fftSize;
  for (let i = Math.ceil(lo / hz); i < Math.min(dbSpectrum.length, hi / hz); i++) {
    const mag = Math.pow(10, dbSpectrum[i] / 20);
    const midi = 69 + 12 * Math.log2((i * hz) / 440);
    const pc = ((Math.round(midi) % 12) + 12) % 12;
    bins[pc] += mag * mag;
  }
  const max = Math.max(...bins) || 1;
  return Array.from(bins, (v) => v / max);
}

/*
 * Turns a stream of per-frame readings into discrete "note played" events.
 * A note is reported once when it becomes stable, and again only after a
 * fresh attack (a jump in loudness) or after silence. This lets repeated
 * notes like E-E-F-G register as separate presses.
 */
export class NoteTracker {
  constructor({ stableFrames = 3, minClarity = 0.8 } = {}) {
    this.stableFrames = stableFrames;
    this.minClarity = minClarity;
    this.noiseFloor = 0.002;
    this.prevLevel = 0;
    this.candidate = null;
    this.count = 0;
    this.lastEmitted = null;
    this.armed = true;
  }

  // reading: { level, pitch: {freq, clarity} | null }. Returns midi or null.
  push({ level, pitch }) {
    // Slowly track the background noise level.
    if (level < this.noiseFloor * 2) this.noiseFloor = this.noiseFloor * 0.95 + level * 0.05;
    else this.noiseFloor *= 1.0005;
    this.noiseFloor = Math.max(0.0008, Math.min(this.noiseFloor, 0.05));

    const gate = this.noiseFloor * 3.5;
    const attack = level > gate && level > this.prevLevel * 1.6 && level - this.prevLevel > gate * 0.5;
    this.prevLevel = this.prevLevel * 0.6 + level * 0.4;

    if (level < gate) {
      this.armed = true;
      this.lastEmitted = null;
      this.candidate = null;
      this.count = 0;
      return null;
    }
    if (attack) {
      this.armed = true;
      this.count = 0;
    }
    if (!pitch || pitch.clarity < this.minClarity) return null;

    const midi = Math.round(69 + 12 * Math.log2(pitch.freq / 440));
    if (midi === this.candidate) this.count++;
    else { this.candidate = midi; this.count = 1; }

    // A pitch change without a new attack must hold longer (guards against
    // the decaying tail of the previous note wandering between octaves).
    const needed = this.armed ? this.stableFrames : this.stableFrames * 2;
    if (this.count >= needed && (this.armed || midi !== this.lastEmitted)) {
      this.armed = false;
      this.lastEmitted = midi;
      return midi;
    }
    return null;
  }
}

// Check expected fundamentals instead of folding every overtone into chroma.
// Local peaks reject neighbouring semitones; amplitude (not squared energy)
// allows a softer hand to remain audible beneath the melody.
export function spectrumHasNotes(db, sampleRate, fftSize, midis) {
  const notes = [...new Set(midis)].sort((a, b) => a - b);
  if (!notes.length) return false;
  const hz = sampleRate / fftSize;
  const peaks = [];
  for (let i = 2; i < db.length - 1; i++) {
    if (!Number.isFinite(db[i]) || db[i] < -85 || db[i] <= db[i - 1] || db[i] < db[i + 1]) continue;
    const shift = (db[i - 1] - db[i + 1]) / (2 * (db[i - 1] - 2 * db[i] + db[i + 1]));
    peaks.push({ freq: (i + (Number.isFinite(shift) ? shift : 0)) * hz, amp: 10 ** (db[i] / 20) });
  }
  const strongest = Math.max(0, ...peaks.map(p => p.amp));
  const at = (freq, relative = 0.055) => peaks.find(p => Math.abs(1200 * Math.log2(p.freq / freq)) < 35 && p.amp >= strongest * relative);
  const frequencies = notes.map(m => 440 * 2 ** ((m - 69) / 12));
  return frequencies.every((freq, index) => {
    // Close notes can merge in the fundamental's FFT lobe. Two matching
    // upper partials can resolve the quieter note without lowering the gate.
    if (!at(freq)) return !!at(freq * 2, 0.015) && !!at(freq * 3, 0.015) && frequencies.every((other, j) => j === index || [2, 3].every(h => {
      const ratio = freq * h / other;
      return Math.abs(1200 * Math.log2(ratio / Math.round(ratio))) >= 35;
    }));
    // A fifth can coincide with a lower note's third harmonic. Require an
    // independent partial in that case. Octaves cannot be reliably separated
    // from overtones using a single microphone spectrum alone.
    const overlaps = f => frequencies.slice(0, index).some(low => {
      const ratio = f / low, harmonic = Math.round(ratio);
      return harmonic >= 2 && Math.abs(1200 * Math.log2(ratio / harmonic)) < 35;
    });
    if (!overlaps(freq)) return true;
    const independent = [2, 3, 4].filter(h => !overlaps(freq * h));
    return independent.length > 0 && independent.some(h => at(freq * h, 0.015));
  });
}
