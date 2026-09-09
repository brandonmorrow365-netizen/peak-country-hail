import type { APIRoute } from 'astro';
import { contentMeta } from '../data/contentMeta';
import { site } from '../data/site';

const escapeXml = (value: string) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
const rssDate = (date: string) => new Date(`${date}T12:00:00Z`).toUTCString();

export const GET: APIRoute = () => {
  const entries = contentMeta.filter((entry) => entry.feed);
  const items = entries.map((entry) => {
    const url = new URL(entry.path, site.url).href;
    const feed = entry.feed!;
    return `<item><title>${escapeXml(feed.title)}</title><link>${escapeXml(url)}</link><guid isPermaLink="true">${escapeXml(url)}</guid><description>${escapeXml(feed.description)}</description><pubDate>${rssDate(feed.published)}</pubDate><category>Hail and vehicle repair information</category></item>`;
  }).join('');
  const updated = entries.map((entry) => entry.lastmod).sort().at(-1) ?? '2026-09-08';
  const body = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Peak Country Hail and Repair Resources</title><link>${site.url}/</link><description>Verified public hail-information and vehicle-repair resources from Peak Country. This feed is informational and is not an emergency-alert service.</description><language>en-us</language><lastBuildDate>${rssDate(updated)}</lastBuildDate>${items}</channel></rss>`;
  return new Response(body, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
};
