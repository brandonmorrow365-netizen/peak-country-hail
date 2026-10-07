import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  buildPublicHailDataset,
  PUBLIC_HAIL_OBSERVATION_FIELDS,
  serializePublicHailCsv,
} from '../src/lib/publicHailDataset.ts';
import {
  PUBLIC_HISTORY_END_YEAR,
  PUBLIC_HISTORY_START_YEAR,
  publicHistory,
  subsetSummary,
  type HistoricalHailReport,
} from '../src/lib/hailHistory.ts';
import { site } from '../src/data/site.ts';

const records = JSON.parse(readFileSync(new URL('../data/hail-history/hail-reports-2016-2025.json', import.meta.url), 'utf8')) as HistoricalHailReport[];
const manifest = JSON.parse(readFileSync(new URL('../data/hail-history/source-manifest.json', import.meta.url), 'utf8'));
const dataset = buildPublicHailDataset(records, manifest);
const expected = publicHistory(records);
const summary = subsetSummary(expected);

function parseCsv(text: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let quoted = false;
  for (let index = 0; index < text.length; index++) {
    const character = text[index];
    if (quoted) {
      if (character === '"' && text[index + 1] === '"') { cell += '"'; index++; }
      else if (character === '"') quoted = false;
      else cell += character;
    } else if (character === '"') quoted = true;
    else if (character === ',') { row.push(cell); cell = ''; }
    else if (character === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; }
    else if (character !== '\r') cell += character;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  assert.equal(quoted, false);
  return rows;
}

test('public dataset uses the authoritative public history and calculated summary', () => {
  assert.equal(dataset.observations.length, expected.length);
  assert.equal(dataset.metadata.public_report_count, summary.report_count);
  assert.equal(dataset.metadata.public_hail_day_count, summary.hail_day_count);
  assert.equal(dataset.metadata.largest_reported_hail_inches, summary.largest_reported_hail_inches);
  assert.ok(dataset.observations.every(({ year }) => year >= PUBLIC_HISTORY_START_YEAR && year <= PUBLIC_HISTORY_END_YEAR));
  assert.ok(dataset.observations.every(({ year }) => year !== manifest.current_provisional_year.year));
  assert.deepEqual([...new Set(dataset.observations.map(({ year }) => year))].sort(), [2022, 2023, 2024, 2025]);
});

test('CSV and JSON contain the same unique public observations', () => {
  const rows = parseCsv(serializePublicHailCsv(dataset.observations));
  assert.deepEqual(rows[0], PUBLIC_HAIL_OBSERVATION_FIELDS);
  assert.equal(rows.length - 1, dataset.observations.length);
  const eventIdIndex = rows[0].indexOf('noaa_event_id');
  const csvIds = rows.slice(1).map((row) => row[eventIdIndex]);
  const jsonIds = dataset.observations.map(({ noaa_event_id }) => noaa_event_id);
  assert.deepEqual(csvIds, jsonIds);
  assert.equal(new Set(jsonIds).size, jsonIds.length);
});

test('missing NOAA magnitudes remain null in JSON and blank in CSV', () => {
  const source = records.find((record) => record.year >= PUBLIC_HISTORY_START_YEAR && record.year <= PUBLIC_HISTORY_END_YEAR) as HistoricalHailReport;
  const synthetic = { ...source, event_id: 'null-magnitude-test', magnitude: null };
  const observation = buildPublicHailDataset([synthetic], manifest).observations[0];
  assert.equal(observation.hail_magnitude_inches, null);
  const rows = parseCsv(serializePublicHailCsv([observation]));
  assert.equal(rows[1][rows[0].indexOf('hail_magnitude_inches')], '');
});

test('metadata is accurate and the public transform excludes retained-source fields', () => {
  assert.deepEqual(Object.keys(dataset.metadata), [
    'dataset_name', 'canonical_landing_page_url', 'json_url', 'csv_url', 'source_data_generated_at',
    'reviewed_date', 'public_coverage_window', 'completed_observations_through',
    'provisional_year_excluded', 'geographic_anchor', 'radius_statute_miles',
    'geographic_methodology', 'public_report_count', 'public_hail_day_count',
    'largest_reported_hail_inches', 'underlying_source', 'methodology_url',
    'citation_guidance', 'limitation_note',
  ]);
  assert.equal(dataset.metadata.canonical_landing_page_url, `${site.url}/northern-colorado-hail-history/`);
  assert.deepEqual(dataset.metadata.public_coverage_window, { start_year: 2022, end_year: 2026, label: '2022–2026' });
  assert.equal(dataset.metadata.completed_observations_through, 2025);
  assert.equal(dataset.metadata.provisional_year_excluded, 2026);
  assert.equal(dataset.metadata.radius_statute_miles, 50);
  assert.deepEqual(dataset.metadata.underlying_source, { name: 'NOAA/NCEI Storm Events Database', url: 'https://www.ncei.noaa.gov/stormevents/' });
  assert.deepEqual(Object.keys(dataset.observations[0]), PUBLIC_HAIL_OBSERVATION_FIELDS);
  const exportedKeys = new Set(dataset.observations.flatMap((observation) => Object.keys(observation)));
  for (const prohibited of ['episode_id', 'event_narrative', 'noaa_archive_year', 'noaa_archive_filename', 'noaa_archive_url', 'end_date_time', 'magnitude_type', 'event_type', 'streetAddress', 'INDEXNOW_KEY', 'customer', 'lead']) {
    assert.equal(exportedKeys.has(prohibited), false, `public observations expose ${prohibited}`);
  }
});

test('pages expose both distributions without changing the retained archive', () => {
  const page = readFileSync(new URL('../src/pages/northern-colorado-hail-history/index.astro', import.meta.url), 'utf8');
  const sources = readFileSync(new URL('../src/pages/data-sources/index.astro', import.meta.url), 'utf8');
  assert.equal((page.match(/'@type':'DataDownload'/g) ?? []).length, 2);
  assert.ok(page.includes('PUBLIC_HAIL_DATASET_CSV_PATH'));
  assert.ok(page.includes('PUBLIC_HAIL_DATASET_JSON_PATH'));
  assert.ok(sources.includes('PUBLIC_HAIL_DATASET_CSV_PATH'));
  assert.ok(sources.includes('PUBLIC_HAIL_DATASET_JSON_PATH'));
  assert.equal(records.length, 1051);
  assert.equal(expected.length, 411);
});
