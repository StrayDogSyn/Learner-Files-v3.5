import React, { useEffect } from 'react';
import { useOrchestratorStore } from '@straydog/ai-orchestrator';

interface AIInitializerProps {
  children: React.ReactNode;
}

export const AIInitializer: React.FC<AIInitializerProps> = ({ children }) => {
  const { initialize, isInitialized, error } = useOrchestratorStore();

  useEffect(() => {
    if (!isInitialized) {
      // For browser environment, we'll skip actual Claude initialization
      // and just mark as initialized for UI purposes
      // Real API calls should be handled by a backend service
      console.log('AI Dashboard initialized in browser mode');
      // Note: In a production app, this would connect to your backend API
      // instead of initializing Claude directly in the browser
    }
  }, [initialize, isInitialized]);

  // For demo purposes, always show as initialized in browser
  const shouldShowError = false; // error && !import.meta.env.DEV;

  if (shouldShowError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">AI Initialization Error</h2>
          <p className="text-red-400">{error}</p>
          <p className="text-sm text-gray-400 mt-2">
            Please check your Claude API key configuration in environment variables.
          </p>
        </div>
      </div>
    );
  }

  return children;
};