import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Trophy, 
  Medal, 
  Crown, 
  Star, 
  Calendar,
  RefreshCw,
  Users,
  Target,
  Clock
} from 'lucide-react';
import { useGameStore } from '../../stores/gameStore';
import { GlassPanel } from '../ui/GlassPanel';
import { GlassButton } from '../ui/GlassButton';
import { cn } from '../../lib/utils';

// Mock leaderboard data (in real app, this would come from an API)
const mockLeaderboardData = {
  global: [
    {
      id: '1',
      username: 'StarkGenius',
      avatar: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Iron%20Man%20helmet%20avatar%20profile%20picture%20red%20gold%20metallic%20sleek%20modern&image_size=square',
      level: 15,
      totalScore: 125000,
      gamesPlayed: 89,
      accuracy: 94.2,
      averageTime: 2.1,
      rank: 1,
      title: 'Marvel Master',
      country: 'US',
      isCurrentPlayer: false
    },
    {
      id: '2',
      username: 'WebSlinger',
      avatar: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Spider-Man%20mask%20avatar%20profile%20picture%20red%20blue%20web%20pattern&image_size=square',
      level: 14,
      totalScore: 118500,
      gamesPlayed: 76,
      accuracy: 91.8,
      averageTime: 2.3,
      rank: 2,
      title: 'Web Warrior',
      country: 'CA',
      isCurrentPlayer: false
    },
    {
      id: '3',
      username: 'ShieldAgent',
      avatar: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Captain%20America%20shield%20avatar%20profile%20picture%20blue%20red%20white%20star&image_size=square',
      level: 13,
      totalScore: 112300,
      gamesPlayed: 82,
      accuracy: 89.5,
      averageTime: 2.5,
      rank: 3,
      title: 'First Avenger',
      country: 'UK',
      isCurrentPlayer: false
    },
    {
      id: '4',
      username: 'ThunderGod',
      avatar: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Thor%20hammer%20avatar%20profile%20picture%20lightning%20norse%20mythology&image_size=square',
      level: 12,
      totalScore: 98750,
      gamesPlayed: 65,
      accuracy: 87.3,
      averageTime: 2.8,
      rank: 4,
      title: 'Asgardian',
      country: 'NO',
      isCurrentPlayer: false
    },
    {
      id: '5',
      username: 'GreenGiant',
      avatar: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Hulk%20fist%20avatar%20profile%20picture%20green%20powerful%20angry&image_size=square',
      level: 11,
      totalScore: 89200,
      gamesPlayed: 58,
      accuracy: 85.1,
      averageTime: 3.2,
      rank: 5,
      title: 'Incredible',
      country: 'AU',
      isCurrentPlayer: false
    },
    {
      id: 'current',
      username: 'MarvelFan2024',
      avatar: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Marvel%20logo%20avatar%20profile%20picture%20red%20comic%20book%20style&image_size=square',
      level: 8,
      totalScore: 45600,
      gamesPlayed: 32,
      accuracy: 78.5,
      averageTime: 4.1,
      rank: 847,
      title: 'Rising Hero',
      country: 'US',
      isCurrentPlayer: true
    }
  ],
  weekly: [
    {
      id: '1',
      username: 'QuickSilver',
      avatar: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Quicksilver%20speed%20avatar%20profile%20picture%20blue%20silver%20fast&image_size=square',
      level: 10,
      totalScore: 15600,
      gamesPlayed: 12,
      accuracy: 92.1,
      averageTime: 1.8,
      rank: 1,
      title: 'Speed Demon',
      country: 'DE',
      isCurrentPlayer: false
    },
    {
      id: '2',
      username: 'ScarletWitch',
      avatar: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Scarlet%20Witch%20magic%20avatar%20profile%20picture%20red%20mystical&image_size=square',
      level: 9,
      totalScore: 14200,
      gamesPlayed: 10,
      accuracy: 89.7,
      averageTime: 2.2,
      rank: 2,
      title: 'Chaos Magic',
      country: 'FR',
      isCurrentPlayer: false
    },
    {
      id: 'current',
      username: 'MarvelFan2024',
      avatar: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Marvel%20logo%20avatar%20profile%20picture%20red%20comic%20book%20style&image_size=square',
      level: 8,
      totalScore: 8900,
      gamesPlayed: 7,
      accuracy: 78.5,
      averageTime: 4.1,
      rank: 15,
      title: 'Rising Hero',
      country: 'US',
      isCurrentPlayer: true
    }
  ],
  friends: [
    {
      id: '1',
      username: 'ComicBookGuy',
      avatar: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Comic%20book%20nerd%20avatar%20profile%20picture%20glasses%20friendly&image_size=square',
      level: 12,
      totalScore: 67800,
      gamesPlayed: 45,
      accuracy: 82.3,
      averageTime: 3.5,
      rank: 1,
      title: 'Comic Expert',
      country: 'US',
      isCurrentPlayer: false
    },
    {
      id: 'current',
      username: 'MarvelFan2024',
      avatar: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Marvel%20logo%20avatar%20profile%20picture%20red%20comic%20book%20style&image_size=square',
      level: 8,
      totalScore: 45600,
      gamesPlayed: 32,
      accuracy: 78.5,
      averageTime: 4.1,
      rank: 2,
      title: 'Rising Hero',
      country: 'US',
      isCurrentPlayer: true
    },
    {
      id: '3',
      username: 'SuperHeroFan',
      avatar: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Superhero%20fan%20avatar%20profile%20picture%20cape%20mask&image_size=square',
      level: 6,
      totalScore: 28900,
      gamesPlayed: 28,
      accuracy: 75.2,
      averageTime: 4.8,
      rank: 3,
      title: 'Hero Fan',
      country: 'CA',
      isCurrentPlayer: false
    }
  ]
};

const leaderboardTypes = [
  { id: 'global', name: 'Global', icon: Trophy, description: 'All-time rankings' },
  { id: 'weekly', name: 'Weekly', icon: Calendar, description: 'This week\'s top players' },
  { id: 'friends', name: 'Friends', icon: Users, description: 'Your friends rankings' }
];

interface LeaderboardEntryProps {
  player: any;
  index: number;
  showStats?: boolean;
}

function LeaderboardEntry({ player, index, showStats = true }: LeaderboardEntryProps) {
  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-300" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-amber-600" />;
    return <span className="text-lg font-bold text-gray-400">#{rank}</span>;
  };
  
  const getRankColor = (rank: number) => {
    if (rank === 1) return 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/30';
    if (rank === 2) return 'from-gray-400/20 to-gray-500/20 border-gray-400/30';
    if (rank === 3) return 'from-amber-600/20 to-amber-700/20 border-amber-600/30';
    return 'from-blue-500/10 to-purple-500/10 border-white/10';
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
    >
      <GlassPanel className={cn(
        "p-4 transition-all duration-300 border",
        player.isCurrentPlayer 
          ? "bg-blue-500/20 border-blue-400/50 shadow-lg shadow-blue-500/20" 
          : getRankColor(player.rank),
        "hover:bg-white/10"
      )}>
        <div className="flex items-center gap-4">
          {/* Rank */}
          <div className="flex-shrink-0 w-12 flex justify-center">
            {getRankIcon(player.rank)}
          </div>
          
          {/* Avatar */}
          <div className="relative">
            <img
              src={player.avatar}
              alt={player.username}
              className="w-12 h-12 rounded-full border-2 border-white/20"
              onError={(e) => {
                e.currentTarget.src = 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Marvel%20superhero%20avatar%20profile%20picture%20mask%20heroic&image_size=square';
              }}
            />
            <div className={cn(
              "absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
              "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
            )}>
              {player.level}
            </div>
          </div>
          
          {/* Player Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className={cn(
                "font-bold truncate",
                player.isCurrentPlayer ? "text-blue-300" : "text-white"
              )}>
                {player.username}
                {player.isCurrentPlayer && (
                  <span className="ml-2 text-xs bg-blue-500/30 px-2 py-1 rounded-full">
                    You
                  </span>
                )}
              </h3>
            </div>
            <div className="text-sm text-gray-400">
              {player.title} • Level {player.level}
            </div>
          </div>
          
          {/* Stats */}
          {showStats && (
            <div className="hidden md:flex flex-col items-end gap-1 text-sm">
              <div className="flex items-center gap-4 text-white">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="font-bold">{player.totalScore.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Target className="w-4 h-4 text-green-400" />
                  <span>{player.accuracy}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span>{player.averageTime}s</span>
                </div>
              </div>
              <div className="text-gray-400">
                {player.gamesPlayed} games played
              </div>
            </div>
          )}
        </div>
      </GlassPanel>
    </motion.div>
  );
}

function StatsCard({ title, value, icon: Icon, color, subtitle }: {
  title: string;
  value: string | number;
  icon: any;
  color: string;
  subtitle?: string;
}) {
  return (
    <GlassPanel className="p-4 text-center">
      <div className={cn("w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center", color)}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-gray-400">{title}</div>
      {subtitle && (
        <div className="text-xs text-gray-500 mt-1">{subtitle}</div>
      )}
    </GlassPanel>
  );
}

export function LeaderboardScreen() {
  const { setCurrentScreen } = useGameStore();
  const [selectedType, setSelectedType] = useState('global');
  const [isLoading, setIsLoading] = useState(false);
  
  const currentLeaderboard = mockLeaderboardData[selectedType as keyof typeof mockLeaderboardData];
  const currentPlayer = currentLeaderboard.find(p => p.isCurrentPlayer);
  
  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };
  
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
              <h1 className="text-3xl font-bold text-white">Leaderboard</h1>
              <p className="text-gray-400">Compete with Marvel fans worldwide</p>
            </div>
          </div>
          
          <GlassButton
            onClick={handleRefresh}
            disabled={isLoading}
            className="p-3 hover:bg-white/20"
          >
            <RefreshCw className={cn("w-5 h-5 text-white", isLoading && "animate-spin")} />
          </GlassButton>
        </motion.div>
        
        {/* Player Stats Overview */}
        {currentPlayer && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            <StatsCard
              title="Global Rank"
              value={`#${currentPlayer.rank}`}
              icon={Trophy}
              color="bg-yellow-500/20 text-yellow-400"
            />
            <StatsCard
              title="Total Score"
              value={currentPlayer.totalScore.toLocaleString()}
              icon={Star}
              color="bg-blue-500/20 text-blue-400"
            />
            <StatsCard
              title="Accuracy"
              value={`${currentPlayer.accuracy}%`}
              icon={Target}
              color="bg-green-500/20 text-green-400"
            />
            <StatsCard
              title="Avg. Time"
              value={`${currentPlayer.averageTime}s`}
              icon={Clock}
              color="bg-purple-500/20 text-purple-400"
            />
          </motion.div>
        )}
        
        {/* Leaderboard Type Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="flex flex-wrap gap-2">
            {leaderboardTypes.map((type) => {
              const IconComponent = type.icon;
              const isActive = selectedType === type.id;
              
              return (
                <GlassButton
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={cn(
                    "px-6 py-3 transition-all duration-300",
                    isActive 
                      ? "bg-blue-500/30 text-white border-blue-400" 
                      : "text-gray-300 hover:bg-white/10"
                  )}
                >
                  <IconComponent className="w-5 h-5 mr-2" />
                  <div className="text-left">
                    <div className="font-bold">{type.name}</div>
                    <div className="text-xs opacity-70">{type.description}</div>
                  </div>
                </GlassButton>
              );
            })}
          </div>
        </motion.div>
        
        {/* Leaderboard Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-4"
        >
          <GlassPanel className="p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                {leaderboardTypes.find(t => t.id === selectedType)?.name} Rankings
              </h2>
              <div className="text-sm text-gray-400">
                {currentLeaderboard.length} players
              </div>
            </div>
          </GlassPanel>
        </motion.div>
        
        {/* Leaderboard List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-3"
        >
          <AnimatePresence>
            {currentLeaderboard.map((player, index) => (
              <LeaderboardEntry
                key={`${selectedType}-${player.id}`}
                player={player}
                index={index}
              />
            ))}
          </AnimatePresence>
        </motion.div>
        
        {/* Loading State */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <GlassPanel className="p-8 text-center">
              <RefreshCw className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-4" />
              <p className="text-white">Updating leaderboard...</p>
            </GlassPanel>
          </motion.div>
        )}
        
        {/* Empty State */}
        {currentLeaderboard.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <GlassPanel className="p-8 max-w-md mx-auto">
              <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No rankings yet</h3>
              <p className="text-gray-400">Be the first to set a score!</p>
            </GlassPanel>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default LeaderboardScreen;