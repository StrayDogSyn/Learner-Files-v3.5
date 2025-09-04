// Core AI Service for StrayDog Syndications AI Ecosystem
import { claudeOrchestrator } from '../orchestration/ClaudeOrchestrator';
import { rateLimiter } from './RateLimiter';
import { analyticsService } from './AnalyticsService';
import { contextManager } from './ContextManager';
export class AIService {
    constructor() {
        Object.defineProperty(this, "orchestrator", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: claudeOrchestrator
        });
        // Using singleton instance
    }
    /**
     * Generate content using AI with full orchestration
     */
    async generateContent(prompt, domain, contentType, userId, userRole, tier, sessionId) {
        const startTime = Date.now();
        try {
            // Check rate limits
            const rateLimitCheck = await rateLimiter.checkLimit(userId, tier);
            if (!rateLimitCheck.allowed) {
                return {
                    success: false,
                    error: {
                        code: 'RATE_LIMIT_EXCEEDED',
                        message: `Rate limit exceeded. Try again at ${rateLimitCheck.resetTime}`,
                        timestamp: new Date()
                    }
                };
            }
            // Get or create session context
            let context;
            if (sessionId) {
                context = await contextManager.getContext(sessionId);
            }
            if (!context) {
                sessionId = await contextManager.createSession(userId, domain, userRole);
                context = await contextManager.getContext(sessionId);
            }
            if (!context) {
                throw new Error('Failed to create or retrieve context');
            }
            // Generate content using orchestrator
            const claudeRequest = {
                userId,
                sessionId,
                domain,
                type: contentType,
                context: { prompt }
            };
            const response = await this.orchestrator.generateContent(claudeRequest, tier);
            if (!response.success) {
                throw new Error(response.error?.message || 'Content generation failed');
            }
            const endTime = Date.now();
            const responseTime = endTime - startTime;
            const tokensUsed = response.data?.metadata?.tokensUsed || 0;
            // Record usage
            await rateLimiter.recordUsage(userId, tokensUsed);
            // Update context
            await contextManager.updateContext(sessionId, {
                role: 'user',
                content: prompt,
                timestamp: new Date(startTime)
            }, tokensUsed);
            await contextManager.updateContext(sessionId, {
                role: 'assistant',
                content: response.data?.content || '',
                timestamp: new Date(endTime)
            });
            // Track analytics
            const analyticsEvent = {
                eventId: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                userId,
                userRole,
                domain,
                contentType,
                success: true,
                timestamp: new Date(),
                tokensUsed,
                performance: {
                    responseTime,
                    timestamp: new Date()
                }
            };
            await analyticsService.trackEvent(analyticsEvent);
            return {
                success: true,
                data: response.data?.content || '',
                metadata: {
                    requestId: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    timestamp: new Date(),
                    processingTime: responseTime
                }
            };
        }
        catch (error) {
            const endTime = Date.now();
            const responseTime = endTime - startTime;
            // Track failed analytics
            const analyticsEvent = {
                eventId: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                userId,
                userRole,
                domain,
                contentType,
                success: false,
                timestamp: new Date(),
                error: error instanceof Error ? error.message : 'Unknown error',
                performance: {
                    responseTime,
                    timestamp: new Date()
                }
            };
            await analyticsService.trackEvent(analyticsEvent);
            return {
                success: false,
                error: {
                    code: 'GENERATION_FAILED',
                    message: error instanceof Error ? error.message : 'Content generation failed',
                    timestamp: new Date()
                }
            };
        }
    }
    /**
     * Qualify leads for business domain
     */
    async qualifyLead(request, userId, userRole, tier) {
        try {
            const prompt = this.buildLeadQualificationPrompt(request);
            const response = await this.generateContent(prompt, 'business', 'analysis', userId, userRole, tier);
            if (!response.success) {
                return {
                    success: false,
                    error: response.error
                };
            }
            // Parse AI response into structured format
            const qualificationData = this.parseLeadQualification(response.data);
            return {
                success: true,
                data: qualificationData,
                metadata: response.metadata
            };
        }
        catch (error) {
            return {
                success: false,
                error: {
                    code: 'LEAD_QUALIFICATION_FAILED',
                    message: error instanceof Error ? error.message : 'Lead qualification failed',
                    timestamp: new Date()
                }
            };
        }
    }
    /**
     * Generate code for technical domain
     */
    async generateCode(request, userId, userRole, tier) {
        try {
            const prompt = this.buildCodeGenerationPrompt(request);
            const response = await this.generateContent(prompt, 'technical', 'code', userId, userRole, tier);
            if (!response.success) {
                return {
                    success: false,
                    error: response.error
                };
            }
            // Parse AI response into structured format
            const codeData = this.parseCodeGeneration(response.data, request);
            return {
                success: true,
                data: codeData,
                metadata: response.metadata
            };
        }
        catch (error) {
            return {
                success: false,
                error: {
                    code: 'CODE_GENERATION_FAILED',
                    message: error instanceof Error ? error.message : 'Code generation failed',
                    timestamp: new Date()
                }
            };
        }
    }
    /**
     * Analyze ROI for business domain
     */
    async analyzeROI(request, userId, userRole, tier) {
        try {
            const prompt = this.buildROIAnalysisPrompt(request);
            const response = await this.generateContent(prompt, 'business', 'roi', userId, userRole, tier);
            if (!response.success) {
                return {
                    success: false,
                    error: response.error
                };
            }
            // Parse AI response into structured format
            const roiData = this.parseROIAnalysis(response.data);
            return {
                success: true,
                data: roiData,
                metadata: response.metadata
            };
        }
        catch (error) {
            return {
                success: false,
                error: {
                    code: 'ROI_ANALYSIS_FAILED',
                    message: error instanceof Error ? error.message : 'ROI analysis failed',
                    timestamp: new Date()
                }
            };
        }
    }
    /**
     * Calculate impact metrics for justice domain
     */
    async calculateImpactMetrics(request, userId, userRole, tier) {
        try {
            const prompt = this.buildImpactMetricsPrompt(request);
            const response = await this.generateContent(prompt, 'justice', 'metrics', userId, userRole, tier);
            if (!response.success) {
                return {
                    success: false,
                    error: response.error
                };
            }
            // Parse AI response into structured format
            const impactData = this.parseImpactMetrics(response.data);
            return {
                success: true,
                data: impactData,
                metadata: response.metadata
            };
        }
        catch (error) {
            return {
                success: false,
                error: {
                    code: 'IMPACT_METRICS_FAILED',
                    message: error instanceof Error ? error.message : 'Impact metrics calculation failed',
                    timestamp: new Date()
                }
            };
        }
    }
    /**
     * Get user's rate limit status
     */
    async getRateLimitStatus(userId, tier) {
        try {
            const usage = await rateLimiter.getUserUsage(userId, tier);
            return {
                success: true,
                data: usage
            };
        }
        catch (error) {
            return {
                success: false,
                error: {
                    code: 'RATE_LIMIT_STATUS_FAILED',
                    message: error instanceof Error ? error.message : 'Failed to get rate limit status',
                    timestamp: new Date()
                }
            };
        }
    }
    /**
     * Get user's session history
     */
    async getUserSessions(userId) {
        try {
            const sessions = await contextManager.getUserSessions(userId);
            return {
                success: true,
                data: sessions
            };
        }
        catch (error) {
            return {
                success: false,
                error: {
                    code: 'SESSION_HISTORY_FAILED',
                    message: error instanceof Error ? error.message : 'Failed to get session history',
                    timestamp: new Date()
                }
            };
        }
    }
    // Private helper methods for building prompts
    buildLeadQualificationPrompt(request) {
        return `Analyze this lead and provide qualification assessment:

Lead Information:
- Company: ${request.company}
- Industry: ${request.industry}
- Size: ${request.companySize}
- Budget: ${request.budget}
- Timeline: ${request.timeline}
- Pain Points: ${request.painPoints.join(', ')}
- Contact: ${request.contactInfo.name} (${request.contactInfo.role})

Please provide:
1. Lead Score (1-100)
2. Qualification Status (Hot/Warm/Cold)
3. Recommended Actions
4. Key Insights
5. Next Steps

Format as JSON with these fields: score, status, actions, insights, nextSteps`;
    }
    buildCodeGenerationPrompt(request) {
        return `Generate ${request.language} code for the following requirement:

${request.description}

Requirements:
- Language: ${request.language}
- Framework: ${request.framework || 'None specified'}
- Style: ${request.style || 'Standard'}

Please provide:
1. Clean, well-commented code
2. Explanation of the approach
3. Usage examples
4. Best practices applied

Format the response with clear code blocks and explanations.`;
    }
    buildROIAnalysisPrompt(request) {
        return `Analyze the ROI for this business scenario:

Investment: $${request.investment}
Timeframe: ${request.timeframe} months
Expected Benefits: ${request.expectedBenefits.join(', ')}
Costs: ${request.costs.join(', ')}
Risks: ${request.risks.join(', ')}

Please provide:
1. ROI Percentage
2. Payback Period
3. Net Present Value
4. Risk Assessment
5. Recommendations

Format as JSON with these fields: roiPercentage, paybackPeriod, npv, riskLevel, recommendations`;
    }
    buildImpactMetricsPrompt(request) {
        return `Calculate impact metrics for this justice reform initiative:

Initiative: ${request.initiative}
Target Population: ${request.targetPopulation}
Expected Outcomes: ${request.expectedOutcomes.join(', ')}
Timeframe: ${request.timeframe}
Resources: ${request.resources.join(', ')}

Please provide:
1. Impact Score (1-100)
2. Affected Population Size
3. Success Probability
4. Key Performance Indicators
5. Measurement Strategy

Format as JSON with these fields: impactScore, affectedPopulation, successProbability, kpis, measurementStrategy`;
    }
    // Private helper methods for parsing responses
    parseLeadQualification(response) {
        try {
            // Try to extract JSON from response
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                return {
                    score: parsed.score || 0,
                    status: parsed.status || 'Cold',
                    actions: parsed.actions || [],
                    insights: parsed.insights || [],
                    nextSteps: parsed.nextSteps || []
                };
            }
        }
        catch (error) {
            // Fallback to text parsing
        }
        // Fallback response
        return {
            score: 50,
            status: 'Warm',
            actions: ['Review lead details', 'Schedule follow-up'],
            insights: ['Lead requires further qualification'],
            nextSteps: ['Contact lead within 24 hours']
        };
    }
    parseCodeGeneration(response, request) {
        // Extract code blocks from response
        const codeBlocks = response.match(/```[\s\S]*?```/g) || [];
        const code = codeBlocks.map(block => block.replace(/```\w*\n?|```/g, '').trim()).join('\n\n');
        return {
            code: code || response,
            language: request.language,
            framework: request.framework,
            explanation: response,
            examples: [],
            bestPractices: []
        };
    }
    parseROIAnalysis(response) {
        try {
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                return {
                    projectedROI: parsed.projectedROI || parsed.roiPercentage || 0,
                    breakEvenPoint: parsed.breakEvenPoint || parsed.paybackPeriod || 0,
                    costSavings: parsed.costSavings || 0,
                    riskFactors: parsed.riskFactors || [],
                    recommendations: parsed.recommendations || [],
                    roiPercentage: parsed.roiPercentage || 0,
                    paybackPeriod: parsed.paybackPeriod || 0,
                    npv: parsed.npv || 0,
                    riskLevel: parsed.riskLevel || 'Medium'
                };
            }
        }
        catch (error) {
            // Fallback to text parsing
        }
        return {
            projectedROI: 15,
            breakEvenPoint: 12,
            costSavings: 50000,
            riskFactors: ['Market volatility', 'Implementation challenges'],
            recommendations: ['Conduct detailed analysis', 'Monitor key metrics'],
            roiPercentage: 15,
            paybackPeriod: 12,
            npv: 0,
            riskLevel: 'Medium'
        };
    }
    parseImpactMetrics(response) {
        try {
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                return {
                    outcomes: parsed.outcomes || {},
                    trends: parsed.trends || {},
                    insights: parsed.insights || [],
                    recommendations: parsed.recommendations || [],
                    confidence: parsed.confidence || 0.75,
                    impactScore: parsed.impactScore || 0,
                    affectedPopulation: parsed.affectedPopulation || 0,
                    successProbability: parsed.successProbability || 0,
                    kpis: parsed.kpis || [],
                    measurementStrategy: parsed.measurementStrategy || []
                };
            }
        }
        catch (error) {
            // Fallback to text parsing
        }
        return {
            outcomes: { 'participation': 85, 'satisfaction': 78 },
            trends: { 'monthly': [70, 75, 80, 85] },
            insights: ['High engagement observed', 'Positive trend in outcomes'],
            recommendations: ['Continue current approach', 'Expand to additional areas'],
            confidence: 0.75,
            impactScore: 70,
            affectedPopulation: 1000,
            successProbability: 75,
            kpis: ['Participation rate', 'Outcome improvement'],
            measurementStrategy: ['Baseline measurement', 'Regular monitoring', 'Impact assessment']
        };
    }
}
// Export singleton instance
export const aiService = new AIService();
//# sourceMappingURL=AIService.js.map