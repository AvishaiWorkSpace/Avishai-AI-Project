import { Suspense, lazy } from 'react';

const Spline = lazy(() => import('@splinetool/react-spline'));

// Wrapper for a hosted Spline 3D scene. Drop in a custom padel-racket
// .splinecode URL here when you have one; the live hero currently uses the
// custom Three.js racket (PadelRacket3D) which works fully offline.
export function SplineScene({ scene, className }) {
  return (
    <Suspense
      fallback={
        <div className="w-full h-full flex items-center justify-center">
          <span className="loader" />
        </div>
      }
    >
      <Spline scene={scene} className={className} />
    </Suspense>
  );
}

export default SplineScene;
