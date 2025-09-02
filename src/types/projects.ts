export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  github?: string;
  demo?: string;
  category: string;
  featured?: boolean;
  status: 'completed' | 'in-progress' | 'planned';
  startDate: string;
  endDate?: string;
  tags?: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  teamSize?: number;
  role?: string;
  highlights?: string[];
  challenges?: string[];
  learnings?: string[];
  metrics?: ProjectMetrics;
  screenshots?: string[];
  videos?: string[];
  documentation?: string;
  license?: string;
  contributors?: Contributor[];
  dependencies?: Dependency[];
  deployment?: DeploymentInfo;
  lastUpdated?: string;
}

export interface ProjectMetrics {
  linesOfCode?: number;
  commits?: number;
  contributors?: number;
  stars?: number;
  forks?: number;
  issues?: number;
  pullRequests?: number;
  downloads?: number;
  views?: number;
  likes?: number;
  shares?: number;
  comments?: number;
  performance?: PerformanceMetrics;
  codeQuality?: CodeQualityMetrics;
  testCoverage?: number;
  buildTime?: number;
  bundleSize?: number;
}

export interface PerformanceMetrics {
  loadTime?: number;
  firstContentfulPaint?: number;
  largestContentfulPaint?: number;
  cumulativeLayoutShift?: number;
  firstInputDelay?: number;
  timeToInteractive?: number;
  speedIndex?: number;
  lighthouse?: LighthouseScores;
}

export interface LighthouseScores {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  pwa?: number;
}

export interface CodeQualityMetrics {
  maintainabilityIndex?: number;
  cyclomaticComplexity?: number;
  cognitiveComplexity?: number;
  technicalDebt?: number;
  duplicatedLines?: number;
  codeSmells?: number;
  bugs?: number;
  vulnerabilities?: number;
  securityHotspots?: number;
  reliability?: 'A' | 'B' | 'C' | 'D' | 'E';
  security?: 'A' | 'B' | 'C' | 'D' | 'E';
  maintainability?: 'A' | 'B' | 'C' | 'D' | 'E';
}

export interface Contributor {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  role: string;
  contributions: number;
  github?: string;
  linkedin?: string;
}

export interface Dependency {
  name: string;
  version: string;
  type: 'production' | 'development' | 'peer' | 'optional';
  description?: string;
  license?: string;
  size?: number;
  vulnerabilities?: number;
  outdated?: boolean;
  alternatives?: string[];
}

export interface DeploymentInfo {
  platform: string;
  url?: string;
  status: 'deployed' | 'deploying' | 'failed' | 'stopped';
  lastDeployment?: string;
  deploymentTime?: number;
  environment: 'production' | 'staging' | 'development';
  version?: string;
  branch?: string;
  commit?: string;
  buildLogs?: string;
  monitoring?: MonitoringInfo;
}

export interface MonitoringInfo {
  uptime?: number;
  responseTime?: number;
  errorRate?: number;
  throughput?: number;
  alerts?: Alert[];
  logs?: LogEntry[];
}

export interface Alert {
  id: string;
  type: 'error' | 'warning' | 'info';
  message: string;
  timestamp: string;
  resolved?: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface LogEntry {
  id: string;
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  timestamp: string;
  source?: string;
  metadata?: Record<string, any>;
}

// Enhanced project with AI analysis
export interface EnhancedProject extends Project {
  analysis?: ProjectAnalysis;
  aiInsights?: AIInsights;
  recommendations?: Recommendation[];
  similarProjects?: SimilarProject[];
  trendingScore?: number;
  searchRelevance?: number;
  userEngagement?: EngagementMetrics;
}

export interface ProjectAnalysis {
  complexity: ComplexityAnalysis;
  architecture: ArchitectureAnalysis;
  performance: PerformanceAnalysis;
  security: SecurityAnalysis;
  maintainability: MaintainabilityAnalysis;
  scalability: ScalabilityAnalysis;
  innovation: InnovationAnalysis;
  marketFit: MarketFitAnalysis;
  technicalDebt: TechnicalDebtAnalysis;
  documentation: DocumentationAnalysis;
  testing: TestingAnalysis;
  cicd: CICDAnalysis;
}

export interface ComplexityAnalysis {
  overall: 'low' | 'medium' | 'high' | 'very-high';
  algorithmic: number;
  structural: number;
  cognitive: number;
  cyclomatic: number;
  halstead: HalsteadMetrics;
  maintainabilityIndex: number;
  technicalComplexity: number;
  businessComplexity: number;
}

export interface HalsteadMetrics {
  vocabulary: number;
  length: number;
  calculatedLength: number;
  volume: number;
  difficulty: number;
  effort: number;
  timeToProgram: number;
  bugsDelivered: number;
}

export interface ArchitectureAnalysis {
  pattern: string;
  layering: 'monolithic' | 'layered' | 'microservices' | 'serverless';
  coupling: 'tight' | 'loose' | 'decoupled';
  cohesion: 'low' | 'medium' | 'high';
  modularity: number;
  separation: number;
  abstraction: number;
  encapsulation: number;
  inheritance: number;
  polymorphism: number;
  designPatterns: string[];
  antiPatterns: string[];
  architecturalSmells: string[];
}

export interface PerformanceAnalysis {
  overall: 'poor' | 'fair' | 'good' | 'excellent';
  runtime: RuntimePerformance;
  memory: MemoryPerformance;
  network: NetworkPerformance;
  storage: StoragePerformance;
  rendering: RenderingPerformance;
  optimization: OptimizationAnalysis;
  bottlenecks: Bottleneck[];
  recommendations: PerformanceRecommendation[];
}

export interface RuntimePerformance {
  executionTime: number;
  cpuUsage: number;
  throughput: number;
  latency: number;
  concurrency: number;
  scalability: number;
}

export interface MemoryPerformance {
  usage: number;
  leaks: number;
  allocation: number;
  deallocation: number;
  fragmentation: number;
  efficiency: number;
}

export interface NetworkPerformance {
  bandwidth: number;
  latency: number;
  throughput: number;
  requests: number;
  caching: number;
  compression: number;
}

export interface StoragePerformance {
  readSpeed: number;
  writeSpeed: number;
  iops: number;
  caching: number;
  indexing: number;
  optimization: number;
}

export interface RenderingPerformance {
  fps: number;
  frameTime: number;
  paintTime: number;
  layoutTime: number;
  scriptTime: number;
  renderBlocking: number;
}

export interface OptimizationAnalysis {
  codeOptimization: number;
  assetOptimization: number;
  bundleOptimization: number;
  imageOptimization: number;
  cacheOptimization: number;
  compressionOptimization: number;
}

export interface Bottleneck {
  type: 'cpu' | 'memory' | 'network' | 'storage' | 'rendering';
  location: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  impact: number;
  description: string;
  solution?: string;
}

export interface PerformanceRecommendation {
  type: 'optimization' | 'refactoring' | 'infrastructure' | 'architecture';
  priority: 'low' | 'medium' | 'high' | 'critical';
  effort: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  description: string;
  implementation: string;
  resources?: string[];
}

export interface SecurityAnalysis {
  overall: 'poor' | 'fair' | 'good' | 'excellent';
  vulnerabilities: Vulnerability[];
  authentication: SecurityAspect;
  authorization: SecurityAspect;
  dataProtection: SecurityAspect;
  inputValidation: SecurityAspect;
  outputEncoding: SecurityAspect;
  sessionManagement: SecurityAspect;
  cryptography: SecurityAspect;
  errorHandling: SecurityAspect;
  logging: SecurityAspect;
  compliance: ComplianceAnalysis;
}

export interface Vulnerability {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  location: string;
  cwe?: string;
  cvss?: number;
  exploitability: number;
  impact: number;
  remediation: string;
  references?: string[];
}

export interface SecurityAspect {
  score: number;
  issues: string[];
  recommendations: string[];
  bestPractices: string[];
}

export interface ComplianceAnalysis {
  gdpr: boolean;
  hipaa: boolean;
  sox: boolean;
  pci: boolean;
  iso27001: boolean;
  owasp: number;
  nist: number;
}

export interface MaintainabilityAnalysis {
  overall: 'poor' | 'fair' | 'good' | 'excellent';
  readability: number;
  modularity: number;
  testability: number;
  reusability: number;
  flexibility: number;
  understandability: number;
  modifiability: number;
  analyzability: number;
  stability: number;
  changeability: number;
  codeSmells: CodeSmell[];
  refactoringOpportunities: RefactoringOpportunity[];
}

export interface CodeSmell {
  type: string;
  severity: 'minor' | 'major' | 'critical';
  location: string;
  description: string;
  impact: string;
  solution: string;
  effort: 'low' | 'medium' | 'high';
}

export interface RefactoringOpportunity {
  type: string;
  priority: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
  benefit: 'low' | 'medium' | 'high';
  description: string;
  approach: string;
  risks: string[];
}

export interface ScalabilityAnalysis {
  overall: 'poor' | 'fair' | 'good' | 'excellent';
  horizontal: number;
  vertical: number;
  performance: number;
  capacity: number;
  elasticity: number;
  efficiency: number;
  bottlenecks: ScalabilityBottleneck[];
  recommendations: ScalabilityRecommendation[];
}

export interface ScalabilityBottleneck {
  component: string;
  type: 'cpu' | 'memory' | 'network' | 'storage' | 'database';
  threshold: number;
  impact: 'low' | 'medium' | 'high' | 'critical';
  solution: string;
}

export interface ScalabilityRecommendation {
  type: 'architecture' | 'infrastructure' | 'optimization' | 'caching';
  priority: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  description: string;
  implementation: string;
}

export interface InnovationAnalysis {
  overall: 'low' | 'medium' | 'high' | 'breakthrough';
  novelty: number;
  creativity: number;
  uniqueness: number;
  marketPotential: number;
  technicalAdvancement: number;
  problemSolving: number;
  userValue: number;
  competitiveAdvantage: number;
  disruptivePotential: number;
  adoptionPotential: number;
  innovationAreas: InnovationArea[];
}

export interface InnovationArea {
  area: string;
  score: number;
  description: string;
  examples: string[];
  potential: string;
}

export interface MarketFitAnalysis {
  overall: 'poor' | 'fair' | 'good' | 'excellent';
  problemSolution: number;
  targetMarket: number;
  competition: number;
  differentiation: number;
  valueProposition: number;
  userNeed: number;
  marketSize: number;
  timing: number;
  feasibility: number;
  viability: number;
  insights: MarketInsight[];
}

export interface MarketInsight {
  type: 'opportunity' | 'threat' | 'strength' | 'weakness';
  description: string;
  impact: 'low' | 'medium' | 'high';
  confidence: number;
  source: string;
}

export interface TechnicalDebtAnalysis {
  overall: 'low' | 'medium' | 'high' | 'critical';
  codeDebt: number;
  architecturalDebt: number;
  documentationDebt: number;
  testDebt: number;
  infrastructureDebt: number;
  designDebt: number;
  totalDebt: number;
  interestRate: number;
  payoffTime: number;
  debtItems: DebtItem[];
  payoffStrategy: PayoffStrategy;
}

export interface DebtItem {
  type: 'code' | 'architecture' | 'documentation' | 'test' | 'infrastructure' | 'design';
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: string;
  description: string;
  impact: string;
  effort: number;
  interest: number;
  priority: number;
}

export interface PayoffStrategy {
  approach: 'incremental' | 'focused' | 'comprehensive';
  timeline: string;
  phases: PayoffPhase[];
  totalEffort: number;
  expectedBenefit: string;
}

export interface PayoffPhase {
  name: string;
  duration: string;
  effort: number;
  items: string[];
  benefit: string;
}

export interface DocumentationAnalysis {
  overall: 'poor' | 'fair' | 'good' | 'excellent';
  coverage: number;
  quality: number;
  accuracy: number;
  completeness: number;
  clarity: number;
  organization: number;
  accessibility: number;
  maintenance: number;
  types: DocumentationType[];
  gaps: DocumentationGap[];
  recommendations: DocumentationRecommendation[];
}

export interface DocumentationType {
  type: 'api' | 'user' | 'developer' | 'architecture' | 'deployment' | 'troubleshooting';
  exists: boolean;
  quality: number;
  lastUpdated?: string;
  issues: string[];
}

export interface DocumentationGap {
  type: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  impact: string;
  effort: 'low' | 'medium' | 'high';
}

export interface DocumentationRecommendation {
  type: 'creation' | 'improvement' | 'organization' | 'automation';
  priority: 'low' | 'medium' | 'high';
  description: string;
  benefit: string;
  effort: 'low' | 'medium' | 'high';
}

export interface TestingAnalysis {
  overall: 'poor' | 'fair' | 'good' | 'excellent';
  coverage: TestCoverage;
  quality: TestQuality;
  automation: TestAutomation;
  types: TestType[];
  frameworks: TestFramework[];
  gaps: TestGap[];
  recommendations: TestRecommendation[];
}

export interface TestCoverage {
  overall: number;
  unit: number;
  integration: number;
  e2e: number;
  functional: number;
  performance: number;
  security: number;
  accessibility: number;
}

export interface TestQuality {
  maintainability: number;
  reliability: number;
  readability: number;
  effectiveness: number;
  efficiency: number;
  independence: number;
  repeatability: number;
  traceability: number;
}

export interface TestAutomation {
  level: number;
  ciIntegration: boolean;
  parallelization: boolean;
  reporting: boolean;
  maintenance: number;
  reliability: number;
  speed: number;
  coverage: number;
}

export interface TestType {
  type: 'unit' | 'integration' | 'e2e' | 'functional' | 'performance' | 'security' | 'accessibility';
  implemented: boolean;
  coverage: number;
  quality: number;
  automation: number;
  issues: string[];
}

export interface TestFramework {
  name: string;
  type: 'unit' | 'integration' | 'e2e' | 'performance' | 'security';
  version: string;
  usage: number;
  effectiveness: number;
  maintenance: number;
}

export interface TestGap {
  type: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  impact: string;
  effort: 'low' | 'medium' | 'high';
}

export interface TestRecommendation {
  type: 'coverage' | 'quality' | 'automation' | 'framework' | 'strategy';
  priority: 'low' | 'medium' | 'high';
  description: string;
  benefit: string;
  effort: 'low' | 'medium' | 'high';
  implementation: string;
}

export interface CICDAnalysis {
  overall: 'poor' | 'fair' | 'good' | 'excellent';
  automation: CICDAutomation;
  pipeline: PipelineAnalysis;
  deployment: DeploymentAnalysis;
  monitoring: MonitoringAnalysis;
  security: CICDSecurity;
  performance: CICDPerformance;
  reliability: CICDReliability;
  recommendations: CICDRecommendation[];
}

export interface CICDAutomation {
  level: number;
  build: boolean;
  test: boolean;
  deploy: boolean;
  rollback: boolean;
  monitoring: boolean;
  notifications: boolean;
  approval: boolean;
  compliance: boolean;
}

export interface PipelineAnalysis {
  stages: PipelineStage[];
  parallelization: number;
  optimization: number;
  maintainability: number;
  visibility: number;
  errorHandling: number;
  recovery: number;
}

export interface PipelineStage {
  name: string;
  type: 'build' | 'test' | 'deploy' | 'security' | 'quality' | 'approval';
  duration: number;
  successRate: number;
  automation: number;
  dependencies: string[];
  bottlenecks: string[];
}

export interface DeploymentAnalysis {
  strategy: 'blue-green' | 'rolling' | 'canary' | 'recreate';
  frequency: number;
  reliability: number;
  rollbackTime: number;
  downtime: number;
  automation: number;
  environments: DeploymentEnvironment[];
}

export interface DeploymentEnvironment {
  name: string;
  type: 'development' | 'staging' | 'production';
  automation: number;
  monitoring: number;
  security: number;
  compliance: number;
}

export interface MonitoringAnalysis {
  coverage: number;
  alerting: number;
  logging: number;
  metrics: number;
  tracing: number;
  dashboards: number;
  automation: number;
  responsiveness: number;
}

export interface CICDSecurity {
  scanning: boolean;
  secrets: boolean;
  compliance: boolean;
  access: boolean;
  audit: boolean;
  encryption: boolean;
  isolation: boolean;
  validation: boolean;
}

export interface CICDPerformance {
  buildTime: number;
  deployTime: number;
  testTime: number;
  queueTime: number;
  parallelization: number;
  caching: number;
  optimization: number;
  scalability: number;
}

export interface CICDReliability {
  uptime: number;
  successRate: number;
  mttr: number;
  mtbf: number;
  errorRate: number;
  recovery: number;
  resilience: number;
  stability: number;
}

export interface CICDRecommendation {
  type: 'automation' | 'performance' | 'security' | 'reliability' | 'monitoring';
  priority: 'low' | 'medium' | 'high';
  description: string;
  benefit: string;
  effort: 'low' | 'medium' | 'high';
  implementation: string;
}

export interface AIInsights {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  keyFindings: KeyFinding[];
  predictions: Prediction[];
  comparisons: Comparison[];
  trends: Trend[];
  recommendations: AIRecommendation[];
}

export interface KeyFinding {
  category: string;
  finding: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high';
  evidence: string[];
  implications: string[];
}

export interface Prediction {
  aspect: string;
  prediction: string;
  confidence: number;
  timeframe: string;
  factors: string[];
  risks: string[];
}

export interface Comparison {
  aspect: string;
  benchmark: string;
  performance: 'below' | 'at' | 'above';
  difference: number;
  context: string;
  implications: string[];
}

export interface Trend {
  aspect: string;
  direction: 'increasing' | 'decreasing' | 'stable' | 'volatile';
  magnitude: number;
  timeframe: string;
  drivers: string[];
  implications: string[];
}

export interface AIRecommendation {
  category: string;
  recommendation: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  effort: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  confidence: number;
  rationale: string;
  steps: string[];
  resources: string[];
  timeline: string;
  risks: string[];
  alternatives: string[];
}

export interface Recommendation {
  id: string;
  type: 'improvement' | 'optimization' | 'refactoring' | 'feature' | 'security' | 'performance';
  priority: 'low' | 'medium' | 'high' | 'critical';
  effort: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  rationale: string;
  implementation: string;
  benefits: string[];
  risks: string[];
  dependencies: string[];
  timeline: string;
  resources: string[];
  alternatives: string[];
  success: SuccessCriteria[];
}

export interface SuccessCriteria {
  metric: string;
  target: string;
  measurement: string;
  timeframe: string;
}

export interface SimilarProject {
  id: string;
  title: string;
  similarity: number;
  commonTechnologies: string[];
  commonFeatures: string[];
  differences: string[];
  learnings: string[];
}

export interface EngagementMetrics {
  views: number;
  likes: number;
  shares: number;
  comments: number;
  downloads: number;
  stars: number;
  forks: number;
  clones: number;
  uniqueVisitors: number;
  returnVisitors: number;
  averageTimeSpent: number;
  bounceRate: number;
  conversionRate: number;
  engagementRate: number;
  socialShares: SocialShare[];
  feedback: Feedback[];
  ratings: Rating[];
}

export interface SocialShare {
  platform: string;
  count: number;
  engagement: number;
  reach: number;
  clicks: number;
}

export interface Feedback {
  id: string;
  type: 'positive' | 'negative' | 'neutral' | 'suggestion';
  content: string;
  author?: string;
  timestamp: string;
  rating?: number;
  helpful?: number;
  category?: string;
  status: 'new' | 'reviewed' | 'addressed' | 'dismissed';
}

export interface Rating {
  id: string;
  score: number;
  maxScore: number;
  category: string;
  author?: string;
  timestamp: string;
  review?: string;
  helpful?: number;
}

// Project filtering and sorting
export interface ProjectFilters {
  categories?: string[];
  technologies?: string[];
  tags?: string[];
  difficulty?: string[];
  status?: string[];
  featured?: boolean;
  dateRange?: {
    start: string;
    end: string;
  };
  search?: string;
  minRating?: number;
  hasDemo?: boolean;
  hasGithub?: boolean;
  teamSize?: {
    min: number;
    max: number;
  };
}

export interface ProjectSort {
  field: 'title' | 'date' | 'popularity' | 'rating' | 'complexity' | 'recent';
  order: 'asc' | 'desc';
}

export interface ProjectSearchResult {
  projects: EnhancedProject[];
  total: number;
  page: number;
  pageSize: number;
  filters: ProjectFilters;
  sort: ProjectSort;
  facets: ProjectFacets;
  suggestions?: string[];
  relatedProjects?: SimilarProject[];
}

export interface ProjectFacets {
  categories: FacetItem[];
  technologies: FacetItem[];
  tags: FacetItem[];
  difficulty: FacetItem[];
  status: FacetItem[];
  years: FacetItem[];
}

export interface FacetItem {
  value: string;
  count: number;
  selected?: boolean;
}

// Project catalog management
export interface ProjectCatalog {
  projects: EnhancedProject[];
  categories: Category[];
  technologies: Technology[];
  tags: Tag[];
  statistics: CatalogStatistics;
  lastUpdated: string;
  version: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon?: string;
  color?: string;
  count: number;
  featured?: boolean;
  parent?: string;
  children?: string[];
}

export interface Technology {
  id: string;
  name: string;
  description: string;
  icon?: string;
  color?: string;
  category: string;
  popularity: number;
  count: number;
  trending?: boolean;
  website?: string;
  documentation?: string;
  alternatives?: string[];
}

export interface Tag {
  id: string;
  name: string;
  description?: string;
  color?: string;
  count: number;
  trending?: boolean;
  related?: string[];
}

export interface CatalogStatistics {
  totalProjects: number;
  completedProjects: number;
  inProgressProjects: number;
  plannedProjects: number;
  totalTechnologies: number;
  totalCategories: number;
  totalTags: number;
  averageComplexity: number;
  averageRating: number;
  totalLinesOfCode: number;
  totalCommits: number;
  totalContributors: number;
  mostUsedTechnologies: Technology[];
  mostPopularCategories: Category[];
  trendingTags: Tag[];
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: 'project_created' | 'project_updated' | 'project_completed' | 'technology_added' | 'milestone_reached';
  projectId?: string;
  title: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

// Export utility types
export type ProjectStatus = Project['status'];
export type ProjectDifficulty = Project['difficulty'];
export type ProjectCategory = string;
export type ProjectTechnology = string;
export type ProjectTag = string;