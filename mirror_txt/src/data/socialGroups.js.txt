// Rally — Padel groups mock data (deterministic, Hebrew, Israeli scene).
// Powers /groups and /groups/:id. Joined-state lives in localStorage
// under `rally_groups_joined` (array of group ids).
import { PLAYERS } from '@/data/mockData';

// Same URL shape as the img() helper in mockData — see DESIGN_GUIDE.
const img = (id, w = 600, h = 400) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop`;

export const SOCIAL_GROUPS = [
  {
    id: 'g1',
    name: 'פאדל בוקר תל אביב',
    city: 'תל אביב',
    members_count: 38,
    level_range: 'B1–B2',
    schedule: 'א׳ · ג׳ · ה׳ — 06:30',
    games_per_week: 4,
    avg_level: 'B1',
    cover: img('1554068865-24cecd4e34b8', 600, 320),
    members: [PLAYERS[0], PLAYERS[2], PLAYERS[5]],
    description: 'מתחילים את היום על המגרש, לפני שהעיר מתעוררת. משחקים קבועים בפאדל פוינט ושכר מאמן פעם בחודש.',
  },
  {
    id: 'g2',
    name: 'נשים מנצחות רעננה',
    city: 'רעננה',
    members_count: 24,
    level_range: 'B2–C1',
    schedule: 'ב׳ · ד׳ — 19:00',
    games_per_week: 3,
    avg_level: 'C1',
    cover: img('1620742820748-87c09249a72a', 600, 320),
    members: [PLAYERS[3], PLAYERS[1], PLAYERS[5]],
    description: 'קבוצת נשים תחרותית ותומכת. משחקות פעמיים בשבוע במועדון פאדל רעננה, וכל חודש ערב ליגה פנימית.',
  },
  {
    id: 'g3',
    name: 'ליגת חמישי בערב',
    city: 'ראשון לציון',
    members_count: 52,
    level_range: 'A2–B1',
    schedule: 'ה׳ — 21:00',
    games_per_week: 2,
    avg_level: 'B1',
    cover: img('1599474924187-334a4ae5bd3c', 600, 320),
    members: [PLAYERS[2], PLAYERS[6], PLAYERS[4]],
    description: 'הליגה הוותיקה של ראשון. טבלה אמיתית, מחזורים של שמונה שבועות, ופלייאוף שאף אחד לא מפספס.',
  },
  {
    id: 'g4',
    name: 'אחרי העבודה הרצליה',
    city: 'הרצליה',
    members_count: 31,
    level_range: 'B1–B2',
    schedule: 'א׳–ה׳ — 18:00',
    games_per_week: 5,
    avg_level: 'B2',
    cover: img('1622279457486-62dcc4a431d6', 600, 320),
    members: [PLAYERS[1], PLAYERS[6], PLAYERS[0]],
    description: 'יוצאים מהמשרד ישר למגרש. קבוצה גמישה — מי שפנוי נרשם בבוקר, והמשחקים נסגרים לבד עד הצהריים.',
  },
  {
    id: 'g5',
    name: 'חבורת הסופ״ש נתניה',
    city: 'נתניה',
    members_count: 19,
    level_range: 'C1–C2',
    schedule: 'שישי — 09:00',
    games_per_week: 2,
    avg_level: 'C1',
    cover: img('1602211844066-d3bb556e983b', 600, 320),
    members: [PLAYERS[7], PLAYERS[3], PLAYERS[5]],
    description: 'פאדל של שישי בבוקר מול הים, בלי לחץ ובלי טבלאות. אחרי המשחק — חומוס של שישי, כמובן.',
  },
  {
    id: 'g6',
    name: 'עילית הצפון הישן',
    city: 'תל אביב',
    members_count: 16,
    level_range: 'A1–A2',
    schedule: 'שבת — 08:00',
    games_per_week: 2,
    avg_level: 'A2',
    cover: img('1612534847738-b3af9bc31f0c', 600, 320),
    members: [PLAYERS[6], PLAYERS[2], PLAYERS[0]],
    description: 'הקבוצה הכי תחרותית באזור. כניסה ברמה A בלבד, משחקי דירוג מלאים וכל נקודה נספרת.',
  },
  {
    id: 'g7',
    name: 'מתחילים יחד כפר סבא',
    city: 'כפר סבא',
    members_count: 27,
    level_range: 'C2–D1',
    schedule: 'ג׳ — 20:00',
    games_per_week: 1,
    avg_level: 'C2',
    cover: img('1620742820748-87c09249a72a', 600, 360),
    members: [PLAYERS[3], PLAYERS[7], PLAYERS[1]],
    description: 'נכנסתם עכשיו לעולם הפאדל? כאן לומדים יחד. מאמן מתנדב פעם בשבועיים ומשחקים ברמה רגועה.',
  },
];

// Deterministic extra member names so a group page feels populated
// beyond the three preview faces.
const EXTRA_NAMES = [
  'רועי שפירא', 'ענבר שדה', 'גיא דהן', 'רותם קדם', 'אסף נחום', 'דנה אלמוג',
  'ברק לוין', 'הילה ברנע', 'נדב עוז', 'אופיר סלע', 'עמית גורן', 'תומר אשכנזי',
];

// Members for the detail page: real preview players + generated names.
// Levels alternate between the two ends of the group's level range.
export function getGroupMembers(group) {
  const idx = Math.max(0, SOCIAL_GROUPS.findIndex((g) => g.id === group.id));
  const [hi, lo] = group.level_range.split('–');
  const start = (idx * 3) % EXTRA_NAMES.length;
  const extras = Array.from({ length: 5 }, (_, i) => {
    const name = EXTRA_NAMES[(start + i) % EXTRA_NAMES.length];
    return {
      id: `${group.id}_x${i}`,
      full_name: name,
      level: i % 2 === 0 ? hi : lo,
      avatar_url: null,
      verified: i % 3 === 0,
    };
  });
  return [
    ...group.members.map((p) => ({ ...p })),
    ...extras,
  ];
}

// Recent group-chat messages per group (detail page mini feed).
export const GROUP_MESSAGES = {
  g1: [
    { id: 'gm1', author: 'דניאל כהן', time: '06:02', text: 'מי מגיע מחר? צריך עוד אחד למגרש השני' },
    { id: 'gm2', author: 'מאיה גולן', time: '06:15', text: 'אני בפנים. מביאה כדורים חדשים' },
    { id: 'gm3', author: 'יותם אברהם', time: '07:40', text: 'המגרש הוזמן ל-06:30, אל תאחרו — מתחילים בזמן' },
  ],
  g2: [
    { id: 'gm1', author: 'שירה פרידמן', time: '18:20', text: 'ערב ליגה פנימית ביום רביעי — ההרשמה אצלי' },
    { id: 'gm2', author: 'נועה לוי', time: '18:34', text: 'רשמי אותי ואת מאיה, אנחנו זוג' },
    { id: 'gm3', author: 'מאיה גולן', time: '19:01', text: 'מישהי רוצה להגיע מוקדם לחימום קיר?' },
  ],
  g3: [
    { id: 'gm1', author: 'עומר שלום', time: '20:12', text: 'טבלת המחזור עודכנה — הפלייאוף עוד שבועיים' },
    { id: 'gm2', author: 'איתי מזרחי', time: '20:30', text: 'אנחנו צריכים לנצח את המשחק הבא כדי לעלות מקום' },
    { id: 'gm3', author: 'יותם אברהם', time: '21:05', text: 'מי שלא אישר הגעה עד רביעי — יוצא מהמחזור' },
  ],
  g4: [
    { id: 'gm1', author: 'נועה לוי', time: '16:45', text: 'מי פנוי היום ב-18:00? יש לנו מגרש ב-Padel Up' },
    { id: 'gm2', author: 'דניאל כהן', time: '16:52', text: 'אני יוצא מהמשרד ב-17:30, שמרו לי מקום' },
    { id: 'gm3', author: 'עומר שלום', time: '17:10', text: 'סגור. רביעייה מלאה, נתראה שם' },
  ],
  g5: [
    { id: 'gm1', author: 'טל בן דוד', time: '08:10', text: 'שישי הקרוב — שני מגרשים מ-9 עד 11' },
    { id: 'gm2', author: 'שירה פרידמן', time: '08:25', text: 'מגיעה! מישהו מביא רחבים או שאני קונה בדרך?' },
    { id: 'gm3', author: 'מאיה גולן', time: '09:00', text: 'אחרי המשחק יושבים בחוף, מי שנשאר מוזמן' },
  ],
  g6: [
    { id: 'gm1', author: 'עומר שלום', time: '07:30', text: 'שבת הקרובה משחקי דירוג מלאים — בלי חימום ארוך' },
    { id: 'gm2', author: 'יותם אברהם', time: '07:48', text: 'מתאים. אני רוצה לסגור את הפער מול A1' },
    { id: 'gm3', author: 'דניאל כהן', time: '08:15', text: 'הזמנתי שופט מתנדב למשחק המרכזי' },
  ],
  g7: [
    { id: 'gm1', author: 'שירה פרידמן', time: '19:30', text: 'המאמן מגיע בשלישי — מי שרוצה תרגול הגשות שיגיע ב-19:30' },
    { id: 'gm2', author: 'טל בן דוד', time: '19:55', text: 'שאלה של מתחילים: איזה מחבט אתם ממליצים לקנות?' },
    { id: 'gm3', author: 'נועה לוי', time: '20:20', text: 'אל תקנה עדיין — תתנסה בכמה של המועדון קודם' },
  ],
};

export const GROUP_CITIES = ['הכל', ...new Set(SOCIAL_GROUPS.map((g) => g.city))];
