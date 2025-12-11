import { X, Hash, Shield, FileText, Search } from 'lucide-react'

export const toolGuide = {
  title: 'How to use Hash Generator',
  steps: [
    { icon: '1', text: 'Choose mode: Text Hash, File Hash, Verify, or Identify' },
    { icon: '2', text: 'Select algorithms (MD5, SHA-256, etc.)' },
    { icon: '3', text: 'Enter text or upload a file' },
    { icon: '4', text: 'Copy individual hashes or all at once' },
  ],
  tips: [
    'SHA-256 is recommended for most use cases',
    'MD5 and SHA-1 are broken - avoid for security',
    'Use HMAC for message authentication',
    'Verify mode auto-detects algorithm by hash length',
  ],
  troubleshooting: [
    { problem: 'Hash not matching', solution: 'Check encoding and whitespace' },
    { problem: 'Large file slow', solution: 'Files are processed in chunks for efficiency' },
    { problem: 'Need password hashing', solution: 'Use bcrypt or Argon2 (not SHA/MD5)' },
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
        <Hash className="w-6 h-6 text-purple-400" />
        <h3 className="text-xl font-bold text-white">{toolGuide.title}</h3>
      </div>

      <div className="space-y-3 mb-6">
        <h4 className="text-sm font-semibold text-gray-300">Steps</h4>
        {toolGuide.steps.map((step, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs text-purple-400 font-semibold">{step.icon}</span>
            </div>
            <p className="text-sm text-gray-300">{step.text}</p>
          </div>
        ))}
      </div>

      <div className="space-y-2 mb-6">
        <h4 className="text-sm font-semibold text-gray-300">Security Tips</h4>
        <div className="bg-white/5 rounded-lg p-3 space-y-1">
          {toolGuide.tips.map((tip, index) => (
            <p key={index} className="text-xs text-gray-300">
              • {tip}
            </p>
          ))}
        </div>
      </div>

      <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
        <p className="text-xs text-purple-400">
          <Shield className="w-3 h-3 inline mr-1" />
          <strong>Supported:</strong> MD5, SHA-1, SHA-256, SHA-384, SHA-512, HMAC
        </p>
      </div>
    </div>
  )
}
