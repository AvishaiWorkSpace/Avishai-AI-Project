import { createContext, useContext, useEffect, useState } from 'react';
import { DEFAULT_USER } from '@/data/mockData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // Offline/dev mode: seed a user into localStorage so the app behaves
  // as if onboarding already completed.
  useEffect(() => {
    if (!localStorage.getItem('rally_user')) {
      localStorage.setItem('rally_user', JSON.stringify(DEFAULT_USER));
    }
    setIsLoadingAuth(false);
  }, []);

  const value = {
    isAuthenticated: true,
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
