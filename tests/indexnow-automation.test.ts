import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { contentMeta } from '../src/data/contentMeta.ts';
import { site } from '../src/data/site.ts';
import {
  canonicalIndexNowUrls,
  changedIndexNowUrls,
  completeIndexNowNotification,
  indexablePaths,
} from '../scripts/indexnow-lib.mjs';

test('warranty full terms is canonical, indexable, and dated in sitemap metadata', () => {
  const entry = contentMeta.find(({ path }) => path === '/warranty/full-terms/');
  assert.deepEqual(entry, { path: '/warranty/full-terms/', lastmod: '2026-10-06' });
  assert.ok(indexablePaths().has('/warranty/full-terms/'));
  const sitemapSource = readFileSync(new URL('../src/pages/sitemap.xml.ts', import.meta.url), 'utf8');
  assert.match(sitemapSource, /contentMeta\.map\(\(\{path,lastmod\}\)/);
  assert.match(sitemapSource, /<loc>\$\{escapeXml\(new URL\(path,site\.url\)\.href\)\}<\/loc><lastmod>\$\{lastmod\}<\/lastmod>/);
});

test('direct public page changes map to their canonical IndexNow URL', () => {
  assert.deepEqual(changedIndexNowUrls([
    'src/pages/warranty/full-terms/index.astro',
    'src/pages/warranty/full-terms/index.astro',
  ]), [`${site.url}/warranty/full-terms/`]);
});

test('tests, documentation, workflows, and deployment tooling produce no public URLs', () => {
  assert.deepEqual(changedIndexNowUrls([
    'tests/seo-system.test.ts',
    'docs/SEARCH_DISCOVERY_SETUP.md',
    '.github/workflows/validate.yml',
    'scripts/deploy-production.mjs',
  ]), []);
});

test('shared public source changes produce the complete safe canonical set', () => {
  const expected = contentMeta.map(({ path }) => new URL(path, site.url).href);
  for (const sourcePath of ['src/data/site.ts', 'src/lib/schema.ts', 'src/layouts/Layout.astro']) {
    assert.deepEqual(changedIndexNowUrls([sourcePath]), expected);
  }
});

test('canonical IndexNow validation deduplicates and still rejects unsafe URLs', () => {
  assert.deepEqual(canonicalIndexNowUrls(['/about/', `${site.url}/about/`, '/about/']), [`${site.url}/about/`]);
  for (const value of ['http://peakcountryhail.com/about/', 'https://example.com/about/', '/api/contact/', '/about/?preview=1', '/about/#team']) {
    assert.throws(() => canonicalIndexNowUrls([value]));
  }
});

test('failed submission leaves the successful baseline unchanged', async () => {
  let baseline = 'old-baseline';
  await assert.rejects(() => completeIndexNowNotification({
    urlList: [`${site.url}/about/`],
    head: 'new-baseline',
    submit: async () => { throw new Error('submission rejected'); },
    recordBaseline: async (head: string) => { baseline = head; },
  }), /submission rejected/);
  assert.equal(baseline, 'old-baseline');
});

test('successful and no-op notifications advance the successful baseline', async () => {
  const recorded = [] as string[];
  const submitted = [] as string[][];
  const success = await completeIndexNowNotification({
    urlList: [`${site.url}/about/`],
    head: 'submitted-head',
    submit: async (urls: string[]) => { submitted.push(urls); return { status: 202 }; },
    recordBaseline: async (head: string) => { recorded.push(head); },
  });
  assert.deepEqual(success, { outcome: 'submitted', status: 202, urlList: [`${site.url}/about/`] });
  assert.deepEqual(submitted, [[`${site.url}/about/`]]);

  const noOp = await completeIndexNowNotification({
    urlList: [],
    head: 'no-op-head',
    submit: async () => { throw new Error('no-op must not submit'); },
    recordBaseline: async (head: string) => { recorded.push(head); },
  });
  assert.deepEqual(noOp, { outcome: 'skipped', status: null, urlList: [] });
  assert.deepEqual(recorded, ['submitted-head', 'no-op-head']);
});
