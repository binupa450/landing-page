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
