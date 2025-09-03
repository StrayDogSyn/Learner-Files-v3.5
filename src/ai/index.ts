// StrayDog Syndications AI Ecosystem - Main Entry Point

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
import { 
  DomainType, 
  ContentType, 
  UserRole, 
  RateLimitTier,
  ServiceResponse,
  LeadQualificationRequest,
  LeadQualificationResponse,
  CodeGenerationRequest,
  CodeGenerationResponse,
  ROIAnalysisRequest,
  ROIAnalysisResponse,
  ImpactMetricsRequest,
  ImpactMetricsResponse
} from '../shared/types/ai';

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
export class StrayDogAI {
  private initialized = false;

  /**
   * Initialize the AI ecosystem
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Initialize core services
      await analyticsService.trackEvent({
        eventId: 'system_init_' + Date.now(),
        domain: 'corporate', // Default domain for system events
        contentType: 'analysis',
        userId: 'system',
        userRole: 'admin',
        success: true,
        timestamp: new Date(),
        tokensUsed: 0
      });

      this.initialized = true;
      console.log('StrayDog AI Ecosystem initialized successfully');
    } catch (error) {
      console.error('Failed to initialize StrayDog AI Ecosystem:', error);
      throw error;
    }
  }

  /**
   * Generate content using AI across any domain
   */
  async generateContent(
    domain: DomainType,
    contentType: ContentType,
    prompt: string,
    userId: string,
    userRole: UserRole = 'user',
    tier: RateLimitTier = 'free'
  ): Promise<ServiceResponse<string>> {
    await this.ensureInitialized();
    return aiService.generateContent(prompt, domain, contentType, userId, userRole, tier);
  }

  /**
   * Qualify business leads
   */
  async qualifyLead(
    request: LeadQualificationRequest,
    userId: string,
    userRole: UserRole = 'user',
    tier: RateLimitTier = 'free'
  ): Promise<ServiceResponse<LeadQualificationResponse>> {
    await this.ensureInitialized();
    return aiService.qualifyLead(request, userId, userRole, tier);
  }

  /**
   * Generate code and technical content
   */
  async generateCode(
    request: CodeGenerationRequest,
    userId: string,
    userRole: UserRole = 'user',
    tier: RateLimitTier = 'free'
  ): Promise<ServiceResponse<CodeGenerationResponse>> {
    await this.ensureInitialized();
    return aiService.generateCode(request, userId, userRole, tier);
  }

  /**
   * Analyze ROI and business metrics
   */
  async analyzeROI(
    request: ROIAnalysisRequest,
    userId: string,
    userRole: UserRole = 'user',
    tier: RateLimitTier = 'free'
  ): Promise<ServiceResponse<ROIAnalysisResponse>> {
    await this.ensureInitialized();
    return aiService.analyzeROI(request, userId, userRole, tier);
  }

  /**
   * Calculate impact metrics for justice initiatives
   */
  async calculateImpactMetrics(
    request: ImpactMetricsRequest,
    userId: string,
    userRole: UserRole = 'user',
    tier: RateLimitTier = 'free'
  ): Promise<ServiceResponse<ImpactMetricsResponse>> {
    await this.ensureInitialized();
    return aiService.calculateImpactMetrics(request, userId, userRole, tier);
  }

  /**
   * Route requests to specific domain services
   */
  async routeToDomain(
    domain: DomainType,
    method: string,
    params: any[],
    userId: string,
    userRole: UserRole = 'user',
    tier: RateLimitTier = 'free'
  ): Promise<ServiceResponse<any>> {
    await this.ensureInitialized();
    return domainCoordinator.routeRequest(domain, method, params, userId, userRole, tier);
  }

  /**
   * Perform cross-domain analysis
   */
  async analyzeCrossDomain(
    primaryDomain: DomainType,
    content: string,
    secondaryDomains: DomainType[] = [],
    userId: string,
    userRole: UserRole = 'user',
    tier: RateLimitTier = 'free'
  ): Promise<ServiceResponse<any>> {
    await this.ensureInitialized();
    return domainCoordinator.performCrossDomainAnalysis({
      primaryDomain,
      secondaryDomains,
      content,
      userId,
      userRole,
      tier
    });
  }

  /**
   * Get domain-specific recommendations
   */
  async getDomainRecommendations(
    domain: DomainType,
    context: string,
    userId: string,
    userRole: UserRole = 'user',
    tier: RateLimitTier = 'free'
  ): Promise<ServiceResponse<string[]>> {
    await this.ensureInitialized();
    return domainCoordinator.getDomainRecommendations(domain, context, userId, userRole, tier);
  }

  /**
   * Get analytics and insights
   */
  async getAnalytics(
    userId?: string,
    timeframe: 'day' | 'week' | 'month' | 'quarter' = 'week'
  ): Promise<{
    domainMetrics: any;
    userMetrics?: any;
    systemMetrics: any;
    crossDomainInsights: ServiceResponse<any>;
  }> {
    await this.ensureInitialized();
    
    const [systemMetrics] = await Promise.all([
      analyticsService.getSystemMetrics()
    ]);
    
    // Get metrics for all domains
    const domainMetrics = {
      corporate: await analyticsService.getDomainMetrics('corporate'),
      technical: await analyticsService.getDomainMetrics('technical'),
      business: await analyticsService.getDomainMetrics('business'),
      justice: await analyticsService.getDomainMetrics('justice')
    };

    const userMetrics = userId ? await analyticsService.getUserMetrics(userId) : undefined;
    const crossDomainInsights = userId ? 
      await domainCoordinator.getCrossDomainInsights(userId, timeframe) :
      { success: false, error: { code: 'USER_ID_REQUIRED', message: 'User ID required for cross-domain insights', timestamp: new Date() } };

    return {
      domainMetrics,
      userMetrics,
      systemMetrics,
      crossDomainInsights
    };
  }

  /**
   * Get rate limit status for a user
   */
  async getRateLimitStatus(
    userId: string,
    tier: RateLimitTier
  ): Promise<{
    remaining: number;
    resetTime: Date;
    tier: RateLimitTier;
  }> {
    await this.ensureInitialized();
    const usage = rateLimiter.getUsage(userId, tier);
    const config = rateLimiter.getConfig(tier);
    
    return {
      remaining: Math.max(0, config.requestsPerHour - usage.requests),
      resetTime: new Date(usage.windowStart + (60 * 60 * 1000)), // 1 hour from window start
      tier
    };
  }

  /**
   * Get user's conversation context
   */
  async getUserContext(
    userId: string,
    domain: DomainType
  ): Promise<any> {
    await this.ensureInitialized();
    // Find active session for user in the domain
    const sessions = await contextManager.getUserSessions(userId);
    const domainSession = sessions.find(s => s.domain === domain);
    return domainSession ? contextManager.getSession(domainSession.sessionId) : null;
  }

  /**
   * Update user's conversation context
   */
  async updateUserContext(
    userId: string,
    domain: DomainType,
    message: string,
    response: string
  ): Promise<void> {
    await this.ensureInitialized();
    // Find or create session for user in the domain
    const sessions = await contextManager.getUserSessions(userId);
    let sessionId = sessions.find(s => s.domain === domain)?.sessionId;
    
    if (!sessionId) {
      sessionId = await contextManager.createSession(userId, domain, 'user');
    }
    
    await contextManager.updateContext(sessionId, {
      role: 'user',
      content: message,
      timestamp: new Date()
    });
    
    await contextManager.updateContext(sessionId, {
      role: 'assistant',
      content: response,
      timestamp: new Date()
    });
  }

  /**
   * Export analytics data
   */
  async exportAnalytics(
    format: 'json' | 'csv' = 'json',
    timeframe: 'day' | 'week' | 'month' | 'quarter' = 'month'
  ): Promise<any> {
    await this.ensureInitialized();
    const data = await analyticsService.exportData();
    return format === 'json' ? JSON.stringify(data, null, 2) : data;
  }

  /**
   * Health check for the AI ecosystem
   */
  async healthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    services: Record<string, boolean>;
    timestamp: Date;
  }> {
    const services = {
      aiService: true,
      rateLimiter: true,
      analyticsService: true,
      contextManager: true,
      domainCoordinator: true,
      corporateService: true,
      technicalService: true,
      businessService: true,
      justiceService: true
    };

    const healthyServices = Object.values(services).filter(Boolean).length;
    const totalServices = Object.keys(services).length;
    const healthRatio = healthyServices / totalServices;

    let status: 'healthy' | 'degraded' | 'unhealthy';
    if (healthRatio === 1) {
      status = 'healthy';
    } else if (healthRatio >= 0.8) {
      status = 'degraded';
    } else {
      status = 'unhealthy';
    }

    return {
      status,
      services,
      timestamp: new Date()
    };
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }
  }
}

// Export singleton instance
export const strayDogAI = new StrayDogAI();

// Export all types and interfaces
export * from '../shared/types/ai';

// Export individual services for advanced usage
export {
  domainCoordinator,
  claudeOrchestrator,
  aiService,
  rateLimiter,
  analyticsService,
  contextManager,
  corporateAIService,
  technicalAIService,
  businessAIService,
  justiceAIService
};

// Export domain services for direct access
export const domains = {
  corporate: corporateAIService,
  technical: technicalAIService,
  business: businessAIService,
  justice: justiceAIService
};

// Default export
export default strayDogAI;