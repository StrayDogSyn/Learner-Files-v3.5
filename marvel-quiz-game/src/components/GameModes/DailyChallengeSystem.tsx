import React, { useState, useEffect } from 'react';
import { Calendar, Trophy, Star, Clock, Target, Zap } from 'lucide-react';
import { EnhancedQuizQuestion } from '../../data/enhancedQuestions';
import { DifficultyLevel } from '../../types/marvel';

export interface DailyChallenge {
  id: string;
  date: string;
  title: string;
  description: string;
  theme: string;
  difficulty: DifficultyLevel;
  specialRules: string[];
  rewards: {
    points: number;
    achievements: string[];
    badges?: string[];
  };
  questions: EnhancedQuizQuestion[];
  timeLimit?: number;
  requiredAccuracy?: number;
  bonusObjectives?: {
    description: string;
    reward: number;
    completed?: boolean;
  }[];
}

export interface DailyChallengeProgress {
  challengeId: string;
  completed: boolean;
  score: number;
  accuracy: number;
  timeSpent: number;
  bonusObjectivesCompleted: number;
  completedAt?: string;
}

interface DailyChallengePanelProps {
  questions: EnhancedQuizQuestion[];
  onStartChallenge: (challenge: DailyChallenge) => void;
  progress: DailyChallengeProgress[];
}

const DailyChallengeSystem: React.FC<DailyChallengePanelProps> = ({
  questions,
  onStartChallenge,
  progress
}) => {
  const [currentChallenge, setCurrentChallenge] = useState<DailyChallenge | null>(null);
  const [weeklyProgress, setWeeklyProgress] = useState<DailyChallengeProgress[]>([]);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const challenge = generateDailyChallenge(today, questions);
    setCurrentChallenge(challenge);

    // Calculate weekly progress and streak
    const lastWeek = getLastWeekDates();
    const weekProgress = lastWeek.map(date => 
      progress.find(p => p.challengeId.includes(date)) || null
    ).filter(Boolean) as DailyChallengeProgress[];
    
    setWeeklyProgress(weekProgress);
    setStreak(calculateStreak(progress));
  }, [questions, progress]);

  const todayProgress = progress.find(p => 
    currentChallenge && p.challengeId === currentChallenge.id
  );

  const isCompleted = todayProgress?.completed || false;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
          <Calendar className="w-10 h-10 text-yellow-400" />
          Daily Challenge
        </h2>
        <p className="text-gray-300 text-lg">
          Test your Marvel knowledge with today's special challenge
        </p>
      </div>

      {/* Streak Counter */}
      <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-center gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400">{streak}</div>
            <div className="text-yellow-300 text-sm">Day Streak</div>
          </div>
          <Zap className="w-8 h-8 text-yellow-400" />
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-400">{weeklyProgress.length}</div>
            <div className="text-orange-300 text-sm">This Week</div>
          </div>
        </div>
      </div>

      {/* Today's Challenge */}
      {currentChallenge && (
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border-2 border-blue-500 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {currentChallenge.title}
              </h3>
              <p className="text-gray-300 mb-4">
                {currentChallenge.description}
              </p>
            </div>
            
            <div className={`
              px-3 py-1 rounded-full text-sm font-semibold
              ${isCompleted 
                ? 'bg-green-500 text-white' 
                : 'bg-blue-500 text-white'
              }
            `}>
              {isCompleted ? 'Completed' : 'Available'}
            </div>
          </div>

          {/* Challenge Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-blue-400" />
                <span className="text-blue-400 font-semibold">Theme</span>
              </div>
              <div className="text-white">{currentChallenge.theme}</div>
            </div>

            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-400 font-semibold">Difficulty</span>
              </div>
              <div className={`font-semibold ${
                currentChallenge.difficulty === 'easy' ? 'text-green-400' :
                currentChallenge.difficulty === 'medium' ? 'text-yellow-400' :
                currentChallenge.difficulty === 'hard' ? 'text-orange-400' :
                'text-red-400'
              }`}>
                {currentChallenge.difficulty.toUpperCase()}
              </div>
            </div>

            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-5 h-5 text-purple-400" />
                <span className="text-purple-400 font-semibold">Reward</span>
              </div>
              <div className="text-white">{currentChallenge.rewards.points} points</div>
            </div>
          </div>

          {/* Special Rules */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-white mb-3">Special Rules:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {currentChallenge.specialRules.map((rule, index) => (
                <div key={index} className="flex items-start gap-2 text-gray-300">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>{rule}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bonus Objectives */}
          {currentChallenge.bonusObjectives && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-white mb-3">Bonus Objectives:</h4>
              <div className="space-y-2">
                {currentChallenge.bonusObjectives.map((objective, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-700/30 rounded-lg p-3">
                    <span className="text-gray-300">{objective.description}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-400 font-semibold">+{objective.reward}</span>
                      {objective.completed && (
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Progress Display */}
          {isCompleted && todayProgress && (
            <div className="bg-green-600/20 rounded-lg p-4 mb-6">
              <h4 className="text-lg font-semibold text-green-400 mb-3">Today's Results:</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-white">{todayProgress.score}</div>
                  <div className="text-green-400 text-sm">Score</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{Math.round(todayProgress.accuracy)}%</div>
                  <div className="text-green-400 text-sm">Accuracy</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{Math.round(todayProgress.timeSpent / 1000)}s</div>
                  <div className="text-green-400 text-sm">Time</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{todayProgress.bonusObjectivesCompleted}</div>
                  <div className="text-green-400 text-sm">Bonuses</div>
                </div>
              </div>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={() => onStartChallenge(currentChallenge)}
            disabled={isCompleted}
            className={`
              w-full py-3 px-6 rounded-lg font-semibold text-lg transition-all duration-200
              ${isCompleted
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white transform hover:scale-105'
              }
            `}
          >
            {isCompleted ? 'Challenge Completed' : 'Start Today\'s Challenge'}
          </button>
        </div>
      )}

      {/* Weekly Progress */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">This Week's Progress</h3>
        <div className="grid grid-cols-7 gap-2">
          {getLastWeekDates().map((date, index) => {
            const dayProgress = progress.find(p => p.challengeId.includes(date));
            const isToday = date === new Date().toISOString().split('T')[0];
            const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date(date).getDay()];
            
            return (
              <div key={date} className="text-center">
                <div className="text-gray-400 text-xs mb-1">{dayName}</div>
                <div className={`
                  w-12 h-12 rounded-lg flex items-center justify-center text-sm font-semibold
                  ${dayProgress?.completed
                    ? 'bg-green-500 text-white'
                    : isToday
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-700 text-gray-400'
                  }
                `}>
                  {dayProgress?.completed ? '✓' : new Date(date).getDate()}
                </div>
                {dayProgress?.completed && (
                  <div className="text-xs text-green-400 mt-1">
                    {dayProgress.score}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Helper functions
function generateDailyChallenge(date: string, questions: EnhancedQuizQuestion[]): DailyChallenge {
  const seed = hashCode(date);
  const random = seededRandom(seed);
  
  const themes = [
    'Spider-Verse Heroes',
    'Cosmic Entities',
    'X-Men Legacy',
    'Avengers Assemble',
    'Villains United',
    'Marvel Origins',
    'Multiverse Madness',
    'Street Level Heroes',
    'Asgardian Lore',
    'Wakanda Forever'
  ];

  const difficulties: DifficultyLevel[] = ['easy', 'medium', 'hard', 'expert'];
  const theme = themes[Math.floor(random() * themes.length)];
  const difficulty = difficulties[Math.floor(random() * difficulties.length)];
  
  // Filter questions based on theme and difficulty
  let filteredQuestions = questions.filter(q => q.difficulty === difficulty);
  
  // Theme-based filtering (simplified)
  if (theme.includes('Spider')) {
    filteredQuestions = filteredQuestions.filter(q => 
      q.question.toLowerCase().includes('spider') ||
      q.tags.some(tag => tag.toLowerCase().includes('spider'))
    );
  }
  
  // Shuffle and select questions
  const shuffled = filteredQuestions.sort(() => random() - 0.5);
  const selectedQuestions = shuffled.slice(0, 8);

  const specialRules = generateSpecialRules(theme, difficulty, random);
  const bonusObjectives = generateBonusObjectives(theme, difficulty, random);

  return {
    id: `daily-${date}`,
    date,
    title: `${theme} Challenge`,
    description: `Test your knowledge of ${theme.toLowerCase()} in today's special challenge!`,
    theme,
    difficulty,
    specialRules,
    rewards: {
      points: 300 + (difficulties.indexOf(difficulty) * 100),
      achievements: ['Daily Warrior', 'Challenge Accepted'],
      badges: [theme.replace(' ', '_').toLowerCase()]
    },
    questions: selectedQuestions,
    timeLimit: difficulty === 'expert' ? 300 : 600, // 5-10 minutes
    requiredAccuracy: difficulty === 'expert' ? 80 : 60,
    bonusObjectives
  };
}

function generateSpecialRules(theme: string, difficulty: DifficultyLevel, random: () => number): string[] {
  const baseRules = [
    'Complete within the time limit',
    `Achieve ${difficulty === 'expert' ? '80%' : '60%'} accuracy`,
    'All questions are themed around ' + theme.toLowerCase()
  ];

  const extraRules = [
    'No hints available',
    'Double points for perfect answers',
    'Bonus time for quick responses',
    'Streak multiplier active'
  ];

  const numExtraRules = Math.floor(random() * 2) + 1;
  const selectedExtra = extraRules.sort(() => random() - 0.5).slice(0, numExtraRules);
  
  return [...baseRules, ...selectedExtra];
}

function generateBonusObjectives(theme: string, difficulty: DifficultyLevel, random: () => number): any[] {
  const objectives = [
    { description: 'Answer 3 questions in under 10 seconds each', reward: 50 },
    { description: 'Achieve a 5-question streak', reward: 75 },
    { description: 'Complete with 90%+ accuracy', reward: 100 },
    { description: 'Finish with time remaining', reward: 25 },
    { description: 'Answer all questions correctly', reward: 150 }
  ];

  return objectives.sort(() => random() - 0.5).slice(0, 3);
}

function getLastWeekDates(): string[] {
  const dates = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  
  return dates;
}

function calculateStreak(progress: DailyChallengeProgress[]): number {
  const today = new Date();
  let streak = 0;
  
  for (let i = 0; i < 30; i++) { // Check last 30 days
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const dayProgress = progress.find(p => p.challengeId.includes(dateStr));
    
    if (dayProgress?.completed) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

function seededRandom(seed: number): () => number {
  let x = seed;
  return function() {
    x = Math.sin(x) * 10000;
    return x - Math.floor(x);
  };
}

export default DailyChallengeSystem;