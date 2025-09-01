import { useCallback, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAnalytics } from './useAnalytics';
import type { SearchResult, SearchSuggestion } from '../types/navigation';

export interface NavigationItem {
  path: string;
  label: string;
  icon?: string;
  external?: boolean;
}

export interface NavigationState {
  isSearchOpen: boolean;
  isMobileMenuOpen: boolean;
  searchQuery: string;
  recentSearches: string[];
}

export const useNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { trackEvent } = useAnalytics();
  
  const [navigationState, setNavigationState] = useState<NavigationState>({
    isSearchOpen: false,
    isMobileMenuOpen: false,
    searchQuery: '',
    recentSearches: []
  });
  
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchSuggestions, setSearchSuggestions] = useState<SearchSuggestion[]>([
    {
      id: 'recent-1',
      text: 'React Projects',
      type: 'recent',
      onClick: () => navigateToSection('featured-projects')
    },
    {
      id: 'recent-2', 
      text: 'Skills Overview',
      type: 'recent',
      onClick: () => navigateToSection('skills')
    },
    {
      id: 'popular-1',
      text: 'Portfolio',
      type: 'popular',
      onClick: () => navigateToSection('featured-projects')
    },
    {
      id: 'popular-2',
      text: 'Contact',
      type: 'popular', 
      onClick: () => navigateToSection('contact')
    }
  ]);

  const navigateTo = useCallback((path: string, label?: string) => {
    trackEvent({
      action: 'navigate',
      category: 'Navigation',
      label: label || path
    });
    
    if (path.startsWith('http')) {
      window.open(path, '_blank');
    } else {
      navigate(path);
    }
  }, [navigate, trackEvent]);

  const isCurrentPath = useCallback((path: string) => {
    return location.pathname === path;
  }, [location.pathname]);

  const goBack = useCallback(() => {
    trackEvent({
      action: 'back',
      category: 'Navigation'
    });
    navigate(-1);
  }, [navigate, trackEvent]);

  const goHome = useCallback(() => {
    navigateTo('/', 'Home');
  }, [navigateTo]);
  
  const toggleSearch = useCallback(() => {
    setNavigationState(prev => ({
      ...prev,
      isSearchOpen: !prev.isSearchOpen,
      searchQuery: prev.isSearchOpen ? '' : prev.searchQuery
    }));
  }, []);
  
  const toggleMobileMenu = useCallback(() => {
    setNavigationState(prev => ({
      ...prev,
      isMobileMenuOpen: !prev.isMobileMenuOpen
    }));
  }, []);
  
  const handleSearch = useCallback((query: string) => {
    setNavigationState(prev => ({ ...prev, searchQuery: query }));
    
    // Mock search results - in real app, this would be an API call
    const mockResults: SearchResult[] = [
      {
        id: 'portfolio',
        title: 'Portfolio Projects',
        description: 'View my latest work and projects',
        type: 'section',
        url: '#featured-projects'
      },
      {
        id: 'skills',
        title: 'Technical Skills',
        description: 'Explore my technical expertise',
        type: 'section',
        url: '#skills'
      }
    ].filter(result => 
      result.title.toLowerCase().includes(query.toLowerCase()) ||
      result.description.toLowerCase().includes(query.toLowerCase())
    );
    
    setSearchResults(mockResults);
  }, []);
  
  const navigateToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    trackEvent({
      action: 'navigate_section',
      category: 'Navigation',
      label: sectionId
    });
  }, [trackEvent]);
  
  const saveSearch = useCallback((query: string) => {
    if (query.trim()) {
      setNavigationState(prev => ({
        ...prev,
        recentSearches: [query, ...prev.recentSearches.filter(s => s !== query)].slice(0, 5)
      }));
    }
  }, []);
  
  const keyboardShortcuts = [
    { key: 'Ctrl+K', description: 'Open search' },
    { key: 'Esc', description: 'Close search' },
    { key: '↑↓', description: 'Navigate results' },
    { key: 'Enter', description: 'Select result' }
  ];

  return {
    navigateTo,
    isCurrentPath,
    goBack,
    goHome,
    currentPath: location.pathname,
    navigationState,
    searchResults,
    searchSuggestions,
    keyboardShortcuts,
    toggleSearch,
    toggleMobileMenu,
    handleSearch,
    navigateToSection,
    saveSearch
  };
};