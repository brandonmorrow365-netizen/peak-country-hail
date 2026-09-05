import {site} from '../data/site.ts';

export const secondaryDomainRedirects = {
  'northerncoloradohail.com': '/hail-tracker/northern-colorado/',
  'coloradohailtracker.com': '/hail-tracker/',
  'greeleyhail.com': '/hail-tracker/greeley/',
  'peakcountrypdr.com': '/paintless-dent-repair/',
  'weldcountyhail.com': '/hail-tracker/weld-county/',
} as const;

const canonical = new URL(site.url);

/** Returns one direct canonical destination, or null when no redirect is needed. */
export function getCanonicalRedirect(input: string | URL) {
  const incoming = input instanceof URL ? input : new URL(input);
  const hostname = incoming.hostname.toLowerCase().replace(/\.$/, '');
  const bareHostname = hostname.startsWith('www.') ? hostname.slice(4) : hostname;
  const secondaryPath = secondaryDomainRedirects[bareHostname as keyof typeof secondaryDomainRedirects];

  if (secondaryPath) {
    const destination = new URL(secondaryPath, canonical);
    destination.search = incoming.search;
    return destination.href;
  }

  if (bareHostname === canonical.hostname && (hostname !== canonical.hostname || incoming.protocol !== 'https:')) {
    const destination = new URL(incoming.pathname + incoming.search, canonical);
    destination.hash = '';
    return destination.href;
  }

  return null;
}
