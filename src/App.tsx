import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ParticleBackground from './components/ParticleBackground';

// Pages
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import AboutPage from './pages/AboutPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import ChatPage from './pages/ChatPage';
import MyResumePage from './pages/MyResumePage';

/* ── Layout wrapper ─────────────────────────────────────────────
   Renders ParticleBackground + Navbar on every route, then
   offsets the page content by 60 px (navbar height).
────────────────────────────────────────────────────────────────── */
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    <ParticleBackground />
    <Navbar />
    <div style={{ position: 'relative', zIndex: 1 }}>
      {children}
    </div>
  </>
);

import { applyThemeAndAccent } from './utils/theme';
import { PublicPortfolioProvider } from './context/PublicPortfolioContext';
import PublicPortfolioViewer from './pages/PublicPortfolioViewer';

/* ── App ─────────────────────────────────────────────────────── */
const App: React.FC = () => {
  useEffect(() => {
    const savedTheme = localStorage.getItem('portfolio_theme') || 'dark';
    const savedAccent = localStorage.getItem('portfolio_accent') || 'classic';
    applyThemeAndAccent(savedTheme, savedAccent);
  }, []);

  return (
    <PublicPortfolioProvider>
      <Layout>
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/portfolio/:slug" element={<PublicPortfolioViewer />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/my-resume" element={<MyResumePage />} />
          <Route path="/chat" element={<ChatPage />} />

          {/* Fallback — redirect to home */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </Layout>
    </PublicPortfolioProvider>
  );
};

export default App;
