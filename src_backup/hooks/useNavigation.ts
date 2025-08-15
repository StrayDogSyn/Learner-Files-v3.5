import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type {
  NavigationState,
  NavigationEvent,
  SearchResult,
  SearchSuggestion,
  KeyboardShortcut,
  FilterState,
} from '../types/navigation';
import { enhancedProjects } from '../data/enhancedProjects';
import { useAnalytics } from './useAnalytics';

export const useNavigation = () => {
  const [navigationState, setNavigationState] = useState<NavigationState>({
    currentSection: 'home',
    breadcrumbs: [],
    searchQuery: '',
    activeFilters: {},
    userJourney: [],
    viewMode: 'desktop',
    isSearchOpen: false,
    isMobileMenuOpen: false,
  });

  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchSuggestions, setSearchSuggestions] = useState<SearchSuggestion[]>([]);
  const [keyboardShortcuts, setKeyboardShortcuts] = useState<KeyboardShortcut[]>([]);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { trackNavigation, trackSearchQuery } = useAnalytics();

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const shortcut = keyboardShortcuts.find(
        s =>
          s.key === event.key &&
          !!s.ctrlKey === event.ctrlKey &&
          !!s.altKey === event.altKey &&
          !!s.shiftKey === event.shiftKey
      );

      if (shortcut) {
        event.preventDefault();
        shortcut.callback();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [keyboardShortcuts]);

  // Update view mode based on screen size
  useEffect(() => {
    const updateViewMode = () => {
      const width = window.innerWidth;
      let viewMode: 'desktop' | 'mobile' | 'tablet' = 'desktop';

      if (width < 768) viewMode = 'mobile';
      else if (width < 1024) viewMode = 'tablet';

      setNavigationState(prev => ({ ...prev, viewMode }));
    };

    updateViewMode();
    window.addEventListener('resize', updateViewMode);
    return () => window.removeEventListener('resize', updateViewMode);
  }, []);

  // Navigation functions
  const navigateToSection = useCallback(
    (sectionId: string) => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        trackNavigation(sectionId);

        // Update navigation state
        setNavigationState(prev => ({
          ...prev,
          currentSection: sectionId,
          lastVisitedSection: prev.currentSection,
          breadcrumbs: generateBreadcrumbs(sectionId),
          userJourney: [
            ...prev.userJourney,
            {
              timestamp: Date.now(),
              section: sectionId,
              action: 'click',
              metadata: { from: prev.currentSection },
            },
          ],
        }));
      }
    },
    [trackNavigation]
  );

  const generateBreadcrumbs = useCallback((sectionId: string) => {
    const breadcrumbMap: Record<string, { label: string; path: string; icon?: string }> = {
      home: { label: 'Home', path: '#home' },
      'featured-projects': { label: 'Featured Projects', path: '#featured-projects' },
      'career-timeline': { label: 'Career Timeline', path: '#career-timeline' },
      skills: { label: 'Skills', path: '#skills' },
      contact: { label: 'Contact', path: '#contact' },
      'marvel-quiz': { label: 'Marvel Quiz', path: '/marvel-quiz' },
    };

    const breadcrumbs = [];
    const currentSection = breadcrumbMap[sectionId];

    if (currentSection) {
      breadcrumbs.push({
        label: 'Home',
        path: '#home',
        isActive: sectionId === 'home',
      });

      if (sectionId !== 'home') {
        breadcrumbs.push({
          label: currentSection.label,
          path: currentSection.path,
          isActive: true,
        });
      }
    }

    return breadcrumbs;
  }, []);

  // Search functionality
  const performSearch = useCallback((query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const results: SearchResult[] = [];
    const searchTerm = query.toLowerCase();

    // Search in projects
    enhancedProjects.forEach(project => {
      const relevance = calculateRelevance(project, searchTerm);
      if (relevance > 0) {
        results.push({
          id: project.id,
          type: 'project',
          title: project.title,
          description: project.description,
          path: `#featured-projects`,
          relevance,
          highlights: extractHighlights(project, searchTerm),
        });
      }
    });

    // Search in sections
    const sections = [
      { id: 'home', title: 'Home', description: 'Portfolio introduction and overview' },
      {
        id: 'featured-projects',
        title: 'Featured Projects',
        description: 'Showcase of key projects and work',
      },
      {
        id: 'career-timeline',
        title: 'Career Timeline',
        description: 'Professional journey and experience',
      },
      { id: 'skills', title: 'Skills', description: 'Technical skills and expertise' },
      { id: 'contact', title: 'Contact', description: 'Get in touch and connect' },
    ];

    sections.forEach(section => {
      if (
        section.title.toLowerCase().includes(searchTerm) ||
        section.description.toLowerCase().includes(searchTerm)
      ) {
        results.push({
          id: section.id,
          type: 'section',
          title: section.title,
          description: section.description,
          path: `#${section.id}`,
          relevance: 0.8,
          highlights: [section.title],
        });
      }
    });

    // Sort by relevance
    results.sort((a, b) => b.relevance - a.relevance);
    setSearchResults(results.slice(0, 10)); // Limit to top 10 results
  }, []);

  const calculateRelevance = (project: any, searchTerm: string): number => {
    let relevance = 0;

    if (project.title.toLowerCase().includes(searchTerm)) relevance += 1.0;
    if (project.description.toLowerCase().includes(searchTerm)) relevance += 0.8;
    if (project.techStack.some((tech: string) => tech.toLowerCase().includes(searchTerm)))
      relevance += 0.6;
    if (project.keyFeatures.some((feature: string) => feature.toLowerCase().includes(searchTerm)))
      relevance += 0.4;
    if (project.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm)))
      relevance += 0.3;

    return relevance;
  };

  const extractHighlights = (project: any, searchTerm: string): string[] => {
    const highlights: string[] = [];

    if (project.title.toLowerCase().includes(searchTerm)) {
      highlights.push(project.title);
    }

    project.techStack.forEach((tech: string) => {
      if (tech.toLowerCase().includes(searchTerm)) {
        highlights.push(tech);
      }
    });

    return highlights.slice(0, 3);
  };

  const handleSearch = useCallback(
    (query: string) => {
      setNavigationState(prev => ({ ...prev, searchQuery: query }));

      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      searchTimeoutRef.current = setTimeout(() => {
        performSearch(query);
        if (query.trim()) {
          trackSearchQuery(query, searchResults.length);
        }
      }, 300);
    },
    [performSearch, trackSearchQuery, searchResults.length]
  );

  // Filter functionality
  const updateFilters = useCallback((filters: Partial<FilterState>) => {
    setNavigationState(prev => ({
      ...prev,
      activeFilters: { ...prev.activeFilters, ...filters },
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setNavigationState(prev => ({
      ...prev,
      activeFilters: {},
    }));
  }, []);

  // Mobile navigation
  const toggleMobileMenu = useCallback(() => {
    setNavigationState(prev => ({
      ...prev,
      isMobileMenuOpen: !prev.isMobileMenuOpen,
    }));
  }, []);

  const toggleSearch = useCallback(() => {
    setNavigationState(prev => ({
      ...prev,
      isSearchOpen: !prev.isSearchOpen,
    }));
  }, []);

  // Generate search suggestions
  const generateSuggestions = useMemo(() => {
    const suggestions: SearchSuggestion[] = [];

    // Recent searches (from localStorage)
    const recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    recentSearches.slice(0, 3).forEach((search: string) => {
      suggestions.push({
        id: `recent-${search}`,
        text: search,
        type: 'recent',
        onClick: () => handleSearch(search),
      });
    });

    // Popular searches
    const popularSearches = ['React', 'TypeScript', 'Marvel Quiz', 'Portfolio', 'Projects'];
    popularSearches.forEach(search => {
      suggestions.push({
        id: `popular-${search}`,
        text: search,
        type: 'popular',
        onClick: () => handleSearch(search),
      });
    });

    return suggestions;
  }, [handleSearch]);

  // Save search to recent searches
  const saveSearch = useCallback((query: string) => {
    if (!query.trim()) return;

    const recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    const updatedSearches = [query, ...recentSearches.filter((s: string) => s !== query)].slice(
      0,
      10
    );
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  }, []);

  // Initialize keyboard shortcuts after functions are defined
  useEffect(() => {
    const shortcuts: KeyboardShortcut[] = [
      {
        key: 'k',
        ctrlKey: true,
        action: 'open-search',
        description: 'Open search',
        callback: () => setNavigationState(prev => ({ ...prev, isSearchOpen: true })),
      },
      {
        key: 'Escape',
        action: 'close-search',
        description: 'Close search',
        callback: () => setNavigationState(prev => ({ ...prev, isSearchOpen: false })),
      },
      {
        key: 'h',
        ctrlKey: true,
        action: 'go-home',
        description: 'Go to home',
        callback: () => navigateToSection('home'),
      },
      {
        key: 'p',
        ctrlKey: true,
        action: 'go-projects',
        description: 'Go to projects',
        callback: () => navigateToSection('featured-projects'),
      },
      {
        key: 'c',
        ctrlKey: true,
        action: 'go-contact',
        description: 'Go to contact',
        callback: () => navigateToSection('contact'),
      },
    ];

    setKeyboardShortcuts(shortcuts);
  }, [navigateToSection]);

  return {
    navigationState,
    searchResults,
    searchSuggestions: generateSuggestions,
    keyboardShortcuts,
    navigateToSection,
    handleSearch,
    updateFilters,
    clearFilters,
    toggleMobileMenu,
    toggleSearch,
    saveSearch,
    generateBreadcrumbs,
  };
};
