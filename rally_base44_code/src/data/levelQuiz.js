// Rally level calibration quiz.
// Source of truth: Rally_Level_Assessment.md — Israeli scale (מתחיל → A1),
// weighted multiple-choice scoring. Tactical understanding (Q8) and game
// reading (Q9) carry the highest weights: they are what separate B from A.
// Q11 (partner play) and Q12 (serve/return) extend the validated 10-question
// bank to 12 per onboarding spec.

export const QUIZ_QUESTIONS = [
  {
    id: 'experience',
    emoji: '🎾',
    title: 'כמה זמן אתה משחק פאדל?',
    weight: 1.0,
    objective: true,
    options: [
      { label: 'זה עתה התחלתי, בלי רקע בענפי מחבט', score: 0 },
      { label: 'כמה שבועות עד כמה חודשים', score: 2 },
      { label: 'בערך שנה, משחק מדי פעם', score: 3 },
      { label: '1–3 שנים, משחק קבוע', score: 5 },
      { label: '3+ שנים, כולל אימונים עם מאמן', score: 7 },
    ],
  },
  {
    id: 'rally_pace',
    emoji: '🔄',
    title: 'ראלי מהקו האחורי — איך אתה מחזיק?',
    weight: 1.0,
    objective: false,
    options: [
      { label: 'מתקשה — כדורים בודדים בקצב איטי', score: 1 },
      { label: 'מתמסר בקצב סביר', score: 2 },
      { label: 'יציב יחסית בקצב משחק רגיל', score: 3 },
      { label: 'יציב גם כשהקצב מהיר', score: 6 },
      { label: 'שולט בקצב ומכתיב אותו', score: 8 },
    ],
  },
  {
    id: 'volley',
    emoji: '🥅',
    title: 'וולי ומשחק ברשת',
    weight: 1.0,
    objective: false,
    options: [
      { label: 'כמעט לא משחק וולי', score: 1 },
      { label: 'שליטה בסיסית מאוד בוולי', score: 3 },
      { label: 'שליטה טובה, שומר עמדת רשת', score: 4 },
      { label: 'וולי יציב גם תחת לחץ', score: 5 },
      { label: 'שולט ברשת ומסיים נקודות מהוולי', score: 7 },
    ],
  },
  {
    id: 'glass',
    emoji: '🧱',
    title: 'כדורים שחוזרים מהזכוכית',
    weight: 1.0,
    objective: false,
    options: [
      { label: 'עדיין לא יודע לשחק כדור מהקיר', score: 1 },
      { label: 'מחזיר כדור פשוט מהקיר האחורי', score: 3 },
      { label: 'שולט בהחזרות מהקיר האחורי', score: 4 },
      { label: 'שולט גם בקיר כפול (צד + אחורי)', score: 6 },
      { label: 'הופך הגנה מהקיר למתקפה', score: 8 },
    ],
  },
  {
    id: 'overheads',
    emoji: '💥',
    title: 'חבטות גבוהות וסיומים',
    weight: 1.3,
    objective: false,
    options: [
      { label: 'אין לי חבטות גבוהות', score: 1 },
      { label: 'לוב בסיסי בלבד', score: 3 },
      { label: 'בנדחה (bandeja) לשמירת עמדה', score: 5 },
      { label: 'ויבורה וסמאש בשליטה', score: 6 },
      { label: 'סמאש שמוציא מהמגרש (por tres/cuatro)', score: 8 },
    ],
  },
  {
    id: 'soft_game',
    emoji: '🎈',
    title: 'המשחק הרך — לוב וצ׳יקיטה',
    weight: 1.0,
    objective: false,
    options: [
      { label: 'לא מכיר את המושגים', score: 1 },
      { label: 'לוב הגנתי בסיסי', score: 3 },
      { label: 'לוב מדויק לשינוי עמדות', score: 5 },
      { label: 'צ׳יקיטה לרגליים לשבירת עמדת רשת', score: 6 },
      { label: 'משלב לוב וצ׳יקיטה טקטית בבניית נקודה', score: 8 },
    ],
  },
  {
    id: 'pressure',
    emoji: '🧊',
    title: 'נקודה חשובה, כולם מסתכלים. מה קורה?',
    weight: 0.8,
    objective: false,
    options: [
      { label: 'מחטיא הרבה כבר תחת לחץ קל', score: 1 },
      { label: 'יציב — כל עוד אין לחץ', score: 3 },
      { label: 'לא מחטיא בקלות תחת לחץ מתון', score: 5 },
      { label: 'יציב מאוד גם בנקודות חשובות', score: 7 },
      { label: 'רגוע ומדייק גם בלחץ מקסימלי', score: 8 },
    ],
  },
  {
    id: 'tactics',
    emoji: '🧠',
    title: 'טקטיקה ובניית נקודה',
    weight: 1.5,
    objective: false,
    options: [
      { label: 'פשוט מחזיר את הכדור, בלי תוכנית', score: 1 },
      { label: 'מבין עקרונות בסיס — לעלות לרשת, לא לאבד גובה', score: 4 },
      { label: 'מבין מעברים בין הגנה להתקפה', score: 5 },
      { label: 'בונה נקודות ומכוון לחולשת היריב', score: 6 },
      { label: 'שולט בטמפו ומתכנן 2–3 חבטות קדימה', score: 8 },
    ],
  },
  {
    id: 'reading',
    emoji: '👁️',
    title: 'קריאת משחק ואנטיציפציה',
    weight: 1.3,
    objective: false,
    options: [
      { label: 'מגיב מאוחר, רץ אחרי הכדור', score: 1 },
      { label: 'מתחיל לזהות לאן הכדור הולך', score: 3 },
      { label: 'צופה חבטות פשוטות מראש', score: 5 },
      { label: 'קורא את היריב ומתמקם מראש', score: 6 },
      { label: 'חוזה את מהלך המשחק ושולט בו', score: 8 },
    ],
  },
  {
    id: 'competitive',
    emoji: '🏆',
    title: 'ניסיון תחרותי',
    weight: 1.2,
    objective: true,
    options: [
      { label: 'משחק רק חברתי, בשביל הכיף', score: 2 },
      { label: 'שיחקתי כמה משחקים תחרותיים', score: 4 },
      { label: 'מתחרה בליגות או טורנירים מקומיים', score: 6 },
      { label: 'מתחרה ומשיג תוצאות טובות', score: 7 },
      { label: 'מהטופ בארץ', score: 8 },
    ],
  },
  {
    id: 'partner',
    emoji: '🤝',
    title: 'משחק זוגי — אתה והשותף',
    weight: 1.0,
    objective: false,
    options: [
      { label: 'משחק את המשחק שלי, כל אחד בצד שלו', score: 1 },
      { label: 'מנסה לא להפריע לשותף', score: 3 },
      { label: 'מתקשר — קורא "שלי / שלך" ומכסה', score: 5 },
      { label: 'זזים יחד כיחידה ומכסים את המרכז', score: 6 },
      { label: 'מנהל את הזוגיות — מכוון, מעודד, בונה יחד', score: 8 },
    ],
  },
  {
    id: 'serve',
    emoji: '🎯',
    title: 'הגשה והחזרת הגשה',
    weight: 0.9,
    objective: true,
    options: [
      { label: 'מכניס את הכדור פנימה, זה ההישג', score: 1 },
      { label: 'הגשה יציבה, החזרה בסיסית', score: 3 },
      { label: 'מגוון כיוונים בהגשה, החזרה בטוחה', score: 4 },
      { label: 'הגשה מדויקת לזכוכית + החזרה מתוכננת', score: 6 },
      { label: 'ההגשה שלי פותחת את הנקודה לטובתנו', score: 8 },
    ],
  },
];

// Score (0–8) → Israeli level bands, per Rally_Level_Assessment.md §3.
const LEVEL_BANDS = [
  { max: 0.5, level: 'מתחיל', ratingMin: 1080, ratingMax: 1180 },
  { max: 1.5, level: 'D2', ratingMin: 1180, ratingMax: 1280 },
  { max: 2.5, level: 'D1', ratingMin: 1280, ratingMax: 1380 },
  { max: 3.5, level: 'C2', ratingMin: 1380, ratingMax: 1480 },
  { max: 4.5, level: 'C1', ratingMin: 1480, ratingMax: 1600 },
  { max: 5.5, level: 'B2', ratingMin: 1600, ratingMax: 1750 },
  { max: 6.5, level: 'B1', ratingMin: 1750, ratingMax: 1900 },
  { max: 7.5, level: 'A2', ratingMin: 1900, ratingMax: 2050 },
  { max: 8.01, level: 'A1', ratingMin: 2050, ratingMax: 2200 },
];

export const LEVEL_DESCRIPTIONS = {
  מתחיל: 'כולם התחילו פה. עכשיו רק נשאר להתאהב במשחק',
  D2: 'הראלי מתחיל לזרום — עוד כמה משחקים וזה נפתח',
  D1: 'בסיס יציב מהקו האחורי. הקיר והוולי בדרך',
  C2: 'יציב בקצב סביר — הזמן להוסיף את משחק הרשת',
  C1: 'שליטה בסיסית טובה בכל החבטות. שחקן אמיתי',
  B2: 'טכניקה טובה, לא נשבר תחת לחץ. רמת הליבה של הקהילה',
  B1: 'טכניקה גבוהה והבנה טקטית עמוקה. שחקן תחרותי',
  A2: 'שליטה גבוהה בכל החבטות, חוזה את המשחק. רמת עילית',
  A1: 'הטופ של הטופ. ברוך הבא לצמרת',
};

// Skill-group breakdown for the result screen.
const BREAKDOWN_GROUPS = [
  { key: 'attack', label: 'התקפה', ids: ['volley', 'overheads', 'serve'] },
  { key: 'defense', label: 'הגנה ושליטה', ids: ['rally_pace', 'glass', 'soft_game'] },
  { key: 'brain', label: 'ראש המשחק', ids: ['tactics', 'reading', 'pressure', 'partner'] },
];

// answers: { [questionId]: optionIndex }
export function scoreQuiz(answers) {
  let weighted = 0;
  let totalWeight = 0;
  const perQuestion = {};

  for (const q of QUIZ_QUESTIONS) {
    const idx = answers[q.id];
    const score = q.options[idx]?.score ?? 0;
    perQuestion[q.id] = score;
    weighted += score * q.weight;
    totalWeight += q.weight;
  }

  const finalScore = weighted / totalWeight; // 0–8
  const band = LEVEL_BANDS.find(b => finalScore < b.max) || LEVEL_BANDS[LEVEL_BANDS.length - 1];

  // Interpolate a starting rating inside the band.
  const bandIdx = LEVEL_BANDS.indexOf(band);
  const bandFloor = bandIdx === 0 ? 0 : LEVEL_BANDS[bandIdx - 1].max;
  const t = Math.min(1, Math.max(0, (finalScore - bandFloor) / (band.max - bandFloor)));
  const rating = Math.round(band.ratingMin + t * (band.ratingMax - band.ratingMin));

  // Anti-gaming consistency check (Rally_Level_Assessment.md §3):
  // self-claimed skill far above objective anchors (experience, competitive
  // record, serve) → lower starting confidence; ELO recalibrates in 3 games.
  const objective = QUIZ_QUESTIONS.filter(q => q.objective);
  const subjective = QUIZ_QUESTIONS.filter(q => !q.objective);
  const avg = qs => qs.reduce((s, q) => s + perQuestion[q.id], 0) / qs.length;
  const gap = avg(subjective) - avg(objective);
  const consistent = gap <= 2.5;

  const breakdown = BREAKDOWN_GROUPS.map(g => ({
    key: g.key,
    label: g.label,
    value: Math.round((g.ids.reduce((s, id) => s + perQuestion[id], 0) / g.ids.length / 8) * 100),
  }));

  return {
    score: Math.round(finalScore * 10) / 10,
    level: band.level,
    rating,
    consistent,
    breakdown,
    description: LEVEL_DESCRIPTIONS[band.level],
  };
}
