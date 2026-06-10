import { useNavigate } from 'react-router-dom';
import { ArrowRight, Gauge, Target, Sparkles, Users2, TrendingUp, Check } from 'lucide-react';
import { RATING_PROFILE } from '@/data/mockData';
import { reliability, ratingToLevel, RELIABILITY_EXAMPLES } from '@/lib/rating';

export default function RatingExplained() {
  const navigate = useNavigate();
  const p = RATING_PROFILE;
  const rel = reliability(p.opponentCounts);
  const level = ratingToLevel(p.rating);

  // numbers for the worked formula
  const S = rel.games;
  const sumSq = p.opponentCounts.reduce((a, n) => a + (n / S) ** 2, 0);

  return (
    <div className="min-h-screen bg-bgWarm pb-16">
      {/* Header */}
      <div className="bg-brand-gradient ring-gold px-5 pt-5 pb-8 rounded-b-[32px] shadow-luxe relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="relative z-10">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full border border-gold/30 bg-white/5 text-gold-light flex items-center justify-center active:scale-90 transition-transform mb-4"
            aria-label="חזרה"
          >
            <ArrowRight size={18} />
          </button>
          <h1 className="font-display text-[28px] font-black text-white leading-tight">איך עובד הדירוג</h1>
          <p className="text-[13px] text-white/70 mt-1.5 max-w-[290px] leading-relaxed">
            שקיפות מלאה — בלי קופסה שחורה. הנה בדיוק מה שעומד מאחורי המספר שלך.
          </p>
        </div>
      </div>

      {/* 1 — two numbers */}
      <Section icon={Target} title="שני מספרים, לא אחד">
        <p className="text-[14px] text-muted-foreground leading-relaxed mb-4">
          לכל שחקן ב-Rally יש שני ערכים נפרדים — חשוב להבדיל ביניהם:
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-border bg-bgWarm p-4">
            <Gauge size={20} className="text-brand mb-2" />
            <div className="font-display text-[16px] font-black">הדירוג</div>
            <div className="text-[12px] text-muted-foreground mt-1 leading-relaxed">כמה חזק אתה — אומדן הרמה ({p.rating}, {level.code}).</div>
          </div>
          <div className="rounded-2xl border border-border bg-bgWarm p-4">
            <Sparkles size={20} className="text-gold-deep mb-2" />
            <div className="font-display text-[16px] font-black">האמינות</div>
            <div className="text-[12px] text-muted-foreground mt-1 leading-relaxed">כמה אנחנו בטוחים בדירוג הזה ({rel.pct}%).</div>
          </div>
        </div>
      </Section>

      {/* 2 — Glicko */}
      <Section icon={TrendingUp} title="הדירוג: מנוע Glicko-2">
        <p className="text-[14px] text-muted-foreground leading-relaxed mb-3">
          אותה משפחת מתמטיקה ששחמט ואפליקציות פאדל מובילות משתמשות בה. בכל משחק:
        </p>
        <ul className="space-y-2.5">
          {[
            'ניצחון על שחקן חזק ממך → עלייה גדולה. ניצחון על חלש → עלייה קטנה.',
            'המערכת לא מסתכלת רק על מי ניצח, אלא על כמה זה היה צפוי.',
            'ככל שאתה משחק יותר, ההערכה מתכווננת ומתייצבת סביב הרמה האמיתית.',
          ].map((t) => (
            <li key={t} className="flex items-start gap-2.5">
              <span className="mt-0.5 w-5 h-5 rounded-full bg-brand-softer flex items-center justify-center flex-shrink-0">
                <Check size={12} className="text-brand" strokeWidth={3} />
              </span>
              <span className="text-[13.5px] text-foreground leading-relaxed">{t}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* 3 — diversity (the Rally twist) */}
      <Section icon={Users2} title="האמינות: החידוש של Rally" highlight>
        <p className="text-[14px] text-muted-foreground leading-relaxed mb-4">
          רוב המערכות סופרות רק <b>כמה</b> משחקים שיחקת. אנחנו שואלים שאלה חכמה יותר:
          נגד <b className="text-foreground">כמה אנשים שונים</b>? 40 משחקים נגד 3 אנשים מלמדים אותנו
          פחות מ-20 משחקים נגד 16 אנשים.
        </p>

        {/* formula */}
        <div className="rounded-2xl bg-brand-gradient ring-gold p-4 text-white mb-4">
          <div className="text-[12px] text-white/60 mb-1">יריבים אפקטיביים (מדד אינברס-סימפסון)</div>
          <div className="font-display text-[22px] font-black tracking-wide" dir="ltr">
            D₁ = 1 / Σ(pᵢ)²
          </div>
          <div className="text-[12px] text-white/70 mt-2 leading-relaxed">
            כאשר pᵢ = החלק היחסי של המשחקים מול יריב i. משחק נגד הרבה אנשים שונים → D₁ גבוה.
            טחינה של אותם 2–3 אנשים → D₁ נשאר נמוך, לא משנה כמה שיחקת.
          </div>
        </div>

        {/* plugged-in with the user's real numbers */}
        <div className="rounded-2xl border border-border bg-bgWarm p-4">
          <div className="text-[12px] font-bold text-muted-foreground mb-2">המספרים שלך, מוצבים בנוסחה:</div>
          <div className="space-y-1.5 text-[13.5px]" dir="ltr">
            <Row k="משחקים (S)" v={`${rel.games}`} />
            <Row k="יריבים שונים" v={`${rel.opponents}`} />
            <Row k="Σ(pᵢ)²" v={sumSq.toFixed(3)} />
            <Row k="D₁ = 1 / Σ(pᵢ)²" v={`${rel.dEff}`} strong />
            <div className="h-px bg-border my-2" />
            <Row k="אמינות = D₁ / (D₁ + 1.25)" v={`${rel.pct}%`} strong gold />
          </div>
        </div>
      </Section>

      {/* 4 — worked comparison */}
      <Section icon={Sparkles} title="יותר משחקים ≠ יותר אמינות">
        <p className="text-[14px] text-muted-foreground leading-relaxed mb-4">
          שתי דוגמאות אמיתיות מהמנוע. שים לב — מי ששיחק <b>פחות</b> משחקים יוצא אמין יותר:
        </p>
        <div className="grid grid-cols-2 gap-3">
          {RELIABILITY_EXAMPLES.map((ex) => {
            const r = reliability(ex.opponentCounts);
            const best = r.pct >= 85;
            return (
              <div
                key={ex.name}
                className={`rounded-2xl p-4 border ${best ? 'border-brand bg-brand-softer' : 'border-border bg-bgWarm'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-display text-[15px] font-black">{ex.name}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${best ? 'bg-brand text-white' : 'bg-muted text-muted-foreground'}`}>
                    {ex.tag}
                  </span>
                </div>
                <DotGrid counts={ex.opponentCounts} highlight={best} />
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-[11px] text-muted-foreground">{r.games} משחקים · {r.opponents} יריבים</span>
                </div>
                <div className={`font-display text-[30px] font-black mt-1 tabular-nums ${best ? 'text-brand' : 'text-muted-foreground'}`}>
                  {r.pct}%
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* 5 — what it means for you */}
      <Section icon={Target} title="מה זה אומר עבורך">
        <div className="rounded-2xl bg-card border border-border p-4 flex items-center gap-4">
          <div className="font-display text-[40px] font-black text-brand tabular-nums leading-none">{rel.pct}%</div>
          <div className="flex-1">
            <div className="font-bold text-[14px]">האמינות שלך כרגע</div>
            <p className="text-[12.5px] text-muted-foreground leading-relaxed mt-1">
              כדי להעלות אותה — שחק נגד שחקנים <b className="text-foreground">חדשים</b> שעוד לא פגשת.
              כל יריב חדש שווה הרבה יותר מעוד משחק מול מישהו מוכר.
            </p>
          </div>
        </div>
      </Section>

      <div className="px-5 mt-6">
        <button
          onClick={() => navigate('/find')}
          className="w-full bg-brand text-white h-12 rounded-full font-bold active:scale-[0.98] transition-transform shadow-luxe"
        >
          מצא יריב חדש
        </button>
      </div>
    </div>
  );
}

function Section({ icon: Icon, title, children, highlight }) {
  return (
    <section className={`px-5 mt-5`}>
      <div className={`rounded-3xl p-5 border shadow-luxe ${highlight ? 'border-gold/30 bg-card ring-gold' : 'border-border bg-card'}`}>
        <div className="flex items-center gap-2 mb-3">
          <span className="w-8 h-8 rounded-full bg-brand-softer flex items-center justify-center">
            <Icon size={16} className="text-brand" />
          </span>
          <h2 className="font-display text-[19px] font-black">{title}</h2>
        </div>
        {children}
      </div>
    </section>
  );
}

function Row({ k, v, strong, gold }) {
  return (
    <div className="flex items-center justify-between">
      <span className={`${strong ? 'font-bold text-foreground' : 'text-muted-foreground'}`}>{k}</span>
      <span className={`tabular-nums font-black ${gold ? 'text-gold-deep' : strong ? 'text-brand' : 'text-foreground'}`}>{v}</span>
    </div>
  );
}

// Visualizes opponent distribution as dots — one column per distinct opponent,
// stacked dots = games against them. Wide & short = diverse; tall & narrow = repetitive.
function DotGrid({ counts, highlight }) {
  const max = Math.max(...counts);
  return (
    <div className="flex items-end gap-1 h-12" dir="ltr">
      {counts.slice(0, 12).map((n, i) => (
        <div key={i} className="flex flex-col-reverse gap-0.5 flex-1">
          {Array.from({ length: Math.min(n, max) }).map((_, j) => (
            <span
              key={j}
              className={`w-full rounded-[2px] ${highlight ? 'bg-brand' : 'bg-muted-foreground/50'}`}
              style={{ height: 4 }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
