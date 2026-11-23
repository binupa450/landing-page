import assert from 'node:assert/strict';
import test from 'node:test';
import {createTrendSeries,createChartPoints} from '../src/member5ChartData.ts';

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

test('chart geometry spans the full width for 2, 12 and 100 samples',()=>{
  for(const size of [2,12,100]){
    const input=createTrendSeries(24,1,50,size);
    const points=createChartPoints(input,50);
    assert.equal(points.length,size);
    assert.equal(points[0][0],0);
    assert.equal(points.at(-1)[0],300);
    assert.ok(points.every(([x,y])=>x>=0&&x<=300&&y>=8&&y<=100));
  }
});
test('chart geometry handles empty or invalid samples defensively',()=>{
  assert.deepEqual(createChartPoints([],50),[]);
  assert.deepEqual(createChartPoints([1],50),[]);
  const points=createChartPoints([NaN,Infinity],0);
  assert.ok(points.every(pair=>pair.every(Number.isFinite)));
});
