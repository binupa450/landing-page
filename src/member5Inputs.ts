/** Normalize a slider update to a finite, bounded numeric value. */
export function normalizeSliderValue(
  value: string | number,
  min: number,
  max: number,
  step = 1
): number {
  const raw=typeof value==='string' ? Number(value) : value;
  if(!Number.isFinite(raw)) return min;
  const lo=Math.min(min,max), hi=Math.max(min,max);
  const safeStep=Number.isFinite(step) && step>0 ? step : 1;
  const bounded=Math.max(lo,Math.min(hi,raw));
  const snapped=lo+Math.round((bounded-lo)/safeStep)*safeStep;
  return Math.min(hi,Math.max(lo,Number(snapped.toFixed(9))));
}
