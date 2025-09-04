import Anthropic from '@anthropic-ai/sdk';
import { AIRequest, AIResponse, ClaudeConfig } from './types';
import { DomainContextManager } from './domain-context';

export class ClaudeClient {
  private client: Anthropic | null = null;
  private config: ClaudeConfig | null = null;
  private contextManager: DomainContextManager;

  constructor() {
    this.contextManager = new DomainContextManager();
  }

  initialize(config: ClaudeConfig): void {
    this.config = config;
    this.client = new Anthropic({
      apiKey: config.apiKey,
    });
  }

  isInitialized(): boolean {
    return this.client !== null && this.config !== null;
  }

  async generateResponse(request: AIRequest): Promise<AIResponse> {
    if (!this.isInitialized()) {
      throw new Error('Claude client not initialized. Call initialize() first.');
    }

    const startTime = Date.now();
    
    try {
      const systemPrompt = this.contextManager.generateSystemPrompt(
        request.domain,
        request.prompt
      );

      const response = await this.client!.messages.create({
        model: this.config!.model,
        max_tokens: this.config!.maxTokens,
        temperature: this.config!.temperature,
        messages: [
          {
            role: 'user',
            content: systemPrompt
          }
        ]
      });

      const processingTime = Date.now() - startTime;
      const responseText = response.content[0]?.type === 'text' 
        ? response.content[0].text 
        : 'No text response received';

      return {
        response: responseText,
        confidence: this.calculateConfidence(response),
        domain: request.domain,
        metadata: {
          processingTime,
          tokensUsed: response.usage?.input_tokens + response.usage?.output_tokens || 0,
          cached: false, // Claude doesn't provide cache info directly
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      throw new Error(`Claude API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private calculateConfidence(response: Anthropic.Messages.Message): number {
    // Simple confidence calculation based on response length and structure
    const content = response.content[0];
    if (content?.type !== 'text') return 0.5;
    
    const textLength = content.text.length;
    const hasStructure = content.text.includes('\n') || content.text.includes('.');
    
    let confidence = 0.7; // Base confidence
    
    if (textLength > 100) confidence += 0.1;
    if (textLength > 500) confidence += 0.1;
    if (hasStructure) confidence += 0.1;
    
    return Math.min(confidence, 1.0);
  }

  getDomainContextManager(): DomainContextManager {
    return this.contextManager;
  }

  getConfig(): ClaudeConfig | null {
    return this.config;
  }

  reset(): void {
    this.client = null;
    this.config = null;
  }
}