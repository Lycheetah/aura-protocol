'use client'

import { useState, useMemo } from 'react'
import { useCASCADEStore } from '@/lib/store/cascade-store'
import { useCascadeAI } from '@/lib/hooks/use-cascade-ai'
import { TrajectoryPoint, TrajectoryPrediction, OracleWarning } from '@/types/cascade'

// Trajectory calculation (simplified differential equations model)
function calculateTrajectory(
  initialSovereignty: number,
  initialCoherence: number,
  initialAgency: number,
  timeHorizonDays: number = 84
): TrajectoryPrediction {
  const trajectory: TrajectoryPoint[] = []
  const warnings: OracleWarning[] = []
  const predictedCascades: number[] = []
  
  let sov = initialSovereignty
  let coh = initialCoherence
  let agency = initialAgency
  
  // Drift rate (natural decay)
  const driftRate = 0.005
  // Growth rate (practice effect)
  const growthRate = 0.003
  // Cascade threshold
  const cascadeThreshold = 0.3
  
  for (let day = 0; day <= timeHorizonDays; day++) {
    // Confidence decreases with time
    const confidence = Math.max(0.1, 1 - (day / timeHorizonDays) * 0.7)
    
    // Calculate cascade probability based on rate of change
    const cascadeProb = day > 0 
      ? Math.abs(trajectory[day - 1]?.sovereignty - sov) > 0.05 ? 0.3 : 0.05
      : 0
    
    trajectory.push({
      day,
      sovereignty: sov,
      coherence: coh,
      agency,
      confidence,
      cascadeProbability: cascadeProb
    })
    
    // Check for warnings
    if (sov < 0.5 && day > 0 && !warnings.some(w => w.type === 'DRIFT_RISK')) {
      warnings.push({
        day,
        type: 'DRIFT_RISK',
        message: `Sovereignty predicted to drop below 50% by day ${day}`,
        probability: confidence,
        recommendation: 'Increase grounding practices and autonomous decision-making'
      })
    }
    
    if (agency < 0.4 && day > 0 && !warnings.some(w => w.type === 'LOW_AGENCY')) {
      warnings.push({
        day,
        type: 'LOW_AGENCY',
        message: `Agency may become critically low around day ${day}`,
        probability: confidence,
        recommendation: 'Focus on small sovereign choices to rebuild willpower'
      })
    }
    
    if (cascadeProb > 0.2) {
      predictedCascades.push(day)
    }
    
    // Apply dynamics (simplified model)
    // Natural drift pulls toward 0.5
    const driftPull = (0.5 - sov) * driftRate
    // Coherence affects growth
    const coherenceBonus = coh * growthRate
    
    // Update state with some randomness for uncertainty
    const noise = (Math.random() - 0.5) * 0.02
    sov = Math.max(0.1, Math.min(1, sov + driftPull + coherenceBonus + noise))
    coh = Math.max(0.1, Math.min(1, coh + (sov - 0.5) * 0.01 + (Math.random() - 0.5) * 0.01))
    agency = Math.max(0.1, Math.min(1, agency + (sov - 0.5) * 0.01 + (Math.random() - 0.5) * 0.01))
  }
  
  return {
    id: `oracle-${Date.now()}`,
    startState: {
      value: initialSovereignty,
      drift: { magnitude: 0, baseline: [], current: [], velocity: 0, direction: 'stable' },
      willpower: { current: 0.5, minimum: 0.001, maximum: 1, history: [] },
      coherence: initialCoherence,
      timestamp: Date.now()
    },
    timeHorizonDays,
    trajectory,
    predictedCascades,
    warnings,
    generatedAt: Date.now()
  }
}

// Trajectory Graph Component
function TrajectoryGraph({ prediction }: { prediction: TrajectoryPrediction }) {
  const [hoveredDay, setHoveredDay] = useState<number | null>(null)
  
  const maxY = 1
  const graphHeight = 200
  const graphWidth = 600
  const padding = 40
  
  const pointToCoords = (point: TrajectoryPoint): { x: number; y: number } => ({
    x: padding + (point.day / prediction.timeHorizonDays) * (graphWidth - padding * 2),
    y: graphHeight - padding - (point.sovereignty * (graphHeight - padding * 2))
  })
  
  const sovereigntyPath = prediction.trajectory
    .map((p, i) => {
      const { x, y } = pointToCoords(p)
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
    })
    .join(' ')
  
  const coherencePath = prediction.trajectory
    .map((p, i) => {
      const { x } = pointToCoords(p)
      const y = graphHeight - padding - (p.coherence * (graphHeight - padding * 2))
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
    })
    .join(' ')
  
  const agencyPath = prediction.trajectory
    .map((p, i) => {
      const { x } = pointToCoords(p)
      const y = graphHeight - padding - (p.agency * (graphHeight - padding * 2))
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
    })
    .join(' ')
  
  const hoveredPoint = hoveredDay !== null ? prediction.trajectory[hoveredDay] : null
  
  return (
    <div className="relative">
      <svg 
        viewBox={`0 0 ${graphWidth} ${graphHeight}`} 
        className="w-full h-64"
        onMouseLeave={() => setHoveredDay(null)}
      >
        {/* Grid lines */}
        {[0.25, 0.5, 0.75, 1].map(y => (
          <g key={y}>
            <line
              x1={padding}
              y1={graphHeight - padding - y * (graphHeight - padding * 2)}
              x2={graphWidth - padding}
              y2={graphHeight - padding - y * (graphHeight - padding * 2)}
              stroke="rgb(63, 63, 70)"
              strokeWidth={1}
              strokeDasharray="4 4"
            />
            <text
              x={padding - 8}
              y={graphHeight - padding - y * (graphHeight - padding * 2) + 4}
              fill="rgb(113, 113, 122)"
              fontSize={10}
              textAnchor="end"
            >
              {(y * 100).toFixed(0)}%
            </text>
          </g>
        ))}
        
        {/* X-axis labels */}
        {[0, 28, 56, 84].map(day => (
          <text
            key={day}
            x={padding + (day / 84) * (graphWidth - padding * 2)}
            y={graphHeight - 10}
            fill="rgb(113, 113, 122)"
            fontSize={10}
            textAnchor="middle"
          >
            Day {day}
          </text>
        ))}
        
        {/* Cascade prediction markers */}
        {prediction.predictedCascades.map(day => {
          const point = prediction.trajectory[day]
          if (!point) return null
          const { x, y } = pointToCoords(point)
          return (
            <circle
              key={`cascade-${day}`}
              cx={x}
              cy={y}
              r={4}
              fill="rgb(168, 85, 247)"
              opacity={0.5}
            />
          )
        })}
        
        {/* Confidence band */}
        <path
          d={`${sovereigntyPath} L ${graphWidth - padding} ${graphHeight - padding} L ${padding} ${graphHeight - padding} Z`}
          fill="rgb(6, 182, 212)"
          opacity={0.1}
        />
        
        {/* Trajectory lines */}
        <path d={agencyPath} fill="none" stroke="rgb(16, 185, 129)" strokeWidth={2} opacity={0.6} />
        <path d={coherencePath} fill="none" stroke="rgb(168, 85, 247)" strokeWidth={2} opacity={0.6} />
        <path d={sovereigntyPath} fill="none" stroke="rgb(6, 182, 212)" strokeWidth={2.5} />
        
        {/* Interactive hover areas */}
        {prediction.trajectory.map((point, i) => {
          const { x, y } = pointToCoords(point)
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={8}
              fill="transparent"
              cursor="pointer"
              onMouseEnter={() => setHoveredDay(i)}
            />
          )
        })}
        
        {/* Hover indicator */}
        {hoveredPoint && (
          <>
            <line
              x1={pointToCoords(hoveredPoint).x}
              y1={padding}
              x2={pointToCoords(hoveredPoint).x}
              y2={graphHeight - padding}
              stroke="rgb(6, 182, 212)"
              strokeWidth={1}
              strokeDasharray="4 4"
            />
            <circle
              cx={pointToCoords(hoveredPoint).x}
              cy={pointToCoords(hoveredPoint).y}
              r={5}
              fill="rgb(6, 182, 212)"
            />
          </>
        )}
      </svg>
      
      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-cyan-500" />
          <span className="text-xs text-zinc-400">Sovereignty</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-500" />
          <span className="text-xs text-zinc-400">Coherence</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-xs text-zinc-400">Agency</span>
        </div>
      </div>
      
      {/* Tooltip */}
      {hoveredPoint && (
        <div className="absolute top-4 right-4 p-4 bg-zinc-800 rounded-lg border border-zinc-700">
          <div className="text-sm font-medium text-zinc-200 mb-2">
            Day {hoveredPoint.day}
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between gap-4">
              <span className="text-zinc-500">Sovereignty:</span>
              <span className="text-cyan-400 font-mono">{(hoveredPoint.sovereignty * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-zinc-500">Coherence:</span>
              <span className="text-purple-400 font-mono">{(hoveredPoint.coherence * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-zinc-500">Agency:</span>
              <span className="text-emerald-400 font-mono">{(hoveredPoint.agency * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between gap-4 pt-1 border-t border-zinc-700">
              <span className="text-zinc-500">Confidence:</span>
              <span className="text-zinc-300 font-mono">{(hoveredPoint.confidence * 100).toFixed(0)}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Warnings Panel
function WarningsPanel({ warnings }: { warnings: OracleWarning[] }) {
  if (warnings.length === 0) {
    return (
      <div className="cascade-card p-6">
        <h3 className="text-lg font-medium text-zinc-200 mb-4">Early Warnings</h3>
        <div className="text-center py-8">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-emerald-500/10 flex items-center justify-center">
            <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-sm text-emerald-400">No warnings detected</p>
          <p className="text-xs text-zinc-500 mt-1">Your trajectory looks stable</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="cascade-card p-6">
      <h3 className="text-lg font-medium text-zinc-200 mb-4">Early Warnings</h3>
      <div className="space-y-3">
        {warnings.map((warning, i) => (
          <div 
            key={i}
            className={`p-4 rounded-lg ${
              warning.type === 'DRIFT_RISK' ? 'bg-amber-500/10 border border-amber-500/20' :
              warning.type === 'LOW_AGENCY' ? 'bg-red-500/10 border border-red-500/20' :
              'bg-purple-500/10 border border-purple-500/20'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-medium ${
                warning.type === 'DRIFT_RISK' ? 'text-amber-400' :
                warning.type === 'LOW_AGENCY' ? 'text-red-400' :
                'text-purple-400'
              }`}>
                {warning.type.replace(/_/g, ' ')}
              </span>
              <span className="text-xs text-zinc-500">Day {warning.day}</span>
            </div>
            <p className="text-sm text-zinc-200 mb-2">{warning.message}</p>
            <p className="text-xs text-zinc-400">
              <span className="text-zinc-500">Recommendation:</span> {warning.recommendation}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

// AI Oracle Consultation
function AIConsultation() {
  const [query, setQuery] = useState('')
  const [oracleResponse, setOracleResponse] = useState<string | null>(null)
  const { consultOracle, isLoading, error } = useCascadeAI()
  
  const sovereigntyScore = useCASCADEStore(state => state.sovereignty.humanSovereignty.value)
  const patterns = useCASCADEStore(state => state.patterns)
  
  const handleConsult = async () => {
    if (!query.trim()) return
    
    const response = await consultOracle(query, {
      sovereigntyScore,
      recentPatterns: patterns.slice(0, 5).map(p => p.content)
    })
    
    setOracleResponse(response)
  }
  
  return (
    <div className="cascade-card p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-medium text-zinc-200">Consult the Oracle</h3>
          <p className="text-xs text-zinc-500">AI-powered trajectory insights</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask the Oracle about your trajectory... What challenges do you foresee? What patterns concern you?"
          className="w-full h-24 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-purple-500 resize-none"
        />
        
        <button
          onClick={handleConsult}
          disabled={!query.trim() || isLoading}
          className="w-full py-3 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              The Oracle is seeing...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Seek Guidance
            </>
          )}
        </button>
        
        {error && (
          <p className="text-xs text-red-400 text-center">{error}</p>
        )}
        
        {oracleResponse && (
          <div className="mt-4 p-4 bg-purple-500/5 border border-purple-500/20 rounded-lg animate-fade-in">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-purple-400 text-lg">Ψ</span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-zinc-300 whitespace-pre-wrap">{oracleResponse}</p>
              </div>
            </div>
          </div>
        )}
        
        <p className="text-xs text-zinc-600 text-center">
          Powered by Claude AI • Requires API key
        </p>
      </div>
    </div>
  )
}

// Oracle Input Form
function OracleInputForm({ onGenerate }: { onGenerate: (pred: TrajectoryPrediction) => void }) {
  const sovereignty = useCASCADEStore(state => state.sovereignty)
  const pyramid = useCASCADEStore(state => state.pyramid)
  
  const [customSov, setCustomSov] = useState(sovereignty.humanSovereignty.value)
  const [customCoh, setCustomCoh] = useState(pyramid.coherence)
  const [customAgency, setCustomAgency] = useState(0.7)
  const [horizon, setHorizon] = useState(84)
  const [useCurrentState, setUseCurrentState] = useState(true)
  
  const handleGenerate = () => {
    const pred = calculateTrajectory(
      useCurrentState ? sovereignty.humanSovereignty.value : customSov,
      useCurrentState ? pyramid.coherence : customCoh,
      useCurrentState ? sovereignty.humanSovereignty.willpower.current / sovereignty.humanSovereignty.willpower.maximum : customAgency,
      horizon
    )
    onGenerate(pred)
  }
  
  return (
    <div className="cascade-card p-6">
      <h3 className="text-lg font-medium text-zinc-200 mb-4">Oracle Configuration</h3>
      
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="useCurrentState"
            checked={useCurrentState}
            onChange={(e) => setUseCurrentState(e.target.checked)}
            className="w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-cyan-500 focus:ring-cyan-500"
          />
          <label htmlFor="useCurrentState" className="text-sm text-zinc-300">
            Use current system state
          </label>
        </div>
        
        {!useCurrentState && (
          <div className="space-y-4 p-4 bg-zinc-800/50 rounded-lg">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm text-zinc-400">Initial Sovereignty</label>
                <span className="text-sm font-mono text-cyan-400">{(customSov * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={customSov}
                onChange={(e) => setCustomSov(parseFloat(e.target.value))}
                className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm text-zinc-400">Initial Coherence</label>
                <span className="text-sm font-mono text-purple-400">{(customCoh * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={customCoh}
                onChange={(e) => setCustomCoh(parseFloat(e.target.value))}
                className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm text-zinc-400">Initial Agency</label>
                <span className="text-sm font-mono text-emerald-400">{(customAgency * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={customAgency}
                onChange={(e) => setCustomAgency(parseFloat(e.target.value))}
                className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>
          </div>
        )}
        
        <div>
          <label className="block text-sm text-zinc-400 mb-2">Time Horizon (days)</label>
          <select
            value={horizon}
            onChange={(e) => setHorizon(parseInt(e.target.value))}
            className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 focus:outline-none focus:border-cyan-500"
          >
            <option value={28}>28 days (4 weeks)</option>
            <option value={56}>56 days (8 weeks)</option>
            <option value={84}>84 days (12 weeks)</option>
          </select>
        </div>
        
        <button
          onClick={handleGenerate}
          className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-zinc-900 font-medium rounded-lg transition-colors"
        >
          Generate Prediction
        </button>
      </div>
    </div>
  )
}

// Final State Summary
function FinalStateSummary({ prediction }: { prediction: TrajectoryPrediction }) {
  const finalPoint = prediction.trajectory[prediction.trajectory.length - 1]
  const startPoint = prediction.trajectory[0]
  
  const sovChange = finalPoint.sovereignty - startPoint.sovereignty
  const cohChange = finalPoint.coherence - startPoint.coherence
  const agencyChange = finalPoint.agency - startPoint.agency
  
  return (
    <div className="cascade-card p-6">
      <h3 className="text-lg font-medium text-zinc-200 mb-4">
        Predicted State at Day {prediction.timeHorizonDays}
      </h3>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-zinc-800/50 rounded-lg text-center">
          <span className="text-xs text-zinc-500">Sovereignty</span>
          <p className="text-2xl font-mono text-cyan-400">{(finalPoint.sovereignty * 100).toFixed(0)}%</p>
          <p className={`text-xs ${sovChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {sovChange >= 0 ? '+' : ''}{(sovChange * 100).toFixed(1)}%
          </p>
        </div>
        <div className="p-4 bg-zinc-800/50 rounded-lg text-center">
          <span className="text-xs text-zinc-500">Coherence</span>
          <p className="text-2xl font-mono text-purple-400">{(finalPoint.coherence * 100).toFixed(0)}%</p>
          <p className={`text-xs ${cohChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {cohChange >= 0 ? '+' : ''}{(cohChange * 100).toFixed(1)}%
          </p>
        </div>
        <div className="p-4 bg-zinc-800/50 rounded-lg text-center">
          <span className="text-xs text-zinc-500">Agency</span>
          <p className="text-2xl font-mono text-emerald-400">{(finalPoint.agency * 100).toFixed(0)}%</p>
          <p className={`text-xs ${agencyChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {agencyChange >= 0 ? '+' : ''}{(agencyChange * 100).toFixed(1)}%
          </p>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-zinc-800/30 rounded-lg">
        <div className="flex justify-between text-sm">
          <span className="text-zinc-500">Predicted Cascades</span>
          <span className="font-mono text-purple-400">{prediction.predictedCascades.length}</span>
        </div>
        <div className="flex justify-between text-sm mt-1">
          <span className="text-zinc-500">Prediction Confidence</span>
          <span className="font-mono text-zinc-400">{(finalPoint.confidence * 100).toFixed(0)}%</span>
        </div>
      </div>
    </div>
  )
}

// Main Oracle Page
export default function OraclePage() {
  const [prediction, setPrediction] = useState<TrajectoryPrediction | null>(null)
  const setOraclePrediction = useCASCADEStore(state => state.setOraclePrediction)
  
  const handleGenerate = (pred: TrajectoryPrediction) => {
    setPrediction(pred)
    setOraclePrediction(pred)
  }
  
  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-100 mb-2">Temporal Oracle</h1>
        <p className="text-zinc-500">84-day trajectory forecasting with early warning system</p>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <OracleInputForm onGenerate={handleGenerate} />
          <AIConsultation />
        </div>
        
        {prediction ? (
          <>
            <div className="lg:col-span-2 cascade-card p-6">
              <h3 className="text-lg font-medium text-zinc-200 mb-4">Trajectory Forecast</h3>
              <TrajectoryGraph prediction={prediction} />
            </div>
            
            <FinalStateSummary prediction={prediction} />
            <WarningsPanel warnings={prediction.warnings} />
          </>
        ) : (
          <div className="lg:col-span-2 cascade-card p-6 flex items-center justify-center">
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cyan-500/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-zinc-200 mb-2">Ready to See Your Future</h3>
              <p className="text-sm text-zinc-500 max-w-md mx-auto">
                Configure your initial state and generate a trajectory prediction to see how your sovereignty, coherence, and agency may evolve over time.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
