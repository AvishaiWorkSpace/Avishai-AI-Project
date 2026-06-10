import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, Zap, X, Check, Calendar, MapPin, Users2 } from 'lucide-react';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';
import MatchCard from '@/components/MatchCard';
import LevelTag from '@/components/LevelTag';

// Level compatibility — a player can comfortably play one tier up/down.
const COMPAT = {
  A1: ['A1', 'A2'], A2: ['A1', 'A2', 'B1'], B1: ['A2', 'B1', 'B2'],
  B2: ['B1', 'B2', 'C1'], C1: ['B2', 'C1', 'C2'], C2: ['C1', 'C2'],
  D1: ['C2', 'D1', 'D2'], D2: ['D1', 'D2'],
};

const CITIES = ['הכל', 'תל אביב', 'הרצליה', 'רעננה', 'ראשון לציון', 'נתניה'];
const WHEN = [
  { id: 'all', label: 'מתי שיהיה' },
  { id: 'today', label: 'היום' },
  { id: 'tomorrow', label: 'מחר' },
  { id: 'week', label: 'השבוע' },
];
const GENDERS = [
  { id: 'all', label: 'הכל' },
  { id: 'mixed', label: 'מעורב' },
  { id: 'men', label: 'גברים' },
  { id: 'women', label: 'נשים' },
];

export default function Find() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('rally_user') || '{}');
  const userLevel = user.level || 'B2';

  const [search, setSearch] = useState('');
  const [city, setCity] = useState('הכל');
  const [when, setWhen] = useState('all');
  const [gender, setGender] = useState('all');
  const [levelMode, setLevelMode] = useState('mine'); // 'mine' | 'all'
  const [showFilters, setShowFilters] = useState(false);
  const [available, setAvailable] = useState(false);

  const { data: matches = [], isLoading } = useQuery({
    queryKey: ['matches', 'open'],
    queryFn: () => base44.entities.Match.filter({ status: 'open' }, '-created_date', 50),
  });

  const compatLevels = COMPAT[userLevel] || [userLevel];

  const inWindow = (iso) => {
    const d = new Date(iso);
    const now = new Date();
    const day = (x) => new Date(x.getFullYear(), x.getMonth(), x.getDate());
    const diff = Math.round((day(d) - day(now)) / 86400000);
    if (when === 'today') return diff === 0;
    if (when === 'tomorrow') return diff === 1;
    if (when === 'week') return diff >= 0 && diff < 7;
    return true;
  };

  const filtered = useMemo(() => {
    return matches
      .filter((m) => (city === 'הכל' ? true : m.city === city))
      .filter((m) => (gender === 'all' ? true : m.gender === gender))
      .filter((m) => (levelMode === 'mine' ? compatLevels.includes(m.level) : true))
      .filter((m) => inWindow(m.start_time))
      .filter((m) =>
        search ? (m.club_name + m.city).toLowerCase().includes(search.toLowerCase()) : true
      )
      .sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
  }, [matches, city, gender, levelMode, when, search, compatLevels]);

  // Fill-the-spot: matches missing exactly one player. The #1 survey pain.
  const needOnePlayer = filtered.filter(
    (m) => (m.max_players || 4) - (m.players?.length || 0) === 1
  );
  const regular = filtered.filter(
    (m) => (m.max_players || 4) - (m.players?.length || 0) !== 1
  );

  const activeFilterCount =
    (city !== 'הכל' ? 1 : 0) + (when !== 'all' ? 1 : 0) + (gender !== 'all' ? 1 : 0);

  const toggleAvailable = () => {
    setAvailable((v) => !v);
    if (!available) {
      toast.success('סימנת שאתה פנוי! 📣', {
        description: 'מנהלי משחקים שחסר להם שחקן יראו אותך ראשון',
      });
    } else {
      toast('ביטלת את הזמינות');
    }
  };

  return (
    <div className="pb-28 bg-bgWarm min-h-screen">
      {/* Sticky header */}
      <div className="sticky top-0 z-30 bg-bgWarm/95 backdrop-blur-md px-5 pt-5 pb-3">
        <div className="flex items-baseline justify-between mb-4">
          <h1 className="font-display text-[28px] font-black text-brand">מצא משחק</h1>
          <span className="text-[13px] text-muted-foreground">{filtered.length} משחקים פתוחים</span>
        </div>

        {/* Search + filter button */}
        <div className="flex items-center gap-2.5">
          <div className="flex-1 flex items-center gap-2 bg-card rounded-full px-4 h-11 border border-border shadow-sm">
            <Search size={18} className="text-muted-foreground" strokeWidth={2} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="חפש מועדון או עיר..."
              className="flex-1 bg-transparent outline-none text-[14px] placeholder:text-muted-foreground"
            />
            {search && (
              <button onClick={() => setSearch('')}>
                <X size={16} className="text-muted-foreground" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(true)}
            className="relative w-11 h-11 rounded-full bg-card border border-border shadow-sm flex items-center justify-center active:scale-90 transition-transform"
          >
            <SlidersHorizontal size={18} className="text-brand" strokeWidth={2} />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-brand text-white text-[10px] font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Level toggle chips */}
        <div className="flex items-center gap-2 mt-3">
          <Chip active={levelMode === 'mine'} onClick={() => setLevelMode('mine')}>
            ברמה שלי
            <LevelTag level={userLevel} size="xs" className="mr-1" />
          </Chip>
          <Chip active={levelMode === 'all'} onClick={() => setLevelMode('all')}>
            כל הרמות
          </Chip>
        </div>
      </div>

      {/* "I'm available" broadcast — the fill-the-spot supply side */}
      <div className="px-5 mt-1 mb-4">
        <button
          onClick={toggleAvailable}
          className={`w-full flex items-center gap-3 rounded-2xl px-4 py-3.5 border transition-colors active:scale-[0.99] ${
            available
              ? 'bg-brand text-white border-brand'
              : 'bg-card border-border shadow-sm'
          }`}
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
              available ? 'bg-white/20' : 'bg-gold-soft'
            }`}
          >
            <Zap size={18} className={available ? 'text-white' : 'text-gold'} strokeWidth={2.2} fill={available ? 'currentColor' : 'none'} />
          </div>
          <div className="flex-1 text-right">
            <div className={`font-bold text-[15px] ${available ? 'text-white' : 'text-foreground'}`}>
              {available ? 'אתה מסומן כפנוי' : 'אני פנוי למשחק'}
            </div>
            <div className={`text-[12px] ${available ? 'text-white/80' : 'text-muted-foreground'}`}>
              {available ? 'משחקים שחסר להם שחקן יקבלו אותך ראשון' : 'תן למשחקים שחסר להם שחקן למצוא אותך'}
            </div>
          </div>
          {available && <Check size={20} strokeWidth={2.5} />}
        </button>
      </div>

      {/* Fill-the-spot section */}
      {needOnePlayer.length > 0 && (
        <section className="mb-6">
          <div className="flex items-center gap-2 px-5 mb-3">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            <h2 className="font-display text-[20px] font-black">מילוי מהיר — חסר שחקן אחד</h2>
          </div>
          <div className="px-5 flex flex-col gap-3">
            {needOnePlayer.map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
          </div>
        </section>
      )}

      {/* Main feed */}
      <section>
        <div className="flex items-center justify-between px-5 mb-3">
          <h2 className="font-display text-[20px] font-black">
            {needOnePlayer.length > 0 ? 'עוד משחקים פתוחים' : 'משחקים פתוחים'}
          </h2>
        </div>

        {isLoading ? (
          <div className="px-5 flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 rounded-3xl bg-muted animate-pulse border border-border" />
            ))}
          </div>
        ) : regular.length > 0 ? (
          <div className="px-5 flex flex-col gap-3">
            {regular.map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
          </div>
        ) : needOnePlayer.length === 0 ? (
          <EmptyState onReset={() => { setCity('הכל'); setWhen('all'); setGender('all'); setLevelMode('all'); setSearch(''); }} />
        ) : null}
      </section>

      {/* Filter sheet */}
      <FilterSheet
        open={showFilters}
        onClose={() => setShowFilters(false)}
        city={city} setCity={setCity}
        when={when} setWhen={setWhen}
        gender={gender} setGender={setGender}
        onReset={() => { setCity('הכל'); setWhen('all'); setGender('all'); }}
      />
    </div>
  );
}

function Chip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center text-[13px] font-bold px-3.5 h-9 rounded-full border transition-colors active:scale-95 ${
        active
          ? 'bg-brand text-white border-brand'
          : 'bg-card text-foreground border-border'
      }`}
    >
      {children}
    </button>
  );
}

function EmptyState({ onReset }) {
  return (
    <div className="px-5 py-16 flex flex-col items-center text-center gap-3">
      <div className="text-5xl">🔍</div>
      <h3 className="font-display text-xl font-black">לא נמצאו משחקים</h3>
      <p className="text-muted-foreground text-[14px] max-w-[260px]">
        נסה להרחיב את הסינון — אולי יש משחק מעולה ברמה או בעיר אחרת.
      </p>
      <button
        onClick={onReset}
        className="mt-1 bg-brand text-white px-5 py-2.5 rounded-full font-bold text-[14px] active:scale-95 transition-transform"
      >
        אפס סינון
      </button>
    </div>
  );
}

function FilterSheet({ open, onClose, city, setCity, when, setWhen, gender, setGender, onReset }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-40"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-card rounded-t-3xl z-50 p-5 pb-8"
          >
            <div className="w-10 h-1 rounded-full bg-border mx-auto mb-5" />
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display text-xl font-black">סינון משחקים</h3>
              <button onClick={onReset} className="text-[13px] text-brand font-bold">
                איפוס
              </button>
            </div>

            <FilterGroup icon={MapPin} title="עיר">
              {CITIES.map((c) => (
                <Pill key={c} active={city === c} onClick={() => setCity(c)}>{c}</Pill>
              ))}
            </FilterGroup>

            <FilterGroup icon={Calendar} title="מתי">
              {WHEN.map((w) => (
                <Pill key={w.id} active={when === w.id} onClick={() => setWhen(w.id)}>{w.label}</Pill>
              ))}
            </FilterGroup>

            <FilterGroup icon={Users2} title="מגדר">
              {GENDERS.map((g) => (
                <Pill key={g.id} active={gender === g.id} onClick={() => setGender(g.id)}>{g.label}</Pill>
              ))}
            </FilterGroup>

            <button
              onClick={onClose}
              className="w-full mt-6 bg-brand text-white h-12 rounded-full font-bold active:scale-[0.98] transition-transform"
            >
              הצג תוצאות
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function FilterGroup({ icon: Icon, title, children }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-1.5 mb-2.5 text-[14px] font-bold">
        <Icon size={15} className="text-brand" strokeWidth={2.2} />
        {title}
      </div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Pill({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`text-[13px] font-semibold px-3.5 h-9 rounded-full border transition-colors active:scale-95 ${
        active ? 'bg-brand text-white border-brand' : 'bg-card text-foreground border-border'
      }`}
    >
      {children}
    </button>
  );
}
