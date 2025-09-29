// app/tools/code-dependency-visualizer/guide.tsx
import { HelpCircle, Zap, DollarSign, FileCode, X } from 'lucide-react'

export const toolGuide = {
  title: 'How to use Code Dependency Visualizer',
  steps: [
    { icon: '1', text: 'Upload your project folder or paste GitHub URL' },
    { icon: '2', text: 'View dependency analysis and project structure' },
    { icon: '3', text: 'Compress code to save 60% on AI tokens' },
    { icon: '4', text: 'Export for ChatGPT or Claude' }
  ],
  tips: [
    'Supports up to 500 files',
    'Auto-skips node_modules',
    'Compress saves 60% tokens',
    'Free to use, no signup'
  ],
  troubleshooting: [
    { 
      problem: 'Files not loading', 
      solution: 'Check file extensions (.ts, .tsx, .js, .jsx)' 
    },
    { 
      problem: 'GitHub fetch fails', 
      solution: 'Repository must be public' 
    }
  ]
}

export default function ToolGuide() {
  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 max-w-md">
      <button className="absolute top-2 right-2 p-2 hover:bg-white/10 rounded-lg transition-all">
        <X className="w-5 h-5 text-gray-400" />
      </button>
      
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <HelpCircle className="text-cyan-400" />
        {toolGuide.title}
      </h3>

      {/* Steps */}
      <div className="space-y-3 mb-6">
        <h4 className="text-sm font-semibold text-gray-400">Quick Start</h4>
        {toolGuide.steps.map((step, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-bold">
              {step.icon}
            </div>
            <span className="text-sm text-gray-300">{step.text}</span>
          </div>
        ))}
      </div>

      {/* Tips */}
      <div className="space-y-2 mb-6">
        <h4 className="text-sm font-semibold text-gray-400">Pro Tips</h4>
        {toolGuide.tips.map((tip, index) => (
          <div key={index} className="flex items-start gap-2">
            <Zap className="w-4 h-4 text-yellow-400 mt-0.5" />
            <span className="text-xs text-gray-300">{tip}</span>
          </div>
        ))}
      </div>

      {/* Cost Savings */}
      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
        <div className="flex items-center gap-2 mb-2">
          <DollarSign className="w-4 h-4 text-green-400" />
          <span className="text-sm font-semibold text-green-400">Save 60% on AI costs!</span>
        </div>
        <p className="text-xs text-gray-400">
          Our compression reduces tokens from ~10,000 to ~4,000 for typical projects
        </p>
      </div>
    </div>
  )
}