import React, { createContext, useContext, useState, useCallback } from 'react';
import type { User } from '../types';

interface PublicPortfolioContextType {
  publicUser: User | null;
  setPublicUser: (user: User | null) => void;
  clearPublicUser: () => void;
}

const PublicPortfolioContext = createContext<PublicPortfolioContextType | undefined>(undefined);

export const PublicPortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [publicUser, setPublicUserState] = useState<User | null>(() => {
    const cached = localStorage.getItem('portfolio_public_user');
    return cached ? JSON.parse(cached) : null;
  });

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
    <PublicPortfolioContext.Provider value={{ publicUser, setPublicUser, clearPublicUser }}>
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
