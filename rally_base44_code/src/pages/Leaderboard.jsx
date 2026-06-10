import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, BadgeCheck, X, MapPin, Swords } from 'lucide-react';
import { LEADERBOARD_PLAYERS, RATING_PROFILE } from '@/data/mockData';
import { ratingToLevel } from '@/lib/rating';
import LevelTag from '@/components/LevelTag';

// RD → display confidence. High RD = the engine is still learning this player.
const PROVISIONAL_RD = 120;
const rdToConfidence = rd => Math.max(5, Math.min(99, Math.round(100 - (rd - 30) * 0.28)));

const initials = name => name.split(' ').map(w => w[0]).slice(0, 2).join('');

function Avatar({ player, size = 'w-10 h-10' }) {
  if (player.avatar_url) {
    return <img src={player.avatar_url} alt={player.full_name} className={`${size} rounded-full object-cover border border-border flex-shrink-0`} />;
  }
  return (
    <div className={`${size} rounded-full bg-brand-softer text-brand font-bold text-[13px] flex items-center justify-center flex-shrink-0`}>
      {initials(player.full_name)}
    </div>
  );
}

function Trend({ value }) {
  if (Math.abs(value) < 3) return <Minus size={13} className="text-muted-foreground" />;
  return value > 0
    ? <span className="flex items-center gap-0.5 text-[11px] font-bold text-emerald-600"><TrendingUp size={13} />{value}+</span>
    : <span className="flex items-center gap-0.5 text-[11px] font-bold text-red-500"><TrendingDown size={13} />{value}</span>;
}

export default function Leaderboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('national');
  const [selected, setSelected] = useState(null);
  const user = JSON.parse(localStorage.getItem('rally_user') || '{}');

  const table = useMemo(() => {
    const me = {
      id: 'me',
      full_name: user.full_name || 'אבישי',
      city: user.city || 'תל אביב',
      avatar_url: user.avatar_url,
      rally_rating: user.rally_rating || RATING_PROFILE.rating,
      rd: RATING_PROFILE.rd,
      games_played: RATING_PROFILE.wins + RATING_PROFILE.losses,
      distinct_opponents: RATING_PROFILE.opponentCounts.length,
      wins: RATING_PROFILE.wins,
      losses: RATING_PROFILE.losses,
      verified: !!user.verified,
      trend: RATING_PROFILE.history.at(-1) - RATING_PROFILE.history.at(-6),
      isMe: true,
    };

    const all = [...LEADERBOARD_PLAYERS, me].sort((a, b) => b.rally_rating - a.rally_rating);

    // Official numbered ranks go only to established (low-RD) players;
    // provisional players appear in place but unranked — per the rating spec,
    // a clique can't establish itself.
    let rank = 0;
    return all.map(p => {
      const provisional = p.rd >= PROVISIONAL_RD;
      if (!provisional) rank += 1;
      return { ...p, provisional, rank: provisional ? null : rank };
    });
  }, [user.full_name, user.city, user.avatar_url, user.rally_rating, user.verified]);

  const rows = tab === 'city' ? table.filter(p => p.city === (user.city || 'תל אביב')) : table;
  const myRow = table.find(p => p.isMe);

  return (
    <div dir="rtl" className="pb-28 bg-background min-h-screen">
      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <h1 className="font-display text-[28px] font-black text-foreground leading-none mb-1">טבלת הדירוג</h1>
        <p className="text-[13px] text-muted-foreground">{table.length} שחקנים · מתעדכן אחרי כל משחק</p>
      </div>

      {/* My rank — pinned */}
      {myRow && (
        <button onClick={() => setSelected(myRow)} className="block w-full text-right mx-5 mb-4 w-[calc(100%-2.5rem)]">
          <div className="bg-gradient-to-l from-[hsl(var(--brand-deep))] to-[hsl(var(--brand))] rounded-2xl px-4 py-3.5 shadow-lg flex items-center gap-3 text-white">
            <div className="text-center min-w-[44px]">
              <div className="font-display text-[24px] font-black leading-none">{myRow.rank ?? '—'}</div>
              <div className="text-[10px] opacity-70">{myRow.rank ? 'בארץ' : 'מתכייל'}</div>
            </div>
            <Avatar player={myRow} size="w-11 h-11" />
            <div className="flex-1 min-w-0">
              <div className="font-bold text-[15px] truncate">{myRow.full_name} (אתה)</div>
              <div className="text-[12px] opacity-75">{myRow.wins} נצחונות · {myRow.losses} הפסדים</div>
            </div>
            <div className="text-left">
              <div className="font-display text-[20px] font-black tabular-nums">{myRow.rally_rating}</div>
              <Trend value={myRow.trend} />
            </div>
          </div>
        </button>
      )}

      {/* Tabs */}
      <div className="flex gap-2 px-5 mb-3">
        {[
          { id: 'national', label: 'ארצי' },
          { id: 'city', label: user.city ? `העיר שלי · ${user.city}` : 'העיר שלי' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-full text-[13px] font-bold transition-all ${
              tab === t.id ? 'bg-brand text-white shadow' : 'bg-card border border-border text-muted-foreground'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="mx-5 bg-card border border-border rounded-2xl overflow-hidden shadow-sm divide-y divide-border">
        {rows.map(p => {
          const level = ratingToLevel(p.rally_rating);
          return (
            <button
              key={p.id}
              onClick={() => setSelected(p)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-right active:bg-muted transition-colors ${
                p.isMe ? 'bg-brand-softer/60' : ''
              }`}
            >
              <div className="min-w-[30px] text-center">
                {p.rank
                  ? <span className={`font-display font-black tabular-nums ${p.rank <= 3 ? 'text-[hsl(var(--gold-deep))] text-[18px]' : 'text-[15px] text-muted-foreground'}`}>{p.rank}</span>
                  : <span className="text-[9px] font-bold text-muted-foreground border border-dashed border-muted-foreground/40 rounded-full px-1.5 py-0.5">מתכייל</span>}
              </div>
              <Avatar player={p} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-[14px] truncate">{p.full_name}{p.isMe ? ' (אתה)' : ''}</span>
                  {p.verified && <BadgeCheck size={14} className="text-brand flex-shrink-0" />}
                </div>
                <div className="text-[11.5px] text-muted-foreground">{p.city} · {p.games_played} משחקים</div>
              </div>
              <LevelTag level={level.code} size="xs" />
              <div className="text-left min-w-[52px]">
                <div className={`font-black tabular-nums text-[15px] ${p.provisional ? 'text-muted-foreground' : ''}`}>{p.rally_rating}</div>
                <div className="flex justify-end"><Trend value={p.trend} /></div>
              </div>
            </button>
          );
        })}
      </div>

      <p className="text-center text-[11px] text-muted-foreground mt-4 px-8 leading-relaxed">
        שחקן "מתכייל" עדיין לא צבר מספיק משחקים מול יריבים מגוונים — הדירוג שלו לא נספר בטבלה הרשמית עד שיתבסס.
      </p>

      {/* ---- Player detail sheet ---- */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              className="fixed inset-0 bg-black/45 z-40"
            />
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed bottom-0 inset-x-0 z-50 max-w-md mx-auto bg-card rounded-t-3xl border-t border-border shadow-2xl px-5 pt-3 pb-8"
              dir="rtl"
            >
              <div className="w-10 h-1.5 rounded-full bg-muted mx-auto mb-4" />
              <button onClick={() => setSelected(null)} className="absolute top-4 left-4 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <X size={15} />
              </button>

              <div className="flex items-center gap-3.5 mb-5">
                <Avatar player={selected} size="w-16 h-16" />
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="font-display text-[20px] font-black">{selected.full_name}</span>
                    {selected.verified && <BadgeCheck size={17} className="text-brand" />}
                  </div>
                  <div className="flex items-center gap-2">
                    <LevelTag level={ratingToLevel(selected.rally_rating).code} size="sm" verified={selected.verified} />
                    <span className="text-[12px] text-muted-foreground flex items-center gap-0.5"><MapPin size={11} />{selected.city}</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-display text-[26px] font-black tabular-nums leading-none">{selected.rally_rating}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">{selected.rank ? `#${selected.rank} בארץ` : 'מתכייל'}</div>
                </div>
              </div>

              {/* Game data */}
              <div className="grid grid-cols-3 gap-2.5 mb-4">
                {[
                  { v: selected.games_played, l: 'משחקים' },
                  { v: `${selected.wins}-${selected.losses}`, l: 'נצ׳-הפ׳' },
                  { v: `${Math.round((selected.wins / Math.max(1, selected.games_played)) * 100)}%`, l: 'אחוז נצחונות' },
                ].map(s => (
                  <div key={s.l} className="bg-muted/60 rounded-xl py-3 text-center">
                    <div className="font-display font-black text-[18px] tabular-nums">{s.v}</div>
                    <div className="text-[11px] text-muted-foreground">{s.l}</div>
                  </div>
                ))}
              </div>

              {/* Confidence — the diversity story */}
              <div className="bg-muted/40 border border-border rounded-2xl p-4 mb-5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[13px] font-bold">אמינות הדירוג</span>
                  <span className="text-[13px] font-black tabular-nums">{rdToConfidence(selected.rd)}%</span>
                </div>
                <div className="h-2.5 rounded-full bg-muted overflow-hidden mb-2">
                  <div
                    className="h-full rounded-full bg-gradient-to-l from-[hsl(var(--gold))] to-[hsl(var(--brand))]"
                    style={{ width: `${rdToConfidence(selected.rd)}%` }}
                  />
                </div>
                <p className="text-[11.5px] text-muted-foreground leading-relaxed">
                  {selected.games_played} משחקים מול {selected.distinct_opponents} יריבים שונים.
                  {selected.provisional ? ' עדיין מתכייל — צריך יותר יריבים מגוונים.' : ' דירוג מבוסס.'}
                </p>
              </div>

              {!selected.isMe && (
                <button
                  onClick={() => { setSelected(null); navigate('/find'); }}
                  className="w-full h-[50px] rounded-2xl bg-brand text-white font-bold text-[15px] flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-all"
                >
                  <Swords size={17} /> מצא משחק מולו
                </button>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
