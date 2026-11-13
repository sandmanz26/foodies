# Catatan generate Higgsfield

Setiap prompt di-roast sebelum dikirim (apa yang akan salah?), dan setiap hasil di-roast lagi sebelum dipakai.
Job id, nama berkas, dan cara mengunduh ulang semua sumber ada di `assets-src/sources.json`.

## Pemakaian credit
| Jenis | Anggaran | Terpakai | Rincian |
| --- | --- | --- | --- |
| Gambar | 75 | 54 | 27 gambar x 2 credit. Diminta sebagai `nano_banana_pro` 2K; Higgsfield mencatat job-nya sebagai `nano_banana_2` |
| Video | 70 | 63,75 | Hero: 1 klip 5 dtk (6,25) + 2 take 8 dtk (20). Menu: 5 klip 5 dtk (31,25). Stir: 1 klip 5 dtk (6,25). Semua `kling_o3_flf` (Kling 3.0 Omni, frame awal dan akhir), mode pro, tanpa audio |

Saldo akun: 571,97 (awal) → 505,72 → 464,47 → 454,22. Selisih total 117,75 = 54 + 63,75. Sisa anggaran video 6,25 (cukup untuk satu klip 5 detik).

## Roast sebelum generate (yang mengubah prompt)
- **"Top-down" sering jadi sudut 3/4** -> ditulis eksplisit: kamera tegak lurus lantai, tanpa kemiringan perspektif.
- **Kesan AI yang glossy/HDR** -> minta material matte dengan bekas pakai, cahaya jendela, tanpa glow.
- **Komposisi harus tahan crop ponsel** -> meja di tengah persis, diameter sekitar setengah tinggi frame.
- **Teks palsu di gambar** -> semua prompt melarang teks; papan nama memakai logo asli sebagai gambar referensi.
- **Seri produk tidak konsisten** -> satu kerangka prompt untuk kelima minuman (kamera setinggi gelas, cahaya keras kiri atas, kertas sewarna).
- **Video "memudar masuk"** -> benda diminta jatuh dari atas kamera dan memantul, bukan muncul.
- **Wajah AI yang terlalu mulus** -> hero difoto dari atas, momen difoto gaya kamera saku dengan flash.

## Roast sesudah generate
| Aset | Putusan | Catatan |
| --- | --- | --- |
| Hero A (meja kosong) | Lolos | Dipakai sebagai referensi gaya semua foto tempat |
| Hero B percobaan 1 | Ditolak | Tiga gelas berdiri di dudukan kursi |
| Hero B percobaan 2 (perbaikan) | Ditolak | Model tidak memindahkan gelasnya |
| Hero B percobaan 3 | Lolos | Komposisi diubah: gelas di diagonal meja, jauh dari kursi |
| Hero C (bersulang) | Lolos, dengan cacat | Skala meja sedikit lebih besar dari B. Perempuan berhijab punya tiga tangan; tidak terlihat saat roast, ditemukan pengguna kemudian. Gambar diam ini tidak dipakai di situs; videonya yang diretus |
| 5 foto produk | Lolos | Aren Old Fashioned sedikit lebih tinggi sudutnya dari empat lainnya |
| Tampak depan siang dan malam | Lolos | Logo terbaca benar |
| Interior | Lolos | Pemandangan luar jendela kurang "Jakarta" |
| Bar | Lolos setelah retus | Nama merek mesin espresso pihak ketiga dihapus (`scripts/fix-bar-logo.py`) |
| Etalase pastry | Lolos setelah crop | Sosok latar yang tidak cocok dipotong |
| Sisa keriuhan | Lolos setelah crop | Cap tanggal kamera palsu dipotong |
| Bersulang, pojok, tuang espresso | Lolos | |
| Empat sahabat tertawa | Lolos | Agak rapi seperti foto iklan |
| Video 1 (meja terisi) | Lolos | |
| Video 2 take 1 | Ditolak | Tiga orang masuk berdesakan dari sisi yang sama |
| Video 2 take 2 | Dipakai | Lebih rapi. Cacat tersisa: rambut pria berbaju merah berubah dari lurus ke keriting saat ia duduk |
| Video 2 take 2, retus | Diperbaiki | Mulai frame 138 perempuan berhijab punya lengan ketiga (lengan baju sampai tangan terbuka). Seluruh lengan itu dihapus per frame dengan frame 136 sebagai plat bersih (`scripts/fix-hero-hand.py`); ke-57 frame diperiksa satu per satu. Tanpa credit |

## Putaran kedua: video menu
Gelas 3D buatan kode diganti video nyata. Untuk tiap minuman dibuat frame "gelas kosong" dari foto produknya, lalu video dari gelas kosong ke minuman jadi.
- **Roast sebelum generate:** satu klip diuji dulu (Senja) untuk memastikan rasio 4:5 terjaga dan cairan tidak "memudar masuk", baru empat lainnya dipesan.
- **Kelima frame gelas kosong:** lolos, posisi dan cahaya identik dengan foto produk.

## Putaran ketiga: section stir
Gelas gambar-kode diganti rekaman nyata dari atas, di meja kuning yang sama dengan hero: frame awal (kopi dan santan belum tercampur), frame akhir (teraduk), lalu satu video di antaranya. Ketiganya lolos pada percobaan pertama. Hanya 3,6 detik pertama yang dipakai, karena setelah itu minumannya sudah rata.

## Isi prompt (ringkas)
Semua prompt berbahasa Inggris dan menyebut: kamera, cahaya keras dari kiri atas, material nyata, "not a 3D render", dan larangan teks/logo.
- **Hero A:** foto tegak lurus dari atas; meja bundar laminasi kuning kosong di tengah; empat kursi bentwood biru, pink, hijau, krim di arah 12/3/6/9; lantai ubin kotak tomat-krem memenuhi frame.
- **Hero B (percobaan 3):** edit Hero A; semua benda di dalam lingkaran meja: piring putih berisi croissant dan pain au chocolat di tengah, empat gelas di diagonal (espresso tonic + jeruk kering, coupe busa pink + 3 biji kopi, tumbler kelapa + pandan, rocks glass amber + es besar + kulit jeruk). Kursi kosong.
- **Hero C:** edit Hero B; empat sahabat usia 20-an berkulit sawo matang (kaus kuning, hijab lilac + sweater hijau, kemeja merah rambut keriting, kemeja garis biru-putih rambut kuncir) bersulang di atas piring; confetti dan pita kertas jatuh.
- **Foto produk (5):** packshot setinggi gelas di atas kertas sewarna produk (tomat, pink, hijau, kuning, biru); bayangan tegas ke kanan; ruang kosong di atas gelas.
- **Tempat:** tampak depan ruko sudut di Jakarta Selatan dengan papan RIUH (logo asli diunggah sebagai referensi), interior pagi dengan mural doodle, bar ubin biru dengan neon RIUH, pojok sofa pink, tampak depan malam hari.
- **Momen:** etalase pastry, tuang espresso ke tonic, meja setelah pesta (flash kamera saku), empat tangan bersulang, empat sahabat tertawa.
- **Gelas kosong (5):** edit tiap foto produk; minumannya dihapus, gelas, latar, dan cahaya identik.
- **Stir:** dari atas di meja kuning yang sama; tumbler berisi santan dengan cold brew yang baru dituang dan belum teraduk; lalu versi yang sudah teraduk rata.
- **Video:** kamera terkunci, tanpa zoom; benda jatuh dari atas dan memantul (hero 1); tiap orang masuk dari sisinya sendiri lalu bersulang (hero 2); es jatuh, cairan dituang dari atas frame, garnish mendarat, tanpa tangan (menu); cairan berputar searah jarum jam dan menyatu, tanpa sendok (stir).

## Yang perlu diketahui
- Semua foto adalah visual konsep hasil generate, termasuk orang-orangnya. Ganti dengan foto asli begitu tokonya ada.
- Cacat yang masih ada di video hero 2: rambut pria berbaju merah berubah dari lurus ke keriting saat ia duduk; di bekas lengan ketiga, lantainya sedikit lebih sepi confetti.
