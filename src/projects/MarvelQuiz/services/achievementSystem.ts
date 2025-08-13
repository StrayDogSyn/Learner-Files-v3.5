import { useGameStore } from '../stores/gameStore';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: 'gameplay' | 'knowledge' | 'social' | 'collection' | 'special';
  xpReward: number;
  unlockedAt?: number;
  progress?: number;
  maxProgress?: number;
  hidden?: boolean;
  requirements: {
    type: 'score' | 'streak' | 'accuracy' | 'games_played' | 'time_played' | 'questions_answered' | 'perfect_games' | 'multiplayer_wins' | 'story_chapters' | 'special';
    value: number;
    gameMode?: 'story' | 'blitz' | 'survival' | 'multiplayer';
    difficulty?: 'easy' | 'medium' | 'hard';
    category?: string;
  }[];
}

class AchievementSystem {
  private achievements: Achievement[] = [
    // Gameplay Achievements
    {
      id: 'first_steps',
      title: 'First Steps',
      description: 'Complete your first quiz game',
      icon: '🎯',
      rarity: 'common',
      category: 'gameplay',
      xpReward: 100,
      requirements: [{ type: 'games_played', value: 1 }]
    },
    {
      id: 'quiz_master',
      title: 'Quiz Master',
      description: 'Complete 50 quiz games',
      icon: '🏆',
      rarity: 'rare',
      category: 'gameplay',
      xpReward: 500,
      requirements: [{ type: 'games_played', value: 50 }]
    },
    {
      id: 'marvel_expert',
      title: 'Marvel Expert',
      description: 'Complete 100 quiz games',
      icon: '👑',
      rarity: 'epic',
      category: 'gameplay',
      xpReward: 1000,
      requirements: [{ type: 'games_played', value: 100 }]
    },
    {
      id: 'true_believer',
      title: 'True Believer',
      description: 'Complete 500 quiz games',
      icon: '⭐',
      rarity: 'legendary',
      category: 'gameplay',
      xpReward: 2500,
      requirements: [{ type: 'games_played', value: 500 }]
    },

    // Score Achievements
    {
      id: 'high_scorer',
      title: 'High Scorer',
      description: 'Score 1,000 points in a single game',
      icon: '💯',
      rarity: 'common',
      category: 'gameplay',
      xpReward: 150,
      requirements: [{ type: 'score', value: 1000 }]
    },
    {
      id: 'point_master',
      title: 'Point Master',
      description: 'Score 5,000 points in a single game',
      icon: '🔥',
      rarity: 'rare',
      category: 'gameplay',
      xpReward: 300,
      requirements: [{ type: 'score', value: 5000 }]
    },
    {
      id: 'score_legend',
      title: 'Score Legend',
      description: 'Score 10,000 points in a single game',
      icon: '💎',
      rarity: 'epic',
      category: 'gameplay',
      xpReward: 750,
      requirements: [{ type: 'score', value: 10000 }]
    },
    {
      id: 'infinity_scorer',
      title: 'Infinity Scorer',
      description: 'Score 25,000 points in a single game',
      icon: '♾️',
      rarity: 'legendary',
      category: 'gameplay',
      xpReward: 1500,
      requirements: [{ type: 'score', value: 25000 }]
    },

    // Streak Achievements
    {
      id: 'streak_starter',
      title: 'Streak Starter',
      description: 'Get a 5-question streak',
      icon: '🔥',
      rarity: 'common',
      category: 'gameplay',
      xpReward: 100,
      requirements: [{ type: 'streak', value: 5 }]
    },
    {
      id: 'hot_streak',
      title: 'Hot Streak',
      description: 'Get a 10-question streak',
      icon: '🌟',
      rarity: 'rare',
      category: 'gameplay',
      xpReward: 250,
      requirements: [{ type: 'streak', value: 10 }]
    },
    {
      id: 'unstoppable',
      title: 'Unstoppable',
      description: 'Get a 20-question streak',
      icon: '⚡',
      rarity: 'epic',
      category: 'gameplay',
      xpReward: 500,
      requirements: [{ type: 'streak', value: 20 }]
    },
    {
      id: 'infinity_streak',
      title: 'Infinity Streak',
      description: 'Get a 50-question streak',
      icon: '🌌',
      rarity: 'legendary',
      category: 'gameplay',
      xpReward: 1000,
      requirements: [{ type: 'streak', value: 50 }]
    },

    // Accuracy Achievements
    {
      id: 'sharp_shooter',
      title: 'Sharp Shooter',
      description: 'Achieve 80% accuracy in a game',
      icon: '🎯',
      rarity: 'common',
      category: 'gameplay',
      xpReward: 150,
      requirements: [{ type: 'accuracy', value: 80 }]
    },
    {
      id: 'precision_master',
      title: 'Precision Master',
      description: 'Achieve 90% accuracy in a game',
      icon: '🏹',
      rarity: 'rare',
      category: 'gameplay',
      xpReward: 300,
      requirements: [{ type: 'accuracy', value: 90 }]
    },
    {
      id: 'perfect_aim',
      title: 'Perfect Aim',
      description: 'Achieve 100% accuracy in a game',
      icon: '💯',
      rarity: 'epic',
      category: 'gameplay',
      xpReward: 500,
      requirements: [{ type: 'accuracy', value: 100 }]
    },
    {
      id: 'flawless_victory',
      title: 'Flawless Victory',
      description: 'Complete 10 perfect games',
      icon: '👑',
      rarity: 'legendary',
      category: 'gameplay',
      xpReward: 1000,
      requirements: [{ type: 'perfect_games', value: 10 }]
    },

    // Story Mode Achievements
    {
      id: 'origin_story',
      title: 'Origin Story',
      description: 'Complete Chapter 1 of Story Mode',
      icon: '📖',
      rarity: 'common',
      category: 'gameplay',
      xpReward: 200,
      requirements: [{ type: 'story_chapters', value: 1, gameMode: 'story' }]
    },
    {
      id: 'rising_hero',
      title: 'Rising Hero',
      description: 'Complete 5 Story Mode chapters',
      icon: '🦸',
      rarity: 'rare',
      category: 'gameplay',
      xpReward: 400,
      requirements: [{ type: 'story_chapters', value: 5, gameMode: 'story' }]
    },
    {
      id: 'legendary_hero',
      title: 'Legendary Hero',
      description: 'Complete all Story Mode chapters',
      icon: '🌟',
      rarity: 'epic',
      category: 'gameplay',
      xpReward: 1000,
      requirements: [{ type: 'story_chapters', value: 10, gameMode: 'story' }]
    },

    // Blitz Mode Achievements
    {
      id: 'speed_demon',
      title: 'Speed Demon',
      description: 'Score 1,000 points in Blitz Mode',
      icon: '💨',
      rarity: 'common',
      category: 'gameplay',
      xpReward: 150,
      requirements: [{ type: 'score', value: 1000, gameMode: 'blitz' }]
    },
    {
      id: 'blitz_master',
      title: 'Blitz Master',
      description: 'Score 5,000 points in Blitz Mode',
      icon: '⚡',
      rarity: 'rare',
      category: 'gameplay',
      xpReward: 350,
      requirements: [{ type: 'score', value: 5000, gameMode: 'blitz' }]
    },
    {
      id: 'lightning_fast',
      title: 'Lightning Fast',
      description: 'Score 10,000 points in Blitz Mode',
      icon: '🌩️',
      rarity: 'epic',
      category: 'gameplay',
      xpReward: 750,
      requirements: [{ type: 'score', value: 10000, gameMode: 'blitz' }]
    },

    // Survival Mode Achievements
    {
      id: 'survivor',
      title: 'Survivor',
      description: 'Reach level 5 in Survival Mode',
      icon: '🛡️',
      rarity: 'common',
      category: 'gameplay',
      xpReward: 200,
      requirements: [{ type: 'special', value: 5, gameMode: 'survival' }]
    },
    {
      id: 'endurance_master',
      title: 'Endurance Master',
      description: 'Reach level 10 in Survival Mode',
      icon: '💪',
      rarity: 'rare',
      category: 'gameplay',
      xpReward: 400,
      requirements: [{ type: 'special', value: 10, gameMode: 'survival' }]
    },
    {
      id: 'immortal',
      title: 'Immortal',
      description: 'Reach level 20 in Survival Mode',
      icon: '♾️',
      rarity: 'epic',
      category: 'gameplay',
      xpReward: 800,
      requirements: [{ type: 'special', value: 20, gameMode: 'survival' }]
    },

    // Multiplayer Achievements
    {
      id: 'team_player',
      title: 'Team Player',
      description: 'Play your first multiplayer game',
      icon: '👥',
      rarity: 'common',
      category: 'social',
      xpReward: 150,
      requirements: [{ type: 'games_played', value: 1, gameMode: 'multiplayer' }]
    },
    {
      id: 'champion',
      title: 'Champion',
      description: 'Win 10 multiplayer games',
      icon: '🏆',
      rarity: 'rare',
      category: 'social',
      xpReward: 500,
      requirements: [{ type: 'multiplayer_wins', value: 10 }]
    },
    {
      id: 'grand_champion',
      title: 'Grand Champion',
      description: 'Win 50 multiplayer games',
      icon: '👑',
      rarity: 'epic',
      category: 'social',
      xpReward: 1000,
      requirements: [{ type: 'multiplayer_wins', value: 50 }]
    },

    // Knowledge Achievements
    {
      id: 'comic_reader',
      title: 'Comic Reader',
      description: 'Answer 100 comic-related questions correctly',
      icon: '📚',
      rarity: 'common',
      category: 'knowledge',
      xpReward: 200,
      requirements: [{ type: 'questions_answered', value: 100, category: 'comics' }]
    },
    {
      id: 'character_expert',
      title: 'Character Expert',
      description: 'Answer 100 character-related questions correctly',
      icon: '🦸‍♂️',
      rarity: 'common',
      category: 'knowledge',
      xpReward: 200,
      requirements: [{ type: 'questions_answered', value: 100, category: 'characters' }]
    },
    {
      id: 'movie_buff',
      title: 'Movie Buff',
      description: 'Answer 100 movie-related questions correctly',
      icon: '🎬',
      rarity: 'common',
      category: 'knowledge',
      xpReward: 200,
      requirements: [{ type: 'questions_answered', value: 100, category: 'movies' }]
    },

    // Time-based Achievements
    {
      id: 'dedicated_fan',
      title: 'Dedicated Fan',
      description: 'Play for 1 hour total',
      icon: '⏰',
      rarity: 'common',
      category: 'gameplay',
      xpReward: 100,
      requirements: [{ type: 'time_played', value: 3600 }] // 1 hour in seconds
    },
    {
      id: 'true_fan',
      title: 'True Fan',
      description: 'Play for 10 hours total',
      icon: '⏳',
      rarity: 'rare',
      category: 'gameplay',
      xpReward: 300,
      requirements: [{ type: 'time_played', value: 36000 }] // 10 hours in seconds
    },
    {
      id: 'marvel_addict',
      title: 'Marvel Addict',
      description: 'Play for 50 hours total',
      icon: '🕐',
      rarity: 'epic',
      category: 'gameplay',
      xpReward: 750,
      requirements: [{ type: 'time_played', value: 180000 }] // 50 hours in seconds
    },

    // Special/Hidden Achievements
    {
      id: 'easter_egg_hunter',
      title: 'Easter Egg Hunter',
      description: 'Find a hidden easter egg',
      icon: '🥚',
      rarity: 'rare',
      category: 'special',
      xpReward: 500,
      hidden: true,
      requirements: [{ type: 'special', value: 1 }]
    },
    {
      id: 'stan_lee_tribute',
      title: 'Stan Lee Tribute',
      description: 'Answer a question about Stan Lee correctly',
      icon: '👨‍🦳',
      rarity: 'epic',
      category: 'special',
      xpReward: 1000,
      hidden: true,
      requirements: [{ type: 'special', value: 1 }]
    },
    {
      id: 'infinity_gauntlet',
      title: 'Infinity Gauntlet',
      description: 'Collect all 6 Infinity Stones',
      icon: '💎',
      rarity: 'legendary',
      category: 'collection',
      xpReward: 2000,
      hidden: true,
      requirements: [{ type: 'special', value: 6 }]
    },
    {
      id: 'thanos_snap',
      title: 'The Snap',
      description: 'Experience the Thanos snap animation',
      icon: '👌',
      rarity: 'legendary',
      category: 'special',
      xpReward: 1500,
      hidden: true,
      requirements: [{ type: 'special', value: 1 }]
    }
  ];

  checkAchievements(gameData: any): Achievement[] {
    const unlockedAchievements: Achievement[] = [];
    const player = useGameStore.getState().player;
    if (!player) return unlockedAchievements;
    
    const playerStats = player.stats;
    const unlockedIds = player.achievements.map(a => a.id);

    for (const achievement of this.achievements) {
      // Skip if already unlocked
      if (unlockedIds.includes(achievement.id)) continue;

      // Check if all requirements are met
      const requirementsMet = achievement.requirements.every(req => {
        return this.checkRequirement(req, gameData, playerStats);
      });

      if (requirementsMet) {
        const unlockedAchievement = {
          ...achievement,
          unlockedAt: Date.now()
        };
        unlockedAchievements.push(unlockedAchievement);
      }
    }

    return unlockedAchievements;
  }

  private checkRequirement(
    requirement: Achievement['requirements'][0],
    gameData: any,
    playerStats: any
  ): boolean {
    const { type, value, gameMode, difficulty, category } = requirement;

    // Filter by game mode if specified
    if (gameMode && gameData.mode !== gameMode) {
      // For cumulative stats, check the specific game mode stats
      if (type === 'games_played' || type === 'score' || type === 'multiplayer_wins') {
        const modeStats = playerStats[gameMode] || {};
        switch (type) {
          case 'games_played':
            return (modeStats.gamesPlayed || 0) >= value;
          case 'score':
            return (modeStats.highScore || 0) >= value;
          case 'multiplayer_wins':
            return (modeStats.wins || 0) >= value;
        }
      }
      return false;
    }

    // Filter by difficulty if specified
    if (difficulty && gameData.difficulty !== difficulty) {
      return false;
    }

    // Filter by category if specified
    if (category && gameData.category !== category) {
      return false;
    }

    switch (type) {
      case 'score':
        return gameData.score >= value;
      
      case 'streak':
        return (gameData.maxStreak || gameData.streak || 0) >= value;
      
      case 'accuracy':
        return gameData.accuracy >= value;
      
      case 'games_played':
        return (playerStats.totalGamesPlayed || 0) >= value;
      
      case 'time_played':
        return (playerStats.totalTimePlayed || 0) >= value;
      
      case 'questions_answered':
        const categoryStats = playerStats.categories?.[category || 'total'] || {};
        return (categoryStats.correctAnswers || 0) >= value;
      
      case 'perfect_games':
        return (playerStats.perfectGames || 0) >= value;
      
      case 'multiplayer_wins':
        return (playerStats.multiplayer?.wins || 0) >= value;
      
      case 'story_chapters':
        return (playerStats.story?.chaptersCompleted || 0) >= value;
      
      case 'special':
        // Special achievements are triggered manually
        return gameData.specialTrigger === requirement.type && gameData.specialValue >= value;
      
      default:
        return false;
    }
  }

  getAchievementById(id: string): Achievement | undefined {
    return this.achievements.find(achievement => achievement.id === id);
  }

  getAllAchievements(): Achievement[] {
    return this.achievements;
  }

  getAchievementsByCategory(category: Achievement['category']): Achievement[] {
    return this.achievements.filter(achievement => achievement.category === category);
  }

  getAchievementsByRarity(rarity: Achievement['rarity']): Achievement[] {
    return this.achievements.filter(achievement => achievement.rarity === rarity);
  }

  getVisibleAchievements(): Achievement[] {
    return this.achievements.filter(achievement => !achievement.hidden);
  }

  getHiddenAchievements(): Achievement[] {
    return this.achievements.filter(achievement => achievement.hidden);
  }

  calculateProgress(achievement: Achievement, playerStats: any): number {
    if (achievement.requirements.length === 0) return 0;

    const requirement = achievement.requirements[0]; // Use first requirement for progress
    const { type, value, gameMode, category } = requirement;

    let currentValue = 0;

    switch (type) {
      case 'score':
        if (gameMode) {
          currentValue = playerStats[gameMode]?.highScore || 0;
        } else {
          currentValue = playerStats.highScore || 0;
        }
        break;
      
      case 'streak':
        currentValue = playerStats.maxStreak || 0;
        break;
      
      case 'games_played':
        if (gameMode) {
          currentValue = playerStats[gameMode]?.gamesPlayed || 0;
        } else {
          currentValue = playerStats.totalGamesPlayed || 0;
        }
        break;
      
      case 'time_played':
        currentValue = playerStats.totalTimePlayed || 0;
        break;
      
      case 'questions_answered':
        const categoryStats = playerStats.categories?.[category || 'total'] || {};
        currentValue = categoryStats.correctAnswers || 0;
        break;
      
      case 'perfect_games':
        currentValue = playerStats.perfectGames || 0;
        break;
      
      case 'multiplayer_wins':
        currentValue = playerStats.multiplayer?.wins || 0;
        break;
      
      case 'story_chapters':
        currentValue = playerStats.story?.chaptersCompleted || 0;
        break;
      
      default:
        currentValue = 0;
    }

    return Math.min(currentValue / value, 1) * 100;
  }

  // Trigger special achievements manually
  triggerSpecialAchievement(achievementId: string, gameData: any = {}): Achievement | null {
    const achievement = this.getAchievementById(achievementId);
    if (!achievement) return null;

    const player = useGameStore.getState().player;
    if (!player) return null;
    
    const unlockedIds = player.achievements.map(a => a.id);
    if (unlockedIds.includes(achievementId)) return null;

    const specialGameData = {
      ...gameData,
      specialTrigger: 'special',
      specialValue: 1
    };

    const unlocked = this.checkAchievements(specialGameData);
    return unlocked.find(a => a.id === achievementId) || null;
  }

  // Get achievement statistics
  getAchievementStats(playerAchievements: Achievement[]): {
    total: number;
    unlocked: number;
    completion: number;
    totalXP: number;
    byRarity: Record<string, number>;
    byCategory: Record<string, number>;
  } {
    const total = this.achievements.length;
    const unlocked = playerAchievements.length;
    const completion = (unlocked / total) * 100;
    const totalXP = playerAchievements.reduce((sum, achievement) => sum + achievement.xpReward, 0);

    const byRarity = {
      common: 0,
      rare: 0,
      epic: 0,
      legendary: 0
    };

    const byCategory = {
      gameplay: 0,
      knowledge: 0,
      social: 0,
      collection: 0,
      special: 0
    };

    playerAchievements.forEach(achievement => {
      byRarity[achievement.rarity]++;
      byCategory[achievement.category]++;
    });

    return {
      total,
      unlocked,
      completion,
      totalXP,
      byRarity,
      byCategory
    };
  }
}

export const achievementSystem = new AchievementSystem();
export default achievementSystem;