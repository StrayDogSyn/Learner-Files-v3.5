import { IconType } from 'react-icons';
import {
  FaReact,
  FaNodeJs,
  FaPython,
  FaJs,
  FaHtml5,
  FaCss3Alt,
  FaGitAlt,
  FaDocker,
  FaAws,
  FaVuejs,
  FaAngular,
  FaBootstrap,
  FaSass,
  FaFigma,
  FaGithub,
  FaNpm,
  FaYarn
} from 'react-icons/fa';
import {
  SiTypescript,
  SiJavascript,
  SiTailwindcss,
  SiNextdotjs,
  SiVite,
  SiWebpack,
  SiMongodb,
  SiPostgresql,
  SiMysql,
  SiRedis,
  SiGraphql,
  SiPrisma,
  SiSupabase,
  SiFirebase,
  SiVercel,
  SiNetlify,
  SiHeroku,
  SiExpress,
  SiNestjs,
  SiFastapi,
  SiDjango,
  SiFlask,
  SiJest,
  SiCypress,

  SiStorybook,
  SiEslint,
  SiPrettier,
  SiFramer,
  SiChakraui,
  SiMui,
  SiAntdesign,
  SiStyledcomponents,
  SiRedux,

  SiReactquery,
  SiSocketdotio,
  SiStripe,
  SiPaypal,
  SiOpenai,
  SiGooglecloud,
  SiKubernetes,
  SiTerraform,
  SiJenkins,
  SiGithubactions,
  SiLinux,
  SiUbuntu,
  SiIntellijidea,
  SiPostman,
  SiInsomnia,
  SiSlack,
  SiDiscord,
  SiNotion,
  SiTrello,
  SiJira,
  SiConfluence
} from 'react-icons/si';

export interface BrandIcon {
  icon: IconType;
  color: string;
  name: string;
}

const brandMap: Record<string, BrandIcon> = {
  // Frontend Frameworks & Libraries
  'react': { icon: FaReact, color: '#61DAFB', name: 'React' },
  'vue': { icon: FaVuejs, color: '#4FC08D', name: 'Vue.js' },
  'angular': { icon: FaAngular, color: '#DD0031', name: 'Angular' },
  'next': { icon: SiNextdotjs, color: '#000000', name: 'Next.js' },
  'nextjs': { icon: SiNextdotjs, color: '#000000', name: 'Next.js' },
  'next.js': { icon: SiNextdotjs, color: '#000000', name: 'Next.js' },
  
  // Languages
  'javascript': { icon: SiJavascript, color: '#F7DF1E', name: 'JavaScript' },
  'js': { icon: FaJs, color: '#F7DF1E', name: 'JavaScript' },
  'typescript': { icon: SiTypescript, color: '#3178C6', name: 'TypeScript' },
  'ts': { icon: SiTypescript, color: '#3178C6', name: 'TypeScript' },
  'python': { icon: FaPython, color: '#3776AB', name: 'Python' },
  'html': { icon: FaHtml5, color: '#E34F26', name: 'HTML5' },
  'html5': { icon: FaHtml5, color: '#E34F26', name: 'HTML5' },
  'css': { icon: FaCss3Alt, color: '#1572B6', name: 'CSS3' },
  'css3': { icon: FaCss3Alt, color: '#1572B6', name: 'CSS3' },
  
  // Styling
  'tailwind': { icon: SiTailwindcss, color: '#06B6D4', name: 'Tailwind CSS' },
  'tailwindcss': { icon: SiTailwindcss, color: '#06B6D4', name: 'Tailwind CSS' },
  'bootstrap': { icon: FaBootstrap, color: '#7952B3', name: 'Bootstrap' },
  'sass': { icon: FaSass, color: '#CC6699', name: 'Sass' },
  'scss': { icon: FaSass, color: '#CC6699', name: 'Sass' },
  'styled-components': { icon: SiStyledcomponents, color: '#DB7093', name: 'Styled Components' },
  'mui': { icon: SiMui, color: '#007FFF', name: 'Material-UI' },
  'material-ui': { icon: SiMui, color: '#007FFF', name: 'Material-UI' },
  'chakra': { icon: SiChakraui, color: '#319795', name: 'Chakra UI' },
  'chakra-ui': { icon: SiChakraui, color: '#319795', name: 'Chakra UI' },
  'antd': { icon: SiAntdesign, color: '#0170FE', name: 'Ant Design' },
  'ant-design': { icon: SiAntdesign, color: '#0170FE', name: 'Ant Design' },
  
  // Backend
  'node': { icon: FaNodeJs, color: '#339933', name: 'Node.js' },
  'nodejs': { icon: FaNodeJs, color: '#339933', name: 'Node.js' },
  'node.js': { icon: FaNodeJs, color: '#339933', name: 'Node.js' },
  'express': { icon: SiExpress, color: '#000000', name: 'Express.js' },
  'expressjs': { icon: SiExpress, color: '#000000', name: 'Express.js' },
  'nestjs': { icon: SiNestjs, color: '#E0234E', name: 'NestJS' },
  'fastapi': { icon: SiFastapi, color: '#009688', name: 'FastAPI' },
  'django': { icon: SiDjango, color: '#092E20', name: 'Django' },
  'flask': { icon: SiFlask, color: '#000000', name: 'Flask' },
  
  // Databases
  'mongodb': { icon: SiMongodb, color: '#47A248', name: 'MongoDB' },
  'postgres': { icon: SiPostgresql, color: '#336791', name: 'PostgreSQL' },
  'postgresql': { icon: SiPostgresql, color: '#336791', name: 'PostgreSQL' },
  'mysql': { icon: SiMysql, color: '#4479A1', name: 'MySQL' },
  'redis': { icon: SiRedis, color: '#DC382D', name: 'Redis' },
  'supabase': { icon: SiSupabase, color: '#3ECF8E', name: 'Supabase' },
  'firebase': { icon: SiFirebase, color: '#FFCA28', name: 'Firebase' },
  
  // Tools & Build
  'vite': { icon: SiVite, color: '#646CFF', name: 'Vite' },
  'webpack': { icon: SiWebpack, color: '#8DD6F9', name: 'Webpack' },
  'git': { icon: FaGitAlt, color: '#F05032', name: 'Git' },
  'github': { icon: FaGithub, color: '#181717', name: 'GitHub' },
  'npm': { icon: FaNpm, color: '#CB3837', name: 'npm' },
  'yarn': { icon: FaYarn, color: '#2C8EBB', name: 'Yarn' },
  'docker': { icon: FaDocker, color: '#2496ED', name: 'Docker' },
  
  // State Management
  'redux': { icon: SiRedux, color: '#764ABC', name: 'Redux' },

  'react-query': { icon: SiReactquery, color: '#FF4154', name: 'React Query' },
  
  // Testing
  'jest': { icon: SiJest, color: '#C21325', name: 'Jest' },
  'cypress': { icon: SiCypress, color: '#17202C', name: 'Cypress' },

  
  // Cloud & Deployment
  'aws': { icon: FaAws, color: '#FF9900', name: 'AWS' },
  'vercel': { icon: SiVercel, color: '#000000', name: 'Vercel' },
  'netlify': { icon: SiNetlify, color: '#00C7B7', name: 'Netlify' },
  'heroku': { icon: SiHeroku, color: '#430098', name: 'Heroku' },
  
  // Design
  'figma': { icon: FaFigma, color: '#F24E1E', name: 'Figma' },
  'framer': { icon: SiFramer, color: '#0055FF', name: 'Framer Motion' },
  'framer-motion': { icon: SiFramer, color: '#0055FF', name: 'Framer Motion' },
  
  // APIs & Services
  'graphql': { icon: SiGraphql, color: '#E10098', name: 'GraphQL' },
  'prisma': { icon: SiPrisma, color: '#2D3748', name: 'Prisma' },
  'stripe': { icon: SiStripe, color: '#008CDD', name: 'Stripe' },
  'openai': { icon: SiOpenai, color: '#412991', name: 'OpenAI' },
  'socket.io': { icon: SiSocketdotio, color: '#010101', name: 'Socket.IO' },
  'socketio': { icon: SiSocketdotio, color: '#010101', name: 'Socket.IO' }
};

export const getBrandIcon = (technology: string): BrandIcon | null => {
  const key = technology.toLowerCase().trim();
  return brandMap[key] || null;
};

export const getAllBrands = (): BrandIcon[] => {
  return Object.values(brandMap);
};

export const getBrandsByCategory = (category: 'frontend' | 'backend' | 'database' | 'tools' | 'cloud'): BrandIcon[] => {
  const categories = {
    frontend: ['react', 'vue', 'angular', 'next.js', 'javascript', 'typescript', 'html5', 'css3', 'tailwindcss', 'bootstrap', 'sass'],
    backend: ['node.js', 'express', 'nestjs', 'fastapi', 'django', 'flask', 'python'],
    database: ['mongodb', 'postgresql', 'mysql', 'redis', 'supabase', 'firebase'],
    tools: ['vite', 'webpack', 'git', 'github', 'npm', 'yarn', 'docker', 'jest', 'cypress'],
    cloud: ['aws', 'vercel', 'netlify', 'heroku']
  };
  
  return categories[category]?.map(tech => brandMap[tech]).filter(Boolean) || [];
};

export default brandMap;