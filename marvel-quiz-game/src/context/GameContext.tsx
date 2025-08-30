import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  character: string;
  image?: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface GameState {
  questions: Question[];
  currentQuestionIndex: number;
  score: number;
  answers: number[];
  isGameStarted: boolean;
  isGameFinished: boolean;
  timeRemaining: number;
  totalQuestions: number;
}

type GameAction =
  | { type: 'START_GAME'; payload: Question[] }
  | { type: 'ANSWER_QUESTION'; payload: number }
  | { type: 'NEXT_QUESTION' }
  | { type: 'FINISH_GAME' }
  | { type: 'RESET_GAME' }
  | { type: 'UPDATE_TIME'; payload: number };

const initialState: GameState = {
  questions: [],
  currentQuestionIndex: 0,
  score: 0,
  answers: [],
  isGameStarted: false,
  isGameFinished: false,
  timeRemaining: 300, // 5 minutes
  totalQuestions: 10,
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...state,
        questions: action.payload,
        isGameStarted: true,
        isGameFinished: false,
        currentQuestionIndex: 0,
        score: 0,
        answers: [],
        timeRemaining: 300,
      };
    
    case 'ANSWER_QUESTION': {
      const currentQuestion = state.questions[state.currentQuestionIndex];
      const isCorrect = action.payload === currentQuestion.correctAnswer;
      const newScore = isCorrect ? state.score + 1 : state.score;
      
      return {
        ...state,
        score: newScore,
        answers: [...state.answers, action.payload],
      };
    }
    
    case 'NEXT_QUESTION': {
      const nextIndex = state.currentQuestionIndex + 1;
      const isLastQuestion = nextIndex >= state.questions.length;
      
      return {
        ...state,
        currentQuestionIndex: nextIndex,
        isGameFinished: isLastQuestion,
      };
    }
    
    case 'FINISH_GAME':
      return {
        ...state,
        isGameFinished: true,
      };
    
    case 'RESET_GAME':
      return initialState;
    
    case 'UPDATE_TIME':
      return {
        ...state,
        timeRemaining: action.payload,
      };
    
    default:
      return state;
  }
}

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  startGame: (questions: Question[]) => void;
  answerQuestion: (answerIndex: number) => void;
  nextQuestion: () => void;
  finishGame: () => void;
  resetGame: () => void;
  updateTime: (time: number) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const startGame = (questions: Question[]) => {
    dispatch({ type: 'START_GAME', payload: questions });
  };

  const answerQuestion = (answerIndex: number) => {
    dispatch({ type: 'ANSWER_QUESTION', payload: answerIndex });
  };

  const nextQuestion = () => {
    dispatch({ type: 'NEXT_QUESTION' });
  };

  const finishGame = () => {
    dispatch({ type: 'FINISH_GAME' });
  };

  const resetGame = () => {
    dispatch({ type: 'RESET_GAME' });
  };

  const updateTime = (time: number) => {
    dispatch({ type: 'UPDATE_TIME', payload: time });
  };

  return (
    <GameContext.Provider value={{
      state,
      dispatch,
      startGame,
      answerQuestion,
      nextQuestion,
      finishGame,
      resetGame,
      updateTime,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}