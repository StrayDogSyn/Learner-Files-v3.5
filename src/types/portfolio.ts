// Comprehensive TypeScript interfaces for Eric 'Hunter' Petross Portfolio
// Based on Technical Architecture Document specifications

export interface ContactMethod {
  type: 'email' | 'linkedin' | 'github' | 'website' | 'phone';
  value: string;
  label: string;
}

export interface DigitalProperty {
  name: string;
  url: string;
  description: string;
  badgeColor: string;
}

export interface DeveloperProfile {
  name: string;
  title: string;
  location: string;
  bio: string;
  experienceYears: number;
  githubUsername: string;
  contactMethods: ContactMethod[];
  digitalProperties: DigitalProperty[];
  professionalDifferentiators: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  demoUrl?: string;
  repoUrl: string;
  status: 'completed' | 'in-progress' | 'planned';
  createdDate: Date;
  features: string[];
  highlights: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  completionDate: Date;
  credentialUrl?: string;
  badgeUrl: string;
  category: 'ai' | 'development' | 'database' | 'education';
  status: 'completed' | 'in-progress' | 'planned';
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: Date;
  endDate?: Date;
  responsibilities: string[];
  achievements: string[];
  technologies: string[];
}

export interface TechSkill {
  id: string;
  name: string;
  category: 'programming' | 'frontend' | 'backend' | 'ai' | 'tools' | 'platforms';
  proficiencyLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  badgeUrl: string;
  yearsExperience: number;
}

// GitHub API Response Types
export interface GitHubUser {
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  name: string;
  bio: string;
  location: string;
  avatar_url: string;
}

export interface GitHubRepo {
  name: string;
  description: string;
  language: string;
  stargazers_count: number;
  html_url: string;
  created_at: string;
  updated_at: string;
}

// Component Props Types
export interface HeroSectionProps {
  profile: DeveloperProfile;
  githubStats?: GitHubUser;
}

export interface ProjectCardProps {
  project: Project;
  onViewDemo?: (url: string) => void;
  onViewRepo?: (url: string) => void;
}

export interface TechBadgeProps {
  skill: TechSkill;
  showProficiency?: boolean;
}

export interface ExperienceTimelineProps {
  experiences: Experience[];
  certifications: Certification[];
}

export interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  message: string;
  consultationType: 'ai-solutions' | 'full-stack' | 'consulting' | 'other';
}

// Navigation and Routing
export interface NavigationItem {
  path: string;
  label: string;
  icon?: string;
}

// Animation and UI State
export interface TypingAnimationProps {
  texts: string[];
  speed?: number;
  deleteSpeed?: number;
  pauseDuration?: number;
}

export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

// API Response Wrappers
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

export interface GitHubStatsResponse extends ApiResponse<GitHubUser> {}
export interface GitHubReposResponse extends ApiResponse<GitHubRepo[]> {}