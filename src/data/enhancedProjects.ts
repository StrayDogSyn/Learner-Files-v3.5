import type { ProjectCard } from '../types/project';
import type { DemoPreset } from '../types/demo';

// Demo presets for interactive projects
const marvelQuizPresets: DemoPreset[] = [
  {
    id: 'easy-mode',
    name: 'Easy Mode',
    description: 'Beginner-friendly questions with multiple choice',
    configuration: { difficulty: 'easy', timeLimit: 30, questionCount: 10 },
    code: '// Easy mode configuration\nconst config = { difficulty: "easy", timeLimit: 30 };',
  },
  {
    id: 'hard-mode',
    name: 'Hard Mode',
    description: 'Advanced MCU trivia with strict time limits',
    configuration: { difficulty: 'hard', timeLimit: 15, questionCount: 20 },
    code: '// Hard mode configuration\nconst config = { difficulty: "hard", timeLimit: 15 };',
  },
  {
    id: 'speed-run',
    name: 'Speed Run',
    description: 'Ultra-fast questions for experienced fans',
    configuration: { difficulty: 'expert', timeLimit: 10, questionCount: 30 },
    code: '// Speed run configuration\nconst config = { difficulty: "expert", timeLimit: 10 };',
  },
];

const portfolioPresets: DemoPreset[] = [
  {
    id: 'dark-theme',
    name: 'Dark Theme',
    description: 'Experience the portfolio in dark mode',
    configuration: { theme: 'dark', animations: true, glassmorphism: true },
    code: '// Dark theme configuration\nconst theme = { mode: "dark", glassmorphism: true };',
  },
  {
    id: 'light-theme',
    name: 'Light Theme',
    description: 'Clean light mode with subtle shadows',
    configuration: { theme: 'light', animations: true, glassmorphism: false },
    code: '// Light theme configuration\nconst theme = { mode: "light", glassmorphism: false };',
  },
  {
    id: 'performance-mode',
    name: 'Performance Mode',
    description: 'Optimized for maximum performance',
    configuration: { theme: 'dark', animations: false, glassmorphism: false },
    code: '// Performance mode configuration\nconst config = { animations: false, glassmorphism: false };',
  },
];

export const enhancedProjects: ProjectCard[] = [
  {
    id: 'marvel-quiz-game',
    title: 'Marvel Quiz Game',
    description:
      'Interactive MCU trivia game with dynamic difficulty scaling and real-time scoring',
    longDescription: `A comprehensive Marvel Cinematic Universe quiz application featuring 
    multiple difficulty levels, timed challenges, and a global leaderboard. Built with 
    modern web technologies to deliver a smooth, responsive gaming experience. Features 
    real-time API integration with Marvel's character database and dynamic question generation.`,
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Marvel API', 'CryptoJS'],
    liveDemo: 'https://straydogsyn.github.io/Learner-Files-v3.5/#/marvel-quiz',
    githubRepo: 'https://github.com/StrayDogSyn/marvel-quiz-game',
    featured: true,
    category: 'game',
    screenshots: [
      {
        id: 'marvel-quiz-1',
        url: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Marvel%20superhero%20quiz%20game%20interface%20with%20red%20and%20gold%20colors%2C%20modern%20UI%20design%2C%20comic%20book%20style%2C%20interactive%20buttons%2C%20score%20display&image_size=landscape_16_9',
        alt: 'Marvel Quiz Game Interface',
        caption: 'Interactive quiz interface with dynamic scoring',
        width: 1920,
        height: 1080,
      },
    ],
    keyFeatures: [
      'Dynamic question generation from Marvel API',
      'Progressive difficulty system with 4 levels',
      'Real-time score tracking and leaderboards',
      'Responsive design optimized for all devices',
      'Local storage for persistent high scores',
      'Animated UI transitions and feedback',
      'Character image integration',
      'Timer-based challenges with bonus points',
    ],
    metrics: {
      accuracy: '95%',
      performance: '2.1s load time',
      uptime: '99.9%',
      bundleSize: '245KB',
      lighthouseScore: 98,
      githubStars: 12,
      forks: 3,
      issues: 2,
      lastCommit: '2024-01-15',
    },
    demoConfig: {
      projectId: 'marvel-quiz-game',
      demoType: 'game',
      height: '600px',
      interactive: true,
      codeVisible: true,
      configurable: true,
      presets: marvelQuizPresets,
      embedUrl: 'https://straydogsyn.github.io/Learner-Files-v3.5/#/marvel-quiz',
      theme: 'dark',
      responsive: true,
      fullscreen: true,
      analytics: true,
    },
    status: 'live',
    priority: 1,
    tags: ['game', 'interactive', 'api-integration', 'real-time', 'marvel', 'quiz'],
    difficulty: 'intermediate',
    estimatedTime: '2-3 weeks',
    dependencies: ['React', 'TypeScript', 'Marvel API', 'Tailwind CSS'],
    deploymentUrl: 'https://straydogsyn.github.io/Learner-Files-v3.5/#/marvel-quiz',
    documentationUrl: 'https://github.com/StrayDogSyn/marvel-quiz-game/blob/main/README.md',
    videoDemo: 'https://www.youtube.com/watch?v=example',
    caseStudy: '/case-studies/marvel-quiz-game',
  },
  {
    id: 'portfolio-v3',
    title: 'Multi-Domain Portfolio',
    description:
      'Professional business website showcasing Stray Dog Syndications LLC services and expertise.',
    longDescription: `The official website for Stray Dog Syndications LLC, featuring professional 
    services, business portfolio, and company information. Built with modern web technologies 
    including React 19, TypeScript, and Tailwind CSS with glassmorphic design elements and 
    optimized performance. Demonstrates advanced React patterns, performance optimization, 
    and modern web development best practices.`,
    techStack: [
      'React 19',
      'TypeScript',
      'Tailwind CSS',
      'Vite',
      'GitHub Actions',
      'Vercel',
      'Framer Motion',
    ],
    liveDemo: 'https://straydog-syndications-llc.com/',
    githubRepo: 'https://github.com/StrayDogSyn/Learner-Files-v3.5',
    featured: true,
    category: 'portfolio',
    screenshots: [
      {
        id: 'portfolio-1',
        url: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Professional%20business%20website%20for%20Stray%20Dog%20Syndications%20LLC%2C%20modern%20corporate%20design%2C%20glassmorphic%20elements%2C%20green%20branding%2C%20business%20services%20layout%2C%20clean%20professional%20interface&image_size=landscape_16_9',
        alt: 'Stray Dog Syndications LLC Business Website',
        caption: 'Professional business website with modern design',
        width: 1920,
        height: 1080,
      },
    ],
    keyFeatures: [
      'Professional business presentation and services',
      'Company portfolio and expertise showcase',
      'Modern glassmorphic design with green branding',
      'Mobile-responsive layout optimized for all devices',
      'SEO optimized content for business visibility',
      'Fast loading performance and Core Web Vitals',
      'Professional contact and inquiry system',
      'Brand-consistent design across all pages',
      'Clean navigation and user experience',
      'Business-focused content and messaging',
    ],
    metrics: {
      accuracy: '100%',
      performance: '1.8s load time',
      uptime: '99.95%',
      bundleSize: '180KB',
      lighthouseScore: 100,
      githubStars: 25,
      forks: 8,
      issues: 5,
      lastCommit: '2024-01-20',
    },
    demoConfig: {
      projectId: 'portfolio-v3',
      demoType: 'component',
      height: '700px',
      interactive: true,
      codeVisible: true,
      configurable: true,
      presets: portfolioPresets,
      embedUrl: 'https://straydog-syndications-llc.com/',
    },
    status: 'live',
    priority: 2,
    tags: [
      'portfolio',
      'react',
      'typescript',
      'performance',
      'seo',
      'multi-domain',
      'glassmorphism',
    ],
    difficulty: 'advanced',
    estimatedTime: '4-6 weeks',
    dependencies: ['React 19', 'TypeScript', 'Tailwind CSS', 'Vite', 'Vercel'],
    deploymentUrl: 'https://straydog-syndications-llc.com/',
    documentationUrl: 'https://github.com/StrayDogSyn/Learner-Files-v3.5/blob/main/README.md',
    videoDemo: 'https://www.youtube.com/watch?v=example',
    caseStudy: '/case-studies/portfolio-v3',
  },
  {
    id: 'kitchen-management-system',
    title: 'Kitchen Management System',
    description: 'Restaurant management platform built from 20+ years of culinary experience',
    longDescription: `A comprehensive kitchen management system designed from real-world 
    culinary experience. Features inventory tracking, recipe management, staff scheduling, 
    and real-time order processing. Built with modern web technologies and optimized for 
    high-pressure kitchen environments. Demonstrates domain expertise translation from 
    culinary arts to software development.`,
    techStack: ['React', 'Node.js', 'MongoDB', 'Express.js', 'Socket.io', 'Stripe API', 'JWT'],
    liveDemo: 'https://kitchen.straydog-syndications-llc.com',
    githubRepo: 'https://github.com/StrayDogSyn/kitchen-management-system',
    featured: true,
    category: 'web-app',
    screenshots: [
      {
        id: 'kitchen-1',
        url: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Restaurant%20kitchen%20management%20dashboard%20with%20modern%20UI%2C%20inventory%20tracking%2C%20recipe%20management%2C%20professional%20design%2C%20green%20accents&image_size=landscape_16_9',
        alt: 'Kitchen Management Dashboard',
        caption: 'Real-time inventory and order management',
        width: 1920,
        height: 1080,
      },
    ],
    keyFeatures: [
      'Real-time inventory tracking with low-stock alerts',
      'Recipe management system with cost analysis',
      'Staff scheduling and payroll integration',
      'Order processing and tracking with notifications',
      'Customer relationship management (CRM)',
      'Analytics and reporting with data visualization',
      'Mobile-responsive design for kitchen tablets',
      'Payment processing integration with Stripe',
      'Real-time notifications with Socket.io',
      'Multi-location support with role-based access',
    ],
    metrics: {
      accuracy: '99.8%',
      performance: '2.5s load time',
      uptime: '99.7%',
      bundleSize: '320KB',
      lighthouseScore: 92,
      githubStars: 18,
      forks: 5,
      issues: 3,
      lastCommit: '2024-01-18',
    },
    status: 'live',
    priority: 3,
    tags: ['web-app', 'restaurant', 'inventory', 'real-time', 'mongodb', 'nodejs', 'stripe'],
    difficulty: 'advanced',
    estimatedTime: '8-12 weeks',
    dependencies: ['React', 'Node.js', 'MongoDB', 'Express.js', 'Socket.io', 'Stripe'],
    deploymentUrl: 'https://kitchen.straydog-syndications-llc.com',
    documentationUrl:
      'https://github.com/StrayDogSyn/kitchen-management-system/blob/main/README.md',
    videoDemo: 'https://www.youtube.com/watch?v=example',
    caseStudy: '/case-studies/kitchen-management',
  },
  {
    id: 'ai-content-writer',
    title: 'AI Content Writing Assistant',
    description: 'AI-powered content creation tool for technical writing and documentation',
    longDescription: `An AI-powered content writing assistant specifically designed for 
    technical documentation, blog posts, and professional content creation. Integrates 
    with Claude API and OpenAI for intelligent content generation and editing. Features 
    advanced text analysis, SEO optimization, and collaborative editing capabilities.`,
    techStack: [
      'React',
      'TypeScript',
      'Claude API',
      'OpenAI API',
      'Node.js',
      'PostgreSQL',
      'Redis',
    ],
    liveDemo: 'https://writer.straydog-syndications-llc.com',
    githubRepo: 'https://github.com/StrayDogSyn/ai-content-writer',
    featured: true,
    category: 'ai',
    screenshots: [
      {
        id: 'ai-writer-1',
        url: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=AI%20content%20writing%20interface%20with%20modern%20design%2C%20text%20editor%2C%20AI%20suggestions%2C%20professional%20layout%2C%20green%20theme&image_size=landscape_16_9',
        alt: 'AI Content Writer Interface',
        caption: 'AI-powered writing assistant with real-time suggestions',
        width: 1920,
        height: 1080,
      },
    ],
    keyFeatures: [
      'AI-powered content generation with multiple models',
      'Technical documentation support with markdown',
      'Real-time collaboration with conflict resolution',
      'Version control and history with diff viewing',
      'SEO optimization tools with keyword analysis',
      'Multi-format export (PDF, Word, HTML, Markdown)',
      'Template library with customizable prompts',
      'Quality assurance checks with grammar and style',
      'API integration with Claude and OpenAI',
      'User authentication and role-based permissions',
    ],
    metrics: {
      accuracy: '94%',
      performance: '3.2s load time',
      uptime: '99.5%',
      bundleSize: '280KB',
      lighthouseScore: 89,
      githubStars: 15,
      forks: 4,
      issues: 7,
      lastCommit: '2024-01-16',
    },
    status: 'live',
    priority: 4,
    tags: ['ai', 'content-generation', 'openai', 'claude', 'technical-writing', 'seo'],
    difficulty: 'expert',
    estimatedTime: '10-14 weeks',
    dependencies: ['React', 'TypeScript', 'Claude API', 'OpenAI API', 'PostgreSQL'],
    deploymentUrl: 'https://writer.straydog-syndications-llc.com',
    documentationUrl: 'https://github.com/StrayDogSyn/ai-content-writer/blob/main/README.md',
    videoDemo: 'https://www.youtube.com/watch?v=example',
    caseStudy: '/case-studies/ai-content-writer',
  },
  {
    id: 'react-performance-dashboard',
    title: 'React Performance Dashboard',
    description: 'Real-time performance monitoring and optimization showcase',
    longDescription: `A comprehensive performance monitoring dashboard built with React 
    that demonstrates advanced optimization techniques. Features real-time Core Web Vitals 
    tracking, bundle analysis, and performance recommendations. Serves as both a tool and 
    a showcase of performance optimization expertise.`,
    techStack: ['React', 'TypeScript', 'Web Vitals', 'Bundle Analyzer', 'Service Worker', 'PWA'],
    liveDemo: 'https://performance.straydog-syndications-llc.com',
    githubRepo: 'https://github.com/StrayDogSyn/react-performance-dashboard',
    featured: false,
    category: 'web-app',
    screenshots: [
      {
        id: 'performance-1',
        url: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Performance%20monitoring%20dashboard%20with%20charts%2C%20metrics%2C%20real-time%20data%2C%20modern%20UI%2C%20professional%20design&image_size=landscape_16_9',
        alt: 'Performance Dashboard',
        caption: 'Real-time performance metrics and optimization insights',
        width: 1920,
        height: 1080,
      },
    ],
    keyFeatures: [
      'Real-time Core Web Vitals monitoring',
      'Bundle size analysis with visual charts',
      'Performance budget enforcement',
      'A/B testing framework integration',
      'Error boundary implementation',
      'Service Worker for offline functionality',
      'Progressive Web App features',
      'Performance recommendations engine',
      'Historical data tracking and trends',
      'Custom performance metrics',
    ],
    metrics: {
      accuracy: '99.9%',
      performance: '1.2s load time',
      uptime: '99.99%',
      bundleSize: '95KB',
      lighthouseScore: 100,
      githubStars: 8,
      forks: 2,
      issues: 1,
      lastCommit: '2024-01-19',
    },
    status: 'live',
    priority: 5,
    tags: ['performance', 'monitoring', 'web-vitals', 'optimization', 'pwa', 'analytics'],
    difficulty: 'expert',
    estimatedTime: '6-8 weeks',
    dependencies: ['React', 'TypeScript', 'Web Vitals', 'Service Worker'],
    deploymentUrl: 'https://performance.straydog-syndications-llc.com',
    documentationUrl:
      'https://github.com/StrayDogSyn/react-performance-dashboard/blob/main/README.md',
    videoDemo: 'https://www.youtube.com/watch?v=example',
    caseStudy: '/case-studies/performance-dashboard',
  },
];

// Helper functions for enhanced project management
export const getFeaturedProjects = (): ProjectCard[] => {
  return enhancedProjects
    .filter(project => project.featured)
    .sort((a, b) => a.priority - b.priority);
};

export const getProjectsByCategory = (category: ProjectCard['category']): ProjectCard[] => {
  return enhancedProjects
    .filter(project => project.category === category)
    .sort((a, b) => a.priority - b.priority);
};

export const getProjectsByDifficulty = (difficulty: ProjectCard['difficulty']): ProjectCard[] => {
  return enhancedProjects
    .filter(project => project.difficulty === difficulty)
    .sort((a, b) => a.priority - b.priority);
};

export const getProjectsByStatus = (status: ProjectCard['status']): ProjectCard[] => {
  return enhancedProjects
    .filter(project => project.status === status)
    .sort((a, b) => a.priority - b.priority);
};

export const getProjectById = (id: string): ProjectCard | undefined => {
  return enhancedProjects.find(project => project.id === id);
};

export const getLiveProjects = (): ProjectCard[] => {
  return enhancedProjects
    .filter(project => project.status === 'live' && project.liveDemo)
    .sort((a, b) => a.priority - b.priority);
};

export const getAllProjectsSorted = (): ProjectCard[] => {
  return enhancedProjects.sort((a, b) => a.priority - b.priority);
};

export const getProjectsWithDemos = (): ProjectCard[] => {
  return enhancedProjects
    .filter(project => project.demoConfig)
    .sort((a, b) => a.priority - b.priority);
};

export const getProjectsByTechStack = (tech: string): ProjectCard[] => {
  return enhancedProjects
    .filter(project => project.techStack.some(t => t.toLowerCase().includes(tech.toLowerCase())))
    .sort((a, b) => a.priority - b.priority);
};

export const getProjectsByTags = (tags: string[]): ProjectCard[] => {
  return enhancedProjects
    .filter(project => project.tags.some(tag => tags.includes(tag)))
    .sort((a, b) => a.priority - b.priority);
};

// Statistics and analytics
export const getProjectStats = () => {
  const total = enhancedProjects.length;
  const live = enhancedProjects.filter(p => p.status === 'live').length;
  const featured = enhancedProjects.filter(p => p.featured).length;
  const categories = [...new Set(enhancedProjects.map(p => p.category))];
  const difficulties = [...new Set(enhancedProjects.map(p => p.difficulty))];

  const techStack = enhancedProjects.reduce((acc, project) => {
    project.techStack.forEach(tech => {
      acc[tech] = (acc[tech] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  return {
    total,
    live,
    featured,
    categories,
    difficulties,
    techStack,
    averageStars:
      enhancedProjects.reduce((sum, p) => sum + (p.metrics?.githubStars || 0), 0) / total,
    averageLighthouseScore:
      enhancedProjects.reduce((sum, p) => sum + (p.metrics?.lighthouseScore || 0), 0) / total,
  };
};
