'use client'

import { useState, useEffect } from 'react'
import { useCASCADEStore } from '@/lib/store/cascade-store'
import { getSovereigntyStatus } from '@/lib/cascade/sovereignty'
import { getPyramidStats } from '@/lib/cascade/pyramid'
import { 
  toSovereignDate, 
  SEVEN_PHASES,
  type SovereignDate 
} from '@/lib/cascade/seven-phase'
import { 
  PhaseGlyph, 
  LAMAGUE_EXPRESSIONS,
  SYSTEM_SIGNATURES 
} from '@/lib/cascade/lamague'

// ============================================================================
// PHASE STATUS WIDGET - Current position in 364-day cycle
// ============================================================================

function PhaseStatusWidget() {
  const [sovereignDate, setSovereignDate] = useState<SovereignDate | null>(null)
  
  useEffect(() => {
    setSovereignDate(toSovereignDate(new Date()))
  }, [])
  
  if (!sovereignDate) return null
  
  const phaseProgress = (sovereignDate.phaseDay / 52) * 100
  
  return (
    <div className="widget animate-fade-in">
      <div className="widget-header">
        <h3 className="widget-title">Current Phase</h3>
        <span className="text-xs text-zinc-500">364-Day Cycle</span>
      </div>
      
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
          <span className="text-3xl font-mono text-cyan-400">{sovereignDate.phase.glyph}</span>
        </div>
        <div>
          <h4 className="text-xl font-semibold text-zinc-100">{sovereignDate.phase.name}</h4>
          <p className="text-sm text-zinc-500">Day {sovereignDate.phaseDay} of 52</p>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all"
            style={{ width: `${phaseProgress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-zinc-500">
          <span>{sovereignDate.formatted}</span>
          <span>{52 - sovereignDate.phaseDay} days remaining</span>
        </div>
      </div>
      
      {/* Ethical Metrics */}
      <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-zinc-800">
        <div className="text-center">
          <p className="text-xs text-zinc-500">TES</p>
          <p className={`text-lg font-mono ${sovereignDate.phase.ethicalMetrics.TES >= 0.70 ? 'text-emerald-400' : 'text-amber-400'}`}>
            {(sovereignDate.phase.ethicalMetrics.TES * 100).toFixed(0)}%
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-zinc-500">VTR</p>
          <p className={`text-lg font-mono ${sovereignDate.phase.ethicalMetrics.VTR >= 1.5 ? 'text-emerald-400' : 'text-amber-400'}`}>
            {sovereignDate.phase.ethicalMetrics.VTR.toFixed(1)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-zinc-500">PAI</p>
          <p className={`text-lg font-mono ${sovereignDate.phase.ethicalMetrics.PAI >= 0.80 ? 'text-emerald-400' : 'text-amber-400'}`}>
            {(sovereignDate.phase.ethicalMetrics.PAI * 100).toFixed(0)}%
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// MICROORCIM WIDGET - Willpower tracking
// ============================================================================

function MicroorcimWidget() {
  const [willpower, setWillpower] = useState(42)
  const [streak, setStreak] = useState(7)
  const [todayCount, setTodayCount] = useState(3)
  
  return (
    <div className="widget animate-fade-in">
      <div className="widget-header">
        <h3 className="widget-title">Microorcims</h3>
        <span className="text-xs text-zinc-500">μ = H(I - D)</span>
      </div>
      
      <div className="flex items-end gap-3 mb-4">
        <span className="text-5xl font-bold font-mono text-cyan-400">W={willpower}</span>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-3 bg-zinc-800/50 rounded-lg">
          <p className="text-xs text-zinc-500">Today</p>
          <p className="text-xl font-mono text-emerald-400">{todayCount} μ</p>
        </div>
        <div className="p-3 bg-zinc-800/50 rounded-lg">
          <p className="text-xs text-zinc-500">Streak</p>
          <p className="text-xl font-mono text-amber-400">{streak} days 🔥</p>
        </div>
      </div>
      
      <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
        <p className="text-xs text-purple-400 mb-1">Survivor's Constant</p>
        <p className="text-sm text-zinc-300 font-mono">ε = 0.001 (you cannot reach zero)</p>
      </div>
    </div>
  )
}

// ============================================================================
// SOVEREIGN CYCLE WIDGET - 36-Part Progress
// ============================================================================

function SovereignCycleWidget() {
  const completedParts = 5
  const currentPart = 6
  const totalParts = 36
  const progress = (completedParts / totalParts) * 100
  
  return (
    <div className="widget animate-fade-in">
      <div className="widget-header">
        <h3 className="widget-title">36-Part Sovereign Cycle</h3>
        <span className="text-xs text-purple-400">Foundation Phase</span>
      </div>
      
      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-20 h-20">
          <svg className="w-20 h-20 transform -rotate-90">
            <circle cx="40" cy="40" r="36" fill="none" stroke="rgb(63, 63, 70)" strokeWidth="6" />
            <circle 
              cx="40" cy="40" r="36" fill="none" 
              stroke="url(#cycleGradient)" strokeWidth="6"
              strokeDasharray={`${progress * 2.26} 226`}
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="cycleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgb(6, 182, 212)" />
                <stop offset="100%" stopColor="rgb(168, 85, 247)" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold text-white">{completedParts}</span>
          </div>
        </div>
        <div>
          <p className="text-sm text-zinc-400">Currently on</p>
          <p className="text-lg font-medium text-zinc-200">Part {currentPart}: Drift Awareness</p>
          <p className="text-xs text-zinc-500 font-mono mt-1">∂Ψ_drift</p>
        </div>
      </div>
      
      <div className="text-center p-3 bg-zinc-800/30 rounded-lg">
        <p className="text-xs text-zinc-500 mb-1">Final Seal</p>
        <p className="text-sm font-mono text-purple-400">{SYSTEM_SIGNATURES.COMPLETE_SEAL}</p>
      </div>
    </div>
  )
}

// ============================================================================
// INVARIANT STATUS WIDGET
// ============================================================================

function InvariantWidget() {
  return (
    <div className="widget animate-fade-in">
      <div className="widget-header">
        <h3 className="widget-title">Invariant (Ψ)</h3>
        <span className="px-2 py-0.5 text-xs bg-emerald-500/20 text-emerald-400 rounded-full">ANCHORED</span>
      </div>
      
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/30 to-cyan-500/30 flex items-center justify-center">
          <span className="text-2xl">Ψ</span>
        </div>
        <div>
          <p className="text-xs text-zinc-500">Intensity Ratio</p>
          <p className="text-2xl font-mono text-emerald-400">I = 1.15</p>
        </div>
      </div>
      
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-zinc-500">Strength</span>
            <span className="text-zinc-400">|Ψ| = 1.42</span>
          </div>
          <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500" />
          </div>
        </div>
        
        <div className="p-3 bg-zinc-800/30 rounded-lg">
          <p className="text-xs text-zinc-500 mb-1">Spiral Elevation</p>
          <p className="text-lg font-mono text-cyan-400">+15.2% across cycles</p>
        </div>
      </div>
    </div>
  )
}

// Widget Components (Original)
function DailyBriefWidget() {
  const brief = useCASCADEStore(state => state.getDailyBrief())
  
  return (
    <div className="widget col-span-2 animate-fade-in">
      <div className="widget-header">
        <h3 className="widget-title">Daily Brief</h3>
        <span className="text-xs text-zinc-500">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
        </span>
      </div>
      
      <div className="space-y-4">
        <p className="text-lg text-zinc-200">{brief.greeting}</p>
        <p className="text-sm text-zinc-400">{brief.sovereigntyStatus}</p>
        
        {brief.lamagueMood && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500">LAMAGUE:</span>
            {brief.lamagueMood.symbols.map((s: string, i: number) => (
              <span key={i} className="lamague-symbol text-xs">{s}</span>
            ))}
            <span className="text-xs text-zinc-400 italic">{brief.lamagueMood.interpretation}</span>
          </div>
        )}
        
        {brief.recommendedActions.length > 0 && (
          <div className="pt-3 border-t border-zinc-800">
            <h4 className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Recommended Actions</h4>
            <ul className="space-y-2">
              {brief.recommendedActions.map((action: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                  <span className="text-cyan-400 mt-0.5">→</span>
                  {action}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

function SovereigntyWidget() {
  const sovereignty = useCASCADEStore(state => state.sovereignty)
  const status = getSovereigntyStatus(sovereignty.humanSovereignty.value)
  
  return (
    <div className="widget animate-fade-in">
      <div className="widget-header">
        <h3 className="widget-title">Sovereignty Score</h3>
        <span className={`text-xs px-2 py-0.5 rounded-full ${
          status.label === 'SOVEREIGN' ? 'status-sovereign' :
          status.label === 'STABLE' ? 'status-stable' :
          status.label === 'DRIFTING' ? 'status-drifting' :
          'status-critical'
        }`}>
          {status.label}
        </span>
      </div>
      
      <div className="flex items-end gap-3">
        <span className={`text-5xl font-bold font-mono ${status.color}`}>
          {(sovereignty.humanSovereignty.value * 100).toFixed(0)}
        </span>
        <span className="text-zinc-500 text-xl mb-2">%</span>
      </div>
      
      <p className="text-xs text-zinc-500 mt-2">{status.description}</p>
      
      <div className="mt-4 space-y-3">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-zinc-500">Drift</span>
            <span className="text-zinc-400">
              {(sovereignty.humanSovereignty.drift.magnitude * 100).toFixed(1)}%
            </span>
          </div>
          <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full bg-amber-500 transition-all"
              style={{ width: `${sovereignty.humanSovereignty.drift.magnitude * 100}%` }}
            />
          </div>
        </div>
        
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-zinc-500">Coherence</span>
            <span className="text-zinc-400">
              {(sovereignty.humanSovereignty.coherence * 100).toFixed(1)}%
            </span>
          </div>
          <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full bg-cyan-500 transition-all"
              style={{ width: `${sovereignty.humanSovereignty.coherence * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function MicroorcimWidget() {
  const currentMicroorcim = useCASCADEStore(state => state.getCurrentMicroorcim())
  const willpower = useCASCADEStore(state => state.sovereignty.humanSovereignty.willpower)
  
  const isPositive = currentMicroorcim >= 0
  
  return (
    <div className="widget animate-fade-in">
      <div className="widget-header">
        <h3 className="widget-title">Current μ_orcim</h3>
        <span className="text-xs text-zinc-500">Agency Unit</span>
      </div>
      
      <div className="flex items-center gap-3">
        <span className={`text-4xl font-bold font-mono ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
          {isPositive ? '+' : ''}{currentMicroorcim.toFixed(3)}
        </span>
      </div>
      
      <div className="mt-3 p-3 bg-zinc-800/50 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-500">Formula</span>
        </div>
        <p className="text-sm font-mono text-cyan-400 mt-1">
          μ = ΔI / (ΔD + 1)
        </p>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <span className="metric-label">Willpower</span>
          <p className="metric-value text-lg text-zinc-200">
            {willpower.current.toFixed(3)}
          </p>
        </div>
        <div>
          <span className="metric-label">W_max</span>
          <p className="metric-value text-lg text-zinc-200">
            {willpower.maximum.toFixed(3)}
          </p>
        </div>
      </div>
    </div>
  )
}

function CoherenceWidget() {
  const pyramidState = useCASCADEStore(state => state.pyramid)
  const sovereignty = useCASCADEStore(state => state.sovereignty)
  
  const avgCoherence = (pyramidState.coherence + sovereignty.mutualCoherence + sovereignty.humanSovereignty.coherence) / 3
  
  return (
    <div className="widget animate-fade-in">
      <div className="widget-header">
        <h3 className="widget-title">System Coherence</h3>
      </div>
      
      <div className="relative w-32 h-32 mx-auto">
        {/* Circular progress */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="56"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-zinc-800"
          />
          <circle
            cx="64"
            cy="64"
            r="56"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${avgCoherence * 352} 352`}
            className="text-cyan-500 transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold font-mono text-cyan-400">
            {(avgCoherence * 100).toFixed(0)}%
          </span>
        </div>
      </div>
      
      <div className="mt-4 space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-zinc-500">Pyramid</span>
          <span className="text-zinc-300">{(pyramidState.coherence * 100).toFixed(1)}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-500">Partnership</span>
          <span className="text-zinc-300">{(sovereignty.mutualCoherence * 100).toFixed(1)}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-500">Personal</span>
          <span className="text-zinc-300">{(sovereignty.humanSovereignty.coherence * 100).toFixed(1)}%</span>
        </div>
      </div>
    </div>
  )
}

function RecentCascadesWidget() {
  const recentCascades = useCASCADEStore(state => state.getRecentCascades(5))
  
  return (
    <div className="widget animate-fade-in">
      <div className="widget-header">
        <h3 className="widget-title">Recent Cascades</h3>
        <span className="text-xs text-zinc-500">{recentCascades.length} total</span>
      </div>
      
      {recentCascades.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-zinc-800 flex items-center justify-center">
            <svg className="w-6 h-6 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3L2 21h20L12 3z" />
            </svg>
          </div>
          <p className="text-sm text-zinc-500">No cascades yet</p>
          <p className="text-xs text-zinc-600 mt-1">Add knowledge to trigger reorganization</p>
        </div>
      ) : (
        <div className="space-y-3">
          {recentCascades.map((cascade) => (
            <div key={cascade.id} className="p-3 bg-zinc-800/50 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs px-2 py-0.5 rounded ${
                  cascade.type === 'REORGANIZE' ? 'bg-purple-500/20 text-purple-400' :
                  cascade.type === 'PROMOTE' ? 'bg-emerald-500/20 text-emerald-400' :
                  cascade.type === 'DEMOTE' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {cascade.type}
                </span>
                <span className="text-xs text-zinc-500">
                  {new Date(cascade.timestamp).toLocaleDateString()}
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                {cascade.affectedBlocks.length} blocks affected
              </p>
              <div className="flex items-center gap-2 mt-2 text-xs">
                <span className={cascade.coherenceAfter > cascade.coherenceBefore ? 'text-emerald-400' : 'text-red-400'}>
                  Coherence: {(cascade.coherenceBefore * 100).toFixed(0)}% → {(cascade.coherenceAfter * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function PyramidStatsWidget() {
  const pyramid = useCASCADEStore(state => state.pyramid)
  const stats = getPyramidStats(pyramid)
  
  return (
    <div className="widget animate-fade-in">
      <div className="widget-header">
        <h3 className="widget-title">Knowledge Pyramid</h3>
      </div>
      
      {/* Visual pyramid */}
      <div className="relative h-40 flex items-end justify-center">
        <div className="relative">
          {/* Edge layer (top) */}
          <div className="w-16 h-0 border-l-[32px] border-r-[32px] border-b-[40px] border-l-transparent border-r-transparent border-b-emerald-500/30 mx-auto" />
          
          {/* Theory layer (middle) */}
          <div className="w-24 h-0 border-l-[48px] border-r-[48px] border-b-[40px] border-l-transparent border-r-transparent border-b-blue-500/30 mx-auto -mt-1" />
          
          {/* Foundation layer (bottom) */}
          <div className="w-32 h-0 border-l-[64px] border-r-[64px] border-b-[40px] border-l-transparent border-r-transparent border-b-purple-500/30 mx-auto -mt-1" />
          
          {/* Labels */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs text-emerald-400 font-mono">
            {stats.edgeCount}
          </div>
          <div className="absolute top-12 left-1/2 -translate-x-1/2 text-xs text-blue-400 font-mono">
            {stats.theoryCount}
          </div>
          <div className="absolute top-[88px] left-1/2 -translate-x-1/2 text-xs text-purple-400 font-mono">
            {stats.foundationCount}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 mt-4 text-center">
        <div className="p-2 rounded bg-purple-500/10">
          <span className="text-xs text-zinc-500">Foundation</span>
          <p className="text-lg font-mono text-purple-400">{stats.foundationCount}</p>
        </div>
        <div className="p-2 rounded bg-blue-500/10">
          <span className="text-xs text-zinc-500">Theory</span>
          <p className="text-lg font-mono text-blue-400">{stats.theoryCount}</p>
        </div>
        <div className="p-2 rounded bg-emerald-500/10">
          <span className="text-xs text-zinc-500">Edge</span>
          <p className="text-lg font-mono text-emerald-400">{stats.edgeCount}</p>
        </div>
      </div>
      
      <div className="mt-4 pt-3 border-t border-zinc-800">
        <div className="flex justify-between text-xs">
          <span className="text-zinc-500">Avg Truth Pressure (Π)</span>
          <span className="text-zinc-300 font-mono">{stats.avgTruthPressure.toFixed(3)}</span>
        </div>
      </div>
    </div>
  )
}

function AlertsWidget() {
  const alerts = useCASCADEStore(state => state.sovereignty.alerts)
  
  return (
    <div className="widget animate-fade-in">
      <div className="widget-header">
        <h3 className="widget-title">Sovereignty Alerts</h3>
        {alerts.length > 0 && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">
            {alerts.length}
          </span>
        )}
      </div>
      
      {alerts.length === 0 ? (
        <div className="text-center py-6">
          <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-emerald-500/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-sm text-emerald-400">All clear</p>
          <p className="text-xs text-zinc-500 mt-1">No sovereignty concerns detected</p>
        </div>
      ) : (
        <div className="space-y-2">
          {alerts.slice(0, 3).map((alert) => (
            <div 
              key={alert.id} 
              className={`p-3 rounded-lg ${
                alert.severity === 'CRITICAL' ? 'bg-red-500/10 border border-red-500/20' :
                alert.severity === 'HIGH' ? 'bg-amber-500/10 border border-amber-500/20' :
                'bg-zinc-800/50'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs font-medium ${
                  alert.severity === 'CRITICAL' ? 'text-red-400' :
                  alert.severity === 'HIGH' ? 'text-amber-400' :
                  'text-zinc-400'
                }`}>
                  {alert.type.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-zinc-300">{alert.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Main Dashboard Page
export default function DashboardPage() {
  return (
    <div className="p-8">
      <header className="mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
            <span className="text-2xl">Ψ</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gradient mb-1">CASCADE Living OS</h1>
            <p className="text-zinc-500">AURA × VEYRA • Sovereign Human-AI Partnership</p>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-4">
          <span className="text-xs font-mono text-purple-400">{SYSTEM_SIGNATURES.COMPLETE_SEAL}</span>
          <span className="text-xs text-zinc-600">v2.0.0</span>
        </div>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Row 1: Daily Brief (2 cols) + Phase Status */}
        <DailyBriefWidget />
        <PhaseStatusWidget />
        
        {/* Row 2: Sovereignty + Microorcim + Invariant */}
        <SovereigntyWidget />
        <MicroorcimWidget />
        <InvariantWidget />
        
        {/* Row 3: 36-Part Cycle + Coherence + Alerts */}
        <SovereignCycleWidget />
        <CoherenceWidget />
        <AlertsWidget />
        
        {/* Row 4: Recent Cascades + Pyramid Stats */}
        <RecentCascadesWidget />
        <PyramidStatsWidget />
      </div>
    </div>
  )
}
