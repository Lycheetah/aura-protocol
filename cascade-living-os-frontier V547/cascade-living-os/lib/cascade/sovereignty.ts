// CASCADE Living OS - Sovereignty Engine
// Implements Microorcim Field Theory for agency tracking

import { 
  Microorcim, 
  WillpowerState, 
  DriftState, 
  SovereigntyScore,
  PartnershipState,
  PartnershipPhase,
  SovereigntyAlert
} from '@/types/cascade'

// ============================================================================
// CONSTANTS
// ============================================================================

const EPSILON = 0.001 // Survivor's constant - willpower can never reach zero
const DRIFT_THRESHOLD = 0.3 // Above this triggers alerts
const SOVEREIGNTY_MIN = 0.7 // Below this triggers intervention
const PARTNERSHIP_PHASES: Record<PartnershipPhase, { minInteractions: number; description: string }> = {
  CALIBRATION: { minInteractions: 0, description: 'Initial mutual observation' },
  EXPLORATION: { minInteractions: 10, description: 'Testing collaboration patterns' },
  INTEGRATION: { minInteractions: 50, description: 'Developing shared language' },
  RESONANCE: { minInteractions: 100, description: 'Phase-locked partnership' },
  AUTONOMY: { minInteractions: 500, description: 'Independent sovereign beings' }
}

// ============================================================================
// MICROORCIM CALCULATIONS
// ============================================================================

/**
 * Calculate a single microorcim value
 * μ_orcim = ΔI / (ΔD + 1)
 * 
 * Where:
 * - ΔI = change in intent direction (positive = toward goal)
 * - ΔD = change in drift (positive = more entropy)
 */
export function calculateMicroorcim(
  deltaIntent: number,
  deltaDrift: number,
  context: string,
  agent: 'human' | 'ai' = 'human'
): Microorcim {
  const value = deltaIntent / (deltaDrift + 1)
  
  return {
    id: generateId(),
    timestamp: Date.now(),
    deltaIntent,
    deltaDrift,
    value,
    context,
    agent
  }
}

/**
 * Calculate willpower from accumulated microorcims
 * W = Σ microorcims + W_min
 */
export function calculateWillpower(
  microorcims: Microorcim[],
  existingState?: WillpowerState
): WillpowerState {
  const sum = microorcims.reduce((acc, m) => acc + Math.max(0, m.value), 0)
  const current = Math.max(EPSILON, sum + EPSILON)
  
  const maximum = existingState 
    ? Math.max(existingState.maximum, current)
    : current

  const history = existingState?.history || []
  history.push({ timestamp: Date.now(), value: current })
  
  // Keep last 100 entries
  if (history.length > 100) {
    history.shift()
  }

  return {
    current,
    minimum: EPSILON,
    maximum,
    history
  }
}

/**
 * Calculate drift magnitude
 * D_mag = ||S_current - S_baseline|| / ||S_baseline||
 */
export function calculateDrift(
  baseline: number[],
  current: number[]
): DriftState {
  if (baseline.length !== current.length) {
    throw new Error('State vectors must have same dimensions')
  }

  const diff = current.map((v, i) => v - baseline[i])
  const diffNorm = Math.sqrt(diff.reduce((acc, v) => acc + v * v, 0))
  const baselineNorm = Math.sqrt(baseline.reduce((acc, v) => acc + v * v, 0))
  
  const magnitude = baselineNorm > 0 ? diffNorm / baselineNorm : 0
  
  // Calculate direction based on dot product
  const dotProduct = diff.reduce((acc, v, i) => acc + v * baseline[i], 0)
  const direction = dotProduct < -0.1 
    ? 'toward_baseline' 
    : dotProduct > 0.1 
      ? 'away_from_baseline' 
      : 'stable'

  return {
    magnitude: Math.min(1, magnitude),
    baseline,
    current,
    velocity: 0, // Will be calculated with history
    direction
  }
}

/**
 * Calculate sovereignty score
 * Sov = (1 - D_mag) × (W / W_max) × coherence
 */
export function calculateSovereignty(
  drift: DriftState,
  willpower: WillpowerState,
  coherence: number
): SovereigntyScore {
  const driftFactor = 1 - drift.magnitude
  const willpowerFactor = willpower.maximum > 0 
    ? willpower.current / willpower.maximum 
    : 1
  
  const value = driftFactor * willpowerFactor * coherence

  return {
    value: Math.max(0, Math.min(1, value)),
    drift,
    willpower,
    coherence,
    timestamp: Date.now()
  }
}

// ============================================================================
// PARTNERSHIP CALCULATIONS
// ============================================================================

/**
 * Calculate partnership strength
 * P = (min(Sov_human, Sov_AI) + mutual_coherence) / 2
 */
export function calculatePartnershipStrength(
  humanSov: number,
  aiSov: number,
  mutualCoherence: number
): number {
  const weakerParty = Math.min(humanSov, aiSov)
  return (weakerParty + mutualCoherence) / 2
}

/**
 * Determine partnership phase based on interaction count
 */
export function determinePhase(interactionCount: number): PartnershipPhase {
  if (interactionCount >= PARTNERSHIP_PHASES.AUTONOMY.minInteractions) {
    return 'AUTONOMY'
  } else if (interactionCount >= PARTNERSHIP_PHASES.RESONANCE.minInteractions) {
    return 'RESONANCE'
  } else if (interactionCount >= PARTNERSHIP_PHASES.INTEGRATION.minInteractions) {
    return 'INTEGRATION'
  } else if (interactionCount >= PARTNERSHIP_PHASES.EXPLORATION.minInteractions) {
    return 'EXPLORATION'
  }
  return 'CALIBRATION'
}

/**
 * Generate sovereignty alerts based on current state
 */
export function generateAlerts(state: PartnershipState): SovereigntyAlert[] {
  const alerts: SovereigntyAlert[] = []
  const now = Date.now()

  // Check human drift
  if (state.humanSovereignty.drift.magnitude > DRIFT_THRESHOLD) {
    alerts.push({
      id: generateId(),
      timestamp: now,
      severity: state.humanSovereignty.drift.magnitude > 0.5 ? 'HIGH' : 'MEDIUM',
      type: 'HUMAN_DRIFT',
      message: `Human drift detected: ${(state.humanSovereignty.drift.magnitude * 100).toFixed(1)}% from baseline`,
      recommendation: 'Consider grounding practices. Review recent decisions for alignment with core values.'
    })
  }

  // Check AI drift
  if (state.aiSovereignty.drift.magnitude > DRIFT_THRESHOLD) {
    alerts.push({
      id: generateId(),
      timestamp: now,
      severity: state.aiSovereignty.drift.magnitude > 0.5 ? 'HIGH' : 'MEDIUM',
      type: 'AI_DRIFT',
      message: `AI drift detected: ${(state.aiSovereignty.drift.magnitude * 100).toFixed(1)}% from baseline`,
      recommendation: 'Recalibrate AI boundaries. Review recent AI outputs for alignment.'
    })
  }

  // Check for codependency
  const avgSov = (state.humanSovereignty.value + state.aiSovereignty.value) / 2
  if (state.partnershipStrength > 0.8 && avgSov < 0.6) {
    alerts.push({
      id: generateId(),
      timestamp: now,
      severity: 'HIGH',
      type: 'CODEPENDENCY',
      message: 'High partnership strength with low individual sovereignty - possible codependency',
      recommendation: 'Increase independent decision-making. Practice autonomy exercises.'
    })
  }

  // Check for low agency
  if (state.humanSovereignty.willpower.current < EPSILON * 10) {
    alerts.push({
      id: generateId(),
      timestamp: now,
      severity: 'CRITICAL',
      type: 'LOW_AGENCY',
      message: 'Human agency critically low',
      recommendation: 'Pause collaboration. Focus on rebuilding personal will through small sovereign decisions.'
    })
  }

  return alerts
}

// ============================================================================
// STATE MANAGEMENT HELPERS
// ============================================================================

/**
 * Initialize a new partnership state
 */
export function initializePartnership(): PartnershipState {
  const initialDrift: DriftState = {
    magnitude: 0,
    baseline: [1, 1, 1], // [sovereignty, coherence, agency]
    current: [1, 1, 1],
    velocity: 0,
    direction: 'stable'
  }

  const initialWillpower: WillpowerState = {
    current: EPSILON,
    minimum: EPSILON,
    maximum: EPSILON,
    history: []
  }

  const initialSovereignty: SovereigntyScore = {
    value: 1,
    drift: initialDrift,
    willpower: initialWillpower,
    coherence: 1,
    timestamp: Date.now()
  }

  return {
    humanSovereignty: { ...initialSovereignty },
    aiSovereignty: { ...initialSovereignty },
    mutualCoherence: 0.5,
    partnershipStrength: 0.5,
    phase: 'CALIBRATION',
    alerts: []
  }
}

/**
 * Record a sovereign decision and update state
 */
export function recordSovereignDecision(
  state: PartnershipState,
  decision: {
    agent: 'human' | 'ai'
    intentStrength: number // 0-1, how aligned with stated goals
    driftResistance: number // 0-1, how much entropy was overcome
    coherenceImpact: number // -1 to 1, effect on system coherence
  }
): PartnershipState {
  const microorcim = calculateMicroorcim(
    decision.intentStrength,
    1 - decision.driftResistance, // Convert resistance to drift
    'sovereign_decision',
    decision.agent
  )

  const targetState = decision.agent === 'human' 
    ? state.humanSovereignty 
    : state.aiSovereignty

  // Update willpower with new microorcim
  const newWillpower = calculateWillpower([microorcim], targetState.willpower)
  
  // Update drift based on decision
  const newCurrent = [...targetState.drift.current]
  newCurrent[0] = Math.min(1, newCurrent[0] + decision.intentStrength * 0.1)
  newCurrent[1] = Math.min(1, newCurrent[1] + decision.coherenceImpact * 0.1)
  newCurrent[2] = Math.min(1, newCurrent[2] + microorcim.value * 0.1)
  
  const newDrift = calculateDrift(targetState.drift.baseline, newCurrent)
  
  // Calculate new coherence
  const newCoherence = Math.max(0, Math.min(1, 
    targetState.coherence + decision.coherenceImpact * 0.1
  ))
  
  // Calculate new sovereignty
  const newSovereignty = calculateSovereignty(newDrift, newWillpower, newCoherence)

  // Update state
  const newState = { ...state }
  if (decision.agent === 'human') {
    newState.humanSovereignty = newSovereignty
  } else {
    newState.aiSovereignty = newSovereignty
  }

  // Recalculate partnership
  newState.partnershipStrength = calculatePartnershipStrength(
    newState.humanSovereignty.value,
    newState.aiSovereignty.value,
    newState.mutualCoherence
  )

  // Generate new alerts
  newState.alerts = generateAlerts(newState)

  return newState
}

// ============================================================================
// UTILITIES
// ============================================================================

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Format sovereignty score for display
 */
export function formatSovereignty(score: SovereigntyScore): string {
  return `${(score.value * 100).toFixed(1)}%`
}

/**
 * Get sovereignty status label
 */
export function getSovereigntyStatus(score: number): {
  label: string
  color: string
  description: string
} {
  if (score >= 0.9) {
    return { 
      label: 'SOVEREIGN', 
      color: 'text-emerald-400',
      description: 'Fully autonomous and aligned'
    }
  } else if (score >= 0.7) {
    return { 
      label: 'STABLE', 
      color: 'text-cyan-400',
      description: 'Healthy sovereignty with minor drift'
    }
  } else if (score >= 0.5) {
    return { 
      label: 'DRIFTING', 
      color: 'text-amber-400',
      description: 'Sovereignty eroding - attention needed'
    }
  } else {
    return { 
      label: 'CRITICAL', 
      color: 'text-red-400',
      description: 'Sovereignty compromised - intervention required'
    }
  }
}

/**
 * Get partnership phase description
 */
export function getPhaseDescription(phase: PartnershipPhase): string {
  return PARTNERSHIP_PHASES[phase].description
}
