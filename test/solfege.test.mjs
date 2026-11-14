import assert from 'node:assert/strict';
import { solfegeName } from '../js/solfege.js';

assert.equal(solfegeName('C4'), 'Do4');
assert.equal(solfegeName('D4'), 'Ré4');
assert.equal(solfegeName('G5'), 'Sol5');
assert.equal(solfegeName('C#4'), 'Do♯4');
assert.equal(solfegeName('Bb3'), 'Si♭3');
assert.equal(solfegeName('F♯4', false), 'Fa♯');
assert.equal(solfegeName('not a note'), 'not a note');
console.log('solfege display tests ok');
