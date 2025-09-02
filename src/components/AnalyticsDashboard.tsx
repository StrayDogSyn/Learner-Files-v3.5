import React, { useState, useEffect } from 'react';
import { CoordinationSystem } from '../coordination/CoordinationSystem';
import { Domain, Task, Agent, SystemHealth, DomainMetrics } from '../types/coordination';
import { Activity, AlertTriangle, CheckCircle, Clock, TrendingUp, Users, Zap } from 'lucide-react';

interface AnalyticsDashboardProps {
  coordinationSystem: CoordinationSystem;
}

interface DashboardMetrics {
  totalTasks: number;
  completedTasks: number;
  activeTasks: number;
  pendingTasks: number;
  activeAgents: number;
  systemHealth: SystemHealth;
  domainStatuses: Record<string, string>;
  repairProgress: number;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ coordinationSystem }) => {
  const mockSystemHealth: SystemHealth = {
    overallStatus: 'healthy',
    overallScore: 85,
    agentUtilization: 75,
    taskThroughput: 12,
    errorRate: 0.02,
    averageResponseTime: 150,
    domainStatuses: {},
    activeTaskCount: 0,
    availableAgentCount: 0,
    activeAgents: 0,
    totalAgents: 0,
    domainHealth: {},
    lastUpdated: new Date(),
    alerts: [],
    tasks: [],
    domains: [],
    agents: [],
    status: 'healthy',
    score: 85
  };

  const [metrics, setMetrics] = useState({
    totalTasks: 0,
    completedTasks: 0,
    activeTasks: 0,
    pendingTasks: 0,
    activeAgents: 0,
    systemHealth: mockSystemHealth,
    domainStatuses: {},
    repairProgress: 0
  });

  const [domains, setDomains] = useState<Domain[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const updateMetrics = () => {
      const status = coordinationSystem.getSystemStatus();
      const repairProgress = coordinationSystem.getRepairProgress();
      
      const activeTasks = status.activeTasks?.filter((t: Task) => t.status === 'in_progress').length || 0;
      const completedTasks = status.activeTasks?.filter((t: Task) => t.status === 'completed').length || 0;
      const totalTasks = status.activeTasks?.length || 0;
      const pendingTasks = status.activeTasks?.filter((t: Task) => t.status === 'pending').length || 0;
      const activeAgents = status.agents?.filter((agent: Agent) => agent.status === 'busy').length || 0;
      
      const domainStatuses: Record<string, string> = {};
      const domains = status.domains || [];
      domains.forEach((domain: Domain) => {
        domainStatuses[domain.name] = domain.status;
      });

      setMetrics({
        totalTasks,
        completedTasks,
        activeTasks,
        pendingTasks,
        activeAgents,
        systemHealth: status.systemHealth || mockSystemHealth,
        domainStatuses,
        repairProgress: repairProgress.overallProgress
      });

      setDomains(status.domains || []);
      setTasks(status.activeTasks || []);
      setAgents(status.agents || []);
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 2000);
    return () => clearInterval(interval);
  }, [coordinationSystem]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'active':
      case 'completed':
        return 'text-green-500';
      case 'degraded':
      case 'in_progress':
        return 'text-yellow-500';
      case 'critical':
      case 'error':
      case 'failed':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'in_progress':
        return <Clock className="w-4 h-4" />;
      case 'error':
      case 'failed':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Multi-Domain Coordination Dashboard
            </h1>
            <p className="text-slate-300">
              Real-time monitoring and analytics for system repair operations
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg transition-colors"
          >
            <Activity className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-300 text-sm">Repair Progress</p>
                <p className="text-2xl font-bold text-white">{metrics.repairProgress.toFixed(1)}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
            <div className="mt-4 bg-slate-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${metrics.repairProgress}%` }}
              />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-300 text-sm">Active Tasks</p>
                <p className="text-2xl font-bold text-white">{metrics.activeTasks}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
            <p className="text-slate-400 text-sm mt-2">
              {metrics.completedTasks}/{metrics.totalTasks} completed
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-300 text-sm">Active Agents</p>
                <p className="text-2xl font-bold text-white">{metrics.activeAgents}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
            <p className="text-slate-400 text-sm mt-2">
              {agents.length} total agents
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-300 text-sm">System Health</p>
                <p className="text-2xl font-bold text-green-500">
                  85/100
                </p>
              </div>
              <Zap className="w-8 h-8 text-green-500" />
            </div>
            <p className="text-slate-400 text-sm mt-2 capitalize">
              Healthy
            </p>
          </div>
        </div>

        {/* Domain Status Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h2 className="text-xl font-bold text-white mb-4">Domain Status</h2>
            <div className="space-y-4">
              {domains.map((domain) => (
                <div key={domain.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(domain.status)}
                    <div>
                      <p className="text-white font-medium">{domain.name}</p>
                      <p className="text-slate-400 text-sm">{domain.description}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(domain.status)} bg-current/20`}>
                    {domain.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h2 className="text-xl font-bold text-white mb-4">Active Tasks</h2>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {tasks.filter(task => task.status !== 'completed').map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(task.status)}
                    <div>
                      <p className="text-white font-medium">{task.title}</p>
                      <p className="text-slate-400 text-sm">Priority: {task.priority}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Agent Performance */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <h2 className="text-xl font-bold text-white mb-4">Agent Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map((agent) => (
              <div key={agent.id} className="p-4 bg-white/5 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-medium">{agent.name}</h3>
                  <span className={`px-2 py-1 rounded text-xs ${getStatusColor(agent.status)}`}>
                    {agent.status}
                  </span>
                </div>
                <p className="text-slate-400 text-sm mb-3">{agent.capabilities.join(', ')}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">Tasks Completed:</span>
                    <span className="text-white">{agent.performance?.tasksCompleted || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">Success Rate:</span>
                    <span className="text-white">{((agent.performance?.successRate || 0) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">Avg Response:</span>
                    <span className="text-white">{agent.performance?.averageResponseTime || 0}ms</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>


      </div>
    </div>
  );
};

export default AnalyticsDashboard;