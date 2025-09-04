'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Clock, 
  Users, 
  Star, 
  Filter, 
  Search, 
  Play,
  Award,
  TrendingUp,
  Brain,
  Target,
  ChevronRight,
  GraduationCap
} from 'lucide-react';
import { useAIOrchestrator } from '@straydog/ai-orchestrator';

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const { generateResponse, isLoading } = useAIOrchestrator();

  const categories = [
    { id: 'all', name: 'All Courses' },
    { id: 'mathematics', name: 'Mathematics' },
    { id: 'science', name: 'Science' },
    { id: 'programming', name: 'Programming' },
    { id: 'languages', name: 'Languages' },
    { id: 'arts', name: 'Arts & Humanities' }
  ];

  const levels = [
    { id: 'all', name: 'All Levels' },
    { id: 'beginner', name: 'Beginner' },
    { id: 'intermediate', name: 'Intermediate' },
    { id: 'advanced', name: 'Advanced' }
  ];

  const courses = [
    {
      id: 1,
      title: 'Introduction to Machine Learning',
      category: 'programming',
      level: 'intermediate',
      instructor: 'Dr. Sarah Chen',
      duration: '8 weeks',
      students: 2847,
      rating: 4.9,
      price: 'Free',
      description: 'Learn the fundamentals of machine learning with hands-on projects and AI-guided tutorials.',
      skills: ['Python', 'TensorFlow', 'Data Analysis', 'Neural Networks'],
      progress: 0
    },
    {
      id: 2,
      title: 'Calculus Mastery',
      category: 'mathematics',
      level: 'advanced',
      instructor: 'Prof. Michael Rodriguez',
      duration: '12 weeks',
      students: 1923,
      rating: 4.8,
      price: '$49',
      description: 'Master calculus concepts with AI-powered problem solving and personalized practice.',
      skills: ['Derivatives', 'Integrals', 'Limits', 'Applications'],
      progress: 0
    },
    {
      id: 3,
      title: 'Spanish Conversation',
      category: 'languages',
      level: 'beginner',
      instructor: 'Maria Gonzalez',
      duration: '6 weeks',
      students: 3456,
      rating: 4.7,
      price: '$29',
      description: 'Practice Spanish conversation with AI tutors and native speakers.',
      skills: ['Speaking', 'Listening', 'Grammar', 'Vocabulary'],
      progress: 0
    },
    {
      id: 4,
      title: 'Quantum Physics Fundamentals',
      category: 'science',
      level: 'advanced',
      instructor: 'Dr. James Wilson',
      duration: '10 weeks',
      students: 1234,
      rating: 4.9,
      price: '$79',
      description: 'Explore quantum mechanics with interactive simulations and AI explanations.',
      skills: ['Wave Functions', 'Uncertainty Principle', 'Quantum States', 'Entanglement'],
      progress: 0
    },
    {
      id: 5,
      title: 'Creative Writing Workshop',
      category: 'arts',
      level: 'intermediate',
      instructor: 'Emma Thompson',
      duration: '8 weeks',
      students: 2156,
      rating: 4.6,
      price: '$39',
      description: 'Develop your writing skills with AI feedback and peer collaboration.',
      skills: ['Storytelling', 'Character Development', 'Plot Structure', 'Style'],
      progress: 0
    },
    {
      id: 6,
      title: 'Data Structures & Algorithms',
      category: 'programming',
      level: 'intermediate',
      instructor: 'Alex Kumar',
      duration: '10 weeks',
      students: 4321,
      rating: 4.8,
      price: '$59',
      description: 'Master essential programming concepts with AI-guided coding practice.',
      skills: ['Arrays', 'Trees', 'Graphs', 'Sorting', 'Searching'],
      progress: 0
    }
  ];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const handleCourseRecommendation = async () => {
    try {
      await generateResponse(
        'Recommend personalized courses based on my learning goals and current skill level. Consider my interests in technology, science, and personal development.',
        'education'
      );
    } catch (error) {
      console.error('Course recommendation failed:', error);
    }
  };

  const handleCourseAnalysis = async (course: any) => {
    try {
      await generateResponse(
        `Analyze this course: "${course.title}". Explain what I'll learn, the difficulty level, and how it fits into a broader learning path. Also suggest prerequisite knowledge and follow-up courses.`,
        'education'
      );
    } catch (error) {
      console.error('Course analysis failed:', error);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="glass-card m-6 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <GraduationCap className="h-8 w-8 text-education-wisdom" />
            <span className="text-xl font-bold gradient-text">StrayDog Education</span>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <a href="/" className="hover:text-education-wisdom transition-colors">Home</a>
            <a href="/courses" className="text-education-wisdom">Courses</a>
            <a href="/tutoring" className="hover:text-education-wisdom transition-colors">AI Tutoring</a>
            <a href="/progress" className="hover:text-education-wisdom transition-colors">Progress</a>
          </div>
          <button className="tutor-button">
            My Learning
          </button>
        </div>
      </nav>

      {/* Header */}
      <section className="px-6 py-12">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Discover Your Next{' '}
            <span className="gradient-text">Learning Adventure</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Explore our comprehensive course catalog with AI-powered recommendations 
            tailored to your learning goals and interests.
          </p>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="glass-card p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search courses, topics, or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-education-wisdom"
                />
              </div>
              
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                aria-label="Filter courses by category"
                className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-education-wisdom"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id} className="bg-hunter-900">
                    {category.name}
                  </option>
                ))}
              </select>
              
              {/* Level Filter */}
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                aria-label="Filter courses by difficulty level"
                className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-education-wisdom"
              >
                {levels.map(level => (
                  <option key={level.id} value={level.id} className="bg-hunter-900">
                    {level.name}
                  </option>
                ))}
              </select>
              
              {/* AI Recommendation Button */}
              <button
                onClick={handleCourseRecommendation}
                disabled={isLoading}
                className="tutor-button flex items-center space-x-2"
              >
                <Brain className="h-5 w-5" />
                <span>{isLoading ? 'Analyzing...' : 'AI Recommend'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Course Grid */}
      <section className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">
              {filteredCourses.length} Course{filteredCourses.length !== 1 ? 's' : ''} Found
            </h2>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Filter className="h-4 w-4" />
              <span>Sorted by relevance</span>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="education-card group cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5 text-education-wisdom" />
                    <span className="text-sm text-education-wisdom capitalize">{course.category}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm">{course.rating}</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold mb-2 group-hover:text-education-wisdom transition-colors">
                  {course.title}
                </h3>
                
                <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                  {course.description}
                </p>
                
                <div className="flex items-center space-x-4 text-sm text-gray-400 mb-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{course.students.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Target className="h-4 w-4" />
                    <span className="capitalize">{course.level}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {course.skills.slice(0, 3).map(skill => (
                    <span key={skill} className="px-2 py-1 bg-education-wisdom/20 text-education-wisdom text-xs rounded">
                      {skill}
                    </span>
                  ))}
                  {course.skills.length > 3 && (
                    <span className="px-2 py-1 bg-gray-600/20 text-gray-400 text-xs rounded">
                      +{course.skills.length - 3} more
                    </span>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-education-wisdom">{course.price}</span>
                    <span className="text-sm text-gray-400">by {course.instructor}</span>
                  </div>
                  <button
                    onClick={() => handleCourseAnalysis(course)}
                    disabled={isLoading}
                    className="glass-button px-3 py-2 text-sm flex items-center space-x-1"
                  >
                    <Brain className="h-4 w-4" />
                    <span>Analyze</span>
                  </button>
                </div>
                
                <div className="mt-4 pt-4 border-t border-white/10">
                  <button className="w-full tutor-button flex items-center justify-center space-x-2">
                    <Play className="h-4 w-4" />
                    <span>Start Learning</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
          
          {filteredCourses.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No courses found</h3>
              <p className="text-gray-400 mb-6">Try adjusting your search criteria or explore our recommendations.</p>
              <button
                onClick={handleCourseRecommendation}
                disabled={isLoading}
                className="tutor-button flex items-center space-x-2 mx-auto"
              >
                <Brain className="h-5 w-5" />
                <span>Get AI Recommendations</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Learning Path Suggestion */}
      <section className="px-6 py-16 bg-black/20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="education-card">
            <TrendingUp className="h-16 w-16 text-education-wisdom mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Create Your Learning Path</h2>
            <p className="text-gray-300 mb-8">
              Let our AI analyze your interests and create a personalized learning journey 
              that connects multiple courses for maximum impact.
            </p>
            <button
              onClick={handleCourseRecommendation}
              disabled={isLoading}
              className="tutor-button flex items-center space-x-2 mx-auto"
            >
              <Award className="h-5 w-5" />
              <span>{isLoading ? 'Creating Path...' : 'Build My Path'}</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}