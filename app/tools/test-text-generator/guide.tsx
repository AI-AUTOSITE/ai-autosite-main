// app/tools/test-text-generator/guide.tsx

import { X, FileText, Type, Hash, AlertCircle } from 'lucide-react'

export const toolGuide = {
  title: 'How to use Test Text Generator',
  steps: [
    { icon: '1', text: 'Choose language and complexity level' },
    { icon: '2', text: 'Set length (characters, words, or paragraphs)' },
    { icon: '3', text: 'Select output format and content options' },
    { icon: '4', text: 'Copy or download generated text' }
  ],
  tips: [
    'Text updates automatically as you adjust settings',
    'Use Technical mode for realistic development content',
    'Markdown/HTML formats add automatic structure',
    'All processing happens in browser - completely private'
  ],
  troubleshooting: [
    { problem: 'Text not generating', solution: 'Wait 1-2 seconds - large texts take time to process' },
    { problem: 'Copy not working', solution: 'Try download instead or check browser permissions' },
    { problem: 'Text looks strange', solution: 'Disable emoji/special chars options for cleaner output' }
  ]
}

interface ToolGuideProps {
  onClose?: () => void
}

export default function ToolGuide({ onClose }: ToolGuideProps) {
  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 max-w-md w-full relative">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Close guide"
        >
          <X className="w-5 h-5 text-gray-400 hover:text-white" />
        </button>
      )}
      
      <div className="flex items-center gap-2 mb-6">
        <FileText className="w-6 h-6 text-cyan-500" />
        <h3 className="text-xl font-bold text-white">{toolGuide.title}</h3>
      </div>
      
      <div className="space-y-3 mb-6">
        <h4 className="text-sm font-semibold text-gray-300">Steps</h4>
        {toolGuide.steps.map((step, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs text-cyan-500 font-semibold">{step.icon}</span>
            </div>
            <p className="text-sm text-gray-300">{step.text}</p>
          </div>
        ))}
      </div>
      
      <div className="space-y-2 mb-6">
        <h4 className="text-sm font-semibold text-gray-300">Features</h4>
        <div className="bg-white/5 rounded-lg p-3 space-y-1">
          {toolGuide.tips.map((tip, index) => (
            <p key={index} className="text-xs text-gray-300">• {tip}</p>
          ))}
        </div>
      </div>
      
      <div className="space-y-2 mb-6">
        <h4 className="text-sm font-semibold text-gray-300">Troubleshooting</h4>
        {toolGuide.troubleshooting.map((item, index) => (
          <div key={index} className="bg-white/5 rounded-lg p-3">
            <p className="text-xs font-medium text-cyan-400 mb-1">
              <AlertCircle className="w-3 h-3 inline mr-1" />
              {item.problem}
            </p>
            <p className="text-xs text-gray-300">{item.solution}</p>
          </div>
        ))}
      </div>
      
      <div className="p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
        <p className="text-xs text-cyan-400">
          <Type className="w-3 h-3 inline mr-1" />
          <strong>Pro Tip:</strong> Use Mixed language mode to test internationalization features!
        </p>
      </div>
    </div>
  )
}