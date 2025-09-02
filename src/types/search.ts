import { EnhancedProject } from './projects';
import { AIArtwork } from './gallery';

export interface SearchableItem {
  id: string;
  type: SearchableType;
  title: string;
  description: string;
  content: string;
  tags: string[];
  category: string;
  subcategory?: string;
  url: string;
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
  metadata: SearchMetadata;
  searchScore?: number;
  relevanceScore?: number;
  popularityScore?: number;
  qualityScore?: number;
  freshnessScore?: number;
}

export type SearchableType = 
  | 'project'
  | 'artwork'
  | 'demo'
  | 'component'
  | 'library'
  | 'tutorial'
  | 'blog'
  | 'documentation'
  | 'code'
  | 'resource'
  | 'tool'
  | 'template';

export interface SearchMetadata {
  author?: string;
  language?: string;
  framework?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  duration?: number;
  size?: number;
  downloads?: number;
  views?: number;
  likes?: number;
  shares?: number;
  comments?: number;
  rating?: number;
  featured?: boolean;
  premium?: boolean;
  verified?: boolean;
  lastAccessed?: string;
  accessCount?: number;
  searchKeywords?: string[];
  semanticTags?: string[];
  topics?: string[];
  skills?: string[];
  tools?: string[];
  platforms?: string[];
  industries?: string[];
  useCases?: string[];
  customFields?: Record<string, any>;
}

export interface SearchQuery {
  query: string;
  type?: SearchableType | SearchableType[];
  category?: string | string[];
  tags?: string | string[];
  filters?: SearchFilter[];
  sort?: SearchSort;
  pagination?: SearchPagination;
  facets?: SearchFacet[];
  boost?: SearchBoost[];
  highlight?: SearchHighlight;
  suggestions?: boolean;
  analytics?: boolean;
  personalization?: SearchPersonalization;
}

export interface SearchFilter {
  field: string;
  operator: FilterOperator;
  value: any;
  boost?: number;
  required?: boolean;
  exclude?: boolean;
}

export type FilterOperator = 
  | 'equals'
  | 'not_equals'
  | 'contains'
  | 'not_contains'
  | 'starts_with'
  | 'ends_with'
  | 'greater_than'
  | 'greater_than_or_equal'
  | 'less_than'
  | 'less_than_or_equal'
  | 'between'
  | 'in'
  | 'not_in'
  | 'exists'
  | 'not_exists'
  | 'regex'
  | 'fuzzy'
  | 'geo_distance'
  | 'geo_bounding_box';

export interface SearchSort {
  field: string;
  direction: 'asc' | 'desc';
  mode?: 'min' | 'max' | 'sum' | 'avg' | 'median';
  missing?: '_first' | '_last' | any;
  boost?: number;
}

export interface SearchPagination {
  page: number;
  size: number;
  offset?: number;
  cursor?: string;
}

export interface SearchFacet {
  field: string;
  type: 'terms' | 'range' | 'date_histogram' | 'histogram' | 'nested';
  size?: number;
  minCount?: number;
  include?: string[];
  exclude?: string[];
  order?: 'count' | 'key' | 'reverse_count' | 'reverse_key';
  ranges?: FacetRange[];
  interval?: string | number;
  format?: string;
}

export interface FacetRange {
  from?: any;
  to?: any;
  key?: string;
}

export interface SearchBoost {
  field: string;
  factor: number;
  modifier?: 'none' | 'log' | 'log1p' | 'log2p' | 'ln' | 'ln1p' | 'ln2p' | 'square' | 'sqrt' | 'reciprocal';
  missing?: number;
}

export interface SearchHighlight {
  fields: string[];
  fragmentSize?: number;
  numberOfFragments?: number;
  preTag?: string;
  postTag?: string;
  encoder?: 'default' | 'html';
  requireFieldMatch?: boolean;
}

export interface SearchPersonalization {
  userId?: string;
  preferences?: UserPreferences;
  history?: SearchHistory[];
  context?: SearchContext;
  recommendations?: boolean;
}

export interface UserPreferences {
  favoriteCategories?: string[];
  favoriteAuthors?: string[];
  preferredDifficulty?: string[];
  preferredLanguages?: string[];
  preferredFrameworks?: string[];
  blockedContent?: string[];
  customWeights?: Record<string, number>;
}

export interface SearchHistory {
  query: string;
  timestamp: string;
  results: number;
  clicked?: string[];
  converted?: boolean;
  sessionId?: string;
}

export interface SearchContext {
  location?: string;
  device?: string;
  timeOfDay?: string;
  dayOfWeek?: string;
  referrer?: string;
  currentPage?: string;
  userAgent?: string;
  language?: string;
  timezone?: string;
}

export interface SearchResult {
  items: SearchResultItem[];
  total: number;
  took: number;
  maxScore: number;
  facets: SearchFacetResult[];
  suggestions: SearchSuggestion[];
  corrections: SearchCorrection[];
  related: RelatedSearch[];
  pagination: SearchResultPagination;
  analytics: SearchAnalytics;
  debug?: SearchDebug;
}

export interface SearchResultItem extends SearchableItem {
  score: number;
  explanation?: ScoreExplanation;
  highlights: Record<string, string[]>;
  snippet: string;
  matchedFields: string[];
  distance?: number;
  rank: number;
  clickThroughRate?: number;
  conversionRate?: number;
  personalizedScore?: number;
  freshness?: number;
  authority?: number;
  diversity?: number;
}

export interface ScoreExplanation {
  value: number;
  description: string;
  details: ScoreDetail[];
}

export interface ScoreDetail {
  value: number;
  description: string;
  field?: string;
  boost?: number;
}

export interface SearchFacetResult {
  field: string;
  type: string;
  buckets: FacetBucket[];
  otherCount?: number;
  errorCount?: number;
}

export interface FacetBucket {
  key: string;
  count: number;
  selected?: boolean;
  from?: any;
  to?: any;
  subFacets?: SearchFacetResult[];
}

export interface SearchSuggestion {
  type: SuggestionType;
  text: string;
  query?: string;
  score: number;
  frequency?: number;
  highlighted?: string;
  category?: string;
  metadata?: Record<string, any>;
}

export type SuggestionType = 
  | 'completion'
  | 'correction'
  | 'phrase'
  | 'term'
  | 'semantic'
  | 'trending'
  | 'popular'
  | 'recent'
  | 'personalized'
  | 'ai_generated';

export interface SearchCorrection {
  original: string;
  corrected: string;
  confidence: number;
  type: 'spelling' | 'grammar' | 'semantic' | 'contextual';
}

export interface RelatedSearch {
  query: string;
  score: number;
  type: 'similar' | 'broader' | 'narrower' | 'alternative' | 'trending';
  results?: number;
}

export interface SearchResultPagination {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  hasNext: boolean;
  hasPrevious: boolean;
  nextCursor?: string;
  previousCursor?: string;
}

export interface SearchAnalytics {
  queryId: string;
  sessionId: string;
  timestamp: string;
  processingTime: number;
  cacheHit: boolean;
  indexVersion: string;
  algorithmVersion: string;
  personalizedResults: boolean;
  abTestVariant?: string;
  qualityScore: number;
  diversityScore: number;
  relevanceScore: number;
}

export interface SearchDebug {
  parsedQuery: ParsedQuery;
  appliedFilters: SearchFilter[];
  executionPlan: ExecutionStep[];
  indexStats: IndexStats;
  performanceMetrics: PerformanceMetrics;
}

export interface ParsedQuery {
  original: string;
  normalized: string;
  tokens: QueryToken[];
  operators: QueryOperator[];
  fields: string[];
  boost: Record<string, number>;
}

export interface QueryToken {
  text: string;
  type: 'term' | 'phrase' | 'wildcard' | 'regex' | 'fuzzy';
  field?: string;
  boost?: number;
  required?: boolean;
  prohibited?: boolean;
}

export interface QueryOperator {
  type: 'AND' | 'OR' | 'NOT' | 'NEAR' | 'PHRASE';
  position: number;
  precedence: number;
}

export interface ExecutionStep {
  step: string;
  duration: number;
  results: number;
  cached: boolean;
  details?: Record<string, any>;
}

export interface IndexStats {
  totalDocuments: number;
  indexSize: number;
  lastUpdated: string;
  version: string;
  shards: number;
  replicas: number;
  health: 'green' | 'yellow' | 'red';
}

export interface PerformanceMetrics {
  queryTime: number;
  fetchTime: number;
  highlightTime: number;
  facetTime: number;
  suggestionTime: number;
  totalTime: number;
  memoryUsage: number;
  cpuUsage: number;
}

// Search engine configuration
export interface SearchEngineConfig {
  indexName: string;
  analyzer: AnalyzerConfig;
  similarity: SimilarityConfig;
  fieldMappings: FieldMapping[];
  synonyms: SynonymConfig;
  stopWords: string[];
  stemming: StemmingConfig;
  fuzzy: FuzzyConfig;
  autocomplete: AutocompleteConfig;
  faceting: FacetingConfig;
  ranking: RankingConfig;
  caching: CachingConfig;
  monitoring: MonitoringConfig;
}

export interface AnalyzerConfig {
  tokenizer: string;
  filters: string[];
  charFilters: string[];
  customAnalyzers: CustomAnalyzer[];
}

export interface CustomAnalyzer {
  name: string;
  tokenizer: string;
  filters: string[];
  charFilters: string[];
}

export interface SimilarityConfig {
  algorithm: 'BM25' | 'TF-IDF' | 'DFR' | 'IB' | 'LM' | 'custom';
  parameters: Record<string, number>;
}

export interface FieldMapping {
  field: string;
  type: 'text' | 'keyword' | 'number' | 'date' | 'boolean' | 'geo' | 'nested' | 'object';
  analyzer?: string;
  searchAnalyzer?: string;
  boost?: number;
  store?: boolean;
  index?: boolean;
  docValues?: boolean;
  fieldData?: boolean;
  copyTo?: string[];
  properties?: FieldMapping[];
}

export interface SynonymConfig {
  enabled: boolean;
  synonyms: SynonymRule[];
  expand: boolean;
  ignoreCase: boolean;
}

export interface SynonymRule {
  input: string[];
  output: string[];
  type: 'equivalent' | 'explicit';
}

export interface StemmingConfig {
  enabled: boolean;
  language: string;
  algorithm: 'porter' | 'snowball' | 'kstem' | 'minimal';
  customRules: StemmingRule[];
}

export interface StemmingRule {
  pattern: string;
  replacement: string;
}

export interface FuzzyConfig {
  enabled: boolean;
  maxEdits: number;
  prefixLength: number;
  maxExpansions: number;
  transpositions: boolean;
}

export interface AutocompleteConfig {
  enabled: boolean;
  minChars: number;
  maxSuggestions: number;
  fields: string[];
  fuzzy: boolean;
  contextual: boolean;
  personalized: boolean;
}

export interface FacetingConfig {
  enabled: boolean;
  maxFacets: number;
  maxBuckets: number;
  minCount: number;
  defaultSort: 'count' | 'key';
  hierarchical: boolean;
}

export interface RankingConfig {
  algorithm: 'relevance' | 'popularity' | 'recency' | 'custom' | 'ml';
  factors: RankingFactor[];
  learningToRank: LearningToRankConfig;
  personalizedRanking: PersonalizedRankingConfig;
}

export interface RankingFactor {
  name: string;
  weight: number;
  type: 'field' | 'function' | 'script';
  field?: string;
  function?: string;
  script?: string;
  parameters?: Record<string, any>;
}

export interface LearningToRankConfig {
  enabled: boolean;
  model: string;
  features: RankingFeature[];
  trainingData: string;
  evaluationMetrics: string[];
}

export interface RankingFeature {
  name: string;
  type: 'field' | 'query' | 'document' | 'interaction';
  extractor: string;
  normalizer?: string;
}

export interface PersonalizedRankingConfig {
  enabled: boolean;
  userModel: string;
  itemModel: string;
  interactionModel: string;
  coldStartStrategy: 'popular' | 'random' | 'content_based';
}

export interface CachingConfig {
  enabled: boolean;
  ttl: number;
  maxSize: number;
  strategy: 'lru' | 'lfu' | 'fifo' | 'ttl';
  warmup: boolean;
  invalidation: InvalidationConfig;
}

export interface InvalidationConfig {
  onUpdate: boolean;
  onDelete: boolean;
  scheduled: boolean;
  patterns: string[];
}

export interface MonitoringConfig {
  enabled: boolean;
  metrics: string[];
  alerts: AlertConfig[];
  logging: LoggingConfig;
  analytics: AnalyticsConfig;
}

export interface AlertConfig {
  name: string;
  condition: string;
  threshold: number;
  action: 'email' | 'webhook' | 'log';
  target: string;
}

export interface LoggingConfig {
  level: 'debug' | 'info' | 'warn' | 'error';
  queries: boolean;
  slowQueries: boolean;
  errors: boolean;
  performance: boolean;
}

export interface AnalyticsConfig {
  enabled: boolean;
  sampling: number;
  retention: number;
  aggregation: string[];
  export: ExportConfig;
}

export interface ExportConfig {
  enabled: boolean;
  format: 'json' | 'csv' | 'parquet';
  schedule: string;
  destination: string;
}

// Search UI components
export interface SearchUIConfig {
  layout: 'grid' | 'list' | 'cards' | 'table';
  theme: 'light' | 'dark' | 'auto';
  responsive: boolean;
  animations: boolean;
  accessibility: AccessibilityConfig;
  customization: CustomizationConfig;
}

export interface AccessibilityConfig {
  enabled: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large';
  announcements: boolean;
}

export interface CustomizationConfig {
  colors: ColorScheme;
  typography: TypographyConfig;
  spacing: SpacingConfig;
  components: ComponentConfig[];
}

export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  border: string;
  highlight: string;
}

export interface TypographyConfig {
  fontFamily: string;
  fontSize: Record<string, string>;
  fontWeight: Record<string, number>;
  lineHeight: Record<string, number>;
}

export interface SpacingConfig {
  unit: number;
  scale: number[];
  breakpoints: Record<string, number>;
}

export interface ComponentConfig {
  name: string;
  props: Record<string, any>;
  styles: Record<string, any>;
  overrides: Record<string, any>;
}

// AI-powered search features
export interface AISearchFeatures {
  semanticSearch: SemanticSearchConfig;
  intentDetection: IntentDetectionConfig;
  queryExpansion: QueryExpansionConfig;
  resultReranking: ReRankingConfig;
  conversationalSearch: ConversationalSearchConfig;
  visualSearch: VisualSearchConfig;
}

export interface SemanticSearchConfig {
  enabled: boolean;
  model: string;
  threshold: number;
  hybridSearch: boolean;
  vectorIndex: string;
  embeddingDimensions: number;
}

export interface IntentDetectionConfig {
  enabled: boolean;
  model: string;
  intents: SearchIntent[];
  confidence: number;
  fallback: string;
}

export interface SearchIntent {
  name: string;
  patterns: string[];
  actions: IntentAction[];
  parameters: IntentParameter[];
}

export interface IntentAction {
  type: 'filter' | 'sort' | 'redirect' | 'suggest' | 'custom';
  value: any;
  condition?: string;
}

export interface IntentParameter {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean' | 'entity';
  required: boolean;
  extractor: string;
}

export interface QueryExpansionConfig {
  enabled: boolean;
  methods: ExpansionMethod[];
  maxTerms: number;
  minScore: number;
  personalized: boolean;
}

export interface ExpansionMethod {
  type: 'synonyms' | 'related' | 'conceptual' | 'statistical' | 'ml';
  weight: number;
  source: string;
  parameters: Record<string, any>;
}

export interface ReRankingConfig {
  enabled: boolean;
  model: string;
  features: string[];
  topK: number;
  threshold: number;
}

export interface ConversationalSearchConfig {
  enabled: boolean;
  model: string;
  context: number;
  memory: boolean;
  clarification: boolean;
  followUp: boolean;
}

export interface VisualSearchConfig {
  enabled: boolean;
  model: string;
  similarity: number;
  features: string[];
  preprocessing: ImagePreprocessingConfig;
}

export interface ImagePreprocessingConfig {
  resize: boolean;
  normalize: boolean;
  augmentation: boolean;
  quality: number;
  format: string;
}

// Search analytics and insights
export interface SearchInsights {
  queryAnalytics: QueryAnalytics;
  userBehavior: UserBehaviorAnalytics;
  contentAnalytics: ContentAnalytics;
  performanceAnalytics: PerformanceAnalytics;
  businessMetrics: BusinessMetrics;
}

export interface QueryAnalytics {
  topQueries: TopQuery[];
  noResultQueries: NoResultQuery[];
  queryTrends: QueryTrend[];
  queryCategories: QueryCategory[];
  queryComplexity: QueryComplexity;
}

export interface TopQuery {
  query: string;
  count: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
  avgPosition: number;
  conversionRate: number;
}

export interface NoResultQuery {
  query: string;
  count: number;
  suggestions: string[];
  potentialMatches: string[];
}

export interface QueryTrend {
  period: string;
  queries: number;
  uniqueQueries: number;
  avgLength: number;
  complexity: number;
}

export interface QueryCategory {
  category: string;
  queries: number;
  percentage: number;
  avgResults: number;
  avgCTR: number;
}

export interface QueryComplexity {
  simple: number;
  moderate: number;
  complex: number;
  avgTerms: number;
  avgFilters: number;
}

export interface UserBehaviorAnalytics {
  searchPatterns: SearchPattern[];
  clickThroughRates: CTRAnalytics;
  dwellTime: DwellTimeAnalytics;
  abandonmentAnalysis: AbandonmentAnalysis;
  userJourney: UserJourneyAnalytics;
}

export interface SearchPattern {
  pattern: string;
  frequency: number;
  users: number;
  success: number;
  conversion: number;
}

export interface CTRAnalytics {
  overall: number;
  byPosition: Record<number, number>;
  byCategory: Record<string, number>;
  byQuery: Record<string, number>;
  trends: CTRTrend[];
}

export interface CTRTrend {
  period: string;
  ctr: number;
  change: number;
  significance: number;
}

export interface DwellTimeAnalytics {
  average: number;
  median: number;
  distribution: TimeDistribution[];
  byCategory: Record<string, number>;
  correlation: number;
}

export interface TimeDistribution {
  range: string;
  count: number;
  percentage: number;
}

export interface AbandonmentAnalysis {
  rate: number;
  reasons: AbandonmentReason[];
  patterns: AbandonmentPattern[];
  prevention: PreventionStrategy[];
}

export interface AbandonmentReason {
  reason: string;
  percentage: number;
  impact: 'low' | 'medium' | 'high';
}

export interface AbandonmentPattern {
  pattern: string;
  frequency: number;
  stage: string;
  intervention: string;
}

export interface PreventionStrategy {
  strategy: string;
  effectiveness: number;
  implementation: string;
  cost: 'low' | 'medium' | 'high';
}

export interface UserJourneyAnalytics {
  paths: JourneyPath[];
  touchpoints: Touchpoint[];
  conversions: ConversionPath[];
  dropoffs: DropoffPoint[];
}

export interface JourneyPath {
  path: string[];
  frequency: number;
  conversion: number;
  value: number;
}

export interface Touchpoint {
  point: string;
  interactions: number;
  influence: number;
  satisfaction: number;
}

export interface ConversionPath {
  path: string[];
  conversions: number;
  value: number;
  timeToConvert: number;
}

export interface DropoffPoint {
  point: string;
  dropoffs: number;
  reasons: string[];
  recovery: number;
}

export interface ContentAnalytics {
  contentPerformance: ContentPerformance[];
  contentGaps: ContentGap[];
  contentOptimization: ContentOptimization[];
  contentTrends: ContentTrend[];
}

export interface ContentPerformance {
  content: string;
  views: number;
  clicks: number;
  ctr: number;
  dwellTime: number;
  conversions: number;
  score: number;
}

export interface ContentGap {
  query: string;
  demand: number;
  supply: number;
  opportunity: number;
  difficulty: number;
}

export interface ContentOptimization {
  content: string;
  recommendations: Recommendation[];
  priority: 'low' | 'medium' | 'high';
  impact: number;
}

export interface Recommendation {
  type: string;
  description: string;
  effort: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
}

export interface ContentTrend {
  topic: string;
  trend: 'rising' | 'stable' | 'declining';
  velocity: number;
  forecast: number;
}

export interface PerformanceAnalytics {
  responseTime: ResponseTimeAnalytics;
  throughput: ThroughputAnalytics;
  errorAnalysis: ErrorAnalysis;
  resourceUtilization: ResourceUtilization;
}

export interface ResponseTimeAnalytics {
  average: number;
  median: number;
  p95: number;
  p99: number;
  distribution: TimeDistribution[];
  trends: ResponseTimeTrend[];
}

export interface ResponseTimeTrend {
  period: string;
  average: number;
  change: number;
  threshold: number;
}

export interface ThroughputAnalytics {
  qps: number;
  peak: number;
  capacity: number;
  utilization: number;
  trends: ThroughputTrend[];
}

export interface ThroughputTrend {
  period: string;
  qps: number;
  change: number;
  capacity: number;
}

export interface ErrorAnalysis {
  rate: number;
  types: ErrorType[];
  patterns: ErrorPattern[];
  impact: ErrorImpact;
}

export interface ErrorType {
  type: string;
  count: number;
  percentage: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface ErrorPattern {
  pattern: string;
  frequency: number;
  correlation: string[];
  resolution: string;
}

export interface ErrorImpact {
  userExperience: number;
  businessMetrics: number;
  systemHealth: number;
  reputation: number;
}

export interface ResourceUtilization {
  cpu: number;
  memory: number;
  storage: number;
  network: number;
  efficiency: number;
}

export interface BusinessMetrics {
  revenue: RevenueMetrics;
  engagement: EngagementMetrics;
  satisfaction: SatisfactionMetrics;
  growth: GrowthMetrics;
}

export interface RevenueMetrics {
  total: number;
  perSearch: number;
  conversion: number;
  attribution: AttributionMetrics;
}

export interface AttributionMetrics {
  direct: number;
  assisted: number;
  influenced: number;
  model: string;
}

export interface EngagementMetrics {
  sessions: number;
  duration: number;
  depth: number;
  retention: number;
}

export interface SatisfactionMetrics {
  score: number;
  nps: number;
  feedback: FeedbackMetrics;
  sentiment: SentimentMetrics;
}

export interface FeedbackMetrics {
  positive: number;
  negative: number;
  neutral: number;
  comments: string[];
}

export interface SentimentMetrics {
  score: number;
  distribution: SentimentDistribution[];
  trends: SentimentTrend[];
}

export interface SentimentDistribution {
  sentiment: 'positive' | 'negative' | 'neutral';
  percentage: number;
}

export interface SentimentTrend {
  period: string;
  sentiment: number;
  change: number;
}

export interface GrowthMetrics {
  users: GrowthMetric;
  queries: GrowthMetric;
  content: GrowthMetric;
  revenue: GrowthMetric;
}

export interface GrowthMetric {
  current: number;
  previous: number;
  change: number;
  rate: number;
  forecast: number;
}

// Export utility types
export type SearchMode = 'simple' | 'advanced' | 'semantic' | 'visual' | 'voice';
export type SearchScope = 'all' | 'projects' | 'gallery' | 'demos' | 'docs';
export type SearchQuality = 'high' | 'medium' | 'low';
export type SearchRelevance = 'exact' | 'partial' | 'related' | 'semantic';
export type SearchFreshness = 'latest' | 'recent' | 'any';
export type SearchDifficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type SearchLanguage = 'javascript' | 'typescript' | 'python' | 'java' | 'cpp' | 'rust' | 'go' | 'any';
export type SearchFramework = 'react' | 'vue' | 'angular' | 'svelte' | 'next' | 'nuxt' | 'any';
export type SearchCategory = 'web' | 'mobile' | 'desktop' | 'ai' | 'ml' | 'data' | 'game' | 'tool' | 'library';