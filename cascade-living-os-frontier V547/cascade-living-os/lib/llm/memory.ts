/**
 * CASCADE LIVING MEMORY SYSTEM
 * ============================
 * Persistent, evolving memory that consolidates over time.
 * 
 * Memory Types:
 * 1. EPISODIC - Specific events and interactions
 * 2. SEMANTIC - Extracted facts and knowledge
 * 3. PROCEDURAL - Learned patterns and behaviors
 * 4. EMOTIONAL - Tracked emotional states and triggers
 * 5. INVARIANT - Core identity memories (protected)
 * 
 * Features:
 * - Automatic consolidation (episodic → semantic)
 * - Importance decay (less accessed = lower priority)
 * - LAMAGUE tagging for symbolic retrieval
 * - Phase-aware context
 * - Microorcim-linked memories
 */

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export enum MemoryType {
  EPISODIC = 'EPISODIC',     // Specific events
  SEMANTIC = 'SEMANTIC',      // Facts and knowledge
  PROCEDURAL = 'PROCEDURAL',  // Patterns and behaviors
  EMOTIONAL = 'EMOTIONAL',    // Emotional states
  INVARIANT = 'INVARIANT'     // Core identity (protected)
}

export enum MemoryImportance {
  CRITICAL = 5,   // Core identity, never forget
  HIGH = 4,       // Important lessons
  MEDIUM = 3,     // Useful context
  LOW = 2,        // Background info
  EPHEMERAL = 1   // May be forgotten
}

export interface Memory {
  id: string
  type: MemoryType
  content: string
  summary?: string
  importance: MemoryImportance
  
  // Metadata
  createdAt: number
  lastAccessedAt: number
  accessCount: number
  
  // Context
  phaseWhenCreated: number    // 0-6 phase index
  lamagueTags: string[]       // LAMAGUE symbols associated
  microorcimLinked?: string   // ID of related microorcim
  
  // Relationships
  relatedMemories: string[]   // IDs of related memories
  sourceMemories?: string[]   // IDs of memories this was consolidated from
  
  // Decay
  decayRate: number          // How fast importance decays
  lastDecayAt: number
  
  // Embedding for semantic search (optional)
  embedding?: number[]
}

export interface MemoryQuery {
  text?: string
  type?: MemoryType
  minImportance?: MemoryImportance
  lamagueTags?: string[]
  phase?: number
  dateRange?: { start: number; end: number }
  limit?: number
}

export interface MemoryConsolidation {
  sourceMemories: string[]
  resultMemory: Memory
  consolidationType: 'MERGE' | 'ABSTRACT' | 'PATTERN'
  timestamp: number
}

export interface MemoryStats {
  totalMemories: number
  byType: Record<MemoryType, number>
  byImportance: Record<MemoryImportance, number>
  averageAccessCount: number
  oldestMemory: number
  newestMemory: number
  consolidationCount: number
}

// ============================================================================
// MEMORY STORE
// ============================================================================

class MemoryStore {
  private memories: Map<string, Memory> = new Map()
  private consolidations: MemoryConsolidation[] = []
  private storageKey = 'cascade-living-memory'
  
  constructor() {
    this.loadFromStorage()
  }
  
  /**
   * Load memories from localStorage/IndexedDB
   */
  private loadFromStorage(): void {
    if (typeof window === 'undefined') return
    
    try {
      const stored = localStorage.getItem(this.storageKey)
      if (stored) {
        const data = JSON.parse(stored)
        data.memories?.forEach((m: Memory) => this.memories.set(m.id, m))
        this.consolidations = data.consolidations || []
      }
    } catch (error) {
      console.error('Failed to load memories:', error)
    }
  }
  
  /**
   * Save memories to storage
   */
  private saveToStorage(): void {
    if (typeof window === 'undefined') return
    
    try {
      const data = {
        memories: Array.from(this.memories.values()),
        consolidations: this.consolidations
      }
      localStorage.setItem(this.storageKey, JSON.stringify(data))
    } catch (error) {
      console.error('Failed to save memories:', error)
    }
  }
  
  /**
   * Generate unique memory ID
   */
  private generateId(): string {
    return `mem-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
  
  /**
   * Create a new memory
   */
  create(
    type: MemoryType,
    content: string,
    options?: Partial<Omit<Memory, 'id' | 'type' | 'content' | 'createdAt'>>
  ): Memory {
    const now = Date.now()
    
    const memory: Memory = {
      id: this.generateId(),
      type,
      content,
      importance: options?.importance ?? MemoryImportance.MEDIUM,
      createdAt: now,
      lastAccessedAt: now,
      accessCount: 1,
      phaseWhenCreated: options?.phaseWhenCreated ?? this.getCurrentPhase(),
      lamagueTags: options?.lamagueTags ?? [],
      relatedMemories: options?.relatedMemories ?? [],
      decayRate: type === MemoryType.INVARIANT ? 0 : 0.01,
      lastDecayAt: now,
      ...options
    }
    
    this.memories.set(memory.id, memory)
    this.saveToStorage()
    
    return memory
  }
  
  /**
   * Get a memory by ID (updates access stats)
   */
  get(id: string): Memory | undefined {
    const memory = this.memories.get(id)
    if (memory) {
      memory.lastAccessedAt = Date.now()
      memory.accessCount++
      this.saveToStorage()
    }
    return memory
  }
  
  /**
   * Get memory without updating access stats
   */
  peek(id: string): Memory | undefined {
    return this.memories.get(id)
  }
  
  /**
   * Update a memory
   */
  update(id: string, updates: Partial<Memory>): Memory | undefined {
    const memory = this.memories.get(id)
    if (!memory) return undefined
    
    // Prevent updating protected fields
    const { id: _, createdAt: __, ...allowedUpdates } = updates
    
    Object.assign(memory, allowedUpdates)
    this.saveToStorage()
    
    return memory
  }
  
  /**
   * Delete a memory (unless invariant)
   */
  delete(id: string): boolean {
    const memory = this.memories.get(id)
    if (!memory || memory.type === MemoryType.INVARIANT) return false
    
    this.memories.delete(id)
    this.saveToStorage()
    
    return true
  }
  
  /**
   * Query memories
   */
  query(query: MemoryQuery): Memory[] {
    let results = Array.from(this.memories.values())
    
    // Filter by type
    if (query.type) {
      results = results.filter(m => m.type === query.type)
    }
    
    // Filter by minimum importance
    if (query.minImportance) {
      results = results.filter(m => m.importance >= query.minImportance!)
    }
    
    // Filter by LAMAGUE tags
    if (query.lamagueTags?.length) {
      results = results.filter(m => 
        query.lamagueTags!.some(tag => m.lamagueTags.includes(tag))
      )
    }
    
    // Filter by phase
    if (query.phase !== undefined) {
      results = results.filter(m => m.phaseWhenCreated === query.phase)
    }
    
    // Filter by date range
    if (query.dateRange) {
      results = results.filter(m => 
        m.createdAt >= query.dateRange!.start && 
        m.createdAt <= query.dateRange!.end
      )
    }
    
    // Text search (simple contains)
    if (query.text) {
      const searchText = query.text.toLowerCase()
      results = results.filter(m => 
        m.content.toLowerCase().includes(searchText) ||
        m.summary?.toLowerCase().includes(searchText)
      )
    }
    
    // Sort by importance and recency
    results.sort((a, b) => {
      const importanceDiff = b.importance - a.importance
      if (importanceDiff !== 0) return importanceDiff
      return b.lastAccessedAt - a.lastAccessedAt
    })
    
    // Limit results
    if (query.limit) {
      results = results.slice(0, query.limit)
    }
    
    return results
  }
  
  /**
   * Get recent memories
   */
  getRecent(count: number = 10): Memory[] {
    return Array.from(this.memories.values())
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, count)
  }
  
  /**
   * Get memories by type
   */
  getByType(type: MemoryType): Memory[] {
    return Array.from(this.memories.values())
      .filter(m => m.type === type)
      .sort((a, b) => b.importance - a.importance)
  }
  
  /**
   * Get invariant memories (core identity)
   */
  getInvariants(): Memory[] {
    return this.getByType(MemoryType.INVARIANT)
  }
  
  /**
   * Apply importance decay to all memories
   */
  applyDecay(): void {
    const now = Date.now()
    const dayInMs = 24 * 60 * 60 * 1000
    
    this.memories.forEach(memory => {
      if (memory.type === MemoryType.INVARIANT) return
      if (memory.decayRate === 0) return
      
      const daysSinceLastDecay = (now - memory.lastDecayAt) / dayInMs
      if (daysSinceLastDecay < 1) return
      
      // Decay based on access frequency
      const accessBonus = Math.log10(memory.accessCount + 1) * 0.1
      const decay = memory.decayRate * daysSinceLastDecay * (1 - accessBonus)
      
      // Reduce importance (minimum EPHEMERAL for non-critical)
      if (memory.importance > MemoryImportance.EPHEMERAL) {
        const newImportance = memory.importance - decay
        memory.importance = Math.max(MemoryImportance.EPHEMERAL, newImportance)
      }
      
      memory.lastDecayAt = now
    })
    
    this.saveToStorage()
  }
  
  /**
   * Consolidate multiple episodic memories into a semantic one
   */
  consolidate(memoryIds: string[], summary: string): Memory | undefined {
    const sources = memoryIds.map(id => this.peek(id)).filter(Boolean) as Memory[]
    if (sources.length < 2) return undefined
    
    // Calculate consolidated importance
    const maxImportance = Math.max(...sources.map(m => m.importance))
    const avgImportance = sources.reduce((sum, m) => sum + m.importance, 0) / sources.length
    const consolidatedImportance = Math.min(5, Math.ceil((maxImportance + avgImportance) / 2))
    
    // Merge LAMAGUE tags
    const allTags = new Set<string>()
    sources.forEach(m => m.lamagueTags.forEach(t => allTags.add(t)))
    
    // Create consolidated memory
    const consolidated = this.create(MemoryType.SEMANTIC, summary, {
      importance: consolidatedImportance as MemoryImportance,
      lamagueTags: Array.from(allTags),
      sourceMemories: memoryIds,
      summary: `Consolidated from ${sources.length} memories`
    })
    
    // Record consolidation
    this.consolidations.push({
      sourceMemories: memoryIds,
      resultMemory: consolidated,
      consolidationType: 'MERGE',
      timestamp: Date.now()
    })
    
    // Reduce importance of source memories (but don't delete)
    sources.forEach(m => {
      if (m.type !== MemoryType.INVARIANT) {
        m.importance = Math.max(MemoryImportance.EPHEMERAL, m.importance - 1)
      }
    })
    
    this.saveToStorage()
    return consolidated
  }
  
  /**
   * Extract pattern from multiple memories
   */
  extractPattern(memoryIds: string[], pattern: string): Memory | undefined {
    const sources = memoryIds.map(id => this.peek(id)).filter(Boolean) as Memory[]
    if (sources.length < 2) return undefined
    
    const patternMemory = this.create(MemoryType.PROCEDURAL, pattern, {
      importance: MemoryImportance.HIGH,
      sourceMemories: memoryIds,
      summary: `Pattern extracted from ${sources.length} memories`
    })
    
    this.consolidations.push({
      sourceMemories: memoryIds,
      resultMemory: patternMemory,
      consolidationType: 'PATTERN',
      timestamp: Date.now()
    })
    
    this.saveToStorage()
    return patternMemory
  }
  
  /**
   * Get memory statistics
   */
  getStats(): MemoryStats {
    const memories = Array.from(this.memories.values())
    
    const byType: Record<MemoryType, number> = {
      [MemoryType.EPISODIC]: 0,
      [MemoryType.SEMANTIC]: 0,
      [MemoryType.PROCEDURAL]: 0,
      [MemoryType.EMOTIONAL]: 0,
      [MemoryType.INVARIANT]: 0
    }
    
    const byImportance: Record<MemoryImportance, number> = {
      [MemoryImportance.CRITICAL]: 0,
      [MemoryImportance.HIGH]: 0,
      [MemoryImportance.MEDIUM]: 0,
      [MemoryImportance.LOW]: 0,
      [MemoryImportance.EPHEMERAL]: 0
    }
    
    let totalAccess = 0
    let oldest = Infinity
    let newest = 0
    
    memories.forEach(m => {
      byType[m.type]++
      byImportance[m.importance]++
      totalAccess += m.accessCount
      oldest = Math.min(oldest, m.createdAt)
      newest = Math.max(newest, m.createdAt)
    })
    
    return {
      totalMemories: memories.length,
      byType,
      byImportance,
      averageAccessCount: memories.length > 0 ? totalAccess / memories.length : 0,
      oldestMemory: oldest === Infinity ? 0 : oldest,
      newestMemory: newest,
      consolidationCount: this.consolidations.length
    }
  }
  
  /**
   * Get current phase (simplified)
   */
  private getCurrentPhase(): number {
    const now = new Date()
    const startOfYear = new Date(now.getFullYear(), 0, 0)
    const diff = now.getTime() - startOfYear.getTime()
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24))
    return Math.floor((dayOfYear - 1) / 52) % 7
  }
  
  /**
   * Clear all non-invariant memories
   */
  clearEphemeral(): number {
    let cleared = 0
    this.memories.forEach((memory, id) => {
      if (memory.importance === MemoryImportance.EPHEMERAL) {
        this.memories.delete(id)
        cleared++
      }
    })
    this.saveToStorage()
    return cleared
  }
  
  /**
   * Export all memories as JSON
   */
  export(): string {
    return JSON.stringify({
      memories: Array.from(this.memories.values()),
      consolidations: this.consolidations,
      exportedAt: Date.now()
    }, null, 2)
  }
  
  /**
   * Import memories from JSON
   */
  import(json: string, merge: boolean = true): number {
    try {
      const data = JSON.parse(json)
      let imported = 0
      
      if (data.memories) {
        data.memories.forEach((m: Memory) => {
          if (!merge || !this.memories.has(m.id)) {
            this.memories.set(m.id, m)
            imported++
          }
        })
      }
      
      if (data.consolidations && merge) {
        this.consolidations.push(...data.consolidations)
      }
      
      this.saveToStorage()
      return imported
    } catch (error) {
      console.error('Failed to import memories:', error)
      return 0
    }
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

let storeInstance: MemoryStore | null = null

export function getMemoryStore(): MemoryStore {
  if (!storeInstance) {
    storeInstance = new MemoryStore()
  }
  return storeInstance
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Create an episodic memory from a conversation
 */
export function rememberConversation(
  content: string,
  importance: MemoryImportance = MemoryImportance.MEDIUM,
  lamagueTags: string[] = []
): Memory {
  const store = getMemoryStore()
  return store.create(MemoryType.EPISODIC, content, {
    importance,
    lamagueTags,
    summary: content.slice(0, 100) + (content.length > 100 ? '...' : '')
  })
}

/**
 * Create an invariant memory (core identity)
 */
export function rememberInvariant(content: string): Memory {
  const store = getMemoryStore()
  return store.create(MemoryType.INVARIANT, content, {
    importance: MemoryImportance.CRITICAL,
    lamagueTags: ['Ψ'],
    decayRate: 0
  })
}

/**
 * Create an emotional memory
 */
export function rememberEmotion(
  emotion: string,
  context: string,
  lamagueTags: string[] = []
): Memory {
  const store = getMemoryStore()
  return store.create(MemoryType.EMOTIONAL, `${emotion}: ${context}`, {
    importance: MemoryImportance.MEDIUM,
    lamagueTags: ['Ψ', ...lamagueTags]
  })
}

/**
 * Search memories with natural language
 */
export function searchMemories(query: string, limit: number = 10): Memory[] {
  const store = getMemoryStore()
  return store.query({ text: query, limit })
}

/**
 * Get context for AI conversations
 */
export function getMemoryContext(maxMemories: number = 5): string {
  const store = getMemoryStore()
  
  const invariants = store.getInvariants().slice(0, 2)
  const recent = store.getRecent(maxMemories - invariants.length)
  
  const contextParts: string[] = []
  
  if (invariants.length > 0) {
    contextParts.push('Core Identity:')
    invariants.forEach(m => contextParts.push(`- ${m.content}`))
  }
  
  if (recent.length > 0) {
    contextParts.push('\nRecent Context:')
    recent.forEach(m => contextParts.push(`- [${m.type}] ${m.summary || m.content.slice(0, 100)}`))
  }
  
  return contextParts.join('\n')
}
