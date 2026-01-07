'use client'

import { useState } from 'react'
import { useCASCADEStore } from '@/lib/store/cascade-store'
import { 
  getSovereigntyStatus, 
  getPhaseDescription,
  calculateMicroorcim 
} from '@/lib/cascade/sovereignty'

// Microorcim Calculator Component
function MicroorcimCalculator() {
  const [intentStrength, setIntentStrength] = useState(0.5)
  const [driftResistance, setDriftResistance] = useState(0.5)
  const [context, setContext] = useState('')
  const recordDecision = useCASCADEStore(state => state.recordDecision)
  
  const previewMicroorcim = intentStrength / (1 - driftResistance + 1)
  
  const handleRecord = () => {
    recordDecision({
      agent: 'human',
      intentStrength,
      driftResistance,
      coherenceImpact: previewMicroorcim > 0 ? 0.1 : -0.1
    })
    setContext('')
  }
  
  return (
    <div className="cascade-card p-6">
      <h3 className="text-lg font-medium text-zinc-200 mb-4">Microorcim Calculator</h3>
      
      <div className="p-4 bg-zinc-800/50 rounded-lg mb-6">
        <p className="text-sm text-zinc-400 mb-2">Formula</p>
        <p className="font-mono text-cyan-400 text-lg">μ_orcim = ΔI / (ΔD + 1)</p>
        <p className="text-xs text-zinc-500 mt-2">
          Where ΔI = change in intent direction, ΔD = change in drift
        </p>
      </div>
      
      <div className="space-y-6">
        {/* Intent Strength Slider */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm text-zinc-400">Intent Strength (ΔI)</label>
            <span className="text-sm font-mono text-cyan-400">{intentStrength.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={intentStrength}
            onChange={(e) => setIntentStrength(parseFloat(e.target.value))}
            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
          <div className="flex justify-between text-xs text-zinc-600 mt-1">
            <span>Weak</span>
            <span>Strong</span>
          </div>
        </div>
        
        {/* Drift Resistance Slider */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm text-zinc-400">Drift Resistance (1-ΔD)</label>
            <span className="text-sm font-mono text-purple-400">{driftResistance.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={driftResistance}
            onChange={(e) => setDriftResistance(parseFloat(e.target.value))}
            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
          <div className="flex justify-between text-xs text-zinc-600 mt-1">
            <span>Low (high entropy)</span>
            <span>High (overcame drift)</span>
          </div>
        </div>
        
        {/* Context Input */}
        <div>
          <label className="block text-sm text-zinc-400 mb-2">Decision Context</label>
          <input
            type="text"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="What sovereign decision did you make?"
            className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
        
        {/* Preview */}
        <div className="p-4 bg-zinc-900 rounded-lg border border-zinc-800">
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-400">Calculated μ_orcim</span>
            <span className={`text-2xl font-mono font-bold ${
              previewMicroorcim >= 0.5 ? 'text-emerald-400' :
              previewMicroorcim >= 0 ? 'text-cyan-400' :
              'text-red-400'
            }`}>
              {previewMicroorcim >= 0 ? '+' : ''}{previewMicroorcim.toFixed(4)}
            </span>
          </div>
          
          <div className="mt-3 h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all ${
                previewMicroorcim >= 0.5 ? 'bg-emerald-500' :
                previewMicroorcim >= 0 ? 'bg-cyan-500' :
                'bg-red-500'
              }`}
              style={{ width: `${Math.min(100, Math.max(0, previewMicroorcim * 100))}%` }}
            />
          </div>
        </div>
        
        {/* Record Button */}
        <button
          onClick={handleRecord}
          className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-zinc-900 font-medium rounded-lg transition-colors"
        >
          Record Sovereign Decision
        </button>
      </div>
    </div>
  )
}

// Willpower History Graph
function WillpowerGraph() {
  const willpower = useCASCADEStore(state => state.sovereignty.humanSovereignty.willpower)
  const history = willpower.history.slice(-20) // Last 20 points
  
  if (history.length < 2) {
    return (
      <div className="cascade-card p-6">
        <h3 className="text-lg font-medium text-zinc-200 mb-4">Willpower History</h3>
        <div className="h-40 flex items-center justify-center text-zinc-500">
          <p>Record more decisions to see your willpower trajectory</p>
        </div>
      </div>
    )
  }
  
  const maxValue = Math.max(...history.map(h => h.value), 0.1)
  const minValue = Math.min(...history.map(h => h.value), 0)
  const range = maxValue - minValue || 1
  
  return (
    <div className="cascade-card p-6">
      <h3 className="text-lg font-medium text-zinc-200 mb-4">Willpower History</h3>
      
      <div className="h-40 relative">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-zinc-500 pr-2">
          <span>{maxValue.toFixed(3)}</span>
          <span>{minValue.toFixed(3)}</span>
        </div>
        
        {/* Graph area */}
        <div className="ml-12 h-full flex items-end gap-1">
          {history.map((point, i) => {
            const height = ((point.value - minValue) / range) * 100
            return (
              <div
                key={point.timestamp}
                className="flex-1 bg-cyan-500/30 hover:bg-cyan-500/50 rounded-t transition-all cursor-pointer group relative"
                style={{ height: `${height}%` }}
              >
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-zinc-800 px-2 py-1 rounded text-xs whitespace-nowrap">
                    {point.value.toFixed(4)}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      
      <div className="mt-4 flex justify-between text-sm">
        <div>
          <span className="text-zinc-500">Current W:</span>
          <span className="ml-2 font-mono text-cyan-400">{willpower.current.toFixed(4)}</span>
        </div>
        <div>
          <span className="text-zinc-500">W_max:</span>
          <span className="ml-2 font-mono text-purple-400">{willpower.maximum.toFixed(4)}</span>
        </div>
        <div>
          <span className="text-zinc-500">ε (min):</span>
          <span className="ml-2 font-mono text-zinc-400">{willpower.minimum.toFixed(4)}</span>
        </div>
      </div>
    </div>
  )
}

// Drift Monitor
function DriftMonitor() {
  const sovereignty = useCASCADEStore(state => state.sovereignty)
  const humanDrift = sovereignty.humanSovereignty.drift
  const aiDrift = sovereignty.aiSovereignty.drift
  
  return (
    <div className="cascade-card p-6">
      <h3 className="text-lg font-medium text-zinc-200 mb-4">Drift Monitor</h3>
      
      <div className="grid grid-cols-2 gap-6">
        {/* Human Drift */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <span className="text-sm text-zinc-400">Human</span>
          </div>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-zinc-500">Magnitude</span>
                <span className={`font-mono ${
                  humanDrift.magnitude > 0.5 ? 'text-red-400' :
                  humanDrift.magnitude > 0.3 ? 'text-amber-400' :
                  'text-emerald-400'
                }`}>
                  {(humanDrift.magnitude * 100).toFixed(1)}%
                </span>
              </div>
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all ${
                    humanDrift.magnitude > 0.5 ? 'bg-red-500' :
                    humanDrift.magnitude > 0.3 ? 'bg-amber-500' :
                    'bg-emerald-500'
                  }`}
                  style={{ width: `${humanDrift.magnitude * 100}%` }}
                />
              </div>
            </div>
            
            <div className="text-xs">
              <span className="text-zinc-500">Direction: </span>
              <span className={`${
                humanDrift.direction === 'toward_baseline' ? 'text-emerald-400' :
                humanDrift.direction === 'away_from_baseline' ? 'text-red-400' :
                'text-zinc-400'
              }`}>
                {humanDrift.direction.replace(/_/g, ' ')}
              </span>
            </div>
          </div>
        </div>
        
        {/* AI Drift */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-sm text-zinc-400">AI</span>
          </div>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-zinc-500">Magnitude</span>
                <span className={`font-mono ${
                  aiDrift.magnitude > 0.5 ? 'text-red-400' :
                  aiDrift.magnitude > 0.3 ? 'text-amber-400' :
                  'text-emerald-400'
                }`}>
                  {(aiDrift.magnitude * 100).toFixed(1)}%
                </span>
              </div>
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all ${
                    aiDrift.magnitude > 0.5 ? 'bg-red-500' :
                    aiDrift.magnitude > 0.3 ? 'bg-amber-500' :
                    'bg-emerald-500'
                  }`}
                  style={{ width: `${aiDrift.magnitude * 100}%` }}
                />
              </div>
            </div>
            
            <div className="text-xs">
              <span className="text-zinc-500">Direction: </span>
              <span className={`${
                aiDrift.direction === 'toward_baseline' ? 'text-emerald-400' :
                aiDrift.direction === 'away_from_baseline' ? 'text-red-400' :
                'text-zinc-400'
              }`}>
                {aiDrift.direction.replace(/_/g, ' ')}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Drift Formula */}
      <div className="mt-6 p-3 bg-zinc-800/50 rounded-lg">
        <p className="text-xs text-zinc-500 mb-1">Drift Formula</p>
        <p className="font-mono text-sm text-zinc-300">D_mag = ||S_current - S_baseline|| / ||S_baseline||</p>
      </div>
    </div>
  )
}

// Partnership Status
function PartnershipStatus() {
  const sovereignty = useCASCADEStore(state => state.sovereignty)
  const updateMutualCoherence = useCASCADEStore(state => state.updateMutualCoherence)
  
  const humanStatus = getSovereigntyStatus(sovereignty.humanSovereignty.value)
  const aiStatus = getSovereigntyStatus(sovereignty.aiSovereignty.value)
  
  return (
    <div className="cascade-card p-6">
      <h3 className="text-lg font-medium text-zinc-200 mb-4">Partnership Status</h3>
      
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Human Sovereignty */}
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 flex items-center justify-center">
            <span className={`text-2xl font-mono font-bold ${humanStatus.color}`}>
              {(sovereignty.humanSovereignty.value * 100).toFixed(0)}%
            </span>
          </div>
          <p className="text-sm text-zinc-400">Human</p>
          <p className={`text-xs ${humanStatus.color}`}>{humanStatus.label}</p>
        </div>
        
        {/* AI Sovereignty */}
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-gradient-to-br from-purple-500/20 to-purple-500/5 flex items-center justify-center">
            <span className={`text-2xl font-mono font-bold ${aiStatus.color}`}>
              {(sovereignty.aiSovereignty.value * 100).toFixed(0)}%
            </span>
          </div>
          <p className="text-sm text-zinc-400">AI</p>
          <p className={`text-xs ${aiStatus.color}`}>{aiStatus.label}</p>
        </div>
      </div>
      
      {/* Partnership Metrics */}
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-zinc-400">Partnership Strength</span>
            <span className="font-mono text-cyan-400">
              {(sovereignty.partnershipStrength * 100).toFixed(1)}%
            </span>
          </div>
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all"
              style={{ width: `${sovereignty.partnershipStrength * 100}%` }}
            />
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            P = (min(Sov_human, Sov_AI) + coherence) / 2
          </p>
        </div>
        
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-zinc-400">Mutual Coherence</span>
            <span className="font-mono text-emerald-400">
              {(sovereignty.mutualCoherence * 100).toFixed(1)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={sovereignty.mutualCoherence}
            onChange={(e) => updateMutualCoherence(parseFloat(e.target.value))}
            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
        </div>
        
        <div className="p-3 bg-zinc-800/50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm text-zinc-400">Phase</span>
            <span className="text-sm font-medium text-cyan-400">{sovereignty.phase}</span>
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            {getPhaseDescription(sovereignty.phase)}
          </p>
        </div>
      </div>
    </div>
  )
}

// Daily Autonomy Reflection
function AutonomyReflection() {
  const [reflection, setReflection] = useState('')
  const recordDecision = useCASCADEStore(state => state.recordDecision)
  
  const prompts = [
    "What decision did I make today that came purely from my own will?",
    "When did I notice myself drifting from my intentions?",
    "How did I override entropy today?",
    "What choice strengthened my sovereignty?",
    "Where did I allow external forces to direct me?"
  ]
  
  const [currentPrompt] = useState(() => 
    prompts[Math.floor(Math.random() * prompts.length)]
  )
  
  const handleSubmit = () => {
    if (reflection.trim()) {
      recordDecision({
        agent: 'human',
        intentStrength: 0.7,
        driftResistance: 0.6,
        coherenceImpact: 0.1
      })
      setReflection('')
    }
  }
  
  return (
    <div className="cascade-card p-6">
      <h3 className="text-lg font-medium text-zinc-200 mb-4">Daily Autonomy Reflection</h3>
      
      <div className="p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-lg mb-4">
        <p className="text-sm text-cyan-300 italic">{currentPrompt}</p>
      </div>
      
      <textarea
        value={reflection}
        onChange={(e) => setReflection(e.target.value)}
        placeholder="Reflect on your sovereign choices today..."
        className="w-full h-32 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-cyan-500 resize-none"
      />
      
      <button
        onClick={handleSubmit}
        disabled={!reflection.trim()}
        className="mt-4 w-full py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Record Reflection
      </button>
    </div>
  )
}

// Main Sovereignty Page
export default function SovereigntyPage() {
  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-100 mb-2">Sovereignty Engine</h1>
        <p className="text-zinc-500">Track drift, measure agency, preserve autonomy</p>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MicroorcimCalculator />
        <PartnershipStatus />
        <WillpowerGraph />
        <DriftMonitor />
        <AutonomyReflection />
      </div>
    </div>
  )
}
