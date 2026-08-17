# moji-honest

Zero-dependency static-site generator for "honest comparison" sites: one
`data.json` describes tools/pricing/who-it's-not-for, `build.js` turns it
into SEO-ready static HTML + sitemap + robots.txt, deployed via GitHub
Pages.

Live example: https://shibu003.github.io/moji-honest — a Japanese
transcription-AI comparison site built on this engine.

## How it works

- `data.json` — single source of truth (tools, pricing, who each tool is
  *not* for, affiliate/official links). **Not included in this repo** —
  the generator is generic, your data is yours.
- `build.js` — zero dependencies. `node build.js` renders `data.json` into
  `dist/`: static HTML, `sitemap.xml`, `robots.txt`.
- `.github/workflows/deploy.yml` — uploads the committed `dist/` to GitHub
  Pages on push. CI does not run `build.js` (it has no `data.json`), so
  build locally and commit the output.

## Use it

1. Write your own `data.json` at the repo root (see the shape the live
   example uses, or read `build.js` — it's short).
2. `node build.js` — check `dist/index.html`.
3. Commit `dist/` and push. Pages serves it as-is.

## License

MIT — see [LICENSE](LICENSE).

Contributions need a sign-off: see [CLA.md](CLA.md).
