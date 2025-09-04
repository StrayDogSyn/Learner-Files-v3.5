import { DomainType, ContentType, UserRole, RateLimitTier, ServiceResponse, LeadQualificationRequest, LeadQualificationResponse, CodeGenerationRequest, CodeGenerationResponse, ROIAnalysisRequest, ROIAnalysisResponse, ImpactMetricsRequest, ImpactMetricsResponse } from '../../shared/types/ai';
export declare class AIService {
    private orchestrator;
    constructor();
    /**
     * Generate content using AI with full orchestration
     */
    generateContent(prompt: string, domain: DomainType, contentType: ContentType, userId: string, userRole: UserRole, tier: RateLimitTier, sessionId?: string): Promise<ServiceResponse<string>>;
    /**
     * Qualify leads for business domain
     */
    qualifyLead(request: LeadQualificationRequest, userId: string, userRole: UserRole, tier: RateLimitTier): Promise<ServiceResponse<LeadQualificationResponse>>;
    /**
     * Generate code for technical domain
     */
    generateCode(request: CodeGenerationRequest, userId: string, userRole: UserRole, tier: RateLimitTier): Promise<ServiceResponse<CodeGenerationResponse>>;
    /**
     * Analyze ROI for business domain
     */
    analyzeROI(request: ROIAnalysisRequest, userId: string, userRole: UserRole, tier: RateLimitTier): Promise<ServiceResponse<ROIAnalysisResponse>>;
    /**
     * Calculate impact metrics for justice domain
     */
    calculateImpactMetrics(request: ImpactMetricsRequest, userId: string, userRole: UserRole, tier: RateLimitTier): Promise<ServiceResponse<ImpactMetricsResponse>>;
    /**
     * Get user's rate limit status
     */
    getRateLimitStatus(userId: string, tier: RateLimitTier): Promise<ServiceResponse<{
        requests: number;
        tokens: number;
        remaining: number;
        resetTime: string;
        tier: RateLimitTier;
    }>>;
    /**
     * Get user's session history
     */
    getUserSessions(userId: string): Promise<ServiceResponse<any[]>>;
    private buildLeadQualificationPrompt;
    private buildCodeGenerationPrompt;
    private buildROIAnalysisPrompt;
    private buildImpactMetricsPrompt;
    private parseLeadQualification;
    private parseCodeGeneration;
    private parseROIAnalysis;
    private parseImpactMetrics;
}
export declare const aiService: AIService;
//# sourceMappingURL=AIService.d.ts.map