import type {SimulationSnapshot} from './member5Summary.ts';

const allowedSources=['CCTV adapter','Webcam fallback'] as const;
export const VISIO_DEMO_QUERY_KEY = 'visio_demo';

/** Encode only non-sensitive demo inputs. Never serialize footage or camera URLs. */
export function encodeDemoQuery(snapshot:SimulationSnapshot):string {
  const params=new URLSearchParams();
  params.set(VISIO_DEMO_QUERY_KEY,'1');
  params.set('people',String(snapshot.people));
  params.set('capacity',String(snapshot.capacity));
  params.set('trend',String(snapshot.trend));
  params.set('online',snapshot.online?'1':'0');
  params.set('source',allowedSources.includes(snapshot.source as typeof allowedSources[number])?
    snapshot.source:'CCTV adapter');
  return params.toString();
}

/** Strictly validate external URLs before restoring a simulated scenario. */
export function parseDemoQuery(search:string):SimulationSnapshot|null {
  const params=new URLSearchParams(search);
  if(params.get(VISIO_DEMO_QUERY_KEY)!=='1') return null;
  // Reject ambiguous duplicated values instead of silently accepting the first one.
  const expectedKeys=[VISIO_DEMO_QUERY_KEY,'people','capacity','trend','online','source'];
  if([...params.keys()].some(key=>!expectedKeys.includes(key))) return null;
  if(expectedKeys.some(key=>params.getAll(key).length!==1)) return null;
  const value=(name:string)=>params.get(name);
  if(['people','capacity','trend','online','source'].some(name=>value(name)===null)) return null;
  const people=Number(value('people')), capacity=Number(value('capacity')), trend=Number(value('trend'));
  const online=value('online'),source=value('source');
  if(!Number.isInteger(people)||people<0||people>120) return null;
  if(!Number.isInteger(capacity)||capacity<10||capacity>100||capacity%5!==0) return null;
  if(!Number.isInteger(trend)||trend<(-8)||trend>12) return null;
  if(online!=='1' && online!=='0') return null;
  if(!allowedSources.some(item=>item===source)) return null;
  return {people,capacity,trend,online:online==='1',source:source!};
}

/** Build an absolute share link without carrying unrelated private query data. */
export function buildDemoShareUrl(origin:string,pathname:string,snapshot:SimulationSnapshot):string {
  return origin+pathname+'?'+encodeDemoQuery(snapshot)+'#demo';
}
