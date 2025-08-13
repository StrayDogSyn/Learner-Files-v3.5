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
}

export const projects: Project[] = [
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
      'Animated UI transitions'
    ],
    liveUrl: 'https://straydogsyn.github.io/Learner-Files-v3.5/#/marvel-quiz',
    githubUrl: 'https://github.com/StrayDogSyn/marvel-quiz-game',
    image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Marvel%20superhero%20quiz%20game%20interface%20with%20red%20and%20gold%20colors%2C%20modern%20UI%20design%2C%20comic%20book%20style%2C%20interactive%20buttons%2C%20score%20display&image_size=landscape_16_9',
    category: 'featured',
    status: 'live'
  },
  {
    id: 'portfolio-v3',
    title: 'Developer Portfolio v3.5',
    description: 'AI-enhanced portfolio showcasing Tier 2 AISE developer skills',
    longDescription: `Modern portfolio built with React 19, TypeScript, and Tailwind CSS. 
    Features automated deployment via GitHub Actions and is optimized for performance.`,
    techStack: ['React 19', 'TypeScript', 'Tailwind CSS', 'Vite', 'GitHub Actions'],
    features: [
      'Dark/Light theme toggle',
      'Smooth animations',
      'GitHub Pages deployment',
      'Mobile-first responsive design',
      'SEO optimized',
      'Glassmorphic design system'
    ],
    liveUrl: 'https://straydogsyn.github.io/Learner-Files-v3.5/',
    githubUrl: 'https://github.com/StrayDogSyn/Learner-Files-v3.5',
    image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Modern%20developer%20portfolio%20website%20with%20glassmorphic%20design%2C%20dark%20theme%2C%20green%20accents%2C%20clean%20layout%2C%20professional%20coding%20interface&image_size=landscape_16_9',
    category: 'web',
    status: 'live'
  },
  {
    id: 'ai-chat-assistant',
    title: 'AI Chat Assistant',
    description: 'Intelligent conversational AI with context awareness and memory',
    longDescription: `Advanced AI chat application built with modern web technologies, 
    featuring context-aware conversations, memory persistence, and customizable personalities.`,
    techStack: ['React', 'TypeScript', 'OpenAI API', 'Node.js', 'MongoDB'],
    features: [
      'Context-aware conversations',
      'Memory persistence',
      'Multiple AI personalities',
      'Real-time streaming responses',
      'Chat history management',
      'Custom prompt engineering'
    ],
    githubUrl: 'https://github.com/StrayDogSyn/ai-chat-assistant',
    image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=AI%20chat%20interface%20with%20modern%20design%2C%20chat%20bubbles%2C%20dark%20theme%2C%20futuristic%20elements%2C%20clean%20typography&image_size=landscape_16_9',
    category: 'ai',
    status: 'in-progress'
  },
  {
    id: 'task-automation-tool',
    title: 'Task Automation Suite',
    description: 'Comprehensive automation toolkit for developers and content creators',
    longDescription: `A powerful automation suite that streamlines repetitive tasks for developers 
    and content creators, featuring workflow builders, scheduled tasks, and integrations.`,
    techStack: ['Python', 'FastAPI', 'React', 'PostgreSQL', 'Docker'],
    features: [
      'Visual workflow builder',
      'Scheduled task execution',
      'API integrations',
      'Custom script support',
      'Performance monitoring',
      'Team collaboration'
    ],
    githubUrl: 'https://github.com/StrayDogSyn/task-automation-suite',
    image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Automation%20dashboard%20interface%20with%20workflow%20diagrams%2C%20modern%20UI%2C%20charts%20and%20graphs%2C%20professional%20design%2C%20blue%20accents&image_size=landscape_16_9',
    category: 'tool',
    status: 'planned'
  }
];

// Helper functions
export const getFeaturedProjects = (): Project[] => {
  return projects.filter(project => project.category === 'featured');
};

export const getProjectsByCategory = (category: Project['category']): Project[] => {
  return projects.filter(project => project.category === category);
};

export const getProjectsByStatus = (status: Project['status']): Project[] => {
  return projects.filter(project => project.status === status);
};

export const getProjectById = (id: string): Project | undefined => {
  return projects.find(project => project.id === id);
};

export const getLiveProjects = (): Project[] => {
  return projects.filter(project => project.status === 'live' && project.liveUrl);
};