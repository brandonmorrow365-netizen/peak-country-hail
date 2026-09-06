import { createReadStream, createWriteStream } from 'node:fs';
import { mkdir, rename, stat, unlink } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { createGunzip } from 'node:zlib';

export const NOAA_BASE_URL='https://www.ncei.noaa.gov/pub/data/swdi/stormevents/csvfiles/';
export const TARGET_YEARS=Object.freeze(Array.from({length:10},(_,index)=>2016+index));
export const ARCHIVE_PATTERN=/StormEvents_details-ftp_v1\.0_d(\d{4})_c(\d{8})\.csv\.gz/g;

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
