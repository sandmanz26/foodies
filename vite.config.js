import { defineConfig, loadEnv } from 'vite';
import { BRAND, STORE } from './src/content.js';

// The public address of the site. Set SITE_URL (in .env or the host's build settings) before a
// real deploy: canonical, Open Graph, structured data, robots.txt and sitemap.xml are built from it.
const FALLBACK_URL = 'https://riuh.example';

function siteMeta(site, isFallback) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CafeOrCoffeeShop',
    '@id': `${site}/#venue`,
    name: BRAND.name,
    description: `${BRAND.descriptor} in ${BRAND.city}: classic cocktails rebuilt on Indonesian coffee, with zero alcohol.`,
    url: `${site}/`,
    image: `${site}/media/og.jpg`,
    logo: `${site}/icon-512.png`,
    servesCuisine: ['Coffee', 'Non-alcoholic cocktails', 'Pastry'],
    address: {
      '@type': 'PostalAddress',
      streetAddress: STORE.street,
      addressLocality: STORE.locality,
      addressRegion: STORE.region,
      postalCode: STORE.postalCode,
      addressCountry: STORE.country,
    },
    openingHours: STORE.openingHours,
    sameAs: [`https://www.instagram.com/${STORE.instagram.replace(/^@/, '')}/`],
  };
  return {
    name: 'riuh-site-meta',
    transformIndexHtml(html) {
      return html
        .replaceAll('%SITE_URL%', site)
        .replace('<!-- %JSON_LD% -->', `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`);
    },
    generateBundle() {
      if (isFallback) this.warn(`SITE_URL is not set: built with the placeholder ${FALLBACK_URL}. Set it before deploying.`);
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `User-agent: *\nAllow: /\n\nSitemap: ${site}/sitemap.xml\n` });
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${site}/</loc><lastmod>${new Date().toISOString().slice(0, 10)}</lastmod></url>\n</urlset>\n`,
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const site = (env.SITE_URL || FALLBACK_URL).replace(/\/+$/, '');
  return {
    base: './',
    build: { target: 'es2020', assetsInlineLimit: 2048 },
    server: { host: true },
    plugins: [siteMeta(site, !env.SITE_URL)],
  };
});
