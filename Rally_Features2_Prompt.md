# Rally — Bolt Prompt: Skill Quiz + Credibility Score + Multi-Location
> פרומפט המשך — הדבק ב-Bolt לפרויקט הקיים

---

## PROMPT:

Don't rebuild anything. Keep all existing screens and styles. Add the following 3 improvements to the existing Rally project:

---

## CHANGE 1 — Replace Level Selector with Skill Assessment Quiz

**Remove** the current "בחר רמה 1-5" cards from Profile Setup Step 2.  
**Replace** with a multi-question skill quiz that calculates the player's level automatically.

---

### Quiz Design

**Screen header:**
- Title: "בוא נכיר את המשחק שלך"
- Subtitle: "ענה בכנות — זה יעזור לנו למצוא לך שחקנים ברמה שלך"
- Progress bar at top: "שאלה 1 מתוך 12"

**Question card design:**
- One question per screen (swipe/next flow)
- Large question text (bold, white, centered)
- 4 answer options as large tappable cards:
  - ✅ מעולה — שולט לגמרי
  - 🟢 טוב — ברוב המקרים
  - 🟡 בינוני — עובד עלי לפעמים
  - 🔴 צריך לשפר — עדיין מתקשה
- Selected card gets green border + background tint
- "הבא →" button appears after selection
- Can go back to previous question

---

### The 12 Questions

```
Q1:  החזרה מהכיר (Forehand) — עד כמה ההחזרה שלך מהכיר יציבה?
Q2:  החזרה מהגב (Backhand) — עד כמה ההחזרה שלך מהגב בטוחה?
Q3:  בנדחה (Bandeja) — האם אתה שולט בבנדחה מהאזור הגבוה?
Q4:  ויבורה (Vibora) — האם אתה מסוגל לבצע ויבורה בביטחון?
Q5:  משחק ברשת — האם אתה מרגיש בנוח ליד הרשת?
Q6:  וולי (Volley) — עד כמה אתה מדויק בוולי?
Q7:  לוב (Lob) — האם אתה יודע מתי ואיך לשחק לוב?
Q8:  סמש (Smash) — האם אתה מסוגל לבצע סמש בעצמה ובדיוק?
Q9:  מיקום במגרש — האם אתה יודע לנוע ולהתמצא טקטית?
Q10: משחק בשתיים — עד כמה אתה עובד טוב עם פרטנר?
Q11: מנטליות תחת לחץ — האם אתה נשאר קר ראש בנקודות מכריעות?
Q12: ניסיון כללי — כמה שנים אתה משחק פאדל?
     options: פחות משנה / 1-2 שנים / 3-5 שנים / יותר מ-5 שנים
```

---

### Level Calculation Logic

After all 12 answers, calculate score:
- מעולה = 4 pts
- טוב = 3 pts
- בינוני = 2 pts
- צריך לשפר = 1 pt
- Max = 48 pts

```
0-18  pts → רמה 1 (מתחיל)
19-28 pts → רמה 2 (בסיסי)
29-36 pts → רמה 3 (בינוני)
37-43 pts → רמה 4 (מתקדם)
44-48 pts → רמה 5 (פרו)
```

**Result screen** (after Q12):
```
┌─────────────────────────────────┐
│         🎾                      │
│    הרמה שלך היא                 │
│                                 │
│         רמה 3                   │
│        בינוני                   │
│                                 │
│  "אתה שחקן שמבין את המשחק      │
│   ומוכן לקחת אותו לשלב הבא"    │
│                                 │
│   [ המשך לאפליקציה → ]          │
└─────────────────────────────────┘
```
- Level number displayed large (80px, bold, green)
- Short motivational description per level (write 5 different ones)
- "המשך" button → goes to location selection screen

---

## CHANGE 2 — Credibility Score on Home Screen

**Add a credibility indicator to the player's profile section on the Home screen.**

### Credibility Score System

Score starts at 0. Max is 100.

**Increases:**
- +5 per completed game
- +3 per rating given to others (post-game)
- +2 per positive rating received (4-5 stars)

**Decreases:**
- -10 per cancelled game (within 2 hours of start)
- -5 per no-show

**Credibility Tiers:**

| Score | Badge | Label |
|-------|-------|-------|
| 0-20  | ⚪ | חדש |
| 21-40 | 🟡 | מתפתח |
| 41-60 | 🟠 | אמין |
| 61-80 | 🟢 | מהימן |
| 81-100 | 💚 | מובהר |

---

### Home Screen Profile Bar (updated)

Replace the current subtitle line with a richer player card:

```
┌─────────────────────────────────────────┐
│  [Avatar]  היי אבישי 👋                 │
│            🟠 רמה 3  ·  אמין 67/100    │
│            ████████░░  67%              │
└─────────────────────────────────────────┘
```

- Small colored dot matching the credibility tier
- Score shown as "67/100" in small gray text
- Thin progress bar below (green fill, dark background)
- Tapping this area opens a "מה זה אמינות?" tooltip explaining the system

**Tooltip content (bottom sheet on tap):**
```
💚 ציון האמינות שלך

ציון האמינות מראה לשחקנים אחרים
כמה אפשר לסמוך עליך.

עולה כשאתה:
✓ מסיים משחקים
✓ מדרג שחקנים
✓ מקבל דירוגים טובים

יורד כשאתה:
✗ מבטל בשעה האחרונה
✗ לא מגיע למשחק

הציון שלך כרגע: 67/100
```

---

## CHANGE 3 — Multi-Location Selection (Onboarding & Profile)

**Replace** the single city dropdown in Profile Setup Step 3 with a **multi-select chips interface**.

### Design

Title: "באילו אזורים אתה משחק?"  
Subtitle: "סמן כמה שרוצה — נמצא לך משחקים בכל האזורים האלה"

Display cities as tappable chips in a **wrap layout** (2-3 per row):

```
[תל אביב ✓] [רמת גן] [גבעתיים]
[פתח תקווה ✓] [ראשון לציון ✓] [חולון]
[בת ים] [הרצליה] [רעננה]
[נתניה] [חיפה] [ירושלים]
[אשדוד] [באר שבע] [יבנה]
[מודיעין] [ראש העין] [הוד השרון]
```

**Chip design:**
- Default: dark background `#1E1E1E`, white text, `#2A2A2A` border
- Selected: green background `#B8FF57`, black text, green border, ✓ checkmark
- Minimum 1 must be selected (validate before allowing "המשך")

**Below chips:**
- "הוסף עיר ידנית" — small text link → opens a text input for custom city names

**Distance radius** (keep from existing design):
- Slider: 15 / 30 / 45 / 60 דקות נסיעה
- Small Waze icon next to it

---

### Also update Profile Screen

On the Player Profile screen, show selected locations as small chips:
```
📍 תל אביב  ·  פתח תקווה  ·  ראשון לציון
```

---

## Mock Data Updates

Update the mock player profile to reflect new system:
- Level: calculated from quiz (show as "רמה 3 — בינוני")
- Credibility: 67/100, tier "אמין" 🟠
- Locations: ["תל אביב", "פתח תקווה", "ראשון לציון"]

---

*Keep all existing screens, navigation, colors, and animations untouched.*
