import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, BadgeCheck, MapPin, Swords, ArrowUpDown, X } from 'lucide-react';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';
import { LEADERBOARD_PLAYERS } from '@/data/mockData';
import { ratingToLevel } from '@/lib/rating';
import LevelTag from '@/components/LevelTag';
import { BallIcon } from '@/components/icons';

const LEVEL_CHIPS = ['הכל', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const SORTS = [
  { id: 'rating', label: 'דירוג' },
  { id: 'games', label: 'משחקים' },
];

const spring = { type: 'spring', stiffness: 280, damping: 26 };
const initials = (name = '') => name.split(' ').map((w) => w[0]).slice(0, 2).join('');

function Avatar({ player, size = 'w-12 h-12' }) {
  if (player.avatar_url) {
    return (
      <img
        src={player.avatar_url}
        alt={player.full_name}
        className={`${size} rounded-full object-cover border-2 border-white shadow-sm flex-shrink-0`}
      />
    );
  }
  return (
    <div className={`${size} rounded-full bg-brand-softer text-brand font-bold text-[14px] flex items-center justify-center flex-shrink-0 border border-border`}>
      {initials(player.full_name)}
    </div>
  );
}

export default function Players() {
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState('הכל');
  const [sort, setSort] = useState('rating');
  const [expandedId, setExpandedId] = useState(null);

  const { data: entityPlayers = [] } = useQuery({
    queryKey: ['players', 'directory'],
    queryFn: () => base44.entities.Player.list('-rally_rating', 100),
  });

  // Entity players (canonical) merged over the national pool for volume.
  const allPlayers = useMemo(() => {
    const byId = new Map();
    LEADERBOARD_PLAYERS.forEach((p) => byId.set(p.id, p));
    entityPlayers.forEach((p) => byId.set(p.id, { ...byId.get(p.id), ...p }));
    return [...byId.values()].map((p) => ({
      ...p,
      level: p.level || ratingToLevel(p.rally_rating).code,
    }));
  }, [entityPlayers]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allPlayers
      .filter((p) => (level === 'הכל' ? true : p.level === level))
      .filter((p) => (q ? `${p.full_name} ${p.city}`.toLowerCase().includes(q) : true))
      .sort((a, b) =>
        sort === 'games'
          ? (b.games_played || 0) - (a.games_played || 0)
          : (b.rally_rating || 0) - (a.rally_rating || 0)
      );
  }, [allPlayers, search, level, sort]);

  const invite = (p) =>
    toast.success('ההזמנה נשלחה', {
      description: `${p.full_name.split(' ')[0]} יקבל התראה על ההזמנה שלך למשחק`,
    });

  return (
    <div className="pb-28 bg-bgWarm min-h-screen">
      {/* Sticky header */}
      <div className="sticky top-0 z-30 bg-bgWarm/95 backdrop-blur-md px-5 pt-5 pb-3">
        <div className="flex items-baseline justify-between mb-4">
          <h1 className="font-display text-[28px] font-black text-brand">שחקנים</h1>
          <span className="text-[13px] text-muted-foreground">{filtered.length} שחקנים</span>
        </div>

        {/* Search + sort toggle */}
        <div className="flex items-center gap-2.5 mb-3">
          <div className="flex-1 flex items-center gap-2 bg-card rounded-full px-4 h-11 border border-border shadow-sm">
            <Search size={18} className="text-muted-foreground" strokeWidth={2} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="חיפוש לפי שם או עיר..."
              className="flex-1 bg-transparent outline-none text-[14px] placeholder:text-muted-foreground min-w-0"
            />
            {search && (
              <button onClick={() => setSearch('')} className="active:scale-90" aria-label="נקה חיפוש">
                <X size={15} className="text-muted-foreground" />
              </button>
            )}
          </div>
          <button
            onClick={() => setSort((s) => (s === 'rating' ? 'games' : 'rating'))}
            className="h-11 px-4 rounded-full bg-card border border-border shadow-sm flex items-center gap-1.5 text-[13px] font-bold active:scale-95 transition-transform flex-shrink-0"
          >
            <ArrowUpDown size={14} className="text-brand" />
            {SORTS.find((s) => s.id === sort)?.label}
          </button>
        </div>

        {/* Level chips */}
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {LEVEL_CHIPS.map((l) => (
            <button
              key={l}
              onClick={() => setLevel(l)}
              className={`h-9 px-4 rounded-full text-[13px] font-bold border flex-shrink-0 transition-colors active:scale-95 ${
                level === l ? 'bg-brand text-white border-brand' : 'bg-card text-foreground border-border'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Player list */}
      <div className="px-5 flex flex-col gap-2.5 mt-1">
        {filtered.map((p, i) => {
          const expanded = expandedId === p.id;
          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: Math.min(i, 9) * 0.045 }}
              className={`bg-card rounded-3xl border shadow-sm overflow-hidden transition-colors ${
                expanded ? 'border-brand/30' : 'border-border'
              }`}
            >
              <button
                onClick={() => setExpandedId(expanded ? null : p.id)}
                className="w-full text-right p-3.5 flex items-center gap-3 active:scale-[0.98] transition-transform"
              >
                <Avatar player={p} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-[14px] truncate">{p.full_name}</span>
                    {p.verified && (
                      <BadgeCheck size={15} className="text-[hsl(var(--gold-deep))] flex-shrink-0" strokeWidth={2.25} />
                    )}
                  </div>
                  <div className="flex items-center gap-2.5 mt-1">
                    <LevelTag level={p.level} size="xs" />
                    <span className="flex items-center gap-1 text-[11.5px] text-muted-foreground">
                      <MapPin size={11} strokeWidth={2} />
                      {p.city}
                    </span>
                  </div>
                </div>
                <div className="text-left flex-shrink-0">
                  <div className="font-display text-[20px] font-black text-brand leading-none">
                    {p.rally_rating}
                  </div>
                  <div className="flex items-center gap-1 justify-end text-[10.5px] text-muted-foreground mt-1">
                    <BallIcon size={11} strokeWidth={2.2} />
                    {p.games_played} משחקים
                  </div>
                </div>
              </button>

              <AnimatePresence initial={false}>
                {expanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22 }}
                  >
                    <div className="px-4 pb-4">
                      <div className="grid grid-cols-3 gap-2 mb-3.5">
                        <div className="bg-bgWarm rounded-2xl px-3 py-2.5 text-center">
                          <div className="font-display text-[16px] font-black">{p.wins ?? '—'}</div>
                          <div className="text-[10.5px] text-muted-foreground mt-0.5">ניצחונות</div>
                        </div>
                        <div className="bg-bgWarm rounded-2xl px-3 py-2.5 text-center">
                          <div className="font-display text-[16px] font-black">{p.losses ?? '—'}</div>
                          <div className="text-[10.5px] text-muted-foreground mt-0.5">הפסדים</div>
                        </div>
                        <div className="bg-bgWarm rounded-2xl px-3 py-2.5 text-center">
                          <div className="font-display text-[16px] font-black">{p.distinct_opponents ?? '—'}</div>
                          <div className="text-[10.5px] text-muted-foreground mt-0.5">יריבים שונים</div>
                        </div>
                      </div>
                      {p.preferred_hand && (
                        <div className="text-[12px] text-muted-foreground mb-3.5">
                          יד דומיננטית: <span className="font-bold text-foreground">{p.preferred_hand}</span>
                        </div>
                      )}
                      <button
                        onClick={() => invite(p)}
                        className="w-full h-11 rounded-full bg-brand text-white font-bold text-[14px] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-sm"
                      >
                        <Swords size={15} strokeWidth={2} />
                        הזמן למשחק
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}

        {/* Empty state */}
        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={spring}
            className="py-16 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-brand-softer mx-auto mb-4 flex items-center justify-center">
              <Search size={24} className="text-brand/50" />
            </div>
            <div className="font-bold text-[15px] mb-1">לא נמצאו שחקנים</div>
            <p className="text-[13px] text-muted-foreground mb-4">נסה חיפוש אחר או שנה את סינון הרמה</p>
            <button
              onClick={() => { setSearch(''); setLevel('הכל'); }}
              className="text-brand text-[13px] font-bold active:scale-95"
            >
              נקה סינונים
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
