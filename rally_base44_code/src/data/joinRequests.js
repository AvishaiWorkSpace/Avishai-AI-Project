// Rally — approval-gated joining ("מילוי מהיר — חסר שחקן אחד").
//
// Sliding to join a quick-fill match does NOT put you in the game — it sends
// a request to the match host. Only after the host approves do you become a
// member: the match lands in המשחקים שלי and the match chat unlocks.
//
// Two sides live here:
//   Outgoing — requests the current user sent (rally_join_requests).
//     Demo: the "host" approves automatically a few seconds after the
//     request. The flip happens lazily inside getJoinRequest, so it works
//     across navigation and full reloads without timers.
//   Incoming — requests other players send to matches the user hosts
//     (rally_host_decisions). The candidate is deterministic per match.
import { PLAYERS } from '@/data/mockData';
import { addJoinedMatchId } from '@/data/gamesHistory';
import { base44, isLiveBackend } from '@/api/base44Client';

const REQUESTS_KEY = 'rally_join_requests';
const DECISIONS_KEY = 'rally_host_decisions';

// Fire-and-forget mirror to the Base44 data center (live mode only) — the
// sync localStorage copy stays the demo source of truth either way.
const mirror = (fn) => {
  if (!isLiveBackend) return;
  Promise.resolve().then(fn).catch(() => { /* offline — keep local copy */ });
};

// How long the demo host "thinks" before approving.
export const DEMO_APPROVAL_MS = 10000;

const readJSON = (key) => {
  try { return JSON.parse(localStorage.getItem(key) || '{}'); } catch { return {}; }
};
const writeJSON = (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* demo state only */ }
};

// ---------------------------------------------------------------------------
// Outgoing — me asking to join someone else's match
// ---------------------------------------------------------------------------

export function requestJoin(matchId) {
  const all = readJSON(REQUESTS_KEY);
  all[matchId] = { status: 'pending', requested_at: Date.now() };
  writeJSON(REQUESTS_KEY, all);
  mirror(() => base44.entities.JoinRequest.create({ match_id: matchId, status: 'pending' }));
  return all[matchId];
}

// Read my request for a match. Lazily flips pending → approved once the demo
// delay passed; the approval is what actually adds the match to my games.
export function getJoinRequest(matchId) {
  const all = readJSON(REQUESTS_KEY);
  const req = all[matchId];
  if (!req) return null;
  if (req.status === 'pending' && Date.now() - req.requested_at >= DEMO_APPROVAL_MS) {
    req.status = 'approved';
    req.approved_at = Date.now();
    writeJSON(REQUESTS_KEY, all);
    addJoinedMatchId(matchId);
    mirror(async () => {
      const rows = await base44.entities.JoinRequest.filter({ match_id: matchId });
      if (rows[0]) await base44.entities.JoinRequest.update(rows[0].id, { status: 'approved' });
    });
  }
  return req;
}

export function clearJoinRequest(matchId) {
  const all = readJSON(REQUESTS_KEY);
  delete all[matchId];
  writeJSON(REQUESTS_KEY, all);
}

// ---------------------------------------------------------------------------
// Incoming — players asking to join a match the user hosts
// ---------------------------------------------------------------------------

const djb2 = (str) => {
  let h = 5381;
  for (const ch of String(str)) h = ((h << 5) + h + ch.charCodeAt(0)) | 0;
  return Math.abs(h);
};

// The demo player knocking on a hosted match's door — deterministic per
// match id, never someone who is already playing in it.
export function getIncomingRequest(match) {
  if (!match) return null;
  const inMatch = new Set((match.players || []).map((p) => p.id));
  const pool = PLAYERS.filter((p) => !inMatch.has(p.id));
  if (!pool.length) return null;
  const player = pool[djb2(match.id) % pool.length];
  const decisions = readJSON(DECISIONS_KEY);
  return { player, decision: decisions[match.id]?.[player.id] || null };
}

export function decideIncoming(matchId, playerId, decision) {
  const decisions = readJSON(DECISIONS_KEY);
  decisions[matchId] = { ...(decisions[matchId] || {}), [playerId]: decision };
  writeJSON(DECISIONS_KEY, decisions);
  mirror(() => base44.entities.JoinRequest.create({ match_id: matchId, player_id: playerId, status: decision, incoming: true }));
}
