// Real browser course/navigation regression checks. Audio hardware is not simulated.
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createRequire} from 'node:module';

const root=resolve(new URL('..',import.meta.url).pathname);
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.pdf':'application/pdf','.mp3':'audio/mpeg'};
const server=createServer(async(req,res)=>{try{let path=resolve(root,'.'+new URL(req.url,'http://localhost').pathname);if(path===root)path+='/index.html';res.setHeader('Content-Type',types[extname(path)]||'application/octet-stream');res.end(await readFile(path));}catch{res.writeHead(404).end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const origin='http://127.0.0.1:'+server.address().port;
let chromium;
try{({chromium}=await import('playwright'));}catch(e){if(!process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES)throw e;({chromium}=createRequire(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright/package.json')('playwright'));}
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE_PATH||undefined,args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:844,height:390}}),errors=[];
page.on('pageerror',e=>errors.push(e.message));

const goLesson=async(id,i,title)=>{
 await page.goto(`${origin}/#/lesson/${id}/${i}`);
 await page.waitForFunction(({title,i})=>document.querySelector('.top-title>span:last-child')?.textContent===title&&document.querySelectorAll('.dots i')[i]?.classList.contains('now'),{title,i});
};
try {
 await page.goto(origin+'/');let screens=0;
 const {INTERMEDIATE_UNITS,ADVANCED_UNITS}=await import('../js/lessons/index.js');
 for(const u of [...INTERMEDIATE_UNITS,...ADVANCED_UNITS]) {
  const l=u.lessons.at(-1),p=l.choices[1],title='Recital: '+p.title;
  await goLesson(l.id,0,l.title);assert.equal(await page.locator('.choice').count(),2);
  await page.locator('.choice').nth(1).click();
  await page.waitForFunction(t=>document.querySelector('.top-title>span:last-child')?.textContent===t,title);
  assert.equal(await page.evaluate(unit=>JSON.parse(localStorage.getItem('piano-tutor:v1')).recitals[unit],u.id),p.id);
  await page.reload();await page.waitForSelector('.stage');assert.equal(await page.locator('.top-title>span:last-child').innerText(),title);
  await goLesson(l.id,0,title);assert.equal(await page.locator('.choice.on .title').innerText(),p.title);
  if(u.id==='i5'||u.id==='a7')await page.screenshot({path:'/tmp/recital-choices-'+u.id+'.png'});
  for(let i=1;i<=p.recitalSteps.length;i++){
   await goLesson(l.id,i,title);
   if(p.recitalSteps[i-1].t==='play')assert.ok(await page.locator('.music svg').count(),p.id+' '+i+' missing staff');
   screens++;
  }
  await page.locator('[data-next]').click();assert.equal(await page.locator('.celebrate').count(),0,'An unplayed alternative finished');
  await page.locator('[data-print]').click();await page.waitForSelector('.paper svg');assert.ok(await page.locator('.paper svg').count());
 }
 // Simulate a previously completed original programme, then actually play the
 // last alternative piece: its other pieces must still be required.
 await page.evaluate(async()=>{
  const {Keyboard}=await import('./js/keyboard.js');const bind=Keyboard.prototype.bindInput;
  Keyboard.prototype.bindInput=function(){bind.call(this);window.testKeyboard=this;};
  const {piano}=await import('./js/audio.js');piano.play=()=>({stop(){}});piano.chime=()=>{};
 });
 const u=ADVANCED_UNITS.at(-1),l=u.lessons.at(-1),alt=l.choices[1],title='Recital: '+alt.title;
 await page.evaluate(async()=>{
  const {store}=await import('./js/store.js');store.data.recitalRuns={'adv-recital-a8:adv-hymn-a8':[5,6,7]};store.save();
 });
 const finals=alt.recitalSteps.map((s,i)=>s.final?i+1:null).filter(i=>i!==null);
 const perform=async i=>{
  await goLesson(l.id,i,title);
  await page.evaluate(async({id,i})=>{const {findLesson}=await import('./js/lessons/index.js');const {buildPractice}=await import('./js/practice.js');for(const m of buildPractice(findLesson(id).lesson.steps[i]).moments)for(const it of m.items)window.testKeyboard.onPress(it.midi,'tap');},{id:l.id,i});
  await page.waitForSelector('[data-next].ready');
 };
 await perform(finals.at(-1));await page.locator('[data-next]').click();assert.equal(await page.locator('.celebrate').count(),0);assert.match(await page.locator('.toast').innerText(),/every performance/);
 for(const i of finals.slice(0,-1)){await perform(i);await page.locator('[data-next]').click();}
 await perform(finals.at(-1));await page.locator('[data-next]').click();await page.waitForSelector('.celebrate');
 assert.ok(await page.evaluate(()=>JSON.parse(localStorage.getItem('piano-tutor:v1')).done['adv-recital-a8']));
 await page.goto(origin+'/#/notes/intermediate');await page.waitForSelector('.notes-chapter');assert.equal(await page.locator('.notes-lesson').count(),72);
 await page.goto(origin+'/#/notes/advanced');await page.waitForSelector('.notes-bar h1:text("Advanced course notes")');assert.equal(await page.locator('.notes-lesson').count(),72);
 assert.deepEqual(errors,[]);console.log('All 16 selectors, 16 persisted alternate choices, '+screens+' alternate screens, printing, independent recital completion and both-option PDF coverage passed');
}finally{await browser.close();await new Promise(r=>server.close(r));}
