// app/tools/code-reader/components/AutoSaveIndicator.tsx
'use client'

import React, { useState } from 'react'
import { 
  Save, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  RotateCcw,
  Trash2,
  ChevronDown,
  CloudOff,
  Cloud
} from 'lucide-react'

interface SavedSession {
  id: string
  timestamp: number
  projectName: string
  lastAction: string
}

interface AutoSaveIndicatorProps {
  isAutoSaveEnabled: boolean
  lastSaveTime: Date | null
  hasUnsavedChanges: boolean
  isRecoveryAvailable: boolean
  isSaving: boolean
  saveError: string | null
  savedSessions?: SavedSession[]
  onSave: () => void
  onRecover: () => void
  onLoadSession: (sessionId: string) => void
  onDeleteSession: (sessionId: string) => void
  onClearAll: () => void
  onToggleAutoSave: (enabled: boolean) => void
}

export default function AutoSaveIndicator({
  isAutoSaveEnabled,
  lastSaveTime,
  hasUnsavedChanges,
  isRecoveryAvailable,
  isSaving,
  saveError,
  savedSessions = [],
  onSave,
  onRecover,
  onLoadSession,
  onDeleteSession,
  onClearAll,
  onToggleAutoSave
}: AutoSaveIndicatorProps) {
  const [showSessions, setShowSessions] = useState(false)
  const [confirmClear, setConfirmClear] = useState(false)

  const formatTimeAgo = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
    
    if (seconds < 60) return 'just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return `${Math.floor(seconds / 86400)}d ago`
  }

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp)
    const now = new Date()
    const isToday = date.toDateString() === now.toDateString()
    const isYesterday = new Date(now.getTime() - 86400000).toDateString() === date.toDateString()
    
    if (isToday) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    }
    if (isYesterday) {
      return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="relative">
      {/* Main Status Bar */}
      <div className="flex items-center gap-3 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
        {/* Auto-save Toggle */}
        <button
          onClick={() => onToggleAutoSave(!isAutoSaveEnabled)}
          className={`flex items-center gap-1.5 px-2 py-1 rounded transition-colors ${
            isAutoSaveEnabled 
              ? 'text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20'
              : 'text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
          title={isAutoSaveEnabled ? 'Auto-save enabled' : 'Auto-save disabled'}
        >
          {isAutoSaveEnabled ? (
            <Cloud className="w-4 h-4" />
          ) : (
            <CloudOff className="w-4 h-4" />
          )}
          <span className="text-xs font-medium">
            {isAutoSaveEnabled ? 'Auto' : 'Off'}
          </span>
        </button>

        {/* Save Status */}
        <div className="flex items-center gap-2 text-sm">
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-gray-600 dark:text-gray-400">Saving...</span>
            </>
          ) : saveError ? (
            <>
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span className="text-red-600 dark:text-red-400">Save failed</span>
            </>
          ) : lastSaveTime ? (
            <>
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-gray-600 dark:text-gray-400">
                Saved {formatTimeAgo(lastSaveTime)}
              </span>
            </>
          ) : (
            <>
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-gray-500 dark:text-gray-400">No saves yet</span>
            </>
          )}
        </div>

        {/* Manual Save Button */}
        {hasUnsavedChanges && (
          <button
            onClick={onSave}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-2 py-1 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded text-xs font-medium transition-colors"
          >
            <Save className="w-3 h-3" />
            Save Now
          </button>
        )}

        {/* Recovery Alert */}
        {isRecoveryAvailable && !hasUnsavedChanges && (
          <button
            onClick={onRecover}
            className="flex items-center gap-1.5 px-2 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded text-xs font-medium animate-pulse"
          >
            <RotateCcw className="w-3 h-3" />
            Recover Last Session
          </button>
        )}

        {/* Session History Toggle */}
        <button
          onClick={() => setShowSessions(!showSessions)}
          className="ml-auto flex items-center gap-1 px-2 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
        >
          <Clock className="w-4 h-4" />
          <span className="text-xs">History</span>
          <ChevronDown className={`w-3 h-3 transition-transform ${showSessions ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Session History Dropdown */}
      {showSessions && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900 dark:text-white">Saved Sessions</h3>
              {savedSessions.length > 0 && (
                <button
                  onClick={() => setConfirmClear(true)}
                  className="text-xs text-red-500 hover:text-red-600"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {savedSessions.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
                No saved sessions
              </div>
            ) : (
              <div className="p-2">
                {savedSessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-gray-900 dark:text-white truncate">
                        {session.projectName}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(session.timestamp)} • {session.lastAction}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      <button
                        onClick={() => onLoadSession(session.id)}
                        className="p-1 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                        title="Load this session"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteSession(session.id)}
                        className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                        title="Delete this session"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Clear All Confirmation */}
          {confirmClear && (
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-red-50 dark:bg-red-900/20">
              <p className="text-sm text-red-600 dark:text-red-400 mb-2">
                Are you sure you want to clear all saved sessions?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onClearAll()
                    setConfirmClear(false)
                    setShowSessions(false)
                  }}
                  className="flex-1 px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setConfirmClear(false)}
                  className="flex-1 px-3 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}