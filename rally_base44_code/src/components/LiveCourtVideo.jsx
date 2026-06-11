import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Real padel match footage (Pexels, free license) — rotated with a slow
// crossfade + gentle zoom, so any surface using it feels like a live feed.
export const PADEL_CLIPS = [
  'https://videos.pexels.com/video-files/34445055/14595268_1440_2560_60fps.mp4', // rally at the net
  'https://videos.pexels.com/video-files/34449247/14597454_1440_2560_60fps.mp4', // night match
  'https://videos.pexels.com/video-files/34445043/14595226_1440_2560_60fps.mp4', // sunset game
];

export default function LiveCourtVideo({ clips = PADEL_CLIPS, interval = 10000, poster, className = '' }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (clips.length < 2) return undefined;
    const t = setInterval(() => setI((v) => (v + 1) % clips.length), interval);
    return () => clearInterval(t);
  }, [clips.length, interval]);

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <AnimatePresence initial={false}>
        <motion.video
          key={clips[i]}
          src={clips[i]}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1.09 }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: 1.4, ease: 'easeInOut' },
            // slow Ken Burns zoom across the clip's full screen time
            scale: { duration: interval / 1000 + 1.5, ease: 'linear' },
          }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>
    </div>
  );
}
