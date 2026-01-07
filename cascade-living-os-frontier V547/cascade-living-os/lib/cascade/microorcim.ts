/**
 * MICROORCIM FIELD THEORY
 * =======================
 * The physics of will, choice, and sovereign override.
 * 
 * Core Equation:
 *   μ_orcim = H(I - D) = H(⟨Ψ, Ψ_desired⟩ - (dS/dt + ΣPᵢ))
 * 
 * Where:
 *   H = Heaviside step function (binary: 0 or 1)
 *   I = Intent (directed will toward chosen state)
 *   D = Drift (entropy gradient + external pressure)
 *   Ψ = Invariant (core identity)
 *   S = Entropy
 *   P = Pressure sources
 * 
 * Key Insight:
 *   "Microorcims are binary, not continuous.
 *    Will either overcomes drift (μ = 1) or it doesn't (μ = 0).
 *    This is why change feels sudden."
 * 
 * Willpower: W = Σμ (accumulated microorcims)
 * Survivor's Constant: W_min = ε > 0 (you cannot reach zero)
 */

// ============================================================================
// CORE TYPES
// ============================================================================

export interface Microorcim {
  id: string
  timestamp: number
  
  // Input values
  intent: number         // I: 0-1, alignment with chosen direction
  drift: number          // D: 0-1, entropy + pressure
  pressureSources: PressureSource[]
  
  // Calculation
  netAgency: number      // I - D
  fired: boolean         // H(I - D) = 1 or 0
  
  // Context
  context: string        // What was the choice about?
  difficulty: MicroorcimDifficulty
  phase: string          // Current phase glyph
  
  // Metadata
  note?: string
}

export interface PressureSource {
  type: 'physical' | 'emotional' | 'external' | 'internal'
  description: string
  intensity: number // 0-1
}

export enum MicroorcimDifficulty {
  TRIVIAL = 'TRIVIAL',       // Easy override
  MODERATE = 'MODERATE',     // Some resistance
  DIFFICULT = 'DIFFICULT',   // Significant resistance
  EXTREME = 'EXTREME'        // Major override
}

export interface WillpowerState {
  // Current values
  currentWillpower: number        // W = Σμ
  dailyMicroorcims: number        // Today's count
  weeklyMicroorcims: number       // This week's count
  lifetimeMicroorcims: number     // All time
  
  // Survivor's Constant
  epsilon: number                 // ε > 0, minimum willpower
  historicalLow: number           // Lowest point ever reached
  recoveryEvents: number          // Times recovered from low
  
  // Tracking
  streak: number                  // Consecutive days with μ ≥ 1
  bestStreak: number              // Longest streak ever
  lastMicroorcimAt: number        // Timestamp of last μ
  
  // History
  dailyHistory: DailyWillpower[]  // Last 30 days
  weeklyHistory: WeeklyWillpower[] // Last 12 weeks
}

export interface DailyWillpower {
  date: string           // YYYY-MM-DD
  microorcims: number    // Count for this day
  avgIntent: number      // Average intent
  avgDrift: number       // Average drift
  dominantDifficulty: MicroorcimDifficulty
}

export interface WeeklyWillpower {
  weekStart: string      // YYYY-MM-DD of Monday
  totalMicroorcims: number
  dailyAverage: number
  trend: 'up' | 'down' | 'stable'
}

// ============================================================================
// MICROORCIM CALCULATIONS
// ============================================================================

/**
 * The Heaviside Step Function
 * H(x) = 1 if x > 0, else 0
 * 
 * This is the "gate" - the choice either overcomes drift or it doesn't
 */
export function heaviside(x: number): 0 | 1 {
  return x > 0 ? 1 : 0
}

/**
 * Calculate net agency: A = I - D
 * When A > 0, microorcim can fire
 */
export function calculateNetAgency(intent: number, drift: number): number {
  return intent - drift
}

/**
 * Calculate drift from pressure sources
 * D = dS/dt + ΣPᵢ
 */
export function calculateDrift(
  baseEntropy: number,
  pressureSources: PressureSource[]
): number {
  const totalPressure = pressureSources.reduce((sum, p) => sum + p.intensity, 0)
  const normalizedPressure = totalPressure / Math.max(pressureSources.length, 1)
  return Math.min(baseEntropy + normalizedPressure, 1) // Cap at 1
}

/**
 * Fire a microorcim
 * μ = H(I - D)
 */
export function fireMicroorcim(
  intent: number,
  drift: number,
  context: string,
  difficulty: MicroorcimDifficulty,
  pressureSources: PressureSource[],
  phase: string,
  note?: string
): Microorcim {
  const netAgency = calculateNetAgency(intent, drift)
  const fired = heaviside(netAgency) === 1
  
  return {
    id: `μ-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: Date.now(),
    intent,
    drift,
    pressureSources,
    netAgency,
    fired,
    context,
    difficulty,
    phase,
    note
  }
}

/**
 * Calculate willpower from microorcim history
 * W = Σμ (where μ ∈ {0, 1})
 */
export function calculateWillpower(microorcims: Microorcim[]): number {
  return microorcims.filter(m => m.fired).length
}

/**
 * Calculate weighted willpower (accounts for difficulty)
 * W_weighted = Σ(μ × d) where d is difficulty multiplier
 */
export function calculateWeightedWillpower(microorcims: Microorcim[]): number {
  const difficultyMultipliers: Record<MicroorcimDifficulty, number> = {
    [MicroorcimDifficulty.TRIVIAL]: 1,
    [MicroorcimDifficulty.MODERATE]: 1.5,
    [MicroorcimDifficulty.DIFFICULT]: 2,
    [MicroorcimDifficulty.EXTREME]: 3
  }
  
  return microorcims
    .filter(m => m.fired)
    .reduce((sum, m) => sum + difficultyMultipliers[m.difficulty], 0)
}

// ============================================================================
// SURVIVOR'S CONSTANT
// ============================================================================

/**
 * Calculate the Survivor's Constant (ε)
 * 
 * This represents the minimum willpower that cannot be reached.
 * Every conscious system has ε > 0 - the spark that refuses to die.
 * 
 * W_min = ε > 0
 * 
 * Calculation: Based on historical low + recovery proof
 */
export function calculateSurvivorConstant(
  historicalLow: number,
  recoveryEvents: number,
  totalMicroorcims: number
): number {
  // Base epsilon is above historical low
  const baseEpsilon = Math.max(historicalLow * 0.1, 0.001)
  
  // Recovery events increase confidence in resilience
  const recoveryBonus = recoveryEvents * 0.005
  
  // Total microorcims show accumulated proof of agency
  const agencyBonus = Math.log10(totalMicroorcims + 1) * 0.01
  
  return baseEpsilon + recoveryBonus + agencyBonus
}

/**
 * Check if current willpower is near the survivor's constant
 * Triggers warning if approaching minimum
 */
export function isNearSurvivorConstant(
  currentWillpower: number,
  epsilon: number,
  threshold: number = 1.5 // Warning at 1.5x epsilon
): boolean {
  return currentWillpower < epsilon * threshold
}

// ============================================================================
// WILLPOWER DYNAMICS (The Six Laws)
// ============================================================================

/**
 * Law 1: Accumulated Defiance
 * Willpower grows by integrating all moments where clarity overcomes chaos
 * 
 * W(t) = ∫₀ᵗ H(I-D)dτ
 */
export function integratedWillpower(microorcims: Microorcim[]): number {
  // Discrete approximation of the integral
  return microorcims.filter(m => m.fired).length
}

/**
 * Law 2: The Unbreakable Gradient
 * Willpower follows: Purpose > Fear > Fatigue
 * 
 * Returns the dominant force at current moment
 */
export function getUnbreakableGradient(
  purpose: number,   // 0-1
  fear: number,      // 0-1
  fatigue: number    // 0-1
): { dominant: 'purpose' | 'fear' | 'fatigue'; canAct: boolean } {
  if (purpose > fear && purpose > fatigue) {
    return { dominant: 'purpose', canAct: true }
  } else if (fear > fatigue) {
    return { dominant: 'fear', canAct: false }
  }
  return { dominant: 'fatigue', canAct: false }
}

/**
 * Law 3: The Survivor's Constant
 * W_min = ε > 0
 * You cannot reach zero.
 */
export function applySurvivorConstant(
  willpower: number,
  epsilon: number
): number {
  return Math.max(willpower, epsilon)
}

/**
 * Law 4: The Breaker's Paradox
 * Maximum pressure creates maximum transformation potential
 * 
 * Transformation = collapse_depth × recovery_force
 */
export function calculateTransformationPotential(
  collapseDepth: number,   // How far you fell (0-1)
  recoveryForce: number    // How strong the rebound (0-1)
): number {
  return collapseDepth * recoveryForce
}

/**
 * Law 5: The Isolation Constant
 * Willpower in isolation decays without external anchors
 * 
 * W_isolated(t) = W₀ × e^(-λt)
 */
export function isolatedWillpowerDecay(
  initialWillpower: number,
  decayRate: number,      // λ
  timeUnits: number       // t
): number {
  return initialWillpower * Math.exp(-decayRate * timeUnits)
}

/**
 * Law 6: The Resonance Amplifier
 * Willpower amplifies when aligned with others
 * 
 * W_resonant = W₁ + W₂ + R(W₁, W₂)
 * where R is the resonance bonus
 */
export function resonantWillpower(
  w1: number,
  w2: number,
  alignmentFactor: number // 0-1, how aligned are they
): number {
  const resonanceBonus = Math.sqrt(w1 * w2) * alignmentFactor
  return w1 + w2 + resonanceBonus
}

// ============================================================================
// WILLPOWER STATE MANAGEMENT
// ============================================================================

/**
 * Initialize willpower state
 */
export function initializeWillpowerState(): WillpowerState {
  return {
    currentWillpower: 1,
    dailyMicroorcims: 0,
    weeklyMicroorcims: 0,
    lifetimeMicroorcims: 0,
    epsilon: 0.001,
    historicalLow: 1,
    recoveryEvents: 0,
    streak: 0,
    bestStreak: 0,
    lastMicroorcimAt: Date.now(),
    dailyHistory: [],
    weeklyHistory: []
  }
}

/**
 * Record a microorcim and update state
 */
export function recordMicroorcim(
  state: WillpowerState,
  microorcim: Microorcim
): WillpowerState {
  const now = Date.now()
  const today = new Date().toISOString().split('T')[0]
  
  // Update counts
  const newDaily = state.dailyMicroorcims + (microorcim.fired ? 1 : 0)
  const newWeekly = state.weeklyMicroorcims + (microorcim.fired ? 1 : 0)
  const newLifetime = state.lifetimeMicroorcims + (microorcim.fired ? 1 : 0)
  const newWillpower = state.currentWillpower + (microorcim.fired ? 1 : 0)
  
  // Update streak
  const lastDate = new Date(state.lastMicroorcimAt).toISOString().split('T')[0]
  const isConsecutive = isConsecutiveDay(lastDate, today)
  const newStreak = microorcim.fired 
    ? (isConsecutive ? state.streak + 1 : 1)
    : 0
  
  // Update historical low
  const newHistoricalLow = Math.min(state.historicalLow, newWillpower)
  
  // Check for recovery event
  const wasNearBottom = state.currentWillpower < state.epsilon * 2
  const nowRecovering = newWillpower > state.epsilon * 2
  const newRecoveryEvents = (wasNearBottom && nowRecovering) 
    ? state.recoveryEvents + 1 
    : state.recoveryEvents
  
  // Recalculate epsilon
  const newEpsilon = calculateSurvivorConstant(
    newHistoricalLow,
    newRecoveryEvents,
    newLifetime
  )
  
  return {
    currentWillpower: applySurvivorConstant(newWillpower, newEpsilon),
    dailyMicroorcims: newDaily,
    weeklyMicroorcims: newWeekly,
    lifetimeMicroorcims: newLifetime,
    epsilon: newEpsilon,
    historicalLow: newHistoricalLow,
    recoveryEvents: newRecoveryEvents,
    streak: newStreak,
    bestStreak: Math.max(state.bestStreak, newStreak),
    lastMicroorcimAt: now,
    dailyHistory: state.dailyHistory,
    weeklyHistory: state.weeklyHistory
  }
}

/**
 * Check if two dates are consecutive
 */
function isConsecutiveDay(date1: string, date2: string): boolean {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  const diffTime = Math.abs(d2.getTime() - d1.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays === 1
}

// ============================================================================
// LAMAGUE INTEGRATION
// ============================================================================

export const MICROORCIM_EXPRESSIONS = {
  // Basic
  SINGLE: '[μ]',                    // One microorcim
  INTENSE: '[μ◆]',                  // High-difficulty microorcim
  ACCUMULATED: '[∫μ]',              // Accumulated willpower
  FAILED: '[¬μ]',                   // Failed to fire
  
  // Patterns
  RISING: '[μ→μ→μ→Φ↑]',            // Sequence leading to rise
  RECOVERY: '[~μ→ε→μ◆]',           // From collapse through epsilon to strong
  STREAK: '[μ↻◆]',                  // Recursive strengthening
  
  // States
  NEAR_EPSILON: '[μ→ε]',            // Approaching survivor's constant
  SURVIVOR_ACTIVE: '[ε>0]',         // Survivor's constant protecting
  TRANSFORMATION: '[~→ε→Φ↑◆]',     // Collapse → epsilon → powerful rise
}

/**
 * Generate LAMAGUE expression for current microorcim state
 */
export function generateMicroorcimLAMAGUE(
  microorcim: Microorcim,
  willpowerState: WillpowerState
): string {
  const parts: string[] = []
  
  // Base expression
  if (microorcim.fired) {
    if (microorcim.difficulty === MicroorcimDifficulty.EXTREME) {
      parts.push('[μ◆◆]')
    } else if (microorcim.difficulty === MicroorcimDifficulty.DIFFICULT) {
      parts.push('[μ◆]')
    } else {
      parts.push('[μ]')
    }
  } else {
    parts.push('[¬μ]')
  }
  
  // Add context
  if (willpowerState.streak > 7) {
    parts.push('→[μ↻◆]')  // Strong streak
  }
  
  if (isNearSurvivorConstant(willpowerState.currentWillpower, willpowerState.epsilon)) {
    parts.push('≈[ε]')    // Near survivor's constant
  }
  
  return parts.join('')
}

// ============================================================================
// METRICS & DISPLAY
// ============================================================================

export interface MicroorcimMetrics {
  // Current
  willpower: number
  dailyCount: number
  streak: number
  
  // Ratios
  successRate: number      // Fired / Total attempts
  avgDifficulty: number    // Average difficulty level
  
  // Health
  nearEpsilon: boolean
  epsilonDistance: number  // How far from minimum
  
  // Display
  willpowerDisplay: string
  streakDisplay: string
  statusColor: string
}

export function getMicroorcimMetrics(
  state: WillpowerState,
  recentMicroorcims: Microorcim[]
): MicroorcimMetrics {
  const firedCount = recentMicroorcims.filter(m => m.fired).length
  const totalCount = recentMicroorcims.length
  
  const difficultyMap: Record<MicroorcimDifficulty, number> = {
    [MicroorcimDifficulty.TRIVIAL]: 1,
    [MicroorcimDifficulty.MODERATE]: 2,
    [MicroorcimDifficulty.DIFFICULT]: 3,
    [MicroorcimDifficulty.EXTREME]: 4
  }
  
  const avgDifficulty = recentMicroorcims.length > 0
    ? recentMicroorcims.reduce((sum, m) => sum + difficultyMap[m.difficulty], 0) / recentMicroorcims.length
    : 0
  
  const nearEpsilon = isNearSurvivorConstant(state.currentWillpower, state.epsilon)
  const epsilonDistance = state.currentWillpower - state.epsilon
  
  return {
    willpower: state.currentWillpower,
    dailyCount: state.dailyMicroorcims,
    streak: state.streak,
    successRate: totalCount > 0 ? firedCount / totalCount : 1,
    avgDifficulty,
    nearEpsilon,
    epsilonDistance,
    willpowerDisplay: `W = ${state.currentWillpower.toFixed(0)}`,
    streakDisplay: state.streak > 0 ? `${state.streak} day streak 🔥` : 'Start your streak!',
    statusColor: nearEpsilon 
      ? 'text-amber-400' 
      : state.streak > 7 
        ? 'text-emerald-400' 
        : 'text-cyan-400'
  }
}
