import { X, MessageCircle, Link2, Phone, Users } from 'lucide-react'

export const toolGuide = {
  title: 'How to use WhatsApp Link Generator',
  steps: [
    { icon: '1', text: 'Enter phone number with country code' },
    { icon: '2', text: 'Add optional pre-filled message' },
    { icon: '3', text: 'Generate click-to-chat link' },
    { icon: '4', text: 'Copy link or QR code' }
  ],
  tips: [
    'Include country code (e.g., +1 for USA)',
    'No spaces or dashes in number',
    'Keep message under 100 characters',
    'Test link before sharing'
  ],
  troubleshooting: [
    { problem: 'Link not working', solution: 'Check country code format' },
    { problem: 'Message not appearing', solution: 'URL encode special characters' },
    { problem: 'Opens wrong number', solution: 'Remove spaces and symbols' }
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
        <MessageCircle className="w-6 h-6 text-green-500" />
        <h3 className="text-xl font-bold text-white">{toolGuide.title}</h3>
      </div>
      
      <div className="space-y-3 mb-6">
        <h4 className="text-sm font-semibold text-gray-300">Steps</h4>
        {toolGuide.steps.map((step, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs text-green-500 font-semibold">{step.icon}</span>
            </div>
            <p className="text-sm text-gray-300">{step.text}</p>
          </div>
        ))}
      </div>
      
      <div className="space-y-2 mb-6">
        <h4 className="text-sm font-semibold text-gray-300">Important</h4>
        <div className="bg-white/5 rounded-lg p-3 space-y-1">
          {toolGuide.tips.map((tip, index) => (
            <p key={index} className="text-xs text-gray-300">• {tip}</p>
          ))}
        </div>
      </div>
      
      <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
        <p className="text-xs text-green-400">
          <Link2 className="w-3 h-3 inline mr-1" />
          <strong>Business tip:</strong> Add to email signatures and social bios!
        </p>
      </div>
    </div>
  )
}