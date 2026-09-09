import { readFileSync } from 'node:fs';

export const canonicalHost = 'peakcountryhail.com';

export function indexablePaths(source = readFileSync(new URL('../src/data/contentMeta.ts', import.meta.url), 'utf8')) {
  return new Set([...source.matchAll(/path:\s*'([^']+)'/g)].map((match) => match[1]));
}

export function canonicalIndexNowUrls(values, allowed = indexablePaths()) {
  return [...new Set(values.map((value) => {
    const url = new URL(value, `https://${canonicalHost}`);
    if (url.protocol !== 'https:' || url.hostname !== canonicalHost || url.search || url.hash) throw new Error(`IndexNow URL must be a clean canonical production URL: ${value}`);
    if (!allowed.has(url.pathname)) throw new Error(`IndexNow URL is not in the canonical indexable registry: ${url.pathname}`);
    return url.href;
  }))];
}
