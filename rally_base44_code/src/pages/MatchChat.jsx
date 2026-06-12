import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Phone, Send, MapPin, Clock, Star, Users, Lock, Check, X, UserPlus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';
import { MATCHES, FINISHED_MATCH, CHAT_MESSAGES, PLAYERS } from '@/data/mockData';
import { getJoinedMatchIds } from '@/data/gamesHistory';
import { getJoinRequest, getIncomingRequest, decideIncoming } from '@/data/joinRequests';
import LevelTag from '@/components/LevelTag';
import SlideToJoin from '@/components/SlideToJoin';

const fmtTime = iso => new Date(iso).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
const fmtDate = iso => new Date(iso).toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'numeric' });

// Match page — chat is members-only.
//
// Membership ladder:
//   visitor — not in the game: sees the match summary + slide-to-request.
//   pending — request sent: chat stays locked until the host approves
//             (the demo host approves a few seconds after the request).
//   member  — joined / approved / host / finished match: full chat + phones.
//
// The host additionally sees incoming join requests and approves or declines
// them — the other half of the quick-fill flow.
export default function MatchChat() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('rally_user') || '{}');

  // Static catalog matches resolve instantly; matches the user created via
  // AddMatch live in the mock DB and arrive through the query.
  const staticMatch = useMemo(
    () => (id === 'm0' ? FINISHED_MATCH : MATCHES.find(m => m.id === id)),
    [id],
  );
  const { data: dbMatch, isLoading: loadingDb } = useQuery({
    queryKey: ['match', id],
    queryFn: () => base44.entities.Match.get(id),
    enabled: !staticMatch,
  });
  const match = staticMatch || dbMatch || null;

  // --- membership state -----------------------------------------------------
  const [request, setRequest] = useState(() => getJoinRequest(id));
  const joined = useMemo(
    () => getJoinedMatchIds().includes(id),
    [id, request], // eslint-disable-line react-hooks/exhaustive-deps
  );
  const isHost = match?.host_id === 'me';
  const ended = !!match && (
    match.status === 'completed' ||
    new Date(match.start_time).getTime() + (match.duration_min || 90) * 60000 < Date.now()
  );
  const isMember = ended || isHost || joined || request?.status === 'approved';
  const isPending = !isMember && request?.status === 'pending';

  // While pending — watch for the host's approval, then celebrate + unlock.
  useEffect(() => {
    if (!isPending) return;
    const t = setInterval(() => {
      const r = getJoinRequest(id);
      if (r?.status === 'approved') {
        setRequest({ ...r });
        toast.success('מנהל המשחק אישר אותך!', { description: 'הצ׳אט ופרטי השחקנים נפתחו' });
        confetti({ particleCount: 90, spread: 75, origin: { y: 0.6 } });
      }
    }, 1000);
    return () => clearInterval(t);
  }, [isPending, id]);

  // --- host side: incoming join request --------------------------------------
  const incoming = useMemo(() => (isHost ? getIncomingRequest(match) : null), [isHost, match]);
  const [incomingDecision, setIncomingDecision] = useState(null);
  const [incomingVisible, setIncomingVisible] = useState(false);

  useEffect(() => {
    if (!incoming) return;
    if (incoming.decision) {
      // Already decided in a previous visit — show the panel in its end state.
      setIncomingDecision(incoming.decision);
      setIncomingVisible(true);
      return;
    }
    // Fresh request "arrives" a moment after the host opens the page.
    const t = setTimeout(() => {
      setIncomingVisible(true);
      toast('בקשת הצטרפות חדשה', { description: `${incoming.player.full_name} רוצה להצטרף למשחק שלך` });
    }, 3000);
    return () => clearTimeout(t);
  }, [incoming]);

  const alreadyRated = !!JSON.parse(localStorage.getItem('rally_ratings_done') || '{}')[id];

  const me = { id: 'me', full_name: user.full_name || 'אבישי', avatar_url: user.avatar_url, level: user.level || 'B2', phone: user.phone || '050-1234567' };
  const roster = [
    ...(match?.players || []),
    me,
    ...(incomingDecision === 'approved' && incoming ? [{ ...incoming.player }] : []),
  ];
  const byId = Object.fromEntries([...PLAYERS, me].map(p => [p.id, p]));

  const [messages, setMessages] = useState(() =>
    staticMatch || id === 'm0'
      ? CHAT_MESSAGES.map(m => ({ ...m, at: Date.now() - m.minutes_ago * 60000 }))
      : [{ id: 'sys0', system: true, text: 'המשחק פורסם — הודעות של חברי המשחק יופיעו כאן', at: Date.now() }],
  );
  const [draft, setDraft] = useState('');

  const send = () => {
    if (!draft.trim()) return;
    setMessages(ms => [...ms, { id: `local${ms.length}`, sender_id: 'me', text: draft.trim(), at: Date.now() }]);
    setDraft('');
  };

  const decide = (decision) => {
    if (!incoming) return;
    decideIncoming(match.id, incoming.player.id, decision);
    setIncomingDecision(decision);
    if (decision === 'approved') {
      toast.success(`אישרת את ${incoming.player.full_name}`, { description: 'הוא צורף למשחק ורואה עכשיו את הצ׳אט' });
      setMessages(ms => [...ms, { id: `sys${Date.now()}`, system: true, text: `${incoming.player.full_name} הצטרף למשחק`, at: Date.now() }]);
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.35 } });
    } else {
      toast(`דחית את הבקשה של ${incoming.player.full_name}`);
    }
  };

  if (!match) {
    return (
      <div dir="rtl" className="min-h-screen bg-background flex items-center justify-center">
        {loadingDb ? <div className="loader" /> : (
          <div className="text-center px-8">
            <div className="font-display text-[18px] font-black mb-2">המשחק לא נמצא</div>
            <button onClick={() => navigate('/find')} className="text-brand font-bold text-[14px]">חזרה למשחקים</button>
          </div>
        )}
      </div>
    );
  }

  const host = byId[match.host_id] || match.players?.[0];

  return (
    <div dir="rtl" className="min-h-screen bg-background flex flex-col max-w-md mx-auto">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 pt-5 pb-3 sticky top-0 z-10">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-muted flex items-center justify-center active:scale-90">
            <ArrowRight size={17} />
          </button>
          <div className="flex-1 min-w-0">
            <div className="font-display font-black text-[17px] truncate">{match.club_name}</div>
            <div className="text-[12px] text-muted-foreground flex items-center gap-2">
              <span className="flex items-center gap-0.5"><Clock size={11} />{fmtDate(match.start_time)} · {fmtTime(match.start_time)}</span>
              <span className="flex items-center gap-0.5"><MapPin size={11} />{match.city}</span>
            </div>
          </div>
          <LevelTag level={match.level} size="sm" />
        </div>

        {/* Roster — phones only for members */}
        <div className="bg-muted/50 rounded-2xl p-3">
          <div className="flex items-center gap-1.5 text-[11.5px] font-bold text-muted-foreground mb-2">
            {isMember
              ? <><Users size={12} /> השחקנים · מספרי טלפון גלויים לחברי המשחק</>
              : <><Lock size={12} /> השחקנים · הטלפונים ייחשפו אחרי אישור המנהל</>}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {roster.map(p => (
              isMember ? (
                <a
                  key={p.id}
                  href={`tel:${p.phone?.replace(/-/g, '')}`}
                  className="flex items-center gap-2 bg-card border border-border rounded-xl px-2.5 py-2 active:scale-[0.97] transition-transform"
                >
                  {p.avatar_url
                    ? <img src={p.avatar_url} className="w-8 h-8 rounded-full object-cover" alt={p.full_name} />
                    : <div className="w-8 h-8 rounded-full bg-brand-softer text-brand text-[11px] font-bold flex items-center justify-center">{p.full_name[0]}</div>}
                  <div className="min-w-0 flex-1">
                    <div className="text-[12px] font-bold truncate">
                      {p.id === 'me' ? `${p.full_name} (אתה)` : p.full_name}
                      {p.id === match.host_id && <span className="text-[hsl(var(--gold-deep))]"> · מארח</span>}
                    </div>
                    <div className="text-[11px] text-muted-foreground flex items-center gap-1" dir="ltr">
                      <Phone size={10} />{p.phone}
                    </div>
                  </div>
                </a>
              ) : (
                <div key={p.id} className="flex items-center gap-2 bg-card border border-border rounded-xl px-2.5 py-2">
                  {p.avatar_url
                    ? <img src={p.avatar_url} className="w-8 h-8 rounded-full object-cover" alt={p.full_name} />
                    : <div className="w-8 h-8 rounded-full bg-brand-softer text-brand text-[11px] font-bold flex items-center justify-center">{p.full_name[0]}</div>}
                  <div className="min-w-0 flex-1">
                    <div className="text-[12px] font-bold truncate">
                      {p.id === 'me' ? `${p.full_name} (אתה)` : p.full_name}
                      {(p.id === match.host_id || p.id === match.players?.[0]?.id) && <span className="text-[hsl(var(--gold-deep))]"> · מנהל</span>}
                    </div>
                    <div className="text-[11px] text-muted-foreground"><LevelTag level={p.level} size="xs" /></div>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      </div>

      {/* Host: incoming join request */}
      {isHost && incoming && (
        <AnimatePresence>
          {incomingVisible && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              className={`mx-4 mt-3 rounded-2xl border p-3.5 ${
                incomingDecision === 'approved' ? 'bg-brand-softer border-brand/25'
                : incomingDecision === 'declined' ? 'bg-muted/60 border-border'
                : 'bg-gold-soft border-[hsl(var(--gold))]/40 shadow-md'
              }`}
            >
              <div className="flex items-center gap-1.5 text-[11px] font-bold mb-2.5 text-[#8a6d3b]">
                <UserPlus size={12} />
                {incomingDecision === 'approved' ? 'בקשה אושרה' : incomingDecision === 'declined' ? 'בקשה נדחתה' : 'בקשת הצטרפות — ממתינה לאישור שלך'}
              </div>
              <div className="flex items-center gap-3">
                <img src={incoming.player.avatar_url} alt={incoming.player.full_name} className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm" />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-[14px] truncate">{incoming.player.full_name}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <LevelTag level={incoming.player.level} size="xs" />
                    <span className="text-[11px] text-muted-foreground">{incoming.player.games_played} משחקים · דירוג {incoming.player.rally_rating}</span>
                  </div>
                </div>
                {incomingDecision === null ? (
                  <div className="flex gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => decide('declined')}
                      className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center active:scale-90 transition-transform"
                    >
                      <X size={17} className="text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => decide('approved')}
                      className="w-10 h-10 rounded-full bg-brand text-white flex items-center justify-center shadow-md active:scale-90 transition-transform"
                    >
                      <Check size={18} strokeWidth={2.5} />
                    </button>
                  </div>
                ) : (
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${
                    incomingDecision === 'approved' ? 'bg-brand text-white' : 'bg-muted text-muted-foreground'
                  }`}>
                    {incomingDecision === 'approved' ? 'במשחק ✓' : 'נדחה'}
                  </span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Post-match rating gate */}
      {isMember && ended && !alreadyRated && (
        <motion.button
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          onClick={() => navigate(`/rate-players?match=${match.id}`)}
          className="mx-4 mt-3 bg-gradient-to-l from-[hsl(var(--gold-deep))] to-[hsl(var(--gold))] text-white rounded-2xl px-4 py-3.5 flex items-center gap-3 shadow-lg active:scale-[0.98] transition-transform"
        >
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
            <Star size={19} fill="currentColor" />
          </div>
          <div className="flex-1 text-right">
            <div className="font-bold text-[14.5px]">המשחק הסתיים — דרג את החברים</div>
            <div className="text-[12px] opacity-85">4 שאלות, חצי דקה. הדירוג שלך בונה את הרמות של כולם</div>
          </div>
        </motion.button>
      )}
      {isMember && ended && alreadyRated && (
        <div className="mx-4 mt-3 bg-brand-softer text-brand rounded-2xl px-4 py-3 text-[13px] font-bold text-center">
          ✓ דירגת את המשחק הזה — תודה! הנתונים כבר עובדים בשבילך
        </div>
      )}

      {isMember ? (
        <>
          {/* Chat */}
          <div className="flex-1 px-4 py-4 space-y-2.5 overflow-y-auto">
            {messages.map(m => {
              if (m.system) {
                return (
                  <div key={m.id} className="flex justify-center">
                    <span className="text-[11px] font-bold text-muted-foreground bg-muted rounded-full px-3 py-1">{m.text}</span>
                  </div>
                );
              }
              const sender = byId[m.sender_id] || me;
              const mine = m.sender_id === 'me';
              return (
                <div key={m.id} className={`flex gap-2 ${mine ? 'flex-row-reverse' : ''}`}>
                  {!mine && (
                    sender.avatar_url
                      ? <img src={sender.avatar_url} className="w-7 h-7 rounded-full object-cover mt-1" alt={sender.full_name} />
                      : <div className="w-7 h-7 rounded-full bg-brand-softer text-brand text-[10px] font-bold flex items-center justify-center mt-1">{sender.full_name[0]}</div>
                  )}
                  <div className={`max-w-[75%] rounded-2xl px-3.5 py-2 ${mine ? 'bg-brand text-white rounded-tl-md' : 'bg-card border border-border rounded-tr-md'}`}>
                    {!mine && <div className="text-[10.5px] font-bold text-[hsl(var(--gold-deep))] mb-0.5">{sender.full_name}</div>}
                    <div className="text-[13.5px] leading-snug">{m.text}</div>
                    <div className={`text-[10px] mt-0.5 ${mine ? 'text-white/60' : 'text-muted-foreground'}`}>{fmtTime(new Date(m.at).toISOString())}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Composer */}
          <div className="sticky bottom-0 bg-card border-t border-border px-4 py-3 flex items-center gap-2">
            <input
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="כתוב הודעה לקבוצה..."
              className="flex-1 h-11 rounded-full bg-muted px-4 text-[14px] focus:outline-none focus:ring-1 focus:ring-brand"
            />
            <button
              onClick={send}
              disabled={!draft.trim()}
              className="w-11 h-11 rounded-full bg-brand text-white flex items-center justify-center active:scale-90 transition-transform disabled:opacity-40"
            >
              <Send size={17} className="-scale-x-100" />
            </button>
          </div>
        </>
      ) : isPending ? (
        /* Pending — the request sits with the host; chat stays locked */
        <div className="flex-1 flex flex-col items-center justify-center text-center px-8 pb-16">
          <div className="relative mb-5">
            <span className="absolute inset-0 rounded-full bg-[hsl(var(--gold))]/40 animate-ping" />
            {host?.avatar_url
              ? <img src={host.avatar_url} alt={host.full_name} className="relative w-20 h-20 rounded-full object-cover border-4 border-[hsl(var(--gold))]" />
              : <div className="relative w-20 h-20 rounded-full bg-gold-soft border-4 border-[hsl(var(--gold))] flex items-center justify-center"><Lock size={26} className="text-[hsl(var(--gold-deep))]" /></div>}
          </div>
          <h2 className="font-display text-[20px] font-black">ממתין לאישור המנהל</h2>
          <p className="text-[13.5px] text-muted-foreground mt-2 max-w-[270px] leading-relaxed">
            {host?.full_name || 'מנהל המשחק'} קיבל את בקשת ההצטרפות שלך.
            הצ׳אט, הטלפונים ופרטי המשחק ייפתחו ברגע שיאשר אותך.
          </p>
          <div className="flex gap-1.5 mt-5">
            {[0, 1, 2].map(i => (
              <motion.span
                key={i}
                animate={{ opacity: [0.25, 1, 0.25] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.25 }}
                className="w-2 h-2 rounded-full bg-[hsl(var(--gold-deep))]"
              />
            ))}
          </div>
          <div className="flex items-center gap-1.5 text-[11.5px] text-muted-foreground mt-6 bg-bgWarm rounded-full px-3.5 py-1.5">
            <Lock size={11} />
            הצ׳אט נעול עד לאישור — נעדכן אותך כאן ברגע שזה קורה
          </div>
        </div>
      ) : (
        /* Visitor — not in the game: ask to join right from here */
        <div className="flex-1 flex flex-col justify-center px-5 pb-16">
          <div className="bg-card border border-border rounded-3xl p-5 shadow-sm">
            <div className="w-14 h-14 rounded-full bg-brand-softer flex items-center justify-center mx-auto mb-3">
              <Lock size={22} className="text-brand" />
            </div>
            <h2 className="font-display text-[19px] font-black text-center">הצ׳אט פתוח לחברי המשחק</h2>
            <p className="text-[13.5px] text-muted-foreground text-center mt-1.5 mb-5 leading-relaxed">
              שלח בקשת הצטרפות למנהל המשחק — ברגע שיאשר אותך ייפתחו הצ׳אט ופרטי השחקנים
            </p>
            <SlideToJoin
              matchId={match.id}
              requestMode
              onJoin={() => setRequest(getJoinRequest(match.id))}
            />
          </div>
        </div>
      )}
    </div>
  );
}
