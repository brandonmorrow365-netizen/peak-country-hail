import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parseCsvFile,validateHistory,TARGET_YEARS} from './hail-history-lib.mjs';
const root=new URL('../',import.meta.url);
const path=name=>new URL(name,root);
const records=JSON.parse(readFileSync(path('data/hail-history/hail-reports-2016-2025.json'),'utf8'));
const summary=JSON.parse(readFileSync(path('data/hail-history/hail-history-summary.json'),'utf8'));
const manifest=JSON.parse(readFileSync(path('data/hail-history/source-manifest.json'),'utf8'));
validateHistory(records,summary,manifest);
let header=[];const csvByYear=Object.fromEntries(TARGET_YEARS.map(year=>[year,0]));let csvCount=0;
await parseCsvFile(path('data/hail-history/hail-reports-2016-2025.csv'),(row,line)=>{if(line===1){header=row;return;}csvCount++;const year=Number(row[header.indexOf('year')]);assert.ok(year in csvByYear,`CSV contains unexpected year ${year}`);csvByYear[year]++;});
assert.equal(csvCount,records.length,'CSV and JSON total report counts differ');
for(const year of TARGET_YEARS){assert.equal(csvByYear[year],summary.annual[year].report_count,`CSV and summary differ for ${year}`);assert.equal(records.filter(record=>record.year===year).length,summary.annual[year].report_count,`JSON and summary differ for ${year}`);}
assert.equal(Object.values(summary.annual).reduce((sum,year)=>sum+year.report_count,0),summary.overall.report_count,'Annual totals do not sum to decade total');
const page=readFileSync(path('src/pages/northern-colorado-hail-history/index.astro'),'utf8');
for(const expression of ['summary.overall.report_count','summary.overall.hail_day_count','summary.overall.largest_reported_hail_inches','summary.overall.hail_report_count_1in_plus','summary.overall.hail_report_count_2in_plus','summary.overall.closest_report_distance','summary.overall.most_active_month','summary.annual'])assert.ok(page.includes(expression),`Public history page does not consume ${expression}`);
assert.ok(!page.includes('1,051 qualifying'),'Public page contains a duplicated hard-coded total');
console.log(`Reconciled ${csvCount} reports across ${summary.overall.hail_day_count} hail days for 2016–2025; CSV, JSON, summary, annual metrics, and public consumers agree.`);
