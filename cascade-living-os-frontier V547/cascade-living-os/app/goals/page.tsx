'use client'

import { useState, useEffect } from 'react'

// ============================================================================
// TYPES
// ============================================================================

type GoalStatus = 'active' | 'completed' | 'paused' | 'abandoned'
type GoalTimeframe = 'phase' | 'quarter' | 'year' | 'lifetime'

interface Milestone {
  id: string
  title: string
  completed: boolean
  completedAt?: number
  order: number
}

interface Goal {
  id: string
  title: string
  description: string
  why: string // Core motivation
  timeframe: GoalTimeframe
  status: GoalStatus
  milestones: Milestone[]
  lamague: string
  targetPhase?: number // Complete by this phase
  createdAt: number
  completedAt?: number
  microorcimsFired: number
  reflections: string[]
}

// ============================================================================
// GOAL CARD
// ============================================================================

function GoalCard({ 
  goal, 
  onUpdate,
  onSelect
}: { 
  goal: Goal
  onUpdate: (updates: Partial<Goal>) => void
  onSelect: () => void
}) {
  const completedMilestones = goal.milestones.filter(m => m.completed).length
  const progress = goal.milestones.length > 0 
    ? (completedMilestones / goal.milestones.length) * 100 
    : 0
  
  const statusColors = {
    active: 'border-cyan-500/30 bg-cyan-500/5',
    completed: 'border-emerald-500/30 bg-emerald-500/5',
    paused: 'border-amber-500/30 bg-amber-500/5',
    abandoned: 'border-zinc-600 bg-zinc-800/30 opacity-60'
  }
  
  const statusLabels = {
    active: '🔥 Active',
    completed: '✓ Complete',
    paused: '⏸ Paused',
    abandoned: '✗ Abandoned'
  }
  
  const timeframeLabels = {
    phase: '52 days',
    quarter: '91 days',
    year: '364 days',
    lifetime: '∞'
  }
  
  return (
    <div 
      className={`p-5 rounded-xl border cursor-pointer transition-all hover:scale-[1.01] ${statusColors[goal.status]}`}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl font-mono text-purple-400">{goal.lamague}</span>
            <h3 className="text-lg font-medium text-zinc-200">{goal.title}</h3>
          </div>
          <p className="text-sm text-zinc-500">{goal.description}</p>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${
          goal.status === 'active' ? 'bg-cyan-500/20 text-cyan-400' :
          goal.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
          goal.status === 'paused' ? 'bg-amber-500/20 text-amber-400' :
          'bg-zinc-700 text-zinc-500'
        }`}>
          {statusLabels[goal.status]}
        </span>
      </div>
      
      {/* Why - Core Motivation */}
      <div className="mb-4 p-3 bg-zinc-800/50 rounded-lg">
        <p className="text-xs text-zinc-500 mb-1">Why this matters:</p>
        <p className="text-sm text-zinc-300 italic">"{goal.why}"</p>
      </div>
      
      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-zinc-500">{completedMilestones} / {goal.milestones.length} milestones</span>
          <span className="text-zinc-400">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all ${
              goal.status === 'completed' ? 'bg-emerald-500' : 'bg-gradient-to-r from-cyan-500 to-purple-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      
      {/* Milestones Preview */}
      {goal.milestones.length > 0 && (
        <div className="flex items-center gap-1 mb-3">
          {goal.milestones.slice(0, 7).map((m, i) => (
            <div
              key={m.id}
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                m.completed 
                  ? 'bg-emerald-500/30 text-emerald-400' 
                  : 'bg-zinc-800 text-zinc-600'
              }`}
            >
              {m.completed ? '✓' : i + 1}
            </div>
          ))}
          {goal.milestones.length > 7 && (
            <span className="text-xs text-zinc-500">+{goal.milestones.length - 7}</span>
          )}
        </div>
      )}
      
      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-zinc-500">
        <span>{timeframeLabels[goal.timeframe]} timeframe</span>
        <span>{goal.microorcimsFired} μ fired</span>
      </div>
    </div>
  )
}

// ============================================================================
// GOAL DETAIL PANEL
// ============================================================================

function GoalDetail({ 
  goal, 
  onUpdate,
  onClose
}: { 
  goal: Goal
  onUpdate: (updates: Partial<Goal>) => void
  onClose: () => void
}) {
  const [newMilestone, setNewMilestone] = useState('')
  const [newReflection, setNewReflection] = useState('')
  
  const toggleMilestone = (milestoneId: string) => {
    const updated = goal.milestones.map(m => 
      m.id === milestoneId 
        ? { ...m, completed: !m.completed, completedAt: !m.completed ? Date.now() : undefined }
        : m
    )
    
    // Fire microorcim if completing
    const milestone = goal.milestones.find(m => m.id === milestoneId)
    const firingMicroorcim = milestone && !milestone.completed
    
    onUpdate({ 
      milestones: updated,
      microorcimsFired: firingMicroorcim ? goal.microorcimsFired + 1 : goal.microorcimsFired
    })
  }
  
  const addMilestone = () => {
    if (!newMilestone.trim()) return
    
    const milestone: Milestone = {
      id: `ms-${Date.now()}`,
      title: newMilestone.trim(),
      completed: false,
      order: goal.milestones.length
    }
    
    onUpdate({ milestones: [...goal.milestones, milestone] })
    setNewMilestone('')
  }
  
  const addReflection = () => {
    if (!newReflection.trim()) return
    onUpdate({ reflections: [...goal.reflections, newReflection.trim()] })
    setNewReflection('')
  }
  
  const completedMilestones = goal.milestones.filter(m => m.completed).length
  const progress = goal.milestones.length > 0 
    ? (completedMilestones / goal.milestones.length) * 100 
    : 0
  
  return (
    <div className="cascade-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-mono text-purple-400">{goal.lamague}</span>
          <h2 className="text-xl font-medium text-zinc-200">{goal.title}</h2>
        </div>
        <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* Why */}
      <div className="mb-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
        <p className="text-xs text-purple-400 mb-1">Core Motivation</p>
        <p className="text-zinc-200">"{goal.why}"</p>
      </div>
      
      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-zinc-400">Overall Progress</span>
          <span className="text-lg font-bold text-cyan-400">{Math.round(progress)}%</span>
        </div>
        <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      
      {/* Status Controls */}
      <div className="mb-6">
        <p className="text-sm text-zinc-500 mb-2">Status</p>
        <div className="flex gap-2">
          {(['active', 'paused', 'completed', 'abandoned'] as GoalStatus[]).map((status) => (
            <button
              key={status}
              onClick={() => onUpdate({ 
                status, 
                completedAt: status === 'completed' ? Date.now() : undefined 
              })}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                goal.status === status
                  ? status === 'active' ? 'bg-cyan-500/30 text-cyan-300' :
                    status === 'completed' ? 'bg-emerald-500/30 text-emerald-300' :
                    status === 'paused' ? 'bg-amber-500/30 text-amber-300' :
                    'bg-zinc-600 text-zinc-300'
                  : 'bg-zinc-800 text-zinc-500 hover:bg-zinc-700'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>
      
      {/* Milestones */}
      <div className="mb-6">
        <p className="text-sm text-zinc-500 mb-3">Milestones ({completedMilestones}/{goal.milestones.length})</p>
        
        <div className="space-y-2 mb-3">
          {goal.milestones.map((milestone, i) => (
            <div
              key={milestone.id}
              onClick={() => toggleMilestone(milestone.id)}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                milestone.completed 
                  ? 'bg-emerald-500/10 border border-emerald-500/20' 
                  : 'bg-zinc-800 border border-zinc-700 hover:border-zinc-600'
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border ${
                milestone.completed 
                  ? 'bg-emerald-500/30 border-emerald-500 text-emerald-400' 
                  : 'border-zinc-600 text-zinc-500'
              }`}>
                {milestone.completed ? '✓' : i + 1}
              </div>
              <span className={milestone.completed ? 'text-zinc-400 line-through' : 'text-zinc-200'}>
                {milestone.title}
              </span>
              {milestone.completed && (
                <span className="ml-auto text-xs text-emerald-400">+μ</span>
              )}
            </div>
          ))}
        </div>
        
        {/* Add Milestone */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newMilestone}
            onChange={(e) => setNewMilestone(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addMilestone()}
            placeholder="Add milestone..."
            className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-cyan-500"
          />
          <button
            onClick={addMilestone}
            disabled={!newMilestone.trim()}
            className="px-4 py-2 bg-cyan-500 text-zinc-900 rounded-lg text-sm font-medium hover:bg-cyan-400 disabled:opacity-50"
          >
            Add
          </button>
        </div>
      </div>
      
      {/* Reflections */}
      <div>
        <p className="text-sm text-zinc-500 mb-3">Reflections</p>
        
        {goal.reflections.length > 0 && (
          <div className="space-y-2 mb-3 max-h-32 overflow-y-auto">
            {goal.reflections.map((reflection, i) => (
              <p key={i} className="text-sm text-zinc-400 p-2 bg-zinc-800/50 rounded">
                "{reflection}"
              </p>
            ))}
          </div>
        )}
        
        <div className="flex gap-2">
          <input
            type="text"
            value={newReflection}
            onChange={(e) => setNewReflection(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addReflection()}
            placeholder="Add reflection..."
            className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-purple-500"
          />
          <button
            onClick={addReflection}
            disabled={!newReflection.trim()}
            className="px-4 py-2 bg-purple-500 text-zinc-900 rounded-lg text-sm font-medium hover:bg-purple-400 disabled:opacity-50"
          >
            Add
          </button>
        </div>
      </div>
      
      {/* Stats */}
      <div className="mt-6 pt-6 border-t border-zinc-800 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-xl font-bold text-cyan-400">{goal.microorcimsFired}</p>
          <p className="text-xs text-zinc-500">μ Fired</p>
        </div>
        <div>
          <p className="text-xl font-bold text-purple-400">{goal.reflections.length}</p>
          <p className="text-xs text-zinc-500">Reflections</p>
        </div>
        <div>
          <p className="text-xl font-bold text-zinc-400">
            {Math.floor((Date.now() - goal.createdAt) / (1000 * 60 * 60 * 24))}
          </p>
          <p className="text-xs text-zinc-500">Days Active</p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// CREATE GOAL FORM
// ============================================================================

function CreateGoalForm({ 
  onSave, 
  onCancel 
}: { 
  onSave: (goal: Partial<Goal>) => void
  onCancel: () => void
}) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [why, setWhy] = useState('')
  const [timeframe, setTimeframe] = useState<GoalTimeframe>('quarter')
  const [lamague, setLamague] = useState('Φ↑')
  
  const lamagueOptions = ['⟟', '≋', 'Ψ', 'Φ↑', '✧', '∥◁▷∥', '⟲']
  
  return (
    <div className="cascade-card p-6">
      <h3 className="text-lg font-medium text-zinc-200 mb-4">Create New Goal</h3>
      
      <div className="space-y-4">
        <div>
          <label className="text-sm text-zinc-500 block mb-1">Goal Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What do you want to achieve?"
            className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 focus:outline-none focus:border-cyan-500"
          />
        </div>
        
        <div>
          <label className="text-sm text-zinc-500 block mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the goal in more detail..."
            rows={2}
            className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 focus:outline-none focus:border-cyan-500 resize-none"
          />
        </div>
        
        <div>
          <label className="text-sm text-zinc-500 block mb-1">Why This Matters (Core Motivation)</label>
          <textarea
            value={why}
            onChange={(e) => setWhy(e.target.value)}
            placeholder="Why is this goal important to you?"
            rows={2}
            className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 focus:outline-none focus:border-purple-500 resize-none"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-zinc-500 block mb-1">Timeframe</label>
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value as GoalTimeframe)}
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="phase">Phase (52 days)</option>
              <option value="quarter">Quarter (91 days)</option>
              <option value="year">Year (364 days)</option>
              <option value="lifetime">Lifetime</option>
            </select>
          </div>
          
          <div>
            <label className="text-sm text-zinc-500 block mb-1">LAMAGUE Symbol</label>
            <div className="flex gap-1">
              {lamagueOptions.map((sym) => (
                <button
                  key={sym}
                  onClick={() => setLamague(sym)}
                  className={`flex-1 py-2 rounded text-lg font-mono transition-colors ${
                    lamague === sym
                      ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                      : 'bg-zinc-800 text-zinc-500 border border-zinc-700 hover:bg-zinc-700'
                  }`}
                >
                  {sym}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex gap-3 pt-4">
          <button
            onClick={onCancel}
            className="flex-1 py-2 bg-zinc-800 text-zinc-400 rounded-lg hover:bg-zinc-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave({
              title,
              description,
              why,
              timeframe,
              lamague,
              status: 'active',
              milestones: [],
              reflections: [],
              microorcimsFired: 0
            })}
            disabled={!title.trim() || !why.trim()}
            className="flex-1 py-2 bg-cyan-500 text-zinc-900 font-medium rounded-lg hover:bg-cyan-400 transition-colors disabled:opacity-50"
          >
            Create Goal
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)
  const [filter, setFilter] = useState<GoalStatus | 'all'>('all')
  
  // Load from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cascade-goals')
      if (saved) {
        setGoals(JSON.parse(saved))
      }
    }
  }, [])
  
  // Save to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cascade-goals', JSON.stringify(goals))
    }
  }, [goals])
  
  const handleSaveGoal = (data: Partial<Goal>) => {
    const newGoal: Goal = {
      ...data as Omit<Goal, 'id' | 'createdAt'>,
      id: `goal-${Date.now()}`,
      createdAt: Date.now()
    }
    setGoals(prev => [...prev, newGoal])
    setShowCreateForm(false)
  }
  
  const handleUpdateGoal = (goalId: string, updates: Partial<Goal>) => {
    setGoals(prev => prev.map(g => 
      g.id === goalId ? { ...g, ...updates } : g
    ))
    if (selectedGoal?.id === goalId) {
      setSelectedGoal(prev => prev ? { ...prev, ...updates } : null)
    }
  }
  
  const filteredGoals = filter === 'all' 
    ? goals 
    : goals.filter(g => g.status === filter)
  
  // Stats
  const activeGoals = goals.filter(g => g.status === 'active').length
  const completedGoals = goals.filter(g => g.status === 'completed').length
  const totalMilestones = goals.reduce((sum, g) => sum + g.milestones.length, 0)
  const completedMilestones = goals.reduce((sum, g) => sum + g.milestones.filter(m => m.completed).length, 0)
  
  return (
    <div className="p-8">
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-zinc-100 mb-2">Goals</h1>
            <p className="text-zinc-500">Long-term objectives with milestone tracking</p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-zinc-900 font-medium rounded-lg transition-colors"
          >
            + New Goal
          </button>
        </div>
      </header>
      
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="cascade-card p-4 text-center">
          <p className="text-3xl font-bold text-cyan-400">{activeGoals}</p>
          <p className="text-xs text-zinc-500">Active Goals</p>
        </div>
        <div className="cascade-card p-4 text-center">
          <p className="text-3xl font-bold text-emerald-400">{completedGoals}</p>
          <p className="text-xs text-zinc-500">Completed</p>
        </div>
        <div className="cascade-card p-4 text-center">
          <p className="text-3xl font-bold text-purple-400">{completedMilestones}/{totalMilestones}</p>
          <p className="text-xs text-zinc-500">Milestones</p>
        </div>
        <div className="cascade-card p-4 text-center">
          <p className="text-3xl font-bold text-amber-400">
            {goals.reduce((sum, g) => sum + g.microorcimsFired, 0)}
          </p>
          <p className="text-xs text-zinc-500">μ from Goals</p>
        </div>
      </div>
      
      {/* Filter */}
      <div className="flex items-center gap-2 mb-6">
        {(['all', 'active', 'completed', 'paused', 'abandoned'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              filter === status
                ? 'bg-cyan-500/20 text-cyan-400'
                : 'bg-zinc-800 text-zinc-500 hover:bg-zinc-700'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Goals Grid */}
        <div className="space-y-4">
          {showCreateForm ? (
            <CreateGoalForm
              onSave={handleSaveGoal}
              onCancel={() => setShowCreateForm(false)}
            />
          ) : filteredGoals.length === 0 ? (
            <div className="cascade-card p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-800 flex items-center justify-center">
                <span className="text-3xl">🎯</span>
              </div>
              <p className="text-zinc-400 mb-2">No goals yet</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="text-cyan-400 hover:text-cyan-300 text-sm"
              >
                Create your first goal →
              </button>
            </div>
          ) : (
            filteredGoals.map(goal => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onUpdate={(updates) => handleUpdateGoal(goal.id, updates)}
                onSelect={() => setSelectedGoal(goal)}
              />
            ))
          )}
        </div>
        
        {/* Detail Panel */}
        <div>
          {selectedGoal ? (
            <GoalDetail
              goal={selectedGoal}
              onUpdate={(updates) => handleUpdateGoal(selectedGoal.id, updates)}
              onClose={() => setSelectedGoal(null)}
            />
          ) : (
            <div className="cascade-card p-6">
              <h3 className="text-lg font-medium text-zinc-200 mb-4">Goal Philosophy</h3>
              <div className="space-y-4 text-sm text-zinc-400">
                <p>
                  Goals are <span className="text-purple-400">containers for intention</span>. 
                  They give shape to your future self.
                </p>
                <p>
                  The <span className="text-cyan-400">"Why"</span> is crucial — it's the fuel 
                  that sustains you when motivation fades.
                </p>
                <p>
                  Milestones break the journey into <span className="text-emerald-400">microorcim opportunities</span>. 
                  Each completed milestone fires μ.
                </p>
                <div className="p-3 bg-purple-500/10 rounded-lg">
                  <p className="font-mono text-purple-400 text-xs">
                    Goal = Why × Milestones × Time
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
