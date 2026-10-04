import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
const read = path => readFileSync(new URL(path, import.meta.url), 'utf8');
for (const name of ['index.html', 'guide.html', 'usage_fee.html', 'for_zero.html', 'belongings.html', 'faq.html', 'room.html', 'facility_outline.html', 'access.html', 'babysitter.html', 'salon.html']) {
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
assert.equal((read('faq.html').match(/<summary>/g) || []).length, 7);
for (const text of ['1812879','1週間以内','身分証','切り取らず','備考欄']) assert(read('faq.html').includes(text), text);
for (const text of ['2〜3枚','11:30〜12:00','15時','変更がなければ','資格情報']) assert(read('belongings.html').includes(text), text);
assert(!read('for_zero.html').includes('1,100円'));
for (const name of ['index.html','guide.html','usage_fee.html']) for (const old of ['for_zero','belongings','faq']) assert(!read(name).includes(`href="https://hiyocoroom.com/${old}/"`));
assert.equal((read('room.html').match(/class="day-row"/g)||[]).length,6);
assert.equal((read('room.html').match(/<figure>/g)||[]).length,12);
for(const text of ['2020年6月15日','認可外保育施設','保育スタッフ8名','第59条']) assert(read('facility_outline.html').includes(text));
assert(!read('index.html').includes('href="https://hiyocoroom.com/view_of_the_building/"'));
const access = read('access.html');
assert.equal((access.match(/<figure>/g)||[]).length,4);
for(const text of ['看板の横','赤い建物','突き当たり','インターホン','備考欄','近隣の通路','output=embed']) assert(access.includes(text),text);
assert(!access.includes('2階がnoka'));
assert(home.includes('href="access.html"'));
const sitter=read('babysitter.html');
for(const text of ['7:00〜9:00','4,400円','2,400円','4,000円','2,000円','12歳以下','往復','3日以内','対象外','最高1億円','伊東 桜','2025年12月1日']) assert(sitter.includes(text),text);
assert.equal((sitter.match(/<table /g)||[]).length,2);
assert.equal((sitter.split('id="sitter-provider"')[1].match(/<dt>/g)||[]).length,12);
assert(!sitter.includes('https://select-type.com/rsv/'));
assert(sitter.includes('ベビーシッター利用規約.pdf'));
assert(home.includes('href="babysitter.html"'));
const salon=read('salon.html');
for(const text of ['https://noka-youga.jp/','外部講師','みきこ','稗田 洋子','予約・料金が別','お子さま連れでなくても','salon_teachers/','view_of_the_salon/']) assert(salon.includes(text),text);
assert(!salon.includes('コーチング'));
assert(home.includes('href="salon.html"'));
console.log('PASS: eleven pages, internal links, service conditions and consultation routes');
