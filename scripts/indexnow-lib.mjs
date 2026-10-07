import { readFileSync } from 'node:fs';

export const canonicalHost = 'peakcountryhail.com';
export const indexNowEndpoint = 'https://api.indexnow.org/indexnow';

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

function pagePath(sourcePath) {
  if (!sourcePath.startsWith('src/pages/') || !sourcePath.endsWith('.astro')) return null;
  const relative = sourcePath.slice('src/pages/'.length, -'.astro'.length);
  if (relative.includes('[') || relative.includes(']')) return '*';
  const route = relative === 'index' ? '/' : `/${relative.replace(/(?:^|\/)index$/, '')}/`;
  return route.replaceAll('//', '/');
}

function hasSiteWidePublicImpact(sourcePath) {
  if (sourcePath === 'src/pages/sitemap.xml.ts') return true;
  if (sourcePath.startsWith('src/') && !sourcePath.startsWith('src/pages/')) return true;
  if (sourcePath.startsWith('public/')) return true;
  return /^(?:astro\.config\.|package\.json$|pnpm-lock\.yaml$|tsconfig\.json$|wrangler(?:\.[^/]+)?\.jsonc$)/.test(sourcePath);
}

export function changedIndexNowUrls(changedFiles, allowed = indexablePaths()) {
  const pagePaths = [];
  let submitAll = false;
  for (const rawPath of changedFiles) {
    const sourcePath = rawPath.replaceAll('\\', '/');
    if (sourcePath.startsWith('data/hail-history/')) {
      pagePaths.push('/northern-colorado-hail-history/', '/data-sources/');
      continue;
    }
    const directPath = pagePath(sourcePath);
    if (directPath === '*') submitAll = true;
    else if (directPath && allowed.has(directPath)) pagePaths.push(directPath);
    else if (hasSiteWidePublicImpact(sourcePath)) submitAll = true;
  }
  return canonicalIndexNowUrls(submitAll ? [...allowed] : pagePaths, allowed);
}

export async function submitIndexNowUrls(values, key, { fetchImpl = fetch } = {}) {
  const urlList = canonicalIndexNowUrls(values);
  if (!/^[A-Za-z0-9-]{8,128}$/.test(key ?? '')) throw new Error('INDEXNOW_KEY is missing or invalid. See docs/SEARCH_DISCOVERY_SETUP.md.');
  const response = await fetchImpl(indexNowEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: canonicalHost, key, keyLocation: `https://${canonicalHost}/${key}.txt`, urlList }),
  });
  if (!response.ok) throw new Error(`IndexNow submission failed: HTTP ${response.status} ${await response.text()}`);
  return { status: response.status, urlList };
}

export async function completeIndexNowNotification({ urlList, head, submit, recordBaseline }) {
  if (!urlList.length) {
    await recordBaseline(head);
    return { outcome: 'skipped', status: null, urlList };
  }
  const result = await submit(urlList);
  await recordBaseline(head);
  return { outcome: 'submitted', ...result, urlList };
}
