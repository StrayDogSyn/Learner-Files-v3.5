import type { IconType } from 'react-icons';
import {
  SiReact,
  SiTypescript,
  SiNodedotjs,
  SiPython,
  SiJavascript,
  SiHtml5,
  SiCss3,
  SiTailwindcss,
  SiGit,
  SiGithub,
  SiMongodb,
  SiPostgresql,
  SiDocker,
  SiRedis,
  SiVite,
  SiVercel,
  SiFramer,
  SiSupabase,
  SiFirebase
} from 'react-icons/si';
import { VscCode } from 'react-icons/vsc';

export interface BrandIcon {
  name: string;
  icon: IconType;
  color: string;
  category: 'frontend' | 'backend' | 'database' | 'tools' | 'deployment';
}

export const brandIcons: Record<string, BrandIcon> = {
  react: {
    name: 'React',
    icon: SiReact,
    color: '#61DAFB',
    category: 'frontend'
  },
  typescript: {
    name: 'TypeScript',
    icon: SiTypescript,
    color: '#3178C6',
    category: 'frontend'
  },
  javascript: {
    name: 'JavaScript',
    icon: SiJavascript,
    color: '#F7DF1E',
    category: 'frontend'
  },
  html5: {
    name: 'HTML5',
    icon: SiHtml5,
    color: '#E34F26',
    category: 'frontend'
  },
  css3: {
    name: 'CSS3',
    icon: SiCss3,
    color: '#1572B6',
    category: 'frontend'
  },
  tailwind: {
    name: 'Tailwind CSS',
    icon: SiTailwindcss,
    color: '#06B6D4',
    category: 'frontend'
  },
  nodejs: {
    name: 'Node.js',
    icon: SiNodedotjs,
    color: '#339933',
    category: 'backend'
  },
  python: {
    name: 'Python',
    icon: SiPython,
    color: '#3776AB',
    category: 'backend'
  },
  mongodb: {
    name: 'MongoDB',
    icon: SiMongodb,
    color: '#47A248',
    category: 'database'
  },
  postgresql: {
    name: 'PostgreSQL',
    icon: SiPostgresql,
    color: '#336791',
    category: 'database'
  },
  redis: {
    name: 'Redis',
    icon: SiRedis,
    color: '#DC382D',
    category: 'database'
  },
  git: {
    name: 'Git',
    icon: SiGit,
    color: '#F05032',
    category: 'tools'
  },
  github: {
    name: 'GitHub',
    icon: SiGithub,
    color: '#181717',
    category: 'tools'
  },
  vscode: {
    name: 'VS Code',
    icon: VscCode,
    color: '#007ACC',
    category: 'tools'
  },
  docker: {
    name: 'Docker',
    icon: SiDocker,
    color: '#2496ED',
    category: 'tools'
  },
  vite: {
    name: 'Vite',
    icon: SiVite,
    color: '#646CFF',
    category: 'tools'
  },
  vercel: {
    name: 'Vercel',
    icon: SiVercel,
    color: '#000000',
    category: 'deployment'
  },
  framer: {
    name: 'Framer Motion',
    icon: SiFramer,
    color: '#0055FF',
    category: 'frontend'
  },
  supabase: {
    name: 'Supabase',
    icon: SiSupabase,
    color: '#3ECF8E',
    category: 'backend'
  },
  firebase: {
    name: 'Firebase',
    icon: SiFirebase,
    color: '#FFCA28',
    category: 'backend'
  }
};

// Helper function to get icon by name
export const getBrandIcon = (name: string): BrandIcon | undefined => {
  return brandIcons[name.toLowerCase()];
};

// Get icons by category
export const getIconsByCategory = (category: BrandIcon['category']): BrandIcon[] => {
  return Object.values(brandIcons).filter(icon => icon.category === category);
};

// Get all icon names
export const getAllIconNames = (): string[] => {
  return Object.keys(brandIcons);
};