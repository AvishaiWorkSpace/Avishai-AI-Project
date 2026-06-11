import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Wrench, Banknote, Clock3, Trophy, Users, Plus, Check } from 'lucide-react';
import { toast } from 'sonner';
import { DEMO_CLUB, DEFAULT_PRICING, DEFAULT_HOURS, STAFF } from '@/data/b2bClub';
import { CourtIcon } from '@/components/icons';

const spring = { type: 'spring', stiffness: 280, damping: 26 };
const ADMIN_KEY = 'rally_club_admin';

function readState() {
  try {
    const v = JSON.parse(localStorage.getItem(ADMIN_KEY) || 'null');
    if (v && typeof v === 'object') return v;
  } catch { /* corrupt — reset below */ }
  return {
    courtsActive: Array.from({ length: DEMO_CLUB.courts_count }, () => true),
    pricing: DEFAULT_PRICING,
    hours: DEFAULT_HOURS,
  };
}

function Section({ Icon, title, children, delay = 0, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...spring, delay }}
      className="bg-card border border-border rounded-3xl p-4 shadow-sm"
    >
      <div className="flex items-center gap-2.5 mb-3.5">
        <span className="w-8 h-8 rounded-xl bg-brand-softer text-brand flex items-center justify-center">
          <Icon size={16} strokeWidth={1.9} />
        </span>
        <span className="font-bold text-[14.5px] flex-1">{title}</span>
        {action}
      </div>
      {children}
    </motion.div>
  );
}

function Toggle({ on, onChange }) {
  return (
    <button
      onClick={onChange}
      className={`relative w-11 h-6.5 h-[26px] rounded-full transition-colors flex-shrink-0 ${on ? 'bg-brand' : 'bg-muted'}`}
      role="switch"
      aria-checked={on}
    >
      <span className={`absolute top-0.5 w-[22px] h-[22px] rounded-full bg-white shadow-sm transition-all ${on ? 'right-0.5' : 'right-[22px]'}`} />
    </button>
  );
}

export default function ClubAdmin() {
  const navigate = useNavigate();
  const [state, setState] = useState(readState);
  const [tournamentName, setTournamentName] = useState('');
  const [tournamentDate, setTournamentDate] = useState('');

  useEffect(() => {
    try { localStorage.setItem(ADMIN_KEY, JSON.stringify(state)); } catch { /* demo */ }
  }, [state]);

  const toggleCourt = (i) => {
    setState((s) => {
      const next = [...s.courtsActive];
      next[i] = !next[i];
      if (!next[i]) toast(`מגרש ${i + 1} הועבר לתחזוקה`, { description: 'לא יוצגו עליו הזמנות חדשות' });
      return { ...s, courtsActive: next };
    });
  };

  const setPrice = (tier, dur, value) => {
    setState((s) => ({
      ...s,
      pricing: { ...s.pricing, [tier]: { ...s.pricing[tier], [dur]: Number(value) || 0 } },
    }));
  };

  const setHour = (id, field, value) => {
    setState((s) => ({
      ...s,
      hours: s.hours.map((h) => (h.id === id ? { ...h, [field]: value } : h)),
    }));
  };

  const createTournament = () => {
    if (!tournamentName.trim()) return;
    toast.success(`הטורניר "${tournamentName.trim()}" נוצר`, { description: 'יופיע למשתמשים אחרי אישור Rally' });
    setTournamentName('');
    setTournamentDate('');
  };

  return (
    <div dir="rtl" className="min-h-screen bg-background max-w-md mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-5 pb-4">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center active:scale-90">
          <ArrowRight size={17} />
        </button>
        <div className="flex-1">
          <h1 className="font-display text-[22px] font-black leading-tight">ניהול מועדון</h1>
          <p className="text-[12px] text-muted-foreground">{DEMO_CLUB.name}</p>
        </div>
      </div>

      <div className="px-5 space-y-3.5">
        {/* Courts */}
        <Section Icon={CourtIcon} title="מגרשים">
          <div className="space-y-2.5">
            {state.courtsActive.map((active, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className={`w-9 h-9 rounded-xl flex items-center justify-center font-display text-[14px] font-black ${
                  active ? 'bg-brand-softer text-brand' : 'bg-muted text-muted-foreground'
                }`}>
                  {i + 1}
                </span>
                <div className="flex-1">
                  <div className="text-[13.5px] font-bold">מגרש {i + 1}</div>
                  <div className={`text-[11px] flex items-center gap-1 ${active ? 'text-muted-foreground' : 'text-[#8a6d3b]'}`}>
                    {active ? 'פעיל ומקבל הזמנות' : (<><Wrench size={10} /> בתחזוקה</>)}
                  </div>
                </div>
                <Toggle on={active} onChange={() => toggleCourt(i)} />
              </div>
            ))}
          </div>
        </Section>

        {/* Pricing */}
        <Section Icon={Banknote} title="מחירון" delay={0.05}
          action={<button onClick={() => toast.success('המחירון נשמר')} className="text-[12px] font-bold text-brand flex items-center gap-1"><Check size={13} /> שמור</button>}>
          <div className="grid grid-cols-3 gap-2 text-center text-[11.5px] font-bold text-muted-foreground mb-1.5">
            <span />
            <span>60 דק׳</span>
            <span>90 דק׳</span>
          </div>
          {[['peak', 'שעות שיא (17:00+)'], ['off', 'שעות רגילות']].map(([tier, label]) => (
            <div key={tier} className="grid grid-cols-3 gap-2 items-center mb-2">
              <span className="text-[12px] font-bold">{label}</span>
              {[60, 90].map((dur) => (
                <div key={dur} className="flex items-center bg-bgWarm rounded-xl px-2.5 h-10">
                  <span className="text-[12px] text-muted-foreground">₪</span>
                  <input
                    value={state.pricing[tier][dur]}
                    onChange={(e) => setPrice(tier, dur, e.target.value.replace(/\D/g, ''))}
                    inputMode="numeric"
                    className="w-full bg-transparent outline-none text-center font-display text-[14px] font-black"
                  />
                </div>
              ))}
            </div>
          ))}
        </Section>

        {/* Hours */}
        <Section Icon={Clock3} title="שעות פתיחה" delay={0.1}>
          <div className="space-y-2">
            {state.hours.map((h) => (
              <div key={h.id} className="flex items-center gap-2">
                <span className="text-[12.5px] font-bold w-12 flex-shrink-0">{h.label}</span>
                <input
                  value={h.open}
                  onChange={(e) => setHour(h.id, 'open', e.target.value)}
                  className="flex-1 bg-bgWarm rounded-xl h-10 text-center font-display text-[13px] font-black outline-none"
                />
                <span className="text-muted-foreground text-[12px]">עד</span>
                <input
                  value={h.close}
                  onChange={(e) => setHour(h.id, 'close', e.target.value)}
                  className="flex-1 bg-bgWarm rounded-xl h-10 text-center font-display text-[13px] font-black outline-none"
                />
              </div>
            ))}
          </div>
        </Section>

        {/* Tournament quick-create */}
        <Section Icon={Trophy} title="צור טורניר" delay={0.15}>
          <div className="space-y-2.5">
            <input
              value={tournamentName}
              onChange={(e) => setTournamentName(e.target.value)}
              placeholder="שם הטורניר — למשל ״ליגת קיץ 2026״"
              className="w-full bg-bgWarm rounded-xl px-3.5 py-2.5 text-[13.5px] outline-none border border-transparent focus:border-brand/40"
            />
            <input
              value={tournamentDate}
              onChange={(e) => setTournamentDate(e.target.value)}
              placeholder="תאריך (למשל 15.7)"
              className="w-full bg-bgWarm rounded-xl px-3.5 py-2.5 text-[13.5px] outline-none border border-transparent focus:border-brand/40"
            />
            <button
              onClick={createTournament}
              disabled={!tournamentName.trim()}
              className={`w-full py-2.5 rounded-full text-[13.5px] font-bold transition-all active:scale-[0.98] ${
                tournamentName.trim() ? 'bg-brand text-white' : 'bg-muted text-muted-foreground'
              }`}
            >
              צור טורניר
            </button>
          </div>
        </Section>

        {/* Staff */}
        <Section Icon={Users} title="צוות" delay={0.2}
          action={
            <button onClick={() => toast('הזמנת איש צוות תישלח ב-SMS')} className="text-[12px] font-bold text-brand flex items-center gap-1">
              <Plus size={13} strokeWidth={2.5} /> הוסף
            </button>
          }>
          <div className="space-y-2.5">
            {STAFF.map((s) => (
              <div key={s.id} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-brand-soft text-brand font-bold text-[12px] flex items-center justify-center">
                  {s.name.split(' ').map((w) => w[0]).join('')}
                </div>
                <span className="text-[13.5px] font-bold flex-1">{s.name}</span>
                <span className="text-[11px] font-bold bg-bgWarm rounded-full px-2.5 py-1 text-muted-foreground">{s.role}</span>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}
