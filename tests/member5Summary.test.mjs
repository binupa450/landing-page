import test from 'node:test';
import assert from 'node:assert/strict';
import {formatSimulationSummary} from '../src/member5Summary.ts';

test('simulated snapshot includes crowd count, status and disclosure',()=>{
  const text=formatSimulationSummary({people:35,capacity:50,trend:3,online:true,source:'CCTV adapter'});
  assert.match(text,/People: 35\/50/);
  assert.match(text,/Occupancy: 70%/);
  assert.match(text,/Simulated data only/);
});
test('offline snapshots never expose stale counts or trends',()=>{
  const text=formatSimulationSummary({people:48,capacity:50,trend:12,online:false,source:'Webcam fallback'});
  assert.match(text,/Source offline/);
  assert.doesNotMatch(text,/48\/50/);
  assert.doesNotMatch(text,/projection/i);
});
test('snapshot text normalizes a freeform source string',()=>{
  const text=formatSimulationSummary({people:1,capacity:50,trend:0,online:true,source:'  Webcam  fallback  '});
  assert.match(text,/Source: Webcam fallback/);
});
