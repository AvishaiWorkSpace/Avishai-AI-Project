import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import { Navigate } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Onboarding from './pages/Onboarding';
import Home from './pages/Home';
import Find from './pages/Find';
import Market from './pages/Market';
import Profile from './pages/Profile';
import Players from './pages/Players';
import Leaderboard from './pages/Leaderboard';
import MatchChat from './pages/MatchChat';
import QuickMatch from './pages/QuickMatch';
import Rate from './pages/Rate';
import AddMatch from './pages/AddMatch';
import SellCourt from './pages/SellCourt';
import Admin from './pages/Admin';
import Stats from './pages/Stats';
import CalendarPage from './pages/CalendarPage';
import Community from './pages/Community';
import ClubDashboard from './pages/ClubDashboard';
import RatePlayers from './pages/RatePlayers';
import MyGames from './pages/MyGames';
import Clubs from './pages/Clubs';
import ClubsMap from './pages/ClubsMap';
import Notifications from './pages/Notifications';
import Tournaments from './pages/Tournaments';
import Groups from './pages/Groups';
import BookCourt from './pages/BookCourt';
import ClubAdmin from './pages/ClubAdmin';
import GroupDetail from './pages/GroupDetail';
import WalletPage from './pages/Wallet';
import PlayerPreferences from './pages/PlayerPreferences';
import About from './pages/About';
import Contact from './pages/Contact';
import RatingExplained from './pages/RatingExplained';

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
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
