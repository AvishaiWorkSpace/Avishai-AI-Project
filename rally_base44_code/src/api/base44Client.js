// Rally data layer — dual mode.
//
//   REAL  — set VITE_BASE44_APP_ID in .env and every entity call below hits
//           the live Base44 app (entities must exist there; see BACKEND.md).
//   MOCK  — no env var: an offline store with the exact same API surface,
//           seeded from mockData and PERSISTED to localStorage, so created
//           rows (match results, peer ratings) survive reloads.
//
// Pages import { base44 } and never know which mode they're in — that's the
// whole point: when the real backend lands, no page changes.
import { createClient } from '@base44/sdk';
import { CLUBS, PLAYERS, MATCHES, COURT_LISTINGS } from '@/data/mockData';

const APP_ID = import.meta.env.VITE_BASE44_APP_ID;

// ---------------------------------------------------------------------------
// Mock mode — localStorage-backed store
// ---------------------------------------------------------------------------
const DB_KEY = 'rally_db_v1';

// Static catalog data is always seeded fresh from mockData (it's content,
// not user state). User-generated entities hydrate from localStorage.
const SEED = {
  Match: () => [...MATCHES],
  Club: () => [...CLUBS],
  Player: () => [...PLAYERS],
  CourtListing: () => [...COURT_LISTINGS],
  MatchResult: () => [],
  PeerRating: () => [],
  JoinRequest: () => [],
  PlayerInvite: () => [],
  Booking: () => [],
};
const PERSISTED = new Set(['MatchResult', 'PeerRating', 'JoinRequest', 'PlayerInvite', 'Booking']);

function loadDB() {
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(DB_KEY) || '{}'); } catch { /* corrupt → reseed */ }
  return Object.fromEntries(
    Object.entries(SEED).map(([name, seed]) => [
      name,
      PERSISTED.has(name) && Array.isArray(saved[name]) ? saved[name] : seed(),
    ]),
  );
}

const DB = loadDB();

function persist() {
  try {
    const out = {};
    for (const name of PERSISTED) out[name] = DB[name];
    localStorage.setItem(DB_KEY, JSON.stringify(out));
  } catch { /* storage full/blocked — mock keeps working in memory */ }
}

const delay = (ms = 180) => new Promise((r) => setTimeout(r, ms));

function applySort(rows, sort) {
  if (!sort) return rows;
  const desc = sort.startsWith('-');
  const key = desc ? sort.slice(1) : sort;
  return [...rows].sort((a, b) => {
    const av = a[key], bv = b[key];
    if (av === bv) return 0;
    const cmp = av > bv ? 1 : -1;
    return desc ? -cmp : cmp;
  });
}

function matchesQuery(row, query) {
  return Object.entries(query || {}).every(([k, v]) => row[k] === v);
}

function makeEntity(name) {
  return {
    async list(sort, limit) {
      await delay();
      let rows = applySort(DB[name], sort);
      return typeof limit === 'number' ? rows.slice(0, limit) : rows;
    },
    async filter(query, sort, limit) {
      await delay();
      let rows = DB[name].filter((r) => matchesQuery(r, query));
      rows = applySort(rows, sort);
      return typeof limit === 'number' ? rows.slice(0, limit) : rows;
    },
    async get(id) {
      await delay();
      return DB[name].find((r) => r.id === id) || null;
    },
    async create(data) {
      await delay();
      const row = { id: `${name[0].toLowerCase()}${Date.now()}`, created_at: new Date().toISOString(), ...data };
      DB[name].unshift(row);
      if (PERSISTED.has(name)) persist();
      return row;
    },
    async update(id, data) {
      await delay();
      const i = DB[name].findIndex((r) => r.id === id);
      if (i >= 0) DB[name][i] = { ...DB[name][i], ...data };
      if (PERSISTED.has(name)) persist();
      return DB[name][i];
    },
  };
}

const mockClient = {
  entities: Object.fromEntries(Object.keys(SEED).map((n) => [n, makeEntity(n)])),
  auth: {
    me: async () => null,
  },
};

// ---------------------------------------------------------------------------
// Mode selection
// ---------------------------------------------------------------------------
function buildClient() {
  if (!APP_ID) return mockClient;
  try {
    return createClient({ appId: APP_ID });
  } catch (e) {
    console.warn('[rally] Base44 client failed to init — falling back to mock store', e);
    return mockClient;
  }
}

export const base44 = buildClient();
export const isLiveBackend = !!APP_ID;

export default base44;
