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
  constructor({ stableFrames = 3, minClarity = 0.86 } = {}) {
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
