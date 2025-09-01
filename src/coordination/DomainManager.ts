import { 
  Domain, 
  Task, 
  Agent, 
  DomainMetrics, 
  CoordinationEvent, 
  SystemHealth, 
  Alert,
  DomainId,
  FrontendInfrastructureDomain,
  MarvelQuizDomain,
  DesignSystemDomain,
  DigitalEcosystemDomain,
  AnalyticsMonitoringDomain,
  AnyDomain
} from '../types/coordination';

export class DomainManager {
  private domains: Map<string, AnyDomain> = new Map();
  private eventListeners: Map<string, Function[]> = new Map();
  private healthCheckInterval: NodeJS.Timeout | null = null;
  private systemHealth: SystemHealth;

  constructor() {
    this.systemHealth = {
      overallStatus: 'healthy',
      overallScore: 100,
      agentUtilization: 0,
      taskThroughput: 0,
      errorRate: 0,
      averageResponseTime: 0,
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
      agents: []
    };
    
    // Domains will be initialized when initialize() is called
  }

  async initialize(): Promise<void> {
    this.initializeDomains();
    this.startHealthMonitoring();
  }

  private initializeDomains(): void {
    // Initialize Frontend Infrastructure Domain
    const frontendDomain: FrontendInfrastructureDomain = {
      id: 'frontend-infrastructure',
      name: 'Frontend Infrastructure',
      priority: 'critical',
      status: 'failed', // Starting as failed due to HTML structure issues
      agents: [],
      tasks: [],
      metrics: this.createDefaultMetrics(),
      lastHealthCheck: new Date(),
      description: 'Manages HTML structure, CSS/JS assets, and component rendering',
      htmlStructureStatus: 'corrupted',
      assetLoadingStatus: 'failed',
      componentRenderingStatus: 'broken'
    };

    // Initialize Marvel Quiz Domain
    const marvelQuizDomain: MarvelQuizDomain = {
      id: 'marvel-quiz',
      name: 'Marvel Quiz Application',
      priority: 'critical',
      status: 'failed', // Starting as failed due to empty quiz page
      agents: [],
      tasks: [],
      metrics: this.createDefaultMetrics(),
      lastHealthCheck: new Date(),
      description: 'Manages quiz game functionality and interactive components',
      gameEngineStatus: 'error',
      questionDatabaseStatus: 'disconnected',
      userSessionStatus: 'inactive',
      scoreSystemStatus: 'malfunctioning'
    };

    // Initialize Design System Domain
    const designSystemDomain: DesignSystemDomain = {
      id: 'design-system',
      name: 'Design System',
      priority: 'high',
      status: 'degraded', // Glassmorphism effects not working
      agents: [],
      tasks: [],
      metrics: this.createDefaultMetrics(),
      lastHealthCheck: new Date(),
      description: 'Manages glassmorphism effects, typography, and animations',
      glassmorphismStatus: 'disabled',
      typographySystemStatus: 'loaded',
      animationFrameworkStatus: 'inactive',
      colorSystemStatus: 'inconsistent'
    };

    // Initialize Digital Ecosystem Domain
    const digitalEcosystemDomain: DigitalEcosystemDomain = {
      id: 'digital-ecosystem',
      name: 'Digital Ecosystem',
      priority: 'medium',
      status: 'degraded', // Broken domain links
      agents: [],
      tasks: [],
      metrics: this.createDefaultMetrics(),
      lastHealthCheck: new Date(),
      description: 'Manages cross-domain linking and network integrations',
      crossDomainLinkingStatus: 'broken',
      apiConnectivityStatus: 'intermittent',
      networkIntegrationStatus: 'unstable'
    };

    // Initialize Analytics & Monitoring Domain
    const analyticsMonitoringDomain: AnalyticsMonitoringDomain = {
      id: 'analytics-monitoring',
      name: 'Analytics & Monitoring',
      priority: 'medium',
      status: 'healthy', // This domain is working for coordination
      agents: [],
      tasks: [],
      metrics: this.createDefaultMetrics(),
      lastHealthCheck: new Date(),
      description: 'Manages performance tracking and error monitoring',
      performanceTrackingStatus: 'active',
      errorMonitoringStatus: 'operational',
      userExperienceMetricsStatus: 'collecting'
    };

    // Register all domains
    this.registerDomain(frontendDomain);
    this.registerDomain(marvelQuizDomain);
    this.registerDomain(designSystemDomain);
    this.registerDomain(digitalEcosystemDomain);
    this.registerDomain(analyticsMonitoringDomain);
  }

  private createDefaultMetrics(): DomainMetrics {
    return {
      uptime: 0,
      responseTime: 0,
      errorRate: 100, // Starting high due to current issues
      throughput: 0,
      healthScore: 0,
      lastUpdated: new Date()
    };
  }

  public registerDomain(domain: AnyDomain): void {
    this.domains.set(domain.id, domain);
    this.systemHealth.domainStatuses[domain.id] = domain.status;
    
    this.emitEvent({
      id: `domain-registered-${domain.id}-${Date.now()}`,
      type: 'domain_status_changed',
      timestamp: new Date(),
      domainId: domain.id,
      data: { domain },
      severity: 'info'
    });

    console.log(`Domain registered: ${domain.name} (${domain.id})`);
  }

  public getDomain(domainId: string): AnyDomain | undefined {
    return this.domains.get(domainId);
  }

  public getAllDomains(): AnyDomain[] {
    return Array.from(this.domains.values());
  }

  public updateDomainStatus(domainId: string, status: 'healthy' | 'degraded' | 'failed'): void {
    const domain = this.domains.get(domainId);
    if (!domain) {
      console.error(`Domain not found: ${domainId}`);
      return;
    }

    const previousStatus = domain.status;
    domain.status = status;
    domain.lastHealthCheck = new Date();
    this.systemHealth.domainStatuses[domainId] = status;

    // Update health score based on status
    switch (status) {
      case 'healthy':
        domain.metrics.healthScore = 100;
        domain.metrics.errorRate = 0;
        break;
      case 'degraded':
        domain.metrics.healthScore = 60;
        domain.metrics.errorRate = 25;
        break;
      case 'failed':
        domain.metrics.healthScore = 0;
        domain.metrics.errorRate = 100;
        break;
    }

    domain.metrics.lastUpdated = new Date();

    // Create alert if status worsened
    if (this.isStatusWorse(previousStatus, status)) {
      this.createAlert({
        id: `domain-status-alert-${domainId}-${Date.now()}`,
        type: 'domain_failure',
        severity: status === 'failed' ? 'critical' : 'warning',
        message: `Domain ${domain.name} status changed from ${previousStatus} to ${status}`,
        domainId,
        timestamp: new Date(),
        acknowledged: false
      });
    }

    this.emitEvent({
      id: `domain-status-${domainId}-${Date.now()}`,
      type: 'domain_status_changed',
      timestamp: new Date(),
      domainId,
      data: { previousStatus, newStatus: status },
      severity: status === 'failed' ? 'critical' : status === 'degraded' ? 'warning' : 'info'
    });

    this.updateSystemHealth();
  }

  private isStatusWorse(previous: string, current: string): boolean {
    const statusOrder = { 'healthy': 0, 'degraded': 1, 'failed': 2 };
    return statusOrder[current as keyof typeof statusOrder] > statusOrder[previous as keyof typeof statusOrder];
  }

  public addTaskToDomain(domainId: string, task: Task): void {
    const domain = this.domains.get(domainId);
    if (!domain) {
      console.error(`Domain not found: ${domainId}`);
      return;
    }

    domain.tasks.push(task);
    this.systemHealth.activeTaskCount++;

    this.emitEvent({
      id: `task-added-${task.id}`,
      type: 'task_created',
      timestamp: new Date(),
      domainId,
      taskId: task.id,
      data: { task },
      severity: 'info'
    });
  }

  public addAgentToDomain(domainId: string, agent: Agent): void {
    const domain = this.domains.get(domainId);
    if (!domain) {
      console.error(`Domain not found: ${domainId}`);
      return;
    }

    domain.agents.push(agent);
    if (agent.status === 'idle') {
      this.systemHealth.availableAgentCount++;
    }

    this.emitEvent({
      id: `agent-added-${agent.id}`,
      type: 'agent_status_changed',
      timestamp: new Date(),
      domainId,
      agentId: agent.id,
      data: { agent },
      severity: 'info'
    });
  }

  public getSystemHealth(): SystemHealth {
    this.updateSystemHealth();
    return { ...this.systemHealth };
  }

  private updateSystemHealth(): void {
    const domains = Array.from(this.domains.values());
    const healthScores = domains.map(d => d.metrics.healthScore);
    const averageScore = healthScores.reduce((sum, score) => sum + score, 0) / healthScores.length;

    this.systemHealth.overallScore = Math.round(averageScore);
    
    if (averageScore >= 80) {
      this.systemHealth.overallStatus = 'healthy';
    } else if (averageScore >= 40) {
      this.systemHealth.overallStatus = 'degraded';
    } else {
      this.systemHealth.overallStatus = 'critical';
    }

    this.systemHealth.lastUpdated = new Date();
  }

  private createAlert(alert: Alert): void {
    this.systemHealth.alerts.push(alert);
    
    this.emitEvent({
      id: `alert-created-${alert.id}`,
      type: 'task_created', // Using existing type for now
      timestamp: new Date(),
      domainId: alert.domainId,
      data: { alert },
      severity: alert.severity === 'critical' ? 'critical' : 'warning'
    });

    console.warn(`Alert created: ${alert.message}`);
  }

  public acknowledgeAlert(alertId: string): void {
    const alert = this.systemHealth.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
    }
  }

  public resolveAlert(alertId: string): void {
    const alert = this.systemHealth.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.resolvedAt = new Date();
    }
  }

  private startHealthMonitoring(): void {
    this.healthCheckInterval = setInterval(() => {
      this.performHealthCheck();
    }, 30000); // Check every 30 seconds
  }

  private performHealthCheck(): void {
    const domains = Array.from(this.domains.values());
    
    domains.forEach(domain => {
      // Simulate health check logic
      // In a real implementation, this would check actual system status
      domain.lastHealthCheck = new Date();
      
      // Update metrics based on current status
      if (domain.status === 'healthy') {
        domain.metrics.uptime = Math.min(100, domain.metrics.uptime + 1);
      } else {
        domain.metrics.uptime = Math.max(0, domain.metrics.uptime - 2);
      }
      
      domain.metrics.lastUpdated = new Date();
    });

    this.updateSystemHealth();
  }

  public addEventListener(eventType: string, callback: Function): void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, []);
    }
    this.eventListeners.get(eventType)!.push(callback);
  }

  public removeEventListener(eventType: string, callback: Function): void {
    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
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

    // Also emit to 'all' listeners
    const allListeners = this.eventListeners.get('all') || [];
    allListeners.forEach(callback => {
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
    this.domains.clear();
    this.eventListeners.clear();
  }

  // Utility methods for specific domain operations
  public getDomainsByPriority(): AnyDomain[] {
    const priorityOrder = { 'critical': 0, 'high': 1, 'medium': 2, 'low': 3 };
    return Array.from(this.domains.values()).sort((a, b) => 
      priorityOrder[a.priority] - priorityOrder[b.priority]
    );
  }

  public getFailedDomains(): AnyDomain[] {
    return Array.from(this.domains.values()).filter(d => d.status === 'failed');
  }

  public getDegradedDomains(): AnyDomain[] {
    return Array.from(this.domains.values()).filter(d => d.status === 'degraded');
  }

  public getCriticalAlerts(): Alert[] {
    return this.systemHealth.alerts.filter(a => a.severity === 'critical' && !a.resolvedAt);
  }
}

// Singleton instance
export const domainManager = new DomainManager();