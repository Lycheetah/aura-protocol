'use client'

import { useState, useEffect } from 'react'

// Since we can't run actual agents in server components, we simulate the UI
// In a full implementation, this would connect to the agent manager

interface AgentStatus {
  type: string
  isRunning: boolean
  lastTick: number
  actionCount: number
  errorCount: number
}

interface AgentAction {
  id: string
  type: string
  title: string
  message: string
  priority: number
  source: string
  timestamp: number
  dismissed?: boolean
}

const MOCK_AGENTS: AgentStatus[] = [
  { type: 'SOVEREIGNTY_GUARDIAN', isRunning: true, lastTick: Date.now() - 15000, actionCount: 12, errorCount: 0 },
  { type: 'PHASE_ORACLE', isRunning: true, lastTick: Date.now() - 45000, actionCount: 3, errorCount: 0 },
  { type: 'PROACTIVE_ADVISOR', isRunning: true, lastTick: Date.now() - 180000, actionCount: 7, errorCount: 1 },
  { type: 'MICROORCIM_DETECTOR', isRunning: false, lastTick: 0, actionCount: 0, errorCount: 0 },
  { type: 'CASCADE_WATCHER', isRunning: false, lastTick: 0, actionCount: 0, errorCount: 0 },
  { type: 'MEMORY_CONSOLIDATOR', isRunning: false, lastTick: 0, actionCount: 0, errorCount: 0 },
]

const MOCK_ACTIONS: AgentAction[] = [
  {
    id: '1',
    type: 'SUGGESTION',
    title: '🧭 Phase Awareness',
    message: 'You are in the Light phase (✧). Focus on sharing wisdom and celebrating achievements.',
    priority: 2,
    source: 'PHASE_ORACLE',
    timestamp: Date.now() - 60000
  },
  {
    id: '2',
    type: 'NOTIFICATION',
    title: '✨ Insight',
    message: 'The invariant holds even when the surface changes. ⟟Ψ remains through all transformations.',
    priority: 3,
    source: 'PROACTIVE_ADVISOR',
    timestamp: Date.now() - 300000
  },
  {
    id: '3',
    type: 'SUGGESTION',
    title: '⚡ Microorcim Opportunity',
    message: 'Consider logging a microorcim for completing your morning routine despite resistance.',
    priority: 2,
    source: 'MICROORCIM_DETECTOR',
    timestamp: Date.now() - 3600000
  }
]

function AgentCard({ agent }: { agent: AgentStatus }) {
  const agentInfo: Record<string, { name: string; icon: string; description: string; color: string }> = {
    SOVEREIGNTY_GUARDIAN: {
      name: 'Sovereignty Guardian',
      icon: '🛡️',
      description: 'Monitors drift and sovereignty metrics',
      color: 'cyan'
    },
    PHASE_ORACLE: {
      name: 'Phase Oracle',
      icon: '🌙',
      description: 'Tracks 364-day cycle and phase transitions',
      color: 'purple'
    },
    PROACTIVE_ADVISOR: {
      name: 'Proactive Advisor',
      icon: '✨',
      description: 'Generates unsolicited insights and guidance',
      color: 'amber'
    },
    MICROORCIM_DETECTOR: {
      name: 'Microorcim Detector',
      icon: '⚡',
      description: 'Auto-detects agency events from behavior',
      color: 'emerald'
    },
    CASCADE_WATCHER: {
      name: 'Cascade Watcher',
      icon: '∇',
      description: 'Monitors knowledge for cascade triggers',
      color: 'blue'
    },
    MEMORY_CONSOLIDATOR: {
      name: 'Memory Consolidator',
      icon: '🧠',
      description: 'Compresses and organizes memories',
      color: 'pink'
    }
  }
  
  const info = agentInfo[agent.type] || { name: agent.type, icon: '🤖', description: '', color: 'zinc' }
  
  const timeSinceLastTick = agent.lastTick ? Math.floor((Date.now() - agent.lastTick) / 1000) : null
  
  return (
    <div className={`cascade-card p-4 ${agent.isRunning ? '' : 'opacity-60'}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{info.icon}</span>
          <div>
            <h4 className="font-medium text-zinc-200">{info.name}</h4>
            <p className="text-xs text-zinc-500">{info.description}</p>
          </div>
        </div>
        <div className={`w-3 h-3 rounded-full ${agent.isRunning ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-600'}`} />
      </div>
      
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="p-2 bg-zinc-800/50 rounded">
          <p className="text-xs text-zinc-500">Status</p>
          <p className={`text-sm font-medium ${agent.isRunning ? 'text-emerald-400' : 'text-zinc-500'}`}>
            {agent.isRunning ? 'Active' : 'Stopped'}
          </p>
        </div>
        <div className="p-2 bg-zinc-800/50 rounded">
          <p className="text-xs text-zinc-500">Actions</p>
          <p className="text-sm font-mono text-zinc-300">{agent.actionCount}</p>
        </div>
        <div className="p-2 bg-zinc-800/50 rounded">
          <p className="text-xs text-zinc-500">Last Tick</p>
          <p className="text-sm font-mono text-zinc-300">
            {timeSinceLastTick !== null ? `${timeSinceLastTick}s ago` : '-'}
          </p>
        </div>
      </div>
      
      {agent.errorCount > 0 && (
        <div className="mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded text-xs text-red-400">
          ⚠️ {agent.errorCount} error{agent.errorCount > 1 ? 's' : ''} logged
        </div>
      )}
    </div>
  )
}

function ActionCard({ action, onDismiss }: { action: AgentAction; onDismiss: () => void }) {
  const priorityColors = {
    0: 'border-red-500/30 bg-red-500/5',
    1: 'border-amber-500/30 bg-amber-500/5',
    2: 'border-cyan-500/30 bg-cyan-500/5',
    3: 'border-zinc-700 bg-zinc-800/50',
    4: 'border-zinc-800 bg-zinc-900/50'
  }
  
  const typeIcons = {
    NOTIFICATION: '📢',
    SUGGESTION: '💡',
    ALERT: '⚠️',
    AUTO_ACTION: '⚡',
    LOG: '📝'
  }
  
  const timeSince = Math.floor((Date.now() - action.timestamp) / 60000)
  const timeLabel = timeSince < 60 ? `${timeSince}m ago` : `${Math.floor(timeSince / 60)}h ago`
  
  if (action.dismissed) return null
  
  return (
    <div className={`p-4 rounded-lg border ${priorityColors[action.priority as keyof typeof priorityColors] || priorityColors[3]}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="text-xl mt-0.5">{typeIcons[action.type as keyof typeof typeIcons] || '📌'}</span>
          <div>
            <h4 className="font-medium text-zinc-200">{action.title}</h4>
            <p className="text-sm text-zinc-400 mt-1">{action.message}</p>
            <div className="flex items-center gap-3 mt-2 text-xs text-zinc-500">
              <span>From: {action.source}</span>
              <span>•</span>
              <span>{timeLabel}</span>
            </div>
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<AgentStatus[]>(MOCK_AGENTS)
  const [actions, setActions] = useState<AgentAction[]>(MOCK_ACTIONS)
  const [agentsEnabled, setAgentsEnabled] = useState(true)
  
  // Simulate agent tick updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(prev => prev.map(agent => ({
        ...agent,
        lastTick: agent.isRunning ? Date.now() : agent.lastTick
      })))
    }, 5000)
    
    return () => clearInterval(interval)
  }, [])
  
  const dismissAction = (actionId: string) => {
    setActions(prev => prev.map(a => 
      a.id === actionId ? { ...a, dismissed: true } : a
    ))
  }
  
  const toggleAgents = () => {
    setAgentsEnabled(!agentsEnabled)
    setAgents(prev => prev.map(agent => ({
      ...agent,
      isRunning: !agentsEnabled ? (agent.type === 'SOVEREIGNTY_GUARDIAN' || agent.type === 'PHASE_ORACLE' || agent.type === 'PROACTIVE_ADVISOR') : false
    })))
  }
  
  const activeAgents = agents.filter(a => a.isRunning).length
  const totalActions = agents.reduce((sum, a) => sum + a.actionCount, 0)
  const pendingActions = actions.filter(a => !a.dismissed).length
  
  return (
    <div className="p-8">
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-zinc-100 mb-2">Autonomous Agents</h1>
            <p className="text-zinc-500">The living nervous system of CASCADE OS</p>
          </div>
          <button
            onClick={toggleAgents}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              agentsEnabled 
                ? 'bg-emerald-500 hover:bg-emerald-400 text-zinc-900' 
                : 'bg-zinc-700 hover:bg-zinc-600 text-zinc-300'
            }`}
          >
            {agentsEnabled ? '⏸️ Pause All' : '▶️ Start All'}
          </button>
        </div>
      </header>
      
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="cascade-card p-4 text-center">
          <p className="text-xs text-zinc-500">Active Agents</p>
          <p className="text-3xl font-bold text-emerald-400">{activeAgents}</p>
          <p className="text-xs text-zinc-600">of {agents.length}</p>
        </div>
        <div className="cascade-card p-4 text-center">
          <p className="text-xs text-zinc-500">Total Actions</p>
          <p className="text-3xl font-bold text-cyan-400">{totalActions}</p>
          <p className="text-xs text-zinc-600">generated</p>
        </div>
        <div className="cascade-card p-4 text-center">
          <p className="text-xs text-zinc-500">Pending</p>
          <p className="text-3xl font-bold text-amber-400">{pendingActions}</p>
          <p className="text-xs text-zinc-600">actions</p>
        </div>
        <div className="cascade-card p-4 text-center">
          <p className="text-xs text-zinc-500">System Status</p>
          <p className={`text-lg font-bold ${agentsEnabled ? 'text-emerald-400' : 'text-zinc-500'}`}>
            {agentsEnabled ? '✓ ACTIVE' : '⏸ PAUSED'}
          </p>
          <p className="text-xs text-zinc-600">nervous system</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Agents Grid */}
        <div>
          <h2 className="text-xl font-semibold text-zinc-200 mb-4">Agent Status</h2>
          <div className="space-y-4">
            {agents.map(agent => (
              <AgentCard key={agent.type} agent={agent} />
            ))}
          </div>
        </div>
        
        {/* Actions Feed */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-zinc-200">Action Feed</h2>
            <button
              onClick={() => setActions(prev => prev.map(a => ({ ...a, dismissed: true })))}
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Dismiss All
            </button>
          </div>
          
          {actions.filter(a => !a.dismissed).length === 0 ? (
            <div className="cascade-card p-8 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-zinc-800 flex items-center justify-center">
                <span className="text-2xl">✨</span>
              </div>
              <p className="text-zinc-400">No pending actions</p>
              <p className="text-xs text-zinc-600 mt-1">Agents will generate insights as needed</p>
            </div>
          ) : (
            <div className="space-y-3">
              {actions.map(action => (
                <ActionCard 
                  key={action.id} 
                  action={action} 
                  onDismiss={() => dismissAction(action.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* How It Works */}
      <div className="mt-8 cascade-card p-6">
        <h3 className="text-lg font-medium text-zinc-200 mb-4">How Autonomous Agents Work</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div>
            <h4 className="font-medium text-cyan-400 mb-2">🔄 Continuous Monitoring</h4>
            <p className="text-zinc-400">
              Agents run in the background, checking your state at regular intervals. 
              They don't wait for you to ask — they proactively watch for opportunities and concerns.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-purple-400 mb-2">🎯 Event-Driven Actions</h4>
            <p className="text-zinc-400">
              When agents detect significant events (drift, phase transitions, patterns), 
              they generate actions that appear in your feed. You remain in control.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-emerald-400 mb-2">🤝 Sovereignty Preserved</h4>
            <p className="text-zinc-400">
              Agents suggest, never impose. They're designed to support your autonomy, 
              not replace your judgment. The AURA protocol ensures alignment.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
