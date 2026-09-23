import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {PUBLIC_HISTORY_END_YEAR,PUBLIC_HISTORY_START_YEAR,PUBLIC_HISTORY_YEARS,publicHistory,subsetSummary,type HistoricalHailReport} from '../src/lib/hailHistory.ts';

const reports=JSON.parse(readFileSync('data/hail-history/hail-reports-2016-2025.json','utf8')) as HistoricalHailReport[];
const summary=JSON.parse(readFileSync('data/hail-history/hail-history-summary.json','utf8'));

test('retained source archive matches its generated metrics',()=>{
 const calculated=subsetSummary(reports);
 for(const field of ['report_count','hail_day_count','largest_reported_hail_inches','hail_report_count_1in_plus','hail_report_count_2in_plus','closest_report_distance','most_active_month'] as const)assert.equal(calculated[field],summary.overall[field]);
});

test('public history is limited to the current five-calendar-year window',()=>{
 const publicReports=publicHistory(reports);
 assert.deepEqual(PUBLIC_HISTORY_YEARS,[2026,2025,2024,2023,2022]);
 assert.equal(publicReports.length,411);
 assert.ok(publicReports.every(report=>report.year>=PUBLIC_HISTORY_START_YEAR&&report.year<=PUBLIC_HISTORY_END_YEAR));
 assert.equal(publicReports.filter(report=>report.year===2026).length,0);
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
