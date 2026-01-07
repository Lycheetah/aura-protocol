/**
 * CASCADE LIVING OS - LLM MODULE
 * ==============================
 * 
 * Unified AI backbone with:
 * - Multi-provider support (Claude, Gemini, Local, Mock)
 * - Autonomous agents (background intelligence)
 * - Living memory system (persistent, evolving)
 * 
 * The nervous system of the Living OS.
 */

// Provider exports
export {
  // Enums
  LLMProvider,
  AnthropicModel,
  GeminiModel,
  
  // Types
  type LLMConfig,
  type LLMMessage,
  type LLMResponse,
  type AURAConstraints,
  
  // Client
  CASCADELLMClient,
  getLLMClient,
  createLLMHook
} from './provider'

// Agent exports
export {
  // Enums
  AgentType,
  AgentPriority,
  EventType,
  
  // Types
  type AgentEvent,
  type AgentAction,
  type AgentState,
  
  // Manager
  AgentManager,
  getAgentManager
} from './agents'

// Memory exports
export {
  // Enums
  MemoryType,
  MemoryImportance,
  
  // Types
  type Memory,
  type MemoryQuery,
  type MemoryConsolidation,
  type MemoryStats,
  
  // Store
  getMemoryStore,
  
  // Helpers
  rememberConversation,
  rememberInvariant,
  rememberEmotion,
  searchMemories,
  getMemoryContext
} from './memory'

// ============================================================================
// UNIFIED INITIALIZATION
// ============================================================================

import { getLLMClient } from './provider'
import { getAgentManager } from './agents'
import { getMemoryStore } from './memory'

export interface CASCADELLMConfig {
  anthropicApiKey?: string
  geminiApiKey?: string
  localModelUrl?: string
  localModelName?: string
  enableAgents?: boolean
  primaryProvider?: 'anthropic' | 'gemini' | 'local' | 'mock'
}

/**
 * Initialize the entire LLM subsystem
 */
export function initializeCASCADELLM(config: CASCADELLMConfig = {}): {
  llm: ReturnType<typeof getLLMClient>
  agents: ReturnType<typeof getAgentManager>
  memory: ReturnType<typeof getMemoryStore>
} {
  const llm = getLLMClient()
  const agents = getAgentManager()
  const memory = getMemoryStore()
  
  // Configure providers
  if (config.anthropicApiKey) {
    llm.configureAnthropic(config.anthropicApiKey)
  }
  
  if (config.geminiApiKey) {
    llm.configureGemini(config.geminiApiKey)
  }
  
  if (config.localModelUrl) {
    llm.configureLocal(config.localModelName || 'llama2', config.localModelUrl)
  }
  
  // Set primary provider
  if (config.primaryProvider) {
    const providerMap = {
      anthropic: 'ANTHROPIC',
      gemini: 'GEMINI',
      local: 'LOCAL',
      mock: 'MOCK'
    } as const
    llm.setPrimaryProvider(providerMap[config.primaryProvider] as any)
  }
  
  // Start agents if enabled
  if (config.enableAgents !== false) {
    agents.startAll()
  }
  
  // Apply memory decay on init
  memory.applyDecay()
  
  return { llm, agents, memory }
}

/**
 * Shutdown the LLM subsystem
 */
export function shutdownCASCADELLM(): void {
  const agents = getAgentManager()
  agents.stopAll()
}
