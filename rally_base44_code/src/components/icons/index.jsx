// ============================================================================
// Rally custom icon set — monoline with a champagne-gold accent.
// ----------------------------------------------------------------------------
// Main strokes use `currentColor` so icons inherit text color and adapt to
// light/dark. A single gold accent element per icon gives the set its
// signature (a dot, a seam, a star). Drop-in compatible with how lucide icons
// are used: <Icon size={20} strokeWidth={1.7} className="..." />
// ============================================================================
const GOLD = 'hsl(var(--gold))';

function Svg({ size = 24, strokeWidth = 1.7, className = '', children, ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...rest}
    >
      {children}
    </svg>
  );
}

export function HomeIcon(props) {
  return (
    <Svg {...props}>
      <path d="M4 11.4 L12 4.2 L20 11.4" />
      <path d="M6 10.2 V19.5 H18 V10.2" />
      <path d="M10 19.5 v-3.4 a2 2 0 0 1 4 0 v3.4" stroke={GOLD} />
    </Svg>
  );
}

export function RacketIcon(props) {
  return (
    <Svg {...props}>
      <ellipse cx="12" cy="8.4" rx="5.4" ry="6.2" />
      <path d="M12 14.7 V20.4" />
      <path d="M10.3 20.6 h3.4" />
      <circle cx="12" cy="7.6" r="0.85" fill={GOLD} stroke="none" />
      <circle cx="9.6" cy="9.4" r="0.7" fill={GOLD} stroke="none" />
      <circle cx="14.4" cy="9.4" r="0.7" fill={GOLD} stroke="none" />
    </Svg>
  );
}

export function TagIcon(props) {
  return (
    <Svg {...props}>
      <path d="M3.7 12.6 L11 5.3 a1.6 1.6 0 0 1 1.2 -0.5 L18 5 a1.4 1.4 0 0 1 1.3 1.3 L19 12 a1.6 1.6 0 0 1 -0.5 1.2 L11.2 20.5 a2 2 0 0 1 -2.9 0 L3.7 15.5 a2 2 0 0 1 0 -2.9 z" />
      <circle cx="15.3" cy="8.7" r="1.25" fill={GOLD} stroke="none" />
    </Svg>
  );
}

export function TrophyIcon(props) {
  return (
    <Svg {...props}>
      <path d="M8 4 H16 V8.5 a4 4 0 0 1 -8 0 Z" />
      <path d="M8 5 H5.4 a1.8 1.8 0 0 0 0 3.6 H7" />
      <path d="M16 5 H18.6 a1.8 1.8 0 0 1 0 3.6 H17" />
      <path d="M12 12.5 V15.5" />
      <path d="M9.2 19.4 a2.8 2.8 0 0 1 5.6 0 Z" />
      <path d="M12 5.6 l0.62 1.32 1.45 .14 -1.1 .96 .33 1.42 -1.3 -.76 -1.3 .76 .33 -1.42 -1.1 -.96 1.45 -.14 z" fill={GOLD} stroke="none" />
    </Svg>
  );
}

export function UserIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="8.2" r="3.6" />
      <path d="M5.6 20 a6.4 6.4 0 0 1 12.8 0" />
      <circle cx="17.4" cy="5.4" r="1.4" fill={GOLD} stroke="none" />
    </Svg>
  );
}

export function PlusIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="8.2" />
      <path d="M12 8.4 V15.6 M8.4 12 H15.6" stroke={GOLD} />
    </Svg>
  );
}

export function BellIcon(props) {
  return (
    <Svg {...props}>
      <path d="M6 16 V11 a6 6 0 0 1 12 0 V16 l1.4 1.9 H4.6 Z" />
      <path d="M10 19.4 a2 2 0 0 0 4 0" />
      <circle cx="12" cy="10.6" r="1.2" fill={GOLD} stroke="none" />
    </Svg>
  );
}

export function BallIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="8.2" />
      <path d="M5.4 8.4 a9 9 0 0 0 0 7.2 M18.6 8.4 a9 9 0 0 1 0 7.2" stroke={GOLD} />
    </Svg>
  );
}

export function CourtIcon(props) {
  return (
    <Svg {...props}>
      <rect x="3.8" y="5.2" width="16.4" height="13.6" rx="1.6" />
      <path d="M3.8 12 H20.2" />
      <path d="M12 5.2 V18.8" stroke={GOLD} />
    </Svg>
  );
}

export function FlameIcon(props) {
  return (
    <Svg {...props}>
      <path d="M12 3.2 c2.8 3.6 4.8 5 4.8 8.6 a4.8 4.8 0 0 1 -9.6 0 c0 -1.9 1 -3 2 -3.9 c0 1.9 1 2.4 1.9 2.4 c0 -2.9 -1.8 -3.9 -1 -9.1 z" />
      <circle cx="12" cy="15.4" r="2" fill={GOLD} stroke="none" />
    </Svg>
  );
}

export function SparkIcon(props) {
  return (
    <Svg {...props}>
      <path d="M12 3.4 L13.4 9.2 L19.2 10.6 L13.4 12 L12 17.8 L10.6 12 L4.8 10.6 L10.6 9.2 Z" />
      <circle cx="12" cy="10.6" r="1" fill={GOLD} stroke="none" />
    </Svg>
  );
}

export function SearchIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="11" cy="11" r="6.4" />
      <path d="M15.8 15.8 L20 20" />
      <circle cx="11" cy="11" r="1.3" fill={GOLD} stroke="none" />
    </Svg>
  );
}
