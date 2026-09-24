import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { readWeather } from '../../../lib/weather';
import { hailWidgetSnapshot } from '../../../lib/hailWidget';

export const GET: APIRoute = async () => {
  const snapshot = hailWidgetSnapshot(await readWeather(env.DB));
  return Response.json(snapshot, { headers: { 'Cache-Control': 'public, max-age=60, s-maxage=300, stale-if-error=900', 'X-Robots-Tag': 'noindex, nofollow' } });
};
