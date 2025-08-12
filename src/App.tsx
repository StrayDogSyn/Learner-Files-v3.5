import { useState, useEffect } from 'react'
import './styles/globals.css'
import { FaGithub, FaLinkedin, FaEnvelope, FaExternalLinkAlt, FaCode, FaDatabase, FaServer, FaMobile } from 'react-icons/fa'

interface Project {
  id: number
  title: string
  description: string
  technologies: string[]
  githubUrl?: string
  liveUrl?: string
  image?: string
}

interface Skill {
  name: string
  level: number
  category: 'frontend' | 'backend' | 'database' | 'tools'
}

function App() {
  const [mounted, setMounted] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')

  useEffect(() => {
    setMounted(true)
    
    const handleScroll = () => {
      const sections = ['hero', 'about', 'projects', 'skills', 'contact']
      const scrollPosition = window.scrollY + 100
      
      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const projects: Project[] = [
    {
      id: 1,
      title: 'AI-Powered Task Manager',
      description: 'A modern task management application with AI-powered suggestions and smart categorization.',
      technologies: ['React', 'TypeScript', 'Node.js', 'OpenAI API'],
      githubUrl: 'https://github.com/example/ai-task-manager',
      liveUrl: 'https://ai-task-manager.demo.com'
    },
    {
      id: 2,
      title: 'E-Commerce Platform',
      description: 'Full-stack e-commerce solution with payment integration and inventory management.',
      technologies: ['React', 'Express.js', 'MongoDB', 'Stripe API'],
      githubUrl: 'https://github.com/example/ecommerce-platform'
    },
    {
      id: 3,
      title: 'Real-time Chat Application',
      description: 'WebSocket-based chat application with rooms, file sharing, and emoji reactions.',
      technologies: ['React', 'Socket.io', 'Node.js', 'PostgreSQL'],
      githubUrl: 'https://github.com/example/chat-app',
      liveUrl: 'https://chat-app.demo.com'
    }
  ]

  const skills: Skill[] = [
    { name: 'React', level: 90, category: 'frontend' },
    { name: 'TypeScript', level: 85, category: 'frontend' },
    { name: 'JavaScript', level: 95, category: 'frontend' },
    { name: 'Tailwind CSS', level: 80, category: 'frontend' },
    { name: 'Node.js', level: 85, category: 'backend' },
    { name: 'Express.js', level: 80, category: 'backend' },
    { name: 'Python', level: 75, category: 'backend' },
    { name: 'MongoDB', level: 70, category: 'database' },
    { name: 'PostgreSQL', level: 75, category: 'database' },
    { name: 'Git', level: 90, category: 'tools' },
    { name: 'Docker', level: 65, category: 'tools' }
  ]

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const getSkillIcon = (category: string) => {
    switch (category) {
      case 'frontend': return <FaCode className="text-blue-500" />
      case 'backend': return <FaServer className="text-green-500" />
      case 'database': return <FaDatabase className="text-purple-500" />
      case 'tools': return <FaMobile className="text-orange-500" />
      default: return <FaCode className="text-gray-500" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Portfolio</h1>
            <div className="hidden md:flex space-x-6">
              {['hero', 'about', 'projects', 'skills', 'contact'].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`capitalize transition-colors ${
                    activeSection === section
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
                  }`}
                >
                  {section}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 text-center">
          <div className={`transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                AISE Developer
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Tier 2 Graduate specializing in AI-enhanced software development and modern web technologies
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => scrollToSection('projects')}
                className="btn-primary"
              >
                View My Work
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="px-6 py-3 border-2 border-primary-600 text-primary-600 dark:text-primary-400 dark:border-primary-400 rounded-lg hover:bg-primary-600 hover:text-white dark:hover:bg-primary-400 dark:hover:text-gray-900 transition-colors duration-200 font-semibold"
              >
                Get In Touch
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">About Me</h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">AI-Enhanced Development</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  As a Tier 2 AISE graduate, I specialize in leveraging artificial intelligence to enhance software development processes. 
                  My expertise spans modern web technologies, with a focus on creating intelligent, user-centric applications.
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  I'm passionate about building scalable solutions that combine cutting-edge AI capabilities with robust software architecture. 
                  My approach emphasizes clean code, performance optimization, and seamless user experiences.
                </p>
                <div className="flex space-x-4">
                  <a href="https://github.com" title="GitHub Profile" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                    <FaGithub size={24} />
                  </a>
                  <a href="https://linkedin.com" title="LinkedIn Profile" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                    <FaLinkedin size={24} />
                  </a>
                  <a href="mailto:contact@example.com" title="Send Email" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                    <FaEnvelope size={24} />
                  </a>
                </div>
              </div>
              <div className="card">
                <h4 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Key Achievements</h4>
                <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Completed AISE Tier 2 certification program
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Built 15+ full-stack applications
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Integrated AI/ML models in production apps
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Contributed to open-source projects
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Mentored junior developers
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">Featured Projects</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div key={project.id} className="card hover:shadow-xl transition-shadow duration-300">
                <div className="h-48 bg-gradient-to-br from-primary-100 to-purple-100 dark:from-primary-900 dark:to-purple-900 rounded-lg mb-4 flex items-center justify-center">
                  <FaCode size={48} className="text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">{project.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech) => (
                    <span key={tech} className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-full text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex space-x-4">
                  {project.githubUrl && (
                    <a href={project.githubUrl} className="flex items-center text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                      <FaGithub className="mr-2" /> Code
                    </a>
                  )}
                  {project.liveUrl && (
                    <a href={project.liveUrl} className="flex items-center text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                      <FaExternalLinkAlt className="mr-2" /> Live Demo
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">Technical Skills</h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {['frontend', 'backend', 'database', 'tools'].map((category) => (
                <div key={category} className="card">
                  <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white capitalize flex items-center">
                    {getSkillIcon(category)}
                    <span className="ml-2">{category}</span>
                  </h3>
                  <div className="space-y-4">
                    {skills.filter(skill => skill.category === category).map((skill) => (
                      <div key={skill.name}>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-700 dark:text-gray-300">{skill.name}</span>
                          <span className="text-gray-500 dark:text-gray-400">{skill.level}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="skill-progress-bar"
                            data-skill-level={skill.level}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">Get In Touch</h2>
          <div className="max-w-2xl mx-auto">
            <div className="card">
              <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
                I'm always interested in new opportunities and collaborations. 
                Whether you have a project in mind or just want to connect, feel free to reach out!
              </p>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <a href="mailto:contact@example.com" className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <FaEnvelope size={32} className="text-primary-600 dark:text-primary-400 mb-3" />
                  <span className="text-gray-900 dark:text-white font-semibold">Email</span>
                  <span className="text-gray-600 dark:text-gray-300 text-sm">contact@example.com</span>
                </a>
                <a href="https://linkedin.com" className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <FaLinkedin size={32} className="text-primary-600 dark:text-primary-400 mb-3" />
                  <span className="text-gray-900 dark:text-white font-semibold">LinkedIn</span>
                  <span className="text-gray-600 dark:text-gray-300 text-sm">Connect with me</span>
                </a>
                <a href="https://github.com" className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <FaGithub size={32} className="text-primary-600 dark:text-primary-400 mb-3" />
                  <span className="text-gray-900 dark:text-white font-semibold">GitHub</span>
                  <span className="text-gray-600 dark:text-gray-300 text-sm">View my code</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            © 2024 AISE Developer Portfolio. Built with React, TypeScript, and Tailwind CSS.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
