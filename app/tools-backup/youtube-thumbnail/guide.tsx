import { X, Youtube, Download, Image, Camera } from 'lucide-react'

export const toolGuide = {
  title: 'How to use YouTube Thumbnail Downloader',
  steps: [
    { icon: '1', text: 'Copy YouTube video URL' },
    { icon: '2', text: 'Paste URL in the input field' },
    { icon: '3', text: 'Select quality (HD recommended)' },
    { icon: '4', text: 'Download thumbnail image' }
  ],
  tips: [
    'Max quality: 1280x720 (HD)',
    'Works with shorts and regular videos',
    'All YouTube URLs supported',
    'Right-click to save on desktop'
  ],
  troubleshooting: [
    { problem: 'URL not working', solution: 'Check if video is public' },
    { problem: 'Low quality image', solution: 'Select maximum resolution option' },
    { problem: 'Download failed', solution: 'Try different browser or clear cache' }
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
        <Youtube className="w-6 h-6 text-red-500" />
        <h3 className="text-xl font-bold text-white">{toolGuide.title}</h3>
      </div>
      
      <div className="space-y-3 mb-6">
        <h4 className="text-sm font-semibold text-gray-300">Steps</h4>
        {toolGuide.steps.map((step, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs text-red-500 font-semibold">{step.icon}</span>
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
      
      <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
        <p className="text-xs text-red-400">
          <Camera className="w-3 h-3 inline mr-1" />
          <strong>Tip:</strong> Use for thumbnail inspiration and analysis!
        </p>
      </div>
    </div>
  )
}