import { X, Type, FileText, Copy, Layout, Moon, Download, Zap, Keyboard } from 'lucide-react'

export const toolGuide = {
  title: 'How to use Lorem Ipsum Generator',
  steps: [
    { icon: '1', text: 'Choose generation type (words, sentences, paragraphs)' },
    { icon: '2', text: 'Set amount with slider or use quick presets' },
    { icon: '3', text: 'Select output format (Text, HTML, Markdown, JSON)' },
    { icon: '4', text: 'Generate, copy, or download instantly' },
  ],
  tips: [
    'Toggle dark mode for comfortable late-night work',
    'Use keyboard shortcuts for faster workflow (Ctrl+Enter to generate)',
    'Download in multiple formats for different use cases',
    'Auto-generate mode updates text as you change settings',
    'Share URL with parameters to recreate exact settings',
    'Works offline once installed as PWA',
    'API available for programmatic generation',
  ],
  features: [
    {
      icon: Moon,
      title: 'Dark Mode',
      description: 'Easy on the eyes for night work',
    },
    {
      icon: Download,
      title: 'Download',
      description: 'Save in TXT, HTML, MD, or JSON',
    },
    {
      icon: Zap,
      title: 'Quick Presets',
      description: 'One-click common amounts',
    },
    {
      icon: Keyboard,
      title: 'Shortcuts',
      description: 'Ctrl+Enter to generate, Ctrl+Shift+C to copy',
    },
  ],
  troubleshooting: [
    { problem: 'Need different style', solution: 'Select a theme (Professional, Legal, Medical, Tech) - coming soon!' },
    { problem: 'Want specific format', solution: 'Use format selector and download button for TXT, HTML, Markdown, or JSON' },
    { problem: 'Repetitive workflow', solution: 'Enable auto-generate mode or use keyboard shortcuts (Ctrl+Enter)' },
    { problem: 'Need API access', solution: 'Use /api/lorem endpoint with query parameters - see documentation' },
    { problem: 'Want to share settings', solution: 'Click Share button to copy URL with current parameters' },
  ],
}

interface ToolGuideProps {
  onClose?: () => void
}

export default function ToolGuide({ onClose }: ToolGuideProps) {
  return (
    <div className="bg-gray-900/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl p-6 border border-gray-700 dark:border-white/20 max-w-md w-full relative shadow-2xl">
      {/* Close button - positioned outside title area */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 p-2 bg-red-500 hover:bg-red-600 rounded-full transition-colors shadow-lg z-10"
          aria-label="Close guide"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      )}

      {/* Header with responsive title */}
      <div className="flex items-start gap-3 mb-6 pr-2">
        <Type className="w-6 h-6 text-purple-400 flex-shrink-0 mt-0.5" />
        <h3 className="text-lg sm:text-xl font-bold text-white leading-tight">{toolGuide.title}</h3>
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
        <h4 className="text-sm font-semibold text-gray-300">Features & Tips</h4>
        <div className="bg-gray-800/80 rounded-lg p-3 space-y-1">
          {toolGuide.tips.map((tip, index) => (
            <p key={index} className="text-xs text-gray-300">
              • {tip}
            </p>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {toolGuide.features.map((feature, index) => (
          <div key={index} className="bg-gray-800/80 rounded-lg p-3 border border-gray-700">
            <feature.icon className="w-5 h-5 text-purple-400 mb-2" />
            <h5 className="text-xs font-semibold text-white mb-1">{feature.title}</h5>
            <p className="text-xxs text-gray-400">{feature.description}</p>
          </div>
        ))}
      </div>

      <div className="p-3 bg-purple-500/20 rounded-lg border border-purple-500/30">
        <p className="text-xs text-purple-300">
          <FileText className="w-3 h-3 inline mr-1" />
          <strong>History:</strong> Used in printing since the 1500s!
        </p>
      </div>
    </div>
  )
}