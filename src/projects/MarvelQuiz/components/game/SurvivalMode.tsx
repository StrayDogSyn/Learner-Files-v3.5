import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Heart, 
  Star, 
  Target, 
  TrendingUp,
  Skull,
  Award,
  Timer,
  AlertTriangle,
  RotateCcw,
  Zap,
  ArrowRight
} from 'lucide-react';
import { useGameStore } from '../../stores/gameStore';
import { GlassPanel } from '../ui/GlassPanel';
import { GlassButton } from '../ui/GlassButton';
import { cn } from '../../lib/utils';

// Mock questions for Survival mode with varying difficulties
const survivalQuestions = [
  // Easy questions (Level 1-5)
  {
    id: '1',
    question: 'What is Spider-Man\'s real name?',
    options: ['Peter Parker', 'Miles Morales', 'Ben Reilly', 'Kaine Parker'],
    correctAnswer: 0,
    difficulty: 'easy',
    level: 1
  },
  {
    id: '2',
    question: 'What is the name of Thor\'s hammer?',
    options: ['Stormbreaker', 'Gungnir', 'Mjolnir', 'Gram'],
    correctAnswer: 2,
    difficulty: 'easy',
    level: 1
  },
  {
    id: '3',
    question: 'Who is the leader of the Avengers?',
    options: ['Iron Man', 'Captain America', 'Thor', 'Hulk'],
    correctAnswer: 1,
    difficulty: 'easy',
    level: 2
  },
  // Medium questions (Level 6-15)
  {
    id: '4',
    question: 'Which Infinity Stone is red?',
    options: ['Power Stone', 'Reality Stone', 'Soul Stone', 'Mind Stone'],
    correctAnswer: 1,
    difficulty: 'medium',
    level: 6
  },
  {
    id: '5',
    question: 'What is the real name of the Winter Soldier?',
    options: ['Steve Rogers', 'Sam Wilson', 'Bucky Barnes', 'John Walker'],
    correctAnswer: 2,
    difficulty: 'medium',
    level: 8
  },
  {
    id: '6',
    question: 'Who founded the X-Men?',
    options: ['Magneto', 'Professor X', 'Cyclops', 'Jean Grey'],
    correctAnswer: 1,
    difficulty: 'medium',
    level: 10
  },
  // Hard questions (Level 16+)
  {
    id: '7',
    question: 'What is the name of the cosmic entity that devours planets?',
    options: ['Galactus', 'Dormammu', 'Eternity', 'The Living Tribunal'],
    correctAnswer: 0,
    difficulty: 'hard',
    level: 16
  },
  {
    id: '8',
    question: 'In which comic did Spider-Man first appear?',
    options: ['Amazing Fantasy #15', 'Spider-Man #1', 'Marvel Comics #1', 'Fantastic Four #1'],
    correctAnswer: 0,
    difficulty: 'hard',
    level: 18
  },
  {
    id: '9',
    question: 'What is the real name of the villain known as Doctor Doom?',
    options: ['Victor Von Doom', 'Reed Richards', 'Norman Osborn', 'Otto Octavius'],
    correctAnswer: 0,
    difficulty: 'hard',
    level: 20
  }
];

interface SurvivalModeProps {
  onGameEnd: (results: any) => void;
}

export function SurvivalMode({ onGameEnd }: SurvivalModeProps) {
  const { player, updatePlayerStats } = useGameStore();
  const [currentLevel, setCurrentLevel] = useState(1);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isGameActive, setIsGameActive] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(survivalQuestions[0]);
  const [usedQuestions, setUsedQuestions] = useState<string[]>([]);
  const [powerUps, setPowerUps] = useState({
    extraTime: 0,
    skipQuestion: 0,
    extraLife: 0
  });
  const [showPowerUpReward, setShowPowerUpReward] = useState<string | null>(null);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const questionStartTime = useRef(Date.now());
  
  useEffect(() => {
    if (isGameActive && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isGameActive) {
      handleTimeOut();
    }
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timeLeft, isGameActive]);
  
  useEffect(() => {
    questionStartTime.current = Date.now();
    generateNewQuestion();
  }, [currentLevel]);
  
  const getDifficultyFromLevel = (level: number) => {
    if (level <= 5) return 'easy';
    if (level <= 15) return 'medium';
    return 'hard';
  };
  
  const getTimeLimit = (level: number) => {
    if (level <= 5) return 30;
    if (level <= 10) return 25;
    if (level <= 15) return 20;
    if (level <= 20) return 15;
    return 10;
  };
  
  const getPointsForLevel = (level: number, responseTime: number) => {
    const basePoints = level * 50;
    const timeBonus = responseTime < 5 ? 1.5 : responseTime < 10 ? 1.2 : 1;
    const difficultyMultiplier = getDifficultyFromLevel(level) === 'easy' ? 1 : 
                                getDifficultyFromLevel(level) === 'medium' ? 1.5 : 2;
    return Math.round(basePoints * timeBonus * difficultyMultiplier);
  };
  
  const generateNewQuestion = () => {
    const difficulty = getDifficultyFromLevel(currentLevel);
    const availableQuestions = survivalQuestions.filter(q => 
      q.difficulty === difficulty && !usedQuestions.includes(q.id)
    );
    
    if (availableQuestions.length === 0) {
      // Reset used questions if we've used all questions of this difficulty
      setUsedQuestions([]);
      const resetQuestions = survivalQuestions.filter(q => q.difficulty === difficulty);
      const randomQuestion = resetQuestions[Math.floor(Math.random() * resetQuestions.length)];
      setCurrentQuestion(randomQuestion);
      setUsedQuestions([randomQuestion.id]);
    } else {
      const randomQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
      setCurrentQuestion(randomQuestion);
      setUsedQuestions(prev => [...prev, randomQuestion.id]);
    }
  };
  
  const handleAnswer = (answerIndex: number) => {
    if (!isGameActive || selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    const responseTime = (Date.now() - questionStartTime.current) / 1000;
    
    setQuestionsAnswered(prev => prev + 1);
    
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
      setStreak(prev => {
        const newStreak = prev + 1;
        setMaxStreak(current => Math.max(current, newStreak));
        return newStreak;
      });
      
      const points = getPointsForLevel(currentLevel, responseTime);
      setScore(prev => prev + points);
      
      // Award power-ups for milestones
      if ((streak + 1) % 5 === 0) {
        const powerUpType = Math.random() < 0.4 ? 'extraTime' : 
                           Math.random() < 0.7 ? 'skipQuestion' : 'extraLife';
        setPowerUps(prev => ({ ...prev, [powerUpType]: prev[powerUpType] + 1 }));
        setShowPowerUpReward(powerUpType);
        setTimeout(() => setShowPowerUpReward(null), 3000);
      }
      
      // Level up and reset timer
      setTimeout(() => {
        setCurrentLevel(prev => prev + 1);
        setTimeLeft(getTimeLimit(currentLevel + 1));
        setSelectedAnswer(null);
        setShowResult(false);
      }, 1500);
    } else {
      setStreak(0);
      loseLife();
    }
  };
  
  const handleTimeOut = () => {
    setStreak(0);
    loseLife();
  };
  
  const loseLife = () => {
    setLives(prev => {
      const newLives = prev - 1;
      if (newLives <= 0) {
        endGame();
      } else {
        // Continue to next question after losing a life
        setTimeout(() => {
          setCurrentLevel(prev => prev + 1);
          setTimeLeft(getTimeLimit(currentLevel + 1));
          setSelectedAnswer(null);
          setShowResult(false);
        }, 2000);
      }
      return newLives;
    });
  };
  
  const usePowerUp = (type: string) => {
    if (powerUps[type as keyof typeof powerUps] <= 0) return;
    
    setPowerUps(prev => ({ ...prev, [type]: prev[type as keyof typeof prev] - 1 }));
    
    switch (type) {
      case 'extraTime':
        setTimeLeft(prev => Math.min(prev + 15, getTimeLimit(currentLevel) + 15));
        break;
      case 'skipQuestion':
        setCurrentLevel(prev => prev + 1);
        setTimeLeft(getTimeLimit(currentLevel + 1));
        generateNewQuestion();
        break;
      case 'extraLife':
        setLives(prev => Math.min(prev + 1, 5));
        break;
    }
  };
  
  const endGame = () => {
    setIsGameActive(false);
    
    const accuracy = questionsAnswered > 0 ? (correctAnswers / questionsAnswered) * 100 : 0;
    const results = {
      mode: 'survival',
      score,
      accuracy: Math.round(accuracy),
      questionsAnswered,
      correctAnswers,
      maxStreak,
      levelsReached: currentLevel,
      difficulty: 'adaptive'
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
  
  const accuracy = questionsAnswered > 0 ? (correctAnswers / questionsAnswered) * 100 : 0;
  const difficulty = getDifficultyFromLevel(currentLevel);
  
  if (!isGameActive) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center min-h-[400px]"
      >
        <GlassPanel className="p-8 text-center max-w-md">
          <Skull className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Game Over!</h2>
          <p className="text-gray-400">You survived {currentLevel} levels!</p>
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
          <Shield className="w-8 h-8 text-blue-400" />
          <h2 className="text-3xl font-bold text-white">Survival Mode</h2>
        </div>
        <p className="text-gray-400">Survive as long as possible! Difficulty increases with each level.</p>
      </motion.div>
      
      {/* Power-Up Reward Notification */}
      <AnimatePresence>
        {showPowerUpReward && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
          >
            <GlassPanel className="p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-400/50">
              <div className="flex items-center gap-3 text-yellow-400">
                <Award className="w-6 h-6" />
                <span className="font-bold">Power-Up Earned: {showPowerUpReward.replace(/([A-Z])/g, ' $1').trim()}</span>
              </div>
            </GlassPanel>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Game Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-6 gap-4"
      >
        <GlassPanel className="p-4 text-center">
          <div className="flex items-center justify-center gap-1 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Heart
                key={i}
                className={cn(
                  "w-4 h-4",
                  i < lives ? "text-red-400 fill-red-400" : "text-gray-600"
                )}
              />
            ))}
          </div>
          <div className="text-xs text-gray-400">Lives</div>
        </GlassPanel>
        
        <GlassPanel className="p-4 text-center">
          <div className={cn(
            "text-2xl font-bold mb-1",
            timeLeft <= 5 ? "text-red-400" : "text-white"
          )}>
            {timeLeft}s
          </div>
          <div className="text-xs text-gray-400">Time Left</div>
        </GlassPanel>
        
        <GlassPanel className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-400 mb-1">{currentLevel}</div>
          <div className="text-xs text-gray-400">Level</div>
        </GlassPanel>
        
        <GlassPanel className="p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400 mb-1">{score.toLocaleString()}</div>
          <div className="text-xs text-gray-400">Score</div>
        </GlassPanel>
        
        <GlassPanel className="p-4 text-center">
          <div className="text-2xl font-bold text-orange-400 mb-1">{streak}</div>
          <div className="text-xs text-gray-400">Streak</div>
        </GlassPanel>
        
        <GlassPanel className="p-4 text-center">
          <div className="text-2xl font-bold text-green-400 mb-1">{Math.round(accuracy)}%</div>
          <div className="text-xs text-gray-400">Accuracy</div>
        </GlassPanel>
      </motion.div>
      
      {/* Power-Ups */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <GlassPanel className="p-4">
          <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Power-Ups
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <GlassButton
              onClick={() => usePowerUp('extraTime')}
              disabled={powerUps.extraTime <= 0}
              className={cn(
                "p-3 text-center",
                powerUps.extraTime > 0 ? "hover:bg-blue-500/30" : "opacity-50 cursor-not-allowed"
              )}
            >
              <Timer className="w-6 h-6 text-blue-400 mx-auto mb-1" />
              <div className="text-sm text-white">+15s Time</div>
              <div className="text-xs text-gray-400">({powerUps.extraTime})</div>
            </GlassButton>
            
            <GlassButton
              onClick={() => usePowerUp('skipQuestion')}
              disabled={powerUps.skipQuestion <= 0}
              className={cn(
                "p-3 text-center",
                powerUps.skipQuestion > 0 ? "hover:bg-yellow-500/30" : "opacity-50 cursor-not-allowed"
              )}
            >
              <ArrowRight className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
              <div className="text-sm text-white">Skip Question</div>
              <div className="text-xs text-gray-400">({powerUps.skipQuestion})</div>
            </GlassButton>
            
            <GlassButton
              onClick={() => usePowerUp('extraLife')}
              disabled={powerUps.extraLife <= 0 || lives >= 5}
              className={cn(
                "p-3 text-center",
                powerUps.extraLife > 0 && lives < 5 ? "hover:bg-red-500/30" : "opacity-50 cursor-not-allowed"
              )}
            >
              <Heart className="w-6 h-6 text-red-400 mx-auto mb-1" />
              <div className="text-sm text-white">Extra Life</div>
              <div className="text-xs text-gray-400">({powerUps.extraLife})</div>
            </GlassButton>
          </div>
        </GlassPanel>
      </motion.div>
      
      {/* Current Question */}
      <motion.div
        key={currentLevel}
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
                difficulty === 'easy' ? "bg-green-500/20 text-green-400" :
                difficulty === 'medium' ? "bg-yellow-500/20 text-yellow-400" :
                "bg-red-500/20 text-red-400"
              )}>
                LEVEL {currentLevel} - {difficulty.toUpperCase()}
              </div>
              <div className="text-sm text-gray-400">
                +{getPointsForLevel(currentLevel, 5)} points
              </div>
            </div>
            
            {timeLeft <= 10 && (
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="flex items-center gap-2 px-3 py-1 bg-red-500/20 rounded-full"
              >
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span className="text-red-400 font-bold">HURRY!</span>
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
                      +{getPointsForLevel(currentLevel, (Date.now() - questionStartTime.current) / 1000)} points
                    </div>
                    <div className="text-sm text-gray-400">Advancing to Level {currentLevel + 1}</div>
                  </div>
                ) : (
                  <div className="text-red-400">
                    <div className="text-lg font-bold">Incorrect! 💔</div>
                    <div className="text-sm text-gray-400">
                      Correct answer: {currentQuestion.options[currentQuestion.correctAnswer]}
                    </div>
                    <div className="text-sm text-red-400">You lost a life!</div>
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
          Give Up
        </GlassButton>
      </motion.div>
    </div>
  );
}

export default SurvivalMode;