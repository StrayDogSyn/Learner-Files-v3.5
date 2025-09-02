import React, { useState, useEffect, useRef, Fragment } from 'react';
import { Link } from 'react-router-dom';
import {
  FaSearch,
  FaTimes,
  FaHome,
  FaCode,
  FaBriefcase,
  FaUserTie,
  FaEnvelope,
  FaGamepad,
  FaBars,
  FaChevronRight,
  FaKeyboard,
  FaFilter,
  FaHistory,
  FaStar,
} from 'react-icons/fa';
import { useNavigation } from '../hooks/useNavigation';
import type { NavigationItem, SearchResult, SearchSuggestion } from '../types/navigation';
import GlassCard from './GlassCard';
import BrandImage from './BrandImage';
import { BrandConfigs } from './BrandImage';

interface AdvancedNavigationProps {
  items: NavigationItem[];
  activeItem?: string;
  className?: string;
  logo?: React.ReactNode;
  actions?: React.ReactNode;
}

const AdvancedNavigation: React.FC<AdvancedNavigationProps> = ({
  items,
  activeItem,
  className = '',
  logo,
  actions,
}) => {
  const {
    navigationState,
    searchResults = [],
    searchSuggestions = [],
    keyboardShortcuts = [],
    navigateToSection,
    handleSearch,
    toggleMobileMenu,
    toggleSearch,
    saveSearch,
  } = useNavigation();

  const [selectedSearchIndex, setSelectedSearchIndex] = useState(-1);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchResultsRef = useRef<HTMLDivElement>(null);

  // Focus search input when search is opened
  useEffect(() => {
    if (navigationState.isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [navigationState.isSearchOpen]);

  // Handle keyboard navigation in search results
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!navigationState.isSearchOpen) return;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setSelectedSearchIndex(prev => (prev < (searchResults?.length || 0) - 1 ? prev + 1 : 0));
          break;
        case 'ArrowUp':
          event.preventDefault();
          setSelectedSearchIndex(prev => (prev > 0 ? prev - 1 : (searchResults?.length || 0) - 1));
          break;
        case 'Enter':
          event.preventDefault();
          if (selectedSearchIndex >= 0 && searchResults && searchResults[selectedSearchIndex]) {
            handleSearchResultClick(searchResults[selectedSearchIndex]);
          }
          break;
        case 'Escape':
          toggleSearch();
          setSelectedSearchIndex(-1);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [navigationState.isSearchOpen, searchResults, selectedSearchIndex, toggleSearch]);

  const handleSearchResultClick = (result: SearchResult) => {
    saveSearch(navigationState.searchQuery);
    toggleSearch();
    setSelectedSearchIndex(-1);

    if (result.type === 'section') {
      navigateToSection(result.id);
    } else if (result.type === 'project') {
      navigateToSection('featured-projects');
      // Could add logic to scroll to specific project
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    suggestion.onClick();
    toggleSearch();
  };

  const getItemIcon = (itemId: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      home: <FaHome className='w-4 h-4' />,
      'featured-projects': <FaCode className='w-4 h-4' />,
      'career-timeline': <FaBriefcase className='w-4 h-4' />,
      skills: <FaUserTie className='w-4 h-4' />,
      contact: <FaEnvelope className='w-4 h-4' />,
      'marvel-quiz': <FaGamepad className='w-4 h-4' />,
    };
    return iconMap[itemId] || null;
  };

  const getSearchResultIcon = (type: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      project: <FaCode className='w-4 h-4' />,
      section: <FaHome className='w-4 h-4' />,
      skill: <FaUserTie className='w-4 h-4' />,
      content: <FaBriefcase className='w-4 h-4' />,
    };
    return iconMap[type] || <FaSearch className='w-4 h-4' />;
  };

  const getSuggestionIcon = (type: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      recent: <FaHistory className='w-4 h-4' />,
      popular: <FaStar className='w-4 h-4' />,
      suggestion: <FaSearch className='w-4 h-4' />,
    };
    return iconMap[type] || <FaSearch className='w-4 h-4' />;
  };

  return (
    <>
      {/* Main Navigation */}
      <nav className={`glass-nav ${className}`}>
        <div className='container mx-auto px-4 py-4'>
          <div className='flex justify-between items-center'>
            {/* Logo Section */}
            <div className='flex items-center'>
              {logo || (
                <div className='flex items-center space-x-2'>
                  <BrandImage {...BrandConfigs.navLogo} className='w-8 h-8 rounded-lg' />
                  <span className='font-display font-bold text-lg bg-gradient-to-r from-hunter-emerald to-metallic-silver bg-clip-text text-transparent'>
                    StrayDog Syndications
                  </span>
                </div>
              )}
            </div>

            {/* Desktop Navigation Items */}
            <div className='hidden lg:flex items-center space-x-4'>
              <div className='flex space-x-2'>
                {items.map(item => {
                  if (item.isRoute && item.href) {
                    return (
                      <Link
                        key={item.id}
                        to={item.href}
                        className={`glass-nav-item flex items-center space-x-2 ${
                          activeItem === item.id ? 'active' : ''
                        }`}
                      >
                        {getItemIcon(item.id)}
                        <span>{item.label}</span>
                        {item.badge && (
                          <span className='bg-hunter-emerald text-charcoal-dark text-xs px-2 py-1 rounded-full'>
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  }
                  return (
                    <button
                      key={item.id}
                      onClick={() => navigateToSection(item.id)}
                      className={`glass-nav-item flex items-center space-x-2 ${
                        activeItem === item.id ? 'active' : ''
                      }`}
                    >
                      {getItemIcon(item.id)}
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className='bg-hunter-emerald text-charcoal-dark text-xs px-2 py-1 rounded-full'>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Desktop Actions */}
            <div className='hidden lg:flex items-center space-x-2'>
              {/* Search Button */}
              <button
                onClick={toggleSearch}
                className='glass-nav-item p-2'
                title='Search (Ctrl+K)'
                aria-label='Search'
              >
                <FaSearch className='w-4 h-4' />
              </button>

              {/* Keyboard Shortcuts Button */}
              <button
                onClick={() => setShowKeyboardShortcuts(!showKeyboardShortcuts)}
                className='glass-nav-item p-2'
                title='Keyboard Shortcuts'
                aria-label='Keyboard Shortcuts'
              >
                <FaKeyboard className='w-4 h-4' />
              </button>

              {actions && <div className='flex items-center space-x-2'>{actions}</div>}
            </div>

            {/* Mobile Menu Button */}
            <div className='lg:hidden flex items-center space-x-2'>
              <button
                onClick={toggleSearch}
                className='glass-nav-item p-2'
                title='Search'
                aria-label='Search'
              >
                <FaSearch className='w-4 h-4' />
              </button>

              <button
                onClick={toggleMobileMenu}
                className='glass-nav-item p-2'
                title='Toggle mobile menu'
                aria-label='Toggle mobile menu'
              >
                <FaBars className='w-4 h-4' />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Breadcrumbs */}
      {navigationState.breadcrumbs.length > 1 && (
        <div className='bg-glass-primary/50 backdrop-blur-sm border-b border-glass-border-light'>
          <div className='container mx-auto px-4 py-2'>
            <nav className='flex items-center space-x-2 text-sm'>
              {navigationState.breadcrumbs.map((breadcrumb, index) => (
                <Fragment key={breadcrumb.path}>
                  <button
                    onClick={
                      breadcrumb.onClick ||
                      (() => navigateToSection(breadcrumb.path.replace('#', '')))
                    }
                    className={`flex items-center space-x-1 transition-colors ${
                      breadcrumb.isActive
                        ? 'text-hunter-emerald font-semibold'
                        : 'text-metallic-silver/70 hover:text-metallic-silver'
                    }`}
                  >
                    {breadcrumb.icon}
                    <span>{breadcrumb.label}</span>
                  </button>
                  {index < navigationState.breadcrumbs.length - 1 && (
                    <FaChevronRight className='w-3 h-3 text-metallic-silver/50' />
                  )}
                </Fragment>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Mobile Navigation Menu */}
      {navigationState.isMobileMenuOpen && (
        <div className='lg:hidden fixed inset-0 z-50 bg-charcoal-dark/80 backdrop-blur-sm'>
          <div className='absolute top-0 right-0 w-80 h-full bg-glass-primary backdrop-blur-md border-l border-glass-border-medium'>
            <div className='p-6'>
              <div className='flex justify-between items-center mb-6'>
                <h2 className='text-xl font-display font-bold text-metallic-silver'>Navigation</h2>
                <button
                  onClick={toggleMobileMenu}
                  className='glass-nav-item p-2'
                  aria-label='Close menu'
                >
                  <FaTimes className='w-4 h-4' />
                </button>
              </div>

              <nav className='space-y-2'>
                {items.map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.isRoute && item.href) {
                        window.location.href = item.href;
                      } else {
                        navigateToSection(item.id);
                      }
                      toggleMobileMenu();
                    }}
                    className={`w-full text-left glass-nav-item flex items-center space-x-3 p-3 ${
                      activeItem === item.id ? 'active' : ''
                    }`}
                  >
                    {getItemIcon(item.id)}
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className='ml-auto bg-hunter-emerald text-charcoal-dark text-xs px-2 py-1 rounded-full'>
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Search Modal */}
      {navigationState.isSearchOpen && (
        <div className='fixed inset-0 z-50 bg-charcoal-dark/80 backdrop-blur-sm'>
          <div className='absolute top-0 left-1/2 transform -translate-x-1/2 w-full max-w-2xl mt-20'>
            <GlassCard className='relative'>
              <div className='flex items-center space-x-4 mb-4'>
                <FaSearch className='w-5 h-5 text-metallic-silver/70' />
                <input
                  ref={searchInputRef}
                  type='text'
                  placeholder='Search projects, skills, sections... (Ctrl+K)'
                  value={navigationState.searchQuery}
                  onChange={e => handleSearch(e.target.value)}
                  className='flex-1 bg-transparent text-metallic-silver placeholder-metallic-silver/50 border-none outline-none text-lg'
                />
                <button
                  onClick={toggleSearch}
                  className='glass-nav-item p-2'
                  aria-label='Close search'
                >
                  <FaTimes className='w-4 h-4' />
                </button>
              </div>

              {/* Search Results */}
              <div ref={searchResultsRef} className='max-h-96 overflow-y-auto'>
                {navigationState.searchQuery ? (
                  searchResults && searchResults.length > 0 ? (
                    <div className='space-y-2'>
                      {searchResults.map((result, index) => (
                        <button
                          key={result.id}
                          onClick={() => handleSearchResultClick(result)}
                          className={`w-full text-left p-3 rounded-lg transition-colors ${
                            index === selectedSearchIndex
                              ? 'bg-hunter-emerald/20 border border-hunter-emerald/30'
                              : 'hover:bg-glass-secondary/50'
                          }`}
                        >
                          <div className='flex items-center space-x-3'>
                            {getSearchResultIcon(result.type)}
                            <div className='flex-1'>
                              <div className='font-semibold text-metallic-silver'>
                                {result.title}
                              </div>
                              <div className='text-sm text-metallic-silver/70'>
                                {result.description}
                              </div>
                              {result.highlights && result.highlights.length > 0 && (
                                <div className='text-xs text-hunter-emerald mt-1'>
                                  Matches: {result.highlights.join(', ')}
                                </div>
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className='text-center py-8 text-metallic-silver/70'>
                      No results found for "{navigationState.searchQuery}"
                    </div>
                  )
                ) : (
                  <div className='space-y-4'>
                    {/* Search Suggestions */}
                    <div>
                      <h3 className='text-sm font-semibold text-metallic-silver/70 mb-2'>
                        Recent Searches
                      </h3>
                      <div className='space-y-1'>
                        {(searchSuggestions || [])
                          .filter(s => s && s.type === 'recent')
                          .length > 0 ? (
                          (searchSuggestions || [])
                            .filter(s => s && s.type === 'recent')
                            .map(suggestion => (
                              <button
                                key={suggestion.id}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className='w-full text-left p-2 rounded-lg hover:bg-glass-secondary/50 flex items-center space-x-2'
                              >
                                {getSuggestionIcon(suggestion.type)}
                                <span className='text-metallic-silver'>{suggestion.text}</span>
                              </button>
                            ))
                        ) : (
                          <div className='text-sm text-metallic-silver/50 p-2'>No recent searches</div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className='text-sm font-semibold text-metallic-silver/70 mb-2'>
                        Popular Searches
                      </h3>
                      <div className='space-y-1'>
                        {(searchSuggestions || [])
                          .filter(s => s && s.type === 'popular')
                          .length > 0 ? (
                          (searchSuggestions || [])
                            .filter(s => s && s.type === 'popular')
                            .map(suggestion => (
                              <button
                                key={suggestion.id}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className='w-full text-left p-2 rounded-lg hover:bg-glass-secondary/50 flex items-center space-x-2'
                              >
                                {getSuggestionIcon(suggestion.type)}
                                <span className='text-metallic-silver'>{suggestion.text}</span>
                              </button>
                            ))
                        ) : (
                          <div className='text-sm text-metallic-silver/50 p-2'>No popular searches</div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </GlassCard>
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Modal */}
      {showKeyboardShortcuts && (
        <div className='fixed inset-0 z-50 bg-charcoal-dark/80 backdrop-blur-sm'>
          <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md'>
            <GlassCard className='relative'>
              <div className='flex justify-between items-center mb-4'>
                <h2 className='text-xl font-display font-bold text-metallic-silver'>
                  Keyboard Shortcuts
                </h2>
                <button
                  onClick={() => setShowKeyboardShortcuts(false)}
                  className='glass-nav-item p-2'
                  aria-label='Close shortcuts'
                >
                  <FaTimes className='w-4 h-4' />
                </button>
              </div>

              <div className='space-y-3'>
                {(keyboardShortcuts || []).map(shortcut => (
                  <div key={shortcut.action} className='flex justify-between items-center'>
                    <span className='text-metallic-silver'>{shortcut.description}</span>
                    <kbd className='px-2 py-1 bg-glass-secondary border border-glass-border-light rounded text-xs text-metallic-silver'>
                      {shortcut.ctrlKey && 'Ctrl+'}
                      {shortcut.altKey && 'Alt+'}
                      {shortcut.shiftKey && 'Shift+'}
                      {shortcut.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      )}
    </>
  );
};

export default AdvancedNavigation;
