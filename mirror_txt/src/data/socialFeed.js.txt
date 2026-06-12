// Rally — Community feed mock data (deterministic, Hebrew, Israeli padel scene).
// Post types:
//   tip     — coaching / improvement tip
//   result  — match result brag, carries `score` set chips
//   looking — "missing a fourth" call, carries a CTA into /find
//   event   — club / league / tournament happening
import { PLAYERS } from '@/data/mockData';

// Same URL shape as the img() helper in mockData — see DESIGN_GUIDE.
const img = (id, w = 600, h = 400) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop`;

export const FEED_POSTS = [
  {
    id: 'f1',
    type: 'looking',
    author: PLAYERS[5], // מאיה גולן
    time: 'לפני 12 דק׳',
    text: 'מחפשים רביעי להערב 19:30 בפאדל פוינט תל אביב, רמה B2. משחק טוב, אווירה רגועה — מי סוגר לנו את המגרש?',
    likes: 7,
    comments: 4,
  },
  {
    id: 'f2',
    type: 'result',
    author: PLAYERS[2], // יותם אברהם
    time: 'לפני 40 דק׳',
    text: 'שעתיים של קרב מול עומר ושירה — הסט השלישי נסגר רק בנקודה האחרונה. ככה נראה פאדל כשאף אחד לא מוותר.',
    score: ['6-4', '3-6', '7-5'],
    image: img('1554068865-24cecd4e34b8', 600, 340),
    likes: 32,
    comments: 11,
  },
  {
    id: 'f3',
    type: 'tip',
    author: PLAYERS[6], // עומר שלום (A1)
    time: 'לפני שעה',
    text: 'טיפ לשבוע: בעמדת רשת, אל תרדפו אחרי כל כדור. תנו לזכוכית לעשות את העבודה, תחזיקו פוזיציה — והסמאש הנכון כבר יגיע אליכם.',
    likes: 54,
    comments: 16,
  },
  {
    id: 'f4',
    type: 'event',
    author: PLAYERS[0], // דניאל כהן
    time: 'לפני 3 שע׳',
    text: 'ליגת חמישי חוזרת! נפתחה ההרשמה למחזור האביב ב-Smash פאדל ראשון — 16 מקומות, רמות A2 עד B1, פרס לזוג המנצח.',
    image: img('1599474924187-334a4ae5bd3c', 600, 340),
    likes: 41,
    comments: 23,
  },
  {
    id: 'f5',
    type: 'tip',
    author: PLAYERS[1], // נועה לוי
    time: 'לפני 5 שע׳',
    text: 'אחרי חודשיים של אימוני קיר אני סוף סוף מחזירה באנדחה בביטחון. ההמלצה שלי למי שנתקע ברמה: 20 דקות קיר לפני כל משחק. משעמם — אבל עובד.',
    likes: 28,
    comments: 9,
  },
  {
    id: 'f6',
    type: 'result',
    author: PLAYERS[4], // איתי מזרחי
    time: 'לפני 8 שע׳',
    text: 'ראשון בבוקר, 7:00, מגרש ריק והניצחון הראשון שלי על זוג A2. שווה כל שניית שינה שהלכה לאיבוד.',
    score: ['6-3', '6-4'],
    likes: 19,
    comments: 6,
  },
  {
    id: 'f7',
    type: 'looking',
    author: PLAYERS[3], // שירה פרידמן
    time: 'אתמול',
    text: 'מישהי משלימה רביעייה נשית ברעננה מחר ב-9:00? רמה C1, מגרש מקורה, קפה אחרי — מובטח.',
    likes: 12,
    comments: 8,
  },
  {
    id: 'f8',
    type: 'event',
    author: PLAYERS[7], // טל בן דוד
    time: 'אתמול',
    text: 'טורניר החוף של נתניה בעוד שבועיים — משחקים בחוץ עם רוח ים אמיתית. מי שרוצה להתאמן על תנאי שטח, זה הזמן להירשם.',
    image: img('1602211844066-d3bb556e983b', 600, 340),
    likes: 36,
    comments: 14,
  },
  {
    id: 'f9',
    type: 'tip',
    author: PLAYERS[2], // יותם אברהם
    time: 'לפני יומיים',
    text: 'לוב הוא לא בריחה — הוא התקפה איטית. לוב עמוק וגבוה לפינה השמאלית מזיז את היריב מהרשת, ומשם הנקודה שלכם.',
    likes: 47,
    comments: 12,
  },
];

// Meta for rendering type badges in the feed.
export const POST_TYPE_META = {
  tip: { label: 'טיפ' },
  result: { label: 'תוצאה' },
  looking: { label: 'מחפשים רביעי' },
  event: { label: 'אירוע' },
};

// Replies per post — opens when tapping the comment action (X-style thread).
export const POST_REPLIES = {
  f1: [
    { id: 'r1a', author: PLAYERS[0], time: 'לפני 8 דק׳', text: 'אם זה נסגר ל-19:30 אני בפנים. שולח הודעה.' },
    { id: 'r1b', author: PLAYERS[4], time: 'לפני 4 דק׳', text: 'B2 מתאים לי בול, יש עוד מקום?' },
  ],
  f2: [
    { id: 'r2a', author: PLAYERS[6], time: 'לפני 30 דק׳', text: 'הסט השלישי הזה היה שיעור בפאדל. כבוד.' },
    { id: 'r2b', author: PLAYERS[1], time: 'לפני 22 דק׳', text: 'המאמץ בנקודה האחרונה היה מטורף 👏' },
  ],
  f3: [
    { id: 'r3a', author: PLAYERS[2], time: 'לפני 40 דק׳', text: 'הטיפ הכי טוב ששמעתי החודש. רוב השחקנים רודפים במקום להחזיק עמדה.' },
  ],
  f4: [
    { id: 'r4a', author: PLAYERS[5], time: 'לפני שעתיים', text: 'נרשמנו! מי עוד מהצפון מגיע?' },
    { id: 'r4b', author: PLAYERS[7], time: 'לפני שעה', text: 'יש עוד מקומות לזוגות B1?' },
  ],
  f5: [
    { id: 'r5a', author: PLAYERS[3], time: 'לפני 4 שע׳', text: 'מאמצת את זה מהיום. תודה נועה!' },
  ],
  f9: [
    { id: 'r9a', author: PLAYERS[5], time: 'אתמול', text: 'הלוב לפינה השמאלית שינה לי את המשחק. ממליצה בחום.' },
  ],
};

// "מה קורה בפאדל" — trending topics, X-style.
export const TRENDS = [
  { id: 't1', tag: 'טורניר החוף נתניה', category: 'טורנירים · ישראל', posts: 218, to: '/tournaments' },
  { id: 't2', tag: 'ליגת חמישי', category: 'ליגות · ראשון לציון', posts: 142, to: '/tournaments' },
  { id: 't3', tag: 'Premier Padel', category: 'עולמי · טרנדי', posts: 1830, to: '/community' },
  { id: 't4', tag: 'מחפשים רביעי', category: 'משחקים פתוחים', posts: 96, to: '/find' },
];
