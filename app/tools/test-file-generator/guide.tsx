import { X, FileText, Sliders, Download, AlertCircle } from 'lucide-react'

export const toolGuide = {
  title: 'How to use Test File Generator',
  steps: [
    { icon: '1', text: 'Choose language and text amount' },
    { icon: '2', text: 'Select image type and size' },
    { icon: '3', text: 'Set target file size (0.1-10 MB)' },
    { icon: '4', text: 'Preview and download PDF' }
  ],
  tips: [
    'Real-time preview updates automatically',
    'Filename includes timestamp (never overwrites)',
    'All processing happens in browser',
    'Perfect for upload and performance testing'
  ],
  troubleshooting: [
    { problem: 'Preview shows blank', solution: 'Wait 2-3 seconds for generation' },
    { problem: 'File size not exact', solution: 'Size is estimated, actual may vary ±10%' },
    { problem: 'Download failed', solution: 'Try smaller file size or different browser' }
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
        <FileText className="w-6 h-6 text-cyan-500" />
        <h3 className="text-xl font-bold text-white">{toolGuide.title}</h3>
      </div>
      
      <div className="space-y-3 mb-6">
        <h4 className="text-sm font-semibold text-gray-300">Steps</h4>
        {toolGuide.steps.map((step, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs text-cyan-500 font-semibold">{step.icon}</span>
            </div>
            <p className="text-sm text-gray-300">{step.text}</p>
          </div>
        ))}
      </div>
      
      <div className="space-y-2 mb-6">
        <h4 className="text-sm font-semibold text-gray-300">Features</h4>
        <div className="bg-white/5 rounded-lg p-3 space-y-1">
          {toolGuide.tips.map((tip, index) => (
            <p key={index} className="text-xs text-gray-300">• {tip}</p>
          ))}
        </div>
      </div>
      
      <div className="space-y-2 mb-6">
        <h4 className="text-sm font-semibold text-gray-300">Troubleshooting</h4>
        {toolGuide.troubleshooting.map((item, index) => (
          <div key={index} className="bg-white/5 rounded-lg p-3">
            <p className="text-xs font-medium text-cyan-400 mb-1">
              <AlertCircle className="w-3 h-3 inline mr-1" />
              {item.problem}
            </p>
            <p className="text-xs text-gray-300">{item.solution}</p>
          </div>
        ))}
      </div>
      
      <div className="p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
        <p className="text-xs text-cyan-400">
          <Sliders className="w-3 h-3 inline mr-1" />
          <strong>Pro Tip:</strong> Use "Hard to Process" images to stress test your systems!
        </p>
      </div>
    </div>
  )
}