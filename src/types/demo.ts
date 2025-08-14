export interface DemoConfiguration {
  projectId: string;
  demoType: 'iframe' | 'component' | 'sandbox' | 'api-playground' | 'game';
  height: string;
  interactive: boolean;
  codeVisible: boolean;
  configurable: boolean;
  presets?: DemoPreset[];
  embedUrl?: string;
  theme?: 'light' | 'dark' | 'auto';
  responsive?: boolean;
  fullscreen?: boolean;
  analytics?: boolean;
}

export interface DemoPreset {
  id: string;
  name: string;
  description: string;
  configuration: Record<string, any>;
  code?: string;
  thumbnail?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime?: string;
  tags?: string[];
}

export interface DemoState {
  isActive: boolean;
  currentPreset?: DemoPreset;
  configuration: Record<string, any>;
  codeVisible: boolean;
  fullscreen: boolean;
  theme: 'light' | 'dark' | 'auto';
  loading: boolean;
  error?: string;
  analytics: {
    startTime: number;
    interactions: number;
    errors: number;
    completionTime?: number;
  };
}

export interface DemoEvent {
  type: 'start' | 'interaction' | 'error' | 'complete' | 'preset_change' | 'configuration_change';
  timestamp: number;
  data?: Record<string, any>;
  userId?: string;
  sessionId?: string;
}

export interface CodeSandboxConfig {
  files: Record<string, { content: string; language: string }>;
  dependencies: Record<string, string>;
  environment: 'create-react-app' | 'vue' | 'vanilla' | 'node';
  template?: string;
}

export interface APIPlaygroundConfig {
  endpoints: APIEndpoint[];
  authentication?: AuthConfig;
  rateLimiting?: RateLimitConfig;
  documentation?: string;
}

export interface APIEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description: string;
  parameters?: APIParameter[];
  response?: APIResponse;
  examples?: APIExample[];
}

export interface APIParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required: boolean;
  description: string;
  defaultValue?: any;
}

export interface APIResponse {
  status: number;
  contentType: string;
  schema: Record<string, any>;
  examples: Record<string, any>[];
}

export interface APIExample {
  name: string;
  request: Record<string, any>;
  response: Record<string, any>;
  description: string;
}

export interface AuthConfig {
  type: 'bearer' | 'api-key' | 'oauth2' | 'basic';
  token?: string;
  header?: string;
  url?: string;
}

export interface RateLimitConfig {
  requests: number;
  window: number;
  remaining?: number;
  reset?: number;
}

export interface GameDemoConfig {
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  timeLimit?: number;
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

export interface TutorialStep {
  id: string;
  title: string;
  content: string;
  target?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  action?: 'click' | 'type' | 'scroll' | 'wait';
  code?: string;
  completed: boolean;
}

export interface TutorialState {
  isActive: boolean;
  currentStep: number;
  steps: TutorialStep[];
  progress: number;
  completed: boolean;
}

export interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage: number;
  cpuUsage: number;
  networkRequests: number;
  errors: number;
  userInteractions: number;
}

export interface DemoAnalytics {
  sessionId: string;
  projectId: string;
  events: DemoEvent[];
  metrics: PerformanceMetrics;
  userAgent: string;
  timestamp: number;
  duration: number;
}
