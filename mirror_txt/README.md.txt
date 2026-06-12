# Rally 🎾

קהילת הפאדל הישראלית — אפליקציית matchmaking לשחקנים ומועדונים.

## הרצה מקומית

```bash
npm install      # התקנת חבילות (פעם אחת)
npm run dev      # הרצת שרת הפיתוח
```

האפליקציה תיפתח בכתובת http://localhost:5173

> האפליקציה רצה כרגע עם **נתוני דמה** (`src/data/mockData.js`) דרך
> mock של ה-SDK (`src/api/base44Client.js`), כך שאין צורך ב-backend
> כדי לראות ולפתח את הממשק.

## מבנה

```
src/
  pages/        מסכים (Home, Find אמיתיים; השאר stubs זמניים)
  components/   רכיבים משותפים (MatchCard, LevelTag, AppLayout, SlideToJoin)
  lib/          עזרי תשתית (auth, query-client, format, utils)
  api/          מוק של base44 SDK
  data/         נתוני דמה ישראליים
  index.css     מערכת העיצוב (design tokens, גופנים, RTL)
```

## מצב נוכחי

- ✅ `Home` — דף הבית
- ✅ `Find` — פיד משחקים פתוח + פילטרים + מילוי מהיר (fill-the-spot)
- 🚧 שאר המסכים — stubs, ייבנו בהמשך
