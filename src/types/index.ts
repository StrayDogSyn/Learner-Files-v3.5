export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  image: string;
  githubUrl?: string;
  liveUrl?: string;
  category: 'ai-ml' | 'web-dev' | 'data-science' | 'automation';
}

export interface Skill {
  name: string;
  level: number;
  category: 'frontend' | 'backend' | 'ai-ml' | 'devops' | 'tools';
}
