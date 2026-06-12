import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MapPin, Banknote, Check, Lock, MessageCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';
import LevelTag from '@/components/LevelTag';
import SlideToJoin from '@/components/SlideToJoin';
import { getJoinRequest } from '@/data/joinRequests';
import { formatMatchTime } from '@/lib/format';

// Quick-fill join popup ("מילוי מהיר — חסר שחקן אחד").
//
// Three phases, driven by the join-request state:
//   idle     — match summary + slide-to-request.
//   pending  — the request sits with the match host; polls until he approves.
//   approved — celebrate + open the now-unlocked match chat.
export default function QuickJoinSheet({ match, open, onClose, onChanged }) {
  const navigate = useNavigate();
  const [phase, setPhase] = useState('idle');

  // Sync phase with stored request state whenever the sheet opens.
  useEffect(() => {
    if (!open || !match) return;
    const status = getJoinRequest(match.id)?.status;
    setPhase(status === 'approved' ? 'approved' : status === 'pending' ? 'pending' : 'idle');
  }, [open, match]);

  // While pending — watch for the host's approval.
  useEffect(() => {
    if (!open || phase !== 'pending' || !match) return;
    const t = setInterval(() => {
      if (getJoinRequest(match.id)?.status === 'approved') {
        setPhase('approved');
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.78 } });
        toast.success('מנהל המשחק אישר אותך!', { description: 'צ׳אט המשחק נפתח עבורך' });
        onChanged?.();
      }
    }, 1000);
    return () => clearInterval(t);
  }, [open, phase, match, onChanged]);

  if (!match) return null;

  const players = match.players || [];
  const host = players[0];

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
            className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-card rounded-t-3xl z-[60] p-5 pb-8"
          >
            <div className="w-10 h-1 rounded-full bg-border mx-auto mb-4" />

            {phase === 'idle' && (
              <>
                {/* Match header */}
                <div className="relative h-28 rounded-2xl overflow-hidden mb-4">
                  <img src={match.club_image} alt={match.club_name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute top-2.5 left-2.5"><LevelTag level={match.level} size="sm" /></div>
                  <div className="absolute bottom-2.5 right-3 left-3 text-white">
                    <div className="font-display text-[18px] font-black leading-tight">{match.club_name}</div>
                    <div className="flex items-center gap-3 text-[12px] text-white/80 mt-0.5">
                      <span className="flex items-center gap-1"><MapPin size={11} />{match.city} · {match.drive_minutes} דק׳</span>
                      <span className="flex items-center gap-1"><Clock size={11} />{formatMatchTime(match.start_time)}</span>
                      {match.price_per_player != null && (
                        <span className="flex items-center gap-1"><Banknote size={11} />₪{match.price_per_player}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* The open spot */}
                <div className="flex items-center gap-3 bg-bgWarm rounded-2xl p-3 mb-3">
                  <div className="flex -space-x-2 space-x-reverse flex-shrink-0">
                    {players.slice(0, 3).map((p) => (
                      <img key={p.id} src={p.avatar_url} alt={p.full_name} className="w-9 h-9 rounded-full border-2 border-white object-cover" />
                    ))}
                    <div className="w-9 h-9 rounded-full border-2 border-dashed border-[hsl(var(--gold))] bg-gold-soft flex items-center justify-center text-[hsl(var(--gold-deep))] text-[15px] font-bold animate-pulse">
                      +
                    </div>
                  </div>
                  <div className="text-[13px] font-bold leading-snug">
                    חסר שחקן אחד —<br />
                    <span className="text-[hsl(var(--gold-deep))]">המקום הזה יכול להיות שלך</span>
                  </div>
                </div>

                {/* Host — the request goes to him */}
                {host && (
                  <div className="flex items-center gap-3 border border-border rounded-2xl p-3 mb-4">
                    <img src={host.avatar_url} alt={host.full_name} className="w-10 h-10 rounded-full object-cover" />
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] text-muted-foreground">מנהל המשחק</div>
                      <div className="font-bold text-[14px] truncate">{host.full_name}</div>
                    </div>
                    <LevelTag level={host.level} size="xs" />
                  </div>
                )}

                <SlideToJoin matchId={match.id} requestMode onJoin={() => { setPhase('pending'); onChanged?.(); }} />
                <p className="flex items-center justify-center gap-1.5 text-[11.5px] text-muted-foreground mt-3">
                  <Lock size={11} />
                  הצ׳אט ופרטי השחקנים ייפתחו רק אחרי שמנהל המשחק יאשר אותך
                </p>
              </>
            )}

            {phase === 'pending' && (
              <div className="flex flex-col items-center text-center pt-2">
                <div className="relative mb-4">
                  <span className="absolute inset-0 rounded-full bg-[hsl(var(--gold))]/40 animate-ping" />
                  {host?.avatar_url
                    ? <img src={host.avatar_url} alt={host.full_name} className="relative w-20 h-20 rounded-full object-cover border-4 border-[hsl(var(--gold))]" />
                    : <div className="relative w-20 h-20 rounded-full bg-gold-soft border-4 border-[hsl(var(--gold))]" />}
                </div>
                <h3 className="font-display text-[20px] font-black">ממתין לאישור המנהל</h3>
                <p className="text-[13.5px] text-muted-foreground mt-1.5 max-w-[270px] leading-relaxed">
                  {host?.full_name || 'מנהל המשחק'} קיבל את הבקשה שלך.
                  ברגע שיאשר — ייפתחו לך צ׳אט המשחק ופרטי השחקנים.
                </p>
                <div className="flex gap-1.5 mt-4">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      animate={{ opacity: [0.25, 1, 0.25] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.25 }}
                      className="w-2 h-2 rounded-full bg-[hsl(var(--gold-deep))]"
                    />
                  ))}
                </div>
                <div className="flex items-center gap-1.5 text-[11.5px] text-muted-foreground mt-4 bg-bgWarm rounded-full px-3.5 py-1.5">
                  <Lock size={11} />
                  הצ׳אט נעול עד לאישור
                </div>
                <div className="grid grid-cols-2 gap-2 w-full mt-5">
                  <button
                    onClick={onClose}
                    className="py-3 rounded-full border border-border font-bold text-[14px] active:scale-[0.97] transition-transform"
                  >
                    סגור
                  </button>
                  <button
                    onClick={() => { onClose?.(); navigate(`/match/${match.id}`); }}
                    className="py-3 rounded-full bg-brand text-white font-bold text-[14px] active:scale-[0.97] transition-transform"
                  >
                    לעמוד המשחק
                  </button>
                </div>
              </div>
            )}

            {phase === 'approved' && (
              <div className="flex flex-col items-center text-center pt-2">
                <motion.div
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 16 }}
                  className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mb-4 shadow-lg"
                >
                  <Check size={36} className="text-white" strokeWidth={3} />
                </motion.div>
                <h3 className="font-display text-[20px] font-black">אושרת! אתה במשחק</h3>
                <p className="text-[13.5px] text-muted-foreground mt-1.5 max-w-[260px] leading-relaxed">
                  המשחק נוסף למשחקים שלי וליומן, וצ׳אט המשחק פתוח עבורך.
                </p>
                <button
                  onClick={() => { onClose?.(); navigate(`/match/${match.id}`); }}
                  className="w-full mt-5 py-3.5 rounded-full bg-brand text-white font-bold text-[15px] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
                >
                  <MessageCircle size={17} />
                  פתח את צ׳אט המשחק
                </button>
                <button onClick={onClose} className="mt-2.5 text-[13px] font-bold text-muted-foreground">
                  סגור
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
