import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ShieldCheck, X, Check, Flag } from 'lucide-react';
import { toast } from 'sonner';
import { LEADERBOARD_PLAYERS } from '@/data/mockData';
import { PLATFORM_KPIS, VERIFICATION_QUEUE, OPEN_REPORTS } from '@/data/b2bClub';
import LevelTag from '@/components/LevelTag';
import { SearchIcon } from '@/components/icons';

const spring = { type: 'spring', stiffness: 280, damping: 26 };
const QUEUE_KEY = 'rally_admin_queue';

const readHandled = () => {
  try {
    const v = JSON.parse(localStorage.getItem(QUEUE_KEY) || '{}');
    return v && typeof v === 'object' ? v : {};
  } catch { return {}; }
};

// rating → level bucket, for users that carry no explicit level.
function levelOf(p) {
  if (p.level) return p.level;
  const r = p.rally_rating;
  if (r >= 2000) return 'A1';
  if (r >= 1880) return 'A2';
  if (r >= 1750) return 'B1';
  if (r >= 1600) return 'B2';
  if (r >= 1450) return 'C1';
  return 'C2';
}

function initials(name = '') {
  return name.split(' ').map((w) => w[0]).slice(0, 2).join('');
}

export default function Admin() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [shown, setShown] = useState(12);
  const [handled, setHandled] = useState(readHandled);
  const [resolvedReports, setResolvedReports] = useState([]);

  const users = useMemo(() => {
    const sorted = [...LEADERBOARD_PLAYERS].sort((a, b) => b.rally_rating - a.rally_rating);
    if (!query.trim()) return sorted;
    return sorted.filter((p) => p.full_name.includes(query.trim()) || (p.city || '').includes(query.trim()));
  }, [query]);

  const pendingQueue = VERIFICATION_QUEUE.filter((v) => !handled[v.id]);

  const handleVerification = (id, approved) => {
    setHandled((prev) => {
      const next = { ...prev, [id]: approved ? 'approved' : 'rejected' };
      try { localStorage.setItem(QUEUE_KEY, JSON.stringify(next)); } catch { /* demo */ }
      return next;
    });
    const item = VERIFICATION_QUEUE.find((v) => v.id === id);
    if (approved) toast.success(`הרמה של ${item.name} אומתה`, { description: `מעכשיו מוצג ${item.claimed} מאומת` });
    else toast(`הבקשה של ${item.name} נדחתה`, { description: 'השחקן יקבל הסבר ויוכל לבקש שוב בעוד 30 יום' });
  };

  const resolveReport = (id) => {
    setResolvedReports((prev) => [...prev, id]);
    toast.success('הדיווח טופל');
  };

  return (
    <div dir="rtl" className="min-h-screen bg-background max-w-md mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-5 pb-4">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center active:scale-90">
          <ArrowRight size={17} />
        </button>
        <h1 className="font-display text-[22px] font-black flex-1">ניהול Rally</h1>
        <span className="text-[10.5px] font-bold bg-gold-soft text-[#8a6d3b] rounded-full px-2.5 py-1">מצב דמו</span>
      </div>

      {/* Platform KPIs */}
      <div className="grid grid-cols-2 gap-2.5 px-5 mb-5">
        {PLATFORM_KPIS.map((kpi, i) => (
          <motion.div
            key={kpi.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: i * 0.05 }}
            className="bg-card border border-border rounded-3xl p-3.5 shadow-sm"
          >
            <div className="text-[11.5px] text-muted-foreground">{kpi.label}</div>
            <div className="font-display text-[22px] font-black mt-0.5">{kpi.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Verification queue */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.15 }} className="px-5 mb-5">
        <div className="flex items-center gap-2 mb-2.5">
          <ShieldCheck size={16} className="text-brand" />
          <span className="font-bold text-[14.5px] flex-1">אימות רמות</span>
          <span className="text-[11px] font-bold text-muted-foreground">{pendingQueue.length} ממתינים</span>
        </div>
        {pendingQueue.length === 0 ? (
          <div className="bg-card border border-border rounded-3xl p-5 text-center text-[13px] text-muted-foreground shadow-sm">
            אין בקשות ממתינות — הכול מטופל
          </div>
        ) : (
          <div className="space-y-2.5">
            <AnimatePresence>
              {pendingQueue.map((v) => (
                <motion.div
                  key={v.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 60, transition: { duration: 0.25 } }}
                  className="bg-card border border-border rounded-3xl p-3.5 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-brand-soft text-brand font-bold text-[12px] flex items-center justify-center">
                      {initials(v.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-[13.5px]">{v.name}</div>
                      <div className="text-[11.5px] text-muted-foreground">{v.city} · מבקש אימות</div>
                    </div>
                    <LevelTag level={v.claimed} size="sm" />
                  </div>
                  <p className="text-[12px] text-muted-foreground leading-relaxed mb-3">{v.evidence}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleVerification(v.id, true)}
                      className="flex-1 py-2 rounded-full bg-gradient-to-l from-[hsl(var(--gold-deep))] to-[hsl(var(--gold))] text-white text-[12.5px] font-bold flex items-center justify-center gap-1.5 active:scale-[0.97] transition-transform shadow-sm"
                    >
                      <Check size={14} strokeWidth={3} /> אשר רמה
                    </button>
                    <button
                      onClick={() => handleVerification(v.id, false)}
                      className="flex-1 py-2 rounded-full bg-card border border-border text-[12.5px] font-bold flex items-center justify-center gap-1.5 active:scale-[0.97] transition-transform"
                    >
                      <X size={14} strokeWidth={2.5} /> דחה
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {/* Reports */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.2 }} className="px-5 mb-5">
        <div className="flex items-center gap-2 mb-2.5">
          <Flag size={15} className="text-destructive" />
          <span className="font-bold text-[14.5px] flex-1">דיווחים פתוחים</span>
        </div>
        <div className="space-y-2.5">
          {OPEN_REPORTS.filter((r) => !resolvedReports.includes(r.id)).map((r) => (
            <div key={r.id} className="bg-card border border-border rounded-3xl p-3.5 shadow-sm flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="font-bold text-[13.5px]">{r.title}</div>
                <div className="text-[11.5px] text-muted-foreground mt-0.5 leading-relaxed">{r.detail}</div>
              </div>
              <button
                onClick={() => resolveReport(r.id)}
                className="px-3.5 py-2 rounded-full bg-brand text-white text-[12px] font-bold active:scale-95 transition-transform flex-shrink-0"
              >
                טפל
              </button>
            </div>
          ))}
          {OPEN_REPORTS.length === resolvedReports.length && (
            <div className="bg-card border border-border rounded-3xl p-5 text-center text-[13px] text-muted-foreground shadow-sm">
              אין דיווחים פתוחים
            </div>
          )}
        </div>
      </motion.div>

      {/* Users table */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.25 }} className="px-5">
        <div className="font-bold text-[14.5px] mb-2.5">שחקנים</div>
        <div className="flex items-center gap-2.5 bg-card border border-border rounded-2xl px-3.5 py-2.5 shadow-sm mb-2.5">
          <SearchIcon size={16} className="text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setShown(12); }}
            placeholder="חפש לפי שם או עיר..."
            className="flex-1 bg-transparent outline-none text-[14px] placeholder:text-muted-foreground"
          />
        </div>
        <div className="bg-card border border-border rounded-3xl shadow-sm divide-y divide-border">
          {users.slice(0, shown).map((p) => (
            <div key={p.id} className="flex items-center gap-3 px-4 py-2.5">
              {p.avatar_url
                ? <img src={p.avatar_url} alt={p.full_name} className="w-9 h-9 rounded-full object-cover" />
                : <div className="w-9 h-9 rounded-full bg-brand-soft text-brand font-bold text-[11px] flex items-center justify-center">{initials(p.full_name)}</div>}
              <div className="flex-1 min-w-0">
                <div className="font-bold text-[13px] truncate">{p.full_name}</div>
                <div className="text-[11px] text-muted-foreground">{p.city} · {p.games_played} משחקים</div>
              </div>
              <span className="font-display text-[14px] font-black text-brand">{p.rally_rating}</span>
              <LevelTag level={levelOf(p)} size="xs" />
            </div>
          ))}
        </div>
        {shown < users.length && (
          <button
            onClick={() => setShown((n) => n + 12)}
            className="w-full mt-3 py-2.5 rounded-full bg-card border border-border text-[13px] font-bold active:scale-[0.98] transition-transform"
          >
            טען עוד ({users.length - shown} נוספים)
          </button>
        )}
      </motion.div>
    </div>
  );
}
