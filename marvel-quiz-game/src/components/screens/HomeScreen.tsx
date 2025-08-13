import React from 'react';
import { motion } from 'framer-motion';
import { Play, Trophy, Settings, Users, Zap, Shield, Infinity } from 'lucide-react';
import { useGameStore } from '../../stores/gameStore';
import { GlassPanel } from '../ui/GlassPanel';
import { GlassButton } from '../ui/GlassButton';
import { cn } from '../../lib/utils';

const gameModesData = [
  {
    id: 'story',
    name: 'Story Mode',
    description: 'Journey through Marvel history with guided questions',
    icon: Shield,
    color: 'from-blue-500 to-blue-700',
    difficulty: 'Progressive',
    duration: '15-20 min',
    features: ['3 Lives', 'Hints Available', 'Story Progression']
  },
  {
    id: 'blitz',
    name: 'Blitz Mode',
    description: 'Fast-paced questions against the clock',
    icon: Zap,
    color: 'from-yellow-500 to-orange-600',
    difficulty: 'Medium',
    duration: '5 min',
    features: ['30 Questions', 'Time Pressure', 'Quick Fire']
  },
  {
    id: 'survival',
    name: 'Survival Mode',
    description: 'How long can you survive the ultimate test?',
    icon: Infinity,
    color: 'from-purple-500 to-pink-600',
    difficulty: 'Adaptive',
    duration: 'Unlimited',
    features: ['One Life', 'Increasing Difficulty', 'Endless Questions']
  },
  {
    id: 'multiplayer',
    name: 'Multiplayer Battle',
    description: 'Challenge friends in real-time Marvel trivia',
    icon: Users,
    color: 'from-red-500 to-red-700',
    difficulty: 'Variable',
    duration: '10-15 min',
    features: ['Real-time PvP', 'Power-ups', 'Leaderboards']
  }
];

export function HomeScreen() {
  const { 
    player, 
    setCurrentScreen, 
    startGame,
    setLoading 
  } = useGameStore();

  const handleGameModeSelect = async (gameMode: string) => {
    if (gameMode === 'multiplayer') {
      setCurrentScreen('multiplayer-lobby');
    } else {
      setLoading(true);
      await startGame(gameMode as any, 'medium');
    }
  };

  const handleNavigation = (screen: string) => {
    setCurrentScreen(screen as any);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center mb-12"
      >
        <h1 className="text-6xl md:text-8xl font-bold text-hero mb-4 font-['Orbitron']">
          MARVEL
        </h1>
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 text-glow">
          QUIZ GAME
        </h2>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Test your knowledge of the Marvel Universe. From the origins of your favorite heroes 
          to the cosmic battles that shaped reality itself.
        </p>
      </motion.div>

      {/* Player Welcome */}
      {player && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <GlassPanel className="px-6 py-4 text-center">
            <p className="text-white text-lg">
              Welcome back, <span className="text-yellow-400 font-semibold">{player.name}</span>!
            </p>
            <div className="flex items-center justify-center gap-6 mt-2 text-sm text-gray-300">
              <span>Level {player.level}</span>
              <span>•</span>
              <span>{player.totalScore.toLocaleString()} Total Score</span>
              <span>•</span>
              <span>{player.gamesPlayed} Games Played</span>
            </div>
          </GlassPanel>
        </motion.div>
      )}

      {/* Game Modes Grid */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full mb-12"
      >
        {gameModesData.map((mode, index) => {
          const IconComponent = mode.icon;
          
          return (
            <motion.div
              key={mode.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <GlassPanel className="p-6 h-full cursor-pointer group hover:bg-white/20 transition-all duration-300">
                <div className="flex items-start gap-4 mb-4">
                  <div className={cn(
                    "p-3 rounded-lg bg-gradient-to-br",
                    mode.color,
                    "group-hover:scale-110 transition-transform duration-300"
                  )}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{mode.name}</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">{mode.description}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-4 text-xs">
                  <div className="text-center">
                    <div className="text-gray-400">Difficulty</div>
                    <div className="text-white font-semibold">{mode.difficulty}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-400">Duration</div>
                    <div className="text-white font-semibold">{mode.duration}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-400">Type</div>
                    <div className="text-white font-semibold">
                      {mode.id === 'multiplayer' ? 'PvP' : 'Solo'}
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="text-xs text-gray-400 mb-2">Features:</div>
                  <div className="flex flex-wrap gap-1">
                    {mode.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-white/10 rounded text-xs text-white"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                
                <GlassButton
                  onClick={() => handleGameModeSelect(mode.id)}
                  className="w-full py-3 text-white font-semibold hover:bg-white/25 transition-all duration-300"
                >
                  <Play className="w-4 h-4 mr-2" />
                  {mode.id === 'multiplayer' ? 'Join Battle' : 'Start Game'}
                </GlassButton>
              </GlassPanel>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Navigation Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="flex flex-wrap gap-4 justify-center"
      >
        <GlassButton
          onClick={() => handleNavigation('achievements')}
          className="px-6 py-3 text-white hover:bg-white/20 transition-all duration-300"
        >
          <Trophy className="w-5 h-5 mr-2" />
          Achievements
        </GlassButton>
        
        <GlassButton
          onClick={() => handleNavigation('leaderboard')}
          className="px-6 py-3 text-white hover:bg-white/20 transition-all duration-300"
        >
          <Users className="w-5 h-5 mr-2" />
          Leaderboard
        </GlassButton>
        
        <GlassButton
          onClick={() => handleNavigation('settings')}
          className="px-6 py-3 text-white hover:bg-white/20 transition-all duration-300"
        >
          <Settings className="w-5 h-5 mr-2" />
          Settings
        </GlassButton>
      </motion.div>

      {/* Version Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="absolute bottom-4 right-4 text-xs text-gray-500"
      >
        Marvel Quiz Game v1.0.0
      </motion.div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-br from-red-500/20 to-transparent rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-4 w-16 h-16 bg-gradient-to-br from-yellow-500/20 to-transparent rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }} />
    </div>
  );
}

export default HomeScreen;