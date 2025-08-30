import React from 'react';
import { motion } from 'framer-motion';
import { GameStats as GameStatsType, Achievement } from '../../types/marvel';
import { Trophy, Target, Clock, Zap, Star, Award } from 'lucide-react';

interface GameStatsProps {
  stats: GameStatsType;
  achievements: Achievement[];
  className?: string;
}

const GameStatsComponent: React.FC<GameStatsProps> = ({ stats, achievements, className = '' }) => {
  const getRankColor = (rank: string) => {
    switch (rank.toLowerCase()) {
      case 'rookie': return 'text-gray-400';
      case 'hero': return 'text-blue-400';
      case 'champion': return 'text-purple-400';
      case 'legend': return 'text-yellow-400';
      case 'cosmic': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 90) return 'text-green-400';
    if (accuracy >= 70) return 'text-yellow-400';
    if (accuracy >= 50) return 'text-orange-400';
    return 'text-red-400';
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`game-stats ${className}`}
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Score Card */}
        <div className="stats-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Final Score</h3>
            <Trophy className="w-6 h-6 text-yellow-400" />
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-yellow-400 mb-2">
              {stats.score.toLocaleString()}
            </div>
            <div className="text-sm text-gray-300">
              +{stats.bonusPoints} bonus points
            </div>
          </div>
        </div>

        {/* Accuracy Card */}
        <div className="stats-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Accuracy</h3>
            <Target className="w-6 h-6 text-blue-400" />
          </div>
          <div className="text-center">
            <div className={`text-4xl font-bold mb-2 ${getAccuracyColor(stats.accuracy)}`}>
              {stats.accuracy.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-300">
              {stats.correctAnswers}/{stats.questionsAnswered} correct
            </div>
          </div>
        </div>

        {/* Streak Card */}
        <div className="stats-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Best Streak</h3>
            <Zap className="w-6 h-6 text-purple-400" />
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-400 mb-2">
              {stats.highestStreak}
            </div>
            <div className="text-sm text-gray-300">
              consecutive correct
            </div>
          </div>
        </div>

        {/* Time Card */}
        <div className="stats-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Average Time</h3>
            <Clock className="w-6 h-6 text-green-400" />
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-400 mb-2">
              {(stats.averageResponseTime || 0).toFixed(1)}s
            </div>
            <div className="text-sm text-gray-300">
              per question
            </div>
          </div>
        </div>

        {/* Rank Card */}
        <div className="stats-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Rank</h3>
            <Star className="w-6 h-6 text-yellow-400" />
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold mb-2 ${getRankColor(stats.rank)}`}>
              {stats.rank}
            </div>
            <div className="text-sm text-gray-300">
              Character: {stats.characterMatch}
            </div>
          </div>
        </div>

        {/* Power-ups Card */}
        <div className="stats-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Power-ups</h3>
            <Award className="w-6 h-6 text-blue-400" />
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-400 mb-2">
              {stats.powerUpsUsed}
            </div>
            <div className="text-sm text-gray-300">
              used this game
            </div>
          </div>
        </div>
      </div>

      {/* Achievements Section */}
      {achievements.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <h3 className="text-2xl font-bold text-white mb-6 text-center">
            Achievements Unlocked
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                className={`achievement-card rarity-${achievement.rarity}`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{achievement.icon}</span>
                  <div className="flex-1">
                    <h4 className="font-bold text-white">{achievement.name}</h4>
                    <p className="text-sm text-gray-300">{achievement.description}</p>
                    <div className="text-xs text-yellow-300 mt-1">
                      +{achievement.points} points
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Performance Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 p-6 bg-gray-800/50 rounded-lg border border-gray-700"
      >
        <h3 className="text-xl font-bold text-white mb-4 text-center">
          Performance Summary
        </h3>
        <div className="grid sm:grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-gray-300">Difficulty</div>
            <div className="text-2xl font-bold text-white capitalize">
              {stats.difficulty}
            </div>
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-300">Total Time</div>
            <div className="text-2xl font-bold text-white">
              {formatTime(stats.totalTimeSpent || 0)}
            </div>
          </div>
        </div>
        
        {/* Performance Rating */}
        <div className="mt-6 text-center">
          <div className="text-lg font-semibold text-gray-300 mb-2">Overall Rating</div>
          <div className="flex justify-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => {
              const rating = Math.ceil((stats.accuracy / 100) * 5);
              return (
                <Star
                  key={star}
                  className={`w-6 h-6 ${
                    star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-600'
                  }`}
                />
              );
            })}
          </div>
          <div className="text-sm text-gray-400 mt-2">
            {stats.accuracy >= 90 ? 'Legendary Performance!' :
             stats.accuracy >= 70 ? 'Great Job!' :
             stats.accuracy >= 50 ? 'Good Effort!' : 'Keep Practicing!'}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GameStatsComponent;