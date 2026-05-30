import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { usePublicPortfolio } from '../context/PublicPortfolioContext';
import { authApi } from '../services/api';
import { toast } from 'react-toastify';
import type { PortfolioProject } from '../types';

interface ProjectModalProps {
  project: PortfolioProject | null;
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const { user, updateUser } = useAuth();
  const { publicUser } = usePublicPortfolio();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [tech, setTech] = useState('');
  const [url, setUrl] = useState('');

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [project]);

  // Initialize form states when entering edit mode or when project changes
  useEffect(() => {
    if (project) {
      setTitle(project.title || '');
      setDesc(project.desc || '');
      setTech(project.tech ? project.tech.join(', ') : '');
      
      // Extract URL from project.stack (which has format "Live: <url>") or keep blank
      let cleanUrl = '';
      if (project.stack && project.stack.startsWith('Live: ')) {
        cleanUrl = project.stack.replace('Live: ', '');
      }
      setUrl(cleanUrl);
      
      setIsEditing(false);
      setError('');
    }
  }, [project]);

  const isEditable = !!user && !publicUser && project?.id?.startsWith('user-');

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Project name is required.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const projIdx = parseInt(project!.id.split('-')[1]);
      if (isNaN(projIdx) || !user) {
        throw new Error('Invalid project index or session.');
      }
      
      const updatedProjects = [...(user.projects || [])];
      
      updatedProjects[projIdx] = {
        name: title.trim(),
        desc: desc.trim(),
        tech: tech.trim(),
        url: url.trim()
      };
      
      // Sync skills from updated project to core portfolio skills list
      const coreSkillsArray = (user.skills || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
      const newSkillsToAppend: string[] = [];
      
      if (tech) {
        tech.split(',').map(s => s.trim()).filter(Boolean).forEach(skill => {
          const normalized = skill.toLowerCase();
          if (!coreSkillsArray.includes(normalized) && !newSkillsToAppend.map(ns => ns.toLowerCase()).includes(normalized)) {
            newSkillsToAppend.push(skill);
          }
        });
      }
      
      let updatedSkills = user.skills || '';
      if (newSkillsToAppend.length > 0) {
        updatedSkills = user.skills ? `${user.skills}, ${newSkillsToAppend.join(', ')}` : newSkillsToAppend.join(', ');
      }
      
      const res = await authApi.updateProfile(user._id!, {
        projects: updatedProjects,
        skills: updatedSkills
      });
      
      updateUser(res.user);
      
      toast.success('Project details updated successfully! ✨', { autoClose: 2000 });
      setIsEditing(false);
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to update project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="pf-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => { if (e.target === e.currentTarget && !loading) onClose(); }}
        >
          <motion.div
            className="pf-modal-box"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.25 }}
            style={{ maxWidth: '600px', width: '95%', display: 'flex', flexDirection: 'column', maxHeight: '90vh', overflow: 'hidden' }}
          >
            {isEditing ? (
              <form onSubmit={handleSaveProject} style={{ display: 'flex', flexDirection: 'column', flex: '1 1 auto', overflow: 'hidden' }}>
                <div className="pf-modal-header">
                  <h2 className="pf-modal-title">✏️ EDIT PROJECT</h2>
                  <button type="button" className="pf-modal-close" onClick={() => { setIsEditing(false); setError(''); }} disabled={loading}>×</button>
                </div>

                <div className="pf-modal-body" style={{ flex: '1 1 auto', overflowY: 'auto' }}>
                  <div className="mb-3">
                    <label className="pf-label">Project Name <span style={{ color: 'var(--neon2)' }}>*</span></label>
                    <input className="pf-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="AI Chat Engine" required />
                  </div>

                  <div className="mb-3">
                    <label className="pf-label">Tech Stack (comma-separated)</label>
                    <input className="pf-input" value={tech} onChange={(e) => setTech(e.target.value)} placeholder="React, Node.js, TypeScript" />
                  </div>

                  <div className="mb-3">
                    <label className="pf-label">Description</label>
                    <textarea className="pf-textarea" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="A full-featured AI chat bot..." style={{ minHeight: '100px' }} />
                  </div>

                  <div className="mb-2">
                    <label className="pf-label">Demo / Repo URL</label>
                    <input className="pf-input" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="github.com/username/repo" />
                  </div>
                </div>

                <div 
                  className="pf-modal-header" 
                  style={{ 
                    paddingTop: '1.25rem', 
                    paddingBottom: '1.25rem', 
                    display: 'flex', 
                    gap: '0.75rem', 
                    justifyContent: 'flex-end', 
                    borderTop: '1px solid var(--border)'
                  }}
                >
                  {error && <span style={{ color: 'var(--neon2)', marginRight: 'auto', fontSize: '0.85rem', fontFamily: 'Share Tech Mono, monospace' }}>⚠️ {error}</span>}
                  <button 
                    type="button" 
                    className="btn-secondary" 
                    style={{ padding: '0.4rem 1.2rem', textTransform: 'uppercase', fontSize: '0.85rem' }}
                    onClick={() => { setIsEditing(false); setError(''); }}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn-pink" 
                    style={{ padding: '0.4rem 1.5rem', textTransform: 'uppercase', fontSize: '0.85rem' }}
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="pf-modal-header">
                  <h2 className="pf-modal-title">{project.title}</h2>
                  <button className="pf-modal-close" onClick={onClose} aria-label="Close">×</button>
                </div>

                <div className="pf-modal-body" style={{ flex: '1 1 auto', overflowY: 'auto' }}>
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

                {isEditable && (
                  <div 
                    className="pf-modal-header" 
                    style={{ 
                      paddingTop: '1.25rem', 
                      paddingBottom: '1.25rem', 
                      display: 'flex', 
                      gap: '0.75rem', 
                      justifyContent: 'flex-end', 
                      borderTop: '1px solid var(--border)'
                    }}
                  >
                    <button 
                      type="button" 
                      className="btn-pink" 
                      style={{ padding: '0.4rem 1.5rem', textTransform: 'uppercase', fontSize: '0.85rem' }}
                      onClick={() => setIsEditing(true)}
                    >
                      ✏️ Edit Project
                    </button>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProjectModal;
