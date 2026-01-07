'use client'

import { useState, useEffect } from 'react'

// ============================================================================
// TYPES
// ============================================================================

type RitualFrequency = 'daily' | 'weekly' | 'phase' | 'custom'
type RitualCategory = 'body' | 'mind' | 'spirit' | 'work' | 'relationship'

interface Ritual {
  id: string
  name: string
  description: string
  frequency: RitualFrequency
  category: RitualCategory
  lamague: string
  targetCount: number // per period
  currentStreak: number
  bestStreak: number
  completions: RitualCompletion[]
  createdAt: number
  active: boolean
  microorcimOnComplete: boolean
}

interface RitualCompletion {
  id: string
  ritualId: string
  timestamp: number
  note?: string
  quality: 1 | 2 | 3 | 4 | 5
}

// ============================================================================
// DEFAULT RITUALS
// ============================================================================

const DEFAULT_RITUALS: Omit<Ritual, 'id' | 'currentStreak' | 'bestStreak' | 'completions' | 'createdAt'>[] = [
  {
    name: 'Morning Centering',
    description: 'Return to your invariant before the day begins',
    frequency: 'daily',
    category: 'spirit',
    lamague: '⟟',
    targetCount: 1,
    active: true,
    microorcimOnComplete: true
  },
  {
    name: 'Movement Practice',
    description: 'Physical activity that honors the body',
    frequency: 'daily',
    category: 'body',
    lamague: 'Φ↑',
    targetCount: 1,
    active: true,
    microorcimOnComplete: true
  },
  {
    name: 'Deep Work Block',
    description: '90+ minutes of focused, uninterrupted work',
    frequency: 'daily',
    category: 'work',
    lamague: '≋',
    targetCount: 1,
    active: true,
    microorcimOnComplete: true
  },
  {
    name: 'Evening Reflection',
    description: 'Journal or contemplate the day',
    frequency: 'daily',
    category: 'mind',
    lamague: 'Ψ',
    targetCount: 1,
    active: true,
    microorcimOnComplete: false
  },
  {
    name: 'Weekly Review',
    description: 'Assess progress, plan ahead, recalibrate',
    frequency: 'weekly',
    category: 'mind',
    lamague: '⟲',
    targetCount: 1,
    active: true,
    microorcimOnComplete: true
  },
  {
    name: 'Connection Practice',
    description: 'Meaningful interaction with someone important',
    frequency: 'weekly',
    category: 'relationship',
    lamague: '✧',
    targetCount: 3,
    active: true,
    microorcimOnComplete: false
  }
]

// ============================================================================
// RITUAL CARD
// ============================================================================

function RitualCard({ 
  ritual, 
  todayCompletions,
  onComplete,
  onEdit
}: { 
  ritual: Ritual
  todayCompletions: number
  onComplete: () => void
  onEdit: () => void
}) {
  const categoryColors: Record<RitualCategory, string> = {
    body: 'border-emerald-500/30 bg-emerald-500/5',
    mind: 'border-cyan-500/30 bg-cyan-500/5',
    spirit: 'border-purple-500/30 bg-purple-500/5',
    work: 'border-amber-500/30 bg-amber-500/5',
    relationship: 'border-pink-500/30 bg-pink-500/5'
  }
  
  const categoryIcons: Record<RitualCategory, string> = {
    body: '💪',
    mind: '🧠',
    spirit: '✨',
    work: '⚡',
    relationship: '💜'
  }
  
  const isComplete = todayCompletions >= ritual.targetCount
  const progress = Math.min(todayCompletions / ritual.targetCount, 1)
  
  return (
    <div className={`p-4 rounded-lg border transition-all ${categoryColors[ritual.category]} ${!ritual.active ? 'opacity-50' : ''}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{categoryIcons[ritual.category]}</span>
          <div>
            <h3 className="font-medium text-zinc-200">{ritual.name}</h3>
            <p className="text-xs text-zinc-500">{ritual.description}</p>
          </div>
        </div>
        <span className="text-lg font-mono text-purple-400">{ritual.lamague}</span>
      </div>
      
      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-zinc-500">{todayCompletions} / {ritual.targetCount} today</span>
          <span className={isComplete ? 'text-emerald-400' : 'text-zinc-500'}>
            {isComplete ? '✓ Complete' : `${Math.round(progress * 100)}%`}
          </span>
        </div>
        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all ${isComplete ? 'bg-emerald-500' : 'bg-gradient-to-r from-cyan-500 to-purple-500'}`}
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>
      
      {/* Stats & Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs text-zinc-500">
          <span>🔥 {ritual.currentStreak} streak</span>
          <span>🏆 {ritual.bestStreak} best</span>
          {ritual.microorcimOnComplete && <span className="text-cyan-400">+μ</span>}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            className="p-2 text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={onComplete}
            disabled={isComplete}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              isComplete
                ? 'bg-emerald-500/20 text-emerald-400 cursor-default'
                : 'bg-cyan-500 hover:bg-cyan-400 text-zinc-900'
            }`}
          >
            {isComplete ? 'Done ✓' : 'Complete'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// CREATE RITUAL FORM
// ============================================================================

function CreateRitualForm({ 
  onSave, 
  onCancel,
  editRitual
}: { 
  onSave: (ritual: Partial<Ritual>) => void
  onCancel: () => void
  editRitual?: Ritual
}) {
  const [name, setName] = useState(editRitual?.name || '')
  const [description, setDescription] = useState(editRitual?.description || '')
  const [frequency, setFrequency] = useState<RitualFrequency>(editRitual?.frequency || 'daily')
  const [category, setCategory] = useState<RitualCategory>(editRitual?.category || 'mind')
  const [lamague, setLamague] = useState(editRitual?.lamague || '⟟')
  const [targetCount, setTargetCount] = useState(editRitual?.targetCount || 1)
  const [microorcimOnComplete, setMicroorcimOnComplete] = useState(editRitual?.microorcimOnComplete ?? true)
  
  const lamagueOptions = ['⟟', '≋', 'Ψ', 'Φ↑', '✧', '∥◁▷∥', '⟲']
  
  return (
    <div className="cascade-card p-6">
      <h3 className="text-lg font-medium text-zinc-200 mb-4">
        {editRitual ? 'Edit Ritual' : 'Create New Ritual'}
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="text-sm text-zinc-500 block mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Morning meditation"
            className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 focus:outline-none focus:border-cyan-500"
          />
        </div>
        
        <div>
          <label className="text-sm text-zinc-500 block mb-1">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description"
            className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 focus:outline-none focus:border-cyan-500"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-zinc-500 block mb-1">Frequency</label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as RitualFrequency)}
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="phase">Per Phase (52 days)</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          
          <div>
            <label className="text-sm text-zinc-500 block mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as RitualCategory)}
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="body">Body 💪</option>
              <option value="mind">Mind 🧠</option>
              <option value="spirit">Spirit ✨</option>
              <option value="work">Work ⚡</option>
              <option value="relationship">Relationship 💜</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-zinc-500 block mb-1">Target Count</label>
            <input
              type="number"
              value={targetCount}
              onChange={(e) => setTargetCount(parseInt(e.target.value) || 1)}
              min="1"
              max="10"
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 focus:outline-none focus:border-cyan-500"
            />
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
        
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="microorcim"
            checked={microorcimOnComplete}
            onChange={(e) => setMicroorcimOnComplete(e.target.checked)}
            className="w-4 h-4 rounded bg-zinc-800 border-zinc-700 text-cyan-500 focus:ring-cyan-500"
          />
          <label htmlFor="microorcim" className="text-sm text-zinc-400">
            Fire microorcim (μ) on completion
          </label>
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
              name,
              description,
              frequency,
              category,
              lamague,
              targetCount,
              microorcimOnComplete,
              active: true
            })}
            disabled={!name.trim()}
            className="flex-1 py-2 bg-cyan-500 text-zinc-900 font-medium rounded-lg hover:bg-cyan-400 transition-colors disabled:opacity-50"
          >
            {editRitual ? 'Save Changes' : 'Create Ritual'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function RitualsPage() {
  const [rituals, setRituals] = useState<Ritual[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingRitual, setEditingRitual] = useState<Ritual | null>(null)
  const [filter, setFilter] = useState<RitualCategory | 'all'>('all')
  
  // Load from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cascade-rituals')
      if (saved) {
        setRituals(JSON.parse(saved))
      } else {
        // Initialize with defaults
        const initial = DEFAULT_RITUALS.map((r, i) => ({
          ...r,
          id: `ritual-${i}`,
          currentStreak: 0,
          bestStreak: 0,
          completions: [],
          createdAt: Date.now()
        }))
        setRituals(initial)
      }
    }
  }, [])
  
  // Save to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && rituals.length > 0) {
      localStorage.setItem('cascade-rituals', JSON.stringify(rituals))
    }
  }, [rituals])
  
  const getTodayCompletions = (ritual: Ritual): number => {
    const today = new Date().toDateString()
    return ritual.completions.filter(c => 
      new Date(c.timestamp).toDateString() === today
    ).length
  }
  
  const handleComplete = (ritualId: string) => {
    setRituals(prev => prev.map(r => {
      if (r.id !== ritualId) return r
      
      const completion: RitualCompletion = {
        id: `comp-${Date.now()}`,
        ritualId,
        timestamp: Date.now(),
        quality: 3
      }
      
      const todayCount = getTodayCompletions(r) + 1
      const wasIncomplete = getTodayCompletions(r) < r.targetCount
      const nowComplete = todayCount >= r.targetCount
      
      return {
        ...r,
        completions: [...r.completions, completion],
        currentStreak: wasIncomplete && nowComplete ? r.currentStreak + 1 : r.currentStreak,
        bestStreak: Math.max(r.bestStreak, wasIncomplete && nowComplete ? r.currentStreak + 1 : r.currentStreak)
      }
    }))
  }
  
  const handleSaveRitual = (data: Partial<Ritual>) => {
    if (editingRitual) {
      setRituals(prev => prev.map(r => 
        r.id === editingRitual.id ? { ...r, ...data } : r
      ))
    } else {
      const newRitual: Ritual = {
        ...data as Omit<Ritual, 'id' | 'currentStreak' | 'bestStreak' | 'completions' | 'createdAt'>,
        id: `ritual-${Date.now()}`,
        currentStreak: 0,
        bestStreak: 0,
        completions: [],
        createdAt: Date.now()
      }
      setRituals(prev => [...prev, newRitual])
    }
    setShowCreateForm(false)
    setEditingRitual(null)
  }
  
  const filteredRituals = filter === 'all' 
    ? rituals 
    : rituals.filter(r => r.category === filter)
  
  // Stats
  const totalCompletionsToday = rituals.reduce((sum, r) => sum + getTodayCompletions(r), 0)
  const totalTargetsToday = rituals.filter(r => r.active && r.frequency === 'daily').reduce((sum, r) => sum + r.targetCount, 0)
  const completedRitualsToday = rituals.filter(r => r.active && getTodayCompletions(r) >= r.targetCount).length
  const activeRituals = rituals.filter(r => r.active).length
  
  return (
    <div className="p-8">
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-zinc-100 mb-2">Rituals</h1>
            <p className="text-zinc-500">Recurring practices that build sovereignty</p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-zinc-900 font-medium rounded-lg transition-colors"
          >
            + New Ritual
          </button>
        </div>
      </header>
      
      {/* Today's Progress */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="cascade-card p-4 text-center">
          <p className="text-3xl font-bold text-cyan-400">{totalCompletionsToday}</p>
          <p className="text-xs text-zinc-500">Completions Today</p>
        </div>
        <div className="cascade-card p-4 text-center">
          <p className="text-3xl font-bold text-purple-400">{completedRitualsToday}/{activeRituals}</p>
          <p className="text-xs text-zinc-500">Rituals Complete</p>
        </div>
        <div className="cascade-card p-4 text-center">
          <p className="text-3xl font-bold text-emerald-400">
            {totalTargetsToday > 0 ? Math.round((totalCompletionsToday / totalTargetsToday) * 100) : 0}%
          </p>
          <p className="text-xs text-zinc-500">Daily Progress</p>
        </div>
        <div className="cascade-card p-4 text-center">
          <p className="text-3xl font-bold text-amber-400">
            {Math.max(...rituals.map(r => r.currentStreak), 0)}
          </p>
          <p className="text-xs text-zinc-500">Best Active Streak</p>
        </div>
      </div>
      
      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6">
        {(['all', 'body', 'mind', 'spirit', 'work', 'relationship'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              filter === cat
                ? 'bg-cyan-500/20 text-cyan-400'
                : 'bg-zinc-800 text-zinc-500 hover:bg-zinc-700'
            }`}
          >
            {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rituals List */}
        <div className="lg:col-span-2 space-y-4">
          {showCreateForm || editingRitual ? (
            <CreateRitualForm
              onSave={handleSaveRitual}
              onCancel={() => {
                setShowCreateForm(false)
                setEditingRitual(null)
              }}
              editRitual={editingRitual || undefined}
            />
          ) : filteredRituals.length === 0 ? (
            <div className="cascade-card p-8 text-center">
              <p className="text-zinc-500">No rituals in this category</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="mt-4 text-cyan-400 hover:text-cyan-300 text-sm"
              >
                Create your first ritual →
              </button>
            </div>
          ) : (
            filteredRituals.map(ritual => (
              <RitualCard
                key={ritual.id}
                ritual={ritual}
                todayCompletions={getTodayCompletions(ritual)}
                onComplete={() => handleComplete(ritual.id)}
                onEdit={() => setEditingRitual(ritual)}
              />
            ))
          )}
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Ritual Philosophy */}
          <div className="cascade-card p-6">
            <h3 className="text-lg font-medium text-zinc-200 mb-4">Ritual Philosophy</h3>
            <div className="space-y-3 text-sm">
              <p className="text-zinc-400">
                Rituals are the <span className="text-cyan-400">scaffolding of sovereignty</span>. 
                They convert intention into action through repetition.
              </p>
              <p className="text-zinc-400">
                Each completion is a vote for the person you're becoming.
                Streaks measure consistency. μ measures effort.
              </p>
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <p className="text-purple-400 font-mono text-xs">
                  Ritual = ∫ intention × repetition dt
                </p>
              </div>
            </div>
          </div>
          
          {/* LAMAGUE Key */}
          <div className="cascade-card p-6">
            <h3 className="text-lg font-medium text-zinc-200 mb-4">LAMAGUE Key</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-3">
                <span className="w-8 text-lg font-mono text-purple-400">⟟</span>
                <span className="text-zinc-400">Center — grounding practices</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-8 text-lg font-mono text-purple-400">≋</span>
                <span className="text-zinc-400">Flow — sustained work</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-8 text-lg font-mono text-purple-400">Ψ</span>
                <span className="text-zinc-400">Insight — reflection</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-8 text-lg font-mono text-purple-400">Φ↑</span>
                <span className="text-zinc-400">Rise — physical action</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-8 text-lg font-mono text-purple-400">✧</span>
                <span className="text-zinc-400">Light — sharing, connection</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-8 text-lg font-mono text-purple-400">∥◁▷∥</span>
                <span className="text-zinc-400">Integrity — boundaries</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-8 text-lg font-mono text-purple-400">⟲</span>
                <span className="text-zinc-400">Return — review, cycles</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
