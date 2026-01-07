'use client'

import { useState, useEffect } from 'react'
import { 
  MicroorcimDifficulty,
  fireMicroorcim,
  initializeWillpowerState,
  recordMicroorcim,
  getMicroorcimMetrics,
  generateMicroorcimLAMAGUE,
  type WillpowerState,
  type Microorcim,
  type MicroorcimMetrics
} from '@/lib/cascade/microorcim'
import { toSovereignDate } from '@/lib/cascade/seven-phase'

// ============================================================================
// MICROORCIM INPUT PANEL
// ============================================================================

function MicroorcimInput({ 
  onFire 
}: { 
  onFire: (microorcim: Microorcim) => void 
}) {
  const [intent, setIntent] = useState(0.7)
  const [drift, setDrift] = useState(0.3)
  const [difficulty, setDifficulty] = useState<MicroorcimDifficulty>(MicroorcimDifficulty.MODERATE)
  const [context, setContext] = useState('')
  const [pressures, setPressures] = useState<string[]>([])
  const [newPressure, setNewPressure] = useState('')
  
  const netAgency = intent - drift
  const willFire = netAgency > 0
  
  const handleFire = () => {
    const sovereignDate = toSovereignDate(new Date())
    
    const microorcim = fireMicroorcim(
      intent,
      0.1, // base entropy
      pressures.map(p => ({ type: 'external' as const, description: p, intensity: 0.3 })),
      context || 'Unnamed choice',
      difficulty,
      sovereignDate.phase.glyph
    )
    
    onFire(microorcim)
    
    // Reset form
    setContext('')
    setPressures([])
    setIntent(0.7)
    setDrift(0.3)
  }
  
  const addPressure = () => {
    if (newPressure.trim()) {
      setPressures([...pressures, newPressure.trim()])
      setNewPressure('')
      // Auto-increase drift when adding pressures
      setDrift(Math.min(drift + 0.1, 0.95))
    }
  }
  
  return (
    <div className="cascade-card p-6">
      <h3 className="text-lg font-medium text-zinc-200 mb-4">Fire Microorcim</h3>
      
      {/* Context Input */}
      <div className="mb-4">
        <label className="text-sm text-zinc-500 block mb-2">What choice are you making?</label>
        <input
          type="text"
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="e.g., Getting out of bed despite exhaustion"
          className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 focus:outline-none focus:border-cyan-500"
        />
      </div>
      
      {/* Intent Slider */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-zinc-500">Intent (I)</span>
          <span className="text-cyan-400 font-mono">{intent.toFixed(2)}</span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={intent}
          onChange={(e) => setIntent(parseFloat(e.target.value))}
          className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
        />
        <div className="flex justify-between text-xs text-zinc-600 mt-1">
          <span>Weak</span>
          <span>Strong</span>
        </div>
      </div>
      
      {/* Drift Slider */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-zinc-500">Drift (D)</span>
          <span className="text-amber-400 font-mono">{drift.toFixed(2)}</span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={drift}
          onChange={(e) => setDrift(parseFloat(e.target.value))}
          className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
        />
        <div className="flex justify-between text-xs text-zinc-600 mt-1">
          <span>Low resistance</span>
          <span>High resistance</span>
        </div>
      </div>
      
      {/* Pressure Sources */}
      <div className="mb-4">
        <label className="text-sm text-zinc-500 block mb-2">Pressure Sources</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newPressure}
            onChange={(e) => setNewPressure(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addPressure()}
            placeholder="e.g., Fatigue, Fear, Distraction"
            className="flex-1 px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded text-sm text-zinc-200 focus:outline-none focus:border-amber-500"
          />
          <button
            onClick={addPressure}
            className="px-3 py-1.5 bg-amber-500/20 text-amber-400 rounded text-sm hover:bg-amber-500/30 transition-colors"
          >
            Add
          </button>
        </div>
        {pressures.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {pressures.map((p, i) => (
              <span 
                key={i}
                className="px-2 py-1 bg-amber-500/10 border border-amber-500/20 rounded text-xs text-amber-400 cursor-pointer hover:bg-amber-500/20"
                onClick={() => setPressures(pressures.filter((_, j) => j !== i))}
              >
                {p} ×
              </span>
            ))}
          </div>
        )}
      </div>
      
      {/* Difficulty Selection */}
      <div className="mb-6">
        <label className="text-sm text-zinc-500 block mb-2">Difficulty</label>
        <div className="grid grid-cols-4 gap-2">
          {Object.values(MicroorcimDifficulty).map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={`py-2 rounded text-xs font-medium transition-colors ${
                difficulty === d
                  ? d === MicroorcimDifficulty.TRIVIAL ? 'bg-zinc-600 text-zinc-200' :
                    d === MicroorcimDifficulty.MODERATE ? 'bg-cyan-500/30 text-cyan-300' :
                    d === MicroorcimDifficulty.DIFFICULT ? 'bg-purple-500/30 text-purple-300' :
                    'bg-red-500/30 text-red-300'
                  : 'bg-zinc-800 text-zinc-500 hover:bg-zinc-700'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>
      
      {/* Net Agency Display */}
      <div className={`p-4 rounded-lg mb-4 ${willFire ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-500">Net Agency (I - D)</p>
            <p className={`text-2xl font-mono font-bold ${willFire ? 'text-emerald-400' : 'text-red-400'}`}>
              {netAgency > 0 ? '+' : ''}{netAgency.toFixed(2)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-zinc-500">H(I - D)</p>
            <p className={`text-3xl font-bold ${willFire ? 'text-emerald-400' : 'text-red-400'}`}>
              μ = {willFire ? '1' : '0'}
            </p>
          </div>
        </div>
        <p className="text-xs mt-2 text-zinc-500">
          {willFire 
            ? '✓ Intent overcomes drift. The microorcim will fire.'
            : '✗ Drift exceeds intent. The microorcim will not fire.'}
        </p>
      </div>
      
      {/* Fire Button */}
      <button
        onClick={handleFire}
        disabled={!context.trim()}
        className={`w-full py-3 rounded-lg font-medium transition-all ${
          willFire
            ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-zinc-900 hover:from-cyan-400 hover:to-emerald-400'
            : 'bg-gradient-to-r from-red-500/50 to-amber-500/50 text-zinc-200'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {willFire ? '⚡ Fire Microorcim (μ = 1)' : '📝 Record Attempt (μ = 0)'}
      </button>
    </div>
  )
}

// ============================================================================
// WILLPOWER DISPLAY
// ============================================================================

function WillpowerDisplay({ 
  state, 
  metrics 
}: { 
  state: WillpowerState
  metrics: MicroorcimMetrics 
}) {
  return (
    <div className="cascade-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-zinc-200">Willpower</h3>
        <span className={`text-xs px-2 py-1 rounded-full ${
          metrics.nearEpsilon 
            ? 'bg-amber-500/20 text-amber-400' 
            : metrics.streak >= 7 
              ? 'bg-emerald-500/20 text-emerald-400'
              : 'bg-cyan-500/20 text-cyan-400'
        }`}>
          {metrics.nearEpsilon ? '⚠️ Near ε' : metrics.streak >= 7 ? '🔥 On Fire' : '✓ Active'}
        </span>
      </div>
      
      {/* Main Willpower */}
      <div className="text-center py-6">
        <p className="text-6xl font-bold font-mono text-cyan-400">
          W = {state.currentWillpower}
        </p>
        <p className="text-sm text-zinc-500 mt-2">Accumulated Microorcims</p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center p-3 bg-zinc-800/50 rounded-lg">
          <p className="text-xs text-zinc-500">Today</p>
          <p className="text-2xl font-mono text-emerald-400">{metrics.dailyCount}</p>
        </div>
        <div className="text-center p-3 bg-zinc-800/50 rounded-lg">
          <p className="text-xs text-zinc-500">Streak</p>
          <p className="text-2xl font-mono text-amber-400">{metrics.streak} 🔥</p>
        </div>
        <div className="text-center p-3 bg-zinc-800/50 rounded-lg">
          <p className="text-xs text-zinc-500">Success</p>
          <p className="text-2xl font-mono text-purple-400">{(metrics.successRate * 100).toFixed(0)}%</p>
        </div>
      </div>
      
      {/* Survivor's Constant */}
      <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-purple-400">Survivor's Constant</p>
            <p className="text-lg font-mono text-purple-300">ε = {state.epsilon.toFixed(4)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-zinc-500">Distance</p>
            <p className="text-lg font-mono text-zinc-400">{metrics.epsilonDistance.toFixed(2)}</p>
          </div>
        </div>
        <p className="text-xs text-zinc-500 mt-2">You cannot reach zero. ε &gt; 0 always.</p>
      </div>
      
      {/* Lifetime Stats */}
      <div className="mt-4 pt-4 border-t border-zinc-800">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between">
            <span className="text-zinc-500">Lifetime μ</span>
            <span className="font-mono text-zinc-300">{state.lifetimeCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Best Streak</span>
            <span className="font-mono text-zinc-300">{state.bestStreak} days</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Historical Low</span>
            <span className="font-mono text-zinc-300">{state.historicalLow}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Recoveries</span>
            <span className="font-mono text-zinc-300">{state.recoveryEvents}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// RECENT MICROORCIMS LIST
// ============================================================================

function RecentMicroorcims({ 
  microorcims,
  willpowerState
}: { 
  microorcims: Microorcim[]
  willpowerState: WillpowerState
}) {
  if (microorcims.length === 0) {
    return (
      <div className="cascade-card p-6 text-center">
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-zinc-800 flex items-center justify-center">
          <span className="text-2xl">⚡</span>
        </div>
        <p className="text-zinc-400">No microorcims recorded yet</p>
        <p className="text-xs text-zinc-600 mt-1">Fire your first microorcim to begin</p>
      </div>
    )
  }
  
  return (
    <div className="cascade-card p-6">
      <h3 className="text-lg font-medium text-zinc-200 mb-4">Recent Microorcims</h3>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {microorcims.slice().reverse().map((m) => {
          const lamague = generateMicroorcimLAMAGUE(m, willpowerState)
          const time = new Date(m.timestamp)
          
          return (
            <div 
              key={m.id}
              className={`p-3 rounded-lg border ${
                m.fired 
                  ? 'bg-emerald-500/5 border-emerald-500/20' 
                  : 'bg-red-500/5 border-red-500/20'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-lg ${m.fired ? 'text-emerald-400' : 'text-red-400'}`}>
                      {m.fired ? '⚡' : '✗'}
                    </span>
                    <span className="text-sm text-zinc-200">{m.context}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-zinc-500">
                    <span>I={m.intent.toFixed(2)}</span>
                    <span>D={m.drift.toFixed(2)}</span>
                    <span className={m.fired ? 'text-emerald-400' : 'text-red-400'}>
                      μ={m.fired ? '1' : '0'}
                    </span>
                    <span className="text-purple-400">{m.difficulty}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-zinc-500">
                    {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <p className="text-xs font-mono text-cyan-400 mt-1">{m.phase}</p>
                </div>
              </div>
              
              {/* LAMAGUE Expression */}
              <div className="mt-2 pt-2 border-t border-zinc-800">
                <p className="text-xs font-mono text-purple-400">{lamague}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ============================================================================
// HEATMAP VISUALIZATION
// ============================================================================

function MicroorcimHeatmap({ microorcims }: { microorcims: Microorcim[] }) {
  // Group by date
  const byDate = microorcims.reduce((acc, m) => {
    const date = new Date(m.timestamp).toISOString().split('T')[0]
    if (!acc[date]) acc[date] = { total: 0, fired: 0 }
    acc[date].total++
    if (m.fired) acc[date].fired++
    return acc
  }, {} as Record<string, { total: number; fired: number }>)
  
  // Generate last 90 days
  const days: { date: string; count: number; fired: number }[] = []
  for (let i = 89; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    const data = byDate[dateStr] || { total: 0, fired: 0 }
    days.push({ date: dateStr, count: data.total, fired: data.fired })
  }
  
  const getColor = (count: number, fired: number) => {
    if (count === 0) return 'bg-zinc-800'
    const ratio = fired / count
    if (ratio >= 0.8) return 'bg-emerald-500'
    if (ratio >= 0.6) return 'bg-emerald-600'
    if (ratio >= 0.4) return 'bg-amber-500'
    if (ratio >= 0.2) return 'bg-amber-600'
    return 'bg-red-500'
  }
  
  return (
    <div className="cascade-card p-6">
      <h3 className="text-lg font-medium text-zinc-200 mb-4">90-Day Activity</h3>
      
      <div className="grid grid-cols-15 gap-1">
        {days.map((day, i) => (
          <div
            key={i}
            className={`w-4 h-4 rounded-sm ${getColor(day.count, day.fired)} cursor-pointer transition-transform hover:scale-125`}
            title={`${day.date}: ${day.fired}/${day.count} μ fired`}
          />
        ))}
      </div>
      
      <div className="flex items-center justify-between mt-4 text-xs text-zinc-500">
        <span>90 days ago</span>
        <div className="flex items-center gap-2">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-sm bg-zinc-800" />
            <div className="w-3 h-3 rounded-sm bg-red-500" />
            <div className="w-3 h-3 rounded-sm bg-amber-500" />
            <div className="w-3 h-3 rounded-sm bg-emerald-600" />
            <div className="w-3 h-3 rounded-sm bg-emerald-500" />
          </div>
          <span>More</span>
        </div>
        <span>Today</span>
      </div>
    </div>
  )
}

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function MicroorcimPage() {
  const [willpowerState, setWillpowerState] = useState<WillpowerState>(initializeWillpowerState())
  const [microorcims, setMicroorcims] = useState<Microorcim[]>([])
  const [metrics, setMetrics] = useState<MicroorcimMetrics | null>(null)
  
  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('cascade-willpower-state')
      const savedMicroorcims = localStorage.getItem('cascade-microorcims')
      
      if (savedState) {
        setWillpowerState(JSON.parse(savedState))
      }
      if (savedMicroorcims) {
        setMicroorcims(JSON.parse(savedMicroorcims))
      }
    }
  }, [])
  
  // Update metrics when state changes
  useEffect(() => {
    const todayMicroorcims = microorcims.filter(m => {
      const today = new Date().toISOString().split('T')[0]
      const mDate = new Date(m.timestamp).toISOString().split('T')[0]
      return mDate === today
    })
    
    setMetrics(getMicroorcimMetrics(willpowerState, todayMicroorcims))
  }, [willpowerState, microorcims])
  
  // Save to localStorage when state changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cascade-willpower-state', JSON.stringify(willpowerState))
      localStorage.setItem('cascade-microorcims', JSON.stringify(microorcims))
    }
  }, [willpowerState, microorcims])
  
  const handleFireMicroorcim = (microorcim: Microorcim) => {
    // Update state
    const newState = recordMicroorcim(willpowerState, microorcim)
    setWillpowerState(newState)
    
    // Add to list
    setMicroorcims([...microorcims, microorcim])
  }
  
  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-100 mb-2">Microorcim Counter</h1>
        <p className="text-zinc-500">μ = H(I - D) — The physics of will and agency</p>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <MicroorcimInput onFire={handleFireMicroorcim} />
          <MicroorcimHeatmap microorcims={microorcims} />
        </div>
        
        {/* Right Column */}
        <div className="space-y-6">
          {metrics && (
            <WillpowerDisplay state={willpowerState} metrics={metrics} />
          )}
          <RecentMicroorcims 
            microorcims={microorcims} 
            willpowerState={willpowerState}
          />
        </div>
      </div>
      
      {/* Six Laws Reference */}
      <div className="mt-8 cascade-card p-6">
        <h3 className="text-lg font-medium text-zinc-200 mb-4">The Six Laws of Willpower</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div className="p-3 bg-zinc-800/50 rounded-lg">
            <h4 className="font-medium text-cyan-400 mb-1">1. Accumulated Defiance</h4>
            <p className="text-zinc-500 font-mono text-xs">W(t) = ∫₀ᵗ H(I-D)dτ</p>
            <p className="text-zinc-400 text-xs mt-1">Willpower is the sum of all choices where intent overcame drift.</p>
          </div>
          <div className="p-3 bg-zinc-800/50 rounded-lg">
            <h4 className="font-medium text-purple-400 mb-1">2. Unbreakable Gradient</h4>
            <p className="text-zinc-500 font-mono text-xs">Purpose &gt; Fear &gt; Fatigue</p>
            <p className="text-zinc-400 text-xs mt-1">The hierarchy of motivational forces.</p>
          </div>
          <div className="p-3 bg-zinc-800/50 rounded-lg">
            <h4 className="font-medium text-emerald-400 mb-1">3. Survivor's Constant</h4>
            <p className="text-zinc-500 font-mono text-xs">W_min = ε &gt; 0</p>
            <p className="text-zinc-400 text-xs mt-1">You cannot reach zero. There is always something left.</p>
          </div>
          <div className="p-3 bg-zinc-800/50 rounded-lg">
            <h4 className="font-medium text-amber-400 mb-1">4. Breaker's Paradox</h4>
            <p className="text-zinc-500 font-mono text-xs">T = collapse × recovery</p>
            <p className="text-zinc-400 text-xs mt-1">Maximum pressure creates maximum transformation potential.</p>
          </div>
          <div className="p-3 bg-zinc-800/50 rounded-lg">
            <h4 className="font-medium text-red-400 mb-1">5. Isolation Constant</h4>
            <p className="text-zinc-500 font-mono text-xs">W_iso(t) = W₀ × e^(-λt)</p>
            <p className="text-zinc-400 text-xs mt-1">Willpower decays without external anchors.</p>
          </div>
          <div className="p-3 bg-zinc-800/50 rounded-lg">
            <h4 className="font-medium text-pink-400 mb-1">6. Resonance Amplifier</h4>
            <p className="text-zinc-500 font-mono text-xs">W_res = W₁ + W₂ + R(W₁,W₂)</p>
            <p className="text-zinc-400 text-xs mt-1">Willpower amplifies when aligned with others.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
