// Rally post-match peer rating — v2, context-aware.
//
// The contract (product spec from Avishai, 2026-06-10):
//   - Questions adapt to HOW the match ended: a tight match asks what decided
//     the big points; a blowout asks what created the gap. Generic questions
//     waste the rater's attention.
//   - Answers are concrete observations a player can act on — not emoji scales.
//     Every option is something you could say to their coach.
//   - 6 skill axes feed the radar; spirit feeds the trust layer separately.
//   - In a 4-player match every player rates the 3 others; the 3 raters of the
//     same player get different questions (no-overlap), so one match yields
//     3 distinct signals per player.
//
// Each question: { id, axis, emoji, text, options } where options are 4 graded
// concrete statements, weak → strong, value 25/50/75/95 (0–100 scale).

export const SKILL_AXES = {
  net: { label: 'משחק רשת', emoji: '🥅' },
  smash: { label: 'סיום וסמאש', emoji: '💥' },
  wall: { label: 'קיר והגנה', emoji: '🧱' },
  tactics: { label: 'טקטיקה והחלטות', emoji: '🧠' },
  positioning: { label: 'מיקום וקריאה', emoji: '👁️' },
  consistency: { label: 'יציבות', emoji: '🔄' },
};

export const SPIRIT_AXIS = { label: 'רוח המשחק', emoji: '🤝' };

// Back-compat: screens that iterate radar axes.
export const PEER_AXES = SKILL_AXES;

const OPT = (l0, l1, l2, l3) => [
  { label: l0, value: 25 },
  { label: l1, value: 50 },
  { label: l2, value: 75 },
  { label: l3, value: 95 },
];

// ---------------------------------------------------------------------------
// Bank: CLOSE match — what decided the big points?
// ---------------------------------------------------------------------------
const CLOSE_BANK = [
  {
    id: 'cq_net', axis: 'net', emoji: '🥅',
    text: 'בנקודות הגדולות — איך הוא תפקד ליד הרשת?',
    options: OPT(
      'נסוג אחורה וויתר על הרשת ברגעים החשובים',
      'החזיק עמדה ברשת אבל לא הצליח לסיים',
      'לחץ ברשת וזכה ברוב החילופים הצמודים',
      'סגר נקודות קריטיות בוולה בטוחה — ההבדל במשחק',
    ),
  },
  {
    id: 'cq_smash', axis: 'smash', emoji: '💥',
    text: 'כשהייתה לו הזדמנות לסגור נקודה גדולה — מה קרה?',
    options: OPT(
      'היסס וויתר על סיומים גם כשהכדור היה שלו',
      'ניסה לסיים אבל הסמאשים חזרו אליו',
      'סיים את רוב ההזדמנויות שקיבל',
      'כל כדור גבוה הפך לנקודה — סיום קר ומדויק',
    ),
  },
  {
    id: 'cq_wall', axis: 'wall', emoji: '🧱',
    text: 'כשלחצתם עליו בנקודות צמודות — איך הוא הגן?',
    options: OPT(
      'הכדורים מהזכוכית שברו אותו ברגעים החשובים',
      'החזיר מהקיר אבל בכדורים נוחים ליריב',
      'הגן יציב גם תחת לחץ והחזיר אתכם לנקודה',
      'הפך הגנות מהקיר להתקפות — הציל נקודות אבודות',
    ),
  },
  {
    id: 'cq_tactics', axis: 'tactics', emoji: '🧠',
    text: 'ב-40-40 ובסופי סטים — איך הוא בחר חבטות?',
    options: OPT(
      'נלחץ ובחר חבטות מסוכנות בזמן הלא נכון',
      'שיחק בטוח מדי — נתן ליריב לשלוט בנקודה',
      'בחר נכון ברוב הנקודות הגדולות',
      'קור רוח של שחקן גדול — כל החלטה בלחץ הייתה נכונה',
    ),
  },
  {
    id: 'cq_positioning', axis: 'positioning', emoji: '👁️',
    text: 'בראלים הארוכים והצמודים — איפה הוא היה על המגרש?',
    options: OPT(
      'נתפס לא במקום שוב ושוב — חורים שעלו בנקודות',
      'כיסה את הצד שלו אבל איחר במעברים',
      'קרא את המשחק וזז נכון כמעט תמיד',
      'תמיד במקום הנכון רגע לפני — קריאת משחק מעולה',
    ),
  },
  {
    id: 'cq_consistency', axis: 'consistency', emoji: '🔄',
    text: 'לאורך המשחק הצמוד — כמה טעויות קלות יצאו ממנו?',
    options: OPT(
      'טעויות קלות ברגעים הקריטיים — שם הלכו הנקודות',
      'התחיל יציב אבל נשבר בסוף הסטים',
      'מעט מאוד טעויות — נתן לכם בסיס לסמוך עליו',
      'סלע. אפס מתנות גם בנקודות הכי לחוצות',
    ),
  },
];

// ---------------------------------------------------------------------------
// Bank: BLOWOUT — what created the gap?
// ---------------------------------------------------------------------------
const BLOWOUT_BANK = [
  {
    id: 'bq_net', axis: 'net', emoji: '🥅',
    text: 'משחק הרשת שלו — כמה הוא תרם לפער (לטוב או לרע)?',
    options: OPT(
      'הרשת הייתה נקודת תורפה — שם נפתח הפער',
      'נוכחות רשת בסיסית, לא איום אמיתי',
      'שלט ברשת רוב הזמן ולחץ את היריב',
      'הרשת הייתה שלו — משם נבנה כל הפער',
    ),
  },
  {
    id: 'bq_smash', axis: 'smash', emoji: '💥',
    text: 'החבטות הגבוהות שלו (סמאש/בנדחה) — איזה כוח הן היו?',
    options: OPT(
      'כדורים גבוהים חזרו חלשים — היריב חיכה להם',
      'סיים מדי פעם אבל בלי עקביות',
      'נשק אמיתי — היריב פחד להרים לו',
      'כל הרמה = נקודה. הפער נפתח באוויר',
    ),
  },
  {
    id: 'bq_wall', axis: 'wall', emoji: '🧱',
    text: 'ההגנה שלו מהקיר — כמה היא החזיקה את המשחק?',
    options: OPT(
      'הזכוכית הביסה אותו — נקודות קצרות נגדו',
      'החזיר מהקיר אבל בלי לאיים',
      'הגנה אמינה שהאריכה ראלים',
      'בלתי עביר מאחור — שבר את היריב מנטלית',
    ),
  },
  {
    id: 'bq_tactics', axis: 'tactics', emoji: '🧠',
    text: 'התוכנית שלו במשחק — הייתה כזו?',
    options: OPT(
      'אותה טעות שוב ושוב בלי להתאים את המשחק',
      'החזיר כדורים בלי כיוון ברור',
      'זיהה את החולשה של היריב ותקף אותה',
      'ניהל את המשחק כמו שחמט — היריב לא מצא תשובה',
    ),
  },
  {
    id: 'bq_positioning', axis: 'positioning', emoji: '👁️',
    text: 'הכיסוי והתנועה שלו — איך הם נראו לאורך המשחק?',
    options: OPT(
      'חורים קבועים במגרש — היריב כיוון לשם כל פעם',
      'כיסה את הצד שלו, לא יותר',
      'תנועה חכמה שסגרה את רוב הזוויות',
      'הזוג זז כיחידה בזכותו — לא היה לאן לשחק',
    ),
  },
  {
    id: 'bq_consistency', axis: 'consistency', emoji: '🔄',
    text: 'כמה מהנקודות במשחק הוא נתן/חסך בטעויות קלות?',
    options: OPT(
      'הרבה מתנות — חלק גדול מהפער היה טעויות שלו',
      'גלים — סדרות טובות ואז רצף החטאות',
      'יציב לאורך כל הדרך, כמעט בלי מתנות',
      'מכונה — היריב היה חייב להרוויח כל נקודה',
    ),
  },
];

// ---------------------------------------------------------------------------
// Bank: NORMAL — balanced read on each axis.
// ---------------------------------------------------------------------------
const NORMAL_BANK = [
  {
    id: 'nq_net', axis: 'net', emoji: '🥅',
    text: 'איך נראה משחק הרשת שלו היום?',
    options: OPT(
      'נמנע מהרשת — נשאר מאחור גם כשהיה צריך לעלות',
      'עלה לרשת אבל התקשה לסיים משם',
      'נוכחות רשת טובה — וולים בטוחים ולחץ קבוע',
      'שלט ברשת מהנקודה הראשונה — וולים חדים שסיימו ראלים',
    ),
  },
  {
    id: 'nq_smash', axis: 'smash', emoji: '💥',
    text: 'איך היו הסיומים שלו — סמאש, בנדחה, ויבורה?',
    options: OPT(
      'כמעט לא ניסה לסיים — שמר את הכדור במשחק',
      'ניסה לסיים אבל בלי שליטה — חלק יצאו החוצה',
      'סיומים טובים כשקיבל כדור נוח',
      'מסוכן מכל מקום — סיים גם כדורים קשים',
    ),
  },
  {
    id: 'nq_wall', axis: 'wall', emoji: '🧱',
    text: 'איך הוא הסתדר עם הזכוכית והקירות?',
    options: OPT(
      'הקיר הפתיע אותו שוב ושוב',
      'החזיר מהקיר את הכדורים הנוחים',
      'קרא את הזכוכית טוב והגן יציב',
      'השתמש בקירות כמו מקצוען — גם בהגנה וגם בהתקפה',
    ),
  },
  {
    id: 'nq_tactics', axis: 'tactics', emoji: '🧠',
    text: 'כמה חכם הוא שיחק — בחירות, קצב, סבלנות?',
    options: OPT(
      'מיהר לסיים נקודות בלי סבלנות — טעויות מיותרות',
      'שיחק לפי אינסטינקט, בלי תוכנית ברורה',
      'בחר חבטות נכון ושינה קצב בזמן',
      'ראה את המגרש 2-3 חבטות קדימה — שחקן חושב',
    ),
  },
  {
    id: 'nq_positioning', axis: 'positioning', emoji: '👁️',
    text: 'איך היו המיקום והתנועה שלו על המגרש?',
    options: OPT(
      'הרבה פעמים לא במקום — רץ אחרי הכדור',
      'מיקום סביר אבל איטי לחזור לעמדה',
      'זז נכון ושמר על המבנה עם השותף',
      'תמיד צעד אחד לפני הכדור — מיקום אינסטינקטיבי',
    ),
  },
  {
    id: 'nq_consistency', axis: 'consistency', emoji: '🔄',
    text: 'כמה יציב הוא היה לאורך המשחק?',
    options: OPT(
      'הרבה טעויות קלות — קשה לבנות איתו נקודות',
      'עליות וירידות — תלוי בביטחון של הרגע',
      'יציב ואמין ברוב המוחלט של הראלים',
      'רמה קבועה מהכדור הראשון לאחרון — בלי נפילות',
    ),
  },
];

const BANKS = { close: CLOSE_BANK, blowout: BLOWOUT_BANK, normal: NORMAL_BANK };

// ---------------------------------------------------------------------------
// Match-level diagnostic — asked once per rater, about the match itself.
// The answer is a team-level insight ("what actually decided this match").
// ---------------------------------------------------------------------------
export const MATCH_DIAGNOSTICS = {
  close: {
    id: 'diag_close', emoji: '⚖️',
    text: 'משחק צמוד עד הסוף — מה בעצם הכריע אותו?',
    options: [
      { id: 'big_points', label: 'הנקודות הגדולות — מי שניצח אותן לקח את המשחק' },
      { id: 'nerves', label: 'עצבים — צד אחד שמר על קור רוח בסופי הסטים' },
      { id: 'errors', label: 'טעויות קלות ברגעים הלא נכונים' },
      { id: 'chemistry', label: 'זוגיות — צד אחד תקשר וזז טוב יותר כיחידה' },
    ],
  },
  blowout_win: {
    id: 'diag_bw', emoji: '🚀',
    text: 'ניצחון גדול — מה יצר את הפער לטובתכם?',
    options: [
      { id: 'weapon', label: 'נשק דומיננטי — רשת או סמאש שאי אפשר היה לעצור' },
      { id: 'weaklink', label: 'מצאתם חולשה אצל היריב ותקפתם אותה כל הזמן' },
      { id: 'level_gap', label: 'פער רמות אמיתי — המשחק היה לא מאוזן מההתחלה' },
      { id: 'opp_collapse', label: 'היריב התפרק — טעויות שלו יותר מזכויות שלכם' },
    ],
  },
  blowout_loss: {
    id: 'diag_bl', emoji: '🎯',
    text: 'הפסד כבד — מה בעיקר יצר את הפער?',
    options: [
      { id: 'their_weapon', label: 'נשק של היריב שלא מצאתם לו תשובה' },
      { id: 'our_errors', label: 'טעויות שלנו — נתנו יותר מדי מתנות' },
      { id: 'level_gap', label: 'פער רמות — הם פשוט היו טובים יותר' },
      { id: 'no_plan', label: 'חוסר תוכנית — שיחקנו את אותו משחק שלא עבד' },
    ],
  },
  normal: {
    id: 'diag_n', emoji: '🎾',
    text: 'בגדול — מה היה הסיפור של המשחק הזה?',
    options: [
      { id: 'big_points', label: 'הנקודות החשובות הוכרעו על ידי הצד היציב יותר' },
      { id: 'weapon', label: 'נשק אחד בלט מעל כולם והכתיב את הקצב' },
      { id: 'errors', label: 'טעויות קלות עשו את ההבדל' },
      { id: 'chemistry', label: 'התקשורת והזוגיות הכריעו' },
    ],
  },
};

export function matchDiagnostic(margin) {
  if (!margin) return MATCH_DIAGNOSTICS.normal;
  if (margin.type === 'close') return MATCH_DIAGNOSTICS.close;
  if (margin.type === 'blowout') return margin.won ? MATCH_DIAGNOSTICS.blowout_win : MATCH_DIAGNOSTICS.blowout_loss;
  return MATCH_DIAGNOSTICS.normal;
}

// The quick shared question every rater answers once at the end.
export const FAIRPLAY_QUESTION = {
  id: 'fairplay',
  emoji: '✨',
  text: 'הייתם משחקים איתם שוב?',
};

// ---------------------------------------------------------------------------
// Question assignment — the no-overlap guarantee, now margin-aware.
//
// Players are sorted by id so every client computes the same assignment with
// no coordination. For rated player at index j and rater-position k (0..2):
//
//   questionIndex = (seed + j + k) % bank.length
//
// With 4 players and a 6-question bank, j+k spans 0..5 — so BOTH guarantees
// hold with no modular collisions: the 3 raters of the same player get
// distinct questions, AND one rater never asks the same question twice.
// The bank itself is chosen by the match margin, so all raters ask questions
// that match what actually happened on court.
// ---------------------------------------------------------------------------
function matchSeed(matchId) {
  let h = 0;
  for (const ch of String(matchId)) h = (h * 31 + ch.charCodeAt(0)) | 0;
  return Math.abs(h);
}

// Returns, for one rater: [{ rateeId, question }] — one entry per other player.
export function assignQuestions(matchId, playerIds, raterId, marginType = 'normal') {
  const bank = BANKS[marginType] || NORMAL_BANK;
  const sorted = [...playerIds].sort();
  const seed = matchSeed(matchId);

  return sorted
    .filter(id => id !== raterId)
    .map(rateeId => {
      const j = sorted.indexOf(rateeId);
      // rater position among this ratee's raters (stable, excludes the ratee)
      const raters = sorted.filter(id => id !== rateeId);
      const k = raters.indexOf(raterId);
      const qIdx = (seed + j + k) % bank.length;
      return { rateeId, question: bank[qIdx] };
    });
}

// ---------------------------------------------------------------------------
// Aggregation + improvement schema
// ---------------------------------------------------------------------------

// answers: [{ axis, value(0–100) }] from all raters about one player.
// Returns per-axis mean, missing axes omitted.
export function aggregateAnswers(answers) {
  const byAxis = {};
  for (const a of answers) {
    (byAxis[a.axis] = byAxis[a.axis] || []).push(a.value);
  }
  return Object.fromEntries(
    Object.entries(byAxis).map(([axis, vals]) => [
      axis,
      Math.round(vals.reduce((s, v) => s + v, 0) / vals.length),
    ]),
  );
}

// Compare two axis windows → improvement rows for the schema screen.
export function improvementSchema(previous, current) {
  return Object.keys(SKILL_AXES)
    .filter(axis => previous[axis] != null && current[axis] != null)
    .map(axis => ({
      axis,
      ...SKILL_AXES[axis],
      previous: previous[axis],
      current: current[axis],
      delta: current[axis] - previous[axis],
    }));
}
