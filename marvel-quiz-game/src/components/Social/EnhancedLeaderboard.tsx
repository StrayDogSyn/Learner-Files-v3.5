import React, { useState, useEffect, useMemo } from 'react';
import { LeaderboardEntry, GameStats } from '../../types/marvel';
import { ProgressBar, CircularProgress } from '../UI/ProgressIndicators';
import { FadeAnimation, SlideAnimation } from '../UI/EnhancedAnimations';

export interface EnhancedLeaderboardProps {
  entries: LeaderboardEntry[];
  currentPlayer?: LeaderboardEntry;
  onPlayerSelect?: (player: LeaderboardEntry) => void;
  compact?: boolean;
  showFilters?: boolean;
  maxEntries?: number;
}

export interface LeaderboardFilters {
  timeframe: 'all' | 'week' | 'month' | 'today';
  category: 'all' | 'score' | 'accuracy' | 'speed' | 'streak';
  difficulty: 'all' | 'easy' | 'medium' | 'hard' | 'expert';
  gameMode: 'all' | 'classic' | 'survival' | 'timeAttack' | 'daily';
}

export interface PlayerRankInfo {
  rank: number;
  percentile: number;
  improvement: number;
  trend: 'up' | 'down' | 'stable';
}

const EnhancedLeaderboard: React.FC<EnhancedLeaderboardProps> = ({
  entries,
  currentPlayer,
  onPlayerSelect,
  compact = false,
  showFilters = true,
  maxEntries = 50
}) => {
  const [filters, setFilters] = useState<LeaderboardFilters>({
    timeframe: 'all',
    category: 'score',
    difficulty: 'all',
    gameMode: 'all'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedPlayer, setSelectedPlayer] = useState<LeaderboardEntry | null>(null);

  // Filter and sort entries
  const filteredEntries = useMemo(() => {
    let filtered = [...entries];

    // Apply timeframe filter
    if (filters.timeframe !== 'all') {
      const now = new Date();
      const timeframes = {
        today: 1,
        week: 7,
        month: 30
      };
      const daysBack = timeframes[filters.timeframe as keyof typeof timeframes];
      const cutoffDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);
      
      filtered = filtered.filter(entry => 
        new Date(entry.timestamp) >= cutoffDate
      );
    }

    // Apply difficulty filter
    if (filters.difficulty !== 'all') {
      filtered = filtered.filter(entry => 
        entry.difficulty === filters.difficulty
      );
    }

    // Apply game mode filter
    if (filters.gameMode !== 'all') {
      filtered = filtered.filter(entry => 
        entry.gameMode === filters.gameMode
      );
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(entry =>
        entry.playerName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort by category
    filtered.sort((a, b) => {
      let aValue: number, bValue: number;
      
      switch (filters.category) {
        case 'accuracy':
          aValue = a.accuracy;
          bValue = b.accuracy;
          break;
        case 'speed':
          aValue = a.averageTime || 0;
          bValue = b.averageTime || 0;
          // For speed, lower is better, so reverse the comparison
          return sortOrder === 'desc' ? aValue - bValue : bValue - aValue;
        case 'streak':
          aValue = a.longestStreak || 0;
          bValue = b.longestStreak || 0;
          break;
        case 'score':
        default:
          aValue = a.score;
          bValue = b.score;
          break;
      }
      
      return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
    });

    return filtered.slice(0, maxEntries);
  }, [entries, filters, searchTerm, sortOrder, maxEntries]);

  // Get player rank information
  const getPlayerRankInfo = (player: LeaderboardEntry): PlayerRankInfo => {
    const rank = filteredEntries.findIndex(entry => entry.id === player.id) + 1;
    const percentile = Math.round((1 - (rank - 1) / filteredEntries.length) * 100);
    
    // Mock improvement calculation (in a real app, this would compare with previous period)
    const improvement = Math.floor(Math.random() * 21) - 10; // -10 to +10
    const trend = improvement > 2 ? 'up' : improvement < -2 ? 'down' : 'stable';
    
    return { rank, percentile, improvement, trend };
  };

  const handlePlayerClick = (player: LeaderboardEntry) => {
    setSelectedPlayer(player);
    if (onPlayerSelect) {
      onPlayerSelect(player);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return `#${rank}`;
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return '📈';
      case 'down':
        return '📉';
      default:
        return '➡️';
    }
  };

  if (compact) {
    return (
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-4">Leaderboard</h3>
        <div className="space-y-2">
          {filteredEntries.slice(0, 5).map((entry, index) => (
            <FadeAnimation key={entry.id} delay={index * 50}>
              <div className="flex items-center justify-between p-2 bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{getRankIcon(index + 1)}</span>
                  <span className="text-white font-medium">{entry.playerName}</span>
                </div>
                <span className="text-blue-400 font-bold">{entry.score}</span>
              </div>
            </FadeAnimation>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Leaderboard</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="px-3 py-1 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            {sortOrder === 'desc' ? '↓' : '↑'}
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="mb-6 space-y-4">
          {/* Search */}
          <div>
            <input
              type="text"
              placeholder="Search players..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Filter buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Timeframe */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">Timeframe</label>
              <select
                value={filters.timeframe}
                onChange={(e) => setFilters(prev => ({ ...prev, timeframe: e.target.value as any }))}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value as any }))}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              >
                <option value="score">Score</option>
                <option value="accuracy">Accuracy</option>
                <option value="speed">Speed</option>
                <option value="streak">Streak</option>
              </select>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">Difficulty</label>
              <select
                value={filters.difficulty}
                onChange={(e) => setFilters(prev => ({ ...prev, difficulty: e.target.value as any }))}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              >
                <option value="all">All</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
                <option value="expert">Expert</option>
              </select>
            </div>

            {/* Game Mode */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">Game Mode</label>
              <select
                value={filters.gameMode}
                onChange={(e) => setFilters(prev => ({ ...prev, gameMode: e.target.value as any }))}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              >
                <option value="all">All</option>
                <option value="classic">Classic</option>
                <option value="survival">Survival</option>
                <option value="timeAttack">Time Attack</option>
                <option value="daily">Daily Challenge</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Current Player Stats */}
      {currentPlayer && (
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Your Rank</h3>
              <div className="flex items-center space-x-4 mt-2">
                <span className="text-2xl">{getRankIcon(getPlayerRankInfo(currentPlayer).rank)}</span>
                <div>
                  <div className="text-white font-medium">{currentPlayer.playerName}</div>
                  <div className="text-blue-200 text-sm">
                    Top {getPlayerRankInfo(currentPlayer).percentile}% • Score: {currentPlayer.score}
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{getTrendIcon(getPlayerRankInfo(currentPlayer).trend)}</span>
                <span className="text-white font-medium">
                  {getPlayerRankInfo(currentPlayer).improvement > 0 ? '+' : ''}
                  {getPlayerRankInfo(currentPlayer).improvement}
                </span>
              </div>
              <div className="text-blue-200 text-sm">vs last period</div>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Entries */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredEntries.map((entry, index) => {
          const rankInfo = getPlayerRankInfo(entry);
          const isCurrentPlayer = currentPlayer?.id === entry.id;
          
          return (
            <SlideAnimation key={entry.id} delay={index * 30} direction="left">
              <div
                className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                  isCurrentPlayer
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 ring-2 ring-blue-400'
                    : selectedPlayer?.id === entry.id
                    ? 'bg-gray-600 ring-2 ring-gray-400'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
                onClick={() => handlePlayerClick(entry)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Rank */}
                    <div className="text-center min-w-[3rem]">
                      <div className="text-2xl">{getRankIcon(index + 1)}</div>
                      {rankInfo.trend !== 'stable' && (
                        <div className="text-xs">{getTrendIcon(rankInfo.trend)}</div>
                      )}
                    </div>

                    {/* Player Info */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-white font-semibold">{entry.playerName}</span>
                        {isCurrentPlayer && (
                          <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
                            You
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-300 mt-1">
                        {filters.category === 'accuracy' && `${entry.accuracy}% accuracy`}
                        {filters.category === 'speed' && `${entry.averageTime?.toFixed(1)}s avg`}
                        {filters.category === 'streak' && `${entry.longestStreak} streak`}
                        {filters.category === 'score' && `${entry.questionsAnswered} questions`}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="text-right">
                      <div className="text-xl font-bold text-white">
                        {filters.category === 'accuracy' && `${entry.accuracy}%`}
                        {filters.category === 'speed' && `${entry.averageTime?.toFixed(1)}s`}
                        {filters.category === 'streak' && entry.longestStreak}
                        {filters.category === 'score' && entry.score}
                      </div>
                      <div className="text-sm text-gray-400">
                        {new Date(entry.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded details for selected player */}
                {selectedPlayer?.id === entry.id && (
                  <FadeAnimation>
                    <div className="mt-4 pt-4 border-t border-gray-600">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-400">{entry.score}</div>
                          <div className="text-xs text-gray-400">Score</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-400">{entry.accuracy}%</div>
                          <div className="text-xs text-gray-400">Accuracy</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-yellow-400">{entry.longestStreak}</div>
                          <div className="text-xs text-gray-400">Best Streak</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-purple-400">
                            {entry.averageTime?.toFixed(1)}s
                          </div>
                          <div className="text-xs text-gray-400">Avg Time</div>
                        </div>
                      </div>
                    </div>
                  </FadeAnimation>
                )}
              </div>
            </SlideAnimation>
          );
        })}
      </div>

      {filteredEntries.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-400 text-lg">No players found</div>
          <div className="text-gray-500 text-sm mt-2">
            Try adjusting your filters or search term
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedLeaderboard;