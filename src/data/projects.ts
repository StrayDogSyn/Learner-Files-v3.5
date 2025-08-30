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
    liveUrl: 'https://straydogsyn.github.io/Learner-Files-v3.5/marvel-quiz-game/',
    githubUrl: 'https://github.com/StrayDogSyn/Learner-Files-v3.5/tree/main/marvel-quiz-game',
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
    githubUrl: 'https://github.com/StrayDogSyn/Learner-Files-v3.5',
    image:
      'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Professional%20business%20website%20with%20glassmorphic%20design%2C%20modern%20layout%2C%20corporate%20branding%2C%20clean%20interface&image_size=landscape_16_9',
    category: 'featured',
    status: 'live',
    priority: 2,
  },
];

// Helper functions
export const getFeaturedProjects = (): Project[] => {
  return projects
    .filter(project => project.category === 'featured')
    .sort((a, b) => a.priority - b.priority);
};

export const getAllProjectsSorted = (): Project[] => {
  return projects.sort((a, b) => a.priority - b.priority);
};

export const getProjectById = (id: string): Project | undefined => {
  return projects.find(project => project.id === id);
};

export const getProjectsByCategory = (category: Project['category']): Project[] => {
  return projects
    .filter(project => project.category === category)
    .sort((a, b) => a.priority - b.priority);
};

export const getLiveProjects = (): Project[] => {
  return projects
    .filter(project => project.status === 'live')
    .sort((a, b) => a.priority - b.priority);
};