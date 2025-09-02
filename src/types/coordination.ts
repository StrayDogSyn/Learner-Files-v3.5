// Multi-Domain Coordination System Types

export interface Domain {
  id: string;
  name: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'healthy' | 'degraded' | 'failed';
  agents: Agent[];
  tasks: Task[];
  metrics: DomainMetrics;
  lastHealthCheck: Date;
  description: string;
}

export interface Task {
  id: string;
  domainId: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low' | number;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  assignedAgent?: string;
  estimatedDuration: number;
  actualDuration?: number;
  dependencies: string[];
  revenueImpact: number;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  errorMessage?: string;
  type?: string;
  progress?: number;
}

export interface Agent {
  id: string;
  name: string;
  type: 'repair' | 'monitoring' | 'optimization' | 'trae_agent';
  domainId: string;
  status: 'idle' | 'busy' | 'offline';
  capabilities: string[];
  specialization: string;
  maxConcurrentTasks: number;
  currentTask?: string;
  lastActivity: Date;
  performance: AgentPerformance;
  description: string;
  domains?: string[];
}

export interface AgentPerformance {
  tasksCompleted: number;
  successRate: number;
  averageCompletionTime: number;
  efficiency: number;
  averageResponseTime: number;
  lastUpdated: Date;
  averageTaskTime: number;
  errorCount: number;
  lastTaskCompletion?: Date;
}

export interface DomainMetrics {
  uptime: number;
  responseTime: number;
  errorRate: number;
  throughput: number;
  healthScore: number;
  lastUpdated: Date;
}

export interface CoordinationEvent {
  id: string;
  type: CoordinationEventType;
  timestamp: Date;
  domainId?: string;
  agentId?: string;
  taskId?: string;
  data?: any;
  severity: 'info' | 'warning' | 'error' | 'critical';
}

export interface CoordinationConfig {
  maxConcurrentTasks: number;
  taskTimeoutMinutes: number;
  healthCheckIntervalSeconds: number;
  priorityWeights: {
    revenueImpact: number;
    domainPriority: number;
    dependencyChain: number;
    resourceAvailability: number;
  };
  alertThresholds: {
    domainHealthScore: number;
    taskFailureRate: number;
    agentResponseTime: number;
  };
}

export interface SystemHealth {
  overallStatus: 'healthy' | 'degraded' | 'critical';
  overallScore: number;
  agentUtilization: number;
  taskThroughput: number;
  errorRate: number;
  averageResponseTime: number;
  domainStatuses: Record<string, 'healthy' | 'degraded' | 'failed'>;
  activeTaskCount: number;
  availableAgentCount: number;
  activeAgents: number;
  totalAgents: number;
  domainHealth: Record<string, number>;
  lastUpdated: Date;
  alerts: Alert[];
  tasks: Task[];
  domains: Domain[];
  agents: Agent[];
  // Additional properties for compatibility
  status: 'healthy' | 'degraded' | 'critical';
  score: number;
}

export interface Alert {
  id: string;
  type: 'domain_failure' | 'task_timeout' | 'agent_offline' | 'performance_degradation';
  severity: 'warning' | 'error' | 'critical';
  message: string;
  domainId?: string;
  taskId?: string;
  agentId?: string;
  timestamp: Date;
  acknowledged: boolean;
  resolvedAt?: Date;
}

export interface TaskExecutionResult {
  taskId: string;
  success: boolean;
  duration: number;
  output?: any;
  error?: string;
  metrics?: Record<string, number>;
  timestamp: Date;
}

export interface DomainRepairPlan {
  domainId: string;
  issues: string[];
  repairTasks: Task[];
  estimatedCompletionTime: number;
  requiredAgents: string[];
  dependencies: string[];
  riskAssessment: 'low' | 'medium' | 'high';
}

// Specific domain types for the five business domains
export interface FrontendInfrastructureDomain extends Domain {
  htmlStructureStatus: 'valid' | 'corrupted' | 'missing';
  assetLoadingStatus: 'operational' | 'partial' | 'failed';
  componentRenderingStatus: 'functional' | 'degraded' | 'broken';
}

export interface MarvelQuizDomain extends Domain {
  gameEngineStatus: 'running' | 'stopped' | 'error';
  questionDatabaseStatus: 'connected' | 'disconnected' | 'corrupted';
  userSessionStatus: 'active' | 'inactive' | 'expired';
  scoreSystemStatus: 'operational' | 'malfunctioning';
}

export interface DesignSystemDomain extends Domain {
  glassmorphismStatus: 'enabled' | 'disabled' | 'corrupted';
  typographySystemStatus: 'loaded' | 'missing' | 'corrupted';
  animationFrameworkStatus: 'active' | 'inactive' | 'error';
  colorSystemStatus: 'applied' | 'missing' | 'inconsistent';
}

export interface DigitalEcosystemDomain extends Domain {
  crossDomainLinkingStatus: 'operational' | 'partial' | 'broken';
  apiConnectivityStatus: 'connected' | 'intermittent' | 'disconnected';
  networkIntegrationStatus: 'stable' | 'unstable' | 'failed';
}

export interface AnalyticsMonitoringDomain extends Domain {
  performanceTrackingStatus: 'active' | 'limited' | 'offline';
  errorMonitoringStatus: 'operational' | 'degraded' | 'disabled';
  userExperienceMetricsStatus: 'collecting' | 'partial' | 'unavailable';
}

// Union type for all domain types
export type AnyDomain = 
  | FrontendInfrastructureDomain 
  | MarvelQuizDomain 
  | DesignSystemDomain 
  | DigitalEcosystemDomain 
  | AnalyticsMonitoringDomain;

// Event types for the coordination system
export type CoordinationEventType = 
  | 'task_created'
  | 'task_assigned'
  | 'task_completed'
  | 'domain_status_changed'
  | 'agent_status_changed'
  | 'agent_registered'
  | 'health_check'
  | 'alert'
  | 'system_paused'
  | 'system_resumed'
  | 'repair_process_started';

// Utility types
export type DomainId = 'frontend-infrastructure' | 'marvel-quiz' | 'design-system' | 'digital-ecosystem' | 'analytics-monitoring';
export type TaskPriority = 1 | 2 | 3 | 4 | 5; // 1 = highest, 5 = lowest
export type AgentCapability = 'html-repair' | 'css-fixing' | 'js-debugging' | 'asset-optimization' | 'component-restoration' | 'game-engine-repair' | 'database-recovery' | 'ui-restoration' | 'network-diagnostics' | 'performance-monitoring';