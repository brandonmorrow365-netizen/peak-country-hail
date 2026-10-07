import type { APIRoute } from 'astro';
import reportsJson from '../../../data/hail-history/hail-reports-2016-2025.json';
import manifest from '../../../data/hail-history/source-manifest.json';
import { buildPublicHailDataset, serializePublicHailCsv } from '../../lib/publicHailDataset';
import type { HistoricalHailReport } from '../../lib/hailHistory';

export const prerender = true;

export const GET: APIRoute = () => {
  const dataset = buildPublicHailDataset(reportsJson as HistoricalHailReport[], manifest);
  return new Response(serializePublicHailCsv(dataset.observations), {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="northern-colorado-hail-history.csv"',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
