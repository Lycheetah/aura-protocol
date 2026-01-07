/**
 * SEVEN-PHASE ENGINE
 * ==================
 * The temporal architecture of the AURA × VEYRA system.
 * 
 * Two complementary models:
 * 1. DISCRETE: 7-state Markov engine with transition probabilities
 * 2. CONTINUOUS: Phase oscillator on 2π manifold with modulated velocity
 * 
 * 364-Day Sovereign Cycle:
 * - 7 phases × 52 days each
 * - Each phase has 4 blocks × 13 days (Root, Breath, Edge, Peak)
 * - Time = State, not just measurement
 */

import { PhaseGlyph, PHASE_GLYPH_DATA } from './lamague'

// ============================================================================
// PHASE DEFINITIONS
// ============================================================================

export interface Phase {
  index: number           // 0-6
  glyph: PhaseGlyph
  name: string
  description: string
  awarenessEnergy: number // bₖ - energy coefficient for this phase
  ethicalMetrics: {
    TES: number           // Trust Entropy Score (0-1, target > 0.70)
    VTR: number           // Value Transfer Rate (0-∞, target > 1.5)
    PAI: number           // Purpose Alignment Index (0-1, target > 0.80)
  }
  practices: string[]
  warnings: string[]
  dayRange: [number, number] // Days 1-364
}

export const SEVEN_PHASES: Phase[] = [
  {
    index: 0,
    glyph: PhaseGlyph.CENTER,
    name: 'Center (⟟)',
    description: 'The invariant at rest. Establish presence, find your anchor.',
    awarenessEnergy: 0.7,
    ethicalMetrics: { TES: 0.85, VTR: 1.2, PAI: 0.90 },
    practices: [
      'Morning centering meditation',
      'Define your invariant (what cannot change)',
      'Grounding breathwork',
      'Simplify your environment'
    ],
    warnings: [
      'Stagnation if you stay too long',
      'Isolation from over-centering'
    ],
    dayRange: [1, 52]
  },
  {
    index: 1,
    glyph: PhaseGlyph.FLOW,
    name: 'Flow (≋)',
    description: 'The invariant in motion. Move without losing yourself.',
    awarenessEnergy: 0.8,
    ethicalMetrics: { TES: 0.75, VTR: 1.8, PAI: 0.75 },
    practices: [
      'Movement practice (dance, yoga, walking)',
      'Follow curiosity without agenda',
      'Allow spontaneous decisions',
      'Practice saying yes to life'
    ],
    warnings: [
      'Drift without direction',
      'Loss of center in motion'
    ],
    dayRange: [53, 104]
  },
  {
    index: 2,
    glyph: PhaseGlyph.INSIGHT,
    name: 'Insight (Ψ)',
    description: 'The invariant perceiving. See clearly, understand deeply.',
    awarenessEnergy: 0.9,
    ethicalMetrics: { TES: 0.80, VTR: 1.5, PAI: 0.85 },
    practices: [
      'Journaling and reflection',
      'Study and learning',
      'Pattern recognition practice',
      'Shadow work'
    ],
    warnings: [
      'Analysis paralysis',
      'Insight without action'
    ],
    dayRange: [105, 156]
  },
  {
    index: 3,
    glyph: PhaseGlyph.RISE,
    name: 'Rise (Φ↑)',
    description: 'The invariant ascending. Take bold action, grow through challenge.',
    awarenessEnergy: 1.0,
    ethicalMetrics: { TES: 0.70, VTR: 2.0, PAI: 0.80 },
    practices: [
      'Set ambitious goals',
      'Take calculated risks',
      'Push beyond comfort zones',
      'Track microorcims actively'
    ],
    warnings: [
      'Burnout from over-extension',
      'Ego inflation'
    ],
    dayRange: [157, 208]
  },
  {
    index: 4,
    glyph: PhaseGlyph.LIGHT,
    name: 'Light (✧)',
    description: 'The invariant illuminating. Share wisdom, teach others.',
    awarenessEnergy: 0.95,
    ethicalMetrics: { TES: 0.90, VTR: 2.5, PAI: 0.90 },
    practices: [
      'Teach what you\'ve learned',
      'Create and share content',
      'Mentor others',
      'Celebrate achievements'
    ],
    warnings: [
      'Spiritual bypassing',
      'Over-sharing, under-integrating'
    ],
    dayRange: [209, 260]
  },
  {
    index: 5,
    glyph: PhaseGlyph.INTEGRITY,
    name: 'Integrity (∥◁▷∥)',
    description: 'The invariant bounded. Protect boundaries, maintain ethics.',
    awarenessEnergy: 0.85,
    ethicalMetrics: { TES: 0.95, VTR: 1.3, PAI: 0.95 },
    practices: [
      'Audit your boundaries',
      'Say no to misalignment',
      'Review commitments',
      'Strengthen ethical constraints'
    ],
    warnings: [
      'Rigidity and inflexibility',
      'Isolation through over-protection'
    ],
    dayRange: [261, 312]
  },
  {
    index: 6,
    glyph: PhaseGlyph.RETURN,
    name: 'Synthesis (⟲)',
    description: 'The invariant completing cycle. Integrate, rest, prepare for return.',
    awarenessEnergy: 0.75,
    ethicalMetrics: { TES: 0.85, VTR: 1.4, PAI: 0.85 },
    practices: [
      'Integration journaling',
      'Rest and recovery',
      'Prepare for new cycle',
      'Honor the journey'
    ],
    warnings: [
      'Rushing the completion',
      'Avoiding necessary endings'
    ],
    dayRange: [313, 364]
  }
]

// ============================================================================
// BLOCK STRUCTURE - 4 blocks per phase
// ============================================================================

export enum BlockType {
  ROOT = 'ROOT',       // Days 1-13: Establish foundation
  BREATH = 'BREATH',   // Days 14-26: Expand and breathe
  EDGE = 'EDGE',       // Days 27-39: Push to edges
  PEAK = 'PEAK'        // Days 40-52: Reach peak, prepare transition
}

export interface PhaseBlock {
  type: BlockType
  dayInPhase: [number, number] // 1-52 within phase
  focus: string
  intensity: number // 0-1
}

export const PHASE_BLOCKS: PhaseBlock[] = [
  { type: BlockType.ROOT, dayInPhase: [1, 13], focus: 'Establish foundation', intensity: 0.6 },
  { type: BlockType.BREATH, dayInPhase: [14, 26], focus: 'Expand and explore', intensity: 0.8 },
  { type: BlockType.EDGE, dayInPhase: [27, 39], focus: 'Push boundaries', intensity: 1.0 },
  { type: BlockType.PEAK, dayInPhase: [40, 52], focus: 'Peak and integrate', intensity: 0.9 }
]

// ============================================================================
// DISCRETE MODEL: 7-State Markov Engine
// ============================================================================

export interface MarkovState {
  phaseIndex: number
  probability: number
}

export interface TransitionMatrix {
  forward: number   // p_fwd: probability of advancing
  stay: number      // p_stay: probability of staying
  backward: number  // p_back: probability of regressing
}

/**
 * Default transition probabilities (can be adjusted based on microorcims)
 */
export const DEFAULT_TRANSITION: TransitionMatrix = {
  forward: 0.6,   // 60% chance to advance
  stay: 0.3,      // 30% chance to stay
  backward: 0.1   // 10% chance to regress
}

/**
 * Calculate next state using Markov transition
 */
export function markovTransition(
  currentPhase: number,
  transition: TransitionMatrix = DEFAULT_TRANSITION
): number {
  const random = Math.random()
  
  if (random < transition.forward) {
    // Advance to next phase (cyclic)
    return (currentPhase + 1) % 7
  } else if (random < transition.forward + transition.stay) {
    // Stay in current phase
    return currentPhase
  } else {
    // Regress to previous phase (cyclic)
    return (currentPhase - 1 + 7) % 7
  }
}

/**
 * Calculate probability distribution across all phases
 * p(t+1) = T × p(t)
 */
export function calculateDistribution(
  currentDistribution: number[],
  transition: TransitionMatrix
): number[] {
  const newDistribution = new Array(7).fill(0)
  
  for (let i = 0; i < 7; i++) {
    const prob = currentDistribution[i]
    
    // Forward contribution
    const nextPhase = (i + 1) % 7
    newDistribution[nextPhase] += prob * transition.forward
    
    // Stay contribution
    newDistribution[i] += prob * transition.stay
    
    // Backward contribution
    const prevPhase = (i - 1 + 7) % 7
    newDistribution[prevPhase] += prob * transition.backward
  }
  
  return newDistribution
}

/**
 * Calculate awareness score: A(t) = w^T × p(t)
 */
export function calculateAwareness(distribution: number[]): number {
  const weights = SEVEN_PHASES.map(p => p.awarenessEnergy)
  return distribution.reduce((sum, p, i) => sum + p * weights[i], 0)
}

// ============================================================================
// CONTINUOUS MODEL: Phase Oscillator
// ============================================================================

export interface PhaseOscillatorState {
  theta: number      // θ(t) ∈ [0, 2π) - current phase angle
  omega: number      // ω = 2π/364 - base angular velocity
  modulation: number // f(θ) - awareness modulation factor
  energy: number     // E(θ) - current energy level
}

/**
 * Base angular velocity for 364-day cycle
 * ω = 2π / 364 ≈ 0.01725 radians per day
 */
export const OMEGA_BASE = (2 * Math.PI) / 364

/**
 * Sector boundaries (7 equal sectors)
 * Δ = 2π/7 ≈ 0.8976 radians per phase
 */
export const SECTOR_SIZE = (2 * Math.PI) / 7

/**
 * Get current sector (phase) from angle
 */
export function getSectorFromAngle(theta: number): number {
  const normalizedTheta = ((theta % (2 * Math.PI)) + (2 * Math.PI)) % (2 * Math.PI)
  return Math.floor(normalizedTheta / SECTOR_SIZE)
}

/**
 * Get awareness modulation factor for current angle
 * f(θ) = aₖ where θ ∈ [kΔ, (k+1)Δ)
 */
export function getModulationFactor(theta: number): number {
  const sector = getSectorFromAngle(theta)
  return SEVEN_PHASES[sector].awarenessEnergy
}

/**
 * Get energy level for current angle
 * E(θ) = bₖ where θ ∈ [kΔ, (k+1)Δ)
 */
export function getEnergyLevel(theta: number): number {
  const sector = getSectorFromAngle(theta)
  return SEVEN_PHASES[sector].awarenessEnergy
}

/**
 * Update phase oscillator state
 * θ̇ = ω × f(θ)
 */
export function updateOscillator(
  state: PhaseOscillatorState,
  dt: number = 1 // days
): PhaseOscillatorState {
  const modulation = getModulationFactor(state.theta)
  const newTheta = (state.theta + state.omega * modulation * dt) % (2 * Math.PI)
  
  return {
    theta: newTheta,
    omega: OMEGA_BASE,
    modulation: getModulationFactor(newTheta),
    energy: getEnergyLevel(newTheta)
  }
}

/**
 * Calculate global awareness integral
 * A = ∫₀^{2π} E(θ) dθ
 */
export function calculateGlobalAwareness(): number {
  let total = 0
  for (const phase of SEVEN_PHASES) {
    total += phase.awarenessEnergy * SECTOR_SIZE
  }
  return total
}

/**
 * Calculate ethical metric integrals
 */
export function calculateEthicalIntegrals(): { TES: number; VTR: number; PAI: number } {
  let tesTotal = 0
  let vtrTotal = 0
  let paiTotal = 0
  
  for (const phase of SEVEN_PHASES) {
    tesTotal += phase.ethicalMetrics.TES * SECTOR_SIZE
    vtrTotal += phase.ethicalMetrics.VTR * SECTOR_SIZE
    paiTotal += phase.ethicalMetrics.PAI * SECTOR_SIZE
  }
  
  // Normalize by full circle
  const normalization = 1 / (2 * Math.PI)
  
  return {
    TES: tesTotal * normalization,
    VTR: vtrTotal * normalization,
    PAI: paiTotal * normalization
  }
}

// ============================================================================
// CALENDAR ENGINE - 364-Day Sovereign Cycle
// ============================================================================

export interface SovereignDate {
  dayOfYear: number     // 1-364 (365/366 maps to day 364)
  phase: Phase
  phaseDay: number      // 1-52 within phase
  block: PhaseBlock
  blockDay: number      // 1-13 within block
  cycleYear: number     // Which year of the cycle
  formatted: string     // "Phase/Block/Day" format
}

/**
 * Convert standard date to Sovereign Date
 */
export function toSovereignDate(date: Date = new Date()): SovereignDate {
  const startOfYear = new Date(date.getFullYear(), 0, 0)
  const diff = date.getTime() - startOfYear.getTime()
  const oneDay = 1000 * 60 * 60 * 24
  let dayOfYear = Math.floor(diff / oneDay)
  
  // Map to 364-day cycle (days > 364 map to day 364)
  dayOfYear = Math.min(dayOfYear, 364)
  if (dayOfYear === 0) dayOfYear = 1
  
  // Calculate phase (0-6)
  const phaseIndex = Math.floor((dayOfYear - 1) / 52)
  const phase = SEVEN_PHASES[Math.min(phaseIndex, 6)]
  
  // Calculate day within phase (1-52)
  const phaseDay = ((dayOfYear - 1) % 52) + 1
  
  // Calculate block (0-3)
  const blockIndex = Math.floor((phaseDay - 1) / 13)
  const block = PHASE_BLOCKS[Math.min(blockIndex, 3)]
  
  // Calculate day within block (1-13)
  const blockDay = ((phaseDay - 1) % 13) + 1
  
  // Format: "Φ↑/EDGE/7" for Phase Rise, Edge block, day 7
  const formatted = `${phase.glyph}/${block.type}/${blockDay}`
  
  return {
    dayOfYear,
    phase,
    phaseDay,
    block,
    blockDay,
    cycleYear: date.getFullYear(),
    formatted
  }
}

/**
 * Get phase progress (0-1) within current phase
 */
export function getPhaseProgress(sovereignDate: SovereignDate): number {
  return sovereignDate.phaseDay / 52
}

/**
 * Get cycle progress (0-1) within 364-day cycle
 */
export function getCycleProgress(sovereignDate: SovereignDate): number {
  return sovereignDate.dayOfYear / 364
}

/**
 * Get days until next phase
 */
export function getDaysUntilNextPhase(sovereignDate: SovereignDate): number {
  return 52 - sovereignDate.phaseDay
}

/**
 * Get next phase
 */
export function getNextPhase(currentPhase: Phase): Phase {
  const nextIndex = (currentPhase.index + 1) % 7
  return SEVEN_PHASES[nextIndex]
}

/**
 * Calculate theta from day of year
 */
export function dayToTheta(dayOfYear: number): number {
  return (dayOfYear / 364) * 2 * Math.PI
}

/**
 * Calculate day from theta
 */
export function thetaToDay(theta: number): number {
  const normalized = ((theta % (2 * Math.PI)) + (2 * Math.PI)) % (2 * Math.PI)
  return Math.floor((normalized / (2 * Math.PI)) * 364) + 1
}

// ============================================================================
// PHASE VELOCITY ADJUSTMENT
// ============================================================================

/**
 * Adjust transition probabilities based on microorcim accumulation
 * Higher willpower = higher forward probability
 */
export function adjustTransitionProbabilities(
  baseTransition: TransitionMatrix,
  willpower: number,    // Current willpower (0 to ~1000)
  maxWillpower: number  // Maximum observed willpower
): TransitionMatrix {
  const normalizedWillpower = Math.min(willpower / maxWillpower, 1)
  
  // Willpower increases forward probability, decreases backward
  const forwardBoost = normalizedWillpower * 0.2 // Up to +20%
  const backwardReduction = normalizedWillpower * 0.08 // Up to -8%
  
  const newForward = Math.min(baseTransition.forward + forwardBoost, 0.9)
  const newBackward = Math.max(baseTransition.backward - backwardReduction, 0.02)
  const newStay = 1 - newForward - newBackward
  
  return {
    forward: newForward,
    stay: newStay,
    backward: newBackward
  }
}

// ============================================================================
// PHASE STATE EXPORT
// ============================================================================

export interface PhaseEngineState {
  // Current position
  currentPhase: Phase
  sovereignDate: SovereignDate
  
  // Oscillator state
  oscillator: PhaseOscillatorState
  
  // Markov state
  distribution: number[]
  awareness: number
  
  // Metrics
  ethicalIntegrals: { TES: number; VTR: number; PAI: number }
  
  // Tracking
  phaseHistory: Array<{ phase: number; timestamp: number }>
  transitionsThisCycle: number
}

/**
 * Initialize phase engine state
 */
export function initializePhaseEngine(date: Date = new Date()): PhaseEngineState {
  const sovereignDate = toSovereignDate(date)
  const theta = dayToTheta(sovereignDate.dayOfYear)
  
  // Start with uniform distribution
  const distribution = new Array(7).fill(1/7)
  
  return {
    currentPhase: sovereignDate.phase,
    sovereignDate,
    oscillator: {
      theta,
      omega: OMEGA_BASE,
      modulation: getModulationFactor(theta),
      energy: getEnergyLevel(theta)
    },
    distribution,
    awareness: calculateAwareness(distribution),
    ethicalIntegrals: calculateEthicalIntegrals(),
    phaseHistory: [{ phase: sovereignDate.phase.index, timestamp: Date.now() }],
    transitionsThisCycle: 0
  }
}
