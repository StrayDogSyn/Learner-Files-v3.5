import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Star, Zap, Volume2, BarChart3, Target, Award, TrendingUp, Trophy, Crown, Play, Pause, RotateCcw } from 'lucide-react';
import { 
  QuizQuestion, 
  GameStats, 
  QuizConfig, 
  DifficultyLevel, 
  QuizCategory,
  PowerUp,
  Achievement,
  GameSession,
  SoundConfig
} from '../types/marvel';
import { marvelApi } from '../services/marvelApi';
import QuestionGenerator from './MarvelQuiz/QuestionGenerator';
import { GameStats as GameStatsComponent } from './MarvelQuiz/GameStats';
import { PowerUpSystem } from './MarvelQuiz/PowerUpSystem';
import SoundManager, { audioManager } from './MarvelQuiz/SoundManager';
import AnimationSystem, { animationUtils } from './MarvelQuiz/AnimationSystem';
import AchievementSystem from './MarvelQuiz/AchievementSystem';
import Leaderboard from './MarvelQuiz/Leaderboard';
import './MarvelQuiz.css';

interface MarvelQuizProps {
  onGameComplete?: (session: GameSession) => void;
  initialConfig?: Partial<QuizConfig>;
  className?: string;
}

const defaultConfig: QuizConfig = {
  totalQuestions: 10,
  timePerQuestion: 30,
  difficulty: 'medium',
  categories: ['heroes', 'villains', 'teams'],
  enablePowerUps: true,
  enableSound: true,
  enableAnimations: true
};

const difficultySettings = {
  easy: { timeBonus: 1.2, pointsMultiplier: 1.0, questionComplexity: 0.3 },
  medium: { timeBonus: 1.0, pointsMultiplier: 1.5, questionComplexity: 0.6 },
  hard: { timeBonus: 0.8, pointsMultiplier: 2.0, questionComplexity: 0.8 },
  expert: { timeBonus: 0.6, pointsMultiplier: 3.0, questionComplexity: 1.0 }
};

const MarvelQuiz: React.FC<MarvelQuizProps> = ({
  onGameComplete,
  initialConfig = {},
  className = ''
}) => {
  // Merge config with defaults
  const config = useMemo(() => ({ ...defaultConfig, ...initialConfig }), [initialConfig]);
  const { difficulty } = config;
  
  // Core game state
  const [gameState, setGameState] = useState<'menu' | 'loading' | 'playing' | 'paused' | 'finished'>('menu');
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(config.timePerQuestion);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  
  // Game data
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [characters, setCharacters] = useState<any[]>([]);
  const [gameSession, setGameSession] = useState<GameSession | null>(null);
  
  // UI state
  const [uiState, setUIState] = useState({
    isLoading: false,
    error: null,
    showHint: false,
    showPowerUps: false,
    animationState: 'idle'
  });
  
  const [showStats, setShowStats] = useState(false);
  const [showPowerUps, setShowPowerUps] = useState(false);
  const [showSound, setShowSound] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  
  // Performance metrics
  const [metrics, setMetrics] = useState({
    averageResponseTime: 0,
    totalResponseTime: 0,
    questionsAnswered: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    hintsUsed: 0,
    powerUpsUsed: 0,
    gameStartTime: 0,
    gameEndTime: 0
  });
  
  // Power-ups
  const [powerUps, setPowerUps] = useState<PowerUp[]>([
    { id: 'hint', name: '50/50', description: 'Remove two wrong answers', cost: 150, available: true },
    { id: 'time', name: 'Extra Time', description: 'Add 10 seconds', cost: 100, available: true },
    { id: 'skip', name: 'Skip Question', description: 'Skip current question', cost: 200, available: true }
  ]);
  
  // Achievements
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  
  // Sound configuration
  const [soundConfig, setSoundConfig] = useState<SoundConfig>({
    masterVolume: 0.7,
    musicVolume: 0.5,
    effectsVolume: 0.8,
    muted: false
  });
  
  // Sound and animation handlers
  const playSound = useCallback((soundType: string, volume?: number) => {
    if (!soundConfig.muted) {
      audioManager.playSound(soundType, volume || soundConfig.effectsVolume);
    }
  }, [soundConfig]);
  
  const showFloatingText = useCallback((text: string, x: number, y: number, color: string = '#ffffff') => {
    animationUtils.showFloatingText(text, x, y, color);
  }, []);
  
  const triggerParticles = useCallback((type: string, x: number, y: number, count: number = 20) => {
    animationUtils.triggerParticles(type, x, y, count);
  }, []);
  
  const triggerScreenShake = useCallback((intensity: number = 1) => {
    animationUtils.triggerScreenShake(intensity);
  }, []);
  
  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (gameState === 'playing' && timeLeft > 0 && !showResult) {
      timer = setTimeout(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => clearTimeout(timer);
  }, [gameState, timeLeft, showResult]);
  
  // Initialize game session
  const initializeGame = useCallback(async () => {
    setUIState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Test API connection
      const isConnected = await marvelApi.testConnection();
      
      if (!isConnected && import.meta.env.VITE_MOCK_API !== 'true') {
        throw new Error('Unable to connect to Marvel API. Please check your API keys.');
      }
      
      // Fetch random characters for questions
      const fetchedCharacters = await marvelApi.getRandomCharacters(20);
      
      if (fetchedCharacters.length < 10) {
        throw new Error('Insufficient character data. Please try again.');
      }
      
      setCharacters(fetchedCharacters);
      
      // Generate questions
      const questionGenerator = new QuestionGenerator(marvelApi);
      const generatedQuestions = await questionGenerator.generateQuestions(config.totalQuestions, {
        difficulty: config.difficulty,
        categories: config.categories
      });
      setQuestions(generatedQuestions);
      
      // Initialize game session
      const session: GameSession = {
        id: `session_${Date.now()}`,
        startTime: Date.now(),
        endTime: 0,
        score: 0,
        questionsAnswered: 0,
        correctAnswers: 0,
        difficulty,
        powerUpsUsed: [],
        achievements: [],
        timeSpent: 0
      };
      
      setGameSession(session);
      setMetrics(prev => ({ ...prev, gameStartTime: Date.now() }));
      
      // Start first question
      setCurrentQuestion(generatedQuestions[0]);
      setQuestionIndex(0);
      setGameState('playing');
      setTimeLeft(config.timePerQuestion);
      
    } catch (error) {
      console.error('Failed to initialize game:', error);
      setUIState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to start game'
      }));
    } finally {
      setUIState(prev => ({ ...prev, isLoading: false }));
    }
  }, [difficulty]);
  

  
  // Handle answer selection
  const handleAnswerSelect = useCallback((answer: string) => {
    if (showResult || !currentQuestion) return;
    
    setSelectedAnswer(answer);
    const correct = answer === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);
    
    // Play sound effects
    playSound(correct ? 'correct' : 'incorrect');
    
    // Trigger particles and animations
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    if (correct) {
      triggerParticles('success', centerX, centerY, 30);
      showFloatingText(`+${currentQuestion.points || 100}`, centerX, centerY - 50, '#10b981');
    } else {
      triggerParticles('error', centerX, centerY, 15);
      showFloatingText('Wrong!', centerX, centerY - 50, '#ef4444');
      triggerScreenShake(0.5);
    }
    
    // Update metrics
    const responseTime = config.timePerQuestion - timeLeft;
    setMetrics(prev => ({
      ...prev,
      totalResponseTime: prev.totalResponseTime + responseTime,
      questionsAnswered: prev.questionsAnswered + 1,
      correctAnswers: correct ? prev.correctAnswers + 1 : prev.correctAnswers,
      incorrectAnswers: correct ? prev.incorrectAnswers : prev.incorrectAnswers + 1,
      averageResponseTime: (prev.totalResponseTime + responseTime) / (prev.questionsAnswered + 1)
    }));
    
    // Update score and streak
    if (correct) {
      const basePoints = currentQuestion.points || 100;
      const timeBonus = Math.floor((timeLeft / config.timePerQuestion) * 50);
      const streakBonus = streak >= 3 ? 50 : 0;
      const totalPoints = basePoints + timeBonus + streakBonus;
      
      setScore(prev => prev + totalPoints);
      setStreak(prev => prev + 1);
      
      // Show streak effects
      if (streak + 1 >= 3) {
        triggerScreenShake(0.3);
        showFloatingText(`${streak + 1}x Streak!`, centerX, centerY - 100, '#f59e0b');
      }
      
      // Check for achievements
      checkAchievements(streak + 1, score + totalPoints);
    } else {
      setStreak(0);
    }
    
    // Auto-advance after 2 seconds
    setTimeout(() => {
      nextQuestion();
    }, 2000);
  }, [currentQuestion, showResult, timeLeft, streak, score, playSound, triggerParticles, showFloatingText, triggerScreenShake]);
  
  // Handle time up
  const handleTimeUp = useCallback(() => {
    if (showResult) return;
    
    setIsCorrect(false);
    setShowResult(true);
    setStreak(0);
    
    setMetrics(prev => ({
      ...prev,
      questionsAnswered: prev.questionsAnswered + 1,
      incorrectAnswers: prev.incorrectAnswers + 1
    }));
    
    setTimeout(() => {
      nextQuestion();
    }, 2000);
  }, [showResult]);
  
  // Move to next question
  const nextQuestion = useCallback(() => {
    if (questionIndex + 1 >= questions.length) {
      endGame();
      return;
    }
    
    setQuestionIndex(prev => prev + 1);
    setCurrentQuestion(questions[questionIndex + 1]);
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(null);
    setTimeLeft(config.timePerQuestion);
  }, [questionIndex, questions]);
  
  // End game
  const endGame = useCallback(() => {
    setGameState('finished');
    setMetrics(prev => ({ ...prev, gameEndTime: Date.now() }));
    
    if (gameSession) {
      const finalSession: GameSession = {
        ...gameSession,
        endTime: Date.now(),
        score,
        questionsAnswered: metrics.questionsAnswered,
        correctAnswers: metrics.correctAnswers,
        timeSpent: Date.now() - gameSession.startTime,
        achievements
      };
      
      setGameSession(finalSession);
      
      const finalStats: GameStats = {
        score,
        questionsAnswered: metrics.questionsAnswered,
        correctAnswers: metrics.correctAnswers,
        incorrectAnswers: metrics.incorrectAnswers,
        accuracy: metrics.questionsAnswered > 0 ? (metrics.correctAnswers / metrics.questionsAnswered) * 100 : 0,
        averageResponseTime: metrics.averageResponseTime,
        streak: streak,
        powerUpsUsed: metrics.powerUpsUsed,
        hintsUsed: metrics.hintsUsed,
        timeSpent: Date.now() - metrics.gameStartTime,
        difficulty,
        achievements
      };
      
      onGameComplete?.(finalStats);
    }
  }, [gameSession, score, metrics, streak, achievements, difficulty, onGameComplete]);
  
  // Handle achievement unlocked
  const handleAchievementUnlocked = useCallback((achievement: Achievement) => {
    setAchievements(prev => [...prev, achievement]);
    
    // Show achievement notification
    animationUtils.showFloatingText(`Achievement: ${achievement.name}`, 'achievement');
    audioManager.playSound('achievement');
    
    // Trigger celebration animation
    animationUtils.triggerParticles('achievement');
  }, []);
  
  // Check for achievements
  const checkAchievements = useCallback((currentStreak: number, currentScore: number) => {
    const newAchievements: Achievement[] = [];
    
    if (currentStreak >= 5 && !achievements.find(a => a.id === 'streak_5')) {
      newAchievements.push({
        id: 'streak_5',
        name: 'Hot Streak',
        description: 'Answer 5 questions correctly in a row',
        icon: '🔥',
        rarity: 'common',
        unlockedAt: Date.now(),
        points: 100
      });
    }
    
    // Add more achievement checks here...
    
    // Trigger effects for new achievements
    if (newAchievements.length > 0) {
      playSound('achievement');
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      newAchievements.forEach((achievement, index) => {
        setTimeout(() => {
          triggerParticles('achievement', centerX, centerY - (index * 50), 40);
          triggerScreenShake(0.8);
          
          const rarityColors = {
            common: '#10b981',
            rare: '#3b82f6',
            epic: '#8b5cf6',
            legendary: '#f59e0b'
          };
          
          showFloatingText(
            `🏆 ${achievement.name}!`,
            centerX,
            centerY - 150 - (index * 50),
            rarityColors[achievement.rarity] || '#ffffff'
          );
        }, index * 500);
      });
      
      setAchievements(prev => [...prev, ...newAchievements]);
    }
    
    if (currentScore >= 1000 && !achievements.find(a => a.id === 'score_1000')) {
      newAchievements.push({
        id: 'score_1000',
        name: 'Marvel Expert',
        description: 'Score 1000 points in a single game',
        icon: '🏆',
        rarity: 'rare',
        unlockedAt: Date.now(),
        points: 200
      });
    }
    
    if (newAchievements.length > 0) {
      setAchievements(prev => [...prev, ...newAchievements]);
    }
  }, [achievements]);
  
  // Use power-up
  const usePowerUp = useCallback((powerUpId: string) => {
    if (score < (powerUps.find(p => p.id === powerUpId)?.cost || 0)) return;
    
    const powerUp = powerUps.find(p => p.id === powerUpId);
    if (!powerUp || !powerUp.available) return;
    
    // Play power-up sound and trigger effects
    playSound('powerup');
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    triggerParticles('powerup', centerX, centerY, 25);
    showFloatingText('Power-Up Activated!', centerX, centerY - 100, '#8b5cf6');
    
    setScore(prev => prev - powerUp.cost);
    setMetrics(prev => ({ ...prev, powerUpsUsed: prev.powerUpsUsed + 1 }));
    
    switch (powerUpId) {
      case 'hint':
        // Remove two wrong answers
        if (currentQuestion && currentQuestion.options.length === 4) {
          const wrongAnswers = currentQuestion.options.filter(opt => opt !== currentQuestion.correctAnswer);
          const toRemove = wrongAnswers.slice(0, 2);
          const newOptions = currentQuestion.options.filter(opt => !toRemove.includes(opt));
          setCurrentQuestion(prev => prev ? { ...prev, options: newOptions } : null);
          showFloatingText('50/50 Used!', centerX, centerY - 50, '#3b82f6');
        }
        break;
        
      case 'time':
        setTimeLeft(prev => prev + 10);
        showFloatingText('+10 Seconds!', centerX, centerY - 50, '#10b981');
        break;
        
      case 'skip':
        showFloatingText('Question Skipped!', centerX, centerY - 50, '#f59e0b');
        setTimeout(() => nextQuestion(), 1000);
        break;
    }
  }, [score, powerUps, currentQuestion, nextQuestion, playSound, triggerParticles, showFloatingText]);
  
  // Reset game
  const resetGame = useCallback(() => {
    setGameState('menu');
    setCurrentQuestion(null);
    setQuestionIndex(0);
    setScore(0);
    setStreak(0);
    setTimeLeft(config.timePerQuestion);
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(null);
    setQuestions([]);
    setCharacters([]);
    setGameSession(null);
    setAchievements([]);
    setMetrics({
      averageResponseTime: 0,
      totalResponseTime: 0,
      questionsAnswered: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
      hintsUsed: 0,
      powerUpsUsed: 0,
      gameStartTime: 0,
      gameEndTime: 0
    });
    setPowerUps([
      { id: 'hint', name: '50/50', description: 'Remove two wrong answers', cost: 150, available: true },
      { id: 'time', name: 'Extra Time', description: 'Add 10 seconds', cost: 100, available: true },
      { id: 'skip', name: 'Skip Question', description: 'Skip current question', cost: 200, available: true }
    ]);
  }, []);
  
  // Computed values
  const progress = useMemo(() => {
    return questions.length > 0 ? ((questionIndex + 1) / questions.length) * 100 : 0;
  }, [questionIndex, questions.length]);
  
  const accuracy = useMemo(() => {
    return metrics.questionsAnswered > 0 ? (metrics.correctAnswers / metrics.questionsAnswered) * 100 : 0;
  }, [metrics.correctAnswers, metrics.questionsAnswered]);
  
  // Render methods
  const renderMenu = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-900 via-blue-900 to-purple-900 text-white p-8">
      <div className="text-center mb-12">
        <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-red-400 to-blue-400 bg-clip-text text-transparent">
          Marvel Universe Quiz
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Test your knowledge of the Marvel Universe!
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-black/30 rounded-lg p-6 backdrop-blur-sm">
            <Target className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <h3 className="font-semibold mb-2">{config.totalQuestions} Questions</h3>
            <p className="text-sm text-gray-400">Challenge yourself with diverse Marvel trivia</p>
          </div>
          <div className="bg-black/30 rounded-lg p-6 backdrop-blur-sm">
            <Clock className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <h3 className="font-semibold mb-2">Timed Challenge</h3>
            <p className="text-sm text-gray-400">{config.timePerQuestion} seconds per question</p>
          </div>
          <div className="bg-black/30 rounded-lg p-6 backdrop-blur-sm">
            <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <h3 className="font-semibold mb-2">Power-ups</h3>
            <p className="text-sm text-gray-400">Use hints and bonuses strategically</p>
          </div>
        </div>
      </div>
      
      <button
        onClick={initializeGame}
        disabled={uiState.isLoading}
        className="bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed px-12 py-4 rounded-lg font-bold text-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3"
      >
        {uiState.isLoading ? (
          <>
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            Loading Marvel Data...
          </>
        ) : (
          <>
            <Play className="w-6 h-6" />
            Start Quiz
          </>
        )}
      </button>
      
      {uiState.error && (
        <div className="mt-6 p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
          <p className="font-semibold">Error:</p>
          <p>{uiState.error}</p>
          <p className="text-sm mt-2">Please try again later.</p>
        </div>
      )}
    </div>
  );
  
  const renderGame = () => {
    if (!currentQuestion) return null;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-4">
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setGameState('paused')}
                className="bg-gray-700 hover:bg-gray-600 p-2 rounded-lg transition-colors"
              >
                <Pause className="w-5 h-5" />
              </button>
              <div className="text-lg font-semibold">
                Question {questionIndex + 1} of {questions.length}
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="font-bold">{score.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-red-400" />
                <span className={`font-bold ${timeLeft <= 5 ? 'text-red-400 animate-pulse' : ''}`}>
                  {timeLeft}s
                </span>
              </div>
              {streak > 0 && (
                <div className="flex items-center gap-2">
                  <div className="text-orange-400">🔥</div>
                  <span className="font-bold text-orange-400">{streak}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-700 rounded-full h-2 mb-6">
            <div 
              className="bg-gradient-to-r from-red-500 to-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        
        {/* Question */}
        <div className="max-w-4xl mx-auto">
          {/* Control buttons */}
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={() => setShowStats(!showStats)}
              className="p-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              title="Game Stats"
            >
              <BarChart3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowPowerUps(!showPowerUps)}
              className="p-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
              title="Power-ups"
            >
              <Zap className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowSound(!showSound)}
              className="p-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
              title="Sound Settings"
            >
              <Volume2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowAchievements(!showAchievements)}
              className="p-3 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors"
              title="Achievements"
            >
              <Trophy className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowLeaderboard(!showLeaderboard)}
              className="p-3 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
              title="Leaderboard"
            >
              <Crown className="w-5 h-5" />
            </button>
          </div>
          
          <div className="bg-black/30 rounded-xl p-8 backdrop-blur-sm mb-8">
            <h2 className="text-2xl font-bold mb-6 text-center">{currentQuestion.question}</h2>
            
            {currentQuestion.imageUrl && (
              <div className="flex justify-center mb-8">
                <img
                  src={currentQuestion.imageUrl}
                  alt="Marvel Character"
                  className="max-w-sm max-h-80 object-cover rounded-lg shadow-2xl"
                  onError={(e) => {
                    e.currentTarget.src = 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Marvel%20superhero%20silhouette%20placeholder&image_size=square';
                  }}
                />
              </div>
            )}
            
            {/* Answer options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuestion.options.map((option, index) => {
                let buttonClass = "p-4 rounded-lg border-2 transition-all duration-300 text-left font-semibold ";
                
                if (showResult) {
                  if (option === currentQuestion.correctAnswer) {
                    buttonClass += "bg-green-600 border-green-400 text-white";
                  } else if (option === selectedAnswer && option !== currentQuestion.correctAnswer) {
                    buttonClass += "bg-red-600 border-red-400 text-white";
                  } else {
                    buttonClass += "bg-gray-700 border-gray-600 text-gray-300";
                  }
                } else {
                  if (selectedAnswer === option) {
                    buttonClass += "bg-blue-600 border-blue-400 text-white";
                  } else {
                    buttonClass += "bg-gray-800 border-gray-600 text-white hover:bg-gray-700 hover:border-gray-500 cursor-pointer";
                  }
                }
                
                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={showResult}
                    className={buttonClass}
                  >
                    <span className="text-blue-400 font-bold mr-3">{String.fromCharCode(65 + index)}.</span>
                    {option}
                  </button>
                );
              })}
            </div>
            
            {/* Result explanation */}
            {showResult && currentQuestion.explanation && (
              <div className="mt-6 p-4 bg-blue-900/30 border border-blue-500 rounded-lg">
                <p className="text-blue-200">
                  <strong>Explanation:</strong> {currentQuestion.explanation}
                </p>
              </div>
            )}
          </div>
          
          {/* Sound Manager */}
          {showSound && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mb-6"
            >
              <SoundManager />
            </motion.div>
          )}

          {/* Achievement System */}
          {showAchievements && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mb-6"
            >
              <AchievementSystem
                gameStats={metrics}
                onAchievementUnlocked={handleAchievementUnlocked}
              />
            </motion.div>
          )}

          {/* Leaderboard */}
          {showLeaderboard && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mb-6"
            >
              <Leaderboard currentStats={metrics} />
            </motion.div>
          )}
          
          {/* Power-ups */}
          <div className="flex justify-center gap-4">
            {powerUps.map((powerUp) => (
              <button
                key={powerUp.id}
                onClick={() => usePowerUp(powerUp.id)}
                disabled={score < powerUp.cost || !powerUp.available || showResult}
                className="bg-purple-700 hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                title={`${powerUp.description} (${powerUp.cost} points)`}
              >
                <Zap className="w-4 h-4" />
                {powerUp.name}
                <span className="text-xs">({powerUp.cost})</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  const renderResults = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white p-8 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-2">Quiz Complete!</h1>
          <p className="text-xl text-gray-300">Here's how you performed</p>
        </div>
        
        <div className="bg-black/30 rounded-xl p-8 backdrop-blur-sm mb-8">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">{score.toLocaleString()}</div>
              <div className="text-gray-400">Final Score</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">{accuracy.toFixed(1)}%</div>
              <div className="text-gray-400">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">{metrics.correctAnswers}</div>
              <div className="text-gray-400">Correct Answers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">{(metrics.averageResponseTime || 0).toFixed(1)}s</div>
              <div className="text-gray-400">Avg Response Time</div>
            </div>
          </div>
          
          {achievements.length > 0 && (
            <div className="border-t border-gray-700 pt-6">
              <h3 className="text-lg font-semibold mb-4 text-center">Achievements Unlocked</h3>
              <div className="flex flex-wrap justify-center gap-4">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="bg-yellow-900/30 border border-yellow-500 rounded-lg p-3 text-center">
                    <div className="text-2xl mb-1">{achievement.icon}</div>
                    <div className="font-semibold text-sm">{achievement.name}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-center gap-4">
          <button
            onClick={resetGame}
            className="bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700 px-8 py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
  
  // Main render
  return (
    <AnimationSystem>
      <div className="marvel-quiz">
        <SoundManager 
          config={soundConfig}
          onConfigChange={setSoundConfig}
        />
        {gameState === 'menu' && renderMenu()}
        {gameState === 'playing' && renderGame()}
        {gameState === 'paused' && renderGame()}
        {gameState === 'finished' && renderResults()}
      </div>
    </AnimationSystem>
  );
};

export default MarvelQuiz;