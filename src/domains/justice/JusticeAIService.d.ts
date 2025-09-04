import { UserRole, RateLimitTier, ServiceResponse, ImpactMetricsRequest, ImpactMetricsResponse } from '../../shared/types/ai';
interface PolicyAnalysisRequest {
    policyType: 'criminal_justice' | 'civil_rights' | 'legal_reform' | 'social_justice' | 'regulatory';
    jurisdiction: string;
    scope: 'local' | 'state' | 'federal' | 'international';
    stakeholders: string[];
    objectives: string[];
    constraints?: string[];
}
interface LegalResearchRequest {
    topic: string;
    jurisdiction: string;
    caseTypes: string[];
    timeframe: string;
    researchDepth: 'overview' | 'detailed' | 'comprehensive';
    precedents?: boolean;
}
interface ReformProposalRequest {
    area: string;
    currentIssues: string[];
    proposedChanges: string[];
    stakeholders: string[];
    timeline: string;
    resources: string[];
}
interface CaseAnalysisRequest {
    caseType: string;
    facts: string[];
    legalIssues: string[];
    jurisdiction: string;
    precedents?: string[];
    analysisType: 'legal_strategy' | 'risk_assessment' | 'outcome_prediction' | 'comprehensive';
}
interface ComplianceAssessmentRequest {
    organization: string;
    industry: string;
    regulations: string[];
    currentPractices: string[];
    riskAreas?: string[];
}
export declare class JusticeAIService {
    private domain;
    /**
     * Calculate impact metrics for justice initiatives
     */
    calculateImpactMetrics(request: ImpactMetricsRequest, userId: string, userRole: UserRole, tier: RateLimitTier): Promise<ServiceResponse<ImpactMetricsResponse>>;
    /**
     * Analyze policy implications
     */
    analyzePolicyImplications(request: PolicyAnalysisRequest, userId: string, userRole: UserRole, tier: RateLimitTier): Promise<ServiceResponse<string>>;
    /**
     * Conduct legal research
     */
    conductLegalResearch(request: LegalResearchRequest, userId: string, userRole: UserRole, tier: RateLimitTier): Promise<ServiceResponse<string>>;
    /**
     * Generate reform proposal
     */
    generateReformProposal(request: ReformProposalRequest, userId: string, userRole: UserRole, tier: RateLimitTier): Promise<ServiceResponse<string>>;
    /**
     * Analyze case strategy
     */
    analyzeCaseStrategy(request: CaseAnalysisRequest, userId: string, userRole: UserRole, tier: RateLimitTier): Promise<ServiceResponse<string>>;
    /**
     * Assess compliance requirements
     */
    assessCompliance(request: ComplianceAssessmentRequest, userId: string, userRole: UserRole, tier: RateLimitTier): Promise<ServiceResponse<string>>;
    /**
     * Generate social impact report
     */
    generateSocialImpactReport(program: string, metrics: Array<{
        name: string;
        baseline: number;
        current: number;
        target: number;
        unit: string;
    }>, beneficiaries: string[], timeframe: string, userId: string, userRole: UserRole, tier: RateLimitTier): Promise<ServiceResponse<string>>;
    /**
     * Analyze criminal justice trends
     */
    analyzeCriminalJusticeTrends(jurisdiction: string, timeframe: string, focusAreas: string[], dataPoints: Array<{
        metric: string;
        trend: 'increasing' | 'decreasing' | 'stable';
        percentage: number;
    }>, userId: string, userRole: UserRole, tier: RateLimitTier): Promise<ServiceResponse<string>>;
    /**
     * Generate advocacy strategy
     */
    generateAdvocacyStrategy(cause: string, objectives: string[], targetAudience: string[], resources: string[], timeline: string, userId: string, userRole: UserRole, tier: RateLimitTier, opposition?: string[]): Promise<ServiceResponse<string>>;
}
export declare const justiceAIService: JusticeAIService;
export {};
//# sourceMappingURL=JusticeAIService.d.ts.map