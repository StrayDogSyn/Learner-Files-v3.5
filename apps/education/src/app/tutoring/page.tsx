'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  MessageCircle, 
  Video, 
  FileText, 
  Calculator,
  Code,
  Globe,
  Palette,
  Microscope,
  BookOpen,
  Clock,
  Star,
  Users,
  Play,
  Pause,
  RotateCcw,
  Send,
  Mic,
  Camera,
  Share,
  Award,
  Target,
  TrendingUp,
  GraduationCap
} from 'lucide-react';
import { useAIOrchestrator } from '@straydog/ai-orchestrator';

export default function TutoringPage() {
  const [selectedSubject, setSelectedSubject] = useState('mathematics');
  const [sessionType, setSessionType] = useState('chat');
  const [question, setQuestion] = useState('');
  const [isSessionActive, setIsSessionActive] = useState(false);
  const { generateResponse, isLoading } = useAIOrchestrator();

  const subjects = [
    {
      id: 'mathematics',
      name: 'Mathematics',
      icon: Calculator,
      color: 'text-blue-400',
      description: 'Algebra, Calculus, Statistics, Geometry'
    },
    {
      id: 'programming',
      name: 'Programming',
      icon: Code,
      color: 'text-green-400',
      description: 'Python, JavaScript, Java, C++, Data Structures'
    },
    {
      id: 'science',
      name: 'Science',
      icon: Microscope,
      color: 'text-purple-400',
      description: 'Physics, Chemistry, Biology, Earth Science'
    },
    {
      id: 'languages',
      name: 'Languages',
      icon: Globe,
      color: 'text-yellow-400',
      description: 'English, Spanish, French, Mandarin'
    },
    {
      id: 'arts',
      name: 'Arts & Humanities',
      icon: Palette,
      color: 'text-pink-400',
      description: 'Literature, History, Philosophy, Creative Writing'
    }
  ];

  const sessionTypes = [
    {
      id: 'chat',
      name: 'Text Chat',
      icon: MessageCircle,
      description: 'Ask questions and get detailed explanations'
    },
    {
      id: 'video',
      name: 'Video Session',
      icon: Video,
      description: 'Interactive video tutoring with screen sharing'
    },
    {
      id: 'practice',
      name: 'Practice Problems',
      icon: FileText,
      description: 'Solve problems with step-by-step guidance'
    }
  ];

  const recentSessions = [
    {
      id: 1,
      subject: 'Mathematics',
      topic: 'Quadratic Equations',
      duration: '45 min',
      rating: 4.9,
      date: '2 hours ago'
    },
    {
      id: 2,
      subject: 'Programming',
      topic: 'React Hooks',
      duration: '30 min',
      rating: 4.8,
      date: '1 day ago'
    },
    {
      id: 3,
      subject: 'Science',
      topic: 'Organic Chemistry',
      duration: '60 min',
      rating: 4.7,
      date: '3 days ago'
    }
  ];

  const handleStartSession = async () => {
    if (!question.trim()) return;
    
    setIsSessionActive(true);
    try {
      await generateResponse(
        `I need help with ${selectedSubject}. My question is: ${question}. Please provide a detailed explanation with examples and guide me through the solution step by step.`,
        'education'
      );
    } catch (error) {
      console.error('Tutoring session failed:', error);
      setIsSessionActive(false);
    }
  };

  const handleSubjectHelp = async (subject: string) => {
    try {
      await generateResponse(
        `I want to start learning ${subject}. Can you assess my current level, suggest a learning path, and provide some practice problems to get started?`,
        'education'
      );
    } catch (error) {
      console.error('Subject help failed:', error);
    }
  };

  const handlePracticeProblems = async () => {
    try {
      await generateResponse(
        `Generate 3 practice problems for ${selectedSubject} at an intermediate level. Include solutions and explanations for each problem.`,
        'education'
      );
    } catch (error) {
      console.error('Practice problems generation failed:', error);
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
            <a href="/courses" className="hover:text-education-wisdom transition-colors">Courses</a>
            <a href="/tutoring" className="text-education-wisdom">AI Tutoring</a>
            <a href="/progress" className="hover:text-education-wisdom transition-colors">Progress</a>
          </div>
          <button className="tutor-button">
            My Sessions
          </button>
        </div>
      </nav>

      {/* Header */}
      <section className="px-6 py-12">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Your Personal{' '}
            <span className="gradient-text">AI Tutor</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Get instant help, personalized explanations, and guided practice 
            across all subjects with our advanced AI tutoring system.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Subject Selection */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-education-wisdom" />
                <span>Choose Subject</span>
              </h3>
              <div className="space-y-3">
                {subjects.map(subject => {
                  const IconComponent = subject.icon;
                  return (
                    <button
                      key={subject.id}
                      onClick={() => setSelectedSubject(subject.id)}
                      className={`w-full p-4 rounded-lg border transition-all ${
                        selectedSubject === subject.id
                          ? 'border-education-wisdom bg-education-wisdom/10'
                          : 'border-white/20 hover:border-white/40'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <IconComponent className={`h-6 w-6 ${subject.color} flex-shrink-0 mt-1`} />
                        <div className="text-left">
                          <h4 className="font-semibold">{subject.name}</h4>
                          <p className="text-sm text-gray-400 mt-1">{subject.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Session Types */}
            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                <Video className="h-5 w-5 text-education-wisdom" />
                <span>Session Type</span>
              </h3>
              <div className="space-y-3">
                {sessionTypes.map(type => {
                  const IconComponent = type.icon;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setSessionType(type.id)}
                      className={`w-full p-3 rounded-lg border transition-all ${
                        sessionType === type.id
                          ? 'border-education-wisdom bg-education-wisdom/10'
                          : 'border-white/20 hover:border-white/40'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <IconComponent className="h-5 w-5 text-education-wisdom" />
                        <div className="text-left">
                          <h4 className="font-medium">{type.name}</h4>
                          <p className="text-xs text-gray-400">{type.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content - Tutoring Interface */}
          <div className="lg:col-span-2">
            <div className="glass-card p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center space-x-2">
                  <Brain className="h-6 w-6 text-education-wisdom" />
                  <span>AI Tutoring Session</span>
                </h2>
                <div className="flex items-center space-x-2">
                  {isSessionActive && (
                    <div className="flex items-center space-x-2 text-green-400">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-sm">Session Active</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Question Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">What would you like help with?</label>
                <div className="flex space-x-3">
                  <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder={`Ask me anything about ${subjects.find(s => s.id === selectedSubject)?.name.toLowerCase()}...`}
                    className="flex-1 p-4 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-education-wisdom resize-none"
                    rows={3}
                  />
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={handleStartSession}
                      disabled={isLoading || !question.trim()}
                      className="tutor-button p-3 flex items-center justify-center"
                      title="Send question to AI tutor"
                    >
                      {isLoading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      ) : (
                        <Send className="h-5 w-5" />
                      )}
                    </button>
                    <button className="glass-button p-3" title="Record voice question">
                      <Mic className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <button
                  onClick={() => handleSubjectHelp(selectedSubject)}
                  disabled={isLoading}
                  className="glass-button p-4 flex items-center space-x-3"
                >
                  <Target className="h-5 w-5 text-education-wisdom" />
                  <span>Get Started</span>
                </button>
                <button
                  onClick={handlePracticeProblems}
                  disabled={isLoading}
                  className="glass-button p-4 flex items-center space-x-3"
                >
                  <FileText className="h-5 w-5 text-education-wisdom" />
                  <span>Practice Problems</span>
                </button>
                <button className="glass-button p-4 flex items-center space-x-3">
                  <Camera className="h-5 w-5 text-education-wisdom" />
                  <span>Upload Problem</span>
                </button>
              </div>

              {/* Session Controls */}
              {sessionType === 'video' && (
                <div className="flex items-center justify-center space-x-4 p-6 bg-black/20 rounded-lg">
                  <button className="glass-button p-3" title="Play video session">
                    <Play className="h-5 w-5" />
                  </button>
                  <button className="glass-button p-3" title="Pause video session">
                    <Pause className="h-5 w-5" />
                  </button>
                  <button className="glass-button p-3" title="Restart video session">
                    <RotateCcw className="h-5 w-5" />
                  </button>
                  <button className="glass-button p-3" title="Share video session">
                    <Share className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Recent Sessions */}
            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                <Clock className="h-5 w-5 text-education-wisdom" />
                <span>Recent Sessions</span>
              </h3>
              <div className="space-y-4">
                {recentSessions.map(session => (
                  <div key={session.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-education-wisdom/20 rounded-lg flex items-center justify-center">
                        <BookOpen className="h-6 w-6 text-education-wisdom" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{session.topic}</h4>
                        <p className="text-sm text-gray-400">{session.subject} • {session.duration}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm">{session.rating}</span>
                      </div>
                      <span className="text-sm text-gray-400">{session.date}</span>
                      <button className="glass-button px-3 py-1 text-sm">
                        Review
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <section className="px-6 py-16 bg-black/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="education-card text-center">
              <Users className="h-12 w-12 text-education-wisdom mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">50K+</h3>
              <p className="text-gray-300">Students Helped</p>
            </div>
            <div className="education-card text-center">
              <Clock className="h-12 w-12 text-education-wisdom mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">24/7</h3>
              <p className="text-gray-300">Available Support</p>
            </div>
            <div className="education-card text-center">
              <Award className="h-12 w-12 text-education-wisdom mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">98%</h3>
              <p className="text-gray-300">Success Rate</p>
            </div>
            <div className="education-card text-center">
              <TrendingUp className="h-12 w-12 text-education-wisdom mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">4.9</h3>
              <p className="text-gray-300">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="education-card">
            <Brain className="h-16 w-16 text-education-wisdom mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Ready to Excel?</h2>
            <p className="text-gray-300 mb-8">
              Join thousands of students who have improved their grades and understanding 
              with our AI-powered tutoring system.
            </p>
            <button
              onClick={() => handleSubjectHelp(selectedSubject)}
              disabled={isLoading}
              className="tutor-button flex items-center space-x-2 mx-auto"
            >
              <Play className="h-5 w-5" />
              <span>{isLoading ? 'Starting...' : 'Start Free Session'}</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}