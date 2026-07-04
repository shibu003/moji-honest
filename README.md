# 文字起こしAI 本音比較（moji-honest）

「向かない人まで書く」正直な文字起こしAI比較サイト。アフィリエイト（Notta等）+ AdSense で長期に稼ぐための、依存ゼロ・静的サイトの収益インフラ。

**なぜ勝てるか（whitespace）**: 英語圏の「AIについてのAI比較」は飽和。ここは *日本語 × 非エンジニア × 高購買意欲ニッチ × 正直レビュー*。競合の多くはアフィ目的の提灯記事 → 「向かない人」を明記する正直さ + 診断ツールで信頼を取る counter-position。

## 仕組み（大きな1部品）
- `data.json` … 唯一の真実。ツール・料金・向く/向かない・アフィリンクを全部ここに。
- `build.js` … 依存ゼロ。`node build.js` で `dist/` に SEO対応の静的HTML・sitemap・robots を生成。
- `.github/workflows/deploy.yml` … push すると GitHub Pages に自動デプロイ。

更新運用 = 料金が変わったら `data.json` を1か所直して push。それだけ。

## あなたが稼ぐためにやる5分（ここだけ私＝AIには代行不可）
1. **A8.net に無料登録** → Notta と提携申請（承認後、あなた専用リンクが出る）。他ツールも A8/もしもアフィリエイト で提携可能なものは提携。
2. `data.json` の各ツール `affiliate_url` の `REPLACE_...` を、あなたのアフィリンクに置換。提携しないものは `LEAVE_OFFICIAL` のままで公式リンクにフォールバックする（実装済み）。
3. `node build.js` → `git commit -am "affiliate links" && git push`。自動デプロイされる。
4. **収益を伸ばす（任意・後で）**
   - Google AdSense に申請 → 承認後、`build.js` の `adslot` コメント箇所に広告タグを貼る。
   - 独自ドメイン（年1,000円程度）を取り、`data.json` の `site.domain` を書き換え、Pages にカスタムドメイン設定。SEO/信頼が上がる。
   - Google Search Console にサイト登録 → `sitemap.xml` を送信（インデックス促進）。
5. **横展開**: `data.json` を別ニッチ（例: AI画像生成 / AI議事録以外の SaaS）に差し替えれば同じエンジンで2サイト目・3サイト目。エンジンが資産。

## 正直な期待値（誇張しない）
- 新規ドメインの SEO は数か月かけて効く。「長期インフラ」前提。即金ではない。
- 収益 = トラフィック × 購買意欲 × アフィ単価。Notta級の高単価 SaaS を月10〜20件成約で月1万円〜が現実的な最初の山（既存の実例あり）。
- 記事を増やす（各ツール詳細ページ・ユースケース別）ほど積み上がる。まず1ページを丁寧に。

## ローカルで見る
```
node build.js && open dist/index.html
```
