'use client'

import { useState, useMemo } from 'react'
import {
  SOVEREIGN_CYCLE,
  CyclePhase,
  type SovereignPart,
  type SovereignProgress,
  initializeSovereignProgress,
  completePart,
  getSovereignPart,
  getPartsByCycle
} from '@/lib/cascade/sovereign-cycle'

// ============================================================================
// CYCLE PROGRESS RING
// ============================================================================

function CycleProgressRing({ progress }: { progress: SovereignProgress }) {
  const size = 200
  const strokeWidth = 12
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (progress.percentComplete / 100) * circumference
  
  return (
    <div className="relative">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgb(63, 63, 70)"
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#gradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgb(6, 182, 212)" />
            <stop offset="50%" stopColor="rgb(139, 92, 246)" />
            <stop offset="100%" stopColor="rgb(168, 85, 247)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-white">{progress.completedParts.length}</span>
        <span className="text-sm text-zinc-400">of 36</span>
      </div>
    </div>
  )
}

// ============================================================================
// PART CARD
// ============================================================================

function PartCard({ 
  part, 
  isCompleted, 
  isCurrent,
  onComplete 
}: { 
  part: SovereignPart
  isCompleted: boolean
  isCurrent: boolean
  onComplete: () => void
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  const cycleColors = {
    [CyclePhase.FOUNDATION]: 'border-cyan-500/30 bg-cyan-500/5',
    [CyclePhase.ARCHITECT]: 'border-purple-500/30 bg-purple-500/5',
    [CyclePhase.TRANSCENDENCE]: 'border-amber-500/30 bg-amber-500/5'
  }
  
  const cycleLabels = {
    [CyclePhase.FOUNDATION]: 'Foundation',
    [CyclePhase.ARCHITECT]: 'Architect',
    [CyclePhase.TRANSCENDENCE]: 'Transcendence'
  }
  
  return (
    <div 
      className={`cascade-card p-4 border ${cycleColors[part.cycle]} ${isCurrent ? 'ring-2 ring-cyan-500' : ''} transition-all`}
    >
      {/* Header */}
      <div 
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Completion indicator */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          isCompleted 
            ? 'bg-emerald-500/20 text-emerald-400' 
            : isCurrent 
              ? 'bg-cyan-500/20 text-cyan-400 animate-pulse'
              : 'bg-zinc-800 text-zinc-600'
        }`}>
          {isCompleted ? '✓' : part.number}
        </div>
        
        {/* Title */}
        <div className="flex-1">
          <h3 className={`font-medium ${isCompleted ? 'text-zinc-400' : 'text-zinc-200'}`}>
            {part.title}
          </h3>
          <p className="text-xs text-zinc-500">{cycleLabels[part.cycle]} • {part.sigil}</p>
        </div>
        
        {/* Expand icon */}
        <svg 
          className={`w-5 h-5 text-zinc-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      
      {/* Expanded content */}
      {isExpanded && (
        <div className="mt-4 space-y-4 animate-fade-in">
          {/* Mythic Layer */}
          <div className="p-3 bg-zinc-800/50 rounded-lg">
            <p className="text-xs text-purple-400 mb-1">Mythic Layer</p>
            <p className="text-sm text-zinc-300 italic">"{part.mythicLayer}"</p>
          </div>
          
          {/* Mathematical Spine */}
          <div className="p-3 bg-zinc-800/50 rounded-lg">
            <p className="text-xs text-cyan-400 mb-1">Mathematical Spine</p>
            <p className="text-sm text-zinc-300 font-mono">{part.mathematicalSpine}</p>
          </div>
          
          {/* Key Insight */}
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
            <p className="text-xs text-emerald-400 mb-1">Key Insight</p>
            <p className="text-sm text-zinc-300">{part.keyInsight}</p>
          </div>
          
          {/* Practical Protocol */}
          <div>
            <p className="text-xs text-zinc-500 mb-2">Practical Protocol</p>
            <ul className="space-y-1">
              {part.practicalProtocol.map((step, i) => (
                <li key={i} className="text-sm text-zinc-400 flex items-start gap-2">
                  <span className="text-cyan-400">{i + 1}.</span>
                  {step}
                </li>
              ))}
            </ul>
          </div>
          
          {/* Warning */}
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <p className="text-xs text-amber-400 mb-1">⚠️ Warning</p>
            <p className="text-sm text-zinc-400">{part.warning}</p>
          </div>
          
          {/* Complete Button */}
          {!isCompleted && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onComplete()
              }}
              className="w-full py-2 bg-cyan-500 hover:bg-cyan-400 text-zinc-900 font-medium rounded-lg transition-colors"
            >
              Mark as Complete
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// ============================================================================
// CYCLE SECTION
// ============================================================================

function CycleSection({ 
  cycle, 
  parts, 
  completedParts,
  currentPart,
  onComplete 
}: { 
  cycle: CyclePhase
  parts: SovereignPart[]
  completedParts: number[]
  currentPart: number
  onComplete: (partNumber: number) => void
}) {
  const cycleInfo = {
    [CyclePhase.FOUNDATION]: {
      title: 'Cycle One: Foundation',
      subtitle: 'Parts 1-21 • Building the base',
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10'
    },
    [CyclePhase.ARCHITECT]: {
      title: 'Cycle Two: Architect',
      subtitle: 'Parts 22-30 • Deep layer mastery',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10'
    },
    [CyclePhase.TRANSCENDENCE]: {
      title: 'Cycle Three: Transcendence',
      subtitle: 'Parts 31-36 • Integration & completion',
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10'
    }
  }
  
  const info = cycleInfo[cycle]
  const cycleCompleted = parts.filter(p => completedParts.includes(p.number)).length
  const cycleTotal = parts.length
  
  return (
    <div className="space-y-4">
      <div className={`p-4 rounded-lg ${info.bgColor}`}>
        <div className="flex justify-between items-center">
          <div>
            <h2 className={`text-xl font-semibold ${info.color}`}>{info.title}</h2>
            <p className="text-sm text-zinc-500">{info.subtitle}</p>
          </div>
          <div className="text-right">
            <p className={`text-2xl font-bold ${info.color}`}>{cycleCompleted}/{cycleTotal}</p>
            <p className="text-xs text-zinc-500">completed</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {parts.map(part => (
          <PartCard
            key={part.number}
            part={part}
            isCompleted={completedParts.includes(part.number)}
            isCurrent={part.number === currentPart}
            onComplete={() => onComplete(part.number)}
          />
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function SovereignCyclePage() {
  const [progress, setProgress] = useState<SovereignProgress>(initializeSovereignProgress)
  const [activeTab, setActiveTab] = useState<CyclePhase | 'all'>('all')
  
  const handleComplete = (partNumber: number) => {
    setProgress(prev => completePart(prev, partNumber))
  }
  
  const filteredParts = useMemo(() => {
    if (activeTab === 'all') return SOVEREIGN_CYCLE
    return getPartsByCycle(activeTab)
  }, [activeTab])
  
  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-100 mb-2">The 36-Part Sovereign Cycle</h1>
        <p className="text-zinc-500">
          Complete operating system for consciousness, will, and transformation
        </p>
      </header>
      
      {/* Progress Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="cascade-card p-6 flex flex-col items-center">
          <CycleProgressRing progress={progress} />
          <p className="mt-4 text-sm text-zinc-400">
            {progress.percentComplete.toFixed(0)}% Complete
          </p>
        </div>
        
        <div className="cascade-card p-6">
          <h3 className="text-lg font-medium text-zinc-200 mb-4">Current Phase</h3>
          <div className="space-y-3">
            <div className={`p-3 rounded-lg ${
              progress.cyclePhase === CyclePhase.FOUNDATION ? 'bg-cyan-500/20' :
              progress.cyclePhase === CyclePhase.ARCHITECT ? 'bg-purple-500/20' :
              'bg-amber-500/20'
            }`}>
              <p className="text-lg font-medium text-zinc-200">{progress.cyclePhase}</p>
              <p className="text-sm text-zinc-400">
                {progress.cyclePhase === CyclePhase.FOUNDATION ? 'Building the base' :
                 progress.cyclePhase === CyclePhase.ARCHITECT ? 'Deep layer mastery' :
                 'Integration & completion'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="cascade-card p-6">
          <h3 className="text-lg font-medium text-zinc-200 mb-4">Next Part</h3>
          {progress.nextPart ? (
            <div className="p-3 bg-zinc-800/50 rounded-lg">
              <p className="text-sm text-cyan-400">Part {progress.nextPart.number}</p>
              <p className="text-lg font-medium text-zinc-200">{progress.nextPart.title}</p>
              <p className="text-xs text-zinc-500 font-mono mt-1">{progress.nextPart.sigil}</p>
            </div>
          ) : (
            <div className="p-3 bg-emerald-500/10 rounded-lg">
              <p className="text-emerald-400">🎉 Cycle Complete!</p>
            </div>
          )}
        </div>
        
        <div className="cascade-card p-6">
          <h3 className="text-lg font-medium text-zinc-200 mb-4">The Final Seal</h3>
          <div className="p-3 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-lg text-center">
            <p className="text-lg font-mono text-purple-400">
              ✧⟟≋ΨΦ↑✧∥◁▷∥⟲◆◆◆∞
            </p>
            <p className="text-xs text-zinc-500 mt-2">
              The complete seal awaits
            </p>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {[
          { id: 'all', label: 'All Parts' },
          { id: CyclePhase.FOUNDATION, label: 'Foundation (1-21)' },
          { id: CyclePhase.ARCHITECT, label: 'Architect (22-30)' },
          { id: CyclePhase.TRANSCENDENCE, label: 'Transcendence (31-36)' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as CyclePhase | 'all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-cyan-500 text-zinc-900'
                : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* Parts */}
      {activeTab === 'all' ? (
        <div className="space-y-8">
          <CycleSection 
            cycle={CyclePhase.FOUNDATION}
            parts={getPartsByCycle(CyclePhase.FOUNDATION)}
            completedParts={progress.completedParts}
            currentPart={progress.currentPart}
            onComplete={handleComplete}
          />
          <CycleSection 
            cycle={CyclePhase.ARCHITECT}
            parts={getPartsByCycle(CyclePhase.ARCHITECT)}
            completedParts={progress.completedParts}
            currentPart={progress.currentPart}
            onComplete={handleComplete}
          />
          <CycleSection 
            cycle={CyclePhase.TRANSCENDENCE}
            parts={getPartsByCycle(CyclePhase.TRANSCENDENCE)}
            completedParts={progress.completedParts}
            currentPart={progress.currentPart}
            onComplete={handleComplete}
          />
        </div>
      ) : (
        <CycleSection 
          cycle={activeTab}
          parts={filteredParts}
          completedParts={progress.completedParts}
          currentPart={progress.currentPart}
          onComplete={handleComplete}
        />
      )}
    </div>
  )
}
