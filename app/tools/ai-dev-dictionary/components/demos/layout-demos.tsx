// app/tools/ai-dev-dictionary/components/demos/layout-demos.tsx

import type { DemoFunction } from './index'

export const layoutDemos: Record<string, DemoFunction> = {
  // SIDEBAR DEMO
  sidebar: (demoState, setDemoState) => (
    <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg overflow-hidden border border-white/10 flex">
      <div className="w-48 bg-white/10 border-r border-white/10 p-4">
        <div className="space-y-2">
          <a href="#" className="block px-3 py-2 bg-cyan-500/20 text-cyan-400 rounded">
            Dashboard
          </a>
          <a href="#" className="block px-3 py-2 text-gray-300 hover:bg-white/10 rounded">
            Profile
          </a>
          <a href="#" className="block px-3 py-2 text-gray-300 hover:bg-white/10 rounded">
            Settings
          </a>
          <a href="#" className="block px-3 py-2 text-gray-300 hover:bg-white/10 rounded">
            Messages
          </a>
          <a href="#" className="block px-3 py-2 text-gray-300 hover:bg-white/10 rounded">
            Logout
          </a>
        </div>
      </div>
      <div className="flex-1 p-4">
        <h3 className="text-white font-semibold mb-2">Main Content</h3>
        <p className="text-gray-400 text-sm">
          The main page content appears here beside the sidebar.
        </p>
      </div>
    </div>
  ),

  // HEADER DEMO
  header: (demoState, setDemoState) => (
    <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg overflow-hidden border border-white/10">
      <header className="bg-white/10 backdrop-blur-xl border-b border-white/10 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center text-white font-bold">
              L
            </div>
            <span className="text-white font-semibold">My Website</span>
          </div>
          <nav className="flex gap-4">
            <a href="#" className="text-gray-300 hover:text-cyan-400">
              Products
            </a>
            <a href="#" className="text-gray-300 hover:text-cyan-400">
              About
            </a>
            <button className="px-3 py-1 bg-cyan-500 text-white rounded">Sign In</button>
          </nav>
        </div>
      </header>
      <div className="p-4 text-center text-gray-400">
        <p>Page content below header</p>
      </div>
    </div>
  ),

  // FOOTER DEMO
  footer: (demoState, setDemoState) => (
    <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg overflow-hidden border border-white/10 flex flex-col">
      <div className="flex-1 p-4 text-center text-gray-400">
        <p>Page content</p>
      </div>
      <footer className="bg-white/10 border-t border-white/10 px-4 py-4">
        <div className="flex justify-between items-center mb-3">
          <div className="text-white font-semibold">Company Name</div>
          <div className="flex gap-4 text-sm">
            <a href="#" className="text-gray-400 hover:text-cyan-400">
              Privacy
            </a>
            <a href="#" className="text-gray-400 hover:text-cyan-400">
              Terms
            </a>
            <a href="#" className="text-gray-400 hover:text-cyan-400">
              Contact
            </a>
          </div>
        </div>
        <p className="text-gray-500 text-xs text-center">
          © 2024 Company Name. All rights reserved.
        </p>
      </footer>
    </div>
  ),

  // GRID LAYOUT DEMO
  grid: (demoState, setDemoState) => (
    <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-4 border border-white/10">
      <div className="grid grid-cols-3 gap-2 h-full">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-white/10 rounded-lg flex items-center justify-center text-gray-400"
          >
            {i}
          </div>
        ))}
      </div>
    </div>
  ),

  // HERO SECTION DEMO
  hero: (demoState, setDemoState) => (
    <div className="h-64 bg-gradient-to-br from-cyan-600 to-purple-600 rounded-lg p-8 border border-white/10 flex flex-col items-center justify-center text-center">
      <h1 className="text-3xl font-bold text-white mb-2">Welcome!</h1>
      <p className="text-white/80 mb-4">Start your journey with us today</p>
      <button className="px-6 py-2 bg-white text-purple-600 rounded-lg font-medium hover:bg-white/90 transition-colors">
        Get Started →
      </button>
    </div>
  ),

  // STICKY HEADER DEMO
  'sticky-header': (demoState, setDemoState) => (
    <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg overflow-hidden border border-white/10">
      <div className="bg-gradient-to-r from-cyan-500 to-purple-500 p-3 text-white font-semibold sticky top-0 z-10">
        Sticky Header - Scroll to see it stick!
      </div>
      <div className="p-4 space-y-3 overflow-y-auto h-48">
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className="p-3 bg-white/5 rounded">
            <div className="text-gray-300">Content Item {i + 1}</div>
            <div className="text-gray-500 text-xs">Scroll down to see sticky header</div>
          </div>
        ))}
      </div>
    </div>
  ),
}
