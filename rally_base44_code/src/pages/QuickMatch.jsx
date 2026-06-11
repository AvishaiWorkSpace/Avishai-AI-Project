import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, RotateCcw } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import MatchCard from '@/components/MatchCard';
import SlideToJoin from '@/components/SlideToJoin';
import LevelTag from '@/components/LevelTag';
import { addJoinedMatchId } from '@/data/gamesHistory';
import { formatMatchTime, timeUntil } from '@/lib/format';
import { BallIcon, SparkIcon } from '@/components/icons';

const COMPAT = {
  A1: ['A1', 'A2'], A2: ['A1', 'A2', 'B1'], B1: ['A2', 'B1', 'B2'],
  B2: ['B1', 'B2', 'C1'], C1: ['B2', 'C1', 'C2'], C2: ['C1', 'C2'],
};
const spring = { type: 'spring', stiffness: 280, damping: 26 };

function SearchAnimation() {
  return (
    <div className="relative w-44 h-44 mx-auto my-10">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="absolute inset-0 rounded-full border-2 border-brand/30"
          initial={{ scale: 0.4, opacity: 0.9 }}
          animate={{ scale: 1.25, opacity: 0 }}
          transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.45, ease: 'easeOut' }}
        />
      ))}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-20 h-20 rounded-full bg-brand-gradient shadow-luxe flex items-center justify-center">
          <BallIcon size={34} className="text-[hsl(var(--gold-light))]" />
        </div>
      </div>
    </div>
  );
}

export default function QuickMatch() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('rally_user') || '{}');
  const userLevel = user.level || 'B2';
  const userCity = user.city || 'תל אביב';

  const [strictLevel, setStrictLevel] = useState(false);
  const [indoorOnly, setIndoorOnly] = useState(false);
  const [searching, setSearching] = useState(true);
  const [skipCount, setSkipCount] = useState(0);

  const { data: matches = [] } = useQuery({
    queryKey: ['matches', 'open'],
    queryFn: () => base44.entities.Match.filter({ status: 'open' }, 'start_time'),
  });

  // Score every open match; the search animation "finds" the top one.
  const ranked = useMemo(() => {
    const compat = strictLevel ? [userLevel] : (COMPAT[userLevel] || [userLevel]);
    return matches
      .filter((m) => (m.players?.length || 0) < (m.max_players || 4))
      .filter((m) => !indoorOnly || m.court_type === 'מקורה')
      .map((m) => {
        const hoursAway = Math.max(0, (new Date(m.start_time) - Date.now()) / 3600000);
        const score =
          (compat.includes(m.level) ? 4 : 0) +
          (m.city === userCity ? 3 : 0) +
          (hoursAway < 6 ? 2 : hoursAway < 24 ? 1 : 0) +
          ((m.players?.length || 0) >= 3 ? 1 : 0);
        return { ...m, score };
      })
      .sort((a, b) => b.score - a.score);
  }, [matches, strictLevel, indoorOnly, userLevel, userCity]);

  const best = ranked[skipCount % Math.max(1, ranked.length)];
  const alternates = ranked.filter((m) => m.id !== best?.id).slice(0, 2);

  // Re-run the radar whenever preferences change or the user retries.
  useEffect(() => {
    setSearching(true);
    const t = setTimeout(() => setSearching(false), 1700);
    return () => clearTimeout(t);
  }, [strictLevel, indoorOnly, skipCount]);

  const whyChips = best ? [
    (strictLevel ? best.level === userLevel : (COMPAT[userLevel] || []).includes(best.level)) && 'רמה תואמת',
    best.city === userCity && 'קרוב אליך',
    (new Date(best.start_time) - Date.now()) / 3600000 < 6 && 'מתחיל בקרוב',
    (best.players?.length || 0) >= 3 && 'כמעט מלא',
  ].filter(Boolean) : [];

  return (
    <div className="pb-28">
      {/* Header */}
      <div className="px-5 pt-5 pb-1">
        <h1 className="font-display text-[24px] font-black">משחק מהיר</h1>
        <p className="text-[13px] text-muted-foreground mt-0.5">Rally מוצא לך את המשחק המתאים ביותר — עכשיו</p>
      </div>

      {/* Preference toggles */}
      <div className="flex gap-2 px-5 mt-3">
        <button
          onClick={() => setStrictLevel((v) => !v)}
          className={`px-3.5 py-2 rounded-full text-[12.5px] font-bold border transition-all active:scale-95 ${
            strictLevel ? 'bg-brand text-white border-brand' : 'bg-card border-border'
          }`}
        >
          רק רמה {userLevel}
        </button>
        <button
          onClick={() => setIndoorOnly((v) => !v)}
          className={`px-3.5 py-2 rounded-full text-[12.5px] font-bold border transition-all active:scale-95 ${
            indoorOnly ? 'bg-brand text-white border-brand' : 'bg-card border-border'
          }`}
        >
          רק מקורה
        </button>
      </div>

      <AnimatePresence mode="wait">
        {searching ? (
          <motion.div key="searching" exit={{ opacity: 0, scale: 0.94 }} className="text-center">
            <SearchAnimation />
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              className="font-display text-[17px] font-black"
            >
              סורק משחקים פתוחים...
            </motion.div>
            <div className="text-[12.5px] text-muted-foreground mt-1">רמה · מרחק · שעה · הרכב</div>
          </motion.div>
        ) : best ? (
          <motion.div key={best.id} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={spring} className="px-5 mt-5">
            {/* Best match hero */}
            <div className="flex items-center gap-2 mb-2.5">
              <SparkIcon size={17} className="text-[hsl(var(--gold))]" />
              <span className="font-display text-[18px] font-black">המשחק שלך</span>
            </div>
            <div className="bg-card rounded-[24px] overflow-hidden border border-border shadow-luxe">
              <div className="relative h-40">
                <img src={best.club_image} alt={best.club_name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
                <div className="absolute top-3 right-3">
                  <LevelTag level={best.level} size="sm" />
                </div>
                <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
                  {timeUntil(best.start_time)}
                </div>
                <div className="absolute bottom-3 right-4 left-4 text-white">
                  <div className="font-display text-[20px] font-black leading-tight">{best.club_name}</div>
                  <div className="flex items-center gap-3 text-[12px] text-white/80 mt-1">
                    <span className="flex items-center gap-1"><MapPin size={11} /> {best.city} · {best.drive_minutes} דק׳</span>
                    <span className="flex items-center gap-1"><Clock size={11} /> {formatMatchTime(best.start_time)}</span>
                  </div>
                </div>
              </div>
              <div className="p-4">
                {/* Why this match */}
                <div className="flex flex-wrap gap-1.5 mb-3.5">
                  {whyChips.map((chip) => (
                    <span key={chip} className="text-[11px] font-bold bg-brand-softer text-brand px-2.5 py-1 rounded-full">
                      {chip}
                    </span>
                  ))}
                </div>
                {/* Players in */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex -space-x-2 space-x-reverse">
                    {(best.players || []).map((p) => (
                      <img key={p.id} src={p.avatar_url} alt={p.full_name} className="w-9 h-9 rounded-full border-2 border-white object-cover" />
                    ))}
                    {Array.from({ length: Math.max(0, (best.max_players || 4) - (best.players?.length || 0)) }).map((_, i) => (
                      <div key={i} className="w-9 h-9 rounded-full border-2 border-dashed border-brand/40 bg-brand-softer flex items-center justify-center text-brand font-bold">+</div>
                    ))}
                  </div>
                  <span className="text-[13px] text-muted-foreground">₪{best.price_per_player} · {best.duration_min} דק׳</span>
                </div>
                <SlideToJoin matchId={best.id} onJoin={(id) => addJoinedMatchId(id)} />
              </div>
            </div>

            {/* Retry */}
            <button
              onClick={() => setSkipCount((n) => n + 1)}
              className="w-full mt-3 py-3 rounded-full bg-card border border-border text-[13.5px] font-bold flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <RotateCcw size={15} strokeWidth={2.2} />
              לא מתאים? חפש שוב
            </button>

            {/* Alternates */}
            {alternates.length > 0 && (
              <div className="mt-6">
                <div className="font-display text-[17px] font-black mb-2.5">עוד אפשרויות טובות</div>
                <div className="space-y-3">
                  {alternates.map((m) => <MatchCard key={m.id} match={m} />)}
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div key="empty" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="px-5 pt-12 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-brand-softer flex items-center justify-center mb-3">
              <BallIcon size={28} className="text-brand/50" />
            </div>
            <div className="font-bold text-[15px]">לא נמצא משחק מתאים כרגע</div>
            <p className="text-[13px] text-muted-foreground mt-1 mb-4">נסה להוריד את הסינון או פתח משחק משלך</p>
            <button onClick={() => navigate('/add-match')} className="px-5 py-3 rounded-full bg-brand text-white text-[14px] font-bold active:scale-95">
              פתח משחק חדש
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
