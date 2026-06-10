import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { RallyMark } from '@/components/RallyLogo';

// `emoji` is accepted for backward compatibility but no longer rendered —
// the brand mark replaced it as part of the no-emoji design pass.
export default function ComingSoon({ title, emoji, note }) {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-bgWarm pb-28">
      <div className="px-5 pt-5">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-card border border-border shadow-sm flex items-center justify-center active:scale-90 transition-transform"
          aria-label="חזרה"
        >
          <ArrowRight size={18} strokeWidth={2} />
        </button>
      </div>
      <div className="flex flex-col items-center justify-center text-center px-6 pt-24 gap-3">
        <div className="mb-1 text-brand/30"><RallyMark size={72} /></div>
        <h1 className="font-display text-3xl font-black text-brand">{title}</h1>
        <p className="text-muted-foreground max-w-[280px]">
          {note || 'המסך הזה בבנייה — נגיע אליו בקרוב כחלק מהפיתוח של Rally.'}
        </p>
      </div>
    </div>
  );
}
