import React, { useState, useEffect } from 'react';
import { CoordinationSystem } from './CoordinationSystem';
import { Domain, Task, Agent } from '../types/coordination';

// Define local interfaces for this component
interface SystemMetrics {
  totalDomains: number;
  activeTasks: number;
  completedTasks?: number;
  activeAgents?: number;
  availableAgents: number;
  systemHealth: number;
  uptime: number;
  lastUpdated: Date;
}

interface DashboardMetrics {
  domains: {
    total: number;
    healthy: number;
    warning: number;
    critical: number;
    byStatus: Record<string, number>;
  };
  tasks: {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    failed: number;
    byPriority: Record<number, number>;
  };
  agents: {
    total: number;
    idle: number;
    active: number;
    busy: number;
    error: number;
    averageSuccessRate: number;
  };
  system: {
    overallHealth: number;
    uptime: number;
    lastUpdate: Date;
  };
}
import {
  Activity,
  AlertTriangle,
  Clock,
  Cpu,
  Database,
  Globe,
  Heart,
  TrendingUp,
  Users
} from 'lucide-react';

interface AnalyticsDashboardProps {
  coordinationSystem: CoordinationSystem;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ coordinationSystem }) => {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    domains: { total: 0, healthy: 0, warning: 0, critical: 0, byStatus: {} as any },
    tasks: { total: 0, pending: 0, inProgress: 0, completed: 0, failed: 0, byPriority: {} as any },
    agents: { total: 0, idle: 0, active: 0, busy: 0, error: 0, averageSuccessRate: 0 },
    system: { overallHealth: 0, uptime: 0, lastUpdate: new Date() }
  });
  const [domains, setDomains] = useState<Domain[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    totalDomains: 0,
    activeTasks: 0,
    availableAgents: 0,
    systemHealth: 0,
    uptime: 0,
    lastUpdated: new Date()
  });
  const [alerts, setAlerts] = useState<Array<{ type: string; message: string; timestamp: Date }>>([]);

  useEffect(() => {
    const updateData = () => {
      if (!coordinationSystem) return;

      const domainsData = coordinationSystem.getDomains();
      const tasksData = coordinationSystem.getTasks();
      const agentsData = coordinationSystem.getAgents();
      const systemData = coordinationSystem.getMetrics();

      setDomains(domainsData);
      setTasks(tasksData);
      setAgents(agentsData);
      setSystemMetrics({
        ...systemData,
        lastUpdated: new Date()
      });

      // Calculate dashboard metrics
      const dashboardMetrics: DashboardMetrics = {
        domains: {
          total: domainsData.length,
          healthy: domainsData.filter(d => d.metrics.healthScore >= 70).length,
          warning: domainsData.filter(d => d.metrics.healthScore >= 40 && d.metrics.healthScore < 70).length,
          critical: domainsData.filter(d => d.metrics.healthScore < 40).length,
          byStatus: domainsData.reduce((acc, d) => {
            acc[d.status] = (acc[d.status] || 0) + 1;
            return acc;
          }, {} as any)
        },
        tasks: {
          total: tasksData.length,
          pending: tasksData.filter(t => t.status === 'pending').length,
          inProgress: tasksData.filter(t => t.status === 'in_progress').length,
          completed: tasksData.filter(t => t.status === 'completed').length,
          failed: tasksData.filter(t => t.status === 'failed').length,
          byPriority: tasksData.reduce((acc, t) => {
            acc[t.priority] = (acc[t.priority] || 0) + 1;
            return acc;
          }, {} as any)
        },
        agents: {
          total: agentsData.length,
          idle: agentsData.filter(a => a.status === 'idle').length,
          active: agentsData.filter(a => a.status === 'busy').length,
          busy: agentsData.filter(a => a.status === 'busy').length,
          error: agentsData.filter(a => a.status === 'offline').length,
          averageSuccessRate: agentsData.length > 0 
            ? agentsData.reduce((sum, a) => sum + a.performance.successRate, 0) / agentsData.length 
            : 0
        },
        system: {
          overallHealth: systemData.systemHealth,
          uptime: 99.5, // Mock uptime
          lastUpdate: new Date()
        }
      };

      setMetrics(dashboardMetrics);
    };

    // Initial load
    updateData();

    // Set up event listeners
    const handleMetricsUpdate = () => updateData();
    const handleSystemAlert = (data: { health: number; message: string }) => {
      setAlerts(prev => [{
        type: 'critical',
        message: data.message,
        timestamp: new Date()
      }, ...prev.slice(0, 4)]);
    };
    const handleSystemWarning = (data: { health: number; message: string }) => {
      setAlerts(prev => [{
        type: 'warning',
        message: data.message,
        timestamp: new Date()
      }, ...prev.slice(0, 4)]);
    };

    coordinationSystem.on('metrics:updated', handleMetricsUpdate);
    coordinationSystem.on('system:critical', handleSystemAlert);
    coordinationSystem.on('system:warning', handleSystemWarning);

    // Update every 5 seconds
    const interval = setInterval(updateData, 5000);

    return () => {
      coordinationSystem.off('metrics:updated', handleMetricsUpdate);
      coordinationSystem.off('system:critical', handleSystemAlert);
      coordinationSystem.off('system:warning', handleSystemWarning);
      clearInterval(interval);
    };
  }, [coordinationSystem]);

  const getHealthColor = (health: number): string => {
    if (health >= 70) return 'text-green-600';
    if (health >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getHealthBgColor = (health: number): string => {
    if (health >= 70) return 'bg-green-100';
    if (health >= 40) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getPriorityColor = (priority: number | string): string => {
    let priorityLevel: string;
    if (typeof priority === 'number') {
      if (priority >= 8) priorityLevel = 'critical';
      else if (priority >= 6) priorityLevel = 'high';
      else if (priority >= 4) priorityLevel = 'medium';
      else priorityLevel = 'low';
    } else {
      priorityLevel = priority;
    }
    
    switch (priorityLevel) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-blue-600 bg-blue-100';
      case 'low': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityLabel = (priority: number): string => {
    if (priority >= 8) return 'critical';
    if (priority >= 6) return 'high';
    if (priority >= 4) return 'medium';
    return 'low';
  };

  const formatTimestamp = (date: Date): string => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  return (
    <div className="space-y-6">
      {/* System Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">System Health</p>
              <p className={`text-2xl font-bold ${getHealthColor(metrics.system.overallHealth)}`}>
                {metrics.system.overallHealth}%
              </p>
            </div>
            <Heart className={`h-8 w-8 ${getHealthColor(metrics.system.overallHealth)}`} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Tasks</p>
              <p className="text-2xl font-bold text-blue-600">{metrics.tasks.inProgress}</p>
            </div>
            <Activity className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Agents</p>
              <p className="text-2xl font-bold text-green-600">{metrics.agents.active}</p>
            </div>
            <Users className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Domains Online</p>
              <p className="text-2xl font-bold text-purple-600">{metrics.domains.total}</p>
            </div>
            <Globe className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Domain Status */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Database className="h-5 w-5 mr-2" />
          Domain Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {domains.map((domain) => (
            <div key={domain.id} className={`p-4 rounded-lg border-2 ${getHealthBgColor(domain.metrics.healthScore)}`}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{domain.name}</h4>
                <span className={`text-sm font-bold ${getHealthColor(domain.metrics.healthScore)}`}>
                  {domain.metrics.healthScore}%
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{domain.description}</p>
              <div className="flex items-center justify-between text-xs">
                <span className={`px-2 py-1 rounded-full ${
                  domain.status === 'healthy' ? 'bg-green-100 text-green-800' :
                  domain.status === 'degraded' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {domain.status}
                </span>
                <span className="text-gray-500">
                  {domain.metrics.responseTime}ms
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Tasks */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          Active Tasks
        </h3>
        <div className="space-y-3">
          {tasks.filter(task => task.status === 'in_progress' || task.status === 'pending').slice(0, 5).map((task) => (
            <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{task.title}</h4>
                <p className="text-sm text-gray-600">{task.description}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(task.priority)}`}>
                    {getPriorityLabel(task.priority)}
                  </span>
                  <span className="text-xs text-gray-500">{task.type || 'general'}</span>
                </div>
              </div>
              <div className="text-right">
                <div className={`w-16 h-2 bg-gray-200 rounded-full overflow-hidden`}>
                  <div 
                    className="h-full bg-blue-600 transition-all duration-300"
                    style={{ width: `${task.progress || 0}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 mt-1">{task.progress || 0}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Agent Performance */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Cpu className="h-5 w-5 mr-2" />
          Agent Performance
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((agent) => (
            <div key={agent.id} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{agent.name}</h4>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  agent.status === 'busy' ? 'bg-green-100 text-green-800' :
                  agent.status === 'idle' ? 'bg-blue-100 text-blue-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {agent.status}
                </span>
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Success Rate:</span>
                  <span className="font-medium">{agent.performance.successRate.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Tasks Completed:</span>
                  <span className="font-medium">{agent.performance.tasksCompleted}</span>
                </div>
                <div className="flex justify-between">
                  <span>Type:</span>
                  <span className="font-medium capitalize">{agent.type}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Alerts */}
      {alerts.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            System Alerts
          </h3>
          <div className="space-y-2">
            {alerts.map((alert, index) => (
              <div key={index} className={`p-3 rounded-lg ${
                alert.type === 'critical' ? 'bg-red-100 border-l-4 border-red-500' :
                alert.type === 'warning' ? 'bg-yellow-100 border-l-4 border-yellow-500' :
                'bg-blue-100 border-l-4 border-blue-500'
              }`}>
                <div className="flex items-center justify-between">
                  <p className={`font-medium ${
                    alert.type === 'critical' ? 'text-red-800' :
                    alert.type === 'warning' ? 'text-yellow-800' :
                    'text-blue-800'
                  }`}>
                    {alert.message}
                  </p>
                  <span className="text-xs text-gray-500">
                    {formatTimestamp(alert.timestamp)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* System Statistics */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2" />
          System Statistics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{metrics.tasks.total}</p>
            <p className="text-sm text-gray-600">Total Tasks</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{metrics.tasks.completed}</p>
            <p className="text-sm text-gray-600">Completed</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{metrics.agents.total}</p>
            <p className="text-sm text-gray-600">Total Agents</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">{metrics.agents.averageSuccessRate.toFixed(1)}%</p>
            <p className="text-sm text-gray-600">Avg Success Rate</p>
          </div>
        </div>
      </div>

      {/* Last Updated */}
      <div className="text-center text-sm text-gray-500">
        Last updated: {formatTimestamp(systemMetrics.lastUpdated)}
      </div>
    </div>
  );
};