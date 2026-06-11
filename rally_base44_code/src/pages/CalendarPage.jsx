import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Plus, Clock, MapPin } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import LevelTag from '@/components/LevelTag';
import { getJoinedMatchIds } from '@/data/gamesHistory';
import { BallIcon, SearchIcon } from '@/components/icons';

const DAYS_HE = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳'];
const spring = { type: 'spring', stiffness: 280, damping: 26 };

const sameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

export default function CalendarPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('rally_user') || '{}');
  const [selected, setSelected] = useState(0);

  const days = useMemo(() => {
    return Array.from({ length: 14 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      d.setHours(0, 0, 0, 0);
      return d;
    });
  }, []);

  const { data: matches = [] } = useQuery({
    queryKey: ['matches', 'open'],
    queryFn: () => base44.entities.Match.filter({ status: 'open' }, 'start_time'),
  });

  const joinedIds = useMemo(() => getJoinedMatchIds(), []);

  const dayHasGame = (d) => matches.some((m) => sameDay(new Date(m.start_time), d));
  const selectedDate = days[selected];

  const { mine, open } = useMemo(() => {
    const onDay = matches.filter((m) => sameDay(new Date(m.start_time), selectedDate));
    return {
      mine: onDay.filter((m) => joinedIds.includes(m.id)),
      open: onDay.filter((m) => !joinedIds.includes(m.id) && (!user.city || m.city === user.city || true)),
    };
  }, [matches, selectedDate, joinedIds, user.city]);

  const timeOf = (iso) => new Date(iso).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });

  const GameRow = ({ match, mineRow }) => (
    <button
      onClick={() => navigate(`/match/${match.id}`)}
      className={`w-full text-right rounded-2xl border p-3.5 flex items-center gap-3 transition-all active:scale-[0.98] ${
        mineRow ? 'bg-brand-softer border-brand/25' : 'bg-card border-border'
      }`}
    >
      <div className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center flex-shrink-0 ${mineRow ? 'bg-brand text-white' : 'bg-bgWarm text-brand'}`}>
        <span className="font-display text-[14px] font-black leading-none">{timeOf(match.start_time)}</span>
        <span className="text-[9px] opacity-75 mt-0.5">{match.duration_min} דק׳</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-bold text-[14px] truncate">{match.club_name}</div>
        <div className="flex items-center gap-1 text-[12px] text-muted-foreground mt-0.5">
          <MapPin size={11} strokeWidth={2} />
          <span className="truncate">{match.city} · {(match.players?.length || 0)}/{match.max_players || 4} שחקנים</span>
        </div>
      </div>
      <LevelTag level={match.level} size="sm" />
    </button>
  );

  return (
    <div dir="rtl" className="min-h-screen bg-background max-w-md mx-auto pb-32">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-5 pb-4">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center active:scale-90">
          <ArrowRight size={17} />
        </button>
        <h1 className="font-display text-[22px] font-black flex-1">היומן שלי</h1>
        <span className="text-[12px] font-bold text-muted-foreground">
          {selectedDate.toLocaleDateString('he-IL', { day: 'numeric', month: 'long' })}
        </span>
      </div>

      {/* 14-day strip */}
      <div className="flex gap-2 overflow-x-auto px-5 pb-2" style={{ scrollbarWidth: 'none' }}>
        {days.map((d, i) => {
          const active = i === selected;
          return (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`flex-shrink-0 w-[52px] py-2.5 rounded-2xl border flex flex-col items-center gap-1 transition-all active:scale-95 ${
                active ? 'bg-brand text-white border-brand shadow-md' : 'bg-card border-border'
              }`}
            >
              <span className={`text-[11px] font-bold ${active ? 'text-white/85' : 'text-muted-foreground'}`}>
                {i === 0 ? 'היום' : DAYS_HE[d.getDay()]}
              </span>
              <span className="font-display text-[17px] font-black leading-none">{d.getDate()}</span>
              <span className={`w-1.5 h-1.5 rounded-full ${dayHasGame(d) ? (active ? 'bg-[hsl(var(--gold-light))]' : 'bg-[hsl(var(--gold))]') : 'bg-transparent'}`} />
            </button>
          );
        })}
      </div>

      <div className="px-5 mt-4">
        {/* My games */}
        {mine.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={spring} className="mb-5">
            <div className="font-display text-[17px] font-black mb-2.5">המשחקים שלי</div>
            <div className="space-y-2.5">
              {mine.map((m) => <GameRow key={m.id} match={m} mineRow />)}
            </div>
          </motion.div>
        )}

        {/* Open in the area */}
        {open.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.06 }} className="mb-5">
            <div className="flex items-baseline justify-between mb-2.5">
              <span className="font-display text-[17px] font-black">פתוחים באזור</span>
              <button onClick={() => navigate('/find')} className="text-[13px] text-brand font-semibold">לכל המשחקים</button>
            </div>
            <div className="space-y-2.5">
              {open.map((m) => <GameRow key={m.id} match={m} />)}
            </div>
          </motion.div>
        )}

        {/* Empty day */}
        {mine.length === 0 && open.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={spring}
            className="flex flex-col items-center text-center pt-14 gap-3">
            <div className="w-16 h-16 rounded-full bg-brand-softer flex items-center justify-center">
              <BallIcon size={28} className="text-brand/50" />
            </div>
            <div className="font-bold text-[15px]">אין משחקים ביום הזה</div>
            <p className="text-[13px] text-muted-foreground max-w-[240px]">
              פתח משחק חדש או מצא משחק פתוח — היומן שלך יתמלא מהר
            </p>
            <div className="flex gap-2 mt-2">
              <button onClick={() => navigate('/find')}
                className="px-4 py-2.5 rounded-full bg-card border border-border text-[13px] font-bold flex items-center gap-1.5 active:scale-95">
                <SearchIcon size={15} /> מצא משחק
              </button>
              <button onClick={() => navigate('/add-match')}
                className="px-4 py-2.5 rounded-full bg-brand text-white text-[13px] font-bold flex items-center gap-1.5 active:scale-95">
                <Plus size={15} strokeWidth={2.5} /> פתח משחק
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 inset-x-0 max-w-md mx-auto p-4 bg-gradient-to-t from-background via-background/95 to-transparent">
        <button
          onClick={() => navigate('/add-match')}
          className="w-full h-13 py-3.5 rounded-full bg-brand text-white font-bold text-[15px] shadow-luxe flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          <Plus size={17} strokeWidth={2.5} />
          פתח משחק חדש
        </button>
      </div>
    </div>
  );
}
