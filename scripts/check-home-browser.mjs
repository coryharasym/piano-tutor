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
 await page.evaluate(async()=>{
  const {store}=await import('./js/store.js');const {UNITS,nextLesson}=await import('./js/lessons/index.js');
  const lessons=UNITS.filter(u=>u.course==='beginner').flatMap(u=>u.lessons);
  store.data.done={...Object.fromEntries(lessons.slice(0,21).map(l=>[l.id,true])),'treble-reading':true};
  const next=nextLesson(store.data.done,null,'beginner');store.setLast(next.id,0);
 });await page.reload();
 const initial=await data();
 for(const [width,height]of [[320,740],[402,874],[874,402],[874,320],[1280,800]]){
  await page.setViewportSize({width,height});await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(120);
  assert.equal(await page.locator('.head-actions button').count(),2,'Header should only contain microphone and Menu');
  assert.equal(await page.locator('.session-launch').count(),0,'Large practice banner should be removed');
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  const box=await page.locator('.continue-card').boundingBox(),session=await page.locator('[data-session]').boundingBox();
  if(width>600){assert.ok(Math.abs(box.y-session.y)<2,'Primary actions must be adjacent '+JSON.stringify({width,height,box,session}));assert.ok(session.x>box.x);}
  if(height<=402&&width===874){assert.ok(box.y+box.height<=height-21,'Continue lesson must be immediately visible');assert.ok(session.y+session.height<=height-21);}
  await page.locator('[data-menu]').click();await page.waitForSelector('.home-menu');
  assert.equal(await page.locator('[data-menu]').getAttribute('aria-expanded'),'true');
  assert.ok(await page.locator('#app').evaluate(e=>e.inert));
  assert.equal(await page.locator('.home-menu-groups section').count(),3);
  assert.equal(await page.locator('[data-daily]').isEnabled(),true);
  const modal=await page.locator('.home-menu .sheet').boundingBox();assert.ok(modal.x>=0&&modal.x+modal.width<=width+1);
  if(width===874&&height===402){await page.waitForTimeout(400);await page.screenshot({path:'/tmp/piano-home-menu-final.png',scale:'css'});}
  await page.keyboard.press('Escape');await page.waitForSelector('.home-menu',{state:'detached'});
  assert.equal(await page.locator('[data-menu]').getAttribute('aria-expanded'),'false');
  assert.ok(await page.locator('[data-menu]').evaluate(e=>e===document.activeElement));
 }
 await page.setViewportSize({width:874,height:402});await page.screenshot({path:'/tmp/piano-home-final.png',scale:'css'});
 const paths=[['data-songbook','#/songbook'],['data-notes','#/notes/all'],['data-technique','#/technique'],['data-free','#/free'],['data-metronome','#/metronome'],['data-drill','#/lesson/drill/0'],['data-daily','#/lesson/daily/0']];
 for(const [attribute,hash]of paths){
  await navigate('#/');await page.locator('[data-menu]').click();await page.locator(`.home-menu [${attribute}]`).click();
  await page.waitForFunction(hash=>location.hash===hash,hash);assert.equal(await page.locator('.home-menu').count(),0);
  if(attribute==='data-daily')assert.match(await page.locator('.top-title').innerText(),/Daily review/);
 }
 await navigate('#/');await page.locator('[data-menu]').click();await page.locator('[data-settings]').click();
 assert.equal(await page.locator('.home-menu').count(),0);await page.waitForSelector('.sheet[aria-label="Settings"]');
 await page.locator('[data-close]').click();assert.equal(await page.locator('[data-menu]').getAttribute('aria-expanded'),'false');
 const final=await data();assert.deepEqual(final.done,initial.done);assert.deepEqual(final.practice,initial.practice);
 // Course and menu availability follow each level; first-time learners keep locked review/drills.
 await page.evaluate(async()=>{const {store}=await import('./js/store.js');store.reset();});await page.reload();
 await page.locator('[data-menu]').click();assert.equal(await page.locator('[data-daily]').isDisabled(),true);assert.equal(await page.locator('[data-drill]').isDisabled(),true);
 await page.locator('[data-close]').click();
 await page.locator('[data-course="advanced"]').click();await page.locator('[data-menu]').click();
 assert.equal(await page.locator('[data-drill]').isEnabled(),true);assert.equal(await page.locator('[data-daily]').isDisabled(),true);
 assert.deepEqual(errors,[]);console.log('Compact home at five viewports, visible primary actions, grouped menu routes, focus/Escape/background lock, readiness gates and progress preservation passed');
}finally{await browser.close();await new Promise(r=>server.close(r));}
