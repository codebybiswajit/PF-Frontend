import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { PORTFOLIO_PROJECTS } from '../data/portfolioData';
import type { PortfolioProject } from '../types';
import ProjectCard from '../components/ProjectCard';
import ProjectModal from '../components/ProjectModal';
import SkillsSection from '../components/SkillsSection';
import EmptyState from '../components/EmptyState';

const ProjectsPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);

  // Convert user projects to PortfolioProject format for display
  const userProjects: PortfolioProject[] = (user?.projects || [])
    .filter(p => p.name)
    .map((p, i) => ({
      id: `user-${i}`,
      title: p.name,
      desc: p.desc,
      emoji: '💼',
      badge: 'MY PROJECT',
      bgClass: 'bg-ecomm',
      tags: p.tech ? p.tech.split(',').map(t => t.trim()) : [],
      features: [],
      tech: p.tech ? p.tech.split(',').map(t => t.trim()) : [],
      stack: p.url ? `Live: ${p.url}` : 'Source code available',
    }));

  return (
    <div>
      {/* User's own projects section (only when logged in) */}
      {user && (
        <div className="pf-section" style={{ paddingBottom: '1rem' }}>
          <div className="sec-title" style={{ color: 'var(--neon2)' }}>YOUR PROJECTS</div>
          <div className="sec-sub">Projects from your profile</div>
          <div className="divider" style={{ background: 'linear-gradient(90deg, var(--neon2), var(--neon))' }} />

          {userProjects.length === 0 ? (
            <EmptyState
              icon="📁"
              title="No Projects Found"
              message="You haven't added any projects yet. Update your profile to add projects and they'll appear here on your resume too!"
            />
          ) : (
            <div className="row g-4">
              {userProjects.map(proj => (
                <div key={proj.id} className="col-md-6 col-lg-4">
                  <ProjectCard project={proj} onViewDetails={() => setSelectedProject(proj)} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Portfolio showcase projects */}
      <div className="pf-section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="sec-title">PROJECTS</div>
          <div className="sec-sub">Engineered systems. Real impact.</div>
          <div className="divider" />

          <div className="row g-4">
            {PORTFOLIO_PROJECTS.map((proj, i) => (
              <motion.div
                key={proj.id}
                className="col-md-6 col-lg-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <ProjectCard project={proj} onViewDetails={() => setSelectedProject(proj)} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Skills Section */}
      <SkillsSection />

      {/* Project Detail Modal */}
      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </div>
  );
};

export default ProjectsPage;
