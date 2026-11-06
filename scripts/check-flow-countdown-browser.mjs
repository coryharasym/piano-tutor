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
    const {store}=await import('./js/store.js');store.data.done={welcome:true};store.setting('playMode','flow');store.setting('playSpeed',1.5);store.save();
    const {addLesson}=await import('./js/lessons/index.js');
    addLesson({id:'practice',title:'Practice'},{id:'countdown-check',title:'Flow preparation',steps:[{t:'play',title:'Flow preparation',rh:'C4/w D4/w',tempo:160,song:true,range:['C3','G4']}]});
    const {piano}=await import('./js/audio.js');piano.play=()=>({stop(){}});piano.chime=()=>{};
    location.hash='#/play/countdown-check/0';
  });
  const countdown=page.locator('.flow-countdown');
  await countdown.waitFor({state:'visible'});
  assert.match(await countdown.innerText(),/Flow starts in/);
  await page.locator('[data-pause]').click();
  const value=await page.locator('[data-countdown-seconds]').innerText();
  await page.waitForTimeout(1100);assert.equal(await page.locator('[data-countdown-seconds]').innerText(),value);
  for(const [width,height] of [[874,402],[402,874],[667,375],[1280,800]]) {
    await page.setViewportSize({width,height});
    for(const stand of [false,true]) {
      const active=await page.locator('[data-stand]').getAttribute('aria-pressed')==='true';
      if(active!==stand)await page.locator('[data-stand]').click();
      const b=await countdown.boundingBox();
      assert.ok(b.x>=0&&b.y>=0&&b.x+b.width<=width&&b.y+b.height<=height,'countdown fits viewport');
      assert.ok(await page.locator('[data-countdown-seconds]').evaluate(el=>parseFloat(getComputedStyle(el).fontSize)>=60),'countdown is prominent');
      assert.equal(await countdown.isVisible(),true,'visible in both score views');
    }
  }
  await page.setViewportSize({width:874,height:402});
  await page.locator('[data-restart]').click();
  assert.equal(await page.locator('[data-countdown-seconds]').innerText(),'10');
  await page.screenshot({path:'/tmp/flow-countdown-landscape.png'});
  await page.waitForTimeout(9000);assert.equal(await countdown.isVisible(),true,'nine seconds is too early');
  await countdown.waitFor({state:'hidden',timeout:2500});
  await page.locator('[data-again]').waitFor({state:'visible',timeout:6000});
  await page.locator('[data-again]').click();assert.equal(await countdown.isVisible(),true,'Play again must prepare with ten seconds');
  assert.equal(await page.locator('[data-countdown-seconds]').innerText(),'10');
  await page.locator('[data-restart]').click();assert.equal(await countdown.isVisible(),true);
  await page.locator('[data-mode] [data-v="wait"]').click();assert.equal(await countdown.isVisible(),false,'Wait keeps its usual count-in');
  assert.deepEqual(errors,[]);
  console.log('Flow countdown: ten seconds, pause, restart, Wait isolation and prominent overlay in both views at four sizes passed');
} finally { await browser.close();await new Promise(r=>server.close(r)); }
