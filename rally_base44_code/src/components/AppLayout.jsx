import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import { NavBar } from '@/components/ui/tubelight-navbar';
import { HomeIcon, RacketIcon, TagIcon, TrophyIcon, UserIcon } from '@/components/icons';
import { FINISHED_MATCH } from '@/data/mockData';

const NAV_ITEMS = [
  { name: 'בית', url: '/', icon: HomeIcon },
  { name: 'משחקים', url: '/find', icon: RacketIcon },
  { name: 'שוק', url: '/market', icon: TagIcon },
  { name: 'דירוג', url: '/leaderboard', icon: TrophyIcon },
  { name: 'פרופיל', url: '/profile', icon: UserIcon },
];

// Soft-block: a finished match you haven't rated follows you around the app
// (banner everywhere + joining new matches disabled elsewhere) — but nothing
// hard-locks. Rating is how everyone's level stays honest.
function PendingRatingBanner() {
  const navigate = useNavigate();
  const done = JSON.parse(localStorage.getItem('rally_ratings_done') || '{}');
  const ended = new Date(FINISHED_MATCH.start_time).getTime() + FINISHED_MATCH.duration_min * 60000 < Date.now();
  if (!ended || done[FINISHED_MATCH.id]) return null;

  return (
    <button
      onClick={() => navigate(`/rate-players?match=${FINISHED_MATCH.id}`)}
      className="sticky top-0 z-30 w-full bg-gradient-to-l from-[hsl(var(--gold-deep))] to-[hsl(var(--gold))] text-white px-4 py-2.5 flex items-center gap-2.5 shadow-md active:opacity-90"
      dir="rtl"
    >
      <Star size={15} fill="currentColor" className="flex-shrink-0" />
      <span className="text-[12.5px] font-bold flex-1 text-right">
        דירוג ממתין מהמשחק ב{FINISHED_MATCH.club_name} — 4 שאלות וסיימת
      </span>
      <span className="text-[12px] bg-white/20 rounded-full px-2.5 py-0.5 font-bold">דרג</span>
    </button>
  );
}

export default function AppLayout() {
  // Re-render the banner after a rating completes elsewhere in the app.
  const [, bump] = useState(0);

  return (
    <div className="min-h-screen max-w-md mx-auto bg-ivory-gradient relative" onClick={() => bump(n => n + 1)}>
      <PendingRatingBanner />
      <Outlet />
      <NavBar items={NAV_ITEMS} />
    </div>
  );
}
