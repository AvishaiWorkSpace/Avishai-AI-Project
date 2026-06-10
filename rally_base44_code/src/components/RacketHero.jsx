import { useNavigate } from 'react-router-dom';
import { Sparkles, MousePointer2 } from 'lucide-react';
import { Spotlight } from '@/components/ui/spotlight';
import PadelRacket3D from '@/components/PadelRacket3D';

// Premium hero: interactive 3D racket on an emerald-gradient card with a
// gold spotlight. The headline uses the metallic gold-gradient treatment.
export default function RacketHero() {
  const navigate = useNavigate();

  return (
    <div className="relative mx-5 mb-7 overflow-hidden rounded-[28px] bg-brand-gradient ring-gold shadow-luxe">
      <Spotlight className="-top-24 right-0 md:right-20" fill="#d8b675" />

      {/* faint grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
          backgroundSize: '26px 26px',
        }}
      />

      <div className="relative z-10 flex items-stretch">
        {/* Text */}
        <div className="flex-1 py-6 pr-5 pl-1">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-white/5 px-3 py-1 text-[11px] font-semibold text-gold-light">
            <Sparkles size={12} />
            קהילת הפאדל הישראלית
          </div>

          <h1 className="font-display text-[30px] font-black leading-[1.1] text-white">
            שחק.<br />
            <span className="text-gold-gradient">תתחבר. תשתפר.</span>
          </h1>

          <p className="mt-2.5 max-w-[200px] text-[13px] leading-relaxed text-white/70">
            מצא משחק ברמה שלך, מלא מקום חסר בשנייה, ועקוב אחרי ההתקדמות שלך.
          </p>

          <button
            onClick={() => navigate('/find')}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-[14px] font-bold text-brand-deep shadow-gold transition-transform active:scale-95"
          >
            מצא משחק עכשיו
          </button>
        </div>

        {/* 3D racket */}
        <div className="relative w-[150px] flex-shrink-0">
          <PadelRacket3D className="h-full w-full" />
          <div className="pointer-events-none absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-full bg-black/25 px-2.5 py-1 text-[10px] font-medium text-white/80 backdrop-blur-sm">
            <MousePointer2 size={11} />
            גרור לסיבוב
          </div>
        </div>
      </div>
    </div>
  );
}
