import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Zap, ChevronLeft, Users, Star } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import MatchCard from '@/components/MatchCard';
import SlideToJoin from '@/components/SlideToJoin';
import LevelTag from '@/components/LevelTag';
import RacketHero from '@/components/RacketHero';
import ThemeToggle from '@/components/ThemeToggle';
import { BellIcon } from '@/components/icons';
import RallyLogo from '@/components/RallyLogo';
import FreeCourtAlert from '@/components/FreeCourtAlert';

const QUICK_ACTIONS = [
  { label: 'הזמן מגרש', to: '/book-court', color: 'bg-brand', emoji: '🎾' },
  { label: 'שפר משחק', to: '/leaderboard', color: 'bg-gold', emoji: '⭐' },
  { label: 'תחרות', to: '/tournaments', color: 'bg-brand', emoji: '🏆' },
  { label: 'מצא משחק', to: '/find', color: 'bg-sage', emoji: '🔍' },
];

const COMPAT = {
  A1: ['A1','A2'], A2: ['A1','A2','B1'], B1: ['A2','B1','B2','B2-B1'],
  B2: ['B1','B2','B2-B1','C1'], C1: ['B2','C1','C2'], C2: ['C1','C2'],
};

export default function Home() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('rally_user') || '{}');
  const now = new Date();
  const greeting = now.getHours() < 12 ? 'בוקר טוב' : now.getHours() < 17 ? 'צהריים טובים' : 'ערב טוב';

  const { data: matches = [] } = useQuery({
    queryKey: ['matches', 'open'],
    queryFn: () => base44.entities.Match.filter({ status: 'open' }, '-created_date', 20),
  });

  const { data: clubs = [] } = useQuery({
    queryKey: ['clubs'],
    queryFn: () => base44.entities.Club.list('name', 10),
  });

  const { data: players = [] } = useQuery({
    queryKey: ['players', 'count'],
    queryFn: () => base44.entities.Player.list('-rally_rating', 50),
  });

  const userLevel = user.level || 'B2';
  const userCity = user.city || '';
  const compatLevels = COMPAT[userLevel] || [userLevel];
  const heroMatch = matches[0];

  const recommended = useMemo(() => {
    return matches
      .map(m => ({
        ...m,
        score: (compatLevels.includes(m.level) ? 2 : 0) + (m.city === userCity ? 3 : 0) + ((m.players?.length || 0) >= 3 ? 1 : 0),
      }))
      .filter(m => m.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [matches, userLevel, userCity]);

  const hasPrefs = user.preferred_hand;

  return (
    <div className="pb-28 bg-background">
      <FreeCourtAlert />
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-4">
        <RallyLogo layout="horizontal" mark={26} text={17} className="text-brand" />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button onClick={() => navigate('/notifications')}
            className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center shadow-sm active:scale-90 relative">
            <BellIcon size={19} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border-2 border-white" />
          </button>
        </div>
      </div>

      {/* Greeting */}
      <div className="px-5 mb-5 flex items-center gap-3.5">
        <img
          src={user.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'}
          className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md flex-shrink-0"
          alt={user.full_name}
        />
        <div>
          <div className="text-[13px] text-muted-foreground">{greeting},</div>
          <div className="font-display text-[20px] font-black leading-tight">{user.full_name || 'שחקן'}</div>
        </div>
        <div className="mr-auto">
          <LevelTag level={user.level || 'B2'} size="sm" />
        </div>
      </div>

      {/* Pref banner */}
      {!hasPrefs && (
        <div className="mx-5 mb-4 flex items-center gap-3 bg-card border border-border rounded-2xl px-4 py-3 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-brand-soft flex items-center justify-center flex-shrink-0">
            <Star size={18} className="text-brand" strokeWidth={1.75} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold">הגדר העדפות שחקן</div>
            <div className="text-[12px] text-muted-foreground truncate">יד ראשית, צד מגרש, סוג משחק...</div>
          </div>
          <button onClick={() => navigate('/player-preferences')}
            className="text-brand text-[13px] font-bold flex-shrink-0">הגדר</button>
        </div>
      )}

      {/* Quick Actions */}
      <div className="px-5 mb-6">
        <div className="grid grid-cols-4 gap-3">
          {QUICK_ACTIONS.map(({ label, to, color, emoji }) => (
            <Link key={to} to={to}
              className="flex flex-col items-center gap-2 active:scale-90 transition-transform">
              <div className={`w-14 h-14 rounded-full ${color} flex items-center justify-center shadow-lg text-2xl`}>
                {emoji}
              </div>
              <span className="text-[11px] font-bold text-center leading-tight text-foreground">{label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Premium 3D racket hero */}
      <RacketHero />

      {/* Your Clubs */}
      {clubs.length > 0 && (
        <div className="mb-6">
          <div className="flex items-baseline justify-between px-5 mb-3">
            <span className="font-display text-[20px] font-black">המועדונים שלי</span>
            <Link to="/clubs" className="text-sm text-brand font-semibold flex items-center gap-0.5">
              ראה הכל <ChevronLeft size={14} />
            </Link>
          </div>
          <div className="flex gap-3.5 px-5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {clubs.slice(0, 5).map(club => (
              <div key={club.id} className="flex-shrink-0 w-[220px] bg-card rounded-2xl overflow-hidden border border-border shadow-sm">
                <div className="relative h-28">
                  <img
                    src={club.image_url || 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400&h=200&fit=crop'}
                    className="w-full h-full object-cover"
                    alt={club.name}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-2 right-3 left-3 text-white">
                    <div className="font-bold text-sm leading-tight">{club.name}</div>
                    <div className="text-[11px] text-white/70">{club.city}</div>
                  </div>
                </div>
                <div className="px-3 py-2.5 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">🎾 {club.courts_count || 3} מגרשים</span>
                  <span className="flex items-center gap-1">⏰ {club.hours || '07:00–22:00'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommended */}
      {recommended.length > 0 && (
        <div className="mb-6">
          <div className="flex items-baseline justify-between px-5 mb-3">
            <span className="font-display text-[20px] font-black">מומלץ עבורך</span>
            <Link to="/find" className="text-sm text-brand font-semibold flex items-center gap-0.5">
              הכל <ChevronLeft size={14} />
            </Link>
          </div>
          <div className="px-5 flex flex-col gap-3">
            {recommended.map(match => <MatchCard key={match.id} match={match} />)}
          </div>
        </div>
      )}

      {/* Hero match */}
      {heroMatch && (
        <div className="mb-6">
          <div className="flex items-baseline justify-between px-5 mb-3">
            <span className="font-display text-[20px] font-black">פתוחים עכשיו</span>
          </div>
          <div className="mx-5 bg-card rounded-[24px] overflow-hidden shadow-md border border-border">
            <div className="relative h-40">
              <img
                src={heroMatch.club_image || 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600&h=300&fit=crop'}
                className="w-full h-full object-cover"
                alt={heroMatch.club_name}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-4 right-4 left-4 text-white">
                <div className="font-display text-[20px] font-black leading-tight">{heroMatch.club_name}</div>
                <div className="text-[12px] text-white/75 mt-0.5">{heroMatch.drive_minutes} דק׳ נסיעה · {heroMatch.city}</div>
              </div>
              <div className="absolute top-3 left-3">
                <span className="flex items-center gap-1.5 bg-green-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  פעיל
                </span>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-3 text-[13px] text-muted-foreground">
                <span>פעילויות ב-14 הימים הקרובים</span>
              </div>
              <div className="flex gap-2.5 mb-4">
                {[
                  { icon: '🎾', count: matches.filter(m=>m.level?.startsWith('B')).length || 1 },
                  { icon: '🏆', count: matches.filter(m=>m.level?.startsWith('A')).length || 5 },
                  { icon: '👥', count: matches.length || 7 },
                ].map((item, i) => (
                  <div key={i} className="flex-1 flex items-center gap-2 bg-bgWarm rounded-xl px-3 py-2.5 cursor-pointer active:scale-95 transition-transform">
                    <span>{item.icon}</span>
                    <span className="font-display text-[18px] font-black">{item.count}</span>
                    <ChevronLeft size={12} className="text-muted-foreground mr-auto" />
                  </div>
                ))}
              </div>
              <SlideToJoin matchId={heroMatch.id} />
            </div>
          </div>
        </div>
      )}

      {/* Players strip */}
      <div className="mx-5 mb-6 bg-card border border-border rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="font-display text-[18px] font-black">שחקנים מוצעים</span>
          <Link to="/players" className="text-sm text-brand font-semibold">הכל</Link>
        </div>
        <div className="flex gap-3 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {players.slice(0, 6).map(p => (
            <div key={p.id} className="flex-shrink-0 flex flex-col items-center gap-1.5">
              <img
                src={p.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face'}
                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                alt={p.full_name}
              />
              <div className="text-[10px] font-bold text-center max-w-[48px] leading-tight truncate">{p.full_name?.split(' ')[0]}</div>
              <LevelTag level={p.level} size="xs" />
            </div>
          ))}
          <div className="flex-shrink-0 flex flex-col items-center justify-center gap-1.5 w-12">
            <Link to="/players" className="w-12 h-12 rounded-full border-2 border-dashed border-border flex items-center justify-center active:scale-90 transition-transform">
              <Users size={18} className="text-muted-foreground/50" />
            </Link>
            <div className="text-[10px] text-muted-foreground text-center">הוסף</div>
          </div>
        </div>
      </div>
    </div>
  );
}
