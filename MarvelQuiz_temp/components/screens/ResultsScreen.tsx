import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Target, 
  Clock, 
  Zap, 
  Star, 
  Award, 
  Home, 
  RotateCcw, 
  Share2,
  TrendingUp,
  Heart
} from 'lucide-react';
import { useGameStore } from '../../stores/gameStore';
import { GlassPanel } from '../ui/GlassPanel';
import { GlassButton } from '../ui/GlassButton';
import { cn } from '../../../lib/utils';

interface StatCardProps {
  icon: React.ComponentType<any>;
  label: string;
  value: string | number;
  color: string;
  delay?: number;
}

function StatCard({ icon: Icon, label, value, color, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <GlassPanel className="p-4 text-center">
        <div className={cn("w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center", color)}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="text-2xl font-bold text-white mb-1">{value}</div>
        <div className="text-sm text-gray-300">{label}</div>
      </GlassPanel>
    </motion.div>
  );
}

interface AchievementBadgeProps {
  achievement: {
    id: string;
    name: string;
    description: string;
    icon: string;
    rarity: string;
  };
  delay?: number;
}

function AchievementBadge({ achievement, delay = 0 }: AchievementBadgeProps) {
  const rarityColors = {
    common: 'from-gray-500 to-gray-600',
    rare: 'from-blue-500 to-blue-600',
    epic: 'from-purple-500 to-purple-600',
    legendary: 'from-yellow-500 to-orange-500'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay }}
      className="relative"
    >
      <GlassPanel className={cn(
        "p-4 text-center relative overflow-hidden",
        "before:absolute before:inset-0 before:bg-gradient-to-br before:opacity-20",
        `before:${rarityColors[achievement.rarity as keyof typeof rarityColors]}`
      )}>
        <div className="relative z-10">
          <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h3 className="font-bold text-white mb-1">{achievement.name}</h3>
          <p className="text-xs text-gray-300">{achievement.description}</p>
          <div className={cn(
            "inline-block px-2 py-1 rounded-full text-xs font-bold mt-2",
            achievement.rarity === 'common' && "bg-gray-500/20 text-gray-300",
            achievement.rarity === 'rare' && "bg-blue-500/20 text-blue-300",
            achievement.rarity === 'epic' && "bg-purple-500/20 text-purple-300",
            achievement.rarity === 'legendary' && "bg-yellow-500/20 text-yellow-300"
          )}>
            {achievement.rarity.toUpperCase()}
          </div>
        </div>
        
        {/* Sparkle effect for legendary */}
        {achievement.rarity === 'legendary' && (
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-yellow-300 rounded-full"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${20 + (i % 2) * 60}%`,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              />
            ))}
          </div>
        )}
      </GlassPanel>
    </motion.div>
  );
}

export function ResultsScreen() {
  const { 
    currentSession, 
    player,
    setCurrentScreen, 
    resetGame,
    startGame
  } = useGameStore();
  
  const [newAchievements, setNewAchievements] = useState<any[]>([]);
  
  useEffect(() => {
    if (!currentSession) {
      setCurrentScreen('home');
      return;
    }
    
    // Simulate new achievements (in real app, this would come from the store)
    const mockAchievements = [];
    
    if (currentSession.score > 1000) {
      mockAchievements.push({
        id: 'high-score',
        name: 'High Scorer',
        description: 'Scored over 1000 points in a single game',
        icon: 'trophy',
        rarity: 'rare'
      });
    }
    
    if (currentSession.streak >= 5) {
      mockAchievements.push({
        id: 'streak-master',
        name: 'Streak Master',
        description: 'Answered 5 questions correctly in a row',
        icon: 'zap',
        rarity: 'epic'
      });
    }
    
    if (currentSession.answers.every(a => a.isCorrect)) {
      mockAchievements.push({
        id: 'perfect-game',
        name: 'Perfect Game',
        description: 'Answered all questions correctly',
        icon: 'star',
        rarity: 'legendary'
      });
    }
    
    setNewAchievements(mockAchievements);
  }, [currentSession, setCurrentScreen]);
  
  if (!currentSession || !player) {
    return null;
  }
  
  const correctAnswers = currentSession.answers.filter(a => a.isCorrect).length;
  const totalQuestions = currentSession.answers.length;
  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  const avgResponseTime = currentSession.answers.length > 0 
    ? Math.round(currentSession.answers.reduce((sum, a) => sum + a.responseTime, 0) / currentSession.answers.length / 1000)
    : 0;
  const gameDuration = currentSession.endTime 
    ? Math.round((currentSession.endTime - currentSession.startTime) / 1000 / 60)
    : 0;
  
  const getPerformanceRating = () => {
    if (accuracy >= 90) return { rating: 'Legendary', color: 'text-yellow-300', icon: Star };
    if (accuracy >= 75) return { rating: 'Excellent', color: 'text-green-300', icon: Trophy };
    if (accuracy >= 60) return { rating: 'Good', color: 'text-blue-300', icon: Target };
    if (accuracy >= 40) return { rating: 'Fair', color: 'text-orange-300', icon: TrendingUp };
    return { rating: 'Keep Trying', color: 'text-red-300', icon: Heart };
  };
  
  const performance = getPerformanceRating();
  const PerformanceIcon = performance.icon;
  
  const handlePlayAgain = () => {
    resetGame();
    startGame(currentSession.gameMode, currentSession.difficulty);
  };
  
  const handleShare = () => {
    const shareText = `I just scored ${currentSession.score} points in Marvel Quiz Game! 🎮⚡\n\nAccuracy: ${accuracy}%\nStreak: ${currentSession.streak}\nMode: ${currentSession.gameMode}\n\nCan you beat my score?`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Marvel Quiz Game Results',
        text: shareText,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(shareText);
      // Show toast notification
    }
  };
  
  return (
    <div className="min-h-screen p-4 flex flex-col items-center justify-center">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-hero mb-4 font-['Orbitron']">
            MISSION COMPLETE
          </h1>
          <div className={cn("flex items-center justify-center gap-3 mb-4", performance.color)}>
            <PerformanceIcon className="w-8 h-8" />
            <span className="text-2xl font-bold">{performance.rating}</span>
          </div>
          <p className="text-xl text-gray-300">
            You've proven your Marvel knowledge, {player.name}!
          </p>
        </motion.div>
        
        {/* Score Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <GlassPanel className="p-8 text-center">
            <div className="text-6xl font-bold text-yellow-300 mb-2">
              {currentSession.score.toLocaleString()}
            </div>
            <div className="text-xl text-gray-300 mb-4">Total Score</div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{correctAnswers}/{totalQuestions}</div>
                <div className="text-sm text-gray-400">Correct</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{accuracy}%</div>
                <div className="text-sm text-gray-400">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{currentSession.streak}</div>
                <div className="text-sm text-gray-400">Best Streak</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{avgResponseTime}s</div>
                <div className="text-sm text-gray-400">Avg Time</div>
              </div>
            </div>
          </GlassPanel>
        </motion.div>
        
        {/* Detailed Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <StatCard
            icon={Target}
            label="Accuracy"
            value={`${accuracy}%`}
            color="bg-blue-500/20"
            delay={0.1}
          />
          <StatCard
            icon={Zap}
            label="Best Streak"
            value={currentSession.streak}
            color="bg-yellow-500/20"
            delay={0.2}
          />
          <StatCard
            icon={Clock}
            label="Game Time"
            value={`${gameDuration}m`}
            color="bg-green-500/20"
            delay={0.3}
          />
          <StatCard
            icon={TrendingUp}
            label="Difficulty"
            value={currentSession.difficulty}
            color="bg-purple-500/20"
            delay={0.4}
          />
        </motion.div>
        
        {/* New Achievements */}
        <AnimatePresence>
          {newAchievements.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold text-white mb-4 text-center flex items-center justify-center gap-2">
                <Award className="w-6 h-6 text-yellow-400" />
                New Achievements Unlocked!
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {newAchievements.map((achievement, index) => (
                  <AchievementBadge
                    key={achievement.id}
                    achievement={achievement}
                    delay={0.2 * index}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <GlassButton
            onClick={handlePlayAgain}
            className="px-8 py-4 bg-blue-500/30 text-white hover:bg-blue-500/50 transition-all duration-300"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Play Again
          </GlassButton>
          
          <GlassButton
            onClick={() => setCurrentScreen('home')}
            className="px-8 py-4 bg-gray-500/30 text-white hover:bg-gray-500/50 transition-all duration-300"
          >
            <Home className="w-5 h-5 mr-2" />
            Main Menu
          </GlassButton>
          
          <GlassButton
            onClick={handleShare}
            className="px-8 py-4 bg-green-500/30 text-white hover:bg-green-500/50 transition-all duration-300"
          >
            <Share2 className="w-5 h-5 mr-2" />
            Share Results
          </GlassButton>
          
          <GlassButton
            onClick={() => setCurrentScreen('leaderboard')}
            className="px-8 py-4 bg-purple-500/30 text-white hover:bg-purple-500/50 transition-all duration-300"
          >
            <Trophy className="w-5 h-5 mr-2" />
            Leaderboard
          </GlassButton>
        </motion.div>
        
        {/* Experience Gained */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="mt-8 text-center"
        >
          <GlassPanel className="p-4">
            <div className="flex items-center justify-center gap-2 text-yellow-300">
              <Star className="w-5 h-5" />
              <span className="font-semibold">+{currentSession.score} XP Gained</span>
            </div>
            <div className="text-sm text-gray-400 mt-1">
              Level {player.level} • {player.experience.toLocaleString()} / {((player.level + 1) * 1000).toLocaleString()} XP
            </div>
            
            {/* XP Progress Bar */}
            <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
              <motion.div
                className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ 
                  width: `${(player.experience % 1000) / 10}%` 
                }}
                transition={{ duration: 1, delay: 1.2 }}
              />
            </div>
          </GlassPanel>
        </motion.div>
      </div>
    </div>
  );
}

export default ResultsScreen;