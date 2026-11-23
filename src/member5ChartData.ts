/** Generate deterministic, illustrative occupancy points, never real sensor data. */
export function createTrendSeries(
  count: number,
  trend: number,
  capacity: number,
  samples = 12
): number[] {
  const safeCapacity = Number.isFinite(capacity) && capacity > 0 ? capacity : 1;
  const safeCount = Number.isFinite(count) ? Math.max(0, count) : 0;
  const safeTrend = Number.isFinite(trend) ? trend : 0;
  const size = Number.isInteger(samples) ? Math.max(2, Math.min(samples, 100)) : 12;
  return Array.from({length:size},(_,i)=>
    Math.max(0,Math.min(safeCapacity*1.25,
      safeCount-(size-1-i)*safeTrend*.24+Math.sin(i*1.3)*2.1)));
}

/** Reusable SVG geometry so any chart sample count spans the full graph width. */
export function createChartPoints(
  samples: number[],
  capacity: number,
  width = 300
): [number,number][] {
  if(samples.length<2) return [];
  const safeCapacity=Number.isFinite(capacity)&&capacity>0 ? capacity : 1;
  const safeWidth=Number.isFinite(width)&&width>0 ? width : 300;
  return samples.map((value,index)=>{
    const safeValue=Number.isFinite(value) ? Math.max(0,value) : 0;
    const x=index*safeWidth/(samples.length-1);
    const y=100-Math.min(safeValue/(safeCapacity*1.25),1)*92;
    return [x,y];
  });
}
