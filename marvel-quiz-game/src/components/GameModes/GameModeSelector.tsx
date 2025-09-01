import React, { useState } from 'react';
import { Clock, Target, User, Calendar, Zap, Trophy, Star, Flame } from 'lucide-react';
import { MarvelCharacterDetailed } from '../../data/characters';

export type GameMode = 
  | 'classic'
  | 'survival'
  | 'timeAttack'
  | 'characterSpecific'
  | 'dailyChallenge'
  | 'endurance'
  | 'speedRun';

export interface GameModeConfig {
  mode: GameMode;
  name: string;
  description: string;
  icon: React.ReactNode;
  difficulty?: 'easy' | 'medium' | 'hard' | 'expert';
  timeLimit?: number;
  questionCount?: number;
  characterId?: number;
  specialRules?: string[];
  rewards?: {
    points: number;
    achievements?: string[];
  };
}

interface GameModeSelectorProps {
  onModeSelect: (config: GameModeConfig) => void;
  characters: MarvelCharacterDetailed[];
  unlockedModes: GameMode[];
  dailyChallengeCompleted: boolean;
}

const GameModeSelector: React.FC<GameModeSelectorProps> = ({
  onModeSelect,
  characters,
  unlockedModes,
  dailyChallengeCompleted
}) => {
  const [selectedCharacter, setSelectedCharacter] = useState<number | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard' | 'expert'>('medium');

  const gameModes: GameModeConfig[] = [
    {
      mode: 'classic',
      name: 'Classic Quiz',
      description: 'Traditional Marvel quiz with 10 questions',
      icon: <Star className="w-6 h-6" />,
      questionCount: 10,
      rewards: { points: 100 }
    },
    {
      mode: 'survival',
      name: 'Survival Mode',
      description: 'Keep answering until you get one wrong!',
      icon: <Target className="w-6 h-6" />,
      specialRules: [
        'Unlimited questions',
        'Game ends on first wrong answer',
        'Difficulty increases every 5 questions',
        'Bonus points for streaks'
      ],
      rewards: { points: 50, achievements: ['Survivor', 'Unstoppable'] }
    },
    {
      mode: 'timeAttack',
      name: 'Time Attack',
      description: 'Answer as many questions as possible in 2 minutes',
      icon: <Clock className="w-6 h-6" />,
      timeLimit: 120,
      specialRules: [
        '2 minute time limit',
        'Quick answers give bonus points',
        'No penalties for wrong answers',
        'Rapid-fire questions'
      ],
      rewards: { points: 200, achievements: ['Speed Demon', 'Lightning Fast'] }
    },
    {
      mode: 'characterSpecific',
      name: 'Character Focus',
      description: 'Deep dive into a specific Marvel character',
      icon: <User className="w-6 h-6" />,
      questionCount: 15,
      specialRules: [
        'All questions about selected character',
        'Includes relationships and history',
        'Unlock character insights',
        'Character-themed background'
      ],
      rewards: { points: 150, achievements: ['Character Expert', 'True Fan'] }
    },
    {
      mode: 'dailyChallenge',
      name: 'Daily Challenge',
      description: 'Special challenge that changes every day',
      icon: <Calendar className="w-6 h-6" />,
      questionCount: 8,
      specialRules: [
        'Unique questions each day',
        'Special themed challenges',
        'Bonus rewards for completion',
        'Leaderboard competition'
      ],
      rewards: { points: 300, achievements: ['Daily Warrior', 'Consistent'] }
    },
    {
      mode: 'endurance',
      name: 'Endurance Test',
      description: '50 questions across all difficulties',
      icon: <Flame className="w-6 h-6" />,
      questionCount: 50,
      specialRules: [
        '50 questions total',
        'Progressive difficulty',
        'No time pressure',
        'Ultimate Marvel knowledge test'
      ],
      rewards: { points: 500, achievements: ['Endurance Master', 'Marvel Scholar'] }
    },
    {
      mode: 'speedRun',
      name: 'Speed Run',
      description: 'Complete 20 questions as fast as possible',
      icon: <Zap className="w-6 h-6" />,
      questionCount: 20,
      specialRules: [
        'Race against the clock',
        'Time penalties for wrong answers',
        'Bonus for perfect runs',
        'Global leaderboard'
      ],
      rewards: { points: 250, achievements: ['Speed Runner', 'Perfect Run'] }
    }
  ];

  const handleModeSelect = (mode: GameModeConfig) => {
    if (mode.mode === 'characterSpecific' && selectedCharacter) {
      onModeSelect({
        ...mode,
        characterId: selectedCharacter,
        difficulty: selectedDifficulty
      });
    } else {
      onModeSelect(mode);
    }
  };

  const isModeUnlocked = (mode: GameMode): boolean => {
    return unlockedModes.includes(mode);
  };

  const getModeStatus = (mode: GameMode): string => {
    if (mode === 'dailyChallenge' && dailyChallengeCompleted) {
      return 'Completed Today';
    }
    if (!isModeUnlocked(mode)) {
      return 'Locked';
    }
    return 'Available';
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
          <Trophy className="w-10 h-10 text-yellow-400" />
          Choose Your Challenge
        </h2>
        <p className="text-gray-300 text-lg">
          Select a game mode to test your Marvel knowledge in different ways
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gameModes.map((mode) => {
          const isUnlocked = isModeUnlocked(mode.mode);
          const status = getModeStatus(mode.mode);
          const isCompleted = mode.mode === 'dailyChallenge' && dailyChallengeCompleted;

          return (
            <div
              key={mode.mode}
              className={`
                relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border-2 transition-all duration-300
                ${isUnlocked && !isCompleted
                  ? 'border-blue-500 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/20 cursor-pointer transform hover:scale-105'
                  : isCompleted
                  ? 'border-green-500 bg-gradient-to-br from-green-800/20 to-gray-900'
                  : 'border-gray-600 opacity-60 cursor-not-allowed'
                }
              `}
              onClick={() => isUnlocked && !isCompleted && handleModeSelect(mode)}
            >
              {/* Status Badge */}
              <div className={`
                absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-semibold
                ${isCompleted
                  ? 'bg-green-500 text-white'
                  : isUnlocked
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-600 text-gray-300'
                }
              `}>
                {status}
              </div>

              {/* Mode Icon */}
              <div className={`
                w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto
                ${isUnlocked
                  ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
                  : 'bg-gray-600 text-gray-400'
                }
              `}>
                {mode.icon}
              </div>

              {/* Mode Info */}
              <h3 className="text-xl font-bold text-white mb-2 text-center">
                {mode.name}
              </h3>
              <p className="text-gray-300 text-sm mb-4 text-center">
                {mode.description}
              </p>

              {/* Mode Details */}
              <div className="space-y-2 mb-4">
                {mode.questionCount && (
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Target className="w-4 h-4" />
                    <span>{mode.questionCount} questions</span>
                  </div>
                )}
                {mode.timeLimit && (
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{mode.timeLimit} seconds</span>
                  </div>
                )}
                {mode.rewards && (
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Star className="w-4 h-4" />
                    <span>{mode.rewards.points} points</span>
                  </div>
                )}
              </div>

              {/* Special Rules */}
              {mode.specialRules && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-300 mb-2">Special Rules:</h4>
                  <ul className="text-xs text-gray-400 space-y-1">
                    {mode.specialRules.map((rule, index) => (
                      <li key={index} className="flex items-start gap-1">
                        <span className="text-blue-400 mt-1">•</span>
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Character Selection for Character-Specific Mode */}
              {mode.mode === 'characterSpecific' && isUnlocked && (
                <div className="mt-4 space-y-3" onClick={(e) => e.stopPropagation()}>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Select Character:
                    </label>
                    <select
                      value={selectedCharacter || ''}
                      onChange={(e) => setSelectedCharacter(Number(e.target.value))}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                    >
                      <option value="">Choose a character...</option>
                      {characters.map((character) => (
                        <option key={character.id} value={character.id}>
                          {character.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Difficulty:
                    </label>
                    <select
                      value={selectedDifficulty}
                      onChange={(e) => setSelectedDifficulty(e.target.value as 'easy' | 'medium' | 'hard' | 'expert')}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                      <option value="expert">Expert</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Action Button */}
              {isUnlocked && !isCompleted && (
                <button
                  className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleModeSelect(mode);
                  }}
                  disabled={mode.mode === 'characterSpecific' && !selectedCharacter}
                >
                  {mode.mode === 'characterSpecific' && !selectedCharacter
                    ? 'Select Character First'
                    : 'Start Challenge'
                  }
                </button>
              )}

              {/* Unlock Requirements */}
              {!isUnlocked && (
                <div className="mt-4 p-3 bg-gray-700/50 rounded-lg">
                  <p className="text-xs text-gray-400 text-center">
                    {getUnlockRequirement(mode.mode)}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const getUnlockRequirement = (mode: GameMode): string => {
  switch (mode) {
    case 'survival':
      return 'Complete 3 Classic quizzes to unlock';
    case 'timeAttack':
      return 'Score 80% or higher in Classic mode';
    case 'characterSpecific':
      return 'Complete 5 quizzes to unlock';
    case 'dailyChallenge':
      return 'Complete 10 quizzes to unlock';
    case 'endurance':
      return 'Complete Survival mode with 20+ questions';
    case 'speedRun':
      return 'Complete Time Attack mode';
    default:
      return 'Requirements not met';
  }
};

export default GameModeSelector;