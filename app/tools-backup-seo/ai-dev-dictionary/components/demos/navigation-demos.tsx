// app/tools/ai-dev-dictionary/components/demos/navigation-demos.tsx

import type { DemoFunction } from './index'

export const navigationDemos: Record<string, DemoFunction> = {
  // NAVBAR DEMO
  navbar: (demoState, setDemoState) => (
    <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg overflow-hidden border border-white/10">
      <nav className="bg-white/10 backdrop-blur-xl border-b border-white/10 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="text-white font-bold">Logo</div>
          <div className="flex gap-4">
            <a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors">Home</a>
            <a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors">About</a>
            <a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors">Services</a>
            <a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors">Contact</a>
          </div>
        </div>
      </nav>
      <div className="p-4 text-center text-gray-400">
        <p>Page content goes here</p>
      </div>
    </div>
  ),

  // BREADCRUMB DEMO
  breadcrumb: (demoState, setDemoState) => (
    <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-4 border border-white/10">
      <nav className="flex items-center gap-2 text-sm">
        <a href="#" className="text-gray-400 hover:text-cyan-400">Home</a>
        <span className="text-gray-600">/</span>
        <a href="#" className="text-gray-400 hover:text-cyan-400">Products</a>
        <span className="text-gray-600">/</span>
        <a href="#" className="text-gray-400 hover:text-cyan-400">Electronics</a>
        <span className="text-gray-600">/</span>
        <span className="text-cyan-400">Laptops</span>
      </nav>
      <div className="mt-8 p-4 bg-white/5 rounded-lg">
        <h3 className="text-white font-semibold mb-2">Laptops</h3>
        <p className="text-gray-400 text-sm">You are here: Home → Products → Electronics → Laptops</p>
      </div>
    </div>
  ),

  // PAGINATION DEMO
  pagination: (demoState, setDemoState) => (
    <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-4 border border-white/10">
      <div className="mb-4 p-4 bg-white/5 rounded-lg">
        <p className="text-white">Page {demoState.pagination} of 5</p>
        <p className="text-gray-400 text-sm mt-1">Showing items {(demoState.pagination - 1) * 10 + 1}-{demoState.pagination * 10}</p>
      </div>
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => setDemoState({ ...demoState, pagination: Math.max(1, demoState.pagination - 1) })}
          className="px-3 py-1 bg-white/10 text-gray-300 rounded hover:bg-white/20"
        >
          Previous
        </button>
        {[1, 2, 3, 4, 5].map(page => (
          <button
            key={page}
            onClick={() => setDemoState({ ...demoState, pagination: page })}
            className={`px-3 py-1 rounded ${
              page === demoState.pagination 
                ? 'bg-cyan-500 text-white' 
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => setDemoState({ ...demoState, pagination: Math.min(5, demoState.pagination + 1) })}
          className="px-3 py-1 bg-white/10 text-gray-300 rounded hover:bg-white/20"
        >
          Next
        </button>
      </div>
    </div>
  ),

  // STEPPER DEMO
  stepper: (demoState, setDemoState) => (
    <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-4 border border-white/10">
      <div className="flex justify-between mb-8">
        {['Details', 'Payment', 'Review', 'Complete'].map((step, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
              i + 1 <= demoState.stepper 
                ? 'bg-cyan-500 text-white' 
                : 'bg-white/10 text-gray-500'
            }`}>
              {i + 1}
            </div>
            <span className="text-xs text-gray-400 mt-2">{step}</span>
          </div>
        ))}
      </div>
      <div className="text-center">
        <p className="text-white mb-4">Step {demoState.stepper}: {['Details', 'Payment', 'Review', 'Complete'][demoState.stepper - 1]}</p>
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setDemoState({ ...demoState, stepper: Math.max(1, demoState.stepper - 1) })}
            className="px-4 py-2 bg-white/10 text-gray-300 rounded-lg hover:bg-white/20"
          >
            Back
          </button>
          <button
            onClick={() => setDemoState({ ...demoState, stepper: Math.min(4, demoState.stepper + 1) })}
            className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  ),

  // MEGA MENU DEMO
  'mega-menu': (demoState, setDemoState) => (
    <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg overflow-hidden border border-white/10">
      <nav className="bg-white/10 border-b border-white/10 p-2">
        <button className="px-4 py-2 text-white hover:bg-white/10 rounded">Products ▼</button>
      </nav>
      <div className="p-4 bg-white/5 mx-4 mt-2 rounded-lg">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <h4 className="text-cyan-400 font-semibold mb-2">Electronics</h4>
            <ul className="space-y-1 text-sm">
              <li className="text-gray-300">Laptops</li>
              <li className="text-gray-300">Phones</li>
              <li className="text-gray-300">Tablets</li>
            </ul>
          </div>
          <div>
            <h4 className="text-purple-400 font-semibold mb-2">Clothing</h4>
            <ul className="space-y-1 text-sm">
              <li className="text-gray-300">Shirts</li>
              <li className="text-gray-300">Pants</li>
              <li className="text-gray-300">Shoes</li>
            </ul>
          </div>
          <div>
            <h4 className="text-green-400 font-semibold mb-2">Home</h4>
            <ul className="space-y-1 text-sm">
              <li className="text-gray-300">Furniture</li>
              <li className="text-gray-300">Decor</li>
              <li className="text-gray-300">Kitchen</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}