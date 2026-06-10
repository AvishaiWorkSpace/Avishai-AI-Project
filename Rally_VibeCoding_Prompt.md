# Rally — Vibe Coding Prompt
> העתק והדבק את כל הטקסט הבא ל-Bolt.new / Lovable / Cursor

---

## PROMPT:

Build a mobile-first web app called **Rally** — a real-time padel matchmaking platform for Israeli players.

---

### 🎨 Design System

- **Style:** Ultra-minimal, premium, luxurious. Think Spotify meets Apple meets a high-end fitness app.
- **Background:** Deep dark — `#0A0A0A` or `#0D0D0D`
- **Primary accent:** Electric green — `#B8FF57` (like a padel ball)
- **Secondary accent:** White `#FFFFFF`, muted gray `#3A3A3A`
- **Typography:** Use "Inter" or "DM Sans" — bold headings, light body text. Large, confident type.
- **Cards:** Dark elevated cards `#161616` with subtle `1px` border `#2A2A2A`
- **Buttons:** Full-width, large (56px height), rounded corners `border-radius: 14px`
- **Spacing:** Generous. Large padding. No clutter. Everything breathes.
- **Language:** Hebrew + English (Hebrew is primary, RTL layout)
- **Icons:** Use Lucide icons throughout

---

### 📱 Screens to Build

#### 1. Onboarding — "מי אתה?"
- Large centered logo: **Rally** in bold white
- Subtitle: "פאדל. עכשיו. ברמה שלך."
- Two buttons:
  - "כניסה עם מספר טלפון" (primary - green)
  - "כניסה עם Google" (secondary - outlined)

---

#### 2. Profile Setup (3 steps)
**Step 1 — שם + תמונה**
- Large avatar upload circle
- First name field
- "המשך" button

**Step 2 — רמת משחק**
- Title: "מה הרמה שלך?"
- 5 large selectable cards (one per level):
  - 🟢 רמה 1 — מתחיל
  - 🟡 רמה 2 — בסיסי
  - 🟠 רמה 3 — בינוני
  - 🔴 רמה 4 — מתקדם
  - ⚫ רמה 5 — פרו
- Each card: big number, label, short description
- Selected card glows with green accent

**Step 3 — אזור מגרשים**
- Title: "איפה אתה משחק?"
- City selector (dropdown or chips): תל אביב, ירושלים, פתח תקווה, חיפה, ועוד
- Radius slider: 15 / 30 / 45 דקות נסיעה
- "סיום" button → goes to Home

---

#### 3. Home Screen — "מה אתה רוצה לעשות?"
- Top bar: Avatar icon (left), "Rally" logo (center), notification bell (right)
- Large greeting: "היי [שם] 👋"
- Subtitle: "רמה 3 · פתח תקווה"

Two large action cards (split screen, full width each):

**Card A — "אני רוצה לשחק"**
- Icon: 🎾
- Background: green accent `#B8FF57`, black text
- Subtitle: "מצא משחק עכשיו"

**Card B — "יש לי מגרש"**
- Icon: 📍
- Background: dark card
- Subtitle: "הוסף מגרש פנוי"

Below: **"משחקים פתוחים באזורך"** section
- Horizontal scroll of game cards (see Game Card below)

---

#### 4. Find a Game Screen
- Title: "משחקים פתוחים"
- Filter chips at top: הכל | רמה 2 | רמה 3 | רמה 4 | עכשיו | היום | מחר
- List of **Game Cards**:

**Game Card design:**
```
┌─────────────────────────────────┐
│  🏟️ מועדון הפאדל ת"א           │
│  היום · 19:00-20:30             │
│                                 │
│  רמה 3  ·  📍 12 דק' נסיעה     │
│                                 │
│  👤👤 _ _   חסרים 2 שחקנים     │
│                                 │
│  [ הצטרף למשחק → ]             │
└─────────────────────────────────┘
```
- Green "הצטרף" button
- Player avatars shown (filled circles for existing, empty dashed circles for missing spots)

---

#### 5. Add Game / Court Available Screen
- Title: "פרסם מגרש"
- Fields:
  - שם המועדון (text input)
  - תאריך ושעה (date/time picker)
  - רמה נדרשת (same level selector as onboarding)
  - כמה שחקנים חסרים? (1 / 2 / 3 selector — big tap buttons)
  - מחיר לשחקן (number input, ₪ prefix)
  - הערות (optional textarea)
- Big green "פרסם משחק" button at bottom

---

#### 6. Court Marketplace — "מכור מגרש"
- Title: "העבר מגרש"
- Subtitle: "לא יכול להגיע? תעביר במקום לאבד"
- List of courts for sale — same Game Card style but with "קנה מגרש" button instead
- Seller info shown: avatar + name + rating stars
- Price badge top-right of card

---

#### 7. Player Profile Screen
- Large avatar (top center)
- Name + level badge (green pill)
- Stats row:
  - משחקים: 24
  - ניצחונות: 15
  - דירוג: ⭐ 4.8
- "משחקים אחרונים" list — simple rows with opponent, date, result (W/L)
- Edit profile button (top right, pencil icon)

---

#### 8. Emergency Alert Banner (component)
When a last-minute cancellation happens, show a **full-width urgent banner** at top of home screen:

```
🚨 מגרש פנוי עכשיו!
מועדון ת"א · רמה 3 · 20:00 היום
חסר שחקן אחד · ₪45
[ הצטרף עכשיו ]
```
- Background: `#B8FF57` (green), black bold text
- Pulsing animation on the "🚨" emoji
- Auto-dismisses after 30 seconds

---

### 🧭 Navigation

Bottom tab bar with 4 tabs:
1. 🏠 בית (Home)
2. 🎾 משחקים (Find Game)
3. ➕ פרסם (Add Game) — center, green circle button, elevated
4. 👤 פרופיל (Profile)

---

### 💾 Data / State

Use mock/dummy data for now. No backend needed yet. Create realistic fake data:
- 5-6 fake open games in Tel Aviv area
- 3-4 fake players with names, levels, ratings
- 2 fake courts for sale in marketplace

---

### 📐 Tech Stack

- **React** (or React Native Web for mobile feel)
- **Tailwind CSS** for styling
- **Framer Motion** for animations (smooth page transitions, card hover effects)
- **Lucide React** for icons
- RTL support enabled globally (`dir="rtl"`)
- Mobile viewport (max-width: 430px centered on desktop)

---

### ✨ Vibe Notes

- Everything should feel **fast and confident**
- Micro-animations on button press (scale down slightly)
- Smooth screen transitions (slide left/right)
- Empty states should be beautiful, not plain — add illustration or large emoji + encouraging text
- Loading states: skeleton screens, not spinners
- The app should feel like something a 25-year-old in Tel Aviv would be proud to show their friends

---

*Built for Rally — Israel's padel matchmaking platform*
