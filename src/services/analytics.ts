// Basic analytics service for tracking user interactions and performance
// Uses localStorage for GitHub Pages compatibility

import type { AnalyticsEvent, PerformanceMetrics } from '../types/github';

class AnalyticsService {
  private readonly storageKey = 'portfolio_analytics';
  private readonly sessionKey = 'portfolio_session';
  private readonly maxEvents = 1000; // Limit stored events
  private sessionId: string;

  constructor() {
    this.sessionId = this.getOrCreateSessionId();
    this.initializePerformanceTracking();
  }

  /**
   * Get or create a session ID
   */
  private getOrCreateSessionId(): string {
    let sessionId = sessionStorage.getItem(this.sessionKey);
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem(this.sessionKey, sessionId);
    }
    return sessionId;
  }

  /**
   * Initialize performance tracking
   */
  private initializePerformanceTracking(): void {
    // Track page load performance
    if (typeof window !== 'undefined' && 'performance' in window) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          this.trackPerformance();
        }, 0);
      });
    }
  }

  /**
   * Get stored analytics data
   */
  private getStoredData(): {
    events: AnalyticsEvent[];
    performance: PerformanceMetrics[];
    sessions: string[];
  } {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to parse analytics data:', error);
    }
    
    return {
      events: [],
      performance: [],
      sessions: []
    };
  }

  /**
   * Save analytics data to localStorage
   */
  private saveData(data: {
    events: AnalyticsEvent[];
    performance: PerformanceMetrics[];
    sessions: string[];
  }): void {
    try {
      // Limit the number of stored events
      if (data.events.length > this.maxEvents) {
        data.events = data.events.slice(-this.maxEvents);
      }
      
      // Limit performance metrics (keep last 100)
      if (data.performance.length > 100) {
        data.performance = data.performance.slice(-100);
      }
      
      // Limit sessions (keep last 50)
      if (data.sessions.length > 50) {
        data.sessions = data.sessions.slice(-50);
      }
      
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save analytics data:', error);
    }
  }

  /**
   * Track an analytics event
   */
  trackEvent(
    type: AnalyticsEvent['type'],
    data?: Record<string, any>
  ): void {
    const event: AnalyticsEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      timestamp: new Date().toISOString(),
      data: data || {},
      sessionId: this.sessionId,
      userAgent: navigator.userAgent
    };

    const stored = this.getStoredData();
    stored.events.push(event);
    
    // Add session to sessions list if not already present
    if (!stored.sessions.includes(this.sessionId)) {
      stored.sessions.push(this.sessionId);
    }
    
    this.saveData(stored);
  }

  /**
   * Track performance metrics
   */
  trackPerformance(): void {
    if (typeof window === 'undefined' || !('performance' in window)) {
      return;
    }

    try {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');
      
      const fcp = paint.find(entry => entry.name === 'first-contentful-paint');
      const lcp = this.getLargestContentfulPaint();
      const cls = this.getCumulativeLayoutShift();
      const fid = this.getFirstInputDelay();

      const metrics: PerformanceMetrics = {
        loadTime: navigation ? navigation.loadEventEnd - navigation.loadEventStart : 0,
        firstContentfulPaint: fcp ? fcp.startTime : 0,
        largestContentfulPaint: lcp,
        cumulativeLayoutShift: cls,
        firstInputDelay: fid,
        timestamp: new Date().toISOString()
      };

      const stored = this.getStoredData();
      stored.performance.push(metrics);
      this.saveData(stored);

      // Also track as an event
      this.trackEvent('page_view', {
        loadTime: metrics.loadTime,
        fcp: metrics.firstContentfulPaint,
        lcp: metrics.largestContentfulPaint
      });
    } catch (error) {
      console.warn('Failed to track performance:', error);
    }
  }

  /**
   * Get Largest Contentful Paint
   */
  private getLargestContentfulPaint(): number {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        return lastEntry ? lastEntry.startTime : 0;
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
      return 0; // Will be updated asynchronously
    } catch {
      return 0;
    }
  }

  /**
   * Get Cumulative Layout Shift
   */
  private getCumulativeLayoutShift(): number {
    try {
      let cls = 0;
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            cls += (entry as any).value;
          }
        }
      });
      observer.observe({ entryTypes: ['layout-shift'] });
      return cls;
    } catch {
      return 0;
    }
  }

  /**
   * Get First Input Delay
   */
  private getFirstInputDelay(): number {
    try {
      let fid = 0;
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          fid = (entry as any).processingStart - entry.startTime;
        }
      });
      observer.observe({ entryTypes: ['first-input'] });
      return fid;
    } catch {
      return 0;
    }
  }

  /**
   * Track project interactions
   */
  trackProjectClick(projectId: string, projectName: string, action: 'github' | 'demo'): void {
    this.trackEvent('project_click', {
      projectId,
      projectName,
      action,
      url: window.location.href
    });
  }

  /**
   * Track GitHub link clicks
   */
  trackGitHubClick(url: string, context: string): void {
    this.trackEvent('github_link_click', {
      url,
      context,
      referrer: document.referrer
    });
  }

  /**
   * Track demo interactions
   */
  trackDemoInteraction(demoType: string, action: string, data?: Record<string, any>): void {
    this.trackEvent('demo_interaction', {
      demoType,
      action,
      ...data
    });
  }

  /**
   * Track contact form interactions
   */
  trackContactForm(action: 'open' | 'submit' | 'error', data?: Record<string, any>): void {
    this.trackEvent('contact_form', {
      action,
      ...data
    });
  }

  /**
   * Get analytics summary
   */
  getAnalyticsSummary(): {
    totalEvents: number;
    totalSessions: number;
    eventsByType: Record<string, number>;
    averageLoadTime: number;
    lastActivity: string | null;
  } {
    const stored = this.getStoredData();
    
    const eventsByType = stored.events.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const averageLoadTime = stored.performance.length > 0
      ? stored.performance.reduce((sum, p) => sum + p.loadTime, 0) / stored.performance.length
      : 0;

    const lastActivity = stored.events.length > 0
      ? stored.events[stored.events.length - 1].timestamp
      : null;

    return {
      totalEvents: stored.events.length,
      totalSessions: stored.sessions.length,
      eventsByType,
      averageLoadTime,
      lastActivity
    };
  }

  /**
   * Get recent events
   */
  getRecentEvents(limit: number = 10): AnalyticsEvent[] {
    const stored = this.getStoredData();
    return stored.events.slice(-limit).reverse();
  }

  /**
   * Clear analytics data
   */
  clearData(): void {
    localStorage.removeItem(this.storageKey);
    sessionStorage.removeItem(this.sessionKey);
    this.sessionId = this.getOrCreateSessionId();
  }

  /**
   * Export analytics data
   */
  exportData(): string {
    const stored = this.getStoredData();
    return JSON.stringify(stored, null, 2);
  }
}

// Export singleton instance
export const analyticsService = new AnalyticsService();
export default analyticsService;