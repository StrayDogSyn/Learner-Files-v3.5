import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { 
  OrchestratorStore, 
  DomainType, 
  ClaudeConfig, 
  AIRequest, 
  AIResponse,
  AIInteraction,
  AnalyticsEvent
} from './types';
import { ClaudeClient } from './claude-client';
import { DOMAIN_CONTEXTS } from './domain-context';

const claudeClient = new ClaudeClient();

export const useOrchestratorStore = create<OrchestratorStore>()(devtools(
  (set, get) => ({
    // State
    isInitialized: false,
    currentDomain: null,
    contexts: DOMAIN_CONTEXTS,
    interactions: [],
    analytics: [],
    isLoading: false,
    error: null,

    // Actions
    initialize: async (config: ClaudeConfig) => {
      set({ isLoading: true, error: null });
      
      try {
        claudeClient.initialize(config);
        set({ 
          isInitialized: true, 
          isLoading: false,
          error: null
        });
      } catch (error) {
        set({ 
          isLoading: false, 
          error: error instanceof Error ? error.message : 'Initialization failed'
        });
        throw error;
      }
    },

    setDomain: (domain: DomainType) => {
      set({ currentDomain: domain });
      
      // Track domain switch analytics
      get().trackAnalytics({
        eventType: 'domain_switch',
        domain,
        eventData: { previousDomain: get().currentDomain }
      });
    },

    generateResponse: async (request: AIRequest): Promise<AIResponse> => {
      const { isInitialized, trackInteraction, trackAnalytics } = get();
      
      if (!isInitialized) {
        throw new Error('AI Orchestrator not initialized');
      }

      set({ isLoading: true, error: null });
      
      try {
        const startTime = Date.now();
        const response = await claudeClient.generateResponse(request);
        const endTime = Date.now();
        
        // Track the interaction
        trackInteraction({
          userId: request.userId,
          domain: request.domain,
          prompt: request.prompt,
          response: response.response,
          confidence: response.confidence,
          metadata: response.metadata
        });
        
        // Track analytics
        trackAnalytics({
          eventType: 'ai_response_generated',
          domain: request.domain,
          userId: request.userId,
          eventData: {
            processingTime: endTime - startTime,
            tokensUsed: response.metadata.tokensUsed,
            confidence: response.confidence
          }
        });
        
        set({ isLoading: false });
        return response;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'AI response generation failed';
        set({ 
          isLoading: false, 
          error: errorMessage
        });
        
        // Track error analytics
        get().trackAnalytics({
          eventType: 'ai_response_error',
          domain: request.domain,
          userId: request.userId,
          eventData: { error: errorMessage }
        });
        
        throw error;
      }
    },

    trackInteraction: (interaction: Omit<AIInteraction, 'id' | 'createdAt'>) => {
      const newInteraction: AIInteraction = {
        ...interaction,
        id: `interaction_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString()
      };
      
      set(state => ({
        interactions: [...state.interactions, newInteraction]
      }));
    },

    trackAnalytics: (event: Omit<AnalyticsEvent, 'id' | 'createdAt'>) => {
      const newEvent: AnalyticsEvent = {
        ...event,
        id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString()
      };
      
      set(state => ({
        analytics: [...state.analytics, newEvent]
      }));
    },

    sendRequest: async (request: { message: string; domain: DomainType; timestamp: number }) => {
      const aiRequest: AIRequest = {
        prompt: request.message,
        domain: request.domain,
        userId: 'test-user',
        context: get().contexts[request.domain],
        timestamp: request.timestamp
      };
      
      return get().generateResponse(aiRequest);
    },

    switchDomain: (domain: DomainType) => {
      get().setDomain(domain);
    },

    clearError: () => {
      set({ error: null });
    },

    reset: () => {
      claudeClient.reset();
      set({
        isInitialized: false,
        currentDomain: null,
        contexts: DOMAIN_CONTEXTS,
        interactions: [],
        analytics: [],
        isLoading: false,
        error: null
      });
    }
  }),
  {
    name: 'ai-orchestrator-store',
    partialize: (state) => ({
      currentDomain: state.currentDomain,
      interactions: state.interactions.slice(-50), // Keep last 50 interactions
      analytics: state.analytics.slice(-100) // Keep last 100 analytics events
    })
  }
));

// Selectors for optimized re-renders
export const useCurrentDomain = () => useOrchestratorStore(state => state.currentDomain);
export const useIsLoading = () => useOrchestratorStore(state => state.isLoading);
export const useError = () => useOrchestratorStore(state => state.error);
export const useIsInitialized = () => useOrchestratorStore(state => state.isInitialized);
export const useInteractions = () => useOrchestratorStore(state => state.interactions);
export const useAnalytics = () => useOrchestratorStore(state => state.analytics);