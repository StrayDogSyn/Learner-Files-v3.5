// Game Logic Engine - Core Quiz Mechanics and State Management

/**
 * Main game logic engine for Marvel Quiz
 * Handles game state, question flow, timing, and user interactions
 */
class GameLogic {
  constructor(marvelAPI, questionGenerator, scoreCalculator) {
    this.marvelAPI = marvelAPI;
    this.questionGenerator = questionGenerator;
    this.scoreCalculator = scoreCalculator;
    
    // Game state
    this.gameState = {
      isActive: false,
      isPaused: false,
      isCompleted: false,
      currentQuestionIndex: 0,
      questions: [],
      answers: [],
      score: 0,
      streak: 0,
      maxStreak: 0,
      startTime: null,
      endTime: null,
      difficulty: 'medium',
      totalQuestions: 10,
      timePerQuestion: 30,
      gameMode: 'classic'
    };
    
    // Timing
    this.questionTimer = null;
    this.questionStartTime = null;
    this.timeRemaining = 0;
    
    // Event callbacks
    this.callbacks = {
      onQuestionStart: null,
      onQuestionEnd: null,
      onAnswerSubmit: null,
      onGameStart: null,
      onGameEnd: null,
      onScoreUpdate: null,
      onTimeUpdate: null,
      onStreakUpdate: null
    };
    
    // Game modes configuration
    this.gameModes = {
      classic: {
        name: 'Classic Quiz',
        description: 'Standard Marvel quiz experience',
        timePerQuestion: 30,
        totalQuestions: 10,
        allowSkip: false,
        showHints: false
      },
      speed: {
        name: 'Speed Challenge',
        description: 'Fast-paced quiz with shorter time limits',
        timePerQuestion: 15,
        totalQuestions: 15,
        allowSkip: false,
        showHints: false
      },
      marathon: {
        name: 'Marathon Mode',
        description: 'Extended quiz with more questions',
        timePerQuestion: 25,
        totalQuestions: 25,
        allowSkip: true,
        showHints: true
      },
      survival: {
        name: 'Survival Mode',
        description: 'Keep going until you get one wrong',
        timePerQuestion: 20,
        totalQuestions: Infinity,
        allowSkip: false,
        showHints: false,
        endOnWrong: true
      }
    };
  }
  
  /**
   * Initialize a new game with specified configuration
   * @param {Object} config - Game configuration
   */
  async initializeGame(config = {}) {
    try {
      // Reset game state
      this.resetGameState();
      
      // Apply configuration
      this.gameState.difficulty = config.difficulty || 'medium';
      this.gameState.gameMode = config.gameMode || 'classic';
      this.gameState.totalQuestions = config.totalQuestions || this.gameModes[this.gameState.gameMode].totalQuestions;
      this.gameState.timePerQuestion = config.timePerQuestion || this.gameModes[this.gameState.gameMode].timePerQuestion;
      
      // Generate questions
      this.gameState.questions = await this.questionGenerator.generateQuestions({
        count: this.gameState.totalQuestions,
        difficulty: this.gameState.difficulty,
        gameMode: this.gameState.gameMode
      });
      
      if (this.gameState.questions.length === 0) {
        throw new Error('Failed to generate questions');
      }
      
      // Initialize answers array
      this.gameState.answers = new Array(this.gameState.questions.length).fill(null);
      
      console.log(`Game initialized: ${this.gameState.gameMode} mode, ${this.gameState.difficulty} difficulty, ${this.gameState.questions.length} questions`);
      
      return {
        success: true,
        questionsGenerated: this.gameState.questions.length,
        gameMode: this.gameState.gameMode,
        difficulty: this.gameState.difficulty
      };
      
    } catch (error) {
      console.error('Failed to initialize game:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Start the game
   */
  startGame() {
    if (this.gameState.questions.length === 0) {
      throw new Error('Game not initialized. Call initializeGame() first.');
    }
    
    this.gameState.isActive = true;
    this.gameState.startTime = Date.now();
    this.gameState.currentQuestionIndex = 0;
    
    // Trigger callback
    if (this.callbacks.onGameStart) {
      this.callbacks.onGameStart(this.getGameStatus());
    }
    
    // Start first question
    this.startQuestion();
    
    console.log('Game started');
  }
  
  /**
   * Start a new question
   */
  startQuestion() {
    if (!this.gameState.isActive || this.gameState.currentQuestionIndex >= this.gameState.questions.length) {
      return;
    }
    
    const currentQuestion = this.getCurrentQuestion();
    this.questionStartTime = Date.now();
    this.timeRemaining = this.gameState.timePerQuestion;
    
    // Start question timer
    this.startQuestionTimer();
    
    // Trigger callback
    if (this.callbacks.onQuestionStart) {
      this.callbacks.onQuestionStart({
        question: currentQuestion,
        questionIndex: this.gameState.currentQuestionIndex,
        totalQuestions: this.gameState.questions.length,
        timeLimit: this.gameState.timePerQuestion
      });
    }
    
    console.log(`Question ${this.gameState.currentQuestionIndex + 1} started`);
  }
  
  /**
   * Start the question timer
   */
  startQuestionTimer() {
    this.clearQuestionTimer();
    
    this.questionTimer = setInterval(() => {
      this.timeRemaining--;
      
      // Trigger time update callback
      if (this.callbacks.onTimeUpdate) {
        this.callbacks.onTimeUpdate({
          timeRemaining: this.timeRemaining,
          timeLimit: this.gameState.timePerQuestion,
          percentage: (this.timeRemaining / this.gameState.timePerQuestion) * 100
        });
      }
      
      // Check if time is up
      if (this.timeRemaining <= 0) {
        this.handleTimeUp();
      }
    }, 1000);
  }
  
  /**
   * Clear the question timer
   */
  clearQuestionTimer() {
    if (this.questionTimer) {
      clearInterval(this.questionTimer);
      this.questionTimer = null;
    }
  }
  
  /**
   * Handle time up for current question
   */
  handleTimeUp() {
    this.clearQuestionTimer();
    
    // Submit null answer (timeout)
    this.submitAnswer(null, true);
  }
  
  /**
   * Submit an answer for the current question
   * @param {string} answer - The submitted answer
   * @param {boolean} isTimeout - Whether this is a timeout submission
   */
  submitAnswer(answer, isTimeout = false) {
    if (!this.gameState.isActive || this.gameState.currentQuestionIndex >= this.gameState.questions.length) {
      return;
    }
    
    this.clearQuestionTimer();
    
    const currentQuestion = this.getCurrentQuestion();
    const timeUsed = this.gameState.timePerQuestion - this.timeRemaining;
    const isCorrect = !isTimeout && answer === currentQuestion.correctAnswer;
    
    // Update streak
    if (isCorrect) {
      this.gameState.streak++;
      this.gameState.maxStreak = Math.max(this.gameState.maxStreak, this.gameState.streak);
    } else {
      this.gameState.streak = 0;
    }
    
    // Calculate score for this question
    const questionScore = this.scoreCalculator.calculateQuestionScore({
      timeRemaining: this.timeRemaining,
      difficulty: this.gameState.difficulty,
      streak: this.gameState.streak,
      totalTime: timeUsed,
      questionTimeLimit: this.gameState.timePerQuestion,
      isCorrect: isCorrect
    });
    
    // Update total score
    this.gameState.score += questionScore.total;
    
    // Store answer data
    const answerData = {
      questionIndex: this.gameState.currentQuestionIndex,
      submittedAnswer: answer,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect: isCorrect,
      isTimeout: isTimeout,
      timeUsed: timeUsed,
      timeRemaining: this.timeRemaining,
      score: questionScore.total,
      scoreBreakdown: questionScore.breakdown,
      streak: this.gameState.streak,
      timestamp: Date.now()
    };
    
    this.gameState.answers[this.gameState.currentQuestionIndex] = answerData;
    
    // Trigger callbacks
    if (this.callbacks.onAnswerSubmit) {
      this.callbacks.onAnswerSubmit(answerData);
    }
    
    if (this.callbacks.onScoreUpdate) {
      this.callbacks.onScoreUpdate({
        score: this.gameState.score,
        questionScore: questionScore.total,
        breakdown: questionScore.breakdown
      });
    }
    
    if (this.callbacks.onStreakUpdate) {
      this.callbacks.onStreakUpdate({
        streak: this.gameState.streak,
        maxStreak: this.gameState.maxStreak,
        isCorrect: isCorrect
      });
    }
    
    // Trigger question end callback
    if (this.callbacks.onQuestionEnd) {
      this.callbacks.onQuestionEnd(answerData);
    }
    
    console.log(`Answer submitted: ${isCorrect ? 'Correct' : 'Wrong'} (${answer}), Score: +${questionScore.total}`);
    
    // Check for game end conditions
    if (this.shouldEndGame(isCorrect)) {
      this.endGame();
    } else {
      // Move to next question
      this.nextQuestion();
    }
  }
  
  /**
   * Check if the game should end
   * @param {boolean} lastAnswerCorrect - Whether the last answer was correct
   * @returns {boolean} Whether the game should end
   */
  shouldEndGame(lastAnswerCorrect) {
    // Check if all questions are answered
    if (this.gameState.currentQuestionIndex >= this.gameState.questions.length - 1) {
      return true;
    }
    
    // Check survival mode end condition
    if (this.gameState.gameMode === 'survival' && !lastAnswerCorrect) {
      return true;
    }
    
    return false;
  }
  
  /**
   * Move to the next question
   */
  nextQuestion() {
    this.gameState.currentQuestionIndex++;
    
    if (this.gameState.currentQuestionIndex < this.gameState.questions.length) {
      // Start next question after a brief delay
      setTimeout(() => {
        this.startQuestion();
      }, 1500); // 1.5 second delay to show results
    } else {
      this.endGame();
    }
  }
  
  /**
   * End the current game
   */
  endGame() {
    this.clearQuestionTimer();
    
    this.gameState.isActive = false;
    this.gameState.isCompleted = true;
    this.gameState.endTime = Date.now();
    
    // Calculate final score
    const gameData = this.getGameData();
    const finalScoreData = this.scoreCalculator.calculateFinalScore(gameData);
    const scoreSummary = this.scoreCalculator.generateScoreSummary(finalScoreData);
    
    // Save game to history
    this.saveGameToHistory(scoreSummary);
    
    // Trigger callback
    if (this.callbacks.onGameEnd) {
      this.callbacks.onGameEnd({
        gameData: gameData,
        finalScore: finalScoreData,
        summary: scoreSummary
      });
    }
    
    console.log('Game ended. Final score:', finalScoreData.finalScore);
    
    return scoreSummary;
  }
  
  /**
   * Pause the current game
   */
  pauseGame() {
    if (!this.gameState.isActive || this.gameState.isPaused) {
      return;
    }
    
    this.gameState.isPaused = true;
    this.clearQuestionTimer();
    
    console.log('Game paused');
  }
  
  /**
   * Resume the paused game
   */
  resumeGame() {
    if (!this.gameState.isActive || !this.gameState.isPaused) {
      return;
    }
    
    this.gameState.isPaused = false;
    this.startQuestionTimer();
    
    console.log('Game resumed');
  }
  
  /**
   * Skip the current question (if allowed)
   */
  skipQuestion() {
    const gameMode = this.gameModes[this.gameState.gameMode];
    
    if (!gameMode.allowSkip) {
      console.warn('Skipping not allowed in this game mode');
      return false;
    }
    
    this.submitAnswer(null, false);
    return true;
  }
  
  /**
   * Get the current question
   * @returns {Object} Current question object
   */
  getCurrentQuestion() {
    if (this.gameState.currentQuestionIndex >= this.gameState.questions.length) {
      return null;
    }
    
    return this.gameState.questions[this.gameState.currentQuestionIndex];
  }
  
  /**
   * Get current game status
   * @returns {Object} Game status object
   */
  getGameStatus() {
    return {
      isActive: this.gameState.isActive,
      isPaused: this.gameState.isPaused,
      isCompleted: this.gameState.isCompleted,
      currentQuestionIndex: this.gameState.currentQuestionIndex,
      totalQuestions: this.gameState.questions.length,
      score: this.gameState.score,
      streak: this.gameState.streak,
      maxStreak: this.gameState.maxStreak,
      timeRemaining: this.timeRemaining,
      difficulty: this.gameState.difficulty,
      gameMode: this.gameState.gameMode,
      progress: this.gameState.questions.length > 0 ? 
        (this.gameState.currentQuestionIndex / this.gameState.questions.length) * 100 : 0
    };
  }
  
  /**
   * Get complete game data
   * @returns {Object} Complete game data
   */
  getGameData() {
    const correctAnswers = this.gameState.answers.filter(a => a && a.isCorrect).length;
    const totalTime = this.gameState.answers.reduce((sum, a) => sum + (a ? a.timeUsed : 0), 0);
    
    return {
      questions: this.gameState.answers,
      totalQuestions: this.gameState.questions.length,
      correctAnswers: correctAnswers,
      totalTime: totalTime,
      difficulty: this.gameState.difficulty,
      perfectStreak: this.gameState.maxStreak,
      gameMode: this.gameState.gameMode,
      startTime: this.gameState.startTime,
      endTime: this.gameState.endTime,
      duration: this.gameState.endTime - this.gameState.startTime
    };
  }
  
  /**
   * Reset game state
   */
  resetGameState() {
    this.clearQuestionTimer();
    
    this.gameState = {
      isActive: false,
      isPaused: false,
      isCompleted: false,
      currentQuestionIndex: 0,
      questions: [],
      answers: [],
      score: 0,
      streak: 0,
      maxStreak: 0,
      startTime: null,
      endTime: null,
      difficulty: 'medium',
      totalQuestions: 10,
      timePerQuestion: 30,
      gameMode: 'classic'
    };
    
    this.timeRemaining = 0;
    this.questionStartTime = null;
  }
  
  /**
   * Save game to local storage history
   * @param {Object} scoreSummary - Score summary data
   */
  saveGameToHistory(scoreSummary) {
    try {
      const gameHistory = JSON.parse(localStorage.getItem('marvelQuiz_gameHistory') || '[]');
      
      const gameRecord = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        score: scoreSummary.score,
        rank: scoreSummary.rank,
        difficulty: this.gameState.difficulty,
        gameMode: this.gameState.gameMode,
        stats: scoreSummary.stats,
        achievements: scoreSummary.achievements,
        duration: this.gameState.endTime - this.gameState.startTime
      };
      
      gameHistory.unshift(gameRecord);
      
      // Keep only last 50 games
      if (gameHistory.length > 50) {
        gameHistory.splice(50);
      }
      
      localStorage.setItem('marvelQuiz_gameHistory', JSON.stringify(gameHistory));
      
      // Update high scores
      this.updateHighScores(gameRecord);
      
    } catch (error) {
      console.error('Failed to save game to history:', error);
    }
  }
  
  /**
   * Update high scores
   * @param {Object} gameRecord - Game record
   */
  updateHighScores(gameRecord) {
    try {
      const highScores = JSON.parse(localStorage.getItem('marvelQuiz_highScores') || '[]');
      
      highScores.push(gameRecord);
      
      // Sort by score (descending) and keep top 10
      highScores.sort((a, b) => b.score - a.score);
      highScores.splice(10);
      
      localStorage.setItem('marvelQuiz_highScores', JSON.stringify(highScores));
      
    } catch (error) {
      console.error('Failed to update high scores:', error);
    }
  }
  
  /**
   * Set event callback
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   */
  on(event, callback) {
    if (this.callbacks.hasOwnProperty(`on${event.charAt(0).toUpperCase() + event.slice(1)}`)) {
      this.callbacks[`on${event.charAt(0).toUpperCase() + event.slice(1)}`] = callback;
    }
  }
  
  /**
   * Get available game modes
   * @returns {Object} Game modes configuration
   */
  getGameModes() {
    return this.gameModes;
  }
  
  /**
   * Get game statistics
   * @returns {Object} Game statistics
   */
  getStatistics() {
    try {
      const gameHistory = JSON.parse(localStorage.getItem('marvelQuiz_gameHistory') || '[]');
      const highScores = JSON.parse(localStorage.getItem('marvelQuiz_highScores') || '[]');
      
      const totalGames = gameHistory.length;
      const totalScore = gameHistory.reduce((sum, game) => sum + game.score, 0);
      const averageScore = totalGames > 0 ? Math.round(totalScore / totalGames) : 0;
      const bestScore = highScores.length > 0 ? highScores[0].score : 0;
      const averageAccuracy = gameHistory.length > 0 ? 
        gameHistory.reduce((sum, game) => sum + game.stats.accuracy, 0) / gameHistory.length : 0;
      
      return {
        totalGames,
        averageScore,
        bestScore,
        averageAccuracy: Math.round(averageAccuracy * 100) / 100,
        highScores: highScores.slice(0, 5),
        recentGames: gameHistory.slice(0, 5)
      };
      
    } catch (error) {
      console.error('Failed to get statistics:', error);
      return {
        totalGames: 0,
        averageScore: 0,
        bestScore: 0,
        averageAccuracy: 0,
        highScores: [],
        recentGames: []
      };
    }
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GameLogic;
} else if (typeof window !== 'undefined') {
  window.GameLogic = GameLogic;
}