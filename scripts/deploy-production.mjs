import { readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { changedIndexNowUrls, completeIndexNowNotification, submitIndexNowUrls } from './indexnow-lib.mjs';
import {
  changedFilesBetween,
  currentHead,
  readIndexNowKey,
  resolveIndexNowBaseRef,
  verifyGitRef,
  writeIndexNowBaseline,
} from './indexnow-state.mjs';

const run = (command, args) => {
  const result = spawnSync(command, args, { stdio: 'inherit', env: process.env });
  if (result.status !== 0) throw new Error(`${command} ${args.join(' ')} failed with exit code ${result.status ?? 1}`);
};

const head = currentHead();
const requestedBaseRef = resolveIndexNowBaseRef();
const baseRef = verifyGitRef(requestedBaseRef);
let productionDeployed = false;

try {
  run('pnpm', ['exec', 'astro', 'build']);
  const generated = JSON.parse(readFileSync('dist/server/wrangler.json', 'utf8'));
  const production = JSON.parse(readFileSync('wrangler.production.jsonc', 'utf8'));
  const deploy = {
    ...generated,
    name: production.name,
    workers_dev: production.workers_dev,
    preview_urls: production.preview_urls,
    routes: production.routes,
    vars: production.vars,
    triggers: production.triggers,
    observability: production.observability,
    send_email: production.send_email,
  };
  writeFileSync('dist/server/wrangler.production.json', `${JSON.stringify(deploy, null, 2)}\n`);
  run('pnpm', ['exec', 'wrangler', 'deploy', '--config', 'dist/server/wrangler.production.json']);
  productionDeployed = true;

  const changedFiles = changedFilesBetween(baseRef, head);
  const urlList = changedIndexNowUrls(changedFiles);
  console.log(`IndexNow compared ${baseRef}..${head} and found ${urlList.length} affected canonical URL${urlList.length === 1 ? '' : 's'}.`);
  for (const url of urlList) console.log(`IndexNow URL: ${url}`);

  const result = await completeIndexNowNotification({
    urlList,
    head,
    submit: (urls) => submitIndexNowUrls(urls, readIndexNowKey()),
    recordBaseline: (sha) => writeIndexNowBaseline(sha),
  });
  if (result.outcome === 'skipped') console.log('IndexNow skipped: no public URLs to notify.');
  else console.log(`IndexNow accepted ${urlList.length} canonical URL${urlList.length === 1 ? '' : 's'} (HTTP ${result.status}).`);
  console.log(`IndexNow successful baseline: ${head}`);
} catch (error) {
  if (productionDeployed) console.error('Production deployment succeeded; IndexNow notification failed and remains pending.');
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
