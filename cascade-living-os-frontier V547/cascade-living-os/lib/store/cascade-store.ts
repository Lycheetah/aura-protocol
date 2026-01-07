// CASCADE Living OS - Zustand Store
// Central state management with persistence

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import {
  CASCADEState,
  KnowledgePyramidState,
  PartnershipState,
  RealityBridgeState,
  TrajectoryPrediction,
  JournalEntry,
  Pattern,
  AURAMetrics,
  KnowledgeBlock,
  PyramidLayer,
  PracticePrediction
} from '@/types/cascade'

import {
  initializePartnership,
  recordSovereignDecision,
  calculateMicroorcim
} from '@/lib/cascade/sovereignty'

import {
  initializePyramid,
  addKnowledge,
  promoteBlock,
  demoteBlock,
  executeCascade
} from '@/lib/cascade/pyramid'

import {
  initializeRealityBridge,
  createPrediction,
  addAnchor,
  recordMeasurement,
  evaluateAll
} from '@/lib/cascade/reality-bridge'

// ============================================================================
// INITIAL STATE
// ============================================================================

const createInitialState = (): CASCADEState => ({
  pyramid: initializePyramid('personal'),
  sovereignty: initializePartnership(),
  realityBridge: initializeRealityBridge(),
  oracle: null,
  journal: [],
  patterns: [],
  aura: {
    TES: 1.0,
    VTR: 1.0,
    PAI: 1.0,
    valid: true,
    warnings: []
  },
  userId: generateUserId(),
  lastSync: Date.now(),
  version: '1.0.0'
})

// ============================================================================
// STORE INTERFACE
// ============================================================================

interface CASCADEStore extends CASCADEState {
  // Initialization
  initialize: () => void
  reset: () => void
  
  // Sovereignty actions
  recordDecision: (decision: {
    agent: 'human' | 'ai'
    intentStrength: number
    driftResistance: number
    coherenceImpact: number
  }) => void
  updateMutualCoherence: (coherence: number) => void
  
  // Pyramid actions
  addKnowledgeBlock: (block: Omit<KnowledgeBlock, 'id' | 'createdAt' | 'updatedAt' | 'active' | 'compressionScore'>) => void
  promoteKnowledge: (blockId: string, newEvidence: number) => void
  demoteKnowledge: (blockId: string, reason: string) => void
  triggerManualCascade: (triggerId: string) => void
  
  // Reality Bridge actions
  addPractice: (name: string, description: string, layer?: PyramidLayer) => void
  addPracticeAnchor: (practiceId: string, anchor: any) => void
  recordPracticeMeasurement: (practiceId: string, anchorId: string, value: number, notes?: string) => void
  evaluateAllPractices: () => void
  
  // Journal actions
  addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'timestamp'>) => void
  updatePatterns: (patterns: Pattern[]) => void
  
  // Oracle actions
  setOraclePrediction: (prediction: TrajectoryPrediction | null) => void
  
  // AURA actions
  updateAURA: (metrics: Partial<AURAMetrics>) => void
  
  // Export/Import
  exportState: () => string
  importState: (json: string) => void
  
  // Computed
  getCurrentMicroorcim: () => number
  getRecentCascades: (limit?: number) => any[]
  getDailyBrief: () => any
}

// ============================================================================
// STORE IMPLEMENTATION
// ============================================================================

export const useCASCADEStore = create<CASCADEStore>()(
  persist(
    immer((set, get) => ({
      // Initial state
      ...createInitialState(),
      
      // ========================================
      // INITIALIZATION
      // ========================================
      
      initialize: () => {
        const stored = localStorage.getItem('cascade-living-os')
        if (!stored) {
          set(createInitialState())
        }
      },
      
      reset: () => {
        set(createInitialState())
      },
      
      // ========================================
      // SOVEREIGNTY ACTIONS
      // ========================================
      
      recordDecision: (decision) => {
        set((state) => {
          state.sovereignty = recordSovereignDecision(state.sovereignty, decision)
          state.lastSync = Date.now()
        })
      },
      
      updateMutualCoherence: (coherence) => {
        set((state) => {
          state.sovereignty.mutualCoherence = Math.max(0, Math.min(1, coherence))
          state.lastSync = Date.now()
        })
      },
      
      // ========================================
      // PYRAMID ACTIONS
      // ========================================
      
      addKnowledgeBlock: (block) => {
        set((state) => {
          const { newState, event } = addKnowledge(state.pyramid, block)
          state.pyramid = newState
          state.lastSync = Date.now()
          
          // If cascade occurred, record as a sovereign decision
          if (event) {
            state.sovereignty = recordSovereignDecision(state.sovereignty, {
              agent: 'ai',
              intentStrength: 0.8,
              driftResistance: 0.7,
              coherenceImpact: event.coherenceAfter - event.coherenceBefore
            })
          }
        })
      },
      
      promoteKnowledge: (blockId, newEvidence) => {
        set((state) => {
          state.pyramid = promoteBlock(state.pyramid, blockId, newEvidence)
          state.lastSync = Date.now()
        })
      },
      
      demoteKnowledge: (blockId, reason) => {
        set((state) => {
          state.pyramid = demoteBlock(state.pyramid, blockId, reason)
          state.lastSync = Date.now()
        })
      },
      
      triggerManualCascade: (triggerId) => {
        set((state) => {
          const allBlocks = [
            ...state.pyramid.foundation,
            ...state.pyramid.theory,
            ...state.pyramid.edge
          ]
          const trigger = allBlocks.find(b => b.id === triggerId)
          
          if (trigger) {
            const { newState, event } = executeCascade(state.pyramid, trigger)
            state.pyramid = newState
            state.lastSync = Date.now()
          }
        })
      },
      
      // ========================================
      // REALITY BRIDGE ACTIONS
      // ========================================
      
      addPractice: (name, description, layer = 'EDGE') => {
        set((state) => {
          const prediction = createPrediction(name, description, layer)
          state.realityBridge.practices.push(prediction)
          state.lastSync = Date.now()
        })
      },
      
      addPracticeAnchor: (practiceId, anchor) => {
        set((state) => {
          const practiceIndex = state.realityBridge.practices.findIndex(
            p => p.id === practiceId
          )
          if (practiceIndex !== -1) {
            state.realityBridge.practices[practiceIndex] = addAnchor(
              state.realityBridge.practices[practiceIndex],
              anchor
            )
            state.lastSync = Date.now()
          }
        })
      },
      
      recordPracticeMeasurement: (practiceId, anchorId, value, notes) => {
        set((state) => {
          state.realityBridge = recordMeasurement(
            state.realityBridge,
            practiceId,
            anchorId,
            value,
            notes
          )
          state.lastSync = Date.now()
        })
      },
      
      evaluateAllPractices: () => {
        set((state) => {
          state.realityBridge = evaluateAll(state.realityBridge)
          state.lastSync = Date.now()
        })
      },
      
      // ========================================
      // JOURNAL ACTIONS
      // ========================================
      
      addJournalEntry: (entry) => {
        set((state) => {
          const newEntry: JournalEntry = {
            ...entry,
            id: generateId(),
            timestamp: Date.now()
          }
          state.journal.unshift(newEntry) // Newest first
          
          // Keep last 1000 entries
          if (state.journal.length > 1000) {
            state.journal = state.journal.slice(0, 1000)
          }
          
          state.lastSync = Date.now()
        })
      },
      
      updatePatterns: (patterns) => {
        set((state) => {
          state.patterns = patterns
          state.lastSync = Date.now()
        })
      },
      
      // ========================================
      // ORACLE ACTIONS
      // ========================================
      
      setOraclePrediction: (prediction) => {
        set((state) => {
          state.oracle = prediction
          state.lastSync = Date.now()
        })
      },
      
      // ========================================
      // AURA ACTIONS
      // ========================================
      
      updateAURA: (metrics) => {
        set((state) => {
          state.aura = { ...state.aura, ...metrics }
          
          // Validate AURA constraints
          const warnings: string[] = []
          if (state.aura.TES < 0.7) warnings.push('TES below threshold (0.70)')
          if (state.aura.VTR < 1.0) warnings.push('VTR below threshold (1.0)')
          if (state.aura.PAI < 0.8) warnings.push('PAI below threshold (0.80)')
          
          state.aura.warnings = warnings
          state.aura.valid = warnings.length === 0
          state.lastSync = Date.now()
        })
      },
      
      // ========================================
      // EXPORT/IMPORT
      // ========================================
      
      exportState: () => {
        const state = get()
        return JSON.stringify({
          pyramid: state.pyramid,
          sovereignty: state.sovereignty,
          realityBridge: state.realityBridge,
          oracle: state.oracle,
          journal: state.journal,
          patterns: state.patterns,
          aura: state.aura,
          userId: state.userId,
          version: state.version,
          exportedAt: Date.now()
        }, null, 2)
      },
      
      importState: (json) => {
        try {
          const imported = JSON.parse(json)
          set((state) => {
            if (imported.pyramid) state.pyramid = imported.pyramid
            if (imported.sovereignty) state.sovereignty = imported.sovereignty
            if (imported.realityBridge) state.realityBridge = imported.realityBridge
            if (imported.oracle) state.oracle = imported.oracle
            if (imported.journal) state.journal = imported.journal
            if (imported.patterns) state.patterns = imported.patterns
            if (imported.aura) state.aura = imported.aura
            state.lastSync = Date.now()
          })
        } catch (e) {
          console.error('Failed to import state:', e)
        }
      },
      
      // ========================================
      // COMPUTED VALUES
      // ========================================
      
      getCurrentMicroorcim: () => {
        const state = get()
        const history = state.sovereignty.humanSovereignty.willpower.history
        if (history.length < 2) return 0
        
        const latest = history[history.length - 1]
        const previous = history[history.length - 2]
        
        return latest.value - previous.value
      },
      
      getRecentCascades: (limit = 5) => {
        const state = get()
        return state.pyramid.cascadeHistory.slice(-limit).reverse()
      },
      
      getDailyBrief: () => {
        const state = get()
        const hour = new Date().getHours()
        
        let greeting = ''
        if (hour < 6) greeting = 'Deep in the night, sovereignty stirs...'
        else if (hour < 12) greeting = 'Good morning. A new day for sovereign choices.'
        else if (hour < 17) greeting = 'Good afternoon. How flows your agency?'
        else if (hour < 21) greeting = 'Good evening. Time to integrate the day.'
        else greeting = 'Night approaches. Let the patterns settle.'
        
        const sov = state.sovereignty.humanSovereignty.value
        let sovereigntyStatus = ''
        if (sov >= 0.9) sovereigntyStatus = 'Sovereignty strong. You are aligned.'
        else if (sov >= 0.7) sovereigntyStatus = 'Sovereignty stable. Minor drift detected.'
        else if (sov >= 0.5) sovereigntyStatus = 'Sovereignty wavering. Attention needed.'
        else sovereigntyStatus = 'Sovereignty critical. Intervention recommended.'
        
        return {
          greeting,
          sovereigntyStatus,
          currentMicroorcim: get().getCurrentMicroorcim(),
          topAlerts: state.sovereignty.alerts.slice(0, 3),
          recentCascades: get().getRecentCascades(3),
          recommendedActions: generateRecommendations(state),
          lamagueMood: {
            symbols: sov >= 0.7 ? ['Ao', 'Φ↑'] : ['Ψ', '∇cas'],
            interpretation: sov >= 0.7 ? 'Grounded and ascending' : 'Integration needed',
            intensity: sov
          }
        }
      }
    })),
    {
      name: 'cascade-living-os',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        pyramid: state.pyramid,
        sovereignty: state.sovereignty,
        realityBridge: state.realityBridge,
        oracle: state.oracle,
        journal: state.journal,
        patterns: state.patterns,
        aura: state.aura,
        userId: state.userId,
        version: state.version,
        lastSync: state.lastSync
      })
    }
  )
)

// ============================================================================
// UTILITIES
// ============================================================================

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

function generateUserId(): string {
  return `user-${Math.random().toString(36).substr(2, 16)}`
}

function generateRecommendations(state: CASCADEState): string[] {
  const recommendations: string[] = []
  
  // Based on sovereignty
  if (state.sovereignty.humanSovereignty.value < 0.7) {
    recommendations.push('Practice grounding: 5 minutes of intentional breath work')
  }
  
  // Based on drift
  if (state.sovereignty.humanSovereignty.drift.magnitude > 0.3) {
    recommendations.push('Review your core values. Are recent decisions aligned?')
  }
  
  // Based on alerts
  if (state.sovereignty.alerts.length > 0) {
    recommendations.push('Address sovereignty alerts in the Sovereignty panel')
  }
  
  // Based on journal patterns
  if (state.patterns.length > 3) {
    recommendations.push('Recurring patterns detected. Consider a Shadow Work session.')
  }
  
  // Based on pyramid
  if (state.pyramid.edge.length > state.pyramid.foundation.length * 5) {
    recommendations.push('Many edge hypotheses. Time to validate and promote?')
  }
  
  // Based on reality bridge
  const pendingPractices = state.realityBridge.practices.filter(p => p.status === 'PENDING')
  if (pendingPractices.length > 0) {
    recommendations.push(`${pendingPractices.length} practices awaiting measurement`)
  }
  
  return recommendations.slice(0, 5) // Max 5 recommendations
}
