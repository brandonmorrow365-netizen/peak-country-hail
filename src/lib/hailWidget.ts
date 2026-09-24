import { dashboardMode, feedState, LOCAL_RADIUS_MILES, type WeatherAlert, type HailReport, type FeedStatus } from './weather.ts';

export const WIDGET_REFRESH_MS = 5 * 60 * 1000;
export const WIDGET_SOURCE_DEFAULT = 'embedded-widget';
export type WidgetTheme = 'dark' | 'light';
export type WidgetMode = 'hail' | 'warning' | 'recent' | 'quiet' | 'unavailable';

type WeatherSnapshot = {
  nws?: FeedStatus | null;
  spc?: FeedStatus | null;
  nwsSuccess?: FeedStatus | null;
  spcSuccess?: FeedStatus | null;
  localAlerts: WeatherAlert[];
  localReports: HailReport[];
  recentReports: HailReport[];
};

export type WidgetSnapshot = {
  mode: WidgetMode;
  label: string;
  context: string;
  updatedAt: string | null;
};

export function parseWidgetTheme(value: string | null): WidgetTheme {
  return value === 'light' ? 'light' : 'dark';
}

export function sanitizeWidgetSource(value: string | null): string {
  const normalized = value?.toLowerCase() ?? '';
  return /^[a-z0-9_-]{1,48}$/.test(normalized) ? normalized : WIDGET_SOURCE_DEFAULT;
}

export function widgetTrackerUrl(source: string): string {
  const url = new URL('https://peakcountryhail.com/hail-tracker/');
  url.searchParams.set('utm_source', sanitizeWidgetSource(source));
  url.searchParams.set('utm_medium', 'embedded-widget');
  url.searchParams.set('utm_campaign', 'hail-status');
  return url.href;
}

const latest = (...values: Array<string | null | undefined>) => values.filter((value): value is string => Boolean(value)).toSorted().at(-1) ?? null;
const plural = (count: number, singular: string, multiple = `${singular}s`) => count === 1 ? singular : multiple;

export function hailWidgetSnapshot(data: WeatherSnapshot | null, now = Date.now()): WidgetSnapshot {
  if (!data) return { mode: 'unavailable', label: 'Live Data Temporarily Unavailable', context: 'Current source data could not be obtained. Open the full Hail Tracker and follow official warnings for safety decisions.', updatedAt: null };
  const nwsState = feedState(data.nws, data.nwsSuccess, 15, now);
  const spcState = feedState(data.spc, data.spcSuccess, 25, now);
  const updates = latest(data.nwsSuccess?.completed_at, data.spcSuccess?.completed_at);
  const mode = dashboardMode(data.localReports.length, data.localAlerts.length, data.recentReports.length);
  if (mode === 'hail') {
    const report = data.localReports[0];
    return { mode, label: 'Hail Reported Nearby', context: `${data.localReports.length} preliminary SPC ${plural(data.localReports.length, 'hail report')} within ${LOCAL_RADIUS_MILES} miles of Greeley${report ? `; the latest lists ${report.size_inches.toFixed(2)} in. near ${report.location}` : ''}.`, updatedAt: updates };
  }
  if (mode === 'warning') {
    const alert = data.localAlerts[0];
    return { mode, label: 'Active Warning', context: `${data.localAlerts.length} active NWS ${plural(data.localAlerts.length, 'alert')} intersects the Northern Colorado tracking area${alert ? `, including ${alert.headline}` : ''}.`, updatedAt: updates };
  }
  if (mode === 'recent') return { mode, label: 'Recent Hail Event', context: `Official hail was reported within ${LOCAL_RADIUS_MILES} miles of Greeley during the past 72 hours. No current nearby report is stored.`, updatedAt: updates };
  if (nwsState !== 'current' || spcState !== 'current') return { mode: 'unavailable', label: 'Live Data Temporarily Unavailable', context: 'One or more current weather feeds is unavailable or out of date. This widget does not interpret missing data as quiet conditions.', updatedAt: updates };
  return { mode: 'quiet', label: 'Quiet', context: 'No active local hail signal is currently detected in the Peak Country tracking area. Conditions can change quickly.', updatedAt: updates };
}

export function formatWidgetUpdate(value: string | null): string {
  if (!value) return 'No successful update available';
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'America/Denver' }).format(new Date(value)) + ' MT';
}
