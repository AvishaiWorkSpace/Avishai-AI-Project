// Rally — Mock data layer (Israeli padel scene)
// Used so the app runs fully offline without the base44 backend.

const img = (id, w = 600, h = 400) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop`;

const face = (id) =>
  `https://images.unsplash.com/photo-${id}?w=120&h=120&fit=crop&crop=face`;

export const CLUBS = [
  { id: 'c1', name: 'פאדל פוינט תל אביב', city: 'תל אביב', courts_count: 6, hours: '07:00–23:00', image_url: img('1554068865-24cecd4e34b8'), rating: 4.8, indoor: true },
  { id: 'c2', name: 'Padel Up הרצליה', city: 'הרצליה', courts_count: 4, hours: '06:00–23:00', image_url: img('1622279457486-62dcc4a431d6'), rating: 4.7, indoor: false },
  { id: 'c3', name: 'מועדון פאדל רעננה', city: 'רעננה', courts_count: 5, hours: '07:00–22:00', image_url: img('1626224583764-f87db24ac4ea'), rating: 4.6, indoor: true },
  { id: 'c4', name: 'Smash פאדל ראשון', city: 'ראשון לציון', courts_count: 8, hours: '06:30–23:30', image_url: img('1599474924187-334a4ae5bd3c'), rating: 4.9, indoor: true },
  { id: 'c5', name: 'פאדל ביץ׳ נתניה', city: 'נתניה', courts_count: 3, hours: '08:00–22:00', image_url: img('1591491653056-4313d154d8f1'), rating: 4.5, indoor: false },
];

export const PLAYERS = [
  { id: 'p1', full_name: 'דניאל כהן', level: 'B1', city: 'תל אביב', avatar_url: face('1507003211169-0a1dd7228f2d'), rally_rating: 1820, verified: true, preferred_hand: 'ימין', games_played: 47, phone: '052-8431176' },
  { id: 'p2', full_name: 'נועה לוי', level: 'B2', city: 'הרצליה', avatar_url: face('1494790108377-be9c29b29330'), rally_rating: 1710, verified: true, preferred_hand: 'שמאל', games_played: 32, phone: '054-7209348' },
  { id: 'p3', full_name: 'יותם אברהם', level: 'A2', city: 'תל אביב', avatar_url: face('1500648767791-00dcc994a43e'), rally_rating: 1990, verified: true, preferred_hand: 'ימין', games_played: 88, phone: '050-3318622' },
  { id: 'p4', full_name: 'שירה פרידמן', level: 'C1', city: 'רעננה', avatar_url: face('1438761681033-6461ffad8d80'), rally_rating: 1540, verified: false, preferred_hand: 'ימין', games_played: 18, phone: '053-6627491' },
  { id: 'p5', full_name: 'איתי מזרחי', level: 'B1', city: 'ראשון לציון', avatar_url: face('1633332755192-727a05c4013d'), rally_rating: 1795, verified: true, preferred_hand: 'ימין', games_played: 54, phone: '058-5104836' },
  { id: 'p6', full_name: 'מאיה גולן', level: 'B2', city: 'תל אביב', avatar_url: face('1534528741775-53994a69daeb'), rally_rating: 1680, verified: true, preferred_hand: 'שמאל', games_played: 29, phone: '052-9947210' },
  { id: 'p7', full_name: 'עומר שלום', level: 'A1', city: 'הרצליה', avatar_url: face('1506794778202-cad84cf45f1d'), rally_rating: 2080, verified: true, preferred_hand: 'ימין', games_played: 120, phone: '050-2275983' },
  { id: 'p8', full_name: 'טל בן דוד', level: 'C1', city: 'נתניה', avatar_url: face('1539571696357-5a69c17a67c6'), rally_rating: 1510, verified: false, preferred_hand: 'ימין', games_played: 12, phone: '054-8812057' },
];

// helper to build matches relative to "now"
const hoursFromNow = (h) => new Date(Date.now() + h * 3600 * 1000).toISOString();

export const MATCHES = [
  {
    id: 'm1', club_id: 'c1', club_name: 'פאדל פוינט תל אביב', club_image: img('1554068865-24cecd4e34b8'),
    city: 'תל אביב', level: 'B2', status: 'open', drive_minutes: 12,
    start_time: hoursFromNow(4), duration_min: 90, price_per_player: 45,
    players: [PLAYERS[1], PLAYERS[5], PLAYERS[3]], max_players: 4, gender: 'mixed',
    court_type: 'מקורה', match_type: 'תחרותי',
  },
  {
    id: 'm2', club_id: 'c2', club_name: 'Padel Up הרצליה', club_image: img('1622279457486-62dcc4a431d6'),
    city: 'הרצליה', level: 'B1', status: 'open', drive_minutes: 22,
    start_time: hoursFromNow(20), duration_min: 90, price_per_player: 50,
    players: [PLAYERS[0], PLAYERS[4]], max_players: 4, gender: 'men',
    court_type: 'חוץ', match_type: 'ידידותי',
  },
  {
    id: 'm3', club_id: 'c4', club_name: 'Smash פאדל ראשון', club_image: img('1599474924187-334a4ae5bd3c'),
    city: 'ראשון לציון', level: 'A2', status: 'open', drive_minutes: 35,
    start_time: hoursFromNow(28), duration_min: 60, price_per_player: 55,
    players: [PLAYERS[2], PLAYERS[6], PLAYERS[4]], max_players: 4, gender: 'mixed',
    court_type: 'מקורה', match_type: 'תחרותי',
  },
  {
    id: 'm4', club_id: 'c3', club_name: 'מועדון פאדל רעננה', club_image: img('1626224583764-f87db24ac4ea'),
    city: 'רעננה', level: 'C1', status: 'open', drive_minutes: 18,
    start_time: hoursFromNow(6), duration_min: 90, price_per_player: 40,
    players: [PLAYERS[3]], max_players: 4, gender: 'women',
    court_type: 'מקורה', match_type: 'ידידותי',
  },
  {
    id: 'm5', club_id: 'c5', club_name: 'פאדל ביץ׳ נתניה', club_image: img('1591491653056-4313d154d8f1'),
    city: 'נתניה', level: 'B2', status: 'open', drive_minutes: 41,
    start_time: hoursFromNow(48), duration_min: 90, price_per_player: 42,
    players: [PLAYERS[7], PLAYERS[1], PLAYERS[5]], max_players: 4, gender: 'mixed',
    court_type: 'חוץ', match_type: 'ידידותי',
  },
  {
    id: 'm6', club_id: 'c1', club_name: 'פאדל פוינט תל אביב', club_image: img('1554068865-24cecd4e34b8'),
    city: 'תל אביב', level: 'B1', status: 'open', drive_minutes: 12,
    start_time: hoursFromNow(2), duration_min: 60, price_per_player: 48,
    players: [PLAYERS[0], PLAYERS[5], PLAYERS[4]], max_players: 4, gender: 'mixed',
    court_type: 'מקורה', match_type: 'תחרותי',
  },
];

// A match that just ended — drives the post-match rating demo flow.
// The current user played with p1+p6 against p2 (host is p1).
export const FINISHED_MATCH = {
  id: 'm0', club_id: 'c1', club_name: 'פאדל פוינט תל אביב', club_image: img('1554068865-24cecd4e34b8'),
  city: 'תל אביב', level: 'B2', status: 'completed', drive_minutes: 12,
  start_time: hoursFromNow(-2.5), duration_min: 90, price_per_player: 45,
  players: [PLAYERS[0], PLAYERS[1], PLAYERS[5]], max_players: 4, gender: 'mixed',
  court_type: 'מקורה', match_type: 'תחרותי', host_id: 'p1', approved: true,
};

// Group chat for the finished match.
export const CHAT_MESSAGES = [
  { id: 'msg1', sender_id: 'p1', text: 'ערב טוב חברים! המגרש שלנו, מגרש 3 מקורה 🎾', minutes_ago: 195 },
  { id: 'msg2', sender_id: 'p2', text: 'מעולה, אני מביאה כדורים חדשים', minutes_ago: 190 },
  { id: 'msg3', sender_id: 'me', text: 'אני בדרך, 10 דקות', minutes_ago: 180 },
  { id: 'msg4', sender_id: 'p6', text: 'חניה יש בשפע מאחורה למי שמגיע ברכב', minutes_ago: 178 },
  { id: 'msg5', sender_id: 'p1', text: 'איזה משחק היה! כל הכבוד לכולם 🔥', minutes_ago: 15 },
  { id: 'msg6', sender_id: 'p2', text: 'הסט השני היה צמוד ברמות', minutes_ago: 12 },
];

// ---- National leaderboard pool ----
// Deterministic extra players so the table feels like a real national ranking.
const POOL_NAMES = [
  'אורי ברק', 'רועי שפירא', 'גיא דהן', 'ליאור קצב', 'רון הראל', 'אסף נחום',
  'יובל פרץ', 'אלון שגיא', 'נדב עוז', 'תומר אשכנזי', 'עידו רביב', 'ברק לוין',
  'שחר אדלר', 'אביב טל', 'ניר חזן', 'דור ימיני', 'אופיר סלע', 'מתן ארד',
  'עמית גורן', 'יהונתן צור', 'ענבר שדה', 'רותם קדם', 'הילה ברנע', 'דנה אלמוג',
];
const POOL_CITIES = ['תל אביב', 'הרצליה', 'רעננה', 'ראשון לציון', 'נתניה', 'רמת גן', 'כפר סבא', 'חולון'];

// Simple deterministic PRNG so the table is stable between reloads.
const mulberry32 = (seed) => () => {
  seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const rand = mulberry32(2026);
const POOL_PLAYERS = POOL_NAMES.map((name, i) => {
  const rating = Math.round(1280 + rand() * 820); // 1280–2100
  const games = Math.round(8 + rand() * 90);
  const opponents = Math.max(2, Math.round(games * (0.25 + rand() * 0.5)));
  const wins = Math.round(games * (0.3 + rand() * 0.4));
  return {
    id: `lb${i}`,
    full_name: name,
    city: POOL_CITIES[Math.floor(rand() * POOL_CITIES.length)],
    avatar_url: null,
    rally_rating: rating,
    rd: Math.round(55 + rand() * 200),
    games_played: games,
    distinct_opponents: opponents,
    wins,
    losses: games - wins,
    verified: rand() > 0.35,
    trend: Math.round((rand() - 0.45) * 40), // rating delta over last 5 games
  };
});

// Known players (richer profiles) merged with the generated pool.
export const LEADERBOARD_PLAYERS = [
  ...PLAYERS.map((p, i) => ({
    ...p,
    rd: [72, 88, 60, 140, 75, 92, 55, 165][i],
    distinct_opponents: Math.max(3, Math.round(p.games_played * 0.4)),
    wins: Math.round(p.games_played * (0.4 + (p.rally_rating - 1400) / 2000)),
    losses: 0, // filled below
    trend: [12, -8, 21, 5, 9, -14, 18, 3][i],
  })),
  ...POOL_PLAYERS,
].map(p => ({ ...p, losses: p.losses || Math.max(0, p.games_played - p.wins) }));

// Peer-feedback axis history for the current user (0–100 per axis).
// previous = the window before last; current = latest aggregated window.
export const PEER_AXES_HISTORY = {
  previous: { attack: 54, defense: 63, brain: 49, spirit: 88 },
  current: { attack: 61, defense: 65, brain: 58, spirit: 92 },
  raters_count: 9,
  window_label: 'מאז 5 המשחקים האחרונים',
};

// Court marketplace listings.
// type: 'transfer' = a player reselling a slot they can't use (last-minute),
//       'club'     = direct availability published by the club.
export const COURT_LISTINGS = [
  {
    id: 'l1', type: 'transfer', club_name: 'פאדל פוינט תל אביב', city: 'תל אביב',
    court_label: 'מגרש 3 · מקורה', start_time: hoursFromNow(3), duration_min: 90,
    original_price: 180, price: 120, seller: PLAYERS[1], urgent: true,
    image_url: img('1554068865-24cecd4e34b8'),
  },
  {
    id: 'l2', type: 'club', club_name: 'Padel Up הרצליה', city: 'הרצליה',
    court_label: 'מגרש 1 · חוץ', start_time: hoursFromNow(5), duration_min: 60,
    original_price: 160, price: 160, seller: null, urgent: false,
    image_url: img('1622279457486-62dcc4a431d6'),
  },
  {
    id: 'l3', type: 'transfer', club_name: 'Smash פאדל ראשון', city: 'ראשון לציון',
    court_label: 'מגרש 5 · מקורה', start_time: hoursFromNow(2), duration_min: 90,
    original_price: 200, price: 130, seller: PLAYERS[4], urgent: true,
    image_url: img('1599474924187-334a4ae5bd3c'),
  },
  {
    id: 'l4', type: 'club', club_name: 'מועדון פאדל רעננה', city: 'רעננה',
    court_label: 'מגרש 2 · מקורה', start_time: hoursFromNow(26), duration_min: 90,
    original_price: 150, price: 150, seller: null, urgent: false,
    image_url: img('1626224583764-f87db24ac4ea'),
  },
  {
    id: 'l5', type: 'transfer', club_name: 'פאדל ביץ׳ נתניה', city: 'נתניה',
    court_label: 'מגרש 1 · חוץ', start_time: hoursFromNow(8), duration_min: 60,
    original_price: 140, price: 95, seller: PLAYERS[7], urgent: false,
    image_url: img('1591491653056-4313d154d8f1'),
  },
];

// The "current user" — mirrors what Onboarding would store in localStorage.
export const DEFAULT_USER = {
  full_name: 'אבישי',
  level: 'B2',
  city: 'תל אביב',
  avatar_url: face('1633332755192-727a05c4013d'),
  preferred_hand: 'ימין',
  rally_rating: 1735,
  verified: true,
};

// Full rating profile for the dashboard + transparency screen.
// opponentCounts feeds the diversity-weighted reliability model.
export const RATING_PROFILE = {
  rating: 1735,
  rd: 95,
  vol: 0.06,
  peak: 1762,
  rank: 142,
  totalPlayers: 1840,
  wins: 15,
  losses: 9,
  // 24 games spread over 11 distinct opponents → dEff ≈ 9.6 → ~88% reliable
  opponentCounts: [4, 3, 3, 2, 2, 2, 2, 2, 2, 1, 1],
  // recent results, newest last
  form: ['W', 'L', 'W', 'W', 'L', 'W', 'W', 'W', 'L', 'W'],
  // rating progression over the last games (for the sparkline)
  history: [
    1500, 1512, 1498, 1535, 1560, 1548, 1590, 1625, 1610,
    1648, 1672, 1660, 1695, 1718, 1705, 1735,
  ],
  // breakdown of opponents actually faced (for the diversity viz)
  opponentsFaced: [
    { name: 'יותם א.', level: 'A2', games: 4 },
    { name: 'נועה ל.', level: 'B2', games: 3 },
    { name: 'איתי מ.', level: 'B1', games: 3 },
    { name: 'מאיה ג.', level: 'B2', games: 2 },
    { name: 'עומר ש.', level: 'A1', games: 2 },
    { name: 'דניאל כ.', level: 'B1', games: 2 },
    { name: 'שירה פ.', level: 'C1', games: 2 },
    { name: 'טל ב.', level: 'C1', games: 2 },
    { name: 'רון ה.', level: 'B2', games: 2 },
    { name: 'גיא ד.', level: 'B1', games: 1 },
    { name: 'ליאור ק.', level: 'C1', games: 1 },
  ],
};
