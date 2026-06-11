// Rally — deterministic game data for the current user ("אבישי", B2, תל אביב).
// Drives MyGames (both tabs + summary strip) and CalendarPage.
//
// Two kinds of state live here:
//   1. GAMES_HISTORY  — finished, scored games (static demo content).
//   2. Joined matches — ids of open matches the user is in: a fixed base
//      (m1, m6) merged with the localStorage key `rally_my_games`, which
//      QuickMatch/MatchChat append to when the user slides to join.
import { CLUBS, PLAYERS, FINISHED_MATCH } from '@/data/mockData';

// ---------------------------------------------------------------------------
// Joined upcoming matches
// ---------------------------------------------------------------------------
const BASE_JOINED_IDS = ['m1', 'm6'];
const MY_GAMES_KEY = 'rally_my_games';

export function getJoinedMatchIds() {
  let extra = [];
  try {
    const raw = JSON.parse(localStorage.getItem(MY_GAMES_KEY) || '[]');
    if (Array.isArray(raw)) extra = raw.filter((x) => typeof x === 'string');
  } catch { /* corrupt key — ignore */ }
  return [...new Set([...BASE_JOINED_IDS, ...extra])];
}

export function addJoinedMatchId(id) {
  if (!id) return;
  try {
    const current = getJoinedMatchIds();
    if (!current.includes(id)) {
      const stored = current.filter((x) => !BASE_JOINED_IDS.includes(x));
      localStorage.setItem(MY_GAMES_KEY, JSON.stringify([...stored, id]));
    }
  } catch { /* storage blocked — demo state only */ }
}

// ---------------------------------------------------------------------------
// Finished games (history tab)
// ---------------------------------------------------------------------------
const daysAgo = (days, hour, minute = 0) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
};

// Scored, rated games — newest first. sets are [us, them].
export const GAMES_HISTORY = [
  {
    id: 'h1',
    club_name: CLUBS[1].name, club_image: CLUBS[1].image_url, city: CLUBS[1].city,
    start_time: daysAgo(1, 20, 0), duration_min: 90, level: 'B2', match_type: 'תחרותי',
    result: 'W', rating_delta: 12,
    sets: [[6, 4], [3, 6], [7, 5]],
    partner: PLAYERS[1],                  // נועה לוי
    opponents: [PLAYERS[2], PLAYERS[6]],  // יותם, עומר
  },
  {
    id: 'h2',
    club_name: CLUBS[0].name, club_image: CLUBS[0].image_url, city: CLUBS[0].city,
    start_time: daysAgo(4, 19, 30), duration_min: 60, level: 'B2', match_type: 'ידידותי',
    result: 'L', rating_delta: -8,
    sets: [[4, 6], [6, 7]],
    partner: PLAYERS[5],                  // מאיה גולן
    opponents: [PLAYERS[0], PLAYERS[4]],  // דניאל, איתי
  },
  {
    id: 'h3',
    club_name: CLUBS[2].name, club_image: CLUBS[2].image_url, city: CLUBS[2].city,
    start_time: daysAgo(8, 21, 0), duration_min: 90, level: 'B1', match_type: 'תחרותי',
    result: 'W', rating_delta: 15,
    sets: [[6, 3], [6, 4]],
    partner: PLAYERS[0],                  // דניאל כהן
    opponents: [PLAYERS[4], PLAYERS[6]],  // איתי, עומר
  },
  {
    id: 'h4',
    club_name: CLUBS[3].name, club_image: CLUBS[3].image_url, city: CLUBS[3].city,
    start_time: daysAgo(13, 18, 0), duration_min: 90, level: 'B2', match_type: 'תחרותי',
    result: 'W', rating_delta: 9,
    sets: [[7, 6], [4, 6], [6, 2]],
    partner: PLAYERS[1],                  // נועה לוי
    opponents: [PLAYERS[3], PLAYERS[5]],  // שירה, מאיה
  },
  {
    id: 'h5',
    club_name: CLUBS[4].name, club_image: CLUBS[4].image_url, city: CLUBS[4].city,
    start_time: daysAgo(21, 17, 30), duration_min: 60, level: 'B2', match_type: 'ידידותי',
    result: 'L', rating_delta: -6,
    sets: [[6, 2], [3, 6], [5, 7]],
    partner: PLAYERS[7],                  // טל בן דוד
    opponents: [PLAYERS[1], PLAYERS[2]],  // נועה, יותם
  },
];

// ---------------------------------------------------------------------------
// Derived helpers
// ---------------------------------------------------------------------------

// Summary strip: games / win% / hours over the last 30 days.
export function getHistorySummary() {
  const all = [FINISHED_MATCH, ...GAMES_HISTORY];
  const monthAgo = Date.now() - 30 * 86400000;
  const thisMonth = all.filter((g) => new Date(g.start_time).getTime() >= monthAgo);
  const wins = GAMES_HISTORY.filter((g) => g.result === 'W').length;
  return {
    gamesThisMonth: thisMonth.length,
    winPct: Math.round((wins / GAMES_HISTORY.length) * 100),
    hoursOnCourt: Math.round(thisMonth.reduce((s, g) => s + (g.duration_min || 90), 0) / 60),
  };
}

// Hebrew relative label for a past game date.
export function historyDateLabel(iso) {
  const d = new Date(iso);
  const now = new Date();
  const startOfDay = (x) => new Date(x.getFullYear(), x.getMonth(), x.getDate());
  const diff = Math.round((startOfDay(now) - startOfDay(d)) / 86400000);
  if (diff <= 0) return 'היום';
  if (diff === 1) return 'אתמול';
  if (diff < 14) return `לפני ${diff} ימים`;
  return d.toLocaleDateString('he-IL', { day: 'numeric', month: 'long' });
}
