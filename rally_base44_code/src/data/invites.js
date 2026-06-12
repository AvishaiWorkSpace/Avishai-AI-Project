// Rally — inviting a specific player to one of my matches.
//
// The Home bookings panel lets the user search a player by name and send
// them a "join my game" invitation. Invites live in localStorage (demo) and
// write through to the Base44 PlayerInvite entity when the live backend is
// enabled (VITE_BASE44_APP_ID) — same dual-mode pattern as base44Client.
//
// Demo behavior: the invited player "accepts" a few seconds after the
// invite is sent. The flip happens lazily inside getInvites, so it works
// across navigation and reloads without timers.
import { base44, isLiveBackend } from '@/api/base44Client';

const INVITES_KEY = 'rally_player_invites';

// How long the demo player "thinks" before accepting.
export const INVITE_ACCEPT_MS = 12000;

const readAll = () => {
  try {
    const raw = JSON.parse(localStorage.getItem(INVITES_KEY) || '[]');
    return Array.isArray(raw) ? raw : [];
  } catch { return []; }
};
const writeAll = (list) => {
  try { localStorage.setItem(INVITES_KEY, JSON.stringify(list)); } catch { /* demo state only */ }
};

// Fire-and-forget mirror to the Base44 data center (live mode only).
const mirror = (fn) => {
  if (!isLiveBackend) return;
  Promise.resolve().then(fn).catch(() => { /* offline — local copy is the demo truth */ });
};

export function sendInvite(player, match) {
  const invite = {
    id: `inv_${Date.now()}`,
    player_id: player.id,
    player_name: player.full_name,
    player_avatar: player.avatar_url,
    player_level: player.level,
    match_id: match.id,
    club_name: match.club_name,
    start_time: match.start_time,
    status: 'pending',
    sent_at: Date.now(),
  };
  writeAll([invite, ...readAll()]);
  mirror(() => base44.entities.PlayerInvite.create(invite));
  return invite;
}

// All invites, newest first. Lazily flips pending → accepted once the demo
// delay passed.
export function getInvites() {
  const list = readAll();
  let changed = false;
  for (const inv of list) {
    if (inv.status === 'pending' && Date.now() - inv.sent_at >= INVITE_ACCEPT_MS) {
      inv.status = 'accepted';
      inv.accepted_at = Date.now();
      changed = true;
      mirror(() => base44.entities.PlayerInvite.update(inv.id, { status: 'accepted' }));
    }
  }
  if (changed) writeAll(list);
  return list;
}

export function hasPendingInvite(playerId, matchId) {
  return readAll().some(
    (inv) => inv.player_id === playerId && inv.match_id === matchId && inv.status === 'pending',
  );
}
