import type { AnalyticsEvent } from '../types/github';
declare class AnalyticsService {
    private readonly storageKey;
    private readonly sessionKey;
    private readonly maxEvents;
    private sessionId;
    constructor();
    /**
     * Get or create a session ID
     */
    private getOrCreateSessionId;
    /**
     * Initialize performance tracking
     */
    private initializePerformanceTracking;
    /**
     * Get stored analytics data
     */
    private getStoredData;
    /**
     * Save analytics data to localStorage
     */
    private saveData;
    /**
     * Track an analytics event
     */
    trackEvent(type: AnalyticsEvent['type'], data?: Record<string, any>): void;
    /**
     * Track performance metrics
     */
    trackPerformance(): void;
    /**
     * Get Largest Contentful Paint
     */
    private getLargestContentfulPaint;
    /**
     * Get Cumulative Layout Shift
     */
    private getCumulativeLayoutShift;
    /**
     * Get First Input Delay
     */
    private getFirstInputDelay;
    /**
     * Track project interactions
     */
    trackProjectClick(projectId: string, projectName: string, action: 'github' | 'demo'): void;
    /**
     * Track GitHub link clicks
     */
    trackGitHubClick(url: string, context: string): void;
    /**
     * Track demo interactions
     */
    trackDemoInteraction(demoType: string, action: string, data?: Record<string, any>): void;
    /**
     * Track contact form interactions
     */
    trackContactForm(action: 'open' | 'submit' | 'error', data?: Record<string, any>): void;
    /**
     * Get analytics summary
     */
    getAnalyticsSummary(): {
        totalEvents: number;
        totalSessions: number;
        eventsByType: Record<string, number>;
        averageLoadTime: number;
        lastActivity: string | null;
    };
    /**
     * Get recent events
     */
    getRecentEvents(limit?: number): AnalyticsEvent[];
    /**
     * Clear analytics data
     */
    clearData(): void;
    /**
     * Export analytics data
     */
    exportData(): string;
}
export declare const analyticsService: AnalyticsService;
export default analyticsService;
//# sourceMappingURL=analytics.d.ts.map