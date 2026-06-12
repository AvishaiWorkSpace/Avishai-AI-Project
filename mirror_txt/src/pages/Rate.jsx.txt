import { Navigate, useLocation } from 'react-router-dom';

// Legacy route — the post-match rating flow lives at /rate-players.
export default function Rate() {
  const location = useLocation();
  return <Navigate to={`/rate-players${location.search}`} replace />;
}
