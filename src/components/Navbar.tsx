import React, { useState, useCallback } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [navOpen, setNavOpen] = useState(false);

  const isAuthenticated = !!user;
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

  const userInitials = user
    ? `${user.firstName[0] || ''}${user.lastName[0] || ''}`.toUpperCase()
    : '';

  return (
    <nav className="navbar navbar-expand-lg pf-nav sticky-top">
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

          {/* Auth buttons */}
          <div className="d-flex align-items-center gap-2 flex-wrap">
            {isAuthenticated && user ? (
              <>
                <button
                  className="profile-chip"
                  onClick={() => { closeNav(); navigate('/resume'); }}
                >
                  <div className="avatar">{userInitials}</div>
                  <span className="d-none d-sm-inline">{user.firstName}</span>
                </button>
                <button className="btn-pink" onClick={handleSignOut}>
                  Sign Out
                </button>
              </>
            ) : (
              <>
                {/* Resume — protected */}
                <div className="nav-item">
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
  );
};

export default Navbar;
