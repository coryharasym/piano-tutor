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
  const {Keyboard}=await import('./js/keyboard.js');const set=Keyboard.prototype.setTargets;Keyboard.prototype.setTargets=function(...a){window.positionKeyboard=this;return set.apply(this,a);};
  const {piano}=await import('./js/audio.js');piano.chime=()=>{};
  location.hash='#/lesson/hand-position-shifts/0';
 });
 await page.waitForSelector('.read .fig');
 assert.match(await page.locator('.read').innerText(),/Middle C is under finger 3/);
 await page.screenshot({path:'/tmp/position-lesson.png'});
 for(const index of [1,2,3]) {
  await page.evaluate(i=>location.hash='#/lesson/hand-position-shifts/'+i,index);await page.waitForSelector('.music svg');
  const sequence=await page.evaluate(async i=>{const {findLesson}=await import('./js/lessons/index.js');const {buildPractice}=await import('./js/practice.js');const step=findLesson('hand-position-shifts').lesson.steps[i];return {notes:buildPractice(step).moments.map(m=>m.items[0].midi),reps:step.reps||1};},index);
  for(let round=0;round<sequence.reps;round++){if(round)await page.waitForTimeout(1200);await page.evaluate(notes=>notes.forEach(n=>window.positionKeyboard.onPress(n)),sequence.notes);}
  await page.waitForSelector('[data-next].ready');
 }
 await page.locator('[data-next]').click();await page.waitForSelector('.read');
 await page.locator('[data-next]').click();await page.waitForSelector('.celebrate');await page.locator('.celebrate [data-next]').click();await page.waitForFunction(()=>location.hash==='#/lesson/counting/0');
 await page.goto(origin+'/#/notes/u3');await page.waitForSelector('.notes-lesson');
 assert.match(await page.locator('.notes-pages').innerText(),/Moving your hand to a new position/);
 assert.deepEqual(errors,[]);console.log('Position lesson diagram, all three keyboard exercises/rounds, transition into Doxology and chapter notes passed');
}finally{await browser.close();await new Promise(r=>server.close(r));}
