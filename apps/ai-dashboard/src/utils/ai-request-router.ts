import { DomainType, AIRequest, createAIRequest } from '@straydog/ai-orchestrator';
import { AIRequestContext } from '@/types/routing';
import { getDomainByPath, getRouteConfig } from './domain-routes';

export class AIRequestRouter {
  private static instance: AIRequestRouter;
  private sessionId: string;

  private constructor() {
    this.sessionId = this.generateSessionId();
  }

  public static getInstance(): AIRequestRouter {
    if (!AIRequestRouter.instance) {
      AIRequestRouter.instance = new AIRequestRouter();
    }
    return AIRequestRouter.instance;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Creates an AI request with proper domain context and routing information
   */
  public createDomainAwareRequest(
    message: string,
    currentPath: string,
    userContext?: Record<string, any>
  ): AIRequest {
    const domain = this.determineDomain(currentPath);
    const routeConfig = getRouteConfig(currentPath);
    
    const context: AIRequestContext = {
      domain,
      route: currentPath,
      userContext,
      sessionId: this.sessionId
    };

    // Enhance the message with domain-specific context
    const enhancedMessage = this.enhanceMessageWithContext(message, context, routeConfig);

    return createAIRequest(domain, enhancedMessage, {
      context: {
        ...context,
        routeMetadata: routeConfig,
        timestamp: Date.now()
      }
    });
  }

  /**
   * Determines the appropriate domain based on the current path
   */
  private determineDomain(path: string): DomainType {
    const domain = getDomainByPath(path);
    
    // Default to corporate if no specific domain is found
    return domain || 'corporate';
  }

  /**
   * Enhances the user message with domain-specific context
   */
  private enhanceMessageWithContext(
    message: string,
    context: AIRequestContext,
    routeConfig: any
  ): string {
    const contextualPrefixes = {
      corporate: 'As a business professional in the justice reform sector',
      technical: 'As a developer working on justice reform technology',
      educational: 'As someone seeking career transition guidance',
      'justice-reform': 'As an advocate for justice reform'
    };

    const prefix = contextualPrefixes[context.domain];
    const routeContext = routeConfig ? ` working on ${routeConfig.title.toLowerCase()}` : '';
    
    return `${prefix}${routeContext}, ${message}`;
  }

  /**
   * Routes AI requests to appropriate handlers based on domain complexity
   */
  public async routeRequest(request: AIRequest): Promise<{
    shouldUseAdvancedModel: boolean;
    priority: 'high' | 'medium' | 'low';
    estimatedTokens: number;
  }> {
    const complexity = this.analyzeRequestComplexity(request);
    const domainPriority = this.getDomainPriority(request.domain);
    
    return {
      shouldUseAdvancedModel: complexity > 0.7 || domainPriority === 'high',
      priority: domainPriority,
      estimatedTokens: this.estimateTokenUsage(request)
    };
  }

  /**
   * Analyzes the complexity of an AI request
   */
  private analyzeRequestComplexity(request: AIRequest): number {
    const message = request.prompt.toLowerCase();
    
    // Keywords that indicate high complexity
    const complexKeywords = [
      'analyze', 'strategy', 'architecture', 'design', 'optimize',
      'implement', 'integrate', 'performance', 'security', 'scale'
    ];
    
    // Keywords that indicate medium complexity
    const mediumKeywords = [
      'explain', 'help', 'guide', 'tutorial', 'example',
      'compare', 'recommend', 'suggest'
    ];
    
    let complexity = 0.3; // Base complexity
    
    // Increase complexity based on keywords
    complexKeywords.forEach(keyword => {
      if (message.includes(keyword)) complexity += 0.15;
    });
    
    mediumKeywords.forEach(keyword => {
      if (message.includes(keyword)) complexity += 0.1;
    });
    
    // Increase complexity based on message length
    if (request.prompt.length > 200) complexity += 0.1;
    if (request.prompt.length > 500) complexity += 0.2;
    
    return Math.min(complexity, 1.0);
  }

  /**
   * Determines priority based on domain type
   */
  private getDomainPriority(domain: DomainType): 'high' | 'medium' | 'low' {
    const priorityMap: Record<DomainType, 'high' | 'medium' | 'low'> = {
      'justice-reform': 'high',    // Highest priority for social impact
      'corporate': 'high',        // High priority for business needs
      'technical': 'medium',      // Medium priority for development
      'educational': 'medium'     // Medium priority for learning
    };
    
    return priorityMap[domain];
  }

  /**
   * Estimates token usage for cost optimization
   */
  private estimateTokenUsage(request: AIRequest): number {
    // Rough estimation: 1 token ≈ 4 characters
    const messageTokens = Math.ceil(request.prompt.length / 4);
    const contextTokens = request.context ? Math.ceil(JSON.stringify(request.context).length / 4) : 0;
    
    // Add estimated response tokens based on domain
    const responseMultipliers = {
      'corporate': 1.5,      // Business responses tend to be detailed
      'technical': 2.0,      // Technical responses can be lengthy
      'educational': 1.8,    // Educational content is comprehensive
      'justice-reform': 1.6  // Advocacy content is thorough
    };
    
    const estimatedResponseTokens = messageTokens * responseMultipliers[request.domain];
    
    return messageTokens + contextTokens + estimatedResponseTokens;
  }

  /**
   * Gets the current session ID
   */
  public getSessionId(): string {
    return this.sessionId;
  }

  /**
   * Resets the session (useful for new user sessions)
   */
  public resetSession(): void {
    this.sessionId = this.generateSessionId();
  }
}