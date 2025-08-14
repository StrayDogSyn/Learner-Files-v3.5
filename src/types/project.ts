// Advanced Project Showcase Type Definitions

export interface ProjectMetrics {
  accuracy?: string;
  performance?: string;
  uptime?: string;
  bundleSize?: string;
  lighthouseScore?: number;
  githubStars?: number;
  forks?: number;
  issues?: number;
  lastCommit?: string;
}

export interface ProjectScreenshot {
  id: string;
  url: string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
}

export interface GitHubStats {
  stars: number;
  forks: number;
  issues: number;
  pullRequests: number;
  lastCommit: string;
  contributors: number;
  languages: Record<string, number>;
  readme: string;
}

export interface DemoConfiguration {
  projectId: string;
  demoType: 'iframe' | 'component' | 'sandbox' | 'api-playground' | 'game';
  height: string;
  interactive: boolean;
  codeVisible: boolean;
  configurable: boolean;
  presets?: DemoPreset[];
  embedUrl?: string;
}

export interface DemoPreset {
  name: string;
  description: string;
  configuration: Record<string, any>;
  code?: string;
}

export interface ProjectCard {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  techStack: string[];
  liveDemo?: string;
  githubRepo: string;
  featured: boolean;
  category: 'web-app' | 'api' | 'portfolio' | 'game' | 'automation' | 'ai' | 'mobile';
  screenshots: ProjectScreenshot[];
  keyFeatures: string[];
  metrics?: ProjectMetrics;
  githubStats?: GitHubStats;
  demoConfig?: DemoConfiguration;
  status: 'live' | 'in-progress' | 'planned' | 'archived';
  priority: number;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  estimatedTime: string;
  dependencies: string[];
  deploymentUrl?: string;
  documentationUrl?: string;
  videoDemo?: string;
  caseStudy?: string;
}

export interface ProjectFilter {
  category?: ProjectCard['category'];
  status?: ProjectCard['status'];
  difficulty?: ProjectCard['difficulty'];
  techStack?: string[];
  tags?: string[];
  featured?: boolean;
  hasLiveDemo?: boolean;
  hasGitHubRepo?: boolean;
}

export interface ProjectSort {
  field: 'priority' | 'title' | 'difficulty' | 'githubStars' | 'lastCommit' | 'created';
  direction: 'asc' | 'desc';
}

export interface ProjectSearch {
  query: string;
  fields: ('title' | 'description' | 'techStack' | 'tags' | 'keyFeatures')[];
  fuzzy: boolean;
  caseSensitive: boolean;
}

export interface ProjectShowcaseState {
  projects: ProjectCard[];
  filteredProjects: ProjectCard[];
  activeFilters: ProjectFilter;
  sortConfig: ProjectSort;
  searchConfig: ProjectSearch;
  selectedProject?: ProjectCard;
  viewMode: 'grid' | 'list' | 'detailed';
  isLoading: boolean;
  error?: string;
}

// GitHub API Response Types
export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string;
  updated_at: string;
  created_at: string;
  homepage: string;
  topics: string[];
  default_branch: string;
  visibility: string;
  archived: boolean;
  disabled: boolean;
}

export interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      email: string;
      date: string;
    };
  };
  author: {
    login: string;
    avatar_url: string;
  };
  html_url: string;
}

export interface GitHubLanguage {
  [language: string]: number;
}

// Demo Platform Types
export interface DemoState {
  isPlaying: boolean;
  currentPreset?: DemoPreset;
  configuration: Record<string, any>;
  codeVisible: boolean;
  fullscreen: boolean;
  error?: string;
}

export interface DemoEvent {
  type: 'play' | 'pause' | 'reset' | 'preset-change' | 'config-change' | 'error';
  payload?: any;
  timestamp: number;
}

// Performance Metrics Types
export interface PerformanceMetrics {
  coreWebVitals: {
    lcp: number; // Largest Contentful Paint
    fid: number; // First Input Delay
    cls: number; // Cumulative Layout Shift
  };
  customMetrics: {
    timeToInteractive: number;
    bundleSize: number;
    apiResponseTimes: Record<string, number>;
    renderTime: number;
  };
  userExperience: {
    bounceRate: number;
    sessionDuration: number;
    pageViews: number;
    conversionRate: number;
  };
}

// Navigation and UX Types
export interface NavigationState {
  currentSection: string;
  breadcrumbs: BreadcrumbItem[];
  searchQuery: string;
  activeFilters: ProjectFilter;
  userJourney: NavigationEvent[];
  viewMode: 'grid' | 'list' | 'detailed';
}

export interface BreadcrumbItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
}

export interface NavigationEvent {
  type: 'page-view' | 'project-view' | 'filter-change' | 'search' | 'demo-play';
  payload?: any;
  timestamp: number;
  duration?: number;
}

// Utility Types
export type ProjectCategory = ProjectCard['category'];
export type ProjectStatus = ProjectCard['status'];
export type ProjectDifficulty = ProjectCard['difficulty'];
export type DemoType = DemoConfiguration['demoType'];
export type ViewMode = ProjectShowcaseState['viewMode'];
