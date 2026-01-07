'use client'

import { useState, useEffect } from 'react'

// ============================================================================
// TYPES
// ============================================================================

interface DailyMetric {
  date: string
  microorcims: number
  focusMinutes: number
  journalEntries: number
  sovereignty: number
  drift: number
}

interface PhaseMetric {
  phase: number
  glyph: string
  name: string
  microorcims: number
  avgSovereignty: number
  focusHours: number
  entries: number
}

interface InsightCard {
  id: string
  type: 'positive' | 'warning' | 'neutral' | 'insight'
  title: string
  message: string
  lamague?: string
  metric?: string
}

// ============================================================================
// MOCK DATA (Would come from aggregated stores in real implementation)
// ============================================================================

const generateMockDailyData = (): DailyMetric[] => {
  const data: DailyMetric[] = []
  const today = new Date()
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    
    data.push({
      date: date.toISOString().split('T')[0],
      microorcims: Math.floor(Math.random() * 8) + 1,
      focusMinutes: Math.floor(Math.random() * 180) + 30,
      journalEntries: Math.random() > 0.3 ? 1 : 0,
      sovereignty: 0.7 + Math.random() * 0.25,
      drift: Math.random() * 0.3
    })
  }
  
  return data
}

const MOCK_PHASE_METRICS: PhaseMetric[] = [
  { phase: 0, glyph: '⟟', name: 'Center', microorcims: 45, avgSovereignty: 0.82, focusHours: 32, entries: 12 },
  { phase: 1, glyph: '≋', name: 'Flow', microorcims: 38, avgSovereignty: 0.78, focusHours: 28, entries: 10 },
  { phase: 2, glyph: 'Ψ', name: 'Insight', microorcims: 52, avgSovereignty: 0.85, focusHours: 40, entries: 15 },
  { phase: 3, glyph: 'Φ↑', name: 'Rise', microorcims: 61, avgSovereignty: 0.88, focusHours: 45, entries: 14 },
  { phase: 4, glyph: '✧', name: 'Light', microorcims: 48, avgSovereignty: 0.84, focusHours: 35, entries: 11 },
  { phase: 5, glyph: '∥◁▷∥', name: 'Integrity', microorcims: 42, avgSovereignty: 0.80, focusHours: 30, entries: 9 },
  { phase: 6, glyph: '⟲', name: 'Return', microorcims: 35, avgSovereignty: 0.76, focusHours: 25, entries: 8 },
]

const MOCK_INSIGHTS: InsightCard[] = [
  {
    id: '1',
    type: 'positive',
    title: 'Strong Week',
    message: 'Your microorcim count is 23% higher than last week. Intent is winning.',
    lamague: 'Φ↑→✧',
    metric: '+23%'
  },
  {
    id: '2',
    type: 'warning',
    title: 'Drift Increasing',
    message: 'Your average drift has increased over the past 3 days. Consider centering.',
    lamague: '⟟←',
    metric: '+0.08'
  },
  {
    id: '3',
    type: 'insight',
    title: 'Phase Pattern',
    message: 'You tend to fire more microorcims during Rise (Φ↑) phase. Leverage this.',
    lamague: 'Φ↑⊗μ'
  },
  {
    id: '4',
    type: 'neutral',
    title: 'Journal Consistency',
    message: 'You\'ve journaled 5 of the last 7 days. Maintain this rhythm.',
    lamague: '≋◆◆◆',
    metric: '71%'
  }
]

// ============================================================================
// CHART COMPONENTS
// ============================================================================

function MiniBarChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data, 1)
  
  return (
    <div className="flex items-end gap-0.5 h-16">
      {data.map((value, i) => (
        <div
          key={i}
          className={`flex-1 ${color} rounded-t transition-all hover:opacity-80`}
          style={{ height: `${(value / max) * 100}%`, minHeight: value > 0 ? '2px' : '0' }}
          title={`${value}`}
        />
      ))}
    </div>
  )
}

function LineChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data, 1)
  const min = Math.min(...data, 0)
  const range = max - min || 1
  
  const points = data.map((value, i) => {
    const x = (i / (data.length - 1)) * 100
    const y = 100 - ((value - min) / range) * 100
    return `${x},${y}`
  }).join(' ')
  
  return (
    <svg className="w-full h-16" preserveAspectRatio="none" viewBox="0 0 100 100">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points={`0,100 ${points} 100,100`}
        fill={`${color}20`}
        stroke="none"
      />
    </svg>
  )
}

function CircularProgress({ value, max, color, label }: { value: number; max: number; color: string; label: string }) {
  const percentage = (value / max) * 100
  const circumference = 2 * Math.PI * 40
  const offset = circumference - (percentage / 100) * circumference
  
  return (
    <div className="relative w-24 h-24">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="48"
          cy="48"
          r="40"
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          className="text-zinc-800"
        />
        <circle
          cx="48"
          cy="48"
          r="40"
          stroke={color}
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold text-zinc-200">{Math.round(percentage)}%</span>
        <span className="text-xs text-zinc-500">{label}</span>
      </div>
    </div>
  )
}

// ============================================================================
// INSIGHT CARD COMPONENT
// ============================================================================

function InsightCardComponent({ insight }: { insight: InsightCard }) {
  const typeStyles = {
    positive: 'border-emerald-500/30 bg-emerald-500/5',
    warning: 'border-amber-500/30 bg-amber-500/5',
    neutral: 'border-zinc-600 bg-zinc-800/50',
    insight: 'border-purple-500/30 bg-purple-500/5'
  }
  
  const typeIcons = {
    positive: '📈',
    warning: '⚠️',
    neutral: '📊',
    insight: '💡'
  }
  
  return (
    <div className={`p-4 rounded-lg border ${typeStyles[insight.type]}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{typeIcons[insight.type]}</span>
          <h4 className="font-medium text-zinc-200">{insight.title}</h4>
        </div>
        {insight.metric && (
          <span className={`text-sm font-mono ${
            insight.type === 'positive' ? 'text-emerald-400' :
            insight.type === 'warning' ? 'text-amber-400' :
            'text-zinc-400'
          }`}>
            {insight.metric}
          </span>
        )}
      </div>
      <p className="text-sm text-zinc-400">{insight.message}</p>
      {insight.lamague && (
        <p className="text-xs font-mono text-purple-400 mt-2">{insight.lamague}</p>
      )}
    </div>
  )
}

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function InsightsPage() {
  const [dailyData, setDailyData] = useState<DailyMetric[]>([])
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')
  
  useEffect(() => {
    setDailyData(generateMockDailyData())
  }, [])
  
  // Calculate aggregates
  const totalMicroorcims = dailyData.reduce((sum, d) => sum + d.microorcims, 0)
  const totalFocusHours = Math.round(dailyData.reduce((sum, d) => sum + d.focusMinutes, 0) / 60)
  const avgSovereignty = dailyData.length > 0 
    ? dailyData.reduce((sum, d) => sum + d.sovereignty, 0) / dailyData.length 
    : 0
  const journalDays = dailyData.filter(d => d.journalEntries > 0).length
  const journalRate = dailyData.length > 0 ? (journalDays / dailyData.length) * 100 : 0
  
  // Get last 7/30/90 days based on range
  const rangeMap = { '7d': 7, '30d': 30, '90d': 90 }
  const filteredData = dailyData.slice(-rangeMap[timeRange])
  
  return (
    <div className="p-8">
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-zinc-100 mb-2">Insights</h1>
            <p className="text-zinc-500">Analytics and patterns from your CASCADE journey</p>
          </div>
          
          {/* Time Range Selector */}
          <div className="flex items-center gap-2">
            {(['7d', '30d', '90d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  timeRange === range
                    ? 'bg-cyan-500/20 text-cyan-400'
                    : 'bg-zinc-800 text-zinc-500 hover:bg-zinc-700'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </header>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="cascade-card p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-zinc-500 text-sm">Microorcims</span>
            <span className="text-2xl">⚡</span>
          </div>
          <p className="text-3xl font-bold text-cyan-400">{totalMicroorcims}</p>
          <MiniBarChart 
            data={filteredData.map(d => d.microorcims)} 
            color="bg-cyan-500" 
          />
        </div>
        
        <div className="cascade-card p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-zinc-500 text-sm">Focus Hours</span>
            <span className="text-2xl">🎯</span>
          </div>
          <p className="text-3xl font-bold text-purple-400">{totalFocusHours}h</p>
          <MiniBarChart 
            data={filteredData.map(d => d.focusMinutes)} 
            color="bg-purple-500" 
          />
        </div>
        
        <div className="cascade-card p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-zinc-500 text-sm">Avg Sovereignty</span>
            <span className="text-2xl">🛡️</span>
          </div>
          <p className="text-3xl font-bold text-emerald-400">{(avgSovereignty * 100).toFixed(0)}%</p>
          <LineChart 
            data={filteredData.map(d => d.sovereignty * 100)} 
            color="#10b981" 
          />
        </div>
        
        <div className="cascade-card p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-zinc-500 text-sm">Journal Rate</span>
            <span className="text-2xl">📓</span>
          </div>
          <p className="text-3xl font-bold text-amber-400">{journalRate.toFixed(0)}%</p>
          <MiniBarChart 
            data={filteredData.map(d => d.journalEntries)} 
            color="bg-amber-500" 
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Sovereignty & Drift Over Time */}
          <div className="cascade-card p-6">
            <h3 className="text-lg font-medium text-zinc-200 mb-4">Sovereignty vs Drift</h3>
            <div className="h-48 relative">
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                {/* Sovereignty line */}
                <polyline
                  points={filteredData.map((d, i) => {
                    const x = (i / (filteredData.length - 1)) * 100
                    const y = 100 - d.sovereignty * 100
                    return `${x},${y}`
                  }).join(' ')}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                />
                {/* Drift line */}
                <polyline
                  points={filteredData.map((d, i) => {
                    const x = (i / (filteredData.length - 1)) * 100
                    const y = 100 - d.drift * 100
                    return `${x},${y}`
                  }).join(' ')}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2"
                  strokeDasharray="4,4"
                />
                {/* Threshold line at 70% */}
                <line x1="0" y1="30" x2="100" y2="30" stroke="#52525b" strokeWidth="1" strokeDasharray="2,2" />
              </svg>
              <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-zinc-600">
                <span>{filteredData[0]?.date}</span>
                <span>{filteredData[filteredData.length - 1]?.date}</span>
              </div>
            </div>
            <div className="flex items-center justify-center gap-6 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-500 rounded" />
                <span className="text-zinc-400">Sovereignty</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-amber-500" style={{ borderStyle: 'dashed' }} />
                <span className="text-zinc-400">Drift</span>
              </div>
            </div>
          </div>
          
          {/* Phase Performance */}
          <div className="cascade-card p-6">
            <h3 className="text-lg font-medium text-zinc-200 mb-4">Performance by Phase</h3>
            <div className="space-y-3">
              {MOCK_PHASE_METRICS.map((phase) => (
                <div key={phase.phase} className="flex items-center gap-4">
                  <span className="w-8 text-xl text-center">{phase.glyph}</span>
                  <span className="w-20 text-sm text-zinc-400">{phase.name}</span>
                  <div className="flex-1 flex items-center gap-2">
                    <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
                        style={{ width: `${(phase.microorcims / 70) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-zinc-500 w-12 text-right">{phase.microorcims} μ</span>
                  </div>
                  <span className={`text-xs w-12 text-right ${
                    phase.avgSovereignty >= 0.85 ? 'text-emerald-400' :
                    phase.avgSovereignty >= 0.75 ? 'text-cyan-400' :
                    'text-amber-400'
                  }`}>
                    {(phase.avgSovereignty * 100).toFixed(0)}% S
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Right Column - Insights */}
        <div className="space-y-6">
          {/* AI Insights */}
          <div className="cascade-card p-6">
            <h3 className="text-lg font-medium text-zinc-200 mb-4">AI Insights</h3>
            <div className="space-y-3">
              {MOCK_INSIGHTS.map(insight => (
                <InsightCardComponent key={insight.id} insight={insight} />
              ))}
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="cascade-card p-6">
            <h3 className="text-lg font-medium text-zinc-200 mb-4">Progress Indicators</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <CircularProgress 
                value={totalMicroorcims} 
                max={100} 
                color="#06b6d4" 
                label="μ Goal" 
              />
              <CircularProgress 
                value={totalFocusHours} 
                max={50} 
                color="#a855f7" 
                label="Focus Goal" 
              />
              <CircularProgress 
                value={journalRate} 
                max={100} 
                color="#f59e0b" 
                label="Journal" 
              />
            </div>
          </div>
          
          {/* Current Phase */}
          <div className="cascade-card p-6 bg-gradient-to-br from-cyan-500/10 to-purple-500/10">
            <div className="text-center">
              <p className="text-xs text-zinc-500 mb-2">Current Phase</p>
              <p className="text-4xl mb-2">✧</p>
              <p className="text-lg font-medium text-zinc-200">Light</p>
              <p className="text-sm text-zinc-500">Day 23 of 52</p>
              <div className="mt-4 h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
                  style={{ width: '44%' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
