// Real browser course/navigation regression checks. Audio hardware is not simulated.
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createRequire} from 'node:module';
import {ADVANCED_UNITS,findLesson} from '../js/lessons/index.js';
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
const goLesson=async(id,i)=>{
 const title=findLesson(id).lesson.title;
 await page.goto(`${origin}/#/lesson/${id}/${i}`);
 await page.waitForFunction(({title,i})=>document.querySelector('.top-title>span:last-child')?.textContent===title&&document.querySelectorAll('.dots i')[i]?.classList.contains('now'),{title,i});
};
try {
 await page.goto(origin+'/');
 assert.equal(await page.locator('[data-course]').count(),3);
 await page.getByRole('button',{name:'Advanced',exact:true}).click();
 assert.equal(await page.locator('.unit:not(.hymns)').count(),8);
 assert.equal(await page.locator('[data-course="advanced"]').getAttribute('aria-pressed'),'true');
 await page.reload();assert.equal(await page.locator('[data-course="advanced"]').getAttribute('aria-pressed'),'true');
 for(const [width,height]of [[390,844],[844,390],[1280,800]]){
  await page.setViewportSize({width,height});
  for(const control of await page.locator('.head-actions button,[data-course]').all()) {const b=await control.boundingBox();assert.ok(b&&b.x>=0&&b.x+b.width<=width+1,'Home control outside viewport');assert.ok(await control.evaluate(el=>el.scrollWidth<=el.clientWidth+1),'Home control label overflows its button');}
 }
 await page.setViewportSize({width:844,height:390});await page.screenshot({path:'/tmp/advanced-home.png'});
 let screens=0;
 for(const u of ADVANCED_UNITS)for(const l of u.lessons)for(let i=0;i<l.steps.length;i++){
  await goLesson(l.id,i);
  if(l.steps[i].t==='play'){assert.ok(await page.locator('.music svg').count(),l.id+' '+i+' missing notation');}
  screens++;
 }
 assert.deepEqual(errors,[]);console.log('Rendered '+screens+' advanced screens without script errors');
 // Separate resume points survive changing course and reloading.
 for(const id of ['mary','int-triplets','adv-two-against-three'])await goLesson(id,1);
 await page.goto(origin+'/#/');await page.waitForSelector('[data-course]');
 for(const [course,title]of [['Beginner',/Mary/],['Intermediate',/Three notes/],['Advanced',/Coordinate two against three/]]){
  await page.getByRole('button',{name:course,exact:true}).click();assert.match(await page.locator('.continue-card').innerText(),title);
 }
 await page.locator('[data-notes]').click();await page.waitForSelector('.notes-chapter');assert.equal(await page.locator('.notes-chapter').count(),8);assert.match(await page.locator('.notes-bar h1').innerText(),/Advanced/);
 const links=await page.locator('a[download]').evaluateAll(as=>as.map(a=>a.href));assert.equal(links.length,9);
 for(const url of links){const r=await page.request.get(url);assert.equal(r.status(),200);assert.ok((await r.body()).subarray(0,5).equals(Buffer.from('%PDF-')));}
 // Lyrics, verse selection, print, playback, speed, hands and loops remain available.
 await goLesson('adv-agnes-reading',4);assert.ok(await page.locator('.lyric-line').count());await page.locator('[data-verse]').click();assert.match(await page.locator('[data-verse]').innerText(),/Verse 2/);
 await page.locator('[data-print]').click();await page.waitForSelector('.paper svg');assert.ok(await page.locator('.paper svg').count());
 await goLesson('adv-agnes-reading',4);await page.locator('[data-along]').click();await page.waitForSelector('[data-hand]');await page.locator('[data-hand]').click();
 await page.getByLabel('First bar').selectOption('1');await page.getByLabel('Last bar').selectOption('2');await page.getByRole('button',{name:'Loop off'}).click();assert.equal(await page.locator('[data-loop]').getAttribute('aria-pressed'),'true');
 await page.getByRole('button',{name:'Pause',exact:true}).click();await page.getByRole('button',{name:'Resume',exact:true}).click();
 await page.goto(origin+'/#/songbook');await page.waitForSelector('.paper');assert.equal(await page.locator('.paper').count(),36);
 // Test the actual lesson completion controller through its keyboard input callback.
 await page.evaluate(async()=>{
  const {Keyboard}=await import('./js/keyboard.js');const bind=Keyboard.prototype.bindInput;
  Keyboard.prototype.bindInput=function(){bind.call(this);window.testKeyboard=this;};
  const {piano}=await import('./js/audio.js');piano.play=()=>({stop(){}});piano.chime=()=>{};
 });
 const final=ADVANCED_UNITS.at(-1).lessons.at(-1),indices=final.steps.map((s,i)=>s.final?i:null).filter(i=>i!==null);
 const perform=async(index)=>{
  await goLesson(final.id,index);
  await page.evaluate(async({id,index})=>{
   const {findLesson}=await import('./js/lessons/index.js');const {buildPractice}=await import('./js/practice.js');
   const p=buildPractice(findLesson(id).lesson.steps[index]);for(const m of p.moments)for(const it of m.items)window.testKeyboard.onPress(it.midi,'tap');
  },{id:final.id,index});
  await page.waitForSelector('[data-next].ready');
 };
 await perform(indices.at(-1));await page.locator('[data-next]').click();
 assert.equal(await page.locator('.celebrate').count(),0);assert.match(await page.locator('.toast').innerText(),/every performance/);
 for(const i of indices.slice(0,-1)){await perform(i);await page.locator('[data-next]').click();}
 await perform(indices.at(-1));await page.locator('[data-next]').click();
 assert.ok(await page.evaluate(()=>JSON.parse(localStorage.getItem('piano-tutor:v1')).done['adv-recital-a8']));
 await page.goto(origin+'/#/');await page.waitForSelector('[data-course]');
 // Daily practice uses advanced progress and records an advanced-specific day.
 await page.evaluate(()=>{const s=JSON.parse(localStorage.getItem('piano-tutor:v1'));s.done['adv-readiness']=true;localStorage.setItem('piano-tutor:v1',JSON.stringify(s));});await page.reload();
 await page.locator('.daily-card').click();await page.waitForSelector('.stage');assert.match(await page.locator('.top-title').innerText(),/advanced practice/);
 assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('piano-tutor:v1')).settings.course),'advanced');
 assert.deepEqual(errors,[]);
 console.log('Three-course resume, 9 PDF downloads, verses, printing, hands, loops, songbook, recital suite and daily practice passed');
}finally{await browser.close();await new Promise(r=>server.close(r));}
