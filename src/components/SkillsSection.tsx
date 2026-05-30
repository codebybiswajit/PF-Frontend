import React, { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePublicPortfolio } from '../context/PublicPortfolioContext';

interface Skill {
  name: string;
  level: number; // 0-100
}

interface SkillCategory {
  title: string;
  icon: string;
  skills: Skill[];
}

const DEFAULT_SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: 'Frontend',
    icon: '🎨',
    skills: [
      { name: 'React / Next.js', level: 90 },
      { name: 'TypeScript', level: 85 },
      { name: 'CSS / Tailwind', level: 88 },
    ],
  },
  {
    title: 'Backend',
    icon: '⚙️',
    skills: [
      { name: 'Node.js / Express', level: 87 },
      { name: 'Python / Django', level: 90 },
      { name: 'REST / GraphQL', level: 82 },
    ],
  },
  {
    title: 'Data & DevOps',
    icon: '🗄️',
    skills: [
      { name: 'PostgreSQL / MySQL', level: 85 },
      { name: 'Docker / Kubernetes', level: 75 },
      { name: 'Python / Scrapy', level: 92 },
    ],
  },
];

const SkillBar: React.FC<{ skill: Skill; animate: boolean }> = ({ skill, animate }) => {
  return (
    <div className="skill-item mb-3">
      <div className="d-flex justify-content-between align-items-center mb-1">
        <span className="skill-name">{skill.name}</span>
      </div>
      <div className="skill-bar">
        <div
          className="skill-fill"
          style={{
            width: animate ? `${skill.level}%` : '0%',
            transition: animate ? 'width 1.1s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
          }}
        />
      </div>
    </div>
  );
};

const SkillsSection: React.FC = () => {
  const { user } = useAuth();
  const { publicUser } = usePublicPortfolio();
  const activeUser = publicUser || user;
  const sectionRef = useRef<HTMLDivElement>(null);
  const [animated, setAnimated] = React.useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setAnimated(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  // Compute dynamic skills list if logged in, fallback to default showcase
  const userSkillsArray = activeUser?.skills
    ? activeUser.skills.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  let skillCategories = DEFAULT_SKILL_CATEGORIES;

  if (activeUser) {
    const allSkills = userSkillsArray.map((skillName, index) => ({
      name: skillName,
      level: 80 + (index % 5) * 4 // gorgeous and realistic level variations
    }));

    skillCategories = [
      { title: 'Technical Skills', icon: '🚀', skills: allSkills }
    ];
  }

  return (
    <section ref={sectionRef} className="py-5">
      <div className="container">
        {/* Section header */}
        <div className="text-center mb-5">
          <h2 className="section-title">Skills &amp; Technologies</h2>
          <p className="section-sub text-muted">
            {activeUser ? 'Technologies from your profile' : 'Technologies I work with on a daily basis'}
          </p>
        </div>

        {/* Skills grid */}
        <div className="row g-4 justify-content-center">
          {skillCategories.map((cat) => {
            const isSingle = skillCategories.length === 1;
            return (
              <div
                key={cat.title}
                className={isSingle ? "col-12 col-lg-10" : "col-12 col-md-6 col-lg-4"}
              >
                <div className="skill-cat h-100 p-4 p-md-5">
                  <h4 className="d-flex align-items-center gap-2 mb-4" style={{ justifyContent: isSingle ? 'center' : 'flex-start' }}>
                    <span>{cat.icon}</span>
                    <span style={isSingle ? { fontSize: '1.5rem', fontFamily: 'Orbitron, monospace', letterSpacing: '2px', color: 'var(--neon)' } : {}}>{cat.title}</span>
                  </h4>
                  {isSingle ? (
                    cat.skills.length > 0 ? (
                      <div className="row g-4 row-cols-1 row-cols-md-2 row-cols-lg-3">
                        {cat.skills.map((skill) => (
                          <div key={skill.name} className="col">
                            <SkillBar skill={skill} animate={animated} />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🛠️</div>
                        <h5 style={{ fontFamily: 'Orbitron, monospace', color: 'var(--text)', marginBottom: '0.5rem' }}>No Skills Listed Yet</h5>
                        <p style={{ color: 'var(--muted)', fontSize: '0.95rem', maxWidth: '400px', margin: '0 auto' }}>
                          Add your core technologies in your profile settings to showcase them beautifully here!
                        </p>
                      </div>
                    )
                  ) : (
                    cat.skills.map((skill) => (
                      <SkillBar key={skill.name} skill={skill} animate={animated} />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
