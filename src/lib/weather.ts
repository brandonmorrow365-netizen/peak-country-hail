export const NWS = 'https://api.weather.gov/alerts/active?area=CO';
export const SPC = 'https://www.spc.noaa.gov/climo/reports/today_hail.csv';
export const GREELEY = { latitude: 40.41566, longitude: -104.7721515 } as const;
export const LOCAL_RADIUS_MILES = 50;
const LOCAL_AREA = /\b(Weld|Larimer|Greeley|Evans|Windsor|Eaton|Severance|Johnstown|Milliken|LaSalle|Platteville|Fort Collins|Loveland)\b/i;

export function distanceMiles(latitude:number,longitude:number,origin=GREELEY){
 const radius=3958.7613,toRad=Math.PI/180,dLat=(latitude-origin.latitude)*toRad,dLon=(longitude-origin.longitude)*toRad;
 const a=Math.sin(dLat/2)**2+Math.cos(origin.latitude*toRad)*Math.cos(latitude*toRad)*Math.sin(dLon/2)**2;
 return 2*radius*Math.asin(Math.sqrt(a));
}
type Geometry={type:string;coordinates?:unknown;geometries?:Geometry[]}|null;
type Coordinate=[number,number];
function pointInRing(point:Coordinate,ring:Coordinate[]){let inside=false;for(let i=0,j=ring.length-1;i<ring.length;j=i++){const [xi,yi]=ring[i],[xj,yj]=ring[j];if(((yi>point[1])!==(yj>point[1]))&&(point[0]<(xj-xi)*(point[1]-yi)/(yj-yi)+xi))inside=!inside;}return inside;}
function segmentDistanceMiles(point:Coordinate,a:Coordinate,b:Coordinate){
 const latScale=69.093,lonScale=69.172*Math.cos(point[1]*Math.PI/180);
 const ax=(a[0]-point[0])*lonScale,ay=(a[1]-point[1])*latScale,bx=(b[0]-point[0])*lonScale,by=(b[1]-point[1])*latScale;
 const dx=bx-ax,dy=by-ay,t=Math.max(0,Math.min(1,-(ax*dx+ay*dy)/(dx*dx+dy*dy||1)));
 return Math.hypot(ax+t*dx,ay+t*dy);
}
function ringDistance(point:Coordinate,ring:Coordinate[]){if(pointInRing(point,ring))return 0;let distance=Infinity;for(let i=1;i<ring.length;i++)distance=Math.min(distance,segmentDistanceMiles(point,ring[i-1],ring[i]));return distance;}
export function geometryDistanceMiles(geometry:Geometry,origin=GREELEY):number|null{
 if(!geometry)return null;const point:[number,number]=[origin.longitude,origin.latitude];
 if(geometry.type==='Point'&&Array.isArray(geometry.coordinates)){const [lon,lat]=geometry.coordinates as number[];return Number.isFinite(lat)&&Number.isFinite(lon)?distanceMiles(lat,lon,origin):null;}
 const polygons=geometry.type==='Polygon'?[geometry.coordinates]:geometry.type==='MultiPolygon'?geometry.coordinates:null;
 if(Array.isArray(polygons)){let result=Infinity;for(const polygon of polygons as Coordinate[][][]){if(!Array.isArray(polygon))continue;for(const ring of polygon)if(Array.isArray(ring)&&ring.length>1)result=Math.min(result,ringDistance(point,ring));}return Number.isFinite(result)?result:null;}
 if(geometry.type==='GeometryCollection'&&Array.isArray(geometry.geometries)){const distances=geometry.geometries.map(g=>geometryDistanceMiles(g,origin)).filter((d):d is number=>d!==null);return distances.length?Math.min(...distances):null;}
 return null;
}
export function alertLocality(geometry:Geometry,area:string,radius=LOCAL_RADIUS_MILES){const distance=geometryDistanceMiles(geometry);return distance===null?{local:LOCAL_AREA.test(area),distance:null,basis:'area description' as const}:{local:distance<=radius,distance,basis:'official warning geometry' as const};}
export function feedState(status:FeedStatus|null|undefined,lastSuccess:FeedStatus|null|undefined,minutes:number,now=Date.now()){if(!lastSuccess)return 'unavailable' as const;if(status?.status==='error')return 'cached-error' as const;if(now-Date.parse(lastSuccess.completed_at)>=minutes*60000)return 'stale' as const;return 'current' as const;}
export function reportDay(now: number) { return new Date(now - 12 * 3600_000).toISOString().slice(0,10); }
export function csvRows(text: string): string[][] {
  const rows: string[][] = []; let row: string[] = [], field = '', quoted = false;
  for (let i=0;i<text.length;i++) {
    const c=text[i];
    if(c==='"') { if(quoted && text[i+1]==='"'){field+='"';i++;}else quoted=!quoted; }
    else if(c===',' && !quoted){row.push(field);field='';}
    else if(c==='\n' && !quoted){row.push(field.replace(/\r$/,''));rows.push(row);row=[];field='';}
    else field+=c;
  }
  if(quoted) throw new Error('invalid_csv');
  if(field || row.length){row.push(field.replace(/\r$/,''));rows.push(row);}
  return rows;
}
export function parseHail(text: string, day: string) {
  const [header,...rows]=csvRows(text.replace(/^\uFEFF/,''));
  if(header?.join(',')!=='Time,Size,Location,County,State,Lat,Lon,Comments') throw new Error('unexpected_spc_schema');
  return rows.filter(r=>r.some(Boolean)).map(r=>{
    if(r.length!==8 || !/^\d{4}$/.test(r[0])) throw new Error('invalid_spc_row');
    const [time,size,location,county,state,lat,lon,comments]=r.map(s=>s.trim());
    const hour=Number(time.slice(0,2)),minute=Number(time.slice(2));
    const latitude=Number(lat),longitude=Number(lon),sizeInches=Number(size)/100;
    if(hour>23||minute>59||!lat||!lon||!Number.isFinite(latitude)||Math.abs(latitude)>90||!Number.isFinite(longitude)||Math.abs(longitude)>180||!Number.isFinite(sizeInches)||sizeInches<=0)throw new Error('invalid_spc_values');
    const date=new Date(day+'T00:00:00Z'); if(hour<12)date.setUTCDate(date.getUTCDate()+1);date.setUTCHours(hour,minute);
    return {occurred_at:date.toISOString(),report_day:day,location,county,state,size_inches:sizeInches,latitude,longitude,comments};
  }).filter(r=>r.state==='CO');
}
async function digest(s:string) { return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s))),b=>b.toString(16).padStart(2,'0')).join(''); }
async function fetchSource(url:string){const r=await fetch(url,{headers:{'User-Agent':`PeakCountryHail/0.1 (${site.url}/data-sources/)`,'Accept':url===NWS?'application/geo+json':'text/csv'},signal:AbortSignal.timeout(15000)});if(!r.ok)throw new Error('upstream_http_'+r.status);return r;}
async function logged(db:D1Database,source:string,url:string,job:()=>Promise<number>){
  const started=new Date().toISOString();let count=0,status='success',error:string|null=null;
  try{count=await job();}catch{status='error';error='ingestion_failed';}
  await db.prepare('INSERT INTO ingestion_logs(id,source,started_at,completed_at,status,row_count,error_code,source_url) VALUES(?,?,?,?,?,?,?,?)').bind(crypto.randomUUID(),source,started,new Date().toISOString(),status,count,error,url).run();
}
export async function ingestWeather(db:D1Database,now:number){
 await logged(db,'nws',NWS,async()=>{
  const data=await (await fetchSource(NWS)).json() as {features?:Array<{id:string;properties:Record<string,unknown>}>};
  if(!Array.isArray(data.features))throw new Error('invalid_nws_schema');
  const statements=[db.prepare('DELETE FROM weather_alerts')];
  for(const f of data.features){const p=f.properties;if(!f.id||!p||typeof p.event!=='string'||typeof p.expires!=='string'||!Number.isFinite(Date.parse(p.expires)))throw new Error('invalid_alert');
   statements.push(db.prepare('INSERT INTO weather_alerts(id,event,headline,area,expires_at,source_url,fetched_at,raw_json) VALUES(?,?,?,?,?,?,?,?)').bind(f.id,p.event,String(p.headline||p.event),String(p.areaDesc||''),new Date(p.expires).toISOString(),f.id,new Date().toISOString(),JSON.stringify(f)));
  }
  await db.batch(statements);return data.features.length;
 });
 if(Math.floor(now/60000)%10===0)await logged(db,'spc',SPC,async()=>{
  const started=Date.now(),day=reportDay(started);const text=await(await fetchSource(SPC)).text();
  if(reportDay(Date.now())!==day)throw new Error('day_rollover');
  const rows=parseHail(text,day),fetched=new Date().toISOString();
  // Replace this source window atomically so corrected/withdrawn reports disappear.
  const statements=[db.prepare('DELETE FROM hail_reports WHERE report_day=?').bind(day)];
  for(const r of rows){
   const id=await digest(JSON.stringify(r)),raw=JSON.stringify(r);
   statements.push(db.prepare('INSERT INTO hail_report_archive(id,occurred_at,report_day,location,county,state,size_inches,latitude,longitude,comments,source_url,first_seen_at,last_seen_at,raw_json) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET last_seen_at=excluded.last_seen_at, raw_json=excluded.raw_json').bind(id,r.occurred_at,r.report_day,r.location,r.county,r.state,r.size_inches,r.latitude,r.longitude,r.comments,SPC,fetched,fetched,raw));
   statements.push(db.prepare('INSERT OR IGNORE INTO hail_reports(id,occurred_at,report_day,location,county,state,size_inches,latitude,longitude,comments,source_url,fetched_at,raw_json) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)').bind(id,r.occurred_at,r.report_day,r.location,r.county,r.state,r.size_inches,r.latitude,r.longitude,r.comments,SPC,fetched,raw));
  }
  await db.batch(statements);return rows.length;
 });
}
export type FeedStatus={completed_at:string;status:string};
export type WeatherAlert={event:string;headline:string;area:string;expires_at:string;source_url:string;fetched_at:string;description:string;local:boolean;distance_miles:number|null;location_basis:'official warning geometry'|'area description'};
export type HailReport={occurred_at:string;location:string;county:string;size_inches:number;latitude:number;longitude:number;comments:string;source_url:string;fetched_at:string;distance_miles:number};
export async function readWeather(db?:D1Database){
 if(!db)return null;
 try{
  const [nws,spc,nwsSuccess,spcSuccess,alerts,reports]=await Promise.all([
   db.prepare("SELECT completed_at,status FROM ingestion_logs WHERE source='nws' ORDER BY completed_at DESC LIMIT 1").first<FeedStatus>(),
   db.prepare("SELECT completed_at,status FROM ingestion_logs WHERE source='spc' ORDER BY completed_at DESC LIMIT 1").first<FeedStatus>(),
   db.prepare("SELECT completed_at,status FROM ingestion_logs WHERE source='nws' AND status='success' ORDER BY completed_at DESC LIMIT 1").first<FeedStatus>(),
   db.prepare("SELECT completed_at,status FROM ingestion_logs WHERE source='spc' AND status='success' ORDER BY completed_at DESC LIMIT 1").first<FeedStatus>(),
   db.prepare('SELECT * FROM weather_alerts WHERE expires_at>? ORDER BY expires_at').bind(new Date().toISOString()).all<{event:string;headline:string;area:string;expires_at:string;source_url:string;fetched_at:string;raw_json:string}>(),
   db.prepare("SELECT * FROM hail_reports WHERE report_day=? AND state='CO' ORDER BY occurred_at DESC").bind(reportDay(Date.now())).all<Omit<HailReport,'distance_miles'>>()
  ]);
  const mappedAlerts=alerts.results.map(alert=>{let feature:{geometry?:Geometry;properties?:{description?:string}}={};try{feature=JSON.parse(alert.raw_json);}catch{}const locality=alertLocality(feature.geometry??null,alert.area);return {...alert,description:String(feature.properties?.description||''),local:locality.local,distance_miles:locality.distance,location_basis:locality.basis};});
  const mappedReports=reports.results.map(report=>({...report,distance_miles:distanceMiles(report.latitude,report.longitude)}));
  return {nws,spc,nwsSuccess,spcSuccess,alerts:mappedAlerts,localAlerts:mappedAlerts.filter(a=>a.local),reports:mappedReports,localReports:mappedReports.filter(r=>r.distance_miles<=LOCAL_RADIUS_MILES)};
 }catch{return null;}
}
export function fresh(status:FeedStatus|null|undefined,minutes:number){return !!status&&status.status==='success'&&Date.now()-Date.parse(status.completed_at)<minutes*60000;}
import {site} from '../data/site.ts';
