import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { usePublicPortfolio } from '../context/PublicPortfolioContext';
import { PORTFOLIO_PROJECTS } from '../data/portfolioData';
import type { PortfolioProject } from '../types';
import ProjectCard from '../components/ProjectCard';
import ProjectModal from '../components/ProjectModal';
import SkillsSection from '../components/SkillsSection';
import EmptyState from '../components/EmptyState';
import ProfileModal from '../components/ProfileModal';

const ProjectsPage: React.FC = () => {
  const { user } = useAuth();
  const { publicUser } = usePublicPortfolio();
  const activeUser = publicUser || user;
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileModalTab, setProfileModalTab] = useState<'basic' | 'edu-exp' | 'projects'>('basic');

  // Convert user projects to PortfolioProject format for display
  const userProjects: PortfolioProject[] = (activeUser?.projects || [])
    .filter(p => p.name)
    .map((p, i) => ({
      id: `user-${i}`,
      title: p.name,
      desc: p.desc,
      emoji: '💼',
      badge: publicUser ? `${publicUser.firstName.toUpperCase()}'S PROJECT` : 'MY PROJECT',
      bgClass: 'bg-ecomm',
      tags: p.tech ? p.tech.split(',').map(t => t.trim()) : [],
      features: [],
      tech: p.tech ? p.tech.split(',').map(t => t.trim()) : [],
      stack: p.url ? `Live: ${p.url}` : 'Source code available',
    }));

  const isUserLoggedIn = !!user && !publicUser; // only show edit actions if viewing own page
  const showCustomProjects = !!activeUser;
  const projectsToDisplay = showCustomProjects ? userProjects : PORTFOLIO_PROJECTS;

  return (
    <div>
      <div className="pf-section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {publicUser ? (
            <>
              <div className="sec-title" style={{ color: 'var(--neon2)' }}>{publicUser.firstName.toUpperCase()}'S PROJECTS</div>
              <div className="sec-sub">Custom engineered systems by {publicUser.firstName} {publicUser.lastName}</div>
              <div className="divider" style={{ background: 'linear-gradient(90deg, var(--neon2), var(--neon))' }} />
            </>
          ) : isUserLoggedIn ? (
            <>
              <div className="sec-title" style={{ color: 'var(--neon2)' }}>YOUR PROJECTS</div>
              <div className="sec-sub">Custom engineered systems from your profile</div>
              <div className="divider" style={{ background: 'linear-gradient(90deg, var(--neon2), var(--neon))' }} />
            </>
          ) : (
            <>
              <div className="sec-title">PROJECTS</div>
              <div className="sec-sub">Engineered systems. Real impact.</div>
              <div className="divider" />
            </>
          )}

          {isUserLoggedIn && userProjects.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <EmptyState
                icon="📁"
                title="No Projects Found"
                message="You haven't added any projects to your profile yet. Add your projects to display them dynamically here on your portfolio page and ATS resume!"
              />
              <button 
                type="button" 
                className="btn-pink mt-4" 
                onClick={() => {
                  setProfileModalTab('projects');
                  setProfileModalOpen(true);
                }}
                style={{ padding: '0.6rem 1.5rem', fontWeight: 600, fontSize: '0.95rem' }}
              >
                + Add Your First Project
              </button>
            </div>
          ) : (
            <div className="row g-4">
              {projectsToDisplay.map((proj, i) => (
                <motion.div
                  key={proj.id}
                  className="col-md-6 col-lg-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <ProjectCard 
                    project={proj} 
                    onViewDetails={() => setSelectedProject(proj)} 
                    onEdit={isUserLoggedIn ? () => {
                      setProfileModalTab('projects');
                      setProfileModalOpen(true);
                    } : undefined}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Skills Section */}
      <SkillsSection />

      {/* Project Detail Modal */}
      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />

      {/* Dynamic Profile Modal Trigger */}
      <ProfileModal isOpen={profileModalOpen} onClose={() => setProfileModalOpen(false)} initialTab={profileModalTab} />
    </div>
  );
};

export default ProjectsPage;
