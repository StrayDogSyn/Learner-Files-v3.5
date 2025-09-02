// Game Types
export interface Player {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  level: number;
  experience: number;
  totalScore: number;
  gamesPlayed: number;
  achievements: Achievement[];
  preferences: PlayerPreferences;
  statistics: PlayerStatistics;
  stats: PlayerStatistics;
}

export interface PlayerPreferences {
  soundEnabled: boolean;
  musicEnabled: boolean;
  animationsEnabled: boolean;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  theme: 'light' | 'dark' | 'auto';
  language: string;
}

export interface PlayerStatistics {
  totalQuestionsAnswered: number;
  correctAnswers: number;
  averageResponseTime: number;
  bestStreak: number;
  favoriteCategory: string;
  timeSpentPlaying: number; // in minutes
  totalScore: number;
  averageAccuracy: number;
  gamesPlayed: number;
}

// Game Session Types
export interface GameSession {
  id: string;
  playerId: string;
  gameMode: GameMode;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  score: number;
  lives: number;
  streak: number;
  timeRemaining: number;
  startTime: number;
  endTime?: number;
  status: 'waiting' | 'active' | 'paused' | 'completed' | 'abandoned';
  answers: PlayerAnswer[];
}

export interface PlayerAnswer {
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  responseTime: number; // in milliseconds
  pointsEarned: number;
  hintsUsed: number;
  timestamp: number;
}

// Game Modes
export type GameMode = 'story' | 'blitz' | 'survival' | 'multiplayer';

export interface GameModeConfig {
  name: string;
  description: string;
  icon: string;
  timeLimit?: number;
  questionCount?: number;
  lives?: number;
  difficultyProgression: boolean;
  multiplayer: boolean;
  features: string[];
}

// Quiz Question Types (re-export from questionGenerator)
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'characters' | 'comics' | 'movies' | 'general' | 'powers' | 'teams';
  timeLimit: number;
  explanation?: string;
  imageUrl?: string;
}

// Marvel API Types (re-export)
export interface MarvelCharacter {
  id: number;
  name: string;
  description: string;
  thumbnail: {
    path: string;
    extension: string;
  };
  comics: {
    available: number;
    items: Array<{
      resourceURI: string;
      name: string;
    }>;
  };
  series: {
    available: number;
    items: Array<{
      resourceURI: string;
      name: string;
    }>;
  };
  stories: {
    available: number;
    items: Array<{
      resourceURI: string;
      name: string;
      type: string;
    }>;
  };
  events: {
    available: number;
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

// Achievement System
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'infinity-stones' | 'character-badges' | 'milestone-badges';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  unlockedAt?: number;
  progress?: {
    current: number;
    required: number;
  };
}

export interface AchievementProgress {
  achievementId: string;
  progress: number;
  completed: boolean;
  unlockedAt?: number;
}

// Multiplayer Types
export interface MultiplayerRoom {
  id: string;
  name: string;
  hostId: string;
  players: MultiplayerPlayer[];
  maxPlayers: number;
  gameMode: GameMode;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  status: 'waiting' | 'starting' | 'active' | 'finished';
  currentQuestion?: QuizQuestion;
  currentQuestionIndex: number;
  settings: RoomSettings;
  createdAt: number;
}

export interface MultiplayerPlayer {
  id: string;
  name: string;
  avatar?: string;
  score: number;
  isReady: boolean;
  isHost: boolean;
  answers: PlayerAnswer[];
  powerUps: PowerUp[];
}

export interface RoomSettings {
  questionCount: number;
  timePerQuestion: number;
  allowPowerUps: boolean;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  categories: string[];
}

// Power-ups for Multiplayer
export interface PowerUp {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'time-freeze' | 'double-points' | 'eliminate-wrong' | 'steal-points';
  duration?: number; // in seconds
  uses: number;
  cooldown: number; // in seconds
}

// UI State Types
export interface UIState {
  currentScreen: Screen;
  isLoading: boolean;
  showSettings: boolean;
  showAchievements: boolean;
  showLeaderboard: boolean;
  notifications: Notification[];
  modals: Modal[];
  activeModal?: Modal | null;
}

export type Screen = 
  | 'home'
  | 'game-mode-selection'
  | 'difficulty-selection'
  | 'game-arena'
  | 'results'
  | 'multiplayer-lobby'
  | 'achievements'
  | 'leaderboard'
  | 'settings'
  | 'profile'
  | 'loading';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  label: string;
  action: () => void;
  style?: 'primary' | 'secondary';
}

export interface Modal {
  id: string;
  type: 'achievement-unlock' | 'game-over' | 'pause' | 'settings' | 'confirmation';
  title: string;
  content: React.ReactNode;
  actions?: ModalAction[];
  closable?: boolean;
}

export interface ModalAction {
  label: string;
  handler: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  closeOnClick?: boolean;
}

// Animation Types
export interface AnimationConfig {
  duration: number;
  easing: string;
  delay?: number;
  repeat?: number;
  yoyo?: boolean;
}

export interface ParticleConfig {
  count: number;
  size: {
    min: number;
    max: number;
  };
  speed: {
    min: number;
    max: number;
  };
  color: string[];
  opacity: {
    min: number;
    max: number;
  };
  lifetime: {
    min: number;
    max: number;
  };
}

// Sound Types
export interface SoundEffect {
  id: string;
  name: string;
  url: string;
  volume: number;
  loop?: boolean;
}

export interface MusicTrack {
  id: string;
  name: string;
  url: string;
  volume: number;
  loop: boolean;
  category: 'menu' | 'game' | 'victory' | 'defeat';
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface LeaderboardEntry {
  rank: number;
  playerId: string;
  playerName: string;
  score: number;
  gameMode: GameMode;
  difficulty: string;
  timestamp: number;
}

// Error Types
export interface GameError {
  code: string;
  message: string;
  details?: any;
  timestamp: number;
}

// Settings Types
export interface GameSettings {
  audio: {
    masterVolume: number;
    soundEffects: boolean;
    music: boolean;
    voiceCommands: boolean;
  };
  graphics: {
    animations: boolean;
    particles: boolean;
    quality: 'low' | 'medium' | 'high';
  };
  gameplay: {
    difficulty: 'easy' | 'medium' | 'hard' | 'expert';
    autoAdvance: boolean;
    showHints: boolean;
    confirmAnswers: boolean;
  };
  accessibility: {
    highContrast: boolean;
    largeText: boolean;
    reducedMotion: boolean;
    screenReader: boolean;
  };
}

// Event Types for Analytics
export interface GameEvent {
  type: string;
  data: Record<string, any>;
  timestamp: number;
  sessionId: string;
  playerId: string;
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Component Props Types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface GlassComponentProps extends BaseComponentProps {
  blur?: 'sm' | 'md' | 'lg' | 'xl';
  opacity?: number;
  border?: boolean;
  shadow?: 'sm' | 'md' | 'lg' | 'xl';
}

// Store Types (for Zustand)
export interface GameStore {
  // Player state
  player: Player | null;
  setPlayer: (player: Player) => void;
  updatePlayer: (updates: Partial<Player>) => void;
  
  // Game session state
  currentSession: GameSession | null;
  setCurrentSession: (session: GameSession) => void;
  updateSession: (updates: Partial<GameSession>) => void;
  
  // UI state
  ui: UIState;
  setCurrentScreen: (screen: Screen) => void;
  setLoading: (loading: boolean) => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  addModal: (modal: Omit<Modal, 'id'>) => void;
  removeModal: (id: string) => void;
  
  // Game settings
  settings: GameSettings;
  updateSettings: (updates: DeepPartial<GameSettings>) => void;
  
  // Multiplayer state
  multiplayerRoom: MultiplayerRoom | null;
  setMultiplayerRoom: (room: MultiplayerRoom | null) => void;
  
  // Actions
  startGame: (gameMode: GameMode, difficulty: string) => Promise<void>;
  submitAnswer: (answer: string) => void;
  pauseGame: () => void;
  resumeGame: () => void;
  endGame: () => void;
  resetGame: () => void;
}

// Constants
export const GAME_MODES: Record<GameMode, GameModeConfig> = {
  story: {
    name: 'Story Mode',
    description: 'Journey through Marvel history with progressive difficulty',
    icon: 'book-open',
    questionCount: 20,
    lives: 3,
    difficultyProgression: true,
    multiplayer: false,
    features: ['Progressive Difficulty', 'Story Narrative', 'Character Unlocks']
  },
  blitz: {
    name: 'Blitz Mode',
    description: 'Fast-paced questions with time pressure',
    icon: 'zap',
    timeLimit: 300, // 5 minutes
    questionCount: 30,
    difficultyProgression: false,
    multiplayer: false,
    features: ['Time Pressure', 'Quick Questions', 'High Scores']
  },
  survival: {
    name: 'Survival Mode',
    description: 'Answer correctly or face elimination',
    icon: 'shield',
    lives: 1,
    difficultyProgression: true,
    multiplayer: false,
    features: ['One Life', 'Increasing Difficulty', 'Endless Questions']
  },
  multiplayer: {
    name: 'Multiplayer Battle',
    description: 'Compete against other players in real-time',
    icon: 'users',
    questionCount: 15,
    timeLimit: 20,
    difficultyProgression: false,
    multiplayer: true,
    features: ['Real-time Competition', 'Power-ups', 'Live Chat']
  }
};

export const DIFFICULTY_LEVELS = {
  easy: { name: 'Easy', color: '#10B981', multiplier: 1 },
  medium: { name: 'Medium', color: '#F59E0B', multiplier: 1.5 },
  hard: { name: 'Hard', color: '#EF4444', multiplier: 2 },
  expert: { name: 'Expert', color: '#8B5CF6', multiplier: 3 }
};

export const ACHIEVEMENT_CATEGORIES = {
  'infinity-stones': { name: 'Infinity Stones', color: '#8B5CF6' },
  'character-badges': { name: 'Character Badges', color: '#EF4444' },
  'milestone-badges': { name: 'Milestone Badges', color: '#10B981' }
};

export const RARITY_COLORS = {
  common: '#6B7280',
  rare: '#3B82F6',
  epic: '#8B5CF6',
  legendary: '#F59E0B'
};