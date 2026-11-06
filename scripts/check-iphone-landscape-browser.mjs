// iPhone 16 Pro landscape layout regression, using touch emulation.
// The local test server substitutes measured 62px side / 21px bottom insets;
// this tests safe-area CSS without claiming physical iOS/Safari validation.
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createRequire} from 'node:module';
const root=resolve(new URL('..',import.meta.url).pathname);
const out=process.env.PIANO_SCREENSHOT_DIR||'/tmp/piano-iphone16pro';await mkdir(out,{recursive:true});
let safe=true;
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.pdf':'application/pdf','.mp3':'audio/mpeg'};
const server=createServer(async(req,res)=>{try{let path=resolve(root,'.'+new URL(req.url,'http://localhost').pathname);if(path===root)path+='/index.html';let content=await readFile(path);if(extname(path)==='.css'&&safe)content=content.toString().replace(/env\(safe-area-inset-(top|bottom|left|right)(?:,[^)]*)?\)/g,(_,edge)=>({top:0,bottom:21,left:62,right:62}[edge]+'px'));res.setHeader('Content-Type',types[extname(path)]||'application/octet-stream');res.end(content);}catch{res.writeHead(404).end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
const pw=createRequire(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright/package.json')('playwright');
const engine=process.env.AUDIT_BROWSER||'chromium';
const browser=await pw[engine].launch({headless:true,...(engine==='chromium'?{executablePath:process.env.CHROMIUM_EXECUTABLE_PATH||undefined,args:['--no-sandbox']}:{} )});
const context=await browser.newContext({viewport:{width:874,height:402},deviceScaleFactor:3,isMobile:true,hasTouch:true,userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 18_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.4 Mobile/15E148 Safari/604.1'});
const page=await context.newPage(),errors=[],report=[];page.on('pageerror',e=>errors.push(e.message));
async function shot(name){await page.waitForTimeout(400);await page.screenshot({path:`${out}/${engine}-${name}.png`,scale:'css'});const result=await page.evaluate(()=>({viewport:[innerWidth,innerHeight],docWidth:document.documentElement.scrollWidth,head:[...document.querySelectorAll('.play-head > *')].filter(e=>e.getBoundingClientRect().height).map(e=>({class:e.className,w:e.getBoundingClientRect().width,y:e.getBoundingClientRect().y})),panels:[...document.querySelectorAll('.music,.stand-score,.fall-wrap,.kb-wrap,.stand-settings,.secondary-tools,.sheet,.session-dock')].filter(e=>e.getBoundingClientRect().height&&getComputedStyle(e).display!=='none').map(e=>({class:e.className,x:e.getBoundingClientRect().x,y:e.getBoundingClientRect().y,w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height,scroll:e.scrollHeight,client:e.clientHeight})),clippedControls:[...document.querySelectorAll('button,summary,select')].filter(e=>{const r=e.getBoundingClientRect();return r.width&&r.height&&r.y>=0&&r.y<innerHeight&&(r.x<61||r.right>innerWidth-61||r.bottom>innerHeight-20);}).map(e=>({text:e.textContent.trim().slice(0,45),rect:e.getBoundingClientRect().toJSON()}))}));report.push({name,...result});
assert.equal(result.docWidth,874,`${name}: page overflows horizontally`);
for(const panel of result.panels){
 if(['stand-settings','secondary-tools','sheet'].includes(panel.class)){
  assert.ok(panel.x>=61&&panel.x+panel.w<=813,`${name}: menu/dialog outside side safe areas`);
  assert.ok(panel.y+panel.h<=result.viewport[1]-20,`${name}: menu/dialog below bottom safe area`);
 }
}
const keyboard=result.panels.find(p=>p.class.includes('kb-wrap'));
const score=result.panels.find(p=>p.class==='music'||p.class.startsWith('music ')||p.class==='stand-score');
if(keyboard&&score)assert.ok(score.y+score.h<=keyboard.y+1,`${name}: score overlaps keyboard`);
const dock=result.panels.find(p=>p.class==='session-dock');
if(dock&&keyboard)assert.ok(keyboard.y+keyboard.h<=dock.y+1,`${name}: keyboard overlaps session dock`);
if(name==='chord-feedback-browser-bars')assert.ok(score.h>=90,'Short landscape must retain a readable score viewport');
if(name==='warmup-session')assert.ok(score.h>=75,`${name}: toolbar leaves too little score space`);
await page.locator('.music svg,.stand-notation svg').evaluateAll(nodes=>nodes.forEach(svg=>{
 const vb=svg.viewBox.baseVal,r=svg.getBoundingClientRect();
 if(r.width&&r.height&&vb.height&&r.height/vb.height<0.8)throw Error('Notation shrunk below readable scale');
}));
}
const go=async hash=>{await page.goto(origin+'/'+hash);await page.waitForTimeout(120);};
try{
await go('#/');await page.waitForSelector('[data-session]');await shot('home');
await page.locator('[data-menu]').click();await shot('home-menu');await page.locator('[data-settings]').click();await shot('settings');await page.locator('[data-close]').click();
await page.locator('[data-session]').click();await page.locator('[data-minutes="15"]').click();await shot('session');
await go('#/free');await shot('free-play');await go('#/metronome');await shot('metronome');await go('#/songbook');await shot('songbook');await go('#/notes/library');await shot('chapter-notes');await go('#/pieces');await page.locator('[data-add]').click();await shot('pieces');
const ref=await page.evaluate(async()=>{const {songbook}=await import('./js/print.js');const {savePiece}=await import('./js/personal.js');const {store}=await import('./js/store.js');const p=songbook('intermediate').find(p=>p.lesson.steps[p.stepIndex].rh&&p.lesson.steps[p.stepIndex].lh);savePiece(p.lesson.id,p.stepIndex);store.setting('course','intermediate');return {id:p.lesson.id,step:p.stepIndex};});
await go(`#/lesson/${ref.id}/${ref.step}`);await shot('lesson-learning');
await page.locator('[data-stand]').click();await shot('lesson-stand');await page.locator('.stand-options summary').click();await shot('lesson-display-menu');await page.locator('.stand-options summary').click();
await page.locator('.practice-personal-tools summary').click();await shot('lesson-more-menu');await page.locator('.practice-personal-tools summary').click();
await page.locator('[data-along]').click();await page.waitForSelector('[data-loop]');await shot('play-stand');
await page.locator('.stand-options summary').click();await shot('play-display-menu');await page.getByLabel('Score size').selectOption('1.5');await page.locator('[data-full]').click();await page.locator('[data-keyboard]').click();await page.locator('.stand-options summary').click();await shot('play-full-keyboard');await page.setViewportSize({width:874,height:320});await shot('play-full-browser-bars');await page.setViewportSize({width:874,height:402});
await page.locator('[data-stand]').click();await shot('play-learning');
await page.setViewportSize({width:874,height:320});await shot('play-learning-browser-bars');await page.locator('[data-stand]').click();await shot('play-stand-browser-bars');await page.locator('.stand-options summary').click();await shot('play-menu-browser-bars');
await go('#/');await page.locator('[data-menu]').click();await page.locator('[data-course="beginner"]').click();await page.locator('[data-session]').click();await page.waitForSelector('[data-open="0"]');await page.locator('[data-open="0"]').click();await page.waitForSelector('[data-next]');await page.locator('[data-next]').click();await shot('warmup-session');
await page.locator('[data-stand]').click();await shot('warmup-session-stand');
await page.setViewportSize({width:874,height:402});
await page.evaluate(async()=>{const {listener}=await import('./js/listen.js');listener.active=true;listener.muteUntil=0;listener.chordHeard=function(midis){this.chordStatus={detected:midis.slice(0,1),audible:true};return false;};});
await go(`#/lesson/${ref.id}/${ref.step}`);
await page.waitForTimeout(5200);await shot('chord-feedback');
await page.setViewportSize({width:874,height:320});await shot('chord-feedback-browser-bars');
await page.locator('[data-chord-easy]').click();await shot('easy-feedback-browser-bars');
await page.locator('[data-along]').click();await page.waitForSelector('[data-loop]');await page.waitForTimeout(3000);await shot('wait-feedback-browser-bars');
await page.locator('[data-mode] [data-v="flow"]').click();await shot('flow-countdown-browser-bars');
await page.locator('.playalong-more summary').click();await shot('practice-more-browser-bars');
assert.equal(await page.locator('[data-speed]').isVisible(),true);
for(const b of await page.locator('[data-speed] button').all()){const box=await b.boundingBox();assert.ok(box.width>30&&box.x+box.width<=812,'Every speed choice fits the More panel');}
await page.getByLabel('Practice tempo').selectOption('0.5');
await page.keyboard.press('Escape');assert.equal(await page.locator('.playalong-more').getAttribute('open'),null);
const title=await page.locator('.playalong .top-title').boundingBox(),mode=await page.locator('[data-mode]').boundingBox();
assert.ok(title.x+title.width<=mode.x+1,'Title must not overlap mode controls');
await page.setViewportSize({width:402,height:874});await page.waitForTimeout(150);
assert.equal(await page.locator('.playalong-more').isVisible(),false);
assert.equal(await page.locator('[data-speed]').isVisible(),true,'Rotation restores ordinary speed controls');
assert.deepEqual(errors,[]);console.log(`iPhone 16 Pro landscape: ${report.length} screens at 874×402 and 874×320, simulated safe areas, menus, scores, keyboards and session dock passed (${engine})`);await writeFile(`${out}/${engine}-report.json`,JSON.stringify({engine,errors,report},null,2));
}finally{await browser.close();await new Promise(r=>server.close(r));}
