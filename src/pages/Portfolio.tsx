import { ExternalLink, Github, Code, Brain, Database, Globe } from 'lucide-react';

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
    title: 'Marvel Quiz Game',
    description: 'Interactive React-based quiz game featuring Marvel characters with dynamic scoring, timer functionality, and responsive design.',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    category: 'Frontend',
    featured: true,
    githubUrl: '#'
  },
  {
    id: '2',
    title: 'AI Recipe Generator',
    description: 'Machine learning application that generates personalized recipes based on dietary preferences and available ingredients.',
    technologies: ['Python', 'TensorFlow', 'FastAPI', 'React', 'PostgreSQL'],
    category: 'AI/ML',
    featured: true,
    liveUrl: '#',
    githubUrl: '#'
  },
  {
    id: '3',
    title: 'Restaurant Management System',
    description: 'Full-stack application for restaurant operations including inventory management, order processing, and staff scheduling.',
    technologies: ['Node.js', 'Express', 'MongoDB', 'React', 'Socket.io'],
    category: 'Full-Stack',
    featured: true,
    liveUrl: '#',
    githubUrl: '#'
  },
  {
    id: '4',
    title: 'Culinary Analytics Dashboard',
    description: 'Data visualization platform analyzing culinary trends and customer preferences using advanced analytics.',
    technologies: ['Python', 'Pandas', 'Plotly', 'Streamlit', 'AWS'],
    category: 'AI/ML',
    featured: false,
    githubUrl: '#'
  },
  {
    id: '5',
    title: 'Portfolio Website',
    description: 'Modern, responsive portfolio website with glassmorphism design and interactive elements.',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Vite'],
    category: 'Frontend',
    featured: false,
    liveUrl: '#',
    githubUrl: '#'
  },
  {
    id: '6',
    title: 'API Gateway Service',
    description: 'Microservices architecture with API gateway for handling authentication, rate limiting, and request routing.',
    technologies: ['Node.js', 'Express', 'Redis', 'Docker', 'Kubernetes'],
    category: 'Backend',
    featured: false,
    githubUrl: '#'
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

  return (
    <div className='min-h-screen py-20 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-16'>
          <h1 className='text-4xl sm:text-5xl font-bold text-white mb-6'>My Portfolio</h1>
          <p className='text-xl text-hunter-200 max-w-3xl mx-auto'>
            A collection of projects showcasing my technical expertise across AI/ML, full-stack development, and modern web technologies.
          </p>
        </div>

        {/* Featured Projects */}
        <div className='mb-16'>
          <h2 className='text-3xl font-bold text-white mb-8 text-center'>Featured Projects</h2>
          <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8'>
            {featuredProjects.map((project) => {
              const IconComponent = getCategoryIcon(project.category);
              return (
                <div key={project.id} className='glass-card p-6 group hover:scale-105 transition-all duration-300'>
                  {/* Category Badge */}
                  <div className='flex items-center justify-between mb-4'>
                    <div className='flex items-center'>
                      <div className={`w-10 h-10 bg-gradient-to-br ${getCategoryColor(project.category)} rounded-lg flex items-center justify-center mr-3`}>
                        <IconComponent className='w-5 h-5 text-white' />
                      </div>
                      <span className='text-sm font-medium text-hunter-300'>{project.category}</span>
                    </div>
                    <div className='flex space-x-2'>
                      {project.liveUrl && (
                        <a href={project.liveUrl} className='p-2 glass-button rounded-lg hover:bg-hunter-600/30 transition-colors'>
                          <ExternalLink className='w-4 h-4 text-hunter-300' />
                        </a>
                      )}
                      {project.githubUrl && (
                        <a href={project.githubUrl} className='p-2 glass-button rounded-lg hover:bg-hunter-600/30 transition-colors'>
                          <Github className='w-4 h-4 text-hunter-300' />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Project Content */}
                  <h3 className='text-xl font-bold text-white mb-3'>{project.title}</h3>
                  <p className='text-hunter-200 mb-4 leading-relaxed'>{project.description}</p>

                  {/* Technologies */}
                  <div className='flex flex-wrap gap-2'>
                    {project.technologies.map((tech) => (
                      <span key={tech} className='px-3 py-1 bg-hunter-800/50 text-hunter-300 text-xs rounded-full border border-hunter-600/30'>
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Other Projects */}
        <div>
          <h2 className='text-3xl font-bold text-white mb-8 text-center'>Other Projects</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {otherProjects.map((project) => {
              const IconComponent = getCategoryIcon(project.category);
              return (
                <div key={project.id} className='glass-subtle p-6 group hover:glass-card transition-all duration-300'>
                  {/* Category and Links */}
                  <div className='flex items-center justify-between mb-3'>
                    <div className='flex items-center'>
                      <IconComponent className='w-5 h-5 text-hunter-400 mr-2' />
                      <span className='text-xs font-medium text-hunter-400'>{project.category}</span>
                    </div>
                    <div className='flex space-x-1'>
                      {project.liveUrl && (
                        <a href={project.liveUrl} className='p-1.5 hover:bg-hunter-600/30 rounded transition-colors'>
                          <ExternalLink className='w-3.5 h-3.5 text-hunter-400' />
                        </a>
                      )}
                      {project.githubUrl && (
                        <a href={project.githubUrl} className='p-1.5 hover:bg-hunter-600/30 rounded transition-colors'>
                          <Github className='w-3.5 h-3.5 text-hunter-400' />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Project Content */}
                  <h3 className='text-lg font-semibold text-white mb-2'>{project.title}</h3>
                  <p className='text-hunter-200 text-sm mb-3 leading-relaxed'>{project.description}</p>

                  {/* Technologies */}
                  <div className='flex flex-wrap gap-1'>
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span key={tech} className='px-2 py-0.5 bg-hunter-800/30 text-hunter-400 text-xs rounded border border-hunter-700/30'>
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className='px-2 py-0.5 text-hunter-500 text-xs'>
                        +{project.technologies.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Call to Action */}
        <div className='mt-16 text-center'>
          <div className='glass-card p-8'>
            <h3 className='text-2xl font-bold text-white mb-4'>Interested in Working Together?</h3>
            <p className='text-hunter-200 mb-6 max-w-2xl mx-auto'>
              I'm always excited to take on new challenges and collaborate on innovative projects. Let's discuss how we can bring your ideas to life.
            </p>
            <a href='/contact' className='glass-button-primary px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105'>
              Get In Touch
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
