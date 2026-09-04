export const NWS = 'https://api.weather.gov/alerts/active?area=CO';
export const SPC = 'https://www.spc.noaa.gov/climo/reports/today_hail.csv';
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
async function fetchSource(url:string){const r=await fetch(url,{headers:{'User-Agent':'PeakCountryHail/0.1 (https://peakcountryhail.com/data-sources/)','Accept':url===NWS?'application/geo+json':'text/csv'},signal:AbortSignal.timeout(15000)});if(!r.ok)throw new Error('upstream_http_'+r.status);return r;}
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
   statements.push(db.prepare('INSERT INTO weather_alerts(id,event,headline,area,expires_at,source_url,fetched_at,raw_json) VALUES(?,?,?,?,?,?,?,?)').bind(f.id,p.event,String(p.headline||p.event),String(p.areaDesc||''),new Date(p.expires).toISOString(),NWS,new Date().toISOString(),JSON.stringify(f)));
  }
  await db.batch(statements);return data.features.length;
 });
 if(Math.floor(now/60000)%10===0)await logged(db,'spc',SPC,async()=>{
  const started=Date.now(),day=reportDay(started);const text=await(await fetchSource(SPC)).text();
  if(reportDay(Date.now())!==day)throw new Error('day_rollover');
  const rows=parseHail(text,day),fetched=new Date().toISOString();
  // Replace this source window atomically so corrected/withdrawn reports disappear.
  const statements=[db.prepare('DELETE FROM hail_reports WHERE report_day=?').bind(day)];
  for(const r of rows){const id=await digest(JSON.stringify(r));statements.push(db.prepare('INSERT OR IGNORE INTO hail_reports(id,occurred_at,report_day,location,county,state,size_inches,latitude,longitude,comments,source_url,fetched_at,raw_json) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)').bind(id,r.occurred_at,r.report_day,r.location,r.county,r.state,r.size_inches,r.latitude,r.longitude,r.comments,SPC,fetched,JSON.stringify(r)));}
  await db.batch(statements);return rows.length;
 });
}
export type FeedStatus={completed_at:string;status:string};
export async function readWeather(db?:D1Database){
 if(!db)return null;
 try{
  const [nws,spc,alerts,reports]=await Promise.all([
   db.prepare("SELECT completed_at,status FROM ingestion_logs WHERE source='nws' ORDER BY completed_at DESC LIMIT 1").first<FeedStatus>(),
   db.prepare("SELECT completed_at,status FROM ingestion_logs WHERE source='spc' ORDER BY completed_at DESC LIMIT 1").first<FeedStatus>(),
   db.prepare('SELECT * FROM weather_alerts WHERE expires_at>? ORDER BY expires_at').bind(new Date().toISOString()).all<{headline:string;area:string;expires_at:string}>(),
   db.prepare("SELECT * FROM hail_reports WHERE report_day=? AND upper(county) IN ('WELD','LARIMER') ORDER BY occurred_at DESC").bind(reportDay(Date.now())).all<{occurred_at:string;location:string;county:string;size_inches:number;latitude:number;longitude:number}>()
  ]);return {nws,spc,alerts:alerts.results,reports:reports.results};
 }catch{return null;}
}
export function fresh(status:FeedStatus|null|undefined,minutes:number){return !!status&&status.status==='success'&&Date.now()-Date.parse(status.completed_at)<minutes*60000;}
