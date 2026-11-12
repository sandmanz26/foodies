// Every word and number on the site lives here, so the brand team can edit copy without touching layout code.

export const BRAND = {
  name: 'RIUH',
  descriptor: 'Coffee Cocktail Club',
  tagline: 'Meja kosong, jadi riuh.',
};

// TODO(brand owner): replace with the real store details before launch.
export const STORE = {
  address: ['Jl. Meja Kosong No. 1', 'Jakarta Selatan'],
  hours: 'Setiap hari, 08.00 – 22.00',
  instagram: '@riuh.club',
  mapsUrl: 'https://maps.google.com/?q=Jakarta+Selatan',
};

export const VOUCHER = {
  offer: 'Gratis 1 croissant',
  condition: 'untuk coffee cocktail pertamamu',
  validDays: 30,
};

export const PRODUCTS = [
  {
    id: 'senja',
    name: 'Senja Ribut',
    bg: '#F04E23',
    fg: '#FFF4E0',
    accent: '#FFC93C',
    line: 'Espresso dijatuhkan ke tonic dingin. Pahit, segar, berisik.',
    method: 'Dilapis',
    ingredients: ['Espresso', 'Tonic', 'Jeruk kering', 'Es batu'],
    taste: { Pahit: 4, Manis: 2, Segar: 5 },
    glass: 'highball',
  },
  {
    id: 'jambu',
    name: 'Jambu Gemes',
    bg: '#FF9EC4',
    fg: '#2A1610',
    accent: '#F04E23',
    line: 'Kopi dikocok dengan stroberi dan jambu sampai berbusa. Manis, tapi nggak manja.',
    method: 'Dikocok',
    ingredients: ['Espresso', 'Stroberi', 'Jambu biji', 'Busa kocok'],
    taste: { Pahit: 2, Manis: 4, Segar: 3 },
    glass: 'coupe',
  },
  {
    id: 'kelapa',
    name: 'Kelapa Kalem',
    bg: '#1F9D55',
    fg: '#FFF4E0',
    accent: '#FFC93C',
    line: 'Cold brew menetes pelan ke santan kelapa. Buat yang lagi butuh tenang.',
    method: 'Dituang',
    ingredients: ['Cold brew', 'Santan kelapa', 'Pandan', 'Es batu'],
    taste: { Pahit: 2, Manis: 3, Segar: 3 },
    glass: 'tumbler',
  },
  {
    id: 'aren',
    name: 'Aren Santuy',
    bg: '#FFC93C',
    fg: '#2A1610',
    accent: '#F04E23',
    line: 'Cold brew, gula aren, satu es batu besar. Diaduk pelan, diminum lebih pelan.',
    method: 'Diaduk',
    ingredients: ['Cold brew', 'Gula aren', 'Kulit jeruk', 'Es batu besar'],
    taste: { Pahit: 3, Manis: 4, Segar: 2 },
    glass: 'rocks',
  },
  {
    id: 'telang',
    name: 'Telang Begadang',
    bg: '#3D7BF2',
    fg: '#FFF4E0',
    accent: '#FFC93C',
    line: 'Bunga telang biru, lemon bikin ungu, espresso di puncak. Tiga lapis buat malam panjang.',
    method: 'Dilapis',
    ingredients: ['Bunga telang', 'Lemon', 'Espresso', 'Soda'],
    taste: { Pahit: 3, Manis: 2, Segar: 4 },
    glass: 'collins',
  },
];

// The make-your-own game. Each twist leads to the signature drink it is closest to.
export const RACIK = {
  coffees: [
    { id: 'espresso', label: 'Espresso', note: 'tegas', color: '#3A1D10' },
    { id: 'coldbrew', label: 'Cold brew', note: 'kalem', color: '#5A2E17' },
    { id: 'decaf', label: 'Decaf', note: 'santai', color: '#6B3B20' },
  ],
  milks: [
    { id: 'segar', label: 'Susu segar', color: '#FFF6E6' },
    { id: 'oat', label: 'Oat', color: '#F3E3C4' },
    { id: 'kelapa', label: 'Kelapa', color: '#FFFDF8' },
  ],
  twists: [
    { id: 'jeruk', label: 'Jeruk', word: 'Senja', tint: '#FF9A3D', match: 'senja' },
    { id: 'aren', label: 'Gula aren', word: 'Santuy', tint: '#B5651D', match: 'aren' },
    { id: 'pandan', label: 'Pandan', word: 'Kalem', tint: '#7BC96F', match: 'kelapa' },
    { id: 'stroberi', label: 'Stroberi', word: 'Gemes', tint: '#FF7FAE', match: 'jambu' },
    { id: 'telang', label: 'Telang', word: 'Begadang', tint: '#6D7CFF', match: 'telang' },
  ],
  // milk share of the glass -> personality
  strengths: [
    { max: 0.38, word: 'Melek Total', ask: 'kopinya yang galak' },
    { max: 0.62, word: 'Pas Banget', ask: 'seimbang aja' },
    { max: 1.01, word: 'Manja Dikit', ask: 'susunya dibanyakin' },
  ],
};

export const WALL = [
  { src: 'place-interior', w: 3, h: 2, cap: 'Pagi, sebelum buka. Semua meja masih kosong.', rot: -3, tape: 'kunyit' },
  { src: 'm-pour', w: 4, h: 5, cap: 'Detik espresso ketemu tonic.', rot: 2.5, tape: 'jambu' },
  { src: 'm-toast', w: 4, h: 5, cap: 'Bunyi favorit kami.', rot: -2, tape: 'langit' },
  { src: 'place-bar', w: 3, h: 2, cap: 'Bar. Dikocok dulu, baru disajikan.', rot: 3, tape: 'tomat' },
  { src: 'm-friends', w: 3, h: 2, cap: 'Ceritanya belum selesai, gelasnya sudah.', rot: -1.5, tape: 'pandan' },
  { src: 'm-pastry', w: 1, h: 1, cap: 'Keluar oven tiap pagi.', rot: 2, tape: 'kunyit' },
  { src: 'place-corner', w: 4, h: 5, cap: 'Pojok buat yang mau lama.', rot: -2.5, tape: 'jambu' },
  { src: 'm-after', w: 1, h: 1, cap: 'Bukti keriuhan.', rot: 3.5, tape: 'tomat' },
  { src: 'place-night', w: 4, h: 5, cap: 'Makin malam, makin riuh.', rot: -3, tape: 'langit' },
  { src: 'place-exterior', w: 3, h: 2, cap: 'Cari awning merahnya.', rot: 1.5, tape: 'pandan' },
];

export const PROMISES = [
  {
    title: 'Diracik, bukan cuma diseduh.',
    body: 'Dikocok, diaduk, dilapis. Tiap gelas dikerjakan dengan teknik bar, satu per satu.',
    mood: 'happy',
    color: 'tomat',
  },
  {
    title: '0% alkohol. Selalu.',
    body: 'Semua menu bebas alkohol, jadi semua orang di meja bisa ikut bersulang.',
    mood: 'wink',
    color: 'langit',
  },
  {
    title: 'Bahan yang bisa kamu sebut.',
    body: 'Jeruk, gula aren, pandan, kelapa, bunga telang. Yang nggak bisa kamu eja, nggak kami pakai.',
    mood: 'wow',
    color: 'pandan',
  },
  {
    title: 'Pastry dipanggang tiap pagi.',
    body: 'Croissant yang habis ya habis. Besok pagi kami panggang lagi.',
    mood: 'sleepy',
    color: 'jambu',
  },
];
