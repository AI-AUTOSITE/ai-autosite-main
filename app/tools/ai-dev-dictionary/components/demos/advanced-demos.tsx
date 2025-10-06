// app/tools/ai-dev-dictionary/components/demos/advanced-demos.tsx

import { ChevronDown, ChevronRight, Info, Menu, X, ArrowLeft, ArrowRight } from 'lucide-react'
import type { DemoFunction } from './index'

export const advancedDemos: Record<string, DemoFunction> = {
  // DROPDOWN DEMO
  dropdown: (demoState, setDemoState) => (
    <div className="relative h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-4 border border-white/10">
      <button
        onClick={() => setDemoState({ ...demoState, dropdown: !demoState.dropdown })}
        className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors flex items-center gap-2 border border-white/20"
      >
        Options
        <ChevronDown
          className={`w-4 h-4 transition-transform ${demoState.dropdown ? 'rotate-180' : ''}`}
        />
      </button>

      {demoState.dropdown && (
        <div className="absolute top-14 left-4 bg-slate-800 rounded-lg shadow-xl border border-white/20 overflow-hidden">
          {['Edit', 'Duplicate', 'Share', 'Delete'].map((option) => (
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

  // ACCORDION DEMO
  accordion: (demoState, setDemoState) => (
    <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-4 border border-white/10 overflow-y-auto">
      {['What is this?', 'How does it work?', 'Is it free?'].map((question, index) => (
        <div key={index} className="mb-2">
          <button
            onClick={() =>
              setDemoState({
                ...demoState,
                accordion: demoState.accordion === index ? null : index,
              })
            }
            className="w-full px-4 py-3 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-colors flex items-center justify-between border border-white/10"
          >
            <span>{question}</span>
            <ChevronRight
              className={`w-4 h-4 transition-transform ${demoState.accordion === index ? 'rotate-90' : ''}`}
            />
          </button>
          {demoState.accordion === index && (
            <div className="mt-2 p-4 bg-white/5 rounded-lg text-gray-300 border border-white/10">
              This is the answer to "{question}". Accordions help organize content in collapsible
              sections.
            </div>
          )}
        </div>
      ))}
    </div>
  ),

  // TABS DEMO
  tabs: (demoState, setDemoState) => (
    <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg overflow-hidden border border-white/10">
      <div className="flex border-b border-white/10">
        {['Overview', 'Features', 'Pricing'].map((tab, index) => (
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
        <div className="text-gray-300">
          {
            ['Overview content here', 'Features content here', 'Pricing content here'][
              demoState.tabs
            ]
          }
        </div>
      </div>
    </div>
  ),

  // TOOLTIP DEMO
  tooltip: (demoState, setDemoState) => (
    <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-4 border border-white/10 flex items-center justify-center">
      <div className="relative">
        <button
          onMouseEnter={() => setDemoState({ ...demoState, tooltip: true })}
          onMouseLeave={() => setDemoState({ ...demoState, tooltip: false })}
          className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors flex items-center gap-2"
        >
          <Info className="w-4 h-4" />
          Hover Me
        </button>

        {demoState.tooltip && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-xl border border-white/20">
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900 border-r border-b border-white/20"></div>
            This is helpful information!
          </div>
        )}
      </div>
    </div>
  ),

  // DRAWER DEMO
  drawer: (demoState, setDemoState) => (
    <div className="relative h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg overflow-hidden border border-white/10">
      <div className="p-4">
        <button
          onClick={() => setDemoState({ ...demoState, drawer: true })}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
        >
          <Menu className="w-4 h-4 inline mr-2" />
          Open Menu
        </button>
      </div>

      {demoState.drawer && (
        <>
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setDemoState({ ...demoState, drawer: false })}
          />
          <div className="absolute left-0 top-0 h-full w-64 bg-slate-800 shadow-xl border-r border-white/20">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">Menu</h3>
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

  // INFINITE SCROLL DEMO
  'infinite-scroll': (demoState, setDemoState) => (
    <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-4 border border-white/10 overflow-y-auto">
      <div className="space-y-2">
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className="p-3 bg-white/5 rounded-lg">
            <div className="text-white">Item {i + 1}</div>
            <div className="text-gray-400 text-sm">Content loads as you scroll</div>
          </div>
        ))}
        <div className="p-3 border-2 border-dashed border-white/20 rounded-lg text-center">
          <div className="animate-pulse text-cyan-400">Loading more...</div>
          <div className="text-gray-500 text-xs mt-1">Scroll down to load more items</div>
        </div>
      </div>
    </div>
  ),

  // LAZY LOADING DEMO
  'lazy-loading': (demoState, setDemoState) => (
    <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-4 border border-white/10 overflow-y-auto">
      <div className="space-y-4">
        <div className="bg-white/5 rounded-lg p-3">
          <div className="w-full h-24 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded mb-2"></div>
          <div className="text-white text-sm">Loaded Image</div>
        </div>
        <div className="bg-white/5 rounded-lg p-3">
          <div className="w-full h-24 bg-gray-700 rounded mb-2 animate-pulse flex items-center justify-center">
            <span className="text-gray-500 text-xs">Loading when visible...</span>
          </div>
          <div className="text-gray-400 text-sm">Image loads when scrolled into view</div>
        </div>
      </div>
    </div>
  ),

  // DRAG & DROP DEMO
  'drag-drop': (demoState, setDemoState) => (
    <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-4 border border-white/10">
      <p className="text-gray-400 text-sm mb-4">Drag items to reorder (demo visualization)</p>
      <div className="space-y-2">
        {['Task 1', 'Task 2', 'Task 3'].map((task, i) => (
          <div
            key={task}
            className="p-3 bg-white/10 rounded-lg flex items-center gap-3 cursor-move hover:bg-white/20 transition-colors"
            draggable
          >
            <span className="text-gray-400">⋮⋮</span>
            <span className="text-white flex-1">{task}</span>
            <span className="text-gray-500 text-xs">Drag me!</span>
          </div>
        ))}
      </div>
    </div>
  ),

  // SWIPE GESTURE DEMO
  swipe: (demoState, setDemoState) => (
    <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 border border-white/10 flex items-center justify-center">
      <div className="relative">
        <div className="w-64 h-32 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <ArrowLeft className="inline w-6 h-6 text-cyan-400 animate-pulse" />
            <span className="mx-4 text-white">Swipe Me</span>
            <ArrowRight className="inline w-6 h-6 text-purple-400 animate-pulse" />
            <p className="text-gray-400 text-xs mt-2">Swipe left or right for actions</p>
          </div>
        </div>
      </div>
    </div>
  ),

  // PULL TO REFRESH DEMO
  'pull-refresh': (demoState, setDemoState) => (
    <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg overflow-hidden border border-white/10">
      <div className="p-4 bg-white/5 border-b border-white/10 flex items-center justify-center gap-2">
        <div className="animate-spin w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full"></div>
        <span className="text-cyan-400 text-sm">Pull down to refresh</span>
      </div>
      <div className="p-4 space-y-2">
        <div className="p-3 bg-white/5 rounded">
          <div className="text-white text-sm">Latest Update</div>
          <div className="text-gray-400 text-xs">Just now</div>
        </div>
        <div className="p-3 bg-white/5 rounded">
          <div className="text-white text-sm">Previous Update</div>
          <div className="text-gray-400 text-xs">5 minutes ago</div>
        </div>
      </div>
    </div>
  ),

  // SEARCH WITH FILTERS DEMO
  'search-filter': (demoState, setDemoState) => (
    <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-4 border border-white/10">
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          placeholder="Search products..."
          className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded text-white text-sm"
        />
        <button className="px-3 py-2 bg-cyan-500 text-white rounded text-sm">Search</button>
      </div>
      <div className="flex gap-2 mb-3">
        <select className="px-2 py-1 bg-white/10 border border-white/20 rounded text-gray-300 text-sm">
          <option>Category</option>
        </select>
        <select className="px-2 py-1 bg-white/10 border border-white/20 rounded text-gray-300 text-sm">
          <option>Price</option>
        </select>
        <select className="px-2 py-1 bg-white/10 border border-white/20 rounded text-gray-300 text-sm">
          <option>Rating</option>
        </select>
      </div>
      <div className="bg-white/5 rounded p-3">
        <div className="text-gray-400 text-sm">3 results found</div>
      </div>
    </div>
  ),

  // LIVE SEARCH DEMO
  'live-search': (demoState, setDemoState) => (
    <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-4 border border-white/10">
      <input
        type="text"
        placeholder="Type to search instantly..."
        defaultValue="React"
        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white mb-3"
      />
      <div className="space-y-2">
        <div className="p-2 bg-white/5 rounded hover:bg-white/10 cursor-pointer">
          <div className="text-white text-sm">React Documentation</div>
          <div className="text-gray-500 text-xs">Official React docs</div>
        </div>
        <div className="p-2 bg-white/5 rounded hover:bg-white/10 cursor-pointer">
          <div className="text-white text-sm">React Tutorial</div>
          <div className="text-gray-500 text-xs">Learn React basics</div>
        </div>
      </div>
      <p className="text-cyan-400 text-xs mt-3 text-center">Results update as you type</p>
    </div>
  ),

  // BOTTOM SHEET DEMO
  'bottom-sheet': (demoState, setDemoState) => (
    <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg overflow-hidden border border-white/10 relative">
      <div className="p-4">
        <button className="px-4 py-2 bg-purple-500 text-white rounded">Open Actions</button>
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-slate-800 rounded-t-2xl border-t border-white/20 p-4">
        <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mb-3"></div>
        <div className="space-y-2">
          <button className="w-full p-3 text-left text-gray-300 hover:bg-white/10 rounded">
            Share
          </button>
          <button className="w-full p-3 text-left text-gray-300 hover:bg-white/10 rounded">
            Copy Link
          </button>
          <button className="w-full p-3 text-left text-gray-300 hover:bg-white/10 rounded">
            Delete
          </button>
        </div>
      </div>
    </div>
  ),
}
