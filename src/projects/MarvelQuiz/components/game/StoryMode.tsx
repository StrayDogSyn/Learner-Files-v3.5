import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Book, 
  Star, 
  Lock, 
  CheckCircle, 
  Play,
  Trophy,
  Target,
  Zap
} from 'lucide-react';
import { useGameStore } from '../../stores/gameStore';
import { GlassPanel } from '../ui/GlassPanel';
import { GlassButton } from '../ui/GlassButton';
import { cn } from '../../lib/utils';

// Story chapters data
const storyChapters = [
  {
    id: 'origin-stories',
    title: 'Origin Stories',
    description: 'Learn about the beginnings of your favorite heroes',
    difficulty: 'easy',
    questionsCount: 10,
    requiredScore: 70,
    unlocked: true,
    completed: true,
    score: 85,
    stars: 3,
    characters: ['Spider-Man', 'Iron Man', 'Captain America'],
    background: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Marvel%20comic%20book%20origin%20stories%20background%20colorful%20heroic&image_size=landscape_16_9',
    icon: '🕷️'
  },
  {
    id: 'avengers-assemble',
    title: 'Avengers Assemble',
    description: 'Test your knowledge of Earth\'s Mightiest Heroes',
    difficulty: 'medium',
    questionsCount: 15,
    requiredScore: 75,
    unlocked: true,
    completed: true,
    score: 92,
    stars: 3,
    characters: ['Thor', 'Hulk', 'Black Widow', 'Hawkeye'],
    background: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Avengers%20team%20assembly%20background%20epic%20heroic%20action&image_size=landscape_16_9',
    icon: '🛡️'
  },
  {
    id: 'cosmic-threats',
    title: 'Cosmic Threats',
    description: 'Face the universe\'s greatest dangers',
    difficulty: 'medium',
    questionsCount: 12,
    requiredScore: 80,
    unlocked: true,
    completed: false,
    score: 0,
    stars: 0,
    characters: ['Thanos', 'Galactus', 'Silver Surfer'],
    background: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Marvel%20cosmic%20space%20threats%20background%20dark%20mysterious&image_size=landscape_16_9',
    icon: '🌌'
  },
  {
    id: 'x-men-chronicles',
    title: 'X-Men Chronicles',
    description: 'Explore the world of mutants and their struggles',
    difficulty: 'hard',
    questionsCount: 18,
    requiredScore: 85,
    unlocked: false,
    completed: false,
    score: 0,
    stars: 0,
    characters: ['Wolverine', 'Professor X', 'Storm', 'Cyclops'],
    background: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=X-Men%20school%20mutant%20background%20academy%20heroic&image_size=landscape_16_9',
    icon: '🧬'
  },
  {
    id: 'guardians-galaxy',
    title: 'Guardians of the Galaxy',
    description: 'Journey through space with the Guardians',
    difficulty: 'medium',
    questionsCount: 14,
    requiredScore: 80,
    unlocked: false,
    completed: false,
    score: 0,
    stars: 0,
    characters: ['Star-Lord', 'Gamora', 'Rocket', 'Groot'],
    background: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Guardians%20galaxy%20space%20background%20colorful%20cosmic&image_size=landscape_16_9',
    icon: '🚀'
  },
  {
    id: 'infinity-saga',
    title: 'The Infinity Saga',
    description: 'The ultimate test of Marvel knowledge',
    difficulty: 'legendary',
    questionsCount: 25,
    requiredScore: 90,
    unlocked: false,
    completed: false,
    score: 0,
    stars: 0,
    characters: ['All Heroes'],
    background: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Infinity%20stones%20gauntlet%20background%20epic%20powerful&image_size=landscape_16_9',
    icon: '♾️'
  }
];

interface ChapterCardProps {
  chapter: any;
  index: number;
  onPlay: (chapterId: string) => void;
}

function ChapterCard({ chapter, index, onPlay }: ChapterCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'from-green-500 to-green-600 text-green-300';
      case 'medium': return 'from-yellow-500 to-orange-500 text-yellow-300';
      case 'hard': return 'from-red-500 to-red-600 text-red-300';
      case 'legendary': return 'from-purple-500 to-pink-500 text-purple-300';
      default: return 'from-gray-500 to-gray-600 text-gray-300';
    }
  };
  
  const getStarDisplay = (stars: number) => {
    return Array.from({ length: 3 }).map((_, i) => (
      <Star
        key={i}
        className={cn(
          "w-4 h-4",
          i < stars ? "text-yellow-400 fill-yellow-400" : "text-gray-600"
        )}
      />
    ));
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: chapter.unlocked ? 1.02 : 1 }}
      className="relative"
    >
      <GlassPanel className={cn(
        "p-6 relative overflow-hidden transition-all duration-300",
        chapter.unlocked ? "hover:bg-white/10 cursor-pointer" : "opacity-60",
        "border border-white/10"
      )}>
        {/* Background Image */}
        <div className="absolute inset-0 opacity-20">
          <img
            src={chapter.background}
            alt={chapter.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Marvel%20comic%20book%20background%20heroic%20colorful&image_size=landscape_16_9';
            }}
          />
        </div>
        
        {/* Lock overlay for locked chapters */}
        {!chapter.unlocked && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="text-center">
              <Lock className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">Complete previous chapter</p>
            </div>
          </div>
        )}
        
        <div className="relative z-20">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="text-3xl">{chapter.icon}</div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1">{chapter.title}</h3>
                <div className={cn(
                  "px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r",
                  getDifficultyColor(chapter.difficulty)
                )}>
                  {chapter.difficulty.toUpperCase()}
                </div>
              </div>
            </div>
            
            {chapter.completed && (
              <div className="flex flex-col items-end gap-2">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <div className="flex gap-1">
                  {getStarDisplay(chapter.stars)}
                </div>
              </div>
            )}
          </div>
          
          {/* Description */}
          <p className="text-gray-300 text-sm mb-4">{chapter.description}</p>
          
          {/* Characters */}
          <div className="mb-4">
            <div className="text-xs text-gray-400 mb-2">Featured Characters:</div>
            <div className="flex flex-wrap gap-1">
              {chapter.characters.map((character: string, i: number) => (
                <span
                  key={i}
                  className="px-2 py-1 bg-white/10 rounded-full text-xs text-gray-300"
                >
                  {character}
                </span>
              ))}
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-4 text-center">
            <div>
              <div className="text-lg font-bold text-white">{chapter.questionsCount}</div>
              <div className="text-xs text-gray-400">Questions</div>
            </div>
            <div>
              <div className="text-lg font-bold text-yellow-400">{chapter.requiredScore}%</div>
              <div className="text-xs text-gray-400">Required</div>
            </div>
            <div>
              <div className={cn(
                "text-lg font-bold",
                chapter.completed ? "text-green-400" : "text-gray-400"
              )}>
                {chapter.completed ? `${chapter.score}%` : '--'}
              </div>
              <div className="text-xs text-gray-400">Best Score</div>
            </div>
          </div>
          
          {/* Action Button */}
          <GlassButton
            onClick={() => chapter.unlocked && onPlay(chapter.id)}
            disabled={!chapter.unlocked}
            className={cn(
              "w-full py-3 transition-all duration-300",
              chapter.unlocked
                ? "bg-blue-500/30 hover:bg-blue-500/40 text-white"
                : "opacity-50 cursor-not-allowed"
            )}
          >
            <div className="flex items-center justify-center gap-2">
              {chapter.completed ? (
                <>
                  <Play className="w-4 h-4" />
                  <span>Play Again</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Start Chapter</span>
                </>
              )}
            </div>
          </GlassButton>
        </div>
        
        {/* Progress indicator for completed chapters */}
        {chapter.completed && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-blue-500" />
        )}
      </GlassPanel>
    </motion.div>
  );
}

interface StoryModeProps {
  onStartChapter: (chapterId: string) => void;
}

export function StoryMode({ onStartChapter }: StoryModeProps) {
  const { player } = useGameStore();
  
  const completedChapters = storyChapters.filter(c => c.completed).length;
  const totalStars = storyChapters.reduce((sum, c) => sum + c.stars, 0);
  const averageScore = storyChapters.filter(c => c.completed).reduce((sum, c, _, arr) => {
    return sum + c.score / arr.length;
  }, 0);
  
  return (
    <div className="space-y-6">
      {/* Story Mode Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Book className="w-8 h-8 text-blue-400" />
          <h2 className="text-3xl font-bold text-white">Story Mode</h2>
        </div>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Embark on an epic journey through the Marvel Universe. Complete chapters to unlock new adventures and test your knowledge of iconic heroes and villains.
        </p>
      </motion.div>
      
      {/* Progress Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
      >
        <GlassPanel className="p-4 text-center">
          <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white mb-1">{completedChapters}/{storyChapters.length}</div>
          <div className="text-sm text-gray-400">Chapters Complete</div>
        </GlassPanel>
        
        <GlassPanel className="p-4 text-center">
          <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-yellow-400 mb-1">{totalStars}/18</div>
          <div className="text-sm text-gray-400">Stars Earned</div>
        </GlassPanel>
        
        <GlassPanel className="p-4 text-center">
          <Target className="w-8 h-8 text-green-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-green-400 mb-1">
            {completedChapters > 0 ? Math.round(averageScore) : 0}%
          </div>
          <div className="text-sm text-gray-400">Average Score</div>
        </GlassPanel>
        
        <GlassPanel className="p-4 text-center">
          <Zap className="w-8 h-8 text-purple-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-purple-400 mb-1">{player?.level || 1}</div>
          <div className="text-sm text-gray-400">Player Level</div>
        </GlassPanel>
      </motion.div>
      
      {/* Overall Progress Bar */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <GlassPanel className="p-4">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Story Progress</span>
            <span>{Math.round((completedChapters / storyChapters.length) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-yellow-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(completedChapters / storyChapters.length) * 100}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
        </GlassPanel>
      </motion.div>
      
      {/* Chapters Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence>
          {storyChapters.map((chapter, index) => (
            <ChapterCard
              key={chapter.id}
              chapter={chapter}
              index={index}
              onPlay={onStartChapter}
            />
          ))}
        </AnimatePresence>
      </motion.div>
      
      {/* Tips Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8"
      >
        <GlassPanel className="p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400" />
            Story Mode Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
              <div>
                <strong>Earn Stars:</strong> Get 70% for 1 star, 85% for 2 stars, and 95% for 3 stars.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
              <div>
                <strong>Unlock Chapters:</strong> Complete previous chapters to unlock new ones.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
              <div>
                <strong>Replay Anytime:</strong> Replay completed chapters to improve your score.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
              <div>
                <strong>Level Up:</strong> Completing chapters grants XP to increase your player level.
              </div>
            </div>
          </div>
        </GlassPanel>
      </motion.div>
    </div>
  );
}

export default StoryMode;