export type DomainType = 'corporate' | 'technical' | 'educational' | 'justice-reform';

export interface DomainContext {
  domain: DomainType;
  focus: string;
  tone: string;
  expertise: string[];
  templateVersion: string;
}

export interface AIRequest {
  domain: DomainType;
  prompt: string;
  context?: Record<string, any>;
  userId?: string;
  timestamp?: number;
}

export interface AIResponse {
  response: string;
  confidence: number;
  domain: DomainType;
  metadata: {
    processingTime: number;
    tokensUsed: number;
    cached: boolean;
    timestamp: string;
  };
}

export interface AIInteraction {
  id: string;
  userId?: string;
  domain: DomainType;
  prompt: string;
  response: string;
  confidence: number;
  metadata: Record<string, any>;
  createdAt: string;
}

export interface AnalyticsEvent {
  id: string;
  userId?: string;
  eventType: string;
  domain?: DomainType;
  eventData: Record<string, any>;
  createdAt: string;
}

export interface ClaudeConfig {
  apiKey: string;
  model: string;
  maxTokens: number;
  temperature: number;
}

export interface OrchestratorState {
  isInitialized: boolean;
  currentDomain: DomainType | null;
  contexts: Record<DomainType, DomainContext>;
  interactions: AIInteraction[];
  analytics: AnalyticsEvent[];
  isLoading: boolean;
  error: string | null;
}

export interface OrchestratorActions {
  initialize: (config: ClaudeConfig) => Promise<void>;
  setDomain: (domain: DomainType) => void;
  generateResponse: (request: AIRequest) => Promise<AIResponse>;
  sendRequest: (request: { message: string; domain: DomainType; timestamp: number }) => Promise<AIResponse>;
  switchDomain: (domain: DomainType) => void;
  trackInteraction: (interaction: Omit<AIInteraction, 'id' | 'createdAt'>) => void;
  trackAnalytics: (event: Omit<AnalyticsEvent, 'id' | 'createdAt'>) => void;
  clearError: () => void;
  reset: () => void;
}

export type OrchestratorStore = OrchestratorState & OrchestratorActions;