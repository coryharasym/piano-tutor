// Exercise the real Play along controller with deterministic clock and UI doubles.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as practice from '../js/practice.js';
import * as theory from '../js/theory.js';
const nodes=new Map();
function node(selector) {
 if(!nodes.has(selector)) nodes.set(selector,{value:selector.includes('loop-to')?'2':'1',className:'',classList:{toggle(){},add(){}},style:{},events:{},innerHTML:'',textContent:'',querySelector:s=>node(s),querySelectorAll:()=>[],appendChild(){},setAttribute(k,v){this[k]=v;},addEventListener(k,fn){this.events[k]=fn;},getBoundingClientRect:()=>({left:0,width:400}),clientWidth:400,clientHeight:200});
 return nodes.get(selector);
}
const canvas=node('canvas');
canvas.getContext=()=>new Proxy({}, {get:()=>()=>{},set:()=>true});
globalThis.document={createElement:()=>node('main')};
globalThis.window={devicePixelRatio:1};
globalThis.getComputedStyle=()=>({getPropertyValue:()=> '#000'});
let frame; globalThis.requestAnimationFrame=fn=>(frame=fn,1);globalThis.cancelAnimationFrame=()=>{};
let clock=0;globalThis.performance={now:()=>clock};
const listener={onNote:new Set(),active:false,clearRecent(){},chordHeard:()=>false};
const piano={chime(){},play:()=>({stop(){}})};
const store={setting:()=>undefined};
class Keyboard {constructor(){this.keys=new Map();} setTargets(){} flash(){}}
globalThis.loopTest={...practice,...theory,listener,piano,store,Keyboard,icons:{}};
let source=readFileSync(new URL('../js/playalong.js',import.meta.url),'utf8');
source=source.replace(/^import .*;\n/gm,'');
source='const {Keyboard,buildPractice,meterPulse,loopBars,buildBarLoop,matches,lyricLine,lyricHTML,listener,piano,toMidi,isBlack,store,icons}=globalThis.loopTest;\n'+source;
const {mountPlayAlong}=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
const dispose=mountPlayAlong({replaceChildren(){}},{title:'Two bars',rh:'C4/w D4/w',tempo:120},{micButton:()=>({}),onExit(){}});
const click=s=>node(s).events.click({currentTarget:node(s)});
function tick(seconds){for(let i=0;i<seconds*20;i++){clock+=50;frame(clock);}}
click('[data-loop]');
assert.equal(node('[data-loop]')['aria-pressed'],'true');
tick(3); for(const fn of listener.onNote) fn(60); tick(3); for(const fn of listener.onNote) fn(62); tick(3.5);
assert.match(node('.score').textContent,/Pass 2/);
click('[data-pause]'); const before=node('.score').textContent; tick(5);assert.equal(node('.score').textContent,before);
assert.equal(node('[data-pause]').textContent,'Resume');click('[data-pause]');
node('[data-loop-from]').value='2';node('[data-loop-to]').value='1';node('[data-loop-from]').events.change();
assert.equal(node('[data-loop-to]').value,'2');
click('[data-loop]');assert.equal(node('[data-loop]')['aria-pressed'],'false');
dispose();assert.equal(listener.onNote.size,0);
console.log('Play along loop, pause, range correction and cleanup passed');
