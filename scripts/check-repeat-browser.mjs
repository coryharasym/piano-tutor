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
const play=()=>page.evaluate(()=>{window.repeatKeyboard.onPress(60);window.repeatKeyboard.onPress(62);});
const finish=async()=>{await play();await page.waitForTimeout(1200);await play();await page.waitForFunction(()=>document.querySelector('.feedback')?.textContent.includes('Well played'));};
try {
 await page.goto(origin);
 await page.evaluate(async()=>{
  const {addLesson}=await import('./js/lessons/index.js');addLesson({id:'practice',title:'Practice'},{id:'repeat-check',title:'Repeat check',steps:[{t:'play',title:'Repeat check',rh:'C4/q D4/q',reps:2,range:['C4','G4']}]});
  const {piano}=await import('./js/audio.js');piano.chime=()=>{};
  const {Keyboard}=await import('./js/keyboard.js');const set=Keyboard.prototype.setTargets;Keyboard.prototype.setTargets=function(...args){window.repeatKeyboard=this;return set.apply(this,args);};
  location.hash='#/lesson/repeat-check/0';
 });
 await page.waitForSelector('[data-repeat]');
 assert.equal(await page.locator('[data-repeat]').getAttribute('aria-pressed'),'false');
 await page.locator('[data-repeat]').click();assert.match(await page.locator('[data-repeat]').innerText(),/Repeat on/);
 await finish();await page.waitForTimeout(1500);
 assert.match(await page.locator('.reps').innerText(),/Round 1 of 2/);assert.equal(await page.locator('.feedback').innerText(),'');
 await page.locator('[data-repeat]').click();await finish();await page.waitForTimeout(1600);
 assert.match(await page.locator('.feedback').innerText(),/Well played/,'Off leaves completion visible');
 await page.locator('[data-repeat]').click();await page.locator('.again').click();assert.equal(await page.locator('[data-repeat]').getAttribute('aria-pressed'),'false','Play again selects a single retry');assert.match(await page.locator('.reps').innerText(),/Round 1/);
 await finish();await page.waitForTimeout(1600);assert.match(await page.locator('.feedback').innerText(),/Well played/,'Manual replay does not turn auto-repeat on');
 await page.locator('[data-repeat]').click();await page.locator('[data-practice-pause]').click();await page.waitForTimeout(1600);
 assert.match(await page.locator('.feedback').innerText(),/Well played/,'Pause cancels automatic restart');
 await page.locator('[data-practice-pause]').click();await page.waitForTimeout(1500);assert.equal(await page.locator('.feedback').innerText(),'');
 // A restart during the between-round delay must cancel the old callback.
 await play();await page.locator('.practice-personal-tools summary').click();await page.locator('[data-restart]').click();await play();await page.waitForTimeout(1200);
 assert.match(await page.locator('.reps').innerText(),/Round 2/);
 await page.evaluate(()=>location.hash='#/');await page.waitForTimeout(1600);assert.ok(await page.locator('.home').count());
 assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('piano-tutor:v1')).settings.autoRepeat),true);
 assert.deepEqual(errors,[]);console.log('Auto-repeat after all rounds, toggle/off/manual replay, pause/resume, reset timer cancellation, navigation and saved setting passed');
}finally{await browser.close();await new Promise(r=>server.close(r));}
