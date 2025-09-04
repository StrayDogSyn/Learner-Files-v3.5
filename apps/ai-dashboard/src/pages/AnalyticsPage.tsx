import React, { useState } from 'react';
import { Card, Button, Badge } from '@straydog/ui-components';
import { useAnalytics, useRealTimeMetrics } from '@straydog/ai-orchestrator';
import {
  BarChart3,
  TrendingUp,
  Activity,
  Users,
  Clock,
  AlertTriangle,
  Download,
  RefreshCw,
  Play,
  Pause,
  Filter,
  Calendar
} from 'lucide-react';

interface TimeFilter {
  label: string;
  value: number; // hours
}

const timeFilters: TimeFilter[] = [
  { label: 'Last Hour', value: 1 },
  { label: 'Last 6 Hours', value: 6 },
  { label: 'Last 24 Hours', value: 24 },
  { label: 'Last 7 Days', value: 168 },
  { label: 'Last 30 Days', value: 720 }
];

export const AnalyticsPage: React.FC = () => {
  const [selectedTimeFilter, setSelectedTimeFilter] = useState<TimeFilter>(timeFilters[2]);
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  
  const { 
    metrics, 
    domainMetrics, 
    getEvents, 
    exportData, 
    // clearData - removed unused variable 
  } = useAnalytics();
  
  const { 
    metrics: realTimeMetrics, 
    isLive, 
    toggleLive 
  } = useRealTimeMetrics(2000);

  // Filter events based on selected time and domain
  const filteredEvents = getEvents({
    domain: selectedDomain === 'all' ? undefined : selectedDomain,
    since: Date.now() - (selectedTimeFilter.value * 60 * 60 * 1000),
    limit: 100
  });

  const handleExportData = () => {
    const data = exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const currentMetrics = realTimeMetrics || metrics;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
            <p className="text-gray-400">Real-time insights into AI orchestrator performance</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLive}
              className="flex items-center space-x-2"
            >
              {isLive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isLive ? 'Pause' : 'Resume'} Live</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportData}
              className="flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card variant="default" className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-400">Time Range:</span>
              </div>
              <div className="flex space-x-2">
                {timeFilters.map((filter) => (
                  <Button
                    key={filter.value}
                    variant={selectedTimeFilter.value === filter.value ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedTimeFilter(filter)}
                  >
                    {filter.label}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-400">Domain:</span>
              </div>
              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                aria-label="Filter analytics by domain"
                className="bg-slate-800 border border-slate-600 rounded-md px-3 py-1 text-white text-sm"
              >
                <option value="all">All Domains</option>
                {domainMetrics.map((domain) => (
                  <option key={domain.domain} value={domain.domain}>
                    {domain.domain.charAt(0).toUpperCase() + domain.domain.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {/* Key Metrics */}
        {currentMetrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card variant="default" className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Requests</p>
                  <p className="text-2xl font-bold text-white">
                    {currentMetrics.totalRequests.toLocaleString()}
                  </p>
                  {isLive && (
                    <div className="flex items-center mt-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2" />
                      <span className="text-xs text-green-400">Live</span>
                    </div>
                  )}
                </div>
                <Activity className="w-8 h-8 text-blue-400" />
              </div>
            </Card>

            <Card variant="default" className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Success Rate</p>
                  <p className="text-2xl font-bold text-white">
                    {((currentMetrics.successfulRequests / currentMetrics.totalRequests) * 100).toFixed(1)}%
                  </p>
                  <Badge 
                    variant={((currentMetrics.successfulRequests / currentMetrics.totalRequests) * 100) >= 95 ? 'success' : 
                            ((currentMetrics.successfulRequests / currentMetrics.totalRequests) * 100) >= 90 ? 'warning' : 'error'}
                    className="mt-1"
                  >
                    {((currentMetrics.successfulRequests / currentMetrics.totalRequests) * 100) >= 95 ? 'Excellent' : 
                     ((currentMetrics.successfulRequests / currentMetrics.totalRequests) * 100) >= 90 ? 'Good' : 'Needs Attention'}
                  </Badge>
                </div>
                <TrendingUp className="w-8 h-8 text-green-400" />
              </div>
            </Card>

            <Card variant="default" className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Avg Response Time</p>
                  <p className="text-2xl font-bold text-white">
                    {currentMetrics.averageResponseTime.toFixed(0)}ms
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Peak: {currentMetrics.peakRequestTime ? new Date(currentMetrics.peakRequestTime).toLocaleTimeString() : 'N/A'}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-yellow-400" />
              </div>
            </Card>

            <Card variant="default" className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Active Users</p>
                  <p className="text-2xl font-bold text-white">
                    {currentMetrics.totalRequests}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {Math.round(currentMetrics.totalRequests / 24)} req/hr
                  </p>
                </div>
                <Users className="w-8 h-8 text-purple-400" />
              </div>
            </Card>
          </div>
        )}

        {/* Domain Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card variant="default" className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Domain Performance</h3>
              <BarChart3 className="w-5 h-5 text-blue-400" />
            </div>
            
            <div className="space-y-4">
              {domainMetrics.map((domain) => {
                const successRate = domain.totalRequests > 0 
                  ? (domain.successRate) 
                  : 0;
                
                return (
                  <div key={domain.domain} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-white capitalize">
                        {domain.domain}
                      </span>
                      <div className="flex items-center space-x-3">
                        <span className="text-xs text-gray-400">
                          {domain.totalRequests} requests
                        </span>
                        <Badge 
                          variant={successRate >= 95 ? 'success' : 
                                  successRate >= 90 ? 'warning' : 'destructive'}
                          size="sm"
                        >
                          {successRate.toFixed(1)}%
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div 
                        className="domain-progress-bar"
                        style={{ 
                          width: `${Math.max(5, (domain.totalRequests / Math.max(...domainMetrics.map(d => d.totalRequests))) * 100)}%` 
                        }}
                      />
                    </div>
                    
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Avg: {domain.averageResponseTime.toFixed(0)}ms</span>
                      <span>Success: {domain.successRate.toFixed(1)}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Recent Activity */}
          <Card variant="default" className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
              <div className="flex items-center space-x-2">
                <RefreshCw className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-400">
                  {filteredEvents.length} events
                </span>
              </div>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredEvents.slice(0, 20).map((event) => (
                <div key={event.id} className="flex items-start space-x-3 p-3 bg-slate-800/50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    event.type === 'ai_request' ? 'bg-blue-400' :
                    event.type === 'ai_response' ? 'bg-green-400' :
                    event.type === 'domain_switch' ? 'bg-purple-400' :
                    event.type === 'error' ? 'bg-red-400' :
                    'bg-yellow-400'
                  }`} />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-white capitalize">
                        {event.type.replace('_', ' ')}
                      </p>
                      <span className="text-xs text-gray-400">
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    
                    <p className="text-xs text-gray-400 capitalize">
                      Domain: {event.domain}
                    </p>
                    
                    {event.type === 'error' && (
                      <div className="flex items-center mt-1">
                        <AlertTriangle className="w-3 h-3 text-red-400 mr-1" />
                        <span className="text-xs text-red-400">
                          {event.data?.error || 'Unknown error'}
                        </span>
                      </div>
                    )}
                    
                    {event.type === 'ai_response' && event.data?.responseTime && (
                      <span className="text-xs text-green-400">
                        {event.data.responseTime}ms
                      </span>
                    )}
                  </div>
                </div>
              ))}
              
              {filteredEvents.length === 0 && (
                <div className="text-center py-8">
                  <Activity className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">No activity in selected time range</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* System Health */}
        {currentMetrics && (
          <Card variant="default" className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">System Health</h3>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  ((currentMetrics.successfulRequests / currentMetrics.totalRequests) * 100) >= 99 ? 'bg-green-400' :
                  ((currentMetrics.successfulRequests / currentMetrics.totalRequests) * 100) >= 95 ? 'bg-yellow-400' : 'bg-red-400'
                }`} />
                <span className="text-sm text-gray-400">
                  {((currentMetrics.successfulRequests / currentMetrics.totalRequests) * 100).toFixed(2)}% uptime
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">
                  {currentMetrics.failedRequests}
                </p>
                <p className="text-sm text-gray-400">Total Errors</p>
                <div className="mt-2">
                  <Badge 
                    variant={currentMetrics.failedRequests === 0 ? 'success' : 
                            currentMetrics.failedRequests < 10 ? 'warning' : 'destructive'}
                  >
                    {currentMetrics.failedRequests === 0 ? 'Healthy' : 
                     currentMetrics.failedRequests < 10 ? 'Monitor' : 'Critical'}
                  </Badge>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-2xl font-bold text-white">
                  {Object.keys(currentMetrics.requestsPerDomain).length}
                </p>
                <p className="text-sm text-gray-400">Domain Switches</p>
                <p className="text-xs text-gray-400 mt-1">
                  Last: {currentMetrics.lastUpdated ? 
                    new Date(currentMetrics.lastUpdated).toLocaleString() : 'N/A'
                  }
                </p>
              </div>
              
              <div className="text-center">
                <p className="text-2xl font-bold text-white">
                  {Math.round(currentMetrics.totalRequests / 24) || 0}
                </p>
                <p className="text-sm text-gray-400">Requests/Hour</p>
                <p className="text-xs text-gray-400 mt-1">
                  Peak: {currentMetrics.peakRequestTime ? new Date(currentMetrics.peakRequestTime).toLocaleTimeString() : 'N/A'}
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};