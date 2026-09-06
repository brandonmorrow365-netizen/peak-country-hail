import { createReadStream, createWriteStream } from 'node:fs';
import { mkdir, rename, stat, unlink, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { createGunzip } from 'node:zlib';

export const NOAA_BASE_URL='https://www.ncei.noaa.gov/pub/data/swdi/stormevents/csvfiles/';
export const TARGET_YEARS=Object.freeze(Array.from({length:10},(_,index)=>2016+index));
export const ARCHIVE_PATTERN=/StormEvents_details-ftp_v1\.0_d(\d{4})_c(\d{8})\.csv\.gz/g;
export const GREELEY_ANCHOR=Object.freeze({latitude:40.41566,longitude:-104.7721515});
export const HISTORY_RADIUS_MILES=50;
export const FORMAT_VERSION='1.0.0';

export function haversineMiles(latitude,longitude,origin=GREELEY_ANCHOR){
 const earthRadiusMiles=3958.7613,toRadians=Math.PI/180,dLat=(latitude-origin.latitude)*toRadians,dLon=(longitude-origin.longitude)*toRadians;
 const a=Math.sin(dLat/2)**2+Math.cos(origin.latitude*toRadians)*Math.cos(latitude*toRadians)*Math.sin(dLon/2)**2;
 return 2*earthRadiusMiles*Math.asin(Math.sqrt(a));
}
export function validCoordinate(latitude,longitude){return Number.isFinite(latitude)&&latitude>=-90&&latitude<=90&&Number.isFinite(longitude)&&longitude>=-180&&longitude<=180;}
export function headerIndex(header){const index=new Map(header.map((name,position)=>[name.replace(/^\uFEFF/,''),position]));for(const required of ['YEAR','EVENT_TYPE','BEGIN_LAT','BEGIN_LON','EVENT_ID'])if(!index.has(required))throw new Error(`NOAA details schema missing ${required}`);return index;}
const nullable=value=>value===''?null:value;
const numericOrNull=value=>value===''||!Number.isFinite(Number(value))?null:Number(value);
export function normalizeNoaaRecord(row,index,archive){
 const get=name=>String(row[index.get(name)]??'').trim(),year=Number(get('YEAR')),latitude=Number(get('BEGIN_LAT')),longitude=Number(get('BEGIN_LON'));
 if(get('EVENT_TYPE')!=='Hail'||year<2016||year>2025||year!==archive.year||!validCoordinate(latitude,longitude))return null;
 const distance=haversineMiles(latitude,longitude);if(distance>HISTORY_RADIUS_MILES)return null;
 const eventId=get('EVENT_ID');if(!eventId)throw new Error(`NOAA Hail record missing EVENT_ID in ${archive.filename}`);
 return {year,month_name:nullable(get('MONTH_NAME')),begin_date_time:nullable(get('BEGIN_DATE_TIME')),end_date_time:nullable(get('END_DATE_TIME')),state:nullable(get('STATE')),cz_name:nullable(get('CZ_NAME')),begin_location:nullable(get('BEGIN_LOCATION')),event_type:'Hail',magnitude:numericOrNull(get('MAGNITUDE')),magnitude_type:nullable(get('MAGNITUDE_TYPE')),source:nullable(get('SOURCE')),begin_lat:latitude,begin_lon:longitude,episode_id:nullable(get('EPISODE_ID')),event_id:eventId,event_narrative:nullable(get('EVENT_NARRATIVE')),distance_from_greeley_miles:Number(distance.toFixed(3)),noaa_archive_year:archive.year,noaa_archive_filename:archive.filename,noaa_archive_url:archive.url,noaa_event_url:`https://www.ncdc.noaa.gov/stormevents/eventdetails.jsp?id=${encodeURIComponent(eventId)}`};
}
export function filterNormalizeRecords(rows,header,archive){const index=headerIndex(header),seen=new Set(),records=[];for(const row of rows){const record=normalizeNoaaRecord(row,index,archive);if(!record||seen.has(record.event_id))continue;seen.add(record.event_id);records.push(record);}return records;}

export function discoverNewestArchives(html,years=TARGET_YEARS){
 const requested=new Set(years),found=new Map();
 for(const match of html.matchAll(ARCHIVE_PATTERN)){
  const year=Number(match[1]),correctionDate=match[2],filename=match[0];
  if(!requested.has(year))continue;
  const current=found.get(year);
  if(!current||correctionDate>current.correctionDate)found.set(year,{year,correctionDate,filename,url:new URL(filename,NOAA_BASE_URL).href});
 }
 const missing=years.filter(year=>!found.has(year));
 if(missing.length)throw new Error(`NOAA archive discovery missing years: ${missing.join(', ')}`);
 return years.map(year=>found.get(year));
}

export async function fetchArchiveManifest(fetchImpl=fetch){
 const response=await fetchImpl(NOAA_BASE_URL,{headers:{'User-Agent':'PeakCountryHailHistory/1.0 (https://peakcountryhail.com/data-sources/)','Accept':'text/html'},signal:AbortSignal.timeout(30000)});
 if(!response.ok)throw new Error(`NOAA archive listing request failed: HTTP ${response.status}`);
 return discoverNewestArchives(await response.text());
}

export async function downloadArchive(archive,cacheDirectory,fetchImpl=fetch){
 await mkdir(cacheDirectory,{recursive:true});
 const destination=join(cacheDirectory,archive.filename);
 try{if((await stat(destination)).size>0)return destination;}catch{}
 const response=await fetchImpl(archive.url,{headers:{'User-Agent':'PeakCountryHailHistory/1.0 (https://peakcountryhail.com/data-sources/)'},signal:AbortSignal.timeout(120000)});
 if(!response.ok||!response.body)throw new Error(`NOAA archive download failed for ${archive.year}: HTTP ${response.status}`);
 const temporary=`${destination}.part`;
 try{await pipeline(Readable.fromWeb(response.body),createWriteStream(temporary,{flags:'wx'}));await rename(temporary,destination);}catch(error){await unlink(temporary).catch(()=>{});throw error;}
 return destination;
}

export async function decompressArchive(archivePath,cacheDirectory){
 await mkdir(cacheDirectory,{recursive:true});
 const destination=join(cacheDirectory,archivePath.split('/').at(-1).replace(/\.gz$/,''));
 try{if((await stat(destination)).size>0)return destination;}catch{}
 const temporary=`${destination}.part`;
 try{await pipeline(createReadStream(archivePath),createGunzip(),createWriteStream(temporary,{flags:'wx'}));await rename(temporary,destination);}catch(error){await unlink(temporary).catch(()=>{});throw error;}
 return destination;
}

export async function parseCsvFile(path,onRow){
 const stream=createReadStream(path,{encoding:'utf8'});let row=[],field='',quoted=false,rowNumber=0,pendingQuote=false;
 const emit=async()=>{row.push(field.replace(/\r$/,''));field='';rowNumber++;await onRow(row,rowNumber);row=[];};
 for await(const chunk of stream){
  for(let index=0;index<chunk.length;index++){
   const char=chunk[index];
   if(pendingQuote){pendingQuote=false;if(char==='"'){field+='"';continue;}quoted=false;}
   if(char==='"'){
    if(quoted){if(index+1<chunk.length&&chunk[index+1]==='"'){field+='"';index++;}else if(index+1===chunk.length)pendingQuote=true;else quoted=false;}
    else if(field==='')quoted=true;else field+=char;
   }else if(char===','&&!quoted){row.push(field);field='';}
   else if(char==='\n'&&!quoted)await emit();
   else field+=char;
  }
 }
 if(pendingQuote)quoted=false;
 if(quoted)throw new Error(`Unclosed quoted CSV field in ${path}`);
 if(field||row.length)await emit();
 return rowNumber;
}

export async function inspectArchive(archive,cacheDirectory){
 const compressed=await downloadArchive(archive,cacheDirectory);
 const csv=await decompressArchive(compressed,cacheDirectory);
 let header=null,rows=0;
 await parseCsvFile(csv,(row,line)=>{if(line===1)header=row;else rows++;});
 if(!header?.includes('EVENT_TYPE')||!header.includes('BEGIN_LAT')||!header.includes('EVENT_ID'))throw new Error(`Unexpected NOAA details schema for ${archive.filename}`);
 return {...archive,compressed,csv,rowCount:rows,columnCount:header.length,header};
}

export async function processArchives(archives,cacheDirectory,onProgress=()=>{}){
 const records=[],seenEventIds=new Set();
 for(const archive of archives){
  const compressed=await downloadArchive(archive,cacheDirectory),csv=await decompressArchive(compressed,cacheDirectory);let index=null,sourceRows=0,retained=0;
  await parseCsvFile(csv,(row,line)=>{if(line===1){index=headerIndex(row);return;}sourceRows++;const record=normalizeNoaaRecord(row,index,archive);if(!record||seenEventIds.has(record.event_id))return;seenEventIds.add(record.event_id);records.push(record);retained++;});
  onProgress({archive,sourceRows,retained});
 }
 return records.sort((a,b)=>a.year-b.year||String(a.begin_date_time).localeCompare(String(b.begin_date_time))||Number(a.event_id)-Number(b.event_id));
}
export const REPORT_FIELDS=Object.freeze(['year','month_name','begin_date_time','end_date_time','state','cz_name','begin_location','event_type','magnitude','magnitude_type','source','begin_lat','begin_lon','episode_id','event_id','event_narrative','distance_from_greeley_miles','noaa_archive_year','noaa_archive_filename','noaa_archive_url','noaa_event_url']);
const csvCell=value=>{const text=value===null||value===undefined?'':String(value);return /[",\r\n]/.test(text)?`"${text.replaceAll('"','""')}"`:text;};
export async function writeReportOutputs(records,outputDirectory){
 await mkdir(outputDirectory,{recursive:true});
 const jsonPath=join(outputDirectory,'hail-reports-2016-2025.json'),csvPath=join(outputDirectory,'hail-reports-2016-2025.csv');
 const csv=[REPORT_FIELDS.join(','),...records.map(record=>REPORT_FIELDS.map(field=>csvCell(record[field])).join(','))].join('\n')+'\n';
 await Promise.all([writeFile(jsonPath,JSON.stringify(records,null,2)+'\n'),writeFile(csvPath,csv)]);
 return {jsonPath,csvPath};
}

const MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
export function hailDate(record){const match=String(record.begin_date_time||'').match(/^(\d{2})-([A-Z]{3})-\d{2}/i),monthIndex=match?MONTHS.findIndex(month=>month.slice(0,3).toLowerCase()===match[2].toLowerCase()):-1;if(!match||monthIndex<0)throw new Error(`Invalid NOAA BEGIN_DATE_TIME for EVENT_ID ${record.event_id}`);return `${record.year}-${String(monthIndex+1).padStart(2,'0')}-${match[1]}`;}
function metrics(records){
 const days=new Set(),byMonth=Object.fromEntries(MONTHS.map(month=>[month,0])),byLocation={};let largest=null,closest=null,onePlus=0,twoPlus=0;
 for(const record of records){days.add(hailDate(record));if(record.month_name in byMonth)byMonth[record.month_name]++;if(record.begin_location)byLocation[record.begin_location]=(byLocation[record.begin_location]||0)+1;if(record.magnitude!==null){largest=largest===null?record.magnitude:Math.max(largest,record.magnitude);if(record.magnitude>=1)onePlus++;if(record.magnitude>=2)twoPlus++;}closest=closest===null?record.distance_from_greeley_miles:Math.min(closest,record.distance_from_greeley_miles);}
 const mostActiveMonth=MONTHS.reduce((best,month)=>byMonth[month]>byMonth[best]?month:best,MONTHS[0]);
 return {report_count:records.length,hail_day_count:days.size,largest_reported_hail_inches:largest,hail_report_count_1in_plus:onePlus,hail_report_count_2in_plus:twoPlus,closest_report_distance:closest,most_active_month:records.length?mostActiveMonth:null,reports_by_month:byMonth,reports_by_location_or_community:Object.fromEntries(Object.entries(byLocation).sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0])))};
}
export function summarizeRecords(records,years=TARGET_YEARS){return {completed_seasons:{start_year:years[0],end_year:years.at(-1),year_count:years.length,current_provisional_year_excluded:2026},overall:metrics(records),annual:Object.fromEntries(years.map(year=>[year,metrics(records.filter(record=>record.year===year))]))};}
export function sourceManifest(archives,ingestedAt=new Date().toISOString()){return {processing_format_version:FORMAT_VERSION,generated_at:ingestedAt,canonical_source:{name:'NOAA/NCEI Storm Events Database bulk data',base_url:NOAA_BASE_URL,archive_family:'StormEvents_details-ftp_v1.0_dYYYY_*.csv.gz'},archives:archives.map(({year,filename,url,correctionDate})=>({year,filename,url,correction_date:correctionDate})),completed_seasons:TARGET_YEARS,current_provisional_year:{year:2026,included_in_completed_totals:false},geographic_filter:{anchor_name:'Greeley, Colorado city reference point',latitude:GREELEY_ANCHOR.latitude,longitude:GREELEY_ANCHOR.longitude,radius_statute_miles:HISTORY_RADIUS_MILES,method:'Haversine great-circle distance using Earth radius 3,958.7613 statute miles'},filtering_rules:['EVENT_TYPE equals Hail','YEAR is 2016 through 2025 inclusive','BEGIN_LAT and BEGIN_LON are present, numeric, and within valid coordinate ranges','Calculated Haversine distance from the Greeley city reference point is less than or equal to 50.0 statute miles'],deduplication:'Exact repeated NOAA EVENT_ID records are retained once; separate event IDs are retained.',magnitude_policy:'NOAA MAGNITUDE is preserved numerically when supplied and remains null when blank. No descriptive-to-numeric conversion is performed.'};}
export function validateHistory(records,summary,manifest){
 const ids=new Set();for(const record of records){if(record.event_type!=='Hail')throw new Error(`Non-Hail EVENT_ID ${record.event_id}`);if(record.year<2016||record.year>2025)throw new Error(`Out-of-range EVENT_ID ${record.event_id}`);if(!validCoordinate(record.begin_lat,record.begin_lon))throw new Error(`Invalid coordinate EVENT_ID ${record.event_id}`);if(record.distance_from_greeley_miles>HISTORY_RADIUS_MILES)throw new Error(`Outside radius EVENT_ID ${record.event_id}`);if(ids.has(record.event_id))throw new Error(`Duplicate EVENT_ID ${record.event_id}`);ids.add(record.event_id);}
 const calculated=summarizeRecords(records);if(JSON.stringify(calculated)!==JSON.stringify(summary))throw new Error('Summary does not match filtered records');if(manifest.archives.length!==TARGET_YEARS.length||manifest.archives.some((archive,index)=>archive.year!==TARGET_YEARS[index]))throw new Error('Source manifest does not cover every completed season');return true;
}
export async function writeSummaryOutputs(records,archives,outputDirectory,ingestedAt=new Date().toISOString()){
 const summary=summarizeRecords(records),manifest=sourceManifest(archives,ingestedAt);validateHistory(records,summary,manifest);await mkdir(outputDirectory,{recursive:true});
 const summaryPath=join(outputDirectory,'hail-history-summary.json'),manifestPath=join(outputDirectory,'source-manifest.json');await Promise.all([writeFile(summaryPath,JSON.stringify(summary,null,2)+'\n'),writeFile(manifestPath,JSON.stringify(manifest,null,2)+'\n')]);return {summary,manifest,summaryPath,manifestPath};
}
