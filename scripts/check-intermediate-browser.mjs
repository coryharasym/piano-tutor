import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
const root=resolve(new URL('..',import.meta.url).pathname);
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.pdf':'application/pdf','.mp3':'audio/mpeg'};
const server=createServer(async(req,res)=>{try{const path=resolve(root,'.'+new URL(req.url,'http://localhost').pathname);res.setHeader('Content-Type',types[extname(path===root?root+'/index.html':path)]||'application/octet-stream');res.end(await readFile(path===root?root+'/index.html':path));}catch{res.writeHead(404).end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const origin='http://127.0.0.1:'+server.address().port;
import {createRequire} from 'node:module';
import {INTERMEDIATE_UNITS,BEGINNER_UNITS} from '../js/lessons/index.js';
let chromium;
try { ({chromium}=await import('playwright')); } catch(error) { if(!process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES) throw error; ({chromium}=createRequire(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright/package.json')('playwright')); }
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE_PATH||undefined,args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:844,height:390}}); const errors=[];page.on('pageerror',e=>errors.push(e.message));
try {
 await page.goto(origin+'/');
 assert.equal(await page.locator('.unit:not(.hymns)').count(),7);
 await page.getByRole('button',{name:'Intermediate',exact:true}).click();
 assert.equal(await page.locator('.unit:not(.hymns)').count(),8);
 assert.equal(await page.locator('[data-course="intermediate"]').getAttribute('aria-pressed'),'true');
 await page.reload();assert.equal(await page.locator('.unit:not(.hymns)').count(),8);
 // Seed old progress and verify that both courses retain an independent resume point.
 await page.evaluate(()=>{const s=JSON.parse(localStorage.getItem('piano-tutor:v1'));s.done.welcome=true;s.last={lesson:'mary',step:1};s.lastByCourse={beginner:s.last};localStorage.setItem('piano-tutor:v1',JSON.stringify(s));});await page.reload();
 let screens=0;
 for(const unit of [...BEGINNER_UNITS,...INTERMEDIATE_UNITS]) for(const lesson of unit.lessons) for(let i=0;i<lesson.steps.length;i++) {
   await page.goto(`${origin}/#/lesson/${lesson.id}/${i}`);
   await page.waitForSelector('.stage');
   if(lesson.steps[i].t==='play'&&lesson.steps[i].staff) {assert.ok(await page.locator('.music svg').count(),`${lesson.id} step ${i}: no staff`);}
   screens++;
 }
 console.log('Rendered',screens,'course screens; errors:',errors);
 assert.deepEqual(errors,[]);
 await page.goto(origin+'/#/lesson/mary/1');
 await page.goto(origin+'/#/lesson/int-triplets/1');
 await page.screenshot({path:'/tmp/intermediate-triplets.png'});
 await page.getByRole('button',{name:'Play along',exact:true}).click();
 await page.getByLabel('First bar').selectOption('1');await page.getByLabel('Last bar').selectOption('1');await page.getByRole('button',{name:'Loop off'}).click();
 assert.equal(await page.locator('[data-loop]').getAttribute('aria-pressed'),'true');
 await page.getByRole('button',{name:'Pause',exact:true}).click();await page.getByRole('button',{name:'Resume',exact:true}).click();
 await page.goto(origin+'/#/');await page.getByRole('button',{name:'Beginner',exact:true}).click();
 assert.match(await page.locator('.continue-card').innerText(),/Mary/);
 await page.getByRole('button',{name:'Intermediate',exact:true}).click();assert.match(await page.locator('.continue-card').innerText(),/Three notes/);
 for(const [width,height]of [[390,844],[844,390],[1280,800]]) {
   await page.setViewportSize({width,height});
   for(const control of await page.locator('.head-actions button,[data-course]').all()) {
     const box=await control.boundingBox();assert.ok(box&&box.x>=0&&box.x+box.width<=width+1,'Header control outside viewport');
   }
 }
 await page.setViewportSize({width:844,height:390});
 await page.screenshot({path:'/tmp/intermediate-home.png'});
 // Exercise downloads, two-hand practice, lyric verses and printing on new material.
 await page.goto(origin+'/#/lesson/int-jesus-study/4');
 if(await page.locator('[data-verse]').count())await page.locator('[data-verse]').click();
 await page.locator('[data-along]').click();await page.waitForSelector('[data-hand]');assert.ok(await page.locator('[data-hand]').count());await page.locator('[data-hand]').click();
 await page.goto(origin+'/#/songbook');assert.ok(await page.locator('.paper').count());
 await page.goto(origin+'/#/notes/intermediate');assert.equal(await page.locator('.notes-chapter').count(),8);
 assert.ok(await page.locator('.notes-example svg').count());
 const downloads=await page.locator('.notes-index a').evaluateAll(as=>as.map(a=>a.href));
 for(const url of downloads){const r=await page.request.get(url);assert.equal(r.status(),200);assert.ok((await r.body()).subarray(0,5).equals(Buffer.from('%PDF-')));}
 assert.deepEqual(errors,[]);
 console.log('Toggle, persistence, progress isolation, loop/pause, hands, songbook and notes passed');
} finally {await browser.close();await new Promise(r=>server.close(r));}
