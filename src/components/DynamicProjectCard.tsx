// Dynamic Project Card component with GitHub integration and glassmorphic styling

import React from 'react';
import { ExternalLink, Github, Star, GitFork, Calendar, Globe, Smartphone, Monitor, Package, Wrench, Gamepad2, Code } from 'lucide-react';
import type { ProjectCardData } from '../types/github';
import { formatNumber, formatDate, getLanguageColor, CATEGORY_ICONS } from '../types/github';

interface DynamicProjectCardProps {
  project: ProjectCardData;
  className?: string;
  showStats?: boolean;
  showCategory?: boolean;
}

const getCategoryIcon = (category: ProjectCardData['category']) => {
  const iconName = CATEGORY_ICONS[category];
  const iconProps = { className: "w-4 h-4" };
  
  switch (iconName) {
    case 'Globe': return <Globe {...iconProps} />;
    case 'Smartphone': return <Smartphone {...iconProps} />;
    case 'Monitor': return <Monitor {...iconProps} />;
    case 'Package': return <Package {...iconProps} />;
    case 'Wrench': return <Wrench {...iconProps} />;
    case 'Gamepad2': return <Gamepad2 {...iconProps} />;
    default: return <Code {...iconProps} />;
  }
};

const DynamicProjectCard: React.FC<DynamicProjectCardProps> = ({
  project,
  className = '',
  showStats = true,
  showCategory = true
}) => {
  const languageColor = getLanguageColor(project.language);
  
  return (
    <div className={`group relative ${className}`}>
      {/* Glassmorphic background */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 transition-all duration-500 group-hover:bg-white/15 group-hover:border-white/30 group-hover:shadow-2xl group-hover:shadow-hunter-green/20" />
      
      {/* Featured badge */}
      {project.featured && (
        <div className="absolute -top-2 -right-2 z-10">
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full shadow-lg">
            ⭐ Featured
          </div>
        </div>
      )}
      
      {/* Content */}
      <div className="relative p-6 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {showCategory && (
                <div className="flex items-center gap-1 text-hunter-green-300">
                  {getCategoryIcon(project.category)}
                  <span className="text-xs font-medium capitalize">{project.category}</span>
                </div>
              )}
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-hunter-green-300 transition-colors duration-300">
              {project.title}
            </h3>
            
            <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
              {project.description}
            </p>
          </div>
        </div>

        {/* Technologies */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {project.technologies.slice(0, 4).map((tech, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs font-medium bg-white/10 text-white rounded-md border border-white/20 backdrop-blur-sm"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 4 && (
              <span className="px-2 py-1 text-xs font-medium bg-white/5 text-gray-400 rounded-md border border-white/10">
                +{project.technologies.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Language indicator */}
        <div className="flex items-center gap-2 mb-4">
          <div 
            className="language-indicator"
            data-language={project.language.toLowerCase()}
          />
          <span className="text-sm text-gray-300 font-medium">{project.language}</span>
          <span className="text-xs text-gray-500">•</span>
          <span className="text-xs text-gray-500">{formatDate(project.lastUpdated)}</span>
        </div>

        {/* Stats */}
        {showStats && (
          <div className="flex items-center gap-4 mb-4 text-sm text-gray-300">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400" />
              <span>{formatNumber(project.stars)}</span>
            </div>
            <div className="flex items-center gap-1">
              <GitFork className="w-4 h-4 text-blue-400" />
              <span>{formatNumber(project.forks)}</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-auto pt-4 border-t border-white/10">
          <div className="flex gap-3">
            {/* GitHub Link */}
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-white/20 hover:border-white/30 flex-1 justify-center"
            >
              <Github className="w-4 h-4" />
              <span className="text-sm font-medium">Code</span>
            </a>
            
            {/* Live Demo Link */}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-hunter-green-600 to-hunter-green-700 hover:from-hunter-green-500 hover:to-hunter-green-600 text-white rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex-1 justify-center"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="text-sm font-medium">Demo</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicProjectCard;