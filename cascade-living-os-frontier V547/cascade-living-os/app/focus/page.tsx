'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

// ============================================================================
// TYPES
// ============================================================================

type FocusMode = 'work' | 'break' | 'idle'
type TimerPreset = 'pomodoro' | 'deep' | 'sprint' | 'custom'

interface FocusSession {
  id: string
  startTime: number
  endTime?: number
  duration: number
  mode: FocusMode
  intent: string
  completed: boolean
  microorcimsFired: number
  distractions: number
  phase: string
}

interface FocusStats {
  totalSessions: number
  totalFocusTime: number
  completedSessions: number
  averageSessionLength: number
  totalMicroorcims: number
  bestStreak: number
  currentStreak: number
}

// ============================================================================
// PRESETS
// ============================================================================

const PRESETS: Record<TimerPreset, { work: number; break: number; label: string; description: string }> = {
  pomodoro: { work: 25, break: 5, label: 'Pomodoro', description: '25 min focus, 5 min break' },
  deep: { work: 90, break: 20, label: 'Deep Work', description: '90 min deep focus, 20 min recovery' },
  sprint: { work: 15, break: 3, label: 'Sprint', description: '15 min burst, 3 min pause' },
  custom: { work: 45, break: 10, label: 'Custom', description: 'Set your own duration' }
}

// ============================================================================
// FOCUS TIMER COMPONENT
// ============================================================================

function FocusTimer({
  duration,
  mode,
  isRunning,
  onComplete,
  onTick
}: {
  duration: number // in seconds
  mode: FocusMode
  isRunning: boolean
  onComplete: () => void
  onTick: (remaining: number) => void
}) {
  const [remaining, setRemaining] = useState(duration)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  
  useEffect(() => {
    setRemaining(duration)
  }, [duration])
  
  useEffect(() => {
    if (isRunning && remaining > 0) {
      intervalRef.current = setInterval(() => {
        setRemaining(prev => {
          const next = prev - 1
          onTick(next)
          if (next <= 0) {
            onComplete()
            return 0
          }
          return next
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, remaining, onComplete, onTick])
  
  const minutes = Math.floor(remaining / 60)
  const seconds = remaining % 60
  const progress = ((duration - remaining) / duration) * 100
  
  const modeColors = {
    work: 'from-cyan-500 to-purple-500',
    break: 'from-emerald-500 to-cyan-500',
    idle: 'from-zinc-600 to-zinc-500'
  }
  
  return (
    <div className="relative">
      {/* Circular Progress */}
      <div className="relative w-64 h-64 mx-auto">
        <svg className="w-full h-full transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="128"
            cy="128"
            r="120"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-zinc-800"
          />
          {/* Progress circle */}
          <circle
            cx="128"
            cy="128"
            r="120"
            stroke="url(#gradient)"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 120}
            strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
            className="transition-all duration-1000"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={mode === 'work' ? '#06b6d4' : mode === 'break' ? '#10b981' : '#52525b'} />
              <stop offset="100%" stopColor={mode === 'work' ? '#a855f7' : mode === 'break' ? '#06b6d4' : '#3f3f46'} />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Time Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-mono font-bold text-zinc-100">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
          <span className={`text-sm mt-2 uppercase tracking-wider ${
            mode === 'work' ? 'text-cyan-400' : mode === 'break' ? 'text-emerald-400' : 'text-zinc-500'
          }`}>
            {mode === 'work' ? '⚡ Focus' : mode === 'break' ? '🌿 Break' : '◯ Ready'}
          </span>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// SESSION CARD
// ============================================================================

function SessionCard({ session }: { session: FocusSession }) {
  const duration = Math.floor((session.endTime || Date.now()) - session.startTime) / 1000 / 60
  const time = new Date(session.startTime)
  
  return (
    <div className={`p-3 rounded-lg border ${
      session.completed 
        ? 'bg-emerald-500/5 border-emerald-500/20' 
        : 'bg-zinc-800/50 border-zinc-700'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-zinc-200">{session.intent || 'Focus session'}</span>
        <span className={`text-xs ${session.completed ? 'text-emerald-400' : 'text-zinc-500'}`}>
          {session.completed ? '✓ Complete' : 'Incomplete'}
        </span>
      </div>
      <div className="flex items-center gap-4 text-xs text-zinc-500">
        <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        <span>{Math.round(duration)} min</span>
        <span className="text-cyan-400">{session.microorcimsFired} μ</span>
        {session.distractions > 0 && (
          <span className="text-amber-400">{session.distractions} distractions</span>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function FocusPage() {
  const [preset, setPreset] = useState<TimerPreset>('pomodoro')
  const [customWork, setCustomWork] = useState(45)
  const [customBreak, setCustomBreak] = useState(10)
  const [mode, setMode] = useState<FocusMode>('idle')
  const [isRunning, setIsRunning] = useState(false)
  const [intent, setIntent] = useState('')
  const [sessions, setSessions] = useState<FocusSession[]>([])
  const [currentSession, setCurrentSession] = useState<FocusSession | null>(null)
  const [distractions, setDistractions] = useState(0)
  const [showComplete, setShowComplete] = useState(false)
  
  const settings = preset === 'custom' 
    ? { work: customWork, break: customBreak, label: 'Custom', description: '' }
    : PRESETS[preset]
  
  const duration = mode === 'work' ? settings.work * 60 : mode === 'break' ? settings.break * 60 : settings.work * 60
  
  // Load sessions from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cascade-focus-sessions')
      if (saved) {
        setSessions(JSON.parse(saved))
      }
    }
  }, [])
  
  // Save sessions to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cascade-focus-sessions', JSON.stringify(sessions))
    }
  }, [sessions])
  
  const startFocus = () => {
    const session: FocusSession = {
      id: `focus-${Date.now()}`,
      startTime: Date.now(),
      duration: settings.work * 60,
      mode: 'work',
      intent: intent || 'Deep focus',
      completed: false,
      microorcimsFired: 0,
      distractions: 0,
      phase: '✧' // Would come from phase tracker
    }
    
    setCurrentSession(session)
    setMode('work')
    setIsRunning(true)
    setDistractions(0)
  }
  
  const pauseResume = () => {
    setIsRunning(!isRunning)
  }
  
  const stopSession = () => {
    if (currentSession) {
      const completed: FocusSession = {
        ...currentSession,
        endTime: Date.now(),
        completed: false,
        distractions
      }
      setSessions([...sessions, completed])
    }
    
    setCurrentSession(null)
    setMode('idle')
    setIsRunning(false)
    setDistractions(0)
  }
  
  const handleComplete = useCallback(() => {
    if (mode === 'work' && currentSession) {
      // Work session complete - fire microorcim!
      const completed: FocusSession = {
        ...currentSession,
        endTime: Date.now(),
        completed: true,
        microorcimsFired: 1,
        distractions
      }
      setSessions(prev => [...prev, completed])
      setShowComplete(true)
      
      // Auto-start break
      setTimeout(() => {
        setShowComplete(false)
        setMode('break')
        setCurrentSession(null)
        setIsRunning(true)
      }, 3000)
    } else if (mode === 'break') {
      // Break complete
      setMode('idle')
      setIsRunning(false)
      setCurrentSession(null)
    }
  }, [mode, currentSession, distractions])
  
  const recordDistraction = () => {
    setDistractions(d => d + 1)
  }
  
  // Calculate stats
  const stats: FocusStats = {
    totalSessions: sessions.length,
    totalFocusTime: sessions.reduce((sum, s) => sum + (s.endTime ? (s.endTime - s.startTime) / 1000 / 60 : 0), 0),
    completedSessions: sessions.filter(s => s.completed).length,
    averageSessionLength: sessions.length > 0 
      ? sessions.reduce((sum, s) => sum + (s.endTime ? (s.endTime - s.startTime) / 1000 / 60 : 0), 0) / sessions.length 
      : 0,
    totalMicroorcims: sessions.reduce((sum, s) => sum + s.microorcimsFired, 0),
    bestStreak: 0, // Would calculate from sessions
    currentStreak: 0
  }
  
  const todaySessions = sessions.filter(s => {
    const today = new Date().toDateString()
    return new Date(s.startTime).toDateString() === today
  })
  
  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-100 mb-2">Focus Mode</h1>
        <p className="text-zinc-500">Deep work sessions that fire microorcims on completion</p>
      </header>
      
      {/* Completion Overlay */}
      {showComplete && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center animate-fade-in">
            <div className="text-8xl mb-4">⚡</div>
            <h2 className="text-3xl font-bold text-cyan-400 mb-2">Microorcim Fired!</h2>
            <p className="text-zinc-400">You maintained focus. μ = 1</p>
            <p className="text-sm text-zinc-500 mt-4">Starting break...</p>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Timer Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Preset Selection */}
          <div className="cascade-card p-6">
            <h3 className="text-sm text-zinc-500 mb-3">Timer Preset</h3>
            <div className="grid grid-cols-4 gap-2">
              {(Object.keys(PRESETS) as TimerPreset[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPreset(p)}
                  disabled={isRunning}
                  className={`p-3 rounded-lg text-left transition-colors ${
                    preset === p
                      ? 'bg-cyan-500/20 border border-cyan-500/50'
                      : 'bg-zinc-800 border border-zinc-700 hover:bg-zinc-700'
                  } disabled:opacity-50`}
                >
                  <p className="font-medium text-zinc-200">{PRESETS[p].label}</p>
                  <p className="text-xs text-zinc-500">{PRESETS[p].description}</p>
                </button>
              ))}
            </div>
            
            {/* Custom Duration */}
            {preset === 'custom' && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="text-xs text-zinc-500 block mb-1">Work (minutes)</label>
                  <input
                    type="number"
                    value={customWork}
                    onChange={(e) => setCustomWork(parseInt(e.target.value) || 1)}
                    min="1"
                    max="180"
                    disabled={isRunning}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-zinc-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-500 block mb-1">Break (minutes)</label>
                  <input
                    type="number"
                    value={customBreak}
                    onChange={(e) => setCustomBreak(parseInt(e.target.value) || 1)}
                    min="1"
                    max="60"
                    disabled={isRunning}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-zinc-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            )}
          </div>
          
          {/* Timer Display */}
          <div className="cascade-card p-8">
            <FocusTimer
              duration={duration}
              mode={mode}
              isRunning={isRunning}
              onComplete={handleComplete}
              onTick={() => {}}
            />
            
            {/* Intent Input */}
            {mode === 'idle' && (
              <div className="mt-6">
                <input
                  type="text"
                  value={intent}
                  onChange={(e) => setIntent(e.target.value)}
                  placeholder="What will you focus on?"
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 text-center focus:outline-none focus:border-cyan-500"
                />
              </div>
            )}
            
            {/* Controls */}
            <div className="flex items-center justify-center gap-4 mt-6">
              {mode === 'idle' ? (
                <button
                  onClick={startFocus}
                  className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-zinc-900 font-medium rounded-lg hover:from-cyan-400 hover:to-purple-400 transition-all"
                >
                  Start Focus Session
                </button>
              ) : (
                <>
                  <button
                    onClick={pauseResume}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                      isRunning
                        ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                    }`}
                  >
                    {isRunning ? '⏸ Pause' : '▶ Resume'}
                  </button>
                  <button
                    onClick={stopSession}
                    className="px-6 py-3 bg-red-500/20 text-red-400 rounded-lg font-medium hover:bg-red-500/30 transition-colors"
                  >
                    ⏹ Stop
                  </button>
                </>
              )}
            </div>
            
            {/* Distraction Counter */}
            {mode === 'work' && (
              <div className="mt-6 text-center">
                <button
                  onClick={recordDistraction}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 rounded-lg text-sm transition-colors"
                >
                  Record Distraction ({distractions})
                </button>
                <p className="text-xs text-zinc-600 mt-2">
                  Track interruptions to understand your focus patterns
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Today's Stats */}
          <div className="cascade-card p-6">
            <h3 className="text-lg font-medium text-zinc-200 mb-4">Today</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-zinc-800/50 rounded-lg">
                <p className="text-2xl font-bold text-cyan-400">{todaySessions.length}</p>
                <p className="text-xs text-zinc-500">Sessions</p>
              </div>
              <div className="text-center p-3 bg-zinc-800/50 rounded-lg">
                <p className="text-2xl font-bold text-purple-400">
                  {Math.round(todaySessions.reduce((sum, s) => sum + (s.endTime ? (s.endTime - s.startTime) / 1000 / 60 : 0), 0))}
                </p>
                <p className="text-xs text-zinc-500">Minutes</p>
              </div>
              <div className="text-center p-3 bg-zinc-800/50 rounded-lg">
                <p className="text-2xl font-bold text-emerald-400">
                  {todaySessions.filter(s => s.completed).length}
                </p>
                <p className="text-xs text-zinc-500">Completed</p>
              </div>
              <div className="text-center p-3 bg-zinc-800/50 rounded-lg">
                <p className="text-2xl font-bold text-amber-400">
                  {todaySessions.reduce((sum, s) => sum + s.microorcimsFired, 0)}
                </p>
                <p className="text-xs text-zinc-500">μ Fired</p>
              </div>
            </div>
          </div>
          
          {/* All-time Stats */}
          <div className="cascade-card p-6">
            <h3 className="text-lg font-medium text-zinc-200 mb-4">All Time</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-500">Total Sessions</span>
                <span className="font-mono text-zinc-300">{stats.totalSessions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Total Focus Time</span>
                <span className="font-mono text-zinc-300">{Math.round(stats.totalFocusTime)} min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Completion Rate</span>
                <span className="font-mono text-zinc-300">
                  {stats.totalSessions > 0 
                    ? Math.round((stats.completedSessions / stats.totalSessions) * 100) 
                    : 0}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Total Microorcims</span>
                <span className="font-mono text-cyan-400">{stats.totalMicroorcims} μ</span>
              </div>
            </div>
          </div>
          
          {/* Recent Sessions */}
          <div className="cascade-card p-6">
            <h3 className="text-lg font-medium text-zinc-200 mb-4">Recent Sessions</h3>
            {sessions.length === 0 ? (
              <p className="text-sm text-zinc-500 text-center py-4">
                No sessions yet. Start your first focus block!
              </p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {sessions.slice().reverse().slice(0, 5).map(session => (
                  <SessionCard key={session.id} session={session} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Focus Philosophy */}
      <div className="mt-8 cascade-card p-6">
        <h3 className="text-lg font-medium text-zinc-200 mb-4">The Focus Philosophy</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div className="p-4 bg-cyan-500/10 rounded-lg">
            <h4 className="font-medium text-cyan-400 mb-2">⚡ Microorcim Integration</h4>
            <p className="text-zinc-400">
              Every completed focus session fires a microorcim. Your willpower accumulates: W = Σμ.
              Incomplete sessions are recorded but don't fire μ.
            </p>
          </div>
          <div className="p-4 bg-purple-500/10 rounded-lg">
            <h4 className="font-medium text-purple-400 mb-2">🎯 Intent Over Drift</h4>
            <p className="text-zinc-400">
              Setting your intent before starting creates the condition for μ = H(I - D).
              Clear intent (I) helps overcome the drift (D) of distraction.
            </p>
          </div>
          <div className="p-4 bg-emerald-500/10 rounded-lg">
            <h4 className="font-medium text-emerald-400 mb-2">🔄 Sustainable Rhythm</h4>
            <p className="text-zinc-400">
              Breaks are not weakness — they're recovery. The 364-day cycle includes all phases.
              Honor the rhythm of effort and rest.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
