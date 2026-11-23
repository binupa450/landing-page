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

test('source metadata cannot leak accidental RTSP credentials into copied summary',()=>{
  const text=formatSimulationSummary({people:14,capacity:50,trend:1,online:true,source:'rtsp://alice:secret@camera.internal/live'});
  assert.match(text,/Unspecified demo source/);
  assert.doesNotMatch(text,/secret|camera.internal|rtsp/i);
});
test('valid fallback source remains identifiable in copyable summary',()=>{
  const text=formatSimulationSummary({people:5,capacity:50,trend:0,online:true,source:'Webcam fallback'});
  assert.match(text,/Source: Webcam fallback/);
});
