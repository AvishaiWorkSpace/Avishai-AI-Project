import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, Clock, MapPin, CalendarDays } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import confetti from 'canvas-confetti';
import { base44 } from '@/api/base44Client';
import { enrichClubs, clubHash } from '@/data/clubsExtra';
import { CourtIcon } from '@/components/icons';

const spring = { type: 'spring', stiffness: 280, damping: 26 };
const DAYS_HE = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
const SLOTS = ['07:00', '08:30', '10:00', '11:30', '13:00', '14:30', '16:00', '17:30', '19:00', '20:30', '21:30'];
const BOOKINGS_KEY = 'rally_bookings';

function nextDays(count = 7) {
  return Array.from({ length: count }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    d.setHours(0, 0, 0, 0);
    return { date: d, label: i === 0 ? 'היום' : i === 1 ? 'מחר' : DAYS_HE[d.getDay()], dayNum: d.getDate() };
  });
}

// A slot is "taken" deterministically per club+day+time — busy evenings, freer mornings.
function isTaken(clubId, dayIdx, slot) {
  const h = clubHash(`${clubId}|${dayIdx}|${slot}`);
  const evening = Number(slot.slice(0, 2)) >= 17;
  return h % 10 < (evening ? 5 : 2);
}

function StepDots({ step }) {
  return (
    <div className="flex items-center gap-1.5">
      {[0, 1, 2].map((i) => (
        <span key={i} className={`h-1.5 rounded-full transition-all ${i <= step ? 'w-6 bg-brand' : 'w-1.5 bg-border'}`} />
      ))}
    </div>
  );
}

export default function BookCourt() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [club, setClub] = useState(null);
  const [dayIdx, setDayIdx] = useState(0);
  const [slot, setSlot] = useState(null);
  const [duration, setDuration] = useState(90);
  const [court, setCourt] = useState(1);
  const [done, setDone] = useState(false);

  const days = useMemo(() => nextDays(7), []);

  const { data: baseClubs = [] } = useQuery({
    queryKey: ['clubs'],
    queryFn: () => base44.entities.Club.list('name'),
  });
  const clubs = useMemo(() => enrichClubs(baseClubs), [baseClubs]);

  const basePrice = useMemo(() => {
    if (!club) return 0;
    const m = /(\d+)/.exec(club.price_range || '₪160');
    const hourly = m ? Number(m[1]) : 160;
    return duration === 90 ? Math.round(hourly * 1.4) : hourly;
  }, [club, duration]);

  const confirm = () => {
    const booking = {
      id: `bk${Date.now()}`,
      club_id: club.id,
      club_name: club.name,
      city: club.city,
      court,
      date: days[dayIdx].date.toISOString(),
      slot,
      duration_min: duration,
      price: basePrice,
    };
    try {
      const prev = JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]');
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify([booking, ...(Array.isArray(prev) ? prev : [])]));
    } catch { /* demo */ }
    setDone(true);
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.65 },
      colors: ['#C9A961', '#1B4D3E', '#F5F0E6'],
    });
  };

  // ---- success screen ----
  if (done) {
    return (
      <div dir="rtl" className="min-h-screen bg-background max-w-md mx-auto flex flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          className="w-20 h-20 rounded-full bg-brand flex items-center justify-center shadow-luxe mb-5"
        >
          <Check size={36} className="text-[hsl(var(--gold-light))]" strokeWidth={3} />
        </motion.div>
        <h1 className="font-display text-[26px] font-black">המגרש שלך!</h1>
        <p className="text-[14px] text-muted-foreground mt-2 leading-relaxed">
          {club.name} · מגרש {court}<br />
          {days[dayIdx].label} בשעה {slot} · {duration} דק׳ · ₪{basePrice}
        </p>
        <div className="text-[12.5px] text-muted-foreground mt-1.5 bg-gold-soft text-[#8a6d3b] rounded-full px-3.5 py-1.5 font-bold">
          ₪{Math.round(basePrice / 4)} לשחקן אם תמלא רביעייה
        </div>
        <div className="flex flex-col gap-2.5 w-full mt-8">
          <button onClick={() => navigate('/add-match')}
            className="w-full py-3.5 rounded-full bg-brand text-white font-bold text-[14.5px] shadow-luxe active:scale-[0.98]">
            פתח משחק על המגרש הזה
          </button>
          <button onClick={() => navigate('/calendar')}
            className="w-full py-3.5 rounded-full bg-card border border-border font-bold text-[14.5px] active:scale-[0.98]">
            ליומן שלי
          </button>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-background max-w-md mx-auto pb-36">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-5 pb-4">
        <button
          onClick={() => (step > 0 ? setStep(step - 1) : navigate(-1))}
          className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center active:scale-90"
        >
          <ArrowRight size={17} />
        </button>
        <h1 className="font-display text-[22px] font-black flex-1">הזמן מגרש</h1>
        <StepDots step={step} />
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1 — club */}
        {step === 0 && (
          <motion.div key="s0" initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 18 }} transition={spring} className="px-5">
            <div className="text-[13px] font-bold text-muted-foreground mb-3">בחר מועדון</div>
            <div className="space-y-2.5">
              {clubs.map((c) => (
                <button
                  key={c.id}
                  onClick={() => { setClub(c); setStep(1); }}
                  className={`w-full text-right bg-card border rounded-2xl p-3 flex items-center gap-3 shadow-sm active:scale-[0.98] transition-all ${
                    club?.id === c.id ? 'border-brand ring-2 ring-brand/25' : 'border-border'
                  }`}
                >
                  <img src={c.image_url} alt={c.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-[14px] truncate">{c.name}</div>
                    <div className="flex items-center gap-2.5 text-[12px] text-muted-foreground mt-0.5">
                      <span className="flex items-center gap-1"><MapPin size={11} /> {c.city}</span>
                      <span className="flex items-center gap-1"><Clock size={11} /> {c.hours}</span>
                    </div>
                  </div>
                  <span className="text-[12.5px] font-bold text-brand">{c.price_range}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 2 — when + court */}
        {step === 1 && club && (
          <motion.div key="s1" initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 18 }} transition={spring} className="px-5">
            <div className="flex items-center gap-2.5 bg-brand-softer rounded-2xl px-3.5 py-2.5 mb-4">
              <CourtIcon size={16} className="text-brand" />
              <span className="text-[13px] font-bold text-brand flex-1 truncate">{club.name}</span>
              <button onClick={() => setStep(0)} className="text-[12px] font-bold text-brand underline">שנה</button>
            </div>

            <div className="text-[13px] font-bold text-muted-foreground mb-2">יום</div>
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-5 px-5 mb-4" style={{ scrollbarWidth: 'none' }}>
              {days.map((d, i) => (
                <button
                  key={i}
                  onClick={() => { setDayIdx(i); setSlot(null); }}
                  className={`flex-shrink-0 w-14 py-2.5 rounded-2xl border flex flex-col items-center gap-0.5 transition-all active:scale-95 ${
                    dayIdx === i ? 'bg-brand text-white border-brand shadow-sm' : 'bg-card border-border'
                  }`}
                >
                  <span className="text-[11px] font-bold">{d.label}</span>
                  <span className="font-display text-[16px] font-black">{d.dayNum}</span>
                </button>
              ))}
            </div>

            <div className="text-[13px] font-bold text-muted-foreground mb-2">שעה</div>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {SLOTS.map((s) => {
                const taken = isTaken(club.id, dayIdx, s);
                return (
                  <button
                    key={s}
                    disabled={taken}
                    onClick={() => setSlot(s)}
                    className={`py-2.5 rounded-xl border text-[13px] font-bold font-display transition-all active:scale-95 ${
                      taken
                        ? 'bg-muted text-muted-foreground/50 border-transparent line-through'
                        : slot === s
                          ? 'bg-brand text-white border-brand shadow-sm'
                          : 'bg-card border-border'
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>

            <div className="text-[13px] font-bold text-muted-foreground mb-2">משך</div>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {[60, 90].map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`py-3 rounded-2xl border font-bold text-[14px] transition-all active:scale-95 ${
                    duration === d ? 'bg-brand text-white border-brand shadow-sm' : 'bg-card border-border'
                  }`}
                >
                  <span className="font-display">{d}</span> דק׳
                </button>
              ))}
            </div>

            <div className="text-[13px] font-bold text-muted-foreground mb-2">מגרש</div>
            <div className="flex gap-2 flex-wrap mb-4">
              {Array.from({ length: club.courts_count || 4 }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setCourt(n)}
                  className={`w-12 h-12 rounded-2xl border font-display text-[16px] font-black transition-all active:scale-95 ${
                    court === n ? 'bg-brand text-white border-brand shadow-sm' : 'bg-card border-border'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            <p className="text-[11.5px] text-muted-foreground">
              {club.indoor ? 'כל המגרשים מקורים' : 'מגרשי חוץ — שחקו מוקדם או בערב'}
            </p>
          </motion.div>
        )}

        {/* Step 3 — summary */}
        {step === 2 && club && (
          <motion.div key="s2" initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 18 }} transition={spring} className="px-5">
            <div className="bg-brand-gradient rounded-3xl p-5 text-white shadow-luxe">
              <div className="text-[12px] text-white/70 mb-3">סיכום ההזמנה</div>
              <div className="space-y-2.5 text-[14px]">
                <div className="flex items-center gap-2.5">
                  <CourtIcon size={16} className="text-[hsl(var(--gold-light))]" />
                  <span className="font-bold">{club.name}</span>
                  <span className="text-white/70">· מגרש {court}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CalendarDays size={16} className="text-[hsl(var(--gold-light))]" />
                  <span>{days[dayIdx].label} · {days[dayIdx].date.toLocaleDateString('he-IL', { day: 'numeric', month: 'long' })}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock size={16} className="text-[hsl(var(--gold-light))]" />
                  <span><span className="font-display font-black">{slot}</span> · {duration} דק׳</span>
                </div>
              </div>
              <div className="border-t border-white/15 mt-4 pt-4 flex items-end justify-between">
                <div>
                  <div className="text-[11.5px] text-white/70">סה״כ לתשלום</div>
                  <div className="font-display text-[30px] font-black leading-tight">₪{basePrice}</div>
                </div>
                <div className="text-[11.5px] text-white/70 text-left">
                  ₪{Math.round(basePrice / 4)} לשחקן<br />ברביעייה מלאה
                </div>
              </div>
            </div>
            <p className="text-[12px] text-muted-foreground mt-3 leading-relaxed">
              ביטול חינם עד 4 שעות לפני המשחק. לא מצליח להגיע? מכור את המגרש בשוק של Rally.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 inset-x-0 max-w-md mx-auto p-4 bg-gradient-to-t from-background via-background/95 to-transparent">
        {step === 1 && (
          <button
            onClick={() => slot && setStep(2)}
            disabled={!slot}
            className={`w-full py-3.5 rounded-full font-bold text-[15px] transition-all active:scale-[0.98] ${
              slot ? 'bg-brand text-white shadow-luxe' : 'bg-muted text-muted-foreground'
            }`}
          >
            {slot ? `המשך — ${slot} · ₪${basePrice}` : 'בחר שעה פנויה'}
          </button>
        )}
        {step === 2 && (
          <button
            onClick={confirm}
            className="w-full py-3.5 rounded-full bg-brand text-white font-bold text-[15px] shadow-luxe active:scale-[0.98]"
          >
            אשר והזמן · ₪{basePrice}
          </button>
        )}
      </div>
    </div>
  );
}
