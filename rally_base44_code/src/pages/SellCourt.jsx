import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Tag, Clock, MapPin, Flame, ArrowLeftRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';
import { enrichClubs } from '@/data/clubsExtra';
import { formatMatchTime, timeUntil } from '@/lib/format';

const spring = { type: 'spring', stiffness: 280, damping: 26 };
const DAYS_HE = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
const SLOTS = ['07:00', '08:30', '10:00', '11:30', '13:00', '14:30', '16:00', '17:30', '19:00', '20:30'];

function nextDays(count = 4) {
  return Array.from({ length: count }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return { date: d, label: i === 0 ? 'היום' : i === 1 ? 'מחר' : DAYS_HE[d.getDay()], dayNum: d.getDate() };
  });
}

export default function SellCourt() {
  const navigate = useNavigate();
  const days = useMemo(() => nextDays(4), []);

  const { data: baseClubs = [] } = useQuery({
    queryKey: ['clubs'],
    queryFn: () => base44.entities.Club.list('name'),
  });
  const clubs = useMemo(() => enrichClubs(baseClubs), [baseClubs]);

  const [clubId, setClubId] = useState(null);
  const [dayIdx, setDayIdx] = useState(0);
  const [slot, setSlot] = useState(null);
  const [duration, setDuration] = useState(90);
  const [originalPrice, setOriginalPrice] = useState('180');
  const [price, setPrice] = useState('120');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const club = clubs.find((c) => c.id === clubId);

  const startISO = useMemo(() => {
    if (!slot) return null;
    const [h, m] = slot.split(':').map(Number);
    const d = new Date(days[dayIdx].date);
    d.setHours(h, m, 0, 0);
    return d.toISOString();
  }, [days, dayIdx, slot]);

  const discount = useMemo(() => {
    const orig = Number(originalPrice), ask = Number(price);
    if (!orig || !ask || ask >= orig) return 0;
    return Math.round((1 - ask / orig) * 100);
  }, [originalPrice, price]);

  const isUrgent = startISO ? (new Date(startISO) - Date.now()) / 3600000 < 6 : false;
  const valid = club && slot && Number(price) > 0 && Number(originalPrice) > 0;

  const submit = async () => {
    if (!valid || submitting) return;
    setSubmitting(true);
    try {
      await base44.entities.CourtListing.create({
        type: 'transfer',
        urgent: isUrgent,
        club_name: club.name,
        city: club.city,
        court_label: `מגרש 3 · ${club.indoor ? 'מקורה' : 'חוץ'}`,
        start_time: startISO,
        duration_min: duration,
        original_price: Number(originalPrice),
        price: Number(price),
        note: note.trim() || undefined,
        seller: null,
        image_url: club.image_url,
      });
      toast.success('המגרש פורסם בשוק!', { description: 'נודיע לך ברגע שמישהו יתפוס אותו' });
      navigate('/market');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-background max-w-md mx-auto pb-36">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-5 pb-2">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center active:scale-90">
          <ArrowRight size={17} />
        </button>
        <div className="flex-1">
          <h1 className="font-display text-[22px] font-black leading-tight">מכור מגרש</h1>
          <p className="text-[12px] text-muted-foreground">לא מגיע? אל תפסיד את הכסף — תן למישהו אחר לשחק</p>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={spring} className="px-5 mt-3">
        {/* Club */}
        <div className="text-[13px] font-bold text-muted-foreground mb-2">איפה המגרש שלך?</div>
        <div className="flex gap-2.5 overflow-x-auto pb-1 -mx-5 px-5 mb-4" style={{ scrollbarWidth: 'none' }}>
          {clubs.map((c) => (
            <button
              key={c.id}
              onClick={() => setClubId(c.id)}
              className={`flex-shrink-0 px-3.5 py-2.5 rounded-2xl border text-[12.5px] font-bold transition-all active:scale-95 ${
                clubId === c.id ? 'bg-brand text-white border-brand shadow-sm' : 'bg-card border-border'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Day + time */}
        <div className="text-[13px] font-bold text-muted-foreground mb-2">מתי המשחק?</div>
        <div className="flex gap-2 mb-2.5">
          {days.map((d, i) => (
            <button
              key={i}
              onClick={() => setDayIdx(i)}
              className={`flex-1 py-2.5 rounded-2xl border flex flex-col items-center gap-0.5 transition-all active:scale-95 ${
                dayIdx === i ? 'bg-brand text-white border-brand shadow-sm' : 'bg-card border-border'
              }`}
            >
              <span className="text-[11px] font-bold">{d.label}</span>
              <span className="font-display text-[15px] font-black">{d.dayNum}</span>
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {SLOTS.map((s) => (
            <button
              key={s}
              onClick={() => setSlot(s)}
              className={`px-3 py-2 rounded-xl border text-[12.5px] font-bold font-display transition-all active:scale-95 ${
                slot === s ? 'bg-brand text-white border-brand shadow-sm' : 'bg-card border-border'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Duration */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {[60, 90].map((d) => (
            <button
              key={d}
              onClick={() => setDuration(d)}
              className={`py-2.5 rounded-2xl border font-bold text-[13.5px] transition-all active:scale-95 ${
                duration === d ? 'bg-brand text-white border-brand shadow-sm' : 'bg-card border-border'
              }`}
            >
              <span className="font-display">{d}</span> דק׳
            </button>
          ))}
        </div>

        {/* Prices */}
        <div className="grid grid-cols-2 gap-2.5 mb-2">
          <div>
            <div className="text-[12.5px] font-bold text-muted-foreground mb-1.5">שילמת (₪)</div>
            <input
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value.replace(/\D/g, ''))}
              inputMode="numeric"
              className="w-full rounded-2xl border border-border bg-card px-4 h-12 text-[16px] font-display font-black outline-none focus:border-brand"
            />
          </div>
          <div>
            <div className="text-[12.5px] font-bold text-muted-foreground mb-1.5">מבקש (₪)</div>
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value.replace(/\D/g, ''))}
              inputMode="numeric"
              className="w-full rounded-2xl border border-border bg-card px-4 h-12 text-[16px] font-display font-black outline-none focus:border-brand"
            />
          </div>
        </div>

        {/* Live badges */}
        <div className="flex items-center gap-2 mb-4 min-h-[28px]">
          {discount > 0 && (
            <span className={`inline-flex items-center gap-1 rounded-full text-[11.5px] font-bold px-2.5 py-1 ${
              discount >= 25 ? 'bg-gradient-to-l from-[hsl(var(--gold-deep))] to-[hsl(var(--gold))] text-white shadow-gold' : 'bg-gold-soft text-[#8a6d3b]'
            }`}>
              <Tag size={11} /> הנחה של {discount}% — ייתפס מהר
            </span>
          )}
          {isUrgent && (
            <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 text-destructive text-[11.5px] font-bold px-2.5 py-1">
              <Flame size={11} /> דחוף — מתחיל בקרוב
            </span>
          )}
        </div>

        {/* Note */}
        <div className="text-[13px] font-bold text-muted-foreground mb-1.5">הערה לקונה (לא חובה)</div>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          placeholder="למשל: יש חניה חינם, המגרש החדש שליד הכניסה..."
          className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-[13.5px] outline-none focus:border-brand resize-none mb-5"
        />

        {/* Preview — exactly how it will look in the market */}
        {club && slot && (
          <div className="mb-2">
            <div className="text-[13px] font-bold text-muted-foreground mb-2">ככה זה ייראה בשוק</div>
            <div className="bg-card rounded-3xl overflow-hidden border border-border shadow-luxe opacity-95">
              <div className="relative h-24">
                <img src={club.image_url} alt={club.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute top-2.5 right-2.5 flex gap-1.5">
                  {isUrgent && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-destructive text-white text-[10.5px] font-bold px-2 py-0.5">
                      <Flame size={10} /> {timeUntil(startISO)}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 rounded-full bg-black/35 backdrop-blur-sm text-white text-[10.5px] font-bold px-2 py-0.5">
                    <ArrowLeftRight size={10} /> העברה
                  </span>
                </div>
                <div className="absolute bottom-2 right-3.5 left-3.5 text-white">
                  <div className="font-bold text-[14px] leading-tight">{club.name}</div>
                  <div className="text-[11px] text-white/80 flex items-center gap-1">
                    <MapPin size={10} /> {club.city} · מגרש 3
                  </div>
                </div>
              </div>
              <div className="p-3 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-[11.5px] text-muted-foreground">
                    <Clock size={11} /> {formatMatchTime(startISO)} · {duration} דק׳
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-display text-[19px] font-black text-brand">₪{price || '—'}</span>
                    {discount > 0 && (
                      <>
                        <span className="text-[12px] text-muted-foreground line-through">₪{originalPrice}</span>
                        <span className="rounded-md bg-gold-soft text-[#8a6d3b] text-[10.5px] font-bold px-1.5 py-0.5">-{discount}%</span>
                      </>
                    )}
                  </div>
                </div>
                <span className="bg-brand text-white px-4 py-2 rounded-full font-bold text-[12.5px]">תפוס מקום</span>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Sticky submit */}
      <div className="fixed bottom-0 inset-x-0 max-w-md mx-auto p-4 bg-gradient-to-t from-background via-background/95 to-transparent">
        <button
          onClick={submit}
          disabled={!valid || submitting}
          className={`w-full py-3.5 rounded-full font-bold text-[15px] transition-all active:scale-[0.98] ${
            valid ? 'bg-brand text-white shadow-luxe' : 'bg-muted text-muted-foreground'
          }`}
        >
          {submitting ? 'מפרסם...' : valid ? 'פרסם בשוק' : 'בחר מועדון ושעה'}
        </button>
      </div>
    </div>
  );
}
