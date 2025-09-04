import { DomainType, UserRole, RateLimitTier, ServiceResponse } from '../../shared/types/ai';
interface CrossDomainRequest {
    primaryDomain: DomainType;
    secondaryDomains?: DomainType[];
    content: string;
    context?: any;
    userId: string;
    userRole: UserRole;
    tier: RateLimitTier;
}
interface DomainInsight {
    domain: DomainType;
    relevance: number;
    insights: string[];
    recommendations: string[];
}
interface CrossDomainAnalysis {
    primaryInsights: DomainInsight;
    secondaryInsights: DomainInsight[];
    synergies: string[];
    conflicts: string[];
    recommendations: string[];
}
export declare class DomainCoordinator {
    private domainServices;
    /**
     * Route request to appropriate domain service
     */
    routeRequest(domain: DomainType, method: string, params: any[], userId: string, userRole: UserRole, tier: RateLimitTier): Promise<ServiceResponse<any>>;
    /**
     * Perform cross-domain analysis
     */
    performCrossDomainAnalysis(request: CrossDomainRequest): Promise<ServiceResponse<CrossDomainAnalysis>>;
    /**
     * Get domain-specific recommendations
     */
    getDomainRecommendations(domain: DomainType, context: string, userId: string, userRole: UserRole, tier: RateLimitTier): Promise<ServiceResponse<string[]>>;
    /**
     * Get cross-domain insights
     */
    getCrossDomainInsights(userId: string, timeframe?: 'day' | 'week' | 'month' | 'quarter'): Promise<ServiceResponse<any>>;
    /**
     * Coordinate multi-domain workflow
     */
    coordinateWorkflow(workflow: Array<{
        domain: DomainType;
        method: string;
        params: any[];
        dependencies?: number[];
    }>, userId: string, userRole: UserRole, tier: RateLimitTier): Promise<ServiceResponse<any[]>>;
    private analyzeDomainRelevance;
    private calculateRelevanceScore;
    private identifySynergies;
    private identifyConflicts;
    private generateCrossDomainRecommendations;
    private generateContextualRecommendations;
    private findMostActiveDomain;
    private analyzeCrossDomainPatterns;
    private calculateEfficiencyMetrics;
    private generateInsightRecommendations;
    private calculateExecutionOrder;
}
export declare const domainCoordinator: DomainCoordinator;
export {};
//# sourceMappingURL=DomainCoordinator.d.ts.map