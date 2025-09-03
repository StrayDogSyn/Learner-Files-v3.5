// Enhanced GitHub Stats component with AI capabilities and justice reform metrics

import React, { useState, useEffect } from 'react';
import { Star, GitFork, Code, Calendar, Brain, Scale, Users, TrendingUp } from 'lucide-react';
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

  // Enhanced stats with AI and justice reform focus
  const developmentStats = [
    {
      icon: <Code className="w-6 h-6" />,
      label: 'Tech Projects',
      value: stats.totalRepos,
      color: 'from-blue-500 to-blue-600',
      formatter: formatNumber
    },
    {
      icon: <Star className="w-6 h-6" />,
      label: 'Community Impact',
      value: stats.totalStars,
      color: 'from-yellow-500 to-yellow-600',
      formatter: formatNumber
    },
    {
      icon: <GitFork className="w-6 h-6" />,
      label: 'Collaborations',
      value: stats.totalForks,
      color: 'from-green-500 to-green-600',
      formatter: formatNumber
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      label: 'Tech Stack',
      value: Object.keys(stats.languages).length,
      color: 'from-purple-500 to-purple-600',
      formatter: (v) => `${v}+`
    }
  ];

  // AI & Justice Reform Impact Metrics
  const impactStats = [
    {
      icon: <Brain className="w-6 h-6" />,
      label: 'AI Solutions',
      value: 12,
      color: 'from-hunter-green-500 to-hunter-green-600',
      formatter: (v) => v.toString()
    },
    {
      icon: <Scale className="w-6 h-6" />,
      label: 'Justice Cases',
      value: 847,
      color: 'from-emerald-500 to-emerald-600',
      formatter: formatNumber
    },
    {
      icon: <Users className="w-6 h-6" />,
      label: 'Lives Impacted',
      value: 15420,
      color: 'from-teal-500 to-teal-600',
      formatter: formatNumber
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      label: 'Efficiency Gain',
      value: 340,
      color: 'from-cyan-500 to-cyan-600',
      formatter: (v) => `${v}%`
    }
  ];

  return (
    <div ref={statsRef} className={`${className}`}>
      {/* Development Metrics */}
      <div className="mb-8">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-white mb-2">Development Excellence</h3>
          <p className="text-gray-300 text-sm">Building the future of justice reform technology</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {isVisible && developmentStats.map((item, index) => (
            <StatItem
              key={`dev-${index}`}
              icon={item.icon}
              label={item.label}
              value={item.value}
              formatter={item.formatter}
              color={item.color}
            />
          ))}
        </div>
      </div>

      {/* AI & Justice Reform Impact */}
      <div className="mb-6">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-white mb-2">Justice Reform Impact</h3>
          <p className="text-gray-300 text-sm">Transforming lives through AI-powered solutions</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {isVisible && impactStats.map((item, index) => (
            <StatItem
              key={`impact-${index}`}
              icon={item.icon}
              label={item.label}
              value={item.value}
              formatter={item.formatter}
              color={item.color}
            />
          ))}
        </div>
      </div>

      {/* AI Capabilities Highlight */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-hunter-green-500/10 to-emerald-500/10 backdrop-blur-md rounded-xl border border-hunter-green-500/20" />
        <div className="relative p-6 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-hunter-green-500 to-hunter-green-600 rounded-full">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white">AI-Powered Ecosystem</h4>
              <p className="text-sm text-gray-300">Claude 4.1 Integration • Real-time Analytics • Intelligent Automation</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-hunter-green-400 font-semibold">Smart Case Analysis</div>
              <div className="text-gray-400">AI-driven legal insights</div>
            </div>
            <div className="text-center">
              <div className="text-hunter-green-400 font-semibold">Predictive Modeling</div>
              <div className="text-gray-400">Outcome forecasting</div>
            </div>
            <div className="text-center">
              <div className="text-hunter-green-400 font-semibold">Automated Workflows</div>
              <div className="text-gray-400">Streamlined processes</div>
            </div>
          </div>
        </div>
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