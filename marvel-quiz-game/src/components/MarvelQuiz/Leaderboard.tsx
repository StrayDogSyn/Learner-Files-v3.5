import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameStats } from '../../types/marvel';
import { 
  Trophy, 
  Medal, 
  Crown, 
  Star, 
  Clock, 
  Target, 
  Zap,
  TrendingUp,
  Calendar,
  Users
} from 'lucide-react';

interface LeaderboardEntry {
  id: string;
  playerName: string;
  score: number;
  accuracy: number;
  gamesPlayed: number;
  averageTime: number;
  highestStreak: number;
  rank: string;
  lastPlayed: number;
  isCurrentPlayer?: boolean;
}

interface LeaderboardProps {
  currentStats?: GameStats;
  className?: string;
}

type LeaderboardType = {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  sortKey: keyof LeaderboardEntry;
  sortOrder: 'desc' | 'asc';
};

const leaderboardTypes: LeaderboardType[] = [
  {
    id: 'score',
    name: 'High Scores',
    description: 'Top scoring players',
    icon: Trophy,
    sortKey: 'score',
    sortOrder: 'desc'
  },
  {
    id: 'accuracy',
    name: 'Accuracy Masters',
    description: 'Most accurate players',
    icon: Target,
    sortKey: 'accuracy',
    sortOrder: 'desc'
  },
  {
    id: 'speed',
    name: 'Speed Demons',
    description: 'Fastest response times',
    icon: Zap,
    sortKey: 'averageTime',
    sortOrder: 'asc'
  },
  {
    id: 'streak',
    name: 'Streak Champions',
    description: 'Longest correct streaks',
    icon: Star,
    sortKey: 'highestStreak',
    sortOrder: 'desc'
  }
];

const Leaderboard: React.FC<LeaderboardProps> = ({ currentStats, className = '' }) => {
  const [activeType, setActiveType] = useState<string>('score');
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Generate mock leaderboard data
  useEffect(() => {
    const generateMockData = (): LeaderboardEntry[] => {
      const mockPlayers = [
        { name: 'Tony Stark', baseScore: 15000, accuracy: 95, avgTime: 3.2 },
        { name: 'Peter Parker', baseScore: 12500, accuracy: 88, avgTime: 4.1 },
        { name: 'Natasha Romanoff', baseScore: 14200, accuracy: 92, avgTime: 2.8 },
        { name: 'Steve Rogers', baseScore: 11800, accuracy: 85, avgTime: 5.2 },
        { name: 'Bruce Banner', baseScore: 13600, accuracy: 94, avgTime: 3.8 },
        { name: 'Thor Odinson', baseScore: 10900, accuracy: 82, avgTime: 6.1 },
        { name: 'Wanda Maximoff', baseScore: 13100, accuracy: 90, avgTime: 4.5 },
        { name: 'Stephen Strange', baseScore: 14800, accuracy: 96, avgTime: 3.1 },
        { name: 'Carol Danvers', baseScore: 16200, accuracy: 93, avgTime: 2.9 },
        { name: 'Scott Lang', baseScore: 9800, accuracy: 78, avgTime: 7.2 }
      ];

      const entries: LeaderboardEntry[] = mockPlayers.map((player, index) => ({
        id: `player-${index}`,
        playerName: player.name,
        score: player.baseScore + Math.floor(Math.random() * 2000),
        accuracy: player.accuracy + Math.floor(Math.random() * 8) - 4,
        gamesPlayed: Math.floor(Math.random() * 50) + 10,
        averageTime: player.avgTime + (Math.random() * 2) - 1,
        highestStreak: Math.floor(Math.random() * 25) + 5,
        rank: ['Rookie', 'Hero', 'Champion', 'Legend'][Math.floor(Math.random() * 4)],
        lastPlayed: Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000),
        isCurrentPlayer: false
      }));

      // Add current player if stats provided
      if (currentStats) {
        entries.push({
          id: 'current-player',
          playerName: 'You',
          score: currentStats.score,
          accuracy: currentStats.accuracy,
          gamesPlayed: 1,
          averageTime: currentStats.averageResponseTime || 0,
          highestStreak: currentStats.highestStreak,
          rank: currentStats.rank,
          lastPlayed: Date.now(),
          isCurrentPlayer: true
        });
      }

      return entries;
    };

    setIsLoading(true);
    setTimeout(() => {
      setLeaderboardData(generateMockData());
      setIsLoading(false);
    }, 500);
  }, [currentStats]);

  const getSortedData = () => {
    const type = leaderboardTypes.find(t => t.id === activeType);
    if (!type) return leaderboardData;

    return [...leaderboardData].sort((a, b) => {
      const aValue = a[type.sortKey] as number;
      const bValue = b[type.sortKey] as number;
      return type.sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
    });
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-300" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-amber-600" />;
    return <span className="text-lg font-bold text-gray-400">#{rank}</span>;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/30';
    if (rank === 2) return 'from-gray-400/20 to-gray-500/20 border-gray-400/30';
    if (rank === 3) return 'from-amber-500/20 to-amber-600/20 border-amber-500/30';
    return 'from-gray-700/20 to-gray-800/20 border-gray-600/30';
  };

  const formatTime = (seconds: number) => {
    return `${seconds.toFixed(1)}s`;
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const currentType = leaderboardTypes.find(t => t.id === activeType);
  const sortedData = getSortedData();

  return (
    <div className={`leaderboard ${className}`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-2">Leaderboard</h2>
          <p className="text-gray-400">Compete with Marvel fans worldwide</p>
        </div>

        {/* Leaderboard Type Selector */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {leaderboardTypes.map((type) => {
            const IconComponent = type.icon;
            const isActive = activeType === type.id;
            
            return (
              <motion.button
                key={type.id}
                onClick={() => setActiveType(type.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  p-4 rounded-xl border-2 transition-all duration-300
                  ${isActive 
                    ? "bg-blue-500/30 text-white border-blue-400" 
                    : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border-gray-600"
                  }
                `}
              >
                <IconComponent className="w-6 h-6 mx-auto mb-2" />
                <div className="text-sm font-bold">{type.name}</div>
                <div className="text-xs opacity-70">{type.description}</div>
              </motion.button>
            );
          })}
        </div>

        {/* Leaderboard Content */}
        <div className="bg-gray-900/50 rounded-xl border border-gray-700 overflow-hidden">
          {/* Header */}
          <div className="bg-gray-800/50 p-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {currentType && <currentType.icon className="w-6 h-6 text-blue-400" />}
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {currentType?.name || 'Leaderboard'}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {currentType?.description || 'Top players'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <Users className="w-4 h-4" />
                <span className="text-sm">{sortedData.length} players</span>
              </div>
            </div>
          </div>

          {/* Leaderboard Entries */}
          <div className="max-h-96 overflow-y-auto">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full mx-auto mb-4" />
                  <p className="text-gray-400">Loading leaderboard...</p>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-1"
                >
                  {sortedData.map((player, index) => {
                    const rank = index + 1;
                    return (
                      <motion.div
                        key={player.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`
                          p-4 border-l-4 transition-all duration-300 hover:bg-gray-800/30
                          ${player.isCurrentPlayer 
                            ? 'bg-blue-900/30 border-l-blue-400' 
                            : 'bg-gray-800/20 border-l-transparent hover:border-l-gray-600'
                          }
                        `}
                      >
                        <div className="flex items-center space-x-4">
                          {/* Rank */}
                          <div className="flex-shrink-0 w-12 flex justify-center">
                            {getRankIcon(rank)}
                          </div>

                          {/* Player Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className={`font-bold truncate ${
                                player.isCurrentPlayer ? "text-blue-300" : "text-white"
                              }`}>
                                {player.playerName}
                              </h3>
                              {player.isCurrentPlayer && (
                                <span className="px-2 py-1 bg-blue-500/30 text-blue-300 text-xs rounded-full">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-400">
                              <span className="flex items-center space-x-1">
                                <Trophy className="w-3 h-3" />
                                <span>{player.score.toLocaleString()}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Target className="w-3 h-3" />
                                <span>{player.accuracy.toFixed(1)}%</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>{formatTime(player.averageTime)}</span>
                              </span>
                            </div>
                          </div>

                          {/* Stats */}
                          <div className="text-right">
                            <div className="text-lg font-bold text-white">
                              {currentType?.sortKey === 'score' && player.score.toLocaleString()}
                              {currentType?.sortKey === 'accuracy' && `${player.accuracy.toFixed(1)}%`}
                              {currentType?.sortKey === 'averageTime' && formatTime(player.averageTime)}
                              {currentType?.sortKey === 'highestStreak' && player.highestStreak}
                            </div>
                            <div className="text-xs text-gray-400">
                              {formatDate(player.lastPlayed)}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-800/50 rounded-lg p-4 text-center border border-gray-700">
            <TrendingUp className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <div className="text-lg font-bold text-white">
              {sortedData.length > 0 ? sortedData[0]?.score.toLocaleString() : '0'}
            </div>
            <div className="text-sm text-gray-400">Top Score</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4 text-center border border-gray-700">
            <Target className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <div className="text-lg font-bold text-white">
              {sortedData.length > 0 
                ? `${(sortedData.reduce((acc, p) => acc + p.accuracy, 0) / sortedData.length).toFixed(1)}%`
                : '0%'
              }
            </div>
            <div className="text-sm text-gray-400">Avg Accuracy</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4 text-center border border-gray-700">
            <Users className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <div className="text-lg font-bold text-white">{sortedData.length}</div>
            <div className="text-sm text-gray-400">Total Players</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4 text-center border border-gray-700">
            <Calendar className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <div className="text-lg font-bold text-white">Daily</div>
            <div className="text-sm text-gray-400">Updated</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;