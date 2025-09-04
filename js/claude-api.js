/**
 * Claude API Integration Wrapper
 * Provides AI chat functionality with graceful fallback
 */
class ClaudeAPI {
    constructor() {
        this.apiEndpoint = '/api/claude';
        this.isAvailable = false;
        this.fallbackResponses = [
            "I'm an AI assistant helping showcase Eric's technical capabilities. While the live API connection isn't available right now, I can tell you about his expertise in AI integration, full-stack development, and justice reform technology.",
            "Thanks for your interest! Eric specializes in Claude 4.1 integration and has extensive experience building AI-powered solutions. His portfolio demonstrates both technical depth and real-world application.",
            "I'd love to help you learn more about Eric's work. He combines 20+ years of customer service excellence with cutting-edge AI development, focusing on justice reform and intelligent automation.",
            "Eric's technical stack includes Claude AI integration, MongoDB, full-stack JavaScript, and advanced analytics. His projects showcase both innovation and practical problem-solving skills.",
            "While I'm running in demo mode, Eric's actual AI implementations include real-time analytics, intelligent content generation, and automated system optimization. His work bridges technical excellence with social impact."
        ];
        this.conversationHistory = [];
        this.checkAPIAvailability();
    }

    async checkAPIAvailability() {
        try {
            const response = await fetch(this.apiEndpoint + '/health', {
                method: 'GET',
                timeout: 3000
            });
            this.isAvailable = response.ok;
        } catch (error) {
            this.isAvailable = false;
            console.log('Claude API not available, using demo mode');
        }
    }

    async sendMessage(message, context = {}) {
        // Add user message to history
        this.conversationHistory.push({
            role: 'user',
            content: message,
            timestamp: new Date().toISOString()
        });

        try {
            if (this.isAvailable) {
                return await this.callClaudeAPI(message, context);
            } else {
                return this.generateFallbackResponse(message, context);
            }
        } catch (error) {
            console.error('Claude API error:', error);
            return this.generateFallbackResponse(message, context);
        }
    }

    async callClaudeAPI(message, context) {
        const payload = {
            message: message,
            context: context,
            history: this.conversationHistory.slice(-10), // Last 10 messages
            system_prompt: "You are an AI assistant representing Eric 'Hunter' Petross, an AI Content Expert & AISE Technical Architect. Help visitors learn about his expertise in Claude 4.1 integration, justice reform technology, and full-stack development. Be professional, knowledgeable, and highlight his unique combination of customer service excellence and technical innovation."
        };

        const response = await fetch(this.apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        
        // Add assistant response to history
        this.conversationHistory.push({
            role: 'assistant',
            content: data.response,
            timestamp: new Date().toISOString()
        });

        return {
            response: data.response,
            isLive: true,
            timestamp: new Date().toISOString()
        };
    }

    generateFallbackResponse(message, context) {
        const lowerMessage = message.toLowerCase();
        let response;

        // Context-aware responses
        if (lowerMessage.includes('ai') || lowerMessage.includes('claude')) {
            response = "Eric specializes in Claude 4.1 API integration and has built sophisticated AI-powered solutions. His expertise includes real-time analytics, intelligent automation, and AI-driven content enhancement. While this is a demo mode, his live implementations showcase advanced AI capabilities.";
        } else if (lowerMessage.includes('project') || lowerMessage.includes('work')) {
            response = "Eric's portfolio includes an AI analytics dashboard, interactive applications, and justice reform technology solutions. Each project demonstrates his ability to combine technical innovation with real-world impact. His work spans full-stack development, database architecture, and AI integration.";
        } else if (lowerMessage.includes('experience') || lowerMessage.includes('background')) {
            response = "With 20+ years of customer service excellence and culinary arts-trained creativity, Eric brings a unique perspective to technical solutions. He transforms customer empathy and high-pressure performance experience into exceptional AI implementations focused on justice reform and intelligent automation.";
        } else if (lowerMessage.includes('contact') || lowerMessage.includes('hire') || lowerMessage.includes('work together')) {
            response = "Eric is available for AI integration projects, full-stack development, and justice reform technology initiatives. His expertise in Claude 4.1, MongoDB, and advanced analytics makes him ideal for organizations seeking innovative technical solutions with social impact.";
        } else {
            // Random fallback response
            const randomIndex = Math.floor(Math.random() * this.fallbackResponses.length);
            response = this.fallbackResponses[randomIndex];
        }

        // Add to conversation history
        this.conversationHistory.push({
            role: 'assistant',
            content: response,
            timestamp: new Date().toISOString()
        });

        return {
            response: response,
            isLive: false,
            timestamp: new Date().toISOString(),
            mode: 'demo'
        };
    }

    async enhanceContent(content, type = 'project') {
        const enhancementPrompt = `Enhance this ${type} description to be more engaging and professional: ${content}`;
        
        try {
            if (this.isAvailable) {
                const result = await this.callClaudeAPI(enhancementPrompt, { type: 'content_enhancement' });
                return result.response;
            } else {
                return this.enhanceContentFallback(content, type);
            }
        } catch (error) {
            console.error('Content enhancement error:', error);
            return this.enhanceContentFallback(content, type);
        }
    }

    enhanceContentFallback(content, type) {
        // Simple enhancement patterns for demo mode
        const enhancements = {
            project: {
                prefix: "🚀 ",
                suffix: " This project demonstrates advanced technical capabilities and innovative problem-solving."
            },
            description: {
                prefix: "✨ ",
                suffix: " Built with cutting-edge technology and user-centered design principles."
            },
            skill: {
                prefix: "💡 ",
                suffix: " Leveraging industry best practices and modern development methodologies."
            }
        };

        const enhancement = enhancements[type] || enhancements.project;
        return enhancement.prefix + content + enhancement.suffix;
    }

    clearHistory() {
        this.conversationHistory = [];
    }

    getStatus() {
        return {
            isAvailable: this.isAvailable,
            mode: this.isAvailable ? 'live' : 'demo',
            conversationLength: this.conversationHistory.length
        };
    }
}

// Export for use in other modules
window.ClaudeAPI = ClaudeAPI;