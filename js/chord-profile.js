// A local microphone fingerprint of each key. Magnitude templates let us
// compare a chord with its incomplete versions, including octave overtones.
export const PROFILE_VERSION = 1;
export const PROFILE_FFT = 8192;

export function packSpectrum(db) {
  const peak = Math.max(...db);
  if (!Number.isFinite(peak) || peak < -85) return null;
  return btoa(String.fromCharCode(...Array.from(db, v =>
    Number.isFinite(v) ? Math.max(0, Math.round(120 + 2 * (v - peak))) : 0)));
}

function unpack(text) {
  if (typeof text !== 'string') return null;
  try {
    const bytes = atob(text);
    if (bytes.length !== PROFILE_FFT / 2 || [...bytes].some(v => v.charCodeAt(0) > 120)) return null;
    return Float32Array.from(bytes, v => v.charCodeAt(0) ? 10 ** ((v.charCodeAt(0) - 120) / 40) : 0);
  } catch { return null; }
}

export function profileCompatible(profile, rate, tuning) {
  return profile?.version === PROFILE_VERSION && profile.fftSize === PROFILE_FFT &&
    profile.sampleRate === rate && Math.abs(profile.tuning - tuning) < 0.05;
}

// Each fit is nonnegative: a missing note cannot be invented by subtracting
// another key. A leave-one-out fit must get materially worse for EVERY key.
export function buildChordModel(profile, midis) {
  const notes = [...new Set(midis)];
  if (notes.length < 2 || notes.length > 6) return null;
  const templates = notes.map(m => unpack(profile?.notes?.[m]));
  if (templates.some(t => !t)) return null;
  const n = PROFILE_FFT / 2;
  const indices = [], weights = [];
  for (let i = 2; i < n - 1; i++) {
    const max = Math.max(...templates.map(t => t[i]));
    // Keep bins outside the expected keys too: otherwise an unexpected
    // bass note's overtones can impersonate a missing chord tone.
    indices.push(i);
    weights.push(1 / Math.sqrt(Math.max(0.02, max)));
  }
  const vectors = templates.map(t => Float64Array.from(indices, (bin, k) => t[bin] * weights[k]));
  const dot = (a, b) => a.reduce((sum, v, i) => sum + v * b[i], 0);
  const gram = vectors.map(a => vectors.map(b => dot(a, b)));
  if (gram.some((row, i) => row[i] < 1e-8)) return null;
  const fit = (rhs, energy, omit = -1) => {
    const gains = vectors.map(() => 0);
    for (let pass = 0; pass < 32; pass++) {
      for (let i = 0; i < gains.length; i++) {
        if (i === omit) continue;
        const other = gram[i].reduce((sum, v, j) => j === i ? sum : sum + v * gains[j], 0);
        gains[i] = Math.max(0, (rhs[i] - other) / gram[i][i]);
      }
    }
    let error = energy;
    gains.forEach((g, i) => { error -= 2 * g * rhs[i]; gains.forEach((h, j) => { error += g * h * gram[i][j]; }); });
    return { error: Math.max(0, error), gains };
  };
  return db => {
    const peak = Math.max(...db);
    if (!Number.isFinite(peak) || peak < -85) return false;
    const heard = Float64Array.from(indices, (bin, k) => 10 ** ((db[bin] - peak) / 20) * weights[k]);
    const energy = dot(heard, heard);
    if (!energy) return false;
    const rhs = vectors.map(v => dot(v, heard));
    const full = fit(rhs, energy);
    if (full.error / energy > 0.18) return false;
    const loudest = Math.max(...full.gains);
    return full.gains.every((g, i) => g >= loudest * 0.07 &&
      (fit(rhs, energy, i).error - full.error) / energy > 0.012);
  };
}
