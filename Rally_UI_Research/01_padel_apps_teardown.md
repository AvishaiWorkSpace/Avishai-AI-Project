# Padel & Racket-Sport App UI/UX Teardown — for Rally

**Prepared:** 2026-06-09
**Purpose:** Competitive UI/UX teardown of leading padel / racket-sport matchmaking & booking apps, with concrete, prioritized recommendations for Rally (Israeli, community-first, RTL Hebrew, A1–מתחיל level language, premium/luxury feel).
**Method:** Web research across official sites, App Store / Google Play listings, design case studies (Behance / Erretres), help-center docs, and independent review/roundup articles. Where a specific visual detail could not be verified from a source, it is flagged as *inferred* rather than stated as fact.

> **Sourcing honesty note:** Public web sources describe Playtomic, MATCHi, Padel Mates and Ten'Up flows and features well, but rarely publish pixel-level UI specs (exact hex codes, badge colors). Visual-style claims below are drawn from the official sites, the Erretres design case study, app-store screenshots described in reviews, and design-trend references. Items I could not confirm are marked *(inferred)*.

---

## 0. Apps covered

| App | Origin | Primary identity | Relevance to Rally |
|---|---|---|---|
| **Playtomic** | Spain | Market leader; booking + open matches + level engine + community | **Primary benchmark** — the product standard to match |
| **MATCHi (Padelboard)** | Sweden | Venue/booking platform, club-ops first | Counter-example: utility-first, not community-first |
| **Padel Mates** | Sweden | Social/community network + booking | Closest to Rally's community-first thesis |
| **Ten'Up (FFT)** | France | Federation app: license + ranking + booking | Institutional/official-ranking model |
| **Anybuddy** | France | Aggregator + booking + cost-splitting | Aggregation model (fragmentation fix) |
| **Padel Around** | EU | Pure player matchmaking / "find players near me" | Matchmaking-only model |
| **Sportscanner** | UK | Multi-venue **booking aggregator** (London) | Aggregation across providers incl. MATCHi |
| **Cupla / Setpoint / Manzana Padel** | — | *Not significant standalone matchmaking apps* | See note below |

> **On Cupla, Setpoint, Manzana Padel:** Research found no meaningful standalone padel-matchmaking product under these names. "Cupla" is a couples shared-calendar app (cupla.app), unrelated to padel. "Setpoint" and "Manzana Padel" surface only as local club/booking back-ends, not consumer matchmaking apps with documented UX worth teardown. They are excluded from deep analysis; the slots are better filled by **Padel Mates, Anybuddy, Padel Around and Sportscanner**, which are genuinely relevant to Rally's matchmaking + aggregation positioning.

---

## 1. PLAYTOMIC — deep dive (the market leader)

Playtomic positions itself as "the world's leading App for racket sport players and clubs" — ~4M players, 5,500+ clubs, 16,000+ courts, 52+ countries. Taglines: **"Find courts and players near you"** and **"Join the community and book courts online in one app."**

### 1.1 Home / landing screen structure
- Single **"push to play" feed** (per the Erretres design case study): one screen where a user can connect with friends, see their progress, review past matches, read reviews, browse news, and book courts.
- The **Home tab** surfaces a primary **"Find a match"** call-to-action and an upcoming-booking shortcut.
- Feed is content-dense but action-led — booking is described as a "three-step" flow reachable from home.

### 1.2 Match discovery / "open matches" feed
- Users tap **"Find a match"**, then filter by **sport → location → date/time → level**.
- Each **open match** is presented as a **card** showing: level range, date/time, club/location, price per player, and the current players.
- **How players join:** select a matching open game → **pay online** (card or Club Wallet) to claim the slot. Payment is required to join a public match.
- **How a "missing player" is surfaced:** the match shows occupied vs. empty player positions; **empty slots are the joinable seats**. A private booking with missing players can be **"Convert to Public Match"** (explicit CTA on the booking-details screen), after which it appears in the **Matches marketplace** for the community to fill.
- **Out-of-range requests:** if your level is slightly outside the match's allowed range you can **"Request a Spot"**; **all existing players must accept** before you're added.
- **Player browsing format:** when evaluating who's in a match, profiles are shown in **an Instagram-Stories-like format** (per Erretres) — a very recognizable, swipeable card paradigm.
- **Golden Matches:** premium-only highlighted matches that get extra visibility in the feed.

### 1.3 Booking flow (reserve a court)
1. Select sport + location/club (map + list, geolocated).
2. Pick date/time (and indoor/outdoor, price range filters).
3. Choose court / slot.
4. Confirm + pay (own the fee or split with players).
5. Manage in **"My Bookings"**; edit/cancel "with a couple of taps."
- Marketed as bookable "in 30 seconds" / "three steps." Friction-reduction is the explicit design goal.

### 1.4 Player level / rating display
- **Playtomic Level:** algorithmic rating **0.0–7.0** in **0.25 increments** (often summarized as a 0–7 scale).
- Onboarding **questionnaire** sets a starting level; it then evolves from **match results + opponent levels** (competitive matches only).
- **Reliability %**: confidence in your level; rises with matches played; ~85% = "validated"/stable. Low reliability = bigger swings.
- **Named tiers** (approx.): <1 Initiation · 1.0–1.49 Beginner · 1.5–2.4 Initiation-Intermediate · 2.5–3.4 Intermediate · 3.5–4.4 Intermediate-High · 4.5–5.4 Intermediate-Advanced · 5.5+ Competition.
- Level is shown as a **number** on profiles and match cards; reviews describe it as the central matchmaking filter. (Exact in-app badge colors not documented publicly — *inferred* to be a numeric chip rather than a colored medal.)

### 1.5 Social / community features
- **Profiles as a "matching point"**: show **affinity %** with other players, progression stats, and past matches.
- **Follow** players; **chat** with playing partners in-app; track partners' progress.
- A dedicated **Community** section: rankings and challenges.
- Playtomic actively leans into the **social/"meet-cute"** narrative — matches as a way to meet new people, not just book courts (covered by Fast Company). This reframes a booking app as a lifestyle/social product.

### 1.6 Navigation pattern
- Bottom tab bar centered on a few clear destinations. The Erretres case study names three pillars: **Play** (create/join matches, evaluate rivals), **Progress** (stats/progression), **Community** (rankings/challenges) — plus profile/bookings access. Icons are "clearly labeled."

### 1.7 Color palette & visual style
- **Light, bright, modern** aesthetic. Primary brand color is an **"energy blue."** Clean typography with **bold oversized headlines**, professional court/player photography, generous whitespace, organized grid. The vibe is friendly-energetic, not luxury/dark.

### 1.8 Notable micro-interactions
- **Instagram-Stories-style** browsing of player profiles/matches (swipe, full-bleed cards).
- **"Convert to Public Match"** one-tap state change from private booking → community-fillable match.
- **"Request a Spot"** → multi-party accept flow (social gating built into the interaction).
- Split-payment selection inline in the join/booking flow.

### 1.9 Documented weaknesses (Rally's openings)
- Filtering called "awful" (no ranked-vs-friendly toggle; inflexible time selection).
- Onboarding pushes a forced premium trial; "overly complicated."
- Bot-only support; triple-billing / glitchy cancellation complaints.
- Questionnaire-based level start is inaccurate; reliability can be gamed by friend-only play.

---

## 2. MATCHi (Padelboard)

- **Identity:** complete booking system for racket-sport **venues** worldwide (padel, tennis, badminton, squash, table tennis, pickleball).
- **Home:** shows your next upcoming booking for quick access; push notifications surface as in-app banners.
- **Booking:** **five-step booking wizard**; filter by sport, date, time, court type; invite friends; split payments.
- **Match discovery:** has open-play/match features but is **secondary** to court booking.
- **Level:** uses a level scale (aligned to the 0–7 family) but is far less central than Playtomic's; matchmaking is not the hero.
- **Community:** present but thin — reviewers say it "does not rely only on the social side" and "feels more like a venue platform than a player lifestyle app" → **utility-first**, the explicit opposite of Rally.
- **Visual:** clean, functional, operations-oriented; not a community/lifestyle feel.

## 3. Padel Mates

- **Identity (Sweden):** **community platform** first — "the largest community of players" across padel/pickleball/tennis/badminton/squash. Closest peer to Rally's thesis.
- **Home / discovery:** **dynamic map** of nearby facilities; **game finder** for matches and training; **smart match suggestions** based on skill level + favorite center.
- **Matchmaking:** create a **player profile** (level + preferences); find partners with **advanced filters**; join **clubs and player groups by city/interest**.
- **Level:** launched an **ELO-style rating in 2024** on the **same 0.0–7.0 scale** as Playtomic, updating after each logged match (decimal precision). **Post-match feedback** prompts players to rate the **"game level"** to feed the algorithm — a peer-signal loop very close to Rally's planned mutual rating.
- **Community:** profiles, city/interest groups, integrated messaging, friend-progress tracking.
- **Booking:** in-app booking + payment, coach hire, multiple payment options.
- **Visual / UX:** "nice graphics," "user-friendly," international feel — **but** reviews report **crashes, blank pages, slowness**. Lesson for Rally: community-first wins users, but **tech reliability is the differentiator** (Rally already flagged this as a market pain).

## 4. Ten'Up (FFT, France)

- **Identity:** official **French Tennis Federation** app — tennis/padel/beach tennis, licensed + non-licensed.
- **Home:** **geolocated** content tuned to the user's clubs/needs; a **comprehensive agenda** of upcoming reservations, training, tournaments.
- **Booking:** reserve courts across 7,800+ clubs; register for nearby championships; organize **friendly matches that count toward your ranking**.
- **Level / ranking:** built on the **official FFT ranking** — institutional, authoritative, with **personalized ranking simulations** ("what happens to my ranking if I win"). Different model from ELO: federation-issued.
- **Community:** create/search communities of players nationwide; **digital license** in-app.
- **Weaknesses:** buggy; poor support; player/partner search UI causes frustration.
- **Lesson for Rally:** the **"official standard" authority** angle is powerful — Rally's bid to **own the Israeli A1–מתחיל rating standard** is the equivalent play, minus the federation bureaucracy.

## 5. Anybuddy · Padel Around · Sportscanner (supporting models)

- **Anybuddy (FR/BE):** **aggregator** across 15,000+ courts with integrated **cost-splitting**; book + join matches + track progress in one app. Model = solve **fragmentation**.
- **Padel Around:** **pure matchmaking** — signal availability/location, find nearby players, **filter by level**, organize group matches, partner rating, local events. No heavy booking layer. Model = matchmaking-only, community-led.
- **Sportscanner (UK/London):** **booking aggregator** across 100+ venues and multiple providers (Better, Everyone Active, MATCHi) with **real-time availability**. Model = "one search, many providers" — directly relevant to Rally's cross-club, anti-fragmentation promise.

---

## 6. CROSS-REFERENCE — UI/UX patterns × apps

✅ = strong/core to the app · �weak / partial · ✗ = absent or not a focus

| Pattern | Playtomic | MATCHi | Padel Mates | Ten'Up | Anybuddy | Padel Around | Sportscanner |
|---|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| Single "push-to-play" home feed | ✅ | ◐ | ✅ | ◐ | ◐ | ✅ | ✗ |
| Open-match cards w/ joinable empty slots | ✅ | ◐ | ✅ | ◐ | ✅ | ✅ | ✗ |
| "Convert private booking → public match" | ✅ | ✗ | ◐ | ◐ | ✗ | ✗ | ✗ |
| "Request a spot" (multi-party accept) | ✅ | ✗ | ◐ | ✗ | ✗ | ◐ | ✗ |
| Map-based discovery | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Multi-step booking wizard | ✅ | ✅ | ✅ | ✅ | ✅ | ◐ | ✅ |
| Algorithmic ELO level (0–7) | ✅ | ◐ | ✅ | ✗ | ◐ | ◐ | ✗ |
| Onboarding level questionnaire/quiz | ✅ | ✗ | ✅ | ✗ | ✗ | ◐ | ✗ |
| Reliability / confidence score | ✅ | ✗ | ◐ | ✗ | ✗ | ✗ | ✗ |
| Official/federation ranking | ✗ | ✗ | ✗ | ✅ | ✗ | ✗ | ✗ |
| Post-match peer rating of level/skill | ◐ | ✗ | ✅ | ✗ | ✗ | ✅ | ✗ |
| Player profiles w/ affinity % | ✅ | ✗ | ◐ | ✗ | ✗ | ◐ | ✗ |
| Follow players / social graph | ✅ | ✗ | ✅ | ◐ | ✗ | ◐ | ✗ |
| In-app chat after match | ✅ | ◐ | ✅ | ◐ | ◐ | ◐ | ✗ |
| Instagram-Stories-style profile browse | ✅ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| Split payment inline | ✅ | ✅ | ✅ | ◐ | ✅ | ✗ | ◐ |
| Court / slot resale marketplace | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| Real-time free-court / cancellation alert | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ◐ |
| Cross-club aggregation (anti-fragmentation) | ◐ | ✗ | ◐ | ◐ | ✅ | ◐ | ✅ |
| Premium/"Golden" boosted listings | ✅ | ✗ | ◐ | ✗ | ◐ | ✗ | ✗ |
| Bottom tab bar (3–5 destinations) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Dark / luxury visual identity | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| RTL / Hebrew native | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |

### Key reads from the matrix
- **The "convert to public match," "request a spot," affinity %, and Stories-style profile browse are Playtomic-unique** moats. These are the patterns Rally most needs to match or beat.
- **Two columns are empty for the whole market: court resale marketplace, and a dark/luxury RTL Hebrew identity.** These are exactly Rally's planned differentiators (marketplace + free-court alert) and its brand opening. **No incumbent owns the premium, RTL, Hebrew, community-first quadrant.**
- **Peer post-match rating is the rising pattern** (Padel Mates, Padel Around) and aligns with Rally's 3-layer rating plan — but no one does it as a multi-dimensional, actionable skill radar. That's a differentiator, not just parity.

---

## 7. Recommendations for Rally

### 7.A — ADOPT (proven patterns; match the category standard)

| # | Adopt | Why / source | Rally-specific implementation |
|---|---|---|---|
| 1 | **Open-match cards with visible empty seats** | Playtomic/Padel Mates core; the universal "join" mental model | Card shows 3 filled avatars + 1 glowing empty seat; the empty seat *is* the **Slide-to-Join** target (Rally already has slide-to-join — make the empty seat the affordance). Surface "**חסר שחקן אחד**" / "חסרים 2" prominently. |
| 2 | **"Convert my booking to an open game"** | Playtomic's strongest community-feeder CTA | One-tap from "המשחק שלך": "**פתח את המשחק לקהילה**" → it appears in the feed. This is the act that turns a lost slot into community supply — pairs perfectly with the marketplace. |
| 3 | **"Request a spot" with player approval** | Playtomic; adds social safety to level gating | For players just outside the tier band: "**בקש להצטרף**" → existing players approve. Protects level integrity without a hard wall. |
| 4 | **Onboarding level quiz → starting level + reliability** | Playtomic + Padel Mates standard; Rally already built a 10-Q weighted quiz | Keep it, but **lead with the A1–מתחיל tiers and Hebrew descriptions**, and show the resulting tier as a **celebratory reveal**, not a dry number. |
| 5 | **Post-match peer rating loop** | Padel Mates / Padel Around; feeds the algorithm | Rally's 3-layer model (level via results · skill radar via peer chips · trust stars) is already ahead — ship the **"what stood out" chips** as the signature, blind+mutual. |
| 6 | **Map + radius discovery** | Universal | Rally's 15/30/45-min drive radius is a sharper, more Israeli-relevant framing than raw distance — keep it. |
| 7 | **Affinity / "play-history-with" signal** | Playtomic affinity % | Lightweight "**שיחקתם יחד 4 פעמים**" / compatibility hint on player chips — cheap trust signal that deepens community. |
| 8 | **Bottom tab bar, ≤5 destinations** | Every app converges here | Rally's 5-tab (בית · חיפוש · פרסום FAB · שוק · פרופיל) is correct. The **center FAB for "publish"** is a strong, premium-feeling deviation — keep it. |
| 9 | **Split payment inline (Bit/Israeli)** | Playtomic/MATCHi/Anybuddy | Localize hard: **Bit**, not just card. This is a documented market gap none of the global apps fill in Israel. |
| 10 | **Show next upcoming game on Home** | MATCHi home pattern | A persistent "**המשחק הבא שלך**" hero card reduces taps to the most-wanted action. |

### 7.B — DO DIFFERENTLY (where Rally should diverge to win)

| # | Do differently | Incumbent default | Rally's move |
|---|---|---|---|
| 1 | **Premium / luxury dark identity** | Everyone is light, bright, "energy blue," friendly-generic | Rally already chose a **luxury direction** (Rolex green #1A4D2E in v2; dark #0A0A0A + electric green #B8FF57 in the design-system note). **Pick ONE and commit** — a single, confident dark-or-deep-green palette with a metallic/gold-accent restraint reads as "members' club." Avoid pure #000 (use #121212/#1E1E1E surfaces). This is the most defensible visual moat: **no competitor occupies premium.** |
| 2 | **Community BEFORE booking** | Playtomic/MATCHi open on booking/court discovery | Open on **people & games** ("יש לי זמן עכשיו — מצא לי משחק"), not court inventory. The home hero is the **live matchmaking feed**, booking is downstream. This is the core thesis — the UI must show it in the first screen. |
| 3 | **Israeli A1→מתחיל level language, not 0–7 numbers** | Playtomic 0–7 decimals; Padel Mates ELO decimals | Lead with the **9 culturally-real tiers** (A1 top … מתחיל), each with its Hebrew description. Keep the ELO/0–8 numeric **under the hood** for matchmaking, but the **badge the user sees is the tier**. This *owns the Israeli standard* (the Ten'Up "official authority" lesson) and is friendlier than a 4.25 decimal. Use a **restrained tier badge** (letter+number in a premium chip), not a loud traffic-light color system. |
| 4 | **RTL-native, Hebrew-first** | All incumbents are LTR with bolt-on translations | Design RTL from the grid up: card avatars, slide-to-join direction, calendar strip, back-swipe all mirrored. This is invisible polish that makes Rally feel *built for here*, not localized. |
| 5 | **Own the two empty market columns** | No one has resale or free-court alerts | **Court marketplace (שוק)** + **real-time free-court / cancellation alert** are Rally-only weapons. Give them **first-class tab/notification status** (already done — שוק is a tab). Frame resale as "**אותו מחיר, בלי תוספת**" trust (already in v2) — premium, no-gouging positioning. |
| 6 | **Human service, not bot-only** | Playtomic = "zero support," bot-only | Make a **human/WhatsApp support touchpoint** visible. Cheap to do, directly attacks the #1 incumbent complaint, reinforces premium. |
| 7 | **Skill as an actionable radar, not a scalar** | Everyone shows one number | Rally's **6-dimension peer radar + "what to improve" chips** is genuinely novel. Present it as a **profile centerpiece**, beautifully — this is "premium feedback," a reason to stay. |
| 8 | **Reliability shown as trust, framed positively** | Playtomic reliability % feels punitive/gameable | Reframe as **trust attributes (punctuality, sportsmanship, vibe)** with stars — social, aspirational, not a confidence-interval the user resents. |
| 9 | **Padel-first, not multi-sport** | MATCHi/Ten'Up/Padel Mates spread across sports | Stay padel-only. Depth beats breadth for community feel and visual focus. |
| 10 | **Restraint on density** | Playtomic feed is content-dense | Premium = fewer things, more space. Resist cramming news/reviews/ads into the feed. One hero action, clean cards, lots of negative space (luxury-design 2026 guidance). |

### 7.C — STEAL THESE SPECIFIC MICRO-INTERACTIONS

1. **Stories-style player browse** (Playtomic): when joining a match, let the user swipe through the players already in it as full-bleed cards — turns "who am I playing with?" into a delightful, premium moment. Rally can elevate it with the radar + trust chips on the back of each card.
2. **The empty seat as the hero affordance**: animate the open slot (subtle pulse/glow), and make **Slide-to-Join** land the user's avatar into that exact seat with a satisfying snap + the existing celebration overlay.
3. **One-tap "open to community"** state flip on your own booking — with a small "now 3 players can see this" reassurance.
4. **Ranking-simulation delight** (Ten'Up): after a match, preview "**אם תנצח — תעלה ל-B1**" before the result locks. Motivational, sticky, and uses Rally's tier language.

---

## 8. Visual-direction guidance (premium, RTL, Hebrew)

- **Commit to one palette.** The cleanest premium read for Rally: **deep luxury green** (the Rolex-green #1A4D2E family) as the brand color, on **near-black surfaces** (#121212/#1E1E1E, never pure black), with a **single restrained metallic/bright accent** (the electric green #B8FF57 works as a *sparing* highlight for the live/active state and the Slide-to-Join track — not as a full-surface color). Muted-over-saturated is the 2026 luxury cue.
- **Typography:** the v2 pairing (Frank Ruhl Libre display + Karantina, Ploni fallback) gives an editorial, non-AI feel — good. Keep Hebrew as the type hero; ensure the Latin fallback (Inter/DM Sans) only carries numerals/latin handles.
- **Tier badges:** premium chip with the letter+number (A1, B2 …) — quiet, not color-coded traffic lights. Reserve color for *state* (live, full, open), not for *rank*.
- **Negative space + few elements per screen** is the single biggest lever separating "premium" from "another booking app." Every incumbent is busier than it needs to be — that is Rally's aesthetic opening.

---

## 9. Sources

- Playtomic — official site & help center: https://playtomic.com/ · https://playerhelp.playtomic.com/hc/en-gb/sections/19506606222993-Open-Matches · https://helpmanager.playtomic.com/hc/en-gb/articles/20563641264145-The-Playtomic-Levels-Algorithm · https://playtomic.com/blog/padel-levels
- Playtomic App Store listing & reviews: https://apps.apple.com/us/app/playtomic-padel-pickleball/id1242321076
- Playtomic design case study (Erretres / Behance): https://www.behance.net/gallery/154827807/Playtomic-App-Design
- Playtomic social/"meet-cute" framing (Fast Company): https://www.fastcompany.com/91526714/playtomic-padel-app-dating
- MATCHi: https://www.matchi.se/ · https://apps.apple.com/gb/app/matchi/id720782039 · Playtomic vs MATCHi: https://www.padelpointer.com/learn/playtomic-vs-matchi · https://marlvel.ai/intel-report/sports/padelboard-by-matchi
- Padel Mates: https://padelmates.se/ · https://apps.apple.com/us/app/padel-mates/id1531797995
- Levels compared (Playtomic / MATCHi / Padel Mates / LTA): https://www.playskan.com/blog/padel-levels-explained-uk
- Ten'Up (FFT): https://play.google.com/store/apps/details?id=com.fft.tenup · https://19digital.fr/en/2019/04/29/discover-tenup-the-new-application-launched-by-the-fft/
- Best padel apps roundup (Anybuddy, Padel Around, Padel Mates, Ten'Up, etc.): https://www.padeliq.co/en/blog/best-padel-apps · https://padelspeed.com/blogs/news/padel-apps-reviewed-and-listed
- Sportscanner: https://www.sportscanner.co.uk/
- UK booking-systems comparison: https://www.playskan.com/blog/best-padel-booking-systems-in-the-uk · https://padelsetup.co.uk/best-padel-court-booking-app/
- Premium/dark UI design references (2026): https://www.designrush.com/best-designs/apps/luxury · https://elements.envato.com/learn/color-scheme-trends-in-mobile-app-design · https://gendesigns.ai/blog/mobile-app-color-schemes-2026
