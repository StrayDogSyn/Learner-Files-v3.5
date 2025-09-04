'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Brain, 
  Target, 
  Users, 
  Award, 
  TrendingUp, 
  Sparkles, 
  Play,
  ChevronRight,
  GraduationCap,
  Lightbulb,
  BarChart3
} from 'lucide-react';
import { useAIOrchestrator } from '@straydog/ai-orchestrator';

export default function EducationHome() {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [learningGoal, setLearningGoal] = useState('');
  const { generateResponse, isLoading } = useAIOrchestrator();

  const subjects = [
    {
      id: 'mathematics',
      name: 'Mathematics',
      icon: BarChart3,
      description: 'From basic arithmetic to advanced calculus',
      color: 'education-wisdom',
      students: '12.5K',
      difficulty: 'All Levels'
    },
    {
      id: 'science',
      name: 'Science',
      icon: Brain,
      description: 'Physics, Chemistry, Biology, and more',
      color: 'education-insight',
      students: '8.3K',
      difficulty: 'Beginner to Advanced'
    },
    {
      id: 'programming',
      name: 'Programming',
      icon: Target,
      description: 'Learn coding with AI-powered guidance',
      color: 'education-discovery',
      students: '15.7K',
      difficulty: 'All Levels'
    },
    {
      id: 'languages',
      name: 'Languages',
      icon: Users,
      description: 'Master new languages with personalized lessons',
      color: 'education-growth',
      students: '9.2K',
      difficulty: 'Beginner to Fluent'
    }
  ];

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Tutoring',
      description: 'Get personalized explanations and guidance from our advanced AI tutor that adapts to your learning style.',
      demo: 'Ask me to explain quantum physics in simple terms'
    },
    {
      icon: Target,
      title: 'Adaptive Learning Paths',
      description: 'Dynamic curriculum that adjusts based on your progress, strengths, and areas for improvement.',
      demo: 'Create a learning path for machine learning basics'
    },
    {
      icon: Award,
      title: 'Intelligent Assessment',
      description: 'Smart quizzes and tests that evaluate understanding and provide detailed feedback.',
      demo: 'Generate a quiz on photosynthesis with explanations'
    },
    {
      icon: TrendingUp,
      title: 'Progress Analytics',
      description: 'Detailed insights into your learning journey with recommendations for improvement.',
      demo: 'Analyze my learning patterns and suggest improvements'
    }
  ];

  const stats = [
    { label: 'Active Learners', value: '45.2K', change: '+12%' },
    { label: 'Courses Completed', value: '128K', change: '+8%' },
    { label: 'AI Tutoring Sessions', value: '892K', change: '+25%' },
    { label: 'Success Rate', value: '94%', change: '+3%' }
  ];

  const handleFeatureDemo = async (demo: string) => {
    try {
      await generateResponse(demo, 'education');
    } catch (error) {
      console.error('Demo failed:', error);
    }
  };

  const handlePersonalizedLearning = async () => {
    if (!learningGoal.trim()) return;
    
    try {
      await generateResponse(
        `Create a personalized learning plan for: ${learningGoal}. Include specific topics, timeline, and recommended resources.`,
        'education'
      );
    } catch (error) {
      console.error('Learning plan generation failed:', error);
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
            <a href="#courses" className="hover:text-education-wisdom transition-colors">Courses</a>
            <a href="#tutoring" className="hover:text-education-wisdom transition-colors">AI Tutoring</a>
            <a href="#progress" className="hover:text-education-wisdom transition-colors">Progress</a>
            <a href="#community" className="hover:text-education-wisdom transition-colors">Community</a>
          </div>
          <button className="tutor-button">
            Start Learning
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Learn Smarter with{' '}
            <span className="gradient-text">AI-Powered Education</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Experience personalized learning like never before. Our AI tutor adapts to your pace, 
            identifies your strengths, and guides you toward mastery.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="tutor-button flex items-center space-x-2">
              <Play className="h-5 w-5" />
              <span>Start Free Trial</span>
            </button>
            <button className="glass-button px-6 py-3 flex items-center space-x-2">
              <Lightbulb className="h-5 w-5" />
              <span>See How It Works</span>
            </button>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="px-6 py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="education-card text-center"
            >
              <div className="text-3xl font-bold text-education-wisdom mb-2">{stat.value}</div>
              <div className="text-gray-300 mb-1">{stat.label}</div>
              <div className="text-sm text-education-growth">{stat.change} this month</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Subjects Section */}
      <section id="courses" className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Choose Your Learning Path</h2>
            <p className="text-xl text-gray-300">Explore our comprehensive subjects with AI-guided learning</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {subjects.map((subject, index) => {
              const IconComponent = subject.icon;
              return (
                <motion.div
                  key={subject.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`education-card cursor-pointer ${
                    selectedSubject === subject.id ? 'ring-2 ring-education-wisdom' : ''
                  }`}
                  onClick={() => setSelectedSubject(subject.id)}
                >
                  <IconComponent className={`h-12 w-12 text-${subject.color} mb-4`} />
                  <h3 className="text-xl font-semibold mb-2">{subject.name}</h3>
                  <p className="text-gray-300 text-sm mb-4">{subject.description}</p>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>{subject.students} students</span>
                    <span>{subject.difficulty}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* AI Features Section */}
      <section id="tutoring" className="px-6 py-16 bg-black/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">AI-Powered Learning Features</h2>
            <p className="text-xl text-gray-300">Experience the future of education with intelligent tutoring</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="education-card"
                >
                  <div className="flex items-start space-x-4">
                    <IconComponent className="h-8 w-8 text-education-wisdom flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-gray-300 mb-4">{feature.description}</p>
                      <button
                        onClick={() => handleFeatureDemo(feature.demo)}
                        disabled={isLoading}
                        className="tutor-button text-sm flex items-center space-x-2"
                      >
                        <Sparkles className="h-4 w-4" />
                        <span>{isLoading ? 'Generating...' : 'Try Demo'}</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Personalized Learning Section */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="education-card text-center">
            <Brain className="h-16 w-16 text-education-wisdom mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Get Your Personalized Learning Plan</h2>
            <p className="text-gray-300 mb-8">
              Tell us what you want to learn, and our AI will create a customized curriculum just for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="e.g., Learn Python programming for data science"
                value={learningGoal}
                onChange={(e) => setLearningGoal(e.target.value)}
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-education-wisdom"
              />
              <button
                onClick={handlePersonalizedLearning}
                disabled={isLoading || !learningGoal.trim()}
                className="tutor-button flex items-center space-x-2"
              >
                <Target className="h-5 w-5" />
                <span>{isLoading ? 'Creating...' : 'Create Plan'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-16 bg-gradient-to-r from-education-wisdom/20 to-education-insight/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Learning?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of learners who are already experiencing the power of AI-driven education.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="tutor-button flex items-center space-x-2">
              <GraduationCap className="h-5 w-5" />
              <span>Start Learning Today</span>
              <ChevronRight className="h-5 w-5" />
            </button>
            <button className="glass-button px-6 py-3">
              Schedule a Demo
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}