// AI Metrics Display Component with Glassmorphic Design

import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Zap, Clock, Target, Activity, RefreshCw } from 'lucide-react';
import { strayDogAI } from '../../ai';
import { DomainType } from '../../shared/types/ai';

interface MetricCard {
  title: string;
  value: string | number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: React.ReactNode;
  color: string;
  description?: string;
}

interface DomainMetrics {
  domain: DomainType;
  requests: number;
  avgResponseTime: number;
  successRate: number;
  topFeatures: string[];
}

interface AIMetricsDisplayProps {
  className?: string;
  timeRange?: '1h' | '24h' | '7d' | '30d';
  showDomainBreakdown?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

const timeRangeLabels = {
  '1h': 'Last Hour',
  '24h': 'Last 24 Hours',
  '7d': 'Last 7 Days',
  '30d': 'Last 30 Days'
};

const domainColors = {
  corporate: 'from-emerald-500 to-green-600',
  technical: 'from-blue-500 to-cyan-600',
  business: 'from-purple-500 to-violet-600',
  justice: 'from-amber-500 to-orange-600'
};

export const AIMetricsDisplay: React.FC<AIMetricsDisplayProps> = ({
  className = '',
  timeRange = '24h',
  showDomainBreakdown = true,
  autoRefresh = true,
  refreshInterval = 60000
}) => {
  const [metrics, setMetrics] = useState<MetricCard[]>([]);
  const [domainMetrics, setDomainMetrics] = useState<DomainMetrics[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange);

  const fetchMetrics = async () => {
    try {
      setIsLoading(true);
      
      // Fetch analytics data from the AI system
      const analytics = await strayDogAI.getAnalytics();
      
      // Calculate metrics based on timeRange (using mock data for now)
      const totalRequests = Math.floor(Math.random() * 10000) + 5000;
      const avgResponseTime = Math.floor(Math.random() * 200) + 150;
      const successRate = 0.95 + Math.random() * 0.05;
      const activeUsers = Math.floor(Math.random() * 500) + 100;
      
      const metricsData: MetricCard[] = [
        {
          title: 'Total Requests',
          value: totalRequests.toLocaleString(),
          change: 12.5,
          changeType: 'increase',
          icon: <Zap className="w-5 h-5" />,
          color: 'from-emerald-500 to-green-600',
          description: `AI requests in ${timeRangeLabels[selectedTimeRange].toLowerCase()}`
        },
        {
          title: 'Avg Response Time',
          value: `${avgResponseTime}ms`,
          change: -8.2,
          changeType: 'decrease',
          icon: <Clock className="w-5 h-5" />,
          color: 'from-blue-500 to-cyan-600',
          description: 'Average API response time'
        },
        {
          title: 'Success Rate',
          value: `${(successRate * 100).toFixed(1)}%`,
          change: 2.1,
          changeType: 'increase',
          icon: <Target className="w-5 h-5" />,
          color: 'from-purple-500 to-violet-600',
          description: 'Successful AI responses'
        },
        {
          title: 'Active Users',
          value: activeUsers.toLocaleString(),
          change: 15.7,
          changeType: 'increase',
          icon: <Users className="w-5 h-5" />,
          color: 'from-amber-500 to-orange-600',
          description: 'Users with active sessions'
        }
      ];
      
      setMetrics(metricsData);
      
      // Fetch domain-specific metrics
      if (showDomainBreakdown) {
        const domains: DomainType[] = ['corporate', 'technical', 'business', 'justice'];
        const domainData: DomainMetrics[] = [];
        
        const analytics = await strayDogAI.getAnalytics('user123', 'week');
        
        for (const domain of domains) {
          domainData.push({
            domain,
            requests: Math.floor(Math.random() * 1000),
            avgResponseTime: Math.floor(Math.random() * 500) + 200,
            successRate: 0.95 + Math.random() * 0.05,
            topFeatures: ['Feature 1', 'Feature 2', 'Feature 3']
          });
        }
        
        setDomainMetrics(domainData);
      }
      
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    
    if (autoRefresh) {
      const interval = setInterval(fetchMetrics, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [selectedTimeRange, autoRefresh, refreshInterval]);

  const getChangeColor = (changeType: 'increase' | 'decrease' | 'neutral') => {
    switch (changeType) {
      case 'increase': return 'text-emerald-400';
      case 'decrease': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getChangeIcon = (changeType: 'increase' | 'decrease' | 'neutral') => {
    if (changeType === 'increase') return '↗';
    if (changeType === 'decrease') return '↘';
    return '→';
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">AI Performance Metrics</h2>
          <p className="text-emerald-300/70">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Time Range Selector */}
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value as typeof timeRange)}
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {Object.entries(timeRangeLabels).map(([value, label]) => (
              <option key={value} value={value} className="bg-gray-800">
                {label}
              </option>
            ))}
          </select>
          
          {/* Refresh Button */}
          <button
            onClick={fetchMetrics}
            disabled={isLoading}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-200 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 text-white ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg bg-gradient-to-br ${metric.color}`}>
                {metric.icon}
              </div>
              <div className={`flex items-center gap-1 text-sm ${getChangeColor(metric.changeType)}`}>
                <span>{getChangeIcon(metric.changeType)}</span>
                <span>{Math.abs(metric.change)}%</span>
              </div>
            </div>
            
            <div className="mb-2">
              <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
              <div className="text-sm font-medium text-emerald-300">{metric.title}</div>
            </div>
            
            {metric.description && (
              <div className="text-xs text-emerald-300/70">{metric.description}</div>
            )}
          </div>
        ))}
      </div>

      {/* Domain Breakdown */}
      {showDomainBreakdown && domainMetrics.length > 0 && (
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-6 h-6 text-emerald-400" />
            <h3 className="text-xl font-semibold text-white">Domain Performance</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {domainMetrics.map((domain, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${domainColors[domain.domain]}`} />
                  <h4 className="font-semibold text-white capitalize">{domain.domain}</h4>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-emerald-300/70">Requests</span>
                    <span className="text-sm font-medium text-white">{domain.requests.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-emerald-300/70">Avg Time</span>
                    <span className="text-sm font-medium text-white">{domain.avgResponseTime}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-emerald-300/70">Success Rate</span>
                    <span className="text-sm font-medium text-white">{(domain.successRate * 100).toFixed(1)}%</span>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-3">
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full bg-gradient-to-r ${domainColors[domain.domain]}`}
                      style={{ width: `${domain.successRate * 100}%` }}
                    />
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

export default AIMetricsDisplay;