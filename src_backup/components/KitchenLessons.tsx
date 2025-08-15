import React, { useState, useEffect } from 'react';
import { ChefHat, Code, Clock, Users, Target, Lightbulb, ArrowRight, BookOpen } from 'lucide-react';
import { useAnalytics } from '../hooks/useAnalytics';
import BrandWatermark from './BrandWatermark';

interface Lesson {
  id: string;
  title: string;
  culinaryPrinciple: string;
  codingApplication: string;
  scenario: string;
  keyTakeaways: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  readTime: number;
  tags: string[];
  publishDate: string;
  featured: boolean;
}

const lessons: Lesson[] = [
  {
    id: 'mise-en-place-architecture',
    title: 'Mise en Place: The Foundation of Clean Architecture',
    culinaryPrinciple: 'Mise en place ("everything in its place") is the culinary practice of organizing and arranging all ingredients and tools before cooking begins.',
    codingApplication: 'Just as a chef prepares ingredients before service, developers should structure their codebase, define interfaces, and organize dependencies before implementation.',
    scenario: 'During a high-pressure restaurant service, I learned that having every ingredient prepped and every tool in its designated spot meant the difference between smooth execution and chaos. This translates directly to software architecture.',
    keyTakeaways: [
      'Plan your project structure before writing code',
      'Define clear interfaces and contracts upfront',
      'Organize dependencies and imports systematically',
      'Establish coding standards and conventions early'
    ],
    difficulty: 'Beginner',
    readTime: 5,
    tags: ['Architecture', 'Planning', 'Organization'],
    publishDate: '2024-01-15',
    featured: true
  },
  {
    id: 'timing-coordination-async',
    title: 'Kitchen Timing: Mastering Asynchronous Operations',
    culinaryPrinciple: 'In professional kitchens, multiple dishes must be prepared simultaneously with precise timing to ensure everything arrives at the table together.',
    codingApplication: 'Asynchronous programming requires the same coordination skills - managing multiple operations that complete at different times while maintaining system harmony.',
    scenario: 'Coordinating a 12-course tasting menu taught me to think in parallel processes, manage dependencies, and handle unexpected delays - skills directly applicable to async/await patterns.',
    keyTakeaways: [
      'Map out operation dependencies before execution',
      'Build in error handling for timing failures',
      'Use Promise.all() like coordinating multiple stations',
      'Monitor and adjust timing based on real-world performance'
    ],
    difficulty: 'Intermediate',
    readTime: 7,
    tags: ['Async', 'Coordination', 'Performance'],
    publishDate: '2024-01-22',
    featured: true
  },
  {
    id: 'taste-testing-debugging',
    title: 'Taste as You Go: The Art of Continuous Debugging',
    culinaryPrinciple: 'Professional chefs constantly taste and adjust throughout the cooking process, never waiting until the end to check if something is right.',
    codingApplication: 'Debugging should be continuous, not an afterthought. Test small pieces, validate assumptions, and adjust course frequently during development.',
    scenario: 'A sauce that tastes perfect at the start can become oversalted after reduction. Similarly, code that works in isolation might break when integrated - constant testing prevents disasters.',
    keyTakeaways: [
      'Write tests as you develop, not after',
      'Use console.log() like tasting spoons',
      'Validate assumptions at each step',
      'Catch issues early when they\'re easier to fix'
    ],
    difficulty: 'Beginner',
    readTime: 4,
    tags: ['Testing', 'Debugging', 'Quality'],
    publishDate: '2024-02-05',
    featured: false
  },
  {
    id: 'brigade-system-teamwork',
    title: 'Brigade System: Building Effective Development Teams',
    culinaryPrinciple: 'The kitchen brigade system assigns specific roles and responsibilities, creating clear communication channels and accountability.',
    codingApplication: 'Software teams benefit from clear role definition, established communication protocols, and shared responsibility for the final product.',
    scenario: 'Working as a sous chef taught me how to coordinate specialists, manage handoffs between stations, and maintain quality standards across a team - essential skills for technical leadership.',
    keyTakeaways: [
      'Define clear roles and responsibilities',
      'Establish communication protocols',
      'Create systems for knowledge sharing',
      'Build accountability into team processes'
    ],
    difficulty: 'Advanced',
    readTime: 8,
    tags: ['Leadership', 'Teamwork', 'Communication'],
    publishDate: '2024-02-12',
    featured: true
  }
];

const KitchenLessons: React.FC = () => {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [filter, setFilter] = useState<'all' | 'featured' | 'beginner' | 'intermediate' | 'advanced'>('all');
  const { trackContentView, trackContentInteraction } = useAnalytics();

  useEffect(() => {
    trackContentView('kitchen-lessons', 'blog-section');
  }, [trackContentView]);

  const filteredLessons = lessons.filter(lesson => {
    if (filter === 'all') return true;
    if (filter === 'featured') return lesson.featured;
    return lesson.difficulty.toLowerCase() === filter;
  });

  const handleLessonClick = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    trackContentInteraction('lesson-open', lesson.id);
  };

  const handleCloseLesson = () => {
    setSelectedLesson(null);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-400';
      case 'Intermediate': return 'text-yellow-400';
      case 'Advanced': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <section id="kitchen-lessons" className="py-20 relative z-10">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <ChefHat className="w-8 h-8 text-[var(--brand-primary)]" />
            <Code className="w-8 h-8 text-[var(--brand-secondary)]" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6">
            Lessons from the Kitchen
          </h2>
          <p className="text-xl text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed">
            Bridging the gap between culinary discipline and coding excellence. 
            Discover how professional kitchen experience translates to better software development practices.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {[
            { key: 'all', label: 'All Lessons', icon: BookOpen },
            { key: 'featured', label: 'Featured', icon: Target },
            { key: 'beginner', label: 'Beginner', icon: Lightbulb },
            { key: 'intermediate', label: 'Intermediate', icon: Users },
            { key: 'advanced', label: 'Advanced', icon: ChefHat }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setFilter(key as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 ${
                filter === key
                  ? 'bg-[var(--brand-primary)] text-white shadow-lg'
                  : 'bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--brand-primary)]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </div>

        {/* Lessons Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredLessons.map((lesson) => (
            <div
              key={lesson.id}
              onClick={() => handleLessonClick(lesson)}
              className="group bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:border-[var(--brand-primary)] hover:shadow-xl hover:shadow-[var(--brand-primary)]/20 hover:-translate-y-2"
            >
              {/* Lesson Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-semibold ${getDifficultyColor(lesson.difficulty)}`}>
                    {lesson.difficulty}
                  </span>
                  {lesson.featured && (
                    <span className="bg-[var(--brand-accent)] text-white text-xs px-2 py-1 rounded-full">
                      Featured
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-[var(--text-muted)] text-sm">
                  <Clock className="w-4 h-4" />
                  <span>{lesson.readTime} min</span>
                </div>
              </div>

              {/* Lesson Title */}
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3 group-hover:text-[var(--brand-primary)] transition-colors">
                {lesson.title}
              </h3>

              {/* Lesson Preview */}
              <p className="text-[var(--text-secondary)] mb-4 line-clamp-3">
                {lesson.culinaryPrinciple}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {lesson.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="bg-[var(--border-secondary)] text-[var(--text-muted)] text-xs px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Read More */}
              <div className="flex items-center justify-between">
                <span className="text-[var(--text-muted)] text-sm">
                  {new Date(lesson.publishDate).toLocaleDateString()}
                </span>
                <div className="flex items-center gap-1 text-[var(--brand-primary)] font-medium group-hover:gap-2 transition-all">
                  <span>Read More</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl p-8 max-w-2xl mx-auto">
            <ChefHat className="w-12 h-12 text-[var(--brand-primary)] mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
              More Lessons Coming Soon
            </h3>
            <p className="text-[var(--text-secondary)] mb-6">
              I'm constantly drawing new connections between culinary arts and software development. 
              Subscribe to get notified when new lessons are published.
            </p>
            <button className="bg-[var(--brand-primary)] text-white px-8 py-3 rounded-full font-semibold hover:bg-[var(--brand-secondary)] transition-colors">
              Stay Updated
            </button>
          </div>
        </div>
      </div>

      {/* Lesson Modal */}
      {selectedLesson && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl max-w-4xl max-h-[90vh] overflow-y-auto relative">
            <BrandWatermark variant="logo" opacity={0.03} size="medium" position="bottom-right" />
            {/* Modal Header */}
            <div className="sticky top-0 bg-[var(--glass-bg)] border-b border-[var(--glass-border)] p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`text-sm font-semibold ${getDifficultyColor(selectedLesson.difficulty)}`}>
                      {selectedLesson.difficulty}
                    </span>
                    <div className="flex items-center gap-1 text-[var(--text-muted)] text-sm">
                      <Clock className="w-4 h-4" />
                      <span>{selectedLesson.readTime} min read</span>
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold text-[var(--text-primary)]">
                    {selectedLesson.title}
                  </h2>
                </div>
                <button
                  onClick={handleCloseLesson}
                  className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-8">
              {/* Culinary Principle */}
              <div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                  <ChefHat className="w-5 h-5 text-[var(--brand-primary)]" />
                  The Culinary Principle
                </h3>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  {selectedLesson.culinaryPrinciple}
                </p>
              </div>

              {/* Coding Application */}
              <div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                  <Code className="w-5 h-5 text-[var(--brand-secondary)]" />
                  The Coding Application
                </h3>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  {selectedLesson.codingApplication}
                </p>
              </div>

              {/* Real-World Scenario */}
              <div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">
                  Real-World Scenario
                </h3>
                <p className="text-[var(--text-secondary)] leading-relaxed italic">
                  {selectedLesson.scenario}
                </p>
              </div>

              {/* Key Takeaways */}
              <div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-[var(--brand-accent)]" />
                  Key Takeaways
                </h3>
                <ul className="space-y-2">
                  {selectedLesson.keyTakeaways.map((takeaway, index) => (
                    <li key={index} className="flex items-start gap-3 text-[var(--text-secondary)]">
                      <span className="w-2 h-2 bg-[var(--brand-primary)] rounded-full mt-2 flex-shrink-0" />
                      <span>{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tags */}
              <div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">
                  Topics Covered
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedLesson.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default KitchenLessons;