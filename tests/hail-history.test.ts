import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {discoverNewestArchives,parseCsvFile,haversineMiles,validCoordinate,headerIndex,normalizeNoaaRecord,filterNormalizeRecords,HISTORY_RADIUS_MILES} from '../scripts/hail-history-lib.mjs';

test('NOAA discovery selects the newest corrected archive for each year',()=>{
 const html=['StormEvents_details-ftp_v1.0_d2016_c20200101.csv.gz','StormEvents_details-ftp_v1.0_d2016_c20240715.csv.gz','StormEvents_details-ftp_v1.0_d2017_c20240715.csv.gz'].join('\n');
 const result=discoverNewestArchives(html,[2016,2017]);
 assert.equal(result[0].filename,'StormEvents_details-ftp_v1.0_d2016_c20240715.csv.gz');
 assert.equal(result[0].correctionDate,'20240715');
 assert.throws(()=>discoverNewestArchives(html,[2018]),/missing years: 2018/);
});

test('streaming CSV parser handles quoted commas, quotes, and embedded newlines',async()=>{
 const directory=await mkdtemp(join(tmpdir(),'peak-hail-csv-'));const path=join(directory,'test.csv');const rows=[];
 try{await writeFile(path,'A,B,C\n1,"two, fields","line one\nline two"\n2,"said ""hail""",end\n');await parseCsvFile(path,row=>rows.push(row));assert.deepEqual(rows,[['A','B','C'],['1','two, fields','line one\nline two'],['2','said "hail"','end']]);}finally{await rm(directory,{recursive:true,force:true});}
});

const header=['YEAR','MONTH_NAME','BEGIN_DATE_TIME','END_DATE_TIME','STATE','CZ_NAME','BEGIN_LOCATION','EVENT_TYPE','MAGNITUDE','MAGNITUDE_TYPE','SOURCE','BEGIN_LAT','BEGIN_LON','EPISODE_ID','EVENT_ID','EVENT_NARRATIVE'];
const archive={year:2025,filename:'StormEvents_details-ftp_v1.0_d2025_c20260819.csv.gz',url:'https://www.ncei.noaa.gov/example.csv.gz'};
const row=(overrides={})=>{const values={YEAR:'2025',MONTH_NAME:'June',BEGIN_DATE_TIME:'01-JUN-25 12:00:00',END_DATE_TIME:'01-JUN-25 12:01:00',STATE:'COLORADO',CZ_NAME:'WELD',BEGIN_LOCATION:'GREELEY',EVENT_TYPE:'Hail',MAGNITUDE:'1.25',MAGNITUDE_TYPE:'',SOURCE:'Trained Spotter',BEGIN_LAT:'40.41566',BEGIN_LON:'-104.7721515',EPISODE_ID:'10',EVENT_ID:'20',EVENT_NARRATIVE:'Observed hail',...overrides};return header.map(name=>values[name]);};
test('Haversine calculation handles known local, outside, and exact 50-mile points',()=>{
 assert.equal(haversineMiles(40.41566,-104.7721515),0);
 assert.ok(haversineMiles(40.5853,-105.0844)<HISTORY_RADIUS_MILES);
 assert.ok(haversineMiles(38.8339,-104.8214)>HISTORY_RADIUS_MILES);
 const boundaryLatitude=40.41566+(HISTORY_RADIUS_MILES/3958.7613)*(180/Math.PI);
 assert.ok(Math.abs(haversineMiles(boundaryLatitude,-104.7721515)-50)<1e-6);
 assert.ok(normalizeNoaaRecord(row({BEGIN_LAT:String(boundaryLatitude)}),headerIndex(header),archive));
});
test('coordinate, year, event type, radius, and magnitude are validated conservatively',()=>{
 const index=headerIndex(header),valid=normalizeNoaaRecord(row(),index,archive);
 assert.equal(valid.event_type,'Hail');assert.equal(valid.magnitude,1.25);assert.equal(valid.distance_from_greeley_miles,0);
 assert.equal(normalizeNoaaRecord(row({EVENT_TYPE:'Thunderstorm Wind'}),index,archive),null);
 assert.equal(normalizeNoaaRecord(row({YEAR:'2026'}),index,{...archive,year:2026}),null);
 assert.equal(normalizeNoaaRecord(row({BEGIN_LAT:'38.8339',BEGIN_LON:'-104.8214'}),index,archive),null);
 assert.equal(normalizeNoaaRecord(row({BEGIN_LAT:''}),index,archive),null);
 assert.equal(normalizeNoaaRecord(row({MAGNITUDE:''}),index,archive).magnitude,null);
 assert.equal(validCoordinate(91,-104),false);assert.equal(validCoordinate(40,-181),false);
});
test('only accidental duplicate EVENT_ID ingestion is removed',()=>{
 const records=filterNormalizeRecords([row(),row(),row({EVENT_ID:'21',BEGIN_LOCATION:'EVANS'})],header,archive);
 assert.equal(records.length,2);assert.deepEqual(records.map(record=>record.event_id),['20','21']);
});
