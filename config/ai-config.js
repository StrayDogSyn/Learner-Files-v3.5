/**
 * AI Configuration for StrayDog Syndications Portfolio
 * Centralized configuration management for AI services and features
 */

class AIConfig {
    constructor(environment = 'development') {
        this.environment = environment;
        this.config = this.loadConfig();
        this.validateConfig();
    }

    /**
     * Load configuration based on environment
     */
    loadConfig() {
        const baseConfig = {
            // Claude AI Configuration
            claude: {
                apiKey: process.env.ANTHROPIC_API_KEY || '',
                baseURL: 'https://api.anthropic.com/v1',
                model: 'claude-3-sonnet-20240229',
                maxTokens: 1000,
                temperature: 0.7,
                timeout: 30000, // 30 seconds
                retryAttempts: 3,
                retryDelay: 1000 // 1 second
            },

            // Content Generation Settings
            contentGeneration: {
                cacheEnabled: true,
                cacheTTL: 300000, // 5 minutes
                maxCacheSize: 100,
                fallbackEnabled: true,
                contextWindow: 2000,
                qualityThreshold: 0.8
            },

            // Analytics Configuration
            analytics: {
                enabled: true,
                trackingId: 'straydog-portfolio',
                batchSize: 10,
                flushInterval: 30000, // 30 seconds
                enableRealTime: true,
                enablePerformanceTracking: true,
                enableErrorTracking: true,
                enableUserTracking: true,
                sessionTimeout: 1800000, // 30 minutes
                maxEventQueueSize: 1000
            },

            // API Proxy Configuration
            proxy: {
                port: 3001,
                corsOrigin: 'http://localhost:3000',
                rateLimit: {
                    windowMs: 900000, // 15 minutes
                    max: 100 // requests per window
                },
                security: {
                    helmet: true,
                    validateInput: true,
                    sanitizeOutput: true
                },
                logging: {
                    enabled: true,
                    level: 'info',
                    includeBody: false
                }
            },

            // Feature Flags
            features: {
                aiContentGeneration: true,
                realTimeAnalytics: true,
                performanceMonitoring: true,
                errorTracking: true,
                userPersonalization: false,
                advancedInsights: true,
                experimentalFeatures: false
            },

            // Portfolio Specific Settings
            portfolio: {
                sections: {
                    hero: {
                        aiGenerated: true,
                        refreshInterval: 3600000, // 1 hour
                        personalization: false
                    },
                    projects: {
                        aiInsights: true,
                        autoDescription: true,
                        performanceTracking: true
                    },
                    testimonials: {
                        aiGenerated: false,
                        validation: true
                    },
                    consulting: {
                        aiInsights: true,
                        clientPersonalization: true
                    }
                },
                themes: {
                    default: 'justice-reform',
                    allowCustomization: true,
                    aiColorSuggestions: false
                }
            },

            // Performance Settings
            performance: {
                lazyLoading: true,
                imageOptimization: true,
                codesplitting: true,
                prefetching: true,
                serviceWorker: true,
                caching: {
                    strategy: 'stale-while-revalidate',
                    maxAge: 86400000, // 24 hours
                    maxEntries: 100
                }
            },

            // Security Settings
            security: {
                apiKeyEncryption: true,
                inputSanitization: true,
                outputValidation: true,
                rateLimiting: true,
                corsValidation: true,
                contentSecurityPolicy: true
            }
        };

        // Environment-specific overrides
        const environmentConfigs = {
            development: {
                claude: {
                    timeout: 60000, // Longer timeout for dev
                    retryAttempts: 1
                },
                analytics: {
                    flushInterval: 10000, // More frequent flushing
                    enableRealTime: true
                },
                proxy: {
                    corsOrigin: ['http://localhost:3000', 'http://localhost:3001'],
                    logging: {
                        level: 'debug',
                        includeBody: true
                    }
                },
                features: {
                    experimentalFeatures: true
                }
            },

            production: {
                claude: {
                    timeout: 20000,
                    retryAttempts: 3
                },
                analytics: {
                    flushInterval: 60000, // Less frequent in prod
                    enableRealTime: false
                },
                proxy: {
                    logging: {
                        level: 'warn',
                        includeBody: false
                    }
                },
                features: {
                    experimentalFeatures: false
                },
                security: {
                    apiKeyEncryption: true,
                    contentSecurityPolicy: true
                }
            },

            testing: {
                claude: {
                    apiKey: 'test-key',
                    timeout: 5000
                },
                analytics: {
                    enabled: false
                },
                features: {
                    aiContentGeneration: false,
                    realTimeAnalytics: false
                }
            }
        };

        // Merge base config with environment-specific config
        const envConfig = environmentConfigs[this.environment] || {};
        return this.deepMerge(baseConfig, envConfig);
    }

    /**
     * Validate configuration
     */
    validateConfig() {
        const errors = [];

        // Validate Claude configuration
        if (this.config.features.aiContentGeneration) {
            if (!this.config.claude.apiKey && this.environment !== 'testing') {
                errors.push('Claude API key is required when AI content generation is enabled');
            }
            if (this.config.claude.maxTokens < 1 || this.config.claude.maxTokens > 4000) {
                errors.push('Claude maxTokens must be between 1 and 4000');
            }
        }

        // Validate analytics configuration
        if (this.config.analytics.enabled) {
            if (!this.config.analytics.trackingId) {
                errors.push('Analytics tracking ID is required when analytics is enabled');
            }
            if (this.config.analytics.batchSize < 1 || this.config.analytics.batchSize > 100) {
                errors.push('Analytics batch size must be between 1 and 100');
            }
        }

        // Validate proxy configuration
        if (this.config.proxy.port < 1000 || this.config.proxy.port > 65535) {
            errors.push('Proxy port must be between 1000 and 65535');
        }

        if (errors.length > 0) {
            throw new Error(`Configuration validation failed:\n${errors.join('\n')}`);
        }
    }

    /**
     * Get configuration for a specific service
     */
    getClaudeConfig() {
        return { ...this.config.claude };
    }

    getAnalyticsConfig() {
        return { ...this.config.analytics };
    }

    getProxyConfig() {
        return { ...this.config.proxy };
    }

    getFeatureFlags() {
        return { ...this.config.features };
    }

    getPortfolioConfig() {
        return { ...this.config.portfolio };
    }

    getPerformanceConfig() {
        return { ...this.config.performance };
    }

    getSecurityConfig() {
        return { ...this.config.security };
    }

    /**
     * Check if a feature is enabled
     */
    isFeatureEnabled(featureName) {
        return this.config.features[featureName] === true;
    }

    /**
     * Get content generation settings for a specific section
     */
    getContentSettings(section) {
        const sectionConfig = this.config.portfolio.sections[section];
        if (!sectionConfig) {
            return null;
        }

        return {
            ...this.config.contentGeneration,
            ...sectionConfig
        };
    }

    /**
     * Update configuration at runtime
     */
    updateConfig(path, value) {
        const keys = path.split('.');
        let current = this.config;
        
        for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) {
                current[keys[i]] = {};
            }
            current = current[keys[i]];
        }
        
        current[keys[keys.length - 1]] = value;
        
        // Re-validate after update
        this.validateConfig();
    }

    /**
     * Get environment-specific API endpoints
     */
    getAPIEndpoints() {
        const baseURL = this.environment === 'production' 
            ? 'https://api.straydogsyndications.com'
            : `http://localhost:${this.config.proxy.port}`;

        return {
            claude: `${baseURL}/api/generate`,
            projectInsights: `${baseURL}/api/project-insights`,
            portfolioContent: `${baseURL}/api/portfolio-content`,
            consultingInsights: `${baseURL}/api/consulting-insights`,
            analyzePerformance: `${baseURL}/api/analyze-performance`,
            analytics: `${baseURL}/api/analytics`,
            health: `${baseURL}/health`
        };
    }

    /**
     * Get cache configuration for different content types
     */
    getCacheConfig(contentType) {
        const baseCache = this.config.contentGeneration;
        
        const cacheConfigs = {
            hero: { ...baseCache, cacheTTL: 3600000 }, // 1 hour
            projects: { ...baseCache, cacheTTL: 1800000 }, // 30 minutes
            testimonials: { ...baseCache, cacheTTL: 86400000 }, // 24 hours
            insights: { ...baseCache, cacheTTL: 600000 }, // 10 minutes
            analytics: { ...baseCache, cacheTTL: 300000 } // 5 minutes
        };

        return cacheConfigs[contentType] || baseCache;
    }

    /**
     * Export configuration for client-side use (sanitized)
     */
    getClientConfig() {
        return {
            analytics: {
                enabled: this.config.analytics.enabled,
                trackingId: this.config.analytics.trackingId,
                batchSize: this.config.analytics.batchSize,
                flushInterval: this.config.analytics.flushInterval,
                enableRealTime: this.config.analytics.enableRealTime
            },
            features: this.config.features,
            portfolio: this.config.portfolio,
            performance: this.config.performance,
            apiEndpoints: this.getAPIEndpoints()
        };
    }

    /**
     * Deep merge utility function
     */
    deepMerge(target, source) {
        const result = { ...target };
        
        for (const key in source) {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                result[key] = this.deepMerge(target[key] || {}, source[key]);
            } else {
                result[key] = source[key];
            }
        }
        
        return result;
    }

    /**
     * Get full configuration (for debugging)
     */
    getFullConfig() {
        return JSON.parse(JSON.stringify(this.config));
    }

    /**
     * Reset configuration to defaults
     */
    reset() {
        this.config = this.loadConfig();
        this.validateConfig();
    }
}

// Singleton instance
let configInstance = null;

/**
 * Get or create AI configuration instance
 */
function getAIConfig(environment) {
    if (!configInstance) {
        configInstance = new AIConfig(environment || process.env.NODE_ENV || 'development');
    }
    return configInstance;
}

/**
 * Reset configuration instance (useful for testing)
 */
function resetAIConfig() {
    configInstance = null;
}

// Export for both CommonJS and ES modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AIConfig,
        getAIConfig,
        resetAIConfig
    };
} else {
    window.AIConfig = AIConfig;
    window.getAIConfig = getAIConfig;
    window.resetAIConfig = resetAIConfig;
}