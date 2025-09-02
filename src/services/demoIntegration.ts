import {
  DemoConfiguration,
  DemoState,
  DemoPreset,
  DemoAnalytics,
  DemoIntegrationService,
  createDefaultDemoState,
  TutorialState,
  TutorialStep,
  DemoInteraction
} from '../types/demo';

class DemoIntegrationServiceImpl implements DemoIntegrationService {
  private sessions: Map<string, DemoState> = new Map();
  private analytics: Map<string, DemoAnalytics> = new Map();

  async createDemoSession(config: DemoConfiguration): Promise<string> {
    const sessionId = `session_${Date.now()}`;
    const initialState = createDefaultDemoState();
    this.sessions.set(sessionId, {
      ...initialState,
      id: sessionId
    });
    return sessionId;
  }

  async getSession(sessionId: string): Promise<DemoState | null> {
    return this.sessions.get(sessionId) || null;
  }

  async startDemo(sessionId: string, preset?: DemoPreset): Promise<void> {
    const session = await this.getSession(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    session.isActive = true;
    session.startTime = new Date();
    
    if (preset) {
      session.currentPreset = preset;
    }

    // demoIntegration.trackInteraction(sessionId, 'demo_started');
    // demoIntegration.trackInteraction(sessionId, 'preset_selected');
  }

  async stopDemo(sessionId: string): Promise<void> {
    const session = await this.getSession(sessionId);
    if (session) {
      session.isActive = false;
      session.endTime = new Date();
    }
  }

  pauseDemo(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    session.status = 'paused';
    this.sessions.set(sessionId, session);
    // this.trackInteraction(sessionId, { type: 'demo_pause', timestamp: new Date(), data: {} });
  }

  resumeDemo(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    session.status = 'active';
    this.sessions.set(sessionId, session);
    // this.trackInteraction(sessionId, { type: 'demo_resume', timestamp: new Date(), data: {} });
  }

  updateDemoState(sessionId: string, updates: Partial<DemoState>): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    Object.assign(session, updates);
    this.sessions.set(sessionId, session);
  }

  getAnalytics(sessionId: string): DemoAnalytics {
    const session = this.sessions.get(sessionId);
    return session?.analytics || {
      views: 0,
      interactions: 0,
      completions: 0,
      averageTime: 0,
      userFeedback: [],
      performanceMetrics: {
        loadTime: 0,
        responseTime: 0,
        errorRate: 0
      }
    };
  }

  async trackInteraction(sessionId: string, interaction: DemoInteraction): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.analytics.interactions++;
      // Store interaction details if needed
    }
  }

  async createTutorial(config: DemoConfiguration): Promise<TutorialState> {
    const tutorialId = `tutorial_${Date.now()}`;
    const tutorial: TutorialState = {
      id: tutorialId,
      currentStep: 0,
      totalSteps: 5,
      isActive: false,
      completed: false,
      steps: [
        {
          id: 'step1',
          title: 'Welcome',
          description: 'Welcome to the tutorial',
          target: '.demo-container',
          position: 'bottom'
        }
      ]
    };
    return tutorial;
  }

  async startTutorial(tutorialId: string): Promise<TutorialState> {
    // Implementation for starting tutorial
    console.log(`Starting tutorial: ${tutorialId}`);
    return {
      id: tutorialId,
      currentStep: 0,
      totalSteps: 5,
      isActive: true,
      completed: false,
      steps: []
    };
  }

  async nextTutorialStep(tutorialId: string): Promise<TutorialStep | null> {
    // Implementation for next tutorial step
    return null;
  }

  async createCodeSandbox(config: any): Promise<string> {
    // Implementation for creating CodeSandbox
    return `https://codesandbox.io/s/demo-${Date.now()}`;
  }

  async updateConfiguration(sessionId: string, config: any): Promise<void> {
    // Implementation for updating configuration
    console.log(`Updating configuration for session: ${sessionId}`, config);
  }

  async createAPIPlayground(config: DemoConfiguration): Promise<string> {
    // Create API playground URL
    console.log('Creating API playground:', config);
    return `https://api-playground.example.com/${config.id}`;
  }

  createGameDemo(config: any): void {
    // Game demo creation logic
    console.log('Creating game demo with config:', config);
  }

  // Utility methods
  getAllSessions(): DemoState[] {
    return Array.from(this.sessions.values());
  }

  getActiveSessionsCount(): number {
    return Array.from(this.sessions.values()).filter(session => session.isActive).length;
  }

  clearSession(sessionId: string): void {
    this.sessions.delete(sessionId);
    this.analytics.delete(sessionId);
  }

  clearAllSessions(): void {
    this.sessions.clear();
    this.analytics.clear();
  }
}

// Export singleton instance
export const demoIntegration = new DemoIntegrationServiceImpl();

// Export class for testing
export { DemoIntegrationServiceImpl };