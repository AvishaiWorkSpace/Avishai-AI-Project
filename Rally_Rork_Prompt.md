# Rally — Rork Build Prompt

## What is Rally?
Rally is a real-time padel matchmaking platform for Israeli players. Think "Uber meets Playtomic" — spontaneous, real-time, premium feel. The app connects players to open games, courts, and partners without WhatsApp groups.

**Core value:** "I have time now — find me a game" / "I have a court — find me players."

## Design Direction
**Vibe:** Exclusive club × premium sport. Think Soho House meets Playtomic.  
**NOT:** Generic sports app, AI-looking, cheap, cluttered.

## Tech Stack
- React Native / Expo
- RTL layout (Hebrew-first, right-to-left)
- Animated transitions (React Native Reanimated / Moti)
- Bottom tab navigation with floating action button (FAB)

## Design System

### Colors
```
Background:        #F8F7F4 (warm cream)
Surface/Cards:     #FFFFFF
Brand (primary):   #1B3A2D (deep forest green)
Brand soft:        #EBF2ED
Gold accent:       #C4A265 (warm gold — used for logo dot, stars, highlights)
Sage:              #8FA88B (secondary green)
Text primary:      #1A1A18
Text secondary:    #6B6B66
Text tertiary:     #A3A39E
Success:           #2D7A4F
Warning:           #C4872E
Danger:            #C44B3F
```

### Typography
- **Headings:** Serif font (Frank Ruhl Libre / weight 900). Use for titles, stats, prices.
- **Body:** Sans-serif (Heebo / system font). Use for everything else.
- Numbers always use tabular-nums (monospaced digits).

### Spacing (4px base)
4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64

### Border Radius
- Small (chips, badges): 10px
- Medium (cards, inputs): 16px  
- Large (hero cards, sheets): 24px
- XL (modals): 28px
- Pill (buttons, tags): 999px (full round)

### Shadows (multi-layer, Apple-style)
```
xs: 0 1px 2px rgba(0,0,0,0.04)
sm: 0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)
md: 0 2px 4px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)
lg: 0 4px 8px rgba(0,0,0,0.04), 0 16px 48px rgba(0,0,0,0.08)
brand: 0 4px 16px rgba(27,58,45,0.2), 0 8px 32px rgba(27,58,45,0.1)
```

### Motion
- Page transitions: fade + slide up (500ms, ease-out)
- Card stagger: each card animates in with 60-80ms delay
- Press feedback: scale(0.975) on buttons, scale(0.985) on cards
- Spring easing: cubic-bezier(0.34, 1.56, 0.64, 1) for playful interactions
- Smooth easing: cubic-bezier(0.16, 1, 0.3, 1) for standard transitions

## Screens & Flow

### 1. Welcome Screen
- Large "Rally" logo (serif, 72px, brand color) with animated gold dot
- Tagline: "רשת הפאדל של ישראל"
- Subtitle: "חיבור בזמן אמת בין שחקנים, מגרשים ושותפים — בלי קבוצות וואטסאפ."
- Primary CTA button: "המשך"
- Terms text at bottom

### 2. Login Screen
- Eyebrow: "כניסה"
- Title: "בוא נכיר אותך"
- Sub: "כניסה לוקחת חצי דקה. בלי סיסמאות."
- Two buttons: "המשך עם מספר טלפון" (primary) + "המשך עם Google" (secondary with Google icon)

### 3. OTP Screen
- Title: "שלחנו לך קוד"
- 4 digit input boxes (large, serif font, LTR direction)
- Resend timer
- "אמת ובוא נמשיך" button

### 4. Profile Setup
- Title: "איך לקרוא לך?"
- Circular avatar upload with dashed border + plus icon
- Name input field
- "הצעד הבא" button

### 5. Zones Selection
- Title: "איפה אתה משחק?"
- Multi-select chips for cities (תל אביב, פתח תקווה, רמת גן, גבעתיים, חולון, בת ים, הרצליה, רעננה, הוד השרון, ראש העין, ראשון לציון, נתניה)
- Selected chips turn brand-green with checkmark
- Radius selector: 4 buttons (15/30/45/60 minutes)

### 6. Quiz (12 questions)
- Progress bar with counter "1 / 12"
- Question title (serif, large)
- 4 answer options as cards with number circle
- Selected option highlights with brand border + green circle
- "הבא" button (disabled until selection)

### 7. Home Screen (main screen)
Components top-to-bottom:
- **Topbar:** "Rally" logo + notification bell with badge
- **Greeting:** Avatar + "היי, אבישי" + level tag (B2) + location + reliability
- **QuickMatch banner:** Dark green card with lightning icon, "מצא משחק עכשיו", gold gradient overlay
- **Emergency banner:** Black card with pulsing green dot, court availability alert
- **Hero card:** Next match — 16:9 image with gradient overlay, venue name, time. Below: player avatars (3 filled + 1 empty dashed), level tag, distance. **Slide-to-Join** at bottom.
- **Friends playing:** Horizontal scroll of friend cards
- **Open matches:** Filter chips (הכל/עכשיו/היום/מחר/B/A) + match cards list

### 8. Find Screen
- Search bar with icon
- Calendar strip (horizontal scroll, today highlighted in brand green)
- Filter chips
- Status text: "14 משחקים · היום · ברדיוס 30 דק׳ נסיעה"
- Match cards list with stagger animation

### 9. Market Screen (שוק המגרשים)
- **Hero card:** Brand green with gold gradient, "מגרש מתפנה? אל תאבד עליו כסף."
- **Trust block:** Light green card with shield icon, trust message
- Filter chips
- Market cards: venue + time + locked price + seller avatar + reliability + type tag

### 10. Club Screen
- Hero image (220px, rounded, gradient overlay) with club name
- Open matches list specific to this club

### 11. Profile Screen
- Centered avatar (88px) with shadow
- Name (serif, large) + level tag + location
- **Stats grid:** 3 columns (משחקים/ניצחונות/אחוזי ניצחון)
- **Reliability bar:** Animated fill on scroll, score + status
- **Match history:** List with W/L colored circles + venue + score

### 12. Chat Screen
- Header: venue + time + player count + avatar stack
- **Equipment section:** Sage green card with checklist (כדורים, מחבט, מים)
- **Rate CTA:** Brand green banner "סיימתם לשחק? דרגו את הקבוצה"
- Chat messages: bubbles (white for others, brand green for me)
- **Frosted input bar:** Fixed bottom, backdrop-blur, send button

### 13. QuickMatch Screen
- Centered radar animation (pulsing circles expanding outward)
- Rotating search icon
- "מחפש לך רביעייה..." text

### 14. Rate Screen
- "איך היה המשחק?" title
- 5 gold stars (filled/empty with scale animation)
- Attribute chips: רמה גבוהה, ספורטיביות, הגיע בזמן, אנרגיה טובה, תקשורת, משחק צוות
- "שלח דירוג" button

### 15. Rate Done Screen
- Animated checkmark circle (pop-in spring animation)
- "תודה!" title
- Subtitle about improving the system
- "חזרה לדף הבית" button

### 16. Sell Court Screen
- Title: "מכור את המגרש"
- Court selection: Radio cards with image + venue + time
- Type selection: "המקום שלי" / "המגרש כולו"
- **Locked price:** Disabled field with lock icon + price, "אותו מחיר ששילמת"
- "פרסם בשוק" button

### 17. Inbox Screen
- Empty state with icon, title "אין הודעות חדשות", subtitle

## Tab Bar (Bottom Navigation)
5 items with frosted glass background (backdrop-filter blur):
1. **בית** (Home icon) 
2. **חיפוש** (Search icon)
3. **[FAB +]** (Floating action button, elevated -12px, brand green circle with shadow)
4. **שוק** (Shopping bag icon)
5. **פרופיל** (User icon)

Active tab: brand color + top indicator line (2px)

## Signature Interaction: Slide-to-Join
- The ONLY slide interaction in the app. Everything else uses tap buttons.
- Pill-shaped track (62px height), brand-soft background
- Green thumb circle (52px) on the right side
- Drag right-to-left (RTL!) to join
- At 65% threshold → snaps to completion
- On complete: haptic vibrate(20) + checkmark animation + navigate to chat
- Spring physics on snap-back if released early

## Level System
A1 (top) → A2 → B1 → B2 → C1 → C2 (beginner)
- Displayed as pill tags: brand-soft background, brand text, serif font, letter-spacing 0.06em

## Key UX Rules
1. Hebrew-first, RTL layout everywhere
2. No emoji in headings or UI elements
3. No loading spinners — use skeleton screens
4. No rainbow colors for levels — always brand green pills
5. Copy voice: direct, functional, Wolt-style. Not "bro culture".
6. Real Israeli names for mock data (דניאל, יואב, אלון — not John/Jane)
7. All prices in ₪ with tabular-nums
8. Club images: real padel court photos (use Unsplash padel/tennis images)

## What Makes This Premium
- Multi-layer shadows on every card
- Generous whitespace between sections (28-40px)
- Large border-radius (24px cards)
- Subtle gold accent touches
- Frosted glass tab bar
- Staggered list animations
- Serif headings contrast with sans-serif body
- Press states on every interactive element
- Warm background (#F8F7F4) instead of cold white
