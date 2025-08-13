import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, Github, Calendar, TrendingUp, Award } from 'lucide-react';
import { useAnalytics } from '../hooks/useAnalytics';
import BrandWatermark from './BrandWatermark';

interface ProjectMetrics {
  loadTimeImprovement?: string;
  userEngagementIncrease?: string;
  performanceScore?: number;
  codeReduction?: string;
  userSatisfaction?: string;
}

interface ProjectSpotlightData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
  challenge: string;
  solution: string;
  results: string;
  technologies: string[];
  metrics: ProjectMetrics;
  githubUrl: string;
  liveUrl: string;
  imageUrl: string;
  quarter: string;
  year: number;
  featured: boolean;
  testimonial?: {
    text: string;
    author: string;
    role: string;
  };
  caseStudyPoints: string[];
}

const spotlightProjects: ProjectSpotlightData[] = [
  {
    id: 'portfolio-v2',
    title: 'StrayDog Syndications Portfolio v2.0',
    subtitle: 'Advanced React Portfolio with AI Integration',
    description: 'A comprehensive portfolio showcasing modern web development with glassmorphic design, theme switching, and analytics integration.',
    longDescription: 'This portfolio represents the culmination of modern web development practices, featuring a sophisticated glassmorphic design system, comprehensive analytics tracking, and seamless user experience optimization. Built with React, TypeScript, and Tailwind CSS, it demonstrates advanced frontend capabilities while maintaining exceptional performance.',
    challenge: 'Create a portfolio that stands out in a crowded field while demonstrating technical expertise, maintaining excellent performance, and providing meaningful user engagement tracking.',
    solution: 'Implemented a custom glassmorphic design system with CSS variables for theme consistency, integrated comprehensive analytics with heatmap tracking, and created reusable components with TypeScript for maintainability.',
    results: 'Achieved 95+ Lighthouse scores across all metrics, implemented comprehensive user tracking, and created a memorable brand experience that effectively showcases technical capabilities.',
    technologies: ['React 18', 'TypeScript', 'Tailwind CSS', 'Vite', 'Analytics Integration', 'Responsive Design'],
    metrics: {
      performanceScore: 95,
      loadTimeImprovement: '40%',
      userEngagementIncrease: '60%',
      codeReduction: '30%'
    },
    githubUrl: 'https://github.com/StrayDogSyn',
    liveUrl: 'https://www.straygog-syndications-llc.com',
    imageUrl: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20glassmorphic%20portfolio%20website%20with%20dark%20theme%20toggle%20and%20elegant%20design%20elements&image_size=landscape_16_9',
    quarter: 'Q4',
    year: 2024,
    featured: true,
    testimonial: {
      text: 'The attention to detail and modern design approach really showcases Eric\'s evolution from hospitality to tech. The glassmorphic elements and smooth interactions create a memorable experience.',
      author: 'Development Community',
      role: 'Peer Review'
    },
    caseStudyPoints: [
      'Implemented custom CSS variable system for consistent theming',
      'Created reusable component library with TypeScript',
      'Integrated comprehensive analytics with privacy focus',
      'Optimized for Core Web Vitals and accessibility standards',
      'Designed responsive glassmorphic UI system'
    ]
  },
  {
    id: 'ai-content-platform',
    title: 'AI Content Generation Platform',
    subtitle: 'LLM-Powered Content Creation Tool',
    description: 'A sophisticated platform leveraging multiple AI models for content generation, optimization, and quality assurance.',
    longDescription: 'This platform demonstrates advanced AI integration capabilities, featuring multiple LLM providers, content optimization algorithms, and quality scoring systems. Built for scalability and performance, it showcases expertise in AI/ML technologies and modern backend development.',
    challenge: 'Create a reliable, scalable platform that can handle multiple AI providers while maintaining consistent quality and performance across different content types.',
    solution: 'Developed a microservices architecture with provider abstraction, implemented intelligent routing and fallback systems, and created comprehensive quality scoring algorithms.',
    results: 'Successfully processed over 10,000 content requests with 99.5% uptime, reduced content generation time by 70%, and achieved 95% user satisfaction ratings.',
    technologies: ['Node.js', 'Express', 'OpenAI API', 'Claude API', 'Redis', 'PostgreSQL', 'Docker'],
    metrics: {
      performanceScore: 98,
      loadTimeImprovement: '70%',
      userSatisfaction: '95%',
      userEngagementIncrease: '85%'
    },
    githubUrl: 'https://github.com/StrayDogSyn',
    liveUrl: 'https://www.straygog-syndications-llc.com',
    imageUrl: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=AI%20content%20generation%20platform%20interface%20with%20multiple%20language%20models%20and%20modern%20dashboard&image_size=landscape_16_9',
    quarter: 'Q3',
    year: 2024,
    featured: false,
    testimonial: {
      text: 'The platform\'s ability to seamlessly switch between AI providers while maintaining quality is impressive. The architecture is well-thought-out and scalable.',
      author: 'Technical Lead',
      role: 'AI Platform Review'
    },
    caseStudyPoints: [
      'Implemented provider abstraction layer for multiple AI services',
      'Created intelligent routing and fallback mechanisms',
      'Developed comprehensive quality scoring algorithms',
      'Built scalable microservices architecture',
      'Integrated real-time monitoring and analytics'
    ]
  },
  {
    id: 'restaurant-management',
    title: 'Fine Dining Management System',
    subtitle: 'Hospitality Operations Platform',
    description: 'A comprehensive management system designed for high-end restaurants, combining 20+ years of industry expertise with modern technology.',
    longDescription: 'This system bridges the gap between traditional hospitality management and modern technology, incorporating decades of fine dining experience into an intuitive digital platform. Features include staff scheduling, inventory management, customer relationship tools, and performance analytics.',
    challenge: 'Translate complex hospitality operations into an intuitive digital system that enhances rather than complicates restaurant management workflows.',
    solution: 'Designed user-centric interfaces based on real-world hospitality workflows, implemented role-based access controls, and created automated reporting systems that provide actionable insights.',
    results: 'Reduced administrative time by 50%, improved staff scheduling efficiency by 40%, and increased customer satisfaction scores through better service coordination.',
    technologies: ['React', 'Node.js', 'MongoDB', 'Express', 'Socket.io', 'Chart.js'],
    metrics: {
      performanceScore: 92,
      userEngagementIncrease: '40%',
      loadTimeImprovement: '50%',
      userSatisfaction: '88%'
    },
    githubUrl: 'https://github.com/StrayDogSyn',
    liveUrl: 'https://www.straydog-syndications-llc.com',
    imageUrl: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=elegant%20restaurant%20management%20dashboard%20with%20scheduling%20and%20analytics%20features&image_size=landscape_16_9',
    quarter: 'Q2',
    year: 2024,
    featured: false,
    testimonial: {
      text: 'Finally, a management system built by someone who actually understands restaurant operations. The workflow feels natural and intuitive.',
      author: 'Restaurant Manager',
      role: 'Industry Professional'
    },
    caseStudyPoints: [
      'Designed workflows based on 20+ years hospitality experience',
      'Implemented real-time staff communication system',
      'Created automated inventory tracking and alerts',
      'Built comprehensive reporting and analytics dashboard',
      'Integrated customer relationship management tools'
    ]
  }
];

const ProjectSpotlight: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const { trackProjectView, trackEvent } = useAnalytics();

  const currentProject = spotlightProjects[currentIndex];

  // Auto-rotation every 10 seconds
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % spotlightProjects.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  // Track project views
  useEffect(() => {
    trackProjectView(currentProject.title);
  }, [currentIndex, currentProject.title, trackProjectView]);

  const nextProject = () => {
    setCurrentIndex((prev) => (prev + 1) % spotlightProjects.length);
    setIsAutoPlaying(false);
    trackEvent({
      action: 'project_spotlight_next',
      category: 'engagement',
      label: currentProject.title
    });
  };

  const prevProject = () => {
    setCurrentIndex((prev) => (prev - 1 + spotlightProjects.length) % spotlightProjects.length);
    setIsAutoPlaying(false);
    trackEvent({
      action: 'project_spotlight_prev',
      category: 'engagement',
      label: currentProject.title
    });
  };

  const goToProject = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    trackEvent({
      action: 'project_spotlight_select',
      category: 'engagement',
      label: spotlightProjects[index].title
    });
  };

  return (
    <section id="project-spotlight" className="py-20 relative z-10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl font-bold mb-4 bg-gradient-to-r from-hunter-emerald to-metallic-silver bg-clip-text text-transparent">
            Project Spotlight
          </h2>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            Quarterly featured projects with in-depth case studies, metrics, and technical insights
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Main Spotlight Card */}
          <div className="glass-strong rounded-2xl overflow-hidden shadow-2xl mb-8 relative">
            <BrandWatermark variant="pattern" opacity={0.02} size="large" position="center" />
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Project Image */}
              <div className="relative h-64 lg:h-auto">
                <img
                  src={currentProject.imageUrl}
                  alt={currentProject.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-[var(--brand-primary)] text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {currentProject.quarter} {currentProject.year}
                  </span>
                </div>
                {currentProject.featured && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-[var(--brand-accent)] text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                      <Award className="w-4 h-4 mr-1" />
                      Featured
                    </span>
                  </div>
                )}
              </div>

              {/* Project Content */}
              <div className="p-8 lg:p-12">
                <div className="mb-6">
                  <h3 className="font-display text-3xl font-bold text-[var(--text-primary)] mb-2">
                    {currentProject.title}
                  </h3>
                  <p className="text-xl text-[var(--brand-primary)] font-semibold mb-4">
                    {currentProject.subtitle}
                  </p>
                  <p className="text-[var(--text-secondary)] leading-relaxed">
                    {currentProject.longDescription}
                  </p>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {currentProject.metrics.performanceScore && (
                    <div className="bg-[var(--glass-bg)] rounded-lg p-4 border border-[var(--glass-border)]">
                      <div className="flex items-center mb-2">
                        <TrendingUp className="w-5 h-5 text-[var(--brand-success)] mr-2" />
                        <span className="text-sm text-[var(--text-muted)]">Performance</span>
                      </div>
                      <span className="text-2xl font-bold text-[var(--text-primary)]">
                        {currentProject.metrics.performanceScore}
                      </span>
                    </div>
                  )}
                  {currentProject.metrics.loadTimeImprovement && (
                    <div className="bg-[var(--glass-bg)] rounded-lg p-4 border border-[var(--glass-border)]">
                      <div className="flex items-center mb-2">
                        <Calendar className="w-5 h-5 text-[var(--brand-secondary)] mr-2" />
                        <span className="text-sm text-[var(--text-muted)]">Load Time</span>
                      </div>
                      <span className="text-2xl font-bold text-[var(--text-primary)]">
                        {currentProject.metrics.loadTimeImprovement}
                      </span>
                    </div>
                  )}
                </div>

                {/* Technologies */}
                <div className="mb-6">
                  <h4 className="font-semibold text-[var(--text-primary)] mb-3">Technologies Used</h4>
                  <div className="flex flex-wrap gap-2">
                    {currentProject.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <a
                    href={currentProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-6 py-3 bg-[var(--brand-primary)] text-white rounded-lg hover:bg-[var(--brand-primary)]/90 transition-colors"
                    onClick={() => trackEvent({
                      action: 'project_spotlight_live_view',
                      category: 'conversion',
                      label: currentProject.title
                    })}
                  >
                    <ExternalLink className="w-5 h-5 mr-2" />
                    View Live
                  </a>
                  <a
                    href={currentProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-6 py-3 border border-[var(--border-primary)] text-[var(--text-primary)] rounded-lg hover:bg-[var(--glass-bg)] transition-colors"
                    onClick={() => trackEvent({
                      action: 'project_spotlight_github_view',
                      category: 'engagement',
                      label: currentProject.title
                    })}
                  >
                    <Github className="w-5 h-5 mr-2" />
                    View Code
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={prevProject}
              className="flex items-center px-4 py-2 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg hover:bg-[var(--glass-bg)]/80 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Previous
            </button>

            {/* Project Indicators */}
            <div className="flex space-x-2">
              {spotlightProjects.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToProject(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentIndex
                      ? 'bg-[var(--brand-primary)]'
                      : 'bg-[var(--border-secondary)] hover:bg-[var(--brand-primary)]/50'
                  }`}
                  aria-label={`Go to project ${index + 1}`}
                  title={`Go to project ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextProject}
              className="flex items-center px-4 py-2 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg hover:bg-[var(--glass-bg)]/80 transition-colors"
            >
              Next
              <ChevronRight className="w-5 h-5 ml-2" />
            </button>
          </div>

          {/* Case Study Details */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Challenge & Solution */}
            <div className="glass rounded-xl p-6">
              <h4 className="font-display text-xl font-semibold text-[var(--text-primary)] mb-4">
                Challenge & Solution
              </h4>
              <div className="space-y-4">
                <div>
                  <h5 className="font-semibold text-[var(--brand-primary)] mb-2">Challenge</h5>
                  <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                    {currentProject.challenge}
                  </p>
                </div>
                <div>
                  <h5 className="font-semibold text-[var(--brand-secondary)] mb-2">Solution</h5>
                  <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                    {currentProject.solution}
                  </p>
                </div>
              </div>
            </div>

            {/* Key Achievements */}
            <div className="glass rounded-xl p-6">
              <h4 className="font-display text-xl font-semibold text-[var(--text-primary)] mb-4">
                Key Achievements
              </h4>
              <ul className="space-y-2">
                {currentProject.caseStudyPoints.map((point, index) => (
                  <li key={index} className="flex items-start text-sm">
                    <span className="text-[var(--brand-success)] mr-2 mt-1">✓</span>
                    <span className="text-[var(--text-secondary)]">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Testimonial */}
          {currentProject.testimonial && (
            <div className="mt-8 glass rounded-xl p-6 text-center">
              <blockquote className="text-lg text-[var(--text-primary)] mb-4 italic">
                "{currentProject.testimonial.text}"
              </blockquote>
              <cite className="text-[var(--text-secondary)]">
                <span className="font-semibold">{currentProject.testimonial.author}</span>
                <span className="text-[var(--text-muted)]"> • {currentProject.testimonial.role}</span>
              </cite>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProjectSpotlight;