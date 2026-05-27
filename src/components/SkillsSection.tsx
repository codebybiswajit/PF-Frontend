import React, { useEffect, useRef } from 'react';

interface Skill {
  name: string;
  level: number; // 0-100
}

interface SkillCategory {
  title: string;
  icon: string;
  skills: Skill[];
}

const SKILL_CATEGORIES: SkillCategory[] = [
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
        <span className="skill-pct">{skill.level}%</span>
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

  return (
    <section ref={sectionRef} className="py-5">
      <div className="container">
        {/* Section header */}
        <div className="text-center mb-5">
          <h2 className="section-title">Skills &amp; Technologies</h2>
          <p className="section-sub text-muted">
            Technologies I work with on a daily basis
          </p>
        </div>

        {/* Skills grid */}
        <div className="row g-4">
          {SKILL_CATEGORIES.map((cat) => (
            <div key={cat.title} className="col-12 col-md-6 col-lg-4">
              <div className="skill-cat h-100 p-4">
                <h4 className="d-flex align-items-center gap-2 mb-4">
                  <span>{cat.icon}</span>
                  <span>{cat.title}</span>
                </h4>
                {cat.skills.map((skill) => (
                  <SkillBar key={skill.name} skill={skill} animate={animated} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
