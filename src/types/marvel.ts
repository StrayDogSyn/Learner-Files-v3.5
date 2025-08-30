// Marvel API TypeScript Interfaces
// Based on official Marvel API documentation

export interface MarvelThumbnail {
  path: string;
  extension: string;
}

export interface MarvelUrl {
  type: string;
  url: string;
}

export interface MarvelResourceList {
  available: number;
  collectionURI: string;
  items: MarvelResourceSummary[];
}

export interface MarvelResourceSummary {
  resourceURI: string;
  name: string;
  type?: string;
  role?: string;
}

export interface MarvelCharacter {
  id: number;
  name: string;
  description: string;
  modified: string;
  thumbnail: MarvelThumbnail;
  resourceURI: string;
  comics: MarvelResourceList;
  series: MarvelResourceList;
  stories: MarvelResourceList;
  events: MarvelResourceList;
  urls: MarvelUrl[];
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
  textObjects: MarvelTextObject[];
  resourceURI: string;
  urls: MarvelUrl[];
  series: MarvelResourceSummary;
  variants: MarvelResourceSummary[];
  collections: MarvelResourceSummary[];
  collectedIssues: MarvelResourceSummary[];
  dates: MarvelDate[];
  prices: MarvelPrice[];
  thumbnail: MarvelThumbnail;
  images: MarvelThumbnail[];
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

export interface MarvelSeries {
  id: number;
  title: string;
  description: string | null;
  resourceURI: string;
  urls: MarvelUrl[];
  startYear: number;
  endYear: number;
  rating: string;
  type: string;
  modified: string;
  thumbnail: MarvelThumbnail;
  creators: MarvelResourceList;
  characters: MarvelResourceList;
  stories: MarvelResourceList;
  comics: MarvelResourceList;
  events: MarvelResourceList;
  next: MarvelResourceSummary | null;
  previous: MarvelResourceSummary | null;
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
export type QuestionType = 'character' | 'power' | 'creator' | 'appearance' | 'comic' | 'team' | 'origin' | 'alias';
export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'expert';
export type QuizCategory = 'heroes' | 'villains' | 'teams' | 'cosmic' | 'street' | 'mutants' | 'avengers' | 'xmen' | 'spiderman' | 'fantastic4';

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  question: string;
  character?: MarvelCharacter;
  comic?: MarvelComic;
  series?: MarvelSeries;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: DifficultyLevel;
  points: number;
  timeLimit: number;
  category: QuizCategory;
  imageUrl?: string;
  hint?: string;
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
  difficulty: DifficultyLevel;
  rank: string;
  characterMatch: string;
  score: number;
  bonusPoints: number;
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
}

export interface PowerUp {
  id: string;
  name: string;
  description: string;
  icon: string;
  effect: 'skip' | 'hint' | 'time' | 'fifty-fifty';
  cost: number;
  duration?: number;
}

export interface LeaderboardEntry {
  id: string;
  playerName: string;
  score: number;
  accuracy: number;
  difficulty: DifficultyLevel;
  completedAt: Date;
  achievements: string[];
  rank: number;
}

export interface GameSession {
  id: string;
  playerName: string;
  startTime: Date;
  endTime?: Date;
  questions: QuizQuestion[];
  answers: {
    questionId: string;
    selectedAnswer: string;
    isCorrect: boolean;
    responseTime: number;
    pointsEarned: number;
  }[];
  stats: GameStats;
  powerUpsUsed: PowerUp[];
  achievements: Achievement[];
}

export interface QuizConfig {
  totalQuestions: number;
  timePerQuestion: number;
  difficulty: DifficultyLevel;
  categories: QuizCategory[];
  enablePowerUps: boolean;
  enableSound: boolean;
  enableAnimations: boolean;
}

// API Error handling
export interface MarvelApiError {
  code: number;
  message: string;
  status: string;
}

// Cache interface
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

// Sound effects
export interface SoundEffect {
  id: string;
  name: string;
  url: string;
  volume: number;
  loop: boolean;
}

export interface GameEvent {
  id: string;
  type: 'answer' | 'powerup' | 'achievement' | 'game_start' | 'game_end';
  timestamp: Date;
  data: any;
  sessionId: string;
}

export interface SoundConfig {
  masterVolume: number;
  musicVolume: number;
  effectsVolume: number;
  muted: boolean;
}