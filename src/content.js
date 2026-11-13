// Every word and number on the site lives here, so the brand team can edit copy without touching layout code.

export const BRAND = {
  name: 'RIUH',
  say: 'ree-ooh',
  meaning: 'Indonesian for the good kind of loud.',
  descriptor: 'Zero-proof coffee cocktail bar',
  city: 'Jakarta',
  tagline: "Empty tables don't stay empty.",
};

// TODO(brand owner): replace with the real venue details before launch.
export const STORE = {
  address: ['Jl. Meja Kosong No. 1', 'South Jakarta, Indonesia'],
  hours: 'Daily, 4 pm till late',
  instagram: '@riuh.bar',
  mapsUrl: 'https://maps.google.com/?q=South+Jakarta',
};

export const VOUCHER = {
  offer: 'First round on us',
  condition: 'One zero-proof coffee cocktail, on the house, when you bring a friend',
  validDays: 30,
};

// Each drink is a classic cocktail family rebuilt on Indonesian coffee, with no alcohol.
export const PRODUCTS = [
  {
    id: 'senja',
    name: 'Senja Tonic',
    gloss: 'senja: dusk',
    family: 'Built like an espresso tonic',
    bg: '#F04E23',
    fg: '#FFF4E0',
    line: 'Gayo espresso dropped over cold tonic. Bitter, bright, and a little loud.',
    ingredients: ['Aceh Gayo espresso', 'Tonic', 'Dried orange', 'Ice'],
    taste: { Bitter: 4, Sweet: 2, Fresh: 5 },
  },
  {
    id: 'jambu',
    name: 'Jambu Sour',
    gloss: 'jambu: guava',
    family: 'Built like a sour',
    bg: '#FF9EC4',
    fg: '#2A1610',
    line: 'Espresso shaken hard with guava and strawberry until it wears a pink foam hat.',
    ingredients: ['Flores espresso', 'Pink guava', 'Strawberry', 'Shaken foam'],
    taste: { Bitter: 2, Sweet: 4, Fresh: 3 },
  },
  {
    id: 'kelapa',
    name: 'Kelapa Cloud',
    gloss: 'kelapa: coconut',
    family: 'Built like a colada',
    bg: '#1F9D55',
    fg: '#FFF4E0',
    line: 'Cold brew drifting down through coconut milk, tied off with pandan. Calm in a glass.',
    ingredients: ['Toraja cold brew', 'Coconut milk', 'Pandan', 'Ice'],
    taste: { Bitter: 2, Sweet: 3, Fresh: 3 },
  },
  {
    id: 'aren',
    name: 'Aren Old Fashioned',
    gloss: 'aren: palm sugar',
    family: 'Built like an old fashioned',
    bg: '#FFC93C',
    fg: '#2A1610',
    line: 'Cold brew, smoky palm sugar, orange peel, one big cube. Stirred slowly, sipped slower.',
    ingredients: ['Java cold brew', 'Palm sugar', 'Orange peel', 'One big cube'],
    taste: { Bitter: 3, Sweet: 4, Fresh: 2 },
  },
  {
    id: 'telang',
    name: 'Telang Highball',
    gloss: 'telang: butterfly pea',
    family: 'Built like a highball',
    bg: '#3D7BF2',
    fg: '#FFF4E0',
    line: 'Blue butterfly pea, lemon that turns it violet, espresso on top. Three layers for a long night.',
    ingredients: ['Butterfly pea', 'Lemon', 'Bali Kintamani espresso', 'Soda'],
    taste: { Bitter: 3, Sweet: 2, Fresh: 4 },
  },
];

export const WALL = [
  { src: 'place-interior', cap: 'Before doors. Every table still empty.', rot: -3, tape: 'kunyit' },
  { src: 'm-pour', cap: 'The second espresso meets tonic.', rot: 2.5, tape: 'jambu' },
  { src: 'm-toast', cap: 'Our favourite sound.', rot: -2, tape: 'langit' },
  { src: 'place-bar', cap: 'The bar. Shaken first, served second.', rot: 3, tape: 'tomat' },
  { src: 'm-friends', cap: 'The story never finished. The glasses did.', rot: -1.5, tape: 'pandan' },
  { src: 'm-pastry', cap: 'Out of the oven every afternoon.', rot: 2, tape: 'kunyit' },
  { src: 'place-corner', cap: 'The corner for staying too long.', rot: -2.5, tape: 'jambu' },
  { src: 'm-after', cap: 'Evidence.', rot: 3.5, tape: 'tomat' },
  { src: 'place-night', cap: 'Later is louder.', rot: -3, tape: 'langit' },
  { src: 'place-exterior', cap: 'Look for the red awning.', rot: 1.5, tape: 'pandan' },
];

// House rules double as the brand's positioning: each one is a reason to choose RIUH over a cafe or a bar.
export const RULES = [
  {
    title: 'Zero proof. Full volume.',
    body: 'Nothing on the menu has alcohol in it, so everyone at the table is in on the toast, and on the drive home.',
    mood: 'wink',
    color: 'tomat',
  },
  {
    title: 'Every drink starts as a classic.',
    body: 'Tonic, sour, old fashioned, highball. Real bar technique, rebuilt around coffee instead of spirits.',
    mood: 'happy',
    color: 'langit',
  },
  {
    title: 'Coffee from these islands.',
    body: 'Gayo, Toraja, Flores, Java, Kintamani. Each glass names where its beans grew.',
    mood: 'wow',
    color: 'pandan',
  },
  {
    title: 'Laptops close at six.',
    body: 'After that the tables are for people. Bring someone, or meet someone.',
    mood: 'sleepy',
    color: 'jambu',
  },
];
