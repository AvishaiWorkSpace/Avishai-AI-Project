Build "Rally" — a real-time padel matchmaking app for Israeli players (Hebrew, RTL layout). Think "Uber meets Playtomic": spontaneous, premium, exclusive-club feel.

CORE IDEA: "I have time now — find me a game" / "I have a court — find me players."

DESIGN:
- Colors: Deep forest green #1B3A2D (primary), warm gold #C4A265 (accent), cream #F8F7F4 (background), white cards
- Fonts: serif headings (Frank Ruhl Libre, bold), sans-serif body (Heebo)
- Rounded cards (16-24px radius), soft multi-layer shadows, generous whitespace
- Bottom tab bar with center floating + button. Premium, calm, NOT a generic sports app.

SCREENS:
1. Welcome (logo + tagline "רשת הפאדל של ישראל")
2. Login — 3 methods: phone OTP, Apple, Google
3. OTP verification (4-digit code)
4. Profile setup (avatar + name)
5. Zones — pick cities + travel radius (15/30/45/60 min)
6. Registration quiz (12 questions about playing style, level, frequency, goals) with progress bar
7. Home — greeting with level badge + reliability, "find game now" banner, next-match hero card with slide-to-join, friends playing, list of open matches with filter chips
8. Find — search + calendar strip + filters + match list
9. Market — sell/buy open court slots, with locked price + seller reliability
10. Sell Court — pick court, time, type, price
11. Chat — match group chat, equipment checklist, realtime messages
12. Rate — 5 stars + attribute chips (sportsmanship, on-time, good energy...)
13. Profile — stats (games/wins/win%), reliability bar, match history
14. QuickMatch — radar animation searching for 4 players
15. Players directory + Leaderboard (national ELO ranking)
16. Admin panel (stats, reports, user management)

KEY INTERACTION: "Slide-to-Join" — drag a pill button right-to-left to join a match (with haptic + checkmark, then opens chat). This is the signature gesture.

BACKEND (Supabase, already set up):
URL: https://ygqhgxynuturqwiqzawf.supabase.co
Tables: users, clubs, matches, match_players, ratings, messages, market_listings, notifications, friendships, reports
Auth: phone OTP + Apple + Google
ELO rating system → maps to levels A1 (top) to C2 (beginner)
Reliability score 0-100% per player

RULES:
- Hebrew-first, RTL everywhere
- No emoji in UI, no loading spinners (use skeletons)
- Level badges always green pills (never rainbow)
- Israeli mock names (דניאל, יואב, אלון)
- Prices in ₪
- Real padel court photos for clubs
