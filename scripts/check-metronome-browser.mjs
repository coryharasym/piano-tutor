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
 const result=await page.evaluate(async()=>{
  const {piano}=await import('./js/audio.js');const {mountMetronome}=await import('./js/metronome.js');
  let release,calls=0;piano.unlock=()=>new Promise(r=>release=r);piano.ctx={currentTime:0};piano.click=()=>calls++;
  const root=document.createElement('div');document.body.appendChild(root);
  let dispose=mountMetronome(root,{onBack(){}});
  root.querySelector('[data-go]').click();dispose();release();await new Promise(r=>setTimeout(r,100));
  const afterLeave=calls;
  dispose=mountMetronome(root,{onBack(){}});
  root.querySelector('[data-go]').click();root.querySelector('[data-go]').click();release();await new Promise(r=>setTimeout(r,100));
  const afterStop=calls;
  piano.unlock=async()=>{};root.querySelector('[data-go]').click();await new Promise(r=>setTimeout(r,100));
  const afterStart=calls;dispose();root.remove();return {afterLeave,afterStop,afterStart};
 });
 assert.equal(result.afterLeave,0,'Leaving while audio unlocks must cancel start');
 assert.equal(result.afterStop,0,'Stop must cancel pending audio startup');
 assert.ok(result.afterStart>0,'Normal start still clicks');assert.deepEqual(errors,[]);
 console.log('Metronome pending startup cancellation, rapid Start/Stop and ordinary playback passed');
}finally{await browser.close();await new Promise(r=>server.close(r));}
