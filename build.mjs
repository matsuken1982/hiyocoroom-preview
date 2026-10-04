import { readFileSync, writeFileSync } from 'node:fs';

// Keep the approved v4 comparison intact; generate the working pages from it.
const template = readFileSync(new URL('./top-mock-v4.html', import.meta.url), 'utf8');
const routes = new Map([
  ['https://hiyocoroom.com/access/', 'access.html'],
  ['https://hiyocoroom.com/usage_fee/', 'usage_fee.html'],
  ['https://hiyocoroom.com/for_zero/', 'for_zero.html'],
  ['https://hiyocoroom.com/belongings/', 'belongings.html'],
  ['https://hiyocoroom.com/faq/', 'faq.html'],
  ['https://hiyocoroom.com/facility_outline/', 'facility_outline.html'],
  ['https://hiyocoroom.com/view_of_the_building/', 'room.html#building'],
  ['https://hiyocoroom.com/room_and_childcare/', 'room.html#childcare'],
]);
function links(html) {
  html = html.replace(/href="(?:index\.html)?#access"/g, 'href="access.html"');
  for (const [from, to] of routes) html = html.replaceAll(`href="${from}"`, `href="${to}"`);
  return html;
}
const extraStyle = `<style>
.route-list img{height:auto}
.route-list{list-style:none;margin:28px 0 0;padding:0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:40px 32px}.route-list figure{margin:0}.route-list img{display:block;width:100%;aspect-ratio:4/5;object-fit:contain;background:#f0f2ef;border-radius:4px}.route-list figcaption{margin-top:16px}.route-list h3{display:flex;align-items:center;gap:12px;font-size:21px;margin:0 0 10px}.route-num{display:inline-grid;place-items:center;width:32px;height:32px;flex-shrink:0;background:var(--yellow);border-radius:50%;font:700 16px sans-serif}.access-map{display:block;width:100%;height:360px;border:1px solid var(--line);margin:24px 0}.route-list p{font-size:15px}@media(max-width:700px){.route-list{grid-template-columns:1fr;gap:32px}.access-map{height:280px}}
.tour-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:32px 24px}.tour-grid figure{margin:0}.tour-grid img{width:100%;height:310px;object-fit:contain;background:#f0f2ef}.tour-grid figcaption{margin-top:12px;font-size:14px}.tour-grid h3{font-size:20px;margin:0 0 8px}.outline-list{margin:0}.outline-list>div{display:grid;grid-template-columns:150px 1fr;gap:24px;padding:18px 0;border-bottom:1px solid var(--line)}.outline-list dt{font-weight:700}.outline-list dd{margin:0}.room-day{display:block}.room-day dl{max-width:650px;margin-top:24px}@media(max-width:700px){.tour-grid{grid-template-columns:1fr}.tour-grid img{height:340px}.outline-list>div{grid-template-columns:95px 1fr;gap:14px}}
.skip-link{position:fixed;top:-100px;left:12px;z-index:100;background:white;padding:12px}.skip-link:focus{top:12px}
.page-intro{padding:36px 0 42px;border-bottom:1px solid var(--line);background:var(--green)}
.breadcrumb{font-size:13px;margin-bottom:24px}.page-intro h1{font-size:36px;line-height:1.5}.page-intro p{margin-top:16px;max-width:720px}
.reading{max-width:820px}.reading h2{margin-bottom:20px}.reading h3{margin:24px 0 10px}.reading p+p{margin-top:16px}.reading li{margin:8px 0}
.fee-table{width:100%;border-collapse:collapse;margin:20px 0;font-size:16px}.fee-table th,.fee-table td{padding:16px 12px;border-bottom:1px solid var(--line);text-align:right}.fee-table th:first-child,.fee-table td:first-child{text-align:left}.fee-table thead{background:var(--green)}.fee-table caption{text-align:left;font-size:14px;color:var(--muted);margin-bottom:10px}
.section-links{display:flex;flex-wrap:wrap;gap:12px 24px;padding:20px 0}.conditions{border-left:4px solid var(--yellow);padding-left:20px;margin:24px 0}.reading .actions{margin-top:24px}
.faq-item{border-bottom:1px solid var(--line);padding:18px 0}.faq-item summary{cursor:pointer;font-weight:700;padding:8px 0;line-height:1.7}.faq-item summary:focus-visible{outline:3px solid #296380;outline-offset:4px}.faq-answer{padding:16px 0 4px}.faq-answer p{margin-bottom:12px}.packing-list{list-style:none;padding:0;margin:0}.packing-list li{padding:16px 0;border-bottom:1px solid var(--line);margin:0}.packing-list strong{display:block}.packing-list p{font-size:14px;margin-top:6px}.reading a{overflow-wrap:anywhere}.bank-details{margin:18px 0;padding:16px 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}.bank-details div{display:grid;grid-template-columns:110px 1fr;gap:12px}.bank-details dd{margin:0}.intro-photo{margin:24px 0}.intro-photo img{width:100%;aspect-ratio:16/7;object-fit:cover;border-radius:4px}.intro-photo figcaption{font-size:13px;color:var(--muted);margin-top:8px}
@media(max-width:700px){.page-intro h1{font-size:29px}.fee-table{font-size:14px}.fee-table th,.fee-table td{padding:14px 5px}.reading h2{font-size:24px}}
</style>`;
const headEnd = template.indexOf('<main>');
const footStart = template.indexOf('</main>') + '</main>'.length;
let header = template.slice(0, headEnd);
let footer = template.slice(footStart);
const menuScript = template.slice(template.indexOf("const toggle="), template.indexOf("const slides="));
footer = footer.replace(/<script>[\s\S]*?<\/script>/, `<script>${menuScript}</script>`);
function common(html, title, description) {
  return links(html).replace(/<title>.*?<\/title>/, `<title>${title} | ひよこルーム</title>\n<meta name="description" content="${description}">`)
    .replace('</head>', extraStyle + '</head>')
    .replace('<body id="top">', '<body id="top"><a class="skip-link" href="#main-content">本文へ</a>');
}
function subpage(name, title, description, body) {
  let html = header + `<main id="main-content"><div class="page-intro"><div class="wrap reading"><nav class="breadcrumb" aria-label="パンくず"><a href="index.html">ホーム</a> / ${title}</nav><h1>${title}</h1><p>${description}</p></div></div>${body}</main>` + footer;
  html = html.replace(/href="#(top|features|room|guide|services|news|access)"/g, 'href="index.html#$1"');
  html = html.replaceAll('href="index.html#guide"', 'href="guide.html"');
  writeFileSync(new URL(name, import.meta.url), common(html, title, description));
}
let home = template.replace('<main>', '<main id="main-content">');
home = home.replaceAll('href="#guide"', 'href="guide.html"');
home = home.replace('<div class="guide-links">', '<div class="guide-links"><a class="btn" href="guide.html">ご利用の流れを見る</a>');
writeFileSync(new URL('index.html', import.meta.url), common(home, '用賀の一時預かり保育', '用賀駅から徒歩3分。0歳から未就学児まで、必要な時間にご利用いただける一時預かり保育施設です。'));
subpage('guide.html', 'ご利用案内', 'ご予約から当日のお迎えまでをご案内します。お仕事だけでなく、通院や美容室、ご自身の時間にもご利用ください。', readFileSync(new URL('guide-content.html', import.meta.url), 'utf8'));
subpage('usage_fee.html', 'ご利用料金', '一時預かりは1時間から、30分単位でご利用いただけます。通常料金と、平日のお得プランをご案内します。', readFileSync(new URL('fees-content.html', import.meta.url), 'utf8'));
subpage('for_zero.html', '0歳児のご利用', 'ひよこルームでは、0歳のお子さまも施設でお預かりしています。ホームページからご予約いただけます。', readFileSync(new URL('zero-content.html', import.meta.url), 'utf8'));
subpage('belongings.html', '保育当日のお持ち物', '毎回のお持ち物と、年齢・ご利用時間に応じて必要なもの、初回の確認書類をご案内します。', readFileSync(new URL('belongings-content.html', import.meta.url), 'utf8'));
subpage('faq.html', 'よくある質問', 'ご予約や料金、お預かり、お迎えについて、よくいただくご質問をまとめました。', readFileSync(new URL('faq-content.html', import.meta.url), 'utf8'));
subpage('access.html', 'アクセス', '用賀駅から徒歩3分。道沿いの看板から少し奥に入った一軒家です。写真で入口までをご案内します。', readFileSync(new URL('access-content.html', import.meta.url), 'utf8'));
subpage('facility_outline.html', '施設概要', '用賀駅から徒歩3分。0歳から未就学のお子さまをお預かりする、定員7名の一時預かり保育施設です。', readFileSync(new URL('facility-content.html', import.meta.url), 'utf8'));
const tourPhotos = [
  ['building','建物・入口・設備',[
    ['2024/06/IMG_9386-1-731x1024.jpeg','建物の外観','私道に面した建物です。'],
    ['2021/01/engawa-768x1024.jpg','縁側とお庭','縁側のあるお庭。夏にはプール遊びもします。'],
    ['2021/02/5-1.jpg','広い玄関','お子さまの靴の着脱やお引き渡しを、ゆったりと行える玄関です。'],
    ['2024/06/IMG_9286-scaled.jpeg','洗面所','木のぬくもりを感じる洗面所です。'],
    ['2021/02/h-2.jpg','2階のサロン','サロン・レッスンのご利用とあわせて、一時預かりもご利用いただけます。託児の予約・料金は別途ご確認ください。'],
    ['2024/06/IMG_9210-scaled.jpeg','駐車・駐輪スペース','駐車場は1台分。自転車も停められます。駐車場をご希望の方は、予約時に備考欄へご記入ください。']]],
  ['childcare','保育室と日々の遊び',[
    ['2023/05/IMG_5808-768x1024.jpeg','お庭での遊び','お庭で遊ぶこともあります。敷き詰められた石は、子どもたちに人気です。'],
    ['2023/05/IMG_6746-768x1024.jpeg','おもちゃ','さまざまな年齢に対応したおもちゃをご用意しています。'],
    ['2023/05/IMG_9366-768x1024.jpeg','異年齢で過ごす時間','さまざまな年齢のお子さまと交流しながら過ごします。'],
    ['2023/05/IMG_5439-768x1024.jpeg','みんなで遊ぶ保育室','15畳の保育室で、みんなで遊びます。'],
    ['2023/12/IMG_4239-768x1024.jpeg','日差しの入るお部屋','冬は暖かい日差しが入り、床暖房のある保育室で過ごします。'],
    ['2023/05/IMG_6153-768x1024.jpeg','少人数の保育','定員7名。常時2〜3名の保育スタッフでお預かりしています。']]]
];
const photoSections = tourPhotos.map(([id,title,photos]) => `<section id="${id}" class="band"><div class="wrap"><h2>${title}</h2><div class="tour-grid" style="margin-top:28px">${photos.map(([path,name,caption])=>`<figure><img src="https://hiyocoroom.com/wp-content/uploads/${path}" alt="${name}" loading="lazy"><figcaption><h3>${name}</h3><p>${caption}</p></figcaption></figure>`).join('')}</div></div></section>`).join('');
// Reuse the approved schedule so the overview and detail cannot drift apart.
const day = template.slice(template.indexOf('<div class="day">'), template.indexOf('<div class="teachers">')).replace('class="day"', 'class="day room-day"').replace('<h3>園での1日</h3>', '<h2>園での1日</h2>');
subpage('room.html', '園の様子', '建物やお庭、保育室での遊び、お子さまが過ごす1日をご紹介します。', `<div class="wrap"><nav class="section-links" aria-label="園の紹介メニュー"><a href="#building">建物・設備</a><a href="#childcare">保育室・遊び</a><a href="#one-day">園での1日</a></nav></div>${photoSections}<section id="one-day" class="band green"><div class="wrap reading">${day}</div></section><section class="band"><div class="wrap reading"><h2>ご利用前のご案内</h2><div class="actions"><a class="btn" href="facility_outline.html">施設概要</a><a class="btn" href="guide.html">ご利用案内</a><a class="btn" href="belongings.html">保育当日のお持ち物</a><a class="btn" href="https://hiyocoroom.com/access/">アクセス</a><a class="btn" href="https://hiyocoroom.com/salon_schedule/">サロン・レッスン</a></div></div></section>`);
