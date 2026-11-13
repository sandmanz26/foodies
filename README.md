# RIUH — Zero-proof coffee cocktail bar, Jakarta

One-page brand site for RIUH (/ree-ooh/, Indonesian for "the good kind of loud"): classic cocktails rebuilt on Indonesian coffee, with zero alcohol. Front end only, built with Vite and plain JavaScript.

> **Concept project.** The venue, products, address and contact details are invented, and every photo and video was generated with AI. See [Before launch](#before-launch).

## Quick start
```bash
npm install
npm run dev
```

## Deploy to a real domain
The output is a static folder, so any static host works (Netlify, Vercel, Cloudflare Pages, GitHub Pages, S3).

1. Set the public address, without a trailing slash, either in a `.env` file (copy `.env.example`) or in the host's build settings:
   ```bash
   SITE_URL=https://www.your-domain.com
   ```
2. Build command `npm run build`, output directory `dist`, Node 20 or newer.
3. The build fills in the canonical URL, Open Graph and Twitter tags, structured data, `robots.txt` and `sitemap.xml` from `SITE_URL`. Without it, the build warns and uses `https://riuh.example`.

Recommended on the host: HTTPS, and long cache lifetimes for `/assets/` and `/media/` (file names under `/assets/` are content-hashed; files under `/media/` change only when the media pipeline is rerun).

## Before launch
- Replace the placeholder venue details, WhatsApp number and voucher terms in `src/content.js`.
- Replace AI-generated photos and video with real ones, especially anything showing people.
- Confirm the business decisions the copy commits to (zero alcohol, "Laptops close at six", opening hours, bean origins).
- Check trademark availability of the name.
- Add Google Tag Manager or GA4 if you want the events already pushed to `window.dataLayer`.
- Test on real phones, especially Safari on iPhone.

## Project layout
See [`AGENTS.md`](AGENTS.md) for the file map and conventions, and [`docs/`](docs) for the project record:
- [`docs/HISTORY.md`](docs/HISTORY.md) — every request, decision and revision, in order
- [`docs/BRAND.md`](docs/BRAND.md) — brand identity: story, voice, colours, type, logo, mascot
- [`docs/STRATEGY.md`](docs/STRATEGY.md) — market research, positioning, and the site as a sales funnel
- [`docs/GENERATION-LOG.md`](docs/GENERATION-LOG.md) — AI generation prompts, credits, and quality review

The docs are written in Indonesian; the site copy is English.

## Media pipeline
Built media is committed under `public/media/`, so a normal build needs nothing else. To regenerate it from the original sources you need ffmpeg and Python 3 with numpy, Pillow and scipy:
```bash
HF_CDN_BASE=https://<cdn>/<account-folder> npm run media:fetch
npm run media:retouch
npm run media:build
```
`assets-src/sources.json` lists every source file and the Higgsfield job it came from.
