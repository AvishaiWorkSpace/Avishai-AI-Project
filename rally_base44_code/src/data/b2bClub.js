// Rally B2B — deterministic demo data for the club-owner screens.
// Demo club: פאדל פוינט תל אביב (c1, 6 courts).

export const DEMO_CLUB = {
  id: 'c1',
  name: 'פאדל פוינט תל אביב',
  courts_count: 6,
};

export const CLUB_KPIS = [
  { id: 'occupancy', label: 'תפוסה היום', value: '78%', trend: +6, suffix: 'מול שבוע שעבר' },
  { id: 'revenue', label: 'הכנסות השבוע', value: '₪12,400', trend: +11, suffix: 'מול שבוע שעבר' },
  { id: 'bookings', label: 'הזמנות היום', value: '14', trend: +2, suffix: 'מול אתמול' },
  { id: 'members', label: 'חברים חדשים החודש', value: '23', trend: -3, suffix: 'מול חודש שעבר' },
];

// Occupancy % per opening hour (07:00–23:00) — evening peak.
export const OCCUPANCY_BY_HOUR = [
  { hour: '07', pct: 45 }, { hour: '08', pct: 58 }, { hour: '09', pct: 52 },
  { hour: '10', pct: 38 }, { hour: '11', pct: 30 }, { hour: '12', pct: 26 },
  { hour: '13', pct: 24 }, { hour: '14', pct: 30 }, { hour: '15', pct: 42 },
  { hour: '16', pct: 56 }, { hour: '17', pct: 74 }, { hour: '18', pct: 92 },
  { hour: '19', pct: 100 }, { hour: '20', pct: 96 }, { hour: '21', pct: 88 },
  { hour: '22', pct: 62 },
];

// Daily revenue, last 14 days (₪) — weekend dips, steady growth.
export const REVENUE_14D = [
  { day: '28.5', revenue: 1380 }, { day: '29.5', revenue: 1520 },
  { day: '30.5', revenue: 1245 }, { day: '31.5', revenue: 980 },
  { day: '1.6', revenue: 1610 }, { day: '2.6', revenue: 1685 },
  { day: '3.6', revenue: 1540 }, { day: '4.6', revenue: 1720 },
  { day: '5.6', revenue: 1495 }, { day: '6.6', revenue: 1150 },
  { day: '7.6', revenue: 1090 }, { day: '8.6', revenue: 1830 },
  { day: '9.6', revenue: 1905 }, { day: '10.6', revenue: 1760 },
];

// status: occupied | free | maintenance
export const COURTS_STATUS = [
  { id: 1, label: 'מגרש 1', status: 'occupied', until: '20:30' },
  { id: 2, label: 'מגרש 2', status: 'occupied', until: '21:00' },
  { id: 3, label: 'מגרש 3', status: 'free', until: null },
  { id: 4, label: 'מגרש 4', status: 'occupied', until: '20:00' },
  { id: 5, label: 'מגרש 5', status: 'free', until: null },
  { id: 6, label: 'מגרש 6', status: 'maintenance', until: 'מחר' },
];

export const UPCOMING_BOOKINGS = [
  { id: 'b1', time: '19:00', court: 1, name: 'דניאל כהן', paid: true, players: 4 },
  { id: 'b2', time: '19:00', court: 2, name: 'נועה לוי', paid: true, players: 4 },
  { id: 'b3', time: '20:30', court: 1, name: 'יותם אברהם', paid: false, players: 2 },
  { id: 'b4', time: '20:30', court: 4, name: 'מאיה גולן', paid: true, players: 4 },
  { id: 'b5', time: '21:00', court: 2, name: 'איתי מזרחי', paid: false, players: 3 },
];

// Pricing editor defaults (per court, ₪).
export const DEFAULT_PRICING = {
  peak: { 60: 160, 90: 220 },
  off: { 60: 110, 90: 150 },
};

export const DEFAULT_HOURS = [
  { id: 'weekdays', label: 'א׳–ה׳', open: '07:00', close: '23:00' },
  { id: 'friday', label: 'שישי', open: '07:00', close: '16:00' },
  { id: 'saturday', label: 'שבת', open: '09:00', close: '23:00' },
];

export const STAFF = [
  { id: 's1', name: 'אורי ברק', role: 'מנהל משמרת' },
  { id: 's2', name: 'דנה אלמוג', role: 'קבלה' },
  { id: 's3', name: 'מתן ארד', role: 'מאמן הבית' },
];

// Platform-admin: players awaiting level verification.
export const VERIFICATION_QUEUE = [
  { id: 'v1', name: 'רועי שפירא', city: 'רמת גן', claimed: 'B1', evidence: '3 משחקים מתועדים מול B1 מאומתים' },
  { id: 'v2', name: 'ענבר שדה', city: 'תל אביב', claimed: 'A2', evidence: 'אלופת מועדון לשעבר, 12 נצחונות עוקבים' },
  { id: 'v3', name: 'ברק לוין', city: 'חולון', claimed: 'B2', evidence: 'דירוג 1690 ב-18 משחקים' },
  { id: 'v4', name: 'הילה ברנע', city: 'כפר סבא', claimed: 'C1', evidence: 'עברה את מבחן הרמה בשאלון + 2 המלצות' },
];

export const OPEN_REPORTS = [
  { id: 'r1', type: 'no_show', title: 'שחקן לא הגיע למשחק', detail: 'משחק ב-Padel Up הרצליה, 8.6 · דווח ע״י 3 שחקנים', severity: 'medium' },
  { id: 'r2', type: 'wrong_result', title: 'ערעור על תוצאה', detail: 'המפסידים טוענים 6-4 6-7 10-7 ולא 2-0 · ממתין לאישור הזוג השני', severity: 'low' },
];

export const PLATFORM_KPIS = [
  { id: 'players', label: 'שחקנים רשומים', value: '1,840' },
  { id: 'matches', label: 'משחקים השבוע', value: '312' },
  { id: 'clubs', label: 'מועדונים פעילים', value: '12' },
  { id: 'reliability', label: 'אמינות דירוג ממוצעת', value: '84%' },
];
