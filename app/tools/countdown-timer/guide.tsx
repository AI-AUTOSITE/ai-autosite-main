import { X, Clock, Calendar, Bell, Target } from 'lucide-react'

export const toolGuide = {
  title: 'How to use Countdown Timer',
  steps: [
    { icon: '1', text: 'Enter event name' },
    { icon: '2', text: 'Set target date and time' },
    { icon: '3', text: 'Choose display format' },
    { icon: '4', text: 'Start countdown and share' },
  ],
  tips: [
    'Add timezone for global events',
    'Enable notifications for reminders',
    'Customize colors and style',
    'Embed on websites with code',
  ],
  troubleshooting: [
    { problem: 'Wrong time showing', solution: 'Check timezone settings' },
    { problem: 'Timer stopped', solution: 'Keep browser tab active' },
    { problem: 'Past date selected', solution: 'Target must be in future' },
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
        <h4 className="text-sm font-semibold text-gray-300">Features</h4>
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
          <Bell className="w-3 h-3 inline mr-1" />
          <strong>Tip:</strong> Create urgency for sales and events!
        </p>
      </div>
    </div>
  )
}
