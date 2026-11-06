import { store } from './store.js';
import { renderStaff } from './staff.js';

export function standPreferences() {
  return {enabled:!!store.setting('musicStand'),full:!!store.setting('fullScore'),zoom:[1,1.25,1.5].includes(store.setting('scoreZoom'))?store.setting('scoreZoom'):1,keyboard:store.setting('standKeyboard')===true};
}
export function bindPracticeMenu(details) {
  const place=()=>{
    if(!details.open)return;
    details.style.setProperty('--practice-menu-top',`${details.querySelector('summary').getBoundingClientRect().bottom+4}px`);
  };
  const outside=e=>{if(!details.contains(e.target))details.open=false;};
  const escape=e=>{if(e.key==='Escape'){details.open=false;details.querySelector('summary').focus();}};
  details.addEventListener('toggle',place);window.addEventListener('resize',place);
  window.visualViewport?.addEventListener('resize',place);
  document.addEventListener('pointerdown',outside);details.addEventListener('keydown',escape);
  return ()=>{details.removeEventListener('toggle',place);window.removeEventListener('resize',place);window.visualViewport?.removeEventListener('resize',place);document.removeEventListener('pointerdown',outside);details.removeEventListener('keydown',escape);};
}
export function mountStandTools(host,lessonEl,onChange) {
  const prefs=standPreferences();
  const tools=document.createElement('div');tools.className='stand-tools';
  tools.innerHTML='<button class="pill" data-stand>Music stand</button><details class="stand-options"><summary>Display options</summary><div class="stand-settings"><label>Score size <select data-zoom aria-label="Score size"><option value="1">Normal</option><option value="1.25">Larger</option><option value="1.5">Largest</option></select></label><button class="pill" data-full>Show full score</button><button class="pill" data-keyboard>Show keyboard</button></div></details>';
  host.appendChild(tools);
  function paint(){
    lessonEl.classList.toggle('music-stand',prefs.enabled);
    lessonEl.classList.toggle('stand-hide-keyboard',prefs.enabled&&!prefs.keyboard);
    tools.querySelector('[data-stand]').setAttribute('aria-pressed',String(prefs.enabled));
    tools.querySelector('[data-stand]').textContent=prefs.enabled?'Learning view':'Music stand';
    tools.querySelector('.stand-options').hidden=!prefs.enabled;
    tools.querySelector('[data-full]').textContent=prefs.full?'Follow my playing':'Show full score';
    tools.querySelector('[data-full]').setAttribute('aria-pressed',String(prefs.full));
    tools.querySelector('[data-keyboard]').textContent=prefs.keyboard?'Hide keyboard':'Show keyboard';
    tools.querySelector('[data-keyboard]').setAttribute('aria-pressed',String(prefs.keyboard));
    tools.querySelector('[data-zoom]').value=prefs.zoom;
  }
  tools.querySelector('[data-stand]').onclick=()=>{prefs.enabled=!prefs.enabled;store.setting('musicStand',prefs.enabled);paint();onChange();};
  tools.querySelector('[data-full]').onclick=()=>{prefs.full=!prefs.full;store.setting('fullScore',prefs.full);paint();onChange();};
  tools.querySelector('[data-keyboard]').onclick=()=>{prefs.keyboard=!prefs.keyboard;store.setting('standKeyboard',prefs.keyboard);paint();onChange();};
  tools.querySelector('[data-zoom]').onchange=e=>{prefs.zoom=Number(e.target.value);store.setting('scoreZoom',prefs.zoom);onChange();};
  prefs.disposeMenu=bindPracticeMenu(tools.querySelector('details'));
  paint();return prefs;
}
// Use the existing notation renderer without changing print or chapter-note layouts.
export function renderStandScore(el,opts,prefs) {
  const oldScroll=el.scrollTop;
  el.classList.toggle('score-follow',!prefs.full);
  const width=Math.max(260,Math.floor((el.clientWidth||600)/prefs.zoom));
  const per=Math.max(1,Math.min(4,Math.floor((width-100)/180)));
  el.innerHTML='';
  const first=document.createElement('div');first.className='stand-system';el.appendChild(first);
  const result=renderStaff(first,{...opts,width,maxBars:per,...(prefs.full?{bars:[0,per]}:{})});
  if(prefs.full)for(let from=per;from<(result?.barCount||0);from+=per){
    const line=document.createElement('div');line.className='stand-system';el.appendChild(line);
    renderStaff(line,{...opts,width,maxBars:per,bars:[from,from+per]});
  }
  el.querySelectorAll('svg').forEach(svg=>{
    svg.style.width=`${width*prefs.zoom}px`;svg.style.height='auto';
    // Preserve readable system size; the score panel scrolls in short viewports.
  });
  el.scrollTop=oldScroll;
}
