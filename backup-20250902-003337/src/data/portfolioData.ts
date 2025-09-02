// Comprehensive portfolio data for Eric 'Hunter' Petross
// Based on Product Requirements Document specifications

import { 
  DeveloperProfile, 
  Project, 
  Certification, 
  Experience, 
  TechSkill 
} from '../types/portfolio';

// Core developer profile
export const developerProfile: DeveloperProfile = {
  name: "Eric 'Hunter' Petross",
  title: "Applied AI Solutions Engineer",
  location: "New England",
  bio: "Specializing in full-stack development and LLM integration. I architect scalable applications that bridge cutting-edge AI capabilities with production-ready infrastructure.",
  experienceYears: 20,
  githubUsername: "StrayDogSyn",
  contactMethods: [
    { type: 'email', value: 'contact@straydog-syndications-llc.com', label: 'Professional Email' },
    { type: 'github', value: 'https://github.com/StrayDogSyn', label: 'GitHub Profile' },
    { type: 'linkedin', value: 'https://linkedin.com/in/straydogsyn', label: 'LinkedIn' }
  ],
  digitalProperties: [
    { name: 'StrayDog Syndications LLC', url: 'https://www.straydog-syndications-llc.com/', description: 'Main Company Site', badgeColor: '7AA2F7' },
    { name: 'Second Story', url: 'https://www.straydog-secondstory.org/', description: 'Digital Storytelling', badgeColor: 'BB9AF7' },
    { name: 'Tech Division', url: 'https://www.straydogsyndicationsllc.tech/', description: 'Technical Services', badgeColor: 'F7768E' },
    { name: 'Business Hub', url: 'https://straydogsyndicationsllc.biz/', description: 'Business Operations', badgeColor: '9ECE6A' }
  ],
  professionalDifferentiators: [
    'Parallel development across 6 specialized IDEs for maximum efficiency',
    '3 deployed AI Slack agents serving business automation needs',
    'Integrated AI workflow combining Claude, Perplexity, and specialized tools',
    'Owner/operator of 4 active digital properties',
    'Community engagement instructor at The Moth',
    'Applied AI solutions for enterprise clients'
  ],
  keyDifferentiators: [
    'Parallel development across 6 specialized IDEs for maximum efficiency',
    '3 deployed AI Slack agents serving business automation needs',
    'Integrated AI workflow combining Claude, Perplexity, and specialized tools',
    'Owner/operator of 4 active digital properties',
    'Community engagement instructor at The Moth',
    'Applied AI solutions for enterprise clients'
  ]
};

// Technology skills with badges and proficiency levels
export const techSkills: TechSkill[] = [
  // Programming Languages
  { id: 'python', name: 'Python', category: 'programming', proficiencyLevel: 'expert', badgeUrl: 'https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white', yearsExperience: 8 },
  { id: 'typescript', name: 'TypeScript', category: 'programming', proficiencyLevel: 'advanced', badgeUrl: 'https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white', yearsExperience: 5 },
  { id: 'javascript', name: 'JavaScript', category: 'programming', proficiencyLevel: 'expert', badgeUrl: 'https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black', yearsExperience: 10 },
  { id: 'html5', name: 'HTML5', category: 'frontend', proficiencyLevel: 'expert', badgeUrl: 'https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white', yearsExperience: 15 },
  { id: 'css3', name: 'CSS3', category: 'frontend', proficiencyLevel: 'expert', badgeUrl: 'https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white', yearsExperience: 15 },
  { id: 'sql', name: 'SQL', category: 'backend', proficiencyLevel: 'advanced', badgeUrl: 'https://img.shields.io/badge/SQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white', yearsExperience: 12 },
  
  // Frontend Development
  { id: 'react', name: 'React', category: 'frontend', proficiencyLevel: 'expert', badgeUrl: 'https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB', yearsExperience: 6 },
  { id: 'nextjs', name: 'Next.js', category: 'frontend', proficiencyLevel: 'advanced', badgeUrl: 'https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white', yearsExperience: 3 },
  { id: 'tailwind', name: 'Tailwind CSS', category: 'frontend', proficiencyLevel: 'expert', badgeUrl: 'https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white', yearsExperience: 4 },
  { id: 'vite', name: 'Vite', category: 'tools', proficiencyLevel: 'advanced', badgeUrl: 'https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white', yearsExperience: 2 },
  
  // Backend Development
  { id: 'nodejs', name: 'Node.js', category: 'backend', proficiencyLevel: 'advanced', badgeUrl: 'https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white', yearsExperience: 6 },
  { id: 'express', name: 'Express.js', category: 'backend', proficiencyLevel: 'advanced', badgeUrl: 'https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white', yearsExperience: 5 },
  { id: 'mongodb', name: 'MongoDB', category: 'backend', proficiencyLevel: 'intermediate', badgeUrl: 'https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white', yearsExperience: 3 },
  { id: 'supabase', name: 'Supabase', category: 'backend', proficiencyLevel: 'advanced', badgeUrl: 'https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white', yearsExperience: 2 },
  
  // AI & LLM Tools
  { id: 'claude', name: 'Claude', category: 'ai', proficiencyLevel: 'expert', badgeUrl: 'https://img.shields.io/badge/Claude-FF6B35?style=for-the-badge&logo=anthropic&logoColor=white', yearsExperience: 2 },
  { id: 'gemini', name: 'Gemini', category: 'ai', proficiencyLevel: 'advanced', badgeUrl: 'https://img.shields.io/badge/Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white', yearsExperience: 1 },
  { id: 'perplexity', name: 'Perplexity Pro', category: 'ai', proficiencyLevel: 'expert', badgeUrl: 'https://img.shields.io/badge/Perplexity-20B2AA?style=for-the-badge&logo=perplexity&logoColor=white', yearsExperience: 2 },
  { id: 'langchain', name: 'LangChain', category: 'ai', proficiencyLevel: 'intermediate', badgeUrl: 'https://img.shields.io/badge/LangChain-1C3C3C?style=for-the-badge&logo=langchain&logoColor=white', yearsExperience: 1 },
  
  // Development Tools
  { id: 'vscode', name: 'VS Code + Copilot', category: 'tools', proficiencyLevel: 'expert', badgeUrl: 'https://img.shields.io/badge/VS_Code-007ACC?style=for-the-badge&logo=visual-studio-code&logoColor=white', yearsExperience: 8 },
  { id: 'cursor', name: 'Cursor Composer', category: 'tools', proficiencyLevel: 'expert', badgeUrl: 'https://img.shields.io/badge/Cursor-000000?style=for-the-badge&logo=cursor&logoColor=white', yearsExperience: 1 },
  { id: 'trae', name: 'Trae 2.0 + SOLO', category: 'tools', proficiencyLevel: 'expert', badgeUrl: 'https://img.shields.io/badge/Trae-FF6B35?style=for-the-badge&logo=trae&logoColor=white', yearsExperience: 1 },
  { id: 'gitkraken', name: 'GitKraken', category: 'tools', proficiencyLevel: 'advanced', badgeUrl: 'https://img.shields.io/badge/GitKraken-179287?style=for-the-badge&logo=gitkraken&logoColor=white', yearsExperience: 5 }
];

// Professional experience
export const experiences: Experience[] = [
  {
    id: 'moth-instructor',
    company: 'The Moth',
    position: 'Community Engagement Instructor',
    location: 'Remote',
    startDate: new Date('2023-01-01'),
    responsibilities: [
      'Facilitate storytelling workshops for diverse communities',
      'Develop curriculum for narrative development and public speaking',
      'Mentor emerging storytellers in crafting compelling narratives',
      'Coordinate community outreach programs'
    ],
    achievements: [
      'Successfully trained 200+ community members in storytelling techniques',
      'Developed innovative workshop formats for virtual engagement',
      'Increased community participation by 40% through inclusive programming'
    ],
    technologies: ['Public Speaking', 'Curriculum Development', 'Community Engagement']
  },
  {
    id: 'outlier-ai',
    company: 'Outlier AI',
    position: 'Content Writer',
    location: 'Remote',
    startDate: new Date('2023-06-01'),
    responsibilities: [
      'Create high-quality training content for AI model development',
      'Research and write technical documentation',
      'Collaborate with AI researchers on content strategy',
      'Ensure content accuracy and relevance for machine learning applications'
    ],
    achievements: [
      'Contributed to training datasets for multiple AI models',
      'Maintained 98% content approval rate',
      'Specialized in technical and educational content creation'
    ],
    technologies: ['AI Training', 'Technical Writing', 'Research', 'Content Strategy']
  },
  {
    id: 'straydog-founder',
    company: 'StrayDog Syndications LLC',
    position: 'Founder & CEO',
    location: 'New England',
    startDate: new Date('2020-01-01'),
    responsibilities: [
      'Lead technical strategy and AI solution development',
      'Manage 4 active digital properties and business operations',
      'Develop and deploy AI automation solutions for clients',
      'Oversee full-stack development projects and team coordination'
    ],
    achievements: [
      'Built and deployed 3 AI Slack agents for business automation',
      'Established 4 successful digital properties with active user bases',
      'Developed integrated AI workflow combining multiple platforms',
      'Generated consistent revenue through technical consulting services'
    ],
    technologies: ['Python', 'React', 'Node.js', 'AI/ML', 'Business Strategy', 'Team Leadership']
  }
];

// Certifications and education
export const certifications: Certification[] = [
  {
    id: 'justice-through-code',
    name: 'AI Solutions Engineer',
    issuer: 'Justice Through Code',
    completionDate: new Date('2023-12-01'),
    badgeUrl: 'https://img.shields.io/badge/AI_Solutions_Engineer-4CAF50?style=for-the-badge&logo=artificial-intelligence&logoColor=white',
    category: 'ai',
    status: 'completed'
  },
  {
    id: 'mongodb-developer',
    name: 'MongoDB Developer Certification',
    issuer: 'MongoDB University',
    completionDate: new Date('2023-08-01'),
    badgeUrl: 'https://img.shields.io/badge/MongoDB_Developer-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white',
    category: 'database',
    status: 'completed'
  },
  {
    id: 'ccri-degree',
    name: 'Computer & Networking Technology (In Progress)',
    issuer: 'Community College of Rhode Island',
    completionDate: new Date('2024-12-01'),
    badgeUrl: 'https://img.shields.io/badge/CCRI_CNT-1976D2?style=for-the-badge&logo=education&logoColor=white',
    category: 'education',
    status: 'in-progress'
  },
  {
    id: 'stem-scholar',
    name: 'STEM Pathway Scholar',
    issuer: 'Community College of Rhode Island',
    completionDate: new Date('2023-05-01'),
    badgeUrl: 'https://img.shields.io/badge/STEM_Scholar-FF9800?style=for-the-badge&logo=science&logoColor=white',
    category: 'education',
    status: 'completed'
  }
];

// Featured projects with live demos
export const projects: Project[] = [
  {
    id: 'ai-slack-agents',
    name: 'AI Slack Automation Agents',
    description: 'Three deployed AI agents providing business automation, customer service, and workflow optimization for enterprise clients.',
    technologies: ['Python', 'Slack API', 'Claude', 'LangChain', 'MongoDB'],
    repoUrl: 'https://github.com/StrayDogSyn/ai-slack-agents',
    status: 'completed',
    createdDate: new Date('2023-09-01'),
    category: 'ai',
    features: [
      'Automated customer inquiry routing and responses',
      'Intelligent workflow management and task assignment',
      'Real-time business analytics and reporting',
      'Multi-channel integration with existing business tools'
    ],
    highlights: [
      'Reduced customer response time by 75%',
      'Automated 80% of routine business processes',
      'Serving 3 active enterprise clients'
    ]
  },
  {
    id: 'portfolio-showcase',
    name: 'Professional Portfolio Platform',
    description: 'Comprehensive portfolio platform showcasing AI solutions engineering capabilities with dynamic GitHub integration.',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'GitHub API'],
    demoUrl: 'https://straydogsyn.github.io/portfolio',
    repoUrl: 'https://github.com/StrayDogSyn/portfolio',
    status: 'completed',
    createdDate: new Date('2024-01-01'),
    category: 'web',
    features: [
      'Dynamic typing animations and glassmorphic design',
      'Real-time GitHub statistics and repository showcase',
      'Responsive design with mobile optimization',
      'Professional contact forms and consultation requests'
    ],
    highlights: [
      'Built with modern React and TypeScript architecture',
      'Integrated GitHub API for live project statistics',
      'Professional glassmorphic design system'
    ]
  },
  {
    id: 'digital-ecosystem',
    name: 'Multi-Property Digital Ecosystem',
    description: 'Coordinated management of 4 active digital properties serving different business verticals and client needs.',
    technologies: ['React', 'Node.js', 'MongoDB', 'Digital Marketing', 'SEO'],
    demoUrl: 'https://www.straydog-syndications-llc.com/',
    repoUrl: 'https://github.com/StrayDogSyn/digital-ecosystem',
    status: 'completed',
    createdDate: new Date('2020-01-01'),
    category: 'business',
    features: [
      'Main company site with professional services showcase',
      'Digital storytelling platform for creative content',
      'Technical services division for development projects',
      'Business operations hub for client management'
    ],
    highlights: [
      'Managing 4 active digital properties simultaneously',
      'Consistent traffic growth across all properties',
      'Integrated business operations and client management'
    ]
  },
  {
    id: 'advanced-calculator',
    name: 'Advanced Scientific Calculator',
    description: 'Feature-rich calculator application with advanced mathematical functions, history tracking, and responsive design.',
    technologies: ['React', 'TypeScript', 'CSS3', 'Mathematical Libraries'],
    demoUrl: 'https://straydogsyn.github.io/advanced-calculator',
    repoUrl: 'https://github.com/StrayDogSyn/advanced-calculator',
    status: 'completed',
    createdDate: new Date('2023-11-01'),
    category: 'tools',
    features: [
      'Scientific and engineering calculation modes',
      'Calculation history with export functionality',
      'Keyboard shortcuts and accessibility features',
      'Responsive design for all device types'
    ],
    highlights: [
      'Complex mathematical operations support',
      'Intuitive user interface design',
      'Full accessibility compliance'
    ]
  },
  {
    id: 'strategy-game-suite',
    name: 'Interactive Strategy Game Suite',
    description: 'Collection of strategic thinking games including chess variants, puzzle games, and AI opponents.',
    technologies: ['React', 'TypeScript', 'Game Logic', 'AI Algorithms'],
    demoUrl: 'https://straydogsyn.github.io/strategy-games',
    repoUrl: 'https://github.com/StrayDogSyn/strategy-games',
    status: 'in-progress',
    createdDate: new Date('2023-12-01'),
    category: 'games',
    features: [
      'Multiple game variants with different difficulty levels',
      'AI opponents with adjustable intelligence',
      'Multiplayer support for competitive play',
      'Game statistics and performance tracking'
    ],
    highlights: [
      'Advanced AI opponent algorithms',
      'Smooth multiplayer experience',
      'Comprehensive game statistics'
    ]
  },
  {
    id: 'certification-tracker',
    name: 'Professional Certification Tracker',
    description: 'Comprehensive tool for tracking professional development, certifications, and continuing education progress.',
    technologies: ['React', 'TypeScript', 'Local Storage', 'Data Visualization'],
    demoUrl: 'https://straydogsyn.github.io/cert-tracker',
    repoUrl: 'https://github.com/StrayDogSyn/cert-tracker',
    status: 'completed',
    createdDate: new Date('2023-10-01'),
    category: 'tools',
    features: [
      'Certification progress tracking and reminders',
      'Professional development goal setting',
      'Visual progress charts and analytics',
      'Export functionality for professional portfolios'
    ],
    highlights: [
      'Comprehensive certification database',
      'Automated reminder system',
      'Professional portfolio integration'
    ]
  }
];

// Dynamic typing animation texts for hero section
export const heroTypingTexts = [
  "Applied AI Solutions Engineer",
  "Full-Stack Developer",
  "LLM Integration Specialist",
  "Business Automation Expert",
  "Community Engagement Leader",
  "Digital Ecosystem Architect"
];

// Navigation items for main menu
export const navigationItems = [
  { path: '/', label: 'Home', icon: 'home' },
  { path: '/about', label: 'About', icon: 'user' },
  { path: '/tech-stack', label: 'Tech Stack', icon: 'code' },
  { path: '/experience', label: 'Experience', icon: 'briefcase' },
  { path: '/portfolio', label: 'Portfolio', icon: 'folder' },
  { path: '/contact', label: 'Contact', icon: 'mail' }
];