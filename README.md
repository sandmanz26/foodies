# RIUH — Zero-proof coffee cocktail bar

Situs brand satu halaman, front-end saja. Vite + JavaScript tanpa framework.

```bash
npm install
npm run dev      # pengembangan
npm run build    # hasil statis di dist/
npm run preview  # melihat hasil build
```

## Peta
- `index.html` — kerangka dan seluruh teks statis.
- `src/content.js` — produk, alamat, voucher, janji, caption. **Alamat, jam buka, Instagram, dan isi voucher masih placeholder.**
- `src/sections/` — satu berkas per section (`hero`, `menu`, `stir`, `wall`, `voucher`).
- `src/brand/` — logo dan maskot sebagai SVG yang dibuat dari kode.
- `public/media/` — foto WebP, rangkaian frame hero, dan lima klip minuman.
- `brand/` — strategi (`STRATEGY.md`), panduan brand, dan catatan generate.
- `scripts/` — `build-logo`, `build-media`, `build-hero`, `build-drinks`, `build-stir`. Empat yang terakhir membaca berkas mentah di `assets-src/raw/` (tidak ikut di repo karena ukurannya).

## Catatan teknis
- Hero memakai 191 frame WebP yang digerakkan scroll, dengan cross-fade antar frame; frame pertama adalah `<img>` biasa, sisanya dimuat setelah halaman selesai.
- Tidak ada pustaka runtime: klip menu (MP4, 0,6–0,9 MB) digerakkan scroll; section stir memakai 81 frame WebP yang digerakkan gestur mengaduk.
- `src/lib/growth.js` berisi pelacakan event (`dataLayer`), tautan WhatsApp, dan tautan ajakan `?from=`.
- Voucher disimpan di `localStorage`. Kode voucher dibuat di browser dan **tidak divalidasi server**.
