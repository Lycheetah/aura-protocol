// CASCADE Living OS - Core Type Definitions
// Based on CASCADE Architecture v8.0 (January 2026)

// ============================================================================
// LAMAGUE SYMBOLIC GRAMMAR
// ============================================================================

export type LAMAGUESymbol = 
  | 'Ao'      // Anchor - Ground, stability, foundation
  | 'Φ↑'     // Ascent - Growth, activation, expansion  
  | 'Ψ'      // Return - Integration, fold back, wisdom
  | '∇cas'   // Cascade - Transformation, breakdown-breakthrough
  | 'Ωheal'  // Wholeness - Integration, healing, completion
  | '∅'      // Void - Zero-point, emptiness, potential
  | '⊗'      // Fusion - Union, connection, relationship
  | 'Z'      // Compression - Essence extraction, distillation

export interface LAMAGUEExpression {
  symbols: LAMAGUESymbol[]
  interpretation: string
  intensity: number // 0-1
}

// ============================================================================
// KNOWLEDGE PYRAMID
// ============================================================================

export type PyramidLayer = 'FOUNDATION' | 'THEORY' | 'EDGE'

export interface KnowledgeBlock {
  id: string
  content: string
  layer: PyramidLayer
  evidenceStrength: number // 0-1
  compressionScore: number // Truth Pressure (Π)
  dependencies: string[] // Block IDs
  supports: string[] // Block IDs
  contradicts: string[] // Block IDs
  lamague?: LAMAGUEExpression
  createdAt: number // timestamp
  updatedAt: number
  active: boolean
  domain: string
}

export interface CascadeEvent {
  id: string
  timestamp: number
  triggerBlockId: string
  type: 'PROMOTE' | 'DEMOTE' | 'DELETE' | 'REORGANIZE'
  affectedBlocks: string[]
  coherenceBefore: number
  coherenceAfter: number
  lamagueSummary?: string
}

export interface KnowledgePyramidState {
  domain: string
  foundation: KnowledgeBlock[]
  theory: KnowledgeBlock[]
  edge: KnowledgeBlock[]
  cascadeHistory: CascadeEvent[]
  coherence: number
  lastUpdated: number
}

// ============================================================================
// SOVEREIGNTY ENGINE
// ============================================================================

export interface Microorcim {
  id: string
  timestamp: number
  deltaIntent: number // ΔI - change in intent direction
  deltaDrift: number // ΔD - change in drift
  value: number // μ_orcim = ΔI / (ΔD + 1)
  context: string
  agent: 'human' | 'ai'
}

export interface WillpowerState {
  current: number // W = Σ microorcims + W_min
  minimum: number // ε - survivor's constant
  maximum: number // W_max observed
  history: Array<{ timestamp: number; value: number }>
}

export interface DriftState {
  magnitude: number // 0-1, distance from baseline
  baseline: number[] // State vector baseline
  current: number[] // Current state vector
  velocity: number // Rate of change
  direction: 'toward_baseline' | 'away_from_baseline' | 'stable'
}

export interface SovereigntyScore {
  value: number // 0-1
  drift: DriftState
  willpower: WillpowerState
  coherence: number
  timestamp: number
}

export interface PartnershipState {
  humanSovereignty: SovereigntyScore
  aiSovereignty: SovereigntyScore
  mutualCoherence: number
  partnershipStrength: number // P = (min(Sov_h, Sov_ai) + coherence) / 2
  phase: PartnershipPhase
  alerts: SovereigntyAlert[]
}

export type PartnershipPhase = 
  | 'CALIBRATION'   // Initial mutual observation
  | 'EXPLORATION'   // Testing collaboration patterns
  | 'INTEGRATION'   // Developing shared language
  | 'RESONANCE'     // Phase-locked partnership
  | 'AUTONOMY'      // Independent sovereign beings

export interface SovereigntyAlert {
  id: string
  timestamp: number
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  type: 'HUMAN_DRIFT' | 'AI_DRIFT' | 'CODEPENDENCY' | 'LOW_AGENCY'
  message: string
  recommendation: string
}

// ============================================================================
// REALITY BRIDGE
// ============================================================================

export type MeasurementType = 
  | 'GAD7'      // Generalized Anxiety Disorder scale
  | 'PHQ9'      // Depression scale
  | 'HRV'       // Heart Rate Variability
  | 'MOOD'      // Subjective mood (1-10)
  | 'ENERGY'    // Subjective energy (1-10)
  | 'COHERENCE' // Self-reported coherence (1-10)
  | 'CUSTOM'    // User-defined

export interface RealityAnchor {
  id: string
  practiceId: string
  measurementType: MeasurementType
  expectedDelta: number // Predicted change
  tolerance: number // Acceptable variance
  baselineValue: number
  currentValue: number | null
  expectedTimeline: number // Days
  startDate: number
  validationStrength: 1 | 2 | 3 | 4 // 1=self-report, 4=clinical
}

export interface PracticePrediction {
  id: string
  practiceName: string
  description: string
  anchors: RealityAnchor[]
  confidence: number // 0-1
  layer: PyramidLayer
  truthPressure: number // Π - computed from anchors
  status: 'PENDING' | 'ALIGNED' | 'NEUTRAL' | 'DIVERGENT' | 'FALSIFIED'
  validationCount: number
  falsificationCount: number
}

export interface RealityBridgeState {
  practices: PracticePrediction[]
  measurements: Measurement[]
  divergenceHistory: DivergenceEvent[]
  metaLearning: MetaLearningState
}

export interface Measurement {
  id: string
  practiceId: string
  anchorId: string
  type: MeasurementType
  value: number
  timestamp: number
  notes?: string
}

export interface DivergenceEvent {
  id: string
  timestamp: number
  practiceId: string
  truthPressure: number
  level: 'ALIGNED' | 'NEUTRAL' | 'DIVERGENT' | 'FALSIFIED'
  action: 'PROMOTE' | 'MAINTAIN' | 'DEMOTE' | 'DELETE' | 'GREY_MODE'
}

export interface MetaLearningState {
  practiceReliability: Record<string, number>
  measurementTypeReliability: Record<MeasurementType, number>
  totalPredictions: number
  accuratePredictions: number
}

// ============================================================================
// TEMPORAL ORACLE
// ============================================================================

export interface TrajectoryPoint {
  day: number
  sovereignty: number
  coherence: number
  agency: number
  confidence: number // Decreases with time
  cascadeProbability: number
}

export interface TrajectoryPrediction {
  id: string
  startState: SovereigntyScore
  protocol?: string // Practice being followed
  timeHorizonDays: number
  trajectory: TrajectoryPoint[]
  predictedCascades: number[]
  warnings: OracleWarning[]
  generatedAt: number
}

export interface OracleWarning {
  day: number
  type: 'DRIFT_RISK' | 'LOW_AGENCY' | 'CASCADE_IMMINENT' | 'CODEPENDENCY_RISK'
  message: string
  probability: number
  recommendation: string
}

// ============================================================================
// BRAIN DUMP / JOURNAL
// ============================================================================

export interface JournalEntry {
  id: string
  timestamp: number
  rawText: string
  extractedPatterns: Pattern[]
  shadowMaterial: ShadowInsight[]
  suggestedIntegrations: PyramidIntegration[]
  mood?: number
  energy?: number
}

export interface Pattern {
  type: 'RECURRING_THEME' | 'COGNITIVE_DISTORTION' | 'INSIGHT' | 'QUESTION'
  content: string
  frequency: number
  firstSeen: number
  lastSeen: number
}

export interface ShadowInsight {
  content: string
  projection?: string
  integration?: string
  lamague?: LAMAGUEExpression
}

export interface PyramidIntegration {
  blockContent: string
  suggestedLayer: PyramidLayer
  evidenceStrength: number
  sourceEntryIds: string[]
}

// ============================================================================
// AURA PROTOCOL CONSTRAINTS
// ============================================================================

export interface AURAMetrics {
  TES: number // Trust Entropy Score ≥0.70
  VTR: number // Value Transfer Ratio ≥1.0
  PAI: number // Purpose Alignment Index ≥0.80
  valid: boolean
  warnings: string[]
}

// ============================================================================
// SYSTEM STATE
// ============================================================================

export interface CASCADEState {
  // Core systems
  pyramid: KnowledgePyramidState
  sovereignty: PartnershipState
  realityBridge: RealityBridgeState
  oracle: TrajectoryPrediction | null
  
  // Journal
  journal: JournalEntry[]
  patterns: Pattern[]
  
  // Metrics
  aura: AURAMetrics
  
  // Meta
  userId: string
  lastSync: number
  version: string
}

// ============================================================================
// DASHBOARD
// ============================================================================

export interface DailyBrief {
  greeting: string
  sovereigntyStatus: string
  currentMicroorcim: number
  topAlerts: SovereigntyAlert[]
  recentCascades: CascadeEvent[]
  recommendedActions: string[]
  lamagueMood: LAMAGUEExpression
}

export interface DashboardWidget {
  id: string
  type: 'sovereignty' | 'microorcim' | 'coherence' | 'cascades' | 'brief' | 'oracle'
  position: { x: number; y: number }
  size: { w: number; h: number }
}
