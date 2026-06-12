import { useEffect, useState } from 'react';
import { BadgeCheck } from 'lucide-react';
import { getLevelLang } from '@/lib/rating';

// Rally's unified level language. One scale, everywhere.
// A1 (best) → D2 → מתחיל. Each tier owns a stable color so players
// learn to read level at a glance (key survey finding: fragmented
// level language across WhatsApp groups).
// The user picks how to read the scale — Israeli letters or the global
// 0–7 numbers — and every tag in the app follows.
const LEVEL_STYLES = {
  A1: { bg: 'bg-[#1B3A2E]', text: 'text-white', label: 'A1', num: '6.5' },
  A2: { bg: 'bg-[#26543F]', text: 'text-white', label: 'A2', num: '5.5' },
  B1: { bg: 'bg-brand', text: 'text-white', label: 'B1', num: '4.8' },
  B2: { bg: 'bg-brand-soft', text: 'text-brand', label: 'B2', num: '4.0' },
  C1: { bg: 'bg-gold-soft', text: 'text-[#8a6d3b]', label: 'C1', num: '3.2' },
  C2: { bg: 'bg-[#F3E9D6]', text: 'text-[#8a6d3b]', label: 'C2', num: '2.5' },
  D1: { bg: 'bg-sage-soft', text: 'text-[#4a5a47]', label: 'D1', num: '1.8' },
  D2: { bg: 'bg-[#EEF1ED]', text: 'text-[#4a5a47]', label: 'D2', num: '1.0' },
  מתחיל: { bg: 'bg-muted', text: 'text-muted-foreground', label: 'מתחיל', num: '0.5' },
};

const SIZES = {
  xs: 'text-[9px] px-1.5 py-0.5 gap-0.5',
  sm: 'text-[11px] px-2 py-0.5 gap-1',
  md: 'text-[13px] px-2.5 py-1 gap-1',
  lg: 'text-[15px] px-3 py-1.5 gap-1.5',
};

const ICON_SIZE = { xs: 9, sm: 11, md: 13, lg: 15 };

// Subscribe to the global level-language preference.
function useLevelLang() {
  const [lang, setLang] = useState(getLevelLang);
  useEffect(() => {
    const sync = () => setLang(getLevelLang());
    window.addEventListener('rally:level-lang', sync);
    return () => window.removeEventListener('rally:level-lang', sync);
  }, []);
  return lang;
}

export default function LevelTag({ level = 'B2', size = 'md', verified = false, className = '' }) {
  const lang = useLevelLang();
  const style = LEVEL_STYLES[level] || LEVEL_STYLES['מתחיל'];
  const text = lang === 'numbers' ? style.num : style.label;
  return (
    <span
      className={`inline-flex items-center rounded-full font-bold tracking-wide tabular-nums ${style.bg} ${style.text} ${SIZES[size]} ${className}`}
    >
      {verified && <BadgeCheck size={ICON_SIZE[size]} strokeWidth={2.5} className="opacity-90" />}
      {text}
    </span>
  );
}
