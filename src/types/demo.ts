// Demo Configuration Types
export interface DemoConfiguration {
  id: string;
  name: string;
  description: string;
  demoType: 'iframe' | 'interactive' | 'video' | 'static' | 'game' | 'component' | 'api-playground' | 'sandbox';
  embedUrl?: string;
  height?: string;
  width?: string;
  codeVisible?: boolean;
  analyticsEnabled?: boolean;
  tutorialEnabled?: boolean;
  presets?: DemoPreset[];
  features?: string[];
  difficulty?: 'easy' | 'medium' | 'hard' | 'expert';
  timeLimit?: number;
  githubRepo?: string;
  projectId?: string;
  steps?: TutorialStep[];
  endpoints?: any[];
}

export interface DemoState {
  id: string;
  sessionId: string;
  isActive: boolean;
  startTime: Date;
  endTime?: Date;
  currentPreset?: DemoPreset;
  analytics: DemoAnalytics;
  interactions: DemoInteraction[];
  status: 'idle' | 'loading' | 'active' | 'paused' | 'completed' | 'error';
}

export interface DemoPreset {
  id: string;
  name: string;
  description: string;
  configuration: {
    difficulty?: 'easy' | 'medium' | 'hard' | 'expert';
    timeLimit?: number;
    features?: string[];
    theme?: string;
    [key: string]: any;
  };
  code?: string;
}

export interface DemoAnalytics {
  views: number;
  interactions: number;
  completions: number;
  averageTime: number;
  completionTime?: number;
  startTime?: number;
  errors?: number;
  userFeedback: DemoFeedback[];
  performanceMetrics: {
    loadTime: number;
    responseTime: number;
    errorRate: number;
  };
}

export interface DemoInteraction {
  id: string;
  type: string;
  timestamp: Date;
  data: any;
  userId?: string;
}

export interface DemoFeedback {
  id: string;
  rating: number;
  comment?: string;
  timestamp: Date;
  userId?: string;
}

export interface GameDemoConfig {
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  scoreTracking: boolean;
  leaderboard: boolean;
  achievements: boolean;
  tutorial: boolean;
  sound: boolean;
  accessibility: {
    highContrast: boolean;
    reducedMotion: boolean;
    screenReader: boolean;
  };
}

// Demo Integration Service Types (temporarily disabled)
// export interface DemoIntegrationService {
//   createDemoSession(config: DemoConfiguration): Promise<string>;
//   getSession(sessionId: string): Promise<DemoState | null>;
//   startDemo(sessionId: string, preset?: DemoPreset): Promise<void>;
//   stopDemo(sessionId: string): Promise<void>;
//   pauseDemo(sessionId: string): void;
//   resumeDemo(sessionId: string): void;
//   updateDemoState(sessionId: string, updates: Partial<DemoState>): void;
//   getAnalytics(sessionId: string): DemoAnalytics;
//   trackInteraction(sessionId: string, interaction: DemoInteraction): Promise<void>;
//   createTutorial(config: DemoConfiguration): Promise<TutorialState>;
//   startTutorial(tutorialId: string): Promise<TutorialState>;
//   nextTutorialStep(tutorialId: string): Promise<TutorialStep | null>;
//   createGameDemo(config: GameDemoConfig): void;
//   createCodeSandbox(config: any): Promise<string>;
//   updateConfiguration(sessionId: string, config: any): Promise<void>;
//   createAPIPlayground(config: DemoConfiguration): Promise<string>;
// }

// Tutorial Types
export interface TutorialStep {
  id: string;
  title: string;
  description: string;
  content?: string;
  target?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  action?: 'click' | 'hover' | 'input' | 'wait';
  nextStep?: string;
}

export interface TutorialState {
  id: string;
  currentStep: number;
  totalSteps: number;
  isActive: boolean;
  completed: boolean;
  steps: TutorialStep[];
}

// Default configurations
export const createDefaultDemoConfiguration = (): DemoConfiguration => ({
  id: '',
  name: '',
  description: '',
  demoType: 'interactive',
  height: '400px',
  width: '100%',
  codeVisible: false,
  analyticsEnabled: true,
  tutorialEnabled: true,
  features: [],
  difficulty: 'medium',
  timeLimit: 60
});

export const createDefaultDemoState = (): DemoState => ({
  id: '',
  sessionId: '',
  isActive: false,
  startTime: new Date(),
  analytics: {
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
  },
  interactions: [],
  status: 'idle'
});