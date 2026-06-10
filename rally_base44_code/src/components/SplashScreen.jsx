import { useEffect, useId, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MARK_VIEWBOX, MARK_HEAD, MARK_HANDLE, MARK_LATTICE } from './RallyLogo';

// Boot splash: the racket draws itself, RALLY staggers in, the gold ball
// drops into place as the brand dot. Unmounted by App via AnimatePresence.

const LETTERS = ['R', 'A', 'L', 'L', 'Y'];

export default function SplashScreen({ onDone }) {
  const clipId = useId();
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

      {/* Racket mark, drawn stroke by stroke */}
      <svg width={120} height={165} viewBox={MARK_VIEWBOX} fill="none" aria-hidden>
        <defs>
          <clipPath id={clipId}>
            <path d="M48 16 C66 16 78 30 78 49 C78 70 64 82 48 82 C32 82 18 70 18 49 C18 30 30 16 48 16 Z" />
          </clipPath>
        </defs>
        <g clipPath={`url(#${clipId})`}>
          {MARK_LATTICE.map((l, i) => (
            <motion.line
              key={i}
              {...l}
              stroke="currentColor"
              strokeWidth={3.2}
              strokeLinecap="round"
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65 + i * 0.035, duration: 0.3 }}
            />
          ))}
        </g>
        <motion.path
          d={MARK_HEAD}
          stroke="currentColor"
          strokeWidth={6.5}
          initial={reduced ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.1, duration: 0.9, ease: 'easeInOut' }}
        />
        <motion.rect
          {...MARK_HANDLE}
          fill="currentColor"
          initial={reduced ? false : { scaleY: 0 }}
          animate={{ scaleY: 1 }}
          style={{ originY: 0, originX: '50%' }}
          transition={{ delay: 0.85, duration: 0.35, ease: 'easeOut' }}
        />
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
