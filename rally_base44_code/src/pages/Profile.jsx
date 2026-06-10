import { useNavigate } from 'react-router-dom';
import { BadgeCheck, TrendingUp, Trophy, ChevronLeft, Users2, Sparkles, Info } from 'lucide-react';
import { RATING_PROFILE, PEER_AXES_HISTORY } from '@/data/mockData';
import { reliability, ratingToLevel, levelProgress, levelRange, reliabilityLabel, LEVELS } from '@/lib/rating';
import ReliabilityRing from '@/components/ReliabilityRing';
import SkillRadar from '@/components/SkillRadar';
import Sparkline from '@/components/Sparkline';
import LevelTag from '@/components/LevelTag';
import ThemeToggle from '@/components/ThemeToggle';

export default function Profile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('rally_user') || '{}');
  const p = RATING_PROFILE;

  const level = ratingToLevel(p.rating);
  const range = levelRange(level.code);
  const progress = levelProgress(p.rating);
  const nextLevel = LEVELS[LEVELS.findIndex((l) => l.code === level.code) - 1];
  const rel = reliability(p.opponentCounts);
  const relLabel = reliabilityLabel(rel.pct);
  const monthGain = p.rating - p.history[Math.max(0, p.history.length - 7)];
  const winRate = Math.round((p.wins / (p.wins + p.losses)) * 100);

  return (
    <div className="pb-28 min-h-screen">
      {/* Hero */}
      <div className="bg-brand-gradient ring-gold px-5 pt-6 pb-16 rounded-b-[32px] shadow-luxe relative overflow-hidden">
        {/* soft champagne glow instead of a grid texture */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(80% 60% at 15% 0%, hsl(41 55% 70% / 0.14) 0%, transparent 60%)',
          }}
        />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-5">
            <span className="text-[13px] font-semibold text-white/60">הפרופיל שלי</span>
            <ThemeToggle onDark />
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={user.avatar_url || RATING_PROFILE.avatar}
                alt={user.full_name}
                className="w-[72px] h-[72px] rounded-full object-cover border-2 border-gold/50 shadow-gold"
              />
              {user.verified && (
                <span className="absolute -bottom-1 -left-1 w-7 h-7 rounded-full bg-gold flex items-center justify-center border-2 border-brand-deep">
                  <BadgeCheck size={15} className="text-brand-deep" strokeWidth={2.5} />
                </span>
              )}
            </div>
            <div className="flex-1">
              <div className="font-display text-[24px] font-black text-white leading-tight">
                {user.full_name || 'שחקן'}
              </div>
              <div className="flex items-center gap-2 mt-1.5">
                <LevelTag level={level.code} size="md" verified={user.verified} />
                <span className="text-[12px] text-white/60">{level.tier} · {user.city}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rating card (overlaps hero) */}
      <div className="px-5 -mt-10 relative z-10">
        <div className="bg-card rounded-3xl border border-border shadow-luxe p-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[12px] text-muted-foreground mb-1">דירוג Rally</div>
              <div className="flex items-end gap-2">
                <span className="font-display text-[44px] font-black leading-none text-brand tabular-nums">{p.rating}</span>
                <span className="inline-flex items-center gap-0.5 text-[13px] font-bold text-emerald-600 mb-1.5">
                  <TrendingUp size={14} /> {monthGain > 0 ? '+' : ''}{monthGain}
                </span>
              </div>
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1 text-[12px] text-muted-foreground justify-end">
                <Trophy size={12} className="text-gold" /> דירוג ארצי
              </div>
              <div className="font-display text-[20px] font-black text-foreground">#{p.rank}</div>
              <div className="text-[11px] text-muted-foreground">מתוך {p.totalPlayers.toLocaleString('he-IL')}</div>
            </div>
          </div>

          {/* progress to next level */}
          {nextLevel && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-[11px] mb-1.5">
                <span className="text-muted-foreground">{range.min}</span>
                <span className="font-bold text-brand">עוד {range.max + 1 - p.rating} לרמה {nextLevel.code}</span>
                <span className="text-muted-foreground">{range.max + 1}</span>
              </div>
              <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-l from-gold to-brand transition-all duration-1000"
                  style={{ width: `${Math.round(progress * 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* sparkline */}
          <div className="mt-5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[12px] text-muted-foreground">התקדמות הדירוג</span>
              <span className="text-[11px] text-muted-foreground">שיא: {p.peak}</span>
            </div>
            <Sparkline data={p.history} />
          </div>
        </div>
      </div>

      {/* Skill radar — what peers actually see on court */}
      <div className="px-5 mt-4">
        <SkillRadar
          current={PEER_AXES_HISTORY.current}
          previous={PEER_AXES_HISTORY.previous}
          ratersCount={PEER_AXES_HISTORY.raters_count}
          windowLabel={PEER_AXES_HISTORY.window_label}
        />
      </div>

      {/* Reliability card */}
      <div className="px-5 mt-4">
        <div className="bg-card rounded-3xl border border-border shadow-luxe p-5">
          <div className="flex items-center gap-5">
            <ReliabilityRing pct={rel.pct} />
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <Sparkles size={15} className="text-gold" />
                <span className="font-display text-[18px] font-black">אמינות הדירוג</span>
              </div>
              <div className={`text-[13px] font-bold mt-0.5 ${
                relLabel.tone === 'high' ? 'text-emerald-600'
                : relLabel.tone === 'good' ? 'text-brand'
                : relLabel.tone === 'mid' ? 'text-gold-deep' : 'text-muted-foreground'
              }`}>
                {relLabel.text}
              </div>
              <p className="text-[12px] text-muted-foreground leading-relaxed mt-1.5">
                מבוסס על <b className="text-foreground">{rel.opponents} יריבים שונים</b> ב-{rel.games} משחקים.
                ככל שתשחק נגד יותר אנשים שונים — האמינות תעלה.
              </p>
            </div>
          </div>

          {/* mini stat row */}
          <div className="grid grid-cols-3 gap-2.5 mt-4">
            {[
              { label: 'משחקים', value: rel.games },
              { label: 'יריבים שונים', value: rel.opponents },
              { label: 'יריבים אפקטיביים', value: rel.dEff },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl bg-bgWarm border border-border px-3 py-2.5 text-center">
                <div className="font-display text-[20px] font-black text-brand tabular-nums">{s.value}</div>
                <div className="text-[10px] text-muted-foreground leading-tight mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate('/rating-explained')}
            className="w-full mt-4 inline-flex items-center justify-center gap-2 rounded-full border border-brand/20 bg-brand-softer text-brand h-11 font-bold text-[14px] active:scale-[0.98] transition-transform"
          >
            <Info size={16} />
            איך חישבנו את הדירוג?
            <ChevronLeft size={16} />
          </button>
        </div>
      </div>

      {/* Form + stats */}
      <div className="px-5 mt-4">
        <div className="bg-card rounded-3xl border border-border shadow-luxe p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="font-display text-[18px] font-black">הכושר האחרון</span>
            <span className="text-[13px] font-bold text-brand">{winRate}% נצחונות</span>
          </div>
          <div className="flex items-center gap-1.5">
            {p.form.map((r, i) => (
              <span
                key={i}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-[13px] font-black ${
                  r === 'W' ? 'bg-brand text-white' : 'bg-muted text-muted-foreground'
                }`}
              >
                {r === 'W' ? 'נ' : 'ה'}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2.5 mt-4">
            <div className="rounded-2xl bg-bgWarm border border-border px-4 py-3">
              <div className="font-display text-[22px] font-black text-emerald-600">{p.wins}</div>
              <div className="text-[12px] text-muted-foreground">נצחונות</div>
            </div>
            <div className="rounded-2xl bg-bgWarm border border-border px-4 py-3">
              <div className="font-display text-[22px] font-black text-muted-foreground">{p.losses}</div>
              <div className="text-[12px] text-muted-foreground">הפסדים</div>
            </div>
          </div>
        </div>
      </div>

      {/* Opponent diversity */}
      <div className="px-5 mt-4">
        <div className="bg-card rounded-3xl border border-border shadow-luxe p-5">
          <div className="flex items-center gap-1.5 mb-3">
            <Users2 size={16} className="text-brand" />
            <span className="font-display text-[18px] font-black">היריבים שלך</span>
          </div>
          <div className="flex flex-col gap-2">
            {p.opponentsFaced.slice(0, 6).map((o) => (
              <div key={o.name} className="flex items-center gap-3">
                <LevelTag level={o.level} size="xs" />
                <span className="text-[13px] flex-1">{o.name}</span>
                <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden max-w-[120px]">
                  <div className="h-full bg-brand rounded-full" style={{ width: `${(o.games / 4) * 100}%` }} />
                </div>
                <span className="text-[12px] text-muted-foreground w-12 text-left">{o.games} משחקים</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
