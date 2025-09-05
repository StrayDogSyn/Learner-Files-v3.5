// Score Calculator - Advanced Scoring System

/**
 * Advanced scoring system for Marvel Quiz
 * Implements time bonuses, difficulty multipliers, streak bonuses, and speed bonuses
 */
class ScoreCalculator {
  constructor() {
    this.difficultyMultipliers = {
      easy: 1,
      medium: 1.5,
      hard: 2
    };
    
    this.basePoints = 100;
    this.maxTimeBonus = 50;
    this.streakBonusThreshold = 3;
    this.streakBonusPoints = 25;
    this.speedBonusThresholds = {
      fast: { time: 10, bonus: 25 },
      medium: { time: 20, bonus: 15 }
    };
  }

  /**
   * Calculate score for a single question
   * @param {Object} params - Scoring parameters
   * @param {number} params.timeRemaining - Time remaining when answered (seconds)
   * @param {string} params.difficulty - Question difficulty (easy/medium/hard)
   * @param {number} params.streak - Current correct answer streak
   * @param {number} params.totalTime - Total time taken to answer (seconds)
   * @param {number} params.questionTimeLimit - Time limit for the question (seconds)
   * @param {boolean} params.isCorrect - Whether the answer was correct
   * @returns {Object} Score breakdown
   */
  calculateQuestionScore({
    timeRemaining = 0,
    difficulty = 'easy',
    streak = 0,
    totalTime = 30,
    questionTimeLimit = 30,
    isCorrect = false
  }) {
    if (!isCorrect) {
      return {
        total: 0,
        breakdown: {
          base: 0,
          timeBonus: 0,
          difficultyBonus: 0,
          streakBonus: 0,
          speedBonus: 0
        }
      };
    }

    // Base points
    const baseScore = this.basePoints;

    // Time bonus (based on remaining time)
    const timeBonus = Math.floor((timeRemaining / questionTimeLimit) * this.maxTimeBonus);

    // Difficulty multiplier
    const difficultyMultiplier = this.difficultyMultipliers[difficulty] || 1;
    const difficultyBonus = Math.floor(baseScore * (difficultyMultiplier - 1));

    // Streak bonus
    const streakBonus = streak >= this.streakBonusThreshold 
      ? Math.floor(streak / this.streakBonusThreshold) * this.streakBonusPoints 
      : 0;

    // Speed bonus
    let speedBonus = 0;
    if (totalTime <= this.speedBonusThresholds.fast.time) {
      speedBonus = this.speedBonusThresholds.fast.bonus;
    } else if (totalTime <= this.speedBonusThresholds.medium.time) {
      speedBonus = this.speedBonusThresholds.medium.bonus;
    }

    // Calculate total
    const subtotal = baseScore + timeBonus + difficultyBonus + streakBonus + speedBonus;
    const total = Math.floor(subtotal);

    return {
      total,
      breakdown: {
        base: baseScore,
        timeBonus,
        difficultyBonus,
        streakBonus,
        speedBonus,
        multiplier: difficultyMultiplier
      }
    };
  }

  /**
   * Calculate final game score with performance bonuses
   * @param {Object} gameData - Game session data
   * @returns {Object} Final score with detailed breakdown
   */
  calculateFinalScore(gameData) {
    const {
      questions = [],
      totalQuestions = 0,
      correctAnswers = 0,
      totalTime = 0,
      difficulty = 'easy',
      perfectStreak = 0
    } = gameData;

    let totalScore = 0;
    let totalTimeBonus = 0;
    let totalStreakBonus = 0;
    let totalSpeedBonus = 0;
    let totalDifficultyBonus = 0;

    // Calculate score for each question
    questions.forEach(question => {
      const questionScore = this.calculateQuestionScore(question);
      totalScore += questionScore.total;
      totalTimeBonus += questionScore.breakdown.timeBonus;
      totalStreakBonus += questionScore.breakdown.streakBonus;
      totalSpeedBonus += questionScore.breakdown.speedBonus;
      totalDifficultyBonus += questionScore.breakdown.difficultyBonus;
    });

    // Performance bonuses
    const accuracyPercentage = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
    const averageTime = totalQuestions > 0 ? totalTime / totalQuestions : 0;

    // Perfect game bonus
    const perfectGameBonus = accuracyPercentage === 100 ? 500 : 0;

    // Speed completion bonus
    const speedCompletionBonus = averageTime < 15 ? 200 : averageTime < 25 ? 100 : 0;

    // Accuracy bonus
    let accuracyBonus = 0;
    if (accuracyPercentage >= 90) accuracyBonus = 300;
    else if (accuracyPercentage >= 80) accuracyBonus = 200;
    else if (accuracyPercentage >= 70) accuracyBonus = 100;

    // Long streak bonus
    const longStreakBonus = perfectStreak >= 10 ? 400 : perfectStreak >= 5 ? 200 : 0;

    const performanceBonuses = perfectGameBonus + speedCompletionBonus + accuracyBonus + longStreakBonus;
    const finalScore = totalScore + performanceBonuses;

    return {
      finalScore,
      breakdown: {
        baseScore: correctAnswers * this.basePoints,
        timeBonus: totalTimeBonus,
        difficultyBonus: totalDifficultyBonus,
        streakBonus: totalStreakBonus,
        speedBonus: totalSpeedBonus,
        performanceBonuses: {
          perfectGame: perfectGameBonus,
          speedCompletion: speedCompletionBonus,
          accuracy: accuracyBonus,
          longStreak: longStreakBonus,
          total: performanceBonuses
        }
      },
      stats: {
        accuracy: Math.round(accuracyPercentage * 100) / 100,
        averageTime: Math.round(averageTime * 100) / 100,
        perfectStreak,
        difficulty
      }
    };
  }

  /**
   * Get score rank based on final score
   * @param {number} score - Final score
   * @returns {Object} Rank information
   */
  getScoreRank(score) {
    const ranks = [
      { name: 'Cosmic Entity', min: 5000, color: '#FFD700', icon: '🌟' },
      { name: 'Superhero', min: 4000, color: '#FF6B6B', icon: '🦸' },
      { name: 'Enhanced Human', min: 3000, color: '#4ECDC4', icon: '💪' },
      { name: 'Skilled Fighter', min: 2000, color: '#45B7D1', icon: '⚔️' },
      { name: 'Trainee', min: 1000, color: '#96CEB4', icon: '🎯' },
      { name: 'Civilian', min: 0, color: '#FFEAA7', icon: '👤' }
    ];

    const rank = ranks.find(r => score >= r.min) || ranks[ranks.length - 1];
    return {
      ...rank,
      score,
      progress: this.calculateRankProgress(score, ranks)
    };
  }

  /**
   * Calculate progress to next rank
   * @param {number} score - Current score
   * @param {Array} ranks - Rank definitions
   * @returns {Object} Progress information
   */
  calculateRankProgress(score, ranks) {
    const currentRankIndex = ranks.findIndex(r => score >= r.min);
    const nextRankIndex = currentRankIndex - 1;

    if (nextRankIndex < 0) {
      return { percentage: 100, pointsToNext: 0, nextRank: null };
    }

    const currentRank = ranks[currentRankIndex];
    const nextRank = ranks[nextRankIndex];
    const pointsToNext = nextRank.min - score;
    const totalPointsNeeded = nextRank.min - currentRank.min;
    const pointsEarned = score - currentRank.min;
    const percentage = Math.round((pointsEarned / totalPointsNeeded) * 100);

    return {
      percentage: Math.max(0, Math.min(100, percentage)),
      pointsToNext,
      nextRank: nextRank.name
    };
  }

  /**
   * Generate score summary for display
   * @param {Object} scoreData - Score calculation result
   * @returns {Object} Formatted score summary
   */
  generateScoreSummary(scoreData) {
    const rank = this.getScoreRank(scoreData.finalScore);
    
    return {
      score: scoreData.finalScore,
      rank,
      achievements: this.checkAchievements(scoreData),
      breakdown: scoreData.breakdown,
      stats: scoreData.stats,
      displayText: {
        score: scoreData.finalScore.toLocaleString(),
        accuracy: `${scoreData.stats.accuracy}%`,
        averageTime: `${scoreData.stats.averageTime}s`,
        rank: rank.name
      }
    };
  }

  /**
   * Check for achievements based on performance
   * @param {Object} scoreData - Score data
   * @returns {Array} List of earned achievements
   */
  checkAchievements(scoreData) {
    const achievements = [];
    const { stats, breakdown } = scoreData;

    // Perfect accuracy
    if (stats.accuracy === 100) {
      achievements.push({
        id: 'perfect_accuracy',
        name: 'Flawless Victory',
        description: 'Answered all questions correctly',
        icon: '🎯',
        rarity: 'legendary'
      });
    }

    // Speed demon
    if (stats.averageTime < 10) {
      achievements.push({
        id: 'speed_demon',
        name: 'Lightning Fast',
        description: 'Average answer time under 10 seconds',
        icon: '⚡',
        rarity: 'epic'
      });
    }

    // Streak master
    if (stats.perfectStreak >= 10) {
      achievements.push({
        id: 'streak_master',
        name: 'Unstoppable',
        description: 'Perfect streak of 10+ questions',
        icon: '🔥',
        rarity: 'epic'
      });
    }

    // High scorer
    if (scoreData.finalScore >= 5000) {
      achievements.push({
        id: 'high_scorer',
        name: 'Cosmic Knowledge',
        description: 'Scored 5000+ points',
        icon: '🌟',
        rarity: 'legendary'
      });
    }

    return achievements;
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ScoreCalculator;
} else if (typeof window !== 'undefined') {
  window.ScoreCalculator = ScoreCalculator;
}