import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {discoverNewestArchives,parseCsvFile} from '../scripts/hail-history-lib.mjs';

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
