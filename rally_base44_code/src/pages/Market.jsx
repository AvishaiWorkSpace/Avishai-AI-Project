import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Tag, Clock, MapPin, Flame, Plus, X, BadgeCheck, ArrowLeftRight,
  Check, Phone, Send, Eye, Share2, CalendarDays, Banknote, Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';
import { formatMatchTime, timeUntil } from '@/lib/format';
import {
  addPurchase, addInviteToPurchase, getPurchasedListingIds,
  getMyListings, addMyListing, removeMyListing, listingViews,
  ilPhoneToWa, isValidIlMobile,
} from '@/lib/marketStore';
import { PLAYERS, CLUBS, DEFAULT_USER } from '@/data/mockData';
import ThemeToggle from '@/components/ThemeToggle';
import LiveCourtVideo from '@/components/LiveCourtVideo';

const HERO_POSTER = 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&h=500&fit=crop';

const TABS = [
  { id: 'all', label: 'הכל' },
  { id: 'urgent', label: 'ברגע האחרון', icon: Flame },
  { id: 'club', label: 'מהמועדון' },
];

export default function Market() {
  const [tab, setTab] = useState('all');
  const [sellOpen, setSellOpen] = useState(false);
  const [purchase, setPurchase] = useState(null); // the order just bought → success sheet
  const [purchasedIds, setPurchasedIds] = useState(getPurchasedListingIds);
  const [myListings, setMyListings] = useState(getMyListings);

  const { data: listings = [], isLoading } = useQuery({
    queryKey: ['court-listings'],
    queryFn: () => base44.entities.CourtListing.list('start_time', 50),
  });

  const filtered = useMemo(() => {
    const rows = listings
      .filter((l) => !purchasedIds.includes(l.id))
      .sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
    if (tab === 'urgent') return rows.filter((l) => l.urgent || l.type === 'transfer');
    if (tab === 'club') return rows.filter((l) => l.type === 'club');
    return rows;
  }, [listings, tab, purchasedIds]);

  const urgentCount = listings.filter((l) => l.urgent).length;

  const buy = (listing) => {
    const order = addPurchase(listing);
    setPurchasedIds((prev) => [...prev, listing.id]);
    setPurchase(order);
  };

  const listed = (listing) => {
    setMyListings((prev) => [listing, ...prev]);
    setSellOpen(false);
  };

  const unlist = (id) => {
    removeMyListing(id);
    setMyListings((prev) => prev.filter((l) => l.id !== id));
    toast('המגרש הוסר מהשוק');
  };

  return (
    <div className="pb-28 min-h-screen">
      {/* Header — live match footage behind the glass.
          bg-brand-gradient sits under the video so the box never flashes white
          while a clip is still loading. */}
      <div className="relative px-5 pt-6 pb-7 rounded-b-[32px] shadow-luxe overflow-hidden ring-gold bg-brand-gradient">
        <LiveCourtVideo poster={HERO_POSTER} />
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--brand-deep))]/85 via-[hsl(var(--brand-deep))]/70 to-[hsl(var(--brand-deep))]/90" />
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
          <p className="mt-1.5 max-w-[260px] text-[13px] leading-relaxed text-white/75">
            תפוס מגרש שמישהו מוכר במחיר מוזל, או מכור מגרש שלך שלא תוכל להגיע אליו.
          </p>

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={() => setSellOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-[14px] font-bold text-brand-deep shadow-gold transition-transform active:scale-95"
            >
              <Plus size={16} strokeWidth={2.5} />
              מכור מגרש שלי
            </button>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-white/80">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
              </span>
              שידור חי מהמגרש
            </span>
          </div>
        </div>
      </div>

      {/* My court on the market */}
      {myListings.length > 0 && (
        <div className="px-5 mt-4">
          <h2 className="font-display text-[16px] font-black mb-2.5">המגרש שלך בשוק</h2>
          <div className="flex flex-col gap-3">
            {myListings.map((l) => (
              <MyListingCard key={l.id} listing={l} onRemove={() => unlist(l.id)} />
            ))}
          </div>
        </div>
      )}

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
          filtered.map((l) => <ListingCard key={l.id} listing={l} onBuy={() => buy(l)} />)
        ) : (
          <div className="py-16 text-center text-muted-foreground">אין מגרשים בקטגוריה זו כרגע</div>
        )}
      </div>

      <SellSheet open={sellOpen} onClose={() => setSellOpen(false)} onListed={listed} />
      <PurchaseSuccessSheet purchase={purchase} onClose={() => setPurchase(null)} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// My listing — the court I'm selling, live on the market
// ---------------------------------------------------------------------------
function MyListingCard({ listing, onRemove }) {
  const views = listingViews(listing);
  const offerText = encodeURIComponent(
    `היי! יש לי מגרש ב${listing.club_name} (${listing.court_label}) ${formatMatchTime(listing.start_time)} שאני לא מגיע אליו — ₪${listing.price} במקום ₪${listing.original_price}. רוצה לתפוס אותו? אני ב-Rally`,
  );

  return (
    <div className="bg-card rounded-3xl border border-[hsl(var(--gold))]/40 ring-gold shadow-gold p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-soft text-gold-deep text-[11px] font-black px-2.5 py-1">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[hsl(var(--gold-deep))] opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[hsl(var(--gold-deep))]" />
          </span>
          מגרש למכירה · מוצג
        </span>
        <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground font-semibold">
          <Eye size={12} /> {views} צפיות
        </span>
      </div>

      <div className="font-bold text-[15px]">{listing.club_name} · {listing.court_label}</div>
      <div className="flex items-center gap-3 mt-1 text-[12.5px] text-muted-foreground">
        <span className="flex items-center gap-1"><CalendarDays size={12} /> {formatMatchTime(listing.start_time)}</span>
        <span className="flex items-center gap-1"><Clock size={12} /> {listing.duration_min} דק׳</span>
      </div>

      <div className="flex items-center gap-2 mt-2">
        <span className="font-display text-[22px] font-black text-brand">₪{listing.price}</span>
        <span className="text-[13px] text-muted-foreground line-through">₪{listing.original_price}</span>
      </div>

      <div className="flex items-center gap-2 mt-3">
        <a
          href={`https://wa.me/?text=${offerText}`}
          target="_blank"
          rel="noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-brand text-white text-[13px] font-bold h-10 active:scale-95 transition-transform"
        >
          <Share2 size={14} />
          הצע לאנשים בהודעה
        </a>
        <button
          onClick={onRemove}
          aria-label="הסר מהשוק"
          className="w-10 h-10 rounded-full border border-border bg-card text-muted-foreground flex items-center justify-center active:scale-90 transition-transform"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Listing card (buying)
// ---------------------------------------------------------------------------
function ListingCard({ listing, onBuy }) {
  const isTransfer = listing.type === 'transfer';
  const discount = listing.original_price > listing.price
    ? Math.round((1 - listing.price / listing.original_price) * 100)
    : 0;

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
          onClick={onBuy}
          className="bg-brand text-white px-5 py-2.5 rounded-full font-bold text-[14px] active:scale-95 transition-transform shadow-sm"
        >
          {isTransfer ? 'תפוס מקום' : 'הזמן'}
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Purchase success — popup with booking details, players and phone invite
// ---------------------------------------------------------------------------
function PurchaseSuccessSheet({ purchase, onClose }) {
  return (
    <AnimatePresence>
      {purchase && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[55]"
          />
          <motion.div
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-card rounded-t-3xl z-[60] max-h-[92dvh] overflow-y-auto"
          >
            <PurchaseContent purchase={purchase} onClose={onClose} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Mounted fresh per purchase, so phone/invited state never leaks between orders.
function PurchaseContent({ purchase, onClose }) {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [invited, setInvited] = useState(purchase.invited || []);

  // Transfer: I take the seller's spot in an existing foursome.
  // Club court: the whole court is mine — bring your own players.
  const isTransfer = purchase?.type === 'transfer';
  const others = isTransfer
    ? PLAYERS.filter((p) => p.id !== purchase?.seller?.id).slice(0, 2)
    : [];
  const me = { ...DEFAULT_USER, ...JSON.parse(localStorage.getItem('rally_user') || '{}') };
  const emptySlots = 4 - 1 - others.length - invited.length;

  const saved = purchase && purchase.original_price > purchase.price
    ? purchase.original_price - purchase.price
    : 0;

  const sendInvite = () => {
    if (!isValidIlMobile(phone)) {
      toast.error('מספר לא תקין', { description: 'הזן מספר נייד ישראלי, לדוגמה 052-1234567' });
      return;
    }
    addInviteToPurchase(purchase.id, phone);
    setInvited((prev) => [...prev, phone]);
    const text = encodeURIComponent(
      `היי! סגרתי מגרש ב${purchase.club_name} (${purchase.court_label}) ${formatMatchTime(purchase.start_time)} — בא לשחק איתנו? מצטרפים דרך Rally`,
    );
    window.open(`https://wa.me/${ilPhoneToWa(phone)}?text=${text}`, '_blank');
    setPhone('');
    toast.success('ההזמנה נשלחה', { description: 'השחקן יקבל הודעה עם פרטי המשחק' });
  };

  return (
    <div className="p-5 pb-8">
      <div className="w-10 h-1 rounded-full bg-border mx-auto mb-4" />

              {/* Success burst */}
              <div className="flex flex-col items-center text-center mb-5">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.15 }}
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-[hsl(var(--gold))] to-[hsl(var(--gold-deep))] text-white flex items-center justify-center shadow-gold mb-3"
                >
                  <Check size={30} strokeWidth={3} />
                </motion.div>
                <h2 className="font-display text-[24px] font-black">המגרש נקנה!</h2>
                <p className="text-[13px] text-muted-foreground mt-0.5">
                  {isTransfer ? 'המקום שלך — המוכר קיבל עדכון' : 'המגרש כולו שלך — תביא את החברה'}
                </p>
              </div>

              {/* Booking details */}
              <div className="rounded-3xl border border-border bg-bgWarm overflow-hidden mb-4">
                <div className="relative h-24">
                  <img src={purchase.image_url} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
                  <div className="absolute bottom-2 right-4 text-white">
                    <div className="font-bold text-[15px]">{purchase.club_name}</div>
                    <div className="text-[11.5px] text-white/80">{purchase.city} · {purchase.court_label}</div>
                  </div>
                </div>
                <div className="p-4 grid grid-cols-2 gap-y-3 text-[13px]">
                  <DetailRow Icon={CalendarDays} label="מועד" value={formatMatchTime(purchase.start_time)} />
                  <DetailRow Icon={Clock} label="משך" value={`${purchase.duration_min} דק׳`} />
                  <DetailRow
                    Icon={Banknote}
                    label="שולם"
                    value={
                      <span>
                        ₪{purchase.price}
                        {saved > 0 && <span className="mr-1.5 text-[11px] font-bold text-gold-deep">חסכת ₪{saved}</span>}
                      </span>
                    }
                  />
                  <DetailRow Icon={BadgeCheck} label="הזמנה" value={purchase.order_number} />
                </div>
              </div>

              {/* Players */}
              <h3 className="font-display text-[15px] font-black mb-2">השחקנים במשחק</h3>
              <div className="rounded-3xl border border-border bg-card p-3.5 mb-4">
                <div className="flex flex-col gap-2.5">
                  <PlayerRow avatar={me.avatar_url} name={`${me.full_name} (אתה)`} sub={me.level} highlight />
                  {others.map((p) => (
                    <PlayerRow key={p.id} avatar={p.avatar_url} name={p.full_name} sub={`${p.level} · ${p.city}`} />
                  ))}
                  {invited.map((ph) => (
                    <PlayerRow key={ph} name={ph} sub="הזמנה נשלחה · ממתין" pending />
                  ))}
                  {Array.from({ length: Math.max(0, emptySlots) }).map((_, i) => (
                    <div key={`e${i}`} className="flex items-center gap-3 opacity-60">
                      <div className="w-9 h-9 rounded-full border-2 border-dashed border-brand/40 bg-brand-softer flex items-center justify-center text-brand font-bold">+</div>
                      <span className="text-[13px] text-muted-foreground">מקום פנוי</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Invite by phone */}
              <h3 className="font-display text-[15px] font-black mb-1">הזמן שחקן למשחק</h3>
              <p className="text-[12px] text-muted-foreground mb-2.5">
                הזן מספר טלפון — נשלח לו הזמנה עם כל פרטי המשחק
              </p>
              <div className="flex items-center gap-2 mb-5">
                <div className="flex-1 flex items-center gap-2 rounded-2xl border border-border bg-bgWarm px-3.5 h-12">
                  <Phone size={15} className="text-muted-foreground flex-shrink-0" />
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/[^\d-]/g, ''))}
                    onKeyDown={(e) => e.key === 'Enter' && sendInvite()}
                    inputMode="tel"
                    dir="ltr"
                    placeholder="052-1234567"
                    className="flex-1 bg-transparent outline-none text-[15px] text-left"
                  />
                </div>
                <button
                  onClick={sendInvite}
                  disabled={!phone.trim()}
                  className="h-12 px-4 rounded-2xl bg-brand text-white font-bold inline-flex items-center gap-1.5 active:scale-95 transition-transform disabled:opacity-40"
                >
                  <Send size={15} />
                  הזמן
                </button>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => { onClose(); navigate('/my-games'); }}
                  className="flex-1 h-12 rounded-full bg-brand text-white font-bold active:scale-[0.98] transition-transform"
                >
                  להזמנות שלי
                </button>
        <button
          onClick={onClose}
          className="flex-1 h-12 rounded-full border border-border bg-card font-bold active:scale-[0.98] transition-transform"
        >
          חזרה לשוק
        </button>
      </div>
    </div>
  );
}

function DetailRow({ Icon, label, value }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="w-8 h-8 rounded-xl bg-brand-softer text-brand flex items-center justify-center flex-shrink-0">
        <Icon size={14} strokeWidth={2} />
      </span>
      <span>
        <span className="block text-[10.5px] text-muted-foreground font-semibold">{label}</span>
        <span className="block font-bold">{value}</span>
      </span>
    </div>
  );
}

function PlayerRow({ avatar, name, sub, highlight, pending }) {
  return (
    <div className="flex items-center gap-3">
      {avatar ? (
        <img src={avatar} alt="" className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm" />
      ) : (
        <div className={`w-9 h-9 rounded-full flex items-center justify-center ${pending ? 'bg-gold-soft text-gold-deep' : 'bg-brand-soft text-brand'}`}>
          <Phone size={14} />
        </div>
      )}
      <div className="min-w-0">
        <div className={`text-[13.5px] font-bold truncate ${highlight ? 'text-brand' : ''}`} dir={pending ? 'ltr' : undefined}>{name}</div>
        <div className="text-[11px] text-muted-foreground">{sub}</div>
      </div>
      {pending && (
        <span className="mr-auto text-[10.5px] font-bold bg-gold-soft text-gold-deep rounded-full px-2 py-0.5">ממתין</span>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sell sheet — pick club, court, day and hour; persists the listing so it
// shows in "המגרש שלך בשוק" + MyGames. Scrollable with a sticky submit so the
// publish button is always reachable above the tab bar.
// ---------------------------------------------------------------------------
const SELL_HOURS = ['17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];
const ORIGINAL_PRICE = 180;

function SellSheet({ open, onClose, onListed }) {
  const [clubId, setClubId] = useState(CLUBS[0].id);
  const [court, setCourt] = useState('3');
  const [day, setDay] = useState('today'); // today | tomorrow
  const [hour, setHour] = useState('20:00');
  const [price, setPrice] = useState('');

  const club = CLUBS.find((c) => c.id === clubId) || CLUBS[0];

  const submit = () => {
    const start = new Date();
    if (day === 'tomorrow') start.setDate(start.getDate() + 1);
    const [h, m] = hour.split(':').map(Number);
    start.setHours(h, m, 0, 0);

    const listing = addMyListing({
      club_name: club.name,
      court_label: `מגרש ${court} · ${club.indoor ? 'מקורה' : 'חוץ'}`,
      start_time: start.toISOString(),
      duration_min: 90,
      original_price: ORIGINAL_PRICE,
      price: Number(price),
    });
    toast.success('המגרש פורסם בשוק!', {
      description: 'הוא מוצג עכשיו לכל השחקנים — נעדכן אותך כשמישהו יתפוס',
    });
    onListed(listing);
    setPrice('');
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="fixed inset-0 bg-black/40 z-[55]"
          />
          <motion.div
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-card rounded-t-3xl z-[60] max-h-[88dvh] flex flex-col"
          >
            <div className="overflow-y-auto p-5 pb-2">
              <div className="w-10 h-1 rounded-full bg-border mx-auto mb-5" />
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-display text-xl font-black">מכירת מגרש מהירה</h3>
                <button onClick={onClose} aria-label="סגור"><X size={20} className="text-muted-foreground" /></button>
              </div>
              <p className="text-[13px] text-muted-foreground mb-5">
                לא מצליח להגיע? פרסם את המגרש שהזמנת ותן לשחקן אחר לתפוס אותו — תקבל את הכסף בחזרה.
              </p>

              <label className="block text-[13px] font-bold mb-1.5">מועדון</label>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {CLUBS.slice(0, 4).map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setClubId(c.id)}
                    className={`rounded-2xl border px-3 py-2.5 text-right text-[12.5px] font-bold transition-colors active:scale-[0.98] ${
                      clubId === c.id ? 'border-brand bg-brand-softer text-brand' : 'border-border bg-bgWarm'
                    }`}
                  >
                    {c.name}
                    <span className="block text-[10.5px] font-semibold text-muted-foreground mt-0.5">{c.city}</span>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block text-[13px] font-bold mb-1.5">מספר מגרש</label>
                  <div className="flex items-center gap-1.5">
                    {['1', '2', '3', '4'].map((n) => (
                      <button
                        key={n}
                        onClick={() => setCourt(n)}
                        className={`flex-1 h-10 rounded-xl border font-display font-black text-[15px] transition-colors active:scale-95 ${
                          court === n ? 'border-brand bg-brand text-white' : 'border-border bg-bgWarm'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-[13px] font-bold mb-1.5">יום</label>
                  <div className="flex items-center gap-1.5">
                    {[{ id: 'today', label: 'היום' }, { id: 'tomorrow', label: 'מחר' }].map((d) => (
                      <button
                        key={d.id}
                        onClick={() => setDay(d.id)}
                        className={`flex-1 h-10 rounded-xl border text-[13px] font-bold transition-colors active:scale-95 ${
                          day === d.id ? 'border-brand bg-brand text-white' : 'border-border bg-bgWarm'
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <label className="block text-[13px] font-bold mb-1.5">שעה</label>
              <div className="flex items-center gap-1.5 mb-4 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                {SELL_HOURS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setHour(t)}
                    className={`flex-shrink-0 h-10 px-3.5 rounded-xl border font-display font-black text-[13.5px] tabular-nums transition-colors active:scale-95 ${
                      hour === t ? 'border-brand bg-brand text-white' : 'border-border bg-bgWarm'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <label className="block text-[13px] font-bold mb-1.5">מחיר מבוקש (₪)</label>
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value.replace(/\D/g, ''))}
                inputMode="numeric"
                placeholder="לדוגמה: 120"
                className="w-full rounded-2xl border border-border px-4 h-12 text-[15px] outline-none focus:border-brand mb-2"
              />
              <p className="text-[12px] text-muted-foreground">המחיר המקורי ששילמת: ₪{ORIGINAL_PRICE}</p>
            </div>

            {/* Sticky submit — never hidden behind the tab bar or the keyboard */}
            <div className="p-5 pt-3 border-t border-border bg-card rounded-b-none">
              <button
                onClick={submit}
                disabled={!price}
                className="w-full bg-brand text-white h-12 rounded-full font-bold active:scale-[0.98] transition-transform disabled:opacity-40"
              >
                פרסם בשוק · {club.name.split(' ').slice(0, 2).join(' ')} · {day === 'today' ? 'היום' : 'מחר'} {hour}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
