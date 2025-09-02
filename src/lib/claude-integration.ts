import { ChatMessage } from '../types/search';

// Claude API configuration
interface ClaudeConfig {
  apiKey?: string;
  baseUrl?: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

interface ClaudeMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ClaudeResponse {
  id: string;
  type: string;
  role: string;
  content: Array<{
    type: string;
    text: string;
  }>;
  model: string;
  stop_reason: string;
  stop_sequence: null;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

interface SearchContext {
  query: string;
  category?: string;
  userPreferences?: {
    categories: string[];
    technologies: string[];
    difficulty: string;
  };
  searchHistory?: string[];
  currentResults?: any[];
}

interface ProjectAnalysisRequest {
  projectData: any;
  analysisType: 'summary' | 'technical' | 'features' | 'recommendations';
  context?: string;
}

interface ArtworkAnalysisRequest {
  artworkData: any;
  analysisType: 'description' | 'style' | 'technical' | 'inspiration';
  context?: string;
}

class ClaudeIntegration {
  private config: ClaudeConfig;
  private isConfigured: boolean = false;

  constructor(config: ClaudeConfig = {}) {
    this.config = {
      baseUrl: 'https://api.anthropic.com/v1',
      model: 'claude-3-5-sonnet-20241022',
      maxTokens: 1000,
      temperature: 0.7,
      ...config
    };
    
    // Check if API key is available
    this.isConfigured = !!(config.apiKey || process.env.ANTHROPIC_API_KEY);
  }

  /**
   * Check if Claude integration is properly configured
   */
  isReady(): boolean {
    return this.isConfigured;
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<ClaudeConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.isConfigured = !!(newConfig.apiKey || this.config.apiKey || process.env.ANTHROPIC_API_KEY);
  }

  /**
   * Generate search suggestions based on query and context
   */
  async generateSearchSuggestions(context: SearchContext): Promise<string[]> {
    if (!this.isConfigured) {
      return this.getFallbackSearchSuggestions(context);
    }

    try {
      const prompt = this.buildSearchSuggestionsPrompt(context);
      const response = await this.sendMessage(prompt);
      return this.parseSearchSuggestions(response);
    } catch (error) {
      console.warn('Claude API error, using fallback suggestions:', error);
      return this.getFallbackSearchSuggestions(context);
    }
  }

  /**
   * Analyze project data and provide insights
   */
  async analyzeProject(request: ProjectAnalysisRequest): Promise<string> {
    if (!this.isConfigured) {
      return this.getFallbackProjectAnalysis(request);
    }

    try {
      const prompt = this.buildProjectAnalysisPrompt(request);
      const response = await this.sendMessage(prompt);
      return this.extractTextContent(response);
    } catch (error) {
      console.warn('Claude API error, using fallback analysis:', error);
      return this.getFallbackProjectAnalysis(request);
    }
  }

  /**
   * Analyze AI artwork and provide descriptions
   */
  async analyzeArtwork(request: ArtworkAnalysisRequest): Promise<string> {
    if (!this.isConfigured) {
      return this.getFallbackArtworkAnalysis(request);
    }

    try {
      const prompt = this.buildArtworkAnalysisPrompt(request);
      const response = await this.sendMessage(prompt);
      return this.extractTextContent(response);
    } catch (error) {
      console.warn('Claude API error, using fallback analysis:', error);
      return this.getFallbackArtworkAnalysis(request);
    }
  }

  /**
   * Generate conversational responses for chat interface
   */
  async generateChatResponse(messages: ChatMessage[], context?: any): Promise<string> {
    if (!this.isConfigured) {
      return this.getFallbackChatResponse(messages);
    }

    try {
      const prompt = this.buildChatPrompt(messages, context);
      const response = await this.sendMessage(prompt);
      return this.extractTextContent(response);
    } catch (error) {
      console.warn('Claude API error, using fallback response:', error);
      return this.getFallbackChatResponse(messages);
    }
  }

  /**
   * Generate code explanations and suggestions
   */
  async explainCode(code: string, language: string, context?: string): Promise<string> {
    if (!this.isConfigured) {
      return this.getFallbackCodeExplanation(code, language);
    }

    try {
      const prompt = this.buildCodeExplanationPrompt(code, language, context);
      const response = await this.sendMessage(prompt);
      return this.extractTextContent(response);
    } catch (error) {
      console.warn('Claude API error, using fallback explanation:', error);
      return this.getFallbackCodeExplanation(code, language);
    }
  }

  /**
   * Send message to Claude API
   */
  private async sendMessage(prompt: string): Promise<ClaudeResponse> {
    const apiKey = this.config.apiKey || process.env.ANTHROPIC_API_KEY;
    
    if (!apiKey) {
      throw new Error('Claude API key not configured');
    }

    const response = await fetch(`${this.config.baseUrl}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: this.config.model,
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Build search suggestions prompt
   */
  private buildSearchSuggestionsPrompt(context: SearchContext): string {
    return `
As an AI assistant for a developer portfolio, generate 5 relevant search suggestions based on this context:

Query: "${context.query}"
Category: ${context.category || 'all'}
User Preferences: ${JSON.stringify(context.userPreferences || {})}
Search History: ${JSON.stringify(context.searchHistory || [])}

The portfolio contains:
- React/TypeScript projects
- AI/ML demonstrations
- Interactive code examples
- AI-generated artwork
- Technical blog posts

Provide suggestions that would help the user discover relevant content. Format as a simple list, one suggestion per line.
`;
  }

  /**
   * Build project analysis prompt
   */
  private buildProjectAnalysisPrompt(request: ProjectAnalysisRequest): string {
    const { projectData, analysisType, context } = request;
    
    let analysisInstruction = '';
    switch (analysisType) {
      case 'summary':
        analysisInstruction = 'Provide a concise, engaging summary of this project.';
        break;
      case 'technical':
        analysisInstruction = 'Analyze the technical aspects, architecture, and implementation details.';
        break;
      case 'features':
        analysisInstruction = 'Highlight the key features and capabilities of this project.';
        break;
      case 'recommendations':
        analysisInstruction = 'Suggest improvements or related technologies that could enhance this project.';
        break;
    }

    return `
${analysisInstruction}

Project Data:
${JSON.stringify(projectData, null, 2)}

${context ? `Additional Context: ${context}` : ''}

Provide a clear, informative response that would be valuable to portfolio visitors.
`;
  }

  /**
   * Build artwork analysis prompt
   */
  private buildArtworkAnalysisPrompt(request: ArtworkAnalysisRequest): string {
    const { artworkData, analysisType, context } = request;
    
    let analysisInstruction = '';
    switch (analysisType) {
      case 'description':
        analysisInstruction = 'Provide an artistic description of this AI-generated artwork.';
        break;
      case 'style':
        analysisInstruction = 'Analyze the artistic style and visual elements.';
        break;
      case 'technical':
        analysisInstruction = 'Explain the AI model and generation parameters used.';
        break;
      case 'inspiration':
        analysisInstruction = 'Discuss the creative inspiration and artistic influences.';
        break;
    }

    return `
${analysisInstruction}

Artwork Data:
${JSON.stringify(artworkData, null, 2)}

${context ? `Additional Context: ${context}` : ''}

Provide an insightful response that enhances the viewer's appreciation of the artwork.
`;
  }

  /**
   * Build chat prompt
   */
  private buildChatPrompt(messages: ChatMessage[], context?: any): string {
    const conversationHistory = messages.map(msg => 
      `${msg.type === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
    ).join('\n');

    return `
You are an AI assistant for a developer's portfolio website. Help visitors explore projects, AI artwork, interactive demos, and technical content.

Conversation History:
${conversationHistory}

${context ? `Context: ${JSON.stringify(context)}` : ''}

Provide a helpful, engaging response that guides the user to relevant portfolio content.
`;
  }

  /**
   * Build code explanation prompt
   */
  private buildCodeExplanationPrompt(code: string, language: string, context?: string): string {
    return `
Explain this ${language} code in a clear, educational way:

\`\`\`${language}
${code}
\`\`\`

${context ? `Context: ${context}` : ''}

Provide an explanation that would help someone understand the code's purpose, functionality, and key concepts.
`;
  }

  /**
   * Extract text content from Claude response
   */
  private extractTextContent(response: ClaudeResponse): string {
    if (response.content && response.content.length > 0) {
      return response.content[0].text || '';
    }
    return '';
  }

  /**
   * Parse search suggestions from response
   */
  private parseSearchSuggestions(response: ClaudeResponse): string[] {
    const text = this.extractTextContent(response);
    return text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('-') && !line.startsWith('*'))
      .slice(0, 5);
  }

  // Fallback methods for when Claude API is not available

  private getFallbackSearchSuggestions(context: SearchContext): string[] {
    const { query, category } = context;
    const suggestions: string[] = [];

    if (query.toLowerCase().includes('ai')) {
      suggestions.push('AI art gallery', 'Machine learning projects', 'Neural network demos');
    }
    
    if (query.toLowerCase().includes('react')) {
      suggestions.push('React components', 'TypeScript examples', 'Interactive demos');
    }
    
    if (category === 'projects') {
      suggestions.push('Latest projects', 'Featured work', 'Technical showcases');
    }
    
    if (category === 'gallery') {
      suggestions.push('AI artwork', 'Generated images', 'Creative projects');
    }
    
    // Add generic suggestions if none match
    if (suggestions.length === 0) {
      suggestions.push(
        'Explore all projects',
        'View AI gallery',
        'Try interactive demos',
        'Browse by technology',
        'Recent updates'
      );
    }
    
    return suggestions.slice(0, 5);
  }

  private getFallbackProjectAnalysis(request: ProjectAnalysisRequest): string {
    const { projectData, analysisType } = request;
    
    switch (analysisType) {
      case 'summary':
        return `This project demonstrates ${projectData.title || 'innovative development'} using modern technologies and best practices.`;
      case 'technical':
        return `Built with ${projectData.technologies?.join(', ') || 'cutting-edge technologies'}, this project showcases technical expertise and clean architecture.`;
      case 'features':
        return `Key features include responsive design, modern UI/UX, and robust functionality that delivers an excellent user experience.`;
      case 'recommendations':
        return `Consider exploring related projects or diving deeper into the technologies used in this implementation.`;
      default:
        return 'This project represents quality development work and attention to detail.';
    }
  }

  private getFallbackArtworkAnalysis(request: ArtworkAnalysisRequest): string {
    const { artworkData, analysisType } = request;
    
    switch (analysisType) {
      case 'description':
        return `This AI-generated artwork showcases ${artworkData.style || 'creative'} elements with ${artworkData.description || 'unique visual characteristics'}.`;
      case 'style':
        return `The artwork features ${artworkData.style || 'distinctive'} styling with carefully crafted visual elements and composition.`;
      case 'technical':
        return `Generated using ${artworkData.model || 'advanced AI'} with optimized parameters for ${artworkData.style || 'artistic'} output.`;
      case 'inspiration':
        return `This piece draws inspiration from ${artworkData.tags?.join(', ') || 'various artistic influences'} to create a unique visual experience.`;
      default:
        return 'This artwork demonstrates the creative potential of AI-generated art.';
    }
  }

  private getFallbackChatResponse(messages: ChatMessage[]): string {
    const lastMessage = messages[messages.length - 1];
    const content = lastMessage?.content.toLowerCase() || '';
    
    if (content.includes('help')) {
      return "I'd be happy to help you explore the portfolio! You can browse projects, view AI artwork, try interactive demos, or search for specific content.";
    }
    
    if (content.includes('project')) {
      return "Great! I can show you various projects including web applications, AI implementations, and technical demonstrations. What type of project interests you most?";
    }
    
    if (content.includes('ai') || content.includes('art')) {
      return "The AI gallery features generated artwork and creative projects. You can explore different styles, models, and artistic techniques used in AI art creation.";
    }
    
    return "I'm here to help you navigate the portfolio and find interesting content. Feel free to ask about projects, AI artwork, or any specific technologies you'd like to explore!";
  }

  private getFallbackCodeExplanation(code: string, language: string): string {
    return `This ${language} code demonstrates programming concepts and implementation patterns. The code structure follows best practices and showcases technical skills in ${language} development.`;
  }
}

// Export singleton instance
export const claudeIntegration = new ClaudeIntegration();

// Export class for custom instances
export { ClaudeIntegration };

// Export types
export type {
  ClaudeConfig,
  SearchContext,
  ProjectAnalysisRequest,
  ArtworkAnalysisRequest
};