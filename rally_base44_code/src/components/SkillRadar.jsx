import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Target, Zap } from 'lucide-react';
import { SKILL_AXES } from '@/data/peerQuestions';

// Per-axis actionable coaching tip — shown for the weakest axis.
// This is the payoff of peer feedback: not a score, a next step.
const INSIGHTS = {
  net: 'קח את הרשת מוקדם יותר ותרגל וולים מהצד החלש — רוב הנקודות בפאדל נסגרות שם',
  smash: 'עבוד על בנדחה לזכוכית — סיום בטוח שפותח לך את כל המשחק ההתקפי',
  wall: '10 דקות ביום של החזרות מהזכוכית האחורית — ההגנה שלך תשתנה תוך חודש',
  tactics: 'לפני כל הגשה החלט לאן הולכות 2 החבטות הבאות — לשחק בכוונה, לא באינסטינקט',
  positioning: 'שים לב לחזרה לעמדה אחרי כל חבטה — החורים נפתחים כשנשארים לצפות בכדור',
  consistency: 'יעד לסט הבא: אפס מתנות. עדיף כדור איטי פנימה מווינר החוצה',
};

export default function SkillRadar({ current, previous, ratersCount, windowLabel }) {
  const data = Object.entries(SKILL_AXES).map(([key, ax]) => ({
    key,
    axis: ax.label,
    current: current?.[key] ?? 0,
    previous: previous?.[key] ?? 0,
  }));

  const weakest = data.reduce((a, b) => (b.current < a.current ? b : a), data[0]);
  const strongest = data.reduce((a, b) => (b.current > a.current ? b : a), data[0]);

  return (
    <div className="bg-card rounded-3xl border border-border shadow-luxe p-5">
      <div className="flex items-center justify-between mb-1">
        <span className="font-display text-[18px] font-black">תמונת השחקן שלך</span>
        <span className="text-[11px] text-muted-foreground">{ratersCount} מדרגים · {windowLabel}</span>
      </div>
      <p className="text-[12px] text-muted-foreground mb-2">
        מה שחקנים שמשחקים איתך באמת רואים במגרש
      </p>

      <div dir="ltr" className="-mx-2">
        <ResponsiveContainer width="100%" height={250}>
          <RadarChart data={data} outerRadius="72%">
            <PolarGrid stroke="hsl(var(--border))" />
            <PolarAngleAxis
              dataKey="axis"
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))', fontWeight: 600 }}
            />
            <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
            <Radar
              dataKey="previous"
              stroke="hsl(var(--gold))"
              strokeDasharray="4 4"
              fill="hsl(var(--gold))"
              fillOpacity={0.08}
            />
            <Radar
              dataKey="current"
              stroke="hsl(var(--brand))"
              strokeWidth={2}
              fill="hsl(var(--brand))"
              fillOpacity={0.28}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-4 text-[11px] text-muted-foreground -mt-1 mb-4">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-[3px] rounded-full bg-brand inline-block" /> החלון הנוכחי
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-[3px] rounded-full bg-gold inline-block" /> החלון הקודם
        </span>
      </div>

      {/* Strongest + weakest, with the actionable tip */}
      <div className="space-y-2.5">
        <div className="flex items-start gap-2.5 rounded-2xl bg-brand-softer px-4 py-3">
          <Zap size={16} className="text-brand mt-0.5 flex-shrink-0" />
          <div>
            <div className="text-[13px] font-bold text-brand">
              הנשק שלך: {SKILL_AXES[strongest.key].emoji} {strongest.axis} ({strongest.current})
            </div>
          </div>
        </div>
        <div className="flex items-start gap-2.5 rounded-2xl bg-gold-soft px-4 py-3">
          <Target size={16} className="text-[#8a6d3b] mt-0.5 flex-shrink-0" />
          <div>
            <div className="text-[13px] font-bold text-[#8a6d3b] mb-0.5">
              הכי שווה לעבוד על: {SKILL_AXES[weakest.key].emoji} {weakest.axis} ({weakest.current})
            </div>
            <p className="text-[12px] text-[#8a6d3b]/80 leading-relaxed">{INSIGHTS[weakest.key]}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
