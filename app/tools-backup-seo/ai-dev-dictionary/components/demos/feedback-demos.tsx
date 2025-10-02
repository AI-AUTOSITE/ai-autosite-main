// app/tools/ai-dev-dictionary/components/demos/feedback-demos.tsx

import { CheckCircle, AlertCircle, X, Bell, Search } from 'lucide-react'
import type { DemoFunction } from './index'

export const feedbackDemos: Record<string, DemoFunction> = {
  // TOAST DEMO
  toast: (demoState, setDemoState) => (
    <div className="relative h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-4 border border-white/10">
      <button
        onClick={() => {
          setDemoState({ ...demoState, toast: true })
          setTimeout(() => setDemoState({ ...demoState, toast: false }), 3000)
        }}
        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
      >
        Show Toast Notification
      </button>
      
      {demoState.toast && (
        <div className="absolute bottom-4 right-4 px-4 py-3 bg-green-500 text-white rounded-lg shadow-lg flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          <span>Success! Action completed.</span>
        </div>
      )}
    </div>
  ),

  // ALERT DEMO
  alert: (demoState, setDemoState) => (
    <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 border border-white/10">
      <div className="space-y-4">
        {demoState.alert && (
          <div className="border-l-4 border-yellow-500 bg-yellow-500/10 p-4 rounded">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="text-yellow-400 font-semibold mb-1">Warning</h4>
                <p className="text-gray-300 text-sm">Please review your settings before continuing.</p>
              </div>
              <button
                onClick={() => setDemoState({ ...demoState, alert: false })}
                className="ml-3 p-1 hover:bg-white/10 rounded transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        )}
        {!demoState.alert && (
          <button
            onClick={() => setDemoState({ ...demoState, alert: true })}
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
          >
            Show Alert
          </button>
        )}
      </div>
    </div>
  ),

  // BADGE DEMO
  badge: (demoState, setDemoState) => (
    <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 border border-white/10">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-gray-300">Status:</span>
          <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium border border-green-500/30">
            Active
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-gray-300">Priority:</span>
          <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-medium border border-red-500/30">
            High
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-gray-300">Notifications:</span>
          <div className="relative">
            <Bell className="w-6 h-6 text-gray-400" />
            <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-red-500 text-white rounded-full text-xs font-bold">
              3
            </span>
          </div>
        </div>
      </div>
    </div>
  ),

  // PROGRESS BAR DEMO
  progress: (demoState, setDemoState) => (
    <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 border border-white/10">
      <div className="space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-300">Upload Progress</span>
            <span className="text-cyan-400">{demoState.progress}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-cyan-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${demoState.progress}%` }}
            ></div>
          </div>
        </div>
        <button
          onClick={() => {
            let progress = 0
            const interval = setInterval(() => {
              progress += 10
              setDemoState((prev: any) => ({ ...prev, progress }))
              if (progress >= 100) {
                clearInterval(interval)
                setTimeout(() => setDemoState((prev: any) => ({ ...prev, progress: 0 })), 1000)
              }
            }, 200)
          }}
          className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
        >
          Start Upload
        </button>
      </div>
    </div>
  ),

  // SPINNER DEMO
  spinner: (demoState, setDemoState) => (
    <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 border border-white/10 flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-gray-600 border-t-cyan-400 rounded-full animate-spin mb-4"></div>
      <p className="text-gray-400">Loading content...</p>
    </div>
  ),

  // SKELETON DEMO
  skeleton: (demoState, setDemoState) => (
    <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 border border-white/10">
      <div className="space-y-4">
        <div className="h-8 bg-gray-700 rounded animate-pulse"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-700 rounded w-5/6 animate-pulse"></div>
          <div className="h-4 bg-gray-700 rounded w-4/6 animate-pulse"></div>
        </div>
        <div className="flex gap-3">
          <div className="w-16 h-16 bg-gray-700 rounded animate-pulse"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-700 rounded w-3/4 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  ),

  // EMPTY STATE DEMO
  empty: (demoState, setDemoState) => (
    <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 border border-white/10 flex flex-col items-center justify-center">
      <div className="text-gray-600 mb-4">
        <Search className="w-16 h-16" />
      </div>
      <h3 className="text-white font-semibold mb-2">No Results Found</h3>
      <p className="text-gray-400 text-sm text-center mb-4">Try adjusting your search or filters</p>
      <button className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors">
        Clear Filters
      </button>
    </div>
  ),

  // PUSH NOTIFICATION DEMO
  'push-notification': (demoState, setDemoState) => (
    <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-4 border border-white/10">
      <button 
        onClick={() => {
          if ('Notification' in window) {
            Notification.requestPermission().then(permission => {
              if (permission === 'granted') {
                new Notification('New Message', {
                  body: 'You have a new message from John',
                  icon: '/icon.png'
                })
              } else {
                alert('Please enable notifications in your browser settings')
              }
            })
          }
        }}
        className="px-4 py-2 bg-cyan-500 text-white rounded-lg mb-4"
      >
        Enable Notifications
      </button>
      <div className="bg-white/10 rounded-lg p-3 flex items-start gap-3">
        <Bell className="w-5 h-5 text-cyan-400 mt-0.5" />
        <div>
          <div className="text-white font-medium">New Message</div>
          <div className="text-gray-400 text-sm">You have a new message from John</div>
          <div className="text-gray-500 text-xs mt-1">2 minutes ago</div>
        </div>
      </div>
      <p className="text-gray-400 text-xs mt-4 text-center">Browser notification preview</p>
    </div>
  ),

  // LOADING OVERLAY DEMO
  'loading-overlay': (demoState, setDemoState) => (
    <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-4 border border-white/10 relative">
      <div className="space-y-3">
        <div className="p-3 bg-white/5 rounded">Content Area</div>
        <div className="p-3 bg-white/5 rounded">More Content</div>
      </div>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-600 border-t-cyan-400 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-white">Processing...</p>
        </div>
      </div>
    </div>
  ),

  // CONFIRMATION MODAL DEMO
  'confirmation-modal': (demoState, setDemoState) => (
    <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-4 border border-white/10 flex items-center justify-center">
      <div className="bg-slate-800 rounded-lg p-6 border border-white/20 max-w-sm">
        <h3 className="text-white font-semibold mb-3">Confirm Delete</h3>
        <p className="text-gray-400 text-sm mb-4">Are you sure you want to delete this item? This action cannot be undone.</p>
        <div className="flex gap-3">
          <button className="flex-1 px-4 py-2 bg-white/10 text-gray-300 rounded hover:bg-white/20">
            Cancel
          </button>
          <button className="flex-1 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
            Delete
          </button>
        </div>
      </div>
    </div>
  ),

  // SUCCESS STATE DEMO
  'success-state': (demoState, setDemoState) => (
    <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 border border-white/10 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10 text-green-400" />
        </div>
        <h3 className="text-white font-semibold mb-2">Success!</h3>
        <p className="text-gray-400 text-sm">Your changes have been saved</p>
      </div>
    </div>
  )
}