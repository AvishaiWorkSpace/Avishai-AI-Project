import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Users, Banknote, Check } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';
import LevelTag from '@/components/LevelTag';
import { CourtIcon, BallIcon } from '@/components/icons';

const DAYS_HE = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
const TIME_SLOTS = ['07:00', '08:30', '10:00', '11:30', '13:00', '14:30', '16:00', '17:30', '19:00', '20:30', '22:00'];
const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const spring = { type: 'spring', stiffness: 280, damping: 26 };

function nextDays(count = 7) {
  return Array.from({ length: count }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      date: d,
      label: i === 0 ? 'היום' : i === 1 ? 'מחר' : DAYS_HE[d.getDay()],
      dayNum: d.getDate(),
    };
  });
}

function Section({ title, children }) {
  return (
    <div className="mb-5">
      <div className="text-[13px] font-bold text-muted-foreground mb-2">{title}</div>
      {children}
    </div>
  );
}

function Chip({ active, onClick, children, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`px-3.5 py-2 rounded-full text-[13px] font-bold border transition-all active:scale-95 ${
        active
          ? 'bg-brand text-white border-brand shadow-sm'
          : 'bg-card text-foreground border-border'
      } ${className}`}
    >
      {children}
    </button>
  );
}

export default function AddMatch() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('rally_user') || '{}');
  const days = useMemo(() => nextDays(7), []);

  const { data: clubs = [] } = useQuery({
    queryKey: ['clubs'],
    queryFn: () => base44.entities.Club.list('name'),
  });

  const [clubId, setClubId] = useState(null);
  const [dayIdx, setDayIdx] = useState(0);
  const [time, setTime] = useState(null);
  const [duration, setDuration] = useState(90);
  const [level, setLevel] = useState(user.level || 'B2');
  const [matchType, setMatchType] = useState('תחרותי');
  const [gender, setGender] = useState('mixed');
  const [price, setPrice] = useState('45');
  const [submitting, setSubmitting] = useState(false);

  const club = clubs.find((c) => c.id === clubId);
  const valid = club && time && Number(price) > 0;

  const startISO = useMemo(() => {
    if (!time) return null;
    const [h, m] = time.split(':').map(Number);
    const d = new Date(days[dayIdx].date);
    d.setHours(h, m, 0, 0);
    return d.toISOString();
  }, [days, dayIdx, time]);

  const submit = async () => {
    if (!valid || submitting) return;
    setSubmitting(true);
    try {
      const row = await base44.entities.Match.create({
        status: 'open',
        club_id: club.id,
        club_name: club.name,
        club_image: club.image_url,
        city: club.city,
        level,
        start_time: startISO,
        duration_min: duration,
        price_per_player: Number(price),
        players: [],
        max_players: 4,
        gender,
        court_type: club.indoor ? 'מקורה' : 'חוץ',
        match_type: matchType,
        drive_minutes: 15,
        host_id: 'me', // you manage this match — join requests come to you
      });
      toast.success('המשחק פורסם!', { description: 'בקשות הצטרפות של שחקנים יגיעו אליך לאישור' });
      navigate(`/match/${row.id}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-background max-w-md mx-auto pb-36">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-5 pb-4">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center active:scale-90">
          <ArrowRight size={17} />
        </button>
        <h1 className="font-display text-[22px] font-black flex-1">פתח משחק</h1>
      </div>

      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={spring} className="px-5">
        {/* Club picker */}
        <Section title="איפה משחקים?">
          <div className="flex gap-3 overflow-x-auto pb-1 -mx-5 px-5" style={{ scrollbarWidth: 'none' }}>
            {clubs.map((c) => (
              <button
                key={c.id}
                onClick={() => setClubId(c.id)}
                className={`flex-shrink-0 w-[150px] rounded-2xl overflow-hidden border text-right transition-all active:scale-95 ${
                  clubId === c.id ? 'border-brand ring-2 ring-brand/30 shadow-md' : 'border-border'
                }`}
              >
                <div className="relative h-20">
                  <img src={c.image_url} alt={c.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  {clubId === c.id && (
                    <span className="absolute top-2 left-2 w-5 h-5 rounded-full bg-brand flex items-center justify-center">
                      <Check size={12} className="text-white" strokeWidth={3} />
                    </span>
                  )}
                  <div className="absolute bottom-1.5 right-2 left-2 text-white">
                    <div className="text-[12px] font-bold leading-tight truncate">{c.name}</div>
                    <div className="text-[10px] text-white/75">{c.city}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Section>

        {/* Day */}
        <Section title="מתי?">
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-5 px-5" style={{ scrollbarWidth: 'none' }}>
            {days.map((d, i) => (
              <button
                key={i}
                onClick={() => setDayIdx(i)}
                className={`flex-shrink-0 w-14 py-2.5 rounded-2xl border flex flex-col items-center gap-0.5 transition-all active:scale-95 ${
                  dayIdx === i ? 'bg-brand text-white border-brand shadow-sm' : 'bg-card border-border'
                }`}
              >
                <span className="text-[11px] font-bold">{d.label}</span>
                <span className={`font-display text-[16px] font-black ${dayIdx === i ? 'text-white' : 'text-foreground'}`}>{d.dayNum}</span>
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {TIME_SLOTS.map((t) => (
              <Chip key={t} active={time === t} onClick={() => setTime(t)}>
                <span className="font-display">{t}</span>
              </Chip>
            ))}
          </div>
        </Section>

        {/* Duration */}
        <Section title="משך המשחק">
          <div className="grid grid-cols-2 gap-2">
            {[60, 90].map((d) => (
              <button
                key={d}
                onClick={() => setDuration(d)}
                className={`py-3 rounded-2xl border font-bold text-[14px] flex items-center justify-center gap-2 transition-all active:scale-95 ${
                  duration === d ? 'bg-brand text-white border-brand shadow-sm' : 'bg-card border-border'
                }`}
              >
                <Clock size={15} strokeWidth={2} />
                <span className="font-display">{d}</span> דק׳
              </button>
            ))}
          </div>
        </Section>

        {/* Level */}
        <Section title="רמת המשחק">
          <div className="flex flex-wrap gap-2">
            {LEVELS.map((l) => (
              <button
                key={l}
                onClick={() => setLevel(l)}
                className={`rounded-full transition-all active:scale-95 ${level === l ? 'ring-2 ring-brand/50 ring-offset-2 ring-offset-background' : 'opacity-60'}`}
              >
                <LevelTag level={l} size="md" />
              </button>
            ))}
          </div>
        </Section>

        {/* Type + gender */}
        <Section title="אופי המשחק">
          <div className="flex gap-2 mb-2">
            {['תחרותי', 'ידידותי'].map((t) => (
              <Chip key={t} active={matchType === t} onClick={() => setMatchType(t)} className="flex-1">{t}</Chip>
            ))}
          </div>
          <div className="flex gap-2">
            {[['mixed', 'מעורב'], ['men', 'גברים'], ['women', 'נשים']].map(([v, label]) => (
              <Chip key={v} active={gender === v} onClick={() => setGender(v)} className="flex-1">{label}</Chip>
            ))}
          </div>
        </Section>

        {/* Price */}
        <Section title="מחיר לשחקן">
          <div className="flex items-center gap-3 bg-card border border-border rounded-2xl px-4 py-3">
            <Banknote size={18} className="text-brand" strokeWidth={1.8} />
            <span className="text-[15px] font-bold">₪</span>
            <input
              type="number"
              inputMode="numeric"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="flex-1 bg-transparent outline-none font-display text-[18px] font-black"
              placeholder="45"
            />
            <span className="text-[12px] text-muted-foreground">לשחקן · {duration} דק׳</span>
          </div>
        </Section>

        {/* Live summary */}
        <div className="bg-brand-gradient rounded-3xl p-4 text-white shadow-luxe mb-4">
          <div className="text-[12px] text-white/70 mb-1.5">סיכום המשחק</div>
          <div className="flex items-center gap-2 mb-1">
            <CourtIcon size={16} className="text-[hsl(var(--gold-light))]" />
            <span className="font-bold text-[14px]">{club ? club.name : 'בחר מועדון'}</span>
          </div>
          <div className="flex items-center gap-2 text-[13px] text-white/85">
            <BallIcon size={15} className="text-[hsl(var(--gold-light))]" />
            <span>
              {days[dayIdx].label} {time ? `· ${time}` : ''} · {duration} דק׳ · רמה {level}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[13px] text-white/85 mt-1">
            <Users size={15} className="text-[hsl(var(--gold-light))]" />
            <span>3 מקומות פתוחים · ₪{price || '—'} לשחקן</span>
          </div>
        </div>
      </motion.div>

      {/* Sticky submit */}
      <div className="fixed bottom-0 inset-x-0 max-w-md mx-auto p-4 bg-gradient-to-t from-background via-background/95 to-transparent">
        <button
          onClick={submit}
          disabled={!valid || submitting}
          className={`w-full h-14 rounded-full font-bold text-[16px] transition-all active:scale-[0.98] ${
            valid
              ? 'bg-brand text-white shadow-luxe'
              : 'bg-muted text-muted-foreground'
          }`}
        >
          {submitting ? 'מפרסם...' : valid ? 'פרסם משחק' : 'בחר מועדון ושעה'}
        </button>
      </div>
    </div>
  );
}
