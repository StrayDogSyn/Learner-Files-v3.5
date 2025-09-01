import React, { useState, useEffect } from 'react';
import { GameStats, Achievement } from '../../types/marvel';

export interface ProgressIndicatorProps {
  current: number;
  total: number;
  label?: string;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'pink';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  showPercentage?: boolean;
}

export interface CircularProgressProps extends ProgressIndicatorProps {
  strokeWidth?: number;
  radius?: number;
}

export interface StatisticsDisplayProps {
  stats: GameStats;
  achievements?: Achievement[];
  compact?: boolean;
  animated?: boolean;
}

export interface SkillRadarProps {
  skills: {
    label: string;
    value: number;
    maxValue: number;
    color?: string;
  }[];
  size?: number;
}

// Linear Progress Bar
export const ProgressBar: React.FC<ProgressIndicatorProps> = ({
  current,
  total,
  label,
  color = 'blue',
  size = 'md',
  animated = true,
  showPercentage = true
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const percentage = Math.min((current / total) * 100, 100);

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setDisplayValue(percentage);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setDisplayValue(percentage);
    }
  }, [percentage, animated]);

  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500',
    pink: 'bg-pink-500'
  };

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-300">{label}</span>
          {showPercentage && (
            <span className="text-sm text-gray-400">
              {Math.round(displayValue)}%
            </span>
          )}
        </div>
      )}
      <div className={`w-full bg-gray-700 rounded-full ${sizeClasses[size]} overflow-hidden`}>
        <div
          className={`${colorClasses[color]} ${sizeClasses[size]} rounded-full transition-all duration-1000 ease-out relative overflow-hidden`}
          style={{ width: `${displayValue}%` }}
        >
          {animated && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer" />
          )}
        </div>
      </div>
    </div>
  );
};

// Circular Progress Ring
export const CircularProgress: React.FC<CircularProgressProps> = ({
  current,
  total,
  label,
  color = 'blue',
  size = 'md',
  animated = true,
  showPercentage = true,
  strokeWidth = 8,
  radius = 45
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const percentage = Math.min((current / total) * 100, 100);
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (displayValue / 100) * circumference;

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setDisplayValue(percentage);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setDisplayValue(percentage);
    }
  }, [percentage, animated]);

  const colorClasses = {
    blue: 'stroke-blue-500',
    green: 'stroke-green-500',
    red: 'stroke-red-500',
    yellow: 'stroke-yellow-500',
    purple: 'stroke-purple-500',
    pink: 'stroke-pink-500'
  };

  const sizeMap = {
    sm: { width: 80, height: 80, fontSize: 'text-sm' },
    md: { width: 120, height: 120, fontSize: 'text-base' },
    lg: { width: 160, height: 160, fontSize: 'text-lg' }
  };

  const dimensions = sizeMap[size];

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: dimensions.width, height: dimensions.height }}>
        <svg
          width={dimensions.width}
          height={dimensions.height}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={dimensions.width / 2}
            cy={dimensions.height / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            className="text-gray-700"
          />
          {/* Progress circle */}
          <circle
            cx={dimensions.width / 2}
            cy={dimensions.height / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className={`${colorClasses[color]} transition-all duration-1000 ease-out`}
          />
        </svg>
        {/* Center content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            {showPercentage && (
              <div className={`font-bold text-white ${dimensions.fontSize}`}>
                {Math.round(displayValue)}%
              </div>
            )}
            <div className="text-xs text-gray-400">
              {current}/{total}
            </div>
          </div>
        </div>
      </div>
      {label && (
        <span className="mt-2 text-sm font-medium text-gray-300 text-center">
          {label}
        </span>
      )}
    </div>
  );
};

// Statistics Display Component
export const StatisticsDisplay: React.FC<StatisticsDisplayProps> = ({
  stats,
  achievements = [],
  compact = false,
  animated = true
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => setIsVisible(true), 200);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(true);
    }
  }, [animated]);

  const accuracy = stats.totalQuestions > 0 
    ? (stats.correctAnswers / stats.totalQuestions) * 100 
    : 0;

  const averageTime = stats.totalQuestions > 0 
    ? stats.totalTimeSpent / stats.totalQuestions 
    : 0;

  const recentAchievements = achievements
    .filter(a => a.unlockedAt)
    .sort((a, b) => new Date(b.unlockedAt!).getTime() - new Date(a.unlockedAt!).getTime())
    .slice(0, compact ? 3 : 6);

  if (compact) {
    return (
      <div className={`grid grid-cols-2 gap-4 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="bg-gray-800 rounded-lg p-3">
          <div className="text-2xl font-bold text-green-400">{stats.correctAnswers}</div>
          <div className="text-xs text-gray-400">Correct</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-3">
          <div className="text-2xl font-bold text-blue-400">{Math.round(accuracy)}%</div>
          <div className="text-xs text-gray-400">Accuracy</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {/* Main Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-green-400 mb-1">
            {stats.correctAnswers}
          </div>
          <div className="text-sm text-gray-400">Correct Answers</div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-blue-400 mb-1">
            {Math.round(accuracy)}%
          </div>
          <div className="text-sm text-gray-400">Accuracy</div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-yellow-400 mb-1">
            {stats.currentStreak}
          </div>
          <div className="text-sm text-gray-400">Current Streak</div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-purple-400 mb-1">
            {Math.round(averageTime)}s
          </div>
          <div className="text-sm text-gray-400">Avg. Time</div>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="space-y-4">
        <ProgressBar
          current={stats.correctAnswers}
          total={stats.totalQuestions}
          label="Overall Progress"
          color="blue"
          animated={animated}
        />
        
        <ProgressBar
          current={stats.currentStreak}
          total={stats.longestStreak}
          label="Streak Progress"
          color="yellow"
          animated={animated}
        />
      </div>

      {/* Recent Achievements */}
      {recentAchievements.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-3">Recent Achievements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {recentAchievements.map((achievement, index) => (
              <div
                key={achievement.id}
                className={`flex items-center space-x-3 p-2 rounded-lg bg-gray-700 transition-all duration-300 ${animated ? 'hover:bg-gray-600' : ''}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-2xl">{achievement.icon}</div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">
                    {achievement.name}
                  </div>
                  <div className="text-xs text-gray-400">
                    {achievement.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Skill Radar Chart
export const SkillRadar: React.FC<SkillRadarProps> = ({
  skills,
  size = 200
}) => {
  const center = size / 2;
  const radius = size * 0.35;
  const angleStep = (2 * Math.PI) / skills.length;

  const getPoint = (index: number, value: number, maxValue: number) => {
    const angle = index * angleStep - Math.PI / 2;
    const distance = (value / maxValue) * radius;
    return {
      x: center + Math.cos(angle) * distance,
      y: center + Math.sin(angle) * distance
    };
  };

  const getAxisPoint = (index: number) => {
    const angle = index * angleStep - Math.PI / 2;
    return {
      x: center + Math.cos(angle) * radius,
      y: center + Math.sin(angle) * radius
    };
  };

  const pathData = skills
    .map((skill, index) => {
      const point = getPoint(index, skill.value, skill.maxValue);
      return `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`;
    })
    .join(' ') + ' Z';

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="overflow-visible">
        {/* Grid circles */}
        {[0.2, 0.4, 0.6, 0.8, 1].map((scale, index) => (
          <circle
            key={index}
            cx={center}
            cy={center}
            r={radius * scale}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-gray-600 opacity-30"
          />
        ))}
        
        {/* Axis lines */}
        {skills.map((_, index) => {
          const point = getAxisPoint(index);
          return (
            <line
              key={index}
              x1={center}
              y1={center}
              x2={point.x}
              y2={point.y}
              stroke="currentColor"
              strokeWidth="1"
              className="text-gray-600 opacity-30"
            />
          );
        })}
        
        {/* Data area */}
        <path
          d={pathData}
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="2"
          className="text-blue-500 opacity-30"
        />
        
        {/* Data points */}
        {skills.map((skill, index) => {
          const point = getPoint(index, skill.value, skill.maxValue);
          return (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="4"
              fill={skill.color || 'currentColor'}
              className="text-blue-500"
            />
          );
        })}
        
        {/* Labels */}
        {skills.map((skill, index) => {
          const labelPoint = getAxisPoint(index);
          const angle = index * angleStep - Math.PI / 2;
          const isRight = Math.cos(angle) > 0;
          const isBottom = Math.sin(angle) > 0;
          
          return (
            <text
              key={index}
              x={labelPoint.x + Math.cos(angle) * 20}
              y={labelPoint.y + Math.sin(angle) * 20}
              textAnchor={isRight ? 'start' : 'end'}
              dominantBaseline={isBottom ? 'hanging' : 'auto'}
              className="text-xs fill-current text-gray-300"
            >
              {skill.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

// Alias for CircularProgress to maintain compatibility
export const ProgressRing = CircularProgress;

export default {
  ProgressBar,
  CircularProgress,
  ProgressRing,
  StatisticsDisplay,
  SkillRadar
};