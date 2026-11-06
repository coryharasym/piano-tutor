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
  const {store}=await import('./js/store.js');store.data.done={welcome:true};store.setting('easyChords',true);store.setting('playMode','wait');store.save();
  const {addLesson}=await import('./js/lessons/index.js');
  addLesson({id:'practice',title:'Practice'},{id:'spectrum-check',title:'D and G',steps:[{t:'play',title:'D and G',rh:'D4/w',lh:'G3/w',song:true,tempo:160,range:['C3','G4']}]});
  const {listener}=await import('./js/listen.js');listener.active=true;listener.muteUntil=0;
  // No monophonic onNote event: exercise the controller's spectrum-only path.
  listener.chordHeard=function(midis,options){return options?.easy===true&&!options.strict;};
  const {piano}=await import('./js/audio.js');piano.chime=()=>{};piano.play=()=>({stop(){}});
  location.hash='#/lesson/spectrum-check/0';
 });
 await page.waitForFunction(()=>document.querySelector('.feedback')?.textContent.includes('chord assistance'));
 await page.evaluate(()=>location.hash='#/play/spectrum-check/0');
 await page.waitForSelector('.fall-msg.show');
 assert.match(await page.locator('.fall-msg').innerText(),/chord assistance/);
 assert.deepEqual(errors,[]);
 console.log('Lesson and Wait advance from spectrum-only Easy chord evidence without a single-note event');
} finally {await browser.close();await new Promise(r=>server.close(r));}
