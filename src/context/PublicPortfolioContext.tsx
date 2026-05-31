import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User } from '../types';
import { authApi } from '../services/api';

const FOUNDER_USER_ID = import.meta.env.VITE_FOUNDER_USER_ID as string | undefined;

interface PublicPortfolioContextType {
  publicUser: User | null;
  founderUser: User | null;
  founderLoading: boolean;
  setPublicUser: (user: User | null) => void;
  clearPublicUser: () => void;
}

const PublicPortfolioContext = createContext<PublicPortfolioContextType | undefined>(undefined);

export const PublicPortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [publicUser, setPublicUserState] = useState<User | null>(() => {
    const cached = localStorage.getItem('portfolio_public_user');
    return cached ? JSON.parse(cached) : null;
  });

  const [founderUser, setFounderUser] = useState<User | null>(null);
  const [founderLoading, setFounderLoading] = useState(true);

  const fetchFounder = useCallback(async () => {
    if (!FOUNDER_USER_ID) {
      console.warn('[PublicPortfolioContext] VITE_FOUNDER_USER_ID is not set in .env');
      setFounderLoading(false);
      return;
    }
    setFounderLoading(true);
    try {
      const res = await authApi.getPublicUserById(FOUNDER_USER_ID);
      setFounderUser(res.user);
    } catch (err) {
      console.error('[PublicPortfolioContext] Failed to load founder profile:', err);
    } finally {
      setFounderLoading(false);
    }
  }, []);

  // On mount: fetch founder only if no user is logged in.
  useEffect(() => {
    const isLoggedIn = !!localStorage.getItem('portfolio_token');
    if (!isLoggedIn) {
      fetchFounder();
    } else {
      setFounderLoading(false);
    }
  }, [fetchFounder]);

  // On logout: restore founder if it hasn't been loaded yet.
  useEffect(() => {
    const handleLogout = () => {
      setFounderUser((current) => {
        if (!current) {
          // founderUser is null — fetch it now
          fetchFounder();
        }
        return current;
      });
    };
    window.addEventListener('portfolio:logout', handleLogout);
    return () => window.removeEventListener('portfolio:logout', handleLogout);
  }, [fetchFounder]);

  const setPublicUser = useCallback((user: User | null) => {
    setPublicUserState(user);
    if (user) {
      localStorage.setItem('portfolio_public_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('portfolio_public_user');
    }
  }, []);

  const clearPublicUser = useCallback(() => {
    setPublicUser(null);
  }, [setPublicUser]);

  return (
    <PublicPortfolioContext.Provider value={{ publicUser, founderUser, founderLoading, setPublicUser, clearPublicUser }}>
      {children}
    </PublicPortfolioContext.Provider>
  );
};

export const usePublicPortfolio = () => {
  const context = useContext(PublicPortfolioContext);
  if (context === undefined) {
    throw new Error('usePublicPortfolio must be used within a PublicPortfolioProvider');
  }
  return context;
};
