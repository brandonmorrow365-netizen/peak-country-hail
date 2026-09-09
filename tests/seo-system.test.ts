import test from 'node:test';
import assert from 'node:assert/strict';
import { contentMeta } from '../src/data/contentMeta.ts';
import { pageGraph, schemaIds } from '../src/lib/schema.ts';
import { robotsText } from '../src/lib/seo.ts';
import { site } from '../src/data/site.ts';
import { canonicalIndexNowUrls } from '../scripts/indexnow-lib.mjs';
import { publishedCaseStudies } from '../src/data/caseStudies.ts';
import { locationPages } from '../src/data/locationPages.ts';
import { portfolioRepairs } from '../src/data/gallery.ts';
import { GET as getPortfolioFeed } from '../src/pages/automation/repair-portfolio-feed.json.ts';
import { existsSync } from 'node:fs';

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

test('historical portfolio keeps grouped repairs, paired ordering, and context images', () => {
  assert.deepEqual(portfolioRepairs.map((repair) => repair.vehicle), ['2013 Chevrolet Silverado','Toyota 4Runner','Nissan Murano','Lexus RX']);
  const counts = portfolioRepairs.map((repair) => ({
    vehicle: repair.vehicle,
    before: repair.photos.filter((photo) => photo.state === 'before').length,
    after: repair.photos.filter((photo) => photo.state === 'after').length,
  }));
  assert.deepEqual(counts, [
    {vehicle:'2013 Chevrolet Silverado',before:3,after:3},
    {vehicle:'Toyota 4Runner',before:2,after:2},
    {vehicle:'Nissan Murano',before:3,after:2},
    {vehicle:'Lexus RX',before:2,after:1},
  ]);
  for (const repair of portfolioRepairs) {
    assert.ok(repair.photos.length >= 2);
    assert.ok(repair.photos.some((photo) => photo.state === 'before'));
    assert.ok(repair.photos.some((photo) => photo.state === 'after'));
    const order = repair.photos.map((photo) => `${photo.angle}-${photo.state}`);
    assert.deepEqual(order, [...order].sort((a,b) => Number(a[0])-Number(b[0]) || (a.endsWith('before') ? -1 : 1)));
    assert.equal(new Set(repair.photos.map((photo) => `${repair.repairId}:${photo.state}:${photo.angle}`)).size, repair.photos.length);
  }
});

test('portfolio automation feed exposes stable public media without Drive identifiers', async () => {
  const response = await getPortfolioFeed({} as never);
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type') ?? '', /^application\/json/);
  const feed = await response.json() as { website:string; repairs:Array<{repairId:string;images:Array<{imageId:string;role:string;angle:number;publicUrl:string;altText:string}>}> };
  assert.equal(feed.website, 'https://peakcountryhail.com');
  assert.equal(feed.repairs.length, 4);
  assert.equal(feed.repairs.flatMap((repair) => repair.images).length, 18);
  for (const repair of feed.repairs) {
    assert.ok(repair.images.length >= 2);
    for (const image of repair.images) {
      assert.equal(image.imageId, `${repair.repairId}:${image.role}:${image.angle}`);
      assert.match(image.publicUrl, new RegExp(`^https://peakcountryhail\\.com/media/portfolio/${repair.repairId}/(?:before|after)-angle-\\d+\\.webp$`));
      assert.ok(image.altText.length > 20);
      assert.ok(!image.publicUrl.includes('drive.google.com'));
      assert.ok(existsSync(`public${new URL(image.publicUrl).pathname}`));
    }
  }
});
