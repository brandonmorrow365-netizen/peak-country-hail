#!/usr/bin/env node
import { resolve } from 'node:path';
import { fetchArchiveManifest,inspectArchive } from './hail-history-lib.mjs';

const cacheDirectory=resolve('work/hail-history-cache');
const args=new Set(process.argv.slice(2));
const manifest=await fetchArchiveManifest();
console.log(`Discovered ${manifest.length} NOAA/NCEI Storm Events detail archives.`);
if(args.has('--discover-only')){
 for(const archive of manifest)console.log(`${archive.year}: ${archive.filename}`);
 process.exit(0);
}
const requestedYear=[...args].find(arg=>arg.startsWith('--year='));
const archives=requestedYear?manifest.filter(item=>item.year===Number(requestedYear.split('=')[1])):manifest;
for(const archive of archives){const result=await inspectArchive(archive,cacheDirectory);console.log(`${result.year}: parsed ${result.rowCount.toLocaleString()} rows from ${result.filename}`);}
