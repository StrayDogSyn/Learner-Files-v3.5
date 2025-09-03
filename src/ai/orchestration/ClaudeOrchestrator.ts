// Claude 4.1 Orchestration Center for StrayDog Syndications AI Ecosystem

import {
  ClaudeRequest,
  ClaudeResponse,
  AIContext,
  DomainType,
  ContentType,
  RateLimitTier,
  ServiceResponse,
  AIError,
  PerformanceMetrics,
  AIAnalyticsEvent
} from '../../shared/types/ai';
import { rateLimiter } from '../services/RateLimiter';
import { contextManager } from '../services/ContextManager';
import { analyticsService } from '../services/AnalyticsService';

export class ClaudeOrchestrator {
  private rateLimiter = rateLimiter;
  private contextManager = contextManager;
  private analytics = analyticsService;
  private apiKey: string;
  private baseUrl: string = 'https://api.anthropic.com/v1/messages';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Main orchestration method for generating AI content
   */
  async generateContent(
    request: ClaudeRequest,
    userTier: RateLimitTier = 'free'
  ): Promise<ServiceResponse<ClaudeResponse>> {
    const startTime = Date.now();
    const requestId = this.generateRequestId();

    try {
      // Check rate limits
      const rateLimitCheck = await this.rateLimiter.checkLimit(
        request.userId || 'anonymous',
        userTier
      );

      if (!rateLimitCheck.allowed) {
        return this.createErrorResponse(
          'RATE_LIMIT_EXCEEDED',
          `Rate limit exceeded. Reset time: ${rateLimitCheck.resetTime}`,
          requestId,
          startTime
        );
      }

      // Get or create context
      const sessionId = request.sessionId || this.generateSessionId();
      let context = await this.contextManager.getContext(sessionId);
      
      // Create context if it doesn't exist
      if (!context) {
        const newSessionId = await this.contextManager.createSession(request.userId || 'anonymous', request.domain, 'user');
        context = await this.contextManager.getContext(newSessionId);
      }

      // Generate domain-specific prompt
      const prompt = this.buildPrompt(request, context!);

      // Call Claude API
      const claudeResponse = await this.callClaudeAPI(prompt, request.domain);

      // Update context with new interaction
      await this.contextManager.updateContext(sessionId, {
        type: 'assistant',
        content: claudeResponse.content,
        timestamp: new Date(),
        metadata: { requestType: request.type }
      });

      // Record analytics
      await this.analytics.trackEvent({
        eventId: requestId,
        timestamp: new Date(),
        contentType: request.type,
        domain: request.domain,
        userId: request.userId || 'anonymous',
        userRole: 'user',
        success: true,
        tokensUsed: claudeResponse.metadata?.tokensUsed || 0
      });

      // Update rate limiter
      await this.rateLimiter.recordUsage(
        request.userId || 'anonymous',
        claudeResponse.metadata.tokensUsed
      );

      return {
        success: true,
        data: {
          ...claudeResponse,
          usage: {
            ...claudeResponse.usage,
            remaining: rateLimitCheck.remaining - 1,
            resetTime: rateLimitCheck.resetTime,
            tier: userTier
          }
        },
        metadata: {
          requestId,
          timestamp: new Date(),
          processingTime: Date.now() - startTime
        }
      };

    } catch (error) {
      const aiError: AIError = {
        code: 'ORCHESTRATION_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error',
        domain: request.domain,
        timestamp: new Date(),
        context: { request }
      };

      await this.analytics.trackEvent({
        eventId: requestId,
        timestamp: new Date(),
        contentType: request.type,
        domain: request.domain,
        userId: request.userId || 'anonymous',
        userRole: 'user',
        success: false,
        error: aiError.message
      });

      return this.createErrorResponse(
        aiError.code,
        aiError.message,
        requestId,
        startTime
      );
    }
  }

  /**
   * Build domain-specific prompts
   */
  private buildPrompt(request: ClaudeRequest, context: AIContext): string {
    const basePrompt = this.getBasePrompt(request.domain);
    const contextPrompt = this.buildContextPrompt(context);
    const taskPrompt = this.buildTaskPrompt(request.type, request.context);

    return `${basePrompt}\n\n${contextPrompt}\n\n${taskPrompt}`;
  }

  /**
   * Get domain-specific base prompts
   */
  private getBasePrompt(domain: DomainType): string {
    const prompts = {
      corporate: `You are an AI assistant for StrayDog Syndications, a premier technology consulting firm specializing in justice reform solutions. You help create compelling corporate content that showcases our 20+ years of customer excellence and technical innovation. Focus on professional, results-driven communication that highlights our glassmorphic design expertise and AI integration capabilities.`,
      
      technical: `You are a technical AI assistant for StrayDog Syndications' development showcase. You help generate code examples, technical documentation, and development insights that demonstrate our 10x development practices. Focus on clean, efficient code with modern frameworks, TypeScript, and cutting-edge AI integration patterns.`,
      
      business: `You are a business intelligence AI for StrayDog Syndications. You help analyze ROI, generate quotes, and provide strategic insights for potential clients. Focus on data-driven recommendations, cost-benefit analysis, and competitive positioning that showcases our value proposition in justice reform technology.`,
      
      justice: `You are an impact analysis AI for StrayDog Syndications' justice reform initiatives. You help track outcomes, analyze metrics, and generate reports that demonstrate real-world impact in criminal justice reform. Focus on evidence-based insights, stakeholder communication, and measurable social outcomes.`
    };

    return prompts[domain];
  }

  /**
   * Build context-aware prompts
   */
  private buildContextPrompt(context: AIContext): string {
    const recentHistory = context.conversationHistory
      .slice(-5)
      .map(entry => `${entry.type}: ${entry.content}`)
      .join('\n');

    return `Context: Domain: ${context.domain}\nRecent conversation:\n${recentHistory}`;
  }

  /**
   * Build task-specific prompts
   */
  private buildTaskPrompt(type: ContentType, context: Record<string, any>): string {
    const taskPrompts = {
      'case-study': `Generate a compelling case study based on the following context: ${JSON.stringify(context)}. Include problem statement, solution approach, implementation details, and measurable outcomes.`,
      
      'code': `Generate clean, production-ready code based on these requirements: ${JSON.stringify(context)}. Include proper TypeScript types, error handling, and documentation.`,
      
      'analysis': `Provide a comprehensive analysis of: ${JSON.stringify(context)}. Include key insights, trends, recommendations, and actionable next steps.`,
      
      'roi': `Calculate and explain the ROI for: ${JSON.stringify(context)}. Include cost breakdown, benefit analysis, timeline projections, and risk assessment.`,
      
      'metrics': `Analyze the performance metrics and impact data: ${JSON.stringify(context)}. Provide insights, trends, and recommendations for improvement.`
    };

    return taskPrompts[type];
  }

  /**
   * Call Claude API with proper error handling
   */
  private async callClaudeAPI(prompt: string, domain: DomainType): Promise<ClaudeResponse> {
    const startTime = Date.now();

    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4000,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const processingTime = Date.now() - startTime;

    return {
      content: data.content[0].text,
      metadata: {
        tokensUsed: data.usage.input_tokens + data.usage.output_tokens,
        processingTime,
        confidence: 0.95, // Default confidence
        model: 'claude-3-5-sonnet-20241022'
      },
      usage: {
        remaining: 0, // Will be updated by orchestrator
        resetTime: '', // Will be updated by orchestrator
        tier: 'free' // Will be updated by orchestrator
      }
    };
  }

  /**
   * Get real-time performance metrics
   */
  async getPerformanceMetrics(): Promise<any> {
    return await this.analytics.getSystemMetrics();
  }

  /**
   * Get analytics events for a specific domain
   */
  async getDomainAnalytics(domain: DomainType, timeframe: string = '24h'): Promise<AIAnalyticsEvent[]> {
    return await this.analytics.getEventsByDomain(domain, 100);
  }

  /**
   * Utility methods
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateSessionId(): string {
    return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private createErrorResponse(
    code: string,
    message: string,
    requestId: string,
    startTime: number
  ): ServiceResponse<ClaudeResponse> {
    return {
      success: false,
      error: {
        code,
        message,
        timestamp: new Date()
      },
      metadata: {
        requestId,
        timestamp: new Date(),
        processingTime: Date.now() - startTime
      }
    };
  }
}

// Export singleton instance
export const claudeOrchestrator = new ClaudeOrchestrator(
  process.env.ANTHROPIC_API_KEY || 'your-api-key-here'
);