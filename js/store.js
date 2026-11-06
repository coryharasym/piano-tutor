import { courseForLesson } from './courses.js';
// Progress and settings, saved on this device only.

const KEY = 'piano-tutor:v1';

const defaults = {
  learning: {},     // attempt history and personal confidence; separate from lesson completion
  musicianship: {}, // generator variants on this device
  done: {},          // lessonId -> true
  last: null,
  recitalRuns: {},    // choice-specific completed recital performance step indexes
  lastByCourse: {},        // { lesson, step }
  practice: {},      // "2026-10-24" -> true, days with daily practice done
  best: {},          // reading drill -> fastest time in seconds
  repertoire: {},   // lesson:step -> personal piece, stage, settings and notes
  focusPieces: {},  // course -> repertoire key
  sessions: {},     // course -> resumable guided practice
  sessionHistory: [],
  nextPractice: {}, // course -> reflection and passage to revisit
  settings: {
    course: 'beginner',
    volume: 0.8,
    autoRepeat: false, // repeat completed exercises while explicitly enabled
    easyChords: false, // optional mic assistance: one exact expected chord note advances
    anyOctave: true, // accept the right note in a neighbouring octave (mic only)
    keyNames: true,  // show note names on keys where the lesson allows
    handLabels: true, // "R" or "L" beside each finger number
    lyrics: true,     // show the words of songs as you play
  },
};

// Older Advanced recitals had no choice screen and used lesson-only record keys.
// Keep their completed performance steps on the original option, shifted by the chooser.
function migrateRecitalRuns(data) {
  const runs={...data.recitalRuns};
  for(const [id,steps]of Object.entries(runs)) {
    if(!/^adv-recital-a[1-8]$/.test(id)||!Array.isArray(steps))continue;
    const key=id+':adv-hymn-'+id.split('-').at(-1);
    if(!Object.hasOwn(runs,key))runs[key]=steps.filter(Number.isInteger).map(i=>i+1);
  }
  return {...data,recitalRuns:runs};
}

// Check backup structure before replacing live progress. Older omitted fields use defaults.
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
function validateData(data) {
  if (!object(data)) throw new Error('Invalid Piano Tutor progress');
  const maps = ['learning','musicianship','done','recitalRuns','lastByCourse','practice','best','repertoire','focusPieces','sessions','nextPractice','settings','recitals'];
  for (const key of maps) if (key in data && !object(data[key])) throw new Error('Invalid backup field: ' + key);
  const settings = data.settings || {};
  const numbers = {volume:[0,1],tuning:[-12,12],metroBpm:[40,208],verse:[1,100],scoreZoom:[0.1,5]};
  for (const [key,[lo,hi]] of Object.entries(numbers)) if (key in settings && (!Number.isFinite(settings[key]) || settings[key] < lo || settings[key] > hi)) throw new Error('Invalid setting: '+key);
  const options = {course:['beginner','intermediate','advanced'],playMode:['wait','flow'],playHand:['both','R','L'],metroBeats:[2,3,4,6],playSpeed:[0.5,0.75,1,1.25,1.5],listenSpeed:[0.5,0.75,1,1.25,1.5]};
  for (const [key,values] of Object.entries(options)) if (key in settings && !values.includes(settings[key])) throw new Error('Invalid setting: '+key);
  for (const value of Object.values(data.recitalRuns || {})) if (!Array.isArray(value) || value.some(i=>!Number.isInteger(i)||i<0)) throw new Error('Invalid recital record');
  for (const value of Object.values(data.lastByCourse || {})) if (!object(value) || typeof value.lesson!=='string' || !Number.isInteger(value.step) || value.step<0) throw new Error('Invalid course resume');
  if ('sessionHistory' in data && !Array.isArray(data.sessionHistory)) throw new Error('Invalid backup history');
  if (data.last != null && (!object(data.last) || typeof data.last.lesson !== 'string' || !Number.isInteger(data.last.step) || data.last.step < 0)) throw new Error('Invalid saved lesson');
  for (const item of Object.values(data.learning || {})) if (!object(item) || typeof item.lesson !== 'string' || !Number.isInteger(item.step) || item.step < 0) throw new Error('Invalid learning record');
  for (const value of Object.values(data.musicianship || {})) if (!Number.isSafeInteger(value) || value < 0) throw new Error('Invalid exercise variant');
  for (const session of Object.values(data.sessions || {})) if (!object(session) || !Array.isArray(session.stages) || session.stages.some(s => !object(s))) throw new Error('Invalid practice session');
  return data;
}

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return structuredClone(defaults);
    const data = validateData(JSON.parse(raw));
    return { ...structuredClone(defaults), ...migrateRecitalRuns(data), settings: { ...defaults.settings, ...data.settings } };
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
  setLast(lesson, step) { this.data.last = { lesson, step }; const course=courseForLesson(lesson); this.data.lastByCourse={...this.data.lastByCourse,[course]:{lesson,step}}; this.data.settings.course=course; this.save(); },
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
    validateData(file.data);
    const localCalibration = this.data.keyboardCalibration;
    const { keyboardCalibration, ...data } = file.data;
    this.data = { ...structuredClone(defaults), ...migrateRecitalRuns(data), settings: { ...defaults.settings, ...data.settings } };
    if (localCalibration) this.data.keyboardCalibration = localCalibration;
    this.save();
  },
};
