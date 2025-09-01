import React, { useState, useEffect } from 'react';
import { CoordinationSystem } from './CoordinationSystem';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { Domain, Task, Agent } from './types';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  CheckCircle,
  Clock,
  Cpu,
  Database,
  Globe,
  Heart,
  Play,
  Pause,
  RotateCcw,
  Settings,
  TrendingUp,
  Users,
  Zap
} from 'lucide-react';

interface CoordinationDashboardProps {
  className?: string;
}

export const CoordinationDashboard: React.FC<CoordinationDashboardProps> = ({ className = '' }) => {
  const [coordinationSystem] = useState(() => new CoordinationSystem());
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'domains' | 'tasks' | 'agents' | 'analytics'>('overview');
  const [systemStatus, setSystemStatus] = useState<'initializing' | 'running' | 'paused' | 'error'>('initializing');
  const [domains, setDomains] = useState<Domain[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);

  useEffect(() => {
    const initializeSystem = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('[CoordinationDashboard] Initializing coordination system...');
        await coordinationSystem.initialize();
        
        setIsInitialized(true);
        setSystemStatus('running');
        
        // Load initial data
        setDomains(coordinationSystem.getDomains());
        setTasks(coordinationSystem.getTasks());
        setAgents(coordinationSystem.getAgents());
        
        console.log('[CoordinationDashboard] System initialized successfully');
      } catch (err) {
        console.error('[CoordinationDashboard] Initialization failed:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize coordination system');
        setSystemStatus('error');
      } finally {
        setIsLoading(false);
      }
    };

    initializeSystem();

    // Set up event listeners
    const handleSystemUpdate = () => {
      setDomains(coordinationSystem.getDomains());
      setTasks(coordinationSystem.getTasks());
      setAgents(coordinationSystem.getAgents());
    };

    const handleSystemError = (data: { error: Error }) => {
      console.error('[CoordinationDashboard] System error:', data.error);
      setError(data.error.message);
      setSystemStatus('error');
    };

    coordinationSystem.on('system:updated', handleSystemUpdate);
    coordinationSystem.on('system:error', handleSystemError);

    return () => {
      coordinationSystem.off('system:updated', handleSystemUpdate);
      coordinationSystem.off('system:error', handleSystemError);
    };
  }, [coordinationSystem]);

  const handleSystemControl = async (action: 'start' | 'pause' | 'restart') => {
    try {
      switch (action) {
        case 'start':
          if (!isInitialized) {
            await coordinationSystem.initialize();
            setIsInitialized(true);
          }
          setSystemStatus('running');
          break;
        case 'pause':
          setSystemStatus('paused');
          break;
        case 'restart':
          setSystemStatus('initializing');
          await coordinationSystem.initialize();
          setSystemStatus('running');
          break;
      }
      setError(null);
    } catch (err) {
      console.error(`[CoordinationDashboard] ${action} failed:`, err);
      setError(err instanceof Error ? err.message : `Failed to ${action} system`);
      setSystemStatus('error');
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'running': return 'text-green-600';
      case 'paused': return 'text-yellow-600';
      case 'initializing': return 'text-blue-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <Play className="h-4 w-4" />;
      case 'paused': return <Pause className="h-4 w-4" />;
      case 'initializing': return <RotateCcw className="h-4 w-4 animate-spin" />;
      case 'error': return <AlertTriangle className="h-4 w-4" />;
      default: return <Settings className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen bg-gray-50 flex items-center justify-center ${className}`}>
        <div className="text-center">
          <RotateCcw className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Initializing Coordination System</h2>
          <p className="text-gray-600">Setting up multi-domain orchestration...</p>
        </div>
      </div>
    );
  }

  if (error && !isInitialized) {
    return (
      <div className={`min-h-screen bg-gray-50 flex items-center justify-center ${className}`}>
        <div className="text-center max-w-md">
          <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">System Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => handleSystemControl('restart')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry Initialization
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Zap className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Multi-Domain Coordination System</h1>
                <p className="text-sm text-gray-600">Portfolio Ecosystem Management</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* System Status */}
              <div className="flex items-center space-x-2">
                <div className={`flex items-center space-x-1 ${getStatusColor(systemStatus)}`}>
                  {getStatusIcon(systemStatus)}
                  <span className="text-sm font-medium capitalize">{systemStatus}</span>
                </div>
              </div>
              
              {/* System Controls */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleSystemControl('start')}
                  disabled={systemStatus === 'running'}
                  className="p-2 text-green-600 hover:bg-green-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Start System"
                >
                  <Play className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleSystemControl('pause')}
                  disabled={systemStatus !== 'running'}
                  className="p-2 text-yellow-600 hover:bg-yellow-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Pause System"
                >
                  <Pause className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleSystemControl('restart')}
                  className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                  title="Restart System"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'domains', label: 'Domains', icon: Database },
              { id: 'tasks', label: 'Tasks', icon: Clock },
              { id: 'agents', label: 'Agents', icon: Users },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-4 mt-4 rounded-r-lg">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
            <div>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Domains</p>
                    <p className="text-2xl font-bold text-blue-600">{domains.length}</p>
                  </div>
                  <Database className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Tasks</p>
                    <p className="text-2xl font-bold text-green-600">
                      {tasks.filter(t => t.status === 'in_progress').length}
                    </p>
                  </div>
                  <Activity className="h-8 w-8 text-green-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Available Agents</p>
                    <p className="text-2xl font-bold text-purple-600">{agents.length}</p>
                  </div>
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">System Health</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {coordinationSystem.getMetrics().systemHealth}%
                    </p>
                  </div>
                  <Heart className="h-8 w-8 text-orange-600" />
                </div>
              </div>
            </div>
            
            {/* Quick Status */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Domains</h4>
                  <div className="space-y-1">
                    {domains.slice(0, 3).map(domain => (
                      <div key={domain.id} className="flex items-center justify-between text-sm">
                        <span>{domain.name}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          domain.status === 'active' ? 'bg-green-100 text-green-800' :
                          domain.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {domain.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Recent Tasks</h4>
                  <div className="space-y-1">
                    {tasks.slice(0, 3).map(task => (
                      <div key={task.id} className="flex items-center justify-between text-sm">
                        <span className="truncate">{task.title}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          task.status === 'completed' ? 'bg-green-100 text-green-800' :
                          task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                          task.status === 'failed' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {task.status.replace('_', ' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Agent Status</h4>
                  <div className="space-y-1">
                    {agents.slice(0, 3).map(agent => (
                      <div key={agent.id} className="flex items-center justify-between text-sm">
                        <span>{agent.name}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          agent.status === 'active' ? 'bg-green-100 text-green-800' :
                          agent.status === 'idle' ? 'bg-blue-100 text-blue-800' :
                          agent.status === 'busy' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {agent.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'analytics' && (
          <AnalyticsDashboard coordinationSystem={coordinationSystem} />
        )}
        
        {activeTab === 'domains' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Domain Management</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {domains.map(domain => (
                <div key={domain.id} className="border rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">{domain.name}</h4>
                  <p className="text-sm text-gray-600 mb-3">{domain.description}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        domain.status === 'active' ? 'bg-green-100 text-green-800' :
                        domain.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {domain.status}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Health:</span>
                      <span className={`font-medium ${
                        domain.health >= 70 ? 'text-green-600' :
                        domain.health >= 40 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {domain.health}%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Response Time:</span>
                      <span>{domain.metrics.responseTime}ms</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'tasks' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Management</h3>
            <div className="space-y-4">
              {tasks.map(task => (
                <div key={task.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">{task.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Type: {task.type}</span>
                        <span>Priority: {task.priority}</span>
                        <span>Domain: {task.domainId}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        task.status === 'completed' ? 'bg-green-100 text-green-800' :
                        task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        task.status === 'failed' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {task.status.replace('_', ' ')}
                      </span>
                      <div className="mt-2">
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-600 transition-all duration-300"
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 mt-1">{task.progress}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'agents' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Agent Management</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {agents.map(agent => (
                <div key={agent.id} className="border rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">{agent.name}</h4>
                  <p className="text-sm text-gray-600 mb-3">{agent.description}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        agent.status === 'active' ? 'bg-green-100 text-green-800' :
                        agent.status === 'idle' ? 'bg-blue-100 text-blue-800' :
                        agent.status === 'busy' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {agent.status}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Type:</span>
                      <span className="capitalize">{agent.type}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Success Rate:</span>
                      <span className="font-medium">{agent.performance.successRate.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tasks Completed:</span>
                      <span>{agent.performance.tasksCompleted}</span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-1">Capabilities:</p>
                    <div className="flex flex-wrap gap-1">
                      {agent.capabilities.slice(0, 3).map((capability, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {capability}
                        </span>
                      ))}
                      {agent.capabilities.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          +{agent.capabilities.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoordinationDashboard;