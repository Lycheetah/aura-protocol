'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'

// ============================================================================
// TYPES
// ============================================================================

interface Command {
  id: string
  label: string
  description?: string
  icon?: string
  category: 'navigation' | 'action' | 'lamague' | 'system'
  shortcut?: string
  action: () => void
}

// ============================================================================
// COMMAND PALETTE COMPONENT
// ============================================================================

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  
  // Commands
  const commands: Command[] = [
    // Navigation
    { id: 'nav-home', label: 'Go to Dashboard', icon: '🏠', category: 'navigation', action: () => router.push('/') },
    { id: 'nav-phases', label: 'Go to Phase Tracker', icon: '🌙', category: 'navigation', action: () => router.push('/phases') },
    { id: 'nav-microorcim', label: 'Go to Microorcim Counter', icon: '⚡', category: 'navigation', action: () => router.push('/microorcim') },
    { id: 'nav-sovereignty', label: 'Go to Sovereignty', icon: '🛡️', category: 'navigation', action: () => router.push('/sovereignty') },
    { id: 'nav-pyramid', label: 'Go to Knowledge Pyramid', icon: '△', category: 'navigation', action: () => router.push('/pyramid') },
    { id: 'nav-oracle', label: 'Go to Oracle', icon: '🔮', category: 'navigation', action: () => router.push('/oracle') },
    { id: 'nav-journal', label: 'Go to Journal', icon: '📓', category: 'navigation', action: () => router.push('/journal') },
    { id: 'nav-cycle', label: 'Go to 36-Part Cycle', icon: '🔄', category: 'navigation', action: () => router.push('/cycle') },
    { id: 'nav-agents', label: 'Go to Agents', icon: '🤖', category: 'navigation', action: () => router.push('/agents') },
    { id: 'nav-settings', label: 'Go to Settings', icon: '⚙️', category: 'navigation', action: () => router.push('/settings') },
    
    // Actions
    { id: 'action-microorcim', label: 'Fire Microorcim', description: 'Record a new agency event', icon: '⚡', category: 'action', shortcut: 'M', action: () => router.push('/microorcim') },
    { id: 'action-journal', label: 'New Journal Entry', description: 'Write today\'s reflection', icon: '✏️', category: 'action', shortcut: 'J', action: () => router.push('/journal') },
    { id: 'action-oracle', label: 'Consult Oracle', description: 'Ask the AI for guidance', icon: '🔮', category: 'action', shortcut: 'O', action: () => router.push('/oracle') },
    
    // LAMAGUE expressions
    { id: 'lamague-center', label: '⟟ Center', description: 'Return to invariant', icon: '⟟', category: 'lamague', action: () => {} },
    { id: 'lamague-flow', label: '≋ Flow', description: 'Move without losing yourself', icon: '≋', category: 'lamague', action: () => {} },
    { id: 'lamague-insight', label: 'Ψ Insight', description: 'Perceive clearly', icon: 'Ψ', category: 'lamague', action: () => {} },
    { id: 'lamague-rise', label: 'Φ↑ Rise', description: 'Take bold action', icon: 'Φ↑', category: 'lamague', action: () => {} },
    { id: 'lamague-light', label: '✧ Light', description: 'Illuminate and share', icon: '✧', category: 'lamague', action: () => {} },
    { id: 'lamague-integrity', label: '∥◁▷∥ Integrity', description: 'Hold boundaries', icon: '∥◁▷∥', category: 'lamague', action: () => {} },
    { id: 'lamague-return', label: '⟲ Return', description: 'Complete the cycle', icon: '⟲', category: 'lamague', action: () => {} },
    
    // System
    { id: 'system-theme', label: 'Toggle Theme', description: 'Switch dark/light mode', icon: '🌓', category: 'system', action: () => {} },
    { id: 'system-export', label: 'Export Data', description: 'Download your CASCADE state', icon: '📤', category: 'system', action: () => router.push('/settings') },
    { id: 'system-help', label: 'Help & Documentation', description: 'Learn about CASCADE', icon: '❓', category: 'system', action: () => {} },
  ]
  
  // Filter commands
  const filteredCommands = commands.filter(cmd => 
    cmd.label.toLowerCase().includes(search.toLowerCase()) ||
    cmd.description?.toLowerCase().includes(search.toLowerCase()) ||
    cmd.category.includes(search.toLowerCase())
  )
  
  // Group by category
  const groupedCommands = filteredCommands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = []
    acc[cmd.category].push(cmd)
    return acc
  }, {} as Record<string, Command[]>)
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open with Cmd/Ctrl + K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
      }
      
      // Close with Escape
      if (e.key === 'Escape') {
        setIsOpen(false)
        setSearch('')
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])
  
  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])
  
  // Navigation within results
  const handleKeyNavigation = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
      executeCommand(filteredCommands[selectedIndex])
    }
  }
  
  const executeCommand = (command: Command) => {
    command.action()
    setIsOpen(false)
    setSearch('')
  }
  
  // Reset selection when search changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [search])
  
  if (!isOpen) return null
  
  const categoryLabels: Record<string, string> = {
    navigation: 'Navigation',
    action: 'Quick Actions',
    lamague: 'LAMAGUE',
    system: 'System'
  }
  
  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={() => setIsOpen(false)}
      />
      
      {/* Palette */}
      <div className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-xl z-50">
        <div className="bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl overflow-hidden">
          {/* Search Input */}
          <div className="p-4 border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyNavigation}
                placeholder="Type a command or search..."
                className="flex-1 bg-transparent text-zinc-200 placeholder-zinc-500 focus:outline-none"
              />
              <kbd className="px-2 py-1 text-xs bg-zinc-800 text-zinc-500 rounded">ESC</kbd>
            </div>
          </div>
          
          {/* Results */}
          <div className="max-h-96 overflow-y-auto">
            {filteredCommands.length === 0 ? (
              <div className="p-8 text-center text-zinc-500">
                <p>No commands found</p>
                <p className="text-xs mt-1">Try a different search term</p>
              </div>
            ) : (
              Object.entries(groupedCommands).map(([category, cmds]) => (
                <div key={category}>
                  <div className="px-4 py-2 bg-zinc-800/50">
                    <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      {categoryLabels[category] || category}
                    </span>
                  </div>
                  {cmds.map((cmd, i) => {
                    const globalIndex = filteredCommands.indexOf(cmd)
                    return (
                      <button
                        key={cmd.id}
                        onClick={() => executeCommand(cmd)}
                        className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-colors ${
                          globalIndex === selectedIndex ? 'bg-cyan-500/10' : 'hover:bg-zinc-800'
                        }`}
                      >
                        <span className="text-lg w-6 text-center">{cmd.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-zinc-200">{cmd.label}</p>
                          {cmd.description && (
                            <p className="text-xs text-zinc-500 truncate">{cmd.description}</p>
                          )}
                        </div>
                        {cmd.shortcut && (
                          <kbd className="px-2 py-1 text-xs bg-zinc-800 text-zinc-500 rounded">
                            ⌘{cmd.shortcut}
                          </kbd>
                        )}
                      </button>
                    )
                  })}
                </div>
              ))
            )}
          </div>
          
          {/* Footer */}
          <div className="p-3 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
            <div className="flex items-center gap-4">
              <span><kbd className="px-1 bg-zinc-800 rounded">↑</kbd><kbd className="px-1 bg-zinc-800 rounded">↓</kbd> Navigate</span>
              <span><kbd className="px-1 bg-zinc-800 rounded">↵</kbd> Select</span>
            </div>
            <span className="font-mono text-purple-400">CASCADE OS</span>
          </div>
        </div>
      </div>
    </>
  )
}

// ============================================================================
// TRIGGER BUTTON
// ============================================================================

export function CommandPaletteTrigger() {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <button
      onClick={() => {
        // Dispatch keyboard event to open palette
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))
      }}
      className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors text-sm text-zinc-400"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <span>Search</span>
      <kbd className="px-1.5 py-0.5 text-xs bg-zinc-700 text-zinc-500 rounded">⌘K</kbd>
    </button>
  )
}
