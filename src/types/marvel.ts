// Marvel Quiz Types
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'characters' | 'powers' | 'teams' | 'history';
  points: number;
}

export interface GameStats {
  score: number;
  questionsAnswered: number;
  correctAnswers: number;
  currentStreak: number;
  bestStreak: number;
}

export interface QuizState {
  isPlaying: boolean;
  currentQuestionIndex: number;
  selectedAnswer: string | null;
  showResult: boolean;
  gameComplete: boolean;
  timeLeft: number;
}