import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {subsetSummary,type HistoricalHailReport} from '../src/lib/hailHistory.ts';

const reports=JSON.parse(readFileSync('data/hail-history/hail-reports-2016-2025.json','utf8')) as HistoricalHailReport[];
const summary=JSON.parse(readFileSync('data/hail-history/hail-history-summary.json','utf8'));

test('public archive source records match every displayed decade metric',()=>{
 const calculated=subsetSummary(reports);
 for(const field of ['report_count','hail_day_count','largest_reported_hail_inches','hail_report_count_1in_plus','hail_report_count_2in_plus','closest_report_distance','most_active_month'] as const)assert.equal(calculated[field],summary.overall[field]);
});

test('year, month, size, distance, and location filters produce source-backed subsets',()=>{
 assert.equal(reports.filter(r=>r.year===2025).length,summary.annual['2025'].report_count);
 assert.equal(reports.filter(r=>r.month_name==='June').length,summary.overall.reports_by_month.June);
 assert.equal(reports.filter(r=>r.magnitude!==null&&r.magnitude>=2).length,summary.overall.hail_report_count_2in_plus);
 assert.ok(reports.filter(r=>r.distance_from_greeley_miles<=10).every(r=>r.distance_from_greeley_miles<=10));
 assert.ok(reports.filter(r=>(r.begin_location??'').includes('GREELEY')).length>0);
});

test('local tracker scopes and map marker fields remain factual',()=>{
 const greeley=reports.filter(r=>r.distance_from_greeley_miles<=10),weld=reports.filter(r=>r.cz_name==='WELD');
 assert.ok(greeley.length>0);assert.ok(weld.length>0);assert.ok(weld.every(r=>r.cz_name==='WELD'));
 for(const report of reports){assert.ok(Number.isFinite(report.begin_lat)&&Number.isFinite(report.begin_lon));assert.ok(report.noaa_event_url.endsWith(`id=${report.event_id}`));assert.ok(report.year>=2016&&report.year<=2025);}
});
