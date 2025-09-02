import React, { useState } from 'react';
import { ExternalLink, Github, Search, Star, Eye, Play, Loader2 } from 'lucide-react';
import { projects } from '../data/portfolioData';
import type { Project } from '../types/portfolio';
import { useGitHubData } from '../services/githubApi';

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Live':
        return 'bg-green-500/20 text-green-400 border-green-400/30';
      case 'In Development':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30';
      case 'Completed':
        return 'bg-blue-500/20 text-blue-400 border-blue-400/30';
      case 'Archived':
        return 'bg-gray-500/20 text-gray-400 border-gray-400/30';
      default:
        return 'bg-hunter-500/20 text-hunter-400 border-hunter-400/30';
    }
  };

  return (
    <div className="glass-card hover:glass-medium transition-all duration-300 group">
      {/* Project Image/Preview */}
      <div className="relative overflow-hidden rounded-t-lg">
        <div className="w-full h-48 bg-gradient-to-br from-hunter-700 to-hunter-800 flex items-center justify-center">
          <div className="text-6xl text-hunter-500 group-hover:text-emerald-400 transition-colors">
            {project.name.charAt(0)}
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
              {project.name}
            </h3>
            <p className="text-hunter-300 text-sm">{project.category}</p>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
            {project.status}
          </span>
        </div>
        
        {/* Description */}
        <p className="text-hunter-200 mb-4 leading-relaxed line-clamp-3">
          {project.description}
        </p>
        
        {/* Technologies */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {project.technologies.slice(0, 4).map((tech, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-hunter-700/50 text-emerald-300 rounded text-xs border border-emerald-400/20"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 4 && (
              <span className="px-2 py-1 bg-hunter-700/50 text-hunter-300 rounded text-xs">
                +{project.technologies.length - 4} more
              </span>
            )}
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex gap-3">
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-3 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors text-sm font-medium"
            >
              <Play size={16} className="mr-1" />
              Live Demo
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-3 py-2 glass-subtle text-hunter-200 hover:text-emerald-400 rounded-lg transition-colors text-sm font-medium"
            >
              <Github size={16} className="mr-1" />
              Code
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

const GitHubStats: React.FC = () => {
  const { loading, stats, error } = useGitHubData();

  if (loading) {
    return (
      <div className="glass-card p-6 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-emerald-400" />
        <p className="text-gray-300">Loading GitHub statistics...</p>
      </div>
    );
  }

  if (error || !stats?.success) {
    // Fallback to mock data if API fails
    const fallbackStats = {
      totalRepos: 25,
      totalStars: 150,
      totalForks: 45,
      totalCommits: 1200,
      languageStats: {
        'TypeScript': 35,
        'JavaScript': 25,
        'Python': 20,
        'React': 15,
        'Other': 5
      }
    };
    
    return (
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <Github className="w-6 h-6 text-emerald-400" />
          <h3 className="text-xl font-semibold text-white">GitHub Analytics</h3>
          <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full">Offline Mode</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-400">{fallbackStats.totalRepos}</div>
            <div className="text-sm text-gray-400">Repositories</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-400">{fallbackStats.totalStars}</div>
            <div className="text-sm text-gray-400">Stars Earned</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-400">{fallbackStats.totalForks}</div>
            <div className="text-sm text-gray-400">Forks</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-400">{fallbackStats.totalCommits}+</div>
            <div className="text-sm text-gray-400">Commits</div>
          </div>
        </div>
        
        <div>
          <h4 className="text-lg font-medium text-white mb-3">Language Distribution</h4>
          <div className="space-y-2">
            {Object.entries(fallbackStats.languageStats).map(([language, percentage]) => (
              <div key={language} className="flex items-center justify-between">
                <span className="text-gray-300">{language}</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-400 w-8">{percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const statsData = stats.data;

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <Github className="w-6 h-6 text-emerald-400" />
        <h3 className="text-xl font-semibold text-white">GitHub Analytics</h3>
        <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full">Live Data</span>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-emerald-400">{statsData.totalRepos}</div>
          <div className="text-sm text-gray-400">Repositories</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-emerald-400">{statsData.totalStars}</div>
          <div className="text-sm text-gray-400">Stars Earned</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-emerald-400">{statsData.totalForks}</div>
          <div className="text-sm text-gray-400">Forks</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-emerald-400">{statsData.totalCommits}+</div>
          <div className="text-sm text-gray-400">Commits</div>
        </div>
      </div>
      
      <div>
        <h4 className="text-lg font-medium text-white mb-3">Language Distribution</h4>
        <div className="space-y-2">
          {Object.entries(statsData.languageStats).map(([language, percentage]) => (
            <div key={language} className="flex items-center justify-between">
              <span className="text-gray-300">{language}</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-400 w-8">{percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const Portfolio: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const categories = ['All', ...Array.from(new Set(projects.map(p => p.category)))];
  const statuses = ['All', ...Array.from(new Set(projects.map(p => p.status)))];

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.technologies.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || project.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Project Portfolio
          </h1>
          <p className="text-xl text-hunter-200 max-w-3xl mx-auto leading-relaxed">
            A showcase of my technical projects, from AI-powered applications to full-stack 
            web solutions. Each project demonstrates different aspects of my expertise and 
            commitment to innovation.
          </p>
        </div>

        {/* GitHub Stats */}
        <div className="mb-12">
          <GitHubStats />
        </div>

        {/* Filters */}
        <div className="mb-8">
          <div className="glass-card p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-hunter-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search projects, technologies, or descriptions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-hunter-800/50 border border-hunter-600/50 rounded-lg text-white placeholder-hunter-400 focus:outline-none focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/50"
                  />
                </div>
              </div>
              
              {/* Category Filter */}
              <div className="lg:w-48">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-hunter-800/50 border border-hunter-600/50 rounded-lg text-white focus:outline-none focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/50"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              {/* Status Filter */}
              <div className="lg:w-48">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-4 py-3 bg-hunter-800/50 border border-hunter-600/50 rounded-lg text-white focus:outline-none focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/50"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Filter Summary */}
            <div className="mt-4 flex items-center justify-between">
              <div className="text-hunter-300 text-sm">
                Showing {filteredProjects.length} of {projects.length} projects
              </div>
              {(searchTerm || selectedCategory !== 'All' || selectedStatus !== 'All') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('All');
                    setSelectedStatus('All');
                  }}
                  className="text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <ProjectCard key={index} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl text-hunter-600 mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-white mb-2">No Projects Found</h3>
            <p className="text-hunter-300 mb-4">
              No projects match your current filters. Try adjusting your search criteria.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
                setSelectedStatus('All');
              }}
              className="glass-button-primary px-6 py-3 rounded-lg font-medium transition-all duration-300"
            >
              View All Projects
            </button>
          </div>
        )}

        {/* Digital Ecosystem */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Digital Ecosystem
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-6 text-center">
              <Github className="mx-auto text-emerald-400 mb-4" size={48} />
              <h3 className="text-xl font-bold text-white mb-2">Open Source</h3>
              <p className="text-hunter-200 mb-4">
                Contributing to the developer community through open source projects and libraries.
              </p>
              <a
                href="https://github.com/EricHunterPetross"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-button px-4 py-2 rounded-lg font-medium transition-all duration-300 inline-flex items-center"
              >
                <ExternalLink size={16} className="mr-2" />
                View GitHub
              </a>
            </div>
            
            <div className="glass-card p-6 text-center">
              <Star className="mx-auto text-emerald-400 mb-4" size={48} />
              <h3 className="text-xl font-bold text-white mb-2">Featured Work</h3>
              <p className="text-hunter-200 mb-4">
                Highlighted projects showcasing innovative solutions and technical excellence.
              </p>
              <button className="glass-button px-4 py-2 rounded-lg font-medium transition-all duration-300">
                Explore Featured
              </button>
            </div>
            
            <div className="glass-card p-6 text-center">
              <Eye className="mx-auto text-emerald-400 mb-4" size={48} />
              <h3 className="text-xl font-bold text-white mb-2">Live Demos</h3>
              <p className="text-hunter-200 mb-4">
                Interactive demonstrations of applications and tools in production environments.
              </p>
              <button className="glass-button px-4 py-2 rounded-lg font-medium transition-all duration-300">
                View Demos
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};