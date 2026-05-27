import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { PortfolioProject } from '../types';

interface ProjectModalProps {
  project: PortfolioProject | null;
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  // Close on Escape key
  React.useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Lock body scroll when open
  React.useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [project]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="pf-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            className="pf-modal-box"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.25 }}
          >
            <div className="pf-modal-header">
              <h2 className="pf-modal-title">{project.title}</h2>
              <button className="pf-modal-close" onClick={onClose} aria-label="Close">×</button>
            </div>

            <div className="pf-modal-body">
              {/* Overview */}
              <div className="modal-section">
                <h3>Overview</h3>
                <p>{project.desc}</p>
              </div>

              {/* Features */}
              {project.features && project.features.length > 0 && (
                <div className="modal-section">
                  <h3>Key Features</h3>
                  <div className="feature-grid">
                    {project.features.map((feat, i) => (
                      <div key={i} className="feature-item">
                        <strong>{feat.title}</strong>
                        {feat.body}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tech Stack */}
              {project.tech && project.tech.length > 0 && (
                <div className="modal-section">
                  <h3>Tech Stack</h3>
                  <div className="proj-tags" style={{ marginTop: '0.5rem' }}>
                    {project.tech.map((t) => (
                      <span key={t} className="tag">{t}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* System Output Preview */}
              {project.stack && (
                <div className="modal-section">
                  <h3>System Output Preview</h3>
                  <div className="screen-demo">{project.stack}</div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProjectModal;
