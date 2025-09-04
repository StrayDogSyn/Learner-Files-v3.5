/**
 * Analytics Module for StrayDog Syndications Portfolio
 * Handles real-time analytics tracking and performance monitoring
 */

class AnalyticsTracker {
    constructor(config = {}) {
        this.config = {
            trackingId: config.trackingId || 'straydog-portfolio',
            apiEndpoint: config.apiEndpoint || '/api/analytics',
            batchSize: config.batchSize || 10,
            flushInterval: config.flushInterval || 30000, // 30 seconds
            enableRealTime: config.enableRealTime !== false,
            ...config
        };
        
        this.eventQueue = [];
        this.sessionData = this.initializeSession();
        this.metrics = new Map();
        this.listeners = new Map();
        
        this.init();
    }

    /**
     * Initialize analytics tracking
     */
    init() {
        this.setupEventListeners();
        this.startPerformanceMonitoring();
        
        if (this.config.enableRealTime) {
            this.startRealTimeTracking();
        }
        
        // Track initial page load
        this.trackEvent('page_load', {
            url: window.location.href,
            referrer: document.referrer,
            timestamp: Date.now()
        });
    }

    /**
     * Initialize session data
     */
    initializeSession() {
        const sessionId = this.generateSessionId();
        const startTime = Date.now();
        
        return {
            sessionId,
            startTime,
            userId: this.getUserId(),
            device: this.getDeviceInfo(),
            browser: this.getBrowserInfo(),
            location: this.getLocationInfo()
        };
    }

    /**
     * Track custom events
     */
    trackEvent(eventName, data = {}) {
        const event = {
            id: this.generateEventId(),
            name: eventName,
            timestamp: Date.now(),
            sessionId: this.sessionData.sessionId,
            data: {
                ...data,
                url: window.location.href,
                userAgent: navigator.userAgent
            }
        };

        this.eventQueue.push(event);
        this.updateMetrics(eventName, data);
        
        // Emit to listeners
        this.emit('event', event);
        
        // Auto-flush if queue is full
        if (this.eventQueue.length >= this.config.batchSize) {
            this.flush();
        }
        
        return event.id;
    }

    /**
     * Track page views
     */
    trackPageView(page = window.location.pathname) {
        return this.trackEvent('page_view', {
            page,
            title: document.title,
            loadTime: this.getPageLoadTime()
        });
    }

    /**
     * Track user interactions
     */
    trackInteraction(element, action, data = {}) {
        return this.trackEvent('user_interaction', {
            element: element.tagName || 'unknown',
            elementId: element.id || null,
            elementClass: element.className || null,
            action,
            ...data
        });
    }

    /**
     * Track project views
     */
    trackProjectView(projectName, projectType = 'unknown') {
        return this.trackEvent('project_view', {
            projectName,
            projectType,
            viewDuration: 0 // Will be updated on project_exit
        });
    }

    /**
     * Track form submissions
     */
    trackFormSubmission(formName, formData = {}) {
        return this.trackEvent('form_submission', {
            formName,
            fields: Object.keys(formData),
            success: true
        });
    }

    /**
     * Track errors
     */
    trackError(error, context = {}) {
        return this.trackEvent('error', {
            message: error.message || 'Unknown error',
            stack: error.stack || null,
            type: error.name || 'Error',
            context
        });
    }

    /**
     * Track performance metrics
     */
    trackPerformance(metricName, value, unit = 'ms') {
        return this.trackEvent('performance', {
            metric: metricName,
            value,
            unit,
            timestamp: Date.now()
        });
    }

    /**
     * Get real-time metrics
     */
    getRealTimeMetrics() {
        const now = Date.now();
        const sessionDuration = now - this.sessionData.startTime;
        
        return {
            session: {
                id: this.sessionData.sessionId,
                duration: sessionDuration,
                events: this.eventQueue.length,
                startTime: this.sessionData.startTime
            },
            metrics: Object.fromEntries(this.metrics),
            performance: this.getPerformanceMetrics(),
            engagement: this.getEngagementMetrics()
        };
    }

    /**
     * Get engagement metrics
     */
    getEngagementMetrics() {
        const events = this.eventQueue;
        const pageViews = events.filter(e => e.name === 'page_view').length;
        const interactions = events.filter(e => e.name === 'user_interaction').length;
        const projectViews = events.filter(e => e.name === 'project_view').length;
        
        return {
            pageViews,
            interactions,
            projectViews,
            engagementScore: this.calculateEngagementScore()
        };
    }

    /**
     * Calculate engagement score
     */
    calculateEngagementScore() {
        const events = this.eventQueue;
        const sessionDuration = Date.now() - this.sessionData.startTime;
        
        if (sessionDuration < 1000) return 0; // Less than 1 second
        
        const interactions = events.filter(e => e.name === 'user_interaction').length;
        const pageViews = events.filter(e => e.name === 'page_view').length;
        const projectViews = events.filter(e => e.name === 'project_view').length;
        
        // Simple engagement score calculation
        const score = (
            (interactions * 2) + 
            (pageViews * 1) + 
            (projectViews * 3)
        ) / (sessionDuration / 60000); // Per minute
        
        return Math.min(Math.round(score * 100) / 100, 10); // Cap at 10
    }

    /**
     * Setup event listeners for automatic tracking
     */
    setupEventListeners() {
        // Track clicks
        document.addEventListener('click', (e) => {
            this.trackInteraction(e.target, 'click', {
                x: e.clientX,
                y: e.clientY
            });
        });

        // Track form submissions
        document.addEventListener('submit', (e) => {
            const form = e.target;
            if (form.tagName === 'FORM') {
                this.trackFormSubmission(form.name || form.id || 'unnamed_form');
            }
        });

        // Track page visibility changes
        document.addEventListener('visibilitychange', () => {
            this.trackEvent('visibility_change', {
                hidden: document.hidden
            });
        });

        // Track errors
        window.addEventListener('error', (e) => {
            this.trackError(e.error || new Error(e.message), {
                filename: e.filename,
                lineno: e.lineno,
                colno: e.colno
            });
        });

        // Track unhandled promise rejections
        window.addEventListener('unhandledrejection', (e) => {
            this.trackError(new Error(e.reason), {
                type: 'unhandled_promise_rejection'
            });
        });
    }

    /**
     * Start performance monitoring
     */
    startPerformanceMonitoring() {
        // Monitor page load performance
        if (window.performance && window.performance.timing) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const timing = window.performance.timing;
                    const loadTime = timing.loadEventEnd - timing.navigationStart;
                    this.trackPerformance('page_load_time', loadTime);
                }, 0);
            });
        }

        // Monitor resource loading
        if (window.PerformanceObserver) {
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    if (entry.entryType === 'navigation') {
                        this.trackPerformance('navigation_time', entry.duration);
                    } else if (entry.entryType === 'resource') {
                        this.trackPerformance('resource_load_time', entry.duration, {
                            resource: entry.name
                        });
                    }
                });
            });
            
            observer.observe({ entryTypes: ['navigation', 'resource'] });
        }
    }

    /**
     * Start real-time tracking
     */
    startRealTimeTracking() {
        setInterval(() => {
            this.flush();
        }, this.config.flushInterval);

        // Send heartbeat every minute
        setInterval(() => {
            this.trackEvent('heartbeat', {
                metrics: this.getRealTimeMetrics()
            });
        }, 60000);
    }

    /**
     * Flush events to server
     */
    async flush() {
        if (this.eventQueue.length === 0) return;

        const events = [...this.eventQueue];
        this.eventQueue = [];

        try {
            const response = await fetch(this.config.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    trackingId: this.config.trackingId,
                    session: this.sessionData,
                    events,
                    timestamp: Date.now()
                })
            });

            if (!response.ok) {
                throw new Error(`Analytics API error: ${response.status}`);
            }

            this.emit('flush_success', { eventCount: events.length });
        } catch (error) {
            // Re-queue events on failure
            this.eventQueue.unshift(...events);
            this.emit('flush_error', error);
            console.warn('Analytics flush failed:', error);
        }
    }

    /**
     * Event emitter functionality
     */
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    }

    emit(event, data) {
        const callbacks = this.listeners.get(event) || [];
        callbacks.forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error('Analytics listener error:', error);
            }
        });
    }

    // Utility methods
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    generateEventId() {
        return 'event_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    getUserId() {
        let userId = localStorage.getItem('straydog_user_id');
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('straydog_user_id', userId);
        }
        return userId;
    }

    getDeviceInfo() {
        return {
            type: this.getDeviceType(),
            screen: {
                width: window.screen.width,
                height: window.screen.height
            },
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            }
        };
    }

    getDeviceType() {
        const userAgent = navigator.userAgent;
        if (/tablet|ipad|playbook|silk/i.test(userAgent)) return 'tablet';
        if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) return 'mobile';
        return 'desktop';
    }

    getBrowserInfo() {
        const userAgent = navigator.userAgent;
        let browser = 'unknown';
        
        if (userAgent.includes('Chrome')) browser = 'chrome';
        else if (userAgent.includes('Firefox')) browser = 'firefox';
        else if (userAgent.includes('Safari')) browser = 'safari';
        else if (userAgent.includes('Edge')) browser = 'edge';
        
        return {
            name: browser,
            userAgent,
            language: navigator.language
        };
    }

    getLocationInfo() {
        return {
            href: window.location.href,
            pathname: window.location.pathname,
            search: window.location.search,
            hash: window.location.hash,
            hostname: window.location.hostname
        };
    }

    getPageLoadTime() {
        if (window.performance && window.performance.timing) {
            const timing = window.performance.timing;
            return timing.loadEventEnd - timing.navigationStart;
        }
        return null;
    }

    getPerformanceMetrics() {
        if (!window.performance) return {};
        
        const navigation = window.performance.getEntriesByType('navigation')[0];
        if (!navigation) return {};
        
        return {
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
            loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
            firstPaint: this.getFirstPaint(),
            firstContentfulPaint: this.getFirstContentfulPaint()
        };
    }

    getFirstPaint() {
        const paintEntries = window.performance.getEntriesByType('paint');
        const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
        return firstPaint ? firstPaint.startTime : null;
    }

    getFirstContentfulPaint() {
        const paintEntries = window.performance.getEntriesByType('paint');
        const firstContentfulPaint = paintEntries.find(entry => entry.name === 'first-contentful-paint');
        return firstContentfulPaint ? firstContentfulPaint.startTime : null;
    }

    updateMetrics(eventName, data) {
        const key = `event_${eventName}`;
        const current = this.metrics.get(key) || 0;
        this.metrics.set(key, current + 1);
    }

    /**
     * Clean up and send final events
     */
    destroy() {
        this.trackEvent('session_end', {
            duration: Date.now() - this.sessionData.startTime
        });
        
        this.flush();
    }
}

// Auto-initialize if in browser environment
if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => {
        if (window.analyticsTracker) {
            window.analyticsTracker.destroy();
        }
    });
}

// Export for both CommonJS and ES modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnalyticsTracker;
} else {
    window.AnalyticsTracker = AnalyticsTracker;
}