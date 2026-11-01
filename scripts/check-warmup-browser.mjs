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

const waitStep=async i=>page.waitForFunction(i=>location.hash===`#/lesson/warmup/${i}`&&document.querySelectorAll('.dots i')[i]?.classList.contains('now'),i);
const goStep=async i=>{await page.goto(`${origin}/#/lesson/warmup/${i}`);await waitStep(i);};
const snapshot=()=>page.evaluate(()=>{const s=JSON.parse(localStorage.getItem('piano-tutor:v1'));return {done:s.done,last:s.last,lastByCourse:s.lastByCourse,practice:s.practice,best:s.best,course:s.settings.course};});
try{
 await page.goto(origin+'/');
 const scenarios=[['beginner',{}],['beginner',{'rh-c-position':true}],['intermediate',{'int-readiness':true,'int-major-scales':true,'int-unequal':true,'int-arpeggios':true}],['advanced',{'adv-readiness':true,'adv-major-keys':true,'adv-arpeggio-travel':true}]];
 for(const [course,done]of scenarios){
  await page.evaluate(async({course,done})=>{
   const {store}=await import('./js/store.js');store.reset();store.data.done={welcome:true,...done};store.data.last={lesson:'mary',step:1};store.data.lastByCourse={beginner:store.data.last};store.data.practice={'2026-10-30':true};store.data.best={treble:15};store.setting('course',course);store.save();
  },{course,done});
  await page.goto(origin+'/#/');await page.reload();await page.waitForSelector('[data-warmup]');
  for(const [width,height]of [[320,740],[390,844],[844,390],[1280,800]]){
   await page.setViewportSize({width,height});
   await page.evaluate(()=>document.fonts.ready);
   const [a,b]=await page.evaluate(()=>['[data-warmup]','.daily-card'].map(s=>document.querySelector(s).getBoundingClientRect().toJSON()));
   if(!(a&&b&&Math.abs(a.y-b.y)<2&&a.x+a.width<b.x+1)){await page.screenshot({path:'/tmp/warmup-layout-failure.png'});throw Error('Cards not adjacent '+JSON.stringify({course,width,a,b,styles:await page.locator('.practice-cards').evaluate(el=>({display:getComputedStyle(el).display,width:getComputedStyle(el).width,columns:getComputedStyle(el).gridTemplateColumns}))}));}
   for(const selector of ['[data-warmup]','.daily-card'])assert.ok(await page.locator(selector).evaluate(e=>e.scrollWidth<=e.clientWidth+1),'Card label overflows');
   assert.ok(a.x>=0&&b.x+b.width<=width+1,'Practice card outside viewport');
  }
  await page.setViewportSize({width:844,height:390});
  if(course==='advanced')await page.screenshot({path:'/tmp/warmup-home.png'});
  const before=await snapshot();
  await page.evaluate(async()=>{
   const {Keyboard}=await import('./js/keyboard.js');const bind=Keyboard.prototype.bindInput;
   Keyboard.prototype.bindInput=function(){bind.call(this);window.testKeyboard=this;};
   const {piano}=await import('./js/audio.js');piano.play=()=>({stop(){}});piano.chime=()=>{};
  });
  await page.locator('[data-warmup]').click();await waitStep(0);assert.match(await page.locator('.top-title').innerText(),/warm-up/);
  await page.locator('[data-next]').click();await waitStep(1);
  assert.ok(await page.locator('[data-demo]').count());assert.ok(await page.locator('[data-speed]').count());assert.ok(await page.locator('.mic-btn').count());
  if(course!=='beginner')assert.ok(await page.locator('.music svg').count());
  if(course==='advanced')await page.screenshot({path:'/tmp/warmup-scale.png'});
  for(let i=1;i<=4;i++){
   await goStep(i);
   const press=()=>page.evaluate(async i=>{const {findLesson}=await import('./js/lessons/index.js');const {buildPractice}=await import('./js/practice.js');for(const m of buildPractice(findLesson('warmup').lesson.steps[i]).moments)for(const it of m.items)window.testKeyboard.onPress(it.midi,'tap');},i);
   await press();await page.waitForFunction(()=>document.querySelector('.reps')?.textContent==='Round 2 of 2'&&!document.querySelector('.feedback')?.textContent.includes('Once more'));
   await press();await page.waitForSelector('.feedback .again');
   if(i===1){await page.locator('[data-restart]').click();assert.match(await page.locator('.reps').innerText(),/Round 1/);}
  }
  await goStep(3);await page.locator('[data-along]').click();await page.waitForSelector('[data-loop]');
  await page.getByLabel('First bar').selectOption('1');await page.getByLabel('Last bar').selectOption('1');await page.locator('[data-loop]').click();assert.equal(await page.locator('[data-loop]').getAttribute('aria-pressed'),'true');
  assert.ok(await page.locator('[data-hand]').count());
  await goStep(5);await page.getByRole('button',{name:'Finish warm-up',exact:true}).click();await page.waitForSelector('.celebrate');assert.match(await page.locator('.celebrate h2').innerText(),/Warm-up complete/);
  assert.deepEqual(await snapshot(),before,'Warm-up changed course progress, resume point, daily streak or best time');
  await page.getByRole('button',{name:'Repeat warm-up',exact:true}).click();await waitStep(0);
  await goStep(5);await page.getByRole('button',{name:'Finish warm-up',exact:true}).click();await page.waitForSelector('.celebrate');
  if(course==='beginner'&&!done['rh-c-position']){
   assert.equal(await page.getByRole('button',{name:'Continue to Daily Practice',exact:true}).count(),0);
   await page.getByRole('button',{name:'Continue to lessons',exact:true}).click();await page.waitForSelector('[data-warmup]');
  } else {
   await page.getByRole('button',{name:'Continue to Daily Practice',exact:true}).click();await page.waitForFunction(()=>location.hash==='#/lesson/daily/0'&&document.querySelector('.stage .read'));
   assert.deepEqual(await snapshot(),before,'Starting Daily Practice changed completion records');
  }
 }
 // Reload a direct warm-up URL and confirm registration and course are retained.
 await page.goto(origin+'/#/lesson/warmup/1');await page.reload();await page.waitForSelector('.music svg');assert.match(await page.locator('.top-title').innerText(),/Advanced warm-up/);
 assert.deepEqual(errors,[]);console.log('Warm-up cards at four viewports, four progress scenarios, two-round input, restart, loops/hands, optional finish, repetition, Daily Practice handoff, progress isolation and reload passed');
}finally{await browser.close();await new Promise(r=>server.close(r));}
