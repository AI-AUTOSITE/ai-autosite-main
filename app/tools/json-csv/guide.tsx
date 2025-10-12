import { X, FileJson, Shield } from 'lucide-react'

export const toolGuide = {
  title: 'How to use JSON to CSV Converter',
  steps: [
    { icon: '1', text: 'Paste your JSON data or upload a file' },
    { icon: '2', text: 'Review the automatic field detection' },
    { icon: '3', text: 'Click Convert to transform the data' },
    { icon: '4', text: 'Download CSV or copy to clipboard' },
  ],
  tips: [
    'Handles nested JSON structures automatically',
    'Works with arrays and objects',
    'Preview before downloading',
    'All processing happens in your browser',
  ],
  troubleshooting: [
    { problem: 'Invalid JSON error', solution: 'Check for missing quotes or commas in your JSON' },
    { problem: 'Empty result', solution: 'Ensure your JSON has valid data structure' },
    { problem: 'Missing fields', solution: 'Check if your JSON uses consistent field names' },
  ],
}

interface ToolGuideProps {
  onClose?: () => void
}

export default function ToolGuide({ onClose }: ToolGuideProps) {
  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 max-h-[80vh] overflow-hidden flex flex-col relative w-full max-w-2xl">
      {/* Header */}
      <div className="p-6 border-b border-white/10 relative">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-2 right-2 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors z-10"
            aria-label="Close guide"
          >
            <X className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>
        )}

        <div className="flex items-center gap-2 pr-12">
          <FileJson className="w-6 h-6 text-purple-400 flex-shrink-0" />
          <h3 className="text-xl font-bold text-white">{toolGuide.title}</h3>
        </div>
      </div>

      {/* Content - Scrollable with custom scrollbar */}
      <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
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
          <h4 className="text-sm font-semibold text-gray-300">Pro Tips</h4>
          <div className="bg-white/5 rounded-lg p-3 space-y-1">
            {toolGuide.tips.map((tip, index) => (
              <p key={index} className="text-xs text-gray-300">
                - {tip}
              </p>
            ))}
          </div>
        </div>

        <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
          <p className="text-xs text-green-400">
            <Shield className="w-3 h-3 inline mr-1" />
            <strong>100% Private:</strong> No data leaves your browser.
          </p>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        /* Firefox */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.2) rgba(255, 255, 255, 0.05);
        }
      `}</style>
    </div>
  )
}