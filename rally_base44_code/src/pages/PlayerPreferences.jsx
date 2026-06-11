import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Hand, Compass, Swords, Clock3, MapPin, Users } from 'lucide-react';
import { toast } from 'sonner';

const spring = { type: 'spring', stiffness: 280, damping: 26 };

function Section({ Icon, title, children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...spring, delay }}
      className="bg-card border border-border rounded-3xl p-4 shadow-sm"
    >
      <div className="flex items-center gap-2.5 mb-3">
        <span className="w-8 h-8 rounded-xl bg-brand-softer text-brand flex items-center justify-center">
          <Icon size={16} strokeWidth={1.9} />
        </span>
        <span className="font-bold text-[14.5px]">{title}</span>
      </div>
      {children}
    </motion.div>
  );
}

function ChipRow({ options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`px-3.5 py-2 rounded-full text-[13px] font-bold border transition-all active:scale-95 ${
            value === opt ? 'bg-brand text-white border-brand shadow-sm' : 'bg-bgWarm border-transparent'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function MultiChipRow({ options, values, onToggle }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = values.includes(opt);
        return (
          <button
            key={opt}
            onClick={() => onToggle(opt)}
            className={`px-3.5 py-2 rounded-full text-[13px] font-bold border transition-all active:scale-95 ${
              active ? 'bg-brand text-white border-brand shadow-sm' : 'bg-bgWarm border-transparent'
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

export default function PlayerPreferences() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('rally_user') || '{}');

  const [hand, setHand] = useState(user.preferred_hand || 'ימין');
  const [side, setSide] = useState(user.court_side || 'גמיש');
  const [matchType, setMatchType] = useState(user.preferred_match_type || 'הכל');
  const [times, setTimes] = useState(user.preferred_times || ['ערב']);
  const [radius, setRadius] = useState(user.travel_radius || 20);
  const [genderPref, setGenderPref] = useState(user.gender_pref || 'לא משנה');

  const toggleTime = (t) =>
    setTimes((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  const save = () => {
    const next = {
      ...user,
      preferred_hand: hand,
      court_side: side,
      preferred_match_type: matchType,
      preferred_times: times,
      travel_radius: radius,
      gender_pref: genderPref,
    };
    try { localStorage.setItem('rally_user', JSON.stringify(next)); } catch { /* demo */ }
    toast.success('ההעדפות נשמרו', { description: 'ההמלצות שלך יותאמו בהתאם' });
    navigate(-1);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-background max-w-md mx-auto pb-32">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-5 pb-4">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center active:scale-90">
          <ArrowRight size={17} />
        </button>
        <div className="flex-1">
          <h1 className="font-display text-[22px] font-black leading-tight">העדפות שחקן</h1>
          <p className="text-[12px] text-muted-foreground">משפיעות על ההתאמות במשחק מהיר ובהמלצות</p>
        </div>
      </div>

      <div className="px-5 space-y-3.5">
        <Section Icon={Hand} title="יד דומיננטית">
          <ChipRow options={['ימין', 'שמאל']} value={hand} onChange={setHand} />
        </Section>

        <Section Icon={Compass} title="צד מגרש מועדף" delay={0.04}>
          <ChipRow options={['ימין', 'שמאל', 'גמיש']} value={side} onChange={setSide} />
          <p className="text-[11.5px] text-muted-foreground mt-2.5">
            שחקני צד שמאל נחשקים במיוחד — רוב השחקנים מעדיפים ימין
          </p>
        </Section>

        <Section Icon={Swords} title="סוג משחק מועדף" delay={0.08}>
          <ChipRow options={['תחרותי', 'ידידותי', 'הכל']} value={matchType} onChange={setMatchType} />
        </Section>

        <Section Icon={Clock3} title="זמנים מועדפים" delay={0.12}>
          <MultiChipRow options={['בוקר', 'צהריים', 'ערב', 'סופ״ש']} values={times} onToggle={toggleTime} />
        </Section>

        <Section Icon={MapPin} title="מרחק נסיעה" delay={0.16}>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={5}
              max={50}
              step={5}
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="flex-1 accent-[hsl(var(--brand))]"
            />
            <span className="font-display text-[16px] font-black w-16 text-left">
              {radius} <span className="text-[11px] font-bold text-muted-foreground">ק״מ</span>
            </span>
          </div>
        </Section>

        <Section Icon={Users} title="הרכב מועדף" delay={0.2}>
          <ChipRow options={['מעורב', 'גברים', 'נשים', 'לא משנה']} value={genderPref} onChange={setGenderPref} />
        </Section>
      </div>

      {/* Sticky save */}
      <div className="fixed bottom-0 inset-x-0 max-w-md mx-auto p-4 bg-gradient-to-t from-background via-background/95 to-transparent">
        <button
          onClick={save}
          className="w-full py-3.5 rounded-full bg-brand text-white font-bold text-[15px] shadow-luxe active:scale-[0.98] transition-transform"
        >
          שמור העדפות
        </button>
      </div>
    </div>
  );
}
