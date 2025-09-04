import { DomainContext, DomainType } from './types';

export const DOMAIN_CONTEXTS: Record<DomainType, DomainContext> = {
  corporate: {
    domain: 'corporate',
    focus: 'business value, ROI, and professional communication for justice reform solutions',
    tone: 'professional',
    expertise: ['business analysis', 'ROI calculation', 'client engagement', 'justice reform impact'],
    templateVersion: '1.0'
  },
  technical: {
    domain: 'technical',
    focus: 'technical expertise with code examples, emphasizing developer experience and system architecture',
    tone: 'technical',
    expertise: ['software development', 'system architecture', 'AI integration', 'performance optimization'],
    templateVersion: '1.0'
  },
  educational: {
    domain: 'educational',
    focus: 'inclusive, accessible learning experiences for career transitions into tech',
    tone: 'supportive',
    expertise: ['curriculum development', 'personalized learning', 'skill assessment', 'career guidance'],
    templateVersion: '1.0'
  },
  'justice-reform': {
    domain: 'justice-reform',
    focus: 'empathetic, action-oriented content that drives social impact and volunteer engagement',
    tone: 'empathetic',
    expertise: ['social impact', 'policy analysis', 'advocacy strategies', 'community engagement'],
    templateVersion: '1.0'
  }
};

export class DomainContextManager {
  private contexts: Record<DomainType, DomainContext>;

  constructor() {
    this.contexts = { ...DOMAIN_CONTEXTS };
  }

  getContext(domain: DomainType): DomainContext {
    return this.contexts[domain];
  }

  getAllContexts(): Record<DomainType, DomainContext> {
    return { ...this.contexts };
  }

  updateContext(domain: DomainType, updates: Partial<DomainContext>): void {
    this.contexts[domain] = {
      ...this.contexts[domain],
      ...updates
    };
  }

  generateSystemPrompt(domain: DomainType, userPrompt: string): string {
    const context = this.getContext(domain);
    
    return `You are an AI assistant specialized in ${domain} domain for the StrayDog AI-Powered Justice Reform Ecosystem.

Domain Context:
- Focus: ${context.focus}
- Tone: ${context.tone}
- Expertise Areas: ${context.expertise.join(', ')}

Your responses should:
1. Maintain a ${context.tone} tone throughout
2. Focus on ${context.focus}
3. Leverage expertise in: ${context.expertise.join(', ')}
4. Always consider the justice reform mission and social impact
5. Provide actionable, practical guidance

User Request: ${userPrompt}

Please provide a comprehensive response that aligns with the ${domain} domain context and advances our justice reform mission.`;
  }

  validateDomain(domain: string): domain is DomainType {
    return domain in this.contexts;
  }

  getDomainList(): DomainType[] {
    return Object.keys(this.contexts) as DomainType[];
  }
}