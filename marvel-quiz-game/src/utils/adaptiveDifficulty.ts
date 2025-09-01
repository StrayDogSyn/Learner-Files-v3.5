import { EnhancedQuizQuestion } from '../data/enhancedQuestions';

export interface PlayerPerformance {
  totalQuestions: number;
  correctAnswers: number;
  averageTimePerQuestion: number;
  categoryPerformance: Record<string, CategoryPerformance>;
  difficultyPerformance: Record<string, DifficultyPerformance>;
  streakCount: number;
  longestStreak: number;
  recentPerformance: QuestionResult[];
}

export interface CategoryPerformance {
  category: string;
  questionsAnswered: number;
  correctAnswers: number;
  averageTime: number;
  accuracy: number;
  suggestedDifficulty: 'easy' | 'medium' | 'hard' | 'expert';
}

export interface DifficultyPerformance {
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  questionsAnswered: number;
  correctAnswers: number;
  accuracy: number;
  averageTime: number;
}

export interface QuestionResult {
  questionId: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  correct: boolean;
  timeSpent: number;
  timestamp: number;
}

export interface AdaptiveDifficultyConfig {
  minQuestionsForAdaptation: number;
  accuracyThresholds: {
    increaseToMedium: number;
    increaseToHard: number;
    increaseToExpert: number;
    decreaseToEasy: number;
    decreaseToMedium: number;
    decreaseToHard: number;
  };
  streakBonusThreshold: number;
  recentPerformanceWindow: number;
  categoryMasteryThreshold: number;
}

export const defaultAdaptiveConfig: AdaptiveDifficultyConfig = {
  minQuestionsForAdaptation: 5,
  accuracyThresholds: {
    increaseToMedium: 0.8,
    increaseToHard: 0.85,
    increaseToExpert: 0.9,
    decreaseToEasy: 0.4,
    decreaseToMedium: 0.6,
    decreaseToHard: 0.75
  },
  streakBonusThreshold: 5,
  recentPerformanceWindow: 10,
  categoryMasteryThreshold: 0.85
};

export class AdaptiveDifficultyEngine {
  private config: AdaptiveDifficultyConfig;
  private performance: PlayerPerformance;

  constructor(config: AdaptiveDifficultyConfig = defaultAdaptiveConfig) {
    this.config = config;
    this.performance = this.initializePerformance();
  }

  private initializePerformance(): PlayerPerformance {
    return {
      totalQuestions: 0,
      correctAnswers: 0,
      averageTimePerQuestion: 0,
      categoryPerformance: {},
      difficultyPerformance: {
        easy: { difficulty: 'easy', questionsAnswered: 0, correctAnswers: 0, accuracy: 0, averageTime: 0 },
        medium: { difficulty: 'medium', questionsAnswered: 0, correctAnswers: 0, accuracy: 0, averageTime: 0 },
        hard: { difficulty: 'hard', questionsAnswered: 0, correctAnswers: 0, accuracy: 0, averageTime: 0 },
        expert: { difficulty: 'expert', questionsAnswered: 0, correctAnswers: 0, accuracy: 0, averageTime: 0 }
      },
      streakCount: 0,
      longestStreak: 0,
      recentPerformance: []
    };
  }

  public recordQuestionResult(result: QuestionResult): void {
    // Update overall performance
    this.performance.totalQuestions++;
    if (result.correct) {
      this.performance.correctAnswers++;
      this.performance.streakCount++;
      this.performance.longestStreak = Math.max(this.performance.longestStreak, this.performance.streakCount);
    } else {
      this.performance.streakCount = 0;
    }

    // Update average time
    const totalTime = this.performance.averageTimePerQuestion * (this.performance.totalQuestions - 1) + result.timeSpent;
    this.performance.averageTimePerQuestion = totalTime / this.performance.totalQuestions;

    // Update category performance
    if (!this.performance.categoryPerformance[result.category]) {
      this.performance.categoryPerformance[result.category] = {
        category: result.category,
        questionsAnswered: 0,
        correctAnswers: 0,
        averageTime: 0,
        accuracy: 0,
        suggestedDifficulty: 'easy'
      };
    }

    const categoryPerf = this.performance.categoryPerformance[result.category];
    categoryPerf.questionsAnswered++;
    if (result.correct) {
      categoryPerf.correctAnswers++;
    }
    categoryPerf.accuracy = categoryPerf.correctAnswers / categoryPerf.questionsAnswered;
    
    const categoryTotalTime = categoryPerf.averageTime * (categoryPerf.questionsAnswered - 1) + result.timeSpent;
    categoryPerf.averageTime = categoryTotalTime / categoryPerf.questionsAnswered;
    categoryPerf.suggestedDifficulty = this.calculateCategoryDifficulty(categoryPerf);

    // Update difficulty performance
    const diffPerf = this.performance.difficultyPerformance[result.difficulty];
    diffPerf.questionsAnswered++;
    if (result.correct) {
      diffPerf.correctAnswers++;
    }
    diffPerf.accuracy = diffPerf.correctAnswers / diffPerf.questionsAnswered;
    
    const diffTotalTime = diffPerf.averageTime * (diffPerf.questionsAnswered - 1) + result.timeSpent;
    diffPerf.averageTime = diffTotalTime / diffPerf.questionsAnswered;

    // Update recent performance
    this.performance.recentPerformance.push(result);
    if (this.performance.recentPerformance.length > this.config.recentPerformanceWindow) {
      this.performance.recentPerformance.shift();
    }
  }

  private calculateCategoryDifficulty(categoryPerf: CategoryPerformance): 'easy' | 'medium' | 'hard' | 'expert' {
    if (categoryPerf.questionsAnswered < this.config.minQuestionsForAdaptation) {
      return 'easy';
    }

    const accuracy = categoryPerf.accuracy;
    const { accuracyThresholds } = this.config;

    if (accuracy >= accuracyThresholds.increaseToExpert) {
      return 'expert';
    } else if (accuracy >= accuracyThresholds.increaseToHard) {
      return 'hard';
    } else if (accuracy >= accuracyThresholds.increaseToMedium) {
      return 'medium';
    } else {
      return 'easy';
    }
  }

  public getRecommendedDifficulty(category?: string): 'easy' | 'medium' | 'hard' | 'expert' {
    if (this.performance.totalQuestions < this.config.minQuestionsForAdaptation) {
      return 'easy';
    }

    // If category is specified, use category-specific difficulty
    if (category && this.performance.categoryPerformance[category]) {
      const categoryPerf = this.performance.categoryPerformance[category];
      if (categoryPerf.questionsAnswered >= this.config.minQuestionsForAdaptation) {
        return categoryPerf.suggestedDifficulty;
      }
    }

    // Use overall performance for general difficulty
    const overallAccuracy = this.performance.correctAnswers / this.performance.totalQuestions;
    const recentAccuracy = this.getRecentAccuracy();
    
    // Weight recent performance more heavily
    const weightedAccuracy = (overallAccuracy * 0.3) + (recentAccuracy * 0.7);
    
    const { accuracyThresholds } = this.config;

    if (weightedAccuracy >= accuracyThresholds.increaseToExpert) {
      return 'expert';
    } else if (weightedAccuracy >= accuracyThresholds.increaseToHard) {
      return 'hard';
    } else if (weightedAccuracy >= accuracyThresholds.increaseToMedium) {
      return 'medium';
    } else {
      return 'easy';
    }
  }

  private getRecentAccuracy(): number {
    if (this.performance.recentPerformance.length === 0) {
      return 0;
    }

    const recentCorrect = this.performance.recentPerformance.filter(r => r.correct).length;
    return recentCorrect / this.performance.recentPerformance.length;
  }

  public shouldOfferBonusQuestion(): boolean {
    return this.performance.streakCount >= this.config.streakBonusThreshold;
  }

  public getBonusQuestionDifficulty(): 'expert' {
    return 'expert'; // Bonus questions are always expert level
  }

  public getCategoryMastery(category: string): number {
    const categoryPerf = this.performance.categoryPerformance[category];
    if (!categoryPerf || categoryPerf.questionsAnswered < this.config.minQuestionsForAdaptation) {
      return 0;
    }
    return categoryPerf.accuracy;
  }

  public isCategoryMastered(category: string): boolean {
    return this.getCategoryMastery(category) >= this.config.categoryMasteryThreshold;
  }

  public getWeakestCategories(limit: number = 3): string[] {
    const categories = Object.values(this.performance.categoryPerformance)
      .filter(cat => cat.questionsAnswered >= this.config.minQuestionsForAdaptation)
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, limit)
      .map(cat => cat.category);
    
    return categories;
  }

  public getStrongestCategories(limit: number = 3): string[] {
    const categories = Object.values(this.performance.categoryPerformance)
      .filter(cat => cat.questionsAnswered >= this.config.minQuestionsForAdaptation)
      .sort((a, b) => b.accuracy - a.accuracy)
      .slice(0, limit)
      .map(cat => cat.category);
    
    return categories;
  }

  public getPerformanceAnalysis(): {
    overallAccuracy: number;
    recentAccuracy: number;
    currentStreak: number;
    longestStreak: number;
    masteredCategories: string[];
    strugglingCategories: string[];
    recommendedFocus: string[];
  } {
    const overallAccuracy = this.performance.totalQuestions > 0 
      ? this.performance.correctAnswers / this.performance.totalQuestions 
      : 0;
    
    const masteredCategories = Object.keys(this.performance.categoryPerformance)
      .filter(cat => this.isCategoryMastered(cat));
    
    const strugglingCategories = this.getWeakestCategories(3);
    
    return {
      overallAccuracy,
      recentAccuracy: this.getRecentAccuracy(),
      currentStreak: this.performance.streakCount,
      longestStreak: this.performance.longestStreak,
      masteredCategories,
      strugglingCategories,
      recommendedFocus: strugglingCategories
    };
  }

  public exportPerformance(): PlayerPerformance {
    return { ...this.performance };
  }

  public importPerformance(performance: PlayerPerformance): void {
    this.performance = { ...performance };
  }

  public resetPerformance(): void {
    this.performance = this.initializePerformance();
  }
}

// Utility functions for question selection based on adaptive difficulty
export const selectAdaptiveQuestions = (
  questions: EnhancedQuizQuestion[],
  engine: AdaptiveDifficultyEngine,
  count: number,
  category?: string
): EnhancedQuizQuestion[] => {
  const recommendedDifficulty = engine.getRecommendedDifficulty(category);
  
  // Filter questions by category if specified
  let availableQuestions = category 
    ? questions.filter(q => q.category === category)
    : questions;
  
  // Prioritize recommended difficulty but include some variety
  const primaryQuestions = availableQuestions.filter(q => q.difficulty === recommendedDifficulty);
  const secondaryQuestions = availableQuestions.filter(q => q.difficulty !== recommendedDifficulty);
  
  // Mix of primary (70%) and secondary (30%) questions
  const primaryCount = Math.ceil(count * 0.7);
  const secondaryCount = count - primaryCount;
  
  const selectedPrimary = primaryQuestions
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.min(primaryCount, primaryQuestions.length));
  
  const selectedSecondary = secondaryQuestions
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.min(secondaryCount, secondaryQuestions.length));
  
  const selected = [...selectedPrimary, ...selectedSecondary];
  
  // If we don't have enough questions, fill with any available
  if (selected.length < count) {
    const remaining = availableQuestions
      .filter(q => !selected.includes(q))
      .sort(() => Math.random() - 0.5)
      .slice(0, count - selected.length);
    selected.push(...remaining);
  }
  
  return selected.sort(() => Math.random() - 0.5);
};

export const getBonusQuestion = (
  questions: EnhancedQuizQuestion[],
  engine: AdaptiveDifficultyEngine
): EnhancedQuizQuestion | null => {
  if (!engine.shouldOfferBonusQuestion()) {
    return null;
  }
  
  const expertQuestions = questions.filter(q => q.difficulty === 'expert');
  if (expertQuestions.length === 0) {
    return null;
  }
  
  return expertQuestions[Math.floor(Math.random() * expertQuestions.length)];
};