import React, { useState } from 'react';
import { Card, Button } from '@straydog/ui-components';
import { useOrchestratorStore } from '@straydog/ai-orchestrator';
import { Send, Loader2, CheckCircle, XCircle } from 'lucide-react';

export const AITestPanel: React.FC = () => {
  const [testMessage, setTestMessage] = useState('Hello, can you help me understand justice reform?');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const { 
    currentDomain, 
    setDomain, 
    isInitialized,
    generateResponse 
  } = useOrchestratorStore();

  const handleTestRequest = async () => {
    if (!testMessage.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setResponse(null);
    
    try {
      const result = await generateResponse({
        domain: currentDomain || 'corporate',
        prompt: testMessage,
        userId: 'test-user'
      });
      
      setResponse(result.response || 'Response received successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const testDomains = [
    { key: 'corporate', label: 'Corporate' },
    { key: 'technical', label: 'Technical' },
    { key: 'educational', label: 'Educational' },
    { key: 'justice-reform', label: 'Justice Reform' }
  ] as const;

  return (
    <Card variant="glass" className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">AI Orchestration Test</h3>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${
            isInitialized ? 'bg-green-400' : 'bg-red-400'
          }`} />
          <span className="text-sm text-gray-300">
            {isInitialized ? 'Initialized' : 'Not Initialized'}
          </span>
        </div>
      </div>

      {/* Domain Selection */}
      <div className="space-y-2">
        <label className="text-sm text-gray-400">Current Domain:</label>
        <div className="flex space-x-2">
          {testDomains.map((domain) => (
            <Button
              key={domain.key}
              variant={currentDomain === domain.key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDomain(domain.key as any)}
              disabled={isLoading}
            >
              {domain.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Test Message Input */}
      <div className="space-y-2">
        <label className="text-sm text-gray-400">Test Message:</label>
        <textarea
          value={testMessage}
          onChange={(e) => setTestMessage(e.target.value)}
          className="w-full bg-slate-800 border border-slate-600 rounded-md px-3 py-2 text-white text-sm resize-none"
          rows={3}
          placeholder="Enter your test message..."
          disabled={isLoading}
        />
      </div>

      {/* Send Button */}
      <Button
        onClick={handleTestRequest}
        disabled={isLoading || !testMessage.trim() || !isInitialized}
        className="w-full flex items-center justify-center space-x-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Sending...</span>
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            <span>Send Test Request</span>
          </>
        )}
      </Button>

      {/* Response Display */}
      {response && (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <label className="text-sm text-green-400">Response:</label>
          </div>
          <div className="bg-slate-800 border border-slate-600 rounded-md p-3">
            <p className="text-white text-sm whitespace-pre-wrap">{response}</p>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <XCircle className="w-4 h-4 text-red-400" />
            <label className="text-sm text-red-400">Error:</label>
          </div>
          <div className="bg-red-900/20 border border-red-600 rounded-md p-3">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>• Select a domain to test domain-specific AI context</p>
        <p>• Enter a message and click "Send Test Request"</p>
        <p>• Monitor the response and any errors</p>
        <p>• Note: Actual Claude API integration requires API key configuration</p>
      </div>
    </Card>
  );
};