import React, { useState, useMemo } from 'react';
import { GameStats, Achievement, DifficultyLevel, QuizCategory } from '../../types/marvel';
import { FadeAnimation, ScaleAnimation } from '../UI/EnhancedAnimations';
import { ProgressRing, StatisticsDisplay, SkillRadar } from '../UI/ProgressIndicators';
import { AchievementGallery } from './AchievementSharing';

export interface PlayerProfileProps {
  playerName: string;
  playerStats: GameStats;
  achievements: Achievement[];
  gameHistory: GameSession[];
  preferences?: PlayerPreferences;
  onUpdatePreferences?: (preferences: PlayerPreferences) => void;
  onShareProfile?: () => void;
  isOwnProfile?: boolean;
}

export interface GameSession {
  id: string;
  date: string;
  mode: string;
  category: QuizCategory;
  difficulty: DifficultyLevel;
  score: number;
  questionsAnswered: number;
  correctAnswers: number;
  timeSpent: number;
  achievements: string[];
}

export interface PlayerPreferences {
  favoriteCharacter?: string;
  preferredDifficulty: DifficultyLevel;
  preferredCategories: QuizCategory[];
  soundEnabled: boolean;
  animationsEnabled: boolean;
  theme: 'auto' | 'light' | 'dark';
  privacy: {
    showStats: boolean;
    showAchievements: boolean;
    showGameHistory: boolean;
  };
}

export interface PlayerBadge {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  requirement: string;
}

const PlayerProfile: React.FC<PlayerProfileProps> = ({
  playerName,
  playerStats,
  achievements,
  gameHistory,
  preferences,
  onUpdatePreferences,
  onShareProfile,
  isOwnProfile = false
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'stats' | 'achievements' | 'history' | 'settings'>('overview');
  const [editingPreferences, setEditingPreferences] = useState(false);
  const [tempPreferences, setTempPreferences] = useState<PlayerPreferences>(preferences || {
    preferredDifficulty: 'medium',
    preferredCategories: [],
    soundEnabled: true,
    animationsEnabled: true,
    theme: 'auto',
    privacy: {
      showStats: true,
      showAchievements: true,
      showGameHistory: true
    }
  });

  // Calculate derived stats
  const derivedStats = useMemo(() => {
    const totalGames = gameHistory.length;
    const averageScore = totalGames > 0 ? 
      gameHistory.reduce((sum, game) => sum + game.score, 0) / totalGames : 0;
    const averageAccuracy = totalGames > 0 ?
      gameHistory.reduce((sum, game) => sum + (game.correctAnswers / game.questionsAnswered), 0) / totalGames * 100 : 0;
    const totalPlayTime = gameHistory.reduce((sum, game) => sum + game.timeSpent, 0);
    
    const categoryStats = gameHistory.reduce((acc, game) => {
      if (!acc[game.category]) {
        acc[game.category] = { games: 0, totalScore: 0, totalCorrect: 0, totalQuestions: 0 };
      }
      acc[game.category].games++;
      acc[game.category].totalScore += game.score;
      acc[game.category].totalCorrect += game.correctAnswers;
      acc[game.category].totalQuestions += game.questionsAnswered;
      return acc;
    }, {} as Record<string, any>);

    const difficultyStats = gameHistory.reduce((acc, game) => {
      if (!acc[game.difficulty]) {
        acc[game.difficulty] = { games: 0, totalScore: 0, totalCorrect: 0, totalQuestions: 0 };
      }
      acc[game.difficulty].games++;
      acc[game.difficulty].totalScore += game.score;
      acc[game.difficulty].totalCorrect += game.correctAnswers;
      acc[game.difficulty].totalQuestions += game.questionsAnswered;
      return acc;
    }, {} as Record<string, any>);

    return {
      totalGames,
      averageScore: Math.round(averageScore),
      averageAccuracy: Math.round(averageAccuracy),
      totalPlayTime,
      categoryStats,
      difficultyStats
    };
  }, [gameHistory]);

  // Calculate player level and badges
  const playerLevel = Math.floor(playerStats.totalScore / 1000) + 1;
  const experienceToNext = 1000 - (playerStats.totalScore % 1000);
  const levelProgress = ((playerStats.totalScore % 1000) / 1000) * 100;

  const playerBadges: PlayerBadge[] = [
    {
      id: 'quiz-master',
      name: 'Quiz Master',
      icon: '🎓',
      color: 'bg-yellow-500',
      description: 'Completed 100+ quizzes',
      requirement: '100 games'
    },
    {
      id: 'accuracy-expert',
      name: 'Accuracy Expert',
      icon: '🎯',
      color: 'bg-green-500',
      description: 'Maintain 90%+ accuracy',
      requirement: '90% accuracy'
    },
    {
      id: 'streak-legend',
      name: 'Streak Legend',
      icon: '🔥',
      color: 'bg-red-500',
      description: 'Achieved 50+ answer streak',
      requirement: '50 streak'
    },
    {
      id: 'marvel-expert',
      name: 'Marvel Expert',
      icon: '⚡',
      color: 'bg-blue-500',
      description: 'Master all categories',
      requirement: 'All categories'
    }
  ];

  const earnedBadges = playerBadges.filter(badge => {
    switch (badge.id) {
      case 'quiz-master':
        return derivedStats.totalGames >= 100;
      case 'accuracy-expert':
        return derivedStats.averageAccuracy >= 90;
      case 'streak-legend':
        return playerStats.longestStreak >= 50;
      case 'marvel-expert':
        return Object.keys(derivedStats.categoryStats).length >= 5;
      default:
        return false;
    }
  });

  const handleSavePreferences = () => {
    if (onUpdatePreferences) {
      onUpdatePreferences(tempPreferences);
    }
    setEditingPreferences(false);
  };

  const formatPlayTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '👤' },
    { id: 'stats', label: 'Statistics', icon: '📊' },
    { id: 'achievements', label: 'Achievements', icon: '🏆' },
    { id: 'history', label: 'Game History', icon: '📜' },
    ...(isOwnProfile ? [{ id: 'settings', label: 'Settings', icon: '⚙️' }] : [])
  ];

  return (
    <div className="bg-gray-800 rounded-lg p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl font-bold text-white">
            {playerName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{playerName}</h1>
            <div className="flex items-center space-x-2 text-sm text-gray-300">
              <span>Level {playerLevel}</span>
              <span>•</span>
              <span>{achievements.filter(a => a.unlockedAt).length} Achievements</span>
              <span>•</span>
              <span>{derivedStats.totalGames} Games Played</span>
            </div>
          </div>
        </div>
        
        {onShareProfile && (
          <button
            onClick={onShareProfile}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Share Profile
          </button>
        )}
      </div>

      {/* Level Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-gray-300 mb-2">
          <span>Level {playerLevel}</span>
          <span>{experienceToNext} XP to next level</span>
        </div>
        <div className="bg-gray-700 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${levelProgress}%` }}
          />
        </div>
      </div>

      {/* Badges */}
      {earnedBadges.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">Badges</h3>
          <div className="flex flex-wrap gap-2">
            {earnedBadges.map((badge, index) => (
              <FadeAnimation key={badge.id} delay={index * 50}>
                <div className={`${badge.color} rounded-lg px-3 py-2 flex items-center space-x-2 text-white text-sm`}>
                  <span>{badge.icon}</span>
                  <span className="font-medium">{badge.name}</span>
                </div>
              </FadeAnimation>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-700 mb-6">
        <div className="flex space-x-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 px-1 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'overview' && (
          <FadeAnimation>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Quick Stats */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Quick Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-700 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-400">{playerStats.totalScore.toLocaleString()}</div>
                    <div className="text-sm text-gray-300">Total Score</div>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-400">{derivedStats.averageAccuracy}%</div>
                    <div className="text-sm text-gray-300">Accuracy</div>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-400">{playerStats.longestStreak}</div>
                    <div className="text-sm text-gray-300">Best Streak</div>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-purple-400">{formatPlayTime(derivedStats.totalPlayTime)}</div>
                    <div className="text-sm text-gray-300">Play Time</div>
                  </div>
                </div>
              </div>

              {/* Recent Achievements */}
              <div>
                <AchievementGallery
                  achievements={achievements.filter(a => a.unlockedAt).slice(0, 8)}
                  playerName={playerName}
                  compact={true}
                />
              </div>
            </div>
          </FadeAnimation>
        )}

        {activeTab === 'stats' && (
          <FadeAnimation>
            <div className="space-y-6">
              <StatisticsDisplay
                stats={{
                  totalScore: playerStats.totalScore,
                  correctAnswers: playerStats.correctAnswers,
                  totalQuestions: playerStats.totalQuestions,
                  longestStreak: playerStats.longestStreak,
                  averageResponseTime: playerStats.averageResponseTime || 0,
                  gamesPlayed: derivedStats.totalGames,
                  accuracy: Math.round((playerStats.correctAnswers / playerStats.totalQuestions) * 100),
                  questionsAnswered: playerStats.totalQuestions,
                  incorrectAnswers: playerStats.wrongAnswers,
                  currentStreak: playerStats.streak,
                  highestStreak: playerStats.maxStreak,
                  averageTime: playerStats.averageResponseTime || 0,
                  totalTime: playerStats.totalTimeSpent || 0,
                  fastAnswers: 0,
                  rank: 'Beginner',
                  powerUpsUsed: 0,
                  hintsUsed: 0,
                  achievements: [],
                  wrongAnswers: playerStats.wrongAnswers,
                  timePerQuestion: playerStats.timePerQuestion || 0,
                  streak: playerStats.streak,
                  maxStreak: playerStats.maxStreak,
                  fastestAnswer: 0,
                  slowestAnswer: 0,
                  categoriesPlayed: [],
                  score: playerStats.totalScore
                }}
                achievements={achievements.filter(a => a.unlockedAt).slice(0, 3)}
              />
              
              {/* Skill Radar */}
              <div className="bg-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Skill Analysis</h3>
                <SkillRadar
                  skills={Object.entries(derivedStats.categoryStats).map(([category, stats]) => ({
                    label: category,
                    value: Math.round((stats.totalCorrect / stats.totalQuestions) * 100),
                    maxValue: 100
                  }))}}
                />
              </div>
            </div>
          </FadeAnimation>
        )}

        {activeTab === 'achievements' && (
          <FadeAnimation>
            <AchievementGallery
              achievements={achievements}
              playerName={playerName}
            />
          </FadeAnimation>
        )}

        {activeTab === 'history' && (
          <FadeAnimation>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Recent Games</h3>
              <div className="space-y-3">
                {gameHistory.slice(0, 20).map((game, index) => (
                  <div key={game.id} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-sm text-gray-300">
                          {new Date(game.date).toLocaleDateString()}
                        </div>
                        <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                          {game.mode}
                        </div>
                        <div className="bg-purple-600 text-white text-xs px-2 py-1 rounded">
                          {game.category}
                        </div>
                        <div className="bg-orange-600 text-white text-xs px-2 py-1 rounded">
                          {game.difficulty}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-green-400 font-medium">
                          {game.score} pts
                        </span>
                        <span className="text-gray-300">
                          {game.correctAnswers}/{game.questionsAnswered}
                        </span>
                        <span className="text-gray-400">
                          {Math.round((game.correctAnswers / game.questionsAnswered) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeAnimation>
        )}

        {activeTab === 'settings' && isOwnProfile && (
          <FadeAnimation>
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Profile Settings</h3>
              
              <div className="bg-gray-700 rounded-lg p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Preferred Difficulty
                  </label>
                  <select
                    value={tempPreferences.preferredDifficulty}
                    onChange={(e) => setTempPreferences(prev => ({
                      ...prev,
                      preferredDifficulty: e.target.value as DifficultyLevel
                    }))}
                    className="w-full bg-gray-600 text-white rounded-lg px-3 py-2"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Theme
                  </label>
                  <select
                    value={tempPreferences.theme}
                    onChange={(e) => setTempPreferences(prev => ({
                      ...prev,
                      theme: e.target.value as 'auto' | 'light' | 'dark'
                    }))}
                    className="w-full bg-gray-600 text-white rounded-lg px-3 py-2"
                  >
                    <option value="auto">Auto</option>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-300">Privacy Settings</h4>
                  
                  {[
                    { key: 'showStats', label: 'Show Statistics' },
                    { key: 'showAchievements', label: 'Show Achievements' },
                    { key: 'showGameHistory', label: 'Show Game History' }
                  ].map((setting) => (
                    <label key={setting.key} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={tempPreferences.privacy[setting.key as keyof typeof tempPreferences.privacy]}
                        onChange={(e) => setTempPreferences(prev => ({
                          ...prev,
                          privacy: {
                            ...prev.privacy,
                            [setting.key]: e.target.checked
                          }
                        }))}
                        className="rounded"
                      />
                      <span className="text-sm text-gray-300">{setting.label}</span>
                    </label>
                  ))}
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={handleSavePreferences}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => {
                      setTempPreferences(preferences || tempPreferences);
                      setEditingPreferences(false);
                    }}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </FadeAnimation>
        )}
      </div>
    </div>
  );
};

export default PlayerProfile;