// GitHub-related type definitions for the dynamic portfolio

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  size: number;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  topics: string[];
  visibility: 'public' | 'private';
  archived: boolean;
  disabled: boolean;
  score?: number; // For featured repository scoring
}

export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  bio: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface GitHubStats {
  totalRepos: number;
  totalStars: number;
  totalForks: number;
  totalCommits: number;
  languages: Record<string, number>;
  lastUpdated: string;
}

export interface ProjectCardData {
  id: string;
  title: string;
  description: string;
  image?: string;
  technologies: string[];
  githubUrl: string;
  liveUrl?: string;
  stars: number;
  forks: number;
  language: string;
  lastUpdated: string;
  featured: boolean;
  category: 'web' | 'mobile' | 'desktop' | 'library' | 'tool' | 'game' | 'other';
}

export interface AnalyticsEvent {
  id: string;
  type: 'page_view' | 'project_click' | 'github_link_click' | 'demo_interaction' | 'contact_form' | 'page_hidden' | 'page_visible' | 'scroll_depth' | 'time_on_page';
  timestamp: string;
  data?: Record<string, any>;
  sessionId: string;
  userAgent: string;
}

export interface PerformanceMetrics {
  loadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  timestamp: string;
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

// Language color mapping for visual consistency
export const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: '#f1e05a',
  TypeScript: '#2b7489',
  Python: '#3572A5',
  Java: '#b07219',
  'C++': '#f34b7d',
  'C#': '#239120',
  PHP: '#4F5D95',
  Ruby: '#701516',
  Go: '#00ADD8',
  Rust: '#dea584',
  Swift: '#ffac45',
  Kotlin: '#F18E33',
  Dart: '#00B4AB',
  HTML: '#e34c26',
  CSS: '#1572B6',
  SCSS: '#c6538c',
  Vue: '#4FC08D',
  React: '#61DAFB',
  Angular: '#DD0031',
  Svelte: '#ff3e00',
  Shell: '#89e051',
  PowerShell: '#012456',
  Dockerfile: '#384d54',
  YAML: '#cb171e',
  JSON: '#292929',
  Markdown: '#083fa1'
};

// Project category icons mapping
export const CATEGORY_ICONS: Record<ProjectCardData['category'], string> = {
  web: 'Globe',
  mobile: 'Smartphone',
  desktop: 'Monitor',
  library: 'Package',
  tool: 'Wrench',
  game: 'Gamepad2',
  other: 'Code'
};

// Helper functions for type safety
export const isValidRepository = (repo: any): repo is GitHubRepository => {
  return (
    repo &&
    typeof repo.id === 'number' &&
    typeof repo.name === 'string' &&
    typeof repo.full_name === 'string' &&
    typeof repo.html_url === 'string'
  );
};

export const isValidGitHubUser = (user: any): user is GitHubUser => {
  return (
    user &&
    typeof user.login === 'string' &&
    typeof user.id === 'number' &&
    typeof user.public_repos === 'number'
  );
};

export const getLanguageColor = (language: string | null): string => {
  if (!language) return '#6b7280'; // Default gray
  return LANGUAGE_COLORS[language] || '#6b7280';
};

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
  return `${Math.ceil(diffDays / 365)} years ago`;
};

export const categorizeRepository = (repo: GitHubRepository): ProjectCardData['category'] => {
  const name = repo.name.toLowerCase();
  const description = repo.description?.toLowerCase() || '';
  const topics = repo.topics.map(t => t.toLowerCase());
  
  // Check for specific patterns
  if (topics.includes('game') || name.includes('game') || description.includes('game')) {
    return 'game';
  }
  
  if (topics.includes('mobile') || topics.includes('android') || topics.includes('ios') || 
      name.includes('mobile') || description.includes('mobile')) {
    return 'mobile';
  }
  
  if (topics.includes('desktop') || topics.includes('electron') || 
      name.includes('desktop') || description.includes('desktop')) {
    return 'desktop';
  }
  
  if (topics.includes('library') || topics.includes('package') || topics.includes('npm') ||
      name.includes('lib') || description.includes('library')) {
    return 'library';
  }
  
  if (topics.includes('tool') || topics.includes('cli') || topics.includes('utility') ||
      name.includes('tool') || description.includes('tool')) {
    return 'tool';
  }
  
  if (topics.includes('web') || topics.includes('website') || topics.includes('webapp') ||
      repo.language === 'HTML' || repo.language === 'CSS' || repo.language === 'JavaScript' ||
      repo.language === 'TypeScript' || description.includes('web')) {
    return 'web';
  }
  
  return 'other';
};