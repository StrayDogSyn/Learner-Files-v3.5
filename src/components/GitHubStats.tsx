// GitHub Stats component with animated counters and glassmorphic styling

import React, { useState, useEffect } from 'react';
import { Star, GitFork, Code, Calendar } from 'lucide-react';
import { useGitHub } from '../hooks/useGitHub';
import { useLazyLoad } from '../hooks/useLazyLoad';
import { formatNumber } from '../types/github';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  formatter?: (value: number) => string;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ 
  value, 
  duration = 2000, 
  formatter = (v) => v.toString() 
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (value === 0) {
      setDisplayValue(0);
      return;
    }

    const startTime = Date.now();
    const startValue = displayValue;
    const difference = value - startValue;

    const updateCounter = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.round(startValue + (difference * easeOutQuart));
      
      setDisplayValue(currentValue);
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };

    requestAnimationFrame(updateCounter);
  }, [value, duration]);

  return <span>{formatter(displayValue)}</span>;
};

interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  formatter?: (value: number) => string;
  color: string;
}

const StatItem: React.FC<StatItemProps> = ({ icon, label, value, formatter, color }) => {
  return (
    <div className="group relative">
      {/* Glassmorphic background */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 transition-all duration-300 group-hover:bg-white/15 group-hover:border-white/30" />
      
      {/* Content */}
      <div className="relative p-4 text-center">
        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br ${color} mb-3 transition-transform duration-300 group-hover:scale-110`}>
          <div className="text-white">
            {icon}
          </div>
        </div>
        
        <div className="text-2xl font-bold text-white mb-1">
          <AnimatedCounter value={value} formatter={formatter} />
        </div>
        
        <div className="text-sm text-gray-300 font-medium">
          {label}
        </div>
      </div>
    </div>
  );
};

interface GitHubStatsProps {
  className?: string;
  showLastUpdated?: boolean;
}

const GitHubStats: React.FC<GitHubStatsProps> = ({ 
  className = '', 
  showLastUpdated = true 
}) => {
  const { stats, loading, error, lastUpdated } = useGitHub();
  const { elementRef: statsRef, isVisible } = useLazyLoad({ threshold: 0.1 });

  if (loading) {
    return (
      <div className={`${className}`}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="relative">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 animate-pulse" />
              <div className="relative p-4 text-center">
                <div className="w-12 h-12 bg-white/20 rounded-lg mx-auto mb-3 animate-pulse" />
                <div className="h-6 bg-white/20 rounded mb-1 animate-pulse" />
                <div className="h-4 bg-white/20 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${className}`}>
        <div className="relative">
          <div className="absolute inset-0 bg-red-500/10 backdrop-blur-md rounded-xl border border-red-500/20" />
          <div className="relative p-4 text-center text-red-300">
            <Code className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm">Unable to load GitHub stats</p>
            <p className="text-xs opacity-75 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const statItems = [
    {
      icon: <Code className="w-6 h-6" />,
      label: 'Repositories',
      value: stats.totalRepos,
      color: 'from-blue-500 to-blue-600',
      formatter: formatNumber
    },
    {
      icon: <Star className="w-6 h-6" />,
      label: 'Stars Earned',
      value: stats.totalStars,
      color: 'from-yellow-500 to-yellow-600',
      formatter: formatNumber
    },
    {
      icon: <GitFork className="w-6 h-6" />,
      label: 'Forks',
      value: stats.totalForks,
      color: 'from-green-500 to-green-600',
      formatter: formatNumber
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      label: 'Languages',
      value: Object.keys(stats.languages).length,
      color: 'from-purple-500 to-purple-600',
      formatter: (v) => v.toString()
    }
  ];

  return (
    <div ref={statsRef} className={`${className}`}>
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {isVisible && statItems.map((item, index) => (
          <StatItem
            key={index}
            icon={item.icon}
            label={item.label}
            value={item.value}
            formatter={item.formatter}
            color={item.color}
          />
        ))}
      </div>

      {/* Last Updated */}
      {showLastUpdated && lastUpdated && (
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-xs text-gray-400">
            <Calendar className="w-3 h-3" />
            <span>
              Updated {new Date(lastUpdated).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default GitHubStats;