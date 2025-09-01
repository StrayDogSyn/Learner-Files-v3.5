import { 
  Task, 
  Agent, 
  CoordinationConfig, 
  CoordinationEvent, 
  TaskExecutionResult,
  DomainRepairPlan,
  TaskPriority
} from '../types/coordination';
import { DomainManager } from './DomainManager';

export class TaskCoordinator {
  private tasks: Map<string, Task> = new Map();
  private executionQueue: Task[] = [];
  private runningTasks: Map<string, Task> = new Map();
  private completedTasks: Map<string, TaskExecutionResult> = new Map();
  private config: CoordinationConfig;
  private domainManager: DomainManager;
  private eventListeners: Map<string, Function[]> = new Map();
  private executionInterval: NodeJS.Timeout | null = null;

  constructor(domainManager: DomainManager, config?: Partial<CoordinationConfig>) {
    this.domainManager = domainManager;
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

    this.startTaskExecution();
    // Tasks will be initialized when initialize() is called
  }

  async initialize(): Promise<void> {
    this.initializeCriticalTasks();
  }

  private initializeCriticalRepairTasks(): void {
    // Create critical repair tasks based on the identified issues
    const criticalTasks: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
        domainId: 'frontend-infrastructure',
        title: 'Fix HTML Structure Collapse',
        description: 'Repair HTML structure rendering issues causing plain text display',
        priority: 1,
        status: 'pending',
        estimatedDuration: 60, // minutes
        dependencies: [],
        revenueImpact: 100, // High impact - site unusable
      },
      {
        domainId: 'frontend-infrastructure',
        title: 'Fix Asset Loading Breakdown',
        description: 'Repair CSS/JS/image loading issues',
        priority: 1,
        status: 'pending',
        estimatedDuration: 45,
        dependencies: ['fix-html-structure'],
        revenueImpact: 90,
      },
      {
        domainId: 'marvel-quiz',
        title: 'Fix Marvel Quiz Complete Failure',
        description: 'Restore Marvel Quiz game functionality - currently empty page',
        priority: 1,
        status: 'pending',
        estimatedDuration: 90,
        dependencies: ['fix-html-structure'],
        revenueImpact: 95, // Flagship feature
      },
      {
        domainId: 'design-system',
        title: 'Restore Glassmorphism Effects',
        description: 'Fix glassmorphism design system not applying',
        priority: 2,
        status: 'pending',
        estimatedDuration: 30,
        dependencies: ['fix-asset-loading'],
        revenueImpact: 60,
      },
      {
        domainId: 'digital-ecosystem',
        title: 'Fix Digital Ecosystem Disconnection',
        description: 'Repair broken domain links and network integrations',
        priority: 3,
        status: 'pending',
        estimatedDuration: 45,
        dependencies: ['fix-html-structure'],
        revenueImpact: 40,
      }
    ];

    criticalTasks.forEach(taskData => {
      this.createTask(taskData);
    });
  }

  public createTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task {
    const task: Task = {
      ...taskData,
      id: this.generateTaskId(taskData.title),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.tasks.set(task.id, task);
    this.domainManager.addTaskToDomain(task.domainId, task);
    this.addToExecutionQueue(task);

    this.emitEvent({
      id: `task-created-${task.id}`,
      type: 'task_created',
      timestamp: new Date(),
      domainId: task.domainId,
      taskId: task.id,
      data: { task },
      severity: 'info'
    });

    console.log(`Task created: ${task.title} (${task.id})`);
    return task;
  }

  private generateTaskId(title: string): string {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return `${slug}-${Date.now()}`;
  }

  private addToExecutionQueue(task: Task): void {
    // Check if dependencies are met
    if (this.areDependenciesMet(task)) {
      this.executionQueue.push(task);
      this.sortExecutionQueue();
    }
  }

  private areDependenciesMet(task: Task): boolean {
    return task.dependencies.every(depId => {
      const depResult = this.completedTasks.get(depId);
      return depResult && depResult.success;
    });
  }

  private sortExecutionQueue(): void {
    this.executionQueue.sort((a, b) => {
      const scoreA = this.calculateTaskPriority(a);
      const scoreB = this.calculateTaskPriority(b);
      return scoreB - scoreA; // Higher score = higher priority
    });
  }

  private calculateTaskPriority(task: Task): number {
    const domain = this.domainManager.getDomain(task.domainId);
    if (!domain) return 0;

    // Revenue Impact Score (0-100)
    const revenueScore = task.revenueImpact;

    // Domain Priority Score (0-100)
    const domainPriorityScore = {
      'critical': 100,
      'high': 75,
      'medium': 50,
      'low': 25
    }[domain.priority];

    // Dependency Chain Score (0-100)
    // Tasks with fewer dependencies and that unblock others get higher scores
    const dependencyScore = Math.max(0, 100 - (task.dependencies.length * 20));

    // Resource Availability Score (0-100)
    // Based on available agents in the domain
    const availableAgents = domain.agents.filter(a => a.status === 'idle').length;
    const resourceScore = Math.min(100, availableAgents * 25);

    // Calculate weighted score
    const totalScore = 
      (revenueScore * this.config.priorityWeights.revenueImpact) +
      (domainPriorityScore * this.config.priorityWeights.domainPriority) +
      (dependencyScore * this.config.priorityWeights.dependencyChain) +
      (resourceScore * this.config.priorityWeights.resourceAvailability);

    return totalScore;
  }

  public assignTask(taskId: string, agentId: string): boolean {
    const task = this.tasks.get(taskId);
    if (!task || task.status !== 'pending') {
      return false;
    }

    const domain = this.domainManager.getDomain(task.domainId);
    if (!domain) return false;

    const agent = domain.agents.find(a => a.id === agentId);
    if (!agent || agent.status !== 'idle') {
      return false;
    }

    // Assign task to agent
    task.assignedAgent = agentId;
    task.status = 'in_progress';
    task.updatedAt = new Date();
    
    agent.currentTask = taskId;
    agent.status = 'busy';
    agent.lastActivity = new Date();

    // Move from queue to running tasks
    this.executionQueue = this.executionQueue.filter(t => t.id !== taskId);
    this.runningTasks.set(taskId, task);

    this.emitEvent({
      id: `task-assigned-${taskId}`,
      type: 'task_assigned',
      timestamp: new Date(),
      domainId: task.domainId,
      taskId: task.id,
      agentId,
      data: { task, agent },
      severity: 'info'
    });

    console.log(`Task assigned: ${task.title} → Agent ${agent.name}`);
    return true;
  }

  public completeTask(taskId: string, result: Omit<TaskExecutionResult, 'taskId' | 'timestamp'>): void {
    const task = this.runningTasks.get(taskId);
    if (!task) {
      console.error(`Task not found in running tasks: ${taskId}`);
      return;
    }

    const executionResult: TaskExecutionResult = {
      ...result,
      taskId,
      timestamp: new Date()
    };

    // Update task status
    task.status = result.success ? 'completed' : 'failed';
    task.updatedAt = new Date();
    task.actualDuration = result.duration;
    
    if (!result.success && result.error) {
      task.errorMessage = result.error;
    }

    if (result.success) {
      task.completedAt = new Date();
    }

    // Free up the agent
    if (task.assignedAgent) {
      const domain = this.domainManager.getDomain(task.domainId);
      if (domain) {
        const agent = domain.agents.find(a => a.id === task.assignedAgent);
        if (agent) {
          agent.status = 'idle';
          agent.currentTask = undefined;
          agent.lastActivity = new Date();
          
          // Update agent performance
          agent.performance.tasksCompleted++;
          if (result.success) {
            agent.performance.successRate = 
              (agent.performance.successRate * (agent.performance.tasksCompleted - 1) + 1) / 
              agent.performance.tasksCompleted;
          } else {
            agent.performance.successRate = 
              (agent.performance.successRate * (agent.performance.tasksCompleted - 1)) / 
              agent.performance.tasksCompleted;
          }
          
          agent.performance.averageCompletionTime = 
            (agent.performance.averageCompletionTime * (agent.performance.tasksCompleted - 1) + result.duration) / 
            agent.performance.tasksCompleted;
        }
      }
    }

    // Move from running to completed
    this.runningTasks.delete(taskId);
    this.completedTasks.set(taskId, executionResult);

    // Check for tasks that can now be executed (dependencies met)
    this.checkDependentTasks(taskId);

    // Update domain status if this was a critical repair
    this.updateDomainStatusAfterTask(task, result.success);

    this.emitEvent({
      id: `task-completed-${taskId}`,
      type: 'task_completed',
      timestamp: new Date(),
      domainId: task.domainId,
      taskId: task.id,
      data: { task, result: executionResult },
      severity: result.success ? 'info' : 'error'
    });

    console.log(`Task ${result.success ? 'completed' : 'failed'}: ${task.title}`);
  }

  private checkDependentTasks(completedTaskId: string): void {
    const pendingTasks = Array.from(this.tasks.values()).filter(t => 
      t.status === 'pending' && 
      t.dependencies.includes(completedTaskId) &&
      !this.executionQueue.includes(t)
    );

    pendingTasks.forEach(task => {
      if (this.areDependenciesMet(task)) {
        this.addToExecutionQueue(task);
      }
    });
  }

  private updateDomainStatusAfterTask(task: Task, success: boolean): void {
    const domain = this.domainManager.getDomain(task.domainId);
    if (!domain) return;

    // Update domain status based on critical task completion
    if (success && task.priority === 1) {
      // Critical task completed successfully
      if (domain.status === 'failed') {
        this.domainManager.updateDomainStatus(task.domainId, 'degraded');
      } else if (domain.status === 'degraded') {
        // Check if all critical tasks for this domain are complete
        const criticalTasks = Array.from(this.tasks.values()).filter(t => 
          t.domainId === task.domainId && t.priority === 1
        );
        const completedCriticalTasks = criticalTasks.filter(t => t.status === 'completed');
        
        if (completedCriticalTasks.length === criticalTasks.length) {
          this.domainManager.updateDomainStatus(task.domainId, 'healthy');
        }
      }
    }
  }

  private startTaskExecution(): void {
    this.executionInterval = setInterval(() => {
      this.processExecutionQueue();
    }, 5000); // Check every 5 seconds
  }

  private processExecutionQueue(): void {
    const maxConcurrent = this.config.maxConcurrentTasks;
    const currentRunning = this.runningTasks.size;
    const availableSlots = maxConcurrent - currentRunning;

    if (availableSlots <= 0 || this.executionQueue.length === 0) {
      return;
    }

    // Try to assign tasks to available agents
    for (let i = 0; i < Math.min(availableSlots, this.executionQueue.length); i++) {
      const task = this.executionQueue[i];
      const agent = this.findAvailableAgent(task.domainId);
      
      if (agent) {
        this.assignTask(task.id, agent.id);
        // Start task execution simulation
        this.simulateTaskExecution(task);
      }
    }
  }

  private findAvailableAgent(domainId: string): Agent | null {
    const domain = this.domainManager.getDomain(domainId);
    if (!domain) return null;

    return domain.agents.find(a => a.status === 'idle') || null;
  }

  private simulateTaskExecution(task: Task): void {
    // Simulate task execution with realistic timing
    const executionTime = task.estimatedDuration * 1000; // Convert to milliseconds
    
    setTimeout(() => {
      // Simulate success/failure based on task complexity
      const successRate = this.calculateTaskSuccessRate(task);
      const success = Math.random() < successRate;
      
      this.completeTask(task.id, {
        success,
        duration: task.estimatedDuration + (Math.random() * 10 - 5), // ±5 minute variance
        output: success ? `Task ${task.title} completed successfully` : undefined,
        error: success ? undefined : `Task ${task.title} failed due to system constraints`,
        metrics: {
          complexity: task.priority,
          revenueImpact: task.revenueImpact
        }
      });
    }, Math.min(executionTime, 10000)); // Cap at 10 seconds for demo
  }

  private calculateTaskSuccessRate(task: Task): number {
    const domain = this.domainManager.getDomain(task.domainId);
    if (!domain) return 0.5;

    // Base success rate depends on domain health
    let baseRate = 0.9;
    if (domain.status === 'degraded') baseRate = 0.7;
    if (domain.status === 'failed') baseRate = 0.5;

    // Adjust for task priority (higher priority = more critical = potentially harder)
    const priorityAdjustment = (6 - task.priority) * 0.05; // Priority 1 = +0.25, Priority 5 = -0.05
    
    return Math.max(0.1, Math.min(0.95, baseRate + priorityAdjustment));
  }

  public getTaskStatus(taskId: string): Task | undefined {
    return this.tasks.get(taskId);
  }

  public getExecutionQueue(): Task[] {
    return [...this.executionQueue];
  }

  public getRunningTasks(): Task[] {
    return Array.from(this.runningTasks.values());
  }

  public getCompletedTasks(): TaskExecutionResult[] {
    return Array.from(this.completedTasks.values());
  }

  public getTasksByDomain(domainId: string): Task[] {
    return Array.from(this.tasks.values()).filter(t => t.domainId === domainId);
  }

  public getAllTasks(): Task[] {
    return Array.from(this.tasks.values());
  }

  public addEventListener(eventType: string, callback: Function): void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, []);
    }
    this.eventListeners.get(eventType)!.push(callback);
  }

  private emitEvent(event: CoordinationEvent): void {
    const listeners = this.eventListeners.get(event.type) || [];
    listeners.forEach(callback => {
      try {
        callback(event);
      } catch (error) {
        console.error('Error in event listener:', error);
      }
    });
  }

  public destroy(): void {
    if (this.executionInterval) {
      clearInterval(this.executionInterval);
      this.executionInterval = null;
    }
    this.tasks.clear();
    this.executionQueue = [];
    this.runningTasks.clear();
    this.completedTasks.clear();
    this.eventListeners.clear();
  }
}