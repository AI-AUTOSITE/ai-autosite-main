import { X, Upload, MousePointer, Move, Download, Shield } from 'lucide-react'

export const toolGuide = {
  title: 'How to use BlurTap',
  steps: [
    { icon: '1', text: 'Upload or drop your image' },
    { icon: '2', text: 'Choose click or drag mode' },
    { icon: '3', text: 'Add black masks to hide info' },
    { icon: '4', text: 'Download the masked image' },
  ],
  tips: [
    'All work happens in your browser - nothing uploads',
    'Max file size is 10MB',
    'You can undo up to 25 steps',
    'Use zoom to work on small details',
  ],
  troubleshooting: [
    {
      problem: 'File not loading',
      solution: 'Check file size (max 10MB) and format (PNG, JPEG, WebP)',
    },
    { problem: 'Masks not appearing', solution: 'Make sure to click or drag on the image area' },
    { problem: 'Download not working', solution: 'Try a different format (PNG, JPEG, or WebP)' },
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
        <Shield className="w-6 h-6 text-cyan-400" />
        <h3 className="text-xl font-bold text-white">{toolGuide.title}</h3>
      </div>

      {/* Steps */}
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

      {/* Tips */}
      <div className="space-y-2 mb-6">
        <h4 className="text-sm font-semibold text-gray-300">Tips</h4>
        <div className="bg-white/5 rounded-lg p-3 space-y-1">
          {toolGuide.tips.map((tip, index) => (
            <p key={index} className="text-xs text-gray-300">
              • {tip}
            </p>
          ))}
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
        <p className="text-xs text-green-400">
          <strong>100% Private:</strong> Everything happens in your browser. No data leaves your
          device.
        </p>
      </div>
    </div>
  )
}
