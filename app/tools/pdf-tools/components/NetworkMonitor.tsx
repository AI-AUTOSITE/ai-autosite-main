// pdf-tools/components/NetworkMonitor.tsx

import React, { useState, useEffect, useRef } from 'react'
import { NetworkActivity } from '../types/privacy'

export const NetworkMonitor: React.FC = () => {
  const [activities, setActivities] = useState<NetworkActivity[]>([])
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMonitoring, setIsMonitoring] = useState(true)
  const originalFetchRef = useRef<typeof fetch>()

  useEffect(() => {
    if (!isMonitoring) return

    // Store original fetch
    originalFetchRef.current = window.fetch

    // Intercept all fetch requests
    window.fetch = new Proxy(window.fetch, {
      apply: (target, thisArg, args) => {
        const [url, options] = args
        const urlString = typeof url === 'string' ? url : url.toString()

        // Determine type of connection
        let type: NetworkActivity['type'] = 'external'
        if (urlString.includes(window.location.hostname)) {
          type = 'internal'
        }
        // Block any attempts to connect to your server (for privacy)
        // Add your domain here if needed
        if (urlString.includes('your-analytics-domain.com')) {
          type = 'blocked'
          console.warn('[Privacy] Blocked connection to:', urlString)
          return Promise.reject(new Error('Connection blocked for privacy'))
        }

        // Log the activity
        const activity: NetworkActivity = {
          timestamp: Date.now(),
          url: urlString,
          method: options?.method || 'GET',
          type,
          size: options?.body ? (typeof options.body === 'string' ? options.body.length : 0) : 0,
        }

        setActivities((prev) => [activity, ...prev].slice(0, 50)) // Keep last 50

        // Execute the original fetch
        return target.apply(thisArg, args)
      },
    })

    // Cleanup
    return () => {
      if (originalFetchRef.current) {
        window.fetch = originalFetchRef.current
      }
    }
  }, [isMonitoring])

  const getActivityIcon = (type: NetworkActivity['type']) => {
    switch (type) {
      case 'internal':
        return '🟢'
      case 'external':
        return '🟡'
      case 'blocked':
        return '🔴'
    }
  }

  const getActivityColor = (type: NetworkActivity['type']) => {
    switch (type) {
      case 'internal':
        return 'text-green-500'
      case 'external':
        return 'text-yellow-500'
      case 'blocked':
        return 'text-red-500'
    }
  }

  const formatUrl = (url: string) => {
    try {
      const urlObj = new URL(url)
      return `${urlObj.hostname}${urlObj.pathname}`
    } catch {
      return url
    }
  }

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString()
  }

  const clearActivities = () => {
    setActivities([])
  }

  const externalCount = activities.filter((a) => a.type === 'external').length
  const blockedCount = activities.filter((a) => a.type === 'blocked').length

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {/* Compact View */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="bg-gray-900 text-white rounded-full px-4 py-2 shadow-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
        >
          <span className="relative flex h-3 w-3">
            {activities.length === 0 ? (
              <span className="absolute inline-flex h-full w-full rounded-full bg-green-400"></span>
            ) : (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
              </>
            )}
          </span>
          <span className="text-sm font-medium">
            Network Monitor {activities.length > 0 && `(${activities.length})`}
          </span>
        </button>
      )}

      {/* Expanded View */}
      {isExpanded && (
        <div className="bg-white rounded-lg shadow-2xl border border-gray-200 w-96 max-h-96 flex flex-col animate-slideUp">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">Network Activity</h3>
              {activities.length === 0 ? (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                  All Clear
                </span>
              ) : (
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                  {activities.length} requests
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMonitoring(!isMonitoring)}
                className={`text-xs px-2 py-1 rounded ${
                  isMonitoring ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}
              >
                {isMonitoring ? 'Monitoring' : 'Paused'}
              </button>
              <button
                onClick={clearActivities}
                className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Clear
              </button>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          {activities.length > 0 && (
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex items-center gap-4 text-xs">
              <span className="text-gray-600">Total: {activities.length}</span>
              {externalCount > 0 && (
                <span className="text-yellow-600">External: {externalCount}</span>
              )}
              {blockedCount > 0 && <span className="text-red-600">Blocked: {blockedCount}</span>}
            </div>
          )}

          {/* Activity List */}
          <div className="flex-1 overflow-y-auto">
            {activities.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <div className="text-4xl mb-2">🛡️</div>
                <p className="text-gray-500 text-sm">No network activity detected</p>
                <p className="text-gray-400 text-xs mt-1">All processing is happening locally</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {activities.map((activity, index) => (
                  <div key={index} className="px-4 py-2 hover:bg-gray-50">
                    <div className="flex items-start gap-2">
                      <span className="text-lg mt-0.5">{getActivityIcon(activity.type)}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-medium ${getActivityColor(activity.type)}`}
                          >
                            {activity.method}
                          </span>
                          <span className="text-xs text-gray-400">
                            {formatTime(activity.timestamp)}
                          </span>
                        </div>
                        <div className="text-xs text-gray-600 truncate mt-0.5">
                          {formatUrl(activity.url)}
                        </div>
                        {activity.size > 0 && (
                          <div className="text-xs text-gray-400 mt-0.5">
                            Data sent: {(activity.size / 1024).toFixed(2)} KB
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
            <p className="text-xs text-gray-500 text-center">
              🔒 Monitoring all network connections for your privacy
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
