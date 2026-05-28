import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import type { Education, Experience, Project, User } from '../types';

interface EduEntry extends Education { id: number; }
interface ExpEntry extends Experience { id: number; }
interface ProjEntry extends Project { id: number; }

const SignUpPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(1); // 1: Basic, 2: Education, 3: Projects

  // Basic fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [title, setTitle] = useState('');
  const [phone, setPhone] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  const [skills, setSkills] = useState('');
  const [summary, setSummary] = useState('');

  const [eduList, setEduList] = useState<EduEntry[]>([
    { id: 1, degree: '', institution: '', start: '', end: '', gpa: '' },
  ]);
  const [expList, setExpList] = useState<ExpEntry[]>([]);
  const [projList, setProjList] = useState<ProjEntry[]>([]);
  const [counter, setCounter] = useState(2);

  const nextId = () => { const id = counter; setCounter(c => c + 1); return id; };

  const addEdu = () => setEduList(l => [...l, { id: nextId(), degree: '', institution: '', start: '', end: '', gpa: '' }]);
  const removeEdu = (id: number) => setEduList(l => l.filter(e => e.id !== id));
  const updateEdu = (id: number, field: keyof Education, value: string) =>
    setEduList(l => l.map(e => e.id === id ? { ...e, [field]: value } : e));

  const addExp = () => setExpList(l => [...l, { id: nextId(), title: '', company: '', start: '', end: '', desc: '' }]);
  const removeExp = (id: number) => setExpList(l => l.filter(e => e.id !== id));
  const updateExp = (id: number, field: keyof Experience, value: string) =>
    setExpList(l => l.map(e => e.id === id ? { ...e, [field]: value } : e));

  const addProj = () => setProjList(l => [...l, { id: nextId(), name: '', tech: '', desc: '', url: '' }]);
  const removeProj = (id: number) => setProjList(l => l.filter(e => e.id !== id));
  const updateProj = (id: number, field: keyof Project, value: string) =>
    setProjList(l => l.map(e => e.id === id ? { ...e, [field]: value } : e));

  // Validate Basic Info Step
  const validateBasicInfo = () => {
    if (!firstName || !lastName) { setError('First and last name are required.'); return false; }
    if (!email || !email.includes('@')) { setError('Valid email is required.'); return false; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return false; }
    setError('');
    return true;
  };

  // Validate Education Step
  const validateEducation = () => {
    if (eduList.length === 0) { setError('At least one education entry is required.'); return false; }
    for (const e of eduList) {
      if (!e.degree || !e.institution) { setError('Each education entry needs a degree and institution.'); return false; }
    }
    setError('');
    return true;
  };

  // Move to next step
  const handleNext = () => {
    if (currentStep === 1 && validateBasicInfo()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateEducation()) {
      setCurrentStep(3);
    }
  };

  // Move to previous step
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError('');
    }
  };

  // Final save/submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validateBasicInfo()) return;
    if (!validateEducation()) return;

    setLoading(true);
    try {
      const userData: Omit<User, '_id'> & { password: string } = {
        firstName, lastName, email: email.trim().toLowerCase(), password,
        title, phone, linkedin, github, skills, summary,
        education: eduList.map(({ id: _id, ...e }) => e),
        experience: expList.map(({ id: _id, ...e }) => e),
        projects: projList.map(({ id: _id, ...p }) => p),
      };
      await register(userData);
      toast.success('Profile created! Here is your ATS resume 🎉');
      navigate('/resume');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '';
      if (msg.includes('409') || msg.includes('exists')) {
        setError('An account already exists with this email.');
      } else {
        setError('Registration failed. Is the backend running?');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ paddingTop: '80px', paddingBottom: '3rem', display: 'flex', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
      <motion.div
        className="auth-card"
        style={{ maxWidth: 620, margin: '2rem 1rem' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="auth-title">REGISTER</div>
        <div className="auth-sub">Create your profile &amp; get a personalized ATS resume</div>

        {/* Step Indicator */}
        <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '2rem', fontSize: '0.85rem' }}>
          <div style={{ color: currentStep >= 1 ? 'var(--neon2)' : 'var(--muted)' }}>
            <div style={{ fontWeight: 'bold' }}>Step 1</div>
            <div>Basic Info</div>
          </div>
          <div style={{ color: currentStep >= 2 ? 'var(--neon2)' : 'var(--muted)' }}>
            <div style={{ fontWeight: 'bold' }}>Step 2</div>
            <div>Education</div>
          </div>
          <div style={{ color: currentStep >= 3 ? 'var(--neon2)' : 'var(--muted)' }}>
            <div style={{ fontWeight: 'bold' }}>Step 3</div>
            <div>Projects</div>
          </div>
        </div>

        {error && <div className="error-msg" style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

        <form onSubmit={currentStep === 3 ? handleSubmit : (e) => e.preventDefault()} noValidate>

          {/* STEP 1: BASIC INFO */}
          {currentStep === 1 && (
            <div>
              <div className="section-label">Basic Info</div>
              <div className="row g-2 mb-2">
                <div className="col-6">
                  <label className="pf-label">First Name <span style={{ color: 'var(--neon2)' }}>*</span></label>
                  <input className="pf-input" placeholder="Biswajit" value={firstName} onChange={e => setFirstName(e.target.value)} />
                </div>
                <div className="col-6">
                  <label className="pf-label">Last Name <span style={{ color: 'var(--neon2)' }}>*</span></label>
                  <input className="pf-input" placeholder="Mohapatra" value={lastName} onChange={e => setLastName(e.target.value)} />
                </div>
              </div>
              <div className="mb-2">
                <label className="pf-label">Email <span style={{ color: 'var(--neon2)' }}>*</span></label>
                <input type="email" className="pf-input" placeholder="Biswajit@email.com" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div className="mb-2">
                <label className="pf-label">Password <span style={{ color: 'var(--neon2)' }}>*</span></label>
                <input type="password" className="pf-input" placeholder="Min 6 characters" value={password} onChange={e => setPassword(e.target.value)} />
              </div>
              <div className="mb-2">
                <label className="pf-label">Professional Title</label>
                <input className="pf-input" placeholder="Full Stack Developer" value={title} onChange={e => setTitle(e.target.value)} />
              </div>
              <div className="row g-2 mb-2">
                <div className="col-6">
                  <label className="pf-label">Phone</label>
                  <input className="pf-input" placeholder="+1 234 567 8900" value={phone} onChange={e => setPhone(e.target.value)} />
                </div>
                <div className="col-6">
                  <label className="pf-label">LinkedIn</label>
                  <input className="pf-input" placeholder="linkedin.com/in/..." value={linkedin} onChange={e => setLinkedin(e.target.value)} />
                </div>
              </div>
              <div className="mb-2">
                <label className="pf-label">GitHub</label>
                <input className="pf-input" placeholder="github.com/username" value={github} onChange={e => setGithub(e.target.value)} />
              </div>
              <div className="mb-2">
                <label className="pf-label">Skills (comma-separated)</label>
                <input className="pf-input" placeholder="React, Node.js, Python, SQL" value={skills} onChange={e => setSkills(e.target.value)} />
              </div>
              <div className="mb-3">
                <label className="pf-label">Summary / Bio</label>
                <textarea className="pf-textarea" placeholder="Brief professional summary..." value={summary} onChange={e => setSummary(e.target.value)} />
              </div>
            </div>
          )}

          {/* STEP 2: EDUCATION */}
          {currentStep === 2 && (
            <div>
              <div className="section-label">Education <span style={{ color: 'var(--neon2)', fontSize: '0.7rem' }}>* (at least one required)</span></div>
              {eduList.map(e => (
                <div key={e.id} className="entry-card">
                  <button type="button" className="entry-remove" onClick={() => removeEdu(e.id)}>×</button>
                  <div className="row g-2 mb-2">
                    <div className="col-6">
                      <label className="pf-label">Degree <span style={{ color: 'var(--neon2)' }}>*</span></label>
                      <input className="pf-input" placeholder="B.Sc. Computer Science" value={e.degree} onChange={ev => updateEdu(e.id, 'degree', ev.target.value)} />
                    </div>
                    <div className="col-6">
                      <label className="pf-label">Institution <span style={{ color: 'var(--neon2)' }}>*</span></label>
                      <input className="pf-input" placeholder="MIT" value={e.institution} onChange={ev => updateEdu(e.id, 'institution', ev.target.value)} />
                    </div>
                    <div className="col-4">
                      <label className="pf-label">Start Year</label>
                      <input className="pf-input" placeholder="2018" value={e.start} onChange={ev => updateEdu(e.id, 'start', ev.target.value)} />
                    </div>
                    <div className="col-4">
                      <label className="pf-label">End Year</label>
                      <input className="pf-input" placeholder="2022" value={e.end} onChange={ev => updateEdu(e.id, 'end', ev.target.value)} />
                    </div>
                    <div className="col-4">
                      <label className="pf-label">GPA</label>
                      <input className="pf-input" placeholder="3.8/4.0" value={e.gpa || ''} onChange={ev => updateEdu(e.id, 'gpa', ev.target.value)} />
                    </div>
                  </div>
                </div>
              ))}
              <button type="button" className="add-btn" onClick={addEdu}>+ Add Education</button>

              {/* Experience section included in Education step */}
              <hr className="section-divider" style={{ marginTop: '1.5rem' }} />
              <div className="section-label">Experience <span style={{ color: 'var(--muted)', fontSize: '0.7rem' }}>(optional but preferred)</span></div>
              {expList.map(e => (
                <div key={e.id} className="entry-card">
                  <button type="button" className="entry-remove" onClick={() => removeExp(e.id)}>×</button>
                  <div className="row g-2 mb-2">
                    <div className="col-6">
                      <label className="pf-label">Job Title</label>
                      <input className="pf-input" placeholder="Senior Developer" value={e.title} onChange={ev => updateExp(e.id, 'title', ev.target.value)} />
                    </div>
                    <div className="col-6">
                      <label className="pf-label">Company</label>
                      <input className="pf-input" placeholder="Tech Corp" value={e.company} onChange={ev => updateExp(e.id, 'company', ev.target.value)} />
                    </div>
                    <div className="col-6">
                      <label className="pf-label">Start Date</label>
                      <input className="pf-input" placeholder="Jan 2022" value={e.start} onChange={ev => updateExp(e.id, 'start', ev.target.value)} />
                    </div>
                    <div className="col-6">
                      <label className="pf-label">End Date</label>
                      <input className="pf-input" placeholder="Present" value={e.end} onChange={ev => updateExp(e.id, 'end', ev.target.value)} />
                    </div>
                  </div>
                  <label className="pf-label">Description</label>
                  <textarea className="pf-textarea" placeholder="Key responsibilities and achievements..." value={e.desc} onChange={ev => updateExp(e.id, 'desc', ev.target.value)} />
                </div>
              ))}
              <button type="button" className="add-btn" onClick={addExp}>+ Add Experience</button>
            </div>
          )}

          {/* STEP 3: PROJECTS */}
          {currentStep === 3 && (
            <div>
              <div className="section-label">Projects <span style={{ color: 'var(--muted)', fontSize: '0.7rem' }}>(optional but preferred)</span></div>
              {projList.map(p => (
                <div key={p.id} className="entry-card">
                  <button type="button" className="entry-remove" onClick={() => removeProj(p.id)}>×</button>
                  <div className="row g-2 mb-2">
                    <div className="col-6">
                      <label className="pf-label">Project Name</label>
                      <input className="pf-input" placeholder="My Project" value={p.name} onChange={ev => updateProj(p.id, 'name', ev.target.value)} />
                    </div>
                    <div className="col-6">
                      <label className="pf-label">Tech Stack</label>
                      <input className="pf-input" placeholder="React, Node.js" value={p.tech} onChange={ev => updateProj(p.id, 'tech', ev.target.value)} />
                    </div>
                  </div>
                  <label className="pf-label">Description</label>
                  <textarea className="pf-textarea" placeholder="What did you build and what impact did it have?" value={p.desc} onChange={ev => updateProj(p.id, 'desc', ev.target.value)} />
                  <label className="pf-label" style={{ marginTop: '0.5rem' }}>GitHub / Live URL</label>
                  <input className="pf-input" placeholder="github.com/yourproject" value={p.url || ''} onChange={ev => updateProj(p.id, 'url', ev.target.value)} />
                </div>
              ))}
              <button type="button" className="add-btn" onClick={addProj}>+ Add Project</button>
            </div>
          )}

          <hr className="section-divider" />

          {/* Navigation Buttons */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between' }}>
            {currentStep > 1 && (
              <button
                type="button"
                className="btn-secondary"
                onClick={handlePrevious}
                style={{ flex: 1, padding: '0.75rem', fontSize: '1rem' }}
              >
                PREVIOUS
              </button>
            )}
            {currentStep < 3 && (
              <button
                type="button"
                className="btn-pink"
                onClick={handleNext}
                style={{ flex: 1, padding: '0.75rem', fontSize: '1rem' }}
              >
                NEXT
              </button>
            )}
            {currentStep === 3 && (
              <button
                type="submit"
                className="btn-pink"
                style={{ flex: 1, padding: '0.75rem', fontSize: '1rem' }}
                disabled={loading}
              >
                {loading ? 'SAVING...' : 'SAVE & GENERATE RESUME'}
              </button>
            )}
          </div>
        </form>

        <div className="auth-switch">
          Already registered? <Link to="/signin">Sign In</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUpPage;
