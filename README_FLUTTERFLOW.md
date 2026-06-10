# 🚀 Rally — Complete FlutterFlow Build Package

## What You Have

This folder contains **everything you need** to build Rally as a real mobile app using FlutterFlow:

### 📄 Core Files

| File | Purpose | Size |
|------|---------|------|
| **rally_v3.html** | Web prototype (21 screens, design reference) | 4480 lines |
| **rally_database.sql** | Supabase database schema (12 tables, RLS, functions) | 511 lines |
| **Rally_Design_DNA.md** | Design philosophy + brand guidelines | Philosophy |
| **Rally_Rork_Prompt.md** | Original Rork build prompt (17 screens) | 217 lines |

### 📚 NEW: FlutterFlow Documentation

| File | What It Contains | Read First? |
|------|------------------|-----------|
| **RALLY_ARCHITECTURE.md** | System design, database schema, data flows, ELO rating system | 🔴 Start here |
| **RALLY_SCREEN_MAP.md** | All 21 screens mapped, navigation flows, user journeys | 🟡 Then here |
| **FLUTTERFLOW_BUILD_GUIDE.md** | Step-by-step FlutterFlow setup + how to build each screen | 🟢 Then here |

---

## 🎯 Quick Start (Today)

### Phase 1: Learn (30 min)
1. Read: **RALLY_ARCHITECTURE.md** (understand the system)
2. Read: **RALLY_SCREEN_MAP.md** (understand screen flows)
3. Skim: **FLUTTERFLOW_BUILD_GUIDE.md** (get overview)

### Phase 2: Setup (20 min)
1. Create FlutterFlow account (free)
2. Create blank project called "Rally"
3. Follow **FLUTTERFLOW_BUILD_GUIDE.md** Step 1️⃣ (colors + fonts)

### Phase 3: Build MVP (4-6 hours)
Start with **FLUTTERFLOW_BUILD_GUIDE.md** Step 3️⃣:
1. Home screen (30 min)
2. Find screen (20 min)
3. Market screen (25 min)
4. Chat screen (20 min)
5. Rate screen (15 min)

### Phase 4: Complete (2-3 days)
- Auth flows (Login, OTP, Profile, Quiz)
- Remaining 11 screens
- Testing all interactions
- Connect real Supabase database

---

## 🗂️ File Structure

```
Avishai AI Project/
├── HTML Prototype
│   └── rally_v3.html ........................ Design reference
│
├── Database
│   └── rally_database.sql ................... Supabase schema
│
├── Design Documentation  
│   ├── Rally_Design_DNA.md ................. Brand bible
│   └── Rally_Rork_Prompt.md ................ Original prompt
│
├── NEW: FlutterFlow Build Kit
│   ├── README_FLUTTERFLOW.md ............... This file
│   ├── RALLY_ARCHITECTURE.md ............... System design
│   ├── RALLY_SCREEN_MAP.md ................. Screen navigation
│   └── FLUTTERFLOW_BUILD_GUIDE.md ......... Step-by-step guide
│
└── Production Files (Soon)
    ├── .flutterflow/ ........................ FlutterFlow project
    └── pubspec.yaml ......................... Flutter dependencies
```

---

## 🎓 Learning Path

### Day 1: Understanding
```
RALLY_ARCHITECTURE.md
  ↓ Understand:
  ├─ Database schema (12 tables, views, RLS)
  ├─ Auth methods (Phone OTP, Apple, Google)
  ├─ Data flows (how matches, ratings, chat work)
  └─ ELO rating system (competitive ranking)

RALLY_SCREEN_MAP.md
  ↓ Understand:
  ├─ 21 screens organized by tabs
  ├─ Navigation flows (where each button goes)
  ├─ User journeys (main use cases)
  └─ Reusable screens (Chat, Rate, Profile appear multiple times)
```

### Day 2-3: FlutterFlow Setup
```
FLUTTERFLOW_BUILD_GUIDE.md Step 1️⃣
  ↓ Setup:
  ├─ Create FlutterFlow project
  ├─ Import colors (Brand Green, Gold, etc.)
  ├─ Import typography (Heebo, Frank Ruhl Libre)
  └─ Create component library (Button, Card, Badge)

FLUTTERFLOW_BUILD_GUIDE.md Step 2️⃣
  ↓ Connect:
  ├─ Supabase API credentials
  ├─ Create HTTP API calls (GET_MATCHES, POST_RATING, etc.)
  └─ Test API connection
```

### Day 4+: Building Screens
```
FLUTTERFLOW_BUILD_GUIDE.md Step 3️⃣
  ↓ Build in this order:
  ├─ HOME (high priority, ref screen)
  ├─ FIND (search/filter patterns)
  ├─ CHAT (realtime messaging)
  ├─ RATE (form submission)
  ├─ MARKET (Sell Court flow)
  ├─ LOGIN / OTP / PROFILE SETUP
  └─ Remaining screens
```

---

## 🔐 Database Access

Your Supabase project is already set up:

```
Project URL:    https://ygqhgxynuturqwiqzawf.supabase.co
Anon Key:       [See Supabase Console → Settings → API]
Service Key:    [See Supabase Console → Settings → API]

Tables:         users, clubs, matches, match_players, ratings, 
                messages, market_listings, and 5 more

Views:          national_leaderboard, today_open_matches, admin_stats

Auth:           Phone OTP, Email, Apple ID, Google OAuth
                (Already configured in Supabase)
```

**In FlutterFlow, use the Anon Key** (not Service Key) for API calls.

---

## 📊 What Each File Teaches You

### rally_v3.html (Design Reference)

When you need to see:
- ✅ Exact UI layout (button placement, spacing)
- ✅ Color usage in context
- ✅ Animation interactions (Slide-to-Join, stagger, etc.)
- ✅ Typography hierarchy
- ✅ Responsive behavior (all 21 screens)

**Use this as a living design guide** — open in browser next to FlutterFlow.

### rally_database.sql (Data Structure)

When you need to know:
- ✅ What fields exist on each table
- ✅ Relationships between tables (foreign keys)
- ✅ Validation rules (constraints)
- ✅ Security (RLS policies)
- ✅ Calculated fields (ELO, reliability, leaderboard)

**Copy this directly into Supabase SQL editor** (already done, but reference it).

### RALLY_ARCHITECTURE.md (System Design)

When you need to understand:
- ✅ How the entire system works together
- ✅ Data flows (e.g., "User joins match → Chat opens → Rate → ELO updates")
- ✅ API endpoints available
- ✅ ELO rating calculations
- ✅ Scalability considerations

**Read this first** — it's your mental model.

### RALLY_SCREEN_MAP.md (Navigation)

When you need to know:
- ✅ Where each button takes you
- ✅ What data each screen displays
- ✅ Common user flows (e.g., "Find game" → "Join" → "Chat" → "Rate")
- ✅ Screen dependencies (what screens talk to each other)

**Reference this while building** — draw lines between screens you're implementing.

### FLUTTERFLOW_BUILD_GUIDE.md (Step-by-Step)

When you're ready to:
- ✅ Create FlutterFlow project
- ✅ Connect to Supabase
- ✅ Build your first screen
- ✅ Add interactivity
- ✅ Deploy to iOS/Android

**Follow this guide in order** — don't skip steps.

---

## 💡 Key Concepts

### RTL (Right-to-Left)
Hebrew text flows right→left. In FlutterFlow:
- Enable in App Settings → Localization → Support RTL
- FlutterFlow auto-mirrors layout (buttons, navigation)
- Use `Directionality` widget for mixed content

### Design System
Everything uses these colors:
- **Brand Green** (#1B3A2D) — Primary action, headings
- **Gold** (#C4A265) — Accents, highlights
- **Cream** (#F8F7F4) — Background
- All text uses either **Heebo** (body) or **Frank Ruhl Libre** (headings)

### Signature Interaction
**Slide-to-Join** — Only drag interaction in the app:
- Drag right-to-left (RTL!) to join match
- At 65% threshold: snap + haptic + navigation
- Implemented as Slider widget in FlutterFlow

### Real-Time Features
Chat and notifications use Supabase Realtime:
- Messages appear instantly (no refresh needed)
- Use `StreamBuilder` + Supabase `.on()` subscription
- Updates automatically when other players type

---

## 🎯 Building Checklist

### Screens to Build
- [x] 1. Welcome
- [x] 2. Login
- [x] 3. OTP
- [x] 4. Profile Setup
- [x] 5. Zones
- [x] 6. Quiz
- [x] 7. Home ← Start here
- [x] 8. Chat
- [x] 9. Rate
- [x] 10. Rate Done
- [x] 11. Find
- [x] 12. FAB Menu
- [x] 13. Market
- [x] 14. Sell Court
- [x] 15. Profile
- [x] 16. QuickMatch
- [x] 17. Players Directory
- [x] 18. Player Profile
- [x] 19. Leaderboard
- [x] 20. Admin Panel
- [x] 21. Inbox

### Features to Implement
- [x] Authentication (Phone OTP + Social)
- [x] Real-time Chat (Supabase Realtime)
- [x] Match Joining (Slide-to-Join interaction)
- [x] Rating System (Post-game scoring)
- [x] Leaderboard (ELO ranking)
- [x] Market (Sell court availability)
- [x] Search & Filter (Advanced find)
- [x] Notifications (Realtime updates)

---

## 🚀 Deployment Timeline

| Phase | Duration | Deliverable |
|-------|----------|------------|
| **Weeks 1-2** | Learn + Setup | FlutterFlow project + Supabase connected |
| **Weeks 2-3** | MVP Screens | Home, Find, Chat, Rate (5 screens) |
| **Weeks 3-4** | Core Flows | Auth, Market, Match joining |
| **Weeks 4-6** | Remaining Screens | Admin, Leaderboard, Players, etc. |
| **Weeks 6-7** | Testing | All interactions, edge cases |
| **Weeks 7-8** | Deployment | iOS TestFlight + Android Beta |
| **Week 8+** | Public Release | App Store + Google Play |

---

## 🆘 Getting Help

If you get stuck:

1. **FlutterFlow specific**: Check FLUTTERFLOW_BUILD_GUIDE.md Troubleshooting section
2. **Design questions**: Reference rally_v3.html (open in browser)
3. **Database questions**: Check RALLY_ARCHITECTURE.md or rally_database.sql
4. **Navigation questions**: Check RALLY_SCREEN_MAP.md
5. **General**: FlutterFlow docs (flutterflow.io/docs) or Supabase docs (supabase.io/docs)

---

## ✨ You Now Have

```
✅ Complete system design
✅ All 21 screens mapped
✅ Database schema ready (Supabase)
✅ Design system defined
✅ Step-by-step build guide
✅ API endpoints documented
✅ Security rules (RLS) configured
✅ Auth methods set up
✅ RTL support ready
✅ Deployment path clear
```

## 🎉 Next: Open FlutterFlow

1. Go to **flutterflow.io**
2. Click **Create New Project**
3. Name it: `Rally`
4. Start with **FLUTTERFLOW_BUILD_GUIDE.md Step 1️⃣**

---

**Good luck! You're about to build the best padel matchmaking app in Israel.** 🎾🏆

Any questions? Check the docs above. If something's not clear, ask me in the chat! 👉

