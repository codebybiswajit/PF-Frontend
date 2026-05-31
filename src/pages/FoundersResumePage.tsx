import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { usePublicPortfolio } from '../context/PublicPortfolioContext';
import { FOUNDER_USER_ID } from '../data/portfolioData';
import type {
  ResumeEducation,
  ResumeExperience,
  ResumeProject,
  ResumeSkillGroup,
  ResumeCertification,
  ResumeLanguage
} from '../types';

const FoundersResumePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { founderUser } = usePublicPortfolio();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'basic-contact' | 'skills-interests' | 'exp-certs' | 'edu-projects'>('basic-contact');

  const TABS: ('basic-contact' | 'skills-interests' | 'exp-certs' | 'edu-projects')[] = [
    'basic-contact',
    'skills-interests',
    'exp-certs',
    'edu-projects'
  ];
  const currentTabIndex = TABS.indexOf(activeTab);

  // Basic Info Form States
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [summary, setSummary] = useState('');

  // Contact Details Form States
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [locationState, setLocationState] = useState('');
  const [website, setWebsite] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  const [twitter, setTwitter] = useState('');

  // Preferences Form States
  const [openToWork, setOpenToWork] = useState(false);
  const [availableFrom, setAvailableFrom] = useState('');

  // Interests (Comma Separated)
  const [interests, setInterests] = useState('');

  // Complex Sub-document States (Lists - strictly mapped without IDs)
  const [skills, setSkills] = useState<(ResumeSkillGroup & { skillsString?: string })[]>([]);
  const [languages, setLanguages] = useState<ResumeLanguage[]>([]);
  const [certifications, setCertifications] = useState<ResumeCertification[]>([]);
  const [eduList, setEduList] = useState<(ResumeEducation & { coursesString?: string })[]>([]);
  const [expList, setExpList] = useState<(ResumeExperience & { desc?: string })[]>([]);
  const [projList, setProjList] = useState<(ResumeProject & { techString?: string })[]>([]);

  // Redirect logged-in users to /my-resume
  useEffect(() => {
    if (user) {
      toast.info('Logged-in users can update their profiles directly via the Profile Modal! Redirecting... 📄');
      navigate('/my-resume');
    }
  }, [user, navigate]);

  // Initialize form fields strictly from Dynamic DB record (user || founderUser) or seed fallback from RESUME_DATA
  useEffect(() => {
    const activeSource = user || founderUser;
    const hasDbData = activeSource && (activeSource.summary || activeSource.title || (activeSource.experience && activeSource.experience.length > 0) || (activeSource.projects && activeSource.projects.length > 0));
    const source = hasDbData ? activeSource :null;

    if (source) {
      // Basic
      setFirstName(source.firstName || '');
      setLastName(source.lastName || '');
      setTitle(source.title || '');
      setTagline(source.tagline || '');
      setSummary(source.summary || '');

      // Contact
      const contactSource = (source.contact || {}) as any;
      const flatSource = source as any;
      setEmail(contactSource.email || flatSource.email || '');
      setPhone(contactSource.phone || flatSource.phone || '');
      setLocationState(contactSource.location || flatSource.location || '');
      setWebsite(contactSource.website || flatSource.website || '');
      setLinkedin(contactSource.linkedin || flatSource.linkedin || '');
      setGithub(contactSource.github || flatSource.github || '');
      setTwitter(contactSource.twitter || flatSource.twitter || '');

      // Preferences
      setOpenToWork(!!source.openToWork);
      setAvailableFrom(source.availableFrom || '');

      // Interests
      setInterests(Array.isArray(source.interests) ? source.interests.join(', ') : '');

      // Lists
      setSkills(
        (source.skillGroups || []).map((s: any) => ({
          ...s,
          skillsString: Array.isArray(s.skills) ? s.skills.join(', ') : ''
        }))
      );
      setLanguages(source.languages || []);
      setCertifications(source.certifications || []);

      setEduList(
        (source.education || []).map((e: any) => ({
          ...e,
          coursesString: Array.isArray(e.courses) ? e.courses.join(', ') : ''
        }))
      );
      setExpList(
        (source.experience || []).map((e: any) => ({
          ...e,
          desc: e.desc || (e.bullets || []).join('\n')
        }))
      );
      setProjList(
        (source.projects || []).map((p: any) => ({
          ...p,
          techString: Array.isArray(p.tech) ? p.tech.join(', ') : (typeof p.tech === 'string' ? p.tech : '')
        }))
      );
    }
    setError('');
  }, [user, founderUser]);

  // Skill Group Helpers (Index Based)
  const addSkillGroup = () =>
    setSkills([
      ...skills,
      { category: '', skills: [], skillsString: '' }
    ]);
  const removeSkillGroup = (index: number) => setSkills(skills.filter((_, i) => i !== index));
  const updateSkillGroup = (index: number, field: keyof ResumeSkillGroup, value: any) =>
    setSkills(skills.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  const updateSkillGroupSkills = (index: number, commaString: string) => {
    setSkills(skills.map((s, i) => (i === index ? { ...s, skillsString: commaString } : s)));
  };

  // Language Helpers (Index Based)
  const addLanguage = () =>
    setLanguages([
      ...languages,
      { language: '', proficiency: 'Professional' }
    ]);
  const removeLanguage = (index: number) => setLanguages(languages.filter((_, i) => i !== index));
  const updateLanguage = (index: number, field: keyof ResumeLanguage, value: any) =>
    setLanguages(languages.map((l, i) => (i === index ? { ...l, [field]: value } : l)));

  // Certification Helpers (Index Based)
  const addCert = () =>
    setCertifications([
      ...certifications,
      { name: '', issuer: '', date: '' }
    ]);
  const removeCert = (index: number) => setCertifications(certifications.filter((_, i) => i !== index));
  const updateCert = (index: number, field: keyof ResumeCertification, value: any) =>
    setCertifications(certifications.map((c, i) => (i === index ? { ...c, [field]: value } : c)));

  // Education Helpers (Index Based)
  const addEdu = () =>
    setEduList([
      ...eduList,
      { degree: '', institution: '', start: '', end: '', gpa: '', field: '', location: '', honors: '', courses: [], coursesString: '' }
    ]);
  const removeEdu = (index: number) => setEduList(eduList.filter((_, i) => i !== index));
  const updateEdu = (index: number, field: keyof ResumeEducation, value: any) =>
    setEduList(eduList.map((e, i) => (i === index ? { ...e, [field]: value } : e)));
  const updateEduCourses = (index: number, commaString: string) => {
    setEduList(eduList.map((e, i) => (i === index ? { ...e, coursesString: commaString } : e)));
  };

  // Experience Helpers (Index Based)
  const addExp = () =>
    setExpList([
      ...expList,
      { title: '', company: '', location: '', type: 'Full-time', start: '', end: '', bullets: [], desc: '' }
    ]);
  const removeExp = (index: number) => setExpList(expList.filter((_, i) => i !== index));
  const updateExp = (index: number, field: keyof ResumeExperience | 'desc', value: any) =>
    setExpList(expList.map((e, i) => (i === index ? { ...e, [field]: value } : e)));

  // Project Helpers (Index Based)
  const addProj = () =>
    setProjList([
      ...projList,
      { name: '', tech: [], techString: '', desc: '' }
    ]);
  const removeProj = (index: number) => setProjList(projList.filter((_, i) => i !== index));
  const updateProj = (index: number, field: keyof ResumeProject, value: any) =>
    setProjList(projList.map((p, i) => (i === index ? { ...p, [field]: value } : p)));
  const updateProjTech = (index: number, commaString: string) => {
    setProjList(projList.map((p, i) => (i === index ? { ...p, techString: commaString } : p)));
  };

  const validateForm = () => {
    if (!firstName || !lastName || !title || !summary) {
      setError('First Name, Last Name, Title, and Professional Summary are required.');
      setActiveTab('basic-contact');
      return false;
    }
    setError('');
    return true;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const dbPayload: any = {
        userId: FOUNDER_USER_ID || undefined,
        firstName,
        lastName,
        title,
        tagline: tagline || undefined,
        summary,
        contact: {
          email,
          phone,
          location: locationState,
          website,
          linkedin,
          github,
          twitter: twitter || undefined
        },
        openToWork,
        availableFrom: availableFrom || undefined,
        interests: interests.split(',').map(i => i.trim()).filter(Boolean),
        skillGroups: skills.map((s: any) => ({
          category: s.category,
          skills: s.skillsString ? s.skillsString.split(',').map((str: string) => str.trim()).filter(Boolean) : (s.skills || [])
        })),
        languages: languages.map((l: ResumeLanguage) => ({
          language: l.language,
          proficiency: l.proficiency
        })),
        certifications: certifications.map((c: ResumeCertification) => ({
          name: c.name,
          issuer: c.issuer,
          date: c.date
        })),
        education: eduList.map((ed: any) => ({
          degree: ed.degree,
          field: ed.field || '',
          institution: ed.institution,
          location: ed.location || '',
          start: ed.start,
          end: ed.end,
          gpa: ed.gpa || '',
          honors: ed.honors || '',
          courses: ed.coursesString ? ed.coursesString.split(',').map((str: string) => str.trim()).filter(Boolean) : (ed.courses || [])
        })),
        experience: expList.map((ex) => ({
          title: ex.title,
          company: ex.company,
          location: ex.location || '',
          type: ex.type || 'Full-time',
          start: ex.start,
          end: ex.end,
          bullets: ex.desc ? ex.desc.split('\n').map((b: string) => b.trim()).filter(Boolean) : []
        })),
        projects: projList.map((pr: any) => ({
          name: pr.name,
          tech: pr.techString ? pr.techString.split(',').map((str: string) => str.trim()).filter(Boolean) : (Array.isArray(pr.tech) ? pr.tech : []),
          desc: pr.desc,
          url: pr.url || ''
        }))
      };

      const res = await api.post('resume', dbPayload);
      if (res.data && res.data.resume) {
        updateUser(res.data.resume);
      }

      toast.success('Resume details saved successfully! ✨', { autoClose: 2000 });
      navigate('/my-resume');
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ paddingTop: '100px', paddingBottom: '3rem', minHeight: '100vh', position: 'relative', zIndex: 1 }}>
      <div className="container" style={{ maxWidth: '1200px' }}>
        <motion.div
          className="auth-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ padding: '2.5rem', width: '100%', maxWidth: '100%' }}
        >
          <div className="auth-title">EDIT RESUME DETAILS</div>
          <div className="auth-sub" style={{ marginBottom: '2rem' }}>
            Modify details. All fields strictly map to your global RESUME_DATA definition.
          </div>

          {/* Pivot Tabs */}
          <div className="modal-tabs" style={{ marginBottom: '2rem' }}>
            <button
              className={`modal-tab ${activeTab === 'basic-contact' ? 'active' : ''}`}
              type="button"
              onClick={() => setActiveTab('basic-contact')}
            >
              Basic & Contact
            </button>
            <button
              className={`modal-tab ${activeTab === 'skills-interests' ? 'active' : ''}`}
              type="button"
              onClick={() => setActiveTab('skills-interests')}
            >
              Skills & Preferences
            </button>
            <button
              className={`modal-tab ${activeTab === 'exp-certs' ? 'active' : ''}`}
              type="button"
              onClick={() => setActiveTab('exp-certs')}
            >
              Experience & Certs
            </button>
            <button
              className={`modal-tab ${activeTab === 'edu-projects' ? 'active' : ''}`}
              type="button"
              onClick={() => setActiveTab('edu-projects')}
            >
              Education & Projects
            </button>
          </div>

          {error && (
            <div className="error-msg" style={{ marginBottom: '1.5rem', fontSize: '0.85rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSave}>

            {/* TAB 1: BASIC & CONTACT */}
            {activeTab === 'basic-contact' && (
              <div className="row g-4">
                <div className="col-md-12">
                  <span className="pf-label" style={{ fontSize: '1.1rem', color: 'var(--neon)', display: 'block', marginBottom: '0.5rem' }}>Basic Credentials</span>
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
                  <label className="pf-label">Professional Title <span style={{ color: 'var(--neon2)' }}>*</span></label>
                  <input className="pf-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Full Stack Developer" />
                </div>

                <div className="col-md-12">
                  <label className="pf-label">Tagline</label>
                  <input className="pf-input" value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="Building systems that scale & experiences that delight." />
                </div>
                <div className="col-md-12">
                  <label className="pf-label">Professional Summary <span style={{ color: 'var(--neon2)' }}>*</span></label>
                  <textarea className="pf-textarea" style={{ minHeight: '100px' }} value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Brief professional bio summary..." />
                </div>

                <div className="col-md-12" style={{ marginTop: '2rem' }}>
                  <span className="pf-label" style={{ fontSize: '1.1rem', color: 'var(--neon2)', display: 'block', marginBottom: '0.5rem' }}>Contact Details</span>
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
            {activeTab === 'skills-interests' && (
              <div className="row g-4">
                {/* DYNAMIC SKILL GROUPS */}
                <div className="col-md-12">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <span className="pf-label" style={{ fontSize: '1.1rem', color: 'var(--neon3)' }}>Skill Groups</span>
                    <button type="button" className="btn-yellow" style={{ fontSize: '0.8rem', padding: '0.3rem 0.8rem', height: 'auto', color: 'var(--neon3)' }} onClick={addSkillGroup}>
                      + Add Skill Group
                    </button>
                  </div>

                  {skills.length === 0 ? (
                    <p style={{ color: 'var(--muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>
                      No skill groups yet. Add some to display on your resume!
                    </p>
                  ) : (
                    <div className="row g-4">
                      {skills.map((s, index) => (
                        <div key={index} className="col-md-6">
                          <div className="entry-card" style={{ position: 'relative' }}>
                            <button type="button" className="entry-remove" onClick={() => removeSkillGroup(index)}>×</button>
                            <div className="row g-3">
                              <div className="col-md-6">
                                <label className="pf-label">Category Name</label>
                                <input
                                  className="pf-input"
                                  value={s.category}
                                  onChange={(ev) => {
                                    updateSkillGroup(index, 'category', ev.target.value);
                                  }}
                                  placeholder="e.g. Frontend"
                                />
                              </div>
                              <div className="col-md-6">
                                <label className="pf-label">Skills (comma-separated)</label>
                                <input
                                  className="pf-input"
                                  value={s.skillsString !== undefined ? s.skillsString : (Array.isArray(s.skills) ? s.skills.join(', ') : '')}
                                  onChange={(ev) => updateSkillGroupSkills(index, ev.target.value)}
                                  placeholder="React, Vue, HTML, CSS"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* LANGUAGES LIST */}
                <div className="col-md-6" style={{ marginTop: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span className="pf-label" style={{ fontSize: '1.1rem', color: 'var(--neon)' }}>Languages</span>
                    <button type="button" className="btn-neon" style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', height: 'auto' }} onClick={addLanguage}>
                      + Add Language
                    </button>
                  </div>
                  {languages.length === 0 ? (
                    <p style={{ color: 'var(--muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>No languages added.</p>
                  ) : (
                    languages.map((l, index) => (
                      <div key={index} className="entry-card mb-2" style={{ position: 'relative', padding: '1rem' }}>
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
                <div className="col-md-6" style={{ marginTop: '2rem' }}>
                  <span className="pf-label" style={{ fontSize: '1.1rem', color: 'var(--neon2)', display: 'block', marginBottom: '1rem' }}>Interests & Preferences</span>

                  <div className="mb-3">
                    <label className="pf-label">Interests (comma-separated)</label>
                    <input className="pf-input" value={interests} onChange={(e) => setInterests(e.target.value)} placeholder="Open Source, Competitive Programming, Tech Blogging" />
                  </div>

                  <div className="mb-3 p-3" style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border)', borderRadius: '4px' }}>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <div className="pf-label" style={{ marginBottom: '0.1rem', color: 'var(--text)' }}>Open to Work</div>
                        <small style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>Display the "Open to Work" badge on your resume.</small>
                      </div>
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="openToWorkSelect"
                          checked={openToWork}
                          onChange={(e) => setOpenToWork(e.target.checked)}
                          style={{ width: '2.5em', height: '1.2em', cursor: 'pointer' }}
                        />
                      </div>
                    </div>
                  </div>

                  {openToWork && (
                    <div className="mb-3">
                      <label className="pf-label">Available From</label>
                      <input className="pf-input" value={availableFrom} onChange={(e) => setAvailableFrom(e.target.value)} placeholder="Immediately" />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: EXPERIENCE & CERTIFICATIONS */}
            {activeTab === 'exp-certs' && (
              <div className="row g-4">

                {/* EXPERIENCE SECTION */}
                <div className="col-lg-7">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <span className="pf-label" style={{ fontSize: '1.1rem', color: 'var(--neon2)' }}>Work Experience</span>
                    <button type="button" className="btn-pink" style={{ fontSize: '0.8rem', padding: '0.3rem 0.8rem', height: 'auto' }} onClick={addExp}>
                      + Add Experience
                    </button>
                  </div>

                  {expList.length === 0 ? (
                    <p style={{ color: 'var(--muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>
                      No work experience entries yet. Add one to show on your resume!
                    </p>
                  ) : (
                    expList.map((e, index) => (
                      <div key={index} className="entry-card" style={{ marginBottom: '1.25rem', position: 'relative' }}>
                        <button type="button" className="entry-remove" onClick={() => removeExp(index)}>×</button>
                        <div className="row g-3 mb-2">
                          <div className="col-md-6">
                            <label className="pf-label">Job Title</label>
                            <input className="pf-input" value={e.title} onChange={(ev) => updateExp(index, 'title', ev.target.value)} placeholder="Software Engineer" />
                          </div>
                          <div className="col-md-6">
                            <label className="pf-label">Company</label>
                            <input className="pf-input" value={e.company} onChange={(ev) => updateExp(index, 'company', ev.target.value)} placeholder="Google" />
                          </div>
                          <div className="col-md-6">
                            <label className="pf-label">Location</label>
                            <input className="pf-input" value={e.location || ''} onChange={(ev) => updateExp(index, 'location', ev.target.value)} placeholder="e.g. Remote" />
                          </div>
                          <div className="col-md-6">
                            <label className="pf-label">Job Type</label>
                            <select className="pf-input" value={e.type || 'Full-time'} onChange={(ev) => updateExp(index, 'type', ev.target.value)}>
                              <option value="Full-time">Full-time</option>
                              <option value="Part-time">Part-time</option>
                              <option value="Contract">Contract</option>
                              <option value="Internship">Internship</option>
                              <option value="Freelance">Freelance</option>
                            </select>
                          </div>
                          <div className="col-md-6">
                            <label className="pf-label">Start Date</label>
                            <input className="pf-input" value={e.start} onChange={(ev) => updateExp(index, 'start', ev.target.value)} placeholder="Jan 2023" />
                          </div>
                          <div className="col-md-6">
                            <label className="pf-label">End Date</label>
                            <input className="pf-input" value={e.end} onChange={(ev) => updateExp(index, 'end', ev.target.value)} placeholder="Present" />
                          </div>
                        </div>
                        <label className="pf-label">Description (New line for each bullet point)</label>
                        <textarea className="pf-textarea" style={{ minHeight: '120px' }} value={e.desc || ''} onChange={(ev) => updateExp(index, 'desc', ev.target.value)} placeholder="Led development of...&#10;Migrated databases resulting in...&#10;Mentored 3 junior developers..." />
                      </div>
                    ))
                  )}
                </div>

                {/* CERTIFICATIONS SECTION */}
                <div className="col-lg-5">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <span className="pf-label" style={{ fontSize: '1.1rem', color: 'var(--neon3)' }}>Certifications</span>
                    <button type="button" className="btn-yellow" style={{ fontSize: '0.8rem', padding: '0.3rem 0.8rem', height: 'auto', color: 'var(--neon3)' }} onClick={addCert}>
                      + Add Certification
                    </button>
                  </div>

                  {certifications.length === 0 ? (
                    <p style={{ color: 'var(--muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>No certifications added.</p>
                  ) : (
                    certifications.map((c, index) => (
                      <div key={index} className="entry-card mb-3" style={{ position: 'relative', padding: '1rem' }}>
                        <button type="button" className="entry-remove" onClick={() => removeCert(index)}>×</button>
                        <div className="row g-2">
                          <div className="col-12">
                            <label className="pf-label">Name</label>
                            <input className="pf-input" value={c.name} onChange={(ev) => updateCert(index, 'name', ev.target.value)} placeholder="AI Aware Badge" />
                          </div>
                          <div className="col-7">
                            <label className="pf-label">Issuer</label>
                            <input className="pf-input" value={c.issuer} onChange={(ev) => updateCert(index, 'issuer', ev.target.value)} placeholder="Intel" />
                          </div>
                          <div className="col-5">
                            <label className="pf-label">Date</label>
                            <input className="pf-input" value={c.date} onChange={(ev) => updateCert(index, 'date', ev.target.value)} placeholder="AUG 2023" />
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: EDUCATION & PROJECTS */}
            {activeTab === 'edu-projects' && (
              <div className="row g-4">
                {/* EDUCATION SECTION */}
                <div className="col-lg-6">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <span className="pf-label" style={{ fontSize: '1.1rem', color: 'var(--neon)' }}>Education Details</span>
                    <button type="button" className="btn-neon" style={{ fontSize: '0.8rem', padding: '0.3rem 0.8rem', height: 'auto' }} onClick={addEdu}>
                      + Add Education
                    </button>
                  </div>

                  {eduList.length === 0 ? (
                    <p style={{ color: 'var(--muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>
                      No education entries yet. Add one to optimize your ATS resume!
                    </p>
                  ) : (
                    eduList.map((e, index) => (
                      <div key={index} className="entry-card" style={{ marginBottom: '1.25rem', position: 'relative' }}>
                        <button type="button" className="entry-remove" onClick={() => removeEdu(index)}>×</button>
                        <div className="row g-3">
                          <div className="col-md-6">
                            <label className="pf-label">Degree <span style={{ color: 'var(--neon2)' }}>*</span></label>
                            <input className="pf-input" value={e.degree} onChange={(ev) => updateEdu(index, 'degree', ev.target.value)} placeholder="B.Tech Computer Science" />
                          </div>
                          <div className="col-md-6">
                            <label className="pf-label">Institution <span style={{ color: 'var(--neon2)' }}>*</span></label>
                            <input className="pf-input" value={e.institution} onChange={(ev) => updateEdu(index, 'institution', ev.target.value)} placeholder="Stanford University" />
                          </div>
                          <div className="col-md-6">
                            <label className="pf-label">Field of Study</label>
                            <input className="pf-input" value={e.field || ''} onChange={(ev) => updateEdu(index, 'field', ev.target.value)} placeholder="e.g. Computer Science" />
                          </div>
                          <div className="col-md-6">
                            <label className="pf-label">Location</label>
                            <input className="pf-input" value={e.location || ''} onChange={(ev) => updateEdu(index, 'location', ev.target.value)} placeholder="e.g. Stanford, CA" />
                          </div>
                          <div className="col-4">
                            <label className="pf-label">Start Year</label>
                            <input className="pf-input" value={e.start} onChange={(ev) => updateEdu(index, 'start', ev.target.value)} placeholder="2018" />
                          </div>
                          <div className="col-4">
                            <label className="pf-label">End Year</label>
                            <input className="pf-input" value={e.end} onChange={(ev) => updateEdu(index, 'end', ev.target.value)} placeholder="2022" />
                          </div>
                          <div className="col-4">
                            <label className="pf-label">GPA</label>
                            <input className="pf-input" value={e.gpa || ''} onChange={(ev) => updateEdu(index, 'gpa', ev.target.value)} placeholder="3.9/4.0" />
                          </div>
                          <div className="col-12 mt-2">
                            <label className="pf-label">Relevant Courses (comma-separated)</label>
                            <input
                              className="pf-input"
                              value={e.coursesString !== undefined ? e.coursesString : (Array.isArray(e.courses) ? e.courses.join(', ') : '')}
                              onChange={(ev) => updateEduCourses(index, ev.target.value)}
                              placeholder="e.g. Algorithms, DBMS, Operating Systems"
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* PROJECTS SECTION */}
                <div className="col-lg-6">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <span className="pf-label" style={{ fontSize: '1.1rem', color: 'var(--neon3)' }}>Portfolio Projects</span>
                    <button type="button" className="btn-yellow" style={{ fontSize: '0.8rem', padding: '0.3rem 0.8rem', height: 'auto', color: 'var(--neon3)' }} onClick={addProj}>
                      + Add Project
                    </button>
                  </div>

                  {projList.length === 0 ? (
                    <p style={{ color: 'var(--muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>
                      No projects added yet. Add projects to display them on your resume!
                    </p>
                  ) : (
                    projList.map((p, index) => (
                      <div key={index} className="entry-card mb-3" style={{ position: 'relative' }}>
                        <button type="button" className="entry-remove" onClick={() => removeProj(index)}>×</button>
                        <div className="row g-3 mb-2">
                          <div className="col-md-6">
                            <label className="pf-label">Project Name</label>
                            <input className="pf-input" value={p.name} onChange={(ev) => updateProj(index, 'name', ev.target.value)} placeholder="AI Chat Engine" />
                          </div>
                          <div className="col-md-6">
                            <label className="pf-label">Tech Stack (comma-separated)</label>
                            <input
                              className="pf-input"
                              value={p.techString !== undefined ? p.techString : (Array.isArray(p.tech) ? p.tech.join(', ') : '')}
                              onChange={(ev) => updateProjTech(index, ev.target.value)}
                              placeholder="React, Vite, OpenAI"
                            />
                          </div>
                        </div>
                        <div className="mb-2">
                          <label className="pf-label">Description</label>
                          <textarea className="pf-textarea" style={{ minHeight: '100px' }} value={p.desc} onChange={(ev) => updateProj(index, 'desc', ev.target.value)} placeholder="A full-featured AI chat bot with in-memory message history..." />
                        </div>
                        <div>
                          <label className="pf-label">Demo / Repo URL</label>
                          <input className="pf-input" value={p.url || ''} onChange={(ev) => updateProj(index, 'url', ev.target.value)} placeholder="github.com/username/project" />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            <hr className="section-divider" style={{ margin: '2.5rem 0' }} />

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', flexWrap: 'wrap', alignItems: 'center' }}>
              <button
                type="button"
                className="btn-secondary btn-founders-action"
                onClick={() => navigate('/my-resume')}
                style={{ padding: '0.6rem 1.5rem', fontWeight: 600 }}
              >
                Cancel
              </button>

              {currentTabIndex > 0 && (
                <button
                  type="button"
                  className="btn-neon btn-founders-action"
                  onClick={() => setActiveTab(TABS[currentTabIndex - 1])}
                  style={{ padding: '0.6rem 1.5rem', fontWeight: 600 }}
                >
                  ← Back
                </button>
              )}

              {currentTabIndex < TABS.length - 1 && (
                <button
                  type="button"
                  className="btn-yellow btn-founders-action"
                  onClick={() => setActiveTab(TABS[currentTabIndex + 1])}
                  style={{ padding: '0.6rem 1.5rem', fontWeight: 600, color: 'var(--neon3)' }}
                >
                  Next →
                </button>
              )}

              <button
                type="submit"
                className="btn-pink btn-founders-action"
                disabled={loading}
                style={{ padding: '0.6rem 1.8rem', fontWeight: 600 }}
              >
                {loading ? 'Saving...' : 'Save & Update Resume'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default FoundersResumePage;
