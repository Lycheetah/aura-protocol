// CASCADE Living OS - Unified AI Hook
// Client-side hook for interacting with multiple AI providers

import { useState, useCallback, useEffect } from 'react'

interface AnalysisContext {
  mood?: number
  energy?: number
  recentPatterns?: string[]
  sovereigntyScore?: number
  currentPhase?: string
}

interface Pattern {
  type: 'RECURRING_THEME' | 'COGNITIVE_DISTORTION' | 'INSIGHT' | 'QUESTION' | 'GROWTH'
  content: string
  significance: 'low' | 'medium' | 'high'
}

interface ShadowMaterial {
  content: string
  projection?: string
  integration?: string
}

interface PyramidSuggestion {
  content: string
  suggestedLayer: 'FOUNDATION' | 'THEORY' | 'EDGE'
  evidenceStrength: number
  reasoning: string
}

interface JournalAnalysis {
  patterns: Pattern[]
  shadowMaterial: ShadowMaterial[]
  pyramidSuggestions: PyramidSuggestion[]
  sovereigntyInsight: string
  lamagueMood: {
    symbols: string[]
    interpretation: string
  }
  followUpQuestions: string[]
}

type AIProvider = 'anthropic' | 'gemini' | 'local' | 'mock'

interface UseCascadeAIReturn {
  // Journal analysis
  analyzeJournal: (content: string, context?: AnalysisContext) => Promise<JournalAnalysis | null>
  
  // Chat
  chat: (message: string, context?: AnalysisContext) => Promise<string>
  
  // Oracle
  consultOracle: (query: string, context?: AnalysisContext) => Promise<string>
  
  // Provider management
  provider: AIProvider
  setProvider: (provider: AIProvider) => void
  availableProviders: AIProvider[]
  
  // State
  isLoading: boolean
  error: string | null
  lastResponse: string | null
}

export function useCascadeAI(): UseCascadeAIReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastResponse, setLastResponse] = useState<string | null>(null)
  const [provider, setProvider] = useState<AIProvider>('mock')
  const [availableProviders, setAvailableProviders] = useState<AIProvider[]>(['mock'])

  // Check available providers on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const config = localStorage.getItem('cascade-llm-config')
      if (config) {
        const parsed = JSON.parse(config)
        const available: AIProvider[] = ['mock']
        
        if (parsed.anthropicKey) available.push('anthropic')
        if (parsed.geminiKey) available.push('gemini')
        if (parsed.localUrl) available.push('local')
        
        setAvailableProviders(available)
        
        // Set default provider
        if (parsed.primaryProvider && available.includes(parsed.primaryProvider)) {
          setProvider(parsed.primaryProvider)
        }
      }
    }
  }, [])

  const callAPI = useCallback(async (
    messages: { role: 'user' | 'assistant' | 'system'; content: string }[],
    context?: AnalysisContext
  ) => {
    setIsLoading(true)
    setError(null)

    try {
      // Get API keys from localStorage
      let anthropicKey = ''
      let geminiKey = ''
      let localUrl = 'http://localhost:11434'
      
      if (typeof window !== 'undefined') {
        const config = localStorage.getItem('cascade-llm-config')
        if (config) {
          const parsed = JSON.parse(config)
          anthropicKey = parsed.anthropicKey || ''
          geminiKey = parsed.geminiKey || ''
          localUrl = parsed.localUrl || 'http://localhost:11434'
        }
      }

      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages,
          provider,
          anthropicKey,
          geminiKey,
          localUrl,
          maxTokens: 4096,
          temperature: 0.7
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'API request failed')
      }

      setLastResponse(data.content)
      return data.content

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [provider])

  const analyzeJournal = useCallback(async (
    content: string,
    context?: AnalysisContext
  ): Promise<JournalAnalysis | null> => {
    try {
      const systemPrompt = `Analyze this journal entry and return a JSON object with:
- patterns: array of {type, content, significance}
- shadowMaterial: array of {content, projection, integration}
- pyramidSuggestions: array of {content, suggestedLayer, evidenceStrength, reasoning}
- sovereigntyInsight: string insight about their autonomy
- lamagueMood: {symbols: string[], interpretation: string}
- followUpQuestions: string[]

Respond ONLY with valid JSON.`

      const response = await callAPI([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Journal entry:\n\n${content}\n\nContext: ${JSON.stringify(context || {})}` }
      ], context)
      
      try {
        // Try to parse JSON response
        const cleaned = response.replace(/```json\n?|\n?```/g, '').trim()
        return JSON.parse(cleaned)
      } catch {
        // Fall back to partial analysis
        return fallbackJournalAnalysis(content) as JournalAnalysis
      }
    } catch {
      return fallbackJournalAnalysis(content) as JournalAnalysis
    }
  }, [callAPI])

  const chat = useCallback(async (
    message: string,
    context?: AnalysisContext
  ): Promise<string> => {
    try {
      return await callAPI([
        { role: 'user', content: message }
      ], context)
    } catch {
      return 'I encountered an error. Please check your API configuration in Settings.'
    }
  }, [callAPI])

  const consultOracle = useCallback(async (
    query: string,
    context?: AnalysisContext
  ): Promise<string> => {
    try {
      const oraclePrompt = `You are the CASCADE Oracle - a wise guide that speaks in LAMAGUE symbols.
Current context: ${JSON.stringify(context || {})}

Respond to this query with wisdom, using LAMAGUE glyphs where appropriate:
⟟ = Center, ≋ = Flow, Ψ = Insight, Φ↑ = Rise, ✧ = Light, ∥◁▷∥ = Integrity, ⟲ = Return

Query: ${query}`

      return await callAPI([
        { role: 'user', content: oraclePrompt }
      ], context)
    } catch {
      return 'The Oracle is unavailable. Please check your API configuration in Settings. ⟟'
    }
  }, [callAPI])

  return {
    analyzeJournal,
    chat,
    consultOracle,
    provider,
    setProvider,
    availableProviders,
    isLoading,
    error,
    lastResponse
  }
}

// Fallback analysis when API is not available
export function fallbackJournalAnalysis(text: string): Partial<JournalAnalysis> {
  const patterns: Pattern[] = []
  const shadowMaterial: ShadowMaterial[] = []
  const pyramidSuggestions: PyramidSuggestion[] = []
  
  // Simple keyword detection
  const keywords = {
    anxiety: ['anxious', 'worried', 'nervous', 'fear', 'panic', 'stress'],
    growth: ['learning', 'growing', 'improving', 'better', 'progress', 'realized'],
    shadow: ['anger', 'jealous', 'envy', 'hate', 'resentment', 'shame', 'guilt'],
    insight: ['understand', 'clarity', 'discovered', 'insight', 'aware'],
    question: ['why', 'how', 'wonder', 'curious', 'what if']
  }

  const lowerText = text.toLowerCase()

  for (const [theme, words] of Object.entries(keywords)) {
    const matches = words.filter(w => lowerText.includes(w))
    if (matches.length > 0) {
      patterns.push({
        type: theme === 'insight' ? 'INSIGHT' : 
              theme === 'question' ? 'QUESTION' :
              theme === 'growth' ? 'GROWTH' :
              theme === 'shadow' ? 'COGNITIVE_DISTORTION' : 'RECURRING_THEME',
        content: `${theme}: detected keywords (${matches.join(', ')})`,
        significance: matches.length > 2 ? 'high' : matches.length > 1 ? 'medium' : 'low'
      })
    }
  }

  // Shadow triggers
  const shadowTriggers = ['should', 'must', 'never', 'always', "can't", 'hate', 'blame']
  for (const trigger of shadowTriggers) {
    if (lowerText.includes(trigger)) {
      const sentences = text.split(/[.!?]+/)
      const shadowSentence = sentences.find(s => s.toLowerCase().includes(trigger))
      if (shadowSentence) {
        shadowMaterial.push({
          content: shadowSentence.trim(),
          projection: `Possible projection around "${trigger}"`,
          integration: 'Consider: What part of yourself are you resisting?'
        })
      }
    }
  }

  // Belief extraction
  const beliefPatterns = text.match(/I (believe|think|know|feel)[^.!?]+/gi) || []
  for (const belief of beliefPatterns.slice(0, 3)) {
    pyramidSuggestions.push({
      content: belief,
      suggestedLayer: 'EDGE',
      evidenceStrength: 0.3,
      reasoning: 'Personal belief - needs validation'
    })
  }

  return {
    patterns,
    shadowMaterial,
    pyramidSuggestions,
    sovereigntyInsight: patterns.length > 0 
      ? 'Your entry shows active self-reflection - this is sovereignty in action.'
      : 'Keep exploring your thoughts. Every entry builds self-awareness.',
    lamagueMood: {
      symbols: shadowMaterial.length > 0 ? ['Ψ', '∇cas'] : ['Ao', 'Φ↑'],
      interpretation: shadowMaterial.length > 0 
        ? 'Integration work emerging' 
        : 'Grounded and ascending'
    },
    followUpQuestions: [
      'What felt most true as you wrote this?',
      'What are you avoiding looking at?'
    ]
  }
}
