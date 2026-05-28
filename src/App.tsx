import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ParticleBackground from './components/ParticleBackground';

// Pages
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import AboutPage from './pages/AboutPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import ResumePage from './pages/ResumePage';
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

/* ── App ─────────────────────────────────────────────────────── */
const App: React.FC = () => (
  <Layout>
    <Routes>
      {/* Public */}
      <Route path="/" element={<HomePage />} />
      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />

      {/* Auth-gated (pages handle their own auth guard) */}
      <Route path="/resume" element={<ResumePage />} />
      <Route path="/my-resume" element={<MyResumePage />} />
      <Route path="/chat" element={<ChatPage />} />

      {/* Fallback — redirect to home */}
      <Route path="*" element={<HomePage />} />
    </Routes>
  </Layout>
);

export default App;
