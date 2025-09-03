import React, { useState, useEffect } from 'react';
import { strayDogAI, DomainType, ContentType } from '../ai';
import {
  AIChat,
  AIDashboard,
  AIDomainSelector,
  AIStatusIndicator,
  AIMetricsDisplay,
  AIPromptBuilder
} from '../components/ai';

interface AISystemHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  services: Record<string, boolean>;
  timestamp: Date;
}

const AIDemo: React.FC = () => {
  const [selectedDomain, setSelectedDomain] = useState<DomainType>('corporate');
  const [systemHealth, setSystemHealth] = useState<AISystemHealth | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeAI();
  }, []);

  const initializeAI = async () => {
    try {
      setLoading(true);
      await strayDogAI.initialize();
      const health = await strayDogAI.healthCheck();
      setSystemHealth(health);
      setIsInitialized(true);
    } catch (error) {
      console.error('Failed to initialize AI system:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDomainChange = (domain: DomainType) => {
    setSelectedDomain(domain);
  };

  const handleGenerateContent = async (prompt: string, contentType: ContentType) => {
    try {
      const response = await strayDogAI.generateContent(
        selectedDomain,
        contentType,
        prompt,
        'demo-user',
        'user',
        'free'
      );
      
      if (response.success) {
        console.log('Generated content:', response.data);
        return response.data;
      } else {
        console.error('Content generation failed:', response.error);
        return null;
      }
    } catch (error) {
      console.error('Error generating content:', error);
      return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-400 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-green-400 mb-2">Initializing StrayDog AI</h2>
          <p className="text-green-300">Setting up the AI ecosystem...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-400 mb-2">
            StrayDog AI Ecosystem Demo
          </h1>
          <p className="text-green-300 text-lg">
            Multi-Domain AI Coordination System
          </p>
        </div>

        {/* System Status */}
        <div className="mb-8">
          <AIStatusIndicator 
            showDetails={true}
            autoRefresh={true}
            refreshInterval={30000}
          />
        </div>

        {/* Domain Selector */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-green-400 mb-4">Select AI Domain</h2>
          <AIDomainSelector
            selectedDomain={selectedDomain}
            onDomainChange={handleDomainChange}
            variant="grid"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* AI Chat Interface */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-green-400">AI Chat Interface</h2>
            <AIChat
              domain={selectedDomain}
              userId="demo-user"
              userRole="user"
              tier="free"

            />
          </div>

          {/* Prompt Builder */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-green-400">Prompt Builder</h2>
            <AIPromptBuilder
              domain={selectedDomain}
              onPromptGenerated={(prompt) => {
                console.log('Generated prompt:', prompt);
              }}
            />
          </div>
        </div>

        {/* Analytics Dashboard */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-green-400 mb-4">Analytics Dashboard</h2>
          <AIDashboard userId="demo-user" />
        </div>

        {/* Metrics Display */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-green-400 mb-4">Usage Metrics</h2>
          <AIMetricsDisplay
              timeRange="7d"
              autoRefresh={true}
            />
        </div>

        {/* System Information */}
        {systemHealth && (
          <div className="bg-black/20 backdrop-blur-md rounded-xl border border-green-500/30 p-6">
            <h2 className="text-2xl font-bold text-green-400 mb-4">System Health</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className={`text-3xl font-bold mb-2 ${
                  systemHealth.status === 'healthy' ? 'text-green-400' :
                  systemHealth.status === 'degraded' ? 'text-yellow-400' :
                  'text-red-400'
                }`}>
                  {systemHealth.status.toUpperCase()}
                </div>
                <p className="text-green-300">Overall Status</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {Object.values(systemHealth.services).filter(Boolean).length}
                </div>
                <p className="text-green-300">Services Online</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {Object.keys(systemHealth.services).length}
                </div>
                <p className="text-green-300">Total Services</p>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-green-400 mb-3">Service Status</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {Object.entries(systemHealth.services).map(([service, status]) => (
                  <div key={service} className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${
                      status ? 'bg-green-400' : 'bg-red-400'
                    }`}></div>
                    <span className="text-green-300 text-sm">{service}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIDemo;