'use client';

import { useState, useEffect } from 'react';
import { Button } from '@straydog/ui-components';
import { useAIOrchestrator } from '@straydog/ai-orchestrator';
import { ArrowLeft, TrendingUp, TrendingDown, BarChart3, PieChart, Activity, Users, DollarSign, Target } from 'lucide-react';
import Link from 'next/link';

// Mock data for demonstration
const mockMetrics = {
  revenue: { value: '$2.4M', change: '+12.5%', trend: 'up' },
  clients: { value: '1,247', change: '+8.2%', trend: 'up' },
  satisfaction: { value: '94.2%', change: '+2.1%', trend: 'up' },
  efficiency: { value: '87.5%', change: '-1.3%', trend: 'down' }
};

const mockChartData = [
  { month: 'Jan', revenue: 180000, clients: 95 },
  { month: 'Feb', revenue: 195000, clients: 102 },
  { month: 'Mar', revenue: 210000, clients: 118 },
  { month: 'Apr', revenue: 225000, clients: 125 },
  { month: 'May', revenue: 240000, clients: 134 },
  { month: 'Jun', revenue: 255000, clients: 142 }
];

export default function AnalyticsPage() {
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [aiInsights, setAiInsights] = useState<string>('');
  const { processRequest, isLoading } = useAIOrchestrator();

  const generateAIInsights = async (metric: string) => {
    setSelectedMetric(metric);
    try {
      const response = await processRequest(
        `Analyze the ${metric} trends and provide actionable business insights based on current performance data`,
        'business'
      );
      setAiInsights(response || 'AI analysis in progress...');
    } catch (error) {
      console.error('AI insights error:', error);
      setAiInsights('Unable to generate insights at this time.');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="glass-card m-6 p-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 text-hunter-green-300 hover:text-white transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/services" className="text-hunter-green-300 hover:text-white transition-colors">
              Services
            </Link>
            <Link href="/contact" className="text-hunter-green-300 hover:text-white transition-colors">
              Contact
            </Link>
            <Button variant="outline" size="sm">
              Export Data
            </Button>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">
            Business <span className="gradient-text">Analytics</span>
          </h1>
          <p className="text-hunter-green-200 mb-6">
            AI-powered insights and performance metrics for data-driven decisions
          </p>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div 
              className="glass-card p-6 cursor-pointer hover:bg-white/10 transition-all duration-300"
              onClick={() => generateAIInsights('revenue')}
            >
              <div className="flex items-center justify-between mb-4">
                <DollarSign className="h-8 w-8 text-tech-accent-400" />
                {mockMetrics.revenue.trend === 'up' ? (
                  <TrendingUp className="h-5 w-5 text-green-400" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-400" />
                )}
              </div>
              <h3 className="text-2xl font-bold mb-1">{mockMetrics.revenue.value}</h3>
              <p className="text-sm text-hunter-green-300">Total Revenue</p>
              <p className={`text-sm font-medium ${
                mockMetrics.revenue.trend === 'up' ? 'text-green-400' : 'text-red-400'
              }`}>
                {mockMetrics.revenue.change} from last month
              </p>
            </div>

            <div 
              className="glass-card p-6 cursor-pointer hover:bg-white/10 transition-all duration-300"
              onClick={() => generateAIInsights('clients')}
            >
              <div className="flex items-center justify-between mb-4">
                <Users className="h-8 w-8 text-tech-accent-400" />
                {mockMetrics.clients.trend === 'up' ? (
                  <TrendingUp className="h-5 w-5 text-green-400" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-400" />
                )}
              </div>
              <h3 className="text-2xl font-bold mb-1">{mockMetrics.clients.value}</h3>
              <p className="text-sm text-hunter-green-300">Active Clients</p>
              <p className={`text-sm font-medium ${
                mockMetrics.clients.trend === 'up' ? 'text-green-400' : 'text-red-400'
              }`}>
                {mockMetrics.clients.change} from last month
              </p>
            </div>

            <div 
              className="glass-card p-6 cursor-pointer hover:bg-white/10 transition-all duration-300"
              onClick={() => generateAIInsights('satisfaction')}
            >
              <div className="flex items-center justify-between mb-4">
                <Target className="h-8 w-8 text-tech-accent-400" />
                {mockMetrics.satisfaction.trend === 'up' ? (
                  <TrendingUp className="h-5 w-5 text-green-400" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-400" />
                )}
              </div>
              <h3 className="text-2xl font-bold mb-1">{mockMetrics.satisfaction.value}</h3>
              <p className="text-sm text-hunter-green-300">Client Satisfaction</p>
              <p className={`text-sm font-medium ${
                mockMetrics.satisfaction.trend === 'up' ? 'text-green-400' : 'text-red-400'
              }`}>
                {mockMetrics.satisfaction.change} from last month
              </p>
            </div>

            <div 
              className="glass-card p-6 cursor-pointer hover:bg-white/10 transition-all duration-300"
              onClick={() => generateAIInsights('efficiency')}
            >
              <div className="flex items-center justify-between mb-4">
                <Activity className="h-8 w-8 text-tech-accent-400" />
                {mockMetrics.efficiency.trend === 'up' ? (
                  <TrendingUp className="h-5 w-5 text-green-400" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-400" />
                )}
              </div>
              <h3 className="text-2xl font-bold mb-1">{mockMetrics.efficiency.value}</h3>
              <p className="text-sm text-hunter-green-300">Operational Efficiency</p>
              <p className={`text-sm font-medium ${
                mockMetrics.efficiency.trend === 'up' ? 'text-green-400' : 'text-red-400'
              }`}>
                {mockMetrics.efficiency.change} from last month
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Charts and AI Insights */}
      <section className="px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Revenue Chart */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-tech-accent-400" />
                  Revenue Trends
                </h3>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
              <div className="h-64 flex items-end justify-between space-x-2">
                {mockChartData.map((data, index) => (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div 
                      className="bg-gradient-to-t from-tech-accent-500 to-tech-accent-300 rounded-t w-full transition-all duration-500 hover:opacity-80"
                      style={{ height: `${(data.revenue / 255000) * 200}px` }}
                    ></div>
                    <span className="text-xs text-hunter-green-300 mt-2">{data.month}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Insights Panel */}
            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <PieChart className="h-5 w-5 mr-2 text-tech-accent-400" />
                AI Insights
              </h3>
              {selectedMetric ? (
                <div className="space-y-4">
                  <div className="p-3 bg-tech-accent-500/20 rounded-lg border border-tech-accent-400/30">
                    <p className="text-sm text-tech-accent-300 mb-2">
                      Analyzing {selectedMetric} trends...
                    </p>
                    {isLoading ? (
                      <div className="animate-pulse">
                        <div className="h-4 bg-hunter-green-600 rounded mb-2"></div>
                        <div className="h-4 bg-hunter-green-600 rounded w-3/4"></div>
                      </div>
                    ) : (
                      <p className="text-hunter-green-100">
                        {aiInsights || 'Click on any metric above to get AI-powered insights and recommendations.'}
                      </p>
                    )}
                  </div>
                  <Button 
                    className="glass-button w-full"
                    onClick={() => generateAIInsights(selectedMetric)}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Generating Insights...' : 'Refresh Analysis'}
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-hunter-green-400 mx-auto mb-4" />
                  <p className="text-hunter-green-300">
                    Click on any metric above to get AI-powered insights and recommendations.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Performance Summary */}
      <section className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="glass-card p-8">
            <h3 className="text-2xl font-semibold mb-6 gradient-text">
              Performance Summary
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-tech-accent-400 mb-2">98.5%</div>
                <p className="text-hunter-green-300">System Uptime</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-tech-accent-400 mb-2">2.3s</div>
                <p className="text-hunter-green-300">Avg Response Time</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-tech-accent-400 mb-2">99.2%</div>
                <p className="text-hunter-green-300">AI Accuracy Rate</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}