import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, TrendingUp, TrendingDown, Trophy, Flame, Users2, Info, ChevronLeft,
} from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, ResponsiveContainer } from 'recharts';
import { RATING_PROFILE, PEER_AXES_HISTORY } from '@/data/mockData';
import Sparkline from '@/components/Sparkline';
import SkillRadar from '@/components/SkillRadar';

const spring = { type: 'spring', stiffness: 280, damping: 26 };
const enter = (i = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { ...spring, delay: i * 0.06 },
});

// Deterministic monthly game volume — last 6 months, newest last.
const MONTHLY_GAMES = [
  { month: 'ינו׳', games: 2 },
  { month: 'פבר׳', games: 4 },
  { month: 'מרץ', games: 3 },
  { month: 'אפר׳', games: 5 },
  { month: 'מאי', games: 6 },
  { month: 'יוני', games: 4 },
];

// Personal records — derived from the same demo season as RATING_PROFILE.
const RECORDS = [
  {
    icon: Flame,
    label: 'רצף נצחונות הכי ארוך',
    value: '5 משחקים',
    detail: 'מרץ–אפריל · נשבר רק מול יותם א.',
  },
  {
    icon: Trophy,
    label: 'הניצחון הכי גדול',
    value: '6-1, 6-2',
    detail: 'מול עומר ש. ודניאל כ. · Padel Up הרצליה',
  },
  {
    icon: Users2,
    label: 'שותף מנצח',
    value: 'נועה ל.',
    detail: '5 נצחונות יחד מתוך 6 משחקים משותפים',
  },
];

export default function Stats() {
  const navigate = useNavigate();
  const p = RATING_PROFILE;

  const winRate = Math.round((p.wins / (p.wins + p.losses)) * 100);
  const trend = p.rating - p.history[Math.max(0, p.history.length - 6)];
  const donutData = [
    { name: 'wins', value: p.wins },
    { name: 'losses', value: p.losses },
  ];

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
        <h1 className="font-display text-[22px] font-black flex-1">הסטטיסטיקות שלי</h1>
        <span className="text-[12px] font-bold text-muted-foreground">עונת 2026</span>
      </div>

      <div className="px-5 space-y-4">
        {/* Rating hero */}
        <motion.div {...enter(0)} className="bg-brand-gradient ring-gold rounded-3xl shadow-luxe p-5 relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: 'radial-gradient(80% 60% at 15% 0%, hsl(41 55% 70% / 0.14) 0%, transparent 60%)' }}
          />
          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[12px] text-white/60 mb-1">דירוג Rally</div>
                <div className="flex items-end gap-2">
                  <span className="font-display text-[46px] font-black leading-none text-white tabular-nums">{p.rating}</span>
                  <span className={`inline-flex items-center gap-0.5 text-[13px] font-bold mb-1.5 ${trend >= 0 ? 'text-[hsl(var(--gold-light))]' : 'text-red-300'}`}>
                    {trend >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {trend > 0 ? '+' : ''}{trend}
                  </span>
                </div>
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1 text-[12px] text-white/60 justify-end">
                  <Trophy size={12} className="text-[hsl(var(--gold))]" /> דירוג ארצי
                </div>
                <div className="font-display text-[22px] font-black text-white">#{p.rank}</div>
                <div className="text-[11px] text-white/50">מתוך {p.totalPlayers.toLocaleString('he-IL')}</div>
              </div>
            </div>

            <div className="mt-4 rounded-2xl bg-white/[0.06] border border-white/10 p-3.5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[12px] text-white/60">התקדמות הדירוג</span>
                <span className="text-[11px] text-[hsl(var(--gold-light))] font-bold">שיא: {p.peak}</span>
              </div>
              <Sparkline data={p.history} height={64} />
            </div>
          </div>
        </motion.div>

        {/* Win / loss donut */}
        <motion.div {...enter(1)} className="bg-card rounded-3xl border border-border shadow-luxe p-5">
          <div className="font-display text-[18px] font-black mb-3">מאזן נצחונות</div>
          <div className="flex items-center gap-5">
            <div className="relative w-[120px] h-[120px] flex-shrink-0" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    dataKey="value"
                    innerRadius={42}
                    outerRadius={56}
                    startAngle={90}
                    endAngle={-270}
                    paddingAngle={3}
                    stroke="none"
                    isAnimationActive={false}
                  >
                    <Cell fill="hsl(var(--brand))" />
                    <Cell fill="hsl(var(--muted))" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-[22px] font-black text-brand leading-none tabular-nums">{winRate}%</span>
                <span className="text-[10px] text-muted-foreground mt-0.5">נצחונות</span>
              </div>
            </div>
            <div className="flex-1 space-y-2.5">
              <div className="rounded-2xl bg-brand-softer px-4 py-2.5 flex items-center justify-between">
                <span className="text-[13px] font-bold text-brand">נצחונות</span>
                <span className="font-display text-[22px] font-black text-brand tabular-nums">{p.wins}</span>
              </div>
              <div className="rounded-2xl bg-bgWarm border border-border px-4 py-2.5 flex items-center justify-between">
                <span className="text-[13px] font-bold text-muted-foreground">הפסדים</span>
                <span className="font-display text-[22px] font-black text-muted-foreground tabular-nums">{p.losses}</span>
              </div>
              <div className="text-[11px] text-muted-foreground pr-1">{p.wins + p.losses} משחקים העונה</div>
            </div>
          </div>
        </motion.div>

        {/* Form strip — last 10 */}
        <motion.div {...enter(2)} className="bg-card rounded-3xl border border-border shadow-luxe p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="font-display text-[18px] font-black">הכושר האחרון</span>
            <span className="text-[11px] text-muted-foreground">10 משחקים אחרונים</span>
          </div>
          <div className="flex items-center gap-1.5" dir="ltr">
            {p.form.map((r, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ ...spring, delay: 0.2 + i * 0.04 }}
                className={`flex-1 h-9 rounded-xl flex items-center justify-center text-[13px] font-black ${
                  r === 'W' ? 'bg-brand text-white' : 'bg-muted text-muted-foreground'
                }`}
              >
                {r === 'W' ? 'נ' : 'ה'}
              </motion.span>
            ))}
          </div>
          <div className="flex items-center gap-4 text-[11px] text-muted-foreground mt-3">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-md bg-brand inline-block" /> ניצחון
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-md bg-muted inline-block" /> הפסד
            </span>
          </div>
        </motion.div>

        {/* Skill radar — peer feedback */}
        <motion.div {...enter(3)}>
          <SkillRadar
            current={PEER_AXES_HISTORY.current}
            previous={PEER_AXES_HISTORY.previous}
            ratersCount={PEER_AXES_HISTORY.raters_count}
            windowLabel={PEER_AXES_HISTORY.window_label}
          />
        </motion.div>

        {/* Monthly volume */}
        <motion.div {...enter(4)} className="bg-card rounded-3xl border border-border shadow-luxe p-5">
          <div className="flex items-center justify-between mb-1">
            <span className="font-display text-[18px] font-black">משחקים לפי חודש</span>
            <span className="text-[11px] text-muted-foreground">6 חודשים אחרונים</span>
          </div>
          <p className="text-[12px] text-muted-foreground mb-2">
            {MONTHLY_GAMES.reduce((n, m) => n + m.games, 0)} משחקים בחצי השנה האחרונה
          </p>
          <div dir="ltr" className="-mx-2">
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={MONTHLY_GAMES} barCategoryGap="28%">
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))', fontWeight: 600 }}
                />
                <Bar dataKey="games" radius={[8, 8, 8, 8]} isAnimationActive={false}>
                  {MONTHLY_GAMES.map((m, i) => (
                    <Cell
                      key={m.month}
                      fill={i === MONTHLY_GAMES.length - 1 ? 'hsl(var(--gold))' : 'hsl(var(--brand))'}
                      fillOpacity={i === MONTHLY_GAMES.length - 1 ? 1 : 0.85}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Records */}
        <motion.div {...enter(5)}>
          <div className="font-display text-[18px] font-black mb-2.5 px-1">שיאים אישיים</div>
          <div className="space-y-2.5">
            {RECORDS.map((rec, i) => {
              const Icon = rec.icon;
              return (
                <motion.div
                  key={rec.label}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...spring, delay: 0.3 + i * 0.06 }}
                  className="bg-card rounded-3xl border border-border shadow-sm p-4 flex items-center gap-3.5"
                >
                  <span className="w-11 h-11 rounded-2xl bg-gold-soft text-gold-deep flex items-center justify-center flex-shrink-0">
                    <Icon size={19} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] text-muted-foreground">{rec.label}</div>
                    <div className="font-display text-[17px] font-black leading-tight">{rec.value}</div>
                    <div className="text-[11.5px] text-muted-foreground mt-0.5 truncate">{rec.detail}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Rating transparency link */}
        <motion.button
          {...enter(6)}
          onClick={() => navigate('/rating-explained')}
          className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-brand/20 bg-brand-softer text-brand h-12 font-bold text-[14px] active:scale-[0.98] transition-transform"
        >
          <Info size={16} />
          איך הדירוג עובד?
          <ChevronLeft size={16} />
        </motion.button>
      </div>
    </div>
  );
}
