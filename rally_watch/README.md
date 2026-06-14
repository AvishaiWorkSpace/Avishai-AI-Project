<div dir="rtl" markdown="1">

# Rally Score — אפליקציית Apple Watch לספירת נקודות

ספירת נקודות פאדל ישירות מהשעון, עם אפליקציית iphone נלווית שמסונכרנת חי — והתוצאה נשמרת לאותו ה-data center של Rally (Base44).

> **חשוב:** הפרויקט הזה נייטיב (Swift/SwiftUI) ולכן **נבנה ונבדק רק על Mac עם Xcode** — אי אפשר לקמפל אותו על Windows. הקוד כתוב במלואו ומוכן; מה שצריך לעשות על המק מפורט למטה. מנוע הניקוד עצמו (`PadelScoreKit`) הוא חבילת Swift טהורה שנבדקת בכל טולצ'יין עם `swift test`.

---

## מה יש כאן

```
rally_watch/
├── Package.swift                  חבילת SwiftPM למנוע הניקוד (נבדק עם swift test)
├── Sources/PadelScoreKit/         מנוע הניקוד — לוגיקה טהורה, ללא UI
│   ├── Models.swift               Team, MatchConfig, MatchState, CompletedSet
│   └── ScoreEngine.swift          כל כללי הפאדל (פונקציות טהורות)
├── Tests/PadelScoreKitTests/      חבילת בדיקות (XCTest) שנועלת את הכללים
├── App/
│   ├── Shared/                    משותף ל-iOS ול-watchOS
│   │   ├── MatchViewModel.swift   ה-state, undo, סנכרון, שליחה ל-Rally
│   │   ├── Connectivity.swift     WatchConnectivity (טלפון ↔ שעון)
│   │   ├── RallyAPI.swift         כתיבת התוצאה ל-Base44 (REST)
│   │   └── Theme.swift            צבעי המותג (אמרלד/זהב)
│   ├── watchOS/                   אפליקציית השעון
│   │   ├── RallyScoreWatchApp.swift
│   │   ├── WatchScoreboardView.swift   שני אזורי-נגיעה גדולים + הפטיקה
│   │   └── WatchSetupView.swift
│   └── iOS/                       אפליקציית הטלפון הנלווית
│       ├── RallyScoreApp.swift
│       ├── MatchSetupView.swift   הגדרת משחק מלאה
│       └── ScoreboardView.swift   לוח תוצאות חי
└── .gitignore
```

---

## כללי הניקוד שנתמכים

מנוע אחד (`ScoreEngine`) מכסה את כל הפורמטים הנפוצים בפאדל:

- **נקודות:** 0 / 15 / 30 / 40, עם **נקודת זהב** (40-40 מכריע) או **יתרון** (win-by-two) — נבחר בהגדרות.
- **גיימים:** 6 לסט, חובה הפרש 2 (5-5 → 7-5).
- **טייברייק** ב-6-6 עד 7 (הפרש 2), כולל **רוטציית הגשה נכונה** (הראשון מגיש נקודה אחת, אחר כך כל שתיים מתחלפים).
- **סטים:** סט יחיד או שלושה (best of 3).
- **סופר טייברייק** אופציונלי לסט מכריע (עד 10).
- **Undo** מלא (כל נקודה ניתנת לביטול) — מבוסס על כך שהמנוע הוא פונקציות טהורות.

הכל נעול בבדיקות ב-`Tests/PadelScoreKitTests/ScoreEngineTests.swift`.

---

## איך מריצים את בדיקות המנוע (על מק, או כל מחשב עם Swift)

```bash
cd rally_watch
swift test
```

זה מקמפל את `PadelScoreKit` ומריץ את כל ה-XCTest. שום תלות ב-Xcode/Apple frameworks — לוגיקה בלבד.

---

## איך מרכיבים את האפליקציה ב-Xcode (על מק)

הקבצים כתובים ומסודרים; צריך לחבר אותם לפרויקט Xcode עם שני ה-targets:

1. **פתח Xcode → New Project → iOS → App.** סמן בשם `RallyScore`, שפה Swift, ממשק SwiftUI.
2. בזמן היצירה (או דרך File → New → Target) הוסף **Watch App for iOS App** — כך נוצר זוג targets מקושר (iPhone + Watch).
3. **הוסף את מנוע הניקוד כחבילה מקומית:** File → Add Package Dependencies → Add Local → בחר את התיקייה `rally_watch`. צרף את המוצר `PadelScoreKit` לשני ה-targets (iOS ו-watchOS).
4. **גרור את קבצי הקוד** ל-targets המתאימים:
   - `App/Shared/*` → לשני ה-targets (Target Membership: iOS + Watch).
   - `App/iOS/*` → ל-target של ה-iPhone בלבד.
   - `App/watchOS/*` → ל-target של ה-Watch בלבד.
   - מחק את קבצי ה-`ContentView.swift`/`App` שנוצרו אוטומטית, כדי שלא יתנגשו עם אלה שכאן (יש `@main` בכל target).
5. **Signing:** בחר את ה-Team שלך (Apple Developer) בשני ה-targets. כדי להריץ על שעון פיזי צריך חשבון מפתח ($99/שנה); סימולטור עובד בחינם.
6. **Run:** בחר את סכמת ה-Watch והרץ על Apple Watch (פיזי או סימולטור). אפליקציית ה-iPhone תרוץ במקביל.

> אין צורך ב-capability מיוחד ל-WatchConnectivity — מספיק `import WatchConnectivity`. הזיווג בין הטלפון לשעון מתבצע אוטומטית כשהם paired.

---

## חיבור ל-Rally (Base44)

כשמשחק נגמר, `RallyAPI` שולח את התוצאה לישות `MatchResult` ב-Base44 — אותה ישות שמתועדת ב-[`rally_base44_code/BACKEND.md`](../rally_base44_code/BACKEND.md).

כדי להפעיל: ב-`App/iOS/RallyScoreApp.swift`, החלף את `appId: nil` ב-App ID שלך (אותו אחד מ-`.env` של אפליקציית הווב, `VITE_BASE44_APP_ID`):

```swift
Task { await RallyAPI.shared.configure(appId: "YOUR_BASE44_APP_ID") }
```

אם ה-endpoint/auth של ה-Base44 שלך שונה — מתאימים ב-`App/Shared/RallyAPI.swift` (מסומן ב-TODO). בלי הגדרה האפליקציה פשוט עובדת אופליין והתוצאה נשארת בשעון.

---

## ארכיטקטורת הסנכרון

- כל שינוי שולח את כל ה-`MatchState` (קטן, `Codable`) לצד השני.
- בזמן אמת דרך `sendMessageData`; אם הצד השני לא זמין — `updateApplicationContext` (נמסר בהתעוררות הבאה).
- כל צד מאמץ state נכנס רק אם ה-`seq` שלו גבוה יותר (last-writer-wins) — כך שאפשר לספור גם מהטלפון וגם מהשעון בלי התנגשות.

---

## מה אפשר להוסיף בהמשך (Roadmap)

- **צפייה חיה באתר Rally** — לדחוף את ה-state גם ל-Base44 realtime כדי שחברים יראו את התוצאה מתעדכנת באפליקציית הווב.
- **רוטציית הגשה ברמת השחקן** (מי מ-2 השחקנים בקבוצה מגיש) — היום ההגשה ברמת הקבוצה.
- **דופק חי** מ-HealthKit כשכבת-על על הלוח (מצב אימון).
- **Complication / Smart Stack** — תוצאת המשחק הנוכחי ישירות על שעון הבית.
- **קישור למשחק ב-Rally** — לפתוח ניקוד ישירות ממשחק שנוצר באפליקציה (match_id).

</div>
