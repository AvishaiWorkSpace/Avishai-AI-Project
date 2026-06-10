import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Star, TrendingUp, Users, CalendarClock, Tag } from 'lucide-react';
import { COURT_LISTINGS, FINISHED_MATCH } from '@/data/mockData';
import { formatMatchTime } from '@/lib/format';

// Notification feed. The free-court alert is the hero item — Rally's
// signature real-time weapon. Everything else is standard activity.
const spring = { type: 'spring', stiffness: 280, damping: 26 };

export default function Notifications() {
  const navigate = useNavigate();
  const urgent = COURT_LISTINGS.find(l => l.type === 'transfer' && l.urgent);

  const items = [
    urgent && {
      id: 'n_free_court',
      hero: true,
      icon: Zap,
      title: 'מגרש התפנה ליד שלך! 🎾',
      body: `${urgent.club_name} · ${formatMatchTime(urgent.start_time)} · ₪${urgent.price} במקום ₪${urgent.original_price}`,
      time: 'לפני 2 דק׳',
      unread: true,
      to: '/market',
      cta: 'תפוס אותו',
    },
    {
      id: 'n_rate',
      icon: Star,
      title: 'דירוג ממתין מהמשחק האחרון',
      body: `המשחק ב${FINISHED_MATCH.club_name} הסתיים — 4 שאלות קצרות והדירוג של כולם מתעדכן`,
      time: 'לפני שעה',
      unread: true,
      to: `/rate-players?match=${FINISHED_MATCH.id}`,
    },
    {
      id: 'n_rating_up',
      icon: TrendingUp,
      title: 'הדירוג שלך מטפס 📈',
      body: 'עלית 3 מקומות בדירוג הארצי השבוע — אתה במגמה הכי טובה שלך',
      time: 'אתמול',
      unread: false,
      to: '/leaderboard',
    },
    {
      id: 'n_match_tomorrow',
      icon: CalendarClock,
      title: 'תזכורת: משחק מחר ב-20:00',
      body: 'Padel Up הרצליה · מגרש 2 · נועה, איתי ומאיה כבר אישרו',
      time: 'אתמול',
      unread: false,
      to: '/my-games',
    },
    {
      id: 'n_new_player',
      icon: Users,
      title: 'שחקן חדש ברמה שלך באזורך',
      body: 'דור ימיני (B2, תל אביב) הצטרף ל-Rally — אולי שותף חדש?',
      time: 'לפני יומיים',
      unread: false,
      to: '/players',
    },
    {
      id: 'n_market',
      icon: Tag,
      title: 'המגרש שפרסמת נמכר ✅',
      body: 'הכסף בדרך אליך — ₪120 על מגרש 3 בפאדל פוינט',
      time: 'לפני 3 ימים',
      unread: false,
      to: '/wallet',
    },
  ].filter(Boolean);

  return (
    <div dir="rtl" className="min-h-screen bg-background max-w-md mx-auto pb-10">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-5 pb-4">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center active:scale-90">
          <ArrowRight size={17} />
        </button>
        <h1 className="font-display text-[22px] font-black flex-1">התראות</h1>
        <span className="text-[12px] font-bold text-muted-foreground">
          {items.filter(i => i.unread).length} חדשות
        </span>
      </div>

      <div className="px-5 space-y-2.5">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: i * 0.06 }}
              onClick={() => navigate(item.to)}
              className={`w-full text-right rounded-3xl border p-4 transition-all active:scale-[0.98] ${
                item.hero
                  ? 'border-[hsl(var(--gold))]/40 bg-gold-soft shadow-gold ring-gold'
                  : 'border-border bg-card shadow-sm'
              }`}
            >
              <div className="flex gap-3">
                <span className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                  item.hero ? 'bg-gradient-to-l from-[hsl(var(--gold-deep))] to-[hsl(var(--gold))] text-white' : 'bg-brand-softer text-brand'
                }`}>
                  <Icon size={18} />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[14px] flex-1 truncate">{item.title}</span>
                    {item.unread && <span className="w-2 h-2 rounded-full bg-destructive flex-shrink-0" />}
                  </div>
                  <p className="text-[12.5px] text-muted-foreground leading-relaxed mt-0.5">{item.body}</p>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[11px] text-muted-foreground">{item.time}</span>
                    {item.cta && (
                      <span className="text-[12px] font-black text-[hsl(var(--gold-deep))]">{item.cta} ←</span>
                    )}
                  </div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
