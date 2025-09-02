import { Code, Brain, Database, Globe } from 'lucide-react';
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

const getCategoryColor = (category: Project['category']) => {
  switch (category) {
    case 'AI/ML':
      return 'from-purple-500 to-pink-500';
    case 'Full-Stack':
      return 'from-blue-500 to-cyan-500';
    case 'Frontend':
      return 'from-green-500 to-emerald-500';
    case 'Backend':
      return 'from-orange-500 to-red-500';
    default:
      return 'from-hunter-500 to-hunter-600';
  }
};

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
    <div className='min-h-screen' style={{
      background: 'linear-gradient(135deg, #0B0B0B 0%, #1a1a1a 100%)'
    }}>
      {/* Hero Section */}
      <section 
        ref={heroRef.elementRef}
        className={`min-h-screen flex flex-col justify-center items-center px-8 text-center relative animate-fade-in-up ${
          heroRef.isIntersecting ? 'in-view' : ''
        }`}
      >
        <div className='max-w-4xl mx-auto'>
          <h1 className='font-extrabold mb-6 animate-fade-in-up' style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            background: 'linear-gradient(90deg, #00D4AA, #7C3AED)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            AI/ML Engineer & Technical Architect
          </h1>
          <p className='text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-12 opacity-90'>
            Transforming 20+ years of customer excellence into cutting-edge technical solutions
          </p>
          
          {/* Professional Stats Grid */}
          <div 
            ref={statsRef.elementRef}
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto mt-12 animate-scale-in ${
              statsRef.isIntersecting ? 'in-view' : ''
            }`}
          >
            <div className='group cursor-pointer' style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '2rem',
              transition: 'all 0.3s ease'
            }} onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 212, 170, 0.1)';
            }} onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              <div className='text-4xl font-bold text-teal-400 mb-2'>20+</div>
              <div className='text-sm text-gray-400 uppercase tracking-wider'>Years Customer Service Excellence</div>
            </div>
            <div className='group cursor-pointer' style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '2rem',
              transition: 'all 0.3s ease'
            }} onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(124, 58, 237, 0.1)';
            }} onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              <div className='text-4xl font-bold text-purple-400 mb-2'>Claude 4.1</div>
              <div className='text-sm text-gray-400 uppercase tracking-wider'>AI/ML Specialization</div>
            </div>
            <div className='group cursor-pointer' style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '2rem',
              transition: 'all 0.3s ease'
            }} onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(236, 72, 153, 0.1)';
            }} onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              <div className='text-4xl font-bold text-pink-400 mb-2'>Live</div>
              <div className='text-sm text-gray-400 uppercase tracking-wider'>Working Demos</div>
            </div>
            <div className='group cursor-pointer' style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '2rem',
              transition: 'all 0.3s ease'
            }} onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(34, 197, 94, 0.1)';
            }} onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              <div className='text-4xl font-bold text-green-400 mb-2'>Full-Stack</div>
              <div className='text-sm text-gray-400 uppercase tracking-wider'>Development Expertise</div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section 
        ref={featuredRef.elementRef}
        className={`py-20 px-8 animate-fade-in-up ${
          featuredRef.isIntersecting ? 'in-view' : ''
        }`}
      >
        <div className='max-w-7xl mx-auto'>

          {/* Featured Projects */}
          <div className="mb-20">
            <h2 className="text-4xl font-bold text-center mb-16 text-white" style={{
              background: 'linear-gradient(90deg, #00D4AA, #7C3AED)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Featured Projects
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {featuredProjects.map((project, index) => {
                const IconComponent = getCategoryIcon(project.category);
                
                return (
                  <div 
                    key={project.id} 
                    ref={setProjectRef(index)}
                    className={`group cursor-pointer animate-fade-in-up ${
                      projectIntersections[index] ? 'in-view' : ''
                    }`}
                    style={{
                      transitionDelay: `${index * 100}ms`,
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(15px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '20px',
                    padding: '2.5rem',
                    transition: 'all 0.4s ease'
                  }} onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-10px)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.boxShadow = '0 25px 50px rgba(0, 212, 170, 0.15)';
                    e.currentTarget.style.border = '1px solid rgba(0, 212, 170, 0.3)';
                  }} onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.1)';
                  }}>
                    <div className="flex items-center mb-6">
                      <div className={`w-12 h-12 bg-gradient-to-br ${getCategoryColor(project.category)} rounded-lg flex items-center justify-center mr-4`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <span className="px-4 py-2 rounded-full text-sm font-semibold text-teal-300" style={{
                        background: 'rgba(0, 212, 170, 0.1)',
                        border: '1px solid rgba(0, 212, 170, 0.2)'
                      }}>
                        {project.category}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-teal-300 transition-colors duration-300">{project.title}</h3>
                    <p className="text-gray-300 mb-8 leading-relaxed text-lg">{project.description}</p>
                    <div className="flex flex-wrap gap-3 mb-8">
                      {project.technologies.map((tech) => (
                        <span key={tech} className="px-4 py-2 rounded-full text-sm font-medium" style={{
                          background: 'rgba(124, 58, 237, 0.1)',
                          border: '1px solid rgba(124, 58, 237, 0.2)',
                          color: '#A78BFA'
                        }}>
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
                          className="px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                          style={{
                            background: 'linear-gradient(90deg, #00D4AA, #7C3AED)',
                            color: 'white'
                          }}
                        >
                          View Demo
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-8 py-3 rounded-lg font-semibold text-white transition-all duration-300 hover:scale-105"
                          style={{
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            background: 'rgba(255, 255, 255, 0.05)'
                          }}
                        >
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
            <h2 className="text-3xl font-bold text-center mb-12 text-white" style={{
              background: 'linear-gradient(90deg, #00D4AA, #7C3AED)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Other Projects
            </h2>
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
                    className={`group cursor-pointer animate-slide-in-left ${
                      otherProjectIntersections[index] ? 'in-view' : ''
                    }`}
                    style={{
                      transitionDelay: `${index * 150}ms`,
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '16px',
                    padding: '2rem',
                    transition: 'all 0.3s ease'
                  }} onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                    e.currentTarget.style.boxShadow = '0 15px 30px rgba(124, 58, 237, 0.1)';
                    e.currentTarget.style.border = '1px solid rgba(124, 58, 237, 0.2)';
                  }} onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.08)';
                  }}>
                    <div className="flex items-center mb-4">
                      <div className={`w-8 h-8 bg-gradient-to-br ${getCategoryColor(project.category)} rounded-lg flex items-center justify-center mr-3`}>
                        <IconComponent className="w-4 h-4 text-white" />
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-medium text-purple-300" style={{
                        background: 'rgba(124, 58, 237, 0.1)',
                        border: '1px solid rgba(124, 58, 237, 0.2)'
                      }}>
                        {project.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold mb-3 text-white group-hover:text-purple-300 transition-colors duration-300">{project.title}</h3>
                    <p className="text-gray-400 mb-4 text-sm leading-relaxed">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.technologies.map((tech) => (
                        <span key={tech} className="px-3 py-1 rounded-full text-xs font-medium" style={{
                          background: 'rgba(0, 212, 170, 0.08)',
                          border: '1px solid rgba(0, 212, 170, 0.15)',
                          color: '#5EEAD4'
                        }}>
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
                          className="text-sm px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105"
                          style={{
                            background: 'linear-gradient(90deg, #00D4AA, #7C3AED)',
                            color: 'white'
                          }}
                        >
                          Demo
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm px-4 py-2 rounded-lg font-medium text-white transition-all duration-300 hover:scale-105"
                          style={{
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            background: 'rgba(255, 255, 255, 0.03)'
                          }}
                        >
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
            <div className="max-w-4xl mx-auto" style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '24px',
              padding: '4rem'
            }}>
              <h2 className="text-4xl font-bold mb-6" style={{
                background: 'linear-gradient(90deg, #00D4AA, #7C3AED)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Ready to Build Something Amazing?
              </h2>
              <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                Let's collaborate on your next project. From AI/ML solutions to full-stack applications, 
                I bring 20+ years of customer service excellence to every technical challenge.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <a
                  href="mailto:eric.petross@example.com"
                  className="px-10 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105"
                  style={{
                    background: 'linear-gradient(90deg, #00D4AA, #7C3AED)',
                    color: 'white'
                  }}
                >
                  Get In Touch
                </a>
                <a
                  href="/resume"
                  className="px-10 py-4 rounded-lg font-semibold text-lg text-white transition-all duration-300 hover:scale-105"
                  style={{
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.05)'
                  }}
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
