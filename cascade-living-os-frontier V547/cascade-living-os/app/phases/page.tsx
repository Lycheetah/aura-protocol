'use client'

import { useState, useEffect, useMemo } from 'react'
import { useCASCADEStore } from '@/lib/store/cascade-store'
import {
  SEVEN_PHASES,
  PHASE_BLOCKS,
  toSovereignDate,
  getPhaseProgress,
  getCycleProgress,
  getDaysUntilNextPhase,
  getNextPhase,
  initializePhaseEngine,
  SECTOR_SIZE,
  type SovereignDate,
  type Phase
} from '@/lib/cascade/seven-phase'
import {
  PhaseGlyph,
  PHASE_GLYPH_DATA,
  getCurrentPhaseGlyph,
  LAMAGUEParser,
  LAMAGUE_EXPRESSIONS
} from '@/lib/cascade/lamague'

// ============================================================================
// PHASE CIRCLE VISUALIZATION
// ============================================================================

function PhaseCircle({ sovereignDate }: { sovereignDate: SovereignDate }) {
  const size = 300
  const center = size / 2
  const radius = 120
  const innerRadius = 80
  
  // Calculate angle for current position
  const currentAngle = (sovereignDate.dayOfYear / 364) * 2 * Math.PI - Math.PI / 2
  
  return (
    <svg width={size} height={size} className="mx-auto">
      {/* Background circle */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="rgb(63, 63, 70)"
        strokeWidth="2"
      />
      
      {/* Phase sectors */}
      {SEVEN_PHASES.map((phase, i) => {
        const startAngle = (i / 7) * 2 * Math.PI - Math.PI / 2
        const endAngle = ((i + 1) / 7) * 2 * Math.PI - Math.PI / 2
        const midAngle = (startAngle + endAngle) / 2
        
        const isCurrentPhase = phase.index === sovereignDate.phase.index
        
        // Arc path
        const largeArcFlag = 0
        const x1 = center + radius * Math.cos(startAngle)
        const y1 = center + radius * Math.sin(startAngle)
        const x2 = center + radius * Math.cos(endAngle)
        const y2 = center + radius * Math.sin(endAngle)
        const ix1 = center + innerRadius * Math.cos(startAngle)
        const iy1 = center + innerRadius * Math.sin(startAngle)
        const ix2 = center + innerRadius * Math.cos(endAngle)
        const iy2 = center + innerRadius * Math.sin(endAngle)
        
        const pathD = `
          M ${x1} ${y1}
          A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
          L ${ix2} ${iy2}
          A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${ix1} ${iy1}
          Z
        `
        
        // Glyph position
        const glyphRadius = (radius + innerRadius) / 2
        const gx = center + glyphRadius * Math.cos(midAngle)
        const gy = center + glyphRadius * Math.sin(midAngle)
        
        const phaseColors = [
          'rgba(139, 92, 246, 0.3)',  // Center - purple
          'rgba(59, 130, 246, 0.3)',  // Flow - blue
          'rgba(34, 197, 94, 0.3)',   // Insight - green
          'rgba(249, 115, 22, 0.3)',  // Rise - orange
          'rgba(234, 179, 8, 0.3)',   // Light - yellow
          'rgba(6, 182, 212, 0.3)',   // Integrity - cyan
          'rgba(168, 85, 247, 0.3)',  // Return - violet
        ]
        
        return (
          <g key={phase.index}>
            <path
              d={pathD}
              fill={isCurrentPhase ? phaseColors[i].replace('0.3', '0.6') : phaseColors[i]}
              stroke={isCurrentPhase ? 'rgb(6, 182, 212)' : 'rgb(63, 63, 70)'}
              strokeWidth={isCurrentPhase ? 2 : 1}
            />
            <text
              x={gx}
              y={gy}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={isCurrentPhase ? 'white' : 'rgb(161, 161, 170)'}
              fontSize={isCurrentPhase ? 20 : 16}
              className="font-mono"
            >
              {phase.glyph}
            </text>
          </g>
        )
      })}
      
      {/* Current position marker */}
      <circle
        cx={center + radius * Math.cos(currentAngle)}
        cy={center + radius * Math.sin(currentAngle)}
        r={8}
        fill="rgb(6, 182, 212)"
        stroke="white"
        strokeWidth="2"
        className="animate-pulse"
      />
      
      {/* Center display */}
      <text
        x={center}
        y={center - 10}
        textAnchor="middle"
        fill="white"
        fontSize="24"
        className="font-mono"
      >
        {sovereignDate.phase.glyph}
      </text>
      <text
        x={center}
        y={center + 15}
        textAnchor="middle"
        fill="rgb(161, 161, 170)"
        fontSize="12"
      >
        Day {sovereignDate.dayOfYear}
      </text>
    </svg>
  )
}

// ============================================================================
// PHASE INFO CARD
// ============================================================================

function PhaseInfoCard({ phase }: { phase: Phase }) {
  return (
    <div className="cascade-card p-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
          <span className="text-3xl font-mono text-cyan-400">{phase.glyph}</span>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-zinc-100">{phase.name}</h3>
          <p className="text-sm text-zinc-500">{phase.description}</p>
        </div>
      </div>
      
      {/* Ethical Metrics */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="p-3 bg-zinc-800/50 rounded-lg text-center">
          <p className="text-xs text-zinc-500">TES</p>
          <p className={`text-lg font-mono ${phase.ethicalMetrics.TES >= 0.70 ? 'text-emerald-400' : 'text-amber-400'}`}>
            {(phase.ethicalMetrics.TES * 100).toFixed(0)}%
          </p>
        </div>
        <div className="p-3 bg-zinc-800/50 rounded-lg text-center">
          <p className="text-xs text-zinc-500">VTR</p>
          <p className={`text-lg font-mono ${phase.ethicalMetrics.VTR >= 1.5 ? 'text-emerald-400' : 'text-amber-400'}`}>
            {phase.ethicalMetrics.VTR.toFixed(1)}
          </p>
        </div>
        <div className="p-3 bg-zinc-800/50 rounded-lg text-center">
          <p className="text-xs text-zinc-500">PAI</p>
          <p className={`text-lg font-mono ${phase.ethicalMetrics.PAI >= 0.80 ? 'text-emerald-400' : 'text-amber-400'}`}>
            {(phase.ethicalMetrics.PAI * 100).toFixed(0)}%
          </p>
        </div>
      </div>
      
      {/* Practices */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-zinc-300 mb-2">Practices for this Phase</h4>
        <ul className="space-y-1">
          {phase.practices.map((practice, i) => (
            <li key={i} className="text-sm text-zinc-400 flex items-start gap-2">
              <span className="text-cyan-400 mt-1">•</span>
              {practice}
            </li>
          ))}
        </ul>
      </div>
      
      {/* Warnings */}
      <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
        <h4 className="text-xs font-medium text-amber-400 mb-1">⚠️ Watch for:</h4>
        <ul className="text-xs text-zinc-400">
          {phase.warnings.map((warning, i) => (
            <li key={i}>• {warning}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

// ============================================================================
// PROGRESS BAR
// ============================================================================

function PhaseProgressBar({ sovereignDate }: { sovereignDate: SovereignDate }) {
  const phaseProgress = getPhaseProgress(sovereignDate)
  const cycleProgress = getCycleProgress(sovereignDate)
  const daysLeft = getDaysUntilNextPhase(sovereignDate)
  const nextPhase = getNextPhase(sovereignDate.phase)
  
  return (
    <div className="cascade-card p-6 space-y-6">
      {/* Phase Progress */}
      <div>
        <div className="flex justify-between mb-2">
          <span className="text-sm text-zinc-400">Phase Progress</span>
          <span className="text-sm font-mono text-cyan-400">
            Day {sovereignDate.phaseDay}/52
          </span>
        </div>
        <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-500"
            style={{ width: `${phaseProgress * 100}%` }}
          />
        </div>
        <p className="text-xs text-zinc-500 mt-1">
          {daysLeft} days until {nextPhase.glyph} {nextPhase.name}
        </p>
      </div>
      
      {/* Cycle Progress */}
      <div>
        <div className="flex justify-between mb-2">
          <span className="text-sm text-zinc-400">364-Day Cycle</span>
          <span className="text-sm font-mono text-purple-400">
            {(cycleProgress * 100).toFixed(1)}%
          </span>
        </div>
        <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-500"
            style={{ width: `${cycleProgress * 100}%` }}
          />
        </div>
        <p className="text-xs text-zinc-500 mt-1">
          {364 - sovereignDate.dayOfYear} days remaining in cycle
        </p>
      </div>
      
      {/* Block Info */}
      <div className="p-4 bg-zinc-800/50 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-zinc-500">Current Block</p>
            <p className="text-lg font-medium text-zinc-200">{sovereignDate.block.type}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-zinc-500">Block Day</p>
            <p className="text-lg font-mono text-cyan-400">{sovereignDate.blockDay}/13</p>
          </div>
        </div>
        <p className="text-sm text-zinc-400 mt-2">{sovereignDate.block.focus}</p>
      </div>
    </div>
  )
}

// ============================================================================
// LAMAGUE EXPRESSION DISPLAY
// ============================================================================

function LAMAGUEExpressionDisplay() {
  const [expression, setExpression] = useState(LAMAGUE_EXPRESSIONS.FULL_CYCLE)
  const parsed = useMemo(() => LAMAGUEParser.parse(expression), [expression])
  
  return (
    <div className="cascade-card p-6">
      <h3 className="text-lg font-medium text-zinc-200 mb-4">LAMAGUE Expression</h3>
      
      {/* Input */}
      <input
        type="text"
        value={expression}
        onChange={(e) => setExpression(e.target.value)}
        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 font-mono text-lg text-center focus:outline-none focus:border-cyan-500 mb-4"
        placeholder="Enter LAMAGUE expression..."
      />
      
      {/* Quick expressions */}
      <div className="flex flex-wrap gap-2 mb-4">
        {[
          { label: 'Full Cycle', value: LAMAGUE_EXPRESSIONS.FULL_CYCLE },
          { label: 'Rising', value: LAMAGUE_EXPRESSIONS.INSIGHT_TO_RISE },
          { label: 'Recovery', value: LAMAGUE_EXPRESSIONS.FROM_VOID_TO_CENTER },
          { label: 'Spiral', value: LAMAGUE_EXPRESSIONS.SPIRAL_RETURN },
        ].map(({ label, value }) => (
          <button
            key={label}
            onClick={() => setExpression(value)}
            className="px-3 py-1 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-full transition-colors"
          >
            {label}
          </button>
        ))}
      </div>
      
      {/* Validation */}
      {parsed.isValid ? (
        <div className="space-y-3">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
            <p className="text-xs text-emerald-400 mb-1">✓ Valid Expression</p>
          </div>
          
          {/* Three Registers */}
          <div className="space-y-2">
            <div className="p-3 bg-zinc-800/50 rounded-lg">
              <p className="text-xs text-purple-400 mb-1">Poetic Register</p>
              <p className="text-sm text-zinc-300">{parsed.translations.poetic}</p>
            </div>
            <div className="p-3 bg-zinc-800/50 rounded-lg">
              <p className="text-xs text-cyan-400 mb-1">Mathematical Register</p>
              <p className="text-sm text-zinc-300 font-mono">{parsed.translations.mathematical}</p>
            </div>
            <div className="p-3 bg-zinc-800/50 rounded-lg">
              <p className="text-xs text-emerald-400 mb-1">Practical Register</p>
              <p className="text-sm text-zinc-300">{parsed.translations.practical}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-xs text-red-400 mb-1">⚠ Validation Errors</p>
          <ul className="text-xs text-zinc-400">
            {parsed.errors.map((err, i) => (
              <li key={i}>• {err}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// PHASE LIST
// ============================================================================

function PhaseList({ currentPhaseIndex }: { currentPhaseIndex: number }) {
  return (
    <div className="cascade-card p-6">
      <h3 className="text-lg font-medium text-zinc-200 mb-4">Seven Phases</h3>
      <div className="space-y-2">
        {SEVEN_PHASES.map((phase) => {
          const isCurrent = phase.index === currentPhaseIndex
          const isPast = phase.index < currentPhaseIndex
          
          return (
            <div
              key={phase.index}
              className={`p-3 rounded-lg flex items-center gap-3 ${
                isCurrent 
                  ? 'bg-cyan-500/20 border border-cyan-500/30' 
                  : isPast 
                    ? 'bg-zinc-800/50' 
                    : 'bg-zinc-800/30'
              }`}
            >
              <span className={`text-xl font-mono ${isCurrent ? 'text-cyan-400' : isPast ? 'text-zinc-500' : 'text-zinc-600'}`}>
                {phase.glyph}
              </span>
              <div className="flex-1">
                <p className={`text-sm font-medium ${isCurrent ? 'text-cyan-300' : isPast ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  {phase.name.split(' ')[0]}
                </p>
                <p className="text-xs text-zinc-600">Days {phase.dayRange[0]}-{phase.dayRange[1]}</p>
              </div>
              {isCurrent && (
                <span className="px-2 py-1 text-xs bg-cyan-500/30 text-cyan-300 rounded-full">
                  Current
                </span>
              )}
              {isPast && (
                <span className="text-emerald-400">✓</span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function PhaseTrackerPage() {
  const [sovereignDate, setSovereignDate] = useState<SovereignDate | null>(null)
  
  useEffect(() => {
    setSovereignDate(toSovereignDate(new Date()))
  }, [])
  
  if (!sovereignDate) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-pulse text-zinc-400">Loading phase data...</div>
      </div>
    )
  }
  
  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-100 mb-2">Phase Tracker</h1>
        <p className="text-zinc-500">
          364-Day Sovereign Cycle • {sovereignDate.formatted}
        </p>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <div className="cascade-card p-6">
            <h3 className="text-lg font-medium text-zinc-200 mb-4 text-center">Current Position</h3>
            <PhaseCircle sovereignDate={sovereignDate} />
          </div>
          <PhaseList currentPhaseIndex={sovereignDate.phase.index} />
        </div>
        
        {/* Center Column */}
        <div className="space-y-6">
          <PhaseInfoCard phase={sovereignDate.phase} />
          <PhaseProgressBar sovereignDate={sovereignDate} />
        </div>
        
        {/* Right Column */}
        <div className="space-y-6">
          <LAMAGUEExpressionDisplay />
          
          {/* Mathematical Display */}
          <div className="cascade-card p-6">
            <h3 className="text-lg font-medium text-zinc-200 mb-4">Phase Mathematics</h3>
            <div className="space-y-3">
              <div className="p-3 bg-zinc-800/50 rounded-lg">
                <p className="text-xs text-zinc-500">Phase Angle (θ)</p>
                <p className="text-lg font-mono text-cyan-400">
                  {((sovereignDate.dayOfYear / 364) * 2 * Math.PI).toFixed(4)} rad
                </p>
              </div>
              <div className="p-3 bg-zinc-800/50 rounded-lg">
                <p className="text-xs text-zinc-500">Angular Velocity (ω)</p>
                <p className="text-lg font-mono text-purple-400">
                  2π/364 ≈ 0.01725 rad/day
                </p>
              </div>
              <div className="p-3 bg-zinc-800/50 rounded-lg">
                <p className="text-xs text-zinc-500">Awareness Energy (E)</p>
                <p className="text-lg font-mono text-emerald-400">
                  {sovereignDate.phase.awarenessEnergy.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
