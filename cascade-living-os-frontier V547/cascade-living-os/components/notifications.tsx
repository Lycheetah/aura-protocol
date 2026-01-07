'use client'

import { useState, useEffect, createContext, useContext, useCallback } from 'react'

// ============================================================================
// TYPES
// ============================================================================

export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'insight' | 'phase' | 'microorcim'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  timestamp: number
  read: boolean
  dismissed: boolean
  source?: string
  action?: {
    label: string
    href?: string
    onClick?: () => void
  }
  lamague?: string
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  push: (notification: Omit<Notification, 'id' | 'timestamp' | 'read' | 'dismissed'>) => void
  markRead: (id: string) => void
  markAllRead: () => void
  dismiss: (id: string) => void
  dismissAll: () => void
  clear: () => void
}

// ============================================================================
// CONTEXT
// ============================================================================

const NotificationContext = createContext<NotificationContextType | null>(null)

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider')
  }
  return context
}

// ============================================================================
// PROVIDER
// ============================================================================

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  
  // Load from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cascade-notifications')
      if (saved) {
        setNotifications(JSON.parse(saved))
      }
    }
  }, [])
  
  // Save to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cascade-notifications', JSON.stringify(notifications))
    }
  }, [notifications])
  
  const push = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read' | 'dismissed'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      read: false,
      dismissed: false
    }
    
    setNotifications(prev => [newNotification, ...prev].slice(0, 100))
    
    // Show browser notification if permitted
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico'
      })
    }
  }, [])
  
  const markRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }, [])
  
  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }, [])
  
  const dismiss = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, dismissed: true } : n))
  }, [])
  
  const dismissAll = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, dismissed: true })))
  }, [])
  
  const clear = useCallback(() => {
    setNotifications([])
  }, [])
  
  const unreadCount = notifications.filter(n => !n.read && !n.dismissed).length
  
  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      push,
      markRead,
      markAllRead,
      dismiss,
      dismissAll,
      clear
    }}>
      {children}
    </NotificationContext.Provider>
  )
}

// ============================================================================
// NOTIFICATION BELL COMPONENT
// ============================================================================

export function NotificationBell() {
  const { notifications, unreadCount, markRead, dismiss, markAllRead } = useNotifications()
  const [isOpen, setIsOpen] = useState(false)
  
  const visibleNotifications = notifications.filter(n => !n.dismissed).slice(0, 10)
  
  const getTypeStyles = (type: NotificationType) => {
    switch (type) {
      case 'success': return 'border-emerald-500/30 bg-emerald-500/5'
      case 'warning': return 'border-amber-500/30 bg-amber-500/5'
      case 'error': return 'border-red-500/30 bg-red-500/5'
      case 'insight': return 'border-purple-500/30 bg-purple-500/5'
      case 'phase': return 'border-cyan-500/30 bg-cyan-500/5'
      case 'microorcim': return 'border-yellow-500/30 bg-yellow-500/5'
      default: return 'border-zinc-700 bg-zinc-800/50'
    }
  }
  
  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case 'success': return '✓'
      case 'warning': return '⚠️'
      case 'error': return '✗'
      case 'insight': return '✨'
      case 'phase': return '🌙'
      case 'microorcim': return '⚡'
      default: return '📢'
    }
  }
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-zinc-800 transition-colors"
      >
        <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-cyan-500 text-zinc-900 text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-2 w-96 max-h-[70vh] overflow-y-auto bg-zinc-900 border border-zinc-700 rounded-lg shadow-2xl z-50">
            <div className="sticky top-0 bg-zinc-900 p-3 border-b border-zinc-800 flex items-center justify-between">
              <h3 className="font-medium text-zinc-200">Notifications</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    Mark all read
                  </button>
                )}
              </div>
            </div>
            
            {visibleNotifications.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-zinc-500">No notifications</p>
                <p className="text-xs text-zinc-600 mt-1">You're all caught up!</p>
              </div>
            ) : (
              <div className="divide-y divide-zinc-800">
                {visibleNotifications.map(notification => {
                  const time = new Date(notification.timestamp)
                  const timeAgo = Math.floor((Date.now() - notification.timestamp) / 60000)
                  const timeLabel = timeAgo < 60 
                    ? `${timeAgo}m ago` 
                    : timeAgo < 1440 
                      ? `${Math.floor(timeAgo / 60)}h ago`
                      : `${Math.floor(timeAgo / 1440)}d ago`
                  
                  return (
                    <div 
                      key={notification.id}
                      className={`p-3 ${!notification.read ? 'bg-zinc-800/30' : ''} hover:bg-zinc-800/50 transition-colors cursor-pointer`}
                      onClick={() => markRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-lg mt-0.5">{getTypeIcon(notification.type)}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className={`text-sm font-medium ${!notification.read ? 'text-zinc-100' : 'text-zinc-400'}`}>
                              {notification.title}
                            </h4>
                            <span className="text-xs text-zinc-600 whitespace-nowrap">{timeLabel}</span>
                          </div>
                          <p className="text-xs text-zinc-500 mt-0.5 line-clamp-2">{notification.message}</p>
                          
                          {notification.lamague && (
                            <p className="text-xs font-mono text-purple-400 mt-1">{notification.lamague}</p>
                          )}
                          
                          {notification.action && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                if (notification.action?.onClick) notification.action.onClick()
                              }}
                              className="mt-2 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                            >
                              {notification.action.label} →
                            </button>
                          )}
                        </div>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            dismiss(notification.id)
                          }}
                          className="text-zinc-600 hover:text-zinc-400 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

// ============================================================================
// TOAST COMPONENT
// ============================================================================

export function NotificationToast({ notification, onDismiss }: { notification: Notification; onDismiss: () => void }) {
  const [isVisible, setIsVisible] = useState(true)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onDismiss, 300)
    }, 5000)
    
    return () => clearTimeout(timer)
  }, [onDismiss])
  
  const getTypeStyles = (type: NotificationType) => {
    switch (type) {
      case 'success': return 'border-emerald-500/50 bg-emerald-500/10'
      case 'warning': return 'border-amber-500/50 bg-amber-500/10'
      case 'error': return 'border-red-500/50 bg-red-500/10'
      case 'insight': return 'border-purple-500/50 bg-purple-500/10'
      case 'phase': return 'border-cyan-500/50 bg-cyan-500/10'
      case 'microorcim': return 'border-yellow-500/50 bg-yellow-500/10'
      default: return 'border-zinc-600 bg-zinc-800'
    }
  }
  
  return (
    <div className={`
      transform transition-all duration-300 ease-out
      ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
    `}>
      <div className={`p-4 rounded-lg border backdrop-blur-sm ${getTypeStyles(notification.type)} max-w-sm`}>
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <h4 className="text-sm font-medium text-zinc-200">{notification.title}</h4>
            <p className="text-xs text-zinc-400 mt-1">{notification.message}</p>
            {notification.lamague && (
              <p className="text-xs font-mono text-purple-400 mt-2">{notification.lamague}</p>
            )}
          </div>
          <button
            onClick={() => {
              setIsVisible(false)
              setTimeout(onDismiss, 300)
            }}
            className="text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// TOAST CONTAINER
// ============================================================================

export function ToastContainer() {
  const { notifications, dismiss } = useNotifications()
  const [toasts, setToasts] = useState<Notification[]>([])
  
  // Show new notifications as toasts
  useEffect(() => {
    const newNotifications = notifications.filter(n => 
      !n.read && 
      !n.dismissed && 
      Date.now() - n.timestamp < 10000 &&
      !toasts.find(t => t.id === n.id)
    )
    
    if (newNotifications.length > 0) {
      setToasts(prev => [...prev, ...newNotifications].slice(-3))
    }
  }, [notifications])
  
  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }
  
  if (toasts.length === 0) return null
  
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <NotificationToast 
          key={toast.id} 
          notification={toast}
          onDismiss={() => removeToast(toast.id)}
        />
      ))}
    </div>
  )
}
