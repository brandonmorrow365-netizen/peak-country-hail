import { contentByPath } from '../data/contentMeta.ts';
import { site } from '../data/site.ts';
import {
  PUBLIC_HISTORY_END_YEAR,
  PUBLIC_HISTORY_RANGE,
  PUBLIC_HISTORY_START_YEAR,
  publicHistory,
  subsetSummary,
  type HistoricalHailReport,
} from './hailHistory.ts';

export const PUBLIC_HAIL_DATASET_LANDING_PATH = '/northern-colorado-hail-history/';
export const PUBLIC_HAIL_DATASET_JSON_PATH = '/data/northern-colorado-hail-history.json';
export const PUBLIC_HAIL_DATASET_CSV_PATH = '/data/northern-colorado-hail-history.csv';
export const PUBLIC_HAIL_OBSERVATION_FIELDS = [
  'year',
  'month',
  'begin_date_time',
  'state',
  'county_or_zone',
  'reported_location',
  'hail_magnitude_inches',
  'report_source',
  'latitude',
  'longitude',
  'distance_from_greeley_miles',
  'noaa_event_id',
  'noaa_event_url',
] as const;

export type PublicHailObservation = {
  year: number;
  month: string | null;
  begin_date_time: string | null;
  state: string | null;
  county_or_zone: string | null;
  reported_location: string | null;
  hail_magnitude_inches: number | null;
  report_source: string | null;
  latitude: number;
  longitude: number;
  distance_from_greeley_miles: number;
  noaa_event_id: string;
  noaa_event_url: string;
};

type PublicSourceManifest = {
  generated_at: string;
  completed_seasons: number[];
  current_provisional_year: { year: number; included_in_completed_totals: boolean };
  geographic_filter: {
    anchor_name: string;
    latitude: number;
    longitude: number;
    radius_statute_miles: number;
    method: string;
  };
};

export function publicHailObservations(records: HistoricalHailReport[]): PublicHailObservation[] {
  return publicHistory(records)
    .toSorted((a, b) => b.year - a.year || String(b.begin_date_time).localeCompare(String(a.begin_date_time)))
    .map((report) => ({
      year: report.year,
      month: report.month_name,
      begin_date_time: report.begin_date_time,
      state: report.state,
      county_or_zone: report.cz_name,
      reported_location: report.begin_location,
      hail_magnitude_inches: report.magnitude,
      report_source: report.source,
      latitude: report.begin_lat,
      longitude: report.begin_lon,
      distance_from_greeley_miles: report.distance_from_greeley_miles,
      noaa_event_id: report.event_id,
      noaa_event_url: report.noaa_event_url,
    }));
}

export function buildPublicHailDataset(records: HistoricalHailReport[], manifest: PublicSourceManifest) {
  const sourceRecords = publicHistory(records);
  const observations = publicHailObservations(records);
  const summary = subsetSummary(sourceRecords);
  const completedThrough = Math.max(...manifest.completed_seasons.filter((year) => year <= PUBLIC_HISTORY_END_YEAR));
  const reviewedDate = contentByPath.get(PUBLIC_HAIL_DATASET_LANDING_PATH)?.lastmod;
  if (!reviewedDate) throw new Error(`Missing content metadata for ${PUBLIC_HAIL_DATASET_LANDING_PATH}`);
  return {
    metadata: {
      dataset_name: `Northern Colorado NOAA/NCEI Hail History, ${PUBLIC_HISTORY_RANGE} Public Window`,
      canonical_landing_page_url: new URL(PUBLIC_HAIL_DATASET_LANDING_PATH, site.url).href,
      json_url: new URL(PUBLIC_HAIL_DATASET_JSON_PATH, site.url).href,
      csv_url: new URL(PUBLIC_HAIL_DATASET_CSV_PATH, site.url).href,
      source_data_generated_at: manifest.generated_at,
      reviewed_date: reviewedDate,
      public_coverage_window: {
        start_year: PUBLIC_HISTORY_START_YEAR,
        end_year: PUBLIC_HISTORY_END_YEAR,
        label: PUBLIC_HISTORY_RANGE,
      },
      completed_observations_through: completedThrough,
      provisional_year_excluded: manifest.current_provisional_year.year,
      geographic_anchor: {
        name: manifest.geographic_filter.anchor_name,
        latitude: manifest.geographic_filter.latitude,
        longitude: manifest.geographic_filter.longitude,
      },
      radius_statute_miles: manifest.geographic_filter.radius_statute_miles,
      geographic_methodology: manifest.geographic_filter.method,
      public_report_count: summary.report_count,
      public_hail_day_count: summary.hail_day_count,
      largest_reported_hail_inches: summary.largest_reported_hail_inches,
      underlying_source: {
        name: 'NOAA/NCEI Storm Events Database',
        url: 'https://www.ncei.noaa.gov/stormevents/',
      },
      methodology_url: new URL('/data-sources/', site.url).href,
      citation_guidance: `Cite the canonical landing page and identify this as a Peak Country public derivative of NOAA/NCEI Storm Events records for the ${PUBLIC_HISTORY_RANGE} window; completed observations currently run through ${completedThrough}.`,
      limitation_note: 'An official nearby hail report does not prove that a particular vehicle was exposed to or damaged by hail.',
    },
    observations,
  };
}

const csvCell = (value: unknown) => {
  const text = value === null || value === undefined ? '' : String(value);
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
};

export function serializePublicHailCsv(observations: PublicHailObservation[]) {
  return [
    PUBLIC_HAIL_OBSERVATION_FIELDS.join(','),
    ...observations.map((observation) => PUBLIC_HAIL_OBSERVATION_FIELDS.map((field) => csvCell(observation[field])).join(',')),
  ].join('\n') + '\n';
}
