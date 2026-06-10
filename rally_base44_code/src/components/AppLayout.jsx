import { Outlet } from 'react-router-dom';
import { NavBar } from '@/components/ui/tubelight-navbar';
import { HomeIcon, RacketIcon, TagIcon, TrophyIcon, UserIcon } from '@/components/icons';

const NAV_ITEMS = [
  { name: 'בית', url: '/', icon: HomeIcon },
  { name: 'משחקים', url: '/find', icon: RacketIcon },
  { name: 'שוק', url: '/market', icon: TagIcon },
  { name: 'דירוג', url: '/leaderboard', icon: TrophyIcon },
  { name: 'פרופיל', url: '/profile', icon: UserIcon },
];

export default function AppLayout() {
  return (
    <div className="min-h-screen max-w-md mx-auto bg-ivory-gradient relative">
      <Outlet />
      <NavBar items={NAV_ITEMS} />
    </div>
  );
}
