import { 
  Agent, 
  Task, 
  CoordinationConfig, 
  CoordinationEvent, 
  AgentPerformance,
  SystemHealth,
  AgentCapability
} from '../types/coordination';
import { DomainManager } from './DomainManager';
import { TaskCoordinator } from './TaskCoordinator';

export class AgentOrchestrator {
  private agents: Map<string, Agent> = new Map();
  private agentCapabilities: Map<string, string[]> = new Map();
  private loadBalancer: Map<string, number> = new Map(); // domainId -> load score
  private config: CoordinationConfig;
  private domainManager: DomainManager;
  private taskCoordinator: TaskCoordinator;
  private eventListeners: Map<string, Function[]> = new Map();
  private healthCheckInterval: NodeJS.Timeout | null = null;
  private performanceMetrics: Map<string, AgentPerformance> = new Map();

  constructor(
    domainManager: DomainManager, 
    taskCoordinator: TaskCoordinator,
    config?: Partial<CoordinationConfig>
  ) {
    this.domainManager = domainManager;
    this.taskCoordinator = taskCoordinator;
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

    // Agents will be initialized when initialize() is called
  }

  async initialize(): Promise<void> {
    this.initializeAgents();
    this.startHealthMonitoring();
  }

  private initializeAgents(): void {
    // Initialize TRAE agents for each domain
    const agentConfigs = [
      {
        id: 'frontend-repair-agent',
        name: 'Frontend Repair Specialist',
        type: 'repair' as const,
        domainId: 'frontend-infrastructure',
        capabilities: ['html-structure', 'asset-loading', 'css-debugging', 'javascript-debugging'],
        specialization: 'Frontend Infrastructure Repair',
        maxConcurrentTasks: 2
      },
      {
        id: 'marvel-quiz-agent',
        name: 'Marvel Quiz Specialist',
        type: 'repair',
        domainId: 'marvel-quiz',
        capabilities: ['react-components', 'game-logic', 'api-integration', 'state-management'],
        specialization: 'Marvel Quiz Application Development',
        maxConcurrentTasks: 1
      },
      {
        id: 'design-system-agent',
        name: 'Design System Specialist',
        type: 'trae_agent',
        domainId: 'design-system',
        capabilities: ['glassmorphism', 'css-animations', 'responsive-design', 'ui-components'],
        specialization: 'Design System Implementation',
        maxConcurrentTasks: 2
      },
      {
        id: 'ecosystem-integration-agent',
        name: 'Digital Ecosystem Specialist',
        type: 'trae_agent',
        domainId: 'digital-ecosystem',
        capabilities: ['domain-linking', 'api-integration', 'cross-platform', 'networking'],
        specialization: 'Digital Ecosystem Integration',
        maxConcurrentTasks: 1
      },
      {
        id: 'analytics-monitoring-agent',
        name: 'Analytics & Monitoring Specialist',
        type: 'trae_agent',
        domainId: 'analytics-monitoring',
        capabilities: ['performance-monitoring', 'error-tracking', 'analytics-dashboard', 'reporting'],
        specialization: 'Analytics and System Monitoring',
        maxConcurrentTasks: 3
      }
    ];

    agentConfigs.forEach(config => {
      const agent: Agent = {
        id: config.id,
        name: config.name,
        type: 'trae_agent',
        domainId: config.domainId,
        status: 'idle',
        capabilities: config.capabilities.filter(cap => [
          'html-repair', 'css-fixing', 'js-debugging', 'asset-optimization', 
          'component-restoration', 'game-engine-repair', 'database-recovery', 
          'ui-restoration', 'network-diagnostics', 'performance-monitoring'
        ].includes(cap)) as AgentCapability[],
        specialization: config.specialization,
        maxConcurrentTasks: config.maxConcurrentTasks,
        lastActivity: new Date(),
        performance: {
          tasksCompleted: 0,
          successRate: 1.0,
          averageCompletionTime: 0,
          efficiency: 1.0
        },
        description: `${config.name} agent specialized in ${config.specialization}`
      };

      this.registerAgent(agent);
    });
  }

  public registerAgent(agent: Agent): void {
    this.agents.set(agent.id, agent);
    this.agentCapabilities.set(agent.id, agent.capabilities);
    this.performanceMetrics.set(agent.id, agent.performance);
    
    // Add agent to its domain
    this.domainManager.addAgentToDomain(agent.domainId, agent);
    
    // Initialize load balancer entry
    this.loadBalancer.set(agent.domainId, 0);

    this.emitEvent({
      id: `agent-registered-${agent.id}`,
      type: 'agent_registered',
      timestamp: new Date(),
      domainId: agent.domainId,
      agentId: agent.id,
      data: { agent },
      severity: 'info'
    });

    console.log(`Agent registered: ${agent.name} (${agent.id}) in domain ${agent.domainId}`);
  }

  public assignTaskToAgent(taskId: string, agentId?: string): boolean {
    const task = this.taskCoordinator.getTaskStatus(taskId);
    if (!task || task.status !== 'pending') {
      console.error(`Task not available for assignment: ${taskId}`);
      return false;
    }

    let selectedAgent: Agent | null = null;

    if (agentId) {
      // Specific agent requested
      selectedAgent = this.agents.get(agentId) || null;
      if (!selectedAgent || !this.isAgentAvailable(selectedAgent)) {
        console.error(`Requested agent not available: ${agentId}`);
        return false;
      }
    } else {
      // Auto-select best agent for the task
      selectedAgent = this.selectBestAgent(task);
    }

    if (!selectedAgent) {
      console.error(`No suitable agent found for task: ${taskId}`);
      return false;
    }

    // Verify agent can handle the task
    if (!this.canAgentHandleTask(selectedAgent, task)) {
      console.error(`Agent ${selectedAgent.id} cannot handle task ${taskId}`);
      return false;
    }

    // Assign the task
    return this.taskCoordinator.assignTask(taskId, selectedAgent.id);
  }

  private selectBestAgent(task: Task): Agent | null {
    // Get agents from the task's domain
    const domain = this.domainManager.getDomain(task.domainId);
    if (!domain) return null;

    const availableAgents = domain.agents.filter(agent => 
      this.isAgentAvailable(agent) && this.canAgentHandleTask(agent, task)
    );

    if (availableAgents.length === 0) {
      return null;
    }

    // Score agents based on multiple factors
    const scoredAgents = availableAgents.map(agent => ({
      agent,
      score: this.calculateAgentScore(agent, task)
    }));

    // Sort by score (highest first)
    scoredAgents.sort((a, b) => b.score - a.score);

    return scoredAgents[0].agent;
  }

  private calculateAgentScore(agent: Agent, task: Task): number {
    let score = 0;

    // Performance score (0-40 points)
    const performance = this.performanceMetrics.get(agent.id);
    if (performance) {
      score += performance.successRate * 30; // 0-30 points
      
      // Bonus for fast completion times
      if (performance.averageCompletionTime > 0) {
        const speedBonus = Math.max(0, 10 - (performance.averageCompletionTime / 60)); // 0-10 points
        score += speedBonus;
      }
    }

    // Capability match score (0-30 points)
    const requiredCapabilities = this.inferTaskCapabilities(task);
    const matchingCapabilities = agent.capabilities.filter(cap => 
      requiredCapabilities.includes(cap)
    ).length;
    const capabilityScore = (matchingCapabilities / Math.max(1, requiredCapabilities.length)) * 30;
    score += capabilityScore;

    // Load balancing score (0-20 points)
    const currentLoad = this.getCurrentAgentLoad(agent);
    const maxLoad = agent.maxConcurrentTasks || 1;
    const loadScore = Math.max(0, 20 - ((currentLoad / maxLoad) * 20));
    score += loadScore;

    // Specialization bonus (0-10 points)
    if (this.isTaskInSpecialization(task, agent.specialization)) {
      score += 10;
    }

    return score;
  }

  private inferTaskCapabilities(task: Task): string[] {
    const capabilities: string[] = [];
    const title = task.title.toLowerCase();
    const description = task.description.toLowerCase();
    const content = `${title} ${description}`;

    // Map task content to required capabilities
    const capabilityMap = {
      'html-structure': ['html', 'structure', 'markup', 'dom'],
      'asset-loading': ['asset', 'css', 'javascript', 'image', 'loading'],
      'css-debugging': ['css', 'style', 'styling', 'design'],
      'javascript-debugging': ['javascript', 'js', 'script', 'function'],
      'react-components': ['react', 'component', 'jsx', 'tsx'],
      'game-logic': ['game', 'quiz', 'logic', 'gameplay'],
      'api-integration': ['api', 'integration', 'endpoint', 'service'],
      'state-management': ['state', 'store', 'data', 'management'],
      'glassmorphism': ['glassmorphism', 'glass', 'effect', 'blur'],
      'css-animations': ['animation', 'transition', 'effect'],
      'responsive-design': ['responsive', 'mobile', 'tablet', 'breakpoint'],
      'ui-components': ['ui', 'component', 'interface', 'element'],
      'domain-linking': ['domain', 'link', 'url', 'navigation'],
      'cross-platform': ['platform', 'integration', 'ecosystem'],
      'networking': ['network', 'connection', 'communication'],
      'performance-monitoring': ['performance', 'monitoring', 'metrics'],
      'error-tracking': ['error', 'tracking', 'debugging', 'issue'],
      'analytics-dashboard': ['analytics', 'dashboard', 'reporting'],
      'reporting': ['report', 'data', 'analysis']
    };

    Object.entries(capabilityMap).forEach(([capability, keywords]) => {
      if (keywords.some(keyword => content.includes(keyword))) {
        capabilities.push(capability);
      }
    });

    const validCapabilities: AgentCapability[] = [
      'html-repair', 'css-fixing', 'js-debugging', 'asset-optimization', 
      'component-restoration', 'game-engine-repair', 'database-recovery', 
      'ui-restoration', 'network-diagnostics', 'performance-monitoring'
    ];
    return capabilities.filter(cap => validCapabilities.includes(cap as AgentCapability)) as AgentCapability[];
  }

  private isTaskInSpecialization(task: Task, specialization: string): boolean {
    const taskContent = `${task.title} ${task.description}`.toLowerCase();
    const spec = specialization.toLowerCase();
    
    return taskContent.includes(spec.split(' ')[0]) || 
           spec.includes(task.domainId.replace('-', ' '));
  }

  private isAgentAvailable(agent: Agent): boolean {
    if (agent.status !== 'idle') {
      return false;
    }

    const currentLoad = this.getCurrentAgentLoad(agent);
    const maxLoad = agent.maxConcurrentTasks || 1;
    
    return currentLoad < maxLoad;
  }

  private getCurrentAgentLoad(agent: Agent): number {
    const runningTasks = this.taskCoordinator.getRunningTasks();
    return runningTasks.filter(task => task.assignedAgent === agent.id).length;
  }

  private canAgentHandleTask(agent: Agent, task: Task): boolean {
    // Check if agent is in the correct domain
    if (agent.domainId !== task.domainId) {
      return false;
    }

    // Check if agent has required capabilities
    const requiredCapabilities = this.inferTaskCapabilities(task);
    const hasRequiredCapabilities = requiredCapabilities.length === 0 || 
      requiredCapabilities.some(cap => agent.capabilities.includes(cap as AgentCapability));

    return hasRequiredCapabilities;
  }

  public updateAgentStatus(agentId: string, status: Agent['status']): void {
    const agent = this.agents.get(agentId);
    if (!agent) {
      console.error(`Agent not found: ${agentId}`);
      return;
    }

    const oldStatus = agent.status;
    agent.status = status;
    agent.lastActivity = new Date();

    this.emitEvent({
      id: `agent-status-${agentId}-${Date.now()}`,
      type: 'agent_status_changed',
      timestamp: new Date(),
      domainId: agent.domainId,
      agentId: agent.id,
      data: { agent, oldStatus, newStatus: status },
      severity: 'info'
    });

    console.log(`Agent ${agent.name} status changed: ${oldStatus} → ${status}`);
  }

  public updateAgentPerformance(agentId: string, metrics: Partial<AgentPerformance>): void {
    const agent = this.agents.get(agentId);
    if (!agent) {
      console.error(`Agent not found: ${agentId}`);
      return;
    }

    const performance = this.performanceMetrics.get(agentId);
    if (performance) {
      Object.assign(performance, metrics, { lastUpdated: new Date() });
      agent.performance = performance;
    }
  }

  public getAgentWorkload(): Map<string, number> {
    const workload = new Map<string, number>();
    
    this.agents.forEach(agent => {
      const load = this.getCurrentAgentLoad(agent);
      workload.set(agent.id, load);
    });

    return workload;
  }

  public getDomainLoadBalance(): Map<string, number> {
    const domainLoads = new Map<string, number>();
    
    // Calculate load for each domain
    this.domainManager.getAllDomains().forEach(domain => {
      const totalTasks = domain.agents.reduce((sum, agent) => 
        sum + this.getCurrentAgentLoad(agent), 0
      );
      const totalCapacity = domain.agents.reduce((sum, agent) => 
        sum + (agent.maxConcurrentTasks || 1), 0
      );
      
      const loadPercentage = totalCapacity > 0 ? (totalTasks / totalCapacity) * 100 : 0;
      domainLoads.set(domain.id, loadPercentage);
    });

    return domainLoads;
  }

  public getSystemHealth(): SystemHealth {
    const allAgents = Array.from(this.agents.values());
    const activeAgents = allAgents.filter(a => a.status !== 'offline');
    const busyAgents = allAgents.filter(a => a.status === 'busy');
    
    const totalTasks = this.taskCoordinator.getRunningTasks().length;
    const completedTasks = this.taskCoordinator.getCompletedTasks();
    const failedTasks = completedTasks.filter(t => !t.success).length;
    
    const overallSuccessRate = completedTasks.length > 0 ? 
      (completedTasks.length - failedTasks) / completedTasks.length : 1.0;
    
    const avgResponseTime = this.calculateAverageResponseTime();
    
    const overallScore = this.calculateOverallHealthScore();
    const status = overallSuccessRate > 0.8 ? 'healthy' as const : overallSuccessRate > 0.5 ? 'degraded' as const : 'critical' as const;
    
    return {
      overallStatus: status,
      overallScore: overallScore,
      agentUtilization: (busyAgents.length / Math.max(1, activeAgents.length)) * 100,
      taskThroughput: this.calculateTaskThroughput(),
      errorRate: completedTasks.length > 0 ? failedTasks / completedTasks.length : 0,
      averageResponseTime: avgResponseTime,
      domainStatuses: this.getDomainStatuses(),
      activeTaskCount: totalTasks,
      availableAgentCount: activeAgents.length,
      activeAgents: activeAgents.length,
      totalAgents: allAgents.length,
      domainHealth: this.getDomainHealthScores(),
      lastUpdated: new Date(),
      alerts: [],
      tasks: this.taskCoordinator.getAllTasks(),
      domains: this.domainManager.getAllDomains(),
      agents: allAgents,
      status: status,
      score: overallScore
    };
  }

  private calculateOverallHealthScore(): number {
    const domainScores = this.getDomainHealthScores();
    const avgDomainScore = Object.values(domainScores).reduce((sum, score) => sum + score, 0) / 
                          Math.max(1, Object.keys(domainScores).length);
    
    const agentHealth = this.calculateAgentHealthScore();
    const taskHealth = this.calculateTaskHealthScore();
    
    return (avgDomainScore * 0.4 + agentHealth * 0.3 + taskHealth * 0.3);
  }

  private getDomainStatuses(): Record<string, 'healthy' | 'degraded' | 'failed'> {
    const statuses: Record<string, 'healthy' | 'degraded' | 'failed'> = {};
    
    this.domainManager.getAllDomains().forEach(domain => {
      statuses[domain.id] = domain.status;
    });
    
    return statuses;
  }

  private getDomainHealthScores(): Record<string, number> {
    const scores: Record<string, number> = {};
    
    this.domainManager.getAllDomains().forEach(domain => {
      let score = 100;
      
      // Reduce score based on domain status
      switch (domain.status) {
        case 'failed': score = 20; break;
        case 'degraded': score = 60; break;
        case 'healthy': score = 100; break;
      }
      
      // Adjust based on agent availability
      const availableAgents = domain.agents.filter(a => a.status === 'idle').length;
      const totalAgents = domain.agents.length;
      if (totalAgents > 0) {
        const availabilityRatio = availableAgents / totalAgents;
        score = score * (0.7 + 0.3 * availabilityRatio);
      }
      
      scores[domain.id] = Math.round(score);
    });
    
    return scores;
  }

  private calculateAgentHealthScore(): number {
    const allAgents = Array.from(this.agents.values());
    if (allAgents.length === 0) return 0;
    
    const healthyAgents = allAgents.filter(a => a.status !== 'offline').length;
    const avgSuccessRate = allAgents.reduce((sum, agent) => 
      sum + agent.performance.successRate, 0
    ) / allAgents.length;
    
    const availabilityScore = (healthyAgents / allAgents.length) * 100;
    const performanceScore = avgSuccessRate * 100;
    
    return (availabilityScore * 0.6 + performanceScore * 0.4);
  }

  private calculateTaskHealthScore(): number {
    const completedTasks = this.taskCoordinator.getCompletedTasks();
    if (completedTasks.length === 0) return 100;
    
    const successfulTasks = completedTasks.filter(t => t.success).length;
    const successRate = successfulTasks / completedTasks.length;
    
    return successRate * 100;
  }

  private calculateTaskThroughput(): number {
    const completedTasks = this.taskCoordinator.getCompletedTasks();
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    
    const recentTasks = completedTasks.filter(t => t.timestamp >= oneHourAgo);
    return recentTasks.length;
  }

  private calculateAverageResponseTime(): number {
    const allAgents = Array.from(this.agents.values());
    const responseTimes = allAgents
      .map(a => a.performance.averageCompletionTime)
      .filter(time => time > 0);
    
    if (responseTimes.length === 0) return 0;
    
    return responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length;
  }

  private startHealthMonitoring(): void {
    this.healthCheckInterval = setInterval(() => {
      this.performHealthCheck();
    }, this.config.healthCheckIntervalSeconds * 1000);
  }

  private performHealthCheck(): void {
    const systemHealth = this.getSystemHealth();
    
    // Check for alerts
    this.checkHealthAlerts(systemHealth);
    
    // Update domain statuses based on agent health
    this.updateDomainHealthBasedOnAgents();
    
    this.emitEvent({
      id: `health-check-${Date.now()}`,
      type: 'health_check',
      timestamp: new Date(),
      data: { systemHealth },
      severity: systemHealth.overallScore < 50 ? 'warning' : 'info'
    });
  }

  private checkHealthAlerts(health: SystemHealth): void {
    const thresholds = this.config.alertThresholds;
    
    if (health.overallScore < thresholds.domainHealthScore) {
      this.emitEvent({
        id: `alert-low-health-${Date.now()}`,
        type: 'alert',
        timestamp: new Date(),
        data: { 
          type: 'low_system_health',
          score: health.overallScore,
          threshold: thresholds.domainHealthScore
        },
        severity: 'error'
      });
    }
    
    if (health.errorRate > thresholds.taskFailureRate) {
      this.emitEvent({
        id: `alert-high-error-rate-${Date.now()}`,
        type: 'alert',
        timestamp: new Date(),
        data: { 
          type: 'high_error_rate',
          rate: health.errorRate,
          threshold: thresholds.taskFailureRate
        },
        severity: 'error'
      });
    }
    
    if (health.averageResponseTime > thresholds.agentResponseTime) {
      this.emitEvent({
        id: `alert-slow-response-${Date.now()}`,
        type: 'system_alert_raised',
        timestamp: new Date(),
        data: { 
          type: 'slow_response_time',
          time: health.averageResponseTime,
          threshold: thresholds.agentResponseTime
        },
        severity: 'warning'
      });
    }
  }

  private updateDomainHealthBasedOnAgents(): void {
    this.domainManager.getAllDomains().forEach(domain => {
      const activeAgents = domain.agents.filter(a => a.status !== 'offline');
      const healthyAgents = activeAgents.filter(a => a.performance.successRate > 0.8);
      
      if (activeAgents.length === 0) {
        this.domainManager.updateDomainStatus(domain.id, 'failed');
      } else if (healthyAgents.length / activeAgents.length < 0.5) {
        this.domainManager.updateDomainStatus(domain.id, 'degraded');
      } else if (domain.status !== 'healthy') {
        this.domainManager.updateDomainStatus(domain.id, 'healthy');
      }
    });
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
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
    
    this.agents.clear();
    this.agentCapabilities.clear();
    this.loadBalancer.clear();
    this.performanceMetrics.clear();
    this.eventListeners.clear();
  }
}