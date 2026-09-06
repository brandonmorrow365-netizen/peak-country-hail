import { createReadStream, createWriteStream } from 'node:fs';
import { mkdir, rename, stat, unlink, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
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
