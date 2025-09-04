import { UserRole, RateLimitTier, ServiceResponse, LeadQualificationRequest, LeadQualificationResponse, ROIAnalysisRequest, ROIAnalysisResponse } from '../../shared/types/ai';
interface BusinessPlanRequest {
    businessType: string;
    industry: string;
    targetMarket: string;
    timeframe: string;
    budget: number;
    objectives: string[];
    competitors?: string[];
}
interface MarketAnalysisRequest {
    industry: string;
    region: string;
    targetDemographic: string;
    analysisType: 'competitive' | 'market_size' | 'trends' | 'opportunities' | 'comprehensive';
    timeframe: string;
}
interface SalesStrategyRequest {
    product: string;
    targetAudience: string;
    salesCycle: string;
    channels: string[];
    budget: number;
    goals: string[];
}
interface FinancialProjectionRequest {
    businessModel: string;
    revenue: number;
    costs: number;
    growth: number;
    timeframe: string;
    scenarios: 'conservative' | 'realistic' | 'optimistic' | 'all';
}
interface ProposalRequest {
    clientName: string;
    projectType: string;
    scope: string[];
    timeline: string;
    budget: number;
    deliverables: string[];
    terms?: string[];
}
export declare class BusinessAIService {
    private domain;
    /**
     * Qualify leads based on criteria
     */
    qualifyLead(request: LeadQualificationRequest, userId: string, userRole: UserRole, tier: RateLimitTier): Promise<ServiceResponse<LeadQualificationResponse>>;
    /**
     * Analyze ROI for business decisions
     */
    analyzeROI(request: ROIAnalysisRequest, userId: string, userRole: UserRole, tier: RateLimitTier): Promise<ServiceResponse<ROIAnalysisResponse>>;
    /**
     * Generate business plan
     */
    generateBusinessPlan(request: BusinessPlanRequest, userId: string, userRole: UserRole, tier: RateLimitTier): Promise<ServiceResponse<string>>;
    /**
     * Conduct market analysis
     */
    conductMarketAnalysis(request: MarketAnalysisRequest, userId: string, userRole: UserRole, tier: RateLimitTier): Promise<ServiceResponse<string>>;
    /**
     * Develop sales strategy
     */
    developSalesStrategy(request: SalesStrategyRequest, userId: string, userRole: UserRole, tier: RateLimitTier): Promise<ServiceResponse<string>>;
    /**
     * Generate financial projections
     */
    generateFinancialProjections(request: FinancialProjectionRequest, userId: string, userRole: UserRole, tier: RateLimitTier): Promise<ServiceResponse<string>>;
    /**
     * Create business proposal
     */
    createBusinessProposal(request: ProposalRequest, userId: string, userRole: UserRole, tier: RateLimitTier): Promise<ServiceResponse<string>>;
    /**
     * Generate competitive analysis
     */
    generateCompetitiveAnalysis(industry: string, competitors: Array<{
        name: string;
        strengths: string[];
        weaknesses: string[];
        marketShare?: number;
    }>, focusAreas: string[], userId: string, userRole: UserRole, tier: RateLimitTier): Promise<ServiceResponse<string>>;
    /**
     * Generate customer persona
     */
    generateCustomerPersona(product: string, demographics: {
        age: string;
        income: string;
        location: string;
        education: string;
        occupation: string;
    }, psychographics: {
        interests: string[];
        values: string[];
        lifestyle: string;
        challenges: string[];
    }, userId: string, userRole: UserRole, tier: RateLimitTier): Promise<ServiceResponse<string>>;
    /**
     * Generate marketing campaign
     */
    generateMarketingCampaign(product: string, objective: string, budget: number, duration: string, channels: string[], targetAudience: string, userId: string, userRole: UserRole, tier: RateLimitTier): Promise<ServiceResponse<string>>;
}
export declare const businessAIService: BusinessAIService;
export {};
//# sourceMappingURL=BusinessAIService.d.ts.map