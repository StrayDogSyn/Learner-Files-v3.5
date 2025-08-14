export interface NavigationState {
  currentSection: string;
  breadcrumbs: BreadcrumbItem[];
  searchQuery: string;
  activeFilters: FilterState;
  userJourney: NavigationEvent[];
  viewMode: 'desktop' | 'mobile' | 'tablet';
  isSearchOpen: boolean;
  isMobileMenuOpen: boolean;
  lastVisitedSection?: string;
}

export interface BreadcrumbItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
}

export interface FilterState {
  category?: string;
  difficulty?: string;
  featured?: boolean;
  hasDemo?: boolean;
  hasGitHub?: boolean;
  techStack?: string[];
}

export interface NavigationEvent {
  timestamp: number;
  section: string;
  action: 'scroll' | 'click' | 'search' | 'filter' | 'breadcrumb';
  metadata?: Record<string, any>;
}

export interface SearchResult {
  id: string;
  type: 'project' | 'skill' | 'section' | 'content';
  title: string;
  description: string;
  path: string;
  relevance: number;
  highlights: string[];
  icon?: React.ReactNode;
}

export interface NavigationItem {
  id: string;
  label: string;
  href?: string;
  onClick?: () => void;
  isRoute?: boolean;
  icon?: React.ReactNode;
  badge?: string;
  children?: NavigationItem[];
  isExpanded?: boolean;
  category?: string;
  priority?: number;
}

export interface SearchSuggestion {
  id: string;
  text: string;
  type: 'recent' | 'popular' | 'suggestion';
  icon?: React.ReactNode;
  onClick: () => void;
}

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  action: string;
  description: string;
  callback: () => void;
}

export interface MobileNavigationState {
  isOpen: boolean;
  activeTab?: string;
  scrollPosition: number;
  gestureDirection?: 'left' | 'right' | 'up' | 'down';
}

export interface AccessibilityState {
  highContrast: boolean;
  reducedMotion: boolean;
  fontSize: 'small' | 'medium' | 'large';
  screenReader: boolean;
  keyboardNavigation: boolean;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  accessibility: AccessibilityState;
  navigation: {
    compactMode: boolean;
    showBreadcrumbs: boolean;
    enableSearch: boolean;
    enableKeyboardShortcuts: boolean;
  };
}
