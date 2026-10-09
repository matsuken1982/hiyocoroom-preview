import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
const read = path => readFileSync(new URL(path, import.meta.url), 'utf8');
const news = JSON.parse(read('news-data.json'));
assert.equal(news.length,27);
assert(!news.some(article => article.title.includes('月極料金')));
for (const name of ['index.html', 'guide.html', 'usage_fee.html', 'for_zero.html', 'belongings.html', 'faq.html', 'room.html', 'facility_outline.html', 'access.html', 'babysitter.html', 'salon.html', 'recruit.html', 'contact.html', 'childcare_teachers.html', 'terms_of_use.html', 'privacypolicy.html', 'news.html', ...news.map(article=>article.file)]) {
  const html = read(name);
  assert.equal((html.match(/<h1[ >]/g) || []).length, 1, name);
  assert(html.includes('name="robots" content="noindex,nofollow"'), name);
  assert(html.includes('id="main-content"'), name);
  assert(!html.includes('2026年度受付中'), name);
  assert(html.includes('href="recruit.html"'), name);
  for (const [, href] of html.matchAll(/href="([^"#?:]+\.html)(?:#[^"]*)?"/g)) {
    assert(existsSync(new URL(href, import.meta.url)), `${name}: ${href}`);
  }
}
const home = read('index.html');
assert(!home.includes('data-slide="'));
assert(home.includes('id="pause"'));
assert(home.includes('id="operator-message"'));
assert(home.includes('id="parent-voices"'));
assert(home.includes('href="childcare_teachers.html"'));
assert(!home.includes('href="https://hiyocoroom.com/childcare_teachers/"'));
assert.equal((read('teachers-content.html').match(/<figure>/g)||[]).length,13);
assert.equal((read('teachers-content.html').split('owner-roster')[0].match(/<figure>/g)||[]).length,11);
assert(!read('childcare_teachers.html').includes('保育士'));
const voices=home.split('<section id="parent-voices"')[1].split('</section>')[0];
const expectedVoices=[
  '親から離れて過ごす初めての場所が、ひよこルームで本当によかったです。いつも温かい雰囲気で、愛情を持って接してくださり、ありがとうございました。',
  '久々だったのでドキドキしていましたが、いつもスタッフの方たちが明るく優しく迎えてくださるので、子どももすぐになじんで、楽しく過ごせたんだと思います。その日の様子をお迎えのときも、メールでもたくさん伝えてくださるので、想像して微笑ましく、うれしいです。'
];
assert.deepEqual([...voices.matchAll(/<blockquote><p>(.*?)<\/p><\/blockquote>/g)].map(m=>m[1]),expectedVoices);
assert.equal((voices.match(/<p class="voice-attribution">ご利用の保護者より<\/p>/g)||[]).length,2);
assert(!/<h3|架空|歳児|sample-label/.test(voices));
assert(voices.includes('本番サイトへの掲載前に最終確認'));
assert(home.includes("h1,h2,h3,h4,h5,h6,.noka h3{font-family:'Noto Sans JP',sans-serif}"));
assert(home.includes('運営者が確認・承認したメッセージではありません'));
for(const purpose of ['自分をいたわる時間に','親子で音楽を楽しむ','身体を動かす時間に']){assert(home.includes(purpose));assert(read('salon.html').includes(purpose));}
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
for(const id of ['salon-noka','rhythm','pilates']){assert(home.includes(`href="salon.html#${id}"`));assert(read('salon.html').includes(`id="${id}"`));}
const recruit=read('recruit.html');
for(const text of ['時給1,300円','時給1,400円','1日3時間','交通費支給','社員登用','未経験','ブランク','保育士資格','href="#recruit-apply"','href="contact.html"']) assert(recruit.includes(text),text);
for(const text of ['1,200円','確認待ち','未公開','select-type.com/rsv']) assert(!recruit.includes(text),text);
const contact=read('contact.html');
for(const text of ['MNkl-XAY-mU','数日','9:00〜17:00','フォームが表示されない','title="ひよこルームのお問い合わせフォーム','href="salon.html"']) assert(contact.includes(text),text);
assert(!contact.includes('<input'));
assert(home.includes('href="contact.html"'));
for(const article of news){assert(read('news.html').includes(article.file));assert(read(article.file).includes('掲載当時'));assert(read(article.file).includes(article.date));}
for(const text of ['1812879','健康保険証','保育士の子ども']) assert(read('terms_of_use.html').includes(text),text);
for(const text of ['自動の健全な育成','2022年2月19日','Cookie']) assert(read('privacypolicy.html').includes(text),text);
const review=read('review.html');
assert.equal((review.match(/data-title=/g)||[]).length,8);
assert(!review.includes('localStorage'));
assert(!review.includes('<form'));
assert(!review.includes('fetch('));
assert(!review.match(/<textarea[^>]*>[^<]+<\/textarea>/));
console.log('PASS: 44 site pages, 27 news records, 13 people, exact preview testimonials, heading font and salon links');
