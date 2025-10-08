// Context Management Service for StrayDog Syndications AI Ecosystem

import { 
  AIContext, 
  ConversationEntry, 
  SessionMetadata, 
  DomainType, 
  ContentType, 
  UserRole 
} from '../../shared/types/ai';

interface ContextSession {
  sessionId: string;
  userId: string;
  domain: DomainType;
  metadata: SessionMetadata;
  context: AIContext;
  conversation: ConversationEntry[];
  createdAt: Date;
  lastActivity: Date;
  isActive: boolean;
}

interface DomainContext {
  domain: DomainType;
  systemPrompt: string;
  contextRules: string[];
  maxTokens: number;
  temperature: number;
  specialInstructions: string[];
}

export class ContextManager {
  private sessions: Map<string, ContextSession> = new Map();
  private userSessions: Map<string, Set<string>> = new Map(); // userId -> sessionIds
  private domainContexts: Map<DomainType, DomainContext> = new Map();
  private maxSessionsPerUser: number = 10;
  private maxConversationLength: number = 50;
  private sessionTimeout: number = 3600000; // 1 hour

  constructor() {
    this.initializeDomainContexts();
    
    // Start cleanup interval
    setInterval(() => this.cleanupExpiredSessions(), 300000); // Every 5 minutes
  }

  /**
   * Create a new context session
   */
  async createSession(
    userId: string, 
    domain: DomainType, 
    userRole: UserRole,
    initialContext?: Partial<AIContext>
  ): Promise<string> {
    const sessionId = this.generateSessionId();
    const now = new Date();
    
    const domainContext = this.domainContexts.get(domain);
    if (!domainContext) {
      throw new Error(`Domain context not found for: ${domain}`);
    }

    const context: AIContext = {
      sessionId,
      userId,
      domain,
      userRole,
      conversationHistory: [],
      systemPrompt: domainContext.systemPrompt,
      contextWindow: [],
      metadata: {
        sessionId,
        userId,
        domain,
        userRole,
        createdAt: now,
        lastActivity: now,
        requestCount: 0,
        totalTokens: 0
      },
      preferences: {
        temperature: domainContext.temperature,
        maxTokens: domainContext.maxTokens,
        responseFormat: 'text'
      },
      ...initialContext
    };

    const sessionMetadata: SessionMetadata = {
      sessionId,
      userId,
      domain,
      startTime: now,
      lastActivity: now,
      totalTokens: 0
    };

    const session: ContextSession = {
      sessionId,
      userId,
      domain,
      metadata: sessionMetadata,
      context,
      conversation: [],
      createdAt: now,
      lastActivity: now,
      isActive: true
    };

    // Store session
    this.sessions.set(sessionId, session);
    
    // Track user sessions
    if (!this.userSessions.has(userId)) {
      this.userSessions.set(userId, new Set());
    }
    this.userSessions.get(userId)!.add(sessionId);
    
    // Enforce session limits
    await this.enforceSessionLimits(userId);
    
    return sessionId;
  }

  /**
   * Get context for a session
   */
  async getContext(sessionId: string): Promise<AIContext | null> {
    const session = this.sessions.get(sessionId);
    if (!session || !session.isActive) {
      return null;
    }
    
    // Update last activity
    session.lastActivity = new Date();
    if (session.context.metadata) {
      session.context.metadata.lastActivity = session.lastActivity;
    }
    
    return { ...session.context }; // Return a copy
  }

  /**
   * Update context with new conversation entry
   */
  async updateContext(
    sessionId: string, 
    entry: ConversationEntry,
    tokensUsed?: number
  ): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session || !session.isActive) {
      throw new Error(`Session not found or inactive: ${sessionId}`);
    }

    const now = new Date();
    
    // Add to conversation history
    session.conversation.push(entry);
    session.context.conversationHistory.push(entry);
    
    // Limit conversation length
    if (session.conversation.length > this.maxConversationLength) {
      session.conversation = session.conversation.slice(-this.maxConversationLength);
      session.context.conversationHistory = session.context.conversationHistory.slice(-this.maxConversationLength);
    }
    
    // Update context window (last 10 entries for immediate context)
    session.context.contextWindow = session.conversation.slice(-10);
    
    // Update metadata
    session.lastActivity = now;
    if (session.context.metadata) {
      session.context.metadata.lastActivity = now;
      if (session.context.metadata.requestCount !== undefined) {
        session.context.metadata.requestCount++;
      }
      
      if (tokensUsed && session.context.metadata.totalTokens !== undefined) {
        session.context.metadata.totalTokens += tokensUsed;
      }
    }
  }

  /**
   * Switch domain context for a session
   */
  async switchDomain(
    sessionId: string, 
    newDomain: DomainType,
    preserveHistory: boolean = true
  ): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session || !session.isActive) {
      throw new Error(`Session not found or inactive: ${sessionId}`);
    }

    const domainContext = this.domainContexts.get(newDomain);
    if (!domainContext) {
      throw new Error(`Domain context not found for: ${newDomain}`);
    }

    // Update domain
    session.domain = newDomain;
    session.context.domain = newDomain;
    if (session.context.metadata) {
      session.context.metadata.domain = newDomain;
    }
    
    // Update system prompt and preferences
    session.context.systemPrompt = domainContext.systemPrompt;
    if (session.context.preferences) {
      session.context.preferences.temperature = domainContext.temperature;
      session.context.preferences.maxTokens = domainContext.maxTokens;
    }
    
    // Optionally clear history for clean domain switch
    if (!preserveHistory) {
      session.conversation = [];
      session.context.conversationHistory = [];
      session.context.contextWindow = [];
    } else {
      // Add domain switch marker
      const switchEntry: ConversationEntry = {
        role: 'system',
        content: `Domain switched to: ${newDomain}`,
        timestamp: new Date(),
        metadata: {
          type: 'domain_switch',
          previousDomain: session.domain,
          newDomain
        }
      };
      
      session.conversation.push(switchEntry);
      session.context.conversationHistory.push(switchEntry);
    }
    
    session.lastActivity = new Date();
    if (session.context.metadata) {
      session.context.metadata.lastActivity = session.lastActivity;
    }
  }

  /**
   * Get session metadata
   */
  async getSessionMetadata(sessionId: string): Promise<SessionMetadata | null> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return null;
    }
    
    return { ...session.metadata }; // Return a copy
  }

  /**
   * Get all sessions for a user
   */
  async getUserSessions(userId: string): Promise<SessionMetadata[]> {
    const sessionIds = this.userSessions.get(userId) || new Set();
    const sessions: SessionMetadata[] = [];
    
    for (const sessionId of sessionIds) {
      const session = this.sessions.get(sessionId);
      if (session) {
        sessions.push({ ...session.metadata });
      }
    }
    
    return sessions.sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime());
  }

  /**
   * Get conversation history for a session
   */
  async getConversationHistory(sessionId: string): Promise<ConversationEntry[]> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return [];
    }
    
    return session.conversation.map(entry => ({ ...entry })); // Return copies
  }

  /**
   * Close a session
   */
  async closeSession(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return;
    }
    
    session.isActive = false;
    
    // Remove from user sessions
    const userSessionIds = this.userSessions.get(session.userId);
    if (userSessionIds) {
      userSessionIds.delete(sessionId);
    }
    
    // Remove session after a delay to allow for final operations
    setTimeout(() => {
      this.sessions.delete(sessionId);
    }, 60000); // 1 minute delay
  }

  /**
   * Get domain-specific system prompt
   */
  getDomainPrompt(domain: DomainType): string {
    const domainContext = this.domainContexts.get(domain);
    return domainContext?.systemPrompt || '';
  }

  /**
   * Update domain context configuration
   */
  updateDomainContext(domain: DomainType, updates: Partial<DomainContext>): void {
    const existing = this.domainContexts.get(domain);
    if (existing) {
      this.domainContexts.set(domain, { ...existing, ...updates });
    }
  }

  /**
   * Get active session count
   */
  getActiveSessionCount(): number {
    return Array.from(this.sessions.values())
      .filter(session => session.isActive).length;
  }

  /**
   * Get session data
   */
  getSession(sessionId: string): ContextSession | null {
    const session = this.sessions.get(sessionId);
    if (!session || !session.isActive) {
      return null;
    }
    
    // Update last activity
    session.lastActivity = new Date();
    
    return { ...session }; // Return a copy
  }

  /**
   * Update session data
   */
  updateSession(sessionId: string, updates: Partial<ContextSession>): void {
    const session = this.sessions.get(sessionId);
    if (!session || !session.isActive) {
      throw new Error(`Session not found or inactive: ${sessionId}`);
    }
    
    // Apply updates
    Object.assign(session, updates);
    session.lastActivity = new Date();
    
    // Update metadata if context was updated
    if (updates.context && session.context.metadata) {
      session.context.metadata.lastActivity = session.lastActivity;
    }
  }

  /**
   * Get session statistics
   */
  getSessionStats(): {
    totalSessions: number;
    activeSessions: number;
    totalUsers: number;
    averageSessionDuration: number;
    domainDistribution: Map<DomainType, number>;
  } {
    const sessions = Array.from(this.sessions.values());
    const activeSessions = sessions.filter(s => s.isActive);
    
    const totalDuration = sessions.reduce((sum, session) => {
      return sum + (session.lastActivity.getTime() - session.createdAt.getTime());
    }, 0);
    
    const averageSessionDuration = sessions.length > 0 ? totalDuration / sessions.length : 0;
    
    const domainDistribution = new Map<DomainType, number>();
    sessions.forEach(session => {
      const count = domainDistribution.get(session.domain) || 0;
      domainDistribution.set(session.domain, count + 1);
    });
    
    return {
      totalSessions: sessions.length,
      activeSessions: activeSessions.length,
      totalUsers: this.userSessions.size,
      averageSessionDuration,
      domainDistribution
    };
  }

  // Private helper methods
  private initializeDomainContexts(): void {
    this.domainContexts.set('corporate', {
      domain: 'corporate',
      systemPrompt: `You are an AI assistant for StrayDog Syndications' corporate communications. 
Focus on professional, strategic, and leadership-oriented content. 
Maintain a confident, authoritative tone while being approachable. 
Emphasize innovation, growth, and corporate values.`,
      contextRules: [
        'Maintain professional corporate tone',
        'Focus on strategic business outcomes',
        'Emphasize leadership and innovation',
        'Use industry-standard terminology'
      ],
      maxTokens: 2000,
      temperature: 0.7,
      specialInstructions: [
        'Include relevant business metrics when applicable',
        'Reference corporate mission and values',
        'Maintain brand consistency'
      ]
    });

    this.domainContexts.set('technical', {
      domain: 'technical',
      systemPrompt: `You are an AI assistant for StrayDog Syndications' technical showcase. 
Focus on code quality, technical innovation, and development best practices. 
Provide detailed, accurate technical information with practical examples. 
Emphasize cutting-edge technologies and methodologies.`,
      contextRules: [
        'Provide accurate technical information',
        'Include code examples when relevant',
        'Focus on best practices and standards',
        'Explain complex concepts clearly'
      ],
      maxTokens: 3000,
      temperature: 0.3,
      specialInstructions: [
        'Include relevant code snippets',
        'Reference technical documentation',
        'Provide implementation details'
      ]
    });

    this.domainContexts.set('business', {
      domain: 'business',
      systemPrompt: `You are an AI assistant for StrayDog Syndications' business services platform. 
Focus on client solutions, service offerings, and business value propositions. 
Maintain a consultative, solution-oriented approach. 
Emphasize ROI, efficiency, and business transformation.`,
      contextRules: [
        'Focus on business solutions and outcomes',
        'Emphasize value propositions and ROI',
        'Maintain consultative tone',
        'Address client pain points directly'
      ],
      maxTokens: 2500,
      temperature: 0.6,
      specialInstructions: [
        'Include relevant case studies',
        'Provide actionable recommendations',
        'Reference service capabilities'
      ]
    });

    this.domainContexts.set('justice', {
      domain: 'justice',
      systemPrompt: `You are an AI assistant for StrayDog Syndications' justice reform platform. 
Focus on legal advocacy, reform initiatives, and social justice issues. 
Maintain a compassionate, informed, and action-oriented tone. 
Emphasize fairness, transparency, and systemic change.`,
      contextRules: [
        'Maintain sensitivity to justice issues',
        'Provide accurate legal information',
        'Focus on reform and advocacy',
        'Emphasize human rights and fairness'
      ],
      maxTokens: 2500,
      temperature: 0.5,
      specialInstructions: [
        'Reference relevant legal precedents',
        'Include advocacy resources',
        'Provide actionable reform steps'
      ]
    });
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async enforceSessionLimits(userId: string): Promise<void> {
    const userSessionIds = this.userSessions.get(userId);
    if (!userSessionIds || userSessionIds.size <= this.maxSessionsPerUser) {
      return;
    }

    // Get sessions sorted by last activity (oldest first)
    const sessions = Array.from(userSessionIds)
      .map(id => this.sessions.get(id))
      .filter((session): session is ContextSession => session !== undefined)
      .sort((a, b) => a.lastActivity.getTime() - b.lastActivity.getTime());

    // Close oldest sessions
    const sessionsToClose = sessions.slice(0, sessions.length - this.maxSessionsPerUser);
    for (const session of sessionsToClose) {
      if (session) {
        await this.closeSession(session.sessionId);
      }
    }
  }

  private cleanupExpiredSessions(): void {
    const now = new Date();
    const expiredSessions: string[] = [];

    for (const [sessionId, session] of this.sessions.entries()) {
      const timeSinceLastActivity = now.getTime() - session.lastActivity.getTime();
      
      if (timeSinceLastActivity > this.sessionTimeout) {
        expiredSessions.push(sessionId);
      }
    }

    // Close expired sessions
    expiredSessions.forEach(sessionId => {
      this.closeSession(sessionId);
    });
  }
}

// Export singleton instance
export const contextManager = new ContextManager();