import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createRequire} from 'node:module';
const root=resolve(new URL('..',import.meta.url).pathname);
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.pdf':'application/pdf','.mp3':'audio/mpeg'};
const server=createServer(async(req,res)=>{try{let path=resolve(root,'.'+new URL(req.url,'http://localhost').pathname);if(path===root)path+='/index.html';res.setHeader('Content-Type',types[extname(path)]||'application/octet-stream');res.end(await readFile(path));}catch{res.writeHead(404).end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
let chromium;try{({chromium}=await import('playwright'));}catch(e){if(!process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES)throw e;({chromium}=createRequire(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright/package.json')('playwright'));}
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE_PATH||undefined,args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:844,height:390}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
const go=async hash=>{await page.goto(origin+'/'+hash);await page.waitForTimeout(120);};
const playCurrent=()=>page.evaluate(async()=>{const {findLesson}=await import('./js/lessons/index.js');const {buildPractice}=await import('./js/practice.js');const p=location.hash.split('/');for(const m of buildPractice(findLesson(p[2]).lesson.steps[+p[3]]).moments)for(const i of m.items)window.labKeyboard.onPress(i.midi);});
try {
 await go('#/');
 await page.evaluate(async()=>{const {store}=await import('./js/store.js');store.data.done={'rh-c-position':true};store.data.last={lesson:'mary',step:1};store.save();});await page.reload();
 await page.locator('[data-menu]').click();await page.locator('[data-musicianship]').click();await page.waitForSelector('[data-lab]');assert.equal(await page.locator('[data-lab]').count(),6);
 await page.locator('[data-lab="ear"]').click();await page.waitForSelector('.read');await page.locator('[data-next]').click();await page.waitForSelector('.ear-prompt');
 await page.evaluate(async()=>{const {Keyboard}=await import('./js/keyboard.js');const set=Keyboard.prototype.setTargets;Keyboard.prototype.setTargets=function(...a){window.labKeyboard=this;return set.apply(this,a);};const {piano}=await import('./js/audio.js');piano.unlock=async()=>{};piano.play=()=>({stop(){}});piano.chime=()=>{};piano.ctx={currentTime:0};});
 await page.reload();await page.waitForSelector('.ear-prompt');
 // Capture the actual keyboard instance via a redraw, then use the hint once.
 await page.evaluate(async()=>{const {Keyboard}=await import('./js/keyboard.js');const set=Keyboard.prototype.setTargets;Keyboard.prototype.setTargets=function(...a){window.labKeyboard=this;return set.apply(this,a);};const {piano}=await import('./js/audio.js');piano.unlock=async()=>{};piano.play=()=>({stop(){}});piano.chime=()=>{};piano.ctx={currentTime:0};});
 assert.equal(await page.locator('.music svg').count(),0);
 await page.evaluate(async()=>{const {Keyboard}=await import('./js/keyboard.js');window.answerFlashes=0;const flash=Keyboard.prototype.flash;Keyboard.prototype.flash=function(...a){if(a[1]==='press')window.answerFlashes++;return flash.apply(this,a);};});
 await page.locator('[data-demo]').click();await page.waitForTimeout(350);assert.equal(await page.evaluate(()=>window.answerFlashes),0,'Ear listening must not reveal answer keys');await page.locator('[data-demo]').click();
 await page.locator('[data-hint]').click();await page.waitForSelector('.music svg');await playCurrent();
 assert.equal(await page.evaluate(async()=>Object.values((await import('./js/store.js')).store.data.learning)[0].assisted),1);
 await page.locator('[data-confidence="work"]').click();
 await go('#/musicianship');await page.locator('[data-lab="sight"]').click();await page.locator('[data-next]').click();await page.waitForSelector('.music svg');
 const before=await page.evaluate(async()=>{const {findLesson}=await import('./js/lessons/index.js');return findLesson('lab-sight').lesson.steps[1].rh;});
 await page.reload();await page.waitForSelector('.music svg');assert.equal(await page.evaluate(async()=>{const {findLesson}=await import('./js/lessons/index.js');return findLesson('lab-sight').lesson.steps[1].rh;}),before);
 await page.evaluate(async()=>{const {Keyboard}=await import('./js/keyboard.js');const set=Keyboard.prototype.setTargets;Keyboard.prototype.setTargets=function(...a){window.labKeyboard=this;return set.apply(this,a);};const {piano}=await import('./js/audio.js');piano.chime=()=>{};});
 await page.evaluate(()=>location.hash='#/lesson/lab-sight/0');await page.waitForSelector('.read');await page.locator('[data-next]').click();await page.waitForSelector('.music svg');await playCurrent();
 assert.equal(await page.evaluate(async()=>Object.values((await import('./js/store.js')).store.data.learning).find(x=>x.lesson==='lab-sight').independent),1);
 await page.locator('[data-confidence="comfortable"]').click();
 await go('#/musicianship/hymn');assert.equal(await page.locator('[data-hymn]').count(),6);await page.locator('[data-hymn="2"]').click();await page.waitForSelector('.read');
 await go('#/musicianship/record');
 await page.evaluate(()=>{
  window.trackStops=0;Object.defineProperty(navigator,'mediaDevices',{configurable:true,value:{getUserMedia:async()=>({getTracks:()=>[{stop:()=>window.trackStops++}]})}});
  window.MediaRecorder=class {static isTypeSupported(){return true;}constructor(){this.state='inactive';this.mimeType='audio/mp4';}start(){this.state='recording';}stop(){this.state='inactive';this.ondataavailable({data:new Blob(['audio'],{type:this.mimeType})});this.onstop();}};
 });
 await page.locator('[data-record]').click();await page.waitForFunction(()=>document.querySelector('[data-record-status]').textContent.includes('Recording…'));await page.locator('[data-stop-record]').click();await page.waitForSelector('[data-take] audio');assert.equal(await page.locator('[data-take] a').getAttribute('download'),'piano-practice.m4a');assert.equal(await page.evaluate(()=>window.trackStops),1);
 await page.evaluate(()=>navigator.mediaDevices.getUserMedia=()=>new Promise(r=>window.resolveMic=r));await page.locator('[data-record]').click();await page.locator('[data-back]').click();await page.waitForSelector('[data-lab]');await page.evaluate(()=>window.resolveMic({getTracks:()=>[{stop:()=>window.trackStops++}]}));await page.waitForTimeout(100);assert.equal(await page.evaluate(()=>window.trackStops),2,'Late permission releases its microphone');
 await go('#/musicianship/rhythm');await page.evaluate(async()=>{const {piano}=await import('./js/audio.js');piano.unlock=async()=>{};piano.play=()=>({stop(){}});piano.ctx={currentTime:0};});
 await page.clock.install();await page.clock.pauseAt(new Date(Date.now()+1000));
 await page.locator('[data-start]').click();await page.clock.runFor(4100);
 for(let i=0;i<16;i++){await page.locator('[data-tap]').click();await page.clock.runFor(1000);}
 await page.clock.runFor(400);assert.match(await page.locator('[data-status]').innerText(),/16 of 16 starts matched/);
 await page.locator('[data-back]').click();await page.waitForSelector('[data-lab]');await page.locator('[data-lab="review"]').click();await page.waitForSelector('.lab-reviews');assert.match(await page.locator('.lab-reviews').innerText(),/Listen and Copy/);
 const state=await page.evaluate(()=>JSON.parse(localStorage.getItem('piano-tutor:v1')));assert.deepEqual(state.done,{'rh-c-position':true});assert.deepEqual(state.last,{lesson:'mary',step:1});
 await page.clock.resume();
 for(const [width,height] of [[402,874],[874,402],[874,320]]) {
  await page.setViewportSize({width,height});
  for(const route of ['','#/musicianship/rhythm','#/musicianship/hymn','#/musicianship/record','#/musicianship/review']) {
   await go(route||'#/musicianship');assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'No page overflow: '+route);
  }
 }
 await go('#/musicianship');await page.screenshot({path:'/tmp/piano-musicianship-landscape.png',fullPage:true});
 await page.setViewportSize({width:402,height:874});await page.screenshot({path:'/tmp/piano-musicianship-portrait.png',fullPage:true});
 assert.deepEqual(errors,[]);console.log('Musicianship navigation, hidden ear answers, assisted records, fresh-reading reload, hymn path, recorder export/permission cleanup, rhythm timing and progress isolation passed');
}finally{await browser.close();await new Promise(r=>server.close(r));}
