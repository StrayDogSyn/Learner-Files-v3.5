// Marvel API Data Structures
export interface MarvelThumbnail {
  path: string;
  extension: string;
}

export interface MarvelUrl {
  type: string;
  url: string;
}

export interface MarvelImage {
  path: string;
  extension: string;
}

export interface MarvelDate {
  type: string;
  date: string;
}

export interface MarvelPrice {
  type: string;
  price: number;
}

export interface MarvelTextObject {
  type: string;
  language: string;
  text: string;
}

export interface MarvelCreatorSummary {
  resourceURI: string;
  name: string;
  role: string;
}

export interface MarvelCreatorList {
  available: number;
  returned: number;
  collectionURI: string;
  items: MarvelCreatorSummary[];
}

export interface MarvelCharacterSummary {
  resourceURI: string;
  name: string;
  role?: string;
}

export interface MarvelCharacterList {
  available: number;
  returned: number;
  collectionURI: string;
  items: MarvelCharacterSummary[];
}

export interface MarvelComicSummary {
  resourceURI: string;
  name: string;
}

export interface MarvelComicList {
  available: number;
  returned: number;
  collectionURI: string;
  items: MarvelComicSummary[];
}

export interface MarvelSeriesSummary {
  resourceURI: string;
  name: string;
}

export interface MarvelSeriesList {
  available: number;
  returned: number;
  collectionURI: string;
  items: MarvelSeriesSummary[];
}

export interface MarvelStorySummary {
  resourceURI: string;
  name: string;
  type: string;
}

export interface MarvelStoryList {
  available: number;
  returned: number;
  collectionURI: string;
  items: MarvelStorySummary[];
}

export interface MarvelEventSummary {
  resourceURI: string;
  name: string;
}

export interface MarvelEventList {
  available: number;
  returned: number;
  collectionURI: string;
  items: MarvelEventSummary[];
}

// Main Character Interface
export interface MarvelCharacter {
  id: number;
  name: string;
  description: string;
  modified: string;
  resourceURI: string;
  urls: MarvelUrl[];
  thumbnail: MarvelThumbnail;
  comics: MarvelComicList;
  stories: MarvelStoryList;
  events: MarvelEventList;
  series: MarvelSeriesList;
}

// Main Comic Interface
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
  textObjects: MarvelTextObject[];
  resourceURI: string;
  urls: MarvelUrl[];
  series: MarvelSeriesSummary;
  variants: MarvelComicSummary[];
  collections: MarvelComicSummary[];
  collectedIssues: MarvelComicSummary[];
  dates: MarvelDate[];
  prices: MarvelPrice[];
  thumbnail: MarvelThumbnail;
  images: MarvelImage[];
  creators: MarvelCreatorList;
  characters: MarvelCharacterList;
  stories: MarvelStoryList;
  events: MarvelEventList;
}

// Main Series Interface
export interface MarvelSeries {
  id: number;
  title: string;
  description: string | null;
  resourceURI: string;
  urls: MarvelUrl[];
  startYear: number;
  endYear: number;
  rating: string;
  modified: string;
  thumbnail: MarvelThumbnail;
  comics: MarvelComicList;
  stories: MarvelStoryList;
  events: MarvelEventList;
  characters: MarvelCharacterList;
  creators: MarvelCreatorList;
  next: MarvelSeriesSummary | null;
  previous: MarvelSeriesSummary | null;
}

// API Response Wrapper
export interface MarvelApiResponse<T> {
  code: number;
  status: string;
  copyright: string;
  attributionText: string;
  attributionHTML: string;
  data: {
    offset: number;
    limit: number;
    total: number;
    count: number;
    results: T[];
  };
  etag: string;
}

// Quiz-specific types
export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'mixed';
export type QuizCategory = 'characters' | 'comics' | 'series' | 'events' | 'creators' | 'mixed';

export interface GameSession {
  id: string;
  startTime: number;
  endTime: number;
  score: number;
  questionsAnswered: number;
  correctAnswers: number;
  difficulty: DifficultyLevel;
  powerUpsUsed: string[];
  achievements: Achievement[];
  timeSpent: number;
}

// Quiz-specific interfaces
export interface QuizQuestion {
  id: string;
  type: 'character' | 'comic' | 'series' | 'power' | 'origin' | 'team' | 'villain' | 'multiple-choice';
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  points: number;
  timeLimit: number;
  character?: MarvelCharacter;
  comic?: MarvelComic;
  series?: MarvelSeries;
  imageUrl?: string;
  hints?: string[];
}

export interface QuizConfig {
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
  categories: string[];
  questionCount: number;
  timeLimit: number;
  timePerQuestion: number;
  powerUpsEnabled: boolean;
  soundEnabled: boolean;
  animationsEnabled: boolean;
}

export interface GameStats {
  score: number;
  totalScore: number;
  accuracy: number;
  questionsAnswered: number;
  correctAnswers: number;
  incorrectAnswers: number;
  currentStreak: number;
  highestStreak: number;
  averageTime: number;
  totalTime: number;
  fastAnswers: number;
  gamesPlayed: number;
  rank: string;
  powerUpsUsed: number;
  hintsUsed: number;
  uniqueHeroes?: number;
  uniqueVillains?: number;
  perfectQuizzes?: number;
  achievements: string[];
  totalQuestions: number;
  wrongAnswers: number;
  timePerQuestion: number;
  streak: number;
  maxStreak: number;
  fastestAnswer: number;
  slowestAnswer: number;
  categoriesPlayed: string[];
  characterMatch?: number;
  difficulty?: string;
  totalTimeSpent?: number;
  averageResponseTime?: number;
  bonusPoints?: number;
}

export interface PowerUp {
  id: string;
  name: string;
  description: string;
  type: string;
  icon?: string;
  cost: number;
  quantity?: number;
  cooldown?: number;
  duration?: number;
  effect?: 'skip' | 'hint' | 'time' | 'double-points' | 'freeze-time' | 'eliminate-two';
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  available?: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  points: number;
  category: string;
  unlockedAt?: string;
  requirements: {
    gamesPlayed?: number;
    accuracy?: number;
    streak?: number;
    totalScore?: number;
    totalTime?: number;
    perfectQuiz?: boolean;
    fastAnswers?: number;
    uniqueHeroes?: number;
    uniqueVillains?: number;
    powerUpsUsed?: number;
  };
}

export interface LeaderboardEntry {
  id: string;
  playerName: string;
  score: number;
  accuracy: number;
  gamesPlayed: number;
  averageTime: number;
  rank: number;
  achievements: number;
  lastPlayed: string;
  avatar?: string;
}

export interface QuizSession {
  id: string;
  startTime: string;
  endTime?: string;
  config: QuizConfig;
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  answers: {
    questionId: string;
    selectedAnswer: string;
    isCorrect: boolean;
    timeSpent: number;
    pointsEarned: number;
    powerUpsUsed: string[];
  }[];
  stats: GameStats;
  powerUps: PowerUp[];
  isCompleted: boolean;
  isPaused: boolean;
}

// Animation and Sound interfaces
export interface AnimationState {
  particles: Particle[];
  floatingTexts: FloatingText[];
  screenShake: boolean;
  backgroundEffect?: string;
  type?: 'idle' | 'correct' | 'incorrect' | 'powerup' | 'achievement' | 'correctAnswer' | 'incorrectAnswer' | 'achievementUnlocked';
   message?: string;
   duration?: number;
   isActive?: boolean;
   id?: string;
}

export interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  type: 'star' | 'explosion' | 'sparkle' | 'confetti';
}

export interface FloatingText {
  id: string;
  text: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  fontSize: number;
  color: string;
  type: 'score' | 'combo' | 'achievement' | 'powerup';
}

export interface SoundEffect {
  id: string;
  name: string;
  url: string;
  volume: number;
  category: 'music' | 'effect' | 'ambient' | 'transition' | 'reward' | 'ui' | 'alert' | 'feedback' | 'action';
  loop?: boolean;
  preload?: boolean;
}

export interface SoundConfig {
  masterVolume: number;
  musicVolume: number;
  effectsVolume: number;
  enabled: boolean;
  musicEnabled: boolean;
}

// API Client interfaces
export interface MarvelApiConfig {
  publicKey: string;
  privateKey: string;
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
  cacheEnabled: boolean;
  cacheDuration: number;
}

export interface CachedApiResponse<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

export interface ApiError {
  code: number;
  message: string;
  details?: any;
}

// Utility types
export type QuestionType = QuizQuestion['type'];
export type Difficulty = QuizQuestion['difficulty'];
export type PowerUpEffect = PowerUp['effect'];
export type AchievementCategory = Achievement['category'];
export type Rarity = Achievement['rarity'];

// Response types for specific endpoints
export type CharactersResponse = MarvelApiResponse<MarvelCharacter>;
export type ComicsResponse = MarvelApiResponse<MarvelComic>;
export type SeriesResponse = MarvelApiResponse<MarvelSeries>;

// Search and filter interfaces
export interface SearchFilters {
  name?: string;
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
  categories?: string[];
  types?: QuestionType[];
  minPoints?: number;
  maxPoints?: number;
  timeLimit?: number;
}

// Game mode interfaces
export interface GameMode {
  id: string;
  name: string;
  description: string;
  icon: string;
  config: Partial<QuizConfig>;
  unlockRequirements?: {
    gamesPlayed?: number;
    achievements?: string[];
    rank?: string;
  };
}

// Theme and customization
export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  gradients: {
    primary: string;
    secondary: string;
    accent: string;
  };
  animations: {
    duration: number;
    easing: string;
  };
}

// Export all interfaces as a namespace for easier importing
export namespace Marvel {
  export type Character = MarvelCharacter;
  export type Comic = MarvelComic;
  export type Series = MarvelSeries;
  export type ApiResponse<T> = MarvelApiResponse<T>;
  export type Question = QuizQuestion;
  export type Config = QuizConfig;
  export type Stats = GameStats;
  export type PowerUpItem = PowerUp;
  export type AchievementItem = Achievement;
  export type Session = QuizSession;
}