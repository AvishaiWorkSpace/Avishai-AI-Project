# Rally — Architecture & System Design

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      RALLY ECOSYSTEM                         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────┐
│   FRONTEND      │
│  (Mobile App)   │
│                 │
│  • iOS/Android  │ ← Built with FlutterFlow
│  • WebView      │
│  • RTL Layout   │
└────────┬────────┘
         │
         │ REST API + WebSocket
         │
┌─────────────────────────────────────────┐
│        SUPABASE (Backend-as-a-Service)  │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │   PostgreSQL Database           │   │
│  │  (12 Tables + 3 Views)          │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  Authentication                 │   │
│  │  • Phone (OTP)                  │   │
│  │  • Email (OTP)                  │   │
│  │  • Apple ID                     │   │
│  │  • Google OAuth                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  Realtime Subscriptions         │   │
│  │  (For chat, notifications)      │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  Row-Level Security (RLS)       │   │
│  │  (Data access control)          │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

---

## 📊 Database Schema (12 Tables)

### Core Tables

**users** — Player profiles
```
id, name, avatar_url, level, location, city, radius_km, 
eло_rating, reliability_score, created_at, updated_at
```

**clubs** — Padel court venues
```
id, name, description, address, city, latitude, longitude, 
image_url, owner_id, verified, created_at
```

**matches** — Games/sessions
```
id, club_id, scheduled_time, status, players_needed, 
level_min, level_max, match_type, created_by, created_at
```

**match_players** — Player-Match junction
```
id, match_id, player_id, joined_at, status (joined/left)
```

**ratings** — Post-game ratings
```
id, match_id, rater_id, ratee_id, score, attributes, 
comment, created_at
```

**messages** — Chat between players
```
id, match_id, sender_id, content, created_at
```

**market_listings** — Court availability for sale
```
id, seller_id, club_id, court_time, price, status, created_at
```

### Supporting Tables

- **user_favorite_clubs** — Saved clubs
- **match_equipment** — Equipment checklist (balls, racket, water)
- **notifications** — Push notifications log
- **reports** — Player reports/flags
- **friendships** — Player connections

### Views (Read-Only)

```sql
national_leaderboard  → All players ranked by ELO
today_open_matches    → Today's games with player count
admin_stats           → System overview metrics
```

### Functions (Business Logic)

```sql
update_player_rating()      → ELO calculation after match
refresh_national_ranks()    → Update leaderboard
update_reliability()        → Reliability score calculation
```

---

## 🎯 Data Flow

### Match Creation Flow
```
User clicks "Sell Court" (FAB + Market)
    ↓
Selects court + time + price (locked)
    ↓
API: INSERT into market_listings
    ↓
Notification to nearby players
    ↓
Player joins via Slide-to-Join
    ↓
API: INSERT into match_players
    ↓
Chat opens with match group
```

### Rating Flow
```
Match ends (time-based)
    ↓
"Rate this game?" banner appears
    ↓
User rates 5 stars + attributes (tech, spirit, timing)
    ↓
API: INSERT rating
    ↓
Trigger: update_player_rating() (ELO change)
    ↓
Trigger: refresh_national_ranks()
    ↓
Leaderboard updates
```

### Search/Find Flow
```
User filters: date, level, location, radius
    ↓
API query on today_open_matches VIEW
    ↓
Results sorted by:
  - Distance (radius first)
  - Level match
  - Player count
    ↓
Display with Slide-to-Join CTA
```

---

## 🔐 Security (Row-Level Security)

```sql
-- Users can only see/edit their own profile
CREATE POLICY "User profile access"
  ON users FOR ALL
  USING (auth.uid() = id);

-- Users can only see/rate players from their matches
CREATE POLICY "Rating visibility"
  ON ratings FOR SELECT
  USING (
    auth.uid() IN (
      SELECT player_id FROM match_players 
      WHERE match_id = ratings.match_id
    )
  );

-- Users can only message in their joined matches
CREATE POLICY "Message access"
  ON messages FOR ALL
  USING (
    auth.uid() IN (
      SELECT player_id FROM match_players 
      WHERE match_id = messages.match_id
    )
  );
```

---

## 🎮 ELO Rating System

### Formula
```
New ELO = Old ELO + K × (Result - Expected)

K = 32 (scaling factor)
Result = 1 (win), 0.5 (draw), 0 (loss)
Expected = 1 / (1 + 10^((opponent_elo - your_elo)/400))
```

### Level Assignment (Based on ELO)
```
A1 (Top)    → ELO 2000+
A2          → ELO 1800-1999
B1          → ELO 1600-1799
B2          → ELO 1400-1599
C1          → ELO 1200-1399
C2 (Begin)  → ELO <1200
```

---

## 🌐 API Endpoints (Supabase Auto-Generated)

### Users
```
GET    /rest/v1/users?id=eq.{id}
POST   /rest/v1/users
PATCH  /rest/v1/users?id=eq.{id}
DELETE /rest/v1/users?id=eq.{id}
```

### Matches
```
GET    /rest/v1/matches
       ?status=eq.open&level_min=lte.B2
POST   /rest/v1/match_players
       { match_id, player_id, joined_at }
```

### Ratings
```
POST   /rest/v1/ratings
       { match_id, rater_id, ratee_id, score, attributes }
```

### Realtime (WebSocket)
```
SUBSCRIBE to matches:*
SUBSCRIBE to messages WHERE match_id = {match_id}
SUBSCRIBE to ratings WHERE match_id = {match_id}
```

---

## 📱 Client Configuration (Flutter/FlutterFlow)

```dart
// Supabase Connection
const SUPABASE_URL = "https://ygqhgxynuturqwiqzawf.supabase.co";
const SUPABASE_ANON_KEY = "[key]";

// Auth Methods
SupabaseClient client = SupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Phone Auth
await supabase.auth.signInWithOtp(
  phone: "+972501234567",
  channel: "sms"
);

// Apple Auth
await supabase.auth.signInWithApple();

// Google Auth  
await supabase.auth.signInWithGoogle();
```

---

## 🚀 Deployment Strategy

```
Development
    ↓
Testing (local)
    ↓
Staging (Supabase dev project)
    ↓
Production (Current Supabase project)
    ↓
iOS TestFlight + Google Play Beta
    ↓
Public Release
```

---

## 📈 Scalability Considerations

| Component | Current Limit | Scale Path |
|-----------|---------------|-----------|
| Database | Supabase Free/Pro | → PostgreSQL dedicated |
| Auth | Up to 100k users | → Auth0 / custom backend |
| Storage | Images + avatars | → S3 / Cloudinary |
| Realtime | ~1000 concurrent | → Dedicated socket server |
| API Rate | 10/second | → API Gateway (Kong/Nginx) |

---

## 🔄 User Journey Map

```
UNKNOWN USER
    ↓ [Visit App]
    ↓
WELCOME SCREEN
    ↓ [Continue]
    ↓
LOGIN (3 methods)
    ├─ Phone OTP
    ├─ Email OTP
    └─ Social (Apple/Google)
    ↓
PROFILE SETUP
    ├─ Avatar
    ├─ Name
    └─ Level quiz (12 questions)
    ↓
ZONE SELECTION
    ├─ Cities
    └─ Radius
    ↓
AUTHENTICATED USER
    ↓
HOME SCREEN
    ├─ QuickMatch (AI search)
    ├─ Next match banner
    ├─ Friends playing
    └─ Open games list
    ↓ [Multiple flows]
    ├─ FIND SCREEN → Search + Filter
    ├─ MARKET SCREEN → Sell court availability
    ├─ CLUB SCREEN → Venue details + matches
    ├─ PROFILE SCREEN → Stats + history
    └─ CHAT SCREEN → Match group chat
    ↓
RATING FLOW
    ├─ Rate game (5 stars)
    ├─ Select attributes
    ├─ Submit rating
    └─ ELO updates (background)
    ↓
LEADERBOARD
    └─ National rankings (read-only)
    ↓
ADMIN PANEL
    ├─ System stats
    ├─ Flag management
    └─ User moderation
```

---

## 🛠️ Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| **Frontend** | FlutterFlow (Flutter) |
| **Backend** | Supabase (PostgreSQL) |
| **Authentication** | Supabase Auth (OTP + OAuth) |
| **Realtime** | Supabase Realtime |
| **Hosting** | Supabase Cloud |
| **Storage** | Supabase Storage |
| **CI/CD** | GitHub Actions |
| **Analytics** | Supabase Analytics |
| **Monitoring** | Sentry / LogRocket |

---

## 📚 Key Design Principles

1. **RTL-First** — Everything is right-to-left for Hebrew
2. **Mobile-First** — Designed for phones, responsive
3. **Real-Time** — Live notifications + chat
4. **Trust-Based** — Ratings + reliability scores
5. **Playful** — Spring animations, slide interactions
6. **Premium** — Deep colors, generous spacing, subtle shadows
7. **Accessible** — High contrast, readable fonts
8. **Fast** — Optimistic updates, skeleton loading

