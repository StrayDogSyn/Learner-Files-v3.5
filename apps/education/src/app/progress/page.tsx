'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Award, 
  Target, 
  Clock, 
  Brain,
  BookOpen,
  Star,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Trophy,
  Flame,
  CheckCircle,
  Circle,
  ArrowUp,
  ArrowDown,
  Users,
  Zap,
  GraduationCap,
  ChevronRight
} from 'lucide-react';
import { useAIOrchestrator } from '@straydog/ai-orchestrator';

export default function ProgressPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const { generateResponse, isLoading } = useAIOrchestrator();

  const periods = [
    { id: 'week', name: 'This Week' },
    { id: 'month', name: 'This Month' },
    { id: 'quarter', name: 'This Quarter' },
    { id: 'year', name: 'This Year' }
  ];

  const subjects = [
    { id: 'all', name: 'All Subjects' },
    { id: 'mathematics', name: 'Mathematics' },
    { id: 'programming', name: 'Programming' },
    { id: 'science', name: 'Science' },
    { id: 'languages', name: 'Languages' }
  ];

  const achievements = [
    {
      id: 1,
      title: 'Problem Solver',
      description: 'Solved 100 math problems',
      icon: Target,
      earned: true,
      date: '2024-01-15',
      rarity: 'common'
    },
    {
      id: 2,
      title: 'Code Master',
      description: 'Completed 10 programming courses',
      icon: Brain,
      earned: true,
      date: '2024-01-10',
      rarity: 'rare'
    },
    {
      id: 3,
      title: 'Streak Champion',
      description: 'Maintained 30-day learning streak',
      icon: Flame,
      earned: false,
      progress: 23,
      total: 30,
      rarity: 'epic'
    },
    {
      id: 4,
      title: 'AI Collaborator',
      description: 'Had 50 AI tutoring sessions',
      icon: Zap,
      earned: false,
      progress: 34,
      total: 50,
      rarity: 'legendary'
    }
  ];

  const learningStats = {
    totalHours: 127,
    coursesCompleted: 8,
    currentStreak: 23,
    averageScore: 87,
    weeklyGoal: 10,
    weeklyProgress: 7.5
  };

  const subjectProgress = [
    {
      subject: 'Mathematics',
      progress: 78,
      timeSpent: 45,
      improvement: 12,
      color: 'bg-blue-500'
    },
    {
      subject: 'Programming',
      progress: 92,
      timeSpent: 38,
      improvement: 8,
      color: 'bg-green-500'
    },
    {
      subject: 'Science',
      progress: 65,
      timeSpent: 28,
      improvement: -3,
      color: 'bg-purple-500'
    },
    {
      subject: 'Languages',
      progress: 84,
      timeSpent: 16,
      improvement: 15,
      color: 'bg-yellow-500'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'course_completed',
      title: 'Completed "Advanced Calculus"',
      time: '2 hours ago',
      score: 94
    },
    {
      id: 2,
      type: 'achievement_earned',
      title: 'Earned "Problem Solver" badge',
      time: '1 day ago'
    },
    {
      id: 3,
      type: 'tutoring_session',
      title: 'AI Tutoring: Quantum Physics',
      time: '2 days ago',
      duration: '45 min'
    },
    {
      id: 4,
      type: 'quiz_completed',
      title: 'JavaScript Fundamentals Quiz',
      time: '3 days ago',
      score: 88
    }
  ];

  const weeklyData = [
    { day: 'Mon', hours: 2.5, completed: 3 },
    { day: 'Tue', hours: 1.8, completed: 2 },
    { day: 'Wed', hours: 3.2, completed: 4 },
    { day: 'Thu', hours: 2.1, completed: 2 },
    { day: 'Fri', hours: 1.5, completed: 1 },
    { day: 'Sat', hours: 0, completed: 0 },
    { day: 'Sun', hours: 0, completed: 0 }
  ];

  const handleProgressAnalysis = async () => {
    try {
      await generateResponse(
        `Analyze my learning progress and provide personalized insights. My stats: ${learningStats.totalHours} total hours, ${learningStats.coursesCompleted} courses completed, ${learningStats.currentStreak} day streak, ${learningStats.averageScore}% average score. Suggest areas for improvement and next learning goals.`,
        'education'
      );
    } catch (error) {
      console.error('Progress analysis failed:', error);
    }
  };

  const handleGoalSetting = async () => {
    try {
      await generateResponse(
        'Help me set realistic and achievable learning goals for the next month based on my current progress and learning patterns. Consider my strengths and areas that need improvement.',
        'education'
      );
    } catch (error) {
      console.error('Goal setting failed:', error);
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400';
      case 'rare': return 'text-blue-400';
      case 'epic': return 'text-purple-400';
      case 'legendary': return 'text-yellow-400';
      default: return 'text-gray-400';
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
            <a href="/tutoring" className="hover:text-education-wisdom transition-colors">AI Tutoring</a>
            <a href="/progress" className="text-education-wisdom">Progress</a>
          </div>
          <button className="tutor-button">
            Export Report
          </button>
        </div>
      </nav>

      {/* Header */}
      <section className="px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                Your Learning{' '}
                <span className="gradient-text">Journey</span>
              </h1>
              <p className="text-xl text-gray-300">
                Track your progress, celebrate achievements, and optimize your learning path.
              </p>
            </div>
            <div className="mt-6 md:mt-0 flex space-x-4">
              <button
                onClick={handleProgressAnalysis}
                disabled={isLoading}
                className="tutor-button flex items-center space-x-2"
              >
                <Brain className="h-5 w-5" />
                <span>{isLoading ? 'Analyzing...' : 'AI Analysis'}</span>
              </button>
              <button
                onClick={handleGoalSetting}
                disabled={isLoading}
                className="glass-button flex items-center space-x-2"
              >
                <Target className="h-5 w-5" />
                <span>Set Goals</span>
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-education-wisdom" />
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                aria-label="Filter progress by time period"
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-education-wisdom"
              >
                {periods.map(period => (
                  <option key={period.id} value={period.id} className="bg-hunter-900">
                    {period.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-education-wisdom" />
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                aria-label="Filter progress by subject"
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-education-wisdom"
              >
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.id} className="bg-hunter-900">
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="education-card">
            <div className="flex items-center justify-between mb-4">
              <Clock className="h-8 w-8 text-education-wisdom" />
              <span className="text-2xl font-bold">{learningStats.totalHours}h</span>
            </div>
            <h3 className="font-semibold mb-1">Total Learning Time</h3>
            <p className="text-sm text-gray-400">+12h this week</p>
          </div>
          
          <div className="education-card">
            <div className="flex items-center justify-between mb-4">
              <Trophy className="h-8 w-8 text-education-wisdom" />
              <span className="text-2xl font-bold">{learningStats.coursesCompleted}</span>
            </div>
            <h3 className="font-semibold mb-1">Courses Completed</h3>
            <p className="text-sm text-gray-400">2 this month</p>
          </div>
          
          <div className="education-card">
            <div className="flex items-center justify-between mb-4">
              <Flame className="h-8 w-8 text-orange-400" />
              <span className="text-2xl font-bold">{learningStats.currentStreak}</span>
            </div>
            <h3 className="font-semibold mb-1">Day Streak</h3>
            <p className="text-sm text-gray-400">Personal best!</p>
          </div>
          
          <div className="education-card">
            <div className="flex items-center justify-between mb-4">
              <Star className="h-8 w-8 text-yellow-400" />
              <span className="text-2xl font-bold">{learningStats.averageScore}%</span>
            </div>
            <h3 className="font-semibold mb-1">Average Score</h3>
            <p className="text-sm text-green-400 flex items-center">
              <ArrowUp className="h-4 w-4 mr-1" />
              +5% improvement
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Weekly Progress */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-education-wisdom" />
                  <span>Weekly Activity</span>
                </h3>
                <div className="text-sm text-gray-400">
                  Goal: {learningStats.weeklyGoal}h | Progress: {learningStats.weeklyProgress}h
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Weekly Goal Progress</span>
                  <span>{Math.round((learningStats.weeklyProgress / learningStats.weeklyGoal) * 100)}%</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${Math.min((learningStats.weeklyProgress / learningStats.weeklyGoal) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="grid grid-cols-7 gap-2">
                {weeklyData.map((day, index) => (
                  <div key={day.day} className="text-center">
                    <div className="text-xs text-gray-400 mb-2">{day.day}</div>
                    <div className="weekly-chart-container">
                      <div 
                        className="weekly-chart-bar"
                        style={{ height: `${(day.hours / 4) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-xs">{day.hours}h</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Subject Progress */}
            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold mb-6 flex items-center space-x-2">
                <PieChart className="h-5 w-5 text-education-wisdom" />
                <span>Subject Progress</span>
              </h3>
              
              <div className="space-y-4">
                {subjectProgress.map(subject => (
                  <div key={subject.subject} className="">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{subject.subject}</span>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-gray-400">{subject.timeSpent}h</span>
                        <div className={`flex items-center space-x-1 ${
                          subject.improvement >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {subject.improvement >= 0 ? (
                            <ArrowUp className="h-4 w-4" />
                          ) : (
                            <ArrowDown className="h-4 w-4" />
                          )}
                          <span>{Math.abs(subject.improvement)}%</span>
                        </div>
                        <span>{subject.progress}%</span>
                      </div>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className={`progress-fill ${subject.color}`}
                        style={{ width: `${subject.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold mb-6 flex items-center space-x-2">
                <Activity className="h-5 w-5 text-education-wisdom" />
                <span>Recent Activity</span>
              </h3>
              
              <div className="space-y-4">
                {recentActivities.map(activity => (
                  <div key={activity.id} className="flex items-center space-x-4 p-3 bg-white/5 rounded-lg">
                    <div className="w-10 h-10 bg-education-wisdom/20 rounded-lg flex items-center justify-center">
                      {activity.type === 'course_completed' && <CheckCircle className="h-5 w-5 text-green-400" />}
                      {activity.type === 'achievement_earned' && <Award className="h-5 w-5 text-yellow-400" />}
                      {activity.type === 'tutoring_session' && <Brain className="h-5 w-5 text-education-wisdom" />}
                      {activity.type === 'quiz_completed' && <Target className="h-5 w-5 text-blue-400" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{activity.title}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span>{activity.time}</span>
                        {activity.score && <span>Score: {activity.score}%</span>}
                        {activity.duration && <span>Duration: {activity.duration}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Achievements */}
          <div className="space-y-8">
            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold mb-6 flex items-center space-x-2">
                <Award className="h-5 w-5 text-education-wisdom" />
                <span>Achievements</span>
              </h3>
              
              <div className="space-y-4">
                {achievements.map(achievement => {
                  const IconComponent = achievement.icon;
                  return (
                    <div key={achievement.id} className={`p-4 rounded-lg border ${
                      achievement.earned 
                        ? 'border-education-wisdom bg-education-wisdom/10' 
                        : 'border-white/20 bg-white/5'
                    }`}>
                      <div className="flex items-start space-x-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          achievement.earned ? 'bg-education-wisdom/20' : 'bg-gray-600/20'
                        }`}>
                          <IconComponent className={`h-5 w-5 ${
                            achievement.earned ? getRarityColor(achievement.rarity) : 'text-gray-400'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{achievement.title}</h4>
                          <p className="text-sm text-gray-400 mb-2">{achievement.description}</p>
                          
                          {achievement.earned ? (
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-400" />
                              <span className="text-sm text-green-400">Earned {achievement.date}</span>
                            </div>
                          ) : (
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Progress</span>
                                <span>{achievement.progress}/{achievement.total}</span>
                              </div>
                              <div className="progress-bar">
                                <div 
                                  className="progress-fill"
                                  style={{ width: `${(achievement.progress! / achievement.total!) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Learning Insights */}
            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold mb-6 flex items-center space-x-2">
                <Brain className="h-5 w-5 text-education-wisdom" />
                <span>AI Insights</span>
              </h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-education-wisdom/10 rounded-lg border border-education-wisdom/20">
                  <h4 className="font-semibold mb-2 text-education-wisdom">Strength Identified</h4>
                  <p className="text-sm text-gray-300">
                    You excel at programming concepts and show consistent improvement in problem-solving skills.
                  </p>
                </div>
                
                <div className="p-4 bg-yellow-400/10 rounded-lg border border-yellow-400/20">
                  <h4 className="font-semibold mb-2 text-yellow-400">Improvement Area</h4>
                  <p className="text-sm text-gray-300">
                    Consider spending more time on science topics to balance your learning portfolio.
                  </p>
                </div>
                
                <div className="p-4 bg-green-400/10 rounded-lg border border-green-400/20">
                  <h4 className="font-semibold mb-2 text-green-400">Recommendation</h4>
                  <p className="text-sm text-gray-300">
                    Your learning streak is impressive! Try the "Quantum Physics" course next.
                  </p>
                </div>
              </div>
              
              <button
                onClick={handleProgressAnalysis}
                disabled={isLoading}
                className="w-full mt-4 tutor-button flex items-center justify-center space-x-2"
              >
                <Brain className="h-4 w-4" />
                <span>{isLoading ? 'Analyzing...' : 'Get Detailed Analysis'}</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <section className="px-6 py-16 bg-black/20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="education-card">
            <TrendingUp className="h-16 w-16 text-education-wisdom mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Keep Growing!</h2>
            <p className="text-gray-300 mb-8">
              Your learning journey is progressing wonderfully. Set new goals and 
              continue building your knowledge with AI-powered guidance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleGoalSetting}
                disabled={isLoading}
                className="tutor-button flex items-center space-x-2"
              >
                <Target className="h-5 w-5" />
                <span>{isLoading ? 'Setting...' : 'Set New Goals'}</span>
              </button>
              <button className="glass-button flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Join Study Group</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}