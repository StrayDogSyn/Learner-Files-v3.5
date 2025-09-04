import { useCallback } from 'react';
import { useOrchestratorStore } from '../store';
import { DomainType } from '../types';

/**
 * Hook that provides a simplified interface for AI orchestration
 * Compatible with existing usage patterns in applications
 */
export const useAIOrchestrator = () => {
  const { generateResponse: storeGenerateResponse, isLoading, error, isInitialized } = useOrchestratorStore();

  const generateResponse = useCallback(async (prompt: string, domain: DomainType, userId?: string) => {
    if (!isInitialized) {
      throw new Error('AI Orchestrator not initialized');
    }

    const request = {
      prompt,
      domain,
      userId: userId || 'anonymous',
      timestamp: Date.now()
    };

    return await storeGenerateResponse(request);
  }, [storeGenerateResponse, isInitialized]);

  return {
    generateResponse,
    isLoading,
    error,
    isInitialized
  };
};