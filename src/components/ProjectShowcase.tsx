// Project Showcase component with dynamic GitHub integration

import React, { useState, useMemo } from 'react';
import { Search, Filter, RefreshCw, AlertCircle } from 'lucide-react';
import { useGitHub } from '../hooks/useGitHub';
import { useAnalytics } from '../hooks/useAnalytics';
import { useLazyLoad } from '../hooks/useLazyLoad';
import DynamicProjectCard from './DynamicProjectCard';
import type { ProjectCardData } from '../types/github';

interface ProjectShowcaseProps {
  className?: string;
  maxProjects?: number;
  showSearch?: boolean;
  showFilters?: boolean;
  title?: string;
  subtitle?: string;
}

const ProjectShowcase: React.FC<ProjectShowcaseProps> = ({
  className = '',
  maxProjects = 6,
  showSearch = true,
  showFilters = true,
  title = 'Featured Projects',
  subtitle = 'Explore my latest work and contributions'
}) => {
  const { trackEvent } = useAnalytics();
  const { projectCards, loading, error, refreshData } = useGitHub();
  const { elementRef: sectionRef, isVisible } = useLazyLoad({ threshold: 0.1 });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Get unique categories from projects
  const categories = useMemo(() => {
    const cats = new Set(projectCards.map(project => project.category));
    return ['all', ...Array.from(cats)];
  }, [projectCards]);

  // Filter and search projects
  const filteredProjects = useMemo(() => {
    let filtered = projectCards;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(project => project.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(project => 
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.technologies.some(tech => tech.toLowerCase().includes(query)) ||
        project.language.toLowerCase().includes(query)
      );
    }

    // Limit results
    return filtered.slice(0, maxProjects);
  }, [projectCards, selectedCategory, searchQuery, maxProjects]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshData();
    } finally {
      setIsRefreshing(false);
    }
  };

  if (loading && projectCards.length === 0) {
    return (
      <section className={`py-20 ${className}`}>
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {title}
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              {subtitle}
            </p>
          </div>

          {/* Loading Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="relative">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 animate-pulse" />
                <div className="relative p-6 h-80">
                  <div className="h-6 bg-white/20 rounded mb-4 animate-pulse" />
                  <div className="h-4 bg-white/20 rounded mb-2 animate-pulse" />
                  <div className="h-4 bg-white/20 rounded mb-4 w-3/4 animate-pulse" />
                  <div className="flex gap-2 mb-4">
                    <div className="h-6 w-16 bg-white/20 rounded animate-pulse" />
                    <div className="h-6 w-20 bg-white/20 rounded animate-pulse" />
                  </div>
                  <div className="mt-auto pt-4">
                    <div className="h-10 bg-white/20 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className={`py-20 ${className}`}>
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {title}
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            {subtitle}
          </p>

          {/* Controls */}
          {(showSearch || showFilters) && (
            <div className="flex flex-col md:flex-row gap-4 items-center justify-center max-w-4xl mx-auto">
              {/* Search */}
              {showSearch && (
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-hunter-green-400 focus:ring-2 focus:ring-hunter-green-400/20 transition-all duration-300"
                  />
                </div>
              )}

              {/* Category Filter */}
              {showFilters && (
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="pl-10 pr-8 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white focus:outline-none focus:border-hunter-green-400 focus:ring-2 focus:ring-hunter-green-400/20 transition-all duration-300 appearance-none cursor-pointer"
                  >
                    {categories.map(category => (
                      <option key={category} value={category} className="bg-gray-800 text-white">
                        {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2 px-4 py-3 bg-hunter-green-600 hover:bg-hunter-green-700 disabled:bg-hunter-green-800 text-white rounded-xl transition-all duration-300 hover:scale-105 disabled:scale-100 disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="font-medium">Refresh</span>
              </button>
            </div>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-8">
            <div className="relative max-w-md mx-auto">
              <div className="absolute inset-0 bg-red-500/10 backdrop-blur-md rounded-xl border border-red-500/20" />
              <div className="relative p-4 text-center">
                <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                <p className="text-red-300 text-sm font-medium">Failed to load projects</p>
                <p className="text-red-400/70 text-xs mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isVisible && filteredProjects.map((project) => (
              <DynamicProjectCard
                key={project.id}
                project={project}
                className="h-full"
                showStats={true}
                showCategory={true}
              />
            ))}
          </div>
        ) : (
          !loading && (
            <div className="text-center py-16">
              <div className="relative max-w-md mx-auto">
                <div className="absolute inset-0 bg-white/5 backdrop-blur-md rounded-xl border border-white/10" />
                <div className="relative p-8">
                  <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No projects found</h3>
                  <p className="text-gray-400 text-sm">
                    {searchQuery || selectedCategory !== 'all' 
                      ? 'Try adjusting your search or filter criteria'
                      : 'Projects will appear here once loaded from GitHub'
                    }
                  </p>
                </div>
              </div>
            </div>
          )
        )}

        {/* Results Info */}
        {filteredProjects.length > 0 && (
          <div className="text-center mt-12">
            <p className="text-gray-400 text-sm">
              Showing {filteredProjects.length} of {projectCards.length} projects
              {searchQuery && ` matching "${searchQuery}"`}
              {selectedCategory !== 'all' && ` in ${selectedCategory}`}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectShowcase;