import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, CalendarDays, Clock, MapPin, Banknote, ChevronLeft,
  TrendingUp, TrendingDown, Star, Percent, Timer, Eye, Share2, BadgeCheck,
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { getPurchases, getMyListings, listingViews } from '@/lib/marketStore';
import { FINISHED_MATCH, DEFAULT_USER } from '@/data/mockData';
import {
  GAMES_HISTORY, getJoinedMatchIds, getHistorySummary, historyDateLabel,
} from '@/data/gamesHistory';
import { formatMatchTime, timeUntil } from '@/lib/format';
import LevelTag from '@/components/LevelTag';
import RallyImage from '@/components/RallyImage';
import { BallIcon, SearchIcon, PlusIcon } from '@/components/icons';

const spring = { type: 'spring', stiffness: 280, damping: 26 };

const TABS = [
  { id: 'upcoming', label: 'הבאים' },
  { id: 'history', label: 'היסטוריה' },
];

export default function MyGames() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('upcoming');
  const user = { ...DEFAULT_USER, ...JSON.parse(localStorage.getItem('rally_user') || '{}') };

  const { data: matches = [] } = useQuery({
    queryKey: ['matches', 'all'],
    queryFn: () => base44.entities.Match.list('start_time', 100),
  });

  // Market activity — courts I bought + courts I'm selling (still listed).
  const purchases = useMemo(
    () => getPurchases().filter((p) => new Date(p.start_time).getTime() > Date.now() - 30 * 60000),
    [],
  );
  const myListings = useMemo(() => getMyListings(), []);

  const joinedIds = useMemo(() => getJoinedMatchIds(), []);
  const upcoming = useMemo(
    () =>
      matches
        .filter((m) => joinedIds.includes(m.id))
        .filter((m) => new Date(m.start_time).getTime() > Date.now() - 30 * 60000)
        .sort((a, b) => new Date(a.start_time) - new Date(b.start_time)),
    [matches, joinedIds],
  );

  // Finished match is "unrated" until the rating flow marks it done.
  const ratedMap = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('rally_ratings_done') || '{}'); } catch { return {}; }
  }, []);

  const summary = getHistorySummary();

  return (
    <div dir="rtl" className="min-h-screen bg-background max-w-md mx-auto pb-10">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-5 pb-4">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center active:scale-90"
        >
          <ArrowRight size={17} />
        </button>
        <h1 className="font-display text-[22px] font-black flex-1">המשחקים שלי</h1>
        <button
          onClick={() => navigate('/calendar')}
          className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center active:scale-90"
        >
          <CalendarDays size={16} className="text-brand" />
        </button>
      </div>

      {/* Summary strip */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={spring}
        className="mx-5 mb-4 bg-brand-gradient ring-gold rounded-3xl shadow-luxe relative overflow-hidden"
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(80% 60% at 15% 0%, hsl(41 55% 70% / 0.14) 0%, transparent 60%)' }}
        />
        <div className="relative z-10 grid grid-cols-3 divide-x divide-x-reverse divide-white/10 py-4">
          <SummaryStat Icon={BallIcon} value={summary.gamesThisMonth} label="משחקים החודש" />
          <SummaryStat Icon={Percent} value={`${summary.winPct}%`} label="אחוז ניצחון" />
          <SummaryStat Icon={Timer} value={summary.hoursOnCourt} label="שעות מגרש" />
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="mx-5 mb-5 relative grid grid-cols-2 bg-muted rounded-full p-1">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className="relative h-10 rounded-full">
            {tab === t.id && (
              <motion.span
                layoutId="myGamesTabPill"
                transition={spring}
                className="absolute inset-0 bg-card rounded-full shadow-sm border border-border"
              />
            )}
            <span
              className={`relative z-10 text-[13.5px] font-bold transition-colors ${
                tab === t.id ? 'text-brand' : 'text-muted-foreground'
              }`}
            >
              {t.label}
              <span className="mr-1.5 text-[11px] font-black tabular-nums opacity-60">
                {t.id === 'upcoming'
                  ? upcoming.length + purchases.length + myListings.length
                  : GAMES_HISTORY.length + 1}
              </span>
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === 'upcoming' ? (
          <motion.div
            key="upcoming"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={spring}
            className="px-5 flex flex-col gap-3.5"
          >
            {myListings.map((l) => <ForSaleCard key={l.id} listing={l} />)}
            {purchases.map((p, i) => <PurchasedCard key={p.id} purchase={p} index={i} />)}
            {upcoming.length > 0 ? (
              upcoming.map((m, i) => <UpcomingCard key={m.id} match={m} index={i + purchases.length} />)
            ) : myListings.length + purchases.length > 0 ? null : (
              <EmptyState
                title="אין משחקים קרובים"
                body="הצטרף למשחק פתוח או פתח אחד משלך — המגרש מחכה."
                actions={[
                  { label: 'מצא משחק', to: '/find', primary: true, Icon: SearchIcon },
                  { label: 'פתח משחק', to: '/add-match', Icon: PlusIcon },
                ]}
              />
            )}
          </motion.div>
        ) : (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={spring}
            className="px-5 flex flex-col gap-3.5"
          >
            {GAMES_HISTORY.length > 0 || FINISHED_MATCH ? (
              <>
                {!ratedMap[FINISHED_MATCH.id] && <UnratedCard match={FINISHED_MATCH} />}
                {GAMES_HISTORY.map((g, i) => (
                  <HistoryCard key={g.id} game={g} index={i + 1} userName={user.full_name} />
                ))}
              </>
            ) : (
              <EmptyState
                title="עוד לא שיחקת משחקים"
                body="המשחק הראשון שלך במרחק החלקה אחת."
                actions={[{ label: 'מצא משחק', to: '/find', primary: true, Icon: SearchIcon }]}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SummaryStat({ Icon, value, label }) {
  return (
    <div className="flex flex-col items-center gap-0.5 px-2">
      <Icon size={16} strokeWidth={1.8} className="text-gold-light mb-0.5" />
      <span className="font-display text-[22px] font-black text-white leading-none tabular-nums">{value}</span>
      <span className="text-[10.5px] text-white/60 font-semibold">{label}</span>
    </div>
  );
}

// A court I'm selling — still listed on the market.
function ForSaleCard({ listing }) {
  const views = listingViews(listing);
  const offerText = encodeURIComponent(
    `היי! יש לי מגרש ב${listing.club_name} (${listing.court_label}) ${formatMatchTime(listing.start_time)} שאני לא מגיע אליו — ₪${listing.price} במקום ₪${listing.original_price}. רוצה לתפוס אותו? אני ב-Rally`,
  );
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring}
      className="bg-card rounded-3xl border border-[hsl(var(--gold))]/40 ring-gold shadow-gold p-4"
    >
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
      <div className="font-bold text-[14.5px]">{listing.club_name} · {listing.court_label}</div>
      <div className="flex items-center gap-3 mt-1 text-[12.5px] text-muted-foreground">
        <span className="flex items-center gap-1"><CalendarDays size={12} /> {formatMatchTime(listing.start_time)}</span>
        <span className="flex items-center gap-1.5">
          <span className="font-display text-[15px] font-black text-brand">₪{listing.price}</span>
          <span className="line-through text-[11.5px]">₪{listing.original_price}</span>
        </span>
      </div>
      <a
        href={`https://wa.me/?text=${offerText}`}
        target="_blank"
        rel="noreferrer"
        className="mt-3 w-full inline-flex items-center justify-center gap-1.5 rounded-full bg-brand text-white text-[13px] font-bold h-10 active:scale-95 transition-transform"
      >
        <Share2 size={14} />
        הצע לאנשים בהודעה
      </a>
    </motion.div>
  );
}

// A court I bought on the market — booking confirmation lives here.
function PurchasedCard({ purchase, index }) {
  const inviteText = encodeURIComponent(
    `היי! סגרתי מגרש ב${purchase.club_name} (${purchase.court_label}) ${formatMatchTime(purchase.start_time)} — בא לשחק איתנו? מצטרפים דרך Rally`,
  );
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...spring, delay: index * 0.06 }}
      className="bg-card rounded-3xl overflow-hidden border border-border shadow-sm"
    >
      <div className="relative h-28">
        <RallyImage src={purchase.image_url} alt={purchase.club_name} className="absolute inset-0" />
        <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-gold text-brand-deep text-[11px] font-bold px-2.5 py-1 shadow-gold">
          <BadgeCheck size={11} strokeWidth={2.5} />
          נרכש בשוק
        </span>
        <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-black/35 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1">
          <Clock size={11} strokeWidth={2.5} />
          {timeUntil(purchase.start_time)}
        </span>
        <div className="absolute bottom-2.5 right-4 left-4 text-white">
          <div className="font-display text-[16px] font-black leading-tight">{purchase.club_name}</div>
          <div className="text-[11.5px] text-white/80 flex items-center gap-1">
            <MapPin size={11} /> {purchase.city} · {purchase.court_label}
          </div>
        </div>
      </div>
      <div className="p-3.5">
        <div className="flex items-center gap-3 text-[12.5px] text-muted-foreground">
          <span className="flex items-center gap-1 font-semibold text-foreground">
            <Clock size={12} strokeWidth={2} />
            {formatMatchTime(purchase.start_time)}
          </span>
          <span className="flex items-center gap-1">
            <Banknote size={12} strokeWidth={2} />
            ₪{purchase.price}
          </span>
          <span>{purchase.duration_min} דק׳</span>
          <span className="mr-auto text-[10.5px] font-bold text-muted-foreground">{purchase.order_number}</span>
        </div>
        <a
          href={`https://wa.me/?text=${inviteText}`}
          target="_blank"
          rel="noreferrer"
          className="mt-3 w-full inline-flex items-center justify-center gap-1.5 rounded-full border border-brand/30 bg-brand-softer text-brand text-[13px] font-bold h-10 active:scale-95 transition-transform"
        >
          <Share2 size={14} />
          הזמן שחקנים למשחק
        </a>
      </div>
    </motion.div>
  );
}

function UpcomingCard({ match, index }) {
  const players = match.players || [];
  const max = match.max_players || 4;
  const spotsLeft = Math.max(0, max - players.length);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...spring, delay: index * 0.06 }}
    >
      <Link
        to={`/match/${match.id}`}
        className="block bg-card rounded-3xl overflow-hidden border border-border shadow-sm active:scale-[0.98] transition-transform"
      >
        <div className="relative h-32">
          <RallyImage src={match.club_image} alt={match.club_name} className="absolute inset-0" />
          <div className="absolute top-3 right-3">
            <LevelTag level={match.level} size="sm" />
          </div>
          <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-gold text-brand-deep text-[11px] font-bold px-2.5 py-1 shadow-gold">
            <Clock size={11} strokeWidth={2.5} />
            {timeUntil(match.start_time)}
          </span>
          <div className="absolute bottom-2.5 right-4 left-4 text-white">
            <div className="font-display text-[17px] font-black leading-tight">{match.club_name}</div>
            <div className="text-[11.5px] text-white/80 flex items-center gap-1">
              <MapPin size={11} /> {match.city} · {match.drive_minutes} דק׳ נסיעה
            </div>
          </div>
        </div>

        <div className="p-3.5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 text-[12.5px] text-muted-foreground">
              <span className="flex items-center gap-1 font-semibold text-foreground">
                <Clock size={12} strokeWidth={2} />
                {formatMatchTime(match.start_time)}
              </span>
              <span className="flex items-center gap-1">
                <Banknote size={12} strokeWidth={2} />
                ₪{match.price_per_player}
              </span>
              <span>{match.duration_min} דק׳</span>
            </div>
            <div className="flex items-center mt-2.5">
              <div className="flex -space-x-2 space-x-reverse">
                {players.slice(0, 4).map((p) => (
                  <img
                    key={p.id}
                    src={p.avatar_url}
                    alt={p.full_name}
                    className="w-7 h-7 rounded-full border-2 border-white object-cover"
                  />
                ))}
                {Array.from({ length: spotsLeft }).map((_, i) => (
                  <div
                    key={`empty-${i}`}
                    className="w-7 h-7 rounded-full border-2 border-dashed border-brand/40 bg-brand-softer flex items-center justify-center text-brand text-[13px] font-bold"
                  >
                    +
                  </div>
                ))}
              </div>
              <span className="mr-2.5 text-[11px] font-bold text-brand bg-brand-softer px-2 py-0.5 rounded-full">
                אתה משתתף
              </span>
            </div>
          </div>
          <ChevronLeft size={18} className="text-muted-foreground flex-shrink-0" />
        </div>
      </Link>
    </motion.div>
  );
}

function UnratedCard({ match }) {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring}
      className="bg-gold-soft border border-[hsl(var(--gold))]/40 rounded-3xl p-4 shadow-gold ring-gold"
    >
      <div className="flex items-center gap-3">
        <img
          src={match.club_image}
          alt={match.club_name}
          className="w-12 h-12 rounded-2xl object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="font-bold text-[14px] truncate">{match.club_name}</div>
          <div className="text-[11.5px] text-muted-foreground">
            הסתיים {historyDateLabel(match.start_time)} · {match.duration_min} דק׳ · {match.match_type}
          </div>
        </div>
        <div className="flex -space-x-2 space-x-reverse flex-shrink-0">
          {(match.players || []).slice(0, 3).map((p) => (
            <img key={p.id} src={p.avatar_url} alt={p.full_name} className="w-7 h-7 rounded-full border-2 border-white object-cover" />
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between mt-3">
        <span className="text-[12px] text-muted-foreground">הדירוג של כולם מחכה רק לך</span>
        <button
          onClick={() => navigate(`/rate-players?match=${match.id}`)}
          className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-l from-[hsl(var(--gold-deep))] to-[hsl(var(--gold))] text-white text-[13px] font-black px-4 py-2 shadow-gold active:scale-95 transition-transform"
        >
          <Star size={13} strokeWidth={2.5} />
          דרג שחקנים
        </button>
      </div>
    </motion.div>
  );
}

function HistoryCard({ game, index, userName }) {
  const won = game.result === 'W';
  const firstName = (n) => n?.split(' ')[0] || '';
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...spring, delay: index * 0.06 }}
      className="bg-card rounded-3xl border border-border shadow-sm p-4"
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <img src={game.club_image} alt={game.club_name} className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
          <div className="min-w-0">
            <div className="font-bold text-[14px] truncate">{game.club_name}</div>
            <div className="text-[11px] text-muted-foreground">
              {historyDateLabel(game.start_time)} · {game.duration_min} דק׳ · {game.match_type}
            </div>
          </div>
        </div>
        <span
          className={`flex-shrink-0 text-[11px] font-black px-2.5 py-1 rounded-full ${
            won ? 'bg-brand-soft text-brand' : 'bg-destructive/10 text-destructive'
          }`}
        >
          {won ? 'ניצחון' : 'הפסד'}
        </span>
      </div>

      <div className="flex items-center justify-between bg-bgWarm rounded-2xl px-3.5 py-2.5">
        <div dir="ltr" className="font-display text-[17px] font-black tabular-nums tracking-wide">
          {game.sets.map(([us, them], i) => (
            <span key={i}>
              {i > 0 && <span className="text-muted-foreground/50 mx-1.5 text-[13px]">·</span>}
              <span className={us > them ? 'text-brand' : 'text-muted-foreground'}>
                {us}-{them}
              </span>
            </span>
          ))}
        </div>
        <span
          className={`inline-flex items-center gap-1 text-[12.5px] font-black px-2.5 py-1 rounded-full ${
            game.rating_delta >= 0 ? 'bg-brand-softer text-brand' : 'bg-destructive/10 text-destructive'
          }`}
        >
          {game.rating_delta >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
          <span dir="ltr">{game.rating_delta > 0 ? `+${game.rating_delta}` : game.rating_delta}</span>
        </span>
      </div>

      <div className="flex items-center justify-between mt-3">
        <span className="text-[12px] text-muted-foreground truncate">
          {firstName(userName) || 'אתה'} ו{firstName(game.partner.full_name)} · נגד{' '}
          {firstName(game.opponents[0].full_name)} ו{firstName(game.opponents[1].full_name)}
        </span>
        <div className="flex -space-x-2 space-x-reverse flex-shrink-0">
          {[game.partner, ...game.opponents].map((p) => (
            <img key={p.id} src={p.avatar_url} alt={p.full_name} className="w-6 h-6 rounded-full border-2 border-white object-cover" />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function EmptyState({ title, body, actions }) {
  return (
    <div className="py-14 flex flex-col items-center text-center gap-3">
      <div className="w-16 h-16 rounded-full bg-brand-softer flex items-center justify-center">
        <BallIcon size={28} strokeWidth={1.6} className="text-brand" />
      </div>
      <h3 className="font-display text-[19px] font-black">{title}</h3>
      <p className="text-muted-foreground text-[13.5px] max-w-[250px] leading-relaxed">{body}</p>
      <div className="flex items-center gap-2.5 mt-1.5">
        {actions.map(({ label, to, primary, Icon }) => (
          <Link
            key={to}
            to={to}
            className={`inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full font-bold text-[13.5px] active:scale-95 transition-transform ${
              primary ? 'bg-brand text-white shadow-sm' : 'bg-card border border-border text-foreground'
            }`}
          >
            <Icon size={15} strokeWidth={2} />
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
