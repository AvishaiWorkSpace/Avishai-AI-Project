import { useState, lazy, Suspense } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from "@/components/ui/toaster"
import SplashScreen from '@/components/SplashScreen';
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import { Navigate } from 'react-router-dom';
import AppLayout from './components/AppLayout';

// Eager: the first-paint path (login → onboarding → home).
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import Home from './pages/Home';

// Lazy: everything else loads on navigation, keeping the initial bundle lean.
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Find = lazy(() => import('./pages/Find'));
const Market = lazy(() => import('./pages/Market'));
const Profile = lazy(() => import('./pages/Profile'));
const Players = lazy(() => import('./pages/Players'));
const Leaderboard = lazy(() => import('./pages/Leaderboard'));
const MatchChat = lazy(() => import('./pages/MatchChat'));
const QuickMatch = lazy(() => import('./pages/QuickMatch'));
const Rate = lazy(() => import('./pages/Rate'));
const AddMatch = lazy(() => import('./pages/AddMatch'));
const SellCourt = lazy(() => import('./pages/SellCourt'));
const Admin = lazy(() => import('./pages/Admin'));
const Stats = lazy(() => import('./pages/Stats'));
const CalendarPage = lazy(() => import('./pages/CalendarPage'));
const Community = lazy(() => import('./pages/Community'));
const ClubDashboard = lazy(() => import('./pages/ClubDashboard'));
const RatePlayers = lazy(() => import('./pages/RatePlayers'));
const MyGames = lazy(() => import('./pages/MyGames'));
const Clubs = lazy(() => import('./pages/Clubs'));
const ClubsMap = lazy(() => import('./pages/ClubsMap'));
const Notifications = lazy(() => import('./pages/Notifications'));
const Tournaments = lazy(() => import('./pages/Tournaments'));
const Groups = lazy(() => import('./pages/Groups'));
const BookCourt = lazy(() => import('./pages/BookCourt'));
const ClubAdmin = lazy(() => import('./pages/ClubAdmin'));
const GroupDetail = lazy(() => import('./pages/GroupDetail'));
const WalletPage = lazy(() => import('./pages/Wallet'));
const PlayerPreferences = lazy(() => import('./pages/PlayerPreferences'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const RatingExplained = lazy(() => import('./pages/RatingExplained'));

// Minimal route-transition fallback — brand spinner, matches the splash mood.
function RouteFallback() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background">
      <div className="loader" />
    </div>
  );
}

function HomeOrOnboarding() {
  const { isAuthenticated, isLoadingAuth } = useAuth();
  if (isLoadingAuth) return null;
  if (isAuthenticated || localStorage.getItem('rally_user')) return <Home />;
  return <Navigate to="/login" replace />;
}

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Suspense fallback={<RouteFallback />}>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/rate" element={<Rate />} />
      <Route path="/match/:id" element={<MatchChat />} />
      <Route path="/add-match" element={<AddMatch />} />
      <Route path="/market/sell" element={<SellCourt />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/stats" element={<Stats />} />
      <Route path="/calendar" element={<CalendarPage />} />
      <Route path="/club-dashboard" element={<ClubDashboard />} />
      <Route path="/rate-players" element={<RatePlayers />} />
      <Route path="/my-games" element={<MyGames />} />
      <Route path="/clubs" element={<Clubs />} />
      <Route path="/clubs-map" element={<ClubsMap />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/tournaments" element={<Tournaments />} />
      <Route path="/groups" element={<Groups />} />
      <Route path="/groups/:id" element={<GroupDetail />} />
      <Route path="/book-court" element={<BookCourt />} />
      <Route path="/club-admin" element={<ClubAdmin />} />
      <Route path="/wallet" element={<WalletPage />} />
      <Route path="/player-preferences" element={<PlayerPreferences />} />
      <Route path="/rating-explained" element={<RatingExplained />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomeOrOnboarding />} />
        <Route path="/find" element={<Find />} />
        <Route path="/market" element={<Market />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/players" element={<Players />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/quick" element={<QuickMatch />} />
        <Route path="/community" element={<Community />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
    </Suspense>
  );
};

function App() {
  const [booted, setBooted] = useState(false);
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
        <AnimatePresence>
          {!booted && <SplashScreen onDone={() => setBooted(true)} />}
        </AnimatePresence>
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
