#!/usr/bin/env node
import { resolve } from 'node:path';
import { fetchArchiveManifest,inspectArchive,processArchives,writeReportOutputs,writeSummaryOutputs } from './hail-history-lib.mjs';

const cacheDirectory=resolve('work/hail-history-cache');
const args=new Set(process.argv.slice(2));
const manifest=await fetchArchiveManifest();
console.log(`Discovered ${manifest.length} NOAA/NCEI Storm Events detail archives.`);
if(args.has('--discover-only')){
 for(const archive of manifest)console.log(`${archive.year}: ${archive.filename}`);
 process.exit(0);
}
const requestedYear=[...args].find(arg=>arg.startsWith('--year='));
if(requestedYear){const archive=manifest.find(item=>item.year===Number(requestedYear.split('=')[1]));if(!archive)throw new Error('Requested year is outside 2016-2025');const result=await inspectArchive(archive,cacheDirectory);console.log(`${result.year}: parsed ${result.rowCount.toLocaleString()} rows from ${result.filename}`);process.exit(0);}
const records=await processArchives(manifest,cacheDirectory,({archive,sourceRows,retained})=>console.log(`${archive.year}: retained ${retained.toLocaleString()} of ${sourceRows.toLocaleString()} NOAA detail rows`));
const outputs=await writeReportOutputs(records,resolve('data/hail-history'));
const summaryOutputs=await writeSummaryOutputs(records,manifest,resolve('data/hail-history'));
console.log(`Wrote ${records.length.toLocaleString()} verified hail reports to ${outputs.jsonPath} and ${outputs.csvPath}.`);
console.log(`Validated ${summaryOutputs.summary.overall.hail_day_count.toLocaleString()} hail days and wrote summary/provenance outputs.`);
