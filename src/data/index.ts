import { Project, Skill } from '../types';

export const projects: Project[] = [
  {
    id: '1',
    title: 'AI-Powered Recipe Generator',
    description: 'Machine learning system that creates unique recipes based on available ingredients and dietary preferences.',
    technologies: ['Python', 'TensorFlow', 'React', 'FastAPI'],
    image: '/images/ai-recipe.jpg',
    githubUrl: 'https://github.com/yourusername/ai-recipe-generator',
    category: 'ai-ml'
  },
  {
    id: '2',
    title: 'Portfolio Website',
    description: 'Modern, responsive portfolio built with React and TypeScript, featuring glassmorphism design.',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Vite'],
    image: '/images/portfolio.jpg',
    githubUrl: 'https://github.com/yourusername/portfolio',
    liveUrl: 'https://yourportfolio.com',
    category: 'web-dev'
  },
  {
    id: '3',
    title: 'Data Analysis Dashboard',
    description: 'Interactive dashboard for analyzing business metrics with real-time data visualization.',
    technologies: ['Python', 'Pandas', 'Plotly', 'Streamlit'],
    image: '/images/dashboard.jpg',
    githubUrl: 'https://github.com/yourusername/data-dashboard',
    category: 'data-science'
  },
  {
    id: '4',
    title: 'Automated Testing Suite',
    description: 'Comprehensive testing framework for web applications with CI/CD integration.',
    technologies: ['Jest', 'Cypress', 'GitHub Actions', 'Docker'],
    image: '/images/testing.jpg',
    githubUrl: 'https://github.com/yourusername/testing-suite',
    category: 'automation'
  },
  {
    id: '5',
    title: 'Machine Learning Model API',
    description: 'RESTful API serving trained ML models with automatic scaling and monitoring.',
    technologies: ['Python', 'FastAPI', 'Docker', 'Kubernetes'],
    image: '/images/ml-api.jpg',
    githubUrl: 'https://github.com/yourusername/ml-api',
    category: 'ai-ml'
  },
  {
    id: '6',
    title: 'E-commerce Platform',
    description: 'Full-stack e-commerce solution with payment processing and inventory management.',
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
    image: '/images/ecommerce.jpg',
    githubUrl: 'https://github.com/yourusername/ecommerce',
    category: 'web-dev'
  }
];

export const skills: Skill[] = [
  { name: 'React', level: 90, category: 'frontend' },
  { name: 'TypeScript', level: 85, category: 'frontend' },
  { name: 'Python', level: 88, category: 'backend' },
  { name: 'Node.js', level: 82, category: 'backend' },
  { name: 'TensorFlow', level: 80, category: 'ai-ml' },
  { name: 'PostgreSQL', level: 78, category: 'backend' },
  { name: 'Docker', level: 75, category: 'devops' },
  { name: 'Git', level: 90, category: 'tools' }
];
