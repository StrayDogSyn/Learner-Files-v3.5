export interface NavigationItem {
  id: string;
  label: string;
  href?: string;
  isRoute?: boolean;
  badge?: string;
  icon?: React.ReactNode;
  external?: boolean;
}

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'section' | 'project' | 'skill' | 'content';
  url: string;
  category?: string;
  tags?: string[];
  highlights?: string[];
}

export interface SearchSuggestion {
  id: string;
  text: string;
  type: 'recent' | 'popular' | 'suggestion';
  category?: string;
  onClick: () => void;
}

export interface KeyboardShortcut {
  key: string;
  description: string;
  action?: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
}

export interface NavigationConfig {
  items: NavigationItem[];
  searchEnabled?: boolean;
  mobileMenuEnabled?: boolean;
  keyboardShortcutsEnabled?: boolean;
}

export interface BreadcrumbItem {
  label: string;
  path: string;
  href?: string;
  icon?: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
}

export interface NavigationContext {
  currentSection: string;
  breadcrumbs: BreadcrumbItem[];
  isLoading: boolean;
}