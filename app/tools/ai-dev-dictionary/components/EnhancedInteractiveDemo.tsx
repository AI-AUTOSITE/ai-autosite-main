// app/tools/ai-dev-dictionary/components/EnhancedInteractiveDemo.tsx

'use client'

import { useState } from 'react'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { allDemos } from './demos'
import Portal from './Portal'

interface EnhancedInteractiveDemoProps {
  term?: any
  termKey?: string
}

export default function EnhancedInteractiveDemo({ term, termKey }: EnhancedInteractiveDemoProps) {
  const [demoState, setDemoState] = useState<any>({
    modal: false,
    toast: false,
    alert: false,
    snackbar: false,
    confirmModal: false,
    layoutModal: false,
    dropdown: false,
    drawer: false,
    tooltip: false,
    checkbox: [false, false, false],
    radio: 'option1',
    switch: false,
    tabs: 0,
    pagination: 1,
    stepper: 1,
    carousel: 0,
    progress: 0,
  })

  const [notifications, setNotifications] = useState<any[]>([])

  const demoKey = termKey || term?.key || term?.id
  
  // Toast add function
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now()
    const newToast = { id, message, type }
    setNotifications(prev => [...prev, newToast])
    setTimeout(() => {
      setNotifications(prev => prev.filter(t => t.id !== id))
    }, 3000)
  }

  // Demo category classification
  const notificationDemos = ['toast', 'alert', 'modal', 'snackbar', 'push-notification', 'confirmation-modal']
  const layoutDemos = ['sidebar', 'header', 'footer', 'grid', 'hero', 'sticky-header', 'navbar', 'mega-menu']
  
  const isNotificationDemo = notificationDemos.includes(demoKey)
  const isLayoutDemo = layoutDemos.includes(demoKey)

  const demo = allDemos[demoKey]

  if (!demo) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>Demo not available for: {demoKey}</p>
      </div>
    )
  }

  // Notification demo special handling
  if (isNotificationDemo) {
    return (
      <>
        {/* Trigger button area */}
        <div className="h-32 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 border border-white/10 flex items-center justify-center">
          {demoKey === 'toast' && (
            <button
              onClick={() => addToast('Success! Action completed.', 'success')}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Show Toast Notification
            </button>
          )}
          
          {demoKey === 'alert' && (
            <button
              onClick={() => {
                setDemoState({ ...demoState, alert: true })
                setTimeout(() => {
                  setDemoState((prev: any) => ({ ...prev, alert: false }))
                }, 5000)
              }}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
            >
              Show Alert
            </button>
          )}
          
          {demoKey === 'modal' && (
            <button
              onClick={() => setDemoState({ ...demoState, modal: true })}
              className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600"
            >
              Open Modal
            </button>
          )}
          
          {demoKey === 'snackbar' && (
            <button
              onClick={() => {
                setDemoState({ ...demoState, snackbar: true })
                setTimeout(() => {
                  setDemoState((prev: any) => ({ ...prev, snackbar: false }))
                }, 3000)
              }}
              className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
            >
              Show Snackbar
            </button>
          )}
        </div>

        {/* Display on actual screen via Portal */}
        <Portal>
          {/* Toast Container */}
          {notifications.length > 0 && (
            <div className="fixed bottom-4 right-4 z-[9999] space-y-2">
              {notifications.map(toast => (
                <div
                  key={toast.id}
                  className={`px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-slideInRight ${
                    toast.type === 'success' ? 'bg-green-500' :
                    toast.type === 'error' ? 'bg-red-500' :
                    'bg-blue-500'
                  } text-white`}
                >
                  {toast.type === 'success' && <CheckCircle className="w-5 h-5" />}
                  {toast.type === 'error' && <X className="w-5 h-5" />}
                  {toast.type === 'info' && <Info className="w-5 h-5" />}
                  <span>{toast.message}</span>
                </div>
              ))}
            </div>
          )}

          {/* Alert */}
          {demoState.alert && (
            <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[9999] w-full max-w-2xl px-4 animate-slideDown">
              <div className="border-l-4 border-yellow-500 bg-yellow-900/90 backdrop-blur-xl p-4 rounded shadow-2xl">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="text-yellow-400 font-semibold mb-1">Warning</h4>
                    <p className="text-gray-300 text-sm">Please review your settings before continuing.</p>
                  </div>
                  <button
                    onClick={() => setDemoState({ ...demoState, alert: false })}
                    className="ml-3 p-1 hover:bg-white/10 rounded"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal */}
          {demoState.modal && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-fadeIn">
              <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setDemoState({ ...demoState, modal: false })}
              />
              <div className="relative bg-slate-800 rounded-lg p-6 max-w-sm w-full border border-white/20 shadow-2xl animate-slideUp">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-white">Example Modal</h3>
                  <button
                    onClick={() => setDemoState({ ...demoState, modal: false })}
                    className="p-1 hover:bg-white/10 rounded"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
                <p className="text-gray-300 mb-4">This is a modal dialog that appears over the entire screen.</p>
                <button
                  onClick={() => setDemoState({ ...demoState, modal: false })}
                  className="w-full px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600"
                >
                  Got it!
                </button>
              </div>
            </div>
          )}

          {/* Snackbar */}
          {demoState.snackbar && (
            <div className="fixed bottom-4 left-4 right-4 z-[9999] max-w-md mx-auto animate-slideUp">
              <div className="px-4 py-3 bg-gray-900 text-white rounded-lg shadow-xl flex items-center justify-between">
                <span>Item has been archived</span>
                <button 
                  onClick={() => addToast('Item restored', 'success')}
                  className="text-cyan-400 font-medium hover:text-cyan-300"
                >
                  UNDO
                </button>
              </div>
            </div>
          )}
        </Portal>
      </>
    )
  }

  // Layout demo (display in large modal)
  if (isLayoutDemo) {
    return (
      <>
        <div className="h-32 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 border border-white/10 flex items-center justify-center">
          <button
            onClick={() => setDemoState({ ...demoState, layoutModal: true })}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
          >
            View Full Demo
          </button>
        </div>

        {demoState.layoutModal && (
          <Portal>
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-fadeIn">
              <div 
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={() => setDemoState({ ...demoState, layoutModal: false })}
              />
              <div className="relative bg-slate-900 rounded-lg max-w-5xl w-full max-h-[85vh] overflow-hidden border border-white/20 shadow-2xl animate-slideUp">
                <div className="sticky top-0 bg-slate-800 p-4 border-b border-white/10 flex justify-between items-center z-10">
                  <h3 className="text-lg font-semibold text-white capitalize">
                    {demoKey.replace('-', ' ')} Demo
                  </h3>
                  <button
                    onClick={() => setDemoState({ ...demoState, layoutModal: false })}
                    className="p-2 hover:bg-white/10 rounded"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
                <div className="p-6 overflow-auto">
                  <div className="min-h-[400px]">
                    {demo(demoState, setDemoState)}
                  </div>
                </div>
              </div>
            </div>
          </Portal>
        )}
      </>
    )
  }

  // Other regular demos
  return demo(demoState, setDemoState)
}