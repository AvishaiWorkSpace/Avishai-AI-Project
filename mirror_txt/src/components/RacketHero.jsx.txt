import { useNavigate } from 'react-router-dom';
import { BallIcon } from '@/components/icons';

// Cinematic hero: a REAL padel racket on court (product-shot aesthetic, à la
// NOX-by-Tapia campaign imagery) with a slow Ken Burns drift. Emerald-deep
// gradients keep the Hebrew copy razor-legible over the photo.
const HERO_IMG =
  'https://images.unsplash.com/photo-1612534847738-b3af9bc31f0c?w=1000&q=80&fit=crop';

export default function RacketHero() {
  const navigate = useNavigate();

  return (
    <div className="relative mx-5 mb-7 overflow-hidden rounded-[28px] ring-gold shadow-luxe h-[340px]">
      {/* Real padel photography */}
      <img
        src={HERO_IMG}
        alt="מחבט פאדל על המגרש"
        className="kenburns absolute inset-0 h-full w-full object-cover object-[70%_center]"
      />

      {/* Legibility: deep-emerald wash, stronger on the text side (right, RTL) */}
      <div className="absolute inset-0 bg-gradient-to-l from-[hsl(var(--brand-deep)/0.92)] via-[hsl(var(--brand-deep)/0.55)] to-[hsl(var(--brand-deep)/0.15)]" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[hsl(var(--brand-deep)/0.85)] to-transparent" />

      {/* Copy */}
      <div className="relative z-10 flex h-full flex-col justify-end p-6">
        <div className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold text-[hsl(var(--gold-light))] backdrop-blur-sm">
          <BallIcon size={13} strokeWidth={2} />
          קהילת הפאדל הישראלית
        </div>

        <h1 className="font-display text-[32px] font-bold leading-[1.08] text-white">
          שחק.<br />
          <span className="text-gold-gradient">תתחבר. תשתפר.</span>
        </h1>

        <p className="mt-2 max-w-[230px] text-[13px] leading-relaxed text-white/75">
          מצא משחק ברמה שלך, מלא מקום חסר בשנייה, ועקוב אחרי ההתקדמות שלך.
        </p>

        <button
          onClick={() => navigate('/find')}
          className="mt-4 inline-flex w-fit items-center gap-2 rounded-full bg-gold px-6 py-3 text-[14px] font-bold text-brand-deep shadow-gold transition-transform active:scale-95"
        >
          מצא משחק עכשיו
        </button>
      </div>
    </div>
  );
}
