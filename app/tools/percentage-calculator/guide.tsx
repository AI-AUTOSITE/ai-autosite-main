import { X, Percent, Calculator, TrendingUp, Shield } from 'lucide-react'

export const toolGuide = {
  title: 'How to use Percentage Calculator',
  steps: [
    { icon: '1', text: 'Select calculation type' },
    { icon: '2', text: 'Enter your values' },
    { icon: '3', text: 'View instant results' },
    { icon: '4', text: 'Copy or use the result' },
  ],
  tips: [
    'Calculate discounts and sales tax',
    'Find percentage increase/decrease',
    'Determine what percent X is of Y',
    'Perfect for tips, grades, and finance',
  ],
  troubleshooting: [
    { problem: 'Wrong result', solution: 'Check if you selected the right calculation type' },
    { problem: 'Decimal issues', solution: 'Use decimal point, not comma' },
    { problem: 'Negative percentage', solution: 'This indicates a decrease' },
  ],
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
        <Percent className="w-6 h-6 text-cyan-400" />
        <h3 className="text-xl font-bold text-white">{toolGuide.title}</h3>
      </div>

      <div className="space-y-3 mb-6">
        <h4 className="text-sm font-semibold text-gray-300">Steps</h4>
        {toolGuide.steps.map((step, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs text-cyan-400 font-semibold">{step.icon}</span>
            </div>
            <p className="text-sm text-gray-300">{step.text}</p>
          </div>
        ))}
      </div>

      <div className="space-y-2 mb-6">
        <h4 className="text-sm font-semibold text-gray-300">Common Uses</h4>
        <div className="bg-white/5 rounded-lg p-3 space-y-1">
          {toolGuide.tips.map((tip, index) => (
            <p key={index} className="text-xs text-gray-300">
              • {tip}
            </p>
          ))}
        </div>
      </div>

      <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
        <p className="text-xs text-blue-400">
          <TrendingUp className="w-3 h-3 inline mr-1" />
          <strong>Quick tip:</strong> For 10%, just move decimal one place left!
        </p>
      </div>
    </div>
  )
}
