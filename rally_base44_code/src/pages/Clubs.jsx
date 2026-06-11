import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Star, Clock, MapPin, Map, Search } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { enrichClubs } from '@/data/clubsExtra';
import { BallIcon } from '@/components/icons';

const spring = { type: 'spring', stiffness: 280, damping: 26 };

export default function Clubs() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [city, setCity] = useState('הכל');

  const { data: baseClubs = [], isLoading } = useQuery({
    queryKey: ['clubs'],
    queryFn: () => base44.entities.Club.list('name', 20),
  });

  const clubs = useMemo(() => enrichClubs(baseClubs), [baseClubs]);
  const cities = useMemo(() => ['הכל', ...new Set(clubs.map((c) => c.city))], [clubs]);

  const filtered = useMemo(() => {
    const q = query.trim();
    return clubs
      .filter((c) => city === 'הכל' || c.city === city)
      .filter((c) => !q || c.name.includes(q) || c.city.includes(q))
      .sort((a, b) => b.rating - a.rating);
  }, [clubs, city, query]);

  return (
    <div dir="rtl" className="min-h-screen bg-background max-w-md mx-auto pb-10">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-5 pb-4">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center active:scale-90">
          <ArrowRight size={17} />
        </button>
        <div className="flex-1">
          <h1 className="font-display text-[22px] font-black leading-none">מועדונים</h1>
          <p className="text-[12px] text-muted-foreground mt-1">{filtered.length} מועדונים ברחבי הארץ</p>
        </div>
        <button
          onClick={() => navigate('/clubs-map')}
          className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full bg-brand text-white text-[12.5px] font-bold shadow-sm active:scale-95 transition-transform"
        >
          <Map size={14} />
          מפה
        </button>
      </div>

      {/* Search */}
      <div className="px-5 mb-3">
        <div className="relative">
          <Search size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="חפש מועדון או עיר..."
            className="w-full h-11 rounded-2xl bg-card border border-border pr-10 pl-4 text-[14px] outline-none focus:border-brand transition-colors"
          />
        </div>
      </div>

      {/* City chips */}
      <div className="flex gap-2 px-5 pb-4 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        {cities.map((c) => (
          <button
            key={c}
            onClick={() => setCity(c)}
            className={`flex-shrink-0 h-8 px-3.5 rounded-full text-[12.5px] font-bold border transition-colors active:scale-95 ${
              city === c ? 'bg-brand text-white border-brand' : 'bg-card text-muted-foreground border-border'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="px-5 flex flex-col gap-4">
        {isLoading && !clubs.length ? (
          [1, 2, 3].map((i) => <div key={i} className="h-56 rounded-3xl bg-muted animate-pulse border border-border" />)
        ) : filtered.length ? (
          filtered.map((club, i) => <ClubCard key={club.id} club={club} index={i} />)
        ) : (
          <div className="py-16 text-center text-muted-foreground text-[14px]">
            לא נמצאו מועדונים — נסה חיפוש אחר
          </div>
        )}
      </div>
    </div>
  );
}

function ClubCard({ club, index }) {
  const navigate = useNavigate();
  const amenities = club.amenities || [];
  const shown = amenities.slice(0, 3);
  const more = amenities.length - shown.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...spring, delay: Math.min(index, 6) * 0.06 }}
      className="bg-card rounded-3xl overflow-hidden border border-border shadow-luxe"
    >
      <div className="relative h-36">
        <img src={club.image_url} alt={club.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-black/35 backdrop-blur-sm text-white text-[11.5px] font-bold px-2.5 py-1">
          <Star size={11} className="text-[hsl(var(--gold-light))]" fill="currentColor" />
          {club.rating}
        </span>
        <div className="absolute bottom-2.5 right-4 left-4 text-white">
          <div className="font-bold text-[16px] leading-tight">{club.name}</div>
          <div className="text-[12px] text-white/80 flex items-center gap-1">
            <MapPin size={11} /> {club.city}
          </div>
        </div>
      </div>

      <div className="p-3.5">
        <div className="flex items-center gap-3.5 text-[12px] text-muted-foreground mb-3">
          <span className="flex items-center gap-1"><BallIcon size={13} strokeWidth={2} /> {club.courts_count} מגרשים</span>
          <span className="flex items-center gap-1"><Clock size={12} /> {club.hours}</span>
        </div>

        {shown.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mb-3.5">
            {shown.map((a) => (
              <span key={a} className="rounded-full bg-brand-softer text-brand text-[11px] font-bold px-2.5 py-1">{a}</span>
            ))}
            {more > 0 && (
              <span className="rounded-full bg-bgWarm text-muted-foreground text-[11px] font-bold px-2.5 py-1">+{more}</span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10.5px] text-muted-foreground">מחיר למגרש</div>
            <div className="font-display text-[17px] font-black text-brand">{club.price_range}</div>
          </div>
          <button
            onClick={() => navigate(`/book-court?club=${club.id}`)}
            className="bg-brand text-white px-5 py-2.5 rounded-full font-bold text-[13.5px] active:scale-95 transition-transform shadow-sm"
          >
            הזמן מגרש
          </button>
        </div>
      </div>
    </motion.div>
  );
}
