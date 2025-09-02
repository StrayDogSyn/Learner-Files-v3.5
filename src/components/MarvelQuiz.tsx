import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, Trophy, Clock, Zap, Star } from 'lucide-react';
import { QuizQuestion, GameStats, QuizState } from '../types/marvel';
import { getRandomQuestions } from '../data/marvelQuestions';

interface MarvelQuizProps {
  onClose?: () => void;
}

const MarvelQuiz: React.FC<MarvelQuizProps> = ({ onClose }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [gameStats, setGameStats] = useState<GameStats>({
    score: 0,
    questionsAnswered: 0,
    correctAnswers: 0,
    currentStreak: 0,
    bestStreak: 0
  });
  const [quizState, setQuizState] = useState<QuizState>({
    isPlaying: false,
    currentQuestionIndex: 0,
    selectedAnswer: null,
    showResult: false,
    gameComplete: false,
    timeLeft: 30
  });

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (quizState.isPlaying && quizState.timeLeft > 0 && !quizState.showResult) {
      timer = setTimeout(() => {
        setQuizState(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
      }, 1000);
    } else if (quizState.timeLeft === 0 && !quizState.showResult) {
      handleTimeUp();
    }
    return () => clearTimeout(timer);
  }, [quizState.isPlaying, quizState.timeLeft, quizState.showResult]);

  const startGame = useCallback(() => {
    const newQuestions = getRandomQuestions(5);
    setQuestions(newQuestions);
    setQuizState({
      isPlaying: true,
      currentQuestionIndex: 0,
      selectedAnswer: null,
      showResult: false,
      gameComplete: false,
      timeLeft: 30
    });
    setGameStats({
      score: 0,
      questionsAnswered: 0,
      correctAnswers: 0,
      currentStreak: 0,
      bestStreak: 0
    });
  }, []);

  const handleAnswerSelect = useCallback((answer: string) => {
    if (quizState.showResult) return;
    setQuizState(prev => ({ ...prev, selectedAnswer: answer }));
  }, [quizState.showResult]);

  const handleAnswerSubmit = useCallback(() => {
    if (!quizState.selectedAnswer) return;

    const currentQuestion = questions[quizState.currentQuestionIndex];
    const isCorrect = quizState.selectedAnswer === currentQuestion.correctAnswer;
    
    setQuizState(prev => ({ ...prev, showResult: true }));
    
    setGameStats(prev => {
      const newStats = {
        ...prev,
        questionsAnswered: prev.questionsAnswered + 1,
        correctAnswers: isCorrect ? prev.correctAnswers + 1 : prev.correctAnswers,
        score: isCorrect ? prev.score + currentQuestion.points : prev.score,
        currentStreak: isCorrect ? prev.currentStreak + 1 : 0
      };
      
      return {
        ...newStats,
        bestStreak: Math.max(newStats.currentStreak, prev.bestStreak)
      };
    });
  }, [quizState.selectedAnswer, questions, quizState.currentQuestionIndex]);

  const handleNextQuestion = useCallback(() => {
    const nextIndex = quizState.currentQuestionIndex + 1;
    
    if (nextIndex >= questions.length) {
      setQuizState(prev => ({ ...prev, gameComplete: true, isPlaying: false }));
    } else {
      setQuizState({
        ...quizState,
        currentQuestionIndex: nextIndex,
        selectedAnswer: null,
        showResult: false,
        timeLeft: 30
      });
    }
  }, [quizState, questions.length]);

  const handleTimeUp = useCallback(() => {
    setQuizState(prev => ({ ...prev, showResult: true, selectedAnswer: 'timeout' }));
    setGameStats(prev => ({
      ...prev,
      questionsAnswered: prev.questionsAnswered + 1,
      currentStreak: 0
    }));
  }, []);

  const resetGame = useCallback(() => {
    setQuizState({
      isPlaying: false,
      currentQuestionIndex: 0,
      selectedAnswer: null,
      showResult: false,
      gameComplete: false,
      timeLeft: 30
    });
  }, []);

  const currentQuestion = questions[quizState.currentQuestionIndex];
  const progress = questions.length > 0 ? ((quizState.currentQuestionIndex + 1) / questions.length) * 100 : 0;

  if (!quizState.isPlaying && !quizState.gameComplete) {
    return (
      <div className="glass-card p-8 max-w-2xl mx-auto">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mb-6"
          >
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-red-500 to-blue-600 rounded-full flex items-center justify-center">
              <Zap className="w-10 h-10 text-white" />
            </div>
          </motion.div>
          
          <h2 className="text-3xl font-bold text-white mb-4">Marvel Quiz Challenge</h2>
          <p className="text-hunter-200 mb-8 text-lg">
            Test your knowledge of the Marvel Universe! Answer 5 questions and see how well you know your favorite heroes and villains.
          </p>
          
          <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
            <div className="glass-subtle p-4 rounded-lg">
              <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
              <div className="text-white font-semibold">5 Questions</div>
              <div className="text-hunter-300">Random Marvel trivia</div>
            </div>
            <div className="glass-subtle p-4 rounded-lg">
              <Clock className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <div className="text-white font-semibold">30 Seconds</div>
              <div className="text-hunter-300">Per question</div>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startGame}
            className="glass-button-primary px-8 py-4 rounded-lg font-semibold text-lg flex items-center gap-3 mx-auto"
          >
            <Play className="w-6 h-6" />
            Start Quiz
          </motion.button>
          
          {onClose && (
            <button
              onClick={onClose}
              className="mt-4 text-hunter-300 hover:text-white transition-colors"
            >
              Close
            </button>
          )}
        </div>
      </div>
    );
  }

  if (quizState.gameComplete) {
    const accuracy = gameStats.questionsAnswered > 0 ? (gameStats.correctAnswers / gameStats.questionsAnswered) * 100 : 0;
    
    return (
      <div className="glass-card p-8 max-w-2xl mx-auto">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            className="mb-6"
          >
            <Trophy className="w-20 h-20 text-yellow-400 mx-auto" />
          </motion.div>
          
          <h2 className="text-3xl font-bold text-white mb-6">Quiz Complete!</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="glass-subtle p-6 rounded-lg">
              <div className="text-3xl font-bold text-white mb-2">{gameStats.score}</div>
              <div className="text-hunter-300">Total Score</div>
            </div>
            <div className="glass-subtle p-6 rounded-lg">
              <div className="text-3xl font-bold text-white mb-2">{accuracy.toFixed(0)}%</div>
              <div className="text-hunter-300">Accuracy</div>
            </div>
            <div className="glass-subtle p-6 rounded-lg">
              <div className="text-3xl font-bold text-white mb-2">{gameStats.correctAnswers}</div>
              <div className="text-hunter-300">Correct Answers</div>
            </div>
            <div className="glass-subtle p-6 rounded-lg">
              <div className="text-3xl font-bold text-white mb-2">{gameStats.bestStreak}</div>
              <div className="text-hunter-300">Best Streak</div>
            </div>
          </div>
          
          <div className="flex gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startGame}
              className="glass-button-primary px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Play Again
            </motion.button>
            
            {onClose && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="glass-button px-6 py-3 rounded-lg font-semibold"
              >
                Close
              </motion.button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-8 max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-hunter-200 text-sm">
            Question {quizState.currentQuestionIndex + 1} of {questions.length}
          </span>
          <div className="flex items-center gap-2 text-hunter-200 text-sm">
            <Clock className="w-4 h-4" />
            <span className={quizState.timeLeft <= 10 ? 'text-red-400' : ''}>
              {quizState.timeLeft}s
            </span>
          </div>
        </div>
        <div className="w-full bg-hunter-800 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Score Display */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400" />
            <span className="text-white font-semibold">{gameStats.score}</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-orange-400" />
            <span className="text-white font-semibold">{gameStats.currentStreak}</span>
          </div>
        </div>
        <div className="text-hunter-300 text-sm">
          {currentQuestion?.difficulty.toUpperCase()} • {currentQuestion?.category.toUpperCase()}
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={quizState.currentQuestionIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="mb-8"
        >
          <h3 className="text-xl font-semibold text-white mb-6">
            {currentQuestion?.question}
          </h3>
          
          <div className="space-y-3">
            {currentQuestion?.options.map((option, index) => {
              const isSelected = quizState.selectedAnswer === option;
              const isCorrect = option === currentQuestion.correctAnswer;
              const isWrong = quizState.showResult && isSelected && !isCorrect;
              const showCorrect = quizState.showResult && isCorrect;
              
              return (
                <motion.button
                  key={index}
                  whileHover={!quizState.showResult ? { scale: 1.02 } : {}}
                  whileTap={!quizState.showResult ? { scale: 0.98 } : {}}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={quizState.showResult}
                  className={`
                    w-full p-4 rounded-lg text-left transition-all duration-300 border-2
                    ${isSelected && !quizState.showResult
                      ? 'border-blue-400 bg-blue-400/20'
                      : !quizState.showResult
                      ? 'border-hunter-600 bg-hunter-800/50 hover:border-hunter-500'
                      : ''
                    }
                    ${showCorrect
                      ? 'border-green-400 bg-green-400/20'
                      : ''
                    }
                    ${isWrong
                      ? 'border-red-400 bg-red-400/20'
                      : ''
                    }
                    ${quizState.showResult && !isSelected && !isCorrect
                      ? 'border-hunter-700 bg-hunter-800/30 opacity-60'
                      : ''
                    }
                  `}
                >
                  <span className="text-white font-medium">{option}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Result and Explanation */}
      <AnimatePresence>
        {quizState.showResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className={`p-4 rounded-lg border-2 ${
              quizState.selectedAnswer === currentQuestion?.correctAnswer
                ? 'border-green-400 bg-green-400/10'
                : 'border-red-400 bg-red-400/10'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {quizState.selectedAnswer === currentQuestion?.correctAnswer ? (
                  <span className="text-green-400 font-semibold">✓ Correct!</span>
                ) : (
                  <span className="text-red-400 font-semibold">✗ Incorrect</span>
                )}
                <span className="text-hunter-200">+{currentQuestion?.points || 0} points</span>
              </div>
              {currentQuestion?.explanation && (
                <p className="text-hunter-200 text-sm">{currentQuestion.explanation}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <button
          onClick={resetGame}
          className="glass-button px-4 py-2 rounded-lg font-medium flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Restart
        </button>
        
        {quizState.showResult ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNextQuestion}
            className="glass-button-primary px-6 py-2 rounded-lg font-medium"
          >
            {quizState.currentQuestionIndex + 1 >= questions.length ? 'Finish' : 'Next Question'}
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAnswerSubmit}
            disabled={!quizState.selectedAnswer}
            className="glass-button-primary px-6 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Answer
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default MarvelQuiz;