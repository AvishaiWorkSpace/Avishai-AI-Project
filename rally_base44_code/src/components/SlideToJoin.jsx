import { useRef, useState } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import { ChevronsLeft, Check } from 'lucide-react';
import { toast } from 'sonner';
import { addJoinedMatchId } from '@/data/gamesHistory';

// Slide-to-join confirmation. RTL: the handle starts on the right and
// the user drags it left to confirm.
export default function SlideToJoin({ matchId, label = 'החלק להצטרפות', onJoin }) {
  const trackRef = useRef(null);
  const x = useMotionValue(0);
  const [done, setDone] = useState(false);
  const KNOB = 52;

  const handleDragEnd = () => {
    const track = trackRef.current;
    if (!track) return;
    const maxDrag = track.offsetWidth - KNOB - 8;
    // In RTL we drag toward negative x (leftwards).
    if (x.get() <= -maxDrag * 0.75) {
      animate(x, -maxDrag, { type: 'spring', stiffness: 400, damping: 40 });
      setDone(true);
      toast.success('הצטרפת למשחק!', { description: 'נשלחה הודעה לשאר השחקנים' });
      addJoinedMatchId(matchId); // the match now shows up in המשחקים שלי + the calendar
      onJoin?.(matchId);
    } else {
      animate(x, 0, { type: 'spring', stiffness: 400, damping: 40 });
    }
  };

  return (
    <div
      ref={trackRef}
      className={`relative h-14 rounded-full overflow-hidden select-none ${
        done ? 'bg-green-500' : 'bg-brand'
      } transition-colors`}
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-white font-bold text-[15px]">
          {done ? 'הצטרפת בהצלחה ✓' : label}
        </span>
      </div>

      {!done && (
        <motion.div
          drag="x"
          dragConstraints={trackRef}
          dragElastic={0}
          dragMomentum={false}
          style={{ x }}
          onDragEnd={handleDragEnd}
          className="absolute top-1 right-1 w-[52px] h-[52px] rounded-full bg-white flex items-center justify-center shadow-md cursor-grab active:cursor-grabbing"
        >
          <ChevronsLeft size={22} className="text-brand" strokeWidth={2.5} />
        </motion.div>
      )}

      {done && (
        <div className="absolute top-1 right-1 w-[52px] h-[52px] rounded-full bg-white flex items-center justify-center shadow-md">
          <Check size={22} className="text-green-500" strokeWidth={3} />
        </div>
      )}
    </div>
  );
}
