# RIUH — Coffee Cocktail Club

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
- `src/sections/` — satu berkas per section (`hero`, `menu`, `glass3d`, `racik`, `wall`, `voucher`).
- `src/brand/` — logo dan maskot sebagai SVG yang dibuat dari kode.
- `public/media/` — foto WebP dan rangkaian frame hero.
- `brand/` — panduan brand dan catatan generate.
- `scripts/` — `build-logo`, `build-media`, `build-hero`. Dua yang terakhir membaca berkas mentah di `assets-src/raw/` (tidak ikut di repo karena ukurannya).

## Catatan teknis
- Hero memakai 119 frame WebP yang digerakkan scroll; frame pertama adalah `<img>` biasa, sisanya dimuat setelah halaman selesai.
- three.js dan GSAP hanya dimuat saat section menu mendekati layar. Tanpa WebGL, foto produk menggantikan gelas 3D.
- Racikan dan voucher disimpan di `localStorage`. Kode voucher dibuat di browser dan **tidak divalidasi server**.
