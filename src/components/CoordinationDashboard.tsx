import React, { useState, useEffect } from 'react';
import { CoordinationSystem } from '../coordination/CoordinationSystem';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { Task, Domain, Agent } from '../types/coordination';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Settings, 
  Download, 
  Upload,
  Monitor,
  Zap,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

interface CoordinationDashboardProps {
  className?: string;
}

export const CoordinationDashboard: React.FC<CoordinationDashboardProps> = ({ className = '' }) => {
  const [coordinationSystem] = useState(() => new CoordinationSystem());
  const [isSystemRunning, setIsSystemRunning] = useState(false);
  const [currentView, setCurrentView] = useState<'dashboard' | 'analytics' | 'settings'>('dashboard');
  const [systemStatus, setSystemStatus] = useState<any>(null);
  const [repairProgress, setRepairProgress] = useState<any>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeSystem = async () => {
      try {
        await coordinationSystem.initialize();
        setIsSystemRunning(true);
        setIsInitializing(false);
        
        // Start the repair process automatically
        coordinationSystem.startRepairProcess();
        
        // Update status periodically
        const updateStatus = () => {
          setSystemStatus(coordinationSystem.getSystemStatus());
          setRepairProgress(coordinationSystem.getRepairProgress());
        };
        
        updateStatus();
        const interval = setInterval(updateStatus, 1000);
        
        return () => clearInterval(interval);
      } catch (error) {
        console.error('Failed to initialize coordination system:', error);
        setIsInitializing(false);
      }
    };

    initializeSystem();
  }, [coordinationSystem]);

  const handleSystemToggle = () => {
    if (isSystemRunning) {
      coordinationSystem.pauseSystem();
      setIsSystemRunning(false);
    } else {
      coordinationSystem.resumeSystem();
      setIsSystemRunning(true);
    }
  };

  const handleSystemReset = async () => {
    await coordinationSystem.initialize();
    coordinationSystem.startRepairProcess();
    setIsSystemRunning(true);
  };

  const handleExportReport = () => {
    const report = coordinationSystem.generateReport();
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `coordination-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getProgressColor = (progress: number) => {
    if (progress === 100) return 'text-green-500';
    if (Number(progress) >= 80) return 'text-green-500';
    if (Number(progress) >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getCriticalTasks = () => {
    if (!systemStatus?.activeTasks) return [];
    return systemStatus.activeTasks.filter((task: Task) => {
      const priorityValue = typeof task.priority === 'number' ? task.priority : 
        task.priority === 'high' ? 1 : task.priority === 'medium' ? 2 : 3;
      return priorityValue <= 2 && task.status !== 'completed';
    });
  };

  if (isInitializing) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Initializing Coordination System</h2>
          <p className="text-slate-300">Setting up multi-domain repair operations...</p>
        </div>
      </div>
    );
  }

  if (currentView === 'analytics') {
    return (
      <div className={className}>
        <div className="mb-4">
          <button
            onClick={() => setCurrentView('dashboard')}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            ← Back to Dashboard
          </button>
        </div>
        <AnalyticsDashboard coordinationSystem={coordinationSystem} />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 ${className}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Multi-Domain Coordination System
            </h1>
            <p className="text-slate-300 text-lg">
              Orchestrating repair operations across 5 business domains
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isSystemRunning ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
              <span className="text-white font-medium">
                {isSystemRunning ? 'Active' : 'Paused'}
              </span>
            </div>
            
            <button
              onClick={handleSystemToggle}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isSystemRunning 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {isSystemRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isSystemRunning ? 'Pause' : 'Resume'}
            </button>
            
            <button
              onClick={handleSystemReset}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>

        {/* System Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Repair Progress */}
          <div className="lg:col-span-2 bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6">Repair Progress Overview</h2>
            
            {repairProgress && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 text-lg">Overall Progress</span>
                  <span className={`text-2xl font-bold ${getProgressColor(repairProgress.overallProgress)}`}>
                    {repairProgress.overallProgress.toFixed(1)}%
                  </span>
                </div>
                
                <div className="bg-slate-700 rounded-full h-4">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-4 rounded-full transition-all duration-1000"
                    style={{ width: `${repairProgress.overallProgress}%` }}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {Object.entries(repairProgress.domainProgress).map(([domain, progress]) => (
                    <div key={domain} className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium">{domain}</span>
                        <span className={`text-sm font-bold ${getProgressColor(Number(progress))}`}>
                          {Number(progress).toFixed(1)}%
                        </span>
                      </div>
                      <div className="bg-slate-600 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Critical Tasks */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">Critical Tasks</h3>
            <div className="space-y-3">
              {getCriticalTasks().slice(0, 5).map((task: Task) => (
                <div key={task.id} className="bg-white/5 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <span className="text-white text-sm font-medium">{task.title}</span>
                  </div>
                  <p className="text-slate-300 text-xs">{task.domainId}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => setCurrentView('analytics')}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            <Monitor className="w-5 h-5" />
            View Analytics
          </button>
          
          <button
            onClick={handleExportReport}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Download className="w-5 h-5" />
            Export Report
          </button>
          
          <button
            onClick={() => setCurrentView('settings')}
            className="flex items-center gap-2 px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5" />
            Settings
          </button>
        </div>

        {/* System Status */}
        {systemStatus && (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">System Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  {systemStatus.domains?.length || 0}
                </div>
                <div className="text-slate-300">Active Domains</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {systemStatus.agents?.filter((a: Agent) => a.status === 'busy').length || 0}
                </div>
                <div className="text-slate-300">Active Agents</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">
                  {systemStatus.activeTasks?.filter((t: Task) => t.status === 'in_progress').length || 0}
                </div>
                <div className="text-slate-300">Tasks in Progress</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoordinationDashboard;