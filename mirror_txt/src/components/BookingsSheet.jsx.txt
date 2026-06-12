import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Plus, MapPin, Clock, UserPlus, Check, CalendarDays } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';
import LevelTag from '@/components/LevelTag';
import { getJoinedMatchIds } from '@/data/gamesHistory';
import { getInvites, sendInvite, hasPendingInvite } from '@/data/invites';
import { CourtIcon, BallIcon } from '@/components/icons';

const spring = { type: 'spring', stiffness: 280, damping: 26 };

const fmtDay = (iso) => {
  const d = new Date(iso);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const day = new Date(d); day.setHours(0, 0, 0, 0);
  const diff = Math.round((day - today) / 86400000);
  if (diff === 0) return 'היום';
  if (diff === 1) return 'מחר';
  return d.toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'numeric' });
};
const fmtTime = (iso) => new Date(iso).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });

const readBookings = () => {
  try {
    const raw = JSON.parse(localStorage.getItem('rally_bookings') || '[]');
    return Array.isArray(raw) ? raw : [];
  } catch { return []; }
};

// Home-header panel: my upcoming games + court bookings, plus inviting a
// specific player (search by name) to one of my matches.
export default function BookingsSheet({ open, onClose }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [pickingFor, setPickingFor] = useState(null); // player awaiting a match choice
  const [invites, setInvites] = useState([]);

  const { data: matches = [] } = useQuery({
    queryKey: ['matches', 'open'],
    queryFn: () => base44.entities.Match.filter({ status: 'open' }, 'start_time'),
    enabled: open,
  });
  const { data: players = [] } = useQuery({
    queryKey: ['players', 'all'],
    queryFn: () => base44.entities.Player.list('-rally_rating', 60),
    enabled: open,
  });

  // My side of the calendar: matches I'm in (joined or hosting) + court bookings.
  const myMatches = useMemo(() => {
    const joined = getJoinedMatchIds();
    return matches
      .filter((m) => joined.includes(m.id) || m.host_id === 'me')
      .sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
  }, [matches]);
  const bookings = useMemo(
    () => readBookings().filter((b) => new Date(b.date).getTime() > Date.now() - 86400000),
    [open], // eslint-disable-line react-hooks/exhaustive-deps
  );

  // Invites — refresh while open so demo acceptances appear live.
  useEffect(() => {
    if (!open) return;
    setInvites(getInvites());
    const t = setInterval(() => {
      setInvites((prev) => {
        const next = getInvites();
        const newlyAccepted = next.find(
          (n) => n.status === 'accepted' && prev.some((p) => p.id === n.id && p.status === 'pending'),
        );
        if (newlyAccepted) {
          toast.success(`${newlyAccepted.player_name} אישר את ההזמנה!`, {
            description: `נפגשים ב${newlyAccepted.club_name}`,
          });
        }
        return next;
      });
    }, 1500);
    return () => clearInterval(t);
  }, [open]);

  useEffect(() => {
    if (!open) { setSearch(''); setPickingFor(null); }
  }, [open]);

  const results = useMemo(() => {
    const q = search.trim();
    if (!q) return [];
    return players.filter((p) => (p.full_name || '').includes(q)).slice(0, 6);
  }, [players, search]);

  const invite = (player, match) => {
    if (hasPendingInvite(player.id, match.id)) {
      toast(`כבר שלחת ל${player.full_name} הזמנה למשחק הזה`);
      return;
    }
    sendInvite(player, match);
    setInvites(getInvites());
    setPickingFor(null);
    toast.success(`ההזמנה נשלחה ל${player.full_name}`, {
      description: `${match.club_name} · ${fmtDay(match.start_time)} ${fmtTime(match.start_time)}`,
    });
  };

  const startInvite = (player) => {
    if (myMatches.length === 0) {
      toast('אין לך משחק קרוב להזמין אליו', { description: 'פתח משחק חדש ואז הזמן שחקנים' });
      return;
    }
    if (myMatches.length === 1) {
      invite(player, myMatches[0]);
      return;
    }
    setPickingFor((prev) => (prev?.id === player.id ? null : player));
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-[55]"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-background rounded-t-3xl z-[60] flex flex-col"
            style={{ maxHeight: '88vh' }}
          >
            <div className="w-10 h-1 rounded-full bg-border mx-auto mt-3" />

            {/* Header */}
            <div className="flex items-center gap-3 px-5 pt-3 pb-2">
              <h2 className="font-display text-[20px] font-black flex-1">ההזמנות שלי</h2>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center active:scale-90">
                <X size={15} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 pb-8">
              {/* Quick actions */}
              <div className="grid grid-cols-2 gap-2.5 mb-5">
                <button
                  onClick={() => { onClose?.(); navigate('/add-match'); }}
                  className="py-3 rounded-2xl bg-brand text-white font-bold text-[13.5px] flex items-center justify-center gap-1.5 active:scale-[0.97] transition-transform"
                >
                  <Plus size={16} strokeWidth={2.5} /> פתח משחק
                </button>
                <button
                  onClick={() => { onClose?.(); navigate('/book-court'); }}
                  className="py-3 rounded-2xl bg-card border border-border font-bold text-[13.5px] flex items-center justify-center gap-1.5 active:scale-[0.97] transition-transform"
                >
                  <CourtIcon size={16} /> הזמן מגרש
                </button>
              </div>

              {/* My upcoming games */}
              <div className="flex items-baseline justify-between mb-2.5">
                <span className="font-bold text-[15px]">המשחקים הקרובים שלי</span>
                <button onClick={() => { onClose?.(); navigate('/my-games'); }} className="text-[12.5px] text-brand font-bold">
                  לכל המשחקים
                </button>
              </div>
              {myMatches.length === 0 && bookings.length === 0 ? (
                <div className="bg-card border border-border rounded-2xl p-4 text-center text-[13px] text-muted-foreground mb-5">
                  אין משחקים או מגרשים קרובים — פתח משחק או הזמן מגרש
                </div>
              ) : (
                <div className="space-y-2 mb-5">
                  {myMatches.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => { onClose?.(); navigate(`/match/${m.id}`); }}
                      className="w-full text-right bg-card border border-border rounded-2xl p-3 flex items-center gap-3 active:scale-[0.98] transition-transform"
                    >
                      <div className="w-11 h-11 rounded-xl bg-brand-softer text-brand flex flex-col items-center justify-center flex-shrink-0">
                        <span className="font-display text-[13px] font-black leading-none">{fmtTime(m.start_time)}</span>
                        <span className="text-[9px] mt-0.5 opacity-80">{fmtDay(m.start_time)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-[13.5px] truncate">{m.club_name}</div>
                        <div className="flex items-center gap-1 text-[11.5px] text-muted-foreground">
                          <MapPin size={10} /> {m.city}
                          {m.host_id === 'me' && <span className="text-[hsl(var(--gold-deep))] font-bold mr-1">· אתה המנהל</span>}
                        </div>
                      </div>
                      <LevelTag level={m.level} size="xs" />
                    </button>
                  ))}
                  {bookings.map((b, i) => (
                    <div key={`${b.club_id}-${b.date}-${i}`} className="bg-card border border-border rounded-2xl p-3 flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-gold-soft text-[hsl(var(--gold-deep))] flex flex-col items-center justify-center flex-shrink-0">
                        <span className="font-display text-[13px] font-black leading-none">{b.slot}</span>
                        <span className="text-[9px] mt-0.5 opacity-80">{fmtDay(b.date)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-[13.5px] truncate">{b.club_name}</div>
                        <div className="flex items-center gap-1 text-[11.5px] text-muted-foreground">
                          <CalendarDays size={10} /> מגרש {b.court} · {b.duration_min} דק׳ · ₪{b.price}
                        </div>
                      </div>
                      <span className="text-[10.5px] font-bold px-2 py-1 rounded-full bg-brand-softer text-brand flex-shrink-0">מגרש שלך</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Invite a player */}
              <div className="font-bold text-[15px] mb-1">הזמן שחקן למשחק</div>
              <p className="text-[12px] text-muted-foreground mb-2.5">
                חפש שחקן לפי שם ושלח לו בקשת הצטרפות למשחק שלך
              </p>
              <div className="flex items-center gap-2 bg-card rounded-full px-4 h-11 border border-border shadow-sm mb-3">
                <Search size={16} className="text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="שם השחקן..."
                  className="flex-1 bg-transparent outline-none text-[14px] placeholder:text-muted-foreground"
                />
                {search && (
                  <button onClick={() => setSearch('')}><X size={14} className="text-muted-foreground" /></button>
                )}
              </div>

              {search.trim() && results.length === 0 && (
                <div className="text-center text-[13px] text-muted-foreground py-4">לא נמצא שחקן בשם הזה</div>
              )}

              <div className="space-y-2 mb-5">
                {results.map((p) => (
                  <motion.div key={p.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={spring}>
                    <div className="bg-card border border-border rounded-2xl p-3 flex items-center gap-3">
                      <img src={p.avatar_url} alt={p.full_name} className="w-10 h-10 rounded-full object-cover" />
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-[13.5px] truncate">{p.full_name}</div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <LevelTag level={p.level} size="xs" />
                          <span className="text-[11px] text-muted-foreground">{p.city}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => startInvite(p)}
                        className="px-3.5 py-2 rounded-full bg-brand text-white text-[12.5px] font-bold flex items-center gap-1.5 active:scale-95 transition-transform flex-shrink-0"
                      >
                        <UserPlus size={13} /> הזמן
                      </button>
                    </div>
                    {/* Which of my matches? */}
                    <AnimatePresence>
                      {pickingFor?.id === p.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-1.5 mr-3 border-r-2 border-brand/30 pr-3 space-y-1.5">
                            <div className="text-[11.5px] font-bold text-muted-foreground">לאיזה משחק?</div>
                            {myMatches.map((m) => (
                              <button
                                key={m.id}
                                onClick={() => invite(p, m)}
                                className="w-full text-right bg-bgWarm rounded-xl px-3 py-2 text-[12.5px] font-bold flex items-center gap-2 active:scale-[0.98] transition-transform"
                              >
                                <Clock size={12} className="text-brand" />
                                {m.club_name} · {fmtDay(m.start_time)} {fmtTime(m.start_time)}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>

              {/* Sent invites */}
              {invites.length > 0 && (
                <>
                  <div className="font-bold text-[15px] mb-2.5">הזמנות ששלחת</div>
                  <div className="space-y-2">
                    {invites.map((inv) => (
                      <div key={inv.id} className="bg-card border border-border rounded-2xl p-3 flex items-center gap-3">
                        {inv.player_avatar
                          ? <img src={inv.player_avatar} alt={inv.player_name} className="w-9 h-9 rounded-full object-cover" />
                          : <div className="w-9 h-9 rounded-full bg-brand-softer text-brand text-[11px] font-bold flex items-center justify-center">{inv.player_name?.[0]}</div>}
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-[13px] truncate">{inv.player_name}</div>
                          <div className="flex items-center gap-1 text-[11px] text-muted-foreground truncate">
                            <BallIcon size={10} /> {inv.club_name} · {fmtDay(inv.start_time)} {fmtTime(inv.start_time)}
                          </div>
                        </div>
                        {inv.status === 'accepted' ? (
                          <span className="text-[10.5px] font-bold px-2.5 py-1 rounded-full bg-brand text-white flex items-center gap-1 flex-shrink-0">
                            <Check size={10} strokeWidth={3} /> אישר
                          </span>
                        ) : (
                          <span className="text-[10.5px] font-bold px-2.5 py-1 rounded-full bg-gold-soft text-[#8a6d3b] animate-pulse flex-shrink-0">
                            ממתין
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
