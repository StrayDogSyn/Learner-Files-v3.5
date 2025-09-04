import { EventEmitter } from 'events';

export interface AnalyticsEvent {
  id: string;
  type: 'ai_request' | 'ai_response' | 'domain_switch' | 'error' | 'performance';
  domain: string;
  timestamp: number;
  data: Record<string, any>;
  userId?: string;
  sessionId: string;
}

export interface PerformanceMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  requestsPerDomain: Record<string, number>;
  errorsByType: Record<string, number>;
  peakRequestTime: number;
  lastUpdated: number;
}

export interface DomainMetrics {
  domain: string;
  totalRequests: number;
  successRate: number;
  averageResponseTime: number;
  activeUsers: number;
  lastActivity: number;
}

export class AnalyticsService extends EventEmitter {
  private events: AnalyticsEvent[] = [];
  private metrics: PerformanceMetrics;
  private domainMetrics: Map<string, DomainMetrics> = new Map();
  private sessionId: string;
  private maxEvents: number = 10000;
  private metricsUpdateInterval: NodeJS.Timeout | null = null;

  constructor() {
    super();
    this.sessionId = this.generateSessionId();
    this.metrics = this.initializeMetrics();
    this.startMetricsUpdater();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeMetrics(): PerformanceMetrics {
    return {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0,
      requestsPerDomain: {},
      errorsByType: {},
      peakRequestTime: 0,
      lastUpdated: Date.now()
    };
  }

  private startMetricsUpdater(): void {
    this.metricsUpdateInterval = setInterval(() => {
      this.updateMetrics();
      this.emit('metrics_updated', this.metrics);
    }, 5000); // Update every 5 seconds
  }

  private updateMetrics(): void {
    const now = Date.now();
    const recentEvents = this.events.filter(event => 
      now - event.timestamp < 300000 // Last 5 minutes
    );

    // Calculate response times
    const responseTimes: number[] = [];
    const requestMap = new Map<string, AnalyticsEvent>();

    recentEvents.forEach(event => {
      if (event.type === 'ai_request') {
        requestMap.set(event.id, event);
      } else if (event.type === 'ai_response') {
        const request = requestMap.get(event.id);
        if (request) {
          const responseTime = event.timestamp - request.timestamp;
          responseTimes.push(responseTime);
        }
      }
    });

    // Update metrics
    this.metrics.totalRequests = this.events.filter(e => e.type === 'ai_request').length;
    this.metrics.successfulRequests = this.events.filter(e => e.type === 'ai_response').length;
    this.metrics.failedRequests = this.events.filter(e => e.type === 'error').length;
    this.metrics.averageResponseTime = responseTimes.length > 0 
      ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length 
      : 0;
    this.metrics.peakRequestTime = Math.max(...responseTimes, 0);
    this.metrics.lastUpdated = now;

    // Update domain-specific metrics
    this.updateDomainMetrics(recentEvents);
  }

  private updateDomainMetrics(events: AnalyticsEvent[]): void {
    const domainStats = new Map<string, {
      requests: number;
      responses: number;
      responseTimes: number[];
      users: Set<string>;
      lastActivity: number;
    }>();

    events.forEach(event => {
      if (!domainStats.has(event.domain)) {
        domainStats.set(event.domain, {
          requests: 0,
          responses: 0,
          responseTimes: [],
          users: new Set(),
          lastActivity: 0
        });
      }

      const stats = domainStats.get(event.domain)!;
      stats.lastActivity = Math.max(stats.lastActivity, event.timestamp);
      
      if (event.userId) {
        stats.users.add(event.userId);
      }

      if (event.type === 'ai_request') {
        stats.requests++;
      } else if (event.type === 'ai_response') {
        stats.responses++;
        if (event.data.responseTime) {
          stats.responseTimes.push(event.data.responseTime);
        }
      }
    });

    // Convert to DomainMetrics
    domainStats.forEach((stats, domain) => {
      const metrics: DomainMetrics = {
        domain,
        totalRequests: stats.requests,
        successRate: stats.requests > 0 ? (stats.responses / stats.requests) * 100 : 0,
        averageResponseTime: stats.responseTimes.length > 0 
          ? stats.responseTimes.reduce((a, b) => a + b, 0) / stats.responseTimes.length 
          : 0,
        activeUsers: stats.users.size,
        lastActivity: stats.lastActivity
      };
      this.domainMetrics.set(domain, metrics);
    });
  }

  public trackEvent(event: Omit<AnalyticsEvent, 'id' | 'timestamp' | 'sessionId'>): void {
    const fullEvent: AnalyticsEvent = {
      ...event,
      id: this.generateEventId(),
      timestamp: Date.now(),
      sessionId: this.sessionId
    };

    this.events.push(fullEvent);
    
    // Maintain event limit
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }

    // Update request counts by domain
    if (event.type === 'ai_request') {
      this.metrics.requestsPerDomain[event.domain] = 
        (this.metrics.requestsPerDomain[event.domain] || 0) + 1;
    }

    // Update error counts by type
    if (event.type === 'error' && event.data.errorType) {
      this.metrics.errorsByType[event.data.errorType] = 
        (this.metrics.errorsByType[event.data.errorType] || 0) + 1;
    }

    this.emit('event_tracked', fullEvent);
  }

  private generateEventId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  public trackAIRequest(domain: string, prompt: string, userId?: string): string {
    const eventId = this.generateEventId();
    this.trackEvent({
      type: 'ai_request',
      domain,
      data: {
        prompt: prompt.substring(0, 100), // Store only first 100 chars for privacy
        promptLength: prompt.length
      },
      userId
    });
    return eventId;
  }

  public trackAIResponse(requestId: string, domain: string, responseTime: number, success: boolean, userId?: string): void {
    this.trackEvent({
      type: 'ai_response',
      domain,
      data: {
        requestId,
        responseTime,
        success
      },
      userId
    });
  }

  public trackDomainSwitch(fromDomain: string, toDomain: string, userId?: string): void {
    this.trackEvent({
      type: 'domain_switch',
      domain: toDomain,
      data: {
        fromDomain,
        toDomain
      },
      userId
    });
  }

  public trackError(domain: string, error: Error, context?: Record<string, any>, userId?: string): void {
    this.trackEvent({
      type: 'error',
      domain,
      data: {
        errorType: error.constructor.name,
        errorMessage: error.message,
        errorStack: error.stack?.substring(0, 500), // Limit stack trace
        context
      },
      userId
    });
  }

  public trackPerformance(domain: string, metric: string, value: number, userId?: string): void {
    this.trackEvent({
      type: 'performance',
      domain,
      data: {
        metric,
        value
      },
      userId
    });
  }

  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  public getDomainMetrics(domain?: string): DomainMetrics[] {
    if (domain) {
      const metrics = this.domainMetrics.get(domain);
      return metrics ? [metrics] : [];
    }
    return Array.from(this.domainMetrics.values());
  }

  public getEvents(filter?: {
    type?: AnalyticsEvent['type'];
    domain?: string;
    since?: number;
    limit?: number;
  }): AnalyticsEvent[] {
    let filteredEvents = [...this.events];

    if (filter) {
      if (filter.type) {
        filteredEvents = filteredEvents.filter(e => e.type === filter.type);
      }
      if (filter.domain) {
        filteredEvents = filteredEvents.filter(e => e.domain === filter.domain);
      }
      if (filter.since) {
        filteredEvents = filteredEvents.filter(e => e.timestamp >= filter.since!);
      }
      if (filter.limit) {
        filteredEvents = filteredEvents.slice(-filter.limit);
      }
    }

    return filteredEvents;
  }

  public exportData(): {
    events: AnalyticsEvent[];
    metrics: PerformanceMetrics;
    domainMetrics: DomainMetrics[];
    sessionId: string;
  } {
    return {
      events: [...this.events],
      metrics: { ...this.metrics },
      domainMetrics: this.getDomainMetrics(),
      sessionId: this.sessionId
    };
  }

  public clearData(): void {
    this.events = [];
    this.metrics = this.initializeMetrics();
    this.domainMetrics.clear();
    this.emit('data_cleared');
  }

  public destroy(): void {
    if (this.metricsUpdateInterval) {
      clearInterval(this.metricsUpdateInterval);
      this.metricsUpdateInterval = null;
    }
    this.removeAllListeners();
  }
}

// Singleton instance
let analyticsInstance: AnalyticsService | null = null;

export const getAnalyticsService = (): AnalyticsService => {
  if (!analyticsInstance) {
    analyticsInstance = new AnalyticsService();
  }
  return analyticsInstance;
};

export const destroyAnalyticsService = (): void => {
  if (analyticsInstance) {
    analyticsInstance.destroy();
    analyticsInstance = null;
  }
};