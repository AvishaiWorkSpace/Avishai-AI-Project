import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { getStoredTheme, setStoredTheme } from '@/lib/theme';

// Light/Dark switch. `onDark` styles it for placement on emerald surfaces.
export default function ThemeToggle({ onDark = false, className = '' }) {
  const [theme, setTheme] = useState(getStoredTheme());

  useEffect(() => {
    setStoredTheme(theme);
  }, [theme]);

  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'עבור למצב בהיר' : 'עבור למצב כהה'}
      className={`relative w-10 h-10 rounded-full flex items-center justify-center active:scale-90 transition-transform ${
        onDark
          ? 'border border-gold/30 bg-white/5 text-gold-light'
          : 'bg-card border border-border shadow-sm text-foreground'
      } ${className}`}
    >
      {isDark ? <Sun size={18} strokeWidth={2} /> : <Moon size={18} strokeWidth={2} />}
    </button>
  );
}
