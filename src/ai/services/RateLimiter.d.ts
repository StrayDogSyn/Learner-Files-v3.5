import { RateLimitTier, RateLimitConfig } from '../../shared/types/ai';
interface RateLimitCheck {
    allowed: boolean;
    remaining: number;
    resetTime: string;
    tier: RateLimitTier;
}
export declare class RateLimiter {
    private userLimits;
    private configs;
    constructor();
    /**
     * Check if a user can make a request
     */
    checkLimit(userId: string, tier: RateLimitTier): Promise<RateLimitCheck>;
    /**
     * Record usage after a successful request
     */
    recordUsage(userId: string, tokensUsed?: number): Promise<void>;
    /**
     * Get usage data for rate limiting calculations
     */
    getUsage(userId: string, tier: RateLimitTier): {
        requests: number;
        tokens: number;
        windowStart: number;
    };
    /**
     * Get current usage statistics for a user
     */
    getUserUsage(userId: string, tier: RateLimitTier): Promise<{
        requests: number;
        tokens: number;
        remaining: number;
        resetTime: string;
        tier: RateLimitTier;
    }>;
    /**
     * Check burst limit for rapid requests
     */
    checkBurstLimit(userId: string, tier: RateLimitTier): Promise<boolean>;
    /**
     * Get rate limit configuration for a tier
     */
    getConfig(tier: RateLimitTier): RateLimitConfig;
    /**
     * Update rate limit configuration (admin only)
     */
    updateConfig(tier: RateLimitTier, config: Partial<RateLimitConfig>): void;
    /**
     * Reset user limits (admin only)
     */
    resetUserLimits(userId: string): void;
    /**
     * Get all active users and their usage
     */
    getAllUsage(): Array<{
        userId: string;
        requests: number;
        tokens: number;
        lastRequest: Date;
        resetTime: Date;
    }>;
    /**
     * Clean up expired user states
     */
    cleanup(): void;
    /**
     * Get rate limit headers for HTTP responses
     */
    getRateLimitHeaders(userId: string, tier: RateLimitTier): Record<string, string>;
}
export declare const rateLimiter: RateLimiter;
export {};
//# sourceMappingURL=RateLimiter.d.ts.map