import { Project, PersonalInfo } from '@/types/core';

export const projects: Project[] = [
  {
    id: 'ai-recipe-optimizer',
    title: 'AI Recipe Optimizer',
    description: 'Machine learning system that analyzes nutritional data and user preferences to suggest optimized recipes. Built during my culinary background transition to tech.',
    technologies: ['Python', 'TensorFlow', 'React', 'FastAPI', 'PostgreSQL'],
    liveUrl: 'https://recipe-optimizer-demo.vercel.app',
    githubUrl: 'https://github.com/username/ai-recipe-optimizer',
    imageUrl: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20kitchen%20interface%20with%20AI%20recipe%20suggestions%20on%20tablet%20screen%20clean%20minimalist%20design&image_size=landscape_16_9',
    featured: true,
    status: 'completed',
    category: 'ai',
    highlights: [
      'Reduced meal planning time by 60%',
      'Improved nutritional balance scores by 40%',
      'Processed 10,000+ recipe combinations'
    ],
    challenges: [
      'Balancing taste preferences with nutritional requirements',
      'Handling diverse dietary restrictions and allergies',
      'Optimizing ML model performance for real-time suggestions'
    ],
    learnings: [
      'Advanced feature engineering for food data',
      'User experience design for complex AI systems',
      'Production deployment of ML models'
    ],
    metrics: {
      performance: '< 200ms response time',
      users: '500+ beta testers',
      impact: '60% reduction in meal planning time'
    },
    timeline: {
      start: '2023-06',
      end: '2023-09',
      duration: '3 months'
    }
  },
  {
    id: 'smart-inventory-tracker',
    title: 'Smart Inventory Tracker',
    description: 'Real-time inventory management system with predictive analytics for restaurant operations. Combines my culinary expertise with modern web technologies.',
    technologies: ['TypeScript', 'Next.js', 'Prisma', 'tRPC', 'Tailwind CSS'],
    liveUrl: 'https://inventory-tracker-demo.vercel.app',
    githubUrl: 'https://github.com/username/smart-inventory',
    imageUrl: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=restaurant%20inventory%20dashboard%20with%20charts%20and%20analytics%20modern%20web%20interface%20clean%20design&image_size=landscape_16_9',
    featured: true,
    status: 'completed',
    category: 'web',
    highlights: [
      'Reduced food waste by 35%',
      'Automated reorder predictions',
      'Real-time cost tracking'
    ],
    challenges: [
      'Integrating with legacy POS systems',
      'Handling real-time data synchronization',
      'Building intuitive UX for busy kitchen staff'
    ],
    learnings: [
      'Full-stack TypeScript development',
      'Database design for high-frequency updates',
      'User research in fast-paced environments'
    ],
    metrics: {
      performance: '99.9% uptime',
      users: '50+ restaurants',
      impact: '35% reduction in food waste'
    },
    timeline: {
      start: '2023-10',
      end: '2024-01',
      duration: '4 months'
    }
  },
  {
    id: 'portfolio-website',
    title: 'Interactive Portfolio',
    description: 'This very portfolio website showcasing my journey from culinary arts to software development. Features responsive design and smooth animations.',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Vite'],
    liveUrl: 'https://your-portfolio.vercel.app',
    githubUrl: 'https://github.com/username/portfolio',
    imageUrl: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20portfolio%20website%20with%20hunter%20green%20theme%20clean%20professional%20design%20coding%20workspace&image_size=landscape_16_9',
    featured: false,
    status: 'completed',
    category: 'web',
    highlights: [
      'Responsive design across all devices',
      'Smooth animations and transitions',
      'Optimized performance and SEO'
    ],
    challenges: [
      'Balancing visual appeal with performance',
      'Creating engaging storytelling through design',
      'Implementing complex animations smoothly'
    ],
    learnings: [
      'Advanced CSS animations and transitions',
      'Performance optimization techniques',
      'Design systems and component architecture'
    ],
    metrics: {
      performance: '95+ Lighthouse score',
      users: 'Growing visitor base',
      impact: 'Professional online presence'
    },
    timeline: {
      start: '2024-02',
      end: '2024-03',
      duration: '1 month'
    }
  },
  {
    id: 'task-automation-cli',
    title: 'Task Automation CLI',
    description: 'Command-line tool for automating repetitive development tasks. Built to streamline my daily workflow and boost productivity.',
    technologies: ['Node.js', 'TypeScript', 'Commander.js', 'Inquirer.js', 'Chalk'],
    githubUrl: 'https://github.com/username/dev-automation-cli',
    imageUrl: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=terminal%20command%20line%20interface%20with%20colorful%20output%20developer%20tools%20dark%20theme&image_size=landscape_16_9',
    featured: false,
    status: 'completed',
    category: 'tool',
    highlights: [
      'Automated 15+ common development tasks',
      'Saved 2+ hours per day',
      'Interactive command prompts'
    ],
    challenges: [
      'Cross-platform compatibility',
      'Error handling for various environments',
      'Creating intuitive command structure'
    ],
    learnings: [
      'Node.js CLI development patterns',
      'Package publishing and distribution',
      'User experience design for command-line tools'
    ],
    metrics: {
      performance: 'Sub-second execution',
      users: 'Personal and team use',
      impact: '2+ hours saved daily'
    },
    timeline: {
      start: '2024-01',
      end: '2024-02',
      duration: '1 month'
    }
  },
  {
    id: 'data-visualization-dashboard',
    title: 'Data Visualization Dashboard',
    description: 'Interactive dashboard for analyzing restaurant performance metrics. Transforms complex data into actionable insights.',
    technologies: ['React', 'D3.js', 'Python', 'Flask', 'Chart.js'],
    liveUrl: 'https://restaurant-analytics-demo.vercel.app',
    githubUrl: 'https://github.com/username/restaurant-analytics',
    imageUrl: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=data%20visualization%20dashboard%20with%20charts%20graphs%20analytics%20modern%20interface%20business%20intelligence&image_size=landscape_16_9',
    featured: false,
    status: 'in-progress',
    category: 'data',
    highlights: [
      'Real-time data processing',
      'Interactive chart components',
      'Automated report generation'
    ],
    challenges: [
      'Handling large datasets efficiently',
      'Creating responsive chart layouts',
      'Implementing real-time data updates'
    ],
    learnings: [
      'Advanced data visualization techniques',
      'Performance optimization for large datasets',
      'Backend API design for analytics'
    ],
    metrics: {
      performance: 'Processing 100k+ records',
      users: 'In beta testing',
      impact: 'Improved decision making'
    },
    timeline: {
      start: '2024-03',
      duration: 'Ongoing'
    }
  },
  {
    id: 'mobile-recipe-app',
    title: 'Mobile Recipe Companion',
    description: 'React Native app for discovering and saving recipes. Features offline support and social sharing capabilities.',
    technologies: ['React Native', 'Expo', 'TypeScript', 'AsyncStorage', 'Firebase'],
    githubUrl: 'https://github.com/username/recipe-companion',
    imageUrl: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=mobile%20recipe%20app%20interface%20on%20smartphone%20cooking%20ingredients%20modern%20mobile%20design&image_size=portrait_16_9',
    featured: false,
    status: 'planned',
    category: 'mobile',
    highlights: [
      'Offline recipe storage',
      'Social recipe sharing',
      'Ingredient shopping lists'
    ],
    challenges: [
      'Optimizing for mobile performance',
      'Implementing offline-first architecture',
      'Cross-platform compatibility'
    ],
    learnings: [
      'Mobile development best practices',
      'Offline data synchronization',
      'Mobile UX design principles'
    ],
    timeline: {
      start: '2024-04',
      duration: 'Planning phase'
    }
  }
];

export const personalInfo: PersonalInfo = {
  name: 'Your Name',
  title: 'Full-Stack Developer',
  tagline: 'From Kitchen to Code - Crafting Digital Experiences',
  bio: 'Passionate full-stack developer with a unique background in culinary arts. I bring creativity, attention to detail, and problem-solving skills from the kitchen to the world of software development. Specializing in React, TypeScript, and AI-powered applications.',
  location: 'Your City, Country',
  email: 'your.email@example.com',
  social: {
    github: 'https://github.com/yourusername',
    linkedin: 'https://linkedin.com/in/yourprofile',
    twitter: 'https://twitter.com/yourusername',
    website: 'https://yourwebsite.com'
  },
  skills: [
    {
      category: 'Frontend',
      items: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Framer Motion']
    },
    {
      category: 'Backend',
      items: ['Node.js', 'Python', 'PostgreSQL', 'MongoDB', 'FastAPI']
    },
    {
      category: 'AI/ML',
      items: ['TensorFlow', 'Scikit-learn', 'OpenAI API', 'Data Analysis', 'Pandas']
    },
    {
      category: 'Tools',
      items: ['Git', 'Docker', 'AWS', 'Vercel', 'Figma']
    }
  ],
  experience: [
    {
      company: 'Freelance',
      role: 'Full-Stack Developer',
      period: '2023 - Present',
      description: 'Building web applications and AI-powered tools for various clients, specializing in React and Python development.'
    },
    {
      company: 'Restaurant Industry',
      role: 'Culinary Professional',
      period: '2018 - 2023',
      description: 'Developed strong problem-solving skills, attention to detail, and ability to work under pressure in fast-paced kitchen environments.'
    }
  ]
};