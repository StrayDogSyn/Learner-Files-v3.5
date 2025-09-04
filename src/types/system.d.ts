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
export declare const isActiveStatus: (status: string) => boolean;
export declare const isHealthyStatus: (status: string) => boolean;
export declare const createDefaultSystemHealth: () => SystemHealth;
export declare const createDefaultCoordinationState: () => CoordinationState;
export declare const isSystemHealth: (obj: any) => obj is SystemHealth;
export declare const isTask: (obj: any) => obj is Task;
export declare const isAgent: (obj: any) => obj is Agent;
//# sourceMappingURL=system.d.ts.map