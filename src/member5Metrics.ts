/**
 * Pure numeric calculations for Member 5's simulated dashboard.
 * This is illustrative UI logic, not certified crowd safety software.
 */
export const WARNING_THRESHOLD_PCT = 70;
export const CRITICAL_THRESHOLD_PCT = 90;
export const FORECAST_HORIZON_MINUTES = 3;

export type OccupancyTone = 'muted' | 'critical' | 'warning' | 'healthy';

export interface OccupancyMetrics {
  pct: number;
  projected: number;
  critical: boolean;
  busy: boolean;
  status: 'Unavailable' | 'Over capacity' | 'Very busy' | 'Busy' | 'Normal';
  overCapacity: boolean;
  tone: OccupancyTone;
  alertTitle: string;
  alertDetail: string;
}

/** Compute status consistently across staff, public and interactive previews. */
export function calculateOccupancy(
  count: number,
  capacity: number,
  trend: number,
  online: boolean
): OccupancyMetrics {
  const safeCapacity = Number.isFinite(capacity) && capacity > 0 ? capacity : 1;
  const safeCount = Number.isFinite(count) ? Math.max(0, count) : 0;
  const safeTrend = Number.isFinite(trend) ? trend : 0;
  const pct = Math.round(safeCount / safeCapacity * 100);
  const projected = Math.round(Math.max(0, safeCount + safeTrend * FORECAST_HORIZON_MINUTES) / safeCapacity * 100);
  const overCapacity = online && pct > 100;
  const critical = online && pct >= CRITICAL_THRESHOLD_PCT;
  const busy = online && pct >= WARNING_THRESHOLD_PCT;
  const status = !online ? 'Unavailable' : overCapacity ? 'Over capacity' : critical ? 'Very busy' : busy ? 'Busy' : 'Normal';
  const tone: OccupancyTone = !online ? 'muted' : critical ? 'critical' : busy ? 'warning' : 'healthy';
  const alertTitle = !online ? 'Data unavailable' : overCapacity ? 'Over capacity' : critical ? 'Critical condition' :
    busy ? 'Warning condition' : projected >= CRITICAL_THRESHOLD_PCT ? 'Projected risk' : 'Conditions normal';
  const alertDetail = !online ? 'Do not use stale observations' :
    critical || busy ? 'Persistence check required' :
    projected >= CRITICAL_THRESHOLD_PCT ? 'Projected threshold crossing' : 'Continue monitoring';

  return { pct, projected, critical, busy, overCapacity, status, tone, alertTitle, alertDetail };
}

/** Describe the direction without claiming to predict real-world occupancy. */
export function describeTrend(trend: number): 'Increasing' | 'Decreasing' | 'Steady' {
  const value=Number.isFinite(trend) ? trend : 0;
  return value>0 ? 'Increasing' : value<0 ? 'Decreasing' : 'Steady';
}


/** Human-readable scenario notice, using the same thresholds as the dashboard. */
export function describeSimulationNotice(
  count:number,capacity:number,trend:number,online:boolean
): {title:string;detail:string} {
  const state=calculateOccupancy(count,capacity,trend,online);
  if(!online) return {
    title:'Source unavailable',
    detail:'Live estimates and projections are suppressed.'
  };
  if(state.overCapacity) return {
    title:'Over capacity',
    detail:'Demo occupancy exceeds the configured capacity; not an operational safety alert.'
  };
  if(state.critical) return {
    title:'Critical threshold reached',
    detail:'Actual incidents would require a sustained condition.'
  };
  if(state.busy) return {
    title:'Warning threshold reached',
    detail:'Actual incidents would require a sustained condition.'
  };
  if(state.projected>=CRITICAL_THRESHOLD_PCT) return {
    title:'Potential early warning',
    detail:'The illustrative three-minute projection crosses 90%.'
  };
  return {title:'Normal conditions',detail:'Continue monitoring valid observations.'};
}
