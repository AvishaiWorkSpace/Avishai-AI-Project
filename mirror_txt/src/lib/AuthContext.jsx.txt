import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // A user exists once onboarding completed (rally_user written by the
  // Onboarding result screen). New visitors go through /login → /onboarding.
  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem('rally_user'));
    setIsLoadingAuth(false);
  }, []);

  const value = {
    isAuthenticated,
    isLoadingAuth,
    isLoadingPublicSettings: false,
    authError: null,
    navigateToLogin: () => {},
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
