import { useState, useEffect, useCallback, useMemo } from 'react';
import { EnhancedProject, ProjectFilter, ProjectSort, ProjectSearchResult } from '../types/projects';
import { ProjectAnalyzer } from '../lib/project-analyzer';
import { SearchEngine } from '../lib/search-engine';
import { AnalyticsTracker } from '../lib/analytics-tracker';
import projectsCatalog from '../data/projects-catalog.json';

interface UseProjectsOptions {
  enableAnalytics?: boolean;
  enableSearch?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

interface UseProjectsReturn {
  // Data
  projects: EnhancedProject[];
  filteredProjects: EnhancedProject[];
  totalProjects: number;
  
  // Loading states
  loading: boolean;
  analyzing: boolean;
  error: string | null;
  
  // Filters and search
  filters: ProjectFilter;
  searchQuery: string;
  sortBy: ProjectSort;
  searchResults: ProjectSearchResult | null;
  
  // Actions
  setFilters: (filters: Partial<ProjectFilter>) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sort: ProjectSort) => void;
  clearFilters: () => void;
  refreshProjects: () => Promise<void>;
  analyzeProject: (projectId: string) => Promise<void>;
  
  // Utilities
  getProjectById: (id: string) => EnhancedProject | undefined;
  getProjectsByCategory: (category: string) => EnhancedProject[];
  getProjectsByTechnology: (tech: string) => EnhancedProject[];
  getFeaturedProjects: () => EnhancedProject[];
  getRecentProjects: (limit?: number) => EnhancedProject[];
  
  // Statistics
  stats: {
    totalProjects: number;
    categories: string[];
    technologies: string[];
    averageRating: number;
    totalViews: number;
    totalStars: number;
  };
}

const defaultFilters: ProjectFilter = {
  categories: [],
  technologies: [],
  status: [],
  difficulty: [],
  featured: undefined,
  dateRange: undefined,
  ratingRange: undefined,
  searchTags: []
};

const defaultSort: ProjectSort = {
  field: 'lastUpdated',
  direction: 'desc'
};

export const useProjects = (options: UseProjectsOptions = {}): UseProjectsReturn => {
  const {
    enableAnalytics = true,
    enableSearch = true,
    autoRefresh = false,
    refreshInterval = 300000 // 5 minutes
  } = options;

  // State
  const [projects, setProjects] = useState<EnhancedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersState] = useState<ProjectFilter>(defaultFilters);
  const [searchQuery, setSearchQueryState] = useState('');
  const [sortBy, setSortByState] = useState<ProjectSort>(defaultSort);
  const [searchResults, setSearchResults] = useState<ProjectSearchResult | null>(null);

  // Initialize services
  const projectAnalyzer = useMemo(() => new ProjectAnalyzer(), []);
  const searchEngine = useMemo(() => enableSearch ? new SearchEngine() : null, [enableSearch]);
  const analytics = useMemo(() => enableAnalytics ? new AnalyticsTracker() : null, [enableAnalytics]);

  // Load initial data
  useEffect(() => {
    loadProjects();
  }, []);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      refreshProjects();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  // Initialize search engine when projects change
  useEffect(() => {
    if (searchEngine && projects.length > 0) {
      searchEngine.indexProjects(projects);
    }
  }, [searchEngine, projects]);

  // Perform search when query changes
  useEffect(() => {
    if (!searchEngine || !searchQuery.trim()) {
      setSearchResults(null);
      return;
    }

    const performSearch = async () => {
      try {
        const results = await searchEngine.search(searchQuery, {
          type: 'project',
          filters: {
            categories: filters.categories,
            technologies: filters.technologies,
            status: filters.status
          },
          sort: sortBy,
          limit: 50
        });
        setSearchResults(results);

        // Track search analytics
        if (analytics) {
          analytics.trackSearch({
            query: searchQuery,
            resultsCount: results.total,
            filters: filters,
            timestamp: Date.now()
          });
        }
      } catch (err) {
        console.error('Search error:', err);
        setError('Search failed. Please try again.');
      }
    };

    const debounceTimer = setTimeout(performSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, filters, sortBy, searchEngine, analytics]);

  // Load projects from catalog
  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load from JSON catalog
      const catalogData = projectsCatalog as any;
      const projectsData = catalogData.projects || [];

      // Convert to EnhancedProject format
      const enhancedProjects: EnhancedProject[] = projectsData.map((project: any) => ({
        ...project,
        id: project.id || `project-${Date.now()}-${Math.random()}`,
        createdAt: project.createdAt || new Date().toISOString(),
        lastUpdated: project.lastUpdated || new Date().toISOString(),
        metrics: {
          performance: project.metrics?.performance || { score: 85, loadTime: 1.2, bundleSize: 245 },
          codeQuality: project.metrics?.codeQuality || { score: 92, coverage: 85, maintainability: 88 },
          engagement: project.metrics?.engagement || { views: 1250, stars: 45, forks: 12 }
        },
        aiAnalysis: project.aiAnalysis || {
          complexity: { score: 75, factors: ['State Management', 'API Integration'] },
          architecture: { score: 88, patterns: ['Component Composition', 'Custom Hooks'] },
          insights: ['Well-structured component hierarchy', 'Good separation of concerns'],
          recommendations: ['Consider adding error boundaries', 'Implement loading states']
        }
      }));

      setProjects(enhancedProjects);

      // Track analytics
      if (analytics) {
        analytics.trackEvent({
          type: 'projects_loaded',
          data: { count: enhancedProjects.length },
          timestamp: Date.now()
        });
      }
    } catch (err) {
      console.error('Failed to load projects:', err);
      setError('Failed to load projects. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Refresh projects
  const refreshProjects = useCallback(async () => {
    await loadProjects();
  }, []);

  // Analyze specific project
  const analyzeProject = useCallback(async (projectId: string) => {
    try {
      setAnalyzing(true);
      const project = projects.find(p => p.id === projectId);
      if (!project) {
        throw new Error('Project not found');
      }

      const analysis = await projectAnalyzer.analyzeProject(project);
      
      // Update project with new analysis
      setProjects(prev => prev.map(p => 
        p.id === projectId 
          ? { ...p, aiAnalysis: analysis.aiAnalysis }
          : p
      ));

      // Track analytics
      if (analytics) {
        analytics.trackEvent({
          type: 'project_analyzed',
          data: { projectId, analysisScore: analysis.aiAnalysis.complexity.score },
          timestamp: Date.now()
        });
      }
    } catch (err) {
      console.error('Analysis failed:', err);
      setError('Project analysis failed. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  }, [projects, projectAnalyzer, analytics]);

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    let filtered = [...projects];

    // Apply search results if available
    if (searchResults && searchQuery.trim()) {
      const searchProjectIds = new Set(searchResults.items.map(item => item.id));
      filtered = filtered.filter(project => searchProjectIds.has(project.id));
    }

    // Apply filters
    if (filters.categories.length > 0) {
      filtered = filtered.filter(project => 
        filters.categories.some(cat => project.category.includes(cat))
      );
    }

    if (filters.technologies.length > 0) {
      filtered = filtered.filter(project => 
        filters.technologies.some(tech => 
          project.technologies.some(pTech => 
            pTech.toLowerCase().includes(tech.toLowerCase())
          )
        )
      );
    }

    if (filters.status.length > 0) {
      filtered = filtered.filter(project => 
        filters.status.includes(project.status)
      );
    }

    if (filters.difficulty.length > 0) {
      filtered = filtered.filter(project => 
        filters.difficulty.includes(project.difficulty)
      );
    }

    if (filters.featured !== undefined) {
      filtered = filtered.filter(project => project.featured === filters.featured);
    }

    if (filters.dateRange) {
      const { start, end } = filters.dateRange;
      filtered = filtered.filter(project => {
        const projectDate = new Date(project.lastUpdated);
        return projectDate >= start && projectDate <= end;
      });
    }

    if (filters.ratingRange) {
      const { min, max } = filters.ratingRange;
      filtered = filtered.filter(project => {
        const rating = project.metrics.codeQuality.score;
        return rating >= min && rating <= max;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const { field, direction } = sortBy;
      let aValue: any, bValue: any;

      switch (field) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'lastUpdated':
          aValue = new Date(a.lastUpdated);
          bValue = new Date(b.lastUpdated);
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case 'rating':
          aValue = a.metrics.codeQuality.score;
          bValue = b.metrics.codeQuality.score;
          break;
        case 'views':
          aValue = a.metrics.engagement.views;
          bValue = b.metrics.engagement.views;
          break;
        case 'stars':
          aValue = a.metrics.engagement.stars;
          bValue = b.metrics.engagement.stars;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [projects, filters, sortBy, searchResults, searchQuery]);

  // Action handlers
  const setFilters = useCallback((newFilters: Partial<ProjectFilter>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
    
    // Track filter analytics
    if (analytics) {
      analytics.trackEvent({
        type: 'projects_filtered',
        data: { filters: newFilters },
        timestamp: Date.now()
      });
    }
  }, [analytics]);

  const setSearchQuery = useCallback((query: string) => {
    setSearchQueryState(query);
  }, []);

  const setSortBy = useCallback((sort: ProjectSort) => {
    setSortByState(sort);
    
    // Track sort analytics
    if (analytics) {
      analytics.trackEvent({
        type: 'projects_sorted',
        data: { sortBy: sort },
        timestamp: Date.now()
      });
    }
  }, [analytics]);

  const clearFilters = useCallback(() => {
    setFiltersState(defaultFilters);
    setSearchQueryState('');
    setSortByState(defaultSort);
    setSearchResults(null);
  }, []);

  // Utility functions
  const getProjectById = useCallback((id: string) => {
    return projects.find(project => project.id === id);
  }, [projects]);

  const getProjectsByCategory = useCallback((category: string) => {
    return projects.filter(project => project.category.includes(category));
  }, [projects]);

  const getProjectsByTechnology = useCallback((tech: string) => {
    return projects.filter(project => 
      project.technologies.some(t => 
        t.toLowerCase().includes(tech.toLowerCase())
      )
    );
  }, [projects]);

  const getFeaturedProjects = useCallback(() => {
    return projects.filter(project => project.featured);
  }, [projects]);

  const getRecentProjects = useCallback((limit: number = 6) => {
    return [...projects]
      .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
      .slice(0, limit);
  }, [projects]);

  // Statistics
  const stats = useMemo(() => {
    const categories = [...new Set(projects.flatMap(p => p.category))];
    const technologies = [...new Set(projects.flatMap(p => p.technologies))];
    const totalViews = projects.reduce((sum, p) => sum + p.metrics.engagement.views, 0);
    const totalStars = projects.reduce((sum, p) => sum + p.metrics.engagement.stars, 0);
    const averageRating = projects.length > 0 
      ? projects.reduce((sum, p) => sum + p.metrics.codeQuality.score, 0) / projects.length 
      : 0;

    return {
      totalProjects: projects.length,
      categories,
      technologies,
      averageRating: Math.round(averageRating * 10) / 10,
      totalViews,
      totalStars
    };
  }, [projects]);

  return {
    // Data
    projects,
    filteredProjects,
    totalProjects: projects.length,
    
    // Loading states
    loading,
    analyzing,
    error,
    
    // Filters and search
    filters,
    searchQuery,
    sortBy,
    searchResults,
    
    // Actions
    setFilters,
    setSearchQuery,
    setSortBy,
    clearFilters,
    refreshProjects,
    analyzeProject,
    
    // Utilities
    getProjectById,
    getProjectsByCategory,
    getProjectsByTechnology,
    getFeaturedProjects,
    getRecentProjects,
    
    // Statistics
    stats
  };
};

export default useProjects;