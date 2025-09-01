import {
  FaGithub,
  FaLinkedin,
  FaExternalLinkAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { getAllProjectsSorted } from '../data/projects';
import SkillCard from './SkillCard';
import ProjectCard from './ProjectCard';
import GlassContainer from './GlassContainer';
import GlassCard from './GlassCard';
import BrandImage from './BrandImage';
import AdvancedNavigation from './AdvancedNavigation';
import ThemeToggle from './ThemeToggle';
import ParallaxBackground from './ParallaxBackground';
import BrandWatermark from './BrandWatermark';

import FeaturedProjects from './FeaturedProjects';
import CareerTimeline from './CareerTimeline';
import KitchenLessons from './KitchenLessons';
import GitHubActivity from './GitHubActivity';
import { useAnalytics, useScrollTracking, usePerformanceTracking } from '../hooks/useAnalytics';
import { BrandConfigs } from './BrandImage';
import { brandAssetManager } from '../utils/brandAssets';

interface Skill {
  name: string;
  level: number;
  category: 'frontend' | 'backend' | 'database' | 'tools';
}

function Portfolio() {
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const { trackNavigation } = useAnalytics();

  // Initialize analytics tracking
  useScrollTracking();
  usePerformanceTracking();

  useEffect(() => {
    setMounted(true);

    // Preload critical brand assets
    brandAssetManager.preloadCriticalAssets();

    const handleScroll = () => {
      const sections = ['home', 'featured-projects', 'career-timeline', 'skills', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    { name: 'A/B Testing', level: 75, category: 'tools' },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      trackNavigation(sectionId);
    }
  };

  const navigationItems = [
    { id: 'home', label: 'Home', href: '#home', priority: 1 },
    {
      id: 'featured-projects',
      label: 'Projects',
      href: '#featured-projects',
      priority: 2,
      badge: '5',
    },
    { id: 'career-timeline', label: 'Career', href: '#career-timeline', priority: 3 },
    { id: 'skills', label: 'Skills', href: '#skills', priority: 4 },
    { id: 'contact', label: 'Contact', href: '#contact', priority: 5 },
    {
      id: 'coordination',
      label: 'System Control',
      href: '/coordination',
      isRoute: true,
      priority: 6,
      badge: 'Live',
    },
    {
      id: 'marvel-quiz',
      label: 'Marvel Quiz',
      href: '/marvel-quiz',
      isRoute: true,
      priority: 7,
      badge: 'Demo',
    },
  ];

  return (
    <div className='min-h-screen bg-charcoal-dark relative overflow-hidden w-full'>
      {/* Animated Background */}
      <div className='fixed inset-0 z-0'>
        <div className='absolute inset-0 bg-gradient-to-br from-charcoal-dark via-hunter-forest to-charcoal-medium'></div>
        {/* Brand Banner Background Pattern */}
        <div className='absolute inset-0 opacity-5 bg-repeat bg-center brand-banner-bg'></div>
        <div className='absolute top-1/4 left-1/4 w-96 h-96 bg-hunter-emerald/10 rounded-full blur-3xl animate-pulse-slow'></div>
        <div className='absolute bottom-1/4 right-1/4 w-80 h-80 bg-metallic-silver/5 rounded-full blur-3xl animate-pulse-slow animate-delay-2s'></div>
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-hunter-core/8 rounded-full blur-2xl animate-pulse-slow animate-delay-4s'></div>
      </div>

      {/* Navigation */}
      <div className='fixed top-0 left-0 right-0 z-50'>
        <AdvancedNavigation
          items={navigationItems}
          activeItem={activeSection}
          logo={
            <div className='flex items-center space-x-2'>
              <BrandImage {...BrandConfigs.navLogo} className='w-8 h-8 rounded-lg' />
              <span className='font-display font-bold text-lg bg-gradient-to-r from-hunter-emerald to-metallic-silver bg-clip-text text-transparent'>
                StrayDog Syndications
              </span>
            </div>
          }
          actions={<ThemeToggle />}
        />
      </div>

      {/* Hero Section */}
      <section
        id='home'
        className='min-h-screen flex items-center justify-center relative z-10 overflow-hidden w-full'
      >
        <ParallaxBackground variant='pattern' speed={0.3} opacity={0.04} />
        <BrandWatermark variant='pattern' opacity={0.03} size='large' position='center' />
        <div className='w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <GlassContainer className='max-w-5xl mx-auto'>
            <div
              className={`transition-all duration-1000 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <div className='mb-8'>
                <div className='w-32 h-32 mx-auto mb-6 relative'>
                  <BrandImage
                    {...BrandConfigs.heroLogo}
                    className='w-32 h-32 rounded-full shadow-2xl border-4 border-hunter-emerald/30 hover:border-hunter-emerald/60 transition-all duration-300'
                  />
                </div>
                <h1 className='font-display text-5xl md:text-7xl font-bold mb-6'>
                  <span className='bg-gradient-to-r from-hunter-emerald via-metallic-silver to-hunter-core bg-clip-text text-transparent'>
                    StrayDog Syndications
                  </span>
                </h1>
                <h2 className='text-2xl md:text-3xl font-semibold text-metallic-silver mb-4'>
                  From Kitchen to Code: 20+ Years of Excellence
                </h2>
                <p className='text-lg md:text-xl text-metallic-silver/80 mb-8 max-w-3xl mx-auto leading-relaxed'>
                  Transforming two decades of fine dining leadership into innovative software
                  development. Specializing in JavaScript, AI/ML technologies, and creating digital
                  experiences with the same precision and attention to detail that defined my
                  culinary career.
                </p>
              </div>
              <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                <button
                  onClick={() => scrollToSection('featured-projects')}
                  className='px-8 py-4 bg-gradient-to-r from-hunter-emerald to-hunter-core text-charcoal-dark font-semibold rounded-lg hover:shadow-lg hover:shadow-hunter-emerald/25 transition-all duration-300 transform hover:scale-105'
                >
                  View My Work
                </button>
                <button
                  onClick={() => scrollToSection('contact')}
                  className='px-8 py-4 border-2 border-hunter-emerald text-hunter-emerald rounded-lg hover:bg-hunter-emerald hover:text-charcoal-dark transition-all duration-300 transform hover:scale-105'
                >
                  Get In Touch
                </button>
              </div>
            </div>
          </GlassContainer>
        </div>
      </section>

      {/* Featured Projects Section - NOW AT THE TOP */}
      <FeaturedProjects />

      {/* Career Timeline Section */}
      <section id='career-timeline' className='py-20 relative z-10 w-full'>
        <div className='w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div
            className={`transition-all duration-1000 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <h2 className='font-display text-4xl font-bold text-center mb-16 bg-gradient-to-r from-hunter-emerald to-metallic-silver bg-clip-text text-transparent'>
              From Kitchen to Code: My Journey
            </h2>
            <div className='grid md:grid-cols-2 gap-12 items-start'>
              <GlassCard variant='hunter' className='h-full'>
                <h3 className='font-display text-2xl font-semibold mb-6 text-glass-light'>
                  The Culinary Foundation
                </h3>
                <p className='text-hunter-sage mb-6 leading-relaxed'>
                  After 20+ years leading fine dining kitchens, I discovered that the same
                  principles that create exceptional culinary experiences translate beautifully to
                  software development. The attention to detail, systematic thinking, and relentless
                  pursuit of perfection that defined my culinary career now drive my approach to
                  creating digital solutions.
                </p>
                <p className='text-hunter-sage mb-6 leading-relaxed'>
                  My transition from chef to developer wasn't just a career change—it was an
                  evolution. The problem-solving skills honed in high-pressure kitchen environments,
                  combined with a natural curiosity for technology, led me to discover my passion
                  for JavaScript, AI/ML, and creating user experiences that feel as refined as a
                  perfectly plated dish.
                </p>
                <p className='text-hunter-sage leading-relaxed'>
                  Today, I bring that same hospitality mindset to every project, ensuring that both
                  the code and the client experience meet the highest standards. Whether it's
                  building responsive web applications, integrating AI solutions, or solving complex
                  technical challenges, I approach each project with the precision and care that
                  comes from years of professional excellence.
                </p>
              </GlassCard>

              <div className='space-y-6'>
                <CareerTimeline />
                <KitchenLessons />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GitHub Activity Section */}
      <section id='github-activity' className='py-20 relative z-10 w-full'>
        <div className='w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div
            className={`transition-all duration-1000 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <h2 className='font-display text-4xl font-bold text-center mb-16 bg-gradient-to-r from-hunter-emerald to-metallic-silver bg-clip-text text-transparent'>
              Development Activity
            </h2>
            <GitHubActivity />
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id='skills' className='py-20 relative z-10 w-full'>
        <div className='w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div
            className={`transition-all duration-1000 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <h2 className='font-display text-4xl font-bold text-center mb-16 bg-gradient-to-r from-hunter-emerald to-metallic-silver bg-clip-text text-transparent'>
              Technical Expertise
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
              {skills.map(skill => (
                <SkillCard key={skill.name} {...skill} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* All Projects Grid - Secondary Projects */}
      <section id='all-projects' className='py-20 relative z-10 w-full'>
        <div className='w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div
            className={`transition-all duration-1000 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <h2 className='font-display text-4xl font-bold text-center mb-16 bg-gradient-to-r from-hunter-emerald to-metallic-silver bg-clip-text text-transparent'>
              All Projects
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {getAllProjectsSorted().map(project => (
                <ProjectCard
                  key={project.id}
                  title={project.title}
                  description={project.description}
                  technologies={project.techStack}
                  githubUrl={project.githubUrl}
                  liveUrl={project.liveUrl}
                  imageUrl={project.image}
                  featured={project.category === 'featured'}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id='contact' className='py-20 relative z-10 w-full'>
        <div className='w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div
            className={`transition-all duration-1000 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <h2 className='font-display text-4xl font-bold text-center mb-16 bg-gradient-to-r from-hunter-emerald to-metallic-silver bg-clip-text text-transparent'>
              Get In Touch
            </h2>
            <div className='w-full grid md:grid-cols-2 gap-12'>
              <GlassCard variant='hunter' className='h-full'>
                <h3 className='font-display text-2xl font-semibold mb-6 text-glass-light'>
                  Let's Create Something Extraordinary
                </h3>
                <p className='text-hunter-sage mb-8 leading-relaxed'>
                  Ready for new challenges and innovative collaborations! Whether you have a project
                  in mind, want to explore AI/ML possibilities, or just want to connect with a
                  fellow developer who brings hospitality-level service to software development,
                  let's build something amazing together.
                </p>

                <div className='space-y-6 mb-8'>
                  <div className='flex items-center group'>
                    <div className='w-12 h-12 bg-gradient-to-br from-hunter-emerald to-metallic-silver rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300'>
                      <FaEnvelope className='text-charcoal-dark' />
                    </div>
                    <div>
                      <p className='text-glass-light font-medium'>Email</p>
                      <p className='text-hunter-sage'>eHunter@straydog-secondstory.org</p>
                    </div>
                  </div>

                  <div className='flex items-center group'>
                    <div className='w-12 h-12 bg-gradient-to-br from-metallic-silver to-hunter-core rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300'>
                      <FaGithub className='text-charcoal-dark' />
                    </div>
                    <div>
                      <p className='text-glass-light font-medium'>GitHub Portfolio</p>
                      <p className='text-hunter-sage'>github.com/StrayDogSyn</p>
                    </div>
                  </div>

                  <div className='flex items-center group'>
                    <div className='w-12 h-12 bg-gradient-to-br from-hunter-core to-hunter-forest rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300'>
                      <FaMapMarkerAlt className='text-charcoal-dark' />
                    </div>
                    <div>
                      <p className='text-glass-light font-medium'>Location</p>
                      <p className='text-hunter-sage'>New England, Remote Available</p>
                    </div>
                  </div>
                </div>

                <div className='flex space-x-4'>
                  <a
                    href='https://github.com/StrayDogSyn'
                    className='w-12 h-12 bg-glass-subtle border border-glass-border rounded-lg flex items-center justify-center text-hunter-emerald hover:bg-hunter-emerald hover:text-charcoal-dark transition-all duration-300 hover:scale-110'
                    title="Visit Eric's GitHub Profile"
                    aria-label='GitHub Profile'
                  >
                    <FaGithub size={20} />
                  </a>
                  <a
                    href='https://straydog-syndications-llc.com/'
                    className='w-12 h-12 bg-glass-subtle border border-glass-border rounded-lg flex items-center justify-center text-hunter-emerald hover:bg-hunter-emerald hover:text-charcoal-dark transition-all duration-300 hover:scale-110'
                    title='View Live Portfolio'
                    aria-label='Live Portfolio'
                  >
                    <FaExternalLinkAlt size={20} />
                  </a>
                  <a
                    href='https://linkedin.com'
                    className='w-12 h-12 bg-glass-subtle border border-glass-border rounded-lg flex items-center justify-center text-hunter-emerald hover:bg-hunter-emerald hover:text-charcoal-dark transition-all duration-300 hover:scale-110'
                    title='Connect on LinkedIn'
                    aria-label='LinkedIn Profile'
                  >
                    <FaLinkedin size={20} />
                  </a>
                </div>
              </GlassCard>

              <GlassCard variant='premium'>
                <h3 className='font-display text-xl font-semibold mb-6 text-glass-light'>
                  Start Your Project
                </h3>
                <form className='space-y-6'>
                  <div>
                    <label className='block text-sm font-medium text-metallic-silver mb-2'>
                      Full Name
                    </label>
                    <input
                      type='text'
                      className='w-full px-4 py-3 bg-glass-subtle border border-glass-border rounded-lg focus:ring-2 focus:ring-hunter-emerald focus:border-hunter-emerald text-glass-light placeholder-hunter-sage transition-all duration-300'
                      placeholder='Your name'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-metallic-silver mb-2'>
                      Email Address
                    </label>
                    <input
                      type='email'
                      className='w-full px-4 py-3 bg-glass-subtle border border-glass-border rounded-lg focus:ring-2 focus:ring-hunter-emerald focus:border-hunter-emerald text-glass-light placeholder-hunter-sage transition-all duration-300'
                      placeholder='your.email@example.com'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-metallic-silver mb-2'>
                      Project Type
                    </label>
                    <select
                      className='w-full px-4 py-3 bg-glass-subtle border border-glass-border rounded-lg focus:ring-2 focus:ring-hunter-emerald focus:border-hunter-emerald text-glass-light transition-all duration-300'
                      aria-label='Select project type'
                      title="Choose the type of project you're interested in"
                    >
                      <option value=''>Select project type</option>
                      <option value='web-app'>Web Application</option>
                      <option value='ai-integration'>AI Integration</option>
                      <option value='mobile-app'>Mobile Application</option>
                      <option value='consulting'>Technical Consulting</option>
                      <option value='other'>Other</option>
                    </select>
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-metallic-silver mb-2'>
                      Project Details
                    </label>
                    <textarea
                      rows={4}
                      className='w-full px-4 py-3 bg-glass-subtle border border-glass-border rounded-lg focus:ring-2 focus:ring-hunter-emerald focus:border-hunter-emerald text-glass-light placeholder-hunter-sage transition-all duration-300 resize-none'
                      placeholder='Tell us about your project vision, requirements, and goals...'
                    ></textarea>
                  </div>

                  <button
                    type='submit'
                    className='w-full px-6 py-4 bg-gradient-to-r from-hunter-emerald to-hunter-core text-charcoal-dark font-semibold rounded-lg hover:shadow-lg hover:shadow-hunter-emerald/25 transition-all duration-300 transform hover:scale-105'
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
      <footer className='relative z-10 py-12 w-full'>
        <div className='w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <GlassCard variant='premium' className='text-center relative'>
            {/* Brand Watermark */}
            <div className='absolute top-4 right-4 opacity-20'>
              <BrandImage
                assetKey='circa2024'
                alt='StrayDog Syndications 2024'
                width={48}
                height={48}
                className='filter brightness-0 invert'
                lazy={false}
              />
            </div>

            <div className='flex flex-col md:flex-row items-center justify-between'>
              <div className='flex items-center space-x-3 mb-4 md:mb-0'>
                <BrandImage {...BrandConfigs.navLogo} className='w-10 h-10 rounded-lg' />
                <span className='font-display font-bold text-lg bg-gradient-to-r from-hunter-emerald to-metallic-silver bg-clip-text text-transparent'>
                  StrayDog Syndications
                </span>
              </div>

              <div className='text-center md:text-right'>
                <p className='text-hunter-sage mb-2'>
                  © 2024 StrayDog Syndications. Crafted with precision.
                </p>
                <p className='text-hunter-sage/70 text-sm'>
                  Built with React, TypeScript, and Glassmorphic Design
                </p>
              </div>
            </div>
          </GlassCard>
        </div>
      </footer>
    </div>
  );
}

export default Portfolio;
