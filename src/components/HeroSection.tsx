import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { usePublicPortfolio } from '../context/PublicPortfolioContext';
import { SITE_INFO } from '../data/portfolioData';

/* ── Time-based phrase generator ───────────────────────────────── */
const getTimePhrases = (userTitle?: string): string[] => {
  const hour = new Date().getHours();

  let greeting: string;
  let context: string;

  if (hour >= 5 && hour < 12) {
    greeting = '☀️ Good Morning Dev';
    context = 'Building things since sunrise';
  } else if (hour >= 12 && hour < 17) {
    greeting = '⚡ Afternoon Coder';
    context = 'Deep in the code zone';
  } else if (hour >= 17 && hour < 21) {
    greeting = '🌆 Evening Engineer';
    context = 'Shipping features after hours';
  } else {
    greeting = '🌙 Night Owl Developer';
    context = 'Debugging while the world sleeps';
  }

  const base = userTitle
    ? [userTitle, greeting, 'React Developer', 'TypeScript Developer', context, 'Full Stack Developer']
    : [greeting, 'Full Stack Developer', 'React Developer', 'TypeScript Developer', context, 'Python Developer'];

  return base;
};
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay },
  }),
};

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { publicUser } = usePublicPortfolio();
  const activeUser = publicUser || user || null;
  const isAuthenticated = !!(publicUser || user);

  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);
  // Recompute phrases each hour so greeting stays accurate
  const [phrases, setPhrases] = useState(() => getTimePhrases(activeUser?.title));

  /* ── Refresh phrases every hour (so greeting auto-updates) ── */
  useEffect(() => {
    setPhrases(getTimePhrases(activeUser?.title));
    // reset typewriter when user changes
    setPhraseIndex(0);
    setCharIndex(0);
    setDisplayed('');
    setIsDeleting(false);
  }, [activeUser?.title]);

  useEffect(() => {
    // refresh time-based phrase every hour
    const id = setInterval(() => {
      setPhrases(getTimePhrases(activeUser?.title));
    }, 60 * 60 * 1000);
    return () => clearInterval(id);
  }, [activeUser?.title]);

  /* ── Typing Effect ── */
  useEffect(() => {
    const current = phrases[phraseIndex % phrases.length];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && charIndex < current.length) {
      timeout = setTimeout(() => {
        setDisplayed(current.slice(0, charIndex + 1));
        setCharIndex((c) => c + 1);
      }, 80);
    } else if (!isDeleting && charIndex === current.length) {
      timeout = setTimeout(() => setIsDeleting(true), 1800);
    } else if (isDeleting && charIndex > 0) {
      timeout = setTimeout(() => {
        setDisplayed(current.slice(0, charIndex - 1));
        setCharIndex((c) => c - 1);
      }, 45);
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, phraseIndex, phrases]);

  /* ── Handlers ── */
  const handleResumeClick = useCallback(() => {
    if (!isAuthenticated) {
      toast.info('Sign in to View your own resume! 🔐', {
        position: 'top-center',
        autoClose: 3000,
      });
      navigate('/my-resume');
    } if (isAuthenticated) {
      navigate('/my-resume');
    }
  }, [isAuthenticated, navigate]);

  const handleChatClick = useCallback(() => {
    if (!isAuthenticated) {
      toast.info('Sign in to access the Full functionality of AI chat! 🔐', {
        position: 'top-center',
        autoClose: 3000,
      });
      navigate('/chat');
    } else {
      navigate('/chat');
    }
  }, [isAuthenticated, navigate]);

  return (
    <section className="hero-section position-relative overflow-hidden" style={{ marginTop: 20 }}>
      <div className="container py-5">
        <div className="row align-items-center min-vh-80">
          <div className="col-12 col-lg-8 mx-auto text-center">

            {/* Tag */}
            <motion.div
              className="hero-tag mb-3"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0}
            >
              {activeUser?.tagline || SITE_INFO?.tagline || '👋 Welcome to my portfolio'}
            </motion.div>

            {/* Main heading */}
            <motion.h1
              className="hero-h1"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.15}
            >
              {isAuthenticated && activeUser ? (
                <>
                  {activeUser.firstName}<br />{activeUser.lastName}
                </>
              ) : (
                <>
                  Biswajit<br />Mohapatra
                </>
              )}
            </motion.h1>

            {/* Typing subtitle */}
            <motion.p
              className="hero-sub mb-4"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.3}
            >
              {displayed}
              <span className="type-cursor">|</span>
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="hero-cta d-flex flex-wrap justify-content-center gap-3 mb-5"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.45}
            >
              <button
                className="btn btn-neon btn-lg px-4"
                onClick={() => navigate('/projects')}
              >
                🚀 View Projects
              </button>
              <button
                className="btn btn-pink btn-lg px-4"
                onClick={handleResumeClick}
              >
                {isAuthenticated ? '📄 Get My Resume' : '📄 Get My Resume'}
              </button>
              <button
                className="btn btn-yellow btn-lg px-4"
                onClick={handleChatClick}
              >
                {isAuthenticated ? '🤖 AI Chat' : '🤖 AI Chat'}
              </button>
            </motion.div>

            {/* Stats bar */}
            <motion.div
              className="stats-bar row g-3 justify-content-center"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.6}
            >
              {SITE_INFO.stats.map((stat) => (
                <div key={stat.label} className="col-6 col-sm-3">
                  <div className="stat-num">{stat.num}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
