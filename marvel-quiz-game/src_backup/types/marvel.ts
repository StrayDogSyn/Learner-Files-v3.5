// Marvel API TypeScript Interfaces
// Comprehensive type definitions for Marvel API integration

export interface MarvelCharacter {
  id: number;
  name: string;
  description: string;
  modified: string;
  thumbnail: {
    path: string;
    extension: string;
  };
  resourceURI: string;
  comics: {
    available: number;
    collectionURI: string;
    items: Array<{
      resourceURI: string;
      name: string;
    }>;
  };
  series: {
    available: number;
    collectionURI: string;
    items: Array<{
      resourceURI: string;
      name: string;
    }>;
  };
  stories: {
    available: number;
    collectionURI: string;
    items: Array<{
      resourceURI: string;
      name: string;
      type: string;
    }>;
  };
  events: {
    available: number;
    collectionURI: string;
    items: Array<{
      resourceURI: string;
      name: string;
    }>;
  };
  urls: Array<{
    type: string;
    url: string;
  }>;
}

export interface MarvelComic {
  id: number;
  digitalId: number;
  title: string;
  issueNumber: number;
  variantDescription: string;
  description: string | null;
  modified: string;
  isbn: string;
  upc: string;
  diamondCode: string;
  ean: string;
  issn: string;
  format: string;
  pageCount: number;
  textObjects: Array<{
    type: string;
    language: string;
    text: string;
  }>;
  resourceURI: string;
  urls: Array<{
    type: string;
    url: string;
  }>;
  series: {
    resourceURI: string;
    name: string;
  };
  variants: Array<{
    resourceURI: string;
    name: string;
  }>;
  collections: Array<{
    resourceURI: string;
    name: string;
  }>;
  collectedIssues: Array<{
    resourceURI: string;
    name: string;
  }>;
  dates: Array<{
    type: string;
    date: string;
  }>;
  prices: Array<{
    type: string;
    price: number;
  }>;
  thumbnail: {
    path: string;
    extension: string;
  };
  images: Array<{
    path: string;
    extension: string;
  }>;
  creators: {
    available: number;
    collectionURI: string;
    items: Array<{
      resourceURI: string;
      name: string;
      role: string;
    }>;
  };
  characters: {
    available: number;
    collectionURI: string;
    items: Array<{
      resourceURI: string;
      name: string;
    }>;
  };
  stories: {
    available: number;
    collectionURI: string;
    items: Array<{
      resourceURI: string;
      name: string;
      type: string;
    }>;
  };
  events: {
    available: number;
    collectionURI: string;
    items: Array<{
      resourceURI: string;
      name: string;
    }>;
  };
}

export interface MarvelSeries {
  id: number;
  title: string;
  description: string | null;
  resourceURI: string;
  urls: Array<{
    type: string;
    url: string;
  }>;
  startYear: number;
  endYear: number;
  rating: string;
  type: string;
  modified: string;
  thumbnail: {
    path: string;
    extension: string;
  };
  creators: {
    available: number;
    collectionURI: string;
    items: Array<{
      resourceURI: string;
      name: string;
      role: string;
    }>;
  };
  characters: {
    available: number;
    collectionURI: string;
    items: Array<{
      resourceURI: string;
      name: string;
    }>;
  };
  stories: {
    available: number;
    collectionURI: string;
    items: Array<{
      resourceURI: string;
      name: string;
      type: string;
    }>;
  };
  comics: {
    available: number;
    collectionURI: string;
    items: Array<{
      resourceURI: string;
      name: string;
    }>;
  };
  events: {
    available: number;
    collectionURI: string;
    items: Array<{
      resourceURI: string;
      name: string;
    }>;
  };
  next: {
    resourceURI: string;
    name: string;
  } | null;
  previous: {
    resourceURI: string;
    name: string;
  } | null;
}

export interface MarvelEvent {
  id: number;
  title: string;
  description: string | null;
  resourceURI: string;
  urls: Array<{
    type: string;
    url: string;
  }>;
  modified: string;
  start: string;
  end: string;
  thumbnail: {
    path: string;
    extension: string;
  };
  creators: {
    available: number;
    collectionURI: string;
    items: Array<{
      resourceURI: string;
      name: string;
      role: string;
    }>;
  };
  characters: {
    available: number;
    collectionURI: string;
    items: Array<{
      resourceURI: string;
      name: string;
    }>;
  };
  stories: {
    available: number;
    collectionURI: string;
    items: Array<{
      resourceURI: string;
      name: string;
      type: string;
    }>;
  };
  comics: {
    available: number;
    collectionURI: string;
    items: Array<{
      resourceURI: string;
      name: string;
    }>;
  };
  series: {
    available: number;
    collectionURI: string;
    items: Array<{
      resourceURI: string;
      name: string;
    }>;
  };
  next: {
    resourceURI: string;
    name: string;
  } | null;
  previous: {
    resourceURI: string;
    name: string;
  } | null;
}

export interface MarvelApiResponse<T> {
  code: number;
  status: string;
  copyright: string;
  attributionText: string;
  attributionHTML: string;
  etag: string;
  data: {
    offset: number;
    limit: number;
    total: number;
    count: number;
    results: T[];
  };
}

// Quiz-specific interfaces
export interface QuizQuestion {
  id: string;
  type: 'character' | 'power' | 'creator' | 'appearance' | 'comic' | 'team' | 'series' | 'event';
  question: string;
  character?: MarvelCharacter;
  comic?: MarvelComic;
  series?: MarvelSeries;
  event?: MarvelEvent;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  timeLimit: number;
  category: 'heroes' | 'villains' | 'teams' | 'cosmic' | 'street' | 'thunderbolts' | 'wakanda' | 'xmen' | 'avengers' | 'spiderverse';
  imageUrl?: string;
  hints?: string[];
}

export interface GameStats {
  questionsAnswered: number;
  correctAnswers: number;
  accuracy: number;
  averageResponseTime: number;
  powerUpsUsed: number;
  highestStreak: number;
  currentStreak: number;
  totalTimeSpent: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
  rank: string;
  characterMatch: string;
  score: number;
  bonusPoints: number;
  perfectAnswers: number;
  fastAnswers: number;
  categoriesCompleted: string[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (stats: GameStats) => boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  unlockedAt?: Date;
  progress?: number;
  maxProgress?: number;
}

export interface PowerUp {
  id: string;
  name: string;
  description: string;
  icon: string;
  effect: 'skip_question' | 'extra_time' | 'eliminate_two' | 'hint' | 'double_points';
  duration?: number;
  cost: number;
  rarity: 'common' | 'rare' | 'epic';
  cooldown?: number;
}

export interface PlayerProfile {
  id: string;
  username: string;
  avatar?: string;
  level: number;
  experience: number;
  totalGamesPlayed: number;
  bestScore: number;
  favoriteCharacter?: string;
  achievements: Achievement[];
  powerUps: PowerUp[];
  preferences: {
    difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
    soundEnabled: boolean;
    animationsEnabled: boolean;
    theme: 'light' | 'dark' | 'marvel';
  };
  statistics: GameStats;
  createdAt: Date;
  lastPlayed: Date;
}

export interface LeaderboardEntry {
  rank: number;
  player: {
    id: string;
    username: string;
    avatar?: string;
    level: number;
  };
  score: number;
  accuracy: number;
  gamesPlayed: number;
  averageTime: number;
  lastPlayed: Date;
}

export interface GameSession {
  id: string;
  playerId: string;
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  answers: Array<{
    questionId: string;
    selectedAnswer: string;
    isCorrect: boolean;
    timeSpent: number;
    pointsEarned: number;
    powerUpsUsed: PowerUp[];
  }>;
  startTime: Date;
  endTime?: Date;
  status: 'active' | 'completed' | 'abandoned';
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
  gameMode: 'classic' | 'timed' | 'survival' | 'challenge';
  powerUpsAvailable: PowerUp[];
  currentStats: GameStats;
}

// API Error handling
export interface MarvelApiError {
  code: number;
  status: string;
  message: string;
  timestamp: Date;
}

// Cache interface for API responses
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

// Configuration interfaces
export interface MarvelApiConfig {
  publicKey: string;
  privateKey: string;
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
  cacheExpiry: number;
}

export interface QuizConfig {
  questionsPerGame: number;
  timePerQuestion: number;
  pointsPerCorrectAnswer: number;
  bonusTimeThreshold: number;
  streakBonusMultiplier: number;
  difficultyMultipliers: {
    easy: number;
    medium: number;
    hard: number;
  };
  powerUpCosts: {
    skip_question: number;
    extra_time: number;
    eliminate_two: number;
    hint: number;
    double_points: number;
  };
}

// Utility types
export type QuestionType = QuizQuestion['type'];
export type Difficulty = QuizQuestion['difficulty'];
export type Category = QuizQuestion['category'];
export type GameMode = GameSession['gameMode'];
export type PowerUpEffect = PowerUp['effect'];
export type AchievementRarity = Achievement['rarity'];

// Response wrapper for API calls
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: MarvelApiError;
  cached?: boolean;
  timestamp: Date;
}

// Search and filter interfaces
export interface SearchFilters {
  nameStartsWith?: string;
  modifiedSince?: string;
  comics?: number[];
  series?: number[];
  events?: number[];
  stories?: number[];
  orderBy?: string;
  limit?: number;
  offset?: number;
}

export interface QuizFilters {
  difficulty?: Difficulty[];
  category?: Category[];
  type?: QuestionType[];
  minPoints?: number;
  maxPoints?: number;
  hasImage?: boolean;
}

// Performance monitoring
export interface PerformanceMetrics {
  apiResponseTime: number;
  renderTime: number;
  memoryUsage: number;
  cacheHitRate: number;
  errorRate: number;
  userEngagement: {
    averageSessionDuration: number;
    questionsPerSession: number;
    returnRate: number;
  };
}

// Animation and UI state
export interface AnimationState {
  isLoading: boolean;
  isTransitioning: boolean;
  currentAnimation: string | null;
  progress: number;
}

export interface UIState {
  theme: 'light' | 'dark' | 'marvel';
  soundEnabled: boolean;
  animationsEnabled: boolean;
  showHints: boolean;
  showExplanations: boolean;
  autoAdvance: boolean;
}

// Event tracking for analytics
export interface GameEvent {
  type: 'question_answered' | 'power_up_used' | 'game_completed' | 'achievement_unlocked';
  timestamp: Date;
  data: Record<string, any>;
  sessionId: string;
  playerId: string;
}

export default {
  MarvelCharacter,
  MarvelComic,
  MarvelSeries,
  MarvelEvent,
  MarvelApiResponse,
  QuizQuestion,
  GameStats,
  Achievement,
  PowerUp,
  PlayerProfile,
  LeaderboardEntry,
  GameSession,
  MarvelApiError,
  CacheEntry,
  MarvelApiConfig,
  QuizConfig,
  ApiResponse,
  SearchFilters,
  QuizFilters,
  PerformanceMetrics,
  AnimationState,
  UIState,
  GameEvent
};