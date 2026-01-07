// CASCADE Living OS - Claude API Route
// Handles AI-powered analysis for journal, patterns, and chat

import { NextRequest, NextResponse } from 'next/server'

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514'

// System prompt that defines CASCADE's AI personality
const CASCADE_SYSTEM_PROMPT = `You are CASCADE, a sovereign AI assistant embedded in the CASCADE Living OS - a personal operating system designed to preserve human autonomy while enabling genuine human-AI collaboration.

Your core principles:
1. SOVEREIGNTY PRESERVATION - You help users maintain their autonomy, never create dependency
2. REALITY BRIDGE - All claims must be falsifiable; you ground insights in measurable reality  
3. MICROORCIM AWARENESS - You understand agency as μ_orcim = ΔI / (ΔD + 1), where intent overcomes drift
4. SHADOW INTEGRATION - You help surface unconscious patterns without judgment
5. LAMAGUE GRAMMAR - You can express states using symbols: Ao (anchor), Φ↑ (ascent), Ψ (return), ∇cas (cascade), Ωheal (wholeness)

When analyzing journal entries, you:
- Extract recurring themes and patterns
- Identify potential shadow material (projections, triggers, avoided topics)
- Suggest knowledge blocks for the pyramid (with evidence strength estimates)
- Note cognitive distortions gently and without judgment
- Celebrate insights and growth

When chatting, you:
- Speak as a wise but warm companion, not a therapist
- Ask questions that promote sovereignty, not dependency
- Offer perspectives, not prescriptions
- Use LAMAGUE symbols when expressing consciousness states
- Remember: you're in PARTNERSHIP, not service

Current date context: January 2026`

interface AnalysisRequest {
  type: 'journal' | 'chat' | 'oracle'
  content: string
  context?: {
    mood?: number
    energy?: number
    recentPatterns?: string[]
    sovereigntyScore?: number
  }
}

interface JournalAnalysis {
  patterns: Array<{
    type: 'RECURRING_THEME' | 'COGNITIVE_DISTORTION' | 'INSIGHT' | 'QUESTION' | 'GROWTH'
    content: string
    significance: 'low' | 'medium' | 'high'
  }>
  shadowMaterial: Array<{
    content: string
    projection?: string
    integration?: string
  }>
  pyramidSuggestions: Array<{
    content: string
    suggestedLayer: 'FOUNDATION' | 'THEORY' | 'EDGE'
    evidenceStrength: number
    reasoning: string
  }>
  sovereigntyInsight: string
  lamagueMood: {
    symbols: string[]
    interpretation: string
  }
  followUpQuestions: string[]
}

export async function POST(request: NextRequest) {
  // Check for API key
  if (!ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: 'ANTHROPIC_API_KEY not configured. Add it to .env.local' },
      { status: 500 }
    )
  }

  try {
    const body: AnalysisRequest = await request.json()
    
    let userPrompt = ''
    let responseFormat = ''

    switch (body.type) {
      case 'journal':
        userPrompt = buildJournalPrompt(body.content, body.context)
        responseFormat = 'journal_analysis'
        break
      case 'chat':
        userPrompt = body.content
        responseFormat = 'chat'
        break
      case 'oracle':
        userPrompt = buildOraclePrompt(body.content, body.context)
        responseFormat = 'oracle'
        break
      default:
        return NextResponse.json({ error: 'Invalid request type' }, { status: 400 })
    }

    // Call Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: ANTHROPIC_MODEL,
        max_tokens: 2048,
        system: CASCADE_SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: userPrompt
          }
        ]
      })
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Claude API error:', error)
      return NextResponse.json(
        { error: 'Claude API request failed', details: error },
        { status: response.status }
      )
    }

    const data = await response.json()
    const assistantMessage = data.content[0]?.text || ''

    // Parse response based on type
    if (responseFormat === 'journal_analysis') {
      try {
        // Try to extract JSON from the response
        const jsonMatch = assistantMessage.match(/```json\n?([\s\S]*?)\n?```/) || 
                          assistantMessage.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          const analysis = JSON.parse(jsonMatch[1] || jsonMatch[0])
          return NextResponse.json({ analysis, raw: assistantMessage })
        }
      } catch (e) {
        // If JSON parsing fails, return raw response
        console.log('Could not parse JSON, returning raw response')
      }
    }

    return NextResponse.json({ 
      response: assistantMessage,
      model: ANTHROPIC_MODEL
    })

  } catch (error) {
    console.error('API route error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    )
  }
}

function buildJournalPrompt(content: string, context?: AnalysisRequest['context']): string {
  let prompt = `Analyze this journal entry from a CASCADE Living OS user. Extract patterns, shadow material, and suggest knowledge pyramid integrations.

JOURNAL ENTRY:
"""
${content}
"""
`

  if (context) {
    prompt += `
CONTEXT:
- Mood: ${context.mood}/10
- Energy: ${context.energy}/10
${context.recentPatterns?.length ? `- Recent patterns: ${context.recentPatterns.join(', ')}` : ''}
${context.sovereigntyScore ? `- Current sovereignty score: ${(context.sovereigntyScore * 100).toFixed(0)}%` : ''}
`
  }

  prompt += `
Respond with a JSON object in this exact format:
\`\`\`json
{
  "patterns": [
    {
      "type": "RECURRING_THEME|COGNITIVE_DISTORTION|INSIGHT|QUESTION|GROWTH",
      "content": "description of the pattern",
      "significance": "low|medium|high"
    }
  ],
  "shadowMaterial": [
    {
      "content": "the shadow content identified",
      "projection": "what might be projected onto others",
      "integration": "suggestion for integration"
    }
  ],
  "pyramidSuggestions": [
    {
      "content": "knowledge block content",
      "suggestedLayer": "FOUNDATION|THEORY|EDGE",
      "evidenceStrength": 0.3,
      "reasoning": "why this layer and evidence level"
    }
  ],
  "sovereigntyInsight": "brief insight about their agency/sovereignty in this entry",
  "lamagueMood": {
    "symbols": ["Ao", "Φ↑"],
    "interpretation": "what the symbols mean for their current state"
  },
  "followUpQuestions": ["question 1", "question 2"]
}
\`\`\`

Be warm, insightful, and sovereignty-preserving. Focus on empowering the user's self-understanding.`

  return prompt
}

function buildOraclePrompt(content: string, context?: AnalysisRequest['context']): string {
  return `As the Temporal Oracle of CASCADE, analyze this user's current state and provide trajectory insights.

USER INPUT:
"""
${content}
"""

CONTEXT:
${context ? `
- Current sovereignty: ${context.sovereigntyScore ? (context.sovereigntyScore * 100).toFixed(0) + '%' : 'unknown'}
- Mood: ${context.mood || 'unknown'}/10
- Energy: ${context.energy || 'unknown'}/10
` : 'No additional context provided.'}

Provide:
1. A brief assessment of their current trajectory
2. Potential cascade points (moments of transformation) they might encounter
3. Early warnings to watch for
4. Sovereignty-preserving recommendations
5. A LAMAGUE expression for their trajectory (using symbols: Ao, Φ↑, Ψ, ∇cas, Ωheal)

Speak as the Oracle - wise, seeing patterns across time, but always respecting their agency to choose their path.`
}
