// app/tools/ai-dev-dictionary/components/demos/ui-demos.tsx

import { X, CheckCircle, User } from 'lucide-react'
import type { DemoFunction } from './index'

export const uiDemos: Record<string, DemoFunction> = {
  // MODAL DEMO
  modal: (demoState, setDemoState) => (
    <div className="relative h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-4 border border-white/10">
      <button
        onClick={() => setDemoState({ ...demoState, modal: true })}
        className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
      >
        Open Modal
      </button>

      {demoState.modal && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
          <div className="bg-slate-800 rounded-lg p-6 max-w-sm w-full mx-4 border border-white/20">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-white">Example Modal</h3>
              <button
                onClick={() => setDemoState({ ...demoState, modal: false })}
                className="p-1 hover:bg-white/10 rounded transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <p className="text-gray-300 mb-4">This is a modal dialog. Click the X to close.</p>
            <button
              onClick={() => setDemoState({ ...demoState, modal: false })}
              className="w-full px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  ),

  // CARD DEMO
  card: (demoState, setDemoState) => (
    <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-4 border border-white/10 overflow-y-auto">
      <div className="space-y-4">
        {['Product 1', 'Product 2'].map((item, i) => (
          <div
            key={i}
            className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <div className="w-full h-20 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded mb-3"></div>
            <h3 className="text-white font-semibold mb-1">{item}</h3>
            <p className="text-gray-400 text-sm mb-3">
              This is a card component with image, title, and description.
            </p>
            <button className="text-cyan-400 text-sm hover:text-cyan-300">Learn More →</button>
          </div>
        ))}
      </div>
    </div>
  ),

  // AVATAR DEMO
  avatar: (demoState, setDemoState) => (
    <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-4 border border-white/10">
      <div className="flex items-center justify-center gap-4 mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
          JD
        </div>
        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
          <User className="w-8 h-8 text-white" />
        </div>
        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
          AB
        </div>
      </div>
      <div className="text-center text-gray-400 text-sm">
        <p>User avatars with initials or icons</p>
      </div>
    </div>
  ),

  // CHIP DEMO
  chip: (demoState, setDemoState) => (
    <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-4 border border-white/10">
      <p className="text-gray-400 text-sm mb-4">Selected filters:</p>
      <div className="flex flex-wrap gap-2">
        {['React', 'TypeScript', 'Tailwind', 'Next.js', 'Node.js'].map((tag) => (
          <div
            key={tag}
            className="inline-flex items-center gap-1 px-3 py-1 bg-white/10 text-gray-300 rounded-full text-sm border border-white/20"
          >
            <span>{tag}</span>
            <button className="ml-1 hover:text-red-400">×</button>
          </div>
        ))}
      </div>
      <p className="text-cyan-400 text-xs mt-4">Click × to remove tags</p>
    </div>
  ),

  // FAB (FLOATING ACTION BUTTON) DEMO
  fab: (demoState, setDemoState) => (
    <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-4 border border-white/10 relative">
      <div className="text-gray-400 text-sm">Main content area</div>
      <button className="absolute bottom-4 right-4 w-14 h-14 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all flex items-center justify-center text-2xl">
        +
      </button>
      <p className="text-gray-500 text-xs absolute bottom-20 right-4">FAB</p>
    </div>
  ),
}
