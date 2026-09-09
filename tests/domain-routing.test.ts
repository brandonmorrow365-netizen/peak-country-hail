import test from 'node:test';
import assert from 'node:assert/strict';
import {getCanonicalRedirect, secondaryDomainRedirects} from '../src/lib/domain-routing.ts';
import {isProductionHostname, robotsMeta, robotsText} from '../src/lib/seo.ts';

test('secondary apex and www domains redirect directly to canonical destinations', () => {
  for (const [domain, path] of Object.entries(secondaryDomainRedirects)) {
    const expected = `https://peakcountryhail.com${path}`;
    assert.equal(getCanonicalRedirect(`https://${domain}/unrelated/path`), expected);
    assert.equal(getCanonicalRedirect(`http://www.${domain}/anything`), expected);
  }
});

test('secondary redirects preserve query strings without preserving irrelevant paths', () => {
  assert.equal(
    getCanonicalRedirect('http://www.greeleyhail.com/old-page?utm_source=truck&ref=review'),
    'https://peakcountryhail.com/hail-tracker/greeley/?utm_source=truck&ref=review',
  );
});

test('canonical host normalizes HTTP and www in one hop while preserving path and query', () => {
  const destination = 'https://peakcountryhail.com/paintless-dent-repair/?source=review';
  assert.equal(getCanonicalRedirect('http://peakcountryhail.com/paintless-dent-repair/?source=review'), destination);
  assert.equal(getCanonicalRedirect('https://www.peakcountryhail.com/paintless-dent-repair/?source=review'), destination);
  assert.equal(getCanonicalRedirect('http://www.peakcountryhail.com/paintless-dent-repair/?source=review'), destination);
});

test('canonical HTTPS and preview hosts do not redirect', () => {
  assert.equal(getCanonicalRedirect('https://peakcountryhail.com/about/'), null);
  assert.equal(getCanonicalRedirect('https://abc-peak-country-hail-preview.example.workers.dev/about/'), null);
  assert.equal(getCanonicalRedirect('http://127.0.0.1:45130/about/'), null);
});

test('production and preview indexing directives are environment aware', () => {
  assert.equal(isProductionHostname('peakcountryhail.com'), true);
  assert.equal(robotsMeta('peakcountryhail.com'), 'index, follow');
  assert.equal(robotsMeta('peakcountryhail.com', true), 'noindex, nofollow');
  assert.equal(robotsMeta('preview-peak-country.workers.dev'), 'noindex, nofollow');
  assert.match(robotsText('production'), /User-agent: \*\nAllow: \/[\s\S]*Sitemap: https:\/\/peakcountryhail\.com\/sitemap\.xml/);
  assert.equal(robotsText('preview'), 'User-agent: *\nDisallow: /\n');
});
