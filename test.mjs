import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
const read = path => readFileSync(new URL(path, import.meta.url), 'utf8');
for (const name of ['index.html', 'guide.html', 'usage_fee.html']) {
  const html = read(name);
  assert.equal((html.match(/<h1[ >]/g) || []).length, 1, name);
  assert(html.includes('name="robots" content="noindex,nofollow"'), name);
  assert(html.includes('id="main-content"'), name);
  assert(!html.includes('2026年度受付中'), name);
  for (const [, href] of html.matchAll(/href="([^"#?:]+\.html)(?:#[^"]*)?"/g)) {
    assert(existsSync(new URL(href, import.meta.url)), `${name}: ${href}`);
  }
}
const home = read('index.html');
assert.equal((home.match(/class="day-row"/g) || []).length, 6);
assert(home.includes('href="guide.html"'));
assert(home.includes('href="usage_fee.html"'));
assert(!read('guide.html').includes('const slides='));
const fees = read('usage_fee.html');
for (const price of ['1,150円','1,550円','950円','1,350円','850円','1,250円','18,500円','36,000円','52,500円','68,000円']) assert(fees.includes(price), price);
assert(fees.includes('ベネフィット・ワンとの併用はできません'));
assert(!fees.includes('2025年1月'));
console.log('PASS: three pages, local links, schedule, fee amounts and preview indexing rules');
