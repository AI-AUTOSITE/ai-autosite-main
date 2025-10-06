import { X, FileText, Database, Download, Shield } from 'lucide-react'

export const toolGuide = {
  title: 'How to use PDF to Data Converter',
  steps: [
    { icon: '1', text: 'Drop or select your PDF file' },
    { icon: '2', text: 'AI extracts tables automatically' },
    { icon: '3', text: 'Download as CSV or Excel' },
    { icon: '4', text: 'Process unlimited files for free' },
  ],
  tips: [
    'Supports PDFs up to 10MB',
    'Extracts tables with high accuracy',
    'Download in both CSV and Excel formats',
    'All processing happens securely',
  ],
  troubleshooting: [
    {
      problem: 'File too large',
      solution: 'Maximum file size is 10MB. Try compressing your PDF first',
    },
    { problem: 'No tables found', solution: 'PDF must contain structured table data' },
    {
      problem: 'Extraction failed',
      solution: 'Try a different PDF or check if tables are scanned images',
    },
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
        <FileText className="w-6 h-6 text-cyan-400" />
        <h3 className="text-xl font-bold text-white">{toolGuide.title}</h3>
      </div>

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

      <div className="space-y-2 mb-6">
        <h4 className="text-sm font-semibold text-gray-300">Features</h4>
        <div className="bg-white/5 rounded-lg p-3 space-y-1">
          {toolGuide.tips.map((tip, index) => (
            <p key={index} className="text-xs text-gray-300">
              • {tip}
            </p>
          ))}
        </div>
      </div>

      <div className="space-y-2 mb-6">
        <h4 className="text-sm font-semibold text-gray-300">Troubleshooting</h4>
        <div className="space-y-2">
          {toolGuide.troubleshooting.map((item, index) => (
            <div key={index} className="bg-white/5 rounded-lg p-3">
              <p className="text-xs font-semibold text-cyan-400 mb-1">{item.problem}</p>
              <p className="text-xs text-gray-400">{item.solution}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
        <p className="text-xs text-green-400">
          <Shield className="w-3 h-3 inline mr-1" />
          Your files are never stored. Processing is instant and private.
        </p>
      </div>
    </div>
  )
}
