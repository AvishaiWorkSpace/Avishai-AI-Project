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
export const LEVELS = [
  { code: 'A1', min: 2000, label: 'A1', tier: 'עילית' },
  { code: 'A2', min: 1900, label: 'A2', tier: 'מתקדם+' },
  { code: 'B1', min: 1780, label: 'B1', tier: 'מתקדם' },
  { code: 'B2', min: 1660, label: 'B2', tier: 'בינוני+' },
  { code: 'C1', min: 1540, label: 'C1', tier: 'בינוני' },
  { code: 'C2', min: 1420, label: 'C2', tier: 'בסיסי+' },
  { code: 'D1', min: 1300, label: 'D1', tier: 'בסיסי' },
  { code: 'D2', min: 1150, label: 'D2', tier: 'מתחיל+' },
  { code: 'מתחיל', min: 0, label: 'מתחיל', tier: 'מתחיל' },
];

export function ratingToLevel(rating) {
  return LEVELS.find((l) => rating >= l.min) || LEVELS[LEVELS.length - 1];
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

// Worked reference examples used in the explanation screen.
export const RELIABILITY_EXAMPLES = [
  // 20 games vs 18 different opponents → very reliable
  { name: 'שחקן א׳', tag: 'מגוון', opponentCounts: [2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] },
  // 40 games vs only 3 opponents → less reliable despite more games
  { name: 'שחקן ב׳', tag: 'מצומצם', opponentCounts: [14, 13, 13] },
];
