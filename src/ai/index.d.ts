import { domainCoordinator } from './orchestration/DomainCoordinator';
import { claudeOrchestrator } from './orchestration/ClaudeOrchestrator';
import { aiService } from './services/AIService';
import { rateLimiter } from './services/RateLimiter';
import { analyticsService } from './services/AnalyticsService';
import { contextManager } from './services/ContextManager';
import { corporateAIService } from '../domains/corporate/CorporateAIService';
import { technicalAIService } from '../domains/technical/TechnicalAIService';
import { businessAIService } from '../domains/business/BusinessAIService';
import { justiceAIService } from '../domains/justice/JusticeAIService';
import { DomainType, ContentType, UserRole, RateLimitTier, ServiceResponse, LeadQualificationRequest, LeadQualificationResponse, CodeGenerationRequest, CodeGenerationResponse, ROIAnalysisRequest, ROIAnalysisResponse, ImpactMetricsRequest, ImpactMetricsResponse } from '../shared/types/ai';
/**
 * StrayDog AI Ecosystem - Unified Interface
 *
 * This is the main entry point for the StrayDog Syndications AI Ecosystem.
 * It provides a unified interface for all AI services across domains:
 * - Corporate: Executive content, leadership profiles, strategic communications
 * - Technical: Code generation, documentation, architecture design
 * - Business: Lead qualification, ROI analysis, market insights
 * - Justice: Impact metrics, policy analysis, reform strategies
 */
export declare class StrayDogAI {
    private initialized;
    /**
     * Initialize the AI ecosystem
     */
    initialize(): Promise<void>;
    /**
     * Generate content using AI across any domain
     */
    generateContent(domain: DomainType, contentType: ContentType, prompt: string, userId: string, userRole?: UserRole, tier?: RateLimitTier): Promise<ServiceResponse<string>>;
    /**
     * Qualify business leads
     */
    qualifyLead(request: LeadQualificationRequest, userId: string, userRole?: UserRole, tier?: RateLimitTier): Promise<ServiceResponse<LeadQualificationResponse>>;
    /**
     * Generate code and technical content
     */
    generateCode(request: CodeGenerationRequest, userId: string, userRole?: UserRole, tier?: RateLimitTier): Promise<ServiceResponse<CodeGenerationResponse>>;
    /**
     * Analyze ROI and business metrics
     */
    analyzeROI(request: ROIAnalysisRequest, userId: string, userRole?: UserRole, tier?: RateLimitTier): Promise<ServiceResponse<ROIAnalysisResponse>>;
    /**
     * Calculate impact metrics for justice initiatives
     */
    calculateImpactMetrics(request: ImpactMetricsRequest, userId: string, userRole?: UserRole, tier?: RateLimitTier): Promise<ServiceResponse<ImpactMetricsResponse>>;
    /**
     * Route requests to specific domain services
     */
    routeToDomain(domain: DomainType, method: string, params: any[], userId: string, userRole?: UserRole, tier?: RateLimitTier): Promise<ServiceResponse<any>>;
    /**
     * Perform cross-domain analysis
     */
    analyzeCrossDomain(primaryDomain: DomainType, content: string, secondaryDomains: DomainType[] | undefined, userId: string, userRole?: UserRole, tier?: RateLimitTier): Promise<ServiceResponse<any>>;
    /**
     * Get domain-specific recommendations
     */
    getDomainRecommendations(domain: DomainType, context: string, userId: string, userRole?: UserRole, tier?: RateLimitTier): Promise<ServiceResponse<string[]>>;
    /**
     * Get analytics and insights
     */
    getAnalytics(userId?: string, timeframe?: 'day' | 'week' | 'month' | 'quarter'): Promise<{
        domainMetrics: any;
        userMetrics?: any;
        systemMetrics: any;
        crossDomainInsights: ServiceResponse<any>;
    }>;
    /**
     * Get rate limit status for a user
     */
    getRateLimitStatus(userId: string, tier: RateLimitTier): Promise<{
        remaining: number;
        resetTime: Date;
        tier: RateLimitTier;
    }>;
    /**
     * Get user's conversation context
     */
    getUserContext(userId: string, domain: DomainType): Promise<any>;
    /**
     * Update user's conversation context
     */
    updateUserContext(userId: string, domain: DomainType, message: string, response: string): Promise<void>;
    /**
     * Export analytics data
     */
    exportAnalytics(format?: 'json' | 'csv', timeframe?: 'day' | 'week' | 'month' | 'quarter'): Promise<any>;
    /**
     * Health check for the AI ecosystem
     */
    healthCheck(): Promise<{
        status: 'healthy' | 'degraded' | 'unhealthy';
        services: Record<string, boolean>;
        timestamp: Date;
    }>;
    private ensureInitialized;
}
export declare const strayDogAI: StrayDogAI;
export * from '../shared/types/ai';
export { domainCoordinator, claudeOrchestrator, aiService, rateLimiter, analyticsService, contextManager, corporateAIService, technicalAIService, businessAIService, justiceAIService };
export declare const domains: {
    corporate: import("../domains/corporate/CorporateAIService").CorporateAIService;
    technical: import("../domains/technical/TechnicalAIService").TechnicalAIService;
    business: import("../domains/business/BusinessAIService").BusinessAIService;
    justice: import("../domains/justice/JusticeAIService").JusticeAIService;
};
export default strayDogAI;
//# sourceMappingURL=index.d.ts.map