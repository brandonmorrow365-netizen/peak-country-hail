import { canonicalHost, canonicalIndexNowUrls } from './indexnow-lib.mjs';

const requested = process.argv.slice(2).filter((value) => value !== '--dry-run');
const dryRun = process.argv.includes('--dry-run');
if (!requested.length) {
  console.error('Usage: pnpm indexnow:submit -- /changed-page/ [/another-changed-page/] [--dry-run]');
  process.exit(1);
}

let urlList;
try { urlList = canonicalIndexNowUrls(requested); }
catch (error) { console.error(error instanceof Error ? error.message : error); process.exit(1); }

if (dryRun) {
  console.log(JSON.stringify({ host: canonicalHost, urlList }, null, 2));
  process.exit(0);
}

const key = process.env.INDEXNOW_KEY;
if (!key || !/^[A-Za-z0-9-]{8,128}$/.test(key)) {
  console.error('INDEXNOW_KEY is missing or invalid. See docs/SEARCH_DISCOVERY_SETUP.md.');
  process.exit(1);
}

const response = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: canonicalHost, key, keyLocation: `https://${canonicalHost}/${key}.txt`, urlList }),
});
if (!response.ok) {
  console.error(`IndexNow submission failed: HTTP ${response.status} ${await response.text()}`);
  process.exit(1);
}
console.log(`IndexNow accepted ${urlList.length} canonical URL${urlList.length === 1 ? '' : 's'} (HTTP ${response.status}).`);
