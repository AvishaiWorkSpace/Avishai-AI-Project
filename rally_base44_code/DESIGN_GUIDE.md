# Rally — Design & Code Guide

Rally is an Israeli padel community app. RTL Hebrew, mobile-first (max-w-md), luxury
"emerald & champagne gold" identity. This guide is the contract every screen follows.

## Stack
React 18 + Vite, Tailwind (tokens in `src/index.css`), framer-motion, lucide-react,
@tanstack/react-query, recharts, date-fns. Data via `base44` client (`src/api/base44Client.js`)
which runs fully offline against a localStorage-backed mock store.

## Reference screens (read before building anything)
- `src/pages/Home.jsx` — in-layout page composition, section headers, horizontal scrollers.
- `src/pages/Notifications.jsx` — standalone page pattern: header w/ back button, motion list.
- `src/pages/Market.jsx` — forms, sheets, toasts.
- `src/pages/Leaderboard.jsx`, `src/pages/Profile.jsx` — data-dense screens, charts.
- `src/pages/Login.jsx` / `src/pages/Onboarding.jsx` — dark emerald full-bleed flows.

## Page shells
- **Standalone route** (anything NOT under AppLayout):
  `<div dir="rtl" className="min-h-screen bg-background max-w-md mx-auto pb-10">`
  Header row: back button (`ArrowRight`, `navigate(-1)`, 36px round bg-card border) +
  `font-display text-[22px] font-black` title.
- **Inside AppLayout** (`/`, `/find`, `/market`, `/profile`, `/players`, `/leaderboard`, `/quick`, `/community`):
  no outer wrapper, root `className="pb-28"` so the floating navbar never covers content.

## Typography
- Headings: `font-display` + `font-black` (Chillax carries Latin/numerals, Rubik carries Hebrew).
- Sizes: page title 22px, section header 18–20px, card title 14px bold, body 12.5–14px,
  captions 10–12px. Use bracket sizes (`text-[13px]`) like the reference screens.

## Color — tokens only, never raw hex
`bg-background, bg-card, border-border, text-muted-foreground, bg-brand, text-brand,
bg-brand-soft, bg-brand-softer, bg-gold, bg-gold-soft, bg-bgWarm, text-destructive`
plus utilities from index.css: `bg-brand-gradient, bg-ivory-gradient, text-gold-gradient,
glass, shadow-luxe, shadow-gold, ring-gold`. Arbitrary values go through vars:
`bg-[hsl(var(--gold))]`. Dark mode must work — tokens guarantee it; fixed white/black is
allowed only over photos.

## Hard rules
- **No emojis anywhere.** The brand uses the custom icon set (`src/components/icons`) and lucide.
- All copy in Hebrew (numerals/brand names may be Latin).
- Round geometry: `rounded-2xl`/`rounded-3xl`/full; cards `bg-card border border-border shadow-sm`.
- Micro-interactions: `active:scale-95` (or 0.98 on wide cards), framer-motion entrance
  (`initial={{opacity:0,y:14}}` + spring, stagger `delay: i*0.06`).
- Deterministic mock data only — no unseeded `Math.random()` in render paths.
- Images: Unsplash via the `img()`/`face()` helpers' URL shape (see `src/data/mockData.js`).

## Data layer
- `base44.entities.{Match,Club,Player,CourtListing,MatchResult,PeerRating}` —
  `.list(sort,limit)` `.filter(query,sort,limit)` `.get(id)` `.create(data)` `.update(id,data)`.
  Wrap in `useQuery({ queryKey, queryFn })`.
- Current user: `JSON.parse(localStorage.getItem('rally_user') || '{}')`, fall back to
  `DEFAULT_USER` from `src/data/mockData.js`.
- Screen-specific demo state → its own localStorage key (`rally_*`).

## Shared components
`MatchCard, LevelTag, SlideToJoin, SkillRadar, Sparkline, ReliabilityRing, RallyLogo
(+ RallyMark), ThemeToggle, FreeCourtAlert`, icons from `@/components/icons`,
ui primitives in `src/components/ui`. Reuse before building new.

## Existing routes (link only to these)
`/ /find /market /market/sell /profile /players /leaderboard /quick /community
/my-games /add-match /calendar /stats /wallet /player-preferences /clubs /clubs-map
/book-court /tournaments /groups /groups/:id /match/:id /rate-players /rate
/rating-explained /notifications /about /contact /admin /club-admin /club-dashboard
/login /register /forgot-password /reset-password /onboarding`
