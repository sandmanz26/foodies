# Strategi brand RIUH

Ditulis dari sudut pandang head of marketing. Riset di bawah berasal dari tiga pencarian web singkat, bukan studi pasar penuh; angka-angkanya perlu diverifikasi sebelum dipakai di pitch.

## Apa yang ditemukan riset
1. **Pasar kopi Indonesia sangat padat.** Per November 2025 ada lebih dari 461 ribu kedai kopi, terbanyak di dunia ([Seasia](https://seasia.co/2026/01/10/indonesia-tops-the-world-with-nearly-462-000-coffee-shops)). Jaringan besar seperti Janji Jiwa dan Kopi Kenangan masing-masing punya sekitar 1.000 gerai ([World Coffee Portal](https://www.worldcoffeeportal.com/news/fore-coffee-hits-its-stride-after-significant-ipo-year/)).
2. **Kopi susu gula aren sudah jadi komoditas.** Minuman itu kini dijual botolan di minimarket, dan pandan atau gula aren sudah umum dipakai kafe specialty sebagai pembeda ([Perfect Daily Grind](https://perfectdailygrind.com/es/?p=40382)). Jadi bahan lokal saja bukan keunikan.
3. **"Kopi dan koktail" sudah ada di Jakarta, tetapi beralkohol.** Djournal House menyebut diri bar kopi dan koktail pertama di Indonesia ([Ismaya](https://www.ismaya.com/eat-drink/djournal-house)); Subform di SCBD menyajikan Smoked Coffee Negroni ([Exquisite Taste](https://exquisite-taste-magazine.com/new-tables-jakarta-subform/)). Konsepnya "kopi siang, koktail malam".
4. **Pencarian saya tidak menemukan bar kopi yang sepenuhnya tanpa alkohol di Jakarta.** Ini celahnya, dengan catatan: tidak menemukan bukan berarti tidak ada.
5. **Tren tanpa alkohol nyata secara global, datanya tipis untuk Indonesia.** Sumber Indonesia yang ada kebanyakan materi pemasaran produsen mixer ([Candid](https://candidmixers.com/00yn)), yang menyebut Gen Z, wisatawan Muslim, dan tamu sober-curious sebagai pasar.

## Posisi
> **RIUH adalah bar koktail yang isinya kopi, bukan alkohol.**

Bukan kafe yang menambah mocktail, dan bukan bar yang menambah kopi. Malam hari kota memberi dua pilihan: bar (beralkohol) atau kafe (yang ingin mejanya segera kosong). RIUH pilihan ketiga.

**Kalimat inti:** *The night out, without the morning after.*
**Tagline:** *Empty tables don't stay empty.*
**Deskriptor:** Zero-proof coffee cocktail bar · Jakarta.
**Arti nama:** RIUH /ree-ooh/, Indonesian for the good kind of loud.

## Empat pembeda (di situs: "Four house rules")
| Aturan | Kenapa ini nilai jual |
| --- | --- |
| **Zero proof. Full volume.** | Seluruh meja bisa ikut, termasuk yang tidak minum alkohol dan yang menyetir. Relevan untuk pasar mayoritas Muslim dan untuk tren sober-curious global. |
| **Every drink starts as a classic.** | Tonic, sour, old fashioned, highball: struktur yang dikenal dunia, jadi menu langsung terbaca oleh tamu internasional. |
| **Coffee from these islands.** | Gayo, Toraja, Flores, Java, Kintamani disebut per gelas. Asal-usul Indonesia jadi cerita, bukan sekadar bahan. |
| **Laptops close at six.** | Menegaskan RIUH tempat berkumpul, bukan tempat kerja. Sengaja memilah audiens; inilah yang membuatnya diingat. |

## Audiens
- **Utama:** usia 22–35 di kota besar yang ingin keluar malam tanpa alkohol.
- **Kedua:** kelompok campuran (ada yang minum, ada yang tidak) yang butuh satu tempat untuk semua.
- **Internasional:** wisatawan dan ekspat yang mencari sesuatu yang khas Indonesia tetapi mudah dipahami.

## Cara membawa brand
- **Bahasa Inggris, nama Indonesia.** Tiap nama minuman memadukan satu kata Indonesia dan satu keluarga koktail (Senja Tonic, Aren Old Fashioned), dengan arti katanya dicantumkan.
- **Ritual yang bisa direkam:** bersulang. Situs, foto, dan voucher ("bring a friend") semuanya mendorong datang berdua atau lebih.
- **Jam buka sore sampai larut**, untuk membedakan dari kafe pagi.
- **Situs sebagai pembuktian:** pengunjung sendiri yang mengaduk dan "membuat ramai" sebelum ditawari voucher.

## Yang belum terbukti
- Keempat aturan adalah janji operasional. "Laptops close at six" dan jam buka sore adalah keputusan bisnis yang harus Anda setujui.
- Asal biji per minuman masih ilustrasi; sesuaikan dengan pemasok nyata.
- Nama RIUH belum dicek ketersediaan mereknya.

## Website sebagai mesin penjualan
Situs ini tidak menjual online; tugasnya mengubah pengunjung menjadi **orang yang datang berdua atau lebih**. Corongnya:

| Tahap | Di situs | Ukuran |
| --- | --- | --- |
| Tertarik | Hero: "Dead quiet" → "No booze. All buzz." → "The noise." | Scroll melewati hero |
| Paham | Adegan "two choices" lalu lima minuman | Sampai ke menu |
| Terlibat | Mengaduk sendiri sampai RIUH menyala | `stir_completed` |
| Jadi lead | Klaim voucher dengan nama | `voucher_claimed` |
| Jadi tamu | "Book a table on WhatsApp" dengan kode voucher | `whatsapp_booking` |
| Mengajak | "Invite a friend": tautan pribadi `?from=Nama` | `invite_shared`, `invite_opened` |

**Yang sudah dipasang (tanpa backend):**
- **WhatsApp sebagai penampung lead.** Tombol booking membuka chat ke nomor toko dengan nama, kode voucher, dan sumber kunjungan sudah terisi. Lead masuk ke inbox yang memang dipakai bisnis di Indonesia.
- **Lingkar ajakan.** Voucher mensyaratkan membawa teman, dan tombol ajak membuat tautan yang menyapa teman itu dengan nama pengajak. Tiap klaim berpotensi mendatangkan pengunjung baru.
- **Atribusi.** `utm_source` atau ajakan teman diingat selama sesi dan ikut terkirim di pesan WhatsApp, jadi Anda tahu kanal mana yang menghasilkan booking.
- **Siap analitik.** Semua aksi kunci masuk ke `window.dataLayer`; tinggal pasang Google Tag Manager atau GA4.
- **SEO lokal.** Data terstruktur (alamat, jam buka, jenis usaha) untuk hasil pencarian "coffee bar Jakarta".

**Yang saya sarankan berikutnya (belum dikerjakan):**
1. Google Business Profile dengan foto dan tautan ke situs: sumber utama pencarian "near me".
2. Satu halaman per minuman untuk pencarian seperti "espresso tonic Jakarta".
3. Konten pendek (Reels/TikTok) dari ritual bersulang, dengan tautan ber-`utm_source`.
4. Backend kecil atau Google Sheet untuk mencatat klaim voucher, supaya kode bisa divalidasi dan lead bisa dihubungi ulang.
5. Uji A/B judul hero dan isi voucher begitu ada trafik.

**Batasnya:** tanpa backend, klaim voucher yang tidak diteruskan ke WhatsApp tidak tercatat di mana pun, dan nomor WhatsApp di `src/content.js` masih placeholder.
