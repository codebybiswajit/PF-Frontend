import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/api';
import type { Education, Experience, Project, User } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'basic' | 'edu-exp' | 'projects';
}

interface EduEntry extends Education { id: string; }
interface ExpEntry extends Experience { id: string; }
interface ProjEntry extends Project { id: string; }

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, initialTab }) => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'basic' | 'edu-exp' | 'projects'>('basic');

  // Basic Info Form States
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [title, setTitle] = useState('');
  const [phone, setPhone] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  const [skills, setSkills] = useState('');
  const [summary, setSummary] = useState('');
  const [portfolioSlug, setPortfolioSlug] = useState('');

  // Complex Sub-document States (keyed with a temporary string ID for React keys)
  const [eduList, setEduList] = useState<EduEntry[]>([]);
  const [expList, setExpList] = useState<ExpEntry[]>([]);
  const [projList, setProjList] = useState<ProjEntry[]>([]);

  // Initialize fields with current user profile data
  useEffect(() => {
    if (user && isOpen) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setTitle(user.title || '');
      setPhone(user.phone || '');
      setLinkedin(user.linkedin || '');
      setGithub(user.github || '');
      setSkills(user.skills || '');
      setSummary(user.summary || '');
      setPortfolioSlug(user.portfolioSlug || '');

      setEduList(
        (user.education || []).map((e, index) => ({
          ...e,
          id: `edu-${Date.now()}-${index}-${Math.random()}`
        }))
      );
      setExpList(
        (user.experience || []).map((e, index) => ({
          ...e,
          id: `exp-${Date.now()}-${index}-${Math.random()}`
        }))
      );
      setProjList(
        (user.projects || []).map((p, index) => ({
          ...p,
          id: `proj-${Date.now()}-${index}-${Math.random()}`
        }))
      );
      setActiveTab(initialTab || 'basic');
      setError('');
    }
  }, [user, isOpen, initialTab]);

  if (!isOpen || !user) return null;

  // Education Helpers
  const addEdu = () =>
    setEduList([
      ...eduList,
      { id: `edu-new-${Date.now()}-${Math.random()}`, degree: '', institution: '', start: '', end: '', gpa: '' }
    ]);
  const removeEdu = (id: string) => setEduList(eduList.filter((e) => e.id !== id));
  const updateEdu = (id: string, field: keyof Education, value: string) =>
    setEduList(eduList.map((e) => (e.id === id ? { ...e, [field]: value } : e)));

  // Experience Helpers
  const addExp = () =>
    setExpList([
      ...expList,
      { id: `exp-new-${Date.now()}-${Math.random()}`, title: '', company: '', start: '', end: '', desc: '' }
    ]);
  const removeExp = (id: string) => setExpList(expList.filter((e) => e.id !== id));
  const updateExp = (id: string, field: keyof Experience, value: string) =>
    setExpList(expList.map((e) => (e.id === id ? { ...e, [field]: value } : e)));

  // Project Helpers
  const addProj = () =>
    setProjList([
      ...projList,
      { id: `proj-new-${Date.now()}-${Math.random()}`, name: '', tech: '', desc: '', url: '' }
    ]);
  const removeProj = (id: string) => setProjList(projList.filter((p) => p.id !== id));
  const updateProj = (id: string, field: keyof Project, value: string) =>
    setProjList(projList.map((p) => (p.id === id ? { ...p, [field]: value } : p)));

  // Form Validation
  const validateForm = () => {
    if (!firstName || !lastName) {
      setError('First name and last name are required.');
      setActiveTab('basic');
      return false;
    }
    for (const e of eduList) {
      if (!e.degree || !e.institution) {
        setError('All education entries must have a degree and institution.');
        setActiveTab('edu-exp');
        return false;
      }
    }
    setError('');
    return true;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      // ── Sync skills from projects to core portfolio skills list ──
      const coreSkillsArray = skills.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
      const newSkillsToAppend: string[] = [];

      projList.forEach(p => {
        if (p.tech) {
          p.tech.split(',').map(s => s.trim()).filter(Boolean).forEach(skill => {
            const normalized = skill.toLowerCase();
            if (!coreSkillsArray.includes(normalized) && !newSkillsToAppend.map(ns => ns.toLowerCase()).includes(normalized)) {
              newSkillsToAppend.push(skill);
            }
          });
        }
      });

      let updatedSkills = skills;
      if (newSkillsToAppend.length > 0) {
        updatedSkills = skills ? `${skills}, ${newSkillsToAppend.join(', ')}` : newSkillsToAppend.join(', ');
      }

      const updateData: Partial<User> = {
        firstName,
        lastName,
        title,
        phone,
        linkedin,
        github,
        skills: updatedSkills,
        summary,
        education: eduList.map(({ id, ...e }) => e),
        experience: expList.map(({ id, ...e }) => e),
        projects: projList.map(({ id, ...p }) => p),
        portfolioSlug,
      };

      const res = await authApi.updateProfile(user._id!, updateData);
      
      // Update in-memory React Auth state
      updateUser(res.user);
      
      toast.success('Profile updated successfully! ✨', { autoClose: 2000 });
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (activeTab === 'basic') {
      if (!firstName || !lastName) {
        setError('First name and last name are required.');
        return;
      }
      setError('');
      setActiveTab('edu-exp');
    } else if (activeTab === 'edu-exp') {
      for (const e of eduList) {
        if (!e.degree || !e.institution) {
          setError('All education entries must have a degree and institution.');
          return;
        }
      }
      setError('');
      setActiveTab('projects');
    }
  };

  const handlePrev = () => {
    if (activeTab === 'edu-exp') {
      setActiveTab('basic');
    } else if (activeTab === 'projects') {
      setActiveTab('edu-exp');
    }
  };

  return (
    <div className="pf-modal-overlay" onClick={onClose}>
      <div className="pf-modal-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '650px', width: '95%', display: 'flex', flexDirection: 'column', maxHeight: '90vh', overflow: 'hidden' }}>
        
        {/* Header */}
        <div className="pf-modal-header" style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
          <h2 className="pf-modal-title">UPDATE PROFILE</h2>
          <button className="pf-modal-close" onClick={onClose}>×</button>
        </div>

        {/* Dynamic Tab Selector (Pivots) */}
        <div className="pf-modal-body" style={{ paddingBottom: '0.5rem' }}>
          <div className="modal-tabs">
            <button
              className={`modal-tab ${activeTab === 'basic' ? 'active' : ''}`}
              type="button"
              onClick={() => setActiveTab('basic')}
            >
              BASIC INFO
            </button>
            <button
              className={`modal-tab ${activeTab === 'edu-exp' ? 'active' : ''}`}
              type="button"
              onClick={() => setActiveTab('edu-exp')}
            >
              EDUCATION & EXP
            </button>
            <button
              className={`modal-tab ${activeTab === 'projects' ? 'active' : ''}`}
              type="button"
              onClick={() => setActiveTab('projects')}
            >
              PROJECTS
            </button>
          </div>

          {error && (
            <div className="error-msg" style={{ marginBottom: '1.25rem', fontSize: '0.85rem' }}>
              {error}
            </div>
          )}
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', flex: '1 1 auto', overflow: 'hidden' }}>
          <div className="pf-modal-body" style={{ flex: '1 1 auto', overflowY: 'auto', paddingTop: '0' }}>
            
            {/* TAB 1: BASIC INFO */}
            {activeTab === 'basic' && (
              <div>
                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <label className="pf-label">First Name <span style={{ color: 'var(--neon2)' }}>*</span></label>
                    <input className="pf-input" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Biswajit" />
                  </div>
                  <div className="col-6">
                    <label className="pf-label">Last Name <span style={{ color: 'var(--neon2)' }}>*</span></label>
                    <input className="pf-input" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Mohapatra" />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="pf-label">Professional Title</label>
                  <input className="pf-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Full Stack Developer & Data Engineer" />
                </div>

                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <label className="pf-label">Phone</label>
                    <input className="pf-input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" />
                  </div>
                  <div className="col-6">
                    <label className="pf-label">LinkedIn</label>
                    <input className="pf-input" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="linkedin.com/in/username" />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="pf-label">GitHub</label>
                  <input className="pf-input" value={github} onChange={(e) => setGithub(e.target.value)} placeholder="github.com/username" />
                </div>

                <div className="mb-3">
                  <label className="pf-label">Skills (comma-separated)</label>
                  <input className="pf-input" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="React, Node.js, TypeScript, Python" />
                </div>

                <div className="mb-3">
                  <label className="pf-label">Custom Portfolio Handle</label>
                  <input 
                    className="pf-input" 
                    value={portfolioSlug} 
                    onChange={(e) => setPortfolioSlug(e.target.value.toLowerCase().trim().replace(/[^a-z0-9-_]/g, ''))} 
                    placeholder="e.g. biswajit-mohapatra" 
                    style={{ fontFamily: 'Share Tech Mono, monospace', width: '100%' }}
                  />
                  
                  <div 
                    style={{ 
                      marginTop: '0.6rem',
                      padding: '0.75rem 1rem', 
                      background: 'rgba(255, 255, 255, 0.02)', 
                      border: '1px dashed var(--border)', 
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem',
                      flexWrap: 'wrap'
                    }}
                  >
                    <div style={{ wordBreak: 'break-all', fontFamily: 'Share Tech Mono, monospace', fontSize: '0.85rem', color: 'var(--text)' }}>
                      <span style={{ color: 'var(--neon)', marginRight: '0.5rem', fontWeight: 'bold' }}>🔗 LIVE URL:</span>
                      {window.location.origin}/portfolio/<span style={{ color: portfolioSlug ? 'var(--neon2)' : 'var(--muted)', fontWeight: portfolioSlug ? 'bold' : 'normal' }}>{portfolioSlug || 'your-slug-handle'}</span>
                    </div>
                    <button
                      type="button"
                      className="btn-neon"
                      onClick={() => {
                        const link = `${window.location.origin}/portfolio/${portfolioSlug}`;
                        navigator.clipboard.writeText(link);
                        toast.success('Portfolio link copied to clipboard! 📋');
                      }}
                      disabled={!portfolioSlug}
                      style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem', height: 'auto' }}
                    >
                      Copy Link
                    </button>
                  </div>
                  
                  <small style={{ color: 'var(--muted)', fontSize: '0.75rem', display: 'block', marginTop: '0.4rem' }}>
                    Configure a custom identifier above. Share this live URL with employers or clients to let them view your dynamic portfolio without signing up!
                  </small>
                </div>

                {/* OTP Protection (Disabled as requested) */}
                <div className="mb-3 p-3" style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border)', borderRadius: '4px' }}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <div className="pf-label" style={{ marginBottom: '0.1rem', color: 'var(--muted)' }}>OTP Protection (Inactive)</div>
                      <small style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>
                        Require an OTP verification code sent to your email to decrypt access to your public link.
                      </small>
                    </div>
                    <div className="form-check form-switch" style={{ cursor: 'not-allowed' }}>
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id="otpProtect" 
                        disabled 
                        style={{ cursor: 'not-allowed', width: '2.5em', height: '1.2em' }} 
                      />
                    </div>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--neon2)', marginTop: '0.5rem', fontFamily: 'Share Tech Mono, monospace' }}>
                    ⚠️ Email OTP Verification is coming soon! Disabled for this iteration.
                  </div>
                </div>

                <div className="mb-2">
                  <label className="pf-label">Summary / Bio</label>
                  <textarea className="pf-textarea" style={{ minHeight: '90px' }} value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Brief professional bio..." />
                </div>
              </div>
            )}

            {/* TAB 2: EDUCATION & EXPERIENCE */}
            {activeTab === 'edu-exp' && (
              <div>
                {/* EDUCATION SECTION */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span className="pf-label" style={{ fontSize: '0.9rem', color: 'var(--neon)' }}>Education Details</span>
                  <button type="button" className="btn-neon" style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem' }} onClick={addEdu}>
                    + Add New
                  </button>
                </div>

                {eduList.length === 0 ? (
                  <p style={{ color: 'var(--muted)', fontSize: '0.85rem', fontStyle: 'italic', marginBottom: '1.5rem' }}>
                    No education entries yet. Add one to optimize your ATS resume!
                  </p>
                ) : (
                  eduList.map((e) => (
                    <div key={e.id} className="entry-card" style={{ marginBottom: '1rem', position: 'relative' }}>
                      <button type="button" className="entry-remove" onClick={() => removeEdu(e.id)}>×</button>
                      <div className="row g-2">
                        <div className="col-6">
                          <label className="pf-label">Degree <span style={{ color: 'var(--neon2)' }}>*</span></label>
                          <input className="pf-input" value={e.degree} onChange={(ev) => updateEdu(e.id, 'degree', ev.target.value)} placeholder="B.Tech Computer Science" />
                        </div>
                        <div className="col-6">
                          <label className="pf-label">Institution <span style={{ color: 'var(--neon2)' }}>*</span></label>
                          <input className="pf-input" value={e.institution} onChange={(ev) => updateEdu(e.id, 'institution', ev.target.value)} placeholder="Stanford University" />
                        </div>
                        <div className="col-4">
                          <label className="pf-label">Start Year</label>
                          <input className="pf-input" value={e.start} onChange={(ev) => updateEdu(e.id, 'start', ev.target.value)} placeholder="2018" />
                        </div>
                        <div className="col-4">
                          <label className="pf-label">End Year</label>
                          <input className="pf-input" value={e.end} onChange={(ev) => updateEdu(e.id, 'end', ev.target.value)} placeholder="2022" />
                        </div>
                        <div className="col-4">
                          <label className="pf-label">GPA</label>
                          <input className="pf-input" value={e.gpa || ''} onChange={(ev) => updateEdu(e.id, 'gpa', ev.target.value)} placeholder="3.9/4.0" />
                        </div>
                      </div>
                    </div>
                  ))
                )}

                <hr className="section-divider" style={{ margin: '1.5rem 0' }} />

                {/* EXPERIENCE SECTION */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span className="pf-label" style={{ fontSize: '0.9rem', color: 'var(--neon2)' }}>Work Experience</span>
                  <button type="button" className="btn-pink" style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem' }} onClick={addExp}>
                    + Add New
                  </button>
                </div>

                {expList.length === 0 ? (
                  <p style={{ color: 'var(--muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>
                    No work experience entries yet. Add one to show on your resume!
                  </p>
                ) : (
                  expList.map((e) => (
                    <div key={e.id} className="entry-card" style={{ marginBottom: '1rem', position: 'relative' }}>
                      <button type="button" className="entry-remove" onClick={() => removeExp(e.id)}>×</button>
                      <div className="row g-2 mb-2">
                        <div className="col-6">
                          <label className="pf-label">Job Title</label>
                          <input className="pf-input" value={e.title} onChange={(ev) => updateExp(e.id, 'title', ev.target.value)} placeholder="Software Engineer" />
                        </div>
                        <div className="col-6">
                          <label className="pf-label">Company</label>
                          <input className="pf-input" value={e.company} onChange={(ev) => updateExp(e.id, 'company', ev.target.value)} placeholder="Google" />
                        </div>
                        <div className="col-6">
                          <label className="pf-label">Start Date</label>
                          <input className="pf-input" value={e.start} onChange={(ev) => updateExp(e.id, 'start', ev.target.value)} placeholder="Jan 2023" />
                        </div>
                        <div className="col-6">
                          <label className="pf-label">End Date</label>
                          <input className="pf-input" value={e.end} onChange={(ev) => updateExp(e.id, 'end', ev.target.value)} placeholder="Present" />
                        </div>
                      </div>
                      <label className="pf-label">Description (Enter each bullet point on a new line)</label>
                      <textarea className="pf-textarea" style={{ minHeight: '80px' }} value={e.desc} onChange={(ev) => updateExp(e.id, 'desc', ev.target.value)} placeholder="Led development of...&#10;Migrated databases resulting in...&#10;Mentored 3 junior developers..." />
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 3: PROJECTS */}
            {activeTab === 'projects' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span className="pf-label" style={{ fontSize: '0.9rem', color: 'var(--neon3)' }}>Portfolio Projects</span>
                  <button type="button" className="btn-yellow" style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', color: 'var(--neon3)' }} onClick={addProj}>
                    + Add New
                  </button>
                </div>

                {projList.length === 0 ? (
                  <p style={{ color: 'var(--muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>
                    No projects added yet. Add projects to display them dynamically on the Projects page!
                  </p>
                ) : (
                  projList.map((p) => (
                    <div key={p.id} className="entry-card" style={{ marginBottom: '1rem', position: 'relative' }}>
                      <button type="button" className="entry-remove" onClick={() => removeProj(p.id)}>×</button>
                      <div className="row g-2 mb-2">
                        <div className="col-6">
                          <label className="pf-label">Project Name</label>
                          <input className="pf-input" value={p.name} onChange={(ev) => updateProj(p.id, 'name', ev.target.value)} placeholder="AI Chat Engine" />
                        </div>
                        <div className="col-6">
                          <label className="pf-label">Tech Stack (comma-separated)</label>
                          <input className="pf-input" value={p.tech} onChange={(ev) => updateProj(p.id, 'tech', ev.target.value)} placeholder="React, Vite, OpenAI" />
                        </div>
                      </div>
                      <label className="pf-label">Description</label>
                      <textarea className="pf-textarea" style={{ minHeight: '80px' }} value={p.desc} onChange={(ev) => updateProj(p.id, 'desc', ev.target.value)} placeholder="A full-featured AI chat bot with in-memory message history..." />
                      
                      <label className="pf-label" style={{ marginTop: '0.5rem' }}>Demo / Repo URL</label>
                      <input className="pf-input" value={p.url || ''} onChange={(ev) => updateProj(p.id, 'url', ev.target.value)} placeholder="github.com/username/project" />
                    </div>
                  ))
                )}
              </div>
            )}

          </div>

          {/* Footer Action Buttons (Step-by-Step Wizard Layout) */}
          <div className="pf-modal-header" style={{ paddingTop: '1.25rem', paddingBottom: '1.25rem', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', borderTop: '1px solid var(--border)' }}>
            {activeTab === 'basic' && (
              <>
                <button type="button" className="btn-secondary" style={{ padding: '0.4rem 1.2rem', textTransform: 'uppercase', fontSize: '0.85rem' }} onClick={onClose}>
                  Cancel
                </button>
                <button type="button" className="btn-pink" style={{ padding: '0.4rem 1.5rem', textTransform: 'uppercase', fontSize: '0.85rem' }} onClick={handleNext}>
                  Next
                </button>
              </>
            )}

            {activeTab === 'edu-exp' && (
              <>
                <button type="button" className="btn-secondary" style={{ padding: '0.4rem 1.2rem', textTransform: 'uppercase', fontSize: '0.85rem' }} onClick={handlePrev}>
                  Prev
                </button>
                <button type="button" className="btn-secondary" style={{ padding: '0.4rem 1.2rem', textTransform: 'uppercase', fontSize: '0.85rem' }} onClick={onClose}>
                  Cancel
                </button>
                <button type="button" className="btn-pink" style={{ padding: '0.4rem 1.5rem', textTransform: 'uppercase', fontSize: '0.85rem' }} onClick={handleNext}>
                  Next
                </button>
              </>
            )}

            {activeTab === 'projects' && (
              <>
                <button type="button" className="btn-secondary" style={{ padding: '0.4rem 1.2rem', textTransform: 'uppercase', fontSize: '0.85rem' }} onClick={handlePrev}>
                  Prev
                </button>
                <button type="button" className="btn-secondary" style={{ padding: '0.4rem 1.2rem', textTransform: 'uppercase', fontSize: '0.85rem' }} onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="btn-pink" style={{ padding: '0.4rem 1.5rem', textTransform: 'uppercase', fontSize: '0.85rem' }} disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </>
            )}
          </div>
        </form>

      </div>
    </div>
  );
};

export default ProfileModal;
