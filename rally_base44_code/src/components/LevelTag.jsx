import { BadgeCheck } from 'lucide-react';

// Rally's unified level language. One scale, everywhere.
// A1 (best) → D2 → מתחיל. Each tier owns a stable color so players
// learn to read level at a glance (key survey finding: fragmented
// level language across WhatsApp groups).
const LEVEL_STYLES = {
  A1: { bg: 'bg-[#1B3A2E]', text: 'text-white', label: 'A1' },
  A2: { bg: 'bg-[#26543F]', text: 'text-white', label: 'A2' },
  B1: { bg: 'bg-brand', text: 'text-white', label: 'B1' },
  B2: { bg: 'bg-brand-soft', text: 'text-brand', label: 'B2' },
  C1: { bg: 'bg-gold-soft', text: 'text-[#8a6d3b]', label: 'C1' },
  C2: { bg: 'bg-[#F3E9D6]', text: 'text-[#8a6d3b]', label: 'C2' },
  D1: { bg: 'bg-sage-soft', text: 'text-[#4a5a47]', label: 'D1' },
  D2: { bg: 'bg-[#EEF1ED]', text: 'text-[#4a5a47]', label: 'D2' },
  מתחיל: { bg: 'bg-muted', text: 'text-muted-foreground', label: 'מתחיל' },
};

const SIZES = {
  xs: 'text-[9px] px-1.5 py-0.5 gap-0.5',
  sm: 'text-[11px] px-2 py-0.5 gap-1',
  md: 'text-[13px] px-2.5 py-1 gap-1',
  lg: 'text-[15px] px-3 py-1.5 gap-1.5',
};

const ICON_SIZE = { xs: 9, sm: 11, md: 13, lg: 15 };

export default function LevelTag({ level = 'B2', size = 'md', verified = false, className = '' }) {
  const style = LEVEL_STYLES[level] || LEVEL_STYLES['מתחיל'];
  return (
    <span
      className={`inline-flex items-center rounded-full font-bold tracking-wide ${style.bg} ${style.text} ${SIZES[size]} ${className}`}
    >
      {verified && <BadgeCheck size={ICON_SIZE[size]} strokeWidth={2.5} className="opacity-90" />}
      {style.label}
    </span>
  );
}
