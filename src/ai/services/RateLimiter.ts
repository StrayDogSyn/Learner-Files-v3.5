// Rate Limiting Service for StrayDog Syndications AI Ecosystem

import { RateLimitTier, RateLimitConfig } from '../../shared/types/ai';

interface RateLimitState {
  requests: number;
  tokens: number;
  resetTime: Date;
  lastRequest: Date;
}

interface RateLimitCheck {
  allowed: boolean;
  remaining: number;
  resetTime: string;
  tier: RateLimitTier;
}

export class RateLimiter {
  private userLimits: Map<string, RateLimitState> = new Map();
  private configs: Record<RateLimitTier, RateLimitConfig>;

  constructor() {
    this.configs = {
      free: {
        tier: 'free',
        requestsPerHour: 10,
        requestsPerDay: 50,
        burstLimit: 3,
        resetWindow: 3600000 // 1 hour in ms
      },
      corporate: {
        tier: 'corporate',
        requestsPerHour: 100,
        requestsPerDay: 1000,
        burstLimit: 20,
        resetWindow: 3600000 // 1 hour in ms
      },
      enterprise: {
        tier: 'enterprise',
        requestsPerHour: 1000,
        requestsPerDay: 10000,
        burstLimit: 100,
        resetWindow: 3600000 // 1 hour in ms
      },
      admin: {
        tier: 'admin',
        requestsPerHour: Infinity,
        requestsPerDay: Infinity,
        burstLimit: Infinity,
        resetWindow: 3600000 // 1 hour in ms
      }
    };
  }

  /**
   * Check if a user can make a request
   */
  async checkLimit(userId: string, tier: RateLimitTier): Promise<RateLimitCheck> {
    const config = this.configs[tier];
    const now = new Date();
    
    // Admin tier has unlimited access
    if (tier === 'admin') {
      return {
        allowed: true,
        remaining: Infinity,
        resetTime: new Date(now.getTime() + config.resetWindow).toISOString(),
        tier
      };
    }

    let userState = this.userLimits.get(userId);
    
    // Initialize user state if not exists
    if (!userState) {
      userState = {
        requests: 0,
        tokens: 0,
        resetTime: new Date(now.getTime() + config.resetWindow),
        lastRequest: now
      };
      this.userLimits.set(userId, userState);
    }

    // Reset counters if reset time has passed
    if (now >= userState.resetTime) {
      userState.requests = 0;
      userState.tokens = 0;
      userState.resetTime = new Date(now.getTime() + config.resetWindow);
    }

    // Check hourly limit
    const allowed = userState.requests < config.requestsPerHour;
    const remaining = Math.max(0, config.requestsPerHour - userState.requests);

    return {
      allowed,
      remaining,
      resetTime: userState.resetTime.toISOString(),
      tier
    };
  }

  /**
   * Record usage after a successful request
   */
  async recordUsage(userId: string, tokensUsed: number = 1): Promise<void> {
    const userState = this.userLimits.get(userId);
    
    if (userState) {
      userState.requests += 1;
      userState.tokens += tokensUsed;
      userState.lastRequest = new Date();
    }
  }

  /**
   * Get usage data for rate limiting calculations
   */
  getUsage(userId: string, tier: RateLimitTier): {
    requests: number;
    tokens: number;
    windowStart: number;
  } {
    const userState = this.userLimits.get(userId);
    const config = this.configs[tier];
    
    if (!userState) {
      const now = Date.now();
      return {
        requests: 0,
        tokens: 0,
        windowStart: now - config.resetWindow
      };
    }

    return {
      requests: userState.requests,
      tokens: userState.tokens,
      windowStart: userState.resetTime.getTime() - config.resetWindow
    };
  }

  /**
   * Get current usage statistics for a user
   */
  async getUserUsage(userId: string, tier: RateLimitTier): Promise<{
    requests: number;
    tokens: number;
    remaining: number;
    resetTime: string;
    tier: RateLimitTier;
  }> {
    const config = this.configs[tier];
    const userState = this.userLimits.get(userId);
    
    if (!userState) {
      return {
        requests: 0,
        tokens: 0,
        remaining: config.requestsPerHour,
        resetTime: new Date(Date.now() + config.resetWindow).toISOString(),
        tier
      };
    }

    const remaining = Math.max(0, config.requestsPerHour - userState.requests);
    
    return {
      requests: userState.requests,
      tokens: userState.tokens,
      remaining,
      resetTime: userState.resetTime.toISOString(),
      tier
    };
  }

  /**
   * Check burst limit for rapid requests
   */
  async checkBurstLimit(userId: string, tier: RateLimitTier): Promise<boolean> {
    const config = this.configs[tier];
    const userState = this.userLimits.get(userId);
    
    if (!userState || tier === 'admin') {
      return true;
    }

    const now = new Date();
    const timeSinceLastRequest = now.getTime() - userState.lastRequest.getTime();
    
    // If last request was more than 1 minute ago, allow burst
    if (timeSinceLastRequest > 60000) {
      return true;
    }

    // Check if within burst limit
    return userState.requests <= config.burstLimit;
  }

  /**
   * Get rate limit configuration for a tier
   */
  getConfig(tier: RateLimitTier): RateLimitConfig {
    return this.configs[tier];
  }

  /**
   * Update rate limit configuration (admin only)
   */
  updateConfig(tier: RateLimitTier, config: Partial<RateLimitConfig>): void {
    this.configs[tier] = { ...this.configs[tier], ...config };
  }

  /**
   * Reset user limits (admin only)
   */
  resetUserLimits(userId: string): void {
    this.userLimits.delete(userId);
  }

  /**
   * Get all active users and their usage
   */
  getAllUsage(): Array<{
    userId: string;
    requests: number;
    tokens: number;
    lastRequest: Date;
    resetTime: Date;
  }> {
    const usage: Array<{
      userId: string;
      requests: number;
      tokens: number;
      lastRequest: Date;
      resetTime: Date;
    }> = [];

    for (const [userId, state] of this.userLimits.entries()) {
      usage.push({
        userId,
        requests: state.requests,
        tokens: state.tokens,
        lastRequest: state.lastRequest,
        resetTime: state.resetTime
      });
    }

    return usage;
  }

  /**
   * Clean up expired user states
   */
  cleanup(): void {
    const now = new Date();
    
    for (const [userId, state] of this.userLimits.entries()) {
      // Remove states that are older than 24 hours
      if (now.getTime() - state.lastRequest.getTime() > 86400000) {
        this.userLimits.delete(userId);
      }
    }
  }

  /**
   * Get rate limit headers for HTTP responses
   */
  getRateLimitHeaders(userId: string, tier: RateLimitTier): Record<string, string> {
    const config = this.configs[tier];
    const userState = this.userLimits.get(userId);
    
    if (!userState) {
      return {
        'X-RateLimit-Limit': config.requestsPerHour.toString(),
        'X-RateLimit-Remaining': config.requestsPerHour.toString(),
        'X-RateLimit-Reset': new Date(Date.now() + config.resetWindow).toISOString(),
        'X-RateLimit-Tier': tier
      };
    }

    const remaining = Math.max(0, config.requestsPerHour - userState.requests);
    
    return {
      'X-RateLimit-Limit': config.requestsPerHour.toString(),
      'X-RateLimit-Remaining': remaining.toString(),
      'X-RateLimit-Reset': userState.resetTime.toISOString(),
      'X-RateLimit-Tier': tier
    };
  }
}

// Export singleton instance
export const rateLimiter = new RateLimiter();