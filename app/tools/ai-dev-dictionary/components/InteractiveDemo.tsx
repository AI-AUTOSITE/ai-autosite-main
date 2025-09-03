// app/tools/ai-dev-dictionary/components/InteractiveDemo.tsx

'use client'

import { useState } from 'react'
import { allDemos } from './demos'

interface InteractiveDemoProps {
  term?: any  // TechTerm type from parent
  termKey?: string  // For direct key access
}

// デフォルトエクスポートに変更
export default function InteractiveDemo({ term, termKey }: InteractiveDemoProps) {
  const [demoState, setDemoState] = useState<any>({
    // UI states
    modal: false,
    dropdown: false,
    drawer: false,
    tooltip: false,
    popover: false,
    
    // Form states
    checkbox: [false, false, false],
    radio: 'option1',
    switch: false,
    select: '',
    
    // Navigation states
    accordion: null,
    tabs: 0,
    pagination: 1,
    stepper: 1,
    
    // Data states
    carousel: 0,
    
    // Feedback states
    toast: false,
    alert: false,
    progress: 0,
    
    // Additional states
    bottomNav: 0,
    sideNav: true,
    colorPicker: '#06b6d4',
    timePicker: '',
    virtualKeyboard: '',
    voiceInput: false,
  })

  // Use termKey if provided, otherwise get from term object
  const demoKey = termKey || term?.key || term?.id

  // Get the demo function
  const demo = allDemos[demoKey]

  if (!demo) {
    return (
      <div className="h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-8 border border-white/10 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-2">Demo not available</p>
          <p className="text-gray-600 text-sm">Key: {demoKey}</p>
        </div>
      </div>
    )
  }

  // Render the demo
  return demo(demoState, setDemoState)
}