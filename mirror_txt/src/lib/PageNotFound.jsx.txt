import { Link } from 'react-router-dom';
import { BallIcon } from '@/components/icons';

export default function PageNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="text-brand"><BallIcon size={56} strokeWidth={1.4} /></div>
      <h1 className="font-display text-3xl font-black text-brand">העמוד לא נמצא</h1>
      <p className="text-muted-foreground">נראה שהכדור יצא מהמגרש.</p>
      <Link to="/" className="bg-brand text-white px-6 py-3 rounded-full font-bold active:scale-95 transition-transform">
        חזרה לבית
      </Link>
    </div>
  );
}
