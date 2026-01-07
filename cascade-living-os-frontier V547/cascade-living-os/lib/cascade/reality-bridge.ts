// CASCADE Living OS - Reality Bridge
// Falsifiable predictions validated against measured reality

import {
  RealityAnchor,
  PracticePrediction,
  Measurement,
  DivergenceEvent,
  RealityBridgeState,
  MetaLearningState,
  MeasurementType,
  PyramidLayer
} from '@/types/cascade'

// ============================================================================
// CONSTANTS
// ============================================================================

const CASCADE_THRESHOLD = 0.8 // Π below this triggers reorganization
const DELETION_THRESHOLD = 0.5 // Π below this suggests deletion
const CONFIDENCE_DECAY = 0.95 // How fast untested claims lose confidence

// Truth pressure thresholds
const ALIGNED_THRESHOLD = 1.3
const NEUTRAL_THRESHOLD = 0.8
const DIVERGENT_THRESHOLD = 0.5

// ============================================================================
// TRUTH PRESSURE CALCULATION
// ============================================================================

/**
 * Calculate truth pressure for a single anchor
 * Π_anchor = exp(-divergence) × (validation_strength / 2.0)
 */
export function calculateAnchorTruthPressure(anchor: RealityAnchor): number {
  if (anchor.currentValue === null) {
    return 1.0 // Neutral until measured
  }
  
  const actualDelta = anchor.currentValue - anchor.baselineValue
  const divergence = Math.abs(actualDelta - anchor.expectedDelta) / (anchor.tolerance + 0.01)
  const confidence = Math.exp(-divergence)
  const strengthMultiplier = anchor.validationStrength / 2.0
  
  return confidence * strengthMultiplier
}

/**
 * Calculate overall truth pressure for a practice prediction
 * Π_practice = Σ(Π_anchor_i × weight_i) / Σ(weight_i)
 */
export function calculatePracticeTruthPressure(prediction: PracticePrediction): number {
  if (prediction.anchors.length === 0) {
    return 0.5 // Penalty for no anchors
  }
  
  const readyAnchors = prediction.anchors.filter(a => a.currentValue !== null)
  if (readyAnchors.length === 0) {
    return 1.0 // Neutral until measured
  }
  
  let weightedSum = 0
  let totalWeight = 0
  
  for (const anchor of readyAnchors) {
    const π = calculateAnchorTruthPressure(anchor)
    const weight = anchor.validationStrength
    weightedSum += π * weight
    totalWeight += weight
  }
  
  return weightedSum / totalWeight
}

// ============================================================================
// DIVERGENCE CLASSIFICATION
// ============================================================================

type DivergenceLevel = 'ALIGNED' | 'NEUTRAL' | 'DIVERGENT' | 'FALSIFIED'

/**
 * Classify divergence severity
 */
export function classifyDivergence(truthPressure: number): DivergenceLevel {
  if (truthPressure > ALIGNED_THRESHOLD) {
    return 'ALIGNED'
  } else if (truthPressure > NEUTRAL_THRESHOLD) {
    return 'NEUTRAL'
  } else if (truthPressure > DIVERGENT_THRESHOLD) {
    return 'DIVERGENT'
  }
  return 'FALSIFIED'
}

/**
 * Determine action based on divergence
 */
export function determineAction(
  level: DivergenceLevel,
  currentLayer: PyramidLayer
): 'PROMOTE' | 'MAINTAIN' | 'DEMOTE' | 'DELETE' | 'GREY_MODE' {
  switch (level) {
    case 'ALIGNED':
      if (currentLayer === 'EDGE') return 'PROMOTE'
      if (currentLayer === 'THEORY') return 'PROMOTE'
      return 'MAINTAIN'
    
    case 'NEUTRAL':
      return 'GREY_MODE' // Need more data
    
    case 'DIVERGENT':
      if (currentLayer === 'FOUNDATION') return 'DEMOTE'
      if (currentLayer === 'THEORY') return 'DEMOTE'
      return 'MAINTAIN'
    
    case 'FALSIFIED':
      return 'DELETE'
  }
}

// ============================================================================
// PREDICTION MANAGEMENT
// ============================================================================

/**
 * Create a new practice prediction
 */
export function createPrediction(
  practiceName: string,
  description: string,
  layer: PyramidLayer = 'EDGE'
): PracticePrediction {
  return {
    id: generateId(),
    practiceName,
    description,
    anchors: [],
    confidence: 0.5,
    layer,
    truthPressure: 1.0,
    status: 'PENDING',
    validationCount: 0,
    falsificationCount: 0
  }
}

/**
 * Add a reality anchor to a prediction
 */
export function addAnchor(
  prediction: PracticePrediction,
  anchor: Omit<RealityAnchor, 'id' | 'practiceId'>
): PracticePrediction {
  const newAnchor: RealityAnchor = {
    ...anchor,
    id: generateId(),
    practiceId: prediction.id
  }
  
  return {
    ...prediction,
    anchors: [...prediction.anchors, newAnchor]
  }
}

/**
 * Record a measurement for an anchor
 */
export function recordMeasurement(
  state: RealityBridgeState,
  practiceId: string,
  anchorId: string,
  value: number,
  notes?: string
): RealityBridgeState {
  const measurement: Measurement = {
    id: generateId(),
    practiceId,
    anchorId,
    type: 'CUSTOM',
    value,
    timestamp: Date.now(),
    notes
  }
  
  // Update the anchor with current value
  const newPractices = state.practices.map(p => {
    if (p.id !== practiceId) return p
    
    return {
      ...p,
      anchors: p.anchors.map(a => {
        if (a.id !== anchorId) return a
        return { ...a, currentValue: value }
      })
    }
  })
  
  return {
    ...state,
    practices: newPractices,
    measurements: [...state.measurements, measurement]
  }
}

// ============================================================================
// EVALUATION
// ============================================================================

/**
 * Evaluate a single prediction
 */
export function evaluatePrediction(
  prediction: PracticePrediction
): { 
  truthPressure: number
  level: DivergenceLevel
  action: string
  recommendation: string
} {
  const π = calculatePracticeTruthPressure(prediction)
  const level = classifyDivergence(π)
  const action = determineAction(level, prediction.layer)
  
  let recommendation = ''
  
  switch (level) {
    case 'FALSIFIED':
      recommendation = `Practice "${prediction.practiceName}" contradicted by reality. Π=${π.toFixed(2)}. Consider removal or major revision.`
      break
    case 'DIVERGENT':
      recommendation = `Practice "${prediction.practiceName}" shows concerning divergence. Π=${π.toFixed(2)}. Trigger cascade to reorganize.`
      break
    case 'NEUTRAL':
      recommendation = `Practice "${prediction.practiceName}" unclear. Π=${π.toFixed(2)}. Needs more data.`
      break
    case 'ALIGNED':
      recommendation = `Practice "${prediction.practiceName}" validated by reality. Π=${π.toFixed(2)}. Consider promotion.`
      break
  }
  
  return { truthPressure: π, level, action, recommendation }
}

/**
 * Evaluate all practices and generate divergence events
 */
export function evaluateAll(
  state: RealityBridgeState
): RealityBridgeState {
  const newDivergenceHistory: DivergenceEvent[] = [...state.divergenceHistory]
  
  const newPractices = state.practices.map(prediction => {
    const readyAnchors = prediction.anchors.filter(a => a.currentValue !== null)
    if (readyAnchors.length === 0) return prediction
    
    const { truthPressure, level, action } = evaluatePrediction(prediction)
    
    // Record divergence event
    newDivergenceHistory.push({
      id: generateId(),
      timestamp: Date.now(),
      practiceId: prediction.id,
      truthPressure,
      level,
      action: action as any
    })
    
    // Update prediction status
    const newValidationCount = level === 'ALIGNED' 
      ? prediction.validationCount + 1 
      : prediction.validationCount
    const newFalsificationCount = level === 'FALSIFIED' 
      ? prediction.falsificationCount + 1 
      : prediction.falsificationCount
    
    // Update confidence based on track record
    const totalTests = newValidationCount + newFalsificationCount
    const newConfidence = totalTests > 0 
      ? newValidationCount / totalTests 
      : prediction.confidence
    
    return {
      ...prediction,
      truthPressure,
      status: level as any,
      validationCount: newValidationCount,
      falsificationCount: newFalsificationCount,
      confidence: newConfidence
    }
  })
  
  // Update meta-learning
  const newMetaLearning = updateMetaLearning(state.metaLearning, newPractices)
  
  return {
    ...state,
    practices: newPractices,
    divergenceHistory: newDivergenceHistory,
    metaLearning: newMetaLearning
  }
}

// ============================================================================
// META-LEARNING
// ============================================================================

/**
 * Update meta-learning state based on evaluation results
 */
export function updateMetaLearning(
  state: MetaLearningState,
  practices: PracticePrediction[]
): MetaLearningState {
  const practiceReliability: Record<string, number> = {}
  
  for (const practice of practices) {
    const totalTests = practice.validationCount + practice.falsificationCount
    if (totalTests > 0) {
      // Reliability = 1 - avg(|Π - 1.0|)
      const avgDeviation = Math.abs(practice.truthPressure - 1.0)
      practiceReliability[practice.id] = Math.max(0, 1 - avgDeviation)
    }
  }
  
  // Calculate accurate predictions
  const accuratePredictions = practices.filter(p => 
    p.status === 'ALIGNED' || p.status === 'NEUTRAL'
  ).length
  
  return {
    ...state,
    practiceReliability,
    totalPredictions: practices.length,
    accuratePredictions
  }
}

/**
 * Get meta-learning insights
 */
export function getMetaInsights(state: MetaLearningState): string[] {
  const insights: string[] = []
  
  // Overall accuracy
  if (state.totalPredictions > 0) {
    const accuracy = (state.accuratePredictions / state.totalPredictions * 100).toFixed(1)
    insights.push(`Overall prediction accuracy: ${accuracy}%`)
  }
  
  // Measurement type reliability
  const reliableTypes = Object.entries(state.measurementTypeReliability)
    .filter(([_, rel]) => rel > 0.7)
    .map(([type]) => type)
  
  if (reliableTypes.length > 0) {
    insights.push(`Most reliable measurement types: ${reliableTypes.join(', ')}`)
  }
  
  // Practice reliability
  const reliablePractices = Object.entries(state.practiceReliability)
    .filter(([_, rel]) => rel > 0.8)
    .length
  
  if (reliablePractices > 0) {
    insights.push(`${reliablePractices} practices showing high reliability`)
  }
  
  return insights
}

// ============================================================================
// STATE INITIALIZATION
// ============================================================================

/**
 * Initialize Reality Bridge state
 */
export function initializeRealityBridge(): RealityBridgeState {
  return {
    practices: [],
    measurements: [],
    divergenceHistory: [],
    metaLearning: {
      practiceReliability: {},
      measurementTypeReliability: {
        GAD7: 0.8,
        PHQ9: 0.8,
        HRV: 0.9,
        MOOD: 0.6,
        ENERGY: 0.6,
        COHERENCE: 0.7,
        CUSTOM: 0.5
      },
      totalPredictions: 0,
      accuratePredictions: 0
    }
  }
}

// ============================================================================
// COMMON MEASUREMENT SCALES
// ============================================================================

export const MEASUREMENT_SCALES: Record<MeasurementType, {
  name: string
  description: string
  min: number
  max: number
  higherIsBetter: boolean
}> = {
  GAD7: {
    name: 'GAD-7',
    description: 'Generalized Anxiety Disorder 7-item scale',
    min: 0,
    max: 21,
    higherIsBetter: false
  },
  PHQ9: {
    name: 'PHQ-9',
    description: 'Patient Health Questionnaire for Depression',
    min: 0,
    max: 27,
    higherIsBetter: false
  },
  HRV: {
    name: 'Heart Rate Variability',
    description: 'RMSSD in milliseconds',
    min: 0,
    max: 200,
    higherIsBetter: true
  },
  MOOD: {
    name: 'Subjective Mood',
    description: 'Self-reported mood (1-10)',
    min: 1,
    max: 10,
    higherIsBetter: true
  },
  ENERGY: {
    name: 'Energy Level',
    description: 'Self-reported energy (1-10)',
    min: 1,
    max: 10,
    higherIsBetter: true
  },
  COHERENCE: {
    name: 'Coherence',
    description: 'Self-reported internal coherence (1-10)',
    min: 1,
    max: 10,
    higherIsBetter: true
  },
  CUSTOM: {
    name: 'Custom Measure',
    description: 'User-defined measurement',
    min: 0,
    max: 100,
    higherIsBetter: true
  }
}

// ============================================================================
// UTILITIES
// ============================================================================

function generateId(): string {
  return `rb-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Check if an anchor is ready for evaluation
 */
export function isAnchorReady(anchor: RealityAnchor): boolean {
  const daysSinceStart = (Date.now() - anchor.startDate) / (1000 * 60 * 60 * 24)
  return daysSinceStart >= anchor.expectedTimeline && anchor.currentValue !== null
}

/**
 * Get days remaining until anchor evaluation
 */
export function getDaysRemaining(anchor: RealityAnchor): number {
  const daysSinceStart = (Date.now() - anchor.startDate) / (1000 * 60 * 60 * 24)
  return Math.max(0, anchor.expectedTimeline - daysSinceStart)
}
