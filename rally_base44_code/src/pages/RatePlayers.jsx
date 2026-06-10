import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { ArrowRight, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { FINISHED_MATCH, MATCHES, PEER_AXES_HISTORY } from '@/data/mockData';
import { assignQuestions, FAIRPLAY_QUESTION, improvementSchema } from '@/data/peerQuestions';
import LevelTag from '@/components/LevelTag';

const spring = { type: 'spring', stiffness: 280, damping: 26 };
const SCALE_EMOJI = ['😅', '🙂', '👍', '💪', '🔥'];

export default function RatePlayers() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const matchId = params.get('match') || 'm0';

  const match = useMemo(
    () => (matchId === 'm0' ? FINISHED_MATCH : MATCHES.find(m => m.id === matchId)) || FINISHED_MATCH,
    [matchId],
  );

  // Deterministic, no-overlap assignment: every rater of the same player
  // gets a different question from the 12-question bank.
  const assignments = useMemo(() => {
    const ids = ['me', ...match.players.map(p => p.id)];
    return assignQuestions(match.id, ids, 'me').map(a => ({
      ...a,
      player: match.players.find(p => p.id === a.rateeId),
    }));
  }, [match]);

  // steps: 0..2 = one per teammate · 3 = fair-play · 4 = improvement schema
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [fairplay, setFairplay] = useState({});
  const [pending, setPending] = useState(null);

  const pickScale = value => {
    const a = assignments[step];
    setAnswers(prev => ({ ...prev, [a.rateeId]: { axis: a.question.axis, value } }));
    setPending(value);
    setTimeout(() => {
      setPending(null);
      setStep(s => s + 1);
    }, 350);
  };

  const finish = () => {
    const done = JSON.parse(localStorage.getItem('rally_ratings_done') || '{}');
    done[match.id] = { answers, fairplay, at: Date.now() };
    localStorage.setItem('rally_ratings_done', JSON.stringify(done));
    setStep(4);
    setTimeout(() => confetti({ particleCount: 90, spread: 70, origin: { y: 0.4 }, colors: ['#C9A05A', '#1B3A2E'] }), 500);
  };

  const schema = improvementSchema(PEER_AXES_HISTORY.previous, PEER_AXES_HISTORY.current);
  const progress = Math.min(100, Math.round((step / 4) * 100));

  return (
    <div dir="rtl" className="min-h-screen bg-background max-w-md mx-auto flex flex-col">
      {/* Top bar */}
      {step < 4 && (
        <div className="px-5 pt-5 pb-2">
          <div className="flex items-center gap-3">
            <button onClick={() => (step > 0 ? setStep(s => s - 1) : navigate(-1))} className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center active:scale-90">
              <ArrowRight size={17} />
            </button>
            <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
              <motion.div className="h-full bg-gradient-to-l from-[hsl(var(--gold))] to-[hsl(var(--brand))]" animate={{ width: `${progress}%` }} transition={spring} />
            </div>
            <span className="text-[12px] font-bold text-muted-foreground tabular-nums">{step + 1}/4</span>
          </div>
        </div>
      )}

      <div className="flex-1 px-5 pb-10">
        <AnimatePresence mode="wait">
          {/* ---- One question per teammate ---- */}
          {step < 3 && assignments[step] && (() => {
            const { player, question, rateeId } = assignments[step];
            return (
              <motion.div key={`r${step}`} initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }} transition={spring} className="pt-4">
                <div className="flex items-center gap-3 bg-card border border-border rounded-2xl p-3.5 mb-6">
                  <img src={player.avatar_url} className="w-12 h-12 rounded-full object-cover" alt={player.full_name} />
                  <div className="flex-1">
                    <div className="font-bold text-[15px]">{player.full_name}</div>
                    <LevelTag level={player.level} size="xs" />
                  </div>
                  <div className="text-[24px]">{question.emoji}</div>
                </div>

                <h2 className="font-display text-[22px] font-black leading-snug mb-6">{question.text}</h2>

                <div className="flex gap-2 mb-2" dir="ltr">
                  {SCALE_EMOJI.map((emoji, i) => {
                    const value = (i + 1) * 20;
                    const chosen = pending === value || answers[rateeId]?.value === value;
                    return (
                      <button
                        key={i}
                        onClick={() => pickScale(value)}
                        className={`flex-1 aspect-square rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition-all active:scale-95 ${
                          chosen ? 'border-brand bg-brand-softer shadow-md scale-105' : 'border-border bg-card'
                        }`}
                      >
                        <span className="text-[22px]">{emoji}</span>
                        <span className="text-[11px] font-bold text-muted-foreground">{i + 1}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="flex justify-between text-[11px] text-muted-foreground px-1">
                  <span>{question.high}</span>
                  <span>{question.low}</span>
                </div>
              </motion.div>
            );
          })()}

          {/* ---- Fair-play (shared quick question) ---- */}
          {step === 3 && (
            <motion.div key="fp" initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }} transition={spring} className="pt-4">
              <h2 className="font-display text-[22px] font-black leading-snug mb-1">{FAIRPLAY_QUESTION.emoji} {FAIRPLAY_QUESTION.text}</h2>
              <p className="text-[13px] text-muted-foreground mb-6">תשובה מהירה על כל אחד</p>

              <div className="space-y-3 mb-8">
                {assignments.map(({ player, rateeId }) => (
                  <div key={rateeId} className="flex items-center gap-3 bg-card border border-border rounded-2xl p-3">
                    <img src={player.avatar_url} className="w-10 h-10 rounded-full object-cover" alt={player.full_name} />
                    <span className="font-bold text-[14px] flex-1 truncate">{player.full_name}</span>
                    <div className="flex gap-1.5">
                      {[
                        { v: 'yes', e: '😍', t: 'בכיף' },
                        { v: 'maybe', e: '🤷', t: 'אולי' },
                        { v: 'no', e: '🙅', t: 'לא' },
                      ].map(opt => (
                        <button
                          key={opt.v}
                          onClick={() => setFairplay(f => ({ ...f, [rateeId]: opt.v }))}
                          className={`px-2.5 py-1.5 rounded-xl border-2 text-[12px] transition-all active:scale-95 ${
                            fairplay[rateeId] === opt.v ? 'border-brand bg-brand-softer font-bold' : 'border-border bg-card'
                          }`}
                        >
                          {opt.e} {opt.t}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={finish}
                disabled={Object.keys(fairplay).length < assignments.length}
                className="w-full h-[52px] rounded-2xl bg-brand text-white font-bold text-[15px] shadow-md active:scale-[0.98] transition-all disabled:opacity-40"
              >
                שלח דירוג
              </button>
            </motion.div>
          )}

          {/* ---- Improvement schema ---- */}
          {step === 4 && (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ ...spring, delay: 0.1 }} className="pt-10 text-center">
              <div className="text-[52px] mb-3">📈</div>
              <h2 className="font-display text-[26px] font-black mb-2">הדירוג נקלט!</h2>
              <p className="text-[14px] text-muted-foreground mb-7 px-3">
                וככה אתה מתקדם — לפי מה שהשחקנים שאיתך באמת רואים במגרש:
              </p>

              <div className="bg-card border border-border rounded-2xl p-5 text-right space-y-4 mb-3 shadow-sm">
                {schema.map((row, i) => (
                  <div key={row.axis}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[13.5px] font-bold">{row.emoji} {row.label}</span>
                      <span className={`flex items-center gap-1 text-[13px] font-black tabular-nums ${
                        row.delta > 2 ? 'text-emerald-600' : row.delta < -2 ? 'text-red-500' : 'text-muted-foreground'
                      }`}>
                        {row.delta > 2 ? <TrendingUp size={14} /> : row.delta < -2 ? <TrendingDown size={14} /> : <Minus size={14} />}
                        {row.delta > 0 ? `+${row.delta}` : row.delta}
                      </span>
                    </div>
                    <div className="relative h-2.5 rounded-full bg-muted overflow-hidden">
                      {/* previous marker */}
                      <div className="absolute top-0 bottom-0 w-[2px] bg-foreground/25 z-10" style={{ right: `${row.previous}%` }} />
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-l from-[hsl(var(--gold))] to-[hsl(var(--brand))]"
                        initial={{ width: `${row.previous}%` }}
                        animate={{ width: `${row.current}%` }}
                        transition={{ ...spring, delay: 0.6 + i * 0.18 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[11.5px] text-muted-foreground mb-8">
                מבוסס על {PEER_AXES_HISTORY.raters_count} מדרגים · {PEER_AXES_HISTORY.window_label}
              </p>

              <button
                onClick={() => navigate('/', { replace: true })}
                className="w-full h-[52px] rounded-2xl bg-brand text-white font-bold text-[15px] shadow-md active:scale-[0.98] transition-all"
              >
                חזרה הביתה
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
