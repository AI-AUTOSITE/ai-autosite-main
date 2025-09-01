// app/tools/ai-dev-dictionary/components/InteractiveDemo.tsx
'use client'

import { useState } from 'react'
import { 
  X, Bell, ChevronDown, ChevronRight, Info, CheckCircle, AlertCircle, 
  Play, Calendar, Clock, User, Home, Search, Menu, ArrowRight, ArrowLeft,
  Upload, Settings, Filter, Grid, List, Image, Mail, Phone, MapPin
} from 'lucide-react'

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
    progress: 0,
    carousel: 0,
    checkbox: [false, false, false],
    radio: 'option1',
    switch: false,
    select: '',
    stepper: 1,
    pagination: 1
  })

  const demos: Record<string, JSX.Element> = {
    // ===== ORIGINAL DEMOS =====
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
              <p className="text-gray-300 mb-4">This is a modal dialog. Click anywhere outside or the X to close.</p>
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

    toast: (
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
          <div className="absolute bottom-4 right-4 px-4 py-3 bg-green-500 text-white rounded-lg shadow-lg flex items-center gap-2 animate-slideInRight">
            <CheckCircle className="w-5 h-5" />
            <span>Success! Action completed.</span>
          </div>
        )}
      </div>
    ),

    // ===== NEW CARD DEMO =====
    card: (
      <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-4 border border-white/10 overflow-y-auto">
        <div className="space-y-4">
          {['Product 1', 'Product 2'].map((item, i) => (
            <div key={i} className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors">
              <div className="w-full h-20 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded mb-3"></div>
              <h3 className="text-white font-semibold mb-1">{item}</h3>
              <p className="text-gray-400 text-sm mb-3">This is a card component with image, title, and description.</p>
              <button className="text-cyan-400 text-sm hover:text-cyan-300">Learn More →</button>
            </div>
          ))}
        </div>
      </div>
    ),

    // ===== TABLE DEMO =====
    table: (
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
              <td className="py-2"><span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">Active</span></td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="py-2 text-white">Jane Smith</td>
              <td className="py-2 text-gray-300">Designer</td>
              <td className="py-2"><span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">Active</span></td>
            </tr>
            <tr>
              <td className="py-2 text-white">Bob Wilson</td>
              <td className="py-2 text-gray-300">Manager</td>
              <td className="py-2"><span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs">Away</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    ),

    // ===== LIST DEMO =====
    list: (
      <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-4 border border-white/10 overflow-y-auto">
        <div className="space-y-2">
          {['📧 Check emails', '📝 Write report', '☕ Team meeting', '🎯 Review goals', '📊 Update dashboard'].map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
              <input type="checkbox" className="w-4 h-4" />
              <span className="text-gray-300">{item}</span>
            </div>
          ))}
        </div>
      </div>
    ),

    // ===== CAROUSEL DEMO =====
    carousel: (
      <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-4 border border-white/10">
        <div className="relative h-full flex items-center justify-center">
          <button
            onClick={() => setDemoState({ ...demoState, carousel: Math.max(0, demoState.carousel - 1) })}
            className="absolute left-2 p-2 bg-white/10 rounded-full hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 text-white" />
          </button>
          
          <div className="w-48 h-32 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
            <span className="text-white text-lg">Slide {demoState.carousel + 1}</span>
          </div>
          
          <button
            onClick={() => setDemoState({ ...demoState, carousel: Math.min(2, demoState.carousel + 1) })}
            className="absolute right-2 p-2 bg-white/10 rounded-full hover:bg-white/20"
          >
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
          
          <div className="absolute bottom-2 flex gap-1">
            {[0, 1, 2].map(i => (
              <div key={i} className={`w-2 h-2 rounded-full ${i === demoState.carousel ? 'bg-cyan-400' : 'bg-white/30'}`} />
            ))}
          </div>
        </div>
      </div>
    ),

    // ===== CHECKBOX DEMO =====
    checkbox: (
      <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-4 border border-white/10">
        <p className="text-gray-400 text-sm mb-4">Select your preferences:</p>
        <div className="space-y-3">
          {['Email notifications', 'SMS alerts', 'Push notifications'].map((label, i) => (
            <label key={i} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={demoState.checkbox[i]}
                onChange={() => {
                  const newCheckbox = [...demoState.checkbox]
                  newCheckbox[i] = !newCheckbox[i]
                  setDemoState({ ...demoState, checkbox: newCheckbox })
                }}
                className="w-5 h-5 rounded"
              />
              <span className="text-gray-300">{label}</span>
            </label>
          ))}
        </div>
        <p className="text-cyan-400 text-sm mt-4">
          Selected: {demoState.checkbox.filter(Boolean).length} items
        </p>
      </div>
    ),

    // ===== RADIO BUTTON DEMO =====
    radio: (
      <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-4 border border-white/10">
        <p className="text-gray-400 text-sm mb-4">Choose your plan:</p>
        <div className="space-y-3">
          {[
            { id: 'option1', label: 'Basic - $9/mo', desc: 'Perfect for starters' },
            { id: 'option2', label: 'Pro - $29/mo', desc: 'Most popular choice' },
            { id: 'option3', label: 'Enterprise - $99/mo', desc: 'For large teams' }
          ].map((option) => (
            <label key={option.id} className="flex items-start gap-3 cursor-pointer p-3 bg-white/5 rounded-lg hover:bg-white/10">
              <input
                type="radio"
                name="plan"
                value={option.id}
                checked={demoState.radio === option.id}
                onChange={(e) => setDemoState({ ...demoState, radio: e.target.value })}
                className="mt-1"
              />
              <div>
                <div className="text-white">{option.label}</div>
                <div className="text-gray-400 text-xs">{option.desc}</div>
              </div>
            </label>
          ))}
        </div>
      </div>
    ),

    // ===== SWITCH DEMO =====
    switch: (
      <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-4 border border-white/10">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div>
              <p className="text-white font-medium">Dark Mode</p>
              <p className="text-gray-400 text-sm">Use dark theme across the app</p>
            </div>
            <button
              onClick={() => setDemoState({ ...demoState, switch: !demoState.switch })}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                demoState.switch ? 'bg-cyan-500' : 'bg-gray-600'
              }`}
            >
              <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                demoState.switch ? 'translate-x-7' : 'translate-x-1'
              }`} />
            </button>
          </div>
          <p className="text-center text-gray-400 text-sm">
            Status: <span className={demoState.switch ? 'text-cyan-400' : 'text-gray-500'}>
              {demoState.switch ? 'ON' : 'OFF'}
            </span>
          </p>
        </div>
      </div>
    ),

    // ===== INPUT FIELD DEMO =====
    input: (
      <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-4 border border-white/10">
        <div className="space-y-4">
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none"
            />
          </div>
          <button className="w-full px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors">
            Submit
          </button>
        </div>
      </div>
    ),

    // ===== SELECT BOX DEMO =====
    select: (
      <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-4 border border-white/10">
        <label className="text-gray-400 text-sm mb-2 block">Choose your country:</label>
        <select 
          value={demoState.select}
          onChange={(e) => setDemoState({ ...demoState, select: e.target.value })}
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
        >
          <option value="">Select a country...</option>
          <option value="us">🇺🇸 United States</option>
          <option value="uk">🇬🇧 United Kingdom</option>
          <option value="ca">🇨🇦 Canada</option>
          <option value="au">🇦🇺 Australia</option>
          <option value="jp">🇯🇵 Japan</option>
        </select>
        {demoState.select && (
          <p className="mt-4 text-cyan-400 text-sm">
            You selected: {demoState.select.toUpperCase()}
          </p>
        )}
      </div>
    ),

    // ===== DATE PICKER DEMO =====
    datepicker: (
      <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-4 border border-white/10">
        <label className="text-gray-400 text-sm mb-2 block">Select your birthday:</label>
        <input
          type="date"
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
        />
        <div className="mt-4 p-3 bg-white/5 rounded-lg">
          <p className="text-gray-400 text-sm">📅 Click the input above to open a calendar</p>
        </div>
      </div>
    ),

    // ===== NAVBAR DEMO =====
    navbar: (
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

    // ===== BREADCRUMB DEMO =====
    breadcrumb: (
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

    // ===== PAGINATION DEMO =====
    pagination: (
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

    // ===== STEPPER DEMO =====
    stepper: (
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

    // ===== SIDEBAR DEMO =====
    sidebar: (
      <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg overflow-hidden border border-white/10 flex">
        <div className="w-48 bg-white/10 border-r border-white/10 p-4">
          <div className="space-y-2">
            <a href="#" className="block px-3 py-2 bg-cyan-500/20 text-cyan-400 rounded">Dashboard</a>
            <a href="#" className="block px-3 py-2 text-gray-300 hover:bg-white/10 rounded">Profile</a>
            <a href="#" className="block px-3 py-2 text-gray-300 hover:bg-white/10 rounded">Settings</a>
            <a href="#" className="block px-3 py-2 text-gray-300 hover:bg-white/10 rounded">Messages</a>
            <a href="#" className="block px-3 py-2 text-gray-300 hover:bg-white/10 rounded">Logout</a>
          </div>
        </div>
        <div className="flex-1 p-4">
          <h3 className="text-white font-semibold mb-2">Main Content</h3>
          <p className="text-gray-400 text-sm">The main page content appears here beside the sidebar.</p>
        </div>
      </div>
    ),

    // ===== HEADER DEMO =====
    header: (
      <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg overflow-hidden border border-white/10">
        <header className="bg-white/10 backdrop-blur-xl border-b border-white/10 px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center text-white font-bold">L</div>
              <span className="text-white font-semibold">My Website</span>
            </div>
            <nav className="flex gap-4">
              <a href="#" className="text-gray-300 hover:text-cyan-400">Products</a>
              <a href="#" className="text-gray-300 hover:text-cyan-400">About</a>
              <button className="px-3 py-1 bg-cyan-500 text-white rounded">Sign In</button>
            </nav>
          </div>
        </header>
        <div className="p-4 text-center text-gray-400">
          <p>Page content below header</p>
        </div>
      </div>
    ),

    // ===== FOOTER DEMO =====
    footer: (
      <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg overflow-hidden border border-white/10 flex flex-col">
        <div className="flex-1 p-4 text-center text-gray-400">
          <p>Page content</p>
        </div>
        <footer className="bg-white/10 border-t border-white/10 px-4 py-4">
          <div className="flex justify-between items-center mb-3">
            <div className="text-white font-semibold">Company Name</div>
            <div className="flex gap-4 text-sm">
              <a href="#" className="text-gray-400 hover:text-cyan-400">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-cyan-400">Terms</a>
              <a href="#" className="text-gray-400 hover:text-cyan-400">Contact</a>
            </div>
          </div>
          <p className="text-gray-500 text-xs text-center">© 2024 Company Name. All rights reserved.</p>
        </footer>
      </div>
    ),

    // ===== GRID LAYOUT DEMO =====
    grid: (
      <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-4 border border-white/10">
        <div className="grid grid-cols-3 gap-2 h-full">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white/10 rounded-lg flex items-center justify-center text-gray-400">
              {i}
            </div>
          ))}
        </div>
      </div>
    ),

    // ===== HERO SECTION DEMO =====
    hero: (
      <div className="h-64 bg-gradient-to-br from-cyan-600 to-purple-600 rounded-lg p-8 border border-white/10 flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome!</h1>
        <p className="text-white/80 mb-4">Start your journey with us today</p>
        <button className="px-6 py-2 bg-white text-purple-600 rounded-lg font-medium hover:bg-white/90 transition-colors">
          Get Started →
        </button>
      </div>
    ),

    // ===== DROPDOWN DEMO =====
    dropdown: (
      <div className="relative h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-4 border border-white/10">
        <button
          onClick={() => setDemoState({ ...demoState, dropdown: !demoState.dropdown })}
          className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors flex items-center gap-2 border border-white/20"
        >
          Options
          <ChevronDown className={`w-4 h-4 transition-transform ${demoState.dropdown ? 'rotate-180' : ''}`} />
        </button>
        
        {demoState.dropdown && (
          <div className="absolute top-14 left-4 bg-slate-800 rounded-lg shadow-xl border border-white/20 overflow-hidden animate-expand">
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

    // ===== ACCORDION DEMO =====
    accordion: (
      <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-4 border border-white/10 overflow-y-auto">
        {['What is this?', 'How does it work?', 'Is it free?'].map((question, index) => (
          <div key={index} className="mb-2">
            <button
              onClick={() => setDemoState({ ...demoState, accordion: demoState.accordion === index ? null : index })}
              className="w-full px-4 py-3 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-colors flex items-center justify-between border border-white/10"
            >
              <span>{question}</span>
              <ChevronRight className={`w-4 h-4 transition-transform ${demoState.accordion === index ? 'rotate-90' : ''}`} />
            </button>
            {demoState.accordion === index && (
              <div className="mt-2 p-4 bg-white/5 rounded-lg text-gray-300 animate-expand border border-white/10">
                This is the answer to "{question}". Accordions help organize content in collapsible sections.
              </div>
            )}
          </div>
        ))}
      </div>
    ),

    // ===== TABS DEMO =====
    tabs: (
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
          <div className="text-gray-300 animate-fadeIn">
            {['Overview content here', 'Features content here', 'Pricing content here'][demoState.tabs]}
          </div>
        </div>
      </div>
    ),

    // ===== TOOLTIP DEMO =====
    tooltip: (
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
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-xl animate-fadeIn border border-white/20">
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900 border-r border-b border-white/20"></div>
              This is helpful information!
            </div>
          )}
        </div>
      </div>
    ),

    // ===== DRAWER DEMO =====
    drawer: (
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
              className="absolute inset-0 bg-black/50 animate-fadeIn"
              onClick={() => setDemoState({ ...demoState, drawer: false })}
            />
            <div className="absolute left-0 top-0 h-full w-64 bg-slate-800 shadow-xl animate-slideInLeft border-r border-white/20">
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

    // ===== AVATAR DEMO =====
    avatar: (
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

    // ===== CHIP DEMO =====
    chip: (
      <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-4 border border-white/10">
        <p className="text-gray-400 text-sm mb-4">Selected filters:</p>
        <div className="flex flex-wrap gap-2">
          {['React', 'TypeScript', 'Tailwind', 'Next.js', 'Node.js'].map(tag => (
            <div key={tag} className="inline-flex items-center gap-1 px-3 py-1 bg-white/10 text-gray-300 rounded-full text-sm border border-white/20">
              <span>{tag}</span>
              <button className="ml-1 hover:text-red-400">×</button>
            </div>
          ))}
        </div>
        <p className="text-cyan-400 text-xs mt-4">Click × to remove tags</p>
      </div>
    ),

    // ===== BADGE DEMO =====
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

    // ===== SKELETON DEMO =====
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

    // ===== SPINNER DEMO =====
    spinner: (
      <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 border border-white/10 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-gray-600 border-t-cyan-400 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-400">Loading content...</p>
      </div>
    ),

    // ===== PROGRESS BAR DEMO =====
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
            Start Upload
          </button>
        </div>
      </div>
    ),

    // ===== ALERT DEMO =====
    alert: (
      <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 border border-white/10">
        <div className="space-y-4">
          {demoState.alert && (
            <div className="border-l-4 border-yellow-500 bg-yellow-500/10 p-4 rounded animate-fadeIn">
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

    // ===== EMPTY STATE DEMO =====
    empty: (
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

    // ===== INFINITE SCROLL DEMO =====
    'infinite-scroll': (
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

    // ===== LAZY LOADING DEMO =====
    'lazy-loading': (
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

    // ===== STICKY HEADER DEMO =====
    'sticky-header': (
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

    // ===== FLOATING LABEL DEMO =====
    'floating-label': (
      <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 border border-white/10">
        <div className="space-y-6">
          <div className="relative">
            <input 
              type="text" 
              placeholder=" "
              className="w-full px-3 pt-6 pb-2 bg-white/10 border border-white/20 rounded-lg text-white peer"
            />
            <label className="absolute left-3 top-2 text-xs text-cyan-400 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all">
              Email Address
            </label>
          </div>
          <div className="relative">
            <input 
              type="password" 
              placeholder=" "
              className="w-full px-3 pt-6 pb-2 bg-white/10 border border-white/20 rounded-lg text-white peer"
            />
            <label className="absolute left-3 top-2 text-xs text-cyan-400 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all">
              Password
            </label>
          </div>
          <p className="text-gray-400 text-xs text-center">Click input to see label float up!</p>
        </div>
      </div>
    ),

    // ===== MEGA MENU DEMO =====
    'mega-menu': (
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
    ),

    // ===== DRAG & DROP DEMO =====
    'drag-drop': (
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

    // ===== SWIPE GESTURE DEMO =====
    'swipe': (
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

    // ===== PULL TO REFRESH DEMO =====
    'pull-refresh': (
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

    // ===== FORM VALIDATION DEMO =====
    'form-validation': (
      <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-4 border border-white/10">
        <div className="space-y-4">
          <div>
            <input 
              type="email" 
              placeholder="Enter email"
              className="w-full px-3 py-2 bg-white/10 border border-red-500 rounded-lg text-white"
            />
            <p className="text-red-400 text-xs mt-1">Please enter a valid email address</p>
          </div>
          <div>
            <input 
              type="password" 
              placeholder="Password"
              className="w-full px-3 py-2 bg-white/10 border border-green-500 rounded-lg text-white"
            />
            <p className="text-green-400 text-xs mt-1">✓ Strong password</p>
          </div>
          <button className="w-full px-4 py-2 bg-cyan-500 text-white rounded-lg">
            Submit
          </button>
        </div>
      </div>
    ),

    // ===== AUTOCOMPLETE DEMO =====
    'autocomplete': (
      <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-4 border border-white/10">
        <input 
          type="text" 
          placeholder="Type 'React'..."
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
        />
        <div className="mt-2 bg-white/10 rounded-lg overflow-hidden">
          <div className="px-3 py-2 hover:bg-white/20 text-gray-300 cursor-pointer">React</div>
          <div className="px-3 py-2 hover:bg-white/20 text-gray-300 cursor-pointer">React Native</div>
          <div className="px-3 py-2 hover:bg-white/20 text-gray-300 cursor-pointer">React Router</div>
          <div className="px-3 py-2 hover:bg-white/20 text-gray-300 cursor-pointer">React Hook Form</div>
        </div>
        <p className="text-gray-400 text-xs mt-3 text-center">Suggestions appear as you type</p>
      </div>
    ),

    // ===== MULTI-STEP FORM DEMO =====
    'multi-step-form': (
      <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-4 border border-white/10">
        <div className="flex justify-between mb-6">
          {['Personal', 'Address', 'Payment'].map((step, i) => (
            <div key={i} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                i === 0 ? 'bg-cyan-500 text-white' : 'bg-white/10 text-gray-500'
              }`}>
                {i + 1}
              </div>
              {i < 2 && <div className="w-16 h-0.5 bg-white/10 mx-2"></div>}
            </div>
          ))}
        </div>
        <div className="bg-white/5 rounded-lg p-4">
          <h4 className="text-white mb-3">Step 1: Personal Information</h4>
          <input 
            type="text" 
            placeholder="Full Name"
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
          />
        </div>
        <div className="flex justify-between mt-4">
          <button className="px-4 py-2 text-gray-400">Back</button>
          <button className="px-4 py-2 bg-cyan-500 text-white rounded">Next</button>
        </div>
      </div>
    ),

    // ===== TAG INPUT DEMO =====
    'tag-input': (
      <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-4 border border-white/10">
        <div className="bg-white/10 rounded-lg p-3">
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm inline-flex items-center gap-1">
              JavaScript <button className="hover:text-white">×</button>
            </span>
            <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm inline-flex items-center gap-1">
              React <button className="hover:text-white">×</button>
            </span>
            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm inline-flex items-center gap-1">
              Node.js <button className="hover:text-white">×</button>
            </span>
          </div>
          <input 
            type="text" 
            placeholder="Add a tag..."
            className="w-full px-2 py-1 bg-transparent text-white outline-none"
          />
        </div>
        <p className="text-gray-400 text-xs mt-3 text-center">Type and press Enter to add tags</p>
      </div>
    ),

    // ===== RANGE SLIDER DEMO =====
    'range-slider': (
      <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 border border-white/10">
        <div className="space-y-6">
          <div>
            <label className="text-gray-400 text-sm">Price Range: $50 - $150</label>
            <div className="relative mt-2">
              <input 
                type="range" 
                min="0" 
                max="200" 
                defaultValue="50"
                className="w-full"
              />
              <input 
                type="range" 
                min="0" 
                max="200" 
                defaultValue="150"
                className="w-full absolute top-0"
              />
            </div>
          </div>
          <div>
            <label className="text-gray-400 text-sm">Volume: 75%</label>
            <input 
              type="range" 
              min="0" 
              max="100" 
              defaultValue="75"
              className="w-full mt-2"
            />
          </div>
        </div>
      </div>
    ),

    // ===== PUSH NOTIFICATION DEMO =====
    'push-notification': (
      <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-4 border border-white/10">
        <button className="px-4 py-2 bg-cyan-500 text-white rounded-lg mb-4">
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

    // ===== LOADING OVERLAY DEMO =====
    'loading-overlay': (
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

    // ===== CONFIRMATION MODAL DEMO =====
    'confirmation-modal': (
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

    // ===== SUCCESS STATE DEMO =====
    'success-state': (
      <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 border border-white/10 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <h3 className="text-white font-semibold mb-2">Success!</h3>
          <p className="text-gray-400 text-sm">Your changes have been saved</p>
        </div>
      </div>
    ),

    // ===== VIRTUAL LIST DEMO =====
    'virtual-list': (
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
        <p className="text-cyan-400 text-xs mt-2 text-center">Efficiently handles thousands of items</p>
      </div>
    ),

    // ===== DATA GRID DEMO =====
    'data-grid': (
      <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-4 border border-white/10 overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-2 text-gray-400 cursor-pointer hover:text-cyan-400">
                Name ↓
              </th>
              <th className="text-left py-2 text-gray-400 cursor-pointer hover:text-cyan-400">
                Age
              </th>
              <th className="text-left py-2 text-gray-400 cursor-pointer hover:text-cyan-400">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-white/5 hover:bg-white/5">
              <td className="py-2 text-white">Alice Johnson</td>
              <td className="py-2 text-gray-300">28</td>
              <td className="py-2"><span className="text-green-400">Active</span></td>
            </tr>
            <tr className="border-b border-white/5 hover:bg-white/5">
              <td className="py-2 text-white">Bob Smith</td>
              <td className="py-2 text-gray-300">32</td>
              <td className="py-2"><span className="text-yellow-400">Pending</span></td>
            </tr>
          </tbody>
        </table>
        <p className="text-gray-500 text-xs mt-2">Click headers to sort</p>
      </div>
    ),

    // ===== TIMELINE DEMO =====
    'timeline': (
      <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-4 border border-white/10 overflow-y-auto">
        <div className="relative pl-8">
          <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-white/20"></div>
          {['Started project', 'Added features', 'Released v1.0'].map((event, i) => (
            <div key={i} className="relative mb-4">
              <div className="absolute -left-5 w-3 h-3 bg-cyan-400 rounded-full"></div>
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-white text-sm">{event}</div>
                <div className="text-gray-500 text-xs">{i === 0 ? '2 hours ago' : i === 1 ? '1 hour ago' : 'Just now'}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),

    // ===== TREE VIEW DEMO =====
    'tree-view': (
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

    // ===== SEARCH WITH FILTERS DEMO =====
    'search-filter': (
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

    // ===== LIVE SEARCH DEMO =====
    'live-search': (
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

    // ===== BOTTOM SHEET DEMO =====
    'bottom-sheet': (
      <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg overflow-hidden border border-white/10 relative">
        <div className="p-4">
          <button className="px-4 py-2 bg-purple-500 text-white rounded">Open Actions</button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-slate-800 rounded-t-2xl border-t border-white/20 p-4">
          <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mb-3"></div>
          <div className="space-y-2">
            <button className="w-full p-3 text-left text-gray-300 hover:bg-white/10 rounded">Share</button>
            <button className="w-full p-3 text-left text-gray-300 hover:bg-white/10 rounded">Copy Link</button>
            <button className="w-full p-3 text-left text-gray-300 hover:bg-white/10 rounded">Delete</button>
          </div>
        </div>
      </div>
    ),

    // ===== FLOATING ACTION BUTTON DEMO =====
    'fab': (
      <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-4 border border-white/10 relative">
        <div className="text-gray-400 text-sm">Main content area</div>
        <button className="absolute bottom-4 right-4 w-14 h-14 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all flex items-center justify-center text-2xl">
          +
        </button>
        <p className="text-gray-500 text-xs absolute bottom-20 right-4">FAB</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      {demos[term.demoType] || (
        <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 border border-white/10 flex items-center justify-center">
          <span className="text-gray-500">Demo coming soon!</span>
        </div>
      )}
    </div>
  )
}