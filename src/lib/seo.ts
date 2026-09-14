import {site} from '../data/site.ts';

const canonicalHostname = new URL(site.url).hostname;

export function canonicalPath(pathname: string) {
  const clean = (pathname.split(/[?#]/, 1)[0] || '/').replace(/\/index\.html$/, '/');
  if (clean === '/') return '/';
  return /\/[^/]+\.[^/]+$/.test(clean) ? clean : `${clean.replace(/\/+$/, '')}/`;
}

export function canonicalUrl(pathname: string) {
  return new URL(canonicalPath(pathname), `${site.url}/`).href;
}

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
