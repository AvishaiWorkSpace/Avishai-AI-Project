# Rally — Design DNA

> מסמך עוגן לעיצוב. כל החלטה שמתנגשת עם המסמך הזה — מסמנת דגל אדום.

---

## הפילוסופיה

Rally הוא לא Spotify של פאדל. הוא לא Bolt-prototype. הוא **כלי רציני לשחקנים רציניים**, עם נשמה ישראלית.
הבנצ׳מרק הוא **Playtomic** — אבל עם רכיב אחד שמייחד אותנו: **Slide-to-Join**.

---

## Foundations

### Theme — Light
- רקע ראשי: לבן/שמנת `#FAFAF7`
- משטחים מורמים (cards): לבן טהור `#FFFFFF` עם border `1px #ECECE8`
- טקסט ראשי: כמעט-שחור `#0E0E0C`
- טקסט משני: אפור עמוק `#5A5A55`
- טקסט מינורי: אפור בהיר `#9A9A95`

### Accent — Rolex Green
- Primary: ירוק רולקס `#1A4D2E` (deep, prestigious)
- Hover/Pressed: `#143D24`
- Soft tint לרקעים: `#E8F0EA`
- Accent contrast: לבן טהור על הירוק

### State Colors (מאופקים)
- Success: `#1A4D2E` (אותו ירוק — מאוחד)
- Warning: `#B8732A` (terracotta מאופק, לא צהוב צעקני)
- Danger: `#A8302A` (אדום יין, לא אדום אזעקה)

### Typography — Ploni
- Headings: **Ploni Bold** / Narkiss Tam Bold כ-fallback
- Body: **Ploni Regular**
- Numbers/Data: tabular-nums תמיד (כדי שמספרים יישרו)
- בסיס: 16px. Scale: 12 / 14 / 16 / 20 / 24 / 32 / 48
- Line-height עברי: 1.5 לbody, 1.15 ל-display

> כלל ברזל: **לעולם לא Inter, לעולם לא Heebo, לעולם לא Assistant.**
> ברגע ש-Ploni לא זמין (ל-MVP בדפדפן), ניפול ל-Frank Ruhl Libre + Karantina כ-fallback מ-Google Fonts. לא ל-Heebo.

### Spacing — בסיס 4px
- 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64
- Cards: padding 20px (לא 16, לא 24 — 20 = חתימה שקטה)
- Screen padding: 20px בצדדים

### Radius
- Small (chip, badge): 8px
- Medium (card): 14px
- Large (sheet, modal): 24px
- Pill (CTA): 999px

---

## Content Strategy

### תמונות
- **Aspect ratio קבוע: 16:9** (לא 4:3, לא square)
- **Filter אחיד**: saturation -8%, contrast +5%, warm shadow +3%
- CSS implementation: `filter: contrast(1.05) saturate(0.92) brightness(0.98)`
- כל תמונה — מ-Unsplash או מצולמת. **לעולם לא emoji כתחליף לתמונה.**

### Copy Voice — Wolt-style
- ברירת מחדל: ישיר, פונקציונלי, מדויק. **"המשחק שלך מתחיל ב-19:00."**
- רגעי חמימות (מסכי טעינה, error, push): **"המשחק שלך מחר ב-19:00. נשארה ביצה אחת בפנים — תדאג להגיע ב-18:50."**
- **לעולם לא**: "🎾 יאללה תזוז!", "אחי נסגור עליך", "תתחיל לאמן את הזרוע!"
- **כן**: "המשחק מלא — נכנסת לרשימת המתנה.", "בוטל. הכסף חוזר תוך 3 ימי עסקים."

### Real Data
- מועדונים: לMVP — שמות פיקטיביים שנשמעים אמיתיים (Padel House Tel Aviv, Court 27, The Padel Club)
- אם יש גישה למועדונים אמיתיים: Padel Up, Padel One, Reset Padel
- שמות שחקנים: שמות ישראליים אמיתיים, לא "John Doe" ולא "אבישי הדמו"
- כל ערך מספרי — מציאותי. רמה 3.2 ולא 3.0 בדיוק.

---

## Signature Moment — Slide-to-Join

הצטרפות למשחק תמיד דרך **slide-to-confirm** ימינה-לשמאל (RTL).
- רוחב: 100% של card
- גובה: 56px
- רקע: ירוק רולקס #1A4D2E עם 8% opacity
- Thumb: עיגול לבן 48x48 עם חץ, נע ימינה-לשמאל
- בסוף ה-slide: רעידה (`navigator.vibrate(20)`) + תיוג ✓ + animation של checkmark
- Spring physics: stiffness 350, damping 28

זה ה-action היחיד באפליקציה עם slide. כל השאר — כפתורים רגילים.

---

## Motion Language

- Spring physics בכל מקום משמעותי (stiffness 300, damping 30)
- ברירת מחדל: **iOS native feel** — קל overshoot מותר
- Page transitions: slide מימין לשמאל (RTL navigation), 280ms
- Card press: scale 0.985 + opacity 0.92, 120ms
- ✨ אסור: bounce מוגזם, parallax חזק, אפקטים שמרגישים "loading"

---

## Iconography

- **Custom set של 8-12 אייקונים מרכזיים**:
  1. מגרש פאדל (top-down view, פשוט, stroke 1.5px)
  2. שחקן (icon אדם פשוט שלנו, לא Lucide)
  3. ביצה (padel ball, פשוט)
  4. רכט (paddle)
  5. מטבע אנימוני (₪)
  6. בית/Home (משלנו)
  7. חיפוש (משלנו)
  8. פרופיל (משלנו)
- **Supporting**: Lucide React, stroke 1.5px, 20-24px

---

## Density — Playtomic-style

- Home Hero למעלה (40% מהמסך): "המשחק הבא שלך"
- מתחת: feed של משחקים פתוחים (תמונה + נתונים, dense)
- Bottom tabs קבועים (4 tabs)
- אסור: מסכים ריקים עם אילוסטרציה גדולה ו-CTA יחיד באמצע — זה הסימן הכי גדול לאפליקציה לא בשלה

---

## Level System — A1 / A2 / B1 / B2 / C1 / C2 (סופי)

שיטה ספרדית/אירופית סטנדרטית. **A1 הוא הגבוה ביותר, C2 הוא הנמוך ביותר.**

| רמה | שם | תיאור קצר |
|---|---|---|
| **A1** | מקצוען | טופ 10 בארץ. מתאמן באופן קבוע עם מאמן. |
| **A2** | מתקדם מאוד | שולט ברמה גבוהה בכל החבטות. משתתף בתחרויות. |
| **B1** | מתקדם | טכניקה גבוהה, יציבות, הבנה טקטית. רקע ענפי מחבט. |
| **B2** | בינוני-גבוה | טכניקה טובה, כולל וולי/חבטות מהקיר/לובים. |
| **C1** | בינוני | מתחיל לשלוט, שומר ראלי, מבין עקרונות. |
| **C2** | מתחיל | בונה טכניקה בסיסית. |

### כללי תצוגה
- בכל כרטיס משחק / פרופיל / טופס — **תווי הרמה תמיד במשפחת הפונט Display (Karantina) עם letter-spacing 0.04em**.
- ב-pill: רקע `--brand-soft` (#E8F0EA), טקסט `--brand` (#1A4D2E).
- טווח רמות (למשל "B2 – B1"): רכיב `.level-range` עם אותו עיצוב.
- **לעולם לא**: emoji 🟢🟡🟠 ליד הרמות. לעולם לא צבעי תקיעה לכל רמה. לעולם לא "מתחיל/בינוני/מתקדם" כתחליף לאותיות.

### חישוב מהשאלון (12 שאלות × 4pt = 48 max)
- 44–48 → A1
- 38–43 → A2
- 31–37 → B1
- 23–30 → B2
- 15–22 → C1
- 0–14  → C2

---

## Credibility Score (מהפרומפט המקורי)

- 0–100, נשאר. אבל **לא מוצג כ-progress bar צבעוני**.
- מוצג כ-typography קטנה: "אמינות 67"
- ליד תיוג סטטוס discrete: חדש / מתפתח / אמין / מהימן / מובהר
- ללא ✓✗ עם emoji. ללא בריקות צבע.

---

## Marketplace — שוק המגרשים (פעיל, לא דחוי ל-V2)

טאב 5: בית · חיפוש · [פרסום FAB] · **שוק** · פרופיל.

### עקרונות נעילת מחיר
- **המחיר לקונה תמיד זהה למחיר ששילם המוכר.** אין markup, אין דמי-טיפול לקונה.
- "אותו מחיר, בלי תוספת" הוא ה-hook המרכזי — מופיע ליד כל מחיר (קלאס `.price-same .note`).
- בטופס המכירה: שדה מחיר נעול (לקריאה בלבד) — `.price-locked` עם אייקון מנעול.

### תצוגת מוכר ואמון
- כל כרטיס שוק כולל `.market-seller` — אבטר אמיתי + שם פרטי + 1 אות שם משפחה + ציון אמינות (`מוכר: דניאל ב. · אמינות 78`).
- בלוק אמון (`.trust-block`) ירוק רך עם אייקון מגן: "הקונה משלם ישירות. החזר מלא ברגע שנמכר. Rally דואגת להעברה בטוחה."

### דחיפות בכרטיסי שוק
- Variant `b-tag last` עם `dotpulse`: "מתפנה היום · 20:00".
- Variant `b-tag hot` (terracotta): "עוד 3 שעות".

### סוג מכירה
- `.type-tag` אפור רך: "מקום אחד" | "מגרש שלם · 4 מקומות".

## Anti-Patterns (לא לעשות)

1. ❌ Emoji ב-headings ("🎾 משחקים פתוחים")
2. ❌ Gradient backgrounds רב-צבעוניים
3. ❌ "Glassmorphism" / blur רקעים — נראה 2021
4. ❌ Cards עם shadow מוגזם
5. ❌ Rainbow level indicators
6. ❌ Hebrew + English מעורבב באותו string ("המשחק starts ב-19:00")
7. ❌ Loading spinners — רק skeleton screens
8. ❌ "Pro Player" / "Beginner" — באנגלית. הכל בעברית.
9. ❌ Confetti אחרי הצטרפות למשחק
10. ❌ Dark mode toggle ב-MVP

---

## Reference Apps (סדר עדיפות)

1. **Playtomic** — density, hierarchy, club presentation
2. **Wolt** — copy tone, push notifications
3. **Linear** — Cmd-K style focus, motion sharpness
4. **Bit** — slide-to-confirm interaction
5. **Strava** — credibility/stats presentation
