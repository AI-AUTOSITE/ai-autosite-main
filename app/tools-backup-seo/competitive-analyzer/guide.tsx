// app/tools/competitive-analyzer/components/ToolGuide.tsx

import { X, TrendingUp, Search, Lightbulb, Shield, Sparkles, AlertTriangle } from 'lucide-react'

export const toolGuide = {
  title: 'How to use Competitive Analyzer',
  steps: [
    { icon: '1', text: 'Enter your product or business idea name' },
    { icon: '2', text: 'Select your industry category' },
    { icon: '3', text: 'Describe your target market clearly' },
    { icon: '4', text: 'Click Analyze to get AI-powered insights' }
  ],
  tips: [
    'Be specific about your target market for better results',
    'Include key features to get more relevant analysis',
    'Free limit: 3 analyses per day',
    'Analysis takes 3-5 seconds on average',
    'Results include competitors, gaps, and ideas',
    'Export as JSON for further processing'
  ],
  troubleshooting: [
    { problem: 'Analysis not starting', solution: 'Check if required fields are filled' },
    { problem: 'Daily limit reached', solution: 'Wait 24 hours or use your own API key' },
    { problem: 'Generic results', solution: 'Provide more specific target market details' },
    { problem: 'Export not working', solution: 'Check browser download settings' }
  ],
  bestPractices: [
    { title: 'Target Market', tip: 'Be specific: "Remote teams of 10-50 people" vs just "teams"' },
    { title: 'Features', tip: 'List unique features that differentiate your product' },
    { title: 'Category', tip: 'Choose the closest match, use "Other" if unsure' }
  ]
}

interface ToolGuideProps {
  onClose?: () => void
  compact?: boolean
}

export default function ToolGuide({ onClose, compact = false }: ToolGuideProps) {
  if (compact) {
    // Compact version for inline help
    return (
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-5 h-5 text-purple-400" />
          <h4 className="text-sm font-semibold text-white">Quick Guide</h4>
        </div>
        <div className="space-y-2 text-xs text-gray-300">
          <p>• Enter product name & target market</p>
          <p>• AI analyzes competition in seconds</p>
          <p>• Get market gaps & product ideas</p>
          <p className="text-yellow-400 mt-2">
            <Sparkles className="w-3 h-3 inline mr-1" />
            Free: 3 analyses per day
          </p>
        </div>
      </div>
    )
  }

  // Full guide modal version
  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 max-w-2xl w-full relative">
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
        <TrendingUp className="w-6 h-6 text-purple-400" />
        <h3 className="text-xl font-bold text-white">{toolGuide.title}</h3>
      </div>
      
      {/* Steps Section */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <h4 className="text-sm font-semibold text-gray-300 mb-3">Steps</h4>
          <div className="space-y-3">
            {toolGuide.steps.map((step, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs text-purple-400 font-semibold">{step.icon}</span>
                </div>
                <p className="text-sm text-gray-300">{step.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Best Practices */}
        <div>
          <h4 className="text-sm font-semibold text-gray-300 mb-3">Best Practices</h4>
          <div className="space-y-2">
            {toolGuide.bestPractices.map((practice, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-white font-medium">{practice.title}</p>
                    <p className="text-xs text-gray-400 mt-1">{practice.tip}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Features & Tips */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-300 mb-3">Features & Limits</h4>
        <div className="bg-white/5 rounded-lg p-4 grid md:grid-cols-2 gap-2">
          {toolGuide.tips.map((tip, index) => (
            <p key={index} className="text-xs text-gray-300 flex items-start">
              <span className="text-purple-400 mr-1">•</span>
              {tip}
            </p>
          ))}
        </div>
      </div>

      {/* Rate Limit Notice */}
      <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20 mb-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-yellow-400 mb-1">Usage Limits</h4>
            <p className="text-xs text-gray-300">
              Free tier includes 3 analyses per day. Need more? You can bring your own API key 
              or wait 24 hours for the limit to reset.
            </p>
          </div>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20 mb-6">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-green-400 mb-1">Privacy & Security</h4>
            <p className="text-xs text-gray-300">
              Your business ideas are processed securely and never stored. All analysis happens 
              in real-time and data is immediately discarded after results are generated.
            </p>
          </div>
        </div>
      </div>
      
      {/* Troubleshooting */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-300 mb-3">Troubleshooting</h4>
        <div className="space-y-2">
          {toolGuide.troubleshooting.map((item, index) => (
            <details key={index} className="group">
              <summary className="cursor-pointer text-xs text-gray-400 hover:text-white transition-colors">
                <Search className="w-3 h-3 inline mr-1" />
                {item.problem}
              </summary>
              <p className="text-xs text-gray-300 ml-5 mt-1 p-2 bg-white/5 rounded">
                → {item.solution}
              </p>
            </details>
          ))}
        </div>
      </div>

      {/* Pro Tips */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
          <p className="text-xs text-purple-400">
            <TrendingUp className="w-3 h-3 inline mr-1" />
            <strong>Pro tip:</strong> Analyze 2-3 variations of your idea to find the best angle!
          </p>
        </div>
        <div className="p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
          <p className="text-xs text-cyan-400">
            <Sparkles className="w-3 h-3 inline mr-1" />
            <strong>Best time:</strong> Use during brainstorming sessions for instant validation!
          </p>
        </div>
      </div>
    </div>
  )
}