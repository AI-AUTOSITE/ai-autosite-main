// app/tools/ai-dev-dictionary/components/InteractiveDemo.tsx
'use client'

import { useState } from 'react'
import { X, Bell, ChevronDown, ChevronRight, Info, CheckCircle, AlertCircle, Play } from 'lucide-react'

interface InteractiveDemoProps {
  term: any
}

export default function InteractiveDemo({ term }: InteractiveDemoProps) {
  const [demoState, setDemoState] = useState<any>({
    modal: false,
    toast: false,
    dropdown: false,
    accordion: null,
    tabs: 0,
    tooltip: false,
    drawer: false,
    alert: true,
    progress: 0
  })

  const demos: Record<string, JSX.Element> = {
    modal: (
      <div className="relative h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-4 border border-white/10">
        <button
          onClick={() => setDemoState({ ...demoState, modal: true })}
          className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
        >
          Open Modal
        </button>
        
        {demoState.modal && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg animate-fadeIn">
            <div className="bg-slate-800 rounded-lg p-6 max-w-sm w-full mx-4 border border-white/20 animate-slideUp">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-white">Example Modal</h3>
                <button
                  onClick={() => setDemoState({ ...demoState, modal: false })}
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <p className="text-gray-300 mb-4">This is a modal dialog. It appears on top of other content and requires user interaction.</p>
              <button
                onClick={() => setDemoState({ ...demoState, modal: false })}
                className="w-full px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
              >
                Close Modal
              </button>
            </div>
          </div>
        )}
      </div>
    ),

    toast: (
      <div className="relative h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-4 border border-white/10">
        <button
          onClick={() => {
            setDemoState({ ...demoState, toast: true })
            setTimeout(() => setDemoState({ ...demoState, toast: false }), 3000)
          }}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          Show Toast
        </button>
        
        {demoState.toast && (
          <div className="absolute bottom-4 right-4 px-4 py-3 bg-green-500 text-white rounded-lg shadow-lg flex items-center gap-2 animate-slideInRight">
            <CheckCircle className="w-5 h-5" />
            <span>Success! Operation completed.</span>
          </div>
        )}
      </div>
    ),

    dropdown: (
      <div className="relative h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-4 border border-white/10">
        <button
          onClick={() => setDemoState({ ...demoState, dropdown: !demoState.dropdown })}
          className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors flex items-center gap-2 border border-white/20"
        >
          Select Option
          <ChevronDown className={`w-4 h-4 transition-transform ${demoState.dropdown ? 'rotate-180' : ''}`} />
        </button>
        
        {demoState.dropdown && (
          <div className="absolute top-14 left-4 bg-slate-800 rounded-lg shadow-xl border border-white/20 overflow-hidden animate-expand">
            {['Option 1', 'Option 2', 'Option 3'].map((option) => (
              <button
                key={option}
                onClick={() => setDemoState({ ...demoState, dropdown: false })}
                className="w-full px-4 py-2 text-left text-gray-300 hover:bg-white/10 transition-colors"
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    ),

    accordion: (
      <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-4 border border-white/10 overflow-y-auto">
        {['Section 1', 'Section 2', 'Section 3'].map((section, index) => (
          <div key={section} className="mb-2">
            <button
              onClick={() => setDemoState({ ...demoState, accordion: demoState.accordion === index ? null : index })}
              className="w-full px-4 py-3 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-colors flex items-center justify-between border border-white/10"
            >
              <span>{section}</span>
              <ChevronRight className={`w-4 h-4 transition-transform ${demoState.accordion === index ? 'rotate-90' : ''}`} />
            </button>
            {demoState.accordion === index && (
              <div className="mt-2 p-4 bg-white/5 rounded-lg text-gray-300 animate-expand border border-white/10">
                This is the content for {section}. Accordions are great for organizing information in collapsible sections.
              </div>
            )}
          </div>
        ))}
      </div>
    ),

    tabs: (
      <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg overflow-hidden border border-white/10">
        <div className="flex border-b border-white/10">
          {['Tab 1', 'Tab 2', 'Tab 3'].map((tab, index) => (
            <button
              key={tab}
              onClick={() => setDemoState({ ...demoState, tabs: index })}
              className={`px-6 py-3 font-medium transition-colors relative ${
                demoState.tabs === index
                  ? 'text-cyan-400 bg-white/5'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab}
              {demoState.tabs === index && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400"></div>
              )}
            </button>
          ))}
        </div>
        <div className="p-6">
          <div className="text-gray-300 animate-fadeIn">
            Content for Tab {demoState.tabs + 1}. Tabs help organize related content into different views.
          </div>
        </div>
      </div>
    ),

    tooltip: (
      <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-4 border border-white/10 flex items-center justify-center">
        <div className="relative">
          <button
            onMouseEnter={() => setDemoState({ ...demoState, tooltip: true })}
            onMouseLeave={() => setDemoState({ ...demoState, tooltip: false })}
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors flex items-center gap-2"
          >
            <Info className="w-4 h-4" />
            Hover for Tooltip
          </button>
          
          {demoState.tooltip && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-xl animate-fadeIn border border-white/20">
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900 border-r border-b border-white/20"></div>
              This is helpful information!
            </div>
          )}
        </div>
      </div>
    ),

    drawer: (
      <div className="relative h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg overflow-hidden border border-white/10">
        <div className="p-4">
          <button
            onClick={() => setDemoState({ ...demoState, drawer: true })}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            Open Drawer
          </button>
        </div>
        
        {demoState.drawer && (
          <>
            <div 
              className="absolute inset-0 bg-black/50 animate-fadeIn"
              onClick={() => setDemoState({ ...demoState, drawer: false })}
            />
            <div className="absolute left-0 top-0 h-full w-64 bg-slate-800 shadow-xl animate-slideInLeft border-r border-white/20">
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-white">Navigation Drawer</h3>
                  <button
                    onClick={() => setDemoState({ ...demoState, drawer: false })}
                    className="p-1 hover:bg-white/10 rounded transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
                <nav className="space-y-2">
                  {['Home', 'Profile', 'Settings', 'Logout'].map((item) => (
                    <button
                      key={item}
                      className="w-full px-3 py-2 text-left text-gray-300 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      {item}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </>
        )}
      </div>
    ),

    badge: (
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

    skeleton: (
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

    spinner: (
      <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 border border-white/10 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-gray-600 border-t-cyan-400 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-400">Loading content...</p>
      </div>
    ),

    progress: (
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
            Start Progress
          </button>
        </div>
      </div>
    ),

    alert: (
      <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 border border-white/10">
        <div className="space-y-4">
          {demoState.alert && (
            <div className="border-l-4 border-yellow-500 bg-yellow-500/10 p-4 rounded animate-fadeIn">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="text-yellow-400 font-semibold mb-1">Warning</h4>
                  <p className="text-gray-300 text-sm">This is an important alert message that requires your attention.</p>
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
    )
  }

  return (
    <div className="w-full">
      {demos[term.demoType] || (
        <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 border border-white/10 flex items-center justify-center">
          <span className="text-gray-500">Demo not available</span>
        </div>
      )}
    </div>
  )
}