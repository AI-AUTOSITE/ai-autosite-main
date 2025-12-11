import { X, Link2, Zap, AlertTriangle } from 'lucide-react'

export const toolGuide = {
  title: 'How to use URL Encoder',
  steps: [
    { icon: '1', text: 'Choose Encode or Decode mode' },
    { icon: '2', text: 'Select encoding method (for encode mode)' },
    { icon: '3', text: 'Enter your text or URL-encoded string' },
    { icon: '4', text: 'Copy the result or use advanced tools' },
  ],
  tips: [
    'Use encodeURIComponent for query values',
    'Use encodeURI for complete URLs',
    'URL Parser shows URL structure breakdown',
    'Query Builder helps construct URLs visually',
  ],
  troubleshooting: [
    { problem: 'Double encoding detected', solution: 'Decode first before encoding again' },
    { problem: 'Invalid URL in parser', solution: 'Ensure URL includes protocol (https://)' },
    { problem: 'Special chars not encoded', solution: 'Try encodeURIComponent instead of encodeURI' },
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
        <Link2 className="w-6 h-6 text-emerald-400" />
        <h3 className="text-xl font-bold text-white">{toolGuide.title}</h3>
      </div>

      <div className="space-y-3 mb-6">
        <h4 className="text-sm font-semibold text-gray-300">Steps</h4>
        {toolGuide.steps.map((step, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs text-emerald-400 font-semibold">{step.icon}</span>
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

      <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
        <p className="text-xs text-emerald-400">
          <Zap className="w-3 h-3 inline mr-1" />
          <strong>Quick tip:</strong> Use Query Builder for complex URLs with multiple parameters
        </p>
      </div>
    </div>
  )
}
