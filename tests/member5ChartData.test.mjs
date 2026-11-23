import assert from 'node:assert/strict';
import test from 'node:test';
import {createTrendSeries} from '../src/member5ChartData.ts';

test('generates exactly twelve repeatable simulated samples by default',()=>{
  const first=createTrendSeries(38,3,50);
  assert.equal(first.length,12);
  assert.deepEqual(first,createTrendSeries(38,3,50));
});
test('generated values never become negative or exceed chart capacity',()=>{
  for(const trend of [-8,0,12]){
    const values=createTrendSeries(120,trend,50);
    assert.ok(values.every(n=>n>=0&&n<=62.5));
  }
});
test('bad numeric input yields finite points',()=>{
  const values=createTrendSeries(NaN,Infinity,0);
  assert.ok(values.every(Number.isFinite));
});
test('a custom sample count is constrained to a reasonable range',()=>{
  assert.equal(createTrendSeries(5,1,10,1).length,2);
  assert.equal(createTrendSeries(5,1,10,200).length,100);
});
