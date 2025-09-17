// app/tools/code-reader/hooks/useAutoSave.ts
'use client'

import { useEffect, useCallback, useRef, useState } from 'react'
import { FileData, ProjectStructure } from '../lib/types'

interface AutoSaveData {
  id: string
  timestamp: number
  projectName: string
  files: FileData[]
  structure: ProjectStructure | null
  githubUrl?: string
  selectedFiles?: string[]
  compressionSettings?: any
  lastAction: string
}

interface AutoSaveOptions {
  interval?: number // Auto-save interval in milliseconds (default: 30000 = 30s)
  maxHistory?: number // Maximum number of saves to keep (default: 10)
  dbName?: string // IndexedDB database name
  storeName?: string // IndexedDB store name
}

const DEFAULT_OPTIONS: Required<AutoSaveOptions> = {
  interval: 30000, // 30 seconds
  maxHistory: 10,
  dbName: 'CodeReaderAutoSave',
  storeName: 'analyses'
}

export function useAutoSave(
  data: {
    files: FileData[]
    structure: ProjectStructure | null
    githubUrl?: string
    selectedFiles?: string[]
    compressionSettings?: any
  },
  options: AutoSaveOptions = {}
) {
  const opts = { ...DEFAULT_OPTIONS, ...options }
  const [isAutoSaveEnabled, setIsAutoSaveEnabled] = useState(true)
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isRecoveryAvailable, setIsRecoveryAvailable] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  
  const dbRef = useRef<IDBDatabase | null>(null)
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null)
  const lastDataHashRef = useRef<string>('')

  // Initialize IndexedDB
  const initDB = useCallback(async (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(opts.dbName, 1)
      
      request.onerror = () => {
        console.error('Failed to open IndexedDB:', request.error)
        reject(request.error)
      }
      
      request.onsuccess = () => {
        const db = request.result
        dbRef.current = db
        resolve(db)
      }
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        
        // Create object store if it doesn't exist
        if (!db.objectStoreNames.contains(opts.storeName)) {
          const store = db.createObjectStore(opts.storeName, { keyPath: 'id' })
          store.createIndex('timestamp', 'timestamp', { unique: false })
          store.createIndex('projectName', 'projectName', { unique: false })
        }
      }
    })
  }, [opts.dbName, opts.storeName])

  // Generate a simple hash for data comparison
  const generateDataHash = useCallback((data: any): string => {
    try {
      const str = JSON.stringify({
        filesCount: data.files?.length || 0,
        fileNames: data.files?.map((f: FileData) => f.path).sort(),
        selectedFiles: data.selectedFiles?.sort(),
        githubUrl: data.githubUrl,
        compressionEnabled: data.compressionSettings?.enabled
      })
      
      // Simple hash function
      let hash = 0
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i)
        hash = ((hash << 5) - hash) + char
        hash = hash & hash // Convert to 32bit integer
      }
      return hash.toString(36)
    } catch (error) {
      console.error('Error generating hash:', error)
      return Math.random().toString(36)
    }
  }, [])

  // Save data to IndexedDB
  const saveToIndexedDB = useCallback(async (saveData: AutoSaveData): Promise<void> => {
    try {
      const db = dbRef.current || await initDB()
      const transaction = db.transaction([opts.storeName], 'readwrite')
      const store = transaction.objectStore(opts.storeName)
      
      // Add the new save
      await new Promise<void>((resolve, reject) => {
        const request = store.put(saveData)
        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
      })
      
      // Clean up old saves if exceeding max history
      const allSaves = await new Promise<AutoSaveData[]>((resolve, reject) => {
        const request = store.index('timestamp').openCursor(null, 'prev')
        const saves: AutoSaveData[] = []
        
        request.onsuccess = (event) => {
          const cursor = (event.target as IDBRequest).result
          if (cursor) {
            saves.push(cursor.value)
            cursor.continue()
          } else {
            resolve(saves)
          }
        }
        request.onerror = () => reject(request.error)
      })
      
      // Delete old saves if exceeding limit
      if (allSaves.length > opts.maxHistory) {
        const toDelete = allSaves.slice(opts.maxHistory)
        for (const save of toDelete) {
          store.delete(save.id)
        }
      }
      
      transaction.commit()
    } catch (error) {
      console.error('Failed to save to IndexedDB:', error)
      throw error
    }
  }, [initDB, opts.storeName, opts.maxHistory])

  // Manual save function
  const save = useCallback(async (action: string = 'manual'): Promise<void> => {
    if (!data.files || data.files.length === 0) {
      return
    }
    
    const currentHash = generateDataHash(data)
    if (currentHash === lastDataHashRef.current && action === 'auto') {
      // No changes, skip auto-save
      return
    }
    
    setIsSaving(true)
    setSaveError(null)
    
    try {
      const saveData: AutoSaveData = {
        id: `save_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
        projectName: data.githubUrl ? 
          data.githubUrl.split('/').pop() || 'Unnamed Project' : 
          'Local Project',
        files: data.files,
        structure: data.structure,
        githubUrl: data.githubUrl,
        selectedFiles: data.selectedFiles,
        compressionSettings: data.compressionSettings,
        lastAction: action
      }
      
      await saveToIndexedDB(saveData)
      
      lastDataHashRef.current = currentHash
      setLastSaveTime(new Date())
      setHasUnsavedChanges(false)
      
      console.log(`Auto-save completed (${action})`)
    } catch (error) {
      console.error('Auto-save failed:', error)
      setSaveError(error instanceof Error ? error.message : 'Save failed')
    } finally {
      setIsSaving(false)
    }
  }, [data, generateDataHash, saveToIndexedDB])

  // Load latest save
  const loadLatestSave = useCallback(async (): Promise<AutoSaveData | null> => {
    try {
      const db = dbRef.current || await initDB()
      const transaction = db.transaction([opts.storeName], 'readonly')
      const store = transaction.objectStore(opts.storeName)
      const index = store.index('timestamp')
      
      return new Promise((resolve, reject) => {
        const request = index.openCursor(null, 'prev')
        request.onsuccess = (event) => {
          const cursor = (event.target as IDBRequest).result
          resolve(cursor ? cursor.value : null)
        }
        request.onerror = () => reject(request.error)
      })
    } catch (error) {
      console.error('Failed to load latest save:', error)
      return null
    }
  }, [initDB, opts.storeName])

  // Get all saved sessions
  const getSavedSessions = useCallback(async (): Promise<AutoSaveData[]> => {
    try {
      const db = dbRef.current || await initDB()
      const transaction = db.transaction([opts.storeName], 'readonly')
      const store = transaction.objectStore(opts.storeName)
      const index = store.index('timestamp')
      
      return new Promise((resolve, reject) => {
        const request = index.openCursor(null, 'prev')
        const saves: AutoSaveData[] = []
        
        request.onsuccess = (event) => {
          const cursor = (event.target as IDBRequest).result
          if (cursor && saves.length < opts.maxHistory) {
            saves.push(cursor.value)
            cursor.continue()
          } else {
            resolve(saves)
          }
        }
        request.onerror = () => reject(request.error)
      })
    } catch (error) {
      console.error('Failed to get saved sessions:', error)
      return []
    }
  }, [initDB, opts.storeName, opts.maxHistory])

  // Delete a specific save
  const deleteSave = useCallback(async (saveId: string): Promise<void> => {
    try {
      const db = dbRef.current || await initDB()
      const transaction = db.transaction([opts.storeName], 'readwrite')
      const store = transaction.objectStore(opts.storeName)
      
      await new Promise<void>((resolve, reject) => {
        const request = store.delete(saveId)
        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
      })
      
      transaction.commit()
    } catch (error) {
      console.error('Failed to delete save:', error)
      throw error
    }
  }, [initDB, opts.storeName])

  // Clear all saves
  const clearAllSaves = useCallback(async (): Promise<void> => {
    try {
      const db = dbRef.current || await initDB()
      const transaction = db.transaction([opts.storeName], 'readwrite')
      const store = transaction.objectStore(opts.storeName)
      
      await new Promise<void>((resolve, reject) => {
        const request = store.clear()
        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
      })
      
      transaction.commit()
      setIsRecoveryAvailable(false)
    } catch (error) {
      console.error('Failed to clear saves:', error)
      throw error
    }
  }, [initDB, opts.storeName])

  // Check for recovery data on mount
  useEffect(() => {
    const checkRecovery = async () => {
      const latestSave = await loadLatestSave()
      if (latestSave) {
        const hourAgo = Date.now() - (60 * 60 * 1000)
        setIsRecoveryAvailable(latestSave.timestamp > hourAgo)
      }
    }
    checkRecovery()
  }, [loadLatestSave])

  // Auto-save timer
  useEffect(() => {
    if (!isAutoSaveEnabled) {
      if (saveTimerRef.current) {
        clearInterval(saveTimerRef.current)
        saveTimerRef.current = null
      }
      return
    }
    
    // Set up auto-save interval
    saveTimerRef.current = setInterval(() => {
      save('auto')
    }, opts.interval)
    
    return () => {
      if (saveTimerRef.current) {
        clearInterval(saveTimerRef.current)
      }
    }
  }, [isAutoSaveEnabled, save, opts.interval])

  // Track unsaved changes
  useEffect(() => {
    const currentHash = generateDataHash(data)
    if (currentHash !== lastDataHashRef.current && lastDataHashRef.current !== '') {
      setHasUnsavedChanges(true)
    }
  }, [data, generateDataHash])

  // Save on window unload
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        save('unload')
        e.preventDefault()
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?'
      }
    }
    
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasUnsavedChanges, save])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (dbRef.current) {
        dbRef.current.close()
      }
    }
  }, [])

  return {
    // State
    isAutoSaveEnabled,
    lastSaveTime,
    hasUnsavedChanges,
    isRecoveryAvailable,
    isSaving,
    saveError,
    
    // Actions
    save: () => save('manual'),
    loadLatestSave,
    getSavedSessions,
    deleteSave,
    clearAllSaves,
    setAutoSaveEnabled: setIsAutoSaveEnabled,  // ← ここを修正
    
    // Recovery helper
    recover: async () => {
      const latestSave = await loadLatestSave()
      if (latestSave) {
        return {
          files: latestSave.files,
          structure: latestSave.structure,
          githubUrl: latestSave.githubUrl,
          selectedFiles: latestSave.selectedFiles,
          compressionSettings: latestSave.compressionSettings
        }
      }
      return null
    }
  }
}