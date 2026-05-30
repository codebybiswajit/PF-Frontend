import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { authApi } from '../services/api';
import { usePublicPortfolio } from '../context/PublicPortfolioContext';

const PublicPortfolioViewer: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { setPublicUser } = usePublicPortfolio();

  useEffect(() => {
    let active = true;
    
    const resolvePublicSlug = async () => {
      if (!slug) {
        navigate('/');
        return;
      }

      try {
        const res = await authApi.getPublicPortfolio(slug);
        if (!active) return;

        // Set the public portfolio state
        setPublicUser(res.user);
        
        toast.success(`Access granted! Custom portfolio loaded successfully. 👋`, {
          toastId: 'public-access-toast',
          autoClose: 2000,
        });

        // Small timeout for dramatic cyber-loading effect
        setTimeout(() => {
          if (active) {
            navigate('/');
          }
        }, 1500);
      } catch (err: any) {
        console.error('[PublicPortfolioViewer]', err);
        if (!active) return;
        
        toast.error('Requested portfolio is either private or does not exist. 🔐', {
          autoClose: 3000,
          toastId: 'public-access-error',
        });
        navigate('/');
      }
    };

    resolvePublicSlug();

    return () => {
      active = false;
    };
  }, [slug, navigate, setPublicUser]);

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'var(--bg)',
        fontFamily: 'Orbitron, monospace',
        position: 'relative',
        zIndex: 10,
      }}
    >
      {/* Cyber-neon portal animation loader */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: [0.8, 1.1, 1], opacity: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        style={{ textAlign: 'center' }}
      >
        <div style={{ fontSize: '4rem', marginBottom: '1.5rem', animation: 'spin 4s linear infinite' }}>🌐</div>
        
        <h2 style={{ color: 'var(--neon)', fontSize: '1.25rem', letterSpacing: '3px', marginBottom: '1rem' }}>
          DECRYPTING PORTFOLIO LINK
        </h2>
        
        <p style={{ color: 'var(--muted)', fontSize: '0.85rem', letterSpacing: '1px', fontFamily: 'Share Tech Mono, monospace' }}>
          Querying secure public slug: portfolio/{slug}
        </p>

        {/* Custom progress loading bar */}
        <div 
          style={{
            width: '240px',
            height: '4px',
            background: 'rgba(255, 255, 255, 0.05)',
            margin: '2rem auto 0',
            borderRadius: '2px',
            overflow: 'hidden',
            border: '1px solid var(--border)'
          }}
        >
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, var(--neon), var(--neon2))',
              boxShadow: 'var(--glow)'
            }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default PublicPortfolioViewer;
