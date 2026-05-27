import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const SignInPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [passErr, setPassErr] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailErr(''); setPassErr('');
    if (!email) { setEmailErr('Email required'); return; }
    if (!password) { setPassErr('Password required'); return; }
    setLoading(true);
    try {
      await login(email.trim().toLowerCase(), password);
      toast.success('Welcome back! 🚀');
      navigate('/resume');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '';
      if (msg.includes('401') || msg.includes('Invalid')) {
        setPassErr('Invalid email or password');
      } else if (msg.includes('404') || msg.includes('not found')) {
        setEmailErr('No account found with this email');
      } else {
        setPassErr('Login failed. Is the backend running?');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" style={{ paddingTop: '80px' }}>
      <motion.div
        className="auth-card fade-in"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="auth-title">SIGN IN</div>
        <div className="auth-sub">Access your personalized portfolio experience</div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label className="pf-label">Email</label>
            <input
              type="email"
              className="pf-input"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            {emailErr && <div className="error-msg">{emailErr}</div>}
          </div>
          <div className="mb-3">
            <label className="pf-label">Password</label>
            <input
              type="password"
              className="pf-input"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            {passErr && <div className="error-msg">{passErr}</div>}
          </div>
          <button
            type="submit"
            className="btn-neon filled"
            style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', marginTop: '0.5rem' }}
            disabled={loading}
          >
            {loading ? 'ACCESSING...' : 'ACCESS SYSTEM'}
          </button>
        </form>

        <div className="auth-switch">
          No account? <Link to="/signup">Register Here</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default SignInPage;
