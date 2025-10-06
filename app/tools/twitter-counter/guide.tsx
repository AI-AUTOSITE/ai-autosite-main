import { X, Twitter, Hash, MessageSquare, AlertCircle } from 'lucide-react'

export const toolGuide = {
  title: 'How to use Twitter Counter',
  steps: [
    { icon: '1', text: 'Type or paste your tweet' },
    { icon: '2', text: 'See real-time character count' },
    { icon: '3', text: 'Stay within the 280 limit' },
    { icon: '4', text: 'Copy optimized tweet' },
  ],
  tips: [
    'Standard tweets: 280 characters',
    'Links count as 23 characters',
    'Emojis count as 2 characters',
    'Usernames count toward limit',
  ],
  troubleshooting: [
    { problem: 'Count seems wrong', solution: 'Check for special characters and emojis' },
    { problem: 'Over limit', solution: 'Try abbreviations or split into thread' },
    { problem: 'Link too long', solution: 'All links count as 23 regardless of length' },
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
        <Twitter className="w-6 h-6 text-blue-400" />
        <h3 className="text-xl font-bold text-white">{toolGuide.title}</h3>
      </div>

      <div className="space-y-3 mb-6">
        <h4 className="text-sm font-semibold text-gray-300">Steps</h4>
        {toolGuide.steps.map((step, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs text-blue-400 font-semibold">{step.icon}</span>
            </div>
            <p className="text-sm text-gray-300">{step.text}</p>
          </div>
        ))}
      </div>

      <div className="space-y-2 mb-6">
        <h4 className="text-sm font-semibold text-gray-300">Character Rules</h4>
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
          <Hash className="w-3 h-3 inline mr-1" />
          <strong>Pro tip:</strong> Use 1-2 hashtags max for best engagement!
        </p>
      </div>
    </div>
  )
}
