# Riwayat proyek RIUH

Catatan lengkap seluruh percakapan yang membangun situs ini, dari ide pertama sampai siap publish. Ditulis supaya siapa pun (manusia atau AI) yang membuka repo ini tanpa akses ke percakapan aslinya tahu **apa yang diminta, apa yang diputuskan, apa yang dicoba dan ditolak, dan apa yang belum selesai**.

Percakapan berlangsung 12–13 November 2026 dalam satu sesi Claude Code, dengan akses ke Higgsfield (generate gambar dan video) dan repo GitHub `sandmanz26/foodies`, branch `claude/charming-brown-7hra8o`.

---

## Aturan dari pemilik proyek
Berlaku sepanjang proyek; pertahankan kalau melanjutkan.

1. **Peran:** bekerja sebagai head of motion, head of design, head of creative, head of engineering, dan (sejak putaran 3) head of marketing.
2. **Front-end saja.** Tidak ada backend.
3. **Performa dijaga tanpa mengorbankan kualitas.**
4. **Tidak boleh ada "AI slop".** Setiap generate Higgsfield harus didahului **roast** (kritik prompt: apa yang akan salah?) dan hasilnya di-roast lagi sebelum dipakai.
5. **Anggaran Higgsfield: 75 credit gambar dan 70 credit video.** Sekarang terpakai 54 dan 63,75 (rincian di `GENERATION-LOG.md`).
6. **Gaya:** fun, agak kartun, muda, liar, colorful. Referensi awal: situs minuman energi MANA (ilustrasi flat yang liar mengelilingi produk realistis).
7. **Tujuan:** pengunjung memahami cerita brand, brand awareness, kesan fun, dan brand yang bisa dipercaya. Ditutup dengan ajakan datang ke toko dan klaim voucher.
8. **Bahasa situs: Inggris.** Level internasional, lokasi tetap Indonesia (Jakarta).
9. **Sisakan 5% kuota pemakaian** supaya pemilik tetap bisa chat. (Asisten tidak bisa melihat angka kuota, jadi ini dijalankan dengan bekerja hemat dan berhenti setelah tiap putaran.)
10. Pemilik berencana **publish dengan domain nyata** dan akan **menghapus sesi dan semua berkas lokal** setelah catatan ini dibuat.

---

## Kronologi

### 0. Koneksi Higgsfield
Pemilik bertanya apakah asisten terhubung ke Higgsfield. Saat itu belum; konektor tersambung di pesan berikutnya.

### 1. Ideasi (tanpa membangun apa pun)
**Permintaan:** website kopi yang memorable dengan brand storytelling yang kuat, lima section:
1. Hero: "scrollcraft" sederhana, meja kosong yang saat di-scroll terisi kopi dan pastry, ditutup kemeriahan dan rasa bahagia ("bersama kita kamu akan mendapat kebahagiaan").
2. Lima produk unggulan, dimulai dari gambar lalu dibuat 3D dengan animasi "composing".
3. Interaksi pengguna membuat latte (pemilik suka idenya tetapi belum tahu pesannya).
4. Dinding foto kenangan ala Pinterest.
5. "Why us" yang standar.

**Usulan asisten:** satu cerita utuh "meja kosong → terisi → kamu ikut meracik → jadi kenangan → kursi ini buat kamu"; dunia kartun flat dengan produk realistis; satu maskot; satu warna per produk; pesan untuk section latte: "bahagia itu versi kamu". Catatan teknis: hero sebaiknya berlapis, 3D gelas mudah tetapi pastry sulit, kunci gaya sebelum generate, foto kenangan AI jangan dipalsukan sebagai pelanggan asli.

**Jawaban pemilik:** brand diciptakan dari nol; produk belum ada, konsepnya **coffee cocktail**; tujuannya brand awareness yang ditutup dengan datang ke toko dan klaim voucher; dibangun di repo `foodies`.

### 2. Versi pertama (commit `955078a`)
**Permintaan:** bangun situsnya sesuai aturan di atas, termasuk identitas brand dan foto tempat yang sesuai brand.

**Yang dibuat:**
- **Brand:** RIUH ("ramai", dalam arti yang menyenangkan), *Coffee Cocktail Club*, tagline "Meja kosong, jadi riuh." Wordmark empat huruf miring (Bagel Fat One, dikonversi jadi path SVG), maskot "Si Riuh" (ledakan 12 sudut berwajah), enam warna, tepi awning sebagai pemisah section.
- **Higgsfield:** 3 keyframe hero dari atas (meja kosong → terisi → bersulang), 5 foto produk, 5 foto tempat, 5 foto momen, 2 video hero. Roast menolak 2 versi keyframe kedua (gelas berdiri di kursi) dan 1 take video (orang berdesakan dari sisi yang sama). Nama merek mesin espresso pihak ketiga diretus dari foto bar.
- **Situs (berbahasa Indonesia):** hero scroll 119 frame, cerita, menu dengan gelas 3D three.js, "Racik" (pilih kopi, tahan untuk tuang susu, pilih twist, racikan diberi nama), "Dinding Riuh", empat janji, voucher dengan kode unik dan simpan sebagai gambar.
- Push pertama gagal (403, akses GitHub). Setelah akses diperbaiki pemilik, push berhasil atas permintaan "tolong commit and push".

### 3. Referensi dan tujuh catatan (commit `1e57731`)
Pemilik membagikan **https://phin.helenadang.work/** (situs konsep kopi Saigon PHIN PHIN: menyeduh dengan timer 4 menit, mengaduk kopi dan susu kental manis lewat drag/tombol panah, menu, "knock 'em over"). Yang disukai pemilik: interaksi membuat latte/mengaduk.

**Tujuh catatan pemilik dan hasilnya:**
1. *Bahasa Inggris, level internasional, lokasi tetap Indonesia.* Semua teks ditulis ulang. Brand diposisikan ulang menjadi **"Zero-proof coffee cocktail bar · Jakarta"**; nama minuman memadukan kata Indonesia dan keluarga koktail: Senja Tonic, Jambu Sour, Kelapa Cloud, Aren Old Fashioned, Telang Highball.
2. *Video tidak smooth saat di-scroll.* Frame hero ditambah dari 119 ke 191, frame bertetangga di-cross-fade, dan frame di-decode lebih dulu.
3. *Awal harus suram, sepi, membosankan.* Hero dibuka abu-abu dan redup ("Tuesday, 9:47 pm"); warna kembali saat meja terisi (filter CSS, tanpa credit).
4. *Tidak suka desain 3D; pakai Higgsfield.* Gelas 3D dibuang (three.js dan GSAP dihapus). Tiap minuman difilmkan dari gelas kosong sampai jadi: 5 frame gelas kosong dibuat dari foto produknya, lalu 5 video.
5. *Tidak suka bagian Racik; suka interaksi latte di PHIN.* Diganti section **"Now stir. Make some noise."**: gelas dilihat dari atas, kopi dan santan diaduk dengan drag, swipe, atau tombol panah, sampai huruf R-I-U-H menyala satu per satu.
6. *Bekerja juga sebagai head of marketing.* Empat "house rules" sebagai pembeda brand; voucher menjadi "First round on us, when you bring a friend".
7. *Riset pasar untuk keunikan dan nilai jual.* Tiga pencarian web; hasil dan posisi di `STRATEGY.md`. Temuan utama: lebih dari 461 ribu kedai kopi di Indonesia, kopi susu gula aren sudah jadi komoditas, bar kopi-koktail di Jakarta sudah ada tetapi beralkohol; pencarian tidak menemukan bar kopi yang sepenuhnya tanpa alkohol → posisi **"The night out, without the morning after."**

### 4. "Kok masih sama?"
Pemilik melihat versi lama. Penyebabnya bukan kode (commit baru sudah di GitHub): server pratinjau di sesi sudah mati dan tab pemilik menampilkan cache. Server dijalankan ulang; pemilik diberi cara menarik versi terbaru.

### 5. Lima catatan berikutnya (commit `78d09ec`)
1. *Bagian cerita kurang menarik, perlu transisi lebih bagus.* Menjadi satu adegan terkunci yang digerakkan scroll: layar gelap, "After dark, a city gives you two choices", kartu "A bar." dan "A café." terbang masuk lalu dicap "Nope" dan "Nah", kemudian warna tomat membanjiri layar dari tengah dengan "The night out, without the morning after."
2. *Pesan hero kurang kuat dan kurang punchy.* Tiga ketukan baru: "Dead quiet." → "No booze. All buzz." → "The noise.", dengan stiker "0% alcohol" dan "Cheers!" di dua momen kunci.
3. *Video produk terlalu lambat; gabungkan dengan scroll.* Klip tidak lagi diputar otomatis; scroll yang menuangnya. Klip di-encode ulang dengan keyframe tiap 2 frame supaya bisa di-scrub.
4. *Section stir masih lemah, sekadar bentuk, kurang realistis.* Gambar buatan kode diganti rekaman nyata dari atas di meja kuning yang sama dengan hero (2 frame + 1 video Higgsfield); gestur mengaduk menggerakkan rekamannya. Sendok bar logam mengikuti tangan.
5. *Strategi penjualan, leads, dan visitor lewat website.* Booking via WhatsApp dengan nama, kode voucher, dan sumber kunjungan terisi; tautan ajakan pribadi `?from=Nama`; atribusi `utm_source`; event `dataLayer`; data terstruktur SEO lokal. Corong lengkap di `STRATEGY.md`.

### 6. Bug tangan (commit `9448818`, lalu `5dc4fc5`)
Pemilik menemukan perempuan berhijab punya tiga tangan di akhir hero. Perbaikan pertama hanya menghapus tangannya, dan pemilik menunjukkan lengan bajunya masih menjulur tanpa tangan. Perbaikan kedua menghapus **seluruh lengan ketiga** di 57 frame dengan frame 136 (frame terakhir dengan dua lengan) sebagai plat bersih, karena kamera tidak bergerak. Ke-57 frame diperiksa satu per satu. Tanpa credit (sisa anggaran video tidak cukup untuk merender ulang klip 8 detik).

### 7. Catatan ini dan persiapan publish
**Permintaan:** catat seluruh interaksi tanpa ada yang terlewat, push ke repo, pastikan AI lain paham, kode bersih untuk domain nyata, perbaiki meta.

**Yang dikerjakan:**
- **Meta:** judul dan deskripsi baru, canonical, Open Graph dan Twitter Card lengkap dengan gambar 1200×630 bertanda logo, robots, theme color, favicon PNG, apple-touch-icon, web manifest. URL absolut, `robots.txt`, dan `sitemap.xml` dibangun dari variabel `SITE_URL`; data terstruktur dibangun dari `src/content.js`.
- **Kebersihan:** kode dan CSS mati dibuang, nama "janji" diganti "rules", dokumen dipindah ke `docs/`, skrip build dikumpulkan di `package.json`.
- **Bisa dibangun ulang tanpa sesi ini:** `assets-src/sources.json` mencatat job id semua berkas Higgsfield; `scripts/fetch-sources.mjs` mengunduhnya; dua retus lokal dijadikan skrip (`fix-bar-logo.py`, `fix-hero-clip.sh`) dan diverifikasi menghasilkan berkas yang identik.
- **Untuk AI lain:** `AGENTS.md` (dan `CLAUDE.md`) di root.

---

## Keadaan sekarang

**Situs (satu halaman, bahasa Inggris), urutan section:**
1. **Hero:** 191 frame scroll; suram → meja terisi + stiker "0% alcohol" → bersulang + "Cheers!" → mengecil menjadi foto di bawah logo.
2. **Story:** adegan "two choices" → "The night out, without the morning after."
3. **Menu:** lima minuman, masing-masing dituang oleh scroll, dengan keluarga koktail, arti nama, dan profil rasa.
4. **Stir:** mengaduk Kelapa Cloud sampai RIUH menyala; suara dentingan opsional.
5. **The loud wall:** 10 foto tempat dan momen yang bisa digeser.
6. **Four house rules:** Zero proof. Full volume / Every drink starts as a classic / Coffee from these islands / Laptops close at six.
7. **Voucher:** "First round on us" → kode unik → booking WhatsApp, ajak teman, simpan gambar; info kunjungan.

**Teknis:** Vite 6, JavaScript tanpa framework, tanpa pustaka runtime. Muatan awal sekitar 190 KB (desktop) dan 100 KB (ponsel); frame dan klip dimuat belakangan. Diuji di Chromium headless (desktop 1440×900 dan ponsel 390×844), tanpa error konsol.

## Belum selesai dan perlu keputusan pemilik
- **Placeholder:** alamat, kode pos, jam buka, Instagram, nomor WhatsApp (`src/content.js`), dan isi voucher. Data terstruktur ikut memakai nilai ini.
- **`SITE_URL`** harus diisi sebelum build produksi.
- **Semua foto dan video adalah visual konsep AI**, termasuk orang-orangnya. Ganti dengan foto asli sebelum dipakai untuk bisnis sungguhan.
- **Keputusan bisnis yang diambil asisten:** 0% alkohol untuk semua menu, "Laptops close at six", buka sore sampai larut, asal biji per minuman (Gayo, Flores, Toraja, Java, Kintamani). Harus disetujui atau diubah.
- **Nama RIUH belum dicek ketersediaan mereknya.**
- **Voucher tidak divalidasi server**; klaim yang tidak diteruskan ke WhatsApp tidak tercatat di mana pun.
- **Analitik belum tersambung:** event sudah masuk `window.dataLayer`, tetapi belum ada Google Tag Manager atau GA4.
- **Belum diuji di perangkat nyata**, terutama kehalusan scrub video di iPhone/Safari.
- **Cacat video yang tersisa:** rambut pria berbaju merah berubah saat ia duduk; di bekas lengan ketiga, lantai sedikit lebih sepi confetti. Keyframe diam `hero-c.png` masih punya tiga tangan (tidak dipakai di situs).
- **Riset pasar dangkal** (tiga pencarian web); verifikasi sebelum dipakai di pitch.
- **Saran berikutnya** (dari `STRATEGY.md`): Google Business Profile, halaman per minuman untuk SEO, konten pendek dengan `utm_source`, penyimpan klaim voucher sederhana, uji A/B judul hero.
