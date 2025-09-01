export interface ProjectCard {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  techStack: string[];
  features: string[];
  keyFeatures?: string[];
  liveUrl?: string;
  liveDemo?: string;
  githubUrl?: string;
  githubRepo?: string;
  image: string;
  category: string;
  status: 'live' | 'development' | 'planning' | 'archived';
  priority: number;
  featured?: boolean;
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  tags?: string[];
  stats?: {
    stars?: number;
    forks?: number;
    commits?: number;
    contributors?: number;
    lastUpdated?: string;
  };
  metrics?: {
    performance?: number;
    accessibility?: number;
    seo?: number;
    bestPractices?: number;
  };
  timeline?: string;
  challenges?: string[];
  learnings?: string[];
}

export interface ProjectFilter {
  category?: string;
  status?: string;
  difficulty?: string;
  featured?: boolean;
  hasLiveDemo?: boolean;
  hasGitHubRepo?: boolean;
  techStack?: string[];
  tags?: string[];
}

export interface ProjectSort {
  field: 'priority' | 'title' | 'difficulty' | 'status' | 'category' | 'lastUpdated';
  direction: 'asc' | 'desc';
}

export interface ProjectSearch {
  query: string;
  fields: ('title' | 'description' | 'techStack' | 'tags' | 'features')[];
}

export type ViewMode = 'grid' | 'list' | 'cards' | 'timeline';

export interface ProjectMetrics {
  totalProjects: number;
  liveProjects: number;
  featuredProjects: number;
  technologiesUsed: string[];
  averageComplexity: string;
}

export interface ProjectStats {
  views: number;
  likes: number;
  shares: number;
  downloads?: number;
  lastViewed?: string;
}

export interface ProjectDemo {
  type: 'interactive' | 'video' | 'screenshots';
  url?: string;
  embedCode?: string;
  screenshots?: string[];
}

export interface ProjectTimeline {
  phase: string;
  description: string;
  startDate: string;
  endDate?: string;
  status: 'completed' | 'in-progress' | 'planned';
  milestones?: string[];
}