import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Star, Clock, MapPin, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { enrichClubs, CLUB_GEO, clubHash } from '@/data/clubsExtra';
import { BallIcon } from '@/components/icons';

const spring = { type: 'spring', stiffness: 280, damping: 26 };

// Stylized map of Israel — simplified coastline, drawn to feel crafted
// rather than cartographically exact. viewBox matches CLUB_GEO coordinates.
function IsraelMap({ clubs, selectedId, onSelect }) {
  return (
    <svg viewBox="0 0 320 600" className="w-full h-full" role="img" aria-label="מפת מועדוני פאדל בישראל">
      <defs>
        <linearGradient id="landFill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="hsl(var(--brand-softer))" />
          <stop offset="100%" stopColor="hsl(var(--sage-soft))" />
        </linearGradient>
        <linearGradient id="seaFill" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="hsl(197 40% 88%)" />
          <stop offset="100%" stopColor="hsl(197 35% 92%)" />
        </linearGradient>
      </defs>

      {/* Sea */}
      <rect x="0" y="0" width="320" height="600" fill="url(#seaFill)" opacity="0.45" />

      {/* Land — simplified Israel outline */}
      <path
        d="M 118 40
           C 130 55, 138 75, 134 95
           C 130 112, 118 120, 116 138
           C 114 156, 108 170, 104 190
           C 100 210, 98 228, 100 248
           C 102 266, 96 282, 100 300
           C 104 318, 116 330, 124 348
           C 132 366, 138 386, 142 408
           C 146 430, 150 452, 146 474
           C 142 496, 132 516, 124 536
           C 118 550, 112 562, 110 574
           L 150 574
           C 158 550, 170 520, 178 492
           C 186 464, 192 436, 196 408
           C 200 380, 204 352, 206 324
           C 208 296, 210 268, 208 240
           C 206 212, 200 186, 194 162
           C 188 138, 180 112, 172 92
           C 164 72, 154 52, 146 40
           Z"
        fill="url(#landFill)"
        stroke="hsl(var(--brand))"
        strokeWidth="1.6"
        strokeOpacity="0.4"
      />

      {/* Subtle grid */}
      {[120, 200, 280, 360, 440, 520].map((y) => (
        <line key={y} x1="40" y1={y} x2="280" y2={y} stroke="hsl(var(--brand))" strokeOpacity="0.06" strokeWidth="1" />
      ))}

      {/* City pins */}
      {clubs.map((club) => {
        const geo = CLUB_GEO[club.city];
        if (!geo) return null;
        const hasOpenSlot = clubHash(club.id) % 3 !== 0;
        const selected = selectedId === club.id;
        return (
          <g key={club.id} transform={`translate(${geo.x}, ${geo.y})`} onClick={() => onSelect(club)} style={{ cursor: 'pointer' }}>
            {hasOpenSlot && (
              <circle r="11" fill="hsl(var(--gold))" opacity="0.25">
                <animate attributeName="r" values="8;15;8" dur="2.2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.3;0.05;0.3" dur="2.2s" repeatCount="indefinite" />
              </circle>
            )}
            <circle
              r={selected ? 8 : 6}
              fill={hasOpenSlot ? 'hsl(var(--gold))' : 'hsl(var(--brand))'}
              stroke="white"
              strokeWidth="2.5"
              style={{ transition: 'r 0.15s' }}
            />
            {selected && (
              <circle r="12" fill="none" stroke="hsl(var(--brand))" strokeWidth="1.5" strokeOpacity="0.5" />
            )}
          </g>
        );
      })}

      {/* Region labels */}
      <text x="226" y="258" fontSize="11" fill="hsl(var(--brand))" opacity="0.45" fontWeight="700">ירושלים</text>
      <text x="40" y="256" fontSize="11" fill="hsl(var(--brand))" opacity="0.45" fontWeight="700">תל אביב</text>
      <text x="158" y="116" fontSize="11" fill="hsl(var(--brand))" opacity="0.45" fontWeight="700">חיפה</text>
      <text x="172" y="356" fontSize="11" fill="hsl(var(--brand))" opacity="0.45" fontWeight="700">באר שבע</text>
    </svg>
  );
}

export default function ClubsMap() {
  const navigate = useNavigate();
  const [view, setView] = useState('map');
  const [selected, setSelected] = useState(null);

  const { data: baseClubs = [] } = useQuery({
    queryKey: ['clubs'],
    queryFn: () => base44.entities.Club.list('name'),
  });

  const clubs = useMemo(() => enrichClubs(baseClubs), [baseClubs]);

  return (
    <div dir="rtl" className="min-h-screen bg-background max-w-md mx-auto pb-10">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-5 pb-3">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center active:scale-90">
          <ArrowRight size={17} />
        </button>
        <h1 className="font-display text-[22px] font-black flex-1">מפת מועדונים</h1>
        <div className="flex bg-card border border-border rounded-full p-0.5">
          {[['map', 'מפה'], ['list', 'רשימה']].map(([v, label]) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3.5 py-1.5 rounded-full text-[12.5px] font-bold transition-all ${
                view === v ? 'bg-brand text-white shadow-sm' : 'text-muted-foreground'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 px-5 pb-2 text-[11.5px] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[hsl(var(--gold))]" /> יש מגרשים פנויים היום
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-brand" /> מועדון
        </span>
      </div>

      {view === 'map' ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-5">
          <div className="rounded-[28px] overflow-hidden border border-border shadow-luxe bg-card" style={{ height: '58vh', minHeight: 380 }}>
            <IsraelMap clubs={clubs} selectedId={selected?.id} onSelect={setSelected} />
          </div>
        </motion.div>
      ) : (
        <div className="px-5 space-y-2.5">
          {clubs.map((club, i) => (
            <motion.button
              key={club.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: Math.min(i, 8) * 0.04 }}
              onClick={() => setSelected(club)}
              className="w-full text-right bg-card border border-border rounded-2xl p-3 flex items-center gap-3 shadow-sm active:scale-[0.98] transition-transform"
            >
              <img src={club.image_url} alt={club.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-[14px] truncate">{club.name}</div>
                <div className="flex items-center gap-2.5 text-[12px] text-muted-foreground mt-0.5">
                  <span className="flex items-center gap-1"><MapPin size={11} /> {club.city}</span>
                  <span className="flex items-center gap-1"><BallIcon size={12} /> {club.courts_count} מגרשים</span>
                </div>
              </div>
              <span className="flex items-center gap-1 text-[12.5px] font-bold">
                <Star size={12} className="text-[hsl(var(--gold))]" fill="hsl(var(--gold))" />
                {club.rating}
              </span>
            </motion.button>
          ))}
        </div>
      )}

      {/* Selected club bottom card */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ y: '110%' }}
            animate={{ y: 0 }}
            exit={{ y: '110%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-4 inset-x-4 max-w-md mx-auto z-40"
          >
            <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-luxe">
              <div className="relative h-28">
                <img src={selected.image_url} alt={selected.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <button
                  onClick={() => setSelected(null)}
                  className="absolute top-2.5 left-2.5 w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center active:scale-90"
                >
                  <X size={14} />
                </button>
                <div className="absolute bottom-2.5 right-3.5 left-3.5 text-white">
                  <div className="font-display text-[17px] font-black leading-tight">{selected.name}</div>
                  <div className="flex items-center gap-3 text-[11.5px] text-white/85 mt-0.5">
                    <span className="flex items-center gap-1"><MapPin size={11} /> {selected.city} · {selected.drive_minutes} דק׳ נסיעה</span>
                    <span className="flex items-center gap-1">
                      <Star size={11} fill="currentColor" className="text-[hsl(var(--gold-light))]" /> {selected.rating}
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-3.5 flex items-center justify-between gap-3">
                <div className="text-[12px] text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock size={12} /> {selected.hours}</span>
                  <span className="block mt-1 font-bold text-foreground">{selected.price_range} לשעה וחצי</span>
                </div>
                <button
                  onClick={() => navigate('/book-court')}
                  className="bg-brand text-white px-5 py-2.5 rounded-full font-bold text-[13.5px] active:scale-95 transition-transform shadow-sm"
                >
                  הזמן מגרש
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
