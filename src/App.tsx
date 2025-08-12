import { useState, useEffect } from 'react'
import { FaGithub, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCode, FaServer, FaDatabase } from 'react-icons/fa';
import { GlassContainer, GlassCard, GlassNavigation, SkillCard, ProjectCard } from './components'
import BrandImage, { BrandConfigs } from './components/BrandImage';
import './styles/globals.css'

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
  const [activeSection, setActiveSection] = useState('home')
  // const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    const handleScroll = () => {
      const sections = ['home', 'about', 'skills', 'projects', 'contact']
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

  // Removed getSkillIcon function as it's now handled by SkillCard component

  const navigationItems = [
    { id: 'home', label: 'Home', href: '#home' },
    { id: 'about', label: 'About', href: '#about' },
    { id: 'skills', label: 'Skills', href: '#skills' },
    { id: 'projects', label: 'Projects', href: '#projects' },
    { id: 'contact', label: 'Contact', href: '#contact' },
  ];

  return (
    <div className="min-h-screen bg-charcoal-dark relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal-dark via-hunter-forest to-charcoal-medium"></div>
        {/* Brand Banner Background Pattern */}
        <div 
          className="absolute inset-0 opacity-5 bg-repeat bg-center"
          style={{
            backgroundImage: 'url(/assets/brand/banner.png)',
            backgroundSize: '400px 200px',
            filter: 'brightness(0.3) contrast(1.2)'
          }}
        ></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-hunter-emerald/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-metallic-silver/5 rounded-full blur-3xl animate-pulse-slow animate-delay-2s"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-hunter-core/8 rounded-full blur-2xl animate-pulse-slow animate-delay-4s"></div>
      </div>

      {/* Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <GlassNavigation 
          items={navigationItems}
          activeItem={activeSection}
          logo={
            <div className="flex items-center space-x-2">
              <BrandImage
                {...BrandConfigs.navLogo}
                className="w-8 h-8 rounded-lg"
              />
              <span className="font-display font-bold text-lg bg-gradient-to-r from-hunter-emerald to-metallic-silver bg-clip-text text-transparent">
                StrayDog Syndications
              </span>
            </div>
          }
        />
      </div>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center relative z-10">
        <div className="container mx-auto px-4 text-center">
          <GlassContainer className="max-w-4xl mx-auto">
            <div className={`transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="mb-8">
                <div className="w-32 h-32 mx-auto mb-6 relative">
                  <BrandImage
                    {...BrandConfigs.heroLogo}
                    className="w-32 h-32 rounded-full shadow-2xl border-4 border-hunter-emerald/30 hover:border-hunter-emerald/60 transition-all duration-300"
                  />
                </div>
                <h1 className="font-display text-5xl md:text-7xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-hunter-emerald via-metallic-silver to-hunter-core bg-clip-text text-transparent">
                    StrayDog Syndications
                  </span>
                </h1>
                <h2 className="text-2xl md:text-3xl font-semibold text-metallic-silver mb-4">
                  Developer with 20 Years Professional Excellence
                </h2>
                <p className="text-lg md:text-xl text-metallic-silver/80 mb-8 max-w-3xl mx-auto leading-relaxed">
                  Specializing in AI-enhanced software development, modern web technologies, 
                  and innovative digital solutions that push the boundaries of what's possible.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => scrollToSection('projects')}
                  className="px-8 py-4 bg-gradient-to-r from-hunter-emerald to-hunter-core text-charcoal-dark font-semibold rounded-lg hover:shadow-lg hover:shadow-hunter-emerald/25 transition-all duration-300 transform hover:scale-105"
                >
                  View My Work
                </button>
                <button 
                  onClick={() => scrollToSection('contact')}
                  className="px-8 py-4 border-2 border-hunter-emerald text-hunter-emerald rounded-lg hover:bg-hunter-emerald hover:text-charcoal-dark transition-all duration-300 transform hover:scale-105"
                >
                  Get In Touch
                </button>
              </div>
            </div>
          </GlassContainer>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 relative z-10">
        <div className="container mx-auto px-4">
          <div className={`transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="font-display text-4xl font-bold text-center mb-16 bg-gradient-to-r from-hunter-emerald to-metallic-silver bg-clip-text text-transparent">
              About StrayDog Syndications
            </h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <GlassCard variant="hunter" className="h-full">
                <h3 className="font-display text-2xl font-semibold mb-6 text-glass-light">
                  Passionate Developer & AI Innovator
                </h3>
                <p className="text-hunter-sage mb-6 leading-relaxed">
                  As a Tier 2 AISE graduate, StrayDog Syndications represents the cutting edge of 
                  artificial intelligence and software engineering excellence. Our mission is to 
                  create transformative digital experiences that push technological boundaries.
                </p>
                <p className="text-hunter-sage mb-6 leading-relaxed">
                  We specialize in AI-enhanced web development, machine learning integration, and 
                  crafting premium user experiences that solve complex real-world challenges with 
                  innovative technological solutions.
                </p>
                <div className="flex space-x-4">
                  <a href="https://github.com" title="GitHub Profile" className="text-hunter-emerald hover:text-metallic-silver transition-colors">
                    <FaGithub size={24} />
                  </a>
                  <a href="https://linkedin.com" title="LinkedIn Profile" className="text-hunter-emerald hover:text-metallic-silver transition-colors">
                    <FaLinkedin size={24} />
                  </a>
                  <a href="mailto:contact@example.com" title="Send Email" className="text-hunter-emerald hover:text-metallic-silver transition-colors">
                    <FaEnvelope size={24} />
                  </a>
                </div>
              </GlassCard>
              <GlassCard variant="premium" className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-hunter-emerald/10 to-metallic-silver/10"></div>
                <div className="relative z-10">
                  <h4 className="font-display text-xl font-semibold mb-6 text-glass-light">Key Achievements</h4>
                  <ul className="space-y-4 text-hunter-sage">
                    <li className="flex items-start">
                      <span className="text-hunter-emerald mr-3 text-lg">✓</span>
                      <span>Completed AISE Tier 2 certification program</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-hunter-emerald mr-3 text-lg">✓</span>
                      <span>Built 15+ full-stack applications</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-hunter-emerald mr-3 text-lg">✓</span>
                      <span>Integrated AI/ML models in production apps</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-hunter-emerald mr-3 text-lg">✓</span>
                      <span>Contributed to open-source projects</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-hunter-emerald mr-3 text-lg">✓</span>
                      <span>Mentored junior developers</span>
                    </li>
                  </ul>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 relative z-10">
        <div className="container mx-auto px-4">
          <div className={`transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="font-display text-4xl font-bold text-center mb-16 bg-gradient-to-r from-hunter-emerald to-metallic-silver bg-clip-text text-transparent">
              Featured Projects
            </h2>
            
            {/* Featured Project */}
            <div className="mb-16">
              <ProjectCard
                title="AI-Enhanced Portfolio Platform"
                description="A cutting-edge portfolio platform featuring glassmorphic design, AI-powered content optimization, and advanced user experience patterns. Built with React, TypeScript, and modern CSS techniques."
                technologies={['React', 'TypeScript', 'CSS Variables', 'Glassmorphism', 'AI Integration']}
                githubUrl="https://github.com/straydogsyndications"
                liveUrl="https://straydogsyndications.dev"
                featured={true}
                className="max-w-4xl mx-auto"
              />
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  title={project.title}
                  description={project.description}
                  technologies={project.technologies}
                  githubUrl={project.githubUrl}
                  liveUrl={project.liveUrl}
                  className={`animate-fade-in`}
                  style={{animationDelay: `${(index + 1) * 150}ms`}}
                />
              ))}
            </div>
            
            {/* Call to Action */}
            <div className="mt-16 text-center">
              <GlassCard variant="premium" className="max-w-2xl mx-auto">
                <h3 className="font-display text-2xl font-semibold text-glass-light mb-4">
                  Ready to Collaborate?
                </h3>
                <p className="text-hunter-sage mb-6 leading-relaxed">
                  Let's work together to create something extraordinary. From AI-enhanced applications 
                  to premium user experiences, StrayDog Syndications delivers innovation.
                </p>
                <button 
                  onClick={() => scrollToSection('contact')}
                  className="px-8 py-4 bg-gradient-to-r from-hunter-emerald to-hunter-core text-charcoal-dark font-semibold rounded-lg hover:shadow-lg hover:shadow-hunter-emerald/25 transition-all duration-300 transform hover:scale-105"
                >
                  Start a Project
                </button>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 relative z-10">
        <div className="container mx-auto px-4">
          <div className={`transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="font-display text-4xl font-bold text-center mb-16 bg-gradient-to-r from-hunter-emerald to-metallic-silver bg-clip-text text-transparent">
              Skills & Technologies
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {skills.map((skill, index) => (
                <SkillCard
                  key={skill.name}
                  name={skill.name}
                  level={skill.level}
                  category={skill.category as 'frontend' | 'backend' | 'database' | 'tools'}
                  className={`animate-fade-in`}
                  style={{animationDelay: `${index * 100}ms`}}
                />
              ))}
            </div>
            
            {/* Skills Summary */}
            <div className="mt-16 grid md:grid-cols-3 gap-8">
              <GlassCard variant="hunter" className="text-center">
                <div className="text-3xl text-hunter-emerald mb-4">
                  <FaCode />
                </div>
                <h3 className="font-display text-xl font-semibold text-glass-light mb-2">
                  Frontend Excellence
                </h3>
                <p className="text-hunter-sage">
                  Modern React, TypeScript, and cutting-edge UI frameworks
                </p>
              </GlassCard>
              
              <GlassCard variant="premium" className="text-center">
                <div className="text-3xl text-metallic-silver mb-4">
                  <FaServer />
                </div>
                <h3 className="font-display text-xl font-semibold text-glass-light mb-2">
                  Backend Mastery
                </h3>
                <p className="text-hunter-sage">
                  Scalable APIs, cloud architecture, and AI integration
                </p>
              </GlassCard>
              
              <GlassCard variant="hunter" className="text-center">
                <div className="text-3xl text-hunter-core mb-4">
                  <FaDatabase />
                </div>
                <h3 className="font-display text-xl font-semibold text-glass-light mb-2">
                  Data & AI
                </h3>
                <p className="text-hunter-sage">
                  Machine learning, data analysis, and intelligent systems
                </p>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 relative z-10">
        <div className="container mx-auto px-4">
          <div className={`transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="font-display text-4xl font-bold text-center mb-16 bg-gradient-to-r from-hunter-emerald to-metallic-silver bg-clip-text text-transparent">
              Get In Touch
            </h2>
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
              <GlassCard variant="hunter" className="h-full">
                <h3 className="font-display text-2xl font-semibold mb-6 text-glass-light">
                  Let's Create Something Extraordinary
                </h3>
                <p className="text-hunter-sage mb-8 leading-relaxed">
                  StrayDog Syndications is always ready for new challenges and innovative collaborations. 
                  Whether you have a groundbreaking project in mind or want to explore the possibilities 
                  of AI-enhanced development, let's connect and build the future together.
                </p>
                
                <div className="space-y-6 mb-8">
                  <div className="flex items-center group">
                    <div className="w-12 h-12 bg-gradient-to-br from-hunter-emerald to-metallic-silver rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                      <FaEnvelope className="text-charcoal-dark" />
                    </div>
                    <div>
                      <p className="text-glass-light font-medium">Email</p>
                      <p className="text-hunter-sage">contact@straydogsyndications.dev</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center group">
                    <div className="w-12 h-12 bg-gradient-to-br from-metallic-silver to-hunter-core rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                      <FaPhone className="text-charcoal-dark" />
                    </div>
                    <div>
                      <p className="text-glass-light font-medium">Phone</p>
                      <p className="text-hunter-sage">+1 (555) STRAY-DOG</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center group">
                    <div className="w-12 h-12 bg-gradient-to-br from-hunter-core to-hunter-forest rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                      <FaMapMarkerAlt className="text-charcoal-dark" />
                    </div>
                    <div>
                      <p className="text-glass-light font-medium">Location</p>
                      <p className="text-hunter-sage">Global Remote & On-Site</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <a 
                    href="https://github.com/straydogsyndications" 
                    className="w-12 h-12 bg-glass-subtle border border-glass-border rounded-lg flex items-center justify-center text-hunter-emerald hover:bg-hunter-emerald hover:text-charcoal-dark transition-all duration-300 hover:scale-110"
                    title="Visit StrayDog Syndications on GitHub"
                    aria-label="GitHub Profile"
                  >
                    <FaGithub size={20} />
                  </a>
                  <a 
                    href="https://linkedin.com/company/straydogsyndications" 
                    className="w-12 h-12 bg-glass-subtle border border-glass-border rounded-lg flex items-center justify-center text-hunter-emerald hover:bg-hunter-emerald hover:text-charcoal-dark transition-all duration-300 hover:scale-110"
                    title="Connect with StrayDog Syndications on LinkedIn"
                    aria-label="LinkedIn Profile"
                  >
                    <FaLinkedin size={20} />
                  </a>
                </div>
              </GlassCard>
              
              <GlassCard variant="premium">
                <h3 className="font-display text-xl font-semibold mb-6 text-glass-light">
                  Start Your Project
                </h3>
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-metallic-silver mb-2">
                      Full Name
                    </label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 bg-glass-subtle border border-glass-border rounded-lg focus:ring-2 focus:ring-hunter-emerald focus:border-hunter-emerald text-glass-light placeholder-hunter-sage transition-all duration-300" 
                      placeholder="Your name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-metallic-silver mb-2">
                      Email Address
                    </label>
                    <input 
                      type="email" 
                      className="w-full px-4 py-3 bg-glass-subtle border border-glass-border rounded-lg focus:ring-2 focus:ring-hunter-emerald focus:border-hunter-emerald text-glass-light placeholder-hunter-sage transition-all duration-300" 
                      placeholder="your.email@example.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-metallic-silver mb-2">
                      Project Type
                    </label>
                    <select 
                      className="w-full px-4 py-3 bg-glass-subtle border border-glass-border rounded-lg focus:ring-2 focus:ring-hunter-emerald focus:border-hunter-emerald text-glass-light transition-all duration-300"
                      aria-label="Select project type"
                      title="Choose the type of project you're interested in"
                    >
                      <option value="">Select project type</option>
                      <option value="web-app">Web Application</option>
                      <option value="ai-integration">AI Integration</option>
                      <option value="mobile-app">Mobile Application</option>
                      <option value="consulting">Technical Consulting</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-metallic-silver mb-2">
                      Project Details
                    </label>
                    <textarea 
                      rows={4} 
                      className="w-full px-4 py-3 bg-glass-subtle border border-glass-border rounded-lg focus:ring-2 focus:ring-hunter-emerald focus:border-hunter-emerald text-glass-light placeholder-hunter-sage transition-all duration-300 resize-none" 
                      placeholder="Tell us about your project vision, requirements, and goals..."
                    ></textarea>
                  </div>
                  
                  <button 
                    type="submit" 
                    className="w-full px-6 py-4 bg-gradient-to-r from-hunter-emerald to-hunter-core text-charcoal-dark font-semibold rounded-lg hover:shadow-lg hover:shadow-hunter-emerald/25 transition-all duration-300 transform hover:scale-105"
                  >
                    Send Message
                  </button>
                </form>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12">
        <div className="container mx-auto px-4">
          <GlassCard variant="premium" className="text-center relative">
            {/* Brand Watermark */}
            <div className="absolute top-4 right-4 opacity-20">
              <BrandImage
                src="/assets/brand/circa2024.png"
                alt="StrayDog Syndications 2024"
                width={48}
                height={48}
                className="filter brightness-0 invert"
                lazy={false}
              />
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center space-x-3 mb-4 md:mb-0">
                <BrandImage
                  {...BrandConfigs.navLogo}
                  className="w-10 h-10 rounded-lg"
                />
                <span className="font-display font-bold text-lg bg-gradient-to-r from-hunter-emerald to-metallic-silver bg-clip-text text-transparent">
                  StrayDog Syndications
                </span>
              </div>
              
              <div className="text-center md:text-right">
                <p className="text-hunter-sage mb-2">
                  © 2024 StrayDog Syndications. Crafted with precision.
                </p>
                <p className="text-hunter-sage/70 text-sm">
                  Built with React, TypeScript, and Glassmorphic Design
                </p>
              </div>
            </div>
          </GlassCard>
        </div>
      </footer>
    </div>
  )
}

export default App
