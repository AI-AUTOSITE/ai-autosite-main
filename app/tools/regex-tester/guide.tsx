import { X, Code, Shield, BookOpen, Zap } from 'lucide-react'

export const toolGuide = {
  title: 'How to use Regex Tester',
  steps: [
    { icon: '1', text: 'Enter your regex pattern in the input field' },
    { icon: '2', text: 'Paste or type your test string' },
    { icon: '3', text: 'Toggle flags (g, i, m, s, u, y) as needed' },
    { icon: '4', text: 'View highlighted matches and group details' },
  ],
  tips: [
    'Use the cheat sheet for quick syntax reference',
    'Check ReDoS warnings to avoid security issues',
    'Generate code snippets in 6+ languages',
    'Click sample patterns to get started quickly',
  ],
  troubleshooting: [
    { problem: 'No matches found', solution: 'Check if flags are correct (try enabling "g" for global)' },
    { problem: 'Invalid pattern error', solution: 'Look for unescaped special characters like ( ) [ ]' },
    { problem: 'ReDoS warning', solution: 'Avoid nested quantifiers like (a+)+ or (.*)*' },
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
        <Code className="w-6 h-6 text-orange-400" />
        <h3 className="text-xl font-bold text-white">{toolGuide.title}</h3>
      </div>

      <div className="space-y-3 mb-6">
        <h4 className="text-sm font-semibold text-gray-300">Steps</h4>
        {toolGuide.steps.map((step, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs text-orange-400 font-semibold">{step.icon}</span>
            </div>
            <p className="text-sm text-gray-300">{step.text}</p>
          </div>
        ))}
      </div>

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

      <div className="space-y-2 mb-6">
        <h4 className="text-sm font-semibold text-gray-300">Troubleshooting</h4>
        <div className="space-y-2">
          {toolGuide.troubleshooting.map((item, index) => (
            <div key={index} className="bg-white/5 rounded-lg p-3">
              <p className="text-xs text-red-400 mb-1">⚠️ {item.problem}</p>
              <p className="text-xs text-green-400">✓ {item.solution}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
        <p className="text-xs text-orange-400">
          <Shield className="w-3 h-3 inline mr-1" />
          <strong>Security:</strong> ReDoS detection warns you about patterns that could cause performance issues
        </p>
      </div>
    </div>
  )
}
