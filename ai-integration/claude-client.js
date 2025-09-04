/**
 * Claude API Client for StrayDog Syndications
 * Implements the AI integration layer as specified in Option A
 */

class ClaudeClient {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseURL = 'https://api.anthropic.com/v1/messages';
        this.model = 'claude-3-sonnet-20240229';
    }

    /**
     * Generate content with context-aware prompts
     * @param {string} prompt - The user prompt
     * @param {string} context - Context type: 'portfolio', 'projects', 'consulting'
     * @param {Object} options - Additional options
     */
    async generateContent(prompt, context = 'portfolio', options = {}) {
        const contextPrompts = {
            portfolio: 'You are an AI assistant helping showcase a full-stack developer\'s portfolio focused on justice reform technology.',
            projects: 'You are analyzing technical projects and providing insights on implementation and innovation.',
            consulting: 'You are a business consultant specializing in AI implementation for justice reform organizations.',
            analytics: 'You are analyzing performance metrics and providing actionable insights for portfolio optimization.'
        };

        const systemPrompt = contextPrompts[context] || contextPrompts.portfolio;
        
        try {
            const response = await fetch(this.baseURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': this.apiKey,
                    'anthropic-version': '2023-06-01'
                },
                body: JSON.stringify({
                    model: this.model,
                    max_tokens: options.maxTokens || 1000,
                    temperature: options.temperature || 0.7,
                    messages: [
                        {
                            role: 'system',
                            content: systemPrompt
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ]
                })
            });

            if (!response.ok) {
                throw new Error(`Claude API error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            
            return {
                success: true,
                content: data.content[0].text,
                usage: data.usage,
                model: data.model,
                timestamp: new Date().toISOString()
            };

        } catch (error) {
            console.error('Claude API Error:', error);
            return {
                success: false,
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }

    /**
     * Generate project insights
     */
    async generateProjectInsights(projectData) {
        const prompt = `Analyze this project and provide insights on its technical implementation, innovation level, and potential impact:\n\n${JSON.stringify(projectData, null, 2)}`;
        return this.generateContent(prompt, 'projects');
    }

    /**
     * Generate portfolio content
     */
    async generatePortfolioContent(section, data) {
        const prompt = `Generate compelling content for the ${section} section of a developer portfolio. Context: ${JSON.stringify(data, null, 2)}`;
        return this.generateContent(prompt, 'portfolio');
    }

    /**
     * Generate business consulting insights
     */
    async generateConsultingInsights(clientData) {
        const prompt = `Provide strategic consulting insights for this client scenario:\n\n${JSON.stringify(clientData, null, 2)}`;
        return this.generateContent(prompt, 'consulting');
    }

    /**
     * Analyze performance metrics
     */
    async analyzeMetrics(metricsData) {
        const prompt = `Analyze these performance metrics and provide actionable insights:\n\n${JSON.stringify(metricsData, null, 2)}`;
        return this.generateContent(prompt, 'analytics');
    }
}

// Export for both CommonJS and ES modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ClaudeClient;
} else {
    window.ClaudeClient = ClaudeClient;
}