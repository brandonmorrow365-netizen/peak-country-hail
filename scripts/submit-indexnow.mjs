import { canonicalHost, canonicalIndexNowUrls, submitIndexNowUrls } from './indexnow-lib.mjs';
import { readIndexNowKey } from './indexnow-state.mjs';

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

try {
  const result = await submitIndexNowUrls(urlList, readIndexNowKey());
  console.log(`IndexNow accepted ${urlList.length} canonical URL${urlList.length === 1 ? '' : 's'} (HTTP ${result.status}).`);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
