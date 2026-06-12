import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Star, Clock, MapPin, X, Navigation } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { base44 } from '@/api/base44Client';
import { enrichClubs, CLUB_LATLNG, clubHash } from '@/data/clubsExtra';
import { BallIcon } from '@/components/icons';

const spring = { type: 'spring', stiffness: 280, damping: 26 };

// Israel fits a phone-tall viewport around this frame.
const ISRAEL_CENTER = [32.0, 34.95];
const ISRAEL_ZOOM = 8;

// divIcon per pin state — gold = open courts today, brand = regular club.
const pinIcon = (gold, selected) =>
  L.divIcon({
    className: '', // kill leaflet's default white box
    html: `<div class="club-pin${gold ? ' gold' : ''}${selected ? ' selected' : ''}">${gold ? '<span class="ring"></span>' : ''}<span class="dot"></span></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });

// Imperative fly-to when a club is picked from the list or a pin.
function FlyTo({ target }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo(target, Math.max(map.getZoom(), 11), { duration: 0.8 });
  }, [target, map]);
  return null;
}

// On mount: fix the measured size (the container animates in) and frame all
// club pins — Haifa down to Beer Sheva — inside the viewport.
function FitAllClubs() {
  const map = useMap();
  useEffect(() => {
    const t = setTimeout(() => {
      map.invalidateSize();
      map.fitBounds(L.latLngBounds(Object.values(CLUB_LATLNG)), { padding: [26, 26] });
    }, 250);
    return () => clearTimeout(t);
  }, [map]);
  return null;
}

const googleNavUrl = ([lat, lng]) =>
  `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;

export default function ClubsMap() {
  const navigate = useNavigate();
  const [view, setView] = useState('map');
  const [selected, setSelected] = useState(null);

  const { data: baseClubs = [] } = useQuery({
    queryKey: ['clubs'],
    queryFn: () => base44.entities.Club.list('name'),
  });

  const clubs = useMemo(() => enrichClubs(baseClubs), [baseClubs]);
  const selectedLatLng = selected ? CLUB_LATLNG[selected.city] : null;

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
          <div
            dir="ltr"
            className="rounded-[28px] overflow-hidden border border-border shadow-luxe bg-card relative"
            style={{ height: '58vh', minHeight: 380 }}
          >
            <MapContainer
              center={ISRAEL_CENTER}
              zoom={ISRAEL_ZOOM}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom
              attributionControl
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              />
              {clubs.map((club) => {
                const latlng = CLUB_LATLNG[club.city];
                if (!latlng) return null;
                const hasOpenSlot = clubHash(club.id) % 3 !== 0;
                return (
                  <Marker
                    key={club.id}
                    position={latlng}
                    icon={pinIcon(hasOpenSlot, selected?.id === club.id)}
                    eventHandlers={{ click: () => setSelected(club) }}
                  />
                );
              })}
              <FitAllClubs />
              <FlyTo target={selectedLatLng} />
            </MapContainer>
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
              <div className="p-3.5">
                <div className="flex items-center justify-between gap-3 mb-3">
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
                {/* Real-world navigation — opens Google Maps driving directions */}
                {selectedLatLng && (
                  <a
                    href={googleNavUrl(selectedLatLng)}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 rounded-full border border-brand/30 bg-brand-softer text-brand font-bold text-[13.5px] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
                  >
                    <Navigation size={15} />
                    נווט עם Google Maps
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
