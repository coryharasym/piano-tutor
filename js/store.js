// Progress and settings, saved on this device only.

const KEY = 'piano-tutor:v1';

const defaults = {
  done: {},          // lessonId -> true
  last: null,
  lastByCourse: {},        // { lesson, step }
  practice: {},      // "2026-10-24" -> true, days with daily practice done
  best: {},          // reading drill -> fastest time in seconds
  settings: {
    course: 'beginner',
    volume: 0.8,
    anyOctave: true, // accept the right note in a neighbouring octave (mic only)
    keyNames: true,  // show note names on keys where the lesson allows
    handLabels: true, // "R" or "L" beside each finger number
    lyrics: true,     // show the words of songs as you play
  },
};

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return structuredClone(defaults);
    const data = JSON.parse(raw);
    return { ...structuredClone(defaults), ...data, settings: { ...defaults.settings, ...data.settings } };
  } catch {
    return structuredClone(defaults);
  }
}

export const store = {
  data: read(),
  save() {
    try { localStorage.setItem(KEY, JSON.stringify(this.data)); return true; } catch { return false; /* private mode or full storage */ }
  },
  markDone(id) { this.data.done[id] = true; this.save(); },
  isDone(id) { return !!this.data.done[id]; },
  practised(day) { this.data.practice = { ...this.data.practice, [day]: true }; this.save(); },
  setLast(lesson, step) { this.data.last = { lesson, step }; const course=lesson.startsWith('int-')?'intermediate':'beginner'; this.data.lastByCourse={...this.data.lastByCourse,[course]:{lesson,step}}; this.data.settings.course=course; this.save(); },
  setting(k, v) {
    if (v === undefined) return this.data.settings[k];
    this.data.settings[k] = v;
    this.save();
  },
  reset() { this.data = structuredClone(defaults); this.save(); },
  // A backup file: everything above, to keep or move to another device.
  backup() {
    // A microphone fingerprint belongs to this phone and placement, not to
    // the progress file someone might restore on a different device.
    const { keyboardCalibration, ...data } = this.data;
    return JSON.stringify({ app: 'piano-tutor', version: 1, saved: new Date().toISOString(), data }, null, 1);
  },
  restore(text) {
    const file = JSON.parse(text);
    if (file?.app !== 'piano-tutor' || !file.data?.done || typeof file.data.done !== 'object' || Array.isArray(file.data.done)) throw new Error('Not a Piano Tutor backup');
    const localCalibration = this.data.keyboardCalibration;
    const { keyboardCalibration, ...data } = file.data;
    this.data = { ...structuredClone(defaults), ...data, settings: { ...defaults.settings, ...data.settings } };
    if (localCalibration) this.data.keyboardCalibration = localCalibration;
    this.save();
  },
};
