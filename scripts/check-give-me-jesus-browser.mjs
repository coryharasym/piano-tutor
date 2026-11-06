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
 await navigate('#/');await page.waitForSelector('[data-menu]');
 await page.locator('[data-menu]').click();await page.locator('[data-course="advanced"]').click();
 await page.locator('[data-menu]').click();await page.locator('.home-menu [data-songbook]').click();
 await page.waitForSelector('.paper h1');
 await page.locator('[data-search]').fill('give me jesus');
 assert.equal(await page.locator('.paper:visible').count(),1,'Search finds hymn even from Advanced');
 assert.match(await page.locator('[data-results]').innerText(),/1 song found/);
 await page.locator('[data-level]').selectOption('advanced');assert.equal(await page.locator('.paper:visible').count(),0);
 assert.equal(await page.locator('[data-print]').isDisabled(),true);
 await page.locator('[data-level]').selectOption('');
 await page.emulateMedia({media:'print'});assert.equal(await page.locator('.paper:visible').count(),1);await page.emulateMedia({media:'screen'});
 await page.locator('[data-search]').fill('');
 const song=page.locator('.paper').filter({has:page.getByRole('heading',{name:'Give Me Jesus',exact:true})});
 assert.equal(await song.count(),1);assert.ok(await song.locator('svg').count()>1);
 await song.screenshot({path:'/tmp/give-me-jesus-full-score.png',scale:'css'});await song.scrollIntoViewIfNeeded();await page.screenshot({path:'/tmp/give-me-jesus-songbook.png',scale:'css'});
 await page.evaluate(()=>{window.print=()=>window.dispatchEvent(new Event('afterprint'));});
 const index=await song.evaluate(e=>[...e.parentElement.children].indexOf(e));
 await page.locator(`[data-one="${index}"]`).click();assert.equal(await page.locator('.paper').count(),1);assert.equal(await page.locator('.paper h1').innerText(),'Give Me Jesus');
 await page.emulateMedia({media:'print'});assert.equal(await page.locator('.paper:visible').count(),1);await page.emulateMedia({media:'screen'});
 await navigate('#/lesson/hymn-give-me-jesus/0');await page.waitForSelector('.stage .read');assert.match(await page.locator('.read').innerText(),/morning when I rise/);
 for(const step of [1,2,3]){
  await navigate(`#/lesson/hymn-give-me-jesus/${step}`);await page.waitForSelector('.music svg');
  assert.ok(await page.locator('[data-demo]').isVisible());await page.locator('[data-demo]').click();await page.waitForFunction(()=>document.querySelector('[data-demo] span')?.textContent==='Stop');await page.locator('[data-demo]').click();assert.ok(await page.locator('[data-along]').isVisible());
 }
 await page.locator('[data-save-piece]').click();
 const saved=await data();assert.ok(saved.repertoire['hymn-give-me-jesus:3']);
 await page.locator('[data-stand]').click();await page.waitForSelector('.music-stand .music svg');
 await page.screenshot({path:'/tmp/give-me-jesus-music-stand.png',scale:'css'});
 await page.locator('[data-along]').click();await page.waitForSelector('[data-loop]');
 await page.getByLabel('First bar').selectOption('10');await page.getByLabel('Last bar').selectOption('13');await page.locator('[data-loop]').click();
 await page.locator('[data-hand]').click();assert.equal(await page.locator('[data-hand]').innerText(),'Right hand');
 await page.reload();await page.waitForSelector('[data-loop]');assert.equal(await page.getByLabel('First bar').inputValue(),'10');assert.equal(await page.getByLabel('Last bar').inputValue(),'13');assert.equal(await page.locator('[data-hand]').innerText(),'Right hand');
 for(const [width,height]of [[402,874],[874,402],[874,320]]){
  await page.setViewportSize({width,height});await page.waitForTimeout(100);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
 }
 await navigate('#/pieces');const card=page.locator('.piece-card').filter({has:page.getByRole('heading',{name:'Give Me Jesus',exact:true})});assert.equal(await card.count(),1);
 await card.locator('[data-focus]').click();assert.equal((await data()).focusPieces.beginner,'hymn-give-me-jesus:3');
 await navigate('#/session');await page.locator('[data-minutes="15"]').click();assert.match(await page.locator('[data-stage="3"]').innerText(),/Give Me Jesus/);
 assert.deepEqual((await data()).done,{});assert.deepEqual(errors,[]);
 console.log('Give Me Jesus: one Songbook entry, isolated print, teaching steps, score rendering, My Pieces/focus, hand/loop persistence, three phone viewports and unchanged lesson progress passed');
}finally{await browser.close();await new Promise(r=>server.close(r));}
