# Rally — Luxury Visual Identity Research

**Goal:** Make Rally (Israeli padel matchmaking app, RTL Hebrew, mobile-first React + Tailwind) feel like a "$50k" premium product — Rolex / Hermès / private-club caliber, not an AI-built template.

**Current state:** deep emerald `--brand ≈ hsl(162 47% 13%)`, champagne gold accent, warm ivory background, Frank Ruhl Libre (display serif) + Heebo (body sans).

**Author's bottom line up front:** The current direction is *correct* — emerald + champagne gold is genuinely one of the most established luxury codes (Harrods, heritage private clubs). It just needs to be *refined and systematized*, not replaced. Palette **A (Refined Emerald)** is my top recommendation, paired with **Frank Ruhl Libre (display) + Assistant (body)**. Full reasoning at the end.

> A note on padel specifically: padel's natural habitat is a glass-walled court on a dark surface. Deep green + gold + glass is almost a literal description of a premium padel club at night. The current direction is not just trendy — it's *on-brand for the sport*. Lean in.

---

## 1. Luxury Color Systems — 3 Complete Palettes

### How to read these
Every luxury digital palette follows the same structural rule: **one deep tone does 60–70% of the work**, **one metallic does the accent**, and **a warm neutral (ivory/champagne) softens it**. Everything else is a tint/shade of those. The mistake that makes apps look cheap is using *many* colors at *high* saturation. Luxury = few colors, deep values, generous neutral space, one disciplined metallic.

Each palette below gives you the 8 tokens you asked for, in both HSL (for Tailwind/CSS `hsl(var(--x))` patterns) and HEX. All are tuned for a **light/ivory-first UI** (recommended for Rally — see "do/don't") with notes for a dark variant where relevant.

---

### Palette A — Refined Emerald + Champagne Gold *(current direction, leveled up)* ⭐ RECOMMENDED

The heritage private-club look (think Harrods green, Mayfair racing green). The refinement vs. your current values: the background goes *slightly* warmer and lighter so it reads as "ivory paper" not "beige"; the emerald gets a touch more depth and a hair less saturation so it reads expensive rather than "spearmint"; the gold is split into a *true* gold and a lighter champagne tint so you can do foil effects without it looking yellow.

| Token | Role | HSL | HEX |
|---|---|---|---|
| `--bg` | Background (ivory paper) | `40 33% 96%` | `#F7F3EC` |
| `--surface` | Cards / sheets | `40 30% 99%` | `#FEFCF9` |
| `--primary` | Brand emerald (buttons, headers) | `162 44% 16%` | `#173E32` |
| `--primary-deep` | Pressed / deepest emerald, text on gold | `164 50% 10%` | `#0D2820` |
| `--accent` / `--gold` | Champagne gold (true metallic) | `41 46% 54%` | `#C6A24E` |
| `--gold-soft` | Light champagne (foil highlights, borders) | `41 55% 84%` | `#EBDAB0` |
| `--muted` | Muted text / secondary | `162 12% 42%` | `#5E726B` |
| `--border` | Hairline borders | `40 22% 88%` | `#E6E0D5` |
| `--text-ink` | Primary text (near-black green) | `164 30% 12%` | `#16322A` |

```css
:root {
  /* Palette A — Refined Emerald + Champagne Gold */
  --bg:            40 33% 96%;   /* #F7F3EC ivory paper      */
  --surface:       40 30% 99%;   /* #FEFCF9 card             */
  --primary:      162 44% 16%;   /* #173E32 emerald          */
  --primary-deep: 164 50% 10%;   /* #0D2820 deepest emerald  */
  --gold:          41 46% 54%;   /* #C6A24E champagne gold   */
  --gold-soft:     41 55% 84%;   /* #EBDAB0 light champagne  */
  --muted:        162 12% 42%;   /* #5E726B muted text       */
  --border:        40 22% 88%;   /* #E6E0D5 hairline         */
  --ink:          164 30% 12%;   /* #16322A primary text     */
}
/* usage: background: hsl(var(--bg)); color: hsl(var(--ink)); */
```

**Tailwind wiring (v3 `tailwind.config.js`):**
```js
theme: { extend: { colors: {
  bg:        'hsl(var(--bg) / <alpha-value>)',
  surface:   'hsl(var(--surface) / <alpha-value>)',
  primary:   { DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
               deep: 'hsl(var(--primary-deep) / <alpha-value>)' },
  gold:      { DEFAULT: 'hsl(var(--gold) / <alpha-value>)',
               soft: 'hsl(var(--gold-soft) / <alpha-value>)' },
  muted:     'hsl(var(--muted) / <alpha-value>)',
  border:    'hsl(var(--border) / <alpha-value>)',
  ink:       'hsl(var(--ink) / <alpha-value>)',
}}}
```

**Dark variant** (for the game-room / night screens — padel-at-night vibe): swap `--bg` → `164 40% 7%` (`#0B1A15`), `--surface` → `163 30% 11%` (`#142620`), keep gold and ivory text `40 33% 92%`. This dual-mode is itself a premium move.

---

### Palette B — Midnight Forest + Warm Bronze *(deeper, more masculine, "Mayfair at night")*

Less "jewelry-box", more "tailored Savile Row". The green pushes toward a blackened pine; the metallic shifts from yellow-gold to **warm bronze**, which feels more athletic and less decorative — a good fit for a sports product that still wants prestige. Reads beautifully in dark mode but the spec below stays ivory-first for consistency.

| Token | Role | HSL | HEX |
|---|---|---|---|
| `--bg` | Background (cool ivory) | `45 25% 95%` | `#F5F1E8` |
| `--surface` | Cards / sheets | `45 30% 98%` | `#FCFAF4` |
| `--primary` | Midnight forest | `158 38% 14%` | `#163127` |
| `--primary-deep` | Deepest pine (near-black) | `160 45% 8%` | `#0A1D16` |
| `--accent` / `--bronze` | Warm bronze | `28 42% 48%` | `#AE7440` |
| `--bronze-soft` | Light bronze / sand (highlights) | `30 38% 78%` | `#D9C2A8` |
| `--muted` | Muted text | `158 10% 40%` | `#5C6E66` |
| `--border` | Hairline | `45 18% 86%` | `#E1DACB` |
| `--text-ink` | Primary text | `160 28% 11%` | `#142A22` |

```css
:root {
  /* Palette B — Midnight Forest + Warm Bronze */
  --bg:            45 25% 95%;   /* #F5F1E8 */
  --surface:       45 30% 98%;   /* #FCFAF4 */
  --primary:      158 38% 14%;   /* #163127 */
  --primary-deep: 160 45%  8%;   /* #0A1D16 */
  --gold:          28 42% 48%;   /* #AE7440 bronze         */
  --gold-soft:     30 38% 78%;   /* #D9C2A8 light bronze   */
  --muted:        158 10% 40%;   /* #5C6E66 */
  --border:        45 18% 86%;   /* #E1DACB */
  --ink:          160 28% 11%;   /* #142A22 */
}
```

**When to choose B over A:** if the founder wants Rally to feel more "athletic luxury" (lululemon-meets-Rolex) and less "boutique jewelry". Bronze also photographs better in app-store screenshots on dark backgrounds.

---

### Palette C — Onyx Court + Electric Lime *(bolder, unexpected — "premium tech-sport")*

The unexpected direction. This abandons gold entirely and goes **dark-mode-first**: a near-black onyx field, a single restrained ivory, and **one electric chartreuse/lime accent** used *sparingly* (it's the padel-ball color — a real brand asset). The luxury here comes from *extreme restraint + depth*, not from metals. Think Whoop, Oura, On Running, premium Formula-1 telemetry. Riskier, but the most "ownable" and the most differentiated from every other padel app (which are all light/clinical).

The trick that keeps lime from looking cheap: keep it to **<5% of any screen**, never on large fills, always on a very dark field, and pair it with an off-white ivory rather than pure white.

| Token | Role | HSL | HEX |
|---|---|---|---|
| `--bg` | Background (onyx) | `150 12% 6%` | `#0D110F` |
| `--surface` | Cards (raised onyx) | `156 14% 10%` | `#141C18` |
| `--primary` | Primary fill (deep moss, supports lime) | `150 20% 16%` | `#20302A` |
| `--primary-deep` | Deepest / borders on dark | `156 18% 12%` | `#181F1B` |
| `--accent` / `--lime` | Electric padel lime | `78 92% 62%` | `#C6F743` |
| `--lime-soft` | Dimmed lime (hover/secondary) | `82 40% 70%` | `#B6C98C` |
| `--muted` | Muted text on dark | `150 6% 60%` | `#909C96` |
| `--border` | Hairline on dark | `156 12% 18%` | `#28332E` |
| `--text-ink` | Primary text (warm ivory) | `48 30% 92%` | `#F0EBDE` |

```css
:root {
  /* Palette C — Onyx Court + Electric Lime (dark-first) */
  --bg:            150 12%  6%;  /* #0D110F onyx           */
  --surface:       156 14% 10%;  /* #141C18 raised card    */
  --primary:       150 20% 16%;  /* #20302A deep moss      */
  --primary-deep:  156 18% 12%;  /* #181F1B                */
  --gold:           78 92% 62%;  /* #C6F743 padel lime     */
  --gold-soft:      82 40% 70%;  /* #B6C98C dimmed lime    */
  --muted:         150  6% 60%;  /* #909C96                */
  --border:        156 12% 18%;  /* #28332E                */
  --ink:            48 30% 92%;  /* #F0EBDE warm ivory     */
}
```

**Accessibility flag for C:** electric lime on onyx easily clears contrast for *graphics*, but **never put lime text under ~14px on dark** — use ivory for body, lime only for active states, the logo, the FAB, and key numbers. Lime as a large text color fails WCAG at small sizes.

---

### Quick comparison

| | A — Refined Emerald | B — Forest + Bronze | C — Onyx + Lime |
|---|---|---|---|
| Feel | Heritage jewelry box | Tailored athletic luxury | Premium tech-sport |
| Risk | Low (proven) | Low–medium | Medium–high |
| Differentiation | Medium | Medium | **High** |
| Default mode | Light/ivory | Light/ivory | Dark |
| Best if founder wants | "Rolex / Harrods" | "lululemon × Rolex" | "Whoop / Oura, own the category" |

---

## 2. Hebrew Typography Pairings (Google Fonts, free)

All fonts below are on Google Fonts with a **proper Hebrew subset** (`&subset=hebrew` or Hebrew glyphs built in) and render correctly RTL. The golden rule for premium Hebrew type: **a high-contrast serif (or strong display) for headlines + a clean humanist sans for everything else.** Don't use more than two families. Use *weight* and *size* for hierarchy, not new fonts.

> RTL setup reminder: set `<html dir="rtl" lang="he">`, and in Tailwind use logical properties (`ps-`/`pe-`, `ms-`/`me-`, `text-start`/`text-end`) instead of `pl/pr/left/right` so the layout mirrors correctly.

---

### Pairing 1 — Frank Ruhl Libre + Assistant ⭐ RECOMMENDED

The most "Israeli-premium" combination available for free. Frank Ruhl is *the* classic Hebrew book/newspaper serif (Haaretz heritage) — instantly signals editorial quality and tradition. Assistant is a cleaner, more refined, lower-contrast body sans than Heebo — it has a calmer, more "designed" texture at body sizes and feels less like a default UI font. This keeps your current display face (good — it's already great) and upgrades the body.

- **Frank Ruhl Libre** — *display / headlines / hero / big numbers labels.* Weights to load: 500 (Medium) and 700 (Bold), optionally 900 (Black) for the hero. Use sparingly and large.
- **Assistant** — *body, UI labels, buttons, captions, inputs.* Weights: 400 (body), 600 (UI/labels/buttons), 700 (emphasis). Assistant's 300 is lovely for large quiet subtitles.

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Assistant:wght@300;400;600;700;800&family=Frank+Ruhl+Libre:wght@500;700;900&display=swap&subset=hebrew" rel="stylesheet">
```
```css
:root{
  --font-display: "Frank Ruhl Libre", Georgia, serif;
  --font-body:    "Assistant", system-ui, sans-serif;
}
h1,h2,.display{ font-family:var(--font-display); font-weight:700; }
body,button,input,.ui{ font-family:var(--font-body); font-weight:400; }
```

---

### Pairing 2 — Suez One + Rubik *(bolder, more modern/confident)*

A more contemporary, app-native feel while still premium. **Suez One** is a single-weight high-impact Hebrew display serif — heavier and more "poster" than Frank Ruhl, great for short punchy headlines and the wordmark. **Rubik** is a slightly rounded geometric sans that's warm, friendly, and very legible RTL — it softens the sharpness of Suez One and feels modern without being cold. This pairing reads younger and more "lifestyle brand" than Pairing 1.

- **Suez One** — *headlines, hero, section titles, the logo lockup.* Single weight (400, but it's visually bold). Use large; never for body.
- **Rubik** — *body, UI, buttons, chips, numbers.* Weights: 400 (body), 500 (UI), 600/700 (emphasis & buttons). Rubik has tabular figures — ideal for your ELO/level numbers.

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600;700&family=Suez+One&display=swap&subset=hebrew" rel="stylesheet">
```
```css
:root{
  --font-display: "Suez One", Georgia, serif;
  --font-body:    "Rubik", system-ui, sans-serif;
}
```

---

### Pairing 3 — Heebo (display, heavy) + Assistant (body) *(all-sans, quietest / most "Apple")*

If the founder ever wants to drop the serif entirely for a cleaner, more iOS-native and ultra-minimal feel. Uses **Heebo at heavy weights (800/900)** for display — large, tight, confident headlines — and **Assistant at 400/600** for body. This is the most restrained, "premium SaaS / fintech" route. Lower personality than 1 or 2, but extremely safe, fast, and clean. (You already have Heebo loaded, so this is the lowest-effort upgrade path — just add Assistant and push Heebo weights to 800/900 for headlines.)

- **Heebo** — *display only, weights 800/900*, tight letter-spacing, large sizes.
- **Assistant** — *all body/UI, weights 400/600/700.*

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Assistant:wght@400;600;700&family=Heebo:wght@400;800;900&display=swap&subset=hebrew" rel="stylesheet">
```
```css
:root{
  --font-display: "Heebo", system-ui, sans-serif;  /* weight 800/900 */
  --font-body:    "Assistant", system-ui, sans-serif;
}
```

**Other strong Hebrew Google fonts worth keeping in your back pocket** (all free, Hebrew-subset): **Alef** (geometric, 2 weights — good for a tech logo), **Secular One** (single-weight bold display, very modern), **Noto Serif Hebrew** / **David Libre** (alternative classic serifs if Frank Ruhl feels overused), **Bellefair** (elegant thin serif for quiet editorial moments). Avoid for premium: **Karantina** (too quirky/condensed for trust-critical UI — fine as a one-off accent only), and never use **Arial/Times** fallbacks visibly.

---

## 3. Premium Micro-Interactions & UI Patterns

The difference between "$5k template" and "$50k product" is almost entirely in motion, depth, and material. Below are specific, paste-ready techniques. Pair these with **Framer Motion** (you already plan to use it) for spring physics.

### 3.1 A real shadow system (the #1 cheap-vs-premium tell)
Cheap UIs use one flat `box-shadow: 0 2px 4px rgba(0,0,0,.1)`. Premium UIs use a **layered, tinted, low-opacity** shadow that matches the brand hue. Build an elevation scale and *never* deviate:

```css
:root{
  /* shadows tinted with the brand green, not pure black — looks expensive */
  --shadow-sm: 0 1px 2px hsl(162 44% 16% / .06);
  --shadow-md: 0 4px 12px hsl(162 44% 16% / .08),
               0 1px 3px  hsl(162 44% 16% / .06);
  --shadow-lg: 0 12px 32px hsl(162 44% 16% / .12),
               0 4px 8px   hsl(162 44% 16% / .08);
  --shadow-xl: 0 24px 60px hsl(162 44% 16% / .16),
               0 8px 16px  hsl(162 44% 16% / .10);
}
```
Rule: shadows get **softer and more spread** as elevation rises, and opacity stays low (≤16%). Tint with `--primary`, not `#000`.

### 3.2 Tasteful glassmorphism (sheets, sticky headers, the tab bar)
Glass works *only* over content and *only* on a few surfaces — the bottom tab bar, sticky headers, and modal sheet headers. Don't glass everything.

```css
.glass {
  background: hsl(var(--surface) / 0.72);
  backdrop-filter: blur(20px) saturate(140%);
  -webkit-backdrop-filter: blur(20px) saturate(140%);
  border: 1px solid hsl(var(--bg) / 0.6);
  /* a faint top hairline of light = the "glass edge" */
  box-shadow: inset 0 1px 0 hsl(0 0% 100% / .5), var(--shadow-lg);
}
```
Performance: `backdrop-filter` is expensive — keep glass on **2–3 fixed surfaces**, never animate the blur, and respect `prefers-reduced-transparency` / `prefers-reduced-motion` by swapping to a solid `--surface` fill.

### 3.3 Gold foil / metallic accent (the signature luxury detail)
A static gold is flat. *Real* foil has a gradient with a light streak. Use it on the wordmark, level badges (A1!), premium-tier chips, and the hero number.

```css
.gold-foil {
  background: linear-gradient(
    100deg,
    #B8893C 0%, #E7CE8E 22%, #F6ECC9 38%,  /* champagne highlight */
    #C6A24E 55%, #9B7630 78%, #E7CE8E 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  background-size: 200% 100%;
}
/* optional slow shimmer sweep on premium badges only */
@keyframes foil-sweep { to { background-position: 200% 0; } }
.gold-foil--animated { animation: foil-sweep 4.5s ease-in-out infinite alternate; }
```
For a metallic *surface* (a premium badge pill), layer a diagonal sheen:
```css
.metal-pill{
  background:
    linear-gradient(135deg, transparent 40%, hsl(0 0% 100% /.35) 50%, transparent 60%),
    linear-gradient(160deg, #C6A24E, #9B7630 60%, #C6A24E);
}
```

### 3.4 Spring physics for every press & sheet (Framer Motion)
Linear `transition: 0.2s` is the tell of a cheap app. Everything that moves should use a spring with a tiny scale on press (the "haptic-feel" without hardware).

```jsx
// tactile button — feels physical
<motion.button
  whileTap={{ scale: 0.96 }}
  transition={{ type: "spring", stiffness: 400, damping: 28 }}
/>

// bottom sheet — premium settle, not a slide
<motion.div
  initial={{ y: "100%" }}
  animate={{ y: 0 }}
  exit={{ y: "100%" }}
  transition={{ type: "spring", stiffness: 320, damping: 34, mass: 0.9 }}
/>
```
Pair with the Web Vibration API on key confirmations (Slide-to-Join success, match found) where supported: `navigator.vibrate?.(12)` — a 10–15ms tick reads as a real haptic on Android.

### 3.5 Number ticker for ELO / level / stats (tabular figures)
Animate stats counting up on reveal. Use `tabular-nums` so digits don't jiggle the layout (critical for RTL number alignment too).

```jsx
import { useSpring, useTransform, motion } from "framer-motion";
function Ticker({ value }) {
  const spring = useSpring(0, { stiffness: 90, damping: 20 });
  const text = useTransform(spring, v => Math.round(v).toLocaleString("he-IL"));
  useEffect(() => { spring.set(value); }, [value]);
  return <motion.span className="tabular-nums">{text}</motion.span>;
}
```
```css
.tabular-nums{ font-variant-numeric: tabular-nums; font-feature-settings:"tnum"; }
```

### 3.6 Skeleton shimmer (loading state for the Find/Search screens)
A shimmering skeleton tinted to the brand reads far more premium than a spinner.

```css
.skeleton{
  background: linear-gradient(100deg,
    hsl(var(--border) / .5) 30%,
    hsl(var(--surface) / .9) 50%,
    hsl(var(--border) / .5) 70%);
  background-size: 200% 100%;
  animation: shimmer 1.4s ease-in-out infinite;
  border-radius: 12px;
}
@keyframes shimmer{ to { background-position: -200% 0; } } /* RTL: sweep leads -ve */
@media (prefers-reduced-motion: reduce){ .skeleton{ animation: none; } }
```

### 3.7 Other high-end touches that are cheap to add
- **Hairline borders, not boxes:** `1px solid hsl(var(--border))` at ~88% lightness — barely-there separation reads expensive; heavy dividers read cheap.
- **Generous corner radius, consistently:** pick a scale (e.g. 12 / 16 / 24px) and never mix random radii. Cards 16, sheets 24, pills full.
- **Optical spacing / breathing room:** premium = whitespace. Increase padding 20–30% beyond your instinct; let the ivory background show.
- **Staggered entrance:** list items animate in with a 40–60ms stagger (`staggerChildren`) — feels choreographed, not dumped.
- **Spring-loaded checkmarks / confetti restraint:** one tasteful gold particle burst on first-match celebration (you already have this) — keep it 600ms, gold + ivory only, never rainbow.
- **`scroll-behavior: smooth`** and momentum scroll on sheets; snap points on the calendar strip.
- **Pressed states with inset:** active nav/tab uses `box-shadow: inset ...` + gold underline that animates via `layoutId` (shared-layout magic line under the active tab).

---

## 4. Do / Don't — making *this* app feel luxurious not cheap

### DO
- **DO commit to one deep brand tone + one metallic + ivory.** Resist adding a third "fun" color. Restraint *is* the luxury.
- **DO tint shadows and skeletons with the brand green**, never pure black/grey.
- **DO use Frank Ruhl Libre large and sparingly** — serifs whisper "heritage" at 28px+, but get muddy at small sizes. Body stays sans.
- **DO build a strict spacing + radius + elevation scale** and never deviate. Inconsistency is the #1 "AI-built" tell.
- **DO use spring physics + a press-scale on everything tappable.** Motion is where the money shows.
- **DO give the level badges (A1–מתחיל) real craft** — gold foil for top tiers, a tasteful metal pill. This is your signature collectible; make players *want* to show it.
- **DO use tabular figures for every number** (ELO, level, price, time) so RTL numerals align like a watch dial.
- **DO design dark game-room / night screens** — a polished dark mode beside the ivory light mode is itself a premium signal and fits padel-at-night.
- **DO test contrast** (WCAG AA): green text on ivory and ivory text on green both pass; verify gold-on-ivory (it's borderline — use gold for large/graphic, not small body).
- **DO use real photography of glass padel courts at golden hour** if you use imagery — the green/gold/glass world is already cinematic.

### DON'T
- **DON'T use pure white (#FFF) backgrounds or pure black (#000) text.** Pure values feel digital and cheap; warm ivory + near-black green feel printed and expensive.
- **DON'T saturate the green into "spearmint/teal."** Keep saturation moderate (≤46%) and value deep (≤18% L). Bright green = sporty/cheap; deep green = heritage.
- **DON'T let gold become yellow.** Champagne gold (`#C6A24E`/`#EBDAB0`), never `#FFD700`. Yellow-gold is the fastest way to look like a casino.
- **DON'T glass everything or animate blur.** Glass on 2–3 fixed surfaces only; it's jank and tacky everywhere else.
- **DON'T use more than 2 font families** or random font weights. Hierarchy via size/weight, not new fonts.
- **DON'T use harsh `0.2s linear` transitions or default browser shadows.** Springs + layered tinted shadows only.
- **DON'T crowd the screen.** Cramped layouts read cheap. Cut elements before you cut whitespace.
- **DON'T use emoji as UI icons.** Use a single consistent line-icon set (e.g. Lucide) at one stroke weight.
- **DON'T mix corner radii** (a 4px card next to a 20px card screams template).
- **DON'T over-animate.** One signature moment per flow (Slide-to-Join, match-found, first-match). Everything else is calm. Luxury is confident, not busy.

---

## Sources
- [Zoviz — 15 Luxury Brand Colors & Palettes (hex codes)](https://zoviz.com/blog/luxury-brand-colors-meanings)
- [Brandlic — 9 Luxury Color Palettes for High-End Design 2025](https://brandlic.studio/9-luxury-color-palettes-that-define-high-end-design-in-2025/)
- [Design Work Life — 9 Luxury Color Palettes 2026](https://designworklife.com/luxury-color-palettes/)
- [Media.io — Luxury / Champagne Gold / Gold-Green palettes + hex](https://www.media.io/color-palette/luxury-color-palette.html)
- [Figma — Emerald Green & Burgundy color references](https://www.figma.com/colors/emerald-green/)
- [Liafonts — Hebrew Google Fonts guide (weights/use cases)](https://liafonts.com/google-fonts-hebrew/)
- [Google Fonts — Frank Ruhl Libre](https://fonts.google.com/specimen/Frank+Ruhl+Libre) · [Heebo](https://fonts.google.com/specimen/Heebo) · [Rubik (Hebrew)](https://fonts.google.com/specimen/Rubik?subset=hebrew) · [Hebrew subset browse](https://fonts.google.com/?subset=hebrew)
- [Awesome-Hebrew-Fonts (GitHub)](https://github.com/danielrosehill/Awesome-Hebrew-Fonts)
- [UXPilot — Glassmorphism UI best practices](https://uxpilot.ai/blogs/glassmorphism-ui)
- [Medium — Dark Glassmorphism 2026](https://medium.com/@developer_89726/dark-glassmorphism-the-aesthetic-that-will-define-ui-in-2026-93aa4153088f)
- [FlyonUI — Glassmorphism with Tailwind CSS](https://flyonui.com/blog/glassmorphism-with-tailwind-css/)
- [BuildUI — Animated counter (useSpring + tabular-nums)](https://buildui.com/recipes/animated-counter)
- [Motion (Framer Motion) — AnimateNumber & spring animation docs](https://motion.dev/docs/react-animate-number)
