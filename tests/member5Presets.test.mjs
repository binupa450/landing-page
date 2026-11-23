import assert from 'node:assert/strict';
import test from 'node:test';
import {getPreset,getActivePreset,SIMULATION_PRESETS} from '../src/member5Presets.ts';

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

test('active preset detection matches every defined scenario',()=>{
  for(const name of Object.keys(SIMULATION_PRESETS)){
    assert.equal(getActivePreset(getPreset(name)),name);
  }
});
test('modified slider values clear the active preset selection',()=>{
  assert.equal(getActivePreset({...getPreset('busy'),people:39}),null);
});

test('reset baseline reproduces the busy startup scenario',()=>{
  assert.deepEqual(getPreset('busy'),{people:38,capacity:50,trend:3,online:true});
});
