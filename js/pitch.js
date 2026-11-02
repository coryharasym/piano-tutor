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
    this.framesSinceEmit = Infinity;
  }

  // reading: { level, pitch: {freq, clarity} | null }. Returns midi or null.
  push({ level, pitch }) {
    if (Number.isFinite(this.framesSinceEmit)) this.framesSinceEmit++;
    // Slowly track the background noise level.
    if (level < this.noiseFloor * 2) this.noiseFloor = this.noiseFloor * 0.95 + level * 0.05;
    else this.noiseFloor *= 1.0005;
    this.noiseFloor = Math.max(0.0008, Math.min(this.noiseFloor, 0.05));

    const gate = this.noiseFloor * 3.5;
    // A repeated piano key can be struck before the preceding note is silent.
    // Require a fresh amplitude rise, plus an inter-onset cooldown; an
    // unchanging held key must never score itself a second time.
    const attack = this.framesSinceEmit >= 5 && level > gate &&
      level > this.prevLevel * 1.35 && level - this.prevLevel > gate * 0.5;
    this.prevLevel = this.prevLevel * 0.6 + level * 0.4;

    if (level < gate) {
      this.armed = true;
      this.lastEmitted = null;
      this.candidate = null;
      this.count = 0;
      this.framesSinceEmit = Infinity;
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
      this.framesSinceEmit = 0;
      return midi;
    }
    return null;
  }
}

// Check expected fundamentals instead of folding every overtone into chroma.
// Local peaks reject neighbouring semitones; amplitude (not squared energy)
// allows a softer hand to remain audible beneath the melody.
export function spectrumNoteEvidence(db, sampleRate, fftSize, midis) {
  const notes = [...new Set(midis)].sort((a, b) => a - b);
  if (!notes.length) return [];
  const hz = sampleRate / fftSize;
  const peaks = [];
  for (let i = 2; i < db.length - 1; i++) {
    if (!Number.isFinite(db[i]) || db[i] < -85 || db[i] <= db[i - 1] || db[i] < db[i + 1]) continue;
    const shift = (db[i - 1] - db[i + 1]) / (2 * (db[i - 1] - 2 * db[i] + db[i + 1]));
    // A weak partial must stand above its local surroundings, not just be a
    // noise bin close to the expected pitch. Three bins clear the main lobe.
    const background = Math.max(db[Math.max(0, i - 3)], db[Math.min(db.length - 1, i + 3)]);
    peaks.push({ freq: (i + (Number.isFinite(shift) ? shift : 0)) * hz, amp: 10 ** (db[i] / 20), prominent: db[i] - background >= 6 });
  }
  const strongest = Math.max(0, ...peaks.map(p => p.amp));
  const at = (freq, relative = 0.055) => peaks.find(p => Math.abs(1200 * Math.log2(p.freq / freq)) < (relative >= 0.055 ? 35 : 25) && p.amp >= strongest * relative && (relative >= 0.055 || p.prominent));
  const frequencies = notes.map(m => 440 * 2 ** ((m - 69) / 12));
  // Include strong unexpected lower roots. Otherwise an E3 played by
  // mistake can impersonate expected E4 through its second harmonic.
  const roots = peaks.filter(p => p.freq >= 55 && p.freq < 2100 && p.prominent && p.amp >= strongest * 0.01)
    // Low roots have few FFT bins. Quantize that candidate before looking
    // for its upper partials, rather than multiplying the bin error by 3.
    .map(p => 440 * 2 ** ((Math.round(69 + 12 * Math.log2(p.freq / 440)) - 69) / 12))
    .filter(root => at(root * 2, 0.015) && at(root * 3, 0.015) && !frequencies.some(f => {
      const ratio = root / f, h = Math.round(ratio);
      return h >= 1 && Math.abs(1200 * Math.log2(ratio / h)) < 35;
    }));
  // The bottom octave can have a broad fundamental rather than a distinct
  // local maximum. Check sub-octaves of the targets using band energy plus
  // TWO clear upper partials before treating their overtones as played keys.
  for (const freq of frequencies) for (const divisor of [2, 4]) {
    const root = freq / divisor, bin = Math.round(root / hz);
    if (root < 55 || frequencies.some(f => Math.abs(1200 * Math.log2(root / f)) < 35)) continue;
    const band = 10 ** (Math.max(...db.slice(Math.max(0, bin - 1), bin + 2)) / 20);
    if (band >= strongest * 0.01 && at(root * 2, 0.015) && at(root * 3, 0.015)) roots.push(root);
  }
  return notes.filter((_, index) => {
    const freq = frequencies[index];
    // Shared overtones are not independent evidence of a second played key.
    // In particular, no collection of a bass C's harmonics proves upper C.
    const independent = f => ![...frequencies.filter((_, j) => j !== index), ...roots].some(other => {
      const ratio = f / other, harmonic = Math.round(ratio);
      return harmonic >= 1 && Math.abs(1200 * Math.log2(ratio / harmonic)) < 35;
    });
    if (independent(freq) && at(freq)) return true;
    const partials = [2, 3, 4, 5, 6].filter(h => independent(freq * h) && at(freq * h, 0.008));
    // Softer notes need corroboration. This helps a held bass/melody remain
    // detectable after its attack without accepting an isolated weak peak.
    if (independent(freq) && at(freq, 0.015) && partials.length) return true;
    // Two multiples of the same partial (e.g. 3 and 6) can both belong to
    // an unexpected lower key. Require coprime harmonic numbers instead.
    const gcd = (a, b) => b ? gcd(b, a % b) : a;
    return partials.some((h, i) => partials.slice(i + 1).some(k => gcd(h, k) === 1));
  });
}

export function spectrumHasNotes(db, sampleRate, fftSize, midis) {
  const notes = [...new Set(midis)];
  return notes.length > 0 && spectrumNoteEvidence(db, sampleRate, fftSize, notes).length === notes.length;
}
