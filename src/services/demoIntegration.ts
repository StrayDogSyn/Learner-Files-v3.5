// Demo integration service for interactive components

export interface DemoConfig {
  id: string;
  title: string;
  description: string;
  type: 'interactive' | 'showcase' | 'game';
  enabled: boolean;
  url?: string;
}

export interface DemoResult {
  success: boolean;
  data?: any;
  error?: string;
}

export class DemoIntegrationService {
  private demos: Map<string, DemoConfig> = new Map();

  constructor() {
    this.initializeDemos();
  }

  private initializeDemos() {
    const defaultDemos: DemoConfig[] = [
      {
        id: 'marvel-quiz',
        title: 'Marvel Quiz Game',
        description: 'Interactive Marvel character quiz with 3D effects',
        type: 'game',
        enabled: true,
        url: '/marvel-quiz'
      },
      {
        id: 'coordination-dashboard',
        title: 'Coordination Dashboard',
        description: 'Multi-domain coordination system analytics',
        type: 'showcase',
        enabled: true,
        url: '/coordination'
      }
    ];

    defaultDemos.forEach(demo => {
      this.demos.set(demo.id, demo);
    });
  }

  async runDemo(demoId: string, params?: any): Promise<DemoResult> {
    const demo = this.demos.get(demoId);
    
    if (!demo) {
      return {
        success: false,
        error: `Demo '${demoId}' not found`
      };
    }

    if (!demo.enabled) {
      return {
        success: false,
        error: `Demo '${demoId}' is disabled`
      };
    }

    try {
      // Simulate demo execution
      console.log(`Running demo: ${demo.title}`, params);
      
      return {
        success: true,
        data: {
          demoId,
          title: demo.title,
          type: demo.type,
          url: demo.url,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  getDemoConfig(demoId: string): DemoConfig | undefined {
    return this.demos.get(demoId);
  }

  getAllDemos(): DemoConfig[] {
    return Array.from(this.demos.values());
  }

  getEnabledDemos(): DemoConfig[] {
    return this.getAllDemos().filter(demo => demo.enabled);
  }
}

export const demoIntegration = new DemoIntegrationService();

export default demoIntegration;