import { useState, useEffect } from 'react'
import { FaGithub, FaLinkedin, FaEnvelope, FaMapMarkerAlt, FaCode, FaServer, FaDatabase, FaRocket, FaLightbulb, FaExternalLinkAlt } from 'react-icons/fa';
import { GlassContainer, GlassCard, GlassNavigation, SkillCard, ProjectCard, GitHubActivity, ThemeToggle, ProjectSpotlight, CareerTimeline, KitchenLessons, AIExperimentShowcase, BrandWatermark, ParallaxBackground, MarvelQuizShowcase } from './components'
import BrandImage, { BrandConfigs } from './components/BrandImage';
import { projects } from './data/projects';
import { useAnalytics, useScrollTracking, usePerformanceTracking } from './hooks/useAnalytics';
import './styles/globals.css'



interface Skill {
  name: string
  level: number
  category: 'frontend' | 'backend' | 'database' | 'tools'
}

function App() {
  const [mounted, setMounted] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const { trackNavigation, trackContactAttempt, trackSocialClick } = useAnalytics()
  
  // Initialize analytics tracking
  useScrollTracking()
  usePerformanceTracking()
  // const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    const handleScroll = () => {
      const sections = ['home', 'about', 'github-activity', 'skills', 'projects', 'contact']
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

  // Projects are now imported from data/projects.ts

  const skills: Skill[] = [
    // Frontend Technologies
    { name: 'JavaScript (ES6+)', level: 95, category: 'frontend' },
    { name: 'React', level: 90, category: 'frontend' },
    { name: 'TypeScript', level: 85, category: 'frontend' },
    { name: 'HTML5', level: 95, category: 'frontend' },
    { name: 'CSS3', level: 90, category: 'frontend' },
    { name: 'Tailwind CSS', level: 85, category: 'frontend' },
    { name: 'Bootstrap', level: 80, category: 'frontend' },
    { name: 'Responsive Design', level: 90, category: 'frontend' },
    
    // Backend Technologies
    { name: 'Node.js', level: 85, category: 'backend' },
    { name: 'Express.js', level: 80, category: 'backend' },
    { name: 'Python', level: 80, category: 'backend' },
    { name: 'RESTful APIs', level: 85, category: 'backend' },
    
    // Databases
    { name: 'MongoDB', level: 75, category: 'database' },
    { name: 'PostgreSQL', level: 75, category: 'database' },
    { name: 'MySQL', level: 70, category: 'database' },
    
    // AI & Development Tools
    { name: 'Claude API', level: 85, category: 'tools' },
    { name: 'OpenAI', level: 80, category: 'tools' },
    { name: 'Machine Learning', level: 75, category: 'tools' },
    { name: 'Git & GitHub', level: 95, category: 'tools' },
    { name: 'VS Code', level: 90, category: 'tools' },
    { name: 'Docker', level: 70, category: 'tools' },
    { name: 'Terminal/CLI', level: 85, category: 'tools' },
    { name: 'RegEx', level: 80, category: 'tools' },
    
    // Mobile & Additional Skills
    { name: 'Android Development', level: 65, category: 'tools' },
    { name: 'UX/UI Design', level: 80, category: 'frontend' },
    { name: 'Technical Writing', level: 90, category: 'tools' },
    { name: 'A/B Testing', level: 75, category: 'tools' }
  ]

  const scrollToSection = (sectionId: string) => {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
        trackNavigation(sectionId)
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
        <div className="absolute inset-0 opacity-5 bg-repeat bg-center brand-banner-bg"></div>
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
          actions={<ThemeToggle />}
        />
      </div>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center relative z-10 overflow-hidden">
        <ParallaxBackground variant="pattern" speed={0.3} opacity={0.04} />
        <BrandWatermark variant="pattern" opacity={0.03} size="large" position="center" />
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
                  From Kitchen to Code: 20+ Years of Excellence
                </h2>
                <p className="text-lg md:text-xl text-metallic-silver/80 mb-8 max-w-3xl mx-auto leading-relaxed">
                  Transforming two decades of fine dining leadership into innovative software development. 
                  Specializing in JavaScript, AI/ML technologies, and creating digital experiences with 
                  the same precision and attention to detail that defined my culinary career.
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
              About Eric 'Hunter' Petross
            </h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <GlassCard variant="hunter" className="h-full">
                <h3 className="font-display text-2xl font-semibold mb-6 text-glass-light">
                  From Kitchen to Code: An Honest Journey
                </h3>
                <p className="text-hunter-sage mb-6 leading-relaxed">
                  Welcome to my GitHub profile—where code meets creativity and a dash of wit! I'm Eric 'Hunter' Petross, 
                  a detail-oriented and collaborative software developer based out of New England, with a serious passion 
                  for JavaScript, AI/ML innovations, and the ever-fascinating world of LLMs.
                </p>
                <p className="text-hunter-sage mb-6 leading-relaxed">
                  After 20+ years of leadership excellence in fine dining, I've transitioned into software development 
                  with the same dedication to precision and quality. Currently pursuing Justice Through Code at Columbia 
                  Business School, focusing on back-end development and AI/ML technologies.
                </p>
                <p className="text-hunter-sage mb-6 leading-relaxed">
                  My motto is simple: "If it challenges me, it excites me!" Whether building intuitive web interfaces 
                  or diving deep into AI/ML advancements, I bring the same collaborative spirit and attention to detail 
                  that made me successful in hospitality.
                </p>
                <div className="flex space-x-4">
                  <a 
                    href="https://github.com/StrayDogSyn" 
                    title="GitHub Profile" 
                    className="text-hunter-emerald hover:text-metallic-silver transition-colors"
                    onClick={() => trackSocialClick('github')}
                  >
                    <FaGithub size={24} />
                  </a>
                  <a 
                    href="https://linkedin.com" 
                    title="LinkedIn Profile" 
                    className="text-hunter-emerald hover:text-metallic-silver transition-colors"
                    onClick={() => trackSocialClick('linkedin')}
                  >
                    <FaLinkedin size={24} />
                  </a>
                  <a 
                    href="mailto:contact@straydogsyndications.com" 
                    title="Send Email" 
                    className="text-hunter-emerald hover:text-metallic-silver transition-colors"
                    onClick={() => trackContactAttempt('email')}
                  >
                    <FaEnvelope size={24} />
                  </a>
                </div>
              </GlassCard>
              <GlassCard variant="premium" className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-hunter-emerald/10 to-metallic-silver/10"></div>
                <div className="relative z-10">
                  <h4 className="font-display text-xl font-semibold mb-6 text-glass-light">Professional Journey</h4>
                  <ul className="space-y-4 text-hunter-sage">
                    <li className="flex items-start">
                      <span className="text-hunter-emerald mr-3 text-lg">✓</span>
                      <span>AI Content Writer at Outlier AI (October 2024 - Present)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-hunter-emerald mr-3 text-lg">✓</span>
                      <span>Justice Through Code - Back-End Development & AI/ML</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-hunter-emerald mr-3 text-lg">✓</span>
                      <span>Associate in Applied Science - Computer Network Technologies</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-hunter-emerald mr-3 text-lg">✓</span>
                      <span>20+ years fine dining leadership experience</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-hunter-emerald mr-3 text-lg">✓</span>
                      <span>Interactive portfolio with 6+ live projects</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-hunter-emerald mr-3 text-lg">✓</span>
                      <span>Anticipated graduation: August 14th, 2025</span>
                    </li>
                  </ul>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>

      {/* GitHub Activity Section */}
      <GitHubActivity />

      {/* Project Spotlight Section */}
      <ProjectSpotlight />

      {/* Projects Section */}
      <section id="projects" className="py-20 relative z-10">
        <div className="container mx-auto px-4">
          <div className={`transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="font-display text-4xl font-bold text-center mb-16 bg-gradient-to-r from-hunter-emerald to-metallic-silver bg-clip-text text-transparent">
              Featured Projects
            </h2>
            
            {/* Featured Project - Marvel Quiz Showcase */}
            <div className="mb-16">
              <MarvelQuizShowcase />
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.filter(project => project.category !== 'featured').map((project, index) => (
                <ProjectCard
                  key={project.id}
                  title={project.title}
                  description={project.description}
                  technologies={project.techStack}
                  githubUrl={project.githubUrl}
                  liveUrl={project.liveUrl}
                  featured={project.category === 'featured'}
                  className={`animate-fade-in animate-delay-${(index + 1) * 150}ms`}
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

      {/* AI & Technical Writing Expertise Section */}
      <section className="py-20 relative z-10 bg-gradient-to-br from-charcoal-dark/20 to-hunter-forest/10 overflow-hidden">
        <ParallaxBackground variant="geometric" speed={0.2} opacity={0.02} />
        <BrandWatermark variant="logo" opacity={0.02} size="medium" position="top-right" />
        <div className="container mx-auto px-4">
          <div className={`transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="font-display text-4xl font-bold text-center mb-16 bg-gradient-to-r from-hunter-emerald to-metallic-silver bg-clip-text text-transparent">
              AI & Technical Writing Expertise
            </h2>
            
            <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
              <GlassCard variant="premium" className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-hunter-emerald/10 to-metallic-silver/10"></div>
                <div className="relative z-10">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-hunter-emerald to-hunter-core rounded-lg flex items-center justify-center mr-4">
                      <FaLightbulb className="text-charcoal-dark text-2xl" />
                    </div>
                    <div>
                      <h3 className="font-display text-2xl font-semibold text-glass-light">AI Content Writer</h3>
                      <p className="text-hunter-sage">Outlier AI • October 2024 - Present</p>
                    </div>
                  </div>
                  <p className="text-hunter-sage mb-6 leading-relaxed">
                    Specializing in creating high-quality AI training content and technical documentation. 
                    Working with cutting-edge language models and contributing to the advancement of AI systems 
                    through precise, well-structured content creation.
                  </p>
                  <ul className="space-y-3 text-hunter-sage">
                    <li className="flex items-start">
                      <span className="text-hunter-emerald mr-3 text-lg">✓</span>
                      <span>AI model training and content optimization</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-hunter-emerald mr-3 text-lg">✓</span>
                      <span>Technical documentation and API guides</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-hunter-emerald mr-3 text-lg">✓</span>
                      <span>LLM prompt engineering and optimization</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-hunter-emerald mr-3 text-lg">✓</span>
                      <span>Cross-functional collaboration with AI teams</span>
                    </li>
                  </ul>
                </div>
              </GlassCard>
              
              <GlassCard variant="hunter" className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-hunter-core/10 to-hunter-forest/10"></div>
                <div className="relative z-10">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-metallic-silver to-hunter-core rounded-lg flex items-center justify-center mr-4">
                      <FaRocket className="text-charcoal-dark text-2xl" />
                    </div>
                    <div>
                      <h3 className="font-display text-2xl font-semibold text-glass-light">AI/ML Technologies</h3>
                      <p className="text-hunter-sage">Modern Development Stack</p>
                    </div>
                  </div>
                  <p className="text-hunter-sage mb-6 leading-relaxed">
                    Leveraging the latest in artificial intelligence and machine learning to create 
                    intelligent applications. From API integrations to custom AI solutions, bringing 
                    cutting-edge technology to real-world problems.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-glass-subtle/50 rounded-lg p-4 border border-glass-border">
                      <h4 className="font-semibold text-glass-light mb-2">AI Platforms</h4>
                      <ul className="text-sm text-hunter-sage space-y-1">
                        <li>• OpenAI GPT APIs</li>
                        <li>• Claude AI</li>
                        <li>• Hugging Face</li>
                        <li>• TensorFlow</li>
                      </ul>
                    </div>
                    <div className="bg-glass-subtle/50 rounded-lg p-4 border border-glass-border">
                      <h4 className="font-semibold text-glass-light mb-2">Specializations</h4>
                      <ul className="text-sm text-hunter-sage space-y-1">
                        <li>• Prompt Engineering</li>
                        <li>• Content Generation</li>
                        <li>• API Integration</li>
                        <li>• Model Training</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>
            
            <div className="mt-16 text-center">
              <GlassCard variant="premium" className="max-w-4xl mx-auto">
                <h3 className="font-display text-2xl font-semibold text-glass-light mb-4">
                  StrayDog Syndications: Where Innovation Meets Excellence
                </h3>
                <p className="text-hunter-sage mb-6 leading-relaxed">
                  Combining 20+ years of hospitality excellence with cutting-edge AI/ML expertise. 
                  Every project receives the same attention to detail and commitment to quality that 
                  defined my culinary career, now applied to creating intelligent software solutions.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <span className="px-4 py-2 bg-hunter-emerald/20 text-hunter-emerald rounded-full text-sm font-medium border border-hunter-emerald/30">
                    AI Integration Specialist
                  </span>
                  <span className="px-4 py-2 bg-metallic-silver/20 text-metallic-silver rounded-full text-sm font-medium border border-metallic-silver/30">
                    Technical Content Writer
                  </span>
                  <span className="px-4 py-2 bg-hunter-core/20 text-hunter-core rounded-full text-sm font-medium border border-hunter-core/30">
                    Full-Stack Developer
                  </span>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>

      {/* Career Timeline Section */}
      <CareerTimeline />

      {/* Kitchen Lessons Section */}
      <KitchenLessons />

      {/* AI Experiments Section */}
      <AIExperimentShowcase />

      {/* Skills Section */}
      <section id="skills" className="py-20 relative z-10 overflow-hidden">
        <ParallaxBackground variant="minimal" speed={0.4} opacity={0.03} />
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
                  className={`animate-fade-in animate-delay-${index * 100}ms`}
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
                  Ready for new challenges and innovative collaborations! Whether you have a project in mind, 
                  want to explore AI/ML possibilities, or just want to connect with a fellow developer who 
                  brings hospitality-level service to software development, let's build something amazing together.
                </p>
                
                <div className="space-y-6 mb-8">
                  <div className="flex items-center group">
                    <div className="w-12 h-12 bg-gradient-to-br from-hunter-emerald to-metallic-silver rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                      <FaEnvelope className="text-charcoal-dark" />
                    </div>
                    <div>
                      <p className="text-glass-light font-medium">Email</p>
                      <p className="text-hunter-sage">contact@straydogsyndications.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center group">
                    <div className="w-12 h-12 bg-gradient-to-br from-metallic-silver to-hunter-core rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                      <FaGithub className="text-charcoal-dark" />
                    </div>
                    <div>
                      <p className="text-glass-light font-medium">GitHub Portfolio</p>
                      <p className="text-hunter-sage">github.com/StrayDogSyn</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center group">
                    <div className="w-12 h-12 bg-gradient-to-br from-hunter-core to-hunter-forest rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                      <FaMapMarkerAlt className="text-charcoal-dark" />
                    </div>
                    <div>
                      <p className="text-glass-light font-medium">Location</p>
                      <p className="text-hunter-sage">New England, Remote Available</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <a 
                    href="https://github.com/StrayDogSyn" 
                    className="w-12 h-12 bg-glass-subtle border border-glass-border rounded-lg flex items-center justify-center text-hunter-emerald hover:bg-hunter-emerald hover:text-charcoal-dark transition-all duration-300 hover:scale-110"
                    title="Visit Eric's GitHub Profile"
                    aria-label="GitHub Profile"
                  >
                    <FaGithub size={20} />
                  </a>
                  <a 
                    href="https://straydogsyn.github.io/portfolio" 
                    className="w-12 h-12 bg-glass-subtle border border-glass-border rounded-lg flex items-center justify-center text-hunter-emerald hover:bg-hunter-emerald hover:text-charcoal-dark transition-all duration-300 hover:scale-110"
                    title="View Live Portfolio"
                    aria-label="Live Portfolio"
                  >
                    <FaExternalLinkAlt size={20} />
                  </a>
                  <a 
                    href="https://linkedin.com" 
                    className="w-12 h-12 bg-glass-subtle border border-glass-border rounded-lg flex items-center justify-center text-hunter-emerald hover:bg-hunter-emerald hover:text-charcoal-dark transition-all duration-300 hover:scale-110"
                    title="Connect on LinkedIn"
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
