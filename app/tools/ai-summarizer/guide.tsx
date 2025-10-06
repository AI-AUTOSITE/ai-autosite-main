// app/tools/ai-summarizer/guide.tsx

import { X, Sparkles } from 'lucide-react'

export const toolGuide = {
  title: 'How to Use AI Summarizer',
  steps: [
    { icon: '1', text: 'Paste or type your text' },
    { icon: '2', text: 'Choose summary length (brief/standard/detailed)' },
    { icon: '3', text: 'Select tone (professional/casual/technical)' },
    { icon: '4', text: 'Click "Generate Summary"' },
    { icon: '5', text: 'Copy your summary' },
  ],
  tips: [
    'Works best with 200+ words',
    'Maximum 50,000 characters',
    'AI analyzes key points automatically',
    'Summary preserves main ideas',
    'Perfect for long articles and documents',
  ],
  useCases: [
    { title: 'Study Notes', desc: 'Summarize textbooks' },
    { title: 'Research', desc: 'Extract key findings' },
    { title: 'News Articles', desc: 'Get quick overview' },
    { title: 'Reports', desc: 'Create executive summaries' },
  ],
  troubleshooting: [
    { problem: 'Summary too short', solution: 'Try "detailed" mode' },
    { problem: 'Missing context', solution: 'Include more source text' },
    { problem: 'Wrong tone', solution: 'Adjust tone setting' },
  ],
}

interface ToolGuideProps {
  onClose?: () => void
}

export default function ToolGuide({ onClose }: ToolGuideProps) {
  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 max-w-md w-full relative">
      {/* Close button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Close guide"
        >
          <X className="w-5 h-5 text-gray-400 hover:text-white" />
        </button>
      )}

      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-6 h-6 text-purple-400" />
        <h3 className="text-xl font-bold text-white">{toolGuide.title}</h3>
      </div>

      {/* Steps */}
      <div className="space-y-3 mb-6">
        <h4 className="text-sm font-semibold text-gray-300">Quick Steps</h4>
        {toolGuide.steps.map((step, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs text-purple-400 font-semibold">{step.icon}</span>
            </div>
            <p className="text-sm text-gray-300">{step.text}</p>
          </div>
        ))}
      </div>

      {/* Use Cases */}
      <div className="space-y-2 mb-6">
        <h4 className="text-sm font-semibold text-gray-300">Perfect For</h4>
        <div className="grid grid-cols-2 gap-2">
          {toolGuide.useCases.map((useCase, index) => (
            <div key={index} className="bg-white/5 rounded-lg p-2">
              <div className="text-xs text-white font-semibold">{useCase.title}</div>
              <div className="text-xs text-gray-400">{useCase.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="space-y-2 mb-6">
        <h4 className="text-sm font-semibold text-gray-300">Pro Tips</h4>
        <div className="bg-white/5 rounded-lg p-3 space-y-1">
          {toolGuide.tips.map((tip, index) => (
            <p key={index} className="text-xs text-gray-300">
              • {tip}
            </p>
          ))}
        </div>
      </div>

      {/* Info Notice */}
      <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
        <p className="text-xs text-purple-400">
          <strong>AI-Powered:</strong> Uses advanced AI to understand context and meaning
        </p>
      </div>
    </div>
  )
}
