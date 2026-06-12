import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Plus, Check, Users, CalendarDays } from 'lucide-react';
import { toast } from 'sonner';
import { SOCIAL_GROUPS, GROUP_CITIES } from '@/data/socialGroups';
import { SearchIcon } from '@/components/icons';

const spring = { type: 'spring', stiffness: 280, damping: 26 };
const JOINED_KEY = 'rally_groups_joined';

const readJoined = () => {
  try {
    const v = JSON.parse(localStorage.getItem(JOINED_KEY) || '[]');
    return Array.isArray(v) ? v : [];
  } catch { return []; }
};

function initials(name = '') {
  return name.split(' ').map((w) => w[0]).slice(0, 2).join('');
}

export default function Groups() {
  const navigate = useNavigate();
  const [joined, setJoined] = useState(readJoined);
  const [query, setQuery] = useState('');
  const [city, setCity] = useState('הכל');
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCity, setNewCity] = useState('');
  const [localGroups, setLocalGroups] = useState([]);

  const groups = useMemo(() => {
    const all = [...localGroups, ...SOCIAL_GROUPS];
    return all.filter((g) =>
      (city === 'הכל' || g.city === city) &&
      (!query.trim() || g.name.includes(query.trim()) || g.city.includes(query.trim())),
    );
  }, [localGroups, query, city]);

  const toggleJoin = (id, name) => {
    setJoined((prev) => {
      const isIn = prev.includes(id);
      const next = isIn ? prev.filter((x) => x !== id) : [...prev, id];
      try { localStorage.setItem(JOINED_KEY, JSON.stringify(next)); } catch { /* demo */ }
      if (!isIn) toast.success(`הצטרפת ל${name}`, { description: 'תקבל עדכון על המשחק הקרוב' });
      return next;
    });
  };

  const createGroup = () => {
    const name = newName.trim();
    if (!name) return;
    const id = `local_g${Date.now()}`;
    setLocalGroups((prev) => [{
      id,
      name,
      city: newCity.trim() || 'תל אביב',
      members_count: 1,
      level_range: 'B2–B1',
      schedule: 'נקבע בקבוצה',
      games_per_week: 0,
      cover: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600&h=320&fit=crop',
      members: [],
      description: 'קבוצה חדשה — הזמן חברים והתחילו לשחק.',
      local: true,
    }, ...prev]);
    setJoined((prev) => {
      const next = [...prev, id];
      try { localStorage.setItem(JOINED_KEY, JSON.stringify(next)); } catch { /* demo */ }
      return next;
    });
    setNewName('');
    setNewCity('');
    setCreating(false);
    toast.success('הקבוצה נוצרה!', { description: 'אתה החבר הראשון בה' });
  };

  return (
    <div dir="rtl" className="min-h-screen bg-background max-w-md mx-auto pb-10">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-5 pb-4">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center active:scale-90">
          <ArrowRight size={17} />
        </button>
        <h1 className="font-display text-[22px] font-black flex-1">קבוצות</h1>
        <button
          onClick={() => setCreating((v) => !v)}
          className="flex items-center gap-1.5 bg-brand text-white text-[13px] font-bold px-3.5 py-2 rounded-full active:scale-95 transition-transform"
        >
          <Plus size={15} strokeWidth={2.5} />
          צור קבוצה
        </button>
      </div>

      {/* Create form */}
      <AnimatePresence>
        {creating && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mx-5 mb-4 bg-card border border-border rounded-3xl p-4 shadow-sm space-y-2.5">
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="שם הקבוצה — למשל ״פאדל שישי בבוקר״"
                className="w-full bg-bgWarm rounded-xl px-3.5 py-2.5 text-[13.5px] outline-none border border-transparent focus:border-brand/40"
              />
              <input
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
                placeholder="עיר"
                className="w-full bg-bgWarm rounded-xl px-3.5 py-2.5 text-[13.5px] outline-none border border-transparent focus:border-brand/40"
              />
              <button
                onClick={createGroup}
                disabled={!newName.trim()}
                className={`w-full py-2.5 rounded-full text-[13.5px] font-bold transition-all active:scale-[0.98] ${
                  newName.trim() ? 'bg-brand text-white' : 'bg-muted text-muted-foreground'
                }`}
              >
                צור את הקבוצה
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search + city filter */}
      <div className="px-5 mb-3">
        <div className="flex items-center gap-2.5 bg-card border border-border rounded-2xl px-3.5 py-2.5 shadow-sm mb-2.5">
          <SearchIcon size={16} className="text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="חפש קבוצה או עיר..."
            className="flex-1 bg-transparent outline-none text-[14px] placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {GROUP_CITIES.map((c) => (
            <button
              key={c}
              onClick={() => setCity(c)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-[12.5px] font-bold border transition-all active:scale-95 ${
                city === c ? 'bg-brand text-white border-brand' : 'bg-card border-border'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Groups list */}
      <div className="px-5 space-y-3">
        {groups.map((g, i) => {
          const isJoined = joined.includes(g.id);
          return (
            <motion.div
              key={g.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: Math.min(i, 6) * 0.05 }}
              className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm"
            >
              <button onClick={() => navigate(`/groups/${g.id}`)} className="w-full text-right">
                <div className="relative h-28">
                  <img src={g.cover} alt={g.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-2.5 right-3.5 left-3.5 text-white">
                    <div className="font-display text-[17px] font-black leading-tight">{g.name}</div>
                    <div className="flex items-center gap-3 text-[11.5px] text-white/80 mt-0.5">
                      <span>{g.city}</span>
                      <span className="flex items-center gap-1"><CalendarDays size={11} /> {g.schedule}</span>
                    </div>
                  </div>
                  <span className="absolute top-2.5 left-3 bg-black/40 backdrop-blur-sm text-white text-[10.5px] font-bold px-2.5 py-1 rounded-full">
                    {g.level_range}
                  </span>
                </div>
              </button>
              <div className="px-3.5 py-3 flex items-center gap-3">
                <div className="flex -space-x-2 space-x-reverse">
                  {g.members.slice(0, 3).map((p) => (
                    p.avatar_url
                      ? <img key={p.id} src={p.avatar_url} alt={p.full_name} className="w-7 h-7 rounded-full border-2 border-white object-cover" />
                      : <div key={p.id} className="w-7 h-7 rounded-full border-2 border-white bg-brand-soft text-brand text-[10px] font-bold flex items-center justify-center">{initials(p.full_name)}</div>
                  ))}
                </div>
                <span className="flex items-center gap-1 text-[12px] text-muted-foreground">
                  <Users size={12} strokeWidth={2} />
                  {g.members_count + (isJoined && !g.local ? 1 : 0)} חברים
                </span>
                <button
                  onClick={() => toggleJoin(g.id, g.name)}
                  className={`mr-auto flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12.5px] font-bold transition-all active:scale-95 ${
                    isJoined ? 'bg-brand-softer text-brand' : 'bg-brand text-white'
                  }`}
                >
                  {isJoined ? (<><Check size={13} strokeWidth={3} /> חבר</>) : 'הצטרף'}
                </button>
              </div>
            </motion.div>
          );
        })}

        {groups.length === 0 && (
          <div className="text-center pt-12">
            <div className="font-bold text-[15px]">לא נמצאו קבוצות</div>
            <p className="text-[13px] text-muted-foreground mt-1">נסה חיפוש אחר — או צור קבוצה חדשה משלך</p>
          </div>
        )}
      </div>
    </div>
  );
}
