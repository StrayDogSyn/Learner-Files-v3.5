export interface AIArtwork {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  thumbnailUrl?: string;
  model: string;
  style: string;
  prompt: string;
  negativePrompt?: string;
  dimensions: {
    width: number;
    height: number;
  };
  fileSize?: number;
  format: 'jpg' | 'png' | 'webp' | 'gif' | 'svg';
  tags: string[];
  category: string;
  createdAt: string;
  updatedAt?: string;
  featured?: boolean;
  nsfw?: boolean;
  public?: boolean;
  likes: number;
  views: number;
  downloads: number;
  shares: number;
  comments: number;
  rating?: number;
  generationSettings: GenerationSettings;
  metadata: ArtworkMetadata;
  analysis?: ArtworkAnalysis;
  variations?: ArtworkVariation[];
  collections?: string[];
  exhibitions?: Exhibition[];
  awards?: Award[];
  licensing?: LicensingInfo;
  provenance?: ProvenanceRecord[];
}

export interface GenerationSettings {
  model: string;
  version?: string;
  steps: number;
  cfgScale: number;
  sampler: string;
  seed?: number;
  temperature?: number;
  topP?: number;
  topK?: number;
  guidance?: number;
  strength?: number;
  noiseLevel?: number;
  aspectRatio?: string;
  resolution?: string;
  batchSize?: number;
  iterations?: number;
  upscaling?: UpscalingSettings;
  postProcessing?: PostProcessingSettings;
  customParameters?: Record<string, any>;
}

export interface UpscalingSettings {
  enabled: boolean;
  factor: number;
  model: string;
  method: 'esrgan' | 'real-esrgan' | 'waifu2x' | 'lanczos' | 'bicubic';
  denoising?: number;
  sharpening?: number;
}

export interface PostProcessingSettings {
  colorCorrection?: boolean;
  contrastEnhancement?: boolean;
  saturationBoost?: number;
  brightnessAdjustment?: number;
  sharpening?: number;
  noiseReduction?: number;
  faceEnhancement?: boolean;
  backgroundRemoval?: boolean;
  styleTransfer?: string;
  filters?: Filter[];
}

export interface Filter {
  name: string;
  type: 'color' | 'artistic' | 'blur' | 'sharpen' | 'noise' | 'distortion';
  intensity: number;
  parameters?: Record<string, any>;
}

export interface ArtworkMetadata {
  creator?: string;
  creatorId?: string;
  originalPrompt: string;
  processedPrompt?: string;
  generationTime: number;
  computeTime?: number;
  gpuUsed?: string;
  memoryUsed?: number;
  energyConsumed?: number;
  carbonFootprint?: number;
  cost?: number;
  currency?: string;
  platform: string;
  apiVersion?: string;
  clientVersion?: string;
  sessionId?: string;
  batchId?: string;
  experimentId?: string;
  modelCheckpoint?: string;
  trainingData?: string;
  ethicalConsiderations?: EthicalConsiderations;
  technicalSpecs?: TechnicalSpecs;
  qualityMetrics?: QualityMetrics;
}

export interface EthicalConsiderations {
  contentWarnings?: string[];
  biasAssessment?: BiasAssessment;
  fairnessMetrics?: FairnessMetrics;
  privacyCompliance?: boolean;
  consentObtained?: boolean;
  dataSource?: string;
  ethicalReview?: boolean;
  guidelines?: string[];
}

export interface BiasAssessment {
  genderBias?: number;
  racialBias?: number;
  ageBias?: number;
  culturalBias?: number;
  socioeconomicBias?: number;
  overallBias?: number;
  mitigationStrategies?: string[];
}

export interface FairnessMetrics {
  representation?: number;
  inclusion?: number;
  accessibility?: number;
  diversity?: number;
  equity?: number;
  recommendations?: string[];
}

export interface TechnicalSpecs {
  colorSpace: string;
  bitDepth: number;
  compression?: string;
  dpi?: number;
  iccProfile?: string;
  exifData?: Record<string, any>;
  checksum?: string;
  fileHash?: string;
  encoding?: string;
  metadata?: Record<string, any>;
}

export interface QualityMetrics {
  overall?: number;
  technical?: TechnicalQuality;
  artistic?: ArtisticQuality;
  semantic?: SemanticQuality;
  aesthetic?: AestheticQuality;
  originality?: number;
  coherence?: number;
  fidelity?: number;
  diversity?: number;
  innovation?: number;
}

export interface TechnicalQuality {
  resolution?: number;
  sharpness?: number;
  noise?: number;
  artifacts?: number;
  compression?: number;
  colorAccuracy?: number;
  exposure?: number;
  contrast?: number;
  saturation?: number;
  composition?: number;
}

export interface ArtisticQuality {
  creativity?: number;
  originality?: number;
  style?: number;
  technique?: number;
  expression?: number;
  emotion?: number;
  narrative?: number;
  symbolism?: number;
  aesthetics?: number;
  impact?: number;
}

export interface SemanticQuality {
  promptAdherence?: number;
  conceptClarity?: number;
  objectRecognition?: number;
  sceneUnderstanding?: number;
  contextualRelevance?: number;
  logicalConsistency?: number;
  detailAccuracy?: number;
  spatialRelationships?: number;
  temporalConsistency?: number;
  narrativeCoherence?: number;
}

export interface AestheticQuality {
  beauty?: number;
  harmony?: number;
  balance?: number;
  proportion?: number;
  rhythm?: number;
  unity?: number;
  variety?: number;
  emphasis?: number;
  movement?: number;
  pattern?: number;
}

export interface ArtworkAnalysis {
  visual: VisualAnalysis;
  content: ContentAnalysis;
  style: StyleAnalysis;
  technical: TechnicalAnalysis;
  semantic: SemanticAnalysis;
  aesthetic: AestheticAnalysis;
  emotional: EmotionalAnalysis;
  cultural: CulturalAnalysis;
  historical: HistoricalAnalysis;
  market: MarketAnalysis;
  trends: TrendAnalysis;
  recommendations: AnalysisRecommendation[];
}

export interface VisualAnalysis {
  dominantColors: Color[];
  colorPalette: ColorPalette;
  composition: CompositionAnalysis;
  lighting: LightingAnalysis;
  texture: TextureAnalysis;
  shapes: ShapeAnalysis;
  patterns: PatternAnalysis;
  depth: DepthAnalysis;
  movement: MovementAnalysis;
  focus: FocusAnalysis;
}

export interface Color {
  hex: string;
  rgb: [number, number, number];
  hsl: [number, number, number];
  name?: string;
  percentage: number;
  prominence: number;
  emotion?: string[];
  associations?: string[];
}

export interface ColorPalette {
  primary: Color;
  secondary: Color[];
  accent: Color[];
  harmony: 'monochromatic' | 'analogous' | 'complementary' | 'triadic' | 'tetradic' | 'split-complementary';
  temperature: 'warm' | 'cool' | 'neutral';
  saturation: 'high' | 'medium' | 'low';
  brightness: 'bright' | 'medium' | 'dark';
  contrast: 'high' | 'medium' | 'low';
  mood: string[];
}

export interface CompositionAnalysis {
  rule: 'thirds' | 'golden-ratio' | 'center' | 'diagonal' | 'symmetrical' | 'asymmetrical';
  balance: 'symmetrical' | 'asymmetrical' | 'radial';
  focal: FocalPoint[];
  lines: LineAnalysis;
  space: SpaceAnalysis;
  framing: FramingAnalysis;
  perspective: PerspectiveAnalysis;
  proportion: ProportionAnalysis;
}

export interface FocalPoint {
  x: number;
  y: number;
  strength: number;
  type: 'primary' | 'secondary' | 'tertiary';
  element: string;
  technique: string[];
}

export interface LineAnalysis {
  dominant: 'horizontal' | 'vertical' | 'diagonal' | 'curved' | 'zigzag';
  leading: boolean;
  implied: boolean;
  rhythm: boolean;
  tension: number;
  flow: number;
}

export interface SpaceAnalysis {
  positive: number;
  negative: number;
  depth: number;
  layering: number;
  overlap: boolean;
  scale: number;
}

export interface FramingAnalysis {
  type: 'natural' | 'architectural' | 'created' | 'none';
  effectiveness: number;
  elements: string[];
  focus: number;
}

export interface PerspectiveAnalysis {
  type: 'linear' | 'atmospheric' | 'overlapping' | 'size' | 'position';
  vanishingPoints: number;
  horizon: number;
  depth: number;
  dimension: '2d' | '2.5d' | '3d';
}

export interface ProportionAnalysis {
  golden: boolean;
  fibonacci: boolean;
  rule: string;
  harmony: number;
  relationships: string[];
}

export interface LightingAnalysis {
  source: 'natural' | 'artificial' | 'mixed' | 'ambient';
  direction: 'front' | 'back' | 'side' | 'top' | 'bottom' | 'multiple';
  quality: 'hard' | 'soft' | 'diffused' | 'dramatic';
  mood: string[];
  shadows: ShadowAnalysis;
  highlights: HighlightAnalysis;
  contrast: number;
  temperature: 'warm' | 'cool' | 'neutral';
}

export interface ShadowAnalysis {
  presence: boolean;
  type: 'cast' | 'form' | 'core' | 'occlusion';
  intensity: number;
  direction: string;
  softness: number;
  color: string;
}

export interface HighlightAnalysis {
  presence: boolean;
  intensity: number;
  distribution: string;
  specular: boolean;
  diffuse: boolean;
  color: string;
}

export interface TextureAnalysis {
  dominant: string[];
  variety: number;
  contrast: number;
  pattern: boolean;
  organic: boolean;
  synthetic: boolean;
  tactile: string[];
  visual: string[];
}

export interface ShapeAnalysis {
  geometric: string[];
  organic: string[];
  dominant: 'geometric' | 'organic' | 'mixed';
  complexity: number;
  repetition: boolean;
  variation: number;
}

export interface PatternAnalysis {
  presence: boolean;
  type: string[];
  regularity: 'regular' | 'irregular' | 'random';
  scale: 'large' | 'medium' | 'small' | 'mixed';
  rhythm: boolean;
  repetition: number;
}

export interface DepthAnalysis {
  layers: number;
  foreground: string[];
  middleground: string[];
  background: string[];
  techniques: string[];
  effectiveness: number;
}

export interface MovementAnalysis {
  presence: boolean;
  type: 'actual' | 'implied' | 'both';
  direction: string[];
  flow: number;
  rhythm: boolean;
  energy: number;
}

export interface FocusAnalysis {
  primary: string;
  secondary: string[];
  technique: string[];
  clarity: number;
  isolation: number;
  emphasis: number;
}

export interface ContentAnalysis {
  objects: DetectedObject[];
  scenes: DetectedScene[];
  people: PersonAnalysis[];
  animals: AnimalAnalysis[];
  activities: ActivityAnalysis[];
  emotions: EmotionAnalysis[];
  concepts: ConceptAnalysis[];
  narrative: NarrativeAnalysis;
  symbolism: SymbolismAnalysis;
  themes: ThemeAnalysis[];
}

export interface DetectedObject {
  name: string;
  confidence: number;
  boundingBox: BoundingBox;
  attributes: string[];
  relationships: string[];
  prominence: number;
  context: string;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DetectedScene {
  name: string;
  confidence: number;
  attributes: string[];
  mood: string;
  setting: string;
  timeOfDay?: string;
  weather?: string;
  season?: string;
}

export interface PersonAnalysis {
  count: number;
  demographics: Demographics[];
  poses: PoseAnalysis[];
  expressions: ExpressionAnalysis[];
  clothing: ClothingAnalysis[];
  interactions: InteractionAnalysis[];
}

export interface Demographics {
  ageRange: string;
  gender: string;
  ethnicity: string;
  confidence: number;
  biasWarning?: boolean;
}

export interface PoseAnalysis {
  type: string;
  confidence: number;
  keypoints: Keypoint[];
  action: string;
  emotion: string;
}

export interface Keypoint {
  name: string;
  x: number;
  y: number;
  confidence: number;
}

export interface ExpressionAnalysis {
  emotion: string;
  intensity: number;
  confidence: number;
  features: string[];
}

export interface ClothingAnalysis {
  items: ClothingItem[];
  style: string;
  era: string;
  formality: string;
  colors: string[];
}

export interface ClothingItem {
  type: string;
  color: string;
  style: string;
  confidence: number;
  boundingBox: BoundingBox;
}

export interface InteractionAnalysis {
  type: string;
  participants: number;
  relationship: string;
  emotion: string;
  context: string;
}

export interface AnimalAnalysis {
  species: string[];
  count: number;
  behaviors: string[];
  interactions: string[];
  environment: string;
}

export interface ActivityAnalysis {
  primary: string;
  secondary: string[];
  context: string;
  participants: number;
  setting: string;
  tools: string[];
}

export interface EmotionAnalysis {
  overall: string;
  intensity: number;
  specific: SpecificEmotion[];
  valence: number;
  arousal: number;
  dominance: number;
}

export interface SpecificEmotion {
  emotion: string;
  intensity: number;
  confidence: number;
  indicators: string[];
}

export interface ConceptAnalysis {
  abstract: string[];
  concrete: string[];
  relationships: ConceptRelationship[];
  hierarchy: ConceptHierarchy;
  associations: string[];
}

export interface ConceptRelationship {
  concept1: string;
  concept2: string;
  relationship: string;
  strength: number;
}

export interface ConceptHierarchy {
  superordinate: string[];
  basic: string[];
  subordinate: string[];
}

export interface NarrativeAnalysis {
  story: boolean;
  elements: NarrativeElement[];
  structure: string;
  perspective: string;
  time: string;
  conflict: string;
  resolution: string;
}

export interface NarrativeElement {
  type: 'character' | 'setting' | 'plot' | 'conflict' | 'theme';
  description: string;
  importance: number;
  relationships: string[];
}

export interface SymbolismAnalysis {
  symbols: Symbol[];
  metaphors: Metaphor[];
  allegories: Allegory[];
  cultural: CulturalSymbol[];
  personal: PersonalSymbol[];
}

export interface Symbol {
  element: string;
  meaning: string[];
  confidence: number;
  cultural: boolean;
  universal: boolean;
  context: string;
}

export interface Metaphor {
  source: string;
  target: string;
  mapping: string;
  strength: number;
  type: string;
}

export interface Allegory {
  surface: string;
  deeper: string;
  elements: string[];
  interpretation: string;
}

export interface CulturalSymbol {
  symbol: string;
  culture: string;
  meaning: string;
  context: string;
  significance: number;
}

export interface PersonalSymbol {
  symbol: string;
  meaning: string;
  frequency: number;
  evolution: string;
}

export interface ThemeAnalysis {
  theme: string;
  prominence: number;
  elements: string[];
  development: string;
  resolution: string;
}

export interface StyleAnalysis {
  movement: string[];
  period: string;
  influences: string[];
  techniques: string[];
  characteristics: string[];
  similarity: StyleSimilarity[];
  evolution: StyleEvolution;
  innovation: StyleInnovation;
}

export interface StyleSimilarity {
  style: string;
  similarity: number;
  commonElements: string[];
  differences: string[];
}

export interface StyleEvolution {
  historical: string[];
  contemporary: string[];
  future: string[];
  trajectory: string;
}

export interface StyleInnovation {
  novel: string[];
  hybrid: string[];
  experimental: string[];
  potential: number;
}

export interface TechnicalAnalysis {
  quality: TechnicalQuality;
  artifacts: Artifact[];
  processing: ProcessingAnalysis;
  optimization: OptimizationAnalysis;
  compatibility: CompatibilityAnalysis;
  performance: PerformanceAnalysis;
}

export interface Artifact {
  type: string;
  severity: 'low' | 'medium' | 'high';
  location: BoundingBox[];
  description: string;
  cause: string;
  solution: string;
}

export interface ProcessingAnalysis {
  pipeline: string[];
  optimizations: string[];
  bottlenecks: string[];
  efficiency: number;
  recommendations: string[];
}

export interface OptimizationAnalysis {
  fileSize: FileSizeAnalysis;
  quality: QualityOptimization;
  delivery: DeliveryOptimization;
  caching: CachingAnalysis;
}

export interface FileSizeAnalysis {
  current: number;
  optimal: number;
  compression: number;
  format: string;
  recommendations: string[];
}

export interface QualityOptimization {
  current: number;
  potential: number;
  techniques: string[];
  tradeoffs: string[];
}

export interface DeliveryOptimization {
  formats: string[];
  responsive: boolean;
  progressive: boolean;
  lazy: boolean;
  cdn: boolean;
}

export interface CachingAnalysis {
  strategy: string;
  duration: number;
  invalidation: string;
  efficiency: number;
}

export interface CompatibilityAnalysis {
  browsers: BrowserCompatibility[];
  devices: DeviceCompatibility[];
  platforms: PlatformCompatibility[];
  accessibility: AccessibilityAnalysis;
}

export interface BrowserCompatibility {
  browser: string;
  version: string;
  support: boolean;
  issues: string[];
  fallbacks: string[];
}

export interface DeviceCompatibility {
  device: string;
  support: boolean;
  performance: number;
  issues: string[];
  optimizations: string[];
}

export interface PlatformCompatibility {
  platform: string;
  support: boolean;
  native: boolean;
  issues: string[];
  requirements: string[];
}

export interface AccessibilityAnalysis {
  score: number;
  issues: AccessibilityIssue[];
  recommendations: string[];
  compliance: ComplianceLevel[];
}

export interface AccessibilityIssue {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  solution: string;
  guidelines: string[];
}

export interface ComplianceLevel {
  standard: 'WCAG-A' | 'WCAG-AA' | 'WCAG-AAA' | 'Section-508';
  compliant: boolean;
  issues: string[];
  requirements: string[];
}

export interface PerformanceAnalysis {
  loading: LoadingPerformance;
  rendering: RenderingPerformance;
  memory: MemoryPerformance;
  network: NetworkPerformance;
  optimization: PerformanceOptimization;
}

export interface LoadingPerformance {
  time: number;
  progressive: boolean;
  lazy: boolean;
  preload: boolean;
  critical: boolean;
}

export interface RenderingPerformance {
  time: number;
  blocking: boolean;
  reflow: number;
  repaint: number;
  composite: number;
}

export interface MemoryPerformance {
  usage: number;
  peak: number;
  leaks: boolean;
  efficiency: number;
  cleanup: boolean;
}

export interface NetworkPerformance {
  requests: number;
  bandwidth: number;
  latency: number;
  caching: boolean;
  compression: boolean;
}

export interface PerformanceOptimization {
  potential: number;
  techniques: string[];
  priorities: string[];
  impact: string[];
}

export interface SemanticAnalysis {
  meaning: MeaningAnalysis;
  context: ContextAnalysis;
  relevance: RelevanceAnalysis;
  coherence: CoherenceAnalysis;
  completeness: CompletenessAnalysis;
}

export interface MeaningAnalysis {
  literal: string[];
  figurative: string[];
  implied: string[];
  ambiguous: string[];
  clarity: number;
}

export interface ContextAnalysis {
  cultural: string[];
  historical: string[];
  social: string[];
  personal: string[];
  situational: string[];
}

export interface RelevanceAnalysis {
  prompt: number;
  context: number;
  audience: number;
  purpose: number;
  overall: number;
}

export interface CoherenceAnalysis {
  internal: number;
  external: number;
  logical: number;
  visual: number;
  narrative: number;
}

export interface CompletenessAnalysis {
  elements: number;
  details: number;
  context: number;
  story: number;
  overall: number;
}

export interface AestheticAnalysis {
  beauty: BeautyAnalysis;
  harmony: HarmonyAnalysis;
  balance: BalanceAnalysis;
  proportion: ProportionAnalysis;
  rhythm: RhythmAnalysis;
  unity: UnityAnalysis;
  variety: VarietyAnalysis;
  emphasis: EmphasisAnalysis;
  movement: MovementAnalysis;
  pattern: PatternAnalysis;
}

export interface BeautyAnalysis {
  overall: number;
  classical: number;
  modern: number;
  subjective: number;
  objective: number;
  cultural: number;
}

export interface HarmonyAnalysis {
  color: number;
  form: number;
  content: number;
  style: number;
  overall: number;
}

export interface BalanceAnalysis {
  visual: number;
  compositional: number;
  tonal: number;
  spatial: number;
  overall: number;
}

export interface RhythmAnalysis {
  visual: number;
  compositional: number;
  color: number;
  form: number;
  overall: number;
}

export interface UnityAnalysis {
  visual: number;
  thematic: number;
  stylistic: number;
  compositional: number;
  overall: number;
}

export interface VarietyAnalysis {
  visual: number;
  compositional: number;
  color: number;
  form: number;
  overall: number;
}

export interface EmphasisAnalysis {
  focal: number;
  contrast: number;
  isolation: number;
  placement: number;
  overall: number;
}

export interface EmotionalAnalysis {
  primary: string;
  secondary: string[];
  intensity: number;
  valence: number;
  arousal: number;
  dominance: number;
  complexity: number;
  authenticity: number;
  universality: number;
  cultural: number;
  personal: number;
  temporal: TemporalEmotion[];
  spatial: SpatialEmotion[];
}

export interface TemporalEmotion {
  timepoint: number;
  emotion: string;
  intensity: number;
  transition: string;
}

export interface SpatialEmotion {
  region: BoundingBox;
  emotion: string;
  intensity: number;
  influence: number;
}

export interface CulturalAnalysis {
  origin: string[];
  influences: string[];
  references: CulturalReference[];
  appropriation: AppropriationAnalysis;
  sensitivity: SensitivityAnalysis;
  representation: RepresentationAnalysis;
  context: CulturalContext;
}

export interface CulturalReference {
  culture: string;
  element: string;
  type: 'symbol' | 'tradition' | 'artifact' | 'practice' | 'belief';
  accuracy: number;
  respect: number;
  context: string;
}

export interface AppropriationAnalysis {
  risk: 'low' | 'medium' | 'high';
  elements: string[];
  concerns: string[];
  recommendations: string[];
  alternatives: string[];
}

export interface SensitivityAnalysis {
  score: number;
  issues: SensitivityIssue[];
  recommendations: string[];
  guidelines: string[];
}

export interface SensitivityIssue {
  type: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  impact: string;
  solution: string;
}

export interface RepresentationAnalysis {
  diversity: number;
  inclusion: number;
  stereotypes: Stereotype[];
  bias: BiasAnalysis;
  authenticity: number;
}

export interface Stereotype {
  type: string;
  description: string;
  harmful: boolean;
  perpetuation: number;
  alternatives: string[];
}

export interface BiasAnalysis {
  types: string[];
  severity: number;
  impact: string[];
  mitigation: string[];
}

export interface CulturalContext {
  historical: string;
  social: string;
  political: string;
  economic: string;
  religious: string;
  artistic: string;
}

export interface HistoricalAnalysis {
  period: string[];
  movements: string[];
  influences: HistoricalInfluence[];
  evolution: HistoricalEvolution;
  significance: HistoricalSignificance;
  parallels: HistoricalParallel[];
}

export interface HistoricalInfluence {
  period: string;
  movement: string;
  artist: string;
  work: string;
  influence: number;
  elements: string[];
}

export interface HistoricalEvolution {
  predecessors: string[];
  contemporaries: string[];
  successors: string[];
  trajectory: string;
}

export interface HistoricalSignificance {
  artistic: number;
  cultural: number;
  social: number;
  technical: number;
  overall: number;
}

export interface HistoricalParallel {
  period: string;
  work: string;
  similarity: number;
  differences: string[];
  context: string;
}

export interface MarketAnalysis {
  value: MarketValue;
  demand: MarketDemand;
  trends: MarketTrend[];
  competition: CompetitionAnalysis;
  positioning: MarketPositioning;
  opportunities: MarketOpportunity[];
}

export interface MarketValue {
  estimated: number;
  currency: string;
  factors: ValueFactor[];
  comparables: Comparable[];
  appreciation: number;
}

export interface ValueFactor {
  factor: string;
  impact: number;
  weight: number;
  description: string;
}

export interface Comparable {
  artwork: string;
  value: number;
  similarity: number;
  differences: string[];
}

export interface MarketDemand {
  current: number;
  projected: number;
  segments: DemandSegment[];
  drivers: string[];
  barriers: string[];
}

export interface DemandSegment {
  segment: string;
  size: number;
  growth: number;
  characteristics: string[];
  preferences: string[];
}

export interface MarketTrend {
  trend: string;
  direction: 'up' | 'down' | 'stable';
  strength: number;
  duration: string;
  impact: string[];
}

export interface CompetitionAnalysis {
  competitors: Competitor[];
  positioning: string;
  advantages: string[];
  disadvantages: string[];
  differentiation: string[];
}

export interface Competitor {
  name: string;
  type: 'direct' | 'indirect';
  strength: number;
  weaknesses: string[];
  strategies: string[];
}

export interface MarketPositioning {
  segment: string;
  niche: string;
  value: string;
  differentiation: string[];
  messaging: string[];
}

export interface MarketOpportunity {
  opportunity: string;
  size: number;
  probability: number;
  timeline: string;
  requirements: string[];
}

export interface TrendAnalysis {
  current: CurrentTrend[];
  emerging: EmergingTrend[];
  declining: DecliningTrend[];
  predictions: TrendPrediction[];
  influence: TrendInfluence;
}

export interface CurrentTrend {
  trend: string;
  popularity: number;
  duration: string;
  adoption: number;
  examples: string[];
}

export interface EmergingTrend {
  trend: string;
  potential: number;
  timeline: string;
  drivers: string[];
  indicators: string[];
}

export interface DecliningTrend {
  trend: string;
  decline: number;
  reasons: string[];
  timeline: string;
  alternatives: string[];
}

export interface TrendPrediction {
  trend: string;
  probability: number;
  timeline: string;
  impact: string[];
  preparation: string[];
}

export interface TrendInfluence {
  following: number;
  setting: number;
  adapting: number;
  innovating: number;
  overall: number;
}

export interface AnalysisRecommendation {
  category: string;
  recommendation: string;
  priority: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  rationale: string;
  implementation: string[];
  resources: string[];
  timeline: string;
}

export interface ArtworkVariation {
  id: string;
  type: 'style' | 'composition' | 'color' | 'detail' | 'format' | 'resolution';
  title: string;
  description: string;
  imageUrl: string;
  thumbnailUrl?: string;
  differences: string[];
  similarity: number;
  generationSettings: GenerationSettings;
  metadata: Partial<ArtworkMetadata>;
}

export interface Exhibition {
  id: string;
  title: string;
  description: string;
  curator: string;
  venue: string;
  startDate: string;
  endDate: string;
  theme: string;
  artworks: string[];
  featured: boolean;
  virtual: boolean;
  physical: boolean;
  website?: string;
  catalog?: string;
}

export interface Award {
  id: string;
  name: string;
  organization: string;
  category: string;
  year: string;
  description: string;
  criteria: string[];
  significance: 'local' | 'national' | 'international';
  monetary?: number;
  currency?: string;
}

export interface LicensingInfo {
  type: 'public-domain' | 'creative-commons' | 'commercial' | 'restricted';
  license: string;
  permissions: string[];
  restrictions: string[];
  attribution: string;
  commercial: boolean;
  derivatives: boolean;
  shareAlike: boolean;
  price?: number;
  currency?: string;
  terms?: string;
}

export interface ProvenanceRecord {
  id: string;
  timestamp: string;
  event: 'created' | 'modified' | 'transferred' | 'exhibited' | 'sold' | 'licensed';
  actor: string;
  description: string;
  location?: string;
  value?: number;
  currency?: string;
  verification: string;
  signature?: string;
  hash?: string;
}

// Gallery management interfaces
export interface GalleryCollection {
  id: string;
  title: string;
  description: string;
  curator: string;
  artworks: string[];
  tags: string[];
  category: string;
  featured: boolean;
  public: boolean;
  createdAt: string;
  updatedAt: string;
  coverImage?: string;
  theme?: string;
  story?: string;
  statistics: CollectionStatistics;
}

export interface CollectionStatistics {
  artworkCount: number;
  totalViews: number;
  totalLikes: number;
  totalShares: number;
  totalDownloads: number;
  averageRating: number;
  uniqueVisitors: number;
  engagementRate: number;
  completionRate: number;
  timeSpent: number;
}

export interface GalleryFilters {
  models?: string[];
  styles?: string[];
  tags?: string[];
  categories?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  dimensions?: {
    minWidth: number;
    maxWidth: number;
    minHeight: number;
    maxHeight: number;
  };
  rating?: {
    min: number;
    max: number;
  };
  featured?: boolean;
  nsfw?: boolean;
  public?: boolean;
  hasVariations?: boolean;
  inCollections?: string[];
  search?: string;
}

export interface GallerySort {
  field: 'title' | 'createdAt' | 'views' | 'likes' | 'rating' | 'downloads' | 'random';
  order: 'asc' | 'desc';
}

export interface GallerySearchResult {
  artworks: AIArtwork[];
  total: number;
  page: number;
  pageSize: number;
  filters: GalleryFilters;
  sort: GallerySort;
  facets: GalleryFacets;
  suggestions?: string[];
  relatedArtworks?: AIArtwork[];
  collections?: GalleryCollection[];
}

export interface GalleryFacets {
  models: FacetItem[];
  styles: FacetItem[];
  tags: FacetItem[];
  categories: FacetItem[];
  years: FacetItem[];
  dimensions: DimensionFacet[];
  ratings: RatingFacet[];
}

export interface FacetItem {
  value: string;
  count: number;
  selected?: boolean;
}

export interface DimensionFacet {
  range: string;
  count: number;
  selected?: boolean;
}

export interface RatingFacet {
  rating: number;
  count: number;
  selected?: boolean;
}

export interface GalleryStatistics {
  totalArtworks: number;
  totalViews: number;
  totalLikes: number;
  totalShares: number;
  totalDownloads: number;
  totalCollections: number;
  uniqueVisitors: number;
  averageRating: number;
  topModels: ModelStatistic[];
  topStyles: StyleStatistic[];
  topTags: TagStatistic[];
  recentActivity: GalleryActivity[];
  trendingArtworks: AIArtwork[];
  featuredCollections: GalleryCollection[];
}

export interface ModelStatistic {
  model: string;
  count: number;
  percentage: number;
  averageRating: number;
  totalViews: number;
}

export interface StyleStatistic {
  style: string;
  count: number;
  percentage: number;
  averageRating: number;
  totalViews: number;
}

export interface TagStatistic {
  tag: string;
  count: number;
  percentage: number;
  trending: boolean;
  growth: number;
}

export interface GalleryActivity {
  id: string;
  type: 'artwork_created' | 'artwork_liked' | 'artwork_shared' | 'collection_created' | 'exhibition_opened';
  artworkId?: string;
  collectionId?: string;
  exhibitionId?: string;
  title: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

// Export utility types
export type ArtworkModel = string;
export type ArtworkStyle = string;
export type ArtworkCategory = string;
export type ArtworkTag = string;
export type ArtworkFormat = AIArtwork['format'];
export type GenerationModel = string;
export type SamplerType = string;
export type UpscalingMethod = UpscalingSettings['method'];
export type FilterType = Filter['type'];
export type QualityAspect = keyof QualityMetrics;
export type AnalysisCategory = keyof ArtworkAnalysis;
export type LicenseType = LicensingInfo['type'];
export type ProvenanceEvent = ProvenanceRecord['event'];
export type GalleryViewMode = 'grid' | 'masonry' | 'list' | 'slideshow';
export type SortField = GallerySort['field'];
export type SortOrder = GallerySort['order'];