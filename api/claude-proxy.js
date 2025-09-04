/**
 * Claude API Proxy for StrayDog Syndications Portfolio
 * Handles secure API communication between frontend and Claude AI
 */

const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { body, validationResult } = require('express-validator');

class ClaudeProxy {
    constructor(config = {}) {
        this.config = {
            port: config.port || 3001,
            apiKey: config.apiKey || process.env.ANTHROPIC_API_KEY,
            baseURL: config.baseURL || 'https://api.anthropic.com/v1',
            maxTokens: config.maxTokens || 1000,
            model: config.model || 'claude-3-sonnet-20240229',
            corsOrigin: config.corsOrigin || 'http://localhost:3000',
            ...config
        };
        
        this.app = express();
        this.setupMiddleware();
        this.setupRoutes();
    }

    /**
     * Setup Express middleware
     */
    setupMiddleware() {
        // Security middleware
        this.app.use(helmet());
        
        // CORS configuration
        this.app.use(cors({
            origin: this.config.corsOrigin,
            credentials: true,
            methods: ['GET', 'POST'],
            allowedHeaders: ['Content-Type', 'Authorization']
        }));
        
        // Rate limiting
        const limiter = rateLimit({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 100, // Limit each IP to 100 requests per windowMs
            message: {
                error: 'Too many requests from this IP, please try again later.'
            }
        });
        this.app.use('/api/', limiter);
        
        // Body parsing
        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
        
        // Request logging
        this.app.use((req, res, next) => {
            console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
            next();
        });
    }

    /**
     * Setup API routes
     */
    setupRoutes() {
        // Health check
        this.app.get('/health', (req, res) => {
            res.json({ 
                status: 'healthy', 
                timestamp: new Date().toISOString(),
                version: '1.0.0'
            });
        });

        // Generate content endpoint
        this.app.post('/api/generate', 
            this.validateGenerateRequest(),
            this.handleGenerate.bind(this)
        );

        // Generate project insights
        this.app.post('/api/project-insights',
            this.validateProjectRequest(),
            this.handleProjectInsights.bind(this)
        );

        // Generate portfolio content
        this.app.post('/api/portfolio-content',
            this.validatePortfolioRequest(),
            this.handlePortfolioContent.bind(this)
        );

        // Generate consulting insights
        this.app.post('/api/consulting-insights',
            this.validateConsultingRequest(),
            this.handleConsultingInsights.bind(this)
        );

        // Analyze performance metrics
        this.app.post('/api/analyze-performance',
            this.validateAnalyticsRequest(),
            this.handleAnalyzePerformance.bind(this)
        );

        // Analytics endpoint for tracking
        this.app.post('/api/analytics',
            this.validateAnalyticsData(),
            this.handleAnalytics.bind(this)
        );

        // Error handling middleware
        this.app.use(this.errorHandler.bind(this));
    }

    /**
     * Validation middleware for generate requests
     */
    validateGenerateRequest() {
        return [
            body('prompt').isString().isLength({ min: 1, max: 5000 })
                .withMessage('Prompt must be a string between 1 and 5000 characters'),
            body('context').optional().isString().isLength({ max: 2000 })
                .withMessage('Context must be a string with max 2000 characters'),
            body('maxTokens').optional().isInt({ min: 1, max: 4000 })
                .withMessage('Max tokens must be between 1 and 4000')
        ];
    }

    /**
     * Validation middleware for project requests
     */
    validateProjectRequest() {
        return [
            body('projectData').isObject()
                .withMessage('Project data must be an object'),
            body('projectData.name').isString().isLength({ min: 1, max: 200 })
                .withMessage('Project name is required and must be under 200 characters')
        ];
    }

    /**
     * Validation middleware for portfolio requests
     */
    validatePortfolioRequest() {
        return [
            body('section').isString().isIn(['hero', 'about', 'services', 'testimonials'])
                .withMessage('Section must be one of: hero, about, services, testimonials'),
            body('context').optional().isObject()
                .withMessage('Context must be an object')
        ];
    }

    /**
     * Validation middleware for consulting requests
     */
    validateConsultingRequest() {
        return [
            body('clientType').isString().isLength({ min: 1, max: 100 })
                .withMessage('Client type is required'),
            body('industry').optional().isString().isLength({ max: 100 })
                .withMessage('Industry must be under 100 characters')
        ];
    }

    /**
     * Validation middleware for analytics requests
     */
    validateAnalyticsRequest() {
        return [
            body('metrics').isObject()
                .withMessage('Metrics must be an object'),
            body('timeframe').optional().isString().isIn(['day', 'week', 'month', 'year'])
                .withMessage('Timeframe must be one of: day, week, month, year')
        ];
    }

    /**
     * Validation middleware for analytics data
     */
    validateAnalyticsData() {
        return [
            body('trackingId').isString().isLength({ min: 1, max: 100 })
                .withMessage('Tracking ID is required'),
            body('events').isArray({ max: 100 })
                .withMessage('Events must be an array with max 100 items')
        ];
    }

    /**
     * Handle content generation requests
     */
    async handleGenerate(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ 
                    success: false, 
                    errors: errors.array() 
                });
            }

            const { prompt, context, maxTokens } = req.body;
            
            const response = await this.callClaudeAPI({
                prompt: this.buildPrompt(prompt, context),
                maxTokens: maxTokens || this.config.maxTokens
            });

            res.json({
                success: true,
                content: response.content,
                usage: response.usage
            });
        } catch (error) {
            this.handleError(res, error, 'Content generation failed');
        }
    }

    /**
     * Handle project insights requests
     */
    async handleProjectInsights(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ 
                    success: false, 
                    errors: errors.array() 
                });
            }

            const { projectData } = req.body;
            
            const prompt = this.buildProjectInsightsPrompt(projectData);
            const response = await this.callClaudeAPI({ prompt });

            res.json({
                success: true,
                insights: response.content,
                projectName: projectData.name
            });
        } catch (error) {
            this.handleError(res, error, 'Project insights generation failed');
        }
    }

    /**
     * Handle portfolio content requests
     */
    async handlePortfolioContent(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ 
                    success: false, 
                    errors: errors.array() 
                });
            }

            const { section, context } = req.body;
            
            const prompt = this.buildPortfolioPrompt(section, context);
            const response = await this.callClaudeAPI({ prompt });

            res.json({
                success: true,
                content: response.content,
                section
            });
        } catch (error) {
            this.handleError(res, error, 'Portfolio content generation failed');
        }
    }

    /**
     * Handle consulting insights requests
     */
    async handleConsultingInsights(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ 
                    success: false, 
                    errors: errors.array() 
                });
            }

            const { clientType, industry } = req.body;
            
            const prompt = this.buildConsultingPrompt(clientType, industry);
            const response = await this.callClaudeAPI({ prompt });

            res.json({
                success: true,
                insights: response.content,
                clientType,
                industry
            });
        } catch (error) {
            this.handleError(res, error, 'Consulting insights generation failed');
        }
    }

    /**
     * Handle performance analysis requests
     */
    async handleAnalyzePerformance(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ 
                    success: false, 
                    errors: errors.array() 
                });
            }

            const { metrics, timeframe } = req.body;
            
            const prompt = this.buildAnalyticsPrompt(metrics, timeframe);
            const response = await this.callClaudeAPI({ prompt });

            res.json({
                success: true,
                analysis: response.content,
                timeframe: timeframe || 'current'
            });
        } catch (error) {
            this.handleError(res, error, 'Performance analysis failed');
        }
    }

    /**
     * Handle analytics data storage
     */
    async handleAnalytics(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ 
                    success: false, 
                    errors: errors.array() 
                });
            }

            const { trackingId, session, events } = req.body;
            
            // In a real implementation, you would store this data in a database
            // For now, we'll just log it and return success
            console.log('Analytics data received:', {
                trackingId,
                sessionId: session?.sessionId,
                eventCount: events?.length || 0,
                timestamp: new Date().toISOString()
            });

            res.json({
                success: true,
                message: 'Analytics data received',
                processed: events?.length || 0
            });
        } catch (error) {
            this.handleError(res, error, 'Analytics processing failed');
        }
    }

    /**
     * Call Claude API
     */
    async callClaudeAPI({ prompt, maxTokens = this.config.maxTokens }) {
        if (!this.config.apiKey) {
            throw new Error('Anthropic API key not configured');
        }

        const response = await fetch(`${this.config.baseURL}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.config.apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: this.config.model,
                max_tokens: maxTokens,
                messages: [{
                    role: 'user',
                    content: prompt
                }]
            })
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Claude API error: ${response.status} - ${error}`);
        }

        const data = await response.json();
        return {
            content: data.content[0]?.text || '',
            usage: data.usage
        };
    }

    /**
     * Build prompts for different use cases
     */
    buildPrompt(prompt, context) {
        let fullPrompt = prompt;
        
        if (context) {
            fullPrompt = `Context: ${context}\n\nRequest: ${prompt}`;
        }
        
        return fullPrompt;
    }

    buildProjectInsightsPrompt(projectData) {
        return `Analyze this project and provide insights for a justice reform technology portfolio:\n\n${JSON.stringify(projectData, null, 2)}\n\nProvide insights on:\n- Technical approach and innovation\n- Impact on justice reform\n- Key features and benefits\n- Potential improvements\n\nFormat as JSON with keys: technical, impact, features, improvements`;
    }

    buildPortfolioPrompt(section, context) {
        const prompts = {
            hero: 'Generate compelling hero section content for a justice reform technology consultant portfolio. Include headline, subtitle, and call-to-action.',
            about: 'Generate an about section highlighting expertise in justice reform technology, AI, and 20+ years of experience.',
            services: 'Generate a services section for justice reform technology consulting, including AI solutions, system modernization, and strategic consulting.',
            testimonials: 'Generate realistic testimonials from justice reform organizations praising technology consulting services.'
        };
        
        let prompt = prompts[section] || prompts.hero;
        
        if (context) {
            prompt += `\n\nContext: ${JSON.stringify(context)}`;
        }
        
        return prompt;
    }

    buildConsultingPrompt(clientType, industry) {
        return `Generate consulting insights for a ${clientType} client${industry ? ` in the ${industry} industry` : ''} seeking justice reform technology solutions. Include:\n- Key challenges they likely face\n- Recommended technology solutions\n- Implementation approach\n- Expected outcomes\n\nFormat as JSON with keys: challenges, solutions, approach, outcomes`;
    }

    buildAnalyticsPrompt(metrics, timeframe) {
        return `Analyze these portfolio performance metrics and provide actionable insights:\n\n${JSON.stringify(metrics, null, 2)}\n\nTimeframe: ${timeframe || 'current'}\n\nProvide:\n- Key performance indicators\n- Trends and patterns\n- Recommendations for improvement\n- Success metrics to track\n\nFormat as JSON with keys: kpis, trends, recommendations, metrics`;
    }

    /**
     * Error handling
     */
    handleError(res, error, message) {
        console.error(`${message}:`, error);
        
        const statusCode = error.status || 500;
        const errorMessage = error.message || 'Internal server error';
        
        res.status(statusCode).json({
            success: false,
            error: message,
            details: errorMessage,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Global error handler middleware
     */
    errorHandler(error, req, res, next) {
        console.error('Unhandled error:', error);
        
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Start the proxy server
     */
    start() {
        return new Promise((resolve, reject) => {
            try {
                this.server = this.app.listen(this.config.port, () => {
                    console.log(`Claude Proxy server running on port ${this.config.port}`);
                    console.log(`Health check: http://localhost:${this.config.port}/health`);
                    resolve(this.server);
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Stop the proxy server
     */
    stop() {
        return new Promise((resolve) => {
            if (this.server) {
                this.server.close(() => {
                    console.log('Claude Proxy server stopped');
                    resolve();
                });
            } else {
                resolve();
            }
        });
    }
}

// Export for both CommonJS and ES modules
module.exports = ClaudeProxy;

// Auto-start if run directly
if (require.main === module) {
    const proxy = new ClaudeProxy();
    proxy.start().catch(console.error);
    
    // Graceful shutdown
    process.on('SIGINT', async () => {
        console.log('\nShutting down Claude Proxy...');
        await proxy.stop();
        process.exit(0);
    });
}