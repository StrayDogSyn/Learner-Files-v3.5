import { UserRole, RateLimitTier, ServiceResponse } from '../../shared/types/ai';
interface CorporateContentRequest {
    type: 'press_release' | 'executive_summary' | 'strategic_plan' | 'investor_update' | 'company_announcement';
    topic: string;
    audience: 'investors' | 'employees' | 'media' | 'partners' | 'general_public';
    tone: 'professional' | 'authoritative' | 'inspiring' | 'informative';
    length: 'brief' | 'standard' | 'detailed';
    keyPoints?: string[];
    callToAction?: string;
}
interface LeadershipContent {
    position: string;
    experience: string[];
    achievements: string[];
    vision: string;
    expertise: string[];
}
interface CompanyMetrics {
    revenue?: number;
    growth?: number;
    employees?: number;
    clients?: number;
    projects?: number;
    satisfaction?: number;
}
export declare class CorporateAIService {
    private domain;
    /**
     * Generate corporate content
     */
    generateCorporateContent(request: CorporateContentRequest, userId: string, userRole: UserRole, tier: RateLimitTier): Promise<ServiceResponse<string>>;
    /**
     * Generate executive summary
     */
    generateExecutiveSummary(topic: string, keyMetrics: CompanyMetrics, objectives: string[], userId: string, userRole: UserRole, tier: RateLimitTier): Promise<ServiceResponse<string>>;
    /**
     * Generate leadership profile
     */
    generateLeadershipProfile(leader: LeadershipContent, userId: string, userRole: UserRole, tier: RateLimitTier): Promise<ServiceResponse<string>>;
    /**
     * Generate investor update
     */
    generateInvestorUpdate(quarter: string, metrics: CompanyMetrics, highlights: string[], challenges: string[], outlook: string, userId: string, userRole: UserRole, tier: RateLimitTier): Promise<ServiceResponse<string>>;
    /**
     * Generate strategic plan content
     */
    generateStrategicPlan(timeframe: string, objectives: string[], initiatives: string[], resources: string[], metrics: string[], userId: string, userRole: UserRole, tier: RateLimitTier): Promise<ServiceResponse<string>>;
    /**
     * Generate press release
     */
    generatePressRelease(announcement: string, details: string[], quotes: Array<{
        speaker: string;
        role: string;
        quote: string;
    }>, contact: {
        name: string;
        email: string;
        phone: string;
    }, userId: string, userRole: UserRole, tier: RateLimitTier): Promise<ServiceResponse<string>>;
    /**
     * Generate company announcement
     */
    generateCompanyAnnouncement(type: 'internal' | 'external', subject: string, message: string, action: string, userId: string, userRole: UserRole, tier: RateLimitTier, deadline?: string): Promise<ServiceResponse<string>>;
    /**
     * Generate corporate vision statement
     */
    generateVisionStatement(industry: string, values: string[], goals: string[], impact: string, userId: string, userRole: UserRole, tier: RateLimitTier): Promise<ServiceResponse<string>>;
    private buildCorporateContentPrompt;
    private formatMetrics;
}
export declare const corporateAIService: CorporateAIService;
export {};
//# sourceMappingURL=CorporateAIService.d.ts.map