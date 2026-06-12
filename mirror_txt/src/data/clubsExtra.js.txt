// Rally — extra club catalog + enrichment shared by the Clubs / ClubsMap /
// BookCourt / SellCourt screens. Filename starts with "clubs" per ownership
// rules; pages merge this with base44.entities.Club so the directory feels
// national, not just גוש דן.

const img = (id, w = 600, h = 400) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop`;

export const AMENITIES = ['מקורה', 'תאורה', 'חניה', 'מסעדה', 'פרו-שופ', 'מלתחות'];

// Enrichment for the 5 base catalog clubs (mockData CLUBS) — fields the
// catalog doesn't carry: price range, amenities, drive time.
export const CLUB_DETAILS = {
  c1: { price_range: '₪150-210', amenities: ['מקורה', 'תאורה', 'חניה', 'פרו-שופ', 'מלתחות'], drive_minutes: 12 },
  c2: { price_range: '₪140-200', amenities: ['תאורה', 'חניה', 'מסעדה', 'מלתחות'], drive_minutes: 22 },
  c3: { price_range: '₪130-180', amenities: ['מקורה', 'תאורה', 'חניה', 'מלתחות'], drive_minutes: 18 },
  c4: { price_range: '₪150-220', amenities: ['מקורה', 'תאורה', 'חניה', 'מסעדה', 'פרו-שופ', 'מלתחות'], drive_minutes: 35 },
  c5: { price_range: '₪120-170', amenities: ['תאורה', 'חניה', 'מלתחות'], drive_minutes: 41 },
};

// Clubs beyond the base catalog — real-feeling Israeli spread.
export const EXTRA_CLUBS = [
  {
    id: 'cx1', name: 'פאדל ארנה ירושלים', city: 'ירושלים', courts_count: 5,
    rating: 4.7, hours: '07:00–23:00', price_range: '₪140-200', indoor: true,
    amenities: ['מקורה', 'תאורה', 'חניה', 'מלתחות'], drive_minutes: 55,
    image_url: img('1595435934249-5df7ed86e1c0'),
  },
  {
    id: 'cx2', name: 'פאדל חיפה מפרץ', city: 'חיפה', courts_count: 6,
    rating: 4.6, hours: '06:30–23:00', price_range: '₪130-190', indoor: true,
    amenities: ['מקורה', 'תאורה', 'חניה', 'מסעדה', 'מלתחות'], drive_minutes: 75,
    image_url: img('1554068865-24cecd4e34b8', 601, 400),
  },
  {
    id: 'cx3', name: 'פאדל הנגב באר שבע', city: 'באר שבע', courts_count: 4,
    rating: 4.5, hours: '07:00–22:30', price_range: '₪110-160', indoor: false,
    amenities: ['תאורה', 'חניה', 'מלתחות'], drive_minutes: 80,
    image_url: img('1622279457486-62dcc4a431d6', 601, 400),
  },
  {
    id: 'cx4', name: 'Padel City מודיעין', city: 'מודיעין', courts_count: 7,
    rating: 4.8, hours: '06:00–23:30', price_range: '₪140-210', indoor: true,
    amenities: ['מקורה', 'תאורה', 'חניה', 'פרו-שופ', 'מלתחות'], drive_minutes: 38,
    image_url: img('1620742820748-87c09249a72a', 601, 400),
  },
  {
    id: 'cx5', name: 'פאדל נמל אשדוד', city: 'אשדוד', courts_count: 4,
    rating: 4.4, hours: '08:00–22:00', price_range: '₪120-170', indoor: false,
    amenities: ['תאורה', 'חניה', 'מסעדה'], drive_minutes: 45,
    image_url: img('1599474924187-334a4ae5bd3c', 601, 400),
  },
  {
    id: 'cx6', name: 'מועדון פאדל כפר סבא', city: 'כפר סבא', courts_count: 3,
    rating: 4.6, hours: '07:00–22:00', price_range: '₪130-180', indoor: true,
    amenities: ['מקורה', 'תאורה', 'מלתחות'], drive_minutes: 26,
    image_url: img('1602211844066-d3bb556e983b', 601, 400),
  },
];

// Merge base catalog rows (from base44) with details + the extra clubs.
export function enrichClubs(baseClubs = []) {
  return [
    ...baseClubs.map((c) => ({ ...CLUB_DETAILS[c.id], ...c })),
    ...EXTRA_CLUBS,
  ];
}

// '₪140-200' → { min: 140, max: 200 }
export function parsePriceRange(range) {
  const m = /(\d+)\D+(\d+)/.exec(range || '');
  if (!m) return { min: 140, max: 200 };
  return { min: Number(m[1]), max: Number(m[2]) };
}

// Tiny deterministic string hash (djb2) — drives "taken" slots, open-slot
// pins etc. without any unseeded randomness.
export function clubHash(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) >>> 0;
  return h;
}

// Real-world coordinates (lat, lng) per city — drives the interactive
// navigation map and the Google Maps directions deep-links.
export const CLUB_LATLNG = {
  'חיפה': [32.794, 34.9896],
  'נתניה': [32.3215, 34.8532],
  'כפר סבא': [32.175, 34.907],
  'רעננה': [32.1848, 34.8713],
  'הרצליה': [32.1663, 34.8436],
  'תל אביב': [32.0853, 34.7818],
  'ראשון לציון': [31.973, 34.7925],
  'מודיעין': [31.8928, 35.0124],
  'ירושלים': [31.7683, 35.2137],
  'אשדוד': [31.8014, 34.6434],
  'באר שבע': [31.253, 34.7915],
};

// Approximate geography on the stylized SVG map (viewBox 0 0 320 600).
// West coast on the left, Jerusalem inland, Beer Sheva south.
export const CLUB_GEO = {
  'חיפה': { x: 121, y: 114 },
  'נתניה': { x: 111, y: 200 },
  'כפר סבא': { x: 126, y: 236 },
  'רעננה': { x: 118, y: 228 },
  'הרצליה': { x: 108, y: 236 },
  'תל אביב': { x: 106, y: 254 },
  'ראשון לציון': { x: 112, y: 272 },
  'מודיעין': { x: 136, y: 274 },
  'ירושלים': { x: 158, y: 280 },
  'אשדוד': { x: 102, y: 294 },
  'באר שבע': { x: 134, y: 352 },
};
