import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { SITE_INFO } from '../data/portfolioData';

const TYPING_PHRASES = [
  'Full Stack Developer',
  'React Developer',
  'Typescript Developer',
  'Python Developer',
];

const STATS = [
  { num: '3+', label: 'Major Projects' },
  { num: '5+', label: 'Years Coding' },
  { num: '15+', label: 'Technologies' },
  { num: '100%', label: 'Passion' },
];

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
  const isAuthenticated = !!user;

  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);

  /* ── Typing Effect ── */
  useEffect(() => {
    const current = TYPING_PHRASES[phraseIndex];
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
      setPhraseIndex((prev) => (prev + 1) % TYPING_PHRASES.length);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, phraseIndex]);

  /* ── Handlers ── */
  const handleResumeClick = useCallback(() => {
    if (!isAuthenticated) {
      toast.info('Sign in to View your own resume! 🔐', {
        position: 'top-center',
        autoClose: 3000,
      });
      navigate('/my-resume');
    } if (isAuthenticated) {
      navigate('/resume');
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
    <section className="hero-section position-relative overflow-hidden">
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
              {SITE_INFO?.tagline ?? '👋 Welcome to my portfolio'}
            </motion.div>

            {/* Main heading */}
            <motion.h1
              className="hero-h1"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.15}
            >
              Biswajit<br />Mohapatra
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
              {STATS.map((stat) => (
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
