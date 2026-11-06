// Real controllers and DOM, with deterministic mic events (no audio hardware).
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { createRequire } from 'node:module';
const root=resolve(new URL('..',import.meta.url).pathname);
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.mp3':'audio/mpeg'};
const server=createServer(async(req,res)=>{try{let path=resolve(root,'.'+new URL(req.url,'http://localhost').pathname);if(path===root)path+='/index.html';res.setHeader('Content-Type',types[extname(path)]||'application/octet-stream');res.end(await readFile(path));}catch{res.writeHead(404).end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const origin='http://127.0.0.1:'+server.address().port;
let chromium;
try{({chromium}=await import('playwright'));}catch(e){if(!process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES)throw e;({chromium}=createRequire(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright/package.json')('playwright'));}
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE_PATH||undefined,args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:844,height:390}}), errors=[];
page.on('pageerror',e=>errors.push(e.message));
try {
 await page.goto(origin);
 await page.evaluate(async()=>{
  const {store}=await import('./js/store.js');store.setting('course','advanced');
  const {buildLab}=await import('./js/musicianship-model.js');const {addLesson}=await import('./js/lessons/index.js');
  addLesson({id:'practice'},buildLab('ear',{},'advanced',1));location.hash='#/lesson/adv-lab-ear/1';
 });
 await page.waitForSelector('.ear-prompt');assert.equal(await page.locator('[data-along]').count(),0,'Ear answer cannot be exposed by Passage');
 // Delayed permission/audio unlock must not play after navigation.
 await page.evaluate(async()=>{const {piano}=await import('./js/audio.js');window.plays=0;piano.unlock=()=>new Promise(r=>window.resolveAudio=r);piano.play=()=>{window.plays++;return {stop(){}};};});
 await page.locator('[data-demo]').click();await page.locator('[data-home]').click();await page.waitForSelector('[data-menu]');await page.evaluate(()=>window.resolveAudio());await page.waitForTimeout(100);assert.equal(await page.evaluate(()=>window.plays),0);
 // Closing tuning during a pending mic request must not install a background handler.
 await page.evaluate(async()=>{const {listener}=await import('./js/listen.js');window.rawBefore=listener.onRaw.size;window.originalStart=listener.start;listener.start=()=>new Promise(r=>window.resolveTuner=r);});
 await page.locator('[data-menu]').click();await page.locator('[data-settings]').click();await page.locator('[data-tune]').click();await page.waitForSelector('.tuner');await page.locator('.tuner [data-close]').click();await page.evaluate(()=>window.resolveTuner(true));await page.waitForTimeout(50);assert.equal(await page.evaluate(async()=>(await import('./js/listen.js')).listener.onRaw.size),await page.evaluate(()=>window.rawBefore));await page.evaluate(async()=>{(await import('./js/listen.js')).listener.start=window.originalStart;});
 // Quiz Listen uses a separate controller and needs the same cancellation.
 await page.evaluate(async()=>{const {addLesson}=await import('./js/lessons/index.js');addLesson({id:'practice'},{id:'quiz-audit',title:'Quiz',daily:true,steps:[{t:'quiz',q:'Listen',listen:'C4/q',options:['C','D'],answer:0}]});location.hash='#/lesson/quiz-audit/0';});
 await page.waitForSelector('.quiz');await page.locator('.quiz button').filter({hasText:'Listen'}).click();await page.locator('[data-home]').click();await page.waitForSelector('[data-menu]');await page.evaluate(()=>window.resolveAudio());await page.waitForTimeout(100);assert.equal(await page.evaluate(()=>window.plays),0);
 await page.evaluate(async()=>{const {addLesson}=await import('./js/lessons/index.js');const {buildLab}=await import('./js/musicianship-model.js');addLesson({id:'practice'},buildLab('sight',{},'advanced',2));location.hash='#/lesson/adv-lab-sight/1';});
 await page.waitForSelector('[data-along]');assert.equal(await page.locator('[data-demo]').count(),0,'Fresh reading offers Flow without an answer demonstration');
 // A generated review retains its original notes and reloads after the generator changes.
 const expected=await page.evaluate(async()=>{const {recordAttempt,reviewTarget}=await import('./js/learning.js');const {addLesson}=await import('./js/lessons/index.js');const {buildLab}=await import('./js/musicianship-model.js');const l=buildLab('sight',{},'advanced',3);addLesson({id:'practice'},l);const item=recordAttempt('advanced',l.id,1,false);addLesson({id:'practice'},buildLab('sight',{},'advanced',99));const target=reviewTarget(item);location.hash=`#/lesson/${target.lesson}/0`;return l.steps[1].rh;});
 await page.waitForSelector('.music svg');await page.reload();await page.waitForSelector('.music svg');assert.equal(await page.evaluate(async()=>{const {findLesson}=await import('./js/lessons/index.js');return findLesson(location.hash.split('/')[2]).lesson.steps[0].rh;}),expected);
 // On-screen release during a delayed unlock must not trigger an abandoned key.
 await page.evaluate(async()=>{
  const {Keyboard}=await import('./js/keyboard.js');const {piano}=await import('./js/audio.js');
  const Original=window.ResizeObserver;window.testDisconnects=0;window.ResizeObserver=class extends Original{disconnect(){window.testDisconnects++;super.disconnect();}};
  const wrap=document.createElement('div');wrap.id='test-kb';wrap.style='position:fixed;inset:0;background:white;z-index:10000';document.body.append(wrap);window.keyPresses=0;window.keyStops=0;
  window.testKb=new Keyboard(wrap,{lo:60,hi:64,onPress:()=>window.keyPresses++});piano.unlock=()=>new Promise(r=>window.resolveKeyAudio=r);piano.play=()=>({stop(){window.keyStops++;}});
 });
 const key=page.locator('#test-kb [data-midi="60"]');const box=await key.boundingBox();await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();await page.mouse.up();await page.evaluate(()=>window.resolveKeyAudio());await page.waitForTimeout(50);assert.equal(await page.evaluate(()=>window.keyPresses),0);
 await page.mouse.down();await page.evaluate(()=>window.resolveKeyAudio());await page.waitForTimeout(50);assert.equal(await page.evaluate(()=>window.keyPresses),1);await page.evaluate(()=>window.testKb.dispose());assert.equal(await page.evaluate(()=>window.keyStops),1);assert.equal(await page.evaluate(()=>window.testDisconnects),1);await page.mouse.up();
 await page.evaluate(()=>document.querySelector('#test-kb').remove());
 // Review the selected historical rhythm, not the latest generated rhythm.
 await page.evaluate(async()=>{const {recordAttempt}=await import('./js/learning.js');const {store}=await import('./js/store.js');const item=recordAttempt('advanced','rhythm-lab',3);store.data.learning[item.key].rhythm={beats:[0,1,4],description:'Earlier rhythm'};store.save();});
 await page.goto(origin+'/#/musicianship/rhythm/3');await page.waitForSelector('[data-pattern]');assert.match(await page.locator('[data-pattern]').innerText(),/Earlier rhythm/);assert.deepEqual(await page.locator('.rhythm-cells .on').allTextContents(),['1','2','1']);
 assert.deepEqual(errors,[]);console.log('Delayed demo navigation, hidden ear answers, reading Flow availability, exact review reload, pointer release during unlock, keyboard disposal and rhythm variant replay passed');
} finally { await browser.close();await new Promise(r=>server.close(r)); }
