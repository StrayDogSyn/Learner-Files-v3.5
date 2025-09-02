// Core system types for portfolio deployment
export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'critical';
  score: number;
  health: {
    overall: number;
    domains: Record<string, number>;
  };
  lastUpdated: Date;
  activeIssues: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface Agent {
  id: string;
  name: string;
  type: 'monitoring' | 'repair' | 'optimization';
  status: 'idle' | 'busy' | 'offline';
  capabilities: string[];
  currentTask?: string;
  lastActivity: Date;
}

export interface CoordinationState {
  isActive: boolean;
  systemHealth: SystemHealth;
  activeTasks: Task[];
  availableAgents: Agent[];
  lastSync: Date;
}

// Helper functions to avoid type comparison errors
export const isActiveStatus = (status: string): boolean => {
  return status === 'busy' || status === 'in_progress';
};

export const isHealthyStatus = (status: string): boolean => {
  return status === 'healthy';
};

// Factory functions for default values
export const createDefaultSystemHealth = (): SystemHealth => ({
  status: 'healthy',
  score: 100,
  health: {
    overall: 100,
    domains: {}
  },
  lastUpdated: new Date(),
  activeIssues: 0
});

export const createDefaultCoordinationState = (): CoordinationState => ({
  isActive: false,
  systemHealth: createDefaultSystemHealth(),
  activeTasks: [],
  availableAgents: [],
  lastSync: new Date()
});

// Type guards for runtime safety
export const isSystemHealth = (obj: any): obj is SystemHealth => {
  return obj && typeof obj.status === 'string' && typeof obj.score === 'number';
};

export const isTask = (obj: any): obj is Task => {
  return obj && typeof obj.id === 'string' && typeof obj.title === 'string';
};

export const isAgent = (obj: any): obj is Agent => {
  return obj && typeof obj.id === 'string' && typeof obj.name === 'string';
};
