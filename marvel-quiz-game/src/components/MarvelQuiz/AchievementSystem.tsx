import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Achievement, GameStats } from '../../types/marvel';
import {
  Trophy,
  Star,
  Zap,
  Target,
  Clock,
  Shield,
  Crown,
  Award,
  Flame,
  Sparkles,
  CheckCircle,
  Lock,
  Medal
} from 'lucide-react';

interface AchievementSystemProps {
  gameStats: GameStats;
  onAchievementUnlocked?: (achievement: Achievement) => void;
  className?: string;
}

interface AchievementProgress {
  achievement: Achievement;
  isUnlocked: boolean;
  progress: number;
  maxProgress: number;
  justUnlocked?: boolean;
}

const achievementDefinitions: Achievement[] = [
  {
    id: 'first_quiz',
    name: 'Welcome to Marvel',
    description: 'Complete your first quiz',
    icon: 'star',
    rarity: 'common',
    points: 50,
    category: 'general',
    requirements: {
      gamesPlayed: 1
    }
  },
  {
    id: 'perfect_score',
    name: 'Flawless Victory',
    description: 'Answer all questions correctly in a single quiz',
    icon: 'crown',
    rarity: 'rare',
    points: 200,
    category: 'accuracy',
    requirements: {
      perfectQuiz: true
    }
  },
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Answer 10 questions in under 2 seconds each',
    icon: 'zap',
    rarity: 'uncommon',
    points: 150,
    category: 'speed',
    requirements: {
      fastAnswers: 10
    }
  },
  {
    id: 'streak_master',
    name: 'Streak Master',
    description: 'Get 15 correct answers in a row',
    icon: 'flame',
    rarity: 'rare',
    points: 250,
    category: 'streak',
    requirements: {
      streak: 15
    }
  },
  {
    id: 'quiz_veteran',
    name: 'Quiz Veteran',
    description: 'Complete 10 quizzes',
    icon: 'shield',
    rarity: 'uncommon',
    points: 300,
    category: 'general',
    requirements: {
      gamesPlayed: 10
    }
  },
  {
    id: 'accuracy_expert',
    name: 'Accuracy Expert',
    description: 'Maintain 90% accuracy over 5 quizzes',
    icon: 'target',
    rarity: 'rare',
    points: 400,
    category: 'accuracy',
    requirements: {
      accuracy: 90,
      gamesPlayed: 5
    }
  },
  {
    id: 'time_lord',
    name: 'Time Lord',
    description: 'Complete a quiz in under 60 seconds',
    icon: 'clock',
    rarity: 'epic',
    points: 500,
    category: 'speed',
    requirements: {
      totalTime: 60
    }
  },
  {
    id: 'marvel_master',
    name: 'Marvel Master',
    description: 'Reach 10,000 total points',
    icon: 'crown',
    rarity: 'legendary',
    points: 1000,
    category: 'general',
    requirements: {
      totalScore: 10000
    }
  },
  {
    id: 'hero_collector',
    name: 'Hero Collector',
    description: 'Answer questions about 25 different heroes',
    icon: 'sparkles',
    rarity: 'epic',
    points: 600,
    category: 'knowledge',
    requirements: {
      uniqueHeroes: 25
    }
  },
  {
    id: 'villain_hunter',
    name: 'Villain Hunter',
    description: 'Answer questions about 15 different villains',
    icon: 'award',
    rarity: 'rare',
    points: 350,
    category: 'knowledge',
    requirements: {
      uniqueVillains: 15
    }
  }
];

const AchievementSystem: React.FC<AchievementSystemProps> = ({
  gameStats,
  onAchievementUnlocked,
  className = ''
}) => {
  const [achievements, setAchievements] = useState<AchievementProgress[]>([]);
  const [newlyUnlocked, setNewlyUnlocked] = useState<Achievement[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All', icon: Trophy },
    { id: 'general', name: 'General', icon: Star },
    { id: 'accuracy', name: 'Accuracy', icon: Target },
    { id: 'speed', name: 'Speed', icon: Zap },
    { id: 'streak', name: 'Streak', icon: Flame },
    { id: 'knowledge', name: 'Knowledge', icon: Award }
  ];

  // Check achievements and update progress
  useEffect(() => {
    const checkAchievements = () => {
      const updatedAchievements: AchievementProgress[] = achievementDefinitions.map(achievement => {
        const progress = calculateProgress(achievement, gameStats);
        const isUnlocked = progress.current >= progress.max;
        
        return {
          achievement,
          isUnlocked,
          progress: progress.current,
          maxProgress: progress.max
        };
      });

      // Check for newly unlocked achievements
      const previouslyUnlocked = achievements.filter(a => a.isUnlocked).map(a => a.achievement.id);
      const currentlyUnlocked = updatedAchievements.filter(a => a.isUnlocked).map(a => a.achievement.id);
      const newUnlocks = updatedAchievements.filter(a => 
        a.isUnlocked && !previouslyUnlocked.includes(a.achievement.id)
      );

      if (newUnlocks.length > 0) {
        setNewlyUnlocked(newUnlocks.map(u => u.achievement));
        newUnlocks.forEach(unlock => {
          onAchievementUnlocked?.(unlock.achievement);
        });
      }

      setAchievements(updatedAchievements);
    };

    checkAchievements();
  }, [gameStats, onAchievementUnlocked]);

  // Clear newly unlocked notifications after delay
  useEffect(() => {
    if (newlyUnlocked.length > 0) {
      const timer = setTimeout(() => {
        setNewlyUnlocked([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [newlyUnlocked]);

  const calculateProgress = (achievement: Achievement, stats: GameStats) => {
    const req = achievement.requirements;
    let current = 0;
    let max = 1;

    if (req.gamesPlayed) {
      current = stats.gamesPlayed || 0;
      max = req.gamesPlayed;
    } else if (req.perfectQuiz) {
      current = stats.accuracy === 100 ? 1 : 0;
      max = 1;
    } else if (req.fastAnswers) {
      current = stats.fastAnswers || 0;
      max = req.fastAnswers;
    } else if (req.streak) {
      current = stats.highestStreak || 0;
      max = req.streak;
    } else if (req.accuracy && req.gamesPlayed) {
      current = (stats.accuracy >= req.accuracy && stats.gamesPlayed >= req.gamesPlayed) ? req.gamesPlayed : Math.min(stats.gamesPlayed || 0, req.gamesPlayed);
      max = req.gamesPlayed;
    } else if (req.totalTime) {
      current = stats.totalTime <= req.totalTime ? 1 : 0;
      max = 1;
    } else if (req.totalScore) {
      current = stats.totalScore || 0;
      max = req.totalScore;
    } else if (req.uniqueHeroes) {
      current = stats.uniqueHeroes || 0;
      max = req.uniqueHeroes;
    } else if (req.uniqueVillains) {
      current = stats.uniqueVillains || 0;
      max = req.uniqueVillains;
    }

    return { current: Math.min(current, max), max };
  };

  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
      star: Star,
      crown: Crown,
      zap: Zap,
      flame: Flame,
      shield: Shield,
      target: Target,
      clock: Clock,
      sparkles: Sparkles,
      award: Award,
      trophy: Trophy,
      medal: Medal
    };
    return iconMap[iconName] || Star;
  };

  const getRarityColor = (rarity: string) => {
    const colors = {
      common: 'text-gray-400 border-gray-500',
      uncommon: 'text-green-400 border-green-500',
      rare: 'text-blue-400 border-blue-500',
      epic: 'text-purple-400 border-purple-500',
      legendary: 'text-yellow-400 border-yellow-500'
    };
    return colors[rarity as keyof typeof colors] || colors.common;
  };

  const getRarityGlow = (rarity: string) => {
    const glows = {
      common: 'shadow-gray-500/20',
      uncommon: 'shadow-green-500/30',
      rare: 'shadow-blue-500/30',
      epic: 'shadow-purple-500/40',
      legendary: 'shadow-yellow-500/50'
    };
    return glows[rarity as keyof typeof glows] || glows.common;
  };

  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(a => a.achievement.category === selectedCategory);

  const unlockedCount = achievements.filter(a => a.isUnlocked).length;
  const totalPoints = achievements
    .filter(a => a.isUnlocked)
    .reduce((sum, a) => sum + a.achievement.points, 0);

  return (
    <div className={`achievement-system ${className}`}>
      {/* Newly Unlocked Notifications */}
      <AnimatePresence>
        {newlyUnlocked.map((achievement, index) => {
          const IconComponent = getIconComponent(achievement.icon);
          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: -50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.8 }}
              className="fixed top-4 right-4 z-50 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400 rounded-lg p-4 backdrop-blur-sm"
              style={{ marginTop: `${index * 80}px` }}
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-yellow-400/20 rounded-full">
                  <IconComponent className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <div className="text-sm font-bold text-yellow-400">Achievement Unlocked!</div>
                  <div className="text-white font-semibold">{achievement.name}</div>
                  <div className="text-xs text-gray-300">{achievement.description}</div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-2">Achievements</h2>
          <p className="text-gray-400">Track your Marvel quiz mastery</p>
          <div className="flex justify-center space-x-6 mt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{unlockedCount}</div>
              <div className="text-sm text-gray-400">Unlocked</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{totalPoints}</div>
              <div className="text-sm text-gray-400">Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                {Math.round((unlockedCount / achievements.length) * 100)}%
              </div>
              <div className="text-sm text-gray-400">Complete</div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map(category => {
            const IconComponent = category.icon;
            const isActive = selectedCategory === category.id;
            return (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all duration-300
                  ${isActive
                    ? 'bg-blue-500/30 text-white border-blue-400'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border-gray-600'
                  }
                `}
              >
                <IconComponent className="w-4 h-4" />
                <span className="text-sm font-medium">{category.name}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="wait">
            {filteredAchievements.map((achievementProgress, index) => {
              const { achievement, isUnlocked, progress, maxProgress } = achievementProgress;
              const IconComponent = getIconComponent(achievement.icon);
              const progressPercentage = (progress / maxProgress) * 100;
              
              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className={`
                    relative p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105
                    ${isUnlocked
                      ? `bg-gradient-to-br ${getRarityColor(achievement.rarity).replace('text-', 'from-').replace('border-', '').replace('-400', '-500/20')} to-gray-900/50 ${getRarityColor(achievement.rarity)} ${getRarityGlow(achievement.rarity)}`
                      : 'bg-gray-800/50 text-gray-400 border-gray-600'
                    }
                  `}
                >
                  {/* Rarity Badge */}
                  <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold ${
                    isUnlocked ? getRarityColor(achievement.rarity).split(' ')[0] : 'text-gray-500'
                  } bg-black/30`}>
                    {achievement.rarity.toUpperCase()}
                  </div>

                  {/* Icon */}
                  <div className="flex items-center justify-center mb-3">
                    <div className={`p-3 rounded-full ${
                      isUnlocked 
                        ? `bg-gradient-to-br ${getRarityColor(achievement.rarity).replace('text-', 'from-').replace('border-', '').replace('-400', '-500/30')} to-transparent`
                        : 'bg-gray-700/50'
                    }`}>
                      {isUnlocked ? (
                        <IconComponent className={`w-8 h-8 ${getRarityColor(achievement.rarity).split(' ')[0]}`} />
                      ) : (
                        <Lock className="w-8 h-8 text-gray-500" />
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="text-center space-y-2">
                    <h3 className={`font-bold ${isUnlocked ? 'text-white' : 'text-gray-500'}`}>
                      {achievement.name}
                    </h3>
                    <p className={`text-sm ${isUnlocked ? 'text-gray-300' : 'text-gray-600'}`}>
                      {achievement.description}
                    </p>
                    
                    {/* Progress Bar */}
                    {!isUnlocked && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Progress</span>
                          <span>{progress}/{maxProgress}</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <motion.div
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercentage}%` }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Points */}
                    <div className={`flex items-center justify-center space-x-1 text-sm ${
                      isUnlocked ? 'text-yellow-400' : 'text-gray-600'
                    }`}>
                      <Trophy className="w-4 h-4" />
                      <span>{achievement.points} pts</span>
                    </div>

                    {/* Unlocked Indicator */}
                    {isUnlocked && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex items-center justify-center space-x-1 text-green-400"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">Unlocked!</span>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AchievementSystem;