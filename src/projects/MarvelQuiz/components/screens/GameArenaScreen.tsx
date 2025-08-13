import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Heart, Zap, Pause, Play, Home, Lightbulb } from 'lucide-react';
import { useGameStore } from '../../stores/gameStore';
import { GlassPanel } from '../ui/GlassPanel';
import { GlassButton } from '../ui/GlassButton';
import { cn } from '../../lib/utils';

interface AnswerOptionProps {
  option: string;
  index: number;
  isSelected: boolean;
  isCorrect?: boolean;
  isRevealed: boolean;
  onClick: () => void;
}

function AnswerOption({ option, index, isSelected, isCorrect, isRevealed, onClick }: AnswerOptionProps) {
  const letters = ['A', 'B', 'C', 'D'];
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <GlassButton
        onClick={onClick}
        disabled={isRevealed}
        className={cn(
          "w-full p-4 text-left transition-all duration-300",
          "hover:bg-white/20 border-2",
          isSelected && !isRevealed && "bg-blue-500/30 border-blue-400",
          isRevealed && isCorrect && "bg-green-500/30 border-green-400 animate-pulse-glow",
          isRevealed && isSelected && !isCorrect && "bg-red-500/30 border-red-400",
          !isSelected && !isRevealed && "border-white/20"
        )}
      >
        <div className="flex items-center gap-4">
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
            isSelected && !isRevealed && "bg-blue-500 text-white",
            isRevealed && isCorrect && "bg-green-500 text-white",
            isRevealed && isSelected && !isCorrect && "bg-red-500 text-white",
            !isSelected && !isRevealed && "bg-white/20 text-white"
          )}>
            {letters[index]}
          </div>
          <span className="text-white font-medium flex-1">{option}</span>
        </div>
      </GlassButton>
    </motion.div>
  );
}

function GameTimer({ timeRemaining, gameMode }: { timeRemaining: number; gameMode: string }) {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  
  if (gameMode !== 'blitz') return null;
  
  return (
    <div className={cn(
      "flex items-center gap-2 px-4 py-2 rounded-lg",
      timeRemaining < 60 ? "bg-red-500/20 text-red-300" : "bg-blue-500/20 text-blue-300"
    )}>
      <Clock className="w-5 h-5" />
      <span className="font-mono text-lg font-bold">
        {minutes}:{seconds.toString().padStart(2, '0')}
      </span>
    </div>
  );
}

function GameStats({ session }: { session: any }) {
  return (
    <div className="flex items-center gap-6">
      {/* Score */}
      <div className="flex items-center gap-2 text-yellow-300">
        <Zap className="w-5 h-5" />
        <span className="font-bold text-lg">{session.score.toLocaleString()}</span>
      </div>
      
      {/* Lives */}
      {session.gameMode !== 'blitz' && (
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-400" />
          <div className="flex gap-1">
            {Array.from({ length: Math.max(session.lives, 0) }).map((_, i) => (
              <Heart key={i} className="w-4 h-4 text-red-400 fill-current" />
            ))}
            {Array.from({ length: Math.max(3 - session.lives, 0) }).map((_, i) => (
              <Heart key={`empty-${i}`} className="w-4 h-4 text-gray-600" />
            ))}
          </div>
        </div>
      )}
      
      {/* Streak */}
      {session.streak > 0 && (
        <div className="flex items-center gap-2 text-orange-300">
          <span className="text-sm">Streak:</span>
          <span className="font-bold">{session.streak}</span>
        </div>
      )}
    </div>
  );
}

export function GameArenaScreen() {
  const { 
    currentSession, 
    submitAnswer, 
    nextQuestion, 
    pauseGame, 
    resumeGame, 
    setCurrentScreen,
    endGame
  } = useGameStore();
  
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  
  useEffect(() => {
    if (!currentSession) {
      setCurrentScreen('home');
      return;
    }
    
    setTimeRemaining(currentSession.timeRemaining || 0);
  }, [currentSession, setCurrentScreen]);
  
  // Timer effect
  useEffect(() => {
    if (!currentSession || currentSession.status !== 'active' || currentSession.gameMode !== 'blitz') {
      return;
    }
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [currentSession, endGame]);
  
  // Reset question state when question changes
  useEffect(() => {
    setSelectedAnswer(null);
    setIsRevealed(false);
    setQuestionStartTime(Date.now());
  }, [currentSession?.currentQuestionIndex]);
  
  if (!currentSession) {
    return null;
  }
  
  const currentQuestion = currentSession.questions[currentSession.currentQuestionIndex];
  const progress = ((currentSession.currentQuestionIndex + 1) / currentSession.questions.length) * 100;
  
  const handleAnswerSelect = (answer: string) => {
    if (isRevealed) return;
    setSelectedAnswer(answer);
  };
  
  const handleSubmitAnswer = () => {
    if (!selectedAnswer || isRevealed) return;
    
    submitAnswer(selectedAnswer);
    setIsRevealed(true);
    
    // Auto-advance after 2 seconds
    setTimeout(() => {
      if (currentSession.currentQuestionIndex < currentSession.questions.length - 1) {
        nextQuestion();
      } else {
        endGame();
      }
    }, 2000);
  };
  
  const handlePause = () => {
    if (currentSession.status === 'active') {
      pauseGame();
    } else {
      resumeGame();
    }
  };
  
  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <GlassPanel className="p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Loading Question...</h2>
        </GlassPanel>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen p-4 flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <GlassPanel className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <GlassButton
                onClick={() => setCurrentScreen('home')}
                className="p-2 hover:bg-white/20"
              >
                <Home className="w-5 h-5 text-white" />
              </GlassButton>
              
              <GlassButton
                onClick={handlePause}
                className="p-2 hover:bg-white/20"
              >
                {currentSession.status === 'active' ? (
                  <Pause className="w-5 h-5 text-white" />
                ) : (
                  <Play className="w-5 h-5 text-white" />
                )}
              </GlassButton>
              
              <div className="text-white font-semibold capitalize">
                {currentSession.gameMode} Mode
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <GameTimer timeRemaining={timeRemaining} gameMode={currentSession.gameMode} />
              <GameStats session={currentSession} />
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-white/10 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          
          <div className="flex justify-between text-sm text-gray-300 mt-2">
            <span>Question {currentSession.currentQuestionIndex + 1} of {currentSession.questions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
        </GlassPanel>
      </motion.div>
      
      {/* Question Content */}
      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-4xl w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSession.currentQuestionIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.5 }}
            >
              <GlassPanel className="p-8 mb-8">
                {/* Question Category & Difficulty */}
                <div className="flex items-center justify-between mb-6">
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium">
                    {currentQuestion.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-sm">Difficulty:</span>
                    <span className={cn(
                      "px-2 py-1 rounded text-xs font-bold",
                      currentQuestion.difficulty === 'easy' && "bg-green-500/20 text-green-300",
                      currentQuestion.difficulty === 'medium' && "bg-yellow-500/20 text-yellow-300",
                      currentQuestion.difficulty === 'hard' && "bg-red-500/20 text-red-300"
                    )}>
                      {currentQuestion.difficulty.toUpperCase()}
                    </span>
                  </div>
                </div>
                
                {/* Question Text */}
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 leading-relaxed">
                  {currentQuestion.question}
                </h2>
                
                {/* Character Image */}
                {currentQuestion.imageUrl && (
                  <div className="mb-6 flex justify-center">
                    <img
                      src={currentQuestion.imageUrl || '/placeholder-character.jpg'}
                      alt="Marvel Character"
                      className="max-w-xs max-h-64 object-cover rounded-lg border-2 border-white/20"
                    />
                  </div>
                )}
                
                {/* Hint */}
                {currentQuestion.explanation && (
                  <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <div className="flex items-center gap-2 text-yellow-300">
                      <Lightbulb className="w-4 h-4" />
                      <span className="text-sm font-medium">Hint:</span>
                    </div>
                    <p className="text-yellow-200 text-sm mt-1">{currentQuestion.explanation}</p>
                  </div>
                )}
              </GlassPanel>
              
              {/* Answer Options */}
              <div className="grid gap-4 mb-8">
                {currentQuestion.options.map((option, index) => (
                  <AnswerOption
                    key={index}
                    option={option}
                    index={index}
                    isSelected={selectedAnswer === option}
                    isCorrect={index === currentQuestion.correctAnswer}
                    isRevealed={isRevealed}
                    onClick={() => handleAnswerSelect(option)}
                  />
                ))}
              </div>
              
              {/* Submit Button */}
              {!isRevealed && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <GlassButton
                    onClick={handleSubmitAnswer}
                    disabled={!selectedAnswer}
                    className={cn(
                      "px-8 py-4 text-lg font-bold transition-all duration-300",
                      selectedAnswer 
                        ? "bg-blue-500/30 text-white hover:bg-blue-500/50" 
                        : "bg-gray-500/20 text-gray-400 cursor-not-allowed"
                    )}
                  >
                    Submit Answer
                  </GlassButton>
                </motion.div>
              )}
              
              {/* Result Feedback */}
              {isRevealed && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center"
                >
                  <GlassPanel className={cn(
                    "p-6",
                    currentQuestion.options.indexOf(selectedAnswer) === currentQuestion.correctAnswer 
                      ? "bg-green-500/20 border-green-500/30" 
                      : "bg-red-500/20 border-red-500/30"
                  )}>
                    <h3 className={cn(
                      "text-2xl font-bold mb-2",
                      currentQuestion.options.indexOf(selectedAnswer) === currentQuestion.correctAnswer ? "text-green-300" : "text-red-300"
                    )}>
                      {currentQuestion.options.indexOf(selectedAnswer) === currentQuestion.correctAnswer ? "Correct!" : "Incorrect!"}
                    </h3>
                    
                    {currentQuestion.options.indexOf(selectedAnswer) !== currentQuestion.correctAnswer && (
                       <p className="text-white mb-2">
                         The correct answer was: <span className="font-bold text-green-300">{currentQuestion.options[currentQuestion.correctAnswer]}</span>
                       </p>
                     )}
                    
                    {currentQuestion.explanation && (
                      <p className="text-gray-300 text-sm">{currentQuestion.explanation}</p>
                    )}
                    
                    <div className="mt-4 text-yellow-300">
                      +{currentQuestion.options.indexOf(selectedAnswer) === currentQuestion.correctAnswer ? (currentQuestion.difficulty === 'easy' ? 10 : currentQuestion.difficulty === 'medium' ? 20 : 30) : 0} points
                    </div>
                  </GlassPanel>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      
      {/* Pause Overlay */}
      <AnimatePresence>
        {currentSession.status === 'paused' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <GlassPanel className="p-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Game Paused</h2>
              <p className="text-gray-300 mb-6">Take your time, the universe can wait.</p>
              <div className="flex gap-4 justify-center">
                <GlassButton
                  onClick={resumeGame}
                  className="px-6 py-3 bg-green-500/30 text-white hover:bg-green-500/50"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Resume
                </GlassButton>
                <GlassButton
                  onClick={() => setCurrentScreen('home')}
                  className="px-6 py-3 bg-red-500/30 text-white hover:bg-red-500/50"
                >
                  <Home className="w-5 h-5 mr-2" />
                  Quit Game
                </GlassButton>
              </div>
            </GlassPanel>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default GameArenaScreen;