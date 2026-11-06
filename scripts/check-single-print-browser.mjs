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
const navigate=async hash=>{await page.goto(origin+'/'+hash);await page.waitForTimeout(120);};
const data=()=>page.evaluate(async()=>structuredClone((await import('./js/store.js')).store.data));
try{
 await page.setViewportSize({width:874,height:402});
 await navigate('#/');
 const originalTitle=await page.title();
 for(const course of ['beginner','intermediate','advanced']){
  await page.evaluate(async course=>{const {store}=await import('./js/store.js');store.setting('course',course);},course);
  await navigate('#/songbook');await page.waitForSelector('.paper svg');
  const total=await page.locator('.paper').count();assert.ok(total>20);
  await page.evaluate(()=>{
   window.printCalls=[];
   window.print=()=>{
    window.dispatchEvent(new Event('beforeprint'));
    window.printCalls.push({pages:document.querySelectorAll('.paper').length,title:document.title});
    // Reproduce early and delayed mobile print lifecycle events.
    window.dispatchEvent(new Event('afterprint'));
    setTimeout(()=>window.dispatchEvent(new Event('afterprint')),20);
   };
  });
  const selectedTitle=await page.locator('.paper h1').nth(1).innerText();
  await page.locator('[data-one="1"]').click();await page.waitForTimeout(50);
  assert.equal(await page.locator('.paper').count(),1,'Only selected score may remain in the live document');
  assert.equal(await page.locator('.paper h1').innerText(),selectedTitle);
  assert.equal(await page.locator('.contents').count(),0);
  assert.match(await page.locator('[data-print]').innerText(),/^Print$/);
  assert.equal((await page.evaluate(()=>window.printCalls)).length,0,'Opening a song preview must not automatically print');
  await page.locator('[data-print]').click();
  assert.equal((await page.evaluate(()=>window.printCalls))[0].pages,1);
  await page.emulateMedia({media:'print'});assert.equal(await page.locator('.paper:visible').count(),1);
  if(course==='beginner')await page.pdf({path:'/tmp/piano-single-song.pdf',preferCSSPageSize:true,printBackground:true});
  await page.locator('[data-print]').evaluate(e=>e.click());
  assert.ok((await page.evaluate(()=>window.printCalls)).every(p=>p.pages===1));
  await page.emulateMedia({media:'screen'});
  await page.getByRole('button',{name:'Back to songbook',exact:true}).click();
  assert.equal(await page.locator('.paper').count(),total);assert.equal(await page.title(),'Piano Tutor songbook');
  assert.equal(await page.evaluate(()=>location.hash),'#/songbook');
  await page.locator('[data-print]').click();assert.equal((await page.evaluate(()=>window.printCalls)).at(-1).pages,total);
  const differentTitle=await page.locator('.paper h1').nth(2).innerText();
  await page.locator('[data-one="2"]').click();await page.evaluate(()=>window.dispatchEvent(new Event('afterprint')));
  assert.equal(await page.locator('.paper').count(),1);assert.equal(await page.locator('.paper h1').innerText(),differentTitle);
  if(course==='beginner')await page.screenshot({path:'/tmp/piano-single-song-print.png',scale:'css'});
  await navigate('#/');assert.equal(await page.title(),originalTitle);
 }
 // Direct lesson score previews still contain one score and return to their lesson.
 const ref=await page.evaluate(async()=>{const {songbook}=await import('./js/print.js');const p=songbook('beginner')[0];return {id:p.lesson.id,step:p.stepIndex};});
 await navigate(`#/print/${ref.id}/${ref.step}`);await page.waitForSelector('.paper svg');assert.equal(await page.locator('.paper').count(),1);
 await page.locator('[data-back]').click();await page.waitForFunction(ref=>location.hash===`#/lesson/${ref.id}/${ref.step}`,ref);
 assert.deepEqual(errors,[]);console.log('Single-song print isolation across all courses, early/delayed afterprint, print media, repeat printing, full-book restore/printing, titles and direct lesson previews passed');
}finally{await browser.close();await new Promise(r=>server.close(r));}
