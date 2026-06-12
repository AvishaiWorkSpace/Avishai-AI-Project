// Rally — tournament catalog for the Tournaments screen.
// Dates are relative to "now" so the demo always shows upcoming events.

import { PLAYERS } from '@/data/mockData';

const img = (id, w = 800, h = 440) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop`;

const daysFromNow = (d, hour = 18) => {
  const t = new Date();
  t.setDate(t.getDate() + d);
  t.setHours(hour, 0, 0, 0);
  return t.toISOString();
};

export const TOURNAMENTS = [
  {
    id: 't1', name: 'אליפות תל אביב הפתוחה', club_name: 'פאדל פוינט תל אביב', city: 'תל אביב',
    date: daysFromNow(5, 9), level_range: 'B2–A1', format: 'נוקאאוט זוגות',
    prize: '₪3,000 + חסות', entry_fee: 120, slots_filled: 26, slots_total: 32,
    image_url: img('1554068865-24cecd4e34b8'),
  },
  {
    id: 't2', name: 'גביע המרכז', club_name: 'Padel City מודיעין', city: 'מודיעין',
    date: daysFromNow(9, 10), level_range: 'C1–B1', format: 'אמריקנו',
    prize: '₪1,500 + ציוד', entry_fee: 90, slots_filled: 14, slots_total: 24,
    image_url: img('1620742820748-87c09249a72a'),
  },
  {
    id: 't3', name: 'ליגת לילה הרצליה', club_name: 'Padel Up הרצליה', city: 'הרצליה',
    date: daysFromNow(13, 21), level_range: 'B2–B1', format: 'אמריקנו',
    prize: '₪1,000 + מנוי חודשי', entry_fee: 80, slots_filled: 18, slots_total: 20,
    image_url: img('1622279457486-62dcc4a431d6'),
  },
  {
    id: 't4', name: 'מסטרס ראשון לציון', club_name: 'Smash פאדל ראשון', city: 'ראשון לציון',
    date: daysFromNow(18, 9), level_range: 'A2–A1', format: 'נוקאאוט זוגות',
    prize: '₪5,000', entry_fee: 150, slots_filled: 9, slots_total: 16,
    image_url: img('1599474924187-334a4ae5bd3c'),
  },
  {
    id: 't5', name: 'טורניר חורף ירושלים', club_name: 'פאדל ארנה ירושלים', city: 'ירושלים',
    date: daysFromNow(24, 10), level_range: 'C2–B2', format: 'אמריקנו',
    prize: '₪1,200 + חסות', entry_fee: 70, slots_filled: 6, slots_total: 24,
    image_url: img('1595435934249-5df7ed86e1c0'),
  },
  {
    id: 't6', name: 'גביע הים נתניה', club_name: 'פאדל ביץ׳ נתניה', city: 'נתניה',
    date: daysFromNow(29, 16), level_range: 'B1–A2', format: 'נוקאאוט זוגות',
    prize: '₪2,000', entry_fee: 100, slots_filled: 11, slots_total: 16,
    image_url: img('1602211844066-d3bb556e983b'),
  },
];

// Finished tournaments — podium names come from the known player pool.
export const PAST_TOURNAMENTS = [
  {
    id: 'tp1', name: 'אליפות האביב תל אביב', club_name: 'פאדל פוינט תל אביב', city: 'תל אביב',
    date: daysFromNow(-12, 9), participants: 32, format: 'נוקאאוט זוגות',
    podium: [PLAYERS[2].full_name, PLAYERS[6].full_name, PLAYERS[0].full_name],
  },
  {
    id: 'tp2', name: 'אמריקנו פתיחת העונה', club_name: 'מועדון פאדל רעננה', city: 'רעננה',
    date: daysFromNow(-26, 10), participants: 24, format: 'אמריקנו',
    podium: [PLAYERS[1].full_name, PLAYERS[4].full_name, PLAYERS[5].full_name],
  },
];
