import { Project } from './projects';

export interface EnhancedProject extends Project {
  githubRepo?: string; // GitHub repository URL for API access
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
  tags?: string[];
  complexity?: 'beginner' | 'intermediate' | 'advanced';
  timeline?: string;
  challenges?: string[];
  learnings?: string[];
}

export const enhancedProjects: EnhancedProject[] = [
  {
    id: 'marvel-quiz-game',
    title: 'Marvel Quiz Game',
    description: 'Interactive MCU trivia game with dynamic difficulty scaling and real-time scoring',
    longDescription: `A comprehensive Marvel Cinematic Universe quiz application featuring 
    multiple difficulty levels, timed challenges, and a global leaderboard. Built with 
    modern web technologies to deliver a smooth, responsive gaming experience.`,
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Marvel API'],
    features: [
      'Dynamic question generation from Marvel API',
      'Progressive difficulty system',
      'Real-time score tracking',
      'Responsive design for all devices',
      'Local storage for high scores',
      'Animated UI transitions',
    ],
    liveUrl: 'https://straydogsyn.github.io/Learner-Files-v3.5/marvel-quiz-game/',
    githubUrl: 'https://github.com/StrayDogSyn/Learner-Files-v3.5/tree/main/marvel-quiz-game',
    githubRepo: 'https://github.com/StrayDogSyn/Learner-Files-v3.5',
    image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Marvel%20superhero%20quiz%20game%20interface%20with%20red%20and%20gold%20colors%2C%20modern%20UI%20design%2C%20comic%20book%20style%2C%20interactive%20buttons%2C%20score%20display&image_size=landscape_16_9',
    category: 'featured',
    status: 'live',
    priority: 1,
    stats: {
      stars: 15,
      forks: 3,
      commits: 127,
      contributors: 1,
      lastUpdated: '2024-01-15'
    },
    metrics: {
      performance: 95,
      accessibility: 88,
      seo: 92,
      bestPractices: 90
    },
    tags: ['React', 'Gaming', 'API Integration', 'Responsive'],
    complexity: 'intermediate',
    timeline: '3 weeks',
    challenges: [
      'API rate limiting management',
      'Dynamic difficulty scaling algorithm',
      'Real-time score calculation'
    ],
    learnings: [
      'Advanced React state management',
      'API optimization techniques',
      'Game logic implementation'
    ]
  },
  {
    id: 'portfolio-v3',
    title: 'Multi-Domain Portfolio',
    description: 'Professional business website showcasing Stray Dog Syndications LLC services and expertise.',
    longDescription: `The official website for Stray Dog Syndications LLC, featuring professional 
    services, business portfolio, and company information. Built with modern web technologies 
    including React 19, TypeScript, and Tailwind CSS with glassmorphic design elements and 
    optimized performance across multiple domains.`,
    techStack: ['React 19', 'TypeScript', 'Tailwind CSS', 'Vite', 'GitHub Actions', 'Vercel'],
    features: [
      'Professional business presentation',
      'Service portfolio showcase',
      'Company information and contact',
      'Modern glassmorphic design',
      'Mobile-responsive layout',
      'SEO optimized content',
      'Fast loading performance',
      'Professional branding system',
    ],
    liveUrl: 'https://straydog-syndications-llc.com/',
    githubUrl: 'https://github.com/StrayDogSyn/Learner-Files-v3.5',
    githubRepo: 'https://github.com/StrayDogSyn/Learner-Files-v3.5',
    image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Professional%20business%20website%20with%20glassmorphic%20design%2C%20modern%20layout%2C%20corporate%20branding%2C%20clean%20interface&image_size=landscape_16_9',
    category: 'featured',
    status: 'live',
    priority: 2,
    stats: {
      stars: 8,
      forks: 2,
      commits: 89,
      contributors: 1,
      lastUpdated: '2024-01-20'
    },
    metrics: {
      performance: 98,
      accessibility: 95,
      seo: 96,
      bestPractices: 94
    },
    tags: ['Business', 'Portfolio', 'Professional', 'Multi-Domain'],
    complexity: 'advanced',
    timeline: '4 weeks',
    challenges: [
      'Multi-domain architecture',
      'Performance optimization',
      'Professional branding consistency'
    ],
    learnings: [
      'Advanced React 19 features',
      'Enterprise-level architecture',
      'Professional web development'
    ]
  }
];

// Helper functions
export const getFeaturedProjects = (): EnhancedProject[] => {
  return enhancedProjects
    .filter(project => project.category === 'featured')
    .sort((a, b) => a.priority - b.priority);
};

export const getProjectStats = (projectId: string) => {
  const project = enhancedProjects.find(p => p.id === projectId);
  return project?.stats || {
    stars: 0,
    forks: 0,
    commits: 0,
    contributors: 0,
    lastUpdated: 'Unknown'
  };
};

export const getProjectsByComplexity = (complexity: EnhancedProject['complexity']): EnhancedProject[] => {
  return enhancedProjects
    .filter(project => project.complexity === complexity)
    .sort((a, b) => a.priority - b.priority);
};

export const getProjectMetrics = (projectId: string) => {
  const project = enhancedProjects.find(p => p.id === projectId);
  return project?.metrics || {
    performance: 0,
    accessibility: 0,
    seo: 0,
    bestPractices: 0
  };
};

export const getAllEnhancedProjects = (): EnhancedProject[] => {
  return enhancedProjects.sort((a, b) => a.priority - b.priority);
};

export default enhancedProjects;