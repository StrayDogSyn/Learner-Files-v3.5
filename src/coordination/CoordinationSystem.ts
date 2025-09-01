import { 
  Domain, 
  Task, 
  Agent, 
  CoordinationConfig, 
  CoordinationEvent, 
  SystemHealth,
  TaskExecutionResult,
  DomainRepairPlan
} from '../types/coordination';
import { DomainManager } from './DomainManager';
import { TaskCoordinator } from './TaskCoordinator';
import { AgentOrchestrator } from './AgentOrchestrator';

export class CoordinationSystem {
  private domainManager: DomainManager;
  private taskCoordinator: TaskCoordinator;
  private agentOrchestrator: AgentOrchestrator;
  private config: CoordinationConfig;
  private eventListeners: Map<string, Function[]> = new Map();
  private isInitialized: boolean = false;
  private isRunning: boolean = false;
  private systemStartTime: Date;

  constructor(config?: Partial<CoordinationConfig>) {
    this.systemStartTime = new Date();
    
    this.config = {
      maxConcurrentTasks: 5,
      taskTimeoutMinutes: 30,
      healthCheckIntervalSeconds: 30,
      priorityWeights: {
        revenueImpact: 0.4,
        domainPriority: 0.3,
        dependencyChain: 0.2,
        resourceAvailability: 0.1
      },
      alertThresholds: {
        domainHealthScore: 50,
        taskFailureRate: 0.2,
        agentResponseTime: 5000
      },
      ...config
    };

    this.initializeSystem();
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      // Initialize all subsystems
      await this.domainManager.initialize();
      await this.taskCoordinator.initialize();
      await this.agentOrchestrator.initialize();
      
      this.isInitialized = true;
      this.isRunning = true;
      
      this.emitEvent({
        id: `system-initialized-${Date.now()}`,
        type: 'system:initialized',
        timestamp: new Date(),
        data: {
          timestamp: Date.now(),
          message: 'Coordination system initialized successfully'
        },
        severity: 'info'
      });
    } catch (error) {
      console.error('Failed to initialize coordination system:', error);
      throw error;
    }
  }

  private initializeSystem(): void {
    console.log('🚀 Initializing Multi-Domain Coordination System...');
    
    // Initialize core components
    this.domainManager = new DomainManager(this.config);
    this.taskCoordinator = new TaskCoordinator(this.domainManager, this.config);
    this.agentOrchestrator = new AgentOrchestrator(
      this.domainManager, 
      this.taskCoordinator, 
      this.config
    );

    // Set up event forwarding
    this.setupEventForwarding();
    
    // Set up automated task assignment
    this.setupAutomatedTaskAssignment();
    
    this.isInitialized = true;
    
    console.log('✅ Multi-Domain Coordination System initialized successfully');
    this.logSystemStatus();
  }

  private setupEventForwarding(): void {
    // Forward events from all subsystems
    [this.domainManager, this.taskCoordinator, this.agentOrchestrator].forEach(component => {
      component.addEventListener('*', (event: CoordinationEvent) => {
        this.emitEvent(event);
      });
    });
  }

  private setupAutomatedTaskAssignment(): void {
    // Listen for new tasks and automatically assign them to agents
    this.taskCoordinator.addEventListener('task_created', (event: CoordinationEvent) => {
      if (event.taskId) {
        setTimeout(() => {
          this.agentOrchestrator.assignTaskToAgent(event.taskId!);
        }, 1000); // Small delay to allow for proper initialization
      }
    });

    // Listen for task completions and trigger dependent tasks
    this.taskCoordinator.addEventListener('task_completed', (event: CoordinationEvent) => {
      this.handleTaskCompletion(event);
    });
  }

  private handleTaskCompletion(event: CoordinationEvent): void {
    const { task, result } = event.data;
    
    if (result.success) {
      console.log(`✅ Task completed successfully: ${task.title}`);
      
      // Check if this completion enables new repair strategies
      this.evaluateRepairProgress(task.domainId);
    } else {
      console.log(`❌ Task failed: ${task.title} - ${result.error}`);
      
      // Create recovery task if needed
      this.createRecoveryTask(task, result);
    }
  }

  private evaluateRepairProgress(domainId: string): void {
    const domain = this.domainManager.getDomain(domainId);
    if (!domain) return;

    const domainTasks = this.taskCoordinator.getTasksByDomain(domainId);
    const completedTasks = domainTasks.filter(t => t.status === 'completed');
    const totalTasks = domainTasks.length;
    
    const completionRate = totalTasks > 0 ? completedTasks.length / totalTasks : 0;
    
    console.log(`📊 Domain ${domainId} repair progress: ${Math.round(completionRate * 100)}%`);
    
    // If domain is significantly repaired, update status
    if (completionRate >= 0.8 && domain.status !== 'healthy') {
      this.domainManager.updateDomainStatus(domainId, 'healthy');
      console.log(`🎉 Domain ${domainId} restored to healthy status!`);
    } else if (completionRate >= 0.5 && domain.status === 'failed') {
      this.domainManager.updateDomainStatus(domainId, 'degraded');
      console.log(`🔧 Domain ${domainId} partially restored (degraded status)`);
    }
  }

  private createRecoveryTask(failedTask: Task, result: TaskExecutionResult): void {
    // Create a recovery task for critical failures
    if (failedTask.priority <= 2) {
      const recoveryTask = {
        domainId: failedTask.domainId,
        title: `Recovery: ${failedTask.title}`,
        description: `Recover from failed task: ${failedTask.title}. Error: ${result.error}`,
        priority: Math.max(1, failedTask.priority - 1), // Higher priority for recovery
        estimatedDuration: failedTask.estimatedDuration * 1.5, // More time for recovery
        dependencies: [],
        revenueImpact: failedTask.revenueImpact * 0.8 // Slightly lower impact
      };
      
      this.taskCoordinator.createTask(recoveryTask);
      console.log(`🔄 Created recovery task for: ${failedTask.title}`);
    }
  }

  // Public API Methods

  public getSystemStatus(): {
    isInitialized: boolean;
    uptime: number;
    systemHealth: SystemHealth;
    domains: Domain[];
    activeTasks: Task[];
    agents: Agent[];
  } {
    const uptime = Date.now() - this.systemStartTime.getTime();
    
    return {
      isInitialized: this.isInitialized,
      uptime,
      systemHealth: this.agentOrchestrator.getSystemHealth(),
      domains: this.domainManager.getAllDomains(),
      activeTasks: [
        ...this.taskCoordinator.getExecutionQueue(),
        ...this.taskCoordinator.getRunningTasks()
      ],
      agents: Array.from(this.domainManager.getAllDomains().flatMap(d => d.agents))
    };
  }

  public getDomainStatus(domainId: string): Domain | null {
    return this.domainManager.getDomain(domainId);
  }

  public getRepairProgress(): {
    overallProgress: number;
    domainProgress: Record<string, number>;
    criticalIssuesRemaining: number;
    estimatedCompletionTime: Date | null;
  } {
    const allDomains = this.domainManager.getAllDomains();
    const domainProgress: Record<string, number> = {};
    let totalProgress = 0;
    let criticalIssuesRemaining = 0;
    
    allDomains.forEach(domain => {
      const domainTasks = this.taskCoordinator.getTasksByDomain(domain.id);
      const completedTasks = domainTasks.filter(t => t.status === 'completed');
      const progress = domainTasks.length > 0 ? completedTasks.length / domainTasks.length : 1;
      
      domainProgress[domain.id] = Math.round(progress * 100);
      totalProgress += progress;
      
      // Count critical issues (priority 1-2 tasks that are not completed)
      criticalIssuesRemaining += domainTasks.filter(t => 
        t.priority <= 2 && t.status !== 'completed'
      ).length;
    });
    
    const overallProgress = allDomains.length > 0 ? 
      Math.round((totalProgress / allDomains.length) * 100) : 100;
    
    // Estimate completion time based on current task velocity
    const estimatedCompletionTime = this.estimateCompletionTime();
    
    return {
      overallProgress,
      domainProgress,
      criticalIssuesRemaining,
      estimatedCompletionTime
    };
  }

  private estimateCompletionTime(): Date | null {
    const pendingTasks = this.taskCoordinator.getExecutionQueue();
    const runningTasks = this.taskCoordinator.getRunningTasks();
    const allPendingTasks = [...pendingTasks, ...runningTasks];
    
    if (allPendingTasks.length === 0) {
      return null; // All tasks completed
    }
    
    // Calculate average task completion time
    const completedTasks = this.taskCoordinator.getCompletedTasks();
    const avgCompletionTime = completedTasks.length > 0 ?
      completedTasks.reduce((sum, t) => sum + t.duration, 0) / completedTasks.length :
      30; // Default 30 minutes
    
    // Estimate remaining time based on task queue and agent capacity
    const totalRemainingTime = allPendingTasks.reduce((sum, task) => 
      sum + (task.estimatedDuration || avgCompletionTime), 0
    );
    
    // Account for parallel execution
    const activeAgents = this.agentOrchestrator.getSystemHealth().activeAgents;
    const parallelFactor = Math.max(1, activeAgents);
    const adjustedTime = totalRemainingTime / parallelFactor;
    
    return new Date(Date.now() + adjustedTime * 60 * 1000); // Convert minutes to milliseconds
  }

  public createCustomTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task {
    return this.taskCoordinator.createTask(taskData);
  }

  public assignTaskToSpecificAgent(taskId: string, agentId: string): boolean {
    return this.agentOrchestrator.assignTaskToAgent(taskId, agentId);
  }

  public pauseSystem(): void {
    console.log('⏸️ Pausing Multi-Domain Coordination System...');
    // Implementation would pause task execution
    this.emitEvent({
      id: `system-paused-${Date.now()}`,
      type: 'system_paused',
      timestamp: new Date(),
      data: {},
      severity: 'info'
    });
  }

  public resumeSystem(): void {
    console.log('▶️ Resuming Multi-Domain Coordination System...');
    // Implementation would resume task execution
    this.emitEvent({
      id: `system-resumed-${Date.now()}`,
      type: 'system_resumed',
      timestamp: new Date(),
      data: {},
      severity: 'info'
    });
  }

  public generateRepairReport(): {
    summary: string;
    domains: Array<{
      id: string;
      name: string;
      status: string;
      progress: number;
      issues: string[];
      recommendations: string[];
    }>;
    systemMetrics: SystemHealth;
    timeline: Array<{
      timestamp: Date;
      event: string;
      impact: string;
    }>;
  } {
    const progress = this.getRepairProgress();
    const systemHealth = this.agentOrchestrator.getSystemHealth();
    const domains = this.domainManager.getAllDomains();
    
    const summary = this.generateRepairSummary(progress, systemHealth);
    
    const domainReports = domains.map(domain => {
      const domainTasks = this.taskCoordinator.getTasksByDomain(domain.id);
      const issues = domainTasks
        .filter(t => t.status === 'failed' || t.priority <= 2)
        .map(t => t.title);
      
      const recommendations = this.generateDomainRecommendations(domain, domainTasks);
      
      return {
        id: domain.id,
        name: domain.name,
        status: domain.status,
        progress: progress.domainProgress[domain.id] || 0,
        issues,
        recommendations
      };
    });
    
    const timeline = this.generateRepairTimeline();
    
    return {
      summary,
      domains: domainReports,
      systemMetrics: systemHealth,
      timeline
    };
  }

  private generateRepairSummary(progress: any, health: SystemHealth): string {
    const status = progress.overallProgress >= 90 ? 'Excellent' :
                  progress.overallProgress >= 70 ? 'Good' :
                  progress.overallProgress >= 50 ? 'Fair' : 'Needs Attention';
    
    return `System repair is ${status} with ${progress.overallProgress}% completion. ` +
           `${progress.criticalIssuesRemaining} critical issues remaining. ` +
           `Overall system health score: ${Math.round(health.overallScore)}/100.`;
  }

  private generateDomainRecommendations(domain: Domain, tasks: Task[]): string[] {
    const recommendations: string[] = [];
    
    const failedTasks = tasks.filter(t => t.status === 'failed');
    const pendingCritical = tasks.filter(t => t.status === 'pending' && t.priority <= 2);
    
    if (failedTasks.length > 0) {
      recommendations.push(`Address ${failedTasks.length} failed tasks immediately`);
    }
    
    if (pendingCritical.length > 0) {
      recommendations.push(`Prioritize ${pendingCritical.length} critical pending tasks`);
    }
    
    if (domain.status === 'failed') {
      recommendations.push('Domain requires immediate attention - consider manual intervention');
    }
    
    if (domain.agents.filter(a => a.status === 'idle').length === 0) {
      recommendations.push('All agents busy - consider load balancing or adding resources');
    }
    
    return recommendations;
  }

  private generateRepairTimeline(): Array<{
    timestamp: Date;
    event: string;
    impact: string;
  }> {
    // This would typically pull from event history
    // For now, return a simplified timeline
    return [
      {
        timestamp: this.systemStartTime,
        event: 'Multi-Domain Coordination System initialized',
        impact: 'System monitoring and repair coordination began'
      }
    ];
  }

  private logSystemStatus(): void {
    const status = this.getSystemStatus();
    console.log('\n📊 System Status:');
    console.log(`   Domains: ${status.domains.length}`);
    console.log(`   Active Tasks: ${status.activeTasks.length}`);
    console.log(`   Agents: ${status.agents.length}`);
    console.log(`   Health Score: ${Math.round(status.systemHealth.overallScore)}/100`);
    console.log('');
  }

  public addEventListener(eventType: string, callback: Function): void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, []);
    }
    this.eventListeners.get(eventType)!.push(callback);
  }

  private emitEvent(event: CoordinationEvent): void {
    const listeners = this.eventListeners.get(event.type) || [];
    const allListeners = this.eventListeners.get('*') || [];
    
    [...listeners, ...allListeners].forEach(callback => {
      try {
        callback(event);
      } catch (error) {
        console.error('Error in event listener:', error);
      }
    });
  }

  public startRepairProcess(): void {
    console.log('🔧 Starting automated repair process...');
    
    if (!this.isInitialized) {
      console.warn('Cannot start repair process: system not initialized');
      return;
    }
    
    // Get all domains and create repair tasks for failed/degraded ones
    const domains = this.domainManager.getAllDomains();
    const failedDomains = domains.filter(d => d.status === 'failed' || d.status === 'degraded');
    
    console.log(`Found ${failedDomains.length} domains requiring repair`);
    
    failedDomains.forEach(domain => {
      this.createDomainRepairTasks(domain);
    });
    
    this.emitEvent({
      id: `repair-process-started-${Date.now()}`,
      type: 'repair_process_started',
      timestamp: new Date(),
      data: {
        domainsToRepair: failedDomains.length,
        message: 'Automated repair process initiated'
      },
      severity: 'info'
    });
  }
  
  private createDomainRepairTasks(domain: Domain): void {
    // Create specific repair tasks based on domain issues
    const repairTasks = [
      {
        domainId: domain.id,
        title: `Diagnose ${domain.name} Issues`,
        description: `Perform comprehensive diagnosis of ${domain.name} domain issues`,
        priority: 2,
        estimatedDuration: 15,
        dependencies: [],
        revenueImpact: domain.id === 'portfolio' ? 8 : 5
      },
      {
        domainId: domain.id,
        title: `Repair ${domain.name} Core Functions`,
        description: `Restore core functionality for ${domain.name} domain`,
        priority: 1,
        estimatedDuration: 30,
        dependencies: [],
        revenueImpact: domain.id === 'portfolio' ? 9 : 6
      }
    ];
    
    repairTasks.forEach(taskData => {
      this.taskCoordinator.createTask(taskData);
    });
  }
  
  public generateReport(): any {
    const progress = this.getRepairProgress();
    const systemHealth = this.agentOrchestrator.getSystemHealth();
    const domains = this.domainManager.getAllDomains();
    const allTasks = this.taskCoordinator.getAllTasks();
    
    return {
      timestamp: new Date().toISOString(),
      systemOverview: {
        uptime: Date.now() - this.systemStartTime.getTime(),
        isInitialized: this.isInitialized,
        overallProgress: progress.overallProgress,
        healthScore: systemHealth.overallScore,
        criticalIssuesRemaining: progress.criticalIssuesRemaining
      },
      domains: domains.map(domain => ({
        id: domain.id,
        name: domain.name,
        status: domain.status,
        progress: progress.domainProgress[domain.id] || 0,
        agents: domain.agents.length,
        tasks: allTasks.filter(t => t.domainId === domain.id).length
      })),
      tasks: {
        total: allTasks.length,
        completed: allTasks.filter(t => t.status === 'completed').length,
        running: allTasks.filter(t => t.status === 'running').length,
        pending: allTasks.filter(t => t.status === 'pending').length,
        failed: allTasks.filter(t => t.status === 'failed').length
      },
      systemMetrics: systemHealth,
      recommendations: this.generateSystemRecommendations()
    };
  }
  
  private generateSystemRecommendations(): string[] {
    const recommendations: string[] = [];
    const progress = this.getRepairProgress();
    const systemHealth = this.agentOrchestrator.getSystemHealth();
    
    if (progress.overallProgress < 50) {
      recommendations.push('System requires immediate attention - consider manual intervention');
    }
    
    if (progress.criticalIssuesRemaining > 5) {
      recommendations.push('High number of critical issues - prioritize high-impact repairs');
    }
    
    if (systemHealth.overallScore < 60) {
      recommendations.push('System health is below optimal - review agent performance');
    }
    
    if (systemHealth.activeAgents < 3) {
      recommendations.push('Consider adding more agents to improve repair capacity');
    }
    
    return recommendations;
  }

  public destroy(): void {
    console.log('🛑 Shutting down Multi-Domain Coordination System...');
    
    this.agentOrchestrator.destroy();
    this.taskCoordinator.destroy();
    this.domainManager.destroy();
    
    this.eventListeners.clear();
    this.isInitialized = false;
    
    console.log('✅ Multi-Domain Coordination System shut down successfully');
  }
}

// Export singleton instance
export const coordinationSystem = new CoordinationSystem();