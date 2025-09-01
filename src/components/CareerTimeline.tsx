import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Award, ExternalLink, ChevronDown, ChevronUp, Building, Code, TrendingUp } from 'lucide-react';
import { useAnalytics } from '../hooks/useAnalytics';

interface TimelineEvent {
  id: string;
  title: string;
  organization: string;
  location: string;
  startDate: string;
  endDate?: string;
  type: 'role' | 'certification' | 'education' | 'achievement';
  description: string;
  highlights: string[];
  skills: string[];
  certificationUrl?: string;
  verificationId?: string;
  current?: boolean;
}

const timelineEvents: TimelineEvent[] = [
  {
    id: 'outlier-ai-writer',
    title: 'AI Content Writer',
    organization: 'Outlier AI',
    location: 'Remote',
    startDate: '2024-10',
    type: 'role',
    current: true,
    description: 'Specializing in creating high-quality AI training content and technical documentation for cutting-edge language models.',
    highlights: [
      'AI model training and content optimization',
      'Technical documentation and API guides',
      'LLM prompt engineering and optimization',
      'Cross-functional collaboration with AI teams'
    ],
    skills: ['AI/ML', 'Technical Writing', 'Prompt Engineering', 'Content Strategy', 'API Documentation']
  },
  {
    id: 'portfolio-development',
    title: 'Full-Stack Portfolio Development',
    organization: 'StrayDog Syndications',
    location: 'Independent',
    startDate: '2024-08',
    type: 'achievement',
    current: true,
    description: 'Developed comprehensive portfolio showcasing modern web development with glassmorphic design, analytics integration, and AI features.',
    highlights: [
      'Built with React 18, TypeScript, and Tailwind CSS',
      'Implemented comprehensive analytics with heatmap tracking',
      'Created custom glassmorphic design system',
      'Achieved 95+ Lighthouse scores across all metrics'
    ],
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Analytics', 'Performance Optimization']
  },
  {
    id: 'web-development-transition',
    title: 'Career Transition to Web Development',
    organization: 'Self-Directed Learning',
    location: 'Remote',
    startDate: '2024-01',
    endDate: '2024-08',
    type: 'education',
    description: 'Intensive self-directed learning program focusing on modern web development technologies and best practices.',
    highlights: [
      'Mastered JavaScript ES6+, HTML5, and CSS3',
      'Learned React, Node.js, and database technologies',
      'Built 6+ interactive projects and applications',
      'Developed problem-solving and debugging skills'
    ],
    skills: ['JavaScript', 'React', 'Node.js', 'HTML5', 'CSS3', 'Git', 'Problem Solving']
  },
  {
    id: 'sous-chef-role',
    title: 'Sous Chef',
    organization: 'Fine Dining Establishments',
    location: 'Various Locations',
    startDate: '2010-01',
    endDate: '2023-12',
    type: 'role',
    description: 'Led kitchen operations in high-end restaurants, managing teams of 15+ staff and ensuring exceptional quality standards.',
    highlights: [
      'Managed kitchen operations for 200+ covers per night',
      'Trained and mentored junior kitchen staff',
      'Implemented quality control and efficiency systems',
      'Maintained food safety and sanitation standards'
    ],
    skills: ['Leadership', 'Team Management', 'Quality Control', 'Process Optimization', 'Training & Development']
  },
  {
    id: 'culinary-education',
    title: 'Culinary Arts Program',
    organization: 'Culinary Institute',
    location: 'Professional Training',
    startDate: '2008-01',
    endDate: '2010-01',
    type: 'education',
    description: 'Comprehensive culinary arts education focusing on fine dining techniques, kitchen management, and food service operations.',
    highlights: [
      'Classical French cooking techniques',
      'Kitchen management and operations',
      'Food safety and sanitation certification',
      'Menu development and cost control'
    ],
    skills: ['Culinary Arts', 'Kitchen Management', 'Food Safety', 'Menu Development', 'Cost Control']
  },
  {
    id: 'hospitality-foundation',
    title: 'Kitchen Staff & Line Cook',
    organization: 'Various Restaurants',
    location: 'Entry Level Positions',
    startDate: '2004-01',
    endDate: '2008-01',
    type: 'role',
    description: 'Built foundational hospitality experience working in various kitchen positions, learning the fundamentals of professional cooking.',
    highlights: [
      'Mastered fundamental cooking techniques',
      'Learned to work under pressure in fast-paced environments',
      'Developed attention to detail and precision',
      'Built strong work ethic and team collaboration skills'
    ],
    skills: ['Cooking Fundamentals', 'Time Management', 'Attention to Detail', 'Team Collaboration', 'Work Ethic']
  }
];

const CareerTimeline: React.FC = () => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set());
  const { trackEvent } = useAnalytics();

  // Animate items on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const itemId = entry.target.getAttribute('data-timeline-id');
            if (itemId) {
              setVisibleItems(prev => new Set([...prev, itemId]));
            }
          }
        });
      },
      { threshold: 0.2 }
    );

    const timelineItems = document.querySelectorAll('[data-timeline-id]');
    timelineItems.forEach(item => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });

    trackEvent({
      action: 'career_timeline_expand',
      category: 'engagement',
      label: id
    });
  };

  const getTypeIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'role':
        return <Building className="w-5 h-5" />;
      case 'certification':
        return <Award className="w-5 h-5" />;
      case 'education':
        return <Code className="w-5 h-5" />;
      case 'achievement':
        return <TrendingUp className="w-5 h-5" />;
      default:
        return <Calendar className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'role':
        return 'text-[var(--brand-primary)] bg-[var(--brand-primary)]/10';
      case 'certification':
        return 'text-[var(--brand-accent)] bg-[var(--brand-accent)]/10';
      case 'education':
        return 'text-[var(--brand-secondary)] bg-[var(--brand-secondary)]/10';
      case 'achievement':
        return 'text-[var(--brand-success)] bg-[var(--brand-success)]/10';
      default:
        return 'text-[var(--text-muted)] bg-[var(--text-muted)]/10';
    }
  };

  const formatDate = (dateString: string) => {
    const [year, month] = dateString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  const calculateDuration = (startDate: string, endDate?: string) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
    const diffMonths = Math.floor((diffTime % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
    
    if (diffYears > 0) {
      return `${diffYears}y ${diffMonths}m`;
    }
    return `${diffMonths}m`;
  };

  return (
    <div className="relative">
      <div className="text-center mb-8">
        <h3 className="font-display text-2xl font-bold mb-2 bg-gradient-to-r from-hunter-emerald to-metallic-silver bg-clip-text text-transparent">
          Career Timeline
        </h3>
        <p className="text-sm text-[var(--text-secondary)]">
          A journey from hospitality excellence to technology innovation
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Timeline Container */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[var(--brand-primary)] via-[var(--brand-secondary)] to-[var(--brand-accent)]"></div>

          {/* Timeline Items */}
          <div className="space-y-4">
              {timelineEvents.map((event, index) => {
                const isExpanded = expandedItems.has(event.id);
                const isVisible = visibleItems.has(event.id);
                
                return (
                  <div
                    key={event.id}
                    data-timeline-id={event.id}
                    className={`relative transition-all duration-700 transition-delay-${index * 150}ms ${
                      isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                    }`}
                  >
                    {/* Timeline Dot */}
                    <div className={`absolute left-6 w-4 h-4 rounded-full border-2 border-white shadow-lg ${
                      event.current ? 'bg-[var(--brand-primary)] animate-pulse' : 'bg-[var(--glass-bg)]'
                    }`}></div>

                    {/* Timeline Card */}
                    <div className="ml-16 glass rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
                      {/* Card Header */}
                      <div 
                        className="p-6 cursor-pointer"
                        onClick={() => toggleExpanded(event.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <div className={`p-2 rounded-lg mr-3 ${getTypeColor(event.type)}`}>
                                {getTypeIcon(event.type)}
                              </div>
                              <div>
                                <h3 className="font-display text-xl font-semibold text-[var(--text-primary)]">
                                  {event.title}
                                  {event.current && (
                                    <span className="ml-2 px-2 py-1 bg-[var(--brand-primary)] text-white text-xs rounded-full">
                                      Current
                                    </span>
                                  )}
                                </h3>
                                <p className="text-[var(--brand-primary)] font-medium">{event.organization}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center text-sm text-[var(--text-muted)] mb-3">
                              <MapPin className="w-4 h-4 mr-1" />
                              <span className="mr-4">{event.location}</span>
                              <Calendar className="w-4 h-4 mr-1" />
                              <span>
                                {formatDate(event.startDate)} - {event.endDate ? formatDate(event.endDate) : 'Present'}
                                <span className="ml-2 text-[var(--brand-secondary)]">({calculateDuration(event.startDate, event.endDate)})</span>
                              </span>
                            </div>
                            
                            <p className="text-[var(--text-secondary)] leading-relaxed">
                              {event.description}
                            </p>
                          </div>
                          
                          <button className="ml-4 p-2 hover:bg-[var(--glass-bg)] rounded-lg transition-colors">
                            {isExpanded ? (
                              <ChevronUp className="w-5 h-5 text-[var(--text-muted)]" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-[var(--text-muted)]" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Expanded Content */}
                      {isExpanded && (
                        <div className="px-6 pb-6 border-t border-[var(--border-secondary)]">
                          <div className="pt-6 space-y-6">
                            {/* Highlights */}
                            <div>
                              <h4 className="font-semibold text-[var(--text-primary)] mb-3">Key Highlights</h4>
                              <ul className="space-y-2">
                                {event.highlights.map((highlight, idx) => (
                                  <li key={idx} className="flex items-start text-sm">
                                    <span className="text-[var(--brand-success)] mr-2 mt-1">✓</span>
                                    <span className="text-[var(--text-secondary)]">{highlight}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Skills */}
                            <div>
                              <h4 className="font-semibold text-[var(--text-primary)] mb-3">Skills & Technologies</h4>
                              <div className="flex flex-wrap gap-2">
                                {event.skills.map((skill, idx) => (
                                  <span
                                    key={idx}
                                    className="px-3 py-1 bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] rounded-full text-sm font-medium"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Certification Link */}
                            {event.certificationUrl && (
                              <div>
                                <a
                                  href={event.certificationUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center px-4 py-2 bg-[var(--brand-primary)] text-white rounded-lg hover:bg-[var(--brand-primary)]/90 transition-colors text-sm"
                                  onClick={() => trackEvent({
                                    action: 'certification_view',
                                    category: 'engagement',
                                    label: event.id
                                  })}
                                >
                                  <ExternalLink className="w-4 h-4 mr-2" />
                                  View Certification
                                </a>
                                {event.verificationId && (
                                  <p className="text-xs text-[var(--text-muted)] mt-2">
                                    Verification ID: {event.verificationId}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Timeline Summary */}
        <div className="mt-8 glass rounded-xl p-6 text-center">
            <h3 className="font-display text-2xl font-semibold text-[var(--text-primary)] mb-4">
              20+ Years of Excellence
            </h3>
            <p className="text-[var(--text-secondary)] mb-6 leading-relaxed">
              From mastering the art of fine dining to embracing cutting-edge technology, 
              this journey represents a commitment to continuous learning, quality, and innovation.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-[var(--brand-primary)] mb-2">20+</div>
                <div className="text-sm text-[var(--text-muted)]">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[var(--brand-secondary)] mb-2">15+</div>
                <div className="text-sm text-[var(--text-muted)]">Team Members Trained</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[var(--brand-accent)] mb-2">6+</div>
                <div className="text-sm text-[var(--text-muted)]">Projects Completed</div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerTimeline;