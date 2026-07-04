// Dependency-free static site generator. `node build.js` -> dist/
// Single source of truth: data.json. Change data, rebuild, done.
const fs = require("fs");
const path = require("path");

const data = JSON.parse(fs.readFileSync(path.join(__dirname, "data.json"), "utf8"));
const { site, tools, faq, diagnosis, disclosure } = data;
const out = path.join(__dirname, "dist");
fs.mkdirSync(out, { recursive: true });

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const li = (arr) => arr.map((x) => `<li>${esc(x)}</li>`).join("");

// affiliate link: real sponsored link if configured, else fall back to official
const linkFor = (t) => {
  const a = t.affiliate_url || "";
  const isReal = a && !a.startsWith("REPLACE") && !a.startsWith("LEAVE");
  const url = isReal ? a : t.official_url;
  const rel = isReal ? "sponsored nofollow noopener" : "nofollow noopener";
  const label = isReal ? "公式サイトで見る（PR）" : "公式サイトで見る";
  return `<a class="cta" href="${esc(url)}" target="_blank" rel="${rel}">${label} →</a>`;
};

const cards = tools
  .map(
    (t) => `
  <article class="card" id="${esc(t.id)}">
    <div class="card-head">
      <h3>${esc(t.name)}</h3>
      ${t.sponsored ? '<span class="pr">PR</span>' : ""}
    </div>
    <p class="verdict">${esc(t.verdict)}</p>
    <dl>
      <dt>料金</dt><dd>${esc(t.price)}</dd>
      <dt>精度・特徴</dt><dd>${esc(t.accuracy)}</dd>
    </dl>
    <p class="good">◎ 向いている人</p><ul>${li(t.best_for)}</ul>
    <p class="bad">△ 向かない人</p><ul>${li(t.not_for)}</ul>
    ${linkFor(t)}
  </article>`
  )
  .join("");

const diagBlock = diagnosis
  .map(
    (d) => `
  <div class="diag">
    <p class="diag-q">${esc(d.q)}</p>
    <div class="diag-opts">
      ${d.a.map((o) => `<button data-pick="${esc(o.pick)}">${esc(o.label)}</button>`).join("")}
    </div>
    <p class="diag-result" hidden>→ おすすめ: <a href="#" class="diag-link"></a></p>
  </div>`
  )
  .join("");

const faqBlock = faq.map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join("");

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const title = `${site.brand} 2026 | 向かない人まで書く正直ランキング`;
const desc = site.tagline;

const html = `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${esc(site.domain)}/">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:type" content="website">
<meta property="og:locale" content="ja_JP">
<meta name="robots" content="index,follow">
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
<style>
:root{--bg:#0e1116;--fg:#e6e9ef;--mut:#9aa4b2;--card:#161b22;--acc:#4f8cff;--good:#3fb950;--bad:#e3a008;--line:#232a35}
@media (prefers-color-scheme:light){:root{--bg:#f7f8fa;--fg:#1a1f29;--mut:#5b6472;--card:#fff;--acc:#2563eb;--line:#e6e9ef}}
*{box-sizing:border-box}body{margin:0;font-family:system-ui,-apple-system,"Hiragino Kaku Gothic ProN",sans-serif;background:var(--bg);color:var(--fg);line-height:1.7}
.wrap{max-width:880px;margin:0 auto;padding:0 18px}
header{padding:48px 0 24px;text-align:center}
h1{font-size:1.7rem;margin:0 0 10px}.tag{color:var(--mut);margin:0 auto;max-width:640px}
.disc{font-size:.8rem;color:var(--mut);border:1px solid var(--line);border-radius:8px;padding:10px 14px;margin:22px auto;max-width:760px}
h2{font-size:1.3rem;margin:44px 0 14px;border-bottom:2px solid var(--line);padding-bottom:6px}
.card{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:18px 20px;margin:14px 0}
.card-head{display:flex;align-items:center;gap:10px}.card h3{margin:0;font-size:1.2rem}
.pr{font-size:.65rem;background:var(--acc);color:#fff;border-radius:4px;padding:2px 6px;font-weight:700}
.verdict{font-weight:600;margin:.4em 0 .8em}
dl{display:grid;grid-template-columns:5.5em 1fr;gap:4px 10px;margin:.6em 0;font-size:.92rem}
dt{color:var(--mut)}dd{margin:0}
.good{color:var(--good);font-weight:700;margin:.8em 0 .2em}.bad{color:var(--bad);font-weight:700;margin:.8em 0 .2em}
.card ul{margin:.2em 0 .4em;padding-left:1.2em}.card li{font-size:.9rem}
.cta{display:inline-block;margin-top:12px;background:var(--acc);color:#fff;text-decoration:none;padding:9px 16px;border-radius:8px;font-weight:600;font-size:.92rem}
.diag{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:18px 20px}
.diag-q{font-weight:700;margin:0 0 12px}.diag-opts{display:flex;flex-wrap:wrap;gap:8px}
.diag-opts button{background:transparent;border:1px solid var(--acc);color:var(--acc);border-radius:20px;padding:8px 14px;cursor:pointer;font-size:.88rem}
.diag-opts button:hover{background:var(--acc);color:#fff}
.diag-result{margin-top:14px;font-weight:700}
details{border:1px solid var(--line);border-radius:8px;padding:10px 14px;margin:8px 0;background:var(--card)}
summary{cursor:pointer;font-weight:600}details p{color:var(--mut);margin:.6em 0 0}
.adslot{border:1px dashed var(--line);border-radius:8px;padding:20px;text-align:center;color:var(--mut);font-size:.8rem;margin:24px 0}
footer{color:var(--mut);font-size:.82rem;text-align:center;padding:40px 0;border-top:1px solid var(--line);margin-top:48px}
a{color:var(--acc)}
</style>
</head>
<body>
<header class="wrap">
  <h1>${esc(site.brand)} 2026</h1>
  <p class="tag">${esc(site.tagline)}</p>
</header>
<main class="wrap">
  <p class="disc">${esc(disclosure)}</p>

  <h2>30秒であなたに最適な1つを診断</h2>
  ${diagBlock}

  <!-- ponytail: AdSense slot. Paste your <ins class="adsbygoogle"> here after approval. -->
  <div class="adslot">［広告スロット / Google AdSense をここに貼る］</div>

  <h2>ツール別・本音レビュー</h2>
  ${cards}

  <h2>よくある質問</h2>
  ${faqBlock}
</main>
<footer class="wrap">
  <p>最終更新 ${esc(site.updated)} ／ ${esc(site.brand)}</p>
  <p>料金・仕様は各公式サイトで最新をご確認ください。本サイトは情報提供を目的とし、正確性を保証するものではありません。</p>
</footer>
<script>
// diagnosis: click -> reveal recommended tool card link
document.querySelectorAll(".diag-opts button").forEach(function(b){
  b.addEventListener("click",function(){
    var box=b.closest(".diag");var pick=b.dataset.pick;
    var card=document.getElementById(pick);var name=card?card.querySelector("h3").textContent:pick;
    var res=box.querySelector(".diag-result");var link=box.querySelector(".diag-link");
    link.textContent=name;link.setAttribute("href","#"+pick);res.hidden=false;
  });
});
</script>
</body>
</html>`;

fs.writeFileSync(path.join(out, "index.html"), html);
fs.writeFileSync(path.join(out, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${site.domain}/</loc><lastmod>${site.updated}</lastmod></url></urlset>`);
fs.writeFileSync(path.join(out, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${site.domain}/sitemap.xml\n`);
fs.writeFileSync(path.join(out, ".nojekyll"), "");

// self-check: every tool must appear in output, title non-empty
for (const t of tools) {
  if (!html.includes(t.name)) throw new Error("build check failed: missing tool " + t.name);
}
if (!/<title>.+<\/title>/.test(html)) throw new Error("build check failed: empty title");
console.log(`OK: dist/index.html (${tools.length} tools, ${(html.length/1024).toFixed(1)}kb)`);
