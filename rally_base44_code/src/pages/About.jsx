import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Eye, Handshake, Gauge } from 'lucide-react';
import RallyLogo from '@/components/RallyLogo';
import { LevelUpIcon, SearchIcon, TagIcon } from '@/components/icons';

const spring = { type: 'spring', stiffness: 280, damping: 26 };
const enter = (i = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { ...spring, delay: i * 0.06 },
});

const FEATURES = [
  {
    icon: LevelUpIcon,
    title: 'שפת רמות אחידה',
    body: 'מ-A1 ועד מתחיל — רמה אחת ברורה שכל מועדון בארץ מדבר בה. בלי ניחושים, בלי משחקים לא מאוזנים.',
  },
  {
    icon: SearchIcon,
    title: 'מצא משחק בכל רמה',
    body: 'משחקים פתוחים סביבך, מסוננים לפי הרמה שלך. נשאר מקום רביעי? הוא מתמלא תוך דקות.',
  },
  {
    icon: TagIcon,
    title: 'שוק המגרשים',
    body: 'לא מגיע למגרש ששילמת עליו? מכור אותו לשחקן אחר בלחיצה — אף שעת מגרש לא מתבזבזת.',
  },
];

const VALUES = [
  { icon: Eye, label: 'שקיפות', body: 'הדירוג מוסבר עד הנוסחה' },
  { icon: Handshake, label: 'קהילה', body: 'שחקנים מדרגים שחקנים' },
  { icon: Gauge, label: 'רמה', body: 'משחקים מאוזנים תמיד' },
];

const STATS = [
  { value: '1,840', label: 'שחקנים' },
  { value: '12', label: 'מועדונים' },
  { value: '300+', label: 'משחקים בחודש' },
];

export default function About() {
  const navigate = useNavigate();

  return (
    <div dir="rtl" className="min-h-screen bg-background max-w-md mx-auto pb-10">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-5 pb-4">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center active:scale-90"
        >
          <ArrowRight size={17} />
        </button>
        <h1 className="font-display text-[22px] font-black flex-1">על Rally</h1>
      </div>

      <div className="px-5 space-y-4">
        {/* Brand hero */}
        <motion.div {...enter(0)} className="bg-brand-gradient ring-gold rounded-3xl shadow-luxe px-5 pt-9 pb-8 relative overflow-hidden text-center">
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: 'radial-gradient(80% 60% at 50% 0%, hsl(41 55% 70% / 0.16) 0%, transparent 60%)' }}
          />
          <div className="relative z-10 text-white">
            <RallyLogo mark={70} text={24} />
            <p className="font-display text-[20px] font-bold text-[hsl(var(--gold-light))] mt-5">
              שחק. תתחבר. תשתפר.
            </p>
          </div>
        </motion.div>

        {/* Mission */}
        <motion.div {...enter(1)} className="bg-card rounded-3xl border border-border shadow-luxe p-5">
          <div className="font-display text-[18px] font-black mb-2">למה Rally קיימת</div>
          <p className="text-[13.5px] leading-relaxed text-muted-foreground">
            Rally מאחדת את קהילת הפאדל הישראלית סביב שלושה דברים פשוטים:
            {' '}<b className="text-foreground">שפת רמות אחידה</b> שכולם מבינים,
            {' '}<b className="text-foreground">משחקים פתוחים</b> שמתמלאים מהר ונשארים מאוזנים,
            {' '}<b className="text-foreground">ומגרשים שלא מתבזבזים</b> — כי כל שעת מגרש פנויה
            היא משחק שמחכה לקרות. בנינו מקום אחד שבו השחקן, המועדון והקהילה מנצחים יחד.
          </p>
        </motion.div>

        {/* Feature cards */}
        <div className="space-y-2.5">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                {...enter(2 + i)}
                className="bg-card rounded-3xl border border-border shadow-sm p-4 flex items-start gap-3.5"
              >
                <span className="w-11 h-11 rounded-2xl bg-brand-softer text-brand flex items-center justify-center flex-shrink-0">
                  <Icon size={22} strokeWidth={1.7} />
                </span>
                <div className="flex-1">
                  <div className="font-bold text-[14px]">{f.title}</div>
                  <p className="text-[12.5px] text-muted-foreground leading-relaxed mt-0.5">{f.body}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Values strip */}
        <motion.div {...enter(5)} className="grid grid-cols-3 gap-2.5">
          {VALUES.map(v => {
            const Icon = v.icon;
            return (
              <div key={v.label} className="bg-card rounded-3xl border border-border shadow-sm px-3 py-4 text-center">
                <span className="w-9 h-9 rounded-full bg-gold-soft text-gold-deep inline-flex items-center justify-center mb-2">
                  <Icon size={16} />
                </span>
                <div className="font-display text-[14px] font-black">{v.label}</div>
                <div className="text-[10.5px] text-muted-foreground leading-tight mt-1">{v.body}</div>
              </div>
            );
          })}
        </motion.div>

        {/* Stats band */}
        <motion.div {...enter(6)} className="bg-brand-gradient ring-gold rounded-3xl shadow-luxe p-5 relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: 'radial-gradient(80% 60% at 85% 0%, hsl(41 55% 70% / 0.12) 0%, transparent 60%)' }}
          />
          <div className="relative z-10 grid grid-cols-3 divide-x divide-x-reverse divide-white/10">
            {STATS.map(s => (
              <div key={s.label} className="text-center px-2">
                <div className="font-display text-[24px] font-black text-white tabular-nums leading-none">{s.value}</div>
                <div className="text-[11px] text-[hsl(var(--gold-light))] font-semibold mt-1.5">{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Version footer */}
        <motion.div {...enter(7)} className="text-center pt-2">
          <span className="text-[11.5px] text-muted-foreground">Rally v1.0 · נבנה באהבה בישראל</span>
        </motion.div>
      </div>
    </div>
  );
}
