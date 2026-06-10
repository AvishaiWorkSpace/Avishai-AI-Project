// Rally post-match peer rating.
//
// The contract (product spec from Avishai):
//   - Bank of 12 questions, each mapped to a skill axis.
//   - In a 4-player match every player rates the 3 others.
//   - For a given rated player, the 3 raters MUST each get a different
//     question — so one match yields 3 distinct signals about each player.
//   - Each rater answers 1 question per rated player + 1 fair-play question
//     = 4 taps total. Over ~4 matches the full bank is covered per player.
//   - Answers aggregate per axis; the delta between rating windows powers the
//     "where did I improve" schema and, long-term, true level discovery.

export const PEER_AXES = {
  attack: { label: 'התקפה', emoji: '💥' },
  defense: { label: 'הגנה ושליטה', emoji: '🧱' },
  brain: { label: 'ראש המשחק', emoji: '🧠' },
  spirit: { label: 'רוח המשחק', emoji: '🤝' },
};

// Each question: 5-point scale, phrased about the OTHER player.
// Scale labels run weak → strong; value = (choice index + 1) * 20 → 0–100.
export const PEER_QUESTIONS = [
  { id: 'pq1', axis: 'attack', emoji: '🥅', text: 'איך היה משחק הרשת שלו?', low: 'נמנע מהרשת', high: 'שלט ברשת וסיים נקודות' },
  { id: 'pq2', axis: 'attack', emoji: '💥', text: 'איך היו החבטות הגבוהות שלו (בנדחה/סמאש)?', low: 'כמעט ולא ניסה', high: 'נשק מסוכן' },
  { id: 'pq3', axis: 'attack', emoji: '🎯', text: 'כמה ההגשות שלו פתחו נקודות לטובתכם?', low: 'רק הכניס פנימה', high: 'יתרון מיידי' },
  { id: 'pq4', axis: 'defense', emoji: '🧱', text: 'איך הוא הסתדר עם כדורים מהזכוכית?', low: 'התקשה מאוד', high: 'הפך הגנה להתקפה' },
  { id: 'pq5', axis: 'defense', emoji: '🔄', text: 'כמה יציב הוא היה בראלי ארוך?', low: 'החטיא מהר', high: 'סלע — לא נשבר' },
  { id: 'pq6', axis: 'defense', emoji: '🎈', text: 'איך היה המשחק הרך שלו (לוב/צ׳יקיטה)?', low: 'לא קיים', high: 'מדויק וטקטי' },
  { id: 'pq7', axis: 'brain', emoji: '🧠', text: 'כמה חכם הוא שיחק — בחירת חבטות והחלטות?', low: 'החזיר בלי תוכנית', high: 'חשב 2-3 חבטות קדימה' },
  { id: 'pq8', axis: 'brain', emoji: '👁️', text: 'איך הייתה קריאת המשחק שלו — מיקום וצפי?', low: 'רץ אחרי הכדור', high: 'תמיד במקום הנכון' },
  { id: 'pq9', axis: 'brain', emoji: '🧊', text: 'איך הוא תפקד בנקודות לחץ?', low: 'קרס תחת לחץ', high: 'קר רוח, הרים את הרמה' },
  { id: 'pq10', axis: 'spirit', emoji: '🤝', text: 'איך הייתה התקשורת שלו עם השותף?', low: 'שיחק לבד', high: 'שותף מושלם' },
  { id: 'pq11', axis: 'spirit', emoji: '⚖️', text: 'כמה הוגן הוא היה בקריאות קו וספירה?', low: 'היו ויכוחים', high: 'הוגן לחלוטין' },
  { id: 'pq12', axis: 'spirit', emoji: '🔋', text: 'כמה אנרגיה ורוח טובה הוא הביא למגרש?', low: 'כבה את האווירה', high: 'הדליק את המגרש' },
];

// The quick shared question every rater answers once at the end.
export const FAIRPLAY_QUESTION = {
  id: 'fairplay',
  emoji: '✨',
  text: 'הייתם משחקים איתם שוב?',
};

// ---------------------------------------------------------------------------
// Question assignment — the no-overlap guarantee.
//
// Players are sorted by id so every client computes the same assignment with
// no coordination. For rated player at index j, the 3 raters get consecutive
// bank slots offset by their rater-position k (0..2):
//
//   questionIndex = (seed + j*3 + k) % 12
//
// Fixed j, distinct k → distinct questions for the same rated player.
// j*3 staggers coverage so one match touches 9+ distinct bank questions, and
// the per-match seed rotates the bank between matches so all 12 questions
// accumulate per player over ~4 matches.
// ---------------------------------------------------------------------------
function matchSeed(matchId) {
  let h = 0;
  for (const ch of String(matchId)) h = (h * 31 + ch.charCodeAt(0)) | 0;
  return Math.abs(h);
}

// Returns, for one rater: [{ ratee, question }] — one entry per other player.
export function assignQuestions(matchId, playerIds, raterId) {
  const sorted = [...playerIds].sort();
  const seed = matchSeed(matchId);

  return sorted
    .filter(id => id !== raterId)
    .map(rateeId => {
      const j = sorted.indexOf(rateeId);
      // rater position among this ratee's raters (stable, excludes the ratee)
      const raters = sorted.filter(id => id !== rateeId);
      const k = raters.indexOf(raterId);
      const qIdx = (seed + j * 3 + k) % PEER_QUESTIONS.length;
      return { rateeId, question: PEER_QUESTIONS[qIdx] };
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
  return Object.keys(PEER_AXES)
    .filter(axis => previous[axis] != null && current[axis] != null)
    .map(axis => ({
      axis,
      ...PEER_AXES[axis],
      previous: previous[axis],
      current: current[axis],
      delta: current[axis] - previous[axis],
    }));
}
