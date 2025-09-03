// Core AI Types for StrayDog Syndications AI Ecosystem

export type DomainType = 'corporate' | 'technical' | 'business' | 'justice';
export type ContentType = 'case-study' | 'code' | 'analysis' | 'roi' | 'metrics';
export type UserRole = 'user' | 'corporate' | 'technical' | 'admin';
export type RateLimitTier = 'free' | 'corporate' | 'enterprise' | 'admin';

// Claude API Request/Response Interfaces
export interface ClaudeRequest {
  type: ContentType;
  context: Record<string, any>;
  domain: DomainType;
  userId?: string;
  sessionId?: string;
}

export interface ClaudeResponse {
  content: string;
  metadata: {
    tokensUsed: number;
    processingTime: number;
    confidence: number;
    model: string;
  };
  usage: {
    remaining: number;
    resetTime: string;
    tier: RateLimitTier;
  };
}

// Rate Limiting Configuration
export interface RateLimitConfig {
  tier: RateLimitTier;
  requestsPerHour: number;
  requestsPerDay: number;
  burstLimit: number;
  resetWindow: number;
}

// Context Management
export interface AIContext {
  sessionId: string;
  userId: string;
  domain: DomainType;
  userRole: UserRole;
  conversationHistory: ConversationEntry[];
  systemPrompt?: string;
  preferences?: {
    temperature?: number;
    maxTokens?: number;
    responseFormat?: string;
  };
  contextWindow?: ConversationEntry[];
  metadata?: {
    lastActivity?: Date;
    domain?: DomainType;
    requestCount?: number;
    totalTokens?: number;
    sessionId?: string;
    startTime?: Date;
    userId?: string;
    userRole?: UserRole;
    createdAt?: Date;
  };
}

export interface ConversationEntry {
  id?: string;
  timestamp: Date;
  type?: 'user' | 'assistant';
  role?: 'user' | 'assistant' | 'system';
  content: string;
  metadata?: Record<string, any>;
}

export interface SessionMetadata {
  sessionId: string;
  userId?: string;
  domain: DomainType;
  startTime: Date;
  lastActivity: Date;
  totalTokens: number;
}

// Analytics and Monitoring
export interface AIAnalyticsEvent {
  eventId: string;
  userId: string;
  userRole: UserRole;
  domain: DomainType;
  contentType: ContentType;
  success: boolean;
  timestamp: Date;
  tokensUsed?: number;
  error?: string;
  performance?: {
    responseTime: number;
    timestamp: Date;
  };
}

export interface SimplePerformanceData {
  responseTime: number;
  timestamp: Date;
}

export interface PerformanceMetrics {
  averageResponseTime: number;
  successRate: number;
  errorRate: number;
  tokensPerMinute: number;
  activeUsers: number;
  domainDistribution: Record<DomainType, number>;
  timestamp: Date;
  totalRequests: number;
  contentTypes: Map<ContentType, number>;
}

// Domain-Specific Configurations
export interface DomainConfig {
  name: DomainType;
  displayName: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
  };
  aiFeatures: string[];
  promptTemplates: Record<ContentType, string>;
  rateLimits: RateLimitConfig;
}

// Error Handling
export interface AIError {
  code: string;
  message: string;
  domain?: DomainType;
  timestamp: Date;
  context?: Record<string, any>;
}

// Service Response Wrapper
export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: AIError;
  metadata?: {
    requestId: string;
    timestamp: Date;
    processingTime: number;
  };
}

// Lead Qualification (Business Domain)
export interface LeadQualificationRequest {
  company: string;
  industry: string;
  companySize: string;
  budget: number;
  timeline: string;
  painPoints: string[];
  contactInfo: {
    name: string;
    role: string;
  };
}

export interface LeadQualificationResponse {
  score: number;
  status?: string;
  actions: string[];
  insights: string[];
  nextSteps: string[];
}

// Code Generation (Technical Domain)
export interface CodeGenerationRequest {
  language: string;
  framework?: string;
  description: string;
  style?: string;
}

export interface CodeGenerationResponse {
  code: string;
  language?: string;
  framework?: string;
  explanation: string;
  examples: string[];
  bestPractices: string[];
}

// ROI Analysis (Business Domain)
export interface ROIAnalysisRequest {
  investment: number;
  timeframe: number;
  expectedBenefits: string[];
  costs: string[];
  risks: string[];
}

export interface ROIAnalysisResponse {
  projectedROI: number;
  breakEvenPoint: number;
  costSavings: number;
  riskFactors: string[];
  recommendations: string[];
  roiPercentage?: number;
  paybackPeriod?: number;
  npv?: number;
  riskLevel?: string;
}

// Impact Metrics (Justice Domain)
export interface ImpactMetricsRequest {
  initiative: string;
  targetPopulation: string;
  expectedOutcomes: string[];
  timeframe: string;
  resources?: string[];
}

export interface ImpactMetricsResponse {
  outcomes: Record<string, number>;
  trends: Record<string, number[]>;
  insights: string[];
  recommendations: string[];
  confidence: number;
  impactScore?: number;
  affectedPopulation?: number;
  successProbability?: number;
  kpis?: string[];
  measurementStrategy?: string[];
}