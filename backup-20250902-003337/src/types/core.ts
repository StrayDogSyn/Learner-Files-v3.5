export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  imageUrl?: string;
  featured?: boolean;
  status: 'completed' | 'in-progress' | 'planned';
  category: 'web' | 'mobile' | 'ai' | 'data' | 'tool' | 'game';
  highlights: string[];
  challenges?: string[];
  learnings?: string[];
  metrics?: {
    performance?: string;
    users?: string;
    impact?: string;
  };
  timeline?: {
    start: string;
    end?: string;
    duration?: string;
  };
}

export interface PersonalInfo {
  name: string;
  title: string;
  tagline: string;
  bio: string;
  location: string;
  email: string;
  social: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  skills: {
    category: string;
    items: string[];
  }[];
  experience: {
    company: string;
    role: string;
    period: string;
    description: string;
  }[];
}

export interface FilterState {
  category: string;
  technology: string;
  status: string;
}

export interface SortOption {
  value: string;
  label: string;
}

export type Theme = 'light' | 'dark' | 'system';

export interface AppState {
  theme: Theme;
  filters: FilterState;
  searchQuery: string;
  selectedProject: Project | null;
}