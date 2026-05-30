import React, { useState, useCallback, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import ProfileModal from './ProfileModal';
import { applyThemeAndAccent } from '../utils/theme';
import { usePublicPortfolio } from '../context/PublicPortfolioContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { publicUser, clearPublicUser } = usePublicPortfolio();
  const navigate = useNavigate();
  const [navOpen, setNavOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('portfolio_theme') || 'dark');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const isAuthenticated = !!user && !publicUser; // treat as unauthenticated inside public view for guest simplicity
  const closeNav = useCallback(() => setNavOpen(false), []);

  const handleProtectedLink = useCallback(
    (e: React.MouseEvent, path: string) => {
      e.preventDefault();
      closeNav();
      if (!isAuthenticated) {
        toast.info('Please sign in or register first! 🔐', { autoClose: 3000 });
        navigate('/signin');
      } else {
        navigate(path);
      }
    },
    [isAuthenticated, navigate, closeNav]
  );

  const handleSignOut = useCallback(() => {
    logout();
    closeNav();
    navigate('/');
    toast.success('Signed out successfully!', { autoClose: 2000 });
  }, [logout, navigate, closeNav]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('portfolio_theme', nextTheme);
    
    const savedAccent = localStorage.getItem('portfolio_accent') || 'classic';
    applyThemeAndAccent(nextTheme, savedAccent);

    toast.success(`Switched to ${nextTheme === 'dark' ? 'Dark' : 'Light'} Mode! 🎨`, {
      autoClose: 1500,
      toastId: 'theme-switch'
    });
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    if (!dropdownOpen) return;
    const handleOutsideClick = () => setDropdownOpen(false);
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [dropdownOpen]);

  const userInitials = user
    ? `${user.firstName[0] || ''}${user.lastName[0] || ''}`.toUpperCase()
    : '';

  return (
    <>
      {publicUser && (
        <div 
          style={{
            background: 'linear-gradient(90deg, var(--neon), var(--neon2))',
            color: '#050510',
            textAlign: 'center',
            fontSize: '0.85rem',
            padding: '0.4rem 1rem',
            fontWeight: 700,
            fontFamily: 'Orbitron, monospace',
            letterSpacing: '1px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1rem',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1100,
            boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
          }}
        >
          <span>👁️ VIEWING PUBLIC PORTFOLIO: {publicUser.firstName.toUpperCase()} {publicUser.lastName.toUpperCase()}</span>
          <button
            onClick={() => {
              clearPublicUser();
              navigate('/');
              toast.info('Returned to default developer portfolio! 🌐');
            }}
            style={{
              background: '#050510',
              color: '#ffffff',
              border: 'none',
              borderRadius: '3px',
              padding: '0.15rem 0.5rem',
              fontSize: '0.7rem',
              fontWeight: 700,
              cursor: 'pointer',
              textTransform: 'uppercase',
            }}
            type="button"
          >
            🚪 Exit View
          </button>
        </div>
      )}

      <nav 
        className="navbar navbar-expand-lg pf-nav sticky-top"
        style={{
          top: publicUser ? '32px' : '0px',
          transition: 'top 0.3s ease'
        }}
      >
        <div className="container-fluid px-4">
        {/* Logo */}
        <NavLink to="/" className="navbar-brand pf-logo" onClick={closeNav}>
          BM.DEV
        </NavLink>

        {/* Hamburger */}
        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={navOpen}
          onClick={() => setNavOpen(o => !o)}
        >
          <span className="navbar-toggler-icon" />
        </button>

        {/* Collapsible */}
        <div className={`collapse navbar-collapse${navOpen ? ' show' : ''}`}>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink
                to="/" end
                className={({ isActive }) => `nav-link pf-nav-link${isActive ? ' active' : ''}`}
                onClick={closeNav}
              >
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/projects"
                className={({ isActive }) => `nav-link pf-nav-link${isActive ? ' active' : ''}`}
                onClick={closeNav}
              >
                Projects
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/about"
                className={({ isActive }) => `nav-link pf-nav-link${isActive ? ' active' : ''}`}
                onClick={closeNav}
              >
                About
              </NavLink>
            </li>
            {!isAuthenticated && <li className="nav-item">
              <NavLink
                to="/my-resume"
                className={({ isActive }) => `nav-link pf-nav-link${isActive ? ' active' : ''}`}
                onClick={closeNav}
              >
                Resume
              </NavLink>
            </li>}
            {/* AI Chat — accessible but limited for guests */}
            <li className="nav-item">
              <NavLink
                to="/chat"
                className={({ isActive }) => `nav-link pf-nav-link${isActive ? ' active' : ''}`}
                onClick={closeNav}
              >
                AI Chat <span className="badge" >Beta</span>
              </NavLink>
            </li>
          </ul>

          {/* Auth and Theme buttons */}
          <div className="d-flex align-items-center gap-2 flex-wrap">
            {/* Sun / Moon Theme Toggle */}
            <button
              className="theme-toggle-btn me-2"
              onClick={toggleTheme}
              title="Toggle Light/Dark Theme"
              type="button"
            >
              {theme === 'dark' ? <FiSun /> : <FiMoon />}
            </button>

            {isAuthenticated && user ? (
              <>
                <div className="profile-chip-wrapper">
                  <button
                    className="profile-chip"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDropdownOpen(o => !o);
                    }}
                    type="button"
                  >
                    <div className="avatar">{userInitials}</div>
                    <span className="d-none d-sm-inline">{user.firstName}</span>
                  </button>

                  {/* Profile Dropdown */}
                  {dropdownOpen && (
                    <div className="pf-dropdown">
                      <button
                        className="dropdown-item-pf"
                        onClick={() => {
                          setDropdownOpen(false);
                          setModalOpen(true);
                        }}
                        type="button"
                      >
                        ⚙️ Update Profile
                      </button>
                      <button
                        className="dropdown-item-pf"
                        onClick={() => {
                          setDropdownOpen(false);
                          navigate('/resume');
                        }}
                        type="button"
                      >
                        📄 View ATS Resume
                      </button>
                      <hr style={{ margin: '0.25rem 0', borderColor: 'var(--border)', opacity: 0.2 }} />
                      <button
                        className="dropdown-item-pf"
                        onClick={() => {
                          setDropdownOpen(false);
                          handleSignOut();
                        }}
                        style={{ color: 'var(--neon2)' }}
                        type="button"
                      >
                        🚪 Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Resume — protected */}
                <div className="nav-item me-2">
                  <a
                    href="/resume"
                    className={`nav-link pf-nav-link${!isAuthenticated ? ' text-muted' : ''}`}
                    onClick={e => handleProtectedLink(e, '/resume')}
                  >
                    {!isAuthenticated && <span className="me-1">🔒</span>}Your Resume
                  </a>
                </div>
                <button
                  className="btn-neon"
                  onClick={() => { closeNav(); navigate('/signin'); }}
                >
                  Sign In
                </button>
                <button
                  className="btn-pink"
                  onClick={() => { closeNav(); navigate('/signup'); }}
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      </div>

    </nav>
    {/* Dynamic Edit Profile Modal */}
    <ProfileModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
  </>
);
};

export default Navbar;
