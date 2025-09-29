import { X, Palette, Sparkles, Code, Download } from 'lucide-react'

export const toolGuide = {
  title: 'How to use Gradient Generator',
  steps: [
    { icon: '1', text: 'Choose gradient type (linear, radial, conic)' },
    { icon: '2', text: 'Select or input colors' },
    { icon: '3', text: 'Adjust angle and positions' },
    { icon: '4', text: 'Copy CSS code' }
  ],
  tips: [
    'Use 2-3 colors for clean gradients',
    'Try complementary colors',
    'Adjust stops for smooth transitions',
    'Test on different backgrounds'
  ],
  troubleshooting: [
    { problem: 'Gradient looks muddy', solution: 'Avoid too many color stops' },
    { problem: 'Hard edges', solution: 'Adjust color stop positions' },
    { problem: 'Not smooth', solution: 'Use colors with similar brightness' }
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
        <Palette className="w-6 h-6 text-purple-400" />
        <h3 className="text-xl font-bold text-white">{toolGuide.title}</h3>
      </div>
      
      <div className="space-y-3 mb-6">
        <h4 className="text-sm font-semibold text-gray-300">Steps</h4>
        {toolGuide.steps.map((step, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs text-white font-semibold">{step.icon}</span>
            </div>
            <p className="text-sm text-gray-300">{step.text}</p>
          </div>
        ))}
      </div>
      
      <div className="space-y-2 mb-6">
        <h4 className="text-sm font-semibold text-gray-300">Design Tips</h4>
        <div className="bg-white/5 rounded-lg p-3 space-y-1">
          {toolGuide.tips.map((tip, index) => (
            <p key={index} className="text-xs text-gray-300">• {tip}</p>
          ))}
        </div>
      </div>
      
      <div className="p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20">
        <p className="text-xs text-purple-400">
          <Sparkles className="w-3 h-3 inline mr-1" />
          <strong>Trend:</strong> Mesh gradients are popular in 2025!
        </p>
      </div>
    </div>
  )
}