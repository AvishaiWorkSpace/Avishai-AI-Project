import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, TrendingDown, Settings, BadgeCheck, Tag } from 'lucide-react';
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';
import {
  DEMO_CLUB, CLUB_KPIS, OCCUPANCY_BY_HOUR, REVENUE_14D, COURTS_STATUS, UPCOMING_BOOKINGS,
} from '@/data/b2bClub';

const spring = { type: 'spring', stiffness: 280, damping: 26 };

const STATUS_META = {
  occupied: { label: 'תפוס', cls: 'bg-brand text-white' },
  free: { label: 'פנוי', cls: 'bg-gold-soft text-[#8a6d3b]' },
  maintenance: { label: 'תחזוקה', cls: 'bg-muted text-muted-foreground' },
};

function Kpi({ kpi, delay }) {
  const up = kpi.trend >= 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...spring, delay }}
      className="bg-card border border-border rounded-3xl p-3.5 shadow-sm"
    >
      <div className="text-[11.5px] text-muted-foreground">{kpi.label}</div>
      <div className="font-display text-[22px] font-black mt-0.5">{kpi.value}</div>
      <div className={`flex items-center gap-1 text-[11px] font-bold mt-1 ${up ? 'text-brand' : 'text-destructive'}`}>
        {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
        {up ? '+' : ''}{kpi.trend}% <span className="text-muted-foreground font-medium">{kpi.suffix}</span>
      </div>
    </motion.div>
  );
}

export default function ClubDashboard() {
  const navigate = useNavigate();
  const courts = COURTS_STATUS;

  const publishCourt = (court) => {
    if (court.status !== 'free') return;
    toast.success(`${court.label} פורסם בשוק`, { description: 'שחקנים באזור יקבלו התראת מגרש פנוי' });
  };

  return (
    <div dir="rtl" className="min-h-screen bg-background max-w-md mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-5 pb-4">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center active:scale-90">
          <ArrowRight size={17} />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="font-display text-[20px] font-black leading-tight truncate">{DEMO_CLUB.name}</h1>
          <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-[hsl(var(--gold-deep))] bg-gold-soft rounded-full px-2 py-0.5 mt-0.5">
            <BadgeCheck size={10} /> מנהל מועדון
          </span>
        </div>
        <button onClick={() => navigate('/club-admin')} className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center active:scale-90">
          <Settings size={16} />
        </button>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 gap-2.5 px-5 mb-5">
        {CLUB_KPIS.map((kpi, i) => <Kpi key={kpi.id} kpi={kpi} delay={i * 0.05} />)}
      </div>

      {/* Occupancy by hour */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.15 }}
        className="mx-5 mb-4 bg-card border border-border rounded-3xl p-4 shadow-sm">
        <div className="flex items-baseline justify-between mb-3">
          <span className="font-bold text-[14.5px]">תפוסה לפי שעה — היום</span>
          <span className="text-[11px] text-muted-foreground">שיא: 19:00</span>
        </div>
        <div className="h-36" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={OCCUPANCY_BY_HOUR} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
              <XAxis dataKey="hour" tickLine={false} axisLine={false} tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} interval={2} />
              <YAxis hide domain={[0, 100]} />
              <Tooltip
                cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }}
                formatter={(v) => [`${v}%`, 'תפוסה']}
                labelFormatter={(l) => `${l}:00`}
                contentStyle={{ borderRadius: 12, border: '1px solid hsl(var(--border))', fontSize: 12 }}
              />
              <Bar dataKey="pct" radius={[4, 4, 0, 0]} fill="hsl(var(--brand))" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Revenue area */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.2 }}
        className="mx-5 mb-4 bg-card border border-border rounded-3xl p-4 shadow-sm">
        <div className="flex items-baseline justify-between mb-3">
          <span className="font-bold text-[14.5px]">הכנסות — 14 ימים</span>
          <span className="font-display text-[15px] font-black text-brand">₪{REVENUE_14D.reduce((s, d) => s + d.revenue, 0).toLocaleString()}</span>
        </div>
        <div className="h-32" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={REVENUE_14D} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--brand))" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="hsl(var(--brand))" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} interval={3} />
              <YAxis hide />
              <Tooltip
                formatter={(v) => [`₪${v.toLocaleString()}`, 'הכנסות']}
                contentStyle={{ borderRadius: 12, border: '1px solid hsl(var(--border))', fontSize: 12 }}
              />
              <Area type="monotone" dataKey="revenue" stroke="hsl(var(--brand))" strokeWidth={2.5} fill="url(#revFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Courts grid */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.25 }} className="mx-5 mb-4">
        <div className="flex items-baseline justify-between mb-2.5">
          <span className="font-bold text-[14.5px]">מצב המגרשים עכשיו</span>
          <span className="text-[11px] text-muted-foreground">לחץ על מגרש פנוי כדי לפרסם</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {courts.map((c) => {
            const meta = STATUS_META[c.status];
            return (
              <button
                key={c.id}
                onClick={() => publishCourt(c)}
                className={`rounded-2xl border border-border p-3 text-center transition-all active:scale-95 ${
                  c.status === 'free' ? 'bg-card shadow-sm' : 'bg-card opacity-90'
                }`}
              >
                <div className="font-display text-[15px] font-black">{c.label}</div>
                <span className={`inline-block text-[10px] font-bold rounded-full px-2 py-0.5 mt-1.5 ${meta.cls}`}>
                  {meta.label}
                </span>
                <div className="text-[10px] text-muted-foreground mt-1 min-h-[14px]">
                  {c.status === 'occupied' ? `עד ${c.until}` : c.status === 'maintenance' ? `חוזר ${c.until}` : 'זמין עכשיו'}
                </div>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Upcoming bookings */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.3 }} className="mx-5 mb-5">
        <div className="font-bold text-[14.5px] mb-2.5">ההזמנות הקרובות</div>
        <div className="bg-card border border-border rounded-3xl shadow-sm divide-y divide-border">
          {UPCOMING_BOOKINGS.map((b) => (
            <div key={b.id} className="flex items-center gap-3 px-4 py-3">
              <div className="w-11 h-11 rounded-xl bg-bgWarm flex flex-col items-center justify-center flex-shrink-0">
                <span className="font-display text-[13px] font-black leading-none">{b.time}</span>
                <span className="text-[9px] text-muted-foreground mt-0.5">מגרש {b.court}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-[13.5px] truncate">{b.name}</div>
                <div className="text-[11.5px] text-muted-foreground">{b.players}/4 שחקנים</div>
              </div>
              <span className={`text-[10.5px] font-bold rounded-full px-2.5 py-1 ${
                b.paid ? 'bg-brand-softer text-brand' : 'bg-gold-soft text-[#8a6d3b]'
              }`}>
                {b.paid ? 'שולם' : 'ממתין לתשלום'}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* CTA */}
      <div className="px-5">
        <button
          onClick={() => navigate('/market/sell')}
          className="w-full py-3.5 rounded-full bg-gradient-to-l from-[hsl(var(--gold-deep))] to-[hsl(var(--gold))] text-white font-bold text-[14.5px] shadow-gold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
        >
          <Tag size={16} />
          פרסם מגרש פנוי בשוק
        </button>
      </div>
    </div>
  );
}
