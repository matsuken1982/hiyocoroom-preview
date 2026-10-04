import { readFileSync, writeFileSync } from 'node:fs';

// Keep the approved v4 comparison intact; generate the working pages from it.
const template = readFileSync(new URL('./top-mock-v4.html', import.meta.url), 'utf8');
const routes = new Map([
  ['https://hiyocoroom.com/usage_fee/', 'usage_fee.html'],
  ['https://hiyocoroom.com/for_zero/', 'for_zero.html'],
  ['https://hiyocoroom.com/belongings/', 'belongings.html'],
  ['https://hiyocoroom.com/faq/', 'faq.html'],
]);
function links(html) {
  for (const [from, to] of routes) html = html.replaceAll(`href="${from}"`, `href="${to}"`);
  return html;
}
const extraStyle = `<style>
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
