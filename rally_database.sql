-- ============================================
-- RALLY — Supabase Database Schema
-- הדבק את כל הקובץ הזה ב-Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. USERS (שחקנים)
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,

  -- פרטים אישיים
  name TEXT NOT NULL,
  phone TEXT UNIQUE,
  email TEXT UNIQUE,
  avatar_url TEXT,

  -- מיקום
  city TEXT,
  preferred_zones TEXT[] DEFAULT '{}',  -- ["תל אביב", "פתח תקווה"]
  max_drive_minutes INT DEFAULT 30,

  -- רמה ודירוג
  level TEXT CHECK (level IN ('A1','A2','B1','B2','C1','C2')) DEFAULT 'C1',
  rating INT DEFAULT 1000,              -- דירוג ELO
  quiz_score INT,                        -- ציון שאלון (0-48)

  -- סטטיסטיקות
  total_matches INT DEFAULT 0,
  wins INT DEFAULT 0,
  losses INT DEFAULT 0,
  win_rate DECIMAL(5,2) DEFAULT 0,
  national_rank INT,

  -- אמינות
  reliability INT DEFAULT 50 CHECK (reliability >= 0 AND reliability <= 100),
  reliability_status TEXT DEFAULT 'חדש' CHECK (reliability_status IN ('חדש','מתפתח','אמין','מהימן','מובהר')),

  -- מצב
  is_premium BOOLEAN DEFAULT FALSE,
  is_admin BOOLEAN DEFAULT FALSE,
  is_blocked BOOLEAN DEFAULT FALSE,
  block_reason TEXT,

  -- תאריכים
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_active_at TIMESTAMPTZ DEFAULT NOW()
);

-- אינדקסים
CREATE INDEX idx_users_city ON users(city);
CREATE INDEX idx_users_level ON users(level);
CREATE INDEX idx_users_rating ON users(rating DESC);
CREATE INDEX idx_users_national_rank ON users(national_rank);

-- ============================================
-- 2. CLUBS (מועדונים)
-- ============================================
CREATE TABLE clubs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  name TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT,

  courts_count INT DEFAULT 1,
  image_url TEXT,

  -- שעות פתיחה
  open_time TIME DEFAULT '07:00',
  close_time TIME DEFAULT '23:00',

  -- מיקום GPS
  lat DECIMAL(10,7),
  lng DECIMAL(10,7),

  -- קשר
  phone TEXT,
  website TEXT,

  -- סטטיסטיקות
  total_matches INT DEFAULT 0,
  monthly_matches INT DEFAULT 0,
  avg_rating DECIMAL(3,2) DEFAULT 0,

  -- מצב
  is_active BOOLEAN DEFAULT TRUE,
  is_partner BOOLEAN DEFAULT FALSE,    -- מועדון שותף (B2B)
  partner_plan TEXT,                    -- 'basic' / 'pro' / 'enterprise'
  monthly_fee DECIMAL(10,2),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_clubs_city ON clubs(city);
CREATE INDEX idx_clubs_active ON clubs(is_active);

-- ============================================
-- 3. USER_FAVORITE_CLUBS (מועדונים מועדפים)
-- ============================================
CREATE TABLE user_favorite_clubs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, club_id)
);

-- ============================================
-- 4. MATCHES (משחקים)
-- ============================================
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  organizer_id UUID NOT NULL REFERENCES users(id),

  -- זמנים
  match_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  duration_minutes INT DEFAULT 90,

  -- רמה
  level_min TEXT CHECK (level_min IN ('A1','A2','B1','B2','C1','C2')),
  level_max TEXT CHECK (level_max IN ('A1','A2','B1','B2','C1','C2')),

  -- שחקנים
  max_players INT DEFAULT 4,
  current_players INT DEFAULT 0,

  -- מחיר
  price_per_player DECIMAL(10,2),
  currency TEXT DEFAULT 'ILS',

  -- תוצאות (אחרי המשחק)
  score_set1 TEXT,                      -- "6-4"
  score_set2 TEXT,                      -- "7-5"
  score_set3 TEXT,                      -- אופציונלי
  winner_team INT,                      -- 1 or 2

  -- מצב
  status TEXT DEFAULT 'open' CHECK (status IN ('open','full','in_progress','completed','cancelled')),
  is_quickmatch BOOLEAN DEFAULT FALSE,

  -- מטא
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_matches_date ON matches(match_date);
CREATE INDEX idx_matches_status ON matches(status);
CREATE INDEX idx_matches_club ON matches(club_id);
CREATE INDEX idx_matches_date_status ON matches(match_date, status);

-- ============================================
-- 5. MATCH_PLAYERS (שחקנים במשחק)
-- ============================================
CREATE TABLE match_players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  team INT CHECK (team IN (1, 2)),       -- צוות 1 או 2
  role TEXT DEFAULT 'player' CHECK (role IN ('organizer','player')),

  -- סטטוס
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed','cancelled','no_show')),
  cancelled_at TIMESTAMPTZ,
  cancel_reason TEXT,

  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(match_id, user_id)
);

CREATE INDEX idx_match_players_match ON match_players(match_id);
CREATE INDEX idx_match_players_user ON match_players(user_id);

-- ============================================
-- 6. RATINGS (דירוגים אחרי משחק)
-- ============================================
CREATE TABLE ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  from_user_id UUID NOT NULL REFERENCES users(id),
  to_user_id UUID NOT NULL REFERENCES users(id),

  stars INT NOT NULL CHECK (stars >= 1 AND stars <= 5),

  -- תכונות שנבחרו
  attributes TEXT[] DEFAULT '{}',        -- ["ספורטיביות", "הגיע בזמן", "אנרגיה טובה"]

  comment TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(match_id, from_user_id, to_user_id)
);

CREATE INDEX idx_ratings_to_user ON ratings(to_user_id);
CREATE INDEX idx_ratings_match ON ratings(match_id);

-- ============================================
-- 7. MESSAGES (צ׳אט קבוצתי)
-- ============================================
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),

  text TEXT NOT NULL,

  -- סוג הודעה
  type TEXT DEFAULT 'text' CHECK (type IN ('text','system','equipment')),

  sent_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_match ON messages(match_id);
CREATE INDEX idx_messages_sent ON messages(sent_at);

-- ============================================
-- 8. MATCH_EQUIPMENT (ציוד למשחק)
-- ============================================
CREATE TABLE match_equipment (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,

  item_name TEXT NOT NULL,               -- "כדורים", "מחבט רזרבי", "מים"
  assigned_to UUID REFERENCES users(id), -- מי מביא
  status TEXT DEFAULT 'needed' CHECK (status IN ('needed','claimed','confirmed')),

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 9. MARKET_LISTINGS (שוק המגרשים)
-- ============================================
CREATE TABLE market_listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES users(id),
  buyer_id UUID REFERENCES users(id),

  -- סוג
  type TEXT NOT NULL CHECK (type IN ('single_seat','full_court')),
  seats_count INT DEFAULT 1,

  -- מחיר (נעול — אותו מחיר ששילם)
  price DECIMAL(10,2) NOT NULL,

  -- מצב
  status TEXT DEFAULT 'active' CHECK (status IN ('active','sold','expired','cancelled')),

  sold_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

CREATE INDEX idx_market_status ON market_listings(status);
CREATE INDEX idx_market_seller ON market_listings(seller_id);

-- ============================================
-- 10. NOTIFICATIONS (התראות)
-- ============================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  title TEXT NOT NULL,
  body TEXT,

  -- סוג
  type TEXT CHECK (type IN ('match_invite','match_full','match_reminder','market_sold','rating_received','system')),

  -- קישור
  related_match_id UUID REFERENCES matches(id),
  related_user_id UUID REFERENCES users(id),

  is_read BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read);

-- ============================================
-- 11. REPORTS (דיווחים)
-- ============================================
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID NOT NULL REFERENCES users(id),
  reported_user_id UUID NOT NULL REFERENCES users(id),
  match_id UUID REFERENCES matches(id),

  reason TEXT NOT NULL CHECK (reason IN ('unsportsmanlike','no_show','late_cancel','harassment','other')),
  description TEXT,

  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','reviewed','resolved','dismissed')),
  admin_notes TEXT,
  resolved_by UUID REFERENCES users(id),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- ============================================
-- 12. FRIENDSHIPS (חברים)
-- ============================================
CREATE TABLE friendships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  friend_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  status TEXT DEFAULT 'active' CHECK (status IN ('active','blocked')),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, friend_id)
);

CREATE INDEX idx_friendships_user ON friendships(user_id);

-- ============================================
-- VIEWS — שאילתות מוכנות
-- ============================================

-- דירוג ארצי
CREATE OR REPLACE VIEW national_leaderboard AS
SELECT
  id, name, avatar_url, city, level, rating,
  wins, losses, total_matches,
  CASE WHEN total_matches > 0 THEN ROUND((wins::decimal / total_matches) * 100, 1) ELSE 0 END AS win_percentage,
  ROW_NUMBER() OVER (ORDER BY rating DESC) AS rank
FROM users
WHERE is_blocked = FALSE AND total_matches >= 3
ORDER BY rating DESC;

-- משחקים פתוחים היום
CREATE OR REPLACE VIEW today_open_matches AS
SELECT
  m.*,
  c.name AS club_name,
  c.city AS club_city,
  c.image_url AS club_image,
  c.lat, c.lng,
  (m.max_players - m.current_players) AS spots_left
FROM matches m
JOIN clubs c ON m.club_id = c.id
WHERE m.match_date = CURRENT_DATE
  AND m.status = 'open'
ORDER BY m.start_time;

-- סטטיסטיקות Admin
CREATE OR REPLACE VIEW admin_stats AS
SELECT
  (SELECT COUNT(*) FROM users WHERE is_blocked = FALSE) AS total_users,
  (SELECT COUNT(*) FROM users WHERE created_at > NOW() - INTERVAL '7 days') AS new_users_week,
  (SELECT COUNT(*) FROM matches WHERE match_date = CURRENT_DATE) AS matches_today,
  (SELECT COUNT(*) FROM clubs WHERE is_active = TRUE) AS active_clubs,
  (SELECT COUNT(*) FROM reports WHERE status = 'pending') AS pending_reports;

-- ============================================
-- RLS — Row Level Security (אבטחה)
-- ============================================

-- הפעלת RLS על כל הטבלאות
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Users: כולם יכולים לראות, רק אתה יכול לערוך את עצמך
CREATE POLICY "Users viewable by everyone" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = auth_id);

-- Clubs: כולם יכולים לראות
CREATE POLICY "Clubs viewable by everyone" ON clubs FOR SELECT USING (true);

-- Matches: כולם יכולים לראות משחקים פתוחים
CREATE POLICY "Matches viewable by everyone" ON matches FOR SELECT USING (true);
CREATE POLICY "Users can create matches" ON matches FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Match Players: כולם יכולים לראות, רק מחוברים יכולים להצטרף
CREATE POLICY "Match players viewable" ON match_players FOR SELECT USING (true);
CREATE POLICY "Users can join matches" ON match_players FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Messages: רק שחקנים במשחק יכולים לראות
CREATE POLICY "Messages visible to match players" ON messages FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM match_players mp
    WHERE mp.match_id = messages.match_id
    AND mp.user_id = (SELECT id FROM users WHERE auth_id = auth.uid())
  ));

-- Notifications: רק שלך
CREATE POLICY "Own notifications only" ON notifications FOR SELECT
  USING (user_id = (SELECT id FROM users WHERE auth_id = auth.uid()));

-- Market: כולם רואים active listings
CREATE POLICY "Active listings viewable" ON market_listings FOR SELECT USING (true);

-- ============================================
-- FUNCTIONS — פונקציות חישוב
-- ============================================

-- עדכון דירוג ELO אחרי משחק
CREATE OR REPLACE FUNCTION update_player_rating(
  p_winner_id UUID,
  p_loser_id UUID,
  k_factor INT DEFAULT 32
) RETURNS VOID AS $$
DECLARE
  winner_rating INT;
  loser_rating INT;
  expected_winner DECIMAL;
  expected_loser DECIMAL;
  new_winner_rating INT;
  new_loser_rating INT;
BEGIN
  SELECT rating INTO winner_rating FROM users WHERE id = p_winner_id;
  SELECT rating INTO loser_rating FROM users WHERE id = p_loser_id;

  expected_winner := 1.0 / (1.0 + POWER(10, (loser_rating - winner_rating)::decimal / 400));
  expected_loser := 1.0 - expected_winner;

  new_winner_rating := winner_rating + ROUND(k_factor * (1 - expected_winner));
  new_loser_rating := loser_rating + ROUND(k_factor * (0 - expected_loser));

  UPDATE users SET
    rating = new_winner_rating,
    wins = wins + 1,
    total_matches = total_matches + 1,
    win_rate = ROUND((wins + 1)::decimal / (total_matches + 1) * 100, 1),
    updated_at = NOW()
  WHERE id = p_winner_id;

  UPDATE users SET
    rating = GREATEST(new_loser_rating, 100),
    losses = losses + 1,
    total_matches = total_matches + 1,
    win_rate = ROUND(wins::decimal / (total_matches + 1) * 100, 1),
    updated_at = NOW()
  WHERE id = p_loser_id;
END;
$$ LANGUAGE plpgsql;

-- עדכון דירוג ארצי
CREATE OR REPLACE FUNCTION refresh_national_ranks()
RETURNS VOID AS $$
BEGIN
  WITH ranked AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY rating DESC) AS new_rank
    FROM users WHERE is_blocked = FALSE AND total_matches >= 3
  )
  UPDATE users SET national_rank = ranked.new_rank
  FROM ranked WHERE users.id = ranked.id;
END;
$$ LANGUAGE plpgsql;

-- עדכון אמינות
CREATE OR REPLACE FUNCTION update_reliability(p_user_id UUID, change INT)
RETURNS VOID AS $$
DECLARE
  new_score INT;
BEGIN
  UPDATE users SET
    reliability = GREATEST(0, LEAST(100, reliability + change)),
    reliability_status = CASE
      WHEN GREATEST(0, LEAST(100, reliability + change)) >= 90 THEN 'מובהר'
      WHEN GREATEST(0, LEAST(100, reliability + change)) >= 75 THEN 'מהימן'
      WHEN GREATEST(0, LEAST(100, reliability + change)) >= 55 THEN 'אמין'
      WHEN GREATEST(0, LEAST(100, reliability + change)) >= 30 THEN 'מתפתח'
      ELSE 'חדש'
    END,
    updated_at = NOW()
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- SAMPLE DATA — נתוני דוגמה
-- ============================================

-- מועדונים
INSERT INTO clubs (name, city, courts_count, image_url, lat, lng, is_active, is_partner) VALUES
('Madison Padel', 'תל אביב', 4, 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800', 32.0853, 34.7818, true, true),
('The Padel Club', 'הרצליה', 6, 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800', 32.1629, 34.7910, true, true),
('PadelPro', 'רמת גן', 3, 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800', 32.0680, 34.8243, true, false),
('Club Padel', 'פתח תקווה', 4, 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800', 32.0841, 34.8878, true, false),
('Court 27', 'תל אביב', 2, 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800', 32.0741, 34.7747, true, false),
('Padel House', 'ראשון לציון', 4, 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800', 31.9642, 34.8048, true, false);

-- ============================================
-- DONE! 🎉
-- ============================================
-- הטבלאות מוכנות. עכשיו:
-- 1. לך ל-Supabase Dashboard → Authentication → Providers
-- 2. הפעל: Phone (OTP), Apple, Google
-- 3. חבר את ה-API Key לאפליקציה
-- ============================================
