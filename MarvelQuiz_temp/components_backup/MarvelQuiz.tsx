import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  QuizQuestion, 
  GameStats, 
  QuizConfig, 
  DifficultyLevel, 
  QuizCategory,
  PowerUp,
  Achievement,
  GameSession
} from '../../types/marvel';
import { marvelApi } from '../../services/marvelApi';
import { QuestionGenerator } from './QuestionGenerator';
import { GameStatsDisplay } from './GameStatsDisplay';
import { PowerUpPanel } from './PowerUpPanel';
import { AchievementNotification } from './AchievementNotification';
import { LeaderboardModal } from './LeaderboardModal';
import SoundManager, { audioManager } from './SoundManager';
import AnimationSystem, { animationUtils } from './AnimationSystem';
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

export const MarvelQuiz: React.FC<MarvelQuizProps> = ({
  onGameComplete,
  initialConfig = {},
  className = ''
}) => {
  // Game state
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'paused' | 'completed' | 'loading'>('menu');
  const [config, setConfig] = useState<QuizConfig>({ ...defaultConfig, ...initialConfig });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(config.timePerQuestion);
  const [gameSession, setGameSession] = useState<GameSession | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Game statistics
  const [stats, setStats] = useState<GameStats>({
    questionsAnswered: 0,
    correctAnswers: 0,
    accuracy: 0,
    averageResponseTime: 0,
    powerUpsUsed: 0,
    highestStreak: 0,
    currentStreak: 0,
    totalTimeSpent: 0,
    difficulty: config.difficulty,
    rank: 'Rookie',
    characterMatch: 'Spider-Man',
    score: 0,
    bonusPoints: 0
  });

  // Power-ups and achievements
  const [availablePowerUps, setAvailablePowerUps] = useState<PowerUp[]>([]);
  const [unlockedAchievements, setUnlockedAchievements] = useState<Achievement[]>([]);
  const [recentAchievement, setRecentAchievement] = useState<Achievement | null>(null);

  // UI state
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  // Memoized values
  const currentQuestion = useMemo(() => questions[currentQuestionIndex], [questions, currentQuestionIndex]);
  const progress = useMemo(() => (currentQuestionIndex / config.totalQuestions) * 100, [currentQuestionIndex, config.totalQuestions]);
  const difficultyMultiplier = useMemo(() => difficultySettings[config.difficulty], [config.difficulty]);

  // Question generator instance
  const questionGenerator = useMemo(() => new QuestionGenerator(marvelApi), []);

  // Sound configuration
  const [soundConfig, setSoundConfig] = useState<SoundConfig>({
    masterVolume: 0.7,
    musicVolume: 0.5,
    effectsVolume: 0.8,
    muted: false
  });



  // Sound effect handlers
  const playSound = useCallback((soundId: string) => {
    if (!soundConfig.muted) {
      audioManager.playSound(soundId);
    }
  }, [soundConfig.muted]);

  // Animation handlers
  const showFloatingText = useCallback((text: string, options?: any) => {
    animationUtils.showFloatingText(text, undefined, undefined, options);
  }, []);

  const triggerParticles = useCallback((type: 'success' | 'error' | 'powerup' | 'achievement') => {
    animationUtils.triggerParticles(type);
  }, []);

  const triggerScreenShake = useCallback((intensity?: number, duration?: number) => {
    animationUtils.triggerScreenShake(intensity, duration);
  }, []);

  // Initialize game
  const initializeGame = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Test API connection
      const isConnected = await marvelApi.testConnection();
      if (!isConnected) {
        throw new Error('Unable to connect to Marvel API. Please check your internet connection.');
      }

      // Generate questions
      const generatedQuestions = await questionGenerator.generateQuestions(config);
      if (generatedQuestions.length === 0) {
        throw new Error('Failed to generate quiz questions. Please try again.');
      }

      setQuestions(generatedQuestions);
      setCurrentQuestionIndex(0);
      setTimeRemaining(config.timePerQuestion);
      setSelectedAnswer(null);
      
      // Initialize game session
      const session: GameSession = {
        id: `session_${Date.now()}`,
        playerName: 'Player', // TODO: Get from user input
        startTime: new Date(),
        questions: generatedQuestions,
        answers: [],
        stats: { ...stats, difficulty: config.difficulty },
        powerUpsUsed: [],
        achievements: []
      };
      
      setGameSession(session);
      setGameState('playing');
      soundManager.playSound('background');
      
    } catch (error) {
      console.error('Failed to initialize game:', error);
      setError(error instanceof Error ? error.message : 'Failed to initialize game');
    } finally {
      setIsLoading(false);
    }
  }, [config, questionGenerator, soundManager, stats]);

  // Timer effect
  useEffect(() => {
    if (gameState !== 'playing' || !currentQuestion) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        
        // Play tick sound in last 5 seconds
        if (prev <= 5) {
          soundManager.playSound('tick');
        }
        
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, currentQuestion, soundManager]);

  // Handle answer selection
  const handleAnswerSelect = useCallback((answer: string) => {
    if (selectedAnswer || gameState !== 'playing') return;
    
    setSelectedAnswer(answer);
    const responseTime = config.timePerQuestion - timeRemaining;
    const isCorrect = answer === currentQuestion.correctAnswer;
    
    // Calculate points
    let points = 0;
    if (isCorrect) {
      const basePoints = currentQuestion.points;
      const timeBonus = Math.max(0, (timeRemaining / config.timePerQuestion) * basePoints * 0.5);
      const difficultyBonus = basePoints * (difficultyMultiplier.pointsMultiplier - 1);
      points = Math.round(basePoints + timeBonus + difficultyBonus);
      
      playSound('correct');
      triggerParticles('success');
      showFloatingText(`+${points} points!`, undefined, undefined, {
        color: '#10B981',
        size: 28,
        duration: 1500
      });
      
      // Extra effects for streaks
      if (stats.currentStreak >= 4) {
        triggerScreenShake(5, 300);
        showFloatingText(`${stats.currentStreak + 1}x STREAK!`, undefined, undefined, {
          color: '#F59E0B',
          size: 32,
          duration: 2000
        });
      }
      
      setStats(prev => ({
        ...prev,
        correctAnswers: prev.correctAnswers + 1,
        currentStreak: prev.currentStreak + 1,
        highestStreak: Math.max(prev.highestStreak, prev.currentStreak + 1),
        score: prev.score + points
      }));
    } else {
      playSound('incorrect');
      triggerParticles('error');
      triggerScreenShake(8, 400);
      showFloatingText('Wrong!', undefined, undefined, {
        color: '#EF4444',
        size: 24,
        duration: 1200
      });
      
      setStats(prev => ({
        ...prev,
        currentStreak: 0
      }));
    }
    
    // Update game session
    if (gameSession) {
      const updatedSession = {
        ...gameSession,
        answers: [
          ...gameSession.answers,
          {
            questionId: currentQuestion.id,
            selectedAnswer: answer,
            isCorrect,
            responseTime,
            pointsEarned: points
          }
        ]
      };
      setGameSession(updatedSession);
    }
    
    // Update stats
    setStats(prev => {
      const newStats = {
        ...prev,
        questionsAnswered: prev.questionsAnswered + 1,
        totalTimeSpent: prev.totalTimeSpent + responseTime,
        averageResponseTime: (prev.averageResponseTime * prev.questionsAnswered + responseTime) / (prev.questionsAnswered + 1),
        accuracy: ((prev.correctAnswers + (isCorrect ? 1 : 0)) / (prev.questionsAnswered + 1)) * 100
      };
      
      // Check for achievements
      checkAchievements(newStats);
      
      return newStats;
    });
    
    // Move to next question after delay
    setTimeout(() => {
      if (currentQuestionIndex < config.totalQuestions - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setTimeRemaining(config.timePerQuestion);
        setAnimationKey(prev => prev + 1);
      } else {
        completeGame();
      }
    }, 2000);
  }, [selectedAnswer, gameState, timeRemaining, currentQuestion, config, gameSession, difficultyMultiplier, playSound, triggerParticles, showFloatingText, triggerScreenShake, stats.currentStreak, currentQuestionIndex]);

  // Handle time up
  const handleTimeUp = useCallback(() => {
    if (selectedAnswer) return;
    
    handleAnswerSelect(''); // Empty string represents no answer
  }, [selectedAnswer, handleAnswerSelect]);

  // Complete game
  const completeGame = useCallback(() => {
    if (!gameSession) return;
    
    const finalSession = {
      ...gameSession,
      endTime: new Date(),
      stats
    };
    
    setGameSession(finalSession);
    setGameState('completed');
    setShowResults(true);
    soundManager.stopSound('background');
    
    // Calculate final rank and character match
    const finalStats = calculateFinalStats(stats);
    setStats(finalStats);
    
    onGameComplete?.(finalSession);
  }, [gameSession, stats, soundManager, onGameComplete]);

  // Calculate final stats
  const calculateFinalStats = useCallback((currentStats: GameStats): GameStats => {
    const { accuracy, score, currentStreak } = currentStats;
    
    // Determine rank based on performance
    let rank = 'Rookie';
    if (score >= 1000 && accuracy >= 90) rank = 'Legendary Hero';
    else if (score >= 800 && accuracy >= 80) rank = 'Super Hero';
    else if (score >= 600 && accuracy >= 70) rank = 'Hero';
    else if (score >= 400 && accuracy >= 60) rank = 'Sidekick';
    else if (score >= 200 && accuracy >= 50) rank = 'Trainee';
    
    // Determine character match based on play style
    let characterMatch = 'Spider-Man';
    if (accuracy >= 95) characterMatch = 'Professor X';
    else if (currentStreak >= 8) characterMatch = 'Captain America';
    else if (score >= 1200) characterMatch = 'Iron Man';
    else if (accuracy >= 85 && currentStreak >= 5) characterMatch = 'Doctor Strange';
    else if (currentStats.powerUpsUsed >= 3) characterMatch = 'Deadpool';
    
    return {
      ...currentStats,
      rank,
      characterMatch
    };
  }, []);

  // Check for achievements
  const checkAchievements = useCallback((currentStats: GameStats) => {
    // Define achievements (this would typically come from a configuration file)
    const achievements: Achievement[] = [
      {
        id: 'first_correct',
        name: 'First Blood',
        description: 'Answer your first question correctly',
        icon: '🎯',
        condition: (stats) => stats.correctAnswers >= 1,
        rarity: 'common',
        points: 50
      },
      {
        id: 'perfect_streak',
        name: 'Unstoppable',
        description: 'Get 5 questions correct in a row',
        icon: '🔥',
        condition: (stats) => stats.currentStreak >= 5,
        rarity: 'rare',
        points: 200
      },
      {
        id: 'speed_demon',
        name: 'Speed Demon',
        description: 'Average response time under 10 seconds',
        icon: '⚡',
        condition: (stats) => stats.averageResponseTime < 10 && stats.questionsAnswered >= 5,
        rarity: 'epic',
        points: 300
      },
      {
        id: 'perfectionist',
        name: 'Perfectionist',
        description: 'Achieve 100% accuracy',
        icon: '💎',
        condition: (stats) => stats.accuracy === 100 && stats.questionsAnswered >= 10,
        rarity: 'legendary',
        points: 500
      }
    ];
    
    achievements.forEach(achievement => {
      if (achievement.condition(currentStats) && !unlockedAchievements.find(a => a.id === achievement.id)) {
        const unlockedAchievement = { ...achievement, unlockedAt: new Date() };
        setUnlockedAchievements(prev => [...prev, unlockedAchievement]);
        setRecentAchievement(unlockedAchievement);
        
        // Play achievement sound and effects
        playSound('achievement');
        triggerParticles('achievement');
        triggerScreenShake(3, 200);
        showFloatingText(`🏆 ${achievement.name}!`, undefined, undefined, {
          color: achievement.rarity === 'legendary' ? '#F59E0B' : 
                 achievement.rarity === 'epic' ? '#8B5CF6' :
                 achievement.rarity === 'rare' ? '#3B82F6' : '#10B981',
          size: 26,
          duration: 3000
        });
        
        // Add bonus points
        setStats(prev => ({
          ...prev,
          bonusPoints: prev.bonusPoints + achievement.points,
          score: prev.score + achievement.points
        }));
      }
    });
  }, [unlockedAchievements, playSound, triggerParticles, triggerScreenShake, showFloatingText]);

  // Power-up handlers
  const usePowerUp = useCallback((powerUp: PowerUp) => {
    if (!config.enablePowerUps || gameState !== 'playing') return;
    
    // Play power-up sound and effects
    playSound('powerup');
    triggerParticles('powerup');
    showFloatingText(`${powerUp.name} Activated!`, undefined, undefined, {
      color: '#8B5CF6',
      size: 24,
      duration: 2000
    });
    
    switch (powerUp.effect) {
      case 'skip':
        showFloatingText('Question Skipped!', undefined, undefined, {
          color: '#8B5CF6',
          size: 20,
          duration: 1000
        });
        handleAnswerSelect(currentQuestion.correctAnswer);
        break;
      case 'hint':
        // Show hint (implementation depends on UI)
        showFloatingText('Hint Revealed!', undefined, undefined, {
          color: '#10B981',
          size: 18,
          duration: 1500
        });
        break;
      case 'time':
        setTimeRemaining(prev => Math.min(prev + 15, config.timePerQuestion));
        showFloatingText('+15 seconds!', undefined, undefined, {
          color: '#3B82F6',
          size: 20,
          duration: 1500
        });
        break;
      case 'fifty-fifty':
        // Remove two incorrect options (implementation depends on UI)
        showFloatingText('2 wrong answers removed!', undefined, undefined, {
          color: '#10B981',
          size: 18,
          duration: 1500
        });
        break;
    }
    
    setStats(prev => ({ ...prev, powerUpsUsed: prev.powerUpsUsed + 1 }));
  }, [config.enablePowerUps, gameState, currentQuestion, handleAnswerSelect, config.timePerQuestion, playSound, triggerParticles, showFloatingText]);

  // Render methods
  const renderMenu = () => (
    <motion.div 
      className="marvel-quiz-menu"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
    >
      <div className="menu-header">
        <h1 className="menu-title">
          <span className="marvel-text">MARVEL</span>
          <span className="quiz-text">QUIZ</span>
        </h1>
        <p className="menu-subtitle">Test your knowledge of the Marvel Universe</p>
      </div>
      
      <div className="menu-options">
        <div className="difficulty-selector">
          <h3>Choose Difficulty</h3>
          <div className="difficulty-buttons">
            {(['easy', 'medium', 'hard', 'expert'] as DifficultyLevel[]).map(level => (
              <button
                key={level}
                className={`difficulty-btn ${config.difficulty === level ? 'active' : ''}`}
                onClick={() => setConfig(prev => ({ ...prev, difficulty: level }))}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        <div className="category-selector">
          <h3>Categories</h3>
          <div className="category-grid">
            {(['heroes', 'villains', 'teams', 'cosmic', 'street', 'mutants'] as QuizCategory[]).map(category => (
              <label key={category} className="category-checkbox">
                <input
                  type="checkbox"
                  checked={config.categories.includes(category)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setConfig(prev => ({ ...prev, categories: [...prev.categories, category] }));
                    } else {
                      setConfig(prev => ({ ...prev, categories: prev.categories.filter(c => c !== category) }));
                    }
                  }}
                />
                <span>{category.charAt(0).toUpperCase() + category.slice(1)}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div className="game-settings">
          <label className="setting-item">
            <span>Questions: {config.totalQuestions}</span>
            <input
              type="range"
              min="5"
              max="20"
              value={config.totalQuestions}
              onChange={(e) => setConfig(prev => ({ ...prev, totalQuestions: parseInt(e.target.value) }))}
            />
          </label>
          
          <label className="setting-item">
            <span>Time per question: {config.timePerQuestion}s</span>
            <input
              type="range"
              min="15"
              max="60"
              value={config.timePerQuestion}
              onChange={(e) => setConfig(prev => ({ ...prev, timePerQuestion: parseInt(e.target.value) }))}
            />
          </label>
          
          <label className="setting-checkbox">
            <input
              type="checkbox"
              checked={config.enablePowerUps}
              onChange={(e) => setConfig(prev => ({ ...prev, enablePowerUps: e.target.checked }))}
            />
            <span>Enable Power-ups</span>
          </label>
          
          <label className="setting-checkbox">
            <input
              type="checkbox"
              checked={config.enableSound}
              onChange={(e) => setConfig(prev => ({ ...prev, enableSound: e.target.checked }))}
            />
            <span>Enable Sound</span>
          </label>
        </div>
      </div>
      
      <div className="menu-actions">
        <button 
          className="start-game-btn"
          onClick={initializeGame}
          disabled={isLoading || config.categories.length === 0}
        >
          {isLoading ? 'Loading...' : 'Start Quiz'}
        </button>
        
        <button 
          className="leaderboard-btn"
          onClick={() => setShowLeaderboard(true)}
        >
          Leaderboard
        </button>
      </div>
      
      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}
    </motion.div>
  );

  const renderGame = () => (
    <motion.div 
      className="marvel-quiz-game"
      key={animationKey}
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
    >
      <div className="game-header">
        <div className="progress-section">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="progress-text">
            {currentQuestionIndex + 1} / {config.totalQuestions}
          </span>
        </div>
        
        <div className="timer-section">
          <div className={`timer ${timeRemaining <= 5 ? 'warning' : ''}`}>
            <span className="timer-text">{timeRemaining}s</span>
            <div 
              className="timer-ring"
              style={{
                strokeDashoffset: `${283 - (283 * timeRemaining) / config.timePerQuestion}`
              }}
            />
          </div>
        </div>
        
        <GameStatsDisplay stats={stats} />
      </div>
      
      {currentQuestion && (
        <div className="question-section">
          <div className="question-header">
            <span className="question-category">{currentQuestion.category}</span>
            <span className="question-difficulty">{currentQuestion.difficulty}</span>
            <span className="question-points">{currentQuestion.points} pts</span>
          </div>
          
          <h2 className="question-text">{currentQuestion.question}</h2>
          
          {currentQuestion.imageUrl && (
            <div className="question-image">
              <img src={currentQuestion.imageUrl} alt="Question visual" />
            </div>
          )}
          
          <div className="options-grid">
            {currentQuestion.options.map((option, index) => {
              let optionClass = 'option-btn';
              
              if (selectedAnswer) {
                if (option === currentQuestion.correctAnswer) {
                  optionClass += ' correct';
                } else if (option === selectedAnswer && option !== currentQuestion.correctAnswer) {
                  optionClass += ' incorrect';
                } else {
                  optionClass += ' disabled';
                }
              }
              
              return (
                <motion.button
                  key={index}
                  className={optionClass}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={!!selectedAnswer}
                  whileHover={{ scale: selectedAnswer ? 1 : 1.02 }}
                  whileTap={{ scale: selectedAnswer ? 1 : 0.98 }}
                >
                  <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                  <span className="option-text">{option}</span>
                </motion.button>
              );
            })}
          </div>
          
          {selectedAnswer && (
            <motion.div 
              className="explanation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p>{currentQuestion.explanation}</p>
            </motion.div>
          )}
        </div>
      )}
      
      {config.enablePowerUps && (
        <PowerUpPanel 
          powerUps={availablePowerUps}
          onUsePowerUp={usePowerUp}
          disabled={!!selectedAnswer}
        />
      )}
    </motion.div>
  );

  const renderResults = () => (
    <motion.div 
      className="marvel-quiz-results"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <div className="results-header">
        <h1>Quiz Complete!</h1>
        <div className="final-score">
          <span className="score-value">{stats.score}</span>
          <span className="score-label">Final Score</span>
        </div>
      </div>
      
      <div className="results-content">
        <div className="character-match">
          <h3>Your Marvel Character Match</h3>
          <div className="character-card">
            <div className="character-name">{stats.characterMatch}</div>
            <div className="character-rank">{stats.rank}</div>
          </div>
        </div>
        
        <div className="detailed-stats">
          <div className="stat-item">
            <span className="stat-label">Accuracy</span>
            <span className="stat-value">{stats.accuracy.toFixed(1)}%</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Correct Answers</span>
            <span className="stat-value">{stats.correctAnswers}/{stats.questionsAnswered}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Best Streak</span>
            <span className="stat-value">{stats.highestStreak}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Avg Response Time</span>
            <span className="stat-value">{stats.averageResponseTime.toFixed(1)}s</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Bonus Points</span>
            <span className="stat-value">{stats.bonusPoints}</span>
          </div>
        </div>
        
        {unlockedAchievements.length > 0 && (
          <div className="achievements-section">
            <h3>Achievements Unlocked</h3>
            <div className="achievements-grid">
              {unlockedAchievements.map(achievement => (
                <div key={achievement.id} className={`achievement-card ${achievement.rarity}`}>
                  <span className="achievement-icon">{achievement.icon}</span>
                  <span className="achievement-name">{achievement.name}</span>
                  <span className="achievement-points">+{achievement.points}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="results-actions">
        <button 
          className="play-again-btn"
          onClick={() => {
            setGameState('menu');
            setShowResults(false);
            setCurrentQuestionIndex(0);
            setQuestions([]);
            setSelectedAnswer(null);
            setStats({
              questionsAnswered: 0,
              correctAnswers: 0,
              accuracy: 0,
              averageResponseTime: 0,
              powerUpsUsed: 0,
              highestStreak: 0,
              currentStreak: 0,
              totalTimeSpent: 0,
              difficulty: config.difficulty,
              rank: 'Rookie',
              characterMatch: 'Spider-Man',
              score: 0,
              bonusPoints: 0
            });
            setUnlockedAchievements([]);
          }}
        >
          Play Again
        </button>
        
        <button 
          className="leaderboard-btn"
          onClick={() => setShowLeaderboard(true)}
        >
          View Leaderboard
        </button>
      </div>
    </motion.div>
  );

  return (
    <AnimationSystem className={`marvel-quiz-container ${className}`}>
      <div className="marvel-quiz-header">
        {/* Sound Manager */}
        <div className="sound-controls">
          <SoundManager
            config={soundConfig}
            onConfigChange={setSoundConfig}
          />
        </div>
      </div>
      
      <AnimatePresence mode="wait">
        {gameState === 'menu' && renderMenu()}
        {gameState === 'playing' && renderGame()}
        {gameState === 'completed' && showResults && renderResults()}
      </AnimatePresence>
      
      {/* Modals and overlays */}
      <AnimatePresence>
        {recentAchievement && (
          <AchievementNotification 
            achievement={recentAchievement}
            onClose={() => setRecentAchievement(null)}
          />
        )}
        
        {showLeaderboard && (
          <LeaderboardModal 
            onClose={() => setShowLeaderboard(false)}
            currentSession={gameSession}
          />
        )}
      </AnimatePresence>
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner">
            <div className="spinner-ring"></div>
            <p>Loading Marvel data...</p>
          </div>
        </div>
      )}
    </AnimationSystem>
  );
};

export default MarvelQuiz;