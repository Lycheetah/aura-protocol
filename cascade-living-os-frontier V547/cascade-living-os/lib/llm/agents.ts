/**
 * CASCADE AUTONOMOUS AGENTS
 * =========================
 * The living nervous system of CASCADE OS.
 * 
 * These agents run continuously in the background:
 * 1. SOVEREIGNTY GUARDIAN - Monitors drift, triggers alerts
 * 2. PHASE ORACLE - Tracks time, provides phase-aware guidance
 * 3. MICROORCIM DETECTOR - Automatically detects and logs agency events
 * 4. CASCADE WATCHER - Monitors knowledge for cascade triggers
 * 5. MEMORY CONSOLIDATOR - Compresses and organizes memories
 * 6. PROACTIVE ADVISOR - Generates unsolicited insights
 * 
 * Architecture:
 * - Event-driven with pub/sub
 * - Configurable tick intervals
 * - Priority queue for actions
 * - AURA constraint enforcement
 */

import { getLLMClient, LLMProvider } from './provider'

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export enum AgentType {
  SOVEREIGNTY_GUARDIAN = 'SOVEREIGNTY_GUARDIAN',
  PHASE_ORACLE = 'PHASE_ORACLE',
  MICROORCIM_DETECTOR = 'MICROORCIM_DETECTOR',
  CASCADE_WATCHER = 'CASCADE_WATCHER',
  MEMORY_CONSOLIDATOR = 'MEMORY_CONSOLIDATOR',
  PROACTIVE_ADVISOR = 'PROACTIVE_ADVISOR'
}

export enum AgentPriority {
  CRITICAL = 0,
  HIGH = 1,
  MEDIUM = 2,
  LOW = 3,
  BACKGROUND = 4
}

export enum EventType {
  DRIFT_DETECTED = 'DRIFT_DETECTED',
  PHASE_TRANSITION = 'PHASE_TRANSITION',
  MICROORCIM_FIRED = 'MICROORCIM_FIRED',
  CASCADE_TRIGGERED = 'CASCADE_TRIGGERED',
  MEMORY_CONSOLIDATED = 'MEMORY_CONSOLIDATED',
  INSIGHT_GENERATED = 'INSIGHT_GENERATED',
  SOVEREIGNTY_ALERT = 'SOVEREIGNTY_ALERT',
  USER_ACTIVITY = 'USER_ACTIVITY',
  SYSTEM_TICK = 'SYSTEM_TICK'
}

export interface AgentEvent {
  type: EventType
  source: AgentType | 'USER' | 'SYSTEM'
  payload: Record<string, unknown>
  timestamp: number
  priority: AgentPriority
}

export interface AgentAction {
  id: string
  type: 'NOTIFICATION' | 'SUGGESTION' | 'AUTO_ACTION' | 'ALERT' | 'LOG'
  title: string
  message: string
  priority: AgentPriority
  source: AgentType
  timestamp: number
  metadata?: Record<string, unknown>
  dismissed?: boolean
}

export interface AgentState {
  type: AgentType
  isRunning: boolean
  lastTick: number
  tickInterval: number
  actionCount: number
  errorCount: number
  metadata: Record<string, unknown>
}

type EventHandler = (event: AgentEvent) => void | Promise<void>

// ============================================================================
// EVENT BUS - Pub/Sub System
// ============================================================================

class EventBus {
  private handlers: Map<EventType, Set<EventHandler>> = new Map()
  private eventLog: AgentEvent[] = []
  private maxLogSize = 1000
  
  subscribe(eventType: EventType, handler: EventHandler): () => void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set())
    }
    this.handlers.get(eventType)!.add(handler)
    
    // Return unsubscribe function
    return () => {
      this.handlers.get(eventType)?.delete(handler)
    }
  }
  
  async publish(event: AgentEvent): Promise<void> {
    // Log event
    this.eventLog.push(event)
    if (this.eventLog.length > this.maxLogSize) {
      this.eventLog.shift()
    }
    
    // Notify handlers
    const handlers = this.handlers.get(event.type)
    if (handlers) {
      const promises = Array.from(handlers).map(handler => {
        try {
          return Promise.resolve(handler(event))
        } catch (error) {
          console.error(`Event handler error for ${event.type}:`, error)
          return Promise.resolve()
        }
      })
      await Promise.all(promises)
    }
  }
  
  getRecentEvents(count: number = 50): AgentEvent[] {
    return this.eventLog.slice(-count)
  }
}

// ============================================================================
// ACTION QUEUE - Priority Queue for Agent Actions
// ============================================================================

class ActionQueue {
  private actions: AgentAction[] = []
  private maxSize = 100
  
  enqueue(action: AgentAction): void {
    this.actions.push(action)
    this.actions.sort((a, b) => a.priority - b.priority)
    
    if (this.actions.length > this.maxSize) {
      // Remove lowest priority items
      this.actions = this.actions.slice(0, this.maxSize)
    }
  }
  
  dequeue(): AgentAction | undefined {
    return this.actions.shift()
  }
  
  peek(): AgentAction | undefined {
    return this.actions[0]
  }
  
  getAll(): AgentAction[] {
    return [...this.actions]
  }
  
  getBySource(source: AgentType): AgentAction[] {
    return this.actions.filter(a => a.source === source)
  }
  
  dismiss(actionId: string): void {
    const action = this.actions.find(a => a.id === actionId)
    if (action) {
      action.dismissed = true
    }
  }
  
  clear(): void {
    this.actions = []
  }
  
  get length(): number {
    return this.actions.length
  }
}

// ============================================================================
// BASE AGENT CLASS
// ============================================================================

abstract class BaseAgent {
  protected state: AgentState
  protected eventBus: EventBus
  protected actionQueue: ActionQueue
  private tickTimer: NodeJS.Timeout | null = null
  
  constructor(
    type: AgentType,
    eventBus: EventBus,
    actionQueue: ActionQueue,
    tickInterval: number = 60000 // 1 minute default
  ) {
    this.eventBus = eventBus
    this.actionQueue = actionQueue
    this.state = {
      type,
      isRunning: false,
      lastTick: 0,
      tickInterval,
      actionCount: 0,
      errorCount: 0,
      metadata: {}
    }
  }
  
  start(): void {
    if (this.state.isRunning) return
    
    this.state.isRunning = true
    this.onStart()
    
    // Start tick loop
    this.tickTimer = setInterval(() => this.tick(), this.state.tickInterval)
    
    // Immediate first tick
    this.tick()
  }
  
  stop(): void {
    if (!this.state.isRunning) return
    
    this.state.isRunning = false
    if (this.tickTimer) {
      clearInterval(this.tickTimer)
      this.tickTimer = null
    }
    this.onStop()
  }
  
  private async tick(): Promise<void> {
    if (!this.state.isRunning) return
    
    try {
      await this.onTick()
      this.state.lastTick = Date.now()
    } catch (error) {
      this.state.errorCount++
      console.error(`Agent ${this.state.type} tick error:`, error)
    }
  }
  
  protected createAction(
    type: AgentAction['type'],
    title: string,
    message: string,
    priority: AgentPriority = AgentPriority.MEDIUM,
    metadata?: Record<string, unknown>
  ): void {
    const action: AgentAction = {
      id: `${this.state.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      title,
      message,
      priority,
      source: this.state.type,
      timestamp: Date.now(),
      metadata
    }
    
    this.actionQueue.enqueue(action)
    this.state.actionCount++
  }
  
  protected async publishEvent(
    type: EventType,
    payload: Record<string, unknown>,
    priority: AgentPriority = AgentPriority.MEDIUM
  ): Promise<void> {
    await this.eventBus.publish({
      type,
      source: this.state.type,
      payload,
      timestamp: Date.now(),
      priority
    })
  }
  
  getState(): AgentState {
    return { ...this.state }
  }
  
  // Abstract methods for subclasses
  protected abstract onStart(): void
  protected abstract onStop(): void
  protected abstract onTick(): Promise<void>
}

// ============================================================================
// SOVEREIGNTY GUARDIAN AGENT
// ============================================================================

class SovereigntyGuardianAgent extends BaseAgent {
  private driftThreshold = 0.3
  private coherenceThreshold = 0.7
  private lastSovereigntyValue = 1.0
  
  constructor(eventBus: EventBus, actionQueue: ActionQueue) {
    super(AgentType.SOVEREIGNTY_GUARDIAN, eventBus, actionQueue, 30000) // 30 second ticks
  }
  
  protected onStart(): void {
    // Subscribe to relevant events
    this.eventBus.subscribe(EventType.USER_ACTIVITY, this.handleUserActivity.bind(this))
    this.eventBus.subscribe(EventType.MICROORCIM_FIRED, this.handleMicroorcim.bind(this))
  }
  
  protected onStop(): void {
    // Cleanup
  }
  
  protected async onTick(): Promise<void> {
    // Simulate checking sovereignty metrics
    // In real implementation, this would read from the store
    const currentSovereignty = this.state.metadata.sovereignty as number || 0.85
    const drift = this.state.metadata.drift as number || 0.1
    const coherence = this.state.metadata.coherence as number || 0.9
    
    // Check for drift
    if (drift > this.driftThreshold) {
      this.createAction(
        'ALERT',
        '⚠️ Drift Detected',
        `Sovereignty drift has reached ${(drift * 100).toFixed(1)}%. Consider re-centering with phase practices.`,
        AgentPriority.HIGH,
        { drift, threshold: this.driftThreshold }
      )
      
      await this.publishEvent(EventType.DRIFT_DETECTED, { drift, threshold: this.driftThreshold })
    }
    
    // Check for coherence drop
    if (coherence < this.coherenceThreshold) {
      this.createAction(
        'SUGGESTION',
        '🔄 Coherence Low',
        `System coherence at ${(coherence * 100).toFixed(1)}%. A knowledge cascade may be needed.`,
        AgentPriority.MEDIUM,
        { coherence, threshold: this.coherenceThreshold }
      )
    }
    
    // Check for sovereignty changes
    const sovereigntyDelta = currentSovereignty - this.lastSovereigntyValue
    if (Math.abs(sovereigntyDelta) > 0.1) {
      const direction = sovereigntyDelta > 0 ? 'increased' : 'decreased'
      this.createAction(
        'NOTIFICATION',
        `Sovereignty ${direction}`,
        `Your sovereignty has ${direction} to ${(currentSovereignty * 100).toFixed(0)}%`,
        AgentPriority.LOW
      )
    }
    
    this.lastSovereigntyValue = currentSovereignty
  }
  
  private handleUserActivity(event: AgentEvent): void {
    // Update metadata based on user activity
    this.state.metadata.lastActivity = event.timestamp
  }
  
  private handleMicroorcim(event: AgentEvent): void {
    // Microorcims positively affect sovereignty
    const currentSovereignty = this.state.metadata.sovereignty as number || 0.85
    this.state.metadata.sovereignty = Math.min(currentSovereignty + 0.01, 1.0)
    this.state.metadata.drift = Math.max((this.state.metadata.drift as number || 0.1) - 0.02, 0)
  }
  
  // Public method to update sovereignty data
  updateSovereigntyData(sovereignty: number, drift: number, coherence: number): void {
    this.state.metadata.sovereignty = sovereignty
    this.state.metadata.drift = drift
    this.state.metadata.coherence = coherence
  }
}

// ============================================================================
// PHASE ORACLE AGENT
// ============================================================================

class PhaseOracleAgent extends BaseAgent {
  private currentPhaseIndex = 0
  private lastDayOfYear = 0
  
  constructor(eventBus: EventBus, actionQueue: ActionQueue) {
    super(AgentType.PHASE_ORACLE, eventBus, actionQueue, 3600000) // 1 hour ticks
  }
  
  protected onStart(): void {
    this.calculateCurrentPhase()
  }
  
  protected onStop(): void {}
  
  protected async onTick(): Promise<void> {
    const now = new Date()
    const startOfYear = new Date(now.getFullYear(), 0, 0)
    const diff = now.getTime() - startOfYear.getTime()
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    // Check for day change
    if (dayOfYear !== this.lastDayOfYear) {
      this.lastDayOfYear = dayOfYear
      
      const oldPhase = this.currentPhaseIndex
      this.calculateCurrentPhase()
      
      // Phase transition?
      if (this.currentPhaseIndex !== oldPhase) {
        const phaseNames = ['Center ⟟', 'Flow ≋', 'Insight Ψ', 'Rise Φ↑', 'Light ✧', 'Integrity ∥◁▷∥', 'Return ⟲']
        
        this.createAction(
          'NOTIFICATION',
          '🌙 Phase Transition',
          `You have entered the ${phaseNames[this.currentPhaseIndex]} phase. New practices and focus areas are available.`,
          AgentPriority.HIGH,
          { oldPhase, newPhase: this.currentPhaseIndex }
        )
        
        await this.publishEvent(EventType.PHASE_TRANSITION, {
          oldPhase,
          newPhase: this.currentPhaseIndex,
          dayOfYear
        })
      }
      
      // Daily phase reminder
      const dayInPhase = ((dayOfYear - 1) % 52) + 1
      const daysRemaining = 52 - dayInPhase
      
      if (dayInPhase === 1) {
        this.createAction(
          'SUGGESTION',
          '🌅 New Phase Block Beginning',
          `Day 1 of this phase. Focus on establishing foundations.`,
          AgentPriority.MEDIUM
        )
      } else if (daysRemaining <= 7) {
        this.createAction(
          'NOTIFICATION',
          '⏳ Phase Ending Soon',
          `${daysRemaining} days until phase transition. Begin integration work.`,
          AgentPriority.LOW
        )
      }
    }
  }
  
  private calculateCurrentPhase(): void {
    const now = new Date()
    const startOfYear = new Date(now.getFullYear(), 0, 0)
    const diff = now.getTime() - startOfYear.getTime()
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    this.currentPhaseIndex = Math.floor((dayOfYear - 1) / 52) % 7
    this.lastDayOfYear = dayOfYear
  }
  
  getCurrentPhase(): { index: number; dayInPhase: number; daysRemaining: number } {
    const now = new Date()
    const startOfYear = new Date(now.getFullYear(), 0, 0)
    const diff = now.getTime() - startOfYear.getTime()
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24))
    const dayInPhase = ((dayOfYear - 1) % 52) + 1
    
    return {
      index: this.currentPhaseIndex,
      dayInPhase,
      daysRemaining: 52 - dayInPhase
    }
  }
}

// ============================================================================
// PROACTIVE ADVISOR AGENT
// ============================================================================

class ProactiveAdvisorAgent extends BaseAgent {
  private llmClient = getLLMClient()
  private insightCooldown = 4 * 60 * 60 * 1000 // 4 hours between insights
  private lastInsightTime = 0
  
  constructor(eventBus: EventBus, actionQueue: ActionQueue) {
    super(AgentType.PROACTIVE_ADVISOR, eventBus, actionQueue, 300000) // 5 minute ticks
  }
  
  protected onStart(): void {
    this.eventBus.subscribe(EventType.DRIFT_DETECTED, this.handleDrift.bind(this))
    this.eventBus.subscribe(EventType.PHASE_TRANSITION, this.handlePhaseTransition.bind(this))
    this.eventBus.subscribe(EventType.CASCADE_TRIGGERED, this.handleCascade.bind(this))
  }
  
  protected onStop(): void {}
  
  protected async onTick(): Promise<void> {
    // Check if enough time has passed for a proactive insight
    const now = Date.now()
    if (now - this.lastInsightTime < this.insightCooldown) return
    
    // Only generate if there's been activity
    const recentEvents = this.eventBus.getRecentEvents(10)
    if (recentEvents.length < 3) return
    
    // Generate proactive insight
    await this.generateInsight()
  }
  
  private async handleDrift(event: AgentEvent): Promise<void> {
    const drift = event.payload.drift as number
    
    try {
      const response = await this.llmClient.chat(
        `The user's sovereignty drift has reached ${(drift * 100).toFixed(1)}%. 
        Generate a brief (2-3 sentences) supportive message with one specific action they can take to re-center. 
        Use LAMAGUE symbols where appropriate. Be encouraging, not alarming.`,
        { includeHistory: false }
      )
      
      this.createAction(
        'SUGGESTION',
        '🧭 Drift Recovery Guidance',
        response.content,
        AgentPriority.HIGH,
        { drift, llmProvider: response.provider }
      )
    } catch (error) {
      // Fallback without LLM
      this.createAction(
        'SUGGESTION',
        '🧭 Drift Recovery',
        `Return to center (⟟). Take three breaths. Remember your invariant. μ = H(I - D)`,
        AgentPriority.HIGH
      )
    }
  }
  
  private async handlePhaseTransition(event: AgentEvent): Promise<void> {
    const newPhase = event.payload.newPhase as number
    const phaseNames = ['Center', 'Flow', 'Insight', 'Rise', 'Light', 'Integrity', 'Return']
    const phaseGlyphs = ['⟟', '≋', 'Ψ', 'Φ↑', '✧', '∥◁▷∥', '⟲']
    
    try {
      const response = await this.llmClient.chat(
        `The user has just entered the ${phaseNames[newPhase]} (${phaseGlyphs[newPhase]}) phase of the 364-day sovereign cycle.
        Generate a brief welcome message (3-4 sentences) that:
        1. Names the phase and its symbol
        2. Describes what this phase is for
        3. Suggests one key practice
        Be inspiring and use LAMAGUE symbols.`,
        { includeHistory: false }
      )
      
      this.createAction(
        'NOTIFICATION',
        `Welcome to ${phaseNames[newPhase]} ${phaseGlyphs[newPhase]}`,
        response.content,
        AgentPriority.HIGH
      )
    } catch (error) {
      // Fallback
      this.createAction(
        'NOTIFICATION',
        `Welcome to ${phaseNames[newPhase]} ${phaseGlyphs[newPhase]}`,
        `A new phase begins. ${phaseGlyphs[newPhase]} The cycle continues. Embrace this transition.`,
        AgentPriority.HIGH
      )
    }
  }
  
  private async handleCascade(event: AgentEvent): Promise<void> {
    this.createAction(
      'NOTIFICATION',
      '∇ Cascade Complete',
      `Knowledge has reorganized. Your pyramid structure has updated. Review changes in the Knowledge section.`,
      AgentPriority.MEDIUM
    )
  }
  
  private async generateInsight(): Promise<void> {
    this.lastInsightTime = Date.now()
    
    const prompts = [
      'Generate a brief (2 sentences) Zen-like insight about sovereignty and the invariant. Use at least one LAMAGUE symbol.',
      'Share a brief microorcim wisdom (2 sentences) about choosing intent over drift.',
      'Offer a brief meditation prompt (2 sentences) related to the current moment and phase awareness.',
      'Generate a brief affirmation (2 sentences) about returning to center after difficulty.'
    ]
    
    const prompt = prompts[Math.floor(Math.random() * prompts.length)]
    
    try {
      const response = await this.llmClient.chat(prompt, { includeHistory: false })
      
      this.createAction(
        'SUGGESTION',
        '✨ Insight',
        response.content,
        AgentPriority.LOW,
        { type: 'proactive_insight' }
      )
      
      await this.publishEvent(EventType.INSIGHT_GENERATED, { insight: response.content })
    } catch (error) {
      // Silent fail for proactive insights
    }
  }
}

// ============================================================================
// AGENT MANAGER - Orchestrates All Agents
// ============================================================================

export class AgentManager {
  private eventBus: EventBus
  private actionQueue: ActionQueue
  private agents: Map<AgentType, BaseAgent> = new Map()
  private isRunning = false
  
  constructor() {
    this.eventBus = new EventBus()
    this.actionQueue = new ActionQueue()
    
    // Initialize agents
    this.agents.set(
      AgentType.SOVEREIGNTY_GUARDIAN,
      new SovereigntyGuardianAgent(this.eventBus, this.actionQueue)
    )
    this.agents.set(
      AgentType.PHASE_ORACLE,
      new PhaseOracleAgent(this.eventBus, this.actionQueue)
    )
    this.agents.set(
      AgentType.PROACTIVE_ADVISOR,
      new ProactiveAdvisorAgent(this.eventBus, this.actionQueue)
    )
  }
  
  /**
   * Start all agents
   */
  startAll(): void {
    if (this.isRunning) return
    
    this.isRunning = true
    this.agents.forEach(agent => agent.start())
    
    console.log('🚀 CASCADE Agents started')
  }
  
  /**
   * Stop all agents
   */
  stopAll(): void {
    if (!this.isRunning) return
    
    this.isRunning = false
    this.agents.forEach(agent => agent.stop())
    
    console.log('⏹️ CASCADE Agents stopped')
  }
  
  /**
   * Start specific agent
   */
  startAgent(type: AgentType): void {
    this.agents.get(type)?.start()
  }
  
  /**
   * Stop specific agent
   */
  stopAgent(type: AgentType): void {
    this.agents.get(type)?.stop()
  }
  
  /**
   * Get agent state
   */
  getAgentState(type: AgentType): AgentState | undefined {
    return this.agents.get(type)?.getState()
  }
  
  /**
   * Get all agent states
   */
  getAllAgentStates(): Record<AgentType, AgentState> {
    const states: Partial<Record<AgentType, AgentState>> = {}
    this.agents.forEach((agent, type) => {
      states[type] = agent.getState()
    })
    return states as Record<AgentType, AgentState>
  }
  
  /**
   * Get pending actions
   */
  getActions(): AgentAction[] {
    return this.actionQueue.getAll()
  }
  
  /**
   * Dismiss an action
   */
  dismissAction(actionId: string): void {
    this.actionQueue.dismiss(actionId)
  }
  
  /**
   * Clear all actions
   */
  clearActions(): void {
    this.actionQueue.clear()
  }
  
  /**
   * Publish user activity event
   */
  async publishUserActivity(activityType: string, data?: Record<string, unknown>): Promise<void> {
    await this.eventBus.publish({
      type: EventType.USER_ACTIVITY,
      source: 'USER',
      payload: { activityType, ...data },
      timestamp: Date.now(),
      priority: AgentPriority.MEDIUM
    })
  }
  
  /**
   * Publish microorcim event
   */
  async publishMicroorcim(fired: boolean, context?: string): Promise<void> {
    await this.eventBus.publish({
      type: EventType.MICROORCIM_FIRED,
      source: 'USER',
      payload: { fired, context },
      timestamp: Date.now(),
      priority: AgentPriority.HIGH
    })
  }
  
  /**
   * Update sovereignty data (for guardian agent)
   */
  updateSovereigntyData(sovereignty: number, drift: number, coherence: number): void {
    const guardian = this.agents.get(AgentType.SOVEREIGNTY_GUARDIAN) as SovereigntyGuardianAgent
    guardian?.updateSovereigntyData(sovereignty, drift, coherence)
  }
  
  /**
   * Get recent events
   */
  getRecentEvents(count: number = 50): AgentEvent[] {
    return this.eventBus.getRecentEvents(count)
  }
  
  /**
   * Subscribe to events
   */
  subscribe(eventType: EventType, handler: EventHandler): () => void {
    return this.eventBus.subscribe(eventType, handler)
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

let managerInstance: AgentManager | null = null

export function getAgentManager(): AgentManager {
  if (!managerInstance) {
    managerInstance = new AgentManager()
  }
  return managerInstance
}
