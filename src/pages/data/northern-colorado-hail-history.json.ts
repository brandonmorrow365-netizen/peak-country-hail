import type { APIRoute } from 'astro';
import reportsJson from '../../../data/hail-history/hail-reports-2016-2025.json';
import manifest from '../../../data/hail-history/source-manifest.json';
import { buildPublicHailDataset } from '../../lib/publicHailDataset';
import type { HistoricalHailReport } from '../../lib/hailHistory';

export const prerender = true;

export const GET: APIRoute = () => new Response(
  `${JSON.stringify(buildPublicHailDataset(reportsJson as HistoricalHailReport[], manifest), null, 2)}\n`,
  {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Disposition': 'attachment; filename="northern-colorado-hail-history.json"',
      'Cache-Control': 'public, max-age=3600',
    },
  },
);
