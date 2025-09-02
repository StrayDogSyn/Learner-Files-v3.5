import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  FaGithub,
  FaExternalLinkAlt,
  FaPlay,
  FaCode,
  FaRocket,
  FaFilter,
  FaSearch,
  FaStar,
  FaEye,
  FaCodeBranch,
  FaCalendarAlt,
  FaTags,
  FaLaptopCode,
  FaGamepad,
  FaBrain,
  FaMobile,
  FaCogs,
  FaExpand,
  FaTimes,
} from 'react-icons/fa';
import { enhancedProjects, getProjectStats, getOverallProjectStats } from '../data/enhancedProjects';
import type { EnhancedProject } from '../data/enhancedProjects';
import type {
  ProjectCard,
  ProjectFilter,
  ProjectSort,
  ProjectSearch,
  ViewMode,
} from '../types/project';
import { githubApi } from '../services/githubApi';
import GlassCard from './GlassCard';
import BrandImage from './BrandImage';
import InteractiveDemo from './InteractiveDemo';
import MarvelQuizDemo from './MarvelQuizDemo';

interface AdvancedProjectShowcaseProps {
  initialViewMode?: ViewMode;
  showFilters?: boolean;
  showSearch?: boolean;
  maxProjects?: number;
}

// Utility functions
const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'web-app':
      return <FaLaptopCode />;
    case 'game':
      return <FaGamepad />;
    case 'ai':
      return <FaBrain />;
    case 'mobile':
      return <FaMobile />;
    case 'api':
      return <FaCogs />;
    default:
      return <FaLaptopCode />;
  }
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'beginner':
      return 'text-green-400';
    case 'intermediate':
      return 'text-yellow-400';
    case 'advanced':
      return 'text-orange-400';
    case 'expert':
      return 'text-red-400';
    default:
      return 'text-gray-400';
  }
};

const AdvancedProjectShowcase: React.FC<AdvancedProjectShowcaseProps> = ({
  initialViewMode = 'grid',
  showFilters = true,
  showSearch = true,
  maxProjects,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode);
  const [activeFilters, setActiveFilters] = useState<ProjectFilter>({});
  const [sortConfig, setSortConfig] = useState<ProjectSort>({
    field: 'priority',
    direction: 'asc',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<EnhancedProject | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [githubStats, setGithubStats] = useState<Record<string, any>>({});
  const [showDemo, setShowDemo] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize component
  useEffect(() => {
    setIsInitialized(true);
  }, []);

  // Fetch GitHub stats for projects
  useEffect(() => {
    const fetchGitHubStats = async () => {
      setIsLoading(true);
      const stats: Record<string, any> = {};

      // Add null check for enhancedProjects
      if (enhancedProjects && Array.isArray(enhancedProjects)) {
        for (const project of enhancedProjects) {
          if (project.githubRepo) {
            try {
              const repoName = project.githubRepo.split('/').pop();
              if (repoName) {
                const metrics = await githubApi.getProjectMetrics(repoName);
                stats[project.id] = metrics;
              }
            } catch (error) {
              console.warn(`Failed to fetch GitHub stats for ${project.id}:`, error);
            }
          }
        }
      }

      setGithubStats(stats);
      setIsLoading(false);
    };

    fetchGitHubStats();
  }, []);

  // Filter and sort projects
  const filteredAndSortedProjects = useMemo(() => {
    // Ensure we always have an array to work with
    if (!enhancedProjects || !Array.isArray(enhancedProjects) || enhancedProjects.length === 0) {
      return [];
    }
    
    let filtered: EnhancedProject[] = [...enhancedProjects];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        project =>
          project.title?.toLowerCase().includes(query) ||
          project.description?.toLowerCase().includes(query) ||
          (project.techStack || []).some(tech => tech.toLowerCase().includes(query)) ||
          (project.tags || []).some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply category filter
    if (activeFilters.category) {
      filtered = filtered.filter(project => project.category === activeFilters.category);
    }

    // Apply status filter
    if (activeFilters.status) {
      filtered = filtered.filter(project => project.status === activeFilters.status);
    }

    // Apply difficulty filter
    if (activeFilters.difficulty) {
      filtered = filtered.filter(project => project.complexity === activeFilters.difficulty);
    }

    // Apply featured filter
    if (activeFilters.featured !== undefined) {
      filtered = filtered.filter(project => project.featured === activeFilters.featured);
    }

    // Apply live demo filter
    if (activeFilters.hasLiveDemo) {
      filtered = filtered.filter(project => !!project.liveUrl);
    }

    // Apply GitHub repo filter
    if (activeFilters.hasGitHubRepo) {
      filtered = filtered.filter(project => !!project.githubUrl);
    }

    // Apply tech stack filter
    if (activeFilters.techStack && activeFilters.techStack.length > 0) {
      filtered = filtered.filter(project =>
        activeFilters.techStack!.some(tech =>
          (project.techStack || []).some(projectTech =>
            projectTech.toLowerCase().includes(tech.toLowerCase())
          )
        )
      );
    }

    // Apply tags filter
    if (activeFilters.tags && activeFilters.tags.length > 0) {
      filtered = filtered.filter(project =>
        activeFilters.tags!.some(tag => (project.tags || []).includes(tag))
      );
    }

    // Sort projects
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortConfig.field) {
        case 'priority':
          aValue = a.priority;
          bValue = b.priority;
          break;
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'difficulty':
          const difficultyOrder = { beginner: 1, intermediate: 2, advanced: 3, expert: 4 };
          aValue = difficultyOrder[a.complexity || 'beginner'];
          bValue = difficultyOrder[b.complexity || 'beginner'];
          break;
        case 'lastUpdated':
          aValue = new Date(a.stats?.lastUpdated || 0);
          bValue = new Date(b.stats?.lastUpdated || 0);
          break;
        default:
          aValue = a.priority || 0;
          bValue = b.priority || 0;
      }

      if (sortConfig.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Limit projects if specified
    if (maxProjects) {
      filtered = filtered.slice(0, maxProjects);
    }

    return filtered;
  }, [enhancedProjects, activeFilters, sortConfig, searchQuery, maxProjects]);

  // Get project statistics
  const projectStats = useMemo(() => getOverallProjectStats(), []);

  // Handle filter changes
  const handleFilterChange = useCallback((filter: Partial<ProjectFilter>) => {
    setActiveFilters(prev => ({ ...prev, ...filter }));
  }, []);

  // Handle sort changes
  const handleSortChange = useCallback((field: ProjectSort['field']) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setActiveFilters({});
    setSearchQuery('');
  }, []);

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'web-app':
        return <FaLaptopCode />;
      case 'game':
        return <FaGamepad />;
      case 'ai':
        return <FaBrain />;
      case 'mobile':
        return <FaMobile />;
      case 'automation':
        return <FaCogs />;
      case 'portfolio':
        return <FaCode />;
      case 'api':
        return <FaRocket />;
      case 'featured':
        return <FaRocket />;
      default:
        return <FaCode />;
    }
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'text-green-400';
      case 'intermediate':
        return 'text-yellow-400';
      case 'advanced':
        return 'text-orange-400';
      case 'expert':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  // Don't render until component is initialized
  if (!isInitialized) {
    return (
      <div className='text-center py-12'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-hunter-emerald mx-auto'></div>
        <p className='text-hunter-sage mt-4'>Initializing...</p>
      </div>
    );
  }

  return (
    <div className='w-full'>
      {/* Header with Stats */}
      <div className='mb-8'>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-6'>
          <GlassCard variant='hunter' className='text-center p-4'>
            <div className='text-2xl font-bold text-hunter-emerald'>{projectStats.total}</div>
            <div className='text-sm text-hunter-sage'>Total Projects</div>
          </GlassCard>
          <GlassCard variant='hunter' className='text-center p-4'>
            <div className='text-2xl font-bold text-hunter-emerald'>{projectStats.live}</div>
            <div className='text-sm text-hunter-sage'>Live Projects</div>
          </GlassCard>
          <GlassCard variant='hunter' className='text-center p-4'>
            <div className='text-2xl font-bold text-hunter-emerald'>{projectStats.featured}</div>
            <div className='text-sm text-hunter-sage'>Featured</div>
          </GlassCard>
          <GlassCard variant='hunter' className='text-center p-4'>
            <div className='text-2xl font-bold text-hunter-emerald'>
              {Math.round(projectStats.averageLighthouseScore)}
            </div>
            <div className='text-sm text-hunter-sage'>Avg Performance</div>
          </GlassCard>
        </div>
      </div>

      {/* Search and Filters */}
      {(showSearch || showFilters) && (
        <div className='mb-8 space-y-4'>
          {/* Search Bar */}
          {showSearch && (
            <div className='relative'>
              <FaSearch className='absolute left-4 top-1/2 transform -translate-y-1/2 text-hunter-sage' />
              <input
                type='text'
                placeholder='Search projects, technologies, or features...'
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className='w-full pl-12 pr-4 py-3 bg-glass-subtle border border-glass-border rounded-lg focus:ring-2 focus:ring-hunter-emerald focus:border-hunter-emerald text-glass-light placeholder-hunter-sage transition-all duration-300'
              />
            </div>
          )}

          {/* Filters */}
          {showFilters && (
            <div className='flex flex-wrap gap-4 items-center'>
              {/* Category Filter */}
              <select
                value={activeFilters.category || ''}
                onChange={e =>
                  handleFilterChange({
                    category: (e.target.value as ProjectCard['category']) || undefined,
                  })
                }
                aria-label="Filter projects by category"
                className='px-4 py-2 bg-glass-subtle border border-glass-border rounded-lg text-glass-light focus:ring-2 focus:ring-hunter-emerald focus:border-hunter-emerald transition-all duration-300'
              >
                <option value=''>All Categories</option>
                {projectStats.categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>

              {/* Difficulty Filter */}
              <select
                value={activeFilters.difficulty || ''}
                onChange={e =>
                  handleFilterChange({
                    difficulty: (e.target.value as ProjectCard['difficulty']) || undefined,
                  })
                }
                aria-label="Filter projects by difficulty level"
                className='px-4 py-2 bg-glass-subtle border border-glass-border rounded-lg text-glass-light focus:ring-2 focus:ring-hunter-emerald focus:border-hunter-emerald transition-all duration-300'
              >
                <option value=''>All Difficulties</option>
                {projectStats.difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </option>
                ))}
              </select>

              {/* Featured Filter */}
              <label className='flex items-center space-x-2 cursor-pointer'>
                <input
                  type='checkbox'
                  checked={activeFilters.featured || false}
                  onChange={e => handleFilterChange({ featured: e.target.checked })}
                  className='w-4 h-4 text-hunter-emerald bg-glass-subtle border-glass-border rounded focus:ring-hunter-emerald'
                />
                <span className='text-hunter-sage'>Featured Only</span>
              </label>

              {/* Live Demo Filter */}
              <label className='flex items-center space-x-2 cursor-pointer'>
                <input
                  type='checkbox'
                  checked={activeFilters.hasLiveDemo || false}
                  onChange={e => handleFilterChange({ hasLiveDemo: e.target.checked })}
                  className='w-4 h-4 text-hunter-emerald bg-glass-subtle border-glass-border rounded focus:ring-hunter-emerald'
                />
                <span className='text-hunter-sage'>Live Demo</span>
              </label>

              {/* Clear Filters */}
              <button
                onClick={clearFilters}
                className='px-4 py-2 text-hunter-emerald hover:text-charcoal-dark hover:bg-hunter-emerald rounded-lg transition-all duration-300'
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Sort Options */}
          <div className='flex items-center space-x-4'>
            <span className='text-hunter-sage'>Sort by:</span>
            {['priority', 'title', 'difficulty', 'githubStars'].map(field => (
              <button
                key={field}
                onClick={() => handleSortChange(field as ProjectSort['field'])}
                className={`px-3 py-1 rounded-lg transition-all duration-300 ${
                  sortConfig.field === field
                    ? 'bg-hunter-emerald text-charcoal-dark'
                    : 'text-hunter-emerald hover:bg-hunter-emerald hover:text-charcoal-dark'
                }`}
              >
                {field.charAt(0).toUpperCase() + field.slice(1)}
                {sortConfig.field === field && (
                  <span className='ml-1'>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* View Mode Toggle */}
      <div className='flex justify-between items-center mb-6'>
        <div className='text-lg font-semibold text-glass-light'>
          {(filteredAndSortedProjects || []).length} Project
          {(filteredAndSortedProjects || []).length !== 1 ? 's' : ''} Found
        </div>
        <div className='flex space-x-2'>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-all duration-300 ${
              viewMode === 'grid'
                ? 'bg-hunter-emerald text-charcoal-dark'
                : 'text-hunter-emerald hover:bg-hunter-emerald hover:text-charcoal-dark'
            }`}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-all duration-300 ${
              viewMode === 'list'
                ? 'bg-hunter-emerald text-charcoal-dark'
                : 'text-hunter-emerald hover:bg-hunter-emerald hover:text-charcoal-dark'
            }`}
          >
            List
          </button>
        </div>
      </div>

      {/* Projects Grid/List */}
      {isLoading ? (
        <div className='text-center py-12'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-hunter-emerald mx-auto'></div>
          <p className='text-hunter-sage mt-4'>Loading project data...</p>
        </div>
      ) : (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-6'
          }
        >
          {filteredAndSortedProjects && filteredAndSortedProjects.length > 0 ? (
            (filteredAndSortedProjects || []).map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                viewMode={viewMode}
                githubStats={githubStats[project.id]}
                onSelect={setSelectedProject}
                onDemoClick={() => setShowDemo(true)}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-metallic-silver/70">No projects found matching your criteria.</p>
            </div>
          )}
        </div>
      )}

      {/* No Results */}
      {(filteredAndSortedProjects || []).length === 0 && !isLoading && (
        <div className='text-center py-12'>
          <div className='text-6xl mb-4'>🔍</div>
          <h3 className='text-xl font-semibold text-glass-light mb-2'>No projects found</h3>
          <p className='text-hunter-sage mb-4'>Try adjusting your search or filters</p>
          <button
            onClick={clearFilters}
            className='px-6 py-3 bg-hunter-emerald text-charcoal-dark rounded-lg hover:shadow-lg transition-all duration-300'
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Interactive Demo Modal */}
      {showDemo && selectedProject && (
        <div className='fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4'>
          <div className='bg-glass-dark border border-glass-border rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden'>
            <div className='flex items-center justify-between p-4 border-b border-glass-border'>
              <h3 className='text-xl font-semibold text-white'>
                Interactive Demo: {selectedProject.title}
              </h3>
              <button
                onClick={() => setShowDemo(false)}
                aria-label="Close demo modal"
                className='text-gray-300 hover:text-white transition-colors'
              >
                <FaTimes className='text-xl' />
              </button>
            </div>
            <div className='p-4'>
              {selectedProject.demoConfig &&
                (selectedProject.id === 'marvel-quiz-game' ? (
                  <MarvelQuizDemo
                    config={selectedProject.demoConfig}
                    onDemoStart={sessionId => console.log('Demo started:', sessionId)}
                    onDemoComplete={(sessionId, analytics) =>
                      console.log('Demo completed:', analytics)
                    }
                    onError={error => console.error('Demo error:', error)}
                  />
                ) : (
                  <InteractiveDemo
                    config={selectedProject.demoConfig}
                    onDemoStart={sessionId => console.log('Demo started:', sessionId)}
                    onDemoComplete={(sessionId, analytics) =>
                      console.log('Demo completed:', analytics)
                    }
                    onError={error => console.error('Demo error:', error)}
                  />
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Individual Project Card Component
interface ProjectCardProps {
  project: EnhancedProject;
  viewMode: ViewMode;
  githubStats?: any;
  onSelect: (project: EnhancedProject) => void;
  onDemoClick: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  viewMode,
  githubStats,
  onSelect,
  onDemoClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  if (viewMode === 'list') {
    return (
      <GlassCard variant='premium' className='p-6'>
        <div className='flex items-start space-x-6'>
          {/* Project Image */}
          <div className='flex-shrink-0'>
            <img
              src={project.screenshots?.[0]?.url || project.image || 'https://via.placeholder.com/128x96?text=No+Image'}
              alt={project.screenshots?.[0]?.alt || project.title || 'Project image'}
              className='w-32 h-24 object-cover rounded-lg'
            />
          </div>

          {/* Project Content */}
          <div className='flex-1 min-w-0'>
            <div className='flex items-start justify-between mb-2'>
              <div>
                <h3 className='text-xl font-bold text-glass-light mb-1'>{project.title}</h3>
                <div className='flex items-center space-x-4 text-sm text-hunter-sage'>
                  <span className='flex items-center'>
                    {getCategoryIcon(project.category)}
                    <span className='ml-1'>{project.category}</span>
                  </span>
                  <span className={`flex items-center ${getDifficultyColor(project.complexity)}`}>
                    <span className='w-2 h-2 rounded-full bg-current mr-1'></span>
                    {project.complexity}
                  </span>
                  {project.featured && (
                    <span className='text-hunter-emerald font-semibold'>Featured</span>
                  )}
                </div>
              </div>

              {/* GitHub Stats */}
              {githubStats && (
                <div className='flex items-center space-x-4 text-sm'>
                  <span className='flex items-center text-hunter-sage'>
                    <FaStar className='mr-1' />
                    {githubStats.stars || 0}
                  </span>
                  <span className='flex items-center text-hunter-sage'>
                    <FaCodeBranch className='mr-1' />
                    {githubStats.forks || 0}
                  </span>
                </div>
              )}
            </div>

            <p className='text-hunter-sage mb-3'>{project.description}</p>

            {/* Tech Stack */}
            <div className='flex flex-wrap gap-2 mb-4'>
              {(project.techStack || []).slice(0, 5).map((tech, index) => (
                <span
                  key={index}
                  className='px-2 py-1 text-xs bg-glass-subtle border border-glass-border rounded text-hunter-emerald'
                >
                  {tech}
                </span>
              ))}
              {(project.techStack || []).length > 5 && (
                <span className='px-2 py-1 text-xs bg-glass-subtle border border-glass-border rounded text-hunter-sage'>
                  +{(project.techStack || []).length - 5} more
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className='flex items-center space-x-3'>
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center px-4 py-2 bg-hunter-emerald text-charcoal-dark rounded-lg hover:shadow-lg transition-all duration-300'
                >
                  <FaPlay className='mr-2' />
                  Live Demo
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center px-4 py-2 border border-hunter-emerald text-hunter-emerald rounded-lg hover:bg-hunter-emerald hover:text-charcoal-dark transition-all duration-300'
                >
                  <FaGithub className='mr-2' />
                  View Code
                </a>
              )}
              {project.demoConfig && (
                <button
                  onClick={onDemoClick}
                  className='flex items-center px-4 py-2 border border-hunter-emerald text-hunter-emerald rounded-lg hover:bg-hunter-emerald hover:text-charcoal-dark transition-all duration-300'
                >
                  <FaCode className='mr-2' />
                  Interactive Demo
                </button>
              )}
            </div>
          </div>
        </div>
      </GlassCard>
    );
  }

  // Grid View
  return (
    <div onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <GlassCard
        variant='premium'
        className='overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-hunter-emerald/10'
      >
        {/* Project Image */}
        <div className='relative overflow-hidden'>
          <img
            src={project.screenshots?.[0]?.url || project.image || 'https://via.placeholder.com/400x200?text=No+Image'}
            alt={project.screenshots?.[0]?.alt || project.title || 'Project image'}
            className={`w-full h-48 object-cover transition-transform duration-300 ${
              isHovered ? 'scale-105' : 'scale-100'
            }`}
          />

          {/* Overlay */}
          <div
            className={`absolute inset-0 bg-gradient-to-t from-charcoal-dark/80 via-transparent to-transparent transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className='absolute bottom-4 left-4 right-4'>
              <div className='flex space-x-2'>
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex items-center px-3 py-2 bg-hunter-emerald text-charcoal-dark rounded-lg hover:shadow-lg transition-all duration-300'
                  >
                    <FaPlay className='mr-1' />
                    Demo
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex items-center px-3 py-2 bg-glass-subtle border border-glass-border text-metallic-silver rounded-lg hover:bg-hunter-emerald hover:text-charcoal-dark transition-all duration-300'
                  >
                    <FaGithub className='mr-1' />
                    Code
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Featured Badge */}
          {project.featured && (
            <div className='absolute top-4 right-4'>
              <span className='px-2 py-1 bg-hunter-emerald text-charcoal-dark text-xs font-semibold rounded'>
                Featured
              </span>
            </div>
          )}
        </div>

        {/* Project Content */}
        <div className='p-6'>
          {/* Header */}
          <div className='flex items-start justify-between mb-3'>
            <div>
              <h3 className='text-xl font-bold text-glass-light mb-1'>{project.title}</h3>
              <div className='flex items-center space-x-3 text-sm'>
                <span className='flex items-center text-hunter-sage'>
                  {getCategoryIcon(project.category)}
                  <span className='ml-1'>{project.category}</span>
                </span>
                <span className={`flex items-center ${getDifficultyColor(project.complexity)}`}>
                  <span className='w-2 h-2 rounded-full bg-current mr-1'></span>
                  {project.complexity}
                </span>
              </div>
            </div>

            {/* GitHub Stats */}
            {githubStats && (
              <div className='flex items-center space-x-2 text-sm'>
                <span className='flex items-center text-hunter-sage'>
                  <FaStar className='mr-1' />
                  {githubStats.stars || 0}
                </span>
              </div>
            )}
          </div>

          {/* Description */}
          <p className='text-hunter-sage mb-4 line-clamp-2'>{project.description}</p>

          {/* Tech Stack */}
          <div className='flex flex-wrap gap-2 mb-4'>
            {(project.techStack || []).slice(0, 4).map((tech, index) => (
              <span
                key={index}
                className='px-2 py-1 text-xs bg-glass-subtle border border-glass-border rounded text-hunter-emerald'
              >
                {tech}
              </span>
            ))}
            {(project.techStack || []).length > 4 && (
              <span className='px-2 py-1 text-xs bg-glass-subtle border border-glass-border rounded text-hunter-sage'>
                +{(project.techStack || []).length - 4}
              </span>
            )}
          </div>

          {/* Metrics */}
          {project.metrics && (
            <div className='grid grid-cols-2 gap-2 mb-4 text-xs'>
              <div className='flex items-center justify-between'>
                <span className='text-hunter-sage'>Performance:</span>
                <span className='text-hunter-emerald'>{project.metrics.performance}</span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-hunter-sage'>Lighthouse:</span>
                <span className='text-hunter-emerald'>{project.metrics.lighthouseScore}</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className='flex items-center justify-between'>
            <div className='flex space-x-2'>
              {project.liveDemo && (
                <a
                  href={project.liveDemo}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center px-3 py-2 bg-hunter-emerald text-charcoal-dark rounded-lg hover:shadow-lg transition-all duration-300 text-sm'
                >
                  <FaPlay className='mr-1' />
                  Demo
                </a>
              )}
              {project.githubRepo && (
                <a
                  href={project.githubRepo}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center px-3 py-2 border border-hunter-emerald text-hunter-emerald rounded-lg hover:bg-hunter-emerald hover:text-charcoal-dark transition-all duration-300 text-sm'
                >
                  <FaGithub className='mr-1' />
                  Code
                </a>
              )}
            </div>

            {/* Brand Watermark */}
            <div className='opacity-20'>
              <BrandImage
                assetKey='circa2024'
                alt='StrayDog Syndications 2024'
                width={24}
                height={24}
                className='filter brightness-0 invert'
                lazy={false}
              />
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default AdvancedProjectShowcase;
