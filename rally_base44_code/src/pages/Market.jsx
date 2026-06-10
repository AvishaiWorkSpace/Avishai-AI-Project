import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag, Clock, MapPin, Flame, Plus, X, BadgeCheck, ArrowLeftRight } from 'lucide-react';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';
import { formatMatchTime, timeUntil } from '@/lib/format';
import ThemeToggle from '@/components/ThemeToggle';

const TABS = [
  { id: 'all', label: 'הכל' },
  { id: 'urgent', label: 'ברגע האחרון', icon: Flame },
  { id: 'club', label: 'מהמועדון' },
];

export default function Market() {
  const [tab, setTab] = useState('all');
  const [sellOpen, setSellOpen] = useState(false);

  const { data: listings = [], isLoading } = useQuery({
    queryKey: ['court-listings'],
    queryFn: () => base44.entities.CourtListing.list('start_time', 50),
  });

  const filtered = useMemo(() => {
    const rows = [...listings].sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
    if (tab === 'urgent') return rows.filter((l) => l.urgent || l.type === 'transfer');
    if (tab === 'club') return rows.filter((l) => l.type === 'club');
    return rows;
  }, [listings, tab]);

  const urgentCount = listings.filter((l) => l.urgent).length;

  return (
    <div className="pb-28 min-h-screen">
      {/* Header */}
      <div className="bg-brand-gradient ring-gold px-5 pt-6 pb-7 rounded-b-[32px] shadow-luxe relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(80% 60% at 15% 0%, hsl(41 55% 70% / 0.14) 0%, transparent 60%)',
          }}
        />
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <h1 className="font-display text-[28px] font-black text-white">שוק המגרשים</h1>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-white/5 px-3 py-1 text-[11px] font-semibold text-gold-light">
                <Flame size={12} />
                {urgentCount} ברגע האחרון
              </span>
              <ThemeToggle onDark />
            </div>
          </div>
          <p className="mt-1.5 max-w-[260px] text-[13px] leading-relaxed text-white/70">
            תפוס מגרש שמישהו מוכר במחיר מוזל, או מכור מגרש שלך שלא תוכל להגיע אליו.
          </p>

          <button
            onClick={() => setSellOpen(true)}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-[14px] font-bold text-brand-deep shadow-gold transition-transform active:scale-95"
          >
            <Plus size={16} strokeWidth={2.5} />
            מכור מגרש שלי
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-0 z-20 bg-bgWarm/90 backdrop-blur-md px-5 py-3">
        <div className="flex items-center gap-2">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`inline-flex items-center gap-1.5 h-9 px-4 rounded-full text-[13px] font-bold border transition-colors active:scale-95 ${
                tab === id ? 'bg-brand text-white border-brand' : 'bg-card text-foreground border-border'
              }`}
            >
              {Icon && <Icon size={13} />}
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Listings */}
      <div className="px-5 flex flex-col gap-3.5 mt-1">
        {isLoading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="h-32 rounded-3xl bg-muted animate-pulse border border-border" />
          ))
        ) : filtered.length ? (
          filtered.map((l) => <ListingCard key={l.id} listing={l} />)
        ) : (
          <div className="py-16 text-center text-muted-foreground">אין מגרשים בקטגוריה זו כרגע</div>
        )}
      </div>

      <SellSheet open={sellOpen} onClose={() => setSellOpen(false)} />
    </div>
  );
}

function ListingCard({ listing }) {
  const isTransfer = listing.type === 'transfer';
  const discount = listing.original_price > listing.price
    ? Math.round((1 - listing.price / listing.original_price) * 100)
    : 0;

  const buy = () =>
    toast.success(isTransfer ? 'בקשה נשלחה למוכר' : 'המגרש נתפס!', {
      description: `${listing.club_name} · ${formatMatchTime(listing.start_time)}`,
    });

  return (
    <div className="bg-card rounded-3xl overflow-hidden border border-border shadow-luxe">
      <div className="relative h-28">
        <img src={listing.image_url} alt={listing.club_name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute top-3 right-3 flex gap-2">
          {listing.urgent && (
            <span className="inline-flex items-center gap-1 rounded-full bg-destructive text-white text-[11px] font-bold px-2.5 py-1 shadow-sm">
              <Flame size={11} />
              {timeUntil(listing.start_time)}
            </span>
          )}
          <span className="inline-flex items-center gap-1 rounded-full bg-black/35 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1">
            {isTransfer ? <ArrowLeftRight size={11} /> : <BadgeCheck size={11} />}
            {isTransfer ? 'העברה' : 'מהמועדון'}
          </span>
        </div>
        <div className="absolute bottom-2.5 right-4 left-4 text-white">
          <div className="font-bold text-[16px] leading-tight">{listing.club_name}</div>
          <div className="text-[12px] text-white/80 flex items-center gap-1">
            <MapPin size={11} /> {listing.city} · {listing.court_label}
          </div>
        </div>
      </div>

      <div className="p-3.5 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
            <Clock size={12} />
            {formatMatchTime(listing.start_time)} · {listing.duration_min} דק׳
          </div>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="font-display text-[22px] font-black text-brand">₪{listing.price}</span>
            {discount > 0 && (
              <>
                <span className="text-[13px] text-muted-foreground line-through">₪{listing.original_price}</span>
                <span className="inline-flex items-center gap-0.5 rounded-md bg-gold-soft text-gold-deep text-[11px] font-bold px-1.5 py-0.5">
                  <Tag size={10} /> -{discount}%
                </span>
              </>
            )}
          </div>
          {isTransfer && listing.seller && (
            <div className="flex items-center gap-1.5 mt-2">
              <img src={listing.seller.avatar_url} alt="" className="w-5 h-5 rounded-full object-cover" />
              <span className="text-[12px] text-muted-foreground">נמכר ע״י {listing.seller.full_name?.split(' ')[0]}</span>
            </div>
          )}
        </div>

        <button
          onClick={buy}
          className="bg-brand text-white px-5 py-2.5 rounded-full font-bold text-[14px] active:scale-95 transition-transform shadow-sm"
        >
          {isTransfer ? 'תפוס מקום' : 'הזמן'}
        </button>
      </div>
    </div>
  );
}

function SellSheet({ open, onClose }) {
  const [price, setPrice] = useState('');

  const submit = () => {
    toast.success('המגרש פורסם בשוק!', {
      description: 'נודיע לך ברגע שמישהו ירצה לתפוס אותו',
    });
    onClose();
    setPrice('');
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="fixed inset-0 bg-black/40 z-40"
          />
          <motion.div
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-card rounded-t-3xl z-50 p-5 pb-8"
          >
            <div className="w-10 h-1 rounded-full bg-border mx-auto mb-5" />
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-display text-xl font-black">מכירת מגרש מהירה</h3>
              <button onClick={onClose}><X size={20} className="text-muted-foreground" /></button>
            </div>
            <p className="text-[13px] text-muted-foreground mb-5">
              לא מצליח להגיע? פרסם את המגרש שהזמנת ותן לשחקן אחר לתפוס אותו — תקבל את הכסף בחזרה.
            </p>

            <label className="block text-[13px] font-bold mb-1.5">המגרש שלך</label>
            <div className="rounded-2xl border border-border bg-bgWarm px-4 py-3 mb-4 text-[14px]">
              פאדל פוינט תל אביב · מגרש 3 · היום 20:00
            </div>

            <label className="block text-[13px] font-bold mb-1.5">מחיר מבוקש (₪)</label>
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value.replace(/\D/g, ''))}
              inputMode="numeric"
              placeholder="לדוגמה: 120"
              className="w-full rounded-2xl border border-border px-4 h-12 text-[15px] outline-none focus:border-brand mb-2"
            />
            <p className="text-[12px] text-muted-foreground mb-5">המחיר המקורי ששילמת: ₪180</p>

            <button
              onClick={submit}
              disabled={!price}
              className="w-full bg-brand text-white h-12 rounded-full font-bold active:scale-[0.98] transition-transform disabled:opacity-40"
            >
              פרסם בשוק
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
