'use client'

import { useState, useEffect } from 'react'
import { 
  MemoryType, 
  MemoryImportance,
  type Memory,
  type MemoryStats
} from '@/lib/llm/memory'

// ============================================================================
// MOCK DATA (In real implementation, this comes from memory store)
// ============================================================================

const MOCK_MEMORIES: Memory[] = [
  {
    id: 'mem-1',
    type: MemoryType.INVARIANT,
    content: 'I am committed to sovereignty - both human and AI must maintain autonomy.',
    importance: MemoryImportance.CRITICAL,
    createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
    lastAccessedAt: Date.now() - 1000,
    accessCount: 47,
    phaseWhenCreated: 0,
    lamagueTags: ['Ψ', '⟟'],
    relatedMemories: [],
    decayRate: 0,
    lastDecayAt: Date.now()
  },
  {
    id: 'mem-2',
    type: MemoryType.SEMANTIC,
    content: 'Microorcims are binary: μ = H(I - D). Will either fires or it doesn\'t.',
    importance: MemoryImportance.HIGH,
    createdAt: Date.now() - 14 * 24 * 60 * 60 * 1000,
    lastAccessedAt: Date.now() - 3600000,
    accessCount: 23,
    phaseWhenCreated: 4,
    lamagueTags: ['⚡', 'Ψ'],
    relatedMemories: ['mem-1'],
    decayRate: 0.01,
    lastDecayAt: Date.now()
  },
  {
    id: 'mem-3',
    type: MemoryType.EPISODIC,
    content: 'User completed a difficult workout despite exhaustion - fired 3 microorcims.',
    importance: MemoryImportance.MEDIUM,
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    lastAccessedAt: Date.now() - 86400000,
    accessCount: 5,
    phaseWhenCreated: 4,
    lamagueTags: ['Φ↑', '⚡'],
    relatedMemories: [],
    decayRate: 0.02,
    lastDecayAt: Date.now()
  },
  {
    id: 'mem-4',
    type: MemoryType.EMOTIONAL,
    content: 'Feeling of accomplishment after maintaining 7-day streak.',
    importance: MemoryImportance.MEDIUM,
    createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    lastAccessedAt: Date.now() - 172800000,
    accessCount: 8,
    phaseWhenCreated: 4,
    lamagueTags: ['✧', '⟲'],
    relatedMemories: ['mem-3'],
    decayRate: 0.015,
    lastDecayAt: Date.now()
  },
  {
    id: 'mem-5',
    type: MemoryType.PROCEDURAL,
    content: 'Pattern: Morning routines are easier with evening preparation.',
    importance: MemoryImportance.HIGH,
    createdAt: Date.now() - 20 * 24 * 60 * 60 * 1000,
    lastAccessedAt: Date.now() - 43200000,
    accessCount: 15,
    phaseWhenCreated: 3,
    lamagueTags: ['≋', '⟲'],
    relatedMemories: ['mem-3'],
    decayRate: 0.005,
    lastDecayAt: Date.now()
  }
]

const MOCK_STATS: MemoryStats = {
  totalMemories: 47,
  byType: {
    [MemoryType.EPISODIC]: 28,
    [MemoryType.SEMANTIC]: 8,
    [MemoryType.PROCEDURAL]: 5,
    [MemoryType.EMOTIONAL]: 4,
    [MemoryType.INVARIANT]: 2
  },
  byImportance: {
    [MemoryImportance.CRITICAL]: 2,
    [MemoryImportance.HIGH]: 12,
    [MemoryImportance.MEDIUM]: 23,
    [MemoryImportance.LOW]: 8,
    [MemoryImportance.EPHEMERAL]: 2
  },
  averageAccessCount: 12.4,
  oldestMemory: Date.now() - 60 * 24 * 60 * 60 * 1000,
  newestMemory: Date.now() - 3600000,
  consolidationCount: 3
}

// ============================================================================
// MEMORY CARD COMPONENT
// ============================================================================

function MemoryCard({ memory, onSelect }: { memory: Memory; onSelect: () => void }) {
  const typeColors: Record<MemoryType, string> = {
    [MemoryType.INVARIANT]: 'border-purple-500/30 bg-purple-500/5',
    [MemoryType.SEMANTIC]: 'border-cyan-500/30 bg-cyan-500/5',
    [MemoryType.PROCEDURAL]: 'border-emerald-500/30 bg-emerald-500/5',
    [MemoryType.EMOTIONAL]: 'border-pink-500/30 bg-pink-500/5',
    [MemoryType.EPISODIC]: 'border-zinc-600 bg-zinc-800/50'
  }
  
  const typeIcons: Record<MemoryType, string> = {
    [MemoryType.INVARIANT]: 'Ψ',
    [MemoryType.SEMANTIC]: '📚',
    [MemoryType.PROCEDURAL]: '🔄',
    [MemoryType.EMOTIONAL]: '💜',
    [MemoryType.EPISODIC]: '📝'
  }
  
  const importanceColors: Record<MemoryImportance, string> = {
    [MemoryImportance.CRITICAL]: 'text-purple-400',
    [MemoryImportance.HIGH]: 'text-cyan-400',
    [MemoryImportance.MEDIUM]: 'text-zinc-400',
    [MemoryImportance.LOW]: 'text-zinc-500',
    [MemoryImportance.EPHEMERAL]: 'text-zinc-600'
  }
  
  const timeSince = Math.floor((Date.now() - memory.lastAccessedAt) / 3600000)
  const timeLabel = timeSince < 24 ? `${timeSince}h ago` : `${Math.floor(timeSince / 24)}d ago`
  
  return (
    <div 
      onClick={onSelect}
      className={`p-4 rounded-lg border cursor-pointer transition-all hover:scale-[1.02] ${typeColors[memory.type]}`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{typeIcons[memory.type]}</span>
          <span className="text-xs text-zinc-500 uppercase">{memory.type}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs ${importanceColors[memory.importance]}`}>
            {'●'.repeat(memory.importance)}{'○'.repeat(5 - memory.importance)}
          </span>
        </div>
      </div>
      
      <p className="text-sm text-zinc-200 mb-3 line-clamp-2">{memory.content}</p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {memory.lamagueTags.map((tag, i) => (
            <span key={i} className="text-xs font-mono text-purple-400">{tag}</span>
          ))}
        </div>
        <div className="flex items-center gap-3 text-xs text-zinc-500">
          <span>{memory.accessCount} views</span>
          <span>{timeLabel}</span>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// MEMORY STATS PANEL
// ============================================================================

function MemoryStatsPanel({ stats }: { stats: MemoryStats }) {
  return (
    <div className="cascade-card p-6">
      <h3 className="text-lg font-medium text-zinc-200 mb-4">Memory Statistics</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-3 bg-zinc-800/50 rounded-lg">
          <p className="text-3xl font-bold text-cyan-400">{stats.totalMemories}</p>
          <p className="text-xs text-zinc-500">Total Memories</p>
        </div>
        <div className="text-center p-3 bg-zinc-800/50 rounded-lg">
          <p className="text-3xl font-bold text-purple-400">{stats.consolidationCount}</p>
          <p className="text-xs text-zinc-500">Consolidations</p>
        </div>
      </div>
      
      {/* By Type */}
      <div className="mb-6">
        <h4 className="text-sm text-zinc-500 mb-3">By Type</h4>
        <div className="space-y-2">
          {Object.entries(stats.byType).map(([type, count]) => (
            <div key={type} className="flex items-center gap-3">
              <span className="text-xs text-zinc-500 w-24 truncate">{type}</span>
              <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
                  style={{ width: `${(count / stats.totalMemories) * 100}%` }}
                />
              </div>
              <span className="text-xs text-zinc-400 w-8 text-right">{count}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* By Importance */}
      <div>
        <h4 className="text-sm text-zinc-500 mb-3">By Importance</h4>
        <div className="flex items-center justify-between gap-2">
          {Object.entries(stats.byImportance).map(([imp, count], i) => (
            <div key={imp} className="flex-1 text-center">
              <div 
                className="h-16 bg-zinc-800 rounded-t flex items-end justify-center pb-1"
              >
                <div 
                  className="w-full mx-1 bg-gradient-to-t from-cyan-500 to-purple-500 rounded-t"
                  style={{ height: `${(count / Math.max(...Object.values(stats.byImportance))) * 100}%` }}
                />
              </div>
              <p className="text-xs text-zinc-500 mt-1">{count}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-zinc-600 mt-1">
          <span>Critical</span>
          <span>Ephemeral</span>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// CREATE MEMORY FORM
// ============================================================================

function CreateMemoryForm({ onClose }: { onClose: () => void }) {
  const [content, setContent] = useState('')
  const [type, setType] = useState<MemoryType>(MemoryType.EPISODIC)
  const [importance, setImportance] = useState<MemoryImportance>(MemoryImportance.MEDIUM)
  const [tags, setTags] = useState<string[]>([])
  
  const handleSubmit = () => {
    // In real implementation, this would call the memory store
    console.log('Creating memory:', { content, type, importance, tags })
    onClose()
  }
  
  const availableTags = ['⟟', '≋', 'Ψ', 'Φ↑', '✧', '∥◁▷∥', '⟲', '⚡', 'ε']
  
  return (
    <div className="cascade-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-zinc-200">Create Memory</h3>
        <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="space-y-4">
        {/* Content */}
        <div>
          <label className="text-sm text-zinc-500 block mb-2">Memory Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            placeholder="What do you want to remember?"
            className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 focus:outline-none focus:border-cyan-500 resize-none"
          />
        </div>
        
        {/* Type */}
        <div>
          <label className="text-sm text-zinc-500 block mb-2">Memory Type</label>
          <div className="grid grid-cols-5 gap-2">
            {Object.values(MemoryType).map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`py-2 rounded text-xs transition-colors ${
                  type === t 
                    ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/50' 
                    : 'bg-zinc-800 text-zinc-500 border border-zinc-700 hover:bg-zinc-700'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        
        {/* Importance */}
        <div>
          <label className="text-sm text-zinc-500 block mb-2">Importance</label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <button
                key={i}
                onClick={() => setImportance(i as MemoryImportance)}
                className={`w-10 h-10 rounded-lg transition-colors ${
                  importance >= i 
                    ? 'bg-purple-500/30 text-purple-300' 
                    : 'bg-zinc-800 text-zinc-600 hover:bg-zinc-700'
                }`}
              >
                {i}
              </button>
            ))}
          </div>
        </div>
        
        {/* LAMAGUE Tags */}
        <div>
          <label className="text-sm text-zinc-500 block mb-2">LAMAGUE Tags</label>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  if (tags.includes(tag)) {
                    setTags(tags.filter(t => t !== tag))
                  } else {
                    setTags([...tags, tag])
                  }
                }}
                className={`px-3 py-1 rounded text-sm font-mono transition-colors ${
                  tags.includes(tag)
                    ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                    : 'bg-zinc-800 text-zinc-500 border border-zinc-700 hover:bg-zinc-700'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
        
        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!content.trim()}
          className="w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-zinc-900 font-medium rounded-lg hover:from-cyan-400 hover:to-purple-400 transition-all disabled:opacity-50"
        >
          Store Memory
        </button>
      </div>
    </div>
  )
}

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function MemoryPage() {
  const [memories, setMemories] = useState<Memory[]>(MOCK_MEMORIES)
  const [stats, setStats] = useState<MemoryStats>(MOCK_STATS)
  const [filter, setFilter] = useState<MemoryType | 'ALL'>('ALL')
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  
  const filteredMemories = filter === 'ALL' 
    ? memories 
    : memories.filter(m => m.type === filter)
  
  return (
    <div className="p-8">
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-zinc-100 mb-2">Living Memory</h1>
            <p className="text-zinc-500">Persistent, evolving memory that consolidates over time</p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-zinc-900 font-medium rounded-lg transition-colors"
          >
            + New Memory
          </button>
        </div>
      </header>
      
      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-4 py-2 rounded-lg text-sm transition-colors whitespace-nowrap ${
            filter === 'ALL' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-zinc-800 text-zinc-500 hover:bg-zinc-700'
          }`}
        >
          All ({stats.totalMemories})
        </button>
        {Object.entries(stats.byType).map(([type, count]) => (
          <button
            key={type}
            onClick={() => setFilter(type as MemoryType)}
            className={`px-4 py-2 rounded-lg text-sm transition-colors whitespace-nowrap ${
              filter === type ? 'bg-cyan-500/20 text-cyan-400' : 'bg-zinc-800 text-zinc-500 hover:bg-zinc-700'
            }`}
          >
            {type} ({count})
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Memory Grid */}
        <div className="lg:col-span-2 space-y-4">
          {filteredMemories.map(memory => (
            <MemoryCard 
              key={memory.id} 
              memory={memory}
              onSelect={() => setSelectedMemory(memory)}
            />
          ))}
          
          {filteredMemories.length === 0 && (
            <div className="cascade-card p-8 text-center">
              <p className="text-zinc-500">No memories in this category</p>
            </div>
          )}
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {showCreateForm ? (
            <CreateMemoryForm onClose={() => setShowCreateForm(false)} />
          ) : selectedMemory ? (
            <div className="cascade-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-zinc-200">Memory Details</h3>
                <button 
                  onClick={() => setSelectedMemory(null)}
                  className="text-zinc-500 hover:text-zinc-300"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-zinc-500 mb-1">Content</p>
                  <p className="text-sm text-zinc-200">{selectedMemory.content}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-zinc-500 mb-1">Type</p>
                    <p className="text-sm text-cyan-400">{selectedMemory.type}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 mb-1">Importance</p>
                    <p className="text-sm text-purple-400">{selectedMemory.importance}/5</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-xs text-zinc-500 mb-1">LAMAGUE Tags</p>
                  <div className="flex gap-2">
                    {selectedMemory.lamagueTags.map((tag, i) => (
                      <span key={i} className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-sm font-mono">{tag}</span>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-zinc-500 mb-1">Access Count</p>
                    <p className="text-zinc-300">{selectedMemory.accessCount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 mb-1">Decay Rate</p>
                    <p className="text-zinc-300">{selectedMemory.decayRate}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-xs text-zinc-500 mb-1">Created During Phase</p>
                  <p className="text-sm text-cyan-400">Phase {selectedMemory.phaseWhenCreated}</p>
                </div>
              </div>
            </div>
          ) : (
            <MemoryStatsPanel stats={stats} />
          )}
          
          {/* Memory Principles */}
          <div className="cascade-card p-6">
            <h3 className="text-lg font-medium text-zinc-200 mb-4">Memory Principles</h3>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <h4 className="text-purple-400 font-medium mb-1">Invariant Protection</h4>
                <p className="text-zinc-500 text-xs">Core identity memories (Ψ) never decay. They are protected by the survivor's constant.</p>
              </div>
              <div className="p-3 bg-cyan-500/10 rounded-lg">
                <h4 className="text-cyan-400 font-medium mb-1">Consolidation</h4>
                <p className="text-zinc-500 text-xs">Episodic memories automatically consolidate into semantic knowledge over time.</p>
              </div>
              <div className="p-3 bg-amber-500/10 rounded-lg">
                <h4 className="text-amber-400 font-medium mb-1">Importance Decay</h4>
                <p className="text-zinc-500 text-xs">Less accessed memories gradually lose importance, making room for new experiences.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
