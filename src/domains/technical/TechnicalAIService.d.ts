import { UserRole, RateLimitTier, ServiceResponse, CodeGenerationRequest, CodeGenerationResponse } from '../../shared/types/ai';
interface TechnicalDocumentationRequest {
    type: 'api_docs' | 'user_guide' | 'technical_spec' | 'architecture_doc' | 'deployment_guide';
    project: string;
    technology: string;
    audience: 'developers' | 'users' | 'stakeholders' | 'technical_leads';
    complexity: 'beginner' | 'intermediate' | 'advanced';
    sections?: string[];
    codeExamples?: boolean;
}
interface CodeReviewRequest {
    code: string;
    language: string;
    focus: 'security' | 'performance' | 'maintainability' | 'best_practices' | 'all';
    severity: 'critical' | 'major' | 'minor' | 'all';
}
interface ArchitectureRequest {
    projectType: string;
    requirements: string[];
    constraints: string[];
    scalability: 'small' | 'medium' | 'large' | 'enterprise';
    technologies?: string[];
}
interface TestGenerationRequest {
    code: string;
    language: string;
    testType: 'unit' | 'integration' | 'e2e' | 'performance';
    framework?: string;
    coverage: 'basic' | 'comprehensive';
}
export declare class TechnicalAIService {
    private domain;
    /**
     * Generate code based on requirements
     */
    generateCode(request: CodeGenerationRequest, userId: string, userRole: UserRole, tier: RateLimitTier): Promise<ServiceResponse<CodeGenerationResponse>>;
    /**
     * Generate technical documentation
     */
    generateTechnicalDocumentation(request: TechnicalDocumentationRequest, userId: string, userRole: UserRole, tier: RateLimitTier): Promise<ServiceResponse<string>>;
    /**
     * Perform code review
     */
    performCodeReview(request: CodeReviewRequest, userId: string, userRole: UserRole, tier: RateLimitTier): Promise<ServiceResponse<string>>;
    /**
     * Generate system architecture
     */
    generateArchitecture(request: ArchitectureRequest, userId: string, userRole: UserRole, tier: RateLimitTier): Promise<ServiceResponse<string>>;
    /**
     * Generate API documentation
     */
    generateAPIDocumentation(endpoints: Array<{
        method: string;
        path: string;
        description: string;
        parameters?: any[];
        responses?: any[];
    }>, baseUrl: string, authentication: string, userId: string, userRole: UserRole, tier: RateLimitTier): Promise<ServiceResponse<string>>;
    /**
     * Generate test cases
     */
    generateTestCases(request: TestGenerationRequest, userId: string, userRole: UserRole, tier: RateLimitTier): Promise<ServiceResponse<string>>;
    /**
     * Generate deployment guide
     */
    generateDeploymentGuide(platform: string, technology: string, environment: 'development' | 'staging' | 'production', requirements: string[], userId: string, userRole: UserRole, tier: RateLimitTier): Promise<ServiceResponse<string>>;
    /**
     * Generate technical specification
     */
    generateTechnicalSpecification(project: string, features: string[], constraints: string[], integrations: string[], userId: string, userRole: UserRole, tier: RateLimitTier): Promise<ServiceResponse<string>>;
    /**
     * Generate database schema
     */
    generateDatabaseSchema(entities: Array<{
        name: string;
        fields: Array<{
            name: string;
            type: string;
            constraints?: string[];
        }>;
        relationships?: Array<{
            type: string;
            target: string;
            description: string;
        }>;
    }>, database: string, userId: string, userRole: UserRole, tier: RateLimitTier): Promise<ServiceResponse<string>>;
    private buildDocumentationPrompt;
}
export declare const technicalAIService: TechnicalAIService;
export {};
//# sourceMappingURL=TechnicalAIService.d.ts.map