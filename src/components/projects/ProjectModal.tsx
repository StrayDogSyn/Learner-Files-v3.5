import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Github, Play, Calendar, Code, Users, Award, TrendingUp } from 'lucide-react';
import { EnhancedProject } from '../../types/projects';

interface ProjectModalProps {
  project: EnhancedProject;
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-4xl max-h-[90vh] bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[90vh]">
          {/* Hero Section */}
          <div className="relative h-64 md:h-80">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            {/* Featured Badge */}
            {project.featured && (
              <div className="absolute top-4 left-4 bg-emerald-500/90 text-white px-3 py-1 rounded-full text-sm font-medium">
                <Award className="w-4 h-4 inline mr-1" />
                Featured Project
              </div>
            )}
            
            {/* Title and Actions */}
            <div className="absolute bottom-6 left-6 right-6">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {project.title}
              </h1>
              <p className="text-lg text-gray-200 mb-4">
                {project.description}
              </p>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                {project.liveDemo && (
                  <a
                    href={project.liveDemo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
                  >
                    <Play className="w-4 h-4" />
                    Live Demo
                  </a>
                )}
                {project.githubRepo && (
                  <a
                    href={project.githubRepo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors backdrop-blur-sm"
                  >
                    <Github className="w-4 h-4" />
                    Source Code
                  </a>
                )}
                <button className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors backdrop-blur-sm">
                  <ExternalLink className="w-4 h-4" />
                  View Details
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            {/* Project Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
                <Calendar className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                <div className="text-sm text-gray-400">Completed</div>
                <div className="text-lg font-semibold text-white">
                  {project.completionDate ? new Date(project.completionDate).getFullYear() : 'Ongoing'}
                </div>
              </div>
              
              <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
                <Code className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                <div className="text-sm text-gray-400">Technologies</div>
                <div className="text-lg font-semibold text-white">
                  {project.technologies.length}
                </div>
              </div>
              
              <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
                <Users className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                <div className="text-sm text-gray-400">Team Size</div>
                <div className="text-lg font-semibold text-white">
                  {project.teamSize || 'Solo'}
                </div>
              </div>
              
              {project.lighthouseScore && (
                <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
                  <TrendingUp className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                  <div className="text-sm text-gray-400">Performance</div>
                  <div className="text-lg font-semibold text-white">
                    {project.lighthouseScore}%
                  </div>
                </div>
              )}
            </div>

            {/* Technologies */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Technologies Used</h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-sm font-medium border border-emerald-500/30"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Key Features */}
            {project.keyFeatures && project.keyFeatures.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4">Key Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.keyFeatures.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 bg-white/5 rounded-lg border border-white/10"
                    >
                      <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-white mb-1">{feature.title}</h4>
                        <p className="text-sm text-gray-300">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Challenges & Solutions */}
            {project.challenges && project.challenges.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4">Challenges &amp; Solutions</h3>
                <div className="space-y-4">
                  {project.challenges.map((challenge, index) => (
                    <div
                      key={index}
                      className="p-4 bg-white/5 rounded-lg border border-white/10"
                    >
                      <h4 className="font-medium text-white mb-2">{challenge.challenge}</h4>
                      <p className="text-sm text-gray-300 mb-2">{challenge.solution}</p>
                      {challenge.impact && (
                        <p className="text-xs text-emerald-300">
                          <strong>Impact:</strong> {challenge.impact}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Performance Metrics */}
            {project.performanceMetrics && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4">Performance Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(project.performanceMetrics).map(([key, value]) => (
                    <div
                      key={key}
                      className="p-4 bg-white/5 rounded-lg border border-white/10 text-center"
                    >
                      <div className="text-2xl font-bold text-emerald-400 mb-1">{value}</div>
                      <div className="text-sm text-gray-300 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Lessons Learned */}
            {project.lessonsLearned && project.lessonsLearned.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4">Lessons Learned</h3>
                <div className="space-y-3">
                  {project.lessonsLearned.map((lesson, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/10"
                    >
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-2 flex-shrink-0" />
                      <p className="text-sm text-gray-300">{lesson}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Project Category & Tags */}
            <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Category:</span>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium">
                  {project.category}
                </span>
              </div>
              
              {project.tags && project.tags.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">Tags:</span>
                  <div className="flex flex-wrap gap-1">
                    {project.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-0.5 bg-gray-500/20 text-gray-300 rounded text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProjectModal;