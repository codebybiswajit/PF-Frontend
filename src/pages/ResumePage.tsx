import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import type { User, Education, Experience, Project } from '../types';

// Demo data for unauthenticated users
const DEMO_USER: Partial<User> = {
  firstName: 'Your',
  lastName: 'Name',
  title: 'Full Stack Developer',
  email: 'you@email.com',
  phone: '+1 234 567 8900',
  linkedin: 'linkedin.com/in/yourname',
  github: 'github.com/yourname',
  skills: 'React, Node.js, Python, SQL, Docker, TypeScript',
  summary: 'A passionate developer who builds scalable web applications and data pipelines. Experienced in full-stack development with a focus on clean code and user experience.',
  education: [
    { degree: 'B.Sc. Computer Science', institution: 'State University', start: '2019', end: '2023', gpa: '3.8/4.0' },
  ],
  experience: [
    { title: 'Full Stack Developer', company: 'Tech Startup', start: 'Jan 2023', end: 'Present', desc: 'Built and maintained React + Node.js applications. Led migration to microservices architecture, improving performance by 40%.' },
  ],
  projects: [
    { name: 'E-Commerce Platform', tech: 'React, Node.js, PostgreSQL', desc: 'A full-featured e-commerce site with auth, payments, and admin dashboard.', url: 'github.com/yourproject' },
  ],
};

function esc(s: string | undefined): string {
  return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

interface ResumeDocProps { user: Partial<User>; }

const ResumeDoc: React.FC<ResumeDocProps> = ({ user }) => {
  const skills = (user.skills || '').split(',').map(s => s.trim()).filter(Boolean);

  return (
    <div className="resume-doc" id="resumeDoc">
      <div className="resume-header-r">
        <div className="resume-name">{esc(user.firstName)} {esc(user.lastName)}</div>
        {user.title && <div style={{ fontSize: '1rem', color: '#444', marginTop: '0.25rem', fontWeight: 600 }}>{esc(user.title)}</div>}
        <div className="resume-contact">
          {user.email && <span>✉ {esc(user.email)}</span>}
          {user.phone && <span>📞 {esc(user.phone)}</span>}
          {user.linkedin && <span>🔗 {esc(user.linkedin)}</span>}
          {user.github && <span>💻 {esc(user.github)}</span>}
        </div>
      </div>

      {user.summary && (
        <div className="resume-sec">
          <div className="resume-sec-title">Professional Summary</div>
          <p style={{ fontSize: '0.9rem', color: '#444', lineHeight: 1.6 }}>{esc(user.summary)}</p>
        </div>
      )}

      <div className="resume-sec">
        <div className="resume-sec-title">Education</div>
        {(user.education || []).length === 0 ? (
          <p style={{ fontSize: '0.85rem', color: '#999', fontStyle: 'italic' }}>No education entries yet.</p>
        ) : (user.education || []).map((e: Education, i: number) => (
          <div key={i} className="resume-item">
            <div className="resume-item-header">
              <span className="resume-item-title">{esc(e.degree)}</span>
              <span className="resume-item-date">{esc(e.start)}{e.end ? ` – ${esc(e.end)}` : ''}</span>
            </div>
            <div className="resume-item-sub">{esc(e.institution)}{e.gpa ? ` | GPA: ${esc(e.gpa)}` : ''}</div>
          </div>
        ))}
      </div>

      {(user.experience || []).length > 0 && (
        <div className="resume-sec">
          <div className="resume-sec-title">Work Experience</div>
          {(user.experience || []).filter((e: Experience) => e.title).map((e: Experience, i: number) => (
            <div key={i} className="resume-item">
              <div className="resume-item-header">
                <span className="resume-item-title">{esc(e.title)}</span>
                <span className="resume-item-date">{esc(e.start)}{e.end ? ` – ${esc(e.end)}` : ''}</span>
              </div>
              <div className="resume-item-sub">{esc(e.company)}</div>
              {e.desc && <div className="resume-item-desc">{esc(e.desc)}</div>}
            </div>
          ))}
        </div>
      )}

      {(user.projects || []).length > 0 && (
        <div className="resume-sec">
          <div className="resume-sec-title">Projects</div>
          {(user.projects || []).filter((p: Project) => p.name).map((p: Project, i: number) => (
            <div key={i} className="resume-item">
              <div className="resume-item-header">
                <span className="resume-item-title">{esc(p.name)}</span>
                {p.url && <span className="resume-item-date" style={{ color: '#0a5c8a' }}>{esc(p.url)}</span>}
              </div>
              {p.tech && <div className="resume-item-sub">Tech: {esc(Array.isArray(p.tech) ? p.tech.join(', ') : p.tech)}</div>}
              {p.desc && <div className="resume-item-desc">{esc(p.desc)}</div>}
            </div>
          ))}
        </div>
      )}

      {skills.length > 0 && (
        <div className="resume-sec">
          <div className="resume-sec-title">Technical Skills</div>
          <div className="resume-skills-list">
            {skills.map((s, i) => <span key={i} className="resume-skill-tag">{s}</span>)}
          </div>
        </div>
      )}
    </div>
  );
};

const ResumePage: React.FC = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      toast.info('Sign up to view your personalized ATS resume! 📄', { toastId: 'resume-gate' });
    }
  }, [isLoading, user]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <div style={{ color: 'var(--neon)', fontFamily: 'Orbitron, monospace' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div className="resume-wrap" style={{ paddingTop: '80px' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div className="sec-title">YOUR RESUME</div>
        <div className="sec-sub">ATS-optimized • Auto-generated from your profile</div>
        <div className="divider" />
        {user && (
          <div className="resume-actions">
            <span className="ats-badge">✓ ATS Friendly</span>
            <span className="ats-badge" style={{ borderColor: 'var(--neon2)', color: 'var(--neon2)' }}>✓ Keyword Optimized</span>
            <button className="btn-neon" onClick={() => window.print()}>Print / Save PDF</button>
          </div>
        )}
      </div>

      <div style={{ position: 'relative' }}>
        {/* Blurred demo when not authenticated */}
        <div className={user ? '' : 'resume-doc-wrapper'} style={{ position: 'relative' }}>
          <ResumeDoc user={user || DEMO_USER} />

          {!user && (
            <div className="resume-gate-overlay">
              <div className="resume-gate-card">
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📄</div>
                <div style={{ fontFamily: 'Orbitron, monospace', color: 'var(--neon)', fontSize: '1rem', marginBottom: '0.5rem' }}>
                  Your ATS Resume Awaits
                </div>
                <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                  Sign up to generate your personalized ATS-friendly resume from your profile data.
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button className="btn-pink" onClick={() => navigate('/signup')}>Sign Up Now</button>
                  <button className="btn-neon" onClick={() => navigate('/signin')}>Sign In</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {!user && (
          <style>{`.resume-doc-wrapper .resume-doc { filter: blur(5px); pointer-events: none; user-select: none; }`}</style>
        )}
      </div>
    </div>
  );
};

export default ResumePage;
