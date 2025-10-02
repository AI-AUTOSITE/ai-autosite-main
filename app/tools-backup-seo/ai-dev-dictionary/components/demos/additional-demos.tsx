// app/tools/ai-dev-dictionary/components/demos/additional-demos.tsx

import { Upload, Palette, Clock, Calendar, BarChart3, Columns3, Home, Mic, QrCode, Info, X, ChevronLeft, ChevronRight } from 'lucide-react'
import type { DemoFunction } from './index'

export const additionalDemos: Record<string, DemoFunction> = {
  // COLOR PICKER DEMO
  'color-picker': (demoState, setDemoState) => (
    <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 border border-white/10">
      <label className="text-gray-400 text-sm mb-3 block">Choose a color:</label>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <input 
            type="color" 
            defaultValue="#06b6d4"
            className="w-16 h-16 rounded cursor-pointer"
            onChange={(e) => setDemoState({ ...demoState, colorPicker: e.target.value })}
          />
          <div className="flex-1">
            <div className="text-white mb-1">Selected Color</div>
            <div className="text-cyan-400 font-mono">{demoState.colorPicker || '#06b6d4'}</div>
          </div>
        </div>
        <div className="flex gap-2">
          {['#ef4444', '#f59e0b', '#10b981', '#06b6d4', '#8b5cf6', '#ec4899'].map(color => (
            <button
              key={color}
              onClick={() => setDemoState({ ...demoState, colorPicker: color })}
              className="w-10 h-10 rounded hover:scale-110 transition-transform"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
    </div>
  ),

  // TIME PICKER DEMO
  'time-picker': (demoState, setDemoState) => (
    <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 border border-white/10">
      <label className="text-gray-400 text-sm mb-3 block">Select time:</label>
      <div className="space-y-4">
        <input
          type="time"
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
          onChange={(e) => setDemoState({ ...demoState, timePicker: e.target.value })}
        />
        <div className="grid grid-cols-4 gap-2">
          {['09:00', '12:00', '15:00', '18:00'].map(time => (
            <button
              key={time}
              onClick={() => setDemoState({ ...demoState, timePicker: time })}
              className="px-3 py-2 bg-white/10 text-gray-300 rounded hover:bg-white/20 text-sm"
            >
              {time}
            </button>
          ))}
        </div>
        {demoState.timePicker && (
          <div className="p-3 bg-cyan-500/20 rounded-lg">
            <Clock className="inline w-4 h-4 text-cyan-400 mr-2" />
            <span className="text-cyan-400">Selected: {demoState.timePicker}</span>
          </div>
        )}
      </div>
    </div>
  ),

  // FILE UPLOAD DEMO
  'file-upload': (demoState, setDemoState) => (
    <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 border border-white/10">
      <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-cyan-400 transition-colors">
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-white mb-2">Click to upload or drag and drop</p>
        <p className="text-gray-400 text-sm">PNG, JPG, PDF up to 10MB</p>
        <input type="file" className="hidden" />
        <button className="mt-4 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600">
          Browse Files
        </button>
      </div>
      <div className="mt-4 text-gray-400 text-xs text-center">
        Supported formats: Images, Documents, Videos
      </div>
    </div>
  ),

  // POPOVER DEMO
  popover: (demoState, setDemoState) => (
    <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 border border-white/10 flex items-center justify-center">
      <div className="relative">
        <button
          onClick={() => setDemoState({ ...demoState, popover: !demoState.popover })}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
        >
          Click for info
        </button>
        {demoState.popover && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 w-64 p-4 bg-slate-800 rounded-lg shadow-xl border border-white/20">
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-white font-semibold">Popover Title</h4>
              <button
                onClick={() => setDemoState({ ...demoState, popover: false })}
                className="p-0.5 hover:bg-white/10 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            <p className="text-gray-300 text-sm">This is a popover with more detailed information than a tooltip.</p>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-3 h-3 bg-slate-800 border-r border-b border-white/20"></div>
          </div>
        )}
      </div>
    </div>
  ),

  // DIVIDER DEMO
  divider: (demoState, setDemoState) => (
    <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 border border-white/10">
      <div className="space-y-4">
        <div className="text-gray-300">Section 1 Content</div>
        <hr className="border-white/20" />
        <div className="text-gray-300">Section 2 Content</div>
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-white/20"></div>
          <span className="text-gray-400 text-sm">OR</span>
          <div className="flex-1 h-px bg-white/20"></div>
        </div>
        <div className="text-gray-300">Section 3 Content</div>
        <div className="border-l-4 border-cyan-500 pl-4">
          <div className="text-white">Highlighted Section</div>
          <div className="text-gray-400 text-sm">With vertical divider accent</div>
        </div>
      </div>
    </div>
  ),

  // SNACKBAR DEMO
  snackbar: (demoState, setDemoState) => (
    <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-4 border border-white/10 relative">
      <button
        onClick={() => {
          setDemoState({ ...demoState, snackbar: true })
          setTimeout(() => setDemoState({ ...demoState, snackbar: false }), 3000)
        }}
        className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
      >
        Show Snackbar
      </button>
      
      {demoState.snackbar && (
        <div className="absolute bottom-4 left-4 right-4 px-4 py-3 bg-gray-900 text-white rounded-lg shadow-xl flex items-center justify-between">
          <span>Item has been archived</span>
          <button className="text-cyan-400 font-medium hover:text-cyan-300">UNDO</button>
        </div>
      )}
    </div>
  ),

  // CHART/GRAPH DEMO
  chart: (demoState, setDemoState) => (
    <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-4 border border-white/10">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-cyan-400" />
        <h3 className="text-white font-semibold">Analytics Chart</h3>
      </div>
      <div className="flex items-end justify-around h-40 gap-2">
        {[40, 65, 30, 85, 50, 70, 45].map((height, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div 
              className="w-full bg-gradient-to-t from-cyan-500 to-purple-500 rounded-t"
              style={{ height: `${height}%` }}
            ></div>
            <span className="text-gray-500 text-xs">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span>
          </div>
        ))}
      </div>
      <p className="text-gray-400 text-xs text-center mt-3">Weekly Performance</p>
    </div>
  ),

  // CALENDAR VIEW DEMO
  'calendar-view': (demoState, setDemoState) => (
    <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-4 border border-white/10">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-semibold">November 2024</h3>
        <Calendar className="w-5 h-5 text-cyan-400" />
      </div>
      <div className="grid grid-cols-7 gap-1 text-xs">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
          <div key={day} className="text-center text-gray-500 py-1">{day}</div>
        ))}
        {Array.from({ length: 35 }, (_, i) => {
          const date = i - 2; // Start from Thursday
          const isToday = date === 15;
          const isCurrentMonth = date > 0 && date <= 30;
          return (
            <button
              key={i}
              className={`aspect-square flex items-center justify-center rounded text-xs
                ${isToday ? 'bg-cyan-500 text-white' : 
                  isCurrentMonth ? 'text-gray-300 hover:bg-white/10' : 'text-gray-600'}`}
            >
              {isCurrentMonth ? date : ''}
            </button>
          )
        })}
      </div>
    </div>
  ),

  // KANBAN BOARD DEMO
  'kanban-board': (demoState, setDemoState) => (
    <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-4 border border-white/10 overflow-x-auto">
      <div className="flex gap-3 h-full">
        {['To Do', 'In Progress', 'Done'].map((column, colIndex) => (
          <div key={column} className="flex-1 min-w-[150px]">
            <div className="bg-white/5 rounded-lg p-2 h-full">
              <h4 className="text-gray-300 text-sm font-semibold mb-2">{column}</h4>
              <div className="space-y-2">
                {Array.from({ length: colIndex === 1 ? 2 : 1 }, (_, i) => (
                  <div key={i} className="p-2 bg-white/10 rounded text-xs text-gray-300 cursor-move hover:bg-white/20">
                    Task {colIndex * 2 + i + 1}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),

  // SIDE NAVIGATION (COLLAPSIBLE) DEMO
  'side-navigation': (demoState, setDemoState) => (
    <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg overflow-hidden border border-white/10 flex">
      <div className={`bg-white/10 border-r border-white/10 transition-all ${
        demoState.sideNav ? 'w-48' : 'w-12'
      }`}>
        <button
          onClick={() => setDemoState({ ...demoState, sideNav: !demoState.sideNav })}
          className="w-full p-3 hover:bg-white/10"
        >
          {demoState.sideNav ? <ChevronLeft className="w-5 h-5 text-white ml-auto" /> : <ChevronRight className="w-5 h-5 text-white" />}
        </button>
        <div className="p-2">
          {['Dashboard', 'Analytics', 'Reports'].map((item, i) => (
            <button
              key={item}
              className="w-full text-left p-2 text-gray-300 hover:bg-white/10 rounded flex items-center gap-3"
            >
              <Home className="w-5 h-5 flex-shrink-0" />
              {demoState.sideNav && <span>{item}</span>}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 p-4">
        <p className="text-gray-400 text-sm">Main content area</p>
      </div>
    </div>
  ),

  // BOTTOM NAVIGATION DEMO
  'bottom-navigation': (demoState, setDemoState) => (
    <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg overflow-hidden border border-white/10 flex flex-col">
      <div className="flex-1 p-4">
        <p className="text-gray-400 text-sm">App content area</p>
      </div>
      <div className="bg-white/10 border-t border-white/20">
        <div className="flex justify-around py-2">
          {[
            { icon: '🏠', label: 'Home' },
            { icon: '🔍', label: 'Search' },
            { icon: '➕', label: 'Add' },
            { icon: '💬', label: 'Chat' },
            { icon: '👤', label: 'Profile' }
          ].map((item, i) => (
            <button
              key={item.label}
              onClick={() => setDemoState({ ...demoState, bottomNav: i })}
              className={`flex flex-col items-center gap-1 px-3 py-1 rounded ${
                demoState.bottomNav === i ? 'text-cyan-400' : 'text-gray-400'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  ),

  // VIRTUAL KEYBOARD DEMO
  'virtual-keyboard': (demoState, setDemoState) => (
    <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-4 border border-white/10">
      <input
        type="text"
        value={demoState.virtualKeyboard || ''}
        readOnly
        placeholder="Type using virtual keyboard below"
        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white mb-3"
      />
      <div className="bg-white/5 rounded-lg p-2">
        <div className="grid grid-cols-10 gap-1 mb-1">
          {['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'].map(key => (
            <button
              key={key}
              onClick={() => setDemoState({ 
                ...demoState, 
                virtualKeyboard: (demoState.virtualKeyboard || '') + key 
              })}
              className="aspect-square bg-white/10 text-gray-300 rounded text-xs hover:bg-white/20"
            >
              {key}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-9 gap-1 mb-1 px-4">
          {['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'].map(key => (
            <button
              key={key}
              onClick={() => setDemoState({ 
                ...demoState, 
                virtualKeyboard: (demoState.virtualKeyboard || '') + key 
              })}
              className="aspect-square bg-white/10 text-gray-300 rounded text-xs hover:bg-white/20"
            >
              {key}
            </button>
          ))}
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setDemoState({ 
              ...demoState, 
              virtualKeyboard: (demoState.virtualKeyboard || '').slice(0, -1) 
            })}
            className="flex-1 bg-white/10 text-gray-300 rounded text-xs hover:bg-white/20 py-2"
          >
            ← Delete
          </button>
          <button
            onClick={() => setDemoState({ 
              ...demoState, 
              virtualKeyboard: (demoState.virtualKeyboard || '') + ' ' 
            })}
            className="flex-[3] bg-white/10 text-gray-300 rounded text-xs hover:bg-white/20 py-2"
          >
            Space
          </button>
        </div>
      </div>
    </div>
  ),

  // QR CODE SCANNER DEMO
  'qr-scanner': (demoState, setDemoState) => (
    <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 border border-white/10">
      <div className="bg-black/30 rounded-lg p-8 relative">
        <div className="border-2 border-cyan-400 rounded-lg aspect-square max-w-[150px] mx-auto relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <QrCode className="w-16 h-16 text-gray-600" />
          </div>
          <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-cyan-400 -mt-0.5 -ml-0.5"></div>
          <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-cyan-400 -mt-0.5 -mr-0.5"></div>
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-cyan-400 -mb-0.5 -ml-0.5"></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-cyan-400 -mb-0.5 -mr-0.5"></div>
          <div className="absolute inset-x-0 top-1/2 h-0.5 bg-cyan-400 opacity-50 animate-pulse"></div>
        </div>
      </div>
      <p className="text-center text-gray-400 text-sm mt-4">Point camera at QR code</p>
    </div>
  ),

  // VOICE INPUT DEMO
  'voice-input': (demoState, setDemoState) => (
    <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 border border-white/10">
      <div className="text-center">
        <button
          onClick={() => setDemoState({ ...demoState, voiceInput: !demoState.voiceInput })}
          className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 transition-all ${
            demoState.voiceInput 
              ? 'bg-red-500 animate-pulse' 
              : 'bg-gray-700 hover:bg-gray-600'
          }`}
        >
          <Mic className={`w-10 h-10 text-white ${demoState.voiceInput ? 'animate-pulse' : ''}`} />
        </button>
        <p className="text-white mb-2">
          {demoState.voiceInput ? 'Listening...' : 'Tap to speak'}
        </p>
        {demoState.voiceInput && (
          <div className="flex justify-center gap-1 mt-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div
                key={i}
                className="w-1 bg-cyan-400 rounded-full animate-pulse"
                style={{
                  height: `${Math.random() * 20 + 10}px`,
                  animationDelay: `${i * 0.1}s`
                }}
              ></div>
            ))}
          </div>
        )}
        <p className="text-gray-400 text-xs mt-4">Voice recognition demo</p>
      </div>
    </div>
  )
}