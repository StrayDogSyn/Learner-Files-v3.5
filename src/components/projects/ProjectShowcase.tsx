import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Grid, List, ExternalLink, Github, Play } from 'lucide-react';
import { EnhancedProject } from '../../types/projects';
import { enhancedProjects } from '../../data/enhancedProjects';
import ProjectModal from './ProjectModal';
import ProjectFilters from './ProjectFilters';
import ProjectSearch from './ProjectSearch';

interface ProjectShowcaseProps {
  className?: string;
}

type ViewMode = 'grid' | 'list';
type SortOption = 'name' | 'date' | 'tech' | 'featured';

const ProjectShowcase: React.FC<ProjectShowcaseProps> = ({ className = '' }) => {
  const [projects, setProjects] = useState<EnhancedProject[]>(enhancedProjects);
  const [filteredProjects, setFilteredProjects] = useState<EnhancedProject[]>(enhancedProjects);
  const [selectedProject, setSelectedProject] = useState<EnhancedProject | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Filter and sort projects
  useEffect(() => {
    let filtered = [...projects];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.technologies.some(tech => 
          tech.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Apply category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(project =>
        selectedCategories.includes(project.category)
      );
    }

    // Apply technology filter
    if (selectedTechnologies.length > 0) {
      filtered = filtered.filter(project =>
        selectedTechnologies.some(tech =>
          project.technologies.includes(tech)
        )
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.title.localeCompare(b.title);
        case 'date':
          return new Date(b.completionDate || '').getTime() - new Date(a.completionDate || '').getTime();
        case 'tech':
          return b.technologies.length - a.technologies.length;
        case 'featured':
        default:
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      }
    });

    setFilteredProjects(filtered);
  }, [projects, searchQuery, selectedCategories, selectedTechnologies, sortBy]);

  const handleProjectClick = (project: EnhancedProject) => {
    setSelectedProject(project);
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
  };

  const ProjectCard: React.FC<{ project: EnhancedProject; index: number }> = ({ project, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden hover:bg-white/15 transition-all duration-300 cursor-pointer"
      onClick={() => handleProjectClick(project)}
    >
      {/* Project Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        {/* Featured Badge */}
        {project.featured && (
          <div className="absolute top-3 left-3 bg-emerald-500/90 text-white px-2 py-1 rounded-full text-xs font-medium">
            Featured
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {project.liveDemo && (
            <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
              <Play className="w-4 h-4 text-white" />
            </button>
          )}
          {project.githubRepo && (
            <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
              <Github className="w-4 h-4 text-white" />
            </button>
          )}
          <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
            <ExternalLink className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Project Info */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
          {project.title}
        </h3>
        <p className="text-gray-300 text-sm mb-4 line-clamp-2">
          {project.description}
        </p>
        
        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.slice(0, 3).map((tech, techIndex) => (
            <span
              key={techIndex}
              className="px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-medium"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs">
              +{project.technologies.length - 3}
            </span>
          )}
        </div>
        
        {/* Metrics */}
        <div className="flex justify-between items-center text-xs text-gray-400">
          <span>{project.category}</span>
          {project.lighthouseScore && (
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-emerald-400 rounded-full" />
              {project.lighthouseScore}% Performance
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );

  const ProjectListItem: React.FC<{ project: EnhancedProject; index: number }> = ({ project, index }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group flex items-center gap-4 p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer"
      onClick={() => handleProjectClick(project)}
    >
      <img
        src={project.image}
        alt={project.title}
        className="w-16 h-16 object-cover rounded-lg"
      />
      
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-lg font-semibold text-white group-hover:text-emerald-300 transition-colors">
            {project.title}
          </h3>
          {project.featured && (
            <span className="bg-emerald-500/90 text-white px-2 py-0.5 rounded-full text-xs font-medium">
              Featured
            </span>
          )}
        </div>
        <p className="text-gray-300 text-sm mb-2 line-clamp-1">
          {project.description}
        </p>
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span>{project.category}</span>
          <span>{project.technologies.length} technologies</span>
          {project.lighthouseScore && (
            <span>{project.lighthouseScore}% Performance</span>
          )}
        </div>
      </div>
      
      <div className="flex gap-2">
        {project.liveDemo && (
          <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
            <Play className="w-4 h-4 text-white" />
          </button>
        )}
        {project.githubRepo && (
          <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
            <Github className="w-4 h-4 text-white" />
          </button>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900/20 to-slate-900 ${className}`}>
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Project <span className="text-emerald-400">Gallery</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explore my comprehensive collection of projects, from AI-powered applications to full-stack solutions.
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col lg:flex-row gap-4 mb-8"
        >
          {/* Search */}
          <div className="flex-1">
            <ProjectSearch
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              isLoading={isLoading}
            />
          </div>
          
          {/* Filters */}
          <ProjectFilters
            selectedCategories={selectedCategories}
            selectedTechnologies={selectedTechnologies}
            onCategoriesChange={setSelectedCategories}
            onTechnologiesChange={setSelectedTechnologies}
            projects={projects}
          />
          
          {/* View Controls */}
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-3 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="featured">Featured First</option>
              <option value="name">Name</option>
              <option value="date">Date</option>
              <option value="tech">Technology Count</option>
            </select>
            
            <div className="flex bg-white/10 backdrop-blur-md rounded-lg border border-white/20 overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 transition-colors ${
                  viewMode === 'grid' ? 'bg-emerald-500 text-white' : 'text-gray-300 hover:text-white'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 transition-colors ${
                  viewMode === 'list' ? 'bg-emerald-500 text-white' : 'text-gray-300 hover:text-white'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <p className="text-gray-300">
            Showing {filteredProjects.length} of {projects.length} projects
          </p>
        </motion.div>

        {/* Projects Grid/List */}
        <AnimatePresence mode="wait">
          {viewMode === 'grid' ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {filteredProjects.map((project, index) => (
                <ProjectListItem key={project.id} project={project} index={index} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No projects found</h3>
            <p className="text-gray-300 mb-4">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategories([]);
                setSelectedTechnologies([]);
              }}
              className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          </motion.div>
        )}
      </div>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={handleCloseModal}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectShowcase;