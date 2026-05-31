import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { usePublicPortfolio } from '../context/PublicPortfolioContext';
import type { ResumeExperience, ResumeProject, ResumeEducation, ResumeCertification } from '../types';

/* ─── tiny helpers ─────────────────────────────────────────────── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
});

/* ─── sub-components ───────────────────────────────────────────── */

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="mr-sec-title">
    <span>{children}</span>
    <div className="mr-sec-line" />
  </div>
);

const ExperienceBlock: React.FC<{ exp: ResumeExperience; index: number }> = ({ exp, index }) => (
  <motion.div className="mr-exp-card" {...fadeUp(0.1 * index)}>
    <div className="mr-exp-dot" />
    <div className="mr-exp-content">
      <div className="mr-exp-header">
        <div>
          <div className="mr-exp-title">{exp.title}</div>
          <div className="mr-exp-company">
            {exp.company}
            {exp.location && <span className="mr-exp-location"> · {exp.location}</span>}
            {exp.type && <span className="mr-badge-type">{exp.type}</span>}
          </div>
        </div>
        <div className="mr-exp-dates">{exp.start} — {exp.end}</div>
      </div>
      {exp.summary && <p className="mr-exp-summary">{exp.summary}</p>}
      <ul className="mr-bullets">
        {(exp.bullets || []).map((b, i) => <li key={i}>{b}</li>)}
      </ul>
      {exp.tech && exp.tech.length > 0 && (
        <div className="mr-tag-row">
          {exp.tech.map((t, i) => <span key={i} className="mr-tag">{t}</span>)}
        </div>
      )}
    </div>
  </motion.div>
);

const ProjectBlock: React.FC<{ proj: ResumeProject; index: number }> = ({ proj, index }) => (
  <motion.div className="mr-proj-card" {...fadeUp(0.1 * index)}>
    <div className="mr-proj-header">
      <div>
        <div className="mr-proj-name">{proj.name}</div>
        {proj.tagline && <div className="mr-proj-tagline">{proj.tagline}</div>}
      </div>
      {proj.repo && (
        <a href={`https://${proj.repo}`} target="_blank" rel="noopener noreferrer" className="mr-proj-link">
          ↗ Repo
        </a>
      )}
    </div>
    <p className="mr-proj-desc">{proj.desc}</p>
    {proj.highlights && proj.highlights.length > 0 && (
      <ul className="mr-bullets mr-proj-highlights">
        {proj.highlights.map((h, i) => <li key={i}>{h}</li>)}
      </ul>
    )}
    <div className="mr-tag-row">
      {(proj.tech || []).map((t, i) => <span key={i} className="mr-tag mr-tag-pink">{t}</span>)}
    </div>
  </motion.div>
);

const EducationBlock: React.FC<{ edu: ResumeEducation; index: number }> = ({ edu, index }) => (
  <motion.div className="mr-edu-card" {...fadeUp(0.1 * index)}>
    <div className="mr-edu-header">
      <div>
        <div className="mr-edu-degree">
          {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
        </div>
        <div className="mr-edu-inst">
          {edu.institution}
          {edu.location && <span className="mr-exp-location"> · {edu.location}</span>}
        </div>
        <div className="mr-edu-meta">
          {edu.gpa && <span className="mr-edu-gpa">GPA: {edu.gpa}</span>}
          {edu.honors && <span className="mr-edu-honors">{edu.honors}</span>}
        </div>
      </div>
      <div className="mr-exp-dates">{edu.start} — {edu.end}</div>
    </div>
    {edu.courses && edu.courses.length > 0 && (
      <div className="mr-tag-row" style={{ marginTop: '0.6rem' }}>
        {edu.courses.map((c, i) => <span key={i} className="mr-tag mr-tag-yellow">{c}</span>)}
      </div>
    )}
  </motion.div>
);

/* ─── Main Page ─────────────────────────────────────────────────── */
const MyResumePage: React.FC = () => {
  const { user } = useAuth();
  const { publicUser, founderUser } = usePublicPortfolio();
  // publicUser = viewing someone else's public portfolio
  // user = the logged-in owner viewing their own resume
  // fallback to static RESUME_DATA when neither is present
  const activeUser = publicUser || user || founderUser;

  // Dynamically map logged-in user to resume data format or fallback to default
  const r = activeUser ? {
    firstName: activeUser.firstName,
    lastName: activeUser.lastName,
    title: activeUser.title || 'Full Stack Developer',
    tagline: activeUser.tagline || (activeUser.summary ? `Building systems that scale & experiences that delight.` : ''),
    contact: {
      email: activeUser.contact?.email || activeUser.email,
      phone: activeUser.contact?.phone || activeUser.phone || '',
      location: activeUser.contact?.location || 'India',
      website: activeUser.contact?.website || '',
      linkedin: activeUser.contact?.linkedin || activeUser.linkedin || '',
      github: activeUser.contact?.github || activeUser.github || '',
      twitter: activeUser.contact?.twitter || '',
    },
    summary: activeUser.summary || '',
    skillGroups: activeUser.skillGroups && activeUser.skillGroups.length > 0
      ? activeUser.skillGroups
      : [
        {
          category: 'Skills',
          icon: '🔧',
          skills: activeUser.skills ? activeUser.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
        }
      ],
    education: (activeUser.education || []).map(e => ({
      degree: e.degree,
      field: e.field || '',
      institution: e.institution,
      location: e.location || '',
      start: e.start,
      end: e.end,
      gpa: e.gpa || '',
      honors: e.honors || '',
      courses: e.courses || [],
    })),
    experience: (activeUser.experience || []).map(e => ({
      title: e.title,
      company: e.company,
      location: e.location || '',
      type: (e.type || 'Full-time') as any,
      start: e.start,
      end: e.end,
      summary: e.summary || '',
      bullets: e.bullets && e.bullets.length > 0
        ? e.bullets
        : (e.desc ? e.desc.split('\n').map(b => b.trim()).filter(Boolean) : []),
      tech: e.tech || [],
    })),
    projects: (activeUser.projects || []).map(p => ({
      name: p.name,
      tagline: p.tagline || '',
      tech: Array.isArray(p.tech)
        ? p.tech
        : (p.tech ? p.tech.split(',').map(t => t.trim()).filter(Boolean) : []),
      desc: p.desc,
      repo: p.repo || p.url || '',
      highlights: p.highlights || [],
    })),
    certifications: activeUser.certifications || [],
    languages: activeUser.languages || [],
    interests: activeUser.interests || [],
    openToWork: activeUser.openToWork !== undefined ? activeUser.openToWork : true,
    availableFrom: activeUser.availableFrom || 'Immediately',
  } : null;

  return (
    <div className="mr-root" style={{ paddingTop: '80px' }}>
      {/* ── Print styles ── */}
      <style>{`
        @media print {
          body { background: #fff !important; color: #111 !important; }
          .mr-root { background: #fff !important; padding-top: 0 !important; }
          .mr-topbar, .mr-actions, .pf-nav, #particles { display: none !important; }
          .mr-main { box-shadow: none !important; border: none !important; margin: 0 !important; padding: 1.5rem !important; }
          .mr-header { background: #f8f8f8 !important; color: #111 !important; }
          .mr-name { color: #111 !important; -webkit-text-fill-color: #111 !important; }
          .mr-title { color: #555 !important; }
          .mr-contact a, .mr-contact span { color: #333 !important; }
          .mr-sec-title span { color: #111 !important; }
          .mr-sec-line { background: #111 !important; }
          .mr-exp-title, .mr-proj-name, .mr-edu-degree { color: #111 !important; }
          .mr-exp-card, .mr-proj-card, .mr-edu-card { border-color: #ddd !important; background: #fff !important; }
          .mr-tag { background: #eee !important; color: #333 !important; border-color: #ccc !important; }
          .mr-tag-pink { background: #eee !important; color: #555 !important; border-color: #ccc !important; }
          .mr-sidebar { background: #f4f4f4 !important; }
          .mr-skill-tag { background: #e8e8e8 !important; color: #333 !important; }
          .mr-open-badge { background: #e8ffe8 !important; color: #155724 !important; }
        }
      `}</style>

      {/* ── Top action bar ── */}
      <div className="mr-topbar no-print">
        <div className="mr-topbar-inner">
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {r.openToWork && (
              <span className="mr-open-badge">🟢 Open to Work{r.availableFrom ? ` · ${r.availableFrom}` : ''}</span>
            )}
          </div>
          <div className="mr-actions">
            <span className="ats-badge">✓ ATS Friendly</span>
            <span className="ats-badge" style={{ borderColor: 'var(--neon2)', color: 'var(--neon2)' }}>✓ Keyword Optimized</span>
            <button className="btn-neon" onClick={() => window.print()}>🖨 Print / Save PDF</button>
          </div>
        </div>
      </div>

      {/* ── Resume document ── */}
      <motion.div
        className="mr-main"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* ══ HEADER ══ */}
        <div className="mr-header">
          <div className="mr-header-left">
            <div className="mr-initials-avatar">
              {r.firstName[0]}{r.lastName[0]}
            </div>
            <div>
              <h1 className="mr-name">{r.firstName} {r.lastName}</h1>
              <div className="mr-title">{r.title}</div>
              {r.tagline && <div className="mr-tagline">"{r.tagline}"</div>}
            </div>
          </div>
          <div className="mr-contact">
            {r.contact.email && <a href={`mailto:${r.contact.email}`} className="mr-contact-item">✉ {r.contact.email}</a>}
            {r.contact.phone && <span className="mr-contact-item">📞 {r.contact.phone}</span>}
            {r.contact.location && <span className="mr-contact-item">📍 {r.contact.location}</span>}
            {r.contact.linkedin && <a href={`https://${r.contact.linkedin}`} target="_blank" rel="noopener noreferrer" className="mr-contact-item">🔗 {r.contact.linkedin}</a>}
            {r.contact.github && <a href={`https://${r.contact.github}`} target="_blank" rel="noopener noreferrer" className="mr-contact-item">💻 {r.contact.github}</a>}
            {r.contact.website && <a href={r.contact.website} target="_blank" rel="noopener noreferrer" className="mr-contact-item">🌐 {r.contact.website}</a>}
            {r.contact?.twitter && <span className="mr-contact-item">🐦 {r.contact?.twitter}</span>}
          </div>
        </div>

        {/* ══ BODY: two-column ══ */}
        <div className="mr-body">

          {/* ── LEFT (main column) ── */}
          <div className="mr-left">

            {/* Summary */}
            <motion.div {...fadeUp(0.1)}>
              <SectionTitle>Professional Summary</SectionTitle>
              <p className="mr-summary">{r.summary}</p>
            </motion.div>

            {/* Experience */}
            {r.experience.length > 0 && (
              <motion.div {...fadeUp(0.2)}>
                <SectionTitle>Work Experience</SectionTitle>
                <div className="mr-timeline">
                  {r.experience.map((exp, i) => <ExperienceBlock key={i} exp={exp} index={i} />)}
                </div>
              </motion.div>
            )}

            {/* Projects */}
            {r.projects.length > 0 && (
              <motion.div {...fadeUp(0.3)}>
                <SectionTitle>Projects</SectionTitle>
                {r.projects.map((proj, i) => <ProjectBlock key={i} proj={proj} index={i} />)}
              </motion.div>
            )}

            {/* Education */}
            {r.education.length > 0 && (
              <motion.div {...fadeUp(0.4)}>
                <SectionTitle>Education</SectionTitle>
                {r.education.map((edu, i) => <EducationBlock key={i} edu={edu} index={i} />)}
              </motion.div>
            )}

          </div>

          {/* ── RIGHT (sidebar) ── */}
          <div className="mr-sidebar">

            {/* Skills */}
            {r.skillGroups.length > 0 && (
              <motion.div {...fadeUp(0.2)}>
                <SectionTitle>Skills</SectionTitle>
                {r.skillGroups.map((group, gi) => (
                  <div key={gi} className="mr-skill-group">
                    <div className="mr-skill-cat">
                      {group.icon && <span>{group.icon} </span>}{group.category}
                    </div>
                    <div className="mr-skill-tags">
                      {group.skills.map((s, si) => (
                        <span key={si} className="mr-skill-tag">{s}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Certifications */}
            {r.certifications && r.certifications.length > 0 && (
              <motion.div {...fadeUp(0.3)}>
                <SectionTitle>Certifications</SectionTitle>
                {r.certifications.map((cert: ResumeCertification, i: number) => (
                  <div key={i} className="mr-cert-item">
                    <div className="mr-cert-name">{cert.name}</div>
                    <div className="mr-cert-issuer">{cert.issuer}{cert.date ? ` · ${cert.date}` : ''}</div>
                    {cert.url && (
                      <a href={cert.url} target="_blank" rel="noopener noreferrer" className="mr-cert-link">Verify ↗</a>
                    )}
                  </div>
                ))}
              </motion.div>
            )}

            {/* Languages */}
            {r.languages && r.languages.length > 0 && (
              <motion.div {...fadeUp(0.35)}>
                <SectionTitle>Languages</SectionTitle>
                {r.languages.map((lang, i) => (
                  <div key={i} className="mr-lang-item">
                    <span className="mr-lang-name">{lang.language}</span>
                    <span className={`mr-lang-badge mr-lang-${lang.proficiency.toLowerCase()}`}>
                      {lang.proficiency}
                    </span>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Interests */}
            {r.interests && r.interests.length > 0 && (
              <motion.div {...fadeUp(0.4)}>
                <SectionTitle>Interests</SectionTitle>
                <div className="mr-skill-tags">
                  {r.interests.map((interest, i) => (
                    <span key={i} className="mr-skill-tag mr-interest-tag">{interest}</span>
                  ))}
                </div>
              </motion.div>
            )}

          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MyResumePage;
