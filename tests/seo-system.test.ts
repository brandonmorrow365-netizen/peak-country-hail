import test from 'node:test';
import assert from 'node:assert/strict';
import { contentMeta } from '../src/data/contentMeta.ts';
import { pageGraph, schemaIds, serviceNode } from '../src/lib/schema.ts';
import { canonicalPath, canonicalUrl, robotsText } from '../src/lib/seo.ts';
import { site } from '../src/data/site.ts';
import { canonicalIndexNowUrls } from '../scripts/indexnow-lib.mjs';
import { publishedCaseStudies } from '../src/data/caseStudies.ts';
import { locationPages } from '../src/data/locationPages.ts';
import { portfolioPairs, portfolioRepairs } from '../src/data/gallery.ts';
import { GET as getPortfolioFeed } from '../src/pages/automation/repair-portfolio-feed.json.ts';
import { existsSync, readFileSync } from 'node:fs';

test('entity graph uses stable references without private location data', () => {
  const graph = pageGraph('/paintless-dent-repair/', 'Paintless Dent Repair', 'Description');
  const nodes = graph['@graph'] as Record<string, unknown>[];
  const business = nodes.find((node) => node['@id'] === schemaIds.business) as Record<string, unknown>;
  const website = nodes.find((node) => node['@id'] === schemaIds.website) as Record<string, unknown>;
  const page = nodes.find((node) => node['@id'] === `${site.url}/paintless-dent-repair/#webpage`) as Record<string, unknown>;
  const ref = (value: unknown) => (value as Record<string, unknown>)['@id'];
  assert.deepEqual(business['@type'], ['AutoRepair', 'LocalBusiness']);
  assert.equal(ref(website.publisher), schemaIds.business);
  assert.equal(ref(page.isPartOf), schemaIds.website);
  assert.equal(ref(page.about), schemaIds.business);
  assert.equal(business.address, undefined);
  assert.equal(business.geo, undefined);
  assert.equal(business.sameAs, undefined);
  assert.equal((business.contactPoint as Record<string, unknown>).telephone, site.phone);
  assert.equal((business.contactPoint as Record<string, unknown>).email, site.email);
  assert.match(business.description as string, /More than 20 years of professional Paintless Dent Repair experience/);
  assert.match(business.description as string, /more than 25 years of collision-industry experience/);
  const offers = (business.hasOfferCatalog as {itemListElement:Array<{itemOffered:Record<string, unknown>}>}).itemListElement;
  assert.deepEqual(offers.map(({itemOffered}) => itemOffered.url), site.primaryServices.map(({path}) => canonicalUrl(path)));
  assert.equal(ref(page.breadcrumb), `${site.url}/paintless-dent-repair/#breadcrumb`);
});

test('canonical URLs normalize document routes without changing file endpoints', () => {
  assert.equal(canonicalPath('/about'), '/about/');
  assert.equal(canonicalPath('/about/index.html'), '/about/');
  assert.equal(canonicalPath('/feed.xml'), '/feed.xml');
  assert.equal(canonicalUrl('/about?ignored=true'), `${site.url}/about/`);
  assert.equal(canonicalUrl('/'), `${site.url}/`);
});

test('service schema uses the canonical business and mobile service relationships', () => {
  const service = serviceNode('/paintless-dent-repair/','Paintless Dent Repair','Description');
  assert.equal(service['@id'], `${site.url}/paintless-dent-repair/#service`);
  assert.equal(service.serviceType, 'Paintless Dent Repair');
  assert.deepEqual(service.provider, { '@id': schemaIds.business });
  assert.equal((service.availableChannel as Record<string, unknown>).servicePhone, site.phone);
  assert.deepEqual((service.areaServed as Array<Record<string, unknown>>).map((area) => area.name), ['Greeley, Colorado','Weld County, Colorado','Northern Colorado']);
});

test('content metadata contains unique canonical paths and stable ISO dates', () => {
  assert.equal(new Set(contentMeta.map((entry) => entry.path)).size, contentMeta.length);
  for (const entry of contentMeta) {
    assert.match(entry.path, /^\/(?:$|.*\/$)/);
    assert.match(entry.lastmod, /^\d{4}-\d{2}-\d{2}$/);
  }
  assert.ok(!contentMeta.some((entry) => entry.path === '/hail-history/'));
  assert.ok(contentMeta.some((entry) => entry.path === '/hail-status-widget/'));
  assert.ok(!contentMeta.some((entry) => entry.path.startsWith('/embed/')));
});

test('production robots names retrieval crawlers and protects utility paths', () => {
  const text = robotsText('production');
  for (const agent of ['Googlebot','Bingbot','OAI-SearchBot','ChatGPT-User','PerplexityBot','*']) assert.match(text, new RegExp(`User-agent: ${agent.replace('*','\\*')}`));
  assert.match(text, /Disallow: \/api\//);
  assert.match(text, /Disallow: \/__preview\//);
  assert.match(text, /Sitemap: https:\/\/peakcountryhail\.com\/sitemap\.xml/);
  assert.equal(robotsText('preview'), 'User-agent: *\nDisallow: /\n');
});

test('hail widget is noindex, map-free, partner-attributed, and narrowly frameable', () => {
  const embed = readFileSync(new URL('../src/pages/embed/hail-status/index.astro', import.meta.url), 'utf8');
  const docs = readFileSync(new URL('../src/pages/hail-status-widget/index.astro', import.meta.url), 'utf8');
  const worker = readFileSync(new URL('../src/worker.ts', import.meta.url), 'utf8');
  assert.match(embed, /noindex, nofollow/);
  assert.doesNotMatch(embed, /MapLibre|maplibre/);
  assert.match(embed, /utm_campaign=hail-status|widgetTrackerUrl/);
  assert.match(docs, /title="Northern Colorado Hail Status"/);
  assert.match(docs, /loading="lazy"/);
  assert.match(worker, /isPublicHailEmbed/);
  assert.match(worker, /frame-ancestors \*/);
  assert.match(worker, /X-Frame-Options', 'DENY'/);
});

test('public header exposes no manual storm controls and tracker fails closed with shared status logic', () => {
  const header = readFileSync(new URL('../src/components/StormHeader.astro', import.meta.url), 'utf8');
  const tracker = readFileSync(new URL('../src/pages/hail-tracker/index.astro', import.meta.url), 'utf8');
  assert.doesNotMatch(header, /data-storm-pause|data-lightning|Pause motion/);
  assert.match(tracker, /hailWidgetSnapshot\(data\)/);
  assert.doesNotMatch(tracker, /dashboardMode\(currentReports/);
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

test('repair-proof portfolio keeps grouped repairs, paired ordering, context images, and privacy review', () => {
  assert.deepEqual(portfolioRepairs.map((repair) => repair.vehicle), ['2013 Chevrolet Silverado','Nissan Murano','Toyota 4Runner','Lexus RX']);
  const counts = portfolioRepairs.map((repair) => ({
    vehicle: repair.vehicle,
    before: repair.photos.filter((photo) => photo.state === 'before').length,
    after: repair.photos.filter((photo) => photo.state === 'after').length,
  }));
  assert.deepEqual(counts, [
    {vehicle:'2013 Chevrolet Silverado',before:3,after:3},
    {vehicle:'Nissan Murano',before:3,after:2},
    {vehicle:'Toyota 4Runner',before:2,after:2},
    {vehicle:'Lexus RX',before:2,after:1},
  ]);
  for (const repair of portfolioRepairs) {
    assert.ok(repair.photos.length >= 2);
    assert.ok(repair.photos.some((photo) => photo.state === 'before'));
    assert.ok(repair.photos.some((photo) => photo.state === 'after'));
    assert.equal(repair.privacyReviewed, true);
    const order = repair.photos.map((photo) => `${photo.angle}-${photo.state}`);
    assert.deepEqual(order, [...order].sort((a,b) => Number(a[0])-Number(b[0]) || (a.endsWith('before') ? -1 : 1)));
    assert.equal(new Set(repair.photos.map((photo) => `${repair.repairId}:${photo.state}:${photo.angle}`)).size, repair.photos.length);
    assert.equal(portfolioPairs(repair).length, repair.photos.filter((photo) => photo.state === 'before').length);
    assert.ok(portfolioPairs(repair).some((pair) => pair.after));
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
