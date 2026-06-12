import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { ChevronsLeft, Check } from 'lucide-react';
import { toast } from 'sonner';
import { addJoinedMatchId } from '@/data/gamesHistory';
import { requestJoin } from '@/data/joinRequests';

// Slide-to-join confirmation. RTL: the handle starts on the right and
// the user drags it left to confirm.
//
// Two modes:
//   default     — instant join: the match is added to המשחקים שלי.
//   requestMode — approval-gated (quick-fill): sends a join request to the
//                 match host; membership arrives only when he approves.
//
// Constraints are explicit pixel values (not a ref) — measuring the track
// element through dragConstraints={ref} computes wrong bounds in RTL layouts,
// which froze the knob in place.
export default function SlideToJoin({ matchId, label, requestMode = false, onJoin }) {
  const idleLabel = label || (requestMode ? 'החלק לבקשת הצטרפות' : 'החלק להצטרפות');
  const trackRef = useRef(null);
  const x = useMotionValue(0);
  const [done, setDone] = useState(false);
  const [maxDrag, setMaxDrag] = useState(0);
  const KNOB = 52;

  useEffect(() => {
    const measure = () =>
      setMaxDrag(Math.max(0, (trackRef.current?.offsetWidth || 0) - KNOB - 8));
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // Live feedback while dragging: the label fades out, a gold trail follows the knob.
  const labelOpacity = useTransform(x, [-maxDrag * 0.6, 0], [0, 1]);
  const trailWidth = useTransform(x, (v) => `${Math.min(100, (Math.abs(v) / Math.max(1, maxDrag)) * 100 + 14)}%`);

  const handleDragEnd = () => {
    // In RTL we drag toward negative x (leftwards). maxDrag > 0 guards the
    // unmeasured state — otherwise 0 <= -0 passes and a single tap "joins".
    if (maxDrag > 0 && x.get() <= -maxDrag * 0.7) {
      animate(x, -maxDrag, { type: 'spring', stiffness: 400, damping: 40 });
      setDone(true);
      if (requestMode) {
        requestJoin(matchId);
        toast('הבקשה נשלחה למנהל המשחק', { description: 'נעדכן אותך ברגע שיאשר אותך' });
      } else {
        toast.success('הצטרפת למשחק!', { description: 'נשלחה הודעה לשאר השחקנים' });
        addJoinedMatchId(matchId); // the match now shows up in המשחקים שלי + the calendar
      }
      onJoin?.(matchId);
    } else {
      animate(x, 0, { type: 'spring', stiffness: 500, damping: 35 });
    }
  };

  return (
    <div
      ref={trackRef}
      className={`relative h-14 rounded-full overflow-hidden select-none ${
        done ? (requestMode ? 'bg-[hsl(var(--gold-deep))]' : 'bg-green-500') : 'bg-brand'
      } transition-colors`}
    >
      {/* Gold trail filling behind the knob as it travels */}
      {!done && (
        <motion.div
          style={{ width: trailWidth }}
          className="absolute inset-y-0 right-0 bg-gradient-to-l from-[hsl(var(--gold))]/35 to-transparent pointer-events-none"
        />
      )}

      {/* Two separate spans — reusing one span leaves the drag-driven opacity
          (0 at full drag) stuck on the element, hiding the success label. */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {!done && (
          <motion.span style={{ opacity: labelOpacity }} className="text-white font-bold text-[15px]">
            {idleLabel}
          </motion.span>
        )}
        {done && (
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            className="text-white font-bold text-[15px]"
          >
            {requestMode ? 'הבקשה נשלחה למנהל ✓' : 'הצטרפת בהצלחה ✓'}
          </motion.span>
        )}
      </div>

      {!done && (
        <motion.div
          drag="x"
          dragConstraints={{ left: -maxDrag, right: 0 }}
          dragElastic={0.04}
          dragMomentum={false}
          style={{ x }}
          onDragEnd={handleDragEnd}
          whileTap={{ scale: 1.06 }}
          className="absolute top-1 right-1 w-[52px] h-[52px] rounded-full bg-white flex items-center justify-center shadow-md cursor-grab active:cursor-grabbing touch-none"
        >
          <ChevronsLeft size={22} className="text-brand" strokeWidth={2.5} />
        </motion.div>
      )}

      {done && (
        <motion.div
          initial={{ scale: 0.6 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 18 }}
          className="absolute top-1 left-1 w-[52px] h-[52px] rounded-full bg-white flex items-center justify-center shadow-md"
        >
          <Check size={22} className={requestMode ? 'text-[hsl(var(--gold-deep))]' : 'text-green-500'} strokeWidth={3} />
        </motion.div>
      )}
    </div>
  );
}
