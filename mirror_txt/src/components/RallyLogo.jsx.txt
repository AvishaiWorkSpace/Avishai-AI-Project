import { useId } from 'react';

// Rally brand mark — padel racket with a diamond lattice, drawn in currentColor
// so the same component works on ivory (emerald) and on emerald (ivory).
// Geometry is exported so SplashScreen can animate the exact same paths.

export const MARK_VIEWBOX = '0 0 96 132';
export const MARK_HEAD = 'M48 7 C71 7 87 24 87 49 C87 75 69 91 48 91 C27 91 9 75 9 49 C9 24 25 7 48 7 Z';
export const MARK_HANDLE = { x: 41.5, y: 90, width: 13, height: 33, rx: 6.5 };

// Diagonal lattice lines, clipped to the head. Generated once — both diagonals.
export const MARK_LATTICE = (() => {
  const lines = [];
  for (let i = -3; i <= 3; i++) {
    const o = i * 15;
    lines.push({ x1: 48 + o - 55, y1: -6, x2: 48 + o + 55, y2: 104 }); // ↘
    lines.push({ x1: 48 + o + 55, y1: -6, x2: 48 + o - 55, y2: 104 }); // ↙
  }
  return lines;
})();

export function RallyMark({ size = 64, strokeWidth = 6.5, className = '' }) {
  const clipId = useId();
  const width = (size * 96) / 132;
  return (
    <svg
      width={width}
      height={size}
      viewBox={MARK_VIEWBOX}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <defs>
        <clipPath id={clipId}>
          <path d="M48 16 C66 16 78 30 78 49 C78 70 64 82 48 82 C32 82 18 70 18 49 C18 30 30 16 48 16 Z" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        {MARK_LATTICE.map((l, i) => (
          <line key={i} {...l} stroke="currentColor" strokeWidth={3.2} strokeLinecap="round" />
        ))}
      </g>
      <path d={MARK_HEAD} stroke="currentColor" strokeWidth={strokeWidth} />
      <rect {...MARK_HANDLE} fill="currentColor" />
    </svg>
  );
}

// Full lockup: racket mark + letterspaced RALLY + gold ball dot.
// layout="vertical" (hero/splash, like the brand sheet) or "horizontal" (headers).
export default function RallyLogo({
  layout = 'vertical',
  mark = 64,
  text = 22,
  underline = layout === 'vertical',
  className = '',
}) {
  const wordmark = (
    <span dir="ltr" className="flex items-center" style={{ fontSize: text }}>
      <span
        className="font-bold"
        style={{ fontFamily: 'var(--font-body)', letterSpacing: '0.42em', marginRight: '-0.28em' }}
      >
        RALLY
      </span>
      <span
        className="rounded-full bg-[hsl(var(--gold))] inline-block"
        style={{ width: text * 0.32, height: text * 0.32, marginLeft: text * 0.45 }}
      />
    </span>
  );

  if (layout === 'horizontal') {
    return (
      <span className={`inline-flex items-center gap-2.5 ${className}`}>
        <RallyMark size={mark} strokeWidth={8} />
        {wordmark}
      </span>
    );
  }

  return (
    <span className={`inline-flex flex-col items-center gap-4 ${className}`}>
      <RallyMark size={mark} />
      {wordmark}
      {underline && (
        <span className="h-[3px] w-12 rounded-full bg-[hsl(var(--gold))]" />
      )}
    </span>
  );
}
