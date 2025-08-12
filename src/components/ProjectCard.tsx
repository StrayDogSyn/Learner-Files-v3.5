import React from 'react';
import { FaGithub, FaExternalLinkAlt, FaCode, FaEye } from 'react-icons/fa';
import GlassCard from './GlassCard';

interface ProjectCardProps {
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  featured?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  technologies,
  githubUrl,
  liveUrl,
  imageUrl,
  featured = false,
  className = '',
  style,
}) => {
  return (
    <GlassCard 
      variant={featured ? "premium" : "hunter"} 
      className={`project-card group ${className}`}
      padding="lg"
      style={style}
    >
      {/* Project Image */}
      {imageUrl && (
        <div className="relative mb-6 overflow-hidden rounded-lg">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-dark/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      )}
      
      {/* Project Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-display font-bold text-xl text-glass-light group-hover:text-hunter-emerald transition-colors duration-300">
            {title}
          </h3>
          {featured && (
            <span className="px-3 py-1 text-xs font-semibold bg-gradient-to-r from-hunter-emerald to-metallic-silver text-charcoal-dark rounded-full">
              Featured
            </span>
          )}
        </div>
        
        <p className="text-hunter-sage leading-relaxed">
          {description}
        </p>
      </div>
      
      {/* Technologies */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-metallic-silver mb-3 flex items-center">
          <FaCode className="mr-2" />
          Technologies
        </h4>
        <div className="flex flex-wrap gap-2">
          {technologies.map((tech, index) => (
            <span
              key={index}
              className="px-3 py-1 text-xs font-medium bg-glass-subtle border border-glass-border rounded-full text-hunter-emerald hover:bg-hunter-emerald hover:text-charcoal-dark transition-all duration-300 cursor-default"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex gap-3 mt-auto">
        {githubUrl && (
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center px-4 py-2 bg-glass-subtle border border-glass-border rounded-lg text-metallic-silver hover:bg-hunter-emerald hover:text-charcoal-dark hover:border-hunter-emerald transition-all duration-300 group/btn"
          >
            <FaGithub className="mr-2 group-hover/btn:scale-110 transition-transform duration-300" />
            <span className="text-sm font-medium">Code</span>
          </a>
        )}
        
        {liveUrl && (
          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center px-4 py-2 bg-gradient-to-r from-hunter-emerald to-metallic-silver text-charcoal-dark rounded-lg hover:from-metallic-silver hover:to-hunter-emerald transition-all duration-300 group/btn"
          >
            <FaExternalLinkAlt className="mr-2 group-hover/btn:scale-110 transition-transform duration-300" />
            <span className="text-sm font-medium">Live Demo</span>
          </a>
        )}
        
        {!githubUrl && !liveUrl && (
          <button className="flex items-center px-4 py-2 bg-glass-subtle border border-glass-border rounded-lg text-hunter-sage cursor-not-allowed">
            <FaEye className="mr-2" />
            <span className="text-sm">Coming Soon</span>
          </button>
        )}
      </div>
    </GlassCard>
  );
};

export default ProjectCard;