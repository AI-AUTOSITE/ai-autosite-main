// app/tools/ai-dev-dictionary/components/demos/data-demos.tsx

import { ArrowLeft, ArrowRight, ChevronDown, ChevronRight } from 'lucide-react'
import type { DemoFunction } from './index'

export const dataDemos: Record<string, DemoFunction> = {
  // TABLE DEMO
  table: (demoState, setDemoState) => (
    <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-4 border border-white/10 overflow-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left py-2 text-gray-400">Name</th>
            <th className="text-left py-2 text-gray-400">Role</th>
            <th className="text-left py-2 text-gray-400">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-white/5">
            <td className="py-2 text-white">John Doe</td>
            <td className="py-2 text-gray-300">Developer</td>
            <td className="py-2">
              <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">
                Active
              </span>
            </td>
          </tr>
          <tr className="border-b border-white/5">
            <td className="py-2 text-white">Jane Smith</td>
            <td className="py-2 text-gray-300">Designer</td>
            <td className="py-2">
              <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">
                Active
              </span>
            </td>
          </tr>
          <tr>
            <td className="py-2 text-white">Bob Wilson</td>
            <td className="py-2 text-gray-300">Manager</td>
            <td className="py-2">
              <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs">
                Away
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  ),

  // LIST DEMO
  list: (demoState, setDemoState) => (
    <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-4 border border-white/10 overflow-y-auto">
      <div className="space-y-2">
        {[
          '📧 Check emails',
          '📝 Write report',
          '☕ Team meeting',
          '🎯 Review goals',
          '📊 Update dashboard',
        ].map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <input type="checkbox" className="w-4 h-4" />
            <span className="text-gray-300">{item}</span>
          </div>
        ))}
      </div>
    </div>
  ),

  // CAROUSEL DEMO
  carousel: (demoState, setDemoState) => (
    <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-4 border border-white/10">
      <div className="relative h-full flex items-center justify-center">
        <button
          onClick={() =>
            setDemoState({ ...demoState, carousel: Math.max(0, demoState.carousel - 1) })
          }
          className="absolute left-2 p-2 bg-white/10 rounded-full hover:bg-white/20"
        >
          <ArrowLeft className="w-4 h-4 text-white" />
        </button>

        <div className="w-48 h-32 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
          <span className="text-white text-lg">Slide {demoState.carousel + 1}</span>
        </div>

        <button
          onClick={() =>
            setDemoState({ ...demoState, carousel: Math.min(2, demoState.carousel + 1) })
          }
          className="absolute right-2 p-2 bg-white/10 rounded-full hover:bg-white/20"
        >
          <ArrowRight className="w-4 h-4 text-white" />
        </button>

        <div className="absolute bottom-2 flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${i === demoState.carousel ? 'bg-cyan-400' : 'bg-white/30'}`}
            />
          ))}
        </div>
      </div>
    </div>
  ),

  // VIRTUAL LIST DEMO
  'virtual-list': (demoState, setDemoState) => (
    <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-4 border border-white/10">
      <p className="text-gray-400 text-xs mb-2">Rendering items 1-5 of 10,000</p>
      <div className="bg-white/5 rounded-lg p-2 h-48 overflow-y-auto">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="p-2 border-b border-white/10">
            <div className="text-white text-sm">Item {i + 1}</div>
            <div className="text-gray-500 text-xs">Only visible items are rendered</div>
          </div>
        ))}
      </div>
      <p className="text-cyan-400 text-xs mt-2 text-center">
        Efficiently handles thousands of items
      </p>
    </div>
  ),

  // DATA GRID DEMO
  'data-grid': (demoState, setDemoState) => (
    <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-4 border border-white/10 overflow-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left py-2 text-gray-400 cursor-pointer hover:text-cyan-400">
              Name ↓
            </th>
            <th className="text-left py-2 text-gray-400 cursor-pointer hover:text-cyan-400">Age</th>
            <th className="text-left py-2 text-gray-400 cursor-pointer hover:text-cyan-400">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-white/5 hover:bg-white/5">
            <td className="py-2 text-white">Alice Johnson</td>
            <td className="py-2 text-gray-300">28</td>
            <td className="py-2">
              <span className="text-green-400">Active</span>
            </td>
          </tr>
          <tr className="border-b border-white/5 hover:bg-white/5">
            <td className="py-2 text-white">Bob Smith</td>
            <td className="py-2 text-gray-300">32</td>
            <td className="py-2">
              <span className="text-yellow-400">Pending</span>
            </td>
          </tr>
        </tbody>
      </table>
      <p className="text-gray-500 text-xs mt-2">Click headers to sort</p>
    </div>
  ),

  // TIMELINE DEMO
  timeline: (demoState, setDemoState) => (
    <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-4 border border-white/10 overflow-y-auto">
      <div className="relative pl-8">
        <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-white/20"></div>
        {['Started project', 'Added features', 'Released v1.0'].map((event, i) => (
          <div key={i} className="relative mb-4">
            <div className="absolute -left-5 w-3 h-3 bg-cyan-400 rounded-full"></div>
            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-white text-sm">{event}</div>
              <div className="text-gray-500 text-xs">
                {i === 0 ? '2 hours ago' : i === 1 ? '1 hour ago' : 'Just now'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),

  // TREE VIEW DEMO
  'tree-view': (demoState, setDemoState) => (
    <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-4 border border-white/10">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-gray-300 hover:bg-white/10 p-1 rounded cursor-pointer">
          <ChevronDown className="w-4 h-4" />
          <span>📁 src</span>
        </div>
        <div className="pl-6 space-y-1">
          <div className="flex items-center gap-2 text-gray-300 hover:bg-white/10 p-1 rounded cursor-pointer">
            <ChevronRight className="w-4 h-4" />
            <span>📁 components</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300 hover:bg-white/10 p-1 rounded cursor-pointer">
            <ChevronRight className="w-4 h-4" />
            <span>📁 pages</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300 hover:bg-white/10 p-1 rounded cursor-pointer pl-5">
            <span>📄 App.tsx</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300 hover:bg-white/10 p-1 rounded cursor-pointer pl-5">
            <span>📄 index.ts</span>
          </div>
        </div>
      </div>
    </div>
  ),
}
