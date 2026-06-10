import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { ArrowRight, Hand, MapPin, Car, Sparkles } from 'lucide-react';
import { CLUBS } from '@/data/mockData';
import { QUIZ_QUESTIONS, scoreQuiz } from '@/data/levelQuiz';
import LevelTag from '@/components/LevelTag';

const CITIES = [
  'תל אביב', 'רמת גן', 'גבעתיים', 'הרצליה', 'רעננה', 'כפר סבא',
  'ראשון לציון', 'חולון', 'בת ים', 'פתח תקווה', 'נתניה', 'רחובות',
  'ירושלים', 'חיפה',
];

const RADIUS_OPTIONS = [
  { km: 5, label: 'עד 5 ק"מ', sub: 'רק ליד הבית' },
  { km: 10, label: 'עד 10 ק"מ', sub: 'נסיעה קצרה' },
  { km: 20, label: 'עד 20 ק"מ', sub: 'שווה את זה' },
  { km: 40, label: '40 ק"מ+', sub: 'אסע בשביל משחק טוב' },
];

const spring = { type: 'spring', stiffness: 280, damping: 26 };
const stepAnim = {
  initial: { opacity: 0, x: -40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 40 },
  transition: spring,
};

function OptionCard({ selected, onClick, children, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-right rounded-2xl border-2 px-4 py-3.5 transition-all active:scale-[0.98] ${
        selected
          ? 'border-brand bg-brand-softer shadow-md'
          : 'border-border bg-card hover:border-brand/40'
      } ${className}`}
    >
      {children}
    </button>
  );
}

export default function Onboarding() {
  const navigate = useNavigate();

  // phase: profile (0-4) → quiz-intro → quiz (0-11) → result
  const [phase, setPhase] = useState('profile');
  const [profileStep, setProfileStep] = useState(0);
  const [quizStep, setQuizStep] = useState(0);

  const [form, setForm] = useState({
    firstName: '', lastName: '', city: '', customCity: '',
    hand: '', side: '', radius: 0, clubs: [],
  });
  const [answers, setAnswers] = useState({});
  const [pendingChoice, setPendingChoice] = useState(null);

  // Auth guard — the flow starts at /login.
  useEffect(() => {
    if (!localStorage.getItem('rally_auth') && !localStorage.getItem('rally_user')) {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  const result = useMemo(
    () => (phase === 'result' ? scoreQuiz(answers) : null),
    [phase, answers],
  );

  useEffect(() => {
    if (phase === 'result') {
      const t = setTimeout(() => {
        confetti({ particleCount: 120, spread: 75, origin: { y: 0.35 }, colors: ['#C9A05A', '#1B3A2E', '#F5F0E6'] });
      }, 600);
      return () => clearTimeout(t);
    }
  }, [phase]);

  const totalSteps = 5 + QUIZ_QUESTIONS.length;
  const currentStep = phase === 'profile' ? profileStep : phase === 'quiz' ? 5 + quizStep : totalSteps;
  const progress = Math.round((currentStep / totalSteps) * 100);

  const set = patch => setForm(f => ({ ...f, ...patch }));

  const nextProfile = () => {
    if (profileStep < 4) setProfileStep(s => s + 1);
    else setPhase('quiz-intro');
  };
  const back = () => {
    if (phase === 'quiz' && quizStep > 0) setQuizStep(s => s - 1);
    else if (phase === 'quiz') setPhase('quiz-intro');
    else if (phase === 'quiz-intro') { setPhase('profile'); setProfileStep(4); }
    else if (profileStep > 0) setProfileStep(s => s - 1);
    else navigate('/login');
  };

  // Select with a brief highlight before auto-advancing.
  const pick = (patch, advance = true) => {
    set(patch);
    if (!advance) return;
    setPendingChoice(Object.values(patch)[0]);
    setTimeout(() => { setPendingChoice(null); nextProfile(); }, 320);
  };

  const answerQuiz = optionIdx => {
    const q = QUIZ_QUESTIONS[quizStep];
    setAnswers(a => ({ ...a, [q.id]: optionIdx }));
    setPendingChoice(`${q.id}:${optionIdx}`);
    setTimeout(() => {
      setPendingChoice(null);
      if (quizStep < QUIZ_QUESTIONS.length - 1) setQuizStep(s => s + 1);
      else setPhase('result');
    }, 380);
  };

  const finish = () => {
    const auth = JSON.parse(localStorage.getItem('rally_auth') || '{}');
    const city = form.city === 'אחר' ? form.customCity : form.city;
    localStorage.setItem('rally_user', JSON.stringify({
      full_name: `${form.firstName} ${form.lastName}`.trim(),
      first_name: form.firstName,
      last_name: form.lastName,
      city,
      preferred_hand: form.hand,
      preferred_side: form.side,
      radius_km: form.radius,
      favorite_clubs: form.clubs,
      level: result.level,
      rally_rating: result.rating,
      level_confidence: result.consistent ? 'מתכיילת' : 'משוערת',
      quiz_score: result.score,
      auth_method: auth.method || 'demo',
      verified: false,
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      created_at: new Date().toISOString(),
    }));
    navigate('/', { replace: true });
  };

  const cityChosen = form.city && (form.city !== 'אחר' || form.customCity.trim());

  return (
    <div dir="rtl" className="min-h-screen bg-background flex flex-col">
      {/* Top bar: back + progress */}
      {phase !== 'result' && (
        <div className="px-5 pt-5 pb-3 max-w-md w-full mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <button onClick={back} className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center active:scale-90">
              <ArrowRight size={17} />
            </button>
            <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-l from-[hsl(var(--gold))] to-[hsl(var(--brand))]"
                animate={{ width: `${progress}%` }}
                transition={spring}
              />
            </div>
            <span className="text-[12px] font-bold text-muted-foreground tabular-nums">{progress}%</span>
          </div>
        </div>
      )}

      <div className="flex-1 px-5 pb-10 max-w-md w-full mx-auto">
        <AnimatePresence mode="wait">
          {/* ---------- PROFILE STEPS ---------- */}
          {phase === 'profile' && profileStep === 0 && (
            <motion.div key="p0" {...stepAnim}>
              <h2 className="font-display text-[26px] font-black mb-1">נעים להכיר 👋</h2>
              <p className="text-[14px] text-muted-foreground mb-6">איך קוראים לך?</p>
              <div className="space-y-3 mb-6">
                <input
                  value={form.firstName}
                  onChange={e => set({ firstName: e.target.value })}
                  placeholder="שם פרטי"
                  className="w-full h-[52px] rounded-2xl bg-card border border-border px-4 text-[16px] font-medium focus:outline-none focus:border-brand"
                />
                <input
                  value={form.lastName}
                  onChange={e => set({ lastName: e.target.value })}
                  placeholder="שם משפחה"
                  className="w-full h-[52px] rounded-2xl bg-card border border-border px-4 text-[16px] font-medium focus:outline-none focus:border-brand"
                />
              </div>
              <button
                onClick={nextProfile}
                disabled={!form.firstName.trim() || !form.lastName.trim()}
                className="w-full h-[52px] rounded-2xl bg-brand text-white font-bold text-[15px] shadow-md active:scale-[0.98] transition-all disabled:opacity-40"
              >
                המשך
              </button>
            </motion.div>
          )}

          {phase === 'profile' && profileStep === 1 && (
            <motion.div key="p1" {...stepAnim}>
              <h2 className="font-display text-[26px] font-black mb-1">מאיפה אתה? <MapPin className="inline -mt-1" size={22} /></h2>
              <p className="text-[14px] text-muted-foreground mb-6">נראה לך משחקים ומגרשים קרובים</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {[...CITIES, 'אחר'].map(c => (
                  <button
                    key={c}
                    onClick={() => (c === 'אחר' ? set({ city: c }) : pick({ city: c }))}
                    className={`px-4 py-2.5 rounded-full border-2 text-[14px] font-bold transition-all active:scale-95 ${
                      form.city === c ? 'border-brand bg-brand text-white' : 'border-border bg-card'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
              {form.city === 'אחר' && (
                <div className="space-y-3">
                  <input
                    value={form.customCity}
                    onChange={e => set({ customCity: e.target.value })}
                    placeholder="שם היישוב"
                    autoFocus
                    className="w-full h-[52px] rounded-2xl bg-card border border-border px-4 text-[16px] font-medium focus:outline-none focus:border-brand"
                  />
                  <button
                    onClick={nextProfile}
                    disabled={!cityChosen}
                    className="w-full h-[52px] rounded-2xl bg-brand text-white font-bold text-[15px] shadow-md active:scale-[0.98] transition-all disabled:opacity-40"
                  >
                    המשך
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {phase === 'profile' && profileStep === 2 && (
            <motion.div key="p2" {...stepAnim}>
              <h2 className="font-display text-[26px] font-black mb-1">באיזו יד אתה מחזיק? <Hand className="inline -mt-1" size={22} /></h2>
              <p className="text-[14px] text-muted-foreground mb-6">חשוב להרכבי זוגות</p>
              <div className="grid grid-cols-2 gap-3">
                {['ימין', 'שמאל'].map(h => (
                  <OptionCard key={h} selected={form.hand === h || pendingChoice === h} onClick={() => pick({ hand: h })} className="text-center py-8">
                    <div className="text-[40px] mb-2">{h === 'ימין' ? '🫱' : '🫲'}</div>
                    <div className="font-bold text-[16px]">{h}</div>
                  </OptionCard>
                ))}
              </div>
            </motion.div>
          )}

          {phase === 'profile' && profileStep === 3 && (
            <motion.div key="p3" {...stepAnim}>
              <h2 className="font-display text-[26px] font-black mb-1">איזה צד אתה אוהב? 🎾</h2>
              <p className="text-[14px] text-muted-foreground mb-6">הצד שלך במגרש</p>
              <div className="space-y-3">
                {[
                  { v: 'ימין', d: 'הצד של הפתיחות — יציבות ושליטה' },
                  { v: 'שמאל', d: 'הצד של הסיומים — סמאשים וויברות' },
                  { v: 'גמיש', d: 'זורם עם מה שהמשחק צריך' },
                ].map(({ v, d }) => (
                  <OptionCard key={v} selected={form.side === v || pendingChoice === v} onClick={() => pick({ side: v })}>
                    <div className="font-bold text-[15px] mb-0.5">{v}</div>
                    <div className="text-[13px] text-muted-foreground">{d}</div>
                  </OptionCard>
                ))}
              </div>
            </motion.div>
          )}

          {phase === 'profile' && profileStep === 4 && (
            <motion.div key="p4" {...stepAnim}>
              <h2 className="font-display text-[26px] font-black mb-1">כמה רחוק תיסע למשחק? <Car className="inline -mt-1" size={22} /></h2>
              <p className="text-[14px] text-muted-foreground mb-5">ואם יש מועדונים שאתה כבר אוהב — סמן אותם</p>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {RADIUS_OPTIONS.map(({ km, label, sub }) => (
                  <OptionCard key={km} selected={form.radius === km} onClick={() => set({ radius: km })} className="text-center">
                    <div className="font-bold text-[15px]">{label}</div>
                    <div className="text-[12px] text-muted-foreground">{sub}</div>
                  </OptionCard>
                ))}
              </div>
              <div className="text-[13px] font-bold text-muted-foreground mb-2">מועדונים מועדפים (לא חובה)</div>
              <div className="flex flex-wrap gap-2 mb-6">
                {CLUBS.map(c => {
                  const on = form.clubs.includes(c.id);
                  return (
                    <button
                      key={c.id}
                      onClick={() => set({ clubs: on ? form.clubs.filter(id => id !== c.id) : [...form.clubs, c.id] })}
                      className={`px-3.5 py-2 rounded-full border-2 text-[13px] font-bold transition-all active:scale-95 ${
                        on ? 'border-[hsl(var(--gold))] bg-gold-soft text-[#8a6d3b]' : 'border-border bg-card'
                      }`}
                    >
                      {c.name}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={nextProfile}
                disabled={!form.radius}
                className="w-full h-[52px] rounded-2xl bg-brand text-white font-bold text-[15px] shadow-md active:scale-[0.98] transition-all disabled:opacity-40"
              >
                המשך
              </button>
            </motion.div>
          )}

          {/* ---------- QUIZ INTRO ---------- */}
          {phase === 'quiz-intro' && (
            <motion.div key="qi" {...stepAnim} className="pt-10 text-center">
              <div className="text-[56px] mb-4">🎯</div>
              <h2 className="font-display text-[28px] font-black mb-3">בוא נכייל את הרמה שלך</h2>
              <p className="text-[15px] text-muted-foreground leading-relaxed mb-2 px-2">
                12 שאלות קצרות על המשחק שלך — בלי תשובות נכונות, רק כנות.
              </p>
              <p className="text-[13px] text-muted-foreground mb-8 px-2">
                הרמה שתצא היא נקודת פתיחה. היא תתכייל אוטומטית במשחקים הראשונים שלך.
              </p>
              <button
                onClick={() => setPhase('quiz')}
                className="w-full h-[54px] rounded-2xl bg-gradient-to-l from-[hsl(var(--gold-deep))] to-[hsl(var(--gold))] text-white font-bold text-[16px] shadow-lg active:scale-[0.98] transition-all"
              >
                יאללה, מתחילים
              </button>
            </motion.div>
          )}

          {/* ---------- QUIZ ---------- */}
          {phase === 'quiz' && (() => {
            const q = QUIZ_QUESTIONS[quizStep];
            return (
              <motion.div key={`q${quizStep}`} {...stepAnim}>
                <div className="text-[12px] font-bold text-[hsl(var(--gold-deep))] mb-2 tracking-wide">
                  שאלה {quizStep + 1} מתוך {QUIZ_QUESTIONS.length}
                </div>
                <h2 className="font-display text-[24px] font-black mb-6 leading-snug">
                  <span className="ml-2">{q.emoji}</span>{q.title}
                </h2>
                <div className="space-y-2.5">
                  {q.options.map((opt, i) => {
                    const chosen = answers[q.id] === i || pendingChoice === `${q.id}:${i}`;
                    return (
                      <OptionCard key={i} selected={chosen} onClick={() => answerQuiz(i)}>
                        <span className="text-[14.5px] font-medium leading-snug">{opt.label}</span>
                      </OptionCard>
                    );
                  })}
                </div>
              </motion.div>
            );
          })()}

          {/* ---------- RESULT ---------- */}
          {phase === 'result' && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ...spring, delay: 0.15 }}
              className="pt-12 text-center"
            >
              <div className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[hsl(var(--gold-deep))] bg-gold-soft rounded-full px-3 py-1 mb-5">
                <Sparkles size={13} /> הכיול הושלם
              </div>
              <h2 className="font-display text-[22px] font-bold text-muted-foreground mb-3">
                {form.firstName}, הרמה שלך היא
              </h2>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ ...spring, delay: 0.45 }}
                className="mb-4"
              >
                <LevelTag level={result.level} size="lg" className="!text-[34px] !px-7 !py-3" />
              </motion.div>
              <p className="text-[15px] text-muted-foreground mb-1">{result.description}</p>
              <p className="text-[13px] text-muted-foreground mb-7">
                דירוג פתיחה: <span className="font-black text-foreground tabular-nums">{result.rating}</span>
              </p>

              {/* Breakdown bars */}
              <div className="bg-card border border-border rounded-2xl p-5 text-right space-y-4 mb-5 shadow-sm">
                {result.breakdown.map((b, i) => (
                  <div key={b.key}>
                    <div className="flex justify-between text-[13px] font-bold mb-1.5">
                      <span>{b.label}</span>
                      <span className="text-muted-foreground tabular-nums">{b.value}%</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-l from-[hsl(var(--gold))] to-[hsl(var(--brand))]"
                        initial={{ width: 0 }}
                        animate={{ width: `${b.value}%` }}
                        transition={{ ...spring, delay: 0.7 + i * 0.15 }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className={`text-[13px] rounded-2xl px-4 py-3 mb-7 ${
                result.consistent ? 'bg-brand-softer text-brand' : 'bg-gold-soft text-[#8a6d3b]'
              }`}>
                {result.consistent
                  ? '✓ הרמה תתכייל אוטומטית במשחקים הראשונים שלך'
                  : 'שמנו לב לפערים בתשובות — הרמה תתכייל מהר ב-3 המשחקים הראשונים'}
              </div>

              <button
                onClick={finish}
                className="w-full h-[54px] rounded-2xl bg-brand text-white font-bold text-[16px] shadow-lg active:scale-[0.98] transition-all"
              >
                יאללה, למגרש 🎾
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
