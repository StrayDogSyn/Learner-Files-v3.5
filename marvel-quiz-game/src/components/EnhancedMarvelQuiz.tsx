import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Pause, RotateCcw, Star, Clock, Trophy, Zap,
  Crown, Settings, User, Calendar, Target,
  Shield, Users, BookOpen, Award, TrendingUp
} from 'lucide-react';

// Import existing components
import SoundManager from './MarvelQuiz/SoundManager';
import AnimationSystem from './MarvelQuiz/AnimationSystem';

// Import new enhanced components
import { enhancedQuestions, getQuestionsByDifficulty } from '../data/enhancedQuestions';
import GameModeSelector from './GameModes/GameModeSelector';
import DailyChallengeSystem from './GameModes/DailyChallengeSystem';
import EnhancedVisualFeedback from './UI/EnhancedVisualFeedback';
import CharacterThemedBackground from './UI/CharacterThemedBackground';

import EnhancedLeaderboard from './Social/EnhancedLeaderboard';
import AchievementSharing, { AchievementSharingProps } from './Social/AchievementSharing';
import PlayerProfile from './Social/PlayerProfile';

// Import image enhancement components
import { useImagePreloader } from '../components/ImageOptimization';
import { CharacterImageGallery } from '../components/CharacterImageGallery';
import { EnhancedQuestionDisplay } from '../components/EnhancedQuestionDisplay';

// Import types from GameModeSelector to ensure compatibility
import { GameMode, GameModeConfig } from './GameModes/GameModeSelector';

const EnhancedMarvelQuiz: React.FC = () => {
  // Core game state
  const [gameState, setGameState] = useState<GameState>('menu');
  const [gameMode, setGameMode] = useState<GameMode>('classic');
  const [currentQuestion, setCurrentQuestion] = useState<EnhancedQuizQuestion | null>(null);
  const [questions, setQuestions] = useState<EnhancedQuizQuestion[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [streak, setStreak] = useState(0);
  const [lives, setLives] = useState(3); // For survival mode

  // Enhanced features state
  const [currentTheme, setCurrentTheme] = useState<string>('default');
  
  // UI state
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showDailyChallenge, setShowDailyChallenge] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<number | null>(null);

  // Game statistics
  const [gameStats, setGameStats] = useState<GameStats>({
    totalQuestions: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    totalScore: 0,
    averageResponseTime: 0,
    longestStreak: 0,
    categoriesPlayed: [],
    achievementsUnlocked: [],
    gamesPlayed: 0,
    totalPlayTime: 0
  });

  // Power-ups
  const [powerUps, setPowerUps] = useState<PowerUp[]>([
    { id: 'hint', name: 'Hint', description: 'Eliminate 2 wrong answers', cost: 100, available: true, cooldown: 0 },
    { id: 'time', name: 'Extra Time', description: 'Add 15 seconds', cost: 150, available: true, cooldown: 0 },
    { id: 'skip', name: 'Skip', description: 'Skip current question', cost: 200, available: true, cooldown: 0 }
  ]);

  // Achievements
  const [achievements, setAchievements] = useState<Achievement[]>([
    { id: 'first-correct', name: 'First Steps', description: 'Answer your first question correctly', icon: '🎯', unlocked: false },
    { id: 'streak-5', name: 'On Fire', description: 'Get 5 answers in a row', icon: '🔥', unlocked: false },
    { id: 'perfect-game', name: 'Perfectionist', description: 'Complete a game with 100% accuracy', icon: '💎', unlocked: false },
    { id: 'speed-demon', name: 'Speed Demon', description: 'Answer 10 questions in under 5 seconds each', icon: '⚡', unlocked: false },
    { id: 'marvel-expert', name: 'Marvel Expert', description: 'Score over 1000 points', icon: '🏆', unlocked: false }
  ]);

  // Sound and animation state
  const [soundConfig, setSoundConfig] = useState({
    enabled: true,
    volume: 0.7,
    effects: {
      correct: true,
      incorrect: true,
      achievement: true,
      powerup: true,
      background: true
    }
  });

  const [animationState, setAnimationState] = useState({
    type: 'idle' as 'idle' | 'correct' | 'incorrect' | 'powerup' | 'achievement' | 'correctAnswer' | 'incorrectAnswer' | 'achievementUnlocked',
    intensity: 1,
    duration: 1000
  });

  // Visual feedback state
  const [visualFeedback, setVisualFeedback] = useState({
    show: false,
    type: 'correct' as 'correct' | 'incorrect' | 'achievement' | 'powerup',
    message: '',
    position: { x: 0, y: 0 }
  });

  // Error and loading state
  const [uiState, setUiState] = useState({
    loading: false,
    error: '',
    initialized: false
  });

  // Image handling state
  const [showCharacterGallery, setShowCharacterGallery] = useState(false);
  const [selectedCharacterForGallery, setSelectedCharacterForGallery] = useState<string>('');
  
  // Image preloader hook
  const { preloadImages } = useImagePreloader([]);

  // Computed values
  const progress = useMemo(() => {
    if (questions.length === 0) return 0;
    return ((questionIndex + 1) / questions.length) * 100;
  }, [questionIndex, questions.length]);

  const accuracy = useMemo(() => {
    if (gameStats.totalQuestions === 0) return 0;
    return (gameStats.correctAnswers / gameStats.totalQuestions) * 100;
  }, [gameStats.correctAnswers, gameStats.totalQuestions]);

  // Update theme based on current question
  const updateTheme = useCallback((question: EnhancedQuizQuestion) => {
    if (!question) return;
    
    const questionText = question.question.toLowerCase();
    const correctAnswer = String(question.correctAnswer).toLowerCase();
    
    // Determine theme based on question content
    if (questionText.includes('spider') || correctAnswer.includes('spider')) {
      setCurrentTheme('spiderman');
    } else if (questionText.includes('iron') || correctAnswer.includes('iron')) {
      setCurrentTheme('ironman');
    } else if (questionText.includes('thor') || correctAnswer.includes('thor')) {
      setCurrentTheme('thor');
    } else if (questionText.includes('hulk') || correctAnswer.includes('hulk')) {
      setCurrentTheme('hulk');
    } else if (questionText.includes('captain') || correctAnswer.includes('captain')) {
      setCurrentTheme('captain');
    } else {
      setCurrentTheme('default');
    }
  }, []);

  // Initialize game
  const initializeGame = useCallback(async (mode: GameMode = 'classic', character?: string) => {
    setUiState(prev => ({ ...prev, loading: true, error: '' }));
    
    try {
      let selectedQuestions: EnhancedQuizQuestion[] = [];
      
      switch (mode) {
        case 'classic':
          selectedQuestions = enhancedQuestions.slice(0, 10);
          break;
        case 'survival':
          selectedQuestions = enhancedQuestions.slice(0, 50); // More questions for survival
          setLives(3);
          break;
        case 'timeAttack':
          selectedQuestions = getQuestionsByDifficulty('easy').slice(0, 20);
          setTimeLeft(15); // Shorter time for time attack
          break;
        case 'characterSpecific':
          if (character) {
            const characterId = parseInt(character);
            selectedQuestions = enhancedQuestions.filter(q => 
              q.characterId === characterId || 
              q.question.toLowerCase().includes(character.toLowerCase())
            ).slice(0, 15);
          }
          break;
        case 'dailyChallenge':
          // Daily challenge questions will be handled by DailyChallengeSystem
          selectedQuestions = enhancedQuestions.slice(0, 5);
          break;
        default:
          selectedQuestions = enhancedQuestions.slice(0, 10);
      }

      if (selectedQuestions.length === 0) {
        throw new Error('No questions available for this mode');
      }

      // Shuffle questions
      const shuffledQuestions = selectedQuestions.sort(() => Math.random() - 0.5);
      
      // Preload images for better performance
      const imageUrls = shuffledQuestions
        .map(q => q.imageUrl)
        .filter(Boolean) as string[];
      
      if (imageUrls.length > 0) {
        preloadImages(imageUrls);
      }
      
      setQuestions(shuffledQuestions);
      setCurrentQuestion(shuffledQuestions[0]);
      setQuestionIndex(0);
      setScore(0);
      setStreak(0);
      setSelectedAnswer('');
      setShowResult(false);
      setGameMode(mode);
      setGameState('playing');
      
      // Set theme based on first question
      updateTheme(shuffledQuestions[0]);
      
      // Reset power-ups
      setPowerUps(prev => prev.map(p => ({ ...p, available: true, cooldown: 0 })));
      
      setUiState(prev => ({ ...prev, loading: false, initialized: true }));
    } catch (error) {
      console.error('Failed to initialize game:', error);
      setUiState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Failed to start game' 
      }));
    }
  }, [updateTheme, preloadImages]);

  // Additional helper functions

  // End game function
  const endGame = useCallback(() => {
    setGameState('finished');
    
    // Update total time spent and games played
    setGameStats(prev => ({
      ...prev,
      gamesPlayed: prev.gamesPlayed + 1,
      totalPlayTime: prev.totalPlayTime + 300 // Approximate game time
    }));
  }, []);

  // Check achievements
  const checkAchievements = useCallback((currentStreak: number, currentScore: number) => {
    const newAchievements: Achievement[] = [];
    
    if (currentStreak >= 5 && !achievements.find(a => a.id === 'streak_5')) {
      newAchievements.push({
        id: 'streak_5',
        name: 'Hot Streak',
        description: 'Answer 5 questions correctly in a row',
        icon: '🔥',
        unlocked: true
      });
    }
    
    if (currentScore >= 1000 && !achievements.find(a => a.id === 'score_1000')) {
      newAchievements.push({
        id: 'score_1000',
        name: 'Marvel Expert',
        description: 'Score 1000 points in a single game',
        icon: '🏆',
        unlocked: true
      });
    }
    
    if (newAchievements.length > 0) {
      setAchievements(prev => [...prev, ...newAchievements]);
    }
  }, [achievements, setAchievements]);

  // Move to next question
  const nextQuestion = useCallback(() => {
    if (questionIndex + 1 >= questions.length) {
      endGame();
      return;
    }
    
    setQuestionIndex(prev => prev + 1);
    setCurrentQuestion(questions[questionIndex + 1]);
    setSelectedAnswer('');
    setShowResult(false);
    setTimeLeft(30);
  }, [questionIndex, questions, endGame]);

  // Activate power-up
  const activatePowerUp = useCallback((powerUpId: string) => {
    const powerUp = powerUps.find(p => p.id === powerUpId);
    if (!powerUp || !powerUp.available || score < powerUp.cost) return;
    
    setScore(prev => prev - powerUp.cost);
    
    switch (powerUpId) {
      case 'hint':
        // Remove 2 wrong answers
        break;
      case 'time':
        setTimeLeft(prev => prev + 15);
        break;
      case 'skip':
        nextQuestion();
        break;
    }
    
    setPowerUps(prev => prev.map(p => 
      p.id === powerUpId ? { ...p, available: false, cooldown: 3 } : p
    ));
  }, [powerUps, score, nextQuestion]);

  // Handle answer selection
  const handleAnswerSelect = useCallback((answer: string) => {
    if (showResult || !currentQuestion) return;
    
    setSelectedAnswer(answer);
    setShowResult(true);
    
    const isCorrect = answer === String(currentQuestion.correctAnswer);
    const responseTime = 30 - timeLeft;
    
    // Update statistics
    setGameStats(prev => ({
      ...prev,
      totalQuestions: prev.totalQuestions + 1,
      correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
      wrongAnswers: prev.wrongAnswers + (isCorrect ? 0 : 1),
      averageResponseTime: (prev.averageResponseTime * prev.totalQuestions + responseTime) / (prev.totalQuestions + 1)
    }));
    
    if (isCorrect) {
      // Calculate score with bonuses
      let basePoints = 100;
      let points = basePoints;
      if (timeLeft > 20) points += 50; // Time bonus
      if (streak >= 3) points += streak * 10; // Streak bonus
      if (currentQuestion.difficulty === 'hard') points += 50;
      if (currentQuestion.difficulty === 'expert') points += 100;
      
      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
      
      // Visual feedback
      setVisualFeedback({
        show: true,
        type: 'correct',
        message: `+${points} points!`,
        position: { x: window.innerWidth / 2, y: window.innerHeight / 2 }
      });
      
      // Animation
      setAnimationState({ type: 'correct', intensity: 1, duration: 1000 });
    } else {
      setStreak(0);
      
      // Handle survival mode
      if (gameMode === 'survival') {
        setLives(prev => {
          const newLives = prev - 1;
          if (newLives <= 0) {
            setTimeout(() => endGame(), 2000);
          }
          return newLives;
        });
      }
      
      // Visual feedback
      setVisualFeedback({
        show: true,
        type: 'incorrect',
        message: 'Incorrect!',
        position: { x: window.innerWidth / 2, y: window.innerHeight / 2 }
      });
      
      // Animation
      setAnimationState({ type: 'incorrect', intensity: 1, duration: 1000 });
    }
    
    // Check achievements
    const basePoints = currentQuestion?.difficulty === 'hard' ? 150 : currentQuestion?.difficulty === 'medium' ? 100 : 50;
    const pointsEarned = isCorrect ? basePoints : 0;

    checkAchievements(streak + (isCorrect ? 1 : 0), score + pointsEarned);
    
    // Auto-advance after delay
    setTimeout(() => {
      if (questionIndex < questions.length - 1) {
        nextQuestion();
      } else {
        endGame();
      }
    }, 2000);
  }, [showResult, currentQuestion, timeLeft, streak, questionIndex, questions.length, gameMode, score, checkAchievements, endGame, nextQuestion]);



  // Reset game
  const resetGame = useCallback(() => {
    setGameState('menu');
    setCurrentQuestion(null);
    setQuestions([]);
    setQuestionIndex(0);
    setSelectedAnswer('');
    setShowResult(false);
    setScore(0);
    setTimeLeft(30);
    setStreak(0);
    setLives(3);
    setCurrentTheme('default');
    
    // Reset UI state
    setShowLeaderboard(false);
    setShowProfile(false);
    setShowDailyChallenge(false);
    
    // Reset power-ups
    setPowerUps(prev => prev.map(p => ({ ...p, available: true, cooldown: 0 })));
  }, []);

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (gameState === 'playing' && !showResult && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !showResult) {
      // Time's up
      handleAnswerSelect(''); // Treat as wrong answer
    }
    
    return () => clearTimeout(timer);
  }, [gameState, showResult, timeLeft, handleAnswerSelect]);

  // Clear visual feedback after delay
  useEffect(() => {
    if (visualFeedback.show) {
      const timer = setTimeout(() => {
        setVisualFeedback(prev => ({ ...prev, show: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [visualFeedback.show]);

  // Render menu
  const renderMenu = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-8 flex items-center justify-center">
      <div className="max-w-4xl w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">
            Enhanced Marvel Quiz
          </h1>
          <p className="text-xl text-gray-300 mb-12">
            Test your knowledge of the Marvel Universe with enhanced features!
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          <div className="bg-black/30 rounded-xl p-6 backdrop-blur-sm">
            <BookOpen className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Enhanced Questions</h3>
            <p className="text-gray-400 text-sm">Character relationships, power matching, timeline questions, and more!</p>
          </div>
          
          <div className="bg-black/30 rounded-xl p-6 backdrop-blur-sm">
            <Target className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Adaptive Difficulty</h3>
            <p className="text-gray-400 text-sm">Dynamic difficulty that adapts to your performance</p>
          </div>
          
          <div className="bg-black/30 rounded-xl p-6 backdrop-blur-sm">
            <Users className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Multiple Game Modes</h3>
            <p className="text-gray-400 text-sm">Classic, Survival, Time Attack, Character-specific, and Daily Challenges</p>
          </div>
          
          <div className="bg-black/30 rounded-xl p-6 backdrop-blur-sm">
            <Shield className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Character Database</h3>
            <p className="text-gray-400 text-sm">Comprehensive character information with powers and relationships</p>
          </div>
          
          <div className="bg-black/30 rounded-xl p-6 backdrop-blur-sm">
            <Award className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Social Features</h3>
            <p className="text-gray-400 text-sm">Enhanced leaderboards, achievement sharing, and player profiles</p>
          </div>
          
          <div className="bg-black/30 rounded-xl p-6 backdrop-blur-sm">
            <TrendingUp className="w-12 h-12 text-orange-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Enhanced UI</h3>
            <p className="text-gray-400 text-sm">Character-themed backgrounds, improved animations, and visual feedback</p>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <button
            onClick={() => setGameState('mode-selection')}
            disabled={uiState.loading}
            className="bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700 disabled:opacity-50 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-3"
          >
            <Play className="w-6 h-6" />
            {uiState.loading ? 'Loading...' : 'Start Game'}
          </button>
          
          <button
            onClick={() => setShowProfile(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-3"
          >
            <User className="w-6 h-6" />
            Profile
          </button>
          
          <button
            onClick={() => setShowDailyChallenge(true)}
            className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-3"
          >
            <Calendar className="w-6 h-6" />
            Daily Challenge
          </button>
          
          <button
            onClick={() => setShowLeaderboard(true)}
            className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-3"
          >
            <Crown className="w-6 h-6" />
            Leaderboard
          </button>
        </motion.div>
        
        {uiState.error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 p-4 bg-red-900/30 border border-red-500 rounded-lg"
          >
            <p className="text-red-200">{uiState.error}</p>
            <p className="text-sm mt-2 text-red-300">Please try again later.</p>
          </motion.div>
        )}
      </div>
    </div>
  );

  // Render mode selection
  const renderModeSelection = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Select Game Mode</h1>
          <p className="text-xl text-gray-300">Choose your preferred way to play</p>
        </div>
        
        <GameModeSelector
          onModeSelect={(config: GameModeConfig) => {
            initializeGame(config.mode, config.characterId?.toString());
          }}
          characters={[]}
          unlockedModes={['classic', 'survival', 'timeAttack', 'characterSpecific', 'dailyChallenge']}
          dailyChallengeCompleted={false}
        />
      </div>
    </div>
  );

  // Render game
  const renderGame = () => {
    if (!currentQuestion) return null;
    
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Character-themed background */}
        <CharacterThemedBackground
          theme={currentTheme}
          intensity="medium"
          animated={true}
        >
          <div />  {/* Empty children */}
        </CharacterThemedBackground>
        
        {/* Enhanced visual feedback */}
        {visualFeedback.show && (
          <EnhancedVisualFeedback
            isCorrect={visualFeedback.type === 'correct'}
            points={score}
            streak={streak}
            bonusPoints={0}
            onAnimationComplete={() => setVisualFeedback(prev => ({ ...prev, show: false }))}
          />
        )}
        
        {/* Game content */}
        <div className="relative z-10 min-h-screen bg-black/20 text-white p-4">
          {/* Enhanced Header */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 shadow-lg mb-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setGameState('paused')}
                    className="p-4 bg-gradient-to-br from-blue-500/30 to-purple-500/30 backdrop-blur-sm rounded-xl border border-white/30 text-white hover:from-blue-500/40 hover:to-purple-500/40 transition-all duration-300 shadow-lg"
                    aria-label="Pause game"
                  >
                    <Pause className="w-6 h-6" />
                  </motion.button>
                  
                  <div className="text-white">
                    <div className="text-sm opacity-70 font-medium">Question Progress</div>
                    <div className="text-2xl font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                      {questionIndex + 1} of {questions.length}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-8">
                  {gameMode === 'survival' && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
                        <div className="text-red-400">❤️</div>
                      </div>
                      <div>
                        <div className="text-xs text-white/70 font-medium">Lives</div>
                        <div className="text-lg font-bold text-white">{lives}</div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                      <Star className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                      <div className="text-xs text-white/70 font-medium">Score</div>
                      <div className="text-lg font-bold text-white">{score.toLocaleString()}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                      <Clock className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-xs text-white/70 font-medium">Time</div>
                      <div className={`text-lg font-bold ${timeLeft <= 5 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
                        {timeLeft}s
                      </div>
                    </div>
                  </div>
                  
                  {streak > 0 && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
                        <div className="text-orange-400">🔥</div>
                      </div>
                      <div>
                        <div className="text-xs text-white/70 font-medium">Streak</div>
                        <div className="text-lg font-bold text-orange-400">{streak}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Enhanced progress bar */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-4 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/80 text-sm font-medium">Quiz Progress</span>
                <span className="text-white font-bold">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 rounded-full shadow-lg"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>
          
          {/* Enhanced Question Display */}
          <div className="max-w-4xl mx-auto">
            <EnhancedQuestionDisplay
              question={currentQuestion}
              selectedAnswer={selectedAnswer}
              showResult={showResult}
              timeLeft={timeLeft}
              questionIndex={questionIndex}
              totalQuestions={questions.length}
              onAnswerSelect={handleAnswerSelect}
              onImageGallery={(characterId: string) => {
                setSelectedCharacterForGallery(characterId);
                setShowCharacterGallery(true);
              }}
              streak={streak}
              score={score}
            />
            
            {/* Enhanced Power-ups */}
            <div className="max-w-4xl mx-auto mb-8">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 shadow-lg">
                <h3 className="text-white font-bold text-lg mb-4 text-center">Power-Ups</h3>
                <div className="flex justify-center gap-6">
                  {powerUps.map((powerUp) => (
                    <button
                      key={powerUp.id}
                      onClick={() => console.log('Power-up clicked:', powerUp.id)}
                      disabled={score < powerUp.cost || !powerUp.available || showResult}
                      className="bg-purple-700/80 hover:bg-purple-600/80 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 backdrop-blur-sm"
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
          </div>
        </div>
      </div>
    );
  };

  // Render results
  const renderResults = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white p-8 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-2">Quiz Complete!</h1>
          <p className="text-xl text-gray-300">Here's how you performed</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-black/30 rounded-xl p-8 backdrop-blur-sm mb-8"
        >
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
              <div className="text-3xl font-bold text-blue-400">{gameStats.correctAnswers}</div>
              <div className="text-gray-400">Correct Answers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">{streak}</div>
              <div className="text-gray-400">Best Streak</div>
            </div>
          </div>
          
          {/* Achievement sharing */}
          <AchievementSharing
            achievement={achievements[0] || { id: 'test', name: 'Test', description: 'Test achievement', icon: '🏆', unlocked: false }}
            playerName="Player"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex justify-center gap-4"
        >
          <button
            onClick={resetGame}
            className="bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700 px-8 py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Play Again
          </button>
          
          <button
            onClick={() => setGameState('mode-selection')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
          >
            <Settings className="w-5 h-5" />
            Change Mode
          </button>
        </motion.div>
      </div>
    </div>
  );

  // Main render
  return (
    <div className={`enhanced-marvel-quiz theme-${currentTheme}`}>
      {/* Background animations */}
      <AnimationSystem 
        animationState={{
          type: animationState.type,
          duration: animationState.duration,
          particles: [],
          floatingTexts: [],
          screenShake: false
        }} 
      />

      {/* Sound manager */}
      <SoundManager 
        soundConfig={{
          enabled: soundConfig.enabled,
          masterVolume: soundConfig.volume || 0.7,
          musicVolume: soundConfig.volume || 0.7,
          effectsVolume: soundConfig.volume || 0.7,
          musicEnabled: soundConfig.effects.background
        }}
        onConfigChange={(config) => setSoundConfig({
          enabled: config.enabled,
          volume: config.masterVolume,
          effects: {
            correct: true,
            incorrect: true,
            achievement: true,
            powerup: true,
            background: true
          }
        })}
      />
      
      {/* Main content */}
      <AnimatePresence mode="wait">
        {gameState === 'menu' && (
          <motion.div
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {renderMenu()}
          </motion.div>
        )}
        
        {gameState === 'mode-selection' && (
          <motion.div
            key="mode-selection"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
          >
            {renderModeSelection()}
          </motion.div>
        )}
        
        {(gameState === 'playing' || gameState === 'paused') && (
          <motion.div
            key="game"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
          >
            {renderGame()}
          </motion.div>
        )}
        
        {gameState === 'finished' && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
          >
            {renderResults()}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Modal overlays */}
      <AnimatePresence>
        {showProfile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowProfile(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-4xl w-full max-h-[90vh] overflow-auto"
            >
              <PlayerProfile
                playerName="You"
                playerStats={gameStats}
                achievements={achievements.map(a => ({
                  ...a,
                  rarity: 'common' as const,
                  points: 100,
                  category: 'general',
                  requirements: {},
                  unlockedAt: a.unlocked ? new Date().toISOString() : undefined
                }))}
                gameHistory={[]}
                onClose={() => setShowProfile(false)}
              />
            </motion.div>
          </motion.div>
        )}
        
        {showLeaderboard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowLeaderboard(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-4xl w-full max-h-[90vh] overflow-auto"
            >
              <EnhancedLeaderboard
                currentPlayer={{
                  id: 'current-player',
                  playerName: 'You',
                  score: gameStats.totalScore,
                  accuracy: accuracy,
                  gamesPlayed: gameStats.gamesPlayed,
                  averageTime: gameStats.averageResponseTime || 0,
                  rank: 1,
                  achievements: gameStats.achievementsUnlocked.length,
                  lastPlayed: new Date().toISOString(),
                  longestStreak: gameStats.longestStreak,
                  questionsAnswered: gameStats.totalQuestions,
                  timestamp: new Date().toISOString(),
                  difficulty: 'medium',
                  gameMode: 'classic'
                }}
                entries={[]}
              />
            </motion.div>
          </motion.div>
        )}
        
        {showDailyChallenge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDailyChallenge(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-2xl w-full"
            >
              <DailyChallengeSystem
                onStartChallenge={() => {
                  setShowDailyChallenge(false);
                  initializeGame('dailyChallenge');
                }}
                questions={[]}
                progress={0}
              />
            </motion.div>
          </motion.div>
        )}
        
        {showCharacterGallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowCharacterGallery(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-6xl w-full max-h-[90vh] overflow-auto"
            >
              <CharacterImageGallery
                characterId={selectedCharacterForGallery}
                characterName="Unknown Character"
                onClose={() => setShowCharacterGallery(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedMarvelQuiz;