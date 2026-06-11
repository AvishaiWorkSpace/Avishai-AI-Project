// ============================================================================
// Rally Rating Engine
// ----------------------------------------------------------------------------
// Two parts:
//   1) Glicko-2 — produces the rating number (skill estimate) and RD (raw
//      uncertainty), the same family of math FIDE/chess & Playtomic-style
//      systems use.
//   2) Diversity-weighted reliability — Rally's twist. Confidence in a rating
//      should depend on how many DIFFERENT opponents you've faced, not just how
//      many games you've played. 40 games vs 3 people tells us less than
//      20 games vs 16 people.
// ============================================================================

// ---------- Level mapping (Israeli A1 … מתחיל) ----------
// Internal skill scale is Glicko-style (~1100–2100). These thresholds map it to
// the unified Rally level language used across the app.
// `num` is the same band expressed on the global 0–7 scale (Playtomic-style),
// for players who prefer numbers over letters — Israeli A1 ≈ 6.5 Playtomic.
export const LEVELS = [
  { code: 'A1', min: 2000, label: 'A1', tier: 'עילית', num: '6.5' },
  { code: 'A2', min: 1900, label: 'A2', tier: 'מתקדם+', num: '5.5' },
  { code: 'B1', min: 1780, label: 'B1', tier: 'מתקדם', num: '4.8' },
  { code: 'B2', min: 1660, label: 'B2', tier: 'בינוני+', num: '4.0' },
  { code: 'C1', min: 1540, label: 'C1', tier: 'בינוני', num: '3.2' },
  { code: 'C2', min: 1420, label: 'C2', tier: 'בסיסי+', num: '2.5' },
  { code: 'D1', min: 1300, label: 'D1', tier: 'בסיסי', num: '1.8' },
  { code: 'D2', min: 1150, label: 'D2', tier: 'מתחיל+', num: '1.0' },
  { code: 'מתחיל', min: 0, label: 'מתחיל', tier: 'מתחיל', num: '0.5' },
];

export function ratingToLevel(rating) {
  return LEVELS.find((l) => rating >= l.min) || LEVELS[LEVELS.length - 1];
}

// ---------- Level display language (letters vs numbers) ----------
// One unified scale, two ways to read it: Israeli letters (A1…מתחיל) or the
// global 0–7 numeric scale. The user picks once; every LevelTag in the app
// follows via the 'rally:level-lang' event.
const LEVEL_LANG_KEY = 'rally_level_lang';

export function getLevelLang() {
  try { return localStorage.getItem(LEVEL_LANG_KEY) === 'numbers' ? 'numbers' : 'letters'; } catch { return 'letters'; }
}

export function setLevelLang(lang) {
  try { localStorage.setItem(LEVEL_LANG_KEY, lang); } catch { /* keep in-memory default */ }
  window.dispatchEvent(new Event('rally:level-lang'));
}

// Display string for a level code in the chosen language.
export function levelDisplay(code, lang = getLevelLang()) {
  const lvl = LEVELS.find((l) => l.code === code);
  if (!lvl) return code;
  return lang === 'numbers' ? lvl.num : lvl.label;
}

// Precise 0–7 value for a specific rating (own profile shows this; tags of
// other players show their band's `num`). 1150→0.0, 2200→7.0.
export function ratingToNum(rating) {
  const v = Math.min(7, Math.max(0, (rating - 1150) / 150));
  return (Math.round(v * 10) / 10).toFixed(1);
}

export function levelRange(code) {
  const i = LEVELS.findIndex((l) => l.code === code);
  if (i === -1) return null;
  const min = LEVELS[i].min;
  const max = i === 0 ? 2200 : LEVELS[i - 1].min - 1;
  return { min, max };
}

// Progress (0..1) of a rating within its current level band — for progress bars.
export function levelProgress(rating) {
  const lvl = ratingToLevel(rating);
  const range = levelRange(lvl.code);
  if (!range) return 0;
  const span = Math.max(1, range.max - range.min);
  return Math.min(1, Math.max(0, (rating - range.min) / span));
}

// ============================================================================
// Glicko-2
// ============================================================================
const SCALE = 173.7178; // Glicko-2 scaling constant
const TAU = 0.5; // system volatility constraint
const DEFAULT = { rating: 1500, rd: 350, vol: 0.06 };

const g = (phi) => 1 / Math.sqrt(1 + (3 * phi * phi) / (Math.PI * Math.PI));
const E = (mu, muJ, phiJ) => 1 / (1 + Math.exp(-g(phiJ) * (mu - muJ)));

// Update one player over a rating period.
// player:  { rating, rd, vol }
// results: [{ rating, rd, score }]  score: 1 win / 0.5 draw / 0 loss
export function glicko2Update(player = DEFAULT, results = []) {
  const mu = (player.rating - 1500) / SCALE;
  const phi = player.rd / SCALE;
  const sigma = player.vol ?? DEFAULT.vol;

  if (!results.length) {
    // no games: RD grows toward the default by volatility
    const phiStar = Math.sqrt(phi * phi + sigma * sigma);
    return {
      rating: player.rating,
      rd: Math.min(DEFAULT.rd, phiStar * SCALE),
      vol: sigma,
    };
  }

  let vInv = 0;
  let delSum = 0;
  for (const r of results) {
    const muJ = (r.rating - 1500) / SCALE;
    const phiJ = r.rd / SCALE;
    const gj = g(phiJ);
    const ej = E(mu, muJ, phiJ);
    vInv += gj * gj * ej * (1 - ej);
    delSum += gj * (r.score - ej);
  }
  const v = 1 / vInv;
  const delta = v * delSum;

  // ---- volatility (Illinois / regula falsi) ----
  const a = Math.log(sigma * sigma);
  const f = (x) => {
    const ex = Math.exp(x);
    const num = ex * (delta * delta - phi * phi - v - ex);
    const den = 2 * Math.pow(phi * phi + v + ex, 2);
    return num / den - (x - a) / (TAU * TAU);
  };
  let A = a;
  let B;
  if (delta * delta > phi * phi + v) {
    B = Math.log(delta * delta - phi * phi - v);
  } else {
    let k = 1;
    while (f(a - k * TAU) < 0) k += 1;
    B = a - k * TAU;
  }
  let fA = f(A);
  let fB = f(B);
  for (let i = 0; i < 100 && Math.abs(B - A) > 1e-6; i++) {
    const C = A + ((A - B) * fA) / (fB - fA);
    const fC = f(C);
    if (fC * fB <= 0) {
      A = B;
      fA = fB;
    } else {
      fA /= 2;
    }
    B = C;
    fB = fC;
  }
  const sigmaNew = Math.exp(A / 2);

  // ---- new RD & rating ----
  const phiStar = Math.sqrt(phi * phi + sigmaNew * sigmaNew);
  const phiNew = 1 / Math.sqrt(1 / (phiStar * phiStar) + 1 / v);
  const muNew = mu + phiNew * phiNew * delSum;

  return {
    rating: Math.round(muNew * SCALE + 1500),
    rd: Math.round(phiNew * SCALE),
    vol: Number(sigmaNew.toFixed(6)),
  };
}

// ============================================================================
// Diversity-weighted reliability
// ============================================================================
//
// opponentCounts: array of games-played-against each distinct opponent, e.g.
//   [4, 3, 3, 2, 2, 1]  → 6 opponents, 15 games.
//
// D₁ (effective distinct opponents) uses the inverse Simpson index (Hill q=2):
//        D₁ = 1 / Σ pᵢ²        where pᵢ = nᵢ / S
//   - Face many different people evenly → D₁ approaches the unique count.
//   - Grind the same 2–3 people → D₁ stays near 2–3 no matter how many games.
//
// The documented effective sample size N_eff = G_eff × (D₁ / S). With effective
// games G_eff = S this reduces cleanly to N_eff = D₁ — i.e. confidence is driven
// by how many genuinely different opponents have tested you.
//
// Reliability % = N_eff / (N_eff + K),  K = 1.25 (half-confidence point).
const K_RELIABILITY = 1.25;

export function reliability(opponentCounts = []) {
  const counts = opponentCounts.filter((n) => n > 0);
  const S = counts.reduce((a, b) => a + b, 0);
  const k = counts.length;

  if (S === 0) {
    return { games: 0, opponents: 0, dEff: 0, nEff: 0, pct: 0, provisional: true };
  }

  const sumSq = counts.reduce((acc, n) => acc + (n / S) * (n / S), 0);
  const dEff = 1 / sumSq; // inverse Simpson
  const nEff = dEff; // G_eff = S ⇒ N_eff = D₁
  const pct = Math.round((100 * nEff) / (nEff + K_RELIABILITY));

  return {
    games: S,
    opponents: k,
    dEff: Number(dEff.toFixed(2)),
    nEff: Number(nEff.toFixed(2)),
    pct,
    provisional: S < 5,
  };
}

// Convert reliability % to a human label.
export function reliabilityLabel(pct) {
  if (pct >= 90) return { text: 'מבוסס מאוד', tone: 'high' };
  if (pct >= 75) return { text: 'מבוסס', tone: 'good' };
  if (pct >= 55) return { text: 'בהתגבשות', tone: 'mid' };
  return { text: 'ראשוני', tone: 'low' };
}

// ============================================================================
// Match result → rating loop
// ============================================================================

// Classify how one-sided a match was from its set scores.
// sets: [{ us, them }] in games, e.g. [{us:6,them:4},{us:7,them:6}]
// The margin drives which peer-question bank raters get — a tight match asks
// about clutch points, a blowout asks what created the gap.
export function classifyMargin(sets) {
  const played = sets.filter(s => s.us + s.them > 0);
  if (!played.length) return null;

  const usGames = played.reduce((n, s) => n + s.us, 0);
  const themGames = played.reduce((n, s) => n + s.them, 0);
  const usSets = played.filter(s => s.us > s.them).length;
  const themSets = played.length - usSets;
  const won = usSets > themSets;
  const diff = Math.abs(usGames - themGames);
  const hadTiebreak = played.some(s => Math.min(s.us, s.them) >= 6);

  let type = 'normal';
  if (hadTiebreak || diff <= 2) type = 'close';
  else if (diff >= 6) type = 'blowout';

  const label =
    type === 'close' ? 'משחק צמוד' :
    type === 'blowout' ? (won ? 'ניצחון מוחץ' : 'הפסד כבד') :
    won ? 'ניצחון' : 'הפסד';

  return { type, won, label, usGames, themGames, usSets, themSets, diff };
}

// Apply one match result to the current user's rating profile.
// opponents: [{ rally_rating, rd? }] — the two players across the net.
// Returns { before, after, delta, level } and persists nothing (caller decides).
export function applyMatchResult(profile, opponents, won) {
  const before = {
    rating: profile.rating ?? DEFAULT.rating,
    rd: profile.rd ?? 120,
    vol: profile.vol ?? DEFAULT.vol,
  };
  const results = opponents.map(o => ({
    rating: o.rally_rating ?? o.rating ?? 1500,
    rd: o.rd ?? 100,
    score: won ? 1 : 0,
  }));
  const after = glicko2Update(before, results);
  return {
    before: before.rating,
    after: after.rating,
    delta: after.rating - before.rating,
    rd: after.rd,
    vol: after.vol,
    level: ratingToLevel(after.rating),
  };
}

// ---- localStorage persistence for the demo (until the real backend) ----
const HISTORY_KEY = 'rally_rating_history';

export function loadRatingProfile(fallback) {
  try {
    const user = JSON.parse(localStorage.getItem('rally_user') || '{}');
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || 'null');
    return {
      rating: user.rally_rating ?? fallback.rating,
      rd: user.rally_rd ?? fallback.rd,
      vol: user.rally_vol ?? fallback.vol,
      history: history ?? fallback.history,
    };
  } catch {
    return fallback;
  }
}

export function saveRatingResult(result) {
  try {
    const user = JSON.parse(localStorage.getItem('rally_user') || '{}');
    user.rally_rating = result.after;
    user.rally_rd = result.rd;
    user.rally_vol = result.vol;
    user.level = result.level.code;
    localStorage.setItem('rally_user', JSON.stringify(user));

    const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    history.push({ rating: result.after, at: Date.now() });
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch { /* demo mode: never block the flow on storage */ }
}

// Worked reference examples used in the explanation screen.
export const RELIABILITY_EXAMPLES = [
  // 20 games vs 18 different opponents → very reliable
  { name: 'שחקן א׳', tag: 'מגוון', opponentCounts: [2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] },
  // 40 games vs only 3 opponents → less reliable despite more games
  { name: 'שחקן ב׳', tag: 'מצומצם', opponentCounts: [14, 13, 13] },
];
