import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {GIVE_ME_JESUS,GIVE_ME_JESUS_MELODY} from '../js/lessons/give-me-jesus.js';
import {UNITS,HYMNS,findLesson} from '../js/lessons/index.js';
import {songbook,printOne,songTitle} from '../js/print.js';
import {parseSeq} from '../js/theory.js';
import {buildPractice,loopBars,buildBarLoop} from '../js/practice.js';
const reference=JSON.parse(await readFile(new URL('../sources/give-me-jesus/melody.json',import.meta.url),'utf8'));
const regularized=reference.melody.replace(/([A-G][b#]?\d)\/8\. ([A-G][b#]?\d)\/16/g,'$1/8 $2/8');
const source=parseSeq(regularized),arranged=parseSeq(GIVE_ME_JESUS_MELODY);
assert.equal(source.length,arranged.length);
for(let i=0;i<source.length;i++){
 assert.deepEqual(arranged[i].midis||[],(source[i].midis||[]).map(m=>m+2),'Traditional melody changed at event '+i);
 assert.equal(arranged[i].dur,source[i].dur);assert.equal(!!arranged[i].tie,!!source[i].tie);
}
assert.equal(HYMNS.filter(h=>h.id===GIVE_ME_JESUS.id).length,1);
assert.ok(!UNITS.some(u=>u.lessons.some(l=>l.id===GIVE_ME_JESUS.id)),'Songbook addition must not change course lessons');
assert.equal(UNITS.filter(u=>u.course==='beginner').reduce((n,u)=>n+u.lessons.length,0),95);
assert.deepEqual(findLesson(GIVE_ME_JESUS.id).lesson,GIVE_ME_JESUS);
const songs=songbook('beginner').filter(s=>s.lesson.id===GIVE_ME_JESUS.id);assert.equal(songs.length,1);assert.equal(songs[0].stepIndex,3);
assert.equal(songbook('intermediate').filter(s=>s.lesson.id===GIVE_ME_JESUS.id).length,0);
const score=GIVE_ME_JESUS.steps[3],practice=buildPractice(score);
assert.deepEqual(parseSeq(score.rh).map(e=>[e.midis,e.dur,!!e.tie]),arranged.map(e=>[e.midis,e.dur,!!e.tie]),'Phrasing must not change melody or rhythm');
assert.equal(practice.totalBeats,65);assert.equal(practice.lyrics.length,practice.syllables);assert.equal(practice.syllables,45);
assert.equal(practice.staves.length,2);
assert.ok(practice.moments.flatMap(m=>m.items).filter(i=>i.hand==='L').every(i=>[48,53,55].includes(i.midi)));
const bars=loopBars(score).bars;assert.equal(bars.length,17);
for(let from=1;from<=bars.length;from++)for(let to=from;to<=bars.length;to++)assert.ok(buildBarLoop(score,from,to).totalBeats>0);
assert.equal(printOne(GIVE_ME_JESUS.id,3).length,1);
console.log('Give Me Jesus: source melody/transposition/rhythm/ties, 45 syllables, both hands, 153 passage loops, Songbook and unchanged course totals passed');

for(const {lesson,stepIndex} of songbook()) {
 const title=songTitle(lesson,lesson.steps[stepIndex]);
 assert.ok(!['Play it through','Your recital'].includes(title),'Songbook must show song names');
 if(lesson.hymn&&lesson.steps[stepIndex].title==='Play it through')assert.equal(title,lesson.title);
}
