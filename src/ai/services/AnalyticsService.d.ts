import { AIAnalyticsEvent, DomainType, ContentType, UserRole } from '../../shared/types/ai';
interface DomainMetrics {
    domain: DomainType;
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    averageResponseTime: number;
    totalTokensUsed: number;
    uniqueUsers: Set<string>;
    contentTypes: Map<ContentType, number>;
    lastActivity: Date;
}
interface UserMetrics {
    userId: string;
    role: UserRole;
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    totalTokensUsed: number;
    averageResponseTime: number;
    domains: Set<DomainType>;
    contentTypes: Map<ContentType, number>;
    firstActivity: Date;
    lastActivity: Date;
}
interface SystemMetrics {
    totalRequests: number;
    totalUsers: number;
    totalTokensUsed: number;
    averageResponseTime: number;
    errorRate: number;
    uptime: number;
    peakConcurrentUsers: number;
    domainDistribution: Map<DomainType, number>;
    contentTypeDistribution: Map<ContentType, number>;
    userRoleDistribution: Map<UserRole, number>;
}
export declare class AnalyticsService {
    private events;
    private domainMetrics;
    private userMetrics;
    private performanceBuffer;
    private startTime;
    private maxEvents;
    private maxPerformanceBuffer;
    constructor();
    /**
     * Track an AI analytics event
     */
    trackEvent(event: AIAnalyticsEvent): Promise<void>;
    /**
     * Track performance metrics
     */
    trackPerformance(performanceData: {
        responseTime: number;
        timestamp: Date;
    }): Promise<void>;
    /**
     * Get domain-specific metrics
     */
    getDomainMetrics(domain: DomainType): Promise<DomainMetrics | null>;
    /**
     * Get user-specific metrics
     */
    getUserMetrics(userId: string): Promise<UserMetrics | null>;
    /**
     * Get system-wide metrics
     */
    getSystemMetrics(): Promise<SystemMetrics>;
    /**
     * Get cross-domain insights
     */
    getCrossDomainInsights(): Promise<{
        userCrossDomainActivity: Array<{
            userId: string;
            domains: DomainType[];
            totalRequests: number;
            crossDomainScore: number;
        }>;
        contentTypeSynergy: Array<{
            contentType: ContentType;
            domains: DomainType[];
            totalUsage: number;
        }>;
        domainCorrelations: Array<{
            domain1: DomainType;
            domain2: DomainType;
            sharedUsers: number;
            correlationScore: number;
        }>;
    }>;
    /**
     * Get recent events
     */
    getRecentEvents(limit?: number): Promise<AIAnalyticsEvent[]>;
    /**
     * Get events by domain
     */
    getEventsByDomain(domain: DomainType, limit?: number): Promise<AIAnalyticsEvent[]>;
    /**
     * Get events by user
     */
    getEventsByUser(userId: string, limit?: number): Promise<AIAnalyticsEvent[]>;
    /**
     * Export analytics data
     */
    exportData(): Promise<{
        events: AIAnalyticsEvent[];
        domainMetrics: Record<string, any>;
        userMetrics: Record<string, any>;
        systemMetrics: SystemMetrics;
    }>;
    /**
     * Clear all analytics data
     */
    clearData(): Promise<void>;
    private updateDomainMetrics;
    private updateUserMetrics;
    private calculatePeakConcurrentUsers;
    private cleanup;
}
export declare const analyticsService: AnalyticsService;
export {};
//# sourceMappingURL=AnalyticsService.d.ts.map