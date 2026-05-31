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
import FoundersResumePage from './pages/FoundersResumePage';

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

    // Restore font personalization
    const savedFontFamily = localStorage.getItem('portfolio_font_family') || 'Rajdhani';
    const savedFontSize = Number(localStorage.getItem('portfolio_font_size') || 16);
    const fontMap: Record<string, string> = {
      'Rajdhani': "'Rajdhani', sans-serif",
      'Inter': "'Inter', sans-serif",
      'Orbitron': "'Orbitron', monospace",
      'Plus Jakarta Sans': "'Plus Jakarta Sans', sans-serif",
      'Share Tech Mono': "'Share Tech Mono', monospace",
    };
    const fontValue = fontMap[savedFontFamily] || "'Rajdhani', sans-serif";
    document.documentElement.style.setProperty('--font-family', fontValue);
    document.documentElement.style.setProperty('--font-base', `${savedFontSize}px`);
    document.documentElement.style.fontSize = `${savedFontSize}px`;
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
          <Route path="/foundersresume" element={<FoundersResumePage />} />
          <Route path="/founders-resume" element={<FoundersResumePage />} />
          <Route path="/chat" element={<ChatPage />} />

          {/* Fallback — redirect to home */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </Layout>
    </PublicPortfolioProvider>
  );
};

export default App;
