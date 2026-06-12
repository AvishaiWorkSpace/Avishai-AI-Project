import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MARK_VIEWBOX, MARK_HEAD, MARK_FACE, MARK_HOLES, MARK_GRIP } from './RallyLogo';

// Boot splash: the racket frame draws itself, the face holes get "drilled"
// one by one, the grip wraps on, RALLY staggers in and the gold ball drops
// into place as the brand dot. Unmounted by App via AnimatePresence.

const LETTERS = ['R', 'A', 'L', 'L', 'Y'];

export default function SplashScreen({ onDone }) {
  const reduced = useMemo(
    () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  useEffect(() => {
    const t = setTimeout(onDone, reduced ? 1100 : 2650);
    return () => clearTimeout(t);
  }, [onDone, reduced]);

  return (
    <motion.div
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.45, ease: 'easeInOut' }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-b from-[hsl(var(--brand-deep))] via-[hsl(162_50%_10%)] to-[hsl(var(--brand-deep))] text-[hsl(var(--brand-foreground))]"
    >
      {/* Court-line motif, same as Login */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.07 }}
        transition={{ duration: 1.2 }}
        className="absolute inset-0 overflow-hidden pointer-events-none"
      >
        <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[480px] h-[760px] border-2 border-white rounded-sm" />
        <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[2px] h-[760px] bg-white" />
        <div className="absolute top-[400px] left-1/2 -translate-x-1/2 w-[480px] h-[2px] bg-white" />
      </motion.div>

      {/* Racket mark: frame draws on, holes get drilled, grip wraps */}
      <svg width={120} height={165} viewBox={MARK_VIEWBOX} fill="none" aria-hidden>
        <motion.path
          d={MARK_FACE}
          fill="currentColor"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 0.16 }}
          transition={{ delay: 0.55, duration: 0.4 }}
        />
        {MARK_HOLES.map((h, i) => (
          <motion.circle
            key={i}
            {...h}
            fill="currentColor"
            initial={reduced ? false : { opacity: 0, scale: 0 }}
            animate={{ opacity: 0.5, scale: 1 }}
            style={{ originX: `${h.cx}px`, originY: `${h.cy}px` }}
            transition={{ delay: 0.6 + i * 0.018, duration: 0.25 }}
          />
        ))}
        <motion.path
          d={MARK_HEAD}
          stroke="currentColor"
          strokeWidth={6}
          initial={reduced ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.1, duration: 0.9, ease: 'easeInOut' }}
        />
        {MARK_GRIP.map((g, i) => (
          <motion.rect
            key={i}
            {...g}
            fill="currentColor"
            initial={reduced ? false : { scaleY: 0 }}
            animate={{ scaleY: 1 }}
            style={{ originY: 0, originX: '50%' }}
            transition={{ delay: 0.85 + i * 0.1, duration: 0.25, ease: 'easeOut' }}
          />
        ))}
      </svg>

      {/* Wordmark + dropping gold ball */}
      <div dir="ltr" className="flex items-center mt-7 text-[30px]">
        <span
          className="font-bold flex"
          style={{ fontFamily: 'var(--font-body)', letterSpacing: '0.42em', marginRight: '-0.28em' }}
        >
          {LETTERS.map((ch, i) => (
            <motion.span
              key={i}
              initial={reduced ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.15 + i * 0.09, type: 'spring', stiffness: 320, damping: 22 }}
            >
              {ch}
            </motion.span>
          ))}
        </span>
        <motion.span
          className="rounded-full bg-[hsl(var(--gold))] inline-block w-[10px] h-[10px] ml-[14px]"
          initial={reduced ? false : { y: -110, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.7, type: 'spring', stiffness: 240, damping: 11, mass: 0.9 }}
        />
      </div>

      {/* Gold hairline + tagline */}
      <motion.span
        className="h-[3px] rounded-full bg-[hsl(var(--gold))] mt-5"
        initial={reduced ? false : { width: 0, opacity: 0 }}
        animate={{ width: 48, opacity: 1 }}
        transition={{ delay: 1.95, duration: 0.4, ease: 'easeOut' }}
      />
      <motion.p
        className="font-display text-[15px] font-bold text-[hsl(var(--gold-light))] mt-4"
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.1, duration: 0.4 }}
      >
        שחק. תתחבר. תשתפר.
      </motion.p>
    </motion.div>
  );
}
