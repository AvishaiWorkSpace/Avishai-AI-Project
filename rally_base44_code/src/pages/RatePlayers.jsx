import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { ArrowRight, TrendingUp, TrendingDown, Minus, Plus } from 'lucide-react';
import { FINISHED_MATCH, MATCHES, PEER_AXES_HISTORY, RATING_PROFILE } from '@/data/mockData';
import { assignQuestions, matchDiagnostic, FAIRPLAY_QUESTION, improvementSchema } from '@/data/peerQuestions';
import { classifyMargin, applyMatchResult, loadRatingProfile, saveRatingResult } from '@/lib/rating';
import { base44 } from '@/api/base44Client';
import LevelTag from '@/components/LevelTag';

const spring = { type: 'spring', stiffness: 280, damping: 26 };

// Flow: score → rate each teammate (margin-aware question) → match diagnostic
// → fair-play → summary (rating delta + axis schema).
const EMPTY_SETS = [{ us: 6, them: 4 }, { us: 0, them: 0 }, { us: 0, them: 0 }];

function SetStepper({ value, onChange }) {
  return (
    <div className="flex items-center gap-1" dir="ltr">
      <button
        onClick={() => onChange(Math.max(0, value - 1))}
        className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center active:scale-90 transition-transform"
      >
        <Minus size={14} />
      </button>
      <span className="w-9 text-center font-display text-[24px] font-black tabular-nums">{value}</span>
      <button
        onClick={() => onChange(Math.min(7, value + 1))}
        className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center active:scale-90 transition-transform"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}

export default function RatePlayers() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const matchId = params.get('match') || 'm0';

  const match = useMemo(
    () => (matchId === 'm0' ? FINISHED_MATCH : MATCHES.find(m => m.id === matchId)) || FINISHED_MATCH,
    [matchId],
  );

  // phase: 'score' | 0..2 (one per teammate) | 'diag' | 'fair' | 'done'
  const [phase, setPhase] = useState('score');
  const [sets, setSets] = useState(EMPTY_SETS);
  const [margin, setMargin] = useState(null);
  const [ratingResult, setRatingResult] = useState(null);
  const [answers, setAnswers] = useState({});
  const [diagnosis, setDiagnosis] = useState(null);
  const [fairplay, setFairplay] = useState({});
  const [pending, setPending] = useState(null);

  // Margin-aware, no-overlap question assignment (computed after score entry).
  const assignments = useMemo(() => {
    const ids = ['me', ...match.players.map(p => p.id)];
    return assignQuestions(match.id, ids, 'me', margin?.type || 'normal').map(a => ({
      ...a,
      player: match.players.find(p => p.id === a.rateeId),
    }));
  }, [match, margin?.type]);

  const diagnostic = matchDiagnostic(margin);

  const STEPS = ['score', 0, 1, 2, 'diag', 'fair'];
  const stepIndex = STEPS.indexOf(phase);
  const progress = phase === 'done' ? 100 : Math.round((stepIndex / STEPS.length) * 100);

  const updateSet = (i, side, v) =>
    setSets(prev => prev.map((s, j) => (j === i ? { ...s, [side]: v } : s)));

  const confirmScore = () => {
    const m = classifyMargin(sets);
    if (!m) return;
    setMargin(m);

    // Close the loop: the entered result moves the player's Rally rating.
    // Opponents = the two across the net (demo: last two in players list).
    const profile = loadRatingProfile(RATING_PROFILE);
    const opponents = match.players.slice(-2);
    const result = applyMatchResult(profile, opponents, m.won);
    saveRatingResult(result);
    setRatingResult(result);
    setPhase(0);
  };

  const advance = next => {
    setPending(null);
    setPhase(next);
  };

  const pickOption = (rateeId, question, opt) => {
    if (pending !== null) return;
    setAnswers(prev => ({ ...prev, [rateeId]: { axis: question.axis, value: opt.value, label: opt.label } }));
    setPending(`${rateeId}:${opt.value}`);
    setTimeout(() => advance(typeof phase === 'number' && phase < 2 ? phase + 1 : 'diag'), 380);
  };

  const pickDiagnosis = opt => {
    if (pending !== null) return;
    setDiagnosis(opt.id);
    setPending(opt.id);
    setTimeout(() => advance('fair'), 380);
  };

  const finish = () => {
    const done = JSON.parse(localStorage.getItem('rally_ratings_done') || '{}');
    done[match.id] = {
      sets, margin, answers, diagnosis, fairplay,
      rating_delta: ratingResult?.delta, at: Date.now(),
    };
    localStorage.setItem('rally_ratings_done', JSON.stringify(done));

    // Record through the data layer (mock store today, live Base44 when
    // VITE_BASE44_APP_ID is set). Fire-and-forget — never block the flow.
    base44.entities.MatchResult.create({
      match_id: match.id,
      sets: sets.filter(s => s.us + s.them > 0),
      margin_type: margin?.type,
      won: margin?.won,
      rating_before: ratingResult?.before,
      rating_after: ratingResult?.after,
      diagnosis,
    }).catch(() => {});
    Object.entries(answers).forEach(([rateeId, a]) => {
      base44.entities.PeerRating.create({
        match_id: match.id,
        rater_id: 'me',
        ratee_id: rateeId,
        axis: a.axis,
        value: a.value,
        statement: a.label,
        fairplay: fairplay[rateeId],
      }).catch(() => {});
    });

    setPhase('done');
    setTimeout(() => confetti({ particleCount: 90, spread: 70, origin: { y: 0.4 }, colors: ['#C9A05A', '#1B3A2E'] }), 500);
  };

  const schema = improvementSchema(PEER_AXES_HISTORY.previous, PEER_AXES_HISTORY.current);

  const back = () => {
    if (phase === 'score') return navigate(-1);
    const i = STEPS.indexOf(phase);
    setPhase(STEPS[i - 1]);
  };

  const marginChip = margin && (
    <span className={`inline-flex items-center gap-1.5 text-[12px] font-bold rounded-full px-3 py-1 ${
      margin.type === 'close' ? 'bg-gold-soft text-[#8a6d3b]' : margin.won ? 'bg-brand-softer text-brand' : 'bg-muted text-muted-foreground'
    }`}>
      {margin.type === 'close' ? '🔥' : margin.won ? '🏆' : '🎯'} {margin.label} · {sets.filter(s => s.us + s.them > 0).map(s => `${s.us}-${s.them}`).join(', ')}
    </span>
  );

  return (
    <div dir="rtl" className="min-h-screen bg-background max-w-md mx-auto flex flex-col">
      {/* Top bar */}
      {phase !== 'done' && (
        <div className="px-5 pt-5 pb-2">
          <div className="flex items-center gap-3">
            <button onClick={back} className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center active:scale-90">
              <ArrowRight size={17} />
            </button>
            <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
              <motion.div className="h-full bg-gradient-to-l from-[hsl(var(--gold))] to-[hsl(var(--brand))]" animate={{ width: `${progress}%` }} transition={spring} />
            </div>
            <span className="text-[12px] font-bold text-muted-foreground tabular-nums">{Math.max(1, stepIndex + 1)}/{STEPS.length}</span>
          </div>
        </div>
      )}

      <div className="flex-1 px-5 pb-10">
        <AnimatePresence mode="wait">
          {/* ---- Score entry ---- */}
          {phase === 'score' && (
            <motion.div key="score" initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }} transition={spring} className="pt-4">
              <h2 className="font-display text-[24px] font-black leading-snug mb-1">מה הייתה התוצאה? 🎾</h2>
              <p className="text-[13.5px] text-muted-foreground mb-6">
                התוצאה מעדכנת את דירוג ה-Rally שלך — והשאלות שתקבל מותאמות לאיך שהמשחק באמת נראה
              </p>

              <div className="bg-card border border-border rounded-2xl overflow-hidden mb-5 shadow-sm">
                <div className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-2 px-4 py-2.5 text-[11.5px] font-bold text-muted-foreground border-b border-border">
                  <span></span>
                  <span className="w-[114px] text-center">סט 1</span>
                  <span className="w-[114px] text-center">סט 2</span>
                  <span className="w-[114px] text-center">סט 3</span>
                </div>
                {['us', 'them'].map(side => (
                  <div key={side} className={`grid grid-cols-[1fr_auto_auto_auto] items-center gap-2 px-4 py-3 ${side === 'us' ? 'border-b border-border' : ''}`}>
                    <span className="text-[13.5px] font-bold">{side === 'us' ? 'אנחנו' : 'הם'}</span>
                    {sets.map((s, i) => (
                      <SetStepper key={i} value={s[side]} onChange={v => updateSet(i, side, v)} />
                    ))}
                  </div>
                ))}
              </div>

              {classifyMargin(sets) && (
                <div className="text-center mb-5">
                  <span className="text-[12.5px] text-muted-foreground">
                    {classifyMargin(sets).won ? 'ניצחתם' : 'הפסדתם'} · {classifyMargin(sets).label}
                  </span>
                </div>
              )}

              <button
                onClick={confirmScore}
                disabled={!classifyMargin(sets)}
                className="w-full h-[52px] rounded-2xl bg-brand text-white font-bold text-[15px] shadow-md active:scale-[0.98] transition-all disabled:opacity-40"
              >
                אשר תוצאה והמשך
              </button>
            </motion.div>
          )}

          {/* ---- One margin-aware question per teammate ---- */}
          {typeof phase === 'number' && assignments[phase] && (() => {
            const { player, question, rateeId } = assignments[phase];
            return (
              <motion.div key={`r${phase}`} initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }} transition={spring} className="pt-3">
                <div className="mb-4">{marginChip}</div>

                <div className="flex items-center gap-3 bg-card border border-border rounded-2xl p-3.5 mb-5">
                  <img src={player.avatar_url} className="w-12 h-12 rounded-full object-cover" alt={player.full_name} />
                  <div className="flex-1">
                    <div className="font-bold text-[15px]">{player.full_name}</div>
                    <LevelTag level={player.level} size="xs" />
                  </div>
                  <div className="text-[24px]">{question.emoji}</div>
                </div>

                <h2 className="font-display text-[21px] font-black leading-snug mb-5">{question.text}</h2>

                <div className="space-y-2.5">
                  {question.options.map(opt => {
                    const chosen = pending === `${rateeId}:${opt.value}` || answers[rateeId]?.value === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => pickOption(rateeId, question, opt)}
                        className={`w-full text-right rounded-2xl border-2 px-4 py-3.5 transition-all active:scale-[0.98] ${
                          chosen ? 'border-brand bg-brand-softer shadow-md' : 'border-border bg-card hover:border-brand/40'
                        }`}
                      >
                        <span className="text-[14px] font-medium leading-snug">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            );
          })()}

          {/* ---- Match diagnostic (what decided this match) ---- */}
          {phase === 'diag' && (
            <motion.div key="diag" initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }} transition={spring} className="pt-3">
              <div className="mb-4">{marginChip}</div>
              <h2 className="font-display text-[22px] font-black leading-snug mb-1">{diagnostic.emoji} {diagnostic.text}</h2>
              <p className="text-[13px] text-muted-foreground mb-5">תשובה אחת — זה מה שהופך את הדירוג לחכם</p>

              <div className="space-y-2.5">
                {diagnostic.options.map(opt => {
                  const chosen = pending === opt.id || diagnosis === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => pickDiagnosis(opt)}
                      className={`w-full text-right rounded-2xl border-2 px-4 py-3.5 transition-all active:scale-[0.98] ${
                        chosen ? 'border-brand bg-brand-softer shadow-md' : 'border-border bg-card hover:border-brand/40'
                      }`}
                    >
                      <span className="text-[14px] font-medium leading-snug">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ---- Fair-play (shared quick question) ---- */}
          {phase === 'fair' && (
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

          {/* ---- Summary: rating delta + improvement schema ---- */}
          {phase === 'done' && (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ ...spring, delay: 0.1 }} className="pt-8 text-center">
              <div className="text-[52px] mb-3">{ratingResult?.delta >= 0 ? '📈' : '📉'}</div>
              <h2 className="font-display text-[26px] font-black mb-2">הדירוג נקלט!</h2>

              {/* Rating delta — the result actually moved the number */}
              {ratingResult && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...spring, delay: 0.35 }}
                  className="bg-card border border-border rounded-2xl p-4 mb-4 shadow-sm"
                >
                  <div className="text-[12px] font-bold text-muted-foreground mb-2">דירוג Rally</div>
                  <div className="flex items-center justify-center gap-3" dir="ltr">
                    <span className="text-[20px] font-bold text-muted-foreground tabular-nums">{ratingResult.before}</span>
                    <span className="text-muted-foreground">←</span>
                    <span className="font-display text-[32px] font-black tabular-nums">{ratingResult.after}</span>
                    <span className={`flex items-center gap-0.5 text-[15px] font-black tabular-nums ${
                      ratingResult.delta >= 0 ? 'text-emerald-600' : 'text-red-500'
                    }`}>
                      {ratingResult.delta >= 0 ? <TrendingUp size={15} /> : <TrendingDown size={15} />}
                      {ratingResult.delta >= 0 ? `+${ratingResult.delta}` : ratingResult.delta}
                    </span>
                  </div>
                  <div className="mt-2 flex justify-center"><LevelTag level={ratingResult.level.code} size="sm" /></div>
                </motion.div>
              )}

              <p className="text-[14px] text-muted-foreground mb-5 px-3">
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
                      <div className="absolute top-0 bottom-0 w-[2px] bg-foreground/25 z-10" style={{ right: `${row.previous}%` }} />
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-l from-[hsl(var(--gold))] to-[hsl(var(--brand))]"
                        initial={{ width: `${row.previous}%` }}
                        animate={{ width: `${row.current}%` }}
                        transition={{ ...spring, delay: 0.6 + i * 0.15 }}
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
