import { X, Instagram, Sparkles } from 'lucide-react'

export const toolGuide = {
  title: 'How to use Bio Generator',
  steps: [
    { icon: '1', text: 'Enter 3 keywords about yourself' },
    { icon: '2', text: 'Choose your style' },
    { icon: '3', text: 'Click Generate' },
    { icon: '4', text: 'Copy your favorite bio' }
  ],
  tips: [
    'Keep it under 150 characters',
    'Use emojis for visual appeal',
    'Include a call-to-action',
    'Update regularly'
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
        >
          <X className="w-5 h-5 text-gray-400 hover:text-white" />
        </button>
      )}
      
      <div className="flex items-center gap-2 mb-4">
        <Instagram className="w-6 h-6 text-pink-400" />
        <h3 className="text-xl font-bold text-white">{toolGuide.title}</h3>
      </div>
      
      <div className="space-y-4">
        {toolGuide.steps.map((step, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-pink-500/20 border border-pink-500/30 flex items-center justify-center flex-shrink-0">
              <span className="text-xs text-pink-400 font-semibold">{step.icon}</span>
            </div>
            <p className="text-sm text-gray-300">{step.text}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-pink-500/20">
        <p className="text-xs text-pink-400">
          <Sparkles className="w-3 h-3 inline mr-1" />
          Pro tip: Use trending keywords for better discovery!
        </p>
      </div>
    </div>
  )
}