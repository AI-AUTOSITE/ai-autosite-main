// app/tools/ai-dev-dictionary/components/demos/form-demos.tsx
import type { DemoFunction } from './index'

export const formDemos: Record<string, DemoFunction> = {
  // CHECKBOX DEMO
  checkbox: (demoState, setDemoState) => {
    // checkboxの初期値を確認
    const checkboxState = demoState.checkbox || [false, false, false]
    
    return (
      <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-4 border border-white/10">
        <p className="text-gray-400 text-sm mb-4">Select your preferences:</p>
        <div className="space-y-3">
          {['Email notifications', 'SMS alerts', 'Push notifications'].map((label, i) => (
            <label key={i} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={checkboxState[i] || false}
                onChange={() => {
                  const newCheckbox = [...checkboxState]
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
          Selected: {checkboxState.filter(Boolean).length} items
        </p>
      </div>
    )
  },

  // RADIO BUTTON DEMO
  radio: (demoState, setDemoState) => (
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

  // SWITCH DEMO
  switch: (demoState, setDemoState) => (
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

  // INPUT FIELD DEMO
  input: (demoState, setDemoState) => (
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

  // SELECT BOX DEMO
  select: (demoState, setDemoState) => (
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

  // DATE PICKER DEMO
  datepicker: (demoState, setDemoState) => (
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

  // FLOATING LABEL DEMO
  'floating-label': (demoState, setDemoState) => (
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

  // FORM VALIDATION DEMO
  'form-validation': (demoState, setDemoState) => (
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

  // AUTOCOMPLETE DEMO
  autocomplete: (demoState, setDemoState) => (
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

  // MULTI-STEP FORM DEMO
  'multi-step-form': (demoState, setDemoState) => (
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

  // TAG INPUT DEMO
  'tag-input': (demoState, setDemoState) => (
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

  // RANGE SLIDER DEMO
  'range-slider': (demoState, setDemoState) => (
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
  )
}