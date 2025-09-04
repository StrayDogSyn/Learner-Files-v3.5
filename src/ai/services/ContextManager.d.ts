import { AIContext, ConversationEntry, SessionMetadata, DomainType, UserRole } from '../../shared/types/ai';
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
export declare class ContextManager {
    private sessions;
    private userSessions;
    private domainContexts;
    private maxSessionsPerUser;
    private maxConversationLength;
    private sessionTimeout;
    constructor();
    /**
     * Create a new context session
     */
    createSession(userId: string, domain: DomainType, userRole: UserRole, initialContext?: Partial<AIContext>): Promise<string>;
    /**
     * Get context for a session
     */
    getContext(sessionId: string): Promise<AIContext | null>;
    /**
     * Update context with new conversation entry
     */
    updateContext(sessionId: string, entry: ConversationEntry, tokensUsed?: number): Promise<void>;
    /**
     * Switch domain context for a session
     */
    switchDomain(sessionId: string, newDomain: DomainType, preserveHistory?: boolean): Promise<void>;
    /**
     * Get session metadata
     */
    getSessionMetadata(sessionId: string): Promise<SessionMetadata | null>;
    /**
     * Get all sessions for a user
     */
    getUserSessions(userId: string): Promise<SessionMetadata[]>;
    /**
     * Get conversation history for a session
     */
    getConversationHistory(sessionId: string): Promise<ConversationEntry[]>;
    /**
     * Close a session
     */
    closeSession(sessionId: string): Promise<void>;
    /**
     * Get domain-specific system prompt
     */
    getDomainPrompt(domain: DomainType): string;
    /**
     * Update domain context configuration
     */
    updateDomainContext(domain: DomainType, updates: Partial<DomainContext>): void;
    /**
     * Get active session count
     */
    getActiveSessionCount(): number;
    /**
     * Get session data
     */
    getSession(sessionId: string): ContextSession | null;
    /**
     * Update session data
     */
    updateSession(sessionId: string, updates: Partial<ContextSession>): void;
    /**
     * Get session statistics
     */
    getSessionStats(): {
        totalSessions: number;
        activeSessions: number;
        totalUsers: number;
        averageSessionDuration: number;
        domainDistribution: Map<DomainType, number>;
    };
    private initializeDomainContexts;
    private generateSessionId;
    private enforceSessionLimits;
    private cleanupExpiredSessions;
}
export declare const contextManager: ContextManager;
export {};
//# sourceMappingURL=ContextManager.d.ts.map