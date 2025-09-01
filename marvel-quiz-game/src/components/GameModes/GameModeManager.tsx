import React, { useState, useEffect, useCallback } from 'react';
import { GameMode, GameModeConfig } from './GameModeSelector';
import { EnhancedQuizQuestion } from '../../data/enhancedQuestions';
import { MarvelCharacterDetailed } from '../../data/characters';
import { DifficultyLevel } from '../../types/marvel';

export interface GameSession {
  mode: GameMode;
  config: GameModeConfig;
  questions: EnhancedQuizQuestion[];
  currentQuestionIndex: number;
  score: number;
  timeRemaining?: number;
  streak: number;
  lives?: number;
  startTime: number;
  endTime?: number;
  answers: {
    questionId: string;
    selectedAnswer: number;
    isCorrect: boolean;
    timeSpent: number;
  }[];
  bonusPoints: number;
  achievements: string[];
}

interface GameModeManagerProps {
  config: GameModeConfig;
  questions: EnhancedQuizQuestion[];
  characters: MarvelCharacterDetailed[];
  onGameComplete: (session: GameSession) => void;
  onGameExit: () => void;
}

const GameModeManager: React.FC<GameModeManagerProps> = ({
  config,
  questions,
  characters,
  onGameComplete,
  onGameExit
}) => {
  const [session, setSession] = useState<GameSession>(() => ({
    mode: config.mode,
    config,
    questions: getQuestionsForMode(config, questions),
    currentQuestionIndex: 0,
    score: 0,
    streak: 0,
    startTime: Date.now(),
    answers: [],
    bonusPoints: 0,
    achievements: [],
    timeRemaining: config.timeLimit,
    lives: config.mode === 'survival' ? undefined : 3
  }));

  const [gameState, setGameState] = useState<'playing' | 'paused' | 'completed' | 'failed'>('playing');
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  // Timer effect for time-based modes
  useEffect(() => {
    if (config.timeLimit && gameState === 'playing' && session.timeRemaining! > 0) {
      const timer = setInterval(() => {
        setSession(prev => {
          const newTimeRemaining = prev.timeRemaining! - 1;
          if (newTimeRemaining <= 0) {
            setGameState('completed');
            return { ...prev, timeRemaining: 0, endTime: Date.now() };
          }
          return { ...prev, timeRemaining: newTimeRemaining };
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [config.timeLimit, gameState, session.timeRemaining]);

  // Handle answer selection
  const handleAnswerSelect = useCallback((selectedAnswer: number) => {
    if (gameState !== 'playing') return;

    const currentQuestion = session.questions[session.currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    const timeSpent = Date.now() - questionStartTime;
    
    const answer = {
      questionId: currentQuestion.id,
      selectedAnswer,
      isCorrect,
      timeSpent
    };

    setSession(prev => {
      const newAnswers = [...prev.answers, answer];
      let newScore = prev.score;
      let newStreak = isCorrect ? prev.streak + 1 : 0;
      let newBonusPoints = prev.bonusPoints;
      let newAchievements = [...prev.achievements];
      let newQuestions = prev.questions;

      // Calculate score based on mode
      if (isCorrect) {
        const basePoints = getBasePoints(config.mode, currentQuestion.difficulty);
        const streakBonus = Math.floor(newStreak / 5) * 10;
        const speedBonus = getSpeedBonus(config.mode, timeSpent);
        
        newScore += basePoints + streakBonus + speedBonus;
        newBonusPoints += streakBonus + speedBonus;

        // Check for achievements
        if (newStreak === 5) newAchievements.push('Hot Streak');
        if (newStreak === 10) newAchievements.push('On Fire');
        if (newStreak === 20) newAchievements.push('Unstoppable');
        if (speedBonus > 0) newAchievements.push('Quick Draw');
      }

      // Handle mode-specific logic
      switch (config.mode) {
        case 'survival':
          if (!isCorrect) {
            setGameState('failed');
            return {
              ...prev,
              answers: newAnswers,
              score: newScore,
              streak: newStreak,
              bonusPoints: newBonusPoints,
              achievements: newAchievements,
              endTime: Date.now()
            };
          }
          // Add more questions for survival mode
          if (prev.currentQuestionIndex >= prev.questions.length - 1) {
            const additionalQuestions = generateAdditionalQuestions(
              questions,
              prev.currentQuestionIndex + 1,
              getDynamicDifficulty(newStreak)
            );
            newQuestions = [...prev.questions, ...additionalQuestions];
          }
          break;

        case 'timeAttack':
          // No penalties for wrong answers in time attack
          break;

        default:
          // Standard modes - reduce lives on wrong answer
          if (!isCorrect && prev.lives !== undefined) {
            const newLives = prev.lives - 1;
            if (newLives <= 0) {
              setGameState('failed');
              return {
                ...prev,
                answers: newAnswers,
                score: newScore,
                streak: newStreak,
                bonusPoints: newBonusPoints,
                achievements: newAchievements,
                lives: 0,
                endTime: Date.now()
              };
            }
            return {
              ...prev,
              answers: newAnswers,
              score: newScore,
              streak: newStreak,
              bonusPoints: newBonusPoints,
              achievements: newAchievements,
              lives: newLives
            };
          }
      }

      return {
        ...prev,
        answers: newAnswers,
        score: newScore,
        streak: newStreak,
        bonusPoints: newBonusPoints,
        achievements: newAchievements,
        questions: newQuestions
      };
    });

    // Move to next question or complete game
    setTimeout(() => {
      setSession(prev => {
        const nextIndex = prev.currentQuestionIndex + 1;
        
        if (nextIndex >= prev.questions.length) {
          setGameState('completed');
          return { ...prev, endTime: Date.now() };
        }

        setQuestionStartTime(Date.now());
        return { ...prev, currentQuestionIndex: nextIndex };
      });
    }, 1500); // Show answer feedback for 1.5 seconds

  }, [gameState, session, questionStartTime, config.mode, questions]);

  // Complete game when state changes
  useEffect(() => {
    if (gameState === 'completed' || gameState === 'failed') {
      onGameComplete(session);
    }
  }, [gameState, session, onGameComplete]);

  const currentQuestion = session.questions[session.currentQuestionIndex];
  const progress = ((session.currentQuestionIndex + 1) / session.questions.length) * 100;

  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-xl">Loading question...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4">
      {/* Game Header */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-white">{config.name}</h1>
            <button
              onClick={onGameExit}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Exit Game
            </button>
          </div>

          {/* Game Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-blue-600/20 rounded-lg p-3">
              <div className="text-blue-400 text-sm">Score</div>
              <div className="text-white text-xl font-bold">{session.score}</div>
            </div>
            
            <div className="bg-green-600/20 rounded-lg p-3">
              <div className="text-green-400 text-sm">Streak</div>
              <div className="text-white text-xl font-bold">{session.streak}</div>
            </div>

            {session.timeRemaining !== undefined && (
              <div className="bg-yellow-600/20 rounded-lg p-3">
                <div className="text-yellow-400 text-sm">Time</div>
                <div className="text-white text-xl font-bold">
                  {Math.floor(session.timeRemaining / 60)}:{(session.timeRemaining % 60).toString().padStart(2, '0')}
                </div>
              </div>
            )}

            {session.lives !== undefined && (
              <div className="bg-red-600/20 rounded-lg p-3">
                <div className="text-red-400 text-sm">Lives</div>
                <div className="text-white text-xl font-bold">{session.lives}</div>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Question {session.currentQuestionIndex + 1} of {session.questions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Question Display */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                currentQuestion.difficulty === 'easy' ? 'bg-green-600 text-white' :
                currentQuestion.difficulty === 'medium' ? 'bg-yellow-600 text-white' :
                currentQuestion.difficulty === 'hard' ? 'bg-orange-600 text-white' :
                'bg-red-600 text-white'
              }`}>
                {currentQuestion.difficulty.toUpperCase()}
              </span>
              <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-semibold">
                {currentQuestion.type.replace(/([A-Z])/g, ' $1').trim().toUpperCase()}
              </span>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4">
              {currentQuestion.question}
            </h2>

            {currentQuestion.image && (
              <div className="mb-6">
                <img 
                  src={currentQuestion.image} 
                  alt="Question related" 
                  className="max-w-md mx-auto rounded-lg shadow-lg"
                />
              </div>
            )}
          </div>

          {/* Answer Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className="p-4 bg-gray-800 hover:bg-gray-700 border-2 border-gray-600 hover:border-blue-500 rounded-lg text-left text-white transition-all duration-200 transform hover:scale-105"
                disabled={gameState !== 'playing'}
              >
                <span className="font-semibold text-blue-400 mr-3">
                  {String.fromCharCode(65 + index)}.
                </span>
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper functions
function getQuestionsForMode(config: GameModeConfig, allQuestions: EnhancedQuizQuestion[]): EnhancedQuizQuestion[] {
  let filteredQuestions = [...allQuestions];

  // Filter by character if specified
  if (config.characterId) {
    filteredQuestions = filteredQuestions.filter(q => 
      q.characterId === config.characterId ||
      q.question.toLowerCase().includes(getCharacterName(config.characterId!).toLowerCase())
    );
  }

  // Filter by difficulty if specified
  if (config.difficulty) {
    filteredQuestions = filteredQuestions.filter(q => q.difficulty === config.difficulty);
  }

  // Shuffle questions
  const shuffled = filteredQuestions.sort(() => Math.random() - 0.5);

  // Return appropriate number of questions
  if (config.questionCount) {
    return shuffled.slice(0, config.questionCount);
  }

  // For survival mode, start with a smaller set
  if (config.mode === 'survival') {
    return shuffled.slice(0, 10);
  }

  return shuffled;
}

function getCharacterName(characterId: number): string {
  // This would normally fetch from the characters array
  // For now, return a placeholder
  return 'Character';
}

function getBasePoints(mode: GameMode, difficulty: DifficultyLevel): number {
  const difficultyMultiplier = {
    easy: 1,
    medium: 1.5,
    hard: 2,
    expert: 3
  };

  const modeMultiplier = {
    classic: 10,
    survival: 15,
    timeAttack: 8,
    characterSpecific: 12,
    dailyChallenge: 20,
    endurance: 10,
    speedRun: 12
  };

  return Math.floor(modeMultiplier[mode] * difficultyMultiplier[difficulty]);
}

function getSpeedBonus(mode: GameMode, timeSpent: number): number {
  if (mode === 'timeAttack' || mode === 'speedRun') {
    // Bonus for answering quickly (under 5 seconds)
    if (timeSpent < 5000) {
      return Math.floor((5000 - timeSpent) / 100);
    }
  }
  return 0;
}

function getDynamicDifficulty(streak: number): DifficultyLevel {
  if (streak < 5) return 'easy';
  if (streak < 10) return 'medium';
  if (streak < 20) return 'hard';
  return 'expert';
}

function generateAdditionalQuestions(
  allQuestions: EnhancedQuizQuestion[],
  startIndex: number,
  difficulty: DifficultyLevel
): EnhancedQuizQuestion[] {
  const filteredQuestions = allQuestions.filter(q => q.difficulty === difficulty);
  const shuffled = filteredQuestions.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 5); // Add 5 more questions
}

export default GameModeManager;