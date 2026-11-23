import assert from 'node:assert/strict';
import test from 'node:test';
import {encodeDemoQuery,parseDemoQuery,buildDemoShareUrl} from '../src/member5Share.ts';

const demo={people:38,capacity:50,trend:3,online:true,source:'CCTV adapter'};
test('demo scenario encodes and parses without losing its values',()=>{
  assert.deepEqual(parseDemoQuery(encodeDemoQuery(demo)),demo);
});
test('offline scenario share retains offline status',()=>{
  const offline={people:44,capacity:50,trend:0,online:false,source:'Webcam fallback'};
  assert.deepEqual(parseDemoQuery(encodeDemoQuery(offline)),offline);
});
test('normal browsing without a VISIO demo query is untouched',()=>{
  assert.equal(parseDemoQuery('?hello=world'),null);
});
test('out of bounds and malformed share links are rejected',()=>{
  for(const invalid of ['people=999','capacity=1','trend=99','online=maybe','source=rtsp%3A%2F%2Fprivate']){
    const params=new URLSearchParams(encodeDemoQuery(demo));
    const [key,value]=invalid.split('=');
    params.set(key,value);
    assert.equal(parseDemoQuery(params.toString()),null,invalid);
  }
});
test('an incomplete demo link is ignored safely',()=>{
  assert.equal(parseDemoQuery('?visio_demo=1&people=50'),null);
});
test('an unknown camera source is never embedded in a generated URL',()=>{
  const query=encodeDemoQuery({...demo,source:'rtsp://user:secret@camera.local'});
  assert.doesNotMatch(query,/secret/);
  assert.equal(parseDemoQuery(query)?.source,'CCTV adapter');
});
test('share URLs go to the demonstration without preserving other query strings',()=>{
  assert.equal(buildDemoShareUrl('https://visio.example','/index.html',demo),
    'https://visio.example/index.html?'+encodeDemoQuery(demo)+'#demo');
});

test('duplicated query keys do not silently override a demo scenario',()=>{
  const url=encodeDemoQuery(demo);
  assert.equal(parseDemoQuery(url+'&people=1'),null);
  assert.equal(parseDemoQuery(url+'&visio_demo=1'),null);
});
test('unknown query keys are not accepted as part of a share token',()=>{
  assert.equal(parseDemoQuery(encodeDemoQuery(demo)+'&camera_password=secret'),null);
});

test('share encoding bounds invalid numeric inputs and restores a valid simulation',()=>{
  const query=encodeDemoQuery({...demo,people:999,capacity:0,trend:Infinity});
  assert.deepEqual(parseDemoQuery(query),{...demo,people:120,capacity:10,trend:-8});
});
test('share encoding normalizes non-integer crowd and capacity values',()=>{
  const query=encodeDemoQuery({...demo,people:17.6,capacity:47,trend:2.2});
  assert.deepEqual(parseDemoQuery(query),{...demo,people:18,capacity:45,trend:2});
});
