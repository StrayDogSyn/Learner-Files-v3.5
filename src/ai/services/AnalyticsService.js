// Analytics Service for StrayDog Syndications AI Ecosystem
export class AnalyticsService {
    constructor() {
        Object.defineProperty(this, "events", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "domainMetrics", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "userMetrics", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "performanceBuffer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "startTime", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Date()
        });
        Object.defineProperty(this, "maxEvents", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 10000
        }); // Limit memory usage
        Object.defineProperty(this, "maxPerformanceBuffer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 1000
        });
        // Initialize domain metrics
        const domains = ['corporate', 'technical', 'business', 'justice'];
        domains.forEach(domain => {
            this.domainMetrics.set(domain, {
                domain,
                totalRequests: 0,
                successfulRequests: 0,
                failedRequests: 0,
                averageResponseTime: 0,
                totalTokensUsed: 0,
                uniqueUsers: new Set(),
                contentTypes: new Map(),
                lastActivity: new Date()
            });
        });
        // Start cleanup interval
        setInterval(() => this.cleanup(), 3600000); // Cleanup every hour
    }
    /**
     * Track an AI analytics event
     */
    async trackEvent(event) {
        // Add timestamp if not provided
        if (!event.timestamp) {
            event.timestamp = new Date();
        }
        // Store event
        this.events.push(event);
        // Limit memory usage
        if (this.events.length > this.maxEvents) {
            this.events = this.events.slice(-this.maxEvents);
        }
        // Update domain metrics
        this.updateDomainMetrics(event);
        // Update user metrics
        this.updateUserMetrics(event);
        // Track performance if provided
        if (event.performance) {
            this.trackPerformance(event.performance);
        }
    }
    /**
     * Track performance metrics
     */
    async trackPerformance(performanceData) {
        // Convert simple performance data to full PerformanceMetrics for storage
        const metrics = {
            averageResponseTime: performanceData.responseTime,
            successRate: 100, // Will be calculated properly in aggregation
            errorRate: 0,
            tokensPerMinute: 0,
            activeUsers: 0,
            domainDistribution: {
                corporate: 0,
                technical: 0,
                business: 0,
                justice: 0
            },
            timestamp: performanceData.timestamp,
            totalRequests: 1,
            contentTypes: new Map()
        };
        this.performanceBuffer.push(metrics);
        // Limit buffer size
        if (this.performanceBuffer.length > this.maxPerformanceBuffer) {
            this.performanceBuffer = this.performanceBuffer.slice(-this.maxPerformanceBuffer);
        }
    }
    /**
     * Get domain-specific metrics
     */
    async getDomainMetrics(domain) {
        const metrics = this.domainMetrics.get(domain);
        if (!metrics)
            return null;
        return {
            ...metrics,
            uniqueUsers: new Set(metrics.uniqueUsers), // Clone the Set
            contentTypes: new Map(metrics.contentTypes) // Clone the Map
        };
    }
    /**
     * Get user-specific metrics
     */
    async getUserMetrics(userId) {
        const metrics = this.userMetrics.get(userId);
        if (!metrics)
            return null;
        return {
            ...metrics,
            domains: new Set(metrics.domains), // Clone the Set
            contentTypes: new Map(metrics.contentTypes) // Clone the Map
        };
    }
    /**
     * Get system-wide metrics
     */
    async getSystemMetrics() {
        const totalRequests = Array.from(this.domainMetrics.values())
            .reduce((sum, domain) => sum + domain.totalRequests, 0);
        const totalUsers = this.userMetrics.size;
        const totalTokensUsed = Array.from(this.domainMetrics.values())
            .reduce((sum, domain) => sum + domain.totalTokensUsed, 0);
        const averageResponseTime = this.performanceBuffer.length > 0
            ? this.performanceBuffer.reduce((sum, p) => sum + p.averageResponseTime, 0) / this.performanceBuffer.length
            : 0;
        const failedRequests = Array.from(this.domainMetrics.values())
            .reduce((sum, domain) => sum + domain.failedRequests, 0);
        const errorRate = totalRequests > 0 ? (failedRequests / totalRequests) * 100 : 0;
        const uptime = Date.now() - this.startTime.getTime();
        // Calculate domain distribution
        const domainDistribution = new Map();
        this.domainMetrics.forEach((metrics, domain) => {
            domainDistribution.set(domain, metrics.totalRequests);
        });
        // Calculate content type distribution
        const contentTypeDistribution = new Map();
        this.domainMetrics.forEach(metrics => {
            metrics.contentTypes.forEach((count, contentType) => {
                const current = contentTypeDistribution.get(contentType) || 0;
                contentTypeDistribution.set(contentType, current + count);
            });
        });
        // Calculate user role distribution
        const userRoleDistribution = new Map();
        this.userMetrics.forEach(metrics => {
            const current = userRoleDistribution.get(metrics.role) || 0;
            userRoleDistribution.set(metrics.role, current + 1);
        });
        return {
            totalRequests,
            totalUsers,
            totalTokensUsed,
            averageResponseTime,
            errorRate,
            uptime,
            peakConcurrentUsers: this.calculatePeakConcurrentUsers(),
            domainDistribution,
            contentTypeDistribution,
            userRoleDistribution
        };
    }
    /**
     * Get cross-domain insights
     */
    async getCrossDomainInsights() {
        // Analyze user cross-domain activity
        const userCrossDomainActivity = Array.from(this.userMetrics.entries())
            .map(([userId, metrics]) => ({
            userId,
            domains: Array.from(metrics.domains),
            totalRequests: metrics.totalRequests,
            crossDomainScore: metrics.domains.size / 4 // Normalized by total domains
        }))
            .filter(user => user.domains.length > 1)
            .sort((a, b) => b.crossDomainScore - a.crossDomainScore);
        // Analyze content type synergy across domains
        const contentTypeSynergy = new Map();
        this.domainMetrics.forEach((domainMetrics, domain) => {
            domainMetrics.contentTypes.forEach((usage, contentType) => {
                if (!contentTypeSynergy.has(contentType)) {
                    contentTypeSynergy.set(contentType, { domains: new Set(), totalUsage: 0 });
                }
                const synergy = contentTypeSynergy.get(contentType);
                synergy.domains.add(domain);
                synergy.totalUsage += usage;
            });
        });
        const contentTypeSynergyArray = Array.from(contentTypeSynergy.entries())
            .map(([contentType, data]) => ({
            contentType,
            domains: Array.from(data.domains),
            totalUsage: data.totalUsage
        }))
            .filter(item => item.domains.length > 1)
            .sort((a, b) => b.totalUsage - a.totalUsage);
        // Calculate domain correlations
        const domains = ['corporate', 'technical', 'business', 'justice'];
        const domainCorrelations = [];
        for (let i = 0; i < domains.length; i++) {
            for (let j = i + 1; j < domains.length; j++) {
                const domain1 = domains[i];
                const domain2 = domains[j];
                const domain1Users = this.domainMetrics.get(domain1)?.uniqueUsers || new Set();
                const domain2Users = this.domainMetrics.get(domain2)?.uniqueUsers || new Set();
                const sharedUsers = Array.from(domain1Users)
                    .filter(user => domain2Users.has(user)).length;
                const totalUsers = new Set([...domain1Users, ...domain2Users]).size;
                const correlationScore = totalUsers > 0 ? sharedUsers / totalUsers : 0;
                domainCorrelations.push({
                    domain1,
                    domain2,
                    sharedUsers,
                    correlationScore
                });
            }
        }
        domainCorrelations.sort((a, b) => b.correlationScore - a.correlationScore);
        return {
            userCrossDomainActivity,
            contentTypeSynergy: contentTypeSynergyArray,
            domainCorrelations
        };
    }
    /**
     * Get recent events
     */
    async getRecentEvents(limit = 100) {
        return this.events.slice(-limit);
    }
    /**
     * Get events by domain
     */
    async getEventsByDomain(domain, limit = 100) {
        return this.events
            .filter(event => event.domain === domain)
            .slice(-limit);
    }
    /**
     * Get events by user
     */
    async getEventsByUser(userId, limit = 100) {
        return this.events
            .filter(event => event.userId === userId)
            .slice(-limit);
    }
    /**
     * Export analytics data
     */
    async exportData() {
        const domainMetricsObj = {};
        this.domainMetrics.forEach((metrics, domain) => {
            domainMetricsObj[domain] = {
                ...metrics,
                uniqueUsers: Array.from(metrics.uniqueUsers),
                contentTypes: Object.fromEntries(metrics.contentTypes)
            };
        });
        const userMetricsObj = {};
        this.userMetrics.forEach((metrics, userId) => {
            userMetricsObj[userId] = {
                ...metrics,
                domains: Array.from(metrics.domains),
                contentTypes: Object.fromEntries(metrics.contentTypes)
            };
        });
        return {
            events: this.events,
            domainMetrics: domainMetricsObj,
            userMetrics: userMetricsObj,
            systemMetrics: await this.getSystemMetrics()
        };
    }
    /**
     * Clear all analytics data
     */
    async clearData() {
        this.events = [];
        this.performanceBuffer = [];
        this.userMetrics.clear();
        // Reset domain metrics
        const domains = ['corporate', 'technical', 'business', 'justice'];
        domains.forEach(domain => {
            this.domainMetrics.set(domain, {
                domain,
                totalRequests: 0,
                successfulRequests: 0,
                failedRequests: 0,
                averageResponseTime: 0,
                totalTokensUsed: 0,
                uniqueUsers: new Set(),
                contentTypes: new Map(),
                lastActivity: new Date()
            });
        });
        this.startTime = new Date();
    }
    // Private helper methods
    updateDomainMetrics(event) {
        const metrics = this.domainMetrics.get(event.domain);
        if (!metrics)
            return;
        metrics.totalRequests++;
        if (event.success) {
            metrics.successfulRequests++;
        }
        else {
            metrics.failedRequests++;
        }
        if (event.tokensUsed) {
            metrics.totalTokensUsed += event.tokensUsed;
        }
        metrics.uniqueUsers.add(event.userId);
        const currentCount = metrics.contentTypes.get(event.contentType) || 0;
        metrics.contentTypes.set(event.contentType, currentCount + 1);
        metrics.lastActivity = event.timestamp || new Date();
        // Update average response time
        if (event.performance) {
            const totalTime = metrics.averageResponseTime * (metrics.totalRequests - 1) + event.performance.responseTime;
            metrics.averageResponseTime = totalTime / metrics.totalRequests;
        }
    }
    updateUserMetrics(event) {
        let metrics = this.userMetrics.get(event.userId);
        if (!metrics) {
            metrics = {
                userId: event.userId,
                role: event.userRole,
                totalRequests: 0,
                successfulRequests: 0,
                failedRequests: 0,
                totalTokensUsed: 0,
                averageResponseTime: 0,
                domains: new Set(),
                contentTypes: new Map(),
                firstActivity: event.timestamp || new Date(),
                lastActivity: event.timestamp || new Date()
            };
            this.userMetrics.set(event.userId, metrics);
        }
        metrics.totalRequests++;
        if (event.success) {
            metrics.successfulRequests++;
        }
        else {
            metrics.failedRequests++;
        }
        if (event.tokensUsed) {
            metrics.totalTokensUsed += event.tokensUsed;
        }
        metrics.domains.add(event.domain);
        const currentCount = metrics.contentTypes.get(event.contentType) || 0;
        metrics.contentTypes.set(event.contentType, currentCount + 1);
        metrics.lastActivity = event.timestamp || new Date();
        // Update average response time
        if (event.performance) {
            const totalTime = metrics.averageResponseTime * (metrics.totalRequests - 1) + event.performance.responseTime;
            metrics.averageResponseTime = totalTime / metrics.totalRequests;
        }
    }
    calculatePeakConcurrentUsers() {
        // This is a simplified calculation
        // In a real implementation, you'd track concurrent sessions
        return Math.max(this.userMetrics.size, 1);
    }
    cleanup() {
        const cutoffTime = new Date(Date.now() - 86400000); // 24 hours ago
        // Remove old events
        this.events = this.events.filter(event => (event.timestamp || new Date()) > cutoffTime);
        // Remove old performance metrics
        this.performanceBuffer = this.performanceBuffer.filter(metrics => metrics.timestamp > cutoffTime);
    }
}
// Export singleton instance
export const analyticsService = new AnalyticsService();
//# sourceMappingURL=AnalyticsService.js.map