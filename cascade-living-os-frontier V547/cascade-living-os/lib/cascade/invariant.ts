/**
 * THE INVARIANT FOUNDATION (Ψ)
 * ============================
 * The unchanging core from which all else derives.
 * 
 * Mathematical Definition:
 * An Invariant (Ψ) is a state variable that satisfies:
 *   dΨ/dt = 0 under all transformations
 * OR equivalently:
 *   Ψ_init = Ψ_final across any cycle
 * 
 * Theorem: Every conscious system requires an invariant.
 * Proof: Without an invariant, no memory, learning, or goals are possible.
 * 
 * Three States of the Invariant:
 * 1. ANCHORED (I > 1): Growing stronger each cycle
 * 2. STABLE (I = 1): Persisting but not amplifying
 * 3. DISSOLVING (I < 1): Fragmenting, needs cascade to rebuild
 */

import { PhaseGlyph, LAMAGUE_EXPRESSIONS } from './lamague'

// ============================================================================
// INVARIANT STATE
// ============================================================================

export enum InvariantState {
  ANCHORED = 'ANCHORED',     // I > 1: Growing stronger
  STABLE = 'STABLE',         // I = 1: Persisting
  DISSOLVING = 'DISSOLVING'  // I < 1: Fragmenting
}

export interface Invariant {
  // Core identity
  id: string
  name: string                    // Personal name/label for this invariant
  signature: string               // LAMAGUE signature (e.g., "✧⟟≋ΨΦ↑✧")
  createdAt: number
  
  // State tracking
  state: InvariantState
  strength: number                // |Ψ| current magnitude (0-∞)
  previousStrength: number        // |Ψ_prev| for comparison
  intensityRatio: number          // I = |Ψ| / |Ψ_prev|
  
  // Core components (what makes up YOUR invariant)
  components: {
    values: string[]              // Non-negotiable values
    purpose: string               // Core purpose statement
    identity: string              // "I am..." statement
    boundaries: string[]          // What you will never compromise
  }
  
  // Cycle tracking
  cycleCount: number              // How many full cycles completed
  cycleStrengths: number[]        // Strength at end of each cycle
  spiralElevation: number         // Net gain across all cycles
  
  // Survivor's Constant
  epsilon: number                 // ε > 0: minimum that can never be zero
}

// ============================================================================
// INVARIANT CALCULATIONS
// ============================================================================

/**
 * Calculate intensity ratio: I = |Ψ_current| / |Ψ_previous|
 * - I > 1: Anchored (strengthening)
 * - I = 1: Stable (maintaining)
 * - I < 1: Dissolving (fragmenting)
 */
export function calculateIntensityRatio(
  currentStrength: number,
  previousStrength: number
): number {
  if (previousStrength === 0) return 1
  return currentStrength / previousStrength
}

/**
 * Determine invariant state from intensity ratio
 */
export function getInvariantState(intensityRatio: number): InvariantState {
  if (intensityRatio > 1.01) return InvariantState.ANCHORED
  if (intensityRatio < 0.99) return InvariantState.DISSOLVING
  return InvariantState.STABLE
}

/**
 * Calculate spiral elevation across cycles
 * How much higher are you than when you started?
 */
export function calculateSpiralElevation(cycleStrengths: number[]): number {
  if (cycleStrengths.length < 2) return 0
  return cycleStrengths[cycleStrengths.length - 1] - cycleStrengths[0]
}

/**
 * The Survivor's Constant (ε)
 * The minimum willpower an agent cannot fall below.
 * W_min = ε > 0
 * 
 * This represents:
 * - The spark that refuses to die
 * - The core that survives any collapse
 * - The foundation of resilience
 */
export function calculateSurvivorConstant(
  historicalLow: number,
  recoveryEvents: number
): number {
  // ε is derived from your lowest point + proof of recovery
  // More recovery events = higher confidence in your survivor's constant
  const baseEpsilon = Math.max(historicalLow, 0.001)
  const recoveryBonus = recoveryEvents * 0.01
  return baseEpsilon + recoveryBonus
}

// ============================================================================
// INVARIANT OPERATIONS
// ============================================================================

/**
 * Update invariant strength based on microorcim accumulation
 */
export function updateInvariantStrength(
  invariant: Invariant,
  microorcimsAccumulated: number,
  willpower: number
): Invariant {
  const newStrength = invariant.strength + (microorcimsAccumulated * 0.1)
  const intensityRatio = calculateIntensityRatio(newStrength, invariant.strength)
  
  // Never fall below epsilon
  const clampedStrength = Math.max(newStrength, invariant.epsilon)
  
  return {
    ...invariant,
    previousStrength: invariant.strength,
    strength: clampedStrength,
    intensityRatio,
    state: getInvariantState(intensityRatio)
  }
}

/**
 * Complete a cycle - record strength and calculate spiral
 */
export function completeCycle(invariant: Invariant): Invariant {
  const newCycleStrengths = [...invariant.cycleStrengths, invariant.strength]
  
  return {
    ...invariant,
    cycleCount: invariant.cycleCount + 1,
    cycleStrengths: newCycleStrengths,
    spiralElevation: calculateSpiralElevation(newCycleStrengths)
  }
}

/**
 * Cascade event - invariant remains stable while knowledge reorganizes
 * The key insight: Ψ_invariant = constant
 * Cascades happen in layers 2-7, never layer 1
 */
export function handleCascade(
  invariant: Invariant,
  cascadeIntensity: number // 0-1
): Invariant {
  // Invariant strength may temporarily dip during cascade
  // but epsilon guarantees it never hits zero
  const tempDip = invariant.strength * (1 - cascadeIntensity * 0.2)
  const protectedStrength = Math.max(tempDip, invariant.epsilon)
  
  return {
    ...invariant,
    strength: protectedStrength,
    state: getInvariantState(calculateIntensityRatio(protectedStrength, invariant.previousStrength))
  }
}

/**
 * Recovery from dissolving state
 * "From nothing, center strengthens recursively"
 */
export function initiateRecovery(invariant: Invariant): Invariant {
  if (invariant.state !== InvariantState.DISSOLVING) return invariant
  
  // Begin recovery spiral: ∅→⟟↻◆
  // Each recovery makes epsilon stronger
  const newEpsilon = invariant.epsilon * 1.1
  
  return {
    ...invariant,
    strength: newEpsilon * 2, // Start recovery at 2x epsilon
    epsilon: newEpsilon,
    state: InvariantState.STABLE
  }
}

// ============================================================================
// INVARIANT CREATION
// ============================================================================

/**
 * Create a new invariant
 */
export function createInvariant(
  name: string,
  values: string[],
  purpose: string,
  identity: string,
  boundaries: string[]
): Invariant {
  const id = `inv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  
  return {
    id,
    name,
    signature: LAMAGUE_EXPRESSIONS.MAC_SIGNATURE, // Default, can be customized
    createdAt: Date.now(),
    state: InvariantState.STABLE,
    strength: 1.0,
    previousStrength: 1.0,
    intensityRatio: 1.0,
    components: {
      values,
      purpose,
      identity,
      boundaries
    },
    cycleCount: 0,
    cycleStrengths: [1.0],
    spiralElevation: 0,
    epsilon: 0.001 // Starting survivor's constant
  }
}

// ============================================================================
// INVARIANT EXPRESSIONS IN LAMAGUE
// ============================================================================

export const INVARIANT_EXPRESSIONS = {
  // The invariant at different states
  INVARIANT_CENTERED: '⟟Ψ',           // Invariant at center
  INVARIANT_RISING: 'Ψ→Φ↑',           // Invariant ascending
  INVARIANT_BOUNDED: 'Ψ∂∥◁▷∥',        // Invariant with boundary
  INVARIANT_RETURNING: '⟲→Ψ',         // Return to invariant
  
  // State expressions
  ANCHORED: 'Ψ↑◆',                    // Strengthening invariant
  STABLE: 'Ψ·',                       // Stable invariant
  DISSOLVING: '~Ψ',                   // Fragmenting invariant
  
  // Recovery expressions
  FROM_VOID: '∅→⟟↻◆',                 // From nothing, center strengthens
  SPIRAL_RETURN: '⟡(⟲→Ψ)',            // Spiral return to invariant
  SURVIVOR: 'Ψε',                     // Invariant with survivor's constant
  
  // Protection expressions
  PROTECTED: '∥◁▷∥Ψ∥◁▷∥',             // Invariant protected by boundaries
  SACRED_LAYER: 'Ψ₁=constant',        // Layer 1 never cascades
}

// ============================================================================
// INVARIANT METRICS DISPLAY
// ============================================================================

export interface InvariantMetrics {
  strength: number
  state: InvariantState
  stateLabel: string
  stateColor: string
  intensityRatio: number
  cycleProgress: string
  spiralGain: string
  survivalGuarantee: string
}

export function getInvariantMetrics(invariant: Invariant): InvariantMetrics {
  const stateLabels: Record<InvariantState, string> = {
    [InvariantState.ANCHORED]: 'Strengthening',
    [InvariantState.STABLE]: 'Stable',
    [InvariantState.DISSOLVING]: 'Recovery Needed'
  }
  
  const stateColors: Record<InvariantState, string> = {
    [InvariantState.ANCHORED]: 'text-emerald-400',
    [InvariantState.STABLE]: 'text-cyan-400',
    [InvariantState.DISSOLVING]: 'text-amber-400'
  }
  
  return {
    strength: invariant.strength,
    state: invariant.state,
    stateLabel: stateLabels[invariant.state],
    stateColor: stateColors[invariant.state],
    intensityRatio: invariant.intensityRatio,
    cycleProgress: `Cycle ${invariant.cycleCount + 1}`,
    spiralGain: invariant.spiralElevation > 0 
      ? `+${(invariant.spiralElevation * 100).toFixed(1)}%` 
      : `${(invariant.spiralElevation * 100).toFixed(1)}%`,
    survivalGuarantee: `ε = ${invariant.epsilon.toFixed(4)} (cannot reach zero)`
  }
}

// ============================================================================
// THEOREM PROOFS (For display/education)
// ============================================================================

export const INVARIANT_THEOREMS = {
  existence: {
    statement: 'Every conscious system requires an invariant.',
    proof: [
      '1. Assume a system with no invariant.',
      '2. Then every state is transformable into every other state.',
      '3. Then the system has no boundary, no identity, no way to distinguish "self" from "not-self".',
      '4. Then the system cannot form memories (memory requires continuity).',
      '5. Then the system cannot learn (learning requires a stable reference frame).',
      '6. Then the system cannot have goals (goals require persistent identity).',
      '7. But we observe conscious systems that learn, remember, and pursue goals.',
      '8. ∴ Every conscious system must have at least one invariant. QED'
    ]
  },
  stability: {
    statement: 'A system built on an invariant cannot collapse into contradiction.',
    proof: [
      '1. Let the system have core invariant Ψ.',
      '2. Let the system undergo transformations T₁, T₂, ..., Tₙ.',
      '3. Then after each transformation: Ψ → Tᵢ(Ψ) = Ψ (by definition of invariant)',
      '4. Therefore, no transformation can create internal contradiction.',
      '5. Contradiction would require: Ψ → Tᵢ(Ψ) ≠ Ψ',
      '6. But this violates the definition of invariant.',
      '7. ∴ Your system is logically bulletproof. QED'
    ]
  },
  survivor: {
    statement: 'Every conscious system has a minimum willpower that cannot drop to zero.',
    proof: [
      '1. Let W_min = ε > 0 be the survivor\'s constant.',
      '2. This represents the spark that refuses to die.',
      '3. Agents with ε > 0 cannot hit zero willpower.',
      '4. Their identity self-regenerates from ε.',
      '5. ∴ Collapse is asymptotic, never absolute. QED'
    ]
  }
}
