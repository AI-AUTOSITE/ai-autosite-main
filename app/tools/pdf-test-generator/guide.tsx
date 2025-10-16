import { X, FileText, Download, CheckCircle, AlertCircle } from 'lucide-react'

export const toolGuide = {
  title: 'How to use PDF Test Generator',
  steps: [
    { icon: '1', text: 'Choose PDF size (Short/Medium/Long)' },
    { icon: '2', text: 'Click Generate button' },
    { icon: '3', text: 'PDF downloads automatically' },
    { icon: '4', text: 'Use for testing your PDF tools' },
  ],
  tips: [
    'Short PDF: Quick validation testing',
    'Medium PDF: Realistic document testing',
    'Long PDF: Comprehensive stress testing',
    'All PDFs include structured content',
  ],
  troubleshooting: [
    { problem: 'Download not starting', solution: 'Check browser download settings' },
    { problem: 'PDF library not loading', solution: 'Refresh page and wait for library' },
    { problem: 'Generation fails', solution: 'Try a different browser or clear cache' },
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
        <FileText className="w-6 h-6 text-green-400" />
        <h3 className="text-xl font-bold text-white">{toolGuide.title}</h3>
      </div>

      {/* Steps Section */}
      <div className="space-y-3 mb-6">
        <h4 className="text-sm font-semibold text-gray-300">Steps</h4>
        {toolGuide.steps.map((step, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs text-green-400 font-semibold">{step.icon}</span>
            </div>
            <p className="text-sm text-gray-300">{step.text}</p>
          </div>
        ))}
      </div>

      {/* Features Section */}
      <div className="space-y-2 mb-6">
        <h4 className="text-sm font-semibold text-gray-300">Features</h4>
        <div className="bg-white/5 rounded-lg p-3 space-y-1">
          {toolGuide.tips.map((tip, index) => (
            <p key={index} className="text-xs text-gray-300 flex items-start">
              <span className="text-gray-500 mr-2">•</span>
              <span>{tip}</span>
            </p>
          ))}
        </div>
      </div>

      {/* Troubleshooting Section */}
      <div className="space-y-2 mb-6">
        <h4 className="text-sm font-semibold text-gray-300">Troubleshooting</h4>
        <div className="space-y-2">
          {toolGuide.troubleshooting.map((item, index) => (
            <div key={index} className="bg-red-500/5 rounded-lg p-2 border border-red-500/10">
              <p className="text-xs text-red-400 font-medium mb-1">
                <AlertCircle className="w-3 h-3 inline mr-1" />
                {item.problem}
              </p>
              <p className="text-xs text-gray-300 pl-4">
                {item.solution}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Fun Fact */}
      <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
        <p className="text-xs text-green-400">
          <Download className="w-3 h-3 inline mr-1" />
          Fun fact: Each PDF is generated with realistic business content!
        </p>
      </div>
    </div>
  )
}