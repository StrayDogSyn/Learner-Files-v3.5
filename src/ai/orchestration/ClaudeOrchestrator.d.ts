import { ClaudeRequest, ClaudeResponse, DomainType, RateLimitTier, ServiceResponse, AIAnalyticsEvent } from '../../shared/types/ai';
export declare class ClaudeOrchestrator {
    private rateLimiter;
    private contextManager;
    private analytics;
    private apiKey;
    private baseUrl;
    constructor(apiKey: string);
    /**
     * Main orchestration method for generating AI content
     */
    generateContent(request: ClaudeRequest, userTier?: RateLimitTier): Promise<ServiceResponse<ClaudeResponse>>;
    /**
     * Build domain-specific prompts
     */
    private buildPrompt;
    /**
     * Get domain-specific base prompts
     */
    private getBasePrompt;
    /**
     * Build context-aware prompts
     */
    private buildContextPrompt;
    /**
     * Build task-specific prompts
     */
    private buildTaskPrompt;
    /**
     * Call Claude API with proper error handling
     */
    private callClaudeAPI;
    /**
     * Get real-time performance metrics
     */
    getPerformanceMetrics(): Promise<any>;
    /**
     * Get analytics events for a specific domain
     */
    getDomainAnalytics(domain: DomainType, timeframe?: string): Promise<AIAnalyticsEvent[]>;
    /**
     * Utility methods
     */
    private generateRequestId;
    private generateSessionId;
    private createErrorResponse;
}
export declare const claudeOrchestrator: ClaudeOrchestrator;
//# sourceMappingURL=ClaudeOrchestrator.d.ts.map