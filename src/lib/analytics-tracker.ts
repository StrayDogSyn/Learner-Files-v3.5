interface AnalyticsEvent {
  id: string;
  type: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  timestamp: Date;
  sessionId: string;
  userId?: string;
  metadata?: Record<string, any>;
}

interface UserSession {
  id: string;
  userId?: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  pageViews: number;
  events: AnalyticsEvent[];
  device: DeviceInfo;
  location: LocationInfo;
  referrer?: string;
  userAgent: string;
}

interface DeviceInfo {
  type: 'desktop' | 'tablet' | 'mobile';
  os: string;
  browser: string;
  screenResolution: string;
  viewport: string;
  touchSupport: boolean;
  connectionType?: string;
}

interface LocationInfo {
  country?: string;
  region?: string;
  city?: string;
  timezone: string;
  language: string;
}

interface PerformanceMetrics {
  pageLoadTime: number;
  domContentLoaded: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  firstInputDelay: number;
  cumulativeLayoutShift: number;
  timeToInteractive: number;
  resourceLoadTimes: Record<string, number>;
}

interface EngagementMetrics {
  timeOnPage: number;
  scrollDepth: number;
  clickCount: number;
  keyboardInteractions: number;
  mouseMovements: number;
  idleTime: number;
  bounceRate: number;
  exitRate: number;
}

interface ConversionGoal {
  id: string;
  name: string;
  type: 'page_view' | 'click' | 'form_submit' | 'download' | 'custom';
  target: string;
  value?: number;
  funnel?: string[];
}

interface AnalyticsConfig {
  trackingId?: string;
  enablePerformanceTracking: boolean;
  enableEngagementTracking: boolean;
  enableErrorTracking: boolean;
  enableHeatmaps: boolean;
  sampleRate: number;
  sessionTimeout: number;
  batchSize: number;
  flushInterval: number;
  enableDebug: boolean;
}

interface HeatmapData {
  x: number;
  y: number;
  type: 'click' | 'move' | 'scroll';
  timestamp: Date;
  element?: string;
  page: string;
}

interface ErrorEvent {
  id: string;
  type: 'javascript' | 'network' | 'resource' | 'custom';
  message: string;
  stack?: string;
  filename?: string;
  lineno?: number;
  colno?: number;
  timestamp: Date;
  userAgent: string;
  url: string;
  userId?: string;
  sessionId: string;
}

class AnalyticsTracker {
  private config: AnalyticsConfig;
  private currentSession: UserSession;
  private eventQueue: AnalyticsEvent[] = [];
  private performanceObserver?: PerformanceObserver;
  private intersectionObserver?: IntersectionObserver;
  private isTracking = false;
  private startTime = Date.now();
  private lastActivity = Date.now();
  private scrollDepth = 0;
  private heatmapData: HeatmapData[] = [];
  private conversionGoals: ConversionGoal[] = [];

  constructor(config: Partial<AnalyticsConfig> = {}) {
    this.config = {
      enablePerformanceTracking: true,
      enableEngagementTracking: true,
      enableErrorTracking: true,
      enableHeatmaps: false,
      sampleRate: 1.0,
      sessionTimeout: 30 * 60 * 1000, // 30 minutes
      batchSize: 10,
      flushInterval: 5000, // 5 seconds
      enableDebug: false,
      ...config
    };

    this.currentSession = this.createSession();
    this.initialize();
  }

  /**
   * Initialize the analytics tracker
   */
  private initialize(): void {
    if (typeof window === 'undefined') return;

    // Check if we should track this user (sampling)
    if (Math.random() > this.config.sampleRate) {
      return;
    }

    this.isTracking = true;

    // Set up performance tracking
    if (this.config.enablePerformanceTracking) {
      this.initializePerformanceTracking();
    }

    // Set up engagement tracking
    if (this.config.enableEngagementTracking) {
      this.initializeEngagementTracking();
    }

    // Set up error tracking
    if (this.config.enableErrorTracking) {
      this.initializeErrorTracking();
    }

    // Set up heatmap tracking
    if (this.config.enableHeatmaps) {
      this.initializeHeatmapTracking();
    }

    // Set up periodic flushing
    this.initializePeriodicFlush();

    // Track initial page view
    this.trackPageView();

    this.log('Analytics tracker initialized');
  }

  /**
   * Track a custom event
   */
  trackEvent(
    category: string,
    action: string,
    label?: string,
    value?: number,
    metadata?: Record<string, any>
  ): void {
    if (!this.isTracking) return;

    const event: AnalyticsEvent = {
      id: this.generateId(),
      type: 'custom',
      category,
      action,
      label,
      value,
      timestamp: new Date(),
      sessionId: this.currentSession.id,
      userId: this.currentSession.userId,
      metadata
    };

    this.addEvent(event);
    this.checkConversionGoals(event);
  }

  /**
   * Track a page view
   */
  trackPageView(page?: string, title?: string): void {
    if (!this.isTracking) return;

    const currentPage = page || window.location.pathname;
    const pageTitle = title || document.title;

    this.trackEvent('navigation', 'page_view', currentPage, undefined, {
      title: pageTitle,
      url: window.location.href,
      referrer: document.referrer
    });

    this.currentSession.pageViews++;
    this.resetEngagementMetrics();
  }

  /**
   * Track user interactions with projects
   */
  trackProjectInteraction(
    projectId: string,
    action: 'view' | 'like' | 'share' | 'download' | 'demo_start' | 'demo_complete',
    metadata?: Record<string, any>
  ): void {
    this.trackEvent('project', action, projectId, undefined, {
      projectId,
      ...metadata
    });
  }

  /**
   * Track AI art gallery interactions
   */
  trackArtworkInteraction(
    artworkId: string,
    action: 'view' | 'like' | 'share' | 'download' | 'lightbox_open' | 'lightbox_close',
    metadata?: Record<string, any>
  ): void {
    this.trackEvent('artwork', action, artworkId, undefined, {
      artworkId,
      ...metadata
    });
  }

  /**
   * Track search interactions
   */
  trackSearchInteraction(
    query: string,
    action: 'search' | 'suggestion_click' | 'filter_apply' | 'result_click',
    metadata?: Record<string, any>
  ): void {
    this.trackEvent('search', action, query, undefined, {
      query,
      ...metadata
    });
  }

  /**
   * Track demo interactions
   */
  trackDemoInteraction(
    demoId: string,
    action: 'start' | 'pause' | 'reset' | 'complete' | 'code_edit' | 'ai_assist',
    metadata?: Record<string, any>
  ): void {
    this.trackEvent('demo', action, demoId, undefined, {
      demoId,
      ...metadata
    });
  }

  /**
   * Track performance metrics
   */
  trackPerformance(metrics: Partial<PerformanceMetrics>): void {
    if (!this.isTracking || !this.config.enablePerformanceTracking) return;

    this.trackEvent('performance', 'metrics', window.location.pathname, undefined, metrics);
  }

  /**
   * Track user engagement
   */
  trackEngagement(metrics: Partial<EngagementMetrics>): void {
    if (!this.isTracking || !this.config.enableEngagementTracking) return;

    this.trackEvent('engagement', 'metrics', window.location.pathname, undefined, metrics);
  }

  /**
   * Track errors
   */
  trackError(
    type: 'javascript' | 'network' | 'resource' | 'custom',
    message: string,
    metadata?: Record<string, any>
  ): void {
    if (!this.isTracking || !this.config.enableErrorTracking) return;

    const errorEvent: ErrorEvent = {
      id: this.generateId(),
      type,
      message,
      timestamp: new Date(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      sessionId: this.currentSession.id,
      userId: this.currentSession.userId,
      ...metadata
    };

    this.trackEvent('error', type, message, undefined, errorEvent);
  }

  /**
   * Set user ID
   */
  setUserId(userId: string): void {
    this.currentSession.userId = userId;
  }

  /**
   * Add conversion goal
   */
  addConversionGoal(goal: ConversionGoal): void {
    this.conversionGoals.push(goal);
  }

  /**
   * Get current session data
   */
  getSession(): UserSession {
    return { ...this.currentSession };
  }

  /**
   * Get analytics summary
   */
  getAnalyticsSummary(): {
    session: UserSession;
    events: AnalyticsEvent[];
    heatmapData: HeatmapData[];
    performance: PerformanceMetrics;
    engagement: EngagementMetrics;
  } {
    return {
      session: this.getSession(),
      events: [...this.eventQueue],
      heatmapData: [...this.heatmapData],
      performance: this.getCurrentPerformanceMetrics(),
      engagement: this.getCurrentEngagementMetrics()
    };
  }

  /**
   * Flush events to storage/server
   */
  async flush(): Promise<void> {
    if (this.eventQueue.length === 0) return;

    try {
      // Store in localStorage for now
      const existingData = this.getStoredAnalytics();
      const newData = {
        ...existingData,
        events: [...(existingData.events || []), ...this.eventQueue],
        sessions: {
          ...existingData.sessions,
          [this.currentSession.id]: this.currentSession
        },
        heatmapData: [...(existingData.heatmapData || []), ...this.heatmapData]
      };

      localStorage.setItem('portfolio_analytics', JSON.stringify(newData));
      
      this.log(`Flushed ${this.eventQueue.length} events`);
      this.eventQueue = [];
      this.heatmapData = [];

      // In a real implementation, you would send data to your analytics server
      // await this.sendToServer(this.eventQueue);
    } catch (error) {
      console.error('Failed to flush analytics data:', error);
    }
  }

  /**
   * End current session
   */
  endSession(): void {
    this.currentSession.endTime = new Date();
    this.currentSession.duration = Date.now() - this.startTime;
    this.flush();
  }

  // Private methods

  private createSession(): UserSession {
    return {
      id: this.generateId(),
      startTime: new Date(),
      pageViews: 0,
      events: [],
      device: this.getDeviceInfo(),
      location: this.getLocationInfo(),
      referrer: document.referrer,
      userAgent: navigator.userAgent
    };
  }

  private addEvent(event: AnalyticsEvent): void {
    this.eventQueue.push(event);
    this.currentSession.events.push(event);
    this.lastActivity = Date.now();

    // Auto-flush if batch size reached
    if (this.eventQueue.length >= this.config.batchSize) {
      this.flush();
    }
  }

  private initializePerformanceTracking(): void {
    // Track Core Web Vitals
    if ('PerformanceObserver' in window) {
      this.performanceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.handlePerformanceEntry(entry);
        }
      });

      try {
        this.performanceObserver.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint', 'first-input', 'layout-shift'] });
      } catch (error) {
        this.log('Performance observer not fully supported');
      }
    }

    // Track page load time
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigation) {
          this.trackPerformance({
            pageLoadTime: navigation.loadEventEnd - navigation.fetchStart,
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart
          });
        }
      }, 0);
    });
  }

  private initializeEngagementTracking(): void {
    // Track scroll depth
    let maxScrollDepth = 0;
    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollPercent = Math.round((scrollTop + windowHeight) / documentHeight * 100);
      
      if (scrollPercent > maxScrollDepth) {
        maxScrollDepth = scrollPercent;
        this.scrollDepth = scrollPercent;
      }
    });

    // Track clicks
    let clickCount = 0;
    document.addEventListener('click', (event) => {
      clickCount++;
      this.lastActivity = Date.now();
      
      if (this.config.enableHeatmaps) {
        this.addHeatmapData({
          x: event.clientX,
          y: event.clientY,
          type: 'click',
          timestamp: new Date(),
          element: (event.target as Element)?.tagName,
          page: window.location.pathname
        });
      }
    });

    // Track keyboard interactions
    let keyboardInteractions = 0;
    document.addEventListener('keydown', () => {
      keyboardInteractions++;
      this.lastActivity = Date.now();
    });

    // Track mouse movements (throttled)
    let mouseMovements = 0;
    let lastMouseMove = 0;
    document.addEventListener('mousemove', (event) => {
      const now = Date.now();
      if (now - lastMouseMove > 100) { // Throttle to every 100ms
        mouseMovements++;
        lastMouseMove = now;
        this.lastActivity = now;
        
        if (this.config.enableHeatmaps && Math.random() < 0.01) { // Sample 1% of mouse moves
          this.addHeatmapData({
            x: event.clientX,
            y: event.clientY,
            type: 'move',
            timestamp: new Date(),
            page: window.location.pathname
          });
        }
      }
    });

    // Periodic engagement tracking
    setInterval(() => {
      const timeOnPage = Date.now() - this.startTime;
      const idleTime = Date.now() - this.lastActivity;
      
      this.trackEngagement({
        timeOnPage,
        scrollDepth: this.scrollDepth,
        clickCount,
        keyboardInteractions,
        mouseMovements,
        idleTime
      });
    }, 30000); // Every 30 seconds
  }

  private initializeErrorTracking(): void {
    // JavaScript errors
    window.addEventListener('error', (event) => {
      this.trackError('javascript', event.message, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack
      });
    });

    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.trackError('javascript', `Unhandled promise rejection: ${event.reason}`, {
        reason: event.reason
      });
    });

    // Resource loading errors
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        const target = event.target as HTMLElement;
        this.trackError('resource', `Failed to load resource: ${target.tagName}`, {
          src: (target as any).src || (target as any).href,
          tagName: target.tagName
        });
      }
    }, true);
  }

  private initializeHeatmapTracking(): void {
    // Heatmap data is collected in the engagement tracking
    this.log('Heatmap tracking enabled');
  }

  private initializePeriodicFlush(): void {
    setInterval(() => {
      this.flush();
    }, this.config.flushInterval);

    // Flush on page unload
    window.addEventListener('beforeunload', () => {
      this.endSession();
    });
  }

  private handlePerformanceEntry(entry: PerformanceEntry): void {
    switch (entry.entryType) {
      case 'paint':
        if (entry.name === 'first-contentful-paint') {
          this.trackPerformance({ firstContentfulPaint: entry.startTime });
        }
        break;
      case 'largest-contentful-paint':
        this.trackPerformance({ largestContentfulPaint: entry.startTime });
        break;
      case 'first-input':
        this.trackPerformance({ firstInputDelay: (entry as any).processingStart - entry.startTime });
        break;
      case 'layout-shift':
        if (!(entry as any).hadRecentInput) {
          this.trackPerformance({ cumulativeLayoutShift: (entry as any).value });
        }
        break;
    }
  }

  private addHeatmapData(data: HeatmapData): void {
    this.heatmapData.push(data);
    
    // Limit heatmap data size
    if (this.heatmapData.length > 1000) {
      this.heatmapData = this.heatmapData.slice(-500);
    }
  }

  private checkConversionGoals(event: AnalyticsEvent): void {
    this.conversionGoals.forEach(goal => {
      let isConversion = false;
      
      switch (goal.type) {
        case 'page_view':
          isConversion = event.category === 'navigation' && event.action === 'page_view' && event.label === goal.target;
          break;
        case 'click':
          isConversion = event.action === 'click' && event.label === goal.target;
          break;
        case 'custom':
          isConversion = event.category === goal.target;
          break;
      }
      
      if (isConversion) {
        this.trackEvent('conversion', goal.name, goal.id, goal.value, {
          goalId: goal.id,
          goalType: goal.type,
          originalEvent: event
        });
      }
    });
  }

  private resetEngagementMetrics(): void {
    this.startTime = Date.now();
    this.lastActivity = Date.now();
    this.scrollDepth = 0;
  }

  private getCurrentPerformanceMetrics(): PerformanceMetrics {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    return {
      pageLoadTime: navigation ? navigation.loadEventEnd - navigation.fetchStart : 0,
      domContentLoaded: navigation ? navigation.domContentLoadedEventEnd - navigation.fetchStart : 0,
      firstContentfulPaint: 0, // Would be populated by performance observer
      largestContentfulPaint: 0,
      firstInputDelay: 0,
      cumulativeLayoutShift: 0,
      timeToInteractive: 0,
      resourceLoadTimes: {}
    };
  }

  private getCurrentEngagementMetrics(): EngagementMetrics {
    return {
      timeOnPage: Date.now() - this.startTime,
      scrollDepth: this.scrollDepth,
      clickCount: 0, // Would be tracked in real implementation
      keyboardInteractions: 0,
      mouseMovements: 0,
      idleTime: Date.now() - this.lastActivity,
      bounceRate: 0,
      exitRate: 0
    };
  }

  private getDeviceInfo(): DeviceInfo {
    const userAgent = navigator.userAgent;
    
    return {
      type: this.getDeviceType(),
      os: this.getOS(userAgent),
      browser: this.getBrowser(userAgent),
      screenResolution: `${screen.width}x${screen.height}`,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      touchSupport: 'ontouchstart' in window,
      connectionType: (navigator as any).connection?.effectiveType
    };
  }

  private getLocationInfo(): LocationInfo {
    return {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language
    };
  }

  private getDeviceType(): 'desktop' | 'tablet' | 'mobile' {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  private getOS(userAgent: string): string {
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iOS')) return 'iOS';
    return 'Unknown';
  }

  private getBrowser(userAgent: string): string {
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Unknown';
  }

  private getStoredAnalytics(): any {
    try {
      const stored = localStorage.getItem('portfolio_analytics');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private log(message: string): void {
    if (this.config.enableDebug) {
      console.log(`[Analytics] ${message}`);
    }
  }
}

// Export singleton instance
export const analyticsTracker = new AnalyticsTracker({
  enableDebug: process.env.NODE_ENV === 'development'
});

// Export class for custom instances
export { AnalyticsTracker };

// Export types
export type {
  AnalyticsEvent,
  UserSession,
  DeviceInfo,
  LocationInfo,
  PerformanceMetrics,
  EngagementMetrics,
  ConversionGoal,
  AnalyticsConfig,
  HeatmapData,
  ErrorEvent
};