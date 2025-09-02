import { Code, Brain, Database, Globe, User, Award, Briefcase, GraduationCap, ExternalLink, Github } from 'lucide-react';
import { useIntersectionObserver, useMultipleIntersectionObserver } from '../hooks/useIntersectionObserver';

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  category: 'AI/ML' | 'Full-Stack' | 'Frontend' | 'Backend';
  image?: string;
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
}

const projects: Project[] = [
  {
    id: '1',
    title: 'Cortana AI System',
    description: 'Advanced AI performance monitoring system with Lighthouse audits, real-time analytics, and automated optimization recommendations.',
    technologies: ['Claude 4.1 API', 'React', 'TypeScript', 'Node.js', 'Lighthouse'],
    category: 'AI/ML',
    featured: true,
    liveUrl: 'https://straydogsyndicationllc.tech',
    githubUrl: 'https://github.com/StrayDogSyndicate/cortana-ai'
  },
  {
    id: '2',
    title: 'Claude 4.1 Integration Platform',
    description: 'Comprehensive AI automation workflows leveraging Claude 4.1 for content generation, code analysis, and technical documentation.',
    technologies: ['Claude 4.1 API', 'Python', 'FastAPI', 'React', 'LangChain'],
    category: 'AI/ML',
    featured: true,
    liveUrl: 'https://straydogsyndicationllc.tech/ai-demos',
    githubUrl: 'https://github.com/StrayDogSyndicate/claude-integration'
  },
  {
    id: '3',
    title: 'Second Story Platform',
    description: 'Non-profit justice reform initiative platform with community engagement tools, case tracking, and advocacy resources.',
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Express', 'Supabase'],
    category: 'Full-Stack',
    featured: true,
    liveUrl: 'https://straydog-secondstory.org',
    githubUrl: 'https://github.com/StrayDogSyndicate/second-story'
  },
  {
    id: '4',
    title: 'Professional Portfolio',
    description: 'Modern glassmorphic portfolio showcasing AI/ML expertise, technical architecture, and 20+ years of customer service excellence.',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Framer Motion'],
    category: 'Frontend',
    featured: true,
    liveUrl: 'https://straydogsyndicationllc.tech/portfolio',
    githubUrl: 'https://github.com/StrayDogSyndicate/portfolio'
  },
  {
    id: '5',
    title: 'Technical Documentation Hub',
    description: 'Comprehensive technical writing platform featuring Outlier AI content, API documentation, and development guides.',
    technologies: ['Next.js', 'MDX', 'TypeScript', 'Tailwind CSS', 'Vercel'],
    category: 'Frontend',
    featured: false,
    liveUrl: 'https://docs.straydogsyndicationllc.tech',
    githubUrl: 'https://github.com/StrayDogSyndicate/docs'
  },
  {
    id: '6',
    title: 'Trae 2.0 Builder Integration',
    description: 'Advanced IDE integration showcasing AI-powered development workflows and automated code generation capabilities.',
    technologies: ['TypeScript', 'Node.js', 'Claude 4.1 API', 'VS Code API', 'Electron'],
    category: 'AI/ML',
    featured: false,
    githubUrl: 'https://github.com/StrayDogSyndicate/trae-integration'
  }
];

const getCategoryIcon = (category: Project['category']) => {
  switch (category) {
    case 'AI/ML':
      return Brain;
    case 'Full-Stack':
      return Globe;
    case 'Frontend':
      return Code;
    case 'Backend':
      return Database;
    default:
      return Code;
  }
};

// Removed unused getCategoryColor function

export const Portfolio = () => {
  const featuredProjects = projects.filter(p => p.featured);
  const otherProjects = projects.filter(p => !p.featured);
  
  const heroRef = useIntersectionObserver({ threshold: 0.2 });
  const statsRef = useIntersectionObserver({ threshold: 0.3 });
  const featuredRef = useIntersectionObserver({ threshold: 0.2 });
  const otherProjectsRef = useIntersectionObserver({ threshold: 0.2 });
  const ctaRef = useIntersectionObserver({ threshold: 0.3 });
  
  const { setElementRef: setProjectRef, intersections: projectIntersections } = useMultipleIntersectionObserver(
    featuredProjects.length,
    { threshold: 0.2 }
  );
  
  const { setElementRef: setOtherProjectRef, intersections: otherProjectIntersections } = useMultipleIntersectionObserver(
    otherProjects.length,
    { threshold: 0.2 }
  );

  return (
    <div className='min-h-screen bg-gradient-to-br from-hunter-900 via-hunter-800 to-hunter-900'>
      {/* Animated Particle Background */}
      <div className="particles">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section 
        ref={heroRef.elementRef}
        className={`min-h-screen flex flex-col justify-center items-center px-8 text-center relative ${
          heroRef.isIntersecting ? 'animate-fade-in-up' : 'opacity-0'
        }`}
      >
        <div className='max-w-6xl mx-auto'>
          {/* StrayDog Branding */}
          <div className="mb-8 animate-float">
            <div className="inline-flex items-center gap-4 glass-card px-8 py-4 mb-6">
              <User className="w-8 h-8 text-hunter-light" />
              <div className="text-left">
                <h2 className="text-2xl font-bold gradient-text">Eric 'Hunter' Petross</h2>
                <p className="text-hunter-light text-sm">StrayDog Syndicate LLC</p>
              </div>
            </div>
          </div>

          <h1 className='text-6xl md:text-7xl font-extrabold mb-8 gradient-text leading-tight'>
            Applied AI Solutions Engineer
          </h1>
          
          <div className="mb-8">
            <p className='text-2xl font-semibold gradient-text-alt mb-4'>
              Technical Architect & Full-Stack Developer
            </p>
            <p className='text-xl text-hunter-light max-w-3xl mx-auto leading-relaxed opacity-90'>
              Specializing in full-stack development and LLM integration. I architect scalable applications that bridge cutting-edge AI capabilities with production-ready infrastructure. From New England, building the future one intelligent system at a time.
            </p>
          </div>

          {/* Professional Credentials */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="glass-card px-6 py-3 flex items-center gap-2">
              <Award className="w-5 h-5 text-hunter-accent" />
              <span className="text-hunter-light font-medium">Justice Through Code Certified</span>
            </div>
            <div className="glass-card px-6 py-3 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-hunter-accent" />
              <span className="text-hunter-light font-medium">The Moth Instructor</span>
            </div>
            <div className="glass-card px-6 py-3 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-hunter-accent" />
              <span className="text-hunter-light font-medium">CCRI Computer Science</span>
            </div>
          </div>
          
          {/* Professional Stats Grid - Hunter Green Glassmorphic */}
          <div 
            ref={statsRef.elementRef}
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto mt-12 ${
              statsRef.isIntersecting ? 'animate-fade-in-up' : 'opacity-0'
            }`}
          >
            <div className='glass-card group cursor-pointer animate-pulse-hunter'>
              <div className='text-5xl font-bold gradient-text mb-3'>20+</div>
              <div className='text-sm text-hunter-light uppercase tracking-wider font-medium'>Years Customer Excellence</div>
              <div className='mt-2 text-xs text-hunter-secondary'>Service & Leadership</div>
            </div>
            
            <div className='glass-card group cursor-pointer animate-pulse-hunter'>
              <div className='text-5xl font-bold gradient-text mb-3'>6</div>
              <div className='text-sm text-hunter-light uppercase tracking-wider font-medium'>Specialized IDEs</div>
              <div className='mt-2 text-xs text-hunter-secondary'>Multi-Platform Development</div>
            </div>
            
            <div className='glass-card group cursor-pointer animate-pulse-hunter'>
              <div className='text-5xl font-bold gradient-text mb-3'>3</div>
              <div className='text-sm text-hunter-light uppercase tracking-wider font-medium'>AI Slack Agents</div>
              <div className='mt-2 text-xs text-hunter-secondary'>Business Automation</div>
            </div>
            
            <div className='glass-card group cursor-pointer animate-pulse-hunter'>
              <div className='text-5xl font-bold gradient-text mb-3'>∞</div>
              <div className='text-sm text-hunter-light uppercase tracking-wider font-medium'>Outlier AI Writer</div>
              <div className='mt-2 text-xs text-hunter-secondary'>Content & Training</div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section 
        id="projects"
        ref={featuredRef.elementRef}
        className={`py-20 px-8 ${
          featuredRef.isIntersecting ? 'animate-fade-in-up' : 'opacity-0'
        }`}
      >
        <div className='max-w-7xl mx-auto'>

          {/* Featured Projects */}
          <div className="mb-20">
            <div className="text-center mb-16">
              <h2 className='text-5xl font-bold gradient-text mb-4'>Featured Projects</h2>
              <p className="text-xl text-hunter-light max-w-3xl mx-auto">
                Showcasing innovative solutions that bridge AI capabilities with real-world applications
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {featuredProjects.map((project, index) => {
                const IconComponent = getCategoryIcon(project.category);
                
                return (
                  <div 
                    key={project.id} 
                    ref={setProjectRef(index)}
                    className={`glass-card group cursor-pointer ${
                      projectIntersections[index] ? 'animate-fade-in-up' : 'opacity-0'
                    }`}>
                    <div className="flex items-center mb-6">
                      <div className="w-14 h-14 glass-card flex items-center justify-center mr-4 p-3">
                        <IconComponent className="w-7 h-7 text-hunter-accent" />
                      </div>
                      <div className="flex-1">
                        <span className="glass-card px-4 py-2 text-sm font-semibold text-hunter-accent inline-block">
                          {project.category}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-3xl font-bold mb-4 gradient-text group-hover:scale-105 transition-transform duration-300">{project.title}</h3>
                    <p className="text-hunter-light mb-8 leading-relaxed text-lg opacity-90">{project.description}</p>
                    <div className="flex flex-wrap gap-3 mb-8">
                      {project.technologies.map((tech) => (
                        <span key={tech} className="glass-card px-4 py-2 text-sm font-medium text-hunter-light hover:text-hunter-accent hover:scale-105 transition-all duration-200 cursor-pointer">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-4">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="glass-card px-8 py-3 font-semibold transition-all duration-300 hover:scale-105 flex items-center gap-2 gradient-text hover:text-white"
                        >
                          <ExternalLink className="w-4 h-4" />
                          View Demo
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="glass-card px-8 py-3 font-semibold text-hunter-light transition-all duration-300 hover:scale-105 flex items-center gap-2 hover:text-hunter-accent"
                        >
                          <Github className="w-4 h-4" />
                          View Code
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Other Projects */}
          <div className="mb-20">
            <h2 className="text-5xl font-bold mb-4 text-center gradient-text">Other Projects</h2>
            <p className="text-xl text-hunter-light text-center mb-12 opacity-90">Additional work and experiments</p>
            <div 
              ref={otherProjectsRef.elementRef}
              className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in-up ${
                otherProjectsRef.isIntersecting ? 'in-view' : ''
              }`}
            >
              {otherProjects.map((project, index) => {
                const IconComponent = getCategoryIcon(project.category);
                
                return (
                  <div 
                    key={project.id} 
                    ref={setOtherProjectRef(index)}
                    className={`glass-card group cursor-pointer transition-all duration-500 hover:scale-105 ${
                      otherProjectIntersections[index] ? 'in-view' : ''
                    }`}>
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 glass-card flex items-center justify-center mr-3 p-2">
                        <IconComponent className="w-6 h-6 text-hunter-accent" />
                      </div>
                      <span className="glass-card px-3 py-1 text-xs font-semibold text-hunter-accent">
                        {project.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold mb-3 gradient-text group-hover:scale-105 transition-transform duration-300">{project.title}</h3>
                    <p className="text-hunter-light mb-4 text-sm leading-relaxed opacity-90">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.technologies.map((tech) => (
                        <span key={tech} className="glass-card px-3 py-1 text-xs font-medium text-hunter-light hover:text-hunter-accent transition-colors duration-200">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="glass-card px-4 py-2 text-sm font-semibold transition-all duration-300 hover:scale-105 flex items-center gap-1 gradient-text hover:text-white"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Demo
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="glass-card px-4 py-2 text-sm font-semibold text-hunter-light transition-all duration-300 hover:scale-105 flex items-center gap-1 hover:text-hunter-accent"
                        >
                          <Github className="w-3 h-3" />
                          Code
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Call to Action */}
          <div 
            ref={ctaRef.elementRef}
            className={`text-center py-20 animate-scale-in ${
              ctaRef.isIntersecting ? 'in-view' : ''
            }`}
          >
            <div className="max-w-4xl mx-auto glass-card p-16">
              <h2 className="text-4xl font-bold mb-6 gradient-text">
                Ready to Build Something Amazing?
              </h2>
              <p className="text-xl text-hunter-light mb-10 max-w-2xl mx-auto leading-relaxed">
                Let's collaborate on your next project. From AI/ML solutions to full-stack applications, 
                I bring 20+ years of customer service excellence to every technical challenge.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <a
                  href="mailto:eric.petross@example.com"
                  className="glass-button-primary px-10 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105"
                >
                  Get In Touch
                </a>
                <a
                  href="/resume"
                  className="glass-button px-10 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105"
                >
                  View Resume
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
