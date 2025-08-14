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
    title: 'Multi-Domain Portfolio System',
    description: 'Comprehensive portfolio showcasing across three domains with unified branding',
    longDescription: `A sophisticated multi-domain portfolio system built with React 19, TypeScript, 
    and Tailwind CSS. Features automated deployment, glassmorphic design, and optimized performance 
    across all three domains: straydog-syndications-llc.com, straydogsyndicationsllc.biz, and 
    straydog-secondstory.org.`,
    techStack: ['React 19', 'TypeScript', 'Tailwind CSS', 'Vite', 'GitHub Actions', 'Vercel'],
    features: [
      'Multi-domain deployment system',
      'Dark/Light theme toggle',
      'Glassmorphic design system',
      'Mobile-first responsive design',
      'SEO optimized for all domains',
      'Automated CI/CD pipeline',
      'Performance monitoring',
      'Brand asset management',
    ],
    liveUrl: 'https://straydog-syndications-llc.com/',
    githubUrl: 'https://github.com/StrayDogSyn/Learner-Files-v3.5',
    image:
      'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Modern%20developer%20portfolio%20website%20with%20glassmorphic%20design%2C%20dark%20theme%2C%20green%20accents%2C%20clean%20layout%2C%20professional%20coding%20interface&image_size=landscape_16_9',
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
