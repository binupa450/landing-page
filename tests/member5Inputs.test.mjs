import assert from 'node:assert/strict';
import test from 'node:test';
import {normalizeSliderValue} from '../src/member5Inputs.ts';

test('normalizes crowd counts into slider bounds',()=>{
  assert.equal(normalizeSliderValue('47',0,120),47);
  assert.equal(normalizeSliderValue(300,0,120),120);
  assert.equal(normalizeSliderValue(-15,0,120),0);
});
test('capacity values stay in valid five-person steps',()=>{
  assert.equal(normalizeSliderValue(53,10,100,5),55);
  assert.equal(normalizeSliderValue('100',10,100,5),100);
});
test('negative trend numbers are supported',()=>{
  assert.equal(normalizeSliderValue('-4',-8,12),-4);
});
test('nonfinite inputs are replaced with a safe minimum',()=>{
  assert.equal(normalizeSliderValue('abc',10,100,5),10);
  assert.equal(normalizeSliderValue(Infinity,0,120),0);
});
