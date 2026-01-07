'use client'

import { useEffect } from 'react'
import { useCASCADEStore } from '@/lib/store/cascade-store'

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  const initialize = useCASCADEStore(state => state.initialize)
  
  useEffect(() => {
    // Initialize store from localStorage on mount
    initialize()
  }, [initialize])
  
  return <>{children}</>
}
