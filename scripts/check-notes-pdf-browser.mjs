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
try {
 for(const id of ['u1','u3','all','intermediate','advanced','library']) {
  await page.goto(origin+'/#/notes/'+id);await page.waitForSelector('.notes-bar');
  assert.equal(await page.locator('[data-print]').count(),0,'Notes must not call web-page printing');
  assert.match(await page.locator('.notes-help').innerText(),/Share → Print/);
  const links=await page.locator('.notes-bar a').evaluateAll(as=>as.map(a=>({href:a.href,target:a.target,download:a.hasAttribute('download')})));
  assert.equal(links.length,id==='library'?3:2);
  for(const link of links){const response=await page.request.get(link.href);assert.equal(response.status(),200);assert.equal((await response.body()).subarray(0,5).toString(),'%PDF-');}
  if(id!=='library') {
   assert.equal(links[1].target,'_blank');assert.equal(links[1].download,false);
   await page.evaluate(()=>{window.chapterPrintCalls=0;window.print=()=>window.chapterPrintCalls++;document.addEventListener('click',e=>{if(e.target.closest('[data-print-pdf]')){e.preventDefault();window.chapterLinkGesture=e.isTrusted;}});});
   await page.locator('[data-print-pdf]').click();assert.equal(await page.evaluate(()=>window.chapterPrintCalls),0);assert.equal(await page.evaluate(()=>window.chapterLinkGesture),true);
  }
 }
 await page.goto(origin+'/#/notes/u1');
 for(const [width,height]of [[402,874],[874,402],[874,320]]){await page.setViewportSize({width,height});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));assert.ok(await page.locator('[data-print-pdf]').isVisible());}
 assert.deepEqual(errors,[]);console.log('Chapter/course/library PDF links, no automatic print calls, direct user gesture, valid PDF responses and mobile layout passed');
}finally{await browser.close();await new Promise(r=>server.close(r));}
