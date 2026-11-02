// Blackman-window FFT matching AnalyserNode; used with decoded piano PCM.
export const N = 8192;
export function spectrum(pcm, offset = 0) {
  const re = new Float64Array(N), im = new Float64Array(N);
  for (let i = 0; i < N; i++) re[i] = (pcm[offset + i] || 0) *
    (0.42 - 0.5 * Math.cos(2 * Math.PI * i / N) + 0.08 * Math.cos(4 * Math.PI * i / N));
  for (let i = 1, j = 0; i < N; i++) {
    let bit = N >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) [re[i], re[j]] = [re[j], re[i]];
  }
  for (let size = 2; size <= N; size *= 2) {
    const half = size / 2;
    for (let start = 0; start < N; start += size) for (let k = 0; k < half; k++) {
      const a = start + k, b = a + half, angle = -2 * Math.PI * k / size;
      const r = re[b] * Math.cos(angle) - im[b] * Math.sin(angle);
      const v = re[b] * Math.sin(angle) + im[b] * Math.cos(angle);
      re[b] = re[a] - r; im[b] = im[a] - v; re[a] += r; im[a] += v;
    }
  }
  return Float32Array.from({length:N / 2}, (_, i) => 20 * Math.log10(Math.max(1e-7, Math.hypot(re[i], im[i]) / N)));
}

