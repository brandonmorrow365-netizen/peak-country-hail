import {site} from '../data/site.ts';

export const secondaryDomainRedirects = {
  'northerncoloradohail.com': '/hail-tracker/northern-colorado/',
  'coloradohailtracker.com': '/hail-tracker/',
  'greeleyhail.com': '/hail-tracker/greeley/',
  'peakcountrypdr.com': '/paintless-dent-repair/',
  'weldcountyhail.com': '/hail-tracker/weld-county/',
} as const;

const canonical = new URL(site.url);

function normalizedDocumentPath(pathname: string) {
  if (pathname === '/' || pathname === '/review' || pathname.endsWith('/') || /\/[^/]+\.[^/]+$/.test(pathname)) return pathname;
  return `${pathname}/`;
}

/** Returns one direct canonical destination, or null when no redirect is needed. */
export function getCanonicalRedirect(input: string | URL) {
  const incoming = input instanceof URL ? input : new URL(input);
  const hostname = incoming.hostname.toLowerCase().replace(/\.$/, '');
  const bareHostname = hostname.startsWith('www.') ? hostname.slice(4) : hostname;
  const secondaryPath = secondaryDomainRedirects[bareHostname as keyof typeof secondaryDomainRedirects];
  const pathname = normalizedDocumentPath(incoming.pathname);

  if (secondaryPath) {
    const destination = new URL(secondaryPath, canonical);
    destination.search = incoming.search;
    return destination.href;
  }

  if (bareHostname === canonical.hostname && (hostname !== canonical.hostname || incoming.protocol !== 'https:' || pathname !== incoming.pathname)) {
    const destination = new URL(pathname + incoming.search, canonical);
    destination.hash = '';
    return destination.href;
  }

  return null;
}

/** Keeps non-production hosts private while matching the canonical trailing-slash route shape. */
export function getTrailingSlashRedirect(input: string | URL) {
  const incoming = input instanceof URL ? new URL(input.href) : new URL(input);
  const pathname = normalizedDocumentPath(incoming.pathname);
  if (pathname === incoming.pathname) return null;
  incoming.pathname = pathname;
  incoming.hash = '';
  return incoming.href;
}
