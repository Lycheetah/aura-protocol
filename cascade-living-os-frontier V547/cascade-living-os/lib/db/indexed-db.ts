// CASCADE Living OS - IndexedDB Persistence
// Persistent storage for all CASCADE state

import { CASCADEState, JournalEntry, Measurement } from '@/types/cascade'

const DB_NAME = 'cascade-living-os'
const DB_VERSION = 1

// Store names
const STORES = {
  STATE: 'cascade-state',
  JOURNAL: 'journal-entries',
  MEASUREMENTS: 'measurements',
  HISTORY: 'state-history'
} as const

// ============================================================================
// DATABASE INITIALIZATION
// ============================================================================

let dbInstance: IDBDatabase | null = null

/**
 * Initialize the IndexedDB database
 */
export function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (dbInstance) {
      resolve(dbInstance)
      return
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => {
      console.error('Failed to open database:', request.error)
      reject(request.error)
    }

    request.onsuccess = () => {
      dbInstance = request.result
      resolve(dbInstance)
    }

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result

      // Main state store
      if (!db.objectStoreNames.contains(STORES.STATE)) {
        db.createObjectStore(STORES.STATE, { keyPath: 'id' })
      }

      // Journal entries with timestamp index
      if (!db.objectStoreNames.contains(STORES.JOURNAL)) {
        const journalStore = db.createObjectStore(STORES.JOURNAL, { keyPath: 'id' })
        journalStore.createIndex('timestamp', 'timestamp', { unique: false })
      }

      // Measurements with practice and timestamp indexes
      if (!db.objectStoreNames.contains(STORES.MEASUREMENTS)) {
        const measurementStore = db.createObjectStore(STORES.MEASUREMENTS, { keyPath: 'id' })
        measurementStore.createIndex('practiceId', 'practiceId', { unique: false })
        measurementStore.createIndex('timestamp', 'timestamp', { unique: false })
      }

      // State history for undo/time travel
      if (!db.objectStoreNames.contains(STORES.HISTORY)) {
        const historyStore = db.createObjectStore(STORES.HISTORY, { keyPath: 'timestamp' })
        historyStore.createIndex('timestamp', 'timestamp', { unique: true })
      }
    }
  })
}

// ============================================================================
// STATE PERSISTENCE
// ============================================================================

/**
 * Save the full CASCADE state
 */
export async function saveState(state: CASCADEState): Promise<void> {
  const db = await initDB()
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORES.STATE, STORES.HISTORY], 'readwrite')
    
    transaction.onerror = () => reject(transaction.error)
    transaction.oncomplete = () => resolve()

    // Save current state
    const stateStore = transaction.objectStore(STORES.STATE)
    stateStore.put({ id: 'current', ...state })

    // Save to history (for time travel / undo)
    const historyStore = transaction.objectStore(STORES.HISTORY)
    historyStore.put({ 
      timestamp: Date.now(), 
      state: JSON.stringify(state)
    })

    // Clean old history (keep last 100 entries)
    const historyIndex = historyStore.index('timestamp')
    const countRequest = historyIndex.count()
    
    countRequest.onsuccess = () => {
      if (countRequest.result > 100) {
        const cursor = historyIndex.openCursor()
        let deleteCount = countRequest.result - 100
        
        cursor.onsuccess = () => {
          const result = cursor.result
          if (result && deleteCount > 0) {
            result.delete()
            deleteCount--
            result.continue()
          }
        }
      }
    }
  })
}

/**
 * Load the current CASCADE state
 */
export async function loadState(): Promise<CASCADEState | null> {
  const db = await initDB()
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORES.STATE, 'readonly')
    const store = transaction.objectStore(STORES.STATE)
    const request = store.get('current')

    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      if (request.result) {
        // Remove the 'id' key we added for storage
        const { id, ...state } = request.result
        resolve(state as CASCADEState)
      } else {
        resolve(null)
      }
    }
  })
}

/**
 * Get state history for time travel
 */
export async function getStateHistory(limit: number = 10): Promise<Array<{
  timestamp: number
  state: CASCADEState
}>> {
  const db = await initDB()
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORES.HISTORY, 'readonly')
    const store = transaction.objectStore(STORES.HISTORY)
    const index = store.index('timestamp')
    
    const results: Array<{ timestamp: number; state: CASCADEState }> = []
    const request = index.openCursor(null, 'prev') // Newest first

    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      const cursor = request.result
      if (cursor && results.length < limit) {
        results.push({
          timestamp: cursor.value.timestamp,
          state: JSON.parse(cursor.value.state)
        })
        cursor.continue()
      } else {
        resolve(results)
      }
    }
  })
}

/**
 * Restore state from a specific timestamp
 */
export async function restoreState(timestamp: number): Promise<CASCADEState | null> {
  const db = await initDB()
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORES.HISTORY, 'readonly')
    const store = transaction.objectStore(STORES.HISTORY)
    const request = store.get(timestamp)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      if (request.result) {
        resolve(JSON.parse(request.result.state))
      } else {
        resolve(null)
      }
    }
  })
}

// ============================================================================
// JOURNAL PERSISTENCE
// ============================================================================

/**
 * Save a journal entry
 */
export async function saveJournalEntry(entry: JournalEntry): Promise<void> {
  const db = await initDB()
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORES.JOURNAL, 'readwrite')
    const store = transaction.objectStore(STORES.JOURNAL)
    const request = store.put(entry)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve()
  })
}

/**
 * Get journal entries within a date range
 */
export async function getJournalEntries(
  startDate?: number,
  endDate?: number
): Promise<JournalEntry[]> {
  const db = await initDB()
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORES.JOURNAL, 'readonly')
    const store = transaction.objectStore(STORES.JOURNAL)
    const index = store.index('timestamp')
    
    const range = startDate && endDate
      ? IDBKeyRange.bound(startDate, endDate)
      : startDate
        ? IDBKeyRange.lowerBound(startDate)
        : endDate
          ? IDBKeyRange.upperBound(endDate)
          : null

    const results: JournalEntry[] = []
    const request = index.openCursor(range, 'prev')

    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      const cursor = request.result
      if (cursor) {
        results.push(cursor.value)
        cursor.continue()
      } else {
        resolve(results)
      }
    }
  })
}

// ============================================================================
// MEASUREMENT PERSISTENCE
// ============================================================================

/**
 * Save a measurement
 */
export async function saveMeasurement(measurement: Measurement): Promise<void> {
  const db = await initDB()
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORES.MEASUREMENTS, 'readwrite')
    const store = transaction.objectStore(STORES.MEASUREMENTS)
    const request = store.put(measurement)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve()
  })
}

/**
 * Get measurements for a practice
 */
export async function getMeasurements(practiceId: string): Promise<Measurement[]> {
  const db = await initDB()
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORES.MEASUREMENTS, 'readonly')
    const store = transaction.objectStore(STORES.MEASUREMENTS)
    const index = store.index('practiceId')
    
    const results: Measurement[] = []
    const request = index.openCursor(IDBKeyRange.only(practiceId))

    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      const cursor = request.result
      if (cursor) {
        results.push(cursor.value)
        cursor.continue()
      } else {
        resolve(results)
      }
    }
  })
}

// ============================================================================
// EXPORT / IMPORT
// ============================================================================

/**
 * Export all data as JSON
 */
export async function exportAllData(): Promise<string> {
  const state = await loadState()
  const history = await getStateHistory(100)
  
  const exportData = {
    version: DB_VERSION,
    exportedAt: Date.now(),
    state,
    history
  }
  
  return JSON.stringify(exportData, null, 2)
}

/**
 * Import data from JSON export
 */
export async function importData(json: string): Promise<void> {
  const data = JSON.parse(json)
  
  if (data.version !== DB_VERSION) {
    console.warn('Import version mismatch, attempting migration...')
  }
  
  if (data.state) {
    await saveState(data.state)
  }
}

/**
 * Clear all data
 */
export async function clearAllData(): Promise<void> {
  const db = await initDB()
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      [STORES.STATE, STORES.JOURNAL, STORES.MEASUREMENTS, STORES.HISTORY],
      'readwrite'
    )
    
    transaction.onerror = () => reject(transaction.error)
    transaction.oncomplete = () => resolve()

    for (const storeName of Object.values(STORES)) {
      transaction.objectStore(storeName).clear()
    }
  })
}

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Check if IndexedDB is available
 */
export function isIndexedDBAvailable(): boolean {
  return typeof indexedDB !== 'undefined'
}

/**
 * Get database size estimate
 */
export async function getDatabaseSize(): Promise<number> {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    const estimate = await navigator.storage.estimate()
    return estimate.usage || 0
  }
  return 0
}
