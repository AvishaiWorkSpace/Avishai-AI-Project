# Rally — FlutterFlow Build Guide

## 🎯 Start Here: 3 Simple Steps

```
1. Create FlutterFlow Project (5 min)
   ↓
2. Connect Supabase Database (10 min)
   ↓
3. Build Screens One by One (2-3 hours)
```

---

## Step 1️⃣: Create & Setup FlutterFlow Project

### 1.1 Create Account & New Project

1. Go to **flutterflow.io**
2. Sign up (free account)
3. Click **"+ Create New"** → Select **"Blank Project"**
4. Name: `Rally`
5. Click **Create**

### 1.2 Enable RTL (Right-to-Left for Hebrew)

In **FlutterFlow Editor**:

1. Go to **App Settings** (gear icon, top right)
2. Scroll to **Localization**
3. Enable: **"Localize app"**
4. Add language: **Hebrew (he)**
5. Set as **Default Language**
6. Enable: **"Support RTL Languages"**
7. **Save**

### 1.3 Import Design System (Colors + Fonts)

#### Colors Setup

1. Go to **Design System** → **Colors**
2. Add these colors:

```
Brand Green      #1B3A2D (Deep Forest)
Brand Soft       #EBF2ED (Soft Green)
Gold Accent      #C4A265 (Warm Gold)
Sage             #8FA88B (Secondary Green)
Background       #F8F7F4 (Warm Cream)
Surface          #FFFFFF (White)
Text Primary     #1A1A18 (Almost Black)
Text Secondary   #6B6B66 (Gray)
Success          #2D7A4F (Green)
Warning          #C4872E (Orange)
Danger           #C44B3F (Red)
```

3. Click **Save**

#### Typography Setup

1. Go to **Design System** → **Typography**
2. Create/import these styles:

```
Heading XL
├─ Font: Frank Ruhl Libre (or closest serif)
├─ Size: 32px
├─ Weight: 900 (bold)
└─ Color: Brand Green

Heading L
├─ Font: Frank Ruhl Libre
├─ Size: 28px
├─ Weight: 900
└─ Color: Brand Green

Body
├─ Font: Heebo (or -apple-system)
├─ Size: 16px
├─ Weight: 400
└─ Color: Text Primary

Body Small
├─ Font: Heebo
├─ Size: 14px
├─ Weight: 400
└─ Color: Text Secondary
```

3. Click **Save**

#### Component Library

1. Go to **Components**
2. Create reusable components:

```
Button Primary
├─ Background: Brand Green
├─ Text: White
├─ Padding: 16px 32px
├─ Border Radius: 999px
└─ Shadow: sm

Button Secondary
├─ Background: Brand Soft
├─ Text: Brand Green
├─ Border: 1px Brand Green
├─ Padding: 16px 32px
└─ Border Radius: 999px

Card
├─ Background: White
├─ Border Radius: 16px
├─ Padding: 16px
└─ Shadow: md

Badge (Level)
├─ Background: Brand Soft
├─ Text: Brand Green
├─ Padding: 6px 12px
├─ Border Radius: 10px
└─ Font: Heebo, weight 600
```

---

## Step 2️⃣: Connect Supabase Database

### 2.1 Get Supabase Credentials

1. Go to **supabase.co** → Your project: **Rally Project**
2. Go to **Settings** → **API**
3. Copy:
   - **Project URL**: `https://ygqhgxynuturqwiqzawf.supabase.co`
   - **Anon Key**: (copy the public key)

### 2.2 Add Firebase/Supabase to FlutterFlow

⚠️ **Important**: FlutterFlow doesn't have native Supabase connector yet.  
**Use Firebase instead** (we'll bridge Supabase to Firebase or use HTTP API)

#### Option A: Use Supabase as Backend via HTTP API (Easier)

1. In **FlutterFlow**, go to **API Calls**
2. Click **+ New**
3. Create API calls for each endpoint:

```
GET_MATCHES
├─ Method: GET
├─ URL: https://ygqhgxynuturqwiqzawf.supabase.co/rest/v1/matches
├─ Headers:
│  ├─ apikey: [YOUR_ANON_KEY]
│  ├─ Authorization: Bearer [YOUR_ANON_KEY]
│  └─ Content-Type: application/json
├─ Query params:
│  ├─ status=eq.open
│  ├─ order=id.desc
│  └─ limit=50
└─ Response type: List of objects

GET_PLAYERS
├─ Method: GET
├─ URL: https://ygqhgxynuturqwiqzawf.supabase.co/rest/v1/users
├─ Headers: [same as above]
└─ Response type: List of objects

POST_RATING
├─ Method: POST
├─ URL: https://ygqhgxynuturqwiqzawf.supabase.co/rest/v1/ratings
├─ Headers: [same + Authorization]
├─ Body: { match_id, rater_id, ratee_id, score, attributes }
└─ Response type: object
```

#### Option B: Use Firebase + Supabase via Edge Functions (Advanced)

Create Firebase Cloud Function that proxies Supabase:

```javascript
// functions/index.js
const functions = require("firebase-functions");
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  "https://ygqhgxynuturqwiqzawf.supabase.co",
  "YOUR_SERVICE_KEY"  // Use service key, not anon key
);

exports.getMatches = functions.https.onCall(async (data, context) => {
  const { data: matches } = await supabase
    .from("matches")
    .select("*")
    .eq("status", "open");
  return matches;
});

exports.postRating = functions.https.onCall(async (data, context) => {
  const { data: rating } = await supabase
    .from("ratings")
    .insert([data]);
  return rating;
});
```

**For now, use Option A (HTTP API)** — simpler.

### 2.3 Test API Connection

1. In FlutterFlow, go to **API Calls** → Your API call
2. Click **Test** button
3. Should return data from Supabase
4. If error: check headers + URL + API key

---

## Step 3️⃣: Build Screens

### Screen Order (Recommended)

```
1. Welcome (5 min)
2. Login (15 min)
3. OTP (10 min)
4. Profile Setup (10 min)
5. Zones (10 min)
6. Quiz (20 min)
7. Home (30 min)
8. Chat (20 min)
9. Rate (15 min)
10. Market (25 min)
... and so on
```

---

## Building Each Screen — Template

### Example: HOME SCREEN

#### 1. Create Page

1. Click **Pages** (left sidebar)
2. Click **+ Add**
3. Name: `Home`
4. Click **Create**

#### 2. Build Layout

```
Container (Full screen)
├─ Background: Background color
├─ Padding: 16
│
└─ Column (vertical stack)
   ├─ Row (Top Bar)
   │  ├─ Text: "Rally" (Heading XL)
   │  └─ IconButton: Bell (notifications)
   │
   ├─ SizedBox (height: 20)
   │
   ├─ Row (Greeting)
   │  ├─ CircleAvatar (avatar_url from users)
   │  ├─ Column
   │  │  ├─ Text: "Hi, [user.name]"
   │  │  └─ Row
   │  │     ├─ Badge: [user.level]
   │  │     ├─ Text: [user.city]
   │  │     └─ Text: [user.reliability]%
   │
   ├─ SizedBox (height: 20)
   │
   ├─ GestureDetector (QuickMatch banner)
   │  └─ Container
   │     ├─ Background: Brand Green
   │     ├─ Child: Row
   │     │  ├─ Icon: Lightning
   │     │  └─ Text: "Find game now"
   │     └─ onTap: Navigate to QUICKMATCH
   │
   ├─ SizedBox (height: 20)
   │
   ├─ Card (Next Match)
   │  ├─ Image: [match.club_image]
   │  ├─ Gradient overlay
   │  ├─ Column
   │  │  ├─ Text: [match.club_name]
   │  │  ├─ Text: [match.time]
   │  │  ├─ Row (player avatars)
   │  │  │  ├─ Avatar 1, 2, 3
   │  │  │  └─ Avatar +1
   │  │  │
   │  │  └─ GestureDetector (Slide-to-Join)
   │  │     └─ Slider widget
   │  │        ├─ Min: 0, Max: 100
   │  │        ├─ Thumb: Green circle (52px)
   │  │        ├─ Track: Brand Soft
   │  │        └─ onChanged: 
   │  │           if (value > 65) {
   │  │             playHaptic();
   │  │             postMatchPlayer();
   │  │             navigateToChat();
   │  │           }
   │
   ├─ SizedBox (height: 20)
   │
   ├─ Text: "Friends Playing" (Heading M)
   │
   ├─ ListView (horizontal scroll)
   │  └─ FriendCard × N
   │     ├─ Avatar
   │     ├─ Name
   │     └─ "Playing at Club X"
   │
   ├─ SizedBox (height: 20)
   │
   ├─ Row (Filters)
   │  ├─ FilterChip: All
   │  ├─ FilterChip: Now
   │  ├─ FilterChip: Today
   │  ├─ FilterChip: Tomorrow
   │  └─ FilterChip: B / A
   │
   ├─ Text: "14 games · Today · 30 min away" (Body Small, Text Secondary)
   │
   └─ ListView (matches)
      └─ MatchCard × N
         ├─ Club image (small)
         ├─ Column
         │  ├─ Text: [club_name]
         │  ├─ Text: [time]
         │  ├─ Row: Players avatars
         │  └─ Text: [level] • [distance]km
         └─ onTap: Navigate to CLUB
```

#### 3. Bind Data

1. Click `ListView (matches)`
2. Go to **Properties** → **Data Source**
3. Select **API Call** or **Database Collection**
4. Choose: `GET_MATCHES` API
5. Under **Item Builder**:
   - Map each field to display
   - For image: `matchCard.club.image_url`
   - For name: `matchCard.club.name`

#### 4. Add Interactivity

**Slide-to-Join Logic:**

```
Slider widget:
├─ onChanged: (value) {
│  if (value > 65) {
│    // Trigger haptic feedback
│    hapticFeedback.vibrate(duration: 20ms);
│    
│    // Call POST /match_players
│    supabase.from('match_players').insert({
│      match_id: currentMatch.id,
│      player_id: currentUser.id,
│      joined_at: DateTime.now(),
│      status: 'joined'
│    });
│    
│    // Show checkmark animation
│    animateCheckmark();
│    
│    // Navigate to CHAT
│    Future.delayed(Duration(ms: 500), () {
│      Navigator.pushNamed(context, 'chat',
│        arguments: { matchId: currentMatch.id }
│      );
│    });
│  }
│}
```

**Filter Chips Logic:**

```
FilterChip: All
├─ onSelected: (selected) {
│  if (selected) {
│    // Query all matches
│    getMatches({ filter: 'all' });
│  }
│}

FilterChip: Now
├─ onSelected: (selected) {
│  if (selected) {
│    // Query matches in next 1 hour
│    getMatches({ 
│      filter: 'now',
│      startTime: DateTime.now(),
│      endTime: DateTime.now().add(Duration(hours: 1))
│    });
│  }
│}
```

---

## Common FlutterFlow Patterns

### Pattern 1: Call API & Display List

```
1. Create Page
2. Add ListView
3. Set Data Source → API Call
4. In Item Builder → Configure each field
5. Add onTap action → Navigate to detail page
```

### Pattern 2: Post Data (Forms)

```
1. Create form fields (TextInput, DatePicker, etc.)
2. Add validation
3. On submit button:
   ├─ Validate form
   ├─ Call API POST
   ├─ Show loading state
   ├─ On success: Navigate + show toast
   └─ On error: Show error dialog
```

### Pattern 3: Real-Time Updates

```
1. Use Supabase Realtime:
   ├─ In API settings, enable: Realtime subscription
   ├─ Listen to table: matches, messages
   └─ onUpdate: Refresh ListView

2. In FlutterFlow:
   ├─ Set Data Source → Live Query
   ├─ Configure subscription filters
   └─ Auto-rebuild when data changes
```

### Pattern 4: Navigation with Parameters

```
Button onPressed:
├─ Navigator.pushNamed(
│  context, 'chat',
│  arguments: {
│    matchId: match.id,
│    clubName: match.club.name
│  }
│)

In Chat page:
├─ Get arguments:
│  final args = ModalRoute.of(context)!.settings.arguments as Map;
│  final matchId = args['matchId'];
```

---

## Authentication Setup

### Phone OTP (Supabase)

```
1. In Supabase Console:
   ├─ Go to Auth → Providers
   ├─ Enable: Phone
   └─ Set SMS provider (e.g., Twilio)

2. In FlutterFlow:
   ├─ Create page: LOGIN
   ├─ Add TextInput: Phone number
   ├─ Add Button: "Sign in"
   ├─ On click:
   │  └─ supabase.auth.signInWithOtp(
   │     phone: phoneInput.value
   │  )
   │
   ├─ Navigate to OTP page
   │
   ├─ Create page: OTP
   ├─ Add 4 TextInputs (or PinCodeTextField)
   ├─ On complete:
   │  └─ supabase.auth.verifyOTP(
   │     phone: phone,
   │     token: otpCode
   │  )
   │
   └─ On success: Navigate HOME
```

### Apple / Google OAuth

```
1. In FlutterFlow:
   ├─ Add Button: "Sign in with Apple"
   └─ On click:
      └─ supabase.auth.signInWithApple()

2. Similar for Google:
   ├─ Add Button: "Sign in with Google"
   └─ On click:
      └─ supabase.auth.signInWithGoogle()

3. Handle redirect:
   ├─ Deep links → Configured in Firebase
   └─ Auto-navigate HOME on success
```

---

## Testing Checklist

- [ ] All 21 screens created (pages)
- [ ] Home screen API calls data
- [ ] Slide-to-Join interactivity works
- [ ] Chat sends/receives messages (realtime)
- [ ] Ratings post to database
- [ ] Login methods work (phone + social)
- [ ] Navigation flows work (no crashes)
- [ ] RTL layout displays correctly
- [ ] Colors match design system
- [ ] Icons/images load
- [ ] Animations smooth (30 FPS+)

---

## Deployment

### iOS (Apple App Store)

```
1. FlutterFlow → Export → iOS
2. Xcode → Build for Generic iOS Device
3. Archive → Upload to App Store Connect
4. Fill: Name, Description, Screenshots, Pricing
5. Submit for review (1-3 days)
```

### Android (Google Play)

```
1. FlutterFlow → Export → Android
2. Android Studio → Build → Signed APK
3. Upload to Google Play Console
4. Fill: Name, Description, Screenshots, Pricing
5. Submit for review (1-2 hours)
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| API returns 401 (Unauthorized) | Check API key in headers + make sure it's Anon key, not Service key |
| RTL text looks reversed | Enable RTL in App Settings → Localization |
| Images not loading | Check image URL format + CORS permissions in Supabase |
| Realtime updates not working | Enable realtime in Supabase settings + check RLS policies |
| Slide animation jerky | Reduce animation duration, use `requestAnimationFrame` |
| App crashes on large lists | Add pagination + virtualization (infinite scroll) |

---

## Resources

- **FlutterFlow Docs**: flutterflow.io/docs
- **Supabase Docs**: supabase.io/docs
- **Flutter Docs**: flutter.dev/docs
- **Our Database Schema**: `rally_database.sql` (in project folder)
- **Screen Map**: `RALLY_SCREEN_MAP.md` (in project folder)
- **Architecture**: `RALLY_ARCHITECTURE.md` (in project folder)

---

## Next Steps

1. ✅ Create FlutterFlow project + add colors/fonts
2. ✅ Connect Supabase API
3. ✅ Build HOME screen
4. ✅ Build FIND screen
5. ✅ Build LOGIN + OTP flow
6. ✅ Build CHAT screen
7. ✅ Build RATE screen
8. ✅ Build remaining 14 screens
9. ✅ Test all interactions
10. ✅ Deploy to iOS + Android TestFlight/Beta
11. ✅ Gather feedback
12. ✅ Public release

---

Good luck! 🚀 אתה עוד שנייה מ-FlutterFlow. תתחיל עם HOME screen — זה יגיד לך הרבה על איך FlutterFlow עובד.

