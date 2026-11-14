// Convert note-name text in generated UI while leaving app data and MIDI untouched.
import { solfegeName } from './solfege.js';

const pitchToken = '[A-G](?:[#b♯♭])?';
const noteList = new RegExp(`(?<![A-Za-z])${pitchToken}(?:\\s*(?:[,;+]|and|to|→|–|-)\\s*${pitchToken})+(?![a-z])`, 'g');
const octavePitch = new RegExp(`(?<![A-Za-z])${pitchToken}-?\\d(?![A-Za-z0-9])`, 'g');
const contextualPitch = /\b([A-G])(?=\s+(?:major|minor|position|chord|key|is in|is called|sits|hangs|lies|under|above|below|nearest|closest)\b)/g;
const middleC = /\bMiddle C\b/g;

function convertText(value) {
  let result = value.replace(middleC, 'Do central');
  result = result.replace(noteList, list => list.replace(new RegExp(pitchToken, 'g'), n => solfegeName(n, false)));
  result = result.replace(octavePitch, n => solfegeName(n));
  result = result.replace(contextualPitch, (match, note) => solfegeName(note, false));
  return result;
}

function processTextNode(node) {
  const parent = node.parentElement;
  if (!parent || parent.closest('script,style,code,pre,textarea,input')) return;
  let value = node.nodeValue;
  // Single emphasized pitch names (for example <b>C</b>) are only converted
  // when their surrounding phrase identifies them as note/key terminology.
  if (/^[A-G]$/.test(value) && /\b(?:key|note|chord|position|staff|clef|Middle|scale|white keys?)\b/i.test(parent.parentElement?.textContent || '')) {
    value = solfegeName(value, false);
  } else {
    value = convertText(value);
  }
  if (value !== node.nodeValue) node.nodeValue = value;
}

function processElement(el) {
  if (!(el instanceof Element) || el.closest('script,style,code,pre,textarea,input')) return;
  for (const attr of ['aria-label', 'title', 'alt']) {
    const value = el.getAttribute(attr);
    if (value) {
      const next = convertText(value);
      if (next !== value) el.setAttribute(attr, next);
    }
  }
}

function processTree(node) {
  if (node.nodeType === Node.TEXT_NODE) processTextNode(node);
  else if (node.nodeType === Node.ELEMENT_NODE) {
    processElement(node);
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
    const texts = [];
    while (walker.nextNode()) texts.push(walker.currentNode);
    texts.forEach(processTextNode);
  }
}

processTree(document.body);
const observer = new MutationObserver(records => {
  for (const record of records) {
    if (record.type === 'characterData') processTextNode(record.target);
    else if (record.type === 'attributes') processElement(record.target);
    else record.addedNodes.forEach(processTree);
  }
});
observer.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['aria-label', 'title', 'alt'] });
