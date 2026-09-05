import {site} from '../data/site.ts';

const canonicalHostname = new URL(site.url).hostname;

export function isProductionHostname(hostname: string) {
  return hostname.toLowerCase().replace(/\.$/, '') === canonicalHostname;
}

export function robotsMeta(hostname: string, pageNoindex = false) {
  return !isProductionHostname(hostname) || pageNoindex ? 'noindex, nofollow' : 'index, follow';
}

export function robotsText(stage?: string) {
  return stage === 'production'
    ? `User-agent: *\nAllow: /\nSitemap: ${site.url}/sitemap.xml\n`
    : 'User-agent: *\nDisallow: /\n';
}
