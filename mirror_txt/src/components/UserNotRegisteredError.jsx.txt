import { Link } from 'react-router-dom';
import { RallyMark } from '@/components/RallyLogo';

export default function UserNotRegisteredError() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="text-brand"><RallyMark size={64} /></div>
      <h1 className="font-display text-2xl font-black text-brand">ברוך הבא ל-Rally</h1>
      <p className="text-muted-foreground">נראה שעדיין אין לך חשבון.</p>
      <Link to="/onboarding" className="bg-brand text-white px-6 py-3 rounded-full font-bold active:scale-95 transition-transform">
        בוא נתחיל
      </Link>
    </div>
  );
}
