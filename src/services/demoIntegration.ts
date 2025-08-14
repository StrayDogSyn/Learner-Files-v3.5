import type { 
  DemoConfiguration, 
  DemoState, 
  DemoEvent, 
  DemoAnalytics, 
  CodeSandboxConfig, 
  APIPlaygroundConfig, 
  GameDemoConfig,
  TutorialState,
  PerformanceMetrics 
} from '../types/demo';

class DemoIntegrationService {
  private sessions: Map<string, DemoState> = new Map();
  private analytics: DemoAnalytics[] = [];
  private performanceObserver?: PerformanceObserver;

  constructor() {
    this.initializePerformanceObserver();
  }

  private initializePerformanceObserver(): void {
    if ('PerformanceObserver' in window) {
      this.performanceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'measure') {
            this.trackPerformanceMetric(entry.name, entry.duration);
          }
        }
      });
      this.performanceObserver.observe({ entryTypes: ['measure'] });
    }
  }

  private generateSessionId(): string {
    return `demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private trackPerformanceMetric(name: string, duration: number): void {
    // Track performance metrics for demos
    console.log(`Performance: ${name} - ${duration}ms`);
  }

  public createDemoSession(config: DemoConfiguration): string {
    const sessionId = this.generateSessionId();
    const initialState: DemoState = {
      isActive: false,
      configuration: {},
      codeVisible: config.codeVisible || false,
      fullscreen: config.fullscreen || false,
      theme: config.theme || 'auto',
      loading: true,
      analytics: {
        startTime: Date.now(),
        interactions: 0,
        errors: 0
      }
    };

    this.sessions.set(sessionId, initialState);
    this.trackEvent(sessionId, 'start', { config });
    
    return sessionId;
  }

  public startDemo(sessionId: string, preset?: any): void {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Demo session ${sessionId} not found`);
    }

    session.isActive = true;
    session.loading = false;
    session.currentPreset = preset;
    
    if (preset) {
      session.configuration = { ...preset.configuration };
      this.trackEvent(sessionId, 'preset_change', { preset });
    }

    this.trackEvent(sessionId, 'start', { preset });
  }

  public stopDemo(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    session.isActive = false;
    session.analytics.completionTime = Date.now();
    
    this.trackEvent(sessionId, 'complete', {
      duration: session.analytics.completionTime - session.analytics.startTime,
      interactions: session.analytics.interactions,
      errors: session.analytics.errors
    });

    // Save analytics
    this.saveAnalytics(sessionId);
  }

  public updateConfiguration(sessionId: string, config: Record<string, any>): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    session.configuration = { ...session.configuration, ...config };
    this.trackEvent(sessionId, 'configuration_change', { config });
  }

  public trackInteraction(sessionId: string, interaction: string, data?: Record<string, any>): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    session.analytics.interactions++;
    this.trackEvent(sessionId, 'interaction', { interaction, ...data });
  }

  public trackError(sessionId: string, error: string, context?: Record<string, any>): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    session.analytics.errors++;
    session.error = error;
    this.trackEvent(sessionId, 'error', { error, context });
  }

  private trackEvent(sessionId: string, type: DemoEvent['type'], data?: Record<string, any>): void {
    const event: DemoEvent = {
      type,
      timestamp: Date.now(),
      data,
      sessionId
    };

    console.log('Demo Event:', event);
    
    // In a real implementation, you'd send this to your analytics service
    // this.sendToAnalytics(event);
  }

  private saveAnalytics(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    const analytics: DemoAnalytics = {
      sessionId,
      projectId: session.currentPreset?.id || 'unknown',
      events: [], // Would be populated from actual event tracking
      metrics: this.getPerformanceMetrics(),
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
      duration: session.analytics.completionTime! - session.analytics.startTime
    };

    this.analytics.push(analytics);
    
    // Save to localStorage for persistence
    try {
      const existing = JSON.parse(localStorage.getItem('demo_analytics') || '[]');
      existing.push(analytics);
      localStorage.setItem('demo_analytics', JSON.stringify(existing.slice(-100))); // Keep last 100
    } catch (error) {
      console.error('Failed to save demo analytics:', error);
    }
  }

  private getPerformanceMetrics(): PerformanceMetrics {
    return {
      loadTime: performance.now(),
      renderTime: 0, // Would be calculated from actual render timing
      memoryUsage: (performance as any).memory?.usedJSHeapSize || 0,
      cpuUsage: 0, // Would require more sophisticated tracking
      networkRequests: 0, // Would be tracked from fetch/XHR
      errors: 0,
      userInteractions: 0
    };
  }

  // CodeSandbox Integration
  public async createCodeSandbox(config: CodeSandboxConfig): Promise<string> {
    try {
      const response = await fetch('https://codesandbox.io/api/v1/sandboxes/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          files: config.files,
          dependencies: config.dependencies,
          environment: config.environment,
          template: config.template
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create CodeSandbox');
      }

      const result = await response.json();
      return `https://codesandbox.io/s/${result.sandbox_id}`;
    } catch (error) {
      console.error('CodeSandbox creation failed:', error);
      throw error;
    }
  }

  // API Playground Integration
  public createAPIPlayground(config: APIPlaygroundConfig): string {
    // Create a self-contained API playground
    const playgroundHTML = this.generateAPIPlaygroundHTML(config);
    const blob = new Blob([playgroundHTML], { type: 'text/html' });
    return URL.createObjectURL(blob);
  }

  private generateAPIPlaygroundHTML(config: APIPlaygroundConfig): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>API Playground</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            .endpoint { border: 1px solid #ccc; margin: 10px 0; padding: 15px; }
            .method { font-weight: bold; color: #007bff; }
            .path { font-family: monospace; background: #f8f9fa; padding: 5px; }
            .response { background: #f8f9fa; padding: 10px; margin-top: 10px; }
          </style>
        </head>
        <body>
          <h1>API Playground</h1>
          ${config.endpoints.map(endpoint => `
            <div class="endpoint">
              <div class="method">${endpoint.method}</div>
              <div class="path">${endpoint.path}</div>
              <p>${endpoint.description}</p>
              <button onclick="testEndpoint('${endpoint.method}', '${endpoint.path}')">
                Test Endpoint
              </button>
              <div id="response-${endpoint.path.replace(/[^a-zA-Z0-9]/g, '-')}" class="response"></div>
            </div>
          `).join('')}
          <script>
            async function testEndpoint(method, path) {
              try {
                const response = await fetch(path, { method });
                const data = await response.json();
                document.getElementById('response-' + path.replace(/[^a-zA-Z0-9]/g, '-')).innerHTML = 
                  '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
              } catch (error) {
                console.error('API test failed:', error);
              }
            }
          </script>
        </body>
      </html>
    `;
  }

  // Game Demo Integration
  public createGameDemo(config: GameDemoConfig): void {
    // Initialize game-specific features
    if (config.scoreTracking) {
      this.initializeScoreTracking();
    }
    
    if (config.leaderboard) {
      this.initializeLeaderboard();
    }
    
    if (config.achievements) {
      this.initializeAchievements();
    }
    
    if (config.accessibility.highContrast) {
      this.enableHighContrast();
    }
    
    if (config.accessibility.reducedMotion) {
      this.enableReducedMotion();
    }
  }

  private initializeScoreTracking(): void {
    // Initialize score tracking system
    console.log('Score tracking initialized');
  }

  private initializeLeaderboard(): void {
    // Initialize leaderboard system
    console.log('Leaderboard initialized');
  }

  private initializeAchievements(): void {
    // Initialize achievements system
    console.log('Achievements initialized');
  }

  private enableHighContrast(): void {
    document.documentElement.style.setProperty('--high-contrast', 'true');
  }

  private enableReducedMotion(): void {
    document.documentElement.style.setProperty('--reduced-motion', 'true');
  }

  // Tutorial System
  public createTutorial(steps: any[]): TutorialState {
    return {
      isActive: false,
      currentStep: 0,
      steps: steps.map((step, index) => ({
        ...step,
        id: step.id || `step-${index}`,
        completed: false
      })),
      progress: 0,
      completed: false
    };
  }

  public startTutorial(tutorial: TutorialState): void {
    tutorial.isActive = true;
    tutorial.currentStep = 0;
    this.showTutorialStep(tutorial, 0);
  }

  public nextTutorialStep(tutorial: TutorialState): void {
    if (tutorial.currentStep < tutorial.steps.length - 1) {
      tutorial.steps[tutorial.currentStep].completed = true;
      tutorial.currentStep++;
      tutorial.progress = (tutorial.currentStep / tutorial.steps.length) * 100;
      this.showTutorialStep(tutorial, tutorial.currentStep);
    } else {
      this.completeTutorial(tutorial);
    }
  }

  private showTutorialStep(tutorial: TutorialState, stepIndex: number): void {
    const step = tutorial.steps[stepIndex];
    console.log(`Tutorial Step ${stepIndex + 1}: ${step.title}`);
    // In a real implementation, you'd show the tutorial overlay
  }

  private completeTutorial(tutorial: TutorialState): void {
    tutorial.isActive = false;
    tutorial.completed = true;
    tutorial.progress = 100;
    console.log('Tutorial completed!');
  }

  // Utility methods
  public getSession(sessionId: string): DemoState | undefined {
    return this.sessions.get(sessionId);
  }

  public getAllSessions(): Map<string, DemoState> {
    return this.sessions;
  }

  public getAnalytics(): DemoAnalytics[] {
    return this.analytics;
  }

  public clearSession(sessionId: string): void {
    this.sessions.delete(sessionId);
  }

  public clearAllSessions(): void {
    this.sessions.clear();
  }
}

export const demoIntegration = new DemoIntegrationService();
