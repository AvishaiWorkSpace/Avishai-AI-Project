# Rally — Screen Navigation Map

## 📱 Complete Screen Flow (21 Screens)

```
┌─────────────────────────────────────────────────────────────┐
│              AUTH & ONBOARDING (Screens 1-6)                │
└─────────────────────────────────────────────────────────────┘

    ┌──────────────────┐
    │  1. WELCOME      │
    │  • Logo + tagline│
    │  • "המשך" button │
    │  • Terms link    │
    └────────┬─────────┘
             ↓
    ┌──────────────────────────────┐
    │  2. LOGIN (3 Methods)         │
    │  • Phone OTP                 │
    │  • Email OTP                 │
    │  • Apple ID / Google OAuth   │
    └────────┬─────────────────────┘
             ↓
    ┌──────────────────────────────┐
    │  3. OTP VERIFICATION         │
    │  • 4-digit input              │
    │  • Resend timer              │
    │  • "אמת ובוא נמשיך" button   │
    └────────┬─────────────────────┘
             ↓
    ┌──────────────────────────────┐
    │  4. PROFILE SETUP            │
    │  • Avatar upload             │
    │  • Name input                │
    │  • "הצעד הבא" button         │
    └────────┬─────────────────────┘
             ↓
    ┌──────────────────────────────┐
    │  5. ZONE SELECTION           │
    │  • City chips (multi-select) │
    │  • Radius slider (15-60 min) │
    │  • "הבא" button              │
    └────────┬─────────────────────┘
             ↓
    ┌──────────────────────────────┐
    │  6. LEVEL QUIZ               │
    │  • 12 questions              │
    │  • 4-option cards            │
    │  • Progress: "1/12"          │
    │  • "הבא" button (disabled)   │
    └────────┬─────────────────────┘
             ↓
         [Save to DB]
             ↓
         [Navigate to HOME]


┌─────────────────────────────────────────────────────────────┐
│           TAB NAVIGATION (Bottom Bar + 21 Total Screens)    │
└─────────────────────────────────────────────────────────────┘

         ┌─ בית (Home)
         │
    ┌────┼────┬────┬────┬────┐
    │ 1  │ 2  │ + │ 3  │ 4  │  ← 5 Tab Items
    └─┬──┴──┬─┴──┬─┴──┬─┴──┬─┘
      │     │    │    │    │
      ↓     ↓    ↓    ↓    ↓
     בית  חיפוש FAB  שוק  פרופיל
    (Home)(Find)(+) (Market)(Profile)


┌─────────────────────────────────────────────────────────────┐
│  TAB 1: בית (HOME) — Core Discovery                        │
└─────────────────────────────────────────────────────────────┘

    ┌────────────────────────┐
    │  7. HOME SCREEN        │
    │  ___________________   │
    │  Rally | 🔔 (badge)   │
    │                        │
    │  👤 Hi, Avishai [B2]   │
    │  📍 Ramat Gan, 30 min  │
    │                        │
    │  ⚡ QuickMatch banner  │
    │  🟢 Emergency alert    │
    │                        │
    │  [Next Match Card]     │
    │   Image | Time | Join→ │
    │                        │
    │  Friends Playing       │
    │  [Card] [Card] [Card]  │
    │                        │
    │  Open Matches Today    │
    │  [Filter chips]        │
    │  [Match 1]             │
    │  [Match 2]             │
    │  [Match 3]             │
    └────────────────────────┘
             ↓
    [Tap match card]
             ↓
    ┌────────────────────────┐
    │  13. CLUB SCREEN       │
    │  ___________________   │
    │  [Club hero image]     │
    │   Club name            │
    │                        │
    │  Open Matches (filter) │
    │  [Match 1]             │
    │  [Match 2]             │
    │  [Match 3]             │
    └────────────────────────┘
             ↓
    [Tap a match]
             ↓
    ┌────────────────────────┐
    │  8. CHAT SCREEN        │
    │  ___________________   │
    │  Club | Time | Players │
    │                        │
    │  Equipment checklist   │
    │  ☐ Balls, ☐ Racket    │
    │                        │
    │  [Message bubbles]     │
    │  [Player 1]: Yalla!    │
    │  [You]: בואו נשחק     │
    │                        │
    │  [Rate banner]         │
    │  "Rate the game?"      │
    │                        │
    │  [Input + Send button] │
    └────────────────────────┘
             ↓
    [Tap "Rate the game?"]
             ↓
    ┌────────────────────────┐
    │  9. RATE SCREEN        │
    │  ___________________   │
    │  "איך היה המשחק?"    │
    │                        │
    │  ⭐ ⭐ ⭐ ⭐ ⭐ (5)   │
    │                        │
    │  Attributes:           │
    │  [Level chip]          │
    │  [Sportsmanship]       │
    │  [Timing]              │
    │  [Energy]              │
    │  [Communication]       │
    │  [Teamwork]            │
    │                        │
    │  [Send rating button]  │
    └────────────────────────┘
             ↓
             [Submit]
             ↓
    ┌────────────────────────┐
    │  10. RATE DONE SCREEN  │
    │  ___________________   │
    │       ✓ (animated)    │
    │                        │
    │  "תודה!"              │
    │  "You improved League" │
    │                        │
    │  [Back to home]        │
    └────────────────────────┘


┌─────────────────────────────────────────────────────────────┐
│  TAB 2: חיפוש (FIND) — Advanced Search & Filter           │
└─────────────────────────────────────────────────────────────┘

    ┌────────────────────────┐
    │  11. FIND SCREEN       │
    │  ___________________   │
    │  [Search bar]          │
    │  "חפש קבוצה..."        │
    │                        │
    │  Calendar strip        │
    │  [Sun] [Mon] [Tue]     │
    │  ^ Mon is highlighted  │
    │                        │
    │  Filter chips:         │
    │  [All] [Now] [Today]   │
    │  [Tomorrow] [B] [A]    │
    │                        │
    │  "14 games · Today ·   │
    │   30 min radius"       │
    │                        │
    │  [Match 1]             │
    │  [Match 2]             │
    │  [Match 3] ...         │
    └────────────────────────┘
             ↓
    [Tap match]
             ↓
    [Goes to CHAT SCREEN #8]


┌─────────────────────────────────────────────────────────────┐
│  TAB 3: FAB (+ Button) — Quick Actions Menu                │
└─────────────────────────────────────────────────────────────┘

    ┌─────────────────┐
    │  12. FAB MENU   │
    │  ┌──────────┐   │
    │  │QuickMatch│   │ → Taps: Go to QUICKMATCH #15
    │  └──────────┘   │
    │  ┌──────────┐   │
    │  │Sell Court│   │ → Taps: Go to SELL COURT #12
    │  └──────────┘   │
    │  ┌──────────┐   │
    │  │Chat      │   │ → If in match: Go to CHAT #8
    │  └──────────┘   │
    └─────────────────┘


┌─────────────────────────────────────────────────────────────┐
│  TAB 4: שוק (MARKET) — Sell Court Availability           │
└─────────────────────────────────────────────────────────────┘

    ┌────────────────────────┐
    │  13. MARKET SCREEN     │
    │  ___________________   │
    │  [Hero banner]         │
    │  "Court opening up?"   │
    │  [Sell button]         │
    │                        │
    │  [Trust badge]         │
    │  ✓ Trusted sellers     │
    │                        │
    │  Filter chips:         │
    │  [All] [Available]     │
    │  [Popular]             │
    │                        │
    │  Market listings:      │
    │  [Listing 1]           │
    │  Court | Time | ₪ 150  │
    │  By: Player avatar     │
    │  Reliability: ★★★★★    │
    │                        │
    │  [Listing 2] ...       │
    └────────────────────────┘
             ↓
    [Tap "Sell"]
             ↓
    ┌────────────────────────┐
    │  14. SELL COURT SCREEN │
    │  ___________________   │
    │  "מכור את המגרש"      │
    │                        │
    │  Court selection:      │
    │  [Radio] Club A, 18:00 │
    │  [Radio] Club B, 20:00 │
    │  [Radio] Club C, 22:00 │
    │                        │
    │  Court type:           │
    │  [Radio] My court      │
    │  [Radio] Full court    │
    │                        │
    │  Price (locked):       │
    │  🔒 ₪ 150 (paid amount)│
    │                        │
    │  [Publish button]      │
    └────────────────────────┘
             ↓
    [Submit]
             ↓
    [Published → appears in MARKET #13]


┌─────────────────────────────────────────────────────────────┐
│  TAB 5: פרופיל (PROFILE) — User Stats & Account           │
└─────────────────────────────────────────────────────────────┘

    ┌────────────────────────┐
    │  15. PROFILE SCREEN    │
    │  ___________________   │
    │  [Avatar - large]      │
    │  Avishai [B2]          │
    │  📍 Ramat Gan, Israel  │
    │                        │
    │  Stats grid (3 col):   │
    │  משחקים  ניצחונות     │
    │    24        19        │
    │                   אחוז  │
    │                  79%   │
    │                        │
    │  Reliability (animated)│
    │  ◼████░░░░ 85%        │
    │  "Very Reliable"      │
    │                        │
    │  Match history:        │
    │  🟢 W | Club A | 18-20 │
    │  🔴 L | Club B | 16-20 │
    │  🟢 W | Club C | 21-18 │
    │  [Load more...]        │
    │                        │
    │  Settings (gear icon)  │
    └────────────────────────┘
             ↓
    [Tap match in history]
             ↓
    [Goes to CHAT #8]


┌─────────────────────────────────────────────────────────────┐
│  OTHER SCREENS (Accessible from multiple flows)             │
└─────────────────────────────────────────────────────────────┘

    ┌────────────────────────┐
    │  16. QUICKMATCH SCREEN │
    │  ___________________   │
    │                        │
    │  [Radar animation]     │
    │  ⭕ ⭕⭕ (expanding)   │
    │                        │
    │  "Looking for 4..."    │
    │                        │
    │  [Cancel button]       │
    │                        │
    │  ✓ Match found!        │
    │  [Auto-navigate CHAT]  │
    └────────────────────────┘


    ┌────────────────────────┐
    │  17. PLAYERS DIR.      │
    │  ___________________   │
    │  (Directory/Browse)    │
    │                        │
    │  [Search bar]          │
    │                        │
    │  [Player card 1]       │
    │  Avatar | Name | Level │
    │  Reliability | Add      │
    │                        │
    │  [Player card 2] ...   │
    └────────────────────────┘
             ↓
    [Tap player]
             ↓
    ┌────────────────────────┐
    │  18. PLAYER PROFILE    │
    │  (View another player) │
    │  ___________________   │
    │                        │
    │  [Avatar]              │
    │  Name | Level          │
    │  Stats | Reliability   │
    │  Match history         │
    │                        │
    │  [Add friend button]   │
    │  [Message button]      │
    └────────────────────────┘


    ┌────────────────────────┐
    │  19. LEADERBOARD       │
    │  (National Rankings)   │
    │  ___________________   │
    │                        │
    │  [Filter: All/Friends] │
    │                        │
    │  1️⃣ Player A | 2350    │
    │  2️⃣ Player B | 2280    │
    │  3️⃣ Player C | 2150    │
    │  4️⃣ You      | 1850    │
    │  5️⃣ Player D | 1720    │
    │  ...                   │
    │                        │
    │  [Tap to view profile] │
    └────────────────────────┘


    ┌────────────────────────┐
    │  20. ADMIN PANEL       │
    │  (For moderators/admins)
    │  ___________________   │
    │                        │
    │  System Stats:         │
    │  Users: 1,234          │
    │  Matches today: 56     │
    │  Avg rating: 4.7/5     │
    │                        │
    │  Pending Reports:      │
    │  [Report 1]            │
    │  Player X flagged...   │
    │  [Approve] [Reject]    │
    │                        │
    │  [Report 2] ...        │
    │                        │
    │  User Management:      │
    │  [Search user]         │
    │  [Ban] [Unban] [Stats] │
    └────────────────────────┘


    ┌────────────────────────┐
    │  21. INBOX             │
    │  (Notifications)       │
    │  ___________________   │
    │                        │
    │  [Empty state]         │
    │  "No new messages"     │
    │                        │
    │  OR                    │
    │                        │
    │  New match in your area│
    │  [Tap to view]         │
    │                        │
    │  Friend joined Rally   │
    │  [Tap to add]          │
    └────────────────────────┘
```

---

## 🗺️ Navigation Graph

```
WELCOME (1)
    ↓
LOGIN (2) ←─────────────────────────────────────────┐
    ↓                                                │
OTP (3)                                              │
    ↓                                                │
PROFILE SETUP (4)                                    │
    ↓                                                │
ZONES (5)                                            │
    ↓                                                │
QUIZ (6)                                             │
    ↓                                                │
HOME (7) ──────┬──────────┬──────────┬──────────┬────┘
    ↓          ↓          ↓          ↓          ↓
  FIND(11)  MARKET(13) FAB(12) PROFILE(15) CLUB(10)
    ↓          ↓          ↓          ↓          ↓
  CHAT(8)   SELL(14) QUICKMATCH LEADERBOARD  CHAT(8)
    ↓                     (16)      (19)
  RATE(9)                 ↓
    ↓                    CHAT(8)
  RATE DONE(10)          ↓
    ↓                   RATE(9)
  HOME(7)                ↓
                      RATE DONE(10)
                         ↓
                       HOME(7)

ADMIN PANEL (20) ← Accessible from settings (drawer)
PLAYERS DIR (17) ← From PROFILE or search
PLAYER PROFILE (18) ← Tap player in directory
INBOX (21) ← From top bar or notifications
```

---

## 🎯 Screen Categories

| Category | Screens | Purpose |
|----------|---------|---------|
| **Onboarding** | 1-6 | User signup & setup |
| **Core Tabs** | 7-15 | Main navigation |
| **Flows** | 8-10 | Join match → Chat → Rate |
| **Secondary** | 16-21 | Discovery, admin, notifications |
| **Reusable** | 8, 10, 18 | Appear in multiple flows |

---

## 🔄 Flow Examples

### "I want to play a game RIGHT NOW"
```
HOME (7)
  → Tap "QuickMatch"
  → QUICKMATCH (16)
    [Searching with radar...]
  → Match found!
  → CHAT (8)
    [Join via Slide-to-Join]
  → Wait for match time
  → RATE (9)
    [Post-game rating]
  → RATE DONE (10)
    [Confirmation]
  → HOME (7)
```

### "I have a court, find me players"
```
HOME (7)
  → FAB + button
  → Tap "Sell Court"
  → SELL COURT (14)
    [Select court + time + price]
  → MARKET (13)
    [Published! Now visible]
  → Player finds it
  → You get notification → CHAT (8)
```

### "I want to check rankings"
```
PROFILE (15)
  → Tap "Leaderboard" link
  → LEADERBOARD (19)
    [Browse national rankings]
  → Tap player name
  → PLAYER PROFILE (18)
  → Tap "Message"
  → CHAT (8)
```

---

## 📊 Screen Metrics

| Metric | Value |
|--------|-------|
| Total screens | 21 |
| Auth/Onboarding | 6 |
| Tab screens | 5 |
| Sub-screens | 10 |
| Average screen depth | 2-3 |
| Max depth | 4 (FIND → CLUB → CHAT → RATE) |

