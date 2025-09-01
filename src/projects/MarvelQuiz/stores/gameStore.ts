import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { Character, Question, GameMode, Difficulty } from '../types';

export interface GameState {
  // Game Configuration
  gameMode: GameMode;
  difficulty: Difficulty;
  timeLimit: number;
  questionsPerRound: number;
  
  // Current Game State
  currentQuestion: Question | null;
  currentQuestionIndex: number;
  questions: Question[];
  score: number;
  lives: number;
  timeRemaining: number;
  
  // Player State
  selectedCharacter: Character | null;
  playerName: string;
  
  // Game Flow
  isGameActive: boolean;
  isGamePaused: boolean;
  isGameComplete: boolean;
  
  // Multiplayer
  isMultiplayer: boolean;
  roomId: string | null;
  players: Array<{
    id: string;
    name: string;
    score: number;
    character: Character | null;
  }>;
  
  // Statistics
  correctAnswers: number;
  incorrectAnswers: number;
  streak: number;
  maxStreak: number;
  
  // Actions
  setGameMode: (mode: GameMode) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  setSelectedCharacter: (character: Character) => void;
  setPlayerName: (name: string) => void;
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  endGame: () => void;
  resetGame: () => void;
  nextQuestion: () => void;
  submitAnswer: (answer: string) => void;
  updateScore: (points: number) => void;
  decrementTime: () => void;
  setQuestions: (questions: Question[]) => void;
}

export const useGameStore = create<GameState>()(subscribeWithSelector((set, get) => ({
  // Initial State
  gameMode: 'classic',
  difficulty: 'medium',
  timeLimit: 30,
  questionsPerRound: 10,
  
  currentQuestion: null,
  currentQuestionIndex: 0,
  questions: [],
  score: 0,
  lives: 3,
  timeRemaining: 30,
  
  selectedCharacter: null,
  playerName: '',
  
  isGameActive: false,
  isGamePaused: false,
  isGameComplete: false,
  
  isMultiplayer: false,
  roomId: null,
  players: [],
  
  correctAnswers: 0,
  incorrectAnswers: 0,
  streak: 0,
  maxStreak: 0,
  
  // Actions
  setGameMode: (mode) => set({ gameMode: mode }),
  
  setDifficulty: (difficulty) => set({ difficulty }),
  
  setSelectedCharacter: (character) => set({ selectedCharacter: character }),
  
  setPlayerName: (name) => set({ playerName: name }),
  
  startGame: () => {
    const { questions, timeLimit } = get();
    if (questions.length > 0) {
      set({
        isGameActive: true,
        isGamePaused: false,
        isGameComplete: false,
        currentQuestionIndex: 0,
        currentQuestion: questions[0],
        timeRemaining: timeLimit,
        score: 0,
        lives: 3,
        correctAnswers: 0,
        incorrectAnswers: 0,
        streak: 0
      });
    }
  },
  
  pauseGame: () => set({ isGamePaused: true }),
  
  resumeGame: () => set({ isGamePaused: false }),
  
  endGame: () => set({ 
    isGameActive: false, 
    isGameComplete: true,
    currentQuestion: null 
  }),
  
  resetGame: () => set({
    currentQuestion: null,
    currentQuestionIndex: 0,
    score: 0,
    lives: 3,
    timeRemaining: 30,
    isGameActive: false,
    isGamePaused: false,
    isGameComplete: false,
    correctAnswers: 0,
    incorrectAnswers: 0,
    streak: 0
  }),
  
  nextQuestion: () => {
    const { questions, currentQuestionIndex, timeLimit } = get();
    const nextIndex = currentQuestionIndex + 1;
    
    if (nextIndex < questions.length) {
      set({
        currentQuestionIndex: nextIndex,
        currentQuestion: questions[nextIndex],
        timeRemaining: timeLimit
      });
    } else {
      get().endGame();
    }
  },
  
  submitAnswer: (answer) => {
    const { currentQuestion, streak, maxStreak } = get();
    if (!currentQuestion) return;
    
    const isCorrect = answer === currentQuestion.correctAnswer;
    const newStreak = isCorrect ? streak + 1 : 0;
    
    set({
      correctAnswers: get().correctAnswers + (isCorrect ? 1 : 0),
      incorrectAnswers: get().incorrectAnswers + (isCorrect ? 0 : 1),
      streak: newStreak,
      maxStreak: Math.max(maxStreak, newStreak),
      lives: isCorrect ? get().lives : Math.max(0, get().lives - 1)
    });
    
    if (isCorrect) {
      const basePoints = 100;
      const streakBonus = newStreak * 10;
      const timeBonus = Math.floor(get().timeRemaining / 2);
      get().updateScore(basePoints + streakBonus + timeBonus);
    }
    
    // Check if game should end
    if (get().lives <= 0) {
      get().endGame();
    } else {
      setTimeout(() => get().nextQuestion(), 1500);
    }
  },
  
  updateScore: (points) => set({ score: get().score + points }),
  
  decrementTime: () => {
    const { timeRemaining, isGameActive, isGamePaused } = get();
    if (!isGameActive || isGamePaused) return;
    
    if (timeRemaining > 0) {
      set({ timeRemaining: timeRemaining - 1 });
    } else {
      // Time's up - treat as wrong answer
      get().submitAnswer('');
    }
  },
  
  setQuestions: (questions) => set({ questions })
})));

// Selectors
export const useGameProgress = () => {
  const { currentQuestionIndex, questions } = useGameStore();
  return {
    current: currentQuestionIndex + 1,
    total: questions.length,
    percentage: questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0
  };
};

export const useGameStats = () => {
  const { score, correctAnswers, incorrectAnswers, streak, maxStreak } = useGameStore();
  const totalAnswers = correctAnswers + incorrectAnswers;
  const accuracy = totalAnswers > 0 ? (correctAnswers / totalAnswers) * 100 : 0;
  
  return {
    score,
    correctAnswers,
    incorrectAnswers,
    totalAnswers,
    accuracy,
    streak,
    maxStreak
  };
};

export const useGameTimer = () => {
  const { timeRemaining, timeLimit } = useGameStore();
  const percentage = (timeRemaining / timeLimit) * 100;
  
  return {
    timeRemaining,
    timeLimit,
    percentage,
    isLow: timeRemaining <= 5,
    isCritical: timeRemaining <= 3
  };
};