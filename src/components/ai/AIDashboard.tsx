// AI Dashboard Component with Glassmorphic Design

import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Sparkles, 
  Zap, 
  Scale, 
  TrendingUp, 
  Users, 
  Clock, 
  Activity,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Loader2
} from 'lucide-react';
import { strayDogAI } from '../../ai';
import { DomainType, UserRole, RateLimitTier } from '../../shared/types/ai';

interface DashboardProps {
  userId: string;
  userRole?: UserRole;
  tier?: RateLimitTier;
  className?: string;
}

interface DomainStats {
  domain: DomainType;
  requests: number;
  successRate: number;
  avgResponseTime: number;
  trend: 'up' | 'down' | 'stable';
}

interface SystemHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  services: Record<string, boolean>;
  timestamp: Date;
}

export const AIDashboard: React.FC<DashboardProps> = ({
  userId,
  userRole = 'user',
  tier = 'basic',
  className = ''
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [domainStats, setDomainStats] = useState<DomainStats[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [rateLimitStatus, setRateLimitStatus] = useState<any>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'day' | 'week' | 'month' | 'quarter'>('week');

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [selectedTimeframe]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Initialize AI if needed
      await strayDogAI.initialize();

      // Load all dashboard data in parallel
      const [health, analyticsData, rateLimit] = await Promise.all([
        strayDogAI.healthCheck(),
        strayDogAI.getAnalytics(userId, selectedTimeframe),
        strayDogAI.getRateLimitStatus(userId, tier as RateLimitTier)
      ]);

      setSystemHealth(health);
      setAnalytics(analyticsData);
      setRateLimitStatus(rateLimit);

      // Generate mock domain stats (in real implementation, this would come from analytics)
      const mockDomainStats: DomainStats[] = [
        {
          domain: 'corporate',
          requests: 145,
          successRate: 98.5,
          avgResponseTime: 1200,
          trend: 'up'
        },
        {
          domain: 'technical',
          requests: 89,
          successRate: 96.2,
          avgResponseTime: 1800,
          trend: 'stable'
        },
        {
          domain: 'business',
          requests: 203,
          successRate: 99.1,
          avgResponseTime: 950,
          trend: 'up'
        },
        {
          domain: 'justice',
          requests: 67,
          successRate: 97.8,
          avgResponseTime: 1400,
          trend: 'down'
        }
      ];
      setDomainStats(mockDomainStats);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDomainIcon = (domain: DomainType) => {
    switch (domain) {
      case 'corporate':
        return <Sparkles className="w-5 h-5" />;
      case 'technical':
        return <Brain className="w-5 h-5" />;
      case 'business':
        return <Zap className="w-5 h-5" />;
      case 'justice':
        return <Scale className="w-5 h-5" />;
      default:
        return <Activity className="w-5 h-5" />;
    }
  };

  const getDomainColor = (domain: DomainType): string => {
    switch (domain) {
      case 'corporate':
        return 'from-emerald-500 to-green-600';
      case 'technical':
        return 'from-blue-500 to-cyan-600';
      case 'business':
        return 'from-purple-500 to-violet-600';
      case 'justice':
        return 'from-amber-500 to-orange-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <ArrowUpRight className="w-4 h-4 text-green-400" />;
      case 'down':
        return <ArrowDownRight className="w-4 h-4 text-red-400" />;
      default:
        return <div className="w-4 h-4 rounded-full bg-yellow-400" />;
    }
  };

  const getHealthStatusColor = (status: string): string => {
    switch (status) {
      case 'healthy':
        return 'text-green-400';
      case 'degraded':
        return 'text-yellow-400';
      case 'unhealthy':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center h-96 ${className}`}>
        <div className="flex items-center gap-3 text-emerald-300">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading AI Dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">AI Ecosystem Dashboard</h2>
          <p className="text-emerald-300/70">Monitor and manage your AI-powered domains</p>
        </div>
        
        {/* Timeframe Selector */}
        <div className="flex items-center gap-2">
          {(['day', 'week', 'month', 'quarter'] as const).map((timeframe) => (
            <button
              key={timeframe}
              onClick={() => setSelectedTimeframe(timeframe)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedTimeframe === timeframe
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white/10 text-emerald-300 hover:bg-white/20'
              }`}
            >
              {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* System Health & Rate Limits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* System Health */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-semibold text-white">System Health</h3>
          </div>
          
          {systemHealth && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-emerald-300">Status</span>
                <span className={`font-semibold capitalize ${getHealthStatusColor(systemHealth.status)}`}>
                  {systemHealth.status}
                </span>
              </div>
              
              <div className="space-y-2">
                <span className="text-emerald-300 text-sm">Services</span>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(systemHealth.services).map(([service, isHealthy]) => (
                    <div key={service} className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        isHealthy ? 'bg-green-400' : 'bg-red-400'
                      }`} />
                      <span className="text-xs text-white/70 capitalize">
                        {service.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Rate Limits */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-semibold text-white">Rate Limits</h3>
          </div>
          
          {rateLimitStatus && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-emerald-300">Tier</span>
                <span className="font-semibold text-white capitalize">{rateLimitStatus.tier}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-emerald-300">Remaining</span>
                <span className="font-semibold text-white">{rateLimitStatus.remaining}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-emerald-300">Reset Time</span>
                <span className="font-semibold text-white text-sm">
                  {rateLimitStatus.resetTime.toLocaleTimeString()}
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-3">
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(rateLimitStatus.remaining / 100) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Domain Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {domainStats.map((stat) => (
          <div key={stat.domain} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${getDomainColor(stat.domain)}`}>
                {getDomainIcon(stat.domain)}
              </div>
              {getTrendIcon(stat.trend)}
            </div>
            
            <h3 className="text-lg font-semibold text-white capitalize mb-2">{stat.domain}</h3>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-emerald-300 text-sm">Requests</span>
                <span className="font-semibold text-white">{stat.requests}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-emerald-300 text-sm">Success Rate</span>
                <span className="font-semibold text-white">{stat.successRate}%</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-emerald-300 text-sm">Avg Response</span>
                <span className="font-semibold text-white">{stat.avgResponseTime}ms</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Usage Trends */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-semibold text-white">Usage Trends</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-emerald-300">Total Requests</span>
              <span className="font-semibold text-white">
                {domainStats.reduce((sum, stat) => sum + stat.requests, 0)}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-emerald-300">Average Success Rate</span>
              <span className="font-semibold text-white">
                {(domainStats.reduce((sum, stat) => sum + stat.successRate, 0) / domainStats.length).toFixed(1)}%
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-emerald-300">Most Active Domain</span>
              <span className="font-semibold text-white capitalize">
                {domainStats.reduce((max, stat) => stat.requests > max.requests ? stat : max, domainStats[0])?.domain}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
          </div>
          
          <div className="space-y-3">
            <button className="w-full p-3 rounded-lg bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-500 hover:to-green-600 text-white font-medium transition-all duration-200 transform hover:scale-105">
              Export Analytics
            </button>
            
            <button className="w-full p-3 rounded-lg bg-white/10 hover:bg-white/20 text-emerald-300 font-medium transition-all duration-200 border border-white/20">
              View Detailed Reports
            </button>
            
            <button className="w-full p-3 rounded-lg bg-white/10 hover:bg-white/20 text-emerald-300 font-medium transition-all duration-200 border border-white/20">
              Manage Domains
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIDashboard;