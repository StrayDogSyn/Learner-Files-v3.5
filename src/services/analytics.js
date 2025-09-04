// Basic analytics service for tracking user interactions and performance
// Uses localStorage for GitHub Pages compatibility
class AnalyticsService {
    constructor() {
        Object.defineProperty(this, "storageKey", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'portfolio_analytics'
        });
        Object.defineProperty(this, "sessionKey", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'portfolio_session'
        });
        Object.defineProperty(this, "maxEvents", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 1000
        }); // Limit stored events
        Object.defineProperty(this, "sessionId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.sessionId = this.getOrCreateSessionId();
        this.initializePerformanceTracking();
    }
    /**
     * Get or create a session ID
     */
    getOrCreateSessionId() {
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
    initializePerformanceTracking() {
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
    getStoredData() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                return JSON.parse(stored);
            }
        }
        catch (error) {
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
    saveData(data) {
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
        }
        catch (error) {
            console.warn('Failed to save analytics data:', error);
        }
    }
    /**
     * Track an analytics event
     */
    trackEvent(type, data) {
        const event = {
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
    trackPerformance() {
        if (typeof window === 'undefined' || !('performance' in window)) {
            return;
        }
        try {
            const navigation = performance.getEntriesByType('navigation')[0];
            const paint = performance.getEntriesByType('paint');
            const fcp = paint.find(entry => entry.name === 'first-contentful-paint');
            const lcp = this.getLargestContentfulPaint();
            const cls = this.getCumulativeLayoutShift();
            const fid = this.getFirstInputDelay();
            const metrics = {
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
        }
        catch (error) {
            console.warn('Failed to track performance:', error);
        }
    }
    /**
     * Get Largest Contentful Paint
     */
    getLargestContentfulPaint() {
        try {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                return lastEntry ? lastEntry.startTime : 0;
            });
            observer.observe({ entryTypes: ['largest-contentful-paint'] });
            return 0; // Will be updated asynchronously
        }
        catch {
            return 0;
        }
    }
    /**
     * Get Cumulative Layout Shift
     */
    getCumulativeLayoutShift() {
        try {
            let cls = 0;
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (!entry.hadRecentInput) {
                        cls += entry.value;
                    }
                }
            });
            observer.observe({ entryTypes: ['layout-shift'] });
            return cls;
        }
        catch {
            return 0;
        }
    }
    /**
     * Get First Input Delay
     */
    getFirstInputDelay() {
        try {
            let fid = 0;
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    fid = entry.processingStart - entry.startTime;
                }
            });
            observer.observe({ entryTypes: ['first-input'] });
            return fid;
        }
        catch {
            return 0;
        }
    }
    /**
     * Track project interactions
     */
    trackProjectClick(projectId, projectName, action) {
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
    trackGitHubClick(url, context) {
        this.trackEvent('github_link_click', {
            url,
            context,
            referrer: document.referrer
        });
    }
    /**
     * Track demo interactions
     */
    trackDemoInteraction(demoType, action, data) {
        this.trackEvent('demo_interaction', {
            demoType,
            action,
            ...data
        });
    }
    /**
     * Track contact form interactions
     */
    trackContactForm(action, data) {
        this.trackEvent('contact_form', {
            action,
            ...data
        });
    }
    /**
     * Get analytics summary
     */
    getAnalyticsSummary() {
        const stored = this.getStoredData();
        const eventsByType = stored.events.reduce((acc, event) => {
            acc[event.type] = (acc[event.type] || 0) + 1;
            return acc;
        }, {});
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
    getRecentEvents(limit = 10) {
        const stored = this.getStoredData();
        return stored.events.slice(-limit).reverse();
    }
    /**
     * Clear analytics data
     */
    clearData() {
        localStorage.removeItem(this.storageKey);
        sessionStorage.removeItem(this.sessionKey);
        this.sessionId = this.getOrCreateSessionId();
    }
    /**
     * Export analytics data
     */
    exportData() {
        const stored = this.getStoredData();
        return JSON.stringify(stored, null, 2);
    }
}
// Export singleton instance
export const analyticsService = new AnalyticsService();
export default analyticsService;
//# sourceMappingURL=analytics.js.map