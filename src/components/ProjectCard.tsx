import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import type { PortfolioProject } from '../types';

interface ProjectCardProps {
  project: PortfolioProject;
  onViewDetails: (project: PortfolioProject) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onViewDetails }) => {
  const handleViewDetails = useCallback(() => {
    onViewDetails(project);
  }, [project, onViewDetails]);

  return (
    <motion.div
      className="proj-card h-100 d-flex flex-column"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, boxShadow: '0 0 24px rgba(0,255,240,0.3)' }}
      transition={{ duration: 0.4 }}
      layout
    >
      {/* Card image / emoji area */}
      <div className={`proj-img ${project.bgClass} d-flex align-items-center justify-content-center`} style={{ position: 'relative' }}>
        <span role="img" aria-label={project.title} style={{ fontSize: '3.5rem' }}>
          {project.emoji ?? '💼'}
        </span>
        {project.badge && (
          <span className={`proj-badge${project.badgeColor ? ' ' + project.badgeColor : ''}`}>
            {project.badge}
          </span>
        )}
      </div>

      {/* Card body */}
      <div className="proj-body d-flex flex-column flex-grow-1">
        <h3 className="proj-title mb-2">{project.title}</h3>
        <p className="proj-desc flex-grow-1 mb-3">{project.desc}</p>

        {/* Tech tags */}
        {project.tags && project.tags.length > 0 && (
          <div className="proj-tags mb-3">
            {project.tags.slice(0, 5).map((tag) => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        )}

        {/* Action buttons */}
        <div className="proj-links d-flex justify-content-between align-items-center">
          <div>
            <button className="proj-link" onClick={handleViewDetails}>
              View Details →
            </button>
          </div>
          {project.url && (
            <a 
              href={project.url.startsWith('http') ? project.url : `https://${project.url}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="proj-link-pink text-decoration-none"
            >
              {project.id.startsWith('user-') ? 'GitHub ↗' : 'Live Demo ↗'}
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
