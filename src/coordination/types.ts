// Domain Types
export type DomainStatus = 'active' | 'maintenance' | 'development' | 'planning' | 'error';

export interface DomainMetrics {
  uptime: number; // percentage
  responseTime: number; // milliseconds
  errorRate: number; // percentage
  throughput: number; // requests per minute
}

export interface Domain {
  id: string;
  name: string;
  description: string;
  status: DomainStatus;
  health: number; // 0-100
  lastHealthCheck: Date;
  metrics: DomainMetrics;
  services: string[];
  dependencies: string[];
}

// Task Types
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
export type TaskPriority = 'critical' | 'high' | 'medium' | 'low';
export type TaskType = 
  | 'frontend-repair'
  | 'backend-development'
  | 'application-repair'
  | 'infrastructure-repair'
  | 'integration-repair'
  | 'feature-development'
  | 'ui-development'
  | 'database-design'
  | 'testing'
  | 'quality-assurance'
  | 'performance-testing'
  | 'security-testing'
  | 'asset-optimization'
  | 'performance-tuning'
  | 'deployment'
  | 'monitoring'
  | 'api-development'
  | 'system-integration'
  | 'data-migration'
  | 'code-generation'
  | 'debugging';

export interface Task {
  id: string;
  title: string;
  description: string;
  type: TaskType;
  priority: TaskPriority;
  status: TaskStatus;
  domainId: string;
  estimatedDuration: number; // minutes
  dependencies: string[]; // task IDs
  tags: string[];
  assignedAgentId: string | null;
  progress: number; // 0-100
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  metadata: {
    errorType?: string;
    affectedComponents?: string[];
    severity?: string;
    [key: string]: any;
  };
}

// Agent Types
export type AgentStatus = 'idle' | 'active' | 'busy' | 'error' | 'offline';
export type AgentType = 'coding' | 'infrastructure' | 'integration' | 'development' | 'qa';
export type AgentCapability = TaskType;

export interface AgentPerformance {
  tasksCompleted: number;
  successRate: number; // percentage
  averageCompletionTime: number; // minutes
  lastActive: Date;
}

export interface Agent {
  id: string;
  name: string;
  type: AgentType;
  status: AgentStatus;
  capabilities: AgentCapability[];
  currentTask: string | null; // task ID
  performance: AgentPerformance;
  metadata: {
    version?: string;
    specializations?: string[];
    maxConcurrentTasks?: number;
    preferredTaskTypes?: TaskType[];
    [key: string]: any;
  };
}

// System Types
export interface SystemMetrics {
  totalDomains: number;
  activeTasks: number;
  completedTasks: number;
  activeAgents: number;
  systemHealth: number; // 0-100
  lastUpdated: Date;
}

export interface SystemAlert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'critical';
  title: string;
  message: string;
  timestamp: Date;
  domainId?: string;
  taskId?: string;
  agentId?: string;
  acknowledged: boolean;
}

// Event Types
export interface SystemEvent {
  id: string;
  type: string;
  timestamp: Date;
  data: any;
  source: 'domain' | 'task' | 'agent' | 'system';
}

// Configuration Types
export interface CoordinationConfig {
  domains: {
    healthCheckInterval: number;
    criticalHealthThreshold: number;
    warningHealthThreshold: number;
  };
  tasks: {
    maxRetries: number;
    retryDelay: number;
    priorityWeights: Record<TaskPriority, number>;
  };
  agents: {
    healthCheckInterval: number;
    maxIdleTime: number;
    maxActiveTime: number;
  };
  system: {
    metricsUpdateInterval: number;
    alertRetentionDays: number;
    eventRetentionDays: number;
  };
}

// Dashboard Types
export interface DashboardMetrics {
  domains: {
    total: number;
    healthy: number;
    warning: number;
    critical: number;
    byStatus: Record<DomainStatus, number>;
  };
  tasks: {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    failed: number;
    byPriority: Record<TaskPriority, number>;
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

export interface DashboardState {
  isInitialized: boolean;
  isRunning: boolean;
  currentView: 'overview' | 'domains' | 'tasks' | 'agents' | 'analytics';
  selectedDomain: string | null;
  selectedTask: string | null;
  selectedAgent: string | null;
  filters: {
    domainStatus?: DomainStatus[];
    taskStatus?: TaskStatus[];
    taskPriority?: TaskPriority[];
    agentStatus?: AgentStatus[];
  };
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Event Listener Types
export interface EventListeners {
  // Domain events
  'domain:registered': (domain: Domain) => void;
  'domain:status:changed': (domainId: string, status: DomainStatus) => void;
  'domain:health:changed': (domainId: string, health: number) => void;
  'domain:restarted': (domain: Domain) => void;
  
  // Task events
  'task:created': (task: Task) => void;
  'task:assigned': (task: Task, agentId: string) => void;
  'task:unassigned': (task: Task, agentId: string) => void;
  'task:status:changed': (task: Task, oldStatus: TaskStatus, newStatus: TaskStatus) => void;
  'task:completed': (task: Task) => void;
  'task:failed': (task: Task) => void;
  'task:retry': (task: Task) => void;
  'task:ready': (task: Task) => void;
  
  // Agent events
  'agent:registered': (agent: Agent) => void;
  'agent:assigned': (agent: Agent, task: Task) => void;
  'agent:unassigned': (agent: Agent, taskId: string) => void;
  'agent:status:changed': (agentId: string, status: AgentStatus) => void;
  'agent:task:completed': (agent: Agent, taskId: string, success: boolean) => void;
  'agent:stuck': (agent: Agent) => void;
  
  // System events
  'system:initialized': () => void;
  'system:paused': () => void;
  'system:resumed': () => void;
  'system:shutdown': () => void;
  'system:critical': (data: { health: number; message: string }) => void;
  'system:warning': (data: { health: number; message: string }) => void;
  'metrics:updated': (metrics: SystemMetrics) => void;
}

// Export default configuration
export const DEFAULT_CONFIG: CoordinationConfig = {
  domains: {
    healthCheckInterval: 30000, // 30 seconds
    criticalHealthThreshold: 30,
    warningHealthThreshold: 60
  },
  tasks: {
    maxRetries: 3,
    retryDelay: 5000, // 5 seconds
    priorityWeights: {
      critical: 4,
      high: 3,
      medium: 2,
      low: 1
    }
  },
  agents: {
    healthCheckInterval: 60000, // 1 minute
    maxIdleTime: 300000, // 5 minutes
    maxActiveTime: 1800000 // 30 minutes
  },
  system: {
    metricsUpdateInterval: 10000, // 10 seconds
    alertRetentionDays: 30,
    eventRetentionDays: 7
  }
};