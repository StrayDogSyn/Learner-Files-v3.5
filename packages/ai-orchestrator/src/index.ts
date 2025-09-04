// Types
export type {
  DomainType,
  DomainContext,
  AIRequest,
  AIResponse,
  AIInteraction,
  AnalyticsEvent,
  ClaudeConfig,
  OrchestratorState,
  OrchestratorActions,
  OrchestratorStore
} from './types';

// Domain Context Management
export { DomainContextManager, DOMAIN_CONTEXTS } from './domain-context';

// Claude Client
export { ClaudeClient } from './claude-client';

// Zustand Store
export {
  useOrchestratorStore,
  useCurrentDomain,
  useIsLoading,
  useError,
  useIsInitialized,
  useInteractions,
  useAnalytics as useOrchestratorAnalytics
} from './store';

// Analytics
export { AnalyticsService, getAnalyticsService, destroyAnalyticsService } from './analytics/AnalyticsService';
export type { PerformanceMetrics, DomainMetrics } from './analytics/AnalyticsService';

// Analytics Hooks
export { useAnalytics, useDomainAnalytics, useRealTimeMetrics } from './hooks/useAnalytics';
export type { UseAnalyticsReturn } from './hooks/useAnalytics';

// AI Orchestrator Hook
export { useAIOrchestrator } from './hooks/useAIOrchestrator';

// Utility functions
export const createAIRequest = (
  domain: import('./types').DomainType,
  prompt: string,
  options?: {
    context?: Record<string, any>;
    userId?: string;
  }
): import('./types').AIRequest => ({
  domain,
  prompt,
  context: options?.context,
  userId: options?.userId
});

export const createClaudeConfig = (
  apiKey: string,
  options?: {
    model?: string;
    maxTokens?: number;
    temperature?: number;
  }
): import('./types').ClaudeConfig => ({
  apiKey,
  model: options?.model || 'claude-3-5-sonnet-20241022',
  maxTokens: options?.maxTokens || 4096,
  temperature: options?.temperature || 0.7
});

// Constants
export const AI_ORCHESTRATOR_VERSION = '1.0.0';
export const SUPPORTED_DOMAINS = ['corporate', 'technical', 'educational', 'justice-reform'] as const;
export const DEFAULT_CLAUDE_MODEL = 'claude-3-5-sonnet-20241022';
export const DEFAULT_MAX_TOKENS = 4096;
export const DEFAULT_TEMPERATURE = 0.7;