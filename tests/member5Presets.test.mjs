import assert from 'node:assert/strict';
import test from 'node:test';
import {getPreset,SIMULATION_PRESETS} from '../src/member5Presets.ts';

test('four demonstration scenarios cover calm, busy, critical and offline',()=>{
  assert.deepEqual(Object.keys(SIMULATION_PRESETS),['calm','busy','critical','offline']);
});
test('the offline preset has no active feed',()=>{
  assert.equal(getPreset('offline').online,false);
});
test('copies of presets do not mutate shared state',()=>{
  const values=getPreset('calm');
  values.people=100;
  assert.equal(getPreset('calm').people,13);
});
