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
const emit=notes=>page.evaluate(async notes=>{const {listener}=await import('./js/listen.js');for(const m of notes)for(const fn of listener.onNote)fn(m);},notes);
const release=async()=>{await page.evaluate(async()=>{const {listener}=await import('./js/listen.js');for(const fn of listener.onLevel)fn(0);});await page.waitForTimeout(100);await page.evaluate(async()=>{const {listener}=await import('./js/listen.js');for(const fn of listener.onLevel)fn(0);});};
const pair=async(a,b)=>{await emit([a]);await release();await emit([b]);};
const readout=page.locator('.chord-readout');
const assist=page.locator('[data-chord-assist]');
try {
  await page.goto(origin);
  await page.evaluate(async()=>{
    const {store}=await import('./js/store.js');store.data.done={welcome:true};store.setting('playSpeed',1.5);store.save();
    const {addLesson}=await import('./js/lessons/index.js');
    addLesson({id:'practice',title:'Microphone practice'},{id:'chord-check',title:'Chord practice',steps:[{t:'play',title:'Chords',say:'Play both hands together.',timed:'chord-check-time',rh:'E4/q/3 E4/q/3 D4/h/2',lh:'C3/q/5 C3/q/5 G3/h/1',tempo:160,song:true,names:true,keyLabels:'all',range:['C3','G4']}]});
    addLesson({id:'practice',title:'Microphone practice'},{id:'octave-check',title:'Octave practice',steps:[{t:'play',title:'Octaves',say:'Play both Cs together.',rh:'C4/w/1',lh:'C3/w/5',tempo:160,song:true,names:true,keyLabels:'all',range:['C3','G4']}]});
    const {piano}=await import('./js/audio.js');piano.play=()=>({stop(){}});piano.chime=()=>{};
    const {listener}=await import('./js/listen.js');listener.active=true;listener.muteUntil=0;
    listener.chordHeard=function(midis){this.chordStatus={detected:[midis[0]],audible:true};return false;};
  });
  await page.evaluate(()=>location.hash='#/lesson/chord-check/0');
  await page.waitForFunction(()=>document.querySelector('.chord-readout')?.textContent.includes('waiting for'));
  await pair(48,64);assert.equal(await page.locator('.chip.done').count(),0,'ordinary mic guesses cannot pass a chord');
  await assist.waitFor({state:'visible',timeout:7000});
  await assist.click();await emit([64]);assert.match(await readout.innerText(),/Play C3 next/);
  await emit([48]);assert.match(await readout.innerText(),/Release the key/);await release();assert.match(await readout.innerText(),/Play E4 next/);
  await emit([64]);assert.equal(await page.locator('.chip.done').count(),1,'explicit assistance advances one moment');
  await page.waitForFunction(()=>document.querySelector('.chord-readout')?.textContent.startsWith('Hearing'));
  assert.equal(await assist.isVisible(),false,'repeated chord starts a fresh attempt');
  await assist.waitFor({state:'visible',timeout:7000});await assist.click();await pair(48,64);
  await page.waitForFunction(()=>document.querySelector('.chord-readout')?.textContent.includes('G3'));
  await assist.waitFor({state:'visible',timeout:7000});await assist.click();await pair(55,62);
  assert.match(await page.locator('.feedback').innerText(),/separate-note assistance/);
  assert.equal(await page.evaluate(async()=>{const {store}=await import('./js/store.js');return store.data.best?.['chord-check-time'];}),undefined,'assisted practice cannot set a speed record');

  await page.evaluate(()=>location.hash='#/play/chord-check/0');
  await readout.waitFor({state:'visible'});await assist.waitFor({state:'visible',timeout:8000});
  for(const [width,height] of [[844,390],[667,375],[390,844],[1280,800]]) {
    await page.setViewportSize({width,height});
    const boxes=await page.evaluate(()=>Object.fromEntries(['.chord-coach','.fall-wrap','.kb-wrap','[data-chord-assist]'].map(s=>[s,document.querySelector(s).getBoundingClientRect().toJSON()])));
    assert.ok(boxes['.fall-wrap'].height>35,'falling-note frame collapsed');
    for(const b of Object.values(boxes))assert.ok(b.x>=-1&&b.right<=width+1&&b.y>=-1&&b.bottom<=height+1,`control outside ${width}x${height}: ${JSON.stringify(boxes)}`);
    assert.ok(boxes['.chord-coach'].bottom<=boxes['.fall-wrap'].y+1,'diagnostics overlap falling notes');
  }
  await page.setViewportSize({width:844,height:390});
  await page.screenshot({path:'/tmp/chord-wait-phone.png'});
  await assist.click();await pair(48,64);
  await page.waitForFunction(()=>document.querySelector('.score')?.textContent==='2 of 6');
  await assist.waitFor({state:'visible',timeout:7000});await assist.click();await pair(48,64);
  await assist.waitFor({state:'visible',timeout:7000});await assist.click();await pair(55,62);
  await page.waitForSelector('.fall-msg.show');
  assert.match(await page.locator('.fall-msg').innerText(),/separate-note assistance on 3 chords/);
  assert.match(await page.locator('.fall-msg h2').innerText(),/Practice complete/);

  // Flow has diagnostic feedback but no separate-note bypass.
  await page.locator('[data-mode] [data-v="flow"]').click();
  await page.waitForFunction(()=>document.querySelector('.chord-coach')?.hidden===false);
  assert.equal(await assist.isVisible(),false);
  await pair(48,64);assert.equal(await assist.isVisible(),false);
  await page.locator('[data-pause]').click();
  await page.waitForFunction(()=>document.querySelector('.chord-coach')?.hidden===true);
  await page.evaluate(async()=>{const {store}=await import('./js/store.js');store.setting('playMode','wait');location.hash='#/play/octave-check/0';});
  await assist.waitFor({state:'visible',timeout:8000});
  assert.equal(await page.locator('.mic-chord-help').isVisible(),true);
  for(const [width,height] of [[667,375],[844,390]]) {
    await page.setViewportSize({width,height});
    assert.ok(await page.locator('.fall-wrap').evaluate(el=>el.clientHeight>35),'octave help collapsed the play area');
    assert.ok(await page.locator('.kb-wrap').evaluate(el=>el.getBoundingClientRect().bottom<=innerHeight+1),'octave help pushed keyboard off screen');
  }
  await page.screenshot({path:'/tmp/chord-octave-phone.png'});
  await page.evaluate(async()=>{const {listener}=await import('./js/listen.js');listener.active=false;});
  await page.waitForFunction(()=>document.querySelector('.chord-coach')?.hidden===true);
  assert.deepEqual(errors,[]);
  console.log('Lesson and Wait assistance, note order, repeated chords, honest completion, Flow/pause guards and four viewport layouts passed');
} finally { await browser.close();await new Promise(r=>server.close(r)); }
