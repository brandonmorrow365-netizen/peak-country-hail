import {site} from '../data/site.ts';

const canonicalHostname = new URL(site.url).hostname;

export function isProductionHostname(hostname: string) {
  return hostname.toLowerCase().replace(/\.$/, '') === canonicalHostname;
}

export function robotsMeta(hostname: string, pageNoindex = false) {
  return !isProductionHostname(hostname) || pageNoindex ? 'noindex, nofollow' : 'index, follow';
}

export function robotsText(stage?: string) {
  if (stage !== 'production') return 'User-agent: *\nDisallow: /\n';
  const directives = 'Allow: /\nDisallow: /api/\nDisallow: /admin/\nDisallow: /internal/\nDisallow: /preview/';
  const agents = ['Googlebot', 'Bingbot', 'OAI-SearchBot', 'ChatGPT-User', 'PerplexityBot', '*'];
  return agents.map((agent) => `User-agent: ${agent}\n${directives}`).join('\n\n') + `\n\nSitemap: ${site.url}/sitemap.xml\n`;
}
