import {calculateOccupancy} from './member5Metrics.ts';

export interface SimulationSnapshot {
  people: number;
  capacity: number;
  trend: number;
  online: boolean;
  source: string;
}

/** A textual, shareable summary of the simulated scenario, without camera footage. */
export function formatSimulationSummary(snapshot: SimulationSnapshot): string {
  const result=calculateOccupancy(snapshot.people,snapshot.capacity,snapshot.trend,snapshot.online);
  const source=snapshot.source.replace(/\s+/g,' ').trim().slice(0,80) || 'Unspecified';
  if(!snapshot.online){
    return 'VISIO demo | Source offline | Data unavailable | No active occupancy estimate';
  }
  return [
    'VISIO demo',
    'Source: '+source,
    'People: '+snapshot.people+'/'+snapshot.capacity,
    'Occupancy: '+result.pct+'%',
    'Status: '+result.status,
    'Illustrative 3-minute projection: '+result.projected+'%',
    'Simulated data only'
  ].join(' | ');
}
