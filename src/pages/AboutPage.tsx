import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { usePublicPortfolio } from '../context/PublicPortfolioContext';
import { SITE_INFO } from '../data/portfolioData';
import { getInitials } from '../utils/helpers';

const AboutPage: React.FC = () => {
  const { user } = useAuth();
  const { publicUser, founderUser } = usePublicPortfolio();
  const activeUser = publicUser || user || founderUser;
  const navigate = useNavigate();

  const handleResume = () => {
    if (user) {
      navigate('/resume');
    } else {
      toast.info('Please sign in or register first to view your resume! 🔐');
      navigate('/my-resume');
    }
  };

  const handleChat = () => {
    navigate('/chat');
  };



  return (
    <div className="pf-section" style={{ paddingTop: '100px', minHeight: '100vh' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="sec-title">ABOUT</div>
        <div className="divider" />

        <div className="row align-items-start g-4">
          <div className="col-md-4 text-center text-md-start">
            <div className="about-avatar mx-auto mx-md-0">
              {activeUser ? getInitials(activeUser.firstName, activeUser.lastName) : SITE_INFO.founderInitials}
            </div>
          </div>

          <div className="col-md-8">
            <div className="about-info">
              <h2>{activeUser ? `${activeUser.firstName} ${activeUser.lastName}` : SITE_INFO.founderName}</h2>
              <div className="about-role">{activeUser ? (activeUser.title || 'Developer') : SITE_INFO.founderTitle}</div>
              <p className="about-text">{activeUser ? (activeUser.summary || 'Welcome to my portfolio.') : SITE_INFO.bio}</p>
              {!activeUser && <p className="about-text">{SITE_INFO.bio2}</p>}

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
                <button className="btn-neon" onClick={handleResume}>
                  View Resume
                </button>
                <button className="btn-pink" onClick={handleChat}>
                  Chat With AI
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Extra info cards */}
        {!(publicUser || user) && (
          <div className="row g-3 mt-5">
            {[
              { icon: '🎯', title: 'Full Stack', desc: 'Frontend to backend, I own the entire stack — React, Node.js, Python, and everything in between.' },
              { icon: '📊', title: 'Data Engineer', desc: 'Building robust ETL pipelines, distributed scrapers, and analytics systems that process records.' },
              { icon: '🏗️', title: 'System Design', desc: 'Designing scalable, HIPAA-compliant, and production-ready architectures with real-world constraints in mind.' },
            ].map((card, i) => (
              <div key={i} className="col-md-4">
                <motion.div
                  className="skill-cat"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * (i + 1) }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{card.icon}</div>
                  <h3 style={{ fontFamily: 'Orbitron, monospace', fontSize: '0.85rem', color: 'var(--neon)', marginBottom: '0.5rem', letterSpacing: '2px' }}>
                    {card.title}
                  </h3>
                  <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>{card.desc}</p>
                </motion.div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AboutPage;
