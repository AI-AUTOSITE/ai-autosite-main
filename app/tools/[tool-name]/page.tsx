// app/tools/[tool-name]/page.tsx
// Tool Migration Template - Copy this file to create new tools

'use client'

import { useState, useEffect } from 'react'
import UnifiedToolLayout from '@/components/common/UnifiedToolLayout'
import { AlertCircle, CheckCircle, Loader } from 'lucide-react'

// ========================================
// STEP 1: Configure your tool information
// ========================================
const TOOL_CONFIG = {
  id: 'tool-template', // Change this to your tool ID
  name: 'Tool Name',
  description: 'Tool description goes here',
  // Optional overrides for layout
  layoutOptions: {
    showSidebar: true,
    showCrossSell: true,
    containerWidth: 'xl' as const, // sm, md, lg, xl, 2xl, full
  },
}

// ========================================
// STEP 2: Define your tool's types
// ========================================
interface ToolState {
  input: string
  output: string
  isProcessing: boolean
  error: string | null
}

// ========================================
// STEP 3: Create your tool component
// ========================================
function ToolComponent() {
  const [state, setState] = useState<ToolState>({
    input: '',
    output: '',
    isProcessing: false,
    error: null,
  })

  // Tool-specific logic
  const processInput = async () => {
    setState((prev) => ({ ...prev, isProcessing: true, error: null }))

    try {
      // Simulate processing (replace with actual logic)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Your tool logic here
      const result = state.input.toUpperCase() // Example transformation

      setState((prev) => ({
        ...prev,
        output: result,
        isProcessing: false,
      }))
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : 'An error occurred',
        isProcessing: false,
      }))
    }
  }

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Input</label>
        <textarea
          value={state.input}
          onChange={(e) => setState((prev) => ({ ...prev, input: e.target.value }))}
          placeholder="Enter your input here..."
          className="w-full h-32 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-colors resize-none"
        />
      </div>

      {/* Action Button */}
      <button
        onClick={processInput}
        disabled={!state.input || state.isProcessing}
        className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg font-medium hover:from-cyan-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
      >
        {state.isProcessing ? (
          <>
            <Loader className="w-4 h-4 animate-spin" />
            Processing...
          </>
        ) : (
          'Process'
        )}
      </button>

      {/* Error Message */}
      {state.error && (
        <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-400">Error</p>
            <p className="text-sm text-red-300 mt-1">{state.error}</p>
          </div>
        </div>
      )}

      {/* Output Section */}
      {state.output && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-300">Output</label>
            <button
              onClick={() => navigator.clipboard.writeText(state.output)}
              className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Copy to clipboard
            </button>
          </div>
          <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
            <pre className="text-white whitespace-pre-wrap break-all">{state.output}</pre>
          </div>
        </div>
      )}

      {/* Features Section (Optional) */}
      <div className="mt-8 pt-8 border-t border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">Features</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-white">Feature 1</p>
              <p className="text-xs text-gray-400 mt-1">Description of feature 1</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-white">Feature 2</p>
              <p className="text-xs text-gray-400 mt-1">Description of feature 2</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ========================================
// STEP 4: Export the page with layout
// ========================================
export default function ToolPage() {
  return (
    <UnifiedToolLayout
      toolId={TOOL_CONFIG.id}
      title={TOOL_CONFIG.name}
      description={TOOL_CONFIG.description}
      {...TOOL_CONFIG.layoutOptions}
    >
      <ToolComponent />
    </UnifiedToolLayout>
  )
}

// ========================================
// MIGRATION CHECKLIST:
// ========================================
/*
□ 1. Copy this file to app/tools/[your-tool-name]/page.tsx
□ 2. Update TOOL_CONFIG with your tool information
□ 3. Add tool to categories.config.ts:
     - Add to TOOLS array with matching ID
     - Set appropriate category
     - Configure status, pricing, etc.
□ 4. Replace ToolComponent with your actual tool logic
□ 5. If tool requires special packages:
     - Add to package.json
     - Note in tool's dependencies field
□ 6. If tool needs API:
     - Set apiRequired: true in config
     - Add API route if needed
□ 7. Test the tool:
     - Navigation from home page
     - Tool functionality
     - Mobile responsiveness
     - Cross-sell links
□ 8. Optional: Add tool-specific components in ./components/
*/
