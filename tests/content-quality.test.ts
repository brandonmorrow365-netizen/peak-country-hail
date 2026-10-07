import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { contentMeta } from '../src/data/contentMeta.ts';

const read = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8');
const faq = read('../src/pages/faq/index.astro');
const servicePages = read('../src/data/servicePages.ts');
const hailSizeGuide = read('../src/pages/hail-size-guide/index.astro');
const publicContent = `${faq}\n${servicePages}\n${hailSizeGuide}`;

test('content improvements do not expand the canonical route registry', () => {
  assert.equal(contentMeta.length, 29);
  assert.equal(new Set(contentMeta.map(({ path }) => path)).size, 29);
});

test('Free Initial Assessment remains free, optional, and distinct from paid documentation', () => {
  assert.match(faq, /Free Initial Assessment before or after contacting your insurer/);
  assert.match(faq, /There is no obligation or automatic charge simply for starting the conversation/);
  assert.doesNotMatch(publicContent, /free estimate/i);
});

test('visible FAQs remain the source for FAQPage structured data', () => {
  assert.match(faq, /const faqs = \[\.\.\.repairFaqs, \.\.\.insuranceFaqs, \.\.\.localFaqs\]/);
  assert.match(faq, /mainEntity: faqs\.map\(\(\[name, text\]\) =>/);
});

test('insurance guidance avoids payment promises and limits shop-choice wording to process', () => {
  assert.match(faq, /An insurer-recommended facility is not a prerequisite for contacting Peak Country/);
  assert.match(faq, /confirm any policy, claim, network, or payment requirements directly with your insurer/);
  assert.match(faq, /No repair estimate can guarantee insurance coverage or reimbursement/);
  assert.doesNotMatch(publicContent, /(?:guarantee|promise)s? (?:that )?(?:an |the )?insurer (?:will )?pay/i);
});

test('weather reports remain context rather than proof of vehicle damage', () => {
  assert.match(hailSizeGuide, /size alone cannot determine whether a particular vehicle was damaged/);
  assert.match(hailSizeGuide, /Two vehicles in the same neighborhood can therefore show different damage, or no damage/);
  assert.match(faq, /does not prove that a specific vehicle was struck or damaged/);
});
