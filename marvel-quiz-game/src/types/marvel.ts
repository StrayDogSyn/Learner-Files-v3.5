// Marvel API Response Types
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

// Marvel Character Types
export interface MarvelCharacter {
  id: number;
  name: string;
  description: string;
  modified: string;
  thumbnail: MarvelImage;
  resourceURI: string;
  comics: MarvelResourceList;
  series: MarvelResourceList;
  stories: MarvelResourceList;
  events: MarvelResourceList;
  urls: MarvelUrl[];
}

export interface MarvelImage {
  path: string;
  extension: string;
}

export interface MarvelResourceList {
  available: number;
  collectionURI: string;
  items: MarvelResourceSummary[];
  returned: number;
}

export interface MarvelResourceSummary {
  resourceURI: string;
  name: string;
  type?: string;
}

export interface MarvelUrl {
  type: string;
  url: string;
}

// Marvel Comic Types
export interface MarvelComic {
  id: number;
  digitalId: number;
  title: string;
  issueNumber: number;
  variantDescription: string;
  description: string;
  modified: string;
  isbn: string;
  upc: string;
  diamondCode: string;
  ean: string;
  issn: string;
  format: string;
  pageCount: number;
  textObjects: MarvelTextObject[];
  resourceURI: string;
  urls: MarvelUrl[];
  series: MarvelResourceSummary;
  variants: MarvelResourceSummary[];
  collections: MarvelResourceSummary[];
  collectedIssues: MarvelResourceSummary[];
  dates: MarvelDate[];
  prices: MarvelPrice[];
  thumbnail: MarvelImage;
  images: MarvelImage[];
  creators: MarvelResourceList;
  characters: MarvelResourceList;
  stories: MarvelResourceList;
  events: MarvelResourceList;
}

export interface MarvelTextObject {
  type: string;
  language: string;
  text: string;
}

export interface MarvelDate {
  type: string;
  date: string;
}

export interface MarvelPrice {
  type: string;
  price: number;
}

// Quiz Game Types
export interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'fill-blank';
  category: 'character' | 'comic' | 'movie' | 'general';
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  imageUrl?: string;
  character?: MarvelCharacter;
  comic?: MarvelComic;
  points: number;
  timeLimit: number;
  hints?: string[];
}

// Game Statistics
export interface GameStats {
  totalGames: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  averageScore: number;
  bestScore: number;
  currentStreak: number;
  longestStreak: number;
  totalPlayTime: number;
  averageResponseTime: number;
  difficultyStats: {
    easy: DifficultyStats;
    medium: DifficultyStats;
    hard: DifficultyStats;
  };
  categoryStats: {
    character: CategoryStats;
    comic: CategoryStats;
    movie: CategoryStats;
    general: CategoryStats;
  };
  achievements: Achievement[];
  powerUpsUsed: number;
  hintsUsed: number;
  perfectGames: number;
  lastPlayed: Date;
}

export interface DifficultyStats {
  gamesPlayed: number;
  questionsAnswered: number;
  correctAnswers: number;
  averageScore: number;
  bestScore: number;
}

export interface CategoryStats {
  questionsAnswered: number;
  correctAnswers: number;
  averageResponseTime: number;
  accuracy: number;
}

// Achievement System
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  category: 'score' | 'streak' | 'speed' | 'knowledge' | 'special';
  requirement: {
    type: 'score' | 'streak' | 'games' | 'accuracy' | 'time' | 'special';
    value: number;
    condition?: string;
  };
  reward?: {
    type: 'points' | 'powerup' | 'title';
    value: number | string;
  };
  unlockedAt?: Date;
  progress?: number;
  maxProgress?: number;
}

// Power-up System
export interface PowerUp {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'hint' | 'time' | 'score' | 'skip' | 'shield';
  cost: number;
  duration?: number;
  cooldown?: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  effect: {
    type: 'remove-options' | 'add-time' | 'double-points' | 'skip-question' | 'prevent-penalty';
    value: number;
  };
  available: boolean;
  usageCount?: number;
  lastUsed?: Date;
}

// Game Session
export interface GameSession {
  id: string;
  startTime: number;
  endTime?: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category?: 'character' | 'comic' | 'movie' | 'general' | 'mixed';
  questions: QuizQuestion[];
  answers: GameAnswer[];
  score: number;
  finalStats: {
    correctAnswers: number;
    incorrectAnswers: number;
    totalTime: number;
    averageResponseTime: number;
    accuracy: number;
    streak: number;
    powerUpsUsed: PowerUp[];
    hintsUsed: number;
    achievements: Achievement[];
  };
  completed: boolean;
}

export interface GameAnswer {
  questionId: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  responseTime: number;
  pointsEarned: number;
  hintsUsed: number;
  powerUpsUsed: string[];
  timestamp: number;
}

// Performance Metrics
export interface PerformanceMetrics {
  averageResponseTime: number;
  totalResponseTime: number;
  questionsAnswered: number;
  correctAnswers: number;
  incorrectAnswers: number;
  hintsUsed: number;
  powerUpsUsed: number;
  gameStartTime: number;
  gameEndTime: number;
  peakStreak: number;
  accuracyTrend: number[];
  speedTrend: number[];
}

// UI State Management
export interface UIState {
  isLoading: boolean;
  error: string | null;
  showHint: boolean;
  showPowerUps: boolean;
  showAchievements: boolean;
  showLeaderboard: boolean;
  showSettings: boolean;
  animationState: AnimationState;
  theme: 'light' | 'dark' | 'marvel';
  soundEnabled: boolean;
  musicEnabled: boolean;
  effectsEnabled: boolean;
}

export interface AnimationState {
  type: 'idle' | 'correct' | 'incorrect' | 'powerup' | 'achievement' | 'loading';
  intensity: 'low' | 'medium' | 'high';
  duration: number;
  particles?: ParticleConfig[];
}

export interface ParticleConfig {
  type: 'star' | 'explosion' | 'sparkle' | 'fire' | 'lightning';
  count: number;
  color: string;
  size: number;
  velocity: number;
  lifetime: number;
  gravity: number;
}

// Sound Configuration
export interface SoundConfig {
  masterVolume: number;
  musicVolume: number;
  effectsVolume: number;
  muted: boolean;
}

// Leaderboard
export interface LeaderboardEntry {
  id: string;
  playerName: string;
  score: number;
  accuracy: number;
  gamesPlayed: number;
  averageScore: number;
  bestStreak: number;
  totalPlayTime: number;
  achievements: number;
  rank: number;
  lastPlayed: Date;
  avatar?: string;
}

// Game Configuration
export interface GameConfig {
  questionsPerGame: number;
  timePerQuestion: number;
  pointsPerCorrect: number;
  pointsPerIncorrect: number;
  streakBonus: number;
  timeBonus: number;
  difficultyMultiplier: {
    easy: number;
    medium: number;
    hard: number;
  };
  powerUpCosts: {
    hint: number;
    time: number;
    skip: number;
    shield: number;
  };
  achievementPoints: {
    common: number;
    uncommon: number;
    rare: number;
    epic: number;
    legendary: number;
  };
}

// API Configuration
export interface MarvelApiConfig {
  publicKey: string;
  privateKey: string;
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
  cacheEnabled: boolean;
  cacheDuration: number;
}

// Error Types
export interface GameError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
  recoverable: boolean;
}

// Utility Types
export type QuestionDifficulty = 'easy' | 'medium' | 'hard';
export type QuestionCategory = 'character' | 'comic' | 'movie' | 'general';
export type GameState = 'menu' | 'loading' | 'playing' | 'paused' | 'finished' | 'error';
export type AchievementRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
export type PowerUpType = 'hint' | 'time' | 'score' | 'skip' | 'shield';
export type SoundType = 'correct' | 'incorrect' | 'powerup' | 'achievement' | 'button' | 'timer' | 'background';

// Component Props
export interface MarvelQuizProps {
  onGameComplete?: (session: GameSession) => void;
  difficulty?: QuestionDifficulty;
  category?: QuestionCategory;
  theme?: 'light' | 'dark' | 'marvel';
  config?: Partial<GameConfig>;
  enableSound?: boolean;
  enableAnimations?: boolean;
  showLeaderboard?: boolean;
  customQuestions?: QuizQuestion[];
}

export interface QuestionCardProps {
  question: QuizQuestion;
  selectedAnswer: string | null;
  showResult: boolean;
  onAnswerSelect: (answer: string) => void;
  timeLeft: number;
  disabled: boolean;
  showHint: boolean;
}

export interface GameStatsProps {
  stats: GameStats;
  currentSession?: GameSession;
  showDetailed?: boolean;
  onClose?: () => void;
}

export interface PowerUpCardProps {
  powerUp: PowerUp;
  onActivate: (powerUpId: string) => void;
  disabled: boolean;
  currentPoints: number;
}

export interface AchievementCardProps {
  achievement: Achievement;
  unlocked: boolean;
  showProgress?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentPlayer?: LeaderboardEntry;
  onClose?: () => void;
  timeframe?: 'daily' | 'weekly' | 'monthly' | 'all-time';
}

// Animation and Effects
export interface FloatingTextOptions {
  color?: string;
  size?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  curve?: boolean;
}

export interface ScreenShakeOptions {
  intensity?: number;
  duration?: number;
  direction?: 'horizontal' | 'vertical' | 'both';
}

export interface ParticleSystemOptions {
  type: 'success' | 'error' | 'powerup' | 'achievement' | 'streak';
  count?: number;
  duration?: number;
  spread?: number;
  colors?: string[];
}

// Local Storage Types
export interface StoredGameData {
  stats: GameStats;
  achievements: Achievement[];
  settings: {
    sound: SoundConfig;
    ui: Partial<UIState>;
    difficulty: QuestionDifficulty;
    category: QuestionCategory;
  };
  sessions: GameSession[];
  lastUpdated: Date;
  version: string;
}

// API Cache Types
export interface CachedApiResponse<T> {
  data: T;
  timestamp: number;
  expiry: number;
  etag?: string;
}

export interface ApiCache {
  characters: Map<string, CachedApiResponse<MarvelCharacter[]>>;
  comics: Map<string, CachedApiResponse<MarvelComic[]>>;
  images: Map<string, CachedApiResponse<string>>;
}

// Event Types
export interface GameEvent {
  type: 'question-answered' | 'powerup-used' | 'achievement-unlocked' | 'game-completed' | 'streak-achieved';
  data: any;
  timestamp: number;
  sessionId: string;
}

export interface AnalyticsEvent {
  event: string;
  properties: Record<string, any>;
  timestamp: number;
  sessionId: string;
  userId?: string;
}

// Validation Types
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface QuestionValidation extends ValidationResult {
  question: QuizQuestion;
  suggestions: string[];
}

// Export all types for easy importing
export type {
  MarvelApiResponse,
  MarvelCharacter,
  MarvelComic,
  QuizQuestion,
  GameStats,
  Achievement,
  PowerUp,
  GameSession,
  PerformanceMetrics,
  UIState,
  AnimationState,
  SoundConfig,
  LeaderboardEntry,
  GameConfig,
  MarvelApiConfig,
  GameError
};