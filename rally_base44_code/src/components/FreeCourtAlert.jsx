import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Clock } from 'lucide-react';
import { COURT_LISTINGS } from '@/data/mockData';
import { formatMatchTime } from '@/lib/format';

// Rally's signature weapon: a court just opened up nearby (someone sold their
// slot) → push-style banner. Demo: fires once per session, a few seconds after
// Home mounts, with the most urgent transfer listing.
export default function FreeCourtAlert() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  const listing = COURT_LISTINGS.find(l => l.type === 'transfer' && l.urgent);

  useEffect(() => {
    if (!listing || sessionStorage.getItem('rally_fca_seen')) return;
    const t = setTimeout(() => {
      sessionStorage.setItem('rally_fca_seen', '1');
      setShow(true);
    }, 3500);
    return () => clearTimeout(t);
  }, [listing]);

  if (!listing) return null;

  const discount = Math.round((1 - listing.price / listing.original_price) * 100);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: -120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -120, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 26 }}
          className="fixed top-3 inset-x-3 z-50 max-w-md mx-auto"
          dir="rtl"
        >
          <div className="rounded-3xl bg-card border border-[hsl(var(--gold))]/40 shadow-luxe ring-gold overflow-hidden">
            {/* header strip */}
            <div className="flex items-center gap-2 bg-gradient-to-l from-[hsl(var(--gold-deep))] to-[hsl(var(--gold))] px-4 py-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-60" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
              </span>
              <span className="text-[12.5px] font-black text-white flex-1">מגרש התפנה ליד שלך! 🎾</span>
              <button onClick={() => setShow(false)} className="text-white/80 active:scale-90" aria-label="סגור">
                <X size={16} />
              </button>
            </div>

            <div className="p-4">
              <div className="font-bold text-[15px] mb-1">{listing.club_name}</div>
              <div className="flex items-center gap-3 text-[12.5px] text-muted-foreground mb-3">
                <span className="inline-flex items-center gap-1"><MapPin size={12} /> {listing.city}</span>
                <span className="inline-flex items-center gap-1"><Clock size={12} /> {formatMatchTime(listing.start_time)}</span>
                <span className="font-bold text-foreground" dir="ltr">
                  ₪{listing.price} <s className="text-muted-foreground font-normal">₪{listing.original_price}</s>
                </span>
                <span className="text-[11px] font-black text-emerald-600">{discount}%-</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => { setShow(false); navigate('/market'); }}
                  className="flex-1 h-11 rounded-2xl bg-brand text-white font-bold text-[14px] shadow-md active:scale-[0.98] transition-all"
                >
                  תפוס אותו
                </button>
                <button
                  onClick={() => setShow(false)}
                  className="px-5 h-11 rounded-2xl border border-border bg-card font-bold text-[13px] text-muted-foreground active:scale-[0.98] transition-all"
                >
                  לא הפעם
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
