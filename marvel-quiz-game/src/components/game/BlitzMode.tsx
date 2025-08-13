import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Clock, 
  Star, 
  Target, 
  TrendingUp,
  Flame,
  Award,
  Timer,
  RotateCcw
} from 'lucide-react';
import { useGameStore } from '../../stores/gameStore';
import { GlassPanel } from '../ui/GlassPanel';
import { GlassButton } from '../ui/GlassButton';
import { cn } from '../../lib/utils';

// Mock questions for Blitz mode
const blitzQuestions = [
  {
    id: '1',
    question: 'What is Spider-Man\'s real name?',
    options: ['Peter Parker', 'Miles Morales', 'Ben Reilly', 'Kaine Parker'],
    correctAnswer: 0,
    difficulty: 'easy',
    points: 100
  },
  {
    id: '2',
    question: 'Which Infinity Stone is red?',
    options: ['Power Stone', 'Reality Stone', 'Soul Stone', 'Mind Stone'],
    correctAnswer: 1,
    difficulty: 'medium',
    points: 200
  },
  {
    id: '3',
    question: 'What is the name of Thor\'s hammer?',
    options: ['Stormbreaker', 'Gungnir', 'Mjolnir', 'Gram'],
    correctAnswer: 2,
    difficulty: 'easy',
    points: 100
  },
  {
    id: '4',
    question: 'Who founded the X-Men?',
    options: ['Magneto', 'Professor X', 'Cyclops', 'Jean Grey'],
    correctAnswer: 1,
    difficulty: 'medium',
    points: 200
  },
  {
    id: '5',
    question: 'What is the real name of the Winter Soldier?',
    options: ['Steve Rogers', 'Sam Wilson', 'Bucky Barnes', 'John Walker'],
    correctAnswer: 2,
    difficulty: 'medium',
    points: 200
  }
];

interface BlitzModeProps {
  onGameEnd: (results: any) => void;
  timeLimit?: number;
}

export function BlitzMode({ onGameEnd, timeLimit = 60 }: BlitzModeProps) {
  const { player, updatePlayerStats } = useGameStore();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [isGameActive, setIsGameActive] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [powerUpActive, setPowerUpActive] = useState(false);
  const [questions, setQuestions] = useState(blitzQuestions);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const questionStartTime = useRef(Date.now());
  
  useEffect(() => {
    if (isGameActive && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      endGame();
    }
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timeLeft, isGameActive]);
  
  useEffect(() => {
    questionStartTime.current = Date.now();
  }, [currentQuestionIndex]);
  
  const getStreakMultiplier = (streak: number) => {
    if (streak >= 10) return 3;
    if (streak >= 5) return 2;
    if (streak >= 3) return 1.5;
    return 1;
  };
  
  const handleAnswer = (answerIndex: number) => {
    if (!isGameActive || selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    const responseTime = (Date.now() - questionStartTime.current) / 1000;
    
    setAnsweredQuestions(prev => prev + 1);
    
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
      setStreak(prev => {
        const newStreak = prev + 1;
        setMaxStreak(current => Math.max(current, newStreak));
        return newStreak;
      });
      
      // Calculate points with multipliers
      const basePoints = currentQuestion.points;
      const streakMultiplier = getStreakMultiplier(streak + 1);
      const timeBonus = responseTime < 3 ? 1.5 : responseTime < 5 ? 1.2 : 1;
      const finalPoints = Math.round(basePoints * streakMultiplier * timeBonus * multiplier);
      
      setScore(prev => prev + finalPoints);
      
      // Activate power-up for high streaks
      if ((streak + 1) % 5 === 0) {
        setPowerUpActive(true);
        setMultiplier(2);
        setTimeout(() => {
          setPowerUpActive(false);
          setMultiplier(1);
        }, 10000);
      }
    } else {
      setStreak(0);
    }
    
    // Move to next question after delay
    setTimeout(() => {
      setSelectedAnswer(null);
      setShowResult(false);
      
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        // Shuffle questions for continuous play
        const shuffled = [...questions].sort(() => Math.random() - 0.5);
        setQuestions(shuffled);
        setCurrentQuestionIndex(0);
      }
    }, 1500);
  };
  
  const endGame = () => {
    setIsGameActive(false);
    
    const accuracy = answeredQuestions > 0 ? (correctAnswers / answeredQuestions) * 100 : 0;
    const results = {
      mode: 'blitz',
      score,
      accuracy: Math.round(accuracy),
      questionsAnswered: answeredQuestions,
      correctAnswers,
      maxStreak,
      timeSpent: timeLimit - timeLeft,
      difficulty: 'mixed'
    };
    
    // Update player stats
    updatePlayerStats({
      gamesPlayed: player.stats.gamesPlayed + 1,
      totalScore: player.stats.totalScore + score,
      bestStreak: Math.max(player.stats.bestStreak, maxStreak),
      averageAccuracy: ((player.stats.averageAccuracy * player.stats.gamesPlayed) + accuracy) / (player.stats.gamesPlayed + 1)
    });
    
    onGameEnd(results);
  };
  
  const currentQuestion = questions[currentQuestionIndex];
  const progress = (timeLimit - timeLeft) / timeLimit * 100;
  const accuracy = answeredQuestions > 0 ? (correctAnswers / answeredQuestions) * 100 : 0;
  
  if (!isGameActive) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center min-h-[400px]"
      >
        <GlassPanel className="p-8 text-center max-w-md">
          <Zap className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Time's Up!</h2>
          <p className="text-gray-400">Calculating your results...</p>
        </GlassPanel>
      </motion.div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Game Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Zap className="w-8 h-8 text-yellow-400" />
          <h2 className="text-3xl font-bold text-white">Blitz Mode</h2>
          {powerUpActive && (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full text-black text-sm font-bold"
            >
              2X MULTIPLIER!
            </motion.div>
          )}
        </div>
        <p className="text-gray-400">Answer as many questions as possible before time runs out!</p>
      </motion.div>
      
      {/* Game Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-5 gap-4"
      >
        <GlassPanel className="p-4 text-center">
          <Timer className="w-6 h-6 text-red-400 mx-auto mb-2" />
          <div className={cn(
            "text-2xl font-bold mb-1",
            timeLeft <= 10 ? "text-red-400" : "text-white"
          )}>
            {timeLeft}s
          </div>
          <div className="text-xs text-gray-400">Time Left</div>
        </GlassPanel>
        
        <GlassPanel className="p-4 text-center">
          <Star className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-yellow-400 mb-1">{score.toLocaleString()}</div>
          <div className="text-xs text-gray-400">Score</div>
        </GlassPanel>
        
        <GlassPanel className="p-4 text-center">
          <Flame className="w-6 h-6 text-orange-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-orange-400 mb-1">{streak}</div>
          <div className="text-xs text-gray-400">Streak</div>
        </GlassPanel>
        
        <GlassPanel className="p-4 text-center">
          <Target className="w-6 h-6 text-green-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-green-400 mb-1">{Math.round(accuracy)}%</div>
          <div className="text-xs text-gray-400">Accuracy</div>
        </GlassPanel>
        
        <GlassPanel className="p-4 text-center">
          <TrendingUp className="w-6 h-6 text-blue-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-blue-400 mb-1">{answeredQuestions}</div>
          <div className="text-xs text-gray-400">Answered</div>
        </GlassPanel>
      </motion.div>
      
      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <GlassPanel className="p-4">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Game Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
            <motion.div
              className={cn(
                "h-full rounded-full transition-all duration-300",
                timeLeft <= 10 
                  ? "bg-gradient-to-r from-red-500 to-red-600" 
                  : "bg-gradient-to-r from-blue-500 to-purple-500"
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        </GlassPanel>
      </motion.div>
      
      {/* Current Question */}
      <motion.div
        key={currentQuestionIndex}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <GlassPanel className="p-6">
          {/* Question Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={cn(
                "px-3 py-1 rounded-full text-sm font-bold",
                currentQuestion.difficulty === 'easy' ? "bg-green-500/20 text-green-400" :
                currentQuestion.difficulty === 'medium' ? "bg-yellow-500/20 text-yellow-400" :
                "bg-red-500/20 text-red-400"
              )}>
                {currentQuestion.difficulty.toUpperCase()}
              </div>
              <div className="text-sm text-gray-400">
                +{Math.round(currentQuestion.points * getStreakMultiplier(streak) * multiplier)} points
              </div>
            </div>
            
            {streak >= 3 && (
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="flex items-center gap-2 px-3 py-1 bg-orange-500/20 rounded-full"
              >
                <Flame className="w-4 h-4 text-orange-400" />
                <span className="text-orange-400 font-bold">{getStreakMultiplier(streak)}x</span>
              </motion.div>
            )}
          </div>
          
          {/* Question */}
          <h3 className="text-xl font-bold text-white mb-6">{currentQuestion.question}</h3>
          
          {/* Answer Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === currentQuestion.correctAnswer;
              const showCorrect = showResult && isCorrect;
              const showIncorrect = showResult && isSelected && !isCorrect;
              
              return (
                <motion.div
                  key={index}
                  whileHover={{ scale: selectedAnswer === null ? 1.02 : 1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <GlassButton
                    onClick={() => handleAnswer(index)}
                    disabled={selectedAnswer !== null}
                    className={cn(
                      "w-full p-4 text-left transition-all duration-300",
                      showCorrect && "bg-green-500/30 border-green-400",
                      showIncorrect && "bg-red-500/30 border-red-400",
                      !showResult && "hover:bg-white/10",
                      selectedAnswer === null && "cursor-pointer"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-white">{option}</span>
                      {showCorrect && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                        >
                          <span className="text-white text-sm">✓</span>
                        </motion.div>
                      )}
                      {showIncorrect && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
                        >
                          <span className="text-white text-sm">✗</span>
                        </motion.div>
                      )}
                    </div>
                  </GlassButton>
                </motion.div>
              );
            })}
          </div>
          
          {/* Result Feedback */}
          <AnimatePresence>
            {showResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-6 text-center"
              >
                {selectedAnswer === currentQuestion.correctAnswer ? (
                  <div className="text-green-400">
                    <div className="text-lg font-bold">Correct! 🎉</div>
                    <div className="text-sm">
                      +{Math.round(currentQuestion.points * getStreakMultiplier(streak) * multiplier)} points
                    </div>
                  </div>
                ) : (
                  <div className="text-red-400">
                    <div className="text-lg font-bold">Incorrect 😞</div>
                    <div className="text-sm text-gray-400">
                      Correct answer: {currentQuestion.options[currentQuestion.correctAnswer]}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </GlassPanel>
      </motion.div>
      
      {/* Emergency End Game Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center"
      >
        <GlassButton
          onClick={endGame}
          className="px-6 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border-red-500/30"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          End Game Early
        </GlassButton>
      </motion.div>
    </div>
  );
}

export default BlitzMode;