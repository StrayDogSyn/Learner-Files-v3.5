export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  techStack: string[];
  features: string[];
  liveUrl?: string;
  githubUrl?: string;
  image: string;
  category: 'featured' | 'web' | 'ai' | 'tool';
  status: 'live' | 'in-progress' | 'planned';
  priority: number; // For ordering
}

export const projects: Project[] = [
  {
    id: 'marvel-quiz-game',
    title: 'Marvel Quiz Game',
    description:
      'Interactive MCU trivia game with dynamic difficulty scaling and real-time scoring',
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
    liveUrl: 'https://straydogsyn.github.io/Learner-Files-v3.5/#/marvel-quiz',
    githubUrl: 'https://github.com/StrayDogSyn/marvel-quiz-game',
    image:
      'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Marvel%20superhero%20quiz%20game%20interface%20with%20red%20and%20gold%20colors%2C%20modern%20UI%20design%2C%20comic%20book%20style%2C%20interactive%20buttons%2C%20score%20display&image_size=landscape_16_9',
    category: 'featured',
    status: 'live',
    priority: 1,
  },
  {
    id: 'portfolio-v3',
    title: 'Multi-Domain Portfolio',
    description:
      'Professional business website showcasing Stray Dog Syndications LLC services and expertise.',
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
    image:
      'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Professional%20business%20website%20for%20Stray%20Dog%20Syndications%20LLC%2C%20modern%20corporate%20design%2C%20glassmorphic%20elements%2C%20green%20branding%2C%20business%20services%20layout%2C%20clean%20professional%20interface&image_size=landscape_16_9',
    category: 'featured',
    status: 'live',
    priority: 2,
  },
  {
    id: 'kitchen-management-system',
    title: 'Kitchen Management System',
    description: 'Restaurant management platform built from 20+ years of culinary experience',
    longDescription: `A comprehensive kitchen management system designed from real-world 
    culinary experience. Features inventory tracking, recipe management, staff scheduling, 
    and real-time order processing. Built with modern web technologies and optimized for 
    high-pressure kitchen environments.`,
    techStack: ['React', 'Node.js', 'MongoDB', 'Express.js', 'Socket.io', 'Stripe API'],
    features: [
      'Real-time inventory tracking',
      'Recipe management system',
      'Staff scheduling and payroll',
      'Order processing and tracking',
      'Customer relationship management',
      'Analytics and reporting',
      'Mobile-responsive design',
      'Payment processing integration',
    ],
    liveUrl: 'https://kitchen.straydog-syndications-llc.com',
    githubUrl: 'https://github.com/StrayDogSyn/kitchen-management-system',
    image:
      'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Restaurant%20kitchen%20management%20dashboard%20with%20modern%20UI%2C%20inventory%20tracking%2C%20recipe%20management%2C%20professional%20design%2C%20green%20accents&image_size=landscape_16_9',
    category: 'web',
    status: 'live',
    priority: 3,
  },
  {
    id: 'ai-content-writer',
    title: 'AI Content Writing Assistant',
    description: 'AI-powered content creation tool for technical writing and documentation',
    longDescription: `An AI-powered content writing assistant specifically designed for 
    technical documentation, blog posts, and professional content creation. Integrates 
    with Claude API and OpenAI for intelligent content generation and editing.`,
    techStack: ['React', 'TypeScript', 'Claude API', 'OpenAI API', 'Node.js', 'PostgreSQL'],
    features: [
      'AI-powered content generation',
      'Technical documentation support',
      'Real-time collaboration',
      'Version control and history',
      'SEO optimization tools',
      'Multi-format export',
      'Template library',
      'Quality assurance checks',
    ],
    liveUrl: 'https://writer.straydog-syndications-llc.com',
    githubUrl: 'https://github.com/StrayDogSyn/ai-content-writer',
    image:
      'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=AI%20content%20writing%20interface%20with%20modern%20design%2C%20text%20editor%2C%20AI%20suggestions%2C%20professional%20layout%2C%20green%20theme&image_size=landscape_16_9',
    category: 'ai',
    status: 'live',
    priority: 4,
  },
];

// Helper functions
export const getFeaturedProjects = (): Project[] => {
  return projects
    .filter(project => project.category === 'featured')
    .sort((a, b) => a.priority - b.priority);
};

export const getProjectsByCategory = (category: Project['category']): Project[] => {
  return projects
    .filter(project => project.category === category)
    .sort((a, b) => a.priority - b.priority);
};

export const getProjectsByStatus = (status: Project['status']): Project[] => {
  return projects
    .filter(project => project.status === status)
    .sort((a, b) => a.priority - b.priority);
};

export const getProjectById = (id: string): Project | undefined => {
  return projects.find(project => project.id === id);
};

export const getLiveProjects = (): Project[] => {
  return projects
    .filter(project => project.status === 'live' && project.liveUrl)
    .sort((a, b) => a.priority - b.priority);
};

export const getAllProjectsSorted = (): Project[] => {
  return projects.sort((a, b) => a.priority - b.priority);
};
