# Rally — Complete Build Prompt for Base44

## 🎯 Project Overview

**Rally** is a real-time padel matchmaking platform for Israeli players. Think "Uber meets Playtomic" — spontaneous, real-time, premium experience.

**Core Value:** "I have time now — find me a game" / "I have a court — find me players"

**Status:** v3 prototype (4480 lines HTML) + Supabase backend (12 tables) + Registration questionnaire ready

---

## 🎨 Design System

### Color Palette
```
Brand Green (Primary):     #1B3A2D (Deep Forest)
Brand Soft:               #EBF2ED (Soft Green)
Gold Accent:              #C4A265 (Warm Gold)
Sage (Secondary):         #8FA88B (Medium Green)
Background:               #F8F7F4 (Warm Cream)
Surface:                  #FFFFFF (Pure White)
Text Primary:             #1A1A18 (Almost Black)
Text Secondary:           #6B6B66 (Gray)
Text Tertiary:            #A3A39E (Light Gray)
Success:                  #2D7A4F (Green)
Warning:                  #C4872E (Orange)
Danger:                   #C44B3F (Red)
```

### Typography
- **Headings:** Frank Ruhl Libre (serif), weight 900, sizes 28-32px
- **Body:** Heebo (sans-serif) or system font, weight 400, sizes 14-16px
- **All numbers:** Tabular numerals (monospaced digits)

### Spacing Grid (4px base)
4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64

### Border Radius
- Small (chips): 10px
- Medium (cards): 16px
- Large (hero cards): 24px
- XL (modals): 28px
- Full (pills/buttons): 999px

### Shadows (Apple-style, multi-layer)
```
xs:    0 1px 2px rgba(0,0,0,0.04)
sm:    0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)
md:    0 2px 4px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)
lg:    0 4px 8px rgba(0,0,0,0.04), 0 16px 48px rgba(0,0,0,0.08)
brand: 0 4px 16px rgba(27,58,45,0.2), 0 8px 32px rgba(27,58,45,0.1)
```

---

## 🗺️ 21 Screens

### Auth & Onboarding (Screens 1-6)

**1. Welcome Screen**
- Large "Rally" logo (serif, 72px, brand green) with animated gold dot
- Tagline: "רשת הפאדל של ישראל"
- Subtitle: "חיבור בזמן אמת בין שחקנים, מגרשים ושותפים — בלי קבוצות וואטסאפ"
- CTA: "המשך" button (primary)
- Terms link at bottom

**2. Login Screen (3 Methods)**
- Title: "בוא נכיר אותך"
- Subtitle: "כניסה לוקחת חצי דקה. בלי סיסמאות"
- Button 1: "המשך עם מספר טלפון" (primary, brand green)
- Button 2: "המשך עם Apple" (secondary, with Apple icon)
- Button 3: "המשך עם Google" (secondary, with Google icon)

**3. OTP Verification Screen**
- Title: "שלחנו לך קוד"
- 4 digit input boxes (large, serif font, LTR direction)
- Resend timer (countdown)
- Button: "אמת ובוא נמשיך"

**4. Profile Setup**
- Title: "איך לקרוא לך?"
- Avatar upload (circular, dashed border, plus icon)
- Name input field
- Button: "הצעד הבא"

**5. Zones Selection**
- Title: "איפה אתה משחק?"
- Multi-select city chips (תל אביב, פתח תקווה, רמת גן, וגבעתיים, חולון, בת ים, הרצליה, רעננה, הוד השרון, ראש העין, ראשון לציון, נתניה)
- Selected chips: brand green with checkmark
- Radius selector: 4 buttons (15/30/45/60 minutes)

**6. Registration Questionnaire**
- Title: "איך אתה משחק?" (or "בואנו נביניך טוב יותר")
- 12-15 questions covering:
  - Playing style (aggressive, defensive, balanced)
  - Preferred court type
  - Game frequency (casual, semi-serious, competitive)
  - Experience level (beginner, intermediate, advanced)
  - Social preferences (serious, fun, mixed)
  - Availability (weekdays, weekends, both)
  - Equipment (has racket, needs rental)
  - Injury/physical concerns
  - Preferred partner types
  - Playing goals
- Progress bar: "1/12" at top
- Question display: Large serif heading + 4-5 option cards
- Selected option: Brand green border + checkmark
- Button: "הבא" (disabled until selection, enabled after)
- Final screen: "מוכן! בואו נמצא לך משחקים מהממם!"

### Main App — Tab Navigation (Screens 7-15)

**Tab Bar (Bottom):**
```
בית (Home) | חיפוש (Find) | + (FAB) | שוק (Market) | פרופיל (Profile)
```

**7. Home Screen**
- Top: "Rally" logo + notification bell (with badge count)
- Greeting: Avatar + "היי, [name]" + level badge (e.g., B2) + location + reliability score
- QuickMatch banner: Dark green card with lightning icon + "מצא משחק עכשיו" + gold gradient overlay
- Emergency banner: Black card with pulsing green dot + court availability alert
- Hero card: Next match
  - 16:9 court image + gradient overlay
  - Venue name, time, distance
  - 3 player avatars + "+1" dashed avatar
  - Level tag
  - **Slide-to-Join** interaction (pill-shaped, drag right-to-left to join)
- Friends playing: Horizontal scroll of friend cards
- Open matches section:
  - Filter chips: הכל / עכשיו / היום / מחר / B / A
  - Match list (stagger animation)
  - Each card: club image, name, time, players, level, distance

**8. Chat Screen**
- Header: Venue name + time + player count + avatar stack
- Equipment section: Sage green card with checklist (כדורים, מחבט, מים)
- Rate CTA: Brand green banner "סיימתם לשחק? דרגו את הקבוצה"
- Chat messages: Bubbles (white for others, brand green for me) with timestamps
- Frosted input bar: Fixed bottom with backdrop blur + text input + send button (paper plane icon)

**9. Rate Screen**
- Title: "איך היה המשחק?"
- 5 gold stars (interactive, fill on click, scale animation)
- Attribute chips (multi-select):
  - רמה גבוהה
  - ספורטיביות
  - הגיע בזמן
  - אנרגיה טובה
  - תקשורת
  - משחק צוות
- Button: "שלח דירוג"

**10. Rate Done Screen**
- Animated checkmark (pop-in spring animation)
- Title: "תודה!"
- Subtitle: "אתה עוזר למערכת להיות טובה יותר"
- Button: "חזרה לדף הבית"

**11. Find Screen**
- Search bar + icon
- Calendar strip (horizontal scroll, today highlighted in brand green)
- Filter chips: הכל / עכשיו / היום / מחר / B / A
- Status text: "14 משחקים · היום · ברדיוס 30 דק׳ נסיעה"
- Match list (stagger animation)

**12. FAB Menu** (accessible from + button)
- QuickMatch option
- Sell Court option
- Chat option (if in match)

**13. Market Screen**
- Hero card: Brand green + gold gradient + "מגרש מתפנה? אל תאבד עליו כסף"
- Trust block: Light green card + shield icon + trust message
- Filter chips
- Listings: venue + time + price + seller avatar + reliability + type tag

**14. Sell Court Screen**
- Title: "מכור את המגרש"
- Court selection: Radio buttons with image + venue + time
- Court type: "המקום שלי" / "המגרש כולו"
- Locked price: Disabled field with lock icon + price + "אותו מחיר ששילמת"
- Button: "פרסם בשוק"

**15. Profile Screen**
- Avatar (88px) with shadow
- Name (serif, large) + level badge + location
- Stats grid (3 columns):
  - משחקים / ניצחונות / אחוז ניצחון
- Reliability bar: Animated fill + score + status text
- Match history: List with W/L circles + venue + score + date

### Discovery & Secondary (Screens 16-21)

**16. QuickMatch Screen**
- Radar animation (pulsing circles expanding)
- Rotating search icon
- "מחפש לך רביעייה..." text
- Cancel button
- Auto-navigate to CHAT on match found

**17. Players Directory**
- Search bar
- Player cards: Avatar + name + level + reliability + Add button
- Tap card → PLAYER PROFILE

**18. Player Profile (View Another Player)**
- Avatar + name + level
- Stats + reliability
- Match history
- Add friend + Message buttons

**19. Leaderboard (National Rankings)**
- Filter: All / Friends
- Ranked list with position number:
  - 1️⃣ Player A | 2350 ELO
  - 2️⃣ Player B | 2280 ELO
  - etc.
- Tap to view PLAYER PROFILE

**20. Admin Panel** (Moderators only)
- System stats: Users, matches today, avg rating
- Pending reports list
- User management (search, ban, unban)

**21. Inbox** (Notifications)
- Empty state or notification list
- "No new messages" or match alerts, friend joins, etc.

---

## 🗄️ Database Schema (Supabase PostgreSQL)

### Core Tables

**users**
```sql
id (UUID, PK)
name (TEXT)
avatar_url (TEXT)
phone_number (TEXT, unique)
level (VARCHAR: A1-C2)
city (TEXT)
radius_km (INT)
elo_rating (INT, default 1500)
reliability_score (FLOAT 0-100)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

**clubs**
```sql
id (UUID, PK)
name (TEXT)
description (TEXT)
address (TEXT)
city (TEXT)
latitude (FLOAT)
longitude (FLOAT)
image_url (TEXT)
owner_id (UUID, FK → users)
verified (BOOLEAN)
created_at (TIMESTAMP)
```

**matches**
```sql
id (UUID, PK)
club_id (UUID, FK → clubs)
scheduled_time (TIMESTAMP)
status (VARCHAR: open, in_progress, completed, cancelled)
players_needed (INT)
level_min (VARCHAR: A1-C2)
level_max (VARCHAR: A1-C2)
match_type (VARCHAR: friendly, competitive)
created_by (UUID, FK → users)
created_at (TIMESTAMP)
```

**match_players**
```sql
id (UUID, PK)
match_id (UUID, FK → matches)
player_id (UUID, FK → users)
joined_at (TIMESTAMP)
status (VARCHAR: joined, left, no_show)
```

**ratings**
```sql
id (UUID, PK)
match_id (UUID, FK → matches)
rater_id (UUID, FK → users)
ratee_id (UUID, FK → users)
score (INT: 1-5)
attributes (JSON: array of selected attributes)
comment (TEXT)
created_at (TIMESTAMP)
```

**messages**
```sql
id (UUID, PK)
match_id (UUID, FK → matches)
sender_id (UUID, FK → users)
content (TEXT)
created_at (TIMESTAMP)
```

**market_listings**
```sql
id (UUID, PK)
seller_id (UUID, FK → users)
club_id (UUID, FK → clubs)
court_time (TIMESTAMP)
price (DECIMAL)
status (VARCHAR: available, sold, expired)
created_at (TIMESTAMP)
```

**Supporting Tables:**
- user_favorite_clubs
- match_equipment
- notifications
- reports
- friendships

### Views
```sql
national_leaderboard → Ranked players by ELO
today_open_matches → Today's games with player count
admin_stats → System overview metrics
```

### Functions
```sql
update_player_rating(match_id) → Calculate ELO after game
refresh_national_ranks() → Update leaderboard
update_reliability(player_id) → Calculate reliability score
```

### Security (Row-Level Security)
- Users can only see/edit their own profile
- Users can only see/rate players from their matches
- Users can only message in their joined matches
- Admin panel restricted to verified admins

---

## 🔐 Authentication

**Methods:**
1. **Phone OTP** — SMS via Twilio/Vonage
2. **Email OTP** — Magic link
3. **Apple ID** — OAuth
4. **Google** — OAuth

**Flow:**
```
Login Screen (choose method)
  ↓
OTP/Auth provider screen
  ↓
Verify OTP/token
  ↓
Create/update user profile
  ↓
Navigate to HOME
```

---

## 🎮 Game Mechanics

### ELO Rating System
```
New ELO = Old ELO + K × (Result - Expected)

K = 32 (scaling factor)
Result = 1 (win), 0.5 (draw), 0 (loss)
Expected = 1 / (1 + 10^((opponent_elo - your_elo)/400))
```

### Level Assignment
```
A1 (Top)    → ELO 2000+
A2          → ELO 1800-1999
B1          → ELO 1600-1799
B2          → ELO 1400-1599
C1          → ELO 1200-1399
C2 (Begin)  → ELO <1200
```

### Reliability Score
```
Based on:
- Match completion rate (did you show up?)
- Rating feedback (what others say)
- Report history (were you reported?)

Calculated as percentage: 0-100%
Display: ★★★★☆ badge + "Very Reliable" label
```

---

## 🎬 Key Interactions

### Slide-to-Join (Signature Interaction)
- Pill-shaped track (62px height), brand-soft background
- Green thumb circle (52px) on the right side
- Drag **right-to-left** (RTL!) to join
- At 65% threshold → snap to completion
- On complete:
  - Haptic vibration (20ms)
  - Checkmark animation
  - Navigate to CHAT screen
- Spring physics on snap-back if released early

### QuickMatch Radar
- Expanding circles animation (pulsing)
- Rotating search icon
- "Looking for your 4..." text
- Auto-navigate to CHAT when match found
- Cancel button to exit

### Chat Realtime
- Messages appear instantly (no refresh)
- Unread badge on tab bar
- Equipment checklist (interactive)
- Frosted glass input bar

### Match Joining Flow
```
HOME → See match card
  ↓
Click/Slide to join
  ↓
INSERT into match_players (Supabase)
  ↓
Navigate to CHAT
  ↓
Chat with match group
  ↓
Match time arrives → RATE screen
  ↓
Submit rating → ELO updates
```

---

## 🌐 API Endpoints (Supabase REST)

```
GET    /rest/v1/matches?status=eq.open
GET    /rest/v1/users?id=eq.{id}
POST   /rest/v1/match_players
PATCH  /rest/v1/users?id=eq.{id}
POST   /rest/v1/ratings
GET    /rest/v1/rpc/national_leaderboard
SUBSCRIBE to messages (Realtime)
```

---

## 📱 RTL Layout

- All text flows right→left
- Navigation flipped (buttons on right, back on left)
- Images auto-mirror
- Numbers/emails stay LTR
- Enable in FlutterFlow: App Settings → Localization → Support RTL

---

## 🎯 User Journeys

### Journey 1: "I Want to Play NOW"
```
HOME → Tap QuickMatch
  → QUICKMATCH (radar searching)
  → Match found → CHAT
  → Wait for time
  → Match complete → RATE
  → RATE DONE → HOME
```

### Journey 2: "I Have a Court"
```
HOME → FAB + → Sell Court
  → SELL COURT (select court + price)
  → Publish to MARKET
  → Player finds → CHAT group forms
  → You manage equipment + chat
```

### Journey 3: "Find Specific Game"
```
HOME → FIND
  → Set filters (date, level, location)
  → Browse matches
  → Tap match → CLUB details
  → Tap to join → CHAT
```

---

## 🔄 Data Flow

### Match Creation
```
User publishes court availability
  → INSERT market_listings
  → Notification to nearby players
  → Player joins → INSERT match_players
  → CHAT opens with group
  → Match time arrives
  → Rate screen appears
  → INSERT ratings
  → Trigger: update_player_rating()
  → ELO updates
  → Leaderboard refreshes
```

---

## 🚀 Development Phases

### Phase 1: Setup (Week 1)
- Supabase project + database
- Authentication (phone + social)
- FlutterFlow project setup
- Colors + fonts imported

### Phase 2: Core Screens (Weeks 2-3)
- Auth flow (Login → OTP → Profile → Quiz)
- HOME screen + API integration
- FIND + MARKET screens
- CHAT realtime

### Phase 3: Interactions (Weeks 4-5)
- Slide-to-Join
- QuickMatch radar
- Ratings + ELO updates
- Leaderboard live

### Phase 4: Secondary (Weeks 5-6)
- Admin panel
- Players directory
- Notifications
- Edge cases + bug fixes

### Phase 5: Testing & Deploy (Weeks 7-8)
- Full integration testing
- iOS TestFlight
- Android Beta
- Public release

---

## ✨ Premium Features

- **Multi-layer shadows** on every card (Apple-style depth)
- **Generous whitespace** (28-40px between sections)
- **Smooth animations** (stagger, spring, fade)
- **Frosted glass effects** (chat input, tab bar)
- **Color psychology** (brand green = trust, gold = prestige)
- **Typography contrast** (serif headings vs sans-serif body)
- **Press states** (scale 0.975 on buttons)
- **Haptic feedback** (vibration on Slide-to-Join)
- **RTL-first** (not an afterthought)

---

## 🎨 Design Tokens

```
--color-brand-green: #1B3A2D
--color-brand-soft: #EBF2ED
--color-gold: #C4A265
--color-sage: #8FA88B
--color-bg: #F8F7F4
--color-surface: #FFFFFF
--color-text-primary: #1A1A18
--color-text-secondary: #6B6B66

--font-heading: Frank Ruhl Libre, 900
--font-body: Heebo, 400
--font-size-xl: 32px
--font-size-lg: 28px
--font-size-body: 16px
--font-size-small: 14px

--spacing-xs: 4px
--spacing-sm: 8px
--spacing-md: 16px
--spacing-lg: 24px
--spacing-xl: 32px

--radius-sm: 10px
--radius-md: 16px
--radius-lg: 24px
--radius-xl: 28px
--radius-full: 999px

--shadow-xs: 0 1px 2px rgba(0,0,0,0.04)
--shadow-md: 0 2px 4px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)
--shadow-lg: 0 4px 8px rgba(0,0,0,0.04), 0 16px 48px rgba(0,0,0,0.08)

--motion-duration: 500ms
--motion-easing: cubic-bezier(0.16, 1, 0.3, 1)
--motion-spring: cubic-bezier(0.34, 1.56, 0.64, 1)
```

---

## 🎓 Design Principles

1. **Exclusive Club Vibe** — Think Soho House meets Playtomic
2. **Real-Time Magic** — Instant connections, no delays
3. **Trust-Based** — Ratings + reliability at the core
4. **Playful Details** — Spring animations, satisfying interactions
5. **Premium Quality** — Deep colors, generous space, careful shadows
6. **Accessible** — High contrast, readable fonts, clear CTAs
7. **RTL-First** — Hebrew native, not bolted on
8. **Fast & Responsive** — Optimistic updates, skeleton loading

---

## 📊 Metrics to Track

- Active players (daily/monthly)
- Matches per day
- Avg. game rating
- Player retention
- ELO distribution
- Reliability scores
- Chat message volume
- Market listing conversions

---

## 🔗 Links & References

- **Supabase Project:** https://ygqhgxynuturqwiqzawf.supabase.co
- **Prototype:** rally_v3.html (4480 lines, 21 screens)
- **Database Schema:** rally_database.sql (511 lines)
- **Architecture Docs:** RALLY_ARCHITECTURE.md
- **Screen Map:** RALLY_SCREEN_MAP.md
- **FlutterFlow Guide:** FLUTTERFLOW_BUILD_GUIDE.md

---

## 🎉 Ready to Build!

This prompt contains everything needed to build Rally as a full mobile app. Copy it, adapt it, and ship it!

**Good luck! תשלחו לנו סקרים!** 🚀

