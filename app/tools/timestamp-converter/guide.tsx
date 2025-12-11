import { X, Clock, Globe, MessageSquare, Zap } from 'lucide-react'

export const toolGuide = {
  title: 'How to use Timestamp Converter',
  steps: [
    { icon: '1', text: 'Enter a Unix timestamp (10 or 13 digits)' },
    { icon: '2', text: 'Precision is auto-detected (seconds/ms)' },
    { icon: '3', text: 'Select your timezone for local time' },
    { icon: '4', text: 'Copy results in various formats' },
  ],
  tips: [
    '10 digits = seconds (e.g., 1701648000)',
    '13 digits = milliseconds (e.g., 1701648000000)',
    'Use Discord tab for chat timestamps',
    'All conversions happen locally in your browser',
  ],
  troubleshooting: [
    { problem: 'Wrong date displayed', solution: 'Check if timestamp is in seconds or milliseconds' },
    { problem: 'Timezone seems off', solution: 'Select correct timezone from the dropdown' },
    { problem: 'Date shows 1970', solution: 'Timestamp might be 0 or invalid' },
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
        <Clock className="w-6 h-6 text-cyan-400" />
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
        <h4 className="text-sm font-semibold text-gray-300">Quick Tips</h4>
        <div className="bg-white/5 rounded-lg p-3 space-y-1">
          {toolGuide.tips.map((tip, index) => (
            <p key={index} className="text-xs text-gray-300">
              • {tip}
            </p>
          ))}
        </div>
      </div>

      <div className="p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
        <p className="text-xs text-cyan-400">
          <Globe className="w-3 h-3 inline mr-1" />
          <strong>Timezone:</strong> All dates are shown in your selected timezone
        </p>
      </div>
    </div>
  )
}
