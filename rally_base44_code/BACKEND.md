# Rally — חיבור Backend (Base44)

האפליקציה רצה היום על **mock store** עם persistence ל-localStorage — אותו API בדיוק כמו ה-SDK האמיתי.
החיבור ל-Base44 הוא שינוי אחד:

## איך מחברים

1. נכנסים ל-[Base44 dashboard](https://app.base44.com) → האפליקציה שלך → מעתיקים את ה-**App ID**
2. יוצרים קובץ `.env` בשורש הפרויקט:
   ```
   VITE_BASE44_APP_ID=<האפליקיישן איי-די שלך>
   ```
3. מגדירים ב-Base44 את הישויות (Entities) לפי הסכמה למטה
4. `npm run dev` — זהו. `src/api/base44Client.js` עובר אוטומטית למצב חי.

אם ה-init נכשל — האפליקציה נופלת חזרה ל-mock ולא נשברת.

## סכמת הישויות

### Club
| שדה | סוג | הערות |
|---|---|---|
| name | string | |
| city | string | |
| courts_count | number | |
| hours | string | "07:00–23:00" |
| image_url | string | |
| rating | number | |
| indoor | boolean | |

### Player
| שדה | סוג | הערות |
|---|---|---|
| full_name | string | |
| level | string | A1…D2 / מתחיל |
| city | string | |
| avatar_url | string | |
| rally_rating | number | Glicko (~1100–2100) |
| rd | number | Glicko rating deviation |
| vol | number | Glicko volatility |
| verified | boolean | |
| preferred_hand / preferred_side | string | |
| games_played | number | |
| phone | string | |

### Match
| שדה | סוג | הערות |
|---|---|---|
| club_id | string → Club | |
| city, level, status | string | status: open/full/completed |
| start_time | datetime | |
| duration_min, price_per_player, max_players | number | |
| players | relation → Player[] | |
| gender, court_type, match_type | string | |
| host_id | string → Player | |

### CourtListing (שוק המגרשים)
| שדה | סוג | הערות |
|---|---|---|
| type | string | transfer / club |
| club_name, city, court_label | string | |
| start_time | datetime | |
| duration_min, original_price, price | number | |
| seller | relation → Player | null אם מהמועדון |
| urgent | boolean | מפעיל את התראת "מגרש התפנה" |

### MatchResult ⭐ (חדש — לב מנוע הדירוג)
| שדה | סוג | הערות |
|---|---|---|
| match_id | string → Match | |
| sets | json | `[{us, them}]` |
| margin_type | string | close / normal / blowout — בוחר את בנק השאלות |
| won | boolean | |
| rating_before / rating_after | number | Glicko לפני/אחרי |
| diagnosis | string | מה הכריע את המשחק (big_points/nerves/errors/...) |

### PeerRating ⭐ (חדש — דירוג עמיתים)
| שדה | סוג | הערות |
|---|---|---|
| match_id | string → Match | |
| rater_id / ratee_id | string → Player | |
| axis | string | net/smash/wall/tactics/positioning/consistency |
| value | number | 0–100 (מדורג 25/50/75/95) |
| statement | string | המשפט הקונקרטי שנבחר |
| fairplay | string | yes / maybe / no |

## מה עוד נשאר אחרי החיבור

- [ ] Auth אמיתי (Base44 auth / OTP) במקום הדמו ב-Login
- [ ] להעביר את עדכון הדירוג לצד-שרת (Base44 function) — היום הוא מחושב בקליינט
- [ ] אגרגציית PeerRating לרדאר מהשרת (היום: PEER_AXES_HISTORY mock)
- [ ] Push אמיתי להתראת "מגרש התפנה" (web push / OneSignal)
