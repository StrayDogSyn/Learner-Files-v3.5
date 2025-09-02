import { EnhancedProject } from '../data/enhancedProjects';

interface ProjectMetadata {
  name: string;
  description?: string;
  version?: string;
  author?: string;
  license?: string;
  repository?: string;
  homepage?: string;
  keywords?: string[];
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  scripts?: Record<string, string>;
}

interface FileAnalysis {
  path: string;
  type: 'component' | 'hook' | 'utility' | 'config' | 'test' | 'style' | 'asset' | 'documentation';
  language: string;
  size: number;
  complexity?: number;
  imports?: string[];
  exports?: string[];
  functions?: string[];
  classes?: string[];
  components?: string[];
}

interface TechnologyStack {
  frontend: string[];
  backend: string[];
  database: string[];
  deployment: string[];
  testing: string[];
  styling: string[];
  stateManagement: string[];
  buildTools: string[];
  other: string[];
}

interface ProjectAnalysisResult {
  metadata: ProjectMetadata;
  technologies: TechnologyStack;
  files: FileAnalysis[];
  structure: {
    totalFiles: number;
    totalLines: number;
    directories: string[];
    mainEntryPoint?: string;
  };
  features: string[];
  complexity: {
    overall: 'low' | 'medium' | 'high';
    score: number;
    factors: string[];
  };
  performance: {
    bundleSize?: number;
    dependencies: number;
    devDependencies: number;
  };
  quality: {
    hasTests: boolean;
    hasTypeScript: boolean;
    hasLinting: boolean;
    hasDocumentation: boolean;
    codeStyle: 'good' | 'fair' | 'needs-improvement';
  };
  suggestions: string[];
}

interface RepositoryInfo {
  url: string;
  branch?: string;
  lastCommit?: {
    hash: string;
    message: string;
    date: Date;
    author: string;
  };
  stats?: {
    commits: number;
    contributors: number;
    stars?: number;
    forks?: number;
  };
}

class ProjectAnalyzer {
  private technologyPatterns: Record<string, RegExp[]> = {
    // Frontend frameworks
    react: [/react/i, /jsx/i, /tsx/i],
    vue: [/vue/i, /\.vue$/],
    angular: [/angular/i, /@angular/],
    svelte: [/svelte/i],
    
    // Backend frameworks
    express: [/express/i],
    fastify: [/fastify/i],
    koa: [/koa/i],
    nestjs: [/nestjs/i, /@nestjs/],
    
    // Languages
    typescript: [/typescript/i, /\.ts$/, /\.tsx$/],
    javascript: [/\.js$/, /\.jsx$/],
    python: [/\.py$/, /python/i],
    
    // Styling
    tailwind: [/tailwind/i],
    sass: [/sass/i, /scss/i, /\.scss$/],
    css: [/\.css$/],
    styledComponents: [/styled-components/i],
    
    // State management
    redux: [/redux/i, /@reduxjs/],
    zustand: [/zustand/i],
    mobx: [/mobx/i],
    
    // Testing
    jest: [/jest/i],
    vitest: [/vitest/i],
    cypress: [/cypress/i],
    playwright: [/playwright/i],
    
    // Build tools
    vite: [/vite/i],
    webpack: [/webpack/i],
    rollup: [/rollup/i],
    parcel: [/parcel/i],
    
    // Databases
    mongodb: [/mongodb/i, /mongoose/i],
    postgresql: [/postgresql/i, /postgres/i, /pg/i],
    mysql: [/mysql/i],
    sqlite: [/sqlite/i],
    supabase: [/supabase/i],
    
    // Deployment
    vercel: [/vercel/i],
    netlify: [/netlify/i],
    docker: [/docker/i, /dockerfile/i],
    aws: [/aws/i, /@aws/],
    
    // AI/ML
    tensorflow: [/tensorflow/i],
    pytorch: [/pytorch/i, /torch/i],
    openai: [/openai/i],
    anthropic: [/anthropic/i, /claude/i]
  };

  /**
   * Analyze a project from package.json and file structure
   */
  async analyzeProject(projectPath: string): Promise<ProjectAnalysisResult> {
    try {
      const metadata = await this.extractMetadata(projectPath);
      const files = await this.analyzeFiles(projectPath);
      const technologies = this.detectTechnologies(metadata, files);
      const structure = this.analyzeStructure(files);
      const features = this.extractFeatures(metadata, files, technologies);
      const complexity = this.calculateComplexity(files, technologies);
      const performance = this.analyzePerformance(metadata, files);
      const quality = this.assessQuality(metadata, files);
      const suggestions = this.generateSuggestions(complexity, quality, technologies);

      return {
        metadata,
        technologies,
        files,
        structure,
        features,
        complexity,
        performance,
        quality,
        suggestions
      };
    } catch (error) {
      console.error('Project analysis failed:', error);
      throw new Error(`Failed to analyze project: ${error}`);
    }
  }

  /**
   * Convert analysis result to EnhancedProject format
   */
  convertToEnhancedProject(analysis: ProjectAnalysisResult, repositoryInfo?: RepositoryInfo): EnhancedProject {
    const { metadata, technologies, features, complexity, performance, quality } = analysis;
    
    // Combine all technologies
    const allTechnologies = [
      ...technologies.frontend,
      ...technologies.backend,
      ...technologies.database,
      ...technologies.styling,
      ...technologies.stateManagement,
      ...technologies.buildTools
    ].filter((tech, index, arr) => arr.indexOf(tech) === index);

    // Determine category based on technologies
    let category = 'Web Development';
    if (technologies.frontend.some(tech => ['react', 'vue', 'angular'].includes(tech.toLowerCase()))) {
      category = 'Frontend';
    }
    if (technologies.backend.length > 0) {
      category = technologies.frontend.length > 0 ? 'Full Stack' : 'Backend';
    }
    if (allTechnologies.some(tech => ['tensorflow', 'pytorch', 'openai', 'anthropic'].includes(tech.toLowerCase()))) {
      category = 'AI/ML';
    }

    // Generate demo URL if it's a web project
    const demoUrl = repositoryInfo?.url ? `${repositoryInfo.url.replace('github.com', 'github.io')}` : undefined;

    return {
      id: metadata.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      title: metadata.name,
      description: metadata.description || 'A project built with modern technologies',
      longDescription: this.generateLongDescription(analysis),
      category,
      technologies: allTechnologies,
      image: this.generateProjectImage(metadata.name, category),
      demoUrl,
      githubUrl: repositoryInfo?.url,
      featured: complexity.overall === 'high' || quality.codeStyle === 'good',
      status: 'completed' as const,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      teamSize: 1,
      role: 'Full Stack Developer',
      keyFeatures: features,
      challenges: this.generateChallenges(complexity, technologies),
      solutions: this.generateSolutions(technologies, quality),
      impact: this.generateImpact(complexity, performance),
      lessonsLearned: this.generateLessonsLearned(technologies, quality),
      futureEnhancements: analysis.suggestions,
      metrics: {
        performanceScore: this.calculatePerformanceScore(performance, quality),
        codeQuality: quality.codeStyle === 'good' ? 95 : quality.codeStyle === 'fair' ? 80 : 65,
        userSatisfaction: 90,
        completionRate: 100
      },
      testimonials: [],
      relatedProjects: [],
      tags: this.generateTags(technologies, features, category)
    };
  }

  /**
   * Batch analyze multiple projects
   */
  async analyzeMultipleProjects(projectPaths: string[]): Promise<EnhancedProject[]> {
    const results: EnhancedProject[] = [];
    
    for (const path of projectPaths) {
      try {
        const analysis = await this.analyzeProject(path);
        const enhancedProject = this.convertToEnhancedProject(analysis);
        results.push(enhancedProject);
      } catch (error) {
        console.warn(`Failed to analyze project at ${path}:`, error);
      }
    }
    
    return results;
  }

  /**
   * Extract metadata from package.json
   */
  private async extractMetadata(projectPath: string): Promise<ProjectMetadata> {
    // In a real implementation, this would read the actual package.json file
    // For now, we'll simulate with mock data
    return {
      name: 'Sample Project',
      description: 'A sample project for demonstration',
      version: '1.0.0',
      author: 'Developer',
      license: 'MIT',
      keywords: ['react', 'typescript', 'vite'],
      dependencies: {
        'react': '^18.0.0',
        'typescript': '^5.0.0',
        'vite': '^5.0.0'
      },
      devDependencies: {
        '@types/react': '^18.0.0',
        'eslint': '^8.0.0'
      },
      scripts: {
        'dev': 'vite',
        'build': 'vite build',
        'test': 'vitest'
      }
    };
  }

  /**
   * Analyze project files
   */
  private async analyzeFiles(projectPath: string): Promise<FileAnalysis[]> {
    // In a real implementation, this would scan the actual file system
    // For now, we'll simulate with mock data
    return [
      {
        path: 'src/App.tsx',
        type: 'component',
        language: 'typescript',
        size: 1500,
        complexity: 3,
        imports: ['react', 'react-router-dom'],
        exports: ['App'],
        components: ['App']
      },
      {
        path: 'src/components/Header.tsx',
        type: 'component',
        language: 'typescript',
        size: 800,
        complexity: 2,
        imports: ['react'],
        exports: ['Header'],
        components: ['Header']
      },
      {
        path: 'src/hooks/useAuth.ts',
        type: 'hook',
        language: 'typescript',
        size: 600,
        complexity: 2,
        imports: ['react'],
        exports: ['useAuth'],
        functions: ['useAuth']
      }
    ];
  }

  /**
   * Detect technologies used in the project
   */
  private detectTechnologies(metadata: ProjectMetadata, files: FileAnalysis[]): TechnologyStack {
    const technologies: TechnologyStack = {
      frontend: [],
      backend: [],
      database: [],
      deployment: [],
      testing: [],
      styling: [],
      stateManagement: [],
      buildTools: [],
      other: []
    };

    const allDependencies = {
      ...metadata.dependencies,
      ...metadata.devDependencies
    };

    // Analyze dependencies and files
    const allText = [
      JSON.stringify(allDependencies),
      ...files.map(f => f.path),
      ...(files.flatMap(f => f.imports || []))
    ].join(' ');

    // Detect technologies based on patterns
    Object.entries(this.technologyPatterns).forEach(([tech, patterns]) => {
      if (patterns.some(pattern => pattern.test(allText))) {
        // Categorize technology
        if (['react', 'vue', 'angular', 'svelte'].includes(tech)) {
          technologies.frontend.push(tech);
        } else if (['express', 'fastify', 'koa', 'nestjs'].includes(tech)) {
          technologies.backend.push(tech);
        } else if (['mongodb', 'postgresql', 'mysql', 'sqlite', 'supabase'].includes(tech)) {
          technologies.database.push(tech);
        } else if (['tailwind', 'sass', 'css', 'styledComponents'].includes(tech)) {
          technologies.styling.push(tech);
        } else if (['redux', 'zustand', 'mobx'].includes(tech)) {
          technologies.stateManagement.push(tech);
        } else if (['jest', 'vitest', 'cypress', 'playwright'].includes(tech)) {
          technologies.testing.push(tech);
        } else if (['vite', 'webpack', 'rollup', 'parcel'].includes(tech)) {
          technologies.buildTools.push(tech);
        } else if (['vercel', 'netlify', 'docker', 'aws'].includes(tech)) {
          technologies.deployment.push(tech);
        } else {
          technologies.other.push(tech);
        }
      }
    });

    return technologies;
  }

  /**
   * Analyze project structure
   */
  private analyzeStructure(files: FileAnalysis[]) {
    const directories = [...new Set(files.map(f => f.path.split('/').slice(0, -1).join('/')))]
      .filter(dir => dir.length > 0);
    
    const totalLines = files.reduce((sum, file) => sum + (file.size || 0), 0);
    const mainEntryPoint = files.find(f => f.path.includes('App.') || f.path.includes('main.') || f.path.includes('index.'))?.path;

    return {
      totalFiles: files.length,
      totalLines,
      directories,
      mainEntryPoint
    };
  }

  /**
   * Extract project features
   */
  private extractFeatures(metadata: ProjectMetadata, files: FileAnalysis[], technologies: TechnologyStack): string[] {
    const features: string[] = [];

    // Based on technologies
    if (technologies.frontend.length > 0) {
      features.push('Modern Frontend Framework');
    }
    if (technologies.backend.length > 0) {
      features.push('Backend API');
    }
    if (technologies.database.length > 0) {
      features.push('Database Integration');
    }
    if (technologies.testing.length > 0) {
      features.push('Comprehensive Testing');
    }
    if (technologies.styling.includes('tailwind')) {
      features.push('Responsive Design');
    }
    if (technologies.stateManagement.length > 0) {
      features.push('State Management');
    }

    // Based on file analysis
    if (files.some(f => f.type === 'hook')) {
      features.push('Custom Hooks');
    }
    if (files.some(f => f.path.includes('auth'))) {
      features.push('Authentication');
    }
    if (files.some(f => f.path.includes('api'))) {
      features.push('API Integration');
    }

    return features;
  }

  /**
   * Calculate project complexity
   */
  private calculateComplexity(files: FileAnalysis[], technologies: TechnologyStack) {
    let score = 0;
    const factors: string[] = [];

    // File count factor
    if (files.length > 50) {
      score += 3;
      factors.push('Large codebase');
    } else if (files.length > 20) {
      score += 2;
      factors.push('Medium codebase');
    } else {
      score += 1;
      factors.push('Small codebase');
    }

    // Technology diversity
    const totalTechs = Object.values(technologies).flat().length;
    if (totalTechs > 10) {
      score += 3;
      factors.push('Diverse technology stack');
    } else if (totalTechs > 5) {
      score += 2;
      factors.push('Moderate technology stack');
    }

    // Backend complexity
    if (technologies.backend.length > 0) {
      score += 2;
      factors.push('Backend implementation');
    }

    // Database complexity
    if (technologies.database.length > 0) {
      score += 2;
      factors.push('Database integration');
    }

    const overall = score >= 8 ? 'high' : score >= 5 ? 'medium' : 'low';

    return { overall, score, factors };
  }

  /**
   * Analyze performance characteristics
   */
  private analyzePerformance(metadata: ProjectMetadata, files: FileAnalysis[]) {
    const dependencies = Object.keys(metadata.dependencies || {}).length;
    const devDependencies = Object.keys(metadata.devDependencies || {}).length;
    
    return {
      dependencies,
      devDependencies
    };
  }

  /**
   * Assess code quality
   */
  private assessQuality(metadata: ProjectMetadata, files: FileAnalysis[]) {
    const hasTests = files.some(f => f.type === 'test') || 
                    Object.keys(metadata.devDependencies || {}).some(dep => 
                      ['jest', 'vitest', 'cypress', 'playwright'].some(test => dep.includes(test)));
    
    const hasTypeScript = files.some(f => f.language === 'typescript');
    
    const hasLinting = Object.keys(metadata.devDependencies || {}).some(dep => 
                      dep.includes('eslint') || dep.includes('prettier'));
    
    const hasDocumentation = files.some(f => f.path.toLowerCase().includes('readme'));
    
    let qualityScore = 0;
    if (hasTests) qualityScore++;
    if (hasTypeScript) qualityScore++;
    if (hasLinting) qualityScore++;
    if (hasDocumentation) qualityScore++;
    
    const codeStyle = qualityScore >= 3 ? 'good' : qualityScore >= 2 ? 'fair' : 'needs-improvement';

    return {
      hasTests,
      hasTypeScript,
      hasLinting,
      hasDocumentation,
      codeStyle
    };
  }

  /**
   * Generate improvement suggestions
   */
  private generateSuggestions(complexity: any, quality: any, technologies: TechnologyStack): string[] {
    const suggestions: string[] = [];

    if (!quality.hasTests) {
      suggestions.push('Add comprehensive test coverage');
    }
    if (!quality.hasTypeScript) {
      suggestions.push('Migrate to TypeScript for better type safety');
    }
    if (!quality.hasLinting) {
      suggestions.push('Set up ESLint and Prettier for code quality');
    }
    if (!quality.hasDocumentation) {
      suggestions.push('Add comprehensive documentation');
    }
    if (complexity.overall === 'high') {
      suggestions.push('Consider breaking down into smaller modules');
    }
    if (technologies.testing.length === 0) {
      suggestions.push('Implement automated testing strategy');
    }

    return suggestions;
  }

  // Helper methods for EnhancedProject conversion

  private generateLongDescription(analysis: ProjectAnalysisResult): string {
    const { metadata, technologies, features, complexity } = analysis;
    
    return `${metadata.description || 'A comprehensive project'} built with ${technologies.frontend.join(', ')} and featuring ${features.join(', ')}. This ${complexity.overall}-complexity project demonstrates modern development practices and clean architecture.`;
  }

  private generateProjectImage(name: string, category: string): string {
    const encodedName = encodeURIComponent(`${category} project: ${name}`);
    return `https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=${encodedName}&image_size=landscape_16_9`;
  }

  private generateChallenges(complexity: any, technologies: TechnologyStack): string[] {
    const challenges: string[] = [];
    
    if (complexity.overall === 'high') {
      challenges.push('Managing complex architecture and dependencies');
    }
    if (technologies.backend.length > 0 && technologies.frontend.length > 0) {
      challenges.push('Coordinating frontend and backend development');
    }
    if (technologies.database.length > 0) {
      challenges.push('Optimizing database performance and queries');
    }
    
    return challenges;
  }

  private generateSolutions(technologies: TechnologyStack, quality: any): string[] {
    const solutions: string[] = [];
    
    if (quality.hasTypeScript) {
      solutions.push('Implemented TypeScript for type safety and better developer experience');
    }
    if (technologies.testing.length > 0) {
      solutions.push('Established comprehensive testing strategy for reliability');
    }
    if (technologies.buildTools.length > 0) {
      solutions.push('Optimized build process for better performance');
    }
    
    return solutions;
  }

  private generateImpact(complexity: any, performance: any): string[] {
    const impact: string[] = [];
    
    if (complexity.overall === 'high') {
      impact.push('Demonstrated ability to handle complex technical challenges');
    }
    if (performance.dependencies < 20) {
      impact.push('Maintained lean dependency footprint for better performance');
    }
    
    impact.push('Enhanced development skills and technical expertise');
    
    return impact;
  }

  private generateLessonsLearned(technologies: TechnologyStack, quality: any): string[] {
    const lessons: string[] = [];
    
    if (quality.hasTypeScript) {
      lessons.push('TypeScript significantly improves code maintainability');
    }
    if (technologies.testing.length > 0) {
      lessons.push('Comprehensive testing saves time in the long run');
    }
    
    lessons.push('Clean architecture and good practices are essential for scalability');
    
    return lessons;
  }

  private calculatePerformanceScore(performance: any, quality: any): number {
    let score = 80; // Base score
    
    if (performance.dependencies < 10) score += 10;
    else if (performance.dependencies < 20) score += 5;
    
    if (quality.codeStyle === 'good') score += 10;
    else if (quality.codeStyle === 'fair') score += 5;
    
    return Math.min(score, 100);
  }

  private generateTags(technologies: TechnologyStack, features: string[], category: string): string[] {
    const tags = new Set<string>();
    
    // Add category
    tags.add(category.toLowerCase());
    
    // Add technologies
    Object.values(technologies).flat().forEach(tech => tags.add(tech.toLowerCase()));
    
    // Add feature-based tags
    features.forEach(feature => {
      if (feature.toLowerCase().includes('responsive')) tags.add('responsive');
      if (feature.toLowerCase().includes('api')) tags.add('api');
      if (feature.toLowerCase().includes('auth')) tags.add('authentication');
    });
    
    return Array.from(tags);
  }
}

// Export singleton instance
export const projectAnalyzer = new ProjectAnalyzer();

// Export class for custom instances
export { ProjectAnalyzer };

// Export types
export type {
  ProjectMetadata,
  FileAnalysis,
  TechnologyStack,
  ProjectAnalysisResult,
  RepositoryInfo
};