# Rally — Bolt Prompt: Game Room + Mandatory Rating
> פרומפט המשך — הדבק ב-Bolt אחרי שהגרסה הראשונה עובדת

---

## PROMPT:

Add the following feature to the existing Rally app. This is the **social core** of the product — do not skip any detail.

---

### Feature: Post-Game Room (חדר המשחק)

Every game in Rally creates a **temporary social room** for its 4 players.  
The room activates automatically 1 hour after the game's scheduled end time.

---

#### Trigger Flow

1. User opens app after their game ended
2. App **intercepts navigation** — before showing any screen, shows the Post-Game Room
3. User **cannot dismiss, skip, or navigate away** until all players are rated
4. Bottom tab bar is **hidden** during this flow
5. Back button is **disabled**

This is a hard gate. No exceptions.

---

#### Screen 1 — "המשחק הסתיים" (Game Ended)

Full screen takeover:

```
🎾

המשחק הסתיים!

[Club name] · [Date] · [Time]

איך היה?
```

- Background: `#0A0A0A`
- Large padel ball emoji, animated (bounce once)
- White title "המשחק הסתיים!" — large, bold
- Green subtitle with club + date
- One big green button: "דרג את המשחק →"
- No X button. No back. Nothing else.

---

#### Screen 2 — Group Chat (חדר הקבוצה)

Design: looks like a clean dark chat room.

**Header:**
- Title: "קבוצת [Club Name] · [Date]"
- 4 small player avatars in a row (top right)
- Small green pill: "4 שחקנים"

**Chat area:**
- Pre-populated with one system message:
  > 🎾 "המשחק הסתיים! איך היה? שתפו..."
- Chat input at bottom (text field + send button)
- Messages appear in RTL bubbles — sent (right, green), received (left, dark gray)
- Timestamps shown

**Bottom bar (above chat input):**
- Two action buttons:
  - "דרג שחקנים ★" — glowing green, pulsing gently
  - "הצטרף לחדר" (disabled until after rating)

The chat allows casual banter. But the rating button must be pressed to unlock full functionality.

---

#### Screen 3 — Rate Players (דרג שחקנים)

**This screen is mandatory. Cannot be skipped.**

Show each of the other 3 players one by one (card swipe style, or all on one scrollable page).

For each player card:

```
┌──────────────────────────────────┐
│         [Avatar - large]         │
│         דני כהן                  │
│         רמה 3                    │
│                                  │
│   ⭐ ⭐ ⭐ ⭐ ⭐                   │
│   (tap to select 1-5 stars)      │
│                                  │
│   [ + הוסף מספר טלפון ]          │
│                                  │
└──────────────────────────────────┘
```

- Stars are large (40px each), tap to select
- Selected stars fill in green `#B8FF57`
- "הוסף מספר טלפון" button — small, outlined, below the stars
  - On tap: shows a bottom sheet with the player's phone number (mock data) + "שמור לאנשי קשר" button
- Player card has a subtle green checkmark ✓ once rated

**Progress indicator at top:**
- "דירגת 1 מתוך 3 שחקנים"
- Simple progress bar in green

**"סיים דירוג" button:**
- Appears only after ALL 3 players are rated (all have stars selected)
- Before: button is gray and disabled with text "דרג את כל השחקנים"
- After: button turns full green "סיים וחזור →"

---

#### Screen 4 — Post-Rating Summary

After completing rating:

```
✅

תודה!
הדירוג שלך נשמר

[Player 1 avatar] [Player 2 avatar] [Player 3 avatar]

+12 נקודות אמינות לפרופיל שלך

[ חזור לאפליקציה ]
```

- Confetti animation (light, elegant — not overwhelming)
- Green checkmark, large
- Shows all 3 rated players' avatars in a row
- "+12 נקודות אמינות" — gamification, green text
- One button: "חזור לאפליקציה" — unlocks the full app

---

#### Phone Number Sharing (Bottom Sheet)

When user taps "הוסף מספר טלפון" on any player:

```
┌──────────────────────────────────┐
│  ▬                               │
│                                  │
│  📱  דני כהן רוצה לשמור איתך    │
│       קשר?                       │
│                                  │
│  המספר שלו: 050-XXX-XXXX        │
│                                  │
│  [ שמור לאנשי קשר ]   [ סגור ]  │
└──────────────────────────────────┘
```

- Bottom sheet slides up (Framer Motion)
- Dark background with subtle border radius top
- "שמור לאנשי קשר" triggers native contacts save (or just shows success toast)
- Non-blocking — can be done during chat or during rating

---

### Updated App State / Navigation Logic

Add a new state: `pendingRating: boolean`

- After any game the user participated in ends (1h after game time), set `pendingRating = true`
- On every app open/screen change: if `pendingRating === true`, redirect to Post-Game Room
- After completing rating: set `pendingRating = false`, unlock normal navigation

For mock/demo purposes: add a button on the Home screen (small, subtle, for testing):  
**"סמלץ סיום משחק"** — triggers the post-game flow immediately so testers can see it.

---

### Mock Data for Game Room

Pre-populate the chat room with 3-4 messages:

```
System: 🎾 המשחק הסתיים! איך היה? שתפו...
דני כהן: כיף היה! תודה לכולם 🙏
יוסי לוי: ממש נהניתי, נעשה שוב!
[User]: +1 היה מעולה
```

Players to rate (mock):
1. דני כהן — רמה 3 — 050-123-4567
2. יוסי לוי — רמה 3 — 052-987-6543  
3. מיכל אדרי — רמה 2 — 054-456-7890

---

### Design Notes for This Feature

- The entire post-game flow should feel **warm and social** — not clinical
- Use slightly more color here than the rest of the app — this is a celebration moment
- The chat bubbles: green for "me", dark gray `#1E1E1E` for others
- Transition into this flow: **slide up** from bottom (like a modal taking over)
- Transition out: **fade + scale** back to home screen
- The "you can't leave" UX should feel **natural, not punishing** — like the app is guiding you, not trapping you

---

*This feature is the engine of Rally's trust system and social graph. It must feel good to use.*
