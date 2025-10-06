import { X, Heart, Calculator, Activity, Shield } from 'lucide-react'

export const toolGuide = {
  title: 'How to use BMI Calculator',
  steps: [
    { icon: '1', text: 'Enter your weight (kg or lbs)' },
    { icon: '2', text: 'Enter your height (cm or ft/in)' },
    { icon: '3', text: 'Click Calculate BMI' },
    { icon: '4', text: 'View your BMI category and health info' },
  ],
  tips: [
    'BMI = weight (kg) / height² (m²)',
    'Normal range is 18.5 - 24.9',
    "Remember BMI doesn't account for muscle mass",
    'Consult healthcare providers for personalized advice',
  ],
  troubleshooting: [
    { problem: 'Wrong result', solution: 'Check unit selection (metric/imperial)' },
    { problem: 'Seems inaccurate', solution: 'BMI is a general indicator, not absolute' },
    { problem: 'Category unclear', solution: 'See the color-coded health ranges' },
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
        <Heart className="w-6 h-6 text-red-400" />
        <h3 className="text-xl font-bold text-white">{toolGuide.title}</h3>
      </div>

      <div className="space-y-3 mb-6">
        <h4 className="text-sm font-semibold text-gray-300">Steps</h4>
        {toolGuide.steps.map((step, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs text-red-400 font-semibold">{step.icon}</span>
            </div>
            <p className="text-sm text-gray-300">{step.text}</p>
          </div>
        ))}
      </div>

      <div className="space-y-2 mb-6">
        <h4 className="text-sm font-semibold text-gray-300">Important Notes</h4>
        <div className="bg-white/5 rounded-lg p-3 space-y-1">
          {toolGuide.tips.map((tip, index) => (
            <p key={index} className="text-xs text-gray-300">
              • {tip}
            </p>
          ))}
        </div>
      </div>

      <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
        <p className="text-xs text-yellow-400">
          <Activity className="w-3 h-3 inline mr-1" />
          <strong>Note:</strong> BMI is a screening tool, not a diagnostic measure.
        </p>
      </div>
    </div>
  )
}
