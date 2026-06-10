// Mock implementation of the base44 SDK so the app runs offline.
// Mirrors the subset of the API the pages actually use:
//   base44.entities.<Entity>.list(sort, limit)
//   base44.entities.<Entity>.filter(query, sort, limit)
//   base44.entities.<Entity>.get(id)
import { CLUBS, PLAYERS, MATCHES, COURT_LISTINGS } from '@/data/mockData';

const DB = {
  Match: [...MATCHES],
  Club: [...CLUBS],
  Player: [...PLAYERS],
  CourtListing: [...COURT_LISTINGS],
};

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
      const row = { id: `${name[0].toLowerCase()}${Date.now()}`, ...data };
      DB[name].unshift(row);
      return row;
    },
    async update(id, data) {
      await delay();
      const i = DB[name].findIndex((r) => r.id === id);
      if (i >= 0) DB[name][i] = { ...DB[name][i], ...data };
      return DB[name][i];
    },
  };
}

export const base44 = {
  entities: {
    Match: makeEntity('Match'),
    Club: makeEntity('Club'),
    Player: makeEntity('Player'),
    CourtListing: makeEntity('CourtListing'),
  },
  auth: {
    me: async () => null,
  },
};

export default base44;
