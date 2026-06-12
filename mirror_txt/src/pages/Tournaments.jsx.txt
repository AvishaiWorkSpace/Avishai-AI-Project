import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Check, MapPin, CalendarDays, Banknote, Medal } from 'lucide-react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import { TOURNAMENTS, PAST_TOURNAMENTS } from '@/data/clubsTournaments';
import { TrophyIcon } from '@/components/icons';

const spring = { type: 'spring', stiffness: 280, damping: 26 };
const REG_KEY = 'rally_tournaments';

const readRegistered = () => {
  try {
    const v = JSON.parse(localStorage.getItem(REG_KEY) || '[]');
    return Array.isArray(v) ? v : [];
  } catch { return []; }
};

function daysUntil(iso) {
  const diff = Math.ceil((new Date(iso) - Date.now()) / 86400000);
  if (diff <= 0) return 'היום';
  if (diff === 1) return 'מחר';
  return `בעוד ${diff} ימים`;
}

function dateLabel(iso) {
  return new Date(iso).toLocaleDateString('he-IL', { day: 'numeric', month: 'long' });
}

function ProgressBar({ filled, total }) {
  const pct = Math.round((filled / total) * 100);
  const almostFull = pct >= 80;
  return (
    <div>
      <div className="flex justify-between text-[11px] mb-1">
        <span className={`font-bold ${almostFull ? 'text-[hsl(var(--gold-deep))]' : 'text-muted-foreground'}`}>
          {almostFull ? 'כמעט מלא!' : 'מקומות נתפסים'}
        </span>
        <span className="text-muted-foreground font-display">{filled}/{total}</span>
      </div>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className={`h-full rounded-full ${almostFull ? 'bg-gradient-to-l from-[hsl(var(--gold-deep))] to-[hsl(var(--gold))]' : 'bg-brand'}`}
        />
      </div>
    </div>
  );
}

export default function Tournaments() {
  const navigate = useNavigate();
  const [registered, setRegistered] = useState(readRegistered);

  const register = (t) => {
    if (registered.includes(t.id)) return;
    setRegistered((prev) => {
      const next = [...prev, t.id];
      try { localStorage.setItem(REG_KEY, JSON.stringify(next)); } catch { /* demo */ }
      return next;
    });
    toast.success(`נרשמת ל${t.name}!`, { description: `${dateLabel(t.date)} · ${t.club_name} · דמי השתתפות ₪${t.entry_fee}` });
    confetti({ particleCount: 50, spread: 55, origin: { y: 0.7 }, colors: ['#C9A961', '#1B4D3E'] });
  };

  const [hero, ...rest] = TOURNAMENTS;
  const heroRegistered = registered.includes(hero.id);

  return (
    <div dir="rtl" className="min-h-screen bg-background max-w-md mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-5 pb-4">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center active:scale-90">
          <ArrowRight size={17} />
        </button>
        <h1 className="font-display text-[22px] font-black flex-1">טורנירים</h1>
        <span className="text-[12px] font-bold text-muted-foreground">{TOURNAMENTS.length} פתוחים להרשמה</span>
      </div>

      {/* Hero — nearest tournament */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={spring} className="px-5 mb-6">
        <div className="bg-card rounded-[26px] overflow-hidden border border-border shadow-luxe">
          <div className="relative h-44">
            <img src={hero.image_url} alt={hero.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <span className="absolute top-3 right-3 bg-gradient-to-l from-[hsl(var(--gold-deep))] to-[hsl(var(--gold))] text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-gold">
              {daysUntil(hero.date)}
            </span>
            <span className="absolute top-3 left-3 bg-black/40 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
              {hero.format}
            </span>
            <div className="absolute bottom-3.5 right-4 left-4 text-white">
              <div className="font-display text-[22px] font-black leading-tight">{hero.name}</div>
              <div className="flex items-center gap-3 text-[12px] text-white/85 mt-1">
                <span className="flex items-center gap-1"><MapPin size={11} /> {hero.club_name}</span>
                <span className="flex items-center gap-1"><CalendarDays size={11} /> {dateLabel(hero.date)}</span>
              </div>
            </div>
          </div>
          <div className="p-4">
            <div className="flex items-center gap-2 flex-wrap mb-3.5">
              <span className="text-[11px] font-bold bg-brand-softer text-brand px-2.5 py-1 rounded-full">רמות {hero.level_range}</span>
              <span className="text-[11px] font-bold bg-gold-soft text-[#8a6d3b] px-2.5 py-1 rounded-full flex items-center gap-1">
                <TrophyIcon size={11} /> {hero.prize}
              </span>
              <span className="text-[11px] font-bold bg-bgWarm px-2.5 py-1 rounded-full flex items-center gap-1">
                <Banknote size={11} /> ₪{hero.entry_fee}
              </span>
            </div>
            <ProgressBar filled={hero.slots_filled + (heroRegistered ? 1 : 0)} total={hero.slots_total} />
            <button
              onClick={() => register(hero)}
              className={`w-full mt-4 py-3 rounded-full font-bold text-[14.5px] transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
                heroRegistered ? 'bg-brand-softer text-brand' : 'bg-brand text-white shadow-sm'
              }`}
            >
              {heroRegistered ? (<><Check size={16} strokeWidth={3} /> רשום — נתראה במגרש</>) : 'הירשם לטורניר'}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Upcoming list */}
      <div className="px-5">
        <div className="font-display text-[17px] font-black mb-3">טורנירים קרובים</div>
        <div className="space-y-3 mb-7">
          {rest.map((t, i) => {
            const isReg = registered.includes(t.id);
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...spring, delay: Math.min(i, 5) * 0.05 }}
                className="bg-card border border-border rounded-3xl p-3.5 shadow-sm"
              >
                <div className="flex gap-3">
                  <img src={t.image_url} alt={t.name} className="w-16 h-16 rounded-2xl object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-bold text-[14.5px] leading-tight">{t.name}</div>
                      <span className="text-[10.5px] font-bold text-muted-foreground bg-bgWarm rounded-full px-2 py-0.5 flex-shrink-0">
                        {daysUntil(t.date)}
                      </span>
                    </div>
                    <div className="text-[12px] text-muted-foreground mt-0.5">
                      {t.club_name} · {dateLabel(t.date)} · {t.format}
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[10.5px] font-bold bg-brand-softer text-brand px-2 py-0.5 rounded-full">{t.level_range}</span>
                      <span className="text-[10.5px] font-bold text-[#8a6d3b]">{t.prize}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex-1">
                    <ProgressBar filled={t.slots_filled + (isReg ? 1 : 0)} total={t.slots_total} />
                  </div>
                  <button
                    onClick={() => register(t)}
                    className={`px-4 py-2 rounded-full text-[12.5px] font-bold transition-all active:scale-95 flex items-center gap-1.5 flex-shrink-0 ${
                      isReg ? 'bg-brand-softer text-brand' : 'bg-brand text-white'
                    }`}
                  >
                    {isReg ? (<><Check size={13} strokeWidth={3} /> רשום</>) : `הירשם · ₪${t.entry_fee}`}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Past tournaments */}
        <div className="font-display text-[17px] font-black mb-3">טורנירים שהסתיימו</div>
        <div className="space-y-3">
          {PAST_TOURNAMENTS.map((t) => (
            <div key={t.id} className="bg-card border border-border rounded-3xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="font-bold text-[14px]">{t.name}</div>
                  <div className="text-[11.5px] text-muted-foreground mt-0.5">
                    {t.club_name} · {dateLabel(t.date)} · {t.participants} משתתפים
                  </div>
                </div>
                <span className="text-[10.5px] font-bold bg-muted text-muted-foreground rounded-full px-2.5 py-1">הסתיים</span>
              </div>
              <div className="space-y-1.5">
                {t.podium.map((name, pos) => (
                  <div key={name} className="flex items-center gap-2.5">
                    <Medal
                      size={16}
                      className={pos === 0 ? 'text-[hsl(var(--gold))]' : pos === 1 ? 'text-muted-foreground' : 'text-[#b08d57]'}
                      fill={pos === 0 ? 'hsl(var(--gold) / 0.3)' : 'none'}
                    />
                    <span className={`text-[13px] ${pos === 0 ? 'font-black' : 'font-medium'}`}>{name}</span>
                    {pos === 0 && <span className="text-[10.5px] font-bold text-[hsl(var(--gold-deep))] bg-gold-soft rounded-full px-2 py-0.5">אלוף</span>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
