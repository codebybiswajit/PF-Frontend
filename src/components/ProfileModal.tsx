import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/api';
import type { Education, Experience, Project, User, ResumeSkillGroup, ResumeLanguage, ResumeCertification } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'basic' | 'skills-pref' | 'edu-exp' | 'projects-certs';
}

interface EduEntry extends Education { id: string; }
interface ExpEntry extends Experience { id: string; }
interface ProjEntry extends Project { id: string; }

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, initialTab }) => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'basic' | 'skills-pref' | 'edu-exp' | 'projects-certs'>('basic');

  // Basic Info Form States
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [summary, setSummary] = useState('');
  const [portfolioSlug, setPortfolioSlug] = useState('');

  // Nested Contact Details Form States
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [locationState, setLocationState] = useState('');
  const [website, setWebsite] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  const [twitter, setTwitter] = useState('');

  // Preference Details Form States
  const [openToWork, setOpenToWork] = useState(false);
  const [availableFrom, setAvailableFrom] = useState('');
  const [interests, setInterests] = useState('');

  // Lists
  const [skillGroups, setSkillGroups] = useState<(ResumeSkillGroup & { skillsString?: string })[]>([]);
  const [languages, setLanguages] = useState<ResumeLanguage[]>([]);
  const [certifications, setCertifications] = useState<ResumeCertification[]>([]);
  const [eduList, setEduList] = useState<(EduEntry & { coursesString?: string })[]>([]);
  const [expList, setExpList] = useState<ExpEntry[]>([]);
  const [projList, setProjList] = useState<(ProjEntry & { techString?: string })[]>([]);

  // Initialize fields with current user profile data
  useEffect(() => {
    if (user && isOpen) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setTitle(user.title || '');
      setTagline(user.tagline || '');
      setSummary(user.summary || '');
      setPortfolioSlug(user.portfolioSlug || '');

      // Contact details lookup (fallback to flat fields)
      setEmail(user.contact?.email || user.email || '');
      setPhone(user.contact?.phone || user.phone || '');
      setLocationState(user.contact?.location || user.location || '');
      setWebsite(user.contact?.website || user.website || '');
      setLinkedin(user.contact?.linkedin || user.linkedin || '');
      setGithub(user.contact?.github || user.github || '');
      setTwitter(user.contact?.twitter || user.twitter || '');

      // Preferences lookup
      setOpenToWork(!!user.openToWork);
      setAvailableFrom(user.availableFrom || '');
      setInterests((user.interests || []).join(', '));

      // Lists lookup
      setSkillGroups(
        (user.skillGroups || []).map(s => ({
          ...s,
          skillsString: Array.isArray(s.skills) ? s.skills.join(', ') : ''
        }))
      );
      setLanguages(user.languages || []);
      setCertifications(user.certifications || []);

      setEduList(
        (user.education || []).map((e, index) => ({
          ...e,
          id: `edu-${Date.now()}-${index}-${Math.random()}`,
          coursesString: Array.isArray(e.courses) ? e.courses.join(', ') : ''
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
          id: `proj-${Date.now()}-${index}-${Math.random()}`,
          techString: Array.isArray(p.tech) ? p.tech.join(', ') : (typeof p.tech === 'string' ? p.tech : '')
        }))
      );
      setActiveTab(initialTab || 'basic');
      setError('');
    }
  }, [user, isOpen, initialTab]);

  if (!isOpen || !user) return null;

  // Skill Group Helpers
  const addSkillGroup = () =>
    setSkillGroups([
      ...skillGroups,
      { category: '', skills: [], skillsString: '' }
    ]);
  const removeSkillGroup = (index: number) => setSkillGroups(skillGroups.filter((_, i) => i !== index));
  const updateSkillGroup = (index: number, field: keyof ResumeSkillGroup, value: any) =>
    setSkillGroups(skillGroups.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  const updateSkillGroupSkills = (index: number, commaString: string) => {
    setSkillGroups(skillGroups.map((s, i) => (i === index ? { ...s, skillsString: commaString } : s)));
  };

  // Language Helpers
  const addLanguage = () =>
    setLanguages([
      ...languages,
      { language: '', proficiency: 'Professional' }
    ]);
  const removeLanguage = (index: number) => setLanguages(languages.filter((_, i) => i !== index));
  const updateLanguage = (index: number, field: keyof ResumeLanguage, value: any) =>
    setLanguages(languages.map((l, i) => (i === index ? { ...l, [field]: value } : l)));

  // Certification Helpers
  const addCert = () =>
    setCertifications([
      ...certifications,
      { name: '', issuer: '', date: '' }
    ]);
  const removeCert = (index: number) => setCertifications(certifications.filter((_, i) => i !== index));
  const updateCert = (index: number, field: keyof ResumeCertification, value: any) =>
    setCertifications(certifications.map((c, i) => (i === index ? { ...c, [field]: value } : c)));

  // Education Helpers
  const addEdu = () =>
    setEduList([
      ...eduList,
      { id: `edu-new-${Date.now()}-${Math.random()}`, degree: '', institution: '', start: '', end: '', gpa: '', field: '', location: '', honors: '', courses: [], coursesString: '' }
    ]);
  const removeEdu = (id: string) => setEduList(eduList.filter((e) => e.id !== id));
  const updateEdu = (id: string, field: keyof Education, value: any) =>
    setEduList(eduList.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  const updateEduCourses = (id: string, commaString: string) => {
    setEduList(eduList.map((e) => (e.id === id ? { ...e, coursesString: commaString } : e)));
  };

  // Experience Helpers
  const addExp = () =>
    setExpList([
      ...expList,
      { id: `exp-new-${Date.now()}-${Math.random()}`, title: '', company: '', start: '', end: '', desc: '', location: '', type: 'Full-time', summary: '', bullets: [], tech: [] }
    ]);
  const removeExp = (id: string) => setExpList(expList.filter((e) => e.id !== id));
  const updateExp = (id: string, field: keyof Experience, value: any) =>
    setExpList(expList.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  const updateExpBullets = (id: string, text: string) => {
    const list = text.split('\n').map(s => s.trim()).filter(Boolean);
    setExpList(expList.map((e) => (e.id === id ? { ...e, desc: text, bullets: list } : e)));
  };

  // Project Helpers
  const addProj = () =>
    setProjList([
      ...projList,
      { id: `proj-new-${Date.now()}-${Math.random()}`, name: '', tech: [], techString: '', desc: '', url: '', tagline: '', repo: '', highlights: [] }
    ]);
  const removeProj = (id: string) => setProjList(projList.filter((p) => p.id !== id));
  const updateProj = (id: string, field: keyof Project, value: any) =>
    setProjList(projList.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  const updateProjTech = (id: string, commaString: string) => {
    setProjList(projList.map((p) => (p.id === id ? { ...p, techString: commaString } : p)));
  };

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
      // Sync core/flat skills string by flattening all skills from skillGroups
      let flatSkillsString = '';
      if (skillGroups.length > 0) {
        flatSkillsString = skillGroups
          .flatMap(g => g.skillsString ? g.skillsString.split(',').map(s => s.trim()).filter(Boolean) : (g.skills || []))
          .filter(Boolean)
          .join(', ');
      }

      const updateData: Partial<User> = {
        firstName,
        lastName,
        title,
        tagline,
        summary,
        portfolioSlug,
        openToWork,
        availableFrom,
        interests: interests.split(',').map(i => i.trim()).filter(Boolean),
        skills: flatSkillsString,
        phone, // sync flat phone/linkedin/github for compatibility
        linkedin,
        github,
        contact: {
          email,
          phone,
          location: locationState,
          website,
          linkedin,
          github,
          twitter
        },
        skillGroups: skillGroups.map(s => ({
          category: s.category,
          skills: s.skillsString ? s.skillsString.split(',').map(str => str.trim()).filter(Boolean) : (s.skills || [])
        })),
        languages: languages.map(l => ({
          language: l.language,
          proficiency: l.proficiency
        })),
        certifications: certifications.map(c => ({
          name: c.name,
          issuer: c.issuer,
          date: c.date,
          credentialId: c.credentialId,
          url: c.url
        })),
        education: eduList.map(({ id, coursesString, ...e }) => ({
          ...e,
          courses: coursesString ? coursesString.split(',').map(s => s.trim()).filter(Boolean) : (e.courses || [])
        })),
        experience: expList.map(({ id, ...e }) => e),
        projects: projList.map(({ id, techString, ...p }) => {
          const techArray = techString
            ? techString.split(',').map(t => t.trim()).filter(Boolean)
            : (Array.isArray(p.tech) ? p.tech : []);
          return {
            ...p,
            tech: techArray
          };
        }),
      };

      const res = await authApi.updateProfile(user._id!, updateData);

      // Update in-memory React Auth state
      updateUser(res.user);

      toast.success('Profile & Portfolio details updated successfully! ✨', { autoClose: 2000 });
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
      setActiveTab('skills-pref');
    } else if (activeTab === 'skills-pref') {
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
      setActiveTab('projects-certs');
    }
  };

  const handlePrev = () => {
    if (activeTab === 'skills-pref') {
      setActiveTab('basic');
    } else if (activeTab === 'edu-exp') {
      setActiveTab('skills-pref');
    } else if (activeTab === 'projects-certs') {
      setActiveTab('edu-exp');
    }
  };

  return (
    <motion.div
      className="pf-modal-overlay"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
    >
      <motion.div
        className="pf-modal-box"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '950px', width: '95%', display: 'flex', flexDirection: 'column', maxHeight: '92vh', overflow: 'hidden' }}
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        {/* Header */}
        <div className="pf-modal-header" style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
          <h2 className="pf-modal-title">UPDATE PROFILE DETAILS</h2>
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
              Basic & Contact
            </button>
            <button
              className={`modal-tab ${activeTab === 'skills-pref' ? 'active' : ''}`}
              type="button"
              onClick={() => setActiveTab('skills-pref')}
            >
              Skills & Prefs
            </button>
            <button
              className={`modal-tab ${activeTab === 'edu-exp' ? 'active' : ''}`}
              type="button"
              onClick={() => setActiveTab('edu-exp')}
            >
              Education & Experience
            </button>
            <button
              className={`modal-tab ${activeTab === 'projects-certs' ? 'active' : ''}`}
              type="button"
              onClick={() => setActiveTab('projects-certs')}
            >
              Projects & Certs
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

            {/* TAB 1: BASIC INFO & CONTACT */}
            {activeTab === 'basic' && (
              <div className="row g-3">
                <div className="col-12">
                  <span className="pf-label" style={{ fontSize: '1rem', color: 'var(--neon)', display: 'block', marginBottom: '0.2rem' }}>Basic Credentials</span>
                </div>
                <div className="col-md-4">
                  <label className="pf-label">First Name <span style={{ color: 'var(--neon2)' }}>*</span></label>
                  <input className="pf-input" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Biswajit" />
                </div>
                <div className="col-md-4">
                  <label className="pf-label">Last Name <span style={{ color: 'var(--neon2)' }}>*</span></label>
                  <input className="pf-input" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Mohapatra" />
                </div>
                <div className="col-md-4">
                  <label className="pf-label">Professional Title</label>
                  <input className="pf-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Full Stack Developer & Data Engineer" />
                </div>

                <div className="col-12">
                  <label className="pf-label">Tagline</label>
                  <input className="pf-input" value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="Building systems that scale & experiences that delight." />
                </div>

                <div className="col-12">
                  <label className="pf-label">Custom Portfolio Handle</label>
                  <input
                    className="pf-input"
                    value={portfolioSlug}
                    onChange={(e) => setPortfolioSlug(e.target.value.toLowerCase().trim().replace(/[^a-z0-9-_]/g, ''))}
                    placeholder="e.g. biswajit-mohapatra"
                    style={{ fontFamily: 'Share Tech Mono, monospace', width: '100%' }}
                  />
                  <div style={{
                    marginTop: '0.5rem',
                    padding: '0.6rem 0.8rem',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px dashed var(--border)',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    flexWrap: 'wrap'
                  }}>
                    <div style={{ wordBreak: 'break-all', fontFamily: 'Share Tech Mono, monospace', fontSize: '0.8rem', color: 'var(--text)' }}>
                      <span style={{ color: 'var(--neon)', marginRight: '0.5rem', fontWeight: 'bold' }}>🔗 LIVE URL:</span>
                      {window.location.origin}/portfolio/<span style={{ color: portfolioSlug ? 'var(--neon2)' : 'var(--muted)', fontWeight: portfolioSlug ? 'bold' : 'normal' }}>{portfolioSlug || 'your-slug-handle'}</span>
                    </div>
                  </div>
                </div>

                <div className="col-12">
                  <label className="pf-label">Summary / Bio</label>
                  <textarea className="pf-textarea" style={{ minHeight: '90px' }} value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Brief professional bio summary..." />
                </div>

                <div className="col-12" style={{ marginTop: '1.5rem' }}>
                  <span className="pf-label" style={{ fontSize: '1rem', color: 'var(--neon2)', display: 'block', marginBottom: '0.2rem' }}>Contact Details</span>
                </div>
                <div className="col-md-4">
                  <label className="pf-label">Email</label>
                  <input type="email" className="pf-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" />
                </div>
                <div className="col-md-4">
                  <label className="pf-label">Phone</label>
                  <input className="pf-input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 80180 35461" />
                </div>
                <div className="col-md-4">
                  <label className="pf-label">Location</label>
                  <input className="pf-input" value={locationState} onChange={(e) => setLocationState(e.target.value)} placeholder="Odisha, India" />
                </div>
                <div className="col-md-3">
                  <label className="pf-label">Website</label>
                  <input className="pf-input" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="myportfolio.com" />
                </div>
                <div className="col-md-3">
                  <label className="pf-label">LinkedIn</label>
                  <input className="pf-input" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="linkedin.com/in/username" />
                </div>
                <div className="col-md-3">
                  <label className="pf-label">GitHub</label>
                  <input className="pf-input" value={github} onChange={(e) => setGithub(e.target.value)} placeholder="github.com/username" />
                </div>
                <div className="col-md-3">
                  <label className="pf-label">Twitter</label>
                  <input className="pf-input" value={twitter} onChange={(e) => setTwitter(e.target.value)} placeholder="twitter.com/username" />
                </div>
              </div>
            )}

            {/* TAB 2: SKILLS & PREFERENCES */}
            {activeTab === 'skills-pref' && (
              <div className="row g-3">
                {/* DYNAMIC SKILL GROUPS */}
                <div className="col-12">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span className="pf-label" style={{ fontSize: '1rem', color: 'var(--neon3)' }}>Skill Groups</span>
                    <button type="button" className="btn-yellow" style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', height: 'auto', color: 'var(--neon3)' }} onClick={addSkillGroup}>
                      + Add Group
                    </button>
                  </div>

                  {skillGroups.length === 0 ? (
                    <p style={{ color: 'var(--muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>
                      No skill groups yet. Add some to display grouped skills on your profile!
                    </p>
                  ) : (
                    <div className="row g-2">
                      {skillGroups.map((s, index) => (
                        <div key={index} className="col-md-6">
                          <div className="entry-card" style={{ position: 'relative', padding: '0.8rem' }}>
                            <button type="button" className="entry-remove" onClick={() => removeSkillGroup(index)}>×</button>
                            <div className="row g-2">
                              <div className="col-6">
                                <label className="pf-label">Group Category</label>
                                <input
                                  className="pf-input"
                                  value={s.category}
                                  onChange={(ev) => updateSkillGroup(index, 'category', ev.target.value)}
                                  placeholder="e.g. Frontend"
                                />
                              </div>
                              <div className="col-6">
                                <label className="pf-label">Skills (comma-separated)</label>
                                <input
                                  className="pf-input"
                                  value={s.skillsString !== undefined ? s.skillsString : (Array.isArray(s.skills) ? s.skills.join(', ') : '')}
                                  onChange={(ev) => updateSkillGroupSkills(index, ev.target.value)}
                                  placeholder="React, Vue, HTML"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* LANGUAGES */}
                <div className="col-md-6" style={{ marginTop: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                    <span className="pf-label" style={{ fontSize: '1rem', color: 'var(--neon)' }}>Languages</span>
                    <button type="button" className="btn-neon" style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem', height: 'auto' }} onClick={addLanguage}>
                      + Add Language
                    </button>
                  </div>
                  {languages.length === 0 ? (
                    <p style={{ color: 'var(--muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>No languages added.</p>
                  ) : (
                    languages.map((l, index) => (
                      <div key={index} className="entry-card mb-2" style={{ position: 'relative', padding: '0.6rem 0.8rem' }}>
                        <button type="button" className="entry-remove" onClick={() => removeLanguage(index)}>×</button>
                        <div className="row g-2">
                          <div className="col-6">
                            <label className="pf-label">Language</label>
                            <input className="pf-input" value={l.language} onChange={(ev) => updateLanguage(index, 'language', ev.target.value)} placeholder="English" />
                          </div>
                          <div className="col-6">
                            <label className="pf-label">Proficiency</label>
                            <select className="pf-input" value={l.proficiency} onChange={(ev) => updateLanguage(index, 'proficiency', ev.target.value)}>
                              <option value="Native">Native</option>
                              <option value="Fluent">Fluent</option>
                              <option value="Professional">Professional</option>
                              <option value="Conversational">Conversational</option>
                              <option value="Basic">Basic</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* PREFERENCES & INTERESTS */}
                <div className="col-md-6" style={{ marginTop: '1.5rem' }}>
                  <span className="pf-label" style={{ fontSize: '1rem', color: 'var(--neon2)', display: 'block', marginBottom: '0.8rem' }}>Preferences & Interests</span>

                  <div className="mb-2">
                    <label className="pf-label">Interests (comma-separated)</label>
                    <input className="pf-input" value={interests} onChange={(e) => setInterests(e.target.value)} placeholder="Open Source, Tech Blogging" />
                  </div>

                  <div className="mb-2 p-2" style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border)', borderRadius: '4px' }}>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <div className="pf-label" style={{ marginBottom: '0.1rem', color: 'var(--text)', fontSize: '0.85rem' }}>Open to Work</div>
                        <small style={{ color: 'var(--muted)', fontSize: '0.7rem' }}>Show your recruitment status on your profile & resume.</small>
                      </div>
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="openToWorkModal"
                          checked={openToWork}
                          onChange={(e) => setOpenToWork(e.target.checked)}
                          style={{ width: '2.2em', height: '1.1em', cursor: 'pointer' }}
                        />
                      </div>
                    </div>
                  </div>

                  {openToWork && (
                    <div className="mb-2">
                      <label className="pf-label">Available From</label>
                      <input className="pf-input" value={availableFrom} onChange={(e) => setAvailableFrom(e.target.value)} placeholder="Immediately" />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: EDUCATION & EXPERIENCE */}
            {activeTab === 'edu-exp' && (
              <div>
                {/* EDUCATION */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span className="pf-label" style={{ fontSize: '1rem', color: 'var(--neon)' }}>Education Details</span>
                  <button type="button" className="btn-neon" style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem' }} onClick={addEdu}>
                    + Add Education
                  </button>
                </div>

                {eduList.length === 0 ? (
                  <p style={{ color: 'var(--muted)', fontSize: '0.85rem', fontStyle: 'italic', marginBottom: '1.5rem' }}>
                    No education entries yet. Add one to show on your ATS resume!
                  </p>
                ) : (
                  eduList.map((e) => (
                    <div key={e.id} className="entry-card" style={{ marginBottom: '1rem', position: 'relative' }}>
                      <button type="button" className="entry-remove" onClick={() => removeEdu(e.id)}>×</button>
                      <div className="row g-2">
                        <div className="col-md-4">
                          <label className="pf-label">Degree <span style={{ color: 'var(--neon2)' }}>*</span></label>
                          <input className="pf-input" value={e.degree} onChange={(ev) => updateEdu(e.id, 'degree', ev.target.value)} placeholder="B.Tech Computer Science" />
                        </div>
                        <div className="col-md-4">
                          <label className="pf-label">Field of Study</label>
                          <input className="pf-input" value={e.field || ''} onChange={(ev) => updateEdu(e.id, 'field', ev.target.value)} placeholder="Computer Science" />
                        </div>
                        <div className="col-md-4">
                          <label className="pf-label">Institution <span style={{ color: 'var(--neon2)' }}>*</span></label>
                          <input className="pf-input" value={e.institution} onChange={(ev) => updateEdu(e.id, 'institution', ev.target.value)} placeholder="Stanford University" />
                        </div>
                        <div className="col-md-4">
                          <label className="pf-label">Location</label>
                          <input className="pf-input" value={e.location || ''} onChange={(ev) => updateEdu(e.id, 'location', ev.target.value)} placeholder="Stanford, CA" />
                        </div>
                        <div className="col-md-2">
                          <label className="pf-label">Start Year</label>
                          <input className="pf-input" value={e.start} onChange={(ev) => updateEdu(e.id, 'start', ev.target.value)} placeholder="2018" />
                        </div>
                        <div className="col-md-2">
                          <label className="pf-label">End Year</label>
                          <input className="pf-input" value={e.end} onChange={(ev) => updateEdu(e.id, 'end', ev.target.value)} placeholder="2022" />
                        </div>
                        <div className="col-md-2">
                          <label className="pf-label">GPA</label>
                          <input className="pf-input" value={e.gpa || ''} onChange={(ev) => updateEdu(e.id, 'gpa', ev.target.value)} placeholder="3.9/4.0" />
                        </div>
                        <div className="col-md-2">
                          <label className="pf-label">Honors</label>
                          <input className="pf-input" value={e.honors || ''} onChange={(ev) => updateEdu(e.id, 'honors', ev.target.value)} placeholder="Cum Laude" />
                        </div>
                        <div className="col-12">
                          <label className="pf-label">Courses (comma-separated)</label>
                          <input className="pf-input" value={e.coursesString !== undefined ? e.coursesString : (Array.isArray(e.courses) ? e.courses.join(', ') : '')} onChange={(ev) => updateEduCourses(e.id, ev.target.value)} placeholder="Data Structures, Algorithms" />
                        </div>
                      </div>
                    </div>
                  ))
                )}

                <hr className="section-divider" style={{ margin: '1.5rem 0' }} />

                {/* EXPERIENCE */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span className="pf-label" style={{ fontSize: '1rem', color: 'var(--neon2)' }}>Work Experience</span>
                  <button type="button" className="btn-pink" style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem' }} onClick={addExp}>
                    + Add Experience
                  </button>
                </div>

                {expList.length === 0 ? (
                  <p style={{ color: 'var(--muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>
                    No work experience entries yet. Add one to show on your profile!
                  </p>
                ) : (
                  expList.map((e) => (
                    <div key={e.id} className="entry-card" style={{ marginBottom: '1rem', position: 'relative' }}>
                      <button type="button" className="entry-remove" onClick={() => removeExp(e.id)}>×</button>
                      <div className="row g-2 mb-2">
                        <div className="col-md-4">
                          <label className="pf-label">Job Title</label>
                          <input className="pf-input" value={e.title} onChange={(ev) => updateExp(e.id, 'title', ev.target.value)} placeholder="Software Engineer" />
                        </div>
                        <div className="col-md-4">
                          <label className="pf-label">Company</label>
                          <input className="pf-input" value={e.company} onChange={(ev) => updateExp(e.id, 'company', ev.target.value)} placeholder="Google" />
                        </div>
                        <div className="col-md-4">
                          <label className="pf-label">Location</label>
                          <input className="pf-input" value={e.location || ''} onChange={(ev) => updateExp(e.id, 'location', ev.target.value)} placeholder="Remote" />
                        </div>
                        <div className="col-md-4">
                          <label className="pf-label">Job Type</label>
                          <select className="pf-input" value={e.type || 'Full-time'} onChange={(ev) => updateExp(e.id, 'type', ev.target.value)}>
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Contract">Contract</option>
                            <option value="Internship">Internship</option>
                            <option value="Freelance">Freelance</option>
                          </select>
                        </div>
                        <div className="col-md-4">
                          <label className="pf-label">Start Date</label>
                          <input className="pf-input" value={e.start} onChange={(ev) => updateExp(e.id, 'start', ev.target.value)} placeholder="Jan 2023" />
                        </div>
                        <div className="col-md-4">
                          <label className="pf-label">End Date</label>
                          <input className="pf-input" value={e.end} onChange={(ev) => updateExp(e.id, 'end', ev.target.value)} placeholder="Present" />
                        </div>
                      </div>
                      <label className="pf-label">Description (Enter each bullet point on a new line)</label>
                      <textarea className="pf-textarea" style={{ minHeight: '80px' }} value={e.desc || ''} onChange={(ev) => updateExpBullets(e.id, ev.target.value)} placeholder="Led development of...&#10;Migrated databases resulting in...&#10;Mentored 3 junior developers..." />
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 4: PROJECTS & CERTIFICATIONS */}
            {activeTab === 'projects-certs' && (
              <div>
                {/* PROJECTS */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span className="pf-label" style={{ fontSize: '1rem', color: 'var(--neon3)' }}>Portfolio Projects</span>
                  <button type="button" className="btn-yellow" style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', color: 'var(--neon3)' }} onClick={addProj}>
                    + Add Project
                  </button>
                </div>

                {projList.length === 0 ? (
                  <p style={{ color: 'var(--muted)', fontSize: '0.85rem', fontStyle: 'italic', marginBottom: '1.5rem' }}>
                    No projects added yet. Add projects to display them on your portfolio page!
                  </p>
                ) : (
                  projList.map((p) => (
                    <div key={p.id} className="entry-card mb-3" style={{ position: 'relative' }}>
                      <button type="button" className="entry-remove" onClick={() => removeProj(p.id)}>×</button>
                      <div className="row g-2 mb-2">
                        <div className="col-md-4">
                          <label className="pf-label">Project Name</label>
                          <input className="pf-input" value={p.name} onChange={(ev) => updateProj(p.id, 'name', ev.target.value)} placeholder="AI Chat Engine" />
                        </div>
                        <div className="col-md-4">
                          <label className="pf-label">Tagline</label>
                          <input className="pf-input" value={p.tagline || ''} onChange={(ev) => updateProj(p.id, 'tagline', ev.target.value)} placeholder="Next-gen chatbot" />
                        </div>
                        <div className="col-md-4">
                          <label className="pf-label">Tech Stack (comma-separated)</label>
                          <input
                            className="pf-input"
                            value={p.techString !== undefined ? p.techString : (Array.isArray(p.tech) ? p.tech.join(', ') : '')}
                            onChange={(ev) => updateProjTech(p.id, ev.target.value)}
                            placeholder="React, Vite, OpenAI"
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="pf-label">Demo URL</label>
                          <input className="pf-input" value={p.url || ''} onChange={(ev) => updateProj(p.id, 'url', ev.target.value)} placeholder="myproject.com" />
                        </div>
                        <div className="col-md-6">
                          <label className="pf-label">Repository URL</label>
                          <input className="pf-input" value={p.repo || ''} onChange={(ev) => updateProj(p.id, 'repo', ev.target.value)} placeholder="github.com/username/project" />
                        </div>
                        <div className="col-12">
                          <label className="pf-label">Description</label>
                          <textarea className="pf-textarea" style={{ minHeight: '70px' }} value={p.desc} onChange={(ev) => updateProj(p.id, 'desc', ev.target.value)} placeholder="A full-featured AI chat bot with in-memory message history..." />
                        </div>
                      </div>
                    </div>
                  ))
                )}

                <hr className="section-divider" style={{ margin: '1.5rem 0' }} />

                {/* CERTIFICATIONS */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span className="pf-label" style={{ fontSize: '1rem', color: 'var(--neon)' }}>Certifications</span>
                  <button type="button" className="btn-neon" style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem' }} onClick={addCert}>
                    + Add Certification
                  </button>
                </div>

                {certifications.length === 0 ? (
                  <p style={{ color: 'var(--muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>No certifications added.</p>
                ) : (
                  certifications.map((c, index) => (
                    <div key={index} className="entry-card mb-2" style={{ position: 'relative', padding: '0.8rem' }}>
                      <button type="button" className="entry-remove" onClick={() => removeCert(index)}>×</button>
                      <div className="row g-2">
                        <div className="col-md-4">
                          <label className="pf-label">Certification Name</label>
                          <input className="pf-input" value={c.name} onChange={(ev) => updateCert(index, 'name', ev.target.value)} placeholder="AWS Certified Solutions Architect" />
                        </div>
                        <div className="col-md-4">
                          <label className="pf-label">Issuer</label>
                          <input className="pf-input" value={c.issuer} onChange={(ev) => updateCert(index, 'issuer', ev.target.value)} placeholder="Amazon Web Services" />
                        </div>
                        <div className="col-md-4">
                          <label className="pf-label">Date</label>
                          <input className="pf-input" value={c.date || ''} onChange={(ev) => updateCert(index, 'date', ev.target.value)} placeholder="Jan 2024" />
                        </div>
                        <div className="col-md-6">
                          <label className="pf-label">Credential ID</label>
                          <input className="pf-input" value={c.credentialId || ''} onChange={(ev) => updateCert(index, 'credentialId', ev.target.value)} placeholder="AWS-12345" />
                        </div>
                        <div className="col-md-6">
                          <label className="pf-label">Verification URL</label>
                          <input className="pf-input" value={c.url || ''} onChange={(ev) => updateCert(index, 'url', ev.target.value)} placeholder="aws.amazon.com/verification" />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

          </div>

          {/* Footer Action Buttons (Step-by-Step Wizard Layout) */}
          <div style={{ padding: '1.25rem 1.5rem', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', borderTop: '1px solid var(--border)', marginTop: 'auto' }}>
            {activeTab !== 'basic' && (
              <button type="button" className="btn-secondary" style={{ padding: '0.4rem 1.2rem', textTransform: 'uppercase', fontSize: '0.85rem' }} onClick={handlePrev}>
                Prev
              </button>
            )}
            
            <button type="button" className="btn-secondary" style={{ padding: '0.4rem 1.2rem', textTransform: 'uppercase', fontSize: '0.85rem' }} onClick={onClose}>
              Cancel
            </button>

            {activeTab !== 'projects-certs' ? (
              <button key="next-btn" type="button" className="btn-pink" style={{ padding: '0.4rem 1.5rem', textTransform: 'uppercase', fontSize: '0.85rem' }} onClick={handleNext}>
                Next
              </button>
            ) : (
              <button key="save-btn" type="submit" className="btn-pink" style={{ padding: '0.4rem 1.5rem', textTransform: 'uppercase', fontSize: '0.85rem' }} disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            )}
          </div>
        </form>

      </motion.div>
    </motion.div>
  );
};

export default ProfileModal;
