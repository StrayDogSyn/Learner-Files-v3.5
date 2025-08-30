import React, { useState, useEffect } from 'react';
import { 
  GameStats as GameStatsType, 
  Achievement, 
  LeaderboardEntry, 
  PowerUp,
  QuizConfig,
  GameSession
} from '../../types/marvel';

interface GameStatsProps {
  stats: GameStatsType;
  achievements: Achievement[];
  leaderboard: LeaderboardEntry[];
  currentSession?: GameSession;
  onResetStats?: () => void;
  className?: string;
}

const GameStats: React.FC<GameStatsProps> = ({
  stats,
  achievements,
  leaderboard,
  currentSession,
  onResetStats,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'leaderboard'>('overview');
  const [animatedStats, setAnimatedStats] = useState(stats);

  // Animate stats changes
  useEffect(() => {
    const animateValue = (start: number, end: number, duration: number, callback: (value: number) => void) => {
      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = start + (end - start) * progress;
        callback(Math.round(current));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      animate();
    };

    // Animate total score
    animateValue(animatedStats.totalScore, stats.totalScore, 1000, (value) => {
      setAnimatedStats(prev => ({ ...prev, totalScore: value }));
    });

    // Animate games played
    animateValue(animatedStats.gamesPlayed, stats.gamesPlayed, 800, (value) => {
      setAnimatedStats(prev => ({ ...prev, gamesPlayed: value }));
    });

    // Animate questions answered
    animateValue(animatedStats.questionsAnswered, stats.questionsAnswered, 600, (value) => {
      setAnimatedStats(prev => ({ ...prev, questionsAnswered: value }));
    });
  }, [stats]);

  const calculateAccuracy = () => {
    if (stats.questionsAnswered === 0) return 0;
    return Math.round((stats.correctAnswers / stats.questionsAnswered) * 100);
  };

  const calculateAverageScore = () => {
    if (stats.gamesPlayed === 0) return 0;
    return Math.round(stats.totalScore / stats.gamesPlayed);
  };

  const getStreakColor = (streak: number) => {
    if (streak >= 10) return 'text-yellow-400';
    if (streak >= 5) return 'text-orange-400';
    if (streak >= 3) return 'text-blue-400';
    return 'text-gray-400';
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 90) return 'text-green-400';
    if (accuracy >= 75) return 'text-yellow-400';
    if (accuracy >= 60) return 'text-orange-400';
    return 'text-red-400';
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    }
    return `${secs}s`;
  };

  const getAchievementIcon = (achievement: Achievement) => {
    const iconMap: Record<string, string> = {
      'first_game': '🎮',
      'perfect_score': '💯',
      'speed_demon': '⚡',
      'knowledge_master': '🧠',
      'streak_master': '🔥',
      'completionist': '🏆',
      'marvel_expert': '⭐',
      'power_user': '💪',
      'dedicated_player': '🎯',
      'trivia_champion': '👑'
    };
    return iconMap[achievement.id] || '🏅';
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-800/50 rounded-lg p-4 text-center border border-gray-700">
          <div className="text-2xl font-bold text-blue-400">{animatedStats.totalScore.toLocaleString()}</div>
          <div className="text-sm text-gray-400">Total Score</div>
        </div>
        
        <div className="bg-gray-800/50 rounded-lg p-4 text-center border border-gray-700">
          <div className="text-2xl font-bold text-green-400">{animatedStats.gamesPlayed}</div>
          <div className="text-sm text-gray-400">Games Played</div>
        </div>
        
        <div className="bg-gray-800/50 rounded-lg p-4 text-center border border-gray-700">
          <div className={`text-2xl font-bold ${getAccuracyColor(calculateAccuracy())}`}>
            {calculateAccuracy()}%
          </div>
          <div className="text-sm text-gray-400">Accuracy</div>
        </div>
        
        <div className="bg-gray-800/50 rounded-lg p-4 text-center border border-gray-700">
          <div className={`text-2xl font-bold ${getStreakColor(stats.currentStreak)}`}>
            {stats.currentStreak}
          </div>
          <div className="text-sm text-gray-400">Current Streak</div>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Performance</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Questions Answered:</span>
              <span className="text-white font-medium">{animatedStats.questionsAnswered}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Correct Answers:</span>
              <span className="text-green-400 font-medium">{stats.correctAnswers}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Wrong Answers:</span>
              <span className="text-red-400 font-medium">{stats.questionsAnswered - stats.correctAnswers}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Average Score:</span>
              <span className="text-blue-400 font-medium">{calculateAverageScore()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Best Streak:</span>
              <span className={`font-medium ${getStreakColor(stats.bestStreak)}`}>{stats.bestStreak}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Time & Records</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Total Play Time:</span>
              <span className="text-white font-medium">{formatTime(stats.totalPlayTime)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Best Score:</span>
              <span className="text-yellow-400 font-medium">{stats.bestScore}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Fastest Answer:</span>
              <span className="text-green-400 font-medium">{stats.fastestAnswer}s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Power-ups Used:</span>
              <span className="text-purple-400 font-medium">{stats.powerUpsUsed}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Achievements:</span>
              <span className="text-orange-400 font-medium">{achievements.filter(a => a.unlocked).length}/{achievements.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Current Session */}
      {currentSession && (
        <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg p-6 border border-blue-700/50">
          <h3 className="text-lg font-semibold text-white mb-4">Current Session</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-blue-400">{currentSession.score}</div>
              <div className="text-sm text-gray-400">Score</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-green-400">{currentSession.correctAnswers}</div>
              <div className="text-sm text-gray-400">Correct</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-orange-400">{currentSession.streak}</div>
              <div className="text-sm text-gray-400">Streak</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-purple-400">{currentSession.powerUpsUsed}</div>
              <div className="text-sm text-gray-400">Power-ups</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderAchievements = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Achievements</h3>
        <div className="text-sm text-gray-400">
          {achievements.filter(a => a.unlocked).length} / {achievements.length} unlocked
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`p-4 rounded-lg border transition-all duration-300 ${
              achievement.unlocked
                ? 'bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border-yellow-700/50'
                : 'bg-gray-800/30 border-gray-700 opacity-60'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="text-2xl">{getAchievementIcon(achievement)}</div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h4 className={`font-semibold ${
                    achievement.unlocked ? 'text-yellow-400' : 'text-gray-400'
                  }`}>
                    {achievement.name}
                  </h4>
                  {achievement.unlocked && (
                    <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full">
                      Unlocked
                    </span>
                  )}
                </div>
                <p className={`text-sm mt-1 ${
                  achievement.unlocked ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  {achievement.description}
                </p>
                {achievement.unlocked && achievement.unlockedAt && (
                  <p className="text-xs text-gray-500 mt-2">
                    Unlocked: {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </p>
                )}
                {!achievement.unlocked && achievement.progress !== undefined && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Progress</span>
                      <span>{achievement.progress}/{achievement.target}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((achievement.progress / achievement.target) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderLeaderboard = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Leaderboard</h3>
      
      <div className="space-y-2">
        {leaderboard.map((entry, index) => (
          <div
            key={entry.id}
            className={`flex items-center space-x-4 p-4 rounded-lg border transition-all duration-300 ${
              index === 0
                ? 'bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border-yellow-700/50'
                : index === 1
                ? 'bg-gradient-to-r from-gray-700/30 to-gray-600/30 border-gray-600/50'
                : index === 2
                ? 'bg-gradient-to-r from-orange-900/30 to-red-900/30 border-orange-700/50'
                : 'bg-gray-800/30 border-gray-700'
            }`}
          >
            <div className={`text-2xl font-bold ${
              index === 0 ? 'text-yellow-400' :
              index === 1 ? 'text-gray-400' :
              index === 2 ? 'text-orange-400' :
              'text-gray-500'
            }`}>
              #{index + 1}
            </div>
            
            <div className="flex-1">
              <div className="font-semibold text-white">{entry.playerName}</div>
              <div className="text-sm text-gray-400">
                {new Date(entry.date).toLocaleDateString()}
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-lg font-bold text-blue-400">{entry.score.toLocaleString()}</div>
              <div className="text-sm text-gray-400">{entry.accuracy}% accuracy</div>
            </div>
            
            {index < 3 && (
              <div className="text-2xl">
                {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
              </div>
            )}
          </div>
        ))}
        
        {leaderboard.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">🏆</div>
            <p>No scores yet. Be the first to set a record!</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className={`bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 ${className}`}>
      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-800/50 rounded-lg p-1">
        {[
          { id: 'overview', label: 'Overview', icon: '📊' },
          { id: 'achievements', label: 'Achievements', icon: '🏆' },
          { id: 'leaderboard', label: 'Leaderboard', icon: '🥇' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            <span>{tab.icon}</span>
            <span className="font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'achievements' && renderAchievements()}
        {activeTab === 'leaderboard' && renderLeaderboard()}
      </div>

      {/* Reset Button */}
      {onResetStats && (
        <div className="mt-6 pt-6 border-t border-gray-700">
          <button
            onClick={onResetStats}
            className="w-full py-2 px-4 bg-red-600/20 text-red-400 border border-red-600/50 rounded-lg hover:bg-red-600/30 transition-all duration-200"
          >
            Reset All Stats
          </button>
        </div>
      )}
    </div>
  );
};

export default GameStats;