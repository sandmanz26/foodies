# Catatan generate Higgsfield

Setiap prompt di-roast sebelum dikirim (apa yang akan salah?), dan setiap hasil di-roast lagi sebelum dipakai.

## Pemakaian credit
| Jenis | Anggaran | Terpakai | Rincian |
| --- | --- | --- | --- |
| Gambar | 75 | 54 | 27 gambar x 2 credit (Nano Banana Pro, 2K) |
| Video | 70 | 63,75 | Hero: 1 klip 5 dtk (6,25) + 2 take 8 dtk (20). Menu: 5 klip 5 dtk (31,25). Stir: 1 klip 5 dtk (6,25). Kling 3.0 Omni Frames, pro, tanpa audio |

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
| Hero C (bersulang) | Lolos | Skala meja sedikit lebih besar dari B; terbaca sebagai dorongan kamera halus |
| 5 foto produk | Lolos | Aren Santuy sedikit lebih tinggi sudutnya dari empat lainnya |
| Tampak depan siang dan malam | Lolos | Logo terbaca benar |
| Interior | Lolos | Pemandangan luar jendela kurang "Jakarta" |
| Bar | Lolos setelah retus | Nama merek mesin espresso pihak ketiga dihapus secara manual |
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

## Yang perlu diketahui
Semua foto adalah visual konsep hasil generate, termasuk orang-orangnya. Ganti dengan foto asli begitu tokonya ada.
