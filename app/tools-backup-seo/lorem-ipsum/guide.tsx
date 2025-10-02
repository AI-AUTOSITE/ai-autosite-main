import { X, Type, FileText, Copy, Layout } from 'lucide-react'

export const toolGuide = {
  title: 'How to use Lorem Ipsum Generator',
  steps: [
    { icon: '1', text: 'Choose format (paragraphs, words, lists)' },
    { icon: '2', text: 'Set amount needed' },
    { icon: '3', text: 'Generate placeholder text' },
    { icon: '4', text: 'Copy to clipboard' }
  ],
  tips: [
    'Standard Lorem Ipsum starts with "Lorem ipsum dolor sit amet"',
    'Use for mockups and prototypes',
    'Different variations available',
    'Helps focus on design, not content'
  ],
  troubleshooting: [
    { problem: 'Need different style', solution: 'Try Bacon Ipsum or Hipster Ipsum' },
    { problem: 'Too repetitive', solution: 'Generate more paragraphs' },
    { problem: 'Need specific length', solution: 'Use word count option' }
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
        <Type className="w-6 h-6 text-purple-400" />
        <h3 className="text-xl font-bold text-white">{toolGuide.title}</h3>
      </div>
      
      <div className="space-y-3 mb-6">
        <h4 className="text-sm font-semibold text-gray-300">Steps</h4>
        {toolGuide.steps.map((step, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs text-purple-400 font-semibold">{step.icon}</span>
            </div>
            <p className="text-sm text-gray-300">{step.text}</p>
          </div>
        ))}
      </div>
      
      <div className="space-y-2 mb-6">
        <h4 className="text-sm font-semibold text-gray-300">Usage</h4>
        <div className="bg-white/5 rounded-lg p-3 space-y-1">
          {toolGuide.tips.map((tip, index) => (
            <p key={index} className="text-xs text-gray-300">• {tip}</p>
          ))}
        </div>
      </div>
      
      <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
        <p className="text-xs text-purple-400">
          <FileText className="w-3 h-3 inline mr-1" />
          <strong>History:</strong> Used in printing since the 1500s!
        </p>
      </div>
    </div>
  )
}