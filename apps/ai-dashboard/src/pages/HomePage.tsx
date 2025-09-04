import React from 'react';
import { Card, Button, Badge } from '@straydog/ui-components';
import { useDomainRouting } from '../hooks/useDomainRouting';
import { useOrchestratorStore, useAnalytics } from '@straydog/ai-orchestrator';
import { AITestPanel } from '../components/AITestPanel';
import { 
  Brain, 
  Building2, 
  Code, 
  GraduationCap, 
  Scale, 
  Activity,
  Users,
  Clock,
  TrendingUp,
  BarChart3,
  Zap,
  MessageSquare,
  ArrowRight
} from 'lucide-react';

const HomePage: React.FC = () => {
  const { navigateToDomain, navigateToRoute } = useDomainRouting();
  const { isInitialized } = useOrchestratorStore();
  const { metrics: analyticsMetrics, domainMetrics } = useAnalytics();
  
  const domains = [
    {
      key: 'corporate',
      title: 'Corporate Solutions',
      description: 'AI-powered business intelligence and automation tools for enterprise operations.',
      icon: Building2,
      color: '#2D5016',
      accent: '#4A7C59',
      stats: {
        activeUsers: 1247,
        completedTasks: 8934,
        efficiency: 94.2
      }
    },
    {
      key: 'technical',
      title: 'Technical Infrastructure',
      description: 'Advanced AI systems for code analysis, system optimization, and technical support.',
      icon: Code,
      color: '#4A7C59',
      accent: '#6B8E23',
      stats: {
        activeUsers: 892,
        completedTasks: 12456,
        efficiency: 97.8
      }
    },
    {
      key: 'educational',
      title: 'Educational Platform',
      description: 'Personalized learning experiences and educational content generation.',
      icon: GraduationCap,
      color: '#6B8E23',
      accent: '#8FBC8F',
      stats: {
        activeUsers: 2341,
        completedTasks: 15678,
        efficiency: 91.5
      }
    },
    {
      key: 'justice-reform',
      title: 'Justice Reform',
      description: 'AI-driven insights for criminal justice reform and policy analysis.',
      icon: Scale,
      color: '#8FBC8F',
      accent: '#9cc954',
      stats: {
        activeUsers: 567,
        completedTasks: 3421,
        efficiency: 89.3
      }
    }
  ] as const;

  const overallMetrics = {
    totalRequests: analyticsMetrics?.totalRequests || 0,
    averageResponseTime: analyticsMetrics?.averageResponseTime || 0,
    successRate: analyticsMetrics ? ((analyticsMetrics.successfulRequests / analyticsMetrics.totalRequests) * 100) : 0,
    activeConnections: 1247
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">
          StrayDog AI Justice Reform Ecosystem
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Empowering justice reform through intelligent AI solutions across corporate, 
          technical, educational, and justice domains.
        </p>
        
        {/* Connection Status */}
        <div className="flex items-center justify-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${
            isInitialized ? 'bg-green-400' : 'bg-red-400'
          }`} />
          <span className="text-sm text-gray-300">
            AI Orchestrator {isInitialized ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      {/* Overall Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card variant="default" className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Requests</p>
              <p className="text-2xl font-bold text-white">
                {(analyticsMetrics?.totalRequests || overallMetrics.totalRequests).toLocaleString()}
              </p>
            </div>
            <MessageSquare className="w-8 h-8 text-blue-400" />
          </div>
        </Card>

        <Card variant="default" className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Avg Response Time</p>
              <p className="text-2xl font-bold text-white">
                {analyticsMetrics?.averageResponseTime?.toFixed(0) || overallMetrics.averageResponseTime}ms
              </p>
            </div>
            <Clock className="w-8 h-8 text-green-400" />
          </div>
        </Card>

        <Card variant="default" className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Success Rate</p>
              <p className="text-2xl font-bold text-white">
                {analyticsMetrics ? ((analyticsMetrics.successfulRequests / analyticsMetrics.totalRequests) * 100).toFixed(1) : overallMetrics.successRate.toFixed(1)}%
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-emerald-400" />
          </div>
        </Card>

        <Card variant="default" className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Active Users</p>
              <p className="text-2xl font-bold text-white">
                {overallMetrics.activeConnections}
              </p>
            </div>
            <Users className="w-8 h-8 text-purple-400" />
          </div>
        </Card>
      </div>

      {/* Real-time Analytics */}
      {analyticsMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="default" className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Performance</h3>
              <Zap className="w-5 h-5 text-orange-400" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Errors</span>
                <span className="text-sm font-medium text-white">{analyticsMetrics.failedRequests}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Peak Response</span>
                <span className="text-sm font-medium text-white">{analyticsMetrics.peakRequestTime ? new Date(analyticsMetrics.peakRequestTime).toLocaleTimeString() : 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Uptime</span>
                <span className="text-sm font-medium text-white">{((analyticsMetrics.successfulRequests / analyticsMetrics.totalRequests) * 100).toFixed(1)}%</span>
              </div>
            </div>
          </Card>

          <Card variant="default" className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Activity</h3>
              <BarChart3 className="w-5 h-5 text-blue-400" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Requests/Hour</span>
                <span className="text-sm font-medium text-white">{Math.round(analyticsMetrics.totalRequests / 24)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Domain Switches</span>
                <span className="text-sm font-medium text-white">{Object.keys(analyticsMetrics.requestsPerDomain).length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Last Activity</span>
                <span className="text-sm font-medium text-white">
                  {analyticsMetrics.lastUpdated ? 
                    new Date(analyticsMetrics.lastUpdated).toLocaleTimeString() : 'N/A'
                  }
                </span>
              </div>
            </div>
          </Card>

          <Card variant="default" className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Top Domain</h3>
              <Brain className="w-5 h-5 text-purple-400" />
            </div>
            <div className="space-y-3">
              {domainMetrics.slice(0, 3).map((domain, index) => (
                <div key={domain.domain} className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      index === 0 ? 'bg-green-400' : 
                      index === 1 ? 'bg-yellow-400' : 'bg-red-400'
                    }`} />
                    <span className="text-sm text-gray-400 capitalize">{domain.domain}</span>
                  </div>
                  <span className="text-sm font-medium text-white">{domain.totalRequests}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Domain Cards */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">AI Domains</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {domains.map((domain) => {
            const Icon = domain.icon;
            
            return (
              <Card 
                key={domain.key}
                variant="default" 
                className="p-6 hover:bg-white/15 transition-all duration-300 cursor-pointer group"
                onClick={() => navigateToDomain(domain.key as 'corporate' | 'technical' | 'educational' | 'justice-reform')}
              >
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600"
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">
                          {domain.title}
                        </h3>
                        <Badge 
                          variant="default" 
                          className="mt-1 text-blue-400"
                        >
                          {domain.key}
                        </Badge>
                      </div>
                    </div>
                    
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all duration-200" />
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 leading-relaxed">
                    {domain.description}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
                    <div className="text-center">
                      <p className="text-lg font-semibold text-white">
                        {domain.stats.activeUsers.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-400">Active Users</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold text-white">
                        {domain.stats.completedTasks.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-400">Tasks Completed</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold text-blue-400">
                        {domain.stats.efficiency}%
                      </p>
                      <p className="text-xs text-gray-400">Efficiency</p>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* AI Test Panel */}
      <AITestPanel />

      {/* Quick Actions */}
      <Card variant="default" className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">Quick Actions</h3>
          <Activity className="w-5 h-5 text-gray-400" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button 
            variant="default" 
            domain="corporate"
            className="h-auto p-4 flex-col space-y-2"
            onClick={() => navigateToRoute('/corporate/analytics')}
          >
            <TrendingUp className="w-6 h-6" />
            <span className="text-sm">View Analytics</span>
          </Button>
          
          <Button 
            variant="default" 
            domain="technical"
            className="h-auto p-4 flex-col space-y-2"
            onClick={() => navigateToRoute('/technical/monitoring')}
          >
            <Activity className="w-6 h-6" />
            <span className="text-sm">System Monitor</span>
          </Button>
          
          <Button 
            variant="default" 
            domain="educational"
            className="h-auto p-4 flex-col space-y-2"
            onClick={() => navigateToRoute('/educational/courses')}
          >
            <GraduationCap className="w-6 h-6" />
            <span className="text-sm">Browse Courses</span>
          </Button>
          
          <Button 
            variant="default" 
            domain="justice-reform"
            className="h-auto p-4 flex-col space-y-2"
            onClick={() => navigateToRoute('/justice-reform/insights')}
          >
            <Scale className="w-6 h-6" />
            <span className="text-sm">Policy Insights</span>
          </Button>
        </div>
      </Card>
    </div>
  );
};

export { HomePage };