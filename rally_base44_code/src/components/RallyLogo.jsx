// Rally brand mark — a real padel racket: teardrop frame, solid hitting face
// with drilled holes (padel, not tennis strings), wrapped grip and butt cap.
// Drawn in currentColor so the same component works on ivory and on emerald.
// Geometry is exported so SplashScreen can animate the exact same paths.

export const MARK_VIEWBOX = '0 0 96 132';

// Outer frame silhouette (teardrop head melting into the throat).
export const MARK_HEAD =
  'M48 5 C69 5 86 21 86 45 C86 68 74 84 60 90 C56 91.6 52 92.4 48 92.4 C44 92.4 40 91.6 36 90 C22 84 10 68 10 45 C10 21 27 5 48 5 Z';

// Inner edge of the frame = the hitting face.
export const MARK_FACE =
  'M48 11 C65.5 11 80 24.5 80 45 C80 65 69.5 79 58 84 C54.5 85.5 51 86.2 48 86.2 C45 86.2 41.5 85.5 38 84 C26.5 79 16 65 16 45 C16 24.5 30.5 11 48 11 Z';

// Drilled-hole grid: [row y, max offset steps] — steps of 8px around x=48,
// row widths follow the teardrop taper.
const HOLE_ROWS = [
  [16, 1], [24, 2], [32, 3], [40, 3], [48, 3], [56, 3], [64, 2], [72, 2], [80, 1],
];
export const MARK_HOLES = HOLE_ROWS.flatMap(([cy, n]) => {
  const row = [];
  for (let k = -n; k <= n; k++) row.push({ cx: 48 + k * 8, cy, r: 2.2 });
  return row;
});

// Wrapped grip: three tape segments + a wider butt cap.
export const MARK_GRIP = [
  { x: 43, y: 90, width: 10, height: 8, rx: 3 },
  { x: 43, y: 100, width: 10, height: 8, rx: 3 },
  { x: 43, y: 110, width: 10, height: 8, rx: 3 },
  { x: 41, y: 120, width: 14, height: 7, rx: 3.5 },
];

export function RallyMark({ size = 64, className = '' }) {
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
      <path d={MARK_FACE} fill="currentColor" opacity={0.16} />
      {MARK_HOLES.map((h, i) => (
        <circle key={i} {...h} fill="currentColor" opacity={0.5} />
      ))}
      <path d={`${MARK_HEAD} ${MARK_FACE}`} fill="currentColor" fillRule="evenodd" />
      {MARK_GRIP.map((g, i) => (
        <rect key={i} {...g} fill="currentColor" />
      ))}
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
        <RallyMark size={mark} />
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
