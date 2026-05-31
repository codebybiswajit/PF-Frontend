import React, { useState, useEffect, useCallback } from 'react';
import { FiX, FiUser, FiSliders, FiSun, FiMoon, FiChevronRight } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { applyThemeAndAccent, PALETTES } from '../utils/theme';
import ProfileModal from './ProfileModal';

// Available font families
const FONT_FAMILIES = [
  { key: 'Rajdhani', label: 'Rajdhani', value: "'Rajdhani', sans-serif" },
  { key: 'Inter', label: 'Inter', value: "'Inter', sans-serif" },
  { key: 'Orbitron', label: 'Orbitron', value: "'Orbitron', monospace" },
  { key: 'Plus Jakarta Sans', label: 'Plus Jakarta Sans', value: "'Plus Jakarta Sans', sans-serif" },
  { key: 'Share Tech Mono', label: 'Share Tech Mono', value: "'Share Tech Mono', monospace" },
];

interface SettingsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'profile' | 'personalize';
  readOnly?: boolean; // true when viewing someone else's public portfolio
}

const SettingsSidebar: React.FC<SettingsSidebarProps> = ({ isOpen, onClose, defaultTab = 'profile', readOnly = false }) => {
  const { user } = useAuth();

  // No user = personalize only; readOnly (public view) = personalize only
  const forcePersonalize = !user || readOnly;

  // If readOnly or no user, always force personalize tab
  const [activeTab, setActiveTab] = useState<'profile' | 'personalize'>(
    forcePersonalize ? 'personalize' : defaultTab
  );
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // Personalize state
  const [theme, setTheme] = useState(localStorage.getItem('portfolio_theme') || 'dark');
  const [accent, setAccent] = useState(localStorage.getItem('portfolio_accent') || 'classic');
  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem('portfolio_font_size');
    return saved ? Number(saved) : 16;
  });
  const [fontFamily, setFontFamily] = useState(
    localStorage.getItem('portfolio_font_family') || 'Rajdhani'
  );

  // Sync tab when props change
  useEffect(() => {
    setActiveTab(forcePersonalize ? 'personalize' : defaultTab);
  }, [defaultTab, isOpen, forcePersonalize]);

  const applyFont = useCallback((familyKey: string, size: number) => {
    const found = FONT_FAMILIES.find(f => f.key === familyKey);
    const value = found ? found.value : "'Rajdhani', sans-serif";
    document.documentElement.style.setProperty('--font-family', value);
    document.documentElement.style.setProperty('--font-base', `${size}px`);
    document.documentElement.style.fontSize = `${size}px`;
  }, []);

  // Apply saved settings on mount / open
  useEffect(() => {
    if (isOpen) {
      const savedTheme = localStorage.getItem('portfolio_theme') || 'dark';
      const savedAccent = localStorage.getItem('portfolio_accent') || 'classic';
      const savedSize = Number(localStorage.getItem('portfolio_font_size') || 16);
      const savedFamily = localStorage.getItem('portfolio_font_family') || 'Rajdhani';
      setTheme(savedTheme);
      setAccent(savedAccent);
      setFontSize(savedSize);
      setFontFamily(savedFamily);
      applyFont(savedFamily, savedSize);
    }
  }, [isOpen, applyFont]);

  const handleThemeToggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('portfolio_theme', next);
    applyThemeAndAccent(next, accent);
    toast.success(`Switched to ${next === 'dark' ? 'Dark' : 'Light'} Mode! 🎨`, {
      autoClose: 1500,
      toastId: 'theme-switch',
    });
  };

  const handleAccentChange = (key: string) => {
    setAccent(key);
    localStorage.setItem('portfolio_accent', key);
    applyThemeAndAccent(theme, key);
    toast.success(`Accent changed to ${PALETTES[key as keyof typeof PALETTES]?.name}! 🎨`, {
      autoClose: 1200,
      toastId: 'accent-change',
    });
  };

  const handleFontSizeChange = (val: number) => {
    setFontSize(val);
    localStorage.setItem('portfolio_font_size', String(val));
    applyFont(fontFamily, val);
  };

  const handleFontFamilyChange = (key: string) => {
    setFontFamily(key);
    localStorage.setItem('portfolio_font_family', key);
    applyFont(key, fontSize);
    toast.success(`Font changed to ${key}! ✏️`, {
      autoClose: 1200,
      toastId: 'font-change',
    });
  };


  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`settings-sidebar${isOpen ? ' settings-sidebar--open' : ''}`}
        role="dialog"
        aria-label="Settings panel"
        aria-modal="true"
      >
        {/* Header */}
        <div className="sidebar-header">
          <span className="sidebar-title">
            ⚙️ Settings
          </span>
          <button
            className="sidebar-close-btn"
            onClick={onClose}
            aria-label="Close settings"
            type="button"
          >
            <FiX />
          </button>
        </div>

        {/* Tabs — Profile tab only visible when logged in */}
        <div className="sidebar-tabs">
          {!forcePersonalize && (
            <button
              className={`sidebar-tab${activeTab === 'profile' ? ' active' : ''}`}
              onClick={() => setActiveTab('profile')}
              type="button"
            >
              <FiUser size={15} />
              <span>Profile</span>
            </button>
          )}
          <button
            className={`sidebar-tab${activeTab === 'personalize' ? ' active' : ''}`}
            onClick={() => setActiveTab('personalize')}
            type="button"
          >
            <FiSliders size={15} />
            <span>Personalize</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="sidebar-content">

          {/* ─── Profile Tab ─── */}
          {activeTab === 'profile' && (
            <div className="sidebar-section">
              {/* User snapshot */}
              <div className="sidebar-user-card">
                <div className="sidebar-avatar">
                  {(user.firstName?.[0] || '') + (user.lastName?.[0] || '')}
                </div>
                <div>
                  <div className="sidebar-user-name">{user.firstName} {user.lastName}</div>
                  <div className="sidebar-user-title">{user.title || 'Developer'}</div>
                </div>
              </div>

              <p className="sidebar-hint">
                Update your personal information, portfolio details, skills, experience and more.
              </p>

              <button
                className="sidebar-action-btn"
                onClick={() => {
                  setProfileModalOpen(true);
                }}
                type="button"
              >
                <FiUser size={15} />
                Open Profile Editor
                <FiChevronRight size={14} style={{ marginLeft: 'auto' }} />
              </button>
            </div>
          )}

          {/* ─── Personalize Tab ─── */}
          {activeTab === 'personalize' && (
            <div className="sidebar-section">

              {/* Theme toggle */}
              <div className="sidebar-group">
                <div className="sidebar-group-label">
                  {theme === 'dark' ? <FiMoon size={13} /> : <FiSun size={13} />}
                  Color Mode
                </div>
                <div className="theme-switch-row">
                  <span className={theme === 'light' ? 'theme-opt active' : 'theme-opt'}>Light</span>
                  <button
                    className={`theme-toggle-pill${theme === 'dark' ? ' dark' : ''}`}
                    onClick={handleThemeToggle}
                    type="button"
                    aria-label="Toggle theme"
                  >
                    <span className="pill-thumb" />
                  </button>
                  <span className={theme === 'dark' ? 'theme-opt active' : 'theme-opt'}>Dark</span>
                </div>
              </div>

              {/* Accent Colors */}
              <div className="sidebar-group">
                <div className="sidebar-group-label">
                  🎨 Accent Color
                </div>
                <div className="accent-grid">
                  {Object.entries(PALETTES).map(([key, palette]) => {
                    const colors = theme === 'dark' ? palette.dark : palette.light;
                    return (
                      <button
                        key={key}
                        className={`accent-swatch${accent === key ? ' active' : ''}`}
                        style={{ background: `linear-gradient(135deg, ${colors.neon}, ${colors.neon2})` }}
                        onClick={() => handleAccentChange(key)}
                        title={palette.name}
                        type="button"
                        aria-label={`Accent: ${palette.name}`}
                      >
                        {accent === key && <span className="accent-check">✓</span>}
                      </button>
                    );
                  })}
                </div>
                <div className="sidebar-hint" style={{ marginTop: '0.4rem' }}>
                  {PALETTES[accent as keyof typeof PALETTES]?.name}
                </div>
              </div>

              {/* Font Family */}
              <div className="sidebar-group">
                <div className="sidebar-group-label">✏️ Font Family</div>
                <div className="font-family-list">
                  {FONT_FAMILIES.map(f => (
                    <button
                      key={f.key}
                      className={`font-family-btn${fontFamily === f.key ? ' active' : ''}`}
                      style={{ fontFamily: f.value }}
                      onClick={() => handleFontFamilyChange(f.key)}
                      type="button"
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Size */}
              <div className="sidebar-group">
                <div className="sidebar-group-label">
                  🔠 Font Size
                  <span className="font-size-badge">{fontSize}px</span>
                </div>
                <input
                  type="range"
                  min={12}
                  max={22}
                  step={1}
                  value={fontSize}
                  onChange={e => handleFontSizeChange(Number(e.target.value))}
                  className="font-size-slider"
                  aria-label="Font size"
                />
                <div className="font-size-labels">
                  <span>Aa</span>
                  <span style={{ fontSize: '1.1em' }}>Aa</span>
                  <span style={{ fontSize: '1.3em' }}>Aa</span>
                </div>
              </div>

            </div>
          )}
        </div>
      </aside>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />
    </>
  );
};

export default SettingsSidebar;
