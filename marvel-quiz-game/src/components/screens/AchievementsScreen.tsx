import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Trophy, 
  Star, 
  Zap, 
  Target, 
  Clock, 
  Shield, 
  Award,
  Lock,
  CheckCircle,
  Filter,
  Search
} from 'lucide-react';
import { useGameStore } from '../../stores/gameStore';
import { GlassPanel } from '../ui/GlassPanel';
import { GlassButton } from '../ui/GlassButton';
import { cn } from '../../lib/utils';

// Mock achievements data (in real app, this would come from a service)
const allAchievements = [
  {
    id: 'first-question',
    name: 'First Steps',
    description: 'Answer your first question',
    icon: 'star',
    category: 'milestone-badges',
    rarity: 'common',
    points: 50,
    requirement: 'Answer 1 question',
    unlocked: true,
    unlockedAt: Date.now() - 86400000
  },
  {
    id: 'perfect-score',
    name: 'Flawless Victory',
    description: 'Complete a game with 100% accuracy',
    icon: 'trophy',
    category: 'performance-medals',
    rarity: 'legendary',
    points: 500,
    requirement: 'Get 100% accuracy in any game mode',
    unlocked: true,
    unlockedAt: Date.now() - 43200000
  },
  {
    id: 'streak-5',
    name: 'On Fire',
    description: 'Answer 5 questions correctly in a row',
    icon: 'zap',
    category: 'streak-achievements',
    rarity: 'rare',
    points: 150,
    requirement: 'Get a 5-question streak',
    unlocked: true,
    unlockedAt: Date.now() - 21600000
  },
  {
    id: 'streak-10',
    name: 'Unstoppable',
    description: 'Answer 10 questions correctly in a row',
    icon: 'zap',
    category: 'streak-achievements',
    rarity: 'epic',
    points: 300,
    requirement: 'Get a 10-question streak',
    unlocked: false
  },
  {
    id: 'speed-demon',
    name: 'Speed Demon',
    description: 'Answer 10 questions in under 30 seconds total',
    icon: 'clock',
    category: 'speed-records',
    rarity: 'epic',
    points: 250,
    requirement: 'Average response time under 3 seconds',
    unlocked: false
  },
  {
    id: 'marvel-master',
    name: 'Marvel Master',
    description: 'Reach level 10',
    icon: 'shield',
    category: 'milestone-badges',
    rarity: 'legendary',
    points: 1000,
    requirement: 'Reach player level 10',
    unlocked: false
  },
  {
    id: 'collector',
    name: 'The Collector',
    description: 'Unlock 25 achievements',
    icon: 'award',
    category: 'collection-trophies',
    rarity: 'legendary',
    points: 750,
    requirement: 'Unlock 25 different achievements',
    unlocked: false
  },
  {
    id: 'blitz-master',
    name: 'Blitz Master',
    description: 'Score over 2000 points in Blitz mode',
    icon: 'target',
    category: 'game-mode-mastery',
    rarity: 'epic',
    points: 400,
    requirement: 'Score 2000+ points in Blitz mode',
    unlocked: false
  },
  {
    id: 'survivor',
    name: 'The Survivor',
    description: 'Answer 50 questions in Survival mode',
    icon: 'shield',
    category: 'game-mode-mastery',
    rarity: 'epic',
    points: 350,
    requirement: 'Answer 50 questions in Survival mode',
    unlocked: false
  },
  {
    id: 'social-butterfly',
    name: 'Social Butterfly',
    description: 'Play 10 multiplayer games',
    icon: 'star',
    category: 'social-achievements',
    rarity: 'rare',
    points: 200,
    requirement: 'Complete 10 multiplayer games',
    unlocked: false
  }
];

const categories = [
  { id: 'all', name: 'All Achievements', icon: Trophy },
  { id: 'milestone-badges', name: 'Milestone Badges', icon: Star },
  { id: 'performance-medals', name: 'Performance Medals', icon: Award },
  { id: 'streak-achievements', name: 'Streak Achievements', icon: Zap },
  { id: 'speed-records', name: 'Speed Records', icon: Clock },
  { id: 'game-mode-mastery', name: 'Game Mode Mastery', icon: Target },
  { id: 'collection-trophies', name: 'Collection Trophies', icon: Trophy },
  { id: 'social-achievements', name: 'Social Achievements', icon: Shield }
];

const rarityConfig = {
  common: {
    color: 'from-gray-500 to-gray-600',
    textColor: 'text-gray-300',
    bgColor: 'bg-gray-500/20',
    borderColor: 'border-gray-500/30'
  },
  rare: {
    color: 'from-blue-500 to-blue-600',
    textColor: 'text-blue-300',
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-500/30'
  },
  epic: {
    color: 'from-purple-500 to-purple-600',
    textColor: 'text-purple-300',
    bgColor: 'bg-purple-500/20',
    borderColor: 'border-purple-500/30'
  },
  legendary: {
    color: 'from-yellow-500 to-orange-500',
    textColor: 'text-yellow-300',
    bgColor: 'bg-yellow-500/20',
    borderColor: 'border-yellow-500/30'
  }
};

interface AchievementCardProps {
  achievement: any;
  index: number;
}

function AchievementCard({ achievement, index }: AchievementCardProps) {
  const config = rarityConfig[achievement.rarity as keyof typeof rarityConfig];
  const IconComponent = getIconComponent(achievement.icon);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="relative"
    >
      <GlassPanel className={cn(
        "p-6 relative overflow-hidden transition-all duration-300",
        achievement.unlocked ? "hover:bg-white/10" : "opacity-60",
        config.borderColor,
        "border"
      )}>
        {/* Background gradient */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-10",
          config.color
        )} />
        
        {/* Lock overlay for locked achievements */}
        {!achievement.unlocked && (
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center">
            <Lock className="w-8 h-8 text-gray-400" />
          </div>
        )}
        
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center",
              config.bgColor
            )}>
              <IconComponent className={cn("w-6 h-6", config.textColor)} />
            </div>
            
            <div className="flex flex-col items-end gap-2">
              {achievement.unlocked && (
                <CheckCircle className="w-5 h-5 text-green-400" />
              )}
              <div className={cn(
                "px-2 py-1 rounded-full text-xs font-bold",
                config.bgColor,
                config.textColor
              )}>
                {achievement.rarity.toUpperCase()}
              </div>
            </div>
          </div>
          
          {/* Content */}
          <h3 className="text-lg font-bold text-white mb-2">{achievement.name}</h3>
          <p className="text-gray-300 text-sm mb-3">{achievement.description}</p>
          
          {/* Requirement */}
          <div className="text-xs text-gray-400 mb-3">
            <strong>Requirement:</strong> {achievement.requirement}
          </div>
          
          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-yellow-400">
              <Star className="w-4 h-4" />
              <span className="font-bold">{achievement.points} XP</span>
            </div>
            
            {achievement.unlocked && achievement.unlockedAt && (
              <div className="text-xs text-gray-500">
                Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
        
        {/* Sparkle effect for legendary achievements */}
        {achievement.rarity === 'legendary' && achievement.unlocked && (
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-yellow-300 rounded-full"
                style={{
                  left: `${10 + i * 10}%`,
                  top: `${10 + (i % 2) * 80}%`,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        )}
      </GlassPanel>
    </motion.div>
  );
}

function getIconComponent(iconName: string) {
  const icons: { [key: string]: any } = {
    trophy: Trophy,
    star: Star,
    zap: Zap,
    target: Target,
    clock: Clock,
    shield: Shield,
    award: Award
  };
  return icons[iconName] || Trophy;
}

export function AchievementsScreen() {
  const { setCurrentScreen, player } = useGameStore();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('rarity'); // rarity, name, points, unlocked
  
  const filteredAchievements = allAchievements
    .filter(achievement => {
      const matchesCategory = selectedCategory === 'all' || achievement.category === selectedCategory;
      const matchesSearch = achievement.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           achievement.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rarity':
          const rarityOrder = { legendary: 4, epic: 3, rare: 2, common: 1 };
          return rarityOrder[b.rarity as keyof typeof rarityOrder] - rarityOrder[a.rarity as keyof typeof rarityOrder];
        case 'name':
          return a.name.localeCompare(b.name);
        case 'points':
          return b.points - a.points;
        case 'unlocked':
          return (b.unlocked ? 1 : 0) - (a.unlocked ? 1 : 0);
        default:
          return 0;
      }
    });
  
  const unlockedCount = allAchievements.filter(a => a.unlocked).length;
  const totalPoints = allAchievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0);
  const completionPercentage = Math.round((unlockedCount / allAchievements.length) * 100);
  
  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <GlassButton
              onClick={() => setCurrentScreen('home')}
              className="p-3 hover:bg-white/20"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </GlassButton>
            <div>
              <h1 className="text-3xl font-bold text-white">Achievements</h1>
              <p className="text-gray-400">Track your Marvel mastery progress</p>
            </div>
          </div>
        </motion.div>
        
        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          <GlassPanel className="p-4 text-center">
            <div className="text-2xl font-bold text-white mb-1">{unlockedCount}/{allAchievements.length}</div>
            <div className="text-sm text-gray-400">Unlocked</div>
          </GlassPanel>
          
          <GlassPanel className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400 mb-1">{totalPoints.toLocaleString()}</div>
            <div className="text-sm text-gray-400">Achievement XP</div>
          </GlassPanel>
          
          <GlassPanel className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1">{completionPercentage}%</div>
            <div className="text-sm text-gray-400">Completion</div>
          </GlassPanel>
          
          <GlassPanel className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-400 mb-1">
              {allAchievements.filter(a => a.unlocked && a.rarity === 'legendary').length}
            </div>
            <div className="text-sm text-gray-400">Legendary</div>
          </GlassPanel>
        </motion.div>
        
        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <GlassPanel className="p-4">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Overall Progress</span>
              <span>{completionPercentage}% Complete</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-yellow-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${completionPercentage}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </GlassPanel>
        </motion.div>
        
        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <GlassPanel className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search achievements..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none"
                  />
                </div>
              </div>
              
              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-blue-400 focus:outline-none"
              >
                <option value="rarity" className="bg-gray-800">Sort by Rarity</option>
                <option value="name" className="bg-gray-800">Sort by Name</option>
                <option value="points" className="bg-gray-800">Sort by Points</option>
                <option value="unlocked" className="bg-gray-800">Sort by Status</option>
              </select>
            </div>
          </GlassPanel>
        </motion.div>
        
        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const IconComponent = category.icon;
              const isActive = selectedCategory === category.id;
              
              return (
                <GlassButton
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    "px-4 py-2 transition-all duration-300",
                    isActive 
                      ? "bg-blue-500/30 text-white border-blue-400" 
                      : "text-gray-300 hover:bg-white/10"
                  )}
                >
                  <IconComponent className="w-4 h-4 mr-2" />
                  {category.name}
                </GlassButton>
              );
            })}
          </div>
        </motion.div>
        
        {/* Achievements Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredAchievements.map((achievement, index) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                index={index}
              />
            ))}
          </AnimatePresence>
        </motion.div>
        
        {/* Empty State */}
        {filteredAchievements.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <GlassPanel className="p-8 max-w-md mx-auto">
              <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No achievements found</h3>
              <p className="text-gray-400">Try adjusting your search or category filter.</p>
            </GlassPanel>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default AchievementsScreen;