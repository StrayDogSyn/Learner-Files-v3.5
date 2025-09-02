export interface AnalyticsEvent {
  id: string;
  type: EventType;
  category: EventCategory;
  action: string;
  label?: string;
  value?: number;
  timestamp: string;
  sessionId: string;
  userId?: string;
  deviceInfo: DeviceInfo;
  locationInfo?: LocationInfo;
  pageInfo: PageInfo;
  customProperties?: Record<string, any>;
  metadata?: EventMetadata;
}

export type EventType = 
  | 'page_view'
  | 'user_interaction'
  | 'performance'
  | 'error'
  | 'conversion'
  | 'engagement'
  | 'custom';

export type EventCategory = 
  | 'navigation'
  | 'project'
  | 'gallery'
  | 'demo'
  | 'search'
  | 'social'
  | 'download'
  | 'share'
  | 'like'
  | 'comment'
  | 'filter'
  | 'sort'
  | 'view'
  | 'click'
  | 'scroll'
  | 'form'
  | 'error'
  | 'performance'
  | 'conversion';

export interface EventMetadata {
  source?: string;
  medium?: string;
  campaign?: string;
  referrer?: string;
  userAgent?: string;
  viewport?: Viewport;
  scrollDepth?: number;
  timeOnPage?: number;
  clickPosition?: Position;
  elementInfo?: ElementInfo;
  formData?: FormData;
  errorInfo?: ErrorInfo;
  performanceInfo?: PerformanceInfo;
}

export interface Viewport {
  width: number;
  height: number;
  devicePixelRatio: number;
}

export interface Position {
  x: number;
  y: number;
  relativeX: number;
  relativeY: number;
}

export interface ElementInfo {
  tagName: string;
  id?: string;
  className?: string;
  textContent?: string;
  href?: string;
  src?: string;
  alt?: string;
  title?: string;
  dataAttributes?: Record<string, string>;
}

export interface FormData {
  formId?: string;
  fieldCount: number;
  completedFields: number;
  errors: string[];
  timeToComplete: number;
  abandonmentPoint?: string;
}

export interface ErrorInfo {
  message: string;
  stack?: string;
  filename?: string;
  lineno?: number;
  colno?: number;
  type: 'javascript' | 'network' | 'resource' | 'security' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  context?: Record<string, any>;
}

export interface PerformanceInfo {
  loadTime: number;
  domContentLoaded: number;
  firstPaint: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  firstInputDelay: number;
  cumulativeLayoutShift: number;
  timeToInteractive: number;
  resourceTimings?: ResourceTiming[];
  memoryUsage?: MemoryUsage;
  connectionInfo?: ConnectionInfo;
}

export interface ResourceTiming {
  name: string;
  type: 'script' | 'stylesheet' | 'image' | 'font' | 'fetch' | 'xmlhttprequest' | 'other';
  startTime: number;
  duration: number;
  transferSize: number;
  encodedBodySize: number;
  decodedBodySize: number;
}

export interface MemoryUsage {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

export interface ConnectionInfo {
  effectiveType: '2g' | '3g' | '4g' | 'slow-2g';
  downlink: number;
  rtt: number;
  saveData: boolean;
}

export interface UserSession {
  id: string;
  userId?: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  pageViews: number;
  events: number;
  bounced: boolean;
  converted: boolean;
  deviceInfo: DeviceInfo;
  locationInfo?: LocationInfo;
  referrer?: string;
  landingPage: string;
  exitPage?: string;
  goals: ConversionGoal[];
  customDimensions?: Record<string, string>;
  experiments?: ExperimentParticipation[];
}

export interface ExperimentParticipation {
  experimentId: string;
  variantId: string;
  startTime: string;
  endTime?: string;
  converted: boolean;
  metrics?: Record<string, number>;
}

export interface DeviceInfo {
  type: 'desktop' | 'tablet' | 'mobile' | 'tv' | 'wearable' | 'unknown';
  os: string;
  osVersion: string;
  browser: string;
  browserVersion: string;
  engine: string;
  engineVersion: string;
  device: string;
  vendor: string;
  model: string;
  screenResolution: {
    width: number;
    height: number;
  };
  colorDepth: number;
  pixelRatio: number;
  touchSupport: boolean;
  cookieEnabled: boolean;
  javaEnabled: boolean;
  language: string;
  languages: string[];
  timezone: string;
  platform: string;
}

export interface LocationInfo {
  country?: string;
  region?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  isp?: string;
  organization?: string;
  asn?: string;
  accuracy?: 'country' | 'region' | 'city' | 'precise';
}

export interface PageInfo {
  url: string;
  path: string;
  title: string;
  referrer?: string;
  search?: string;
  hash?: string;
  protocol: string;
  hostname: string;
  port?: string;
  language?: string;
  charset?: string;
  viewport?: Viewport;
}

export interface PerformanceMetrics {
  pageLoad: PageLoadMetrics;
  runtime: RuntimeMetrics;
  network: NetworkMetrics;
  rendering: RenderingMetrics;
  memory: MemoryMetrics;
  errors: ErrorMetrics;
  vitals: WebVitals;
  custom: CustomMetrics;
}

export interface PageLoadMetrics {
  navigationStart: number;
  domainLookupStart: number;
  domainLookupEnd: number;
  connectStart: number;
  connectEnd: number;
  requestStart: number;
  responseStart: number;
  responseEnd: number;
  domLoading: number;
  domInteractive: number;
  domContentLoaded: number;
  domComplete: number;
  loadEventStart: number;
  loadEventEnd: number;
  totalLoadTime: number;
  dnsTime: number;
  tcpTime: number;
  requestTime: number;
  responseTime: number;
  processingTime: number;
  onLoadTime: number;
}

export interface RuntimeMetrics {
  jsExecutionTime: number;
  cssParseTime: number;
  layoutTime: number;
  paintTime: number;
  compositeTime: number;
  scriptCount: number;
  stylesheetCount: number;
  imageCount: number;
  fontCount: number;
  totalResourceCount: number;
  totalResourceSize: number;
  cacheHitRate: number;
  compressionRatio: number;
}

export interface NetworkMetrics {
  requestCount: number;
  totalTransferSize: number;
  totalEncodedSize: number;
  totalDecodedSize: number;
  averageRequestTime: number;
  slowestRequest: ResourceTiming;
  fastestRequest: ResourceTiming;
  failedRequests: number;
  cachedRequests: number;
  bandwidth: number;
  latency: number;
  connectionType: string;
}

export interface RenderingMetrics {
  firstPaint: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  firstMeaningfulPaint: number;
  speedIndex: number;
  visuallyComplete: number;
  timeToInteractive: number;
  totalBlockingTime: number;
  layoutShifts: LayoutShift[];
  cumulativeLayoutShift: number;
  renderBlockingResources: string[];
  criticalResourceCount: number;
}

export interface LayoutShift {
  value: number;
  sources: LayoutShiftSource[];
  timestamp: number;
}

export interface LayoutShiftSource {
  node: string;
  previousRect: DOMRect;
  currentRect: DOMRect;
}

export interface DOMRect {
  x: number;
  y: number;
  width: number;
  height: number;
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface MemoryMetrics {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
  memoryPressure: 'low' | 'medium' | 'high';
  gcCount: number;
  gcTime: number;
  leakDetected: boolean;
  peakUsage: number;
  averageUsage: number;
}

export interface ErrorMetrics {
  totalErrors: number;
  javascriptErrors: number;
  networkErrors: number;
  resourceErrors: number;
  securityErrors: number;
  errorRate: number;
  criticalErrors: number;
  errorsByType: Record<string, number>;
  errorsByPage: Record<string, number>;
  topErrors: ErrorSummary[];
}

export interface ErrorSummary {
  message: string;
  count: number;
  lastOccurrence: string;
  affectedUsers: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  stack?: string;
  context?: Record<string, any>;
}

export interface WebVitals {
  lcp: VitalMetric; // Largest Contentful Paint
  fid: VitalMetric; // First Input Delay
  cls: VitalMetric; // Cumulative Layout Shift
  fcp: VitalMetric; // First Contentful Paint
  ttfb: VitalMetric; // Time to First Byte
  inp: VitalMetric; // Interaction to Next Paint
}

export interface VitalMetric {
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  percentile: number;
  samples: number;
  trend: 'improving' | 'stable' | 'degrading';
  threshold: {
    good: number;
    poor: number;
  };
}

export interface CustomMetrics {
  [key: string]: number | string | boolean | CustomMetricValue;
}

export interface CustomMetricValue {
  value: number | string | boolean;
  unit?: string;
  description?: string;
  category?: string;
  timestamp?: string;
}

export interface EngagementMetrics {
  timeOnSite: number;
  timeOnPage: number;
  pageViews: number;
  uniquePageViews: number;
  bounceRate: number;
  exitRate: number;
  pagesPerSession: number;
  sessionDuration: number;
  scrollDepth: ScrollDepthMetrics;
  interactions: InteractionMetrics;
  social: SocialMetrics;
  content: ContentMetrics;
  conversion: ConversionMetrics;
}

export interface ScrollDepthMetrics {
  maxDepth: number;
  averageDepth: number;
  milestones: ScrollMilestone[];
  timeToScroll: Record<number, number>;
  scrollSpeed: number;
  scrollDirection: 'down' | 'up' | 'both';
  readingPattern: 'linear' | 'scanning' | 'jumping';
}

export interface ScrollMilestone {
  depth: number;
  timestamp: number;
  timeFromStart: number;
  reached: boolean;
}

export interface InteractionMetrics {
  clicks: ClickMetrics;
  hovers: HoverMetrics;
  forms: FormMetrics;
  media: MediaMetrics;
  downloads: DownloadMetrics;
  shares: ShareMetrics;
  searches: SearchMetrics;
}

export interface ClickMetrics {
  totalClicks: number;
  uniqueClicks: number;
  clickRate: number;
  heatmap: HeatmapData[];
  topElements: ElementInteraction[];
  clicksByPage: Record<string, number>;
  clicksByTime: TimeSeriesData[];
}

export interface HeatmapData {
  x: number;
  y: number;
  intensity: number;
  clicks: number;
  element?: string;
  page: string;
}

export interface ElementInteraction {
  element: string;
  selector: string;
  interactions: number;
  uniqueUsers: number;
  averageTime: number;
  conversionRate: number;
}

export interface TimeSeriesData {
  timestamp: string;
  value: number;
  label?: string;
}

export interface HoverMetrics {
  totalHovers: number;
  averageHoverTime: number;
  hoverRate: number;
  topElements: ElementInteraction[];
  hoversByPage: Record<string, number>;
}

export interface FormMetrics {
  submissions: number;
  completions: number;
  abandonments: number;
  completionRate: number;
  abandonmentRate: number;
  averageCompletionTime: number;
  fieldAnalytics: FieldAnalytics[];
  errorAnalytics: FormErrorAnalytics;
}

export interface FieldAnalytics {
  fieldName: string;
  fieldType: string;
  interactions: number;
  completions: number;
  errors: number;
  averageTime: number;
  abandonmentRate: number;
}

export interface FormErrorAnalytics {
  totalErrors: number;
  errorsByField: Record<string, number>;
  errorsByType: Record<string, number>;
  topErrors: FormError[];
}

export interface FormError {
  field: string;
  error: string;
  count: number;
  impact: 'low' | 'medium' | 'high';
}

export interface MediaMetrics {
  plays: number;
  pauses: number;
  completions: number;
  averageWatchTime: number;
  engagementRate: number;
  dropoffPoints: number[];
  qualityChanges: number;
  bufferingEvents: number;
}

export interface DownloadMetrics {
  totalDownloads: number;
  uniqueDownloads: number;
  downloadsByType: Record<string, number>;
  downloadsBySize: Record<string, number>;
  topDownloads: DownloadItem[];
  conversionRate: number;
}

export interface DownloadItem {
  filename: string;
  type: string;
  size: number;
  downloads: number;
  uniqueUsers: number;
  conversionValue: number;
}

export interface ShareMetrics {
  totalShares: number;
  sharesByPlatform: Record<string, number>;
  sharesByContent: Record<string, number>;
  viralCoefficient: number;
  reachMultiplier: number;
  topSharedContent: SharedContent[];
}

export interface SharedContent {
  content: string;
  type: string;
  shares: number;
  platforms: string[];
  reach: number;
  engagement: number;
}

export interface SearchMetrics {
  totalSearches: number;
  uniqueSearches: number;
  searchSuccessRate: number;
  averageResultsClicked: number;
  topQueries: SearchQuery[];
  noResultsQueries: string[];
  searchToConversion: number;
}

export interface SearchQuery {
  query: string;
  count: number;
  successRate: number;
  averagePosition: number;
  conversionRate: number;
}

export interface SocialMetrics {
  likes: number;
  shares: number;
  comments: number;
  follows: number;
  mentions: number;
  reach: number;
  impressions: number;
  engagementRate: number;
  viralityScore: number;
  sentimentScore: number;
}

export interface ContentMetrics {
  views: number;
  uniqueViews: number;
  timeSpent: number;
  readingProgress: number;
  completionRate: number;
  shareRate: number;
  commentRate: number;
  returnVisitorRate: number;
  contentScore: number;
  topContent: ContentItem[];
}

export interface ContentItem {
  id: string;
  title: string;
  type: string;
  views: number;
  timeSpent: number;
  engagementScore: number;
  conversionRate: number;
}

export interface ConversionMetrics {
  totalConversions: number;
  conversionRate: number;
  conversionValue: number;
  averageOrderValue: number;
  conversionsByGoal: Record<string, number>;
  conversionsBySource: Record<string, number>;
  conversionFunnel: FunnelStep[];
  attributionModel: AttributionData;
}

export interface FunnelStep {
  step: string;
  visitors: number;
  conversions: number;
  conversionRate: number;
  dropoffRate: number;
  averageTime: number;
}

export interface AttributionData {
  firstClick: AttributionSource[];
  lastClick: AttributionSource[];
  linear: AttributionSource[];
  timeDecay: AttributionSource[];
  positionBased: AttributionSource[];
}

export interface AttributionSource {
  source: string;
  medium: string;
  campaign: string;
  conversions: number;
  value: number;
  percentage: number;
}

export interface ConversionGoal {
  id: string;
  name: string;
  type: 'page_view' | 'event' | 'duration' | 'pages_per_session' | 'custom';
  conditions: GoalCondition[];
  value?: number;
  currency?: string;
  funnel?: FunnelStep[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GoalCondition {
  type: 'url' | 'event' | 'duration' | 'page_count' | 'custom';
  operator: 'equals' | 'contains' | 'starts_with' | 'ends_with' | 'greater_than' | 'less_than' | 'regex';
  value: string | number;
  caseSensitive?: boolean;
}

export interface AnalyticsConfig {
  trackingId: string;
  domain: string;
  enableAutoTracking: boolean;
  enablePerformanceTracking: boolean;
  enableErrorTracking: boolean;
  enableHeatmaps: boolean;
  enableRecordings: boolean;
  enableABTesting: boolean;
  samplingRate: number;
  sessionTimeout: number;
  cookieExpiry: number;
  respectDoNotTrack: boolean;
  anonymizeIp: boolean;
  customDimensions: CustomDimension[];
  goals: ConversionGoal[];
  experiments: Experiment[];
  integrations: Integration[];
}

export interface CustomDimension {
  id: string;
  name: string;
  scope: 'hit' | 'session' | 'user';
  active: boolean;
}

export interface Experiment {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'running' | 'paused' | 'completed';
  trafficAllocation: number;
  variants: ExperimentVariant[];
  goals: string[];
  startDate: string;
  endDate?: string;
  results?: ExperimentResults;
}

export interface ExperimentVariant {
  id: string;
  name: string;
  description: string;
  trafficWeight: number;
  changes: VariantChange[];
}

export interface VariantChange {
  type: 'element' | 'redirect' | 'code';
  selector?: string;
  attribute?: string;
  value: string;
  action: 'replace' | 'append' | 'prepend' | 'remove' | 'modify';
}

export interface ExperimentResults {
  participants: number;
  conversions: Record<string, number>;
  conversionRates: Record<string, number>;
  significance: Record<string, number>;
  confidence: Record<string, number>;
  winner?: string;
  insights: string[];
}

export interface Integration {
  id: string;
  name: string;
  type: 'analytics' | 'marketing' | 'crm' | 'email' | 'social' | 'custom';
  enabled: boolean;
  config: Record<string, any>;
  dataMapping: DataMapping[];
}

export interface DataMapping {
  source: string;
  destination: string;
  transformation?: string;
  conditions?: MappingCondition[];
}

export interface MappingCondition {
  field: string;
  operator: string;
  value: any;
}

export interface AnalyticsReport {
  id: string;
  name: string;
  description: string;
  type: 'standard' | 'custom' | 'real_time' | 'cohort' | 'funnel' | 'retention';
  dateRange: DateRange;
  metrics: string[];
  dimensions: string[];
  filters: ReportFilter[];
  segments: string[];
  data: ReportData;
  insights: ReportInsight[];
  recommendations: ReportRecommendation[];
  createdAt: string;
  updatedAt: string;
}

export interface DateRange {
  start: string;
  end: string;
  period: 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year' | 'custom';
  comparison?: DateRange;
}

export interface ReportFilter {
  dimension: string;
  operator: string;
  value: any;
  exclude?: boolean;
}

export interface ReportData {
  headers: string[];
  rows: any[][];
  totals: any[];
  summary: ReportSummary;
  charts: ChartData[];
}

export interface ReportSummary {
  totalRows: number;
  totalSessions: number;
  totalUsers: number;
  totalPageviews: number;
  totalEvents: number;
  totalConversions: number;
  totalRevenue: number;
  averageSessionDuration: number;
  bounceRate: number;
  conversionRate: number;
}

export interface ChartData {
  type: 'line' | 'bar' | 'pie' | 'area' | 'scatter' | 'heatmap' | 'funnel';
  title: string;
  data: any[];
  options: ChartOptions;
}

export interface ChartOptions {
  xAxis?: AxisConfig;
  yAxis?: AxisConfig;
  legend?: LegendConfig;
  colors?: string[];
  responsive?: boolean;
  animation?: boolean;
  tooltip?: TooltipConfig;
}

export interface AxisConfig {
  title: string;
  type: 'category' | 'value' | 'time' | 'log';
  min?: number;
  max?: number;
  format?: string;
}

export interface LegendConfig {
  show: boolean;
  position: 'top' | 'bottom' | 'left' | 'right';
  align: 'start' | 'center' | 'end';
}

export interface TooltipConfig {
  show: boolean;
  format?: string;
  trigger: 'item' | 'axis' | 'none';
}

export interface ReportInsight {
  type: 'trend' | 'anomaly' | 'correlation' | 'prediction' | 'recommendation';
  title: string;
  description: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high';
  data: any;
}

export interface ReportRecommendation {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  category: string;
  actions: string[];
  metrics: string[];
}

// Real-time analytics interfaces
export interface RealTimeMetrics {
  activeUsers: number;
  pageViews: number;
  events: number;
  conversions: number;
  topPages: PageMetric[];
  topEvents: EventMetric[];
  topSources: SourceMetric[];
  topCountries: CountryMetric[];
  topDevices: DeviceMetric[];
  timeline: TimelineData[];
  alerts: Alert[];
}

export interface PageMetric {
  page: string;
  views: number;
  users: number;
  avgTimeOnPage: number;
  bounceRate: number;
}

export interface EventMetric {
  event: string;
  count: number;
  users: number;
  value: number;
  conversionRate: number;
}

export interface SourceMetric {
  source: string;
  users: number;
  sessions: number;
  conversionRate: number;
  value: number;
}

export interface CountryMetric {
  country: string;
  users: number;
  sessions: number;
  bounceRate: number;
  avgSessionDuration: number;
}

export interface DeviceMetric {
  device: string;
  users: number;
  sessions: number;
  conversionRate: number;
  avgSessionDuration: number;
}

export interface TimelineData {
  timestamp: string;
  users: number;
  pageViews: number;
  events: number;
  conversions: number;
}

export interface Alert {
  id: string;
  type: 'spike' | 'drop' | 'anomaly' | 'goal' | 'error';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  metric: string;
  threshold: number;
  currentValue: number;
  timestamp: string;
  acknowledged: boolean;
  actions: AlertAction[];
}

export interface AlertAction {
  type: 'email' | 'sms' | 'webhook' | 'slack' | 'custom';
  target: string;
  message: string;
  executed: boolean;
  timestamp?: string;
}

// Cohort analysis interfaces
export interface CohortAnalysis {
  cohorts: Cohort[];
  metrics: CohortMetric[];
  periods: CohortPeriod[];
  analysis: CohortInsight[];
}

export interface Cohort {
  id: string;
  name: string;
  definition: CohortDefinition;
  size: number;
  createdAt: string;
  periods: CohortPeriodData[];
}

export interface CohortDefinition {
  type: 'acquisition' | 'behavioral' | 'demographic';
  criteria: CohortCriteria[];
  timeframe: string;
}

export interface CohortCriteria {
  dimension: string;
  operator: string;
  value: any;
}

export interface CohortPeriodData {
  period: number;
  users: number;
  retention: number;
  revenue: number;
  events: number;
}

export interface CohortMetric {
  name: string;
  type: 'retention' | 'revenue' | 'engagement' | 'custom';
  aggregation: 'sum' | 'average' | 'count' | 'unique';
  format: 'number' | 'percentage' | 'currency' | 'duration';
}

export interface CohortPeriod {
  name: string;
  duration: number;
  unit: 'day' | 'week' | 'month' | 'quarter' | 'year';
}

export interface CohortInsight {
  type: 'trend' | 'pattern' | 'anomaly' | 'opportunity';
  description: string;
  cohorts: string[];
  metrics: string[];
  confidence: number;
  recommendation: string;
}

// Export utility types
export type MetricValue = number | string | boolean;
export type MetricUnit = 'count' | 'percentage' | 'currency' | 'duration' | 'bytes' | 'rate';
export type MetricFormat = 'number' | 'percentage' | 'currency' | 'duration' | 'bytes';
export type TimeGranularity = 'minute' | 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year';
export type ComparisonPeriod = 'previous_period' | 'previous_year' | 'custom';
export type TrendDirection = 'up' | 'down' | 'stable';
export type PerformanceRating = 'excellent' | 'good' | 'fair' | 'poor';
export type AlertSeverity = Alert['severity'];
export type ReportType = AnalyticsReport['type'];
export type ChartType = ChartData['type'];
export type ExperimentStatus = Experiment['status'];
export type IntegrationType = Integration['type'];