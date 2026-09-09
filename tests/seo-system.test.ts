import test from 'node:test';
import assert from 'node:assert/strict';
import { contentMeta } from '../src/data/contentMeta.ts';
import { pageGraph, schemaIds } from '../src/lib/schema.ts';
import { robotsText } from '../src/lib/seo.ts';
import { site } from '../src/data/site.ts';
import { canonicalIndexNowUrls } from '../scripts/indexnow-lib.mjs';
import { publishedCaseStudies } from '../src/data/caseStudies.ts';
import { locationPages } from '../src/data/locationPages.ts';

test('entity graph uses stable references without private location data', () => {
  const graph = pageGraph('/paintless-dent-repair/', 'Paintless Dent Repair', 'Description');
  const nodes = graph['@graph'] as Record<string, unknown>[];
  const business = nodes.find((node) => node['@id'] === schemaIds.business) as Record<string, unknown>;
  const website = nodes.find((node) => node['@id'] === schemaIds.website) as Record<string, unknown>;
  const page = nodes.find((node) => node['@id'] === `${site.url}/paintless-dent-repair/#webpage`) as Record<string, unknown>;
  const ref = (value: unknown) => (value as Record<string, unknown>)['@id'];
  assert.equal(business['@type'], 'AutoRepair');
  assert.equal(ref(website.publisher), schemaIds.business);
  assert.equal(ref(page.isPartOf), schemaIds.website);
  assert.equal(ref(page.about), schemaIds.business);
  assert.equal(business.address, undefined);
  assert.equal(business.geo, undefined);
  assert.equal(business.sameAs, undefined);
});

test('content metadata contains unique canonical paths and stable ISO dates', () => {
  assert.equal(new Set(contentMeta.map((entry) => entry.path)).size, contentMeta.length);
  for (const entry of contentMeta) {
    assert.match(entry.path, /^\/(?:$|.*\/$)/);
    assert.match(entry.lastmod, /^\d{4}-\d{2}-\d{2}$/);
  }
  assert.ok(!contentMeta.some((entry) => entry.path === '/hail-history/'));
});

test('production robots names retrieval crawlers and protects utility paths', () => {
  const text = robotsText('production');
  for (const agent of ['Googlebot','Bingbot','OAI-SearchBot','ChatGPT-User','PerplexityBot','*']) assert.match(text, new RegExp(`User-agent: ${agent.replace('*','\\*')}`));
  assert.match(text, /Disallow: \/api\//);
  assert.match(text, /Sitemap: https:\/\/peakcountryhail\.com\/sitemap\.xml/);
  assert.equal(robotsText('preview'), 'User-agent: *\nDisallow: /\n');
});

test('IndexNow accepts only registered clean production URLs', () => {
  assert.deepEqual(canonicalIndexNowUrls(['/about/','https://peakcountryhail.com/about/','/hail-size-guide/']), [`${site.url}/about/`,`${site.url}/hail-size-guide/`]);
  for (const value of ['http://peakcountryhail.com/about/','https://example.com/about/','/draft/','/about/?preview=1']) assert.throws(() => canonicalIndexNowUrls([value]));
});

test('sample case studies and unready location pages remain unpublished', () => {
  assert.equal(publishedCaseStudies.length, 0);
  assert.ok(locationPages.length >= 5);
  assert.ok(locationPages.every((entry) => !entry.published));
});
